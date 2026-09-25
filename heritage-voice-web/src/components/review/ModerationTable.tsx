"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Check, X, ThumbsUp, Sparkles, Filter } from "lucide-react";

interface Contribution {
  id: string;
  sourceLang: string;
  targetLang: string;
  originalText: string;
  translatedText: string;
  romanization?: string;
  context?: string;
  authorName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  upvotes: number;
  createdAt: string;
}

export function ModerationTable() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contribute");
      const data = await res.json();
      if (data.contributions) {
        setContributions(data.contributions);
      }
    } catch (err) {
      console.error("Error fetching contributions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "APPROVE" | "REJECT" | "UPVOTE") => {
    try {
      const res = await fetch("/api/contribute", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.contribution) {
        setContributions((prev) =>
          prev.map((c) => (c.id === id ? data.contribution : c))
        );
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  const filtered = filter === "ALL"
    ? contributions
    : contributions.filter((c) => c.status === filter);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Linguist Moderation Portal
          </div>
          <h1 className="text-3xl font-extrabold text-amber-50 tracking-tight">
            Community <span className="gradient-text-heritage">Dataset Review Queue</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review, verify, or refine crowdsourced entries before pushing to the AI fine-tuning dataset.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-2 bg-neutral-900/90 p-1.5 rounded-xl border border-amber-600/30">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === st
                  ? "bg-amber-600 text-amber-950 shadow-sm"
                  : "text-neutral-400 hover:text-amber-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Moderation Table / Cards */}
      {loading ? (
        <div className="text-center py-16 text-amber-300 space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm">Fetching moderation queue...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="heritage-glass p-5 rounded-2xl border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-950 border border-amber-700/40 text-[11px] font-mono text-amber-300 uppercase">
                    {item.targetLang === "kvd" ? "Kodava" : "Tulu"}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.status === "APPROVED"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-600/30"
                        : item.status === "REJECTED"
                        ? "bg-red-950 text-red-300 border border-red-600/30"
                        : "bg-amber-900/50 text-amber-300 border border-amber-500/30 animate-pulse"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    by {item.authorName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-amber-900/20">
                    <span className="text-[10px] text-neutral-500 font-mono block">ENGLISH SOURCE</span>
                    <p className="text-sm font-semibold text-amber-100">{item.originalText}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-amber-900/20">
                    <span className="text-[10px] text-neutral-500 font-mono block">NATIVE TRANSLATION & PHONETICS</span>
                    <p className="text-sm font-semibold text-amber-200">{item.translatedText}</p>
                    {item.romanization && (
                      <p className="text-xs font-mono text-amber-400">/{item.romanization}/</p>
                    )}
                  </div>
                </div>

                {item.context && (
                  <p className="text-xs text-neutral-400 italic">Context: "{item.context}"</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-amber-900/20">
                <button
                  onClick={() => handleAction(item.id, "UPVOTE")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-semibold transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                  {item.upvotes}
                </button>

                {item.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleAction(item.id, "APPROVE")}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-xs transition-all shadow-sm"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "REJECT")}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700/40 text-red-300 font-semibold text-xs transition-all"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 heritage-glass rounded-2xl border border-amber-500/20 space-y-2">
          <ShieldAlert className="w-10 h-10 text-neutral-600 mx-auto" />
          <p className="text-amber-200 font-semibold">No submissions in this view.</p>
        </div>
      )}

    </div>
  );
}
