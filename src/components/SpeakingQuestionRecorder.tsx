import React, { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Award,
  AudioLines
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface QuestionEvaluationResult {
  transcript: string;
  estimatedBand?: string;
  analysis?: any;
}

interface SpeakingQuestionRecorderProps {
  question: string;
  questionNumber: number;
  part: 1 | 3;
  partTitle: string;
  recommendedDuration: string;
  onEvaluated?: (result: QuestionEvaluationResult) => void;
}

export const SpeakingQuestionRecorder: React.FC<SpeakingQuestionRecorderProps> = ({
  question,
  questionNumber,
  part,
  partTitle,
  recommendedDuration,
  onEvaluated,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPermissionStatus, setAudioPermissionStatus] = useState<"granted" | "prompt" | "denied" | "unknown">("unknown");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Check microphone permissions on mount if API available
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "microphone" as any })
        .then(permissionStatus => {
          setAudioPermissionStatus(permissionStatus.state as any);
          permissionStatus.onchange = () => {
            setAudioPermissionStatus(permissionStatus.state as any);
          };
        })
        .catch(() => {});
    }
  }, []);

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      setElapsedSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  // Read question aloud with British accent TTS
  const handleReadQuestion = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = "en-GB";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  // Start recording answer
  const handleStartRecording = async () => {
    setAiError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioPermissionStatus("granted");
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      // Web Speech API for live transcription preview
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognizer = new SpeechRecognition();
          recognizer.continuous = true;
          recognizer.interimResults = true;
          recognizer.lang = "en-US";
          recognizer.onresult = (e: any) => {
            let liveText = "";
            for (let i = 0; i < e.results.length; i++) {
              liveText += e.results[i][0].transcript + " ";
            }
            setTranscript(liveText.trim());
          };
          recognizer.start();
          recognitionRef.current = recognizer;
        } catch (e) {
          console.warn("SpeechRecognition init warning:", e);
        }
      }
    } catch (err: any) {
      setAudioPermissionStatus("denied");
      setAiError(
        "Microphone permission was denied or is unavailable. Please enable microphone permissions in your browser or type your spoken response."
      );
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  // Reset recording
  const handleResetRecording = () => {
    if (isRecording) handleStopRecording();
    setRecordedAudioUrl(null);
    setRecordedAudioBlob(null);
    setTranscript("");
    setAiAnalysis(null);
    setElapsedSeconds(0);
    setAiError(null);
  };

  // Transcribe audio & evaluate with Gemini
  const handleTranscribeAndEvaluate = async () => {
    setIsLoadingAi(true);
    setAiError(null);
    setAiStatusMsg("Processing audio recording with AI Examiner...");

    try {
      let audioBase64 = "";
      let mimeType = "audio/webm";

      if (recordedAudioBlob) {
        setAiStatusMsg("Transcribing speech audio and evaluating IELTS Speaking criteria...");
        mimeType = recordedAudioBlob.type || "audio/webm";
        audioBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(recordedAudioBlob);
        });
      }

      const response = await fetch("/api/transcribe-and-evaluate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          question: `Part ${part} (${partTitle}): "${question}"`,
          browserTranscript: transcript,
          durationSeconds: elapsedSeconds,
          part,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze speech.");
      }

      const finalTranscript = data.transcript || transcript;
      if (finalTranscript) setTranscript(finalTranscript);
      setAiAnalysis(data.analysis);

      if (onEvaluated) {
        onEvaluated({
          transcript: finalTranscript,
          estimatedBand: data.analysis?.estimatedBand,
          analysis: data.analysis,
        });
      }
    } catch (err: any) {
      setAiError(err.message || "Failed to transcribe and evaluate speech.");
    } finally {
      setIsLoadingAi(false);
      setAiStatusMsg("");
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs transition-all hover:border-slate-300">
      {/* Question Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/70 rounded-t-xl border-b border-slate-200">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#002d62] text-xs font-black text-white shadow-2xs">
            {questionNumber}
          </span>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">{question}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-medium text-slate-500">
                Recommended: {recommendedDuration}
              </span>
              {aiAnalysis && (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Band {aiAnalysis.estimatedBand || "7.0"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={handleReadQuestion}
            title="Hear British Examiner speak question"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
          >
            <Volume2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Listen</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse recording lab" : "Expand recording lab"}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Voice Recording & Answer Lab */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 sm:p-5 space-y-4"
          >
            {/* Recording Controls & Waveform Bar */}
            <div className="rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-blue-50/20 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Status & Timer */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isRecording
                        ? "bg-red-600 text-white animate-pulse"
                        : recordedAudioUrl
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isRecording ? <Mic className="h-5 w-5" /> : <AudioLines className="h-5 w-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {isRecording
                          ? "Recording Answer..."
                          : recordedAudioUrl
                          ? "Answer Recorded"
                          : "Ready to Record"}
                      </span>
                      {isRecording && (
                        <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping" />
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      Duration: {formatSeconds(elapsedSeconds)}
                    </span>
                  </div>
                </div>

                {/* Animated Soundwave Visualizer */}
                {isRecording && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-white/80 rounded-lg border border-red-200 shadow-2xs">
                    {[16, 28, 42, 22, 35, 48, 20, 38, 26, 45, 18, 30].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [8, h, 10],
                        }}
                        transition={{
                          duration: 0.5 + (i % 3) * 0.1,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="w-1 rounded-full bg-red-500"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                )}

                {/* Recording Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white shadow-xs hover:bg-red-700 transition cursor-pointer"
                    >
                      <Mic className="h-4 w-4" />
                      {recordedAudioUrl ? "Record Again" : "Record Answer"}
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Pause className="h-4 w-4" />
                      Stop Recording
                    </button>
                  )}

                  {recordedAudioUrl && !isRecording && (
                    <button
                      onClick={handleResetRecording}
                      title="Clear and reset answer"
                      className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Audio Playback Player */}
              {recordedAudioUrl && !isRecording && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Audio Playback:
                    </span>
                    <audio
                      ref={audioPlayerRef}
                      src={recordedAudioUrl}
                      controls
                      className="h-8 max-w-xs sm:max-w-md"
                    />
                  </div>

                  {/* Evaluate Action Button */}
                  <button
                    onClick={handleTranscribeAndEvaluate}
                    disabled={isLoadingAi}
                    className="flex items-center gap-2 rounded-xl bg-[#002d62] px-4 py-2 text-xs font-extrabold text-white shadow-2xs hover:bg-blue-900 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isLoadingAi ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                        Transcribe & Evaluate Answer
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Status & Error Alerts */}
            {aiStatusMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600 shrink-0" />
                <span>{aiStatusMsg}</span>
              </div>
            )}

            {aiError && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Microphone / Speech Notice:</span>
                  <span>{aiError}</span>
                </div>
              </div>
            )}

            {/* Spoken Transcript Area */}
            {(transcript || isRecording) && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-slate-500" />
                    Spoken Transcript (Automatic Speech-to-Text):
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {transcript.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  value={transcript}
                  onChange={e => setTranscript(e.target.value)}
                  placeholder="Your recorded speech transcript will appear here automatically..."
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
                {!recordedAudioUrl && transcript && !isLoadingAi && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleTranscribeAndEvaluate}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700 transition cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3 text-yellow-400" />
                      Evaluate Written Transcript
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* AI Examiner Assessment Card */}
            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-700" />
                    <span className="text-xs font-extrabold text-emerald-900 uppercase">
                      Official IELTS Examiner Diagnostic
                    </span>
                  </div>
                  <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-black text-white">
                    Estimated Band {aiAnalysis.estimatedBand || "7.0"}
                  </span>
                </div>

                {/* 4 Assessment Descriptors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                      <span>Fluency & Coherence</span>
                      <span className="text-emerald-700 text-[11px]">
                        Band {aiAnalysis.fluencyScore?.band || "7.0"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {aiAnalysis.fluencyScore?.feedback}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                      <span>Lexical Resource</span>
                      <span className="text-emerald-700 text-[11px]">
                        Band {aiAnalysis.lexicalScore?.band || "7.0"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {aiAnalysis.lexicalScore?.feedback}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                      <span>Grammar & Accuracy</span>
                      <span className="text-emerald-700 text-[11px]">
                        Band {aiAnalysis.grammarScore?.band || "6.5"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {aiAnalysis.grammarScore?.feedback}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                      <span>Pronunciation & Rhythm</span>
                      <span className="text-emerald-700 text-[11px]">
                        Band {aiAnalysis.pronunciationScore?.band || "7.0"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {aiAnalysis.pronunciationScore?.feedback}
                    </p>
                  </div>
                </div>

                {/* Corrections & Suggestions */}
                {aiAnalysis.corrections && aiAnalysis.corrections.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                      Spoken Language Improvements:
                    </span>
                    {aiAnalysis.corrections.map((c: any, i: number) => (
                      <div key={i} className="rounded-md bg-white p-2 border border-slate-200 text-xs">
                        <span className="text-red-700 line-through mr-1 font-medium">{c.original}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-emerald-700 font-bold ml-1">{c.corrected}</span>
                        {c.explanation && (
                          <span className="block text-[10px] text-slate-500 italic mt-0.5">
                            {c.explanation}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
