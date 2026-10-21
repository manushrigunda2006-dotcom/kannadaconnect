import React from 'react';
import { Bookmark, Sparkles, BookOpen, Award, Check } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  practicedCount: number;
  dailyGoal: number;
  onOpenPocketbook: () => void;
  onOpenSurprise: () => void;
  onOpenCultureGuide: () => void;
  onOpenProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  practicedCount,
  dailyGoal,
  onOpenPocketbook,
  onOpenSurprise,
  onOpenCultureGuide,
  onOpenProgress,
}) => {
  const goalAchieved = practicedCount >= dailyGoal;

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center shadow-sm border border-emerald-800">
            <span className="font-kannada font-bold text-2xl leading-none">ನ</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-emerald-950">ನಮ್ಮ</span>
              <span className="text-sm font-semibold tracking-wide uppercase text-emerald-800 font-sans">
                Namma
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">
              Situation-first Kannada companion
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Surprise Me Button */}
          <button
            onClick={onOpenSurprise}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 rounded-xl transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700"
            title="Random phrase from any situation"
            aria-label="Surprise me with a random Kannada phrase"
          >
            <Sparkles className="w-4 h-4 text-emerald-700 animate-pulse" />
            <span className="hidden md:inline">Surprise Me</span>
            <span className="md:hidden">Surprise</span>
          </button>

          {/* Culture Guide */}
          <button
            onClick={onOpenCultureGuide}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700"
            title="Essential Kannada survival grammar & numbers"
            aria-label="Open Kannada survival tips and grammar guide"
          >
            <BookOpen className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Survival Tips</span>
          </button>

          {/* Practice Progress Pill */}
          <button
            onClick={onOpenProgress}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700 ${
              goalAchieved
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
            }`}
            title="Daily practice progress (demo)"
            aria-label="Open daily practice progress tracker"
          >
            {goalAchieved ? (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <Award className="w-4 h-4 text-emerald-700" />
            )}
            <span className="text-xs font-mono font-bold">
              {practicedCount}/{dailyGoal}
            </span>
            <span className="hidden lg:inline text-xs font-normal text-stone-500">
              practiced
            </span>
          </button>

          {/* Pocketbook (Saved Phrases) */}
          <button
            onClick={onOpenPocketbook}
            className="relative flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-xl transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-700"
            aria-label={`Open pocketbook with ${savedCount} saved phrases`}
          >
            <Bookmark className="w-4 h-4 fill-emerald-100 text-emerald-100" />
            <span className="hidden sm:inline">Pocketbook</span>
            <span className="bg-emerald-700 text-white text-[11px] font-mono px-1.5 py-0.5 rounded-full font-bold ml-0.5">
              {savedCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
