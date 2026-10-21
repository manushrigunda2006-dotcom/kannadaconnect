import React from 'react';
import type { PracticeProgress, Phrase } from '../types';
import { Award, Target, Flame, RotateCcw, CheckCircle2, Sparkles, X, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticeTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  progress: PracticeProgress;
  phrases: Phrase[];
  onResetProgress: () => void;
  onUpdateGoal: (newGoal: number) => void;
  onSelectSituation: (sitId: string) => void;
}

export const PracticeTracker: React.FC<PracticeTrackerProps> = ({
  isOpen,
  onClose,
  progress,
  phrases,
  onResetProgress,
  onUpdateGoal,
  onSelectSituation,
}) => {
  if (!isOpen) return null;

  const count = progress.practicedPhraseIds.length;
  const goal = progress.dailyGoal;
  const percentage = Math.min(100, Math.round((count / goal) * 100));
  const isGoalCompleted = count >= goal;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1B4332', '#84CC16', '#F59E0B', '#2D6A4F'],
    });
  };

  // Find phrases that were practiced
  const practicedPhrases = phrases.filter((p) =>
    progress.practicedPhraseIds.includes(p.id)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="practice-tracker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-[#FDFBF7] rounded-3xl border border-stone-300 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="practice-tracker-title" className="text-xl font-bold text-stone-900">
                  Daily Practice Tracker
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200">
                  Demo
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Advances when you listen to or mark phrases as practiced.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Close practice tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Progress Ring & Stats */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            {/* Visual Ring */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-stone-100"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`${isGoalCompleted ? 'stroke-amber-500' : 'stroke-emerald-800'} transition-all duration-500`}
                  strokeWidth="10"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * percentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-stone-900 font-mono">
                  {percentage}%
                </span>
                <span className="text-[10px] text-stone-400 font-bold uppercase">
                  {count}/{goal} done
                </span>
              </div>
            </div>

            {/* Stats description */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold">
                <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
                <span>{progress.streakDays} Day Practice Streak</span>
              </div>
              <h3 className="text-lg font-bold text-emerald-950">
                {isGoalCompleted
                  ? 'ಶಭಾಷ್! Daily Goal Completed!'
                  : `${goal - count} more ${goal - count === 1 ? 'phrase' : 'phrases'} to complete your goal`}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Consistency over perfection: speaking just a couple of real phrases every day builds
                muscle memory for the streets.
              </p>
            </div>
          </div>

          {/* Working Completion Celebration Banner */}
          {isGoalCompleted && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-lime-50 to-emerald-50 border border-amber-300 shadow-xs flex items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-950 text-sm">
                    ಅದ್ಭುತ! (Magnificent!) Daily Challenge Complete!
                  </h4>
                  <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                    You've practiced {count} Kannada phrases today. Ready to try one in real life?
                  </p>
                </div>
              </div>
              <button
                onClick={triggerCelebration}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                title="Celebrate again!"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Celebrate</span>
              </button>
            </div>
          )}

          {/* Friendly Daily Challenge Card */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Today's Mission
                </p>
                <h4 className="text-sm font-bold text-stone-900">
                  Master 1 Transport phrase for Bengaluru autos!
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  "Namaskāra, Indiranagarakke barthīrā?" or "Mīṭar hāki banni sar"
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onSelectSituation('transport');
              }}
              className="shrink-0 flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 transition-colors"
            >
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Practiced Phrases List for Today */}
          {practicedPhrases.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Phrases Practiced Today ({practicedPhrases.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {practicedPhrases.map((phrase) => (
                  <div
                    key={phrase.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 text-xs"
                  >
                    <div>
                      <p className="font-kannada font-bold text-sm text-emerald-950">
                        {phrase.kannada}
                      </p>
                      <p className="text-stone-500 font-mono text-[11px]">{phrase.romanized}</p>
                    </div>
                    <span className="font-semibold text-stone-700 max-w-[160px] truncate text-right">
                      {phrase.english}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goal Settings & Reset Controls */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Goal selector */}
            <div className="flex items-center gap-2">
              <span className="text-stone-600 font-medium">Daily Goal:</span>
              <div className="flex items-center gap-1">
                {[3, 5, 8, 10].map((g) => (
                  <button
                    key={g}
                    onClick={() => onUpdateGoal(g)}
                    className={`px-2.5 py-1 rounded-lg font-bold font-mono transition-colors ${
                      progress.dailyGoal === g
                        ? 'bg-emerald-900 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={onResetProgress}
              className="inline-flex items-center gap-1 text-stone-500 hover:text-rose-600 transition-colors py-1 px-2 rounded-lg hover:bg-stone-100"
              title="Reset today's progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset today</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between text-xs text-stone-500">
          <span>Demo progress stored in your browser's localStorage</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-xl transition-colors"
          >
            Keep Practicing
          </button>
        </div>
      </div>
    </div>
  );
};
