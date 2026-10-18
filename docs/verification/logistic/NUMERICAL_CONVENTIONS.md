# LG-E1/LG-E2 numerical, endpoint and reference conventions v1

17 October2026. Offline trusted reference authoring only. No application, evaluator, lesson or notebook implementation.

## 1. Finite scenes, data and resource bounds

LG-E1 enumerates28 states:20 one-feature authored-weight/observed-label cases,6 trained-model/query states (three C values, two queries) and2 explicitly unsupported model-configuration diagnostics. LG-E2 enumerates33 states:24 fixed-development probability/threshold/cost states,6 endpoint/absent-positive diagnostics and3 invalid-information-boundary claims. Only complete listed IDs are legal, not unrestricted products or free numeric controls. The unsupported tuples are reference-probed to confirm rejection before optimization; no valid model is fitted for them.

All inputs are fictional; positive1=churns in a future window, negative0=stays. No production labels, human annotation validation or automatic LLM ground truth. No test targets are exposed. Fixed-probability fixtures are authored examples, not falsely claimed fitted predictions. Invalid workflow states contain exact declared IDs/timestamps but are not executed leaked fits.

Largest fitted input matrix8×2=16 cells;4×2 development rows; largest action table8 rows. Authored sigmoid plots contain21 read-only(score,p) samples,42 cells, with explicit score-axis ranges. Ranges rescale to include the query, so apparent flatness across scenes is not a numerical comparison. Separate small input/metric/fold tables rather than a single giant table. Each scene stays below64 configurations, learner array/byte/depth limits unchanged; no mesh, upload or arbitrary learner execution.

## 2. Scores, probabilities, odds and gradients

z=b+Σxj*wj is dimensionless. A finite real score maps to an interior mathematical probability sigmoid(z). Reference calculations cross-check SciPy expit, independent scalar1/(1+exp(−z)) and sklearn decision_function/predict_proba for trained states. One-feature authored weights1/2, intercept0 and inputs−20,−ln3,0,ln3,20 give moderate and extreme scores, not fitted models. Observed label0/1 changes loss/gradient, not probability. All trained features are standardized with training population variance(ddof0); query inputs retain their ordered dimensionless names.

Odds=p/(1−p); log-odds=ln(p/(1−p)) for interior p. For a finite score, odds=exp(z) and log-odds=z. A one-unit coefficient is a conditional log-odds change, not a constant probability increment or causal effect. Read-only odds can exceed the learner numeric-answer magnitude bound; do not extend that codec.

At stored p0 odds=0 and log-odds has a tagged negative-infinity boundary; at stored p1 both have tagged positive-infinity boundaries. These probability-endpoint limits must not be confused with finite-logit odds. For example z40 produces float64 p1 despite an interior real probability: its finite-logit loss/odds and stored-probability endpoint outcomes are separate fields. Never claim finite real logits mathematically produce exact0/1.

The unweighted single-row unregularized teaching gradient is dL/dz=p−y, dL/dw=(p−y)x, dL/db=p−y. For y1, compute the stable equivalent−sigmoid(−z), avoiding cancellation when stored p rounds to1. Freeze a learning-rate.1 update and its next score/probability. These are numerical teaching steps, not sklearn's optimizer, convergence certificates or unseen-data guarantees. Rounding can leave a sufficiently tiny parameter update unchanged.

## 3. Decisions and evaluation

Predict positive iff p≥threshold, equality included. Allowed thresholds are exactly those in each state (main cases0,.5,.6,1; endpoint cases0,.5,1). Target class1 is always positive; select sklearn probability columns using classes_ identity. Trained classes_=[0,1], predict_proba shape(n,2), binary coefficient shape(1,2). The custom threshold rule is not replaced by sklearn predict tie defaults; reference labels are computed from probabilities and cross-checked via sklearn confusion metrics.

TP actual1/predicted1;FP actual0/predicted1;TN actual0/predicted0;FN actual1/predicted0. Confusion matrix actual rows[0,1],predicted columns[0,1]=[[TN,FP],[FN,TP]]. Accuracy=(TP+TN)/N, precision=TP/(TP+FP), recall=TP/(TP+FN), F1=2TP/(2TP+FP+FN). Empty inputs reject. Zero denominators use tagged undefined with explicit reasons, never library default replacement0. F1 can be0 when precision is undefined; its own direct-count denominator governs it.

Total cost=FP+costFN*FN;costFN is1 or5 as authored. Same named rows/probabilities are retained when the threshold/cost changes. Training coefficients, probabilities and probability loss are unchanged. Development costs select a threshold; no final-test feedback. The three confidence sets share ranking and hard predictions at.5, but have different loss; ranking/hard accuracy does not establish calibration. Majority baseline is explicitly the always-stay hard classifier with p(churn)=0, not a prior-probability baseline. It may attain attractive imbalance accuracy and has its own undefined precision and endpoint probability loss—no falsely harmless certainty assumption.

## 4. Log loss and clipping

Natural-log observed-outcome loss is−ln(p) for y1,−ln(1−p) for y0. Correct exact endpoint gives0; impossible observed outcome gives tagged positive infinity. Average is infinite if any row diverges. Branch by label; do not evaluate0*ln0. Serialize finite numbers or explicit tag objects, never JSON NaN/Infinity.

For finite logits use stable softplus: logaddexp(0,−z) for y1 or logaddexp(0,z) for y0. This preserves finite wrong-confidence loss40 when expit(40) rounds to1. The separate evaluation_of_stored_probability legitimately sees endpoint loss infinity for y0,p1. These are different numerical representations, not inconsistent definitions. Endpoints in LG-E2 are deliberately exact authored probability diagnostics, not finite-logit mathematical endpoints.

Separately report library_float64_clipped_log_loss. The tested sklearn profile clips p to[eps,1−eps],eps=np.finfo(float64).eps=2.220446049250313e−16; manual clipped natural-log arithmetic is checked against sklearn log_loss(labels=[0,1]). A correct exact endpoint can have a tiny positive library loss while its mathematical loss is0. A wrong exact endpoint remains mathematically infinite although the library result is finite. Clipping is never applied to the mathematical field or silently used to grade an infinity answer. Numeric learner answers remain finite-only; boundary reasoning uses choices/slots.

## 5. Trained model and solver convention

The accepted local sklearn1.9.1 signature was inspected. LogisticRegression uses solver='lbfgs',l1_ratio=0.0,C∈{.1,1,10},fit_intercept=True,class_weight=None,tol=1e−10,max_iter2000,random_state1729,warm_start=False. No sample weights; omit deprecated penalty argument rather than trigger legacy warnings. Only this binary L2 solver family is fitted. C0 and lbfgs/L1 are explicit unsupported diagnostic cases, rejected before optimization by reference validation probes; they are not fitted models or extra supported solvers.

The inspected local _logistic.py sets l2_reg_strength=1/(C*n) for unweighted lbfgs. The reference objective is mean(log loss)+||w||²/(2*C*n), equivalently sum(log loss)+||w||²/(2*C). The intercept is unpenalized. Larger C weakens the coefficient preference; numeric C is not RG alpha. Do not change sample weighting or objective normalization without a new reference version.

Fit StandardScaler on estimator-training IDs only. Raw coefficients are w_scaled/scale; raw intercept is b_scaled−w_raw·mean. Predictions and decision scores in raw coordinates are independently checked against the scaled model. Three StratifiedKFold splits,shuffle=True,random_state1729, each fit scaler and model separately. All classes exist in the frozen fold-training sets. Record fold held IDs, fit IDs, mean, held metrics and convergence. Development rows never fit the original training model; final test outcomes remain withheld. No model-selection claim is licensed by lower training loss.

Accept warning-free fits with n_iter<2000, independent maximum coefficient stationarity residual<1e−7 and absolute mean intercept gradient<1e−7. The gradient is Z.T@(p−y)/n+w/(C*n); unpenalized intercept gradient is mean(p−y). These are numerical checks, not exact real-arithmetic optimality. A nonconverged/unknown future state must be rejected/tagged, not silently frozen as optimal.

## 6. Tolerances, display and invalid input

Default finite parity abs(actual−expected)≤1e−9+1e−9*abs(expected); exact IDs/classes/counts/tags/threshold comparisons have no tolerance. Metric precision/recall cross-checks use absolute1e−12 for finite values. Convergence has the separate1e−7 residual bound above. Frozen regeneration is byte-identical only on the tested environment, not a cross-platform BLAS claim.

Retain full binary64 values in JSON; display six significant digits with an approximation marker. Use full precision, never rounded display values, for threshold comparison and grading. Endpoint display must distinguish exact authored p1 from rounded sigmoid p≈1; preserve stable-loss and stored-probability labels. Normalize negative zero for display; do not replace undefined/infinity with0 or accept them as finite numeric answers.

Reject unknown fixture/configuration/version, altered row/feature order, missing/duplicate IDs, mismatched lengths, nonbinary targets, nonfinite/out-of-range probabilities, unsupported thresholds/solver tuples, negative costs, unsafe/oversize payloads and expression strings. The manifest specifies this future UI boundary; no application validator is claimed implemented. An initially wrong but supported prediction is not an invalid representation or permanent completion failure.

## 7. Profile and regeneration

CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1. Existing SciPy (a preexisting sklearn dependency, no installation) version is recorded in the lock/report. Actual OS is recorded. No application environment changes or new dependencies.

From repository root:

    python work/freeze-task-015-4.py --freeze
    python work/freeze-task-015-4.py --check

--freeze is trusted offline authoring only. --check recalculates all states/trained folds, reruns reference checks, compares complete manifest bytes and verifies source/convention/output hashes. Do not silently overwrite these outputs during future implementation; semantic changes require versioning and approval.

This freeze does not execute notebooks or UI and does not award progress/mastery. LG02.O1 remains noncritical and LG02.O2 paired critical. All six gates/counts/20-of24 policy remain unchanged. Genuine screen-reader, browser zoom, Colab and original-directory I/O reliability remain OPEN.
