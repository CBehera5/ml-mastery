# Evaluation Foundations metric conventions

17 October 2026 · frozen contract **supervised.ev.metrics.1.0.0**. Applies only to the two future full-EV experiments. Not an alteration of existing Math, Regression, Python or EV01 prototype semantics.

## Inputs, units and decisions

- Only complete configuration tuples listed in the two JSON manifests are allowed. Inputs are immutable fictional fixtures, not learner datasets or expressions. Controls select fixture IDs and finite authored settings; there is no interpreter or learner code execution.
- EV-E2 positive class is **1 = Needs Improvement**; negative class is **0 = Good**. These are fictional human-review outcomes for teaching, not collected production labels, automatic LLM ground truth or a validated annotation rubric. Probabilities mean estimated probability of class 1, not causal effects or guaranteed risk.
- Prediction is `1 if probability >= threshold else 0`. Threshold equality belongs to the positive class, including endpoints 0 and 1. Allowed thresholds: exactly 0, 0.5, 0.75, 1. Changing a threshold never retrains the fixed model or changes its probabilities.
- Count TP: actual 1/predicted 1; FP: actual 0/predicted 1; TN: actual 0/predicted 0; FN: actual 1/predicted 0. Confusion tables label actual rows [0,1], predicted columns [0,1], so the matrix is `[[TN,FP],[FN,TP]]`.
- EV-E1 capacity residuals and MAE have units thousand USD. Fit-provenance centering uses feature units. Classification costs have explicitly illustrative review-cost units; cost assumptions are not learned from final test data.
- No learner control reveals final-test targets. Development choices establish eligibility for a future locked final evaluation, not evidence that the final test has actually been used correctly. Every split/fit fixture identifies its allowed rows and deployment question.

## Mathematical metrics

With N evaluated rows, positive count P=TP+FN and negative count Q=TN+FP:

| Metric | Definition | Undefined/edge behavior |
|---|---|---|
| Accuracy | (TP+TN)/N | Empty dataset rejected; high majority accuracy does not demonstrate positive detection |
| Precision | TP/(TP+FP) | No predicted positives → `{"tag":"undefined","reason":"no-predicted-positives"}` |
| Recall / TPR | TP/P | No actual positives → tagged undefined, never silently zero |
| Specificity | TN/Q | No actual negatives → tagged undefined |
| FPR | FP/Q | No actual negatives → tagged undefined |
| F1 | 2TP/(2TP+FP+FN) | Zero denominator → tagged undefined; if actual positives exist and none are detected, F1 is **0 even when precision is undefined**. This is the direct count definition, not arithmetic on a substituted precision |
| Balanced accuracy | (TPR+specificity)/2 | Requires both classes; otherwise tagged undefined, not a one-class average |
| Total / mean cost | cFP·FP+cFN·FN; divide by N for mean | Finite nonnegative authored costs only; no universal preference between precision and recall |
| ROC AUC | Proportion of positive-negative pairs ranked correctly, ties count 0.5 | Requires both actual classes; tagged undefined otherwise. Rank is not calibration |
| Average precision (AP) | Sum over distinct score thresholds of `(recall_i − recall_next)·precision_i`; terminal recall is 0 | Thresholds sorted ascending, tied scores processed as one group; no trapezoidal interpolation. No actual positives → tagged undefined. With all actual positives AP=1 is defined, while ROC AUC is undefined |
| Brier | Mean `(p_i − y_i)^2` | Binary, unscaled convention in [0,1], corresponding to sklearn `scale_by_half=True`; finite endpoints allowed |
| Binary log loss | Mean `−ln(p_i)` for y=1 and `−ln(1−p_i)` for y=0 | Natural logarithm; probability 1 for the observed outcome gives **0**; probability 0 for that outcome gives **positive infinity** |
| MAE / MSE | Mean absolute / squared residual | Nonempty aligned rows only; MSE has squared target units |
| Relative MAE reduction | `(baseline_MAE − candidate_MAE)/baseline_MAE` | Baseline error 0 → tagged undefined, even when candidate also has zero error; negative reduction means worse than baseline |
| R² | `1 − SSE/SST`, SST around the evaluated target mean | SST>0: negative values allowed, not accuracy. SST=0/SSE=0 → tagged undefined. SST=0/SSE>0 → tagged negative infinity as an explicitly named **extended-value convention**, not a finite mathematical R² or accuracy |
| Fixed-resample spread | `sqrt(mean((error − mean_error)^2))`, divisor 3, ddof=0 | Describes the three fixed replay values, not an unbiased population estimate, confidence interval, coverage guarantee or proof that a seed removes uncertainty |

Representation: finite metrics are JSON numbers; undefined is an object with `tag=undefined` and a stable reason; divergent values are `{"tag":"infinity","sign":"positive|negative","reason":"…"}`. Never serialize NaN/Infinity as JSON numeric values. A valid zero is always numeric 0, not an undefined sentinel. Numeric answer scoring remains finite-only; endpoint/undefined outcomes must use finite-choice or predefined-slot answers, not an extension of the existing numeric answer codec.

### Precision–recall and calibration presentation

`pr_points` contains every distinct probability threshold in ascending order, with counts and defined mathematical precision/recall. `no_prediction_endpoint` is separately identified: mathematical precision is undefined with no predicted positives; recall is 0 only if actual positives exist. The plotting convention used by sklearn appends synthetic precision=1/recall=0; it must not be labeled an observed precision estimate. With no actual positives, sklearn's substituted recall/AP values are not our mathematical definitions.

Calibration bins are fixed **[0,0.5)** and **[0.5,1]**. Display count, mean predicted probability and observed positive fraction. Empty bins have tagged undefined means/fractions. These tiny in-sample development summaries illustrate diagnostics; they cannot establish calibrated deployment risk. Equal ordering can have identical ROC/AP but different Brier/log loss. A score or hard label is not automatically a probability.

## Mathematical versus library behavior

- Reference classification calls explicitly specify class labels and `zero_division=np.nan`; undefined precision, recall and F1 are verified as NaN then stored as tags. Library NaN is an oracle signal, never a learner answer or JSON number.
- For absent positive/negative classes, skip inappropriate ROC/AP parity claims and preserve the defined tagged result. sklearn's AP=0 with no positives and plotting endpoints are conventions, not mathematical ground truth.
- Mathematical log loss uses **no clipping**. Separately report `library_float64_clipped_log_loss`: scikit-learn 1.9.1 clips float64 probabilities to `[eps,1−eps]`, eps=`2.220446049250313e−16`. The script verifies that finite numerical result against independently clipped natural-log arithmetic. Never replace the mathematical infinite loss with that finite result. Correct endpoint predictions retain mathematical zero contributions even if a library reports a tiny positive floating contribution.
- R² parity explicitly calls `force_finite=False`; also records default finite replacements (1 for constant-perfect, 0 for constant-imperfect) under the separately labeled library field. They are convenience defaults, not our R² definition.
- Fit means and transformed queries are checked against `StandardScaler(with_mean=True, with_std=False)`, fitted only on each explicitly recorded actual fit set. An invalid fit can produce correct arithmetic while its evaluation conclusion is invalid.
- No production model is trained or fitted by a learner service. Capacity and resample values are **authored fixed-prediction replay**, not claimed to be fitted polynomial curves or a sampling experiment performed live. Trusted offline fitting here is only the explicitly identified center-only reference transform.

## Tolerance and rounding

Compare finite outputs using `abs(actual−expected) <= 1e−9 + 1e−9·abs(expected)`; no tolerance for row IDs, class labels, integer counts, tags or permission decisions. Preserve full binary64 values in assets; display six significant digits, with an approximation marker where rounded. Never grade a rounded display as the full-precision oracle. Normalize negative zero in future UI output. Percentages are display conversions of fractions, not different metric units. Endpoint and undefined representations remain exact tags.

## Rejection and safe feedback

Before reveal, the future implementation must reject unknown fixture/configuration/version/metric IDs, mismatched tuples, nonfinite values, Boolean/string coercion, probabilities outside [0,1], thresholds outside the finite allowlist, missing/duplicate row identities, nonbinary targets, mismatched lengths, negative/nonfinite costs and unsupported oversized arrays. Empty datasets are unsupported, not zero-error datasets. These are specification requirements, **not an implemented validator** in this task.

Show bounded guidance such as “Choose a listed experiment configuration” or “This metric is undefined because there are no actual positives.” Do not echo raw unsafe content or stack traces. A supported but wrong prediction is learning evidence, not an input-format failure. No arbitrary learner expressions, imports, shell, uploads, filesystem/network operations or general-purpose parsing are permitted.

Existing answer limits remain unchanged: typed finite numeric answers |value|≤1e6, ≤2 atoms/family, ≤8 finite options/slots, ≤64 scored-array cells, ≤32 rows/8 columns per table and ≤64 configurations per experiment. Manifests are immutable author assets, not learner submissions. Render separate small input/result tables rather than putting an entire manifest into one oversized answer/table/live region.
