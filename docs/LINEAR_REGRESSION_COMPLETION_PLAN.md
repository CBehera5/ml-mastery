# Linear Regression educational completion plan

## Current finding

The module now has all nine substantive routes: seven educationally verified lessons, the applied project bridge, and the independent mastery assessment. Project, assessment and module statuses remain implemented pending complete browser/accessibility acceptance. Task 011.3 completed the four instructional wrappers using existing labs and unchanged mathematical runtimes. For the earlier lessons, verification refers to automated content, evaluator, evidence and build checks. Task 011.5 additionally exercised the assessment in a real browser after local access became available. Manual assistive-technology/zoom/smaller-device review and the complete earlier-route acceptance journeys remain outstanding. Lesson completion never awards mastery.

## Route audit

| Route | Existing content and lab | Missing explanation/reasoning | Missing exercise/evidence | Accessibility/layout audit | Mastery requirement | Recommended work |
| --- | --- | --- | --- | --- | --- | --- |
| `why` | Complete motivation lesson; runtime-backed line/feature exploration; prediction, misconception, suitability checks | None for introductory scope; equation intentionally deferred | Three deterministic exercises and local completion now implemented | Native radios/slider, keyboard SVG points, text alternatives, responsive single-column collapse; browser screen-reader/zoom review remains | Later transfer: frame an unfamiliar numerical prediction and reject an unsuitable use | Treat as reference; beta-test comprehension and completion time |
| `equation` | Prediction, slope, bias, residual sign, signed-input geometry, units and extrapolation; existing controls plus runtime calculation table | Scope complete; causal limits explicit | Four deterministic calculation/interpretation checks, experiment evidence, per-check objectives and remediation | Native controls and semantic table; browser/mobile/zoom/screen-reader checks pending | Future unfamiliar-unit and signed-input transfer | Implemented and automated educational verification complete |
| `errors` | Verified lesson: residual sign, absolute/squared contributions, MAE/MSE/RMSE units, runtime-backed graph/table, outlier experiment, metric decision, and generalization check | No remaining gap for lesson scope; later assessment must use unfamiliar values | Four deterministic checks, outlier interaction, three objective records, and lesson completion implemented | Native controls, live feedback, keyboard SVG points, semantic calculation table, responsive overflow; browser screen-reader/zoom review remains | Calculate a residual, choose a metric by consequence, and reject training-only evidence | Treat as reference; beta-test whether learners transfer metric choice to a new domain |
| `gradient-descent` | MSE gradients, chain-rule explanation, simultaneous updates, rate selection, convergence versus instability; accessible runtime training-history table | Scope complete; falling training loss is not proof of convergence or generalization | Four direction/update/diagnosis/evaluation checks plus experiment evidence | Labelled controls, captioned history with column/row headers and current step; browser QA pending | Future unseen-update and trace diagnosis | Implemented and automated educational verification complete |
| `multiple-features` | Weighted sums, dot product, matrix shapes, units, scaling, coefficient interpretation and correlation limits | Scope complete; scaled inputs require consistent parameters | Four contribution/matrix/scaling/correlation checks plus experiment evidence | Native inputs, textual contributions and scaling; browser QA pending | Future independent train-only scaling and contribution reasoning | Implemented and automated educational verification complete |
| `implementation` | Verified lesson: lists, features/targets, prediction function, residuals, MAE/MSE, MSE gradients, update, loop, unseen inference, multiple-feature dot product, and scikit-learn comparison | NumPy vectorization is introduced in the notebook comparison but a full NumPy curriculum remains separate | Seven deterministic fill/repair/trace/workflow checks, three objective records, downloadable notebook | Semantic code labels, native selects/radios/numeric input, announced feedback, horizontally scrollable code, responsive flow; browser screen-reader/zoom review remains | Critical: repair prediction/metric/gradient/update code and preserve an honest split | Reuse as the concrete constrained-code pattern; keep arbitrary execution excluded |
| `failure-modes` | Existing controlled plots plus realistic underfit, overfit, outlier, correlation, leakage, extrapolation and misleading-evaluation cases | All required diagnostic categories explained | Seven evidence-to-remedy checks plus scenario interaction; worked remediation | Native scenarios/radios and textual evidence; browser QA pending | Future unfamiliar leakage/validation and multi-failure cases | Implemented and automated educational verification complete |
| `project` | Six-stage synthetic housing bridge: define, explore, prepare, train, evaluate, explain; 8/4 split; runtime training and metrics; reference notebook and learner report | Scope complete for the small bridge; not the full capstone | Thirteen deterministic checks; six stage objectives/milestones plus preserved aggregate objective; bounded saved session | Captioned tables, native controls, textual plot alternative and status feedback; live browser checks remain a release blocker | Guided completion awards no mastery | Implemented with automated verification; retain browser release gate |
| `mastery` | Versioned 24-question, six-competency independent assessment with 12 deterministic variants | Scope complete for provisional bounded assessment; pilot/calibration remains | 80% plus all 10 critical objectives; objective-level completion/mastery, review/confirmation, feedback, remediation, 20-summary retention | Real browser failure/success/retry/reload and keyboard checks performed; narrow-grid overflow fixed; screen reader/zoom/smaller viewports and whole-module acceptance pending | Mastery only on a passing independent attempt; no awards from visits or guided completion | Implemented; do not label the whole module fully verified |

## Recommended delivery order

1. Equation educational wrapper—complete parameter, unit, and extrapolation evidence.
2. Gradient Descent and Multiple Features—complete critical optimization/scaling evidence.
3. Failure Modes expansion—add leakage and correlated-feature diagnosis.
4. Small guided applied bridge delivered in Task 011.4 without a universal engine; full capstone remains separate.
5. Independent mastery delivered in Task 011.5 after taught/remediation paths were mapped; full release acceptance remains pending.

## Shared work without a rigid template

Reuse the Regression shell, runtime-backed graphs, metric cards, deterministic exercise evaluator, browser-local evidence, objective IDs, feedback patterns, and route navigation. Add reusable code-exercise and accessible data-table components only when the Implementation lesson proves their concrete API. Do not force narrative lessons and diagnostic labs into the same layout.

## Completion acceptance for the whole module

- Nine substantive routes with no placeholder in the advertised pathway.
- Every objective maps to teaching, exercise evidence, remediation, and assessment coverage.
- Five current labs retain mathematical parity; each gains lesson-specific completion without awarding mastery.
- Implementation notebook runs reproducibly and matches deterministic fixtures.
- Guided project meets its rubric and labels simulated versus executed outputs honestly.
- Independent mastery meets the blueprint’s threshold and critical-objective rule.
- Keyboard, screen-reader, zoom, reduced-motion, mobile, direct-route, refresh, and corrupt-storage checks pass.

## Task 011.3 closure — 15 October 2026

Task 011.2 gate: baseline 127 frontend/TypeScript runtime tests, 48 Python tests, type checking and production build passed. All seven notebook code cells executed top to bottom in a new local Python 3.13 process with freshly installed NumPy 2.5.4 and scikit-learn 1.9.1; all assertions passed. The maximum scratch/scikit-learn prediction difference was 0.0049841 (< 0.1). Execution checks Python cells, not the Colab UI. Reproduce with `work/task-011-verification-venv/bin/python work/verify-linear-regression-notebook.py`.

Task 011.3 adds 19 deterministic checks across four lessons, contextual concept recall, defined symbols, worked remediation, objective evidence and preserved aggregate curriculum IDs. Correct checks persist independently; the aggregate objective requires every check and a lab interaction. Resetting the experiment does not revoke earned evidence. No mastery is granted. Storage failures are reported visibly.

Mathematical runtime sources and every existing downloadable notebook retain their pre-change SHA-256 checksums. Versioned schemas and existing routes are unchanged. Browser interaction was attempted and denied by browser security policy; it is not claimed from component tests.

## Original Task 011.4 recommendation (superseded by the closure below)

Agree the guided-project engine and dataset policy; implement the bounded House Price Prediction learning workflow, entity/time split decisions, train-only preprocessing, baseline comparison, held-out evaluation, diagnostic remediation, resumable milestone records and report rubric. Keep independent mastery separate. Include browser and assistive-technology validation when access is available. No deployment is authorized by Task 011.3.

## Task 011.4 applied project bridge closure — 15 October 2026

`/learn/linear-regression/project` now implements all six requested stages. The project uses original deterministic synthetic data (`housing-bridge.v1`), never real market prices. Training properties H01–H08 fit both standardization and model parameters; H09–H12 are held out. The reference target construction is documented in the dataset provenance. Constructed held-out stress cases intentionally expose omitted information and extrapolation; their errors are not a market estimate.

Learners select area-only or area-plus-age inputs, inspect H03/H04, reject two preprocessing mistakes, run bounded runtime training, inspect an update, read actual train/test metrics, diagnose limitations and complete five structured report fields. Thirteen deterministic checks support six stage objectives and six milestones. A finite completed fit with lower training MSE is required before evaluation. Current downstream checks are invalidated by configuration changes; historical completion remains intact. Test reuse is explicitly flagged. Completion does not award mastery.

The reference notebook contains eight standard-library Python code cells and reproduces the default run independently. All eight executed in order in an isolated fresh Python 3.13 process; notebook format validation passed. Python and TypeScript runtime outputs match the frozen independent reference. Default train/test MAE: 1.651996807 / 33.733473897 $k; MSE: 3.782316498 / 2344.920109674 ($k)²; RMSE: 1.944817857 / 48.424375160 $k. Training-mean baseline test MAE is 77.3125 $k.

Automated verification covers deterministic data, held-out perturbation isolation, predictions/metrics, all stage gates, feedback, current-state invalidation, saved progress, corrupt drafts, storage failure and preservation of prior evidence/mastery. Browser discovery found the in-app preview on a connection-refused error page rather than the running app; earlier attempts to inspect that data-URL error page were denied by browser URL policy. No browser interaction/accessibility success is claimed. Live browser, keyboard, mobile/zoom, downloads and assistive-technology checks remain a release blocker. The project status is `implemented`, not browser-verified.

Reusable patterns and unresolved decisions are in `docs/TASK_014_PROJECT_PATTERNS.md`. No universal project engine, full capstone, accounts, billing, arbitrary hosted Python, new algorithm or mastery assessment was added. Runtime source, versioned schema and existing-notebook checksums are preserved.

## Original Task 011.5 recommendation (superseded by closure below)

Implement the independent Linear Regression mastery route using the existing blueprint: deterministic unfamiliar variants, explicit tolerances, remediation and bounded attempt history; award mastery only at 80/100 overall with every critical objective passed. Audit that all assessed objectives have teaching and remediation paths through lessons and the bridge. Keep guided completion separate. Resolve browser/accessibility release blockers before a release. No deployment or Task 011.5 work is authorized by this closure.

## Task 011.5 independent mastery closure — 15 October 2026

All nine routes now contain substantive learning/assessment content. The mastery route implements a versioned 24-question assessment with four items in each of six requested competencies and 12 deterministic variants. Ten critical objectives and an unrounded 80% threshold gate objective-level mastery. Failed attempts record assessment evidence without awarding new mastery; earlier valid results and all earlier progress remain intact.

The interface supports a named response-progress indicator, native controls, independent entry, review, focused editing, explicit submission consent, post-submission explanations/remediation and alternate retakes. Correctness feedback is never shown during an active attempt or review. Canonical submission history is bounded to 20 records for this assessment without trimming unrelated histories. One bounded versioned draft restores partial code choices and rejects mismatched submitted displays.

Real-browser verification became possible after starting localhost successfully. On a separate production test port, a 23/24 attempt with a critical failure correctly failed and a 24/24 variant-v02 retry passed; both records survived reload. Keyboard review/confirmation and focus transitions worked. A real narrow-screen overflow was identified and fixed in the assessment grid. The measured narrow viewport was 466 px, with equal content/document width; an actual 400 px layout, manual screen-reader speech, zoom and earlier routes' complete browser journeys remain unverified.

The complete module remains implemented rather than fully verified. Local preview is available; no deployment occurred. Task 012 is recommended for a separately approved mathematics-foundations scope, starting with the roadmap's Algebra/Functions work after reviewing remaining gaps. Task 012 has not begun.

## Task 011.6 acceptance — 15 October 2026

The fresh isolated production-browser journey completed all nine routes, every guided lesson/project stage, critical-failure assessment (23/24, 95.8%), targeted remediation and a successful changed-variant retry (24/24, all 10 critical). Drafts/results survived reload; all eight earlier completion summaries remained intact. Sequential Tab walks reached every footer without a trap. All nine layouts and the active assessment form fit a measured 320 CSS px viewport.

Targeted fixes constrain Errors/Implementation reflow, add a lesson skip link and named keyboard table scrollers, strengthen scoped contrast/focus, and qualify the decreasing-loss explanation. Mathematical runtimes, versioned contracts, IDs and notebook bytes remain unchanged (21 protected checksums). Full verification: 184 frontend/TypeScript-runtime tests in 31 files, 62 Python tests, typecheck and 22-page production build pass. Both notebooks executed all code cells in fresh processes (7 implementation, 8 project); no Jupyter/Colab UI execution is claimed.

Complete-module acceptance remains **NOT VERIFIED**. Real screen-reader speech, genuine 200%/400% zoom, text spacing/full contrast and target-size exception review, motion preference and full supported-device/download coverage remain open. Gradient's optional convex/Euclidean terminology and Failure Modes' regularization mention are explicit editorial FAIL findings assigned to Task 017. No comprehensive curriculum rewrite was performed.

The authoritative requirement matrix and ownership are in `LINEAR_REGRESSION_ACCEPTANCE_MATRIX.md`; release gates are in `RELEASE_ACCESSIBILITY_QA_BLOCKERS.md`. Earlier historical browser restrictions no longer block the exercised functional journey, but they are not replaced by an all-accessibility PASS. Overall curriculum status remains implemented; no verified-reference claim, Task 012 implementation or deployment is authorized. Independent Task 012 Algebra/Functions work can be considered only with founder approval and its own accessibility gates.
