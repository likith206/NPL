/**
 * Studio Neural & High-Definition Speech Synthesizer for Kodava, Tulu & English.
 * Streams high-fidelity native Kannada and Indian English female voice audio directly via server TTS route.
 */

export type VoiceProfile =
  | "studio-female"
  | "south-indian-female"
  | "global-female"
  | "native-kannada";

let activeAudio: HTMLAudioElement | null = null;

export function stopSpeech() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
    } catch (e) {}
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

export function speakText(
  text: string,
  langCode: string,
  romanization?: string,
  onEnd?: () => void,
  rate: number = 1.0,
  voiceProfile: VoiceProfile = "studio-female"
) {
  if (typeof window === "undefined") return;

  stopSpeech();

  const phraseToSpeak = text || romanization || "";
  if (!phraseToSpeak.trim()) return;

  // 1. Stream High-Fidelity Studio Voice from /api/tts (Native Kannada / Indian English)
  try {
    const params = new URLSearchParams({
      text: text || "",
      roman: romanization || "",
      lang: langCode || "kn",
      profile: voiceProfile || "studio-female",
    });

    const audioUrl = `/api/tts?${params.toString()}`;
    const audio = new Audio(audioUrl);
    audio.playbackRate = rate || 1.0;
    activeAudio = audio;

    audio.onended = () => {
      activeAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      activeAudio = null;
      // Fallback to browser synthesis if network offline
      fallbackBrowserSpeech(text, langCode, romanization, onEnd, rate, voiceProfile);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        activeAudio = null;
        fallbackBrowserSpeech(text, langCode, romanization, onEnd, rate, voiceProfile);
      });
    }
  } catch (err) {
    fallbackBrowserSpeech(text, langCode, romanization, onEnd, rate, voiceProfile);
  }
}

/**
 * Offline Browser Speech Synthesis Fallback (Prioritizes Indian Female Voices)
 */
function fallbackBrowserSpeech(
  text: string,
  langCode: string,
  romanization?: string,
  onEnd?: () => void,
  rate: number = 1.0,
  voiceProfile: VoiceProfile = "studio-female"
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const phraseToSpeak = romanization || text || "";
    const utterance = new SpeechSynthesisUtterance();
    utterance.rate = rate || 1.0;
    utterance.pitch = 1.05; // Slightly higher pitch for natural female voice

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    const voices = window.speechSynthesis.getVoices();
    const isMale = (name: string) =>
      name.includes("ravi") ||
      name.includes("david") ||
      name.includes("mark") ||
      name.includes("george") ||
      name.includes("male");

    // Search for Indian female voice (Neerja, Heera, Veena, en-IN, kn-IN, hi-IN)
    let selected: SpeechSynthesisVoice | null =
      voices.find((v) => {
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();
        return (
          (name.includes("neerja") ||
            name.includes("heera") ||
            name.includes("veena") ||
            name.includes("aditi") ||
            name.includes("kavya") ||
            lang.includes("kn") ||
            lang.includes("en-in") ||
            lang.includes("hi-in")) &&
          !isMale(name)
        );
      }) ||
      voices.find((v) => v.lang.toLowerCase().includes("en-in") && !isMale(v.name.toLowerCase())) ||
      voices.find((v) => !isMale(v.name.toLowerCase())) ||
      voices[0] ||
      null;

    utterance.voice = selected;
    utterance.lang = selected?.lang || "en-IN";
    utterance.text = phraseToSpeak;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    if (onEnd) onEnd();
  }
}



