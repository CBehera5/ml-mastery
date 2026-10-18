# Task 015.5 — KNN experiment reference-freeze evidence

17 October 2026 · Founder subsequently authorized application implementation. [Completion/evidence](TASK_015_5_COMPLETION.md) records delivery; founder review pending. Reference assets below remain frozen and unchanged; historical application-pending statements are superseded.

## Frozen deliverables

| Artifact | Complete reachable configuration set | Coverage |
|---|---:|---|
| [Manifest A: KN-E1](verification/knn/kn-e1.manifest.v1.json) | 34 | 24 clean/noisy query×k×weight states, eight duplicate-point states, two full-set vote-tie states |
| [Manifest B: KN-E2](verification/knn/kn-e2.manifest.v1.json) | 27 | 24 base/irrelevant-dimension×query×k×scaling states, three explicit rejected diagnostics |

Both are below the approved 64-configuration limit. Their legal ID lists are exhaustive, not permission to expose additional Cartesian combinations. Manifests freeze fictional data, labels, training/development IDs, queries, controls, distances, table ordering, selected neighbors, library neighbor order, weights, totals, vote fractions, predictions, development correctness, explanations/counterexamples and numerical/textual interaction alternatives. No arbitrary query movement, continuous controls, dense boundary mesh or live learner training.

Stable schema `supervised.knn.experiment.v1`, version `1.0.0`, identities KN-E1/KN-E2 and all dataset/configuration IDs are frozen. Largest training matrix is 6×3; no inherited resource-bound extension. Six training points are a small illustration of irrelevant-coordinate effects, not experimental proof of high-dimensional asymptotics.

## Distance, ties and preprocessing

[Distance/tie/scaling specification](verification/knn/DISTANCE_TIE_SCALING_CONVENTIONS.md) documents the conventions proposed before generation and subsequently verified. Core distance is float64 Euclidean. Class1=churns; labels ordered0,1. Uniform and inverse-distance weights are explicit. If any selected neighbor has exactly zero distance, inverse-distance voting uses only the zero-distance rows with equal weight. Conflicting duplicate labels remain separate observations. Equal class totals resolve to class0, matching the verified local sklearn reference; vote fractions are not calibrated probabilities.

**Important library distinction:** educational tables sort equal-distance rows by immutable training ordinal. This is not asserted to be sklearn's neighbor ordering; the library's actual order is recorded separately. Prediction states include all tied neighbors at a cutoff, so the selected set is unambiguous. An ambiguous kth membership is rejected, not silently resolved by an invented row-ID rule. A trusted counterexample at query1 between0/class0 and2/class1 with k1 demonstrates that reversing training order reverses the local sklearn prediction. The diagnostic is an explicit unsupported state, not a fabricated class prediction. This policy preserves reference parity without pretending sklearn has a universal tie guarantee.

Exact versus near-equal distances, near-zero versus zero, full-set uniform/weighted vote ties, conflicting duplicate zeros, invalid k0 and k>n, constant-feature scaling and fold-capacity rejection are covered. The initial authoring attempt exposed a tied cutoff in a draft duplicate query; it failed validation and was replaced before freeze by query0.7. No approved frozen output was rewritten to conceal a failure.

Training-scaled mode uses training-only StandardScaler mean/population variance, with independently calculated mean/variance/scale parity. Query/development rows never fit parameters. Fold fitting remains separately required by the future workflow; experiments include a four-row fold/k5 rejection, not invented CV results. Raw query[440,7.8] selects training row2/class0 at k1; scaled mode selects row1/class1. This is a concrete unit-sensitivity counterexample, not a guarantee scaling always improves performance.

## Trusted verification

Executed using existing `python`: CPython3.13.16, NumPy2.5.4, pandas3.0.6, Matplotlib3.11.2, scikit-learn1.9.1, SciPy1.18.1; macOS15.6.1 ARM64. No dependencies installed or application environment altered.

- **58 prediction states** pass independent scalar Euclidean distance/neighbor/vote calculations against trusted KNeighborsClassifier distances, selected sets, predictions, classes and vote fractions. Scaling parameters separately pass manual population-moment checks.
- **Three diagnostic states** cover forbidden test fitting, illegal fold k and ambiguous cutoff. They are permission/configuration rejections, not sklearn-fitted numerical predictions. Test-fit rejection is a curriculum boundary; sklearn itself does not enforce data provenance.
- [Parity report](verification/knn/parity-report.v1.json) records all61 IDs and edge probes. `passed` means reference fixture checks, not frontend, accessibility, mastery or notebook acceptance.
- Generator `work/freeze-task-015-5.py --check` recomputes references and verifies byte-identical outputs plus generator/convention locks. It passed after final generation. No cross-platform bitwise guarantee.
- [Freeze lock](verification/knn/freeze-lock.v1.json) pins outputs, generator and conventions. Reproduction commands are in the convention document. Floating parity uses abs1e-9+rel1e-9; six-decimal display never changes neighbor membership or the full-precision oracle.

Frozen SHA256:

```
KN-E1 619683ec9f91d1c94d5ff16bc7d5b5ce70e4d28892c434ce8af36701946c0224
KN-E2 68e0a1d20e68286cd44582ef8e69713cda4224ea6b89ccb879c0f9ebf2fa596c
```

## Scope preservation and readiness

[Approved bounded specification](TASK_015_5_BOUNDED_SPECIFICATION.md) remains KN01–04,16 essential families,32 practice,48 independent,four paired O2 gates,two labs,one notebook. Mastery remains13/16 plus both components of all four gates in one confirmed attempt. KNN regression remains comparison-only. No application lessons/scoring/persistence/mastery changes, learner evidence access/migration, production data collection, deployment or later algorithm work was performed. Only trusted offline authoring and documentation/reference assets were added or updated.

No unresolved reference conflict remains within these explicitly bounded controls. Ready for **separate founder application implementation authorization**. Implementation must preserve these assets, then verify all80 scored instances, every frozen state,12/16 and13/16 boundaries,24 critical-component failures, retries/remediation, persistence/version isolation, full frontend/Python regressions,typecheck/build,live keyboard/320px and two fresh notebook kernels. None of those application checks is claimed newly passed by this freeze.

OPEN: original-directory I/O reliability,genuine screen-reader,genuine browser zoom,genuine Colab; finite-bank memorization/local editable storage and later pedagogical audit. Local reference success is not Colab or manual accessibility evidence. Stop for founder review; no application implementation authorization inferred.
