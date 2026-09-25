import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock memory store fallback if DB is initializing
let inMemoryContributions: any[] = [
  {
    id: "contrib-1",
    sourceLang: "en",
    targetLang: "kvd",
    originalText: "I love Coorg coffee",
    translatedText: "ಎನಕ್ ಕೊಡಗು ಕಾಫಿ ಬೊಂಬಾಟ್ ಇಷ್ಟ",
    romanization: "Enak Kodagu coffee bombat ishta",
    partOfSpeech: "phrase",
    context: "Food & Beverages",
    authorName: "Kaveri Bopanna",
    status: "APPROVED",
    upvotes: 14,
    createdAt: new Date().toISOString(),
  },
  {
    id: "contrib-2",
    sourceLang: "en",
    targetLang: "tcy",
    originalText: "Rain is falling heavily",
    translatedText: "ಬರ್ಷ ಜೋರ್ ಬರ್ಪುಂಡು",
    romanization: "Barsha jor barpundu",
    partOfSpeech: "phrase",
    context: "Weather",
    authorName: "Sharath Rai",
    status: "PENDING",
    upvotes: 5,
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    try {
      const contribs = await prisma.contribution.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (contribs && contribs.length > 0) {
        return NextResponse.json({ contributions: contribs });
      }
    } catch (e) {
      console.warn("DB offline fallback for contributions");
    }

    return NextResponse.json({ contributions: inMemoryContributions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceLang, targetLang, originalText, translatedText, romanization, partOfSpeech, context, authorName } = body;

    if (!originalText || !translatedText) {
      return NextResponse.json({ error: "Original and translated text are required" }, { status: 400 });
    }

    const newContrib = {
      id: `contrib-${Date.now()}`,
      sourceLang: sourceLang || "en",
      targetLang: targetLang || "kvd",
      originalText,
      translatedText,
      romanization: romanization || "",
      partOfSpeech: partOfSpeech || "phrase",
      context: context || "General",
      authorName: authorName || "Community Contributor",
      status: "PENDING",
      upvotes: 1,
      createdAt: new Date().toISOString(),
    };

    try {
      const dbEntry = await prisma.contribution.create({
        data: {
          sourceLang: newContrib.sourceLang,
          targetLang: newContrib.targetLang,
          originalText: newContrib.originalText,
          translatedText: newContrib.translatedText,
          romanization: newContrib.romanization,
          partOfSpeech: newContrib.partOfSpeech,
          context: newContrib.context,
          authorName: newContrib.authorName,
          status: "PENDING",
        },
      });
      return NextResponse.json({ contribution: dbEntry, success: true });
    } catch (e) {
      inMemoryContributions.unshift(newContrib);
      return NextResponse.json({ contribution: newContrib, success: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit contribution" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body; // action: "APPROVE", "REJECT", "UPVOTE"

    try {
      if (action === "APPROVE") {
        const updated = await prisma.contribution.update({
          where: { id },
          data: { status: "APPROVED" },
        });
        return NextResponse.json({ contribution: updated });
      } else if (action === "REJECT") {
        const updated = await prisma.contribution.update({
          where: { id },
          data: { status: "REJECTED" },
        });
        return NextResponse.json({ contribution: updated });
      } else if (action === "UPVOTE") {
        const updated = await prisma.contribution.update({
          where: { id },
          data: { upvotes: { increment: 1 } },
        });
        return NextResponse.json({ contribution: updated });
      }
    } catch (e) {
      // Memory fallback
      const found = inMemoryContributions.find((c) => c.id === id);
      if (found) {
        if (action === "APPROVE") found.status = "APPROVED";
        if (action === "REJECT") found.status = "REJECTED";
        if (action === "UPVOTE") found.upvotes += 1;
        return NextResponse.json({ contribution: found });
      }
    }

    return NextResponse.json({ error: "Invalid action or ID" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update contribution status" }, { status: 500 });
  }
}
