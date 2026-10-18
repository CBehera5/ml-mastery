import { createEmptyEvidence, markLessonState, recordObjectiveCompletion, validateLearningEvidence, type LearningEvidenceV1 } from "../../learn/foundation/evidence";
import { bounded, bytes, canonical, ENVIRONMENT, gradeFamily, keys, POLICY_VERSION, record, validDraftAnswer, VERSION, type Answer, type FamilyResponse, type Grade } from "./contracts";
import { EXPERIMENT, OBJECTIVES, PRACTICE, PREDICTIONS } from "./fixtures";

export const STORAGE_KEY = "ml-math-lab:python:essentials:v1";
export type PracticeState = { cycle: number; counts: [number, number]; variant: 0 | 1; response: Answer[] | null; feedback: string; passed: boolean; reviewed: boolean; counterexample: string };
export type Progress = {
  envelopeVersion: 1; scope: "essentials"; content: string; policy: string; environment: string;
  evidence: LearningEvidenceV1; practice: PracticeState[];
  experiment: { config: string; changed: boolean; prediction: string; reason: string; passed: boolean; revealed: boolean };
};
export const emptyPractice = (): PracticeState => ({ cycle: 0, counts: [0, 0], variant: 0, response: null, feedback: "", passed: false, reviewed: false, counterexample: "" });
export const RECOVERY_ANSWERS = ["str", "repeated_text", "comparison_only", "value_error"] as const;
export const emptyProgress = (): Progress => ({
  envelopeVersion: 1, scope: "essentials", content: VERSION, policy: POLICY_VERSION, environment: ENVIRONMENT,
  evidence: createEmptyEvidence(VERSION), practice: OBJECTIVES.map(emptyPractice),
  experiment: { config: EXPERIMENT[0].id, changed: false, prediction: "", reason: "", passed: false, revealed: false },
});
const whole = (value: unknown) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 1e6;
function validEvidence(value: unknown): value is LearningEvidenceV1 {
  if (!record(value) || !keys(value, ["schemaVersion", "curriculumVersion", "lessons", "objectives", "assessmentAttempts", "masteryEvidence", "projectMilestones"]) || !validateLearningEvidence(value) || value.curriculumVersion !== VERSION || bytes(canonical(value)) > 32768 || value.masteryEvidence.length || value.assessmentAttempts.length || value.projectMilestones.length) return false;
  if (!Object.entries(value.lessons).every(([id, lesson]) => id === "python.essentials.p01" && record(lesson) && keys(lesson, ["state", "completedObjectiveIds", "updatedAt"]) && ["started", "completed"].includes(lesson.state) && new Set(lesson.completedObjectiveIds).size === lesson.completedObjectiveIds.length && lesson.completedObjectiveIds.every(objective => OBJECTIVES.some(item => item === objective)))) return false;
  return Object.entries(value.objectives).every(([id, objective]) => OBJECTIVES.some(item => item === id) && record(objective) && keys(objective, ["completed", "mastered", "evidenceIds", "updatedAt"]) && objective.completed && !objective.mastered && objective.evidenceIds.length === 1 && objective.evidenceIds[0] === `${VERSION}:${id}:practice`);
}
export function validateProgress(value: unknown): value is Progress {
  if (!bounded(value, 262144) || !record(value) || !keys(value, ["envelopeVersion", "scope", "content", "policy", "environment", "evidence", "practice", "experiment"]) || value.envelopeVersion !== 1 || value.scope !== "essentials" || value.content !== VERSION || value.policy !== POLICY_VERSION || value.environment !== ENVIRONMENT || !validEvidence(value.evidence) || !Array.isArray(value.practice) || value.practice.length !== 4 || !record(value.experiment)) return false;
  if (!value.practice.every((item, index) => {
    if (!record(item) || !keys(item, ["cycle", "counts", "variant", "response", "feedback", "passed", "reviewed", "counterexample"]) || !whole(item.cycle) || ![0, 1].includes(item.variant as number) || !Array.isArray(item.counts) || item.counts.length !== 2 || !item.counts.every(count => whole(count) && count <= 2) || typeof item.passed !== "boolean" || typeof item.reviewed !== "boolean" || !["", "0", "1"].includes(item.counterexample as string) || typeof item.feedback !== "string" || item.feedback.length > 1500) return false;
    if (item.response === null) return true;
    const definition = PRACTICE[index][item.variant as number];
    if (!Array.isArray(item.response) || item.response.length !== definition.atoms.length) return false;
    return definition.atoms.every((atom, position) => validDraftAnswer((item.response as Answer[])[position], atom));
  })) return false;
  const experiment = value.experiment;
  if (!keys(experiment, ["config", "changed", "prediction", "reason", "passed", "revealed"]) || !EXPERIMENT.some(item => item.id === experiment.config) || typeof experiment.changed !== "boolean" || typeof experiment.passed !== "boolean" || typeof experiment.revealed !== "boolean" || typeof experiment.prediction !== "string" || !(experiment.prediction === "" || PREDICTIONS.some(item => item === experiment.prediction)) || !["", "weighted", "repeat", "convert", "error"].includes(experiment.reason as string)) return false;
  const evidence = value.evidence;
  if (!value.practice.every((item, index) => record(item) && item.passed === Boolean(evidence.objectives[OBJECTIVES[index]]?.completed))) return false;
  const completed = value.practice.every(item => record(item) && item.passed) && experiment.passed;
  return (evidence.lessons["python.essentials.p01"]?.state === "completed") === completed;
}
export function serializeProgress(progress: Progress): string {
  if (!validateProgress(progress)) throw new Error("Progress does not match the supported version and bounds.");
  return canonical(progress);
}
export function loadProgress(raw: string | null): Progress {
  if (raw === null) return emptyProgress();
  if (bytes(raw) > 262144) throw new Error("Progress exceeds the supported storage allocation.");
  const parsed: unknown = JSON.parse(raw);
  if (!validateProgress(parsed) || canonical(parsed) !== raw) throw new Error("Unsupported progress. Original bytes preserved.");
  return parsed;
}
function complete(progress: Progress, now: string): Progress {
  const completed = progress.practice.every(item => item.passed) && progress.experiment.passed;
  return { ...progress, evidence: markLessonState(progress.evidence, "python.essentials.p01", completed ? "completed" : "started", OBJECTIVES.filter((_, index) => progress.practice[index].passed), now) };
}
export function submitPractice(progress: Progress, index: number, response: unknown, now: string): { progress: Progress; result: Grade } {
  const state = progress.practice[index];
  if (!state) return { progress, result: { status: "invalid", feedback: "Unsupported practice objective." } };
  if (state.counts[state.variant] >= 2) return { progress, result: { status: "invalid", feedback: "This variant is exhausted. Use the alternate or complete remediation." } };
  const result = gradeFamily(PRACTICE[index][state.variant], response);
  if (result.status === "invalid") return { progress, result };
  const counts: [number, number] = [...state.counts];
  counts[state.variant]++;
  const definition = PRACTICE[index][state.variant];
  const answers = definition.atoms.map(atom => (response as FamilyResponse).answers.find(entry => entry.atomId === atom.id)!.answer);
  const practice = progress.practice.map((item, position) => position === index ? { ...item, counts, response: answers, feedback: result.feedback, passed: item.passed || result.correct } : item);
  let evidence = progress.evidence;
  if (result.correct) evidence = recordObjectiveCompletion(evidence, OBJECTIVES[index], `${VERSION}:${OBJECTIVES[index]}:practice`, now);
  return { progress: complete({ ...progress, practice, evidence }, now), result };
}
export function alternatePractice(progress: Progress, index: number): Progress {
  const state = progress.practice[index];
  const alternate = state?.variant === 0 ? 1 : 0;
  if (!state || state.counts[alternate] >= 2) return progress;
  return { ...progress, practice: progress.practice.map((item, position) => position === index ? { ...item, variant: alternate, response: null, feedback: "" } : item) };
}
export function recoverPractice(progress: Progress, index: number, answer: unknown, reviewed: boolean): Progress {
  const state = progress.practice[index];
  if (!state || !reviewed || !state.counts.every(count => count === 2) || answer !== RECOVERY_ANSWERS[index]) return progress;
  return { ...progress, practice: progress.practice.map((item, position) => position === index ? { ...emptyPractice(), cycle: Math.min(item.cycle + 1, 1e6), passed: item.passed } : item) };
}
export function chooseExperiment(progress: Progress, config: string): Progress {
  if (!EXPERIMENT.some(item => item.id === config)) return progress;
  return { ...progress, experiment: { ...progress.experiment, config, changed: progress.experiment.changed || config !== progress.experiment.config, prediction: "", reason: "", revealed: false } };
}
export function checkExperiment(progress: Progress, now: string): Progress {
  const config = EXPERIMENT.find(item => item.id === progress.experiment.config)!;
  const correct = progress.experiment.prediction === config.value && progress.experiment.reason === config.reason;
  return complete({ ...progress, experiment: { ...progress.experiment, revealed: true, passed: progress.experiment.passed || (correct && progress.experiment.changed) } }, now);
}
export function resetLessonPractice(progress: Progress, confirmed: boolean): Progress {
  if (!confirmed) return progress;
  return { ...emptyProgress(), experiment: { ...emptyProgress().experiment } };
}
export type StoragePort = Pick<Storage, "getItem" | "setItem">;
export class ProgressStore {
  progress = emptyProgress();
  warning = "";
  writable = true;
  hydrated = false;
  constructor(private storage: StoragePort) {}
  hydrate() {
    try { this.progress = loadProgress(this.storage.getItem(STORAGE_KEY)); }
    catch { this.writable = false; this.warning = "Saved Python progress is unavailable, damaged or from another version. Original data is preserved; changes are in memory only and not saved."; }
    this.hydrated = true;
    return this.progress;
  }
  save(progress: Progress) {
    if (!this.hydrated) throw new Error("Hydrate progress before saving.");
    const raw = serializeProgress(progress);
    this.progress = progress;
    if (this.writable) try { this.storage.setItem(STORAGE_KEY, raw); }
    catch { this.writable = false; this.warning = "Python progress could not be saved. Earlier stored data is preserved; current progress is in memory only and not saved."; }
    return this.progress;
  }
  resetModule(confirmed: boolean) {
    if (!this.hydrated || !confirmed) return this.progress;
    this.progress = emptyProgress();
    try {
      this.storage.setItem(STORAGE_KEY, serializeProgress(this.progress));
      this.writable = true;
      this.warning = "";
    } catch {
      this.writable = false;
      this.warning = "The Python module reset could not be saved. Earlier stored bytes remain; this visit was reset in memory only.";
    }
    return this.progress;
  }
}
