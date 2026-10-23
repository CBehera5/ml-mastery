import type {DeepLesson} from "../../math/teaching/deep-read";
export const EVALUATION_DEEP:DeepLesson[]=[
 {
  "title": "Decide the moment of prediction before anything else",
  "minutes": 13,
  "sections": [
   {
    "id": "ev1-observe",
    "kicker": "1 · Observe",
    "title": "A model that peeks at the future",
    "blocks": [
     {
      "kind": "p",
      "text": "A churn model scores customers on day 0 to decide who to call. A column called refund_issued is recorded only after a customer cancels. It predicts cancellation almost perfectly, and it is useless: on day 0 it does not exist yet."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What may a model use, and how should the test rows be chosen so the score means something?"
     }
    ]
   },
   {
    "id": "ev1-express",
    "kicker": "2 · Express",
    "title": "Fix the line in time",
    "blocks": [
     {
      "kind": "p",
      "text": "Write down when the prediction is made and what is known at that moment. A column is eligible only if it was already recorded before that time. Then decide what kind of stranger the test rows must be: new rows, new customers, or a later period."
     },
     {
      "kind": "eq",
      "lines": [
       "eligible feature ⇔ recorded before the prediction moment",
       "test rows must be as unfamiliar as the rows you will really score"
      ],
      "note": "Row split for new rows, group split for new customers, time split for the future."
     }
    ]
   },
   {
    "id": "ev1-visualize",
    "kicker": "3 · Visualize",
    "title": "Two leaks, measured",
    "blocks": [
     {
      "kind": "p",
      "text": "A simulated telecom: 400 customers, 5 monthly rows each."
     },
     {
      "kind": "table",
      "caption": "Test AUC under different set-ups",
      "headers": [
       "Set-up",
       "AUC"
      ],
      "rows": [
       [
        "Honest usage feature only",
        "0.622"
       ],
       [
        "Add a refund column known only after cancelling",
        "1.000"
       ],
       [
        "Forest with a customer-specific column, row split (same customers in train and test)",
        "0.607"
       ],
       [
        "Same forest, group split (new customers in test)",
        "0.525"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The refund column turns a weak model into a perfect one that cannot be used. And the customer-specific column lets the forest recognise a customer it saw in training. Separate the customers and the apparent skill nearly disappears."
     }
    ]
   },
   {
    "id": "ev1-discover",
    "kicker": "4 · Discover",
    "title": "Why the group split is the honest one",
    "blocks": [
     {
      "kind": "p",
      "text": "Rows from one customer look alike, so a random row split puts near-copies of each test row into training. The model scores well by remembering, not by learning a pattern that carries to someone new. If you will score new customers, test on new customers."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Say when the prediction happens, use only what exists then, and split so the test rows are as unfamiliar as real future rows."
     }
    ]
   },
   {
    "id": "ev1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a time check. A column 'support tickets in the last 30 days' recorded at day 0 is fine. 'Support tickets in days 1 to 30' is the future and is not."
     },
     {
      "kind": "p",
      "text": "Example 2, a group check. 400 customers with 5 rows each give 2,000 rows, but only 400 independent customers. A 50 percent group split leaves about 200 customers to test on, not 1,000. The honest uncertainty is wider than the row count suggests."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Churn, credit, fraud and any model that will score people or accounts it has not seen before."
     },
     {
      "kind": "check",
      "question": "A model will score brand-new customers. Which split is right?",
      "options": [
       "A random split of rows",
       "A split that keeps each customer on one side",
       "Test on the training rows"
      ],
      "answer": 1,
      "why": "New customers are strangers. Keeping each customer on one side of the split imitates that."
     }
    ]
   },
   {
    "id": "ev1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · A feature recorded after the outcome",
      "text": "Strong results from one column deserve suspicion. Ask when it is written."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Repeated rows in both halves",
      "text": "Many rows per customer, store or document family make a random split optimistic."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Splitting after preprocessing",
      "text": "Anything learned from all rows before the split, such as scaling or target encoding, has seen the test."
     }
    ]
   },
   {
    "id": "ev1-python",
    "kicker": "7 · In Python",
    "title": "Leaks and splits in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "A leaky column and a group split",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split, GroupShuffleSplit\nfrom sklearn.metrics import roc_auc_score\n\nrng = np.random.default_rng(11)\nn_cust, per = 400, 5                                   # 400 customers, 5 monthly rows each\ncust = np.repeat(np.arange(n_cust), per)\ntrait = np.repeat(rng.normal(size=n_cust), per)        # a customer-level quirk, the same in every row\ncancel = np.repeat((rng.random(n_cust) < 1 / (1 + np.exp(-(0.3 * rng.normal(size=n_cust))))).astype(int), per)\nusage = rng.normal(size=n_cust * per) + 0.4 * cancel   # a weak real signal\nX_honest = np.column_stack([usage])\nrefund = cancel + rng.normal(0, 0.1, n_cust * per)     # recorded AFTER the customer cancels\nX_leaky = np.column_stack([usage, refund])\n\ndef auc(X, tr, te):\n    m = LogisticRegression(max_iter=1000).fit(X[tr], cancel[tr])\n    return round(roc_auc_score(cancel[te], m.predict_proba(X[te])[:, 1]), 3)\n\nidx = rng.permutation(len(cancel))\ntr, te = idx[:1000], idx[1000:]\nprint(\"honest feature      AUC\", auc(X_honest, tr, te))\nprint(\"with refund column  AUC\", auc(X_leaky, tr, te), \"<- the refund is only known after cancelling\")\n\n# same customer in train and test vs separated customers, with a customer-id style feature\nX_id = np.column_stack([usage, trait * 3 + rng.normal(0, 0.05, len(trait))])\nfrom sklearn.ensemble import RandomForestClassifier\ndef rf_auc(tr, te):\n    m = RandomForestClassifier(n_estimators=100, min_samples_leaf=1, random_state=0).fit(X_id[tr], cancel[tr])\n    return round(roc_auc_score(cancel[te], m.predict_proba(X_id[te])[:, 1]), 3)\nprint(\"row split, same customers on both sides   AUC\", rf_auc(tr, te))\ng_tr, g_te = next(GroupShuffleSplit(n_splits=1, test_size=0.5, random_state=0).split(X_id, cancel, groups=cust))\nprint(\"group split, new customers in the test    AUC\", rf_auc(g_tr, g_te))",
      "output": "honest feature      AUC 0.622\nwith refund column  AUC 1.0 <- the refund is only known after cancelling\nrow split, same customers on both sides   AUC 0.607\ngroup split, new customers in the test    AUC 0.525"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "An impossibly good score is more often a leak than a breakthrough."
     }
    ]
   }
  ]
 },
 {
  "title": "How well will it do on new data?",
  "minutes": 13,
  "sections": [
   {
    "id": "ev2-observe",
    "kicker": "1 · Observe",
    "title": "One split gives one number, and numbers wobble",
    "blocks": [
     {
      "kind": "p",
      "text": "You train a model, test it once, and get 0.73. If someone else reshuffled the rows, they might get 0.67 or 0.83. A single test number carries luck in it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do you estimate performance on new data, and how much should you trust one figure?"
     }
    ]
   },
   {
    "id": "ev2-express",
    "kicker": "2 · Express",
    "title": "Generalisation and cross-validation",
    "blocks": [
     {
      "kind": "p",
      "text": "Training error measures memory. Generalisation error is the error on new draws from the same source. We estimate it on rows the model did not train on. Cross-validation repeats this k times, each time holding out a different fifth, and averages."
     },
     {
      "kind": "eq",
      "lines": [
       "CV estimate = mean of the k held-out scores",
       "spread of the k scores tells you how unsettled the estimate is"
      ],
      "note": "Every row is held out exactly once."
     }
    ]
   },
   {
    "id": "ev2-visualize",
    "kicker": "3 · Visualize",
    "title": "Twenty splits of the same data",
    "blocks": [
     {
      "kind": "p",
      "text": "300 simulated rows, a logistic model, 70/30 splits drawn 20 times with different seeds."
     },
     {
      "kind": "table",
      "caption": "Test accuracy across 20 splits",
      "headers": [
       "Minimum",
       "Maximum",
       "Mean",
       "Standard deviation"
      ],
      "rows": [
       [
        "0.667",
        "0.833",
        "0.727",
        "0.039"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The same model on the same data scores anywhere from 0.667 to 0.833, depending on which rows landed in the test set. A single split could mislead by eight points either way."
     }
    ]
   },
   {
    "id": "ev2-discover",
    "kicker": "4 · Discover",
    "title": "Training score hides overfit",
    "blocks": [
     {
      "kind": "table",
      "caption": "Training against 5-fold cross-validation",
      "headers": [
       "Model",
       "Train accuracy",
       "5-fold CV mean"
      ],
      "rows": [
       [
        "Logistic regression",
        "0.747",
        "0.723"
       ],
       [
        "Unlimited tree",
        "1.000",
        "0.663"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The tree is perfect on rows it has seen and 33.7 points worse on new ones. Logistic regression loses only 2.4 points. The gap, not the training score, shows how much a model memorised."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Estimate performance on held-out rows, repeat it to see the spread, and trust the gap between training and held-out scores."
     }
    ]
   },
   {
    "id": "ev2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, reading folds. The logistic folds scored 0.68, 0.70, 0.67, 0.75 and 0.82: mean 0.723 but a range of 0.15. Report 0.72 with a note that single folds vary widely."
     },
     {
      "kind": "p",
      "text": "Example 2, a comparison. If model B scores 0.73 and model A 0.72 on one split, the 0.01 gap is far smaller than the 0.039 standard deviation across splits. It is not evidence that B is better."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every model comparison, A/B ranking of models, and promotion decision from development to production."
     },
     {
      "kind": "check",
      "question": "Two models differ by 0.01 in accuracy, and the split-to-split standard deviation is 0.04. What do you conclude?",
      "options": [
       "The better one clearly wins",
       "The difference is within noise",
       "Accuracy is a bad metric"
      ],
      "answer": 1,
      "why": "A gap a quarter of the size of the usual wobble is not a reliable difference."
     }
    ]
   },
   {
    "id": "ev2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reporting the best of many splits",
      "text": "Picking the luckiest split overstates performance."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Shuffling time-ordered data in folds",
      "text": "Use forward-chaining splits when the future must stay in the test."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Treating the training score as the result",
      "text": "It shows capacity to memorise, not skill on new rows."
     }
    ]
   },
   {
    "id": "ev2-python",
    "kicker": "7 · In Python",
    "title": "Spread and the train-test gap",
    "blocks": [
     {
      "kind": "code",
      "caption": "Twenty splits, and a training score against cross-validation",
      "code": "import numpy as np\nfrom sklearn.model_selection import train_test_split, cross_val_score, KFold\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.linear_model import LogisticRegression\n\nrng = np.random.default_rng(2)\nn = 300\nX = rng.normal(size=(n, 6))\ny = (X[:, 0] + 0.6 * X[:, 1] + rng.normal(0, 1.2, n) > 0).astype(int)\n\nprint(\"20 different 70/30 splits, logistic regression, test accuracy:\")\nscores = []\nfor seed in range(20):\n    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=seed)\n    scores.append(LogisticRegression().fit(Xtr, ytr).score(Xte, yte))\nprint(\"  min\", round(min(scores), 3), \" max\", round(max(scores), 3), \" mean\", round(np.mean(scores), 3), \" sd\", round(np.std(scores), 3))\n\ncv = KFold(5, shuffle=True, random_state=0)\nfor name, m in [(\"logistic regression\", LogisticRegression()), (\"unlimited tree\", DecisionTreeClassifier(random_state=0))]:\n    s = cross_val_score(m, X, y, cv=cv)\n    train = m.fit(X, y).score(X, y)\n    print(name.ljust(20), \"train acc\", round(train, 3), \"| 5-fold CV mean\", round(s.mean(), 3), \"folds\", np.round(s, 2))",
      "output": "20 different 70/30 splits, logistic regression, test accuracy:\n  min 0.667  max 0.833  mean 0.727  sd 0.039\nlogistic regression  train acc 0.747 | 5-fold CV mean 0.723 folds [0.68 0.7  0.67 0.75 0.82]\nunlimited tree       train acc 1.0 | 5-fold CV mean 0.663 folds [0.65 0.62 0.6  0.77 0.68]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Report an estimate with its spread, not a single score."
     }
    ]
   }
  ]
 },
 {
  "title": "Decisions have costs: pick the threshold",
  "minutes": 14,
  "sections": [
   {
    "id": "ev3-observe",
    "kicker": "1 · Observe",
    "title": "Accuracy is a poor guide when one class is rare",
    "blocks": [
     {
      "kind": "p",
      "text": "About 16 percent of customers in our test set churn. A model that says nobody churns is right 84 percent of the time and is worthless. What matters is what the decision costs and saves."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do you pick the cut-off for 'call this customer', and why not use 0.5?"
     }
    ]
   },
   {
    "id": "ev3-express",
    "kicker": "2 · Express",
    "title": "Confusion counts and costs",
    "blocks": [
     {
      "kind": "p",
      "text": "A cut-off t turns each predicted chance into a call or no call. Precision is the share of calls that reach someone who would leave. Recall is the share of leavers reached. Attach rupees to each outcome and the best cut-off follows."
     },
     {
      "kind": "eq",
      "lines": [
       "precision = TP ÷ (TP + FP)",
       "recall = TP ÷ (TP + FN)",
       "net value = TP × (saved fraction × loss) − calls × call cost"
      ],
      "note": "Here a call costs ₹200, a lost customer costs ₹3,000, and a call saves half of those who would have left."
     }
    ]
   },
   {
    "id": "ev3-visualize",
    "kicker": "3 · Visualize",
    "title": "Sweeping the threshold",
    "blocks": [
     {
      "kind": "p",
      "text": "2,000 test customers, 314 of whom churn. A logistic model gives each a chance."
     },
     {
      "kind": "table",
      "caption": "Net value by cut-off",
      "headers": [
       "Cut-off",
       "Calls",
       "Precision",
       "Recall",
       "Net ₹"
      ],
      "rows": [
       [
        "0.50",
        "147",
        "0.653",
        "0.306",
        "1,14,600"
       ],
       [
        "0.30",
        "374",
        "0.425",
        "0.506",
        "1,63,700"
       ],
       [
        "0.20",
        "602",
        "0.344",
        "0.659",
        "1,90,100"
       ],
       [
        "0.15",
        "784",
        "0.307",
        "0.768",
        "2,04,700"
       ],
       [
        "0.10",
        "1,013",
        "0.265",
        "0.854",
        "1,99,400"
       ],
       [
        "0.05",
        "1,432",
        "0.209",
        "0.952",
        "1,62,100"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The default 0.5 earns ₹1.15 lakh. The best cut-off, 0.15, earns ₹2.05 lakh, 79 percent more, by calling five times as many people."
     }
    ]
   },
   {
    "id": "ev3-discover",
    "kicker": "4 · Discover",
    "title": "The cost ratio sets the cut-off",
    "blocks": [
     {
      "kind": "p",
      "text": "When a miss costs far more than a false alarm, the best cut-off drops well below 0.5. If the numbers change, say the call becomes cheaper or the save rate improves, the best cut-off moves. Choose it from stated costs on validation data, and write the costs down."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Pick the cut-off from the cost of each kind of mistake, not from a habit of 0.5."
     }
    ]
   },
   {
    "id": "ev3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the best row. At a cut-off of 0.15: 784 calls cost 784 × 200 = ₹1,56,800. About 0.768 × 314 ≈ 241 churners reached, half saved = 120.5 customers × ₹3,000 = ₹3,61,500. Net = ₹2,04,700."
     },
     {
      "kind": "p",
      "text": "Example 2, a different business. If a call costs ₹1,000 and the saved customer is worth ₹3,000, the same calls cost five times more, and the best cut-off moves higher. The model is unchanged; the decision is not."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Fraud review queues, retention campaigns, medical screening and loan approval, anywhere a mistake has a price."
     },
     {
      "kind": "check",
      "question": "A false alarm is cheap and a miss is expensive. How should the cut-off compare with 0.5?",
      "options": [
       "Higher",
       "Lower",
       "The same"
      ],
      "answer": 1,
      "why": "Cheap false alarms mean you flag more, so you lower the cut-off."
     }
    ]
   },
   {
    "id": "ev3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Using accuracy on rare classes",
      "text": "A model that never flags anyone can score 84 percent."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Choosing the cut-off on the test set",
      "text": "Pick it on validation data, then score once on the test."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Ignoring capacity",
      "text": "A call team that can make 500 calls a day cannot use a cut-off that flags 1,000."
     }
    ]
   },
   {
    "id": "ev3-python",
    "kicker": "7 · In Python",
    "title": "Costs in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Precision, recall and net rupees across thresholds",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import confusion_matrix, precision_score, recall_score\n\nrng = np.random.default_rng(9)\nn = 4000\nX = rng.normal(size=(n, 3))\ny = (rng.random(n) < 1 / (1 + np.exp(-(-2.2 + 1.2 * X[:, 0] + 0.8 * X[:, 1])))).astype(int)    # about 12% churn\ntr, te = slice(0, 2000), slice(2000, None)\np = LogisticRegression().fit(X[tr], y[tr]).predict_proba(X[te])[:, 1]\nyt = y[te]\nprint(\"churn rate in test:\", round(yt.mean(), 3), \"| 'nobody churns' accuracy:\", round(1 - yt.mean(), 3))\n\n# a retention call costs 200 rupees; a lost customer costs 3000 rupees; a call saves half of those who would leave\nCALL, LOSS, SAVE = 200, 3000, 0.5\nprint(\"threshold | calls | precision | recall | net rupees\")\nfor t in [0.5, 0.3, 0.2, 0.15, 0.1, 0.05]:\n    flag = p >= t\n    tp = int((flag & (yt == 1)).sum())\n    net = tp * SAVE * LOSS - flag.sum() * CALL\n    print(str(t).ljust(9), \"|\", str(int(flag.sum())).rjust(5), \"|\", str(round(precision_score(yt, flag, zero_division=0), 3)).ljust(9), \"|\", round(recall_score(yt, flag), 3), \"|\", int(net))",
      "output": "churn rate in test: 0.157 | 'nobody churns' accuracy: 0.843\nthreshold | calls | precision | recall | net rupees\n0.5       |   147 | 0.653     | 0.306 | 114600\n0.3       |   374 | 0.425     | 0.506 | 163700\n0.2       |   602 | 0.344     | 0.659 | 190100\n0.15      |   784 | 0.307     | 0.768 | 204700\n0.1       |  1013 | 0.265     | 0.854 | 199400\n0.05      |  1432 | 0.209     | 0.952 | 162100"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The best threshold depends on the business, so the model is only half of the decision."
     }
    ]
   }
  ]
 },
 {
  "title": "A good ranking is not a good probability",
  "minutes": 13,
  "sections": [
   {
    "id": "ev4-observe",
    "kicker": "1 · Observe",
    "title": "Two different jobs",
    "blocks": [
     {
      "kind": "p",
      "text": "A model can put customers in the right order and still give chances that are far off. Ranking is enough to pick the top 100 to call. You need real probabilities to say 'expected loss is ₹4.2 lakh' or to compare against a fixed cost."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How can we tell ranking quality from probability quality, and when does each matter?"
     }
    ]
   },
   {
    "id": "ev4-express",
    "kicker": "2 · Express",
    "title": "Metrics for each job",
    "blocks": [
     {
      "kind": "p",
      "text": "AUC measures ranking: the chance a random leaver is scored above a random stayer. Log loss and the Brier score measure the probabilities themselves. A calibration table compares what the model said with what happened."
     },
     {
      "kind": "eq",
      "lines": [
       "AUC depends only on the order of scores",
       "log loss = −mean[ y log p + (1 − y) log(1 − p) ]",
       "Brier = mean (p − y)²"
      ],
      "note": "Any strictly increasing change to the scores leaves AUC unchanged."
     }
    ]
   },
   {
    "id": "ev4-visualize",
    "kicker": "3 · Visualize",
    "title": "Same order, worse probabilities",
    "blocks": [
     {
      "kind": "p",
      "text": "A logistic model on 3,000 test customers. Then cube every probability. The order of customers does not change."
     },
     {
      "kind": "table",
      "caption": "Honest against cubed probabilities",
      "headers": [
       "Version",
       "AUC",
       "Log loss",
       "Brier",
       "Mean predicted",
       "Actual rate"
      ],
      "rows": [
       [
        "Honest",
        "0.786",
        "0.514",
        "0.171",
        "0.331",
        "0.326"
       ],
       [
        "Cubed (p³)",
        "0.786",
        "0.886",
        "0.243",
        "0.086",
        "0.326"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "AUC is identical. Log loss is 72 percent worse, and the cubed model predicts an average churn of 8.6 percent when the real rate is 32.6 percent."
     }
    ]
   },
   {
    "id": "ev4-discover",
    "kicker": "4 · Discover",
    "title": "Calibration by fifths",
    "blocks": [
     {
      "kind": "p",
      "text": "Sort customers by predicted chance, cut into five equal groups, and compare the mean prediction with the real rate in each. In our honest model the groups said 8.2, 18.5, 29.7, 43.0 and 66.1 percent, and 6.8, 16.2, 27.3, 44.7 and 67.8 percent actually churned. They line up."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "AUC checks the order of customers; log loss and calibration check whether the numbers can be taken as chances."
     }
    ]
   },
   {
    "id": "ev4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a top-100 list. The team calls the 100 highest-scored customers. Only order matters, so AUC and precision at 100 are the right measures."
     },
     {
      "kind": "p",
      "text": "Example 2, a budget. Finance multiplies each customer's chance by ₹3,000 to forecast loss. The cubed model forecasts about a quarter of the true loss (8.6 against 32.6 percent), even though its AUC is unchanged."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Credit pricing, insurance reserves and any use that multiplies a probability by money."
     },
     {
      "kind": "check",
      "question": "A change leaves every customer's rank unchanged. What happens to AUC?",
      "options": [
       "It rises",
       "It falls",
       "It stays the same"
      ],
      "answer": 2,
      "why": "AUC only looks at the order of scores, so any order-preserving change leaves it unchanged."
     }
    ]
   },
   {
    "id": "ev4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reporting only AUC",
      "text": "It says nothing about whether 0.3 means 30 percent."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Calibrating on the test set",
      "text": "Calibrate on validation data, then check on fresh rows."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Assuming a model is calibrated",
      "text": "Many models, such as forests and SVMs, give scores that need calibration before use as chances."
     }
    ]
   },
   {
    "id": "ev4-python",
    "kicker": "7 · In Python",
    "title": "Order against calibration",
    "blocks": [
     {
      "kind": "code",
      "caption": "AUC, log loss, Brier and calibration",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import roc_auc_score, log_loss, brier_score_loss\n\nrng = np.random.default_rng(14)\nn = 6000\nX = rng.normal(size=(n, 3))\ny = (rng.random(n) < 1 / (1 + np.exp(-(-1.0 + 1.1 * X[:, 0] - 0.7 * X[:, 1])))).astype(int)\ntr, te = slice(0, 3000), slice(3000, None)\np = LogisticRegression().fit(X[tr], y[tr]).predict_proba(X[te])[:, 1]\nyt = y[te]\n\n# a monotone squeeze keeps the order of customers, so AUC cannot change\nsqueezed = p ** 3\nprint(\"                 AUC    log loss  Brier   mean predicted vs actual rate\")\nfor name, q in [(\"honest\", p), (\"squeezed (p^3)\", squeezed)]:\n    print(name.ljust(16), round(roc_auc_score(yt, q), 3), \" \", round(log_loss(yt, np.clip(q, 1e-6, 1 - 1e-6)), 3), \"  \", round(brier_score_loss(yt, q), 3), \"  \", round(q.mean(), 3), \"vs\", round(yt.mean(), 3))\n\nbins = np.quantile(p, [0, .2, .4, .6, .8, 1])\nprint(\"calibration of the honest model by fifths:\")\nfor lo, hi in zip(bins[:-1], bins[1:]):\n    m = (p >= lo) & (p <= hi)\n    print(\"  said\", round(p[m].mean(), 3), \" happened\", round(yt[m].mean(), 3))",
      "output": "AUC    log loss  Brier   mean predicted vs actual rate\nhonest           0.786   0.514    0.171    0.331 vs 0.326\nsqueezed (p^3)   0.786   0.886    0.243    0.086 vs 0.326\ncalibration of the honest model by fifths:\n  said 0.082  happened 0.068\n  said 0.185  happened 0.162\n  said 0.297  happened 0.273\n  said 0.43  happened 0.447\n  said 0.661  happened 0.678"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Match the metric to the job: AUC for ranking, log loss and calibration for chances."
     }
    ]
   }
  ]
 },
 {
  "title": "Bias, variance and how sure we can be",
  "minutes": 14,
  "sections": [
   {
    "id": "ev5-observe",
    "kicker": "1 · Observe",
    "title": "Two ways to be wrong",
    "blocks": [
     {
      "kind": "p",
      "text": "A model that is too simple misses real patterns: that is bias. A model that is too flexible chases noise: that is variance. You see variance when the model changes a lot if the training sample changes a little."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How can we see variance directly, and how uncertain is one test score?"
     }
    ]
   },
   {
    "id": "ev5-express",
    "kicker": "2 · Express",
    "title": "Refit many times",
    "blocks": [
     {
      "kind": "p",
      "text": "Draw a bootstrap sample of the training rows, refit, predict the same test rows, repeat. If predictions for a row flip between refits, the model is unstable there. The average standard deviation of predictions is a direct variance gauge."
     },
     {
      "kind": "eq",
      "lines": [
       "test error ≈ bias² + variance + noise"
      ],
      "note": "Depth, number of columns and regularisation move you between the two."
     }
    ]
   },
   {
    "id": "ev5-visualize",
    "kicker": "3 · Visualize",
    "title": "A depth sweep",
    "blocks": [
     {
      "kind": "p",
      "text": "600 simulated rows, 300 for training and 300 to test. Decision trees of increasing depth, each refit on 30 bootstrap samples."
     },
     {
      "kind": "table",
      "caption": "Tree depth against error and instability",
      "headers": [
       "Depth",
       "Train accuracy",
       "Test accuracy",
       "Prediction spread"
      ],
      "rows": [
       [
        "1",
        "0.713",
        "0.700",
        "0.134"
       ],
       [
        "2",
        "0.777",
        "0.753",
        "0.150"
       ],
       [
        "4",
        "0.857",
        "0.787",
        "0.226"
       ],
       [
        "8",
        "0.950",
        "0.717",
        "0.336"
       ],
       [
        "Unlimited",
        "1.000",
        "0.713",
        "0.326"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Test accuracy peaks at depth 4 (0.787). Deeper trees train better and test worse, and their predictions move more than twice as much between refits (spread 0.336 against 0.134 at depth 1)."
     }
    ]
   },
   {
    "id": "ev5-discover",
    "kicker": "4 · Discover",
    "title": "A number needs an interval",
    "blocks": [
     {
      "kind": "p",
      "text": "The depth-2 tree scored 0.753 on 300 test rows. Resampling those rows gives a 95 percent interval of about 0.70 to 0.80. The difference between depth 2 (0.753) and depth 4 (0.787) is inside that interval, so the ranking of those two depths is not secure."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Watch both the average error and how much predictions move between refits, and give every score an interval."
     }
    ]
   },
   {
    "id": "ev5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, choosing depth. A shallow tree has high bias: it scores 0.700 on both train and test. The deepest tree has high variance: 1.000 on train and 0.713 on test."
     },
     {
      "kind": "p",
      "text": "Example 2, stability. At depth 8 the prediction spread across refits is 0.336, against 0.134 for a depth-1 stump. Expect some customers to flip between approved and rejected after a retrain, and tell the audit team before they notice."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Model governance, where stability between retrains matters as much as the headline accuracy."
     },
     {
      "kind": "check",
      "question": "Training accuracy is 1.000 and test accuracy is 0.713 for an unlimited tree. What is the main problem?",
      "options": [
       "High bias",
       "High variance",
       "Too little data in test"
      ],
      "answer": 1,
      "why": "A perfect fit on training that fails on new rows means the model chased noise."
     }
    ]
   },
   {
    "id": "ev5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading small gaps as real",
      "text": "With 300 test rows, the 95 percent interval is about ±5 points."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Fixing variance with more flexibility",
      "text": "That makes it worse. Regularise, prune or average."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Fixing bias with more data alone",
      "text": "A model that cannot represent the pattern will not learn it from more rows. Add features or capacity."
     }
    ]
   },
   {
    "id": "ev5-python",
    "kicker": "7 · In Python",
    "title": "Instability and an interval",
    "blocks": [
     {
      "kind": "code",
      "caption": "Depth sweep with bootstrap refits, and an interval for one score",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(21)\nn = 600\nX = rng.normal(size=(n, 4))\ny = (X[:, 0] + X[:, 1] ** 2 - 1 + rng.normal(0, 1.0, n) > 0).astype(int)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.5, random_state=0)\n\nprint(\"tree depth | train acc | test acc | prediction spread across 30 bootstrap refits\")\nfor depth in [1, 2, 4, 8, None]:\n    preds = []\n    for b in range(30):\n        i = rng.integers(0, len(Xtr), len(Xtr))\n        preds.append(DecisionTreeClassifier(max_depth=depth, random_state=0).fit(Xtr[i], ytr[i]).predict(Xte))\n    spread = np.mean(np.std(preds, axis=0))\n    m = DecisionTreeClassifier(max_depth=depth, random_state=0).fit(Xtr, ytr)\n    print(str(depth).ljust(10), \"|\", round(m.score(Xtr, ytr), 3), \"    |\", round(m.score(Xte, yte), 3), \"   |\", round(spread, 3))\n\n# how uncertain is one test accuracy?\nm = DecisionTreeClassifier(max_depth=2, random_state=0).fit(Xtr, ytr)\ncorrect = (m.predict(Xte) == yte).astype(float)\nboots = [rng.choice(correct, len(correct)).mean() for _ in range(2000)]\nprint(\"depth-2 test accuracy\", round(correct.mean(), 3), \"| 95% interval from bootstrap\", np.round(np.percentile(boots, [2.5, 97.5]), 3))",
      "output": "tree depth | train acc | test acc | prediction spread across 30 bootstrap refits\n1          | 0.713     | 0.7    | 0.134\n2          | 0.777     | 0.753    | 0.15\n4          | 0.857     | 0.787    | 0.226\n8          | 0.95     | 0.717    | 0.336\nNone       | 1.0     | 0.713    | 0.326\ndepth-2 test accuracy 0.753 | 95% interval from bootstrap [0.7 0.8]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Look at both the error and the movement. Quote an interval, not a point."
     }
    ]
   }
  ]
 },
 {
  "title": "An honest report, from start to finish",
  "minutes": 14,
  "sections": [
   {
    "id": "ev6-observe",
    "kicker": "1 · Observe",
    "title": "Everything together",
    "blocks": [
     {
      "kind": "p",
      "text": "Evaluation is not one step at the end. It is a set of habits from the first split to the final sentence you write. A report is honest when someone else could repeat it and get the same story."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does a trustworthy evaluation look like from start to finish?"
     }
    ]
   },
   {
    "id": "ev6-express",
    "kicker": "2 · Express",
    "title": "The recipe",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "State the prediction moment and the unit being scored.",
       "Split off a test set first, and put it away.",
       "Compare candidate models on the development set with cross-validation, with a simple baseline included.",
       "Choose a model and settings using only development data.",
       "Fit the chosen model on the full development set.",
       "Score the test set once and report an interval.",
       "Write down what was tried, the costs behind any cut-off, and the limits."
      ]
     },
     {
      "kind": "eq",
      "lines": [
       "develop on development rows → choose → score the test once"
      ],
      "note": "Looking at the test score and changing the model turns the test into more development data."
     }
    ]
   },
   {
    "id": "ev6-visualize",
    "kicker": "3 · Visualize",
    "title": "The race on one dataset",
    "blocks": [
     {
      "kind": "p",
      "text": "3,000 simulated customers; 2,250 for development and 750 for the final test. Three models compared with 5-fold cross-validation on the development rows."
     },
     {
      "kind": "table",
      "caption": "Development results (AUC, mean ± standard deviation)",
      "headers": [
       "Model",
       "CV AUC"
      ],
      "rows": [
       [
        "Logistic regression",
        "0.759 ± 0.020"
       ],
       [
        "Random forest",
        "0.756 ± 0.025"
       ],
       [
        "Gradient boosting",
        "0.754 ± 0.024"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The three are inside each other's noise, so the simplest model, logistic regression, is chosen. It was then scored once on the test rows: AUC 0.743, with a 95 percent interval of 0.708 to 0.776. The baseline of always predicting the majority class gets accuracy 0.555."
     }
    ]
   },
   {
    "id": "ev6-discover",
    "kicker": "4 · Discover",
    "title": "What a good report says",
    "blocks": [
     {
      "kind": "p",
      "text": "It names the prediction moment and the split. It gives the test score with an interval and the baseline next to it. It says what was tried and why this model was chosen. It says the cut-off and the cost assumptions behind it. And it names what the test does not tell us, such as drift after deployment."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "An honest evaluation is a process that was fixed before the final score was seen."
     }
    ]
   },
   {
    "id": "ev6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, reading the results. Development 0.759, test 0.743: a 0.016 drop. That is well inside the fold-to-fold spread of 0.020, so nothing surprising has happened."
     },
     {
      "kind": "p",
      "text": "Example 2, a red flag. If the test AUC were 0.90 while development gave 0.76, suspect a leak or a mismatch between the two sets, not good luck."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Any model going to review: the report is what a colleague or auditor uses to decide whether to trust it."
     },
     {
      "kind": "check",
      "question": "You compared five models and the best scored 0.81 on the test set. You then tweak it and rescore. What is wrong?",
      "options": [
       "Nothing",
       "The test set is now part of development",
       "Five models is too few"
      ],
      "answer": 1,
      "why": "Choosing and tweaking after seeing test scores makes the test score optimistic."
     }
    ]
   },
   {
    "id": "ev6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Peeking at the test",
      "text": "Every look and adjustment moves the test into development."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · No baseline",
      "text": "A score means nothing without the simplest alternative beside it."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reporting only the winner",
      "text": "Say how many models and settings were tried."
     }
    ]
   },
   {
    "id": "ev6-python",
    "kicker": "7 · In Python",
    "title": "The whole workflow",
    "blocks": [
     {
      "kind": "code",
      "caption": "Cross-validated race, one final test score and an interval",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold\nfrom sklearn.metrics import roc_auc_score\n\nrng = np.random.default_rng(33)\nn = 3000\nX = rng.normal(size=(n, 6))\nlogit = 0.9 * X[:, 0] + 1.2 * (X[:, 1] > 0) * (X[:, 2] > 0) - 0.7 * X[:, 3]\ny = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)\nXdev, Xtest, ydev, ytest = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\n\ncv = StratifiedKFold(5, shuffle=True, random_state=0)\nmodels = {\n    \"logistic regression\": LogisticRegression(max_iter=1000),\n    \"random forest\": RandomForestClassifier(n_estimators=200, min_samples_leaf=5, random_state=0),\n    \"gradient boosting\": GradientBoostingClassifier(n_estimators=150, learning_rate=0.05, max_depth=3, random_state=0),\n}\nprint(\"development set only (5-fold CV AUC):\")\ncvm = {}\nfor name, m in models.items():\n    s = cross_val_score(m, Xdev, ydev, cv=cv, scoring=\"roc_auc\")\n    cvm[name] = s.mean()\n    print(\" \", name.ljust(20), round(s.mean(), 3), \"+-\", round(s.std(), 3))\nbest = max(cvm, key=cvm.get)\nfinal = models[best].fit(Xdev, ydev)\nauc = roc_auc_score(ytest, final.predict_proba(Xtest)[:, 1])\nboots = []\nfor _ in range(1000):\n    i = rng.integers(0, len(ytest), len(ytest))\n    if len(set(ytest[i])) == 2:\n        boots.append(roc_auc_score(ytest[i], final.predict_proba(Xtest[i])[:, 1]))\nprint(\"chosen:\", best, \"| test AUC, scored once:\", round(auc, 3), \"| 95% interval\", np.round(np.percentile(boots, [2.5, 97.5]), 3))\nprint(\"baseline to beat: always predict the majority class, accuracy\", round(max(ytest.mean(), 1 - ytest.mean()), 3))",
      "output": "development set only (5-fold CV AUC):\n  logistic regression  0.759 +- 0.02\n  random forest        0.756 +- 0.025\n  gradient boosting    0.754 +- 0.024\nchosen: logistic regression | test AUC, scored once: 0.743 | 95% interval [0.708 0.776]\nbaseline to beat: always predict the majority class, accuracy 0.555"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Decide the process first, then look at the numbers."
     }
    ]
   }
  ]
 }
];
