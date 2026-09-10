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
          <div className="sm:hidden mb-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs">
            <button
              onClick={handleBackToCatalog}
              className="flex items-center gap-1.5 text-xs font-extrabold text-blue-700 active:scale-95 transition"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                ←
              </span>
              <span>Back to Practice Hub</span>
            </button>
            <span className="text-[11px] font-bold text-slate-400">
              {activeFullTest ? "Mock Simulation" : `${activeTest?.section} #${activeTest?.id}`}
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
            onOpenVerificationPortal={handleOpenVerificationPortal}
          />
        ) : activeTest ? (
          // Single Section Runner View
          <div>
            {activeTest.section === "reading" && (
              <ReadingRunner
                test={ieltsDatabase.reading.find(t => t.id === activeTest.id) || ieltsDatabase.reading[0]}
                onBack={handleBackToCatalog}
                onComplete={handleRefreshProgress}
              />
            )}

            {activeTest.section === "listening" && (
              <ListeningRunner
                test={ieltsDatabase.listening.find(t => t.id === activeTest.id) || ieltsDatabase.listening[0]}
                onBack={handleBackToCatalog}
                onComplete={handleRefreshProgress}
              />
            )}

            {activeTest.section === "writing" && (
              <WritingRunner
                test={ieltsDatabase.writing.find(t => t.id === activeTest.id) || ieltsDatabase.writing[0]}
                onBack={handleBackToCatalog}
                onComplete={handleRefreshProgress}
              />
            )}

            {activeTest.section === "speaking" && (
              <SpeakingRunner
                test={ieltsDatabase.speaking.find(t => t.id === activeTest.id) || ieltsDatabase.speaking[0]}
                onBack={handleBackToCatalog}
                onComplete={handleRefreshProgress}
                onOpenCertificate={handleOpenCertificate}
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
              />
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
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-bold text-slate-800">
              lingofi • Official IELTS Academic Testing & TRF Certification System
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              IEIS.io our partner organization
            </span>
          </div>
          <span>80 Standard Tests (20 Reading, 20 Listening, 20 Writing, 20 Speaking) • 20 Full 4-Skill Academic Simulations • Aligned with British Council & IDP standards</span>
        </div>
      </footer>
    </div>
  );
}
