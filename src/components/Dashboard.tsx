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
  Sparkle
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
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1 text-xs font-bold text-blue-950 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official Academic Assessment Platform</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-800">
                Partnered with <strong className="text-red-700 font-extrabold">IEIS.io our partner organization</strong>
              </span>
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[44px] leading-tight">
              Master Academic IELTS with Real-Exam AI Practice & Scored Mocks
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Engineered for high-stakes test takers aiming for Band 7.5+. Practice with <strong>80 authentic practice tests</strong> across Reading, Listening, Writing, and Speaking, plus <strong>20 complete 4-skill mock simulations</strong> with live speech analysis and verifiable Test Report Forms.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {onSelectFullTests && (
                <button
                  onClick={onSelectFullTests}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-3.5 text-xs sm:text-sm font-black text-white shadow-md transition-all hover:bg-blue-950 hover:shadow-lg active:scale-98 cursor-pointer"
                >
                  <Layers className="h-4 w-4 text-amber-400" />
                  <span>Start 20 Full Mock Tests</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => onSelectSection("reading")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-blue-700" />
                <span>Practice by Section</span>
              </button>

              {onOpenCertificate && (
                <button
                  onClick={onOpenCertificate}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-xs sm:text-sm font-extrabold text-red-700 transition-all hover:bg-red-100 cursor-pointer"
                >
                  <Award className="h-4 w-4 text-red-600" />
                  <span>Official TRF Certificate</span>
                </button>
              )}
            </div>

            {/* Live Trust & Community Statistics Bar */}
            <div className="pt-2 grid grid-cols-3 gap-3 border-t border-slate-200/80">
              <div>
                <div className="flex items-center gap-1 text-slate-900 font-black text-lg sm:text-xl">
                  <span>480,000+</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Students Practicing Worldwide</p>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center gap-1 text-slate-900 font-black text-lg sm:text-xl">
                  <span>80 Full Tests</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">20 per Skill • 100% Authentic</p>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center gap-1 text-emerald-700 font-black text-lg sm:text-xl">
                  <span>Band 8.0+</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Recorded Highest Scores</p>
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
                    IDP & British Council format • Partnered with IEIS.io
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                  IEIS
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-black text-amber-300 block truncate">
                    IEIS.io our partner organization
                  </span>
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
              <button
                onClick={onSelectFullTests}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-md hover:bg-amber-300 active:scale-98 transition cursor-pointer"
              >
                <Layers className="h-4 w-4" />
                <span>Browse 20 Full Tests</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. STUDENT SUCCESS & REAL TESTIMONIALS WITH HUMAN PORTRAITS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Student Success Stories</h2>
            <p className="text-xs text-slate-500">Real candidates who achieved their target band with Lingofi and IEIS.io</p>
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
                  "{st.review}"
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
            <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Official Accreditation & Verification Alliance</span>
            </div>

            <h3 className="text-2xl font-serif font-black text-slate-900">
              In Official Partnership with <span className="text-red-700">IEIS.io our partner organization</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every IELTS Test Report Form generated on Lingofi is securely recorded and verifiable online. In collaboration with <strong>IEIS.io our partner organization</strong>, test scores cannot be manually modified or fabricated — they are recorded strictly from the candidate's highest achieved score in completed tests.
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
              <button
                onClick={onOpenCertificate}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-sm hover:bg-red-700 transition cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>View My Official TRF Certificate</span>
              </button>
            )}

            {onOpenVerificationPortal && (
              <button
                onClick={() => onOpenVerificationPortal()}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-blue-900 hover:bg-blue-50 transition cursor-pointer"
              >
                <Search className="h-4 w-4 text-blue-700" />
                <span>Direct Verification Portal</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 6. COMPREHENSIVE TEST CATALOG & SEARCH (All 80 Tests) */}
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
