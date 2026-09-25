import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TestSection } from "../types/ielts";
import { stopAllActiveMedia } from "../utils/audioControl";
import { LingofiLogo } from "./LingofiLogo";
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  LayoutDashboard, 
  Award, 
  CheckCircle2, 
  RotateCcw, 
  FileCheck, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Search,
  Menu,
  X,
  ArrowLeft,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Youtube,
  Newspaper,
  Flame,
  Brain,
  Globe2,
  Database,
  User,
  LogIn
} from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export type NavTab = 
  | "dashboard" 
  | TestSection 
  | "guide" 
  | "certificate" 
  | "fulltests" 
  | "verify" 
  | "blog" 
  | "videos" 
  | "iqtest" 
  | "iqcert"
  | "international-exams"
  | "pte"
  | "sat"
  | "gre"
  | "gmat"
  | "toefl"
  | "act"
  | "database-studio";

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  completedCount: number;
  totalTests: number;
  onResetProgress: () => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  completedCount,
  totalTests,
  onResetProgress,
  onBack,
  canGoBack = false,
}) => {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const percent = Math.round((completedCount / totalTests) * 100) || 0;

  const handleNavClick = (tab: NavTab) => {
    stopAllActiveMedia();
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleBackClick = () => {
    stopAllActiveMedia();
    if (onBack) onBack();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#01cfe1]/20 bg-[#0a2540] shadow-md">
      {/* Top Partnership Ribbon (Desktop & Mobile) - Alfa PTE Style */}
      <div className="bg-[#06182a] border-b border-[#0a2540] px-4 py-1.5 text-center text-[11px] font-medium text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-[#01cfe1] animate-pulse" />
            <span className="font-extrabold text-white">{t("instituteName", "LingoFi Institute of Language & Testing")}</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-[#01cfe1]">
              {t("tagline", "Official IELTS Academic Examination Platform")}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Prominent Global Language Switcher */}
            <LanguageSwitcher variant="dark" />
            <span className="hidden md:inline text-slate-400">IDP & British Council Aligned</span>
          </div>
        </div>
      </div>

      {/* DESKTOP HEADER (Large screens) - Alfa PTE Midnight Navy & Vibrant Cyan Navigation */}
      <div className="hidden lg:flex flex-col bg-[#0a2540] text-white max-w-full">
        {/* Row 1: Logo & Primary Academic Modules */}
        <div className="mx-auto max-w-7xl w-full flex items-center justify-between px-3 py-2 sm:px-6">
          {/* Left Side: Enhanced Back Button with Esc hint + Brand Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            {canGoBack && onBack && (
              <motion.button
                whileHover={{ scale: 1.04, x: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleBackClick}
                title="Return to Previous Screen (or press Esc on keyboard)"
                className="group flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-black text-white hover:border-[#01cfe1] hover:bg-[#01cfe1]/20 hover:text-[#01cfe1] transition cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-[#01cfe1] transition-transform group-hover:-translate-x-1" />
                <span>{t("backToHub", "Back")}</span>
                <kbd className="ml-1 rounded bg-black/40 border border-white/20 px-1 py-0.5 font-mono text-[9px] text-slate-300 font-semibold">
                  Esc
                </kbd>
              </motion.button>
            )}

            {/* Lingofi Brand Logo */}
            <button
              onClick={() => handleNavClick("dashboard")}
              className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 focus:outline-hidden cursor-pointer"
            >
              <LingofiLogo size="md" />
              <div className="hidden 2xl:block">
                <span className="text-[11px] text-slate-300 font-medium">
                  {t("tagline", "Official IELTS Examination & TRF Certification")}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs - Alfa PTE Style */}
          <nav className="flex items-center gap-1 xl:gap-1.5 min-w-0 justify-end">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleNavClick("dashboard")}
              className={`flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                currentTab === "dashboard"
                  ? "bg-[#01cfe1] text-[#0a2540] font-black shadow-md shadow-[#01cfe1]/25"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>{t("navDashboard", "Overview")}</span>
            </motion.button>

            {/* 20 Full IELTS Mock Tests */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleNavClick("fulltests")}
              className={`flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                currentTab === "fulltests"
                  ? "bg-[#01cfe1] text-[#0a2540] shadow-md shadow-[#01cfe1]/30 font-black"
                  : "text-[#01cfe1] bg-[#01cfe1]/15 hover:bg-[#01cfe1]/25 border border-[#01cfe1]/40"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-[#01cfe1]" />
              <span>{t("navFullTests", "Full Tests (20)")}</span>
            </motion.button>

            {/* YOUTUBE BUTTON IN THE MIDDLE OF THE FIRST AND LAST LINK - Less height (h-7 / py-0.5), longer width (px-4 xl:px-5) to cover space elegantly without horizontal scroll */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavClick("videos")}
              className={`group relative flex items-center justify-center gap-1.5 rounded-xl px-3.5 xl:px-4.5 py-0.5 text-xs font-black transition-all cursor-pointer border shadow-xs h-7 min-h-[28px] max-w-[200px] shrink min-w-0 ${
                currentTab === "videos"
                  ? "bg-red-600 text-white border-red-400 shadow-[0_2px_14px_rgba(239,68,68,0.5)] ring-1 ring-white/40"
                  : "bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white border-red-400/40 shadow-[0_2px_12px_rgba(220,38,38,0.35)] hover:shadow-[0_2px_18px_rgba(239,68,68,0.55)]"
              }`}
              title="Official YouTube Video Hub • Free Masterclasses & Examiner Tutorials"
            >
              {/* Pulsing Live Beacon */}
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              <Youtube className="h-3.5 w-3.5 text-white fill-white group-hover:scale-110 transition-transform shrink-0" />
              <span className="tracking-wide uppercase text-[11px] font-black whitespace-nowrap">
                {t("navVideos", "YouTube Hub")}
              </span>
              <span className="hidden xl:inline text-[10px] text-white/90 font-semibold whitespace-nowrap">
                • Free
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleNavClick("reading")}
              className={`flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                currentTab === "reading"
                  ? "bg-[#01cfe1] text-[#0a2540] font-black shadow-md shadow-[#01cfe1]/25"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>{t("navReading", "Reading")}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleNavClick("listening")}
              className={`flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                currentTab === "listening"
                  ? "bg-[#01cfe1] text-[#0a2540] font-black shadow-md shadow-[#01cfe1]/25"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Headphones className="h-3.5 w-3.5" />
              <span>{t("navListening", "Listening")}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleNavClick("writing")}
              className={`flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                currentTab === "writing"
                  ? "bg-[#01cfe1] text-[#0a2540] font-black shadow-md shadow-[#01cfe1]/25"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>{t("navWriting", "Writing")}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleNavClick("speaking")}
              className={`flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                currentTab === "speaking"
                  ? "bg-[#01cfe1] text-[#0a2540] font-black shadow-md shadow-[#01cfe1]/25"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>{t("navSpeaking", "Speaking")}</span>
            </motion.button>

            {/* Standardized IQ Test Tab */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleNavClick("iqtest")}
              className={`flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                currentTab === "iqtest" || currentTab === "iqcert"
                  ? "bg-purple-600 text-white shadow-xs font-black"
                  : "text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40"
              }`}
              title="Official Standardized IQ Test with Mensa Level Scoring & Certificate"
            >
              <Brain className="h-3.5 w-3.5 text-purple-400" />
              <span>{t("navIqTest", "IQ Test")}</span>
              <span className="rounded bg-purple-600 px-1 py-0.2 text-[9px] font-black text-white">Cert</span>
            </motion.button>

            {/* Stories & Blogs Tab (110+ In-Depth Guides) */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleNavClick("blog")}
              className={`flex items-center gap-1 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                currentTab === "blog"
                  ? "bg-indigo-900 text-white shadow-xs"
                  : "text-indigo-200 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-400/40"
              }`}
              title="110+ Real candidate stories, examiner guides & band 9 breakdowns"
            >
              <Newspaper className="h-3.5 w-3.5 text-indigo-400" />
              <span>{t("navBlog", "Stories (110+)")}</span>
            </motion.button>
          </nav>
        </div>

        {/* Row 2: TRF and options on the right side of it + Menu Hub for PC - Alfa PTE Styling with Flex Wrap */}
        <div className="border-t border-[#01cfe1]/15 bg-[#071b30] py-1.5 px-3 sm:px-6">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-y-1.5 gap-x-2">
            {/* Left side: TRF, Direct Verification, and Menu Hub button for PC */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {/* Official TRF Certificate Tab */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavClick("certificate")}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-black transition-all border cursor-pointer ${
                  currentTab === "certificate"
                    ? "bg-[#01cfe1] text-[#0a2540] border-[#01cfe1] shadow-xs"
                    : "bg-[#0a2540] text-slate-200 border-white/15 hover:border-[#01cfe1] hover:text-[#01cfe1]"
                }`}
              >
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>{t("navCertificate", "TRF Certificate")}</span>
              </motion.button>

              {/* Direct Verification */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavClick("verify")}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-black transition shadow-2xs cursor-pointer ${
                  currentTab === "verify"
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                    : "border-emerald-500/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t("navVerify", "Verify")}</span>
              </motion.button>

              {/* Format Guide in Second Line */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavClick("guide")}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-black transition shadow-2xs cursor-pointer ${
                  currentTab === "guide"
                    ? "bg-[#01cfe1] text-[#0a2540] border-[#01cfe1] shadow-xs"
                    : "border-white/15 bg-[#0a2540] text-slate-200 hover:border-[#01cfe1] hover:text-[#01cfe1]"
                }`}
                title="Comprehensive IELTS Exam Format Guide & Band Scoring Matrix"
              >
                <GraduationCap className="h-3.5 w-3.5 text-[#01cfe1]" />
                <span>{t("navGuide", "Guide")}</span>
              </motion.button>

              {/* International Standardized Exams Portal */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavClick("international-exams")}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-black transition shadow-2xs cursor-pointer ${
                  currentTab === "international-exams" || currentTab === "pte" || currentTab === "sat" || currentTab === "gre" || currentTab === "gmat" || currentTab === "toefl" || currentTab === "act"
                    ? "bg-[#01cfe1] text-[#0a2540] border-[#01cfe1] shadow-xs"
                    : "border-[#01cfe1]/40 bg-[#01cfe1]/15 text-[#01cfe1] hover:bg-[#01cfe1]/25 hover:border-[#01cfe1]"
                }`}
                title="International Standardized Testing Suites: PTE, SAT, GRE, GMAT, TOEFL, ACT"
              >
                <Globe2 className="h-3.5 w-3.5 text-[#01cfe1]" />
                <span>PTE • SAT • GRE</span>
              </motion.button>

              {/* Database Studio & Test Uploader */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavClick("database-studio")}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-black transition shadow-2xs cursor-pointer ${
                  currentTab === "database-studio"
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                    : "border-emerald-500/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60"
                }`}
                title="Database & Test Uploader Studio - Upload texts and manage tests directly in the database"
              >
                <Database className="h-3.5 w-3.5 text-emerald-400" />
                <span>Database Studio</span>
              </motion.button>

              {/* Unique & Creative Menu Hub Button for PC (Like Phone) */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle full screen navigation menu hub"
                className="relative group rounded-full p-[1.5px] bg-gradient-to-r from-[#01cfe1] via-teal-400 to-[#0a2540] shadow-xs transition-all cursor-pointer ml-0.5"
                title="Open Complete Menu Hub & IELTS Navigation Portal"
              >
                <div className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black transition-colors ${
                  isMobileMenuOpen 
                    ? "bg-[#01cfe1] text-[#0a2540]" 
                    : "bg-[#0a2540] text-white group-hover:bg-[#071b30]"
                }`}>
                  {/* Pulsating Beacon */}
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#01cfe1] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#01cfe1]" />
                  </span>
                  {/* Morphing Hamburger / X Icon */}
                  <div className="flex flex-col justify-center items-center gap-0.5 w-3 h-2.5">
                    <span className={`h-0.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? "bg-[#0a2540] w-3 rotate-45 translate-y-0.5" : "bg-white w-3"}`} />
                    <span className={`h-0.5 rounded-full transition-all duration-200 ${isMobileMenuOpen ? "w-0 opacity-0" : "bg-[#01cfe1] w-2 self-start"}`} />
                    <span className={`h-0.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? "bg-[#0a2540] w-3 -rotate-45 -translate-y-0.5" : "bg-white w-3"}`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isMobileMenuOpen ? "text-[#0a2540]" : "text-[#01cfe1]"}`}>
                    {isMobileMenuOpen ? t("closeHub", "Close") : t("menuHub", "Menu Hub")}
                  </span>
                  <span className="rounded-full bg-[#01cfe1]/20 px-1 py-0.2 text-[8px] font-extrabold text-[#01cfe1] border border-[#01cfe1]/30">
                    20 Mocks
                  </span>
                </div>
              </motion.button>
            </div>

            {/* Right side: User Authentication, Language Switcher, Completion Meter & Reset Progress */}
            <div className="flex flex-wrap items-center gap-2">
              {/* User Account / Auth Profile Button */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-2.5 py-1 shadow-2xs text-white">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#01cfe1] text-[10px] font-black text-[#0a2540]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left leading-none">
                    <span className="block text-[11px] font-black text-white max-w-[85px] sm:max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[9px] font-extrabold text-[#01cfe1] uppercase">
                      {user.role} • Band {user.targetBand}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-[10px] text-slate-300 hover:text-rose-400 font-bold ml-1 cursor-pointer"
                    title="Sign Out"
                  >
                    Out
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openAuthModal("login")}
                  className="flex items-center gap-1.5 rounded-xl bg-[#01cfe1] hover:bg-[#00bed0] text-[#0a2540] font-black px-3.5 py-1.5 text-xs shadow-md shadow-[#01cfe1]/25 transition active:scale-95 cursor-pointer"
                  title="Candidate & Teacher Login Portal"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Login / Sign Up</span>
                </motion.button>
              )}

              {/* World Language Switcher Button */}
              <LanguageSwitcher variant="dark" />

              {/* Completion Meter */}
              <div className="flex items-center gap-2 rounded-xl bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200 border border-white/15 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-300">{t("statusCompleted", "Finished")}:</span>
                <div className="text-right leading-tight">
                  <span className="font-bold text-white">{completedCount}</span>
                  <span className="text-slate-400">/{totalTests}</span>
                </div>
                <div className="h-2 w-14 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full bg-[#01cfe1] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#01cfe1]">{percent}%</span>
              </div>

              {completedCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -30 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onResetProgress}
                  title={t("resetProgress", "Reset progress")}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-[#01cfe1] border border-transparent hover:border-white/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE PHONE HEADER (lg:hidden) - GUARANTEED PROMINENT LINGOFI LOGO */}
      <div className="flex lg:hidden items-center justify-between px-3 py-2 border-b border-slate-100 bg-white gap-2">
        {/* LEFT ZONE: Back Button + GUARANTEED VISIBLE LINGOFI LOGO */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          {canGoBack && onBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              onClick={handleBackClick}
              aria-label="Return to previous screen"
              className="group flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/90 px-2 py-1.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-200 active:scale-95 transition cursor-pointer shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-700 transition-transform group-hover:-translate-x-0.5" />
              <span className="text-[11px] font-black">{t("backToHub", "Back")}</span>
            </motion.button>
          )}

          <button
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center text-left cursor-pointer active:opacity-80 shrink-0"
            title="LingoFi Institute Home"
          >
            <LingofiLogo size="sm" className="shrink-0" />
          </button>
        </div>

        {/* RIGHT ZONE: Language Switcher + Creative Menu Trigger */}
        <div className="flex items-center justify-end gap-1.5 shrink-0">
          {/* Mobile Language Switcher */}
          <LanguageSwitcher compact />

          {/* Menu Hub Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle full screen navigation menu"
            className="relative group rounded-full p-[1.5px] bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <div className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black transition-colors ${
              isMobileMenuOpen 
                ? "bg-slate-950 text-white" 
                : "bg-slate-900 text-white group-hover:bg-slate-800"
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>

              <div className="flex flex-col justify-center items-center gap-0.5 w-3 h-2.5">
                <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "w-3 rotate-45 translate-y-0.5" : "w-3"
                }`} />
                <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "w-3 -rotate-45 -translate-y-0.5" : "w-3"
                }`} />
              </div>

              <span className="text-[10px] font-black uppercase tracking-wider text-amber-200">
                {isMobileMenuOpen ? t("closeHub", "Close") : t("menuHub", "Menu")}
              </span>
            </div>
          </motion.button>

          {/* Progress Counter (shows on xs+) */}
          <div className="hidden xs:flex items-center gap-1 rounded-xl bg-slate-100 px-2 py-1 border border-slate-200 text-[11px] font-black text-slate-800 shadow-2xs shrink-0">
            <span className="text-blue-900 font-extrabold">{completedCount}</span>
            <span className="text-slate-400">/</span>
            <span>{totalTests}</span>
          </div>
        </div>
      </div>

      {/* QUICK RESPONSIVE NAVIGATION BAR FOR MOBILE (Zero Horizontal Scroll - All Wrap Naturally) */}
      <div className="flex lg:hidden flex-wrap items-center justify-center border-t border-slate-200 px-2 py-2 gap-1.5 bg-slate-50/90 text-xs">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("dashboard")}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "dashboard" ? "bg-slate-900 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <LayoutDashboard className="h-3 w-3" />
          <span>{t("navDashboard", "Home")}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("fulltests")}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black transition-all cursor-pointer ${
            currentTab === "fulltests" ? "bg-blue-900 text-white shadow-2xs" : "bg-blue-50 text-blue-900 border border-blue-200"
          }`}
        >
          <Layers className="h-3 w-3 text-amber-500" />
          <span>Full Tests</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("international-exams")}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black transition-all cursor-pointer ${
            currentTab === "international-exams" || currentTab === "pte" || currentTab === "sat" || currentTab === "gre" || currentTab === "gmat" || currentTab === "toefl" || currentTab === "act"
              ? "bg-blue-600 text-white shadow-2xs" 
              : "bg-blue-50 text-blue-900 border border-blue-300"
          }`}
        >
          <Globe2 className="h-3 w-3 text-blue-600" />
          <span>PTE / SAT / GRE</span>
        </motion.button>
        {/* YouTube Video Hub Pill - Elongated, Sleek, Less Height */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("videos")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-black transition-all cursor-pointer ${
            currentTab === "videos" ? "bg-red-600 text-white shadow-2xs" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <Youtube className="h-3.5 w-3.5 text-red-600 fill-current" />
          <span>YouTube Hub</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("reading")}
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "reading" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <BookOpen className="h-3 w-3" />
          <span>{t("navReading", "Reading")}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("listening")}
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "listening" ? "bg-cyan-700 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <Headphones className="h-3 w-3" />
          <span>{t("navListening", "Listening")}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("writing")}
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "writing" ? "bg-amber-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <PenTool className="h-3 w-3" />
          <span>{t("navWriting", "Writing")}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("speaking")}
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "speaking" ? "bg-emerald-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <Mic className="h-3 w-3" />
          <span>{t("navSpeaking", "Speaking")}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("iqtest")}
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black transition-all cursor-pointer ${
            currentTab === "iqtest" || currentTab === "iqcert" ? "bg-purple-700 text-white shadow-2xs" : "bg-purple-50 text-purple-900 border border-purple-200"
          }`}
        >
          <Brain className="h-3 w-3 text-purple-600" />
          <span>{t("navIqTest", "IQ Test")}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("certificate")}
          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black transition-all cursor-pointer ${
            currentTab === "certificate" ? "bg-red-600 text-white shadow-2xs" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <Award className="h-3 w-3" />
          <span>{t("navCertificate", "TRF")}</span>
        </motion.button>
      </div>

      {/* FULL-SCREEN IMMERSIVE HAMBURGER MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] w-screen h-screen bg-slate-950/95 backdrop-blur-md flex flex-col justify-between overflow-hidden"
          >
            {/* Top Navigation Bar inside Full-Screen Menu */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 py-4">
              <div className="flex items-center gap-2">
                <LingofiLogo size="md" variant="white" />
                <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400 border-l border-slate-700 pl-2 ml-2">
                  Full Screen Portal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white hover:bg-slate-700 active:scale-95 transition-all cursor-pointer border border-slate-700"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Scrollable Body: Full Screen Categorized Navigation Cards */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6 max-w-4xl mx-auto w-full">
              {/* Back to Previous Screen option if in test or detail */}
              {canGoBack && onBack && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onBack();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-blue-950/70 border border-blue-600/40 text-blue-200 font-bold text-xs cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <ArrowLeft className="h-4 w-4 text-blue-400" />
                    <span>{t("backToHub", "Return to Previous Screen / Test Catalog")}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-400" />
                </motion.button>
              )}

              {/* SECTION 1: Mock Exams & Skills Practice */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-blue-400" />
                    <span>Mock Exams & Skills Practice</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-bold">20 Full Sets</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("dashboard")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "dashboard"
                        ? "bg-blue-600 text-white border-blue-400 shadow-md"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                        <LayoutDashboard className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold">{t("navDashboard", "Overview & Hub")}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Catalog & Test Tracker</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("fulltests")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "fulltests"
                        ? "bg-blue-900 text-white border-blue-500 shadow-md"
                        : "bg-gradient-to-r from-blue-950/60 to-slate-900 text-slate-100 border-blue-900/50 hover:border-blue-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navFullTests", "20 Full Academic Tests")}</div>
                        <div className="text-[10px] text-amber-300 font-semibold">Timed Mock Battery</div>
                      </div>
                    </div>
                    <span className="rounded-md bg-amber-400 text-slate-950 px-2 py-0.5 text-[10px] font-black">
                      Scored
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("reading")}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "reading"
                        ? "bg-blue-600 text-white border-blue-400"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div>{t("navReading", "Academic Reading")}</div>
                        <div className="text-[10px] text-slate-400">20 Tests • 60 mins each</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">40 Qs</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("listening")}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "listening"
                        ? "bg-cyan-700 text-white border-cyan-400"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                        <Headphones className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div>{t("navListening", "Listening Lab")}</div>
                        <div className="text-[10px] text-slate-400">20 Audio Tests • 40 mins</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Sections 1–4</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("writing")}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "writing"
                        ? "bg-amber-600 text-white border-amber-400"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                        <PenTool className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div>{t("navWriting", "Writing AI Grader")}</div>
                        <div className="text-[10px] text-slate-400">20 Tests • Task 1 & 2</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Instant AI</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("speaking")}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "speaking"
                        ? "bg-emerald-600 text-white border-emerald-400"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Mic className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div>{t("navSpeaking", "Speaking AI Coach")}</div>
                        <div className="text-[10px] text-slate-400">20 Tests • Interactive Mic</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">Parts 1–3</span>
                  </motion.button>
                </div>
              </div>

              {/* SECTION 2: Guides, Stories & Search Trends */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Learning & Search Trends</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-bold">110+ Posts & Real-time Trends</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* PROMINENT EXAM FORMAT GUIDE BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("guide")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "guide"
                        ? "bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-400/30"
                        : "bg-gradient-to-br from-slate-900 to-blue-950 text-slate-100 border-blue-800/40 hover:border-blue-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navGuide", "Exam Format Guide")}</div>
                        <div className="text-[10px] text-blue-300">Band Scoring & Structure</div>
                      </div>
                    </div>
                    <span className="rounded bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 text-[9px] font-black uppercase">
                      Official
                    </span>
                  </motion.button>

                  {/* Candidate Stories (110+) */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("blog")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "blog"
                        ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800 hover:border-indigo-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                        <Newspaper className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold">{t("navBlog", "Candidate Stories")}</div>
                        <div className="text-[10px] text-slate-400">Band 9 Guides & Tips</div>
                      </div>
                    </div>
                    <span className="rounded bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 text-[10px] font-black">
                      110+ Posts
                    </span>
                  </motion.button>

                  {/* YouTube Trends */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("videos")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      currentTab === "videos"
                        ? "bg-red-600 text-white border-red-400 shadow-md"
                        : "bg-slate-900/80 text-slate-200 border-slate-800 hover:bg-slate-800 hover:border-red-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                        <Youtube className="h-4 w-4 fill-red-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold">{t("navVideos", "YouTube Search Trends")}</div>
                        <div className="text-[10px] text-slate-400">Instant Topic Launcher</div>
                      </div>
                    </div>
                    <span className="rounded bg-red-500/30 text-red-200 px-1.5 py-0.5 text-[10px] font-black">
                      Hot
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* SECTION 3: Official TRF Certification & Direct Verification */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-red-400" />
                    <span>Official Certification & Verification</span>
                  </p>
                  <span className="text-[10px] text-slate-500 font-bold">Cryptographic TRF</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("certificate")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      currentTab === "certificate"
                        ? "bg-red-600 text-white border-red-400 shadow-lg"
                        : "bg-gradient-to-r from-red-950/40 to-slate-900 text-slate-200 border-red-900/40 hover:border-red-600/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navCertificate", "Official TRF Certificate")}</div>
                        <div className="text-[10px] text-red-300">Candidate Test Report Form</div>
                      </div>
                    </div>
                    <span className="rounded bg-red-600/30 text-red-200 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Highest Band
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("verify")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      currentTab === "verify"
                        ? "bg-emerald-600 text-white border-emerald-400 shadow-lg"
                        : "bg-gradient-to-r from-emerald-950/40 to-slate-900 text-slate-200 border-emerald-900/40 hover:border-emerald-600/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navVerify", "Direct Verification Portal")}</div>
                        <div className="text-[10px] text-emerald-300">No QR Scanning Needed</div>
                      </div>
                    </div>
                    <span className="rounded bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Instant
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* SECTION 4: Standardized Cognitive IQ Testing & Verified Credentials */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Brain className="h-3.5 w-3.5 text-purple-400" />
                    <span>Cognitive IQ Battery & Psychometrics</span>
                  </p>
                  <span className="text-[10px] text-purple-300 font-bold">Mensa Scale Norms</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("iqtest")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      currentTab === "iqtest"
                        ? "bg-purple-700 text-white border-purple-400 shadow-lg"
                        : "bg-gradient-to-r from-purple-950/40 to-slate-900 text-slate-200 border-purple-900/40 hover:border-purple-600/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navIqTest", "Take Standardized IQ Test")}</div>
                        <div className="text-[10px] text-purple-300">Timed • Matrix & Abstract Logic</div>
                      </div>
                    </div>
                    <span className="rounded bg-purple-600/30 text-purple-200 border border-purple-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Test
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick("iqcert")}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                      currentTab === "iqcert"
                        ? "bg-amber-600 text-white border-amber-400 shadow-lg"
                        : "bg-gradient-to-r from-amber-950/40 to-slate-900 text-slate-200 border-amber-900/40 hover:border-amber-600/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white">{t("navIqCertificate", "Official IQ Certificate")}</div>
                        <div className="text-[10px] text-amber-300">Verified Credentials & PDF</div>
                      </div>
                    </div>
                    <span className="rounded bg-amber-600/30 text-amber-200 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Cert
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* SECTION 5: International Standardized Examination Suites (PTE, SAT, GRE, GMAT, TOEFL, ACT) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Globe2 className="h-3.5 w-3.5 text-blue-400" />
                    <span>International Standardized Testing Suites</span>
                  </p>
                  <button
                    onClick={() => handleNavClick("international-exams")}
                    className="text-[10px] text-blue-300 font-bold hover:underline cursor-pointer"
                  >
                    View All Suites →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("pte")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-amber-500/20 text-amber-300 px-1.5 py-0.5 text-[9px] font-black">Pearson</span>
                      <div className="text-xs font-black text-white mt-1.5">PTE Academic</div>
                      <div className="text-[10px] text-slate-400">10-90 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("sat")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-blue-500/20 text-blue-300 px-1.5 py-0.5 text-[9px] font-black">College Board</span>
                      <div className="text-xs font-black text-white mt-1.5">Digital SAT</div>
                      <div className="text-[10px] text-slate-400">400-1600 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("gre")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 text-[9px] font-black">ETS</span>
                      <div className="text-xs font-black text-white mt-1.5">GRE General</div>
                      <div className="text-[10px] text-slate-400">260-340 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("gmat")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[9px] font-black">GMAC</span>
                      <div className="text-xs font-black text-white mt-1.5">GMAT Focus</div>
                      <div className="text-[10px] text-slate-400">205-805 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("toefl")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-rose-500/20 text-rose-300 px-1.5 py-0.5 text-[9px] font-black">ETS</span>
                      <div className="text-xs font-black text-white mt-1.5">TOEFL iBT</div>
                      <div className="text-[10px] text-slate-400">0-120 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleNavClick("act")}
                    className="flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/90 text-left hover:border-blue-500 hover:bg-slate-800/90 transition cursor-pointer"
                  >
                    <div>
                      <span className="rounded bg-teal-500/20 text-teal-300 px-1.5 py-0.5 text-[9px] font-black">ACT, Inc.</span>
                      <div className="text-xs font-black text-white mt-1.5">ACT Assessment</div>
                      <div className="text-[10px] text-slate-400">1-36 Scale</div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 mt-2">Start →</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Bottom Progress & Reset Status Footer in Full-Screen Menu */}
            <div className="border-t border-slate-800 bg-slate-900/95 px-4 sm:px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-24 sm:w-36 overflow-hidden rounded-full bg-slate-800 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-white">
                    {completedCount} of {totalTests} Tests Done ({percent}%)
                  </span>
                </div>
              </div>

              {completedCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onResetProgress();
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-red-800/60 bg-red-950/40 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-900/50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{t("resetProgress", "Reset Progress")}</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
