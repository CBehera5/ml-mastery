import authored from "./authored.json";
import first from "../../../../../docs/verification/ev-phase-b/ev-e1.manifest.v1.json";
import second from "../../../../../docs/verification/ev-phase-b/ev-e2.manifest.v1.json";
import lock from "../../../../../docs/verification/ev-phase-b/freeze-lock.v1.json";
import { bounded, gradeFamily, validateDefinition, type Answer, type Family, type FamilyResponse } from "../../python/foundation/contracts";
export { LESSONS } from "./teaching";
export const CONTENT = "supervised.evaluation.1.0.0";
export const POLICY = "supervised.evaluation.policy.1.0.0";
export const ASSESSMENT = "supervised.evaluation.mastery.1.0.0";
export const SCOPE = "supervised.evaluation.full.v1";
export const FIXTURES = Object.values(lock.files).join(":");
function freeze<Value>(value: Value): Value {
  if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
freeze(authored); freeze(first); freeze(second);
export const OBJECTIVES = freeze(Array.from({ length: 24 }, (_, index) => `EV0${Math.floor(index / 4) + 1}.O${index % 4 + 1}`));
export const PRACTICE = freeze(["A", "B"].map(suffix => OBJECTIVES.map(id => authored.practice.find(item => item.objective === id && item.id.endsWith(suffix))! as Family)));
export const FORMS = freeze(["A", "B", "C"].map(suffix => OBJECTIVES.map(id => authored.independent.find(item => item.objective === id && item.id.endsWith(suffix))! as Family)));
export type Config = { id: string; fixture: string; controls: Record<string, string | number>; prediction_question: string; expected: Record<string, unknown>; why: string; objectives: string[]; text_alternative: unknown };
export const LABS = freeze([first, second]);
export const configurations = (lab: number): readonly Config[] => {
  if (![0, 1].includes(lab)) throw Error("Choose a listed experiment.");
  return LABS[lab].configurations as unknown as Config[];
};
export const configFor = (lab: number, id: string) => {
  const config = configurations(lab)?.find(item => item.id === id);
  if (!config) throw Error("Choose a listed experiment configuration.");
  return config;
};
export const PREDICTIONS = ["I expect valid information or better detection/error", "I expect a boundary failure or worse detection/error", "I expect an undefined or divergent metric"];
export const VALID_CATALOG = authored.content === CONTENT && authored.practice.length === 48 && authored.independent.length === 72 && [...PRACTICE, ...FORMS].every(form => form.length === 24 && form.every((item, index) => item && validateDefinition(item) && item.objective === OBJECTIVES[index] && item.critical === (index % 4 === 1) && (!item.critical || item.atoms.length === 2))) && configurations(0).length === 54 && configurations(1).length === 32;
export const VERIFICATION_RELEASED = true;
export const MASTERY_AVAILABLE = VERIFICATION_RELEASED && VALID_CATALOG;
export function response(family: Family, answers: readonly Answer[]): FamilyResponse {
  return { familyId: family.id, answers: family.atoms.map((atom, index) => ({ atomId: atom.id, answer: answers[index] ?? { kind: "unanswered" } })) };
}
export function score(form: number, answers: readonly (readonly Answer[])[]) {
  if (!VALID_CATALOG || ![0, 1, 2].includes(form) || !bounded(answers) || answers.length !== 24) throw Error("Complete versioned Evaluation assessment required.");
  const outcomes = FORMS[form].map((family, index) => {
    if (!Array.isArray(answers[index]) || answers[index].length !== family.atoms.length) throw Error("Incomplete assessment representation.");
    const grade = gradeFamily(family, response(family, answers[index]));
    if (grade.status === "invalid") throw Error("Unsupported assessment representation; complete or clear the answer.");
    return grade.correct;
  });
  const correct = outcomes.filter(Boolean).length;
  const critical = OBJECTIVES.filter((_, index) => index % 4 === 1 && !outcomes[index]);
  return { score: correct, outcomes, critical, passed: correct >= 20 && critical.length === 0 };
}
