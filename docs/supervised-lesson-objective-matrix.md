# Proposed lesson-level objective matrix

16 October 2026 · specification, not authored lessons or implemented checks.

## Binding conventions

Every row has four measurable essential families, named `<lesson>.O1` through `.O4` in column order. **Every O2 is critical and requires both a decision/calculation and an independently correct reason/transfer component.** There are63 rows,252 families and63 paired gates. No other hidden critical families. Critical behavior is not limited to memorizing a definition: unseen inputs and counterexamples are mandatory.

For **every objective**: two practice instances `<ID>.practice.A/B` and three independent instances `<ID>.assessment.A/B/C`. All forms contain every family once; critical families have two atoms. These naming/count rules define coverage, not actual assessment fixtures. Remediation in the last column applies specifically to the row's misconception; each of four eventual item explanations must also point to its own objective and worked step. Module-level prerequisites are in the [dependency matrix](supervised-algorithm-coverage.md); rows progress top-to-bottom within a module. Later examples may recall earlier rows, never require an unintroduced operation.

Every row uses the full [lesson depth contract](SUPERVISED_LEARNING_BLUEPRINT.md#depth-and-lesson-contract), including a second contrasting example and an ML transfer application. The worked seed below is the minimum numerical starting point, not sufficient finished teaching. Labs are specified [separately](supervised-visual-experiments.md); tracing/guided notebook edits accompany each lesson even when a core lab is shared.

## EV — evaluation and generalization (6 lessons)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| EV01 — Define the prediction moment |Specify target, unit and eligible features|Reject future-outcome features and explain temporal availability|Choose row/group/time split for the deployment question|Identify an out-of-scope causal claim|Churn at day30 cannot use cancellation at day60; EV-E1. High correlation is not feature permission → draw the timestamp boundary|
| EV02 — Estimate generalization |Separate parameters, hyperparameters and final evaluation|Reject final-test-driven model/threshold selection and explain optimism|Compute baseline-relative error from fixed predictions|Interpret negative R² without calling it accuracy|MAE4 vs baseline5 is20% reduction; R² can be−1; EV-E1. Low training error proves nothing unseen → compare held-out residuals|
| EV03 — Classification decisions and costs |Construct confusion counts for a named positive class|Reject accuracy-only success under imbalance and justify a cost-aware metric|Calculate precision/recall/F1 with explicit denominator policy|Compare two thresholds without treating either as a retrained model|One positive in100: all-negative accuracy99%, recall0; EV-E2. Restore denominators and decision costs|
| EV04 — Probabilities versus ranking |Distinguish label, score and probability|Identify invalid probability interpretation/calibration conclusions and explain why|Compute two-row Brier/log-loss contributions|Distinguish ROC ranking, precision-recall trade-off and average precision|y=1,p=.8 → squared probability error.04; EV-E2. Ranking well is not calibrated risk → compare equal ranks/different probabilities|
| EV05 — Bias, variance and uncertainty |Describe underfit/overfit from train/development curves|Choose model capacity using development evidence, not repeated test inspection|Compare variability across fixed resamples|Separate sampling uncertainty from deterministic seed reproducibility|Train/development MAE pairs(8,9),(1,12); EV-E1. Complexity is not monotonically better → change sample/degree|
| EV06 — Honest workflow report |Reconstruct preprocessing fit provenance|Reject cross-fold/global fitting and explain which rows may influence each stage|State population/shift and subgroup error limitations|Produce a reproducible comparison record with final-test permission|Fold A's mean uses only A-training IDs; EV-E1. Pipelines are not magic → inspect actual fit-row manifest|

## PR — polynomial regression (4)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| PR01 — Curves from features |Construct degree2 feature columns and dimensions|Explain why a polynomial predictor is linear in coefficients but curved in input|Calculate a polynomial prediction with units|Identify unintended duplicate intercepts|x=2,φ=[2,4],w=[2,3],b=1 →17; PR-E1. “Linear means straight” → hold φ fixed and vary w|
| PR02 — Interactions and capacity |Construct a two-feature interaction row|Predict feature explosion and reject an unsupported high-degree design|Compare extrapolated versus interpolated predictions|Debug feature order/shape mismatch|[a,b]=[2,3] → [a,b,a²,ab,b²]=[2,3,4,6,9]; PR-E1. Interactions are not extra observations → count columns|
| PR03 — Degree and regularization |Compare fixed degree train/development curves|Select degree/penalty inside folds without fitting preprocessing on validation|Explain why scaling matters for polynomial penalties|Repair an authored polynomial pipeline order|Degree1/3/9 with same split; PR-E2. Test-peeking is not tuning → restore held-out boundary|
| PR04 — Limits and alternatives |Interpret curved residual structure|Reject a good-interpolation score as evidence of safe extrapolation|Compare polynomial, linear and tree assumptions|Document a justified model and failure case|x² grows from4 at2 to100 at10; PR-E2. Fit shape is not domain law → test input range|

## RG — regularized regression (6)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| RG01 — Why penalize? |Diagnose coefficient instability under correlated features|Distinguish training loss from penalized objective and justify the trade-off|Compute L1/L2 norms with an unpenalized intercept|Recall training-only feature scaling|w=(1,−2):L1=3,L2²=5; RG-E1. Lower objective is not necessarily lower validation error → separate terms|
| RG02 — Ridge shrinkage |Calculate Ridge objective under its declared normalization|Explain L2 shrinkage without claiming exact feature elimination|Predict effect of increasing α on a frozen fit trace|Compare with existing unregularized LR|SSE4+α2×norm5=14; RG-E1. Shrinkage is not automatic zero selection → inspect coefficient path|
| RG03 — Lasso sparsity |Calculate Lasso objective under its declared normalization|Interpret zero coefficients without claiming causal irrelevance or stable selection|Compare correlated-column alternatives|Recognize nonconvergence in an authored output|n=2,SSE4,α=.5,L1=3 →2.5; RG-E1. Zero is conditional on model/data → swap correlated columns|
| RG04 — Elastic Net mixture |Compute L1 and L2 mixture contributions|Explain α versus mixing fraction without equating different solvers' α values|Select a finite mix candidate using development evidence|Compare sparsity/stability against Ridge/Lasso|w=(1,2),α1,q.5 penalty2.75; RG-E2. Mixing is not averaging final predictions → expand objective|
| RG05 — Fit and select safely |Read a trusted scaling/fit trace|Reject full-data scaling/feature selection and explain fold-local fitting|Repair the bounded pipeline/parameter grid|Identify unsupported solver/convergence conclusions|Fold mean10,validation value30 must not change mean; RG-E2. Preprocessing is learned → trace row IDs|
| RG06 — Interpret and compare |Back-transform a scaled coefficient with units|Reject coefficient magnitude as causal/scale-free importance|Compare validation error, sparsity and coefficient stability|Choose a simpler adequate model with caveats|Standardized coefficient6 / scale3 =2 per raw unit; RG-E2. Large coefficient may reflect scale → restore units|

## LG — logistic regression (6)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| LG01 — From score to probability |Compute a linear logit and sigmoid|Distinguish fit, probability prediction and threshold decision|Explain coefficient direction in log-odds, not probability units|Identify a malformed output shape|z=ln3 →p=.75; LG-E1. Name “regression” does not imply continuous target → inspect modeled outcome|
| LG02 — Learn with log loss |Calculate one binary log-loss term|Explain why fitting uses training labels and cannot use test labels|Predict gradient direction on a tiny trace|Compare log loss with hard-label error|y1,p.5 lossln2; LG-E1. A correct label can still have poor probability loss → vary confidence|
| LG03 — Thresholds and imbalance |Build labels from fixed probabilities|Select a threshold on development costs without claiming retraining or test permission|Compute threshold confusion counts|Explain positive-class convention and prevalence|p=[.2,.6,.8],threshold.7 →[0,0,1]; LG-E2. Threshold is an action rule → keep probabilities fixed|
| LG04 — Regularization and geometry |Relate boundary to feature scaling|Explain inverse C strength and reject unsupported solver/penalty combinations|Compare linear boundary with curved data|Diagnose separation/unstable coefficients|Boundary x₁+x₂=2; LG-E1. Larger C is not larger penalty → inspect explicit objective convention|
| LG05 — Trusted classification workflow |Read estimator fit/predict_proba outputs|Reject leakage from target-derived features or globally fitted transforms|Repair an authored pipeline and aligned target labels|Compare DummyClassifier and Logistic on identical rows|Same100 IDs, same split; LG-E2. A better score on easier rows is not a better model → align IDs|
| LG06 — Explain limits |Interpret false positives/negatives and subgroup errors|Reject probability/association as causal effect or guaranteed future risk|Compare Logistic with KNN/tree candidates|Report calibration/shift and linear-boundary limits|Two equal-ranked score sets with different calibration; LG-E2. Odds ratio is not intervention effect → state observational boundary|

## KN — KNN classification (4)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| KN01 — Vote among neighbors |Calculate distances and ordered neighbors|Derive a vote with explicit tie rules and explain why labels are not averaged as regression|Predict a label from k neighbors|Distinguish stored training examples from prediction queries|Distances1,2,3,labels0,1,1 →1 at k3; KN-E1. Nearest is not necessarily representative → inspect local evidence|
| KN02 — Scale defines closeness |Compute scaled two-feature distances|Reject test-fitted scaling and explain metric sensitivity to units|Compare raw/scaled neighbor sets|Diagnose irrelevant high-dimensional features|Currency1000 versus age1 overwhelms Euclidean distance; KN-E2. Unit changes alter geometry → standardize within train|
| KN03 — Choose k honestly |Compare finite k train/development results|Reject k exceeding fold-training count or selected using final test|Explain bias/variance behavior without monotonic guarantees|Compare uniform versus distance weighting|k1 vs3 on a noisy point; KN-E1. Smoother is not always correct → inspect minority boundary|
| KN04 — Workflow and limits |Repair a bounded sklearn KNN pipeline|Identify imbalance/distance/query-cost failure and explain its mechanism|Compare Logistic/SVM assumptions|Summarize valid unseen-data performance|Same query, fixed training rows, changed noise; KN-E2. Fast fit does not imply fast inference → count distance work|

## NB — Naive Bayes (4)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| NB01 — Combine class evidence |Compute normalized posterior from supplied likelihoods|Explain conditional independence given class, not independence of all features|Distinguish prior, likelihood and posterior|Use log-score addition to avoid tiny products|Scores.30/.10 →posteriors.75/.25; NB-E1. Bayes rule does not prove causation → separate conditioning/intervention|
| NB02 — Counts and smoothing |Calculate smoothed word likelihood|Reject negative count inputs or held-out vocabulary fitting with a reason|Predict effect of a zero-count term|Compare class prior and count normalization|Counts[2,0],α1 →[3/4,1/4]; NB-E1. Absent count is not impossible language → add declared smoothing|
| NB03 — Continuous likelihoods |Calculate/compare supplied Gaussian likelihoods|Choose Gaussian versus Multinomial assumptions for a feature representation|Diagnose correlated/repeated evidence and overconfidence|Interpret variance smoothing without promising calibration|Likelihoods.5/.25 and priors.6/.4; NB-E2. Continuous value is not a count → inspect domain|
| NB04 — Evaluate probabilistic shortcuts |Trace a training-only NB workflow|Reject accuracy-only/calibration/causal conclusions unsupported by evaluation|Compare Logistic/NB under the same split/costs|Explain false-positive/negative examples and distribution shift|Duplicate a correlated token signal; NB-E2. More features can double-count evidence → collapse redundant signal|

## DT — decision trees (6)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| DT01 — Partition feature space |Follow a split path for a new row|Distinguish training a split from routing an unseen row|Describe axis-aligned regions|Handle equality at an authored threshold|x≤2 goes left; DT-E1/E2. Prediction does not rebuild the tree → trace fixed nodes|
| DT02 — Regression leaves |Calculate leaf mean and SSE|Choose a split by weighted squared-error improvement and explain leaf prediction|Compare parent and child residuals|Identify inability to extrapolate beyond leaf predictions|[2,4] mean3,SSE2; DT-E1. Regression leaves are not majority labels → calculate mean|
| DT03 — Classification leaves |Compute class proportions and Gini|Choose weighted impurity improvement and explain class/probability output|Compare balanced and imbalanced leaves|Distinguish impurity from held-out predictive success|Parent2/2 Gini.5; DT-E2. Unweighted child averaging ignores sample counts → restore weights|
| DT04 — Depth and stability |Compare shallow/deep train/development errors|Reject maximal depth chosen on training error and explain variance|Predict sensitivity to a changed row|Read pruning/min-leaf trade-offs|Move one boundary point; DT-E1/E2. Exact training fit is not generalization → inspect validation|
| DT05 — Fit safely |Read fixed criterion/depth/seed parameters|Reject leakage, target misalignment or invalid split provenance|Repair a bounded tree workflow|Compare regression/classification metrics correctly|Same features, numeric versus categorical target; DT-E1/E2. Shared tree name does not imply shared loss → label task|
| DT06 — Explain rules and limits |Translate a path into a local rule|Reject rule/impurity importance as causal or globally reliable|Compare tree with linear model and forest|Report subgroup errors, instability and range limits|Rule covers3 of20 training rows; DT-E2. Simple path is not universal explanation → state coverage|

## RF — random forests (5)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| RF01 — Diversity before averaging |Trace bootstrap rows and feature candidates|Explain why correlated trees reduce ensemble benefit without claiming independence|Distinguish bagging from sequential boosting|Identify seed versus sample variability|Two identical trees add no diverse errors; RF-E1. More copies are not more evidence → compare predictions|
| RF02 — Regression aggregation |Compute mean tree prediction|Explain variance reduction limits and reject tree spread as a calibrated interval|Compare forest/tree residuals|Identify extrapolation limitations|[2,4,6] →4; RF-E1. Averaging does not learn outside tree leaves → test range|
| RF03 — Classification aggregation |Average aligned class-probability vectors|Distinguish probability averaging from hard-label majority with a counterexample|Apply a declared decision threshold|Compute cost-aware errors|p₁=[.4,.4,.9] mean.5667 →class1; RF-E2. Hard votes would differ → compare both explicitly|
| RF04 — OOB and validation |Identify which trees exclude a training row|Reject OOB as a universal replacement for temporal/grouped validation|Compare n_estimators/depth/max_features on fixed folds|Repair a bounded forest workflow|Training row absent from selected bootstraps; RF-E1. OOB cannot undo leakage or time travel → inspect provenance|
| RF05 — Importance and comparison |Read impurity/permutation evidence|Reject causal or unbiased-importance claims from a single plot|Compare forest, tree and linear baselines|Report latency, instability and subgroup limitations|Two correlated predictors share credit; RF-E2. Low permutation score need not mean useless → recall redundancy|

## GB — gradient boosting (6)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| GB01 — Sequential correction |Trace an additive model by stage|Distinguish sequential loss correction from independent tree averaging|Explain learning rate and base-learner complexity|Identify which rows fit each stage|f₀3+η.1×h2=3.2; GB-E1. Trees do not all fit original targets → inspect stage targets|
| GB02 — Squared-error regression |Compute residuals and an update|Explain negative gradients for squared loss and predict a corrected value|Calculate changed training loss|Recognize outlier sensitivity|y5,f3,r2 →3.2; GB-E1. A training decrease need not improve unseen error → compare validation|
| GB03 — Classification loss |Compute sigmoid and a supplied log-loss gradient|Explain why classification updates logit/loss gradients, not raw class-label residual regression|Convert updated scores to probabilities|Distinguish score, probability and label|y1,p.5 →negative gradient.5; GB-E2. Regression residual intuition is incomplete → derive named loss step|
| GB04 — Stage count and stopping |Read fixed stage train/development curves|Choose stopping on permitted development data without touching final test|Compare rate×stage trade-offs|Identify an overfit tail|Validation loss bottoms at stage4; GB-E1/E2. More stages are not always better → mark minimum honestly|
| GB05 — Workflow and leakage |Reconstruct preprocessing/fit order|Reject cross-fold/global preparation or test-based stopping and explain leakage|Repair bounded regression/classification pipelines|Select task-appropriate loss/metric|Fit scaler separately perfold; GB-E2. Powerful models cannot fix invalid evaluation → trace fit IDs|
| GB06 — Compare and diagnose |Compare forest/boosting residual and confusion evidence|Reject causal/guaranteed-best claims and identify sensitive/noisy targets|Explain feature importance limitations|Report fit cost, calibration and shift caveats|Same folds, changed noise; GB-E1/E2. Winning one synthetic set is not universal → state domain|

## SV — support vector classification (5)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| SV01 — Margin geometry |Compute a linear decision score and distance|Distinguish sign decision, margin and probability|Identify support-vector influence in a frozen scene|Explain feature-scale dependence|w=(1,0),b0,x=(2,3):score2,distance2; SV-E1. Distance is not calibrated risk → inspect output type|
| SV02 — Soft margins and C |Read hinge-loss/slack examples|Explain C's trade-off without equating larger C with more regularization|Predict sensitivity to an outlier|Compare Logistic and linear SVM loss|Label+1,score.5 →hinge.5; SV-E1. Zero training error can shrink robustness → move outlier|
| SV03 — RBF locality |Calculate an RBF similarity|Explain gamma's locality and distinguish kernel similarity from a new input column|Compare linear/RBF boundaries|Identify overfit small regions|d1,γ1 →e⁻¹; SV-E2. A nonlinear kernel is not universally better → compare held-out boundary|
| SV04 — Safe scaled workflow |Trace scaler/SVC fitted rows|Reject test-tuned C/gamma or globally scaled folds and explain why|Repair predefined pipeline/grid slots|Handle imbalance with explicit class-weight policy|Finite C×γ development grid; SV-E2. Parameter search consumes validation information → reserve final test|
| SV05 — Limits and comparison |Compare classification errors and query costs|Reject uncalibrated scores as probabilities or extrapolated reliability|Explain kernel scaling/resource limits|Compare KNN/Logistic/tree choices for a stated problem|Same scores, alternative thresholds; SV-E1/E2. Margin ranking alone is not calibrated decision quality → choose evidence|

## NN — introductory MLP classification (5)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| NN01 — Beyond one neuron |Trace input/hidden/output shapes and parameters|Explain why nonlinear activations are needed between linear layers|Calculate a two-layer forward pass|Relate to existing X-Ray weighted sums|ReLU(2−1)=1,output z2,p≈.8808; NN-E1. Two linear layers collapse to one → multiply matrices|
| NN02 — Learn through gradients |Read chain-rule dependencies|Distinguish training gradient updates from fixed-weight prediction|Calculate one supplied bounded gradient step|Recognize saturation/dead-activation cases|w1,gradient.2,η.1 →w.98; NN-E2. Predicting does not adjust weights → freeze parameters|
| NN03 — Capacity and regularization |Compare tiny architecture parameter counts|Explain overfit/regularization/early-stopping trade-offs without promising global optimum|Read training/development loss curves|Diagnose convergence warnings|2→2→1 has9 parameters including biases; NN-E1/E2. More layers do not guarantee success → inspect validation/convergence|
| NN04 — Reproducible safe workflow |Trace seed, scaling and solver configuration|Reject leaked preprocessing/stopping and explain train/fold boundaries|Repair an authored MLP pipeline|Separate deterministic configuration from cross-host exact arithmetic|Same seed/config, permitted stopping rows only; NN-E2. Seed is not a validity guarantee → inspect data flow|
| NN05 — Interpret limits |Compare MLP/Logistic/tree evidence|Reject causal, guaranteed-best or hidden-layer-as-human-concept claims|Report resource/shift/calibration limitations|Choose a simpler adequate baseline when justified|Equal validation error, different fit costs; NN-E1/E2. Flexible is not inherently better → justify selection|

## MS — model selection, tuning and interpretation (6)

| Lesson / purpose | O1 | **O2 critical** | O3 | O4 | Worked/guided seed; misconception → remediation |
|---|---|---|---|---|---|
| MS01 — Fair comparison |Construct a same-row/fold/metric comparison table|Reject unequal information budgets/splits and explain why rankings are invalid|Compare baseline-relative scores and costs|Record parameter/preparation provenance|MAE4 vs5 only meaningful on matching IDs; MS-E1. Higher leaderboard is not fair if data differ → align manifests|
| MS02 — Search consumes information |Enumerate a finite grid and its fits|Reject selection on final-test results and explain selection optimism|Choose explicit scoring/refit conventions|Compare grid and seeded finite random search|3C×2γ×3folds=18 fits before refit; MS-E1. Search is not free unbiased evaluation → separate selection/evaluation|
| MS03 — Nested and structured validation |Trace outer versus inner fold roles|Reject preprocessing/tuning across outer holdouts or groups/time and explain boundaries|Interpret nested score versus final-refit artifact|Identify insufficient/group-invalid folds|Outer3×inner2,all fit IDs recorded; MS-E1. Nested CV does not train one magical final model → distinguish artifacts|
| MS04 — Imbalance and thresholds |Compare fixed class weights and threshold candidates|Reject resampling/threshold/calibration fitting on validation/test targets|Compute cost-aware development selection|Distinguish prevalence change from causal effect|FN cost10,FP cost1; MS-E2. Higher accuracy may increase cost → reconstruct confusion counts|
| MS05 — Interpret responsibly |Compute a held-out permutation score change|Reject permutation/coefficient/partial-dependence evidence as causal proof|Explain correlated-feature and subgroup limitations|Compare local/global and model/data explanations|MAE4→6 after permutation:degradation2; MS-E2. Importance depends on data/model → swap correlated proxy|
| MS06 — Reproducible final decision |Select an adequate model under declared constraints|Protect one final-test evaluation and explain honest failed-test reporting|Construct a reproducible model card/selection report|Map limitations and deployment prerequisites to a capstone|Freeze choice before unsealing test manifest; MS-E1/E2. Bad final performance is not permission to retune on test → report limits and new-study need|

## Coverage and anti-superficiality acceptance

Before each module's implementation is accepted, build an actual teaching→worked example→lab→practice A/B→assessment A/B/C→reason feedback mapping for all objectives. A row label or API-name quiz is not evidence of coverage. All O2 gates must include a plausible numerical/semantic trap and an explanation component; failures at otherwise passing totals must reject mastery. See [exact test counts and thresholds](supervised-mastery-and-evaluator-proposal.md).

Highest depth risks: RG penalty conventions; NB likelihood assumptions; GB classification gradients; SV margin/kernel geometry; NN backprop; MS nested CV/interpretability. Require staged small-number traces before notebook APIs, contrasting examples, and review by a mathematics/ML educator. Recognition on three authored forms does not establish unrestricted programming competence; later comprehensive audit and authorized learner testing remain required.
