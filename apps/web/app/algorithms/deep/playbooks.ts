import type {DeepLesson} from "../../math/teaching/deep-read";
/** Per-algorithm playbooks: why use it, the idea drawn, build it from scratch, use scikit-learn, tune, choose, pitfalls. Keyed by the /algorithms/<key>/playbook route. */
export const PLAYBOOKS:Record<string,DeepLesson>={
 "linear-regression": {
  "title": "Linear regression: build it, use it, decide when it fits",
  "minutes": 14,
  "sections": [
   {
    "id": "lrpb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "Start here whenever the thing you predict is a number and you want to explain the prediction to someone. A flat's price in ₹ lakh is the classic case: area, age and locality push the price up or down by an amount you can state. Linear regression gives you those amounts directly, so the model doubles as an explanation."
     },
     {
      "kind": "table",
      "caption": "Is linear regression a fit for your problem?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Is the target a number?",
        "Regression is the right family. A category needs logistic regression or a classifier."
       ],
       [
        "Do you need to explain each feature's effect?",
        "Coefficients are the explanation. Few models offer it so plainly."
       ],
       [
        "Is the relationship roughly a straight line, or can you straighten it with a feature?",
        "A line will do well. Otherwise add features or pick a curved model."
       ],
       [
        "Do you have few rows, or need a fast, stable baseline?",
        "Linear models train in a blink and rarely overfit when features are few."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "How do I build linear regression myself, run it properly in scikit-learn, and know when it is the right model?"
     }
    ]
   },
   {
    "id": "lrpb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Fit the line that makes the squared misses smallest. The picture shows 45 flats: the average price (dashed) ignores area entirely, while the fitted line uses it."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Price against area, with a fitted line and the plain average",
       "alt": "Scatter of price against area for flats. Prices rise with area. A fitted straight line follows the points closely, while the flat average line misses most of them.",
       "xLabel": "Area (sq m)",
       "yLabel": "Price (₹ lakh)",
       "series": [
        {
         "name": "Flats",
         "style": "points",
         "pts": [
          [
           32.39,
           28.78
          ],
          [
           43.3,
           29.09
          ],
          [
           43.76,
           32.87
          ],
          [
           46.41,
           36.2
          ],
          [
           46.72,
           46.35
          ],
          [
           47.29,
           37.34
          ],
          [
           59.97,
           63.15
          ],
          [
           59.98,
           46.19
          ],
          [
           60.42,
           42.84
          ],
          [
           60.82,
           45.26
          ],
          [
           63.3,
           58.12
          ],
          [
           63.48,
           47.85
          ],
          [
           65.92,
           61.93
          ],
          [
           66.76,
           65.93
          ],
          [
           70.92,
           57.66
          ],
          [
           72.13,
           72.81
          ],
          [
           73.85,
           61.19
          ],
          [
           74.66,
           57.23
          ],
          [
           79.44,
           65.3
          ],
          [
           82.54,
           67.99
          ],
          [
           86.85,
           66.79
          ],
          [
           87.81,
           62.05
          ],
          [
           88.7,
           81.52
          ],
          [
           90.02,
           67.48
          ],
          [
           91.54,
           78.41
          ],
          [
           91.96,
           88.73
          ],
          [
           92.83,
           78.78
          ],
          [
           99.41,
           74.54
          ],
          [
           99.73,
           82.15
          ],
          [
           102.7,
           73.4
          ],
          [
           110.3,
           98.29
          ],
          [
           115.15,
           92.21
          ],
          [
           119.0,
           89.84
          ],
          [
           120.4,
           85.89
          ],
          [
           123.44,
           95.53
          ],
          [
           128.01,
           96.65
          ],
          [
           130.51,
           111.98
          ],
          [
           131.16,
           114.0
          ],
          [
           131.35,
           117.29
          ],
          [
           144.41,
           127.42
          ],
          [
           144.72,
           119.82
          ],
          [
           144.83,
           108.11
          ],
          [
           145.12,
           111.82
          ],
          [
           145.54,
           126.62
          ],
          [
           146.89,
           125.9
          ]
         ]
        },
        {
         "name": "Fitted line",
         "style": "line",
         "pts": [
          [
           30.0,
           26.73
          ],
          [
           150.0,
           122.32
          ]
         ]
        },
        {
         "name": "Average price",
         "style": "line",
         "dash": true,
         "pts": [
          [
           30.0,
           73.63
          ],
          [
           150.0,
           73.63
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "prediction = intercept + w₁ × area + w₂ × age",
       "loss = average of (prediction − actual)²",
       "best w solves  (XᵀX) w = Xᵀ y"
      ],
      "note": "The intercept is the price of a flat with every feature at zero, a baseline rather than a real flat."
     }
    ]
   },
   {
    "id": "lrpb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "p",
      "text": "Seven lines of NumPy are enough. Follow the steps, then run the code."
     },
     {
      "kind": "steps",
      "items": [
       "Put the features in a matrix X with one row per flat and a first column of ones for the intercept.",
       "Solve the normal equation (XᵀX) w = Xᵀ y with np.linalg.solve. Do not invert XᵀX; solving is faster and steadier.",
       "Or learn w by gradient descent: start at zero, move against the gradient 2/n · Zᵀ(Zw − y) a small step at a time. Standardise the features first so one learning rate suits every column.",
       "Check that both routes agree. If they do not, a shape or a learning rate is wrong."
      ]
     },
     {
      "kind": "code",
      "caption": "Normal equation and gradient descent give the same weights",
      "code": "import numpy as np\n\nrng = np.random.default_rng(10)\nn = 200\narea = rng.uniform(30, 150, n)                  # square metres\nage = rng.uniform(0, 30, n)                     # building age in years\nprice = 0.8 * area - 0.5 * age + 10 + rng.normal(0, 5, n)   # price in lakh rupees\n\n# Step 1: put the features in a matrix with a column of ones for the intercept\nX = np.column_stack([np.ones(n), area, age])\nprint(\"X shape:\", X.shape, \"| y shape:\", price.shape)\n\n# Step 2: the normal equation  (X'X) w = X'y  -- solve, never invert\nw_exact = np.linalg.solve(X.T @ X, X.T @ price)\nprint(\"normal equation  [intercept, area, age]:\", w_exact.round(3))\n\n# Step 3: gradient descent on standardised features reaches the same answer\nmu, sd = X[:, 1:].mean(axis=0), X[:, 1:].std(axis=0)\nZ = np.column_stack([np.ones(n), (X[:, 1:] - mu) / sd])\nw = np.zeros(3)\nfor step in range(500):\n    grad = 2 / n * Z.T @ (Z @ w - price)\n    w -= 0.1 * grad\n# convert back to the original units\nw_gd = np.array([w[0] - np.sum(w[1:] * mu / sd), *(w[1:] / sd)])\nprint(\"gradient descent [intercept, area, age]:\", w_gd.round(3))\nprint(\"same answer:\", bool(np.allclose(w_exact, w_gd, atol=0.01)))",
      "output": "X shape: (200, 3) | y shape: (200,)\nnormal equation  [intercept, area, age]: [ 9.593  0.8   -0.465]\ngradient descent [intercept, area, age]: [ 9.593  0.8   -0.465]\nsame answer: True"
     },
     {
      "kind": "p",
      "text": "Both routes land on an intercept of 9.593 lakh, +0.80 lakh for each extra square metre and −0.465 lakh for each extra year of age. The data was made with 10, 0.8 and −0.5, so the fit recovers the pattern with a little noise."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The closed form is exact and instant for a few features. Gradient descent is what you will reuse for models that have no closed form."
     }
    ]
   },
   {
    "id": "lrpb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split first: hold back a quarter of the flats for the final test.",
       "Build a pipeline: StandardScaler then LinearRegression. Scaling is not needed for the fit itself, but it makes coefficients comparable.",
       "Cross-validate on the training rows to estimate the error without touching the test set.",
       "Fit on all training rows, then score once on the test rows and compare with an always-the-average baseline."
      ]
     },
     {
      "kind": "code",
      "caption": "A scaled pipeline, cross-validation, a baseline and a single test score",
      "code": "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.dummy import DummyRegressor\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.metrics import mean_absolute_error\n\nrng = np.random.default_rng(10)\nn = 200\narea = rng.uniform(30, 150, n)\nage = rng.uniform(0, 30, n)\nprice = 0.8 * area - 0.5 * age + 10 + rng.normal(0, 5, n)\nX = np.column_stack([area, age])\n\nXtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.25, random_state=0)\nmodel = make_pipeline(StandardScaler(), LinearRegression())\ncv = -cross_val_score(model, Xtr, ytr, cv=5, scoring=\"neg_mean_absolute_error\")\nprint(\"cross-validated MAE (lakh):\", cv.round(2), \"mean\", round(float(cv.mean()), 2))\nmodel.fit(Xtr, ytr)\nbase = DummyRegressor().fit(Xtr, ytr)\nprint(\"test MAE: model\", round(float(mean_absolute_error(yte, model.predict(Xte))), 2), \"| always-the-average\", round(float(mean_absolute_error(yte, base.predict(Xte))), 2))\nlin = model.named_steps[\"linearregression\"]\nprint(\"coefficients per standard deviation [area, age]:\", lin.coef_.round(2))",
      "output": "cross-validated MAE (lakh): [3.7  5.27 3.85 4.72 4.21] mean 4.35\ntest MAE: model 3.71 | always-the-average 24.41\ncoefficients per standard deviation [area, age]: [26.69 -3.9 ]"
     },
     {
      "kind": "p",
      "text": "The model's test error is ₹3.71 lakh, against ₹24.41 lakh for always guessing the average. Cross-validation gave 4.35 on average with folds from 3.70 to 5.27, a hint of how much one split can move the number."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every later model in this course is compared with this one. A complicated model must beat a tuned linear baseline by enough to justify its cost."
     }
    ]
   },
   {
    "id": "lrpb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "Linear regression has no dials to tune, so the work is reading it. The coefficients per standard deviation, 26.69 for area and −3.90 for age, say area moves the price roughly seven times as much as age across the typical range. Then check the residuals: a good R² can hide a bent relationship."
     },
     {
      "kind": "code",
      "caption": "When R² looks fine and the line is still wrong",
      "code": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.model_selection import cross_val_score\n\nrng = np.random.default_rng(3)\nx = rng.uniform(0, 10, 150)\ny_line = 4 * x + 5 + rng.normal(0, 3, 150)\ny_curve = 0.6 * x ** 2 + rng.normal(0, 3, 150)\n\ndef r2(y):\n    X = x.reshape(-1, 1)\n    return round(float(cross_val_score(LinearRegression(), X, y, cv=5, scoring=\"r2\").mean()), 3)\n\nprint(\"straight-line data, R2 of a line:\", r2(y_line))\nprint(\"curved data, R2 of a line       :\", r2(y_curve))\n\nfit = LinearRegression().fit(x.reshape(-1, 1), y_curve)\nresid = y_curve - fit.predict(x.reshape(-1, 1))\nfor lo, hi in [(0, 2.5), (2.5, 5), (5, 7.5), (7.5, 10)]:\n    m = (x >= lo) & (x < hi)\n    print(f\"x in [{lo}, {hi}): average miss {resid[m].mean():+.2f}\")\n\ncurve_fix = make_pipeline(PolynomialFeatures(2), LinearRegression())\nprint(\"curved data, R2 with an x^2 feature:\", round(float(cross_val_score(curve_fix, x.reshape(-1, 1), y_curve, cv=5, scoring=\"r2\").mean()), 3))",
      "output": "straight-line data, R2 of a line: 0.93\ncurved data, R2 of a line       : 0.919\nx in [0, 2.5): average miss +2.58\nx in [2.5, 5): average miss -2.37\nx in [5, 7.5): average miss -2.31\nx in [7.5, 10): average miss +3.62\ncurved data, R2 with an x^2 feature: 0.965"
     },
     {
      "kind": "p",
      "text": "On the curved data a straight line scores R² 0.919, which sounds excellent. But the average miss is +2.58 at the left, about −2.4 in the middle and +3.62 at the right: the line is wrong in a pattern. Adding an x² feature lifts R² to 0.965 and removes the pattern."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "A straight line on curved data",
       "alt": "Points follow a curve that bends upward. A straight line passes below the points at both ends and above them in the middle, while a line fitted with an x squared feature follows the curve.",
       "xLabel": "x",
       "yLabel": "y",
       "series": [
        {
         "name": "Curved data",
         "style": "points",
         "pts": [
          [
           0.01,
           1.64
          ],
          [
           0.52,
           4.2
          ],
          [
           0.86,
           0.57
          ],
          [
           0.93,
           -1.82
          ],
          [
           1.04,
           3.77
          ],
          [
           1.27,
           6.18
          ],
          [
           1.6,
           -0.42
          ],
          [
           1.8,
           4.16
          ],
          [
           1.97,
           -2.99
          ],
          [
           2.06,
           0.57
          ],
          [
           2.14,
           5.01
          ],
          [
           2.37,
           -3.36
          ],
          [
           2.62,
           7.17
          ],
          [
           2.84,
           0.94
          ],
          [
           2.97,
           6.51
          ],
          [
           3.14,
           4.5
          ],
          [
           3.4,
           5.71
          ],
          [
           3.49,
           10.77
          ],
          [
           3.74,
           10.42
          ],
          [
           3.9,
           5.13
          ],
          [
           3.94,
           5.3
          ],
          [
           4.05,
           11.27
          ],
          [
           4.33,
           7.21
          ],
          [
           4.79,
           14.87
          ],
          [
           4.81,
           16.19
          ],
          [
           4.95,
           13.57
          ],
          [
           5.23,
           16.9
          ],
          [
           5.45,
           21.05
          ],
          [
           5.62,
           20.67
          ],
          [
           5.72,
           23.43
          ],
          [
           5.85,
           16.67
          ],
          [
           6.07,
           20.05
          ],
          [
           6.24,
           27.95
          ],
          [
           6.58,
           28.33
          ],
          [
           6.69,
           29.23
          ],
          [
           6.83,
           26.12
          ],
          [
           7.06,
           31.64
          ],
          [
           7.08,
           32.66
          ],
          [
           7.38,
           32.76
          ],
          [
           7.44,
           27.08
          ],
          [
           7.52,
           34.82
          ],
          [
           7.74,
           34.48
          ],
          [
           8.01,
           36.8
          ],
          [
           8.2,
           42.6
          ],
          [
           8.49,
           41.74
          ],
          [
           8.59,
           42.31
          ],
          [
           8.92,
           46.73
          ],
          [
           9.21,
           51.64
          ],
          [
           9.47,
           55.94
          ],
          [
           9.65,
           55.17
          ]
         ]
        },
        {
         "name": "Straight line",
         "style": "line",
         "pts": [
          [
           0.0,
           -10.99
          ],
          [
           0.34,
           -8.9
          ],
          [
           0.69,
           -6.81
          ],
          [
           1.03,
           -4.72
          ],
          [
           1.38,
           -2.63
          ],
          [
           1.72,
           -0.54
          ],
          [
           2.07,
           1.55
          ],
          [
           2.41,
           3.64
          ],
          [
           2.76,
           5.73
          ],
          [
           3.1,
           7.82
          ],
          [
           3.45,
           9.91
          ],
          [
           3.79,
           12.0
          ],
          [
           4.14,
           14.09
          ],
          [
           4.48,
           16.18
          ],
          [
           4.83,
           18.27
          ],
          [
           5.17,
           20.36
          ],
          [
           5.52,
           22.45
          ],
          [
           5.86,
           24.54
          ],
          [
           6.21,
           26.63
          ],
          [
           6.55,
           28.72
          ],
          [
           6.9,
           30.81
          ],
          [
           7.24,
           32.9
          ],
          [
           7.59,
           34.99
          ],
          [
           7.93,
           37.08
          ],
          [
           8.28,
           39.17
          ],
          [
           8.62,
           41.26
          ],
          [
           8.97,
           43.35
          ],
          [
           9.31,
           45.44
          ],
          [
           9.66,
           47.53
          ],
          [
           10.0,
           49.62
          ]
         ]
        },
        {
         "name": "With an x² feature",
         "style": "line",
         "dash": true,
         "pts": [
          [
           0.0,
           -1.56
          ],
          [
           0.34,
           -1.24
          ],
          [
           0.69,
           -0.79
          ],
          [
           1.03,
           -0.21
          ],
          [
           1.38,
           0.49
          ],
          [
           1.72,
           1.32
          ],
          [
           2.07,
           2.28
          ],
          [
           2.41,
           3.36
          ],
          [
           2.76,
           4.57
          ],
          [
           3.1,
           5.91
          ],
          [
           3.45,
           7.37
          ],
          [
           3.79,
           8.96
          ],
          [
           4.14,
           10.67
          ],
          [
           4.48,
           12.52
          ],
          [
           4.83,
           14.48
          ],
          [
           5.17,
           16.58
          ],
          [
           5.52,
           18.8
          ],
          [
           5.86,
           21.15
          ],
          [
           6.21,
           23.63
          ],
          [
           6.55,
           26.23
          ],
          [
           6.9,
           28.96
          ],
          [
           7.24,
           31.81
          ],
          [
           7.59,
           34.79
          ],
          [
           7.93,
           37.9
          ],
          [
           8.28,
           41.14
          ],
          [
           8.62,
           44.5
          ],
          [
           8.97,
           47.99
          ],
          [
           9.31,
           51.6
          ],
          [
           9.66,
           55.34
          ],
          [
           10.0,
           59.21
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Look at residuals by region of the data. Misses that change sign as x grows mean the model is missing a curve."
     }
    ]
   },
   {
    "id": "lrpb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "Linear regression against its neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "Target is a number, effect should be explainable",
        "Linear regression",
        "Coefficients are the explanation."
       ],
       [
        "The relationship bends",
        "Polynomial regression, or a tree-based model",
        "A line cannot follow a curve; add curved features or use a model that bends."
       ],
       [
        "Many correlated features, or more features than rows",
        "Ridge or Lasso",
        "A penalty steadies the weights."
       ],
       [
        "Target is a yes/no",
        "Logistic regression",
        "A line can predict outside 0 to 1."
       ],
       [
        "Interactions between features dominate",
        "Gradient boosting or a random forest",
        "They find interactions without you naming them."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A practical rule: always fit the linear baseline first. If a fancier model improves test error by less than the spread across cross-validation folds, keep the linear one."
     },
     {
      "kind": "check",
      "question": "Residuals are positive at both ends and negative in the middle. What does that suggest?",
      "options": [
       "The model is overfitting",
       "A curve is missing from the model",
       "The target is categorical"
      ],
      "answer": 1,
      "why": "A U-shaped residual pattern means the straight line cannot follow a bend. Add a curved feature."
     }
    ]
   },
   {
    "id": "lrpb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting R² alone",
      "text": "0.919 on curved data looked excellent. Always plot or tabulate residuals."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Extrapolating",
      "text": "A line keeps rising forever. A 400 sq m flat is far outside data that stops at 150."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading coefficients as causes",
      "text": "Area and price move together, but a bigger flat is not what raises the price in a neighbourhood. Correlated features also make coefficients unstable."
     },
     {
      "kind": "p",
      "text": "In the pipeline, check three things before you trust a result: the features were scaled using training rows only, the test set was used once, and the baseline error is stated beside the model's."
     }
    ]
   }
  ]
 },
 "polynomial": {
  "title": "Polynomial regression: bend the line, then keep it honest",
  "minutes": 14,
  "sections": [
   {
    "id": "popb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "Some relationships bend. Electricity bills rise in cold and in hot months and bottom out in between; delivery times grow faster than distance; a salary rises quickly early in a career and then flattens. A straight line is the wrong shape for all of these. Polynomial regression keeps everything you know about linear regression and adds columns that let the line bend."
     },
     {
      "kind": "table",
      "caption": "Is polynomial regression a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Does a scatter plot show a smooth bend, not a jump?",
        "Powers of x describe smooth bends well."
       ],
       [
        "Do you still want one equation you can write down?",
        "The curve is an equation: bill = a + b·t + c·t²."
       ],
       [
        "Is there one main driver, or a few?",
        "Polynomials explode in size with many features."
       ],
       [
        "Will predictions stay inside the range of your data?",
        "Outside the data a polynomial can fly away. Plan for that."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "How do I build a curve from straight-line tools, choose how much to bend, and know when to stop?"
     }
    ]
   },
   {
    "id": "popb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "A curve is still a straight-line model in disguise: replace the single column t with the columns 1, t, t², t³ and fit weights to those. The model is linear in the weights, so the same least-squares machinery works. The only new decision is the degree, which sets how flexible the curve is."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Electricity bill against temperature: underfit, right fit, overfit",
       "alt": "Monthly electricity bill in rupees against average temperature. The bill is high in cold and hot months and lowest around 29 degrees, a U shape. A straight line misses the U, a degree 2 curve follows it, and a degree 10 curve wiggles at the edges.",
       "xLabel": "Average temperature (°C)",
       "yLabel": "Bill (₹)",
       "series": [
        {
         "name": "Months",
         "style": "points",
         "pts": [
          [
           16.16,
           2214.62
          ],
          [
           17.76,
           1826.51
          ],
          [
           18.14,
           1863.13
          ],
          [
           19.5,
           1393.02
          ],
          [
           20.64,
           1568.38
          ],
          [
           21.06,
           1554.37
          ],
          [
           22.85,
           1094.76
          ],
          [
           23.95,
           1081.72
          ],
          [
           25.17,
           903.77
          ],
          [
           26.55,
           987.44
          ],
          [
           27.2,
           891.21
          ],
          [
           27.68,
           1020.0
          ],
          [
           28.15,
           814.38
          ],
          [
           29.13,
           791.45
          ],
          [
           30.33,
           1048.81
          ],
          [
           30.68,
           1092.72
          ],
          [
           32.76,
           1024.55
          ],
          [
           33.0,
           993.51
          ],
          [
           34.0,
           1035.0
          ],
          [
           34.72,
           1064.3
          ],
          [
           35.39,
           1018.25
          ],
          [
           35.78,
           1292.45
          ],
          [
           36.06,
           1351.32
          ],
          [
           37.98,
           1542.57
          ],
          [
           39.43,
           1939.98
          ],
          [
           40.06,
           1932.9
          ],
          [
           40.86,
           1998.07
          ],
          [
           41.74,
           2224.51
          ],
          [
           41.93,
           2038.16
          ],
          [
           44.02,
           2684.54
          ]
         ]
        },
        {
         "name": "Degree 1",
         "style": "line",
         "pts": [
          [
           15.0,
           1083.5
          ],
          [
           15.77,
           1098.63
          ],
          [
           16.54,
           1113.76
          ],
          [
           17.31,
           1128.89
          ],
          [
           18.08,
           1144.02
          ],
          [
           18.85,
           1159.14
          ],
          [
           19.62,
           1174.27
          ],
          [
           20.38,
           1189.4
          ],
          [
           21.15,
           1204.53
          ],
          [
           21.92,
           1219.66
          ],
          [
           22.69,
           1234.79
          ],
          [
           23.46,
           1249.92
          ],
          [
           24.23,
           1265.04
          ],
          [
           25.0,
           1280.17
          ],
          [
           25.77,
           1295.3
          ],
          [
           26.54,
           1310.43
          ],
          [
           27.31,
           1325.56
          ],
          [
           28.08,
           1340.69
          ],
          [
           28.85,
           1355.82
          ],
          [
           29.62,
           1370.94
          ],
          [
           30.38,
           1386.07
          ],
          [
           31.15,
           1401.2
          ],
          [
           31.92,
           1416.33
          ],
          [
           32.69,
           1431.46
          ],
          [
           33.46,
           1446.59
          ],
          [
           34.23,
           1461.72
          ],
          [
           35.0,
           1476.85
          ],
          [
           35.77,
           1491.97
          ],
          [
           36.54,
           1507.1
          ],
          [
           37.31,
           1522.23
          ],
          [
           38.08,
           1537.36
          ],
          [
           38.85,
           1552.49
          ],
          [
           39.62,
           1567.62
          ],
          [
           40.38,
           1582.75
          ],
          [
           41.15,
           1597.87
          ],
          [
           41.92,
           1613.0
          ],
          [
           42.69,
           1628.13
          ],
          [
           43.46,
           1643.26
          ],
          [
           44.23,
           1658.39
          ],
          [
           45.0,
           1673.52
          ]
         ]
        },
        {
         "name": "Degree 2",
         "style": "line",
         "pts": [
          [
           15.0,
           2361.91
          ],
          [
           15.77,
           2203.61
          ],
          [
           16.54,
           2054.3
          ],
          [
           17.31,
           1913.99
          ],
          [
           18.08,
           1782.67
          ],
          [
           18.85,
           1660.34
          ],
          [
           19.62,
           1547.0
          ],
          [
           20.38,
           1442.65
          ],
          [
           21.15,
           1347.3
          ],
          [
           21.92,
           1260.94
          ],
          [
           22.69,
           1183.57
          ],
          [
           23.46,
           1115.2
          ],
          [
           24.23,
           1055.81
          ],
          [
           25.0,
           1005.42
          ],
          [
           25.77,
           964.02
          ],
          [
           26.54,
           931.61
          ],
          [
           27.31,
           908.2
          ],
          [
           28.08,
           893.77
          ],
          [
           28.85,
           888.34
          ],
          [
           29.62,
           891.9
          ],
          [
           30.38,
           904.46
          ],
          [
           31.15,
           926.0
          ],
          [
           31.92,
           956.54
          ],
          [
           32.69,
           996.07
          ],
          [
           33.46,
           1044.59
          ],
          [
           34.23,
           1102.11
          ],
          [
           35.0,
           1168.61
          ],
          [
           35.77,
           1244.11
          ],
          [
           36.54,
           1328.6
          ],
          [
           37.31,
           1422.09
          ],
          [
           38.08,
           1524.56
          ],
          [
           38.85,
           1636.03
          ],
          [
           39.62,
           1756.49
          ],
          [
           40.38,
           1885.94
          ],
          [
           41.15,
           2024.38
          ],
          [
           41.92,
           2171.82
          ],
          [
           42.69,
           2328.25
          ],
          [
           43.46,
           2493.67
          ],
          [
           44.23,
           2668.08
          ],
          [
           45.0,
           2851.49
          ]
         ]
        },
        {
         "name": "Degree 10",
         "style": "line",
         "dash": true,
         "pts": [
          [
           15.0,
           1232.07
          ],
          [
           15.77,
           2078.8
          ],
          [
           16.54,
           2140.97
          ],
          [
           17.31,
           1949.18
          ],
          [
           18.08,
           1739.0
          ],
          [
           18.85,
           1585.43
          ],
          [
           19.62,
           1488.27
          ],
          [
           20.38,
           1422.03
          ],
          [
           21.15,
           1361.8
          ],
          [
           21.92,
           1293.47
          ],
          [
           22.69,
           1214.83
          ],
          [
           23.46,
           1132.08
          ],
          [
           24.23,
           1054.97
          ],
          [
           25.0,
           992.35
          ],
          [
           25.77,
           949.34
          ],
          [
           26.54,
           926.22
          ],
          [
           27.31,
           918.98
          ],
          [
           28.08,
           921.1
          ],
          [
           28.85,
           925.75
          ],
          [
           29.62,
           928.06
          ],
          [
           30.38,
           926.67
          ],
          [
           31.15,
           924.36
          ],
          [
           31.92,
           927.58
          ],
          [
           32.69,
           944.81
          ],
          [
           33.46,
           984.31
          ],
          [
           34.23,
           1051.5
          ],
          [
           35.0,
           1146.76
          ],
          [
           35.77,
           1264.27
          ],
          [
           36.54,
           1392.48
          ],
          [
           37.31,
           1516.57
          ],
          [
           38.08,
           1622.95
          ],
          [
           38.85,
           1705.18
          ],
          [
           39.62,
           1769.84
          ],
          [
           40.38,
           1840.11
          ],
          [
           41.15,
           1952.92
          ],
          [
           41.92,
           2144.6
          ],
          [
           42.69,
           2417.32
          ],
          [
           43.46,
           2676.74
          ],
          [
           44.23,
           2628.24
          ],
          [
           45.0,
           1616.28
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "features:   1, z, z², z³, …, zᵈ       (z = (temperature − 30) / 10)",
       "bill = w₀ + w₁ z + w₂ z² + … + w_d zᵈ",
       "same loss, same solver as linear regression"
      ],
      "note": "Centring and scaling t first keeps the powers from becoming huge numbers."
     }
    ]
   },
   {
    "id": "popb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Centre and scale the input (z = (t − 30) / 10) so its powers stay a manageable size.",
       "Build a column for every power from 0 to the degree you want.",
       "Solve the usual least-squares problem on those columns with np.linalg.lstsq.",
       "Try several degrees and compare the error on the training rows with the error on rows the fit never saw."
      ]
     },
     {
      "kind": "code",
      "caption": "Build the power columns by hand and compare five degrees",
      "code": "import numpy as np\n\nrng = np.random.default_rng(2)\ntemp = np.sort(rng.uniform(15, 45, 60))                 # average monthly temperature, degrees C\nbill = 900 + 7.5 * (temp - 29) ** 2 + rng.normal(0, 120, 60)   # electricity bill in rupees\n\ndef features(t, degree, centre=30.0, scale=10.0):\n    z = (t - centre) / scale                              # centred and scaled so powers stay tame\n    return np.column_stack([z ** k for k in range(degree + 1)])   # columns 1, z, z^2, ...\n\nidx = rng.permutation(60)\ntr, va = idx[:40], idx[40:]\nfor degree in [1, 2, 3, 6, 10]:\n    w, *_ = np.linalg.lstsq(features(temp[tr], degree), bill[tr], rcond=None)\n    err = lambda ids: float(np.sqrt(np.mean((features(temp[ids], degree) @ w - bill[ids]) ** 2)))\n    print(f\"degree {degree:2d}: train RMSE {err(tr):6.1f}  validation RMSE {err(va):6.1f}  (rupees)\")\n\n# the same curve is still 'linear' in its weights: a straight-line fit on the new columns\nprint(\"columns for degree 3:\", features(np.array([30.0, 40.0]), 3).round(2).tolist())",
      "output": "degree  1: train RMSE  506.7  validation RMSE  387.4  (rupees)\ndegree  2: train RMSE  115.6  validation RMSE  119.1  (rupees)\ndegree  3: train RMSE  115.5  validation RMSE  120.1  (rupees)\ndegree  6: train RMSE  111.5  validation RMSE  127.4  (rupees)\ndegree 10: train RMSE  101.0  validation RMSE  137.0  (rupees)\ncolumns for degree 3: [[1.0, 0.0, 0.0, 0.0], [1.0, 1.0, 1.0, 1.0]]"
     },
     {
      "kind": "p",
      "text": "Degree 1 is far off (training RMSE ₹507, validation ₹387). Degree 2 drops both to about ₹116 and ₹119. Beyond that, training error keeps shrinking, to ₹101 at degree 10, but validation error grows, to ₹137: the extra bend is fitting noise."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Training error only ever falls as you add degrees. Validation error falls, bottoms out, then rises. Choose the degree at the bottom."
     }
    ]
   },
   {
    "id": "popb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split first and keep the test rows aside.",
       "Build a pipeline: PolynomialFeatures, StandardScaler, then Ridge. The small ridge penalty keeps high-degree weights tame.",
       "Search degree and penalty together with GridSearchCV, which cross-validates every combination on the training rows.",
       "Score the winner once on the test rows, next to the straight-line baseline."
      ]
     },
     {
      "kind": "code",
      "caption": "A pipeline that searches degree and penalty",
      "code": "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import PolynomialFeatures, StandardScaler\nfrom sklearn.linear_model import Ridge, LinearRegression\nfrom sklearn.model_selection import GridSearchCV, train_test_split\nfrom sklearn.metrics import mean_absolute_error\n\nrng = np.random.default_rng(2)\ntemp = rng.uniform(15, 45, 150)\nbill = 900 + 7.5 * (temp - 29) ** 2 + rng.normal(0, 120, 150)\nX = temp.reshape(-1, 1)\nXtr, Xte, ytr, yte = train_test_split(X, bill, test_size=0.3, random_state=0)\n\npipe = make_pipeline(PolynomialFeatures(include_bias=False), StandardScaler(), Ridge())\ngrid = GridSearchCV(pipe, {\"polynomialfeatures__degree\": [1, 2, 3, 5], \"ridge__alpha\": [0.01, 1]}, cv=5, scoring=\"neg_mean_absolute_error\")\ngrid.fit(Xtr, ytr)\nprint(\"best settings:\", grid.best_params_)\nprint(\"cross-validated MAE of the best setting:\", round(float(-grid.best_score_), 1), \"rupees\")\nline = LinearRegression().fit(Xtr, ytr)\nprint(\"test MAE: straight line\", round(float(mean_absolute_error(yte, line.predict(Xte))), 1), \"| tuned polynomial\", round(float(mean_absolute_error(yte, grid.predict(Xte))), 1))",
      "output": "best settings: {'polynomialfeatures__degree': 2, 'ridge__alpha': 0.01}\ncross-validated MAE of the best setting: 107.8 rupees\ntest MAE: straight line 531.5 | tuned polynomial 104.6"
     },
     {
      "kind": "p",
      "text": "The search picked degree 2 with a tiny penalty and cross-validated MAE ₹108. On the test rows the tuned curve is off by ₹105 on average, against ₹532 for the straight line, a five-fold improvement from one extra column."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "The same pattern, features then a linear model, is how kernel ideas and neural networks are introduced later. A curve is the smallest example of learning a better representation."
     }
    ]
   },
   {
    "id": "popb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "Two dials matter: the degree and the penalty. Read the cross-validation scores, not the training fit, and prefer the lowest degree whose score is within noise of the best. Then test what the curve does where there is no data."
     },
     {
      "kind": "code",
      "caption": "Predictions outside the data range",
      "code": "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import PolynomialFeatures, StandardScaler\nfrom sklearn.linear_model import LinearRegression\n\nrng = np.random.default_rng(2)\ntemp = rng.uniform(15, 45, 150)\nbill = 900 + 7.5 * (temp - 29) ** 2 + rng.normal(0, 120, 150)\nX = temp.reshape(-1, 1)\nfor degree in [2, 9]:\n    m = make_pipeline(PolynomialFeatures(degree, include_bias=False), StandardScaler(), LinearRegression()).fit(X, bill)\n    inside = m.predict(np.array([[30.0]]))[0]\n    outside = m.predict(np.array([[50.0], [55.0]]))\n    print(f\"degree {degree}: bill at 30 C {inside:8.0f} | at 50 C and 55 C {outside.round(0).tolist()}\")\nprint(\"true curve at 30 C, 50 C, 55 C:\", [round(900 + 7.5 * (t - 29) ** 2) for t in (30, 50, 55)])",
      "output": "degree 2: bill at 30 C      884 | at 50 C and 55 C [4262.0, 6064.0]\ndegree 9: bill at 30 C      881 | at 50 C and 55 C [-29079.0, -395978.0]\ntrue curve at 30 C, 50 C, 55 C: [908, 4208, 5970]"
     },
     {
      "kind": "p",
      "text": "At 30 °C both curves agree with the truth (about ₹884 and ₹881 against ₹908). At 50 °C the degree 2 curve says ₹4,262 against a true ₹4,208, but the degree 9 curve says −₹29,079, and at 55 °C it says −₹395,978. A negative electricity bill is the warning sign: high-degree polynomials are only trustworthy inside the range they were fitted on."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Choose the degree by cross-validation. Never trust a polynomial outside its training range."
     }
    ]
   },
   {
    "id": "popb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "Polynomial regression against its neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "One feature, smooth bend",
        "Polynomial regression (degree 2 or 3)",
        "Simple, explainable and cheap."
       ],
       [
        "Many features, bends and interactions",
        "Gradient boosting or a random forest",
        "They discover bends and interactions without a feature explosion."
       ],
       [
        "Bend with a sudden jump",
        "A decision tree or boosting",
        "Smooth powers cannot make a step."
       ],
       [
        "You must predict outside the observed range",
        "A model with a physical reason, or a plain line",
        "Polynomials diverge outside the data."
       ],
       [
        "Many correlated powers",
        "Add Ridge",
        "A penalty steadies the weights."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A rule of thumb: stay at degree 2 or 3 unless cross-validation clearly says otherwise, and always plot the curve with the data."
     },
     {
      "kind": "check",
      "question": "Training error keeps falling as degree rises, but validation error starts rising at degree 6. Which degree do you pick?",
      "options": [
       "The highest, since training error is lowest",
       "The degree near the validation minimum",
       "Always degree 2"
      ],
      "answer": 1,
      "why": "Validation error estimates performance on new data. Pick near its minimum."
     }
    ]
   },
   {
    "id": "popb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Choosing degree by training fit",
      "text": "Training error always favours the most flexible curve."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Forgetting to scale",
      "text": "Powers of an unscaled feature reach enormous numbers and the solver struggles."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Extrapolating",
      "text": "A degree 9 curve predicted a bill of −₹395,978 outside its data."
     },
     {
      "kind": "p",
      "text": "Before trusting a polynomial model, check the range of the inputs you will see in use, the validation curve across degrees, and the plot of the curve against the data."
     }
    ]
   }
  ]
 },
 "regularization": {
  "title": "Ridge, Lasso and Elastic Net: put a price on large weights",
  "minutes": 14,
  "sections": [
   {
    "id": "repb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "Ordinary least squares chases every wiggle in the training rows. With many features, few rows, or features that nearly copy each other, it hands out large, unstable weights that predict badly on new data. Regularization adds a charge for large weights, so the model must earn each one."
     },
     {
      "kind": "table",
      "caption": "Is regularization a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "More features than you can comfortably justify, or nearly as many as rows?",
        "A penalty keeps weights from running away."
       ],
       [
        "Are some features near-copies of each other?",
        "Ridge shares weight between them. Lasso picks one."
       ],
       [
        "Do you want the model to drop useless features?",
        "Lasso sets some weights to exactly zero."
       ],
       [
        "Do plain least squares results swing when you change a few rows?",
        "That instability is what ridge calms."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "How does a penalty change the fit, how do I build ridge and lasso myself, and how do I choose between them?"
     }
    ]
   },
   {
    "id": "repb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Ridge adds the sum of squared weights to the loss. Lasso adds the sum of absolute weights. Both pull weights toward zero; only lasso can pin them there. The picture shows ten features, three real and the rest noise: as the penalty grows, weights shrink, and the noise feature stays at zero."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Lasso weights as the penalty grows",
       "alt": "Coefficient paths for a lasso model. Three true signal features start at about 4, minus 3 and 2 and shrink toward zero as the penalty grows. A pure noise feature stays at zero almost everywhere.",
       "xLabel": "Penalty strength (lambda)",
       "yLabel": "Weight",
       "series": [
        {
         "name": "Feature 1 (signal)",
         "style": "line",
         "pts": [
          [
           0.0,
           3.73
          ],
          [
           0.1,
           3.67
          ],
          [
           0.2,
           3.6
          ],
          [
           0.3,
           3.54
          ],
          [
           0.5,
           3.42
          ],
          [
           0.8,
           3.2
          ],
          [
           1.2,
           2.85
          ],
          [
           1.6,
           2.5
          ],
          [
           2.0,
           2.15
          ]
         ]
        },
        {
         "name": "Feature 2 (signal)",
         "style": "line",
         "pts": [
          [
           0.0,
           -2.64
          ],
          [
           0.1,
           -2.53
          ],
          [
           0.2,
           -2.46
          ],
          [
           0.3,
           -2.38
          ],
          [
           0.5,
           -2.22
          ],
          [
           0.8,
           -1.98
          ],
          [
           1.2,
           -1.66
          ],
          [
           1.6,
           -1.34
          ],
          [
           2.0,
           -1.01
          ]
         ]
        },
        {
         "name": "Feature 3 (signal)",
         "style": "line",
         "pts": [
          [
           0.0,
           2.21
          ],
          [
           0.1,
           2.05
          ],
          [
           0.2,
           1.91
          ],
          [
           0.3,
           1.78
          ],
          [
           0.5,
           1.54
          ],
          [
           0.8,
           1.21
          ],
          [
           1.2,
           0.81
          ],
          [
           1.6,
           0.41
          ],
          [
           2.0,
           0.01
          ]
         ]
        },
        {
         "name": "Feature 7 (noise)",
         "style": "line",
         "dash": true,
         "pts": [
          [
           0.0,
           -0.11
          ],
          [
           0.1,
           -0.0
          ],
          [
           0.2,
           -0.0
          ],
          [
           0.3,
           -0.0
          ],
          [
           0.5,
           0.0
          ],
          [
           0.8,
           0.0
          ],
          [
           1.2,
           0.0
          ],
          [
           1.6,
           0.0
          ],
          [
           2.0,
           0.0
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "ridge:  minimise  average miss² + λ × Σ w²",
       "lasso:  minimise  average miss² + λ × Σ |w|",
       "elastic net:  a mix of both penalties"
      ],
      "note": "Standardise the features first, or the penalty punishes large-unit features unfairly."
     }
    ]
   },
   {
    "id": "repb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Standardise every feature and centre the target, so the penalty treats all weights equally and no intercept is needed.",
       "Ridge: solve (XᵀX + n·λ·I) w = Xᵀy. The penalty simply adds to the diagonal.",
       "Lasso: update one weight at a time with a soft threshold, sweeping through the features until nothing moves (coordinate descent).",
       "Sweep λ and watch the weights shrink, and for lasso, hit zero."
      ]
     },
     {
      "kind": "code",
      "caption": "Ridge in one line of linear algebra, lasso by coordinate descent",
      "code": "import numpy as np\n\nrng = np.random.default_rng(1)\nn, p = 80, 10\nX = rng.normal(size=(n, p))\ntrue_w = np.array([4.0, -3.0, 2.0, 0, 0, 0, 0, 0, 0, 0])      # only three features matter\ny = X @ true_w + rng.normal(0, 2.0, n)\nX = (X - X.mean(0)) / X.std(0)\ny = y - y.mean()\n\ndef ridge(X, y, lam):\n    # closed form: (X'X + n*lam*I) w = X'y   -- the penalty adds to the diagonal\n    return np.linalg.solve(X.T @ X + len(y) * lam * np.eye(X.shape[1]), X.T @ y)\n\ndef soft(z, t):\n    return np.sign(z) * np.maximum(abs(z) - t, 0.0)\n\ndef lasso(X, y, lam, sweeps=300):\n    n, p = X.shape\n    w = np.zeros(p)\n    for _ in range(sweeps):\n        for j in range(p):                                      # coordinate descent: one weight at a time\n            r = y - X @ w + X[:, j] * w[j]\n            w[j] = soft(X[:, j] @ r / n, lam) / (X[:, j] @ X[:, j] / n)\n    return w\n\nfor lam in [0.0, 0.1, 0.5, 1.5]:\n    print(f\"lambda {lam:3}  ridge:\", ridge(X, y, lam).round(2)[:6], \"... | lasso:\", lasso(X, y, lam).round(2)[:6], \"... zeros:\", int((lasso(X, y, lam) == 0).sum()))",
      "output": "lambda 0.0  ridge: [ 3.73 -2.64  2.21 -0.12  0.39  0.13] ... | lasso: [ 3.73 -2.64  2.21 -0.12  0.39  0.13] ... zeros: 0\nlambda 0.1  ridge: [ 3.42 -2.44  1.99 -0.09  0.37  0.09] ... | lasso: [ 3.67 -2.53  2.05 -0.04  0.29  0.01] ... zeros: 1\nlambda 0.5  ridge: [ 2.59 -1.88  1.42 -0.03  0.3   0.  ] ... | lasso: [ 3.42 -2.22  1.54 -0.    0.    0.  ] ... zeros: 6\nlambda 1.5  ridge: [ 1.61 -1.21  0.83  0.01  0.21 -0.04] ... | lasso: [ 2.59 -1.42  0.51 -0.    0.   -0.  ] ... zeros: 7"
     },
     {
      "kind": "p",
      "text": "At λ = 0 both give the least-squares weights. As λ rises, ridge shrinks everything smoothly, while lasso drives the noise weights to zero: at λ = 0.5 it has zeroed 6 of the 10 weights and kept the three big signal features, at 3.42, −2.22 and 1.54."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Ridge shrinks. Lasso shrinks and selects. The soft threshold is the whole reason."
     }
    ]
   },
   {
    "id": "repb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split the rows, then build a pipeline with StandardScaler first.",
       "Use RidgeCV or LassoCV, which choose the penalty by cross-validation on the training rows.",
       "Compare with plain least squares on the same test rows.",
       "Inspect which weights survived."
      ]
     },
     {
      "kind": "code",
      "caption": "Three models on 90 rows and 30 features, four of which matter",
      "code": "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LinearRegression, RidgeCV, LassoCV\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_absolute_error\n\nrng = np.random.default_rng(1)\nn, p = 90, 30\nX = rng.normal(size=(n, p))\nw_true = np.zeros(p); w_true[:4] = [4.0, -3.0, 2.0, 1.5]\ny = X @ w_true + rng.normal(0, 2.0, n)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4, random_state=0)\n\nmodels = {\n    \"plain least squares\": make_pipeline(StandardScaler(), LinearRegression()),\n    \"ridge (alpha by CV)\": make_pipeline(StandardScaler(), RidgeCV(alphas=np.logspace(-2, 3, 30))),\n    \"lasso (alpha by CV)\": make_pipeline(StandardScaler(), LassoCV(cv=5, random_state=0)),\n}\nfor name, m in models.items():\n    m.fit(Xtr, ytr)\n    print(f\"{name:21s} test MAE {mean_absolute_error(yte, m.predict(Xte)):.2f}\")\nlas = models[\"lasso (alpha by CV)\"][-1]\nprint(\"lasso alpha:\", round(float(las.alpha_), 3), \"| non-zero weights:\", int((las.coef_ != 0).sum()), \"of\", p)\nprint(\"features kept by lasso:\", np.flatnonzero(las.coef_).tolist()[:12])",
      "output": "plain least squares   test MAE 2.71\nridge (alpha by CV)   test MAE 2.65\nlasso (alpha by CV)   test MAE 2.12\nlasso alpha: 0.107 | non-zero weights: 19 of 30\nfeatures kept by lasso: [0, 1, 2, 3, 5, 6, 7, 8, 10, 12, 13, 15]"
     },
     {
      "kind": "p",
      "text": "With 54 training rows and 30 features, plain least squares has test MAE 2.71. Ridge improves slightly to 2.65, and lasso to 2.12. Lasso kept 19 of 30 features at the cross-validated penalty of 0.107: choosing the penalty for prediction accuracy does not mean choosing the smallest model."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Penalties show up everywhere: weight decay in neural networks, C in logistic regression and SVMs, and shrinkage in boosting are all the same idea."
     }
    ]
   },
   {
    "id": "repb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "The one dial is the penalty strength, chosen by cross-validation. Then read the weights, but carefully: when two features are near-copies, the story changes between ridge and lasso."
     },
     {
      "kind": "code",
      "caption": "Two near-identical features",
      "code": "import numpy as np\nfrom sklearn.linear_model import Lasso, Ridge\n\nrng = np.random.default_rng(5)\nn = 200\na = rng.normal(size=n)\nb = a + rng.normal(0, 0.05, n)          # a near-copy of a\nc = rng.normal(size=n)\ny = 3 * a + 3 * b + 2 * c + rng.normal(0, 1, n)\nX = np.column_stack([a, b, c])\nprint(\"correlation of the twin columns:\", round(float(np.corrcoef(a, b)[0, 1]), 3))\nfor name, m in [(\"ridge alpha=1\", Ridge(alpha=1)), (\"lasso alpha=0.3\", Lasso(alpha=0.3))]:\n    print(f\"{name:16s} weights [a, b, c]:\", m.fit(X, y).coef_.round(2))\nprint(\"alpha path (lasso weights of a, b, c):\")\nfor al in [0.01, 0.1, 0.5, 1.5, 3.0]:\n    print(f\"  alpha {al:4}:\", Lasso(alpha=al).fit(X, y).coef_.round(2))",
      "output": "correlation of the twin columns: 0.999\nridge alpha=1    weights [a, b, c]: [3.22 2.74 2.02]\nlasso alpha=0.3  weights [a, b, c]: [3.9  1.76 1.73]\nalpha path (lasso weights of a, b, c):\n  alpha 0.01: [4.47 1.5  2.01]\n  alpha  0.1: [4.29 1.58 1.93]\n  alpha  0.5: [3.53 1.92 1.53]\n  alpha  1.5: [1.68 2.7  0.55]\n  alpha  3.0: [0.   2.77 0.  ]"
     },
     {
      "kind": "p",
      "text": "The twin columns correlate at 0.999. Ridge splits the credit, giving weights 3.22 and 2.74. Lasso picks one: at α = 0.3 it gives 3.90 and 1.76, and at α = 3.0 it keeps only the second twin. Which twin wins is close to arbitrary, so never read a lasso-selected list as 'the true drivers'."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Use the cross-validated penalty. Do not treat lasso's survivors as the only features that matter."
     }
    ]
   },
   {
    "id": "repb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "Ridge, lasso and elastic net",
      "headers": [
       "Your situation",
       "Pick",
       "Why"
      ],
      "rows": [
       [
        "Many features that all help a little",
        "Ridge",
        "Shrinks all weights, keeps all features."
       ],
       [
        "Many features, a few really matter",
        "Lasso",
        "Zeroes out the rest and gives a shorter model."
       ],
       [
        "Groups of correlated features",
        "Elastic net",
        "Keeps correlated groups together while still selecting."
       ],
       [
        "Few features, many rows",
        "Plain least squares",
        "There is little to regularise."
       ],
       [
        "Strong curves and interactions",
        "Gradient boosting or forests",
        "Penalties do not bend the model."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Start with RidgeCV. Try LassoCV if you need a shorter model. Choose elastic net when features come in correlated groups."
     },
     {
      "kind": "check",
      "question": "Two features are near-copies. Which model shares the weight between them?",
      "options": [
       "Lasso",
       "Ridge",
       "Plain least squares always"
      ],
      "answer": 1,
      "why": "Ridge spreads weight across correlated features. Lasso tends to keep one."
     }
    ]
   },
   {
    "id": "repb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Forgetting to standardise",
      "text": "The penalty then punishes features measured in large units."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Choosing the penalty on the test set",
      "text": "Cross-validate on training rows. The test set is for the end."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading lasso as feature importance",
      "text": "With correlated features it chooses one of the twins almost arbitrarily."
     },
     {
      "kind": "p",
      "text": "Check that the scaler is inside the pipeline, the penalty came from cross-validation, and the plain least-squares baseline is reported beside the penalised models."
     }
    ]
   }
  ]
 },
 "logistic": {
  "title": "Logistic regression: predict a probability, then decide",
  "minutes": 15,
  "sections": [
   {
    "id": "lgpb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "When the answer is yes or no — will this customer leave, will this loan default, is this message spam — you usually want more than a label. You want a probability you can act on, and a reason you can explain. Logistic regression gives both, with the same linear scoring as a regression."
     },
     {
      "kind": "table",
      "caption": "Is logistic regression a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Is the target two categories?",
        "Binary classification is its home turf."
       ],
       [
        "Do you need a probability, not just a label?",
        "Its outputs are probabilities that can be calibrated."
       ],
       [
        "Must you explain each feature's effect?",
        "Each weight becomes an odds ratio."
       ],
       [
        "Are classes roughly separable by a straight boundary?",
        "A line (or plane) is enough."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "How do I turn a score into a probability, train it myself, and choose a threshold that matches what a mistake costs?"
     }
    ]
   },
   {
    "id": "lgpb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Compute a score exactly as in linear regression, then squeeze it through the S-shaped sigmoid so it lands between 0 and 1. A score of zero means 50-50; each step up multiplies the odds."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "From a score to a probability",
       "alt": "The S shaped logistic curve. A score of zero gives a probability of one half; large negative scores approach zero and large positive scores approach one.",
       "xLabel": "Score (log-odds)",
       "yLabel": "Probability",
       "series": [
        {
         "name": "Probability = 1 / (1 + e^-score)",
         "style": "line",
         "pts": [
          [
           -6.0,
           0.0
          ],
          [
           -5.7,
           0.0
          ],
          [
           -5.4,
           0.0
          ],
          [
           -5.1,
           0.01
          ],
          [
           -4.8,
           0.01
          ],
          [
           -4.5,
           0.01
          ],
          [
           -4.2,
           0.01
          ],
          [
           -3.9,
           0.02
          ],
          [
           -3.6,
           0.03
          ],
          [
           -3.3,
           0.04
          ],
          [
           -3.0,
           0.05
          ],
          [
           -2.7,
           0.06
          ],
          [
           -2.4,
           0.08
          ],
          [
           -2.1,
           0.11
          ],
          [
           -1.8,
           0.14
          ],
          [
           -1.5,
           0.18
          ],
          [
           -1.2,
           0.23
          ],
          [
           -0.9,
           0.29
          ],
          [
           -0.6,
           0.35
          ],
          [
           -0.3,
           0.43
          ],
          [
           0.0,
           0.5
          ],
          [
           0.3,
           0.57
          ],
          [
           0.6,
           0.65
          ],
          [
           0.9,
           0.71
          ],
          [
           1.2,
           0.77
          ],
          [
           1.5,
           0.82
          ],
          [
           1.8,
           0.86
          ],
          [
           2.1,
           0.89
          ],
          [
           2.4,
           0.92
          ],
          [
           2.7,
           0.94
          ],
          [
           3.0,
           0.95
          ],
          [
           3.3,
           0.96
          ],
          [
           3.6,
           0.97
          ],
          [
           3.9,
           0.98
          ],
          [
           4.2,
           0.99
          ],
          [
           4.5,
           0.99
          ],
          [
           4.8,
           0.99
          ],
          [
           5.1,
           0.99
          ],
          [
           5.4,
           1.0
          ],
          [
           5.7,
           1.0
          ],
          [
           6.0,
           1.0
          ]
         ]
        }
       ],
       "guides": [
        {
         "axis": "y",
         "at": 0.5,
         "label": "0.5"
        }
       ],
       "yDomain": [
        0,
        1
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "score = w₀ + w₁ tenure + w₂ calls",
       "P(leave) = 1 / (1 + e^(−score))",
       "loss = −average of [ y·ln p + (1−y)·ln(1−p) ]"
      ],
      "note": "The loss punishes confident wrong answers hard. A model that always says 0.5 scores ln 2 = 0.693."
     }
    ]
   },
   {
    "id": "lgpb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Standardise the features and add a column of ones for the intercept.",
       "Start every weight at zero, so every probability is 0.5 and the loss is ln 2.",
       "Compute the probabilities, then the gradient: the inputs multiplied by (probability − actual), averaged.",
       "Step the weights downhill and repeat until the loss stops falling."
      ]
     },
     {
      "kind": "code",
      "caption": "Gradient descent on log loss",
      "code": "import numpy as np\n\nrng = np.random.default_rng(4)\nn = 1500\ntenure = rng.uniform(1, 60, n)                   # months with the operator\ncalls = rng.poisson(2.0, n)                      # support calls in the last quarter\nlogit = -0.6 - 0.05 * tenure + 0.55 * calls\nleave = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(float)\nX = np.column_stack([tenure, calls])\nZ = np.column_stack([np.ones(n), (X - X.mean(0)) / X.std(0)])      # intercept + standardised features\n\nsigmoid = lambda s: 1 / (1 + np.exp(-s))\ndef log_loss(w):\n    p = np.clip(sigmoid(Z @ w), 1e-12, 1 - 1e-12)\n    return float(-np.mean(leave * np.log(p) + (1 - leave) * np.log(1 - p)))\n\nw = np.zeros(3)\nprint(\"start: loss\", round(log_loss(w), 4), \"(= ln 2 =\", round(float(np.log(2)), 4), \"when every probability is 0.5)\")\nfor step in range(1, 401):\n    grad = Z.T @ (sigmoid(Z @ w) - leave) / n          # the gradient of log loss is just (p - y) times the inputs\n    w -= 0.5 * grad\n    if step in (1, 10, 100, 400):\n        print(f\"step {step:3d}: loss {log_loss(w):.4f}  weights {w.round(3)}\")\np = sigmoid(Z @ w)\nprint(\"share predicted to leave at 0.5:\", round(float((p > 0.5).mean()), 3), \"| actual share:\", round(float(leave.mean()), 3))",
      "output": "start: loss 0.6931 (= ln 2 = 0.6931 when every probability is 0.5)\nstep   1: loss 0.6535  weights [-0.105 -0.069  0.073]\nstep  10: loss 0.5276  weights [-0.641 -0.426  0.443]\nstep 100: loss 0.4973  weights [-1.121 -0.815  0.802]\nstep 400: loss 0.4972  weights [-1.126 -0.819  0.806]\nshare predicted to leave at 0.5: 0.17 | actual share: 0.289"
     },
     {
      "kind": "p",
      "text": "The loss falls from 0.693 to 0.497 in about 100 steps and then settles; the weights barely change after that. Note the last line: only 17% are predicted to leave at the 0.5 cut-off, while 28.9% actually did. A 0.5 threshold is a choice, and often a poor one."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The gradient of log loss is just (probability − actual) times the inputs. That simplicity is why logistic regression trains so reliably."
     }
    ]
   },
   {
    "id": "lgpb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split with stratify, so both parts keep the same share of leavers.",
       "Build the pipeline: StandardScaler then LogisticRegression.",
       "Compare with a DummyClassifier that predicts the base rate. Accuracy alone will mislead.",
       "Report AUC and log loss, not accuracy only."
      ]
     },
     {
      "kind": "code",
      "caption": "A pipeline, a baseline, and honest metrics",
      "code": "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, roc_auc_score, precision_score, recall_score, log_loss\n\nrng = np.random.default_rng(4)\nn = 3000\ntenure = rng.uniform(1, 60, n)\ncalls = rng.poisson(2.0, n)\nlogit = -2.4 - 0.05 * tenure + 0.55 * calls\nleave = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)\nX = np.column_stack([tenure, calls])\nXtr, Xte, ytr, yte = train_test_split(X, leave, test_size=0.3, random_state=0, stratify=leave)\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression()).fit(Xtr, ytr)\nbase = DummyClassifier(strategy=\"prior\").fit(Xtr, ytr)\np = model.predict_proba(Xte)[:, 1]\nprint(\"share who leave:\", round(float(leave.mean()), 3))\nprint(\"accuracy: model\", round(float(accuracy_score(yte, p > 0.5)), 3), \"| always 'stays'\", round(float(accuracy_score(yte, base.predict(Xte))), 3))\nprint(\"ROC AUC:\", round(float(roc_auc_score(yte, p)), 3), \"| log loss:\", round(float(log_loss(yte, p)), 3), \"vs baseline\", round(float(log_loss(yte, base.predict_proba(Xte))), 3))\nprint(\"at 0.5: precision\", round(float(precision_score(yte, p > 0.5)), 2), \"recall\", round(float(recall_score(yte, p > 0.5)), 2))\nprint(\"coefficients per standard deviation [tenure, calls]:\", model[-1].coef_[0].round(2), \"-> odds ratios\", np.exp(model[-1].coef_[0]).round(2))",
      "output": "share who leave: 0.097\naccuracy: model 0.907 | always 'stays' 0.903\nROC AUC: 0.791 | log loss: 0.263 vs baseline 0.318\nat 0.5: precision 0.64 recall 0.08\ncoefficients per standard deviation [tenure, calls]: [-0.94  0.86] -> odds ratios [0.39 2.36]"
     },
     {
      "kind": "p",
      "text": "Only 9.7% leave, so always saying 'stays' is 90.3% accurate and the model is 90.7%. Accuracy hides the story. AUC 0.791 and a log loss of 0.263 against 0.318 for the baseline show it learned something real. At 0.5 recall is just 8%, so the model catches almost no leavers. The weights say each standard deviation of tenure multiplies the odds of leaving by 0.39, and each of calls by 2.36."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Logistic regression is also the last layer of most neural-network classifiers, and the baseline every classifier is compared against."
     }
    ]
   },
   {
    "id": "lgpb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "There is one dial that matters more than any hyper-parameter: the threshold. Pick it from what each kind of mistake costs. Here a missed leaver costs ₹4,000 and a retention offer ₹500."
     },
     {
      "kind": "code",
      "caption": "Choose the threshold by cost, then check calibration",
      "code": "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(4)\nn = 3000\ntenure = rng.uniform(1, 60, n)\ncalls = rng.poisson(2.0, n)\nlogit = -2.4 - 0.05 * tenure + 0.55 * calls\nleave = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)\nX = np.column_stack([tenure, calls])\nXtr, Xte, ytr, yte = train_test_split(X, leave, test_size=0.3, random_state=0, stratify=leave)\np = make_pipeline(StandardScaler(), LogisticRegression()).fit(Xtr, ytr).predict_proba(Xte)[:, 1]\n\n# a missed leaver costs 4000 rupees of lost revenue; a retention offer costs 500 rupees\nMISS, OFFER = 4000, 500\nprint(\"threshold | offers | leavers caught | total cost (rupees)\")\nbest = None\nfor t in [0.05, 0.10, 0.15, 0.20, 0.30, 0.50]:\n    flag = p > t\n    caught = int((flag & (yte == 1)).sum()); missed = int(((~flag) & (yte == 1)).sum())\n    cost = OFFER * int(flag.sum()) + MISS * missed\n    print(f\"{t:9.2f} | {int(flag.sum()):6d} | {caught:3d} of {int(yte.sum())} | {cost:9,d}\")\n    best = (cost, t) if best is None or cost < best[0] else best\nprint(\"cheapest threshold:\", best[1])\n\n# does 'predicted 20%' mean 20%? compare predictions with what happened\nedges = [0, 0.05, 0.1, 0.2, 0.4, 1.0]\nfor lo, hi in zip(edges[:-1], edges[1:]):\n    m = (p >= lo) & (p < hi)\n    if m.sum(): print(f\"predicted {lo:.2f}-{hi:.2f}: {int(m.sum()):4d} customers, predicted avg {p[m].mean():.3f}, actual {yte[m].mean():.3f}\")",
      "output": "threshold | offers | leavers caught | total cost (rupees)\n     0.05 |    458 |  73 of 87 |   285,000\n     0.10 |    284 |  64 of 87 |   234,000\n     0.15 |    178 |  49 of 87 |   241,000\n     0.20 |    117 |  41 of 87 |   242,500\n     0.30 |     57 |  23 of 87 |   284,500\n     0.50 |     11 |   7 of 87 |   325,500\ncheapest threshold: 0.1\npredicted 0.00-0.05:  442 customers, predicted avg 0.024, actual 0.032\npredicted 0.05-0.10:  174 customers, predicted avg 0.072, actual 0.052\npredicted 0.10-0.20:  167 customers, predicted avg 0.140, actual 0.138\npredicted 0.20-0.40:   86 customers, predicted avg 0.269, actual 0.256\npredicted 0.40-1.00:   31 customers, predicted avg 0.504, actual 0.613"
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Total cost against the alert threshold",
       "alt": "Total cost in rupees for six thresholds on a churn model. Cost falls from 285,000 at a threshold of 0.05 to a minimum of 234,000 at 0.10, then rises to 325,500 at 0.50.",
       "xLabel": "Threshold",
       "yLabel": "Total cost (₹)",
       "series": [
        {
         "name": "Offers plus missed leavers",
         "style": "line",
         "pts": [
          [
           0.05,
           285000.0
          ],
          [
           0.1,
           234000.0
          ],
          [
           0.15,
           241000.0
          ],
          [
           0.2,
           242500.0
          ],
          [
           0.3,
           284500.0
          ],
          [
           0.5,
           325500.0
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "p",
      "text": "The cheapest cut-off is 0.10, at ₹2,34,000, against ₹3,25,500 at 0.5. Calibration looks healthy: customers given about 14% were leaving 13.8% of the time. The top bucket is the weakest, predicting 50% against an actual 61% on only 31 customers."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Train for probabilities, then set the threshold from the cost of each mistake. Never leave it at 0.5 by default."
     }
    ]
   },
   {
    "id": "lgpb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "Logistic regression against its neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "Yes/no, explainable, a baseline first",
        "Logistic regression",
        "Odds ratios explain it. Fast and well calibrated."
       ],
       [
        "Curved or interacting effects",
        "Gradient boosting or random forest",
        "They learn bends and interactions."
       ],
       [
        "Nearly separable classes, small data",
        "SVM",
        "A wide margin generalises well."
       ],
       [
        "Text counts, little data",
        "Naive Bayes",
        "Trains from counts almost instantly."
       ],
       [
        "Many classes",
        "Multinomial logistic, or a tree ensemble",
        "Same idea, more outputs."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Fit logistic regression first, always. If a flexible model beats its AUC by less than the fold-to-fold spread, keep the simple one."
     },
     {
      "kind": "check",
      "question": "A model is 90.7% accurate when 90.3% of customers stay. What should you check next?",
      "options": [
       "Nothing, 90% is great",
       "Recall, AUC and log loss against a base-rate baseline",
       "Only the training accuracy"
      ],
      "answer": 1,
      "why": "With an imbalanced target, accuracy matches the baseline. Look at ranking and probability quality."
     }
    ]
   },
   {
    "id": "lgpb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Accuracy on imbalanced data",
      "text": "90.7% against a 90.3% baseline said almost nothing."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Default 0.5 threshold",
      "text": "Recall was 8%; the cheapest cut-off was 0.10."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading weights without scaling",
      "text": "Unscaled weights depend on units. Use standardised features for comparison."
     },
     {
      "kind": "p",
      "text": "Check that the split is stratified, the baseline is shown, and the threshold came from costs, not habit."
     }
    ]
   }
  ]
 },
 "knn": {
  "title": "k-Nearest Neighbours: predict from the people most like this one",
  "minutes": 13,
  "sections": [
   {
    "id": "knpb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "kNN has no training step and no equation. To judge a new loan applicant it finds the k most similar past applicants and takes a vote. It is a good first model when 'similar' is easy to define, and a good way to understand what every other model is approximating."
     },
     {
      "kind": "table",
      "caption": "Is kNN a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Is 'similar' easy to measure with a few numeric columns?",
        "Distance is meaningful."
       ],
       [
        "Is the dataset small or medium?",
        "Prediction compares against every row, so large data is slow."
       ],
       [
        "Are all your columns relevant?",
        "Noise columns dilute the distance."
       ],
       [
        "Do you want no training step?",
        "kNN just stores the data."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "How does 'vote of the nearest rows' work in code, what does k change, and why must I scale?"
     }
    ]
   },
   {
    "id": "knpb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "For a new point: measure the distance to every training point, keep the k closest, and let them vote. A small k follows every quirk of the data; a large k smooths the boundary. The picture shows what happens when you add columns that carry no signal: distances get dominated by noise."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Irrelevant columns hurt kNN more",
       "alt": "Accuracy of kNN and logistic regression as irrelevant noise columns are added. kNN falls from 0.885 to 0.682 with 80 noise columns, while logistic regression falls from 0.878 to 0.775.",
       "xLabel": "Irrelevant columns added",
       "yLabel": "Cross-validated accuracy",
       "series": [
        {
         "name": "kNN",
         "style": "line",
         "pts": [
          [
           0.0,
           0.89
          ],
          [
           5.0,
           0.83
          ],
          [
           20.0,
           0.78
          ],
          [
           80.0,
           0.68
          ]
         ]
        },
        {
         "name": "Logistic regression",
         "style": "line",
         "pts": [
          [
           0.0,
           0.88
          ],
          [
           5.0,
           0.87
          ],
          [
           20.0,
           0.85
          ],
          [
           80.0,
           0.78
          ]
         ]
        }
       ],
       "yDomain": [
        0.6,
        0.95
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "distance = √( (income₁−income₂)² + (distance₁−distance₂)² )",
       "prediction = majority label among the k nearest training rows"
      ],
      "note": "Standardise first, or the column with the biggest numbers decides alone."
     }
    ]
   },
   {
    "id": "knpb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Compute the distance from every new row to every training row with broadcasting.",
       "argsort each row of distances and keep the first k indices.",
       "Average the neighbours' labels and compare with 0.5 for a majority vote.",
       "Check the answer against scikit-learn: it must agree."
      ]
     },
     {
      "kind": "code",
      "caption": "kNN in four NumPy lines, checked against scikit-learn",
      "code": "import numpy as np\nfrom sklearn.neighbors import KNeighborsClassifier\n\nrng = np.random.default_rng(6)\nn = 300\nincome = np.concatenate([rng.normal(40, 8, n // 2), rng.normal(58, 8, n // 2)])     # monthly income, thousand rupees\ndistance = np.concatenate([rng.normal(12, 4, n // 2), rng.normal(7, 4, n // 2)])     # km from the nearest branch\nX = np.column_stack([income, distance]); y = np.array([0] * (n // 2) + [1] * (n // 2))\nidx = rng.permutation(n); tr, te = idx[:200], idx[200:]\n\ndef knn_predict(Xtr, ytr, Xnew, k):\n    d = np.sqrt(((Xnew[:, None, :] - Xtr[None, :, :]) ** 2).sum(axis=2))     # distance from every new point to every training point\n    nearest = np.argsort(d, axis=1)[:, :k]                                    # the k closest training rows\n    return (ytr[nearest].mean(axis=1) > 0.5).astype(int)                      # majority vote\n\nmu, sd = X[tr].mean(0), X[tr].std(0)\nfor k in [1, 5, 15]:\n    mine = knn_predict(X[tr], y[tr], X[te], k)\n    ref = KNeighborsClassifier(n_neighbors=k).fit(X[tr], y[tr]).predict(X[te])\n    print(f\"k={k:2d}: accuracy {np.mean(mine == y[te]):.3f} | agrees with scikit-learn on {np.mean(mine == ref):.0%} of customers\")\n\nraw = knn_predict(X[tr], y[tr], X[te], 5)\nscaled = knn_predict((X[tr] - mu) / sd, y[tr], (X[te] - mu) / sd, 5)\nprint(\"k=5 raw units:\", round(float(np.mean(raw == y[te])), 3), \"| after standardising:\", round(float(np.mean(scaled == y[te])), 3))",
      "output": "k= 1: accuracy 0.890 | agrees with scikit-learn on 100% of customers\nk= 5: accuracy 0.820 | agrees with scikit-learn on 100% of customers\nk=15: accuracy 0.850 | agrees with scikit-learn on 100% of customers\nk=5 raw units: 0.82 | after standardising: 0.84"
     },
     {
      "kind": "p",
      "text": "Our version agrees with scikit-learn on 100% of customers for k = 1, 5 and 15. Accuracy is 0.89, 0.82 and 0.85: with only 100 test rows these numbers jump around, which is why you should use cross-validation to pick k. Standardising lifted k = 5 from 0.82 to 0.84."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The whole algorithm is 'distances, sort, vote'. Everything else is choosing k and the scale."
     }
    ]
   },
   {
    "id": "knpb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split with stratify.",
       "Pipeline: StandardScaler then KNeighborsClassifier.",
       "GridSearchCV over k and the weighting (uniform or by distance).",
       "Score once on the test rows beside a majority-class baseline."
      ]
     },
     {
      "kind": "code",
      "caption": "Search k and the weighting",
      "code": "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.model_selection import GridSearchCV, train_test_split\nfrom sklearn.dummy import DummyClassifier\n\nrng = np.random.default_rng(6)\nn = 600\nincome = np.concatenate([rng.normal(40, 8, n // 2), rng.normal(58, 8, n // 2)])\ndistance = np.concatenate([rng.normal(12, 4, n // 2), rng.normal(7, 4, n // 2)])\nX = np.column_stack([income, distance]); y = np.array([0] * (n // 2) + [1] * (n // 2))\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\n\npipe = make_pipeline(StandardScaler(), KNeighborsClassifier())\ngrid = GridSearchCV(pipe, {\"kneighborsclassifier__n_neighbors\": [1, 3, 5, 9, 15, 25, 41], \"kneighborsclassifier__weights\": [\"uniform\", \"distance\"]}, cv=5).fit(Xtr, ytr)\nprint(\"best:\", grid.best_params_)\nprint(\"cross-validated accuracy:\", round(float(grid.best_score_), 3))\nprint(\"test accuracy:\", round(float(grid.score(Xte, yte)), 3), \"| majority baseline:\", round(float(DummyClassifier().fit(Xtr, ytr).score(Xte, yte)), 3))\nres = grid.cv_results_\nfor k in [1, 5, 15, 41]:\n    i = [j for j, p in enumerate(res[\"params\"]) if p[\"kneighborsclassifier__n_neighbors\"] == k and p[\"kneighborsclassifier__weights\"] == \"uniform\"][0]\n    print(f\"k={k:2d} uniform: CV accuracy {res['mean_test_score'][i]:.3f}\")",
      "output": "best: {'kneighborsclassifier__n_neighbors': 15, 'kneighborsclassifier__weights': 'distance'}\ncross-validated accuracy: 0.912\ntest accuracy: 0.9 | majority baseline: 0.5\nk= 1 uniform: CV accuracy 0.864\nk= 5 uniform: CV accuracy 0.893\nk=15 uniform: CV accuracy 0.898\nk=41 uniform: CV accuracy 0.910"
     },
     {
      "kind": "p",
      "text": "The search picked k = 15 with distance weighting: cross-validated accuracy 0.912, test accuracy 0.900, against 0.50 for the majority baseline. CV accuracy rose from 0.864 at k = 1 to 0.910 at k = 41, so a larger k clearly helps here."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Nearest-neighbour search powers recommendation and retrieval systems; embeddings plus fast neighbour lookup is how many search engines find similar items."
     }
    ]
   },
   {
    "id": "knpb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "The dials are k, the weighting, the distance and, above all, which columns you include. Test how robust the model is to useless columns."
     },
     {
      "kind": "code",
      "caption": "Add irrelevant columns and watch accuracy",
      "code": "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import cross_val_score\n\nrng = np.random.default_rng(6)\nn = 400\nincome = np.concatenate([rng.normal(40, 8, n // 2), rng.normal(58, 8, n // 2)])\ndistance = np.concatenate([rng.normal(12, 4, n // 2), rng.normal(7, 4, n // 2)])\ny = np.array([0] * (n // 2) + [1] * (n // 2))\nsignal = np.column_stack([income, distance])\nprint(\"irrelevant columns | kNN accuracy | logistic accuracy\")\nfor noise_cols in [0, 5, 20, 80]:\n    X = np.column_stack([signal, rng.normal(size=(n, noise_cols))]) if noise_cols else signal\n    knn = cross_val_score(make_pipeline(StandardScaler(), KNeighborsClassifier(9)), X, y, cv=5).mean()\n    lr = cross_val_score(make_pipeline(StandardScaler(), LogisticRegression(max_iter=500)), X, y, cv=5).mean()\n    print(f\"{noise_cols:18d} | {knn:12.3f} | {lr:.3f}\")",
      "output": "irrelevant columns | kNN accuracy | logistic accuracy\n                 0 |        0.885 | 0.878\n                 5 |        0.835 | 0.868\n                20 |        0.782 | 0.847\n                80 |        0.682 | 0.775"
     },
     {
      "kind": "p",
      "text": "With no extra columns kNN scores 0.885 and logistic regression 0.878. With 80 irrelevant columns kNN drops to 0.682 while logistic regression holds up better at 0.775. kNN treats every column as equally important; a model with weights can ignore noise."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Pick k by cross-validation, standardise, and prune columns. Distance-based models are only as good as their columns."
     }
    ]
   },
   {
    "id": "knpb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "kNN against its neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "Small data, a few relevant numeric columns",
        "kNN",
        "No training and a flexible boundary."
       ],
       [
        "Many columns, some irrelevant",
        "Logistic regression or a forest",
        "They weigh columns."
       ],
       [
        "Millions of rows",
        "Linear model or boosting",
        "kNN scans all rows per prediction."
       ],
       [
        "Mixed numeric and category columns",
        "Gradient boosting",
        "No distance needed."
       ],
       [
        "You need an explanation",
        "Logistic regression or a tree",
        "kNN can only show neighbours."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Use kNN as a quick sanity check: if a tuned kNN is far worse than a linear model, your columns probably are not capturing similarity."
     },
     {
      "kind": "check",
      "question": "You add 80 random columns and kNN accuracy falls sharply. Why?",
      "options": [
       "kNN needs more training time",
       "Distances are dominated by irrelevant columns",
       "k must be even"
      ],
      "answer": 1,
      "why": "Every column contributes equally to the distance, so noise drowns the signal."
     }
    ]
   },
   {
    "id": "knpb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Not scaling",
      "text": "A column in rupees will swamp a column in kilometres."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Choosing k on the test set",
      "text": "With 100 test rows k = 1 looked best by luck. Cross-validate."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Too many columns",
      "text": "80 noise columns cost 20 points of accuracy."
     },
     {
      "kind": "p",
      "text": "Check scaling is inside the pipeline, k came from cross-validation and the column list was pruned."
     }
    ]
   }
  ]
 },
 "naive-bayes": {
  "title": "Naive Bayes: count the evidence and multiply",
  "minutes": 13,
  "sections": [
   {
    "id": "nbpb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "Naive Bayes is the model you can train in a blink and explain in a sentence: start with how common each class is, then multiply in how likely each clue is within that class. It shines with text, small datasets and as a fast baseline."
     },
     {
      "kind": "table",
      "caption": "Is Naive Bayes a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Is the data text counts or many sparse features?",
        "Multinomial NB was made for this."
       ],
       [
        "Is there very little data?",
        "It needs few examples to estimate counts."
       ],
       [
        "Do you need a quick baseline in minutes?",
        "Training is one pass of counting."
       ],
       [
        "Do you need trustworthy probabilities?",
        "Not here. Its probabilities are overconfident."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "How does Bayes' rule turn counts into a decision, why does the 'naive' assumption hurt probabilities but not rankings, and what does smoothing do?"
     }
    ]
   },
   {
    "id": "nbpb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Bayes' rule: posterior ∝ prior × likelihood. 'Naive' means we pretend the clues are independent given the class, so likelihoods multiply. When clues are really copies of each other, the same evidence is counted again and again, which makes the probabilities extreme."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "The same clue, counted once and five times",
       "alt": "Predicted probability of class 1 as a clue value rises, for a model that saw the clue once and a model that saw five identical copies. The five copy model is far more extreme at the same clue value.",
       "xLabel": "Clue value",
       "yLabel": "P(class 1)",
       "series": [
        {
         "name": "One copy",
         "style": "line",
         "pts": [
          [
           -2.0,
           0.29
          ],
          [
           -1.8,
           0.3
          ],
          [
           -1.6,
           0.32
          ],
          [
           -1.4,
           0.33
          ],
          [
           -1.2,
           0.35
          ],
          [
           -1.0,
           0.37
          ],
          [
           -0.8,
           0.39
          ],
          [
           -0.6,
           0.41
          ],
          [
           -0.4,
           0.44
          ],
          [
           -0.2,
           0.46
          ],
          [
           0.0,
           0.49
          ],
          [
           0.2,
           0.52
          ],
          [
           0.4,
           0.55
          ],
          [
           0.6,
           0.58
          ],
          [
           0.8,
           0.6
          ],
          [
           1.0,
           0.64
          ],
          [
           1.2,
           0.67
          ],
          [
           1.4,
           0.69
          ],
          [
           1.6,
           0.72
          ],
          [
           1.8,
           0.75
          ],
          [
           2.0,
           0.78
          ],
          [
           2.2,
           0.8
          ],
          [
           2.4,
           0.83
          ],
          [
           2.6,
           0.85
          ],
          [
           2.8,
           0.87
          ],
          [
           3.0,
           0.89
          ]
         ]
        },
        {
         "name": "Five copies",
         "style": "line",
         "pts": [
          [
           -2.0,
           0.01
          ],
          [
           -1.8,
           0.01
          ],
          [
           -1.6,
           0.01
          ],
          [
           -1.4,
           0.02
          ],
          [
           -1.2,
           0.03
          ],
          [
           -1.0,
           0.04
          ],
          [
           -0.8,
           0.06
          ],
          [
           -0.6,
           0.1
          ],
          [
           -0.4,
           0.15
          ],
          [
           -0.2,
           0.22
          ],
          [
           0.0,
           0.33
          ],
          [
           0.2,
           0.46
          ],
          [
           0.4,
           0.6
          ],
          [
           0.6,
           0.73
          ],
          [
           0.8,
           0.84
          ],
          [
           1.0,
           0.91
          ],
          [
           1.2,
           0.95
          ],
          [
           1.4,
           0.97
          ],
          [
           1.6,
           0.99
          ],
          [
           1.8,
           0.99
          ],
          [
           2.0,
           1.0
          ],
          [
           2.2,
           1.0
          ],
          [
           2.4,
           1.0
          ],
          [
           2.6,
           1.0
          ],
          [
           2.8,
           1.0
          ],
          [
           3.0,
           1.0
          ]
         ]
        }
       ],
       "yDomain": [
        0,
        1
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "P(class | clues) ∝ P(class) × P(clue₁ | class) × P(clue₂ | class) × …",
       "log score = log prior + Σ log likelihoods"
      ],
      "note": "Work in logs: a product of many small numbers underflows; a sum does not."
     }
    ]
   },
   {
    "id": "nbpb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Estimate each class's share (the prior).",
       "Estimate each class's mean and variance for each numeric feature.",
       "For a new row, add the log prior and the log of a normal density for each feature.",
       "Turn the two scores into probabilities by subtracting the maximum and normalising."
      ]
     },
     {
      "kind": "code",
      "caption": "Gaussian Naive Bayes by counting, checked against scikit-learn",
      "code": "import numpy as np\nfrom sklearn.naive_bayes import GaussianNB\n\nrng = np.random.default_rng(8)\nn = 400\n# loan applicants: monthly income (thousand rupees) and existing EMI burden (share of income)\nrepaid = np.column_stack([rng.normal(55, 12, n), rng.normal(0.25, 0.08, n)])\ndefault = np.column_stack([rng.normal(38, 12, n // 4), rng.normal(0.42, 0.10, n // 4)])\nX = np.vstack([repaid, default]); y = np.array([0] * n + [1] * (n // 4))\n\n# training = counting: a prior, and a mean and variance per class and feature\nclasses = [0, 1]\nprior = np.array([np.mean(y == c) for c in classes])\nmean = np.array([X[y == c].mean(axis=0) for c in classes])\nvar = np.array([X[y == c].var(axis=0) for c in classes])\nprint(\"priors:\", prior.round(3), \"| means per class:\", mean.round(2).tolist())\n\ndef log_post(x):\n    # log prior + sum over features of the log of a normal density; sum, because we assume features are independent\n    loglik = -0.5 * np.log(2 * np.pi * var) - (x - mean) ** 2 / (2 * var)\n    return np.log(prior) + loglik.sum(axis=1)\n\napplicant = np.array([45.0, 0.35])\nlp = log_post(applicant)\npost = np.exp(lp - lp.max()); post /= post.sum()\nprint(\"applicant income 45, EMI share 0.35 -> P(default) =\", round(float(post[1]), 3))\n\nref = GaussianNB().fit(X, y)\nprint(\"scikit-learn says:\", round(float(ref.predict_proba([applicant])[0, 1]), 3))",
      "output": "priors: [0.8 0.2] | means per class: [[54.83, 0.25], [36.15, 0.41]]\napplicant income 45, EMI share 0.35 -> P(default) = 0.29\nscikit-learn says: 0.29"
     },
     {
      "kind": "p",
      "text": "The priors are 0.8 and 0.2, and the default group has lower income (36.15 against 54.83) and a higher EMI share (0.41 against 0.25). An applicant earning 45 with an EMI share of 0.35 gets P(default) = 0.29, and scikit-learn agrees exactly."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Training is counting: a prior, a mean and a variance. Prediction is adding logs."
     }
    ]
   },
   {
    "id": "nbpb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Turn text into word counts with CountVectorizer.",
       "Fit MultinomialNB in a pipeline.",
       "Predict probabilities for new messages.",
       "Read the model's log-probabilities to see which words push towards spam."
      ]
     },
     {
      "kind": "code",
      "caption": "A tiny spam filter, with and without smoothing",
      "code": "import numpy as np\nfrom sklearn.feature_extraction.text import CountVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.pipeline import make_pipeline\n\nspam = [\"win a free recharge now\", \"free gift claim your prize now\", \"urgent loan approved click now\", \"claim free cashback offer today\",\n        \"you won a prize call now\", \"cheap loan offer apply today\", \"free recharge offer click here\", \"lottery prize claim now\"]\nham = [\"are we meeting for lunch today\", \"please send the project report\", \"call me when you reach home\", \"happy birthday see you tonight\",\n       \"the meeting is moved to monday\", \"can you share the notes\", \"dinner at home tonight\", \"thanks for the report\"]\ntexts = spam + ham; y = np.array([1] * len(spam) + [0] * len(ham))\n\nfor alpha in [1.0, 0.0001]:\n    model = make_pipeline(CountVectorizer(), MultinomialNB(alpha=alpha)).fit(texts, y)\n    for msg in [\"claim your free prize\", \"meeting tonight at home\", \"free lunch at the meeting\", \"quarterly report review\"]:\n        print(f\"alpha {alpha:<6} | P(spam) {model.predict_proba([msg])[0, 1]:.3f} | {msg}\")\nvec = model[0]\nnbm = model[1]\nwords = np.array(vec.get_feature_names_out())\ntop = np.argsort(nbm.feature_log_prob_[1] - nbm.feature_log_prob_[0])[::-1][:5]\nprint(\"words that push most towards spam:\", words[top].tolist())",
      "output": "alpha 1.0    | P(spam) 0.994 | claim your free prize\nalpha 1.0    | P(spam) 0.020 | meeting tonight at home\nalpha 1.0    | P(spam) 0.085 | free lunch at the meeting\nalpha 1.0    | P(spam) 0.254 | quarterly report review\nalpha 0.0001 | P(spam) 1.000 | claim your free prize\nalpha 0.0001 | P(spam) 0.000 | meeting tonight at home\nalpha 0.0001 | P(spam) 0.000 | free lunch at the meeting\nalpha 0.0001 | P(spam) 0.000 | quarterly report review\nwords that push most towards spam: ['now', 'free', 'claim', 'offer', 'prize']"
     },
     {
      "kind": "p",
      "text": "With alpha = 1 'claim your free prize' scores 0.994 spam and 'meeting tonight at home' 0.020. The words pushing most towards spam are now, free, claim, offer and prize. With almost no smoothing, 'free lunch at the meeting' goes to exactly 0.000 because one unseen pairing zeroes the product, and so does 'quarterly report review': a word never seen in a class gets probability zero."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Spam filters were the first big win for Naive Bayes, and it is still a common baseline for text classification."
     }
    ]
   },
   {
    "id": "nbpb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "Tune the smoothing (alpha), and treat the probabilities as scores for ranking, not as honest percentages. Duplicate evidence makes them overconfident."
     },
     {
      "kind": "code",
      "caption": "Copy a clue five times",
      "code": "import numpy as np\nfrom sklearn.naive_bayes import GaussianNB\n\nrng = np.random.default_rng(8)\nn = 600\ny = (rng.random(n) < 0.5).astype(int)\nclue = rng.normal(0.6 * y, 1.0)                     # one honest, weak clue\nX1 = clue.reshape(-1, 1)\nX5 = np.column_stack([clue] * 5)                    # the same clue copied five times\nm1 = GaussianNB().fit(X1, y); m5 = GaussianNB().fit(X5, y)\nprobe = np.array([[1.0]])\nprint(\"one copy of the clue   -> P(y=1) =\", round(float(m1.predict_proba(probe)[0, 1]), 3))\nprint(\"five copies of the clue -> P(y=1) =\", round(float(m5.predict_proba(np.repeat(probe, 5, axis=1))[0, 1]), 3))\np1 = m1.predict_proba(X1)[:, 1]; p5 = m5.predict_proba(X5)[:, 1]\nprint(\"accuracy: one\", round(float(np.mean((p1 > 0.5) == y)), 3), \"| five\", round(float(np.mean((p5 > 0.5) == y)), 3), \"(ranking barely changes)\")\nprint(\"share of customers given more than 90% confidence: one\", round(float(np.mean((p1 > 0.9) | (p1 < 0.1))), 3), \"| five\", round(float(np.mean((p5 > 0.9) | (p5 < 0.1))), 3))",
      "output": "one copy of the clue   -> P(y=1) = 0.635\nfive copies of the clue -> P(y=1) = 0.906\naccuracy: one 0.613 | five 0.607 (ranking barely changes)\nshare of customers given more than 90% confidence: one 0.005 | five 0.442"
     },
     {
      "kind": "p",
      "text": "Copying one weak clue five times pushes P(y = 1) from 0.635 to 0.906 at the same clue value. Accuracy hardly moves (0.613 against 0.607), but the share of customers given more than 90% confidence jumps from 0.5% to 44.2%. If you need calibrated probabilities, calibrate afterwards or use logistic regression."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Naive Bayes ranks well and speaks too loudly. Smooth with alpha, and calibrate if probabilities matter."
     }
    ]
   },
   {
    "id": "nbpb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "Naive Bayes against its neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "Text with word counts, small data",
        "Naive Bayes",
        "Fast, strong baseline."
       ],
       [
        "You need honest probabilities",
        "Logistic regression",
        "Better calibrated."
       ],
       [
        "Correlated features dominate",
        "Logistic regression or boosting",
        "They do not assume independence."
       ],
       [
        "Very large text corpus",
        "Logistic regression on TF-IDF",
        "Usually more accurate."
       ],
       [
        "Mixed tabular data",
        "Gradient boosting",
        "Handles interactions."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A good use: build Naive Bayes first as a 10-minute baseline, then see whether a heavier model is worth it."
     },
     {
      "kind": "check",
      "question": "Five copies of the same clue make the model far more confident. What does this show?",
      "options": [
       "Naive Bayes is accurate",
       "The independence assumption double-counts evidence",
       "Smoothing is too high"
      ],
      "answer": 1,
      "why": "Treating copies as independent evidence multiplies the likelihoods."
     }
    ]
   },
   {
    "id": "nbpb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting the probabilities",
      "text": "Five copies of one clue made 44% of customers look near-certain."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · No smoothing",
      "text": "An unseen word zeroed the whole product."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Correlated features",
      "text": "Duplicate or overlapping columns count twice."
     },
     {
      "kind": "p",
      "text": "Check alpha is above zero, the output is used for ranking, and correlated columns were removed."
     }
    ]
   }
  ]
 },
 "svm": {
  "title": "Support Vector Machines: the widest street",
  "minutes": 14,
  "sections": [
   {
    "id": "svpb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "Many lines can separate two groups. An SVM picks the one with the widest empty street between them, so new points near the border are less likely to be misclassified. With a kernel, the same idea draws curved boundaries, making SVMs strong on small and medium datasets."
     },
     {
      "kind": "table",
      "caption": "Is an SVM a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Small to medium data, a few thousand rows?",
        "Training slows steeply with rows."
       ],
       [
        "Is the boundary curved?",
        "The RBF kernel bends it."
       ],
       [
        "Are features on comparable scales?",
        "You must scale them, or you can."
       ],
       [
        "Do you need probabilities or an explanation?",
        "Not natively. Use logistic regression."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "What is the margin, how do C and gamma trade flexibility against overfitting, and why does scaling decide everything?"
     }
    ]
   },
   {
    "id": "svpb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "The boundary is the centre of the street; the dashed lines mark its edges. Only the points on or inside the edges, the support vectors, determine the boundary. Move any other point and nothing changes."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "The widest street between two groups",
       "alt": "Two clusters of points separated by a diagonal boundary, with dashed lines marking the margin on each side. Only the few points touching the margin decide where the boundary sits.",
       "xLabel": "Feature 1",
       "yLabel": "Feature 2",
       "series": [
        {
         "name": "Class -1",
         "style": "points",
         "pts": [
          [
           -1.21,
           -0.36
          ],
          [
           -1.7,
           -2.26
          ],
          [
           -2.73,
           -1.08
          ],
          [
           -1.25,
           -0.71
          ],
          [
           -1.68,
           -1.68
          ],
          [
           -0.54,
           -1.7
          ],
          [
           -1.05,
           -1.63
          ],
          [
           -0.44,
           -1.3
          ],
          [
           -1.48,
           -0.76
          ],
          [
           -0.21,
           0.1
          ],
          [
           -1.05,
           -1.2
          ],
          [
           -0.9,
           -0.82
          ],
          [
           -1.24,
           -0.66
          ],
          [
           -2.14,
           -1.01
          ],
          [
           -0.55,
           -2.6
          ],
          [
           -0.26,
           -1.55
          ],
          [
           -0.41,
           -1.14
          ],
          [
           -1.05,
           -1.77
          ],
          [
           -1.22,
           -1.41
          ],
          [
           -2.46,
           -0.12
          ],
          [
           -0.49,
           -0.6
          ],
          [
           0.89,
           -1.69
          ],
          [
           0.12,
           -1.31
          ],
          [
           -0.99,
           -1.51
          ],
          [
           -2.89,
           -2.23
          ],
          [
           -0.36,
           -0.84
          ],
          [
           -1.36,
           -0.17
          ],
          [
           -2.01,
           -1.12
          ],
          [
           -0.92,
           -0.44
          ],
          [
           -1.85,
           -1.15
          ],
          [
           -2.09,
           -2.99
          ],
          [
           -1.42,
           -1.27
          ],
          [
           -0.34,
           -1.38
          ],
          [
           -1.33,
           -1.7
          ]
         ]
        },
        {
         "name": "Class +1",
         "style": "points",
         "pts": [
          [
           -0.14,
           0.19
          ],
          [
           1.61,
           1.68
          ],
          [
           1.18,
           0.95
          ],
          [
           1.52,
           1.25
          ],
          [
           0.49,
           0.97
          ],
          [
           2.74,
           0.14
          ],
          [
           1.1,
           0.93
          ],
          [
           0.74,
           -0.25
          ],
          [
           1.26,
           -0.35
          ],
          [
           1.45,
           2.83
          ],
          [
           0.13,
           2.12
          ],
          [
           1.83,
           2.06
          ],
          [
           0.47,
           0.21
          ],
          [
           0.93,
           1.29
          ],
          [
           1.41,
           0.77
          ],
          [
           1.03,
           1.21
          ],
          [
           1.94,
           1.67
          ],
          [
           0.84,
           2.51
          ],
          [
           2.91,
           1.55
          ],
          [
           1.34,
           0.01
          ],
          [
           1.3,
           1.24
          ],
          [
           -0.7,
           1.98
          ],
          [
           1.89,
           1.88
          ],
          [
           0.86,
           1.36
          ],
          [
           2.27,
           1.11
          ],
          [
           0.94,
           1.7
          ],
          [
           2.12,
           1.19
          ],
          [
           1.36,
           -0.26
          ],
          [
           1.37,
           1.1
          ],
          [
           1.46,
           1.83
          ],
          [
           0.9,
           -0.07
          ],
          [
           0.72,
           0.85
          ],
          [
           1.48,
           1.99
          ],
          [
           1.11,
           1.48
          ]
         ]
        },
        {
         "name": "Boundary",
         "style": "line",
         "pts": [
          [
           -3.0,
           3.69
          ],
          [
           3.0,
           -3.66
          ]
         ]
        },
        {
         "name": "Margin",
         "style": "line",
         "dash": true,
         "pts": [
          [
           -3.0,
           4.39
          ],
          [
           3.0,
           -2.96
          ]
         ]
        },
        {
         "name": "Margin (other side)",
         "style": "line",
         "dash": true,
         "pts": [
          [
           -3.0,
           2.99
          ],
          [
           3.0,
           -4.37
          ]
         ]
        }
       ],
       "xDomain": [
        -3.5,
        3.5
       ],
       "yDomain": [
        -3.5,
        3.5
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "boundary:  w · x + b = 0",
       "margin edges:  w · x + b = ±1,  width = 2 / ‖w‖",
       "loss = hinge: max(0, 1 − y(w·x + b)) + a penalty on ‖w‖"
      ],
      "note": "C sets how heavily the model punishes points inside the street."
     }
    ]
   },
   {
    "id": "svpb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Label the classes −1 and +1.",
       "For each point, check whether it is safely outside the street: y (w·x + b) ≥ 1.",
       "If it is not, push the weights towards that point; if it is, only shrink the weights slightly, which widens the street.",
       "Repeat for several passes over shuffled data."
      ]
     },
     {
      "kind": "code",
      "caption": "A linear SVM by stochastic gradient descent",
      "code": "import numpy as np\nfrom sklearn.svm import SVC\n\nrng = np.random.default_rng(12)\nn = 200\nX = np.vstack([rng.normal([-1.2, -1.2], 0.8, (n // 2, 2)), rng.normal([1.2, 1.2], 0.8, (n // 2, 2))])\ny = np.array([-1] * (n // 2) + [1] * (n // 2))          # SVMs use labels -1 and +1\n\nw, b = np.zeros(2), 0.0\nC, lr = 1.0, 0.01\nfor epoch in range(300):\n    for i in rng.permutation(n):\n        if y[i] * (X[i] @ w + b) < 1:                   # inside the margin or wrong side: the hinge is active\n            w += lr * (C * y[i] * X[i] - w / n)\n            b += lr * C * y[i]\n        else:                                           # safely outside: only shrink the weights (wider margin)\n            w -= lr * w / n\nacc = np.mean(np.sign(X @ w + b) == y)\nmargin = 2 / np.linalg.norm(w)\nprint(\"weights:\", w.round(2), \"bias:\", round(float(b), 2), \"| accuracy:\", round(float(acc), 3), \"| margin width:\", round(float(margin), 2))\nprint(\"points inside or on the margin:\", int((y * (X @ w + b) <= 1.0).sum()))\nref = SVC(kernel=\"linear\", C=1.0).fit(X, y)\nprint(\"scikit-learn linear SVC accuracy:\", round(float(ref.score(X, y)), 3), \"| support vectors:\", int(ref.n_support_.sum()))",
      "output": "weights: [1.74 1.42] bias: -0.02 | accuracy: 0.995 | margin width: 0.89\npoints inside or on the margin: 9\nscikit-learn linear SVC accuracy: 0.99 | support vectors: 10"
     },
     {
      "kind": "p",
      "text": "Our version reaches 99.5% accuracy with a margin width of 0.89, and only 9 points lie inside or on the margin. scikit-learn's linear SVC scores 0.99 with 10 support vectors, so the two agree on the idea: a handful of points decide everything."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The hinge loss ignores points that are safely correct. The street is held up by the few points that touch it."
     }
    ]
   },
   {
    "id": "svpb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split with stratify.",
       "Pipeline: StandardScaler then SVC with the RBF kernel.",
       "GridSearchCV over C and gamma.",
       "Compare with logistic regression on the same test rows."
      ]
     },
     {
      "kind": "code",
      "caption": "RBF SVM against logistic regression on two interleaved moons",
      "code": "import numpy as np\nfrom sklearn.datasets import make_moons\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import GridSearchCV, train_test_split\n\nX, y = make_moons(n_samples=400, noise=0.15, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\npipe = make_pipeline(StandardScaler(), SVC())\ngrid = GridSearchCV(pipe, {\"svc__C\": [0.1, 1, 10], \"svc__gamma\": [0.1, 1, 10]}, cv=5).fit(Xtr, ytr)\nprint(\"best:\", grid.best_params_, \"| CV accuracy\", round(float(grid.best_score_), 3))\nprint(\"test accuracy: RBF SVM\", round(float(grid.score(Xte, yte)), 3), \"| logistic regression\", round(float(make_pipeline(StandardScaler(), LogisticRegression()).fit(Xtr, ytr).score(Xte, yte)), 3))\nprint(\"support vectors:\", int(grid.best_estimator_[-1].n_support_.sum()), \"of\", len(Xtr), \"training points\")",
      "output": "best: {'svc__C': 1, 'svc__gamma': 10} | CV accuracy 0.986\ntest accuracy: RBF SVM 0.975 | logistic regression 0.917\nsupport vectors: 107 of 280 training points"
     },
     {
      "kind": "p",
      "text": "The search chose C = 1 and gamma = 10 with CV accuracy 0.986. On the test rows the RBF SVM scores 0.975 against 0.917 for logistic regression, a gap a straight boundary cannot close. 107 of 280 training points are support vectors."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "The kernel trick, replacing a dot product with a similarity function, reappears in Gaussian processes and in how attention compares tokens."
     }
    ]
   },
   {
    "id": "svpb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "Two dials: C (how hard to punish points inside the street) and gamma (how local the RBF's reach is). And one hard rule: scale your features."
     },
     {
      "kind": "code",
      "caption": "Gamma, C and the effect of units",
      "code": "import numpy as np\nfrom sklearn.datasets import make_moons\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nfrom sklearn.model_selection import train_test_split\n\nX, y = make_moons(n_samples=400, noise=0.15, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nprint(\"gamma  C    | train acc | test acc | support vectors\")\nfor gamma in [0.1, 1, 30]:\n    for C in [0.1, 100]:\n        m = make_pipeline(StandardScaler(), SVC(C=C, gamma=gamma)).fit(Xtr, ytr)\n        print(f\"{gamma:5} {C:5} | {m.score(Xtr, ytr):9.3f} | {m.score(Xte, yte):8.3f} | {int(m[-1].n_support_.sum())}\")\n# scale matters: put one feature in different units\nXbig = Xtr * np.array([1.0, 1000.0])\nXbig_te = Xte * np.array([1.0, 1000.0])\nprint(\"unscaled, one feature x1000:\", round(float(SVC().fit(Xbig, ytr).score(Xbig_te, yte)), 3), \"| with scaling:\", round(float(make_pipeline(StandardScaler(), SVC()).fit(Xbig, ytr).score(Xbig_te, yte)), 3))",
      "output": "gamma  C    | train acc | test acc | support vectors\n  0.1   0.1 |     0.871 |    0.908 | 156\n  0.1   100 |     0.982 |    0.942 | 46\n    1   0.1 |     0.961 |    0.950 | 133\n    1   100 |     0.993 |    0.967 | 17\n   30   0.1 |     0.993 |    0.958 | 280\n   30   100 |     0.996 |    0.975 | 188\nunscaled, one feature x1000: 0.858 | with scaling: 0.967"
     },
     {
      "kind": "p",
      "text": "At gamma 0.1 and C 0.1 the model underfits (0.871 on training). Raising gamma to 30 with C 0.1 uses all 280 training points as support vectors, a sign of memorising. The unscaled test is stark: with one feature multiplied by 1000 accuracy falls to 0.858, but with scaling it is 0.967."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Search C and gamma on a log grid with cross-validation. Count support vectors: nearly all of them means memorising."
     }
    ]
   },
   {
    "id": "svpb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "SVM against its neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "Small data, curved boundary",
        "RBF SVM",
        "Strong boundary with few tuning dials."
       ],
       [
        "Need an explanation or probabilities",
        "Logistic regression",
        "Odds ratios, calibrated output."
       ],
       [
        "Big data (100k+ rows)",
        "Linear model or boosting",
        "SVM training scales poorly."
       ],
       [
        "Mixed categories and missing values",
        "Gradient boosting",
        "Handles them natively."
       ],
       [
        "Images, audio, text at scale",
        "Neural networks",
        "Learn features themselves."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Try a linear model first. Reach for the RBF SVM when the plot or the residuals show a curved boundary."
     },
     {
      "kind": "check",
      "question": "With gamma = 30 nearly every training point is a support vector. What does that suggest?",
      "options": [
       "A wide, simple boundary",
       "The model is memorising the training data",
       "C is too small to matter"
      ],
      "answer": 1,
      "why": "A very local kernel makes each point its own region, a sign of overfitting."
     }
    ]
   },
   {
    "id": "svpb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Not scaling",
      "text": "One feature in large units cost 11 points of accuracy."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Over-large gamma",
      "text": "All 280 training points became support vectors."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Expecting probabilities",
      "text": "SVMs give distances to the boundary; calibrate if you need probabilities."
     },
     {
      "kind": "p",
      "text": "Check the scaler is in the pipeline, C and gamma came from cross-validation, and support-vector count is reasonable."
     }
    ]
   }
  ]
 },
 "decision-trees": {
  "title": "Decision trees: a flowchart the data writes for you",
  "minutes": 14,
  "sections": [
   {
    "id": "dtpb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "A decision tree asks a sequence of yes/no questions — is the EMI share above 0.37? is income below 50? — and ends in a verdict. It is the only major model you can print and hand to a manager, and it handles curves, jumps and interactions without any feature engineering."
     },
     {
      "kind": "table",
      "caption": "Is a decision tree a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Must the model be readable as rules?",
        "The tree is the rules."
       ],
       [
        "Mixed numeric and category columns, no scaling?",
        "Trees do not need scaling."
       ],
       [
        "Sudden thresholds (an EMI limit, a tax slab)?",
        "Splits are thresholds."
       ],
       [
        "Do you need a stable, high-accuracy model alone?",
        "One tree is unstable; use a forest or boosting."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "How does a tree pick its questions, how deep should it go, and why does one tree wobble?"
     }
    ]
   },
   {
    "id": "dtpb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Greedy and simple: try every possible cut, keep the one that leaves the groups purest, then repeat inside each group. Deeper trees fit the training data better, but past a point they only memorise it."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Accuracy against tree depth",
       "alt": "Training accuracy climbs to 1.0 as a decision tree gets deeper, while test accuracy peaks at depth 3 with 0.925 and then settles near 0.917.",
       "xLabel": "Maximum depth",
       "yLabel": "Accuracy",
       "series": [
        {
         "name": "Training",
         "style": "line",
         "pts": [
          [
           1.0,
           0.89
          ],
          [
           2.0,
           0.89
          ],
          [
           3.0,
           0.96
          ],
          [
           5.0,
           0.98
          ],
          [
           8.0,
           0.99
          ],
          [
           14.0,
           1.0
          ]
         ]
        },
        {
         "name": "Test",
         "style": "line",
         "pts": [
          [
           1.0,
           0.83
          ],
          [
           2.0,
           0.83
          ],
          [
           3.0,
           0.93
          ],
          [
           5.0,
           0.92
          ],
          [
           8.0,
           0.92
          ],
          [
           14.0,
           0.92
          ]
         ]
        }
       ],
       "yDomain": [
        0.8,
        1.02
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "impurity (Gini) = 2 p (1 − p)",
       "score of a cut = weighted average impurity of the two groups",
       "pick the cut with the lowest score; recurse on each side"
      ],
      "note": "An impurity of 0 means a pure group, 0.5 means a coin flip."
     }
    ]
   },
   {
    "id": "dtpb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Define impurity for a group of labels.",
       "For each feature, try a cut between every pair of distinct values.",
       "Score each cut by the weighted impurity of the two sides.",
       "Keep the best cut, then repeat on each side until a stopping rule applies."
      ]
     },
     {
      "kind": "code",
      "caption": "Find the best first question by brute force",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier, export_text\n\nrng = np.random.default_rng(14)\nn = 400\nincome = rng.uniform(15, 100, n)                         # monthly income, thousand rupees\nemi = rng.uniform(0, 0.7, n)                             # share of income already going to EMIs\nrisky = ((emi > 0.38) | ((income < 50) & (emi > 0.2))).astype(int)\nflip = rng.random(n) < 0.05\ny = np.where(flip, 1 - risky, risky)\nX = np.column_stack([income, emi])\n\ndef gini(labels):\n    if len(labels) == 0: return 0.0\n    p = labels.mean()\n    return 2 * p * (1 - p)                                # impurity of a two-class group\n\ndef best_split(X, y):\n    best = (None, None, gini(y))\n    for j in range(X.shape[1]):\n        for t in np.unique(X[:, j])[:-1]:                 # try a cut between every pair of distinct values\n            left = y[X[:, j] <= t]; right = y[X[:, j] > t]\n            score = (len(left) * gini(left) + len(right) * gini(right)) / len(y)    # impurity after the cut, weighted\n            if score < best[2]: best = (j, float(t), score)\n    return best\n\nj, t, score = best_split(X, y)\nprint(\"impurity before any split:\", round(gini(y), 3))\nprint(f\"best first question: feature {j} ({['income', 'emi share'][j]}) <= {t:.3f} -> impurity after {score:.3f}\")\nref = DecisionTreeClassifier(max_depth=1, random_state=0).fit(X, y)\nprint(f\"scikit-learn's stump asks: feature {ref.tree_.feature[0]} <= {ref.tree_.threshold[0]:.3f}\")",
      "output": "impurity before any split: 0.488\nbest first question: feature 1 (emi share) <= 0.367 -> impurity after 0.229\nscikit-learn's stump asks: feature 1 <= 0.369"
     },
     {
      "kind": "p",
      "text": "Before any question the impurity is 0.488, close to a coin flip. The best first cut is emi share ≤ 0.367, dropping impurity to 0.229. scikit-learn asks about 0.369: the same question, with the cut placed halfway between neighbouring values."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A tree is this search repeated. Understand best_split and you understand the algorithm."
     }
    ]
   },
   {
    "id": "dtpb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split with stratify.",
       "Search max_depth and min_samples_leaf with GridSearchCV.",
       "Score once on the test rows beside a majority baseline.",
       "Print the tree with export_text and read it aloud."
      ]
     },
     {
      "kind": "code",
      "caption": "Tune, score and print the rules",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier, export_text\nfrom sklearn.model_selection import GridSearchCV, train_test_split\nfrom sklearn.dummy import DummyClassifier\n\nrng = np.random.default_rng(14)\nn = 800\nincome = rng.uniform(15, 100, n); emi = rng.uniform(0, 0.7, n)\nrisky = ((emi > 0.38) | ((income < 50) & (emi > 0.2))).astype(int)\ny = np.where(rng.random(n) < 0.05, 1 - risky, risky)\nX = np.column_stack([income, emi])\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\n\ngrid = GridSearchCV(DecisionTreeClassifier(random_state=0), {\"max_depth\": [1, 2, 3, 4, 6, 10], \"min_samples_leaf\": [1, 10, 30]}, cv=5).fit(Xtr, ytr)\nprint(\"best:\", grid.best_params_, \"| CV accuracy\", round(float(grid.best_score_), 3))\nprint(\"test accuracy:\", round(float(grid.score(Xte, yte)), 3), \"| majority baseline:\", round(float(DummyClassifier().fit(Xtr, ytr).score(Xte, yte)), 3))\ntree = DecisionTreeClassifier(max_depth=3, min_samples_leaf=30, random_state=0).fit(Xtr, ytr)\nprint(export_text(tree, feature_names=[\"income\", \"emi_share\"], show_weights=True))",
      "output": "best: {'max_depth': 3, 'min_samples_leaf': 10} | CV accuracy 0.961\ntest accuracy: 0.929 | majority baseline: 0.567\n|--- emi_share <= 0.37\n|   |--- emi_share <= 0.20\n|   |   |--- income <= 31.78\n|   |   |   |--- weights: [42.00, 5.00] class: 0\n|   |   |--- income >  31.78\n|   |   |   |--- weights: [125.00, 4.00] class: 0\n|   |--- emi_share >  0.20\n|   |   |--- income <= 50.26\n|   |   |   |--- weights: [1.00, 44.00] class: 1\n|   |   |--- income >  50.26\n|   |   |   |--- weights: [69.00, 4.00] class: 0\n|--- emi_share >  0.37\n|   |--- income <= 49.70\n|   |   |--- income <= 36.44\n|   |   |   |--- weights: [1.00, 58.00] class: 1\n|   |   |--- income >  36.44\n|   |   |   |--- weights: [4.00, 36.00] class: 1\n|   |--- income >  49.70\n|   |   |--- emi_share <= 0.56\n|   |   |   |--- weights: [2.00, 97.00] class: 1\n|   |   |--- emi_share >  0.56\n|   |   |   |--- weights: [0.00, 68.00] class: 1"
     },
     {
      "kind": "p",
      "text": "Depth 3 with at least 10 rows per leaf wins: CV accuracy 0.961, test accuracy 0.929 against 0.567 for the majority class. The printout reads like a policy: if EMI share is above 0.37 the customer is risky in almost every branch, and below it, income under about 50 with EMI above 0.20 is the risky pocket."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every leaf's [class 0 count, class 1 count] is a probability waiting to be read. That is the seed of random forests and boosting."
     }
    ]
   },
   {
    "id": "dtpb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "The dials are depth, minimum leaf size and a split penalty. Plot train against test accuracy by depth, then check stability."
     },
     {
      "kind": "code",
      "caption": "Depth sweep and a stability test",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(14)\nn = 800\nincome = rng.uniform(15, 100, n); emi = rng.uniform(0, 0.7, n)\nrisky = ((emi > 0.38) | ((income < 50) & (emi > 0.2))).astype(int)\ny = np.where(rng.random(n) < 0.05, 1 - risky, risky)\nX = np.column_stack([income, emi])\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\n\nprint(\"depth | train acc | test acc | leaves\")\nfor d in [1, 2, 3, 5, 8, 14]:\n    t = DecisionTreeClassifier(max_depth=d, random_state=0).fit(Xtr, ytr)\n    print(f\"{d:5d} | {t.score(Xtr, ytr):9.3f} | {t.score(Xte, yte):8.3f} | {t.get_n_leaves()}\")\n\n# instability: a small sample makes the questions wobble. Refit on resamples of 60 customers.\nsmall_X, small_y = Xtr[:60], ytr[:60]\nprint(\"first two questions on six resamples of 60 customers:\")\nfor seed in range(6):\n    r = np.random.default_rng(seed).integers(0, 60, 60)\n    t = DecisionTreeClassifier(max_depth=2, random_state=0).fit(small_X[r], small_y[r])\n    name = [\"income\", \"emi_share\"]\n    left = t.tree_.children_left[0]\n    second = \"the left branch stops\" if t.tree_.feature[left] < 0 else f\"{name[t.tree_.feature[left]]} <= {t.tree_.threshold[left]:.2f}\"\n    print(f\"  resample {seed}: {name[t.tree_.feature[0]]} <= {t.tree_.threshold[0]:.2f}, then {second}\")",
      "output": "depth | train acc | test acc | leaves\n    1 |     0.886 |    0.833 | 2\n    2 |     0.886 |    0.833 | 4\n    3 |     0.964 |    0.925 | 8\n    5 |     0.977 |    0.917 | 22\n    8 |     0.993 |    0.917 | 39\n   14 |     1.000 |    0.917 | 44\nfirst two questions on six resamples of 60 customers:\n  resample 0: emi_share <= 0.29, then income <= 15.36\n  resample 1: emi_share <= 0.27, then the left branch stops\n  resample 2: emi_share <= 0.29, then the left branch stops\n  resample 3: emi_share <= 0.29, then income <= 15.67\n  resample 4: emi_share <= 0.22, then the left branch stops\n  resample 5: emi_share <= 0.30, then emi_share <= 0.27"
     },
     {
      "kind": "p",
      "text": "Training accuracy rises to 1.000 at depth 14, while test accuracy peaks at 0.925 at depth 3 and does not improve after. The stability test is the real warning: on six resamples of 60 customers the first question lands at EMI share 0.29, 0.27, 0.29, 0.29, 0.22 and 0.30, and the second question changes or disappears each time. One tree's rules should not be over-read."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Prune with min_samples_leaf and depth, and treat a single tree as a sketch of the data, not the truth."
     }
    ]
   },
   {
    "id": "dtpb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "Decision trees against their neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "Need rules a manager can read",
        "Decision tree",
        "The tree is the explanation."
       ],
       [
        "Maximum accuracy on tabular data",
        "Gradient boosting or random forest",
        "Many trees remove the wobble."
       ],
       [
        "Smooth linear effects",
        "Linear or logistic regression",
        "Trees approximate lines with steps."
       ],
       [
        "Need probabilities that are well calibrated",
        "Logistic regression, or calibrate a forest",
        "Leaf frequencies are rough."
       ],
       [
        "Small data, extrapolation needed",
        "Linear model",
        "Trees cannot predict beyond seen values."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Use a shallow tree to learn what the data looks like; reach for an ensemble for the final score."
     },
     {
      "kind": "check",
      "question": "Training accuracy is 1.000 and test accuracy is 0.917 at depth 14, with 0.925 at depth 3. Which do you deploy?",
      "options": [
       "Depth 14",
       "Depth 3",
       "Whichever has the most leaves"
      ],
      "answer": 1,
      "why": "Simpler trees generalise as well or better and are easier to read."
     }
    ]
   },
   {
    "id": "dtpb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Letting the tree grow fully",
      "text": "44 leaves memorised the training rows and gained nothing on test."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Over-reading the questions",
      "text": "The second question changed on every resample of 60 customers."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Expecting smooth predictions",
      "text": "Trees output steps. Use a different model for smooth effects."
     },
     {
      "kind": "p",
      "text": "Check depth and leaf size came from cross-validation, the baseline is stated, and you have looked at the tree under a few resamples."
     }
    ]
   }
  ]
 },
 "random-forests": {
  "title": "Random forests: many wobbly trees, one steady vote",
  "minutes": 14,
  "sections": [
   {
    "id": "rfpb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "One deep tree memorises. A hundred deep trees, each trained on a different random sample and a random subset of columns, make different mistakes, and a vote cancels them out. A random forest is the model to reach for when you want strong accuracy with almost no tuning."
     },
     {
      "kind": "table",
      "caption": "Is a random forest a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Tabular data, mixed columns, interactions?",
        "Forests find interactions on their own."
       ],
       [
        "Do you want good results with little tuning?",
        "Defaults are usually decent."
       ],
       [
        "Do you need a free honest accuracy estimate?",
        "Out-of-bag rows give one."
       ],
       [
        "Must you extrapolate beyond the data?",
        "Forests cannot."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "Why does averaging many trees work, how do I build it, and how do I read importance honestly?"
     }
    ]
   },
   {
    "id": "rfpb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Bagging: draw rows with replacement to train each tree. About a third of rows are left out of each tree's sample, so every tree can be scored on rows it never saw. Random feature subsets make the trees disagree usefully. More trees steady the vote, but returns shrink fast."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Test accuracy against number of trees",
       "alt": "Test accuracy of a random forest rises from 0.719 with one tree to 0.847 with 20 trees and 0.850 with 200 trees; the gain after about 20 trees is small.",
       "xLabel": "Number of trees",
       "yLabel": "Test accuracy",
       "series": [
        {
         "name": "Test accuracy",
         "style": "line",
         "pts": [
          [
           1.0,
           0.72
          ],
          [
           5.0,
           0.82
          ],
          [
           20.0,
           0.85
          ],
          [
           60.0,
           0.85
          ],
          [
           200.0,
           0.85
          ]
         ]
        }
       ],
       "yDomain": [
        0.7,
        0.9
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "each tree:  bootstrap rows + a random subset of columns at each split",
       "forest prediction = vote (or average) over all trees",
       "out-of-bag score = accuracy on rows each tree did not see"
      ],
      "note": "More trees never overfit more; they only cost time."
     }
    ]
   },
   {
    "id": "rfpb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Draw a bootstrap sample of rows, with replacement.",
       "Fit a tree that may look at only a few random columns per split.",
       "Collect each tree's vote and note which rows it never saw.",
       "Average the votes. Score each row using only the trees that never saw it."
      ]
     },
     {
      "kind": "code",
      "caption": "A 60-tree forest from single trees",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(16)\nn = 1200\nX = rng.normal(size=(n, 6))\ny = ((X[:, 0] + X[:, 1] * X[:, 2] + 0.5 * X[:, 3] + rng.normal(0, 0.8, n)) > 0).astype(int)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\n\ndef forest_fit_predict(Xtr, ytr, Xnew, n_trees=60, seed=0):\n    rng = np.random.default_rng(seed)\n    votes = np.zeros(len(Xnew)); oob_votes = np.zeros(len(Xtr)); oob_count = np.zeros(len(Xtr))\n    for _ in range(n_trees):\n        rows = rng.integers(0, len(Xtr), len(Xtr))                 # a bootstrap sample: draw rows with replacement\n        tree = DecisionTreeClassifier(max_features=2, random_state=int(rng.integers(1_000_000))).fit(Xtr[rows], ytr[rows])\n        votes += tree.predict(Xnew)\n        left_out = np.setdiff1d(np.arange(len(Xtr)), rows)         # rows this tree never saw\n        oob_votes[left_out] += tree.predict(Xtr[left_out]); oob_count[left_out] += 1\n    ok = oob_count > 0\n    oob_acc = np.mean((oob_votes[ok] / oob_count[ok] > 0.5) == ytr[ok])\n    return (votes / n_trees > 0.5).astype(int), float(oob_acc)\n\npred, oob = forest_fit_predict(Xtr, ytr, Xte)\none = DecisionTreeClassifier(random_state=0).fit(Xtr, ytr).score(Xte, yte)\nprint(\"one deep tree, test accuracy:\", round(float(one), 3))\nprint(\"our 60-tree forest, test accuracy:\", round(float(np.mean(pred == yte)), 3), \"| out-of-bag estimate:\", round(oob, 3))\nref = RandomForestClassifier(n_estimators=60, max_features=2, oob_score=True, random_state=0).fit(Xtr, ytr)\nprint(\"scikit-learn forest: test\", round(float(ref.score(Xte, yte)), 3), \"| out-of-bag\", round(float(ref.oob_score_), 3))",
      "output": "one deep tree, test accuracy: 0.781\nour 60-tree forest, test accuracy: 0.831 | out-of-bag estimate: 0.783\nscikit-learn forest: test 0.839 | out-of-bag 0.783"
     },
     {
      "kind": "p",
      "text": "A single deep tree scores 0.781 on test. Our 60-tree forest scores 0.831 and scikit-learn's 0.839, and the out-of-bag estimate of 0.783 matches in both. That is 5 to 6 points from nothing but averaging."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Bootstrapping plus random columns makes trees disagree; the vote keeps what they agree on."
     }
    ]
   },
   {
    "id": "rfpb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split the rows.",
       "Fit RandomForestClassifier with oob_score=True and min_samples_leaf around 5.",
       "Compare with a linear baseline.",
       "Read importance with permutation importance, not only the built-in numbers."
      ]
     },
     {
      "kind": "code",
      "caption": "Forest against logistic regression, and two kinds of importance",
      "code": "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(16)\nn = 1200\nX = rng.normal(size=(n, 6))\ny = ((X[:, 0] + X[:, 1] * X[:, 2] + 0.5 * X[:, 3] + rng.normal(0, 0.8, n)) > 0).astype(int)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\n\nrf = RandomForestClassifier(n_estimators=100, min_samples_leaf=5, oob_score=True, random_state=0, n_jobs=1).fit(Xtr, ytr)\nprint(\"forest test accuracy:\", round(float(rf.score(Xte, yte)), 3), \"| out-of-bag:\", round(float(rf.oob_score_), 3))\nprint(\"logistic regression test accuracy:\", round(float(LogisticRegression().fit(Xtr, ytr).score(Xte, yte)), 3))\nprint(\"built-in importance:\", rf.feature_importances_.round(3).tolist())\nperm = permutation_importance(rf, Xte, yte, n_repeats=5, random_state=0)\nprint(\"permutation importance:\", perm.importances_mean.round(3).tolist())",
      "output": "forest test accuracy: 0.847 | out-of-bag: 0.775\nlogistic regression test accuracy: 0.819\nbuilt-in importance: [0.449, 0.129, 0.13, 0.155, 0.066, 0.071]\npermutation importance: [0.31, 0.033, 0.043, 0.047, -0.008, -0.005]"
     },
     {
      "kind": "p",
      "text": "The forest scores 0.847 on test against 0.819 for logistic regression, with an out-of-bag estimate of 0.775. The features that matter here include an interaction (the product of features 1 and 2), which a linear model cannot see. Permutation importance gives feature 0 a score of 0.31 and the two noise features about zero (−0.008 and −0.005). The built-in importance still gives those noise features 0.066 and 0.071, which shows why it flatters useless columns."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Permutation importance works for any model, so you will use it again with boosting and neural networks."
     }
    ]
   },
   {
    "id": "rfpb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "The main dials are the number of trees, min_samples_leaf and max_features. Use the out-of-bag score to tune quickly, then check what the forest cannot do."
     },
     {
      "kind": "code",
      "caption": "More trees, and a limit on extrapolation",
      "code": "import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(16)\nn = 1200\nX = rng.normal(size=(n, 6))\ny = ((X[:, 0] + X[:, 1] * X[:, 2] + 0.5 * X[:, 3] + rng.normal(0, 0.8, n)) > 0).astype(int)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0)\nprint(\"trees | out-of-bag accuracy | test accuracy\")\nfor k in [1, 5, 20, 60, 200]:\n    rf = RandomForestClassifier(n_estimators=k, oob_score=(k >= 20), min_samples_leaf=5, random_state=0).fit(Xtr, ytr)\n    oob = f\"{rf.oob_score_:.3f}\" if k >= 20 else \"  n/a\"\n    print(f\"{k:5d} | {oob:>19} | {rf.score(Xte, yte):.3f}\")\n\n# an extrapolation limit: forests cannot predict beyond what they have seen\nx = rng.uniform(0, 10, 300); price = 5 * x + rng.normal(0, 2, 300)\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.linear_model import LinearRegression\nf = RandomForestRegressor(50, random_state=0).fit(x.reshape(-1, 1), price)\nl = LinearRegression().fit(x.reshape(-1, 1), price)\nprint(\"x = 15 (outside 0-10): true\", 75, \"| forest\", round(float(f.predict([[15.0]])[0]), 1), \"| line\", round(float(l.predict([[15.0]])[0]), 1))",
      "output": "trees | out-of-bag accuracy | test accuracy\n    1 |                 n/a | 0.719\n    5 |                 n/a | 0.819\n   20 |               0.756 | 0.847\n   60 |               0.771 | 0.847\n  200 |               0.774 | 0.850\nx = 15 (outside 0-10): true 75 | forest 49.3 | line 74.6"
     },
     {
      "kind": "p",
      "text": "Accuracy rises from 0.719 with one tree to 0.847 with 20 and plateaus near 0.85. Then the limit: for a line y = 5x trained on x between 0 and 10, a forest asked about x = 15 says 49.3 when the truth is 75, while a line says 74.6. Forests can only predict values they saw."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Use enough trees to settle, tune leaf size, and never ask a forest to extrapolate."
     }
    ]
   },
   {
    "id": "rfpb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "Random forests against their neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "Strong tabular baseline, little tuning",
        "Random forest",
        "Robust defaults."
       ],
       [
        "Squeeze the last accuracy points",
        "Gradient boosting",
        "Learns from the forest's mistakes."
       ],
       [
        "Need explainable rules",
        "A single shallow tree",
        "A forest of 100 is not readable."
       ],
       [
        "Linear trend, must extrapolate",
        "Linear regression",
        "Forests flatten out of range."
       ],
       [
        "Real-time, tiny memory",
        "Logistic regression",
        "Forests are large."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Run a forest next to your linear baseline. If it wins clearly, there is structure a line cannot see."
     },
     {
      "kind": "check",
      "question": "A forest is asked to predict at x = 15 after training on x from 0 to 10. What should you expect?",
      "options": [
       "A value close to the true line",
       "A value capped near the largest values it has seen",
       "An error message"
      ],
      "answer": 1,
      "why": "Each tree predicts an average of training targets, so predictions stay within the seen range."
     }
    ]
   },
   {
    "id": "rfpb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting built-in importance",
      "text": "Noise features still got 0.066 and 0.071."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Extrapolating",
      "text": "The forest said 49.3 where the truth was 75."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading the out-of-bag score as the test score",
      "text": "They are close but not identical: 0.775 against 0.847 here. Keep a test set."
     },
     {
      "kind": "p",
      "text": "Check you used enough trees, a leaf-size limit, permutation importance, and a held-out test set."
     }
    ]
   }
  ]
 },
 "gradient-boosting": {
  "title": "Gradient boosting: each tree fixes the last one's mistakes",
  "minutes": 15,
  "sections": [
   {
    "id": "gbpb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "Boosting builds trees in sequence. Each new small tree is fitted not to the target but to what the model so far still gets wrong. Many tiny corrections add up to the most accurate general-purpose model on tabular data."
     },
     {
      "kind": "table",
      "caption": "Is gradient boosting a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Tabular data, accuracy matters most?",
        "This is its home turf."
       ],
       [
        "Jumps, thresholds, interactions?",
        "Trees capture them."
       ],
       [
        "Can you afford some tuning?",
        "Learning rate, depth and stages interact."
       ],
       [
        "Are you short of time or data?",
        "A simpler model may match it."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "How does 'fit the residuals' work, and how do I tune learning rate, depth and stopping so it does not overfit?"
     }
    ]
   },
   {
    "id": "gbpb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Start from the average. Compute the residuals. Fit a small tree to them. Add a fraction (the learning rate) of that tree to the model. Repeat. Early stages fix the big mistakes quickly; later stages polish."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Error as stages are added",
       "alt": "Test error of gradient boosting falls from about 28.5 after one stage to 4.65 after 50 stages and stays there at 150, while training error continues to fall from 3.62 to 3.13.",
       "xLabel": "Stages (trees)",
       "yLabel": "RMSE (₹ lakh)",
       "series": [
        {
         "name": "Training",
         "style": "line",
         "pts": [
          [
           1.0,
           28.06
          ],
          [
           10.0,
           12.27
          ],
          [
           50.0,
           3.62
          ],
          [
           150.0,
           3.13
          ]
         ]
        },
        {
         "name": "Test",
         "style": "line",
         "pts": [
          [
           1.0,
           28.49
          ],
          [
           10.0,
           12.8
          ],
          [
           50.0,
           4.65
          ],
          [
           150.0,
           4.65
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "F₀ = average of y",
       "for each stage:  residual = y − F",
       "fit a small tree to the residual",
       "F ← F + learning rate × tree"
      ],
      "note": "A smaller learning rate needs more stages but usually generalises better."
     }
    ]
   },
   {
    "id": "gbpb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Start every prediction at the training average.",
       "Compute the residual for every row.",
       "Fit a depth-2 tree to the residuals.",
       "Add 0.1 times the tree's output to the predictions and repeat."
      ]
     },
     {
      "kind": "code",
      "caption": "Boosting by hand on a price with a jump at 90 sq m",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeRegressor\nfrom sklearn.ensemble import GradientBoostingRegressor\n\nrng = np.random.default_rng(18)\nn = 600\narea = rng.uniform(30, 140, n); age = rng.uniform(0, 30, n)\nprice = 0.6 * area + 25 * (area > 90) - 0.4 * age + 10 + rng.normal(0, 4, n)       # a jump at 90 sq m that a line cannot follow\nX = np.column_stack([area, age])\ntr, te = np.arange(400), np.arange(400, n)\n\n# boosting by hand: start from the average, then repeatedly fit a small tree to what is still wrong\nlr, stages = 0.1, 150\nbase = price[tr].mean()\npred_tr = np.full(len(tr), base); pred_te = np.full(len(te), base)\nfor s in range(1, stages + 1):\n    residual = price[tr] - pred_tr                                   # what the model still gets wrong\n    tree = DecisionTreeRegressor(max_depth=2, random_state=0).fit(X[tr], residual)\n    pred_tr += lr * tree.predict(X[tr])                              # take a small step towards the residual\n    pred_te += lr * tree.predict(X[te])\n    if s in (1, 10, 50, 150):\n        print(f\"stage {s:3d}: train RMSE {np.sqrt(np.mean((price[tr] - pred_tr) ** 2)):5.2f} | test RMSE {np.sqrt(np.mean((price[te] - pred_te) ** 2)):5.2f}\")\nref = GradientBoostingRegressor(n_estimators=150, learning_rate=0.1, max_depth=2, random_state=0).fit(X[tr], price[tr])\nprint(\"scikit-learn, same settings, test RMSE:\", round(float(np.sqrt(np.mean((price[te] - ref.predict(X[te])) ** 2))), 2))\nprint(\"starting point (the average only), test RMSE:\", round(float(np.sqrt(np.mean((price[te] - base) ** 2))), 2))",
      "output": "stage   1: train RMSE 28.06 | test RMSE 28.49\nstage  10: train RMSE 12.27 | test RMSE 12.80\nstage  50: train RMSE  3.62 | test RMSE  4.65\nstage 150: train RMSE  3.13 | test RMSE  4.65\nscikit-learn, same settings, test RMSE: 4.64\nstarting point (the average only), test RMSE: 31.5"
     },
     {
      "kind": "p",
      "text": "The average alone has a test RMSE of 31.50. After 10 stages it is 12.80, after 50 it is 4.65. After 150 the test error is still 4.65, while training error keeps falling from 3.62 to 3.13, the gap that signals overfitting has begun. scikit-learn, with the same settings, gets 4.64."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Each tree models the leftover. That is all gradient boosting is for squared error."
     }
    ]
   },
   {
    "id": "gbpb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split the rows.",
       "Use a small learning rate, a few hundred stages, depth 2 or 3 and subsample 0.8.",
       "Turn on early stopping with validation_fraction and n_iter_no_change.",
       "Compare with linear regression and a random forest on the same test rows."
      ]
     },
     {
      "kind": "code",
      "caption": "Early stopping and a three-model comparison",
      "code": "import numpy as np\nfrom sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_absolute_error\n\nrng = np.random.default_rng(18)\nn = 1000\narea = rng.uniform(30, 140, n); age = rng.uniform(0, 30, n)\nprice = 0.6 * area + 25 * (area > 90) - 0.4 * age + 10 + rng.normal(0, 4, n)\nX = np.column_stack([area, age])\nXtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.3, random_state=0)\n\ngb = GradientBoostingRegressor(n_estimators=500, learning_rate=0.05, max_depth=2, subsample=0.8, validation_fraction=0.2, n_iter_no_change=15, random_state=0).fit(Xtr, ytr)\nprint(\"stages actually used (early stopping):\", gb.n_estimators_, \"of 500\")\nfor name, m in [(\"linear regression\", LinearRegression()), (\"random forest\", RandomForestRegressor(100, min_samples_leaf=3, random_state=0)), (\"gradient boosting\", gb)]:\n    if name != \"gradient boosting\": m.fit(Xtr, ytr)\n    print(f\"{name:18s} test MAE {mean_absolute_error(yte, m.predict(Xte)):.2f} lakh\")",
      "output": "stages actually used (early stopping): 133 of 500\nlinear regression  test MAE 5.87 lakh\nrandom forest      test MAE 3.51 lakh\ngradient boosting  test MAE 3.44 lakh"
     },
     {
      "kind": "p",
      "text": "Early stopping used 133 of 500 stages. On test, linear regression has a mean absolute error of ₹5.87 lakh, a random forest ₹3.51 lakh and gradient boosting ₹3.44 lakh. The jump at 90 sq m is what the line cannot follow."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "XGBoost, LightGBM and CatBoost are faster, better-engineered versions of exactly this loop."
     }
    ]
   },
   {
    "id": "gbpb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "The dials trade off: a large learning rate learns fast and overfits fast; deep trees overfit; more stages need early stopping. Read validation error, not training error."
     },
     {
      "kind": "code",
      "caption": "Learning rate and depth",
      "code": "import numpy as np\nfrom sklearn.ensemble import GradientBoostingRegressor\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(18)\nn = 1000\narea = rng.uniform(30, 140, n); age = rng.uniform(0, 30, n)\nprice = 0.6 * area + 25 * (area > 90) - 0.4 * age + 10 + rng.normal(0, 4, n)\nX = np.column_stack([area, age])\nXtr, Xva, ytr, yva = train_test_split(X, price, test_size=0.3, random_state=0)\nprint(\"learning rate | best stage | best validation MSE | validation MSE at stage 400\")\nfor lr in [0.5, 0.1, 0.02]:\n    m = GradientBoostingRegressor(n_estimators=400, learning_rate=lr, max_depth=2, random_state=0).fit(Xtr, ytr)\n    curve = [float(np.mean((yva - p) ** 2)) for p in m.staged_predict(Xva)]\n    print(f\"{lr:13} | {int(np.argmin(curve)) + 1:10d} | {min(curve):19.2f} | {curve[-1]:.2f}\")\nprint(\"depth | validation MSE at 100 stages\")\nfor d in [1, 2, 4, 8]:\n    m = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=d, random_state=0).fit(Xtr, ytr)\n    print(f\"{d:5d} | {np.mean((yva - m.predict(Xva)) ** 2):.2f}\")",
      "output": "learning rate | best stage | best validation MSE | validation MSE at stage 400\n          0.5 |         27 |               20.25 | 28.25\n          0.1 |         80 |               18.65 | 20.33\n         0.02 |        379 |               18.40 | 18.40\ndepth | validation MSE at 100 stages\n    1 | 19.62\n    2 | 18.69\n    4 | 20.43\n    8 | 25.66"
     },
     {
      "kind": "p",
      "text": "At learning rate 0.5 the best validation MSE is 20.25 at stage 27 and it rises to 28.25 by stage 400. At 0.1 the best is 18.65 at stage 80, and at 0.02 it reaches 18.40 at stage 379 and has not yet turned. For depth, 2 wins with 18.69 at 100 stages, depth 8 is worst at 25.66."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Low learning rate, shallow trees, early stopping. Tune in that order."
     }
    ]
   },
   {
    "id": "gbpb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "Gradient boosting against its neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "Best accuracy on tabular data",
        "Gradient boosting",
        "Usually the strongest."
       ],
       [
        "Strong result, little tuning",
        "Random forest",
        "More forgiving."
       ],
       [
        "Linear trend, small data",
        "Linear regression",
        "Boosting adds nothing."
       ],
       [
        "Must explain each prediction",
        "Logistic or linear regression",
        "Boosting is hard to read."
       ],
       [
        "Images, audio, text",
        "Neural networks",
        "They learn the features."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Boosting is the usual winner in competitions on tables, and the model to try after the baseline and the forest."
     },
     {
      "kind": "check",
      "question": "Training error keeps falling while validation error flattens at stage 50. What should you do?",
      "options": [
       "Add more stages",
       "Stop early or lower the learning rate",
       "Increase tree depth"
      ],
      "answer": 1,
      "why": "Flat validation error with falling training error means the model has started memorising noise."
     }
    ]
   },
   {
    "id": "gbpb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Too high a learning rate",
      "text": "At 0.5 the validation MSE rose from 20.25 to 28.25."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Deep trees",
      "text": "Depth 8 had the worst validation error, 25.66."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Judging by training error",
      "text": "Training RMSE kept falling after test error stopped."
     },
     {
      "kind": "p",
      "text": "Check early stopping was on, validation error was watched, and a linear baseline is on the same table."
     }
    ]
   }
  ]
 },
 "mlp": {
  "title": "Neural networks (MLP): learn the features, then classify",
  "minutes": 15,
  "sections": [
   {
    "id": "mlpb-why",
    "kicker": "1 · Why use it",
    "title": "Why reach for it",
    "blocks": [
     {
      "kind": "p",
      "text": "A logistic regression draws one straight boundary. A neural network first learns new features — bent combinations of the inputs — and then draws a straight boundary in that learned space. That is how it handles curved patterns without you inventing the features."
     },
     {
      "kind": "table",
      "caption": "Is a small neural network a fit?",
      "headers": [
       "Question",
       "Yes means"
      ],
      "rows": [
       [
        "Curved, smooth boundary on numeric inputs?",
        "Hidden layers learn bends."
       ],
       [
        "Enough rows to train it?",
        "Hundreds at least; thousands is better."
       ],
       [
        "Can you scale the inputs?",
        "You must."
       ],
       [
        "Is a tabular win expected?",
        "Often boosting wins on tables. Test it."
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this playbook answers",
      "text": "What happens inside a hidden layer, how is it trained by backpropagation, and how many units are enough?"
     }
    ]
   },
   {
    "id": "mlpb-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Hidden units compute weighted sums, bend them with an activation (tanh), and pass them on. The output layer turns those learned features into a probability. Training is gradient descent on log loss, with the gradient sent backwards through the layers."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Loss and accuracy as a small network learns",
       "alt": "Training loss for a small neural network falls from 0.449 at step 1 to 0.053 at step 1500 while accuracy rises from 0.780 to 0.977.",
       "xLabel": "Training step",
       "yLabel": "Loss",
       "series": [
        {
         "name": "Log loss",
         "style": "line",
         "pts": [
          [
           1.0,
           0.45
          ],
          [
           100.0,
           0.27
          ],
          [
           500.0,
           0.08
          ],
          [
           1500.0,
           0.05
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "hidden = tanh(X W₁ + b₁)",
       "probability = sigmoid(hidden W₂ + b₂)",
       "backward: error at the output × W₂ × (1 − hidden²) gives the hidden gradient"
      ],
      "note": "Without the activation, the layers collapse into one linear model."
     }
    ]
   },
   {
    "id": "mlpb-scratch",
    "kicker": "3 · Build it from scratch",
    "title": "Build it from scratch",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Initialise small random weights for the two layers.",
       "Forward pass: hidden = tanh, then output = sigmoid.",
       "Backward pass: output error, then the error sent back through W₂ and the tanh slope.",
       "Check one gradient against a numerical estimate, then take gradient steps."
      ]
     },
     {
      "kind": "code",
      "caption": "A two-layer network trained with hand-written backpropagation",
      "code": "import numpy as np\nfrom sklearn.datasets import make_moons\n\nX, y = make_moons(n_samples=300, noise=0.2, random_state=0)\ny = y.reshape(-1, 1).astype(float)\nrng = np.random.default_rng(0)\nW1 = rng.normal(0, 0.8, (2, 8)); b1 = np.zeros(8)\nW2 = rng.normal(0, 0.8, (8, 1)); b2 = np.zeros(1)\nsigmoid = lambda s: 1 / (1 + np.exp(-s))\n\ndef forward(X):\n    h = np.tanh(X @ W1 + b1)                    # hidden layer: weighted sums bent by tanh\n    return h, sigmoid(h @ W2 + b2)              # output: a probability\n\ndef loss():\n    p = np.clip(forward(X)[1], 1e-9, 1 - 1e-9)\n    return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))\n\ndef gradients():\n    h, p = forward(X)\n    d_out = (p - y) / len(X)                    # the error signal at the output\n    gW2 = h.T @ d_out; gb2 = d_out.sum(0)\n    d_hid = (d_out @ W2.T) * (1 - h ** 2)       # send it backwards through the weights and the tanh slope\n    return X.T @ d_hid, d_hid.sum(0), gW2, gb2\n\n# gradient check: compare one analytic gradient with a numerical estimate\ngW1, gb1, gW2, gb2 = gradients()\neps = 1e-6\nW1[0, 0] += eps; up = loss(); W1[0, 0] -= 2 * eps; down = loss(); W1[0, 0] += eps\nprint(\"gradient check, analytic vs numeric:\", round(float(gW1[0, 0]), 6), round((up - down) / (2 * eps), 6))\n\nfor step in range(1, 1501):\n    gW1, gb1, gW2, gb2 = gradients()\n    W1 -= 1.0 * gW1; b1 -= 1.0 * gb1; W2 -= 1.0 * gW2; b2 -= 1.0 * gb2\n    if step in (1, 100, 500, 1500):\n        acc = np.mean((forward(X)[1] > 0.5) == y)\n        print(f\"step {step:4d}: loss {loss():.3f} accuracy {acc:.3f}\")",
      "output": "gradient check, analytic vs numeric: 0.063087 0.063087\nstep    1: loss 0.449 accuracy 0.780\nstep  100: loss 0.273 accuracy 0.880\nstep  500: loss 0.077 accuracy 0.973\nstep 1500: loss 0.053 accuracy 0.977"
     },
     {
      "kind": "p",
      "text": "The gradient check agrees to six decimals (0.063087 both ways), the sign that backpropagation is right. Loss falls from 0.449 to 0.053 and accuracy rises from 0.780 to 0.977 on the two-moons data."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Backpropagation is the chain rule applied layer by layer. Always gradient-check new code."
     }
    ]
   },
   {
    "id": "mlpb-sklearn",
    "kicker": "4 · Use scikit-learn",
    "title": "Use scikit-learn",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split with stratify.",
       "Pipeline: StandardScaler then MLPClassifier. Scaling is essential.",
       "Use solver lbfgs for small data; use adam for larger data.",
       "Compare with logistic regression on the same test rows."
      ]
     },
     {
      "kind": "code",
      "caption": "MLPClassifier against logistic regression",
      "code": "import numpy as np\nfrom sklearn.datasets import make_moons\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\n\nX, y = make_moons(n_samples=600, noise=0.2, random_state=0)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nmlp = make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(16,), solver=\"lbfgs\", max_iter=500, random_state=0)).fit(Xtr, ytr)\nlog = make_pipeline(StandardScaler(), LogisticRegression()).fit(Xtr, ytr)\nprint(\"test accuracy: MLP\", round(float(mlp.score(Xte, yte)), 3), \"| logistic regression\", round(float(log.score(Xte, yte)), 3))\nnet = mlp[-1]\nprint(\"layers (weights shapes):\", [w.shape for w in net.coefs_], \"| iterations used:\", net.n_iter_, \"| final training loss:\", round(float(net.loss_), 3))",
      "output": "test accuracy: MLP 0.95 | logistic regression 0.867\nlayers (weights shapes): [(2, 16), (16, 1)] | iterations used: 69 | final training loss: 0.032"
     },
     {
      "kind": "p",
      "text": "A network with one hidden layer of 16 units reaches 0.950 on test; logistic regression reaches 0.867. The weight shapes (2, 16) and (16, 1) show the model: two inputs expanded into sixteen learned features, then collapsed to one probability."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Deep learning is this model with more layers, other activations, and far more data."
     }
    ]
   },
   {
    "id": "mlpb-tune",
    "kicker": "5 · Tune and read the result",
    "title": "Tune and read the result",
    "blocks": [
     {
      "kind": "p",
      "text": "The dials: hidden units, regularisation (alpha), learning rate, and the random seed. Test how sensitive the answer is to each, especially width and the starting weights."
     },
     {
      "kind": "code",
      "caption": "Width, random starts and scaling",
      "code": "import warnings\nimport numpy as np\nfrom sklearn.datasets import make_moons\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.model_selection import train_test_split\n\nwarnings.filterwarnings(\"ignore\")        # larger networks may not fully converge in 400 steps; we compare accuracy instead\nX, y = make_moons(n_samples=600, noise=0.25, random_state=1)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4, random_state=0, stratify=y)\nprint(\"hidden units | train acc | test acc\")\nfor h in [1, 2, 4, 16, 128]:\n    m = make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(h,), solver=\"lbfgs\", max_iter=400, random_state=0)).fit(Xtr, ytr)\n    print(f\"{h:12d} | {m.score(Xtr, ytr):9.3f} | {m.score(Xte, yte):.3f}\")\nscores = [make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(8,), solver=\"lbfgs\", max_iter=400, random_state=s)).fit(Xtr, ytr).score(Xte, yte) for s in range(6)]\nprint(\"same network, six random starts, test accuracy:\", np.round(scores, 3).tolist())\nXbig = Xtr * np.array([1.0, 500.0]); Xbig_te = Xte * np.array([1.0, 500.0])\nprint(\"without scaling, one feature x500:\", round(float(MLPClassifier(hidden_layer_sizes=(8,), solver=\"lbfgs\", max_iter=400, random_state=0).fit(Xbig, ytr).score(Xbig_te, yte)), 3))",
      "output": "hidden units | train acc | test acc\n           1 |     0.850 | 0.867\n           2 |     0.856 | 0.871\n           4 |     0.933 | 0.933\n          16 |     0.956 | 0.938\n         128 |     1.000 | 0.908\nsame network, six random starts, test accuracy: [0.862, 0.942, 0.946, 0.925, 0.946, 0.946]\nwithout scaling, one feature x500: 0.863"
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Hidden units against accuracy",
       "alt": "Training accuracy rises to 1.000 with 128 hidden units, while test accuracy peaks at 0.938 with 16 hidden units and falls to 0.908 with 128.",
       "xLabel": "log2 of hidden units",
       "yLabel": "Accuracy",
       "series": [
        {
         "name": "Training",
         "style": "line",
         "pts": [
          [
           0.0,
           0.85
          ],
          [
           1.0,
           0.86
          ],
          [
           2.0,
           0.93
          ],
          [
           4.0,
           0.96
          ],
          [
           7.0,
           1.0
          ]
         ]
        },
        {
         "name": "Test",
         "style": "line",
         "pts": [
          [
           0.0,
           0.87
          ],
          [
           1.0,
           0.87
          ],
          [
           2.0,
           0.93
          ],
          [
           4.0,
           0.94
          ],
          [
           7.0,
           0.91
          ]
         ]
        }
       ],
       "yDomain": [
        0.8,
        1.02
       ]
      }
     },
     {
      "kind": "p",
      "text": "One hidden unit scores 0.867 and 16 units 0.938, but 128 units reach 1.000 on training and fall to 0.908 on test: too much capacity. The same 8-unit network from six random starts scores between 0.862 and 0.946. Unscaled data with one feature multiplied by 500 gives 0.863."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Report several seeds, not one. Scale the inputs. Grow the network only while validation improves."
     }
    ]
   },
   {
    "id": "mlpb-choose",
    "kicker": "6 · Choose it, or not",
    "title": "Choose it, or not",
    "blocks": [
     {
      "kind": "table",
      "caption": "Neural networks against their neighbours",
      "headers": [
       "Your situation",
       "Better choice",
       "Why"
      ],
      "rows": [
       [
        "Smooth curved boundary, numeric inputs",
        "Small MLP",
        "Learns the features."
       ],
       [
        "Tabular data of mixed types",
        "Gradient boosting",
        "Usually wins with less tuning."
       ],
       [
        "Little data, need explanation",
        "Logistic regression",
        "Fewer parameters."
       ],
       [
        "Images, audio, text",
        "Deep networks (CNNs, Transformers)",
        "Built for raw inputs."
       ],
       [
        "Need training in seconds, reliably",
        "Linear or tree models",
        "Fewer moving parts."
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Reach for a neural network when simpler models fail and you have the data, not by default."
     },
     {
      "kind": "check",
      "question": "The same network gives test accuracy between 0.862 and 0.946 across random starts. What does that mean?",
      "options": [
       "The code has a bug",
       "Results depend on the starting weights, so report several runs",
       "Test accuracy is meaningless"
      ],
      "answer": 1,
      "why": "Gradient descent can end in different solutions; averaging seeds shows the real spread."
     }
    ]
   },
   {
    "id": "mlpb-wrong",
    "kicker": "7 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Not scaling inputs",
      "text": "One feature in larger units dropped accuracy to 0.863."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Too many hidden units",
      "text": "128 units memorised the training data (1.000) and lost on test."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Trusting one run",
      "text": "Six random starts ranged from 0.862 to 0.946."
     },
     {
      "kind": "p",
      "text": "Check the scaler is in the pipeline, several seeds were run, and a simpler baseline is reported."
     }
    ]
   }
  ]
 }
};
