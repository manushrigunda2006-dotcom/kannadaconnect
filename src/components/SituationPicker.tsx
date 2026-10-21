import React from 'react';
import type { Situation, SituationId } from '../types';
import { Bus, ShoppingBag, Compass, HeartPulse, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

interface SituationPickerProps {
  situations: Situation[];
  selectedSituation: SituationId | 'all';
  phraseCounts: Record<string, number>;
  totalCount: number;
  onSelect: (id: SituationId | 'all') => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Bus,
  ShoppingBag,
  Compass,
  HeartPulse,
  Briefcase,
  GraduationCap,
};

export const SituationPicker: React.FC<SituationPickerProps> = ({
  situations,
  selectedSituation,
  phraseCounts,
  totalCount,
  onSelect,
}) => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6" id="situations-section">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-2">
            <span>6 Real-World Domains</span>
          </div>
          <h2
            id="situation-picker-heading"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans"
          >
            Choose a Real-Life Situation
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Select the exact everyday setting you are in. Learn native phrases, cultural nuances, and polite etiquette.
          </p>
        </div>

        {/* All Filter Pill */}
        <button
          onClick={() => onSelect('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all self-start sm:self-auto ${
            selectedSituation === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-blue-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>View All Situations</span>
          <span className="font-mono text-xs opacity-75">({totalCount})</span>
        </button>
      </div>

      {/* 6 Situation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {situations.map((sit) => {
          const Icon = ICON_MAP[sit.iconName] || Compass;
          const isSelected = selectedSituation === sit.id;
          const count = phraseCounts[sit.id] || 0;

          return (
            <button
              key={sit.id}
              onClick={() => onSelect(sit.id)}
              className={`text-left p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between group relative overflow-hidden shadow-xs hover:shadow-md ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40'
                  : 'border-slate-200/90 bg-white hover:border-blue-300'
              }`}
            >
              <div>
                {/* Header row: Icon & Kannada Title */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105 ${sit.accentBg} ${sit.accentBorder}`}
                  >
                    <Icon className={`w-6 h-6 ${sit.accentText}`} />
                  </div>
                  <span className="font-kannada font-bold text-lg text-slate-800">
                    {sit.titleKn}
                  </span>
                </div>

                {/* English Title & Tagline */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                  {sit.titleEn}
                </h3>
                <p className="text-xs font-semibold text-blue-700 font-sans mt-0.5">
                  {sit.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                  {sit.description}
                </p>
              </div>

              {/* Bottom footer: phrase count & arrow */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 font-mono">
                  {count} verified phrases
                </span>
                <span className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
