export const mean = (v: readonly number[]) => v.reduce((a, b) => a + b, 0) / v.length;
export const relu = (z: number) => Math.max(0, z);
export const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

/* ── NN01 · one hidden neuron ── */
export function forward(x: number, w: number, b: number, v: number, c: number, activation: "relu" | "linear") {
  const z = x * w + b, h = activation === "relu" ? relu(z) : z, logit = v * h + c;
  return { z, h, logit, p: sigmoid(logit) };
}
/** Shapes for n rows, f features, h hidden neurons. */
export const shapes = (n: number, f: number, h: number) => ({ X: [n, f], W1: [f, h], b1: [h], W2: [h, 1], b2: [1] });

/* ── NN02 · gradient descent on one weight ── */
export const sgdStep = (w: number, grad: number, lr: number) => w - lr * grad;
export const XS = [1, 2, 3] as const, YS = [2, 4, 6] as const; // the truth is y = 2x
export const lossOf = (w: number) => mean(XS.map((x, i) => (w * x - YS[i]) ** 2));
export const gradOf = (w: number) => mean(XS.map((x, i) => 2 * x * (w * x - YS[i])));
export function descend(lr: number, steps: number, w0 = 0) { const path = [w0]; for (let i = 0; i < steps; i++) path.push(sgdStep(path[i], gradOf(path[i]), lr)); return path; }

/* ── NN03 · capacity ── */
export const nParams = (inputs: number, hidden: number, outputs = 1) => inputs * hidden + hidden + hidden * outputs + outputs;

/* ── NN04 · reproducibility ── */
function lcg(seed: number) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
export const initWeights = (seed: number, n: number) => { const r = lcg(seed); return Array.from({ length: n }, () => Number(((r() - 0.5) * 2).toFixed(4))); };
export const TRAIN_VALUES = [0, 2] as const, VALID_VALUES = [100] as const;

/* ── NN05 · simple versus complex ── */
export const preferSimple = (simpleLoss: number, complexLoss: number, tol: number) => (simpleLoss - complexLoss <= tol ? "simple" : "complex");
export const toPy = (a: unknown) => JSON.stringify(a);
