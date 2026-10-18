import { dotProductTrace } from "./dot-product";

export const VECTOR_OPERATIONS_SCHEMA_VERSION = "1.0.0" as const;

export function vectorOperationsTrace(input: { left: number[]; right: number[]; scale: number }) {
  const { left, right, scale } = input;
  for (const values of [left, right]) {
    if (!Array.isArray(values) || values.length !== 2 || values.some(value => typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > 100)) throw new Error("Explorer vectors require exactly two finite components of magnitude at most 100.");
  }
  if (typeof scale !== "number" || !Number.isFinite(scale) || Math.abs(scale) > 10) throw new Error("Scale must be finite with magnitude at most 10.");
  const leftMagnitude = Math.hypot(...left), rightMagnitude = Math.hypot(...right);
  const dot = dotProductTrace({ features: left, weights: right }).value;
  const unitDirection = leftMagnitude === 0 ? null : left.map(value => value / leftMagnitude);
  const rightDirection = rightMagnitude === 0 ? null : right.map(value => value / rightMagnitude);
  const cosine = unitDirection === null || rightDirection === null ? null : Math.max(-1, Math.min(1, dotProductTrace({ features: unitDirection, weights: rightDirection }).value));
  const projectedLength = rightDirection === null ? null : dotProductTrace({ features: left, weights: rightDirection }).value;
  return {
    schemaVersion: VECTOR_OPERATIONS_SCHEMA_VERSION,
    input: { left: [...left], right: [...right], scale },
    sum: left.map((value, index) => value + right[index]),
    scaled: left.map(value => scale * value),
    leftMagnitude, rightMagnitude, dot,
    unitDirection,
    cosine, angleDegrees: cosine === null ? null : Math.acos(cosine) * 180 / Math.PI,
    projection: rightDirection === null ? null : rightDirection.map(value => projectedLength! * value),
  };
}
