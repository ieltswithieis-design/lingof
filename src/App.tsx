import React, { useState, useEffect } from "react";
import { TestSection, IeltsDatabase, FullIeltsTest } from "./types/ielts";
import { ieltsDatabase } from "./data/ieltsData";
import { loadProgress, resetSectionProgress, ProgressState } from "./utils/storage";
import { Header, NavTab } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { SectionListView } from "./components/SectionListView";
import { ReadingRunner } from "./components/ReadingRunner";
import { ListeningRunner } from "./components/ListeningRunner";
import { WritingRunner } from "./components/WritingRunner";
import { SpeakingRunner } from "./components/SpeakingRunner";
import { FormatGuide } from "./components/FormatGuide";
import { CertificateTRF } from "./components/CertificateTRF";
import { FullTestListView } from "./components/FullTestListView";
import { FullTestRunner } from "./components/FullTestRunner";
import { CertificateVerificationPortal } from "./components/CertificateVerificationPortal";
import { BlogStoriesView } from "./components/BlogStoriesView";
import { IeltsVideoHub } from "./components/IeltsVideoHub";
import { fullIeltsTests } from "./data/fullTestsData";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [activeTest, setActiveTest] = useState<{ section: TestSection; id: number } | null>(null);
  const [activeFullTest, setActiveFullTest] = useState<FullIeltsTest | null>(null);
  const [verificationTrfCode, setVerificationTrfCode] = useState<string>("");
  const [progress, setProgress] = useState<ProgressState>({ completed: {}, attempts: {} });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const handleRefreshProgress = () => {
    setProgress(loadProgress());
  };

  const handleSelectTest = (section: TestSection, id: number) => {
    setActiveFullTest(null);
    setActiveTest({ section, id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectFullTest = (fullTest: FullIeltsTest) => {
    setActiveTest(null);
    setActiveFullTest(fullTest);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToCatalog = () => {
    setActiveTest(null);
    setActiveFullTest(null);
    handleRefreshProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenCertificate = () => {
    handleRefreshProgress();
    setActiveTest(null);
    setActiveFullTest(null);
    setCurrentTab("certificate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTestCompleteAndRedirectToTRF = () => {
    handleRefreshProgress();
    setActiveTest(null);
    setActiveFullTest(null);
    setCurrentTab("certificate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenVerificationPortal = (trfCode?: string | unknown) => {
    setActiveTest(null);
    setActiveFullTest(null);
    if (typeof trfCode === "string" && trfCode.trim()) {
      setVerificationTrfCode(trfCode.trim());
    } else {
      setVerificationTrfCode("");
    }
    setCurrentTab("verify");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetAllProgress = () => {
    if (window.confirm("Are you sure you want to reset all your completed test history and scores?")) {
      localStorage.removeItem("ielts_mastery_progress_v2");
      setProgress({ completed: {}, attempts: {} });
    }
  };

  const handleNavigateFromContent = (section: TestSection | "fulltests", testId: number) => {
    if (section === "fulltests") {
      const ft = fullIeltsTests.find(t => t.id === testId) || fullIeltsTests[0];
      handleSelectFullTest(ft);
    } else {
      handleSelectTest(section, testId);
    }
  };

  const completedCount = Object.keys(progress.completed).length;

  const canGoBack = Boolean(activeTest || activeFullTest || currentTab !== "dashboard");
  const handleUniversalBack = () => {
    if (activeTest || activeFullTest) {
      handleBackToCatalog();
    } else {
      setCurrentTab("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Keyboard shortcut: Press Escape to trigger Universal Back on PC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (e.key === "Escape" && canGoBack && !isInput) {
        handleUniversalBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoBack, activeTest, activeFullTest, currentTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        currentTab={activeFullTest ? "fulltests" : activeTest ? activeTest.section : currentTab}
        onSelectTab={tab => {
          setActiveTest(null);
          setActiveFullTest(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        completedCount={completedCount}
        totalTests={80}
        onResetProgress={handleResetAllProgress}
        canGoBack={canGoBack}
        onBack={handleUniversalBack}
      />

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-6 sm:py-6">
        {/* Dedicated Mobile Back Button Bar when in Test Mode */}
        {(activeTest || activeFullTest) && (
          <div className="sm:hidden mb-3 flex items-center justify-between rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 shadow-xs">
            <button
              onClick={handleBackToCatalog}
              className="flex items-center gap-2 text-xs font-black text-blue-900 active:scale-95 transition cursor-pointer"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black shadow-xs">
                ←
              </span>
              <span>Back to Practice Hub</span>
            </button>
            <span className="rounded-md bg-white border border-blue-200/80 px-2 py-0.5 text-[10px] font-black text-blue-800">
              {activeFullTest ? "Full Mock" : `${activeTest?.section.toUpperCase()} #${activeTest?.id}`}
            </span>
          </div>
        )}
        {activeFullTest ? (
          // Full IELTS Simulation Runner (All 4 skills + certification)
          <FullTestRunner
            test={activeFullTest}
            database={ieltsDatabase}
            progress={progress}
            onBack={handleBackToCatalog}
            onComplete={handleRefreshProgress}
            onOpenCertificate={handleTestCompleteAndRedirectToTRF}
            onOpenVerificationPortal={handleOpenVerificationPortal}
          />
        ) : activeTest ? (
          // Single Section Runner View
          <div>
            {activeTest.section === "reading" && (
              <ReadingRunner
                test={ieltsDatabase.reading.find(t => t.id === activeTest.id) || ieltsDatabase.reading[0]}
                onBack={handleBackToCatalog}
                onComplete={handleTestCompleteAndRedirectToTRF}
              />
            )}

            {activeTest.section === "listening" && (
              <ListeningRunner
                test={ieltsDatabase.listening.find(t => t.id === activeTest.id) || ieltsDatabase.listening[0]}
                onBack={handleBackToCatalog}
                onComplete={handleTestCompleteAndRedirectToTRF}
              />
            )}

            {activeTest.section === "writing" && (
              <WritingRunner
                test={ieltsDatabase.writing.find(t => t.id === activeTest.id) || ieltsDatabase.writing[0]}
                onBack={handleBackToCatalog}
                onComplete={handleTestCompleteAndRedirectToTRF}
              />
            )}

            {activeTest.section === "speaking" && (
              <SpeakingRunner
                test={ieltsDatabase.speaking.find(t => t.id === activeTest.id) || ieltsDatabase.speaking[0]}
                onBack={handleBackToCatalog}
                onComplete={handleTestCompleteAndRedirectToTRF}
                onOpenCertificate={handleTestCompleteAndRedirectToTRF}
              />
            )}
          </div>
        ) : (
          // Tabbed Views
          <div>
            {currentTab === "dashboard" && (
              <Dashboard
                database={ieltsDatabase}
                progress={progress}
                onSelectTest={handleSelectTest}
                onSelectSection={sec => {
                  setCurrentTab(sec);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenCertificate={handleOpenCertificate}
                onSelectFullTests={() => {
                  setCurrentTab("fulltests");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenVerificationPortal={handleOpenVerificationPortal}
                onOpenBlog={() => {
                  setCurrentTab("blog");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenVideos={() => {
                  setCurrentTab("videos");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentTab === "blog" && (
              <BlogStoriesView onNavigateToTest={handleNavigateFromContent} />
            )}

            {currentTab === "videos" && (
              <IeltsVideoHub onNavigateToTest={handleNavigateFromContent} />
            )}

            {currentTab === "fulltests" && (
              <FullTestListView
                progress={progress}
                onSelectFullTest={handleSelectFullTest}
                onOpenCertificate={handleOpenCertificate}
              />
            )}

            {(currentTab === "reading" ||
              currentTab === "listening" ||
              currentTab === "writing" ||
              currentTab === "speaking") && (
              <SectionListView
                section={currentTab}
                database={ieltsDatabase}
                progress={progress}
                onSelectTest={handleSelectTest}
              />
            )}

            {currentTab === "guide" && <FormatGuide />}

            {currentTab === "certificate" && (
              <CertificateTRF
                progress={progress}
                onClose={() => {
                  setCurrentTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onOpenVerificationPortal={handleOpenVerificationPortal}
                onNavigateToTest={sec => {
                  setCurrentTab(sec);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {currentTab === "verify" && (
              <CertificateVerificationPortal
                initialTrfCode={verificationTrfCode}
                onBackToApp={() => {
                  setCurrentTab("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onViewCertificate={() => {
                  setCurrentTab("certificate");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold text-slate-700">
            <button onClick={() => { setCurrentTab("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-blue-900 cursor-pointer">Overview</button>
            <button onClick={() => { setCurrentTab("fulltests"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-blue-900 cursor-pointer">20 Full Mocks</button>
            <button onClick={() => { setCurrentTab("reading"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-blue-900 cursor-pointer">Reading Bank (20)</button>
            <button onClick={() => { setCurrentTab("listening"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-blue-900 cursor-pointer">Listening Lab (20)</button>
            <button onClick={() => { setCurrentTab("writing"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-blue-900 cursor-pointer">Writing Grader (20)</button>
            <button onClick={() => { setCurrentTab("speaking"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-blue-900 cursor-pointer">Speaking Coach (20)</button>
            <button onClick={() => { setCurrentTab("blog"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-indigo-900 hover:underline cursor-pointer">Stories & Guides (110+)</button>
            <button onClick={() => { setCurrentTab("videos"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-red-600 hover:underline cursor-pointer">YouTube IELTS Trends Hub</button>
            <button onClick={() => { setCurrentTab("certificate"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-blue-900 cursor-pointer">TRF Certificate</button>
            <button onClick={() => { setCurrentTab("verify"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-emerald-700 hover:underline cursor-pointer">Direct Verification Portal</button>
            <button onClick={() => { setCurrentTab("guide"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-slate-900 cursor-pointer">Exam Format Guide</button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-bold text-slate-800">
                lingofi • Official IELTS Academic Testing & TRF Certification System
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                IEIS.io our partner organization
              </span>
            </div>
            <span>80 Practice Tests • 20 Full Mock Simulations • 110+ High-Engagement Stories • YouTube Search Trends</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
