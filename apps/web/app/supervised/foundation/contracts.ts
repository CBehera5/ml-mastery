import authored from "./authored.json";
import { bounded, gradeFamily, validateDefinition, type Family, type FamilyResponse } from "../../python/foundation/contracts";

export { canonical, bytes, bounded, keys, record, validDraftAnswer, gradeFamily, closeNumber } from "../../python/foundation/contracts";
export type { Answer, Atom, Family, FamilyResponse, Grade } from "../../python/foundation/contracts";
export const CONTENT = "supervised.ev01.1.0.0";
export const POLICY = "supervised.prototype.1.0.0";
export const MODULE_MASTERY_AVAILABLE = false;
export const OBJECTIVES = ["EV01.O1", "EV01.O2", "EV01.O3", "EV01.O4"] as const;
export type Scene = {
  id: string; title: string; domain: string; requireGroup: boolean; requireTime: boolean;
  rows: { id: string; group: string; time: number }[];
  plans: { id: string; label: string; train: string[]; test: string[] }[];
  features: { id: string; label: string; observedAt: number }[];
};
function freeze<Value>(value: Value): Value {
  if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
export const SCENES = freeze(authored.scenes as Scene[]);
export const PRACTICE = freeze(authored.practice.map(item => item.family as Family));
if (authored.version !== CONTENT || PRACTICE.length !== 8 || !PRACTICE.every(family => validateDefinition(family) && OBJECTIVES.some(id => id === family.objective) && family.critical === (family.objective === "EV01.O2"))) throw new Error("Unsupported EV01 authored catalog.");
export function gradePractice(id: string, response: unknown) {
  const family = PRACTICE.find(item => item.id === id);
  return family ? gradeFamily(family, response) : { status: "invalid" as const, feedback: "This activity is unavailable. Choose a listed practice instance." };
}
export function responseFor(family: Family, answers: FamilyResponse["answers"][number]["answer"][]): FamilyResponse {
  return { familyId: family.id, answers: family.atoms.map((atom, index) => ({ atomId: atom.id, answer: answers[index] ?? { kind: "unanswered" } })) };
}
export const CONFIGS = freeze(SCENES.flatMap(scene => scene.features.flatMap(feature => scene.plans.map(plan => `${scene.id}:${feature.id}:${plan.id}`))));
export function selection(config: string) {
  if (!CONFIGS.includes(config)) throw new Error("Choose a listed experiment configuration.");
  const [sceneId, featureId, planId] = config.split(":");
  const scene = SCENES.find(item => item.id === sceneId)!;
  return { scene, feature: scene.features.find(item => item.id === featureId)!, plan: scene.plans.find(item => item.id === planId)! };
}
export function analyze(config: string) {
  const { scene, feature, plan } = selection(config);
  const train = scene.rows.filter(row => plan.train.includes(row.id));
  const test = scene.rows.filter(row => plan.test.includes(row.id));
  const overlap = plan.train.filter(id => plan.test.includes(id)).sort();
  const groups = scene.requireGroup ? [...new Set(train.map(row => row.group).filter(group => test.some(row => row.group === group)))].sort() : [];
  const future = scene.requireTime ? train.filter(row => row.time >= Math.min(...test.map(item => item.time))).map(row => row.id) : [];
  const featureValid = feature.observedAt <= 0;
  const splitValid = !overlap.length && !groups.length && !future.length;
  return { featureValid, splitValid, valid: featureValid && splitValid, overlap, groups, future, reason: featureValid && splitValid ? "both-valid" : splitValid ? "feature-future" : featureValid ? "split-invalid" : "both-invalid" };
}
export const REASONS = [
  { id: "both-valid", label: "The feature is available by t=0 and the split preserves the declared boundaries." },
  { id: "feature-future", label: "The split is valid, but this feature only exists after prediction time." },
  { id: "split-invalid", label: "The feature is timely, but rows, required groups or future cohorts cross the split boundary." },
  { id: "both-invalid", label: "Both fail: the feature is from the future and the split crosses a required boundary." },
] as const;

export const EV_POLICY = Object.freeze({ count: 24, threshold: 20, critical: Object.freeze(Array.from({ length: 6 }, (_, index) => `EV0${index + 1}.O2`)) });
export function verifyPolicyOutcomes(outcomes: readonly { objective: string; correct: boolean }[]) {
  const expected = Array.from({ length: 24 }, (_, index) => `EV0${Math.floor(index / 4) + 1}.O${index % 4 + 1}`);
  if (!bounded(outcomes) || outcomes.length !== 24 || new Set(outcomes.map(item => item.objective)).size !== 24 || !expected.every(id => outcomes.some(item => item.objective === id && typeof item.correct === "boolean"))) throw new Error("Complete versioned EV policy outcomes required.");
  const score = outcomes.filter(item => item.correct).length;
  return { score, passed: score >= EV_POLICY.threshold && EV_POLICY.critical.every(id => outcomes.find(item => item.objective === id)?.correct) };
}
