import { FlashcardDeck } from "@/components/learn/FlashcardDeck";

export const metadata = {
  title: "Learning Hub - HeritageVoice",
  description: "Interactive 3D flashcards and pronunciation lessons for Kodava and Tulu.",
};

export default function LearnPage() {
  return (
    <div className="py-4">
      <FlashcardDeck />
    </div>
  );
}
