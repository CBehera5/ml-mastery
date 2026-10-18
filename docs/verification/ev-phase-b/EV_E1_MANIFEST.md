# EV-E1 — Prediction permissions, generalization and honest fitting

17 October 2026 · frozen specification v1.0.0 · **54 reviewed configurations**, one experiment, no application implementation.

Machine-readable authoritative fixture/control/output enumeration: [ev-e1.manifest.v1.json](ev-e1.manifest.v1.json). Every `configurations` entry has an exact ID, fixture ID, complete controls, prediction question, full-precision expected result, interpretation/reason ID, objective mapping and text alternative. [Freeze lock](freeze-lock.v1.json) binds the JSON, reference author script and [metric conventions](METRIC_CONVENTIONS.md). IDs below are case-sensitive; only enumerated complete tuples are reachable.

## Educational purpose and prerequisites

Question: **Which model comparison can we honestly trust for the future prediction problem?** Learners separate information permission from numerical arithmetic, training error from generalization, reproducibility from uncertainty, and training-only from fold-only preprocessing.

Prerequisite recall: EV01 prediction time and causal limits; existing Regression residuals/MAE; Statistics mean/spread; Python Data Preparation train/development/final-test separation and fold-local fitting. These are contextual links/recall, not new lessons, mandatory re-study or transferred mastery.

Coverage: EV01.O1–O4, EV02.O1–O4, EV05.O1–O4 and EV06.O1–O4. EV02/05/06 critical reasoning is visible in test-selection and fit-row counterexamples; completion of this lab **cannot** substitute for any independent gate.

## Exact configuration inventory

| Panel / fixture | Complete allowed controls | Count | Numerical/permission output |
|---|---|---:|---|
| Prediction permissions | Six existing scene IDs × two feature IDs × three split-plan IDs, with each scene's unchanged row/group/time data |36| Feature availability, row/group overlap IDs, future training IDs, split/feature validity and four-way reason |
| Capacity / `ev-e1.capacity.v1` | Capacity `low`, `middle`, `high` × selection source `development`, `test-peeking` |6| Train/development MAE, baseline-relative reduction, best development candidate, permitted selection source and final-test eligibility |
| Fit provenance / `ev-e1.fit.v1` | One policy ID: `train-only`, `train-plus-validation`, `fold-a-only`, `fold-a-global`, `fold-b-only`, `fold-b-global` |6| Actual/permitted/evaluation row IDs, forbidden fit IDs, fitted mean, centered query and boundary validity |
| Fixed resamples / `ev-e1.resamples.v1` | Resample set 1, 2 or 3 |3| Three fixed errors, mean, ddof=0 spread and range; unsupported population claims explicitly rejected |
| Metric boundaries / `ev-e1.regression-edges.v1` | `negative-r2`, `constant-perfect`, `constant-imperfect` |3| SSE/SST, MAE, baseline error, finite/undefined/extended R² and undefined baseline-relative improvement |
| **Total** | No cross-panel Cartesian expansion |**54**| All expected outputs frozen |

Panel selection is a control inside **EV-E1**, not five extra experiments. The existing EV01 prototype's 36 configurations are reproduced here exactly, not replaced, expanded in its route, migrated or double-counted as a third lab. The full-EV app implementation will be separately authorized. The E1 JSON includes all original scene inputs; no runtime dependency on importing prototype learner evidence is implied.

### Frozen input and output anchors

- Scene IDs: `housing-units`, `housing-future`, `churn-customers`, `churn-future`, `docs-groups`, `docs-future`. Features `available`/`future`, plans `holdout`/`overlap`/`crossed`. Exact per-scene row/time/group and required-boundary flags live in the JSON; group separation is **not** automatically required for the future-events-of-known-customers question. All 36 outcomes match the previously verified EV01 reference, six are valid. No model score is fabricated for a split-permission scene.
- Capacity replay: train and development targets each [100,100]; train predictions low [92,108], middle [97,103], high [99,101]; development [91,109], [96,104], [88,112]. MAE pairs are **(8,9), (3,4), (1,12)** thousand USD. Supplied baseline development predictions [95,105] give MAE 5. Relative reductions: −0.8, 0.2, −1.4. Middle is development-best, regardless of the lowest training error. These are fixed authored predictor outputs, **not newly trained polynomial models**. Selection by repeated final-test inspection is invalid; final targets remain unavailable.
- Fit rows: r1=2,r2=4,r3=6,r4=8,r5=20,r6=22. Query q1=10 is transformed, never used to fit. Train-only mean5 → query5; train-plus-validation mean31/3 → query−1/3 (invalid). Fold A permitted r1,r2 mean3 → query7; fold B permitted r3,r4 mean7 → query3. Global-fit mean5 → query5 in either fold is arithmetically correct but evaluation-invalid. Final-test IDs r7,r8 have no exposed values.
- Resamples: error sets [4,4,4], [2,4,6], [1,4,7], each mean4; spreads **0, sqrt(8/3), sqrt(6)** and ranges0,4,6. Fixed seed1729 describes reproducibility, not confidence-interval coverage or evidence about a shifted population.
- Regression boundaries: y=[1,3], prediction=[3,3], baseline=[2,2] → SSE4,SST2,R²−1,MAE1,baselineMAE1,relative reduction0. Constant-perfect y/prediction/baseline=[2,2] → R² undefined, baseline-relative reduction undefined. Constant-imperfect prediction=[1,1] → extended R² negative infinity, MAE1,baselineMAE0,relative reduction undefined. Default sklearn replacements are separately labeled and never substituted for these outcomes.

## Prediction → change → reveal → explain → transfer

Initial configuration is `EV-E1.split.housing-units.available.holdout`, with no prediction/reveal/credit. The initial selection itself is not evidence of understanding. Reset returns to this state without deleting earned independent evidence.

1. Show an ML question, deployment population, fixture IDs, units and available information. Let learners inspect inputs before predicting.
2. Record a bounded prediction about validity/error direction or metric state. A wrong initial prediction is valid learning behavior.
3. Require a change to a meaningful complete configuration: feature/split, capacity, selection source, fit policy, resample set or edge case. A panel-only change without any changed input or permitted conclusion is not sufficient.
4. Reveal only after a prediction. Show prior and new values/IDs side by side, including **unchanged arithmetic but changed validity** for test-selection/provenance cases. Explain the reason in that configuration's `why` text; never imply a new fit happened live.
5. Ask a finite post-observation explanation: feature/split permission; development versus test selection; actual fold fit IDs; seed versus generalization; R² versus accuracy. Semantic reason keys and correct interpretation are frozen in each expected result. Future authored distractors must not change these semantics.
6. Apply the same boundary to a different listed fixture. Meaningful lab evidence requires a changed state, prediction, reveal and correct explanation; lesson transfer remains a separate bounded explanation, not an extra lab or objective family.

Changing a control invalidates the current reveal and explanation; historical credit may remain within the later versioned full-EV scope. Reset clears only that lab's current interaction, never prototype evidence or independent mastery. No persistence code is implemented here.

## Accessibility and graphic semantics

- Permission panel: timeline/group bands plus semantic lists of exact train/test/overlap/future IDs and feature timestamp. Required boundaries are spelled out, not encoded only by color.
- Capacity: plot the three train/development MAE pairs with distinct labels/line styles; synchronized 3-row table and baseline5. “Training decreases while development worsens” must be stated in text. No smooth curve or unseen fitted polynomial is implied by three points.
- Fit: labeled allowed/actual fit sets plus a six-row value table and mean/query arithmetic. Invalid rows are named in text.
- Resamples: three points/error bars labeled as fixed descriptive spread, never confidence intervals; numerical mean/SD/range and shift limitations remain available without the plot.
- Metric edges: exact fraction/SSE/SST table, visible undefined/infinite tags with reason; do not draw infinite heights as finite bars.
- Native finite controls, visible focus, headings, semantic tables with captions, keyboard prediction/reveal/reset, no hover-only information, concise announced reveal status, reduced motion and wrapping 320px content are future acceptance requirements. Numerical tables are small separate views; do not announce all 54 configurations in a live region.

## Reference parity and rejection

Trusted offline standard-library arithmetic is cross-checked against pandas ID/time/group operations, sklearn MAE/MSE/raw-R², StandardScaler center-only fits and NumPy resample statistics. Prior EV01 reference outcomes are compared field by field. GroupShuffleSplit/TimeSeriesSplit examples independently verify the required permission invariants; they do **not** claim to generate the authored split plans. No production data, credentials or network is involved.

Reject any unlisted complete configuration, attempted mixing of panels, extra controls, unsupported version, nonfinite input, unknown row/feature/plan IDs or arbitrary replacement values before reveal. Preserve the learner's current valid selection and show bounded guidance; no grade or attempt penalty for an unsupported representation. [Metric/rejection policy](METRIC_CONVENTIONS.md) is binding. This is a specification, not a shipped validator.
