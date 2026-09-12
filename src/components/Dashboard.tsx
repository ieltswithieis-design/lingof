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
  ChevronRight,
  Users,
  Star,
  Target,
  Check,
  Play,
  Layers,
  Sparkle,
  Youtube,
  Newspaper
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
  onOpenBlog?: () => void;
  onOpenVideos?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  database,
  progress,
  onSelectTest,
  onSelectSection,
  onOpenCertificate,
  onSelectFullTests,
  onOpenVerificationPortal,
  onOpenBlog,
  onOpenVideos,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState<TestSection | "all">("all");

  const completedCount = Object.keys(progress.completed).length;
  const totalCount = 80;
  const overallPercentage = Math.round((completedCount / totalCount) * 100);

  const sectionsInfo: {
    key: TestSection;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badgeColor: string;
    time: string;
    description: string;
    count: number;
    highlight: string;
  }[] = [
    {
      key: "reading",
      title: "Academic Reading",
      icon: BookOpen,
      color: "border-blue-200 bg-white hover:border-blue-400 hover:shadow-md",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      time: "60 mins • 3 passages • 40 Qs",
      description: "Authentic academic research papers, TFNG, matching headings, and sentence completions with instant answer analysis.",
      count: database.reading.length,
      highlight: "Split-view passage & question layout",
    },
    {
      key: "listening",
      title: "IELTS Listening",
      icon: Headphones,
      color: "border-cyan-200 bg-white hover:border-cyan-400 hover:shadow-md",
      badgeColor: "bg-cyan-50 text-cyan-800 border-cyan-200",
      time: "30 mins • 4 parts • 40 Qs",
      description: "High-clarity audio simulations ranging from daily social dialogues to university tutorials with auto-scoring.",
      count: database.listening.length,
      highlight: "Chronological audio playback engine",
    },
    {
      key: "writing",
      title: "Academic Writing",
      icon: PenTool,
      color: "border-amber-200 bg-white hover:border-amber-400 hover:shadow-md",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      time: "60 mins • Tasks 1 & 2",
      description: "Interactive visual chart descriptions plus Task 2 essays with instant AI criterion band scoring and grammar feedback.",
      count: database.writing.length,
      highlight: "Examiner AI 4-criterion evaluation",
    },
    {
      key: "speaking",
      title: "IELTS Speaking",
      icon: Mic,
      color: "border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-md",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      time: "11–14 mins • 3 parts",
      description: "Examiner video prompts, Part 2 60-second preparation countdown, voice recording, live transcript, and AI speech analysis.",
      count: database.speaking.length,
      highlight: "Live voice recording & speech AI",
    },
  ];

  // Testimonials with human photos of students
  const studentTestimonials = [
    {
      name: "Sophia Lin",
      role: "Accepted to Univ. of Oxford",
      score: "Band 8.5",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      review: "The computer-delivered interface matches the real IDP exam precisely. Practicing all 20 full mock tests gave me the calm confidence to score Band 8.5 on my first try!",
      target: "L: 9.0 • R: 8.5 • W: 8.0 • S: 8.5",
    },
    {
      name: "Marcus Chen",
      role: "Emigrating to Vancouver, Canada",
      score: "Band 8.0",
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
      review: "ApeUni and AlfaPTE are great, but Lingofi's AI writing feedback and speaking coach provide much deeper analysis of lexical resource and coherence. Outstanding platform!",
      target: "L: 8.5 • R: 8.5 • W: 7.5 • S: 8.0",
    },
    {
      name: "Amina Al-Mansoor",
      role: "Medical Residency, Melbourne",
      score: "Band 8.5",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      review: "Our institution verified my Test Report Form immediately. The direct cryptographic verification system with IEIS.io our partner organization is seamless and trusted.",
      target: "L: 9.0 • R: 9.0 • W: 8.0 • S: 8.0",
    },
    {
      name: "David Adeleke",
      role: "Master of Science, Toronto",
      score: "Band 8.0",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      review: "Having 20 complete mock tests with real audio recordings and official timers makes all the difference. Scoring is strictly recorded from your highest attempt!",
      target: "L: 8.5 • R: 8.0 • W: 7.5 • S: 8.0",
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
      {/* 1. HERO SECTION (ApeUni & AlfaPTE Style with Real Human Student Imagery & Elevated UI) */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 sm:p-10 shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Partnership Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-200/80 bg-white/95 px-4 py-1.5 text-xs font-bold text-blue-950 shadow-xs backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-[#002d62]">5 Million Students Practicing Worldwide</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-900">
                Partnered with{" "}
                <a
                  href="https://ieis.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-700 font-extrabold hover:underline inline-flex items-center gap-1 hover:text-red-800 transition-colors"
                >
                  IEIS.io our partner organization
                  <ExternalLink className="h-3 w-3 inline text-red-600" />
                </a>
              </span>
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[44px] leading-tight">
              Master Academic IELTS with Real-Exam AI Practice & Scored Mocks
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Engineered for high-stakes test takers aiming for Band 7.5+. Practice with <strong>80 authentic practice tests</strong> across Reading, Listening, Writing, and Speaking, plus <strong>20 complete 4-skill mock simulations</strong> with live speech analysis and verifiable Test Report Forms.
            </p>

            {/* CTAs - HIGH GRAPHIC BUTTONS WITH ANIMATIONS */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {onSelectFullTests && (
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onSelectFullTests}
                  className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#002d62] via-[#093d79] to-[#1e3a8a] px-6 py-4 text-xs sm:text-sm font-black text-white shadow-[0_4px_16px_rgba(0,45,98,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-blue-400/30 transition-all hover:shadow-[0_8px_24px_rgba(0,45,98,0.45)] cursor-pointer"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20 group-hover:rotate-6 transition-transform">
                    <Layers className="h-4 w-4 text-amber-300" />
                  </span>
                  <span className="tracking-wide">Start 20 Full Mock Tests</span>
                  <ArrowRight className="h-4 w-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectSection("reading")}
                className="group inline-flex items-center gap-2.5 rounded-2xl border-2 border-slate-300/80 bg-white/95 backdrop-blur-xs px-5 py-4 text-xs sm:text-sm font-black text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-900 cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-blue-700 group-hover:scale-110 transition-transform" />
                <span>Practice by Section</span>
              </motion.button>

              {onOpenCertificate && (
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenCertificate}
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-5 py-4 text-xs sm:text-sm font-black text-white shadow-[0_4px_16px_rgba(220,38,38,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-red-400/40 transition-all hover:shadow-[0_8px_24px_rgba(220,38,38,0.45)] cursor-pointer"
                >
                  <Award className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>Official TRF Certificate</span>
                </motion.button>
              )}
            </div>

            {/* Live Trust & Community Statistics Bar */}
            <div className="pt-3 grid grid-cols-3 gap-3 border-t border-slate-200/80">
              <div>
                <div className="flex items-center gap-1.5 text-[#002d62] font-black text-xl sm:text-2xl tracking-tight">
                  <span className="bg-gradient-to-r from-blue-950 via-[#002d62] to-blue-700 bg-clip-text text-transparent">5 Million+</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 font-extrabold tracking-tight">Students Practicing Worldwide</p>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center gap-1 text-slate-900 font-black text-xl sm:text-2xl tracking-tight">
                  <span>80 Full Tests</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">20 per Skill • 100% Authentic</p>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center gap-1 text-emerald-700 font-black text-xl sm:text-2xl tracking-tight">
                  <span>Band 8.0+</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Recorded Highest Scores</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Craft Student Composition (ApeUni/AlfaPTE aesthetic done right) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Photo Card */}
            <div className="relative w-full max-w-md">
              {/* Main Student Image */}
              <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-xl bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80" 
                  alt="University Students preparing for IELTS Academic exam" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Photo Bottom Caption */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Real Computer-Delivered IELTS Experience</span>
                  </div>
                  <p className="text-[11px] text-slate-200 mt-0.5">
                    IDP & British Council format • Partnered with{" "}
                    <a
                      href="https://ieis.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 font-bold underline hover:text-amber-200"
                    >
                      IEIS.io
                    </a>
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Top Right High Scorer Badge */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-3 -right-3 sm:-right-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md flex items-center gap-3"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
                  alt="Student portrait" 
                  className="h-10 w-10 rounded-full object-cover border-2 border-emerald-400"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-extrabold text-slate-900">Sophia L.</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-black text-emerald-800">
                      Band 8.5
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Listening 9.0 • Reading 8.5</span>
                </div>
              </motion.div>

              {/* Floating Badge 2: Bottom Left Partner Accreditation */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-4 -left-3 sm:-left-4 rounded-2xl border border-blue-200 bg-blue-900 text-white p-3 shadow-lg flex items-center gap-2.5 max-w-[260px]"
              >
                <a
                  href="https://ieis.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-colors"
                  title="Visit IEIS.io Official Website"
                >
                  IEIS
                </a>
                <div className="min-w-0">
                  <a
                    href="https://ieis.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-black text-amber-300 block truncate hover:underline"
                  >
                    IEIS.io our partner organization ↗
                  </a>
                  <span className="text-[10px] text-slate-200 block truncate">
                    Tamper-Proof Highest Score Records
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. APEUNI & ALFAPTE STYLE: QUICK PRACTICE HUB (4 Core Skills) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Core Skill Practice Hub</h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                80 Tests Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose a section to practice individual authentic 20-test banks with official timer and instant scoring
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Progress:</span>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-800">
              {completedCount}/80 completed ({overallPercentage}%)
            </span>
          </div>
        </div>

        {/* 4 Skill Cards */}
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
                className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all cursor-pointer ${sec.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5 text-slate-800 group-hover:text-white transition-colors" />
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold border ${sec.badgeColor}`}>
                      {secDone}/20 done
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sec.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {sec.time}
                  </p>
                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2">
                    {sec.description}
                  </p>

                  <div className="mt-2.5 inline-flex items-center gap-1 rounded bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    <Sparkle className="h-2.5 w-2.5 text-amber-500" />
                    <span>{sec.highlight}</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-700">
                    <span>Practice Tests 1–20</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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

      {/* 3. 20 FULL MOCK SIMULATIONS (Sequenced 4-Skill Tests) */}
      <section className="overflow-hidden rounded-3xl border-2 border-blue-900 bg-gradient-to-r from-[#002d62] via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
              <Sparkles className="h-3.5 w-3.5" />
              Complete Computer-Delivered Exam Simulation
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              20 Full Academic IELTS Mock Tests with AI Scoring
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the full 2 hour 45 minute exam: <strong>Listening (40 Qs) → Reading (40 Qs) → Writing (Tasks 1 & 2) → Speaking (Parts 1-3)</strong>. 
              Scores are automatically recorded from your highest achieved attempt and encrypted onto your official Test Report Form.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-amber-300 font-semibold pt-1">
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Genuine British Council Timers</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Speech & Essay AI Feedback</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Non-Editable Highest Scores</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onSelectFullTests && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onSelectFullTests}
                className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-7 py-4 text-sm font-black text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4),inset_0_1px_1px_rgba(255,255,255,0.8)] ring-1 ring-amber-500/50 hover:shadow-[0_8px_24px_rgba(245,158,11,0.55)] transition-all cursor-pointer"
              >
                <Layers className="h-4 w-4 group-hover:rotate-6 transition-transform" />
                <span>Browse 20 Full Tests</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* 4. STUDENT SUCCESS & REAL TESTIMONIALS WITH HUMAN PORTRAITS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Student Success Stories</h2>
            <p className="text-xs text-slate-500">
              Over 5 Million students practicing worldwide — real candidates who achieved their target band with Lingofi and{" "}
              <a
                href="https://ieis.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-bold hover:underline inline-flex items-center gap-0.5"
              >
                IEIS.io our partner organization
                <ExternalLink className="h-3 w-3 inline" />
              </a>
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="ml-1 text-slate-800 font-extrabold">4.9 / 5.0 Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {studentTestimonials.map((st, idx) => (
            <div 
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={st.photo} 
                    alt={st.name} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-blue-500 shadow-2xs shrink-0" 
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{st.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{st.role}</p>
                    <span className="inline-block mt-0.5 rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-black text-emerald-800">
                      {st.score}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{st.review.includes("IEIS.io") ? (
                    <>
                      Our institution verified my Test Report Form immediately. The direct cryptographic verification system with{" "}
                      <a
                        href="https://ieis.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 font-bold underline hover:text-blue-900"
                      >
                        IEIS.io our partner organization
                      </a>{" "}
                      is seamless and trusted.
                    </>
                  ) : (
                    st.review
                  )}"
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Verified TRF</span>
                <span className="font-bold text-blue-700">{st.target}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PARTNER ORGANIZATION & OFFICIAL TRF SECURITY */}
      <section className="overflow-hidden rounded-3xl border-2 border-red-200 bg-gradient-to-r from-red-50/60 via-white to-amber-50/50 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white uppercase tracking-wider shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Official Accreditation & Verification Alliance</span>
            </div>

            <h3 className="text-2xl font-serif font-black text-slate-900">
              In Official Partnership with{" "}
              <a
                href="https://ieis.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 hover:underline inline-flex items-center gap-1 hover:text-red-800 transition-colors"
              >
                IEIS.io our partner organization
                <ExternalLink className="h-5 w-5 inline text-red-600" />
              </a>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every IELTS Test Report Form generated on Lingofi is securely recorded and verifiable online. In collaboration with{" "}
              <a
                href="https://ieis.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 font-bold hover:underline inline-flex items-center gap-0.5"
              >
                IEIS.io our partner organization
                <ExternalLink className="h-3.5 w-3.5 inline text-red-600" />
              </a>
              , test scores cannot be manually modified or fabricated — they are recorded strictly from the candidate's highest achieved score in completed tests.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Integrity Mandate</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Non-Editable Highest Score Ledger</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verification Protocol</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Zero Barcode/QR Scanning Criteria</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Framework Standards</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">Aligned with British Council & IDP</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            {onOpenCertificate && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenCertificate}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-[0_4px_16px_rgba(220,38,38,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.45)] transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>View My Official TRF Certificate</span>
              </motion.button>
            )}

            {onOpenVerificationPortal && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenVerificationPortal()}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-blue-300/80 bg-white px-6 py-3.5 text-xs sm:text-sm font-black text-blue-900 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-blue-50/70 hover:border-blue-500 transition-all cursor-pointer"
              >
                <Search className="h-4 w-4 text-blue-700" />
                <span>Direct Verification Portal</span>
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* 6. IELTS STORIES, BLOG MASTERCLASSES & YOUTUBE VIDEO HUB */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stories & Blog Card */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-7 text-white shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-200">
              <Newspaper className="h-3.5 w-3.5 text-indigo-300" />
              <span>110+ In-Depth Articles & Case Studies</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              Candidate Stories, Band 9 Breakthroughs & Examiner Deconstructions
            </h3>

            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Read real test journeys from Band 6.0 to 8.5+, official Band 9 sample essays with examiner commentary, and curated C1/C2 academic vocabulary banks.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-indigo-300 font-semibold">
              SEO Optimized • Rich Visual Guides
            </span>

            {onOpenBlog && (
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenBlog}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-indigo-950 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-indigo-50 active:scale-95 transition cursor-pointer"
              >
                <span>Read Masterclasses</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>

        {/* YouTube Video Hub Card */}
        <div className="relative overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 p-6 sm:p-7 text-white shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-600/30 border border-red-500/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-red-200">
              <Youtube className="h-3.5 w-3.5 text-red-400" />
              <span>Embedded YouTube Streaming & Search</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              Watch Official IELTS Video Lessons & Search Any YouTube Topic
            </h3>

            <p className="text-xs sm:text-sm text-red-200/90 leading-relaxed">
              Stream curated lectures by former examiners and top educators for all 4 skills. Search all YouTube IELTS tutorials or paste any link to watch directly in Lingofi.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-red-300 font-semibold">
              HD Player • Key Timestamps • Practice Linkage
            </span>

            {onOpenVideos && (
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenVideos}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-4 py-2.5 text-xs font-black text-white shadow-[0_4px_14px_rgba(220,38,38,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                <span>Open Video Hub</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* 7. COMPREHENSIVE TEST CATALOG & SEARCH (All 80 Tests) */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">All 80 Practice Tests Directory</h2>
            <p className="text-xs text-slate-500">Filter by skill section or search by academic topic</p>
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
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(["all", "reading", "listening", "writing", "speaking"] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setFilterSection(sec)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize transition-colors ${
                    filterSection === sec
                      ? "bg-white text-blue-700 shadow-2xs"
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
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-xs"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
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
                  <h4 className="truncate text-sm font-bold text-slate-900">{t.title}</h4>
                  <p className="truncate text-xs text-slate-500">{t.subtitle}</p>
                </div>

                <button
                  onClick={() => onSelectTest(t.section, t.id)}
                  className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isDone
                      ? "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      : "bg-blue-900 text-white hover:bg-blue-950 active:scale-95"
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
