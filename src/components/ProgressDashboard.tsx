import React, { useState } from 'react';
import type { PracticeProgress, Phrase, SituationId } from '../types';
import { SITUATIONS } from '../data/situations';
import { ACHIEVEMENT_BADGES } from '../data/quizzes';
import {
  Award,
  Flame,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Target,
  Clock,
  Layers,
  Database,
} from 'lucide-react';

interface ProgressDashboardProps {
  progress: PracticeProgress;
  phrases: Phrase[];
  onResetProgress: () => void;
  onLoadJudgeDemo: () => void;
  onUpdateGoal: (goal: number) => void;
  onSelectSituation: (sitId: SituationId) => void;
  onStartScenario: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  phrases,
  onResetProgress,
  onLoadJudgeDemo,
  onUpdateGoal,
  onSelectSituation,
  onStartScenario,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Category completion rates
  const categoryStats = SITUATIONS.map((sit) => {
    const sitPhrases = phrases.filter((p) => p.situation === sit.id);
    const practicedCount = sitPhrases.filter((p) =>
      progress.practicedPhraseIds.includes(p.id)
    ).length;
    const total = sitPhrases.length || 1;
    const percentage = Math.round((practicedCount / total) * 100);

    return {
      situation: sit,
      total,
      practicedCount,
      percentage,
    };
  });

  // Calculate weak category for smart recommendation
  const sortedByLowest = [...categoryStats].sort((a, b) => a.percentage - b.percentage);
  const weakest = sortedByLowest[0];

  // Quiz accuracy
  const totalAttempted = progress.quizStats?.totalAttempted || 0;
  const totalCorrect = progress.quizStats?.totalCorrect || 0;
  const quizAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Recently practiced phrases
  const recentPhrases = (progress.historyLog || [])
    .slice(0, 5)
    .map((log) => phrases.find((p) => p.id === log.phraseId))
    .filter(Boolean) as Phrase[];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-blue-700" />
            Personal Learning Analytics
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Your Kannada Mastery Overview
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Real-time tracking of phrases practiced, role-play scenarios completed, and quiz accuracy.
          </p>
        </div>

        {/* Demo / Judge Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLoadJudgeDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all shadow-xs"
            title="Pre-populate realistic 4-day streak, 19 phrases, badges & scenarios"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Load Judge Demo Profile</span>
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Practiced</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {progress.practicedPhraseIds.length}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">out of {phrases.length} phrases</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {progress.streakDays}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">days consecutive</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">XP Points</span>
            <Trophy className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-blue-700">
            {progress.xp}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">experience earned</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Scenarios</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {progress.completedScenarioIds.length}
          </span>
          <button
            onClick={onStartScenario}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 block mt-0.5"
          >
            Play Simulator →
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Quiz Accuracy</span>
            <Target className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
            {quizAccuracy}%
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">{totalCorrect}/{totalAttempted} answered</span>
        </div>
      </div>

      {/* Daily Goal Configurator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs font-bold text-slate-800">Daily Learning Target</p>
            <p className="text-[11px] text-slate-500">Aim for a steady pace every day in Karnataka</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {[3, 5, 8, 10].map((goal) => (
            <button
              key={goal}
              onClick={() => onUpdateGoal(goal)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                progress.dailyGoal === goal
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {goal} phrases
            </button>
          ))}
        </div>
      </div>

      {/* Smart Recommendation Banner */}
      {weakest && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              Smart Learning Recommendation
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-sans">
              Strengthen Your {weakest.situation.titleEn} Kannada ({weakest.percentage}% Mastered)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              You have practiced {weakest.practicedCount} of {weakest.total} {weakest.situation.titleEn.toLowerCase()} phrases. Practicing these will boost your everyday confidence!
            </p>
          </div>

          <button
            onClick={() => onSelectSituation(weakest.situation.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-sm transition-all shrink-0"
          >
            <span>Practice {weakest.situation.titleEn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2-Column: Category Breakdown & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Real-World Situation Mastery</span>
          </h3>

          <div className="space-y-4">
            {categoryStats.map(({ situation, practicedCount, total, percentage }) => (
              <div key={situation.id}>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">
                    {situation.titleEn} <span className="text-slate-400 font-normal font-kannada">({situation.titleKn})</span>
                  </span>
                  <span className="font-mono text-slate-500">
                    {practicedCount}/{total} ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      percentage >= 80 ? 'bg-emerald-500' : percentage >= 40 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.max(4, percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Unlocked Badges ({progress.unlockedBadgeIds.length}/{ACHIEVEMENT_BADGES.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENT_BADGES.map((b) => {
              const isUnlocked = progress.unlockedBadgeIds.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                    isUnlocked
                      ? 'bg-amber-50/50 border-amber-200 text-slate-900'
                      : 'bg-slate-50/60 border-slate-200 opacity-60 text-slate-500'
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{b.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">
                      {b.name}
                    </h4>
                    <p className="text-[11px] font-kannada text-slate-600 font-medium">{b.kannadaName}</p>
                    <p className="text-[10px] text-slate-500 leading-snug mt-0.5">{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recently Practiced Phrases */}
      {recentPhrases.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Recently Practiced Phrases</span>
          </h3>
          <div className="divide-y divide-slate-100">
            {recentPhrases.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold font-kannada text-slate-900">{p.kannada}</p>
                  <p className="text-xs font-mono text-blue-800">{p.romanized}</p>
                  <p className="text-xs text-slate-500 italic">"{p.english}"</p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                  {p.situation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storage & Privacy Transparency Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5 leading-relaxed">
        <Database className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-slate-800">Local Browser Storage Notice:</span> All your learning progress, XP, streak counters, and saved pocketbook phrases are stored locally in your current browser using <code className="font-mono text-slate-700 bg-white px-1 py-0.5 rounded">localStorage</code>. No personal accounts or cloud sync are required.
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Reset All Practice Progress?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              This will clear your practiced phrases count, current streak, and XP. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
              >
                Yes, Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
