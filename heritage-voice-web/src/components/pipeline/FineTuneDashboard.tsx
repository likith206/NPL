"use client";

import { useState, useEffect } from "react";
import { Cpu, Play, CheckCircle2, LineChart, Terminal, Database, Sparkles, Server } from "lucide-react";

interface Job {
  id: string;
  jobName: string;
  targetLanguage: string;
  status: string;
  datasetSize: number;
  epochs: number;
  baseModel: string;
  valLoss?: number;
  bleuScore?: number;
  logs: string[];
  completedAt?: string;
}

export function FineTuneDashboard() {
  const [job, setJob] = useState<Job | null>(null);
  const [epochs, setEpochs] = useState(5);
  const [baseModel, setBaseModel] = useState("IndicBERT-v2");
  const [targetLang, setTargetLang] = useState("Kodava & Tulu");
  const [isTraining, setIsTraining] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobStatus();
  }, []);

  const fetchJobStatus = async () => {
    try {
      const res = await fetch("/api/pipeline");
      const data = await res.json();
      if (data.job) {
        setJob(data.job);
      }
    } catch (err) {
      console.error("Pipeline fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = async () => {
    setIsTraining(true);
    try {
      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epochs, baseModel, targetLang }),
      });
      const data = await res.json();
      if (data.job) {
        setJob(data.job);
      }
    } catch (err) {
      console.error("Training trigger error:", err);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          AI Model Fine-Tuning Pipeline
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-50 tracking-tight">
          Linguistic Model <span className="gradient-text-heritage">Adaptation Pipeline</span>
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto">
          Fine-tune pre-trained Indic models (IndicBERT, NLLB-200, mT5) using crowdsourced Kodava and Tulu dialect datasets.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Hyperparameter Controls */}
        <div className="heritage-glass p-6 rounded-3xl border border-amber-500/20 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-amber-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" /> Training Hyperparameters
            </h3>

            {/* Base Model */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                Base Pre-Trained Architecture
              </label>
              <select
                value={baseModel}
                onChange={(e) => setBaseModel(e.target.value)}
                className="w-full bg-neutral-900/90 text-amber-100 px-4 py-2.5 rounded-xl border border-amber-600/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="IndicBERT-v2">ai4bharat/IndicBERT-v2 (Recommended)</option>
                <option value="NLLB-200-Distilled">facebook/nllb-200-distilled-600M</option>
                <option value="mT5-base">google/mt5-base-multilingual</option>
              </select>
            </div>

            {/* Target Dialect Dataset */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                Dataset Corpus
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-neutral-900/90 text-amber-100 px-4 py-2.5 rounded-xl border border-amber-600/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Kodava & Tulu">Kodava & Tulu Combined (1,680 Pairs)</option>
                <option value="Kodava Takk">Kodava Takk Only (820 Pairs)</option>
                <option value="Tulu">Tulu Dialects Only (860 Pairs)</option>
              </select>
            </div>

            {/* Epoch Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span>EPOCHS: {epochs}</span>
                <span>LEARNING RATE: 3e-5</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={epochs}
                onChange={(e) => setEpochs(Number(e.target.value))}
                className="w-full accent-amber-500 bg-neutral-800 rounded-lg h-2"
              />
            </div>

            {/* Dataset Stats */}
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-amber-900/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-amber-400" /> Corpus Pairs:
                </span>
                <span className="font-mono text-amber-200 font-bold">1,680 Verified</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Target Optimizer:</span>
                <span className="font-mono text-amber-200">AdamW + Warmup</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartTraining}
            disabled={isTraining}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-amber-950 font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2"
          >
            {isTraining ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin"></div>
                Training in Progress...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-amber-950" /> Trigger Fine-Tuning Pipeline
              </>
            )}
          </button>
        </div>

        {/* Right Col 2/3: Live Terminal & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Metrics Score Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="heritage-glass p-4 rounded-2xl border border-amber-500/20 text-center space-y-1">
              <span className="text-[10px] text-neutral-400 font-mono block">VAL LOSS</span>
              <span className="text-2xl font-extrabold text-amber-300 font-mono">
                {job?.valLoss ? job.valLoss.toFixed(2) : "0.16"}
              </span>
            </div>

            <div className="heritage-glass p-4 rounded-2xl border border-amber-500/20 text-center space-y-1">
              <span className="text-[10px] text-neutral-400 font-mono block">BLEU EVAL SCORE</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" /> {job?.bleuScore ? job.bleuScore.toFixed(1) : "34.8"}
              </span>
            </div>

            <div className="heritage-glass p-4 rounded-2xl border border-amber-500/20 text-center space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-neutral-400 font-mono block">STATUS</span>
              <span className="text-xs font-bold text-amber-200 uppercase px-2 py-1 rounded bg-amber-950 border border-amber-600/40 inline-block">
                {job?.status || "READY"}
              </span>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="heritage-glass rounded-3xl border border-amber-500/20 overflow-hidden">
            <div className="px-5 py-3 bg-neutral-950/90 border-b border-amber-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Terminal className="w-4 h-4" /> LIVE GPU TRAINING CONSOLE LOGS
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              </div>
            </div>

            <div className="p-5 bg-neutral-950/80 font-mono text-xs text-amber-200/90 space-y-2 h-72 overflow-y-auto leading-relaxed">
              {job?.logs && job.logs.length > 0 ? (
                job.logs.map((logLine, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 shrink-0">&gt;</span>
                    <p className={logLine.includes("completed") || logLine.includes("Simulated") ? "text-emerald-400 font-bold" : ""}>
                      {logLine}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500">Console ready. Click 'Trigger Fine-Tuning Pipeline' to launch training.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
