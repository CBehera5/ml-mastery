# Supervised algorithm coverage and dependency matrix

16 October 2026 · proposed, not implemented. [Blueprint](SUPERVISED_LEARNING_BLUEPRINT.md).

## Existing versus missing

| Content | Implemented baseline | Remaining proposal |
|---|---|---|
| Math |Algebra, linear algebra, calculus, probability, statistics, optimization and integration|Contextual recall, not new foundation courses|
| Python |Essentials → NumPy → pandas → Visualization → Preparation → sklearn|Reuse notebook/evaluator/UI patterns; new algorithm references still need verification|
| Simple/multiple Linear Regression |Nine routes, matrix/feature examples, implementation, failure modes, project bridge and independent mastery|Link and add new-module transfer questions without replacing/awarding existing Regression evidence|
| NB / neural concepts |Probability likelihood thought experiment; X-Ray one linear neuron|Full NB and introductory multilayer classifier mechanisms are missing|
| Other requested algorithms |No complete algorithm courses; basic penalties and sklearn API examples are not substitutes|All rows below except existing MLR|
| Project engine |Task014 reserved; patterns exist but no universal approved engine specification|Separate engine specification/authorization; do not implement capstones here|

## Per-algorithm learning coverage

Each row binds all ten founder requirements: problem/motivation; visual experiment; mathematical mechanism/worked seed; trusted Python; evaluation/error analysis; alternatives; failure modes; objective assessment/remediation. Exact four-objective lesson IDs are in the [matrix](supervised-lesson-objective-matrix.md). All new algorithms use independent three-form assessment; every listed lesson's O2 is critical.

| Algorithm / lessons | Problem and prerequisite recall | Visual / worked mathematical seed | Planned notebook implementation | Evaluation, alternative, failure / remediation |
|---|---|---|---|---|
| Multiple Linear Regression — **existing**, no new course |House price from area/rooms; functions, dot products, matrix dimensions|Existing feature lab: 50+2×80+10×3=240 in stated price units|Reuse existing LinearRegression notebook/path and /learn/linear-regression/multiple-features|Recall MAE/residuals, collinearity and extrapolation; compare RG. Existing assessment unchanged; new transfer questions belong to new scopes only|
| Polynomial — PR01–04 |Curved price/age response; existing LR and NumPy shapes|PR-E1/E2; φ(2)=[2,4], 1+2x+3x²=17|PolynomialFeatures(include_bias=False) → optional scaler → LinearRegression/Ridge; all fit within folds|Degree vs generalization, tails and feature explosion; compare LR/trees. Remediate “linear in parameters means straight in x”|
| Ridge — RG01–02,05–06 |Correlated features and unstable coefficients; optimization/LA recall|RG-E1; w=(1,2), α=2 gives penalty10 under stated Ridge convention|StandardScaler → Ridge, explicit α/solver|Same-fold MAE/RMSE; compare LR/Lasso; do not treat shrinkage as causal inference or force all coefficients to zero|
| Lasso — RG01,03,05–06 |Sparse feature selection; absolute values|RG-E1; L1 norm of(1,−2)=3, α=.5 gives penalty1.5|StandardScaler → Lasso with recorded tolerance/max_iter and convergence checks|Validation plus sparsity/stability; correlated columns can change selected features. Compare Ridge; recall L1 corners, not “irrelevant feature proved”|
| Elastic Net — RG01,04–06 |Correlated candidate groups; L1/L2 recall|RG-E2; α=1,q=.5,w=(1,2): L1 part1.5 + L2 part1.25=2.75|StandardScaler → ElasticNet; fixed finite α/q grid, no endpoint equivalence shortcut|Compare under identical folds, normalized loss conventions and convergence; mixed penalty is not guaranteed better|
| Logistic — LG01–06 |Churn event probability/action; probability/logarithms/derivatives|LG-E1/E2; z=0 gives p=.5, z=ln3 gives .75; threshold changes labels|Preprocessor → LogisticRegression with pinned solver/regularization settings|Log loss/Brier, confusion costs/precision/recall; compare baseline/KNN. Probability is not class/causality; tune threshold on development only|
| KNN classification — KN01–04 |Similar customer profiles; vector distance/scaling|KN-E1/E2; distances1,2,3 with labels0,1,1 give majority1 at k=3|StandardScaler → KNeighborsClassifier; k valid within every fold|Imbalance, latency, noisy distances, high dimension; compare Logistic/SVM. No universal “larger k improves”; recall metric and tie contract|
| Naive Bayes — NB01–04 |Small labeled word counts and continuous signals; conditional probability|NB-E1/E2; proportional posterior scores .6×.5=.30 vs .4×.25=.10 normalize to .75/.25|Separate GaussianNB and MultinomialNB examples; bundled counts; smoothing and training-only count vocabulary|Precision/recall/log loss plus overconfidence caveat; compare Logistic. Independence is conditional, counts nonnegative, labels not causes|
| Tree regression — DT01,02,04–06 |Piecewise house prices; variance/mean|DT-E1; targets[2,4] → leaf mean3 and SSE2|DecisionTreeRegressor(criterion='squared_error'), fixed depth/leaf/seed|Residual regions, instability/extrapolation; compare LR/forest. A deep tree is not necessarily generalizable|
| Tree classification — DT01,03–06 |Interpretable churn rules; proportions|DT-E2; [2 positive,2 negative] Gini=.5, weighted child impurity required|DecisionTreeClassifier(criterion='gini'), fixed feature order/seed|Confusion costs/subgroups; compare Logistic/forest. Impurity importance not causal; both tasks separately assessed|
| Forest regression — RF01–05 |Stabilize noisy housing trees; sampling/averages|RF-E1; tree predictions2,4,6 average4|RandomForestRegressor, explicit bootstrap/max_features/depth/n_estimators/seed/n_jobs=1|Repeated-split stability, OOB limits, errors vs tree; no guaranteed extrapolation or uncertainty interval from spread|
| Forest classification — RF01,03–05 |Robust nonlinear churn patterns; probability vectors|RF-E2; tree p₁=.4,.4,.9 → mean.5667, unlike hard-vote majority|RandomForestClassifier with explicit same provenance settings|Cost metrics/calibration, compare Logistic/boosting; correlated trees weaken diversity; averaging does not repair leakage|
| Boosting regression — GB01,02,04–06 |Correct remaining housing errors; gradients/loss|GB-E1; f₀=3,y=5,residual2,h=2,η=.1 → f₁=3.2|GradientBoostingRegressor(loss='squared_error'), bounded stage/depth/rate grid|Train/validation stage curves, outliers and early stopping; compare forest. Sequential fitting is not bagging|
| Boosting classification — GB01,03–06 |Sequential churn log-loss correction; sigmoid/log loss|GB-E2; y=1,p=.5 gives negative logit-loss gradient .5; score step is not a label|GradientBoostingClassifier(loss='log_loss'), explicit development stopping protocol|Log loss/costs and unchanged holdout; compare forest/Logistic. More stages can hurt validation; classification is not raw-label residual fitting|
| SVM classification — SV01–05 |Separating customer groups; dot products/distances|SV-E1/E2; w=(1,0),b=0 gives boundary x₁=0 and margin distance abs(x₁); exp(−γd²) at d=1,γ=1 is e⁻¹|StandardScaler → SVC(kernel='linear' or 'rbf', probability=False), explicit C/γ|Class imbalance and fit cost, compare Logistic/KNN; margin not probability, large C not stronger regularization, kernels not magical features|
| Intro MLP classification — NN01–05 |Nonlinear interactions beyond a single neuron; X-Ray/chain rule/matrices|NN-E1/E2; ReLU(1×2−1)=1, output z=2×1=2 then sigmoid≈.8808|StandardScaler → MLPClassifier, tiny fixed architecture, explicit seed/solver/max_iter/tol|Learning curves, convergence warnings, validation loss; compare Logistic/tree. Activation needed for nonlinear composition; no guaranteed global optimum|

The hand arithmetic seeds are teaching examples, not claims of fitted sklearn outputs. Implementation must generate and verify trusted traces for actual estimator configurations separately.

## Dependency progression

Route access remains open. These are pedagogical prerequisites and remediation links, not existing-mastery imports or enforced route locks.

| Module | Required recall / preceding new modules | Why |
|---|---|---|
| EV |Existing Regression errors; Python T04–06 and S01–05; Statistics|Extend valid workflows into comparative generalization|
| PR |EV; existing multiple LR/NumPy|Feature maps change model capacity without changing linear fitting contract|
| RG |EV; existing LR/Optimization; PR01 recall optional|Penalty mechanisms do not require finishing all polynomial lessons|
| LG |EV; Probability/Derivatives; existing sklearn workflow|Probability, objective and decision differ|
| KN |EV,LG01–03; NumPy distance/scaling|Classification metrics introduced before comparison|
| NB |EV,LG01–03; Probability conditional/Bayes recall|Likelihoods versus posterior decisions|
| DT |EV,LG01–03; mean/Gini recall supplied|Both regression and classification leaf semantics|
| RF |DT,EV|Diversity and aggregation of valid trees|
| GB |DT,LG,EV; Optimization gradients|Sequential loss correction, task-specific losses|
| SV |EV,LG01–03; Linear Algebra; scaling recall|Margins/kernels and cost-aware classifier comparison|
| NN |EV,LG,RG01; X-Ray, matrices/chain rule|Multilayer nonlinearity and training instability|
| MS |EV plus PR,RG,LG,KN,NB,DT,RF,GB,SV,NN|Compare understood mechanisms; no blind leaderboard selection|

Generic algorithms do not wait for capstone data-engine implementation if the founder approves the proposed Task015/014 dependency amendment; see [decisions](supervised-implementation-roadmap.md). No shared engine or alternative project contract is silently created.
