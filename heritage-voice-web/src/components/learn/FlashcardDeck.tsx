"use client";

import { useState, useEffect, useCallback } from "react";
import { Volume2, RotateCw, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, GraduationCap, Info, HelpCircle, Trophy, Flame, Play, RefreshCw, Square } from "lucide-react";
import { speakText, stopSpeech } from "@/lib/nlp/audioSynth";

interface Flashcard {
  frontNative: string;
  frontRoman: string;
  backEn: string;
  culturalTip?: string;
}

interface Lesson {
  id: string;
  langCode: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  cards: Flashcard[];
}

export function FlashcardDeck() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [studyMode, setStudyMode] = useState<"deck" | "quiz">("deck");
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Quiz Mode state
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/learn");
      const data = await res.json();
      if (data.lessons && data.lessons.length > 0) {
        setLessons(data.lessons);
        setSelectedLesson(data.lessons[0]);
      }
    } catch (err) {
      console.error("Error fetching lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate 4 randomized options for Quiz Mode
  const generateQuizOptions = useCallback((lesson: Lesson, currentIndex: number) => {
    if (!lesson || !lesson.cards[currentIndex]) return;
    const correct = lesson.cards[currentIndex].backEn;
    const otherOptions = lesson.cards
      .filter((_, idx) => idx !== currentIndex)
      .map((c) => c.backEn);

    // Pick 3 random distractor answers (or fallback defaults if deck is short)
    const shuffledDistractors = otherOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...shuffledDistractors, correct].sort(() => 0.5 - Math.random());
    setQuizOptions(combined);
    setQuizAnswered(null);
    setSelectedOption(null);
  }, []);

  useEffect(() => {
    if (selectedLesson && studyMode === "quiz") {
      generateQuizOptions(selectedLesson, cardIndex);
    }
  }, [selectedLesson, cardIndex, studyMode, generateQuizOptions]);

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (studyMode !== "deck" || !selectedLesson) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "a" || e.key === "A") {
        const card = selectedLesson.cards[cardIndex];
        if (card) {
          speakText(card.frontNative, selectedLesson.langCode, card.frontRoman);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [studyMode, selectedLesson, cardIndex]);

  if (loading || !selectedLesson) {
    return (
      <div className="text-center py-20 text-amber-300 space-y-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-mono">Loading interactive heritage decks...</p>
      </div>
    );
  }

  const currentCard = selectedLesson.cards[cardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (cardIndex < selectedLesson.cards.length - 1) {
      setCardIndex(cardIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    }
  };

  const handleMarkMastered = () => {
    if (!completedCards.includes(cardIndex)) {
      setCompletedCards([...completedCards, cardIndex]);
    }
    handleNext();
  };

  const handlePlayAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;

    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(currentCard.frontNative, selectedLesson.langCode, currentCard.frontRoman, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (quizAnswered !== null) return;

    const isCorrect = option === currentCard.backEn;
    setSelectedOption(option);
    setQuizAnswered(isCorrect);

    if (isCorrect) {
      setQuizScore((s) => s + 1);
      setQuizStreak((st) => st + 1);
      if (!completedCards.includes(cardIndex)) {
        setCompletedCards((c) => [...c, cardIndex]);
      }
    } else {
      setQuizStreak(0);
    }

    setTimeout(() => {
      if (cardIndex < selectedLesson.cards.length - 1) {
        setCardIndex(cardIndex + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setCardIndex(0);
    setQuizScore(0);
    setQuizStreak(0);
    setQuizCompleted(false);
    setQuizAnswered(null);
    setSelectedOption(null);
    if (selectedLesson) {
      generateQuizOptions(selectedLesson, 0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Lesson Selector & Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 heritage-glass rounded-3xl border border-amber-500/20 shadow-glow">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-amber-100">{selectedLesson.title}</h2>
          </div>
          <p className="text-xs text-neutral-400">{selectedLesson.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Study Mode Switcher */}
          <div className="flex items-center bg-neutral-900/90 p-1 rounded-xl border border-amber-600/30">
            <button
              onClick={() => {
                setStudyMode("deck");
                setCardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                studyMode === "deck"
                  ? "bg-amber-600 text-amber-950 font-bold shadow-sm"
                  : "text-neutral-400 hover:text-amber-200"
              }`}
            >
              3D Flashcards
            </button>
            <button
              onClick={() => {
                setStudyMode("quiz");
                resetQuiz();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                studyMode === "quiz"
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-amber-950 font-bold shadow-sm"
                  : "text-neutral-400 hover:text-amber-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Speed Quiz
            </button>
          </div>

          {/* Lesson Selector */}
          <select
            value={selectedLesson.id}
            onChange={(e) => {
              const found = lessons.find((l) => l.id === e.target.value);
              if (found) {
                setSelectedLesson(found);
                setCardIndex(0);
                setIsFlipped(false);
                setCompletedCards([]);
                setQuizCompleted(false);
                setQuizScore(0);
              }
            }}
            className="bg-neutral-900/90 text-amber-100 px-4 py-2 rounded-xl border border-amber-600/30 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title} ({l.langCode === "kvd" ? "Kodava" : "Tulu"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress & Stats Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-amber-300 font-mono">
          <span>CARD {cardIndex + 1} OF {selectedLesson.cards.length}</span>
          <div className="flex items-center gap-4">
            {studyMode === "quiz" && (
              <span className="flex items-center gap-1 text-orange-400 font-bold">
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" /> Streak: {quizStreak}
              </span>
            )}
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> {completedCards.length} Mastered
            </span>
          </div>
        </div>
        <div className="w-full h-2.5 rounded-full bg-neutral-900 overflow-hidden border border-amber-900/30 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-emerald-500 rounded-full transition-all duration-300 shadow-glow"
            style={{ width: `${((cardIndex + 1) / selectedLesson.cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Mode 1: 3D Flashcard Mode */}
      {studyMode === "deck" && (
        <>
          <div className="perspective-1000 w-full min-h-[360px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <div
              className={`w-full min-h-[360px] rounded-3xl heritage-glass border border-amber-500/30 p-8 flex flex-col justify-between transition-transform duration-500 transform-style-3d shadow-glow ${
                isFlipped ? "rotate-y-180 bg-neutral-900/95" : "bg-neutral-900/70"
              }`}
            >
              {/* Internal wrapper un-mirrors the back face content when flipped */}
              <div className={`w-full min-h-[300px] flex flex-col justify-between ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>
                
                {/* Card Top */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-3.5 py-1 rounded-full bg-amber-950/90 border border-amber-600/40 text-amber-300 font-semibold">
                    {isFlipped ? "ENGLISH TRANSLATION" : `${selectedLesson.langCode === "kvd" ? "KODAVA TAKK" : "TULU"} PHRASE`}
                  </span>
                  <span className="text-neutral-400 flex items-center gap-1.5 group-hover:text-amber-300 transition-colors">
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" /> Click or Space to Flip
                  </span>
                </div>

                {/* Card Center Content */}
                <div className="text-center py-6 space-y-4">
                  {!isFlipped ? (
                    <div className="space-y-3">
                      <h3 className="text-4xl sm:text-6xl font-extrabold text-amber-100 tracking-tight">
                        {currentCard.frontNative}
                      </h3>
                      <p className="text-xl font-mono text-amber-400 font-semibold">
                        /{currentCard.frontRoman}/
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-3xl sm:text-5xl font-extrabold text-amber-200 tracking-tight">
                        "{currentCard.backEn}"
                      </h3>
                      {currentCard.culturalTip && (
                        <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-900/20 border border-amber-600/30 text-xs text-amber-300 flex items-start gap-2.5 text-left">
                          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{currentCard.culturalTip}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-amber-900/20">
                  <button
                    onClick={handlePlayAudio}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                      isPlayingAudio
                        ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse shadow-glow"
                        : "bg-amber-600/20 hover:bg-amber-600/30 border-amber-500/30 text-amber-300"
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Square className="w-4 h-4 text-red-400 fill-red-400" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-amber-400" />
                        <span>Listen (Press 'A')</span>
                      </>
                    )}
                  </button>

                  {completedCards.includes(cardIndex) ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Mastered
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkMastered();
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Mark Mastered
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Navigation Controls with Keyboard Legend */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={cardIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-amber-200 text-sm font-semibold transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" /> Prev Card
            </button>

            <span className="hidden sm:block text-[11px] font-mono text-neutral-400">
              Shortcuts: ← Prev | → Next | Space Flip | 'A' Voice
            </span>

            <button
              onClick={handleNext}
              disabled={cardIndex === selectedLesson.cards.length - 1}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-40 text-amber-950 text-sm font-bold shadow-glow transition-all active:scale-95"
            >
              Next Card <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* Mode 2: Interactive Speed Quiz Mode */}
      {studyMode === "quiz" && (
        <div className="heritage-glass rounded-3xl border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-glow">
          {quizCompleted ? (
            <div className="text-center py-10 space-y-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-3xl font-extrabold text-amber-100">Quiz Completed!</h3>
              <p className="text-lg text-amber-300">
                You scored <strong className="text-emerald-400">{quizScore}</strong> out of{" "}
                <strong>{selectedLesson.cards.length}</strong>!
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-bold text-sm shadow-glow transition-all flex items-center gap-2 mx-auto active:scale-95"
              >
                <RefreshCw className="w-4 h-4" /> Replay Quiz
              </button>
            </div>
          ) : (
            <>
              {/* Question Header */}
              <div className="text-center space-y-3 py-4">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950 border border-amber-600/30 text-amber-300 text-xs font-mono">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Select the correct English meaning:
                </div>
                <h3 className="text-4xl sm:text-5xl font-extrabold text-amber-100 tracking-tight">
                  {currentCard.frontNative}
                </h3>
                <p className="text-lg font-mono text-amber-400 font-semibold">
                  /{currentCard.frontRoman}/
                </p>
                <button
                  onClick={handlePlayAudio}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Listen Audio
                </button>
              </div>

              {/* 4 Interactive Option Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {quizOptions.map((option, idx) => {
                  let buttonStyle = "bg-neutral-900/80 hover:bg-neutral-800 text-amber-100 border-amber-500/20";

                  if (quizAnswered !== null) {
                    if (option === currentCard.backEn) {
                      buttonStyle = "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold shadow-glow-emerald";
                    } else if (option === selectedOption) {
                      buttonStyle = "bg-red-950 border-red-500 text-red-200 font-bold";
                    } else {
                      buttonStyle = "opacity-40 border-transparent bg-neutral-950";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={quizAnswered !== null}
                      className={`p-4 rounded-2xl border text-sm sm:text-base font-semibold transition-all text-left flex items-center justify-between active:scale-95 ${buttonStyle}`}
                    >
                      <span>"{option}"</span>
                      {quizAnswered !== null && option === currentCard.backEn && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}

