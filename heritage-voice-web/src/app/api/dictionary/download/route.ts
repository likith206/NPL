import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { KODAVA_ENTRIES, TULU_ENTRIES } from "@/lib/nlp/seedData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "all";
    const format = (searchParams.get("format") || "json").toLowerCase();

    let rawEntries: any[] = [];

    // Attempt DB fetch
    try {
      const whereClause: any = {};
      if (lang !== "all") {
        whereClause.language = { code: lang };
      }

      rawEntries = await prisma.dictionaryEntry.findMany({
        where: whereClause,
        include: {
          language: true,
        },
        orderBy: { term: "asc" },
      });
    } catch (dbErr) {
      console.warn("DB fallback for download:", dbErr);
    }

    // Static fallback if DB yields empty
    if (!rawEntries || rawEntries.length === 0) {
      let combined = [
        ...TULU_ENTRIES.map((e, idx) => ({
          id: `tcy-${idx}`,
          term: e.term,
          romanization: e.romanization,
          partOfSpeech: e.partOfSpeech,
          definition: e.definition,
          culturalNote: e.culturalNote || "Basel Mission Tulu-English Dictionary",
          language: { code: "tcy", name: "Tulu", nativeName: "ತುಳು" },
        })),
        ...KODAVA_ENTRIES.map((e, idx) => ({
          id: `kvd-${idx}`,
          term: e.term,
          romanization: e.romanization,
          partOfSpeech: e.partOfSpeech,
          definition: e.definition,
          culturalNote: e.culturalNote || "Kodava Takk Dictionary",
          language: { code: "kvd", name: "Kodava Takk", nativeName: "ಕೊಡವ" },
        })),
      ];

      if (lang !== "all") {
        combined = combined.filter((item) => item.language.code === lang);
      }
      rawEntries = combined;
    }

    const filenamePrefix = lang === "tcy" ? "tulu_dictionary" : lang === "kvd" ? "kodava_dictionary" : "heritage_dictionary_full";

    // Format 1: JSON Download
    if (format === "json") {
      const jsonContent = JSON.stringify(
        rawEntries.map((item) => ({
          language: item.language?.name || item.langCode,
          langCode: item.language?.code || item.langCode,
          term: item.term,
          romanization: item.romanization,
          partOfSpeech: item.partOfSpeech,
          definition: item.definition,
          culturalNote: item.culturalNote || "",
        })),
        null,
        2
      );

      return new NextResponse(jsonContent, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filenamePrefix}.json"`,
        },
      });
    }

    // Format 2: CSV Download
    const escapeCsv = (str: string) => {
      if (!str) return '""';
      const cleanStr = str.replace(/"/g, '""').replace(/\n/g, " ");
      return `"${cleanStr}"`;
    };

    const csvHeaders = ["Language", "Language Code", "Native Term", "Romanization", "Part of Speech", "Definition", "Cultural Note / Source"];
    const csvRows = rawEntries.map((item) => [
      escapeCsv(item.language?.name || item.langCode),
      escapeCsv(item.language?.code || item.langCode),
      escapeCsv(item.term),
      escapeCsv(item.romanization),
      escapeCsv(item.partOfSpeech),
      escapeCsv(item.definition),
      escapeCsv(item.culturalNote || ""),
    ]);

    const csvContent = "\uFEFF" + [csvHeaders.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filenamePrefix}.csv"`,
      },
    });
  } catch (error) {
    console.error("Download API error:", error);
    return NextResponse.json({ error: "Failed to generate dictionary download" }, { status: 500 });
  }
}
