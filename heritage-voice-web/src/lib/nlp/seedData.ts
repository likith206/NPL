export interface SeedEntry {
  langCode: string;
  term: string;
  romanization: string;
  ipa?: string;
  partOfSpeech: string;
  definition: string;
  exampleNative?: string;
  exampleEn?: string;
  culturalNote?: string;
  translations: {
    targetLangCode: string;
    translatedText: string;
    romanization?: string;
    confidence: number;
    engineUsed: string;
  }[];
}

export interface SeedLesson {
  langCode: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  order: number;
  cards: {
    frontNative: string;
    frontRoman: string;
    backEn: string;
    audioUrl?: string;
    culturalTip?: string;
  }[];
}

export const KODAVA_ENTRIES: SeedEntry[] = [
  {
    langCode: "kvd",
    term: "ನಮಸ್ಕಾರ",
    romanization: "Namaskāra",
    ipa: "nəməskɑːrə",
    partOfSpeech: "phrase",
    definition: "Hello / Greetings",
    exampleNative: "ಎಲ್ಲರಿಗೂ ನಮಸ್ಕಾರ!",
    exampleEn: "Greetings to everyone!",
    culturalNote: "Traditional greeting in Kodagu accompanied by folding hands.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "Greetings / Hello",
        romanization: "Namaskara",
        confidence: 0.99,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "kvd",
    term: "ನಿಂಗ ಎಂಚ ಉಳ್ಳಿರಾ?",
    romanization: "Ninga encha ullira?",
    ipa: "niŋɡə enʧə ulːiːrɑː",
    partOfSpeech: "phrase",
    definition: "How are you?",
    exampleNative: "ನಮಸ್ಕಾರ, ನಿಂಗ ಎಂಚ ಉಳ್ಳಿರಾ?",
    exampleEn: "Hello, how are you doing?",
    culturalNote: "Polite inquiry used when meeting elders or friends in Coorg.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "How are you?",
        romanization: "Ninga encha ullira?",
        confidence: 0.97,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "kvd",
    term: "ಎನ್ನ ಹೆಸರು...",
    romanization: "Enna hesaru...",
    ipa: "ennə hesəru",
    partOfSpeech: "phrase",
    definition: "My name is...",
    exampleNative: "ಎನ್ನ ಹೆಸರು ಕಾವೇರಿ.",
    exampleEn: "My name is Kaveri.",
    culturalNote: "Kaveri is a sacred name in Kodagu, representing Mother River Kaveri.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "My name is...",
        romanization: "Enna hesaru...",
        confidence: 0.98,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "kvd",
    term: "ದೊಡ್ಡ ನಮಸ್ಕಾರ",
    romanization: "Dodd Namaskara",
    ipa: "doɖːə nəməskɑːrə",
    partOfSpeech: "phrase",
    definition: "Thank you very much",
    exampleNative: "ನಿಂಗಡ ಸಹಾಯಕಿ ದೊಡ್ಡ ನಮಸ್ಕಾರ.",
    exampleEn: "Thank you very much for your help.",
    culturalNote: "Literally means 'Great Respects/Greetings', expressed with heartfelt gratitude.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "Thank you very much",
        romanization: "Dodd Namaskara",
        confidence: 0.96,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "kvd",
    term: "ನಾಂಗಡ ಮನೆಕಿ ಬಾ",
    romanization: "Naangada maneki baa",
    ipa: "nɑːŋɡəɖə məneki bɑː",
    partOfSpeech: "phrase",
    definition: "Welcome to our home",
    exampleNative: "ನಾಂಗಡ ಮನೆಕಿ ಬಾ, ಅತಿಥಿ ಸತ್ಕಾರ ಕೊಡುವೊಂ.",
    exampleEn: "Welcome to our home, we welcome you with Kodava hospitality.",
    culturalNote: "Kodava hospitality (Ainmane culture) is central to Coorg heritage.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "Welcome to our home",
        romanization: "Naangada maneki baa",
        confidence: 0.95,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "kvd",
    term: "ಕೊಡಗು ಬೊಂಬಾಟ್ ಆಯಿಟುಳ್ಳು",
    romanization: "Kodagu bombat aayitullu",
    partOfSpeech: "phrase",
    definition: "Coorg is extremely beautiful",
    exampleNative: "ಮಳೆಗಾಲಲ್ಲಿ ಕೊಡಗು ಬೊಂಬಾಟ್ ಆಯಿಟುಳ್ಳು.",
    exampleEn: "During monsoons, Coorg is extremely beautiful.",
    culturalNote: "Kodagu is world-famous for its lush coffee estates and green hills.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "Coorg is very beautiful",
        romanization: "Kodagu bombat aayitullu",
        confidence: 0.96,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "kvd",
    term: "ಕೈಲ್‌ಪೋಳ್‌ದ್",
    romanization: "Kailpoldu",
    partOfSpeech: "noun",
    definition: "Festival of Weapons and Harvest",
    exampleNative: "ಕೈಲ್‌ಪೋಳ್‌ದ್ ಹಬ್ಬಕ್ಕೆ ಎಲ್ಲಾ ಕೊಡವರು ಸೇರುವೋ.",
    exampleEn: "All Kodavas gather for the Kailpoldu festival.",
    culturalNote: "An essential Kodava harvest festival where traditional implements and weapons are worshipped.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "Kailpoldu Harvest & Arms Festival",
        romanization: "Kailpoldu",
        confidence: 0.99,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
];

export const TULU_ENTRIES: SeedEntry[] = [
  {
    langCode: "tcy",
    term: "ಸೊಲ್ಮೆಲು",
    romanization: "Solmelu",
    ipa: "solmelu",
    partOfSpeech: "phrase",
    definition: "Greetings / Thank you",
    exampleNative: "ಮಾತೆರೆಗೂ ಎನ್ನ ಸೊಲ್ಮೆಲು!",
    exampleEn: "My warm greetings / thanks to everyone!",
    culturalNote: "Solmelu is the iconic Tulu word of reverence, affection, and gratitude.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "Thank you / Greetings",
        romanization: "Solmelu",
        confidence: 0.99,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "tcy",
    term: "ಈರ್ ಎಂಚ ಉಲ್ಲರ್?",
    romanization: "Eer encha ullar?",
    ipa: "iːr enʧə ulːər",
    partOfSpeech: "phrase",
    definition: "How are you? (Respectful)",
    exampleNative: "ನಮಸ್ಕಾರ, ಈರ್ ಎಂಚ ಉಲ್ಲರ್?",
    exampleEn: "Hello, how are you?",
    culturalNote: "Used to respectfully greet elders, guests, or teachers in Tulu Nadu.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "How are you?",
        romanization: "Eer encha ullar?",
        confidence: 0.98,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "tcy",
    term: "ಯಾನ್ ಹುಷಾರ್ ಉಲ್ಲೆ",
    romanization: "Yaan hushar ulle",
    partOfSpeech: "phrase",
    definition: "I am fine and well",
    exampleNative: "ಯಾನ್ ಹುಷಾರ್ ಉಲ್ಲೆ, ಈರ್ ಎಂಚ ಉಲ್ಲರ್?",
    exampleEn: "I am fine, how are you?",
    culturalNote: "Standard positive response when asked about well-being.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "I am doing well / fine",
        romanization: "Yaan hushar ulle",
        confidence: 0.97,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "tcy",
    term: "ಈರೆನ ಪುದರ್ ದಾನೆ?",
    romanization: "Eerena pudar daane?",
    partOfSpeech: "phrase",
    definition: "What is your name?",
    exampleNative: "ಅಣ್ಣ, ಈರೆನ ಪುದರ್ ದಾನೆ?",
    exampleEn: "Brother, what is your name?",
    culturalNote: "Friendly formal conversation starter.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "What is your name?",
        romanization: "Eerena pudar daane?",
        confidence: 0.98,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "tcy",
    term: "ಬಲೆ",
    romanization: "Bale",
    partOfSpeech: "phrase",
    definition: "Welcome / Come in",
    exampleNative: "ಇಲ್ಲಗ್ ಬಲೆ, ಚಾ ಪರ್ಲೆ.",
    exampleEn: "Welcome home, have some tea.",
    culturalNote: "'Bale' warmly invites guests inside Tulu households.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "Welcome / Please come in",
        romanization: "Bale",
        confidence: 0.98,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "tcy",
    term: "ತುಳುನಾಡು ತೀರ್ಥ ಕ್ಷೇತ್ರ",
    romanization: "Tulu Nadu teertha kshetra",
    partOfSpeech: "phrase",
    definition: "Tulu Nadu is a holy land of culture",
    exampleNative: "ತುಳುನಾಡು ತೀರ್ಥ ಕ್ಷೇತ್ರ, ಸಾಂಸ್ಕೃತಿಕ ವೈಭವದ ಬೀಡು.",
    exampleEn: "Tulu Nadu is a holy sacred land of rich heritage.",
    culturalNote: "Refers to Coastal Karnataka's rich Yakshagana, Kambala, and Daivaradhane spiritual tradition.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "Tulu Nadu is a land of sacred heritage",
        romanization: "Tulu Nadu teertha kshetra",
        confidence: 0.95,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
  {
    langCode: "tcy",
    term: "ಆಟಿ ಬೊತ್ತಂಡ ಸೋಣ ಉಂತುಂಡು",
    romanization: "Aati bottanda Sona untundu",
    partOfSpeech: "proverb",
    definition: "After hard monsoons (Aati), harvest prosperity (Sona) arrives",
    exampleNative: "ಕಷ್ಟದ ದಿನ ಪೋಂಡ ಎಡ್ಡೆ ದಿನ ಬರ್ಪುಂಡು — ಆಟಿ ಬೊತ್ತಂಡ ಸೋಣ ಉಂತುಂಡು.",
    exampleEn: "Difficult times will pass and prosperity will arrive.",
    culturalNote: "Famous Tulu proverb about perseverance during rain monsoons.",
    translations: [
      {
        targetLangCode: "en",
        translatedText: "After hardship comes prosperity and light",
        romanization: "Aati bottanda Sona untundu",
        confidence: 0.94,
        engineUsed: "Indic-FineTuned",
      },
    ],
  },
];

export const SEED_LESSONS: SeedLesson[] = [
  {
    langCode: "kvd",
    title: "Essential Kodava Greetings",
    category: "Greetings & Basics",
    difficulty: "Beginner",
    description: "Learn fundamental Kodava (Coorgi) words for daily respectful communication.",
    order: 1,
    cards: [
      {
        frontNative: "ನಮಸ್ಕಾರ",
        frontRoman: "Namaskāra",
        backEn: "Hello / Greetings",
        culturalTip: "Polite greeting used throughout Kodagu.",
      },
      {
        frontNative: "ನಿಂಗ ಎಂಚ ಉಳ್ಳಿರಾ?",
        frontRoman: "Ninga encha ullira?",
        backEn: "How are you?",
        culturalTip: "Friendly inquiry into well-being.",
      },
      {
        frontNative: "ದೊಡ್ಡ ನಮಸ್ಕಾರ",
        frontRoman: "Dodd Namaskara",
        backEn: "Thank you very much",
        culturalTip: "Expressed with genuine reverence.",
      },
      {
        frontNative: "ನಾಂಗಡ ಮನೆಕಿ ಬಾ",
        frontRoman: "Naangada maneki baa",
        backEn: "Welcome to our home",
        culturalTip: "Inviting someone into your Ainmane (ancestral home).",
      },
    ],
  },
  {
    langCode: "tcy",
    title: "Mastering Tulu Solmelu",
    category: "Greetings & Basics",
    difficulty: "Beginner",
    description: "Discover core conversational Tulu phrases used in coastal Karnataka.",
    order: 1,
    cards: [
      {
        frontNative: "ಸೊಲ್ಮೆಲು",
        frontRoman: "Solmelu",
        backEn: "Thank you / Greetings",
        culturalTip: "The most iconic Tulu expression of warmth and gratitude.",
      },
      {
        frontNative: "ಈರ್ ಎಂಚ ಉಲ್ಲರ್?",
        frontRoman: "Eer encha ullar?",
        backEn: "How are you? (Respectful)",
        culturalTip: "Respectful form used for elders and honored guests.",
      },
      {
        frontNative: "ಯಾನ್ ಹುಷಾರ್ ಉಲ್ಲೆ",
        frontRoman: "Yaan hushar ulle",
        backEn: "I am fine",
        culturalTip: "Standard affirmative response.",
      },
      {
        frontNative: "ಬಲೆ",
        frontRoman: "Bale",
        backEn: "Welcome / Come in",
        culturalTip: "Warm invitation into a household.",
      },
    ],
  },
  {
    langCode: "kvd",
    title: "Kodava Heritage & Proverbs",
    category: "Proverbs & Culture",
    difficulty: "Intermediate",
    description: "Explore the wisdom of Coorg through traditional proverbs.",
    order: 2,
    cards: [
      {
        frontNative: "ಕೈಲ್‌ಪೋಳ್‌ದ್",
        frontRoman: "Kailpoldu",
        backEn: "Harvest & Arms Festival",
        culturalTip: "Major Coorg festival celebrating agriculture and defense.",
      },
      {
        frontNative: "ಸುಖ ಬೊಳ್ಚ",
        frontRoman: "Sukha Bolcha",
        backEn: "Peace and divine light",
        culturalTip: "Traditional blessing spoken during ceremonies.",
      },
    ],
  },
];
