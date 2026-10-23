import type {DeepLesson} from "../../math/teaching/deep-read";
export const PREPARATION_DEEP:DeepLesson[]=[
 {
  "title": "Split observations before learning from them",
  "minutes": 12,
  "sections": [
   {
    "id": "pt1-observe",
    "kicker": "1 · Observe",
    "title": "A test set is a promise",
    "blocks": [
     {
      "kind": "p",
      "text": "You hold back 20% of 1,000 flats and promise not to look at them until the end. If anything you do before the split uses those flats, the promise is broken and your final score is too kind."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we split reproducibly, keep rare classes represented and avoid peeking?"
     }
    ]
   },
   {
    "id": "pt1-express",
    "kicker": "2 · Express",
    "title": "The split",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=0)",
       "stratify=y keeps class shares",
       "statistics (means, medians) come from the training rows only"
      ],
      "note": "A fixed random_state makes the split reproducible."
     }
    ]
   },
   {
    "id": "pt1-visualize",
    "kicker": "3 · Visualize",
    "title": "A thousand flats",
    "blocks": [
     {
      "kind": "table",
      "caption": "1,000 flats, 20% held out",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "train and test sizes",
        "800 and 200"
       ],
       [
        "shapes",
        "(800,1) (800,) (200,1) (200,)"
       ],
       [
        "same random_state again",
        "identical test rows: True"
       ],
       [
        "positive share overall (rare class)",
        "0.051"
       ],
       [
        "plain split, train / test share",
        "0.048 / 0.065"
       ],
       [
        "stratified, train / test share",
        "0.051 / 0.050"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "With a rare class, a plain split can drift: the test share was 6.5% against 5.1% overall. Stratifying keeps both near 5%. The mean area differed slightly too, 75.95 in train and 75.05 in test, which is ordinary sampling noise."
     }
    ]
   },
   {
    "id": "pt1-discover",
    "kicker": "4 · Discover",
    "title": "Peeking",
    "blocks": [
     {
      "kind": "p",
      "text": "Peeking can be quiet: choosing a scaling constant, a fill value or a feature using all rows lets test information into training. The rule is simple: split first, then fit everything on the training rows."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Split first, fix the seed, stratify rare classes, and let only training rows decide anything."
     }
    ]
   },
   {
    "id": "pt1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a rare class. With 5.1% positives, a 200-row test set has about 10 positives. A plain split gave 6.5% (about 13), stratifying gave 5.0% (10)."
     },
     {
      "kind": "p",
      "text": "Example 2, a seed. Without random_state two runs give different test rows, so scores cannot be compared."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every honest evaluation begins with a split that is made before any learning or tuning."
     },
     {
      "kind": "check",
      "question": "What does stratify=y do?",
      "options": [
       "Shuffles harder",
       "Keeps class shares similar in both parts",
       "Removes outliers"
      ],
      "answer": 1,
      "why": "It keeps the class proportions close in train and test."
     }
    ]
   },
   {
    "id": "pt1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Preparing the data before splitting",
      "text": "The test rows influence the training data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · No seed",
      "text": "Results cannot be reproduced."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reusing the test set many times",
      "text": "It becomes a second validation set."
     }
    ]
   },
   {
    "id": "pt1-python",
    "kicker": "7 · In Python",
    "title": "Splitting in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Split, check reproducibility and stratify a rare class",
      "code": "import numpy as np\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(3)\nn = 1000\narea = rng.normal(75, 20, n)\nprice = 0.8 * area + rng.normal(0, 8, n)\nX = area.reshape(-1, 1)\n\nXtr, Xte, ytr, yte = train_test_split(X, price, test_size=0.2, random_state=0)\nprint(\"train/test sizes:\", len(Xtr), len(Xte))\nprint(\"shapes:\", Xtr.shape, ytr.shape, Xte.shape, yte.shape)\n\n# same random_state gives the same split\nXtr2, Xte2, _, _ = train_test_split(X, price, test_size=0.2, random_state=0)\nprint(\"reproducible:\", bool((Xte == Xte2).all()))\n\n# a stratified split keeps class shares\ny_cls = (price > np.median(price)).astype(int)\ny_cls[:900] = 0\nprint(\"positive share overall:\", round(y_cls.mean(), 3))\n_, _, a, b = train_test_split(X, y_cls, test_size=0.2, random_state=0)\nprint(\"plain split train/test share:\", round(a.mean(), 3), round(b.mean(), 3))\n_, _, a, b = train_test_split(X, y_cls, test_size=0.2, random_state=0, stratify=y_cls)\nprint(\"stratified train/test share:\", round(a.mean(), 3), round(b.mean(), 3))\n\n# statistics from the test rows should never be used for fitting\nprint(\"train mean area:\", round(float(Xtr.mean()), 2), \"| test mean area:\", round(float(Xte.mean()), 2))",
      "output": "train/test sizes: 800 200\nshapes: (800, 1) (800,) (200, 1) (200,)\nreproducible: True\npositive share overall: 0.051\nplain split train/test share: 0.048 0.065\nstratified train/test share: 0.051 0.05\ntrain mean area: 75.95 | test mean area: 75.05"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Split first. Everything else comes after."
     }
    ]
   }
  ]
 },
 {
  "title": "Fit missing-data rules on training data",
  "minutes": 12,
  "sections": [
   {
    "id": "pt2-observe",
    "kicker": "1 · Observe",
    "title": "The median depends on who you ask",
    "blocks": [
     {
      "kind": "p",
      "text": "The training rows give a median area of 60. Include the test rows and it becomes 65. That small change shows how test data can leak into training through a fill value."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we fill missing values so that only training rows decide the rule?"
     }
    ]
   },
   {
    "id": "pt2-express",
    "kicker": "2 · Express",
    "title": "fit, then transform",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "imp.fit(Xtr)  learns the median",
       "imp.transform(Xtr), imp.transform(Xte)  apply it",
       "add_indicator=True keeps a flag for missing"
      ],
      "note": "fit sees training only. transform can be applied to any rows."
     }
    ]
   },
   {
    "id": "pt2-visualize",
    "kicker": "3 · Visualize",
    "title": "Filling a tiny table",
    "blocks": [
     {
      "kind": "table",
      "caption": "Areas 40, 55, NaN, 120, 65 for training",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "fitted median (train only)",
        "60"
       ],
       [
        "train filled",
        "40, 55, 60, 120, 65"
       ],
       [
        "test filled (NaN, 300)",
        "60, 300"
       ],
       [
        "leaky median (train + test)",
        "65"
       ],
       [
        "with indicator, test rows",
        "(60, 1) and (300, 0)"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The test value 300 is not changed: the imputer only fills holes. The leaky version used 65, because it had seen the test rows."
     }
    ]
   },
   {
    "id": "pt2-discover",
    "kicker": "4 · Discover",
    "title": "Why the indicator helps",
    "blocks": [
     {
      "kind": "p",
      "text": "A filled 60 looks like a real 60. The indicator column tells the model the value was a guess, which can matter if missingness itself is informative, for example a missing age for newly built flats."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Learn the fill rule on training rows, apply it everywhere, and keep a missing flag."
     }
    ]
   },
   {
    "id": "pt2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a leak. Median 60 versus 65 is a small difference here, but with real data it would be applied to thousands of rows."
     },
     {
      "kind": "p",
      "text": "Example 2, an extreme test value. 300 stays 300. Filling does not clean outliers."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "The same fit/transform split applies to every learned preparation step in scikit-learn."
     },
     {
      "kind": "check",
      "question": "Which rows may be used for fit?",
      "options": [
       "Train only",
       "Train and test",
       "Test only"
      ],
      "answer": 0,
      "why": "Fitting on test rows leaks information."
     }
    ]
   },
   {
    "id": "pt2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Fitting on all rows",
      "text": "The test set shapes the fill value."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Forgetting the indicator",
      "text": "Guesses look like real data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Assuming fill removes outliers",
      "text": "It only fills holes."
     }
    ]
   },
   {
    "id": "pt2-python",
    "kicker": "7 · In Python",
    "title": "Imputing in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Fit a median on train, apply to test, compare with a leaky fit",
      "code": "import numpy as np\nfrom sklearn.impute import SimpleImputer\n\nXtr = np.array([[40.0], [55.0], [np.nan], [120.0], [65.0]])\nXte = np.array([[np.nan], [300.0]])\n\nimp = SimpleImputer(strategy=\"median\")\nimp.fit(Xtr)\nprint(\"fitted median (from train only):\", imp.statistics_)\nprint(\"train filled:\", imp.transform(Xtr).ravel())\nprint(\"test filled:\", imp.transform(Xte).ravel())\n\n# the leaky version learns from test rows too\nleaky = SimpleImputer(strategy=\"median\").fit(np.vstack([Xtr, Xte]))\nprint(\"leaky median:\", leaky.statistics_)\n\n# adding an indicator keeps the information that a value was missing\nimp2 = SimpleImputer(strategy=\"median\", add_indicator=True).fit(Xtr)\nprint(imp2.transform(Xte))",
      "output": "fitted median (from train only): [60.]\ntrain filled: [ 40.  55.  60. 120.  65.]\ntest filled: [ 60. 300.]\nleaky median: [65.]\n[[ 60.   1.]\n [300.   0.]]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "fit on train, transform everywhere."
     }
    ]
   }
  ]
 },
 {
  "title": "Categorical encoding preserves a feature contract",
  "minutes": 12,
  "sections": [
   {
    "id": "pt3-observe",
    "kicker": "1 · Observe",
    "title": "Chennai appears only in the test set",
    "blocks": [
     {
      "kind": "p",
      "text": "Your training table has Pune, Mumbai and Nagpur. A new flat from Chennai arrives. A model trained on three city columns cannot read a fourth. The encoder has to decide in advance what to do."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we turn text categories into numbers while keeping the same columns for any future data?"
     }
    ]
   },
   {
    "id": "pt3-express",
    "kicker": "2 · Express",
    "title": "One-hot encoding",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "one column per category seen in training",
       "a flat in Pune: Pune = 1, others = 0",
       "handle_unknown='ignore' gives all zeros for an unseen category"
      ],
      "note": "The columns are a contract fixed at fit time."
     }
    ]
   },
   {
    "id": "pt3-visualize",
    "kicker": "3 · Visualize",
    "title": "Three cities, one stranger",
    "blocks": [
     {
      "kind": "table",
      "caption": "Training cities: Pune, Mumbai, Pune, Nagpur",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "learned categories",
        "Mumbai, Nagpur, Pune"
       ],
       [
        "encoded Mumbai",
        "1 0 0"
       ],
       [
        "encoded Chennai (unseen)",
        "0 0 0"
       ],
       [
        "feature names",
        "city_Mumbai, city_Nagpur, city_Pune"
       ],
       [
        "get_dummies on the train table",
        "Mumbai, Nagpur, Pune"
       ],
       [
        "get_dummies on the test table",
        "Chennai, Mumbai"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Calling get_dummies separately on train and test produced different columns, so the model would receive the wrong inputs. The fitted encoder keeps the same three columns every time."
     }
    ]
   },
   {
    "id": "pt3-discover",
    "kicker": "4 · Discover",
    "title": "Unseen is a policy",
    "blocks": [
     {
      "kind": "p",
      "text": "Ignoring an unseen category gives all zeros, meaning none of the known cities. A strict encoder raised a ValueError instead. Which is better depends on whether you prefer a visible failure or a graceful fallback; in either case it should be a choice."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Encode with a fitted encoder so training and future data share exactly the same columns."
     }
    ]
   },
   {
    "id": "pt3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, order of columns. Categories are sorted alphabetically, not by appearance. Never assume the order."
     },
     {
      "kind": "p",
      "text": "Example 2, a new city. Chennai maps to 0 0 0, so the model treats it like an unknown city rather than crashing."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Any categorical feature (city, brand, device) needs an encoder fitted on training data."
     },
     {
      "kind": "check",
      "question": "Why not call get_dummies separately on train and test?",
      "options": [
       "It is slower",
       "The columns can differ",
       "It changes the labels"
      ],
      "answer": 1,
      "why": "Different categories give different columns."
     }
    ]
   },
   {
    "id": "pt3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Separate encoding of train and test",
      "text": "Columns do not match."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Using numbers 1, 2, 3 for cities",
      "text": "It invents an order that does not exist."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Ignoring unseen categories silently",
      "text": "Decide the policy deliberately."
     }
    ]
   },
   {
    "id": "pt3-python",
    "kicker": "7 · In Python",
    "title": "Encoding in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Fit a one-hot encoder, meet an unseen city and compare get_dummies",
      "code": "import pandas as pd\nfrom sklearn.preprocessing import OneHotEncoder\n\ntrain = pd.DataFrame({\"city\": [\"Pune\", \"Mumbai\", \"Pune\", \"Nagpur\"]})\ntest = pd.DataFrame({\"city\": [\"Mumbai\", \"Chennai\"]})\n\nenc = OneHotEncoder(handle_unknown=\"ignore\", sparse_output=False).fit(train[[\"city\"]])\nprint(\"learned categories:\", list(enc.categories_[0]))\nprint(\"train encoded:\")\nprint(enc.transform(train[[\"city\"]]))\nprint(\"test encoded (Chennai was never seen):\")\nprint(enc.transform(test[[\"city\"]]))\nprint(\"feature names:\", list(enc.get_feature_names_out()))\n\n# get_dummies on each table separately breaks the column contract\na = pd.get_dummies(train[\"city\"]).columns.tolist()\nb = pd.get_dummies(test[\"city\"]).columns.tolist()\nprint(\"get_dummies train columns:\", a)\nprint(\"get_dummies test columns :\", b)\n\n# a strict encoder refuses unseen categories\ntry:\n    OneHotEncoder(handle_unknown=\"error\").fit(train[[\"city\"]]).transform(test[[\"city\"]])\nexcept ValueError as e:\n    print(\"strict encoder raised ValueError\")",
      "output": "learned categories: ['Mumbai', 'Nagpur', 'Pune']\ntrain encoded:\n[[0. 0. 1.]\n [1. 0. 0.]\n [0. 0. 1.]\n [0. 1. 0.]]\ntest encoded (Chennai was never seen):\n[[1. 0. 0.]\n [0. 0. 0.]]\nfeature names: ['city_Mumbai', 'city_Nagpur', 'city_Pune']\nget_dummies train columns: ['Mumbai', 'Nagpur', 'Pune']\nget_dummies test columns : ['Chennai', 'Mumbai']\nstrict encoder raised ValueError"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Fit the encoder once, and reuse it."
     }
    ]
   }
  ]
 },
 {
  "title": "Scaling is a fitted coordinate change",
  "minutes": 13,
  "sections": [
   {
    "id": "pt4-observe",
    "kicker": "1 · Observe",
    "title": "Square metres against kilometres",
    "blocks": [
     {
      "kind": "p",
      "text": "Two flats differ by 80 sq m in area and 6 km in distance. In raw numbers the area gap is 80 and the distance gap 6, so any method based on distance listens mostly to area, simply because of the units."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we put features on a common scale without leaking test information?"
     }
    ]
   },
   {
    "id": "pt4-express",
    "kicker": "2 · Express",
    "title": "Standardisation",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "z = (x − mean) / std",
       "mean and std come from the training rows",
       "inverse_transform undoes it"
      ],
      "note": "After scaling, training columns have mean 0 and std 1."
     }
    ]
   },
   {
    "id": "pt4-visualize",
    "kicker": "3 · Visualize",
    "title": "Four flats",
    "blocks": [
     {
      "kind": "table",
      "caption": "Training: area and distance",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "train mean",
        "(73.75, 4.0)"
       ],
       [
        "train std",
        "(30.285, 2.739)"
       ],
       [
        "scaled train mean / std",
        "0 / 1"
       ],
       [
        "test row (65, 3) scaled",
        "(−0.289, −0.365)"
       ],
       [
        "raw distance between two flats",
        "80.22"
       ],
       [
        "scaled distance",
        "3.43"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A test row is scaled with the training mean and std, not its own. The manual formula and StandardScaler matched, and inverse_transform returned (65, 3)."
     }
    ]
   },
   {
    "id": "pt4-discover",
    "kicker": "4 · Discover",
    "title": "Where it matters",
    "blocks": [
     {
      "kind": "p",
      "text": "Distance-based methods (kNN, SVM, k-means) and gradient-based methods need scaling. Trees do not care, since they only compare a feature with a threshold."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Scaling changes the units of the axes, learned on training data and applied to everything."
     }
    ]
   },
   {
    "id": "pt4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, distance. The raw distance 80.22 came almost entirely from area. After scaling, area and distance each contributed according to their spread."
     },
     {
      "kind": "p",
      "text": "Example 2, a single row. A test row was scaled with the training statistics, so the same flat gets the same coordinates whenever it appears."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "kNN, SVM, PCA, regularised models and neural networks all need comparable scales."
     },
     {
      "kind": "check",
      "question": "Which statistics scale the test rows?",
      "options": [
       "Test rows' own",
       "Training rows'",
       "Both combined"
      ],
      "answer": 1,
      "why": "The test rows are transformed with training statistics."
     }
    ]
   },
   {
    "id": "pt4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Scaling before splitting",
      "text": "Test statistics leak."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Scaling each split separately",
      "text": "The same flat gets different coordinates."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Scaling trees",
      "text": "Harmless but unnecessary."
     }
    ]
   },
   {
    "id": "pt4-python",
    "kicker": "7 · In Python",
    "title": "Scaling in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Fit a StandardScaler, transform a test row and compare distances",
      "code": "import numpy as np\nfrom sklearn.preprocessing import StandardScaler\n\nXtr = np.array([[40.0, 2.0], [55.0, 5.0], [80.0, 1.0], [120.0, 8.0]])\nXte = np.array([[65.0, 3.0]])\n\nsc = StandardScaler().fit(Xtr)\nprint(\"train mean:\", sc.mean_, \"| train std:\", sc.scale_.round(3))\nZ = sc.transform(Xtr)\nprint(\"train columns now mean:\", (Z.mean(axis=0).round(6) + 0.0), \"std:\", Z.std(axis=0).round(6))\nprint(\"test row scaled with TRAIN statistics:\", sc.transform(Xte).round(3))\n\n# manual check\nmanual = (Xte - Xtr.mean(axis=0)) / Xtr.std(axis=0)\nprint(\"manual equals sklearn:\", bool(np.allclose(manual, sc.transform(Xte))))\n\n# scale before distance: a km column and a sq m column\na, b = np.array([40.0, 2.0]), np.array([120.0, 8.0])\nprint(\"raw distance:\", round(float(np.linalg.norm(a - b)), 2))\nza, zb = sc.transform([a])[0], sc.transform([b])[0]\nprint(\"scaled distance:\", round(float(np.linalg.norm(za - zb)), 2))\n\n# inverse transform returns to the original units\nprint(\"round trip:\", sc.inverse_transform(sc.transform(Xte)).round(1))",
      "output": "train mean: [73.75  4.  ] | train std: [30.285  2.739]\ntrain columns now mean: [0. 0.] std: [1. 1.]\ntest row scaled with TRAIN statistics: [[-0.289 -0.365]]\nmanual equals sklearn: True\nraw distance: 80.22\nscaled distance: 3.43\nround trip: [[65.  3.]]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Fit the scaler on training rows only."
     }
    ]
   }
  ]
 },
 {
  "title": "Compose preprocessing without leaking across folds",
  "minutes": 13,
  "sections": [
   {
    "id": "pt5-observe",
    "kicker": "1 · Observe",
    "title": "Five folds, five fits",
    "blocks": [
     {
      "kind": "p",
      "text": "Cross-validation splits training data into 5 folds. Each fold must be prepared using only the other four. Preparing the whole table first uses the held-out fold's statistics. A Pipeline makes the right thing automatic."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we chain preparation and a model so every fold fits everything from scratch?"
     }
    ]
   },
   {
    "id": "pt5-express",
    "kicker": "2 · Express",
    "title": "Pipeline",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "make_pipeline(SimpleImputer(), StandardScaler(), LinearRegression())",
       "cross_val_score refits all steps inside each fold",
       "the pipeline is one estimator you can save and reuse"
      ],
      "note": "One object prepares and predicts in the right order."
     }
    ]
   },
   {
    "id": "pt5-visualize",
    "kicker": "3 · Visualize",
    "title": "Two ways to cross-validate",
    "blocks": [
     {
      "kind": "table",
      "caption": "200 simulated flats, 3 features, 20 missing values",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "step names",
        "simpleimputer, standardscaler, linearregression"
       ],
       [
        "fold RMSE",
        "5.48, 4.28, 4.97, 3.52, 5.99"
       ],
       [
        "pipeline mean RMSE",
        "4.85"
       ],
       [
        "prepare-first mean RMSE",
        "4.85"
       ],
       [
        "difference",
        "0.001"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Honestly: here the two scores nearly agree. Scaling and a median with a linear model is a mild form of leakage. The pipeline is still right, because the same mistake with target-aware steps, feature selection or tuned parameters inflates scores a lot."
     }
    ]
   },
   {
    "id": "pt5-discover",
    "kicker": "4 · Discover",
    "title": "Make the safe path the easy path",
    "blocks": [
     {
      "kind": "p",
      "text": "A pipeline also guarantees that the same steps run at prediction time. Without one, it is easy to forget to scale a new flat in production."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Put every learned step inside a pipeline, so each fold and each future prediction follows the same recipe."
     }
    ]
   },
   {
    "id": "pt5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a mild leak. The measured difference was 0.001 RMSE (₹ lakh units of the simulated price). Small, but only because these steps are gentle."
     },
     {
      "kind": "p",
      "text": "Example 2, deployment. A saved pipeline takes raw flats with holes and returns predictions. A hand-made chain of steps does not."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Feature selection, target encoding and hyperparameter tuning inside CV all need a pipeline."
     },
     {
      "kind": "check",
      "question": "What does cross_val_score do to a pipeline?",
      "options": [
       "Fits once",
       "Refits all steps per fold",
       "Only fits the model"
      ],
      "answer": 1,
      "why": "Every step is fitted again inside each training fold."
     }
    ]
   },
   {
    "id": "pt5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Prepare-then-CV",
      "text": "Held-out folds shape the preparation."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Assuming a small leak is harmless",
      "text": "Stronger steps leak a lot."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Different code in training and production",
      "text": "Predictions then differ."
     }
    ]
   },
   {
    "id": "pt5-python",
    "kicker": "7 · In Python",
    "title": "Pipelines in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Cross-validate a pipeline and compare with prepare-first",
      "code": "import numpy as np\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import cross_val_score\n\nrng = np.random.default_rng(5)\nn = 200\nX = rng.normal(0, 1, (n, 3)) * np.array([20, 5, 1]) + np.array([75, 10, 0])\ny = 0.8 * X[:, 0] - 1.5 * X[:, 1] + rng.normal(0, 4, n)\nX[rng.choice(n, 20, replace=False), 1] = np.nan\n\npipe = make_pipeline(SimpleImputer(strategy=\"median\"), StandardScaler(), LinearRegression())\nscores = cross_val_score(pipe, X, y, cv=5, scoring=\"neg_root_mean_squared_error\")\nprint(\"fold RMSE:\", (-scores).round(2))\nprint(\"mean RMSE:\", round(float((-scores).mean()), 2))\nprint(\"steps:\", [name for name, _ in pipe.steps])\n\n# the leaky way: prepare the whole table first, then cross-validate\nXall = StandardScaler().fit_transform(SimpleImputer(strategy=\"median\").fit_transform(X))\nleaky = cross_val_score(LinearRegression(), Xall, y, cv=5, scoring=\"neg_root_mean_squared_error\")\nprint(\"leaky mean RMSE:\", round(float((-leaky).mean()), 2))\nprint(\"difference:\", round(float((-leaky).mean() - (-scores).mean()), 3))",
      "output": "fold RMSE: [5.48 4.28 4.97 3.52 5.99]\nmean RMSE: 4.85\nsteps: ['simpleimputer', 'standardscaler', 'linearregression']\nleaky mean RMSE: 4.85\ndifference: 0.001"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "If a step learns from data, it belongs in the pipeline."
     }
    ]
   }
  ]
 },
 {
  "title": "Outlier policies and a preparation report",
  "minutes": 13,
  "sections": [
   {
    "id": "pt6-observe",
    "kicker": "1 · Observe",
    "title": "Three flats at 400, 450 and 500 sq m",
    "blocks": [
     {
      "kind": "p",
      "text": "In a simulated table of 500 flats, three entries read 400, 450 and 500 sq m. Maybe they are typing errors, maybe mansions. The data cannot tell you; a policy and a record of it can."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we flag extreme values, choose between removing and clipping, and record what we did?"
     }
    ]
   },
   {
    "id": "pt6-express",
    "kicker": "2 · Express",
    "title": "The IQR rule",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "IQR = Q3 − Q1",
       "fences: Q1 − 1.5 IQR  and  Q3 + 1.5 IQR",
       "flag values outside the fences"
      ],
      "note": "Learn the fences from training rows. A flag is not a verdict."
     }
    ]
   },
   {
    "id": "pt6-visualize",
    "kicker": "3 · Visualize",
    "title": "What it found",
    "blocks": [
     {
      "kind": "table",
      "caption": "500 simulated areas, seed 11",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "Q1, Q3, IQR",
        "66.4, 84.4, 18.0"
       ],
       [
        "fences",
        "39.4 to 111.3"
       ],
       [
        "flagged rows",
        "11, including the three planted"
       ],
       [
        "mean with / without flagged",
        "77.64 / 75.36"
       ],
       [
        "median",
        "76.37"
       ],
       [
        "max after clipping",
        "111.3"
       ],
       [
        "rows kept: remove / clip",
        "489 / 500"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The mean moved by more than 2 sq m because of just three values, whereas the median stayed near 76. Eleven rows were flagged, so the rule also catches normal extremes, which is why a flag is not proof of error."
     }
    ]
   },
   {
    "id": "pt6-discover",
    "kicker": "4 · Discover",
    "title": "Write the report",
    "blocks": [
     {
      "kind": "p",
      "text": "A small report (rule, fences, number flagged) turns a quiet decision into a visible one: {'rule': '1.5*IQR', 'fences': [39.4, 111.3], 'n_flagged': 11}. Save it with the model so a reader can see how the data was prepared."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Choose remove, clip, or keep on purpose, learn thresholds from training data and record the decision."
     }
    ]
   },
   {
    "id": "pt6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, remove or clip. Removal keeps 489 rows, clipping keeps all 500 but caps the extremes at 111.3."
     },
     {
      "kind": "p",
      "text": "Example 2, a real mansion. A 500 sq m flat may be genuine. If it is, clipping it hides real behaviour, so ask the data owner."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Outlier handling affects linear models, scaling and distance methods, and should be part of the pipeline."
     },
     {
      "kind": "check",
      "question": "The mean moves a lot because of 3 values. The median...",
      "options": [
       "Moves just as much",
       "Barely moves",
       "Becomes NaN"
      ],
      "answer": 1,
      "why": "The median is robust to a few extreme values."
     }
    ]
   },
   {
    "id": "pt6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Deleting without looking",
      "text": "Real rare cases may be lost."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Fences from all rows",
      "text": "Test rows influence the rule."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · No record",
      "text": "Nobody can reproduce the cleaning."
     }
    ]
   },
   {
    "id": "pt6-python",
    "kicker": "7 · In Python",
    "title": "Outliers in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Flag with the IQR, compare mean and median, clip and record",
      "code": "import numpy as np\n\nrng = np.random.default_rng(11)\nx = rng.normal(75, 15, 500)\nx[:3] = [400, 450, 500]\n\nq1, q3 = np.percentile(x, [25, 75])\niqr = q3 - q1\nlo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr\nprint(\"Q1, Q3, IQR:\", round(q1, 1), round(q3, 1), round(iqr, 1))\nprint(\"fences:\", round(lo, 1), round(hi, 1))\nflag = (x < lo) | (x > hi)\nprint(\"flagged:\", int(flag.sum()), \"| the three planted values flagged:\", bool(flag[:3].all()))\n\nprint(\"mean with outliers:\", round(float(x.mean()), 2), \"| median:\", round(float(np.median(x)), 2))\nprint(\"mean without them:\", round(float(x[~flag].mean()), 2))\n\n# clipping (winsorising) with train fences keeps the row but limits the value\nclipped = np.clip(x, lo, hi)\nprint(\"max after clipping:\", round(float(clipped.max()), 1))\nprint(\"rows kept if removed:\", int((~flag).sum()), \"| rows kept if clipped:\", len(clipped))\n\n# a report so the choice is recorded\nreport = {\"rule\": \"1.5*IQR\", \"fences\": [round(float(lo), 1), round(float(hi), 1)], \"n_flagged\": int(flag.sum())}\nprint(report)",
      "output": "Q1, Q3, IQR: 66.4 84.4 18.0\nfences: 39.4 111.3\nflagged: 11 | the three planted values flagged: True\nmean with outliers: 77.64 | median: 76.37\nmean without them: 75.36\nmax after clipping: 111.3\nrows kept if removed: 489 | rows kept if clipped: 500\n{'rule': '1.5*IQR', 'fences': [39.4, 111.3], 'n_flagged': 11}"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Every cleaning choice should leave a record."
     }
    ]
   }
  ]
 }
];
