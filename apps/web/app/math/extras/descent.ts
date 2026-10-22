// Pure maths for the Optimization playgrounds; every quoted number is asserted in tests.
export const loss1 = (w: number) => (w - 3) ** 2;
export const grad1 = (w: number) => 2 * (w - 3);
/** Path of gradient descent on L(w) = (w-3)², including the start. */
export function descend1(w0: number, lr: number, steps: number) {
  const path = [w0];
  for (let i = 0; i < steps; i++) path.push(path[i] - lr * grad1(path[i]));
  return path;
}
/** Closed form: w_k = 3 + (1 - 2·lr)^k (w0 - 3). */
export const closedForm1 = (w0: number, lr: number, k: number) => 3 + (1 - 2 * lr) ** k * (w0 - 3);
export type Behaviour = "converging" | "oscillating" | "diverging";
export const behaviour = (lr: number): Behaviour => { const r = Math.abs(1 - 2 * lr); return r < 1 - 1e-9 ? "converging" : r > 1 + 1e-9 ? "diverging" : "oscillating"; };

/** Narrow bowl L(a,b) = (a-3)² + k·b². */
export const bowl = (a: number, b: number, k: number) => (a - 3) ** 2 + k * b * b;
export function descendBowl(a0: number, b0: number, k: number, lr: number, steps: number) {
  const path: [number, number][] = [[a0, b0]];
  for (let i = 0; i < steps; i++) { const [a, b] = path[i]; path.push([a - lr * 2 * (a - 3), b - lr * 2 * k * b]); }
  return path;
}
/** Largest stable step for the bowl is 1/max(1,k). */
export const stableLimit = (k: number) => 1 / Math.max(1, k);

/** Ridge on the six-house data, intercept free: w = Sxy / (Sxx + m·λ). */
import { HOUSE_DATA } from "../../learn/linear-regression/lab-data";
const X = HOUSE_DATA.features.map((r) => r[0]), Y = [...HOUSE_DATA.targets];
const m = X.length, xm = X.reduce((a, c) => a + c, 0) / m, ym = Y.reduce((a, c) => a + c, 0) / m;
const Sxx = X.reduce((s, x) => s + (x - xm) ** 2, 0), Sxy = X.reduce((s, x, i) => s + (x - xm) * (Y[i] - ym), 0);
export const ridgeSlope = (lambda: number) => Sxy / (Sxx + m * lambda);
export const ridgeFit = (lambda: number): [number, number] => { const w = ridgeSlope(lambda); return [w, ym - w * xm]; };
export const ridgeLoss = (lambda: number) => { const [w, b] = ridgeFit(lambda); const mse = X.reduce((s, x, i) => s + (w * x + b - Y[i]) ** 2, 0) / m; return { mse, penalty: lambda * w * w, total: mse + lambda * w * w }; };
export const HOUSE_X = X, HOUSE_Y = Y;
