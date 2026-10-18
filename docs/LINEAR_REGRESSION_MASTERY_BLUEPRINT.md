# Linear Regression mastery assessment blueprint

## Implemented version

Task 011.5 implements assessment `linear-regression.mastery.v1`, blueprint/exercise version `1.0.0`, at `/learn/linear-regression/mastery`. The machine-readable blueprint is `apps/web/app/learn/linear-regression/mastery/blueprint.v1.json`.

This is the first implemented blueprint. It supersedes the Task 011.1 design-only nine-domain weighted proposal with the six competency areas explicitly requested in Task 011.5. The provisional policy remains unchanged: at least 80% overall and every designated critical objective passed in the same attempt.

## Scoring and award rule

- 24 questions, each worth one point; four questions per competency. Each competency contributes 4/24 of the total.
- 80% of 24 is 19.2; therefore at least 20/24 is required. Compare unrounded scores for the gate; percentages are rounded only for display.
- All 10 critical objectives must pass. A 23/24 attempt with one missed critical item fails.
- No partial credit or negative marking. All constrained-code slots in a question must match. Missing, incomplete, invalid and non-finite responses score zero. Numerical absolute tolerance is 0.001.
- Any failed attempt awards no new mastery, including for its correct individual items. It can record passed-objective completion evidence and an assessed lesson state.
- A successful attempt awards mastery only to its correctly demonstrated item objectives and the preserved aggregate objective `linear-regression.mastery.objective`. Missed noncritical objectives remain unmastered unless previously earned.
- Prior valid mastery survives later lower-scoring or failed attempts. Lesson/project completion never substitutes for an assessment result.

## Question-to-objective coverage

Every row has one stable objective and remediation route. Critical designation is versioned with this blueprint.

| Question | Competency | Objective ID and capability | Format | Critical | Remediation |
| --- | --- | --- | --- | --- | --- |
| Q01 | Conceptual understanding | `linear-regression.mastery.q01` — Identify features, numeric targets and predictions | Conceptual scenario / diagnosis | Yes | `/learn/linear-regression/why` |
| Q02 | Conceptual understanding | `linear-regression.mastery.q02` — Distinguish learned parameters from prediction inputs | Conceptual scenario / diagnosis | No | `/learn/linear-regression/equation` |
| Q03 | Conceptual understanding | `linear-regression.mastery.q03` — Predict a bias shift without changing slope | Prediction before reveal | No | `/learn/linear-regression/equation` |
| Q04 | Conceptual understanding | `linear-regression.mastery.q04` — Calculate and interpret signed residuals | Numerical | Yes | `/learn/linear-regression/errors` |
| Q05 | Mathematical reasoning | `linear-regression.mastery.q05` — Calculate a prediction with units | Numerical | No | `/learn/linear-regression/equation` |
| Q06 | Mathematical reasoning | `linear-regression.mastery.q06` — Calculate MSE without cancellation | Numerical | Yes | `/learn/linear-regression/errors` |
| Q07 | Mathematical reasoning | `linear-regression.mastery.q07` — Calculate MAE from residuals | Numerical | No | `/learn/linear-regression/errors` |
| Q08 | Mathematical reasoning | `linear-regression.mastery.q08` — Calculate a dataset weight gradient | Numerical | No | `/learn/linear-regression/gradient-descent` |
| Q09 | Optimization | `linear-regression.mastery.q09` — Apply a parameter update numerically | Numerical | No | `/learn/linear-regression/gradient-descent` |
| Q10 | Optimization | `linear-regression.mastery.q10` — Choose movement opposite the loss gradient | Prediction before reveal | Yes | `/learn/linear-regression/gradient-descent` |
| Q11 | Optimization | `linear-regression.mastery.q11` — Diagnose learning-rate behavior from evidence | Conceptual scenario / diagnosis | No | `/learn/linear-regression/gradient-descent` |
| Q12 | Optimization | `linear-regression.mastery.q12` — Distinguish optimization from generalization | Conceptual scenario / diagnosis | No | `/learn/linear-regression/gradient-descent` |
| Q13 | Multiple features | `linear-regression.mastery.q13` — Calculate a multiple-feature weighted sum | Numerical | No | `/learn/linear-regression/multiple-features` |
| Q14 | Multiple features | `linear-regression.mastery.q14` — Apply training-only scaling and reject invalid scales | Conceptual scenario / diagnosis | Yes | `/learn/linear-regression/project` |
| Q15 | Multiple features | `linear-regression.mastery.q15` — Interpret coefficients under correlated inputs | Conceptual scenario / diagnosis | No | `/learn/linear-regression/multiple-features` |
| Q16 | Multiple features | `linear-regression.mastery.q16` — Predict a conditional feature effect | Prediction before reveal | No | `/learn/linear-regression/multiple-features` |
| Q17 | Python implementation | `linear-regression.mastery.q17` — Repair a Python prediction function | Constrained code correction | Yes | `/learn/linear-regression/implementation` |
| Q18 | Python implementation | `linear-regression.mastery.q18` — Repair Python MSE calculation | Constrained code correction | Yes | `/learn/linear-regression/implementation` |
| Q19 | Python implementation | `linear-regression.mastery.q19` — Trace a simultaneous update and inference | Numerical | No | `/learn/linear-regression/implementation` |
| Q20 | Python implementation | `linear-regression.mastery.q20` — Correct both gradient-descent update signs | Constrained code correction | Yes | `/learn/linear-regression/implementation` |
| Q21 | Applied judgment | `linear-regression.mastery.q21` — Reject information leakage in a realistic workflow | Conceptual scenario / diagnosis | Yes | `/learn/linear-regression/failure-modes` |
| Q22 | Applied judgment | `linear-regression.mastery.q22` — Choose a defensible outlier investigation | Conceptual scenario / diagnosis | No | `/learn/linear-regression/failure-modes` |
| Q23 | Applied judgment | `linear-regression.mastery.q23` — Distinguish underfitting from overfitting | Conceptual scenario / diagnosis | No | `/learn/linear-regression/failure-modes` |
| Q24 | Applied judgment | `linear-regression.mastery.q24` — Qualify evaluation and deployment claims | Conceptual scenario / diagnosis | Yes | `/learn/linear-regression/project` |

## Variant design and independence

Twelve variants (`v01`–`v12`) vary numerical inputs, signed residuals and derivatives, feature effects, optimization traces, preprocessing mistakes, leakage boundaries and evaluation scenarios. Electricity use, delivery duration and crop yield replace familiar lesson housing examples. Options and order within each competency rotate deterministically. Question IDs/objectives remain stable across variants; exercise IDs include assessment and variant IDs.

Numerical expectations use existing verified runtime functions. A separately calculated standard-Python arithmetic fixture covers all eight numerical items in all twelve variants. Tests prove that replaying the complete correct response set from any different variant cannot pass the next assessment. The finite pool cycles after 12; this is a local educational assessment, not secure proctored certification. Learner pilots and item calibration remain future validation work.

## Active attempt, review and feedback

The route can be attempted directly with no lesson-completion gate and no time limit. A named progress indicator counts valid entered responses, without scoring. The active form and review contain no correctness flags, expected numeric values or explanations. Displayed answer options are ordinary choices, not revealed keys.

Review lists all entered/incomplete responses. Learners can edit a specific question and return with focus on its fieldset. Unanswered items are explicitly reported and may be submitted for zero credit. Final submission requires a new confirmation checkbox; review/consent is not restored after reload. Enter from the form opens review rather than submitting a grade.

After submission show score, six competency subtotals, each passed/failed critical objective, worked explanations for incorrect answers, remediation links and next learning steps. A retake clears current responses and uses the next deterministic variant. No arbitrary Python or external grader is invoked.

## Evidence and retention

Existing versioned curriculum, exercise and evidence schemas remain unchanged. Each submission records assessment/version identity, variant, score/max score, passed objective IDs and timestamp. Failed critical objectives and competency summaries can be derived from the pinned blueprint and passed IDs; raw response histories are unnecessary.

The latest 20 summaries for this assessment are retained without trimming unrelated assessment histories. One validated current draft stores bounded numeric/choice/code responses; partial code slots restore safely. Unknown versions and malformed drafts reset only the draft, selecting the next variant from canonical history. Canonical existing learning and Derivatives state remain intact.

A submitted result is displayed after hydration only when its variant, score and passed objective IDs match a canonical attempt. Submission commits are idempotent by attempt ID; hydration never awards mastery. Completion/mastery evidence IDs are bounded by the finite variant/objective set. Stable mastery record IDs preserve prior valid results. Storage failures are shown visibly.

## Verification and release limits

Automated tests cover all competencies, variants and numerical references, exact scoring thresholds, high-score critical failures, failed/successful attempts, objective awards, retakes, bounded history, unrelated evidence preservation, partial drafts, confirmation reset and mismatched stored results. The complete frontend, TypeScript, Python and production-build suites pass.

Real-browser checks on an isolated production test origin verified keyboard review/confirmation, a 23/24 critical failure, a 24/24 successful retake, remediation, variant changes and reload persistence. Browser inspection found and fixed grid min-content overflow. The repaired narrow layout measured 466 px with equal document/content widths; this browser backend did not supply an actual 400 px layout despite the requested override.

Manual assistive-technology pronunciation, zoom and smaller/device-specific viewports remain unverified. Earlier lesson/project end-to-end acceptance is not established by the mastery journey. The assessment and overall module remain `implemented`, not fully verified. No deployment or Task 012 work was performed.
