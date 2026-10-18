export const EXERCISE_SCHEMA_VERSION = "1.0.0" as const;
export type ExerciseKind = "conceptual" | "numerical" | "parameter-prediction" | "constrained-code";
export type RetryPolicy = { maxAttempts: number; variantIds: string[]; revealWorkedAnswerAfter?: number };
type BaseExercise = { schemaVersion: typeof EXERCISE_SCHEMA_VERSION; id: string; version: string; objectiveIds: string[]; prompt: string; points: number; retry: RetryPolicy; feedback: { correct: string; incorrect: string; exhausted: string } };
export type ConceptualExercise = BaseExercise & { kind: "conceptual"; options: { id: string; label: string }[]; expectedOptionId: string };
export type NumericalExercise = BaseExercise & { kind: "numerical"; expected: number; absoluteTolerance: number; unit?: string };
export type ParameterPredictionExercise = BaseExercise & { kind: "parameter-prediction"; options: { id: string; label: string }[]; expectedOptionId: string };
export type ConstrainedCodeExercise = BaseExercise & { kind: "constrained-code"; slots: { id: string; allowedValues: string[] }[]; expectedSlots: Record<string, string> };
export type ExerciseDefinition = ConceptualExercise | NumericalExercise | ParameterPredictionExercise | ConstrainedCodeExercise;
export type LearnerResponse = { kind: "conceptual" | "parameter-prediction"; optionId: string } | { kind: "numerical"; value: number } | { kind: "constrained-code"; slots: Record<string, string> };
export type ExerciseResult = { correct: boolean; score: number; maxScore: number; feedback: string; retryAllowed: boolean; nextVariantId?: string };

export function validateExercise(exercise: ExerciseDefinition): string[] {
  const errors: string[] = [];
  if (exercise.schemaVersion !== EXERCISE_SCHEMA_VERSION) errors.push("Unsupported exercise schema version.");
  if (!exercise.id.trim() || !exercise.version.trim() || !exercise.prompt.trim()) errors.push("Exercise identity and prompt are required.");
  if (!Number.isFinite(exercise.points) || exercise.points <= 0) errors.push("Exercise points must be positive.");
  if (!Number.isInteger(exercise.retry.maxAttempts) || exercise.retry.maxAttempts < 1) errors.push("Retry maxAttempts must be a positive integer.");
  if (exercise.kind === "numerical" && (!Number.isFinite(exercise.expected) || !Number.isFinite(exercise.absoluteTolerance) || exercise.absoluteTolerance < 0)) errors.push("Numerical expectation and tolerance must be finite.");
  if ((exercise.kind === "conceptual" || exercise.kind === "parameter-prediction") && !exercise.options.some(({ id }) => id === exercise.expectedOptionId)) errors.push("Expected option must be present in options.");
  if (exercise.kind === "constrained-code") for (const slot of exercise.slots) if (!slot.allowedValues.includes(exercise.expectedSlots[slot.id])) errors.push(`Expected value for ${slot.id} is not allowed.`);
  return errors;
}

export function evaluateExercise(exercise: ExerciseDefinition, response: LearnerResponse, attemptNumber: number): ExerciseResult {
  const validation = validateExercise(exercise);
  if (validation.length) throw new Error(validation.join(" "));
  if (attemptNumber < 1 || !Number.isInteger(attemptNumber)) throw new Error("Attempt number must be a positive integer.");
  let correct = false;
  if (exercise.kind === "numerical" && response.kind === "numerical") correct = Number.isFinite(response.value) && Math.abs(response.value - exercise.expected) <= exercise.absoluteTolerance;
  else if (exercise.kind === "constrained-code" && response.kind === "constrained-code") correct = exercise.slots.every(({ id, allowedValues }) => allowedValues.includes(response.slots[id]) && response.slots[id] === exercise.expectedSlots[id]);
  else if ((exercise.kind === "conceptual" || exercise.kind === "parameter-prediction") && response.kind === exercise.kind) correct = response.optionId === exercise.expectedOptionId;
  const retryAllowed = !correct && attemptNumber < exercise.retry.maxAttempts;
  return { correct, score: correct ? exercise.points : 0, maxScore: exercise.points, feedback: correct ? exercise.feedback.correct : retryAllowed ? exercise.feedback.incorrect : exercise.feedback.exhausted, retryAllowed, nextVariantId: retryAllowed && exercise.retry.variantIds.length ? exercise.retry.variantIds[(attemptNumber - 1) % exercise.retry.variantIds.length] : undefined };
}
