import { beforeAll, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadPyodide } from "pyodide";
import { PythonEngine } from "./engine";

// Proves the self-hosted scientific packages load from the app's own files (no CDN) and work.
const root = fileURLToPath(new URL("../../../../../", import.meta.url));
let py: Awaited<ReturnType<typeof loadPyodide>>;
let engine: PythonEngine;
beforeAll(async () => {
  execFileSync("node", ["scripts/sync-pyodide.mjs"], { cwd: root });
  py = await loadPyodide({ indexURL: root + "apps/web/public/pyodide/" });
  engine = new PythonEngine(py as unknown as ConstructorParameters<typeof PythonEngine>[0], readFileSync(new URL("./lesson_driver.py", import.meta.url), "utf8"));
}, 180_000);

describe("bundled scientific packages", () => {
  it("runs NumPy, pandas and scikit-learn from imports alone", async () => {
    const code = [
      "import numpy as np, pandas as pd",
      "from sklearn.linear_model import LinearRegression",
      "X = np.array([[40.0], [80.0], [120.0]])",
      "y = np.array([30.0, 55.0, 90.0])",
      "m = LinearRegression().fit(X, y)",
      "df = pd.DataFrame({'area': [40, 80], 'city': ['Pune', 'Mumbai']})",
      "print(round(float(m.predict([[100.0]])[0]), 2), list(df.columns))",
    ].join("\n");
    await py.loadPackagesFromImports(code);
    const out = engine.run({ code });
    expect(out.error).toBeNull();
    expect(out.stdout).toBe("73.33 ['area', 'city']\n");
  }, 180_000);
});
