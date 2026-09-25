import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Database,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Play,
  Layers,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Copy,
  Check,
  Eye,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { parseIeltsTextFormat, ParsedTextTestResult } from "../utils/testTextParser";
import {
  uploadTestToDatabase,
  fetchDatabaseStatus,
  DatabaseStatus,
  deleteTestFromDatabase,
} from "../services/databaseService";
import { IeltsDatabase, FullIeltsTest } from "../types/ielts";

interface TestUploaderStudioProps {
  database: IeltsDatabase;
  fullTests: FullIeltsTest[];
  onRefreshDatabase: () => void;
  onTakeTest: (section: "reading" | "listening" | "writing" | "speaking" | "fulltests", testId: number) => void;
  onClose?: () => void;
}

const SAMPLE_READING_TEXT = `=== TEST META ===
title: Academic Reading: Marine Biogeochemistry & Coral Calcification
section: reading
difficulty: Official Cambridge Simulation

=== PASSAGE 1 ===
Coral reefs represent some of the most biodiverse and economically vital marine ecosystems on Earth. Calcifying organisms, primarily scleractinian corals and coralline algae, construct the physical framework of reefs through the deposition of calcium carbonate (CaCO3), predominantly in the polymorph of aragonite. The rate of calcification is intimately linked to the chemical equilibrium of seawater, particularly the saturation state of aragonite (Ωarag). Under pre-industrial atmospheric CO2 concentrations (approximately 280 ppm), tropical surface waters consistently maintained an aragonite saturation state exceeding 4.0, providing an optimal chemical environment for rapid accretion of biogenic structures.

However, the uptake of anthropogenic carbon dioxide by global oceans—a process known as ocean acidification—has fundamentally shifted marine carbonate chemistry. Dissolved CO2 reacts with water molecules to produce carbonic acid, which rapidly dissociates into hydrogen ions (H+) and bicarbonate ions (HCO3-). The excess hydrogen ions subsequently combine with free carbonate ions (CO32-), lowering carbonate ion concentration and significantly depressing aragonite saturation levels. Laboratory and field experiments demonstrate that when saturation values drop below 3.0, skeletal density declines, calcification rates decrease linearly, and structural vulnerability to storm surge and bioerosion escalates substantially.

=== QUESTIONS ===

[MCQ]
Q: Which polymorph of calcium carbonate is predominantly deposited by scleractinian corals?
A) Calcite
B) Aragonite
C) Dolomite
D) Siderite
ANS: B
EXPLANATION: Paragraph 1 specifies calcium carbonate is deposited predominantly in the polymorph of aragonite.

[TFNG]
Q: Pre-industrial seawater typically maintained an aragonite saturation state under 2.5.
ANS: FALSE
EXPLANATION: Paragraph 1 states pre-industrial surface waters maintained a saturation state exceeding 4.0.

[TFNG]
Q: Marine calcification rates accelerate when aragonite saturation drops beneath 3.0.
ANS: FALSE
EXPLANATION: Paragraph 2 states calcification rates decrease linearly when saturation drops below 3.0.

[BLANKS]
Q: Dissolved ocean carbon dioxide reacts with water to form [carbonic acid].
ANS: carbonic acid

[MCQ]
Q: What reaction causes the reduction of free carbonate ions in seawater?
A) Rapid evaporation of tropical lagoons
B) Excess hydrogen ions combining with free carbonate ions
C) Increased nitrogen deposition from rivers
D) Solar ultraviolet decomposition
ANS: B
EXPLANATION: Paragraph 2 notes excess hydrogen ions combine with carbonate ions, lowering their concentration.
`;

const SAMPLE_LISTENING_TEXT = `=== TEST META ===
title: Academic Listening: Campus Innovation Laboratory Registration
section: listening
difficulty: Standard Academic

=== PASSAGE 1 ===
Campus Student Innovation Hub Script:
Director: Good morning, welcome to the Engineering & Prototyping Laboratory. Are you registering for the additive manufacturing workshop?
Student: Yes, I am. My department advisor recommended I complete the laser cutting and 3D printing safety orientation.
Director: Excellent. The orientation sessions occur every Tuesday afternoon from 2:00 PM to 4:30 PM in Room 412 of the Maxwell Technology Centre. You will need your biometric campus access badge and non-conductive footwear.
Student: Understood. Is there any software license requirement before the practical workshop?
Director: Yes, all students must install the CAD Modeling Suite v5 on their university laptops and verify their credentials on the university portal prior to attendance.

=== QUESTIONS ===

[MCQ]
Q: What time does the laboratory orientation session take place on Tuesday?
A) 9:00 AM to 11:30 AM
B) 2:00 PM to 4:30 PM
C) 1:00 PM to 3:00 PM
D) 5:00 PM to 7:00 PM
ANS: B

[TFNG]
Q: Students are allowed to attend the workshop in standard athletic sandals.
ANS: FALSE
EXPLANATION: The director specified non-conductive footwear is required.

[BLANKS]
Q: Students are instructed to complete software installation of the [CAD Modeling Suite] before practical sessions.
ANS: CAD Modeling Suite
`;

export const TestUploaderStudio: React.FC<TestUploaderStudioProps> = ({
  database,
  fullTests,
  onRefreshDatabase,
  onTakeTest,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "builder" | "browser" | "docs">("text");
  const [textPayload, setTextPayload] = useState<string>(SAMPLE_READING_TEXT);
  const [parsedPreview, setParsedPreview] = useState<ParsedTextTestResult | null>(null);
  const [createCompanionFullTest, setCreateCompanionFullTest] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string; testId?: number; section?: any } | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [browserSection, setBrowserSection] = useState<"reading" | "listening" | "writing" | "speaking" | "fulltests">("reading");

  // Form Builder States
  const [builderSection, setBuilderSection] = useState<"reading" | "listening" | "writing" | "speaking">("reading");
  const [builderTitle, setBuilderTitle] = useState<string>("Custom Academic Test");
  const [builderPassage, setBuilderPassage] = useState<string>("");
  const [builderQuestions, setBuilderQuestions] = useState<Array<{ q: string; type: "mcq" | "tfng" | "completion"; options: string[]; answer: any }>>([
    {
      q: "What is the primary thesis argued by the author?",
      type: "mcq",
      options: ["Key finding A", "Alternative interpretation B", "Historic overview C", "Scientific limitation D"],
      answer: 0,
    },
  ]);

  // Load database status
  const refreshStatus = async () => {
    const status = await fetchDatabaseStatus();
    setDbStatus(status);
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  // Update live preview whenever text changes
  useEffect(() => {
    if (!textPayload.trim()) {
      setParsedPreview(null);
      return;
    }
    const result = parseIeltsTextFormat(textPayload);
    if (result.success && result.data) {
      setParsedPreview(result.data);
    } else {
      setParsedPreview(null);
    }
  }, [textPayload]);

  const handleUploadText = async () => {
    if (!textPayload.trim()) return;
    setIsUploading(true);
    setUploadMessage(null);

    try {
      const res = await uploadTestToDatabase({
        format: "text",
        textPayload,
        createFullMock: createCompanionFullTest,
      });

      if (res.success && res.test) {
        setUploadMessage({
          type: "success",
          text: `Success! Test #${res.test.id} ("${res.test.title}") was written directly to /database/tests/ielts_database.json!`,
          testId: res.test.id,
          section: res.section || "reading",
        });
        onRefreshDatabase();
        refreshStatus();
      } else {
        setUploadMessage({
          type: "error",
          text: res.error || res.message || "Failed to upload test into database.",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadBuilder = async () => {
    setIsUploading(true);
    setUploadMessage(null);
    try {
      const res = await uploadTestToDatabase({
        format: "json",
        jsonPayload: {
          section: builderSection,
          title: builderTitle,
          passages: [builderPassage],
          questions: builderQuestions,
        },
        createFullMock: createCompanionFullTest,
      });

      if (res.success && res.test) {
        setUploadMessage({
          type: "success",
          text: `Success! Test #${res.test.id} created in database!`,
          testId: res.test.id,
          section: builderSection,
        });
        onRefreshDatabase();
        refreshStatus();
      } else {
        setUploadMessage({
          type: "error",
          text: res.error || "Failed to create test.",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteTest = async (section: string, id: number) => {
    if (!window.confirm(`Are you sure you want to permanently delete Test #${id} from the database?`)) return;
    const res = await deleteTestFromDatabase(section, id);
    if (res.success) {
      onRefreshDatabase();
      refreshStatus();
    } else {
      alert("Error deleting test: " + (res.error || "Unknown error"));
    }
  };

  const handleCopyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(true);
    setTimeout(() => setCopiedFormat(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="rounded-3xl border border-slate-700/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Decoupled Database Storage
                </span>
                <span className="text-[10px] text-slate-400">Target Folder: /database</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">Test Uploader & Database Studio</h2>
              <p className="text-xs text-slate-300">
                Upload new texts and questions in human-readable format. Tests are stored in the database and immediately live for candidates to take.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <a
              href="/api/database/export"
              download
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-slate-200 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-blue-400" />
              <span>Export Database (JSON)</span>
            </a>
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Database Metric Counters */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 border-t border-slate-800/80">
          <div className="rounded-xl border border-blue-900/40 bg-blue-950/40 p-3">
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Reading</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {dbStatus?.counts.reading || database.reading.length} Tests
            </div>
          </div>
          <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/40 p-3">
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold">
              <Headphones className="h-3.5 w-3.5" />
              <span>Listening</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {dbStatus?.counts.listening || database.listening.length} Tests
            </div>
          </div>
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/40 p-3">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <PenTool className="h-3.5 w-3.5" />
              <span>Writing</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {dbStatus?.counts.writing || database.writing.length} Tests
            </div>
          </div>
          <div className="rounded-xl border border-amber-900/40 bg-amber-950/40 p-3">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
              <Mic className="h-3.5 w-3.5" />
              <span>Speaking</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {dbStatus?.counts.speaking || database.speaking.length} Tests
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl border border-rose-900/40 bg-rose-950/40 p-3">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
              <Layers className="h-3.5 w-3.5" />
              <span>Full Mocks</span>
            </div>
            <div className="text-xl font-black text-white mt-1">
              {dbStatus?.counts.fullTests || fullTests.length} Exams
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
            activeTab === "text"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Upload Text in Format</span>
        </button>
        <button
          onClick={() => setActiveTab("builder")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
            activeTab === "builder"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Interactive Visual Builder</span>
        </button>
        <button
          onClick={() => setActiveTab("browser")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
            activeTab === "browser"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Database Browser & Manager</span>
        </button>
        <button
          onClick={() => setActiveTab("docs")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
            activeTab === "docs"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Format Specifications</span>
        </button>
      </div>

      {/* TAB 1: TEXT FORMAT UPLOADER */}
      {activeTab === "text" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Text Input Editor */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Paste Text in Specified Format</h3>
                  <p className="text-xs text-slate-500">Paste passages, prompts, and formatted questions below.</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTextPayload(SAMPLE_READING_TEXT)}
                    className="rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                  >
                    Load Reading Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextPayload(SAMPLE_LISTENING_TEXT)}
                    className="rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    Load Listening Sample
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyTemplate(textPayload)}
                    className="rounded-lg bg-slate-100 border border-slate-200 p-1 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                    title="Copy text"
                  >
                    {copiedFormat ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <textarea
                value={textPayload}
                onChange={e => setTextPayload(e.target.value)}
                placeholder="=== TEST META ===&#10;title: My Academic Test&#10;section: reading&#10;&#10;=== PASSAGE 1 ===&#10;Paste reading passage here...&#10;&#10;=== QUESTIONS ===&#10;[MCQ]&#10;Q: Question prompt?&#10;A) Choice 1&#10;B) Choice 2&#10;ANS: A"
                rows={18}
                className="w-full font-mono text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:border-blue-500 focus:bg-white focus:outline-hidden leading-relaxed shadow-inner"
              />

              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={createCompanionFullTest}
                    onChange={e => setCreateCompanionFullTest(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Automatically register companion Full 4-Skill Mock Exam in database</span>
                </label>

                <button
                  type="button"
                  disabled={isUploading || !parsedPreview}
                  onClick={handleUploadText}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-black text-white shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isUploading ? "Writing to Database..." : "Verify & Upload to Database"}</span>
                </button>
              </div>

              {uploadMessage && (
                <div
                  className={`mt-4 rounded-xl p-4 text-xs font-bold flex items-start gap-2.5 ${
                    uploadMessage.type === "success"
                      ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
                      : "bg-rose-50 border border-rose-300 text-rose-900"
                  }`}
                >
                  {uploadMessage.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p>{uploadMessage.text}</p>
                    {uploadMessage.type === "success" && uploadMessage.testId && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => onTakeTest(uploadMessage.section, uploadMessage.testId!)}
                          className="rounded-lg bg-emerald-700 text-white px-3 py-1 text-[11px] font-black hover:bg-emerald-800 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="h-3 w-3" />
                          <span>Take Uploaded Test Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Parser Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900">Live Format Parser</h3>
                </div>
                {parsedPreview ? (
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 border border-emerald-300">
                    Valid Schema
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5">
                    Waiting for text...
                  </span>
                )}
              </div>

              {parsedPreview ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title:</span>
                    <p className="font-black text-slate-900">{parsedPreview.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2">
                      <span className="text-[10px] text-slate-500 block">Section</span>
                      <span className="font-black text-blue-700 uppercase">{parsedPreview.section}</span>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2">
                      <span className="text-[10px] text-slate-500 block">Difficulty</span>
                      <span className="font-bold text-slate-800">{parsedPreview.difficulty}</span>
                    </div>
                  </div>

                  {parsedPreview.passages && parsedPreview.passages.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Passages ({parsedPreview.passages.length}):
                      </span>
                      <div className="mt-1 space-y-1.5">
                        {parsedPreview.passages.map((p, idx) => (
                          <div key={idx} className="rounded-lg bg-blue-50/60 border border-blue-100 p-2 text-[11px] text-slate-700">
                            <span className="font-bold text-blue-900">Passage {idx + 1}: </span>
                            {p.slice(0, 140)}...
                            <span className="text-[10px] text-blue-600 block mt-0.5 font-bold">
                              ({p.split(/\s+/).length} words)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsedPreview.questions && parsedPreview.questions.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Parsed Questions ({parsedPreview.questions.length}):
                      </span>
                      <div className="mt-1 max-h-56 overflow-y-auto space-y-1.5 pr-1">
                        {parsedPreview.questions.map((q, idx) => (
                          <div key={idx} className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-slate-800">Q{idx + 1}: {q.q}</span>
                              <span className="rounded bg-slate-200 text-slate-700 px-1 text-[9px] font-bold uppercase">
                                {q.type}
                              </span>
                            </div>
                            {q.options && (
                              <div className="mt-1 pl-2 text-[10px] text-slate-600 space-y-0.5">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className={q.answer === oIdx ? "font-bold text-emerald-700" : ""}>
                                    {String.fromCharCode(65 + oIdx)}) {opt} {q.answer === oIdx && "✓ (Key)"}
                                  </div>
                                ))}
                              </div>
                            )}
                            {q.type === "tfng" && (
                              <div className="mt-0.5 text-[10px] font-bold text-emerald-700">
                                Answer: {q.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Paste formatted text on the left to see the live parser in action.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE VISUAL BUILDER */}
      {activeTab === "builder" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900">Visual Test Builder</h3>
            <p className="text-xs text-slate-500">Construct an official test without formatting markup.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Section</label>
              <select
                value={builderSection}
                onChange={e => setBuilderSection(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="reading">Academic Reading</option>
                <option value="listening">Academic Listening</option>
                <option value="writing">Academic Writing</option>
                <option value="speaking">Academic Speaking</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Test Title</label>
              <input
                type="text"
                value={builderTitle}
                onChange={e => setBuilderTitle(e.target.value)}
                placeholder="e.g. Cognitive Ergonomics & Spatial Memory"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Passage Text or Script</label>
            <textarea
              rows={6}
              value={builderPassage}
              onChange={e => setBuilderPassage(e.target.value)}
              placeholder="Paste reading text or audio transcript here..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Questions Builder */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600">Questions</h4>
              <button
                type="button"
                onClick={() =>
                  setBuilderQuestions([
                    ...builderQuestions,
                    {
                      q: "New question prompt?",
                      type: "mcq",
                      options: ["Option A", "Option B", "Option C", "Option D"],
                      answer: 0,
                    },
                  ])
                }
                className="flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {builderQuestions.map((q, qIndex) => (
              <div key={qIndex} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-xs text-blue-900">Question {qIndex + 1}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={q.type}
                      onChange={e => {
                        const copy = [...builderQuestions];
                        copy[qIndex].type = e.target.value as any;
                        if (e.target.value === "tfng") copy[qIndex].answer = "TRUE";
                        else if (e.target.value === "mcq") copy[qIndex].answer = 0;
                        setBuilderQuestions(copy);
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-700"
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="tfng">True / False / Not Given</option>
                      <option value="completion">Fill in the Blanks</option>
                    </select>
                    {builderQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setBuilderQuestions(builderQuestions.filter((_, i) => i !== qIndex))}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  value={q.q}
                  onChange={e => {
                    const copy = [...builderQuestions];
                    copy[qIndex].q = e.target.value;
                    setBuilderQuestions(copy);
                  }}
                  placeholder="Enter question text..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium text-slate-900"
                />

                {q.type === "mcq" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`answer_${qIndex}`}
                          checked={q.answer === oIdx}
                          onChange={() => {
                            const copy = [...builderQuestions];
                            copy[qIndex].answer = oIdx;
                            setBuilderQuestions(copy);
                          }}
                          className="h-4 w-4 accent-blue-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={e => {
                            const copy = [...builderQuestions];
                            copy[qIndex].options[oIdx] = e.target.value;
                            setBuilderQuestions(copy);
                          }}
                          className="flex-1 rounded-lg border border-slate-300 bg-white p-1.5 text-xs text-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {q.type === "tfng" && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600">Correct Answer:</span>
                    {["TRUE", "FALSE", "NOT GIVEN"].map(ans => (
                      <label key={ans} className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name={`tfng_${qIndex}`}
                          checked={q.answer === ans}
                          onChange={() => {
                            const copy = [...builderQuestions];
                            copy[qIndex].answer = ans;
                            setBuilderQuestions(copy);
                          }}
                          className="accent-blue-600"
                        />
                        <span>{ans}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleUploadBuilder}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs font-black text-white shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              <span>Save Test to Database</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE BROWSER & MANAGER */}
      {activeTab === "browser" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Database Test Inventory</h3>
              <p className="text-xs text-slate-500">Live records from `/database/tests/`.</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(["reading", "listening", "writing", "speaking", "fulltests"] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setBrowserSection(sec)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition cursor-pointer ${
                    browserSection === sec
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {sec === "fulltests" ? "Full Mocks" : sec} (
                  {sec === "fulltests" ? fullTests.length : database[sec]?.length || 0})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {browserSection === "fulltests"
              ? fullTests.map(ft => (
                  <div
                    key={ft.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 hover:border-blue-400 hover:bg-white transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>Full Mock #{ft.id}</span>
                        <span className="rounded bg-blue-100 text-blue-800 px-1.5 py-0.5">{ft.difficulty}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900">{ft.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ft.subTitle}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">4 Skills • 2h 45m</span>
                      <button
                        onClick={() => onTakeTest("fulltests", ft.id)}
                        className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>Launch Simulation</span>
                      </button>
                    </div>
                  </div>
                ))
              : database[browserSection]?.map(t => (
                  <div
                    key={t.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 hover:border-blue-400 hover:bg-white transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>ID #{t.id}</span>
                        <span className="capitalize text-slate-600">{browserSection}</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900">{t.title}</h4>
                      {"passages" in t && t.passages && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.passages[0]}</p>
                      )}
                      {"parts" in t && t.parts && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.parts[0]?.script}</p>
                      )}
                      {"task2" in t && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.task2}</p>
                      )}
                      {"part2" in t && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.part2}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <button
                        onClick={() => onTakeTest(browserSection, t.id)}
                        className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>Take Test</span>
                      </button>

                      {t.id > 20 && (
                        <button
                          onClick={() => handleDeleteTest(browserSection, t.id)}
                          className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="Delete from database"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* TAB 4: FORMAT SPECIFICATIONS */}
      {activeTab === "docs" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Format Specification Guide</h3>
            <p className="text-xs text-slate-500">How to format text files for direct upload into the database.</p>
          </div>

          <div className="rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-200 space-y-2">
            <div className="text-emerald-400 font-bold"># Structure of an Upload Text File</div>
            <div>=== TEST META ===</div>
            <div className="text-slate-400 pl-4">title: Academic Reading: Deep-Sea Ecosystems</div>
            <div className="text-slate-400 pl-4">section: reading (or listening, writing, speaking)</div>
            <div className="text-slate-400 pl-4">difficulty: Official Cambridge Simulation</div>
            <br />
            <div>=== PASSAGE 1 ===</div>
            <div className="text-slate-400 pl-4">(Paste passage paragraphs here...)</div>
            <br />
            <div>=== QUESTIONS ===</div>
            <br />
            <div className="text-amber-300 pl-4">[MCQ]</div>
            <div className="text-slate-400 pl-4">Q: What is the main finding?</div>
            <div className="text-slate-400 pl-4">A) Option A</div>
            <div className="text-slate-400 pl-4">B) Option B</div>
            <div className="text-slate-400 pl-4">ANS: B</div>
            <br />
            <div className="text-amber-300 pl-4">[TFNG]</div>
            <div className="text-slate-400 pl-4">Q: The statement to evaluate against passage.</div>
            <div className="text-slate-400 pl-4">ANS: TRUE (or FALSE or NOT GIVEN)</div>
            <br />
            <div className="text-amber-300 pl-4">[BLANKS]</div>
            <div className="text-slate-400 pl-4">Q: Microorganisms produce [energy] via chemosynthesis.</div>
            <div className="text-slate-400 pl-4">ANS: energy</div>
          </div>
        </div>
      )}
    </div>
  );
};
