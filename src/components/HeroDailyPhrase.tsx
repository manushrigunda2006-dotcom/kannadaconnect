import React from 'react';
import type { Phrase, Situation } from '../types';
import { Volume2, VolumeX, Bookmark, Check, Shuffle, Search, Sparkles, Lightbulb, X } from 'lucide-react';

interface HeroDailyPhraseProps {
  phrase: Phrase;
  situation?: Situation;
  isSaved: boolean;
  isPracticed: boolean;
  isPlaying: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPlayAudio: (phrase: Phrase) => void;
  onToggleSave: (id: string) => void;
  onMarkPracticed: (id: string) => void;
  onShuffleDaily: () => void;
  onSelectSituation: (situationId: string) => void;
}

export const HeroDailyPhrase: React.FC<HeroDailyPhraseProps> = ({
  phrase,
  situation,
  isSaved,
  isPracticed,
  isPlaying,
  searchQuery,
  onSearchChange,
  onPlayAudio,
  onToggleSave,
  onMarkPracticed,
  onShuffleDaily,
  onSelectSituation,
}) => {
  const quickSearchTags = ['Auto meter', 'UPI / Online', 'How much', 'Doctor', 'Coffee break', 'Bus'];

  return (
    <section className="pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-stone-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Intro */}
        <div className="max-w-3xl mb-8 sm:mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-900 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Hackathon Edition • Kannada in Everyday Life
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-950 leading-[1.15]">
            Learn Kannada for the{' '}
            <span className="text-emerald-800 underline decoration-lime-400 decoration-wavy decoration-2 underline-offset-8">
              moments you live
            </span>
            .
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            Skip abstract grammar drills. Choose the situation you are in — hailing an auto,
            bargaining at the market, talking to a doctor, or chatting by the coffee machine — and
            use the exact words with confident pronunciation right now.
          </p>
        </div>

        {/* Featured Daily Phrase Card */}
        <div className="bg-gradient-to-br from-white via-white to-emerald-50/50 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden transition-all">
          {/* Accent flourish */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-100/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-900 text-emerald-50">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                Featured Moment
              </span>
              {situation && (
                <button
                  onClick={() => onSelectSituation(situation.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors hover:opacity-80 ${situation.accentPill}`}
                >
                  {situation.titleKn} • {situation.titleEn}
                </button>
              )}
            </div>

            <button
              onClick={onShuffleDaily}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-900 bg-stone-100 hover:bg-stone-200/80 px-3 py-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700"
              title="See another featured phrase"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle Phrase</span>
            </button>
          </div>

          {/* Main Phrase Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              {/* Native Script */}
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-kannada text-emerald-950 tracking-normal leading-relaxed">
                  {phrase.kannada}
                </h2>
              </div>

              {/* Phonetic Romanization */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-stone-700">
                <span className="text-base sm:text-lg font-medium text-emerald-900 font-mono">
                  {phrase.romanized}
                </span>
                {phrase.pronunciationNotes && (
                  <span className="text-xs sm:text-sm text-stone-500 font-sans">
                    (Syallables: {phrase.pronunciationNotes})
                  </span>
                )}
              </div>

              {/* English Meaning */}
              <p className="text-lg sm:text-xl font-semibold text-stone-900">
                "{phrase.english}"
              </p>

              {/* Practical Tip */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs sm:text-sm text-amber-950 mt-2">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="font-semibold text-amber-900">Nuance:</strong> {phrase.tip}
                </p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center lg:border-l lg:border-stone-100 lg:pl-6">
              {/* Play Audio */}
              <button
                onClick={() => onPlayAudio(phrase)}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  isPlaying
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-emerald-900 hover:bg-emerald-800 text-white shadow-sm'
                }`}
                aria-label={`Listen to pronunciation of ${phrase.kannada}`}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Speaking...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Listen & Practice</span>
                  </>
                )}
              </button>

              {/* Save to Pocketbook */}
              <button
                onClick={() => onToggleSave(phrase.id)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm border transition-all focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  isSaved
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
                aria-label={isSaved ? 'Remove from pocketbook' : 'Save to pocketbook'}
              >
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? 'fill-emerald-800 text-emerald-800' : 'text-stone-500'}`}
                />
                <span>{isSaved ? 'Saved in Pocketbook' : 'Save to Pocketbook'}</span>
              </button>

              {/* Mark Practiced */}
              <button
                onClick={() => onMarkPracticed(phrase.id)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm border transition-all focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                  isPracticed
                    ? 'bg-lime-50 border-lime-300 text-lime-900 font-semibold'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
                aria-label="Mark phrase as practiced"
              >
                <Check
                  className={`w-4 h-4 ${isPracticed ? 'text-lime-700 stroke-[3]' : 'text-stone-400'}`}
                />
                <span>{isPracticed ? 'Practiced Today ✓' : 'Mark as Practiced'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div className="mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search across Kannada script (e.g. ಬೆಲೆ), romanized words (e.g. 'eshtu', 'auto'), or English meaning..."
              className="w-full pl-12 pr-11 py-3.5 bg-white border border-stone-200 rounded-2xl text-stone-900 text-sm sm:text-base placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent shadow-xs transition-all"
              aria-label="Search Kannada phrases"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick search tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Quick search:
            </span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSearchChange(tag)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  searchQuery.toLowerCase() === tag.toLowerCase()
                    ? 'bg-emerald-900 text-white border-emerald-900'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
