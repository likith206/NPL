import { FineTuneDashboard } from "@/components/pipeline/FineTuneDashboard";

export const metadata = {
  title: "AI Fine-Tuning Pipeline - HeritageVoice",
  description: "Monitor and trigger automated fine-tuning runs on community dataset updates.",
};

export default function PipelinePage() {
  return (
    <div className="py-4">
      <FineTuneDashboard />
    </div>
  );
}
