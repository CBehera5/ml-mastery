# Task 013.4 — pandas completion report

Date:16 October2026. Status: **Implemented and automated verified; submitted for founder review.** This does not close genuine screen-reader, genuine browser-zoom or genuine Google Colab acceptance. No Task013.5 work, deployment, database migration or external learner testing.

## 1. Exact delivered scope

Founder-approved [bounded specification](task-013-4-bounded-implementation-spec.md), approved24 objective IDs and seven critical gates are preserved. Routes: /python/pandas, /python/pandas/d01 through d06 and /python/pandas/mastery. The existing Python hub now discovers pandas alongside Essentials and NumPy.

| Lesson | Teaching / practical ML purpose | Experiment configurations |
|---|---|---:|
| D01 — Labeled Data | Series/DataFrames, schema/nullability, label identity and alignment rather than decorative row numbers. |6 |
| D02 — Aligned Selection | loc/iloc, aligned observation/target masks, ordered features and explicit owned assignment. |6 |
| D03 — Missingness | Missing versus legitimate zero; denominators, retained rows, prescribed fill/drop effects and training-only statistics. |6 |
| D04 — Grouping and Aggregation | Membership, sum/mean/count/size, weighted denominators, explicit category/missing-key policies and causal caution. |8 |
| D05 — Joins and Cardinality | Semantic entity keys, matching pairs/duplicate weights, validation, retained populations and null-key matching. |8 |
| D06 — Reproducible Dataset Audits | Explicit CSV/date/schema policies, named duplicate overlays, prediction-time feature exclusion and provenance/limitations. |6 |

Every lesson includes conceptual motivation/terminology/math recall, worked actual-pandas code and numerical outcomes before practice, changed-condition prediction/reason/reveal, ML application, misconception and targeted recovery. Labeled tables preserve row/index/column/dtype semantics and provide wrapping row-text alternatives. D06 first displays the16-row canonical source and source hash; duplicate-ID overlays and retained subsets are explicitly distinguished from that source.

The D04 causal experiment exposes different pooled means despite equal within-size-band means. Both output and interpretation are assessed; correct arithmetic with a causal overclaim fails D04.O4. This objective remains essential/noncritical under the approved policy, not a silently added eighth gate. The existing Statistics observational/intervention experiment is linked rather than duplicated.

Six experiments expose40 finite reference-backed configurations. Merely switching between duplicate authored traces is not a meaningful change: the controller compares actual code/output, requires changed conditions plus a correct prediction and bounded explanation, and never awards mastery. This safeguard was strengthened during verification; test setup now makes an actual change rather than relying on a different configuration ID.

## 2. Objective and exercise coverage

**24 essential families;48 practice instances;72 independent instances across three24-family forms.** Each family has one worked reference, two practice and three independent instances. C denotes one of the exact seven paired critical gates. Teaching/outcome/misconception/remediation metadata come from the approved matrix, not newly invented objectives.

| Objective | Measurable teaching objective | Coverage | Understanding check | Targeted remediation |
|---|---|---|---|---|
| D01.O1 **C** | Predict label alignment and preserve row identity. |1 worked;2 practice;3 independent | Diagnose an incorrect position-based Series sum and explain matching labels. | Draw index-to-value mappings before adding. |
| D01.O2 | Read shape, columns, index and dtypes from a small table. |1 worked;2 practice;3 independent | Select a valid feature schema after inspection. | Use the metadata panel, not visual row numbers. |
| D01.O3 | Distinguish a Series selection from a one-column DataFrame. |1 worked;2 practice;3 independent | Predict dimensions after single versus list-of-column selection. | Compare df['area'] with df[['area']]. |
| D01.O4 | Identify nullable numeric/string data without inventing zeros. |1 worked;2 practice;3 independent | Choose field types and missing-value markers for a new table. | Review explicit schema/nullability definitions. |
| D02.O1 | Predict .loc and .iloc values with nontrivial indexes. |1 worked;2 practice;3 independent | Select the exact resulting rows from a changed index. | Label positions separately from index values. |
| D02.O2 **C** | Apply the intended filter to aligned observations/targets. |1 worked;2 practice;3 independent | Repair a misaligned or inappropriate cohort mask and justify retained IDs. | Compare the mask index with the table index. |
| D02.O3 | Select columns without silently changing feature order. |1 worked;2 practice;3 independent | Choose the ordered model input columns. | Match the downstream coefficient names. |
| D02.O4 | Use explicit .loc assignment or .copy() under the pinned pandas behavior. |1 worked;2 practice;3 independent | Choose a repair without relying on chained assignment side effects. | Trace the deliberately owned frame and resulting values. |
| D03.O1 **C** | Detect missingness without discarding valid zero values. |1 worked;2 practice;3 independent | Repair a truthiness-based missingness rule and explain zero retention. | Use isna masks beside original values. |
| D03.O2 | Compute missingness counts/rates with the correct denominator. |1 worked;2 practice;3 independent | Select the count and fraction for a changed column. | Count all eligible rows before dividing. |
| D03.O3 | Predict fillna/dropna effects on values and shape. |1 worked;2 practice;3 independent | Choose the resulting table after a stated policy. | Compare retained row IDs and replacement values. |
| D03.O4 | Separate exploratory filling from training-fitted preprocessing. |1 worked;2 practice;3 independent | Reject whole-dataset median fitting before a split. | Revisit the earlier Statistics leakage lesson and the local fit-boundary explanation; T02 is an optional later extension, not a prerequisite. |
| D04.O1 | Predict an explicitly configured groupby aggregation. |1 worked;2 practice;3 independent | Select grouped sum/mean values for a changed table. | List membership before calculating. |
| D04.O2 **C** | Use correct group denominators and distinguish size from count. |1 worked;2 practice;3 independent | Reject a mean-of-means or missing-count error and explain the denominator. | Reconstruct sum and count for each group. |
| D04.O3 | Handle missing keys and category inclusion explicitly. |1 worked;2 practice;3 independent | Choose the result under stated dropna/observed settings. | Compare groups included versus excluded by the policy. |
| D04.O4 | Avoid causal conclusions from group differences. |1 worked;2 practice;3 independent | Identify a confounding-compatible interpretation. | Return to the Statistics observational/intervention experiment. |
| D05.O1 **C** | Choose valid join keys and an explicit matching contract. |1 worked;2 practice;3 independent | Diagnose an inappropriate key and justify a stable entity ID. | Inspect uniqueness, meaning and missing keys. |
| D05.O2 **C** | Predict duplication/loss and reject unexpected many-to-many joins. |1 worked;2 practice;3 independent | Choose row count/matches and a validate repair. | Draw the matching pairs, then count multiplicities. |
| D05.O3 | Distinguish inner from left join and inspect unmatched rows. |1 worked;2 practice;3 independent | Select retained IDs plus an indicator result. | Compare the requested population before/after joining. |
| D05.O4 | Recognize that pandas null-key matching needs explicit handling. |1 worked;2 practice;3 independent | Reject an assumed SQL-style nonmatch for null keys. | Inspect the pinned merge null-key fixture. |
| D06.O1 | Inspect bundled CSV types, dates and missing markers deterministically. |1 worked;2 practice;3 independent | Select an explicit loader/parse rule and schema mismatch. | Compare raw strings with the declared schema. |
| D06.O2 | Report duplicates/missingness/group counts using row identities. |1 worked;2 practice;3 independent | Choose a reproducible small-table audit summary. | Revisit D03–D05 counts and key checks. |
| D06.O3 **C** | Exclude targets and unavailable-at-prediction columns from features. |1 worked;2 practice;3 independent | Identify target/future leakage and justify the timing boundary. | Build the feature-availability timeline. |
| D06.O4 | Produce a bounded audit record with provenance and limitations. |1 worked;2 practice;3 independent | Select the complete report fields rather than an unsupported population claim. | Use the dataset manifest and exact retained IDs. |

All120 scored cases plus24 worked cases are frozen in packages/python-contracts/fixtures/pandas-learning.v1.json. All144 are recomputed against actual pandas in Python tests; TypeScript tests connect each scored definition to the same code/outcome/reason and validate every accepted tuple. All40 exposed experiment configurations resolve to these verified references.

## 3. Mastery, critical gates and retries

One point per completely correct family. **Pass = at least20/24 AND every critical family correct, including both decision/repair and reasoning, in one confirmed attempt.** Gates: D01.O1 alignment; D02.O2 aligned features/targets; D03.O1 missing versus zero; D04.O2 denominators; D05.O1 meaningful keys; D05.O2 cardinality; D06.O3 prediction-time features.

Actual three-form tests cover19/24 failure,20/24 success,21/24 and24/24, plus42 otherwise23/24 single-component gate failures (7×2×3). No cross-attempt union, partial-credit compensation or imported mastery. Passing attempts award the module and only correctly demonstrated objectives; missed noncritical objectives remain unmastered. Failed attempts award none and do not erase earlier same-version mastery.

Practice allows two valid submissions per A/B variant per persisted review cycle. Invalid payloads do not consume submissions. Exhaustion requires targeted review and correct changed-case recall before reopening. A lesson requires four correct practice families and meaningful explained activity, not self-attestation.

Independent flow: active → complete review → explicit confirmation → results. Blanks count wrong only after confirmation; malformed submissions do not score/advance. Review reload restores active answers and requires confirmation again. Unlimited fresh A/B/C retries; latest20 compact summaries/latest full submission retained. Duplicate confirmation is idempotent. There is no answer-by-answer correctness before confirmed submission. Results include failed objective, explanation/worked correction and direct recall links. The verified complete catalog explicitly releases mastery for this content version.

## 4. Deterministic evaluator and safety evidence

Reused unchanged shared finite evaluator, scorer, response/evidence contracts and AnswerInput. Additive pandas-local catalog/controller follows the established module pattern; no broad refactor or new dependency.

Learner answers are finite choices and predefined repair slots; existing finite numeric/tolerance behavior remains tested. D05.O2 accepts only reviewed whole repair tuples: many_to_one or its m:1 alias, together with rejection/investigation of conflicting right keys and the correct explanation. Real pandas parity proves both aliases agree on valid and conflicting lookups; permissive many_to_many is a counterexample, not a correct repair. Slot order may vary but duplicates/unknowns/incorrect combinations reject or grade wrong as appropriate. Numeric tolerance remains absolute1e-9 plus relative1e-9; no Boolean/string coercion or missing-to-zero equivalence.

Strict kind/ID/version/key validation and resource bounds reject oversized/deep/malformed/foreign/prototype payloads safely. No learner-supplied source reaches exec/eval/imports, expression interpretation, method dispatch, filesystem, network, shell or uploads. The offline reference author tool executes only fixed repository-authored snippets; it is not a public endpoint or learner-code service. Notebook trusted code is likewise separate from platform grading.

Traces explicitly preserve labels/order/schema/nullable and string storage, ISO dates, named errors and missing/nonfinite tags. Bounds:32×8 tables,120-character cells,25-line/4KiB snippets,≤64 configurations/activity,≤2 atoms/family,512-byte atom,1.5KiB family,64KiB submissions and256KiB persistence. Choice labels may contain larger authored reference JSON; that text is not accepted as arbitrary learner code or a general JSON-answer language.

## 5. Persistence and preservation

New isolated key ml-math-lab:python:pandas:v1, schema1; content python.pandas.1.0.0; assessment/mastery python.pandas.mastery.v1. No old evidence transfer, rescoring or migration. Future incompatible records remain untouched with saving disabled until an explicit compatibility decision.

Tests cover hydration/restoration, practice/recovery counters, review reload, idempotence, bounded history, invalid/corrupt/oversized/future/foreign records, quota/read failures, optimistic stale-write rejection, lesson/module reset isolation and preservation of earned mastery. A lesson reset cannot clear independent mastery. Storage errors distinguish in-memory work from persisted state.

Baseline SHA audit: **305/306 pre-existing protected files byte-identical; sole changed file apps/web/app/python/page.tsx adds discovery.** Existing Math, Regression, Essentials/P01, NumPy, shared evaluator/evidence, dependency manifests and original notebooks remain unchanged. See outputs/task-013-4/verification/preservation.json. All pandas sources/contracts/notebook/tests are additive. Browser QA used a separate3027 origin, not founder3024 or earlier module QA origins.

Local storage remains user-editable/origin-local, not authenticated evidence, account synchronization, tamper-proof grading or distributed CAS.

## 6. Automated verification

| Verification | Result / retained evidence |
|---|---|
| Complete frontend/TypeScript regression suite, npm test |395 passed across65 files; outputs/task-013-4/verification/frontend.log |
| New pandas frontend/controller/readiness tests |14 tests across3 files, including all120 instances,40 states, all three mastery boundaries and42 gate-component scenarios inside test loops |
| Complete Python regression suite |491 passed; outputs/task-013-4/verification/python.log |
| New pandas Python/reference tests |155 passed, including144 parameterized cases and safety/anchor/equivalence/normalization/provenance tests |
| Type checking, npm run typecheck |Passed; verification/typecheck.log |
| Production build, npm run build |Passed; verification/build.log; pandas overview/mastery and all6 lesson routes generated |
| Local notebook |Two fresh kernels; all24 objective assertions and analytic anchors passed; notebook/report.json |

Python command used the existing isolated approved interpreter with PYTHONPATH=python and pytest; no packages installed or application environment changed. Tests include the existing mathematical runtime/parity and all earlier modules, not only pandas. No unresolved regression failures. Intermediate tests correctly exposed a configuration-ID-only interaction assumption; it was corrected without changing any mastery threshold or gate.

## 7. Browser and accessibility verification

Production preview on127.0.0.1:3027, isolated test evidence only. Scoped native keyboard checks cover links, radios/Space, predefined selects, experiment reveal/feedback focus, horizontally scrollable table/ArrowRight, wrapping row-text disclosure/Enter, assessment review/confirmation, retry and result focus. D01 changed label/missingness, D04 pooled/conditional causal explanation and D05 duplicate-cardinality experiments were exercised live; all six lesson completion journeys additionally pass frontend tests.

At320px, checked all six lesson routes plus overview/assessment active/review/results. D06's long source hash and slash-separated objective heading required wrapping; scoped wrapping fixes both without altering shared styles. Wide tables/code remain intentional focusable local scrollers with wrapping alternatives rather than page overflow. Browser evidence/report.json records final checks. Actual live assessment A:23/24 failed because D05.O2 reason was wrong despite a valid equivalent repair. Reload restored reviewed answers requiring fresh confirmation. Fresh B:24/24 passed. Reload restored mastery/history; blank C:0/24 failed without erasing earlier mastery. Corrected practice and activity survived reload.

**OPEN / NOT VERIFIED:** genuine screen-reader speech/navigation; genuine200%/400% browser zoom; genuine Google Colab. DOM/AX snapshots, viewport resizing and local kernels do not verify these. Broader contrast/spacing/targets/motion/device/AT acceptance is not claimed. No external learner testing.

Screenshot: outputs/task-013-4/browser/mastery-320.png (isolated test-origin result, not founder learner mastery).

## 8. Notebook reproducibility

apps/web/public/notebooks/python-pandas.ipynb is self-contained with original fictional data, manifest/source hash, unique H01–H16, fixed train/test IDs and named derived fault overlays. No credentials, uploads, Drive mount, remote data, paid service or automatic package installation. Explicit supported local version preflight;24 predict-before-run sections/asserted traces and four analytic anchors; seed42 metadata, no random grading.

Tested macOS15.6.1 ARM64, CPython3.13.16, NumPy2.5.4, pandas3.0.6, Matplotlib3.11.2, scikit-learn1.9.1, nbclient0.11.0, nbformat5.11.1, ipykernel7.4.0. Version strings refer only to the existing tested environment, not current availability/security certification or cross-host compatibility.

Notebook SHA-256: c5cff6152e81e1201e7c3976f6eefcaba7b0ac9e51338c907a75b2aa9aa8d962.
Matching normalized output SHA-256: c88386bc7d17446de70436c891578ea6ad09d1b4c427b4a4611b57c9d01e7fac.

Runner python/notebook_checks/verify_python_pandas.py records two fresh clean-directory kernels and matching normalized results.60-second per-cell timeout; notebook asserts runtime<300seconds, observed maxRSS<2GiB and summary<1MiB. These are trusted notebook checks, not OS-level memory containment or an arbitrary execution sandbox. Existing local Jupyter unencrypted-transport and sandbox sysctl/cleanup permission warnings are retained in notebook.log; execution/assertions/output matching completed. Genuine Colab remains unverified, with no silent substitute dependency profile.

## 9. Deviations, remaining risks and next readiness

No curriculum expansion, new gate, threshold weakening, protected evidence migration, arbitrary learner execution, dependency installation, DB change, deployment or later module implementation. The local controller pattern is reused additively rather than prematurely generalized. D04 causal two-atom grading strengthens its approved objective without making it critical.

Remaining risks: finite/client-visible recognition banks, repeated reasoning labels and uneven variant difficulty; exact pinned pandas semantics need deliberate review before dependency upgrades; local persistence is not high-stakes evidence; broader pedagogical/assistive-technology validation remains open. Genuine Colab is a separate gate, not inferred from local success. These are tracked in the cumulative quality register, accessibility blockers and Task017 backlog.

Updated implementation totals20/36 lessons,80/144 families,21/41 gates,3/6 module assessments and3/6 full module notebooks. **Recommended next milestone: verify Task013.5 Visualization scope and prerequisites against approved documents, then seek/receive founder implementation authorization.** Do not start it now. Stop for founder review of Task013.4.
