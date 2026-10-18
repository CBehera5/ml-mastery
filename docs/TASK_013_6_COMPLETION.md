# Task 013.6 — Data Preparation completion report

Status: **Implemented; submitted for founder review.** The founder approved the [bounded specification](task-013-6-bounded-implementation-spec.md) and authorized exactly this implementation. Genuine screen-reader, browser zoom and Colab acceptance remain open. No deployment, external learner testing, database migration, hosted learner execution or Task013.7 work.

## 1. Delivered scope and learning experience

Routes: /python/preparation overview, t01–t06 lessons and independent mastery. Exactly six lessons,24 essential objective families,48 practice instances,72 independent instances across three complete24-family forms, eight paired critical gates, six experiments/44 finite configurations and one full notebook.

| Lesson | Reasoning and worked anchor | Experiment states |
|---|---|---:|
| T01 Split observations before learning from them |Unit of independence, row/customer/time boundaries, prediction-time features, validation versus final-test permissions and seed limitations. H01–H12 development versus untouched H13–H16 final test. |9 |
| T02 Fit missing-data rules on training data |Missing versus observed zero; drop/fill/indicator trade-offs; train[10,missing,30] median20; test[1000,missing]→[1000,20]. Explicit all-missing schema, constant/mode contrasts. |7 |
| T03 Categorical encoding preserves a feature contract |Fixed basic/pro vocabulary, column order/shape, ordinal versus arbitrary codes, unknown/error/ignore/drop ambiguity. Unknown team→[0,0] only under ignore/no-drop. |7 |
| T04 Scaling is a fitted coordinate transformation |Saved training mean/population scale and inverse units; train[1,3] mean2/scale1, test5→3; constant train[4,4] scale1, new5→1. No automatic generalization claim. |6 |
| T05 Compose preprocessing without leaking across folds |Local fold primer; numeric impute→scale and category impute→encode; branch feature order; fold-only fit IDs; invalid whole-development prefit and second evaluation fit. Raw category scaling yields a named error. |9 |
| T06 Outlier policies and reproducible preparation reports |Preserve/investigate/supplied train-only cap50; test80→50 only under that policy; selection provenance, saved parameters, source/environment/schema and seed/order limitations. |6 |

Each lesson contains exact approved outcomes/prerequisites, motivation, terminology, mathematical intuition, deep mental-model paragraphs, worked code/numbers before practice, meaningful predict/change/reveal/reason experiments, practical ML context, misconception and targeted remediation. Row IDs/units/schema and fit permissions are visible. T05 supplies a temporary-partition primer before fold reasoning; no forward prerequisite on S03 or CV API curriculum.

The realistic canonical fictional housing source is reused without mutation. Small separately named worked arrays keep calculations understandable. This is preparation reasoning, not an unrestricted coding course or representative housing-performance claim.

## 2. Objective and assessment coverage

[Exact24-row coverage and gate evidence](task-013-6-objective-assessment-coverage.md) maps teaching, assessment and remediation directly to the approved matrix. The catalog has two practice variants and three independent variants for each family. There are no extra introductory objectives or altered gates.

Frozen contract: packages/python-contracts/fixtures/preparation-learning.v1.json. The actual pinned author oracle recomputes148 references:24 worked +120 scored +4 experiment-only. All44 activity states map to these references. Browser components render numerical/textual alternatives for every exposed state; no color, hover, chart or drag interaction is required.

Trusted source SHA-256:2c97efbfa273f44d44f28c3541016af1ee44b101af234f06a5a2652894f4aaa1.
Full fixture SHA-256:f87534b6257be1e9f92b59a19802d7fc651a368544ecd6c7ebd30ccdf5e8a5e7.
Fictional source-data SHA-256:751b55a15cf32f3755684a24e167fce0aa732d3fac7c5246bc86723941131cd5.

Trusted checks cover training-only/fold-only statistics under held-out mutations, invalid whole-data prefits, independent IDs, temporal violations, target availability, unknown/error/drop semantics, all-missing output columns, population/sample variance, constant scaling, output schemas and invalid typed sequences. Invalid examples are explicitly labeled and cannot authorize fitting on evaluation rows.

## 3. Mastery, critical gates and retry policy

**Pass = at least20/24 AND both components of all eight gates in the same confirmed independent attempt.**

Gates: T01.O1 split independence; T01.O2 untouched final test; T02.O1 train-only imputation; T03.O1 vocabulary/unknown boundary; T04.O1 training population scaling; T05.O1 branch/order/schema; T05.O2 fold-only fitting; T06.O1 outlier-policy selection. Each requires a correct decision/repair/calculation and reason/counterexample. One binary point per family; no half-credit compensation.

All three actual forms test19/24 failure,20/24 success with gates correct,21/24 and24/24. Every gate×both components×three forms is tested as a structurally valid wrong-answer failure at otherwise23/24:48 scenarios. Missing/duplicate families and malformed representations reject. A correct numerical outcome cannot compensate for a false leakage explanation.

Only a passing independent attempt awards module mastery and independently correct objectives. Missed noncritical objectives remain unmastered. Failed attempts award no new mastery; later failures preserve earned same-version mastery. No cross-attempt mosaics, imported evidence, practice/experiment/notebook mastery or synthetic learner-facing awards.

Lesson completion requires four correct practice families plus a changed experiment with correct prediction and bounded explanation. Two valid submissions per A/B variant per review cycle; invalid answers consume none. Exhaustion requires targeted review plus changed-case recall before a labeled new cycle. Completion evidence persists during later review.

Independent active→review→explicit confirmation→results; no early per-answer correctness. Disclosed blanks count incorrect; malformed/incomplete repairs cannot submit. Review reload returns to active for reconfirmation. Unlimited fresh-ID A→B→C retries, no cooldown or hard prerequisite lock; results name failed critical gates and direct remediation.

## 4. Evaluator safety and architecture

Reuse unchanged foundation finite evaluator, scorer, evidence helpers, AnswerInput and styles. Adapt the established six-lesson module-local controller pattern additively; reuse pandas Outcome renderer through a re-export instead of duplicating its accessible table/text logic. The existing six-module policy registry already defines Preparation; it is not changed.

Allowed responses remain finite choices, finite typed numbers and predefined repair slots. T04.O2 uses inclusive absolute1e−9+relative1e−9 tolerance without Boolean/string coercion. T05.O2 accepts only two complete equivalent training-boundary tuples, both requiring transform; wrong mixtures/refit fail. Exact IDs, membership, feature order and type semantics are not approximately matched.

Strict definition/response/version/ownership/size/depth guards reject unknown/extra/duplicate/prototype fields, unsupported representations, nonfinite and oversized answers. Partial legal repair drafts can persist but cannot score. Default bounds remain unchanged:25-line/4KiB authored snippets,32×8 tables, rank≤2/≤64 array cells,≤64 activity states,≤8 accepted tuples,≤2 atoms/family,512-byte atom,1.5KiB family,64KiB submission and256KiB persisted envelope.

The oracle executes only repository-authored finite snippets after enumerated integer configuration validation. This is offline author tooling, not a learner endpoint or general parser. Learner input never reaches Python, eval/exec, dynamic imports/method dispatch, files, network, shell, uploads or subprocesses. Notebook execution is trusted local author code, not hosted learner execution.

No new evaluator grammar, dependency, arbitrary parameter language, preprocessing algorithm, model/evaluation module, CV splitter API or shared-controller refactor. Ordinal understanding uses fixed mapping tables; clipping uses a supplied cap, not a new learned search algorithm. The preprocessing classes are approved sklearn references, not implementation of the subsequent scikit-learn curriculum.

## 5. Persistence and regression preservation

Separate key ml-math-lab:python:preparation:v1; schema1; content python.preparation.1.0.0; assessment python.preparation.mastery.v1. No imports, migration, rescoring or reinterpretation of earlier module evidence.

Hydration precedes writes; canonical ownership/version/ID/bounds/evidence validation fails closed. Corrupt/future/foreign/unsupported raw bytes remain unchanged, with saving disabled and an accessible warning. Read/quota/write/stale-tab failures preserve durable bytes and visibly identify memory-only work. One scoped envelope write commits deterministic results/evidence with stable attempt/award IDs and idempotent confirmation.

Latest20 compact histories/latest full submitted attempt; active drafts, practice counters/recovery/activity restore. History trimming and lesson reset preserve mastery. Lesson reset needs scoped confirmation; separately confirmed module reset touches only Preparation. Local storage remains origin-local/user-editable, not account sync, authenticated proof or distributed CAS.

Pre/post preservation: **350/351 pre-existing protected files byte-identical**; the only old source change is apps/web/app/python/page.tsx for module discovery. All prior Math/Regression/Essentials/P01/NumPy/pandas/Visualization logic, mastery, notebooks, shared helpers and dependency manifests are unchanged. Preservation hashes are in outputs/task-013-6/verification/preservation.json. New subject files are additive.

Unit/frontend tests seed existing module keys and verify reset/version isolation. Final browser QA uses new agent-created loopback3032, never the founder's prior module origins. Exploratory3031 records preceded the final variant freeze and were not migrated or reinterpreted; the retained final journey starts on clean3032 and identifies the frozen corpus hash. No user records were deleted or relabeled.

## 6. Automated verification

| Check | Final result / evidence |
|---|---|
| Complete frontend/TypeScript suite |423 passed across73 files; outputs/task-013-6/verification/frontend.log |
| New Preparation frontend/model/readiness/outcome coverage |14 tests across4 files; all120 definitions,44 activity states, real form thresholds and48 valid critical-component failure scenarios inside loops |
| Complete Python regression suite |782 passed; verification/python.log |
| New trusted Python reference tests |159 passed, including148 parameterized references plus catalog/profile/safety/anchor/provenance/schema tests |
| Typecheck |npm run typecheck passed; verification/typecheck.log |
| Production build |npm run build passed; overview, mastery and all six lesson routes generated; verification/build.log |
| Local notebook |Two fresh kernels/clean working directories; matching24-objective and full housing-preparation outputs; notebook/report.json |

Existing approved isolated interpreters were reused; no package install or application dependency mutation. Complete suites include all earlier mathematics and Python modules. Intermediate authoring checks caught ndarray normalization, repeated variant inputs and a test that selected an unavailable distractor after duplicate-label deduplication; all were corrected. Every objective now has distinct authored source cases within its two practice/three independent forms; a Python assertion enforces this. Variants change seeded memberships, unknown category inputs, record counts and schema/order cases; T01.O1 additionally assesses a future-forecast boundary in formC. The gate test deliberately selects an existing valid wrong answer; no threshold, gate or grader was weakened.

The first sandbox notebook launch was blocked on Jupyter loopback sockets. The authorized local-kernel run then completed twice. Retained logs include local Jupyter unencrypted-loopback transport warnings; this is not a public execution service or arbitrary-code sandbox.

## 7. Browser and accessibility findings

Production preview:127.0.0.1:3032. Overview and every lesson measured viewport/content width320px; assessment review, critical failure, passing result and incomplete-repair review also measured320px. Native selects and wrapping numerical explanations remain usable; source/table overflow is confined to named focusable local scrollers. No browser warning/error logs were observed in this scoped journey.

All six experiments were changed and correctly predicted/explained live. Enter navigation/reveal/buttons, Space radios/confirmation, native select ArrowDown/Enter, skip-link then Tab progression and feedback/result focus were exercised. The skip link advances onward to prerequisite links; it does not trap navigation.

Live independent journey: formA23/24 failed T05.O2 despite correct repair because its reason allowed whole-development prefit. Review reload retained answers but required reconfirmation. Fresh formB20/24 passed every gate with four noncritical objectives unmastered, then reload restored results. An incomplete formC repair blocked submission even after confirmation. Clearing it and submitting blanks produced0/24 without erasing previous mastery; reload restored that state. Unit/jsdom seeded storage evidence is distinct from these actual browser interactions.

Evidence: outputs/task-013-6/browser/report.json, mastery-320.png and fold-boundary-320.png. Temporary viewport override was reset. Genuine screen-reader speech/navigation, genuine browser200%/400% zoom and genuine Colab remain **OPEN / NOT VERIFIED**. AX/DOM, resizing and local kernels do not close them. Broader contrast/text-spacing/target-size/reduced-motion/device/AT acceptance remains tracked, not blanket-passed.

## 8. Notebook reproducibility

apps/web/public/notebooks/python-preparation.ipynb contains24 objective sections, conceptual/prediction/remediation prompts, actual approved preprocessing code, exact analytic assertions, four policy/error contrasts and a complete fixed-data housing preparation report. It is also a reusable question→schema→split→fold fit→validation transform→chosen development refit→final-test transform→provenance template.

Embedded canonical fictional records have explicit checksum/units/order/IDs. Fold trainingH01–H08, validationH09–H12 are development subsets; final preparation fitsH01–H12 and only transformsH13–H16 after a fixed declared policy. No model fitting/selection scores are computed. Record both imputer statistics and ordered transformed outputs; no credentials, uploads, Drive, remote dataset, paid compute or automatic installs.

Exact tested profile: macOS15.6.1 ARM64; CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1; nbclient0.11.0,nbformat5.11.1,ipykernel7.4.0. Notebook preflight asserts core versions. Seed42 and single-thread setup are explicit, but no grading depends on stochastic model performance. This is the tested profile only, not a latest-version/security/cross-platform or Colab claim.

Notebook SHA-256:e9ef30ade1cd74a95908423b60b87c7e201d77ce78644251d9cc6338d24ebcc2.
Matching normalized output SHA-256:7fdc074e4d5c575cae38b911bfd9721429c9ae6eafca7302c0de6cfa4bc71e8c.

Runner python/notebook_checks/verify_python_preparation.py executes two fresh kernels in clean working directories and compares full normalized results.60seconds/cell; notebook asserts runtime<300seconds, observed RSS<2GiB and result<1MiB. Those are trusted author bounds/observations, not OS-enforced arbitrary-code containment. Genuine Colab requires separately captured actual execution; incompatible hosts cannot silently replace pins.

## 9. Documentation, deviations, risks and next readiness

Updated implementation status, blueprint/matrix, mastery/evaluator and acceptance docs, architecture, roadmap, quality register, notebook evidence, accessibility blockers and conceptual-depth backlog. The exact coverage/gate evidence is linked above.

No material curriculum or architectural deviation: exact24 essential objective mappings/eight gates/20-of24 policy,120 scored instances and existing evidence semantics preserved. More concrete authoring choices (44 finite activity states and four explicit error/policy contrasts) implement, not expand, the approved six experiments.

Remaining risks: finite client-visible banks and large structured JSON choices may reward recognition; small fictional scenarios and repeated reasons do not establish unrestricted coding fluency or validated real-world transfer. Tiny floating-point display differences across browser engines fall within the established numeric tolerance; exact IDs/choice contracts remain unchanged. Profile upgrades require parity/version review. Local evidence is not tamper-proof. Genuine AT/zoom/Colab, comprehensive Task017 depth review and separately authorized full-V1 external learner testing remain open.

Task013 totals now31/36 lessons,124/144 families,34/41 critical gates and5/6 full module assessments/notebooks. Remaining S01–S05 contains five lessons/20 families/seven gates. Recommended next action: founder review, then separately authorize Task013.7 scope verification against approved documents. **Stop here; do not implement Task013.7 without approval.**

