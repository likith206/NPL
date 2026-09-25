import { ModerationTable } from "@/components/review/ModerationTable";

export const metadata = {
  title: "Linguist Moderation Queue - HeritageVoice",
  description: "Review and approve crowdsourced community submissions for AI fine-tuning.",
};

export default function ReviewPage() {
  return (
    <div className="py-4">
      <ModerationTable />
    </div>
  );
}
