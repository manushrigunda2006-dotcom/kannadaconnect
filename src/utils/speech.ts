/**
 * Speech synthesis utility for best-effort Kannada pronunciation.
 * Notice: This relies entirely on browser Web Speech API. If the operating system / browser
 * does not install a Kannada voice ('kn' or 'kn-IN'), we report this gracefully so the UI
 * can notify the user without pretending synthetic audio is native human speech.
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
    // Safety fallback timeout
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
  return kannadaVoice || null;
};

export interface SpeakResult {
  started: boolean;
  hasVoice: boolean;
  voiceName?: string;
  reason?: 'no_api' | 'no_kannada_voice' | 'playback_error';
}

export const speakKannada = async (
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): Promise<SpeakResult> => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { started: false, hasVoice: false, reason: 'no_api' };
  }

  const synth = window.speechSynthesis;
  // Cancel any ongoing speech
  synth.cancel();

  const kannadaVoice = await findKannadaVoice();

  if (!kannadaVoice) {
    return {
      started: false,
      hasVoice: false,
      reason: 'no_kannada_voice',
    };
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = kannadaVoice;
    utterance.lang = kannadaVoice.lang || 'kn-IN';
    utterance.rate = 0.88; // Slightly deliberate pace for language learners
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      callbacks?.onError?.(e);
    };

    synth.speak(utterance);
    return {
      started: true,
      hasVoice: true,
      voiceName: kannadaVoice.name,
    };
  } catch (error) {
    callbacks?.onError?.(error);
    return {
      started: false,
      hasVoice: true,
      reason: 'playback_error',
    };
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
