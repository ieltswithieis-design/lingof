import { IeltsDatabase, FullIeltsTest } from "../types/ielts";
import { ieltsDatabase as defaultIeltsDatabase } from "../data/ieltsData";
import { fullIeltsTests as defaultFullTests } from "../data/fullTestsData";

export interface DatabaseStatus {
  success: boolean;
  databasePath: string;
  counts: {
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
    fullTests: number;
    totalSingleTests: number;
    registeredUsers: number;
    candidateSubmissions: number;
  };
  lastModified: string;
}

/**
 * Loads the complete modular IELTS test database from the backend `/database` storage.
 * Falls back to bundled initial data if backend request fails.
 */
export async function loadDatabaseFromBackend(): Promise<IeltsDatabase> {
  try {
    const res = await fetch("/api/tests/all");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.reading && Array.isArray(data.reading) && data.reading.length > 0) {
      return data as IeltsDatabase;
    }
    return defaultIeltsDatabase;
  } catch (err) {
    console.warn("Could not load database from backend API, using local bundle fallback:", err);
    return defaultIeltsDatabase;
  }
}

/**
 * Loads the full IELTS mock examination suite from `/database/tests/full_tests.json`.
 */
export async function loadFullTestsFromBackend(): Promise<FullIeltsTest[]> {
  try {
    const res = await fetch("/api/tests/full");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data as FullIeltsTest[];
    }
    return defaultFullTests;
  } catch (err) {
    console.warn("Could not load full tests from backend, using default tests:", err);
    return defaultFullTests;
  }
}

/**
 * Uploads a text or JSON formatted test into the `/database` storage.
 */
export async function uploadTestToDatabase(payload: {
  format?: "text" | "json";
  textPayload?: string;
  jsonPayload?: any;
  createFullMock?: boolean;
}): Promise<{ success: boolean; message: string; test?: any; section?: string; createdFullTest?: any; error?: string }> {
  try {
    const res = await fetch("/api/tests/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to upload test", error: err.message };
  }
}

/**
 * Deletes a test from `/database/tests/ielts_database.json`.
 */
export async function deleteTestFromDatabase(section: string, id: number): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`/api/tests/${section}/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Delete failed");
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete test" };
  }
}

/**
 * Fetches database statistics.
 */
export async function fetchDatabaseStatus(): Promise<DatabaseStatus | null> {
  try {
    const res = await fetch("/api/database/status");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Saves candidate test completion to `/database/test_results.json`.
 */
export async function recordTestSubmission(data: {
  trfCode: string;
  candidateName: string;
  userEmail?: string;
  testId: number;
  testTitle: string;
  overallBand: number;
  scores: { reading: number; listening: number; writing: number; speaking: number };
}) {
  try {
    await fetch("/api/results/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn("Failed to record test submission to database:", err);
  }
}
