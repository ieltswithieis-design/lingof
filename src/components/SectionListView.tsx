import React, { useState } from "react";
import { TestSection, IeltsDatabase } from "../types/ielts";
import { ProgressState } from "../utils/storage";
import { BookOpen, Headphones, PenTool, Mic, CheckCircle2, Clock, Play, RotateCcw, ArrowRight } from "lucide-react";

interface SectionListViewProps {
  section: TestSection;
  database: IeltsDatabase;
  progress: ProgressState;
  onSelectTest: (section: TestSection, testId: number) => void;
}

export const SectionListView: React.FC<SectionListViewProps> = ({
  section,
  database,
  progress,
  onSelectTest,
}) => {
  const [filter, setFilter] = useState<"all" | "completed" | "uncompleted">("all");

  const meta = {
    reading: {
      title: "Academic Reading Practice Tests",
      icon: BookOpen,
      count: database.reading.length,
      time: "60 minutes • 3 passages • 40 questions",
      desc: "Authentic academic reading texts with True/False/Not Given, Multiple Choice, and Completion questions. Automatic scoring with Band 9.0 conversion.",
      color: "bg-blue-600",
      pillColor: "bg-blue-100 text-blue-800",
    },
    listening: {
      title: "Listening Practice Tests",
      icon: Headphones,
      count: database.listening.length,
      time: "30 minutes • 4 parts • 40 questions",
      desc: "Realistic multi-accent audio speech simulation for social and academic contexts with live speech controls and instant band scoring.",
      color: "bg-cyan-700",
      pillColor: "bg-cyan-100 text-cyan-800",
    },
    writing: {
      title: "Academic Writing Practice Tests",
      icon: PenTool,
      count: database.writing.length,
      time: "60 minutes • Task 1 (150w) & Task 2 (250w)",
      desc: "Interactive visual charts, tables, diagrams, and maps paired with Academic Essay prompts and instant AI diagnostic scoring.",
      color: "bg-amber-600",
      pillColor: "bg-amber-100 text-amber-800",
    },
    speaking: {
      title: "Speaking Practice Tests",
      icon: Mic,
      count: database.speaking.length,
      time: "11–14 minutes • Parts 1, 2 & 3",
      desc: "Interview questions, interactive Part 2 cue cards with 1-min preparation timer, live voice recording, and AI speech evaluation.",
      color: "bg-emerald-700",
      pillColor: "bg-emerald-100 text-emerald-800",
    },
  }[section];

  const Icon = meta.icon;

  let completedInSection = 0;
  for (let i = 1; i <= meta.count; i++) {
    if (progress.completed[`${section}-${i}`]) completedInSection++;
  }

  // Raw tests array
  const rawList = database[section] as any[];

  const filtered = rawList.filter(t => {
    const isDone = !!progress.completed[`${section}-${t.id}`];
    if (filter === "completed") return isDone;
    if (filter === "uncompleted") return !isDone;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Section Hero Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-xs ${meta.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${meta.pillColor} uppercase tracking-wider`}>
                  {section} Module
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {completedInSection} of {meta.count} completed
                </span>
              </div>
              <h1 className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                {meta.title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                {meta.desc}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <div className="text-right">
              <div className="text-xl font-black text-slate-900 leading-tight">
                {Math.round((completedInSection / meta.count) * 100)}%
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
            </div>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full ${meta.color} transition-all duration-500`}
                style={{ width: `${(completedInSection / meta.count) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {meta.time}
          </span>

          <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                filter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({meta.count})
            </button>
            <button
              onClick={() => setFilter("uncompleted")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                filter === "uncompleted" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Not Started ({meta.count - completedInSection})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                filter === "completed" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Completed ({completedInSection})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 20 Tests */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(t => {
          const isDone = !!progress.completed[`${section}-${t.id}`];
          const attempt = progress.attempts[`${section}-${t.id}`];

          // Subtitle details
          let details = "";
          if (section === "reading") {
            details = "3 Passages • 40 Questions • 60 mins";
          } else if (section === "listening") {
            details = "4 Parts with Audio • 40 Questions • ~30 mins";
          } else if (section === "writing") {
            details = `Task 1: ${t.task1_type} + Task 2: Essay`;
          } else {
            details = `Part 2 Cue Card + Parts 1 & 3 Interview`;
          }

          return (
            <div
              key={t.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all hover:shadow-md bg-white ${
                isDone ? "border-slate-200" : "border-slate-200/90 hover:border-blue-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Test #{t.id}
                  </span>

                  {isDone ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {attempt?.band ? `Band ${attempt.band}` : "Done"}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400">Available</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {t.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                  {details}
                </p>

                {/* Score recap if available */}
                {isDone && attempt?.score !== undefined && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-xs font-semibold text-slate-600">
                    <span>Raw score: <strong>{attempt.score}/40</strong></span>
                    <span>•</span>
                    <span>Band: <strong className="text-blue-600">{attempt.band}</strong></span>
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {isDone ? "Review answers" : "Full simulation"}
                </span>

                <button
                  onClick={() => onSelectTest(section, t.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                    isDone
                      ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                  }`}
                >
                  {isDone ? "Review Test" : "Start Test"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
