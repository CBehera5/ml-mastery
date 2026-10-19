# Shared fictional data and mathematical contracts

Proposed tour contract `discovery.house.v1-draft`, for founder review. Reuse the existing Regression `HOUSE_DATA` and `HOUSE_PARAMETERS` unchanged; tour row IDs are presentation identifiers. The companion JSON is a design proposal, not a newly frozen reference or a change to any course contract.

| ID | Floor area x, thousand ft² | Observed price y, thousand dollars |
|---|---:|---:|
| H01 | 1.0 | 178 |
| H02 | 1.8 | 213 |
| H03 | 2.5 | 246 |
| H04 | 3.2 | 278 |
| H05 | 4.0 | 316 |
| H06 | 4.8 | 349 |

All six rows are fictional teaching/training observations, not real housing data, a random population sample or unseen test set. Preserve order and IDs. No derived actual target is invented for the independent query x=2.0. Its output checks arithmetic only.

## Equation and units

ŷᵢ = w xᵢ + b. Area x is in thousand square feet; w is thousand dollars per thousand square feet, b and ŷ are thousand dollars. The displayed $k convention means, for example, 228 represents $228,000, not $228. Monetary values are fictional teaching values; final offer currency is a separate commercial decision.

Residual **eᵢ = ŷᵢ − yᵢ**, matching the existing engine. Positive is overprediction; negative is underprediction. Absolute error is |eᵢ| in $k. Squared error eᵢ² and mean squared error L = (1/6) Σ eᵢ² are in ($k)², not dollars, percent or accuracy. RMSE/MAE need not appear in the initial tour UI.

| State | H04 prediction | H04 signed residual | H04 absolute error | Six-house MSE |
|---|---:|---:|---:|---:|
| Initial w=42, b=140 | 274.40 | −3.60 | 3.60 | 25.913333333333… |
| Guided w=44, b=140 | 280.80 | +2.80 | 2.80 | 17.186666666667… |
| Contrast w=46, b=140 | 287.20 | +9.20 | 9.20 | Calculate from same trusted trace; do not substitute H04 error |

Guided NumPy vector at 44/140: `[184, 219.2, 250, 280.8, 316, 351.2]`. H04 is zero-based index 3. Explain that a parameter change changes the rule, while selecting a house changes the input/row. A smaller error for one home does not prove a better whole model.

## Bounded calculation space

Math w ∈ {40,42,44,46}, b ∈ {130,140,150}; all six houses selectable. There are 12 parameter combinations, no arbitrary expression parser. Controls stage pending comparison; commit only after a prediction/reveal. Snapshot parameters are passed into the Python trace and initial Algorithm run, with explicit baseline/canonical checkpoint choices.

Algorithm uses the existing full-batch MSE convention: ∂L/∂w=(2/6)Σxᵢeᵢ, ∂L/∂b=(2/6)Σeᵢ; update w and b simultaneously from the same previous state by subtracting α times their gradients. Rate ∈ {0.001,0.01}; maximum ten updates; iteration 0 is pre-update. Changing rate restarts from the same chosen initial snapshot after explicit confirmation if it discards a viewed run; it does not continue from silently changed parameters.

12 possible starting states × 2 rates × 11 recorded states = **264 state visits across 24 bounded runs**, not 264 distinct trained models. No unrestricted training iterations, outliers, extra features, optimizer, backend execution or dataset edits. The tour calls trusted existing calculations; any required new numerical behavior is outside this proposal and must be reviewed.

Guided step 1, w=44/b=140/α=0.01: w=43.8444; b≈139.929333333333; MSE≈14.5757408934224. Display 17.19 → 14.58 ($k)². Retain full precision for calculations; do not feed rounded UI values into subsequent updates. Improvement describes inspected training states only.

## Prediction and answer contracts

Math first prompt: with 42/140 committed, propose 44/140 on H04; expected smaller absolute error. Contrast prompt: from 44/140 propose 46/140; expected larger absolute error. Wrong direction is valid exploration, with an explanation after reveal, not a course failure.

Python has finite operator/variable slots with authored meanings; allowed symbols are rendered tokens, never evaluated code. Numeric H04 output is graded against the captured Math snapshot; the guided screen uses 280.80. The learner sees the active values before answering. A changed source snapshot cannot retroactively regrade a saved response.

Algorithm challenge T-ALG-01: fixed displayed w=44, b=140, x=2.0, expected prediction 228 ($k). No actual y exists for this query; do not calculate a residual or claim unseen predictive accuracy. The fixed challenge snapshot is independent from the mutable training run and clearly labeled as such.

Tour numeric input is a finite decimal in displayed $k with at most two decimal places, canonicalized to integer hundredths; e.g. `228`, `228.0`, `228.00` are equivalent. Reject empty, non-finite, expressions, currency symbols, comma-separated thousands and excessive precision with helpful input guidance; invalid input is not a wrong attempt. Compare against the expected snapshot rounded to hundredths by an explicitly specified decimal half-up presentation rule. Retain unrounded runtime state separately. This is a proposed tour-only representation rule, not a tolerance increase or change to any module's frozen numerical acceptance.

Before each pending reveal/challenge submit, hide that pending answer/trace in both visual and accessible output. Previously committed comparisons may remain visible. First valid unaided challenge submission is immutable for the tour summary; reveal assistance marks later retries assisted. No assessment secrecy or anti-cheating claim is made about a client-side formative activity.

## Design calculation evidence and freeze boundary

`design-calculation-check.json` compares the existing compiled regression engine against independent Python exact rational arithmetic for all 24 runs / 264 state visits, including parameters, gradients and MSE. This is a design sanity check only; it does not constitute application acceptance, canonical reference approval, browser parity or a new production tolerance. The recorded maximum error is included in the file.

Before a future implementation, the exact tour input/state manifest, schema/version, response representation and display snapshots need review and trusted runtime parity tests. Do not write existing frozen manifests, raise global tolerances, change signed-error convention, alter approved engines or import this tour's states into course assessments. Any unexpected reference difference stops the affected implementation for review.
