import React, { useState, useEffect } from "react";
import { WritingTest } from "../types/ielts";
import { VisualChartRenderer } from "./VisualChartRenderer";
import { saveAttempt, getAttempt } from "../utils/storage";
import { Clock, CheckCircle, ArrowLeft, RotateCcw, PenTool, Sparkles, AlertCircle, CheckCircle2, FileText, ArrowRight } from "lucide-react";

interface WritingRunnerProps {
  test: WritingTest;
  onBack: () => void;
  onComplete: () => void;
}

export const WritingRunner: React.FC<WritingRunnerProps> = ({ test, onBack, onComplete }) => {
  const previous = getAttempt("writing", test.id);
  const [currentTask, setCurrentTask] = useState<1 | 2>(1);
  const [task1Text, setTask1Text] = useState<string>(previous?.task1Response || "");
  const [task2Text, setTask2Text] = useState<string>(previous?.task2Response || "");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const [aiAnalysis1, setAiAnalysis1] = useState<any>(null);
  const [aiAnalysis2, setAiAnalysis2] = useState<any>(null);
  const [isLoadingAi1, setIsLoadingAi1] = useState<boolean>(false);
  const [isLoadingAi2, setIsLoadingAi2] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(!!previous);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount1 = countWords(task1Text);
  const wordCount2 = countWords(task2Text);

  const handleAnalyze = async (taskNum: 1 | 2) => {
    const answer = taskNum === 1 ? task1Text : task2Text;
    const minWords = taskNum === 1 ? 150 : 250;
    const count = taskNum === 1 ? wordCount1 : wordCount2;

    if (!answer.trim()) {
      alert(`Please write your response for Task ${taskNum} before running the analysis.`);
      return;
    }

    if (taskNum === 1) setIsLoadingAi1(true);
    else setIsLoadingAi2(true);
    setAiError(null);

    try {
      const response = await fetch("/api/analyze-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskNum,
          question: taskNum === 1 ? test.task1 : test.task2,
          answer,
          visualDescription: taskNum === 1 ? JSON.stringify(test.visual) : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze response");
      }

      if (taskNum === 1) {
        setAiAnalysis1(data.analysis);
      } else {
        setAiAnalysis2(data.analysis);
      }
    } catch (err: any) {
      setAiError(err.message || "Failed to communicate with the evaluation server.");
    } finally {
      if (taskNum === 1) setIsLoadingAi1(false);
      else setIsLoadingAi2(false);
    }
  };

  const handleSaveAttempt = () => {
    if (wordCount1 === 0 && wordCount2 === 0) {
      // Unattempted: Official IELTS Band 0.0
      saveAttempt({
        section: "writing",
        testId: test.id,
        completedAt: new Date().toISOString(),
        task1Response: "",
        task2Response: "",
        band: "0.0",
      });
      setIsSaved(true);
      onComplete();
      return;
    }

    let estimatedBand = "0.0";
    const b1 = aiAnalysis1?.estimatedBand ? parseFloat(aiAnalysis1.estimatedBand) : null;
    const b2 = aiAnalysis2?.estimatedBand ? parseFloat(aiAnalysis2.estimatedBand) : null;

    if (b1 !== null && b2 !== null) {
      // Official IELTS Writing formula: Task 2 has double the weight of Task 1
      const weightedAvg = (b1 + 2 * b2) / 3;
      const dec = weightedAvg - Math.floor(weightedAvg);
      let rounded = Math.floor(weightedAvg);
      if (dec >= 0.75) rounded = Math.ceil(weightedAvg);
      else if (dec >= 0.25) rounded = Math.floor(weightedAvg) + 0.5;
      estimatedBand = rounded.toFixed(1);
    } else if (b2 !== null) {
      estimatedBand = b2.toFixed(1);
    } else if (b1 !== null) {
      estimatedBand = b1.toFixed(1);
    } else {
      // Candidate hasn't analyzed either task with the brain yet
      // If words were typed, evaluate band roughly by substantive length, or award 0.0
      const totalWords = wordCount1 + wordCount2;
      if (totalWords < 40) estimatedBand = "1.0";
      else if (totalWords < 100) estimatedBand = "3.0";
      else if (totalWords < 200) estimatedBand = "4.5";
      else estimatedBand = "5.0";
    }

    saveAttempt({
      section: "writing",
      testId: test.id,
      completedAt: new Date().toISOString(),
      task1Response: task1Text,
      task2Response: task2Text,
      band: estimatedBand,
    });

    setIsSaved(true);
    onComplete();
  };

  const activeAnalysis = currentTask === 1 ? aiAnalysis1 : aiAnalysis2;
  const isAnalyzingCurrent = currentTask === 1 ? isLoadingAi1 : isLoadingAi2;

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Top Runner Bar */}
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
            <span className="text-xs text-slate-500">IELTS Academic Writing • 60 minutes • Task 1 (150w) & Task 2 (250w)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-black tabular-nums shadow-2xs ${
              secondsRemaining < 600
                ? "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={handleSaveAttempt}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isSaved ? "Saved ✓" : "Save Practice"}
          </button>
        </div>
      </div>

      {/* Task Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTask(1)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              currentTask === 1
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            Task 1: Visual Report ({wordCount1} words)
          </button>

          <button
            onClick={() => setCurrentTask(2)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              currentTask === 2
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Task 2: Academic Essay ({wordCount2} words)
          </button>
        </div>

        <div className="text-xs font-medium text-slate-500">
          {currentTask === 1 ? "Target: ~20 mins, at least 150 words" : "Target: ~40 mins, at least 250 words (2x weight)"}
        </div>
      </div>

      {/* Task Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prompt & Visuals */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-extrabold text-amber-800 uppercase">
                Task {currentTask} Prompt
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {currentTask === 1 ? `Type: ${test.task1_type}` : "Discursive Essay"}
              </span>
            </div>

            <p className="text-sm font-medium leading-relaxed text-slate-800">
              {currentTask === 1 ? test.task1 : test.task2}
            </p>

            {currentTask === 1 && (
              <p className="mt-3 text-xs text-slate-500 italic">
                Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
              </p>
            )}

            {currentTask === 2 && (
              <p className="mt-3 text-xs text-slate-500 italic">
                Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.
              </p>
            )}
          </div>

          {/* Visual Data for Task 1 */}
          {currentTask === 1 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Visual Data Provided in Exam
              </span>
              <VisualChartRenderer visual={test.visual} />
            </div>
          )}
        </div>

        {/* Right Column: Text Editor & AI Feedback */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Candidate Response — Task {currentTask}
              </span>
              {/* Word count pill */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span>Word count:</span>
                <span
                  className={`rounded-md px-2 py-0.5 ${
                    currentTask === 1
                      ? wordCount1 >= 150
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                      : wordCount2 >= 250
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentTask === 1 ? wordCount1 : wordCount2} / {currentTask === 1 ? "150 min" : "250 min"}
                </span>
              </div>
            </div>

            <textarea
              rows={14}
              value={currentTask === 1 ? task1Text : task2Text}
              onChange={e => {
                if (currentTask === 1) setTask1Text(e.target.value);
                else setTask2Text(e.target.value);
                setIsSaved(false);
              }}
              placeholder={
                currentTask === 1
                  ? "Write your Task 1 response here... (Introduction with overview, followed by key data groupings and comparative details)"
                  : "Write your Task 2 essay here... (Introduction with thesis statement, two well-developed body paragraphs with supporting examples, and conclusion)"
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-4 font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-hidden leading-relaxed resize-y"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAnalyze(currentTask)}
                  disabled={isAnalyzingCurrent}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isAnalyzingCurrent
                    ? "Evaluating Response..."
                    : `🤖 Evaluate Task ${currentTask} with AI`}
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Criterion-by-criterion assessment (TR, CC, LR, GRA)
              </span>
            </div>

            {aiError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}
          </div>

          {/* AI Diagnostic Report */}
          {activeAnalysis && (
            <div className="rounded-xl border border-blue-200 bg-white p-5 shadow-xs space-y-5 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-extrabold text-sm">
                    AI
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Examiner Evaluation Report</h3>
                    <span className="text-[11px] text-slate-500">IELTS Academic Assessment</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Estimated Band:</span>
                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-black text-white shadow-2xs">
                    Band {activeAnalysis.estimatedBand || "6.5"}
                  </span>
                </div>
              </div>

              {/* 4 Assessment Criteria Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Task Achievement / Response */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">
                      {currentTask === 1 ? "Task Achievement" : "Task Response"}
                    </span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-extrabold text-blue-800">
                      Band {activeAnalysis.taskScore?.band || "6.5"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeAnalysis.taskScore?.feedback || "Addressed the prompt requirements."}
                  </p>
                </div>

                {/* Coherence & Cohesion */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">Coherence & Cohesion</span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-extrabold text-blue-800">
                      Band {activeAnalysis.coherenceScore?.band || "6.5"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeAnalysis.coherenceScore?.feedback || "Logical flow and paragraph organization."}
                  </p>
                </div>

                {/* Lexical Resource */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">Lexical Resource</span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-extrabold text-blue-800">
                      Band {activeAnalysis.lexicalScore?.band || "6.5"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeAnalysis.lexicalScore?.feedback || "Academic vocabulary selection and collocations."}
                  </p>
                </div>

                {/* Grammatical Range & Accuracy */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">Grammar & Accuracy</span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-extrabold text-blue-800">
                      Band {activeAnalysis.grammarScore?.band || "6.5"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeAnalysis.grammarScore?.feedback || "Syntactic complexity and punctuation accuracy."}
                  </p>
                </div>
              </div>

              {/* Exact Line Corrections */}
              {activeAnalysis.corrections && activeAnalysis.corrections.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    High-Impact Language Corrections (Before → After)
                  </h4>
                  <div className="space-y-2">
                    {activeAnalysis.corrections.map((corr: any, idx: number) => (
                      <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-red-100 px-1.5 py-0.5 font-bold text-red-800 line-through">
                            {corr.original}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800">
                            {corr.corrected}
                          </span>
                        </div>
                        {corr.explanation && (
                          <p className="text-[11px] text-slate-500 italic pl-1">{corr.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              {activeAnalysis.nextSteps && (
                <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
                    Actionable Steps to Reach Band 7.5+
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                    {activeAnalysis.nextSteps.map((step: string, sIdx: number) => (
                      <li key={sIdx} className="leading-relaxed">{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
