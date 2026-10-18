import { validateLearningEvidence, type LearningEvidenceV1 } from "../learn/foundation/evidence";
import { bounded, canonical, record } from "../python/foundation/contracts";
import { PYTHON_MODULES } from "./catalog";

export type Target = { title: string; href: string; stage: string; why: string; detail: string; at?: string };
export type ScopeSummary = { title: string; href: string; active: boolean; mastery: string; target?: Target };
export type JourneyProgress = { scopes: ScopeSummary[]; warnings: string[] };
export type ReadPort = Pick<Storage, "getItem">;
const evidenceKey = (scope: string) => `ml-math-lab:evidence:${scope}:v1`;
const mathWhy = "Mathematical representations and local change explain how models predict and learn.";
const SUBJECT_PURPOSE: Record<string, string> = {
  "math.algebra": "Variables, functions and graphs explain how features become predictions through a parameterized rule.",
  "math.linear-algebra": "Ordered vectors and compatible matrix products keep feature contributions and batch predictions meaningful.",
  "math.linear-algebra.geometry": "Transformations show how coordinates, information and directions change before they become model inputs.",
  "math.calculus.extension": "Partial derivatives and gradients describe how training loss responds to several model parameters.",
  "math.probability": "Conditioning and uncertainty help interpret probabilistic predictions without treating them as guarantees.",
  "math.statistics": "Population, spread and paired observations determine what a data summary or evaluation can justify.",
  "math.optimization": "Loss geometry, update direction and step size explain how training can improve or become unstable.",
  "math.integration": "Connect representations, predictions, loss and evaluation in one bounded modeling scenario.",
};
export const EVIDENCE_SCOPES = [
  { scope: "math.algebra", version: "algebra.functions.v1", prefix: "algebra.functions", title: "Algebra, functions and graphs", href: "/math/algebra-functions", mastery: "algebra.functions.mastery", lessons: ["variables", "functions", "graphs", "powers", "logarithms", "transformations"] },
  { scope: "math.linear-algebra", version: "linear-algebra.core.v1", prefix: "linear-algebra.foundations", title: "Linear Algebra core", href: "/math/linear-algebra", mastery: "linear-algebra.foundations.core-mastery", lessons: ["vectors", "matrices"] },
  { scope: "math.linear-algebra.geometry", version: "linear-algebra.geometry.v1", prefix: "linear-algebra.foundations", title: "Linear Algebra geometry", href: "/math/linear-algebra", mastery: "linear-algebra.foundations.module-mastery.v2", lessons: ["geometry.transformations", "geometry.eigenvectors"] },
  { scope: "math.calculus.extension", version: "calculus.extension.v1", prefix: "calculus.extension", title: "Calculus essentials", href: "/math/derivatives#calculus-essentials", mastery: "calculus.extension.mastery.v1", lessons: [] },
  { scope: "math.probability", version: "probability.foundations.v1", prefix: "probability.foundations", title: "Probability", href: "/math/probability", mastery: "probability.foundations.mastery.v1", lessons: ["understanding", "multiple-events", "conditional", "bayes", "distributions", "ml"] },
  { scope: "math.statistics", version: "statistics.foundations.v1", prefix: "statistics.foundations", title: "Statistics", href: "/math/statistics", mastery: "statistics.foundations.mastery.v1", lessons: ["data", "center", "spread", "distributions", "relationships", "sampling", "ml"] },
  { scope: "math.optimization", version: "optimization.foundations.v1", prefix: "optimization.foundations", title: "Optimization", href: "/math/optimization", mastery: "optimization.foundations.mastery.v1", lessons: ["objectives", "updates", "geometry", "stability", "regularization", "responsible"] },
  { scope: "math.integration", version: "math.integration.v1", prefix: "math.integration", title: "Math integration practice", href: "/math/integration", mastery: "", lessons: [] },
  { scope: "linear-regression", version: "linear-regression.v1", prefix: "linear-regression", title: "Linear Regression", href: "/learn/linear-regression", mastery: "linear-regression.mastery.objective", lessons: ["why", "equation", "errors", "gradient-descent", "multiple-features", "implementation", "failure-modes", "project", "mastery"] },
] as const;
export const PYTHON_KEYS = PYTHON_MODULES.map(module => `ml-math-lab:python:${module.id}:v${module.id === "essentials" ? 2 : 1}`);
export const EXTRA_KEYS = ["ml-math-lab:python:essentials:v1", "ml-math-lab:topic:derivatives:v1", "ml-math-lab:assessment:linear-regression:mastery:v1", "ml-math-lab:project:linear-regression:bridge:v1"];
export const LEGACY_LESSONS = ["vectors-dot-product", "matrices-multiplication", "functions-derivatives"];
export const MATH_DRAFT_KEYS = ["ml-math-lab:assessment:math.algebra:v1", "ml-math-lab:assessment:math.linear-algebra:core:v1", "ml-math-lab:assessment:math.linear-algebra:module:v2"];
export const READ_KEYS = [...EVIDENCE_SCOPES.map(scope => evidenceKey(scope.scope)), ...PYTHON_KEYS, ...EXTRA_KEYS, ...LEGACY_LESSONS.map(id => `ml-math-lab:lesson:${id}:v1`), ...MATH_DRAFT_KEYS];
const hasEvidence = (evidence: LearningEvidenceV1) => Object.keys(evidence.lessons).length > 0 || Object.keys(evidence.objectives).length > 0 || evidence.assessmentAttempts.length > 0 || evidence.projectMilestones.length > 0;
const latest = (evidence: LearningEvidenceV1) => [...Object.values(evidence.lessons).map(item => item.updatedAt), ...Object.values(evidence.objectives).map(item => item.updatedAt), ...evidence.assessmentAttempts.map(item => item.submittedAt)].sort((left, right) => Date.parse(right) - Date.parse(left))[0];
const meaningful = (answer: { kind: string }) => answer.kind !== "unanswered";
type PythonState = {
  evidence: LearningEvidenceV1;
  practice: { passed: boolean; counts: [number, number]; answers: { kind: string }[] }[];
  activities: { changed: boolean; passed: boolean }[];
  draft: { phase: string; answers: { kind: string }[][] };
  history: { critical: string[]; passed: boolean; at: string }[];
};
type Lesson = { slug: string; title: string; motivation?: string };
function pythonSummary(module: typeof PYTHON_MODULES[number], state: PythonState, lessons: readonly Lesson[], complete: (index: number) => boolean): ScopeSummary {
  const active = hasEvidence(state.evidence) || state.practice.some(item => item.counts.some(Boolean) || item.answers.some(meaningful)) || state.activities.some(item => item.changed) || state.draft.answers.some(answers => answers.some(meaningful));
  const mastered = state.evidence.objectives[`python.${module.id}.mastery.v1`]?.mastered === true;
  const href = `/python/${module.id}`;
  const route = (index: number) => module.id === "essentials" && index === 0 ? module.first : `${href}/${lessons[index].slug}`;
  const at = latest(state.evidence);
  const base = { title: module.title, href, active, mastery: mastered ? "Mastery demonstrated" : "Mastery not yet demonstrated" };
  const target = (title: string, link: string, detail: string, why: string = module.why): ScopeSummary => ({ ...base, target: { title, href: link, stage: `Python for ML / ${module.title}`, why, detail, at } });
  if (state.draft.phase !== "results" && state.draft.answers.some(answers => answers.some(meaningful))) return target(`${module.title} independent assessment`, `${href}/mastery`, mastered ? "Resume a reassessment. Earlier mastery remains recorded." : "Resume saved assessment answers; review and confirmation remain required.");
  const failed = state.history.at(-1);
  if (failed && !failed.passed && failed.critical.length) {
    const index = lessons.findIndex(lesson => failed.critical.some(id => id.toLowerCase().startsWith(lesson.slug + ".")));
    if (index >= 0) return target(lessons[index].title, route(index), `Suggested critical-objective recall: ${failed.critical.join(", ")}. ${mastered ? "Earlier mastery remains recorded." : "Completion alone does not award mastery."}`, lessons[index].motivation);
  }
  if (mastered) return target(`${module.title} overview`, href, "Independent mastery is already recorded. Revisit any explanation or choose more practice; completion is separate.");
  const started = lessons.findIndex((lesson, index) => !complete(index) && (state.practice.slice(index * 4, index * 4 + 4).some(item => item.counts.some(Boolean) || item.answers.some(meaningful)) || state.activities[index].changed || state.evidence.lessons[`python.${module.id}.${lesson.slug}`]));
  const index = started >= 0 ? started : lessons.findIndex((_, index) => !complete(index));
  if (active) return index >= 0 ? target(lessons[index].title, route(index), "Suggested continuation from saved work, not a last-visited record.", lessons[index].motivation) : target(`${module.title} overview`, href, "Review saved completion and choose practice or the independent assessment.");
  return base;
}
async function readPython(index: number, raw: string): Promise<ScopeSummary> {
  const module = PYTHON_MODULES[index];
  switch (module.id) {
    case "essentials": { const model = await import("../python/essentials/model"); const catalog = await import("../python/essentials/catalog"); const state = model.load(raw); return pythonSummary(module, state, catalog.LESSONS, index => model.lessonComplete(state, index)); }
    case "numpy": { const model = await import("../python/numpy/model"); const catalog = await import("../python/numpy/catalog"); const state = model.load(raw); return pythonSummary(module, state, catalog.LESSONS, index => model.lessonComplete(state, index)); }
    case "pandas": { const model = await import("../python/pandas/model"); const catalog = await import("../python/pandas/catalog"); const state = model.load(raw); return pythonSummary(module, state, catalog.LESSONS, index => model.lessonComplete(state, index)); }
    case "visualization": { const model = await import("../python/visualization/model"); const catalog = await import("../python/visualization/catalog"); const state = model.load(raw); return pythonSummary(module, state, catalog.LESSONS, index => model.lessonComplete(state, index)); }
    case "preparation": { const model = await import("../python/preparation/model"); const catalog = await import("../python/preparation/catalog"); const state = model.load(raw); return pythonSummary(module, state, catalog.LESSONS, index => model.lessonComplete(state, index)); }
    case "sklearn": { const model = await import("../python/sklearn/model"); const catalog = await import("../python/sklearn/catalog"); const state = model.load(raw); return pythonSummary(module, state, catalog.LESSONS, index => model.lessonComplete(state, index)); }
  }
}
function evidenceSummary(config: typeof EVIDENCE_SCOPES[number], raw: string): ScopeSummary {
  const value: unknown = JSON.parse(raw);
  if (!bounded(value, 262144) || !validateLearningEvidence(value) || value.curriculumVersion !== config.version) throw Error("Unsupported evidence");
  const owns = (id: string) => id === config.prefix || id.startsWith(config.prefix + ".");
  if (![...Object.keys(value.lessons), ...Object.keys(value.objectives), ...value.masteryEvidence.map(item => item.objectiveId)].every(owns)) throw Error("Foreign scope");
  const active = hasEvidence(value);
  const mastered = Boolean(config.mastery && value.objectives[config.mastery]?.mastered);
  const lesson = Object.entries(value.lessons).filter(([id]) => config.lessons.some(slug => id === `${config.prefix}.${slug}`)).sort((left, right) => {
    const unfinished = Number(right[1].state === "started" || right[1].state === "visited") - Number(left[1].state === "started" || left[1].state === "visited");
    return unfinished || Date.parse(right[1].updatedAt) - Date.parse(left[1].updatedAt);
  })[0];
  const slug = lesson?.[0].slice(config.prefix.length + 1);
  let href: string = config.href;
  if (slug && config.scope === "math.linear-algebra") href = slug === "vectors" ? "/math/vectors-dot-product" : "/math/matrices-multiplication";
  else if (slug && config.scope === "math.linear-algebra.geometry") href = `/math/linear-algebra/${slug.split(".").at(-1)}`;
  else if (slug) href = `${config.href}/${slug}`;
  return { title: config.title, href: config.href, active, mastery: config.mastery ? mastered ? "Mastery demonstrated" : "Mastery not yet demonstrated" : "Practice only; no module mastery", target: active ? { title: config.title, href, stage: config.scope === "linear-regression" ? "ML Algorithms / Linear Regression" : `Math Foundations / ${config.title}`, why: SUBJECT_PURPOSE[config.scope] ?? "Connect features, training loss and unseen-data evaluation in a complete prediction model.", detail: "Suggested continuation from validated objective evidence. Open the subject for full progress details.", at: latest(value) } : undefined };
}
export async function readJourneyProgress(storage: ReadPort): Promise<JourneyProgress> {
  const scopes: ScopeSummary[] = [], warnings: string[] = [];
  async function read(key: string, title: string, parse: (raw: string) => ScopeSummary | Promise<ScopeSummary>) {
    try {
      const raw = storage.getItem(key);
      if (raw === null) return;
      if (new TextEncoder().encode(raw).length > 262144) throw Error("Oversized progress");
      scopes.push(await parse(raw));
    } catch { warnings.push(`${title}: progress could not be read or its version is unsupported. Original records are untouched.`); }
  }
  for (const config of EVIDENCE_SCOPES) await read(evidenceKey(config.scope), config.title, raw => evidenceSummary(config, raw));
  for (const [index, module] of PYTHON_MODULES.entries()) await read(PYTHON_KEYS[index], module.title, raw => readPython(index, raw));
  await read(EXTRA_KEYS[0], "Original P01 pilot", async raw => {
    const model = await import("../python/foundation/progress");
    const state = model.loadProgress(raw);
    const active = hasEvidence(state.evidence) || state.practice.some(item => item.counts.some(Boolean) || item.response?.some(meaningful)) || state.experiment.changed;
    return { title: "Original P01 pilot", href: "/python/essentials/p01", active, mastery: "Practice only; independent module mastery is separate", target: active ? { title: "Original P01: values, names and units", href: "/python/essentials/p01", stage: "Python for ML / original P01 pilot", why: PYTHON_MODULES[0].why, detail: "Original pilot evidence is separate. Copying into Essentials still requires preview and explicit opt-in.", at: latest(state.evidence) } : undefined };
  });
  await read(EXTRA_KEYS[1], "Derivatives pilot", async raw => {
    const model = await import("../math/derivatives/curriculum");
    const state = model.loadTopicProgress(raw), active = state.completed.length > 0 || state.bestScore > 0 || state.mastered;
    return { title: "Derivatives pilot", href: "/math/derivatives", active, mastery: state.mastered ? "Pilot mastery demonstrated; extension is separate" : "Pilot mastery not yet demonstrated", target: active ? { title: "Derivatives", href: "/math/derivatives", stage: "Math Foundations / Calculus", why: "Derivatives explain how a loss changes when a model parameter changes.", detail: "Suggested continuation from the historical pilot. Choose an internal topic; no exact last visit was saved." } : undefined };
  });
  await read(EXTRA_KEYS[2], "Regression assessment draft", async raw => {
    const model = await import("../learn/linear-regression/mastery/assessment");
    const input: unknown = JSON.parse(raw), state = model.parseAssessmentDraft(raw);
    if (!record(input) || input.version !== state.version || input.assessmentVersion !== state.assessmentVersion || input.variant !== state.variant || !["active", "review", "submitted"].includes(String(input.phase)) || (input.phase === "submitted") !== (state.phase === "submitted") || !record(input.responses) || canonical(input.responses) !== canonical(state.responses)) throw Error("Unsupported draft");
    const active = state.phase !== "submitted" && Object.keys(state.responses).length > 0;
    return { title: "Regression assessment draft", href: "/learn/linear-regression/mastery", active, mastery: "Draft answers do not award mastery", target: active ? { title: "Independent Regression assessment", href: "/learn/linear-regression/mastery", stage: "ML Algorithms / Linear Regression", why: "Check prediction, fitting and evaluation understanding before claiming competence.", detail: "Resume saved answers. Native review and explicit submission remain required." } : undefined };
  });
  await read(EXTRA_KEYS[3], "Regression guided bridge", async raw => {
    const model = await import("../learn/linear-regression/project/project-model");
    const input: unknown = JSON.parse(raw), state = model.parseProjectSession(raw);
    if (!bounded(input, 262144) || canonical(input) !== canonical(state)) throw Error("Unsupported bridge record");
    const active = state.hasRun || state.inspected.length > 0 || Object.keys(state.answers).length > 0 || canonical(state.config) !== canonical(model.emptySession().config);
    return { title: "Regression guided bridge", href: "/learn/linear-regression/project", active, mastery: "Guided project activity is not independent mastery", target: active ? { title: "Guided Regression housing bridge", href: "/learn/linear-regression/project", stage: "ML Algorithms / applied Regression practice", why: "Connect preparation, training and held-out metrics in a small fictional workflow.", detail: "This existing bridge is not the planned full Project Studio." } : undefined };
  });
  for (const id of LEGACY_LESSONS) await read(`ml-math-lab:lesson:${id}:v1`, id, raw => {
    const flags: unknown = JSON.parse(raw);
    if (!Array.isArray(flags) || flags.length !== 5 || !flags.every(value => typeof value === "boolean")) throw Error("Unsupported legacy lesson");
    const active = flags.some(Boolean), href = `/math/${id}`, title = id.replaceAll("-", " ");
    return { title, href, active, mastery: "Legacy lesson practice only; independent mastery is separate", target: active ? { title, href, stage: "Math Foundations / retained lesson", why: mathWhy, detail: "Saved legacy activity flags, not a whole-module mastery award or last-visited record." } : undefined };
  });
  for (const [index, key] of MATH_DRAFT_KEYS.entries()) await read(key, index === 0 ? "Algebra assessment" : "Linear Algebra assessment", async raw => {
    const input: unknown = JSON.parse(raw);
    const state = index === 0 ? (await import("../math/algebra-functions/model")).parseDraft(raw) : index === 1 ? (await import("../math/linear-algebra/model")).parseDraft(raw) : (await import("../math/linear-algebra/geometry-model")).parseDraft(raw);
    if (!bounded(input, 262144) || !record(input) || input.version !== state.version || input.variant !== state.variant || !["active", "review", "submitted"].includes(String(input.phase)) || (input.phase === "submitted") !== (state.phase === "submitted") || !record(input.responses) || canonical(input.responses) !== canonical(state.responses)) throw Error("Unsupported Math draft");
    const active = state.phase !== "submitted" && Object.keys(state.responses).length > 0;
    const href = index === 0 ? "/math/algebra-functions/assessment" : index === 1 ? "/math/linear-algebra/assessment" : "/math/linear-algebra/mastery";
    const title = index === 0 ? "Algebra assessment" : index === 1 ? "Linear Algebra core assessment" : "Linear Algebra module assessment";
    return { title, href, active, mastery: "Draft answers do not award mastery", target: active ? { title, href, stage: "Math Foundations / independent assessment", why: mathWhy, detail: "Resume supported saved responses with the original assessment's review and confirmation." } : undefined };
  });
  return { scopes, warnings };
}
export const START: Target = { title: "Variables and equations", href: "/math/algebra-functions/variables", stage: "Suggested start / Math Foundations", why: "Features become predictions through mathematical rules. Start by understanding variables, units and equations.", detail: "No learning activity found in the supported local records. Explore any available topic; the order is not locked." };
export function recommend(progress: JourneyProgress): Target {
  const targets = progress.scopes.flatMap(scope => scope.target ? [scope.target] : []);
  const ordered = targets.map((target, index) => ({ target, index })).sort((left, right) => {
    if (left.target.at && right.target.at) return Date.parse(right.target.at) - Date.parse(left.target.at) || left.index - right.index;
    if (left.target.at) return -1;
    if (right.target.at) return 1;
    return left.index - right.index;
  });
  if (ordered.length) return ordered[0].target;
  return progress.warnings.length ? { ...START, detail: "Some saved progress could not be read. You can still browse or start a lesson; no record was reset." } : START;
}

