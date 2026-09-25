"use client";

import { useState } from "react";
import { Mic, MicOff, Send, CheckCircle2, Volume2, Users, Sparkles, UploadCloud } from "lucide-react";

export function ContributionForm() {
  const [targetLang, setTargetLang] = useState("kvd");
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [romanization, setRomanization] = useState("");
  const [context, setContext] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalText.trim() || !translatedText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceLang: "en",
          targetLang,
          originalText,
          translatedText,
          romanization,
          context,
          authorName: authorName || "Community Native Contributor",
          audioUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setOriginalText("");
        setTranslatedText("");
        setRomanization("");
        setContext("");
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const startAudioRecording = () => {
    if (typeof window === "undefined") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Audio recording is not supported in this browser.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          setIsRecording(false);
        };

        mediaRecorder.start();
        setIsRecording(true);

        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 5000); // Record up to 5 seconds
      })
      .catch((err) => console.error("Mic access error:", err));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          Community Crowdsourcing Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-50 tracking-tight">
          Contribute <span className="gradient-text-heritage">Regional Vocabulary</span>
        </h1>
        <p className="text-sm text-neutral-400 max-w-lg mx-auto">
          Help build the largest open dataset for Kodava and Tulu. Your submissions are reviewed by elders and linguists to fine-tune our AI models.
        </p>
      </div>

      {submitted ? (
        <div className="heritage-glass p-8 rounded-3xl border border-emerald-500/30 text-center space-y-4 shadow-glow">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-2xl font-bold text-amber-100">Contribution Submitted!</h3>
          <p className="text-sm text-neutral-300 max-w-md mx-auto">
            Thank you for helping preserve indigenous Dravidian language heritage. Your entry is in the moderation queue for verification.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-sm transition-all"
          >
            Submit Another Phrase
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="heritage-glass p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-6">
          
          {/* Target Language Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
              Target Heritage Language
            </label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full bg-neutral-900/90 text-amber-100 px-4 py-3 rounded-xl border border-amber-600/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="kvd">Kodava Takk (ಕೊಡವ)</option>
              <option value="tcy">Tulu (ತುಳು)</option>
            </select>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                English Phrase / Word *
              </label>
              <input
                type="text"
                required
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="e.g. 'Coffee is ready'"
                className="w-full bg-neutral-900/90 text-amber-100 px-4 py-3 rounded-xl border border-amber-600/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                Native Script Translation *
              </label>
              <input
                type="text"
                required
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                placeholder="e.g. 'ಕಾಫಿ ರೆಡಿ ಆಯಿಟುಳ್ಳು' or 'ಚಾ ಪರ್ಲೆ'"
                className="w-full bg-neutral-900/90 text-amber-100 px-4 py-3 rounded-xl border border-amber-600/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                Phonetic Romanization
              </label>
              <input
                type="text"
                value={romanization}
                onChange={(e) => setRomanization(e.target.value)}
                placeholder="e.g. 'Coffee ready aayitullu'"
                className="w-full bg-neutral-900/90 text-amber-100 px-4 py-3 rounded-xl border border-amber-600/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                Cultural Context / Usage
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. 'Morning hospitality term'"
                className="w-full bg-neutral-900/90 text-amber-100 px-4 py-3 rounded-xl border border-amber-600/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Audio Recording Feature */}
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-amber-900/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-amber-200 block">Native Speaker Audio Recording</span>
                <span className="text-xs text-neutral-400">Record 3-5 seconds of clear pronunciation.</span>
              </div>
              <button
                type="button"
                onClick={startAudioRecording}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                  isRecording
                    ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse"
                    : "bg-amber-600/20 text-amber-300 border-amber-500/30 hover:bg-amber-600/30"
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? "Recording..." : "Record Mic"}
              </button>
            </div>

            {audioUrl && (
              <div className="flex items-center gap-3 pt-2">
                <audio src={audioUrl} controls className="h-8 text-xs max-w-full" />
                <span className="text-xs text-emerald-400 font-mono">Audio Clip Ready!</span>
              </div>
            )}
          </div>

          {/* Contributor Name */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
              Your Name / Handle
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Bopanna Coorg or Anonymous"
              className="w-full bg-neutral-900/90 text-amber-100 px-4 py-3 rounded-xl border border-amber-600/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !originalText || !translatedText}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-amber-950 font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
          >
            {submitting ? "Submitting..." : (
              <>
                <Send className="w-4 h-4" /> Submit to Heritage Dataset Queue
              </>
            )}
          </button>

        </form>
      )}

    </div>
  );
}
