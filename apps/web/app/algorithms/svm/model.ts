import { bounded, bytes, canonical, gradeFamily, keys, record, validDraftAnswer, type Answer, type Family } from "../../python/foundation/contracts";
import type { StoragePort } from "../../python/foundation/progress";
import { ASSESSMENT, configFor, CONTENT, FIXTURES, FORMS, LABS, MASTERY_AVAILABLE, OBJECTIVES, POLICY, PRACTICE, PREDICTIONS, EXPLANATIONS, response, score, SCOPE } from "./catalog";
import { LESSONS } from "./teaching";

export const STORAGE_KEY = "ml-math-lab:supervised:svm:full:v1";
export type Practice = { variant: 0 | 1; counts: [number, number]; cycle: number; answers: string; proof: string | null; last: boolean | null; reviewed: boolean; recall: string };
export type Credit = { from: string; config: string; prediction: string; reason: string };
export type Lab = Credit & { revealed: boolean; credit: Credit | null };
export type Summary = { id: string; form: number; at: string; assessment: string; score: number; outcomes: boolean[]; critical: string[]; passed: boolean };
export type Draft = { id: string; form: number; phase: "active" | "review" | "results"; answers: string[]; result: Summary | null };
export type State = { schema: 1; scope: string; content: string; policy: string; assessment: string; fixtures: string; revision: number; practice: Practice[]; labs: Lab[]; transfers: string[]; draft: Draft; latest: Draft | null; history: Summary[]; mastery: Summary | null };
const unanswered = (family: Family) => canonical(family.atoms.map(() => ({ kind: "unanswered" })));
const blankPractice = (index: number): Practice => ({ variant: 0, counts: [0, 0], cycle: 0, answers: unanswered(PRACTICE[0][index]), proof: null, last: null, reviewed: false, recall: "" });
const blankLab = (lab: number): Lab => ({ from: LABS[lab].initial_configuration, config: LABS[lab].initial_configuration, prediction: "", reason: "", revealed: false, credit: null });
export const newDraft = (id: string, form: number): Draft => ({ id, form, phase: "active", answers: FORMS[form].map(unanswered), result: null });
export const emptyState = (): State => ({ schema: 1, scope: SCOPE, content: CONTENT, policy: POLICY, assessment: ASSESSMENT, fixtures: FIXTURES, revision: 0, practice: OBJECTIVES.map((_, index) => blankPractice(index)), labs: [blankLab(0), blankLab(1)], transfers: LESSONS.map(() => ""), draft: newDraft("initial", 0), latest: null, history: [], mastery: null });
export function unpack(raw: string): Answer[] { return JSON.parse(raw) as Answer[]; }
function validPacked(raw: unknown, family: Family) {
  if (typeof raw !== "string" || bytes(raw) > 1536) return false;
  try {
    const answers: unknown = JSON.parse(raw);
    return bounded(answers, 1536) && Array.isArray(answers) && answers.length === family.atoms.length && answers.every((answer, index) => validDraftAnswer(answer, family.atoms[index])) && canonical(answers) === raw;
  } catch { return false; }
}
export const lessonComplete = (state: State, lesson: number) => state.practice.slice(lesson * 4, lesson * 4 + 4).every(item => item.proof !== null) && state.labs[LESSONS[lesson].lab].credit !== null && state.transfers[lesson] === "boundary";
export function practiceSubmit(state: State, index: number): State {
  const item = state.practice[index];
  if (!item || item.counts[item.variant] >= 2) throw Error("Use the alternate practice or complete targeted remediation.");
  const family = PRACTICE[item.variant][index];
  if (!validPacked(item.answers, family)) throw Error("Unsupported practice representation; complete or clear the answer.");
  const grade = gradeFamily(family, response(family, unpack(item.answers)));
  if (grade.status === "invalid") throw Error(grade.feedback);
  const counts: [number, number] = [...item.counts]; counts[item.variant]++;
  const proof = grade.correct ? canonical({ variant: item.variant, answers: unpack(item.answers) }) : item.proof;
  return { ...state, practice: state.practice.map((entry, offset) => offset === index ? { ...entry, counts, proof, last: grade.correct } : entry) };
}
export function alternate(state: State, index: number): State {
  const item = state.practice[index], variant = item.variant === 0 ? 1 : 0;
  if (item.counts[variant] >= 2) throw Error("This variant is exhausted; review the worked contrast.");
  return { ...state, practice: state.practice.map((entry, offset) => offset === index ? { ...entry, variant, answers: unanswered(PRACTICE[variant][index]), last: null } : entry) };
}
export function recover(state: State, index: number): State {
  const item = state.practice[index];
  if (!item.counts.every(count => count === 2) || !item.reviewed || item.recall !== "boundary") throw Error("Review the worked contrast and correctly explain the changed case before starting a new cycle.");
  return { ...state, practice: state.practice.map((entry, offset) => offset === index ? { ...blankPractice(index), proof: entry.proof, cycle: Math.min(1e6, entry.cycle + 1) } : entry) };
}
export function changeLab(state: State, lab: number, id: string): State {
  configFor(lab, id);
  return { ...state, labs: state.labs.map((entry, index) => index === lab ? { ...entry, from: entry.config, config: id, prediction: "", reason: "", revealed: false } : entry) };
}
export function revealLab(state: State, lab: number): State {
  if (!configFor(lab, state.labs[lab].config).predictionOptions.some(option => option.id === state.labs[lab].prediction)) throw Error("Make a prediction before revealing the reference outcome.");
  if (!EXPLANATIONS.includes(state.labs[lab].reason)) throw Error("Choose a predicted reason before revealing the reference outcome.");
  return { ...state, labs: state.labs.map((entry, index) => index === lab ? { ...entry, revealed: true } : entry) };
}
export function explainLab(state: State, lab: number): State {
  const item = state.labs[lab];
  if (!item.revealed || item.from === item.config || item.reason !== configFor(lab, item.config).reasonId) throw Error("Change a meaningful configuration, predict, reveal and select the supported explanation. An initially wrong prediction is welcome.");
  const credit = { from: item.from, config: item.config, prediction: item.prediction, reason: item.reason };
  return { ...state, labs: state.labs.map((entry, index) => index === lab ? { ...entry, credit } : entry) };
}
export function resetLab(state: State, lab: number): State {
  return { ...state, labs: state.labs.map((entry, index) => index === lab ? { ...blankLab(lab), credit: entry.credit } : entry) };
}
export function confirmAttempt(state: State, confirmed: boolean, at: string): State {
  if (!MASTERY_AVAILABLE) throw Error("Module mastery is unavailable until complete verification.");
  if (state.draft.phase === "results") return state;
  if (state.draft.phase !== "review" || !confirmed) throw Error("Review and explicit confirmation are required.");
  const result = score(state.draft.form, state.draft.answers.map(unpack));
  const summary: Summary = { ...result, id: state.draft.id, form: state.draft.form, at, assessment: ASSESSMENT };
  const draft: Draft = { ...state.draft, phase: "results", result: summary };
  return { ...state, draft, latest: draft, history: [...state.history.filter(item => item.id !== summary.id), summary].slice(-20), mastery: summary.passed ? summary : state.mastery };
}
export function retry(state: State, id: string): State {
  if (state.draft.phase !== "results" || !identity(id) || id === state.draft.id || state.history.some(item => item.id === id) || state.mastery?.id === id) throw Error("A submitted attempt and a fresh identity are required.");
  return { ...state, draft: newDraft(id, (state.draft.form + 1) % 3) };
}
const identity = (value: unknown): value is string => typeof value === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(value);
const integer = (value: unknown, max: number): value is number => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= max;
function validSummary(value: unknown): value is Summary {
  if (!record(value) || !keys(value, ["id", "form", "at", "assessment", "score", "outcomes", "critical", "passed"]) || !identity(value.id) || !integer(value.form, 2) || typeof value.at !== "string" || !Number.isFinite(Date.parse(value.at)) || value.assessment !== ASSESSMENT || !Array.isArray(value.outcomes) || value.outcomes.length !== 20 || !value.outcomes.every(item => typeof item === "boolean")) return false;
  const critical = OBJECTIVES.filter((_, index) => index % 4 === 1 && !(value.outcomes as boolean[])[index]);
  const count = value.outcomes.filter(Boolean).length;
  return value.score === count && canonical(value.critical) === canonical(critical) && value.passed === (count >= 16 && critical.length === 0);
}
function validDraft(value: unknown): value is Draft {
  if (!record(value) || !keys(value, ["id", "form", "phase", "answers", "result"]) || !identity(value.id) || !integer(value.form, 2) || !["active", "review", "results"].includes(value.phase as string) || !Array.isArray(value.answers) || value.answers.length !== 20 || !value.answers.every((raw, index) => validPacked(raw, FORMS[value.form as number][index]))) return false;
  if (value.phase !== "results") return value.result === null;
  if (!validSummary(value.result) || value.result.id !== value.id || value.result.form !== value.form) return false;
  try {
    const result = score(value.form, value.answers.map(raw => unpack(raw as string)));
    return canonical(result) === canonical({ score: value.result.score, outcomes: value.result.outcomes, critical: value.result.critical, passed: value.result.passed });
  } catch { return false; }
}
function validCredit(value: unknown, lab: number): value is Credit {
  if (!record(value) || !keys(value, ["from", "config", "prediction", "reason"]) || typeof value.from !== "string" || typeof value.config !== "string" || value.from === value.config || !PREDICTIONS.includes(value.prediction as string)) return false;
  try { configFor(lab, value.from); const config = configFor(lab, value.config); return config.predictionOptions.some(option => option.id === value.prediction) && value.reason === config.reasonId; } catch { return false; }
}
export function validateState(value: unknown): value is State {
  try {
    if (!bounded(value, 262144) || !record(value) || !keys(value, ["schema", "scope", "content", "policy", "assessment", "fixtures", "revision", "practice", "labs", "transfers", "draft", "latest", "history", "mastery"]) || value.schema !== 1 || value.scope !== SCOPE || value.content !== CONTENT || value.policy !== POLICY || value.assessment !== ASSESSMENT || value.fixtures !== FIXTURES || !integer(value.revision, 1e9) || !Array.isArray(value.practice) || value.practice.length !== 20 || !Array.isArray(value.labs) || value.labs.length !== 2 || !Array.isArray(value.transfers) || value.transfers.length !== 5 || !value.transfers.every(item => ["", "boundary", "shortcut"].includes(item)) || !validDraft(value.draft) || !(value.latest === null || validDraft(value.latest) && value.latest.phase === "results") || !Array.isArray(value.history) || value.history.length > 20 || !value.history.every(validSummary) || !(value.mastery === null || validSummary(value.mastery) && value.mastery.passed)) return false;
    if (!value.practice.every((item, index) => {
      if (!record(item) || !keys(item, ["variant", "counts", "cycle", "answers", "proof", "last", "reviewed", "recall"]) || !integer(item.variant, 1) || !Array.isArray(item.counts) || item.counts.length !== 2 || !item.counts.every(count => integer(count, 2)) || !integer(item.cycle, 1e6) || !validPacked(item.answers, PRACTICE[item.variant][index]) || ![null, true, false].includes(item.last as null) || typeof item.reviewed !== "boolean" || !["", "boundary", "shortcut"].includes(item.recall as string)) return false;
      if (item.proof === null) return item.last !== true;
      if (typeof item.proof !== "string" || bytes(item.proof) > 2048) return false;
      const proof: unknown = JSON.parse(item.proof);
      if (!record(proof) || !keys(proof, ["variant", "answers"]) || !integer(proof.variant, 1) || !Array.isArray(proof.answers) || canonical(proof) !== item.proof) return false;
      const family = PRACTICE[proof.variant][index], grade = gradeFamily(family, response(family, proof.answers));
      return grade.status === "graded" && grade.correct;
    })) return false;
    if (!value.labs.every((item, index) => {
      if (!record(item) || !keys(item, ["from", "config", "prediction", "reason", "revealed", "credit"]) || typeof item.from !== "string" || typeof item.config !== "string" || !["", ...PREDICTIONS].includes(item.prediction as string) || typeof item.revealed !== "boolean") return false;
      configFor(index, item.from);
      const config = configFor(index, item.config);
      return ["", ...EXPLANATIONS].includes(item.reason as string) && (!item.revealed || config.predictionOptions.some(option => option.id === item.prediction)) && (item.credit === null || validCredit(item.credit, index));
    })) return false;
    const history = value.history;
    if (new Set(history.map(item => item.id)).size !== history.length || bytes(canonical(history)) > 40960) return false;
    if (value.latest !== null && !history.some(item => canonical(item) === canonical((value.latest as Draft).result))) return false;
    if (value.draft.phase === "results" && canonical(value.draft) !== canonical(value.latest)) return false;
    return bytes(canonical({ practice: value.practice.map(item => item.answers), draft: value.draft })) <= 65536;
  } catch { return false; }
}
export function serialize(state: State): string {
  if (!validateState(state)) throw Error("Unsupported SVM state; original progress is preserved.");
  return canonical(state);
}
export function load(raw: string | null): State {
  if (raw === null) return emptyState();
  if (bytes(raw) > 262144) throw Error("Unsupported SVM storage size.");
  const parsed: unknown = JSON.parse(raw);
  if (!validateState(parsed) || canonical(parsed) !== raw) throw Error("Unsupported SVM version or encoding; preserve original bytes.");
  return parsed.draft.phase === "review" ? { ...parsed, draft: { ...parsed.draft, phase: "active" } } : parsed;
}
export class ModuleStore {
  state = emptyState();
  loaded = false;
  writable = true;
  warning = "";
  private raw: string | null = null;
  constructor(public storage: StoragePort) {}
  hydrate() {
    try { this.raw = this.storage.getItem(STORAGE_KEY); this.state = load(this.raw); }
    catch { this.writable = false; this.warning = "Earlier SVM storage is unsupported or unavailable. It is preserved; this visit is in memory only, not saved."; }
    this.loaded = true;
    return this.state;
  }
  save(next: State) {
    if (!this.loaded) throw Error("Hydrate before saving.");
    const state = { ...next, revision: this.state.revision + 1 }, raw = serialize(state);
    this.state = state;
    if (this.writable) try {
      if (this.storage.getItem(STORAGE_KEY) !== this.raw) throw Error("Another tab changed progress.");
      this.storage.setItem(STORAGE_KEY, raw); this.raw = raw;
    } catch { this.writable = false; this.warning = "SVM could not save: storage failure or another tab changed progress. Original bytes remain; this visit is in memory only, not saved."; }
    return this.state;
  }
}
