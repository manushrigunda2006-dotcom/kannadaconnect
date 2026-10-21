import React, { useState, useMemo } from 'react';
import type { Phrase, Situation, SituationId, DifficultyLevel, UsageStyle } from '../types';
import { PhraseCard } from './PhraseCard';
import { Search, RotateCcw, X, Layers } from 'lucide-react';

interface PhraseGridProps {
  phrases: Phrase[];
  totalSearchMatchesAcrossAll?: number;
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
  onSelectSituation?: (id: SituationId | 'all') => void;
  onOpenStudio?: (phraseId: string) => void;
  onSearchChange?: (q: string) => void;
}

export const PhraseGrid: React.FC<PhraseGridProps> = ({
  phrases,
  totalSearchMatchesAcrossAll = 0,
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
  onSelectSituation,
  onOpenStudio,
  onSearchChange,
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

  const isSearchActive = Boolean(searchQuery.trim());
  const hasCategoryFilter = selectedSituation !== 'all';

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6" id="phrasebook-section">
      {/* Phrasebook Search Bar (Active in Learn View) */}
      {onSearchChange && (
        <div className="mb-6 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search phrases across all situations (e.g., how much, bus, help, meter, Google Pay)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Suggested Searches:
            </span>
            {[
              { label: 'How much?', query: 'how much' },
              { label: 'Where is the bus stop?', query: 'bus' },
              { label: 'I need help', query: 'help' },
              { label: 'Please speak slowly', query: 'slow' },
              { label: 'Google Pay', query: 'google pay' },
            ].map((qs) => (
              <button
                key={qs.label}
                onClick={() => {
                  onSearchChange(qs.query);
                  onResetSituation();
                }}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors border ${
                  searchQuery.toLowerCase() === qs.query.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent'
                }`}
              >
                {qs.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Scope & Category Filter Banner (Shown whenever search query is present) */}
      {isSearchActive && (
        <div className="mb-6 p-4 rounded-3xl border bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Search Scope:
                  </span>
                  {hasCategoryFilter ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {activeSituationObj?.titleEn}
                      <button
                        onClick={onResetSituation}
                        className="hover:text-amber-950 p-0.5"
                        title="Remove category filter and search all categories"
                        aria-label="Remove category filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                      All 6 Categories
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                  Query: <span className="font-bold text-slate-900 font-mono">"{searchQuery}"</span> —{' '}
                  <span className="font-semibold text-blue-700">
                    {filteredPhrases.length} match{filteredPhrases.length === 1 ? '' : 'es'}
                  </span>
                  {hasCategoryFilter && totalSearchMatchesAcrossAll > filteredPhrases.length && (
                    <span className="text-slate-500 text-xs ml-1">
                      ({totalSearchMatchesAcrossAll} total matches across all categories)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {hasCategoryFilter && (
                <button
                  onClick={onResetSituation}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
                >
                  Search All Categories ({totalSearchMatchesAcrossAll})
                </button>
              )}
              <button
                onClick={onClearSearch}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Search</span>
              </button>
            </div>
          </div>

          {/* Quick Category filter buttons while searching */}
          {onSelectSituation && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-3 pt-3 border-t border-slate-100 no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                Filter by Category:
              </span>
              <button
                onClick={() => onSelectSituation('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedSituation === 'all'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All ({totalSearchMatchesAcrossAll})
              </button>
              {situations.map((sit) => {
                const isCurrent = selectedSituation === sit.id;
                return (
                  <button
                    key={sit.id}
                    onClick={() => onSelectSituation(sit.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sit.titleEn}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Title & Filter Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {isSearchActive
              ? hasCategoryFilter
                ? `${activeSituationObj?.titleEn} Search Results`
                : 'Search Results Across All Categories'
              : activeSituationObj
              ? `${activeSituationObj.titleEn} Phrases`
              : 'Practical Everyday Kannada Phrasebook'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Showing {filteredPhrases.length} verified phrase{filteredPhrases.length === 1 ? '' : 's'}
            {hasCategoryFilter && ` for ${activeSituationObj?.titleEn}`}
            {isSearchActive && ` matching "${searchQuery}"`}
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
          {(selectedDifficulty !== 'all' || selectedStyle !== 'all' || selectedSituation !== 'all' || isSearchActive) && (
            <button
              onClick={() => {
                setSelectedDifficulty('all');
                setSelectedStyle('all');
                onResetSituation();
                onClearSearch();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Reset all search queries and category filters"
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
      ) : hasCategoryFilter && totalSearchMatchesAcrossAll > 0 ? (
        /* Helpful category scope mismatch notice */
        <div className="bg-white rounded-3xl border border-amber-300 p-8 sm:p-10 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
            <Search className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-sans">
            No matches in {activeSituationObj?.titleEn}
          </h3>
          <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
            We found <span className="font-bold text-blue-700">{totalSearchMatchesAcrossAll} matching phrase{totalSearchMatchesAcrossAll === 1 ? '' : 's'}</span> for <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">"{searchQuery}"</span> in other categories!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onResetSituation}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Show All {totalSearchMatchesAcrossAll} Matches Across Categories</span>
            </button>
            <button
              onClick={onClearSearch}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all"
            >
              Clear Search
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-sans">No matching phrases found</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5">
            We couldn't find any phrases matching "{searchQuery}". Try common searches like "how much", "bus", "help", or "meter".
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
              Show Full Phrasebook (60 Phrases)
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
