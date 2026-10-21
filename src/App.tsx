import { useState, useMemo, useCallback } from 'react';
import type { SituationId, Phrase, ToastMessage } from './types';
import { SITUATIONS } from './data/situations';
import { PHRASES } from './data/phrases';
import { speakKannada, stopSpeech } from './utils/speech';
import {
  getSavedPhraseIds,
  toggleSavePhrase,
  clearSavedPhrases,
  getPracticeProgress,
  markPhrasePracticed,
  resetPracticeProgress,
  setDailyGoal,
} from './utils/storage';
import { Header } from './components/Header';
import { HeroDailyPhrase } from './components/HeroDailyPhrase';
import { SituationPicker } from './components/SituationPicker';
import { PhraseGrid } from './components/PhraseGrid';
import { PocketbookModal } from './components/PocketbookModal';
import { PracticeTracker } from './components/PracticeTracker';
import { SurpriseModal } from './components/SurpriseModal';
import { CultureGuideModal } from './components/CultureGuideModal';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';
import confetti from 'canvas-confetti';

export function App() {
  // Navigation & filtering state
  const [selectedSituation, setSelectedSituation] = useState<SituationId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Local storage persisted states
  const [savedIds, setSavedIds] = useState<string[]>(getSavedPhraseIds);
  const [progress, setProgress] = useState(getPracticeProgress);

  // Audio state
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);

  // Daily featured phrase based on day of year
  const [featuredPhraseId, setFeaturedPhraseId] = useState<string>(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const initialDailyIndex = dayOfYear % PHRASES.length;
    return PHRASES[initialDailyIndex]?.id || 'tr-01';
  });

  // Modals state
  const [isPocketbookOpen, setIsPocketbookOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [surprisePhrase, setSurprisePhrase] = useState<Phrase | null>(null);
  const [isCultureGuideOpen, setIsCultureGuideOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Featured phrase lookup
  const featuredPhrase = useMemo(() => {
    return PHRASES.find((p) => p.id === featuredPhraseId) || PHRASES[0];
  }, [featuredPhraseId]);

  const featuredSituation = useMemo(() => {
    return SITUATIONS.find((s) => s.id === featuredPhrase.situation);
  }, [featuredPhrase]);

  // Counts per situation
  const situationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PHRASES.forEach((p) => {
      counts[p.situation] = (counts[p.situation] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered phrases based on situation and search query
  const filteredPhrases = useMemo(() => {
    return PHRASES.filter((p) => {
      const matchesSituation =
        selectedSituation === 'all' || p.situation === selectedSituation;

      if (!matchesSituation) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchScript = p.kannada.includes(q);
      const matchRoman = p.romanized.toLowerCase().includes(q);
      const matchEnglish = p.english.toLowerCase().includes(q);
      const matchTip = p.tip.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));

      return matchScript || matchRoman || matchEnglish || matchTip || matchTags;
    });
  }, [selectedSituation, searchQuery]);

  // Saved phrase objects for the pocketbook
  const savedPhrasesList = useMemo(() => {
    return PHRASES.filter((p) => savedIds.includes(p.id));
  }, [savedIds]);

  // Actions
  const handleToggleSave = useCallback(
    (id: string) => {
      const updated = toggleSavePhrase(id);
      const isNowSaved = updated.includes(id);
      setSavedIds(updated);

      const phrase = PHRASES.find((p) => p.id === id);
      if (isNowSaved) {
        showToast(
          'Saved to Pocketbook',
          `"${phrase?.english || 'Phrase'}" pinned for quick street reference.`,
          'success'
        );
      } else {
        showToast('Removed from Pocketbook', 'Phrase unpinned.', 'info');
      }
    },
    [showToast]
  );

  const handleMarkPracticed = useCallback(
    (id: string) => {
      const { progress: updated, isNewPractice, goalCompletedJustNow } = markPhrasePracticed(id);
      setProgress(updated);

      const phrase = PHRASES.find((p) => p.id === id);

      if (goalCompletedJustNow) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#1B4332', '#84CC16', '#F59E0B', '#2D6A4F'],
        });
        showToast(
          '🎉 Daily Goal Reached!',
          `You have practiced ${updated.practicedPhraseIds.length} phrases today. Great job!`,
          'success'
        );
      } else if (isNewPractice) {
        showToast(
          'Practiced!',
          `"${phrase?.english || 'Phrase'}" marked as practiced today (${updated.practicedPhraseIds.length}/${updated.dailyGoal}).`,
          'success'
        );
      }
    },
    [showToast]
  );

  const handlePlayAudio = useCallback(
    async (phrase: Phrase) => {
      // Advance practice count whenever user listens
      handleMarkPracticed(phrase.id);

      if (playingPhraseId === phrase.id) {
        stopSpeech();
        setPlayingPhraseId(null);
        return;
      }

      setPlayingPhraseId(phrase.id);

      const result = await speakKannada(phrase.kannada, {
        onStart: () => setPlayingPhraseId(phrase.id),
        onEnd: () => setPlayingPhraseId(null),
        onError: () => setPlayingPhraseId(null),
      });

      if (!result.hasVoice) {
        setPlayingPhraseId(null);
        showToast(
          'Browser Kannada Voice Notice',
          `Your browser or OS currently does not have a synthetic Kannada speech voice installed. Please read the romanized pronunciation: "${phrase.romanized}".`,
          'warning'
        );
      }
    },
    [playingPhraseId, handleMarkPracticed, showToast]
  );

  const handleShuffleDaily = () => {
    const currentIdx = PHRASES.findIndex((p) => p.id === featuredPhraseId);
    let nextIdx = Math.floor(Math.random() * PHRASES.length);
    if (nextIdx === currentIdx) {
      nextIdx = (nextIdx + 1) % PHRASES.length;
    }
    setFeaturedPhraseId(PHRASES[nextIdx].id);
    showToast('Featured Phrase Updated', 'Explore a different everyday moment.', 'info');
  };

  const handleOpenSurprise = () => {
    const randomIndex = Math.floor(Math.random() * PHRASES.length);
    setSurprisePhrase(PHRASES[randomIndex]);
    setIsSurpriseOpen(true);
  };

  const handleNextSurprise = () => {
    const currentId = surprisePhrase?.id;
    const candidates = PHRASES.filter((p) => p.id !== currentId);
    const randomIndex = Math.floor(Math.random() * candidates.length);
    setSurprisePhrase(candidates[randomIndex]);
  };

  const handleClearAllSaved = () => {
    clearSavedPhrases();
    setSavedIds([]);
    showToast('Pocketbook Cleared', 'All saved phrases removed.', 'info');
  };

  const handleResetProgress = () => {
    const fresh = resetPracticeProgress();
    setProgress(fresh);
    showToast('Progress Reset', "Today's practice count has been reset to 0.", 'info');
  };

  const handleUpdateGoal = (g: number) => {
    const updated = setDailyGoal(g);
    setProgress(updated);
    showToast('Goal Updated', `Daily practice target set to ${g} phrases.`, 'info');
  };

  const handleResetAllData = () => {
    clearSavedPhrases();
    setSavedIds([]);
    const fresh = resetPracticeProgress();
    setProgress(fresh);
    showToast('Demo Data Reset', 'Saved items and demo progress cleared.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        savedCount={savedIds.length}
        practicedCount={progress.practicedPhraseIds.length}
        dailyGoal={progress.dailyGoal}
        onOpenPocketbook={() => setIsPocketbookOpen(true)}
        onOpenSurprise={handleOpenSurprise}
        onOpenCultureGuide={() => setIsCultureGuideOpen(true)}
        onOpenProgress={() => setIsProgressOpen(true)}
      />

      <main className="flex-1">
        {/* Hero & Daily Featured Phrase & Search */}
        <HeroDailyPhrase
          phrase={featuredPhrase}
          situation={featuredSituation}
          isSaved={savedIds.includes(featuredPhrase.id)}
          isPracticed={progress.practicedPhraseIds.includes(featuredPhrase.id)}
          isPlaying={playingPhraseId === featuredPhrase.id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPlayAudio={handlePlayAudio}
          onToggleSave={handleToggleSave}
          onMarkPracticed={handleMarkPracticed}
          onShuffleDaily={handleShuffleDaily}
          onSelectSituation={(sitId) => {
            setSelectedSituation(sitId as SituationId);
            document.getElementById('phrasebook-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 6 Situations Picker Cards */}
        <SituationPicker
          situations={SITUATIONS}
          selectedSituation={selectedSituation}
          phraseCounts={situationCounts}
          totalCount={PHRASES.length}
          onSelect={(id) => {
            setSelectedSituation(id);
            document.getElementById('phrasebook-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Filtered Phrasebook Section */}
        <PhraseGrid
          phrases={filteredPhrases}
          situations={SITUATIONS}
          selectedSituation={selectedSituation}
          searchQuery={searchQuery}
          savedIds={savedIds}
          practicedIds={progress.practicedPhraseIds}
          playingPhraseId={playingPhraseId}
          onPlayAudio={handlePlayAudio}
          onToggleSave={handleToggleSave}
          onMarkPracticed={handleMarkPracticed}
          onClearSearch={() => setSearchQuery('')}
          onResetSituation={() => setSelectedSituation('all')}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenCultureGuide={() => setIsCultureGuideOpen(true)}
        onOpenSurprise={handleOpenSurprise}
        onResetAllData={handleResetAllData}
      />

      {/* Modals & Drawers */}
      <PocketbookModal
        isOpen={isPocketbookOpen}
        onClose={() => setIsPocketbookOpen(false)}
        savedPhrases={savedPhrasesList}
        situations={SITUATIONS}
        practicedIds={progress.practicedPhraseIds}
        playingPhraseId={playingPhraseId}
        onPlayAudio={handlePlayAudio}
        onToggleSave={handleToggleSave}
        onMarkPracticed={handleMarkPracticed}
        onClearAll={handleClearAllSaved}
        onBrowseSituations={() => {
          setSelectedSituation('all');
          document.getElementById('situation-picker-heading')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <PracticeTracker
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        progress={progress}
        phrases={PHRASES}
        onResetProgress={handleResetProgress}
        onUpdateGoal={handleUpdateGoal}
        onSelectSituation={(sitId) => {
          setSelectedSituation(sitId as SituationId);
          document.getElementById('phrasebook-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <SurpriseModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        phrase={surprisePhrase}
        situation={
          surprisePhrase ? SITUATIONS.find((s) => s.id === surprisePhrase.situation) : undefined
        }
        isSaved={surprisePhrase ? savedIds.includes(surprisePhrase.id) : false}
        isPracticed={
          surprisePhrase ? progress.practicedPhraseIds.includes(surprisePhrase.id) : false
        }
        isPlaying={surprisePhrase ? playingPhraseId === surprisePhrase.id : false}
        onNextSurprise={handleNextSurprise}
        onPlayAudio={handlePlayAudio}
        onToggleSave={handleToggleSave}
        onMarkPracticed={handleMarkPracticed}
      />

      <CultureGuideModal
        isOpen={isCultureGuideOpen}
        onClose={() => setIsCultureGuideOpen(false)}
      />

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
