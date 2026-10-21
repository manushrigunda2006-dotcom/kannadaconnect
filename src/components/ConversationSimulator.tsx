import React, { useState } from 'react';
import type { ScenarioStep } from '../types';
import { SCENARIOS } from '../data/scenarios';
import { Volume2, VolumeX, Lightbulb, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, Sparkles, MessageSquare } from 'lucide-react';
import { speakKannada, stopSpeech } from '../utils/speech';
import confetti from 'canvas-confetti';

interface ConversationSimulatorProps {
  onScenarioCompleted: (scenarioId: string, score: number) => void;
  onOpenCultureGuide?: () => void;
}

export const ConversationSimulator: React.FC<ConversationSimulatorProps> = ({
  onScenarioCompleted,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [revealedHint, setRevealedHint] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isScenarioFinished, setIsScenarioFinished] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];
  const step: ScenarioStep = scenario.steps[currentStepIndex];

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    resetScenario();
  };

  const resetScenario = () => {
    stopSpeech();
    setCurrentStepIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setRevealedHint(false);
    setCorrectAnswersCount(0);
    setIsScenarioFinished(false);
    setIsPlayingAudio(false);
  };

  const handlePlayAudio = async (text: string) => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    await speakKannada(text, {
      rate: 0.82,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleOptionSelect = (optId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmitChoice = () => {
    if (!selectedOptionId || hasSubmitted) return;
    setHasSubmitted(true);

    const chosen = step.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextStep = () => {
    stopSpeech();
    setIsPlayingAudio(false);

    if (currentStepIndex + 1 < scenario.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasSubmitted(false);
      setRevealedHint(false);
    } else {
      // Scenario Complete!
      setIsScenarioFinished(true);
      const finalScore = correctAnswersCount + (step.options.find((o) => o.id === selectedOptionId)?.isCorrect ? 1 : 0);
      onScenarioCompleted(scenario.id, finalScore);

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#1e3a8a', '#2563eb', '#f59e0b', '#16a34a'],
      });
    }
  };

  const chosenOption = step.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-2">
          <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
          Interactive Role-Play Simulator
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Real-Life Kannada Conversations
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
          Step into realistic Bengaluru situations. Listen to local speakers, choose culturally polite responses, and learn why phrases work on the street.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
        {SCENARIOS.map((sc) => {
          const isCurrent = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 shadow-xs ${
                isCurrent
                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-blue-500/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">{sc.character.avatar}</span>
              <span>{sc.title}</span>
            </button>
          );
        })}
      </div>

      {/* Scenario Active Area */}
      {!isScenarioFinished ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Top Banner: Scenario Setup */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{scenario.character.avatar}</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-sans">{scenario.title}</h3>
                  <p className="text-xs text-blue-200 font-kannada font-medium">{scenario.kannadaTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full border border-blue-700/60 font-semibold">
                  Step {currentStepIndex + 1} of {scenario.steps.length}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {scenario.description}
            </p>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            {/* Speaker Line (Character Bubble) */}
            <div className="flex items-start gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${scenario.character.avatarBg}`}>
                {scenario.character.avatar}
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 relative">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    {scenario.character.name} <span className="text-slate-400 font-normal">({scenario.character.role})</span>
                  </span>
                  <button
                    onClick={() => handlePlayAudio(step.speakerLine.kannada)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                    title="Listen to native pronunciation"
                  >
                    {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? 'Playing' : 'Listen'}</span>
                  </button>
                </div>

                <p className="text-xl sm:text-2xl font-bold font-kannada text-slate-900 mb-1 leading-relaxed">
                  {step.speakerLine.kannada}
                </p>
                <p className="text-xs sm:text-sm font-semibold font-mono text-blue-800 mb-1">
                  {step.speakerLine.romanized}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 italic">
                  "{step.speakerLine.english}"
                </p>
              </div>
            </div>

            {/* User Goal Prompt & Hint */}
            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Your Objective:</span>
                  <p className="text-sm font-medium text-amber-950 mt-0.5">{step.userPrompt}</p>
                </div>
                <button
                  onClick={() => setRevealedHint(!revealedHint)}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200/80 px-2.5 py-1 rounded-lg transition-colors shrink-0"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{revealedHint ? 'Hide Hint' : 'Reveal Hint'}</span>
                </button>
              </div>

              {revealedHint && (
                <div className="mt-2.5 pt-2.5 border-t border-amber-200/60 text-xs text-amber-900 leading-relaxed font-sans">
                  💡 <span className="font-semibold">Cultural Hint:</span> {step.hint}
                </div>
              )}
            </div>

            {/* Multiple Choice Options */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Choose the best response:
              </label>
              <div className="space-y-3">
                {step.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let cardStyle = 'border-slate-200 hover:border-blue-300 bg-white';

                  if (hasSubmitted) {
                    if (opt.isCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500';
                    } else if (isSelected) {
                      cardStyle = 'border-rose-400 bg-rose-50/70';
                    } else {
                      cardStyle = 'border-slate-200 opacity-60 bg-white';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      disabled={hasSubmitted}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 relative ${cardStyle}`}
                    >
                      <div className="mt-0.5">
                        {hasSubmitted && opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : hasSubmitted && isSelected && !opt.isCorrect ? (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-base sm:text-lg font-bold font-kannada text-slate-900 leading-relaxed">
                          {opt.kannada}
                        </p>
                        <p className="text-xs sm:text-sm font-mono text-blue-900 font-semibold mt-0.5">
                          {opt.romanized}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                          "{opt.english}"
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Panel (Appears after submission) */}
            {hasSubmitted && chosenOption && (
              <div
                className={`p-4 sm:p-5 rounded-2xl border leading-relaxed text-sm ${
                  chosenOption.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {chosenOption.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Excellent Choice! (+15 XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Not quite the best fit:</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm mt-1">{chosenOption.explanation}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={resetScenario}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart</span>
              </button>

              <div>
                {!hasSubmitted ? (
                  <button
                    onClick={handleSubmitChoice}
                    disabled={!selectedOptionId}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all ${
                      selectedOptionId
                        ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-500/20'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Confirm Response</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all ring-2 ring-slate-800/20"
                  >
                    <span>{currentStepIndex + 1 < scenario.steps.length ? 'Next Dialogue' : 'Finish Scenario'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scenario Finished Summary Card */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
            🏆
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Scenario Completed!
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
            {scenario.title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            You successfully completed this real-life interaction simulator!
          </p>

          {/* Score Box */}
          <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-around">
            <div>
              <span className="text-xs uppercase text-slate-500 font-bold block">Score</span>
              <span className="text-2xl font-mono font-black text-slate-900">
                {correctAnswersCount}/{scenario.steps.length}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs uppercase text-slate-500 font-bold block">XP Earned</span>
              <span className="text-2xl font-mono font-black text-amber-600">
                +{correctAnswersCount * 15} XP
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs uppercase text-slate-500 font-bold block">Badge</span>
              <span className="text-2xl">🎭</span>
            </div>
          </div>

          {/* Cultural Takeaway */}
          <div className="text-left bg-blue-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 mb-6 text-xs sm:text-sm text-blue-950 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
              <Award className="w-4 h-4 text-blue-700" />
              <span>Cultural Street Wisdom:</span>
            </div>
            <p>{scenario.culturalTakeaway}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={resetScenario}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Scenario</span>
            </button>

            {/* Try next scenario */}
            <button
              onClick={() => {
                const currentIdx = SCENARIOS.findIndex((s) => s.id === scenario.id);
                const nextScenario = SCENARIOS[(currentIdx + 1) % SCENARIOS.length];
                handleSelectScenario(nextScenario.id);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <span>Next Scenario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
