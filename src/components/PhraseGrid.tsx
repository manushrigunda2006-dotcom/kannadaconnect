import React, { useState, useMemo } from 'react';
import type { Phrase, Situation, SituationId, DifficultyLevel, UsageStyle } from '../types';
import { PhraseCard } from './PhraseCard';
import { Search, RotateCcw } from 'lucide-react';

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
  onOpenStudio?: (phraseId: string) => void;
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
  onOpenStudio,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [selectedStyle, setSelectedStyle] = useState<UsageStyle | 'all'>('all');

  // Filter phrases based on difficulty and style
  const filteredPhrases = useMemo(() => {
    return phrases.filter((p) => {
      const matchDifficulty =
        selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
      const matchStyle = selectedStyle === 'all' || p.usageStyle === selectedStyle;
      return matchDifficulty && matchStyle;
    });
  }, [phrases, selectedDifficulty, selectedStyle]);

  const activeSituationObj = situations.find((s) => s.id === selectedSituation);

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6" id="phrasebook-section">
      {/* Title & Filter Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {activeSituationObj
              ? `${activeSituationObj.titleEn} Phrases`
              : 'Practical Everyday Kannada Phrasebook'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Showing {filteredPhrases.length} verified phrases
            {selectedSituation !== 'all' && ` for ${activeSituationObj?.titleEn}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-2">Level:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'beginner', label: 'Beginner' },
              { id: 'essential', label: 'Essential' },
              { id: 'intermediate', label: 'Intermediate' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === d.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {(selectedDifficulty !== 'all' || selectedStyle !== 'all' || selectedSituation !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDifficulty('all');
                setSelectedStyle('all');
                onResetSituation();
                onClearSearch();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Phrase Cards */}
      {filteredPhrases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhrases.map((phrase) => {
            const situation = situations.find((s) => s.id === phrase.situation);
            return (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                situation={situation}
                isSaved={savedIds.includes(phrase.id)}
                isPracticed={practicedIds.includes(phrase.id)}
                isPlaying={playingPhraseId === phrase.id}
                searchHighlight={searchQuery}
                onPlayAudio={onPlayAudio}
                onToggleSave={onToggleSave}
                onMarkPracticed={onMarkPracticed}
                onOpenStudio={onOpenStudio}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-sans">No matching phrases found</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
            We couldn't find any phrases matching "{searchQuery}". Try searching for common English terms like "bus", "meter", "price", or "help".
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                onClearSearch();
                onResetSituation();
                setSelectedDifficulty('all');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition-colors"
            >
              Show All 60 Phrases
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
