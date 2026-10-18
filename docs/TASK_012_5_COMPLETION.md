# Task 012.5 — Calculus finalization and Probability preparation

Date: 15 October 2026. **Essential Calculus coverage is implemented. Comprehensive accessibility/learner verification remains open.** Work stops after Calculus; Probability and the teaching design system were not started.

## Calculus coverage matrix

| Approved objective | Before this task | Final coverage and evidence |
|---|---|---|
| Local versus average change; derivative meaning/units | Implemented in the six-moment Why lesson and Secants module | Preserved; existing component/math regressions pass; all seven pilot entries open in the browser |
| Secants, tangent intuition, analytic/numerical slopes | Implemented | Preserved calculus runtime; native h control and secant completion checked in browser |
| Constant, power, sum, product, quotient, chain, exponential and log rules | Implemented rule cards and worked examples | Retained; quotient example now has unambiguous parentheses and a correct domain/formula; existing power/chain checks retained |
| Chain rule and ML loss sensitivity | Implemented | Existing missing-input-factor repair still returns −8 against its numerical reference; historical mastery prompt now asks for the coefficient that its unchanged scorer actually expects |
| Limits and continuity, holes and jumps | Essential gap | Same-route extension defines the concepts and compares left/point/right values with analytic conclusions; hole limit exists while value is undefined; jump limits disagree |
| Corners and failure of differentiability | Essential gap | Absolute-value corner explicitly has slopes −1/+1 and no derivative despite symmetric estimate 0; differentiability versus continuity check added |
| Partial derivatives, holding other inputs fixed | Essential gap | Native x/y controls for g=x²+3y² and a saddle; analytic and finite-difference partials agree; new objective checks |
| Gradient and input order | Essential gap | ∇g=[2x,6y], with worked ∇g(1,2)=[2,12], numeric readout and checks |
| Directional sensitivity versus parameter update | Essential gap | Unit directions and ∇g·d are distinguished from displacement −η∇g; bounded one-step example only |
| Simultaneous parameter reasoning | Essential gap | Both partials use the original point; coupled q=(x+y)² example distinguishes simultaneous (0.4,1.4) from a sequential y update of 1.52; critical check tests the original-point calculation |
| Stationary-point caution | Not explicitly covered as a subject essential | Saddle x²−y² at the origin shows why zero gradient need not mean minimum |
| Jacobian output-by-input orientation | Introductory gap | Integrated live table for F=[x+y,xy], J=[[1,1],[y,x]]; at (1,2), [[1,1],[2,1]]; noncritical introductory item |
| Hessian curvature/symmetry | Introductory gap | Integrated tables diag(2,6) for the bowl and diag(2,−2) for the saddle; noncritical introductory item |

This matrix follows the approved practical Mathematics Foundations blueprint. No proof-heavy analysis, arbitrary symbolic engine, general sensitivity solver or optimizer implementation was added.

## Essential fixes and scope control

The existing /math/derivatives route, seven pilot modules, six-moment Why experience, scalar runtimes and notebook were retained. New material lives in a compact appended section at /math/derivatives#calculus-essentials. Two table-based experiments provide meaningful interaction without a visual redesign:

1. Continuity examples: smooth quadratic, removable hole, jump and corner; shrink nonzero h and compare both sides. Formula-based conclusions are explicitly distinguished from a finite sample or a symmetric numerical heuristic.
2. Partial/gradient experiment: change coordinates, function, unit direction and illustrative step; compare analytic/numerical gradients and the single simultaneous update. Jacobian/Hessian introductions share these controls/readouts instead of creating a separate teaching system.

Three existing pilot defects were corrected narrowly:

- Quotient wording now means x²/(x+1), with its derivative and x≠−1 domain.
- The mastery item previously called 6 the missing factor of the chain rule, although the inner factor is 3. It now asks for c in d/dx(3x−1)²=c(3x−1); c=6 is correct, so the existing scorer and all earned scores remain unchanged.
- Correctly entering 14 in the calculation alone no longer completes all Guided practice. Sign, calculation and application must be demonstrated before Record guided practice is available. Earlier saved completion is not removed.

Legacy storage read/write exceptions now show a warning rather than crashing the page. CSS additions are limited to extension reflow, form sizing and keyboard focus. No lesson engine, teaching design system, cosmetic overhaul or broad refactor was introduced.

## Objective checks and progress behavior

Original progress key, seven module IDs, historical assessment variants, five-field scorer, best score and 4/5 mastery policy are preserved. The header and success text identify this as pilot mastery, without implying the new extension was assessed.

New extension evidence uses the existing LearningEvidenceV1 and exercise contracts:

- Key: ml-math-lab:evidence:math.calculus.extension:v1; curriculum version calculus.extension.v1.
- Assessment ID: calculus.extension.assessment.v1; extension mastery objective calculus.extension.mastery.v1.
- Twelve questions in two changed-value variants: ten essentials and two introductory matrix items.
- Threshold 80% means 10/12, plus five critical essentials in one submission: limit reasoning, jump/two-sided reasoning, corner/differentiability, partial-x and simultaneous update.
- Both introductory items are noncritical. A test confirms all ten essentials can pass with both introductory items omitted. 9/12 fails; 11/12 with any critical miss fails.
- Exploration is recorded separately and never awards mastery. Correct objective evidence, recent score summaries and earned extension mastery persist; later failures retain earlier earned mastery.
- Historical pilot mastery is neither imported nor silently upgraded. Other subjects and legacy notebook/lesson state are untouched.
- Twenty own extension attempt summaries are retained without trimming unrelated histories. Future/corrupt extension evidence is preserved rather than relabeled or overwritten; save failures are visible.
- Unsubmitted extension answers are deliberately not persisted. This bounded implementation adds no new draft/migration framework; the UI states this limitation.

The extension assessment is scoped to these new objectives, not a new whole-curriculum certificate. An aggregate pass does not establish that every missed noncritical objective was understood.

## Mathematical and regression verification

Added bounded continuityTrace/multivariableTrace with Python equivalents. Existing calculus.ts and calculus.py semantics are unchanged. Named inputs enforce finite coordinates, nonzero bounded sampling intervals and bounded illustrative step sizes. The new schema is calculus-extension.v1.schema.json, with eight frozen Python-generated traces in calculus-extension.v1.json.

Verified references include the hole limit 2, undefined jump limit, absolute-value corner despite central estimate 0, ∇g(1,2)=[2,12], simultaneous g update [0.8,0.8], unit directional derivatives, Jacobian orientation, Hessian symmetry and the saddle case. Smooth partials are compared against central finite differences. Invalid/nonfinite/overflow-scale inputs and zero/tiny/out-of-range sample intervals are rejected. The coupled-update check has independent hand-calculated expected values.

| Verification | Result |
|---|---|
| Focused Derivatives + extension/runtime tests | PASS: 26 tests in five files |
| Full frontend/TypeScript regression suite | PASS: 248 tests in 42 files |
| Full Python suite | PASS: 99 tests |
| New parity/schema fixture validation | PASS: eight traces; unsupported schema version rejected |
| Type checking | PASS |
| Production build | PASS: 35 static pages |
| Protected existing-file snapshot | 127 of 130 byte-identical; changes limited to additive runtime export, required topic fixes/integration and its scoped existing test |

Commands: npm test; npm run typecheck; npm run build; PYTHONPATH=python work/task-011-verification-venv/bin/python -m pytest python/tests -q. Logs are in work/task0125-*.log. A test-only unsupported Testing Library option was removed before the final successful type/build run.

## Browser verification and accessibility

A separate local origin was used for browser checks, preserving the existing preview's learner state:

- All seven pilot modules opened independently. The secant interval and chain-rule repair behaved correctly.
- The practice calculation alone left completion unrecorded; sign/application plus explicit recording completed it.
- The clarified historical mastery prompt scored a deliberate 4/5 attempt as before; best score/mastery survived reload.
- Hole, jump and corner controls displayed the expected limit/undefined/slope distinctions. Native partial controls kept analytic and numerical values aligned.
- Extension 11/12 with a critical miss awarded no new mastery; a changed-value 12/12 retry passed. Original pilot 4/5 remained, and separate extension mastery plus score summaries survived reload.
- The final coupled-function simultaneous item is covered by hand-reference/component tests and a fresh browser submission using y=1.4, which passed 12/12.
- All seven pilot states and the new extension measured document width 320 at a 320 CSS px viewport. A native sequential Tab walk from the extension anchor reached submission after 26 stops. Viewport override was reset.

Implemented controls are native and labeled; numeric tables provide alternatives to new visual concepts, scroll regions are named, and results use status feedback.

**Open acceptance requirements:** actual screen-reader speech, genuine 200%/400% browser zoom, full contrast/nontext/focus review, text spacing, target sizes, reduced-motion preference and the complete supported-browser/device matrix. No full accessibility-scanner pass or formal learner validation is claimed. These remain owned in RELEASE_ACCESSIBILITY_QA_BLOCKERS.md. Implemented coverage is therefore distinct from fully verified release acceptance.

## Implementation and documentation status

Calculus essential coverage is implemented, with full automated correctness/regression checks and scoped browser verification. The preserved Derivatives pilot is no longer presented by canonical module metadata as universally verified; its historical records and scoped earlier lesson labels remain intact.

New files: packages/math-runtime/src/calculus-extension.ts; python/mlmath/calculus_extension.py; runtime/Python tests; calculus-extension.v1 schema and fixture; derivatives/calculus-essentials.tsx, extension-model.ts, extension-catalog.ts and extension.test.tsx.

Modified integration: runtime index export, derivatives/topic.tsx and its existing test, canonical reference catalog, mathematics hub copy and narrowly scoped extension CSS. All previous mathematical runtimes, existing schemas/fixtures, notebooks, Algebra, Linear Algebra and Linear Regression source remain unchanged. No Git repository is present; preservation uses the source inventory and hashes.

Updated: Mathematics Blueprint, curriculum master plan, implementation status, roadmap, conceptual-depth backlog, release-blocker register and this coverage/completion report. Deeper rule-card uniformity and broader pedagogical/variant validation remain later refinement work, not a reason to rebuild the pilot now.

## Recommended next scope: Task 012.6 Probability foundations

Proceed only after founder approval. Keep Probability independent from Statistics in navigation/catalog and implement the approved essential sequence:

1. Events/sample spaces, valid probabilities, complement, joint/addition rules and mutually exclusive versus independent events.
2. Conditional probability and independence using finite count tables; reject zero conditioning denominators and explain the population being conditioned on.
3. Bayes and base rates. Use the blueprint reference: 10/1000 prevalence, 9 true positives and 99 false positives yield 9/108 positive predictive probability, not 9/10.
4. Random variables, expectation and bounded Bernoulli/binomial/normal interpretation; distinguish continuous density from point probability. Statistics inference/CLT/intervals remain 012.7.

Use the planned Event/Conditional Probability Explorer, Bayes Frequency Table and Distribution Explorer, with deterministic bounded math, TS/Python parity, original finite datasets, accessible counts/tables and objective-level checks. Pin the Probability assessment's essential critical gates before implementation, preserving all existing namespaces. Verify probability mass/normalization, conditional denominators, Bayes references, deterministic variants, persistence and available browser interactions. Do not start a teaching design system or expand into formal learner testing.

Probability code, routes, runtime and assessment were **not implemented in Task 012.5**. No deployment occurred. Stop here and await founder approval.

