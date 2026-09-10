import React, { useState } from "react";
import { TestSection } from "../types/ielts";
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
  ChevronRight
} from "lucide-react";

export type NavTab = "dashboard" | TestSection | "guide" | "certificate" | "fulltests" | "verify";

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
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
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
              In academic partnership with <strong className="text-amber-300">IEIS.io our partner organization</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="hidden md:inline text-slate-400">IDP & British Council Aligned</span>
            <span className="rounded bg-blue-900/80 px-2 py-0.5 font-bold text-amber-300 border border-blue-700/50">
              IEIS.io our partner organization
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Left Side: Back Button (Phone) + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dedicated Back Option for Phone & PC */}
          {canGoBack && onBack && (
            <button
              onClick={onBack}
              aria-label="Back to Catalog"
              className="flex items-center gap-1 rounded-xl border border-slate-300 bg-slate-100 px-2.5 py-1.5 text-xs font-extrabold text-slate-800 shadow-2xs hover:bg-slate-200 active:scale-95 transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-blue-700" />
              <span className="font-bold">Back</span>
            </button>
          )}

          {/* Lingofi Brand */}
          <button
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-2 sm:gap-3 text-left transition-opacity hover:opacity-90 focus:outline-hidden cursor-pointer"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#002d62] font-black text-white shadow-sm text-base sm:text-lg tracking-tight">
              LF
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-xl">
                  lingofi
                </span>
                <span className="rounded-md bg-red-600 px-1.5 py-0.5 text-[8.5px] sm:text-[9px] font-black tracking-wider text-white uppercase">
                  Academic
                </span>
              </div>
              <span className="hidden text-[11px] text-slate-500 sm:block font-medium">
                Official IELTS Examination & TRF Certification
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => handleNavClick("dashboard")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
              currentTab === "dashboard"
                ? "bg-slate-100 text-[#002d62]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </button>

          {/* 20 Full IELTS Mock Tests */}
          <button
            onClick={() => handleNavClick("fulltests")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-black transition-colors ${
              currentTab === "fulltests"
                ? "bg-blue-900 text-white shadow-xs"
                : "text-blue-900 bg-blue-50/80 hover:bg-blue-100"
            }`}
          >
            <Layers className="h-4 w-4 text-amber-400" />
            Full Tests (20)
          </button>

          <button
            onClick={() => handleNavClick("reading")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors ${
              currentTab === "reading"
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Reading
          </button>

          <button
            onClick={() => handleNavClick("listening")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors ${
              currentTab === "listening"
                ? "bg-cyan-50 text-cyan-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Headphones className="h-4 w-4" />
            Listening
          </button>

          <button
            onClick={() => handleNavClick("writing")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors ${
              currentTab === "writing"
                ? "bg-amber-50 text-amber-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <PenTool className="h-4 w-4" />
            Writing
          </button>

          <button
            onClick={() => handleNavClick("speaking")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors ${
              currentTab === "speaking"
                ? "bg-emerald-50 text-emerald-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Mic className="h-4 w-4" />
            Speaking
          </button>

          {/* Official TRF Certificate Tab */}
          <button
            onClick={() => handleNavClick("certificate")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition-all border ${
              currentTab === "certificate"
                ? "bg-red-600 text-white border-red-600 shadow-xs"
                : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
            }`}
          >
            <Award className="h-4 w-4" />
            TRF Certificate
          </button>

          {/* Verification Portal Tab */}
          <button
            onClick={() => handleNavClick("verify")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition-all border ${
              currentTab === "verify"
                ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Verify TRF
          </button>
        </nav>

        {/* Right Header Area: Progress & Hamburger Button for Phone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick desktop actions */}
          <button
            onClick={() => handleNavClick("verify")}
            className="hidden xl:flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-2.5 py-1.5 text-xs font-extrabold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Direct Verification
          </button>

          {/* Completion Meter */}
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700">
            <div className="hidden sm:block text-right leading-tight">
              <span className="font-bold text-slate-900">{completedCount}</span>
              <span className="text-slate-400">/{totalTests}</span>
            </div>
            <div className="h-2 w-10 sm:w-14 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-slate-800">{percent}%</span>
          </div>

          {completedCount > 0 && (
            <button
              onClick={onResetProgress}
              title="Reset progress"
              className="rounded-lg p-1.5 sm:p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {/* HAMBURGER MENU BUTTON FOR PHONE */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="flex lg:hidden items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-900" />
            ) : (
              <Menu className="h-5 w-5 text-slate-900" />
            )}
          </button>
        </div>
      </div>

      {/* QUICK HORIZONTAL SCROLL PILLS FOR MOBILE (Secondary Fast Access) */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-200 px-3 py-2 gap-1.5 scrollbar-none bg-slate-50/70">
        <button
          onClick={() => handleNavClick("dashboard")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "dashboard" ? "bg-[#002d62] text-white" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Home
        </button>
        <button
          onClick={() => handleNavClick("fulltests")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black ${
            currentTab === "fulltests" ? "bg-blue-900 text-white" : "bg-blue-50 text-blue-900 border border-blue-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-amber-500" />
          Full Tests
        </button>
        <button
          onClick={() => handleNavClick("reading")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "reading" ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Reading
        </button>
        <button
          onClick={() => handleNavClick("listening")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "listening" ? "bg-cyan-700 text-white" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <Headphones className="h-3.5 w-3.5" />
          Listening
        </button>
        <button
          onClick={() => handleNavClick("writing")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "writing" ? "bg-amber-600 text-white" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <PenTool className="h-3.5 w-3.5" />
          Writing
        </button>
        <button
          onClick={() => handleNavClick("speaking")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "speaking" ? "bg-emerald-600 text-white" : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
          Speaking
        </button>
        <button
          onClick={() => handleNavClick("certificate")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black ${
            currentTab === "certificate" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          TRF
        </button>
        <button
          onClick={() => handleNavClick("verify")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black ${
            currentTab === "verify" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Verify
        </button>
      </div>

      {/* FULL RESPONSIVE HAMBURGER SLIDE-OUT DRAWER FOR PHONES */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[90px] bottom-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white border-b border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto p-4 space-y-4">
            {/* Header info in drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#002d62] text-white font-bold text-xs">
                  LF
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Lingofi Navigation</h3>
                  <p className="text-[11px] text-slate-500">Official Computer-Delivered Examination</p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Back button option in drawer */}
            {canGoBack && onBack && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBack();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-bold text-xs"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 text-blue-700" />
                  <span>Return to Previous Screen / Catalog</span>
                </div>
                <ChevronRight className="h-4 w-4 text-blue-500" />
              </button>
            )}

            {/* Partner Organization Announcement Box */}
            <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>IEIS.io our partner organization</span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1">
                Official accreditation alliance providing cryptographic verification and real exam test battery.
              </p>
            </div>

            {/* Navigation List */}
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick("dashboard")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  currentTab === "dashboard" ? "bg-slate-100 text-[#002d62]" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="h-4 w-4 text-blue-700" />
                  <span>Overview & Practice Hub</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavClick("fulltests")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-black transition-all ${
                  currentTab === "fulltests" ? "bg-blue-900 text-white" : "bg-blue-50/70 text-blue-900 hover:bg-blue-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-amber-400" />
                  <span>20 Full Academic Mock Tests</span>
                </div>
                <span className="rounded bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5">Scored</span>
              </button>

              <button
                onClick={() => handleNavClick("reading")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  currentTab === "reading" ? "bg-blue-100 text-blue-800" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span>Academic Reading (20 Tests)</span>
                </div>
                <span className="text-slate-400 text-[11px]">60 min</span>
              </button>

              <button
                onClick={() => handleNavClick("listening")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  currentTab === "listening" ? "bg-cyan-100 text-cyan-900" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Headphones className="h-4 w-4 text-cyan-600" />
                  <span>Listening Lab (20 Tests)</span>
                </div>
                <span className="text-slate-400 text-[11px]">40 min</span>
              </button>

              <button
                onClick={() => handleNavClick("writing")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  currentTab === "writing" ? "bg-amber-100 text-amber-900" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PenTool className="h-4 w-4 text-amber-600" />
                  <span>Writing AI Grader (20 Tests)</span>
                </div>
                <span className="text-slate-400 text-[11px]">Task 1 & 2</span>
              </button>

              <button
                onClick={() => handleNavClick("speaking")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  currentTab === "speaking" ? "bg-emerald-100 text-emerald-900" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mic className="h-4 w-4 text-emerald-600" />
                  <span>Speaking AI Coach (20 Tests)</span>
                </div>
                <span className="text-slate-400 text-[11px]">Parts 1–3</span>
              </button>

              <button
                onClick={() => handleNavClick("certificate")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all ${
                  currentTab === "certificate" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="h-4 w-4" />
                  <span>Official TRF Certificate</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">Highest Score</span>
              </button>

              <button
                onClick={() => handleNavClick("verify")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all ${
                  currentTab === "verify" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Direct Verification Portal</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">No Scanning</span>
              </button>

              <button
                onClick={() => handleNavClick("guide")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  currentTab === "guide" ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-4 w-4 text-slate-500" />
                  <span>Official IELTS Exam Format Guide</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>

            {/* Test Progress & Reset in drawer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">Your Exam Progress</span>
                <p className="text-[11px] text-slate-500">{completedCount} of {totalTests} tests completed ({percent}%)</p>
              </div>

              {completedCount > 0 && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onResetProgress();
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
