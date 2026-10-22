# Live-Python lesson pattern (authoring guide)

Every lesson that teaches an algorithm follows the same arc: **story → predict → see → code → explain**.
The pattern is two config objects rendered by two components in
`apps/web/app/learn/linear-regression/lessons/code-lab-section.tsx`. Content lives in config, not markup.

## 1. `PredictConfig` → `<PredictStory/>` (before the lab)
`id`, `title`, `story` (the problem in human terms), `predictTitle`, `question`, `options[]`, `correctId`, `explanation`.
Unscored: it never touches evidence or mastery. Never put it before a lesson's own discovery step.

## 2. `CodeLabConfig` → `<CodeLabSection/>` (after the lab)
`id`, `title`, `intro`, `bridge[]` (maths ↔ Python ↔ plain words), `cell` (`starter`, `solution`, `checks`, `expose`, `presets`, `renderResult`), `reflections[]` (question + answer), `footer`.

## 3. Writing the cell (`*-content.ts`)
- **Starter** runs cleanly with TODOs left empty, so the learner sees a working-but-wrong program first.
- **Solution** is built from the starter with `swap()`, which throws if a TODO line changes, so the two cannot drift.
- **Checks** recompute the answer from the learner's own variables, set `results = [{name, passed, hint}]`, and every failing check must carry a specific hint.
- **Presets** are one-line regex edits of a setting; each must still run on the solution.
- **Charts**: `FitPlot`, `SignedBars` and `LossCurve` (`components/live-python/`) each carry a text equivalent.

## 4. Tests required for every lab (`components/live-python/*.test.ts`, real Pyodide)
Starter runs without error and fails checks with hints; solution passes all; every preset keeps the program valid;
**every number quoted in the lesson text is asserted**, preferably against the TypeScript maths runtime.

## 5. Wiring
Pass `before` / `after` to `InstructionalLesson` (see `labs/lab-router.tsx`). For standalone labs, wrap in a fragment.
