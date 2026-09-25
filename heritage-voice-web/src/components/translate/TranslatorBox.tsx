"use client";

import { useState } from "react";
import { Mic, MicOff, Volume2, Square, ArrowRightLeft, Copy, Check, Sparkles, HelpCircle, ShieldCheck, X, Gauge, UserCheck } from "lucide-react";
import { speakText, stopSpeech, VoiceProfile } from "@/lib/nlp/audioSynth";

interface TranslationResponse {
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  translatedText: string;
  romanization: string;
  confidence: number;
  engineUsed: string;
  culturalNote?: string;
}

export function TranslatorBox() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("kvd"); // kvd: Kodava, tcy: Tulu
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile>("studio-female");

  const handleTranslate = async (textToTranslate?: string) => {
    const queryText = textToTranslate ?? inputText;
    if (!queryText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: queryText,
          sourceLang,
          targetLang,
        }),
      });

      const data: TranslationResponse = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const oldSource = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(oldSource);
    if (result) {
      setInputText(result.translatedText);
      setResult(null);
    }
  };

  const handleCopy = () => {
    if (!result?.translatedText) return;
    navigator.clipboard.writeText(result.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeechInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition (STT) requires Chrome, Edge, or Safari with microphone permissions allowed.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = sourceLang === "en" ? "en-IN" : "kn-IN"; // Set Indian English / Kannada accent for STT
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e: any) => {
        setIsListening(false);
        alert(`Microphone input error (${e.error}). Please allow browser microphone permissions.`);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleTranslate(transcript);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      alert("Could not start microphone voice input. Please check browser audio permissions.");
    }
  };

  const handleToggleAudio = () => {
    if (!result?.translatedText) return;

    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(result.translatedText, targetLang, result.romanization, () => {
        setIsPlayingAudio(false);
      }, speechRate, voiceProfile);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl heritage-glass border border-amber-500/20 shadow-glow">
        
        {/* Source Language */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-amber-400/80 uppercase">From:</span>
          <select
            value={sourceLang}
            onChange={(e) => {
              setSourceLang(e.target.value);
              setResult(null);
            }}
            className="bg-neutral-900/90 text-amber-100 px-3.5 py-2 rounded-xl border border-amber-600/30 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="en">English (Bridge)</option>
            <option value="kvd">Kodava Takk (ಕೊಡವ)</option>
            <option value="tcy">Tulu (ತುಳು)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="p-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all hover:scale-110 active:scale-95 shadow-sm"
          title="Swap Languages"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        {/* Target Language, Voice Profile & Speed Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-amber-400/80 uppercase">To:</span>
            <select
              value={targetLang}
              onChange={(e) => {
                setTargetLang(e.target.value);
                setResult(null);
              }}
              className="bg-neutral-900/90 text-amber-100 px-3.5 py-2 rounded-xl border border-amber-600/30 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="kvd">Kodava Takk (ಕೊಡವ)</option>
              <option value="tcy">Tulu (ತುಳು)</option>
              <option value="en">English (Bridge)</option>
              <option value="kn">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>

          {/* Female Voice Profile Selector */}
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={voiceProfile}
              onChange={(e) => setVoiceProfile(e.target.value as VoiceProfile)}
              className="bg-neutral-900/90 text-amber-200 px-2.5 py-2 rounded-xl border border-amber-600/30 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              title="Select Voice Profile"
            >
              <option value="studio-female">Indian Female (Studio / Neerja)</option>
              <option value="native-kannada">Native Kannada (ಕನ್ನಡ ಧ್ವನಿ)</option>
              <option value="south-indian-female">South Indian Accent (Dravidian)</option>
              <option value="global-female">Global English</option>
            </select>
          </div>

          {/* Speed Toggle */}
          <button
            onClick={() => setSpeechRate(speechRate === 1.0 ? 0.8 : 1.0)}
            title="Toggle speech playback speed"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-neutral-900 border border-amber-600/30 text-[11px] font-mono text-amber-300 hover:bg-neutral-800 transition-all"
          >
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span>{speechRate === 1.0 ? "1.0x" : "0.8x"}</span>
          </button>
        </div>
      </div>

      {/* Input / Output Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Input Pane */}
        <div className="heritage-glass rounded-3xl p-5 sm:p-6 border border-amber-500/20 flex flex-col justify-between min-h-[300px] relative transition-all">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-amber-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" /> SOURCE INPUT
              </span>
              <div className="flex items-center gap-3">
                {inputText && (
                  <button
                    onClick={() => {
                      setInputText("");
                      setResult(null);
                    }}
                    className="text-neutral-400 hover:text-amber-300 transition-colors p-1"
                    title="Clear input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className={`text-[11px] font-mono ${inputText.length > 1800 ? "text-red-400 font-bold" : "text-amber-300/70"}`}>
                  {inputText.length}/2000
                </span>
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={2000}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey || (!e.shiftKey && inputText.length < 200))) {
                  e.preventDefault();
                  handleTranslate();
                }
              }}
              placeholder={
                sourceLang === "en"
                  ? "Type English phrase or paragraph... (Press Enter or Ctrl+Enter to translate)"
                  : "Type phrase in native script or phonetics..."
              }
              className="w-full h-40 bg-transparent text-amber-50 placeholder-neutral-500 resize-none focus:outline-none text-base sm:text-lg leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-amber-900/20">
            <button
              onClick={handleSpeechInput}
              className={`p-2.5 sm:px-3.5 rounded-xl border transition-all flex items-center gap-2 ${
                isListening
                  ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse shadow-glow"
                  : "bg-neutral-800/80 text-amber-300 border-amber-500/20 hover:bg-amber-600/20"
              }`}
              title="Speech-to-Text Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="text-xs font-semibold">{isListening ? "Listening..." : "Mic Voice"}</span>
              {isListening && (
                <div className="flex items-center gap-0.5 h-3 ml-1">
                  <span className="w-1 bg-red-400 rounded-full animate-wave-1"></span>
                  <span className="w-1 bg-red-400 rounded-full animate-wave-2"></span>
                  <span className="w-1 bg-red-400 rounded-full animate-wave-3"></span>
                </div>
              )}
            </button>

            <button
              onClick={() => handleTranslate()}
              disabled={loading || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-bold text-sm shadow-glow disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin"></div>
                  Translating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Translate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Pane */}
        <div className="heritage-glass rounded-3xl p-5 sm:p-6 border border-amber-500/20 flex flex-col justify-between min-h-[300px] bg-neutral-900/40 relative">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> TRANSLATION OUTPUT
              </span>
              {result && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-600/30 text-amber-300 text-[11px]">
                  {result.engineUsed} ({(result.confidence * 100).toFixed(0)}%)
                </span>
              )}
            </div>

            {result ? (
              <div className="space-y-3">
                <p className="text-2xl font-bold text-amber-100 leading-relaxed max-h-48 overflow-y-auto pr-1">
                  {result.translatedText}
                </p>

                {/* Phonetic Pronunciation Guide */}
                {result.romanization && (
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-700/20 space-y-1">
                    <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">
                      Pronunciation Guide (Romanization)
                    </span>
                    <p className="text-sm font-semibold text-amber-200 tracking-wide font-sans max-h-24 overflow-y-auto">
                      {result.romanization}
                    </p>
                  </div>
                )}

                {/* Cultural Note */}
                {result.culturalNote && (
                  <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-600/30 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-300/90 leading-relaxed">
                      <strong className="text-amber-200">Cultural Context: </strong>
                      {result.culturalNote}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-36 flex flex-col items-center justify-center text-neutral-500 text-sm space-y-2">
                <Sparkles className="w-8 h-8 text-neutral-600 opacity-40 animate-pulse" />
                <p>Translation output with phonetics will appear here.</p>
              </div>
            )}
          </div>

          {/* Action Buttons with Lively Sound Wave Visualizer */}
          {result && (
            <div className="flex items-center justify-between pt-4 border-t border-amber-900/20">
              <button
                onClick={handleToggleAudio}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  isPlayingAudio
                    ? "bg-red-500/20 text-red-300 border-red-500/50 hover:bg-red-500/30 animate-pulse shadow-glow"
                    : "bg-amber-600/20 hover:bg-amber-600/30 border-amber-500/30 text-amber-300"
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-4 h-4 text-red-400 fill-red-400" />
                    <span>Stop Speech</span>
                    <div className="flex items-center gap-0.5 h-3 ml-1.5">
                      <span className="w-1 bg-red-400 rounded-full animate-wave-1"></span>
                      <span className="w-1 bg-red-400 rounded-full animate-wave-2"></span>
                      <span className="w-1 bg-red-400 rounded-full animate-wave-3"></span>
                      <span className="w-1 bg-red-400 rounded-full animate-wave-4"></span>
                    </div>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>Listen Audio (TTS)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Quick Phrase Starters */}
      <div className="p-4 rounded-2xl heritage-glass border border-amber-500/20 shadow-sm">
        <span className="text-xs text-amber-400 font-mono block mb-2.5">
          TRY POPULAR HERITAGE PHRASES:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { text: "Greetings / Hello", target: "kvd" },
            { text: "How was your day", target: "kvd" },
            { text: "Welcome to our home", target: "kvd" },
            { text: "Thank you very much", target: "tcy" },
            { text: "After hardship comes prosperity", target: "tcy" },
            { text: "What is your name?", target: "kvd" },
            { text: "Let's drink hot coffee", target: "kvd" },
          ].map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSourceLang("en");
                setTargetLang(phrase.target);
                setInputText(phrase.text);
                handleTranslate(phrase.text);
              }}
              className="px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-amber-600/30 border border-amber-500/20 text-xs text-amber-200 transition-all hover:scale-105 active:scale-95 font-medium"
            >
              "{phrase.text}"
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

