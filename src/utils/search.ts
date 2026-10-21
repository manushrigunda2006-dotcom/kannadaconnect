import type { Phrase, SituationId } from '../types';

/**
 * Normalizes and cleans search text (strips punctuation, trims, lowercases).
 */
export const cleanSearchQuery = (query: string): string => {
  return query
    .toLowerCase()
    .trim()
    .replace(/[?.,!'"/\\#@$%^&*()_+=[\]{}|;:`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Evaluates whether a phrase matches a given search query across all text fields,
 * transliterations, translations, tags, and conceptual synonyms.
 */
export const matchPhraseWithQuery = (p: Phrase, query: string): boolean => {
  if (!query || !query.trim()) return true;

  const rawQ = query.toLowerCase().trim();
  const cleanQ = cleanSearchQuery(query);

  if (!cleanQ) return true;

  // 1. Exact or substring match in primary fields
  const matchScript = p.kannada.includes(rawQ) || p.kannada.includes(cleanQ);
  const matchRoman =
    p.romanized.toLowerCase().includes(rawQ) ||
    p.romanized.toLowerCase().includes(cleanQ);
  const matchEnglish =
    p.english.toLowerCase().includes(rawQ) ||
    p.english.toLowerCase().includes(cleanQ);
  const matchTip =
    p.tip.toLowerCase().includes(rawQ) || p.tip.toLowerCase().includes(cleanQ);
  const matchContext = p.context
    ? p.context.toLowerCase().includes(rawQ) ||
      p.context.toLowerCase().includes(cleanQ)
    : false;
  const matchTags = p.tags.some(
    (t) =>
      t.toLowerCase().includes(rawQ) || t.toLowerCase().includes(cleanQ)
  );

  if (matchScript || matchRoman || matchEnglish || matchTip || matchContext || matchTags) {
    return true;
  }

  // 2. Tokenized word-level match for multi-word phrases (e.g. "where is the bus stop")
  const tokens = cleanQ
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['the', 'for', 'and', 'are', 'you'].includes(w));

  if (tokens.length > 1) {
    const fullText = `${p.kannada} ${p.romanized} ${p.english} ${p.tip} ${p.tags.join(' ')} ${p.context || ''}`.toLowerCase();
    const allTokensMatch = tokens.every((token) => fullText.includes(token));
    if (allTokensMatch) return true;
  }

  // 3. Conceptual & colloquial synonyms for everyday Kannada
  // "how much" -> matches price queries in shopping/transport (eshtu, price, fare, cost)
  if (cleanQ.includes('how much') || cleanQ.includes('price') || cleanQ.includes('cost')) {
    if (
      p.english.toLowerCase().includes('how much') ||
      p.romanized.toLowerCase().includes('eshtu') ||
      p.kannada.includes('ಎಷ್ಟು') ||
      p.tags.includes('price') ||
      p.tags.includes('fare')
    ) {
      return true;
    }
  }

  // "help" -> matches sahāya, assistance
  if (cleanQ.includes('help')) {
    if (
      p.english.toLowerCase().includes('help') ||
      p.romanized.toLowerCase().includes('sahāya') ||
      p.kannada.includes('ಸಹಾಯ') ||
      p.tags.includes('help')
    ) {
      return true;
    }
  }

  // "slow" / "slowly" -> matches nidhāna
  if (cleanQ.includes('slow')) {
    if (
      p.english.toLowerCase().includes('slow') ||
      p.romanized.toLowerCase().includes('nidhāna') ||
      p.kannada.includes('ನಿಧಾನ') ||
      p.tags.includes('slow')
    ) {
      return true;
    }
  }

  // "bus stop" or "bus" -> matches BMTC, platform, stop
  if (cleanQ.includes('bus')) {
    if (
      p.english.toLowerCase().includes('bus') ||
      p.romanized.toLowerCase().includes('bas') ||
      p.kannada.includes('ಬಸ್') ||
      p.tags.includes('bus') ||
      p.tags.includes('bmtc')
    ) {
      return true;
    }
  }

  // "upi" or "google pay" or "phonepe" -> matches digital payments
  if (
    cleanQ.includes('upi') ||
    cleanQ.includes('google pay') ||
    cleanQ.includes('phonepe') ||
    cleanQ.includes('pay')
  ) {
    if (
      p.english.toLowerCase().includes('upi') ||
      p.english.toLowerCase().includes('google pay') ||
      p.english.toLowerCase().includes('phonepe') ||
      p.romanized.toLowerCase().includes('upi') ||
      p.tags.includes('upi') ||
      p.tags.includes('payment')
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Filter a phrase array by situation and query.
 */
export const filterPhrasesBySituationAndQuery = (
  phrases: Phrase[],
  query: string,
  situation: SituationId | 'all'
): Phrase[] => {
  return phrases.filter((p) => {
    if (situation !== 'all' && p.situation !== situation) {
      return false;
    }
    return matchPhraseWithQuery(p, query);
  });
};

/**
 * Returns match counts grouped by situation for the active search query.
 */
export const getSituationMatchCounts = (
  phrases: Phrase[],
  query: string
): Record<string, number> => {
  const counts: Record<string, number> = {};
  phrases.forEach((p) => {
    if (matchPhraseWithQuery(p, query)) {
      counts[p.situation] = (counts[p.situation] || 0) + 1;
    }
  });
  return counts;
};
