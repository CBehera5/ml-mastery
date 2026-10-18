import { awardMastery, createEmptyEvidence, recordObjectiveCompletion, type LearningEvidenceV1, validateLearningEvidence } from "../../learn/foundation/evidence";
import { bounded, bytes, canonical, ENVIRONMENT, gradeFamily, keys, POLICY_VERSION, record, validDraftAnswer, type Answer, type FamilyResponse } from "../foundation/contracts";
import { loadProgress as loadP01, STORAGE_KEY as P01_KEY, type Progress as P01Progress, type StoragePort } from "../foundation/progress";
import { responseFor } from "../foundation/fixtures";
import { scoreAssessment } from "../foundation/assessment";
import { ACTIVITIES, ACTIVITY_REASONS, activityPredictions, ASSESSMENT, canonicalObjective, CONTENT, INDEPENDENT_FORMS, LESSONS, MASTERY_AVAILABLE, PRACTICE_FORMS, SOURCE_MAP } from "./catalog";

export const STORAGE_KEY = "ml-math-lab:python:essentials:v2";
export const MASTERY = "python.essentials.mastery.v1";
export type Practice = { cycle: number; counts: [number, number]; variant: 0 | 1; answers: Answer[]; passed: boolean; last: boolean | null; reviewed: boolean; remediation: string };
export type ActivityState = { config: string; changed: boolean; prediction: string; reason: string; passed: boolean; revealed: boolean };
export type Summary = { id: string; form: number; at: string; policy: string; content: string; score: number; outcomes: boolean[]; critical: string[]; passed: boolean };
export type Draft = { id: string; form: 0 | 1 | 2; phase: "active" | "review" | "results"; answers: Answer[][]; result: Summary | null };
export type Transfer = { map: string; hash: string; at: string; sourceVersion: string; sourceDates: string[] };
export type State = { schema: 2; content: string; policy: string; environment: string; evidence: LearningEvidenceV1; practice: Practice[]; activities: ActivityState[]; draft: Draft; latest: Draft | null; history: Summary[]; transfer: Transfer | null };
const unanswered = (): Answer => ({ kind: "unanswered" });
const blankAnswers = (index: number, variant = 0) => PRACTICE_FORMS[variant][index].atoms.map(unanswered);
const blankPractice = (index: number): Practice => ({ cycle: 0, counts: [0, 0], variant: 0, answers: blankAnswers(index), passed: false, last: null, reviewed: false, remediation: "" });
const blankActivity = (index: number): ActivityState => ({ config: ACTIVITIES[index][0].id, changed: false, prediction: "", reason: "", passed: false, revealed: false });
export const newDraft = (id: string, form: 0 | 1 | 2): Draft => ({ id, form, phase: "active", answers: INDEPENDENT_FORMS[form].map(item => item.atoms.map(unanswered)), result: null });
export const emptyState = (id = "initial"): State => ({ schema: 2, content: CONTENT, policy: POLICY_VERSION, environment: ENVIRONMENT, evidence: createEmptyEvidence(CONTENT), practice: Array.from({ length: 32 }, (_, index) => blankPractice(index)), activities: LESSONS.map((_, index) => blankActivity(index)), draft: newDraft(id, 0), latest: null, history: [], transfer: null });
export const lessonComplete = (state: State, lesson: number) => state.practice.slice(lesson * 4, lesson * 4 + 4).every(item => item.passed) && state.activities[lesson].passed;
export const familyResponse = (index: number, answers: Answer[], variant: number, independent = false): FamilyResponse => {
  const definition = (independent ? INDEPENDENT_FORMS : PRACTICE_FORMS)[variant][index];
  return responseFor(definition, Object.fromEntries(definition.atoms.map((atom, position) => [atom.id, answers[position] ?? unanswered()])));
};
function syncCompletion(state: State, lesson: number, at: string): State {
  const id = `python.essentials.${LESSONS[lesson].slug}`;
  const completed = lessonComplete(state, lesson);
  return { ...state, evidence: { ...state.evidence, lessons: { ...state.evidence.lessons, [id]: { state: completed ? "completed" : "started", completedObjectiveIds: LESSONS[lesson].objectives.filter((_, offset) => state.practice[lesson * 4 + offset].passed).map(item => canonicalObjective(item.id)), updatedAt: at } } } };
}
export function practiceSubmit(state: State, index: number, at: string) {
  const item = state.practice[index];
  if (!item || item.counts[item.variant] >= 2) throw Error("Practice allowance exhausted; use alternate or remediation.");
  const definition = PRACTICE_FORMS[item.variant][index];
  const grade = gradeFamily(definition, familyResponse(index, item.answers, item.variant));
  if (grade.status === "invalid") throw Error(grade.feedback);
  const counts: [number, number] = [...item.counts]; counts[item.variant]++;
  const practice = state.practice.map((entry, position) => position === index ? { ...entry, counts, passed: entry.passed || grade.correct, last: grade.correct } : entry);
  const evidence = grade.correct ? recordObjectiveCompletion(state.evidence, canonicalObjective(definition.objective), `${CONTENT}:${definition.objective}:practice`, at) : state.evidence;
  return syncCompletion({ ...state, practice, evidence }, Math.floor(index / 4), at);
}
export function alternate(state: State, index: number): State {
  const item = state.practice[index], variant = item.variant === 0 ? 1 : 0;
  if (item.counts[variant] >= 2) return state;
  return { ...state, practice: state.practice.map((entry, position) => position === index ? { ...entry, variant, answers: blankAnswers(index, variant), last: null } : entry) };
}
export const recoveryAnswer = (index: number) => index < 4 ? ["0", "1", "1", "0"][index] : "observed";
export function recover(state: State, index: number): State {
  const item = state.practice[index];
  if (!item.reviewed || item.remediation !== recoveryAnswer(index) || !item.counts.every(count => count === 2)) throw Error("Review the targeted explanation and answer its changed-case check correctly.");
  return { ...state, practice: state.practice.map((entry, position) => position === index ? { ...blankPractice(index), cycle: Math.min(entry.cycle + 1, 1e6), passed: entry.passed } : entry) };
}
export function changeActivity(state: State, lesson: number, id: string): State {
  if (!ACTIVITIES[lesson].some(item => item.id === id)) throw Error("Unsupported activity configuration.");
  return { ...state, activities: state.activities.map((entry, index) => index === lesson ? { ...entry, config: id, changed: entry.changed || entry.config !== id, prediction: "", reason: "", revealed: false } : entry) };
}
export function checkActivity(state: State, lesson: number, at: string): State {
  const current = state.activities[lesson], fixture = ACTIVITIES[lesson].find(item => item.id === current.config)!;
  const correct = current.changed && current.prediction === fixture.output && current.reason === fixture.reasonId;
  return syncCompletion({ ...state, activities: state.activities.map((entry, index) => index === lesson ? { ...entry, revealed: true, passed: entry.passed || correct } : entry) }, lesson, at);
}
export function confirmAttempt(state: State, confirmed: boolean, at: string): State {
  if (!MASTERY_AVAILABLE) throw Error("Independent mastery is not available until full verification.");
  if (state.draft.phase === "results") return state;
  if (state.draft.phase !== "review" || !confirmed) throw Error("Review and explicit confirmation required.");
  const draft = state.draft;
  const result = scoreAssessment("essentials", INDEPENDENT_FORMS[draft.form], draft.answers.map((answers, index) => familyResponse(index, answers, draft.form, true)));
  const summary: Summary = { id: draft.id, form: draft.form, at, policy: POLICY_VERSION, content: CONTENT, score: result.score, outcomes: result.outcomes.map(item => item.correct), critical: result.failedCritical, passed: result.passed };
  let evidence = state.evidence;
  if (result.passed) {
    for (const objective of [MASTERY, ...result.outcomes.filter(item => item.correct).map(item => canonicalObjective(item.objective))]) {
      evidence = awardMastery(evidence, { id: `${ASSESSMENT}:${objective}`, objectiveId: objective, sourceType: "assessment", sourceId: ASSESSMENT, level: 2, awardedAt: at });
      evidence = { ...evidence, objectives: { ...evidence.objectives, [objective]: { ...evidence.objectives[objective], completed: true } } };
    }
  }
  const submitted: Draft = { ...draft, phase: "results", result: summary };
  return { ...state, evidence, draft: submitted, latest: submitted, history: [...state.history.filter(item => item.id !== draft.id), summary].slice(-20) };
}
export function retry(state: State, id: string): State {
  if (state.draft.phase !== "results" || !/^[a-zA-Z0-9_-]{1,128}$/.test(id) || id === state.draft.id || state.history.some(item => item.id === id)) throw Error("A submitted attempt and fresh identity are required.");
  return { ...state, draft: newDraft(id, ((state.draft.form + 1) % 3) as 0 | 1 | 2) };
}
export function resetLesson(state: State, lesson: number, confirmed: boolean, at: string): State {
  if (!confirmed) return state;
  const practice = state.practice.map((entry, index) => Math.floor(index / 4) === lesson ? blankPractice(index) : entry);
  const activities = state.activities.map((entry, index) => index === lesson ? blankActivity(index) : entry);
  const objectives = { ...state.evidence.objectives };
  for (const objective of LESSONS[lesson].objectives) {
    const id = canonicalObjective(objective.id), previous = objectives[id];
    if (previous) objectives[id] = { ...previous, completed: previous.mastered, evidenceIds: previous.evidenceIds.filter(item => item === `${ASSESSMENT}:${id}`), updatedAt: at };
  }
  return syncCompletion({ ...state, practice, activities, evidence: { ...state.evidence, objectives } }, lesson, at);
}
const integer = (value: unknown, maximum: number) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= maximum;
const date = (value: unknown): value is string => typeof value === "string" && Number.isFinite(Date.parse(value));
function validSummary(value: unknown): value is Summary {
  if (!record(value) || !keys(value, ["id", "form", "at", "policy", "content", "score", "outcomes", "critical", "passed"]) || !bounded(value, 2048) || typeof value.id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.id) || !integer(value.form, 2) || !date(value.at) || value.policy !== POLICY_VERSION || value.content !== CONTENT || !Array.isArray(value.outcomes) || value.outcomes.length !== 32 || !value.outcomes.every(item => typeof item === "boolean") || !Array.isArray(value.critical) || typeof value.passed !== "boolean") return false;
  const expectedCritical = INDEPENDENT_FORMS[value.form as number].filter((item, index) => item.critical && !(value.outcomes as boolean[])[index]).map(item => item.objective);
  const score = value.outcomes.filter(Boolean).length;
  return value.score === score && canonical(value.critical) === canonical(expectedCritical) && value.passed === (score >= 26 && expectedCritical.length === 0);
}
function validPacked(value: unknown, variant: number, independent: boolean, index?: number): boolean {
  if (!Array.isArray(value)) return false;
  if (index !== undefined) {
    const definition = (independent ? INDEPENDENT_FORMS : PRACTICE_FORMS)[variant][index];
    return value.length === definition.atoms.length && definition.atoms.every((atom, position) => validDraftAnswer(value[position], atom));
  }
  return value.length === 32 && value.every((answers, position) => validPacked(answers, variant, independent, position));
}
function validDraft(value: unknown): value is Draft {
  if (!record(value) || !keys(value, ["id", "form", "phase", "answers", "result"]) || typeof value.id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.id) || !integer(value.form, 2) || !["active", "review", "results"].includes(value.phase as string) || !validPacked(value.answers, value.form as number, true)) return false;
  if (value.phase !== "results") return value.result === null;
  if (!validSummary(value.result) || value.result.id !== value.id || value.result.form !== value.form) return false;
  try {
    const score = scoreAssessment("essentials", INDEPENDENT_FORMS[value.form as number], (value.answers as Answer[][]).map((answers, index) => familyResponse(index, answers, value.form as number, true)));
    return score.score === value.result.score && score.passed === value.result.passed && canonical(score.outcomes.map(item => item.correct)) === canonical(value.result.outcomes);
  } catch { return false; }
}
export function validateState(value: unknown): value is State {
  if (!bounded(value, 262144) || !record(value) || !keys(value, ["schema", "content", "policy", "environment", "evidence", "practice", "activities", "draft", "latest", "history", "transfer"]) || value.schema !== 2 || value.content !== CONTENT || value.policy !== POLICY_VERSION || value.environment !== ENVIRONMENT || !validateLearningEvidence(value.evidence) || value.evidence.curriculumVersion !== CONTENT || bytes(canonical(value.evidence)) > 32768 || !Array.isArray(value.practice) || value.practice.length !== 32 || !Array.isArray(value.activities) || value.activities.length !== 8 || !validDraft(value.draft) || !(value.latest === null || validDraft(value.latest) && value.latest.phase === "results") || !Array.isArray(value.history) || value.history.length > 20 || !value.history.every(validSummary)) return false;
  const practice = value.practice;
  if (!practice.every((item, index) => record(item) && keys(item, ["cycle", "counts", "variant", "answers", "passed", "last", "reviewed", "remediation"]) && integer(item.cycle, 1e6) && Array.isArray(item.counts) && item.counts.length === 2 && item.counts.every(count => integer(count, 2)) && integer(item.variant, 1) && validPacked(item.answers, item.variant as number, false, index) && typeof item.passed === "boolean" && (item.last === null || typeof item.last === "boolean") && typeof item.reviewed === "boolean" && typeof item.remediation === "string" && ["", "0", "1", "observed", "counter"].includes(item.remediation))) return false;
  if (!value.activities.every((item, index) => record(item) && keys(item, ["config", "changed", "prediction", "reason", "passed", "revealed"]) && ACTIVITIES[index].some(config => config.id === item.config) && ["changed", "passed", "revealed"].every(key => typeof item[key] === "boolean") && typeof item.prediction === "string" && (item.prediction === "" || activityPredictions(index).includes(item.prediction)) && typeof item.reason === "string" && (item.reason === "" || ACTIVITY_REASONS(index).some(reason => reason.id === item.reason)))) return false;
  const ids = LESSONS.flatMap(item => item.objectives.map(objective => canonicalObjective(objective.id)));
  const evidence = value.evidence;
  if (!record(evidence) || !keys(evidence, ["schemaVersion", "curriculumVersion", "lessons", "objectives", "assessmentAttempts", "masteryEvidence", "projectMilestones"]) || evidence.assessmentAttempts.length || evidence.projectMilestones.length || !Object.keys(evidence.lessons).every(id => LESSONS.some(lesson => id === `python.essentials.${lesson.slug}`)) || !Object.keys(evidence.objectives).every(id => ids.includes(id) || id === MASTERY)) return false;
  if (!Object.entries(evidence.lessons).every(([id, item]) => record(item) && keys(item, ["state", "completedObjectiveIds", "updatedAt"]) && ["started", "completed"].includes(item.state) && new Set(item.completedObjectiveIds).size === item.completedObjectiveIds.length && item.completedObjectiveIds.every(objective => ids.includes(objective) && objective.startsWith(id + ".")))) return false;
  if (!LESSONS.every((lesson, index) => (evidence.lessons[`python.essentials.${lesson.slug}`]?.state === "completed") === (practice.slice(index * 4, index * 4 + 4).every(item => item.passed) && (value.activities as ActivityState[])[index].passed))) return false;
  if (!evidence.masteryEvidence.every(item => ids.includes(item.objectiveId) || item.objectiveId === MASTERY) || new Set(evidence.masteryEvidence.map(item => item.id)).size !== evidence.masteryEvidence.length || !evidence.masteryEvidence.every(item => record(item) && keys(item, ["id", "objectiveId", "sourceType", "sourceId", "level", "awardedAt"]) && item.id === `${ASSESSMENT}:${item.objectiveId}` && item.sourceId === ASSESSMENT && item.sourceType === "assessment" && item.level === 2)) return false;
  if (!Object.entries(evidence.objectives).every(([id, item]) => record(item) && keys(item, ["completed", "mastered", "evidenceIds", "updatedAt"]) && item.evidenceIds.length <= 3 && new Set(item.evidenceIds).size === item.evidenceIds.length && item.evidenceIds.every(entry => entry === `${ASSESSMENT}:${id}` || entry === `${SOURCE_MAP}:${id}` || ids.some(objective => objective === id && entry === `${CONTENT}:${objective.split(".").slice(-2).join(".").toUpperCase()}:practice`)) && (!item.mastered || evidence.masteryEvidence.some(entry => entry.objectiveId === id)))) return false;
  const history = value.history;
  if (!ids.every((id, index) => {
    const objective = evidence.objectives[id];
    const mastered = evidence.masteryEvidence.some(item => item.objectiveId === id);
    return Boolean(objective?.mastered) === mastered && Boolean(objective?.completed) === (Boolean(practice[index].passed) || mastered);
  }) || Boolean(evidence.objectives[MASTERY]?.mastered) !== evidence.masteryEvidence.some(item => item.objectiveId === MASTERY)) return false;
  if (!Object.entries(evidence.lessons).every(([id, item]) => {
    const lesson = LESSONS.findIndex(entry => id === `python.essentials.${entry.slug}`);
    const expected = LESSONS[lesson].objectives.filter((_, offset) => practice[lesson * 4 + offset].passed).map(entry => canonicalObjective(entry.id));
    return canonical([...item.completedObjectiveIds].sort()) === canonical(expected.sort());
  })) return false;
  const latest = value.latest;
  if (new Set(history.map(item => item.id)).size !== history.length || bytes(canonical(history)) > 40960 || (latest !== null && !history.some(item => item.id === latest.id && canonical(item) === canonical(latest.result)))) return false;
  const transfer = value.transfer;
  if (!(transfer === null || record(transfer) && keys(transfer, ["map", "hash", "at", "sourceVersion", "sourceDates"]) && transfer.map === SOURCE_MAP && typeof transfer.hash === "string" && /^[a-f0-9]{64}$/.test(transfer.hash) && date(transfer.at) && transfer.sourceVersion === "python-p01.1.0.0" && Array.isArray(transfer.sourceDates) && transfer.sourceDates.length <= 5 && transfer.sourceDates.every(date))) return false;
  return bytes(canonical({ practice: practice.map(item => ({ ...item, answers: [] })), activities: value.activities, transfer })) <= 16384
    && bytes(canonical({ practice: practice.map(item => item.answers), draft: value.draft })) <= 65536
    && (value.latest === null || bytes(canonical(value.latest)) <= 65536);
}
export function serialize(state: State): string {
  if (!validateState(state)) throw Error("Unsupported Essentials state; earlier saved progress is preserved.");
  return canonical(state);
}
export function load(raw: string | null): State {
  if (raw === null) return emptyState();
  if (bytes(raw) > 262144) throw Error("Unsupported Essentials storage size.");
  const parsed: unknown = JSON.parse(raw);
  if (!validateState(parsed) || canonical(parsed) !== raw) throw Error("Unsupported Essentials version or encoding.");
  return parsed.draft.phase === "review" ? { ...parsed, draft: { ...parsed.draft, phase: "active" } } : parsed;
}
export type Preview = { raw: string; hash: string; source: P01Progress; completed: number; lessonCompleted: boolean };
export async function previewP01(storage: StoragePort): Promise<Preview> {
  const raw = storage.getItem(P01_KEY);
  if (raw === null) throw Error("No original P01 record is available.");
  let source: P01Progress;
  try { source = loadP01(raw); } catch { throw Error("Original P01 is corrupt or unsupported; its bytes were preserved and no copy is available."); }
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return { raw, hash: Array.from(new Uint8Array(digest)).map(item => item.toString(16).padStart(2, "0")).join(""), source, completed: source.practice.filter(item => item.passed).length, lessonCompleted: source.evidence.lessons["python.essentials.p01"]?.state === "completed" };
}
export function copyP01(target: State, preview: Preview, confirmed: boolean, at: string): State {
  if (!confirmed) throw Error("Preview and explicit copy confirmation required.");
  if (target.transfer?.map === SOURCE_MAP) return target;
  if (canonical(loadP01(preview.raw)) !== canonical(preview.source) || !/^[a-f0-9]{64}$/.test(preview.hash)) throw Error("Unsupported P01 source.");
  if (target.practice.slice(0, 4).some(item => item.passed || item.cycle || item.counts.some(Boolean) || item.answers.some(answer => answer.kind !== "unanswered")) || target.activities[0].changed || target.activities[0].revealed) throw Error("Module P01 already has work. Its progress will not be overwritten; original P01 remains available.");
  const source = preview.source;
  const practice = target.practice.map((item, index) => index < 4 ? { cycle: source.practice[index].cycle, counts: [...source.practice[index].counts] as [number, number], variant: source.practice[index].variant, answers: source.practice[index].response ?? blankAnswers(index, source.practice[index].variant), passed: source.practice[index].passed, last: null, reviewed: source.practice[index].reviewed, remediation: source.practice[index].counterexample } : item);
  let evidence = target.evidence;
  for (let index = 0; index < 4; index++) {
    const id = canonicalObjective(`P01.O${index + 1}`), original = source.evidence.objectives[id];
    if (original?.completed) {
      const latestDate = Date.parse(evidence.objectives[id]?.updatedAt ?? "") > Date.parse(original.updatedAt) ? evidence.objectives[id].updatedAt : original.updatedAt;
      evidence = recordObjectiveCompletion(evidence, id, `${SOURCE_MAP}:${id}`, latestDate);
    }
  }
  const originalLesson = source.evidence.lessons["python.essentials.p01"];
  if (originalLesson) evidence = { ...evidence, lessons: { ...evidence.lessons, "python.essentials.p01": structuredClone(originalLesson) } };
  return { ...target, practice, activities: target.activities.map((item, index) => index === 0 ? structuredClone(source.experiment) : item), evidence,
    transfer: { map: SOURCE_MAP, hash: preview.hash, at, sourceVersion: source.content, sourceDates: [...Object.values(source.evidence.objectives).map(item => item.updatedAt), ...(originalLesson ? [originalLesson.updatedAt] : [])] } };
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
    catch { this.writable = false; this.warning = "Essentials storage is unsupported or unavailable. Earlier bytes are preserved; work is in memory only and not saved."; }
    this.loaded = true;
    return this.state;
  }
  save(state: State) {
    if (!this.loaded) throw Error("Hydrate before saving.");
    const raw = serialize(state);
    this.state = state;
    if (this.writable) try {
      if (this.storage.getItem(STORAGE_KEY) !== this.raw) throw Error("Another tab changed progress.");
      this.storage.setItem(STORAGE_KEY, raw); this.raw = raw;
    } catch { this.writable = false; this.warning = "Essentials could not save (storage failure or another tab changed progress). Earlier bytes remain; this visit is in memory only and not saved."; }
    return this.state;
  }
  transfer(preview: Preview, confirmed: boolean, at: string) {
    if (!this.loaded || !this.writable) throw Error("Saving must be available before copying P01.");
    if (this.storage.getItem(P01_KEY) !== preview.raw || this.storage.getItem(STORAGE_KEY) !== this.raw) throw Error("Progress changed after preview. Preview again; nothing was copied.");
    const next = copyP01(this.state, preview, confirmed, at);
    if (next === this.state) return this.state;
    const raw = serialize(next);
    try { this.storage.setItem(STORAGE_KEY, raw); }
    catch { throw Error("Copy was not saved. Original P01 and previous Essentials bytes are unchanged."); }
    this.raw = raw; this.state = next;
    return next;
  }
  reset(confirmed: boolean) {
    if (!this.loaded || !confirmed) return this.state;
    const next = emptyState();
    try { const raw = serialize(next); this.storage.setItem(STORAGE_KEY, raw); this.raw = raw; this.writable = true; this.warning = ""; }
    catch { this.writable = false; this.warning = "Essentials reset is in memory only and not saved; earlier stored bytes remain."; }
    this.state = next;
    return next;
  }
}
