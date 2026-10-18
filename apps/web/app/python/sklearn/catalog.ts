import reference from "../../../../../packages/python-contracts/fixtures/sklearn-learning.v1.json";
import { type Answer, type Atom, type Family, validateDefinition } from "../foundation/contracts";
export const CONTENT = "python.sklearn.1.0.0";
export const ASSESSMENT = "python.sklearn.mastery.v1";
function frozen<Value>(value: Value): Value {
  if (value !== null && typeof value === "object") { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
frozen(reference);
export const LESSONS = reference.lessons;
export const DATASET = { manifest: reference.manifest, table: reference.canonical_table };
export const canonicalObjective = (id: string) => `python.sklearn.${id.toLowerCase()}`;
export const format = (value: unknown) => JSON.stringify(value);
const rotate = <Value,>(values: readonly Value[], offset: number) => [...values.slice(offset % values.length), ...values.slice(0, offset % values.length)];
export function referenceCase(lesson: number, objective: number, mode = "worked", variant = 0) {
  return reference.cases.find(item => item.objective === LESSONS[lesson].objectives[objective].id && item.mode === mode && item.variant === variant)!;
}
function definitions(mode: "practice" | "mastery", variant: number): readonly Family[] {
  return frozen(LESSONS.flatMap((lesson, lessonIndex) => lesson.objectives.map((objective, offset): Family => {
    const item = referenceCase(lessonIndex, offset, mode, variant), changed = referenceCase(lessonIndex, offset, "mastery", (variant + 1) % 3);
    const counter = format(changed.expected) === format(item.expected) ? item.misconception : format(changed.expected);
    const options = rotate([{ id: "observed", label: format(item.expected) }, { id: "changed", label: counter }, { id: "shortcut", label: item.misconception }].filter((option, index, values) => values.findIndex(candidate => candidate.label === option.label) === index), (lessonIndex + offset + variant) % 3);
    const reasons = rotate([{ id: "contract", label: item.reason }, { id: "shortcut", label: item.misconception }, { id: "score_only", label: "Correct-looking predictions and a high score prove the fit/evaluation boundaries are valid without inspecting row identities or learned state." }], (lessonIndex + offset + variant + 1) % 3);
    const repair = objective.id === "S04.O1", compound = objective.id === "S02.O2", numeric = objective.id === "S03.O2";
    const metric = item.expected as unknown as { requested_metric: "mae" | "mse" | "rmse"; mae: number; mse: number; rmse: number; regression_rows: number; positive_cases: number; positive_detected: number; units: { mae: string; mse: string; rmse: string } };
    const decision: Atom = compound ? { id: "decision", label: "Both metric arithmetic and positive-case interpretation are mandatory", kind: "slots", slots: [
      { id: "estimate", label: "Requested regression metric value", options: [{ id: "observed", label: `${metric.requested_metric} = ${metric[metric.requested_metric]}` }, { id: "sum", label: `${metric.requested_metric} = ${metric[metric.requested_metric] * 2} (unaveraged errors)` }] },
      { id: "units", label: "Units of the requested regression metric", options: [{ id: "correct", label: metric.units[metric.requested_metric] }, { id: "wrong", label: metric.requested_metric === "mse" ? "$k (not squared)" : "($k)^2 (squared)" }] },
      { id: "denominator", label: "Regression aggregation denominator", options: [{ id: "rows", label: `${metric.regression_rows} evaluated regression rows` }, { id: "classes", label: "The number of negative classification cases" }] },
      { id: "positives", label: "Positive-case detection conclusion", options: [{ id: "none", label: `Detected ${metric.positive_detected} of ${metric.positive_cases} positives; high accuracy does not prove detection` }, { id: "all", label: "High accuracy proves useful positive-case detection" }] },
    ] } : repair ? { id: "decision", label: "Repair cross-validated learned-state boundaries", kind: "slots", slots: [
      { id: "fit", label: "Rows allowed to fit each fold", options: [{ id: "fold_train", label: "Only this fold's training IDs" }, { id: "local_train", label: "Only the current temporary training partition (equivalent)" }, { id: "all_rows", label: "All development and validation rows" }] },
      { id: "placement", label: "Preprocessing placement", options: [{ id: "inside", label: "Inside the complete cross-validated estimator" }, { id: "outside", label: "Prefit outside cross-validation" }] },
    ] } : numeric ? { id: "decision", label: "Mean positive MAE in target units", kind: "number" } : { id: "decision", label: "Choose the complete reference outcome and permissions", kind: "choice", options };
    const decisions: Answer[] = compound ? [{ kind: "slots", entries: [{ slotId: "estimate", optionId: "observed" }, { slotId: "units", optionId: "correct" }, { slotId: "denominator", optionId: "rows" }, { slotId: "positives", optionId: "none" }] }] : repair ? ["fold_train", "local_train"].map(fit => ({ kind: "slots", entries: [{ slotId: "fit", optionId: fit }, { slotId: "placement", optionId: "inside" }] })) : numeric ? [{ kind: "number", value: (item.expected as unknown as { mean_mae: number }).mean_mae }] : [{ kind: "choice", optionId: "observed" }];
    return { id: `${canonicalObjective(objective.id)}.${mode}.${["a", "b", "c"][variant]}`, objective: objective.id, critical: objective.critical, prompt: `${objective.assessment} ${compound ? "Use the requested metric and both staged tables; every slot and the explanation must pass." : repair ? "Repair both the fit-row permission and preprocessing placement." : numeric ? "Convert the scorer sign before averaging." : "Keep row identity, units, learned state and fit/evaluation permissions explicit."}`, code: item.code,
      atoms: objective.critical ? [decision, { id: "reason", label: "Explain the boundary, meaning or counterexample", kind: "choice", options: reasons }] : [decision],
      accepted: decisions.map(answer => objective.critical ? [answer, { kind: "choice", optionId: "contract" }] : [answer]), explanation: item.reason, remediation: `${objective.remediation} ${item.reason}` };
  })));
}
export const PRACTICE_FORMS = [definitions("practice", 0), definitions("practice", 1)] as const;
export const INDEPENDENT_FORMS = [definitions("mastery", 0), definitions("mastery", 1), definitions("mastery", 2)] as const;
function experimentIdentity(item: ReturnType<typeof referenceCase>) {
  const expected = { ...item.expected } as Record<string, unknown>;
  delete expected.question;
  return format({ code: item.code.replace(/^result\['question'\].*$/gm, ""), expected });
}
export const ACTIVITIES = frozen(LESSONS.map((lesson, index) => {
  const critical = lesson.objectives.flatMap((item, offset) => item.critical ? [offset] : []);
  const candidates = [...lesson.objectives.map((_, offset) => referenceCase(index, offset)), ...critical.flatMap(offset => [referenceCase(index, offset, "practice", 0), referenceCase(index, offset, "practice", 1)]), ...reference.cases.filter(item => item.lesson === lesson.slug && item.mode === "experiment")];
  return candidates.filter((item, offset) => candidates.findIndex(candidate => experimentIdentity(candidate) === experimentIdentity(item)) === offset).map((item, offset, items) => ({ id: `case-${offset}`, label: `${item.objective}: ${item.mode} workflow ${offset + 1}`, code: item.code, output: format(item.expected), reasonId: `reason-${items.findIndex(candidate => candidate.reason === item.reason)}`, reason: item.reason, warnings: item.warnings }));
}));
export const ACTIVITY_REASONS = (lesson: number) => [...new Map(ACTIVITIES[lesson].map(item => [item.reasonId, { id: item.reasonId, label: item.reason }])).values(), { id: "shortcut", label: referenceCase(lesson, 0).misconception }];
export const activityPredictions = (lesson: number) => [...new Set(ACTIVITIES[lesson].map(item => item.output))];
export const CATALOG_VALID = LESSONS.length === 5 && PRACTICE_FORMS.every(form => form.length === 20 && form.every(validateDefinition)) && INDEPENDENT_FORMS.every(form => form.length === 20 && form.every(validateDefinition)) && LESSONS.flatMap(lesson => lesson.objectives).filter(item => item.critical).length === 7;
export const VERIFICATION_RELEASED = true;
export const MASTERY_AVAILABLE = VERIFICATION_RELEASED && CATALOG_VALID;

