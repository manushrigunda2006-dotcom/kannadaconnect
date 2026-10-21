import React, { useState } from 'react';
import type { Phrase, Situation } from '../types';
import { Volume2, VolumeX, Bookmark, Check, Copy, CheckCheck, Lightbulb } from 'lucide-react';

interface PhraseCardProps {
  phrase: Phrase;
  situation?: Situation;
  isSaved: boolean;
  isPracticed: boolean;
  isPlaying: boolean;
  searchHighlight?: string;
  onPlayAudio: (phrase: Phrase) => void;
  onToggleSave: (id: string) => void;
  onMarkPracticed: (id: string) => void;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  situation,
  isSaved,
  isPracticed,
  isPlaying,
  searchHighlight,
  onPlayAudio,
  onToggleSave,
  onMarkPracticed,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `${phrase.kannada}\n(${phrase.romanized})\nMeaning: ${phrase.english}\n— via Namma Kannada App`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed', e);
    }
  };

  // Helper to highlight matching text in search
  const renderHighlighted = (text: string, highlight?: string) => {
    if (!highlight || !highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-lime-200 text-emerald-950 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <article
      className={`flex flex-col justify-between bg-white rounded-2xl p-5 sm:p-6 border transition-all hover:shadow-md hover:border-emerald-300 relative group ${
        isPracticed ? 'border-lime-300/80 bg-gradient-to-b from-white to-lime-50/20' : 'border-stone-200'
      }`}
      aria-label={`Phrase: ${phrase.english}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {situation && (
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${situation.accentPill}`}
              >
                {situation.titleKn} • {situation.titleEn}
              </span>
            )}
            {phrase.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md capitalize"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Practiced indicator tag */}
          {isPracticed && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-lime-800 bg-lime-100/90 px-2 py-0.5 rounded-full border border-lime-300">
              <Check className="w-3 h-3 stroke-[3]" />
              Practiced
            </span>
          )}
        </div>

        {/* Kannada Script (Prominent & Clear) */}
        <div className="mb-2">
          <h3 className="text-xl sm:text-2xl font-bold font-kannada text-emerald-950 tracking-normal leading-relaxed">
            {renderHighlighted(phrase.kannada, searchHighlight)}
          </h3>
        </div>

        {/* Romanized Pronunciation */}
        <div className="mb-2.5">
          <p className="text-sm font-semibold font-mono text-emerald-800 leading-snug">
            {renderHighlighted(phrase.romanized, searchHighlight)}
          </p>
          {phrase.pronunciationNotes && (
            <p className="text-xs text-stone-400 font-sans mt-0.5">
              Breakdown: {phrase.pronunciationNotes}
            </p>
          )}
        </div>

        {/* English Meaning */}
        <p className="text-sm sm:text-base font-semibold text-stone-800 mb-3.5">
          "{renderHighlighted(phrase.english, searchHighlight)}"
        </p>

        {/* Usage Tip / Cultural Nuance */}
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 mb-4">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-amber-900">Tip:</span> {phrase.tip}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        {/* Play Audio Button */}
        <button
          onClick={() => onPlayAudio(phrase)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-emerald-700 ${
            isPlaying
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-emerald-900 hover:bg-emerald-800 text-white shadow-xs'
          }`}
          aria-label={isPlaying ? 'Speaking audio' : `Play audio for ${phrase.romanized}`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Speaking...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </>
          )}
        </button>

        {/* Action icons group: Practiced, Save, Copy */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Mark Practiced */}
          <button
            onClick={() => onMarkPracticed(phrase.id)}
            className={`p-2 rounded-xl text-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 ${
              isPracticed
                ? 'bg-lime-100 text-lime-900 hover:bg-lime-200'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
            title={isPracticed ? 'Practiced today' : 'Mark as practiced'}
            aria-label={isPracticed ? 'Marked as practiced' : 'Mark phrase as practiced'}
          >
            <Check className={`w-4 h-4 ${isPracticed ? 'stroke-[3]' : ''}`} />
          </button>

          {/* Save / Bookmark */}
          <button
            onClick={() => onToggleSave(phrase.id)}
            className={`p-2 rounded-xl text-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700 ${
              isSaved
                ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
            }`}
            title={isSaved ? 'Saved in Pocketbook' : 'Save to Pocketbook'}
            aria-label={isSaved ? 'Remove from Pocketbook' : 'Save to Pocketbook'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-800 text-emerald-800' : ''}`} />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-emerald-700"
            title="Copy Kannada script & translation"
            aria-label="Copy phrase text"
          >
            {copied ? (
              <CheckCheck className="w-4 h-4 text-emerald-700" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
