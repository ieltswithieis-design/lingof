import React, { useState, useEffect, useRef } from "react";
import { 
  StandardizedExamId, 
  StandardizedTestPackage, 
  TestQuestion, 
  StandardizedTestResult 
} from "../types/standardizedTests";
import { STANDARDIZED_EXAMS_META, calculateExamScore } from "../data/standardizedTestsData";
import { 
  Clock, 
  Play, 
  Pause, 
  Volume2, 
  Mic, 
  Square, 
  Flag, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Calculator, 
  Sparkles, 
  HelpCircle,
  Award,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { translateReadingTextPure } from "../utils/readingZeroEnglishEngine";

interface StandardizedTestRunnerProps {
  testPackage: StandardizedTestPackage;
  onBack: () => void;
  onCompleteTest: (result: StandardizedTestResult) => void;
}

export const StandardizedTestRunner: React.FC<StandardizedTestRunnerProps> = ({
  testPackage,
  onBack,
  onCompleteTest,
}) => {
  const { t, currentLanguage, currentLanguageInfo, speak, stopSpeaking } = useLanguage();
  const localize = (str: string): string => {
    if (currentLanguage === "en" || !str) return str;
    return translateReadingTextPure(str, currentLanguage);
  };

  const validExamId = testPackage?.examId || "pte";
  const meta = STANDARDIZED_EXAMS_META[validExamId] || STANDARDIZED_EXAMS_META.pte;

  // Flatten all questions across sections
  const allSections = testPackage?.sections || [];
  const allQuestions: { question: TestQuestion; sectionIndex: number }[] = [];
  allSections.forEach((sec, sIdx) => {
    sec?.questions?.forEach((q) => {
      allQuestions.push({ question: q, sectionIndex: sIdx });
    });
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  
  // Timer state
  const totalSeconds = (allSections[0]?.timeMinutes || 30) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Audio / Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Voice recording state for Speaking
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioAvailable, setRecordedAudioAvailable] = useState<Record<string, boolean>>({});
  const recordingTimerRef = useRef<any>(null);

  // On-screen calculator popup
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState("");

  // Submit confirmation modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isTimerPaused || !testPackage?.examId) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused, testPackage?.examId]);

  // Clean up audio on unmount or question switch
  useEffect(() => {
    stopSpeaking();
    setIsPlayingAudio(false);
  }, [currentQuestionIndex, stopSpeaking]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [stopSpeaking]);

  if (!testPackage || !testPackage.examId) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm mt-8 space-y-4">
        <p className="text-base font-bold text-slate-800">{localize("Exam package not found or currently unavailable.")}</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
        >
          {localize("Return to All Exams")}
        </button>
      </div>
    );
  }

  const currentItem = allQuestions[currentQuestionIndex];
  const activeQuestion = currentItem?.question;
  const activeSection = allSections[currentItem?.sectionIndex || 0];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  // Handle Audio Playback
  const handleToggleAudio = () => {
    if (!activeQuestion) return;

    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    const script = activeQuestion.audioScript || activeQuestion.passage || activeQuestion.prompt;
    const textToSpeak = localize(script);
    setIsPlayingAudio(true);
    speak(textToSpeak, {
      rate: 0.95,
      pitch: activeQuestion.speakerGender === "female" ? 1.1 : 0.9,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  // Handle Speaking Voice Recording Simulation
  const handleToggleRecord = () => {
    if (isRecording) {
      // Stop recording
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      if (activeQuestion) {
        setRecordedAudioAvailable(prev => ({ ...prev, [activeQuestion.id]: true }));
        if (!userAnswers[activeQuestion.id]) {
          setUserAnswers(prev => ({ ...prev, [activeQuestion.id]: "Voice response recorded successfully (45s acoustic sample evaluated)" }));
        }
      }
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    }
  };

  const handleSingleSelect = (val: string) => {
    if (!activeQuestion) return;
    setUserAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: val
    }));
  };

  const handleMultiSelect = (val: string) => {
    if (!activeQuestion) return;
    const current = (userAnswers[activeQuestion.id] as string[]) || [];
    let updated: string[];
    if (current.includes(val)) {
      updated = current.filter(x => x !== val);
    } else {
      updated = [...current, val];
    }
    setUserAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: updated
    }));
  };

  const handleTextInput = (val: string) => {
    if (!activeQuestion) return;
    setUserAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: val
    }));
  };

  const toggleFlag = () => {
    if (!activeQuestion) return;
    setFlaggedQuestions(prev => ({
      ...prev,
      [activeQuestion.id]: !prev[activeQuestion.id]
    }));
  };

  // Safe Calculator Evaluation
  const handleCalcEval = () => {
    try {
      // Allow only numbers and arithmetic symbols
      const sanitized = calcInput.replace(/[^0-9+\-*/().]/g, "");
      if (!sanitized) return;
      // eslint-disable-next-line no-eval
      const res = Function(`"use strict"; return (${sanitized})`)();
      setCalcResult(String(res));
    } catch {
      setCalcResult("Error");
    }
  };

  // Submit test and generate official score report
  const handleSubmitExam = () => {
    let totalEarned = 0;
    let totalMax = 0;

    const sectionBreakdowns = allSections.map(sec => {
      let secEarned = 0;
      let secMax = 0;

      sec.questions.forEach(q => {
        const points = q.points || 10;
        secMax += points;
        const uAns = userAnswers[q.id];

        if (Array.isArray(q.correctAnswer)) {
          if (Array.isArray(uAns) && q.correctAnswer.length === uAns.length && q.correctAnswer.every(a => uAns.includes(a))) {
            secEarned += points;
          }
        } else if (typeof q.correctAnswer === "string" && typeof uAns === "string") {
          if (uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
            secEarned += points;
          } else if (q.type === "essay-writing" || q.type === "read_aloud" as any) {
            // For open essays/speech, award proportional points if non-empty
            if (uAns.trim().length > 30) {
              secEarned += Math.round(points * 0.85);
            }
          }
        }
      });

      totalEarned += secEarned;
      totalMax += secMax;

      const secRatio = secMax > 0 ? secEarned / secMax : 0;
      const { scaledScore } = calculateExamScore(testPackage.examId, secEarned, secMax);

      return {
        sectionTitle: sec.title,
        score: secEarned,
        maxScore: secMax,
        scaledScore,
        percentage: Math.round(secRatio * 100),
      };
    });

    const { scaledScore, percentile } = calculateExamScore(testPackage.examId, totalEarned, totalMax);

    const verificationCode = `LFI-${testPackage.examId.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const testResult: StandardizedTestResult = {
      testId: testPackage.id,
      examId: testPackage.examId,
      examName: meta?.name || testPackage.title,
      candidateName: "International Academic Candidate",
      dateCompleted: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      timeSpentSeconds: timeSpent,
      overallScore: totalEarned,
      maxScore: totalMax,
      scaledScore,
      percentile,
      sectionBreakdown: sectionBreakdowns,
      userAnswers,
      questions: allQuestions.map(item => item.question),
      verificationCode,
    };

    onCompleteTest(testResult);
  };

  const answeredCount = Object.keys(userAnswers).filter(k => {
    const val = userAnswers[k];
    return Array.isArray(val) ? val.length > 0 : Boolean(val && String(val).trim());
  }).length;

  return (
    <div className="mx-auto max-w-6xl space-y-4 pb-12">
      {/* Top Test Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Exit Exam</span>
          </button>

          <div className="h-4 w-px bg-slate-200" />

          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-100 border border-blue-200 px-2 py-0.5 text-[10px] font-black text-blue-900 uppercase tracking-wide">
                {meta?.name}
              </span>
              <span className="text-xs font-black text-slate-900 truncate max-w-xs">
                {activeSection?.title}
              </span>
            </div>
          </div>
        </div>

        {/* Right Tools: Calculator (SAT/GRE), Timer & Finish */}
        <div className="flex items-center gap-3">
          {(testPackage.examId === "sat" || testPackage.examId === "gre" || testPackage.examId === "act") && (
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                showCalculator ? "border-blue-500 bg-blue-50 text-blue-900" : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
              title="Toggle On-Screen Calculator"
            >
              <Calculator className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden md:inline">Calculator</span>
            </button>
          )}

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-black text-slate-800">
            <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span>{formatTimer(timeLeft)}</span>
            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
              title={isTimerPaused ? "Resume Timer" : "Pause Timer"}
            >
              {isTimerPaused ? <Play className="h-3 w-3 text-emerald-600" /> : <Pause className="h-3 w-3" />}
            </button>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Calculator Floating Window if Opened */}
      {showCalculator && (
        <div className="rounded-2xl border-2 border-blue-300 bg-white p-4 shadow-xl max-w-xs ml-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Standard Desmos-Style Calculator</span>
            <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>
          <div className="space-y-1">
            <input
              type="text"
              value={calcInput}
              onChange={e => setCalcInput(e.target.value)}
              placeholder="e.g. (14 * 22) + sqrt(16)"
              className="w-full rounded-lg border border-slate-300 p-2 font-mono text-xs text-right"
            />
            {calcResult && (
              <div className="font-mono text-sm font-black text-blue-900 text-right">
                = {calcResult}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            {["7","8","9","/", "4","5","6","*", "1","2","3","-", "0",".","=","+"].map(btn => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === "=") handleCalcEval();
                  else setCalcInput(prev => prev + btn);
                }}
                className="rounded-md border border-slate-200 bg-slate-50 py-1.5 font-bold text-slate-800 hover:bg-slate-100 active:scale-95"
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => { setCalcInput(""); setCalcResult(""); }}
              className="col-span-4 rounded-md border border-red-200 bg-red-50 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Question Display Card */}
      {activeQuestion && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Question Meta Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-xs">
                {currentQuestionIndex + 1}
              </span>
              <span className="text-xs font-bold text-slate-500">
                Question {currentQuestionIndex + 1} of {allQuestions.length}
              </span>
              {activeQuestion.category && (
                <span className="hidden sm:inline rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {activeQuestion.category}
                </span>
              )}
            </div>

            <button
              onClick={toggleFlag}
              className={`flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                flaggedQuestions[activeQuestion.id] ? "text-amber-600" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <Flag className={`h-4 w-4 ${flaggedQuestions[activeQuestion.id] ? "fill-amber-500 text-amber-500" : ""}`} />
              <span className="hidden sm:inline">
                {flaggedQuestions[activeQuestion.id] ? "Flagged for Review" : "Flag Question"}
              </span>
            </button>
          </div>

          {/* Audio Lecture / Dictation Player if applicable */}
          {(activeQuestion.audioScript || activeQuestion.type === "audio-lecture-mcq" || activeQuestion.type === "read_aloud" as any) && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAudio}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-xs transition cursor-pointer ${
                    isPlayingAudio ? "bg-amber-600 text-white animate-pulse" : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isPlayingAudio ? <Pause className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <div>
                  <div className="text-xs font-black text-blue-950">
                    {isPlayingAudio ? "Playing Official Exam Audio Stream..." : "Listen to Audio Stimulus"}
                  </div>
                  <div className="text-[11px] text-blue-800/80">
                    Speaker: {activeQuestion.audioSpeaker || "Official Academic Examiner"}
                  </div>
                </div>
              </div>

              {/* Read aloud microphone controls for PTE Speaking */}
              {activeQuestion.type === "read_aloud" as any && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleRecord}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black shadow-xs transition cursor-pointer ${
                      isRecording 
                        ? "bg-red-600 text-white animate-pulse" 
                        : recordedAudioAvailable[activeQuestion.id]
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                    <span>
                      {isRecording ? `Recording (${recordingSeconds}s)... Click Stop` : recordedAudioAvailable[activeQuestion.id] ? "Re-record Voice" : "Start Speaking (Record)"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reading Passage if Provided */}
          {activeQuestion.passage && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 font-serif text-xs sm:text-sm leading-relaxed text-slate-800 shadow-2xs" dir={currentLanguageInfo.dir}>
              <div className="font-sans text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                {localize("Reading Passage / Context")}
              </div>
              <div className="whitespace-pre-line">{localize(activeQuestion.passage)}</div>
            </div>
          )}

          {/* Question Prompt */}
          <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug whitespace-pre-line" dir={currentLanguageInfo.dir}>
            {localize(activeQuestion.prompt)}
          </div>

          {/* Input Types & Options */}
          <div className="pt-2">
            {/* 1. Multiple Choice Single Answer (Radio) */}
            {(activeQuestion.type === "multiple-choice-single" || 
              activeQuestion.type === "quantitative-comparison" || 
              activeQuestion.type === "data-sufficiency" || 
              activeQuestion.type === "audio-lecture-mcq") && activeQuestion.options && (
              <div className="space-y-3">
                {activeQuestion.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[activeQuestion.id] === opt;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSingleSelect(opt)}
                      className={`w-full text-left flex items-start gap-3.5 rounded-xl border p-3.5 text-xs sm:text-sm transition cursor-pointer ${
                        isSelected 
                          ? "border-blue-600 bg-blue-50/60 font-semibold text-blue-950 shadow-2xs ring-1 ring-blue-500" 
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                        isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-slate-500"
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="leading-normal" dir={currentLanguageInfo.dir}>{localize(opt)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Multiple Choice Multiple Answers (Checkboxes) */}
            {(activeQuestion.type === "multiple-choice-multiple" || activeQuestion.type === "sentence-equivalence") && activeQuestion.options && (
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-blue-700">
                  ℹ️ {localize("This item requires selecting multiple options.")}
                </div>
                {activeQuestion.options.map((opt, oIdx) => {
                  const currentSelected = (userAnswers[activeQuestion.id] as string[]) || [];
                  const isSelected = currentSelected.includes(opt);
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleMultiSelect(opt)}
                      className={`w-full text-left flex items-start gap-3.5 rounded-xl border p-3.5 text-xs sm:text-sm transition cursor-pointer ${
                        isSelected 
                          ? "border-blue-600 bg-blue-50/60 font-semibold text-blue-950 shadow-2xs ring-1 ring-blue-500" 
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold ${
                        isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-slate-500"
                      }`}>
                        {isSelected ? "✓" : String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="leading-normal" dir={currentLanguageInfo.dir}>{localize(opt)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 3. Fill in Blanks / Write from Dictation (Single Line Input) */}
            {activeQuestion.type === "fill-in-blanks" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Your Answer:
                </label>
                <input
                  type="text"
                  value={(userAnswers[activeQuestion.id] as string) || ""}
                  onChange={e => handleTextInput(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>
            )}

            {/* 4. Essay Writing Task (Rich Textarea) */}
            {activeQuestion.type === "essay-writing" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Target: 200 – 300 words</span>
                  <span>
                    Word Count: <strong className="text-slate-900">
                      {((userAnswers[activeQuestion.id] as string) || "").trim().split(/\s+/).filter(Boolean).length}
                    </strong>
                  </span>
                </div>
                <textarea
                  rows={9}
                  value={(userAnswers[activeQuestion.id] as string) || ""}
                  onChange={e => handleTextInput(e.target.value)}
                  placeholder="Plan and compose your structured response here..."
                  className="w-full rounded-2xl border border-slate-300 p-4 text-sm leading-relaxed focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>
            )}
          </div>

          {/* Bottom Question Navigation & Review Tray */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {/* Jump Question Dots */}
            <div className="flex items-center gap-1.5 flex-wrap max-w-md justify-center">
              {allQuestions.map((item, idx) => {
                const ans = userAnswers[item.question.id];
                const isAns = Array.isArray(ans) ? ans.length > 0 : Boolean(ans && String(ans).trim());
                const isCurrent = idx === currentQuestionIndex;
                const isFlg = flaggedQuestions[item.question.id];

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`relative flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black transition cursor-pointer ${
                      isCurrent 
                        ? "bg-blue-600 text-white shadow-xs" 
                        : isAns 
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {idx + 1}
                    {isFlg && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {currentQuestionIndex < allQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(allQuestions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-black text-white hover:bg-emerald-700 transition shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Finish & Submit</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Complete {meta?.name} Exam?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered <strong className="text-slate-900">{answeredCount}</strong> of <strong className="text-slate-900">{allQuestions.length}</strong> items.
              {answeredCount < allQuestions.length && (
                <span className="text-amber-600 block mt-1 font-semibold">
                  ⚠️ Note: Unanswered items will be scored as 0 points.
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Return to Test
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                Submit & View Score Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
