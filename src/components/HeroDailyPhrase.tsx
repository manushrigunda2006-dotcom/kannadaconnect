import React from 'react';
import type { Phrase, Situation } from '../types';
import {
  Volume2,
  VolumeX,
  Bookmark,
  Check,
  Search,
  Sparkles,
  Shuffle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

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
  onStartLearning: () => void;
  onExploreSituations: () => void;
  onOpenStudio?: (phraseId: string) => void;
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
  onStartLearning,
  onExploreSituations,
  onOpenStudio,
}) => {
  const quickSearches = [
    { label: 'Bus Stop?', query: 'bus' },
    { label: 'How much?', query: 'eshtu' },
    { label: 'I need help', query: 'sahaya' },
    { label: 'Speak slowly', query: 'nidhanavagi' },
    { label: 'Google Pay', query: 'upi' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-200/80">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute top-1/3 left-10 -z-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Hero Narrative */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Learn Kannada. Use it in real life.</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-sans leading-tight">
              Your everyday life in Karnataka,{' '}
              <span className="text-blue-600 underline decoration-amber-400 decoration-wavy decoration-2">
                made easier.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-sans">
              Learn practical spoken Kannada for travel, street shopping, healthcare clinics, college classrooms, public transit, and professional workplaces. With audio pronunciations, role-play dialogues, and instant phrase search.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartLearning}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreSituations}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-sm sm:text-base font-bold shadow-xs transition-all"
              >
                <span>Explore Real-Life Situations</span>
              </button>
            </div>

            {/* Smart Phrase Finder Search Bar */}
            <div className="pt-4">
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search phrases in Kannada, English, or Romanised (e.g. meter, bus, bill)..."
                  className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Instant Search Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Try asking:
                </span>
                {quickSearches.map((qs) => (
                  <button
                    key={qs.label}
                    onClick={() => onSearchChange(qs.query)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {qs.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Daily Featured Phrase Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-7 relative overflow-hidden group">
              {/* Top Accent Strip */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Daily Phrase
                  </span>
                  {situation && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                      {situation.titleEn}
                    </span>
                  )}
                </div>

                <button
                  onClick={onShuffleDaily}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Shuffle to another phrase"
                  aria-label="Shuffle daily phrase"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>

              {/* Kannada Script (Prominent & Clear) */}
              <div className="my-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-kannada text-slate-900 leading-snug tracking-normal">
                  {phrase.kannada}
                </h3>
              </div>

              {/* Romanized Pronunciation */}
              <div className="mb-3">
                <p className="text-sm sm:text-base font-bold font-mono text-blue-800">
                  {phrase.romanized}
                </p>
                {phrase.pronunciationNotes && (
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Breakdown: {phrase.pronunciationNotes}
                  </p>
                )}
              </div>

              {/* English Meaning */}
              <p className="text-sm sm:text-base font-semibold text-slate-700 italic mb-4">
                "{phrase.english}"
              </p>

              {/* Cultural Usage Tip */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 mb-5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold text-amber-900">Street Context:</span> {phrase.tip}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onPlayAudio(phrase)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition-all ${
                    isPlaying
                      ? 'bg-amber-600 animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  aria-label="Listen to audio pronunciation"
                >
                  {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlaying ? 'Speaking...' : 'Listen Audio'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {onOpenStudio && (
                    <button
                      onClick={() => onOpenStudio(phrase.id)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                      title="Practice pronunciation in studio"
                    >
                      Studio
                    </button>
                  )}

                  <button
                    onClick={() => onMarkPracticed(phrase.id)}
                    className={`p-2 rounded-xl text-xs transition-colors ${
                      isPracticed
                        ? 'bg-emerald-100 text-emerald-900 font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                    title={isPracticed ? 'Practiced today' : 'Mark as practiced'}
                  >
                    <Check className={`w-4 h-4 ${isPracticed ? 'stroke-[3]' : ''}`} />
                  </button>

                  <button
                    onClick={() => onToggleSave(phrase.id)}
                    className={`p-2 rounded-xl text-xs transition-colors ${
                      isSaved
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                    title={isSaved ? 'Saved in Pocketbook' : 'Save to Pocketbook'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small "Made for Everyday Karnataka" Section */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <span className="text-2xl block mb-1">🛺</span>
            <p className="text-xs font-bold text-slate-800">Auto & BMTC Ready</p>
            <p className="text-[11px] text-slate-500">Hailing & routes without stress</p>
          </div>
          <div className="p-3">
            <span className="text-2xl block mb-1">🛍️</span>
            <p className="text-xs font-bold text-slate-800">Markets & UPI Billing</p>
            <p className="text-[11px] text-slate-500">Gentle bargaining & QR codes</p>
          </div>
          <div className="p-3">
            <span className="text-2xl block mb-1">🩺</span>
            <p className="text-xs font-bold text-slate-800">Clinic & Emergency</p>
            <p className="text-[11px] text-slate-500">Expressing symptoms clearly</p>
          </div>
          <div className="p-3">
            <span className="text-2xl block mb-1">💼</span>
            <p className="text-xs font-bold text-slate-800">Workplace & Filter Coffee</p>
            <p className="text-[11px] text-slate-500">Connect with local colleagues</p>
          </div>
        </div>
      </div>
    </section>
  );
};
