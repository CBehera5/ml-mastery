# Task015.1 Phase B — experiment freeze and implementation readiness

**Later17 October2026 disposition:** founder approved the frozen manifests and separately authorized Phase B implementation. [Completion report](TASK_015_1_PHASE_B_COMPLETION.md) records the completed bounded module and verification. The freeze/readiness record below is historical; frozen manifest/metric semantics remain unchanged. No Polynomial authorization is inferred.

17 October 2026 · founder-authorized **specification work only** · **ready for implementation authorization**.

The founder authorized freezing the two experiment manifests after the Phase B specification review. That authorization does not permit beginning EV02–EV06 application implementation. This report supersedes the earlier missing-manifest blocker; the historical next-milestone review remains the source of lesson/objective allocation.

## 1. Scope remains unchanged

| Allocation | New Phase B | Final Evaluation Foundations |
|---|---:|---:|
|Lessons|EV02–EV06 (5)|EV01–EV06 (6)|
|Objective families|20|24|
|Practice instances|40|48|
|Independent instances|60|72 across three forms|
|Paired critical gates|5 new|6, exactly EV01.O2–EV06.O2|
|Experiments|Complete the two existing allocations|EV-E1 and EV-E2 only|
|Notebook|Extend the EV01 feasibility section|One full reproducible EV notebook|

Mastery: **at least20/24 families plus both components of every critical gate in one confirmed independent attempt**. No cross-attempt combination, practice/experiment/notebook mastery, threshold weakening or overwrite of earlier earned same-version mastery after a later failure. The experiment freeze creates no learner mastery and activates nothing.

## 2. Lesson/objective mapping retained

Four essential families per lesson, in O1/O2/O3/O4 order; O2 is paired and critical:

|Lesson|Objectives|Frozen experiment support|
|---|---|---|
|EV02 — Estimate generalization|Parameters/hyperparameters/final evaluation; reject test-driven selection and explain optimism; baseline-relative error; negative R² is not accuracy|EV-E1 capacity/selection and regression boundaries|
|EV03 — Classification decisions and costs|Named-positive confusion counts; reject accuracy-only imbalance claims with cost-aware reasoning; denominator-aware precision/recall/F1; thresholds do not retrain|EV-E2 decisions, costs, absent classes and threshold comparisons|
|EV04 — Probabilities versus ranking|Label/score/probability distinction; invalid probability/calibration conclusions; Brier/log-loss contributions; ROC/PR/AP distinction|EV-E2 same-rank/different-loss, calibration bins, ties and endpoints|
|EV05 — Bias, variance and uncertainty|Under/overfit curves; development-only capacity selection; fixed-resample variability; uncertainty versus reproducible seeds|EV-E1 three-capacity replay, forbidden test selection and resamples|
|EV06 — Honest workflow report|Fit provenance; reject global/cross-fold fitting and explain permitted rows; population/shift/subgroup limitations; reproducible comparison and final-test permission|EV-E1 train/fold centering, row IDs, descriptive uncertainty and final-test eligibility|

Original [objective matrix](supervised-lesson-objective-matrix.md) remains binding. Experiments support, but do not replace, teaching, two practice instances and three independent instances for every objective. EV01's12 private independent fixtures require learner-assessment review/requalification into full-EV forms; do not duplicate them or promote prototype evidence.

## 3. Frozen specification package

- [EV-E1 manifest](verification/ev-phase-b/EV_E1_MANIFEST.md):54 complete configurations (36 preserved prediction-permission states plus18 generalization/fit/uncertainty/edge states),10 fixtures.
- [EV-E2 manifest](verification/ev-phase-b/EV_E2_MANIFEST.md):32 configurations,8 fixtures at4 thresholds.
- [Metric/edge-case contract](verification/ev-phase-b/METRIC_CONVENTIONS.md):class1=Needs Improvement; threshold equality positive; explicit undefined/infinite tags; exact denominators; unclipped mathematical versus clipped library losses; inherited answer bounds/tolerance.
- [Trusted parity report](verification/ev-phase-b/PARITY_REPORT.md), machine-readable freeze/regeneration evidence and [SHA-256 lock](verification/ev-phase-b/freeze-lock.v1.json):all86 states verified on the approved local dependency profile. Regeneration passes1,091 assertions, including byte-identical outputs and lock integrity. These are not new application test counts.

Both experiments stay below64 configurations; panel selection does not create additional experiments. Fixed predictions are labeled replay, not live trained models. Endpoint tags remain choice/slot outcomes; numeric answer acceptance remains finite-only. No genuine conflict with existing approved policies was found and no new product decision is needed for this freeze.

## 4. Engineering boundary for the later authorized implementation

Use the existing deterministic primitives through an explicitly supervised-local catalog/scorer; do not edit the six Python policies or Math/Regression contracts. Freeze full-EV scope/content/assessment IDs before coding its persistence. Preserve prototype storage/key/version unchanged, with **no import, migration or automatic transfer**. Later opt-in copying would require separately approved exact mapping, not an inferred equivalence. Prior records are never rewritten or deleted.

Use the approved practice retry/remediation, independent form rotation/review/confirmation, prior-mastery retention and bounded versioned persistence policies. Unsupported inputs produce bounded format feedback rather than mathematical failure. No arbitrary learner Python, imports, expression interpretation, filesystem/network/shell access or uploads.

## 5. Required implementation acceptance — still pending

- Complete all six lessons' objective-to-teaching/practice/independent/remediation coverage, including new EV02–EV06. Preserve the existing EV01 route/behavior and evidence.
- Verify all120 final scored instances against trusted references; requalify, do not inflate, the12 retained EV01 independent instances.
- Verify threshold19/24 fails and20/24 passes with all gates correct; all36 valid-wrong critical-component failures across three forms; no mosaics; prior mastery survives later failed attempts.
- Verify practice retries/remediation, malformed/equivalent answers, review/reconfirmation, unlimited fresh independent attempts and no correctness reveal while active.
- Persistence: hydration/restoration, corruption, quota/denial, stale tabs, unsupported versions, scope isolation and failure-safe original-byte preservation.
- Implement only these frozen86 lab states. Recheck reference hashes/parity; prediction/change/reveal/explanation/transfer, stale-result clearing, reset and accessible textual/numerical equivalence.
- Full frontend/TypeScript and Python regressions, typecheck and production build; original-directory I/O may require the proven source-identical isolated recovery, with differences recorded.
- Actual keyboard-only and320px checks. Genuine screen-reader/browser zoom remain explicitly open unless genuinely performed.
- Extend the single EV notebook with pinned approved profile, in-notebook fictional fixtures/seed/checksums, fit/evaluation provenance, expected outputs and trusted guided exercises; two fresh local kernels must match. Genuine Colab remains distinct and open.
- Release full-EV mastery only after complete module verification, not on the basis of this manifest-only parity result.

## 6. Preservation and outstanding risks

This checkpoint added specification documents, immutable manifest data and trusted offline reference evidence under docs only. No application code, existing Python runtime/tests/fixtures, packages, notebooks, learner records or mastery policies changed.430 application/package/Python files were hash-checked unchanged during reference runs. No dependencies were installed.

Open obligations: original-directory Node I/O reliability; genuine screen-reader, browser zoom and Google Colab execution; future full-module implementation acceptance; finite-bank memorization risk and planned later curriculum audit/external learner testing. The fictional documentation rows are not a validated production annotation dataset.

## 7. Decision and next step

**Experiment manifests and parity evidence are complete and frozen, with no unresolved specification conflict.** No additional metric-policy decision is requested. Await explicit founder authorization to implement Phase B against this package. Do not start EV02–EV06 yet. Polynomial Regression remains Task015.2 after Evaluation Foundations completion and separate founder approval. No deployment, learner testing, capstones or subsequent algorithm work.
