# Algorithm comparison framework

16 October 2026 · proposed teaching/report contract, not a benchmark or implementation.

## Questions before rankings

1. What is predicted, at what time, with what available features and target units?
2. What are the cost of errors, prevalence, expected population and latency/resource constraints?
3. What split (row/group/time), training-only preparation and fold protocol match that deployment?
4. Does a simple baseline already meet the requirement? What mechanism might improve on it?
5. Do all candidates receive the same permitted rows, folds, metrics and disclosed tuning budget?
6. Does any improvement survive error analysis, variability, simplicity/cost and leakage checks?

| Family | Useful assumption / strength | Important risk | Fair comparison evidence |
|---|---|---|---|
| Existing multiple LR |Additive numeric prediction; interpretable units|Missed interactions, collinearity, extrapolation/causal overclaims|Baseline-relative MAE/RMSE, residual structure, coefficient stability|
| Polynomial |Fixed smooth feature expansion|Tail explosion/degree growth, unstable coefficients|Degree/penalty validation curve, query range, shape/feature count|
| Ridge/Lasso/Elastic Net |Constrain linear coefficients; shrinkage/sparsity/mixed penalty|Scaling, incompatible α conventions, unstable correlated selection|Same folds, error + stability + sparsity, convergence record|
| Logistic |Linear log-odds and probabilities|Nonlinear boundary misspecification, calibration/shift|Log loss/Brier, confusion costs, linear alternatives, calibration evidence|
| KNN |Local similarity with meaningful scaled distance|Dimension, irrelevant features, minority regions, inference cost|k/metric sensitivity, same-fold cost metrics, query work|
| NB |Class-conditional likelihood shortcut; counts or Gaussian features|Conditional independence misspecification, duplicate evidence, overconfidence|Correct representation, smoothing, probability and decision errors|
| Trees |Piecewise rules and nonlinear interactions|Instability/depth overfit, leaf range limits, biased importance|Depth/leaf curves, local path coverage, regression and classification metrics separately|
| Forests |Diverse tree aggregation|Correlated errors, memory/query cost, misleading importance/OOB claims|Tree-to-forest improvement, stability, appropriate split, importance caveats|
| Boosting |Sequential loss correction with weak learners|Sensitive complexity/stopping, noisy targets, leakage|Stage/rate curves, task-specific loss, valid stopping data, forest baseline|
| SVM |Margin-based linear/kernel discrimination|Scaling, C/γ sensitivity, resource cost, scores not probabilities|Scaled fixed-fold search, margin/error cases, comparison with Logistic/KNN|
| Intro MLP |Small learned nonlinear composition|Data/scale/seed/solver sensitivity, nonconvergence, interpretation limits|Multiple disclosed training seeds, convergence/curve evidence, simpler alternatives|

No algorithm is universally best. These are hypotheses to test, not automatic routing rules (“tabular always forests”, “nonlinear always neural”). Equal search budgets can still explore different spaces; disclose this limitation rather than manufacture a definitive winner.

## Required comparison record

Dataset/version/checksum, prediction moment, target/positive class, fit/split IDs and seeds; preprocessing and learned-parameter provenance; baseline; estimator and all nondefault parameters; search space/budget/scorer/refit rule; per-fold scores and paired differences; task-appropriate aggregated results; convergence/resource warnings; development decision; locked final-test result; subgroup/error cases; limitations and justified next action.

For regression: MAE and RMSE in target units, residual examples and baseline-relative improvement; MSE has squared units; R² is not accuracy and can be negative. No percentage-error default when targets can be zero. For classification: prevalence/confusion denominators, precision/recall/F1, cost table and probability metrics when probabilities are valid. Do not label average precision “trapezoidal PR-AUC”; declare exact definition and interpolation. ROC ranking alone can obscure decision costs under severe imbalance. Calibration requires evidence; raw SVM margins are not probabilities.

For selection: compare on development folds and disclose uncertainty without treating fold scores as independent repeated experiments. Thresholds, class weights, optional calibration and resampling belong inside the permitted selection/fold process. Nested CV separates outer performance estimates from inner selection; a final refit is a different artifact from the outer-fold estimators. One locked test evaluation reports success or failure honestly; it is not a tuning loop.

Interpretation: coefficients depend on scaling/collinearity; impurity importance has selection biases; held-out permutation depends on model/data and may distribute or hide correlated signal. Neither rules, coefficients, importance nor partial dependence establish causality. Inspect paired error cases and population coverage before action. No SHAP service, causal inference engine or new explainability dependency is proposed.

Baseline metric definitions and workflow recall reuse Python/Math. Full estimator APIs and exact metric settings must be checked against the pinned trusted reference during implementation; this specification is not evidence of fitted benchmark results.
