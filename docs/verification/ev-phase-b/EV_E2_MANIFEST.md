# EV-E2 — Decisions, costs, ranking and probability quality

17 October 2026 · frozen specification v1.0.0 · **32 reviewed configurations**, one experiment, no application implementation.

Authoritative inputs, controls and numerical outputs: [ev-e2.manifest.v1.json](ev-e2.manifest.v1.json). [Metric contract](METRIC_CONVENTIONS.md) and [hash lock](freeze-lock.v1.json) are binding. Every complete configuration is explicitly enumerated; no arbitrary probability entry, threshold slider range, chart expression, data upload or live training is authorized.

## Educational purpose and prerequisites

Question: **Which documentation items should a review workflow flag, and what can its scores actually tell us?** Teach that decision cost, positive detection, ranking and probability error answer different questions. High accuracy, perfect ranking or a tiny calibration plot cannot establish good decisions, calibrated future risk or causation.

Recall Python sklearn fit versus predict, Data Preparation development-only selection, Math Probability conditional risk/logarithms and Statistics correlation versus causation. Connect to EV03.O1–O4 and EV04.O1–O4 without adding objectives. Positive **1=Needs Improvement**, negative **0=Good**; all labels/values are original fictional teaching fixtures, not production collection or automatically trusted LLM scores.

## Complete bounded configuration set

For each of the eight fixtures below, allowed thresholds are **0,0.5,0.75,1**. Exactly 8×4=**32** complete configurations. Equality predicts positive. Individual IDs, exact row IDs d1…dN, cost assumptions, probabilities and outputs are all in the JSON; do not accept arbitrary combinations assembled from separate fixture fields.

| Probability-set ID | Targets | Positive probabilities | FP/FN costs | Teaching contrast |
|---|---|---|---|---|
| `balanced` |[0,0,1,1]|[.1,.4,.6,.9]|1/1| Confusion/cost changes with threshold; losses/ranking do not |
| `same-ranking` |[0,0,1,1]|[.01,.49,.51,.99]|1/1| Same perfect ranking as balanced, different Brier/log loss; no automatic calibration conclusion |
| `imbalanced` |[0,0,0,0,0,0,0,1]|[.1,.2,.3,.4,.2,.1,.3,.6]|1/5| Threshold .75 or1 misses all positives despite 87.5% accuracy |
| `no-positives` |[0,0,0,0]|[.1,.2,.6,.8]|1/5| Recall/ROC/AP undefined; precision and F1 depend on predictions |
| `no-negatives` |[1,1,1,1]|[.1,.2,.6,.8]|1/5| ROC/FPR/specificity undefined; AP is defined as1 |
| `endpoints` |[0,1,0,1]|[0,1,1,0]|1/5| Correct certainty gives zero log-loss contribution, impossible observed outcomes give mathematical infinity |
| `all-tied` |[0,1,0,1]|[.5,.5,.5,.5]|1/1| Ties move together, ROC AUC=.5 and AP=.5; equality at .5 predicts all positive |
| `reversed-ranking` |[0,0,1,1]|[.9,.6,.4,.1]|1/1| ROC AUC0, AP5/12; poor ordering cannot be repaired by calling scores calibrated |

The eight-row imbalance case stays within inherited small-table limits; it **does not replace** the approved EV03 worked-example seed of 99% majority accuracy on one positive in100. That lesson example remains future content, not a 100-row exposed lab fixture. Prevalence changes by selecting a whole labeled fixture, never by independently resampling rows or silently changing which population is evaluated.

### Frozen outputs and anchors

Each configuration exposes hard predictions, TP/FP/TN/FN, prevalence, accuracy, precision/recall/F1, specificity, balanced accuracy, FPR, total/mean cost, ROC AUC, AP, every distinct-threshold PR point, a separate no-prediction endpoint, Brier and individual/mean log-loss contributions, labeled library clipped loss, fixed-bin calibration counts/means/fractions, interpretation ID and final-test permission.

- Balanced at threshold .5: TP2,FP0,TN2,FN0,accuracy/precision/recall/F1=1,cost0; Brier .085,ROC/AP1. Threshold .75: TP1,FP0,TN2,FN1,recall.5,F1=2/3,cost1; probability losses and ranking remain unchanged.
- Imbalanced at .75: TP0,FP0,TN7,FN1,accuracy.875,precision undefined,recall0,F1=0,cost5. Undefined precision is **not** converted to0 merely because F1 is0.
- Same-ranking has Brier .1201, versus balanced .085, despite both ROC/AP1. Ranking is not a probability-quality guarantee.
- Endpoint fixture has Brier .5 and mean mathematical log loss positive infinity for every threshold. Separately labeled sklearn clipped float64 mean is finite; it does not override the mathematical result.
- No positives at threshold1: TP0,FP0,TN4,FN0,accuracy1; precision/recall/F1/AP/ROC/balanced accuracy undefined. No negatives has ROC undefined even though AP1.
- Calibration bins [0,.5),[.5,1] have exact membership; an empty bin has tagged undefined mean probability/positive fraction. These small diagnostics do not validate deployment calibration.

Full unrounded results—not the rounded anchors here—are frozen in JSON. Mathematical definitions, probability endpoints, tagged undefined/infinite values and library deviations are specified in [METRIC_CONVENTIONS.md](METRIC_CONVENTIONS.md).

## Predict → change → reveal → explain → transfer

Initial configuration is `EV-E2.balanced.t0_5`, with no prediction/reveal/credit. Reset returns to that state without deleting independent evidence. The initial selection alone never earns completion.

1. State the review decision, positive label, development-only evaluation, fixed probabilities and FP/FN costs. Present row inputs before prediction.
2. Ask learners to predict how a threshold/fixture change affects detection, cost and probability quality. Record bounded predicted outcomes before reveal; the initial prediction may be wrong.
3. Change an allowed threshold or whole fixture. Reveal prior/new confusion counts and cost, plus unchanged probability metrics when only threshold changes. Never describe this as fitting a new model.
4. Explain the exact denominators and changed row decisions. Ask a finite reason/transfer check distinguishing threshold decisions from training, accuracy from positive detection, ordering from calibration and association from causation. `threshold-not-retraining` is the primary frozen interpretation ID; supported conclusions in the fixture text remain binding. Later authored option IDs/distractors must preserve these semantics.
5. Transfer to a different listed prevalence/probability fixture. Do not claim that a cost improvement on changed rows is proof one model is better on a fixed population. Final-test threshold selection remains forbidden.

A changed meaningful state, recorded prediction, reveal and correct post-observation explanation are required for experiment evidence. Changing a control clears stale reveals/explanations. Reset is lab-local. No practice or independent mastery is awarded by this experiment, and no evidence/persistence implementation is authorized now.

## Graphical and accessible equivalents

- Confusion graphic: explicit actual/predicted axes, named positive class, labeled cells and synchronized 2×2 semantic table plus count equations.
- Decision view: row ID/target/probability/threshold/prediction table; identify which rows cross the threshold. Costs and denominators are text, not just colors.
- ROC/PR view: count-derived point at the selected threshold, distinct-score PR points and defined area values. Do not draw a finite ROC/AUC when a class is absent. Synthetic PR endpoints must be labeled plotting conventions, not observed precision. No chart curve is inferred as a calibrated probability function.
- Probability view: row Brier/log-loss contributions, mathematical infinite/undefined tags in words, separately labeled finite library approximation. No infinite-height fake finite bar.
- Calibration view: two fixed bins with counts, mean probability and observed fraction; empty-bin explanation and explicit small-sample/deployment limitation.
- All graphics have adjacent wrapping numerical/text alternatives. Use separate ≤8-column tables, native finite controls, visible focus, labeled prediction/reveal/reset, concise announced outcome, no hover-only values or color dependence, reduced motion and 320px support. Actual keyboard/viewport/reader/zoom checks remain future implementation acceptance, not passed by this document.

## Reference calculations, edge cases and rejection

Standard-library confusion arithmetic, direct F1, pairwise tied ROC AUC, distinct-threshold AP sum, binary squared errors and natural-log contributions are independently compared with the approved sklearn metrics. NumPy cross-checks costs and calibration-bin aggregation. Every one of the32 configurations is verified, including all threshold ties and endpoint cases. Threshold-invariance and monotonic TP/FP counts are explicitly asserted.

Use tagged undefined metrics when a denominator/class is absent; do not accept library default replacements as mathematical values. No class weights, estimated priors, external prevalence correction, threshold optimization, probability calibration fitting or model training is exposed. Probability set and threshold are the only two learner controls.

Reject unsupported fixture/threshold/version, extra controls, free-form scores, numeric-string/Boolean coercion, duplicate/missing IDs, unsafe values/shape and attempts to provide arbitrary code before reveal. A no-positive/no-negative fixture is supported, not a malformed dataset: show its tagged metrics. Unsupported representation does not consume a graded attempt. Rejection semantics are specification only; no application validator has been implemented.
