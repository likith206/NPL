import { ContributionForm } from "@/components/contribute/ContributionForm";

export const metadata = {
  title: "Community Crowdsourcing - HeritageVoice",
  description: "Submit new words, sentences, and audio recordings for Kodava and Tulu.",
};

export default function ContributePage() {
  return (
    <div className="py-4">
      <ContributionForm />
    </div>
  );
}
