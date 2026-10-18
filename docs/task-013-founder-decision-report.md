# Task 013 Founder Decision Report and Specification Freeze Review

**Review revision 0.2 — 16 October 2026. Documentation only. Implementation remains paused.**

## Executive recommendation

Retain the founder-conditionally-accepted structure: **six modules, 36 lessons, 144 objective families, 41 critical gates, six independent module assessments, six reproducible notebooks, and at least 80% plus every critical gate**. No count, threshold or existing Mathematics policy is weakened.

The five documents now form a consistent **candidate specification baseline**, with the corrections below. Recommend approval of the detailed contract/depth/safety revision separately from any implementation authorization. **Do not call the environment or notebook outputs frozen/verified yet**: the complete dependency/tool lock, clean runs, full bundled-data outputs and genuine Colab profile do not exist as verified artifacts. This review cannot honestly close those evidence gates.

Revised forecast: **50–70 working days / 10–14 weeks**, including authoring, development, tests, integration/manual QA and contingency. Proposed 013.1 is a narrow **8–12-working-day** foundation/P01 prototype after new explicit approval; it has not begun.

## 1. Specification consistency findings and corrections

Reviewed all five canonical documents: blueprint, lesson/objective matrix, mastery/evaluator specification, acceptance criteria and cumulative curriculum-quality register. Protected application/runtime/contracts/notebook/dependency files are outside this change.

| Finding | Revision 0.1 issue | Correction in revision 0.2 | State |
|---|---|---|---|
| F01 Objective traceability | Lesson outcomes and assessment intent existed, but exercise/assessment identity mapping required combining prose from multiple files | Added a normative generative lesson/objective/practice/independent/assessment mapping and six-scope ledger; reviewed all 144 objectives | Corrected at specification level |
| F02 Critical failure paths | Correct gate list and remediation existed, but no single explicit failure table for every C ID; S02.O2's “metric units or imbalance” intent could leave one required interpretation absent from a form | Added 41 specific failure triggers/remedies and results→lesson remedy→counterexample→next-form recovery; either decision/reason failure blocks. S02.O2 now explicitly checks metric/units and the imbalance interpretation on every form; no new gate. V04.O3 remains noncritical | Corrected; strengthened detail for founder confirmation |
| F03 Prerequisite progression | D03 called later T02 a recall; T05 assumed fold terminology developed formally in S03 | D03 now uses local explanation/earlier Statistics; T05 includes a local train/validation fold primer, with S03 explicitly later | Corrected; no forward prerequisite |
| F04 Lesson depth | Global teaching standard did not give every lesson its own explicit motivation/mental model and progressive contrast | Added both fields to all 36 lessons; nine higher-risk lessons receive specific staging safeguards below | Corrected as design; authored teaching quality still unverified |
| F05 Fixture explosion | “Every allowed state” plus eight choices across eight slots could be read as requiring 8^8 Python executions | Separate ≤64 authored experiment configuration states from answer combinations; ≤8 accepted whole tuples; incorrect responses are bounded comparisons, not executions | Corrected |
| F06 Input/submission budgets | A 4-KiB atom could exceed a 64-KiB module budget when multiplied by 32 families and paired gates; array bounds must also support the planned 12-row training workflow | Atom≤512 B, family≤1.5 KiB, ≤32 families plus 16-KiB framing headroom; total≤64 KiB. Arrays permit dimensions up to 32 with ≤64 total cells, including 12×4 | Corrected |
| F07 History budget | Keeping full answers for 20 attempts could exceed the stated 256-KiB envelope; repeated evidence IDs could grow without bound | Latest 20 compact summaries≤40 KiB, draft≤64, latest responses≤64, evidence≤32, metadata≤16; 216 KiB allocated, 40 KiB headroom; stable provenance IDs | Corrected; older full response replay explicitly not promised |
| F08 Shared evaluator mismatch | Proposed relative tolerance and strict extra-slot rejection are not provided by the old helper alone | Python-local numeric comparison and strict response adapter specified; existing helpers and Math behavior unchanged | Corrected |
| F09 Duplicate JSON members | A plain JSON.parse/shape check cannot detect overwritten duplicate members | New Python-only canonical bounded storage round-trip, unique entry IDs and author duplicate detection; preserve unsupported raw bytes | Corrected as contract; not implemented |
| F10 Practice deadlock | Two allowed variants could both be exhausted without a defined recovery | Targeted remediation/counterexample→new labeled review cycle; persist counters; never awards independent mastery | Corrected |
| F11 Operation surface | Operation names/parameter sets were broad; dtype conversion/clipping were implied by objectives but not explicit in the table | Explicit operation/configuration/answer registry; dtype conversion N01 and preset outlier clipping T06 only; bounded inner/left joins and fixed recipes | Corrected; no new lesson/objective |
| F12 Reproducibility | Candidate pins, generic seeds and notebook outlines were not a tested lock or complete expected outputs | Exact target/support distinction, seed/fold/ID/analytic-output contracts and clean-environment protocol; no fabricated full-output hash | Specified; execution evidence OPEN |
| F13 Colab/credentials | “No credentials” could be mistaken for guaranteed anonymous Colab | Credential-free local execution; no notebook/API secrets, paid compute or learner data upload; Colab host account may be needed | Founder confirmation needed |
| F14 Approval/status/cost | Draft-only status and 7.5–11.5 weeks no longer matched conditional structural approval or realistic verification work | Status clarified across all five; workstream/stage estimate revised; explicit proposed 013.1 exit gate | Corrected; cost/scope approval pending |
| F15 Executable versus mathematical notation | N02/N04/N05/N06 used nested-list shorthand near ndarray slicing/@/reduction claims, which a beginner could copy as invalid Python | Made ndarray constructors/operands explicit; unchanged numerical answers; full author-owned snippets still require execution tests | Corrected in matrix |

### Objective, exercise and assessment coverage

Specification audit results:
- 36 unique lesson IDs; four objective families each; **144 unique objective IDs**, 141 essential and three introductory.
- All 144 have measurable outcomes, independent check intent, specific remediation, a lesson owner and defined exercise/assessment IDs.
- Two practice instances and three independent instances each: **288 practice + 432 independent = 720 unique family-instance IDs** across six assessment scopes.
- Exactly **41** C IDs; all essential; each has an explicit failure/remediation row. Three I IDs remain P08.O4, V05.O4 and S05.O4, none critical.
- **111 explicit prerequisite edges** are backward-only in the 36-lesson order. That order is a valid DAG/topological progression. Future enrichment/remediation links are not prerequisites; no route lock is introduced.
- Named approved concepts are mapped in the matrix's required-concept audit, including operators, imports/files/practical class recognition, broadcasting, joins, causal interpretation, preprocessing, CV and model comparison. No required topic is orphaned at specification level.

This proves **design traceability**, not that 720 executable/authored/reviewed questions or six notebooks already exist. Every form still needs its reviewed fixtures and subskill coverage before module acceptance.

## 2. Lesson-by-lesson pedagogical depth review

For all 36 lessons, the matrix now explicitly specifies motivation/mental model, prerequisite recall, concepts/Mathematics connection, a worked example, progressive contrast, ML context, misconception, interactive practice, assessment/remediation and completion/mastery success criteria. This is a specification-presence review, not a claim of learner-validated content.

**High risk means additional staging is required before implementation acceptance**, not permission to delete objectives. Each lesson must progress from the small worked case to a meaningful changed-condition case, then reduced-scaffolding transfer. Code brevity, syntax naming and copying a working block never substitute for those stages.

| Lesson | Progressive practical contrast | Syntax/depth risk and required safeguard |
|---|---|---|
| P01 | Change numeric area to text and explain why repetition is not a prediction. | **Medium:** Avoid a type-name quiz; require units and a changed expression. |
| P02 | Reorder a feature pair and contrast alias versus copy after one edit. | **Medium:** Four collection types can become a catalog; prioritize ordered features and identity. |
| P03 | Contrast valid age zero, missing age and a boundary threshold. | **Low:** Require the retained row IDs, not only which if statement runs. |
| P04 | Start with three errors, then an empty batch and unequal paired lists. | **Medium:** Trace the invariant and lost contribution, not only the final integer. |
| P05 | Compose two calls, then change a default/mutation case. | **Medium:** Give mutable-default behavior its own small call-frame example before assessment. |
| P06 | Translate a loop, then expose separately filtered row IDs and a duplicate key. | **High:** Do not reward shortest syntax; require output/order/identity equivalence. |
| P07 | Follow a conversion traceback, then compare narrow handling with a plausible logic bug. | **High:** Stage traceback, error handling and import binding; avoid exception-name memorization. |
| P08 | Trace a bundled record through validation, then separately inspect two tiny instances. | **High:** Use three short sections; do not compress CSV/JSON, resources, imports and classes into one syntax tour. |
| N01 | Read a feature table, then reshape and test an integer conversion. | **Medium:** Require semantic row labels after reshape, not just element counting. |
| N02 | Contrast dropped versus retained axes, then edit a view/copy. | **Medium:** Do not hide mutation behind a visual-only highlight. |
| N03 | Compare per-feature bias, per-row offsets and an incompatible shape. | **Low:** Keep shape legality and semantic orientation as distinct reasoning steps. |
| N04 | Match scalar contributions to Xw+b, then expose repeated bias or shuffled targets. | **Low:** Validate equivalence, not unsupported speed claims. |
| N05 | Expand one output cell, then compare transpose/order and an invalid product. | **Low:** Connect every symbolic dimension to the worked row/column meaning. |
| N06 | Compare feature/row means, then ddof and an all-missing column. | **High:** Separate axis, missingness and dtype examples instead of a list of reduction APIs. |
| D01 | Reorder Series labels, then remove one label to expose alignment/missingness. | **Low:** Require explanation of the aligned rows. |
| D02 | Contrast label/position lookup, then a reordered Boolean mask. | **Medium:** Use deliberately nonconsecutive labels; distinguish row filtering from column order. |
| D03 | Keep legitimate zero, compare drop/fill, then distinguish exploratory versus training use. | **Medium:** Use an earlier Statistics fit-boundary recall, not a prerequisite on future T02. |
| D04 | Rebuild group sums/counts, then include missing keys and unequal sizes. | **Medium:** Require arithmetic and group membership, not fluent agg syntax. |
| D05 | Count duplicate matches, then apply a cardinality contract and unmatched/null-key policy. | **Low:** Visualize matching pairs before merge syntax. |
| D06 | Inspect a derived faulty table, then produce a justified audit record. | **High:** Avoid a head/info/describe checklist; every finding must justify a downstream decision. |
| V01 | Plot ordered predictions, then swap axes/units or an unordered customer sequence. | **Medium:** Figure/Axes calls should follow the measurement question. |
| V02 | Predict two bins, then change widths or include an outlier. | **Low:** Keep raw values and bin membership visible. |
| V03 | Compare paired/subgroup points and a causal counterexample. | **Low:** Preserve the exceptional correlation-versus-causation depth from Mathematics. |
| V04 | Rebuild quartiles/fences, then compare a valid extreme observation. | **Medium:** Show counts and raw values; do not grade only vocabulary. |
| V05 | Compare disclosed axes/bins and repair a misleading conclusion. | **Low:** Require an absolute-unit explanation, not an 'all truncation is bad' rule. |
| T01 | Compare fixed row split with group/time overlap and final-test-guided selection. | **Low:** Distinguish seed reproducibility from a defensible split. |
| T02 | Change only test values and verify the training median is unchanged. | **Low:** Require fit provenance, not just the fill value. |
| T03 | Compare a known category with an unseen category and arbitrary integer coding. | **Medium:** Keep category meanings and output column order visible. |
| T04 | Freeze train mean/scale, then change test values and a constant-feature case. | **Low:** State the sklearn versus preserved math-runtime constant-feature difference. |
| T05 | Start with a two-partition fold primer, then compose typed branches and repeat fitting per fold. | **High:** Explain 'fold' locally before using it; S03 later introduces the full API. |
| T06 | Compare preserve/investigate/cap plans, then remove a seed-only reproducibility claim. | **Medium:** Every report field must correspond to an observable policy/data choice. |
| S01 | Trace constructor/fit/predict, then a separate transform-without-refit case. | **Medium:** Do not ask learners to memorize method names without state/data provenance. |
| S02 | Compute regression units, then inspect a majority-class baseline's missed positives. | **High:** Stage regression and classification-count examples; explicitly reject a useless accuracy-only conclusion. |
| S03 | Inspect one fold, then all folds, scorer sign and a group/time counterexample. | **High:** Defer splitters until row-level fit/validation reasoning is secure. |
| S04 | Trace numeric/categorical branches separately before the complete fold-local model. | **High:** Use short linked snippets; avoid copy-and-run mastery. |
| S05 | Apply a fixed validation rule, then refit and inspect a declared tie/limited claim. | **Medium:** Require the selection timeline; do not choose the largest visible number. |

The nine higher-risk lessons are **P06, P07, P08, N06, D06, T05, S02, S03 and S04**. In particular:
- P08 must separate record/schema validation, resource lifetime and introductory class instances. Classes remain a bounded noncritical introduction, not an OOP assessment expansion.
- T05 teaches the meaning of one fold locally before API-level CV; S03 teaches repetition/splitter/scorer semantics later.
- S02 stages regression metric units before the class-imbalance counterexample. Use positive/missed-positive count tables rather than adding an unapproved new classification algorithm.
- S04 composes previously explained small branches; the ≤25-line displayed-snippet limit does not force a single compressed full-pipeline listing.

No formal learner testing or comprehensive Task 017 audit occurred. Later curriculum-depth review and external learner testing remain scheduled after full V1/capstone assembly and separate authorization.

## 3. Evaluator safety decisions

### Explicit evidence boundary

The evaluator can verify bounded output/type/shape predictions, finite accepted repair tuples, row/column/order transformations, train/fold information boundaries, and supported claims against versioned trusted references. It **cannot** verify arbitrary equivalent Python, general code termination, unrestricted notebook programming, actual learner-run execution, causality or production performance.

There is no Python parser/interpreter, arbitrary import dispatch, shell, dynamic evaluation, filesystem/network access or upload in the browser grader. Curated file/import code is a displayed author-owned trace. Actual notebook code runs only locally/Colab under learner control or in trusted author CI; learner responses/files never become executable test input.

The operation and normalized-answer registry is explicit in mastery/evaluator sections 2/10. Only choice, finite number, finite slots, shape, stage order, bounded cell entries and unanswered forms are accepted. All IDs/keys/types/domains are validated; unknown source text receives a safe unsupported-format message, not a fabricated incorrect-program verdict.

### Grading and equivalence

- One family = one point, AND across all declared parts. Critical decision and reason/counterexample must both pass.
- Exact types/shapes/indices/order are preserved when assessed. Numeric tolerance is the declared absolute-plus-relative rule, not implicit string coercion.
- Only finite reviewed **whole** equivalent tuples are accepted; no mixing individually plausible slots into an unverified combination.
- Missing, zero, error and nonfinite output are distinct tagged outcomes. Confirmed blanks count incorrect; malformed identities do not disappear from the denominator.
- Maximum experiment state count and response/storage budgets are coherent. Canonical new-Python storage/strict adapters do not alter old loaders or Math policies.
- Invalid inputs are rejected before evaluation with nonreflective messages. Content faults fail closed. No code/HTML/secret/path is echoed into an exception dump.

Safety validation tests remain future implementation work; no sandbox has been implemented or security-tested by this document review.

## 4. Mastery-policy recommendation

Retain the conditionally accepted ≥80% floor and all 41 essential critical gates in the **same** independent attempt:

| Module | Items | Minimum correct | Critical gates |
|---|---:|---:|---:|
| Python Essentials | 32 | 26 | 8 |
| NumPy | 24 | 20 | 6 |
| pandas | 24 | 20 | 7 |
| Visualization | 20 | 16 | 5 |
| Data Preparation | 24 | 20 | 8 |
| scikit-learn | 20 | 16 | 7 |

Threshold = ceiling(0.8×N). All paired-gate failures block even an otherwise N−1/N result. No partial credit, cross-attempt stitching, practice completion or notebook self-attestation substitutes for independent mastery. A passing module attempt marks only correctly answered objectives mastered; missed noncritical objectives retain remediation. Later failures preserve already earned original-scope mastery.

Recommended detailed policies:
- Recommended prerequisites and direct assessment entry, no compulsory Math redo or route lock.
- Two guided practice variants with two valid submissions each; reveal/remediate/new review-cycle recovery after both are exhausted.
- Three independent forms, unlimited A→B→C→A retries, changed semantic cases, review/explicit confirm and explanatory results. No lowered gates after failure.
- Persist counters/drafts/results; review reload requires confirmation again; latest 20 summaries scoped to their assessment, no cross-module loss or silent version reinterpretation.
- No aggregate Python phase credential or claim of unrestricted-code certification.

Residual risk: finite client-visible forms can be memorized or inspected. Paired reasoning, counterexamples and semantic variants reduce superficial pattern use but do not eliminate it. Preserve this limitation in the later pedagogical audit; do not pretend three forms provide exam security.

## 5. Dependency and Colab compatibility assessment

### What is supported by current evidence

Official release metadata confirms candidate direct releases and their advertised Python lower bounds: [NumPy 2.5.4](https://pypi.org/project/numpy/2.5.4/) requires ≥3.12; [pandas 3.0.6](https://pypi.org/project/pandas/3.0.6/), [Matplotlib 3.11.2](https://pypi.org/project/matplotlib/3.11.2/) and [sklearn 1.9.1](https://pypi.org/project/scikit-learn/1.9.1/) advertise ≥3.11. **Inference:** CPython 3.13.16 meets those lower-bound conditions; that is necessary evidence only, not a solved transitive/ABI compatibility test.

Retain that exact direct-pin target for feasibility review. Do not install, change root dependencies, fabricate a SciPy/tool lock or declare it supported yet. The new-notebook **verified release-support list remains empty** until clean runs exist. The previous ad hoc environment is not a substitute; existing Mathematics notebook support is untouched.

### Remaining evidence gates

- Exact transitive SciPy/joblib/threadpoolctl/plotting dependencies, notebook/kernel/test tools, wheels/hashes and security review.
- Actual clean local execution for the chosen OS/architecture, repeated fresh kernels and declared numeric tolerance.
- Actual Colab CPython patch/OS and a passing pinned profile. If Colab is older than Python 3.12, the NumPy target is incompatible; do not silently downgrade or assume pip changes the kernel.
- Full author-owned data values/checksums and complete notebook prediction/metric outputs, not just analytic anchors.
- Confirm that optional Colab's ordinary host account is acceptable. No notebook secret, paid service/GPU, Drive mount, API credential or external learner data upload is required. Local execution must be credential-free.

The [Colab FAQ](https://research.google.com/colaboratory/faq.html) describes account-private runtimes and variable runtime availability. Do not promise anonymous access or guaranteed free resources. An optional second exact tested profile needs approval and parity evidence.

### Reproducibility/clean-run procedure

Blueprint section 11 now fixes seed 42, explicit randomized versus nonrandomized splitters, H01–H12/H13–H16 memberships, column/dtype/category/ddof/quantile conventions, sequential jobs/threads and six notebook analytic/output contracts. It defines isolated hash-locked setup, approved packages only, fresh kernels, offline data execution after setup, all-cell assertions and two clean repetitions; then actual free-CPU Colab preflight/restart/run-all with full version evidence. No existing environment is modified.

No new notebooks currently exist to execute. Complete output hashes and Colab support remain **NOT VERIFIED**, rather than a false “specification validation passed” claim. This is the principal remaining binary/reproducibility freeze gate.

## 6. Revised implementation estimate and reuse

Assumptions: five working days/week; one accountable engineer/author with curriculum and QA feedback available; no parallel-agent staffing assumed. Module rows include their own notebook content, variant authoring, feedback and local component/parity/mastery tests. Shared notebook infrastructure is counted separately only once. External review/access delays can extend calendar time.

| Workstream | Authoring/development days | Local testing/validation days | Total working days |
|---|---:|---:|---:|
| Shared finite evaluator/contracts/evidence foundation | 4–5 | 2–3 | 6–8 |
| Python Essentials, eight lessons | 4–5 | 1–2 | 5–7 |
| NumPy, six lessons | 3.5–5 | 1.5–2 | 5–7 |
| pandas, six lessons | 3.5–5 | 1.5–2 | 5–7 |
| Visualization, five lessons | 3–4 | 1 | 4–5 |
| Data Preparation, six lessons | 3.5–5 | 1.5–2 | 5–7 |
| sklearn, five lessons | 3.5–5 | 1.5–2 | 5–7 |
| Shared data/template/environment/Colab feasibility | 3–4 | 1–2 | 4–6 |
| Cross-module/old-module regression, browser/manual accessibility integration and report | — | 6–8 | 6–8 |
| Explicit uncertainty/rework contingency | — | — | 5–8 |
| **Total** | | | **50–70 days / 10–14 weeks** |

This supersedes 7.5–11.5 weeks, not a commitment to a deadline. The principal variance is authoring/review of 720 family instances, version-sensitive library corner cases, notebook/Colab compatibility and genuine accessibility evidence.

Reuse opportunities already reflected in the estimate:
- Existing native controls, panels, skip links, tables, focus/error patterns and lesson navigation; no design-system redesign.
- Existing conceptual/numerical/constrained-code helpers with strict Python-local adapters, not a rewrite of the shared assessment model.
- Existing evidence vocabulary and later Math scope/history patterns, not accounts/database or cross-device transport.
- Existing verified dot/matrix/regression/summary traces where contracts match; separate fixtures for library-specific behavior.
- One notebook template, three small data bundles and one fixture pipeline across modules.
- Trusted reference outputs and finite recipes instead of implementing NumPy/pandas/sklearn or a general Python interpreter in JavaScript.
- Existing Vitest/pytest/parity/build workflows and the cumulative quality register.

These are implementation-effort savings, not reductions in lessons, conceptual examples, paired critical gates, feedback, variants or manual acceptance standards.

## 7. Proposed Task 013.1 scope and acceptance

**Not authorized by this review.** Recommend an 8–12-working-day foundation/prototype milestone only after separate founder approval:

1. Freeze reviewed typed content/exercise/fixture/evidence contracts, strict finite adapters, exact resource budgets and dataset manifest fields without changing shared Math contracts.
2. Deliver one P01 vertical lesson with its four objective families, two guided variants, bounded experiment, misconception feedback, restore/reset and keyboard/320px behavior. It is one of the 36, not an extra lesson.
3. Use P01 independent variants only for content/scoring tests initially. Do not expose a misleading four-item Essentials module mastery shortcut: the real module assessment remains unavailable until all 32 families exist.
4. Add trusted nonlesson feasibility probes for N03 broadcasting, D05 cardinality and T02 training-only fit provenance to prove the fixture/validation boundary; not full new lessons/modules.
5. Resolve/test the approved isolated direct/transitive/tool environment and reusable notebook-template/P01 section. Stop on incompatible pins, security issues or a materially different Colab profile; request approval rather than silently substituting.
6. Exercise threshold/C-list scoring contracts for all six planned policies using clearly synthetic fixtures, separate from actual authored educational coverage.
7. Prove accepted/rejected equivalence, tolerance edges, malformed/oversize/prototype/duplicate storage cases, practice exhaustion recovery, bounded repeated persistence, correct module isolation and preservation of all old Math/Regression behavior.
8. Run regression/type/build/template tests and actual P01 keyboard/320px checks; actual AT/zoom where possible or record owner/blocked procedures. Report genuine execution evidence separately from metadata or source review.
9. Deliver a reviewed prototype/dependency/test/limitations report and stop before 013.2.

Out of 013.1: remaining 35 full lessons, six completed notebooks/assessments, general interpreter/parser/service, uploads, accounts/database/migrations, new algorithms/capstones, commercial configuration, deployment, external learner testing or any next major task.

Exit requires evidence for the scoped contracts/prototype and a clear founder decision on any environment/manual acceptance gap; a prototype pass never means all Task 013 acceptance is complete.

## 8. Founder decisions and freeze recommendation

| Decision | Recommendation |
|---|---|
| Confirm revision 0.2 detail corrections while retaining accepted counts/floor | Approve traceability, exact C mapping/failure paths, 36 depth safeguards and no mastery from completion |
| Approve bounded evaluator/persistence/retry details | Adopt finite recipes/whole-tuple equivalence, coherent budgets, canonical new-Python storage and explicit review-cycle recovery; no old policy changes |
| Approve reference-profile feasibility and optional Colab account distinction | Keep exact direct targets provisional; require solved/security-reviewed tool/transitive locks and real runs; local credential-free execution mandatory |
| Approve revised budget/review cadence | Plan 50–70 working days with module-level gates; do not cut educational/mastery depth to preserve the previous estimate |
| Assign manual accessibility owners/target matrix | Retain real screen-reader and 200%/400% zoom as OPEN; source/AX/320px is not closure |
| Decide whether to authorize narrow 013.1 next | Issue a separate explicit authorization only after reviewing this scope; nothing starts automatically |

**Recommended freeze:** conditionally accepted structure + reviewed pedagogical/scoring/safety contracts can become the specification baseline after founder sign-off. Keep environment binary locks, full fixture/notebook outputs and actual Colab support as unresolved evidence gates to close in the authorized implementation sequence. Do not stamp them verified before execution.

## 9. Validation, change log and stop boundary

Document audit: 36 unique lessons; 144 objectives; 41 explicit failure/remediation rows; three noncritical introductions; six assessment scopes; 720 unique planned family-instance IDs; 111 backward-only prerequisite edges; threshold/budget arithmetic consistent. All 36 lesson entries contain the required depth/practice/success fields. These are specification checks, not passing runtime or learner tests.

Revision changes are limited to the five specification/register documents plus this report. No protected application/runtime/contract/notebook/dependency file is changed; the 267-file protected snapshot is checked before and after. No packages installed, new runtime/lesson/data/notebook files created, learner progress read/written, application tests/build rerun, deployment, migration, commercial change or external learner testing. Source metadata browsing does not establish package compatibility.

Change log by document:
- Blueprint: conditional-approval status, revised stage/cost estimate, exact target-versus-supported profile/seed/split/output/clean-run contracts and freeze gates.
- Matrix: all 36 explicit motivation/progression entries, D03/T05 sequencing corrections, formal exercise/assessment ID mapping and required-topic coverage ledger.
- Mastery/evaluator: 41 explicit failure routes; strict operation/answer registry; numeric/slot adapter boundary; response/history/canonical-storage/state budgets; exhausted-practice recovery.
- Acceptance: new budget/recovery/growth/profile criteria and narrow 013.1 exit gate; no acceptance marked passed.
- Quality register: conditional structural status, revised risks/cost and link to this report; implemented Math inventory and historical evidence left intact.

Genuine screen-reader and browser zoom verification remain **OPEN / NOT VERIFIED**. Comprehensive depth review follows all planned modules/capstones; external learner testing follows full V1 and separate authorization. **Stop after this review; Task 013.1 remains unstarted.**

