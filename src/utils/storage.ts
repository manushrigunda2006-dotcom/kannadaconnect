import type { PracticeProgress } from '../types';

const SAVED_KEY = 'namma_saved_phrases';
const PROGRESS_KEY = 'namma_practice_progress';

const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getSavedPhraseIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
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
  } catch (e) {
    console.warn('Failed to clear saved phrases', e);
  }
};

export const getPracticeProgress = (): PracticeProgress => {
  const today = getTodayString();
  const defaultProgress: PracticeProgress = {
    practicedPhraseIds: [],
    dailyGoal: 5,
    streakDays: 1,
    lastPracticedDate: today,
    historyLog: [],
  };

  if (typeof window === 'undefined') return defaultProgress;

  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress;

    const parsed: PracticeProgress = JSON.parse(raw);
    
    // Check if streak is valid across days
    if (parsed.lastPracticedDate !== today) {
      // If practiced today, keep streak; if practiced yesterday, streak remains; if > 1 day gap, streak resets to 1
      const last = new Date(parsed.lastPracticedDate).getTime();
      const current = new Date(today).getTime();
      const diffDays = Math.round((current - last) / (1000 * 3600 * 24));
      
      let nextStreak = parsed.streakDays || 1;
      if (diffDays > 1) {
        nextStreak = 1;
      }
      
      return {
        ...parsed,
        lastPracticedDate: today,
        streakDays: nextStreak,
        // Reset daily practiced list on new calendar day
        practicedPhraseIds: diffDays >= 1 ? [] : parsed.practicedPhraseIds,
      };
    }

    return parsed;
  } catch (e) {
    console.warn('Failed to parse progress from localStorage', e);
    return defaultProgress;
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

  const updatedProgress: PracticeProgress = {
    ...current,
    practicedPhraseIds: newPracticedList,
    lastPracticedDate: today,
    historyLog: [
      { phraseId: id, timestamp: Date.now() },
      ...(current.historyLog || []).slice(0, 49), // retain last 50 events
    ],
  };

  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedProgress));
  } catch (e) {
    console.warn('Failed to save progress to localStorage', e);
  }

  return {
    progress: updatedProgress,
    isNewPractice: !alreadyPracticedToday,
    goalCompletedJustNow,
  };
};

export const resetPracticeProgress = (): PracticeProgress => {
  const today = getTodayString();
  const fresh: PracticeProgress = {
    practicedPhraseIds: [],
    dailyGoal: 5,
    streakDays: 1,
    lastPracticedDate: today,
    historyLog: [],
  };
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(fresh));
  } catch (e) {
    console.warn('Failed to reset progress', e);
  }
  return fresh;
};

export const setDailyGoal = (goal: number): PracticeProgress => {
  const current = getPracticeProgress();
  const updated: PracticeProgress = {
    ...current,
    dailyGoal: Math.max(1, Math.min(20, goal)),
  };
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save updated goal', e);
  }
  return updated;
};
