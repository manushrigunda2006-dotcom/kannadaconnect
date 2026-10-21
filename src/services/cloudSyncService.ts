import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { PracticeProgress, CustomCollection } from '../types';
import {
  getPracticeProgress,
  getSavedPhraseIds,
  saveProgress,
} from '../utils/storage';

export interface CloudData {
  progress: PracticeProgress;
  savedPhraseIds: string[];
  updatedAt: string;
}

/**
 * Merges guest local data with cloud data without creating duplicates.
 */
export const mergeLearningData = (
  localProgress: PracticeProgress,
  localSavedIds: string[],
  remoteProgress: PracticeProgress | null,
  remoteSavedIds: string[] | null
): { progress: PracticeProgress; savedIds: string[] } => {
  if (!remoteProgress) {
    return {
      progress: localProgress,
      savedIds: localSavedIds,
    };
  }

  // 1. Practiced phrase IDs (set union)
  const practicedSet = new Set<string>([
    ...(localProgress.practicedPhraseIds || []),
    ...(remoteProgress.practicedPhraseIds || []),
  ]);

  // 2. Saved bookmark phrase IDs (set union)
  const savedSet = new Set<string>([
    ...(localSavedIds || []),
    ...(remoteSavedIds || []),
  ]);

  // 3. Completed scenarios (set union)
  const completedScenariosSet = new Set<string>([
    ...(localProgress.completedScenarioIds || []),
    ...(remoteProgress.completedScenarioIds || []),
  ]);

  // 4. Badges (set union)
  const badgesSet = new Set<string>([
    ...(localProgress.unlockedBadgeIds || []),
    ...(remoteProgress.unlockedBadgeIds || []),
  ]);

  // 5. Custom Collections (merged by ID and name)
  const collectionMap = new Map<string, CustomCollection>();
  (remoteProgress.customCollections || []).forEach((c) => collectionMap.set(c.id, c));
  (localProgress.customCollections || []).forEach((c) => {
    if (!collectionMap.has(c.id)) {
      collectionMap.set(c.id, c);
    }
  });

  // 6. History log (sorted and deduplicated)
  const combinedLog = [
    ...(localProgress.historyLog || []),
    ...(remoteProgress.historyLog || []),
  ];
  combinedLog.sort((a, b) => b.timestamp - a.timestamp);
  const seenTimestamps = new Set<number>();
  const deduplicatedLog = combinedLog.filter((item) => {
    if (seenTimestamps.has(item.timestamp)) return false;
    seenTimestamps.add(item.timestamp);
    return true;
  }).slice(0, 50);

  const mergedProgress: PracticeProgress = {
    practicedPhraseIds: Array.from(practicedSet),
    dailyGoal: Math.max(localProgress.dailyGoal || 5, remoteProgress.dailyGoal || 5),
    streakDays: Math.max(localProgress.streakDays || 1, remoteProgress.streakDays || 1),
    lastPracticedDate:
      (localProgress.lastPracticedDate > remoteProgress.lastPracticedDate)
        ? localProgress.lastPracticedDate
        : (remoteProgress.lastPracticedDate || localProgress.lastPracticedDate),
    xp: Math.max(localProgress.xp || 0, remoteProgress.xp || 0),
    completedScenarioIds: Array.from(completedScenariosSet),
    quizStats: {
      totalAttempted: Math.max(
        localProgress.quizStats?.totalAttempted || 0,
        remoteProgress.quizStats?.totalAttempted || 0
      ),
      totalCorrect: Math.max(
        localProgress.quizStats?.totalCorrect || 0,
        remoteProgress.quizStats?.totalCorrect || 0
      ),
    },
    unlockedBadgeIds: Array.from(badgesSet),
    customCollections: Array.from(collectionMap.values()),
    historyLog: deduplicatedLog,
  };

  return {
    progress: mergedProgress,
    savedIds: Array.from(savedSet),
  };
};

/**
 * Loads remote learning data for a user from Supabase.
 */
export const fetchCloudData = async (userId: string): Promise<CloudData | null> => {
  if (!supabase || !isSupabaseConfigured() || !userId) return null;

  try {
    // 1. Try querying the user_learning_profiles table
    const { data, error } = await supabase
      .from('user_learning_profiles')
      .select('progress, saved_phrase_ids, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data && data.progress) {
      return {
        progress: data.progress,
        savedPhraseIds: data.saved_phrase_ids || [],
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    }

    // 2. Fallback to Supabase user_metadata
    const { data: userData } = await supabase.auth.getUser();
    const meta = userData.user?.user_metadata || {};
    if (meta.cloud_progress) {
      return {
        progress: meta.cloud_progress,
        savedPhraseIds: meta.cloud_saved_ids || [],
        updatedAt: meta.cloud_updated_at || new Date().toISOString(),
      };
    }

    return null;
  } catch (err) {
    console.warn('Could not fetch cloud progress, falling back to local:', err);
    return null;
  }
};

/**
 * Saves learning data to Supabase (both table and user_metadata for resilience).
 */
export const saveCloudData = async (
  userId: string,
  progress: PracticeProgress,
  savedPhraseIds: string[]
): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured() || !userId) return false;

  const now = new Date().toISOString();

  try {
    // 1. Attempt upsert into user_learning_profiles table
    const { error } = await supabase.from('user_learning_profiles').upsert(
      {
        user_id: userId,
        progress,
        saved_phrase_ids: savedPhraseIds,
        updated_at: now,
      },
      { onConflict: 'user_id' }
    );

    // 2. Also persist in user_metadata as guaranteed fallback
    await supabase.auth.updateUser({
      data: {
        cloud_progress: progress,
        cloud_saved_ids: savedPhraseIds,
        cloud_updated_at: now,
      },
    });

    return !error;
  } catch (err) {
    console.warn('Could not sync to cloud table:', err);
    return false;
  }
};

/**
 * Full sync flow when a user logs in or signs up:
 * 1. Read local guest data from localStorage.
 * 2. Fetch any remote cloud data from Supabase.
 * 3. Merge both sets cleanly.
 * 4. Save merged result back to Supabase and update local storage.
 */
export const syncAndMergeOnLogin = async (
  userId: string
): Promise<{ progress: PracticeProgress; savedIds: string[] }> => {
  const localProgress = getPracticeProgress();
  const localSaved = getSavedPhraseIds();

  const remote = await fetchCloudData(userId);

  const merged = mergeLearningData(
    localProgress,
    localSaved,
    remote?.progress || null,
    remote?.savedPhraseIds || null
  );

  // Update local storage so UI is reactive
  saveProgress(merged.progress);
  try {
    localStorage.setItem('kannadaconnect_saved_phrases', JSON.stringify(merged.savedIds));
  } catch (e) {
    console.warn('Failed to update local saved phrases during merge', e);
  }

  // Push merged data to Supabase
  await saveCloudData(userId, merged.progress, merged.savedIds);

  return merged;
};
