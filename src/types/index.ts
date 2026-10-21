export type SituationId = 
  | 'transport'
  | 'shopping'
  | 'travel'
  | 'healthcare'
  | 'education'
  | 'workplace';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'essential';
export type UsageStyle = 'polite' | 'casual' | 'formal';
export type InterfaceLanguage = 'en' | 'kn' | 'hi' | 'te';

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
  difficulty: DifficultyLevel;
  usageStyle: UsageStyle;
  tip: string;
  tags: string[];
  context: string;
  pronunciationNotes?: string;
  audioLanguage?: string;
}

// Conversation Simulator (Role-play) Types
export interface ScenarioChoice {
  id: string;
  kannada: string;
  romanized: string;
  english: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ScenarioStep {
  id: string;
  speakerLine: {
    kannada: string;
    romanized: string;
    english: string;
  };
  userPrompt: string;
  hint: string;
  options: ScenarioChoice[];
}

export interface Scenario {
  id: string;
  title: string;
  kannadaTitle: string;
  situation: SituationId;
  difficulty: DifficultyLevel;
  description: string;
  character: {
    name: string;
    role: string;
    avatar: string;
    avatarBg: string;
  };
  steps: ScenarioStep[];
  culturalTakeaway: string;
}

// Quizzes & Challenges Types
export type QuizType = 'translation' | 'context' | 'fill_blank' | 'listening';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  situation: SituationId;
  prompt: string;
  kannadaText?: string;
  romanizedText?: string;
  audioText?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Badges
export interface AchievementBadge {
  id: string;
  name: string;
  kannadaName: string;
  description: string;
  icon: string;
  category: 'practice' | 'quiz' | 'scenario' | 'streak';
  threshold: number;
}

// Custom Collection (Trip Backpack)
export interface CustomCollection {
  id: string;
  name: string;
  description: string;
  phraseIds: string[];
  createdAt: number;
}

// Practice Progress
export interface PracticeProgress {
  practicedPhraseIds: string[];
  dailyGoal: number;
  streakDays: number;
  lastPracticedDate: string; // YYYY-MM-DD
  xp: number;
  completedScenarioIds: string[];
  quizStats: {
    totalAttempted: number;
    totalCorrect: number;
  };
  unlockedBadgeIds: string[];
  customCollections: CustomCollection[];
  historyLog: {
    phraseId: string;
    timestamp: number;
    action?: string;
  }[];
}

// App Settings
export interface AppSettings {
  language: InterfaceLanguage;
  difficultyFilter: 'all' | DifficultyLevel;
  speechRate: number; // 0.7, 0.85, 1.0
  reducedMotion: boolean;
  highContrast: boolean;
  autoPlayAudio: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

// User Profile & Authentication
export interface UserAccount {
  id: string;
  email: string;
  displayName: string;
  createdAt?: string;
  isGuest: boolean;
}

export type AuthMode = 'login' | 'signup' | 'forgot_password';

