import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // jsdom + React Testing Library has a large cold-start footprint. Running
    // one fork at a time avoids worker boot starvation on beta-test laptops.
    pool: "forks",
    maxWorkers: 1,
  },
  resolve: {
    alias: {
      "@mlmath/runtime": fileURLToPath(new URL("./packages/math-runtime/src/index.ts", import.meta.url)),
    },
  },
});
