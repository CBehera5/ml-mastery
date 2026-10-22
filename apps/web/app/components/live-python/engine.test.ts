import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadPyodide } from "pyodide";
import { regressionTrainingTrace } from "@mlmath/runtime";
import { PythonEngine } from "./engine";
import { GRADIENT_CHECKS, GRADIENT_PRESETS, GRADIENT_SOLUTION, GRADIENT_STARTER } from "../../algorithms/linear-regression/lessons/gradient-python-content";
import { HOUSE_DATA } from "../../algorithms/linear-regression/lab-data";

// These tests run REAL Python (Pyodide) so the lesson's code and hidden checks are verified,
// not mocked. Loading takes a few seconds the first time.
let engine: PythonEngine;
beforeAll(async () => { engine = new PythonEngine((await loadPyodide()) as unknown as ConstructorParameters<typeof PythonEngine>[0], readFileSync(new URL("./lesson_driver.py", import.meta.url), "utf8")); }, 120_000);

describe("PythonEngine", () => {
  it("captures output and exposes JSON values", () => {
    const out = engine.run({ code: "total = sum(range(5))\nprint('hi', total)\nitems=[1,2.5]", expose: ["total", "items", "missing"] });
    expect(out.error).toBeNull();
    expect(out.stdout).toBe("hi 10\n");
    expect(out.values).toEqual({ total: 10, items: [1, 2.5] });
  });
  it("reports errors in plain language with the learner's line number", () => {
    const out = engine.run({ code: "x = 1\ny = x + undefined_name\n" });
    expect(out.error).toBe("NameError: name 'undefined_name' is not defined (line 2)");
    expect(engine.run({ code: "def broken(:\n  pass" }).error).toMatch(/^SyntaxError: .* \(line 1\)$/);
    expect(engine.run({ code: "print(1/0)" }).error).toBe("ZeroDivisionError: division by zero (line 1)");
  });
  it("keeps stdout from before an error and gives every run a fresh namespace", () => {
    expect(engine.run({ code: "leak = 1\nprint('before')\nraise ValueError('boom')" })).toMatchObject({ stdout: "before\n", error: "ValueError: boom (line 3)" });
    expect(engine.run({ code: "print('leak' in globals())" }).stdout).toBe("False\n");
  });
  it("truncates runaway output", () => {
    const out = engine.run({ code: "print('x' * 50000)" });
    expect(out.stdout.length).toBeLessThan(20_100);
    expect(out.stdout).toContain("output truncated");
  });
});

describe("gradient-descent lesson code (real Python)", () => {
  const run = (code: string) => engine.run({ code, expose: ["history", "w", "b"], checks: GRADIENT_CHECKS });

  it("the starter runs cleanly but is not yet correct, and the hints say why", () => {
    const out = run(GRADIENT_STARTER);
    expect(out.error).toBeNull();
    expect(out.checks!.map((c) => c.passed)).toEqual([false, false, false]);
    expect(out.checks![0].hint).toContain("2 / m * r * xi");
    expect(out.checks![1].hint).toContain("there is no xi");
    // With the TODOs unfinished the line never moves, so loss is flat.
    expect(new Set(out.values.history as number[]).size).toBe(1);
  });

  it("the worked solution passes every check and matches the verified TypeScript runtime", () => {
    const out = run(GRADIENT_SOLUTION);
    expect(out.error).toBeNull();
    expect(out.checks!.every((c) => c.passed)).toBe(true);
    const trace = regressionTrainingTrace({ features: HOUSE_DATA.features.map((r) => [...r]), targets: [...HOUSE_DATA.targets], weights: [10], bias: 100 }, 0.01, 20);
    const last = trace.entries.at(-1)!;
    expect(out.values.w as number).toBeCloseTo(last.weights[0], 9);
    expect(out.values.b as number).toBeCloseTo(last.bias, 9);
    const history = out.values.history as number[];
    expect(history).toHaveLength(21);
    trace.entries.forEach((entry, i) => expect(history[i]).toBeCloseTo(entry.loss as number, 6));
    expect(out.stdout).toContain("after 20 steps:  w = 50.70   b = 113.26   loss = 61.6");
  });

  it("gives the specific hint when only part of the update is written", () => {
    const partial = GRADIENT_SOLUTION.replace("    b = b - lr * db                   # b ← b − α · ∂L/∂b\n", "");
    const out = run(partial);
    expect(out.checks!.map((c) => c.passed)).toEqual([true, true, false]);
    expect(out.checks![2].hint).toContain("for both w and b");
  });

  it("checks follow the learner's own settings, so experimenting never breaks them", () => {
    for (const preset of GRADIENT_PRESETS) {
      const out = run(preset.apply(GRADIENT_SOLUTION));
      expect(out.error).toBeNull();
      expect(out.checks!.every((c) => c.passed), preset.label).toBe(true);
    }
    const history = (code: string) => run(code).values.history as number[];
    const tiny = history(GRADIENT_PRESETS[0].apply(GRADIENT_SOLUTION)), steady = history(GRADIENT_PRESETS[1].apply(GRADIENT_SOLUTION));
    const bold = history(GRADIENT_PRESETS[2].apply(GRADIENT_SOLUTION)), big = history(GRADIENT_PRESETS[3].apply(GRADIENT_SOLUTION));
    expect(tiny.at(-1)!).toBeGreaterThan(8000);                       // crawls: barely below the starting 20,164
    expect(steady.every((v, i) => i === 0 || v < steady[i - 1])).toBe(true); // smooth descent
    expect(bold[1]).toBeLessThan(bold[0] / 50);                         // one huge first step…
    expect(bold.at(-1)!).toBeLessThan(steady.at(-1)!);                   // …and ends lower than the default
    expect(big.at(-1)!).toBeGreaterThan(big[0] * 100);                  // too big: the loss explodes
  });
});
