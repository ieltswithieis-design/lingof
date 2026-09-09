import React, { useState } from "react";
import { TestSection, IeltsDatabase } from "../types/ielts";
import { ProgressState } from "../utils/storage";
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  Search,
  ShieldCheck,
  FileCheck,
  Download,
  GraduationCap,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  database: IeltsDatabase;
  progress: ProgressState;
  onSelectTest: (section: TestSection, id: number) => void;
  onSelectSection: (section: TestSection) => void;
  onOpenCertificate?: () => void;
  onSelectFullTests?: () => void;
  onOpenVerificationPortal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  database,
  progress,
  onSelectTest,
  onSelectSection,
  onOpenCertificate,
  onSelectFullTests,
  onOpenVerificationPortal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState<TestSection | "all">("all");

  const completedCount = Object.keys(progress.completed).length;
  const totalCount = 80;
  const overallPercentage = Math.round((completedCount / totalCount) * 100);

  const sectionsInfo: {
    key: TestSection;
    title: string;
    icon: any;
    color: string;
    badgeColor: string;
    time: string;
    description: string;
    count: number;
  }[] = [
    {
      key: "reading",
      title: "Academic Reading",
      icon: BookOpen,
      color: "border-blue-200 bg-blue-50/50 hover:border-blue-300",
      badgeColor: "bg-blue-100 text-blue-800",
      time: "60 minutes • 3 passages • 40 questions",
      description: "True/False/Not Given, Multiple Choice, and sentence completions with authentic academic texts.",
      count: database.reading.length,
    },
    {
      key: "listening",
      title: "IELTS Listening",
      icon: Headphones,
      color: "border-cyan-200 bg-cyan-50/50 hover:border-cyan-300",
      badgeColor: "bg-cyan-100 text-cyan-800",
      time: "30 minutes • 4 parts • 40 questions",
      description: "Audio simulations across everyday social dialogues to complex university discussions.",
      count: database.listening.length,
    },
    {
      key: "writing",
      title: "Academic Writing",
      icon: PenTool,
      color: "border-amber-200 bg-amber-50/50 hover:border-amber-300",
      badgeColor: "bg-amber-100 text-amber-800",
      time: "60 minutes • Task 1 & Task 2",
      description: "Data report with dynamic charts + academic essay with instant AI criterion scoring and corrections.",
      count: database.writing.length,
    },
    {
      key: "speaking",
      title: "IELTS Speaking",
      icon: Mic,
      color: "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300",
      badgeColor: "bg-emerald-100 text-emerald-800",
      time: "11–14 minutes • 3 parts",
      description: "Part 2 cue card with 1-minute prep timer, voice recording, live speech transcription, and AI feedback.",
      count: database.speaking.length,
    },
  ];

  // Filtered test catalog
  const filteredTests = (() => {
    const list: { section: TestSection; id: number; title: string; subtitle: string }[] = [];
    
    if (filterSection === "all" || filterSection === "reading") {
      database.reading.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "reading", id: t.id, title: t.title, subtitle: "3 passages • 40 questions • 60 mins" });
        }
      });
    }
    if (filterSection === "all" || filterSection === "listening") {
      database.listening.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "listening", id: t.id, title: t.title, subtitle: "4 parts • 40 questions • ~30 mins" });
        }
      });
    }
    if (filterSection === "all" || filterSection === "writing") {
      database.writing.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "writing", id: t.id, title: t.title, subtitle: `Task 1 (${t.task1_type}) + Task 2 Essay • 60 mins` });
        }
      });
    }
    if (filterSection === "all" || filterSection === "speaking") {
      database.speaking.forEach(t => {
        if (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          list.push({ section: "speaking", id: t.id, title: t.title, subtitle: "Interview • Cue card • Discussion • 14 mins" });
        }
      });
    }
    return list;
  })();

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6 sm:p-10 shadow-xs"
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-extrabold text-[#002d62]">
            <Sparkles className="h-3.5 w-3.5 text-yellow-600" />
            <span>lingofi Official Testing System • IDP & British Council Standard</span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
            Academic IELTS Computer-Delivered Examination & Certification
          </h1>
          <p className="text-base text-slate-600 sm:text-lg leading-relaxed">
            Practice with 80 official-format tests across Reading, Listening, Writing, and Speaking.
            Features genuine exam timers, direct audio recording with speech-to-text transcript conversion, AI criterion scoring, and authenticated Test Report Form (TRF) PDF certificates.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectSection("reading")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#002d62] px-5 py-3 text-sm font-extrabold text-white shadow-xs transition-all hover:bg-blue-900 hover:shadow-md cursor-pointer"
            >
              Begin Full Practice
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onSelectSection("speaking")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              <Mic className="h-4 w-4 text-emerald-600" />
              Speaking Audio Lab
            </button>
            <button
              onClick={() => onSelectSection("writing")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              <PenTool className="h-4 w-4 text-amber-600" />
              AI Writing Examiner
            </button>
            {onOpenCertificate && (
              <button
                onClick={onOpenCertificate}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/90 px-5 py-3 text-sm font-extrabold text-red-700 transition-all hover:bg-red-100 hover:text-red-800 shadow-2xs cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-red-600" />
                View TRF Certificate (PDF)
              </button>
            )}
          </div>
        </div>

        {/* Overall Completion Card */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-xs">
          <div className="p-3">
            <span className="text-xs font-semibold text-slate-500">Total Standard Tests</span>
            <div className="text-2xl font-black text-slate-900">80 Tests</div>
            <span className="text-[11px] text-emerald-600 font-bold">20 per skill module</span>
          </div>
          <div className="p-3 border-l border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Total Questions</span>
            <div className="text-2xl font-black text-slate-900">1,600+</div>
            <span className="text-[11px] text-blue-600 font-bold">Passages, audio & tasks</span>
          </div>
          <div className="p-3 border-l border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Completed So Far</span>
            <div className="text-2xl font-black text-slate-900">{completedCount} <span className="text-sm font-normal text-slate-400">/ 80</span></div>
            <span className="text-[11px] text-slate-500 font-semibold">{overallPercentage}% overall complete</span>
          </div>
          <div className="p-3 border-l border-slate-100">
            <span className="text-xs font-semibold text-slate-500">Official Certification</span>
            <div className="text-2xl font-black text-red-600 flex items-center gap-1">
              TRF PDF
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">IDP / British Council look</span>
          </div>
        </div>
      </motion.section>

      {/* 20 Complete IELTS Academic Examinations Highlight */}
      <section className="overflow-hidden rounded-2xl border-2 border-blue-900 bg-gradient-to-r from-[#002d62] via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-950">
              <Sparkles className="h-3.5 w-3.5" />
              Full Academic Battery
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              20 Complete IELTS Academic Tests (4 Skills in Sequence)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Take complete 2 hr 45 min mock examinations: <strong>Listening (40 Qs) → Reading (40 Qs) → Writing (Tasks 1 & 2) → Speaking (Parts 1-3)</strong>. 
              At the conclusion, upload your passport photo to instantly generate and download your official, verified Test Report Form.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onSelectFullTests && (
              <button
                onClick={onSelectFullTests}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-black text-slate-950 shadow-md hover:bg-amber-300 transition cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
                Browse 20 Full Tests
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Official TRF Certificate & Direct Verification Notice */}
      <section className="overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50/50 via-white to-amber-50/40 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
              Official Test Report Form (TRF) • Direct Verification
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
              Extremely Real-Look IELTS Certificate with AI Bit-Matching
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Designed for official institutional presentation (British Council & IDP framework). 
              <strong> Zero scanning criteria:</strong> Organizations upload the PDF directly to our website where our AI evaluates 100% of document bits, cryptographic keys, and watermark patterns. No signature required — officially issued by the Central Examination Authority.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onOpenVerificationPortal && (
              <button
                onClick={() => onOpenVerificationPortal()}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-blue-50 px-5 py-3 text-xs font-black text-blue-900 hover:bg-blue-100 transition cursor-pointer"
              >
                <Search className="h-4 w-4 text-blue-700" />
                Direct AI Verification
              </button>
            )}

            {onOpenCertificate && (
              <button
                onClick={onOpenCertificate}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-sm hover:bg-red-700 transition cursor-pointer"
              >
                <Download className="h-4 w-4" />
                View & Download TRF (PDF)
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4 Skill Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Four Core Exam Sections</h2>
          <span className="text-xs text-slate-500">Choose any skill to browse all 20 tests</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectionsInfo.map(sec => {
            const Icon = sec.icon;
            let secDone = 0;
            for (let i = 1; i <= 20; i++) {
              if (progress.completed[`${sec.key}-${i}`]) secDone++;
            }
            const secPct = Math.round((secDone / 20) * 100);

            return (
              <div
                key={sec.key}
                onClick={() => onSelectSection(sec.key)}
                className={`group flex flex-col justify-between rounded-xl border p-5 transition-all hover:shadow-md cursor-pointer ${sec.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-2xs">
                      <Icon className="h-5 w-5 text-slate-800" />
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${sec.badgeColor}`}>
                      {secDone}/20 done
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sec.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {sec.time}
                  </p>
                  <p className="mt-3 text-xs text-slate-600 line-clamp-3">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-slate-200/60 pt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-600">
                    <span>Practice Tests 1–20</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${secPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive Test Search & Catalog */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">All 80 Practice Tests</h2>
            <p className="text-xs text-slate-500">Filter by section or search by test topic</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search test topic..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
              {(["all", "reading", "listening", "writing", "speaking"] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setFilterSection(sec)}
                  className={`rounded-md px-3 py-1 text-xs font-bold capitalize transition-colors ${
                    filterSection === sec
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sec === "all" ? "All (80)" : sec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test List Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map(t => {
            const isDone = !!progress.completed[`${t.section}-${t.id}`];
            const attempt = progress.attempts[`${t.section}-${t.id}`];

            return (
              <div
                key={`${t.section}-${t.id}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-xs"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                        t.section === "reading"
                          ? "bg-blue-50 text-blue-700"
                          : t.section === "listening"
                          ? "bg-cyan-50 text-cyan-700"
                          : t.section === "writing"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {t.section} #{t.id}
                    </span>
                    {isDone && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" />
                        {attempt?.band ? `Band ${attempt.band}` : "Done"}
                      </span>
                    )}
                  </div>
                  <h4 className="truncate text-sm font-bold text-slate-800">{t.title}</h4>
                  <p className="truncate text-xs text-slate-500">{t.subtitle}</p>
                </div>

                <button
                  onClick={() => onSelectTest(t.section, t.id)}
                  className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                    isDone
                      ? "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isDone ? "Review" : "Start"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
