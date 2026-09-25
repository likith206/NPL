/**
 * Phonetic Transliteration Engine for Kodava (Coorgi) & Tulu scripts.
 * Maps Kannada character combinations & regional phonemes to clear Romanization.
 */

const KANNADA_VOWEL_MAP: Record<string, string> = {
  "ಅ": "a", "ಆ": "aa", "ಇ": "i", "ಈ": "ee", "ಉ": "u", "ಊ": "oo",
  "ಋ": "ru", "ಎ": "e", "ಏ": "ee", "ಐ": "ai", "ಒ": "o", "ಓ": "oo", "ಔ": "au",
  "ಅಂ": "am", "ಅಃ": "aha",
};

const KANNADA_MATRA_MAP: Record<string, string> = {
  "ಾ": "aa", "ಿ": "i", "ೀ": "ee", "ು": "u", "ೂ": "oo",
  "ೃ": "ru", "ೆ": "e", "ೇ": "ee", "ೈ": "ai", "ೊ": "o", "ೋ": "oo", "ೌ": "au",
  "ಂ": "m", "ಃ": "h",
};

const KANNADA_CONSONANT_MAP: Record<string, string> = {
  "ಕ": "ka", "ಖ": "kha", "ಗ": "ga", "ಘ": "gha", "ಙ": "nga",
  "ಚ": "cha", "ಛ": "chha", "ಜ": "ja", "ಝ": "jha", "ಞ": "nya",
  "ಟ": "ta", "ಠ": "tha", "ಡ": "da", "ಢ": "dha", "ಣ": "na",
  "ತ": "tha", "ಥ": "thha", "ದ": "da", "ಧ": "dha", "ನ": "na",
  "ಪ": "pa", "ಫ": "pha", "ಬ": "ba", "ಭ": "bha", "ಮ": "ma",
  "ಯ": "ya", "ರ": "ra", "ಲ": "la", "ವ": "va", "ಶ": "sha",
  "ಷ": "sha", "ಸ": "sa", "ಹ": "ha", "ಳ": "la",
};

/**
 * Generates clear Romanized pronunciation guide for Kodava and Tulu text in Kannada script.
 */
export function romanizeText(text: string): string {
  if (!text) return "";

  // Known dictionary word shortcuts
  const exactShortcuts: Record<string, string> = {
    "ನಮಸ್ಕಾರ": "Namaskāra",
    "ಸೊಲ್ಮೆಲು": "Solmelu",
    "ನಿಂಗ ಎಂಚ ಉಳ್ಳಿರಾ?": "Ninga encha ullira?",
    "ಈರ್ ಎಂಚ ಉಲ್ಲರ್?": "Eer encha ullar?",
    "ಯಾನ್ ಹುಷಾರ್ ಉಲ್ಲೆ": "Yaan hushar ulle",
    "ದೊಡ್ಡ ನಮಸ್ಕಾರ": "Dodd Namaskara",
    "ನಾಂಗಡ ಮನೆಕಿ ಬಾ": "Naangada maneki baa",
    "ಕೊಡಗು ಬೊಂಬಾಟ್ ಆಯಿಟುಳ್ಳು": "Kodagu bombat aayitullu",
    "ಕೈಲ್‌ಪೋಳ್‌ದ್": "Kailpoldu",
    "ಆಟಿ ಬೊತ್ತಂಡ ಸೋಣ ಉಂತುಂಡು": "Aati bottanda Sona untundu",
    "ತುಳುನಾಡು ತೀರ್ಥ ಕ್ಷೇತ್ರ": "Tulu Nadu teertha kshetra",
    "ಬಲೆ": "Bale",
    "ಈರೆನ ಪುದರ್ ದಾನೆ?": "Eerena pudar daane?",
  };

  if (exactShortcuts[text.trim()]) {
    return exactShortcuts[text.trim()];
  }

  // Character-level phonetic conversion
  let roman = "";
  const chars = Array.from(text);

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = chars[i + 1];

    if (KANNADA_VOWEL_MAP[char]) {
      roman += KANNADA_VOWEL_MAP[char];
    } else if (KANNADA_CONSONANT_MAP[char]) {
      let base = KANNADA_CONSONANT_MAP[char];
      if (nextChar && KANNADA_MATRA_MAP[nextChar]) {
        // Replace ending 'a' with matra vowel sound
        base = base.slice(0, -1) + KANNADA_MATRA_MAP[nextChar];
        i++; // Skip matra char
      } else if (nextChar === "್") {
        // Virama (halant) removes inherent vowel
        base = base.slice(0, -1);
        i++; // Skip virama
      }
      roman += base;
    } else if (KANNADA_MATRA_MAP[char]) {
      roman += KANNADA_MATRA_MAP[char];
    } else {
      roman += char;
    }
  }

  // Clean up whitespace & double vowels
  return roman
    .replace(/\s+/g, " ")
    .replace(/aa/g, "ā")
    .replace(/ee/g, "ī")
    .replace(/oo/g, "ū")
    .trim();
}
