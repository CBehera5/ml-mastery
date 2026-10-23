import type {DeepLesson} from "../../math/teaching/deep-read";
export const NUMPY_DEEP:DeepLesson[]=[
 {
  "title": "Arrays: a table of numbers that knows its shape",
  "minutes": 12,
  "sections": [
   {
    "id": "pn1-observe",
    "kicker": "1 · Observe",
    "title": "A list repeats, an array calculates",
    "blocks": [
     {
      "kind": "p",
      "text": "Multiply the list [2, 3] by 2 and Python gives [2, 3, 2, 3]: it repeats. Multiply the NumPy array by 2 and you get [4, 6]: it calculates. NumPy is the library that lets Python treat a whole table of numbers as one object, which is what every ML model needs."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What is an array, what does shape describe, and what can go wrong when you regroup cells?"
     }
    ]
   },
   {
    "id": "pn1-express",
    "kicker": "2 · Express",
    "title": "Shape, ndim, size and dtype",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "shape = lengths along each axis, e.g. (3, 3)",
       "ndim = number of axes,   size = total cells = product of shape",
       "dtype = the type of every cell"
      ],
      "note": "A vector has shape (m,), a table (m, n). m counts examples, n counts features."
     }
    ]
   },
   {
    "id": "pn1-visualize",
    "kicker": "3 · Visualize",
    "title": "Three flats, three features",
    "blocks": [
     {
      "kind": "table",
      "caption": "X = [[3, 80, 2.0], [2, 60, 5.0], [4, 120, 1.0]]",
      "headers": [
       "Property",
       "Value"
      ],
      "rows": [
       [
        "shape",
        "(3, 3)"
       ],
       [
        "ndim",
        "2"
       ],
       [
        "size",
        "9"
       ],
       [
        "dtype",
        "float64"
       ],
       [
        "X[0] (one flat)",
        "[3, 80, 2.0], shape (3,)"
       ],
       [
        "np.array(7).shape",
        "()  (a scalar has no axes)"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The rows are flats and the columns are bedrooms, size and distance. Reading a single row gives a vector of three values, with one axis."
     }
    ]
   },
   {
    "id": "pn1-discover",
    "kicker": "4 · Discover",
    "title": "Reshape keeps cells, loses identity",
    "blocks": [
     {
      "kind": "p",
      "text": "Flattening X gives 9 numbers in a row, and reshaping to (1, 9) keeps all cells but puts three flats in a single row. The cell count is right, but the rows no longer mean flats. And a dtype changes arithmetic: an int array divided by 2 becomes float [0.5, 1, 1.5], while // 2 gives [0, 1, 1]."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "An array is a rectangular block of one dtype described by its shape, and regrouping cells changes what each row means."
     }
    ]
   },
   {
    "id": "pn1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, shape arithmetic. 1,000 flats with 5 features each is shape (1000, 5), size 5,000. A single flat is (5,)."
     },
     {
      "kind": "p",
      "text": "Example 2, dtype surprise. np.array([1, 'a']) turns every cell into text, because one dtype must fit all."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every dataset enters a model as an array of shape (examples, features), and labels as (examples,)."
     },
     {
      "kind": "check",
      "question": "An array has shape (4, 3). What is its size?",
      "options": [
       "7",
       "12",
       "3"
      ],
      "answer": 1,
      "why": "Size is the product of the shape: 4 × 3 = 12."
     }
    ]
   },
   {
    "id": "pn1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reshaping without checking what rows mean",
      "text": "The right size is not the right grouping."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Mixed types",
      "text": "One text value turns a numeric array into strings."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Mixing up (m,) with (m, 1)",
      "text": "They broadcast differently."
     }
    ]
   },
   {
    "id": "pn1-python",
    "kicker": "7 · In Python",
    "title": "Arrays in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Shape, ndim, size, dtype, reshape and dtype effects",
      "code": "import numpy as np\n\nprint(\"list * 2:\", [2, 3] * 2, \"| array * 2:\", np.array([2, 3]) * 2)\n\nX = np.array([[3, 80, 2.0], [2, 60, 5.0], [4, 120, 1.0]])         # 3 flats x 3 features\nprint(\"shape\", X.shape, \"| ndim\", X.ndim, \"| size\", X.size, \"| dtype\", X.dtype)\nprint(\"a vector of one flat:\", X[0], \"shape\", X[0].shape, \"| a scalar:\", np.array(7).shape)\n\n# reshape keeps the cells but regroups them: row identity can be lost\nflat = X.reshape(-1)\nprint(\"flattened:\", flat)\nprint(\"reshaped to (1, 9) still has\", flat.size, \"cells but one row now holds three flats\")\n\n# dtype decides what arithmetic means\nints = np.array([1, 2, 3])\nprint(\"int array / 2 ->\", ints / 2, \"| integer division ->\", ints // 2, \"| dtype\", (ints / 2).dtype)\nprint(\"mixed list becomes float:\", np.array([1, 2.5, 3]).dtype, \"| text forces a string dtype of kind\", np.array([1, \"a\"]).dtype.kind)",
      "output": "list * 2: [2, 3, 2, 3] | array * 2: [4 6]\nshape (3, 3) | ndim 2 | size 9 | dtype float64\na vector of one flat: [ 3. 80.  2.] shape (3,) | a scalar: ()\nflattened: [  3.  80.   2.   2.  60.   5.   4. 120.   1.]\nreshaped to (1, 9) still has 9 cells but one row now holds three flats\nint array / 2 -> [0.5 1.  1.5] | integer division -> [0 1 1] | dtype float64\nmixed list becomes float: float64 | text forces a string dtype of kind U"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Always print shape and dtype first."
     }
    ]
   }
  ]
 },
 {
  "title": "Indexing, masks, views and copies",
  "minutes": 13,
  "sections": [
   {
    "id": "pn2-observe",
    "kicker": "1 · Observe",
    "title": "Pick the big flats, keep the prices aligned",
    "blocks": [
     {
      "kind": "p",
      "text": "From six flats you want the ones of at least 60 sq m, along with their prices. Selecting must keep area and price pairs together, or the flats get mixed up. NumPy offers indexes, slices and boolean masks. They also differ in whether the result shares memory with the original."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we select rows safely, and when does editing a selection change the original?"
     }
    ]
   },
   {
    "id": "pn2-express",
    "kicker": "2 · Express",
    "title": "Selection tools",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "area[2], area[-1], area[1:4]",
       "mask = area >= 60;   area[mask]",
       "np.where(condition, a, b)",
       "combine masks with & and |, with brackets"
      ],
      "note": "A slice is a view of the same memory. A mask or a list of indexes makes a copy."
     }
    ]
   },
   {
    "id": "pn2-visualize",
    "kicker": "3 · Visualize",
    "title": "Aligned selection",
    "blocks": [
     {
      "kind": "table",
      "caption": "area = [40, 55, 80, 120, 65, 95], price = [30, 41, 55, 90, 47, 70]",
      "headers": [
       "Expression",
       "Result"
      ],
      "rows": [
       [
        "mask = area >= 60",
        "F F T T T T, count 4"
       ],
       [
        "price[mask]",
        "[55, 90, 47, 70]"
       ],
       [
        "pairs (area, price)",
        "(80,55) (120,90) (65,47) (95,70)"
       ],
       [
        "np.where(area >= 80, 'large', 'small')",
        "small small large large small large"
       ],
       [
        "area[(area >= 60) & (area < 100)]",
        "[80, 65, 95]"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Using one mask on both arrays keeps each pair together."
     }
    ]
   },
   {
    "id": "pn2-discover",
    "kicker": "4 · Discover",
    "title": "Views against copies",
    "blocks": [
     {
      "kind": "p",
      "text": "view = area[1:4]; view[0] = 999 changed the original array to [40, 999, 80, ...]: a slice is a view. A selection by a list of indexes, area[[0, 2, 4]], is a copy, so editing it left the original alone. Use .copy() when you want independence."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Masks pick rows by condition, slices share memory with the original, and one mask must be applied to every aligned array."
     }
    ]
   },
   {
    "id": "pn2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, cleaning. A mask for prices above 0 removes impossible rows from features and labels together: X[mask], y[mask]."
     },
     {
      "kind": "p",
      "text": "Example 2, a hidden edit. Normalising a slice in place also changes the training array it came from, a bug that appears only later."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Train/test splits, filtering outliers and picking batches are all index selections."
     },
     {
      "kind": "check",
      "question": "v = a[1:3]; v[0] = 99. What happens to a?",
      "options": [
       "Nothing",
       "a[1] becomes 99",
       "An error"
      ],
      "answer": 1,
      "why": "A slice is a view, so writing through it changes the original."
     }
    ]
   },
   {
    "id": "pn2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Masking only one array",
      "text": "Features and labels fall out of alignment."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Using 'and' instead of &",
      "text": "Python's and fails on arrays. Use & with brackets."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Editing a view by mistake",
      "text": "Call .copy() before modifying."
     }
    ]
   },
   {
    "id": "pn2-python",
    "kicker": "7 · In Python",
    "title": "Selection in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Slices, masks, aligned selection, views and copies",
      "code": "import numpy as np\n\narea = np.array([40, 55, 80, 120, 65, 95])\nprice = np.array([30, 41, 55, 90, 47, 70])\n\nprint(\"area[2] =\", area[2], \"| area[-1] =\", area[-1], \"| area[1:4] =\", area[1:4])\nmask = area >= 60\nprint(\"mask:\", mask, \"| count:\", mask.sum())\nprint(\"prices of flats of at least 60 sq m:\", price[mask])\nprint(\"same rows picked from both columns keep alignment:\", [(int(a), int(p)) for a, p in zip(area[mask], price[mask])])\n\n# slices are views of the same memory; masks and fancy indexes make copies\nview = area[1:4]\nview[0] = 999\nprint(\"editing a slice changed the original:\", area)\narea[1] = 55\npicked = area[[0, 2, 4]]\npicked[0] = -1\nprint(\"editing a fancy-indexed copy leaves the original:\", area)\n\n# np.where selects between two choices\nsize_label = np.where(area >= 80, \"large\", \"small\")\nprint(size_label)\n# boolean combinations need & and |, with brackets\nprint(\"60 <= area < 100:\", area[(area >= 60) & (area < 100)])",
      "output": "area[2] = 80 | area[-1] = 95 | area[1:4] = [ 55  80 120]\nmask: [False False  True  True  True  True] | count: 4\nprices of flats of at least 60 sq m: [55 90 47 70]\nsame rows picked from both columns keep alignment: [(80, 55), (120, 90), (65, 47), (95, 70)]\nediting a slice changed the original: [ 40 999  80 120  65  95]\nediting a fancy-indexed copy leaves the original: [ 40  55  80 120  65  95]\n['small' 'small' 'large' 'large' 'small' 'large']\n60 <= area < 100: [80 65 95]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Select with one mask for every aligned array, and copy before you edit."
     }
    ]
   }
  ]
 },
 {
  "title": "Broadcasting is shape reasoning",
  "minutes": 13,
  "sections": [
   {
    "id": "pn3-observe",
    "kicker": "1 · Observe",
    "title": "Subtract the average from every column, without a loop",
    "blocks": [
     {
      "kind": "p",
      "text": "To centre a table, subtract each column's mean from that column. With a loop that is slow and verbose. NumPy's broadcasting stretches a small array across a bigger one when their shapes are compatible, so X - X.mean(axis=0) just works. Understanding the rule is what prevents silent mistakes."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "When do two shapes broadcast, and how can a wrong axis hide?"
     }
    ]
   },
   {
    "id": "pn3-express",
    "kicker": "2 · Express",
    "title": "The broadcasting rule",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "align shapes from the right",
       "two sizes are compatible if they are equal or one of them is 1",
       "size 1 stretches to match"
      ],
      "note": "(3,3) and (3,) are compatible. (3,3) and (2,) are not."
     }
    ]
   },
   {
    "id": "pn3-visualize",
    "kicker": "3 · Visualize",
    "title": "Centring and scaling",
    "blocks": [
     {
      "kind": "table",
      "caption": "X is 3 × 3: bedrooms, size, km",
      "headers": [
       "Operation",
       "Shape rule",
       "Result"
      ],
      "rows": [
       [
        "X - X.mean(axis=0)",
        "(3,3) − (3,)",
        "each column centred"
       ],
       [
        "X * [1, 0.1, 10]",
        "(3,3) × (3,)",
        "each column scaled"
       ],
       [
        "rows (3,1) + cols (3,)",
        "(3,1) + (3,) → (3,3)",
        "a full grid 11…33"
       ],
       [
        "X + [1, 2]",
        "(3,3) + (2,)",
        "ValueError"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Column means were 3, 86.67 and 2.67. Subtracting them centres each column on zero."
     }
    ]
   },
   {
    "id": "pn3-discover",
    "kicker": "4 · Discover",
    "title": "A wrong axis can hide",
    "blocks": [
     {
      "kind": "p",
      "text": "Row means have shape (3,). Because X happens to be square, X - row_mean also runs, but it subtracts each mean from a column rather than from its own row. The row sums of the result are not zero, while with keepdims=True, shape (3,1), they are. On a 3 × 2 table the same mistake raises an error, which is the lucky case."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Broadcasting stretches size-1 axes, and keepdims or an explicit reshape tells NumPy which axis you mean."
     }
    ]
   },
   {
    "id": "pn3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, standardising. (X - X.mean(axis=0)) / X.std(axis=0) uses (n, d) with (d,) twice."
     },
     {
      "kind": "p",
      "text": "Example 2, a column vector. y.reshape(-1, 1) has shape (n, 1). Adding it to a (n,) array gives an (n, n) grid, a common surprise."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Feature scaling, centring and adding a bias are broadcasts."
     },
     {
      "kind": "check",
      "question": "Shapes (4, 3) and (3,): do they broadcast?",
      "options": [
       "Yes, to (4, 3)",
       "No",
       "Only if equal"
      ],
      "answer": 0,
      "why": "Aligned from the right, 3 matches 3 and the missing axis is stretched."
     }
    ]
   },
   {
    "id": "pn3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting square arrays",
      "text": "A wrong axis can run without error on square data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · (n,) against (n, 1)",
      "text": "The result is an (n, n) grid, not an elementwise sum."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Forgetting keepdims",
      "text": "Reductions drop the axis. Keep it when you need to broadcast back."
     }
    ]
   },
   {
    "id": "pn3-python",
    "kicker": "7 · In Python",
    "title": "Broadcasting in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Centre, scale, build a grid and catch a wrong axis",
      "code": "import numpy as np\n\nX = np.array([[3, 80, 2.0], [2, 60, 5.0], [4, 120, 1.0]])\ncol_mean = X.mean(axis=0)\nprint(\"column means\", col_mean, \"shape\", col_mean.shape)\nprint(\"X - column means:\\n\", X - col_mean)               # (3,3) - (3,) broadcasts across rows\n\nscale = np.array([1.0, 0.1, 10.0])\nprint(\"rescale columns:\\n\", X * scale)\n\n# a (3,1) column against a (3,) row makes a 3x3 grid\nrows = np.array([[1], [2], [3]])\ncols = np.array([10, 20, 30])\nprint(\"(3,1) + (3,):\\n\", rows + cols)\n\n# incompatible shapes fail loudly\ntry:\n    X + np.array([1.0, 2.0])\nexcept ValueError as e:\n    print(\"shapes (3,3) and (2,) ->\", \"ValueError: cannot broadcast\")\n\n# the silent mistake: a square table hides a wrong axis\nrow_mean = X.mean(axis=1)                                  # one mean per flat, shape (3,)\nwrong = X - row_mean                                       # broadcasts along the columns: not what we meant\nright = X - X.mean(axis=1, keepdims=True)                  # shape (3,1): subtract each flat's own mean\nprint(\"wrong (no error because X is square):\\n\", wrong.round(2))\nprint(\"right (each row centred on its own mean):\\n\", right.round(2))\nprint(\"row sums of 'right' are 0:\", np.allclose(right.sum(axis=1), 0), \"| of 'wrong':\", np.allclose(wrong.sum(axis=1), 0))\nX2 = X[:, :2]\ntry:\n    X2 - row_mean\nexcept ValueError:\n    print(\"with a 3x2 table the same mistake raises: shapes (3,2) and (3,) do not broadcast\")",
      "output": "column means [ 3.         86.66666667  2.66666667] shape (3,)\nX - column means:\n [[  0.          -6.66666667  -0.66666667]\n [ -1.         -26.66666667   2.33333333]\n [  1.          33.33333333  -1.66666667]]\nrescale columns:\n [[ 3.  8. 20.]\n [ 2.  6. 50.]\n [ 4. 12. 10.]]\n(3,1) + (3,):\n [[11 21 31]\n [12 22 32]\n [13 23 33]]\nshapes (3,3) and (2,) -> ValueError: cannot broadcast\nwrong (no error because X is square):\n [[-25.33  57.67 -39.67]\n [-26.33  37.67 -36.67]\n [-24.33  97.67 -40.67]]\nright (each row centred on its own mean):\n [[-25.33  51.67 -26.33]\n [-20.33  37.67 -17.33]\n [-37.67  78.33 -40.67]]\nrow sums of 'right' are 0: True | of 'wrong': False\nwith a 3x2 table the same mistake raises: shapes (3,2) and (3,) do not broadcast"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Check the shapes you expect before the result goes anywhere."
     }
    ]
   }
  ]
 },
 {
  "title": "Vectorised predictions and errors",
  "minutes": 13,
  "sections": [
   {
    "id": "pn4-observe",
    "kicker": "1 · Observe",
    "title": "Two hundred thousand predictions without a loop",
    "blocks": [
     {
      "kind": "p",
      "text": "A price model needs a prediction for each of 200,000 flats. A Python loop works and is slow. A vectorised expression, X @ w + b, does the same in one call and is also easier to read."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we turn the model equation into array code, and how do we measure errors?"
     }
    ]
   },
   {
    "id": "pn4-express",
    "kicker": "2 · Express",
    "title": "From equation to code",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "ŷ = X w + b",
       "error = ŷ − y",
       "MSE = mean(error²),   RMSE = √MSE,   MAE = mean(|error|)"
      ],
      "note": "X has shape (n, d), w has shape (d,), the result has shape (n,)."
     }
    ]
   },
   {
    "id": "pn4-visualize",
    "kicker": "3 · Visualize",
    "title": "A simulated market",
    "blocks": [
     {
      "kind": "p",
      "text": "200,000 flats with area and age, weights (0.55, −0.4) and bias 5. The loop and the vectorised version agree on the first 1,000 predictions."
     },
     {
      "kind": "table",
      "caption": "Errors against simulated prices",
      "headers": [
       "Metric",
       "Value (₹ lakh)"
      ],
      "rows": [
       [
        "MSE",
        "19.06"
       ],
       [
        "RMSE",
        "4.37"
       ],
       [
        "MAE",
        "3.49"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The model is on average about ₹3.5 lakh off, and RMSE is larger because squared errors weight big misses more."
     }
    ]
   },
   {
    "id": "pn4-discover",
    "kicker": "4 · Discover",
    "title": "One function for one flat or a million",
    "blocks": [
     {
      "kind": "p",
      "text": "A function predict(X, w, b) returns X @ w + b. With one flat of shape (2,) it gives a scalar, and with a table it gives one prediction per row. Good array code does not care how many rows it receives."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Write the model once as array algebra, and a single expression predicts for one example or a million."
     }
    ]
   },
   {
    "id": "pn4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, one flat. Area 80, age 10: 0.55 × 80 − 0.4 × 10 + 5 = 44 − 4 + 5 = 45.0."
     },
     {
      "kind": "p",
      "text": "Example 2, speed. Vectorised code typically runs tens to hundreds of times faster than a Python loop, because the work happens in compiled code."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every forward pass of a linear model or neural network layer is this expression."
     },
     {
      "kind": "check",
      "question": "X has shape (500, 4) and w has shape (4,). What is X @ w?",
      "options": [
       "Shape (4,)",
       "Shape (500,)",
       "Shape (500, 4)"
      ],
      "answer": 1,
      "why": "Each of the 500 rows is paired with w, giving 500 predictions."
     }
    ]
   },
   {
    "id": "pn4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Writing loops over rows",
      "text": "They are slow and hide shape mistakes."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Mixing up units in MSE",
      "text": "MSE is in squared lakh. Report RMSE or MAE."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Forgetting the bias",
      "text": "Predictions are then forced through the origin."
     }
    ]
   },
   {
    "id": "pn4-python",
    "kicker": "7 · In Python",
    "title": "A vectorised model in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Predict for 200,000 flats and score them",
      "code": "import numpy as np\n\nrng = np.random.default_rng(0)\nn = 200_000\narea = rng.uniform(30, 130, n)\nage = rng.uniform(0, 30, n)\nX = np.column_stack([area, age])\nw = np.array([0.55, -0.4])\nb = 5.0\n\n# loop version on the first 1,000 rows, vectorised version on all\nloop = np.array([w[0] * X[i, 0] + w[1] * X[i, 1] + b for i in range(1000)])\nvec = X @ w + b\nprint(\"loop and vectorised agree on the first 1,000:\", np.allclose(loop, vec[:1000]))\nprint(\"vectorised predictions:\", vec[:3].round(2), \"| count\", vec.size)\n\n# errors, MSE and RMSE in three lines\ny = 0.5 * area - 0.4 * age + 8 + rng.normal(0, 4, n)\nerr = vec - y\nprint(\"MSE\", round(float((err ** 2).mean()), 2), \"| RMSE\", round(float(np.sqrt((err ** 2).mean())), 2), \"| MAE\", round(float(np.abs(err).mean()), 2))\n\n# a prediction function that works for one flat or a million\ndef predict(X, w, b):\n    return X @ w + b\nprint(\"one flat:\", predict(np.array([80.0, 10.0]), w, b), \"| three flats:\", predict(X[:3], w, b).round(2))",
      "output": "loop and vectorised agree on the first 1,000: True\nvectorised predictions: [53.25 33.29 14.76] | count 200000\nMSE 19.06 | RMSE 4.37 | MAE 3.49\none flat: 45.0 | three flats: [53.25 33.29 14.76]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "If you are writing a loop over rows, look for the matrix expression."
     }
    ]
   }
  ]
 },
 {
  "title": "Matrix products and transposes",
  "minutes": 13,
  "sections": [
   {
    "id": "pn5-observe",
    "kicker": "1 · Observe",
    "title": "What does X.T @ X mean?",
    "blocks": [
     {
      "kind": "p",
      "text": "The first formula for fitting a line by least squares uses X.T @ X. It looks like notation, but it is a table: how every feature relates to every other. To use it you need to know which shapes multiply and what order does."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "When can matrices be multiplied, what does the result mean and how are weights found from it?"
     }
    ]
   },
   {
    "id": "pn5-express",
    "kicker": "2 · Express",
    "title": "The shape rule",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "(n, k) @ (k, m) → (n, m)",
       "(Xᵀ)ᵢⱼ = Xⱼᵢ",
       "weights: solve (XᵀX) w = Xᵀ y"
      ],
      "note": "The inner sizes must match. Matrix products are generally not commutative."
     }
    ]
   },
   {
    "id": "pn5-visualize",
    "kicker": "3 · Visualize",
    "title": "Small checks",
    "blocks": [
     {
      "kind": "table",
      "caption": "X = [[1,2],[3,4],[5,6]]",
      "headers": [
       "Expression",
       "Shape",
       "Result"
      ],
      "rows": [
       [
        "Xᵀ @ X",
        "(2,2)",
        "[[35, 44], [44, 56]]"
       ],
       [
        "X @ Xᵀ",
        "(3,3)",
        "flat against flat"
       ],
       [
        "(4,3) @ (3,2)",
        "(4,2)",
        "legal"
       ],
       [
        "(4,3) @ (4,2)",
        "–",
        "error: 3 ≠ 4"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Xᵀ @ X relates features to features, while X @ Xᵀ relates flats to flats. For M = [[1,2],[3,4]] and N = [[0,1],[1,0]], M @ N = [[2,1],[4,3]] but N @ M = [[3,4],[1,2]]: order matters. And M * N is the elementwise product, which is a different operation."
     }
    ]
   },
   {
    "id": "pn5-discover",
    "kicker": "4 · Discover",
    "title": "Solving for weights",
    "blocks": [
     {
      "kind": "p",
      "text": "With y = [5, 11, 17], solving (XᵀX) w = Xᵀy gives w = (1, 2), and the fitted values reproduce y exactly. np.linalg.solve is preferred to computing an explicit inverse."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A matrix product pairs rows with columns and requires matching inner sizes, and XᵀX turns a data table into a small feature-by-feature table."
     }
    ]
   },
   {
    "id": "pn5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a shape check. X is (1000, 5). Xᵀ @ X is (5,5), and Xᵀ @ y is (5,). Solving gives 5 weights."
     },
     {
      "kind": "p",
      "text": "Example 2, a swapped order. y @ X has the wrong sizes, but y.T @ X (a row vector times a table) is legal and gives the same numbers as Xᵀ @ y."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Linear regression's closed form, covariance matrices, and PCA all rest on XᵀX."
     },
     {
      "kind": "check",
      "question": "Is A @ B equal to B @ A for matrices in general?",
      "options": [
       "Yes always",
       "No, order matters",
       "Only for square matrices"
      ],
      "answer": 1,
      "why": "Matrix multiplication is not commutative."
     }
    ]
   },
   {
    "id": "pn5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Using * for matrix products",
      "text": "* is elementwise. Use @."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Inverting XᵀX explicitly",
      "text": "Use solve or lstsq for stability."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Ignoring near-duplicate columns",
      "text": "XᵀX becomes almost singular and weights blow up."
     }
    ]
   },
   {
    "id": "pn5-python",
    "kicker": "7 · In Python",
    "title": "Products and solves in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Shapes, order, the elementwise trap and least squares",
      "code": "import numpy as np\n\nX = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])         # 3 flats, 2 features\nprint(\"X shape\", X.shape, \"| X.T shape\", X.T.shape)\nG = X.T @ X                                                  # 2x2: how features relate\nprint(\"X.T @ X =\\n\", G)\nH = X @ X.T\nprint(\"X @ X.T shape\", H.shape, \"(flat against flat)\")\n\n# shape rule: (n,k) @ (k,m) = (n,m)\nA, B = np.ones((4, 3)), np.ones((3, 2))\nprint(\"(4,3) @ (3,2) ->\", (A @ B).shape)\ntry:\n    A @ np.ones((4, 2))\nexcept ValueError:\n    print(\"(4,3) @ (4,2) -> the inner sizes 3 and 4 disagree\")\n\n# order matters\nM, N = np.array([[1, 2], [3, 4]]), np.array([[0, 1], [1, 0]])\nprint(\"M @ N =\", (M @ N).tolist(), \"| N @ M =\", (N @ M).tolist())\n# the elementwise product is not the matrix product\nprint(\"M * N =\", (M * N).tolist())\n\n# normal equation: weights from X and y\ny = np.array([5.0, 11.0, 17.0])\nw = np.linalg.solve(X.T @ X, X.T @ y)\nprint(\"least-squares weights:\", w.round(3), \"| fitted:\", (X @ w).round(2))",
      "output": "X shape (3, 2) | X.T shape (2, 3)\nX.T @ X =\n [[35. 44.]\n [44. 56.]]\nX @ X.T shape (3, 3) (flat against flat)\n(4,3) @ (3,2) -> (4, 2)\n(4,3) @ (4,2) -> the inner sizes 3 and 4 disagree\nM @ N = [[2, 1], [4, 3]] | N @ M = [[3, 4], [1, 2]]\nM * N = [[0, 2], [3, 0]]\nleast-squares weights: [1. 2.] | fitted: [ 5. 11. 17.]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Say the shape of every product out loud before you run it."
     }
    ]
   }
  ]
 },
 {
  "title": "Reductions, missing numbers and the limits of floats",
  "minutes": 13,
  "sections": [
   {
    "id": "pn6-observe",
    "kicker": "1 · Observe",
    "title": "One NaN spoils a sum",
    "blocks": [
     {
      "kind": "p",
      "text": "Prices [30, 41, NaN, 90, 47]: np.sum gives NaN, and so does the mean. A single missing number spreads through every calculation that touches it. NumPy has tools for reducing over axes and for handling NaN, and computers have limits that can bite even without missing data."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we summarise arrays safely, and where do floating-point limits show up?"
     }
    ]
   },
   {
    "id": "pn6-express",
    "kicker": "2 · Express",
    "title": "Reductions and NaN",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "sum, mean, min, max, argmax,  axis=0 down columns, axis=1 across rows",
       "np.nansum, np.nanmean ignore NaN",
       "np.isnan(x) finds missing values;  nan == nan is False"
      ],
      "note": "A reduction removes the axis you reduce over."
     }
    ]
   },
   {
    "id": "pn6-visualize",
    "kicker": "3 · Visualize",
    "title": "What the functions return",
    "blocks": [
     {
      "kind": "table",
      "caption": "Prices [30, 41, nan, 90, 47]",
      "headers": [
       "Call",
       "Result"
      ],
      "rows": [
       [
        "np.sum",
        "nan"
       ],
       [
        "np.nansum",
        "208"
       ],
       [
        "np.nanmean",
        "52.0"
       ],
       [
        "np.isnan(price).sum()",
        "1"
       ],
       [
        "nan == nan",
        "False"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Column sums of [[3,80],[2,60],[4,120]] are (9, 260), row sums (83, 62, 124), overall 269. argmax of the first column is 2, the third flat."
     }
    ]
   },
   {
    "id": "pn6-discover",
    "kicker": "4 · Discover",
    "title": "Floating-point limits",
    "blocks": [
     {
      "kind": "p",
      "text": "(1e16 + 1) − 1e16 is 0.0, not 1: a float has about 16 digits, so the 1 is lost. The float64 epsilon is 2.2e-16, and float32's is 1.2e-7. An 8-bit unsigned integer wraps around: 200 + 100 is 44. And exp(1000) overflows, so a naive softmax returns NaN. Subtracting the maximum first gives 0.09, 0.245, 0.665."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Reductions collapse axes, NaN needs explicit handling, and numbers on a computer have finite range and precision."
     }
    ]
   },
   {
    "id": "pn6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, counting missing. np.isnan(X).sum(axis=0) gives the number of missing values in each column."
     },
     {
      "kind": "p",
      "text": "Example 2, choice of dtype. Counting 300 flats in a uint8 array overflows silently at 256. Use int64 for counts."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Missing-value policy, numerical stability in softmax and log loss, and dtype choices in big data pipelines."
     },
     {
      "kind": "check",
      "question": "np.nan == np.nan returns...",
      "options": [
       "True",
       "False",
       "An error"
      ],
      "answer": 1,
      "why": "NaN compares unequal to everything, including itself. Use np.isnan."
     }
    ]
   },
   {
    "id": "pn6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Letting NaN pass through silently",
      "text": "Check with isnan before summarising."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Choosing too small an integer type",
      "text": "Overflow wraps without warning."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Naive exponentials",
      "text": "Subtract the maximum before exp."
     }
    ]
   },
   {
    "id": "pn6-python",
    "kicker": "7 · In Python",
    "title": "Reductions and limits in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "nansum, axis reductions, float limits and a stable softmax",
      "code": "import numpy as np\n\nprice = np.array([30, 41, np.nan, 90, 47.0])\nprint(\"sum with a NaN:\", price.sum(), \"| nansum:\", np.nansum(price), \"| nanmean:\", np.nanmean(price))\nprint(\"how many missing:\", np.isnan(price).sum(), \"| comparison with nan: nan == nan ->\", np.nan == np.nan)\n\nX = np.array([[3, 80], [2, 60], [4, 120]], float)\nprint(\"column sums\", X.sum(axis=0), \"| row sums\", X.sum(axis=1), \"| overall\", X.sum())\nprint(\"argmax of the first column:\", X[:, 0].argmax(), \"| min/max of sizes:\", X[:, 1].min(), X[:, 1].max())\n\n# limits of floating point\nprint(\"1e16 + 1 - 1e16 =\", (1e16 + 1) - 1e16)\nprint(\"machine epsilon (float64):\", float(np.finfo(np.float64).eps), \"| float32:\", float(np.finfo(np.float32).eps))\na = np.array([200], dtype=np.uint8)\nprint(\"uint8 overflow: 200 + 100 =\", (a + np.uint8(100))[0], \"<- wraps around\")\n\n# stable softmax\nz = np.array([1000.0, 1001.0, 1002.0])\nwith np.errstate(over=\"ignore\", invalid=\"ignore\"):\n    print(\"naive softmax:\", np.exp(z) / np.exp(z).sum())\ns = np.exp(z - z.max()); print(\"stable softmax:\", (s / s.sum()).round(3))",
      "output": "sum with a NaN: nan | nansum: 208.0 | nanmean: 52.0\nhow many missing: 1 | comparison with nan: nan == nan -> False\ncolumn sums [  9. 260.] | row sums [ 83.  62. 124.] | overall 269.0\nargmax of the first column: 2 | min/max of sizes: 60.0 120.0\n1e16 + 1 - 1e16 = 0.0\nmachine epsilon (float64): 2.220446049250313e-16 | float32: 1.1920928955078125e-07\nuint8 overflow: 200 + 100 = 44 <- wraps around\nnaive softmax: [nan nan nan]\nstable softmax: [0.09  0.245 0.665]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Count the missing values first, and know your dtype's limits."
     }
    ]
   }
  ]
 }
];
