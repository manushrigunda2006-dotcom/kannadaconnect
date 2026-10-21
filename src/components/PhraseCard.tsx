import React, { useState } from 'react';
import type { Phrase, Situation } from '../types';
import { Volume2, VolumeX, Bookmark, Check, Copy, CheckCheck, Lightbulb, Mic } from 'lucide-react';

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
  onOpenStudio?: (phraseId: string) => void;
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
  onOpenStudio,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `${phrase.kannada}\n(${phrase.romanized})\nMeaning: ${phrase.english}\n— KannadaConnect`;
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
        <mark key={i} className="bg-amber-200 text-slate-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <article
      className={`flex flex-col justify-between bg-white rounded-3xl p-5 sm:p-6 border transition-all hover:shadow-md hover:border-blue-300 relative group ${
        isPracticed
          ? 'border-emerald-300/80 bg-gradient-to-b from-white to-emerald-50/20'
          : 'border-slate-200'
      }`}
      aria-label={`Phrase: ${phrase.english}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {situation && (
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${situation.accentPill}`}
              >
                {situation.titleKn} • {situation.titleEn}
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                phrase.difficulty === 'essential'
                  ? 'bg-rose-100 text-rose-800'
                  : phrase.difficulty === 'beginner'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {phrase.difficulty}
            </span>
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md capitalize">
              {phrase.usageStyle}
            </span>
          </div>

          {/* Practiced indicator tag */}
          {isPracticed && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
              <Check className="w-3 h-3 stroke-[3]" />
              Practiced
            </span>
          )}
        </div>

        {/* Kannada Script (Prominent & Clear) */}
        <div className="mb-2">
          <h3 className="text-xl sm:text-2xl font-bold font-kannada text-slate-900 tracking-normal leading-relaxed">
            {renderHighlighted(phrase.kannada, searchHighlight)}
          </h3>
        </div>

        {/* Romanized Pronunciation */}
        <div className="mb-2.5">
          <p className="text-sm font-bold font-mono text-blue-800 leading-snug">
            {renderHighlighted(phrase.romanized, searchHighlight)}
          </p>
          {phrase.pronunciationNotes && (
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Breakdown: {phrase.pronunciationNotes}
            </p>
          )}
        </div>

        {/* English Meaning */}
        <p className="text-sm sm:text-base font-semibold text-slate-800 mb-3.5">
          "{renderHighlighted(phrase.english, searchHighlight)}"
        </p>

        {/* Usage Tip / Cultural Nuance */}
        <div className="flex items-start gap-2 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-amber-900">Tip:</span> {phrase.tip}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Play Audio Button */}
        <button
          onClick={() => onPlayAudio(phrase)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            isPlaying
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
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

        {/* Action icons group: Studio, Practiced, Save, Copy */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Practice in Studio button */}
          {onOpenStudio && (
            <button
              onClick={() => onOpenStudio(phrase.id)}
              className="p-2 rounded-xl text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
              title="Practice pronunciation in Studio"
              aria-label="Practice in Studio"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          {/* Mark Practiced */}
          <button
            onClick={() => onMarkPracticed(phrase.id)}
            className={`p-2 rounded-xl text-xs transition-colors ${
              isPracticed
                ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
            title={isPracticed ? 'Practiced today' : 'Mark as practiced'}
            aria-label={isPracticed ? 'Marked as practiced' : 'Mark phrase as practiced'}
          >
            <Check className={`w-4 h-4 ${isPracticed ? 'stroke-[3]' : ''}`} />
          </button>

          {/* Save / Bookmark */}
          <button
            onClick={() => onToggleSave(phrase.id)}
            className={`p-2 rounded-xl text-xs transition-colors ${
              isSaved
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
            title={isSaved ? 'Saved in Pocketbook' : 'Save to Pocketbook'}
            aria-label={isSaved ? 'Remove from Pocketbook' : 'Save to Pocketbook'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 text-xs transition-colors"
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
