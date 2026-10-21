export type SituationId = 
  | 'travel' 
  | 'shopping' 
  | 'education' 
  | 'healthcare' 
  | 'transport' 
  | 'workplace';

export interface Situation {
  id: SituationId;
  titleEn: string;
  titleKn: string;
  titlePhonetic: string;
  iconName: string;
  tagline: string;
  description: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  accentPill: string;
}

export interface Phrase {
  id: string;
  kannada: string;
  romanized: string;
  english: string;
  situation: SituationId;
  tip: string;
  tags: string[];
  context?: string;
  pronunciationNotes?: string;
}

export interface PracticeProgress {
  practicedPhraseIds: string[];
  dailyGoal: number;
  streakDays: number;
  lastPracticedDate: string; // YYYY-MM-DD
  historyLog: {
    phraseId: string;
    timestamp: number;
  }[];
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
