# Task 015.12 — Model Selection & Comparison bounded specification

**Status: Scope verified from the approved Task 015 baseline; implementation not authorized or started.** This document preserves the approved allocation and does not add lessons, objectives, experiments, algorithms, or mastery rules.

## Approved scope and dependencies

Task 015.12 is the final approved Supervised Learning module: **MS01–MS06**, 24 objective families, 48 practice instances (two variants per family), 72 independent instances (three complete forms), six paired O2 critical gates, two bounded visual experiments (MS-E1 and MS-E2), and one reproducible notebook. The implementation-decision package assigns the module threshold **20/24**. Each O2 gate has two required atoms; both must be correct. A passing score with any critical gate/component failed is a failure. All requirements must be met in one reviewed and explicitly confirmed independent attempt; evidence is not combined across attempts.

Dependencies are Evaluation Foundations (EV) and the previously completed candidate mechanisms: existing Linear Regression plus Task 015 Polynomial Regression, Regularized Regression, Logistic Regression, KNN, Naive Bayes, Decision Trees, Random Forests, Gradient Boosting, SVM, and introductory MLP. Their existing lessons and evidence are prerequisites/context, not repeated MS objectives. Recall links are available without converting dependencies into new content. No capstone, project engine, new estimator, or route-lock behavior is added here.

The approved Task 015 sequence places model selection after the algorithms. This specification is the bounded scope; it does not authorize implementation, experiment reference freezing, migrations, deployment, learner testing, or Task 015.13.

## Lesson and objective matrix

The following objective wording and lesson seeds are transcribed from `supervised-lesson-objective-matrix.md`. Each lesson uses a realistic selection decision, a worked example, a bounded practice variant, independent assessment, conceptual feedback, and targeted remediation. The matrix remains the authority for exact objective IDs and criticality.

| Lesson | Objectives (O2 is paired critical) | Worked seed / misconception addressed |
|---|---|---|
| **MS01 — Fair comparison** | **O1:** Construct a same-row/fold/metric comparison table. **O2 critical:** Reject unequal information budgets or splits and explain why rankings are invalid. **O3:** Compare baseline-relative scores and costs. **O4:** Record parameter and preparation provenance. | MAE 4 versus 5 is meaningful only on matching observation IDs. A leaderboard rank is not fair when data or information budgets differ; remediation aligns comparison manifests. |
| **MS02 — Search consumes information** | **O1:** Enumerate a finite grid and its fit count. **O2 critical:** Reject selection on final-test results and explain selection optimism. **O3:** Choose explicit scoring and refit conventions. **O4:** Compare grid search with seeded finite random search. | `3 C × 2 γ × 3 folds = 18 fits` before refit. Search is not an unbiased evaluation; separate selection from evaluation. |
| **MS03 — Nested and structured validation** | **O1:** Trace outer versus inner fold roles. **O2 critical:** Reject preprocessing/tuning across outer holdouts or group/time boundaries and explain why. **O3:** Interpret a nested score versus the final-refit artifact. **O4:** Identify insufficient or group-invalid folds. | Outer 3 × inner 2 with fit IDs recorded. Nested CV estimates a procedure; it does not create one magical final model. |
| **MS04 — Imbalance and thresholds** | **O1:** Compare fixed class weights and threshold candidates. **O2 critical:** Reject resampling, threshold, or calibration fitting on validation/test targets. **O3:** Compute cost-aware development selection. **O4:** Distinguish prevalence change from causal effect. | False-negative cost 10 versus false-positive cost 1. Higher accuracy can increase cost; reconstruct confusion counts. |
| **MS05 — Interpret responsibly** | **O1:** Compute held-out permutation-score change. **O2 critical:** Reject permutation/coefficient/partial-dependence evidence as causal proof. **O3:** Explain correlated-feature and subgroup limitations. **O4:** Compare local/global and model/data explanations. | MAE 4→6 after permutation means degradation 2 on that evaluated sample. Importance depends on model and data; a correlated proxy can substitute. |
| **MS06 — Reproducible final decision** | **O1:** Select an adequate model under declared constraints. **O2 critical:** Protect one final-test evaluation and explain honest reporting of a failed test. **O3:** Construct a reproducible model card/selection report. **O4:** Map limitations and deployment prerequisites to a capstone. | Freeze the model choice before unsealing the test manifest. Poor final performance is not permission to retune on test; report limits and need for a new study. |

The 24 objective IDs are `MS01.O1–O4` through `MS06.O1–O4`. The six critical gates are exactly `MS01.O2`, `MS02.O2`, `MS03.O2`, `MS04.O2`, `MS05.O2`, and `MS06.O2`; each gate has its approved decision/calculation and reason/transfer components. Do not reclassify any O1/O3/O4 objective as critical or add a new gate.

## Assessment, retries, and mastery

- Objective-family counts award at most one point per family, only when every required atom in that family is correct. Paired atoms do not enlarge the 24-family denominator.
- Independent mastery requires **20/24 or more and all six paired O2 gates fully correct in one attempt**, followed by review and explicit confirmation. A 19/24 attempt fails; a 20/24 attempt passes only when every critical atom is correct.
- Three complete independent forms assess the same objectives with different numbers, contexts, and distractor orders. No cross-attempt mosaics, practice/notebook/completion credit, cross-module transfer, or aggregation credential.
- Independent retries are unlimited, use a new attempt ID, rotate A→B→C, and require whole-form reassessment and confirmation. Do not reveal per-question correctness while an attempt is active. Invalid answer representations do not consume a graded attempt.
- Failed gates receive objective-specific explanation, contrasting example, and recommended recall. Remediation is recommended, not a hard lock on independent assessment. Preserve earlier same-version mastery after later failed attempts; only correct families from a passing attempt may add new independent mastery.

These policies are inherited unchanged from `supervised-mastery-and-evaluator-proposal.md` and the Task 015 implementation decision package.

## Experiments and notebook

The approved visual experiment map assigns exactly two labs:

| Lab | Lessons | Bounded experience and expected learning |
|---|---|---|
| **MS-E1 — Fair selection and validation boundaries** | MS01–MS03, MS06 | Learner predicts fit count and a valid candidate choice from a finite candidate/split/provenance manifest. Reveal shows same-row comparisons, inner/outer fit-ID timelines, and the distinction between a selected refit artifact and a performance estimate. Uses explicit scorer/refit settings; final-test permissions are validated separately. |
| **MS-E2 — Cost, thresholds, and responsible interpretation** | MS04–MS06 | Learner predicts cost or interpretation changes from bounded development-threshold, fixed-weight, and feature-permutation choices. Reveal provides confusion/cost tables, paired errors, and a correlated-feature counterexample. Choice is frozen before a final test is revealed; test-guided resampling, calibration, thresholding, and causal claims are rejected. |

Both experiments must implement the universal contract in `supervised-visual-experiments.md`: meaningful prediction-before-reveal, finite authored controls, changed-state explanation, numerical/text alternatives, keyboard operation, and trusted reference parity for every exposed state. Each lab is limited to at most 64 reviewed configurations. **The approved curriculum does not set exact configuration counts, datasets, thresholds, solver settings, or hashes**; those must be authored and reference-verified before implementation is reported complete. This is not permission to expand the evaluator or use arbitrary learner data/code.

Deliver one module notebook using the approved reusable notebook template. It must use bundled, small, deterministic fixtures; show baseline construction, fair same-row/fold comparison, selection inside development data, error/cost and interpretation analysis, and a final choice frozen before a single untouched test evaluation. Include environment/version/seed assertions and provenance. It must run twice in fresh local kernels with matching structured outputs and require no credentials, uploads, remote dataset, or paid service. Genuine Colab execution remains a separate open platform obligation.

### Cross-algorithm and capstone alignment

Candidate comparisons draw only from already implemented mechanisms: for regression, the existing Linear Regression and Task 015 Polynomial, Regularized, Tree, Forest, and Boosting modules; for classification, Logistic Regression, KNN, Naive Bayes, Tree, Forest, Boosting, SVM, and introductory MLP modules. Include an appropriate simple baseline. The module teaches why the candidate set is appropriate; it does not add or retrain an unimplemented algorithm. Not every candidate must appear in every small fixture, and no unequal-row/fold/metric leaderboard is acceptable.

Use the three approved project directions only as application contexts: House Price Prediction (regression and declared error/cost constraints), Customer Churn Prediction (classification, imbalance and decision costs), and Technical Documentation Quality Prediction (human-reviewed Good/Needs Improvement labels with group/source and label-provenance cautions). Map final selection limitations and deployment prerequisites to the relevant project in MS06; do not build capstone datasets, project engines, or deployment workflows in this milestone.

## Evaluator and persistence boundaries

- Reuse the deterministic, fixture-backed supervised assessment architecture, finite choice/numeric answers and explicitly predefined repair tuples. Grade only authored configurations and bounded representations; unsupported formats are distinct from valid but incorrect answers.
- No arbitrary Python execution, learner imports, `eval`/`exec`, general expression interpreter, shell, filesystem/network operation, uploads, model deserialization, or hosted learner-code execution. Notebook code is trusted author code, not web-submitted code.
- Preserve the approved limits and semantics in `supervised-mastery-and-evaluator-proposal.md`; do not introduce new operation types, increase payload/configuration bounds, or silently substitute library defaults for declared metrics/splits.
- Use an independent, versioned MS evidence scope. The exact scope/content/assessment/fixture identifiers must be frozen before implementation. Do not infer or migrate evidence from other module scopes; no database migration is in this task. Hydrate/validate before writes; reject corrupt, foreign, stale, and unsupported future records without deleting originals; keep prior same-version mastery after failure; isolate retries and idempotent confirmation.

## Acceptance criteria for a future implementation

1. Trace all 24 objectives to teaching, worked examples, both practice variants, all three independent forms, post-submit feedback, and targeted remediation; show that no objective is only an API-name question.
2. Verify every scored instance and every reachable MS-E1/MS-E2 configuration against trusted Python/scikit-learn references plus independent arithmetic/permission checks; freeze fixtures, fit-row provenance, seeds, versions, tolerances, output hashes, and deterministic regeneration.
3. Exercise 19/24 failure and 20/24 conditional success boundaries. Fail mastery for every O2 gate and each of its two components across all three forms. Confirm a passing score cannot mask any gate failure.
4. Verify retries, A→B→C rotation, review/explicit confirmation, no partial-attempt mosaic, remediation, answer equivalence/malformed inputs, and retention of previously earned same-version mastery after later failure.
5. Verify storage round-trip, reload/restore, corrupt/oversized/future/foreign version rejection, quota/denial behavior, idempotent confirmation, and zero writes or reinterpretation of existing Python/Math/Regression/algorithm evidence.
6. Run full frontend/TypeScript and Python regressions, typecheck, and production build on the final source; report command, exact counts, durations, and exit codes.
7. Verify each lab by keyboard-only interaction, focus and announcement behavior, numerical/text alternative, responsive layout at 320px, and two fresh local notebook kernels. Keep genuine screen-reader, browser zoom, Colab, and original-directory I/O as open requirements until actual evidence is available.
8. Keep mastery unavailable until every implementation acceptance gate passes. No deployment, external learner testing, capstone/project-engine implementation, migration, new algorithm, or Task 015.13 work is included.

## Founder decisions and remaining work

**No scope/count/objective/mastery decision remains open for this bounded specification.** Before implementation completion, author and freeze exact experiment fixtures/configurations and trusted-reference outputs, plus the module's version identifiers, within the approved limits. Task 015.12 implementation still requires its own founder authorization. The platform release obligations—genuine screen-reader, browser zoom, Google Colab, and original-directory I/O verification—remain open and are not prerequisites to invent or expand this curriculum specification.
