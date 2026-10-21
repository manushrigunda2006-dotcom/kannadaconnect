import type { PracticeProgress, AppSettings, CustomCollection } from '../types';

const SAVED_KEY = 'kannadaconnect_saved_phrases';
const PROGRESS_KEY = 'kannadaconnect_practice_progress';
const SETTINGS_KEY = 'kannadaconnect_app_settings';
const ONBOARDED_KEY = 'kannadaconnect_onboarded_flag';

// Migration fallback for previous keys if any exist
const OLD_SAVED_KEY = 'namma_saved_phrases';
const OLD_PROGRESS_KEY = 'namma_practice_progress';

const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getSavedPhraseIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY) || localStorage.getItem(OLD_SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to parse saved phrases from localStorage', e);
    return [];
  }
};

export const toggleSavePhrase = (id: string): string[] => {
  if (typeof window === 'undefined') return [];
  const current = getSavedPhraseIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn('Failed to save to localStorage', e);
  }
  return next;
};

export const clearSavedPhrases = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVED_KEY);
    localStorage.removeItem(OLD_SAVED_KEY);
  } catch (e) {
    console.warn('Failed to clear saved phrases', e);
  }
};

// ================= PROGRESS & STATS =================

const getDefaultProgress = (): PracticeProgress => {
  return {
    practicedPhraseIds: [],
    dailyGoal: 5,
    streakDays: 1,
    lastPracticedDate: getTodayString(),
    xp: 0,
    completedScenarioIds: [],
    quizStats: {
      totalAttempted: 0,
      totalCorrect: 0,
    },
    unlockedBadgeIds: [],
    customCollections: [
      {
        id: 'coll-default',
        name: 'Bengaluru Commute Essentials',
        description: 'Key phrases for daily BMTC bus and Namma Metro rides',
        phraseIds: ['tr-01', 'tr-02', 'tr-03', 'tr-04'],
        createdAt: Date.now(),
      },
    ],
    historyLog: [],
  };
};

export const getPracticeProgress = (): PracticeProgress => {
  const defaultProgress = getDefaultProgress();
  if (typeof window === 'undefined') return defaultProgress;

  try {
    const raw = localStorage.getItem(PROGRESS_KEY) || localStorage.getItem(OLD_PROGRESS_KEY);
    if (!raw) return defaultProgress;

    const parsed: PracticeProgress = JSON.parse(raw);
    const today = getTodayString();

    // Streak validation across dates
    if (parsed.lastPracticedDate !== today) {
      const last = new Date(parsed.lastPracticedDate).getTime();
      const current = new Date(today).getTime();
      const diffDays = Math.round((current - last) / (1000 * 3600 * 24));

      let nextStreak = parsed.streakDays || 1;
      if (diffDays > 1) {
        nextStreak = 1;
      }

      return {
        ...defaultProgress,
        ...parsed,
        lastPracticedDate: today,
        streakDays: nextStreak,
        practicedPhraseIds: diffDays >= 1 ? [] : parsed.practicedPhraseIds || [],
      };
    }

    return {
      ...defaultProgress,
      ...parsed,
      quizStats: parsed.quizStats || { totalAttempted: 0, totalCorrect: 0 },
      completedScenarioIds: parsed.completedScenarioIds || [],
      unlockedBadgeIds: parsed.unlockedBadgeIds || [],
      customCollections: parsed.customCollections || defaultProgress.customCollections,
    };
  } catch (e) {
    console.warn('Failed to parse progress from localStorage', e);
    return defaultProgress;
  }
};

export const saveProgress = (progress: PracticeProgress): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress to localStorage', e);
  }
};

export const markPhrasePracticed = (
  id: string
): { progress: PracticeProgress; isNewPractice: boolean; goalCompletedJustNow: boolean } => {
  const current = getPracticeProgress();
  const today = getTodayString();
  const alreadyPracticedToday = current.practicedPhraseIds.includes(id);

  const prevCount = current.practicedPhraseIds.length;
  const newPracticedList = alreadyPracticedToday
    ? current.practicedPhraseIds
    : [...current.practicedPhraseIds, id];

  const nowCount = newPracticedList.length;
  const goalCompletedJustNow = prevCount < current.dailyGoal && nowCount >= current.dailyGoal;

  // Add 10 XP per unique practice
  const addedXp = alreadyPracticedToday ? 2 : 10;
  const nextXp = current.xp + addedXp;

  // Check badges
  const unlocked = [...current.unlockedBadgeIds];
  if (!unlocked.includes('badge-first-word') && newPracticedList.length >= 1) {
    unlocked.push('badge-first-word');
  }
  if (!unlocked.includes('badge-auto-master') && newPracticedList.filter((p) => p.startsWith('tr-')).length >= 5) {
    unlocked.push('badge-auto-master');
  }
  if (!unlocked.includes('badge-market-bargainer') && newPracticedList.filter((p) => p.startsWith('sh-')).length >= 5) {
    unlocked.push('badge-market-bargainer');
  }

  const updatedProgress: PracticeProgress = {
    ...current,
    practicedPhraseIds: newPracticedList,
    lastPracticedDate: today,
    xp: nextXp,
    unlockedBadgeIds: unlocked,
    historyLog: [
      { phraseId: id, timestamp: Date.now(), action: 'practiced' },
      ...(current.historyLog || []).slice(0, 49),
    ],
  };

  saveProgress(updatedProgress);

  return {
    progress: updatedProgress,
    isNewPractice: !alreadyPracticedToday,
    goalCompletedJustNow,
  };
};

export const recordScenarioCompletion = (scenarioId: string, score: number): PracticeProgress => {
  const current = getPracticeProgress();
  const alreadyCompleted = current.completedScenarioIds.includes(scenarioId);
  const updatedScenarioIds = alreadyCompleted
    ? current.completedScenarioIds
    : [...current.completedScenarioIds, scenarioId];

  const earnedXp = score * 15; // e.g. 3 correct = 45 XP
  const unlocked = [...current.unlockedBadgeIds];
  if (!unlocked.includes('badge-roleplay-ace') && updatedScenarioIds.length >= 1) {
    unlocked.push('badge-roleplay-ace');
  }

  const updatedProgress: PracticeProgress = {
    ...current,
    completedScenarioIds: updatedScenarioIds,
    xp: current.xp + earnedXp,
    unlockedBadgeIds: unlocked,
  };

  saveProgress(updatedProgress);
  return updatedProgress;
};

export const recordQuizResult = (
  attempted: number,
  correct: number,
  earnedXp: number
): PracticeProgress => {
  const current = getPracticeProgress();
  const totalAttempted = (current.quizStats?.totalAttempted || 0) + attempted;
  const totalCorrect = (current.quizStats?.totalCorrect || 0) + correct;

  const unlocked = [...current.unlockedBadgeIds];
  const accuracy = Math.round((correct / Math.max(1, attempted)) * 100);
  if (accuracy >= 80 && !unlocked.includes('badge-quiz-champion')) {
    unlocked.push('badge-quiz-champion');
  }

  const updatedProgress: PracticeProgress = {
    ...current,
    xp: current.xp + earnedXp,
    quizStats: {
      totalAttempted,
      totalCorrect,
    },
    unlockedBadgeIds: unlocked,
  };

  saveProgress(updatedProgress);
  return updatedProgress;
};

export const setDailyGoal = (goal: number): PracticeProgress => {
  const current = getPracticeProgress();
  const updated: PracticeProgress = {
    ...current,
    dailyGoal: Math.max(1, Math.min(20, goal)),
  };
  saveProgress(updated);
  return updated;
};

export const resetPracticeProgress = (): PracticeProgress => {
  const fresh = getDefaultProgress();
  saveProgress(fresh);
  return fresh;
};

// Judge Demo Profile Loader
export const loadJudgeDemoProfile = (): PracticeProgress => {
  const today = getTodayString();
  const demoProfile: PracticeProgress = {
    practicedPhraseIds: [
      'tr-01', 'tr-02', 'tr-03', 'tr-04', 'tr-05',
      'sh-01', 'sh-02', 'sh-03', 'sh-04',
      'tv-01', 'tv-02', 'tv-03',
      'hc-01', 'hc-02',
      'ed-01', 'ed-02',
      'wk-01', 'wk-02', 'wk-03',
    ],
    dailyGoal: 5,
    streakDays: 4,
    lastPracticedDate: today,
    xp: 420,
    completedScenarioIds: ['sc-auto-ride', 'sc-vegetable-market', 'sc-bmtc-bus'],
    quizStats: {
      totalAttempted: 15,
      totalCorrect: 13,
    },
    unlockedBadgeIds: [
      'badge-first-word',
      'badge-auto-master',
      'badge-roleplay-ace',
      'badge-quiz-champion',
      'badge-streak-keeper',
    ],
    customCollections: [
      {
        id: 'coll-indiranagar',
        name: 'Indiranagar Metro & Market Weekend',
        description: 'Auto hailing and fruit market phrases',
        phraseIds: ['tr-01', 'tr-02', 'sh-01', 'sh-04'],
        createdAt: Date.now() - 86400000,
      },
      {
        id: 'coll-workplace',
        name: 'Office Tea Breaks & Greetings',
        description: 'Phrases to connect with team members',
        phraseIds: ['wk-01', 'wk-02', 'wk-03', 'wk-06'],
        createdAt: Date.now() - 43200000,
      },
    ],
    historyLog: [
      { phraseId: 'tr-01', timestamp: Date.now() - 3600000, action: 'practiced' },
      { phraseId: 'sh-01', timestamp: Date.now() - 7200000, action: 'practiced' },
      { phraseId: 'wk-02', timestamp: Date.now() - 10800000, action: 'practiced' },
    ],
  };

  saveProgress(demoProfile);
  // Also bookmark 4 key phrases
  const demoSaved = ['tr-01', 'tr-02', 'sh-01', 'tv-01'];
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(demoSaved));
  } catch {
    // ignore
  }

  return demoProfile;
};

// ================= CUSTOM COLLECTIONS (TRIP BACKPACK) =================

export const saveCustomCollection = (name: string, description: string, phraseIds: string[]): PracticeProgress => {
  const current = getPracticeProgress();
  const newCol: CustomCollection = {
    id: `coll-${Date.now()}`,
    name,
    description,
    phraseIds,
    createdAt: Date.now(),
  };

  const updated: PracticeProgress = {
    ...current,
    customCollections: [newCol, ...current.customCollections],
  };
  saveProgress(updated);
  return updated;
};

export const deleteCustomCollection = (id: string): PracticeProgress => {
  const current = getPracticeProgress();
  const updated: PracticeProgress = {
    ...current,
    customCollections: current.customCollections.filter((c) => c.id !== id),
  };
  saveProgress(updated);
  return updated;
};

// ================= APP SETTINGS =================

export const getDefaultSettings = (): AppSettings => ({
  language: 'en',
  difficultyFilter: 'all',
  speechRate: 0.85,
  reducedMotion: false,
  highContrast: false,
  autoPlayAudio: false,
});

export const getAppSettings = (): AppSettings => {
  const def = getDefaultSettings();
  if (typeof window === 'undefined') return def;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...def, ...JSON.parse(raw) } : def;
  } catch {
    return def;
  }
};

export const saveAppSettings = (settings: AppSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
};

// ================= FIRST VISIT ONBOARDING =================

export const hasCompletedOnboarding = (): boolean => {
  if (typeof window === 'undefined') return true;
  return Boolean(localStorage.getItem(ONBOARDED_KEY));
};

export const setCompletedOnboarding = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ONBOARDED_KEY, 'true');
};
