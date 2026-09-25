import { PrismaClient } from "@prisma/client";
import { KODAVA_ENTRIES, TULU_ENTRIES, SEED_LESSONS } from "../src/lib/nlp/seedData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding HeritageVoice database...");

  // 1. Seed Languages
  const kvd = await prisma.language.upsert({
    where: { code: "kvd" },
    update: {},
    create: {
      code: "kvd",
      name: "Kodava Takk",
      nativeName: "ಕೊಡವ ತಕ್ಕ್",
      script: "Kannada Script / Roman",
      region: "Kodagu (Coorg), Karnataka, India",
      speakers: 170000,
      status: "Definitely Endangered",
      description: "A Dravidian language spoken primarily by the Kodava people of Kodagu district in Karnataka, rich in folklore, harvest songs, and Ainmane tradition.",
    },
  });

  const tcy = await prisma.language.upsert({
    where: { code: "tcy" },
    update: {},
    create: {
      code: "tcy",
      name: "Tulu",
      nativeName: "ತುಳು",
      script: "Kannada Script / Tigalari",
      region: "Tulu Nadu (Dakshina Kannada, Udupi & Kasaragod)",
      speakers: 2000000,
      status: "Vulnerable / Heritage",
      description: "A major Dravidian language with an ancient literary heritage (Tigalari script) and vibrant oral tradition including Paddanas, Yakshagana, and Daivaradhane.",
    },
  });

  const en = await prisma.language.upsert({
    where: { code: "en" },
    update: {},
    create: {
      code: "en",
      name: "English",
      nativeName: "English",
      script: "Latin",
      region: "Global Bridge",
      speakers: 1500000000,
      status: "Universal",
      description: "Global bridge language for Heritage translation.",
    },
  });

  const kn = await prisma.language.upsert({
    where: { code: "kn" },
    update: {},
    create: {
      code: "kn",
      name: "Kannada",
      nativeName: "ಕನ್ನಡ",
      script: "Kannada",
      region: "Karnataka",
      speakers: 50000000,
      status: "Scheduled",
      description: "Regional bridge language of Karnataka.",
    },
  });

  // 2. Seed Dictionary Entries & Translations
  const allEntries = [
    ...KODAVA_ENTRIES.map((e) => ({ ...e, langId: kvd.id })),
    ...TULU_ENTRIES.map((e) => ({ ...e, langId: tcy.id })),
  ];

  for (const entryData of allEntries) {
    const entry = await prisma.dictionaryEntry.create({
      data: {
        languageId: entryData.langId,
        term: entryData.term,
        romanization: entryData.romanization,
        ipa: entryData.ipa || null,
        partOfSpeech: entryData.partOfSpeech,
        definition: entryData.definition,
        exampleNative: entryData.exampleNative || null,
        exampleEn: entryData.exampleEn || null,
        culturalNote: entryData.culturalNote || null,
        verified: true,
      },
    });

    for (const tr of entryData.translations) {
      await prisma.translation.create({
        data: {
          sourceEntryId: entry.id,
          targetLangId: en.id,
          translatedText: tr.translatedText,
          romanization: tr.romanization || null,
          confidence: tr.confidence,
          engineUsed: tr.engineUsed,
        },
      });
    }
  }

  // 3. Seed Lessons
  for (const lesson of SEED_LESSONS) {
    await prisma.lesson.create({
      data: {
        langCode: lesson.langCode,
        title: lesson.title,
        category: lesson.category,
        difficulty: lesson.difficulty,
        description: lesson.description,
        order: lesson.order,
        cardsJson: JSON.stringify(lesson.cards),
      },
    });
  }

  // 4. Seed Community Contributions
  await prisma.contribution.createMany({
    data: [
      {
        sourceLang: "en",
        targetLang: "kvd",
        originalText: "I love Coorg coffee",
        translatedText: "ಎನಕ್ ಕೊಡಗು ಕಾಫಿ ಬೊಂಬಾಟ್ ಇಷ್ಟ",
        romanization: "Enak Kodagu coffee bombat ishta",
        partOfSpeech: "phrase",
        context: "Daily food conversation",
        authorName: "Kaveri Bopanna",
        status: "APPROVED",
        upvotes: 12,
      },
      {
        sourceLang: "en",
        targetLang: "tcy",
        originalText: "Rain is falling heavily",
        translatedText: "ಬರ್ಷ ಜೋರ್ ಬರ್ಪುಂಡು",
        romanization: "Barsha jor barpundu",
        partOfSpeech: "phrase",
        context: "Monsoon weather",
        authorName: "Sharath Rai",
        status: "PENDING",
        upvotes: 4,
      },
    ],
  });

  // 5. Seed Initial Fine-Tuning Job Record
  await prisma.fineTuningJob.create({
    data: {
      jobName: "IndicBERT-v2 Kodava/Tulu Adapt",
      targetLanguage: "kvd+tcy",
      status: "COMPLETED",
      datasetSize: 1450,
      epochs: 5,
      baseModel: "ai4bharat/IndicBERT-v2-MLM",
      valLoss: 0.18,
      bleuScore: 32.4,
      logs: "Epoch 1/5 - Loss: 1.84\nEpoch 2/5 - Loss: 0.92\nEpoch 3/5 - Loss: 0.45\nEpoch 4/5 - Loss: 0.24\nEpoch 5/5 - Loss: 0.18\nModel checkpoints saved successfully.",
      completedAt: new Date(),
    },
  });

  console.log("✅ HeritageVoice database successfully seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
