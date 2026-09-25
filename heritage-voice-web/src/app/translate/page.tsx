import { TranslatorBox } from "@/components/translate/TranslatorBox";

export const metadata = {
  title: "AI Translator - HeritageVoice",
  description: "Bidirectional AI translation for Kodava Takk, Tulu, English, and Kannada.",
};

export default function TranslatePage() {
  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-50">
          Heritage <span className="gradient-text-heritage">AI Translator</span>
        </h1>
        <p className="text-sm text-neutral-400 max-w-lg mx-auto">
          Translating between English, Kodava (Coorgi), Tulu, and Kannada with script Romanization and synthetic speech playback.
        </p>
      </div>

      <TranslatorBox />
    </div>
  );
}
