"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Volume2, BookOpen, Sparkles, Filter, Info, ChevronLeft, ChevronRight, Hash, Download, FileSpreadsheet, FileJson, X, Copy, Check, Square } from "lucide-react";
import { speakText, stopSpeech } from "@/lib/nlp/audioSynth";

interface Entry {
  id: string;
  term: string;
  romanization: string;
  partOfSpeech: string;
  definition: string;
  culturalNote?: string;
  language: {
    code: string;
    name: string;
    nativeName: string;
  };
}

const CATEGORY_TAGS = [
  { label: "All Words", query: "" },
  { label: "Greetings", query: "greeting" },
  { label: "Family & Kin", query: "family" },
  { label: "Food & Dining", query: "coffee" },
  { label: "Proverbs & Idioms", query: "proverb" },
  { label: "Daily Life", query: "day" },
];

export function DictionaryView() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounce search input by 250ms to eliminate redundant network requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, langFilter]);

  useEffect(() => {
    fetchEntries();
  }, [debouncedSearch, langFilter, page]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dictionary?q=${encodeURIComponent(debouncedSearch)}&lang=${langFilter}&page=${page}&limit=30`);
      const data = await res.json();
      if (data.entries) {
        setEntries(data.entries);
        setTotalEntries(data.total || data.entries.length);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching dictionary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (entryId: string, term: string, langCode: string, roman: string) => {
    if (playingId === entryId) {
      stopSpeech();
      setPlayingId(null);
    } else {
      setPlayingId(entryId);
      speakText(term, langCode, roman, () => {
        setPlayingId(null);
      });
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDownload = (format: "csv" | "json") => {
    setDownloading(format);
    const downloadUrl = `/api/dictionary/download?lang=${langFilter}&format=${format}`;
    
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(null);
    }, 1200);
  };

  const handleTagClick = (tagQuery: string, tagLabel: string) => {
    setSelectedTag(tagLabel);
    setSearch(tagQuery);
  };

  const getLangName = () => {
    if (langFilter === "tcy") return "Tulu";
    if (langFilter === "kvd") return "Kodava Takk";
    return "All Heritage";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-glow">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Historical Lexicon & Phrasebook</span>
          <span className="bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full font-mono text-[11px]">
            {totalEntries > 0 ? `${totalEntries.toLocaleString()} Words` : "Loading..."}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-50 tracking-tight">
          Heritage <span className="gradient-text-heritage">Dictionary & Phrasebook</span>
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Explore, listen, and download over {totalEntries > 0 ? totalEntries.toLocaleString() : "7,500+"} documented words, expressions, and cultural notes from Tulu and Kodava Takk.
        </p>
      </div>

      {/* Search, Filter & Category Chips */}
      <div className="space-y-4 heritage-glass p-5 rounded-3xl border border-amber-500/20 shadow-glow">
        
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 7,500+ words in English, Tulu (ತುಳು), Kodava, or Romanized script..."
              className="w-full bg-neutral-900/90 text-amber-100 placeholder-neutral-500 pl-11 pr-10 py-3 rounded-2xl border border-amber-600/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedTag("");
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-amber-300 transition-colors p-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language Filter & Download Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Language Filter */}
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <Filter className="w-4 h-4 text-amber-400 shrink-0" />
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="w-full sm:w-48 bg-neutral-900/90 text-amber-100 px-3.5 py-3 rounded-2xl border border-amber-600/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Languages</option>
                <option value="tcy">Tulu (ತುಳು)</option>
                <option value="kvd">Kodava Takk (ಕೊಡವ)</option>
              </select>
            </div>

            {/* Download Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload("csv")}
                disabled={downloading === "csv"}
                title={`Download ${getLangName()} Dictionary as CSV`}
                className="flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-200 text-xs font-semibold shadow-glow transition-all active:scale-95 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>{downloading === "csv" ? "Exporting..." : "CSV"}</span>
              </button>

              <button
                onClick={() => handleDownload("json")}
                disabled={downloading === "json"}
                title={`Download ${getLangName()} Dictionary as JSON`}
                className="flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-orange-200 text-xs font-semibold shadow-glow transition-all active:scale-95 disabled:opacity-50"
              >
                <FileJson className="w-4 h-4 text-amber-400" />
                <span>{downloading === "json" ? "Exporting..." : "JSON"}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-[11px] font-mono text-neutral-400 shrink-0">Topics:</span>
          {CATEGORY_TAGS.map((tag) => (
            <button
              key={tag.label}
              onClick={() => handleTagClick(tag.query, tag.label)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all active:scale-95 ${
                (search === tag.query && tag.query !== "") || (search === "" && tag.query === "")
                  ? "bg-amber-600 text-amber-950 font-bold shadow-sm"
                  : "bg-neutral-800/80 text-amber-200/80 hover:bg-neutral-700/80 border border-amber-500/10"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

      </div>

      {/* Pagination & Status Bar */}
      <div className="flex items-center justify-between text-xs text-neutral-400 font-mono px-1">
        <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
          <Hash className="w-3.5 h-3.5 text-amber-400" />
          Showing {entries.length} of {totalEntries.toLocaleString()} Entries ({getLangName()})
        </span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {/* Entry Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-amber-300 space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-mono">Searching Heritage Database ({totalEntries.toLocaleString()} words)...</p>
        </div>
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => {
            const isPlaying = playingId === entry.id;
            const isCopied = copiedId === entry.id;

            return (
              <div
                key={entry.id}
                className="heritage-glass heritage-glass-hover p-5 rounded-3xl border border-amber-500/20 flex flex-col justify-between transition-all space-y-4 group hover:-translate-y-1 duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-950/80 border border-amber-700/40 text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                      {entry.language.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-neutral-400 capitalize px-2 py-0.5 rounded-md bg-neutral-800">
                        {entry.partOfSpeech}
                      </span>
                      <button
                        onClick={() => handleCopy(entry.id, `${entry.term} (${entry.romanization}) - ${entry.definition}`)}
                        className="text-neutral-400 hover:text-amber-300 transition-colors p-1"
                        title="Copy entry"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-amber-100 tracking-tight group-hover:text-amber-200 transition-colors">
                      {entry.term}
                    </h3>
                    <p className="text-sm font-medium text-amber-400 font-mono mt-0.5">
                      /{entry.romanization}/
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-amber-900/20 space-y-1">
                    <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">
                      Meaning
                    </span>
                    <p className="text-sm text-amber-200 font-medium leading-relaxed">
                      {entry.definition}
                    </p>
                  </div>

                  {entry.culturalNote && (
                    <div className="p-3 rounded-2xl bg-amber-900/20 border border-amber-600/20 text-xs text-amber-300/90 space-y-1">
                      <span className="flex items-center gap-1 font-semibold text-amber-200 text-[11px]">
                        <Info className="w-3.5 h-3.5 text-amber-400" /> Cultural Note
                      </span>
                      <p className="leading-relaxed">{entry.culturalNote}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3.5 border-t border-amber-900/20 flex items-center justify-between">
                  <button
                    onClick={() => handlePlay(entry.id, entry.term, entry.language.code, entry.romanization)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                      isPlaying
                        ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse shadow-glow"
                        : "bg-amber-600/20 hover:bg-amber-600/30 border-amber-500/30 text-amber-300"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                        <span>Stop</span>
                        <div className="flex items-center gap-0.5 h-2.5 ml-1">
                          <span className="w-0.5 bg-red-400 rounded-full animate-wave-1"></span>
                          <span className="w-0.5 bg-red-400 rounded-full animate-wave-2"></span>
                          <span className="w-0.5 bg-red-400 rounded-full animate-wave-3"></span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Listen Audio</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Verified
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 heritage-glass rounded-3xl border border-amber-500/20 space-y-3">
          <BookOpen className="w-10 h-10 text-neutral-600 mx-auto" />
          <p className="text-amber-200 font-semibold text-base">No dictionary entries found for "{search}".</p>
          <p className="text-xs text-neutral-400">Try searching another keyword or select "All Languages".</p>
          <button
            onClick={() => {
              setSearch("");
              setLangFilter("all");
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-amber-900/20">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-amber-200 text-xs font-semibold transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Page
          </button>

          <span className="text-xs font-mono text-amber-300">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 text-amber-950 text-xs font-bold shadow-glow transition-all active:scale-95"
          >
            Next Page <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}

