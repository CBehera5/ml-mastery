# Task 012.8 — Optimization Foundations completion

Date: 16 October 2026. **Implemented; not fully accessibility or learner verified.**
Local overview: http://127.0.0.1:3017/math/optimization
Experiment preview: http://127.0.0.1:3017/math/optimization/objectives#experiment

**Stop after Task 012.8. No deployment, external learner testing or Task 012.9 work occurred.**

## 1. Scope confirmation before implementation

The first action was to read the existing approved Mathematics Foundations blueprint's 012.8 specification, depth decisions, curriculum master plan, roadmap, Architecture, Mathematical Specification and Statistics completion report. Scope and acceptance criteria were confirmed to the founder before writing code:

- Essential: objective/loss meaning and units; opposite-gradient direction; simultaneous updates; learning rate/scaling; finite-run progress, stability and explicit numerical limits; stationary-point caution; regularization as a fit/complexity tradeoff.
- Approved labs: Loss Landscape Explorer, Gradient Descent Training History (reuse), Regularization/Stability Comparison.
- Introductory only: convex/nonconvex geometry, L1/L2 comparison, full-batch versus stochastic/minibatch and momentum.
- Excluded: advanced optimizer implementation/proofs, second-order methods, new model families, changing the verified Regression objective, integration milestone 012.9, deployment and learner studies.
- Acceptance: controlled same-start comparisons, analytic/central-difference parity, simultaneous updates, finite settings/stops, no iterations-completed-to-convergence inference, separate penalty terms, deterministic independent understanding checks, safe persistence and responsive/keyboard/motion/manual-accessibility obligations.

No architectural or curriculum ambiguity requiring a product decision was found. The existing blueprint supplied the specification; no new product policy was invented to bypass a conflict.

## 2. Lesson inventory and objective coverage

Eight new pages: /math/optimization overview, six lesson routes and /math/optimization/mastery.

| Lesson route | Four checked objectives | Depth |
|---|---|---|
| /objectives | Objective/units; gradient sign; sensitivity versus displacement; perturbation-based gradient checking | Essential |
| /updates | Simultaneous coordinates; learning-rate effect; oscillation/overshoot interpretation; finite settings | Essential |
| /geometry | Equal-height sets/slices; curvature/scaling; convex/nonconvex interpretation; stationary point versus minimum | First, second and fourth essential; convexity introductory |
| /stability | Budget versus convergence; visible numerical stops; fair same-start comparison; diagnostic next action | Essential |
| /regularization | Data/penalty decomposition; fit/complexity/validation tradeoff; shifted L2 optimum; L1 versus L2 | First three essential; L1/L2 comparison introductory |
| /responsible | Validation boundary; optimization versus generalization; batch/minibatch/stochastic intuition; momentum intuition | First two essential; optimizer variants introductory |

Each of 24 concepts includes purpose, plain-language meaning, mathematical/geometric intuition, representation and symbol explanations, worked numbers, ML application, misconception, deterministic understanding check and remediation. Each lesson has prerequisite recall and an experiment link. The intended application includes house-price fit, target units, training diagnostics and held-out decisions, not just algebra memorization.

## 3. Interactive experiments and reuse

### Loss Landscape Explorer
- Round quadratic, narrow anisotropic bowl, coupled coordinates, saddle and double-well presets.
- Adjustable coordinates and curvature; analytic gradient, norm, central-difference gradient and explicit numerical-check tolerance.
- Sampled 11×11 loss map with selected-point marker, shade explanation and all 121 coordinate/value rows; 41-point slice with the second coordinate held fixed.
- The map is explicitly sampled, not an exact contour reconstruction. Each visualization has a complete numerical/text alternative.
- At the saddle origin, gradient is zero; moving the second coordinate lowers the objective. This prevents treating a first-order stationary point as a minimum.
- Double-well examples show two equally deep minima without claiming every nonconvex landscape has that property.

### Gradient Descent Training History
- Deterministic simultaneous updates from a stated start, with current rate versus a same-start/reference-rate-1 history.
- Native controls for objective, start, curvature, finite rate and integer budget; invalid values produce explicit feedback and recovery.
- Previous/Next/Reset inspect parameter states; initial state 0 and later update indices are explained.
- No autoplay, timer or animation in the new histories: they are always paused between learner actions. Reset changes the view, not evidence or mastery.
- Data, penalty, total, coordinates, status and termination reason are visible in captioned tables.
- Reference quadratic: w=1, gradient −4, rate 0.1 gives 1.4. Rate 1 alternates 1/5 with loss 4 despite completing the budget.
- Coupled example: (1,2), gradient (6,6), rate 0.1 gives (0.4,1.4), not a sequentially recomputed second coordinate.
- Narrow-bowl instability stops with explicit limits; failed metrics are unavailable rather than fake zero.

### Regularization / Stability Comparison
- Separate toy L2 objective, never injected into regression.v1: (a−3)²+b²+λ(a²+b²).
- Same initialization/rate/budget compares unpenalized and penalized paths.
- Each row distinguishes data loss, penalty and total; λ changes objective curvature and can make a previously useful rate unstable.
- Prediction/repair question rejects “smaller weights guarantee better unseen predictions.”
- λ=0 reference minimum is (3,0); λ=1 is (1.5,0). Validation is required to justify a modeling tradeoff; no fictitious test improvement is invented.

### Preserved Regression bridge
- The comparison calls existing featureScalingTrace, regressionGradientCheck and regressionTrainingTrace on fixed fictional centered data, with equivalent zero-prediction starts and one shared rate/budget.
- Raw/scaled weight coordinates differ, so the interface compares losses rather than equating weights.
- The original house-price GradientLab component is rendered unchanged in expandable details, retaining Play/Pause/Step and its reduced-motion handling.
- Existing Regression population-standardization, MSE objective, original numerical limits and gradient semantics are preserved.

## 4. Understanding checks and mastery policy

- 24 objective checks, two deterministic variants: 48 versioned exercise definitions.
- Independent optimization.mastery.v1 requires **20/24 (at least 80%) plus all eight essential critical objectives in the same attempt**.
- Critical set: loss units, signed descent, simultaneous update, finite settings, stationary-point caution, budget/convergence distinction, regularization tradeoff and validation boundary.
- Introductory convexity/L1-L2/batch/momentum items are assessed but not critical.
- Numerical items test signed calculation and parameter reasoning; conceptual items test what evidence does and does not justify.
- Review lists every answer; editing resets consent; explicit confirmation is required before submission.
- Remediation links target failed objectives; alternate retry changes values/questions deterministically. No random outcome determines mastery.
- A 23/24 production attempt failed because it claimed completed iterations proved convergence. The unchanged critical gate blocked mastery; v2 24/24 then passed.
- No mastery policy was weakened to satisfy tests. Initial UI test failures were three ambiguous selectors, corrected by caption/text scoping rather than altering scoring or behavior.

## 5. Evidence, persistence and preservation

New evidence uses LearningEvidenceV1 with curriculum optimization.foundations.v1 and key ml-math-lab:evidence:math.optimization:v1. Existing evidence keys/versions remain unchanged.

- Practice records objective completion, not independent mastery.
- Lesson completion requires four correct checks plus an interaction/reflection record. Reflection is activity evidence, not a claim of learner comprehension.
- Latest 20 scoped submissions are retained; unrelated attempts are not trimmed. Duplicate submission IDs are idempotent.
- Earned mastery survives later failure. Stored objective, lesson and submission/mastery records survive reload.
- Unsubmitted answers intentionally restart on reload without submitting or consuming an attempt; the UI states this policy.
- Unknown/corrupt/future records are preserved with writes disabled and a warning; storage failures allow in-memory practice rather than silent data loss.
- Experiments/reset/view changes cannot erase previous mastery or rescore earlier subjects.

A pre-edit SHA-256 snapshot covered **200 existing source/contract/notebook files; 195 remain byte-for-byte unchanged**. The five intentional existing-file edits are scoped CSS, Math hub source/test, additive reference catalog integration and runtime exports. All five notebooks, existing lessons, experiments, assessment logic, mathematical runtimes and mastery implementations are unchanged. Regression tests cover all earlier subjects, including the accepted Statistics module.

## 6. Mathematical correctness evidence

New dependency-free TS/Python optimization.v1 runtimes add declared two-coordinate objectives, perturbation checks, sampled map/slice values, simultaneous bounded histories and separate L2 terms. New code wraps rather than edits existing Regression APIs.

**20 frozen cross-language/schema cases:** 8 objective states, 9 training cases (including failed states), 3 reused Regression comparisons. Python-generated fixtures validate against the new draft-2020-12 schema. TypeScript compares every corresponding numerical/structural leaf to tested tolerance.

Tests verify:
- Signed gradients/displacements and no input mutation.
- Simultaneous coupled update versus sequential recomputation.
- Analytic/central-difference gradients across all five shapes and several points.
- Complete sampled grid/slice correspondence with objective values.
- Zero-gradient saddle and double-well minima.
- Constant-amplitude oscillation despite iterations_completed.
- Explicit bounded numerical failure, preserved prior entries, null metrics and JSON without NaN/Infinity.
- Separate data/penalty/total values and analytic minimum 3/(1+λ).
- Equivalent initial Regression predictions, raw/scaled trajectory differences and exact reuse of the original training trace.
- Invalid shapes, sparse/nonfinite coordinates, unsupported penalties, rate/budget/scale/start bounds.

New run bounds: initial coordinates within ±10, finite 0<η≤2, integer 1–100 updates. New guards stop if coordinate magnitude exceeds 10^6, objective magnitude exceeds 10^12 or a gradient component exceeds 10^8. Existing Regression has its own unchanged limits. Accepted settings do not guarantee convergence, and guard stops are not asymptotic divergence proofs.

## 7. Verification results

| Verification | Result |
|---|---|
| Focused new TS/runtime/model/frontend | 22 tests in 3 files pass |
| Focused Python Optimization | 21 tests pass |
| Full TypeScript/frontend regression | 313 tests in 51 files pass |
| Full Python regression | 165 tests pass |
| Type checking | Pass |
| Production build | Pass; 60 prerendered pages including eight new Optimization pages |
| All lesson checks | All 24 exercised in production UI; six completed lesson states survive reload |
| Critical failure and retry | 23/24 convergence-critical failure, then v2 24/24 independent pass |
| Assessment persistence | Both submissions and earned mastery visible after reload |
| Review consent | Submission disabled until confirmation; automated edit/consent reset test passes |
| 320px reflow | All six lessons and mastery active/review/result states fit 320px document width at 320px viewport |
| Expanded alternatives | Full grid/slice details and unchanged embedded Regression lab fit 320px |
| Keyboard | Native sliders/selects/radios/input/buttons, manual history, confirmation/retry and original Step/Play/Pause work |
| Sequential keyboard | 28 Tab stops after brand link reach enabled geometry reflection control |
| Motion | New histories have no autoplay/timer; original reduced-motion branch unit-tested with mocked preference; original Play/Pause exercised in browser |
| Scoped accessibility markup | Geometry audit finds zero unlabeled controls, captionless tables or unnamed SVG images |
| Runtime UI boundaries | Coupled update (0.4,1.4), NaN rejection/recovery, guard/unavailable state, saddle zero versus lower neighbor verified |
| Browser console | No errors observed in final preview |

Initial three frontend selector failures were resolved; **final suites have no failures**. Automated media mocking is not actual OS/browser preference verification. All test progress was on isolated origin 3018; founder preview 3017 was refreshed without importing test mastery. The isolated test server is stopped. The 3017 local preview remains available, and temporary viewport overrides are reset.

## 8. Accessibility obligations and remaining risks

Implementation is not a claim of full accessibility verification.

1. **Real screen-reader verification — OPEN.** Actual VoiceOver/NVDA speech, symbols, table/map alternatives, guard messages and review/results need reviewer evidence.
2. **Genuine 200%/400% browser zoom — OPEN.** 320px viewport tests are not browser zoom.

Comprehensive WCAG/device/contrast/targets/text-spacing acceptance, actual OS-preference review and formal learner/variant validity remain unclaimed; no full scanner pass or external learner study occurred. The new manual-only design avoids motion dependence, while the preserved animated lab retains its existing controls and media branch.

No essential content gap is known within the bounded blueprint. Remaining educational limitations include finite toy objectives and two unvalidated deterministic variants, not a general optimizer/inference library or evidence of actual learner transfer. A low training objective, small gradient, stationary point or completed budget does not certify generalization, causation or product suitability.

## 9. Documentation and stopping boundary

Updated:
- Mathematics Foundations blueprint.
- Curriculum master plan.
- Implementation status.
- V1 implementation roadmap.
- Conceptual-depth backlog.
- Release/accessibility blocker register.
- Architecture and Mathematical Specification.
- This completion report; reference catalog version is 1.4.0.

Earlier dated “Optimization not begun” notes remain historical and are superseded by the 012.8 entries. No existing module is silently promoted to fully verified.

The recommended next milestone, **only after separate founder approval**, is Task 012.9 Mathematics integration/reference acceptance: returning/fresh learner journeys, cross-objective teaching/check/remediation mapping, legacy evidence compatibility, notebook/download acceptance and actual manual accessibility gates. It is not a new subject, a universal engine or a capstone. **No part of 012.9 was started.**

No deployment, external learner testing, advanced optimizer implementation, additional ML algorithm, Python-for-ML curriculum, capstone or comprehensive Task 017 refinement was performed. Stop and await founder approval.
