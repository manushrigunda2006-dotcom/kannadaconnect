import React from 'react';
import type { Phrase, Situation, SituationId } from '../types';
import { PhraseCard } from './PhraseCard';
import { AlertTriangle, SearchX, PhoneCall } from 'lucide-react';

interface PhraseGridProps {
  phrases: Phrase[];
  situations: Situation[];
  selectedSituation: SituationId | 'all';
  searchQuery: string;
  savedIds: string[];
  practicedIds: string[];
  playingPhraseId: string | null;
  onPlayAudio: (phrase: Phrase) => void;
  onToggleSave: (id: string) => void;
  onMarkPracticed: (id: string) => void;
  onClearSearch: () => void;
  onResetSituation: () => void;
}

export const PhraseGrid: React.FC<PhraseGridProps> = ({
  phrases,
  situations,
  selectedSituation,
  searchQuery,
  savedIds,
  practicedIds,
  playingPhraseId,
  onPlayAudio,
  onToggleSave,
  onMarkPracticed,
  onClearSearch,
  onResetSituation,
}) => {
  const activeSituation =
    selectedSituation === 'all'
      ? null
      : situations.find((s) => s.id === selectedSituation);

  const situationMap = situations.reduce<Record<string, Situation>>((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const isHealthcare = selectedSituation === 'healthcare';

  return (
    <section className="py-6 sm:py-8" id="phrasebook-section" aria-label="Phrasebook">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-950">
                {activeSituation ? (
                  <span>
                    <span className="font-kannada">{activeSituation.titleKn}</span> •{' '}
                    {activeSituation.titleEn} Phrases
                  </span>
                ) : (
                  <span>All Everyday Phrases</span>
                )}
              </h2>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                {phrases.length} {phrases.length === 1 ? 'phrase' : 'phrases'}
              </span>
            </div>
            {activeSituation && (
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {activeSituation.description}
              </p>
            )}
            {searchQuery && (
              <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-1">
                Filtering results for: <span className="font-bold">"{searchQuery}"</span>
              </p>
            )}
          </div>

          {/* Quick Filter Reset */}
          {(selectedSituation !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                onClearSearch();
                onResetSituation();
              }}
              className="self-start sm:self-auto text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Healthcare Mandatory Disclaimer Banner */}
        {isHealthcare && (
          <div
            role="alert"
            className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                <p className="font-bold text-amber-950">
                  Notice: Healthcare Communication Aids Only
                </p>
                <p className="text-amber-900 mt-0.5">
                  These phrases are intended to help learners communicate basic discomfort and
                  ask for assistance at local clinics or pharmacies. They are{' '}
                  <strong>not medical advice</strong> and do not substitute professional medical care
                  or emergency dispatch.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 bg-amber-100/80 px-3 py-2 rounded-xl border border-amber-300 text-xs font-bold text-amber-900">
              <PhoneCall className="w-4 h-4 text-amber-800" />
              <span>Karnataka Emergency: 112 / 108</span>
            </div>
          </div>
        )}

        {/* Phrases Grid or Empty State */}
        {phrases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {phrases.map((phrase) => (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                situation={situationMap[phrase.situation]}
                isSaved={savedIds.includes(phrase.id)}
                isPracticed={practicedIds.includes(phrase.id)}
                isPlaying={playingPhraseId === phrase.id}
                searchHighlight={searchQuery}
                onPlayAudio={onPlayAudio}
                onToggleSave={onToggleSave}
                onMarkPracticed={onMarkPracticed}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 p-8 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-500 mx-auto flex items-center justify-center mb-4">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              ಯಾವುದೂ ಸಿಗಲಿಲ್ಲ (No phrases found)
            </h3>
            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              We couldn't find phrases matching{' '}
              <span className="font-semibold text-stone-700">"{searchQuery}"</span> in the current
              filter.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={onClearSearch}
                className="px-4 py-2 bg-emerald-900 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                Clear Search Query
              </button>
              <button
                onClick={onResetSituation}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 transition-colors"
              >
                Show All Situations
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
