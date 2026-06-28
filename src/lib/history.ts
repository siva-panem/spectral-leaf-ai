import type { Severity } from "./diseases";

const KEY = "mg_history";

export interface PredictionRecord {
  id: string;
  imageDataUrl: string;
  diseaseSlug: string;
  diseaseName: string;
  confidence: number;
  severity: Severity;
  medicine: string;
  status: "Treated" | "Pending" | "Healthy";
  createdAt: number;
}

export function listHistory(): PredictionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PredictionRecord[]) : [];
  } catch {
    return [];
  }
}

export function addHistory(rec: PredictionRecord) {
  const list = listHistory();
  list.unshift(rec);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 100)));
}

export function deleteHistory(id: string) {
  const list = listHistory().filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
