import reference from "../../../../../packages/python-contracts/fixtures/visualization-learning.v1.json";
import { type Answer, type Family, validateDefinition } from "../foundation/contracts";
export const CONTENT = "python.visualization.1.0.0";
export const ASSESSMENT = "python.visualization.mastery.v1";
function frozen<Value>(value: Value): Value {
  if (value !== null && typeof value === "object") { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
frozen(reference);
export const LESSONS = reference.lessons;
export const canonicalObjective = (id: string) => `python.visualization.${id.toLowerCase()}`;
export const format = (value: unknown) => JSON.stringify(value);
const rotate = <Value,>(values: readonly Value[], offset: number) => [...values.slice(offset % values.length), ...values.slice(0, offset % values.length)];
export function referenceCase(lesson: number, objective: number, mode = "worked", variant = 0) {
  return reference.cases.find(item => item.objective === LESSONS[lesson].objectives[objective].id && item.mode === mode && item.variant === variant)!;
}
function definitions(mode: "practice" | "mastery", variant: number): readonly Family[] {
  return frozen(LESSONS.flatMap((lesson, lessonIndex) => lesson.objectives.map((objective, offset): Family => {
    const item = referenceCase(lessonIndex, offset, mode, variant);
    const options = rotate([{ id: "observed", label: format(item.expected) }, { id: "shortcut", label: item.misconception }, { id: "appearance", label: "A technically valid plot proves the claim, regardless of pairing, units or sampling." }], (lessonIndex + offset + variant) % 3);
    const reasons = rotate([{ id: "contract", label: item.reason }, { id: "shortcut", label: item.misconception }, { id: "appearance", label: "A plausible picture establishes both causal effects and unseen-data performance." }], (lessonIndex + variant) % 3);
    const repair = objective.id === "V05.O1";
    const numeric = objective.id === "V02.O1" || objective.id === "V04.O2";
    const decision = repair ? { id: "decision", label: "Repair the scale and communicated claim", kind: "slots" as const, slots: [
      { id: "scale", label: "Transparent axis policy", options: [{ id: "common", label: "Use disclosed common limits" }, { id: "zoom", label: "Use a clearly disclosed zoom" }, { id: "hidden", label: "Hide incompatible limits" }] },
      { id: "claim", label: "Effect-size claim", options: [{ id: "absolute", label: "State the actual absolute difference and units" }, { id: "inflated", label: "Claim a larger measured difference because the picture looks dramatic" }] }
    ] } : numeric ? { id: "decision", label: objective.id === "V02.O1" ? "Count in the final bin (including the final right edge)" : "IQR in the stated feature units", kind: "number" as const } : { id: "decision", label: "Choose the supported numerical and conceptual outcome", kind: "choice" as const, options };
    const primary: Answer[] = repair ? ["common", "zoom"].map(scale => ({ kind: "slots", entries: [{ slotId: "scale", optionId: scale }, { slotId: "claim", optionId: "absolute" }] })) : numeric ? [{ kind: "number", value: (item.expected as { answer?: number }).answer! }] : [{ kind: "choice", optionId: "observed" }];
    const accepted = primary.map(answer => objective.critical ? [answer, { kind: "choice", optionId: "contract" } as Answer] : [answer]);
    return { id: `${canonicalObjective(objective.id)}.${mode}.${["a", "b", "c"][variant]}`, objective: objective.id, critical: objective.critical, prompt: objective.assessment + (numeric ? " Give a finite number; numeric strings and Boolean answers are not interchangeable." : repair ? " Select a complete transparent repair and justify the absolute measurement." : " Select the complete outcome and supported interpretation, not a matching image."), code: item.code, atoms: objective.critical ? [decision, { id: "reason", label: "Explain the mechanism or counterexample", kind: "choice", options: reasons }] : [decision], accepted, explanation: item.reason, remediation: `${objective.remediation} ${item.reason}` };
  })));
}
export const PRACTICE_FORMS = [definitions("practice", 0), definitions("practice", 1)] as const;
export const INDEPENDENT_FORMS = [definitions("mastery", 0), definitions("mastery", 1), definitions("mastery", 2)] as const;
export const ACTIVITIES = frozen(LESSONS.map((lesson, index) => {
  const critical = lesson.objectives.findIndex(item => item.critical);
  return [...lesson.objectives.map((_, offset) => referenceCase(index, offset)), referenceCase(index, critical, "practice", 0), referenceCase(index, critical, "practice", 1), ...(index === 2 ? [referenceCase(index, 2, "practice", 0), referenceCase(index, 2, "practice", 1)] : []), ...(index === 0 ? [referenceCase(index, 1, "experiment", 0), referenceCase(index, 1, "experiment", 1)] : [])].map((item, offset, items) => ({ id: `case-${offset}`, label: `${item.objective}: ${offset < 4 ? "worked recipe" : index === 0 && offset === 6 ? "teaching error — swapped coordinates" : index === 0 && offset === 7 ? "teaching error — wrong units" : "changed conditions " + (offset - 3)}`, code: item.code, charts: item.charts, output: format(item.expected), reasonId: `reason-${items.findIndex(candidate => candidate.reason === item.reason)}`, reason: item.reason }));
}));
export const ACTIVITY_REASONS = (lesson: number) => [...new Map(ACTIVITIES[lesson].map(item => [item.reasonId, { id: item.reasonId, label: item.reason }])).values(), { id: "shortcut", label: referenceCase(lesson, 0).misconception }];
export const activityPredictions = (lesson: number) => [...new Set(ACTIVITIES[lesson].map(item => item.output))];
export const CATALOG_VALID = LESSONS.length === 5 && PRACTICE_FORMS.every(form => form.length === 20 && form.every(validateDefinition)) && INDEPENDENT_FORMS.every(form => form.length === 20 && form.every(validateDefinition)) && LESSONS.flatMap(lesson => lesson.objectives).filter(item => item.critical).length === 5;
export const VERIFICATION_RELEASED = true;
export const MASTERY_AVAILABLE = VERIFICATION_RELEASED && CATALOG_VALID;
