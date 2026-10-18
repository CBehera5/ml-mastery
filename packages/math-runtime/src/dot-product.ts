export const DOT_PRODUCT_SCHEMA_VERSION = "1.0.0" as const;

export interface DotProductInput { features: number[]; weights: number[] }
export interface DotProductTrace {
  schemaVersion: typeof DOT_PRODUCT_SCHEMA_VERSION;
  input: DotProductInput;
  contributions: number[];
  value: number;
}

const vector = (name: string, values: number[]): number[] => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`${name} must be a non-empty one-dimensional numeric array`);
  }
  if (values.some((value) => typeof value !== "number" || !Number.isFinite(value))) {
    throw new Error(`${name} must contain only finite numbers`);
  }
  return [...values];
};

export const dotProductTrace = (raw: DotProductInput): DotProductTrace => {
  const features = vector("features", raw.features);
  const weights = vector("weights", raw.weights);
  if (features.length !== weights.length) throw new Error("features and weights must have the same length");
  const contributions = features.map((feature, index) => feature * weights[index]);
  return {
    schemaVersion: DOT_PRODUCT_SCHEMA_VERSION,
    input: { features, weights },
    contributions,
    value: contributions.reduce((sum, contribution) => sum + contribution, 0),
  };
};

