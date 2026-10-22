export const LESSONS = [
  {
    "slug": "rf01",
    "title": "Diversity before averaging",
    "lab": 0,
    "why": "A house-price tree can change sharply after one sale changes. A forest fits several trees from resampled training information and averages them. The useful ingredient is differing errors,not just copying a diagram many times.",
    "intuition": "Picture several maps of the same housing market,each drawn from a different bag of training IDs and different feature opportunities. Their mistakes can partly cancel. Identical maps with identical errors supply no diverse information.",
    "worked": "From training IDs[A,B,C,D],a bootstrap draw[A,A,C,D] contains four draws but only three unique houses. A gets multiplicity2;B is absent and is OOB for this tree. A candidate feature draw[area,usage] is for one split,not necessarily the entire tree. Descendants draw again.",
    "changed": "In frozen RF-E1,change the last training sale from12 to8. At depth2,max_features1,the one-tree development predictions change from[2,4,10,10] to[2,4,7.6,7.6]. With three trees,mean absolute prediction change is about.433333 versus1.2 for one tree;seven gives about.452381. Less sensitivity here is not monotonic or guaranteed for every sample.",
    "math": "A bootstrap takes n draws with replacement from n training IDs;counts become sample weights. Tree b learns f_b from its draw and split candidates. Forest regression is f_bar(x)=sum_b f_b(x)/T,where T is tree count. Random feature candidates are per split. Shared training population and correlated features can still produce correlated errors.",
    "python": "from sklearn.ensemble import RandomForestRegressor\nforest = RandomForestRegressor(n_estimators=7, criterion='squared_error', max_depth=2, max_features=1, bootstrap=True, random_state=1729, n_jobs=1)\nforest.fit(X_train,y_train)\ndraws = forest.estimators_samples_\nprices = forest.predict(X_dev)",
    "comparison": "Recall DT04 sensitivity and EV sampling uncertainty. Bagging fits resampled learners separately;boosting builds a sequence using earlier errors/loss gradients and is comparison-only here. A fixed seed reproduces this pinned computation,not future population uncertainty.",
    "objectives": [
      "Trace bootstrap IDs and feature candidates",
      "Explain correlated-tree limits",
      "Distinguish bagging from sequential boosting",
      "Separate seed reproducibility from variability"
    ],
    "notes": [
      "Count multiplicities and omissions by original row ID;duplicates are not independent new observations. Candidate features and selected split features differ.",
      "Bootstrap and feature randomness can diversify errors,but do not guarantee independence or remove shared bias. Copies of one tree do not become new evidence.",
      "Independent scheduling/resampling and sequential error correction are different mechanisms;no boosting model is trained here.",
      "Record seed,settings,feature order,rows and library version. Same seed with changed data is a different computation."
    ],
    "transfer": "Trace the actual resampled IDs and per-split opportunities;explain diversity without claiming independent errors or universal improvement."
  },
  {
    "slug": "rf02",
    "title": "Regression aggregation",
    "lab": 0,
    "why": "For a new house,trees may return different leaf means. Averaging produces a numeric prediction and often stabilizes it,but a low-spread collection can still share a poor extrapolation or biased training sample.",
    "intuition": "Plot each tree's price as a point on the same horizontal ruler and mark their average. Opposing errors can cancel;errors in the same direction remain. The ruler measures model disagreement,not guaranteed coverage of the true sale price.",
    "worked": "Tree prices[2,4,6] average(2+4+6)/3=4 in100000 currency units. If the actual held-out price is8,a single prediction2 has absolute error6,the forest mean4 has error4,and the improvement is2. The individual-tree spread is not a95% prediction interval.",
    "changed": "Prices[4,4,4] still average4 and have zero spread,yet an actual price8 gives error4. In the restricted equal-variance case sigma²=4,T=3,rho=0 gives Var(mean)=4/3;rho=1 gives4. These assumptions are illustrative,not estimates of production uncertainty.",
    "math": "Mean=sum tree predictions/T. With equal marginal variance sigma² and equal pairwise correlation rho,Var(mean)=sigma²*(rho+(1-rho)/T). T is count,not extra labeled evidence. Correlation/common bias limits cancellation. Leaf constants remain piecewise constant when averaged;they do not continue a learned linear slope outside covered ranges.",
    "python": "from sklearn.metrics import mean_absolute_error, mean_squared_error\nper_tree = [tree.predict(X_dev) for tree in forest.estimators_]\nprediction = forest.predict(X_dev)\nmae = mean_absolute_error(y_dev,prediction)\nmse = mean_squared_error(y_dev,prediction)",
    "comparison": "Compare the same held-out houses with existing DT,Linear and Polynomial Regression. MAE is in target units,MSE in squared units. A forest can reduce instability yet hurt some predictions or latency;there is no universal best model or calibrated interval from tree spread.",
    "objectives": [
      "Compute the mean price",
      "Explain variance limits and reject spread-as-interval",
      "Compare matching-row residuals",
      "Explain extrapolation limits"
    ],
    "notes": [
      "Numeric targets use arithmetic means,not class voting. Keep target units and T explicit.",
      "Averaging benefits depend on covariance and bias;zero disagreement does not imply zero future error or calibrated coverage.",
      "Compare residuals on identical row IDs and targets. One improvement is not evidence that every house benefits.",
      "Averaging reached tree leaf constants cannot generate a justified linear extrapolation rule."
    ],
    "transfer": "Average numeric predictions,compare same-row unseen errors,and reject calibrated-interval or universal-improvement claims based only on tree spread."
  },
  {
    "slug": "rf03",
    "title": "Classification aggregation",
    "lab": 1,
    "why": "A churn team needs class decisions and the probability evidence behind them. Discarding every tree's class fractions before combining them can produce a different answer from the approved forest classifier.",
    "intuition": "Line up probability columns for stays and churns across all trees,then average each column. Only then choose the largest average. A separate business threshold turns a probability into an action;it is not a refit or necessarily the library's tie rule.",
    "worked": "For aligned class1 probabilities[.4,.4,.9],mean P(churn)=1.7/3=17/30≈.566667. Mean class0≈.433333,so forest argmax predicts1. Hard labels[0,0,1] would majority-vote0. This counterexample shows why hard-label voting is not the implementation's aggregation rule.",
    "changed": "Vectors[.6,.4] and[.4,.6] average[.5,.5]. Sorted-class argmax chooses0;an explicitly declared p1>=.5 action chooses1. A supplied tree with only class1 and probability1 aligns to[0,1],not[1,0]. Fitted single-class forests honestly have one outer probability column and internal tree codes must map to it.",
    "math": "For class c,forest probability p_bar_c(x)=sum_b p_b,c(x)/T after class alignment;predict=first sorted class attaining max_c p_bar_c. A separate action uses p_bar_1>=threshold. Exact0/1 need no clipping here. With positive=1,FP means actual0/predicted1,FN actual1/predicted0;fictional cost=FP+5*FN,not accuracy.",
    "python": "from sklearn.ensemble import RandomForestClassifier\nforest = RandomForestClassifier(n_estimators=7, criterion='gini', max_depth=2, max_features=1, bootstrap=True, random_state=1729, n_jobs=1)\nforest.fit(X_train,y_train)\nclass_order = forest.classes_\nprobability = forest.predict_proba(X_dev)\nlabels = forest.predict(X_dev)",
    "comparison": "Recall Logistic probabilities versus threshold actions,EV class costs and DT class fractions. Forest probabilities are not automatically calibrated risk. Churn and Documentation Quality have different positive-label meanings;fictional churn labels are not production Good/Needs Improvement annotations.",
    "objectives": [
      "Average aligned class vectors",
      "Explain probability versus hard-label voting",
      "Apply a declared threshold",
      "Compute cost-aware errors"
    ],
    "notes": [
      "Match class labels before averaging,not raw column positions. Internal tree class codes index the outer forest class order.",
      "Both correct decision and a probability-aggregation explanation are required;hard-label majority can give the opposite class.",
      "The explicit >= action includes equality;sklearn argmax ties select the first sorted class. Never classify rounded display values.",
      "Count errors on matching rows and name the positive class and costs. Accuracy can hide rare but expensive false negatives."
    ],
    "transfer": "Align and average probabilities before argmax;distinguish a separately declared threshold action and interpret class-specific error costs."
  },
  {
    "slug": "rf04",
    "title": "OOB and validation",
    "lab": 0,
    "why": "Bootstrapping leaves some training rows out of each tree. Those trees can supply internal out-of-bag predictions for that row,but this convenience does not automatically reproduce how the model will face new customers,future periods or untouched test data.",
    "intuition": "For one training ID,draw a line only to trees whose bags omit it. Average along those lines. If no line exists,no OOB prediction exists. A related customer row or a globally fitted imputer can still carry information across the supposed boundary.",
    "worked": "For rowB,tree0 draw[A,A,C,D] excludes B,tree1 draw[A,B,B,D] includes B,and tree2 draw[A,C,C,D] excludes B. Only trees0 and2 contribute. If their price predictions are3 and7,OOB mean is5 with denominator2,not3. If every bag includes B,the mathematical result is unavailable.",
    "changed": "Pinned sklearn can store an uncovered row as raw zero and include that placeholder in its default OOB score. Frozen scenes keep raw library diagnostics separate from valid covered-only estimates. OOB rows are still training-population rows;related entities,future information and globally fitted preprocessing can invalidate deployment claims.",
    "math": "Eligible_b(i)=1 if original ID i never appears in bootstrap b. OOB mean=sum eligible_b(i)*prediction_b(i)/sum eligible_b(i). Classification uses eligible aligned probability vectors before argmax. Denominator0 is an unavailable tagged state,not a zero price or uniform probability. Report coverage and excluded IDs alongside metrics.",
    "python": "from sklearn.ensemble import RandomForestRegressor\nfrom sklearn.model_selection import KFold, cross_val_score\nforest = RandomForestRegressor(n_estimators=7, max_depth=2, max_features=1, bootstrap=True, oob_score=True, random_state=1729, n_jobs=1)\nfolds = KFold(n_splits=3, shuffle=True, random_state=1729)\nscores = cross_val_score(forest,X_train,y_train,cv=folds,scoring='neg_mean_squared_error')\nforest.fit(X_train,y_train)",
    "comparison": "Recall EV time/group splits and Python Preparation fold-only fitting. For independent rows,the shown KFold is illustrative;repeated entities/future deployment require appropriate grouped/temporal alternatives. Fit learned preprocessing within each fold,select complexity on permitted development/CV and freeze before test. OOB does not authorize test-guided size or stopping.",
    "objectives": [
      "Identify eligible OOB trees",
      "Reject OOB as universal validation",
      "Compare complexity on fixed folds",
      "Repair the complete forest workflow"
    ],
    "notes": [
      "Check original row membership,not positions after resampling. Duplicates change training weight,not OOB vote count.",
      "Omitting one row cannot undo global preprocessing,time travel or related-entity leakage. State the actual violation and valid repair.",
      "Compare finite sizes,depths and feature settings on identical folds/scorers. More trees alone is not a selection metric.",
      "Keep row IDs,feature availability,training/fold state and final-test permissions explicit;pipeline names are not proof."
    ],
    "transfer": "Use only trees omitting the original row for OOB,tag uncovered rows unavailable,and keep deployment-appropriate validation and fold-only learning boundaries."
  },
  {
    "slug": "rf05",
    "title": "Importance and comparison",
    "lab": 1,
    "why": "An importance plot can help investigate a forest,but it can also encourage invalid claims about what causes churn or which features are useless. Responsible comparison examines the mechanism,metric,correlated substitutes and data coverage behind a ranking.",
    "intuition": "Impurity importance asks where training split reductions were assigned. Permutation asks what happens to a held-out score when one column is shuffled. A correlated substitute can keep the score unchanged even when the shuffled feature contains useful information.",
    "worked": "Original held-out accuracy.75,permuted.5 gives score decrease.25. Original.5,permuted.75 gives-.25;negative is possible and not a negative causal effect. Impurity importance.8 means a share of retained training reductions,not an80% intervention effect.",
    "changed": "In the frozen duplicate-feature churn fixture,a feature can have mean permutation decrease0 while a standalone single-feature tree achieves accuracy1 on the four development rows. The companion column can substitute. This tiny controlled example disproves 'zero means useless';it is not production performance or evidence that forests remove all bias.",
    "math": "Permutation decrease=score_original-score_permuted,with declared metric direction,row IDs,random seed and repeats. Impurity importance sums weighted node gains per feature and normalizes over retained reductions. Correlation,cardinality,training sample and scoring choice affect interpretation. Neither quantity identifies causal interventions.",
    "python": "from sklearn.inspection import permutation_importance\nimpurity = forest.feature_importances_\npermutation = permutation_importance(forest,X_dev,y_dev,scoring='accuracy',n_repeats=3,random_state=1729,n_jobs=1)\nscore_decreases = permutation.importances\nmean_decrease = permutation.importances_mean",
    "comparison": "Compare forests,individual trees and existing linear models on matching targets,held-out IDs,metrics,costs and latency. Report subgroup counts,shift,sensitivity and range limits. Development importance used for feature choice becomes selection evidence,not an independent final test. Gradient Boosting remains a later,unimplemented algorithm.",
    "objectives": [
      "Read impurity and permutation evidence",
      "Reject causal/unbiased importance claims",
      "Compare forest,tree and linear baselines",
      "Report latency,stability and subgroup limits"
    ],
    "notes": [
      "Define scorer sign and permutation procedure;zero/negative differences are valid. Training impurity and held-out score changes answer different questions.",
      "Reject causal and universally unbiased readings. Explain correlation/substitution,split opportunities or population coverage in the actual case.",
      "Control the evaluation conditions;different mechanisms need fair error/cost comparisons,not universal rankings.",
      "More trees can cost more computation and still share errors. Tiny subgroup evidence and shifted populations limit conclusions."
    ],
    "transfer": "Interpret importance as model/data/metric-dependent evidence,not causality or universal relevance;compare matching unseen errors and practical costs."
  }
] as const;
