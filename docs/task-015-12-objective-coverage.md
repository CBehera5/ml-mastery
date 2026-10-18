# Task 015.12 Objective and Acceptance Coverage

**Status: implementation present; acceptance is blocked pending complete frontend, build, and browser verification.** Mastery remains unavailable.

| Lesson | Objective families | Teaching / worked example | Authored practice and independent instances | Critical gate | Feedback / remediation |
|---|---|---|---|---|---|
| MS01 — Fair comparison | MS01.O1–O4 | Same rows, target, split, metric, information budget, baseline-relative score, provenance | Two practice variants and Forms A/B/C for each family | O2: reject unequal evidence/budgets and explain invalid ranking | Align immutable rows, target, split, scorer, and search allowance |
| MS02 — Search consumes information | MS02.O1–O4 | Finite-grid fit count, selection optimism, scorer/refit, grid vs seeded random search | Two practice variants and Forms A/B/C for each family | O2: reject final-test model selection and explain selection optimism | Select inside development; freeze before one final test evaluation |
| MS03 — Nested and structured validation | MS03.O1–O4 | Inner/outer roles, fold-local preprocessing, grouped/time boundaries, nested estimate | Two practice variants and Forms A/B/C for each family | O2: reject outer/inner, group, or time leakage and explain boundary | Identify holdout unit and exact rows allowed to fit each step |
| MS04 — Imbalance, thresholds and cost | MS04.O1–O4 | Fixed weights/thresholds, false-negative/false-positive cost, prevalence | Two practice variants and Forms A/B/C for each family | O2: reject target-informed held-out fitting/selection and explain leakage | Reconstruct confusion counts and keep choices within development folds |
| MS05 — Interpret responsibly | MS05.O1–O4 | Permutation score change, causal limits, correlated proxies/subgroups, explanation levels | Two practice variants and Forms A/B/C for each family | O2: reject causal claims from predictive importance/coefficients | State model/data dependence and what intervention evidence is missing |
| MS06 — Reproducible final decision | MS06.O1–O4 | Adequacy under constraints, frozen test, model card, capstone limits | Two practice variants and Forms A/B/C for each family | O2: protect one final test and report poor performance honestly | Freeze the workflow; disclose the result; require new study for retuning |

Each of 24 families has two practice instances and three independent instances (120 authored scored instances total). Each O2 family has two required atoms. The objective contract awards at most one family point and requires both atoms for a critical O2 family. The mastery threshold is 20/24 plus all six paired gates in one explicitly confirmed attempt; evidence is not combined across attempts. Three forms are authored, but no independent assessment/mastery UI is enabled while acceptance is pending. Current policy constant is `MASTERY_AVAILABLE = false`.

## Experiments and notebook

- **MS-E1:** 20 finite states (17 comparison/reference states and three typed rejections), covering same-row/fold/metric candidate comparisons, fit budgets, provenance, and selection boundaries.
- **MS-E2:** 11 finite states (seven reference states and four typed rejections), covering development selection, thresholds/cost, interpretation, and final-test boundary. Frozen sidecar test references are not served by the API; only reviewed public configuration/data are returned.
- **Notebook:** `apps/web/public/notebooks/supervised-model-selection.ipynb`; deterministic synthetic split, pipeline/CV, candidate comparison, development choice, and final evaluation. It is trusted author code, not learner-submitted code.

## Verification ledger

| Gate | Result | Evidence / limitation |
|---|---|---|
| Catalog + frozen API contracts | Prior focused run PASS, 8/8; final-source rerun BLOCKED | `catalog.test.ts` and experiment route test; after final dynamic-route correction, Vitest stalled before discovery/result. Endpoint assertion excludes sealed test target keys |
| Full frontend/TypeScript regressions | BLOCKED | Full run stalled before complete discovery; UI component test worker startup timed out. No full-suite summary/exit success |
| Python regressions | PASS, 2,607 passed, 1 warning | Approved existing isolated Python 3.13.16 environment; no packages installed into app environment |
| Frozen references/hashes | PASS, 31 states | Existing generator `--check`; no frozen artifacts modified |
| Notebook, two fresh local kernels | PASS, identical outputs | Prior inline runs matched SHA-256 `134e21b507492443d6e5a4c577e6ef4ae9deff697d1d11adb12134490b195e63`; standalone repeat is pending CI |
| Typecheck | BLOCKED | Current-source `tsc`/`npm run typecheck` stalled without diagnostic output; process stopped after bounded wait |
| Production build | BLOCKED | Build math phase completed; Next production build stalled without completion summary; process stopped |
| Fresh browser / persistence / keyboard / 320px | NOT RUN | Local preview startup stalled; production browser smoke prepared for independent CI |
| Mastery threshold/gate contract | PARTIAL | Pure catalog tests cover 19/20 and six paired gates; UI/activation acceptance suite incomplete. Mastery remains disabled |
| Screen reader / browser zoom / Colab / original I/O | OPEN | Not genuinely verified |

No browser screenshots, independent CI result, or full frontend pass is claimed in this report. See `TASK_015_12_COMPLETION.md` for the recovery record and recommended next action.
