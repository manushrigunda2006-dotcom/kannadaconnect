import React, { useState } from 'react';
import type { Phrase, Situation } from '../types';
import { PhraseCard } from './PhraseCard';
import { Bookmark, X, Trash2, ArrowRight } from 'lucide-react';

interface PocketbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPhrases: Phrase[];
  situations: Situation[];
  practicedIds: string[];
  playingPhraseId: string | null;
  onPlayAudio: (phrase: Phrase) => void;
  onToggleSave: (id: string) => void;
  onMarkPracticed: (id: string) => void;
  onClearAll: () => void;
  onBrowseSituations: () => void;
}

export const PocketbookModal: React.FC<PocketbookModalProps> = ({
  isOpen,
  onClose,
  savedPhrases,
  situations,
  practicedIds,
  playingPhraseId,
  onPlayAudio,
  onToggleSave,
  onMarkPracticed,
  onClearAll,
  onBrowseSituations,
}) => {
  const [filterSituation, setFilterSituation] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const situationMap = situations.reduce<Record<string, Situation>>((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const filtered =
    filterSituation === 'all'
      ? savedPhrases
      : savedPhrases.filter((p) => p.situation === filterSituation);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pocketbook-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-[#FDFBF7] rounded-3xl border border-stone-300 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-emerald-100 flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="pocketbook-title" className="text-xl font-bold text-emerald-950">
                  Pocketbook • <span className="font-kannada font-normal">ಜೇಬು ಪುಸ್ತಕ</span>
                </h2>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                  {savedPhrases.length}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Saved locally on your device for quick offline reference on the street.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedPhrases.length > 0 && (
              <>
                {showClearConfirm ? (
                  <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl">
                    <span className="text-xs font-semibold text-rose-800">Clear all?</span>
                    <button
                      onClick={() => {
                        onClearAll();
                        setShowClearConfirm(false);
                      }}
                      className="text-xs font-bold text-rose-900 bg-rose-200 hover:bg-rose-300 px-2 py-0.5 rounded-lg transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="text-xs font-medium text-stone-600 hover:text-stone-900 px-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Clear all saved phrases"
                    aria-label="Clear all saved phrases"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
              aria-label="Close pocketbook"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar (if there are saved phrases across situations) */}
        {savedPhrases.length > 0 && (
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] shrink-0">
              Filter:
            </span>
            <button
              onClick={() => setFilterSituation('all')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterSituation === 'all'
                  ? 'bg-emerald-900 text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              All Saved ({savedPhrases.length})
            </button>
            {situations.map((sit) => {
              const count = savedPhrases.filter((p) => p.situation === sit.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={sit.id}
                  onClick={() => setFilterSituation(sit.id)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    filterSituation === sit.id
                      ? 'bg-emerald-900 text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
                  }`}
                >
                  <span>{sit.titleEn}</span>
                  <span className="text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {savedPhrases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((phrase) => (
                <PhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  situation={situationMap[phrase.situation]}
                  isSaved={true}
                  isPracticed={practicedIds.includes(phrase.id)}
                  isPlaying={playingPhraseId === phrase.id}
                  onPlayAudio={onPlayAudio}
                  onToggleSave={onToggleSave}
                  onMarkPracticed={onMarkPracticed}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-12 px-4 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <Bookmark className="w-8 h-8 stroke-1 text-emerald-800" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                ನಿಮ್ಮ ಜೇಬು ಪುಸ್ತಕ ಖಾಲಿಯಾಗಿದೆ
              </h3>
              <p className="text-sm font-medium text-stone-600 mt-1">
                Your pocketbook has no saved phrases yet.
              </p>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                While exploring moments like Transport or Shopping, tap the bookmark icon on any
                phrase to pin it here. You can quickly pull it up when speaking to an auto driver
                or shopkeeper!
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    onClose();
                    onBrowseSituations();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <span>Browse Situations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between text-xs text-stone-500">
          <span>Saved phrases persist locally in browser storage</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
