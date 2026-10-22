/** Pure maths behind the Linear Algebra playgrounds. Lesson text, charts and Python cells agree with these. */
export type V2 = [number, number];
export type M2 = [[number, number], [number, number]];
export const add = (u: V2, v: V2): V2 => [u[0] + v[0], u[1] + v[1]];
export const scale = (c: number, u: V2): V2 => [c * u[0], c * u[1]];
export const dot = (u: V2, v: V2) => u[0] * v[0] + u[1] * v[1];
export const norm = (u: V2) => Math.hypot(u[0], u[1]);
export const angleDeg = (u: V2, v: V2) => (norm(u) === 0 || norm(v) === 0 ? NaN : (Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (norm(u) * norm(v))))) * 180) / Math.PI);
export const project = (u: V2, onto: V2): V2 => (dot(onto, onto) === 0 ? [0, 0] : scale(dot(u, onto) / dot(onto, onto), onto));

/** A small house table: area (hundreds of sq ft), bedrooms. Weights: ₹ lakh per hundred sq ft, per bedroom. */
export const HOUSES: number[][] = [[1, 2], [1.5, 3], [2, 3]];
export const matVec = (X: number[][], w: number[]) => X.map((row) => row.reduce((s, x, j) => s + x * w[j], 0));

export const A_MAT = [[1, 2, 3], [4, 5, 6]];
export const B_FULL = [[1, 0], [0, 1], [1, 1]];
export const matMul = (A: number[][], B: number[][]) => A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
export const cellTerms = (A: number[][], B: number[][], i: number, j: number) => A[i].map((a, k) => [a, B[k][j]] as [number, number]);

export const apply = (M: M2, v: V2): V2 => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
export const det = (M: M2) => M[0][0] * M[1][1] - M[0][1] * M[1][0];
export const inverse = (M: M2): M2 | null => { const d = det(M); return d === 0 ? null : [[M[1][1] / d, -M[0][1] / d], [-M[1][0] / d, M[0][0] / d]]; };
export const mul2 = (A: M2, B: M2): M2 => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
export const combo = (a: number, b: number, v1: V2, v2: V2): V2 => add(scale(a, v1), scale(b, v2));
/** Coefficients (a, b) with a·v1 + b·v2 = t, or null when v1, v2 do not span the plane. */
export const solveCombo = (v1: V2, v2: V2, t: V2): V2 | null => { const d = v1[0] * v2[1] - v1[1] * v2[0]; return d === 0 ? null : [(t[0] * v2[1] - t[1] * v2[0]) / d, (v1[0] * t[1] - v1[1] * t[0]) / d]; };
export const eigenvalues = (M: M2): [number, number] | null => { const tr = M[0][0] + M[1][1], d = det(M), disc = (tr * tr) / 4 - d; if (disc < -1e-12) return null; const s = Math.sqrt(Math.max(0, disc)); return [tr / 2 + s, tr / 2 - s]; };
export const cross = (u: V2, v: V2) => u[0] * v[1] - u[1] * v[0];
