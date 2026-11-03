import React, { useState, useEffect, useRef } from 'react';
import type { Phrase } from '../types';
import { PHRASES } from '../data/phrases';
import {
  speakKannada,
  stopSpeech,
  isSpeechRecognitionSupported,
  startListening,
  calculateSpeechScore,
  requestMicrophoneAccess,
  getMicrophonePermissionState,
  type RecognitionSession,
  type SpeechRecognitionErrorDetails,
  type MicrophonePermissionState,
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
  RefreshCw,
  Keyboard,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight,
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

  // Audio Playback State
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85); // 0.7, 0.85, 1.0
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Active Practice Mode: 'mic' or 'text'
  const [practiceMode, setPracticeMode] = useState<'mic' | 'text'>('mic');

  // Speech Recognition & Microphone State
  const [isListening, setIsListening] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [recognitionSession, setRecognitionSession] = useState<RecognitionSession | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<SpeechRecognitionErrorDetails | null>(null);
  const [permissionState, setPermissionState] = useState<MicrophonePermissionState>('prompt');
  const [showBrowserGuide, setShowBrowserGuide] = useState(false);
  const [activeBrowserTab, setActiveBrowserTab] = useState<'chrome' | 'edge'>('chrome');

  // Evaluation state
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string;
    guidanceTip: string;
  } | null>(null);

  // Text-Based Practice Alternative State
  const [textPracticeInput, setTextPracticeInput] = useState<string>('');
  const [textPracticeEvaluation, setTextPracticeEvaluation] = useState<{
    score: number;
    feedback: string;
    guidanceTip: string;
  } | null>(null);

  const speechSupported = isSpeechRecognitionSupported();
  const phrase: Phrase =
    PHRASES.find((p) => p.id === selectedPhraseId) || PHRASES[0];

  // Ref to track active session for clean cleanup
  const activeSessionRef = useRef<RecognitionSession | null>(null);

  useEffect(() => {
    activeSessionRef.current = recognitionSession;
  }, [recognitionSession]);

  // Check initial permission state without triggering prompts
  useEffect(() => {
    getMicrophonePermissionState().then((state) => {
      setPermissionState(state);
    });
  }, []);

  // Requirement 9: Clean up any ongoing audio and microphone tracks on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (activeSessionRef.current) {
        activeSessionRef.current.stop();
        activeSessionRef.current = null;
      }
    };
  }, []);

  // When changing phrase, stop active recognition cleanly and reset outputs
  const handlePhraseSelect = (id: string) => {
    stopSpeech();
    if (recognitionSession) {
      recognitionSession.stop();
      setRecognitionSession(null);
    }
    setSelectedPhraseId(id);
    setTranscript('');
    setEvaluation(null);
    setErrorDetails(null);
    setIsListening(false);
    setIsRequestingPermission(false);
    setIsPlayingAudio(false);
    setTextPracticeInput('');
    setTextPracticeEvaluation(null);
  };

  // Requirement 8: Audio playback never blocked by mic permission
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

  // Requirement 9: Stop speaking & mic session cleanly
  const handleStopListening = () => {
    if (recognitionSession) {
      recognitionSession.stop();
      setRecognitionSession(null);
    }
    setIsListening(false);
    setIsRequestingPermission(false);
  };

  // Requirement 1: Request permission ONLY when clicking Start Speaking
  const handleStartSpeaking = async () => {
    // If already listening, stop
    if (isListening) {
      handleStopListening();
      return;
    }

    // Requirement 6: Detect browser support before enabling
    if (!speechSupported) {
      setErrorDetails({
        type: 'unsupported_browser',
        message:
          'Web Speech Recognition is not supported in this browser. Chrome or Edge are recommended. You can use our Text Practice alternative right now!',
        rawCode: 'unsupported',
      });
      return;
    }

    // Reset previous feedback & errors
    setTranscript('');
    setEvaluation(null);
    setErrorDetails(null);
    setIsRequestingPermission(true);

    // Requirement 1 & 9: Explicitly test / probe microphone permission
    const accessResult = await requestMicrophoneAccess();
    setIsRequestingPermission(false);

    if (!accessResult.success) {
      const errType = accessResult.errorType || 'permission_denied';
      setErrorDetails({
        type: errType,
        message:
          accessResult.message ||
          'Microphone permission was not granted. Please allow microphone access in your browser bar.',
        rawCode: errType,
      });
      setPermissionState(errType === 'permission_denied' ? 'denied' : 'prompt');
      if (errType === 'permission_denied') {
        setShowBrowserGuide(true);
      }
      return;
    }

    // Permission granted! Now start speech recognition session
    setPermissionState('granted');
    setIsListening(true);

    const session = startListening(
      {
        onStart: () => {
          setIsListening(true);
          setErrorDetails(null);
        },
        onResult: (text, isFinal) => {
          setTranscript(text);
          if (isFinal || text.length > 2) {
            const result = calculateSpeechScore(text, phrase.kannada, phrase.romanized);
            setEvaluation(result);
            if (result.score >= 50) {
              onPhrasePracticed?.(phrase.id);
            }
          }
        },
        onError: (err) => {
          setErrorDetails(err);
          setIsListening(false);
          if (err.type === 'permission_denied') {
            setPermissionState('denied');
            setShowBrowserGuide(true);
          }
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      'kn-IN'
    );

    setRecognitionSession(session);
  };

  // Requirement 4: Retry Permission button action
  const handleRetryPermission = async () => {
    setErrorDetails(null);
    await handleStartSpeaking();
  };

  // Reset session
  const handleResetSession = () => {
    handleStopListening();
    setTranscript('');
    setEvaluation(null);
    setErrorDetails(null);
  };

  // Requirement 7: Text-based practice evaluation
  const handleEvaluateTextPractice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textPracticeInput.trim()) return;

    const result = calculateSpeechScore(
      textPracticeInput.trim(),
      phrase.kannada,
      phrase.romanized
    );
    setTextPracticeEvaluation(result);
    if (result.score >= 50) {
      onPhrasePracticed?.(phrase.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
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
          Hear native spoken Kannada pacing, inspect Romanised syllables, and test your speaking pronunciation with real-time speech evaluation.
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
              [{p.situation.toUpperCase()}] {p.english} — {p.kannada} ({p.romanized})
            </option>
          ))}
        </select>
      </div>

      {/* Main Pronunciation Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative mb-8">
        {/* Top Badges & Speed Controller */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
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
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

        {/* Big Native Kannada Script Display */}
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
              <span className="text-xs font-bold text-slate-500 mr-1">Syllable Breakdown:</span>
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

        {/* Practice Mode Switcher Tabs (Mic Speaking vs Text-Based Alternative) */}
        <div className="flex border-b border-slate-200 bg-slate-50 rounded-2xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setPracticeMode('mic')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              practiceMode === 'mic'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mic className="w-4 h-4 text-blue-600" />
            <span>Voice Practice (Microphone)</span>
          </button>
          <button
            type="button"
            onClick={() => setPracticeMode('text')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              practiceMode === 'text'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-4 h-4 text-indigo-600" />
            <span>Text-Based Practice (Self-Check)</span>
          </button>
        </div>

        {/* MODE A: VOICE PRACTICE (MICROPHONE) */}
        {practiceMode === 'mic' && (
          <div className="space-y-6">
            {/* Requirement 2: Clear Explanation before requesting access */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-950 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">
                      How Microphone Practice Works & Privacy:
                    </p>
                    {permissionState === 'granted' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Mic Access Ready
                      </span>
                    )}
                    {permissionState === 'denied' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        Mic Access Blocked
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    When you click <strong>"Start Speaking"</strong>, your browser will prompt you for microphone permission. KannadaConnect analyzes your spoken pronunciation in real-time.
                  </p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    🔒 <strong>Privacy Assurance:</strong> Audio is processed strictly by your browser's Web Speech engine. Audio tracks are immediately stopped when practice ends, and no recordings are stored on servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Audio Listen & Mic Action Controls */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              {/* Play Audio Button (Always available, never blocked) */}
              <button
                onClick={handlePlayAudio}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm sm:text-base text-white shadow-sm transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-600 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-500/20'
                }`}
                title="Listen to native audio pronunciation"
              >
                {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span>{isPlayingAudio ? 'Speaking...' : `Listen (${playbackSpeed}x)`}</span>
              </button>

              {/* Requirement 1: Request permission ONLY on click */}
              <button
                onClick={handleStartSpeaking}
                disabled={isRequestingPermission}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all border shadow-sm cursor-pointer disabled:opacity-50 ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 animate-pulse ring-2 ring-rose-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                }`}
                title={
                  !speechSupported
                    ? 'Speech recognition requires Chrome or Edge'
                    : isListening
                    ? 'Click to stop listening'
                    : 'Click to start speaking into your mic'
                }
              >
                {isRequestingPermission ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Requesting Mic...</span>
                  </>
                ) : isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Stop Speaking</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 text-amber-300" />
                    <span>Start Speaking</span>
                  </>
                )}
              </button>
            </div>

            {/* Requirement 10: Real-time Responsive Status Banner */}
            {isListening && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-center animate-pulse">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-900">
                    Microphone Active • Listening
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  Say clearly: <span className="font-mono text-rose-800">"{phrase.romanized}"</span>
                </p>
                <p className="text-xs text-rose-700 mt-1">
                  Click "Stop Speaking" when finished to receive your score.
                </p>
              </div>
            )}

            {/* Live Transcript Display */}
            {transcript && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>What your browser heard:</span>
                  <button
                    onClick={handleResetSession}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-700 cursor-pointer"
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

            {/* Score & Evaluation Feedback */}
            {evaluation && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm sm:text-base">{evaluation.feedback}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-300">
                    {evaluation.score}% Match
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-sans">
                  💡 <span className="font-semibold">Coaching Tip:</span> {evaluation.guidanceTip}
                </p>
              </div>
            )}

            {/* Requirement 3: Separate Handling for Permission Denied, Mic Unavailable, Unsupported Browser & Recognition Errors */}
            {errorDetails && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-3 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">
                        {errorDetails.type === 'permission_denied' && 'Microphone Access Denied'}
                        {errorDetails.type === 'microphone_unavailable' && 'Microphone Not Found'}
                        {errorDetails.type === 'unsupported_browser' && 'Browser Recognition Not Supported'}
                        {errorDetails.type === 'no_speech' && 'No Speech Detected'}
                        {errorDetails.type === 'network_error' && 'Network Error with Speech Service'}
                        {errorDetails.type === 'generic' && 'Microphone Notice'}
                      </h4>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900">
                        {errorDetails.type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {errorDetails.message}
                    </p>

                    {/* Action Row: Retry & Text Alternative buttons */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {/* Requirement 4: Retry Permission Button */}
                      {(errorDetails.type === 'permission_denied' ||
                        errorDetails.type === 'microphone_unavailable' ||
                        errorDetails.type === 'no_speech' ||
                        errorDetails.type === 'generic') && (
                        <button
                          type="button"
                          onClick={handleRetryPermission}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Retry Permission</span>
                        </button>
                      )}

                      {/* Requirement 7: Switch to Text Practice Button */}
                      <button
                        type="button"
                        onClick={() => setPracticeMode('text')}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Keyboard className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Use Text Practice Instead</span>
                      </button>

                      {/* Requirement 5: Toggle Chrome & Edge Instructions */}
                      {errorDetails.type === 'permission_denied' && (
                        <button
                          type="button"
                          onClick={() => setShowBrowserGuide(!showBrowserGuide)}
                          className="text-xs font-semibold text-amber-900 underline ml-1 cursor-pointer flex items-center gap-0.5"
                        >
                          <span>{showBrowserGuide ? 'Hide Browser Guide' : 'How to Unblock in Browser'}</span>
                          {showBrowserGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Requirement 5: Step-by-Step Instructions for Chrome and Edge */}
                {showBrowserGuide && errorDetails.type === 'permission_denied' && (
                  <div className="mt-3 pt-3 border-t border-amber-200/90 text-xs space-y-2.5">
                    <div className="flex border-b border-amber-200 pb-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveBrowserTab('chrome')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          activeBrowserTab === 'chrome'
                            ? 'bg-amber-200 text-amber-950'
                            : 'text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        Google Chrome
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveBrowserTab('edge')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          activeBrowserTab === 'edge'
                            ? 'bg-amber-200 text-amber-950'
                            : 'text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        Microsoft Edge
                      </button>
                    </div>

                    {activeBrowserTab === 'chrome' ? (
                      <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-xs">
                        <li>
                          Click the <strong>Site settings icon</strong> (tune/sliders or lock icon) on the left side of your address bar.
                        </li>
                        <li>
                          Find <strong>Microphone</strong> and switch it from <em>Block</em> to <strong>Allow</strong>.
                        </li>
                        <li>
                          Or navigate to <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">chrome://settings/content/microphone</code> and add this site to Allowed.
                        </li>
                        <li>
                          Click the <strong>"Retry Permission"</strong> button above.
                        </li>
                      </ol>
                    ) : (
                      <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-xs">
                        <li>
                          Click the <strong>lock / site permissions icon</strong> on the left side of Edge's address bar.
                        </li>
                        <li>
                          Change the <strong>Microphone</strong> permission from <em>Blocked</em> to <strong>Allow</strong>.
                        </li>
                        <li>
                          Or navigate to <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">edge://settings/content/microphone</code> and ensure microphone is enabled.
                        </li>
                        <li>
                          Click the <strong>"Retry Permission"</strong> button above.
                        </li>
                      </ol>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE B: TEXT-BASED PRACTICE ALTERNATIVE (REQUIREMENT 7) */}
        {practiceMode === 'text' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Keyboard className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">
                    Text-Based Pronunciation & Recall Practice:
                  </p>
                  <p className="text-slate-700 text-xs mt-0.5 leading-relaxed">
                    Listen to the audio, then type the Romanised pronunciation or native Kannada script below to test your phonetic memory and phrasing.
                  </p>
                </div>
              </div>
            </div>

            {/* Listen Audio Trigger in Text Practice */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePlayAudio}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? 'Speaking...' : `Listen to Phrase (${playbackSpeed}x)`}</span>
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleEvaluateTextPractice} className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Type the phrase as pronounced:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={textPracticeInput}
                  onChange={(e) => setTextPracticeInput(e.target.value)}
                  placeholder={`e.g. ${phrase.romanized}`}
                  className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-900 shadow-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>Hint: Target is</span>
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">
                    {phrase.romanized}
                  </code>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTextPracticeInput(phrase.romanized)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Auto-fill
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <span>Check Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Text Evaluation Result */}
            {textPracticeEvaluation && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm sm:text-base">
                      {textPracticeEvaluation.feedback}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-300">
                    {textPracticeEvaluation.score}% Match
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-sans">
                  💡 <span className="font-semibold">Coaching Tip:</span>{' '}
                  {textPracticeEvaluation.guidanceTip}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cultural Context Tip */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold text-amber-900">Everyday Karnataka Tip:</span>{' '}
            {phrase.context}. {phrase.tip}
          </p>
        </div>
      </div>
    </div>
  );
};
