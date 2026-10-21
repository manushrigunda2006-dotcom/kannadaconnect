import { useState, useMemo, useCallback } from 'react';
import type { SituationId, Phrase, ToastMessage, AppSettings } from './types';
import type { NavTab } from './components/MobileBottomNav';
import { SITUATIONS } from './data/situations';
import { PHRASES } from './data/phrases';
import { matchPhraseWithQuery } from './utils/search';
import { speakKannada, stopSpeech } from './utils/speech';
import {
  getSavedPhraseIds,
  toggleSavePhrase,
  clearSavedPhrases,
  getPracticeProgress,
  markPhrasePracticed,
  recordScenarioCompletion,
  recordQuizResult,
  resetPracticeProgress,
  loadJudgeDemoProfile,
  setDailyGoal,
  getAppSettings,
  saveAppSettings,
  hasCompletedOnboarding,
  setCompletedOnboarding,
  saveCustomCollection,
  deleteCustomCollection,
} from './utils/storage';

// Components
import { Header } from './components/Header';
import { HeroDailyPhrase } from './components/HeroDailyPhrase';
import { SituationPicker } from './components/SituationPicker';
import { PhraseGrid } from './components/PhraseGrid';
import { ConversationSimulator } from './components/ConversationSimulator';
import { QuizSection } from './components/QuizSection';
import { PronunciationStudio } from './components/PronunciationStudio';
import { QuickHelp } from './components/QuickHelp';
import { ProgressDashboard } from './components/ProgressDashboard';
import { PocketbookModal } from './components/PocketbookModal';
import { TripBackpackModal } from './components/TripBackpackModal';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SurpriseModal } from './components/SurpriseModal';
import { CultureGuideModal } from './components/CultureGuideModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';
import confetti from 'canvas-confetti';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedSituation, setSelectedSituation] = useState<SituationId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [studioInitialPhraseId, setStudioInitialPhraseId] = useState<string | undefined>(undefined);

  // Persisted Storage States
  const [savedIds, setSavedIds] = useState<string[]>(getSavedPhraseIds);
  const [progress, setProgress] = useState(getPracticeProgress);
  const [settings, setSettings] = useState<AppSettings>(getAppSettings);

  // Audio state
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);

  // Modals
  const [isPocketbookOpen, setIsPocketbookOpen] = useState(false);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [surprisePhrase, setSurprisePhrase] = useState<Phrase | null>(null);
  const [isCultureGuideOpen, setIsCultureGuideOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !hasCompletedOnboarding());

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

  // Daily featured phrase calculation
  const [featuredPhraseId, setFeaturedPhraseId] = useState<string>(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    const initialIndex = dayOfYear % PHRASES.length;
    return PHRASES[initialIndex]?.id || 'tr-01';
  });

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

  // Matches across all 6 categories for active query
  const allCategoryMatches = useMemo(() => {
    if (!searchQuery.trim()) return PHRASES;
    return PHRASES.filter((p) => matchPhraseWithQuery(p, searchQuery));
  }, [searchQuery]);

  // Filtered phrases for PhraseGrid (respecting active situation if one is chosen)
  const filteredPhrases = useMemo(() => {
    if (selectedSituation === 'all') {
      return allCategoryMatches;
    }
    return allCategoryMatches.filter((p) => p.situation === selectedSituation);
  }, [allCategoryMatches, selectedSituation]);

  const savedPhrasesList = useMemo(() => {
    return PHRASES.filter((p) => savedIds.includes(p.id));
  }, [savedIds]);

  // ================= ACTIONS =================

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
        if (!settings.reducedMotion) {
          confetti({
            particleCount: 110,
            spread: 85,
            origin: { y: 0.6 },
            colors: ['#1e3a8a', '#2563eb', '#f59e0b', '#16a34a'],
          });
        }
        showToast(
          '🎉 Daily Goal Reached!',
          `You have practiced ${updated.practicedPhraseIds.length} phrases today. Great job! (+10 XP)`,
          'success'
        );
      } else if (isNewPractice) {
        showToast(
          'Practiced! (+10 XP)',
          `"${phrase?.english || 'Phrase'}" marked as practiced today (${updated.practicedPhraseIds.length}/${updated.dailyGoal}).`,
          'success'
        );
      }
    },
    [showToast, settings.reducedMotion]
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
        rate: settings.speechRate,
        onStart: () => setPlayingPhraseId(phrase.id),
        onEnd: () => setPlayingPhraseId(null),
        onError: () => setPlayingPhraseId(null),
      });

      if (!result.hasVoice) {
        setPlayingPhraseId(null);
        showToast(
          'Native Kannada Voice Notice',
          `Your browser or OS does not have a dedicated Kannada voice pack installed. Please follow the Romanised pronunciation: "${phrase.romanized}".`,
          'warning'
        );
      }
    },
    [playingPhraseId, handleMarkPracticed, settings.speechRate, showToast]
  );

  const handleShuffleDaily = () => {
    const currentIdx = PHRASES.findIndex((p) => p.id === featuredPhraseId);
    let nextIdx = Math.floor(Math.random() * PHRASES.length);
    if (nextIdx === currentIdx) {
      nextIdx = (nextIdx + 1) % PHRASES.length;
    }
    setFeaturedPhraseId(PHRASES[nextIdx].id);
    showToast('Daily Phrase Updated', 'Explore a different everyday moment.', 'info');
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

  const handleOpenStudioForPhrase = (phraseId: string) => {
    setStudioInitialPhraseId(phraseId);
    setActiveTab('pronounce');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScenarioCompleted = (scenarioId: string, score: number) => {
    const updated = recordScenarioCompletion(scenarioId, score);
    setProgress(updated);
    showToast(
      'Role-Play Completed!',
      `Scenario solved with score ${score}. +${score * 15} XP added to your profile!`,
      'success'
    );
  };

  const handleQuizCompleted = (attempted: number, correct: number, earnedXp: number) => {
    const updated = recordQuizResult(attempted, correct, earnedXp);
    setProgress(updated);
    showToast(
      'Quiz Completed!',
      `Answered ${correct}/${attempted} questions correctly. +${earnedXp} XP earned!`,
      'success'
    );
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveAppSettings(newSettings);
    showToast('Settings Updated', 'Preferences saved.', 'info');
  };

  const handleLoadJudgeDemo = () => {
    const demo = loadJudgeDemoProfile();
    setProgress(demo);
    setSavedIds(getSavedPhraseIds());
    if (!settings.reducedMotion) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#2563eb', '#16a34a'],
      });
    }
    showToast(
      '🌟 Judge Demo Profile Loaded!',
      'Active profile loaded with 19 practiced phrases, 4-day streak, 420 XP, 3 completed scenarios, and 5 badges.',
      'success'
    );
  };

  const handleResetProgress = () => {
    const fresh = resetPracticeProgress();
    setProgress(fresh);
    showToast('Progress Reset', 'Practice progress reset to 0.', 'info');
  };

  const handleResetAllData = () => {
    clearSavedPhrases();
    setSavedIds([]);
    const fresh = resetPracticeProgress();
    setProgress(fresh);
    showToast('All Data Cleared', 'Pocketbook bookmarks and progress reset for a clean demo.', 'info');
  };

  const handleCreateCollection = (name: string, description: string, phraseIds: string[]) => {
    const updated = saveCustomCollection(name, description, phraseIds);
    setProgress(updated);
    showToast('Trip List Created', `"${name}" added to your backpack.`, 'success');
  };

  const handleDeleteCollection = (id: string) => {
    const updated = deleteCustomCollection(id);
    setProgress(updated);
    showToast('Trip List Removed', 'List deleted from backpack.', 'info');
  };

  const handleOnboardingGoal = (sitId: SituationId) => {
    setCompletedOnboarding();
    setIsOnboardingOpen(false);
    setSelectedSituation(sitId);
    setActiveTab('learn');
    showToast(
      'Goal Selected!',
      `Exploring ${SITUATIONS.find((s) => s.id === sitId)?.titleEn} phrases.`,
      'success'
    );
  };

  return (
    <div
      className={`min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans ${
        settings.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedIds.length}
        practicedCount={progress.practicedPhraseIds.length}
        dailyGoal={progress.dailyGoal}
        xp={progress.xp}
        language={settings.language}
        onOpenPocketbook={() => setIsPocketbookOpen(true)}
        onOpenBackpack={() => setIsBackpackOpen(true)}
        onOpenSurprise={handleOpenSurprise}
        onOpenCultureGuide={() => setIsCultureGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero & Daily Featured Phrase & Instant Search */}
            <HeroDailyPhrase
              phrase={featuredPhrase}
              situation={featuredSituation}
              isSaved={savedIds.includes(featuredPhrase.id)}
              isPracticed={progress.practicedPhraseIds.includes(featuredPhrase.id)}
              isPlaying={playingPhraseId === featuredPhrase.id}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                // Clear category filter so search finds phrases across all categories
                setSelectedSituation('all');
                if (q.trim()) {
                  setActiveTab('learn');
                }
              }}
              onPlayAudio={handlePlayAudio}
              onToggleSave={handleToggleSave}
              onMarkPracticed={handleMarkPracticed}
              onShuffleDaily={handleShuffleDaily}
              onStartLearning={() => {
                setActiveTab('learn');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreSituations={() => {
                setActiveTab('learn');
                document.getElementById('situations-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenStudio={handleOpenStudioForPhrase}
            />

            {/* 6 Situation Cards */}
            <SituationPicker
              situations={SITUATIONS}
              selectedSituation={selectedSituation}
              phraseCounts={situationCounts}
              totalCount={PHRASES.length}
              onSelect={(id) => {
                setSelectedSituation(id);
                setActiveTab('learn');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Preview Phrasebook Section (Top 6 phrases) */}
            <PhraseGrid
              phrases={filteredPhrases.slice(0, 6)}
              totalSearchMatchesAcrossAll={allCategoryMatches.length}
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
              onSelectSituation={(id) => setSelectedSituation(id)}
              onOpenStudio={handleOpenStudioForPhrase}
            />

            {/* CTA to view full phrasebook */}
            <div className="text-center pb-12">
              <button
                onClick={() => {
                  setActiveTab('learn');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>View Full Phrasebook ({PHRASES.length} Phrases)</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'learn' && (
          <>
            {/* Situation Picker Filter */}
            <SituationPicker
              situations={SITUATIONS}
              selectedSituation={selectedSituation}
              phraseCounts={situationCounts}
              totalCount={PHRASES.length}
              onSelect={(id) => setSelectedSituation(id)}
            />

            {/* Full Searchable PhraseGrid */}
            <PhraseGrid
              phrases={filteredPhrases}
              totalSearchMatchesAcrossAll={allCategoryMatches.length}
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
              onSelectSituation={(id) => setSelectedSituation(id)}
              onOpenStudio={handleOpenStudioForPhrase}
              onSearchChange={(q) => setSearchQuery(q)}
            />
          </>
        )}

        {activeTab === 'simulator' && (
          <ConversationSimulator
            onScenarioCompleted={handleScenarioCompleted}
            onOpenCultureGuide={() => setIsCultureGuideOpen(true)}
          />
        )}

        {activeTab === 'pronounce' && (
          <PronunciationStudio
            initialPhraseId={studioInitialPhraseId}
            onPhrasePracticed={handleMarkPracticed}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizSection onQuizCompleted={handleQuizCompleted} />
        )}

        {activeTab === 'quickhelp' && <QuickHelp />}

        {activeTab === 'progress' && (
          <ProgressDashboard
            progress={progress}
            phrases={PHRASES}
            onResetProgress={handleResetProgress}
            onLoadJudgeDemo={handleLoadJudgeDemo}
            onUpdateGoal={(goal) => {
              const updated = setDailyGoal(goal);
              setProgress(updated);
            }}
            onSelectSituation={(sitId) => {
              setSelectedSituation(sitId);
              setActiveTab('learn');
            }}
            onStartScenario={() => setActiveTab('simulator')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenCultureGuide={() => setIsCultureGuideOpen(true)}
        onOpenSurprise={handleOpenSurprise}
        onOpenQuickHelp={() => setActiveTab('quickhelp')}
        onResetAllData={handleResetAllData}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedIds.length}
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
        onClearAll={() => {
          clearSavedPhrases();
          setSavedIds([]);
          showToast('Pocketbook Cleared', 'All saved phrases removed.', 'info');
        }}
        onBrowseSituations={() => {
          setSelectedSituation('all');
          setActiveTab('learn');
        }}
      />

      <TripBackpackModal
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
        collections={progress.customCollections || []}
        allPhrases={PHRASES}
        onCreateCollection={handleCreateCollection}
        onDeleteCollection={handleDeleteCollection}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetAllData={handleResetAllData}
        onLoadJudgeDemo={handleLoadJudgeDemo}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => {
          setCompletedOnboarding();
          setIsOnboardingOpen(false);
        }}
        onSelectGoal={handleOnboardingGoal}
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
