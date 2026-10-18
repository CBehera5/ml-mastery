import reference from "../../../../../packages/python-contracts/fixtures/preparation-learning.v1.json";
import { type Answer, type Atom, type Family, validateDefinition } from "../foundation/contracts";
export const CONTENT = "python.preparation.1.0.0";
export const ASSESSMENT = "python.preparation.mastery.v1";
function frozen<Value>(value: Value): Value {
  if (value !== null && typeof value === "object") { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
frozen(reference);
export const LESSONS = reference.lessons;
export const DATASET = { manifest: reference.manifest, table: reference.canonical_table };
export const canonicalObjective = (id: string) => `python.preparation.${id.toLowerCase()}`;
export const format = (value: unknown) => JSON.stringify(value);
const rotate = <Value,>(values: readonly Value[], offset: number) => [...values.slice(offset % values.length), ...values.slice(0, offset % values.length)];
export function referenceCase(lesson: number, objective: number, mode = "worked", variant = 0) {
  return reference.cases.find(item => item.objective === LESSONS[lesson].objectives[objective].id && item.mode === mode && item.variant === variant)!;
}
function definitions(mode: "practice" | "mastery", variant: number): readonly Family[] {
  return frozen(LESSONS.flatMap((lesson, lessonIndex) => lesson.objectives.map((objective, offset): Family => {
    const item = referenceCase(lessonIndex, offset, mode, variant);
    const changed = referenceCase(lessonIndex, offset, "mastery", (variant + 1) % 3);
    const counter = format(changed.expected) === format(item.expected) ? item.misconception : format(changed.expected);
    const options = rotate([{ id: "observed", label: format(item.expected) }, { id: "changed", label: counter }, { id: "shortcut", label: item.misconception }].filter((option, index, values) => values.findIndex(candidate => candidate.label === option.label) === index), (lessonIndex + offset + variant) % 3);
    const reasons = rotate([{ id: "contract", label: item.reason }, { id: "shortcut", label: item.misconception }, { id: "unsupervised", label: "A preprocessing operation that never reads targets may fit on validation and test observations without affecting evaluation validity." }], (lessonIndex + offset + variant + 1) % 3);
    const repair = objective.id === "T05.O2";
    const numeric = objective.id === "T04.O2";
    const decision: Atom = repair ? { id: "decision", label: "Repair fold-local fitting", kind: "slots", slots: [
      { id: "fit", label: "Rows allowed to fit this fold", options: [{ id: "fold_train", label: "Only this fold's training IDs" }, { id: "local_train", label: "The current temporary training partition only (equivalent boundary)" }, { id: "all_develop", label: "All development rows, including this validation fold" }] },
      { id: "new_rows", label: "Operation on validation/test", options: [{ id: "transform", label: "Transform with saved training attributes" }, { id: "refit", label: "Fit new parameters on evaluation rows" }] },
    ] } : numeric ? { id: "decision", label: "Standardized test coordinate (unitless)", kind: "number" } : { id: "decision", label: "Choose the complete reference outcome and permissions", kind: "choice", options };
    const decisions: Answer[] = repair ? ["fold_train", "local_train"].map(fit => ({ kind: "slots", entries: [{ slotId: "fit", optionId: fit }, { slotId: "new_rows", optionId: "transform" }] })) : numeric ? [{ kind: "number", value: (item.expected as { coordinate: number[][] }).coordinate[0][0] }] : [{ kind: "choice", optionId: "observed" }];
    return { id: `${canonicalObjective(objective.id)}.${mode}.${["a", "b", "c"][variant]}`, objective: objective.id, critical: objective.critical,
      prompt: `${objective.assessment} ${repair ? "Choose both boundary-repair slots and justify the fold provenance." : numeric ? "Calculate using the saved training mean/scale; do not refit." : "Include the full numerical result, schema and information permissions."}`,
      code: item.code, atoms: objective.critical ? [decision, { id: "reason", label: "Explain the boundary, meaning or counterexample", kind: "choice", options: reasons }] : [decision],
      accepted: decisions.map(answer => objective.critical ? [answer, { kind: "choice", optionId: "contract" }] : [answer]),
      explanation: item.reason, remediation: `${objective.remediation} ${item.reason}` };
  })));
}
export const PRACTICE_FORMS = [definitions("practice", 0), definitions("practice", 1)] as const;
export const INDEPENDENT_FORMS = [definitions("mastery", 0), definitions("mastery", 1), definitions("mastery", 2)] as const;
export const ACTIVITIES = frozen(LESSONS.map((lesson, index) => {
  const critical = lesson.objectives.flatMap((item, offset) => item.critical ? [offset] : []);
  return [...lesson.objectives.map((_, offset) => referenceCase(index, offset)), ...critical.flatMap(offset => [referenceCase(index, offset, "practice", 0), referenceCase(index, offset, "practice", 1)]), ...reference.cases.filter(item => item.lesson === lesson.slug && item.mode === "experiment")].map((item, offset, items) => ({
    id: `case-${offset}`, label: `${item.objective}: ${offset < 4 ? "worked recipe" : `changed boundary case ${offset - 3}`}`, code: item.code, output: format(item.expected),
    reasonId: `reason-${items.findIndex(candidate => candidate.reason === item.reason)}`, reason: item.reason, warnings: item.warnings,
  }));
}));
export const ACTIVITY_REASONS = (lesson: number) => [...new Map(ACTIVITIES[lesson].map(item => [item.reasonId, { id: item.reasonId, label: item.reason }])).values(), { id: "shortcut", label: referenceCase(lesson, 0).misconception }];
export const activityPredictions = (lesson: number) => [...new Set(ACTIVITIES[lesson].map(item => item.output))];
export const CATALOG_VALID = LESSONS.length === 6 && PRACTICE_FORMS.every(form => form.length === 24 && form.every(validateDefinition)) && INDEPENDENT_FORMS.every(form => form.length === 24 && form.every(validateDefinition)) && LESSONS.flatMap(lesson => lesson.objectives).filter(item => item.critical).length === 8;
export const VERIFICATION_RELEASED = true;
export const MASTERY_AVAILABLE = VERIFICATION_RELEASED && CATALOG_VALID;

