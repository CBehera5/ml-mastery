import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadPyodide } from "pyodide";
import { regressionTrainingTrace } from "@mlmath/runtime";
import { PythonEngine } from "./engine";
import { OBJECTIVE_CHECKS, OBJECTIVE_PRESETS, OBJECTIVE_SOLUTION, OBJECTIVE_STARTER } from "../../math/optimization/objectives-python";
import { HOUSE_DATA } from "../../algorithms/linear-regression/lab-data";

let engine: PythonEngine;
beforeAll(async () => { engine = new PythonEngine((await loadPyodide()) as unknown as ConstructorParameters<typeof PythonEngine>[0], readFileSync(new URL("./lesson_driver.py", import.meta.url), "utf8")); }, 120_000);
const run = (code: string) => engine.run({ code, expose: ["w", "b", "dw", "db"], checks: OBJECTIVE_CHECKS });

describe("Optimization lesson 1 code cell (real Python)", () => {
  it("starter runs, fails every value check with a hint", () => {
    const out = run(OBJECTIVE_STARTER);
    expect(out.error).toBeNull();
    expect(out.checks!.length).toBe(5);
    expect(out.checks!.filter((c) => !c.passed).length).toBeGreaterThanOrEqual(4);
    for (const c of out.checks!.filter((c) => !c.passed)) expect(c.hint.length).toBeGreaterThan(20);
  });
  it("solution passes every check and prints the quoted numbers", () => {
    const out = run(OBJECTIVE_SOLUTION);
    expect(out.error).toBeNull();
    expect(out.checks!.every((c) => c.passed)).toBe(true);
    expect(out.stdout).toContain("loss = 20163.8");
    expect(out.stdout).toContain("in w = -892.5, in b = -269.0");
    expect(out.values.dw).toBeCloseTo(-892.5, 9);
    expect(out.values.db).toBeCloseTo(-269, 9);
  });
  it("matches the verified runtime's iteration-0 gradient", () => {
    const t = regressionTrainingTrace({ features: HOUSE_DATA.features.map((r) => [...r]), targets: [...HOUSE_DATA.targets], weights: [10], bias: 100 }, 0.01, 1);
    expect(t.entries[0].loss).toBeCloseTo(20163.8333333, 5);
  });
  it("presets keep the program valid and change the printed loss", () => {
    const losses = OBJECTIVE_PRESETS.map((p) => { const out = run(p.apply(OBJECTIVE_SOLUTION)); expect(out.error, p.label).toBeNull(); expect(out.checks!.every((c) => c.passed), p.label).toBe(true); return out.stdout.match(/loss = ([\d.]+)/)![1]; });
    expect(losses[0]).toBe("114.3");
    expect(new Set(losses).size).toBe(3);
  });
});
