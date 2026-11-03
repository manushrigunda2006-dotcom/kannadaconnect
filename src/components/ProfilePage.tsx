import React, { useState } from 'react';
import type { UserAccount, PracticeProgress, Phrase } from '../types';
import { ACHIEVEMENT_BADGES } from '../data/quizzes';
import { updateUserDisplayName } from '../services/authService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import {
  Mail,
  Award,
  Flame,
  Trophy,
  Bookmark,
  CheckCircle2,
  Edit2,
  Check,
  X,
  LogOut,
  LogIn,
  Cloud,
  CloudOff,
  Target,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Volume2,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface ProfilePageProps {
  user: UserAccount | null;
  progress: PracticeProgress;
  savedPhrasesCount: number;
  phrases: Phrase[];
  onOpenAuthModal: () => void;
  onUpdateGoal: (newGoal: number) => void;
  onUserUpdated: (user: UserAccount) => void;
  onSignOut: () => void;
  onManualSync?: () => Promise<void>;
  onOpenPocketbook: () => void;
  onPlayAudio?: (phrase: Phrase) => void;
  onSelectTab: (tab: any) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  progress,
  savedPhrasesCount,
  phrases,
  onOpenAuthModal,
  onUpdateGoal,
  onUserUpdated,
  onSignOut,
  onManualSync,
  onOpenPocketbook,
  onPlayAudio,
  onSelectTab,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const configured = isSupabaseConfigured();
  const isGuest = !user || user.isGuest;

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }

    setNameError(null);
    setIsSavingName(true);

    try {
      if (user && !user.isGuest) {
        const result = await updateUserDisplayName(nameInput.trim());
        if (result.error) {
          setNameError(result.error);
        } else {
          onUserUpdated({ ...user, displayName: nameInput.trim() });
          setIsEditingName(false);
        }
      } else {
        // Guest mode display name
        if (user) {
          onUserUpdated({ ...user, displayName: nameInput.trim() });
        }
        setIsEditingName(false);
      }
    } catch (err: any) {
      setNameError(err?.message || 'Failed to update name');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSyncClick = async () => {
    if (!onManualSync || syncing) return;
    setSyncing(true);
    try {
      await onManualSync();
    } finally {
      setSyncing(false);
    }
  };

  // Practiced phrases objects
  const practicedPhrases = (progress.practicedPhraseIds || [])
    .map((id) => phrases.find((p) => p.id === id))
    .filter(Boolean) as Phrase[];

  // Quiz accuracy
  const totalAttempted = progress.quizStats?.totalAttempted || 0;
  const totalCorrect = progress.quizStats?.totalCorrect || 0;
  const quizAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* Official Judge Evaluation Alert Banner */}
      {user?.isDemo && (
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-orange-500/15 border-2 border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-xs border border-amber-500/30">
              ⚖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-900">
                  Hackathon Evaluation Session Active
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300">
                  Full Access
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Preloaded with <strong>19 practiced phrases</strong>, <strong>420 XP</strong>, <strong>3 completed scenarios</strong>, <strong>5 badges</strong>, and <strong>2 custom collections</strong>. All features are fully unlocked without payment or registration.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
              🛡️ Demo Data Safeguard: Active
            </span>
          </div>
        </div>
      )}

      {/* Top Banner Card: Profile Overview */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 mb-8 relative overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/60 via-amber-50/40 to-transparent rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Avatar Pill */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-900 to-indigo-800 text-amber-300 flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md border-2 border-amber-300/40 shrink-0">
              {user?.isDemo ? '⚖️' : user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'ಕ'}
            </div>

            <div>
              {/* Name (View or Inline Edit) */}
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1.5 text-lg font-bold text-slate-900 border border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                      placeholder="Enter your name"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                      title="Save name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setNameInput(user?.displayName || '');
                        setNameError(null);
                      }}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                      {user?.displayName || 'Guest Learner'}
                    </h1>
                    {!user?.isDemo && (
                      <button
                        onClick={() => {
                          setNameInput(user?.displayName || '');
                          setIsEditingName(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit display name"
                        aria-label="Edit display name"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {nameError && (
                <p className="text-xs text-rose-600 font-semibold mt-1">{nameError}</p>
              )}

              {/* Email / Guest Info */}
              <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.email || 'Guest Explorer (Local Browser Storage)'}</span>
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {user?.isDemo ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                    <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
                    Verified Judge Account (Demo)
                  </span>
                ) : isGuest ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <CloudOff className="w-3 h-3 text-amber-700" />
                    Guest Mode (Local Storage Only)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Cloud Sync Active
                  </span>
                )}

                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                  Target: {progress.dailyGoal} phrases/day
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-col items-stretch gap-2.5">
            {isGuest ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {onManualSync && (
                  <button
                    onClick={handleSyncClick}
                    disabled={syncing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition-all"
                    title="Force cloud sync"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    <span>Sync Now</span>
                  </button>
                )}
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Guest Warning & Sync Explanation Banner */}
        {isGuest && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
            <div className="flex items-start gap-2.5">
              <Cloud className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Guest Access is Active:</strong> You can practice phrases, take quizzes, and save bookmarks offline. To back up your data to the cloud and restore it across phones or laptops, create an account. When you sign in, all your guest progress will be automatically merged!
              </p>
            </div>
            <button
              onClick={onOpenAuthModal}
              className="text-xs font-bold px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto shrink-0"
            >
              Back Up Now
            </button>
          </div>
        )}
      </div>

      {/* Learning Preferences Card: Daily Goal & Settings */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              Daily Learning Target
            </h2>
          </div>
          <span className="text-xs font-bold text-blue-700 font-mono">
            {progress.dailyGoal} phrases / day
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-4">
          Set how many spoken Kannada phrases you aim to practice each day.
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          {[
            { value: 3, label: '3 Phrases', desc: 'Gentle (5 mins)' },
            { value: 5, label: '5 Phrases (Recommended)', desc: 'Standard (10 mins)' },
            { value: 10, label: '10 Phrases', desc: 'Fast Track (20 mins)' },
            { value: 15, label: '15 Phrases', desc: 'Immersion (30 mins)' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => onUpdateGoal(item.value)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border text-left ${
                progress.dailyGoal === item.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>{item.label}</div>
              <div
                className={`text-[10px] font-normal ${
                  progress.dailyGoal === item.value ? 'text-blue-100' : 'text-slate-500'
                }`}
              >
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Key Metric Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {/* Practiced Phrases */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Practiced
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
            {progress.practicedPhraseIds.length}
            <span className="text-xs font-medium text-slate-400 ml-1">/ {phrases.length}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {Math.round((progress.practicedPhraseIds.length / phrases.length) * 100)}% of phrasebook
          </p>
        </div>

        {/* Current Streak */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Streak
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
            {progress.streakDays}
            <span className="text-xs font-medium text-slate-400 ml-1">days</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Daily consistency</p>
        </div>

        {/* Total XP */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              XP Earned
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans font-mono">
            {progress.xp}
            <span className="text-xs font-medium text-slate-400 ml-1">XP</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Learning score</p>
        </div>

        {/* Quiz Accuracy */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Accuracy
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans font-mono">
            {quizAccuracy}%
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {totalCorrect}/{totalAttempted} answered
          </p>
        </div>

        {/* Scenarios Solved */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Role-Play
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
            {progress.completedScenarioIds.length}
            <span className="text-xs font-medium text-slate-400 ml-1">solved</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Interactive scenarios</p>
        </div>

        {/* Saved Phrases in Pocketbook */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Bookmarks
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Bookmark className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
            {savedPhrasesCount}
            <span className="text-xs font-medium text-slate-400 ml-1">phrases</span>
          </div>
          <button
            onClick={onOpenPocketbook}
            className="text-[10px] text-blue-700 hover:text-blue-900 font-bold mt-1 inline-flex items-center gap-0.5"
          >
            <span>Pocketbook</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Milestone Recognition</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
              Achievement Badges
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
            {progress.unlockedBadgeIds.length} / {ACHIEVEMENT_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENT_BADGES.map((badge) => {
            const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                    : 'bg-slate-50/50 border-slate-200/70 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-100 border border-amber-300 shadow-xs'
                        : 'bg-slate-200 border border-slate-300 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? badge.icon : '🔒'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {badge.name}
                      </h3>
                      {isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-amber-900 font-kannada font-semibold mt-0.5">
                      {badge.kannadaName}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practiced Phrases List Preview */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">
              Recently Practiced Spoken Phrases
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Review phrases you've listened to or practiced aloud.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('learn')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>Full Phrasebook</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {practicedPhrases.length > 0 ? (
          <div className="space-y-3">
            {practicedPhrases.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-kannada font-bold text-slate-900 text-sm sm:text-base">
                    {p.kannada}
                  </div>
                  <div className="text-xs text-blue-700 font-semibold font-mono truncate">
                    {p.romanized}
                  </div>
                  <div className="text-xs text-slate-600 truncate">"{p.english}"</div>
                </div>

                {onPlayAudio && (
                  <button
                    onClick={() => onPlayAudio(p)}
                    className="p-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 shadow-2xs transition-colors shrink-0"
                    title="Listen to pronunciation"
                    aria-label={`Play audio for ${p.romanized}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            No phrases practiced yet. Click on any phrase in the Phrasebook or tap "Surprise Me" to start practicing!
          </div>
        )}
      </div>

      {/* Supabase Integration & Security Architecture Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  Enterprise-Grade Cloud Architecture
                </h3>
                {configured ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Supabase Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Setup Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentication & Database via Supabase with Row Level Security (RLS)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{showSetupGuide ? 'Hide Details' : 'View Architecture'}</span>
            {showSetupGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showSetupGuide && (
          <div className="mt-5 pt-5 border-t border-slate-800 space-y-4 text-xs text-slate-300">
            <div>
              <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] mb-1">
                Security & Data Integrity Principles
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                <li><strong>No Plaintext Passwords:</strong> Passwords are never stored in localStorage, client state, or database tables. Handled securely by Supabase Auth with bcrypt hashing.</li>
                <li><strong>Safe Anon Client Key:</strong> Only the public <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200 font-mono">VITE_SUPABASE_ANON_KEY</code> is used in the frontend. Service-role keys are strictly excluded.</li>
                <li><strong>Row Level Security (RLS):</strong> The Postgres table <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200 font-mono">user_learning_profiles</code> enforces <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200 font-mono">auth.uid() = user_id</code>, guaranteeing users cannot read or write others' progress.</li>
                <li><strong>Automatic Deduplicating Merge:</strong> Seamlessly unions guest practiced phrases, bookmarks, XP, and streaks upon signing in.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] mb-1">
                Environment Variables (<code className="font-mono text-slate-200">.env.local</code> / Vercel)
              </h4>
              <div className="bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-amber-300 space-y-1 select-all border border-slate-800">
                <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
