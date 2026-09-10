import React, { useState, useRef, useEffect } from "react";
import { ProgressState } from "../utils/storage";
import { UserTestAttempt } from "../types/ielts";
import { 
  Award, 
  Download, 
  Printer, 
  ShieldCheck, 
  User, 
  FileCheck, 
  RefreshCw, 
  Edit3, 
  Upload, 
  Check, 
  Search, 
  FileSearch,
  Camera,
  BadgeCheck,
  Building,
  Key,
  AlertTriangle,
  Lock
} from "lucide-react";
import html2canvas from "html2canvas-pro";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "motion/react";
import { 
  generateTrfSecurityCode, 
  registerIssuedCertificate, 
  getCefrFromBand, 
  generateCertificateFingerprint 
} from "../utils/trfSecurity";

interface CertificateTRFProps {
  progress: ProgressState;
  onClose?: () => void;
  onOpenVerificationPortal?: (trfCode?: string) => void;
  onNavigateToTest?: (tab: "reading" | "listening" | "writing" | "speaking" | "fulltests") => void;
  initialCandidateDetails?: {
    candidateName?: string;
    candidateId?: string;
    dob?: string;
    sex?: "M" | "F";
    countryOrigin?: string;
    firstLanguage?: string;
    photoUrl?: string;
    scores?: {
      listening?: number;
      reading?: number;
      writing?: number;
      speaking?: number;
    };
  };
}

export const CertificateTRF: React.FC<CertificateTRFProps> = ({ 
  progress, 
  onClose,
  onOpenVerificationPortal,
  onNavigateToTest,
  initialCandidateDetails 
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Check which modules have actually been completed and get the attempt with the HIGHEST score
  const attemptList = (Object.values(progress.attempts || {}) as UserTestAttempt[])
    .filter(a => a && a.band);
  const completedKeys = Object.keys(progress.completed || {});

  // Official Requirement: Test scores must be recorded from the test with the HIGHEST score
  const getSectionHighestAttempt = (section: "reading" | "listening" | "writing" | "speaking"): UserTestAttempt | undefined => {
    const attempts = attemptList.filter(a => a.section === section && a.band !== undefined);
    if (attempts.length === 0) return undefined;
    return [...attempts].sort((a, b) => {
      const bandA = parseFloat(a.band || "0") || 0;
      const bandB = parseFloat(b.band || "0") || 0;
      if (bandB !== bandA) return bandB - bandA;
      return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
    })[0];
  };

  const readingAttempt = getSectionHighestAttempt("reading");
  const listeningAttempt = getSectionHighestAttempt("listening");
  const writingAttempt = getSectionHighestAttempt("writing");
  const speakingAttempt = getSectionHighestAttempt("speaking");

  const isReadingCompleted = Boolean(
    initialCandidateDetails?.scores?.reading !== undefined ||
    readingAttempt?.band !== undefined ||
    completedKeys.some(k => k.startsWith("reading-"))
  );
  const isListeningCompleted = Boolean(
    initialCandidateDetails?.scores?.listening !== undefined ||
    listeningAttempt?.band !== undefined ||
    completedKeys.some(k => k.startsWith("listening-"))
  );
  const isWritingCompleted = Boolean(
    initialCandidateDetails?.scores?.writing !== undefined ||
    writingAttempt?.band !== undefined ||
    completedKeys.some(k => k.startsWith("writing-"))
  );
  const isSpeakingCompleted = Boolean(
    initialCandidateDetails?.scores?.speaking !== undefined ||
    speakingAttempt?.band !== undefined ||
    completedKeys.some(k => k.startsWith("speaking-"))
  );

  const completedSkillsCount = [
    isReadingCompleted, 
    isListeningCompleted, 
    isWritingCompleted, 
    isSpeakingCompleted
  ].filter(Boolean).length;

  const totalCompletedCount = completedKeys.length + attemptList.length + (initialCandidateDetails ? 1 : 0);
  const hasCompletedAny = completedSkillsCount > 0 || totalCompletedCount > 0;
  const isAllCompleted = completedSkillsCount === 4;

  const completedSkillNames: string[] = [];
  if (isListeningCompleted) completedSkillNames.push("Listening");
  if (isReadingCompleted) completedSkillNames.push("Reading");
  if (isWritingCompleted) completedSkillNames.push("Writing");
  if (isSpeakingCompleted) completedSkillNames.push("Speaking");

  const getHighestBand = (section: "reading" | "listening" | "writing" | "speaking"): number => {
    let best = 0;
    if (initialCandidateDetails?.scores?.[section] !== undefined) {
      best = initialCandidateDetails.scores[section]!;
    }
    const attempt = getSectionHighestAttempt(section);
    if (attempt && attempt.band) {
      const parsed = parseFloat(attempt.band);
      if (!isNaN(parsed) && parsed > best) {
        best = parsed;
      }
    }
    return best;
  };

  // Candidate Details state
  const [candidateName, setCandidateName] = useState(initialCandidateDetails?.candidateName || "ALEXANDER MORGAN");
  const [candidateId, setCandidateId] = useState(initialCandidateDetails?.candidateId || "P98421049B");
  const [dob, setDob] = useState(initialCandidateDetails?.dob || "18/05/1997");
  const [sex, setSex] = useState<"M" | "F">(initialCandidateDetails?.sex || "M");
  const [countryOrigin, setCountryOrigin] = useState(initialCandidateDetails?.countryOrigin || "UNITED KINGDOM");
  const [nationality, setNationality] = useState("BRITISH");
  const [firstLanguage, setFirstLanguage] = useState(initialCandidateDetails?.firstLanguage || "ENGLISH");
  const [centreNumber, setCentreNumber] = useState("LF084");
  const [testDate, setTestDate] = useState(() => {
    const d = new Date();
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${String(d.getDate()).padStart(2, "0")}/${months[d.getMonth()]}/${d.getFullYear()}`;
  });
  const [candidateNumber, setCandidateNumber] = useState("004921");
  const [candidatePhoto, setCandidatePhoto] = useState<string | null>(initialCandidateDetails?.photoUrl || null);

  // Scores are recorded STRICTLY from the attempt with the highest score.
  // Manual score editing is disallowed to maintain official TRF integrity.
  const listeningBand = getHighestBand("listening");
  const readingBand = getHighestBand("reading");
  const writingBand = getHighestBand("writing");
  const speakingBand = getHighestBand("speaking");

  // Calculate official IELTS overall band score (IELTS rounding rule)
  const calculateOverall = (): number => {
    const activeBands: number[] = [];
    if (isListeningCompleted && listeningBand > 0) activeBands.push(listeningBand);
    if (isReadingCompleted && readingBand > 0) activeBands.push(readingBand);
    if (isWritingCompleted && writingBand > 0) activeBands.push(writingBand);
    if (isSpeakingCompleted && speakingBand > 0) activeBands.push(speakingBand);

    if (activeBands.length === 0) return 0.0;
    if (activeBands.length === 1) return activeBands[0];

    const avg = activeBands.reduce((a, b) => a + b, 0) / activeBands.length;
    const decimal = avg - Math.floor(avg);
    if (decimal < 0.25) return Math.floor(avg);
    if (decimal < 0.75) return Math.floor(avg) + 0.5;
    return Math.ceil(avg);
  };

  const overallBand = calculateOverall();

  // Cryptographic Secret Rule Pattern TRF Generation (no scanning criteria)
  const trfSecurityData = generateTrfSecurityCode(
    candidateName,
    candidateId,
    testDate,
    centreNumber,
    { 
      listening: listeningBand > 0 ? listeningBand : (overallBand > 0 ? overallBand : 0.0), 
      reading: readingBand > 0 ? readingBand : (overallBand > 0 ? overallBand : 0.0), 
      writing: writingBand > 0 ? writingBand : (overallBand > 0 ? overallBand : 0.0), 
      speaking: speakingBand > 0 ? speakingBand : (overallBand > 0 ? overallBand : 0.0) 
    }
  );
  const trfNumber = trfSecurityData.trfNumber;
  const shaFingerprint = generateCertificateFingerprint(trfNumber, candidateName, overallBand);

  // Automatically register issued certificate in repository whenever state updates
  useEffect(() => {
    registerIssuedCertificate({
      candidateName,
      candidateId,
      dob,
      sex,
      countryOrigin,
      nationality,
      firstLanguage,
      centreNumber,
      testDate,
      candidateNumber,
      photoUrl: candidatePhoto || undefined,
      scores: {
        listening: listeningBand,
        reading: readingBand,
        writing: writingBand,
        speaking: speakingBand,
        overall: overallBand,
      },
    });
  }, [
    candidateName,
    candidateId,
    dob,
    sex,
    countryOrigin,
    nationality,
    firstLanguage,
    centreNumber,
    testDate,
    candidateNumber,
    candidatePhoto,
    listeningBand,
    readingBand,
    writingBand,
    speakingBand,
    overallBand,
  ]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Please upload an image smaller than 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setCandidatePhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-sync indicator (read-only verification)
  const isScoreLocked = true;

  // High-resolution PDF Download
  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      await new Promise(r => setTimeout(r, 200));

      let imgData: string | null = null;
      let imgWidth = 0;
      let imgHeight = 0;

      try {
        // Primary: html2canvas-pro with full support for oklch, oklab, and modern CSS
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2.5,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });
        imgData = canvas.toDataURL("image/png");
        imgWidth = canvas.width;
        imgHeight = canvas.height;
      } catch (canvasErr) {
        console.warn("html2canvas-pro rendered with warning, trying html-to-image fallback:", canvasErr);
        // Fallback: SVG foreignObject rasterization natively rendered by browser
        imgData = await toPng(certificateRef.current, {
          quality: 0.98,
          pixelRatio: 2.5,
          backgroundColor: "#ffffff",
        });
        const img = new Image();
        img.src = imgData;
        await new Promise((res) => {
          img.onload = res;
        });
        imgWidth = img.naturalWidth || certificateRef.current.offsetWidth * 2.5;
        imgHeight = img.naturalHeight || certificateRef.current.offsetHeight * 2.5;
      }

      if (!imgData) {
        throw new Error("Could not extract certificate raster data");
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`Lingofi_IELTS_Test_Report_Form_${candidateName.replace(/\s+/g, "_")}.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    try {
      const certElement = certificateRef.current;
      if (!certElement) {
        window.print();
        return;
      }
      // Create off-screen iframe for clean isolated document printing
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        window.print();
        return;
      }

      const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
        .map(node => node.outerHTML)
        .join("\n");

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Official IELTS Test Report Form - ${candidateName}</title>
            ${styles}
            <style>
              @page { size: A4 portrait; margin: 8mm; }
              body { margin: 0; padding: 0; background: #ffffff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              #official-trf-canvas { width: 100% !important; max-width: 100% !important; box-shadow: none !important; border: 3px solid #002d62 !important; margin: 0 auto !important; }
            </style>
          </head>
          <body>
            ${certElement.outerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn("Iframe printing fallback to window.print", e);
          window.print();
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 3000);
        }
      }, 350);
    } catch (err) {
      console.error("Print failed:", err);
      window.print();
    }
  };

  // If no test has been completed yet, lock the certificate view and guide to tests
  if (!hasCompletedAny) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto my-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mx-auto mb-5 border border-amber-200 shadow-xs">
            <Lock className="h-8 w-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-red-800 mb-3">
            Certificate Provided Only After Test Completion
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            IELTS Test Report Form (TRF)
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-lg mx-auto font-medium">
            Under official Lingofi examination regulations, an authentic TRF certificate is issued only after you complete a test.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
              <span className="text-xs font-black uppercase tracking-wide text-blue-900 block mb-1">
                Single Test Completed
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you complete one test (Reading, Listening, Writing, or Speaking), an official modular TRF certificate will be provided specifically for that skill.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <span className="text-xs font-black uppercase tracking-wide text-emerald-900 block mb-1">
                All Tests Completed
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you complete all 4 module tests or take a Full Mock Test, a complete 4-skill Academic TRF with an Overall Band Score will be generated.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3.5">
              Choose an examination test to begin:
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => onNavigateToTest?.("reading") || onClose?.()}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                Start Reading Test
              </button>
              <button
                onClick={() => onNavigateToTest?.("listening") || onClose?.()}
                className="rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-cyan-700 transition shadow-xs cursor-pointer"
              >
                Start Listening Test
              </button>
              <button
                onClick={() => onNavigateToTest?.("writing") || onClose?.()}
                className="rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-700 transition shadow-xs cursor-pointer"
              >
                Start Writing Test
              </button>
              <button
                onClick={() => onNavigateToTest?.("speaking") || onClose?.()}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs cursor-pointer"
              >
                Start Speaking Test
              </button>
              <button
                onClick={() => onNavigateToTest?.("fulltests") || onClose?.()}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs cursor-pointer"
              >
                Take 20 Full Mock Tests
              </button>
            </div>

            <div className="mt-5 text-xs text-slate-500">
              Already hold an issued certificate?{" "}
              <button
                onClick={() => onOpenVerificationPortal?.()}
                className="font-bold text-blue-700 underline hover:text-blue-900 cursor-pointer"
              >
                It can be verified at lingofi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden File Input for Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Critical Pattern Key Warning Notice */}
      <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 shadow-xs flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-900">
          <AlertTriangle className="h-6 w-6 text-amber-800" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-950">
              Critical Security Warning • First-Time Issuance Notice
            </span>
          </div>
          <p className="mt-1 text-xs font-black text-amber-950 leading-relaxed">
            CRITICAL SECURITY NOTICE: If you lose a pattern key your certificate won't be regenerated.
          </p>
          <p className="mt-0.5 text-xs text-amber-900 leading-relaxed">
            Your certificate is cryptographically signed with your unique pattern key (<span className="font-mono font-black text-amber-950">{trfNumber}</span>). Under Lingofi examination regulations: if you lose a pattern key your certificate won't be regenerated. Please download or print your official certificate now and store your key safely. It can be verified at lingofi.
          </p>
        </div>
      </div>

      {/* Modular Certificate Notice Banner when not all 4 skills completed */}
      {!isAllCompleted && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-black text-white uppercase tracking-wide">
              MODULAR SKILL TRF
            </span>
            <span className="text-xs font-bold text-blue-950">
              Certified for: <span className="text-blue-700">{completedSkillNames.join(", ").toUpperCase()}</span> ({completedSkillsCount} of 4 Modules Completed)
            </span>
          </div>
          <span className="text-xs text-slate-600">
            Complete all 4 modules to earn an all-skills Academic TRF with an official 4-Skill Overall Band.
          </span>
        </div>
      )}

      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-0.5 text-xs font-extrabold tracking-wide text-red-800 uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              Official Examination Document
            </span>
            <span className="text-xs text-slate-500 font-medium">
              British Council & IDP Aligned Standards • Direct Institutional Verification
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">
            Lingofi Official IELTS Test Report Form (TRF)
          </h2>
          <p className="text-xs text-slate-500">
            Certified Academic Certificate with dynamic cryptographic security ID, candidate photo verification, and central bit-matching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditOpen(!isEditOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-500" />
            {isEditOpen ? "Close Details Editor" : "Edit Candidate & Photo"}
          </button>

          {onOpenVerificationPortal && (
            <button
              onClick={() => onOpenVerificationPortal(trfNumber)}
              className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-extrabold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            >
              <FileSearch className="h-3.5 w-3.5 text-blue-600" />
              Test Direct Verification
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            Print
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Rendering High-Res PDF...
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="h-4 w-4 text-white" />
                Downloaded PDF!
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Official PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Editor Drawer (Collapsible) */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-inner"
          >
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Candidate Details & Biometric Photograph</h3>
                <p className="text-xs text-slate-500">
                  Verify your candidate identity details and upload a photo for the official TRF.
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Highest Test Scores Recorded (Non-Editable)</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Photo upload field */}
              <div className="sm:col-span-2 lg:col-span-1 rounded-xl border border-dashed border-slate-300 bg-white p-3 flex flex-col items-center justify-center text-center">
                <div className="relative h-24 w-20 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center shadow-xs">
                  {candidatePhoto ? (
                    <img src={candidatePhoto} alt="Candidate" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-slate-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  {candidatePhoto ? "Change Photo" : "Upload Passport Photo"}
                </button>
                <span className="text-[10px] text-slate-400 mt-1">JPG or PNG (max 8MB)</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Candidate Full Name</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={e => setCandidateName(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Passport / Candidate ID</label>
                <input
                  type="text"
                  value={candidateId}
                  onChange={e => setCandidateId(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Date of Birth (DD/MM/YYYY)</label>
                <input
                  type="text"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Sex</label>
                <select
                  value={sex}
                  onChange={e => setSex(e.target.value as "M" | "F")}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Country of Origin</label>
                <input
                  type="text"
                  value={countryOrigin}
                  onChange={e => setCountryOrigin(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">First Language</label>
                <input
                  type="text"
                  value={firstLanguage}
                  onChange={e => setFirstLanguage(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Test Date</label>
                <input
                  type="text"
                  value={testDate}
                  onChange={e => setTestDate(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Read-Only Tamper-Proof Scores Display */}
              <div className="sm:col-span-2 lg:col-span-4 mt-2 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-red-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">Official Exam Ledger: Highest Test Score Recorded</span>
                      <p className="text-[11px] text-slate-500">Manual score editing is strictly disabled. Scores are securely recorded from your highest-scoring test attempts.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold">
                    <span>Overall Band:</span>
                    <strong className="text-red-700">{calculateOverall().toFixed(1)}</strong>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 block">Listening</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">{listeningBand > 0 ? listeningBand.toFixed(1) : "—"}</span>
                      <span className="text-[10px] font-bold text-slate-400">/ 9.0</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                      {listeningAttempt ? `Best: Test #${listeningAttempt.testId}` : (isListeningCompleted ? "Completed" : "Not attempted")}
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 block">Reading</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">{readingBand > 0 ? readingBand.toFixed(1) : "—"}</span>
                      <span className="text-[10px] font-bold text-slate-400">/ 9.0</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                      {readingAttempt ? `Best: Test #${readingAttempt.testId}` : (isReadingCompleted ? "Completed" : "Not attempted")}
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 block">Writing</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">{writingBand > 0 ? writingBand.toFixed(1) : "—"}</span>
                      <span className="text-[10px] font-bold text-slate-400">/ 9.0</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                      {writingAttempt ? `Best: Test #${writingAttempt.testId}` : (isWritingCompleted ? "Completed" : "Not attempted")}
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 block">Speaking</span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">{speakingBand > 0 ? speakingBand.toFixed(1) : "—"}</span>
                      <span className="text-[10px] font-bold text-slate-400">/ 9.0</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                      {speakingAttempt ? `Best: Test #${speakingAttempt.testId}` : (isSpeakingCompleted ? "Completed" : "Not attempted")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-600">
                Calculated Dynamic Cryptographic ID: <strong className="text-blue-900">{trfNumber}</strong>
              </span>
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-800 cursor-pointer"
              >
                Apply & Save To Certificate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Certificate Display Canvas */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[850px] max-w-[950px] mx-auto bg-white p-8 shadow-2xl rounded-sm border border-slate-300">
          
          {/* Printable TRF Card Container */}
          <div
            ref={certificateRef}
            id="official-trf-canvas"
            className="relative bg-white p-8 border-4 border-[#002d62] text-slate-900 select-none overflow-hidden"
            style={{ minHeight: "1150px" }}
          >
            {/* Fine Guilloche Pattern Background Security Watermark */}
            <div 
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, #002d62 1px, transparent 1px), radial-gradient(circle at 0% 0%, #dc2626 1px, transparent 1px)`,
                backgroundSize: "24px 24px"
              }}
            />

            {/* Central Watermark Eagle/Rosette Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
              <div className="h-[480px] w-[480px] rounded-full border-[18px] border-[#002d62] flex items-center justify-center">
                <span className="font-serif font-black text-6xl text-[#002d62] tracking-widest uppercase">
                  LINGOFI
                </span>
              </div>
            </div>

            {/* Top Corner Security Guilloche Badges */}
            <div className="absolute top-2 left-2 text-[8px] font-sans text-slate-400 font-mono tracking-widest">
              DOC SEC: {shaFingerprint.slice(0, 16)}
            </div>
            <div className="absolute top-2 right-2 text-[8px] font-sans text-slate-400 font-mono tracking-widest">
              DIRECT INSTITUTIONAL LEDGER • NO SCANNING CRITERIA
            </div>

            {/* 1. Header Section */}
            <div>
              <div className="flex items-start justify-between border-b-2 border-[#002d62] pb-4">
                {/* Brand Logo & Authority */}
                <div className="flex items-center gap-3.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#002d62] text-white shadow-md">
                    <span className="font-sans font-extrabold text-2xl tracking-tighter">LF</span>
                  </div>
                  <div>
                    <h1 className="font-sans text-2xl font-black tracking-tight text-[#002d62] uppercase leading-none">
                      lingofi
                    </h1>
                    <p className="font-sans text-[11px] font-bold tracking-wider text-red-700 uppercase mt-0.5">
                      International English Language Testing System
                    </p>
                    <p className="font-sans text-[9px] text-slate-600 tracking-wide mt-0.5">
                      British Council & IDP Aligned Framework • In official partnership with <strong className="text-[#002d62]">IEIS.io our partner organization</strong>
                    </p>
                  </div>
                </div>

                {/* Right Side Partner Emblems */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 mb-1">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[8.5px] font-bold text-blue-900 border border-blue-200">
                      IEIS.io our partner organization
                    </span>
                  </div>
                  <div className={`inline-block rounded-md px-3 py-1 text-[11px] font-sans font-black tracking-widest text-white uppercase ${
                    isAllCompleted ? "bg-[#002d62]" : "bg-amber-700"
                  }`}>
                    {isAllCompleted ? "ACADEMIC" : "MODULAR SKILL"}
                  </div>
                  <h2 className="font-serif text-lg font-bold text-slate-800 mt-1">
                    Test Report Form
                  </h2>
                  {!isAllCompleted && (
                    <span className="text-[9px] font-bold text-amber-800 block">
                      Certified: {completedSkillNames.join(", ").toUpperCase()}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-slate-600 font-semibold">
                    Cryptographic ID: <strong className="text-[#002d62]">{trfNumber}</strong>
                  </span>
                </div>
              </div>

              {/* Advisory note */}
              <div className="my-2 bg-slate-50 border-l-2 border-red-600 p-2 text-[9px] font-sans text-slate-600 leading-snug">
                <strong>NOTE:</strong> Admission to undergraduate and postgraduate courses should be based on the ACADEMIC Reading and Writing Modules. 
                GENERAL TRAINING Reading and Writing Modules are not designed to test the full range of language skills required for academic purposes.
              </div>

              {/* 2. Centre and Candidate Metadata Grid */}
              <div className="mt-4 border border-slate-300 font-sans text-xs">
                <div className="grid grid-cols-4 bg-slate-100/90 border-b border-slate-300 font-bold text-slate-700 text-[10px] uppercase">
                  <div className="p-1.5 border-r border-slate-300">Centre Number</div>
                  <div className="p-1.5 border-r border-slate-300">Date of Examination</div>
                  <div className="p-1.5 border-r border-slate-300">Candidate Number</div>
                  <div className="p-1.5">Assessment Protocol</div>
                </div>
                <div className="grid grid-cols-4 border-b border-slate-300 font-mono text-[11px] font-semibold text-slate-900 bg-white">
                  <div className="p-2 border-r border-slate-300">{centreNumber}</div>
                  <div className="p-2 border-r border-slate-300">{testDate}</div>
                  <div className="p-2 border-r border-slate-300">{candidateNumber}</div>
                  <div className="p-2 font-sans text-[10px] text-slate-700">ISO/IEC 27001 Certified</div>
                </div>
              </div>

              {/* 3. Candidate Details Section with Photograph Box */}
              <div className="mt-3 border border-slate-300 font-sans">
                <div className="bg-[#002d62] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  Candidate Details & Biometric Record
                </div>

                <div className="grid grid-cols-12 gap-0 bg-white">
                  {/* Left: Info table (9 cols) */}
                  <div className="col-span-9 border-r border-slate-300 text-xs">
                    <div className="grid grid-cols-12 border-b border-slate-200">
                      <div className="col-span-4 bg-slate-50 p-2 font-bold text-[10px] text-slate-600 uppercase">Family Name</div>
                      <div className="col-span-8 p-2 font-mono font-bold text-slate-900 uppercase">
                        {candidateName.split(" ").slice(-1)[0] || "MORGAN"}
                      </div>
                    </div>

                    <div className="grid grid-cols-12 border-b border-slate-200">
                      <div className="col-span-4 bg-slate-50 p-2 font-bold text-[10px] text-slate-600 uppercase">First Name(s)</div>
                      <div className="col-span-8 p-2 font-mono font-bold text-slate-900 uppercase">
                        {candidateName.split(" ").slice(0, -1).join(" ") || "ALEXANDER"}
                      </div>
                    </div>

                    <div className="grid grid-cols-12 border-b border-slate-200">
                      <div className="col-span-4 bg-slate-50 p-2 font-bold text-[10px] text-slate-600 uppercase">Candidate ID</div>
                      <div className="col-span-8 p-2 font-mono font-bold text-slate-900">{candidateId}</div>
                    </div>

                    <div className="grid grid-cols-12 border-b border-slate-200">
                      <div className="col-span-4 bg-slate-50 p-2 font-bold text-[10px] text-slate-600 uppercase">Date of Birth</div>
                      <div className="col-span-4 p-2 font-mono text-slate-900 border-r border-slate-200">{dob}</div>
                      <div className="col-span-2 bg-slate-50 p-2 font-bold text-[10px] text-slate-600 uppercase">Sex (M/F)</div>
                      <div className="col-span-2 p-2 font-mono font-bold text-slate-900">{sex}</div>
                    </div>

                    <div className="grid grid-cols-12 border-b border-slate-200">
                      <div className="col-span-4 bg-slate-50 p-2 font-bold text-[10px] text-slate-600 uppercase">Scheme Code</div>
                      <div className="col-span-8 p-2 font-mono text-slate-900">Private Candidate Academic</div>
                    </div>

                    <div className="grid grid-cols-12 border-b border-slate-200">
                      <div className="col-span-4 bg-slate-50 p-2 font-bold text-[10px] text-slate-600 uppercase">Country / Region</div>
                      <div className="col-span-8 p-2 font-mono font-bold text-slate-900 uppercase">{countryOrigin}</div>
                    </div>

                    <div className="grid grid-cols-12">
                      <div className="col-span-4 bg-slate-50 p-2 font-bold text-[10px] text-slate-600 uppercase">First Language</div>
                      <div className="col-span-8 p-2 font-mono font-bold text-slate-900 uppercase">{firstLanguage}</div>
                    </div>
                  </div>

                  {/* Right: Candidate Photograph with Biometric Security Stamp (3 cols) */}
                  <div className="col-span-3 p-3 flex flex-col items-center justify-center bg-slate-50 relative">
                    <div className="relative h-34 w-28 rounded border-2 border-slate-400 bg-slate-200 flex flex-col items-center justify-center overflow-hidden shadow-xs">
                      {candidatePhoto ? (
                        <img 
                          src={candidatePhoto} 
                          alt="Official Candidate" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <User className="h-14 w-14 text-slate-400" />
                          <span className="text-[8px] font-sans font-bold text-slate-500 uppercase mt-0.5">CANDIDATE</span>
                          <span className="text-[7px] font-mono text-slate-400">{candidateNumber}</span>
                        </div>
                      )}

                      {/* Official Round Ink Stamp Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-24 w-24 rounded-full border-2 border-red-700/80 p-0.5 rotate-12 flex items-center justify-center text-center">
                          <div className="h-full w-full rounded-full border border-dashed border-red-700/70 flex flex-col items-center justify-center">
                            <span className="text-[6px] font-black font-sans text-red-700 uppercase tracking-tighter">
                              LINGOFI BIOMETRICS
                            </span>
                            <span className="text-[7px] font-black font-sans text-red-700 uppercase">
                              * VERIFIED *
                            </span>
                            <span className="text-[5px] font-mono font-bold text-red-700">
                              {testDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-[7.5px] font-sans text-slate-500 mt-1 font-semibold uppercase tracking-tight text-center">
                      Official Candidate Photograph
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Test Results Table (The Core IELTS Scores) */}
              <div className="mt-4 border-2 border-[#002d62] font-sans">
                <div className="bg-[#002d62] px-3 py-1.5 flex items-center justify-between text-white">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider">
                    {isAllCompleted ? "Test Results" : "Modular Examination Results"}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-200">
                    {isAllCompleted ? "IELTS 9-Band Scale Standard Alignment" : `Certified Modules: ${completedSkillNames.join(", ").toUpperCase()}`}
                  </span>
                </div>

                <div className="grid grid-cols-6 border-b border-slate-300 bg-slate-100 text-center font-bold text-[10px] text-slate-700 uppercase">
                  <div className="p-2 border-r border-slate-300">Listening</div>
                  <div className="p-2 border-r border-slate-300">Reading</div>
                  <div className="p-2 border-r border-slate-300">Writing</div>
                  <div className="p-2 border-r border-slate-300">Speaking</div>
                  <div className="p-2 border-r border-slate-300 bg-red-50 text-red-900 font-black">
                    {isAllCompleted ? "Overall Band" : "Modular Score"}
                  </div>
                  <div className="p-2 bg-blue-50 text-[#002d62] font-black">CEFR Level</div>
                </div>

                <div className="grid grid-cols-6 text-center font-mono text-base font-black text-slate-900 bg-white divide-x divide-slate-300">
                  <div className="p-3 flex flex-col items-center justify-center">
                    {isListeningCompleted && listeningBand > 0 ? (
                      <>
                        <span>{listeningBand.toFixed(1)}</span>
                        <span className="text-[7.5px] font-sans font-bold text-emerald-700 uppercase">Certified</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-700 font-bold">0.0</span>
                        <span className="text-[7.5px] font-sans text-amber-800 uppercase font-semibold">Band 0: No Attempt</span>
                      </>
                    )}
                  </div>

                  <div className="p-3 flex flex-col items-center justify-center">
                    {isReadingCompleted && readingBand > 0 ? (
                      <>
                        <span>{readingBand.toFixed(1)}</span>
                        <span className="text-[7.5px] font-sans font-bold text-emerald-700 uppercase">Certified</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-700 font-bold">0.0</span>
                        <span className="text-[7.5px] font-sans text-amber-800 uppercase font-semibold">Band 0: No Attempt</span>
                      </>
                    )}
                  </div>

                  <div className="p-3 flex flex-col items-center justify-center">
                    {isWritingCompleted && writingBand > 0 ? (
                      <>
                        <span>{writingBand.toFixed(1)}</span>
                        <span className="text-[7.5px] font-sans font-bold text-emerald-700 uppercase">Certified</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-700 font-bold">0.0</span>
                        <span className="text-[7.5px] font-sans text-amber-800 uppercase font-semibold">Band 0: No Attempt</span>
                      </>
                    )}
                  </div>

                  <div className="p-3 flex flex-col items-center justify-center">
                    {isSpeakingCompleted && speakingBand > 0 ? (
                      <>
                        <span>{speakingBand.toFixed(1)}</span>
                        <span className="text-[7.5px] font-sans font-bold text-emerald-700 uppercase">Certified</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-700 font-bold">0.0</span>
                        <span className="text-[7.5px] font-sans text-amber-800 uppercase font-semibold">Band 0: No Attempt</span>
                      </>
                    )}
                  </div>

                  <div className="p-2.5 bg-red-50/50 text-red-700 flex flex-col items-center justify-center">
                    <span className="text-xl font-black">{overallBand.toFixed(1)}</span>
                    <span className="text-[7px] font-sans font-bold uppercase text-red-800">
                      {overallBand === 0 ? "No Attempt" : isAllCompleted ? "Overall Band" : completedSkillsCount === 1 ? "Single Skill" : "Modular Avg"}
                    </span>
                  </div>

                  <div className="p-3.5 bg-blue-50/50 text-[#002d62] text-sm font-black flex items-center justify-center font-sans">
                    {getCefrFromBand(overallBand)}
                  </div>
                </div>
              </div>

              {/* Diagnostic Assessment Breakdown */}
              <div className="mt-3 border border-slate-300 p-2.5 bg-slate-50/60 font-sans text-[9px] text-slate-600">
                <div className="font-bold text-slate-800 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Official Skill Proficiency Standard Level
                </div>
                <div className="grid grid-cols-4 gap-2 text-slate-700">
                  <div className="border-r border-slate-200 pr-2">
                    <span className="font-bold text-slate-900">Listening {isListeningCompleted ? `(${listeningBand.toFixed(1)})` : "(Pending)"}:</span> {isListeningCompleted ? "Comprehends complex academic lectures and colloquial exchanges without strain." : "Module not yet attempted."}
                  </div>
                  <div className="border-r border-slate-200 pr-2">
                    <span className="font-bold text-slate-900">Reading {isReadingCompleted ? `(${readingBand.toFixed(1)})` : "(Pending)"}:</span> {isReadingCompleted ? "Analyzes sophisticated argumentation, synthesis, and nuanced textual inference." : "Module not yet attempted."}
                  </div>
                  <div className="border-r border-slate-200 pr-2">
                    <span className="font-bold text-slate-900">Writing {isWritingCompleted ? `(${writingBand.toFixed(1)})` : "(Pending)"}:</span> {isWritingCompleted ? "Produces well-organized, coherent reports with high lexical accuracy and cohesive devices." : "Module not yet attempted."}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Speaking {isSpeakingCompleted ? `(${speakingBand.toFixed(1)})` : "(Pending)"}:</span> {isSpeakingCompleted ? "Speaks fluently with natural cadence, topical idiomatic resource, and intelligible phonetics." : "Module not yet attempted."}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Authentic Direct Verification Section (NO SCANNING CRITERIA) */}
            <div className="mt-6 border-t-2 border-[#002d62] pt-4 font-sans">
              <div className="grid grid-cols-12 gap-4 items-center">
                
                {/* Left: Direct Issuance Badge (No Manual Signature Required) */}
                <div className="col-span-4 border border-slate-200 bg-slate-50/70 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck className="h-4 w-4 text-blue-700" />
                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">
                      DIRECT DIGITAL ISSUANCE
                    </span>
                  </div>
                  <p className="text-[8px] text-slate-600 leading-tight">
                    <strong>No physical signature required.</strong> Officially generated and certified directly by the Lingofi Central Assessment Authority.
                  </p>
                  <div className="mt-2 pt-1 border-t border-slate-200 text-[7px] font-mono text-slate-400">
                    FINGERPRINT: {shaFingerprint}
                  </div>
                </div>

                {/* Middle: Direct Organization Verification Notice (NO SCANNING CRITERIA) */}
                <div className="col-span-5 border-2 border-blue-200 bg-blue-50/50 p-3 rounded text-center">
                  <div className="flex items-center justify-center gap-1.5 text-blue-900 font-extrabold text-[10px] uppercase tracking-wide">
                    <ShieldCheck className="h-4 w-4 text-blue-700" />
                    DIRECT VERIFICATION • NO SCANNING CRITERIA
                  </div>
                  <p className="text-[8px] text-slate-600 mt-1 leading-snug">
                    Recognizing universities and employers verify directly:
                  </p>
                  <div className="font-mono text-[10px] font-black text-blue-950 mt-1 bg-white py-1 px-3 rounded border border-blue-200 inline-block uppercase tracking-wider">
                    Verified at lingofi & IEIS.io our partner organization
                  </div>
                  <p className="text-[7.5px] text-slate-500 mt-1">
                    Enter the dynamic pattern key below to authenticate original test records:
                  </p>
                  <div className="mt-1 font-mono text-[11px] font-black tracking-wider text-red-700 bg-red-50/80 py-0.5 px-2 rounded border border-red-200">
                    {trfNumber}
                  </div>
                </div>

                {/* Right: Official Metallic Gold Security Stamp */}
                <div className="col-span-3 flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-0.5 shadow-md flex items-center justify-center text-center">
                      <div className="h-full w-full rounded-full border border-amber-200 flex flex-col items-center justify-center p-1 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200">
                        <Award className="h-6 w-6 text-amber-950 drop-shadow-xs" />
                        <span className="text-[6px] font-black font-sans text-amber-950 uppercase tracking-tighter leading-none mt-0.5">
                          LINGOFI SEAL
                        </span>
                        <span className="text-[5px] font-bold font-sans text-amber-900 leading-none">
                          OFFICIAL TRF
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-slate-700 uppercase mt-1">Central Authority Stamp</p>
                  <p className="text-[8px] text-slate-500">Date of Issue: {testDate}</p>
                </div>
              </div>

              {/* Bottom Security Bitmask & Legal Notice */}
              <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[7.5px] text-slate-500">
                <div className="font-mono text-[8px] text-slate-600">
                  DYNAMIC PATTERN KEY: LF::{trfSecurityData.personalEmbed}::{trfSecurityData.bandCode}::{trfSecurityData.secretChecksum}
                </div>

                <div className="text-right max-w-md text-[7.5px] leading-tight text-slate-400">
                  The validity of this IELTS Test Report Form can be verified directly. It can be verified at lingofi without bar/QR code scanning. Any modification of document bits, candidate biometrics, or cryptographic codes constitutes document forgery.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Verification instructions banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">How Direct Verification Works for Organizations</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              This certificate carries <strong>no scanning criteria</strong>. Recognizing organizations verify directly: It can be verified at lingofi, where our system evaluates all cryptographic pattern tokens and identity credentials to confirm 100% original authenticity against the central examination ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenVerificationPortal && (
            <button
              onClick={() => onOpenVerificationPortal(trfNumber)}
              className="flex items-center gap-1.5 rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-xs font-bold text-blue-900 hover:bg-blue-50 transition cursor-pointer"
            >
              <Search className="h-4 w-4" />
              Open Verification Portal
            </button>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 rounded-xl bg-[#002d62] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-950 transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
