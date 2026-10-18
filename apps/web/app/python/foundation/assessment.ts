import { bounded, bytes, canonical, ENVIRONMENT, gradeFamily, keys, POLICY_VERSION, record, validResponse, VERSION, type Family, type FamilyResponse } from "./contracts";

export const MODULE_POLICIES = [
  { module: "essentials", prefix: "P", count: 32, critical: ["P01.O2", "P02.O2", "P03.O2", "P04.O2", "P05.O2", "P06.O2", "P07.O2", "P08.O1"] },
  { module: "numpy", prefix: "N", count: 24, critical: ["N01.O2", "N02.O1", "N03.O2", "N04.O2", "N05.O2", "N06.O2"] },
  { module: "pandas", prefix: "D", count: 24, critical: ["D01.O1", "D02.O2", "D03.O1", "D04.O2", "D05.O1", "D05.O2", "D06.O3"] },
  { module: "visualization", prefix: "V", count: 20, critical: ["V01.O2", "V02.O2", "V03.O2", "V04.O2", "V05.O1"] },
  { module: "preparation", prefix: "T", count: 24, critical: ["T01.O1", "T01.O2", "T02.O1", "T03.O1", "T04.O1", "T05.O1", "T05.O2", "T06.O1"] },
  { module: "sklearn", prefix: "S", count: 20, critical: ["S01.O1", "S01.O3", "S02.O1", "S02.O2", "S03.O1", "S04.O1", "S05.O1"] },
] as const;
export type AssessmentResult = { policy: string; score: number; maximum: number; threshold: number; passed: boolean; outcomes: { objective: string; correct: boolean }[]; failedCritical: string[] };
export function scoreAssessment(module: string, families: readonly Family[], responses: unknown): AssessmentResult {
  const policy = MODULE_POLICIES.find(item => item.module === module);
  if (!policy || !bounded(responses) || !Array.isArray(responses) || responses.length !== policy.count || families.length !== policy.count) throw new Error("Incomplete or unsupported independent assessment.");
  const expected = Array.from({ length: policy.count }, (_, index) => `${policy.prefix}${String(Math.floor(index / 4) + 1).padStart(2, "0")}.O${index % 4 + 1}`);
  if (new Set(families.map(item => item.id)).size !== policy.count || new Set(families.map(item => item.objective)).size !== policy.count || !expected.every(objective => families.some(item => item.objective === objective && item.critical === policy.critical.some(critical => critical === objective)))) throw new Error("Assessment coverage does not match policy.");
  const outcomes = families.map(family => {
    const matches = responses.filter(response => record(response) && response.familyId === family.id);
    if (matches.length !== 1) throw new Error("Missing or duplicate assessment family.");
    const grade = gradeFamily(family, matches[0]);
    if (grade.status === "invalid") throw new Error("Unsupported assessment response.");
    return { objective: family.objective, correct: grade.correct };
  });
  const score = outcomes.filter(item => item.correct).length;
  const failedCritical = policy.critical.filter(objective => !outcomes.find(item => item.objective === objective)?.correct);
  const threshold = Math.ceil(policy.count * 0.8);
  return { policy: POLICY_VERSION, score, maximum: policy.count, threshold, passed: score >= threshold && failedCritical.length === 0, outcomes, failedCritical };
}
export type Draft = { id: string; form: 0 | 1 | 2; phase: "active" | "review" | "submitted"; responses: FamilyResponse[]; result: AssessmentResult | null };
export function reviewAttempt(draft: Draft): Draft {
  if (draft.phase !== "active") throw new Error("Only active attempts can enter review.");
  return { ...draft, phase: "review" };
}
export function submitAttempt(draft: Draft, confirmed: boolean, module: string, families: readonly Family[]): Draft {
  if (draft.phase === "submitted") return draft;
  if (draft.phase !== "review" || !confirmed) throw new Error("Review and explicit confirmation are required.");
  return { ...draft, phase: "submitted", result: scoreAssessment(module, families, draft.responses) };
}
export function retryAttempt(draft: Draft, nextId: string): Draft {
  if (draft.phase !== "submitted" || !nextId || nextId === draft.id || nextId.length > 128) throw new Error("A submitted attempt and new identity are required.");
  return { id: nextId, form: ((draft.form + 1) % 3) as 0 | 1 | 2, phase: "active", responses: [], result: null };
}
export function restoreDraft(draft: Draft): Draft { return draft.phase === "review" ? { ...draft, phase: "active" } : draft; }
export function validateDraft(value: unknown, families: readonly Family[], module: string): value is Draft {
  if (!bounded(value) || !record(value) || !keys(value, ["id", "form", "phase", "responses", "result"]) || typeof value.id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.id) || ![0, 1, 2].includes(value.form as number) || !["active", "review", "submitted"].includes(value.phase as string) || !Array.isArray(value.responses) || value.responses.length > 32) return false;
  const responses = value.responses;
  if (new Set(responses.map(response => record(response) ? response.familyId : null)).size !== responses.length || !responses.every(response => families.some(family => validResponse(family, response)))) return false;
  if (value.phase !== "submitted") return value.result === null;
  try { return canonical(value.result) === canonical(scoreAssessment(module, families, responses)); } catch { return false; }
}
export function encodeAssessmentDraft(draft: Draft, module: string, families: readonly Family[]): string {
  if (!validateDraft(draft, families, module)) throw new Error("Unsupported assessment draft.");
  const raw = canonical({ content: VERSION, policy: POLICY_VERSION, environment: ENVIRONMENT, module, draft });
  if (bytes(raw) > 65536) throw new Error("Assessment draft exceeds allocation.");
  return raw;
}
export function decodeAssessmentDraft(raw: string, module: string, families: readonly Family[]): Draft {
  if (bytes(raw) > 65536) throw new Error("Unsupported assessment draft.");
  const value: unknown = JSON.parse(raw);
  if (!bounded(value) || !record(value) || !keys(value, ["content", "policy", "environment", "module", "draft"]) || value.content !== VERSION || value.policy !== POLICY_VERSION || value.environment !== ENVIRONMENT || value.module !== module || !validateDraft(value.draft, families, module) || canonical(value) !== raw) throw new Error("Unsupported assessment draft; preserve original bytes.");
  return restoreDraft(value.draft);
}
export function retainAttemptSummaries<Value extends { id: string }>(previous: readonly Value[], next: Value): Value[] {
  if (!bounded(next, 2048)) throw new Error("Attempt summary exceeds its allocation.");
  return [...previous.filter(item => item.id !== next.id), next].slice(-20);
}
