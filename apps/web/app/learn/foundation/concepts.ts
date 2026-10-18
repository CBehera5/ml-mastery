export const CONCEPT_REGISTRY_VERSION = "1.0.0" as const;

export type ConceptDefinition = {
  id: string;
  term: string;
  definition: string;
  intuition: string;
  symbol?: string;
  prerequisite?: { label: string; href: string };
};

export const CONCEPTS = {
  feature: { id: "ml.feature", term: "Feature", definition: "A value the model receives as input.", intuition: "For a house, floor area can be a feature because it is known when we make the estimate.", symbol: "x", prerequisite: { label: "Review functions and inputs", href: "/math/functions-derivatives" } },
  target: { id: "ml.target", term: "Target", definition: "The value the model is trying to predict.", intuition: "A recorded sale price is the target used to judge a house-price prediction.", symbol: "y" },
  prediction: { id: "ml.prediction", term: "Prediction", definition: "The numerical estimate produced by the model.", intuition: "A prediction is an estimate, not the known answer.", symbol: "ŷ" },
  parameter: { id: "ml.parameter", term: "Parameter", definition: "A model value learned or adjusted during training.", intuition: "Weight w controls how strongly a feature changes the prediction; bias b sets the baseline.", symbol: "w, b", prerequisite: { label: "Review weighted sums", href: "/math/vectors-dot-product" } },
  residual: { id: "ml.residual", term: "Residual", definition: "The signed difference between a prediction and its actual target.", intuition: "Using prediction − actual, a negative residual means the model predicted too low.", symbol: "r = ŷ − y" },
  mae: { id: "metrics.mae", term: "Mean Absolute Error (MAE)", definition: "The average absolute residual.", intuition: "Every miss contributes in direct proportion to its size.", symbol: "(1/m)Σ|r|" },
  mse: { id: "metrics.mse", term: "Mean Squared Error (MSE)", definition: "The average squared residual.", intuition: "Squaring prevents cancellation and gives large misses extra influence.", symbol: "(1/m)Σr²" },
  rmse: { id: "metrics.rmse", term: "Root Mean Squared Error (RMSE)", definition: "The square root of MSE.", intuition: "It retains squared-error sensitivity while returning to the target's units.", symbol: "√MSE" },
  gradient: { id: "optimization.gradient", term: "Gradient", definition: "A collection of derivatives describing how loss changes as parameters change.", intuition: "Its sign and size tell us which local parameter movement changes error most strongly.", symbol: "∇L", prerequisite: { label: "Review derivatives and gradients", href: "/math/derivatives" } },
  learningRate: { id: "optimization.learning-rate", term: "Learning rate", definition: "The step-size multiplier used in a parameter update.", intuition: "Too small can learn slowly; too large can overshoot or diverge.", symbol: "α" },
  trainingSet: { id: "evaluation.training-set", term: "Training set", definition: "Observations used to fit model parameters.", intuition: "The model is allowed to learn from these rows." },
  testSet: { id: "evaluation.test-set", term: "Test set", definition: "Held-out observations used to estimate performance after fitting decisions are complete.", intuition: "Keeping these rows untouched makes them a more honest proxy for unseen data." },
} as const satisfies Record<string, ConceptDefinition>;

export type ConceptKey = keyof typeof CONCEPTS;
export const conceptList = (keys: ConceptKey[]): ConceptDefinition[] => keys.map((key) => CONCEPTS[key]);

export function validateConceptRegistry(concepts: ConceptDefinition[]): string[] {
  const errors: string[] = [], ids = new Set<string>(), terms = new Set<string>();
  for (const concept of concepts) {
    if (!concept.id.trim() || !concept.term.trim() || !concept.definition.trim() || !concept.intuition.trim()) errors.push("Every concept requires an id, term, definition, and intuition.");
    if (ids.has(concept.id)) errors.push(`Duplicate concept id: ${concept.id}`); else ids.add(concept.id);
    const normalizedTerm = concept.term.trim().toLowerCase();
    if (terms.has(normalizedTerm)) errors.push(`Duplicate concept term: ${concept.term}`); else terms.add(normalizedTerm);
    if (concept.prerequisite && (!concept.prerequisite.label.trim() || !concept.prerequisite.href.startsWith("/"))) errors.push(`Invalid prerequisite for concept: ${concept.id}`);
  }
  return errors;
}
