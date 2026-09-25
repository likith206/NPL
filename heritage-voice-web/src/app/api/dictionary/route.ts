import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { KODAVA_ENTRIES, TULU_ENTRIES } from "@/lib/nlp/seedData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const lang = searchParams.get("lang") || "all";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "30", 10)));

    // Attempt DB query
    try {
      const whereClause: any = {};
      if (lang !== "all") {
        whereClause.language = { code: lang };
      }
      if (query) {
        whereClause.OR = [
          { term: { contains: query } },
          { romanization: { contains: query } },
          { definition: { contains: query } },
        ];
      }

      const total = await prisma.dictionaryEntry.count({ where: whereClause });

      const entries = await prisma.dictionaryEntry.findMany({
        where: whereClause,
        include: {
          language: true,
          translations: {
            include: {
              targetLanguage: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { term: "asc" },
      });

      return NextResponse.json({
        entries,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      });
    } catch (dbErr) {
      console.warn("DB offline fallback for dictionary:", dbErr);
    }

    // Static Dataset Fallback
    let combined = [
      ...KODAVA_ENTRIES.map((e, idx) => ({
        id: `kvd-${idx}`,
        term: e.term,
        romanization: e.romanization,
        partOfSpeech: e.partOfSpeech,
        definition: e.definition,
        culturalNote: e.culturalNote,
        language: { code: "kvd", name: "Kodava Takk", nativeName: "ಕೊಡವ ತಕ್ಕ್" },
      })),
      ...TULU_ENTRIES.map((e, idx) => ({
        id: `tcy-${idx}`,
        term: e.term,
        romanization: e.romanization,
        partOfSpeech: e.partOfSpeech,
        definition: e.definition,
        culturalNote: e.culturalNote,
        language: { code: "tcy", name: "Tulu", nativeName: "ತುಳು" },
      })),
    ];

    if (lang !== "all") {
      combined = combined.filter((item) => item.language.code === lang);
    }

    if (query) {
      const qLower = query.toLowerCase();
      combined = combined.filter(
        (item) =>
          item.term.includes(query) ||
          item.romanization.toLowerCase().includes(qLower) ||
          item.definition.toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({ entries: combined });
  } catch (error) {
    console.error("Dictionary API error:", error);
    return NextResponse.json({ error: "Failed to fetch dictionary entries" }, { status: 500 });
  }
}
