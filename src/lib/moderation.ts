/**
 * Basic profanity filter for Indonesian content.
 * Checks text against a list of forbidden words.
 */

const FORBIDDEN_WORDS = [
  'anjing', 'babi', 'bangsat', 'bajingan', 'brengsek',
  'goblok', 'tolol', 'idiot', 'bodoh', 'kampret',
  'kontol', 'memek', 'ngentot', 'pepek', 'jancok',
  'asu', 'cok', 'tai', 'setan', 'keparat',
]

/**
 * Check if text contains forbidden words.
 * Returns the first matched word, or null if clean.
 */
export function checkProfanity(text: string): string | null {
  const lower = text.toLowerCase()
  for (const word of FORBIDDEN_WORDS) {
    // Match as whole word using word boundary-like approach
    const regex = new RegExp(`(^|\\s|[^a-z])${word}($|\\s|[^a-z])`, 'i')
    if (regex.test(lower)) {
      return word
    }
  }
  return null
}

/**
 * Returns true if text is clean (no profanity).
 */
export function isCleanText(text: string): boolean {
  return checkProfanity(text) === null
}
