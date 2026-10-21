import React, { useState, useEffect } from 'react';
import type { Phrase } from '../types';
import { PHRASES } from '../data/phrases';
import {
  speakKannada,
  stopSpeech,
  isSpeechRecognitionSupported,
  startListening,
  calculateSpeechScore,
  type RecognitionSession,
} from '../utils/speech';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface PronunciationStudioProps {
  initialPhraseId?: string;
  onPhrasePracticed?: (phraseId: string) => void;
}

export const PronunciationStudio: React.FC<PronunciationStudioProps> = ({
  initialPhraseId,
  onPhrasePracticed,
}) => {
  const [selectedPhraseId, setSelectedPhraseId] = useState<string>(
    initialPhraseId || PHRASES[0].id
  );
  const [prevInitialPhraseId, setPrevInitialPhraseId] = useState(initialPhraseId);
  if (initialPhraseId && initialPhraseId !== prevInitialPhraseId) {
    setPrevInitialPhraseId(initialPhraseId);
    setSelectedPhraseId(initialPhraseId);
  }

  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85); // 0.7, 0.85, 1.0
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [recognitionSession, setRecognitionSession] = useState<RecognitionSession | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string;
    guidanceTip: string;
  } | null>(null);

  const speechSupported = isSpeechRecognitionSupported();

  const phrase: Phrase =
    PHRASES.find((p) => p.id === selectedPhraseId) || PHRASES[0];

  // Clean up any ongoing audio or mic on unmount or phrase change
  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionSession) {
        recognitionSession.stop();
      }
    };
  }, [recognitionSession]);

  const handlePhraseSelect = (id: string) => {
    stopSpeech();
    if (recognitionSession) {
      recognitionSession.stop();
      setRecognitionSession(null);
    }
    setSelectedPhraseId(id);
    setTranscript('');
    setEvaluation(null);
    setRecognitionError(null);
    setIsListening(false);
    setIsPlayingAudio(false);
  };

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    await speakKannada(phrase.kannada, {
      rate: playbackSpeed,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => {
        setIsPlayingAudio(false);
        onPhrasePracticed?.(phrase.id);
      },
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleStartListening = () => {
    if (!speechSupported) {
      setRecognitionError(
        'Speech recognition is not supported in this browser. You can still listen and practice aloud!'
      );
      return;
    }

    if (isListening) {
      recognitionSession?.stop();
      setIsListening(false);
      return;
    }

    setTranscript('');
    setEvaluation(null);
    setRecognitionError(null);
    setIsListening(true);

    const session = startListening(
      {
        onResult: (text, isFinal) => {
          setTranscript(text);
          if (isFinal || text.length > 3) {
            const result = calculateSpeechScore(text, phrase.kannada, phrase.romanized);
            setEvaluation(result);
            if (result.score >= 50) {
              onPhrasePracticed?.(phrase.id);
            }
          }
        },
        onError: (err) => {
          setRecognitionError(
            err === 'not-allowed'
              ? 'Microphone permission was not granted. Please allow mic access in your browser bar.'
              : `Microphone status: ${err}`
          );
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      'kn-IN'
    );

    setRecognitionSession(session);
  };

  const handleResetSession = () => {
    setTranscript('');
    setEvaluation(null);
    setRecognitionError(null);
    setIsListening(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Section Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          Pronunciation & Speaking Studio
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Listen, Slow Down & Speak Confidently
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
          Hear native speech pacing, study Romanised syllable breakdowns, and practice repeating aloud with optional browser voice detection.
        </p>
      </div>

      {/* Phrase Selector Bar */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Select Phrase to Practice:
        </label>
        <select
          value={selectedPhraseId}
          onChange={(e) => handlePhraseSelect(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        >
          {PHRASES.map((p) => (
            <option key={p.id} value={p.id}>
              [{p.situation.toUpperCase()}] {p.english} — {p.kannada}
            </option>
          ))}
        </select>
      </div>

      {/* Main Pronunciation Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative mb-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
              {phrase.situation}
            </span>
            <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {phrase.usageStyle}
            </span>
          </div>

          {/* Speed Controller */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <span className="text-[11px] font-bold text-slate-600 mr-1">Speed:</span>
            {[
              { val: 0.7, label: '0.7x (Slow)' },
              { val: 0.85, label: '0.85x' },
              { val: 1.0, label: '1.0x' },
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => setPlaybackSpeed(s.val)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  playbackSpeed === s.val
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Big Native Kannada Script */}
        <div className="text-center py-4 sm:py-6">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-kannada text-slate-900 leading-tight tracking-normal mb-3">
            {phrase.kannada}
          </h3>
          <p className="text-lg sm:text-xl font-bold font-mono text-blue-800 mb-2">
            {phrase.romanized}
          </p>
          <p className="text-base text-slate-600 italic max-w-lg mx-auto">
            "{phrase.english}"
          </p>

          {/* Syllable Breakdown */}
          {phrase.pronunciationNotes && (
            <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 mr-1">Breakdown:</span>
              {phrase.pronunciationNotes.split(/[\s-]+/).map((chunk, i) => (
                <span
                  key={i}
                  className="bg-white border border-slate-200 text-slate-800 font-mono text-xs font-bold px-2 py-0.5 rounded-md shadow-2xs"
                >
                  {chunk}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Audio Listen & Mic Action Controls */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4">
          {/* Play Audio Button */}
          <button
            onClick={handlePlayAudio}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm sm:text-base text-white shadow-sm transition-all ${
              isPlayingAudio
                ? 'bg-amber-600 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-500/20'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{isPlayingAudio ? 'Speaking...' : `Listen (${playbackSpeed}x)`}</span>
          </button>

          {/* Practice Speaking (Mic) Button */}
          <button
            onClick={handleStartListening}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all border shadow-sm ${
              isListening
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse ring-2 ring-rose-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isListening ? 'Listening... (Speak Now)' : 'Practice Speaking'}</span>
          </button>
        </div>

        {/* Speech Recognition Feedback Area */}
        <div className="mt-6">
          {isListening && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-center animate-pulse">
              <p className="text-xs font-bold uppercase tracking-wider mb-1">Microphone Active</p>
              <p className="text-sm font-semibold">
                Say: "{phrase.romanized}" clearly into your mic...
              </p>
            </div>
          )}

          {transcript && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mt-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                <span>What your browser heard:</span>
                <button
                  onClick={handleResetSession}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-700"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
              <p className="text-base font-semibold text-slate-900 font-sans">
                "{transcript}"
              </p>
            </div>
          )}

          {evaluation && (
            <div className="mt-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm sm:text-base">{evaluation.feedback}</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                  {evaluation.score}% Match
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed font-sans">
                💡 <span className="font-semibold">Coaching Tip:</span> {evaluation.guidanceTip}
              </p>
            </div>
          )}

          {recognitionError && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Microphone Note:</p>
                <p className="mt-0.5">{recognitionError}</p>
                <p className="text-xs text-amber-800 mt-1">
                  Microphone practice is optional and best-effort. Browser Speech Recognition varies across operating systems.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cultural Context Tip */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-amber-900">Street Context:</span> {phrase.context}. {phrase.tip}
          </p>
        </div>
      </div>
    </div>
  );
};
