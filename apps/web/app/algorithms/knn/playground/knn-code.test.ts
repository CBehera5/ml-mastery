import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadPyodide } from "pyodide";
import { PythonEngine } from "../../../components/live-python/engine";
import { SCALE_CODE, VOTE_CODE } from "./knn-code";

describe.each([["vote", VOTE_CODE], ["scale", SCALE_CODE]] as const)("%s code cell runs for real", (_name, config) => {
  let engine: PythonEngine;
  beforeAll(async () => { engine = new PythonEngine((await loadPyodide()) as unknown as ConstructorParameters<typeof PythonEngine>[0], readFileSync(new URL("../../../components/live-python/lesson_driver.py", import.meta.url), "utf8")); }, 120_000);
  const cell = config.cell;
  it("starter runs and fails with hints", () => {
    const out = engine.run({ code: cell.starter, expose: cell.expose, checks: cell.checks });
    expect(out.error).toBeNull();
    const failing = out.checks!.filter(c => !c.passed); expect(failing.length).toBeGreaterThan(0);
    for (const c of failing) expect(c.hint.length).toBeGreaterThan(15);
  });
  it("solution passes every check and each preset runs", () => {
    const out = engine.run({ code: cell.solution, expose: cell.expose, checks: cell.checks });
    expect(out.error).toBeNull(); expect(out.checks!.map(c => c.passed), JSON.stringify(out.checks!.filter(c => !c.passed))).not.toContain(false);
    for (const p of cell.presets ?? []) expect(engine.run({ code: p.apply(cell.solution), expose: cell.expose }).error, p.label).toBeNull();
  });
});
