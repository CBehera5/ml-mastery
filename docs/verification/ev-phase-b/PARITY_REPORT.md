# EV experiment freeze — trusted Python parity evidence

17 October 2026 · specification-only verification · **PASS: all 86 exposed configurations**.

## Frozen deliverables

| Artifact | Result |
|---|---|
| [EV-E1 specification](EV_E1_MANIFEST.md) / [JSON](ev-e1.manifest.v1.json) |54 configurations,10 input fixtures; includes all36 unchanged EV01 permission states plus18 new full-EV states |
| [EV-E2 specification](EV_E2_MANIFEST.md) / [JSON](ev-e2.manifest.v1.json) |32 configurations,8 input fixtures; every fixture at thresholds0,.5,.75,1 |
| [Metric conventions](METRIC_CONVENTIONS.md) |Positive class, threshold ties, confusion counts, loss/ranking definitions, undefined/infinite tags, clipping separation, tolerance and rejection requirements frozen |
| [Freeze lock](freeze-lock.v1.json) |SHA-256 for both generated JSON files, both experiment specifications, metric specification, author script and existing EV01 source/reference assets |
| [Freeze evidence](freeze-evidence.v1.json) |1,088 successful assertions, all configurations verified before freezing |
| [Regeneration evidence](verification-evidence.v1.json) |1,091 successful assertions, including byte-identical regeneration of both manifests and lock validation |
| [Preserved source hashes](preserved-source-hashes.v1.json) |430 application/package/Python source and fixture files unchanged during verification; excludes generated build/dependency/cache directories |

Counts are **reference assertions**, not new frontend/Python application-suite tests, independent exercise instances or learner assessments. All86 states receive numerical/reference checking; no claim that a library alone proves the educational interpretations. Interpretation review checks permission boundaries, mathematical definitions, stated denominators and unsupported conclusions.

## Actual environment

- Executable: `python`.
- macOS15.6.1 ARM64; CPython3.13.16.
- NumPy2.5.4, pandas3.0.6, Matplotlib3.11.2, scikit-learn1.9.1; script asserts the exact approved local profile before verification.
- `MPLCONFIGDIR` was set to a writable temporary directory to confine cache writes. No dependency installation or application-environment alteration.
- Runs are separate local Python processes, not notebook kernels or Google Colab. No credentials, uploads, remote fixtures, network requests, learner execution or production labels.
- Source was read from the original repository. Unlike the prior full frontend recovery, no isolated source copy or alternate package installation was necessary for this small reference task. This does **not** resolve the original Node dependency-directory I/O reliability issue.

## Reproduce

From the project root, set `MPLCONFIGDIR` to a writable temporary directory, activate the approved Python environment, and run the trusted offline specification verifier:

```sh
MPLCONFIGDIR="$MPLCONFIGDIR" \
  python \
  docs/verification/ev-phase-b/freeze_manifests.py
```

Default mode regenerates in memory, compares exact frozen manifest bytes, checks all numerical/semantic invariants and validates every freeze-lock hash. It writes only specification evidence files. A failure is an assertion/nonzero exit, never a silently updated expectation. `--freeze` is a trusted authoring operation used for this initial approved freeze; any later semantic fixture/convention change requires a new version and review, not casual overwrite of v1.0.0. Do not call this author script from the web evaluator or pass learner inputs to it.

## Oracle independence and coverage

| Output | Independent verification |
|---|---|
|36 split/feature permissions|Standard-library ID/set/time arithmetic versus pandas operations; field-by-field equality with the accepted EV01 reference; six valid states. Trusted grouped/time splitter examples separately check the relevant invariants, not exact authored-plan reproduction |
|6 capacity states|Direct absolute-residual averages versus sklearn MAE for every train/development replay and baseline; declared best development candidate, relative reductions and selection permissions |
|6 fit policies|Explicit allowed/actual row-set comparison, hand-computed mean/query centering versus a separately fitted sklearn StandardScaler; both training-only and fold-only valid/invalid examples |
|3 resample states|Direct population-spread arithmetic versus NumPy mean/std(ddof=0), plus range and seed-versus-generalization interpretation |
|3 regression boundary states|SSE/SST arithmetic versus sklearn raw R²(force_finite=False), MAE/MSE; explicit zero-baseline and constant-target tags/default differences |
|32 confusion/decision states|Direct TP/FP/TN/FN counts versus sklearn labeled confusion matrix; accuracy and NumPy independent per-row cost aggregation |
|Precision/recall/F1|Direct count formulas versus sklearn with explicit positive label and zero_division=np.nan; undefined tags checked separately from valid zeros |
|ROC/AP/PR|Pairwise tied ROC and distinct-score AP/PR arithmetic versus sklearn for mathematically defined cases; absent-class tags checked and library replacement differences identified |
|Brier/log loss|Per-row squared errors/natural logs versus sklearn; endpoint infinity preserved; float64 clipping is independently calculated and compared only in a separately labeled library field |
|Calibration summaries|Exact fixed-bin membership, counts and direct means versus NumPy aggregation; empty bins tagged |
|Cross-configuration integrity|Threshold changes leave ranking/probability loss/calibration inputs unchanged; TP/FP never increase as threshold increases; equal ranks can have different Brier error; majority accuracy does not imply positive detection |

Fixtures and expected outputs are generated from trusted authored constants, not from learner code. The oracle checks use distinct manual arithmetic and library operations, rather than merely rereading the same JSON twice. Byte-identical regeneration is an additional determinism/hash check, not the sole correctness evidence.

## Library differences explicitly retained

1. Zero-denominator classification metrics are tagged undefined; a default replacement zero is not mathematical truth.
2. With no actual positives, mathematical recall/AP are undefined even where library conventions supply values. ROC requires both classes. All-positive AP1 remains defined.
3. Synthetic PR precision1/recall0 is a plotting endpoint, not observed precision without predictions.
4. Infinite mathematical log loss remains infinite; the library float64-clipped result is finite and separately labeled. No clipped number is accepted as an equivalent answer to the mathematical endpoint outcome.
5. Constant-target R² does not inherit force_finite=True replacements. The negative-infinite extended convention is explicitly labeled, not called a finite R²/accuracy.

No genuine conflicts were found with approved mastery, finite-answer, resource or persistence policies. Tagged states remain finite choices/slots for future assessment use; they do not expand numeric answer acceptance to NaN/Infinity. The fixed three-point capacity replay does not implement Polynomial Regression ahead of its approved order.

## Not verified in this checkpoint

No EV02–EV06 app lessons,120 scored-instance parity, module mastery activation, persistence implementation, UI keyboard/320px testing, frontend/Python regression suites, typecheck or production build were performed in this specification task. Prior accepted EV01 evidence is unchanged, not rerun or relabeled. No new/full notebook was executed. Genuine screen-reader, genuine browser zoom and genuine Colab remain open acceptance obligations.
