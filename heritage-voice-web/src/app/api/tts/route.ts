import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = (searchParams.get("text") || "").trim();
    const roman = (searchParams.get("roman") || "").trim();
    const lang = (searchParams.get("lang") || "kn").toLowerCase();
    const script = (searchParams.get("script") || "").trim();
    const profile = (searchParams.get("profile") || "studio-female").toLowerCase();

    if (!text && !roman && !script) {
      return new NextResponse("Missing text parameter", { status: 400 });
    }

    // Determine target language code and optimal text to speak
    let targetTl = "kn";
    let textToSpeak = script || text || roman;

    const hasKannadaChars =
      /[\u0C80-\u0CFF]/.test(textToSpeak) ||
      /[\u0C80-\u0CFF]/.test(script) ||
      /[\u0C80-\u0CFF]/.test(text);

    if (lang === "en" && !hasKannadaChars) {
      if (profile === "global-female") {
        targetTl = "en";
      } else {
        targetTl = "en-IN"; // Authentic Indian English female voice
      }
      textToSpeak = text || roman;
    } else if (hasKannadaChars) {
      // Native Dravidian Kannada/Tulu/Kodava script -> authentic native Kannada female voice
      targetTl = "kn";
      textToSpeak =
        script && /[\u0C80-\u0CFF]/.test(script)
          ? script
          : /[\u0C80-\u0CFF]/.test(text)
          ? text
          : roman;
    } else if (lang === "kvd" || lang === "tcy" || lang === "kn") {
      if (script && /[\u0C80-\u0CFF]/.test(script)) {
        targetTl = "kn";
        textToSpeak = script;
      } else if (profile === "native-kannada") {
        targetTl = "kn";
        textToSpeak = text || roman;
      } else {
        // Use authentic Indian voice for romanized South Indian phrases
        targetTl = "en-IN";
        textToSpeak = roman || text;
      }
    } else {
      targetTl = "en-IN";
      textToSpeak = text || roman;
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      textToSpeak.slice(0, 300)
    )}&tl=${targetTl}&client=tw-ob`;

    const res = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      return new NextResponse("TTS generation failed", { status: res.status });
    }

    const audioBuffer = await res.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    console.error("TTS Route error:", error);
    return new NextResponse("Internal TTS error", { status: 500 });
  }
}
