# Task 013.3 — NumPy for Machine Learning

16 October 2026. **Implementation complete and automated verified; scoped browser verification, not full accessibility, Colab or learner-validity acceptance.** Founder approved the complete six-lesson boundary. No pandas/Task013.4 work.

## 1. Lessons and objective coverage

| Lesson | O1–O4, in order | Mandatory critical family |
|---|---|---|
| N01 Arrays describe data and shape | List versus array arithmetic; observation/feature axes and shape/ndim/size; reshape element counts and row meaning; numeric dtype/truncation. | N01.O2 |
| N02 Indexing, masks, views and copies | Integer/slice shapes and values; paired observation masks; shared views/independent copies; parenthesized array conjunction versus scalar and. | N02.O1 |
| N03 Broadcasting is shape reasoning | Trailing-axis compatibility; intended row/feature orientation; outer-style sum grid; justified reshape versus rejection. | N03.O2 |
| N04 Vectorized predictions | Contributions; ordered Xw+b with one bias per row; residual sign/target identity; loop equivalence without speed grading. | N04.O2 |
| N05 Matrix multiplication and transposes | Inner-dimension compatibility; * versus @/matmul; transpose/coordinate meaning; composition order and inappropriate inverse shortcuts. | N05.O2 |
| N06 Reductions, missingness and numeric limits | sum/mean axis/keepdims; denominator/ddof/units; zero/missing/all-missing; nonfinite results despite finite inputs. | N06.O2 |

Exactly24 essential objective families,48 practice instances,72 independent instances across three complete forms, six paired critical gates and one reproducible full NumPy notebook. Canonical IDs python.numpy.n01.o1 through python.numpy.n06.o4. No new introductory objective or later-module operation.

Each lesson supplies motivation, mathematical notation/terminology, explicit mental-model paragraphs, worked numerical/coordinate examples, changed cases, ML consequences, misconceptions, success criteria and targeted remediation before independent assessment. Shapes and dtype remain explicit; coordinate tables expose numerical alternatives rather than relying on color/animation. N04 explains coefficient/baseline units and residual convention; N06 explicitly warns that averaging unlike feature units may be meaningless.

Routes /python/numpy, /python/numpy/n01–n06 and /python/numpy/mastery are additive. /python hub adds discovery. Prerequisites are backward recall, not hard route/mastery locks. Existing Essentials and Mathematics evidence cannot satisfy NumPy objectives.

## 2. Experiments and assessments

Six experiment panels, each with six reviewed configurations: **36 states total**. Four worked operation states plus two changed critical cases per lesson cover metadata/reshape/conversion, indexing/masks/views/copies, broadcasts, contributions/predictions/residuals, products/transposes/order, and reductions/ddof/missingness/finite checks.

Learner predicts before reveal, changes configuration and chooses the matching mechanism. Reveal displays source, coordinate tables, exact shape/dtype/ordered values and explanatory text. Equivalent mechanism text is deduplicated; reason options do not advertise the matching configuration ID. All36 states resolve actual frozen reference cases. No arbitrary control combinations or operation interpreter.

Practice supports two valid submissions on each A/B variant, persisted exhaustion, worked correction and correct changed-case recovery into labeled unlimited review cycles. Lesson completion needs all four practice passes and a changed, correctly predicted/explained experiment; neither completion nor notebook use awards mastery.

Independent assessment uses one family per objective on each of A/B/C, with no correctness feedback until review and separate confirmation. Results disclose score, failed gates, worked corrections/reference responses and targeted lesson recall. Review reload becomes active and requires reconfirmation. Unlimited retries rotate forms; no answer mosaics or threshold reductions.

## 3. Mastery and critical-gate verification

**Pass = at least20/24 AND all six critical families correct in the same confirmed attempt.** Both decision/calculation/repair and reason/counterexample must pass each critical family. No partial-credit compensation. A failed attempt awards no mastery; a passing attempt awards the module and only independently correct objectives. Later failures, lesson resets and bounded history retention preserve previously earned same-version mastery.

All three real forms tested at19,20,21,24 correct;19 fails and20 passes only with every gate. Each of the six gates×two components×three forms produces **36 otherwise23/24 failing scenarios**. Complete form coverage, duplicate/missing-family rejection, confirmation and idempotent submission are tested. Synthetic in-memory tests never write learner localStorage. Production mastery is released only with complete catalog coverage and explicit verification release.

## 4. Trusted reference parity and evaluator boundary

packages/python-contracts/fixtures/numpy-learning.v1.json contains144 cases:24 worked+48 practice+72 independent. python/mlmath/numpy_learning_reference.py computes actual NumPy2.5.4 outcomes for enumerated author-only lesson/objective/amount configurations. All144 are checked against frozen outputs; all120 scored instances and all36 experiment states are mapped in TypeScript tests.

The author oracle rejects arbitrary strings, Booleans-as-integers and unknown/out-of-bound configurations. Its executed source is fixed repository-authored code, not learner source or a production endpoint. Browser only resolves immutable data fixtures, using unchanged finite choice/number/predefined-slot contracts, grader, whole-tuple equivalence and module scorer.

Arrays preserve exact rank/shape/dtype/ordered cells. Rank0–2, dimensions≤32/cells≤64; oversized/unsupported arrays reject. Missing cells use explicit missing tags, division-by-zero outputs explicit nonfinite tags and failed operations explicit error/class tags; no raw JSON NaN/Infinity or fabricated zeros. N06 uses approved float64 nonfinite diagnostics, not unapproved narrow-dtype overflow experiments. No clip, general solver, arbitrary ufunc/import dispatch, expression parser, learner execution, filesystem/network/shell/upload API or performance grading.

N05.O2 accepts two complete verified repairs, A@w or np.matmul(A,w), only with contracted-row meaning and the correct explanation. Mixed wrong tuples, duplicate/partial/unknown slots and malformed representations reject. Real NumPy verifies both equivalent products and the different elementwise shape. Reused numeric tolerance is inclusive abs1e-9+rel1e-9; Boolean/numeric-string/nonfinite coercion is rejected. Finite answer choices preserve exact shape/type identity, never flattening (m,) into (m,1).

## 5. Persistence and preservation

Separate key ml-math-lab:python:numpy:v1, schema1/content python.numpy.1.0.0/assessment python.numpy.mastery.v1, with approved policy/reference environment. No P01/Essentials/Math imports, migrations, old-key changes or mastery reinterpretation.

Proven module-local controller pattern adapted to24 families; original Essentials controllers/evaluator/evidence remain unchanged. Hydration precedes writes; strict bounded canonical validation checks scope/version/IDs/drafts/counters/evidence consistency. Review reload reconfirms, submitted IDs are idempotent, latest20 compact histories/latest full submission remain bounded while mastery persists. Corrupt/future/foreign/noncanonical/duplicate/oversized records remain untouched with visible saving-disabled fallback. Quota/denied/stale-tab failures preserve earlier durable bytes and identify memory-only work. Resets are explicitly confirmed and scope-local.

Preservation audit **289/290 protected pre-existing files byte-identical**. Sole protected change is Python hub discovery/status copy. All prior Essentials/P01 controllers/content/scoring/storage/transition, Math/Regression lessons/runtimes/evidence, old notebooks and application dependency manifests remain byte-identical. Artifact outputs/task-013-3/verification/preservation.json records before/after hashes. Documentation updates do not change prior objective/mastery semantics.

## 6. Automated verification

| Check | Final result |
|---|---|
| Full frontend/TypeScript | **381 tests passed in62 files**: existing368+13 new. |
| Full Python regression | **336 passed**: existing183+153 new, including144 parameterized reference cases. |
| Typechecking | PASS: mathematical runtime and web. |
| Production build | PASS: mathematical runtime plus Next16.4 optimized routes. |
| Correctness/parity |144 real NumPy cases; all120 scored instances/all36 experiment states; equivalent products, meaningful same-shape broadcast counterexample and view/copy properties. |
| Assessment | Three forms; exact/one-below boundaries;36 critical-component failures; no cross-attempt/automatic mastery. |
| Persistence | Restoration, confirmation/idempotence, history pruning/mastery retention, partial drafts, counters/recovery, quota/denied/corrupt/future/foreign/noncanonical/stale/reset isolation. |
| Frontend | Every lesson practice/activity completion and reload; no completion mastery; review/failure/retry/pass/restoration/focus; existing scopes preserved on reset. |

Logs: outputs/task-013-3/verification/{frontend,python,typecheck,build,notebook}.log. Existing Math/Regression/Essentials regressions pass; no regression was waived or threshold weakened.

During implementation, an initial schema initializer/type mismatch and a test-only union indexing error were corrected before final verification. Cell IDs were added to the new notebook. An optional IPC kernel-start experiment did not complete and was interrupted; final evidence uses the unchanged approved local execution profile/standard local kernel transport. No alternative dependency profile installed.

## 7. Notebook reproducibility

apps/web/public/notebooks/python-numpy.ipynb is self-contained: embedded original fictional H1–H3 house records, local manifest with schema/units/IDs/provenance/data SHA256,24 canonical objective assertions, predict-before-run prompts and safe private changed-case suggestions. This is a module-local miniature dataset, not a claim to deliver the later full16-row train/test bundle or capstones.

Numerical anchors verified: predictions[230,140], matrix product[12,34], feature means[2,15], population/sample variance1/2. Two fresh local kernels in separate working directories agree on all normalized results; no hidden state, missing variables or crashing TODOs. Seed42, explicit dtypes/axes/ddof/order, thread bounds and exact preflight recorded.

Tested local profile only: macOS15.6.1 ARM64, CPython3.13.16, NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1. Other libraries are version preflight only, not implemented modules. No dependency installation/upgrade, credentials, uploads, paid service or remote dataset calls.

Notebook SHA256 **a65e02e8f96ad3862072c7f3fac8ad44e450bdfb9033ae1ae4baeeb30a3f69aa**; normalized result SHA256 **49eef2ab6fd4a8fbe3c6100fe976378ed956b547e40fd9a5a74a54c0bcbedff1**. Artifacts outputs/task-013-3/notebook/report.json and run-1/run-2 executed.ipynb/results.json; fixed-path author-only runner python/notebook_checks/verify_python_numpy.py.

Local kernel logs contain the inherited transport warning and macOS psutil/sysctl child-cleanup permission warning; assertions/run outputs pass and runner exits0. This is not hardened OS isolation, enforced memory containment or an external execution service. Per-cell timeout60seconds and canonical runtime-under300seconds assertion are present. Genuine Google Colab remains **OPEN / NOT VERIFIED**; no Linux/Windows/Colab execution claim.

## 8. Scoped accessibility/browser findings

Isolated production QA origin127.0.0.1:3026; founder origins3024/3025 evidence not edited. All six final-build lesson layouts measure document clientWidth=scrollWidth=320. Assessment active/review/results and changed experiment also fit320px; source code has named focusable horizontal scrollers and labeled numerical coordinate alternatives.

Keyboard Enter navigation, Space radio/consent, native selects, explicit confirmation, reveal/review/result focus and sequential Tab progression through navigation, prerequisite recall, source, tables and practice verified. Native horizontal code scrolling verified at320px with focus retained. No drag, hover, animation or timing dependency.

Live journey: formA23/24 fails N03.O2 reasoning despite correct numeric decision; reload restores failure; targeted broadcasting lesson gives specific wrong-reason feedback, practice correction and changed explained experiment; both restore. Fresh formB24/24 passes and restores same-version mastery/history. Review reload returns formC to active for reconfirmation; later blank0/24 fails without erasing formB mastery. Screenshot/report artifacts in outputs/task-013-3/browser. Temporary viewport override reset.

**OPEN / NOT VERIFIED:** genuine screen-reader speech/navigation, actual200%/400% browser zoom, genuine Colab, broader supported-device/AT/spacing/contrast/target/motion acceptance. AX/DOM, coordinate tables and320px are not substitutes for those checks.

## 9. Remaining risks and next-task readiness

Finite fixtures/client-visible answers and recurring reasoning labels remain memorization risks. Bounded trace/repair recognition does not establish unrestricted programming fluency; expert correctness does not establish learner transfer or form-difficulty equivalence. localStorage is origin-local, inspectable and optimistic, not account sync, tamper-proof or multi-writer CAS. New assessment semantics/profile changes require explicit versioning/review; old evidence stays old-scoped.

Task013 totals14/36 lessons,56/144 families,14/41 gates,2/6 module assessments and2/6 full notebooks. NumPy implementation is ready for founder review, not full reference/launch acceptance. Next candidate013.4 is pandas; verify its approved six-lesson specification and dependencies before separate implementation authorization.

No deployment, external learner testing, database migration, capstone, commercial change, alternative dependency profile, arbitrary learner execution, pandas or later-module implementation. **Stop after013.3 and await founder review.**
