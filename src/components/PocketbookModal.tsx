import React, { useState } from 'react';
import type { Phrase, Situation } from '../types';
import { PhraseCard } from './PhraseCard';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';

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
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const filtered = savedPhrases.filter(
    (p) => filterSituation === 'all' || p.situation === filterSituation
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-amber-700 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 font-sans">
                  Pocketbook (ಜೇಬು ಪುಸ್ತಕ)
                </h3>
                <span className="bg-amber-100 text-amber-900 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                  {savedPhrases.length} pinned
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Quick-reference bookmarks for on-the-road Kannada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedPhrases.length > 0 && (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                title="Clear all saved bookmarks"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {savedPhrases.length > 0 ? (
            <>
              {/* Category Filter Pills */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
                <button
                  onClick={() => setFilterSituation('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    filterSituation === 'all'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All ({savedPhrases.length})
                </button>
                {situations.map((s) => {
                  const count = savedPhrases.filter((p) => p.situation === s.id).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setFilterSituation(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        filterSituation === s.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s.titleEn} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Grid of Pinned Phrases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((phrase) => {
                  const situation = situations.find((s) => s.id === phrase.situation);
                  return (
                    <PhraseCard
                      key={phrase.id}
                      phrase={phrase}
                      situation={situation}
                      isSaved={true}
                      isPracticed={practicedIds.includes(phrase.id)}
                      isPlaying={playingPhraseId === phrase.id}
                      onPlayAudio={onPlayAudio}
                      onToggleSave={onToggleSave}
                      onMarkPracticed={onMarkPracticed}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="py-12 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-sans">
                Your Pocketbook is empty
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
                Tap the bookmark icon on any phrase card while browsing to save it here for fast street access.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onBrowseSituations();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <span>Browse Everyday Phrases</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
          >
            Done
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {confirmClear && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-slate-200 shadow-xl">
            <h4 className="text-base font-bold text-slate-900">Clear Pocketbook?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This will unpin all saved phrases. Are you sure?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setConfirmClear(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
