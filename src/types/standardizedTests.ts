export type StandardizedExamId = "pte" | "sat" | "gre" | "gmat" | "toefl" | "act";

export interface ExamMeta {
  id: StandardizedExamId;
  name: string;
  fullName: string;
  governingBody: string;
  scoringScale: string;
  durationMinutes: number;
  sectionsCount: number;
  badge: string;
  color: string;
  iconBg: string;
  description: string;
  targetAudience: string;
  acceptedInstitutions: string;
  skills: string[];
}

export type QuestionType =
  | "multiple-choice-single"
  | "multiple-choice-multiple"
  | "fill-in-blanks"
  | "read-aloud"
  | "quantitative-comparison"
  | "data-sufficiency"
  | "sentence-equivalence"
  | "essay-writing"
  | "audio-lecture-mcq";

export interface TestQuestion {
  id: string;
  questionNumber: number;
  type: QuestionType;
  prompt: string;
  passage?: string;
  audioScript?: string;
  audioSpeaker?: string;
  speakerGender?: "female" | "male";
  options?: string[];
  correctAnswer: string | string[]; // string or array for multiple answers
  explanation: string;
  category?: string;
  points?: number;
}

export interface ExamSection {
  id: string;
  title: string;
  timeMinutes: number;
  description: string;
  questions: TestQuestion[];
}

export interface StandardizedTestPackage {
  id: string;
  examId: StandardizedExamId;
  title: string;
  edition: string;
  difficulty: "Standard" | "Official Mock" | "High Difficulty";
  sections: ExamSection[];
}

export interface StandardizedTestResult {
  testId: string;
  examId: StandardizedExamId;
  examName: string;
  candidateName: string;
  dateCompleted: string;
  timeSpentSeconds: number;
  overallScore: number;
  maxScore: number;
  scaledScore: string;
  percentile: number;
  sectionBreakdown: {
    sectionTitle: string;
    score: number;
    maxScore: number;
    scaledScore: string;
    percentage: number;
  }[];
  userAnswers: Record<string, string | string[]>;
  questions: TestQuestion[];
  verificationCode: string;
}
