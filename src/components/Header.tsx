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
  Flame
} from "lucide-react";

export type NavTab = "dashboard" | TestSection | "guide" | "certificate" | "fulltests" | "verify" | "blog" | "videos";

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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top Partnership Ribbon (Desktop & Mobile) */}
      <div className="bg-slate-900 px-4 py-1 text-center text-[11px] font-medium text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Official IELTS Academic Testing</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">
              In academic partnership with{" "}
              <a
                href="https://ieis.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 font-bold hover:underline inline-flex items-center gap-1"
              >
                IEIS.io our partner organization
                <ExternalLink className="h-2.5 w-2.5 inline opacity-80" />
              </a>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="hidden md:inline text-slate-400">IDP & British Council Aligned</span>
            <a
              href="https://ieis.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-blue-900/80 px-2.5 py-0.5 font-bold text-amber-300 border border-blue-700/50 hover:bg-blue-800 transition-colors inline-flex items-center gap-1"
            >
              <span>IEIS.io our partner organization</span>
              <ExternalLink className="h-2.5 w-2.5 inline opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* DESKTOP HEADER (Large screens) */}
      <div className="hidden lg:flex mx-auto max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Left Side: Enhanced Back Button with Esc hint + Brand Logo */}
        <div className="flex items-center gap-3">
          {canGoBack && onBack && (
            <motion.button
              whileHover={{ scale: 1.04, x: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleBackClick}
              title="Return to Previous Screen (or press Esc on keyboard)"
              className="group flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-black text-slate-800 shadow-2xs hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-blue-600 transition-transform group-hover:-translate-x-1" />
              <span>Back</span>
              <kbd className="ml-1 rounded bg-slate-100 border border-slate-300/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 font-semibold shadow-2xs">
                Esc
              </kbd>
            </motion.button>
          )}

          {/* Lingofi Brand Logo */}
          <button
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-3 text-left transition-opacity hover:opacity-90 focus:outline-hidden cursor-pointer"
          >
            <LingofiLogo size="md" />
            <div className="hidden xl:block">
              <span className="text-[11px] text-slate-500 font-medium">
                Official IELTS Examination & TRF Certification
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("dashboard")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
              currentTab === "dashboard"
                ? "bg-slate-100 text-[#002d62] font-extrabold shadow-2xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </motion.button>

          {/* 20 Full IELTS Mock Tests */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("fulltests")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-black transition-all cursor-pointer ${
              currentTab === "fulltests"
                ? "bg-blue-900 text-white shadow-xs"
                : "text-blue-900 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60"
            }`}
          >
            <Layers className="h-4 w-4 text-amber-400" />
            Full Tests (20)
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("reading")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
              currentTab === "reading"
                ? "bg-blue-50 text-blue-700 font-extrabold shadow-2xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Reading
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("listening")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
              currentTab === "listening"
                ? "bg-cyan-50 text-cyan-700 font-extrabold shadow-2xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Headphones className="h-4 w-4" />
            Listening
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("writing")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
              currentTab === "writing"
                ? "bg-amber-50 text-amber-800 font-extrabold shadow-2xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <PenTool className="h-4 w-4" />
            Writing
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("speaking")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
              currentTab === "speaking"
                ? "bg-emerald-50 text-emerald-800 font-extrabold shadow-2xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Mic className="h-4 w-4" />
            Speaking
          </motion.button>

          {/* Stories & Blogs Tab (110+ In-Depth Guides) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("blog")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              currentTab === "blog"
                ? "bg-indigo-900 text-white shadow-xs"
                : "text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/60"
            }`}
            title="110+ Real candidate stories, examiner guides & band 9 breakdowns"
          >
            <Newspaper className="h-4 w-4 text-indigo-600" />
            <span>Stories (110+)</span>
          </motion.button>

          {/* YouTube Trends Tab */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("videos")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              currentTab === "videos"
                ? "bg-red-600 text-white shadow-xs"
                : "text-red-700 bg-red-50/80 hover:bg-red-100 border border-red-200/60"
            }`}
            title="Trending IELTS YouTube search topics with instant search launcher"
          >
            <Youtube className="h-4 w-4 text-red-600 fill-red-600" />
            <span>YouTube Trends</span>
            <span className="rounded bg-red-600 px-1 py-0.2 text-[9px] font-black text-white">Hot</span>
          </motion.button>

          {/* Exam Format Guide Tab */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("guide")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              currentTab === "guide"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
            }`}
            title="Comprehensive IELTS Exam Format Guide & Band Scoring Matrix"
          >
            <GraduationCap className="h-4 w-4 text-blue-700" />
            <span>Format Guide</span>
          </motion.button>

          {/* Official TRF Certificate Tab */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("certificate")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition-all border cursor-pointer ${
              currentTab === "certificate"
                ? "bg-red-600 text-white border-red-600 shadow-xs"
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
            }`}
          >
            <Award className="h-4 w-4" />
            TRF
          </motion.button>
        </nav>

        {/* Right Desktop Area */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleNavClick("verify")}
            className="hidden xl:flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5 text-xs font-extrabold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Direct Verification
          </motion.button>

          {/* Completion Meter */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200/60">
            <div className="text-right leading-tight">
              <span className="font-bold text-slate-900">{completedCount}</span>
              <span className="text-slate-400">/{totalTests}</span>
            </div>
            <div className="h-2 w-14 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-slate-800">{percent}%</span>
          </div>

          {completedCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: -30 }}
              whileTap={{ scale: 0.9 }}
              onClick={onResetProgress}
              title="Reset progress"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* MOBILE PHONE HEADER (lg:hidden) - CENTERED CREATIVE HAMBURGER & ENHANCED BACK */}
      <div className="flex lg:hidden items-center justify-between px-3 py-2 border-b border-slate-100 bg-white">
        {/* LEFT ZONE: Enhanced Back Button or Logo */}
        <div className="flex items-center min-w-[72px] justify-start">
          {canGoBack && onBack ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              onClick={handleBackClick}
              aria-label="Return to previous screen"
              className="group flex items-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50/90 px-2.5 py-1.5 text-xs font-black text-blue-900 shadow-2xs hover:bg-blue-100 active:scale-95 transition cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-blue-700 transition-transform group-hover:-translate-x-0.5" />
              <span className="font-black">Back</span>
            </motion.button>
          ) : (
            <button
              onClick={() => handleNavClick("dashboard")}
              className="flex items-center gap-1 text-left cursor-pointer active:opacity-80"
            >
              <LingofiLogo size="sm" />
            </button>
          )}
        </div>

        {/* CENTER ZONE: UNIQUE & CREATIVE CENTERED HAMBURGER TRIGGER BUTTON */}
        <div className="flex items-center justify-center flex-1 px-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle full screen navigation menu"
            className="relative group rounded-full p-[1.5px] bg-gradient-to-r from-red-600 via-amber-500 to-blue-600 shadow-md transition-all cursor-pointer"
          >
            <div className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black transition-colors ${
              isMobileMenuOpen 
                ? "bg-slate-950 text-white" 
                : "bg-slate-900 text-white group-hover:bg-slate-800"
            }`}>
              {/* Pulsating Beacon */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>

              {/* Morphing Hamburger / X Icon */}
              <div className="flex flex-col justify-center items-center gap-0.5 w-3.5 h-3">
                <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "w-3.5 rotate-45 translate-y-1" : "w-3.5"
                }`} />
                <span className={`h-0.5 bg-amber-400 rounded-full transition-all duration-200 ${
                  isMobileMenuOpen ? "w-0 opacity-0" : "w-2.5 self-start"
                }`} />
                <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "w-3.5 -rotate-45 -translate-y-1" : "w-3.5"
                }`} />
              </div>

              <span className="text-[11px] font-black uppercase tracking-wider text-amber-200">
                {isMobileMenuOpen ? "Close" : "Menu Hub"}
              </span>

              <span className="hidden xs:inline-block rounded-full bg-blue-500/30 px-1.5 py-0.2 text-[9px] font-extrabold text-blue-200 border border-blue-400/30">
                20 Mocks
              </span>
            </div>
          </motion.button>
        </div>

        {/* RIGHT ZONE: Progress Counter & Micro Logo if Back was on the Left */}
        <div className="flex items-center justify-end min-w-[72px] gap-1.5">
          {canGoBack && (
            <button
              onClick={() => handleNavClick("dashboard")}
              className="hidden xs:flex items-center opacity-70 hover:opacity-100 cursor-pointer"
              title="Return to Home Dashboard"
            >
              <LingofiLogo size="sm" />
            </button>
          )}

          <div className="flex items-center gap-1 rounded-xl bg-slate-100 px-2 py-1 border border-slate-200 text-[11px] font-black text-slate-800 shadow-2xs">
            <span className="text-red-600 font-extrabold">{completedCount}</span>
            <span className="text-slate-400">/</span>
            <span>{totalTests}</span>
          </div>
        </div>
      </div>

      {/* QUICK HORIZONTAL SCROLL PILLS FOR MOBILE (Secondary Fast Access) */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-200 px-3 py-2 gap-1.5 scrollbar-none bg-slate-50/70">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("dashboard")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "dashboard" ? "bg-[#002d62] text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Home
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("fulltests")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
            currentTab === "fulltests" ? "bg-blue-900 text-white shadow-2xs" : "bg-blue-50 text-blue-900 border border-blue-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-amber-500" />
          Full Tests
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("guide")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
            currentTab === "guide" ? "bg-slate-900 text-white shadow-2xs" : "bg-slate-100 text-slate-800 border border-slate-300"
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5 text-blue-700" />
          Format Guide
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("reading")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "reading" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Reading
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("listening")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "listening" ? "bg-cyan-700 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <Headphones className="h-3.5 w-3.5" />
          Listening
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("writing")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "writing" ? "bg-amber-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <PenTool className="h-3.5 w-3.5" />
          Writing
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("speaking")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            currentTab === "speaking" ? "bg-emerald-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
          Speaking
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("certificate")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
            currentTab === "certificate" ? "bg-red-600 text-white shadow-2xs" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          TRF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("verify")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
            currentTab === "verify" ? "bg-emerald-700 text-white shadow-2xs" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Verify
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("blog")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
            currentTab === "blog" ? "bg-indigo-900 text-white shadow-2xs" : "bg-indigo-50 text-indigo-900 border border-indigo-200"
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          Stories (110+)
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("videos")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
            currentTab === "videos" ? "bg-red-600 text-white shadow-2xs" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <Youtube className="h-3.5 w-3.5 text-red-600" />
          YouTube Trends
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
                <LingofiLogo size="md" />
                <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400 border-l border-slate-700 pl-2 ml-2">
                  Full Screen Portal
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://ieis.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-blue-900/70 border border-blue-500/30 px-3 py-1 text-[11px] font-bold text-amber-300 hover:bg-blue-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>IEIS.io Partner</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                
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
                    <span>Return to Previous Screen / Test Catalog</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-blue-400" />
                </motion.button>
              )}

              {/* Partner Organization Announcement Box */}
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 to-slate-900 p-4">
                <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <a
                    href="https://ieis.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline inline-flex items-center gap-1"
                  >
                    <span>IEIS.io our partner organization</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  Official accreditation alliance providing computer-delivered mock test batteries and instant cryptographic TRF verification.
                </p>
              </div>

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
                        <div className="font-extrabold">Overview & Hub</div>
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
                        <div className="font-extrabold text-white">20 Full Academic Tests</div>
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
                        <div>Academic Reading</div>
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
                        <div>Listening Lab</div>
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
                        <div>Writing AI Grader</div>
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
                        <div>Speaking AI Coach</div>
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
                        <div className="font-extrabold text-white">Exam Format Guide</div>
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
                        <div className="font-extrabold">Candidate Stories</div>
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
                        <div className="font-extrabold">YouTube Search Trends</div>
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
                        <div className="font-extrabold text-white">Official TRF Certificate</div>
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
                        <div className="font-extrabold text-white">Direct Verification Portal</div>
                        <div className="text-[10px] text-emerald-300">No QR Scanning Needed</div>
                      </div>
                    </div>
                    <span className="rounded bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
                      Instant
                    </span>
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
                  <span>Reset Progress</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
