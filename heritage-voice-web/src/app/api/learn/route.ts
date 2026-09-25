import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SEED_LESSONS } from "@/lib/nlp/seedData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang");

    try {
      const dbLessons = await prisma.lesson.findMany({
        orderBy: { order: "asc" },
      });
      if (dbLessons && dbLessons.length > 0) {
        let result = dbLessons.map((l) => ({
          ...l,
          cards: JSON.parse(l.cardsJson),
        }));
        if (lang) {
          result = result.filter((l) => l.langCode === lang);
        }
        return NextResponse.json({ lessons: result });
      }
    } catch (e) {
      console.warn("DB offline fallback for lessons");
    }

    let lessons = SEED_LESSONS;
    if (lang) {
      lessons = lessons.filter((l) => l.langCode === lang);
    }

    return NextResponse.json({ lessons });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}
