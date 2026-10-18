# Linear Regression reference educational standard

## Purpose

Linear Regression is the reference implementation for future supervised-learning modules. The standard defines evidence and sequencing, not a mandatory page template. A lesson may use a graph, table, debugger, notebook, narrative, or project decision when that representation best serves the objective.

## Reference sequence

1. **Problem and motivation** — begin with a decision a learner recognizes; identify why a model might help and what it cannot decide.
2. **Intuition** — let the learner predict behavior in ordinary language before notation or output is revealed.
3. **Mathematical explanation** — introduce only the notation needed to explain the observed behavior; values come from verified traces.
4. **Interactive experiment** — expose a consequential control and keep every visual, metric, and explanation synchronized.
5. **Guided exercise** — require calculation, interpretation, or diagnosis with immediate, specific feedback and deterministic retry.
6. **Real-world application** — ask for a defensible modeling decision, not formula recall.
7. **Misconception or failure-mode check** — surface the likely wrong mental model and explain why it fails.
8. **Completion evidence** — record lesson-specific objective evidence only after meaningful actions; navigation never completes a lesson.
9. **Independent mastery linkage** — name the objective and how it will be tested later on an unfamiliar variant. Completion never awards mastery.

## Contract use

- Curriculum IDs, status, availability, time, objectives, activities, and prerequisites use the Task 010.2 curriculum contract.
- Conceptual, numerical, parameter-prediction, and constrained-code checks use deterministic exercise definitions.
- Browser-local evidence uses `ml-math-lab:evidence:linear-regression:v1` during development/private beta.
- Lesson evidence may move forward through visited, started, completed, and assessed. Mastery is a separate objective-level record.
- Existing mathematical values must come from `regression-trace.v1` or another explicitly versioned runtime contract.
- React may own learner choices, formatting, graph geometry, and evidence state; it must not recreate regression formulas.

## Completion quality bar

A lesson is complete only when its required objectives have specific evidence IDs and all required interaction conditions are met. Reading, opening, scrolling, or clicking Next is insufficient. A reset may clear the current activity without silently deleting other lesson or mastery evidence. A completed lesson remains revisitable.

## Feedback and retries

Feedback explains the causal reason, not merely “correct” or “incorrect.” First attempts should cue the relevant relationship. A later attempt may show a worked explanation. Variants are deterministic and versioned. Open reasoning uses an explicit self-check rubric unless the response is bounded enough to score honestly.

## Accessibility and responsive standard

- Native labels and fieldsets group controls; feedback uses appropriate live status only when it changes.
- Every interactive SVG target is keyboard operable and has a meaningful accessible name.
- Chart summaries state the important relationship in text; essential meaning is not color-only.
- Focus remains visible, touch targets remain usable, and layouts collapse without changing the learning sequence.
- Motion is explanatory, subtle, and disabled or reduced under the user preference.

## Mathematical and product honesty

- Examples identify synthetic or fictional values.
- A fitted line is described as an estimate, not truth or causality.
- Predetermined traces are not described as live Python training.
- A model is not called appropriate without considering target type, trend, data quality, omitted features, extrapolation, and evaluation evidence.
- “Completed” and “mastered” are used only when their evidence contracts are satisfied.

## Conceptual depth and recall

- Introduce purpose and intuition before formulas.
- Define technical terms on first use and explain every displayed symbol or variable.
- Reconnect prior concepts with brief reminders and prerequisite links; never assume recall from an earlier route.
- Keep terminology stable across mathematical explanation, Python code, algorithm labs, and future projects.
- Use the shared concept registry for established high-frequency terms when it fits, while preserving lesson-specific explanations and avoiding a premature universal content system.
- Record broader terminology and continuity gaps in the Task 017 backlog rather than expanding the current task into a curriculum-wide rewrite.

## Task 011.1 reference lesson

`/learn/linear-regression/why` implements the standard without assuming derivatives. It uses a fictional housing estimate, runtime-computed predictions, feature exploration, a regression-versus-classification misconception check, and an appropriateness decision. Completion requires a correct prediction followed by reveal, an actual feature edit, and both decision checks. It records three completed objectives and no mastery evidence.

## Task 011.5 independent assessment standard

The final route is independently attemptable. The mastery blueprint pins 24 item objectives across six competencies and 12 deterministic variants. Active attempts and review expose choices and entered responses without correctness feedback or worked answers. A distinct review step and explicit submission confirmation precede grading; there is no timer or punitive marking.

Use the existing deterministic exercise evaluator and numerical runtimes; learner code is constrained or traced, never executed arbitrarily. At least 80% overall plus every critical objective must pass in one attempt. Failed attempts award no new mastery. Successful attempts award separate objective-level mastery only for demonstrated objectives; missed noncritical objectives retain remediation needs. Lesson/project completion and assessed state are not mastery.

After submission report competency performance, critical outcomes, causal explanations and targeted lesson links. Retakes change data, signs and scenarios rather than only rearranging options. Preserve earlier progress and valid mastery; bound this assessment's own history without deleting unrelated records. Restore partial drafts safely and do not preserve submission consent. Match submitted displays to canonical evidence and never award mastery during hydration.

Browser checks and component accessibility checks must be reported separately. Real-browser review, confirmation, failure, success, retry and reload were exercised in Task 011.5; screen-reader speech, zoom, smaller viewports and complete module acceptance remain separate release gates. No complete-module verification claim follows from automated or assessment-only acceptance.

## Task 011.6 acceptance — 15 October 2026

The fresh isolated production-browser journey completed all nine routes, every guided lesson/project stage, critical-failure assessment (23/24, 95.8%), targeted remediation and a successful changed-variant retry (24/24, all 10 critical). Drafts/results survived reload; all eight earlier completion summaries remained intact. Sequential Tab walks reached every footer without a trap. All nine layouts and the active assessment form fit a measured 320 CSS px viewport.

Targeted fixes constrain Errors/Implementation reflow, add a lesson skip link and named keyboard table scrollers, strengthen scoped contrast/focus, and qualify the decreasing-loss explanation. Mathematical runtimes, versioned contracts, IDs and notebook bytes remain unchanged (21 protected checksums). Full verification: 184 frontend/TypeScript-runtime tests in 31 files, 62 Python tests, typecheck and 22-page production build pass. Both notebooks executed all code cells in fresh processes (7 implementation, 8 project); no Jupyter/Colab UI execution is claimed.

Complete-module acceptance remains **NOT VERIFIED**. Real screen-reader speech, genuine 200%/400% zoom, text spacing/full contrast and target-size exception review, motion preference and full supported-device/download coverage remain open. Gradient's optional convex/Euclidean terminology and Failure Modes' regularization mention are explicit editorial FAIL findings assigned to Task 017. No comprehensive curriculum rewrite was performed.

The authoritative requirement matrix and ownership are in `LINEAR_REGRESSION_ACCEPTANCE_MATRIX.md`; release gates are in `RELEASE_ACCESSIBILITY_QA_BLOCKERS.md`. Earlier historical browser restrictions no longer block the exercised functional journey, but they are not replaced by an all-accessibility PASS. Overall curriculum status remains implemented; no verified-reference claim, Task 012 implementation or deployment is authorized. Independent Task 012 Algebra/Functions work can be considered only with founder approval and its own accessibility gates.
