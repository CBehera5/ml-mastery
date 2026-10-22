export const LESSONS = [
  {
    "slug": "sv01",
    "title": "Margin geometry",
    "lab": 0,
    "why": "A churn team wants a rule that separates customer profiles without treating every small training perturbation as a new rule. Start with a line and the room around it,before discussing optimization. In more than two feature dimensions,the same idea is a separating hyperplane.",
    "intuition": "Draw two customer groups,then a line with a strip of space around it. Measure distance perpendicular to the line,not along an arbitrary coordinate axis. Ring solver-active support points,but do not assume every nearby point has a nonzero dual coefficient.",
    "worked": "For w=(1,0),b=0,x=(2,3),F=w·x+b=2 and perpendicular distance F/||w||=2. If w becomes(2,0),F becomes4 but the distance remains2. At x=(.5,-.5),F=.5 and positive-label hinge is.5. A score2 cannot be probability2.",
    "changed": "A manual w=(0,0) has no normal direction:geometric distance is undefined,not zero. For w=(1,1),point(.5,-.5) lies exactly on the illustrative boundary. The pinned fitted SVC maps score>=0 to class1;the manual scene says on-boundary,not an invented fitted class.",
    "math": "F(x)=w·x+b,where w is the normal vector,b the intercept and x the feature vector. Boundary F=0;signed distance F/||w||;unsigned distance |F|/||w||. For sign-encoded y in{−1,+1},functional margin=yF and geometric class margin=yF/||w||. Canonical F=±1 slab width=2/||w||,not the nearest observed point's distance. Manual lines are not fitted optima.",
    "python": "from sklearn.svm import SVC\nmodel = SVC(kernel='linear', C=1., probability=False, shrinking=False, tol=1e-6, max_iter=200000, random_state=1729)\nmodel.fit(X_train,y_train)\nscore = model.decision_function(X_validation)\nclasses = model.predict(X_validation)\nsupport_ids = train_ids[model.support_]",
    "comparison": "Recall vectors/dot products and Logistic decision scores. A line in two dimensions becomes a hyperplane in more dimensions. Probability calibration is not supplied by SVC(probability=False). A manual boundary move demonstrates geometry,not refitting.",
    "objectives": [
      "Compute a linear decision score and distance",
      "Distinguish sign decision,margin and probability",
      "Identify support-vector influence in a frozen scene",
      "Explain feature-scale dependence"
    ],
    "notes": [
      "Score=2;normal norm=1,so signed distance=2.0. Rescaling w,b changes raw scores but not normalized point-to-boundary distance.",
      "Separate decision sign,normal-normalized distance and calibrated risk. In the frozen binary SVC,score>=0 selects class1,including signed zero;manual exact-boundary geometry is labeled on-boundary. A score is not P(churn).",
      "Support IDs are exported from the pinned fit and checked against dual coefficients. Degeneracy can leave on-margin rows inactive;soft-margin supports may be inside the margin or misclassified. Geometry alone does not identify the solver list.",
      "Changing one feature's scale changes the geometry and regularization trade-off. Training-fitted scaling makes assumptions explicit;global scaling still leaks distribution information,including inside CV."
    ],
    "transfer": "Distinguish sign decision,margin and probability. Name the actual geometry/output type and training/validation permissions;do not infer calibrated or universal reliability."
  },
  {
    "slug": "sv02",
    "title": "Soft margins and C",
    "lab": 0,
    "why": "Real customer groups overlap and some observations are noisy. Requiring every point to lie perfectly on the correct side can let one awkward observation dominate. Soft margins allow violations while charging an explicit cost;C sets that compromise,not a probability threshold.",
    "intuition": "Imagine a wider corridor that may contain a few difficult observations versus a narrower corridor trying harder to avoid violations. Turn C only through the reviewed choices and inspect what actually changes. The diagram is evidence about this fit,not a universal monotonic law.",
    "worked": "With y=+1,F=.5,hinge=max(0,1−yF)=.5:the class is correct but inside the canonical margin. At F=−.5,hinge1.5 and class is wrong. In frozen clean SV-E1,C.1 has canonical slab width4 with6 supports;C1 has width2 with2 solver-active supports.",
    "changed": "Add the frozen awkward training point at(2.5,0) with class0. C can alter violations,support membership and validation outcomes. Hard-margin constraints presume separability;finite large C is not a general hard-margin solver. Logistic log-loss differs from hinge:it stays positive at finite correctly signed scores.",
    "math": "Soft-margin objective=.5||w||²+C*sum_i hinge_i,hinge_i=max(0,1−y_iF_i),with slack xi_i>=0 and y_iF_i>=1−xi_i. Larger C charges violations more relative to the norm term;it is not stronger norm regularization. Supports have nonzero dual coefficients;soft-margin supports may be inside the margin or misclassified. Degenerate on-margin rows can have zero coefficient.",
    "python": "import numpy as np\nscore = linear_model.decision_function(X_train)\nsigned_target = 2*y_train-1\nhinge = np.maximum(0,1-signed_target*score)\nprint(hinge)",
    "comparison": "Compare Logistic smooth log-loss,KNN distance sensitivity and the fixed SVM C trade-off. More exact training fit can hurt robustness. These examples use the named C-SVC objective,not a hidden mean-loss convention or a new hard-margin algorithm.",
    "objectives": [
      "Read hinge-loss/slack examples",
      "Explain C's trade-off without equating larger C with more regularization",
      "Predict sensitivity to an outlier",
      "Compare Logistic and linear SVM loss"
    ],
    "notes": [
      "The functional margin is0.5;hinge=0.5. A correctly classified point can still violate the canonical margin when0<yF<1. Negative yF means misclassification;hinge and error count differ.",
      "C multiplies violation cost;the coefficient on the norm is unchanged. Higher C may fit violations more closely and increase sensitivity to noise. Hard-margin separability is contextual,not a claim that any finite large C solves every noisy problem.",
      "Soft margins permit violations to avoid letting a difficult observation dictate the entire separator. Higher C raises violation cost but neither guarantees less noise sensitivity nor monotonically better validation.",
      "Hinge=max(0,1−yF) has a flat zero region;Logistic log-loss is smooth and positive at finite correct scores. Classification agreement does not make mechanisms,probability quality or calibration identical."
    ],
    "transfer": "Explain C's trade-off without equating larger C with more regularization. Name the actual geometry/output type and training/validation permissions;do not infer calibrated or universal reliability."
  },
  {
    "slug": "sv03",
    "title": "RBF locality",
    "lab": 1,
    "why": "A single straight separator can miss a local nonlinear customer pattern. An RBF kernel measures pairwise similarity so a model can combine local influences. Nonlinearity changes representational flexibility,not the need for honest evaluation.",
    "intuition": "Think of each support observation as contributing a local similarity response. Gamma controls how quickly similarity falls with distance. The sampled prediction regions can bend even though no new observed column has been added to the input dataset.",
    "worked": "At fitted-space distance1,gamma1 gives exp(−1)≈.367879;gamma4 gives exp(−4)≈.018316. On the same clean nonlinear fixture,C1/gamma1 raw-coordinate RBF has validation balanced accuracy.5;training-standardized RBF has1.0. The same-data standardized linear baseline gives.5.",
    "changed": "Multiplying the second raw feature by100 can make unscaled RBF similarities underflow numerically to0. The theoretical exponential is still positive;the log similarity records the scale. Higher gamma is more local but can chase small regions or noise;perfect training labels do not prove generalization.",
    "math": "K(x,z)=exp(−gamma*||x−z||²) uses declared fitted-space coordinates. Positive gamma sets locality. The decision function combines support similarities with signed coefficients and an intercept;it is neither a raw input-space line distance nor a probability. Kernel similarity is computed,not a new measured feature column. No RKHS proof is required to compare exact query outputs.",
    "python": "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nmodel = make_pipeline(StandardScaler(), SVC(kernel='rbf', C=1., gamma=1., probability=False, shrinking=False, tol=1e-6, max_iter=200000))\nmodel.fit(X_train,y_train)\nscore = model.decision_function(X_validation)",
    "comparison": "Compare linear and RBF on the same available features and validation rows. The diagram uses25 reviewed query samples,not an exact continuous contour or an unapproved21×21 mesh. Neither nonlinear flexibility nor scaling guarantees every model wins on future data.",
    "objectives": [
      "Calculate an RBF similarity",
      "Explain gamma's locality and distinguish kernel similarity from a new input column",
      "Compare linear/RBF boundaries",
      "Identify overfit small regions"
    ],
    "notes": [
      "Square distance,apply gamma,then exponentiate the negative value:similarity=0.36787944117144233. Identical points have similarity1;farther points can contribute much less.",
      "For fixed d>0,exp(−gamma*d²) falls as gamma rises. Local influence can form smaller regions and overfit;it does not add a newly measured input column or guarantee a better model.",
      "Same-row,task and metric comparisons are meaningful. A linear hyperplane can miss local nonlinear structure;this tiny synthetic win is not proof of calibrated risk,universal superiority or future reliability.",
      "High locality and sufficient C can chase small patterns or noise. Inspect training/development differences and uncertainty;gamma alone does not order all boundary complexity or validation outcomes monotonically."
    ],
    "transfer": "Explain gamma's locality and distinguish kernel similarity from a new input column. Name the actual geometry/output type and training/validation permissions;do not infer calibrated or universal reliability."
  },
  {
    "slug": "sv04",
    "title": "Safe scaled workflow",
    "lab": 1,
    "why": "Changing a feature from index units to hundredths changes the geometry seen by SVM. A good-looking score is meaningless if scaling or parameter selection used held-out information. Trace which rows fit every learned step before accepting a model comparison.",
    "intuition": "Keep training,validation and sealed-test boxes visible. Move a scaler and estimator together inside each CV training box. A scaler learned once on the outer training set still saw inner validation rows;training-only once and fold-only every time are different permissions.",
    "worked": "Training feature values[0,2] have mean1. Including a validation value100 gives mean34:even without its label,global scaling used held-out information. With C=.5 and explicit positive-class weight3,the positive hinge penalty uses C_positive=1.5,not probability1.5.",
    "changed": "A globally fitted scaler is still invalid inside CV even if it used only the outer training set. Refit preprocessing and SVC on every fold's training IDs. Balanced class weights use current training-fold counts,never test/validation frequencies. Choose C/gamma using permitted development evidence,then freeze before final test.",
    "math": "StandardScaler uses means and population variances learned on current training IDs;constant columns have scale1. Weighted SVC uses C_i=C*class_weight[y_i]. Balanced weights n_train/(number_of_classes*n_class) use current training counts. Fit whole preprocessing/model pipelines within each CV fold;use development metrics for C/gamma,never final-test feedback.",
    "python": "from sklearn.model_selection import GridSearchCV, StratifiedKFold\nfolds = StratifiedKFold(n_splits=3, shuffle=True, random_state=1729)\nsearch = GridSearchCV(model, {'svc__C':[.1,1.,10.], 'svc__gamma':[.1,1.,4.]}, cv=folds, scoring='balanced_accuracy')\nsearch.fit(X_development,y_development)\nchosen_pipeline = search.best_estimator_",
    "comparison": "Recall Python Data Preparation fold-only pipelines,NumPy shapes and pandas alignment. The app replays frozen full train/validation fits;the notebook separately demonstrates fold-only refits. A notebook run is not mastery and a pipeline name alone is not proof of valid evaluation.",
    "objectives": [
      "Trace scaler/SVC fitted rows",
      "Reject test-tuned C/gamma or globally scaled folds and explain why",
      "Repair predefined pipeline/grid slots",
      "Handle imbalance with explicit class-weight policy"
    ],
    "notes": [
      "Both learned scaling and SVC fitting use the current training partition. In CV,this means a fresh scaler/model inside each fold,not one outer-training scaler reused across inner folds.",
      "Scaling uses distribution information and selection uses labels/metrics. Training-only once is not separately fold-only fitting. Test-guided C/gamma selection consumes the final evaluation;pipeline names do not repair invalid fit permissions.",
      "Fit the whole scaler/SVC pipeline on each fold-training set;use permitted validation/CV for selection,then freeze before final test. Equivalent authored scope names mean the same thing;test/global-fit fragments are not valid repairs.",
      "Class weighting multiplies the per-class hinge penalty,not class probabilities. Balanced weights must derive from current training-fold class counts;choose policies with permitted development evidence and appropriate error costs."
    ],
    "transfer": "Reject test-tuned C/gamma or globally scaled folds and explain why. Name the actual geometry/output type and training/validation permissions;do not infer calibrated or universal reliability."
  },
  {
    "slug": "sv05",
    "title": "Limits and comparison",
    "lab": 0,
    "why": "A margin rule is useful only for the question,population and resource budget it was evaluated on. SVM is neither a calibrated-risk oracle nor a universally best classifier. Compare error types,costs and inference work on the same unseen observations.",
    "intuition": "Place models on the same held-out row list and compare their mistakes,not differently scaled score rulers. Add a resource ruler:an RBF query needs similarities to supports;large training/kernel workloads can be expensive. High margin ranking is not calibrated risk or guaranteed behavior under shift.",
    "worked": "For the same six balanced validation rows,three correct of six means accuracy.5;but with imbalance,balanced accuracy averages per-class recalls instead. In the frozen clean nonlinear data,linear.5 versus RBF1.0 is a local comparison,not a universal win. A score of2 or sigmoid(2) is not automatic calibrated risk.",
    "changed": "An unfamiliar customer subgroup or a shifted documentation population may invalidate a broad reliability claim. Calibration needs separate evidence;support count and kernel work affect cost. A large margin cannot substitute for subgroup counts,appropriate metrics or shift checks.",
    "math": "For positive class1,balanced accuracy=(recall0+recall1)/2. Scores,labels,probability calibration and error costs are distinct. RBF inference sums kernels to supports;large kernel optimization/storage can be costly. Compare matching rows,targets and metrics and disclose finite data,numerical near-boundary sensitivity,resources and shift limits.",
    "python": "from sklearn.metrics import balanced_accuracy_score, confusion_matrix\nclasses = model.predict(X_validation)\nscore = balanced_accuracy_score(y_validation,classes)\nerrors = confusion_matrix(y_validation,classes,labels=[0,1])\nprint(score,errors)",
    "comparison": "Connect churn classification and future Good/Needs Improvement Documentation Quality labels to evaluation assumptions. House prices are regression:SVR is not implemented here. Compare Logistic,KNN and trees contextually;no new algorithms,production data or capstones are added.",
    "objectives": [
      "Compare classification errors and query costs",
      "Reject uncalibrated scores as probabilities or extrapolated reliability",
      "Explain kernel scaling/resource limits",
      "Compare KNN/Logistic/tree choices for a stated problem"
    ],
    "notes": [
      "Use matching rows,targets and task metrics,plus inference/fit costs. RBF inference depends on support count and kernel work;linear weights can be consolidated. Mechanism and cost do not prove a universal winner.",
      "A margin score ranks a fitted decision function,not calibrated P(class). Sigmoid alone is not fitted calibration. Shift,subgroups and finite validation samples limit reliability;no automatic confidence guarantee is justified.",
      "Kernel storage/optimization can become expensive as data grow,and support count affects query work. RBF decision scores are not distances to a raw input-space straight line;scaling and population assumptions remain relevant.",
      "Compare assumptions and measured trade-offs:Logistic coefficient structure,KNN distances/tree partitions and SVM margins/kernels. Housing regression is a task-suitability contrast here,not authorization for an SVR or capstone implementation."
    ],
    "transfer": "Reject uncalibrated scores as probabilities or extrapolated reliability. Name the actual geometry/output type and training/validation permissions;do not infer calibrated or universal reliability."
  }
] as const;
