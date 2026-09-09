import React, { useState, useEffect } from "react";
import { ReadingTest } from "../types/ielts";
import { getReadingBand, isAnswerCorrect, normalizeAnswer } from "../utils/ieltsScoring";
import { saveAttempt } from "../utils/storage";
import { Clock, CheckCircle, ArrowLeft, ArrowRight, RotateCcw, Award, CheckCircle2, XCircle, Flag, ZoomIn, ZoomOut } from "lucide-react";

interface ReadingRunnerProps {
  test: ReadingTest;
  onBack: () => void;
  onComplete: () => void;
}

export const ReadingRunner: React.FC<ReadingRunnerProps> = ({ test, onBack, onComplete }) => {
  const [activePassage, setActivePassage] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

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

  const handleAnswerChange = (qIndex: number, val: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIndex]: val }));
  };

  const toggleFlag = (qIndex: number) => {
    setFlagged(prev => ({ ...prev, [qIndex]: !prev[qIndex] }));
  };

  const calculateScore = () => {
    let score = 0;
    test.questions.forEach((q, idx) => {
      const userVal = userAnswers[idx];
      if (isAnswerCorrect(userVal, q.answer)) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    const score = calculateScore();
    const band = getReadingBand(score);

    saveAttempt({
      section: "reading",
      testId: test.id,
      completedAt: new Date().toISOString(),
      score,
      band,
    });
    onComplete();
  };

  const score = isSubmitted ? calculateScore() : 0;
  const band = isSubmitted ? getReadingBand(score) : "0.0";
  const answeredCount = Object.keys(userAnswers).filter(k => (userAnswers[Number(k)] ?? "").trim() !== "").length;

  const fontClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed",
    lg: "text-lg leading-relaxed",
  };

  // Questions range for each passage:
  // Passage 1: Q1 - Q14
  // Passage 2: Q15 - Q27
  // Passage 3: Q28 - Q40
  const passageQuestionRanges = [
    { start: 0, end: 13, label: "Questions 1–14" },
    { start: 14, end: 27, label: "Questions 15–28" },
    { start: 28, end: 39, label: "Questions 29–40" },
  ];

  return (
    <div className="flex flex-col gap-5 pb-20">
      {/* Runner Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Tests
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{test.title}</h2>
            <span className="text-xs text-slate-500">IELTS Academic Reading • 3 Passages • 40 Questions</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Font Resizer */}
          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setFontSize(prev => (prev === "lg" ? "base" : "sm"))}
              className="rounded p-1 text-slate-600 hover:bg-white hover:text-slate-900"
              title="Decrease font size"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setFontSize(prev => (prev === "sm" ? "base" : "lg"))}
              className="rounded p-1 text-slate-600 hover:bg-white hover:text-slate-900"
              title="Increase font size"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-black tabular-nums shadow-2xs ${
              secondsRemaining < 600
                ? "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                : "bg-blue-50 text-blue-700 border border-blue-200"
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
              Submit Test ({answeredCount}/40)
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
                  setSecondsRemaining(60 * 60);
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
                Reading Test Complete
              </span>
              <h3 className="mt-1 text-2xl font-black text-slate-900">
                Official Result: <span className="text-emerald-700">{score} / 40</span> • Estimated Band <span className="text-blue-700">{band}</span>
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Review your answers below. Correct items are marked in green, while errors highlight the expected answer.
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

      {/* Split Workstation: Left (Passage) / Right (Questions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Passage Viewer */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(idx => (
                <button
                  key={idx}
                  onClick={() => setActivePassage(idx)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    activePassage === idx
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Passage {idx + 1}
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {passageQuestionRanges[activePassage].label}
            </span>
          </div>

          <div
            className={`max-h-[640px] overflow-y-auto pr-3 font-serif text-slate-800 whitespace-pre-line ${fontClasses[fontSize]}`}
          >
            {test.passages[activePassage]}
          </div>
        </div>

        {/* Right: Questions Pane */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Questions for Passage {activePassage + 1}
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              Passage {activePassage + 1} of 3
            </span>
          </div>

          {/* Question List for the active passage */}
          <div className="max-h-[640px] overflow-y-auto pr-3 space-y-6">
            {test.questions.map((q, idx) => {
              const pRange = passageQuestionRanges[activePassage];
              if (idx < pRange.start || idx > pRange.end) return null;

              const userVal = userAnswers[idx];
              const isCorrect = isAnswerCorrect(userVal, q.answer);
              const isFlagged = !!flagged[idx];

              return (
                <div
                  key={idx}
                  id={`q-${idx}`}
                  className={`rounded-xl border p-4 transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? "border-emerald-200 bg-emerald-50/30"
                        : "border-red-200 bg-red-50/30"
                      : isFlagged
                      ? "border-amber-300 bg-amber-50/20"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-900 text-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-700">
                        {idx + 1}
                      </span>
                      {q.q}
                    </span>
                    {!isSubmitted && (
                      <button
                        onClick={() => toggleFlag(idx)}
                        title="Flag question for review"
                        className={`p-1 rounded transition-colors ${
                          isFlagged ? "text-amber-600" : "text-slate-300 hover:text-slate-600"
                        }`}
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Input Rendering based on type */}
                  {q.type === "mcq" && q.options && (
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className={`flex items-center gap-3 rounded-lg border p-2.5 text-xs font-medium cursor-pointer transition-colors ${
                            Number(userVal) === oIdx
                              ? "border-blue-500 bg-blue-50/70 text-blue-900"
                              : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${idx}`}
                            value={oIdx}
                            disabled={isSubmitted}
                            checked={Number(userVal) === oIdx}
                            onChange={() => handleAnswerChange(idx, String(oIdx))}
                            className="h-4 w-4 text-blue-600"
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
                          onClick={() => handleAnswerChange(idx, val)}
                          className={`rounded-lg border py-2 text-xs font-bold transition-all ${
                            userVal === val
                              ? "border-blue-600 bg-blue-600 text-white shadow-2xs"
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
                        placeholder="Type answer here..."
                        value={userVal ?? ""}
                        onChange={e => handleAnswerChange(idx, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  )}

                  {/* Submitted Feedback Box */}
                  {isSubmitted && (
                    <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {isCorrect ? (
                          <span className="flex items-center gap-1 font-bold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold text-red-700">
                            <XCircle className="h-3.5 w-3.5" />
                            Incorrect (You answered: {userVal || "No answer"})
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-slate-700">
                        Answer:{" "}
                        <span className="font-bold text-blue-700">
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

          {/* Question Navigator Matrix 1 - 40 */}
          <div className="border-t border-slate-100 pt-3">
            <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Question Navigator (1–40)
            </span>
            <div className="grid grid-cols-10 gap-1.5">
              {test.questions.map((_, i) => {
                const hasAnswer = (userAnswers[i] ?? "").trim() !== "";
                const isFlag = !!flagged[i];
                const isCurrentPassage =
                  i >= passageQuestionRanges[activePassage].start &&
                  i <= passageQuestionRanges[activePassage].end;

                let btnStyle = "border-slate-200 bg-white text-slate-600 hover:bg-slate-100";
                if (isSubmitted) {
                  const correct = isAnswerCorrect(userAnswers[i], test.questions[i].answer);
                  btnStyle = correct
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-red-400 bg-red-400 text-white";
                } else if (isFlag) {
                  btnStyle = "border-amber-400 bg-amber-100 text-amber-900";
                } else if (hasAnswer) {
                  btnStyle = "border-blue-600 bg-blue-600 text-white";
                }

                return (
                  <button
                    key={i}
                    onClick={() => {
                      // switch passage if needed
                      if (i <= 13) setActivePassage(0);
                      else if (i <= 27) setActivePassage(1);
                      else setActivePassage(2);

                      const el = document.getElementById(`q-${i}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`h-7 rounded text-[11px] font-bold border transition-all ${btnStyle} ${
                      isCurrentPassage ? "ring-2 ring-blue-300 ring-offset-1" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
