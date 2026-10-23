import type {DeepLesson} from "../../math/teaching/deep-read";
export const MODEL_SELECTION_DEEP:DeepLesson[]=[
 {
  "title": "A fair race needs one track",
  "minutes": 13,
  "sections": [
   {
    "id": "ms1-observe",
    "kicker": "1 · Observe",
    "title": "Who really won?",
    "blocks": [
     {
      "kind": "p",
      "text": "Two analysts compare models for flat prices. One reports that her forest is far better. His ridge model looks poor beside it. Then you learn they used different rows, different columns and one of them scored on training data. The comparison says nothing."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What must every candidate share before we compare scores, and how do we state a gain honestly?"
     }
    ]
   },
   {
    "id": "ms1-express",
    "kicker": "2 · Express",
    "title": "Same rows, same target, same ruler",
    "blocks": [
     {
      "kind": "p",
      "text": "Fix the split, the target definition, the metric and the information each model may use. Always include a baseline, such as predicting the average. Then say the gain relative to that baseline, in the units of the target."
     },
     {
      "kind": "eq",
      "lines": [
       "relative reduction = (baseline error − model error) ÷ baseline error"
      ],
      "note": "A percentage of error removed is not a percentage-point gain in accuracy."
     }
    ]
   },
   {
    "id": "ms1-visualize",
    "kicker": "3 · Visualize",
    "title": "Three models on one validation set",
    "blocks": [
     {
      "kind": "p",
      "text": "800 simulated flats with area and age. 480 train, 320 validation. Metric: mean absolute error in ₹ lakh."
     },
     {
      "kind": "table",
      "caption": "Validation error against a baseline",
      "headers": [
       "Model",
       "MAE (₹ lakh)",
       "Error cut vs baseline"
      ],
      "rows": [
       [
        "Predict the average",
        "17.00",
        "0%"
       ],
       [
        "Ridge regression",
        "5.79",
        "65.9%"
       ],
       [
        "Random forest",
        "3.54",
        "79.2%"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Both models beat the baseline by a wide margin, and the forest's error is about 39 percent below ridge's. Each row is on the same flats."
     }
    ]
   },
   {
    "id": "ms1-discover",
    "kicker": "4 · Discover",
    "title": "Scoring on training rows flatters flexible models",
    "blocks": [
     {
      "kind": "table",
      "caption": "The same models, scored two ways",
      "headers": [
       "Model",
       "MAE on own training rows",
       "MAE on held-out rows"
      ],
      "rows": [
       [
        "Ridge",
        "5.81",
        "5.79"
       ],
       [
        "Random forest",
        "2.73",
        "3.54"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Ridge is the same either way. The forest looks 2.73 on its own rows and is really 3.54. If one model is scored on training data and another on held-out data, the race is not fair."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A comparison is fair when every model has the same rows, target, ruler and information, and a baseline stands beside them."
     }
    ]
   },
   {
    "id": "ms1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a relative gain. Baseline 17.00, forest 3.54: (17.00 − 3.54) ÷ 17.00 = 0.792, so the forest removes 79.2 percent of the baseline's error. Ridge removes 65.9 percent."
     },
     {
      "kind": "p",
      "text": "Example 2, a gap that is easy to misread. Forest 3.54 against ridge 5.79 is 2.25 lakh apart, about a 39 percent smaller error. Say that, not 'the forest is 39 percent accurate'."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Choosing between a scorecard, a forest and a boosted model, with a baseline everyone agrees on."
     },
     {
      "kind": "check",
      "question": "Baseline MAE is 12 and a candidate's is 9. By how much did error fall?",
      "options": [
       "3 percentage points",
       "25 percent of the baseline error",
       "9 percent"
      ],
      "answer": 1,
      "why": "(12 − 9) ÷ 12 = 0.25. It is a relative reduction in error, measured on the same rows."
     }
    ]
   },
   {
    "id": "ms1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Different rows for different models",
      "text": "Keep row IDs the same and assert it in code."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Unequal effort",
      "text": "A model tuned for a week against one left at defaults is not a fair race."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Forgetting the baseline",
      "text": "Without it, 'MAE 3.5' has no meaning."
     }
    ]
   },
   {
    "id": "ms1-python",
    "kicker": "7 · In Python",
    "title": "A fair table in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "A baseline, two models, and training-set scoring",
      "code": "import numpy as np\nfrom sklearn.dummy import DummyRegressor\nfrom sklearn.linear_model import Ridge\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.metrics import mean_absolute_error\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(5)\nn = 800\narea = rng.uniform(30, 130, n)\nage = rng.uniform(0, 40, n)\nprice = 0.55 * area - 0.4 * age + 8 * np.sin(area / 15) + rng.normal(0, 4, n)\nX = np.column_stack([area, age])\nXtr, Xva, ytr, yva = train_test_split(X, price, test_size=0.4, random_state=0)\n\nbase = mean_absolute_error(yva, DummyRegressor().fit(Xtr, ytr).predict(Xva))\nprint(\"baseline (predict the average)  MAE\", round(base, 2), \"lakh\")\nfor name, m in [(\"ridge\", Ridge()), (\"random forest\", RandomForestRegressor(200, min_samples_leaf=5, random_state=0))]:\n    mae = mean_absolute_error(yva, m.fit(Xtr, ytr).predict(Xva))\n    print(name.ljust(31), \"MAE\", round(mae, 2), \"lakh | error cut by\", round(100 * (base - mae) / base, 1), \"%\")\n\n# an unfair score: judging models on the rows they trained on\nfor name, m in [(\"ridge\", Ridge()), (\"random forest\", RandomForestRegressor(200, min_samples_leaf=5, random_state=0))]:\n    m.fit(Xtr, ytr)\n    print(name.ljust(31), \"MAE on its own training rows\", round(mean_absolute_error(ytr, m.predict(Xtr)), 2), \"| on held-out rows\", round(mean_absolute_error(yva, m.predict(Xva)), 2))",
      "output": "baseline (predict the average)  MAE 17.0 lakh\nridge                           MAE 5.79 lakh | error cut by 65.9 %\nrandom forest                   MAE 3.54 lakh | error cut by 79.2 %\nridge                           MAE on its own training rows 5.81 | on held-out rows 5.79\nrandom forest                   MAE on its own training rows 2.73 | on held-out rows 3.54"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Compare on identical held-out rows and quote the gain against a baseline."
     }
    ]
   }
  ]
 },
 {
  "title": "Every search spends information",
  "minutes": 13,
  "sections": [
   {
    "id": "ms2-observe",
    "kicker": "1 · Observe",
    "title": "Try enough settings and one will look good",
    "blocks": [
     {
      "kind": "p",
      "text": "You try 500 settings of a model and report the best validation score. Even if every setting is useless, the best of 500 coin flips looks good. The validation set has been used up as evidence."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How much does searching inflate a score, and how do we protect the final number?"
     }
    ]
   },
   {
    "id": "ms2-express",
    "kicker": "2 · Express",
    "title": "The winner's curse",
    "blocks": [
     {
      "kind": "p",
      "text": "Each validation score is the true skill plus luck. Choosing the maximum selects the settings with the best luck. The more you try, the larger the lucky part of the winner."
     },
     {
      "kind": "eq",
      "lines": [
       "best of k scores ≈ true skill + the largest of k pieces of luck"
      ],
      "note": "The largest of k luck terms grows with k, even when true skill is the same for all."
     }
    ]
   },
   {
    "id": "ms2-visualize",
    "kicker": "3 · Visualize",
    "title": "Useless models, impressive winners",
    "blocks": [
     {
      "kind": "p",
      "text": "Every 'model' here is a coin flip: true accuracy is 0.5 for all. Validation has 200 rows, and a fresh test set has 2,000."
     },
     {
      "kind": "table",
      "caption": "Best validation accuracy against fresh test accuracy",
      "headers": [
       "Settings tried",
       "Best validation accuracy",
       "Same setting on fresh rows"
      ],
      "rows": [
       [
        "1",
        "0.530",
        "0.505"
       ],
       [
        "5",
        "0.540",
        "0.518"
       ],
       [
        "25",
        "0.585",
        "0.487"
       ],
       [
        "100",
        "0.595",
        "0.500"
       ],
       [
        "500",
        "0.625",
        "0.520"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Trying 500 useless settings produced a validation accuracy of 0.625. On fresh rows the winner scored 0.520, close to the truth of 0.5."
     }
    ]
   },
   {
    "id": "ms2-discover",
    "kicker": "4 · Discover",
    "title": "Protect the final number",
    "blocks": [
     {
      "kind": "p",
      "text": "Keep a test set that is never used in the search. Keep a count of what you tried. If you have to search a lot, use bigger validation sets, because luck shrinks with size, and expect the winner to be somewhat worse than its validation score."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A search converts luck into an apparent skill, so keep a fresh test set to see through it."
     }
    ]
   },
   {
    "id": "ms2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the size of luck. With 200 validation rows, the standard deviation of one accuracy is √(0.5 × 0.5 ÷ 200) = 0.035. The best of 500 draws sits roughly three standard deviations above, 0.5 + 3 × 0.035 ≈ 0.6, in line with the 0.625 in the table."
     },
     {
      "kind": "p",
      "text": "Example 2, a tuning budget. Tuning four settings on 20,000 validation rows inflates much less than tuning 400 on 200 rows. Report how many configurations were tried."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Hyper-parameter searches, feature selection by score, and any 'pick the best of many' step."
     },
     {
      "kind": "check",
      "question": "Why did the best of 500 useless settings score 0.625 on validation?",
      "options": [
       "It learned a real pattern",
       "It was the luckiest draw",
       "The validation set was too large"
      ],
      "answer": 1,
      "why": "All settings have true accuracy 0.5. The maximum of many noisy scores is lucky."
     }
    ]
   },
   {
    "id": "ms2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reporting the search score as the result",
      "text": "It is the winner's score, and is optimistic."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Unlimited searching on small data",
      "text": "Luck grows as validation shrinks and the search grows."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Not logging attempts",
      "text": "If you cannot say how many things you tried, you cannot judge the winner."
     }
    ]
   },
   {
    "id": "ms2-python",
    "kicker": "7 · In Python",
    "title": "Luck as a function of search size",
    "blocks": [
     {
      "kind": "code",
      "caption": "Pure-noise models: best validation against fresh rows",
      "code": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# every configuration is pure noise: the true accuracy is 0.5 for all of them\nrng = np.random.default_rng(1)\nn_val, n_test = 200, 2000\ny_val = rng.integers(0, 2, n_val)\ny_test = rng.integers(0, 2, n_test)\nprint(\"configs tried | best validation accuracy | that config on fresh test rows\")\nfor k in [1, 5, 25, 100, 500]:\n    val_accs = []\n    test_accs = []\n    for _ in range(k):\n        guess_val = rng.integers(0, 2, n_val)\n        guess_test = rng.integers(0, 2, n_test)\n        val_accs.append((guess_val == y_val).mean())\n        test_accs.append((guess_test == y_test).mean())\n    best = int(np.argmax(val_accs))\n    print(str(k).rjust(13), \"|\", round(val_accs[best], 3), \"                   |\", round(test_accs[best], 3))",
      "output": "configs tried | best validation accuracy | that config on fresh test rows\n            1 | 0.53                    | 0.505\n            5 | 0.54                    | 0.518\n           25 | 0.585                    | 0.487\n          100 | 0.595                    | 0.5\n          500 | 0.625                    | 0.52"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The more you search, the less a validation score tells you. Test on rows the search never saw."
     }
    ]
   }
  ]
 },
 {
  "title": "Nested validation: tune inside, score outside",
  "minutes": 14,
  "sections": [
   {
    "id": "ms3-observe",
    "kicker": "1 · Observe",
    "title": "Tuning and scoring on the same folds",
    "blocks": [
     {
      "kind": "p",
      "text": "Cross-validation picks settings and also produces a score. If the score you report is the same one that picked the winner, it is a winner's score again. We need an outer loop that never takes part in the choice."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we score a tuning procedure honestly?"
     }
    ]
   },
   {
    "id": "ms3-express",
    "kicker": "2 · Express",
    "title": "Two loops",
    "blocks": [
     {
      "kind": "p",
      "text": "Split the data into outer folds. For each, run the whole search using only the outer training rows, with its own inner folds. Then score the winner on the outer fold held out from the search. Average the outer scores. That average scores the procedure, not one lucky setting."
     },
     {
      "kind": "eq",
      "lines": [
       "outer fold i: tune on its training part → score on its held-out part",
       "nested score = mean of the outer scores"
      ],
      "note": "Structured data needs structured folds too: keep groups together and respect time order."
     }
    ]
   },
   {
    "id": "ms3-visualize",
    "kicker": "3 · Visualize",
    "title": "Search score against nested score",
    "blocks": [
     {
      "kind": "p",
      "text": "12 simulated datasets of 60 rows and 20 columns. The labels are random noise, so the true accuracy is 0.5. Each had a 20-setting SVM grid."
     },
     {
      "kind": "table",
      "caption": "Average over 12 datasets",
      "headers": [
       "Estimate",
       "Accuracy"
      ],
      "rows": [
       [
        "Best score reported by the grid search",
        "0.543"
       ],
       [
        "Nested score (search redone inside each outer fold)",
        "0.460"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The search reports 0.543 on data with nothing to find, about four points too high. The nested score, 0.460, is noisy on 60 rows but not biased upward; it is within noise of the truth, 0.5."
     }
    ]
   },
   {
    "id": "ms3-discover",
    "kicker": "4 · Discover",
    "title": "Match the folds to the use",
    "blocks": [
     {
      "kind": "p",
      "text": "If rows come in groups, inner and outer folds must both keep groups together. If the model will predict forward in time, both loops use time order. Otherwise the outer loop is still leaking the thing you are trying to measure."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Do the search inside each training fold and score on the outer fold, so the score belongs to the whole procedure."
     }
    ]
   },
   {
    "id": "ms3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, cost. 5 outer folds × 4 inner folds × 20 settings = 400 fits plus 5 refits. Nested validation costs far more than a plain search, so use it to judge a pipeline once, not on every experiment."
     },
     {
      "kind": "p",
      "text": "Example 2, the final model. After nested validation says the procedure scores well, run the search once on all development data and fit that single winner. The nested score describes that procedure."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Small datasets, where a lucky grid winner can be the difference between a good and a bad decision."
     },
     {
      "kind": "check",
      "question": "What does the outer fold do?",
      "options": [
       "Chooses the settings",
       "Scores the model without taking part in the choice",
       "Trains the final model"
      ],
      "answer": 1,
      "why": "The outer fold is held out from the search, so its score is not inflated by selection."
     }
    ]
   },
   {
    "id": "ms3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reporting the inner best score",
      "text": "That is the search score again."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Ignoring groups or time",
      "text": "Folds that leak make the nested score optimistic."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Scaling before the folds",
      "text": "Any fitted preprocessing belongs inside the loop."
     }
    ]
   },
   {
    "id": "ms3-python",
    "kicker": "7 · In Python",
    "title": "A nested search in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Search score against nested score on noise",
      "code": "import numpy as np\nfrom sklearn.svm import SVC\nfrom sklearn.model_selection import GridSearchCV, KFold\n\ngrid = {\"C\": [0.01, 0.1, 1, 10, 100], \"gamma\": [0.001, 0.01, 0.1, 1]}\nsearched, nested = [], []\nfor seed in range(12):\n    rng = np.random.default_rng(100 + seed)\n    X = rng.normal(size=(60, 20))\n    y = rng.integers(0, 2, 60)                 # labels are pure noise: honest accuracy is 0.5\n    s = GridSearchCV(SVC(), grid, cv=KFold(5, shuffle=True, random_state=1)).fit(X, y)\n    searched.append(s.best_score_)\n    scores = []\n    for tr, te in KFold(5, shuffle=True, random_state=0).split(X):\n        inner = GridSearchCV(SVC(), grid, cv=KFold(4, shuffle=True, random_state=1)).fit(X[tr], y[tr])\n        scores.append(inner.score(X[te], y[te]))\n    nested.append(np.mean(scores))\nprint(\"12 datasets whose labels are random noise (true accuracy 0.5)\")\nprint(\"average best score reported by the grid search :\", round(np.mean(searched), 3))\nprint(\"average nested score (search redone inside folds):\", round(np.mean(nested), 3))",
      "output": "12 datasets whose labels are random noise (true accuracy 0.5)\naverage best score reported by the grid search : 0.543\naverage nested score (search redone inside folds): 0.46"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Search chooses, outer folds judge. Never let one fold do both jobs."
     }
    ]
   }
  ]
 },
 {
  "title": "Rare events: imbalance, thresholds and cost",
  "minutes": 14,
  "sections": [
   {
    "id": "ms4-observe",
    "kicker": "1 · Observe",
    "title": "When the interesting class is 2 percent",
    "blocks": [
     {
      "kind": "p",
      "text": "In fraud, defect or churn data the cases you care about are rare. A model that never flags anything is right 97 percent of the time. Accuracy and ROC AUC can both look fine while the flagged list is mostly wrong."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Which metrics and cut-offs work when positives are rare?"
     }
    ]
   },
   {
    "id": "ms4-express",
    "kicker": "2 · Express",
    "title": "Precision and average precision",
    "blocks": [
     {
      "kind": "p",
      "text": "Precision is the share of flagged cases that are real. Average precision summarises precision across all cut-offs, and a random scorer gets about the base rate. Class weights make rare cases count more during fitting, which shifts scores and so changes where a cut-off of 0.5 lands."
     },
     {
      "kind": "eq",
      "lines": [
       "precision = TP ÷ flagged",
       "average precision ≈ area under the precision–recall curve",
       "random scorer ≈ base rate"
      ],
      "note": "ROC AUC ignores how rare positives are. Average precision does not."
     }
    ]
   },
   {
    "id": "ms4-visualize",
    "kicker": "3 · Visualize",
    "title": "Weights change the cut-off, not the ranking",
    "blocks": [
     {
      "kind": "p",
      "text": "20,000 simulated cases, 2.54 percent positive. Logistic regression with and without balanced class weights, 10,000 to test."
     },
     {
      "kind": "table",
      "caption": "Test results",
      "headers": [
       "Model",
       "ROC AUC",
       "Average precision",
       "Flagged at 0.5",
       "Precision at 0.5",
       "Recall at 0.5"
      ],
      "rows": [
       [
        "Plain",
        "0.867",
        "0.233",
        "19",
        "0.579",
        "0.042"
       ],
       [
        "Balanced weights",
        "0.868",
        "0.234",
        "2,264",
        "0.093",
        "0.808"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The ranking is the same: ROC AUC 0.867 against 0.868. What changed is where 0.5 falls. The plain model flags 19 cases and misses almost everyone (recall 0.042). The weighted one flags 2,264 and catches 81 percent, with 9 percent precision."
     }
    ]
   },
   {
    "id": "ms4-discover",
    "kicker": "4 · Discover",
    "title": "Choose the cut-off, not the weight",
    "blocks": [
     {
      "kind": "p",
      "text": "Average precision of 0.233 is nine times the base rate of 0.026, so the model has real signal. Even so, no cut-off gives both high precision and high recall. Pick the cut-off from the cost of a missed case and the cost of reviewing a false alarm, as in the Evaluation module."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "With rare positives, judge the ranking with average precision, then pick the cut-off from costs. Class weights shift scores, not the ranking."
     }
    ]
   },
   {
    "id": "ms4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, accuracy lies. 'Flag nobody' is 97.4 percent accurate here and finds nothing."
     },
     {
      "kind": "p",
      "text": "Example 2, review capacity. If the team can review 200 cases a day, the weighted model's 2,264 flags are far too many. Take the top 200 by score instead, ranking being the same in both models."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Fraud, defect detection, rare-disease screening and security alerts."
     },
     {
      "kind": "check",
      "question": "A model has ROC AUC 0.87 and 2 percent positives. Which metric better describes the flagged list?",
      "options": [
       "Accuracy",
       "Average precision",
       "Mean of the scores"
      ],
      "answer": 1,
      "why": "Average precision tracks how many flagged cases are real, which is what a reviewer sees."
     }
    ]
   },
   {
    "id": "ms4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting accuracy",
      "text": "The always-negative model scores 97.4 percent."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading weighted probabilities as chances",
      "text": "After class weighting, scores no longer match real frequencies. Recalibrate before using them as chances."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Resampling before splitting",
      "text": "Duplicated or synthetic rows in the test set are leaks."
     }
    ]
   },
   {
    "id": "ms4-python",
    "kicker": "7 · In Python",
    "title": "Rare events in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Class weights, average precision and cut-off effects",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import roc_auc_score, average_precision_score, precision_score, recall_score\nfrom sklearn.ensemble import RandomForestClassifier\n\nrng = np.random.default_rng(3)\nn = 20000\nX = rng.normal(size=(n, 5))\ny = (rng.random(n) < 1 / (1 + np.exp(-(-5.0 + 1.5 * X[:, 0] + 1.0 * X[:, 1])))).astype(int)    # rare: a few percent\ntr, te = slice(0, 10000), slice(10000, None)\nprint(\"positive rate:\", round(y.mean(), 4))\n\nfor name, m in [(\"plain logistic\", LogisticRegression()), (\"class_weight=balanced\", LogisticRegression(class_weight=\"balanced\"))]:\n    m.fit(X[tr], y[tr])\n    p = m.predict_proba(X[te])[:, 1]\n    flag = m.predict(X[te])\n    print(name.ljust(22), \"ROC AUC\", round(roc_auc_score(y[te], p), 3), \"| avg precision\", round(average_precision_score(y[te], p), 3),\n          \"| at 0.5: flagged\", int(flag.sum()), \"precision\", round(precision_score(y[te], flag, zero_division=0), 3), \"recall\", round(recall_score(y[te], flag), 3))\nprint(\"always-negative accuracy:\", round(1 - y[te].mean(), 3), \" | random scorer average precision would be about\", round(y[te].mean(), 3))",
      "output": "positive rate: 0.0254\nplain logistic         ROC AUC 0.867 | avg precision 0.233 | at 0.5: flagged 19 precision 0.579 recall 0.042\nclass_weight=balanced  ROC AUC 0.868 | avg precision 0.234 | at 0.5: flagged 2264 precision 0.093 recall 0.808\nalways-negative accuracy: 0.974  | random scorer average precision would be about 0.026"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The ranking did not change; the cut-off did. Know which of the two you are tuning."
     }
    ]
   }
  ]
 },
 {
  "title": "Interpret responsibly",
  "minutes": 13,
  "sections": [
   {
    "id": "ms5-observe",
    "kicker": "1 · Observe",
    "title": "What a model tells us, and what it does not",
    "blocks": [
     {
      "kind": "p",
      "text": "It is tempting to read a coefficient or an importance score as a cause or as a fixed truth about a column. Both readings go wrong when columns overlap."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What do coefficients and importance scores really say when two columns carry the same information?"
     }
    ]
   },
   {
    "id": "ms5-express",
    "kicker": "2 · Express",
    "title": "Importance means usefulness to this model",
    "blocks": [
     {
      "kind": "p",
      "text": "A coefficient is the effect of one column with the others held fixed. Permutation importance shuffles one column and measures how much held-out score drops. Both describe how this model uses the data, not what causes the outcome."
     },
     {
      "kind": "eq",
      "lines": [
       "permutation importance of column j = score(original) − score(column j shuffled)"
      ],
      "note": "If another column carries the same information, shuffling j alone costs little."
     }
    ]
   },
   {
    "id": "ms5-visualize",
    "kicker": "3 · Visualize",
    "title": "A twin column hides area",
    "blocks": [
     {
      "kind": "p",
      "text": "2,000 simulated flats. Price truly depends on area and age. Rooms is almost a copy of area, with a little noise."
     },
     {
      "kind": "table",
      "caption": "What each tool says",
      "headers": [
       "Quantity",
       "area",
       "rooms",
       "age"
      ],
      "rows": [
       [
        "Linear coefficient",
        "0.599",
        "0.005",
        "−0.525"
       ],
       [
        "Forest permutation importance (R² lost)",
        "1.335",
        "0.051",
        "0.168"
       ]
      ]
     },
     {
      "kind": "table",
      "caption": "Forest held-out R² by what it is given",
      "headers": [
       "Columns",
       "R²"
      ],
      "rows": [
       [
        "All three",
        "0.893"
       ],
       [
        "Without area",
        "0.875"
       ],
       [
        "Without rooms",
        "0.893"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Rooms looks almost unimportant (0.051), yet removing area costs only 0.018 R², because rooms stands in for it. A reader of the table alone might drop area, or rooms, without knowing the other is a twin."
     }
    ]
   },
   {
    "id": "ms5-discover",
    "kicker": "4 · Discover",
    "title": "Group twins, and keep association separate from cause",
    "blocks": [
     {
      "kind": "p",
      "text": "Check correlations among columns before reading importances, and shuffle correlated columns together. And never read an importance as 'if we change this column, the outcome will change'. A model fitted on observational data cannot tell you that."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Importance and coefficients describe how a model uses its inputs. They are not causes, and twin columns share the credit unpredictably."
     }
    ]
   },
   {
    "id": "ms5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a policy question. A model says 'rooms' hardly matters. Should the builder add rooms to raise prices? The model cannot say: rooms and area move together in the data."
     },
     {
      "kind": "p",
      "text": "Example 2, a regulator's question. For 'why was this customer rejected?', a coefficient list on correlated columns may mislead. Report the column groups and what happens to the score when a group is changed on that case."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Credit and hiring explanations, model audits and feature selection."
     },
     {
      "kind": "check",
      "question": "Two columns are near-copies. What happens to each one's permutation importance?",
      "options": [
       "Each is overstated",
       "Each is understated, since the twin covers",
       "Each is exactly right"
      ],
      "answer": 1,
      "why": "Shuffling one leaves the other to supply the signal, so the score barely drops."
     }
    ]
   },
   {
    "id": "ms5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading importance as cause",
      "text": "A column can predict without causing."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Ranking correlated columns separately",
      "text": "Group them, or the ranking depends on arbitrary details."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Explaining on training data",
      "text": "Compute importances on held-out rows, or the ranking shows what the model memorised."
     }
    ]
   },
   {
    "id": "ms5-python",
    "kicker": "7 · In Python",
    "title": "A twin column in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Coefficients, permutation importance and column removal",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression, LinearRegression\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(8)\nn = 2000\narea = rng.normal(80, 20, n)\nrooms = area / 20 + rng.normal(0, 0.15, n)         # almost a copy of area\nage = rng.normal(15, 8, n)\nprice = 0.6 * area - 0.5 * age + rng.normal(0, 4, n)   # only area and age truly matter\nX = np.column_stack([area, rooms, age])\nnames = [\"area\", \"rooms\", \"age\"]\nXtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.4, random_state=0)\n\nlin = LinearRegression().fit(Xtr, ytr)\nprint(\"linear coefficients (per 1 unit):\", {k: round(float(v), 3) for k, v in zip(names, lin.coef_)})\nrf = RandomForestRegressor(150, min_samples_leaf=5, random_state=0).fit(Xtr, ytr)\nimp = permutation_importance(rf, Xte, yte, n_repeats=10, random_state=0)\nprint(\"permutation importance (R2 lost):\", {k: round(float(v), 3) for k, v in zip(names, imp.importances_mean)})\nprint(\"forest R2 with all columns        :\", round(rf.score(Xte, yte), 3))\nfor drop, col in [(\"area\", 0), (\"rooms\", 1)]:\n    keep = [j for j in range(3) if j != col]\n    m = RandomForestRegressor(150, min_samples_leaf=5, random_state=0).fit(Xtr[:, keep], ytr)\n    print(\"forest R2 with\", drop.ljust(5), \"removed       :\", round(m.score(Xte[:, keep], yte), 3))",
      "output": "linear coefficients (per 1 unit): {'area': 0.599, 'rooms': 0.005, 'age': -0.525}\npermutation importance (R2 lost): {'area': 1.335, 'rooms': 0.051, 'age': 0.168}\nforest R2 with all columns        : 0.893\nforest R2 with area  removed       : 0.875\nforest R2 with rooms removed       : 0.893"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Look at columns in groups before you explain a model."
     }
    ]
   }
  ]
 },
 {
  "title": "A reproducible final decision",
  "minutes": 13,
  "sections": [
   {
    "id": "ms6-observe",
    "kicker": "1 · Observe",
    "title": "Could someone else get the same answer?",
    "blocks": [
     {
      "kind": "p",
      "text": "A final choice should survive being repeated. Random seeds, fold shuffles and ties between similar models all change the numbers a little. Pick a process that does not hinge on them."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we make a final model decision that someone else can reproduce, and what do we do when two models are tied?"
     }
    ]
   },
   {
    "id": "ms6-express",
    "kicker": "2 · Express",
    "title": "Fix the seed, record the setup, and respect the noise",
    "blocks": [
     {
      "kind": "p",
      "text": "Record the data version, the split rule, the seeds, the settings searched and the library versions. Then see how much the score moves with the seed. If it moves as much as the gap between candidates, that gap is not a decision."
     },
     {
      "kind": "eq",
      "lines": [
       "one-standard-error rule: pick the simplest model whose score is within one standard error of the best"
      ],
      "note": "Standard error of the mean of k folds = standard deviation of the folds ÷ √k."
     }
    ]
   },
   {
    "id": "ms6-visualize",
    "kicker": "3 · Visualize",
    "title": "The same forest, eight seeds",
    "blocks": [
     {
      "kind": "p",
      "text": "1,500 simulated customers, a forest with 100 trees, and 5-fold cross-validated AUC for eight different seeds."
     },
     {
      "kind": "table",
      "caption": "Cross-validated AUC by seed",
      "headers": [
       "Seed",
       "0",
       "1",
       "2",
       "3",
       "4",
       "5",
       "6",
       "7"
      ],
      "rows": [
       [
        "AUC",
        "0.712",
        "0.702",
        "0.700",
        "0.708",
        "0.700",
        "0.691",
        "0.710",
        "0.703"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The same model on the same data ranges from 0.691 to 0.712, a spread of 0.021. Any gap between candidates smaller than that is inside the seed noise."
     }
    ]
   },
   {
    "id": "ms6-discover",
    "kicker": "4 · Discover",
    "title": "Decide with a rule fixed in advance",
    "blocks": [
     {
      "kind": "table",
      "caption": "Logistic regression against the forest (5 folds)",
      "headers": [
       "Model",
       "Mean AUC",
       "Standard error"
      ],
      "rows": [
       [
        "Logistic regression",
        "0.677",
        "0.013"
       ],
       [
        "Forest",
        "0.715",
        "0.012"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The forest leads by 0.038, about three times either standard error and well above the seed range of 0.021. The one-standard-error rule does not allow the simpler logistic model here, so the forest is chosen. Had the gap been 0.01, logistic regression would win on simplicity."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Write the decision rule before looking at scores, and choose the simpler model unless the gap is larger than the noise."
     }
    ]
   },
   {
    "id": "ms6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a clear winner. Forest 0.715, logistic 0.677. The forest's lead is more than three times the standard error, so choose the forest and say so."
     },
     {
      "kind": "p",
      "text": "Example 2, a tie. If the forest had scored 0.690 against logistic's 0.677, the gap of 0.013 equals one standard error. The rule picks logistic: simpler, faster to explain and cheaper to maintain."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Model sign-off, retraining pipelines and any choice another team must reproduce."
     },
     {
      "kind": "check",
      "question": "Best model scores 0.80 with standard error 0.02. A simpler model scores 0.785. Which does the one-standard-error rule pick?",
      "options": [
       "The best",
       "The simpler one",
       "Neither"
      ],
      "answer": 1,
      "why": "0.785 ≥ 0.80 − 0.02 = 0.78, so the simpler model is within one standard error and wins."
     }
    ]
   },
   {
    "id": "ms6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Choosing after seeing the scores",
      "text": "Fix the rule first, or you will rationalise the winner."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Changing seeds until a model wins",
      "text": "That is a search, and it inflates the winner."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Not saving the setup",
      "text": "Without versions and seeds, the result cannot be repeated."
     }
    ]
   },
   {
    "id": "ms6-python",
    "kicker": "7 · In Python",
    "title": "Seeds and the decision rule",
    "blocks": [
     {
      "kind": "code",
      "caption": "Seed noise and the one-standard-error rule",
      "code": "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nrng = np.random.default_rng(15)\nn = 1500\nX = rng.normal(size=(n, 6))\ny = (rng.random(n) < 1 / (1 + np.exp(-(0.9 * X[:, 0] + 0.8 * X[:, 1] * X[:, 2])))).astype(int)\n\nprint(\"same forest, different random seeds, 5-fold CV AUC:\")\nvals = []\nfor seed in range(8):\n    cv = StratifiedKFold(5, shuffle=True, random_state=seed)\n    m = RandomForestClassifier(100, min_samples_leaf=5, random_state=seed)\n    vals.append(cross_val_score(m, X, y, cv=cv, scoring=\"roc_auc\").mean())\nprint(\"  \", np.round(vals, 3), \"| range\", round(max(vals) - min(vals), 3))\n\ncv = StratifiedKFold(5, shuffle=True, random_state=0)\ncands = {\"logistic\": make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),\n         \"forest\": RandomForestClassifier(200, min_samples_leaf=5, random_state=0)}\nres = {k: cross_val_score(m, X, y, cv=cv, scoring=\"roc_auc\") for k, m in cands.items()}\nfor k, s in res.items():\n    print(k.ljust(9), \"mean\", round(s.mean(), 3), \"standard error\", round(s.std(ddof=1) / np.sqrt(len(s)), 3))\nbest = max(res, key=lambda k: res[k].mean())\nse = res[best].std(ddof=1) / np.sqrt(5)\nsimple_ok = res[\"logistic\"].mean() >= res[best].mean() - se\nprint(\"pick:\", \"logistic (within one standard error of the best, and simpler)\" if simple_ok else best)",
      "output": "same forest, different random seeds, 5-fold CV AUC:\n   [0.712 0.702 0.7   0.708 0.7   0.691 0.71  0.703] | range 0.021\nlogistic  mean 0.677 standard error 0.013\nforest    mean 0.715 standard error 0.012\npick: forest"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "If a decision flips when the seed changes, it was never a decision."
     }
    ]
   }
  ]
 }
];
