import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadPyodide } from "pyodide";
import { PythonEngine } from "../../components/live-python/engine";
import { ALGO_EXTRAS } from "./registry";

// Every Algorithms lesson's code cell is run for real: the starter must run and fail with hints; the solution must pass.
let engine: PythonEngine;
beforeAll(async () => { engine = new PythonEngine((await loadPyodide()) as unknown as ConstructorParameters<typeof PythonEngine>[0], readFileSync(new URL("../../components/live-python/lesson_driver.py", import.meta.url), "utf8")); }, 120_000);

describe.each(Object.entries(ALGO_EXTRAS).filter(([, e]) => e.code))("%s code cell", (_key, extra) => {
  const cell = extra.code!.cell;
  it("starter runs and at least one check fails with a useful hint", () => {
    const out = engine.run({ code: cell.starter, expose: cell.expose, checks: cell.checks });
    expect(out.error).toBeNull();
    expect(out.checks!.length).toBeGreaterThanOrEqual(3);
    const failing = out.checks!.filter(c => !c.passed);
    expect(failing.length).toBeGreaterThan(0);
    for (const c of failing) expect(c.hint.length).toBeGreaterThan(15);
  });
  it("solution passes every check", () => {
    const out = engine.run({ code: cell.solution, expose: cell.expose, checks: cell.checks });
    expect(out.error).toBeNull();
    expect(out.checks!.map(c => c.passed), JSON.stringify(out.checks!.filter(c => !c.passed))).not.toContain(false);
  });
  it("every preset still runs on the solution", () => {
    for (const p of cell.presets ?? []) expect(engine.run({ code: p.apply(cell.solution), expose: cell.expose }).error, p.label).toBeNull();
  });
});
