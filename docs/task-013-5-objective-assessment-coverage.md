# Task 013.5 — Objective and assessment coverage

Status: implemented; founder review pending. All objective text, depth labels and gates match the approved [Task013 matrix](task-013-lesson-objective-matrix.md). Each row has one taught/worked numerical/chart reference, two practice instances (A/B) and three independent instances (A/B/C), plus targeted remediation and a notebook section. Totals:20 families,40 practice,60 independent. Exactly V05.O4 is introductory;19 are essential.

Namespace python.visualization; stable exercise suffixes .practice.a/.practice.b and .mastery.a/.mastery.b/.mastery.c. Browser only resolves immutable authored definitions. All100 scored and20 worked cases are in visualization-learning.v1.json, matched by TypeScript and actual NumPy/Matplotlib tests. The five labs expose34 configurations (8,6,8,6,6), all reference-backed.

| Objective | Depth / gate | Teaching outcome | Independent understanding check | Targeted recovery |
|---|---|---|---|---|
| V01.O1 | Essential / noncritical | Match Figure/Axes roles to a supplied Matplotlib program. | Choose where plot and labeling methods belong. | Annotate the small fig, ax creation trace. |
| V01.O2 | Essential / paired critical | Choose correct coordinates, units and truthful series labels. | Repair swapped axes/unit labels and explain the consequence. | Map each axis back to the input table. |
| V01.O3 | Essential / noncritical | Predict a line plot only when order/continuity is justified. | Reject a line through arbitrarily ordered customers. | Compare row order with the intended independent variable. |
| V01.O4 | Essential / noncritical | Provide non-color-only labels and a numerical alternative. | Select a usable legend/marker/table combination. | Read the chart using only its textual description. |
| V02.O1 | Essential / noncritical | Predict bin membership including the final right edge convention. | Select counts for a changed bounded dataset. | Place values in labeled half-open bins, final bin right-inclusive. |
| V02.O2 | Essential / paired critical | Distinguish count, density height and probability area. | Repair a density-as-probability claim and justify using width. | Multiply each density height by bin width. |
| V02.O3 | Essential / noncritical | Explain the effect of bins and outliers on interpretation. | Choose a cautious conclusion after a bin change. | Compare the same raw values under both plots. |
| V02.O4 | Essential / noncritical | Choose a histogram for a quantitative distribution rather than a relationship. | Select a plot matching a new distribution question. | State whether one variable or paired variables are being studied. |
| V03.O1 | Essential / noncritical | Preserve paired observations and inspect shape/outliers. | Reject a separately sorted x/y chart. | Reconnect points by row ID. |
| V03.O2 | Essential / paired critical | Distinguish association from an identified intervention effect. | Reject a causal claim and choose the missing design/assumption explanation. | Return to Statistics common-cause/intervention contrasts. |
| V03.O3 | Essential / noncritical | Recognize subgroup confounding and nonlinear patterns. | Choose interpretations of pooled versus grouped/curved cases. | Compare group membership and within-group patterns. |
| V03.O4 | Essential / noncritical | Use labels/markers and point tables to avoid color-only meaning. | Select a readable small scatter design. | Trace one named observation through the numerical alternative. |
| V04.O1 | Essential / noncritical | Interpret box, whiskers and marked observations using the stated convention. | Label a changed plot from a matching summary table. | Rebuild the plot from ordered values and fences. |
| V04.O2 | Essential / paired critical | Distinguish median/IQR from mean/standard deviation. | Repair a mislabeled summary and explain robustness. | Compare definitions and units in Statistics recall. |
| V04.O3 | Essential / noncritical | Assess outlier influence without automatically removing observations. | Choose an investigation rather than unsupported deletion. | Compare provenance and summaries with/without the point. |
| V04.O4 | Essential / noncritical | Compare group summaries without claiming equal sample sizes or causation. | Select a limited conclusion with group counts shown. | Inspect counts and the unaggregated value tables. |
| V05.O1 | Essential / paired critical | Detect misleading scale/denominator choices and propose a transparent repair. | Choose a repair plus absolute-unit explanation for a new chart. | Compare identical data under disclosed common scales. |
| V05.O2 | Essential / noncritical | Select line/scatter/histogram/box plot for a stated ML question. | Match a new diagnostic question to a chart and rationale. | Identify time/order, pairing or distribution first. |
| V05.O3 | Essential / noncritical | Separate descriptive visual evidence from generalization claims. | Reject a chart-based claim of unseen-data performance. | Trace which rows the plot actually contains. |
| V05.O4 | Introductory / noncritical | Explain why exploratory pattern hunting needs later validation (introductory). | Choose a cautious follow-up rather than proof from a selected pattern. | Distinguish exploration from a predeclared evaluation. |

## Independent critical evidence

Five gates: V01.O2,V02.O2,V03.O2,V04.O2,V05.O1. Both decision/repair/calculation and reason/counterexample are AND-graded. At least16/20 plus all five in one confirmed attempt; no mosaics or completion/notebook mastery. Three real forms test15/20 failure,16/20 success with gates,17/20 and20/20; every gate/component separately fails at otherwise19/20:30 scenarios inside deterministic unit loops. A correct numerical result with an invalid causal interpretation fails V03.O2.

V04.O3 outlier deletion caution and V05.O4 exploratory-validation caution are assessed, not secretly added critical gates. Passing awards only correctly demonstrated objectives; missing noncritical evidence remains unmastered. Prior same-version mastery survives later failure/history trimming/lesson reset.

## Experiment and reference ownership

V01 maps figure/axes/units/line order; V02 derives membership/count/width/density/area and included denominator; V03 preserves paired IDs and exposes compatible causal stories, pooled/subgroup reversal and a zero-correlation curve; V04 rebuilds linear quartiles/fences/observed whiskers/counts; V05 compares identical data under disclosed zoom/common limits and chooses defensible claims. Each has changed-condition prediction, explanation and numerical/text alternatives.

Worked anchors: predictions130/230/330 in thousands of dollars; histogram counts2/2, density.25/.25, area1; quartiles2.25/3.5/4.75, IQR2.5, whiskers1/5, marked20; absolute-unit gap2 independent of axes. The original Statistics histogram convention is preserved rather than overwritten by Matplotlib explicit-bin density.

Trusted source SHA-256: b2797f0402631f4bb1bcecc52450b4b7c04ca623a0bb906d977ef3231a2fab64.
Complete case-corpus SHA-256: 93b67c6b241cd2e3687ee78491fdaa538d14e78b94a2cc0a36b9000f2830490f.
See [completion evidence](TASK_013_5_COMPLETION.md) for logs, notebook hashes, preservation and open genuine screen-reader/zoom/Colab obligations. No external learner testing.
