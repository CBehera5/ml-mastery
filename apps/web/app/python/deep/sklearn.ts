import type {DeepLesson} from "../../math/teaching/deep-read";
export const SKLEARN_DEEP:DeepLesson[]=[
 {
  "title": "The estimator lifecycle and a first baseline",
  "minutes": 12,
  "sections": [
   {
    "id": "ps1-observe",
    "kicker": "1 · Observe",
    "title": "Every model has the same four moves",
    "blocks": [
     {
      "kind": "p",
      "text": "Whether it is a line, a tree or a forest, a scikit-learn model is used the same way: create it, fit it, predict with it, inspect what it learned. Learn the pattern once and every model is familiar."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does fit actually change, and how do we know predict is doing what we think?"
     }
    ]
   },
   {
    "id": "ps1-express",
    "kicker": "2 · Express",
    "title": "The pattern",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "model = LinearRegression()",
       "model.fit(Xtr, ytr)   # learns coef_ and intercept_",
       "model.predict(X)         # one prediction per row"
      ],
      "note": "Attributes ending in an underscore are learned from data; they do not exist before fit."
     }
    ]
   },
   {
    "id": "ps1-visualize",
    "kicker": "3 · Visualize",
    "title": "A 500-flat table",
    "blocks": [
     {
      "kind": "table",
      "caption": "Linear model on area and age",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "has coef_ before fit",
        "False"
       ],
       [
        "coef_ after fit (area, age)",
        "0.79, −0.459"
       ],
       [
        "intercept_",
        "10.14"
       ],
       [
        "predictions shape for 100 test rows",
        "(100,)"
       ],
       [
        "80 sq m, 10 year flat",
        "₹68.7 lakh"
       ],
       [
        "same by hand: coef · x + intercept",
        "68.7"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The learned numbers recover the pattern the data was made from, roughly +0.8 per sq m and −0.5 per year, plus noise. A prediction is just coef · x + intercept, which you can check yourself."
     }
    ]
   },
   {
    "id": "ps1-discover",
    "kicker": "4 · Discover",
    "title": "Why the by-hand check matters",
    "blocks": [
     {
      "kind": "p",
      "text": "When a number comes out of a library, recompute one example. If the by-hand answer matches, you understand what predict does; if not, a shape or a column order is wrong."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Create, fit on training rows, predict on new rows, and check one prediction by hand."
     }
    ]
   },
   {
    "id": "ps1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a new flat. Area 80 and age 10: 0.79 × 80 − 0.459 × 10 + 10.14 ≈ 68.7, matching predict."
     },
     {
      "kind": "p",
      "text": "Example 2, shapes. predict on a (100, 2) table returns shape (100,). A single flat must be passed as a (1, 2) table, not a bare list of 2 numbers."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "This same lifecycle applies to every scikit-learn estimator, so models can be swapped with one line."
     },
     {
      "kind": "check",
      "question": "What does fit do?",
      "options": [
       "Predicts new rows",
       "Learns parameters from training data",
       "Splits the data"
      ],
      "answer": 1,
      "why": "fit learns parameters such as coef_ and intercept_."
     }
    ]
   },
   {
    "id": "ps1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Calling fit on test data",
      "text": "The model learns from what it should be judged on."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Passing a 1-D array",
      "text": "predict expects a 2-D table, one row per example."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Shuffled column order",
      "text": "The weights then apply to the wrong features."
     }
    ]
   },
   {
    "id": "ps1-python",
    "kicker": "7 · In Python",
    "title": "The lifecycle in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Create, fit, inspect, predict and verify by hand",
      "code": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(1)\nn = 500\narea = rng.normal(75, 20, n)\nage = rng.uniform(0, 30, n)\nprice = 0.8 * area - 0.5 * age + 10 + rng.normal(0, 5, n)\nX = np.column_stack([area, age])\nXtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.2, random_state=0)\n\nmodel = LinearRegression()\nprint(\"before fit, has coef_:\", hasattr(model, \"coef_\"))\nmodel.fit(Xtr, ytr)\nprint(\"after fit, coef_:\", model.coef_.round(3), \"| intercept_:\", round(float(model.intercept_), 2))\npred = model.predict(Xte)\nprint(\"predictions shape:\", pred.shape)\nnew_flat = np.array([[80.0, 10.0]])\nprint(\"a new 80 sq m, 10 year flat:\", round(float(model.predict(new_flat)[0]), 1), \"lakh\")\nprint(\"by hand:\", round(float(model.coef_ @ new_flat[0] + model.intercept_), 1))",
      "output": "before fit, has coef_: False\nafter fit, coef_: [ 0.79  -0.459] | intercept_: 10.14\npredictions shape: (100,)\na new 80 sq m, 10 year flat: 68.7 lakh\nby hand: 68.7"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Verify one prediction by hand."
     }
    ]
   }
  ]
 },
 {
  "title": "Evaluate against a meaningful baseline",
  "minutes": 12,
  "sections": [
   {
    "id": "ps2-observe",
    "kicker": "1 · Observe",
    "title": "Is ₹4.26 lakh of error good?",
    "blocks": [
     {
      "kind": "p",
      "text": "A linear model's mean absolute error on test flats was ₹4.26 lakh. Without a baseline that number means nothing. If simply predicting the average price gave 4.3, the model would be useless."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What is the simplest honest comparison, and when does a high score still mean no skill?"
     }
    ]
   },
   {
    "id": "ps2-express",
    "kicker": "2 · Express",
    "title": "Baselines",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "DummyRegressor(strategy='mean')  predicts the training mean",
       "DummyClassifier(strategy='most_frequent')  predicts the majority class",
       "R² = 0 means no better than the mean"
      ],
      "note": "A model must beat the baseline by an amount that matters."
     }
    ]
   },
   {
    "id": "ps2-visualize",
    "kicker": "3 · Visualize",
    "title": "Two comparisons",
    "blocks": [
     {
      "kind": "table",
      "caption": "Regression and classification baselines",
      "headers": [
       "Model",
       "Result"
      ],
      "rows": [
       [
        "mean baseline",
        "MAE 11.85 lakh, R² −0.004"
       ],
       [
        "linear model",
        "MAE 4.26 lakh, R² 0.871"
       ],
       [
        "baseline prediction",
        "₹61.4 lakh for every flat"
       ],
       [
        "always predict 'no' on 5% positives",
        "accuracy 0.947, recall 0.0"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The linear model cut the error from 11.85 to 4.26, a clear win. The classifier shows the reverse trap: 94.7% accuracy from a rule that finds none of the positives."
     }
    ]
   },
   {
    "id": "ps2-discover",
    "kicker": "4 · Discover",
    "title": "Accuracy without skill",
    "blocks": [
     {
      "kind": "p",
      "text": "With 5% positives, always saying no is 95% right and useless. Report the metric that matches the cost (recall, precision) and the baseline beside it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Always report a baseline next to the model; a number alone has no meaning."
     }
    ]
   },
   {
    "id": "ps2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the gain. Error fell from ₹11.85 to ₹4.26 lakh, a 64% reduction."
     },
     {
      "kind": "p",
      "text": "Example 2, a free accuracy. Predicting the majority class gives 0.947 accuracy. A model must beat that and also find positives."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Baselines are the first row of every experiment table."
     },
     {
      "kind": "check",
      "question": "R² near 0 means...",
      "options": [
       "Perfect fit",
       "No better than predicting the mean",
       "An error"
      ],
      "answer": 1,
      "why": "R² 0 equals the mean baseline."
     }
    ]
   },
   {
    "id": "ps2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · No baseline",
      "text": "You cannot tell whether the model is any good."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Judging by accuracy on rare classes",
      "text": "The majority rule looks excellent."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Scoring on training data",
      "text": "The baseline and model both look better than they are."
     }
    ]
   },
   {
    "id": "ps2-python",
    "kicker": "7 · In Python",
    "title": "Baselines in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Compare a model with mean and majority baselines",
      "code": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.dummy import DummyRegressor\nfrom sklearn.metrics import mean_absolute_error, r2_score\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(1)\nn = 500\narea = rng.normal(75, 20, n)\nage = rng.uniform(0, 30, n)\nprice = 0.8 * area - 0.5 * age + 10 + rng.normal(0, 5, n)\nX = np.column_stack([area, age])\nXtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.2, random_state=0)\n\nbase = DummyRegressor(strategy=\"mean\").fit(Xtr, ytr)\nmodel = LinearRegression().fit(Xtr, ytr)\nfor name, m in [(\"baseline (train mean)\", base), (\"linear model\", model)]:\n    p = m.predict(Xte)\n    print(f\"{name}: MAE {mean_absolute_error(yte, p):.2f} lakh | R2 {r2_score(yte, p):.3f}\")\nprint(\"baseline prediction:\", round(float(ytr.mean()), 1))\n\n# a classification baseline: accuracy can be high with no skill\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import accuracy_score, recall_score\ny = (rng.random(1000) < 0.05).astype(int)\nXc = rng.normal(size=(1000, 2))\nd = DummyClassifier(strategy=\"most_frequent\").fit(Xc, y)\nprint(\"always predict 0: accuracy\", accuracy_score(y, d.predict(Xc)), \"| recall\", recall_score(y, d.predict(Xc)))",
      "output": "baseline (train mean): MAE 11.85 lakh | R2 -0.004\nlinear model: MAE 4.26 lakh | R2 0.871\nbaseline prediction: 61.4\nalways predict 0: accuracy 0.947 | recall 0.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Run the dumbest model first."
     }
    ]
   }
  ]
 },
 {
  "title": "Cross-validation keeps validation inside training",
  "minutes": 13,
  "sections": [
   {
    "id": "ps3-observe",
    "kicker": "1 · Observe",
    "title": "One split is one opinion",
    "blocks": [
     {
      "kind": "p",
      "text": "A single validation split gives one number, and that number depends on which rows landed where. K-fold cross-validation asks five times, each time holding out a different fifth of the training data."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How does cross-validation work, and why is the test set left alone?"
     }
    ]
   },
   {
    "id": "ps3-express",
    "kicker": "2 · Express",
    "title": "K-fold",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "KFold(n_splits=5, shuffle=True, random_state=0)",
       "each row is in the validation fold exactly once",
       "report the mean and the spread across folds"
      ],
      "note": "Cross-validation happens inside the training set. The test set waits."
     }
    ]
   },
   {
    "id": "ps3-visualize",
    "kicker": "3 · Visualize",
    "title": "Five folds of 80",
    "blocks": [
     {
      "kind": "table",
      "caption": "400 training flats",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "fold sizes (train / validation)",
        "320 / 80, five times"
       ],
       [
        "fold MAE",
        "4.11, 4.52, 4.59, 4.05, 3.79"
       ],
       [
        "mean ± std",
        "4.21 ± 0.30"
       ],
       [
        "each row validated once",
        "True"
       ],
       [
        "test rows held back",
        "100"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The spread of 0.30 across folds is a hint of how much one split could mislead: a single fold could have said 3.79 or 4.59 for the same model."
     }
    ]
   },
   {
    "id": "ps3-discover",
    "kicker": "4 · Discover",
    "title": "Mean and spread",
    "blocks": [
     {
      "kind": "p",
      "text": "Report both. If two models differ by less than the fold-to-fold spread, the difference may be noise. And because all tuning uses only training folds, the 100 test rows still give an untouched final check."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Cross-validation turns one noisy split into several, and the test set remains the final, single look."
     }
    ]
   },
   {
    "id": "ps3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, noise. Fold errors ranged from 3.79 to 4.59, so a difference of 0.1 between two models would not be convincing."
     },
     {
      "kind": "p",
      "text": "Example 2, coverage. Every training row served once as validation and four times as training."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Model selection, hyperparameter search and feature selection all use cross-validation."
     },
     {
      "kind": "check",
      "question": "Where does cross-validation happen?",
      "options": [
       "On the test set",
       "Inside the training set",
       "On new data"
      ],
      "answer": 1,
      "why": "The test set is kept for the end."
     }
    ]
   },
   {
    "id": "ps3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Looking at the mean only",
      "text": "The spread tells you how much to trust it."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Cross-validating on the test set",
      "text": "Nothing is left for an honest final check."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Not shuffling ordered data",
      "text": "Folds then differ systematically."
     }
    ]
   },
   {
    "id": "ps3-python",
    "kicker": "7 · In Python",
    "title": "Cross-validation in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Five folds, mean and spread, coverage check",
      "code": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import KFold, cross_val_score, train_test_split\n\nrng = np.random.default_rng(1)\nn = 500\narea = rng.normal(75, 20, n)\nage = rng.uniform(0, 30, n)\nprice = 0.8 * area - 0.5 * age + 10 + rng.normal(0, 5, n)\nX = np.column_stack([area, age])\nXtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.2, random_state=0)\n\ncv = KFold(n_splits=5, shuffle=True, random_state=0)\nprint(\"fold sizes (train / validation):\", [(len(a), len(b)) for a, b in cv.split(Xtr)])\nscores = -cross_val_score(LinearRegression(), Xtr, ytr, cv=cv, scoring=\"neg_mean_absolute_error\")\nprint(\"fold MAE:\", scores.round(2))\nprint(\"mean +/- std:\", round(float(scores.mean()), 2), \"+/-\", round(float(scores.std()), 2))\n\n# every training row is validated exactly once\nseen = np.concatenate([b for _, b in cv.split(Xtr)])\nprint(\"each row validated once:\", bool(np.array_equal(np.sort(seen), np.arange(len(Xtr)))))\n\nprint(\"test rows held back, never used in CV:\", len(Xte))",
      "output": "fold sizes (train / validation): [(320, 80), (320, 80), (320, 80), (320, 80), (320, 80)]\nfold MAE: [4.11 4.52 4.59 4.05 3.79]\nmean +/- std: 4.21 +/- 0.3\neach row validated once: True\ntest rows held back, never used in CV: 100"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Report the spread with the mean."
     }
    ]
   }
  ]
 },
 {
  "title": "A complete train-fitted pipeline",
  "minutes": 13,
  "sections": [
   {
    "id": "ps4-observe",
    "kicker": "1 · Observe",
    "title": "From a raw row to a rupee estimate",
    "blocks": [
     {
      "kind": "p",
      "text": "A new listing arrives with a missing age and a city you have never seen. A pipeline takes the raw row and produces a prediction anyway, because every preparation step was fitted on training data and is part of the model."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we combine numeric and categorical preparation with a model in one object?"
     }
    ]
   },
   {
    "id": "ps4-express",
    "kicker": "2 · Express",
    "title": "ColumnTransformer + Pipeline",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "numeric columns: impute median, then scale",
       "categorical columns: one-hot with handle_unknown='ignore'",
       "model: LinearRegression at the end"
      ],
      "note": "One fit call learns every step from the training rows."
     }
    ]
   },
   {
    "id": "ps4-visualize",
    "kicker": "3 · Visualize",
    "title": "600 listings",
    "blocks": [
     {
      "kind": "table",
      "caption": "Area, age (30 missing), city",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "test MAE",
        "₹3.81 lakh"
       ],
       [
        "raw flat: area 90, age missing, city Chennai",
        "₹69.8 lakh"
       ],
       [
        "learned age median",
        "15.0"
       ],
       [
        "feature names",
        "num__area, num__age, cat__city_Mumbai, cat__city_Nagpur, cat__city_Pune"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The Chennai flat has no city column of its own, so the model falls back to the other features, just as designed. The learned median age of 15 filled the hole."
     }
    ]
   },
   {
    "id": "ps4-discover",
    "kicker": "4 · Discover",
    "title": "One object to ship",
    "blocks": [
     {
      "kind": "p",
      "text": "Because the pipeline is a single estimator, you save it once and it handles raw data in production. Feature names also let you read which column is which."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Put preparation and model in one fitted object, so training and prediction cannot drift apart."
     }
    ]
   },
   {
    "id": "ps4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a hole. The missing age became 15.0 inside the pipeline with no extra code."
     },
     {
      "kind": "p",
      "text": "Example 2, a new city. Chennai gave all zeros for the city columns. The prediction was still produced."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Production ML is a pipeline plus a monitor, not a bare model."
     },
     {
      "kind": "check",
      "question": "Why handle_unknown='ignore'?",
      "options": [
       "To speed up training",
       "To survive unseen categories",
       "To remove columns"
      ],
      "answer": 1,
      "why": "Unseen categories get all zeros instead of an error."
     }
    ]
   },
   {
    "id": "ps4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Preparing outside the pipeline",
      "text": "Production uses a different recipe."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Unseen categories crash",
      "text": "Choose a policy, such as ignore."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Unreadable feature order",
      "text": "Use get_feature_names_out to label the columns."
     }
    ]
   },
   {
    "id": "ps4-python",
    "kicker": "7 · In Python",
    "title": "A pipeline in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Impute, scale, encode and fit in one object",
      "code": "import numpy as np\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_absolute_error\nimport pandas as pd\n\nrng = np.random.default_rng(2)\nn = 600\ndf = pd.DataFrame({\n    \"area\": rng.normal(75, 20, n).round(0),\n    \"age\": rng.uniform(0, 30, n).round(0),\n    \"city\": rng.choice([\"Pune\", \"Mumbai\", \"Nagpur\"], n),\n})\nbump = df[\"city\"].map({\"Pune\": 0, \"Mumbai\": 25, \"Nagpur\": -8})\ndf[\"price\"] = 0.8 * df[\"area\"] - 0.5 * df[\"age\"] + bump + rng.normal(0, 5, n)\ndf.loc[rng.choice(n, 30, replace=False), \"age\"] = np.nan\n\nX, y = df[[\"area\", \"age\", \"city\"]], df[\"price\"]\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=0)\n\nprep = ColumnTransformer([\n    (\"num\", Pipeline([(\"fill\", SimpleImputer(strategy=\"median\")), (\"scale\", StandardScaler())]), [\"area\", \"age\"]),\n    (\"cat\", OneHotEncoder(handle_unknown=\"ignore\"), [\"city\"]),\n])\npipe = Pipeline([(\"prep\", prep), (\"model\", LinearRegression())]).fit(Xtr, ytr)\nprint(\"test MAE:\", round(float(mean_absolute_error(yte, pipe.predict(Xte))), 2), \"lakh\")\n\n# one raw flat with a hole and an unseen city goes straight in\nraw = pd.DataFrame({\"area\": [90.0], \"age\": [np.nan], \"city\": [\"Chennai\"]})\nprint(\"raw flat prediction:\", round(float(pipe.predict(raw)[0]), 1), \"lakh\")\nprint(\"feature names:\", list(pipe.named_steps[\"prep\"].get_feature_names_out()))\nprint(\"learned age median:\", pipe.named_steps[\"prep\"].named_transformers_[\"num\"].named_steps[\"fill\"].statistics_[1])",
      "output": "test MAE: 3.81 lakh\nraw flat prediction: 69.8 lakh\nfeature names: ['num__area', 'num__age', 'cat__city_Mumbai', 'cat__city_Nagpur', 'cat__city_Pune']\nlearned age median: 15.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Everything that learns belongs in the pipeline."
     }
    ]
   }
  ]
 },
 {
  "title": "Compare models without choosing on the test set",
  "minutes": 13,
  "sections": [
   {
    "id": "ps5-observe",
    "kicker": "1 · Observe",
    "title": "Four models, one test set",
    "blocks": [
     {
      "kind": "p",
      "text": "You try four models. If you pick the one with the best test score, the test set has chosen the model, and its score is now optimistic. Choose with cross-validation, then use the test set once."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we compare candidates fairly and report an honest final number?"
     }
    ]
   },
   {
    "id": "ps5-express",
    "kicker": "2 · Express",
    "title": "Compare, choose, look once",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "score each candidate with the same folds",
       "pick the best mean CV score",
       "fit on all training rows, evaluate on the test set once"
      ],
      "note": "The test set's job is to confirm, not to decide."
     }
    ]
   },
   {
    "id": "ps5-visualize",
    "kicker": "3 · Visualize",
    "title": "Four candidates",
    "blocks": [
     {
      "kind": "table",
      "caption": "Y = 3·x₁ − 2·x₂ + noise, 300 training rows",
      "headers": [
       "Model",
       "CV MAE"
      ],
      "rows": [
       [
        "linear",
        "1.255"
       ],
       [
        "ridge, alpha 10",
        "1.257"
       ],
       [
        "tree depth 3",
        "1.896"
       ],
       [
        "tree depth 12",
        "1.949"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Linear and ridge are effectively tied (1.255 versus 1.257). Linear was chosen by CV, and a single look at the test set gave MAE 1.10, a little better than the CV estimate, which is normal variation."
     }
    ]
   },
   {
    "id": "ps5-discover",
    "kicker": "4 · Discover",
    "title": "What the table says",
    "blocks": [
     {
      "kind": "p",
      "text": "The data is linear, so linear models win and trees pay for approximating a straight line with steps. A deeper tree did slightly worse than a shallow one. A tie goes to the simpler model."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Choose by cross-validation, tie-break by simplicity, and open the test set once."
     }
    ]
   },
   {
    "id": "ps5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a tie. 1.255 versus 1.257 is far below fold noise. Prefer the simpler or more explainable model."
     },
     {
      "kind": "p",
      "text": "Example 2, overfitting. Depth 12 had the worst CV MAE, 1.949, because it fits noise."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "This is the standard loop: baseline, candidates, CV choice, one test evaluation."
     },
     {
      "kind": "check",
      "question": "Which data picks the best model?",
      "options": [
       "Test set",
       "Cross-validation folds of training data",
       "Both"
      ],
      "answer": 1,
      "why": "Choosing on the test set makes its score optimistic."
     }
    ]
   },
   {
    "id": "ps5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Picking by test score",
      "text": "The test set stops being independent."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Over-reading small gaps",
      "text": "Differences below fold noise are not real."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Testing many times",
      "text": "Each look is a chance to fool yourself."
     }
    ]
   },
   {
    "id": "ps5-python",
    "kicker": "7 · In Python",
    "title": "Model comparison in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Compare four candidates by CV, then test once",
      "code": "import numpy as np\nfrom sklearn.linear_model import Ridge, LinearRegression\nfrom sklearn.tree import DecisionTreeRegressor\nfrom sklearn.model_selection import KFold, cross_val_score, train_test_split\nfrom sklearn.metrics import mean_absolute_error\n\nrng = np.random.default_rng(4)\nn = 400\nX = rng.normal(0, 1, (n, 5))\ny = 3 * X[:, 0] - 2 * X[:, 1] + rng.normal(0, 1.5, n)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)\n\ncv = KFold(5, shuffle=True, random_state=0)\ncands = {\n    \"linear\": LinearRegression(),\n    \"ridge a=10\": Ridge(alpha=10),\n    \"tree depth 3\": DecisionTreeRegressor(max_depth=3, random_state=0),\n    \"tree depth 12\": DecisionTreeRegressor(max_depth=12, random_state=0),\n}\ncv_mae = {}\nfor name, m in cands.items():\n    cv_mae[name] = float(-cross_val_score(m, Xtr, ytr, cv=cv, scoring=\"neg_mean_absolute_error\").mean())\n    print(f\"{name:14s} CV MAE {cv_mae[name]:.3f}\")\nbest = min(cv_mae, key=cv_mae.get)\nprint(\"chosen by CV:\", best)\n\nfinal = cands[best].fit(Xtr, ytr)\nprint(\"one look at the test set, MAE:\", round(float(mean_absolute_error(yte, final.predict(Xte))), 3))",
      "output": "linear         CV MAE 1.255\nridge a=10     CV MAE 1.257\ntree depth 3   CV MAE 1.896\ntree depth 12  CV MAE 1.949\nchosen by CV: linear\none look at the test set, MAE: 1.1"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Choose with CV and look at the test set once."
     }
    ]
   }
  ]
 }
];
