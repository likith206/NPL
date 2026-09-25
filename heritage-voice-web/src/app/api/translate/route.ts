import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/nlp/translator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, sourceLang = "en", targetLang = "kvd" } = body;

    if (!text) {
      return NextResponse.json({ error: "Text parameter is required" }, { status: 400 });
    }

    const result = await translateText(text, sourceLang, targetLang);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Internal translation error" },
      { status: 500 }
    );
  }
}
