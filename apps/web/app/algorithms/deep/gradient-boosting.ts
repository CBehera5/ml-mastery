import type {DeepLesson} from "../../math/teaching/deep-read";
export const GRADIENT_BOOSTING_DEEP:DeepLesson[]=[
 {
  "title": "Fix the mistakes, one small tree at a time",
  "minutes": 13,
  "sections": [
   {
    "id": "gb1-observe",
    "kicker": "1 · Observe",
    "title": "A forest asks together, boosting asks in turn",
    "blocks": [
     {
      "kind": "p",
      "text": "A forest grows many trees side by side and averages them. Boosting does something different. It builds one small tree, checks where that tree is still wrong, and then builds the next tree to work only on those leftover errors. The trees are a relay team, not a crowd."
     },
     {
      "kind": "p",
      "text": "Think of a tutor marking your practice paper. The first pass gets most questions right. The tutor then drafts a short sheet only on what you got wrong, and the next sheet only on what is still wrong after that."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "If each tree is tiny, how can a pile of them become a strong model, and why add only a fraction of each?"
     }
    ]
   },
   {
    "id": "gb1-express",
    "kicker": "2 · Express",
    "title": "The update rule",
    "blocks": [
     {
      "kind": "p",
      "text": "Start with a plain guess for every flat: the average price. Each round, compute the residual (actual minus current prediction), fit a very small tree to those residuals, and add a fraction of its output to the prediction."
     },
     {
      "kind": "eq",
      "lines": [
       "F₀ = average of y",
       "F_m(x) = F_(m−1)(x) + η · h_m(x)",
       "h_m is fitted to the residuals y − F_(m−1)"
      ],
      "note": "η (eta) is the learning rate. h_m is a weak learner, here a stump with one split."
     }
    ]
   },
   {
    "id": "gb1-visualize",
    "kicker": "3 · Visualize",
    "title": "Watch the error drop",
    "blocks": [
     {
      "kind": "p",
      "text": "Eight flats, areas 40 to 110 sq m, with prices from ₹30 to ₹84 lakh. Starting from the average of ₹53.6 lakh, the mean squared error is 362.0. Each stump is a single split on area."
     },
     {
      "kind": "table",
      "caption": "Mean squared error after each stump",
      "headers": [
       "Stumps added",
       "η = 1.0",
       "η = 0.3"
      ],
      "rows": [
       [
        "0",
        "362.0",
        "362.0"
       ],
       [
        "1",
        "93.6",
        "225.1"
       ],
       [
        "2",
        "23.2",
        "131.9"
       ],
       [
        "3",
        "9.1",
        "84.0"
       ],
       [
        "4",
        "4.8",
        "53.6"
       ],
       [
        "5",
        "3.7",
        "32.4"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A full step per stump removes error quickly. A third of a step per stump is slower, and is the version that tends to generalise better, for reasons the next lessons give."
     }
    ]
   },
   {
    "id": "gb1-discover",
    "kicker": "4 · Discover",
    "title": "Why a fraction",
    "blocks": [
     {
      "kind": "p",
      "text": "A full step trusts each stump completely, including the part of it that is just fitting noise. A small step keeps only a little of every stump, so no single tree can drag the model far in a wrong direction. You pay for that caution with more trees."
     },
     {
      "kind": "p",
      "text": "Each tree depends on the ones before it, because its target is what they left behind. That is why boosting is sequential and why you cannot fit the trees in any order or average them like a forest."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Boosting adds up many small trees, each fitted to what the earlier trees still get wrong, and shrinks each one by a learning rate."
     }
    ]
   },
   {
    "id": "gb1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, one flat. The average price is ₹53.6 lakh. A 100 sq m flat actually sold for ₹80 lakh, a residual of about +26.4. Suppose the stump's leaf for large flats says +24. With η = 0.3 the new prediction is 53.6 + 0.3 × 24 = 60.8. The residual shrinks to 19.2, and the next stump has a smaller job."
     },
     {
      "kind": "p",
      "text": "Example 2, a twist. If the stump's leaf said −24 instead, the prediction would move to 46.4. The sign comes from the current errors, not from a rule that boosting always raises predictions."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Ranking, pricing and risk models on tabular data. Gradient boosting is often the most accurate tabular model when tuned with care."
     },
     {
      "kind": "check",
      "question": "A stump predicts +10 for a flat. With η = 0.1 how much is added to that flat's prediction?",
      "options": [
       "10",
       "1",
       "0.1"
      ],
      "answer": 1,
      "why": "The update is η × h = 0.1 × 10 = 1. Only a fraction of the stump is kept."
     }
    ]
   },
   {
    "id": "gb1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Treating it as a forest",
      "text": "The trees depend on each other. Shuffling or averaging them as if independent breaks the model."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Too many stages with a big step",
      "text": "Each stage fits the training errors a bit more, including noise. Training error always falls, which hides overfitting."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Fitting the residual on validation data",
      "text": "The residuals must come from training rows only. Validation rows are for checking stages, never for building them."
     }
    ]
   },
   {
    "id": "gb1-python",
    "kicker": "7 · In Python",
    "title": "The stump relay in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Add stumps to residuals with two learning rates",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeRegressor\n\narea = np.array([40, 50, 60, 70, 80, 90, 100, 110], float).reshape(-1, 1)\nprice = np.array([30, 34, 36, 52, 55, 58, 80, 84], float)\n\nfor lr in [1.0, 0.3]:\n    pred = np.full(len(price), price.mean())\n    print(\"learning rate\", lr, \"| start: mean\", round(price.mean(), 1), \"MSE\", round(((price - pred) ** 2).mean(), 1))\n    for step in range(1, 6):\n        residual = price - pred\n        stump = DecisionTreeRegressor(max_depth=1).fit(area, residual)\n        pred = pred + lr * stump.predict(area)\n        print(\"  after stump\", step, \"MSE\", round(((price - pred) ** 2).mean(), 1))",
      "output": "learning rate 1.0 | start: mean 53.6 MSE 362.0\n  after stump 1 MSE 93.6\n  after stump 2 MSE 23.2\n  after stump 3 MSE 9.1\n  after stump 4 MSE 4.8\n  after stump 5 MSE 3.7\nlearning rate 0.3 | start: mean 53.6 MSE 362.0\n  after stump 1 MSE 225.1\n  after stump 2 MSE 131.9\n  after stump 3 MSE 84.0\n  after stump 4 MSE 53.6\n  after stump 5 MSE 32.4"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The numbers fall each round, and the smaller step falls more slowly. Training error is not the test."
     }
    ]
   }
  ]
 },
 {
  "title": "Squared error: the residual is the push",
  "minutes": 13,
  "sections": [
   {
    "id": "gb2-observe",
    "kicker": "1 · Observe",
    "title": "Which way, and how hard?",
    "blocks": [
     {
      "kind": "p",
      "text": "To fix a prediction we need a direction and a size. For prices, the obvious answer is the gap between the actual price and the guess. Loss functions give that a precise form: the push on a prediction is the slope of the loss at that point, pointing downhill."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Why is the residual exactly the right target for squared error, and what happens when a few listings are absurd?"
     }
    ]
   },
   {
    "id": "gb2-express",
    "kicker": "2 · Express",
    "title": "The residual is the negative gradient",
    "blocks": [
     {
      "kind": "p",
      "text": "With half squared error, the loss for one flat is ½(y − F)². Its slope with respect to F is F − y. Going downhill means moving by y − F, which is the residual."
     },
     {
      "kind": "eq",
      "lines": [
       "L = ½ (y − F)²",
       "−dL/dF = y − F"
      ],
      "note": "A leaf then proposes the average residual of the flats that land in it."
     }
    ]
   },
   {
    "id": "gb2-visualize",
    "kicker": "3 · Visualize",
    "title": "Residuals and the negative gradient match",
    "blocks": [
     {
      "kind": "p",
      "text": "Take three flats priced ₹50, ₹60 and ₹90 lakh, all currently predicted at ₹55 lakh. The residuals are −5, +5 and +35. The negative gradient computed from the loss gives the same three numbers."
     },
     {
      "kind": "p",
      "text": "Notice how large 35 is next to 5. Under squared error the 90 lakh flat pulls the model seven times harder than the others, because the push grows with the size of the miss."
     }
    ]
   },
   {
    "id": "gb2-discover",
    "kicker": "4 · Discover",
    "title": "Outliers get a loud voice",
    "blocks": [
     {
      "kind": "p",
      "text": "A single bad sale of ₹200 lakh for a flat the model thinks is worth ₹55 lakh contributes a squared error of 145² = 21,025, while a ₹5 lakh miss contributes 25. One row can outweigh hundreds. If those rows are mistakes, the model chases them."
     },
     {
      "kind": "p",
      "text": "The fix is a different loss. Absolute error pushes by only +1 or −1, whatever the size of the miss, so one mad listing cannot dominate."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "For squared error the push is the residual itself, so large errors pull hardest. Choose the loss to match which errors you care about."
     }
    ]
   },
   {
    "id": "gb2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a leaf. Two flats land in the same leaf with residuals 2 and 4. The leaf proposes their mean, 3. With η = 0.1 each flat moves up by 0.3."
     },
     {
      "kind": "p",
      "text": "Example 2, loss changes. The same 4% of listings in our simulation sell far above area-based value. Squared-error boosting bends toward them; absolute-error boosting mostly ignores them. See the code for the measured difference."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Housing and rent models where a few commercial or mislabelled listings sit in the data."
     },
     {
      "kind": "check",
      "question": "Under squared error, a residual of 10 versus a residual of 1: how many times harder is the first pushed?",
      "options": [
       "10 times",
       "100 times",
       "1 time"
      ],
      "answer": 0,
      "why": "The negative gradient is the residual itself, so 10 against 1 is a 10 times larger push. The loss value itself grows 100 times, but the push grows 10 times."
     }
    ]
   },
   {
    "id": "gb2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Cleaning no data",
      "text": "Fix or remove mistakes before choosing a loss. A robust loss helps, but it cannot recover facts the data lacks."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Judging with the wrong score",
      "text": "If you train on absolute error and report mean squared error, outliers in the test set dominate the score. Report what the business cares about."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Mixing up loss and metric",
      "text": "The training loss and the number you report may differ. Say which one a figure refers to."
     }
    ]
   },
   {
    "id": "gb2-python",
    "kicker": "7 · In Python",
    "title": "Squared versus absolute loss",
    "blocks": [
     {
      "kind": "code",
      "caption": "The negative gradient, and two losses on messy prices",
      "code": "import numpy as np\nfrom sklearn.ensemble import GradientBoostingRegressor\nfrom sklearn.metrics import mean_absolute_error, mean_squared_error\n\n# for squared loss, the negative gradient is exactly the residual\ny, F = np.array([50.0, 60.0, 90.0]), np.array([55.0, 55.0, 55.0])\nprint(\"residual y - F       :\", y - F)\nprint(\"negative gradient    :\", -(F - y))        # d/dF of 0.5 * (y - F)^2 is (F - y)\n\nrng = np.random.default_rng(1)\nn = 500\narea = rng.uniform(30, 130, n)\nprice = 0.5 * area + rng.normal(0, 3, n)\noutlier = rng.random(n) < 0.04\nprice = np.where(outlier, price + rng.uniform(60, 120, n), price)      # a few absurd listings\nX = area.reshape(-1, 1)\ntr, te = slice(0, 300), slice(300, None)\nclean = ~outlier[te]\n\nfor loss in [\"squared_error\", \"absolute_error\"]:\n    m = GradientBoostingRegressor(loss=loss, n_estimators=150, max_depth=2, random_state=0).fit(X[tr], price[tr])\n    p = m.predict(X[te])\n    print(loss.ljust(15), \"typical miss on ordinary listings (MAE):\", round(mean_absolute_error(price[te][clean], p[clean]), 2))",
      "output": "residual y - F       : [-5.  5. 35.]\nnegative gradient    : [-5.  5. 35.]\nsquared_error   typical miss on ordinary listings (MAE): 6.42\nabsolute_error  typical miss on ordinary listings (MAE): 2.61"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "On ordinary listings the absolute-error model missed by about ₹2.6 lakh against ₹6.4 lakh. Outlier-heavy data changes the right loss."
     }
    ]
   }
  ]
 },
 {
  "title": "Classification: pushing log-odds",
  "minutes": 14,
  "sections": [
   {
    "id": "gb3-observe",
    "kicker": "1 · Observe",
    "title": "The leftover is a chance, not a price",
    "blocks": [
     {
      "kind": "p",
      "text": "For churn, the target is 0 or 1, and the model gives a chance. A customer who stayed, predicted at 99 percent likely to leave, is badly wrong. One at 51 percent is nearly right. The push needs to reflect that."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does a boosting stage fit when the target is a yes or no, and why does it work on log-odds?"
     }
    ]
   },
   {
    "id": "gb3-express",
    "kicker": "2 · Express",
    "title": "Scores, probabilities and the leaf correction",
    "blocks": [
     {
      "kind": "p",
      "text": "The model keeps a raw score F for each customer (log-odds). The probability is p = 1 ⁄ (1 + e^(−F)). The loss is log loss. Its negative gradient with respect to F turns out to be y − p, the actual outcome minus the current chance."
     },
     {
      "kind": "eq",
      "lines": [
       "p = 1 / (1 + e^(−F))",
       "negative gradient = y − p",
       "leaf correction = Σ(y − p) ÷ Σ p(1 − p)"
      ],
      "note": "The denominator p(1 − p) is largest when the model is unsure and tiny when it is confident, so confident rows move little."
     }
    ]
   },
   {
    "id": "gb3-visualize",
    "kicker": "3 · Visualize",
    "title": "Five customers, one starts the story",
    "blocks": [
     {
      "kind": "p",
      "text": "One customer in five churned, so the base rate is 0.2 and the starting score is the log-odds of 0.2, which is −1.386. The residuals y − p are +0.8 for the churner and −0.2 for each of the others."
     },
     {
      "kind": "p",
      "text": "Put the churner alone in a leaf: correction = 0.8 ÷ (0.2 × 0.8) = 5. With η = 0.1 the score moves by 0.5, from −1.386 to −0.886, and the probability rises from 0.200 to 0.292. Put the four stayers together: the correction is −0.8 ÷ 0.64 = −1.25, and the score moves by −0.125, so their probability falls from 0.200 to 0.181."
     }
    ]
   },
   {
    "id": "gb3-discover",
    "kicker": "4 · Discover",
    "title": "Probabilities need not be sharp",
    "blocks": [
     {
      "kind": "p",
      "text": "Each new stage nudges scores. It is the log loss, not accuracy, that tells you how well the probabilities are calibrated. In a simulation with 2,000 customers (1,000 to train, 1,000 to check), log loss fell from 0.593 after 1 stage to 0.498 at 20 stages, then crept back up to 0.539 by 300."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "For classification, each stage pushes the log-odds by y − p, scaled by how unsure the model is, and too many stages overfit the probabilities."
     }
    ]
   },
   {
    "id": "gb3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the one-row leaf above: a lone churner moves from 20.0 percent to 29.2 percent in a single stage at η = 0.1. Confidence builds slowly, which is the point."
     },
     {
      "kind": "p",
      "text": "Example 2, a confident miss. If a model already says 0.99 and the customer stayed, y − p = −0.99, but the denominator p(1 − p) = 0.0099 is tiny, so the leaf correction is −100. That is why implementations clip or stabilise these updates, and why very confident wrong predictions are dangerous."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Churn, fraud and click models where a calibrated chance is used, for example to pick the top 5 percent of customers to call."
     },
     {
      "kind": "check",
      "question": "A row has y = 1 and the model says p = 0.9. What is the negative gradient?",
      "options": [
       "0.9",
       "0.1",
       "−0.1"
      ],
      "answer": 1,
      "why": "y − p = 1 − 0.9 = 0.1. The model is already right, so the push is small."
     }
    ]
   },
   {
    "id": "gb3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading probabilities as certainty",
      "text": "A score of 0.7 from a tuned model is useful, but it is not a guarantee. Check calibration on held-out data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Ignoring the base rate",
      "text": "With 5 percent positives, an accuracy of 95 percent is what a model that says no to everyone gets. Use log loss or AUC."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Stopping late",
      "text": "Stage after stage the log loss falls on training data, and starts rising on validation. Stop where validation turns."
     }
    ]
   },
   {
    "id": "gb3-python",
    "kicker": "7 · In Python",
    "title": "Log loss across stages",
    "blocks": [
     {
      "kind": "code",
      "caption": "A hand-fitted first step, then staged log loss",
      "code": "import numpy as np\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.metrics import log_loss, accuracy_score\n\n# one boosting step by hand: five customers, start from the base rate\ny = np.array([1, 0, 0, 0, 0])\np0 = y.mean()\nF0 = np.log(p0 / (1 - p0))\nprint(\"base rate\", p0, \"-> starting log-odds\", round(F0, 3))\nprint(\"residuals y - p:\", np.round(y - p0, 2))\n\nrng = np.random.default_rng(8)\nn = 2000\ntenure = rng.uniform(1, 48, n)\ncalls = rng.poisson(2, n)\nbill = rng.uniform(200, 2000, n)\nlogit = -0.8 - 0.06 * tenure + 0.5 * calls + 0.0005 * (bill - 1000) + 0.04 * (tenure < 10) * calls * 10\ny = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)\nX = np.column_stack([tenure, calls, bill])\ntr, te = slice(0, 1000), slice(1000, None)\n\nmodel = GradientBoostingClassifier(n_estimators=300, learning_rate=0.1, max_depth=2, random_state=0).fit(X[tr], y[tr])\nstages = list(model.staged_predict_proba(X[te]))\nfor k in [1, 5, 20, 100, 300]:\n    p = stages[k - 1][:, 1]\n    print(\"stages\", str(k).rjust(3), \"log loss\", round(log_loss(y[te], p), 3), \"accuracy\", round(accuracy_score(y[te], p > 0.5), 3))",
      "output": "base rate 0.2 -> starting log-odds -1.386\nresiduals y - p: [ 0.8 -0.2 -0.2 -0.2 -0.2]\nstages   1 log loss 0.593 accuracy 0.705\nstages   5 log loss 0.55 accuracy 0.75\nstages  20 log loss 0.498 accuracy 0.775\nstages 100 log loss 0.5 accuracy 0.769\nstages 300 log loss 0.539 accuracy 0.749"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Accuracy changed little while log loss showed the real overfit. Watch the loss that matches how you will use the probabilities."
     }
    ]
   }
  ]
 },
 {
  "title": "How many stages, and how big a step?",
  "minutes": 13,
  "sections": [
   {
    "id": "gb4-observe",
    "kicker": "1 · Observe",
    "title": "Two knobs that fight each other",
    "blocks": [
     {
      "kind": "p",
      "text": "You have two main dials: how many trees to add, and how big each step is. Make the step small and you need many trees. Make it large and a few trees suffice, but each one can overshoot."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do you pick the number of stages, and what does a smaller learning rate buy you?"
     }
    ]
   },
   {
    "id": "gb4-express",
    "kicker": "2 · Express",
    "title": "Validation picks the stopping point",
    "blocks": [
     {
      "kind": "p",
      "text": "Train once with a generous number of stages, record the validation error after every stage, and pick the stage where it is lowest. This curve usually falls, flattens, then rises as the model starts fitting noise."
     },
     {
      "kind": "eq",
      "lines": [
       "best stage = argmin over m of validation error(F_m)"
      ],
      "note": "Staged prediction lets you read the whole curve from one trained model."
     }
    ]
   },
   {
    "id": "gb4-visualize",
    "kicker": "3 · Visualize",
    "title": "Learning rate and best stage",
    "blocks": [
     {
      "kind": "p",
      "text": "900 simulated points, 450 for training and 450 for validation, depth-3 trees, up to 1,000 stages."
     },
     {
      "kind": "table",
      "caption": "Learning rate against best stage count",
      "headers": [
       "Learning rate",
       "Best stage",
       "Best validation MSE",
       "MSE at 1,000 stages"
      ],
      "rows": [
       [
        "0.5",
        "6",
        "2.09",
        "2.918"
       ],
       [
        "0.1",
        "64",
        "2.042",
        "2.627"
       ],
       [
        "0.02",
        "335",
        "2.051",
        "2.2"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The best error is nearly the same for all three. What changes is how many stages you need to reach it and how steeply the curve punishes going past it. The smallest step is the most forgiving."
     }
    ]
   },
   {
    "id": "gb4-discover",
    "kicker": "4 · Discover",
    "title": "Early stopping does the search for you",
    "blocks": [
     {
      "kind": "p",
      "text": "sklearn can hold out part of the training data and stop when the score has not improved for a set number of rounds. In our run it used 78 stages out of 1,000. Note it uses a slice of your training data internally, so it is not a substitute for a separate test set."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Choose a small learning rate, add stages until validation error stops improving, and stop there."
     }
    ]
   },
   {
    "id": "gb4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the cost of overshooting. At learning rate 0.5 the best stage is 6 and by stage 1,000 the validation MSE is 2.918, about 40 percent worse than the best 2.09. The model has memorised noise."
     },
     {
      "kind": "p",
      "text": "Example 2, the forgiving version. At 0.02 the best is 335 stages with MSE 2.051, and running all 1,000 only costs 0.15 extra. If you pick the stage count a little wrong, little is lost."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Production models re-trained on a schedule, where a robust stopping rule matters more than the last bit of accuracy."
     },
     {
      "kind": "check",
      "question": "The best validation MSE is nearly equal for all three learning rates. What should you favour?",
      "options": [
       "The largest rate, it is fastest",
       "A small rate, it is most forgiving of the stopping point",
       "Always 0.5"
      ],
      "answer": 1,
      "why": "Similar best error with a flatter curve around the best stage means a small rate is safer to deploy."
     }
    ]
   },
   {
    "id": "gb4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Using the test set to pick stages",
      "text": "The stopping stage is a tuned choice. Pick it on validation only, then score on a fresh test set."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Judging by training error",
      "text": "Training error keeps falling, so it would tell you to add every stage."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Retraining with the wrong count",
      "text": "If you refit on more data, a stage count tuned on less data may be a little low. Treat it as a starting point."
     }
    ]
   },
   {
    "id": "gb4-python",
    "kicker": "7 · In Python",
    "title": "Reading the validation curve",
    "blocks": [
     {
      "kind": "code",
      "caption": "Staged validation error at three learning rates, and early stopping",
      "code": "import numpy as np\nfrom sklearn.ensemble import GradientBoostingRegressor\nfrom sklearn.metrics import mean_squared_error\n\nrng = np.random.default_rng(5)\nn = 900\nX = rng.uniform(0, 10, size=(n, 2))\ny = 3 * np.sin(X[:, 0]) + 0.5 * X[:, 1] + rng.normal(0, 1.2, n)\ntr, va = slice(0, 450), slice(450, None)\n\nprint(\"learning rate | best number of stages | best validation MSE | validation MSE at 1000 stages\")\nfor lr in [0.5, 0.1, 0.02]:\n    m = GradientBoostingRegressor(n_estimators=1000, learning_rate=lr, max_depth=3, random_state=0).fit(X[tr], y[tr])\n    curve = [mean_squared_error(y[va], p) for p in m.staged_predict(X[va])]\n    best = int(np.argmin(curve)) + 1\n    print(str(lr).ljust(13), \"|\", str(best).rjust(6), \"|\", round(min(curve), 3), \"|\", round(curve[-1], 3))\n\nearly = GradientBoostingRegressor(n_estimators=1000, learning_rate=0.1, max_depth=3, validation_fraction=0.2, n_iter_no_change=20, random_state=0).fit(X[tr], y[tr])\nprint(\"early stopping used\", early.n_estimators_, \"stages out of 1000\")",
      "output": "learning rate | best number of stages | best validation MSE | validation MSE at 1000 stages\n0.5           |      6 | 2.09 | 2.918\n0.1           |     64 | 2.042 | 2.627\n0.02          |    335 | 2.051 | 2.2\nearly stopping used 78 stages out of 1000"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A learning curve is cheap and tells you more than any one final score."
     }
    ]
   }
  ]
 },
 {
  "title": "A workflow that does not fool you",
  "minutes": 13,
  "sections": [
   {
    "id": "gb5-observe",
    "kicker": "1 · Observe",
    "title": "The honest score comes from rows the model has not seen",
    "blocks": [
     {
      "kind": "p",
      "text": "Boosting is flexible enough to memorise training data given enough stages. That makes the way you split data matter more, because a leaky split can make a model look better than it will ever be."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What goes in the training set, the validation set and the test set, and when is a random split the wrong choice?"
     }
    ]
   },
   {
    "id": "gb5-express",
    "kicker": "2 · Express",
    "title": "Split first, then everything else",
    "blocks": [
     {
      "kind": "p",
      "text": "Fit anything that learns from data, such as scalers, encoders, target statistics and feature selection, using training rows only. Tune stages and depth on validation rows. Touch the test rows once, at the end."
     },
     {
      "kind": "eq",
      "lines": [
       "split → fit on train → tune on validation → score once on test"
      ],
      "note": "Anything learned from all rows before splitting leaks the answer."
     }
    ]
   },
   {
    "id": "gb5-visualize",
    "kicker": "3 · Visualize",
    "title": "When the order of rows matters",
    "blocks": [
     {
      "kind": "p",
      "text": "Customer behaviour changes over time. If rows are shuffled before splitting, the model trains on the future and is tested on the past. Predictions on tomorrow's customers are what you really need."
     },
     {
      "kind": "table",
      "caption": "Same data, two splits (AUC)",
      "headers": [
       "Split",
       "AUC"
      ],
      "rows": [
       [
        "Random split",
        "0.669"
       ],
       [
        "Forward split (train on oldest 3,000, test on newest 1,000)",
        "0.586"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A random split looked better by 0.083 AUC. The forward split mirrors what happens in production, and the lower number is the honest one."
     }
    ]
   },
   {
    "id": "gb5-discover",
    "kicker": "4 · Discover",
    "title": "Match the split to the use",
    "blocks": [
     {
      "kind": "p",
      "text": "If the model will predict future rows, split by time. If it will score new customers, keep each customer on one side only. If rows from the same household or store share information, keep groups together."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A split is a statement about how the model will be used. Make the validation world look like the real world."
     }
    ]
   },
   {
    "id": "gb5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, drift. In the simulation, the effect of usage on churn slowly reverses over time. A model trained on a random mix of old and new learns an average that is right for no one. Trained on the past only, it is tested against the real drift."
     },
     {
      "kind": "p",
      "text": "Example 2, leakage by encoding. Replacing a city name with the average churn rate for that city, computed over all rows, hides each row's own label inside its feature. Compute such statistics from training rows only, and ideally inside cross-validation folds."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Credit, churn and demand models where time, customers or stores are not independent rows."
     },
     {
      "kind": "check",
      "question": "A model must predict next month's customers. Which split mirrors this?",
      "options": [
       "A random 75/25 split",
       "Train on earlier months, test on the latest month",
       "Test on a random month, train on the rest"
      ],
      "answer": 1,
      "why": "Only the forward split imitates predicting a future the model has not seen."
     }
    ]
   },
   {
    "id": "gb5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Tuning on the test set",
      "text": "Trying ten settings and reporting the best test score is optimistic. Keep a final test untouched."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Scaling before splitting",
      "text": "Trees do not need scaling, but other steps in the pipeline may. Fit them on training rows only."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Forgetting drift",
      "text": "A model that scored well last quarter can decay. Monitor it, and plan to retrain."
     }
    ]
   },
   {
    "id": "gb5-python",
    "kicker": "7 · In Python",
    "title": "Random versus forward split",
    "blocks": [
     {
      "kind": "code",
      "caption": "The same model scored under two splits",
      "code": "import numpy as np\nfrom sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import roc_auc_score\n\nrng = np.random.default_rng(30)\nn = 4000\nt = np.arange(n)                                        # time order: row 0 is the oldest\nusage = rng.normal(size=n)\nseason = np.sin(t / 120)                                # a slowly changing pattern\ndrift = t / n                                           # customer behaviour changes over time\nlogit = 1.4 * usage * (1 - 2 * drift) + 1.0 * season\ny = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)\nX = np.column_stack([usage, season])\n\ndef fit_score(tr, te):\n    m = GradientBoostingClassifier(n_estimators=150, max_depth=3, random_state=0).fit(X[tr], y[tr])\n    return round(roc_auc_score(y[te], m.predict_proba(X[te])[:, 1]), 3)\n\nidx = rng.permutation(n)\nprint(\"random split AUC  :\", fit_score(idx[:3000], idx[3000:]))\nprint(\"forward split AUC :\", fit_score(np.arange(3000), np.arange(3000, n)))",
      "output": "random split AUC  : 0.669\nforward split AUC : 0.586"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A better number from a leaky split is a worse model in disguise."
     }
    ]
   }
  ]
 },
 {
  "title": "Compare, diagnose and decide",
  "minutes": 14,
  "sections": [
   {
    "id": "gb6-observe",
    "kicker": "1 · Observe",
    "title": "The best model is the one that wins a fair race",
    "blocks": [
     {
      "kind": "p",
      "text": "Boosting is popular because it often wins on tabular data. It is not always the right pick. A simple model that scores almost as well is easier to explain, cheaper to run and more stable."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do you compare boosting with a linear model and a forest fairly, and what do the numbers tell you?"
     }
    ]
   },
   {
    "id": "gb6-express",
    "kicker": "2 · Express",
    "title": "Compare on the same rows with the same metric",
    "blocks": [
     {
      "kind": "p",
      "text": "Give each model the same training rows, the same held-out rows and the same metric. Report both a ranking metric (AUC) and a probability metric (log loss), and also the training score, which shows how much each model memorised."
     },
     {
      "kind": "eq",
      "lines": [
       "gap = training score − held-out score"
      ],
      "note": "A large gap means the model fits its training rows more closely than it generalises."
     }
    ]
   },
   {
    "id": "gb6-visualize",
    "kicker": "3 · Visualize",
    "title": "Three models, one dataset",
    "blocks": [
     {
      "kind": "p",
      "text": "5,000 simulated customers, 8 columns, with some interactions and thresholds. 3,000 for training, 2,000 held out."
     },
     {
      "kind": "table",
      "caption": "Train and held-out scores",
      "headers": [
       "Model",
       "Train AUC",
       "Test AUC",
       "Test log loss"
      ],
      "rows": [
       [
        "Logistic regression",
        "0.739",
        "0.724",
        "0.611"
       ],
       [
        "Random forest",
        "0.980",
        "0.755",
        "0.589"
       ],
       [
        "Gradient boosting",
        "0.877",
        "0.754",
        "0.591"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Both tree models beat the linear model on test by about 0.03 AUC, because the data has thresholds and interactions. The forest memorised its training rows far more (0.980 against 0.877) for the same test result."
     }
    ]
   },
   {
    "id": "gb6-discover",
    "kicker": "4 · Discover",
    "title": "How to read this",
    "blocks": [
     {
      "kind": "p",
      "text": "The two tree models are within 0.001 AUC of each other on test, which is inside the noise of a single split. The honest conclusion is that they tie here. Boosting was less overfit, which can mean it is more stable, but this experiment does not prove it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Choose the simpler model unless the extra complexity wins by a margin that survives repeated splits."
     }
    ]
   },
   {
    "id": "gb6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a clear gap. A 0.03 AUC lift on 2,000 test rows is large enough to matter. Rank 1,000 customers by score: the better model finds more of the real churners in the top bucket, and each extra churner reached is worth a retention call."
     },
     {
      "kind": "p",
      "text": "Example 2, a tie. 0.755 against 0.754 is a tie. Choose by other costs: training time, explanation, how easily the model can be monitored."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Choosing between a scorecard, a forest and a boosted model for credit or churn, where rules, audits and speed also count."
     },
     {
      "kind": "check",
      "question": "Forest test AUC is 0.755 and boosting is 0.754. What do you conclude?",
      "options": [
       "The forest is clearly better",
       "They tie on this evidence",
       "Boosting is clearly better"
      ],
      "answer": 1,
      "why": "A 0.001 gap is within split-to-split noise. Repeat with cross-validation before claiming a winner."
     }
    ]
   },
   {
    "id": "gb6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Declaring a winner from one split",
      "text": "Repeat across folds and look at the spread, not just one number."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Ignoring the baseline",
      "text": "Always include logistic regression. If it comes close, you may not need the bigger model."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Trusting gap-free scores",
      "text": "A tiny train-test gap is good only if both numbers are good. A weak model has no gap either."
     }
    ]
   },
   {
    "id": "gb6-python",
    "kicker": "7 · In Python",
    "title": "The three-model race",
    "blocks": [
     {
      "kind": "code",
      "caption": "Logistic regression, forest and boosting on one dataset",
      "code": "import numpy as np\nfrom sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import roc_auc_score, log_loss\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(17)\nn = 5000\nX = rng.normal(size=(n, 8))\nlogit = 1.0 * X[:, 0] + 1.5 * (X[:, 1] > 0.5) * (X[:, 2] > 0) - 1.2 * (X[:, 3] < -0.5) + 0.8 * X[:, 4] * X[:, 5]\ny = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.4, random_state=0, stratify=y)\n\nmodels = {\n    \"logistic regression\": LogisticRegression(max_iter=1000),\n    \"random forest\": RandomForestClassifier(n_estimators=300, min_samples_leaf=5, random_state=0),\n    \"gradient boosting\": GradientBoostingClassifier(n_estimators=250, learning_rate=0.05, max_depth=3, random_state=0),\n}\nfor name, m in models.items():\n    m.fit(X_tr, y_tr)\n    p = m.predict_proba(X_te)[:, 1]\n    tp = m.predict_proba(X_tr)[:, 1]\n    print(name.ljust(20), \"train AUC\", round(roc_auc_score(y_tr, tp), 3), \"test AUC\", round(roc_auc_score(y_te, p), 3), \"test log loss\", round(log_loss(y_te, p), 3))",
      "output": "logistic regression  train AUC 0.739 test AUC 0.724 test log loss 0.611\nrandom forest        train AUC 0.98 test AUC 0.755 test log loss 0.589\ngradient boosting    train AUC 0.877 test AUC 0.754 test log loss 0.591"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Race it against a simple model, check the gap, and let a margin that holds up decide."
     }
    ]
   }
  ]
 }
];
