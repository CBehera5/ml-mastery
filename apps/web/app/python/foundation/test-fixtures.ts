import { family, responseFor } from "./fixtures";
import { type Answer, type Family } from "./contracts";
import { MODULE_POLICIES } from "./assessment";

export const INDEPENDENT_TEST_ONLY = Array.from({ length: 4 }, (_, objective) => Array.from({ length: 3 }, (_, variant) => family(objective, variant, true)));
export function acceptedResponse(definition: Family, tuple = 0) {
  return responseFor(definition, Object.fromEntries(definition.atoms.map((atom, index) => [atom.id, structuredClone(definition.accepted[tuple][index])])));
}
export function unansweredResponse(definition: Family) {
  return responseFor(definition, Object.fromEntries(definition.atoms.map(atom => [atom.id, { kind: "unanswered" } as Answer])));
}
export function syntheticAssessment(module: string, form: 0 | 1 | 2) {
  const policy = MODULE_POLICIES.find(item => item.module === module)!;
  return Array.from({ length: policy.count }, (_, index): Family => {
    const objective = `${policy.prefix}${String(Math.floor(index / 4) + 1).padStart(2, "0")}.O${index % 4 + 1}`;
    const critical = policy.critical.some(item => item === objective);
    const atom = (id: string) => ({ id, label: "Synthetic scorer contract, not a curriculum item", kind: "choice" as const, options: [{ id: "yes", label: "Synthetic expected" }, { id: "no", label: "Synthetic counterexample" }] });
    return { id: `synthetic-${policy.module}-${index}-${form}`, objective, critical, prompt: "TEST ONLY; cannot award learner mastery", code: "", atoms: critical ? [atom("decision"), atom("reason")] : [atom("decision")], accepted: [critical ? [{ kind: "choice", optionId: "yes" }, { kind: "choice", optionId: "yes" }] : [{ kind: "choice", optionId: "yes" }]], explanation: "Synthetic policy contract only.", remediation: "No educational coverage claimed." };
  });
}
