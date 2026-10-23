import type {DeepLesson} from "../../math/teaching/deep-read";
export const SVM_DEEP:DeepLesson[]=[
 {
  "title": "Draw the widest street between two groups",
  "minutes": 13,
  "sections": [
   {
    "id": "sv1-observe",
    "kicker": "1 · Observe",
    "title": "Many lines separate the groups, which one is safest?",
    "blocks": [
     {
      "kind": "p",
      "text": "Picture two kinds of customers plotted by monthly spend and support calls. Many straight lines can split them cleanly. A line that squeaks past one customer is fragile: a slightly different customer lands on the wrong side. The safest line is the one with the widest empty street on both sides."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we define the widest street, and which customers decide where it goes?"
     }
    ]
   },
   {
    "id": "sv1-express",
    "kicker": "2 · Express",
    "title": "The margin in symbols",
    "blocks": [
     {
      "kind": "p",
      "text": "A line is w·x + b = 0. Points on one side give a positive value, on the other a negative one. Scale w and b so that the closest points of each group give exactly +1 and −1. The distance between those two edges is the margin."
     },
     {
      "kind": "eq",
      "lines": [
       "w·x + b = +1 and w·x + b = −1 on the two margin edges",
       "margin width = 2 ⁄ ‖w‖",
       "maximise the width ⇔ minimise ‖w‖"
      ],
      "note": "Only the closest points decide w and b. They are the support vectors."
     }
    ]
   },
   {
    "id": "sv1-visualize",
    "kicker": "3 · Visualize",
    "title": "Eight customers, one street",
    "blocks": [
     {
      "kind": "p",
      "text": "Four customers who stayed at (1,1), (2,1), (1,2), (2,2) and four who churned at (5,4), (6,4), (5,5), (6,5), where the first number is monthly spend in thousand rupees and the second is support calls."
     },
     {
      "kind": "table",
      "caption": "The fitted maximum-margin line",
      "headers": [
       "Quantity",
       "Value"
      ],
      "rows": [
       [
        "w",
        "(0.462, 0.308)"
       ],
       [
        "b",
        "−2.538"
       ],
       [
        "Margin width 2 ⁄ ‖w‖",
        "3.606"
       ],
       [
        "Support vectors",
        "(2, 2) and (5, 4)"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The street's width, 3.606, equals the straight-line distance from (2, 2) to (5, 4): √(3² + 2²) = √13 ≈ 3.606. The two support vectors sit exactly on opposite edges, and the other six customers do not touch the margin at all."
     }
    ]
   },
   {
    "id": "sv1-discover",
    "kicker": "4 · Discover",
    "title": "Only the edge customers matter",
    "blocks": [
     {
      "kind": "p",
      "text": "Move any of the six interior customers a little, or delete them, and the line stays exactly where it is. Move a support vector and the street shifts. The model is built from a handful of boundary points, not from the average of everyone."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A support vector machine picks the line with the widest empty street, and that line is held in place by only the closest few points."
     }
    ]
   },
   {
    "id": "sv1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, checking a customer. Take (6, 5), a churner. w·x + b = 0.462 × 6 + 0.308 × 5 − 2.538 = 1.77, comfortably positive, so predicted churn. Its distance to the line is 1.77 ÷ ‖w‖ = 1.77 ÷ 0.555 ≈ 3.19."
     },
     {
      "kind": "p",
      "text": "Example 2, a support vector. For (2, 2): 0.462 × 2 + 0.308 × 2 − 2.538 = −1.00 exactly. It sits on the margin edge, which is why the code prints −1.00 for it and +1.00 for (5, 4)."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Text classification and other problems with many columns and relatively few rows, where a wide margin protects against overfitting."
     },
     {
      "kind": "check",
      "question": "You delete a churner that sits far from the margin. What happens to the line?",
      "options": [
       "It moves toward the deleted point",
       "It does not change",
       "The margin width halves"
      ],
      "answer": 1,
      "why": "Only support vectors define the line. A point well outside the margin has no influence."
     }
    ]
   },
   {
    "id": "sv1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Assuming the groups are perfectly separable",
      "text": "This picture needs a clean gap. Real customers overlap, which is what the next lesson handles."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading a distance in unscaled columns",
      "text": "Spend in rupees and calls are on different scales. The street is measured in whatever units the columns use."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Thinking more data always moves the line",
      "text": "Adding points far from the boundary changes nothing. Adding one near the boundary can change a lot."
     }
    ]
   },
   {
    "id": "sv1-python",
    "kicker": "7 · In Python",
    "title": "Finding the maximum-margin line",
    "blocks": [
     {
      "kind": "code",
      "caption": "A hard-margin linear SVM on eight customers",
      "code": "import numpy as np\nfrom sklearn.svm import SVC\n\n# two groups of customers: (monthly spend in thousand rupees, support calls)\nX = np.array([[1, 1], [2, 1], [1, 2], [2, 2], [5, 4], [6, 4], [5, 5], [6, 5]], float)\ny = np.array([0, 0, 0, 0, 1, 1, 1, 1])\nm = SVC(kernel=\"linear\", C=1e6).fit(X, y)\nw, b = m.coef_[0], m.intercept_[0]\nprint(\"w =\", np.round(w, 3), \" b =\", round(b, 3))\nprint(\"margin width 2/|w| =\", round(2 / np.linalg.norm(w), 3))\nprint(\"support vectors:\", m.support_vectors_.tolist())\nprint(\"signed distance of every point (should be +-1 on the margin):\")\nprint(np.round(X @ w + b, 2))",
      "output": "w = [0.462 0.308]  b = -2.538\nmargin width 2/|w| = 3.606\nsupport vectors: [[2.0, 2.0], [5.0, 4.0]]\nsigned distance of every point (should be +-1 on the margin):\n[-1.77 -1.31 -1.46 -1.    1.    1.46  1.31  1.77]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Two support vectors fixed the whole boundary, and the margin equals the distance between them."
     }
    ]
   }
  ]
 },
 {
  "title": "Soft margins: how much slack to allow",
  "minutes": 13,
  "sections": [
   {
    "id": "sv2-observe",
    "kicker": "1 · Observe",
    "title": "Real groups overlap",
    "blocks": [
     {
      "kind": "p",
      "text": "Customers who stay and customers who leave rarely separate cleanly. If the model demands a perfect split, one odd customer can drag the line badly. A soft margin allows some customers inside the street or even on the wrong side, at a price."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does the C setting buy, and how much does it matter on messy data?"
     }
    ]
   },
   {
    "id": "sv2-express",
    "kicker": "2 · Express",
    "title": "A price for every violation",
    "blocks": [
     {
      "kind": "p",
      "text": "Each customer that breaks the margin gets a slack ξ ≥ 0, the distance it intrudes. The model minimises a mix of a wide street and small total slack."
     },
     {
      "kind": "eq",
      "lines": [
       "minimise ½‖w‖² + C · Σ ξᵢ"
      ],
      "note": "Large C punishes violations heavily and tolerates a narrow street. Small C tolerates many violations and keeps the street wide."
     }
    ]
   },
   {
    "id": "sv2-visualize",
    "kicker": "3 · Visualize",
    "title": "C against margin and mistakes",
    "blocks": [
     {
      "kind": "p",
      "text": "400 simulated customers with two overlapping groups, 200 for training and 200 to test."
     },
     {
      "kind": "table",
      "caption": "Linear SVM across C",
      "headers": [
       "C",
       "Support vectors",
       "Train accuracy",
       "Test accuracy",
       "Margin width"
      ],
      "rows": [
       [
        "0.001",
        "182",
        "0.895",
        "0.835",
        "7.31"
       ],
       [
        "0.01",
        "95",
        "0.890",
        "0.835",
        "3.48"
       ],
       [
        "0.1",
        "62",
        "0.890",
        "0.845",
        "2.09"
       ],
       [
        "1",
        "53",
        "0.890",
        "0.835",
        "1.68"
       ],
       [
        "10",
        "52",
        "0.895",
        "0.830",
        "1.63"
       ],
       [
        "100",
        "52",
        "0.895",
        "0.830",
        "1.63"
       ],
       [
        "1000",
        "52",
        "0.895",
        "0.830",
        "1.63"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "As C grows, the street narrows from 7.31 to 1.63 and fewer points are support vectors. Past C = 10 nothing changes, because the best line for these overlapping groups has stopped moving. The test accuracy stays within one percentage point whatever C you choose."
     }
    ]
   },
   {
    "id": "sv2-discover",
    "kicker": "4 · Discover",
    "title": "What C is really doing",
    "blocks": [
     {
      "kind": "p",
      "text": "C controls how far the boundary will bend to rescue individual training points. When the groups overlap a lot, there is little to gain from bending, so C hardly matters. On cleaner data or with flexible kernels, it matters much more."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "C is the price of breaking the margin: low C gives a wide, forgiving street, high C a narrow one that insists on training points."
     }
    ]
   },
   {
    "id": "sv2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, reading the table. At C = 0.001 the model keeps 182 of 200 training customers as support vectors, nearly everyone. Its prediction depends on almost all data, so it is smooth and very regularised. At C = 1 only 53 remain."
     },
     {
      "kind": "p",
      "text": "Example 2, a slack calculation. A churner with w·x + b = 0.6, where it should be at least 1, has ξ = 1 − 0.6 = 0.4. At C = 10 that costs 4 units; at C = 0.1 it costs 0.04."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Choosing C by cross-validation on every SVM you fit, on a log scale such as 0.01, 0.1, 1, 10, 100."
     },
     {
      "kind": "check",
      "question": "A customer breaks the margin by slack ξ = 0.4. With C = 5, what penalty does it add?",
      "options": [
       "0.4",
       "2",
       "5"
      ],
      "answer": 1,
      "why": "The penalty is C × ξ = 5 × 0.4 = 2."
     }
    ]
   },
   {
    "id": "sv2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Raising C until training accuracy is perfect",
      "text": "On overlapping data this chases noise. Judge on held-out rows."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Tuning C on the test set",
      "text": "Pick C on validation or cross-validation. Use the test set once."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Expecting C to fix the wrong features",
      "text": "C trades margin against errors. It cannot add information the columns do not have."
     }
    ]
   },
   {
    "id": "sv2-python",
    "kicker": "7 · In Python",
    "title": "C across seven values",
    "blocks": [
     {
      "kind": "code",
      "caption": "A linear SVM across C on overlapping groups",
      "code": "import numpy as np\nfrom sklearn.svm import SVC\nfrom sklearn.datasets import make_blobs\nfrom sklearn.model_selection import train_test_split\n\nX, y = make_blobs(n_samples=400, centers=[(0, 0), (2.2, 2.2)], cluster_std=1.3, random_state=3)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.5, random_state=0, stratify=y)\nprint(\"C       | support vectors | train acc | test acc | margin width\")\nfor C in [0.001, 0.01, 0.1, 1, 10, 100, 1000]:\n    m = SVC(kernel=\"linear\", C=C).fit(Xtr, ytr)\n    width = 2 / np.linalg.norm(m.coef_[0])\n    print(str(C).ljust(7), \"|\", str(len(m.support_)).rjust(8), \"     |\", round(m.score(Xtr, ytr), 3), \"    |\", round(m.score(Xte, yte), 3), \"   |\", round(width, 2))",
      "output": "C       | support vectors | train acc | test acc | margin width\n0.001   |      182      | 0.895     | 0.835    | 7.31\n0.01    |       95      | 0.89     | 0.835    | 3.48\n0.1     |       62      | 0.89     | 0.845    | 2.09\n1       |       53      | 0.89     | 0.835    | 1.68\n10      |       52      | 0.895     | 0.83    | 1.63\n100     |       52      | 0.895     | 0.83    | 1.63\n1000    |       52      | 0.895     | 0.83    | 1.63"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Here C barely moved test accuracy. Always try several values, and expect small effects on noisy data."
     }
    ]
   }
  ]
 },
 {
  "title": "The RBF kernel: similarity that fades with distance",
  "minutes": 14,
  "sections": [
   {
    "id": "sv3-observe",
    "kicker": "1 · Observe",
    "title": "Some groups have no straight-line split",
    "blocks": [
     {
      "kind": "p",
      "text": "Suppose customers who churn form a ring around loyal ones. No straight line separates them. A kernel lets the SVM draw a curved boundary by working with similarity between points instead of raw coordinates."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does the RBF kernel measure, and what does gamma control?"
     }
    ]
   },
   {
    "id": "sv3-express",
    "kicker": "2 · Express",
    "title": "Similarity as a bump",
    "blocks": [
     {
      "kind": "p",
      "text": "The RBF kernel scores two points by how close they are: 1 when identical, fading toward 0 as they move apart. The prediction is a weighted sum of bumps centred on the support vectors."
     },
     {
      "kind": "eq",
      "lines": [
       "K(a, b) = e^(−γ ‖a − b‖²)",
       "prediction = Σ αᵢ yᵢ K(sᵢ, x) + b"
      ],
      "note": "γ (gamma) sets the width of each bump. Large γ means narrow bumps that only affect nearby points."
     }
    ]
   },
   {
    "id": "sv3-visualize",
    "kicker": "3 · Visualize",
    "title": "Ring-shaped groups",
    "blocks": [
     {
      "kind": "p",
      "text": "400 simulated points: an inner disc and an outer ring, with noise. 200 train, 200 test. A linear kernel scores 0.58, barely better than guessing."
     },
     {
      "kind": "table",
      "caption": "RBF kernel across gamma (C = 1)",
      "headers": [
       "gamma",
       "Train accuracy",
       "Test accuracy",
       "Support vectors"
      ],
      "rows": [
       [
        "0.01",
        "0.635",
        "0.600",
        "200"
       ],
       [
        "0.1",
        "0.900",
        "0.860",
        "193"
       ],
       [
        "1",
        "0.990",
        "0.970",
        "54"
       ],
       [
        "10",
        "0.980",
        "0.965",
        "65"
       ],
       [
        "100",
        "0.995",
        "0.930",
        "172"
       ],
       [
        "1000",
        "1.000",
        "0.735",
        "197"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Too small a gamma gives bumps so wide that the model is nearly linear. Too large makes each point its own island: training accuracy hits 1.000 while test accuracy falls to 0.735."
     }
    ]
   },
   {
    "id": "sv3-discover",
    "kicker": "4 · Discover",
    "title": "Locality is the lever",
    "blocks": [
     {
      "kind": "p",
      "text": "The similarity between two points one unit apart is 0.368 at γ = 1 and 0.018 at distance 2. Gamma sets how far a customer's influence reaches. Small gamma lets distant customers vote; large gamma lets only the immediate neighbours vote."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "The RBF kernel scores similarity that fades with distance, and gamma decides how local the model is."
     }
    ]
   },
   {
    "id": "sv3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, similarity by hand. At γ = 1, two points 0.5 apart: e^(−0.25) = 0.779. Two points 2 apart: e^(−4) = 0.018. The second pair almost ignore each other."
     },
     {
      "kind": "p",
      "text": "Example 2, picking gamma. The best test accuracy (0.970) is at γ = 1, with 54 support vectors. At γ = 1000 the model keeps 197 of 200 training points as support vectors: it memorised the training set and generalises poorly."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Image patches, small tabular problems with curved boundaries, and cases where a linear model underfits."
     },
     {
      "kind": "check",
      "question": "Training accuracy is 1.000 but test accuracy is 0.735. What does a very large gamma do?",
      "options": [
       "Makes the boundary smoother",
       "Makes the model memorise training points",
       "Has no effect"
      ],
      "answer": 1,
      "why": "Large gamma makes each point's influence tiny and local, which memorises the training set."
     }
    ]
   },
   {
    "id": "sv3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Using the default gamma without looking",
      "text": "Defaults are reasonable starting points, not tuned values."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Tuning gamma and C separately",
      "text": "They interact. Search both together on a log grid with cross-validation."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading support-vector count as quality",
      "text": "A high count can mean a very flexible boundary, or a noisy dataset."
     }
    ]
   },
   {
    "id": "sv3-python",
    "kicker": "7 · In Python",
    "title": "Linear against RBF",
    "blocks": [
     {
      "kind": "code",
      "caption": "Linear and RBF kernels on ring-shaped groups, and the similarity curve",
      "code": "import numpy as np\nfrom sklearn.svm import SVC\nfrom sklearn.datasets import make_circles\nfrom sklearn.model_selection import train_test_split\n\nX, y = make_circles(n_samples=400, noise=0.15, factor=0.45, random_state=2)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.5, random_state=0, stratify=y)\n\nlin = SVC(kernel=\"linear\").fit(Xtr, ytr)\nprint(\"linear kernel   test acc\", round(lin.score(Xte, yte), 3))\nprint()\nprint(\"gamma | train acc | test acc | support vectors\")\nfor g in [0.01, 0.1, 1, 10, 100, 1000]:\n    m = SVC(kernel=\"rbf\", gamma=g, C=1).fit(Xtr, ytr)\n    print(str(g).ljust(5), \"|\", round(m.score(Xtr, ytr), 3), \"    |\", round(m.score(Xte, yte), 3), \"   |\", len(m.support_))\n\n# the kernel itself: similarity falls with distance\na = np.array([0.0, 0.0])\nfor d in [0.0, 0.5, 1.0, 2.0]:\n    b = np.array([d, 0.0])\n    print(\"distance\", d, \"-> RBF similarity (gamma=1):\", round(float(np.exp(-1 * np.sum((a - b) ** 2))), 3))",
      "output": "linear kernel   test acc 0.58\n\ngamma | train acc | test acc | support vectors\n0.01  | 0.635     | 0.6    | 200\n0.1   | 0.9     | 0.86    | 193\n1     | 0.99     | 0.97    | 54\n10    | 0.98     | 0.965    | 65\n100   | 0.995     | 0.93    | 172\n1000  | 1.0     | 0.735    | 197\ndistance 0.0 -> RBF similarity (gamma=1): 1.0\ndistance 0.5 -> RBF similarity (gamma=1): 0.779\ndistance 1.0 -> RBF similarity (gamma=1): 0.368\ndistance 2.0 -> RBF similarity (gamma=1): 0.018"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A kernel gives you a curved boundary. Gamma decides whether it generalises or memorises."
     }
    ]
   }
  ]
 },
 {
  "title": "Scale first, or distance lies",
  "minutes": 13,
  "sections": [
   {
    "id": "sv4-observe",
    "kicker": "1 · Observe",
    "title": "Units decide who matters",
    "blocks": [
     {
      "kind": "p",
      "text": "The SVM, like KNN, works with distances. If one column is income in rupees (tens of thousands) and another is age in years (tens), a difference in income dwarfs a difference in age. The model ends up listening only to income."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What goes wrong without scaling, and how do you scale without leaking?"
     }
    ]
   },
   {
    "id": "sv4-express",
    "kicker": "2 · Express",
    "title": "Standardise each column",
    "blocks": [
     {
      "kind": "p",
      "text": "Subtract the training mean and divide by the training standard deviation, so every column has mean 0 and spread 1. The numbers then mean the same thing across columns."
     },
     {
      "kind": "eq",
      "lines": [
       "z = (x − mean) ⁄ standard deviation",
       "mean and standard deviation come from training rows only"
      ],
      "note": "Fit the scaler on training data, then apply it to validation and test data using those same numbers."
     }
    ]
   },
   {
    "id": "sv4-visualize",
    "kicker": "3 · Visualize",
    "title": "The same model with and without scaling",
    "blocks": [
     {
      "kind": "p",
      "text": "600 simulated customers, income in rupees per month and age in years, both relevant to the outcome. 360 for training, 240 to test."
     },
     {
      "kind": "table",
      "caption": "RBF SVM with default settings",
      "headers": [
       "Setup",
       "Test accuracy"
      ],
      "rows": [
       [
        "No scaling",
        "0.721"
       ],
       [
        "With scaling",
        "0.838"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Scaling is worth 0.117 of accuracy here, with no other change. Without it the RBF kernel's distances were set almost entirely by income."
     }
    ]
   },
   {
    "id": "sv4-discover",
    "kicker": "4 · Discover",
    "title": "Fit the scaler on training rows only",
    "blocks": [
     {
      "kind": "p",
      "text": "If you compute the mean and spread over every row before splitting, test-set information seeps into training. Here the income mean is 60,226 over all rows and 60,123 over training rows. The gap is small, but with rare events or small samples it grows, and the habit is what matters."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Scale every column, and let a pipeline learn the scaling from training rows only."
     }
    ]
   },
   {
    "id": "sv4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, why it fails. Two customers differ by ₹10,000 in income and 10 years in age. Unscaled, the squared distance is 10,000² + 10² = 100,000,100, and age contributes one part in a million."
     },
     {
      "kind": "p",
      "text": "Example 2, after scaling. With standard deviations of 20,000 and 10, the same pair differs by 0.5 and 1 standard deviations. The squared distance is 0.25 + 1 = 1.25, and age now counts for most of it."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Any distance or margin model: SVM, KNN, k-means, and also regularised regression."
     },
     {
      "kind": "check",
      "question": "Where should the scaler's mean come from?",
      "options": [
       "All rows",
       "Training rows only",
       "Test rows only"
      ],
      "answer": 1,
      "why": "Test information must not influence anything the model learns, and the scaler is part of the model."
     }
    ]
   },
   {
    "id": "sv4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Scaling the whole dataset first",
      "text": "Test rows have shaped the training. Use a pipeline so cross-validation refits the scaler every fold."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Scaling categorical codes",
      "text": "Dummy columns of 0 and 1 may not need scaling, and integer category codes should not be treated as numbers at all."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Forgetting to scale new data",
      "text": "In production, apply the stored training mean and spread to every new row."
     }
    ]
   },
   {
    "id": "sv4-python",
    "kicker": "7 · In Python",
    "title": "Scaling inside a pipeline",
    "blocks": [
     {
      "kind": "code",
      "caption": "The same SVM with and without scaling, and the scaler's mean",
      "code": "import numpy as np\nfrom sklearn.svm import SVC\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import train_test_split\n\nrng = np.random.default_rng(4)\nn = 600\nincome = rng.normal(60000, 20000, n)            # rupees per month\nage = rng.normal(40, 10, n)\ny = ((income - 60000) / 20000 + (age - 40) / 10 + rng.normal(0, 0.8, n) > 0).astype(int)\nX = np.column_stack([income, age])\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4, random_state=0, stratify=y)\n\nraw = SVC(kernel=\"rbf\", gamma=\"scale\", C=1).fit(Xtr, ytr)\npipe = make_pipeline(StandardScaler(), SVC(kernel=\"rbf\", gamma=\"scale\", C=1)).fit(Xtr, ytr)\nprint(\"without scaling  test acc\", round(raw.score(Xte, yte), 3))\nprint(\"with scaling     test acc\", round(pipe.score(Xte, yte), 3))\n\n# the leak: fitting the scaler on all rows before splitting\nsc = StandardScaler().fit(X)\nprint(\"scaler mean fitted on all rows :\", np.round(sc.mean_, 1))\nprint(\"scaler mean fitted on train only:\", np.round(StandardScaler().fit(Xtr).mean_, 1))",
      "output": "without scaling  test acc 0.721\nwith scaling     test acc 0.838\nscaler mean fitted on all rows : [6.02259e+04 3.97000e+01]\nscaler mean fitted on train only: [6.0123e+04 3.9700e+01]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A one-line pipeline protects you from both unscaled units and leaked statistics."
     }
    ]
   }
  ]
 },
 {
  "title": "When an SVM is the wrong tool",
  "minutes": 13,
  "sections": [
   {
    "id": "sv5-observe",
    "kicker": "1 · Observe",
    "title": "A strong model that does not scale to everything",
    "blocks": [
     {
      "kind": "p",
      "text": "SVMs shine on moderate-size problems with clear margins. They have limits that a quick race against simpler models will expose."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "When does an SVM stop being a good choice, and what should you compare it with?"
     }
    ]
   },
   {
    "id": "sv5-express",
    "kicker": "2 · Express",
    "title": "What the model remembers",
    "blocks": [
     {
      "kind": "p",
      "text": "A kernel SVM keeps its support vectors. To score a new customer it compares that customer with every support vector. More data usually means more support vectors, so both training and scoring get heavier."
     },
     {
      "kind": "eq",
      "lines": [
       "scoring cost ∝ number of support vectors × number of columns"
      ],
      "note": "Training a kernel SVM grows faster than linearly with the number of rows."
     }
    ]
   },
   {
    "id": "sv5-visualize",
    "kicker": "3 · Visualize",
    "title": "More rows, more support vectors",
    "blocks": [
     {
      "kind": "p",
      "text": "A simulated churn problem with 10 columns, an interaction and a threshold. Same test set of 2,000 rows."
     },
     {
      "kind": "table",
      "caption": "RBF SVM against logistic regression",
      "headers": [
       "Training rows",
       "Support vectors kept",
       "SVM test accuracy",
       "Logistic test accuracy"
      ],
      "rows": [
       [
        "500",
        "393",
        "0.691",
        "0.681"
       ],
       [
        "2,000",
        "1,359",
        "0.707",
        "0.680"
       ],
       [
        "8,000",
        "5,070",
        "0.722",
        "0.684"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The SVM improves with more data (0.691 to 0.722), and the logistic model does not (it cannot represent the interaction). But the SVM now stores 5,070 support vectors, and compares every new customer with all of them."
     }
    ]
   },
   {
    "id": "sv5-discover",
    "kicker": "4 · Discover",
    "title": "Probabilities, explanations and scale",
    "blocks": [
     {
      "kind": "p",
      "text": "An SVM gives a signed distance to the boundary, not a probability. You can calibrate it, but that costs extra work. It also has no readable coefficients with an RBF kernel. If you need calibrated chances, explanations to a regulator, or millions of rows, other models fit better."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Use an SVM when the data is moderate in size, the boundary is curved and a score is enough. Otherwise race it against logistic regression and a boosted model."
     }
    ]
   },
   {
    "id": "sv5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a call-centre list. 8,000 labelled customers and a score used to pick the top 500 to call. An RBF SVM at 0.722 against 0.684 is a clear gain, and 5,070 support vectors are cheap enough."
     },
     {
      "kind": "p",
      "text": "Example 2, a credit decision. A regulator wants the reasons. A linear model with readable coefficients may be required, even if a kernel SVM scores slightly higher."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Small and medium tabular data, text with sparse features, and problems with well-separated classes."
     },
     {
      "kind": "check",
      "question": "You need a calibrated probability of default for each customer. Which fits best?",
      "options": [
       "A bare SVM score",
       "Logistic regression, or a calibrated model",
       "The number of support vectors"
      ],
      "answer": 1,
      "why": "Logistic regression is built to give probabilities. An SVM score needs separate calibration."
     }
    ]
   },
   {
    "id": "sv5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Using an SVM on millions of rows",
      "text": "Training time grows faster than the data does. Use a linear model or boosting."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading the score as a probability",
      "text": "A distance of 1.2 is not 90 percent. Calibrate before using it as a chance."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Skipping the baseline",
      "text": "Run logistic regression first. If it is within a point, you may not need the kernel."
     }
    ]
   },
   {
    "id": "sv5-python",
    "kicker": "7 · In Python",
    "title": "How the support vectors grow",
    "blocks": [
     {
      "kind": "code",
      "caption": "Support vectors and accuracy as the data grows",
      "code": "import numpy as np\nfrom sklearn.svm import SVC\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nrng = np.random.default_rng(6)\ndef data(n):\n    X = rng.normal(size=(n, 10))\n    logit = 1.2 * X[:, 0] + X[:, 1] * X[:, 2] - 0.8 * (X[:, 3] > 0.5)\n    return X, (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)\n\nXte, yte = data(2000)\nprint(\"rows   | SVM support vectors kept | SVM test acc | logistic test acc\")\nfor n in [500, 2000, 8000]:\n    X, y = data(n)\n    s = make_pipeline(StandardScaler(), SVC(kernel=\"rbf\")).fit(X, y)\n    l = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X, y)\n    print(str(n).ljust(6), \"|\", str(len(s[-1].support_)).rjust(8), \"                 |\", round(s.score(Xte, yte), 3), \"      |\", round(l.score(Xte, yte), 3))",
      "output": "rows   | SVM support vectors kept | SVM test acc | logistic test acc\n500    |      393                  | 0.691       | 0.681\n2000   |     1359                  | 0.707       | 0.68\n8000   |     5070                  | 0.722       | 0.684"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The SVM won on accuracy, and paid in memory. Pick on the whole cost, not on one number."
     }
    ]
   }
  ]
 }
];
