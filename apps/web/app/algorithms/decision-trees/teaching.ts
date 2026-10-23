export const LESSONS = [
  {
    "slug": "dt01",
    "title": "Partition feature space",
    "lab": 0,
    "why": "House prices change differently in different neighbourhoods and size ranges. One straight line cannot follow that. A tree asks a few yes-or-no questions and sends each house to a group with its own prediction.",
    "intuition": "Picture a map cut by straight lines. Each question only splits the region that reached it. Follow a house down the branches like a flowchart until it lands in a group, and that group's average is the prediction. Training chooses the questions. Prediction only follows them.",
    "worked": "Saved illustrative house rule: area<=2 predicts3; otherwise area<=5 predicts7; otherwise9, in 100000 currency units. Query area4 goes right then left and predicts7. Query area2 goes left and predicts3. This supplied example is not claimed to be the optimal fitted tree.",
    "changed": "Change the query to area6: the saved tree predicts9 without learning anything new. Separately changing a training sale price and refitting can change the tree. These are different operations. Trace both cases before using the regression experiment.",
    "math": "A node compares x_j<=t: x_j is feature j of one row, t is a stored threshold. Left includes equality; right means x_j>t. A path is an AND of conditions, not their average. In two dimensions these cuts are axis-aligned. Fixed sklearn inputs use float32; display rounding never decides membership.",
    "python": "from sklearn.tree import DecisionTreeRegressor\nmodel = DecisionTreeRegressor(criterion='squared_error', max_depth=2, min_samples_leaf=1, random_state=1729)\nmodel.fit(X_train, y_train)\nprices = model.predict(X_dev)\npaths = model.decision_path(X_dev)",
    "comparison": "Recall Python row alignment and linear-model features. A linear predictor combines weighted features everywhere; a tree routes to local constants. Neither approach establishes causality. See EV prediction-time availability before using a customer outcome as an input.",
    "objectives": [
      "Follow a saved path",
      "Separate fitting from routing",
      "Describe axis-aligned regions",
      "Route equality correctly"
    ],
    "notes": [
      "Write each comparison and reached leaf before reading a price; do not stop after the first right branch.",
      "An unseen query has features, not its future label. Calling predict does not refit the thresholds.",
      "Two path conditions cut an intersection, not a diagonal regression line; a leaf is piecewise constant.",
      "For an exactly representable threshold2, x=2 goes left. Near-boundary float32 probes in the manifest document actual machine routing."
    ],
    "transfer": "Route changed query features through saved thresholds without its outcome; only permitted training data can learn or refit splits."
  },
  {
    "slug": "dt02",
    "title": "Regression leaves",
    "lab": 0,
    "why": "A cut is only good if it makes the groups more alike. For prices, we need a way to score how far the houses in a group sit from their own average.",
    "intuition": "Squared gaps from the group average add up to an error. The tree tries every cut, adds the errors of the two sides, and keeps the cut that leaves the least. Each side then predicts its own average, never the cut point.",
    "worked": "Leaf targets[2,4] have mean3, residuals[-1,1], SSE2 and MSE1. Parent[1,1,5,5] has mean3 and SSE16. A split into[1,1] and[5,5] has combined SSE0, so reduction16 and local MSE gain16/4=4. Predicting the right leaf returns5, not threshold1.5.",
    "changed": "For targets[1,3,5,7], parent SSE20; child pairs[1,3] and[5,7] each have SSE2. Combined child SSE4 gives reduction16, local MSE gain4. Weight child MSE by membership, but never weight a summed SSE a second time. An extreme area query still returns its reached leaf mean.",
    "math": "For leaf L with n targets y_i, mean m=sum(y_i)/n and SSE_L=sum((y_i-m)^2); node impurity I_L=SSE_L/n. Local gain=I_parent-(n_left/n_parent)I_left-(n_right/n_parent)I_right. The fitted min_impurity_decrease also weights by n_parent/n_total. Units: mean is currency, MSE is squared currency.",
    "python": "from sklearn.tree import DecisionTreeRegressor\nfrom sklearn.metrics import mean_absolute_error, mean_squared_error\nmodel = DecisionTreeRegressor(criterion='squared_error', max_depth=2, random_state=1729)\nmodel.fit(X_train, y_train)\nprediction = model.predict(X_dev)\nmae = mean_absolute_error(y_dev, prediction)\nmse = mean_squared_error(y_dev, prediction)",
    "comparison": "Compare leaf means with existing Linear Regression and Polynomial Regression on the same held-out houses. Trees can capture abrupt feature interactions but do not extrapolate a coefficient slope. Inspect large residuals and target units, not Gini or classification accuracy.",
    "objectives": [
      "Calculate leaf mean and SSE",
      "Select a split and explain mean prediction",
      "Compare parent/child residuals",
      "Explain range and extrapolation limits"
    ],
    "notes": [
      "Mean minimizes squared residuals within a fixed leaf. SSE sums, MSE averages; their numeric values differ.",
      "Choose a valid split by reduction with both child memberships, then predict the reached numeric mean. Label voting is not regression.",
      "Child residuals must use each child's own mean, not the parent mean; compare the combined errors.",
      "A regression tree returns one of its trained leaf means; it cannot continue a linear slope to unseen areas."
    ],
    "transfer": "Use correctly normalized squared-error gain for splits and numeric means for regression leaves; evaluate unseen residuals separately."
  },
  {
    "slug": "dt03",
    "title": "Classification leaves",
    "lab": 1,
    "why": "For churn there is no price to average. A good cut should leave one side mostly people who stay and the other mostly people who leave.",
    "intuition": "Gini is a number for how mixed a group is: 0 when everyone is the same, 0.5 when it is an even split. A cut is scored by how much mixing it removes, weighting each side by how many customers it holds. A leaf then reports the share of each outcome.",
    "worked": "Parent counts[2,2] give p=[.5,.5] and Gini1-(.25+.25)=.5. Children[2,0] and[0,2] have Gini0; weighted child Gini0 and gain.5. A leaf[1,3] outputs probabilities[.25,.75] in order0=stays,1=churns and predicts1.",
    "changed": "Children[3,0] and[1,2] of size3 each have Gini0 and4/9; weighted child impurity2/9. Parent[4,2] has Gini4/9, so gain2/9. With unequal sizes, use actual size weights. Leaf[1,1] ties and predicts the first sorted class 0. A one-class fitted dataset has only that class in its probability columns.",
    "math": "For class c, p_c=count_c/n and Gini G=1-sum_c(p_c^2). Gain subtracts size-weighted child Gini from parent Gini. Leaf fractions are model probabilities, not guaranteed calibration. Context only: entropy H=-sum p_c log2(p_c), with0 log2(0)=0. Balanced binary H=1 bit versus G=.5; pure nodes give0 for both. Different scales are not interchangeable scores.",
    "python": "from sklearn.tree import DecisionTreeClassifier\nmodel = DecisionTreeClassifier(criterion='gini', max_depth=2, min_samples_leaf=1, random_state=1729)\nmodel.fit(X_train, y_train)\nclasses = model.classes_\nprobabilities = model.predict_proba(X_dev)\nlabels = model.predict(X_dev)",
    "comparison": "Recall Logistic probability versus class decisions and EV imbalance/cost metrics. A tree gives local class frequencies; Logistic gives sigmoid probabilities. Neither a pure leaf nor high accuracy certifies calibration or causality. Entropy is a contextual comparison only, never a fitted option here.",
    "objectives": [
      "Calculate proportions and Gini",
      "Choose weighted split and explain class output",
      "Compare balanced/imbalanced leaves",
      "Separate impurity from held-out success"
    ],
    "notes": [
      "Use class proportions, not raw counts squared. Binary Gini ranges from 0 to.5.",
      "Size weighting and categorical output are both mandatory: a numeric class-code mean is not the classification leaf decision.",
      "[9,1] has Gini.18, lower than[5,5] at.5; always predicting the majority can still miss every rare positive.",
      "Training purity can increase while unseen error worsens. Read confusion counts, subgroup errors and probability evidence."
    ],
    "transfer": "Use weighted Gini and class fractions for classification; disclose imbalance, held-out error and calibration limitations."
  },
  {
    "slug": "dt04",
    "title": "Depth and stability",
    "lab": 0,
    "why": "Left alone, a tree keeps cutting until every house has its own leaf. That fits the training houses perfectly and tells you almost nothing about the next ones.",
    "intuition": "Depth and the smallest allowed leaf are dials between too simple and too eager. Training error can only fall as the tree grows. The error on houses it has never seen is the one to trust, and it often turns upward.",
    "worked": "In fixed DT-E1 base data, depth1 gives train MSE3 and development MSE3. Depth2 reduces train MSE to.375 but raises development MSE to5.0625. Training improvement did not imply generalization improvement. Both models use the same training and development row IDs.",
    "changed": "Switch to the changed-row example data, where the last house target changes12 to 8. Compare structures and errors instead of assuming every prediction changes. Then inspect min-leaf2 and the training-derived pruning-alpha states; a simpler tree can help or hurt development error.",
    "math": "Depth counts edges from root to leaf. min_samples_leaf constrains each child. Cost-complexity objective R_alpha(T)=R(T)+alpha*number_of_leaves, where R is total sample-weighted leaf impurity, not an unnormalized SSE. Larger alpha penalizes complexity. Derive candidate paths within training or each CV training fold.",
    "python": "from sklearn.tree import DecisionTreeRegressor\nbase = DecisionTreeRegressor(criterion='squared_error', random_state=1729)\npath = base.cost_complexity_pruning_path(X_train, y_train)\nmodels = [DecisionTreeRegressor(criterion='squared_error', ccp_alpha=float(alpha), random_state=1729).fit(X_train, y_train) for alpha in path.ccp_alphas]\n# Complete fold-local selection is in the trusted notebook",
    "comparison": "Recall Polynomial degree and regularization bias-variance trade-offs. A pruned tree is not automatically best: compare unseen development evidence, costs and stability. Forests are a future conceptual contrast, not fitted in this module.",
    "objectives": [
      "Compare train/development errors",
      "Reject training-only depth selection",
      "Explain changed-row sensitivity",
      "Read pruning/min-leaf trade-offs"
    ],
    "notes": [
      "Keep datasets and metrics matched while changing complexity; otherwise differences are not attributable to the candidate.",
      "Training error alone cannot choose generalization complexity. Use development or fold-local CV and freeze before final test.",
      "Changed training rows may alter threshold rankings and leaf means, but not every change affects every query.",
      "Pruning may remove useful detail too. Alpha scales with the risk convention; a path from held-out targets is leaked."
    ],
    "transfer": "Choose complexity on permitted unseen development or fold-local CV evidence, not minimum training error or repeated test feedback."
  },
  {
    "slug": "dt05",
    "title": "Fit safely",
    "lab": 1,
    "why": "A tree will happily fit scrambled rows and never complain. The mistakes that hurt most are quiet ones: a label sitting next to the wrong customer, or a column that only exists after the customer has left.",
    "intuition": "Match every label to its customer by id before fitting. Fit any filling-in of blanks, and any pruning choice, on training data only. Judge the result on customers the tree has not seen, against a simple baseline.",
    "worked": "Training IDs[A,B] have features[[1,0],[2,1]] and targets[0,1]. If a table sorts features to[B,A] but leaves targets[0,1], the labels now attach to the wrong customers. Rejoin by ID to targets[1,0] before fitting. A prediction cannot use a future cancellation outcome.",
    "changed": "Fitting an imputer globally before CV leaks even if the tree itself does not need scaling. Deriving a pruning path using validation labels also learns from held-out outcomes. Move both operations into each training fold; compare candidates on the held-out fold only.",
    "math": "Fit maps permitted (X_train,y_train) to saved parameters theta; predict maps (theta,X_new) to predictions. Evaluation compares predictions and targets with identical row IDs. Classification uses Gini to fit; regression uses squared_error. Their held-out metrics must match target meaning, not their numeric dtype.",
    "python": "from sklearn.pipeline import make_pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.model_selection import GridSearchCV\npipeline = make_pipeline(SimpleImputer(), DecisionTreeClassifier(criterion='gini', random_state=1729))\nsearch = GridSearchCV(pipeline, {'decisiontreeclassifier__max_depth':[1,2,3]}, cv=3)\nsearch.fit(X_train, y_train)\nlabels = search.predict(X_test)",
    "comparison": "Connect pandas joins/index alignment, Data Preparation pipelines and EV unseen-data evaluation. Simple trees often do not require feature scaling, but that does not permit leaked features, globally fitted imputers or target misalignment. Compare matching task metrics and costs.",
    "objectives": [
      "Read fixed settings",
      "Reject leakage and invalid provenance",
      "Repair the workflow",
      "Compare task-specific metrics"
    ],
    "notes": [
      "Record criterion,depth,min-leaf,seed,feature order and library version. Do not silently rely on defaults.",
      "Identify the actual boundary violation, not only the word leakage. Repair availability, row identity or training/fold provenance.",
      "Split aligned rows before fitting learned transformations. Select using development/CV and evaluate once after freezing.",
      "House MAE is in currency; MSE is squared currency. Churn confusion counts and recall address class decisions and costs."
    ],
    "transfer": "Preserve feature availability and aligned IDs; learn preprocessing, splits and pruning within each training boundary before held-out prediction."
  },
  {
    "slug": "dt06",
    "title": "Explain rules and limits",
    "lab": 1,
    "why": "A path through a tree reads like a rule, and rules sound like explanations. It is easy to hear more in them than they say.",
    "intuition": "A rule describes which training houses it matched, and how many. It does not say that changing a house would change its price, and it may match almost nothing in a different town. Importance is a share of error removed, not a cause.",
    "worked": "Rule area<=2 AND age>10 covers3 of20 training houses, coverage15%. It explains which fitted leaf those houses reach, not what changing area would cause. Importance.8 for area means a large share of retained training impurity reductions, not an80% causal effect.",
    "changed": "If new houses fall outside that region, the rule's3/20 training coverage says nothing about their future coverage. A correlated proxy may replace area in a refit. Audit matching subgroup errors and counts before claiming the rule transfers.",
    "math": "Training coverage=n_region/n_train. Impurity importance sums (n_node/n_total)*gain_node for splits on feature j and normalizes across retained splits; a no-split tree has zero importances. This is model- and sample-dependent. Local conditional prediction is not an intervention estimate.",
    "python": "paths = model.decision_path(X_dev)\nleaves = model.apply(X_dev)\nimportance = model.feature_importances_\n# Inspect subgroup errors on held-out rows with aligned IDs\n# Do not interpret impurity importance as a causal effect",
    "comparison": "Compare piecewise tree rules, linear coefficients and a conceptual forest using the same target, held-out IDs and decision costs. A future ensemble can reduce single-tree instability but is not universally superior. House prices, churn and documentation quality need different target definitions and error analysis.",
    "objectives": [
      "Translate a local rule",
      "Reject causal/global importance claims",
      "Compare mechanisms",
      "Disclose subgroup and range limits"
    ],
    "notes": [
      "Translate all path conditions with AND and state observed coverage; do not omit a branch condition.",
      "Reject causal claims and global guarantees; explain correlation, cardinality, sample dependence and coverage.",
      "Linear coefficient structure and piecewise trees differ; compare error evidence rather than an API or universal ranking.",
      "Report subgroup counts, uncertainty,shift,refit instability and the inability to extrapolate slopes beyond leaf regions."
    ],
    "transfer": "Explain the supported local fitted rule and training importance while rejecting causal or globally reliable claims without appropriate evidence."
  }
] as const;
