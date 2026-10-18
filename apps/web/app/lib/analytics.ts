export const ANALYTICS_EVENTS = [
  "beta_started",
  "demo_started",
  "demo_completed",
  "challenge_started",
  "challenge_completed",
  "feedback_opened",
  "pricing_interest_clicked",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];
export type AnalyticsRecord = { event: AnalyticsEventName; timestamp: string; path: string };

const STORAGE_KEY = "ml-math-lab:beta-events:v1";

export function trackEvent(event: AnalyticsEventName): void {
  if (typeof window === "undefined") return;
  const record: AnalyticsRecord = {
    event,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
  };
  try {
    const existing = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "[]") as AnalyticsRecord[];
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, record]));
  } catch {
    // Tracking must never interrupt the learning experience.
  }
  window.dispatchEvent(new CustomEvent("ml-math-lab:analytics", { detail: record }));
}

export function readSessionEvents(): AnalyticsRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "[]") as AnalyticsRecord[];
  } catch {
    return [];
  }
}

