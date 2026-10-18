import type { ConceptualExercise, ConstrainedCodeExercise, NumericalExercise } from "../../foundation/exercises";

export const IMPLEMENTATION_LESSON_ID = "linear-regression.implementation";
export const IMPLEMENTATION_OBJECTIVES = {
  translate: "linear-regression.implementation.translate-math-to-python",
  optimize: "linear-regression.implementation.implement-training-update",
  workflow: "linear-regression.implementation.use-safe-workflow",
} as const;

const retry = { maxAttempts: 3, variantIds: ["review"] };
const codeFeedback = { correct: "Correct—the code now matches the mathematical operation.", incorrect: "Trace the values in the equation before choosing again.", exhausted: "Use the worked explanation beside the exercise, then retry." };

export const PREDICTION_CODE_EXERCISE: ConstrainedCodeExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.implementation.prediction-function", version: "1.0.0", kind: "constrained-code", objectiveIds: [IMPLEMENTATION_OBJECTIVES.translate],
  prompt: "Complete the prediction function.", points: 1, retry, feedback: codeFeedback,
  slots: [{ id: "return", allowedValues: ["w * x + b", "w + x * b", "(w + x) * b"] }], expectedSlots: { return: "w * x + b" },
};

export const RESIDUAL_CODE_EXERCISE: ConstrainedCodeExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.implementation.residual", version: "1.0.0", kind: "constrained-code", objectiveIds: [IMPLEMENTATION_OBJECTIVES.translate],
  prompt: "Use the lesson convention: residual = prediction − actual.", points: 1, retry, feedback: { ...codeFeedback, incorrect: "Check the order: this course uses prediction minus actual." },
  slots: [{ id: "residual", allowedValues: ["prediction - actual", "actual - prediction", "abs(prediction - actual)"] }], expectedSlots: { residual: "prediction - actual" },
};

export const MSE_REPAIR_EXERCISE: ConstrainedCodeExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.implementation.mse-repair", version: "1.0.0", kind: "constrained-code", objectiveIds: [IMPLEMENTATION_OBJECTIVES.translate],
  prompt: "Repair an implementation that incorrectly averages signed residuals.", points: 1, retry, feedback: { ...codeFeedback, incorrect: "MSE must square every residual before averaging." },
  slots: [{ id: "term", allowedValues: ["r ** 2", "abs(r)", "r"] }], expectedSlots: { term: "r ** 2" },
};

export const GRADIENT_FORMULA_EXERCISE: ConstrainedCodeExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.implementation.gradient-formula", version: "1.0.0", kind: "constrained-code", objectiveIds: [IMPLEMENTATION_OBJECTIVES.optimize],
  prompt: "Choose the MSE weight-gradient term for one feature.", points: 1, retry, feedback: { ...codeFeedback, incorrect: "The derivative includes 2/m, each residual, and the corresponding feature value." },
  slots: [{ id: "gradient", allowedValues: ["(2 / m) * sum(r * x for r, x in zip(residuals, xs))", "sum(residuals) / m", "(1 / m) * sum(abs(r) for r in residuals)"] }], expectedSlots: { gradient: "(2 / m) * sum(r * x for r, x in zip(residuals, xs))" },
};

export const UPDATE_REPAIR_EXERCISE: ConstrainedCodeExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.implementation.update-repair", version: "1.0.0", kind: "constrained-code", objectiveIds: [IMPLEMENTATION_OBJECTIVES.optimize],
  prompt: "Repair the parameter update so it moves against the gradient.", points: 1, retry, feedback: { ...codeFeedback, incorrect: "Gradient descent subtracts learning_rate × gradient." },
  slots: [{ id: "update", allowedValues: ["w - learning_rate * dw", "w + learning_rate * dw", "learning_rate - w * dw"] }], expectedSlots: { update: "w - learning_rate * dw" },
};

export const ITERATION_TRACE_EXERCISE: NumericalExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.implementation.trace-iteration", version: "1.0.0", kind: "numerical", objectiveIds: [IMPLEMENTATION_OBJECTIVES.optimize],
  prompt: "For x=[1,2], y=[3,5], w=1, b=0, and learning rate 0.1, what is the updated weight?", points: 1, retry, feedback: { correct: "Correct: dw = -8, so 1 - 0.1(-8) = 1.8.", incorrect: "Compute residuals [-2,-3], then dw = (2/2) × [1(-2)+2(-3)].", exhausted: "The worked update is w_new = 1 - 0.1(-8) = 1.8." }, expected: 1.8, absoluteTolerance: 1e-9,
};

export const WORKFLOW_EXERCISE: ConceptualExercise = {
  schemaVersion: "1.0.0", id: "linear-regression.implementation.workflow", version: "1.0.0", kind: "conceptual", objectiveIds: [IMPLEMENTATION_OBJECTIVES.workflow],
  prompt: "Which workflow gives an honest estimate of performance on unseen homes?", points: 1, retry,
  feedback: { correct: "Correct: keep test targets out of training and evaluate only after fitting.", incorrect: "If test data influences fitting or scaling, the evaluation is no longer independent.", exhausted: "Split first, fit only on training data, then evaluate once on held-out data." },
  options: [
    { id: "safe", label: "Split first, fit on training rows, then evaluate on untouched test rows" },
    { id: "leak", label: "Fit on every row, then call some of those same rows the test set" },
    { id: "choose", label: "Try many models on the test set and report whichever scores best" },
  ], expectedOptionId: "safe",
};

export const IMPLEMENTATION_EXERCISES = [PREDICTION_CODE_EXERCISE, RESIDUAL_CODE_EXERCISE, MSE_REPAIR_EXERCISE, GRADIENT_FORMULA_EXERCISE, UPDATE_REPAIR_EXERCISE, ITERATION_TRACE_EXERCISE, WORKFLOW_EXERCISE] as const;
