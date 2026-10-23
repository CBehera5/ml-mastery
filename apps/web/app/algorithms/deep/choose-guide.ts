import type {DeepLesson} from "../../math/teaching/deep-read";
/** The /algorithms/choose-a-model guide: a method, a comparison table and a verified shared-data comparison. */
export const CHOOSE_GUIDE:DeepLesson={
 "title": "How to choose a model",
 "minutes": 16,
 "sections": [
  {
   "id": "ch-start",
   "kicker": "1 · Start here",
   "title": "Start here",
   "blocks": [
    {
     "kind": "p",
     "text": "There is no best model, only a best model for your table, your goal and your constraints. The reliable method is not to guess: it is a short sequence of questions, a cheap baseline, and a fair comparison. This page gives the sequence, then runs the comparison for you."
    },
    {
     "kind": "steps",
     "items": [
      "Name the target. A number means regression, a category means classification, and a ranking or probability means a classifier that outputs probabilities.",
      "Write down what a mistake costs and whether anyone needs the reason for each prediction. These two facts remove half the candidates.",
      "Always fit a baseline first: the average (regression) or the base rate (classification).",
      "Fit the simple, explainable model (linear or logistic regression) and keep its score as the bar to beat.",
      "Try one flexible model (a forest or gradient boosting) and one local model (kNN or an RBF SVM) on the same folds.",
      "Pick the simplest model whose score is within the fold-to-fold spread of the best. Test it once on held-out rows."
     ]
    },
    {
     "kind": "callout",
     "tone": "idea",
     "title": "The question this page answers",
     "text": "Given a new problem, which models do I try, in what order, and how do I know I am not fooling myself?"
    }
   ]
  },
  {
   "id": "ch-table",
   "kicker": "2 · The comparison table",
   "title": "The comparison table",
   "blocks": [
    {
     "kind": "table",
     "caption": "Every model in this course, side by side",
     "headers": [
      "Model",
      "Best at",
      "Weak at",
      "Needs scaling?",
      "Explainable?",
      "Playbook"
     ],
     "rows": [
      [
       "Linear regression",
       "Numbers with straight effects; a first baseline",
       "Curves, interactions",
       "Helps",
       "Yes, coefficients",
       "Linear Regression"
      ],
      [
       "Polynomial regression",
       "One feature with a smooth bend",
       "Many features; extrapolation",
       "Yes",
       "Fairly",
       "Polynomial"
      ],
      [
       "Ridge / Lasso / Elastic net",
       "Many or correlated features",
       "Curves",
       "Yes",
       "Yes",
       "Ridge, Lasso & Elastic Net"
      ],
      [
       "Logistic regression",
       "Yes/no with probabilities and odds ratios",
       "Curved boundaries",
       "Yes",
       "Yes",
       "Logistic"
      ],
      [
       "k-nearest neighbours",
       "Small data where similarity is clear",
       "Many irrelevant columns; big data",
       "Yes",
       "Neighbours only",
       "kNN"
      ],
      [
       "Naive Bayes",
       "Text and tiny data; a quick baseline",
       "Honest probabilities; correlated features",
       "No",
       "Yes",
       "Naive Bayes"
      ],
      [
       "Support vector machine",
       "Small data with a curved boundary",
       "Big data; probabilities",
       "Yes",
       "Little",
       "SVM"
      ],
      [
       "Decision tree",
       "Readable rules, thresholds",
       "Stability, smooth effects",
       "No",
       "Yes, if shallow",
       "Decision Trees"
      ],
      [
       "Random forest",
       "Strong default on tables",
       "Extrapolation; readability",
       "No",
       "Importances only",
       "Random Forests"
      ],
      [
       "Gradient boosting",
       "Highest accuracy on tables",
       "Needs tuning; readability",
       "No",
       "Importances only",
       "Gradient Boosting"
      ],
      [
       "Neural network (MLP)",
       "Smooth patterns; images, text and audio at scale",
       "Small tabular data; needs scaling",
       "Yes",
       "Little",
       "Multilayer Perceptrons"
      ]
     ]
    },
    {
     "kind": "p",
     "text": "Use the right-hand column to open the matching playbook: each has the from-scratch build, the scikit-learn pipeline, the tuning advice and the failure modes."
    }
   ]
  },
  {
   "id": "ch-flow",
   "kicker": "3 · A decision flow",
   "title": "A decision flow",
   "blocks": [
    {
     "kind": "table",
     "caption": "If this is true, start with that",
     "headers": [
      "Your situation",
      "Try first",
      "Then try"
     ],
     "rows": [
      [
       "Number target, need to explain it",
       "Linear regression",
       "Ridge or Lasso if many features"
      ],
      [
       "Number target, one feature with a bend",
       "Polynomial (degree 2 or 3)",
       "A forest or boosting"
      ],
      [
       "Yes/no target, need odds and probabilities",
       "Logistic regression",
       "Boosting"
      ],
      [
       "Yes/no target, text counts",
       "Naive Bayes",
       "Logistic on word counts"
      ],
      [
       "Small table, curved boundary",
       "RBF SVM",
       "Boosting"
      ],
      [
       "Large table with mixed types",
       "Gradient boosting",
       "A random forest as a cross-check"
      ],
      [
       "Must show rules to a non-technical reader",
       "A shallow decision tree",
       "Logistic regression"
      ],
      [
       "Images, audio, language",
       "A neural network",
       "Pre-trained models"
      ]
     ]
    },
    {
     "kind": "callout",
     "tone": "warn",
     "title": "Constraints beat accuracy",
     "text": "If a model cannot be explained, retrained quickly or run on your device, a 1-point gain is not worth it. Write the constraints down before comparing scores."
    }
   ]
  },
  {
   "id": "ch-run",
   "kicker": "4 · Run the comparison",
   "title": "Run the comparison",
   "blocks": [
    {
     "kind": "p",
     "text": "Here are nine models on one shared dataset: the truth mixes a straight effect, an interaction (two features multiplied) and a threshold. All use the same five folds, so differences are fair. Change the seed or the data and watch the order move."
    },
    {
     "kind": "code",
     "caption": "Nine models, the same five folds",
     "code": "import warnings\nimport numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.naive_bayes import GaussianNB\nfrom sklearn.svm import SVC\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\n\nwarnings.filterwarnings(\"ignore\")\nrng = np.random.default_rng(21)\nn = 900\nX = rng.normal(size=(n, 8))\n# the truth mixes a straight effect, an interaction and a threshold, plus noise\nscore = 1.0 * X[:, 0] + 1.2 * X[:, 1] * X[:, 2] + 1.5 * (X[:, 3] > 0.5) + rng.normal(0, 0.8, n)\ny = (score > np.median(score)).astype(int)\n\nmodels = {\n    \"majority baseline\": DummyClassifier(),\n    \"logistic regression\": make_pipeline(StandardScaler(), LogisticRegression()),\n    \"k-nearest neighbours\": make_pipeline(StandardScaler(), KNeighborsClassifier(15)),\n    \"naive Bayes\": GaussianNB(),\n    \"RBF support vector machine\": make_pipeline(StandardScaler(), SVC()),\n    \"decision tree (depth 4)\": DecisionTreeClassifier(max_depth=4, random_state=0),\n    \"random forest\": RandomForestClassifier(60, min_samples_leaf=3, random_state=0),\n    \"gradient boosting\": GradientBoostingClassifier(n_estimators=80, max_depth=2, random_state=0),\n    \"neural network (16 units)\": make_pipeline(StandardScaler(), MLPClassifier((16,), solver=\"lbfgs\", max_iter=400, random_state=0)),\n}\ncv = StratifiedKFold(5, shuffle=True, random_state=0)\nprint(f\"{'model':28s} | accuracy | spread across folds\")\nfor name, m in models.items():\n    s = cross_val_score(m, X, y, cv=cv)\n    print(f\"{name:28s} | {s.mean():8.3f} | {s.min():.3f} to {s.max():.3f}\")",
     "output": "model                        | accuracy | spread across folds\nmajority baseline            |    0.500 | 0.500 to 0.500\nlogistic regression          |    0.726 | 0.700 to 0.761\nk-nearest neighbours         |    0.766 | 0.739 to 0.778\nnaive Bayes                  |    0.727 | 0.706 to 0.744\nRBF support vector machine   |    0.798 | 0.778 to 0.828\ndecision tree (depth 4)      |    0.722 | 0.678 to 0.744\nrandom forest                |    0.754 | 0.739 to 0.778\ngradient boosting            |    0.737 | 0.694 to 0.767\nneural network (16 units)    |    0.758 | 0.733 to 0.789"
    },
    {
     "kind": "figure",
     "spec": {
      "title": "Nine models on the same 900 rows",
      "alt": "Cross-validated accuracy of nine models on one shared dataset. The majority baseline scores 0.500. The RBF support vector machine is highest at 0.798 and the decision tree lowest at 0.722; most models fall within a few points of each other.",
      "xLabel": "Model (0 = baseline … 8 = neural net)",
      "yLabel": "Accuracy",
      "series": [
       {
        "name": "Cross-validated accuracy",
        "style": "bars",
        "pts": [
         [
          0,
          0.5
         ],
         [
          1,
          0.726
         ],
         [
          2,
          0.766
         ],
         [
          3,
          0.727
         ],
         [
          4,
          0.798
         ],
         [
          5,
          0.722
         ],
         [
          6,
          0.754
         ],
         [
          7,
          0.737
         ],
         [
          8,
          0.758
         ]
        ]
       }
      ],
      "cats": [
       "Baseline",
       "Logistic",
       "kNN",
       "Naive Bayes",
       "SVM (RBF)",
       "Tree d4",
       "Forest",
       "Boosting",
       "Neural net"
      ],
      "yDomain": [
       0.4,
       0.85
      ]
     }
    },
    {
     "kind": "p",
     "text": "The baseline is 0.500, so every model learned something. The RBF SVM leads at 0.798, but look at the fold spread: most models span about 0.04 to 0.07 from their best to worst fold. Logistic regression, naive Bayes and the tree all sit near 0.72; the forest, network and kNN sit near 0.75 to 0.77. A gap smaller than the spread between folds is not evidence of a better model."
    }
   ]
  },
  {
   "id": "ch-change",
   "kicker": "5 · The winner changes with the data",
   "title": "The winner changes with the data",
   "blocks": [
    {
     "kind": "p",
     "text": "Run the same three models on two kinds of signal and two data sizes. If a model won everywhere, this table would show it."
    },
    {
     "kind": "code",
     "caption": "Signal type and sample size change the ranking",
     "code": "import warnings\nimport numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.svm import SVC\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\n\nwarnings.filterwarnings(\"ignore\")\ncv = StratifiedKFold(5, shuffle=True, random_state=0)\ndef make(kind, n, seed):\n    r = np.random.default_rng(seed)\n    X = r.normal(size=(n, 6))\n    if kind == \"straight-line signal\":\n        s = X[:, 0] + 0.8 * X[:, 1] - 0.6 * X[:, 2] + r.normal(0, 1.0, n)\n    else:\n        s = X[:, 0] * X[:, 1] + 1.5 * (X[:, 2] > 0.3) + r.normal(0, 0.6, n)\n    return X, (s > np.median(s)).astype(int)\n\nmodels = {\n    \"logistic\": make_pipeline(StandardScaler(), LogisticRegression()),\n    \"RBF SVM\": make_pipeline(StandardScaler(), SVC()),\n    \"boosting\": GradientBoostingClassifier(n_estimators=80, max_depth=2, random_state=0),\n}\nprint(\"data | rows | \" + \" | \".join(models))\nfor kind in [\"straight-line signal\", \"interactions and thresholds\"]:\n    for n in [120, 1200]:\n        X, y = make(kind, n, 3)\n        row = [cross_val_score(m, X, y, cv=cv).mean() for m in models.values()]\n        print(f\"{kind} | {n} | \" + \" | \".join(f\"{v:.3f}\" for v in row))",
     "output": "data | rows | logistic | RBF SVM | boosting\nstraight-line signal | 120 | 0.783 | 0.817 | 0.800\nstraight-line signal | 1200 | 0.798 | 0.786 | 0.793\ninteractions and thresholds | 120 | 0.733 | 0.808 | 0.733\ninteractions and thresholds | 1200 | 0.733 | 0.823 | 0.786"
    },
    {
     "kind": "p",
     "text": "With a straight-line signal and 1,200 rows, logistic regression is actually the best of the three (0.798, against 0.786 for the SVM and 0.793 for boosting); with only 120 rows it is last, by two to three points. With interactions and thresholds, logistic regression stays at 0.733 whatever the size, while the RBF SVM reaches 0.808 and then 0.823, and boosting climbs from 0.733 to 0.786 as it gets more rows. Flexible models gain from more data and from structure; a linear model plateaus."
    },
    {
     "kind": "callout",
     "tone": "idea",
     "title": "Keep this",
     "text": "Match the model to the shape of the signal and the size of the data. Check on your own table: do not rely on someone else's ranking."
    }
   ]
  },
  {
   "id": "ch-rules",
   "kicker": "6 · Rules of thumb that hold up",
   "title": "Rules of thumb that hold up",
   "blocks": [
    {
     "kind": "steps",
     "items": [
      "Baseline first, linear model second. A flexible model must beat both by more than the fold spread.",
      "Use the same folds and the same metric for every candidate.",
      "Put scaling and any preprocessing inside a pipeline so each fold is fitted on its own training rows.",
      "Choose by cross-validation on training rows; touch the test set once, at the end.",
      "When two models tie, take the simpler and cheaper one.",
      "Re-check when the data changes: a ranking is only valid for the table it was measured on."
     ]
    },
    {
     "kind": "check",
     "question": "Model A scores 0.762 and model B scores 0.756 on cross-validation, and the folds of each vary by about 0.04. Which should you choose?",
     "options": [
      "A, since it scored higher",
      "Either; the difference is inside the fold spread, so take the simpler or cheaper one",
      "B, since it is lower"
     ],
     "answer": 1,
     "why": "A 0.006 gap is well inside a 0.04 spread, so the data cannot tell them apart."
    },
    {
     "kind": "callout",
     "tone": "warn",
     "title": "Do not tune on the test set",
     "text": "Every time you look at the test score and change something, it stops being a test. Decide with cross-validation and test once."
    }
   ]
  }
 ]
};
