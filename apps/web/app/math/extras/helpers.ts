import type { CellPreset } from "../../components/live-python/live-python-cell";
/** Builds a solution from a starter; throws if a TODO line was edited, so starter and solution cannot drift. */
export const swap = (starter: string, edits: [string, string][]) => edits.reduce((code, [from, to]) => { if (!code.includes(from)) throw new Error(`missing: ${from}`); return code.replace(from, to); }, starter);
export const preset = (label: string, description: string, from: RegExp, to: string): CellPreset => ({ label, description, apply: (code) => code.replace(from, to) });
export const CHECK_PRELUDE = `def _close(a, b, tol=1e-9): return abs(a - b) <= tol * max(1.0, abs(b))\nresults = []\n`;
