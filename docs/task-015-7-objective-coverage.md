# Task 015.7 — Objective, assessment and critical-gate coverage

All 24 essential families map to the corresponding section in decision-trees/teaching.ts, two practice variants and three independent forms in authored.json. Each family includes a worked explanation and targeted remediation; the lesson supplies changed-case recall. No additional entropy gate.

| Lesson | O1 | O2 (paired critical) | O3 | O4 |
|---|---|---|---|---|
| DT01 Partition feature space | Saved path prediction | Training versus saved-state inference; label permissions | Axis-aligned intersections | Threshold equality |
| DT02 Regression leaves | Numeric mean AND SSE | Squared-error split choice AND numeric mean explanation | Combined residual/SSE reduction | Leaf extrapolation limits |
| DT03 Classification leaves | Class proportions/Gini | Weighted split choice AND class-fraction output | Balanced/imbalanced mixing | Purity versus unseen success |
| DT04 Depth and stability | Matching train/development MSE | Reject train-error-only selection AND explain variance | Changed-row sensitivity | Pruning/min-leaf trade-off |
| DT05 Fit safely | Criterion/depth/seed/order | Reject leakage/misalignment/provenance AND repair actual boundary | Repair whole workflow | Task-appropriate metrics |
| DT06 Explain rules and limits | Local path and coverage | Reject causal/global importance AND explain sample/coverage limits | Linear/tree/conceptual forest comparison | Subgroup/shift/range disclosure |

For each DT0N.OM, exact instance IDs are DT0N.OM.practice.A/B and DT0N.OM.assessment.A/B/C. This yields 48 practice and 72 independent instances, not additional points for paired atoms. DT02.O1 has two numeric parts without becoming critical.

## Mastery evidence

Each independent form contains all 24 families and the same six O2 gates. Require at least20/24 and both atoms of every gate in one explicitly confirmed attempt. Tests cover19/24 failure,20/24 success and six gates × two individually wrong atoms × three forms =36 valid-wrong critical failures at23/24. No evidence mosaics; successful prior mastery survives later failure. Practice, labs and notebook cannot grant mastery.

## Reference boundaries

All120 authored families are checked against trusted reference definitions; numeric means, SSE, threshold selection and Gini have independent NumPy/sklearn calculations. Conceptual permissions, causality and valid-comparison claims are authored semantic invariants, not claims that sklearn can audit arbitrary provenance or learner explanations. Grading accepts only finite typed answers and predefined choices; shared contracts reject unsafe structures and unsupported numeric strings/expressions.

Both frozen experiments preserve raw outputs, IDs and hashes:37 regression and32 classification states. Classification fits use Gini only. Contextual entropy arithmetic is separately verified in the frozen parity report, without fitted entropy or new objectives.
