import authored from "./authored.json";
import { bounded, gradeFamily, validateDefinition, type Answer, type Family, type FamilyResponse } from "../../python/foundation/contracts";

export const CONTENT = "supervised.mlp.1.0.0";
export const POLICY = "supervised.mlp.policy.1.0.0";
export const ASSESSMENT = "supervised.mlp.mastery.1.0.0";
export const SCOPE = "supervised:mlp:full:v1";
export const FIXTURES = "NN-E1.v1:NN-E2.v1:sha256-verified-frozen";
export const OBJECTIVES = Object.freeze(Array.from({ length: 20 }, (_, index) => `NN0${Math.floor(index / 4) + 1}.O${index % 4 + 1}`));
export type Experiment = { id: string; configs: readonly { id: string; label: string }[] };
export const EXPERIMENTS: readonly Experiment[] = Object.freeze([
  { id: "NN-E1", configs: Object.freeze([
    "nn-e1.manual.h1.identity.base.v1","nn-e1.manual.h1.identity.shifted.v1","nn-e1.manual.h1.logistic.base.v1","nn-e1.manual.h1.logistic.shifted.v1","nn-e1.manual.h1.relu.base.v1","nn-e1.manual.h1.relu.shifted.v1",
    "nn-e1.manual.h2.identity.base.v1","nn-e1.manual.h2.identity.shifted.v1","nn-e1.manual.h2.logistic.base.v1","nn-e1.manual.h2.logistic.shifted.v1","nn-e1.manual.h2.relu.base.v1","nn-e1.manual.h2.relu.shifted.v1",
    "nn-e1.nn.training.logistic.eta-0.05.alpha-0.0.v1.epoch-32","nn-e1.nn.training.logistic.eta-0.05.alpha-0.4.v1.epoch-32","nn-e1.nn.training.logistic.eta-0.5.alpha-0.0.v1.epoch-32","nn-e1.nn.training.logistic.eta-0.5.alpha-0.4.v1.epoch-32","nn-e1.nn.training.relu.eta-0.05.alpha-0.0.v1.epoch-32","nn-e1.nn.training.relu.eta-0.05.alpha-0.4.v1.epoch-32","nn-e1.nn.training.relu.eta-0.5.alpha-0.0.v1.epoch-32","nn-e1.nn.training.relu.eta-0.5.alpha-0.4.v1.epoch-32",
    "nn-e1.endpoint.-1.v1","nn-e1.endpoint.1.v1","nn-e1.reject.shape-mismatch.v1","nn-e1.reject.nonfinite-weight.v1","nn-e1.reject.unsupported-activation.v1"
  ].map(id => ({ id, label: id.replace("nn-e1.", "").replaceAll(".", " · ") }))) },
  { id: "NN-E2", configs: Object.freeze([
    "nn-e2.step.logistic.eta-0.1.alpha-0.0.smooth.v1","nn-e2.step.logistic.eta-0.1.alpha-0.4.smooth.v1","nn-e2.step.logistic.eta-3.0.alpha-0.0.smooth.v1","nn-e2.step.logistic.eta-3.0.alpha-0.4.smooth.v1","nn-e2.step.relu.eta-0.1.alpha-0.0.smooth.v1","nn-e2.step.relu.eta-0.1.alpha-0.4.smooth.v1","nn-e2.step.relu.eta-3.0.alpha-0.0.smooth.v1","nn-e2.step.relu.eta-3.0.alpha-0.4.smooth.v1","nn-e2.step.relu.eta-0.1.alpha-0.0.dead.v1","nn-e2.step.relu.eta-0.1.alpha-0.0.kink.v1","nn-e2.step.logistic.eta-0.1.alpha-0.0.saturated.v1",
    ...["logistic","relu"].flatMap(activation => ["0.05","0.5"].flatMap(eta => ["0.0","0.4"].flatMap(alpha => [1,8,32,128].map(epoch => `nn-e2.nn.training.${activation}.eta-${eta}.alpha-${alpha}.v1.epoch-${epoch}`)))),
    "nn-e2.reject.nonpositive-learning-rate.v1","nn-e2.reject.nonfinite-update.v1","nn-e2.reject.globally-fitted-scaling.v1","nn-e2.reject.test-selected-checkpoint.v1","nn-e2.reject.outer-fold-selected-epoch.v1"
  ].map(id => ({ id, label: id.replace("nn-e2.", "").replaceAll(".", " · ") }))) }
]);
export type Config = { id: string; kind: string; predictionQuestion: string; predictionOptions: { id: string; label: string }[]; reasonOptions: { id: string; label: string }[]; correctPrediction: string; correctReason: string; explanation: string; counterexample: string; reference: Record<string, unknown> };
export const configIds = (lab: number) => EXPERIMENTS[lab]?.configs ?? [];
export async function fetchConfig(lab: number, id: string): Promise<unknown> {
  if (!EXPERIMENTS[lab]?.configs.some(config => config.id === id)) throw Error("Choose one of the reviewed experiment states.");
  const response = await fetch(`/api/supervised/mlp/experiment?lab=${lab}&id=${encodeURIComponent(id)}`);
  if (!response.ok) throw Error("This frozen reference state is unavailable; saved learner progress is unchanged.");
  return response.json();
}
const definitions = (suffix: string) => OBJECTIVES.map(id => authored.families.find(item => item.objective === id && item.id.endsWith(suffix))! as Family);
export const PRACTICE = Object.freeze([definitions("practice.A"), definitions("practice.B")]);
export const FORMS = Object.freeze(["assessment.A","assessment.B","assessment.C"].map(definitions));
export const MASTERY_AVAILABLE = true;
export const VALID_CATALOG = authored.content === CONTENT && authored.families.length === 100 && [...PRACTICE, ...FORMS].every(form => form.length === 20 && form.every((item, index) => item && validateDefinition(item) && item.objective === OBJECTIVES[index] && item.critical === (index % 4 === 1) && (!item.critical || item.atoms.length === 2))) && EXPERIMENTS[0].configs.length === 25 && EXPERIMENTS[1].configs.length === 48;
export function response(family: Family, answers: readonly Answer[]): FamilyResponse {
  return { familyId: family.id, answers: family.atoms.map((atom, index) => ({ atomId: atom.id, answer: answers[index] ?? { kind: "unanswered" } })) };
}
export function score(form: number, answers: readonly (readonly Answer[])[]) {
  if (!VALID_CATALOG || ![0, 1, 2].includes(form) || !bounded(answers) || answers.length !== 20) throw Error("Complete versioned MLP assessment required.");
  const outcomes = FORMS[form].map((family, index) => {
    if (!Array.isArray(answers[index]) || answers[index].length !== family.atoms.length) throw Error("Incomplete assessment representation.");
    const grade = gradeFamily(family, response(family, answers[index]));
    if (grade.status === "invalid") throw Error(grade.feedback);
    return grade.correct;
  });
  const critical = OBJECTIVES.filter((_, index) => index % 4 === 1 && !outcomes[index]);
  const count = outcomes.filter(Boolean).length;
  return { score: count, outcomes, critical, passed: count >= 16 && critical.length === 0 };
}
