import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadPyodide } from "pyodide";
import { regressionEvaluationTrace } from "@mlmath/runtime";
import { PythonEngine } from "./engine";
import * as C from "../../learn/linear-regression/lessons/more-python-content";
import { HOUSE_DATA, MULTI_FEATURE_DATA, MULTI_PARAMETERS, MULTI_TARGETS, HOUSE_PARAMETERS } from "../../learn/linear-regression/lab-data";

let engine: PythonEngine;
beforeAll(async () => { engine = new PythonEngine((await loadPyodide()) as unknown as ConstructorParameters<typeof PythonEngine>[0], readFileSync(new URL("./lesson_driver.py", import.meta.url), "utf8")); }, 120_000);

const labs = [
  { name: "equation", starter: C.EQUATION_STARTER, solution: C.EQUATION_SOLUTION, checks: C.EQUATION_CHECKS, expose: ["estimate", "residual", "estimates"], n: 3 },
  { name: "errors", starter: C.ERRORS_STARTER, solution: C.ERRORS_SOLUTION, checks: C.ERRORS_CHECKS, expose: ["residuals", "mae", "mse", "rmse"], n: 4 },
  { name: "multiple features", starter: C.MULTI_STARTER, solution: C.MULTI_SOLUTION, checks: C.MULTI_CHECKS, expose: ["contributions", "estimate", "all_estimates"], n: 4 },
  { name: "failure modes", starter: C.FAILURE_STARTER, solution: C.FAILURE_SOLUTION, checks: C.FAILURE_CHECKS, expose: ["w", "b", "clean_w", "clean_b"], n: 3 },
];

describe.each(labs)("$name lab (real Python)", (lab) => {
  it("starter runs without error but fails its checks, each with a hint", () => {
    const out = engine.run({ code: lab.starter, expose: lab.expose, checks: lab.checks });
    expect(out.error).toBeNull();
    expect(out.checks).toHaveLength(lab.n);
    expect(out.checks!.some((c) => !c.passed)).toBe(true);
    for (const c of out.checks!.filter((c) => !c.passed)) expect(c.hint.length).toBeGreaterThan(10);
  });
  it("solution passes every check", () => {
    const out = engine.run({ code: lab.solution, expose: lab.expose, checks: lab.checks });
    expect(out.error).toBeNull();
    expect(out.checks!.map((c) => c.passed)).toEqual(Array(lab.n).fill(true));
  });
  it("presets keep the program valid", () => {
    // every preset applied to the solution must still run
    const presets = { equation: C.EQUATION_PRESETS, errors: C.ERRORS_PRESETS, "multiple features": C.MULTI_PRESETS, "failure modes": C.FAILURE_PRESETS }[lab.name]!;
    for (const p of presets) {
      const code = p.apply(lab.solution);
      expect(code).not.toBe(p.label); // sanity
      const out = engine.run({ code, expose: lab.expose, checks: lab.checks });
      expect(out.error, p.label).toBeNull();
      expect(out.checks!.every((c) => c.passed), p.label).toBe(true);
    }
  });
});

describe("every number quoted in the lesson text", () => {
  it("equation: 245, residual −1, and agreement with the 6 estimates", () => {
    const out = engine.run({ code: C.EQUATION_SOLUTION, expose: ["estimate", "residual", "estimates"] });
    expect(out.values.estimate).toBeCloseTo(245, 9);
    expect(out.values.residual).toBeCloseTo(-1, 9);
    expect((out.values.estimates as number[]).map((v) => +v.toFixed(1))).toEqual([182, 215.6, 245, 274.4, 308, 341.6]);
  });
  it("errors: residuals, MAE/MSE/RMSE match the verified runtime", () => {
    const out = engine.run({ code: C.ERRORS_SOLUTION, expose: ["residuals", "mae", "mse", "rmse"] });
    expect((out.values.residuals as number[]).map((v) => +v.toFixed(1))).toEqual([4, 2.6, -1, -3.6, -8, -7.4]);
    const trace = regressionEvaluationTrace({ features: HOUSE_DATA.features.map((r) => [...r]), targets: [...HOUSE_DATA.targets], weights: HOUSE_PARAMETERS.weights, bias: HOUSE_PARAMETERS.bias });
    const m = (trace as unknown as { metrics: { mae: number; mse: number; rmse: number } }).metrics;
    expect(out.values.mae as number).toBeCloseTo(m.mae, 9);
    expect(out.values.mse as number).toBeCloseTo(m.mse, 9);
    expect(out.values.rmse as number).toBeCloseTo(m.rmse, 9);
    expect(m.mae).toBeCloseTo(4.4333, 4); expect(m.mse).toBeCloseTo(25.9133, 4); expect(m.rmse).toBeCloseTo(5.0905, 4);
    expect((out.values.residuals as number[]).reduce((a, b) => a + b, 0) / 6).toBeCloseTo(-2.2333, 4);
  });
  it("multiple features: contributions 196.8/54/−16.8/75, 309, and the four lab estimates", () => {
    const out = engine.run({ code: C.MULTI_SOLUTION, expose: ["contributions", "estimate", "all_estimates"] });
    expect((out.values.contributions as number[]).map((v) => +v.toFixed(1))).toEqual([196.8, 54, -16.8, 75]);
    expect(out.values.estimate).toBeCloseTo(309, 9);
    const want = MULTI_FEATURE_DATA.map((r) => MULTI_PARAMETERS.bias + r.reduce((s, x, j) => s + MULTI_PARAMETERS.weights[j] * x, 0));
    expect((out.values.all_estimates as number[]).map((v) => +v.toFixed(1))).toEqual(want.map((v) => +v.toFixed(1)));
    expect(want.map((v) => +v.toFixed(1))).toEqual([160.4, 248.6, 309, 394.2]);
    expect(MULTI_TARGETS).toHaveLength(4);
  });
  it("failure modes: clean 45.46/132.25 and typo 16.42", () => {
    const clean = engine.run({ code: C.FAILURE_SOLUTION, expose: ["w", "b"] });
    expect(clean.values.w as number).toBeCloseTo(45.461, 3);
    expect(clean.values.b as number).toBeCloseTo(132.254, 3);
    const typo = engine.run({ code: C.FAILURE_PRESETS[0].apply(C.FAILURE_SOLUTION), expose: ["w", "b", "clean_w"] });
    expect(typo.values.w as number).toBeCloseTo(16.419, 3);
    expect(typo.values.clean_w as number).toBeCloseTo(45.461, 3);
  });
  it("starter data matches the platform's HOUSE_DATA", () => {
    const out = engine.run({ code: C.ERRORS_STARTER, expose: ["areas", "prices"] });
    expect(out.values.areas).toEqual(HOUSE_DATA.features.map((r) => r[0]));
    expect(out.values.prices).toEqual([...HOUSE_DATA.targets]);
  });
});
