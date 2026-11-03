/**
 * Speech synthesis & recognition utilities for KannadaConnect.
 * Relies on standard browser Web Speech APIs.
 * If the browser or OS does not support synthetic speech or speech recognition,
 * it returns informative fallbacks so the UI can gracefully guide the learner.
 */

let voicesCache: SpeechSynthesisVoice[] = [];

export const getAvailableVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices.length > 0) {
      voicesCache = voices;
      resolve(voices);
      return;
    }

    const handler = () => {
      voicesCache = synth.getVoices();
      synth.removeEventListener('voiceschanged', handler);
      resolve(voicesCache);
    };

    synth.addEventListener('voiceschanged', handler);
    setTimeout(() => {
      voicesCache = synth.getVoices();
      resolve(voicesCache);
    }, 600);
  });
};

export const findKannadaVoice = async (): Promise<SpeechSynthesisVoice | null> => {
  const voices = await getAvailableVoices();
  const kannadaVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith('kn') ||
      v.name.toLowerCase().includes('kannada')
  );
  if (kannadaVoice) return kannadaVoice;

  // Fallback to Indian English / Hindi voice if Kannada voice is not explicitly indexed
  const indianVoice = voices.find(
    (v) => v.lang.toLowerCase().includes('in') || v.name.toLowerCase().includes('india')
  );
  return indianVoice || null;
};

export interface SpeakOptions {
  rate?: number; // 0.6 to 1.0
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface SpeakResult {
  started: boolean;
  hasVoice: boolean;
  voiceName?: string;
  reason?: 'no_api' | 'no_kannada_voice' | 'playback_error';
}

export const speakKannada = async (
  text: string,
  options?: SpeakOptions
): Promise<SpeakResult> => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { started: false, hasVoice: false, reason: 'no_api' };
  }

  const synth = window.speechSynthesis;
  // Cancel any ongoing speech cleanly
  synth.cancel();

  const kannadaVoice = await findKannadaVoice();

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    if (kannadaVoice) {
      utterance.voice = kannadaVoice;
      utterance.lang = kannadaVoice.lang || 'kn-IN';
    } else {
      utterance.lang = 'kn-IN';
    }

    utterance.rate = options?.rate || 0.85; // Slightly measured learner pace
    utterance.pitch = options?.pitch || 1.0;

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      options?.onError?.(e);
    };

    synth.speak(utterance);
    return {
      started: true,
      hasVoice: true,
      voiceName: kannadaVoice ? kannadaVoice.name : 'Browser Built-in Voice (kn-IN)',
    };
  } catch (error) {
    options?.onError?.(error);
    return {
      started: false,
      hasVoice: false,
      reason: 'playback_error',
    };
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

// ================= SPEECH RECOGNITION (STT) & PERMISSIONS =================

export type SpeechRecognitionErrorType =
  | 'permission_denied'
  | 'microphone_unavailable'
  | 'unsupported_browser'
  | 'no_speech'
  | 'network_error'
  | 'service_not_allowed'
  | 'aborted'
  | 'generic';

export interface SpeechRecognitionErrorDetails {
  type: SpeechRecognitionErrorType;
  message: string;
  rawCode?: string;
}

export type MicrophonePermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

/**
 * Checks if the current browser environment supports the Web Speech Recognition API.
 */
export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    'SpeechRecognition' in window ||
    'webkitSpeechRecognition' in window ||
    'mozSpeechRecognition' in window ||
    'msSpeechRecognition' in window
  );
};

/**
 * Queries the current microphone permission status if supported by the browser.
 */
export const getMicrophonePermissionState = async (): Promise<MicrophonePermissionState> => {
  if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
    return 'prompt';
  }
  try {
    const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return status.state as MicrophonePermissionState;
  } catch {
    return 'prompt';
  }
};

/**
 * Requests microphone permission explicitly via getUserMedia and immediately stops tracks.
 * Used for testing/probing permissions without leaving the microphone open.
 */
export const requestMicrophoneAccess = async (): Promise<{
  success: boolean;
  errorType?: SpeechRecognitionErrorType;
  message?: string;
}> => {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return {
      success: false,
      errorType: 'unsupported_browser',
      message: 'Your browser does not support audio recording APIs.',
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Immediately stop all audio tracks so the recording indicator turns off
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {}
    });
    return { success: true };
  } catch (err: any) {
    const name = err?.name || '';
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return {
        success: false,
        errorType: 'permission_denied',
        message: 'Microphone permission was denied by your browser.',
      };
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return {
        success: false,
        errorType: 'microphone_unavailable',
        message: 'No microphone was detected on your device. Please connect a mic or headset.',
      };
    }
    return {
      success: false,
      errorType: 'generic',
      message: err?.message || 'Unable to access microphone.',
    };
  }
};

export interface RecognitionSession {
  stop: () => void;
  abort?: () => void;
}

export interface StartListeningCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: SpeechRecognitionErrorDetails) => void;
  onEnd: () => void;
  onStart?: () => void;
}

export const startListening = (
  callbacks: StartListeningCallbacks,
  lang = 'kn-IN'
): RecognitionSession | null => {
  if (!isSpeechRecognitionSupported()) {
    callbacks.onError({
      type: 'unsupported_browser',
      message: 'Web Speech Recognition API is not supported in this browser. Please use Chrome or Edge.',
      rawCode: 'unsupported',
    });
    return null;
  }

  try {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let stoppedManually = false;

    recognition.onstart = () => {
      callbacks.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      callbacks.onResult(final || interim, Boolean(final));
    };

    recognition.onerror = (event: any) => {
      const code = event.error || '';
      if (code === 'aborted' && stoppedManually) {
        return;
      }

      let type: SpeechRecognitionErrorType = 'generic';
      let message = 'Speech recognition encountered an unexpected issue.';

      switch (code) {
        case 'not-allowed':
          type = 'permission_denied';
          message = 'Microphone permission was denied. Please allow microphone access to practice speaking.';
          break;
        case 'audio-capture':
          type = 'microphone_unavailable';
          message = 'No microphone was detected on your device. Please plug in a microphone or headset.';
          break;
        case 'no-speech':
          type = 'no_speech';
          message = 'No speech was detected. Please speak closer to your microphone and try again.';
          break;
        case 'network':
          type = 'network_error';
          message = 'Network connection issue with browser speech recognition service.';
          break;
        case 'service-not-allowed':
          type = 'service_not_allowed';
          message = 'Speech recognition service is disabled or blocked in your operating system.';
          break;
        case 'aborted':
          type = 'aborted';
          message = 'Listening was cancelled.';
          break;
        default:
          message = `Recognition status: ${code}`;
      }

      callbacks.onError({ type, message, rawCode: code });
    };

    recognition.onend = () => {
      callbacks.onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        stoppedManually = true;
        try {
          recognition.stop();
        } catch {}
      },
      abort: () => {
        stoppedManually = true;
        try {
          recognition.abort();
        } catch {}
      },
    };
  } catch (err: any) {
    callbacks.onError({
      type: 'generic',
      message: err.message || 'Could not start microphone session.',
    });
    return null;
  }
};

// ================= SIMILARITY & SCORING =================

const normalizeForMatch = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0C80-\u0CFF]/gi, '');
};

export const calculateSpeechScore = (
  spoken: string,
  targetKannada: string,
  targetRomanized: string
): { score: number; feedback: string; guidanceTip: string } => {
  const normSpoken = normalizeForMatch(spoken);
  const normTargetKn = normalizeForMatch(targetKannada);
  const normTargetRom = normalizeForMatch(targetRomanized);

  if (!normSpoken) {
    return {
      score: 0,
      feedback: 'No input detected.',
      guidanceTip: 'Speak or type the phrase clearly to receive phonetic feedback.',
    };
  }

  // Exact match on Kannada script or Romanized (with or without diacritics)
  if (normSpoken === normTargetKn || normSpoken === normTargetRom) {
    return {
      score: 100,
      feedback: 'ಅದ್ಭುತ (Adbhutha) — Outstanding pronunciation!',
      guidanceTip: 'Your phrase matches the native target perfectly. Ready for the street!',
    };
  }

  // Check word overlap with normalized tokens
  const spokenWords = spoken
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9\u0C80-\u0CFF]/gi, ''))
    .filter(Boolean);

  const targetWords = `${targetKannada} ${targetRomanized}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9\u0C80-\u0CFF]/gi, ''))
    .filter(Boolean);

  let matches = 0;
  for (const sw of spokenWords) {
    if (targetWords.some((tw) => tw.includes(sw) || sw.includes(tw))) {
      matches++;
    }
  }

  const ratio = Math.min(1, matches / Math.max(1, targetWords.length / 2));
  const estimatedScore = Math.round(ratio * 85);

  if (estimatedScore >= 70) {
    return {
      score: Math.max(75, estimatedScore),
      feedback: 'ತುಂಬಾ ಒಳ್ಳೆಯ ಪ್ರಯತ್ನ (Very Good Attempt)!',
      guidanceTip: 'Clear phonetic rhythm. To sound even more local, focus on the elongated vowels (like ā, ī).',
    };
  } else if (estimatedScore >= 40) {
    return {
      score: Math.max(45, estimatedScore),
      feedback: 'Good effort, keep practicing!',
      guidanceTip: 'Listen to the audio once more at 0.7x learner speed, then repeat syllable by syllable.',
    };
  } else {
    return {
      score: 35,
      feedback: 'Phrase captured!',
      guidanceTip: 'Pronunciation is developing. Try breaking the phrase into 2-syllable chunks.',
    };
  }
};
