import Link from "next/link";
import { TranslatorBox } from "@/components/translate/TranslatorBox";
import { Sparkles, Globe, ShieldCheck, Users, Cpu, ArrowRight, BookOpen, GraduationCap, Heart, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-24 py-6">
      
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/30 text-amber-300 text-xs font-medium shadow-glow">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>AI-Powered Heritage Language Preservation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-amber-50 leading-[1.15]">
          Giving Voice to India's <br />
          <span className="gradient-text-heritage">Endangered Heritage Languages</span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Preserving regional dialects like <strong className="text-amber-300">Kodava Takk</strong> and <strong className="text-amber-300">Tulu</strong> through specialized neural translation models, crowdsourced lexicography, and community-led AI fine-tuning.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/translate"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-bold text-sm shadow-glow transition-all flex items-center gap-2"
          >
            Launch Translator <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dictionary"
            className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-500/20 text-amber-200 font-semibold text-sm transition-all"
          >
            Explore Phrasebook
          </Link>
        </div>
      </section>

      {/* Embed Live Interactive Translator Preview */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-100">
            Try Bidirectional <span className="gradient-text-heritage">AI Translation</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Instant conversion with script romanization & synthetic audio speech playback.
          </p>
        </div>

        <TranslatorBox />
      </section>

      {/* Statistics Banner */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Documented Words", val: "1,680+", sub: "Verified Entries" },
          { label: "Target Languages", val: "Kodava & Tulu", sub: "Endangered Dialects" },
          { label: "AI Model BLEU", val: "34.8 Score", sub: "IndicBERT Fine-Tuned" },
          { label: "Community Contribs", val: "450+", sub: "Speakers & Elders" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="heritage-glass p-6 rounded-2xl border border-amber-500/20 text-center space-y-1 heritage-glass-hover transition-all"
          >
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono">
              {stat.val}
            </span>
            <p className="text-xs font-bold text-amber-100">{stat.label}</p>
            <span className="text-[10px] text-neutral-400 block">{stat.sub}</span>
          </div>
        ))}
      </section>

      {/* How It Works - NLP Approach & Architecture */}
      <section className="space-y-8 heritage-glass p-8 sm:p-12 rounded-3xl border border-amber-500/20">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            NLP & AI Methodology
          </div>
          <h2 className="text-3xl font-extrabold text-amber-50 tracking-tight">
            How <span className="gradient-text-heritage">HeritageVoice Works</span>
          </h2>
          <p className="text-sm text-neutral-400">
            Our multi-tier translation pipeline ensures high fidelity even for low-resource languages with minimal digital footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3 p-5 rounded-2xl bg-neutral-900/60 border border-amber-900/30">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 flex items-center justify-center text-amber-400 font-bold font-mono border border-amber-500/40">
              01
            </div>
            <h3 className="text-lg font-bold text-amber-100">Specialized Lexicon Matcher</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Queries an curated dictionary of Kodava and Tulu words, proverbs, and idioms verified by native language elders for 100% precision.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-neutral-900/60 border border-amber-900/30">
            <div className="w-10 h-10 rounded-xl bg-orange-600/30 flex items-center justify-center text-amber-400 font-bold font-mono border border-amber-500/40">
              02
            </div>
            <h3 className="text-lg font-bold text-amber-100">IndicBERT / NLLB Neural Bridge</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Uses multilingual Dravidian embeddings (IndicBERT-v2 & Gemini 2.5 API) for context-aware sentence translation and grammatical alignment.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-neutral-900/60 border border-amber-900/30">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 flex items-center justify-center text-amber-400 font-bold font-mono border border-amber-500/40">
              03
            </div>
            <h3 className="text-lg font-bold text-amber-100">Community Fine-Tuning Pipeline</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Approved community contributions are tokenized and processed through an automated model re-training loop, continuously boosting BLEU score over time.
            </p>
          </div>

        </div>
      </section>

      {/* Preservation Modules Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-amber-50">
            Explore the <span className="gradient-text-heritage">Heritage Ecosystem</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link
            href="/dictionary"
            className="heritage-glass heritage-glass-hover p-6 rounded-2xl border border-amber-500/20 space-y-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                Phrasebook & Dictionary
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Browse categorized words, cultural notes, and proverbs with native audio.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
              Explore Dictionary <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/learn"
            className="heritage-glass heritage-glass-hover p-6 rounded-2xl border border-amber-500/20 space-y-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                Interactive Learning Hub
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Master Kodava & Tulu through interactive 3D flashcard decks and pronunciation drills.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
              Start Learning <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/contribute"
            className="heritage-glass heritage-glass-hover p-6 rounded-2xl border border-amber-500/20 space-y-4 group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                Community Crowdsourcing
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Submit native words, sentences, and audio recordings to help preserve your dialect.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
              Contribute Data <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}
