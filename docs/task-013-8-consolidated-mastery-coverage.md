# Task 013.8 — Consolidated assessment and mastery coverage

16 October 2026. Verification only; approved objective identities, thresholds and persistence semantics are unchanged. [Closure report](TASK_013_8_CLOSURE_REVIEW.md) records the decision recommendation and open obligations.

## Exact module coverage

| Module | Lessons | Families | Practice | Independent A/B/C | Pass score | Paired gates | Valid-wrong component failures |
|---|---:|---:|---:|---:|---:|---:|---:|
| essentials | 8 | 32 | 64 | 96 | 26/32 | 8 | 48 |
| numpy | 6 | 24 | 48 | 72 | 20/24 | 6 | 36 |
| pandas | 6 | 24 | 48 | 72 | 20/24 | 7 | 42 |
| visualization | 5 | 20 | 40 | 60 | 16/20 | 5 | 30 |
| preparation | 6 | 24 | 48 | 72 | 20/24 | 8 | 48 |
| sklearn | 5 | 20 | 40 | 60 | 16/20 | 7 | 42 |
| **Total** | **36** | **144** | **288** | **432** | Independent per module | **41** | **246** |

All 720 scored instances have validated authored definitions, accepted whole tuples, explanations and remediation. Each family occurs twice in practice and once in each independent form. No practice or independent instance is omitted from the consolidated audit. The 144 identities and 41 critical flags also match the approved [objective matrix](task-013-lesson-objective-matrix.md). Depth remains 141 essential and three introductory (P08.O4, V05.O4, S05.O4).

## Critical objectives

- **essentials:** P01.O2, P02.O2, P03.O2, P04.O2, P05.O2, P06.O2, P07.O2, P08.O1.
- **numpy:** N01.O2, N02.O1, N03.O2, N04.O2, N05.O2, N06.O2.
- **pandas:** D01.O1, D02.O2, D03.O1, D04.O2, D05.O1, D05.O2, D06.O3.
- **visualization:** V01.O2, V02.O2, V03.O2, V04.O2, V05.O1.
- **preparation:** T01.O1, T01.O2, T02.O1, T03.O1, T04.O1, T05.O1, T05.O2, T06.O1.
- **sklearn:** S01.O1, S01.O3, S02.O1, S02.O2, S03.O1, S04.O1, S05.O1.

Each critical family requires both decision and explanation atoms. Every component was replaced with a valid, actually wrong authored response on each real A/B/C form, including repair-slot candidates selected outside all accepted equivalent tuples. Result: N−1 correct, still above the module's numeric threshold, but mastery rejected for that objective. Total 41×2×3 = 246 passing negative scenarios. This strengthens prior blank-response tests without changing teaching or evaluator behavior. Existing sklearn tests additionally reject all four S02.O2 subdecisions across three forms (12 cases); correct metric arithmetic cannot excuse a false positive-detection claim.

Every real form also verifies the exact below-threshold and passing boundaries: 25/26, 19/20 or 15/16 as applicable, with all critical gates correct, plus full-score success. No threshold is rounded down.

## Lesson-to-objective inventory

Each row has all four objective families, worked explanation, two practice variants per objective, three independent variants per objective and targeted remediation. Detailed outcome wording remains canonical in the approved objective matrix rather than being redefined here. Machine-readable lesson/outcome/remediation records: [coverage JSON](../outputs/task-013-8/mastery-coverage.json); prerequisites and mathematical connections: [learning journey JSON](../outputs/task-013-8/learning-journey.json).

| Module | Lesson | Approved objective families |
|---|---|---|
| essentials |  — Values, names, operators and units | P01.O1, P01.O2, P01.O3, P01.O4 |
| essentials |  — Collections, order, indexing and mutation | P02.O1, P02.O2, P02.O3, P02.O4 |
| essentials |  — Conditions and explicit missing-value rules | P03.O1, P03.O2, P03.O3, P03.O4 |
| essentials |  — Loops and reliable aggregations | P04.O1, P04.O2, P04.O3, P04.O4 |
| essentials |  — Functions turn repeated steps into contracts | P05.O1, P05.O2, P05.O3, P05.O4 |
| essentials |  — Comprehensions as readable transformations | P06.O1, P06.O2, P06.O3, P06.O4 |
| essentials |  — Debugging, exceptions and imports | P07.O1, P07.O2, P07.O3, P07.O4 |
| essentials |  — Reproducible small programs and local data | P08.O1, P08.O2, P08.O3, P08.O4 |
| numpy |  — Arrays describe data and shape | N01.O1, N01.O2, N01.O3, N01.O4 |
| numpy |  — Indexing, masks, views and copies | N02.O1, N02.O2, N02.O3, N02.O4 |
| numpy |  — Broadcasting is shape reasoning | N03.O1, N03.O2, N03.O3, N03.O4 |
| numpy |  — Vectorized predictions replace repeated scalar work | N04.O1, N04.O2, N04.O3, N04.O4 |
| numpy |  — Matrix multiplication and transposes | N05.O1, N05.O2, N05.O3, N05.O4 |
| numpy |  — Reductions, missingness and numeric limits | N06.O1, N06.O2, N06.O3, N06.O4 |
| pandas |  — Series, DataFrames and labeled data | D01.O1, D01.O2, D01.O3, D01.O4 |
| pandas |  — Selecting and filtering without losing alignment | D02.O1, D02.O2, D02.O3, D02.O4 |
| pandas |  — Missing values require a stated policy | D03.O1, D03.O2, D03.O3, D03.O4 |
| pandas |  — Grouping, aggregating and reporting denominators | D04.O1, D04.O2, D04.O3, D04.O4 |
| pandas |  — Joins can duplicate or lose observations | D05.O1, D05.O2, D05.O3, D05.O4 |
| pandas |  — A reproducible dataset audit | D06.O1, D06.O2, D06.O3, D06.O4 |
| visualization |  — Figures, axes and readable measurement | V01.O1, V01.O2, V01.O3, V01.O4 |
| visualization |  — Histograms show distributions, not individual paths | V02.O1, V02.O2, V02.O3, V02.O4 |
| visualization |  — Scatterplots, relationships and causal caution | V03.O1, V03.O2, V03.O3, V03.O4 |
| visualization |  — Box plots summarize spread with conventions | V04.O1, V04.O2, V04.O3, V04.O4 |
| visualization |  — Choose charts and detect misleading claims | V05.O1, V05.O2, V05.O3, V05.O4 |
| preparation |  — Split observations before learning from them | T01.O1, T01.O2, T01.O3, T01.O4 |
| preparation |  — Fit missing-data rules on training data | T02.O1, T02.O2, T02.O3, T02.O4 |
| preparation |  — Categorical encoding preserves a feature contract | T03.O1, T03.O2, T03.O3, T03.O4 |
| preparation |  — Scaling is a fitted coordinate transformation | T04.O1, T04.O2, T04.O3, T04.O4 |
| preparation |  — Compose preprocessing without leaking across folds | T05.O1, T05.O2, T05.O3, T05.O4 |
| preparation |  — Outlier policies and reproducible preparation reports | T06.O1, T06.O2, T06.O3, T06.O4 |
| sklearn |  — The estimator lifecycle and a first baseline | S01.O1, S01.O2, S01.O3, S01.O4 |
| sklearn |  — Evaluate against a meaningful baseline | S02.O1, S02.O2, S02.O3, S02.O4 |
| sklearn |  — Cross-validation keeps validation inside training | S03.O1, S03.O2, S03.O3, S03.O4 |
| sklearn |  — A complete train-fitted pipeline | S04.O1, S04.O2, S04.O3, S04.O4 |
| sklearn |  — Compare models without choosing on the test set | S05.O1, S05.O2, S05.O3, S05.O4 |

## Attempt, remediation and persistence integrity

- All mastery conditions belong to one confirmed independent attempt. No best-of-attempt mosaic, completion/notebook award, aggregate Python credential or cross-module mastery import.
- Only independently correct objectives in a passing attempt receive mastery. A later failure, history trimming or lesson reset does not erase prior same-version mastery.
- Active → review → explicit confirmation → results; no per-answer correctness before confirmation. Reloading review returns to active and requires review/confirmation again. Disclosed unanswered items score wrong; malformed or incomplete representations reject without grading/form advancement.
- Independent retries are unlimited fresh-ID A→B→C rotations. Practice allows two valid submissions per variant per cycle; malformed input does not consume an attempt. Exhaustion requires targeted review and correct bounded changed-case recall before an explicit new cycle.
- Six scopes use content python.<module>.1.0.0 and assessment python.<module>.mastery.v1. Storage keys ml-math-lab:python:<module>:v1 except Essentials v2/schema2; other envelopes schema1. Original P01 v1 remains separate.
- Hydrate-before-write, canonical version/ownership/bounds validation, corruption/future/foreign-byte preservation, quota/denied/stale-write failure handling, latest20 summaries and latest full submission remain covered by all six model suites. Failed writes do not replace prior durable bytes.
- Only the approved opt-in P01-to-Essentials practice/completion copy exists: preview, explicit confirmation, strict map/version, copy-only, idempotent and failure-safe. It cannot transfer independent mastery or overwrite original P01. See [explicit mapping](task-013-2-p01-evidence-map.md).
- Six integration tests exercise actual module controllers with in-memory storage: successful mastery, round-trip restoration, ownership and reset isolation. Synthetic fixtures remain test-only, never real learner evidence. Browser QA uses a new loopback origin, not existing learner origins.

## Evidence and limits

New verification-only test: work/task-013-8-audit.test.ts. Existing six module model/component suites and foundation contracts cover retry/remediation, malformed/equivalent inputs, confirmation, persistence and migrations. Full run:445 tests/79 files passed, including the new consolidated test;919 Python tests passed. See [logs](../outputs/task-013-8/verification/).

The browser journey independently restored six module drafts, six meaningful changed experiments and verified sklearn19/20 critical failure, fresh-form16/20 success, confirmed blank0/20 later failure with retained mastery, and earlier-module draft isolation. Every module's full mastery boundary and component matrix was automated; this is not a claim that every form was manually completed in every browser. Genuine screen-reader, zoom and Colab remain unverified.

