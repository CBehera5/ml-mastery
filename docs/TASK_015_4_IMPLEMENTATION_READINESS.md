# Task015.4 — Logistic experiment reference freeze

17 October2026 · Founder subsequently authorized application implementation. [Completion/acceptance evidence](TASK_015_4_COMPLETION.md) supersedes the earlier application-pending status below; frozen reference assets remain unchanged.

## 1. Frozen manifests and coverage

|Artifact|Configurations|What is frozen|
|---|---:|---|
|[Manifest A — LG-E1](verification/logistic/lg-e1.manifest.v1.json)|28|20 authored score/label/weight cases;6 reference-trained C/query states;2 explicitly unsupported configuration diagnostics|
|[Manifest B — LG-E2](verification/logistic/lg-e2.manifest.v1.json)|33|24 confidence/threshold/cost states;6 endpoint/absent-positive cases;3 invalid evaluation-permission claims|

**61 total states**, each below the64-per-experiment limit. LG-E1 supports LG01,LG02,LG04; LG-E2 supports LG03,LG05,LG06. Each specifies objective IDs, learning question/prerequisites, exact fictional rows, finite controls, complete legal IDs, prediction options, correct explanation/counterexample, numerical/text alternatives and interaction/transfer contract. No unreviewed Cartesian expansion.

Stable schema supervised.logistic.experiment.v1; manifest version1.0.0; LG-E1/LG-E2 identities and all configuration/fixture IDs frozen. Largest fitted matrix8×2; action tables8 rows; sigmoid curves21 read-only samples/42 cells. No scene/answer resource extension.

Authored-weight cases are not labeled trained models. Fitted cases show actual training/development and separate fold fit IDs. Fixed probability cases are authored development outputs, not fictitious trained predictions. Invalid global-scaler/target-derived/test-selected-threshold cases are declared permission diagnostics, not executed leaked fits. No final-test targets or production labels.

## 2. Numerical and solver decisions

[Numerical and endpoint conventions](verification/logistic/NUMERICAL_CONVENTIONS.md) specify score/sigmoid/odds/log-odds, positive1=churns, p≥threshold including equality, confusion/precision/recall/F1/costs, zero-denominator tags, natural-log loss, infinity and separate float64 clipping.

Finite-logit softplus loss is separated from loss evaluated on a rounded endpoint probability. At z40,y0: stable finite-logit loss40; the stored sigmoid may round to1, whose exact probability-endpoint loss is tagged infinite; sklearn clipping gives a separately labeled finite number. This avoids falsely calling a finite real sigmoid an exact mathematical endpoint.

The inspected sklearn1.9.1 API supports the frozen lbfgs/l1_ratio0 workflow; deprecated penalty keyword is omitted. C=.1/1/10, no sample/class weights, unpenalized intercept; objective mean(log loss)+||w||²/(2*C*n), equivalently sum(log loss)+||w||²/(2*C). C is inverse strength, not RG alpha. Exact solver/tolerance/max_iter/scaling/class-order/convergence settings are frozen. Invalid C0 and lbfgs/L1 probes reject before optimization.

## 3. Trusted verification evidence

Executed in accepted CPython3.13.16 / NumPy2.5.4 / pandas3.0.6 / Matplotlib3.11.2 / scikit-learn1.9.1 on macOS15.6.1ARM64. Existing transitive SciPy1.18.1 recorded; no installation or environment modification.

- All61 states pass trusted references and independent arithmetic. Manifest state ledger: [parity report](verification/logistic/parity-report.v1.json).
- Authored cases: independent scalar sigmoid, stable softplus, finite-difference gradient and next-step checks; signed odds/log-odds and endpoint representations distinguished.
- Three full trained C fits and nine distinct fold fits pass warning-free convergence, coefficient/intercept stationarity checks and scaled/raw-coordinate prediction parity. Six query states reuse these references; repeated fold views are not claimed as18 distinct training fits.
- Every confusion/accuracy/precision/recall/F1/clipped-loss output is checked against sklearn with explicit classes/undefined policy; costs also have an independent rowwise check. Mathematical infinity remains a tag, not library replacement.
- Explicit tests cover z0 threshold equality, near-zero/near-one scores, correct/wrong confident cases, exact endpoint loss, absent positives, no predicted positives, equal-hard-label/different-loss cases, row/fixture/reason ID membership and all fold-boundary permissions.
- Second generation matches both manifests byte-for-byte and confirms source/convention/output hashes: [regeneration check](verification/logistic/regeneration-check.v1.json), [lock](verification/logistic/freeze-lock.v1.json).

Concrete counterexample: all three fixed confidence sets at threshold.5 have identical hard labels and accuracy.75, but mean log losses approximately.514347,.631825,.719691. Threshold.6 on the moderate set yields TP2,FP1,TN5,FN0; threshold1 predicts no positives and precision is undefined, not silently0. Same ranking/accuracy is not the same probability quality.

Frozen SHA256:

- LG-E1 f25499ef1d4dad0fa02be5cb298b747f49f232946ed9fb7376a2463ab7fa0a7b
- LG-E2 94f57add2f21f5a13a9a6f5a0f2e063a66747701ad06a6e8e3984dd340c51386

Trusted generator work/freeze-task-015-4.py; --check recalculates all references/edge assertions and verifies the complete freeze. Regeneration commands are in the numerical specification. No cross-platform bitwise guarantee.

## 4. Scope and preservation

The approved [bounded scope](TASK_015_4_BOUNDED_SPECIFICATION.md) remains LG01–06,24 essential objectives,48 practice,72 independent, six paired O2 gates,two experiments,one notebook; mastery20/24 plus all paired gates in one confirmed attempt. **LG02.O1 stays noncritical; LG02.O2 stays critical.** No new gate or mastery semantics.

This freeze does not implement lessons,120 scored instances, UI, persistence, notebook or mastery. No existing evidence was read/regraded/migrated. Protected-source checks are recorded in verification/logistic/source-preservation.v1.json. No application regression/build/keyboard/notebook check is represented as newly run for this reference-only checkpoint.

## 5. Readiness and open obligations

No unresolved mathematical/reference conflict remains. The experiment reference-freeze prerequisite is complete; ready for **separate founder application implementation authorization**. Future implementation must consume these exact assets/conventions, author all approved content/assessments and pass the full bounded acceptance checklist including36 critical-component failures,19/24 and20/24 boundaries, complete suites/build/typecheck, persistence, live keyboard/320px and two notebook kernels.

Genuine screen-reader, genuine browser zoom, genuine Colab and original-directory I/O reliability remain OPEN. No notebook or browser verification was performed here. Tiny fictional data, authored probability fixtures and finite banks are pedagogical examples, not production risk/calibration/fairness or causal evidence. Comprehensive audit/learner testing remain deferred.

No application implementation, deployment, database migration, learner-progress/mastery change, external learner testing or subsequent algorithm work. Stop for founder review.
