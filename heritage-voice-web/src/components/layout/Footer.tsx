import Link from "next/link";
import { Heart, Globe2, Sparkles, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-amber-900/20 bg-neutral-950/80 text-neutral-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Mission */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/30 flex items-center justify-center border border-amber-500/40">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-lg font-bold text-amber-200">HeritageVoice Engine</span>
          </div>
          <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
            Preserving vulnerable regional languages of India through open NLP models, crowdsourced dictionary fine-tuning, and cultural documentation. Dedicated to Kodava Takk & Tulu.
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-400/80 font-mono">
            <Globe2 className="w-4 h-4 text-amber-500" />
            <span>IndicBERT-v2 & Gemini 2.5 Multi-Engine Powered</span>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-amber-200 uppercase tracking-wider">Features</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/translate" className="hover:text-amber-300 transition-colors">AI Text & Voice Translator</Link>
            </li>
            <li>
              <Link href="/dictionary" className="hover:text-amber-300 transition-colors">Phrasebook & Dictionary</Link>
            </li>
            <li>
              <Link href="/learn" className="hover:text-amber-300 transition-colors">Flashcard Learning Deck</Link>
            </li>
            <li>
              <Link href="/contribute" className="hover:text-amber-300 transition-colors">Submit Audio & Words</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Technical & AI */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-amber-200 uppercase tracking-wider">AI Preservation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/pipeline" className="hover:text-amber-300 transition-colors">Fine-Tuning Dashboard</Link>
            </li>
            <li>
              <Link href="/review" className="hover:text-amber-300 transition-colors">Linguist Moderation Portal</Link>
            </li>
            <li className="text-xs text-neutral-500 pt-2">
              Kodagu & Tulu Nadu Open Data Initiative
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
        <p>© 2026 HeritageVoice. Open-source Heritage Preservation Engine.</p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Coorg & Tulu Nadu Heritage.
        </p>
      </div>
    </footer>
  );
}
