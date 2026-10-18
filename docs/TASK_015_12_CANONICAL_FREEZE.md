# Task 015.12 — Canonical MS-E2 V3 freeze and verification

## Current disposition

Founder-authorized canonical freeze is complete locally; independent final-source
verification is pending. Mastery remains disabled. This report will record complete
final CI results before recommending closure of the reference-freeze task.

## Canonical policy

The founder accepted audit branch `task-015-12-knn-portability` at `ab6bed5` and
retained macOS ARM64 as the canonical numerical reference environment. Exact profile:
CPython 3.13.16, NumPy 2.5.4, pandas 3.0.6, Matplotlib 3.11.2, scikit-learn 1.9.1,
SciPy 1.18.1 and threadpoolctl 3.7.0. Fixed seeds and one numerical thread are required.
The generator rejects other platforms for canonical reference generation. Existing
metric tolerance 1e-12 and KNN exact-distance equality tolerance 0.0 are unchanged.

Linux x86-64 is a documented portability limitation. Its KNN geometry matches, but
existing MS-E1 outputs and MS-E2 logistic probabilities differ. No Linux-specific
value, tolerance increase or rounding rule is accepted. The original portability
evidence and every differing leaf remain in the prior audit package/report.

## Approved correction and numerical review

| Fictional row | V2 monthly charge | V3 monthly charge |
| --- | --- | --- |
| E2-00-00 | 40.000001 | 40.0 |
| E2-00-02 | 44.0 | 44.001 |
| E2-06-02 | 74.0 | 74.001 |

The production fixture now exactly matches the accepted proposal. Before writing any
frozen reference, all 972 cases passed again with the accepted decision digest
`b422836c222a9be57c30ebd18b0199ce3db2e025cb33bec818d95e7748bc2034`.
The V3 preview was compared against the accepted in-memory proposal: every non-version
value matched exactly. No unexpected canonical numerical differences were found.

Against V2, the manifest changes 68 leaves: three charges, eight scaler/preprocessing
values, 54 full-precision probabilities, and three version fields. The sealed sidecar
changes only its two version identifiers. [Every before/after value](verification/model-selection-portability/v2-to-v3-output-diff.json)
is recorded for review. Model choices, thresholds, class predictions, confusion
matrices, candidate costs, aggregate metrics and permutation results do not change.
The final selected model remains `tree-p1-t50`. No test target or final result is used
for selection, and learner-facing API responses continue to exclude sealed data.

## Frozen artifacts

Stable `.v1.json` filenames preserve the existing loader schema; internal MS-E2
fixture/manifest/reference/report/lock IDs advance to V3. MS-E1 remains V1.

| Artifact | SHA-256 |
| --- | --- |
| MS-E1 manifest, unchanged | `45dd552560225d23878686359c87ca8176d053199e1e965f053f801ba6a82765` |
| MS-E1 sealed sidecar, unchanged | `e49ab1a1d0e79e37ca930de91d3bb89e4b19817c1250cd10ffbb110f28f6370d` |
| MS-E2 V3 manifest | `7d4a37d2b38a850dc88f1de203c3166fcb2563b58e236c3e048cd9b6f85c7b07` |
| MS-E2 V3 sealed sidecar | `cac4d9d2723ec3aac9161338fc08fa0d5bcc4783e2d499695bbe9655f3abe641` |
| V3 parity report | `acc3801c8610198a51e40bc71e162c28bd7101ee2655a5f7bbe64f4211f2a9d3` |
| V3 freeze lock | `ec4f62bb5564da85dde4bb2ece43f6621bd53460e3e9024cbfc00af8f99cef23` |

## Verification ledger

- Pre-freeze and final-source complete neighbor audit: **972/972 passed**; all 1,044
  live generator KNN visits are covered. Four arithmetic paths and reversed training
  order agree. Minimum relevant separation/tolerance is 8,634,219.687488435 (>100).
- Canonical generator recomputes metrics independently and checks scikit-learn parity.
  Two complete `--check` runs pass byte identity and every locked hash.
- Full local Python suite: **2,612 passed in 13.39s**.
- Local frontend/TypeScript, typecheck/build, two fresh notebook kernels and independent
  final-source GitHub Actions: results pending when this reviewed source was prepared.
- Browser smoke now requires actual ArrowDown/Enter changes in both experiment
  selectors, V3 API values, practice/experiment restoration, prediction/reveal,
  assessment lock, visible Tab focus, and 320px layout. Passing results remain pending.

## Acceptance boundaries

`MASTERY_AVAILABLE=false` is preserved. No mastery activation is authorized by this
freeze. The 20/24 threshold, six paired critical gates, one explicitly confirmed
independent attempt, browser evidence scopes and existing learner records are unchanged.
Screen-reader verification, browser zoom, Google Colab and original-directory I/O
reliability remain separate open platform obligations. No deployment, landing page,
Project Studio, capstone, external learner test or unrelated curriculum change occurs.

Recommendation pending complete CI: retain Task 015.12 as acceptance incomplete;
review the completed canonical freeze and final verification before any later action.
