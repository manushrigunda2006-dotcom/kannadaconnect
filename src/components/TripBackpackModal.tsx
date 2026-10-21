import React, { useState } from 'react';
import type { CustomCollection, Phrase } from '../types';
import { X, Plus, Trash2, Copy, CheckCheck, Volume2, VolumeX } from 'lucide-react';
import { speakKannada, stopSpeech } from '../utils/speech';

interface TripBackpackModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: CustomCollection[];
  allPhrases: Phrase[];
  onCreateCollection: (name: string, description: string, phraseIds: string[]) => void;
  onDeleteCollection: (id: string) => void;
}

export const TripBackpackModal: React.FC<TripBackpackModalProps> = ({
  isOpen,
  onClose,
  collections,
  allPhrases,
  onCreateCollection,
  onDeleteCollection,
}) => {
  const [activeCollectionId, setActiveCollectionId] = useState<string>(
    collections[0]?.id || ''
  );
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCollection =
    collections.find((c) => c.id === activeCollectionId) || collections[0];

  const collectionPhrases = currentCollection
    ? allPhrases.filter((p) => currentCollection.phraseIds.includes(p.id))
    : [];

  const handlePlay = async (phrase: Phrase) => {
    if (playingId === phrase.id) {
      stopSpeech();
      setPlayingId(null);
      return;
    }
    setPlayingId(phrase.id);
    await speakKannada(phrase.kannada, {
      rate: 0.85,
      onStart: () => setPlayingId(phrase.id),
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  const handleCopyAll = async () => {
    if (!collectionPhrases.length) return;
    const text = collectionPhrases
      .map((p) => `${p.kannada}\n(${p.romanized})\nMeaning: ${p.english}\n`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateCollection(newTitle.trim(), newDesc.trim(), selectedPhrases);
    setNewTitle('');
    setNewDesc('');
    setSelectedPhrases([]);
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              🎒
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-sans">Trip Backpack</h3>
              <p className="text-xs text-slate-500">Curated phrase lists for your specific trips and outings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Collection Tab Selector */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {collections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCollectionId(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    activeCollectionId === c.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.name} ({c.phraseIds.length})
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New List</span>
            </button>
          </div>

          {/* Create New Collection Form */}
          {isCreating && (
            <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Create Custom Trip List</h4>
              <input
                type="text"
                placeholder="List name (e.g. Indiranagar Saturday Market)..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Description / Context..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />

              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Pick initial phrases:</label>
                <div className="max-h-32 overflow-y-auto space-y-1 bg-white p-2 rounded-xl border border-slate-200">
                  {allPhrases.slice(0, 15).map((p) => {
                    const isChecked = selectedPhrases.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedPhrases((prev) =>
                              isChecked ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                            );
                          }}
                          className="rounded text-blue-600"
                        />
                        <span className="truncate">{p.english} — <span className="font-kannada">{p.kannada}</span></span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                >
                  Save List
                </button>
              </div>
            </form>
          )}

          {/* Active Collection View */}
          {currentCollection ? (
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{currentCollection.name}</h4>
                  <p className="text-xs text-slate-500">{currentCollection.description || 'Personal backpack list'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAll}
                    disabled={!collectionPhrases.length}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Copy all phrases in list for WhatsApp or offline notes"
                  >
                    {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied All!' : 'Copy All'}</span>
                  </button>

                  {collections.length > 1 && (
                    <button
                      onClick={() => onDeleteCollection(currentCollection.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete this collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Phrase Cards */}
              <div className="space-y-2.5">
                {collectionPhrases.length > 0 ? (
                  collectionPhrases.map((phrase) => {
                    const isPlaying = playingId === phrase.id;
                    return (
                      <div
                        key={phrase.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-base font-bold font-kannada text-slate-900">{phrase.kannada}</p>
                          <p className="text-xs font-mono font-semibold text-blue-800">{phrase.romanized}</p>
                          <p className="text-xs text-slate-600 italic">"{phrase.english}"</p>
                        </div>

                        <button
                          onClick={() => handlePlay(phrase)}
                          className={`p-2 rounded-xl text-xs font-semibold text-white transition-all ${
                            isPlaying ? 'bg-amber-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
                    No phrases added to this backpack list yet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No collections found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
