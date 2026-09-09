import { UserTestAttempt, TestSection } from "../types/ielts";

const STORAGE_KEY = "ielts_mastery_progress_v2";

export interface ProgressState {
  completed: Record<string, boolean>; // key: `${section}-${testId}`
  attempts: Record<string, UserTestAttempt>;
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: {}, attempts: {} };
    return JSON.parse(raw);
  } catch {
    return { completed: {}, attempts: {} };
  }
}

export function saveAttempt(attempt: UserTestAttempt): void {
  try {
    const current = loadProgress();
    const key = `${attempt.section}-${attempt.testId}`;
    current.completed[key] = true;
    current.attempts[key] = attempt;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to save attempt to localStorage", err);
  }
}

export function getAttempt(section: TestSection, testId: number): UserTestAttempt | undefined {
  const current = loadProgress();
  return current.attempts[`${section}-${testId}`];
}

export function resetSectionProgress(section: TestSection): void {
  try {
    const current = loadProgress();
    Object.keys(current.completed).forEach(key => {
      if (key.startsWith(`${section}-`)) {
        delete current.completed[key];
        delete current.attempts[key];
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to reset progress", err);
  }
}
