import type {DeepLesson} from "../deep-read";
export const MATRICES_DEEP:DeepLesson[]=[
 {
  "title": "Scoring a thousand flats in one operation",
  "minutes": 13,
  "sections": [
   {
    "id": "mat-observe",
    "kicker": "1 · Observe",
    "title": "Scoring a thousand flats",
    "blocks": [
     {
      "kind": "p",
      "text": "A dot product scores one flat. A portal has a thousand listings. Writing a loop is possible and slow. Stacking the flats into a table, a matrix, lets one operation score them all."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does multiplying a matrix by a vector do, and what shapes make it legal?"
     }
    ]
   },
   {
    "id": "mat-express",
    "kicker": "2 · Express",
    "title": "Rows are flats, columns are features",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "X is n × d:  n flats (rows), d features (columns)",
       "w has length d",
       "X w has length n:   one score per row",
       "(n × d) @ (d × k) = (n × k)"
      ],
      "note": "The inner numbers must match. The outer numbers survive."
     }
    ]
   },
   {
    "id": "mat-visualize",
    "kicker": "3 · Visualize",
    "title": "Four flats at once",
    "blocks": [
     {
      "kind": "table",
      "caption": "Scores from X @ w with w = (2, 0.5, −3)",
      "headers": [
       "Flat",
       "Bedrooms",
       "Size",
       "Km",
       "Score"
      ],
      "rows": [
       [
        "1",
        "3",
        "80",
        "2",
        "40"
       ],
       [
        "2",
        "2",
        "60",
        "5",
        "19"
       ],
       [
        "3",
        "4",
        "120",
        "1",
        "65"
       ],
       [
        "4",
        "1",
        "40",
        "8",
        "−2"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Each score is the dot product of that row with w, and the four row-by-row dot products agree with the single matrix product. Flat 4 scores −2 because it is small and far from the metro."
     }
    ]
   },
   {
    "id": "mat-discover",
    "kicker": "4 · Discover",
    "title": "Many models and a bias column",
    "blocks": [
     {
      "kind": "p",
      "text": "Give each model its own column of weights and stack them into W, a 3 × 2 matrix. Then X @ W is 4 × 2: four flats, two models. A bias can be folded in by adding a column of ones to X: a bias of 10 shifts every score by 10 (50, 29, 75, 8)."
     },
     {
      "kind": "p",
      "text": "Multiplying a 4 × 3 matrix by a vector of length 2 raises an error, because the inner sizes 3 and 2 do not match. Order matters too: (X @ W) transposed equals W-transposed @ X-transposed."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A matrix product is many dot products arranged in a table, and it is legal only when the inner dimensions agree."
     }
    ]
   },
   {
    "id": "mat-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, shape tracking. X is 1000 × 5 and W is 5 × 3. The product is 1000 × 3: a thousand rows, three outputs each."
     },
     {
      "kind": "p",
      "text": "Example 2, a mistake caught. X is 4 × 3 and w has length 2. Three columns cannot pair with two weights. The error is the library telling you a feature has no weight."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "A layer of a neural network is X @ W + b. Batching is why GPUs matter: they do matrix products fast."
     },
     {
      "kind": "check",
      "question": "A is 5 × 3 and B is 3 × 7. What is the shape of A @ B?",
      "options": [
       "5 × 7",
       "3 × 3",
       "7 × 5"
      ],
      "answer": 0,
      "why": "Outer dimensions survive: 5 × 7. The inner 3 and 3 match and disappear."
     }
    ]
   },
   {
    "id": "mat-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Writing shapes in the wrong order",
      "text": "(n × d) @ (d × k) works. (d × k) @ (n × d) generally does not."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Forgetting the bias column",
      "text": "The model is forced through zero."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Loops over rows",
      "text": "A loop over a thousand rows is slow and error-prone. Use the matrix product."
     }
    ]
   },
   {
    "id": "mat-python",
    "kicker": "7 · In Python",
    "title": "A batch of flats in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "X @ w, X @ W, shape errors and a bias column",
      "code": "import numpy as np\n\n# 4 houses (rows) and 3 features (columns): bedrooms, size sq m, km to metro\nX = np.array([[3, 80, 2.0],\n              [2, 60, 5.0],\n              [4, 120, 1.0],\n              [1, 40, 8.0]])\nw = np.array([2.0, 0.5, -3.0])\nprint(\"X shape\", X.shape, \"| w shape\", w.shape, \"-> X @ w shape\", (X @ w).shape)\nprint(\"scores for all houses at once:\", X @ w)\nprint(\"one dot product per row agrees:\", [float(np.dot(row, w)) for row in X])\n\n# several models at once: each column of W is one weight vector\nW = np.array([[2.0, 1.0], [0.5, 0.6], [-3.0, -2.0]])\nprint(\"X (4x3) @ W (3x2) has shape\", (X @ W).shape)\nprint(X @ W)\n\n# the shape rule\ntry:\n    X @ np.array([1.0, 2.0])\nexcept ValueError:\n    print(\"X (4x3) @ vector of length 2 -> error: the inner sizes 3 and 2 must match\")\nprint(\"order matters: W.T @ X.T shape\", (W.T @ X.T).shape, \"= transpose of X @ W:\", np.allclose((X @ W).T, W.T @ X.T))\n\n# adding a bias column of ones folds the intercept into the weights\nXb = np.column_stack([np.ones(4), X])\nwb = np.array([10.0, 2.0, 0.5, -3.0])\nprint(\"with a bias of 10:\", Xb @ wb)",
      "output": "X shape (4, 3) | w shape (3,) -> X @ w shape (4,)\nscores for all houses at once: [40. 19. 65. -2.]\none dot product per row agrees: [40.0, 19.0, 65.0, -2.0]\nX (4x3) @ W (3x2) has shape (4, 2)\n[[40. 47.]\n [19. 28.]\n [65. 74.]\n [-2.  9.]]\nX (4x3) @ vector of length 2 -> error: the inner sizes 3 and 2 must match\norder matters: W.T @ X.T shape (2, 4) = transpose of X @ W: True\nwith a bias of 10: [50. 29. 75.  8.]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Check shapes before running anything. Rows are examples, columns are features."
     }
    ]
   }
  ]
 }
];
