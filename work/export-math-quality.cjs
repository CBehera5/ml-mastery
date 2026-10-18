const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) {
  return originalResolve.call(this, request === "@mlmath/runtime" ? path.resolve("packages/math-runtime/src/index.ts") : request, parent, ...rest);
};
require.extensions[".ts"] = function(module, filename) {
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}});
  module._compile(result.outputText, filename);
};
const {qualitySnapshot} = require(path.resolve("apps/web/app/math/integration/audit.ts"));
process.stdout.write(JSON.stringify(qualitySnapshot(), null, 2));
