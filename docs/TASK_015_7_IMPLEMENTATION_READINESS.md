# Task 015.7 — Decision Tree reference-freeze readiness

17 October 2026. Specification/reference work only. Application implementation requires separate founder authorization.

## Frozen deliverables

| Artifact | Frozen inventory |
|---|---|
| [DT-E1 regression manifest](verification/decision-trees/dt-e1.manifest.v1.json) | 37 configurations: 26 fitted trees, eight authored candidate splits, three rejection diagnostics |
| [DT-E2 classification manifest](verification/decision-trees/dt-e2.manifest.v1.json) | 32 configurations: 21 fitted trees, eight authored candidate splits, three rejection diagnostics |
| [Numerical conventions](verification/decision-trees/SPLIT_IMPURITY_PRUNING_CONVENTIONS.md) | Splits, Gini, squared error, leaves, precision, ties and pruning |
| [Trusted parity evidence](verification/decision-trees/parity-report.v1.json) | Independent arithmetic, sklearn structures, paths, predictions, metrics and pruning |
| [Freeze lock](verification/decision-trees/freeze-lock.v1.json) | SHA-256 of both manifests, parity report, generator and conventions |
| [Source preservation](verification/decision-trees/source-preservation.v1.json) | All 477 accepted baseline source files unchanged |

Both labs are below the 64-configuration limit. Total: 69 configurations, comprising 47 fitted states, 16 manual split states and six semantic rejection diagnostics. Diagnostics are not claimed as successful model fits. Each manifest contains exact fictional datasets, feature/target meanings, stable IDs, finite controls, memberships, calculations, predictions, decision paths, prediction/reason choices, explanations and textual alternatives.

## Verification and regeneration

Approved existing environment: CPython 3.13.16, NumPy 2.5.4, pandas 3.0.6, Matplotlib 3.11.2, scikit-learn 1.9.1, SciPy 1.18.1; macOS 15.6.1 ARM64. No packages installed. Trusted offline authoring only; no learner code execution.

From repository root:

```sh
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python work/freeze-task-015-7.py --check
```

PASS: every exposed configuration verified; independent-process regeneration is byte-identical. Default generator mode is for authorized reference authoring; implementation should use --check, not rewrite frozen outputs.

Exact rational arithmetic checks candidate gains and ties; independent routing checks sklearn decision paths, leaves and predictions. Repeated seeded fitting verifies identical structures. Training-only pruning paths have monotonic alphas/risks and match fitted weighted leaf risk. Classification probabilities, confusion counts and regression MSE/MAE are checked against references. Constant features, pure targets, tied candidate features, one-class probabilities and float32 below/equal/above threshold probes are covered.

Frozen generalization counterexample: regression depth 1 to depth 2 reduces training MSE from 3 to 0.375 but increases development MSE from 3 to 5.0625. Development labels measure performance; they never determine fitted splits or training-derived pruning paths. No final test selection is allowed.

## Numerical and educational decisions

- Classification uses Gini; regression uses squared_error (node mean squared deviation, with explicit SSE and sample-weighted gain). These are different task-specific quantities.
- Founder-approved entropy treatment is contextual only: balanced binary entropy is 1 bit versus Gini 0.5; both are zero for a pure node. No entropy fitted variant or new gate.
- Features are explicitly ordered, random_state=1729 and every estimator parameter is recorded. Candidate enumeration is not represented as sklearn's feature-tie rule: actual tied feature choices are frozen for the pinned implementation.
- Inputs route left at x <= threshold after declared float32 conversion. Class ties choose the first sorted class. Regression leaves predict means; classification leaves expose class fractions, not guaranteed calibrated probabilities.
- Every state requires prediction and reason before reveal. Numerical tables, memberships and path text accompany visual implementation requirements. Changing controls requires a fresh prediction; experiments cannot confer mastery.
- Semantic rejection of misaligned targets or test-driven pruning is an authored provenance rule, not a claim that sklearn enforces those permissions.

## Approved scope and remaining acceptance work

DT01–DT06, 24 objectives, 48 practice, 72 independent instances, six paired O2 gates, two experiments and one notebook remain unchanged. Mastery remains 20/24 plus both components of all six gates in one confirmed attempt. No evidence combination, practice-derived mastery or changes to existing learner evidence.

Reference freeze is complete without unresolved numerical or curriculum conflicts. The application, 120 scored exercises and notebook are not implemented by this checkpoint. Implementation must verify all objective mappings, 19/24 and 20/24 boundaries, 36 valid-wrong critical-component failures, retry/remediation, persistence/version isolation, full frontend/Python regressions, typecheck/build, keyboard/320px interactions and two fresh notebook kernels. No new pass is claimed for those checks here.

OPEN: genuine screen-reader, genuine browser zoom, genuine Colab execution and original-directory I/O reliability. Successful bounded reads/regeneration do not establish general I/O reliability. No deployment, external learner testing, production data collection or later algorithm work.

**Recommendation:** ready for separate Task 015.7 application implementation authorization against these frozen references.
