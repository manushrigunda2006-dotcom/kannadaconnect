import React from 'react';
import type { Situation, SituationId } from '../types';
import {
  Bus,
  ShoppingBag,
  Compass,
  HeartPulse,
  Briefcase,
  GraduationCap,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SituationPickerProps {
  situations: Situation[];
  selectedSituation: SituationId | 'all';
  phraseCounts: Record<string, number>;
  totalCount: number;
  onSelect: (id: SituationId | 'all') => void;
}

const iconMap: Record<string, LucideIcon> = {
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
    <section className="py-8 sm:py-10" aria-labelledby="situation-picker-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Situations • ಸಂದರ್ಭಗಳು
            </span>
            <h2
              id="situation-picker-heading"
              className="text-2xl sm:text-3xl font-bold text-emerald-950 mt-1 tracking-tight"
            >
              Where are you right now?
            </h2>
          </div>
          <p className="text-sm text-stone-500 max-w-sm">
            Select your real-world setting to instantly access everyday conversational phrases.
          </p>
        </div>

        {/* Situation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {/* "All Situations" Card */}
          <button
            onClick={() => onSelect('all')}
            className={`col-span-2 sm:col-span-1 lg:col-span-1 flex flex-col items-start p-4 rounded-2xl border text-left transition-all relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-emerald-700 ${
              selectedSituation === 'all'
                ? 'bg-emerald-900 text-white border-emerald-950 shadow-md ring-2 ring-emerald-800/40'
                : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
            }`}
            aria-pressed={selectedSituation === 'all'}
            aria-label={`All situations, ${totalCount} phrases`}
          >
            <div className="w-full flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  selectedSituation === 'all'
                    ? 'bg-emerald-800 text-emerald-100'
                    : 'bg-stone-100 text-stone-600 group-hover:bg-emerald-50 group-hover:text-emerald-800'
                }`}
              >
                <Layers className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  selectedSituation === 'all'
                    ? 'bg-emerald-700 text-emerald-100'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {totalCount}
              </span>
            </div>

            <div className="w-full">
              <p
                className={`font-kannada font-bold text-base leading-tight ${
                  selectedSituation === 'all' ? 'text-lime-300' : 'text-emerald-900'
                }`}
              >
                ಎಲ್ಲಾ
              </p>
              <p className="font-bold text-sm tracking-tight mt-0.5">All Situations</p>
              <p
                className={`text-xs mt-1 line-clamp-1 ${
                  selectedSituation === 'all' ? 'text-emerald-100/80' : 'text-stone-500'
                }`}
              >
                Full phrasebook
              </p>
            </div>
          </button>

          {/* 6 Situation Cards */}
          {situations.map((sit) => {
            const Icon = iconMap[sit.iconName] || Compass;
            const isSelected = selectedSituation === sit.id;
            const count = phraseCounts[sit.id] || 0;

            return (
              <button
                key={sit.id}
                onClick={() => onSelect(sit.id)}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-950 shadow-md ring-2 ring-emerald-800/40'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                }`}
                aria-pressed={isSelected}
                aria-label={`${sit.titleEn} situation (${sit.titleKn}), ${count} phrases`}
              >
                <div className="w-full flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-stone-100 text-stone-600 group-hover:bg-emerald-50 group-hover:text-emerald-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-emerald-700 text-emerald-100'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </div>

                <div className="w-full">
                  <p
                    className={`font-kannada font-bold text-base leading-tight ${
                      isSelected ? 'text-lime-300' : 'text-emerald-900'
                    }`}
                  >
                    {sit.titleKn}
                  </p>
                  <p className="font-bold text-sm tracking-tight mt-0.5">{sit.titleEn}</p>
                  <p
                    className={`text-xs mt-1 line-clamp-1 ${
                      isSelected ? 'text-emerald-100/80' : 'text-stone-500'
                    }`}
                  >
                    {sit.titlePhonetic}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
