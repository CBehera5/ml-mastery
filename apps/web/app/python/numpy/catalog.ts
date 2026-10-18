import reference from "../../../../../packages/python-contracts/fixtures/numpy-learning.v1.json";
import { type Answer, type Family, validateDefinition } from "../foundation/contracts";
export const CONTENT = "python.numpy.1.0.0";
export const ASSESSMENT = "python.numpy.mastery.v1";
frozen(reference);
export const LESSONS = reference.lessons;
export const canonicalObjective = (id: string) => `python.numpy.${id.toLowerCase()}`;
export const format = (value: unknown) => JSON.stringify(value);
const rotate = <Value,>(values: readonly Value[], offset: number) => [...values.slice(offset % values.length), ...values.slice(0, offset % values.length)];
function frozen<Value>(value: Value): Value {
  if (value !== null && typeof value === "object") { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
export function referenceCase(lesson: number, objective: number, mode = "worked", variant = 0) {
  return reference.cases.find(item => item.objective === LESSONS[lesson].objectives[objective].id && item.mode === mode && item.variant === variant)!;
}
function definitions(mode: "practice" | "mastery", variant: number): readonly Family[] {
  return frozen(LESSONS.flatMap((lesson, lessonIndex) => lesson.objectives.map((objective, offset): Family => {
    const item = referenceCase(lessonIndex, offset, mode, variant);
    const options = rotate([{ id: "observed", label: format(item.expected) }, { id: "shortcut", label: `Claim: ${item.misconception}` }, { id: "unchanged", label: "The operation preserves every value, shape, axis meaning and finite status; no check is needed." }], (lessonIndex + offset + variant) % 3);
    const reasons = rotate([{ id: "contract", label: item.reason }, { id: "shortcut", label: item.misconception }, { id: "shape_only", label: "A legal expression and plausible numbers prove feature order, observation pairing and the intended statistic are correct." }], (lessonIndex + variant) % 3);
    const repair = objective.id === "N05.O2";
    const decision = repair ? { id: "decision", label: "Repair into one ordered prediction per observation", kind: "slots" as const, slots: [{ id: "operation", label: "Contraction expression", options: [{ id: "at", label: "A @ w" }, { id: "matmul", label: "np.matmul(A, w)" }, { id: "multiply", label: "A * w" }] }, { id: "meaning", label: "Output meaning", options: [{ id: "rows", label: "One dot-product result per observation, shape (2,)" }, { id: "cells", label: "One contribution per cell, shape (2,2)" }] }] } : { id: "decision", label: "Choose the complete reference outcome", kind: "choice" as const, options };
    const accepted = (repair ? ["at", "matmul"].map(operation => ({ kind: "slots" as const, entries: [{ slotId: "operation", optionId: operation }, { slotId: "meaning", optionId: "rows" }] })) : [{ kind: "choice" as const, optionId: "observed" }]).map(answer => objective.critical ? [answer, { kind: "choice", optionId: "contract" } as Answer] : [answer]);
    return { id: `${canonicalObjective(objective.id)}.${mode}.${["a", "b", "c"][variant]}`, objective: objective.id, critical: objective.critical, prompt: `${objective.assessment} ${repair ? "Select a complete repair and justify its contraction." : "Choose the normalized output, including shapes, dtype and named errors where shown."}`, code: item.code, atoms: objective.critical ? [decision, { id: "reason", label: "Explain the axes, meaning or counterexample", kind: "choice", options: reasons }] : [decision], accepted, explanation: item.reason, remediation: `${objective.remediation} ${item.reason}` };
  })));
}
export const PRACTICE_FORMS = [definitions("practice", 0), definitions("practice", 1)] as const;
export const INDEPENDENT_FORMS = [definitions("mastery", 0), definitions("mastery", 1), definitions("mastery", 2)] as const;
export const ACTIVITIES = frozen(LESSONS.map((lesson, index) => {
  const critical = lesson.objectives.findIndex(item => item.critical);
  return [...lesson.objectives.map((_, offset) => referenceCase(index, offset)), referenceCase(index, critical, "practice", 0), referenceCase(index, critical, "practice", 1)].map((item, offset, items) => ({ id: `case-${offset}`, label: `${item.objective}: ${offset < 4 ? "worked operation" : `changed critical case ${offset - 3}`}`, code: item.code, output: format(item.expected), reasonId: `reason-${items.findIndex(candidate => candidate.reason === item.reason)}`, reason: item.reason, warnings: item.warnings }));
}));
export const ACTIVITY_REASONS = (lesson: number) => [...new Map(ACTIVITIES[lesson].map(item => [item.reasonId, { id: item.reasonId, label: item.reason }])).values(), { id: "shortcut", label: referenceCase(lesson, 0).misconception }];
export const activityPredictions = (lesson: number) => [...new Set([...ACTIVITIES[lesson].map(item => item.output), "Every value, shape and meaning stays unchanged."])];
export const CATALOG_VALID = LESSONS.length === 6 && PRACTICE_FORMS.every(form => form.length === 24 && form.every(validateDefinition)) && INDEPENDENT_FORMS.every(form => form.length === 24 && form.every(validateDefinition)) && LESSONS.flatMap(lesson => lesson.objectives).filter(item => item.critical).length === 6;
export const VERIFICATION_RELEASED = true;
export const MASTERY_AVAILABLE = VERIFICATION_RELEASED && CATALOG_VALID;
