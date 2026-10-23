import type {DeepLesson} from "../../math/teaching/deep-read";
export const RANDOM_FORESTS_DEEP:DeepLesson[]=[
 {
  "title": "Many different guesses beat one confident one",
  "minutes": 13,
  "sections": [
   {
    "id": "rf1-observe",
    "kicker": "1 · Observe",
    "title": "Ask a crowd, not an expert",
    "blocks": [
     {
      "kind": "p",
      "text": "Guess the weight of an ox at a fair. Any one person is off by a lot. The average of hundreds of guesses is startlingly close. This works only if the guesses are different from each other. If everyone copies the person in front, the crowd is as wrong as one person."
     },
     {
      "kind": "p",
      "text": "A single deep decision tree behaves like a confident expert who changes opinion with every small change in the data. A random forest builds many trees and averages them. The whole idea rests on making the trees disagree in useful ways."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do you get many different trees from one dataset, and how much does averaging help?"
     }
    ]
   },
   {
    "id": "rf1-express",
    "kicker": "2 · Express",
    "title": "Resample the rows, then average",
    "blocks": [
     {
      "kind": "p",
      "text": "Bootstrapping makes each tree's training set by drawing n rows from the n you have, with replacement. Some rows appear twice or more, others not at all. Every tree sees a slightly different sample, so it grows a slightly different tree."
     },
     {
      "kind": "p",
      "text": "The gain from averaging depends on how correlated the trees' mistakes are. If each tree's error has variance 1 and any two trees' errors have correlation ρ, the average of B trees has variance ρ + (1 − ρ) / B."
     },
     {
      "kind": "eq",
      "lines": [
       "variance of the average = ρ + (1 − ρ) / B"
      ],
      "note": "The second term shrinks as you add trees. The first never does. Correlation sets the floor."
     }
    ]
   },
   {
    "id": "rf1-visualize",
    "kicker": "3 · Visualize",
    "title": "The floor set by correlation",
    "blocks": [
     {
      "kind": "table",
      "caption": "Variance of the average of B trees (single-tree variance = 1)",
      "headers": [
       "Correlation ρ",
       "B = 1",
       "B = 10",
       "B = 100"
      ],
      "rows": [
       [
        "0.0",
        "1.000",
        "0.100",
        "0.010"
       ],
       [
        "0.3",
        "1.000",
        "0.370",
        "0.307"
       ],
       [
        "0.7",
        "1.000",
        "0.730",
        "0.703"
       ],
       [
        "1.0",
        "1.000",
        "1.000",
        "1.000"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "If trees made independent mistakes (ρ = 0), 100 trees cut the variance to 0.01. If they were identical (ρ = 1), a hundred trees are no better than one. In practice ρ lies in between, and every drop in correlation is worth far more than more trees. Move the sliders in the playground to feel this."
     }
    ]
   },
   {
    "id": "rf1-discover",
    "kicker": "4 · Discover",
    "title": "Bootstrap and random columns",
    "blocks": [
     {
      "kind": "p",
      "text": "Resampling rows alone leaves the trees similar, because strong columns win the top splits in every tree. Random forests add a second trick: at each split, only a random subset of columns is allowed. A column cannot dominate every tree, so trees differ in structure, which lowers ρ."
     },
     {
      "kind": "p",
      "text": "Each bootstrap sample contains about 63.2 percent of the distinct rows, since the chance a given row is never picked in n draws is (1 − 1/n)ⁿ ≈ 0.368. In a simulation with 1,000 rows, 62.2 percent were distinct, 37.8 percent left out."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A forest averages many trees made different by resampling rows and limiting columns at each split. Averaging removes variance, and diversity decides how much."
     }
    ]
   },
   {
    "id": "rf1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a tidy case. Ten trees with ρ = 0.3. Variance = 0.3 + 0.7 / 10 = 0.37, so the forest is about 63 percent less variable than one tree. Going to 100 trees only reaches 0.307. The extra 90 trees barely help, because ρ dominates."
     },
     {
      "kind": "p",
      "text": "Example 2, lowering ρ. Restricting each split to a random third of the columns can drop ρ from 0.7 to 0.4. With 100 trees that moves the variance from 0.703 to 0.406, a bigger gain than going from 10 trees to 1,000."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Fraud, churn and risk models where a single tree is too unstable. Forests are a strong default for tabular data."
     },
     {
      "kind": "check",
      "question": "Trees make completely identical mistakes (ρ = 1). What does averaging 100 of them do to variance?",
      "options": [
       "Nothing, it stays at 1",
       "It drops to 0.01",
       "It drops to 0.5"
      ],
      "answer": 0,
      "why": "With ρ = 1 the formula gives 1 + 0 / B = 1. Identical trees cannot cancel each other's errors."
     }
    ]
   },
   {
    "id": "rf1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Adding trees to fix a correlation problem",
      "text": "More trees only shrink the second term. If the trees are alike, change how they differ instead."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Trusting a forest of shallow copies",
      "text": "Forests whose trees all start with the same column split are less diverse than they look."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Believing averaging cures bias",
      "text": "If every tree misses the same shape, the average misses it too. Averaging reduces variance, not bias."
     }
    ]
   },
   {
    "id": "rf1-python",
    "kicker": "7 · In Python",
    "title": "The bootstrap fraction and the variance floor",
    "blocks": [
     {
      "kind": "code",
      "caption": "Share of rows drawn, and the variance table",
      "code": "import numpy as np\n\nrng = np.random.default_rng(0)\nn = 1000\nsample = rng.integers(0, n, n)                      # one bootstrap sample: n draws with replacement\nprint(\"share of distinct rows in a bootstrap sample:\", round(len(set(sample)) / n, 3), \"(theory\", round(1 - (1 - 1 / n) ** n, 3), \")\")\nprint(\"share left out:\", round(1 - len(set(sample)) / n, 3))\n\n# variance of the average of B trees whose errors have variance 1 and pairwise correlation rho\nprint(\"rho   B=1    B=10   B=100\")\nfor rho in [0.0, 0.3, 0.7, 1.0]:\n    row = [rho + (1 - rho) / B for B in (1, 10, 100)]\n    print(rho, \" \", \"  \".join(f\"{v:.3f}\" for v in row))",
      "output": "share of distinct rows in a bootstrap sample: 0.622 (theory 0.632 )\nshare left out: 0.378\nrho   B=1    B=10   B=100\n0.0   1.000  0.100  0.010\n0.3   1.000  0.370  0.307\n0.7   1.000  0.730  0.703\n1.0   1.000  1.000  1.000"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Averaging cuts variance, but only as far as the trees' errors differ. Diversity is the point."
     }
    ]
   }
  ]
 },
 {
  "title": "Forests for numbers: averaging predictions",
  "minutes": 13,
  "sections": [
   {
    "id": "rf2-observe",
    "kicker": "1 · Observe",
    "title": "One tree changes its mind, a hundred trees settle",
    "blocks": [
     {
      "kind": "p",
      "text": "A fully grown regression tree fits its training flats exactly, including their quirks. Fed a slightly different sample it gives a noticeably different price for the same flat. If you averaged the prices from many such trees, the quirks would partly cancel and the shared signal would remain."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How much does averaging many regression trees improve predictions, and how many trees do you need?"
     }
    ]
   },
   {
    "id": "rf2-express",
    "kicker": "2 · Express",
    "title": "The forest's prediction is a plain average",
    "blocks": [
     {
      "kind": "p",
      "text": "Each tree predicts a price. The forest reports their mean. For one 80 sq m flat that is 10 years old, seven trees said: ₹48.4, 48.4, 35.6, 39.7, 48.4, 48.4 and 39.7 lakh. Their average is ₹44.1 lakh."
     },
     {
      "kind": "eq",
      "lines": [
       "forest prediction = (tree₁ + tree₂ + … + tree_B) ÷ B"
      ],
      "note": "The spread among the trees also tells you something: wide disagreement means the forest is unsure about this flat."
     }
    ]
   },
   {
    "id": "rf2-visualize",
    "kicker": "3 · Visualize",
    "title": "Error falls, then flattens",
    "blocks": [
     {
      "kind": "p",
      "text": "300 simulated flats, trained on 300 and tested on 300. Price depends on area and age, with a wiggle and noise."
     },
     {
      "kind": "table",
      "caption": "Validation error (RMSE, ₹ lakh) by number of trees",
      "headers": [
       "Model",
       "Validation RMSE"
      ],
      "rows": [
       [
        "One fully grown tree",
        "7.26"
       ],
       [
        "Forest of 1",
        "7.65"
       ],
       [
        "Forest of 5",
        "6.18"
       ],
       [
        "Forest of 25",
        "5.76"
       ],
       [
        "Forest of 100",
        "5.72"
       ],
       [
        "Forest of 300",
        "5.68"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A forest of one is just a bootstrap-trained tree, and slightly worse than the single tree. By 25 trees the error has dropped about 20 percent, and beyond 100 trees the gain is almost nothing. Slide the number of trees in the playground."
     }
    ]
   },
   {
    "id": "rf2-discover",
    "kicker": "4 · Discover",
    "title": "More trees never hurt, they just stop helping",
    "blocks": [
     {
      "kind": "p",
      "text": "Adding trees to a forest does not cause overfitting in the way adding depth to a tree does. The error settles at a floor set by how correlated the trees are. Past the knee of the curve, you are paying more training and prediction time for nothing."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A regression forest averages the trees' predictions, which removes much of each tree's noise, and the benefit levels off after tens to a few hundred trees."
     },
     {
      "kind": "p",
      "text": "The remaining error is the part that all trees share: the bias of the method and the noise in the data themselves."
     }
    ]
   },
   {
    "id": "rf2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a rough cost. Prediction time grows linearly with trees. A forest of 300 takes about three times as long as a forest of 100 for a 0.04 improvement in RMSE (5.72 to 5.68). In a real-time service that trade is rarely worth it."
     },
     {
      "kind": "p",
      "text": "Example 2, using the spread. For the 80 sq m flat the seven trees range from ₹35.6 to ₹48.4 lakh. That spread is a rough warning that the price is uncertain, and a sensible tool might show “₹44 lakh, give or take ₹5 lakh”."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Pricing, demand, energy and any numeric target with irregular, interacting drivers, as a strong baseline that needs little tuning."
     },
     {
      "kind": "check",
      "question": "Trees predict 40, 44 and 48 for a flat. What does the forest predict?",
      "options": [
       "44",
       "48",
       "40"
      ],
      "answer": 0,
      "why": "The forest takes the mean: (40 + 44 + 48) / 3 = 44."
     }
    ]
   },
   {
    "id": "rf2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Expecting extrapolation",
      "text": "Each tree predicts a leaf average, so the forest cannot predict beyond the range of training prices."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Judging by training error",
      "text": "A forest's error on its own training rows is far too low, because each row was used to grow most trees."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Adding trees instead of thinking",
      "text": "After the knee, more trees buy nothing. Look at what the trees share."
     }
    ]
   },
   {
    "id": "rf2-python",
    "kicker": "7 · In Python",
    "title": "Error against the number of trees",
    "blocks": [
     {
      "kind": "code",
      "caption": "One tree against forests of increasing size, and seven trees on one flat",
      "code": "import numpy as np\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.tree import DecisionTreeRegressor\nfrom sklearn.metrics import mean_squared_error\n\nrng = np.random.default_rng(2)\nn = 600\narea = rng.uniform(30, 130, n)\nage = rng.uniform(0, 40, n)\nprice = 0.55 * area - 0.4 * age + 6 * np.sin(area / 12) + rng.normal(0, 5, n)\nX = np.column_stack([area, age])\ntr, va = slice(0, 300), slice(300, None)\n\ntree = DecisionTreeRegressor(random_state=0).fit(X[tr], price[tr])\nprint(\"one deep tree   valid RMSE\", round(mean_squared_error(price[va], tree.predict(X[va])) ** 0.5, 2))\nfor B in [1, 5, 25, 100, 300]:\n    rf = RandomForestRegressor(n_estimators=B, random_state=0).fit(X[tr], price[tr])\n    print(\"forest of\", str(B).rjust(3), \"valid RMSE\", round(mean_squared_error(price[va], rf.predict(X[va])) ** 0.5, 2))\n\nflat = np.array([[80.0, 10.0]])\nsingle = [t.predict(flat)[0] for t in RandomForestRegressor(n_estimators=7, random_state=3).fit(X[tr], price[tr]).estimators_]\nprint(\"seven trees say:\", np.round(single, 1), \"-> average\", round(float(np.mean(single)), 1))",
      "output": "one deep tree   valid RMSE 7.26\nforest of   1 valid RMSE 7.65\nforest of   5 valid RMSE 6.18\nforest of  25 valid RMSE 5.76\nforest of 100 valid RMSE 5.72\nforest of 300 valid RMSE 5.68\nseven trees say: [48.4 48.4 35.6 39.7 48.4 48.4 39.7] -> average 44.1"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A regression forest averages its trees. Error falls quickly and then flattens, so a hundred or so trees is usually plenty."
     }
    ]
   }
  ]
 },
 {
  "title": "Forests for classes: votes and probabilities",
  "minutes": 13,
  "sections": [
   {
    "id": "rf3-observe",
    "kicker": "1 · Observe",
    "title": "A panel that can say how split it is",
    "blocks": [
     {
      "kind": "p",
      "text": "A single tree answers “leaves” or “stays”. A forest of 300 trees has 300 answers, and the split among them is information. If 290 trees say “leaves” the call is clear. If 160 say “leaves” and 140 say “stays”, the forest is on the fence."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How should the trees' answers be combined into a prediction and a probability, and how much better is it than one tree?"
     }
    ]
   },
   {
    "id": "rf3-express",
    "kicker": "2 · Express",
    "title": "Vote, or average the probabilities",
    "blocks": [
     {
      "kind": "p",
      "text": "Hard voting counts the trees and goes with the majority. Seven trees voting 1, 1, 0, 1, 0, 1, 1 give five of seven votes for class 1: a prediction of 1, with a vote share of 0.714. Soft voting instead averages each tree's own probability, which keeps the information that a tree was fairly sure or only barely sure. Scikit-learn's forests use soft voting."
     },
     {
      "kind": "eq",
      "lines": [
       "vote share = trees saying class 1 ÷ all trees = 5 / 7 = 0.714"
      ],
      "note": "Treat the share as a score. It ranks customers well, though it is not automatically a calibrated probability."
     }
    ]
   },
   {
    "id": "rf3-visualize",
    "kicker": "3 · Visualize",
    "title": "The forest against its own best tree",
    "blocks": [
     {
      "kind": "p",
      "text": "1,200 simulated customers, 600 to train, 600 to test. We compare one fully grown tree and 300 trees together, scoring accuracy and log loss, which punishes confident wrong answers."
     },
     {
      "kind": "table",
      "caption": "Test results",
      "headers": [
       "Model",
       "Accuracy",
       "Log loss (lower is better)"
      ],
      "rows": [
       [
        "One fully grown tree",
        "0.632",
        "1.703"
       ],
       [
        "Forest of 300 trees",
        "0.703",
        "0.608"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Accuracy rises from 63 to 70 percent, but the log loss shows the larger effect: 1.70 against 0.61. The single tree gives a flat 0 or 1 for every customer, so every mistake is a maximally confident one. The forest's shares, such as 0.7 or 0.4, are far more cautious and therefore far less costly when wrong."
     }
    ]
   },
   {
    "id": "rf3-discover",
    "kicker": "4 · Discover",
    "title": "Disagreement is useful information",
    "blocks": [
     {
      "kind": "p",
      "text": "Averaging turns a coarse yes-or-no into a graded score between 0 and 1. That makes ranking possible, lets you set a threshold according to costs, and flags borderline customers for a human to look at."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A classification forest averages many trees' votes or probabilities, giving a graded score and fewer confident mistakes than a single tree."
     },
     {
      "kind": "p",
      "text": "The scores may still need calibration if you will use them as literal probabilities, because forests tend to hedge towards the middle."
     }
    ]
   },
   {
    "id": "rf3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a graded decision. Customer A gets a share of 0.92, customer B gets 0.55. Both are “leaves”, but A is a sure call and B is on the fence. A retention team with capacity for 100 calls starts with the highest shares."
     },
     {
      "kind": "p",
      "text": "Example 2, the cost of certainty. A single tree says “1.0, leaves” for a customer who stays. Log loss for that row is −ln(0.0001) ≈ 9.2 if clipped at 0.0001. A forest saying 0.7 pays −ln(0.3) = 1.2. Hedging is cheaper when you are wrong."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Triage, churn, credit and fraud scores where ranking and thresholds matter more than a bare label."
     },
     {
      "kind": "check",
      "question": "Out of 200 trees, 130 vote class 1. What is the vote share?",
      "options": [
       "0.65",
       "0.35",
       "130"
      ],
      "answer": 0,
      "why": "130 / 200 = 0.65."
     }
    ]
   },
   {
    "id": "rf3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading a share as exact",
      "text": "A share of 0.7 is a score, not necessarily a 70 percent chance. Calibrate before you rely on it."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Ignoring imbalance",
      "text": "On rare classes, shares sit well below 0.5 even for real positives. Choose a threshold from costs."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Comparing on accuracy only",
      "text": "Two models with equal accuracy can differ greatly in how well their scores are spread. Check log loss or AUC."
     }
    ]
   },
   {
    "id": "rf3-python",
    "kicker": "7 · In Python",
    "title": "A tree against 300 trees",
    "blocks": [
     {
      "kind": "code",
      "caption": "Accuracy and log loss, and a seven-tree vote",
      "code": "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import log_loss, accuracy_score\n\nrng = np.random.default_rng(6)\nn = 1200\ntenure = rng.uniform(1, 48, n)\ncalls = rng.poisson(2, n)\nbill = rng.uniform(200, 2000, n)\np = 1 / (1 + np.exp(-(1.0 - 0.08 * tenure + 0.5 * calls + 0.0008 * (bill - 1000))))\ny = (rng.random(n) < p).astype(int)\nX = np.column_stack([tenure, calls, bill])\ntr, te = slice(0, 600), slice(600, None)\n\ntree = DecisionTreeClassifier(random_state=0).fit(X[tr], y[tr])\nforest = RandomForestClassifier(n_estimators=300, random_state=0).fit(X[tr], y[tr])\nfor name, m in [(\"one deep tree\", tree), (\"forest of 300\", forest)]:\n    prob = np.clip(m.predict_proba(X[te])[:, 1], 0.01, 0.99)\n    print(name.ljust(14), \"accuracy\", round(accuracy_score(y[te], prob > 0.5), 3), \"log loss\", round(log_loss(y[te], prob), 3))\n\nvotes = np.array([1, 1, 0, 1, 0, 1, 1])\nprint(\"seven trees vote:\", votes, \"-> hard vote\", int(votes.mean() > 0.5), \"share\", round(votes.mean(), 3))",
      "output": "one deep tree  accuracy 0.632 log loss 1.703\nforest of 300  accuracy 0.703 log loss 0.608\nseven trees vote: [1 1 0 1 0 1 1] -> hard vote 1 share 0.714"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A forest turns many votes into a graded score. It misses less confidently than one tree."
     }
    ]
   }
  ]
 },
 {
  "title": "A free validation set inside the forest",
  "minutes": 12,
  "sections": [
   {
    "id": "rf4-observe",
    "kicker": "1 · Observe",
    "title": "Every tree has rows it never saw",
    "blocks": [
     {
      "kind": "p",
      "text": "Each tree is grown on a bootstrap sample that leaves out about 37 percent of the rows. For a given row, roughly a third of the trees never saw it. Those trees can be asked about that row, as if it were fresh data, and no row was set aside to make this possible."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Can a forest estimate its own accuracy on new data without a separate validation set?"
     }
    ]
   },
   {
    "id": "rf4-express",
    "kicker": "2 · Express",
    "title": "Out-of-bag predictions",
    "blocks": [
     {
      "kind": "p",
      "text": "For each training row, collect predictions only from the trees that did not include it. Combine them as usual. Do this for every row and compare with the true labels. The resulting score is the out-of-bag (OOB) score."
     },
     {
      "kind": "eq",
      "lines": [
       "trees that never saw a row ≈ B × (1 − 1/n)ⁿ ≈ 0.368 × B"
      ],
      "note": "With 400 trees and 1,050 rows, about 147 trees never saw any given row."
     }
    ]
   },
   {
    "id": "rf4-visualize",
    "kicker": "3 · Visualize",
    "title": "Three numbers for the same forest",
    "blocks": [
     {
      "kind": "table",
      "caption": "1,500 simulated customers, forest of 400 trees",
      "headers": [
       "Score",
       "Value"
      ],
      "rows": [
       [
        "Training accuracy",
        "1.000"
       ],
       [
        "Out-of-bag accuracy",
        "0.777"
       ],
       [
        "Held-out test accuracy",
        "0.778"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The training accuracy of 1.000 is memory: every row helped build most of the trees. The out-of-bag score, 0.777, uses only trees that did not see each row, and lands within a tenth of a point of the true held-out score of 0.778. That is a close match, without setting any data aside."
     }
    ]
   },
   {
    "id": "rf4-discover",
    "kicker": "4 · Discover",
    "title": "Free, but not a replacement for a test set",
    "blocks": [
     {
      "kind": "p",
      "text": "OOB is excellent for quick checks and for choosing settings such as the number of trees or the depth, using all your data for training. It is not a substitute for a final untouched test set, because once you choose settings by OOB score, the OOB score has been used for tuning."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Because each tree leaves out a third of the rows, a forest can score itself on rows it never saw, giving a nearly free estimate of new-data accuracy."
     },
     {
      "kind": "p",
      "text": "For small datasets this is especially valuable, since you do not have to give up rows to validation."
     }
    ]
   },
   {
    "id": "rf4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, tuning cheaply. Try 100, 200 and 400 trees and read the OOB score for each. No cross-validation loops are needed. When the OOB score stops improving you have enough trees."
     },
     {
      "kind": "p",
      "text": "Example 2, a warning sign. Training accuracy is 1.000 and OOB accuracy is 0.62. The big gap says the model is memorising and not generalising. Increase the minimum leaf size or reduce depth."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Quick model checks, small datasets, and settings searches where cross-validation would be too slow."
     },
     {
      "kind": "check",
      "question": "A forest scores 1.00 on training data and 0.78 out-of-bag. Which number estimates performance on new data?",
      "options": [
       "0.78",
       "1.00",
       "The average, 0.89"
      ],
      "answer": 0,
      "why": "The OOB score uses only trees that never saw each row, so it behaves like held-out data. The training score measures memory."
     }
    ]
   },
   {
    "id": "rf4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Using the training score",
      "text": "Forests memorise their training rows. The training score is always close to perfect."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Treating OOB as a final test",
      "text": "After tuning on OOB, keep a separate test set for the last check."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Too few trees",
      "text": "With a handful of trees, some rows have no out-of-bag trees at all, and the estimate is unreliable."
     }
    ]
   },
   {
    "id": "rf4-python",
    "kicker": "7 · In Python",
    "title": "Three scores for one forest",
    "blocks": [
     {
      "kind": "code",
      "caption": "Training, out-of-bag and test accuracy",
      "code": "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score\n\nrng = np.random.default_rng(14)\nn = 1500\nX = rng.normal(size=(n, 6))\ny = ((X[:, 0] + 0.8 * X[:, 1] - 0.6 * X[:, 2] + rng.normal(0, 1.0, n)) > 0).astype(int)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)\n\nforest = RandomForestClassifier(n_estimators=400, oob_score=True, random_state=0).fit(X_tr, y_tr)\nprint(\"out-of-bag accuracy (no extra data needed):\", round(forest.oob_score_, 3))\nprint(\"held-out test accuracy                    :\", round(accuracy_score(y_te, forest.predict(X_te)), 3))\nprint(\"training accuracy (memorised)             :\", round(forest.score(X_tr, y_tr), 3))\n\nnever_saw = forest.n_estimators * (1 - 1 / len(X_tr)) ** len(X_tr)\nprint(\"trees that never saw a given row, on average:\", round(never_saw), \"of\", forest.n_estimators)",
      "output": "out-of-bag accuracy (no extra data needed): 0.777\nheld-out test accuracy                    : 0.778\ntraining accuracy (memorised)             : 1.0\ntrees that never saw a given row, on average: 147 of 400"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Out-of-bag accuracy is a free, honest estimate. The training score never is."
     }
    ]
   }
  ]
 },
 {
  "title": "Which columns matter, and is a forest always better?",
  "minutes": 13,
  "sections": [
   {
    "id": "rf5-observe",
    "kicker": "1 · Observe",
    "title": "The model says promo does not matter much, and it is wrong",
    "blocks": [
     {
      "kind": "p",
      "text": "A forest comes with a built-in ranking of columns, its feature importance. On a simulated customer dataset it says a pure-noise column, a random number per customer, is nearly as important as the real drivers. A manager reading that chart would waste a month investigating random numbers."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Can you trust a forest's importance chart, and when is a forest actually the right model?"
     }
    ]
   },
   {
    "id": "rf5-express",
    "kicker": "2 · Express",
    "title": "Two ways to measure importance",
    "blocks": [
     {
      "kind": "p",
      "text": "The built-in importance adds up how much each column reduced impurity across all splits. Permutation importance asks a more direct question: shuffle one column on held-out data, breaking its link to the outcome, and see how much the score falls. A column that matters will hurt when shuffled."
     },
     {
      "kind": "eq",
      "lines": [
       "permutation importance = score before − score after shuffling the column"
      ],
      "note": "Computed on held-out data, so it reflects what generalises, not what the trees memorised."
     }
    ]
   },
   {
    "id": "rf5-visualize",
    "kicker": "3 · Visualize",
    "title": "The noise column fools one method and not the other",
    "blocks": [
     {
      "kind": "p",
      "text": "1,500 customers. “Promo” is a real yes-or-no driver, “usage” is a real continuous driver, and “noise_id” is a random number with no link to the outcome."
     },
     {
      "kind": "table",
      "caption": "Two importance measures for the same forest",
      "headers": [
       "Column",
       "Built-in importance",
       "Permutation importance (drop in accuracy)"
      ],
      "rows": [
       [
        "promo (real, binary)",
        "0.138",
        "0.077"
       ],
       [
        "usage (real, continuous)",
        "0.488",
        "0.056"
       ],
       [
        "noise_id (pure noise)",
        "0.375",
        "−0.023"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The built-in measure gives the noise column 0.375, almost as much as the real driver usage, and promo, the strongest driver, only 0.138. The reason is that a continuous column offers many places to cut, so it gets many chances to look useful by luck. Permutation importance puts promo first, usage second, and noise below zero, which is exactly right: shuffling noise does not hurt, and its tiny negative score is chance."
     }
    ]
   },
   {
    "id": "rf5-discover",
    "kicker": "4 · Discover",
    "title": "Forests are strong, not universal",
    "blocks": [
     {
      "kind": "table",
      "caption": "Test AUC on the same data",
      "headers": [
       "Model",
       "AUC"
      ],
      "rows": [
       [
        "Logistic regression",
        "0.803"
       ],
       [
        "One tree, depth 4",
        "0.772"
       ],
       [
        "Forest of 300",
        "0.732"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Here the best model is logistic regression, because the true rule is a simple additive one with noise. The forest spends its flexibility fitting noise. Forests shine where relationships are irregular, with interactions and jumps, and lose where a simple smooth rule is the truth."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Trust permutation importance on held-out data over the built-in chart, and always compare a forest to a simple baseline before assuming it is better."
     }
    ]
   },
   {
    "id": "rf5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a decision. Permutation importance says promo drops accuracy by 7.7 points when shuffled. That is a column worth investing in. The built-in chart would have buried it under the noise column."
     },
     {
      "kind": "p",
      "text": "Example 2, a model choice. A forest scores 0.73 against 0.80 for logistic regression. The simpler model wins and is easier to explain. You only learn this by running both on the same split."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Any model you must justify, and any model comparison. Importance guides where to look, and does not prove cause."
     },
     {
      "kind": "check",
      "question": "A column's built-in importance is high but shuffling it on test data does not change accuracy. What does that suggest?",
      "options": [
       "The column is probably noise the trees used to memorise",
       "The column is crucial",
       "Accuracy is broken"
      ],
      "answer": 0,
      "why": "If shuffling a column does not hurt held-out performance, the model is not really relying on it for generalisation."
     }
    ]
   },
   {
    "id": "rf5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting built-in importance with mixed column types",
      "text": "It favours columns with many distinct values. Cross-check with permutation importance."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading importance as cause",
      "text": "A column can predict without causing. Importance ranks usefulness for prediction."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Shuffling only one of a correlated pair",
      "text": "If two columns carry the same signal, shuffling one leaves the other to cover for it, and the first looks unimportant. Shuffle them together."
     }
    ]
   },
   {
    "id": "rf5-python",
    "kicker": "7 · In Python",
    "title": "Two importance measures and a model comparison",
    "blocks": [
     {
      "kind": "code",
      "caption": "Built-in versus permutation importance, then AUC for three models",
      "code": "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import roc_auc_score\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\nrng = np.random.default_rng(3)\nn = 1500\npromo = rng.integers(0, 2, n)                       # a real, binary driver\nusage = rng.normal(size=n)                          # a real, continuous driver\nnoise_id = rng.normal(size=n)                       # pure noise, but many distinct values\ny = ((1.2 * promo + 0.6 * usage + rng.normal(0, 1.0, n)) > 0.7).astype(int)\nX = np.column_stack([promo, usage, noise_id])\nnames = [\"promo\", \"usage\", \"noise_id\"]\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.33, random_state=0)\n\nforest = RandomForestClassifier(n_estimators=300, min_samples_leaf=1, random_state=0).fit(X_tr, y_tr)\nperm = permutation_importance(forest, X_te, y_te, n_repeats=20, random_state=0)\nprint(\"column      built-in importance   permutation importance (drop in accuracy)\")\nfor i, name in enumerate(names):\n    print(name.ljust(10), str(round(forest.feature_importances_[i], 3)).ljust(20), round(perm.importances_mean[i], 3))\n\nfor name, m in [(\"logistic\", LogisticRegression()), (\"one tree\", DecisionTreeClassifier(max_depth=4, random_state=0)), (\"forest\", forest)]:\n    m.fit(X_tr, y_tr)\n    print(name.ljust(9), \"test AUC\", round(roc_auc_score(y_te, m.predict_proba(X_te)[:, 1]), 3))",
      "output": "column      built-in importance   permutation importance (drop in accuracy)\npromo      0.138                0.077\nusage      0.488                0.056\nnoise_id   0.375                -0.023\nlogistic  test AUC 0.803\none tree  test AUC 0.772\nforest    test AUC 0.732"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Use held-out permutation importance, and always race the forest against a simple model."
     }
    ]
   }
  ]
 }
];
