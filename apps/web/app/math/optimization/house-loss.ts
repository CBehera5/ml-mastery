// The house-price loss surface used by the Optimization lesson-1 playground.
// Same data and the same mean-squared-error loss as the Linear Regression module.
import { HOUSE_DATA } from "../../algorithms/linear-regression/lab-data";

export const AREAS: number[] = HOUSE_DATA.features.map((row) => row[0]);
export const PRICES: number[] = [...HOUSE_DATA.targets];
const m = AREAS.length;

export const houseLoss = (w: number, b: number) => AREAS.reduce((sum, x, i) => sum + (w * x + b - PRICES[i]) ** 2, 0) / m;
export const houseGradient = (w: number, b: number): [number, number] => {
  let dw = 0, db = 0;
  AREAS.forEach((x, i) => { const r = w * x + b - PRICES[i]; dw += (2 / m) * r * x; db += (2 / m) * r; });
  return [dw, db];
};

/** Exact least-squares line, the bottom of the bowl. */
export const bestLine = (): [number, number] => {
  const xm = AREAS.reduce((a, c) => a + c, 0) / m, ym = PRICES.reduce((a, c) => a + c, 0) / m;
  const w = AREAS.reduce((s, x, i) => s + (x - xm) * (PRICES[i] - ym), 0) / AREAS.reduce((s, x) => s + (x - xm) ** 2, 0);
  return [w, ym - w * xm];
};

export const W_RANGE: [number, number] = [0, 90];
export const B_RANGE: [number, number] = [60, 200];
export const START: [number, number] = [10, 100];
