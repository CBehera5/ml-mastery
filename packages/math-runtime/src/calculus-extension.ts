import { centralDerivative } from "./calculus";

export const CALCULUS_EXTENSION_SCHEMA_VERSION = "1.0.0" as const;
function bounded(name: string, value: number, maximum: number) {
  if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > maximum) throw new Error(`${name} must be finite with magnitude at most ${maximum}.`);
  return value;
}
export type ContinuityCase = "smooth" | "hole" | "jump" | "corner";
export function continuityTrace(kind: ContinuityCase, rawStep: number) {
  const step = bounded("step", rawStep, 1);
  if (step < .000001) throw new Error("step must be between 0.000001 and 1.");
  if (!["smooth", "hole", "jump", "corner"].includes(kind)) throw new Error("Choose a supported continuity example.");
  const center = kind === "hole" ? 1 : 0;
  const valueAt = (value: number) => kind === "hole" ? value + 1 : kind === "jump" ? value < 0 ? -1 : 1 : kind === "corner" ? Math.abs(value) : value * value;
  const value = kind === "hole" ? null : valueAt(center);
  return { schemaVersion: CALCULUS_EXTENSION_SCHEMA_VERSION, kind, center, step, value,
    left: { input: center - step, value: valueAt(center - step) }, right: { input: center + step, value: valueAt(center + step) },
    limit: kind === "jump" ? null : kind === "hole" ? 2 : 0,
    continuous: kind === "smooth" || kind === "corner", differentiable: kind === "smooth",
    derivative: kind === "smooth" ? 0 : null,
    leftSlope: value === null ? null : (valueAt(center - step) - value) / -step,
    rightSlope: value === null ? null : (valueAt(center + step) - value) / step,
    symmetricEstimate: centralDerivative(valueAt, center, step),
  };
}
export function multivariableTrace(input: { x: number; y: number; rate: number; shape: "bowl" | "saddle"; direction: "x" | "y" | "diagonal" }) {
  const x = bounded("x", input.x, 5), y = bounded("y", input.y, 5), rate = bounded("rate", input.rate, .2);
  if (rate < 0 || !["bowl", "saddle"].includes(input.shape) || !["x", "y", "diagonal"].includes(input.direction)) throw new Error("Choose a supported function, direction and nonnegative rate.");
  const coefficient = input.shape === "bowl" ? 3 : -1;
  const valueAt = (first: number, second: number) => first * first + coefficient * second * second;
  const gradient = [2 * x, 2 * coefficient * y];
  const unitDirection = input.direction === "x" ? [1, 0] : input.direction === "y" ? [0, 1] : [Math.SQRT1_2, Math.SQRT1_2];
  const next = [x - rate * gradient[0], y - rate * gradient[1]];
  return { schemaVersion: CALCULUS_EXTENSION_SCHEMA_VERSION, input: { ...input }, value: valueAt(x, y), gradient,
    numericalGradient: [centralDerivative(value => valueAt(value, y), x), centralDerivative(value => valueAt(x, value), y)],
    unitDirection, directionalDerivative: gradient[0] * unitDirection[0] + gradient[1] * unitDirection[1],
    update: { displacement: [-rate * gradient[0], -rate * gradient[1]], next, value: valueAt(next[0], next[1]) },
    jacobian: [[1, 1], [y, x]], hessian: [[2, 0], [0, 2 * coefficient]],
  };
}
