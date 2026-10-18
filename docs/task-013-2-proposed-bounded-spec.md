# Task 013.2 — Proposed Bounded Implementation Specification

**Founder scope approval recorded and implemented — 16 October 2026.** The founder explicitly approved this complete P01–P08 boundary, separate Essentials scope and opt-in copy-only transition. The pause/proposal language below is historical, not an outstanding decision. [Completion evidence](TASK_013_2_COMPLETION.md) and [exact mapping](task-013-2-p01-evidence-map.md) are current. No013.3 authorization or implementation.

16 October 2026. **Scope verification completed; implementation paused pending founder approval of this boundary and evidence-transition decision.** No application changes, dependency installation or Task 013.3 work.

## 1. Verified allocation versus unresolved specification

Sources reviewed:
- [Blueprint, implementation sequence](task-013-python-ml-blueprint.md): explicitly assigns “Eight Essentials lessons (including the promoted P01 prototype), notebook and independent assessment with module-local tests” to013.2; indicative effort5–7 working days.
- [Lesson/objective matrix](task-013-lesson-objective-matrix.md): defines P01–P08, four families each, prerequisite recall, teaching depth, assessment intent and remediation.
- [Approved mastery/evaluator policies](task-013-mastery-and-evaluator-spec.md), [policy decision matrix](task-013-founder-policy-decision-matrix.md) and [acceptance criteria](task-013-acceptance-criteria.md).
- [013.1 implementation-ready boundary](task-013-1-implementation-ready-spec.md) and [completion report](TASK_013_1_COMPLETION.md): P01 delivered; real module assessment/history remains unimplemented; prototype evidence must not be silently relabeled/rescored.

The curriculum allocation is **not inferred from the milestone number**: the blueprint explicitly names eight Essentials lessons. However, no dedicated approved013.2 implementation-ready specification was found. The existing full-module row does not settle how the P01-only envelope becomes a mastery-capable module without losing/reinterpreting progress. Current founder authorization is conditional on verified bounded scope and requires a stop for ambiguity; therefore this document is a proposal, not permission to implement.

## 2. Proposed exact curriculum boundary

Retain/promote P01 and implement P02–P08 only. All prerequisites remain recommended recall links, not hard access locks.

| Lesson | Four objective families, O1–O4 respectively | Critical family | Prerequisites |
|---|---|---|---|
| P01 Values, names, operators and units | Classify value types; weighted-expression type/order/units and text repetition; reassignment versus comparison; grouping/conversion and failure. | P01.O2 | None; optional Algebra recall. |
| P02 Collections, order, indexing and mutation | Choose collection by purpose; preserve feature order and distinguish aliases/copies; indexing/slicing; keys/membership without set-order assumptions. | P02.O2 | P01 |
| P03 Conditions and explicit missing-value rules | Comparisons/Boolean predicates; legitimate zero versus None; branch/boundary tracing; detect accidental population changes. | P03.O2 | P01–P02 |
| P04 Loops and reliable aggregations | Bounded loop/range tracing; correct accumulator/count/denominator; row pairing and zip truncation; empty-batch division guard. | P04.O2 | P02–P03 |
| P05 Functions turn repeated steps into contracts | Parameters/arguments/local state; usable return versus print; ordered function composition; mutable-default/input-mutation repairs. | P05.O2 | P01–P04; Algebra functions recall. |
| P06 Comprehensions as readable transformations | Equivalent loop/comprehension with order; record-level filtering preserving feature/target alignment; duplicate dictionary keys; readable map/filter/reduce distinctions. | P06.O2 | P02–P05 |
| P07 Debugging, exceptions and imports | Failing line/error class; explicit invalid-input handling without fabricated zero; curated import binding; syntax versus plausible logic errors and exposing counterexamples. | P07.O2 | P03–P06 |
| P08 Reproducible small programs and local data | Record schema/conversion/missingness validation; resource/read/parse/validate/close flow; preset validated program composition; introductory independent instance attributes/methods. | P08.O1 | P02, P05, P07 |

Canonical IDs expand to python.essentials.p01.o1 through python.essentials.p08.o4. Total32 families:31 essential plus introductory/noncritical P08.O4. All eight listed critical families retain two required scoring atoms, decision/repair/calculation AND reason/counterexample.

## 3. Exercise inventory and mastery

| Inventory | Existing013.1 | Proposed013.2 delivery | Final Essentials total |
|---|---:|---:|---:|
| Lessons | 1 prototype | 7 new plus P01 review/promotion | 8 |
| Objective families | 4 | 28 new | 32 |
| Practice instances, two/family | 8 | 56 new; retain/review existing8 | 64 |
| Independent instances, three/family | 12 test-only | 84 new plus review/promotion of existing12 | 96 |
| Independent assessment forms | None learner-facing | Three complete32-family forms in one module assessment | 3 forms / 1 assessment |
| Critical families per form | P01 gate only, test-only independently | Complete all8; no partial assessment opening | 8 |
| Full module notebooks | None; P01 feasibility template exists | One Essentials notebook | 1 |

Module mastery remains unavailable until every form covers all32 families and all8 critical gates with verified fixtures/subskills and passing module tests. Thereafter pass requires **26/32 and every critical family fully correct in the same confirmed attempt**. No partial points, cross-attempt union, practice/notebook/completion award or synthetic evidence. A passing attempt masters only its independently correct objectives; missed noncritical objectives remain unmastered. Later failures preserve same-version earned mastery.

Practice: two valid submissions on each A/B variant per review cycle; persisted exhaustion/remediation/counterexample recovery; unlimited labeled review cycles. Independent: unlimited A/B/C rotation, active→review→explicit confirm→results, no correctness before confirmation, unanswered known atoms count wrong, malformed submissions do not consume attempts, submitted IDs idempotent. Retain latest20 compact summaries and latest full response, without trimming mastery.

## 4. Teaching, experiments and notebook

Retain P01's experiment; propose one focused experiment for each P02–P08:
- P02: feature order, index/slice and alias/copy edits on tiny records.
- P03: retained row IDs under zero/missing/boundary predicates.
- P04: accumulator/count/pairing trace including empty/truncated batches.
- P05: call frames, returned values and composed prediction/validation steps.
- P06: loop/comprehension equivalence, retained paired row IDs and duplicate-key overwriting.
- P07: preset traceback, narrow handling and good/bad counterexample traces.
- P08: embedded CSV/JSON resource/schema flow and separately inspected tiny instances.

Each requires a meaningful input/configuration change and correct bounded prediction/explanation, with accessible textual/numerical traces. Each lesson supplies motivation, terminology, mathematical connection, a worked case, changed guided case, ML use, misconception feedback and prerequisite recall before independent transfer.

Use small original fictional housing/customer/message records with stable IDs and embedded/local bundled assets; no learner uploads or remote data. A complete Essentials notebook develops the same progression and asserts trusted expected outputs. Preserve the existing P01 template/download as its original artifact; do not count it as a second full module notebook or silently rewrite its historical execution evidence.

P06/P07/P08 need the matrix's staged-depth safeguards, not compressed syntax tours. No inheritance, advanced OOP, general parser or new ML algorithm.

## 5. Evaluator and engineering boundary

Reuse Python-local finite choice/number/predefined-slot contracts, whole-tuple equivalents and inclusive absolute1e−9 plus relative1e−9 numeric tolerance. Use finite authored choices to represent ordered sequences, pairs and record outcomes where current atom types suffice; do not silently add a free-expression/array execution engine.

Allow only fixed reference states for the Essentials concepts in section2. Curated imports/file/class demonstrations are authored traces/trusted notebook examples, **not browser permission to import, read files or execute learner functions/classes**. Keep≤25-line/4-KiB snippets,≤32-step loop traces,≤64 authored configurations/activity,≤8 accepted tuples,≤512-byte atoms,≤1.5-KiB families,≤64-KiB submissions and≤256-KiB storage envelopes. Definitions that cannot fit must be redesigned within the approved concepts, not bypass guards.

No arbitrary Python/learner-code execution, dynamic evaluation, reflection/callable dispatch, unrestricted imports, networking, filesystem/shell access from responses, uploads or new service. Unsupported representations differ from valid incorrect reasoning; malformed definitions fail closed. No production dependency additions expected.

Suggested routing boundary: preserve /python and /python/essentials/p01; add an Essentials overview, P02–P08 lesson routes and one complete independent-assessment route. Route naming and navigation are implementation details within this boundary, not additional curriculum.

## 6. Founder decision required: P01 evidence transition

Existing prototype key ml-math-lab:python:essentials:v1 stores content python-p01.1.0.0 and intentionally rejects independent/mastery records. Extending/relabeling it in place would violate strict version isolation. The previous completion report explicitly deferred a reviewed transition.

**Recommended proposal for approval:**
1. Keep original v1 bytes and their version-scoped meaning untouched. Give the complete module a separately versioned Essentials key/envelope, proposed ml-math-lab:python:essentials:v2.
2. Offer an explicit, clearly explained **opt-in copy**, not automatic migration, from a strictly validated supported P01 record. Preserve the source even after success. If declined, disclose the retained historical P01 progress rather than presenting it as deleted.
3. Copy only semantically unchanged P01 practice completion, valid draft/counter/remediation state and experiment/lesson-completion evidence through an explicit reviewed field/ID map. Preserve source timestamps/provenance; validate the target before its single write. Do not import unsupported/corrupt/future records.
4. Never create independent attempts, objective mastery or module mastery from that copy. Old prototype completion is not a pass of the new32-family assessment.
5. Migration failure/quota leaves source bytes intact, target prior bytes unchanged, and visible in-memory/not-saved feedback. New module reset affects only the new scope; clearing historical prototype data needs separate explicit scoped consent. No Math/Regression/other module writes.
6. Freeze and test the concrete source→target field map before implementation uses it; if any objective/experiment semantics change, do not carry its completion automatically.

Alternative: keep P01 as a compatibility-owned lesson and project its original progress read-only into the new overview, without copying; this avoids migration but introduces split ownership/reset behavior. **Do not choose between these architectures silently.** This is a localStorage policy/schema decision, not a database migration.

## 7. Acceptance contract

| ID | Required before013.2 implementation completeness |
|---|---|
| SCOPE-02 | Exact8-lesson/32-family/8-critical/64-practice/96-independent inventory; all objective intent/remediation mapped; all three forms complete; no other Python module implementation. |
| EDU-02 | Each lesson meets the conceptual-depth checklist and has its meaningful experiment/accessible alternative; P06/P07/P08 staged examples reviewed. |
| REF-02 | Trusted Python↔TS parity for every exposed state, every accepted equivalent and critical counterexample; type/order/aliasing/missingness/pairing/return/error/schema/instance semantics correct. |
| SAFE-02 | Existing safety regression plus supported new fixture cases, malformed/unknown/duplicate/prototype/depth/byte/type/number failures; unsupported input never executes or consumes a valid attempt. |
| MAS-02 | Exact26/32,25/32,above-threshold and each critical-atom failure on every real form; wrong units/reason/row identity cannot pass; completion and imported P01 evidence cannot award mastery. |
| RETRY-02 | Practice exhaustion/recovery and independent A/B/C cycles persist; no pre-confirmation correctness; blank/invalid distinctions; idempotent submissions and unchanged previous mastery after later failures. |
| PROG-02 | Hydration/draft/review/results restoration, version/scope isolation, quota/read/write failure, retention/bounds, per-lesson resets preserving independent history; approved P01 transition success/decline/failure/unsupported cases preserve original bytes. |
| REG-02 | Full frontend/TS and Python regressions, math-runtime tests, typecheck and production build; existing Math/Regression/P01 semantics and stored evidence protected. |
| UI-02 | Actual keyboard flows and320px layout across new lessons/assessment/result/error/reset states; numerical/text alternatives and visible focus; returning-learner browser journey, not only parser tests. |
| NB-02 | Essentials notebook and unchanged P01 template execute deterministically in fresh local kernels with the approved exact profile; original bundled data, no secrets/uploads/external services; expected outputs recorded. |
| REPORT-02 | Inventory, commands/counts/artifacts, source/evidence preservation, architecture/register/status updates, limitations and explicit stop before013.3. |

Genuine screen-reader, genuine200%/400% browser zoom and genuine Google Colab remain open unless actual evidence is obtained. Attempt where available; record blocked scope/owner/procedure. Scoped implementation completeness is not full accessibility/Colab acceptance. No tests/build/notebook/browser acceptance has been run for this proposed milestone.

## 8. Exclusions and stop

No NumPy/pandas/Visualization/Preparation/sklearn module implementation, new algorithm, capstone, teaching-system redesign, database migration, deployment or external learner testing. Nonlesson013.1 scientific probes do not authorize those modules.

Founder decisions requested: **(A)** confirm this full-Essentials bounded013.2 allocation and inventory, or name a smaller explicit subset; **(B)** approve the recommended separate-scope/opt-in P01 transition, or choose the compatibility alternative. Existing mastery thresholds/safety policies do not require reapproval.

Stop at this specification proposal. Implementation starts only after those decisions resolve the conditional scope gate. After implementation, stop again for founder review before013.3.
