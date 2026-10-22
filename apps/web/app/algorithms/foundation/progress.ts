import { analyze, bounded, bytes, canonical, CONFIGS, CONTENT, gradePractice, keys, OBJECTIVES, POLICY, PRACTICE, record, REASONS, responseFor, validDraftAnswer, type Answer } from "./contracts";

export const STORAGE_KEY = "ml-math-lab:supervised:ev:prototype:v1";
type Practice = { variant: 0 | 1; counts: [number, number]; cycle: number; draft: string; proof: string | null };
type Interaction = { from: string; config: string; prediction: string; reason: string };
export type Progress = {
  schema: 1; scope: "supervised.ev01.prototype"; content: string; policy: string; revision: number;
  practice: Practice[];
  experiment: Interaction & { revealed: boolean; credit: Interaction | null };
};
const initialPractice = (): Practice => ({ variant: 0, counts: [0, 0], cycle: 0, draft: "[]", proof: null });
export const emptyProgress = (): Progress => ({ schema: 1, scope: "supervised.ev01.prototype", content: CONTENT, policy: POLICY, revision: 0, practice: OBJECTIVES.map(initialPractice), experiment: { config: CONFIGS[0], from: CONFIGS[0], prediction: "", reason: "", revealed: false, credit: null } });
const whole = (value: unknown) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 1e6;
function validDraft(raw: unknown, index: number, variant: number) {
  if (typeof raw !== "string" || bytes(raw) > 1536) return false;
  try {
    const answers: unknown = JSON.parse(raw);
    const family = PRACTICE[index * 2 + variant];
    return Array.isArray(answers) && canonical(answers) === raw && (answers.length === 0 || (answers.length === family.atoms.length && answers.every((answer, position) => validDraftAnswer(answer, family.atoms[position]))));
  } catch { return false; }
}
function validInteraction(value: unknown, credit: boolean): value is Interaction {
  if (!record(value) || !keys(value, ["from", "config", "prediction", "reason"]) || !CONFIGS.includes(value.from as string) || !CONFIGS.includes(value.config as string) || !["", "valid", "invalid"].includes(value.prediction as string) || !["", ...REASONS.map(item => item.id)].includes(value.reason as string)) return false;
  return !credit || (value.from !== value.config && value.prediction !== "" && value.reason === analyze(value.config as string).reason);
}
export function validProgress(value: unknown): value is Progress {
  if (!bounded(value, 262144) || !record(value) || !keys(value, ["schema", "scope", "content", "policy", "revision", "practice", "experiment"]) || value.schema !== 1 || value.scope !== "supervised.ev01.prototype" || value.content !== CONTENT || value.policy !== POLICY || !whole(value.revision) || !Array.isArray(value.practice) || value.practice.length !== 4) return false;
  if (!value.practice.every((item, index) => {
    if (!record(item) || !keys(item, ["variant", "counts", "cycle", "draft", "proof"]) || ![0, 1].includes(item.variant as number) || !whole(item.cycle) || !Array.isArray(item.counts) || item.counts.length !== 2 || !item.counts.every(count => whole(count) && count <= 2) || !validDraft(item.draft, index, item.variant as number)) return false;
    if (item.proof === null) return true;
    if (typeof item.proof !== "string" || bytes(item.proof) > 1536) return false;
    try {
      const response: unknown = JSON.parse(item.proof);
      return record(response) && PRACTICE.slice(index * 2, index * 2 + 2).some(family => response.familyId === family.id && canonical(response) === item.proof && gradePractice(family.id, response).status === "graded" && (gradePractice(family.id, response) as { correct: boolean }).correct);
    } catch { return false; }
  })) return false;
  const experiment = value.experiment;
  if (!record(experiment) || !keys(experiment, ["from", "config", "prediction", "reason", "revealed", "credit"]) || typeof experiment.revealed !== "boolean" || !validInteraction({ from: experiment.from, config: experiment.config, prediction: experiment.prediction, reason: experiment.reason }, false) || (experiment.credit !== null && !validInteraction(experiment.credit, true))) return false;
  return (!experiment.revealed && experiment.reason === "") || (experiment.revealed && experiment.prediction !== "");
}
export function encode(progress: Progress) {
  if (!validProgress(progress)) throw new Error("Unsupported EV01 progress. Last valid record preserved.");
  return canonical(progress);
}
export function decode(raw: string | null): Progress {
  if (raw === null) return emptyProgress();
  if (bytes(raw) > 262144) throw new Error("Unsupported saved record.");
  const value: unknown = JSON.parse(raw);
  if (!validProgress(value) || canonical(value) !== raw) throw new Error("Unsupported saved record.");
  return value;
}
export const completed = (progress: Progress) => progress.practice.every(item => item.proof !== null) && progress.experiment.credit !== null;
export function draftAnswers(progress: Progress, index: number): Answer[] {
  const state = progress.practice[index];
  const answers = JSON.parse(state.draft) as Answer[];
  return answers.length ? answers : PRACTICE[index * 2 + state.variant].atoms.map(() => ({ kind: "unanswered" }));
}
export function changeDraft(progress: Progress, index: number, answers: Answer[]): Progress {
  const state = progress.practice[index];
  if (!state || !validDraft(canonical(answers), index, state.variant)) return progress;
  return { ...progress, practice: progress.practice.map((item, position) => position === index ? { ...item, draft: canonical(answers) } : item) };
}
export function submitPractice(progress: Progress, index: number) {
  const state = progress.practice[index];
  if (!state || state.counts[state.variant] >= 2) return { progress, feedback: "This variant is exhausted. Try the alternate, then review the worked counterexample." };
  const family = PRACTICE[index * 2 + state.variant];
  const response = responseFor(family, draftAnswers(progress, index));
  if (response.answers.some(entry => entry.answer.kind === "unanswered")) return { progress, feedback: "Complete the supplied answers. No attempt counted." };
  const result = gradePractice(family.id, response);
  if (result.status === "invalid") return { progress, feedback: result.feedback };
  const counts: [number, number] = [...state.counts];
  counts[state.variant]++;
  return { progress: { ...progress, practice: progress.practice.map((item, position) => position === index ? { ...item, counts, proof: result.correct ? canonical(response) : item.proof } : item) }, feedback: result.feedback };
}
export function alternate(progress: Progress, index: number): Progress {
  const state = progress.practice[index];
  const variant = state?.variant === 0 ? 1 : 0;
  if (!state || state.counts[variant] >= 2) return progress;
  return { ...progress, practice: progress.practice.map((item, position) => position === index ? { ...item, variant, draft: "[]" } : item) };
}
export const RECOVERY = ["target", "time", "groups", "association"] as const;
export function recover(progress: Progress, index: number, reviewed: boolean, answer: string): Progress {
  const state = progress.practice[index];
  if (!state || !state.counts.every(count => count === 2) || !reviewed || answer !== RECOVERY[index] || state.cycle >= 1e6) return progress;
  return { ...progress, practice: progress.practice.map((item, position) => position === index ? { ...initialPractice(), proof: item.proof, cycle: item.cycle + 1 } : item) };
}
export function choose(progress: Progress, config: string): Progress {
  if (!CONFIGS.includes(config) || config === progress.experiment.config) return progress;
  return { ...progress, experiment: { from: progress.experiment.config, config, prediction: "", reason: "", revealed: false, credit: progress.experiment.credit } };
}
export function predict(progress: Progress, prediction: string): Progress {
  if (progress.experiment.revealed || !["valid", "invalid"].includes(prediction)) return progress;
  return { ...progress, experiment: { ...progress.experiment, prediction } };
}
export function reveal(progress: Progress): Progress {
  return progress.experiment.prediction ? { ...progress, experiment: { ...progress.experiment, revealed: true } } : progress;
}
export function explain(progress: Progress, reason: string): Progress {
  const experiment = progress.experiment;
  if (!experiment.revealed || !REASONS.some(item => item.id === reason)) return progress;
  const credit = { from: experiment.from, config: experiment.config, prediction: experiment.prediction, reason };
  return { ...progress, experiment: { ...experiment, reason, credit: validInteraction(credit, true) ? credit : experiment.credit } };
}
export function resetExperiment(progress: Progress): Progress {
  return { ...progress, experiment: { ...emptyProgress().experiment, credit: progress.experiment.credit } };
}
export function resetLesson(progress: Progress, confirmed: boolean): Progress {
  return confirmed ? { ...emptyProgress(), revision: progress.revision } : progress;
}
export class ProgressStore {
  progress = emptyProgress();
  warning = "";
  private hydrated = false;
  private writable = true;
  private previous: string | null = null;
  constructor(private storage: Pick<Storage, "getItem" | "setItem">) {}
  hydrate() {
    try { this.previous = this.storage.getItem(STORAGE_KEY); this.progress = decode(this.previous); }
    catch { this.writable = false; this.warning = "Saved EV01 record is unavailable or unsupported. Original bytes preserved; changes are in memory only."; }
    this.hydrated = true;
    return this.progress;
  }
  save(progress: Progress) {
    if (!this.hydrated) throw new Error("Restore before saving.");
    const next = { ...progress, revision: Math.min(this.progress.revision + 1, 1e6) };
    const raw = encode(next);
    this.progress = next;
    if (this.writable) try {
      if (this.storage.getItem(STORAGE_KEY) !== this.previous) throw new Error("Stale record.");
      this.storage.setItem(STORAGE_KEY, raw);
      this.previous = raw;
    } catch { this.writable = false; this.warning = "EV01 could not be saved (storage failure or another tab changed it). Earlier bytes preserved; changes are in memory only. Reload to review the stored record."; }
    return this.progress;
  }
}
