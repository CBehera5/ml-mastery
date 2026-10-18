import type { ConceptualExercise, ParameterPredictionExercise } from "../../foundation/exercises";

export const WHY_LESSON_ID = "linear-regression.why";
export const WHY_OBJECTIVES = {
  frame: "linear-regression.why.frame-prediction",
  distinguish: "linear-regression.why.distinguish-regression",
  decide: "linear-regression.why.choose-appropriate-use",
} as const;

const shared = { schemaVersion: "1.0.0" as const, version: "1.0.0", points: 1, retry: { maxAttempts: 2, variantIds: ["b"] }, feedback: { correct: "Correct.", incorrect: "Look at the kind of answer the model must produce.", exhausted: "Review the explanation, then continue." } };

export const SIZE_PREDICTION_EXERCISE: ParameterPredictionExercise = {
  ...shared, id: "linear-regression.why.size-prediction", kind: "parameter-prediction", objectiveIds: [WHY_OBJECTIVES.frame],
  prompt: "If the observed relationship continues, which home should receive the larger price estimate?",
  options: [{ id: "larger", label: "The 3.6-thousand-ft² home" }, { id: "smaller", label: "The 1.4-thousand-ft² home" }], expectedOptionId: "larger",
};

export const REGRESSION_KIND_EXERCISE: ConceptualExercise = {
  ...shared, id: "linear-regression.why.kind-check", kind: "conceptual", objectiveIds: [WHY_OBJECTIVES.distinguish],
  prompt: "Which output makes this a regression problem?",
  options: [{ id: "number", label: "A numerical price estimate" }, { id: "class", label: "A label such as affordable or expensive" }], expectedOptionId: "number",
};

export const SUITABILITY_EXERCISE: ConceptualExercise = {
  ...shared, id: "linear-regression.why.suitability", kind: "conceptual", objectiveIds: [WHY_OBJECTIVES.decide],
  prompt: "Which situation is the most defensible starting point for Linear Regression?",
  options: [
    { id: "energy", label: "Estimate monthly energy use from floor area when the scatterplot shows a roughly straight trend" },
    { id: "spam", label: "Decide whether an email is spam or not spam" },
    { id: "curve", label: "Predict a quantity whose graph loops and changes direction repeatedly" },
  ], expectedOptionId: "energy",
};
