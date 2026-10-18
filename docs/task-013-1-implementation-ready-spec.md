# Task 013.1 — Foundation and P01 Vertical Prototype

**Authorization and execution recorded, 16 October 2026:** founder approved the detailed policies/local profile and authorized exactly this milestone. Scoped implementation and evidence are in [TASK_013_1_COMPLETION.md](TASK_013_1_COMPLETION.md). The candidate/future authorization wording below is retained as the original approved boundary, not permission to start 013.2. Full reference acceptance remains separate from implementation completeness.

16 October 2026. Implementation-ready **candidate**, not implementation authorization. Depends on approval of [detailed policies](task-013-founder-policy-decision-matrix.md). Existing 36/144/41 baseline remains unchanged. Estimated 8–12 working days within the 50–70-day total forecast, not additional to it.

## Bounded deliverables

1. Python-local immutable exercise/fixture/evidence contracts, strict answer adapters, deterministic scorer and canonical bounded persistence wrapper. Reuse existing UI controls, evidence shapes, feedback and lesson-shell patterns where they fit; do not change old Math contracts.
2. Only **P01 Values, names, operators and units**: four objective families, two practice variants per family (eight family instances), one bounded experiment, targeted remediation and meaningful completion evidence. Three independent P01 variants per family (12 instances) are **test-only**, not a four-question substitute for the 32-family Essentials assessment.
3. Trusted nonlesson reference probes only: N03 broadcasting, D05 join cardinality, T02 train-only fitting. No routes/lessons/module completion/mastery for these probes.
4. Reusable notebook-template/P01 section feasibility and locked reference outputs. The current verification-only notebook proves a limited environment path; it is not production P01 content or one of six completed module notebooks.
5. Automated policy/safety/persistence tests, existing-module regression suite, real keyboard and 320px checks; evidence report and stop for founder review.

Out of scope: P02–P08, other module lessons/assessments, full canonical datasets/six notebooks, arbitrary execution service/parser, uploads, database migrations, dependencies in the app without separate reviewed need, redesign, teaching system, deployment, learner testing, capstones and 013.2.

## Explicit P01 coverage

Prerequisite: none; optional existing Algebra weighted-sum recall, no hard lock.

| Family | Learning and practice | Independent test-only intent | Incorrect reasoning and remediation |
|---|---|---|---|
| P01.O1 | Distinguish int/float/str/bool in a realistic feature record; type-tagged values before syntax names. | Classify a changed customer field; do not simply repeat the worked field. | Numeric-looking text is still text; compare values with identical display but different type tags. |
| P01.O2 **C** | Weighted prediction with correct type/order/units; start with area=2, weight=100, bias=50 →250 ($k), then contrast text repetition. | Exactly two scoring atoms: changed weighted expression result/unit choice and correct reason rejecting string repetition as a numerical prediction. Each form covers types, order and units through the paired task, not an OR between subskills. | Correct arithmetic with wrong units/reason fails C. Substitute terms into the existing Algebra trace, contrast '2'*3='222', then require a changed counterexample. |
| P01.O3 | Assignment updates a name's value; equality comparison returns bool without reassignment. | Trace two assignments and a comparison with changed values. | Name/value step table separates update from comparison; no equation-solving analogy that implies assignment is symmetric. |
| P01.O4 | Choose parentheses and explicit safe numeric conversion for a supplied expression; failed conversion is an error, never zero. | Finite repair slots for changed precedence/conversion case. | Compare expression trees; show ValueError for supplied invalid text with safe explanatory feedback. |

Every family needs a small worked case, a changed-condition guided case, reduced-scaffolding assessment intent and an ML interpretation. The experiment changes a finite authored input/operator choice, asks for prediction before reveal, and provides value/type/unit text alongside any visualization. Completion requires four correct practice families, a meaningful input change and correct bounded explanation. No mastery from lesson completion.

## Evaluator capabilities for this prototype

- Accept choice IDs, finite numeric values and predefined slot/choice IDs needed by P01; explicit unanswered sentinel on confirmed submission. Numeric representation cannot impersonate a bool. Unit/reason responses are bounded IDs, not free prose.
- Support only authored P01 literal/type/assignment/equality/arithmetic/parentheses/conversion outcomes. Displayed Python is not parsed or run by the frontend/backend. Use preset immutable state IDs and trusted reference fixtures.
- Generic schema/scorer contracts may define future shape/order/cell atoms, but no future lesson implementation is authorized by that type definition. Nonlesson probes validate the shared future contract, not learner runtime access.
- Enforce all E1–E4 bounds, strict extra-field/duplicate-ID rejection and finite equivalent whole tuples. Relative tolerance is a Python-local adapter; no changed Math numerical semantics.
- Author fixtures cover every allowed experiment state (≤64), every accepted repair tuple (≤8), and wrong-type/unit/precedence/conversion counterexamples. Trusted Python reference generation receives authored fixtures only, never learner text.
- Safe failure distinguishes unsupported exercise configuration, invalid response schema and valid-but-incorrect answer. Never echo hostile source, stack traces, secrets or answer keys.

## Mastery and progress invariants

- Full Essentials remains unavailable until all eight lessons/32 independent families and all eight critical gates have reviewed coverage. No “P01 module mastery” and no production learner evidence from synthetic fixtures.
- Synthetic contract tests cover all six denominators (32/24/24/20/24/20), passing integers (26/20/20/16/20/20), and all 41 C IDs. Missing/one-wrong critical atom fails even with every other family correct. No cross-attempt union.
- Use separate Python Essentials scope; honor hydrate-before-write, stable IDs, replay idempotence, persisted review cycles and same-version prior mastery preservation. Active/review/submitted restoration follows M5/P1/P2.
- Existing Math/Regression storage and evidence are read only where recall requires it and are never cleared, rescored, migrated or rewritten by Python storage.

## Automated acceptance contract

| ID | Required evidence before prototype acceptance |
|---|---|
| P01-01 | Eight unique practice and 12 test-only independent family instances cover all four objectives; each P01.O2 instance tests decision plus reason; changed data/failure conditions, not option shuffle alone. |
| P01-02 | Trusted reference tests prove every allowed P01 experiment state and repair; numerical/type/unit anchors and conversion failure are correct; nonlesson broadcasting/join/fit probes match frozen semantics. |
| SAFE-01 | Positive/negative fixtures for every enabled atom; equivalent tuple accepted, hybrid tuple rejected; tolerance exact-boundary/just-outside tests; bool/string/NaN/Infinity rejection. |
| SAFE-02 | Maximum allowed payload accepted; one-over byte/depth/shape/config bound rejected; unknown/missing/duplicate IDs, prototype keys and noncanonical/duplicate-member storage rejected. No eval/Function/child process/learner-code execution path in application. |
| SCORE-01 | Below/equal/above each integer threshold; each of 41 critical families failed in turn; either critical atom wrong; unanswered critical; malformed submission; no best-of-attempt combining, no completion→mastery. Synthetic tests explicitly labeled. |
| RETRY-01 | Two valid submissions each on A/B, exhaustion remedy/counterexample/review-cycle recovery; counters persist; invalid payload does not consume attempt; independent A/B/C rotation/idempotence and feedback timing. |
| STORE-01 | Fresh/null, reload/hydration, wrong scope/version, corrupted bytes, future format, read denial/write denial/quota, canonical duplicate rejection; memory mode has visible not-saved warning; unsupported bytes never overwritten. |
| STORE-02 | Repeated saves stay ≤256 KiB; retain mastery while trimming to 20 summaries; latest full response only; active/review/submitted restoration and reset boundaries. Seed old Math/Regression evidence before Python actions and assert byte-identical old keys afterward. |
| REG-01 | Existing frontend/TypeScript tests, Python tests, typecheck and production build pass with recorded commands/counts. Run old Math/Regression scorer/persistence/interaction regressions; do not weaken assertions to pass. |
| NOTE-01 | Clean exact locked environment, fresh-kernel restart-and-run-all twice, expected outputs/fixture hashes checked; no downloads/secrets/uploads required inside notebook. Actual Colab is separately evidenced or marked blocked; candidate local success is not a Colab pass. |
| UI-01 | Keyboard-only input/submit/error/retry/reset flow with visible focus and no trap; 320px prose/forms/feedback reflow and intentional code scroll; all visual results have numerical/text alternatives. Capture actual browser evidence. |
| UI-02 | Attempt genuine screen-reader and 200%/400% browser zoom, retain open named obligations if unavailable. AX snapshots/viewport resizing never count as these checks. No full accessibility acceptance without real evidence. |

## Dependencies, regression protection and stop

Before implementation: founder must approve pending policy details and candidate environment governance; separately authorize this exact 013.1 scope. Colab remains an explicit acceptance dependency: owner-run verification using an available runtime/profile is required before claiming its support. If unavailable, founder may separately accept implementation completeness with that obligation open, not label full reference acceptance.

Preserve the 267-file baseline during this specification milestone; **a future authorization to implement will necessarily identify a new reviewed application change set**, not retroactively authorize changes now. Reuse existing lessons/runtimes/evidence/UI; do not add an interpreter or refactor old systems for uniformity. Significant schema/runtime/policy deviation stops for a product decision.

Completion report must separate implemented artifacts from test fixtures, list all executed commands/results and unverified browser/Colab obligations, show no Math/Regression drift and identify remaining module work. Stop after 013.1 review report, before 013.2 or any next major task. No deployment or external learner testing.
