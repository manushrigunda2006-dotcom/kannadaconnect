import React from 'react';
import { BookOpen, Sparkles, RotateCcw, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenCultureGuide: () => void;
  onOpenSurprise: () => void;
  onOpenQuickHelp: () => void;
  onResetAllData: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCultureGuide,
  onOpenSurprise,
  onOpenQuickHelp,
  onResetAllData,
}) => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 text-xs py-10 pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Problem Statement */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold font-kannada text-lg shadow-2xs">
                ಕ
              </div>
              <span className="font-extrabold text-slate-900 text-base font-sans">
                KannadaConnect
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed font-sans">
              "Kannada in Everyday Life: Helping non-native speakers communicate with confidence in real-world situations—from Indiranagar auto rides to KR Market bargains, clinic checkups, and campus lectures."
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Offline-capable • Zero paid API required • Privacy first</span>
            </div>
          </div>

          {/* Quick Learning Links */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={onOpenCultureGuide}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Survival Tips & Grammar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSurprise}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Surprise Phrase Generator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuickHelp}
                  className="hover:text-rose-600 transition-colors flex items-center gap-1.5 text-rose-700 font-semibold"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Emergency Quick Help (112 / 108)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Hackathon Demo & Controls */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
              Hackathon Controls
            </h4>
            <p className="text-[11px] text-slate-400">
              Clear all locally cached practice progress and pocketbook bookmarks for a fresh test run.
            </p>
            <button
              onClick={onResetAllData}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© 2026 KannadaConnect • Crafted for Everyday Life in Karnataka</p>
          <div className="flex items-center gap-1">
            <span>Built with respect for Kannada language & culture</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
