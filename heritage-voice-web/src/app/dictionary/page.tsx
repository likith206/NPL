import { DictionaryView } from "@/components/dictionary/DictionaryView";

export const metadata = {
  title: "Dictionary & Phrasebook - HeritageVoice",
  description: "Explore Kodava Takk and Tulu vocabulary, proverbs, and cultural notes.",
};

export default function DictionaryPage() {
  return (
    <div className="py-4">
      <DictionaryView />
    </div>
  );
}
