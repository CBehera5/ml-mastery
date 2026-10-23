export const LESSONS = [
  {
    "slug": "gb01",
    "title": "Sequential correction",
    "lab": 0,
    "why": "A forest asks many trees at once and averages. There is another way to use many trees: ask one, look at what it got wrong, and let the next tree work only on that.",
    "intuition": "Start with the average price. Fit a small tree to the leftovers and add a fraction of it. Fit the next tree to what is still left. Each tree exists only to repair the ones before it, so they cannot be treated as independent, and averaging them would be a different thing.",
    "worked": "With F0=3,eta=.1 and supplied tree h1=2,F1=3+.1×2=3.2. If the target is5,the residual changes from 2 to 1.8. A second supplied leaf h2=1 givesF2=3.3. Averaging3,2 and1 would be a different operation.",
    "changed": "Change h to−2:3+.1×(−2)=2.8. The sign follows the current training loss, not a rule that boosting always increases predictions. Change eta and the later training targets also change.",
    "math": "F_m(x)=F_(m−1)(x)+eta*h_m(x). F is current prediction/raw score,m the stage, eta the learning rate,h_m the fitted weak learner. Its target depends on the loss derivative evaluated at F_(m−1),not on validation/test labels. Forest aggregation instead takes a mean of independently fitted predictions/probability vectors.",
    "python": "from sklearn.ensemble import GradientBoostingRegressor\nmodel = GradientBoostingRegressor(loss='squared_error', learning_rate=.1, n_estimators=8, max_depth=1, min_samples_leaf=2, random_state=1729, n_iter_no_change=None)\nmodel.fit(X_train,y_train)\nfor prediction in model.staged_predict(X_validation):\n    print(prediction)",
    "comparison": "Recall DT weak learners,RF bagging and EV information boundaries. Housing,customer churn and future Documentation Quality classification have different targets but can share the sequential loss-correction idea.",
    "objectives": [
      "Trace an additive model by stage",
      "Distinguish sequential loss correction from independent tree averaging",
      "Explain learning rate and base-learner complexity",
      "Identify which rows fit each stage"
    ],
    "notes": [
      "Residual y−F=2;for half-squared loss this is the negative gradient. A leaf averages its assigned training residuals; here its supplied value is2. Add eta*h,not h alone,so prediction=3.2. This is not a validation guarantee.",
      "Boosting is sequential:the current model determines training-stage targets. Bagging fits resampled original targets and averages independently fitted outputs. Validation measures stages;it never supplies their targets.",
      "Eta scales each added learner; depth constrains its partitions. Later training targets depend on earlier updates,so rate and stage count are coupled, not an exact interchangeable product. Compare permitted validation curves.",
      "All weak learners and their targets use the training partition. Validation scores compare already fitted stages; test remains outside development. Fitting a later stage is still training, not inference."
    ],
    "transfer": "Distinguish sequential loss correction from independent tree averaging. Trace actual quantities and allowed row IDs; reject training-score,universal-winner or test-feedback shortcuts."
  },
  {
    "slug": "gb02",
    "title": "Squared-error regression",
    "lab": 0,
    "why": "To fix a price guess we need to know which way to move it and by how much. For prices, the answer is just the gap between the actual price and the guess.",
    "intuition": "With squared error, the push on the guess is the leftover itself. A leaf proposes the average leftover of the houses in it, and only a fraction of that is added. Halving the squared error is a convention that keeps the push equal to the leftover.",
    "worked": "For y=5,F=3,residual2,a supplied leaf2 and eta.1 giveFnew3.2. Squared error changes4→3.24;half-squared loss2→1.62. For a leaf with residuals[2,4],mean correction3—not every row's residual—is the unscaled leaf prediction.",
    "changed": "A residual20 contributes400 squared error versus4 for residual2. Chasing an anomalous sale can dominate training improvement and hurt validation. The noisy fixed example data demonstrates a real overfit tail.",
    "math": "For L=(y−F)^2/2,−dL/dF=y−F. A squared-error leaf predicts the mean of assigned training residuals. MSE=sum(y−F)^2/n is twice mean half-squared loss and is in squared target units. An error-reducing training update is not proof of lower unseen error.",
    "python": "import numpy as np\nfrom sklearn.metrics import mean_squared_error\nresidual = y_train - current_prediction\nsupplied_update = current_prediction + .1 * leaf_prediction\nmse = mean_squared_error(y_train,supplied_update)",
    "comparison": "Compare existing Linear/Polynomial Regression and forests on the same held-out houses. Squared loss is sensitive to noisy sales; regularization/shrinkage and validation manage complexity, not a guarantee.",
    "objectives": [
      "Compute residuals and an update",
      "Explain negative gradients for squared loss and predict a corrected value",
      "Calculate changed training loss",
      "Recognize outlier sensitivity"
    ],
    "notes": [
      "Residual y−F=2;for half-squared loss this is the negative gradient. A leaf averages its assigned training residuals; here its supplied value is2. Add eta*h,not h alone,so prediction=3.2. This is not a validation guarantee.",
      "Residual y−F=2;for half-squared loss this is the negative gradient. A leaf averages its assigned training residuals; here its supplied value is2. Add eta*h,not h alone,so prediction=3.2. This is not a validation guarantee.",
      "MSE=sum residual²/n=5.0;half-squared loss averages half that. Keep units squared and do not infer held-out performance from a training decrease.",
      "Scaling a residual by 10 scales its squared-error contribution by 100. Residual correction can chase noise. Inspect provenance,validation and task-appropriate losses;do not silently change this module's squared-error criterion."
    ],
    "transfer": "Explain negative gradients for squared loss and predict a corrected value. Trace actual quantities and allowed row IDs; reject training-score,universal-winner or test-feedback shortcuts."
  },
  {
    "slug": "gb03",
    "title": "Classification loss",
    "lab": 1,
    "why": "For churn, the leftover is a chance, not a price. A model that is already 99% sure should not be pushed the same distance as one that is on the fence.",
    "intuition": "The push on the score is the actual outcome minus the current chance. Dividing by p(1 − p), a measure of how unsure the model is, gives the size of the leaf's correction. One such step is a picture of the idea, not the whole fitting recipe.",
    "worked": "At y=1,F=0,p=.5,the negative score gradient is.5. For an illustrative single-row leaf,the Newton denominator p(1−p)=.25,so leaf correction=.5/.25=2. With eta.1,Fnew=.2,pnew≈.549834. Do not replace this leaf with gradient.5. A supplied one-point gradient step is not the full classifier fitting algorithm.",
    "changed": "If F=0,p=.5,our explicit p>=.5 action is1,but sklearn predict uses score>0 and chooses0 at equality. If y=0 instead,the negative gradient is−.5 and the Newton correction has negative sign. Do not grade rounded probabilities.",
    "math": "p=sigmoid(F)=1/(1+exp(−F));binary log-loss L=log(1+exp(F))−yF has negative score gradient y−p. Binary sklearn leaf update gamma=sum(y−p)/sum(p(1−p));Fnew=F+eta*gamma for rows in that leaf. Init is training-prior log odds, not always0. Extreme-score loss uses stable logaddexp; mathematical wrong-certain predictions have infinite loss, not an invented zero.",
    "python": "from sklearn.ensemble import GradientBoostingClassifier\nmodel = GradientBoostingClassifier(loss='log_loss', learning_rate=.1, n_estimators=8, max_depth=1, min_samples_leaf=2, random_state=1729, n_iter_no_change=None)\nmodel.fit(X_train,y_train)\nscore = model.decision_function(X_validation)\nprobability = model.predict_proba(X_validation)[:,1]\naction = (probability >= .5).astype(int)",
    "comparison": "Recall Logistic Regression's sigmoid and EV log-loss. Forests average per-tree probability vectors; boosting adds score corrections before sigmoid. Good versus Needs Improvement would need approved human labels, not LLM ground truth.",
    "objectives": [
      "Compute sigmoid and a supplied log-loss gradient",
      "Explain why classification updates logit/loss gradients,not raw class-label residual regression",
      "Convert updated scores to probabilities",
      "Distinguish score,probability and label"
    ],
    "notes": [
      "p=0.11920292202211755;negative logit-loss gradient=1−p=0.8807970779778824. It is not a class label or necessarily the fitted leaf value.",
      "Binary log-loss gradient is y−p in score space. sklearn terminal-leaf correction=sum(y−p)/sum(p(1−p));then F adds eta times that correction. Probabilities are sigmoid(F),not raw label residuals.",
      "p=1/(1+exp(−F))=0.18242552380635635. Convert after additive score updates; eta does not directly interpolate labels or average tree probabilities.",
      "Scores span the real line, probabilities lie in[0,1],labels are discrete. Threshold equality is explicit;do not use rounded display values. Library predict at zero chooses class 0,while the authored >=.5 action chooses1."
    ],
    "transfer": "Explain why classification updates logit/loss gradients,not raw class-label residual regression. Trace actual quantities and allowed row IDs; reject training-score,universal-winner or test-feedback shortcuts."
  },
  {
    "slug": "gb04",
    "title": "Stage count and stopping",
    "lab": 0,
    "why": "Every extra correction fits the training houses a little better. At some point it starts fitting their noise instead.",
    "intuition": "Training error only falls. Error on houses the model has not seen falls, reaches a low point, then rises. Keep the stage at the low point, chosen on unseen houses. A slower step size needs more stages to get there. For churn, look at probability quality too, because labels can stay correct while the probabilities get worse.",
    "worked": "Fixed noisy regression eta.5 has validation MSE.800318 at stage4 versus1.228202 at stage8,so budget8 selects4. Fixed noisy classification eta.5 selects4 with log-loss.248271 versus.283391 at8,even though validation accuracy is1 at every stage. Probability quality and correct labels are different.",
    "changed": "Validation losses[.8,.8,.9] select the earliest tied stage. The exact policy is earliest within1e−12 of the minimum. A test curve that prefers another stage is not permission to change the development choice.",
    "math": "For stagesm=1…budget,compute validation MSE or mean binary log-loss. Choose earliest stage within absolute1e−12 of the minimum. Stage0 is displayed but not a candidate. Internal n_iter_no_change=None disables library early stopping. Eta×stage count is not a sufficient description of the sequence.",
    "python": "from sklearn.metrics import mean_squared_error\nlosses = [mean_squared_error(y_validation,p) for p in model.staged_predict(X_validation)]\nminimum = min(losses)\nstage = next(i+1 for i,loss in enumerate(losses) if abs(loss-minimum) <= 1e-12)",
    "comparison": "Compare forests and boosting under matched splits, not tree-count alone. The forest baseline is illustrative, not tuned-cost-matched. Development wins have selection uncertainty; final test is not another tuning curve.",
    "objectives": [
      "Read fixed stage train/development curves",
      "Choose stopping on permitted development data without touching final test",
      "Compare rate×stage trade-offs",
      "Identify an overfit tail"
    ],
    "notes": [
      "Choose stage1 by validation loss, not training loss or test feedback. Labels on validation can compare trained prefixes but never fit those trees. Exact ties use earliest stage within1e−12.",
      "Choose stage1 by validation loss, not training loss or test feedback. Labels on validation can compare trained prefixes but never fit those trees. Exact ties use earliest stage within1e−12.",
      "Shrinkage changes earlier predictions and all later gradient targets. More stages or smaller steps can help or hurt; compare actual loss on permitted validation rows.",
      "Loss directions differ across partitions. Later corrections can chase training noise; validation is evidence, not a guarantee under shift. Do not move the boundary after inspecting failures."
    ],
    "transfer": "Choose stopping on permitted development data without touching final test. Trace actual quantities and allowed row IDs; reject training-score,universal-winner or test-feedback shortcuts."
  },
  {
    "slug": "gb05",
    "title": "Workflow and leakage",
    "lab": 1,
    "why": "Boosting has many steps outside the trees: centring numbers, filling blanks, choosing columns. Any of them can quietly learn from the test rows.",
    "intuition": "Fit every learned step on the training rows only, and refit it inside each fold. A centre computed with the validation rows included has already seen them, even if their labels were never touched.",
    "worked": "With training values[0,2] and validation[100],training mean1 differs from global mean34. A global learned transform can leak distribution information without using validation labels. In two CV folds, fit a new transform on each fold's training IDs; never reuse the outer fitted transform inside validation folds.",
    "changed": "A transformation fitted only on the outer training set is still leaked if reused inside CV:each inner validation row influenced it. Put learned steps inside the estimator evaluated on each fold. Simple trees do not require scaling, but any fitted scaling still obeys these boundaries.",
    "math": "Fit permissions are sets of row IDs, not just method names. Training initialization,gradient targets and tree fitting use training IDs. Validation compares trained stages. In CV,learn every preparation step separately on fold-training IDs,then transform/predict fold-validation. Freeze selected settings before untouched test evaluation.",
    "python": "from sklearn.pipeline import make_pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.ensemble import GradientBoostingRegressor\nfrom sklearn.model_selection import cross_val_score\nworkflow = make_pipeline(SimpleImputer(), GradientBoostingRegressor(random_state=1729, n_iter_no_change=None))\nscores = cross_val_score(workflow, X_development, y_development, cv=3, scoring='neg_mean_squared_error')",
    "comparison": "Recall Data Preparation's fold-only pipelines,pandas row alignment and unseen evaluation. Pipeline syntax can prevent accidental global fitting only when the evaluation actually refits that pipeline per fold.",
    "objectives": [
      "Reconstruct preprocessing/fit order",
      "Reject cross-fold/global preparation or test-based stopping and explain leakage",
      "Repair bounded regression/classification pipelines",
      "Select task-appropriate loss/metric"
    ],
    "notes": [
      "Training-only fitting and separately fold-only fitting are distinct. Every learned preparation step uses only that fold's training rows; stage targets exclude validation/test. Simple trees need no mandatory scaling, but learned preparation when used still obeys boundaries.",
      "Training-only fitting and separately fold-only fitting are distinct. Every learned preparation step uses only that fold's training rows; stage targets exclude validation/test. Simple trees need no mandatory scaling, but learned preparation when used still obeys boundaries.",
      "Training-only fitting and separately fold-only fitting are distinct. Every learned preparation step uses only that fold's training rows; stage targets exclude validation/test. Simple trees need no mandatory scaling, but learned preparation when used still obeys boundaries.",
      "Regression predicts quantities; binary boosting updates class scores and probabilities. Loss,decision metric and target meaning differ. Compare matching rows;an accuracy improvement need not improve log-loss or calibration."
    ],
    "transfer": "Reject cross-fold/global preparation or test-based stopping and explain leakage. Trace actual quantities and allowed row IDs; reject training-score,universal-winner or test-feedback shortcuts."
  },
  {
    "slug": "gb06",
    "title": "Compare and diagnose",
    "lab": 0,
    "why": "After building both, the natural question is which to use. One comparison on a handful of houses can easily mislead.",
    "intuition": "Score both on the same unseen rows with the same measure. Then change the settings: a forest or a booster can win depending on how many trees and how big a step. Treat a win as a fact about that data, not a ranking of the methods.",
    "worked": "On the same held-out prices,forest predictions[4,6] and booster[5,7] against actual[5,8] yield MAEs1.5 and.5. This observed win is not universal. In fixed noisy churn, stage4 and8 can both have accuracy1 while their log-loss differs,so inspect probability quality too.",
    "changed": "A high-cardinality or correlated feature may gain importance without a causal effect. A tiny subgroup or new distribution can invalidate a broad reliability claim despite a strong aggregate score. More stages also cost fitting time and inference work.",
    "math": "MAE=mean|y−prediction|;classification confusion depends on the declared positive class and threshold, while log-loss uses probabilities. Importance summarizes fitted split reductions and depends on correlations and split opportunities. Compare like-for-like held-out rows and report sample sizes, calibration,shift,latency and uncertainty.",
    "python": "from sklearn.metrics import mean_absolute_error, log_loss\nforest_mae = mean_absolute_error(y_validation,forest_prediction)\nboost_mae = mean_absolute_error(y_validation,boost_prediction)\nprobability_loss = log_loss(churn_validation,churn_probability,labels=[0,1])",
    "comparison": "Connect model comparison to all three planned projects:house-price residuals,churn cost/probabilities,documentation label/provenance quality. No capstones,production data collection or later algorithms are implemented here.",
    "objectives": [
      "Compare forest/boosting residual and confusion evidence",
      "Reject causal/guaranteed-best claims and identify sensitive/noisy targets",
      "Explain feature importance limitations",
      "Report fit cost, calibration and shift caveats"
    ],
    "notes": [
      "Compare identical rows, targets and metrics. Forest averages resampled learners; boosting sequentially corrects loss. A matched observed score difference is not a universal algorithm ranking or proof of future accuracy.",
      "Loss correction can chase noise; importance is not intervention; calibration and shift need evidence. Neither an importance plot nor a small synthetic validation win establishes causality, universal superiority or all-subgroup reliability.",
      "Importance depends on fitted structure, metric,data and correlated alternatives. Compare held-out/permutation evidence with limits; neither establishes causal effects or deployment-wide reliability.",
      "Sequential fitting has cost; more stages increase inference work. Probability ranking is not calibration; shift and small subgroups require relevant evidence. Introductory comparisons do not certify production readiness."
    ],
    "transfer": "Reject causal/guaranteed-best claims and identify sensitive/noisy targets. Trace actual quantities and allowed row IDs; reject training-score,universal-winner or test-feedback shortcuts."
  }
] as const;
