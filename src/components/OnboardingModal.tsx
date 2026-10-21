import React from 'react';
import type { SituationId } from '../types';
import { SITUATIONS } from '../data/situations';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoal: (sitId: SituationId) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSelectGoal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Close onboarding"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl mb-4 shadow-sm border border-blue-200">
          ಕ
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Welcome to KannadaConnect!
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
          What is your main everyday goal in Karnataka?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-6 leading-relaxed">
          We focus on situation-first Kannada so you can speak confidently from day one—no abstract grammar memorization required.
        </p>

        <div className="space-y-2.5 mb-6">
          {SITUATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectGoal(s.id)}
              className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{s.iconName === 'Bus' ? '🛺' : s.iconName === 'ShoppingBag' ? '🛍️' : s.iconName === 'Compass' ? '🧭' : s.iconName === 'HeartPulse' ? '🩺' : s.iconName === 'GraduationCap' ? '🎓' : '💼'}</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-950">
                    {s.titleEn}
                  </p>
                  <p className="text-[11px] text-slate-500 font-sans">{s.tagline}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-4"
          >
            I want to explore everything directly
          </button>
        </div>
      </div>
    </div>
  );
};
