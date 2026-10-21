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

// ================= SPEECH RECOGNITION (STT) =================

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    'SpeechRecognition' in window ||
    'webkitSpeechRecognition' in window ||
    'mozSpeechRecognition' in window ||
    'msSpeechRecognition' in window
  );
};

export interface RecognitionSession {
  stop: () => void;
}

export const startListening = (
  callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (error: string) => void;
    onEnd: () => void;
  },
  lang = 'kn-IN'
): RecognitionSession | null => {
  if (!isSpeechRecognitionSupported()) {
    callbacks.onError('Web Speech Recognition API is not supported in this browser.');
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
      callbacks.onError(event.error || 'Speech recognition encountered an issue.');
    };

    recognition.onend = () => {
      callbacks.onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch (err: any) {
    callbacks.onError(err.message || 'Could not start microphone session.');
    return null;
  }
};

// Simple text similarity helper
export const calculateSpeechScore = (
  spoken: string,
  targetKannada: string,
  targetRomanized: string
): { score: number; feedback: string; guidanceTip: string } => {
  const cleanSpoken = spoken.toLowerCase().trim().replace(/[^a-z0-9\u0C80-\u0CFF]/gi, '');
  const cleanTargetKn = targetKannada.replace(/[^a-z0-9\u0C80-\u0CFF]/gi, '');
  const cleanTargetRom = targetRomanized.toLowerCase().replace(/[^a-z0-9]/gi, '');

  if (!cleanSpoken) {
    return {
      score: 0,
      feedback: 'No speech detected.',
      guidanceTip: 'Speak into your microphone clearly at a moderate volume.',
    };
  }

  // Exact or subset match on Kannada script or Romanized
  if (cleanSpoken === cleanTargetKn || cleanSpoken === cleanTargetRom) {
    return {
      score: 100,
      feedback: 'ಅದ್ಭುತ (Adbhutha) — Outstanding pronunciation!',
      guidanceTip: 'Your spoken phrase matches the native target perfectly. Ready for the street!',
    };
  }

  // Check word overlap
  const spokenWords = spoken.toLowerCase().split(/\s+/).filter(Boolean);
  const targetWords = `${targetKannada} ${targetRomanized}`.toLowerCase().split(/\s+/).filter(Boolean);

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
      feedback: 'Good effort, keep practising!',
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
