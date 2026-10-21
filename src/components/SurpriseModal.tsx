import React from 'react';
import type { Phrase, Situation } from '../types';
import { Sparkles, X, Volume2, VolumeX, Bookmark, Check, Shuffle, Lightbulb } from 'lucide-react';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  phrase: Phrase | null;
  situation?: Situation;
  isSaved: boolean;
  isPracticed: boolean;
  isPlaying: boolean;
  onNextSurprise: () => void;
  onPlayAudio: (phrase: Phrase) => void;
  onToggleSave: (id: string) => void;
  onMarkPracticed: (id: string) => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  isOpen,
  onClose,
  phrase,
  situation,
  isSaved,
  isPracticed,
  isPlaying,
  onNextSurprise,
  onPlayAudio,
  onToggleSave,
  onMarkPracticed,
}) => {
  if (!isOpen || !phrase) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="surprise-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-[#FDFBF7] rounded-3xl border border-stone-300 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="surprise-title" className="text-lg font-bold text-emerald-950">
                Surprise Phrase • <span className="font-kannada font-normal">ಅನಿರೀಕ್ಷಿತ</span>
              </h2>
              <p className="text-xs text-stone-500">
                A random everyday phrase to spark a conversational moment.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Close surprise phrase"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Situation badge */}
          {situation && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-100 text-emerald-900 border-emerald-300">
              <span>{situation.titleKn}</span>
              <span>•</span>
              <span>{situation.titleEn}</span>
            </div>
          )}

          {/* Kannada Script */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold font-kannada text-emerald-950 leading-relaxed">
              {phrase.kannada}
            </h3>

            <div className="space-y-1">
              <p className="text-base font-semibold font-mono text-emerald-800">
                {phrase.romanized}
              </p>
              {phrase.pronunciationNotes && (
                <p className="text-xs text-stone-400 font-sans">
                  Syllables: {phrase.pronunciationNotes}
                </p>
              )}
            </div>

            <p className="text-base sm:text-lg font-bold text-stone-900">
              "{phrase.english}"
            </p>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-semibold text-amber-900">Usage note:</span> {phrase.tip}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Play Audio */}
            <button
              onClick={() => onPlayAudio(phrase)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                isPlaying
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-emerald-900 hover:bg-emerald-800 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Speaking...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Pronounce</span>
                </>
              )}
            </button>

            {/* Save */}
            <button
              onClick={() => onToggleSave(phrase.id)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm border transition-all ${
                isSaved
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-800 text-emerald-800' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* Mark Practiced */}
          <button
            onClick={() => onMarkPracticed(phrase.id)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs border transition-all ${
              isPracticed
                ? 'bg-lime-50 border-lime-300 text-lime-900 font-semibold'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Check className={`w-4 h-4 ${isPracticed ? 'text-lime-700 stroke-[3]' : 'text-stone-400'}`} />
            <span>{isPracticed ? 'Practiced Today ✓' : 'Mark as Practiced'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between">
          <button
            onClick={onNextSurprise}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Roll Another Phrase</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
