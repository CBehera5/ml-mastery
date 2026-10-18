import reference from "../../../../../packages/python-contracts/fixtures/essentials.v1.json";
import { EXPERIMENT, family as p01Family, PRACTICE, PREDICTIONS, REASONS } from "../foundation/fixtures";
import { type Answer, type Family, validateDefinition } from "../foundation/contracts";

export const CONTENT = "python.essentials.1.0.0";
export const ASSESSMENT = "python.essentials.mastery.v1";
export const SOURCE_MAP = "p01-to-essentials.copy.1";
export const LESSONS = reference.lessons;
export const canonicalObjective = (short: string) => `python.essentials.${short.toLowerCase()}`;
const rotate = <Value,>(values: readonly Value[], offset: number) => [...values.slice(offset % values.length), ...values.slice(0, offset % values.length)];
const format = (value: unknown) => JSON.stringify(value);
const CRITICAL_DISTRACTORS = [
  [],
  ["Assigning a second name copies the list values, so editing alias cannot change the original feature vector.", "copy() keeps both names linked to the same mutable list, while assignment creates an independent list."],
  ["A truthiness check is sufficient because an observed zero and missing None both mean the measurement was unavailable.", "Convert None to zero first, then drop every false-valued row; this preserves all genuinely observed records."],
  ["Only the last nonzero error contributes to the final average; resetting the accumulator inside the loop prevents duplicate counting.", "The sum uses every squared error, but the denominator should exclude observations with zero error because they add nothing."],
  ["Printing the prediction automatically provides that number to the next call, so an explicit return would not change the pipeline.", "A function's local price variable becomes its result automatically when the function ends, even without a return statement."],
  ["After filtering the features, pair them with the first remaining number of original targets; matching lengths guarantee matching observations.", "Filter feature and target columns separately using their own valid-value checks; their original row positions are no longer needed."],
  ["Returning zero after failed conversion keeps the pipeline numeric and means the same thing as an explicitly invalid record.", "Catching every exception and returning a plausible zero repairs the input contract, so the record can safely be used as observed data."],
  ["A successful CSV or JSON parse validates the model's required fields and units, so missing numbers can be accepted as observed zeros.", "Fill a missing or invalid required area with zero and treat empty age as zero; schema validation is unnecessary once parsing succeeds."],
];
function frozen<Value>(value: Value): Value {
  if (value !== null && typeof value === "object") { Object.values(value).forEach(frozen); Object.freeze(value); }
  return value;
}
export function definitions(mode: "practice" | "mastery", variant: number): readonly Family[] {
  if (!Number.isInteger(variant) || variant < 0 || variant >= (mode === "practice" ? 2 : 3)) throw Error("Unsupported form.");
  return frozen(LESSONS.flatMap((lesson, lessonIndex) => lesson.objectives.map((objective, objectiveIndex): Family => {
    if (lessonIndex === 0) return mode === "practice" ? PRACTICE[objectiveIndex][variant] : p01Family(objectiveIndex, variant, true);
    const item = reference.cases.find(item => item.objective === objective.id && item.mode === mode && item.variant === variant)!;
    const primary = rotate([{ id: "observed", label: format(item.expected) }, { id: "counter", label: format(item.wrong) }, { id: "no_result", label: "The supplied program cannot produce any of these states." }], (lessonIndex + objectiveIndex + variant) % 3);
    const reason = rotate([{ id: "contract", label: item.reason }, { id: "shortcut", label: CRITICAL_DISTRACTORS[lessonIndex][0] ?? lesson.misconception }, { id: "default", label: CRITICAL_DISTRACTORS[lessonIndex][1] ?? "A plausible final output proves every earlier operation preserved the intended data." }], (objectiveIndex + variant) % 3);
    const answer: Answer = { kind: "choice", optionId: "observed" };
    return { id: `${canonicalObjective(objective.id)}.${mode}.${["a", "b", "c"][variant]}`, objective: objective.id, critical: objective.critical,
      prompt: `${objective.assessment} Predict the result or error of this supplied program; preserve types, order and row identity.${item.raises === "SyntaxError" ? " Diagnosis options give [classification, minimal repair, result after repair]." : item.raises ? " Error-trace options give [error class, failing operation]." : ""}`,
      code: item.code, atoms: objective.critical ? [{ id: "decision", label: "Result / repair outcome", kind: "choice", options: primary }, { id: "reason", label: "Explain why that outcome is justified", kind: "choice", options: reason }] : [{ id: "decision", label: "Result / reasoning outcome", kind: "choice", options: primary }],
      accepted: [objective.critical ? [answer, { kind: "choice", optionId: "contract" }] : [answer]],
      explanation: item.reason, remediation: `${objective.remediation} ${item.reason} Compare the changed worked case, then try a different form.` };
  })));
}
export const PRACTICE_FORMS = [definitions("practice", 0), definitions("practice", 1)] as const;
export const INDEPENDENT_FORMS = [definitions("mastery", 0), definitions("mastery", 1), definitions("mastery", 2)] as const;
export function workedCase(lesson: number, objective: number) {
  return reference.cases.find(item => item.lesson === LESSONS[lesson].slug && item.objective === LESSONS[lesson].objectives[objective].id && item.mode === "worked") ?? null;
}
export type Activity = { id: string; label: string; code: string; output: string; reasonId: string; reason: string };
export function activities(lesson: number): readonly Activity[] {
  if (lesson === 0) return EXPERIMENT.map(item => ({ id: item.id, label: item.label, code: item.code, output: item.value, reasonId: item.reason, reason: REASONS.find(reason => reason.id === item.reason)!.label }));
  const target = LESSONS[lesson].objectives.find(objective => objective.critical)!;
  return reference.cases.filter(item => item.objective === target.id && item.mode === "worked" || item.objective === target.id && item.mode === "practice").map((item, index) => ({ id: `case-${index}`, label: index === 0 ? "Worked configuration" : `Changed configuration ${index}`, code: item.code, output: format(item.expected), reasonId: "contract", reason: item.reason }));
}
export const ACTIVITIES = frozen(LESSONS.map((_, index) => activities(index)));
export const ACTIVITY_REASONS = (lesson: number) => {
  if (lesson === 0) return REASONS;
  const atom = PRACTICE_FORMS[0].slice(lesson * 4, lesson * 4 + 4).find(item => item.critical)!.atoms[1];
  return atom.kind === "choice" ? atom.options : [];
};
export const activityPredictions = (lesson: number): readonly string[] => lesson === 0 ? PREDICTIONS : [...new Set([...ACTIVITIES[lesson].map(item => item.output), format(reference.cases.find(item => item.lesson === LESSONS[lesson].slug && item.mode === "worked" && item.objective === LESSONS[lesson].objectives.find(objective => objective.critical)!.id)!.wrong), "No result is possible"])];
export const CATALOG_VALID = PRACTICE_FORMS.every(form => form.length === 32 && form.every(validateDefinition)) && INDEPENDENT_FORMS.every(form => form.length === 32 && form.every(validateDefinition)) && LESSONS.length === 8 && LESSONS.flatMap(item => item.objectives).filter(item => item.critical).length === 8;
export const VERIFICATION_RELEASED = true;
export const MASTERY_AVAILABLE = VERIFICATION_RELEASED && CATALOG_VALID;
