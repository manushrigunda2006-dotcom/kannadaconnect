import React, { useState, useMemo } from 'react';
import type { QuizQuestion, QuizType } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { Volume2, VolumeX, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles, HelpCircle, Trophy } from 'lucide-react';
import { speakKannada, stopSpeech } from '../utils/speech';
import confetti from 'canvas-confetti';

interface QuizSectionProps {
  onQuizCompleted: (attempted: number, correct: number, earnedXp: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onQuizCompleted }) => {
  const [selectedFilter, setSelectedFilter] = useState<QuizType | 'all' | 'daily'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Filtered pool of questions
  const questions: QuizQuestion[] = useMemo(() => {
    if (selectedFilter === 'all') return QUIZ_QUESTIONS;
    if (selectedFilter === 'daily') return QUIZ_QUESTIONS.slice(0, 5); // 5-question daily sprint
    return QUIZ_QUESTIONS.filter((q) => q.type === selectedFilter);
  }, [selectedFilter]);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectFilter = (filter: QuizType | 'all' | 'daily') => {
    setSelectedFilter(filter);
    resetQuiz();
  };

  const resetQuiz = () => {
    stopSpeech();
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasChecked(false);
    setScore(0);
    setIsFinished(false);
    setIsPlayingAudio(false);
  };

  const handlePlayAudio = async (text?: string) => {
    const textToPlay = text || currentQ.audioText || currentQ.kannadaText;
    if (!textToPlay) return;

    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    await speakKannada(textToPlay, {
      rate: 0.82,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleSelectOption = (opt: string) => {
    if (hasChecked) return;
    setSelectedAnswer(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || hasChecked) return;
    setHasChecked(true);

    if (selectedAnswer === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    stopSpeech();
    setIsPlayingAudio(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasChecked(false);
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedAnswer === currentQ.correctAnswer ? 1 : 0);
      const earnedXp = finalScore * 10;
      onQuizCompleted(questions.length, finalScore, earnedXp);

      if (finalScore >= Math.ceil(questions.length * 0.7)) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#f59e0b', '#10b981', '#6366f1'],
        });
      }
    }
  };

  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-700" />
          Knowledge Checks & Quizzes
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Test Your Kannada in Real Situations
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
          Reinforce your vocabulary and street readiness with multiple-choice, dialogue response, fill-in-the-blank, and listening challenges.
        </p>
      </div>

      {/* Mode Filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {[
          { id: 'all', label: 'All Questions' },
          { id: 'daily', label: '⚡ Daily 5-Q Sprint' },
          { id: 'translation', label: 'Translation' },
          { id: 'context', label: 'Situations' },
          { id: 'fill_blank', label: 'Fill-in-the-Blank' },
          { id: 'listening', label: '🎧 Listening' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSelectFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border shadow-xs ${
              selectedFilter === tab.id
                ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quiz Card */}
      {!isFinished ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 mb-3">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-blue-600">Score: {score}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Prompt */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {currentQ.type.replace('_', ' ')}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 capitalize">
                {currentQ.situation}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.prompt}
            </h3>

            {/* If there is Kannada text or listening prompt */}
            {(currentQ.kannadaText || currentQ.audioText) && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 flex items-center justify-between gap-3">
                <div>
                  {currentQ.kannadaText && (
                    <p className="text-xl sm:text-2xl font-bold font-kannada text-slate-900">
                      {currentQ.kannadaText}
                    </p>
                  )}
                  {currentQ.romanizedText && (
                    <p className="text-xs sm:text-sm font-mono text-blue-900 font-semibold mt-0.5">
                      {currentQ.romanizedText}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handlePlayAudio()}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-all shrink-0 ${
                    isPlayingAudio ? 'bg-amber-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  title="Play audio clip"
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'Playing' : 'Audio'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              let style = 'border-slate-200 hover:border-blue-300 bg-white text-slate-800';

              if (hasChecked) {
                if (opt === currentQ.correctAnswer) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500 font-semibold';
                } else if (isSelected) {
                  style = 'border-rose-400 bg-rose-50 text-rose-950';
                } else {
                  style = 'border-slate-200 opacity-60 bg-white text-slate-500';
                }
              } else if (isSelected) {
                style = 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-950 font-semibold';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasChecked}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${style}`}
                >
                  <span className="text-sm sm:text-base">{opt}</span>
                  {hasChecked && opt === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasChecked && isSelected && opt !== currentQ.correctAnswer && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {hasChecked && (
            <div
              className={`p-4 rounded-2xl border mb-6 text-xs sm:text-sm leading-relaxed ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct! (+10 XP)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Incorrect</span>
                  </>
                )}
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Quiz</span>
            </button>

            <div>
              {!hasChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${
                    selectedAnswer
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center text-3xl mx-auto mb-4">
            <Trophy className="w-8 h-8 text-blue-700" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
            Quiz Completed!
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Great job testing your real-life everyday Kannada skills!
          </p>

          <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-around">
            <div>
              <span className="text-xs uppercase text-slate-500 font-bold block">Final Score</span>
              <span className="text-2xl font-mono font-black text-slate-900">
                {score}/{questions.length}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs uppercase text-slate-500 font-bold block">Accuracy</span>
              <span className="text-2xl font-mono font-black text-blue-600">
                {Math.round((score / Math.max(1, questions.length)) * 100)}%
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <span className="text-xs uppercase text-slate-500 font-bold block">XP Gained</span>
              <span className="text-2xl font-mono font-black text-amber-600">
                +{score * 10} XP
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => handleSelectFilter('daily')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Daily Challenge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
