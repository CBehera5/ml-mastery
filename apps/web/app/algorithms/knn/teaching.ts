export const LESSONS = [
  {
    "slug": "kn01",
    "title": "Vote among neighbors",
    "lab": 0,
    "why": "A churn team wants to predict a new customer from similar past customers. KNN stores labeled training examples rather than learning a coefficient vector. The outcome must be defined before choosing features.",
    "intuition": "Place the query among labeled points. Measure closeness before looking at the query outcome, select k neighbors, then count their labels. A local majority can disagree with the single nearest observation.",
    "worked": "Distances 1,2,3 with labels 0,1,1: k1 predicts0, uniform k3 predicts1. For a query (1,1) and row (4,5), distance=sqrt(3²+4²)=5. Label codes are categories: averaging 0,1,1 to .667 is a vote share, not a numeric churn prediction.",
    "changed": "Two duplicate observations at distance0 have labels0 and1. With distance weighting and k3, only these zero-distance rows vote; their class totals tie1:1 and the frozen convention chooses class 0. A near-zero distance is not an exact duplicate. At an ambiguous kth-distance cutoff reject rather than invent a sklearn ordering guarantee.",
    "math": "For query q and training row x_i, d_i=sqrt(sum_j(x_ij−q_j)²), where j indexes features. Select k smallest distances. Uniform totals sum one per class; inverse-distance totals sum 1/d_i, with the explicit zero-only rule. argmax of class totals chooses the class; equal totals choose label0.",
    "python": "from sklearn.neighbors import KNeighborsClassifier\nmodel = KNeighborsClassifier(n_neighbors=3, weights='uniform',\n    algorithm='brute', metric='euclidean', n_jobs=1)\nmodel.fit(features_train, labels_train)\nlabels_new = model.predict(features_new)",
    "comparison": "Logistic fits a linear logit; KNN stores local examples. Neither makes observational labels causal. KNN regression would average numeric targets, but is comparison-only here. Documentation quality would use its separately defined Good/Needs Improvement labels, not churn meanings.",
    "objectives": [
      "Calculate distances and ordered neighbors",
      "Derive a vote with explicit tie rules and explain why labels are not averaged as regression",
      "Predict a label from k neighbors",
      "Distinguish stored training examples from prediction queries"
    ],
    "notes": [
      "Compute feature differences, squares, sum, square root; then order rows. A near-equal distance remains distinct; display rounding must not change membership.",
      "Both selected membership and voting mechanism matter. Duplicate rows are separate observations, not silently removed. A tied class vote differs from ambiguous kth membership.",
      "Count labels among selected neighbors, not all training rows. The nearest is not necessarily representative.",
      "fit stores permitted feature/label examples; predict uses query features with saved examples, not new labels."
    ],
    "transfer": "Select neighbors by feature distance, then apply the declared class-vote and tie rules without averaging label codes as numeric targets."
  },
  {
    "slug": "kn02",
    "title": "Scale defines closeness",
    "lab": 1,
    "why": "Currency differences can overwhelm support-contact differences even when contact patterns matter for churn. A distance is meaningful only relative to feature units and the prediction problem.",
    "intuition": "Scaling stretches coordinate axes. Neighbors can change without any customer changing. Learn those stretches from training data, then keep them fixed for new queries.",
    "worked": "In raw units, delta=(100 currency,1 contact) gives sqrt(10001)≈100.005. With training scales (100,1), the scaled differences are (1,1), distance=sqrt2≈1.414214. In the frozen fixture query[440,7.8], raw k1 chooses row2/class0; training-scaled k1 chooses row1/class1.",
    "changed": "Fitting a scaler on all rows before cross-validation leaks held-out feature information even without labels. Refit the whole scaler/classifier pipeline separately inside each fold. An irrelevant badge coordinate can displace a useful neighbor; standardizing does not make an irrelevant feature useful.",
    "math": "z_j=(x_j−mu_j)/s_j, mu_j and population variance computed from training rows only. A zero-variance training feature uses scale1. Euclidean distance in z-space weights original coordinate differences by 1/s_j. More noisy coordinates can swamp informative local geometry, but no universal finite-data error increase is guaranteed.",
    "python": "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nmodel = make_pipeline(StandardScaler(), KNeighborsClassifier(\n    n_neighbors=3, algorithm='brute', metric='euclidean'))\nmodel.fit(features_train, labels_train)\nlabels_dev = model.predict(features_dev)",
    "comparison": "Logistic coefficients and KNN geometry both depend on representation, but their mechanisms differ. Scaling cannot fix target leakage, mislabeled rows or useless dimensions. Recall NumPy axes, pandas row alignment and training-only preparation rather than repeating those courses.",
    "objectives": [
      "Compute scaled two-feature distances",
      "Reject test-fitted scaling and explain metric sensitivity to units",
      "Compare raw/scaled neighbor sets",
      "Diagnose irrelevant high-dimensional features"
    ],
    "notes": [
      "Use the same training mean/scale for both points. Subtraction of the shared mean cancels in a distance; division by scale does not.",
      "A valid-looking score does not excuse test-fitted scaling. Separate fold-only fitting from fitting once on the outer training set.",
      "Read raw and transformed coordinates plus selected IDs, not just the plot. Scaling may change neighbors; it need not do so for every query.",
      "A constant coordinate, duplicated informative coordinate and irrelevant varying coordinate are different cases. Extra dimensions can change geometry and increase distance work; this tiny experiment illustrates, not proves, a high-dimensional theorem."
    ],
    "transfer": "Fit scaling only on permitted training rows, refit per CV fold and reason about feature units before selecting neighbors."
  },
  {
    "slug": "kn03",
    "title": "Choose k honestly",
    "lab": 0,
    "why": "A model that memorizes noisy customer labels can look excellent on training data and fail new customers. Choose neighborhood size by development/CV evidence, not by looking at the final test repeatedly.",
    "intuition": "Small neighborhoods can follow local noise. Larger ones smooth decisions but may wash out a minority pocket. Compare the same held-out rows and a named metric, not an appealing boundary alone.",
    "worked": "A query nearest a noisy positive with neighboring labels[1,0,0] predicts1 at k1 and0 at k3. If the unseen outcome is0, the larger neighborhood helps this query; another minority query can be harmed. A fold with four training rows cannot use k5, even if the outer training set has six.",
    "changed": "Uniform weights give one vote each. At distances[1,2,3], labels[0,1,1], uniform predicts1 but inverse-distance totals are class0=1 versus class1=1/2+1/3≈.833333, predicting0. Lower in-sample error at k1 may use self-neighbors; it is not unseen-data evidence.",
    "math": "k is the neighborhood count, constrained to an integer1..n_train for each actual fitting fold. Development error averages a declared loss over disjoint query rows. Bias/variance describes behavior across data samples, not a guarantee every finite error curve is monotone. Tune k/weights inside development or CV, freeze selection, then evaluate test once.",
    "python": "from sklearn.model_selection import StratifiedKFold, cross_val_score\nfolds = StratifiedKFold(3, shuffle=True, random_state=1729)\n# Each candidate must fit the smallest fold-training count.\nscores = cross_val_score(model, features_train, labels_train,\n    cv=folds, scoring='balanced_accuracy', n_jobs=1)",
    "comparison": "Compare against a DummyClassifier and Logistic on identical held-out IDs and metrics. A good majority accuracy can hide minority failure; a larger k is not automatically safer or fairer.",
    "objectives": [
      "Compare finite k train/development results",
      "Reject k exceeding fold-training count or selected using final test",
      "Explain bias/variance behavior without monotonic guarantees",
      "Compare uniform versus distance weighting"
    ],
    "notes": [
      "Compare development results on matching rows; training scores and unseen scores answer different questions.",
      "Do not silently clip illegal k or select using final-test feedback. The paired explanation must name both fold capacity and the untouched evaluation boundary.",
      "Small k can be noise-sensitive, large k can miss local patterns. Avoid claiming every larger k improves validation error.",
      "Weighting changes contributions after membership selection. With zero distances, use only zero-distance neighbors under the frozen rule."
    ],
    "transfer": "Use legal k in every fold, compare candidates with fold-local preprocessing and keep final-test feedback out of selection."
  },
  {
    "slug": "kn04",
    "title": "Workflow and limits",
    "lab": 1,
    "why": "A deployable prediction story needs honest error analysis and inference costs, not just a successful fit call. Local data quality and minority representation can matter more than an attractive average score.",
    "intuition": "Imagine comparing every incoming customer with stored rows. More rows or dimensions require more work in this brute-force illustration; irrelevant dimensions may redirect the neighborhood toward the wrong examples.",
    "worked": "Six rows with two features require six distances and 12 coordinate differences per brute-force query. Adding a third feature gives18 differences, not a guaranteed measured runtime ratio. Predicting0 for every row in a cohort with nine stays and one churn gives90% accuracy but zero positive recall.",
    "changed": "A pipeline can still leak if fit on all rows. Restore aligned feature/target identities and fit only training rows. A future cancellation flag is forbidden at the prediction moment. For a shifted population, yesterday’s held-out score is not a guaranteed future rate.",
    "math": "Accuracy=(TP+TN)/N, positive recall=TP/(TP+FN) when denominator is nonzero. Undefined metrics stay tagged rather than numeric0. Brute-force distance work scales with n*d in this teaching reference; library optimizations may differ. Report metric, classes, split IDs, sample size and limitations together.",
    "python": "from sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import balanced_accuracy_score\nbaseline = DummyClassifier(strategy='most_frequent').fit(features_train, labels_train)\npredicted = model.predict(features_test)\nprint(balanced_accuracy_score(labels_test, predicted))\n# Selection was frozen before these test labels were inspected.",
    "comparison": "KNN uses local distances, Logistic a linear logit, SVM a margin-based decision rule. These are mechanism contrasts, not new SVM implementation or universal rankings. Churn and human-reviewed documentation labels need prediction-time features; continuous house prices require a regression target and model.",
    "objectives": [
      "Repair a bounded sklearn KNN pipeline",
      "Identify imbalance/distance/query-cost failure and explain its mechanism",
      "Compare Logistic/SVM assumptions",
      "Summarize valid unseen-data performance"
    ],
    "notes": [
      "Align row IDs, scaler fit on train, classifier fit on the same train rows, then saved-state prediction on held-out rows. A pipeline object alone is not proof of safe provenance.",
      "Name the concrete failure and why: minority votes overwhelmed, irrelevant coordinates dominate or distance work grows. Generic slogans are insufficient.",
      "Compare local neighbor geometry with a linear logit or margin; do not claim one model is always best or that similarity proves causality.",
      "Use identical evaluation rows and disclose class prevalence, metric and selection boundary. A single tiny split does not certify future or subgroup reliability."
    ],
    "transfer": "Explain the actual distance, imbalance or inference-work mechanism and report genuinely held-out evidence without universal performance claims."
  }
] as const;
