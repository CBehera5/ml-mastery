import { bounded, gradeFamily, validateDefinition, type Answer, type Family, type FamilyResponse } from "../../python/foundation/contracts";
import { AUTHORED_FAMILIES } from "./authored";

export const CONTENT = "supervised.model-selection.1.0.0";
export const POLICY = "supervised.model-selection.policy.1.0.0";
export const ASSESSMENT = "supervised.model-selection.mastery.1.0.0";
export const SCOPE = "supervised:model-selection:full:v1";
export const FIXTURES = "TASK-015.12-MODEL-SELECTION-FREEZE-V1:45dd5525:6450e606";
export const OBJECTIVES = Object.freeze(Array.from({ length: 24 }, (_, index) => `MS0${Math.floor(index / 4) + 1}.O${index % 4 + 1}`));
const e1 = ["REGRESSION-MEAN-BASELINE", "REGRESSION-MULTIPLE-LINEAR", "REGRESSION-POLYNOMIAL-DEGREE-2", "REGRESSION-RIDGE-ALPHA-1", "REGRESSION-LASSO-ALPHA-0.1", "REGRESSION-TREE-DEPTH-2", "REGRESSION-FOREST-16", "REGRESSION-BOOSTING-12", "CLASSIFICATION-PRIOR-BASELINE", "CLASSIFICATION-LOGISTIC-C1", "CLASSIFICATION-KNN-K3", "CLASSIFICATION-GAUSSIAN-NB", "CLASSIFICATION-TREE-DEPTH-2", "CLASSIFICATION-FOREST-16", "CLASSIFICATION-BOOSTING-12", "CLASSIFICATION-LINEAR-SVC-C1", "CLASSIFICATION-MLP-4-RELU", "REJECT-MISMATCHED-VALIDATION-ROWS", "REJECT-GLOBAL-PREPROCESS-FIT", "REJECT-TEST-BASED-SELECTION"];
const e2 = ["NESTED-GROUPED-CV-LEGAL", "GRID-SEARCH-DEV-LEGAL", "RANDOM-SEARCH-SEEDED-LEGAL", "DEVELOPMENT-THRESHOLD-COST-LEGAL", "SIMPLE-ADEQUATE-MODEL-LEGAL", "PERMUTATION-DEVELOPMENT-HOLDOUT", "FINAL-TEST-EVALUATION-ONCE", "REJECT-ROW-WISE-SPLIT-GROUP-OVERLAP", "REJECT-GLOBAL-PREPROCESS-FIT", "REJECT-TUNE-ON-OUTER-HOLDOUT", "REJECT-SELECT-ON-TEST"];
export type Experiment = { id: string; configs: readonly { id: string; label: string }[] };
export const EXPERIMENTS: readonly Experiment[] = Object.freeze([
  { id: "MS-E1", configs: Object.freeze(e1.map(id => ({ id: `MS-E1-${id}`, label: id.replaceAll("-", " · ") }))) },
  { id: "MS-E2", configs: Object.freeze(e2.map(id => ({ id: `MS-E2-${id}`, label: id.replaceAll("-", " · ") }))) },
]);
export type Config = { id: string; kind: string; predictionQuestion: string; predictionOptions: { id: string; label: string }[]; reasonOptions: { id: string; label: string }[]; correctPrediction: string; correctReason: string; explanation: string; counterexample: string; reference: Record<string, unknown> };
export const configIds = (lab: number) => EXPERIMENTS[lab]?.configs ?? [];
export async function fetchConfig(lab: number, id: string): Promise<unknown> {
  if (!EXPERIMENTS[lab]?.configs.some(config => config.id === id)) throw Error("Choose one of the reviewed experiment states.");
  const response = await fetch(`/api/supervised/model-selection/experiment?lab=${lab}&id=${encodeURIComponent(id)}`);
  if (!response.ok) throw Error("This frozen reference state is unavailable; saved learner progress is unchanged.");
  return response.json();
}
const definitions = (suffix: string) => OBJECTIVES.map(id => AUTHORED_FAMILIES.find(item => item.objective === id && item.id.endsWith(suffix))!);
export const PRACTICE = Object.freeze([definitions("practice.A"), definitions("practice.B")]);
export const FORMS = Object.freeze(["assessment.A", "assessment.B", "assessment.C"].map(definitions));
export const MASTERY_AVAILABLE = false;
export const VALID_CATALOG = AUTHORED_FAMILIES.length === 120 && OBJECTIVES.length === 24 && [...PRACTICE, ...FORMS].every(form => form.length === 24 && form.every((item, index) => item && validateDefinition(item) && item.objective === OBJECTIVES[index] && item.critical === (index % 4 === 1) && (!item.critical || item.atoms.length === 2))) && EXPERIMENTS[0].configs.length === 20 && EXPERIMENTS[1].configs.length === 11;
export function response(family: Family, answers: readonly Answer[]): FamilyResponse { return { familyId: family.id, answers: family.atoms.map((atom, index) => ({ atomId: atom.id, answer: answers[index] ?? { kind: "unanswered" } })) }; }
export function score(form: number, answers: readonly (readonly Answer[])[]) {
  if (!VALID_CATALOG || ![0, 1, 2].includes(form) || !bounded(answers) || answers.length !== 24) throw Error("Complete versioned model-selection assessment required.");
  const outcomes = FORMS[form].map((family, index) => {
    if (!Array.isArray(answers[index]) || answers[index].length !== family.atoms.length) throw Error("Incomplete assessment representation.");
    const grade = gradeFamily(family, response(family, answers[index]));
    if (grade.status === "invalid") throw Error(grade.feedback);
    return grade.correct;
  });
  const critical = OBJECTIVES.filter((_, index) => index % 4 === 1 && !outcomes[index]);
  const count = outcomes.filter(Boolean).length;
  return { score: count, outcomes, critical, passed: count >= 20 && critical.length === 0 };
}
