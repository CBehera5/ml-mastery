# Task 013.4 pandas implementation specification

Status: **Founder approved and authorized; implemented for founder review,16 October2026.** The exact bounded scope below governs the implementation. See [completion/coverage evidence](TASK_013_4_COMPLETION.md). Genuine screen-reader, browser zoom and Colab remain open. Earlier future-tense authoring/verification language below is the approved specification, not a claim that these deliverables are still absent. No Task013.5 authorization is implied.

## 1. Approved boundary and source authority

The [Task013 blueprint](task-013-python-ml-blueprint.md), section7, explicitly allocates013.4 to six pandas lessons with labeled/missing/join fixtures, notebook, mastery and module-local tests. The [lesson/objective matrix](task-013-lesson-objective-matrix.md), pandas section, defines D01–D06 and all24 objectives. The [mastery/evaluator specification](task-013-mastery-and-evaluator-spec.md), [approved policy matrix](task-013-founder-policy-decision-matrix.md) and [acceptance criteria](task-013-acceptance-criteria.md) govern grading, bounds, evidence and verification.

[Architecture](ARCHITECTURE.md), [quality register](CURRICULUM_QUALITY_REGISTER.md) and [Task013.3 completion](TASK_013_3_COMPLETION.md) establish the protected implemented baseline: Essentials, NumPy, Mathematics and Regression. Historical pending-policy/earlier-milestone wording in these documents does not reverse subsequent founder approvals.

| Deliverable | Verified requirement |
|---|---:|
| Lessons |6, D01–D06 |
| Objective families |24, all essential; four per lesson |
| Practice |48 instances, two per objective |
| Independent assessment |One module assessment, three complete24-family forms;72 instances |
| Total scored instances |120 |
| Mandatory critical gates |7, each with two AND-graded components |
| Experiments |At least one meaningful activity per lesson: at least6 |
| Full module notebook |1 reproducible pandas notebook |

Per lesson:8 practice instances and12 independent instances. Exact experiment configuration counts and additional worked-reference record counts are authoring deliverables, not invented fixed totals; each activity stays within the approved64-configuration maximum.

## 2. Lessons, objectives and prerequisites

Canonical IDs are python.pandas.d01.o1 through python.pandas.d06.o4. O1–O4 below correspond exactly to the approved matrix. C means mandatory critical; all other objectives remain essential/noncritical.

| Lesson | Four measurable objectives O1–O4 | Prerequisite recall |
|---|---|---|
| D01 Series, DataFrames and labeled data | **O1 C:** Predict label alignment and preserve row identity. **O2:** Read shape/columns/index/dtypes. **O3:** Distinguish a Series from a one-column DataFrame selection. **O4:** Identify nullable numeric/string values without invented zeros. | P02,P08,N01 |
| D02 Selecting and filtering without losing alignment | **O1:** Predict loc/iloc under nontrivial indexes. **O2 C:** Apply intended aligned observation/target filters. **O3:** Preserve ordered feature columns. **O4:** Repair assignment using explicit loc/owned copies, not chained-assignment side effects. | D01,N02,P03 |
| D03 Missing values require a stated policy | **O1 C:** Distinguish missingness from legitimate zero. **O2:** Calculate missing counts/rates with the right denominator. **O3:** Predict stated fill/drop effects on values/rows/shape. **O4:** Reject whole-dataset preprocessing-statistic fitting before a split. | D01–D02,N06; Statistics leakage recall for O4 |
| D04 Grouping, aggregating and reporting denominators | **O1:** Predict configured grouped sum/mean. **O2 C:** Explain correct denominators, size/count and weighted overall summaries. **O3:** Apply explicit missing-key/category inclusion settings. **O4:** Reject causal conclusions unsupported by group differences. | D02–D03; Statistics means/causation recall |
| D05 Joins can duplicate or lose observations | **O1 C:** Select semantically valid keys and an explicit entity matching contract. **O2 C:** Predict matches/duplication/loss and reject unexpected cardinality. **O3:** Distinguish inner/left populations and unmatched indicators. **O4:** Recognize pinned pandas null-key matching rather than assuming SQL-style nonmatches. | D01–D04 |
| D06 A reproducible dataset audit | **O1:** Inspect bundled CSV types/dates/missing markers deterministically. **O2:** Report duplicates/missingness/group counts using identities. **O3 C:** Exclude targets and unavailable-at-prediction features. **O4:** Produce a bounded audit record with provenance and limitations. | D01–D05,P08; Statistics leakage recall |

These are recommended learning dependencies, not hard navigation or assessment locks. D03 gives a local fit-boundary explanation; later T02 is optional extension, not a prerequisite. No prior Essentials/NumPy/Math mastery is imported as pandas evidence.

Every objective maps to its lesson's explanation/worked example, A/B practice family, A/B/C independent family and matrix-defined remediation. No required concept is covered solely by prose or notebook download.

## 3. Pedagogical design and experiments

Each lesson begins with why the operation matters, then labeled data intuition, terminology, worked numerical examples, a controlled changed case, ML consequences, misconception feedback and objective checks. State original/retained IDs, index versus position, feature order, dtypes, missingness and denominators before compact syntax.

| Lesson | Prediction-before-reveal experiment | Worked anchor and remediation focus |
|---|---|---|
| D01 | Reorder two Series and remove one label; inspect aligned results, missingness and schema. | rowA/rowB sums21/12 despite reversed positions; draw label→value maps. Compare df['area'] versus df[['area']]. |
| D02 | Compare loc/iloc with nontrivial/reordered indexes, aligned Boolean masks and an owned assignment repair. | Labels10/20/30 versus positions0/1/2; justify retained row/target identities and column order. Same length alone is insufficient. |
| D03 | Compare preserve/drop/declared-fill policies and retained IDs; distinguish exploratory replacement from a training-only statistic. | Ages[0,missing,20] have one missing value; declared observed-median10 yields[0,10,20]. Display count/rate denominators and fit-row provenance. |
| D04 | Reconstruct group membership/sums/size/nonmissing count; vary missing keys/category policy and compare weighted versus unweighted summaries. | A:[10,20], B:[100] gives means15/100, global130/3, not57.5. Include a confounding-compatible interpretation and recall the existing Statistics causal experiment. |
| D05 | Inspect individual matching pairs before toggling inner/left, duplicate/null keys and cardinality contracts. | Left[A,B], right[A,A]: left3 rows, inner2. Explain implicit reweighting, lost observations, unmatched indicators and explicit validation. |
| D06 | Trace a named faulty-data overlay through loading, inspection, schema/date/duplicate/missing/target checks into an audit record. | Report actual IDs and prediction-time availability; successful loading/describe is not model readiness. |

All controls resolve finite authored states, not arbitrary DataFrame commands. Each state includes an accessible before/after table or textual equivalent, row counts/IDs, schema and a mechanism explaining why the result changes. Meaningful changed input plus correct prediction/explanation is required; mere reveal, copying, download or self-attestation is not completion.

D04.O4 remains assessed essential/noncritical under the approved seven-gate policy. Teach correlation/group differences versus causation explicitly without silently adding an eighth pandas gate or rebuilding the Statistics causal engine.

## 4. Critical mastery, retries and remediation

Pass requires **at least20/24 correct and every one of the seven critical gates in a single confirmed independent attempt**. One point per complete family; both its decision/repair/calculation and reason/counterexample must be correct. No partial-credit compensation, cross-attempt union, imported mastery or automatic completion award.

| Critical family | Failure trigger | Required targeted recovery |
|---|---|---|
| D01.O1 | Treat label alignment as positional addition or lose row identity. | Draw label→value matching before recomputing. |
| D02.O2 | Apply an incorrect cohort or misaligned feature/target mask. | Compare original, mask and retained row IDs. |
| D03.O1 | Treat zero as missing or a missing sentinel as an observed zero. | Inspect original cells beside isna masks. |
| D04.O2 | Confuse row size with nonmissing count or average unequal group means blindly. | Rebuild each sum/count and the weighted overall denominator. |
| D05.O1 | Use an inappropriate entity key or omit its matching contract. | Check key meaning, uniqueness and missingness. |
| D05.O2 | Accept unexpected duplication/loss or many-to-many matches under a stricter requirement. | Enumerate matching pairs, count multiplicities and repair validation. |
| D06.O3 | Include the target or future/unavailable features. | Draw the prediction-time information-availability timeline. |

Wrong or unanswered reasoning fails a gate even with a correct numerical answer. Results must name the failed objective, explain the misconception, show a worked correction/counterexample and link directly to remediation.

Practice: two valid submissions per A/B variant per persisted review cycle; invalid payloads consume none. Exhaustion requires targeted review plus correct changed-case recall to reopen a labeled cycle. Lesson completion needs four demonstrated practice families plus meaningful explained experiment evidence.

Independent: active→review→explicit confirmation→results, no per-answer correctness before confirmation; unlimited A→B→C rotation with fresh attempt identities. Blanks count wrong; malformed payloads reject without scoring/advancing. Review reload restores active/reconfirmation. A failed module attempt awards no mastery. A passing attempt awards only the module and independently correct objectives; missed noncritical objectives remain unmastered. Later failure/resetting lesson practice/history trimming does not erase same-version mastery.

## 5. Evaluator allowlist and safety

Reuse the existing finite choice, finite numeric and predefined repair-slot contracts, strict validation, whole-tuple equivalents, scorer and module-local evidence patterns. Ordered output/shape/schema/ID alternatives can use finite choices and slots; no new general answer grammar is needed.

Approved authored/fixture-backed pandas operations:
- Series/DataFrame construction and explicit schemas; shape/index/columns/dtypes; normalized head/info/describe fields.
- Declared bundled/embedded read_csv recipes and bounded explicit to_datetime rules.
- Column selection, loc/iloc, named Boolean masks and explicit owned assignment/copy.
- isna/notna, prescribed fillna/dropna; duplicated/drop_duplicates and declared sorting.
- groupby sum/mean/count/size/agg with explicit sort/dropna/observed/category choices.
- Inner/left merge with explicit on/how/validate/indicator; finite one_to_one/one_to_many/many_to_one/many_to_many contract choices. An explicit many-to-many contract does not prove that duplication is appropriate for the task.

For each fixture freeze index/column/row order, schema/dtype category, nullable/string storage and missing-value policy, categories/order, date format/error policy, group options and join order/cardinality/null handling. Verify pinned copy/assignment semantics, not an old pandas warning or guessed NumPy/SQL behavior. Exact defaults must be visible or supplied explicitly; no opaque repr grading.

Bound tables to32 rows×8 columns; strings≤120 characters/cell; any NumPy bridges retain rank0–2/dimension≤32/cells≤64. At most64 reviewed configurations/activity; snippets≤25 lines/4KiB;≤8 accepted whole tuples,≤2 atoms/family; atom≤512bytes, family≤1.5KiB, submission≤64KiB, nesting≤8. Retain the approved256KiB persistence budget and component allocations.

Match identities, shapes, schemas, categories and ordered cells exactly where assessed; float tolerance is abs1e-9+rel1e-9 with disclosed rounding rules. Do not flatten, reorder, coerce Boolean/numeric-string values or equate missing with zero. Missing/nonfinite/error outcomes are tagged. Equivalent repairs require reviewed complete tuples plus counterexamples; mixed incorrect tuples fail.

Reject arbitrary Python, general expression interpretation, unrestricted imports, query/eval/apply(user callable), dynamic method/aggregation dispatch, arbitrary regex/paths, remote CSV/SQL, shell/network/filesystem access from learner answers, uploads and executable serialization. Browser displays a reference simulation; trusted offline author/CI code and canonical notebooks are separate, never a learner-code service.

Unknown/extra/duplicate/prototype keys, wrong scope/version/kind, partial unsupported repairs, raw NaN/Infinity, malformed/deep/oversized inputs fail safely without executing or consuming an assessment attempt. Known blank UI answers use the unanswered sentinel and count wrong after confirmation. Size-limited content must report its own unsupported state, not falsely claim pandas raises a library error.

## 6. Notebook and data contract

Deliver one reproducible pandas notebook using the unchanged founder-approved tested local profile: CPython3.13.16, pandas3.0.6, NumPy2.5.4, Matplotlib3.11.2, scikit-learn1.9.1, with the existing hash-locked environment/tooling and recorded OS/architecture/thread policy. This is an approved local profile, not a new cross-platform/security or Colab claim.

Notebook sequence: inspect labeled data → select aligned observations/features → state missingness policy → group with honest denominators → validate joins/cardinality → produce a bounded dataset audit. Align sections and asserted outputs with all24 objectives; include predict-before-run prompts and safe guided changes without crashing TODOs or hidden state.

Required analytic anchors from the blueprint:
- Label-aligned Series sums rowA=21,rowB=12.
- Group means15 and100; global mean130/3, not57.5.
- D05 left join3 rows and inner join2 for the specified duplicate-match example.
- D03 declared missingness/replacement example and D06 prediction-time target exclusion.

Use original fictional bundled/embedded data with manifest, provenance/permission, checksum, schema/types/nullability/units, row IDs, label timing and limitations. Preserve the blueprint's unique canonical housing IDs H01–H16 and stated split provenance; duplicate-ID/malformed/leaky teaching cases are separately named derived overlays, never silent edits to the canonical base. Loading/auditing them does not implement a new model or capstone.

Freeze complete reference outputs/hashes and explicit policies during authorized authoring. Run canonical notebook cells in two fresh kernels/clean working directories; compare exact identities/schemas and declared tolerant numeric outputs. Record exact environment, seed42 where random operations are used, deterministic order, expected outputs, warnings and hashes. No grading depends on random draws or timing.

No credentials, paid compute, learner upload, Drive mount or remote dataset requirement; no automatic package changes. Carry forward author-test budgets60seconds/cell,300seconds/notebook,≤2GiB process memory and≤1MiB captured result payload; report actual enforcement/evidence rather than asserting sandbox containment.

Genuine Colab restart-and-run-all remains OPEN / NOT VERIFIED until actually executed. An incompatible host/profile requires separately approved, pinned and parity-tested alternatives, never silent version changes. Notebook download/execution cannot award platform mastery.

## 7. Persistence and preservation boundary

Use a separate pandas module-local versioned envelope; proposed names following the current architecture are ml-math-lab:python:pandas:v1, content python.pandas.1.0.0 and assessment python.pandas.mastery.v1. Final schema/fixture revisions must be recorded with the implementation. The objective namespace and approved scoring policy do not change.

No prior-module evidence migration/import is required. Reuse proven patterns without rewriting Essentials/NumPy or shared Math/Regression semantics. Preserve all existing keys, original P01 copy behavior, notebooks, assessment rules and earned mastery.

Hydrate before writing; validate scope/version/IDs/canonical bytes. Keep valid drafts/counters/remediation, latest20 compact summaries and latest full submission, with stable award IDs and original policy identity. Confirmation writes one scoped envelope; duplicate submission cannot inflate progress. Corrupt/future/foreign/unsupported bytes remain intact with saving disabled; quota/read denial/stale-write failures visibly distinguish in-memory work from saved state. Resets require scoped confirmation and never clear independent mastery through a lesson reset.

Future semantic/version changes require an explicit compatibility decision; no silent rescoring. Origin-local storage is not account sync, tamper-proof evidence or distributed compare-and-swap.

## 8. Implementation acceptance plan

| Area | Required pass evidence |
|---|---|
| Coverage/depth | Exactly6 lessons/24 objectives/48 practice/72 independent instances/seven paired critical gates; trace every objective to explanation, worked/changed example, ML use, experiment, misconception and targeted recovery. |
| Trusted reference parity | Every120 scored instance and every exposed experiment state agrees with actual pinned pandas; include alignment, nullable masks, copy/assignment, counts/size, missing/category groups, duplicate/null joins, date/schema and target-availability edge cases. Freeze provenance, output tags and hashes. |
| Mastery | All3 real forms:19/24 fails;20/24 passes only with every gate; all correct passes. Seven gates×two components×three forms = **42 otherwise23/24 failure scenarios**. Missing/duplicate families, blanks, malformed input and attempt mosaics cannot bypass gates. |
| Equivalence/safety | Accepted whole repairs and counterexamples, mixed wrong tuples, exact order/type/shape/identity, tolerance boundaries and adversarial/malformed payload corpus. Unmatched content fails closed, not as a fabricated successful result. |
| Retries/remediation | Review/confirm/no early correctness, A/B/C rotation, idempotence, incomplete repairs, persisted exhaustion and correct changed-case recovery; failed critical reasoning receives useful specific feedback. |
| Persistence | Fresh/restored/corrupt/future/wrong-module/oversized/noncanonical records; denied reads/writes/quota/stale tabs; partial drafts; review reconfirmation; history pruning with mastery retained; independently scoped resets and unchanged old keys. |
| Frontend/Python regressions | Full npm test and supported isolated PYTHONPATH=python pytest suite pass; retain every existing module's tests and behavior. Task013.3's381 frontend/336 Python results are historical baseline evidence, not pandas test results. |
| Types/build | npm run typecheck and npm run build pass; direct entry/invalid routes and browser Back/Forward/reload are safe. No new backend/dependency/database requirement. |
| Keyboard/320px | All lesson/overview/assessment active/review/result/error/reset states usable at320px; named keyboard-operable code/table scrollers with numerical alternatives, contextual labels, logical Tab/focus order, no drag/hover-only dependency. |
| Browser journey | Production-build failure→targeted remediation→different-form pass→reload restoration; later failed attempt preserves earlier mastery. Distinguish real UI evidence from seeded unit/jsdom tests. |
| Notebook | Two fresh canonical local runs match frozen complete outputs and analytic anchors; record versions/data/output hashes, limits and network/credential/upload independence. Preserve old notebook bytes. |
| Documentation | Completion report with actual counts/logs/fixture/data/policy versions, preservation hashes, register/status updates, scoped accessibility results, open risks and next-task stop. |

Genuine screen-reader speech/navigation, genuine200%/400% browser zoom and genuine Colab remain explicitly unresolved acceptance obligations until real evidence exists. Also retain the broader manual accessibility/device checks and deferred full-V1 pedagogical audit/learner testing; do not represent implementation completeness as full reference acceptance.

## 9. Decisions and stop conditions

No material lesson-count, objective, critical-list, threshold or prerequisite ambiguity was found: the matrix, evaluator critical table and existing policy registry agree on24 objectives/seven gates. No dedicated013.4 spec existed before this bounded consolidation.

Authoring details still to freeze, not new curricular approval requests: exact cases/distractors/accepted tuples, finite activity configurations, nullable/category/date/merge policies, data overlays, complete notebook outputs and version identifiers. The following boundaries resolve potential ambiguity without expanding scope:
- Canonical unique IDs versus D06's faulty table: use a named derived overlay.
- Exploratory declared fills versus later preprocessing: teach provenance and fixed replacement recipes; do not build a general imputation/pipeline trainer or expose unlisted median/callable operations.
- Valid merge syntax versus valid entity semantics: validate both, including explicit handling of missing keys and unintended weighting.
- Correlation versus causation: assess D04.O4 and use existing Statistics recall, keeping the approved seven critical gates unchanged.

**Founder decision resolved:** this bounded specification and its implementation were explicitly approved. Implementation evidence is in TASK_013_4_COMPLETION.md. Any extra critical gate, evaluator operation/answer grammar, alternative dependency/Colab profile, material data-contract change or security-boundary expansion still requires separate approval before adoption.

The original scope-verification milestone authorized no implementation. Subsequent founder authorization now covers only the complete bounded pandas deliverables recorded above. No database migration, deployment, external learner testing, Visualization/Data Preparation/scikit-learn or capstone work is authorized. **Stop after Task013.4 for founder review; do not start013.5.**
