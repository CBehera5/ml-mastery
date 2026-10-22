import authored from "./authored.json";
import first from "../../../../../docs/verification/knn/kn-e1.manifest.v1.json";
import second from "../../../../../docs/verification/knn/kn-e2.manifest.v1.json";
import lock from "../../../../../docs/verification/knn/freeze-lock.v1.json";
import { bounded, gradeFamily, validateDefinition, type Answer, type Family, type FamilyResponse } from "../../python/foundation/contracts";
export { LESSONS } from "./teaching";
export const CONTENT = "supervised.knn.1.0.0";
export const POLICY = "supervised.knn.policy.1.0.0";
export const ASSESSMENT = "supervised.knn.mastery.1.0.0";
export const SCOPE = "supervised.knn.full.v1";
export const FIXTURES = Object.values(lock.sha256).join(":");
function freeze<Value>(value: Value): Value {
  if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
freeze(authored); freeze(first); freeze(second);
export const OBJECTIVES = freeze(Array.from({ length: 16 }, (_, index) => `KN0${Math.floor(index / 4) + 1}.O${index % 4 + 1}`));
const definitions = (mode: string, suffix: string) => OBJECTIVES.map(id => authored.families.find(item => item.objective === id && item.id.includes(mode) && item.id.endsWith(suffix))! as Family);
export const PRACTICE = freeze(["A", "B"].map(suffix => definitions("practice", suffix)));
export const FORMS = freeze(["A", "B", "C"].map(suffix => definitions("assessment", suffix)));
export type Config = { id: string; fixture: string; controls: Record<string, unknown>; prediction_question: string; expected: Record<string, unknown>; why: string };
type Manifest = { id: string; initial_configuration: string; fixtures: { id: string; [key: string]: unknown }[]; configurations: Config[] };
type RawState = { id: string; dataset_id?: string; query_index?: number; k?: number; weights?: string; scaled?: boolean; text?: string; outcome?: { tag: string; reason: string }; [key: string]: unknown };
type Dataset = { id: string; labels: number[]; [key: string]: unknown };
export const LABS: readonly Manifest[] = freeze([first, second].map(manifest => ({
  id: manifest.id, initial_configuration: manifest.configurations[0].id, fixtures: manifest.datasets,
  configurations: (manifest.configurations as RawState[]).map(config => {
    const dataset = (manifest.datasets as Dataset[]).find(item => item.id === config.dataset_id);
    return { id: config.id, fixture: config.dataset_id ?? "permission-diagnostic", controls: { query: config.query_index ?? "not applicable", k: config.k ?? "rejected", weighting: config.weights ?? "not applicable", scaled: config.scaled ?? false },
      prediction_question: "Predict class0, class1, or rejection, then explain why before comparing the frozen result.",
      expected: { ...config, labels: dataset?.labels ?? [], reason: config.outcome ? "rejection-boundary" : "distance-selects-labels-vote" },
      why: config.outcome ? config.outcome.reason : `${config.text} ${manifest.explanation}` };
  })
})));
export const configurations = (lab: number): readonly Config[] => {
  if (![0, 1].includes(lab)) throw Error("Choose a listed experiment.");
  return LABS[lab].configurations;
};
export const configFor = (lab: number, id: string) => {
  const config = configurations(lab).find(item => item.id === id);
  if (!config) throw Error("Choose a listed experiment configuration.");
  return config;
};
export const PREDICTIONS = freeze(["Class0 — stays", "Class1 — churns", "Reject this configuration"]);
export const EXPLANATIONS = freeze(["distance-selects-labels-vote", "rejection-boundary", "training-accuracy-guarantees-risk", "labels-define-distance"]);
export const VALID_CATALOG = authored.content === CONTENT && authored.families.length === 80 && [...PRACTICE, ...FORMS].every(form => form.length === 16 && form.every((item, index) => item && validateDefinition(item) && item.objective === OBJECTIVES[index] && item.critical === (index % 4 === 1) && (!item.critical || item.atoms.length === 2))) && configurations(0).length === 34 && configurations(1).length === 27;
export const VERIFICATION_RELEASED = true;
export const MASTERY_AVAILABLE = VERIFICATION_RELEASED && VALID_CATALOG;
export function response(family: Family, answers: readonly Answer[]): FamilyResponse {
  return { familyId: family.id, answers: family.atoms.map((atom, index) => ({ atomId: atom.id, answer: answers[index] ?? { kind: "unanswered" } })) };
}
export function score(form: number, answers: readonly (readonly Answer[])[]) {
  if (!VALID_CATALOG || ![0, 1, 2].includes(form) || !bounded(answers) || answers.length !== 16) throw Error("Complete versioned KNN assessment required.");
  const outcomes = FORMS[form].map((family, index) => {
    if (!Array.isArray(answers[index]) || answers[index].length !== family.atoms.length) throw Error("Incomplete assessment representation.");
    const grade = gradeFamily(family, response(family, answers[index]));
    if (grade.status === "invalid") throw Error("Unsupported assessment representation; complete or clear the answer.");
    return grade.correct;
  });
  const correct = outcomes.filter(Boolean).length;
  const critical = OBJECTIVES.filter((_, index) => index % 4 === 1 && !outcomes[index]);
  return { score: correct, outcomes, critical, passed: correct >= 13 && critical.length === 0 };
}
