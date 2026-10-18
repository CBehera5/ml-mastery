export const HOUSE_DATA = {
  features: [[1], [1.8], [2.5], [3.2], [4], [4.8]],
  targets: [178, 213, 246, 278, 316, 349],
} as const;

export const HOUSE_PARAMETERS = { weights: [42], bias: 140 };

export const MULTI_FEATURE_DATA = [
  [1.2, 2, 35],
  [1.8, 3, 20],
  [2.4, 3, 12],
  [3.1, 4, 5],
] as const;

export const MULTI_TARGETS = [176, 244, 306, 405] as const;
export const MULTI_PARAMETERS = { weights: [82, 18, -1.4], bias: 75 };

export const FEATURE_LABELS = ["Floor area", "Bedrooms", "Property age"] as const;
export const FEATURE_UNITS = ["thousand ft²", "rooms", "years"] as const;

export type FailureScenario = "outlier" | "nonlinear" | "underfit" | "overfit" | "scaling";
