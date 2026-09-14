import React, { useState, useEffect, useRef } from "react";
import { ListeningTest } from "../types/ielts";
import { getListeningBand, isAnswerCorrect } from "../utils/ieltsScoring";
import { saveAttempt, getAttempt } from "../utils/storage";
import { stopAllActiveMedia } from "../utils/audioControl";
import { Clock, CheckCircle, ArrowLeft, ArrowRight, RotateCcw, Volume2, VolumeX, Play, Pause, FileText, CheckCircle2, XCircle, Flag, Sparkles } from "lucide-react";

interface ListeningRunnerProps {
  test: ListeningTest;
  onBack: () => void;
  onComplete: () => void;
}

export const ListeningRunner: React.FC<ListeningRunnerProps> = ({ test, onBack, onComplete }) => {
  const [activePart, setActivePart] = useState<number>(0);
  const [submittedSections, setSubmittedSections] = useState<Record<number, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(() => {
    try {
      const savedDraft = localStorage.getItem(`ielts_listening_draft_${test.id}`);
      if (savedDraft) return JSON.parse(savedDraft);
    } catch {}
    return {};
  });
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<Record<number, boolean>>({});

  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop audio on unmount or tab switch
  useEffect(() => {
    return () => {
      stopAllActiveMedia();
      setIsPlayingAudio(false);
    };
  }, []);

  // When activePart changes, immediately stop any audio playing
  useEffect(() => {
    stopAllActiveMedia();
    setIsPlayingAudio(false);
  }, [activePart]);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handlePlayAudio = (partIndex: number) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech audio is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const script = test.parts[partIndex].script;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = playbackRate;
    utterance.lang = "en-GB"; // Standard IELTS British/International English default

    // Attempt to pick an authentic English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith("en-GB") || v.lang.startsWith("en-US"));
    if (enVoice) utterance.voice = enVoice;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    synthRef.current = utterance;
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleAnswerChange = (qKey: string, val: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => {
      const next = { ...prev, [qKey]: val };
      try {
        localStorage.setItem(`ielts_listening_draft_${test.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleFlag = (qKey: string) => {
    setFlagged(prev => ({ ...prev, [qKey]: !prev[qKey] }));
  };

  const calculateScore = () => {
    let score = 0;
    test.parts.forEach((p, pIdx) => {
      p.questions.forEach((q, qIdx) => {
        const key = `p${pIdx}-q${qIdx}`;
        const userVal = userAnswers[key];
        if (isAnswerCorrect(userVal, q.answer)) {
          score++;
        }
      });
    });
    return score;
  };

  const handleSectionSubmitAndNext = (partIndex: number) => {
    // 1. Immediately kill all audio & speech synthesis
    stopAllActiveMedia();
    setIsPlayingAudio(false);

    // 2. Mark this section as submitted
    const updatedSubmitted = { ...submittedSections, [partIndex]: true };
    setSubmittedSections(updatedSubmitted);

    // 3. Calculate score & band so far and persist intermediate progress
    const currentScore = calculateScore();
    const currentBand = getListeningBand(currentScore);
    saveAttempt({
      section: "listening",
      testId: test.id,
      completedAt: new Date().toISOString(),
      score: currentScore,
      band: currentBand,
    });

    // 4. Advance or finish
    if (partIndex < test.parts.length - 1) {
      setActivePart(partIndex + 1);
      window.scrollTo({ top: 180, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    stopAllActiveMedia();
    setIsPlayingAudio(false);
    setIsSubmitted(true);
    setIsTimerRunning(false);
    setSubmittedSections({ 0: true, 1: true, 2: true, 3: true });

    const score = calculateScore();
    const band = getListeningBand(score);

    saveAttempt({
      section: "listening",
      testId: test.id,
      completedAt: new Date().toISOString(),
      score,
      band,
    });
    onComplete();
  };

  const score = isSubmitted ? calculateScore() : 0;
  const band = isSubmitted ? getListeningBand(score) : "0.0";
  const answeredCount = Object.keys(userAnswers).filter(k => (userAnswers[k] ?? "").trim() !== "").length;

  const currentPart = test.parts[activePart];

  return (
    <div className="flex flex-col gap-5 pb-20">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if ("speechSynthesis" in window) window.speechSynthesis.cancel();
              onBack();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Tests
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{test.title}</h2>
            <span className="text-xs text-slate-500">IELTS Listening • 4 Parts • 40 Questions</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-black tabular-nums shadow-2xs ${
              secondsRemaining < 300
                ? "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                : "bg-cyan-50 text-cyan-800 border border-cyan-200"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors"
            >
              Submit Listening ({answeredCount}/40)
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
                Score: {score}/40 (Band {band})
              </span>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setUserAnswers({});
                  setSecondsRemaining(30 * 60);
                  setIsTimerRunning(true);
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-3 w-3" />
                Retake
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submitted Result Banner */}
      {isSubmitted && (
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Listening Test Evaluated
              </span>
              <h3 className="mt-1 text-2xl font-black text-slate-900">
                Official Result: <span className="text-emerald-700">{score} / 40</span> • Estimated Band <span className="text-cyan-800">{band}</span>
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Review your answers below. Correct answers are indicated in green, and full audio transcripts are unlocked for review.
              </p>
            </div>
            <button
              onClick={onBack}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shrink-0"
            >
              Back to Test List
            </button>
          </div>
        </div>
      )}

      {/* Audio Control Panel */}
      <div className="rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50/60 via-white to-blue-50/40 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePlayAudio(activePart)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold shadow-xs transition-all ${
                isPlayingAudio
                  ? "bg-amber-500 text-white hover:bg-amber-600 animate-pulse"
                  : "bg-cyan-700 text-white hover:bg-cyan-800"
              }`}
            >
              {isPlayingAudio ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  Audio Simulation: Part {activePart + 1}
                  <span className="ml-1 text-xs font-medium text-cyan-800">
                    {activePart === 0 && "• Social & Everyday Dialogue"}
                    {activePart === 1 && "• Public Information Monologue"}
                    {activePart === 2 && "• Academic Tutorial Discussion"}
                    {activePart === 3 && "• University Lecture"}
                  </span>
                </span>
                {isPlayingAudio && (
                  <span className="flex items-center gap-1 rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800 animate-pulse">
                    <Volume2 className="h-3 w-3" /> Playing Part {activePart + 1} Audio
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Each part features its own audio recording. Answers are spoken in chronological sequence matching questions {(activePart * 10) + 1} to {(activePart * 10) + 10}.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Speed selection */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 text-xs font-semibold text-slate-600">
              <span className="px-2 text-[10px] text-slate-400 font-bold uppercase">Speed</span>
              {[0.8, 1.0, 1.2].map(speed => (
                <button
                  key={speed}
                  onClick={() => handleRateChange(speed)}
                  className={`rounded px-2 py-0.5 transition-colors ${
                    playbackRate === speed ? "bg-cyan-100 text-cyan-800 font-bold" : "hover:text-slate-900"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Transcript toggle */}
            <button
              onClick={() =>
                setShowTranscript(prev => ({ ...prev, [activePart]: !prev[activePart] }))
              }
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              {showTranscript[activePart] ? "Hide Transcript" : "Show Transcript"}
            </button>
          </div>
        </div>

        {/* Practice Transcript Display */}
        {showTranscript[activePart] && (
          <div className="mt-4 rounded-lg border border-cyan-200 bg-white p-4 font-serif text-sm leading-relaxed text-slate-700 shadow-2xs whitespace-pre-line animate-fade-in">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-cyan-800">
              Part {activePart + 1} Audio Transcript
            </span>
            {currentPart.script}
          </div>
        )}
      </div>

      {/* Parts Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {test.parts.map((p, idx) => {
          const isCurrent = activePart === idx;
          const isDone = !!submittedSections[idx];
          const partAnswered = p.questions.filter((_, qIdx) => (userAnswers[`p${idx}-q${qIdx}`] ?? "").trim() !== "").length;

          return (
            <button
              key={idx}
              onClick={() => {
                stopAllActiveMedia();
                setIsPlayingAudio(false);
                setActivePart(idx);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                isCurrent
                  ? "bg-cyan-700 text-white shadow-2xs"
                  : isDone
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              ) : null}
              <span>Part {p.part} (Q{(idx * 10) + 1}–{(idx * 10) + 10})</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isCurrent ? "bg-cyan-800 text-cyan-100" : "bg-slate-100 text-slate-500"
              }`}>
                {partAnswered}/10
              </span>
            </button>
          );
        })}
      </div>

      {/* Part Questions */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Questions {(activePart * 10) + 1} to {(activePart * 10) + 10}
              <span className="ml-2 font-medium text-xs text-cyan-800">
                {activePart === 0 && "• Section 1: Notes & Form Completion"}
                {activePart === 1 && "• Section 2: Public Monologue Multiple Choice & Completion"}
                {activePart === 2 && "• Section 3: Academic Tutorial Discussion"}
                {activePart === 3 && "• Section 4: Academic Lecture Notes"}
              </span>
            </h3>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
              Chronological Order: Q{(activePart * 10) + 1} → Q{(activePart * 10) + 10}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {activePart === 0 && "Listen to the dialogue and complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer."}
            {activePart === 1 && "Listen to the orientation talk. For multiple choice questions, choose the correct letter. For completion questions, write NO MORE THAN TWO WORDS AND/OR A NUMBER."}
            {activePart === 2 && "Listen to the student-tutor discussion. Answer questions in the order they are discussed. Write NO MORE THAN TWO WORDS AND/OR A NUMBER."}
            {activePart === 3 && "Listen to the academic lecture. Complete the lecture notes below with NO MORE THAN TWO WORDS AND/OR A NUMBER."}
          </p>
        </div>

        <div className="space-y-6">
          {currentPart.questions.map((q, qIdx) => {
            const globalIndex = activePart * 10 + qIdx;
            const qKey = `p${activePart}-q${qIdx}`;
            const userVal = userAnswers[qKey];
            const isCorrect = isAnswerCorrect(userVal, q.answer);
            const isFlag = !!flagged[qKey];

            return (
              <div
                key={qIdx}
                id={`lq-${globalIndex}`}
                className={`rounded-xl border p-4 transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? "border-emerald-200 bg-emerald-50/30"
                      : "border-red-200 bg-red-50/30"
                    : isFlag
                    ? "border-amber-300 bg-amber-50/20"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-900 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 text-xs text-cyan-800">
                      {globalIndex + 1}
                    </span>
                    {q.q}
                  </span>
                  {!isSubmitted && (
                    <button
                      onClick={() => toggleFlag(qKey)}
                      className={`p-1 rounded ${
                        isFlag ? "text-amber-600" : "text-slate-300 hover:text-slate-600"
                      }`}
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Input components */}
                {q.type === "mcq" && q.options && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        className={`flex items-center gap-3 rounded-lg border p-2.5 text-xs font-medium cursor-pointer transition-colors ${
                          Number(userVal) === oIdx
                            ? "border-cyan-600 bg-cyan-50 text-cyan-950"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name={qKey}
                          value={oIdx}
                          disabled={isSubmitted}
                          checked={Number(userVal) === oIdx}
                          onChange={() => handleAnswerChange(qKey, String(oIdx))}
                          className="h-4 w-4 text-cyan-600"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "tfng" && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {["TRUE", "FALSE", "NOT GIVEN"].map(val => (
                      <button
                        key={val}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleAnswerChange(qKey, val)}
                        className={`rounded-lg border py-2 text-xs font-bold transition-all ${
                          userVal === val
                            ? "border-cyan-700 bg-cyan-700 text-white shadow-2xs"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                )}

                {(q.type === "completion" || q.type === "short") && (
                  <div className="pt-1">
                    <input
                      type="text"
                      disabled={isSubmitted}
                      placeholder="Type your answer here..."
                      value={userVal ?? ""}
                      onChange={e => handleAnswerChange(qKey, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Submitted review item */}
                {isSubmitted && (
                  <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs">
                    <div>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-bold text-red-700">
                          <XCircle className="h-3.5 w-3.5" />
                          Incorrect (You wrote: {userVal || "Blank"})
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-700">
                      Answer:{" "}
                      <span className="font-bold text-cyan-800">
                        {typeof q.answer === "number" && q.options
                          ? `${q.options[q.answer]}`
                          : String(q.answer)}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section Navigation & Submission Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-5 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              Section {activePart + 1} of 4 • {currentPart.questions.filter((_, qIdx) => (userAnswers[`p${activePart}-q${qIdx}`] ?? "").trim() !== "").length}/10 answered
            </span>
            {submittedSections[activePart] && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                <CheckCircle2 className="h-3 w-3" /> Section Submitted
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activePart > 0 && (
              <button
                type="button"
                onClick={() => {
                  stopAllActiveMedia();
                  setIsPlayingAudio(false);
                  setActivePart(prev => prev - 1);
                  window.scrollTo({ top: 180, behavior: "smooth" });
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous Section</span>
              </button>
            )}

            {activePart < test.parts.length - 1 ? (
              <button
                type="button"
                onClick={() => handleSectionSubmitAndNext(activePart)}
                className="flex items-center gap-2 rounded-xl bg-cyan-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-800 shadow-sm transition cursor-pointer"
              >
                <span>Submit Section {activePart + 1} & Proceed to Section {activePart + 2}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 shadow-md transition cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit Final Section & Finish Listening Test</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Navigator Matrix 1 - 40 */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Listening Question Navigator (1–40)
        </span>
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
          {Array.from({ length: 40 }).map((_, i) => {
            const pIdx = Math.floor(i / 10);
            const qIdx = i % 10;
            const key = `p${pIdx}-q${qIdx}`;
            const hasAnswer = (userAnswers[key] ?? "").trim() !== "";
            const isFlag = !!flagged[key];

            let btnStyle = "border-slate-200 bg-white text-slate-600 hover:bg-slate-100";
            if (isSubmitted) {
              const q = test.parts[pIdx].questions[qIdx];
              const correct = isAnswerCorrect(userAnswers[key], q.answer);
              btnStyle = correct
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-red-400 bg-red-400 text-white";
            } else if (isFlag) {
              btnStyle = "border-amber-400 bg-amber-100 text-amber-900";
            } else if (hasAnswer) {
              btnStyle = "border-cyan-700 bg-cyan-700 text-white";
            }

            return (
              <button
                key={i}
                onClick={() => {
                  setActivePart(pIdx);
                  const el = document.getElementById(`lq-${i}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className={`h-7 rounded text-[11px] font-bold border transition-all ${btnStyle} ${
                  activePart === pIdx ? "ring-2 ring-cyan-300 ring-offset-1" : ""
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
