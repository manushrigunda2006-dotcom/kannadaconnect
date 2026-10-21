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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-[#FDFBF7] rounded-3xl border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
            </div>
            <div>
              <h2 id="surprise-title" className="text-lg font-bold text-slate-900 font-sans">
                Surprise Phrase (ಅನಿರೀಕ್ಷಿತ)
              </h2>
              <p className="text-xs text-slate-500">
                Spontaneous real-life Kannada practice
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close surprise modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-4">
          {situation && (
            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${situation.accentPill}`}
            >
              {situation.titleKn} • {situation.titleEn}
            </span>
          )}

          {/* Kannada Script */}
          <div className="py-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-kannada text-slate-900 leading-relaxed">
              {phrase.kannada}
            </h3>
          </div>

          {/* Romanized */}
          <div>
            <p className="text-base font-bold font-mono text-blue-800">
              {phrase.romanized}
            </p>
            {phrase.pronunciationNotes && (
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Breakdown: {phrase.pronunciationNotes}
              </p>
            )}
          </div>

          {/* English Meaning */}
          <p className="text-sm font-semibold text-slate-700 italic">
            "{phrase.english}"
          </p>

          {/* Cultural Tip */}
          <div className="text-left flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold text-amber-900">Street Context:</span> {phrase.tip}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-2">
          {/* Audio button */}
          <button
            onClick={() => onPlayAudio(phrase)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
            }`}
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlaying ? 'Speaking...' : 'Listen'}</span>
          </button>

          {/* Mark & Save */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onMarkPracticed(phrase.id)}
              className={`p-2.5 rounded-xl text-xs transition-colors ${
                isPracticed
                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Mark practiced"
            >
              <Check className={`w-4 h-4 ${isPracticed ? 'stroke-[3]' : ''}`} />
            </button>

            <button
              onClick={() => onToggleSave(phrase.id)}
              className={`p-2.5 rounded-xl text-xs transition-colors ${
                isSaved
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Save to pocketbook"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
            </button>

            {/* Roll next */}
            <button
              onClick={onNextSurprise}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-xs transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
