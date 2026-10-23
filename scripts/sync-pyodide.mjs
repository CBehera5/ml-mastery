// Copies the Pyodide core runtime from node_modules into apps/web/public/pyodide
// so lessons can run Python in the browser without any third-party CDN.
// The copy is generated, not committed (see .gitignore).
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules", "pyodide");
const target = join(root, "apps", "web", "public", "pyodide");
const lessonDir = join(root, "apps", "web", "app", "components", "live-python");
const packageDir = join(root, "vendor", "pyodide-packages");
const lessonFiles = ["lesson-worker.mjs", "lesson_driver.py"];
const files = ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"];

if (!existsSync(source)) {
  console.error("sync-pyodide: node_modules/pyodide not found. Run `npm install` first.");
  process.exit(1);
}
mkdirSync(target, { recursive: true });
for (const file of files) cpSync(join(source, file), join(target, file));
for (const file of lessonFiles) cpSync(join(lessonDir, file), join(target, file));
// Scientific packages (NumPy, pandas, scikit-learn and their dependencies) ship as wheels
// committed in vendor/pyodide-packages, so live cells can import them without any CDN.
const wheels = readdirSync(packageDir).filter((f) => f.endsWith(".whl"));
for (const file of wheels) cpSync(join(packageDir, file), join(target, file));
const version = JSON.parse(readFileSync(join(source, "package.json"), "utf8")).version;
console.log(`sync-pyodide: copied Pyodide ${version} (${files.length + lessonFiles.length} files + ${wheels.length} package wheels) to apps/web/public/pyodide`);
