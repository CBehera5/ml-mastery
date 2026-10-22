/** Pure maths behind the Statistics playgrounds. Lesson text, charts and Python cells agree with these. */
import { rng } from "./prob-math";
export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
export const mean = (xs: number[]) => sum(xs) / xs.length;
export const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
export const variance = (xs: number[], sample = false) => { const m = mean(xs); return sum(xs.map((x) => (x - m) ** 2)) / (xs.length - (sample ? 1 : 0)); };
export const std = (xs: number[], sample = false) => Math.sqrt(variance(xs, sample));

/** Lesson 1: a tiny table. */
export const TABLE = { cols: ["Area (sq ft)", "Bedrooms", "City", "Price (₹ lakh)"], kinds: ["numerical", "numerical", "categorical", "numerical"] as const,
  rows: [[850, 2, "Pune", 52], [1200, 3, "Hyderabad", 78], [640, 1, "Pune", 38], [1500, 3, "Chennai", 95], [980, 2, "Hyderabad", 61], [2100, 4, "Pune", 140], [760, 2, "Chennai", 44], [1320, 3, "Hyderabad", 85]] as (string | number)[][] };

/** Lessons 2 and 3. */
export const BASE = [42, 45, 48, 50, 52, 55, 58, 60];
export const withExtra = (v: number) => [...BASE, v];
export const TIGHT = [46, 48, 50, 50, 50, 52, 54];
export const WIDE = [30, 40, 50, 50, 50, 60, 70];

/** Lesson 4: 30 exam scores. */
export const SCORES30 = [35, 42, 48, 50, 52, 53, 55, 56, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 75, 76, 78, 80, 82, 85, 90, 98];
export const quartiles = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b), h = s.length >> 1; return { q1: median(s.slice(0, h)), q2: median(s), q3: median(s.slice(s.length % 2 ? h + 1 : h)) }; };
export const histogram = (xs: number[], width: number, start: number) => { const nb = Math.ceil((Math.max(...xs) - start + 1e-9) / width); const c = Array(nb).fill(0); xs.forEach((x) => c[Math.floor((x - start) / width)]++); return c as number[]; };

/** Lesson 5: paired data. */
export const PX = [1, 1.2, 1.5, 1.8, 2, 2.2, 2.5, 2.8, 3, 3.5];
export const PY = [40, 46, 52, 58, 63, 68, 75, 80, 88, 100];
export const correlation = (xs: number[], ys: number[]) => { const mx = mean(xs), my = mean(ys); let sxy = 0, sxx = 0, syy = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; syy += (ys[i] - my) ** 2; }); return sxy / Math.sqrt(sxx * syy); };
export const slope = (xs: number[], ys: number[]) => { const mx = mean(xs), my = mean(ys); let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; }); return sxy / sxx; };

/** Lesson 6: a skewed population (shifted exponential: mean 70, standard deviation 30). */
export const POP_MEAN = 70, POP_SD = 30;
export const standardError = (sd: number, n: number) => sd / Math.sqrt(n);
export const sampleMeans = (n: number, trials: number, seed = 5) => { const r = rng(seed); return Array.from({ length: trials }, () => { let s = 0; for (let i = 0; i < n; i++) s += 40 - POP_SD * Math.log(1 - r()); return s / n; }); };

/** Lesson 7: how sure are we of a test accuracy? */
export const accuracyInterval = (correct: number, n: number): [number, number] => { const p = correct / n, se = Math.sqrt((p * (1 - p)) / n); return [Math.max(0, p - 1.96 * se), Math.min(1, p + 1.96 * se)]; };
