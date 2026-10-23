import { beforeAll, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadPyodide } from "pyodide";
import { PythonEngine } from "./engine";
import { PY_DEEP } from "../../python/deep/py-deep";
import { MATH_DEEP } from "../../math/teaching/deep/math-deep";
import { ALGO_DEEP } from "../../algorithms/deep/algo-deep";
import { PLAYBOOKS } from "../../algorithms/deep/playbooks";
import { CHOOSE_GUIDE } from "../../algorithms/deep/choose-guide";
import type { DeepLesson } from "../../math/teaching/deep-read";

// Every code block shown in a reading must print exactly what the reading says, when run in the
// SAME Python and package versions the learner's browser uses (self-hosted Pyodide wheels).
const root = fileURLToPath(new URL("../../../../../", import.meta.url));
type Case = { id: string; code: string; output: string };
const cases: Case[] = [];
const registries: [string, Record<string, DeepLesson[]>][] = [["py", PY_DEEP], ["math", MATH_DEEP], ["algo", ALGO_DEEP], ["playbook", Object.fromEntries(Object.entries(PLAYBOOKS).map(([k, v]) => [k, [v]])) as Record<string, DeepLesson[]>], ["choose", { guide: [CHOOSE_GUIDE] }]];
for (const [name, reg] of registries)
  for (const [mod, lessons] of Object.entries(reg))
    lessons.forEach((l, li) => l.sections.forEach((s) => s.blocks.forEach((b, bi) => {
      if (b.kind === "code" && b.output) cases.push({ id: `${name}/${mod}/${li + 1}/${s.id}#${bi}`, code: b.code, output: b.output });
    })));

let py: Awaited<ReturnType<typeof loadPyodide>>;
let engine: PythonEngine;
beforeAll(async () => {
  execFileSync("node", ["scripts/sync-pyodide.mjs"], { cwd: root });
  py = await loadPyodide({ indexURL: root + "apps/web/public/pyodide/" });
  engine = new PythonEngine(py as unknown as ConstructorParameters<typeof PythonEngine>[0], readFileSync(new URL("./lesson_driver.py", import.meta.url), "utf8"));
}, 180_000);

const norm = (t: string) => t.split("\n").map((l) => l.trimEnd()).join("\n").trim();
describe("reading code blocks in the browser's Python", () => {
  it("covers a meaningful number of blocks", () => expect(cases.length).toBeGreaterThan(60));
  it("prints exactly the output each reading shows", async () => {
    const bad: string[] = [];
    for (const c of cases) {
      await py.loadPackagesFromImports(c.code);
      const out = engine.run({ code: c.code });
      if (out.error || norm(out.stdout) !== norm(c.output)) {
        const a = norm(c.output).split("\n"), b = norm(out.stdout).split("\n");
        const i = a.findIndex((l, k) => l !== b[k]);
        if (process.env.DUMP_FAILS) (globalThis as any).__d = [...((globalThis as any).__d ?? []), {id: c.id, code: c.code, shown: c.output, got: out.stdout, err: out.error}];
        bad.push(`${c.id}: ${out.error ?? `line ${i + 1} shows "${a[i]}" but Python prints "${b[i]}"`}`);
      }
    }
    if (process.env.DUMP_FAILS) (await import("node:fs")).writeFileSync(process.env.DUMP_FAILS, JSON.stringify((globalThis as any).__d ?? [], null, 1));
    expect(bad).toEqual([]);
  }, 900_000);
});
