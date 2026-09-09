import React from "react";
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
  Search
} from "lucide-react";

export type NavTab = "dashboard" | TestSection | "guide" | "certificate" | "fulltests" | "verify";

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  completedCount: number;
  totalTests: number;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  completedCount,
  totalTests,
  onResetProgress,
}) => {
  const percent = Math.round((completedCount / totalTests) * 100) || 0;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Lingofi Brand */}
        <button
          onClick={() => onSelectTab("dashboard")}
          className="flex items-center gap-3 text-left transition-opacity hover:opacity-90 focus:outline-hidden cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002d62] font-black text-white shadow-sm text-lg tracking-tight">
            LF
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl">
                lingofi
              </span>
              <span className="rounded-md bg-red-600 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-white uppercase">
                Academic
              </span>
            </div>
            <span className="hidden text-[11px] text-slate-500 sm:block font-medium">
              Official IELTS Examination & TRF Certification
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onSelectTab("dashboard")}
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
            onClick={() => onSelectTab("fulltests")}
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
            onClick={() => onSelectTab("reading")}
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
            onClick={() => onSelectTab("listening")}
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
            onClick={() => onSelectTab("writing")}
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
            onClick={() => onSelectTab("speaking")}
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
            onClick={() => onSelectTab("certificate")}
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
            onClick={() => onSelectTab("verify")}
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

        {/* Progress pill & Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab("verify")}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-extrabold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Direct Verification
          </button>

          <button
            onClick={() => onSelectTab("certificate")}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/80 px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-100 transition shadow-2xs"
          >
            <FileCheck className="h-3.5 w-3.5" />
            Get TRF
          </button>

          {/* Completion Meter */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
            <div className="hidden sm:block text-right leading-tight">
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
            <button
              onClick={onResetProgress}
              title="Reset progress"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-200 px-3 py-2 gap-1.5 scrollbar-none">
        <button
          onClick={() => onSelectTab("dashboard")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "dashboard" ? "bg-[#002d62] text-white" : "text-slate-600"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Overview
        </button>
        <button
          onClick={() => onSelectTab("fulltests")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black ${
            currentTab === "fulltests" ? "bg-blue-900 text-white" : "bg-blue-50 text-blue-900"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Full Tests (20)
        </button>
        <button
          onClick={() => onSelectTab("reading")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "reading" ? "bg-[#002d62] text-white" : "text-slate-600"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Reading
        </button>
        <button
          onClick={() => onSelectTab("listening")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "listening" ? "bg-[#002d62] text-white" : "text-slate-600"
          }`}
        >
          <Headphones className="h-3.5 w-3.5" />
          Listening
        </button>
        <button
          onClick={() => onSelectTab("writing")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "writing" ? "bg-[#002d62] text-white" : "text-slate-600"
          }`}
        >
          <PenTool className="h-3.5 w-3.5" />
          Writing
        </button>
        <button
          onClick={() => onSelectTab("speaking")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
            currentTab === "speaking" ? "bg-[#002d62] text-white" : "text-slate-600"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
          Speaking
        </button>
        <button
          onClick={() => onSelectTab("certificate")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black ${
            currentTab === "certificate" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          TRF
        </button>
        <button
          onClick={() => onSelectTab("verify")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black ${
            currentTab === "verify" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Verify
        </button>
      </div>
    </header>
  );
};
