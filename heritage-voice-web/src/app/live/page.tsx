"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, Radio, MessageSquare, Zap, VolumeX, ShieldCheck, Download, Trash2, ArrowRight } from "lucide-react";
import { speakText, stopSpeech } from "@/lib/nlp/audioSynth";

interface LiveMessage {
  id: string;
  speaker: "user" | "native";
  text: string;
  translation: string;
  romanization: string;
  timestamp: string;
}

export default function LiveTranslationPage() {
  const [isListening, setIsListening] = useState(false);
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("kvd"); // kvd: Kodava, tcy: Tulu
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [currentInterim, setCurrentInterim] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentInterim]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Real-time live speech input requires Chrome, Edge, or Safari with microphone permissions allowed.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = sourceLang === "en" ? "en-IN" : "kn-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e: any) => {
        setIsListening(false);
        console.warn("STT Error:", e.error);
      };

      recognition.onresult = async (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setCurrentInterim("");
            await processLiveSentence(transcript);
          } else {
            interim += transcript;
          }
        }
        setCurrentInterim(interim);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      alert("Could not start live microphone stream. Please check audio permissions.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setCurrentInterim("");
  };

  const processLiveSentence = async (text: string) => {
    if (!text.trim()) return;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });
      const data = await res.json();

      const newMsg: LiveMessage = {
        id: Date.now().toString(),
        speaker: sourceLang === "en" ? "user" : "native",
        text,
        translation: data.translatedText || "",
        romanization: data.romanization || "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };

      setMessages((prev) => [...prev, newMsg]);

      if (autoSpeak && data.translatedText) {
        speakText(data.translatedText, targetLang, data.romanization);
      }
    } catch (err) {
      console.error("Live translation error:", err);
    }
  };

  const handleExportTranscript = () => {
    if (messages.length === 0) return;
    const textContent = messages
      .map((m) => `[${m.timestamp}] ${m.speaker.toUpperCase()}: "${m.text}" -> "${m.translation}" (${m.romanization})`)
      .join("\n\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `heritage-live-transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono shadow-glow">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" /> LIVE STREAM TRANSLATION MODE
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-100 tracking-tight">
          Real-Time Heritage <span className="gradient-text-heritage">Speech Stream</span>
        </h1>
        <p className="text-amber-200/80 max-w-xl mx-auto text-sm sm:text-base">
          Hands-free continuous live conversation engine for Kodava Takk & Tulu dialects with instant audio playback.
        </p>
      </div>

      {/* Control Panel */}
      <div className="heritage-glass rounded-3xl p-5 sm:p-6 border border-amber-500/20 flex flex-wrap items-center justify-between gap-4 shadow-glow">
        
        {/* Language Selectors */}
        <div className="flex items-center gap-2.5">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="bg-neutral-900 text-amber-100 px-3.5 py-2.5 rounded-2xl border border-amber-600/30 text-xs font-semibold focus:outline-none"
          >
            <option value="en">English Speaker</option>
            <option value="kvd">Kodava Takk (ಕೊಡವ)</option>
            <option value="tcy">Tulu (ತುಳು)</option>
          </select>

          <ArrowRight className="w-4 h-4 text-amber-400" />

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-neutral-900 text-amber-100 px-3.5 py-2.5 rounded-2xl border border-amber-600/30 text-xs font-semibold focus:outline-none"
          >
            <option value="kvd">Kodava Takk (ಕೊಡವ)</option>
            <option value="tcy">Tulu (ತುಳು)</option>
            <option value="en">English Output</option>
          </select>
        </div>

        {/* Auto Speak Toggle */}
        <button
          onClick={() => setAutoSpeak(!autoSpeak)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
            autoSpeak
              ? "bg-amber-600/20 border-amber-500/40 text-amber-300"
              : "bg-neutral-800 border-neutral-700 text-neutral-400"
          }`}
        >
          {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          Auto-Speak TTS: {autoSpeak ? "ON" : "OFF"}
        </button>

        {/* Live Mic Toggle Button */}
        <button
          onClick={toggleListening}
          className={`px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 shadow-glow transition-all active:scale-95 ${
            isListening
              ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
              : "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-amber-950"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5" />
              <span>Stop Live Mic</span>
              <div className="flex items-center gap-0.5 h-3.5 ml-1">
                <span className="w-1 bg-white rounded-full animate-wave-1"></span>
                <span className="w-1 bg-white rounded-full animate-wave-2"></span>
                <span className="w-1 bg-white rounded-full animate-wave-3"></span>
              </div>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Start Hands-Free Live Mic</span>
            </>
          )}
        </button>

      </div>

      {/* Live Stream Transcript Box */}
      <div className="heritage-glass rounded-3xl p-6 border border-amber-500/20 space-y-4 shadow-glow">
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
          <span className="text-xs font-mono text-amber-400 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" /> CONVERSATION TRANSCRIPT STREAM ({messages.length} lines)
          </span>
          <div className="flex items-center gap-3">
            {messages.length > 0 && (
              <>
                <button
                  onClick={handleExportTranscript}
                  className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-100 transition-colors font-mono"
                  title="Export Transcript as .txt"
                >
                  <Download className="w-3.5 h-3.5" /> Export Text
                </button>
                <button
                  onClick={() => setMessages([])}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-400 transition-colors font-mono"
                  title="Clear conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </>
            )}
            {isListening && (
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Streaming Live...
              </span>
            )}
          </div>
        </div>

        <div ref={scrollRef} className="h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.length === 0 && !currentInterim && (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-sm space-y-2">
              <Zap className="w-8 h-8 text-neutral-600 opacity-40 animate-pulse" />
              <p>Click "Start Hands-Free Live Mic" and speak naturally to stream live translations.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className="p-4 sm:p-5 rounded-3xl bg-neutral-900/80 border border-amber-600/20 space-y-2 transition-all">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="text-amber-400 font-semibold">{msg.speaker === "user" ? "YOU (ENGLISH)" : "NATIVE SPEAKER"}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="text-sm text-neutral-300">"{msg.text}"</p>
              <div className="pt-2 border-t border-neutral-800 space-y-1">
                <p className="text-xl sm:text-2xl font-extrabold text-amber-100">{msg.translation}</p>
                {msg.romanization && (
                  <p className="text-xs font-mono text-amber-300">/{msg.romanization}/</p>
                )}
              </div>
            </div>
          ))}

          {currentInterim && (
            <div className="p-4 rounded-3xl bg-amber-950/30 border border-amber-500/40 animate-pulse text-amber-200">
              <span className="text-[10px] font-mono text-amber-400 block mb-1">RECORDING LIVE STREAM...</span>
              <p className="text-base font-semibold">{currentInterim}</p>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}

