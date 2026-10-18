import authored from "./authored.json";
import first from "../../../../../docs/verification/naive-bayes/nb-e1.manifest.v1.json";
import second from "../../../../../docs/verification/naive-bayes/nb-e2.manifest.v1.json";
import lock from "../../../../../docs/verification/naive-bayes/freeze-lock.v1.json";
import { bounded, gradeFamily, validateDefinition, type Answer, type Family, type FamilyResponse } from "../../python/foundation/contracts";
export { LESSONS } from "./teaching";
export const CONTENT = "supervised.naive-bayes.1.0.0";
export const POLICY = "supervised.naive-bayes.policy.1.0.0";
export const ASSESSMENT = "supervised.naive-bayes.mastery.1.0.0";
export const SCOPE = "supervised.naive-bayes.full.v1";
export const FIXTURES = Object.values(lock.sha256).join(":");
function freeze<Value>(value: Value): Value {
  if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
freeze(authored); freeze(first); freeze(second);
export const OBJECTIVES = freeze(Array.from({ length: 16 }, (_, index) => `NB0${Math.floor(index / 4) + 1}.O${index % 4 + 1}`));
const definitions = (mode: string, suffix: string) => OBJECTIVES.map(id => authored.families.find(item => item.objective === id && item.id.includes(mode) && item.id.endsWith(suffix))! as Family);
export const PRACTICE = freeze(["A", "B"].map(suffix => definitions("practice", suffix)));
export const FORMS = freeze(["A", "B", "C"].map(suffix => definitions("assessment", suffix)));
export type Config = { id: string; fixture: string; controls: Record<string, unknown>; prediction_question: string; expected: Record<string, unknown>; reasonId: string; why: string };
type Manifest = { id: string; initial_configuration: string; fixtures: { id: string; [key: string]: unknown }[]; configurations: Config[] };
export const LABS: readonly Manifest[] = freeze([first, second].map(manifest => ({
  id: manifest.id, initial_configuration: manifest.configurations[0].id, fixtures: manifest.fixtures,
  configurations: manifest.configurations.map(config => ({
    id: config.id, fixture: config.fixture_id, controls: config.controls,
    prediction_question: manifest.learning_question,
    expected: config.expected, reasonId: config.correct_reason_id,
    why: `${config.explanation} Counterexample: ${config.counterexample}`
  }))
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
export const PREDICTIONS = freeze([...first.prediction_options]);
export const EXPLANATIONS = freeze(first.reason_options.map(option => option.id));
export const VALID_CATALOG = authored.content === CONTENT && authored.families.length === 80 && [...PRACTICE, ...FORMS].every(form => form.length === 16 && form.every((item, index) => item && validateDefinition(item) && item.objective === OBJECTIVES[index] && item.critical === (index % 4 === 1) && (!item.critical || item.atoms.length === 2))) && configurations(0).length === 26 && configurations(1).length === 30;
export const VERIFICATION_RELEASED = true;
export const MASTERY_AVAILABLE = VERIFICATION_RELEASED && VALID_CATALOG;
export function response(family: Family, answers: readonly Answer[]): FamilyResponse {
  return { familyId: family.id, answers: family.atoms.map((atom, index) => ({ atomId: atom.id, answer: answers[index] ?? { kind: "unanswered" } })) };
}
export function score(form: number, answers: readonly (readonly Answer[])[]) {
  if (!VALID_CATALOG || ![0, 1, 2].includes(form) || !bounded(answers) || answers.length !== 16) throw Error("Complete versioned NaiveBayes assessment required.");
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
