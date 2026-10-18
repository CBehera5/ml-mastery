# Task 015.7 — Decision Trees implementation and verification

17 October 2026. Implemented bounded Decision Trees module; founder review required before Task015.8. No Random Forest implementation.

## Delivered learning experience

Available at /supervised/decision-trees, six DT01–DT06 routes and a separate /mastery route. Lessons cover partitioning, regression means/SSE, classification proportions/Gini, depth/stability/pruning, safe fitting and local-rule/importance limitations. Each connects a realistic problem, visual intuition, changed experiment, mathematics/symbols, trusted Python, unseen evaluation and comparison. Contextual links recall existing Math, Regression, Python and Evaluation rather than replacing them.

Delivered24 essential objective families,48 practice instances,72 independent instances, six paired O2 gates, two frozen experiments and one downloadable reproducible notebook. [Coverage](task-015-7-objective-coverage.md) records exact mappings. Fictional house-price and churn data teach mechanisms, not production performance. Documentation Quality is a contextual application, not a collected production dataset.

## Experiments and numerical correctness

DT-E1 replays all37 regression states; DT-E2 all32 classification states. Learners predict and choose a reason before reveal, change a bounded configuration and explain the observed result. Native finite selectors expose only frozen tuples. Candidate-membership bars and fitted tree diagrams have numerical/textual alternatives, exact paths and previous-state comparison. Wrong initial predictions may recover; explaining a changed state is required for lab credit.

All69 states match trusted references, including47 fitted trees,16 manual candidate splits and six rejection diagnostics. Frozen IDs, outputs and hashes are unchanged; --check regeneration is byte-identical. [Frozen parity and conventions](TASK_015_7_IMPLEMENTATION_READINESS.md) remain authoritative. Manual candidates are not falsely labeled fitted optima. Classification Gini differs from regression squared-error risk; entropy remains contextual only in DT03. Float32 boundary routing, seeded split ties, root-only trees, one-class probabilities and training-only pruning paths are explicit.

The frozen overfit example reduces train MSE3 to.375 while worsening development MSE3 to5.0625. Complexity selection uses development or fold-local CV, never final-test feedback. Impurity importance is not causal or globally reliable.

## Mastery, evaluator and persistence

Mastery requires20/24 plus both atoms of all six O2 gates in one confirmed attempt. Active assessment has no correctness feedback; review and explicit confirmation precede submission. New attempts rotate whole A/B/C forms with blank answers. Prior passing mastery remains after later failures; attempts never combine.

Practice permits two submissions per variant. Exhausting both requires reviewing the changed example and a correct bounded recall before a new practice cycle. Incorrect answers receive objective-specific explanations and lesson links. Lesson completion requires four correct practice families, meaningful lab credit and correct transfer; none grants independent mastery.

The existing bounded Family evaluator is reused without new execution capabilities. Authored fixtures are deeply frozen. Numeric tolerances remain absolute/relative1e-9; finite choices and typed finite numbers only. There is no learner Python execution, unrestricted expression evaluation, imports, filesystem/network/shell operation or upload.

Separate key: ml-math-lab:supervised:decision-trees:full:v1. Content, policy, assessment and fixture fingerprints isolate versions. Canonical validation rejects corrupt/unsupported data without overwriting original bytes. Storage quota and stale-tab conflicts degrade to explicitly warned memory-only behavior. Retained storage is bounded to20 summaries, latest response and prior mastery. Review restoration returns to active and requires fresh confirmation. No database migration or cross-module evidence transfer.

## Automated verification

- 2,129 frontend/TypeScript tests across96 files pass in the source-identical isolated environment, including252 new module tests.
- 2,000 Python tests pass, including121 new reference/inventory tests.
- All120 authored scored instances checked; numeric calculations independently verified with NumPy/sklearn. Semantic policies use auditable authored invariants rather than fictitious library provenance enforcement.
- All69 frozen states and unchanged hashes verified; byte-identical regeneration passes.
-19/24 and20/24 boundaries across three forms and36 critical-component failures pass. Malformed/equivalent/unanswered answers, retry/remediation, confirmation, no evidence mosaics and prior-mastery retention covered.
- Persistence/restoration/corruption/quota/stale-tab/version-isolation checks pass.
- Typechecking and production build pass in isolated QA.

The initial full frontend run hit a5-second timeout in an unchanged Regression project interaction. Bounded rerun with two workers and a20-second test timeout passes without changing test assertions, curriculum thresholds or mastery semantics. Original-directory Node invocations stalled; isolated QA reuses installed dependencies and verifies source equality. This is not a resolution of original-directory I/O reliability.

## Notebook and accessibility evidence

One notebook embeds fictional aligned training/development rows, regression/classification examples, mean/SSE/Gini checks, depth comparisons, paths, class probabilities and three fold-local pruning demonstrations. No credentials, external dataset, uploads or install cells. Two fresh local kernels produce identical stdout and expected assertions. [Notebook evidence](../outputs/task-015-7/notebooks/report.json) records dependency versions and hashes. Local execution is not genuine Colab verification.

Live production checks cover lesson navigation, practice feedback/restoration, experiment change/predict/reveal/explanation and saved lab credit. Native keyboard Space/Down/Return operates selects; Tab focus and Enter buttons work with visible focus. Mobile viewport320px has no document-level horizontal overflow; wide node tables have labeled scroll regions and exact textual alternatives. Initial DOM-only selector key simulation did not commit native options; native browser key input verified the actual controls without application workarounds.

Genuine screen-reader, genuine browser zoom and genuine Google Colab remain OPEN. No formal learner testing or comprehensive depth audit performed. Screenshots and browser verification notes are under outputs/task-015-7.

## Preservation, risks and next milestone

Existing Math, Regression, Python and earlier supervised source/evidence contracts remain intact. Only two earlier discovery files change to advertise Decision Trees: supervised overview and Learning Journey catalog. No existing storage key or mastery threshold changes.

Remaining risks: original-directory I/O; genuine reader/zoom/Colab; client-visible finite-bank answer memorization and locally editable formative evidence; tiny fictional examples and subgroup uncertainty; deferred comprehensive content audit. These are not production certification guarantees.

No architectural deviation from the bounded evaluator, frozen semantics or approved mastery policies. Task015.8 (Random Forests) remains unimplemented and requires separate founder authorization/specification review. No deployment, external testing, migrations, production data collection or capstone work.
