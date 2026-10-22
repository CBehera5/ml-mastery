import type { ConceptualExercise, NumericalExercise, ParameterPredictionExercise } from "../../../learn/foundation/exercises";

export const ERRORS_LESSON_ID = "linear-regression.errors";
export const ERRORS_OBJECTIVES = {
  residuals: "linear-regression.errors.interpret-residuals",
  metrics: "linear-regression.errors.compare-metrics",
  evaluate: "linear-regression.errors.choose-evaluation-evidence",
} as const;

const retry = { maxAttempts: 3, variantIds: ["review"] };

export const ERROR_DIRECTION_EXERCISE: ParameterPredictionExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.errors.predict-direction", version: "1.0.0", kind: "parameter-prediction", objectiveIds: [ERRORS_OBJECTIVES.residuals], points: 1, retry,
  prompt: "A model predicts ₹245 lakh for a home that sold for ₹246 lakh. What sign is prediction − actual?",
  options: [{ id: "negative", label: "Negative: the model underpredicted" }, { id: "positive", label: "Positive: the model overpredicted" }], expectedOptionId: "negative",
  feedback: { correct: "Correct: 245 − 246 = −1, so the model underpredicted by ₹1 lakh.", incorrect: "Use the stated order: prediction minus actual.", exhausted: "245 − 246 = −1. A negative residual means underprediction here." },
};

export const RESIDUAL_VALUE_EXERCISE: NumericalExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.errors.residual-value", version: "1.0.0", kind: "numerical", objectiveIds: [ERRORS_OBJECTIVES.residuals], points: 1, retry,
  prompt: "Prediction is 213 and actual is 218. Enter prediction − actual.", expected: -5, absoluteTolerance: 1e-9, unit: "₹ lakh",
  feedback: { correct: "Correct: the residual is −5 ₹ lakh.", incorrect: "Subtract actual from prediction, keeping the sign.", exhausted: "The worked result is 213 − 218 = −5." },
};

export const METRIC_CHOICE_EXERCISE: ConceptualExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.errors.metric-choice", version: "1.0.0", kind: "conceptual", objectiveIds: [ERRORS_OBJECTIVES.metrics], points: 1, retry,
  prompt: "A safety team wants occasional very large misses to influence the score much more. Which metric best expresses that preference?",
  options: [{ id: "mse", label: "MSE, because squaring amplifies large residuals" }, { id: "mae", label: "MAE, because every miss contributes in direct proportion" }, { id: "mean", label: "Mean signed residual, because positive and negative misses cancel" }], expectedOptionId: "mse",
  feedback: { correct: "Correct: squared errors give unusually large misses disproportionate influence.", incorrect: "Think about how each metric transforms a residual before averaging.", exhausted: "MSE is the explicit large-error penalty among these choices." },
};

export const TRAINING_ERROR_EXERCISE: ConceptualExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.errors.training-error", version: "1.0.0", kind: "conceptual", objectiveIds: [ERRORS_OBJECTIVES.evaluate], points: 1, retry,
  prompt: "A model has very low training RMSE. What can you conclude?",
  options: [{ id: "insufficient", label: "Not enough: evaluate on untouched validation or test data" }, { id: "great", label: "It will predict unseen homes accurately" }, { id: "causal", label: "The chosen features cause the target" }], expectedOptionId: "insufficient",
  feedback: { correct: "Correct: training error measures fit to seen examples, not generalization.", incorrect: "Training performance alone cannot establish unseen-data performance or causality.", exhausted: "Use separate validation or test evidence before claiming generalization." },
};

export const ERRORS_EXERCISES = [ERROR_DIRECTION_EXERCISE, RESIDUAL_VALUE_EXERCISE, METRIC_CHOICE_EXERCISE, TRAINING_ERROR_EXERCISE] as const;
