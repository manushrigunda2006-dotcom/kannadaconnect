import React from 'react';
import { Heart, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface FooterProps {
  onOpenCultureGuide: () => void;
  onOpenSurprise: () => void;
  onResetAllData: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC<FooterProps> = ({
  onOpenCultureGuide,
  onOpenSurprise,
  onResetAllData,
}) => {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white/70 py-12 text-stone-600 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-200">
          {/* Brand & mission */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-100 flex items-center justify-center font-kannada font-bold text-lg">
                ನ
              </div>
              <span className="font-bold text-lg text-emerald-950">ನಮ್ಮ • Namma</span>
            </div>
            <p className="text-stone-600 text-xs leading-relaxed max-w-sm">
              Built for the <strong>"Kannada in Everyday Life"</strong> hackathon problem statement.
              Empowering people to navigate real-world situations — travel, shopping, healthcare,
              education, transport, and workplace — with confidence and cultural respect.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for Kannada learners everywhere</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs">
              Quick Shortcuts
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={onOpenSurprise}
                  className="hover:text-emerald-900 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Surprise Me Phrase</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCultureGuide}
                  className="hover:text-emerald-900 transition-colors"
                >
                  Survival Grammar & Numbers Guide
                </button>
              </li>
              <li>
                <a
                  href="#situation-picker-heading"
                  className="hover:text-emerald-900 transition-colors"
                >
                  Browse 6 Everyday Situations
                </a>
              </li>
              <li>
                <a
                  href="#phrasebook-section"
                  className="hover:text-emerald-900 transition-colors"
                >
                  Full Searchable Phrasebook
                </a>
              </li>
            </ul>
          </div>

          {/* Transparent Disclaimers */}
          <div className="md:col-span-4 space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-1.5 font-bold text-xs text-stone-800">
              <AlertCircle className="w-3.5 h-3.5 text-stone-600" />
              <span>Demo Transparency & Disclaimers</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-stone-500 leading-relaxed list-disc list-inside">
              <li>
                <strong>Browser Speech Synthesis:</strong> Audio relies on device-installed
                Kannada voices (best effort). Phonetic romanization remains available for all
                phrases.
              </li>
              <li>
                <strong>Healthcare Notice:</strong> Phrases are communication aids only and do not
                constitute medical advice. For emergencies, call 112 / 108.
              </li>
              <li>
                <strong>Local Persistence:</strong> Saved phrases and practice progress are stored
                in local browser storage.
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onResetAllData}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-rose-700 bg-white hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors"
                title="Reset local storage saved items and demo practice tracker"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo Local Storage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {CURRENT_YEAR} Namma — Situation-First Everyday Kannada Companion.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">ಕನ್ನಡ ಉಳಿಸಿ, ಕನ್ನಡ ಬೆಳೆಸಿ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
