# Task 015.12 — Experiment Reference Freeze Report

**Historical status:** initial MS-E1/MS-E2 V1 reference freeze (MS-E2 superseded by the authorized V2 repair below).

## Approved source and baseline

- Accepted MLP baseline commit: `8b37d1e8c75a33a0ee2f73265294385a95549ebb` (`Activate verified MLP mastery`). This freeze is documentation/reference tooling only; the accepted app commit remains the parent baseline.
- Approved bounded-spec source: `docs/TASK_015_12_BOUNDED_SPECIFICATION.md` SHA-256 `6a15b2a3db4407c85ff480bc6460dfb78747cd9ff716dcd3bc951e063228e654`. The generator rejects a changed spec hash.
- Scope remains MS01–MS06, 24 objective families, 48 practice, 72 independent, six paired O2 gates, two labs, one notebook, and 20/24 plus all paired gates in one confirmed attempt. No objective, criticality, threshold, or mastery policy changed.

## Frozen manifests

**MS-E1 — Fair model comparison** uses 20 bounded states: 17 fitted candidates and three typed rejections. It compares eight regression candidates on the same fictional house rows and nine classification candidates on the same fictional churn rows. Each candidate gets one authored configuration, identical train and validation IDs within its task, a single candidate fit, identical primary metric, and training-only pipeline fitting. MS-E1 produces no test scores. Test feature rows are present without target labels; full test targets are held in the verification-only sidecar.

**MS-E2 — Selection and generalization** uses 11 bounded states: six development-reference scenarios, one sealed final-test evaluation state, and four typed rejections. It includes grouped nested CV, finite grid and seeded random search, a development-only threshold demonstration, a predeclared simpler-adequate selection rule, and development-holdout permutation importance. The fixture has 36 development rows in groups G00–G08 and 12 sealed test rows in G09–G11. Group IDs are metadata only and never model features. Folds and preprocessing-fit IDs are recorded; scaler parameters are recorded at each fold. The chosen model/parameter/threshold is frozen before the sealed sidecar's single final test evaluation. The selected final candidate is `tree-p1-t50`, with threshold 0.50 under the authored cost/simplicity conventions.

Each manifest is below the approved 64-state limit. Configuration identifiers, fixtures, answers, warnings, fitting rows, candidate settings, expected outputs and explanations are stored in canonical JSON. E1 test targets and E2 final test targets remain out of the learner-facing manifests.

## Metric and selection conventions

- Regression primary metric is MAE; RMSE and R² are secondary descriptions. Classification primary metric is balanced accuracy; positive class is `1`, negative class `0`; fixed class order is `[0,1]`. Precision/F1 use `zero_division=0`. Probability log loss is emitted only for probability-producing estimators; SVC scores are not treated as probabilities.
- Classification cost in E2 is `10 × FN + 1 × FP`, per scored row. Probability thresholds are finite `[0.25, 0.50, 0.75]`; equality predicts positive (`score >= threshold`). Threshold selection uses development grouped folds/OOF data only. Threshold ties choose closest to 0.50, then higher threshold.
- The simpler-adequate rule selects the lowest predeclared complexity tier within 0.10 cost units per row of the best development CV candidate. Within a tier, ties use threshold distance to 0.50, then higher threshold, then candidate ID. This is an authored teaching convention, not universal model-selection advice.
- Absolute tolerance is `1e-12` for metric parity and score ties. Manual metric calculations are checked against pinned scikit-learn metric functions. Undefined/nonfinite values are not silently coerced; invalid states are rejected or represented explicitly.
- Logistic Regression uses `lbfgs`, `l1_ratio=0.0` for pure L2 under pinned scikit-learn 1.9.1. Scaling is inside a pipeline. All random states are fixed; supported `n_jobs` and native thread pools are limited to one. Matplotlib/joblib environment values are pinned/controlled for repeatability.

## Reference verification

Verified using CPython 3.13.16, NumPy 2.5.4, pandas 3.0.6, Matplotlib 3.11.2, scikit-learn 1.9.1, SciPy 1.18.1 and threadpoolctl 3.7.0 from the approved MLP profile on Darwin ARM64. The generator independently computes metrics from frozen predictions and targets, checks metric parity against scikit-learn, records fold/group/provenance traces, and checks disjoint train/score rows and groups. E2 fit counts: nested procedure 171, full finite grid 84, seeded subset 24; threshold OOF uses three folds; permutation uses a development-only holdout; final refit/test reference is separately sealed. No test data influences selection.

`work/freeze-task-015-12.py --freeze` generated the artifacts. Two subsequent `--check` runs completed with exit code 0 and reported byte-identical regeneration and unchanged lock hashes. All generated artifacts and their SHA-256 digests are listed in `freeze-lock.v1.json`. Key artifact hashes:

| Artifact | SHA-256 |
|---|---|
| MS-E1 manifest | `45dd552560225d23878686359c87ca8176d053199e1e965f053f801ba6a82765` |
| MS-E2 V2 manifest | `5f4d64efe6bd60346c59277477b456c5dfbc0f3a869e383392939f5d45100959` |
| MS-E1 sealed test reference | `e49ab1a1d0e79e37ca930de91d3bb89e4b19817c1250cd10ffbb110f28f6370d` |
| MS-E2 V2 sealed test reference | `99ad34c5d8fda7ff1e81cb36b4c57d77a83cab43d5c9f1e7ebdd944ad6cf9b32` |
| V2 parity report | `b34e06a5eddaf648080eeb57a6c90f56e9dbc0f8060569f81aea9a4b8af604a6` |

The reference sidecars are verification artifacts, not learner-facing experiment payloads. Deterministic regeneration necessarily recalculates the sealed reference locally for comparison; the authored selection process still opens the test partition only after the model choice is frozen and never uses it to tune.

## Scope and remaining work

No application, assessment, persistence, learner evidence, notebook, mastery flag, or dependency file was modified. No frontend/Python suite, app typecheck/build, browser test, notebook replay, deployment, or external learner test was run because this authorization is reference freezing only. The notebook and implementation acceptance checks remain future implementation gates. Genuine screen-reader, browser-zoom, Google Colab, and original-directory I/O obligations remain open platform-release requirements.

There are no unresolved curriculum scope/count/mastery decisions for this reference freeze. The next step is separate founder authorization to implement Task 015.12; this report does not infer that authorization.

## Authorized MS-E2 deterministic repair — V2

Founder authorization on 18 October 2026 approved reuse of the existing KNN exact-distance tie semantics and a controlled MS-E2 re-freeze. V1 contained one confirmed ambiguous cutoff: full-development GroupKFold fold 1, query `E2-02-02` (truth 0), k=3, two closer class-0 rows, then conflicting-label tied candidates `E2-00-02` (class 1) and `E2-04-02` (class 0) at 1.1224238052891296. The positive neighbor yields vote share 1/3 and a positive decision at threshold 0.25; the negative yields share 0 and a negative decision. The V1 score record stores aggregate metrics only, so it does not establish which tied neighbor the historical reference selected. Current pinned local and independent ARM64 CI regeneration agree on the alternate aggregate, confirming tie-order sensitivity; the exact historical internal ordering cannot be recovered from V1 artifacts.

V2 makes a single minimal fixture change: `E2-00-00.monthly_charge` 40.0 → 40.000001, leaving all targets, groups, partitions, candidate definitions, costs, thresholds and selection rules intact. The fixture/manifest/final-test reference/parity/lock version is MS-E2 V2; MS-E1 remains V1. Generator guard rejects mixed-label exact float64 ties crossing k membership, with equality tolerance 0.0 per the existing KNN convention (the 1e-12 metric tolerance is not used for neighbor membership). The V2 output generator tests the ambiguity guard on a synthetic tie and confirms the repaired authored CV fits are unambiguous.

The complete V1→V2 output diff is reviewed. The affected `knn-p3-t25` mean balanced accuracy changes `0.7592592592592592` → `0.7407407407407408` and mean cost per row `0.8333333333333334` → `0.8611111111111112` in the development grid and the repeated candidate summary in the simplicity comparison. These are the decision-relevant differences caused by the ambiguous neighbor set and the 0.25 threshold. The 40.000001 input also changes scaler means/scales and full-precision Logistic Regression probabilities in `MS-E2-NESTED-GROUPED-CV-LEGAL` and `MS-E2-DEVELOPMENT-THRESHOLD-COST-LEGAL`; no associated predicted-label, confusion-matrix, threshold-selection, or selected-model changes occur. The sealed test sidecar's targets, probabilities, predictions and metrics are unchanged; only its fixture/reference version identifiers update. MS-E1 manifest and sidecar bytes remain unchanged.

V2 hashes: MS-E1 manifest `45dd552560225d23878686359c87ca8176d053199e1e965f053f801ba6a82765` (unchanged); MS-E2 manifest `5f4d64efe6bd60346c59277477b456c5dfbc0f3a869e383392939f5d45100959`; MS-E1 sealed reference `e49ab1a1d0e79e37ca930de91d3bb89e4b19817c1250cd10ffbb110f28f6370d` (unchanged); MS-E2 sealed reference `99ad34c5d8fda7ff1e81cb36b4c57d77a83cab43d5c9f1e7ebdd944ad6cf9b32`; parity report `b34e06a5eddaf648080eeb57a6c90f56e9dbc0f8060569f81aea9a4b8af604a6`. Independent CI verification remains a separate acceptance gate.
