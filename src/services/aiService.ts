/**
 * AI Integration Architecture for KannadaConnect
 *
 * This module provides the contract and adapter interface for integrating
 * genuine Large Language Model (LLM) endpoints (e.g. Gemini 1.5/2.0, server-side Next.js route, or FastAPI).
 *
 * SECURITY & ARCHITECTURAL PRINCIPLES:
 * 1. Zero Mandatory API Keys: The application operates 100% reliably client-side using verified static scenario trees.
 * 2. No Frontend Secrets: Any production AI integration MUST be proxied through a secure backend endpoint
 *    (e.g., `/api/kannada-tutor`) where server credentials remain secret.
 * 3. Transparent Labelling: The UI never fakes scripted dialogues as generative AI.
 */

export interface AIConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  kannadaScript?: string;
  romanized?: string;
  englishTranslation?: string;
}

export interface AITutorResponse {
  message: string;
  kannadaScript?: string;
  romanized?: string;
  englishTranslation?: string;
  feedback?: {
    grammarAccuracy: string;
    politenessTip: string;
    culturalContext: string;
  };
}

export interface AIConfig {
  serverEndpoint?: string;
  isAvailable: boolean;
}

export const getAIConfig = (): AIConfig => {
  // In frontend builds, check if a custom backend endpoint is configured via environment
  const endpoint =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_KANNADA_AI_ENDPOINT) || '';
  return {
    serverEndpoint: endpoint,
    isAvailable: Boolean(endpoint),
  };
};

/**
 * Sends conversation context to a backend LLM tutor if configured.
 * Otherwise returns a clear offline fallback descriptor without pretending to be a live AI.
 */
export const requestAIConversationalTurn = async (
  _conversationHistory: AIConversationMessage[],
  _situationContext: string
): Promise<AITutorResponse> => {
  const config = getAIConfig();

  if (!config.isAvailable || !config.serverEndpoint) {
    // Graceful offline fallback
    return {
      message: 'AI backend endpoint is not currently configured. Using verified local role-play scenario trees.',
      feedback: {
        grammarAccuracy: 'Local verified scenario mode active.',
        politenessTip: "Ending sentences with 'ri' or 'banni' creates polite street interactions.",
        culturalContext: 'Offline conversational rules ensure full privacy and zero downtime.',
      },
    };
  }

  try {
    const response = await fetch(config.serverEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: _conversationHistory,
        situation: _situationContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.warn('AI tutoring endpoint request failed, falling back to local scenario tree:', err);
    return {
      message: 'Unable to reach conversational AI server. Switched to offline scenario mode.',
      feedback: {
        grammarAccuracy: 'Standard grammar fallback applied.',
        politenessTip: 'Always use plural polite suffixes with elders and drivers.',
        culturalContext: 'Offline mode active.',
      },
    };
  }
};
