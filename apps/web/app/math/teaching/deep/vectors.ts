import type {DeepLesson} from "../deep-read";
export const VECTORS_DEEP:DeepLesson[]=[
 {
  "title": "Many facts, one score: the dot product",
  "minutes": 13,
  "sections": [
   {
    "id": "vec-observe",
    "kicker": "1 · Observe",
    "title": "How does a flat become one number?",
    "blocks": [
     {
      "kind": "p",
      "text": "A buyer describes a flat: 3 bedrooms, 80 sq m, 2 km from the metro. A price model must reduce those three facts to a single number. The tool is a list of numbers called a vector, and a rule for combining two such lists called the dot product."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How can an ordered list of facts become one score, and what can go wrong with the order?"
     }
    ]
   },
   {
    "id": "vec-express",
    "kicker": "2 · Express",
    "title": "Vectors and the dot product",
    "blocks": [
     {
      "kind": "p",
      "text": "A vector is an ordered list. Position matters: the first slot is always bedrooms. Give each feature a weight: ₹2 lakh per bedroom, ₹0.5 lakh per sq m, and −₹3 lakh per km from the metro. The dot product pairs each feature with its weight, multiplies, and adds."
     },
     {
      "kind": "eq",
      "lines": [
       "x · w = x₁w₁ + x₂w₂ + x₃w₃",
       "vectors must have the same length",
       "length: ‖x‖ = √(x·x),   cosine similarity = x·y ÷ (‖x‖ ‖y‖)"
      ],
      "note": "Pair, multiply, add. The result is a single number."
     }
    ]
   },
   {
    "id": "vec-visualize",
    "kicker": "3 · Visualize",
    "title": "The flat's score",
    "blocks": [
     {
      "kind": "table",
      "caption": "Pair, multiply, add",
      "headers": [
       "Feature",
       "Value",
       "Weight",
       "Product"
      ],
      "rows": [
       [
        "Bedrooms",
        "3",
        "2.0",
        "6"
       ],
       [
        "Size (sq m)",
        "80",
        "0.5",
        "40"
       ],
       [
        "Km to metro",
        "2",
        "−3.0",
        "−6"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The score is 6 + 40 − 6 = 40 lakh. The size term does most of the work. Giving a vector of length 3 a weight vector of length 2 raises a shape error, which is the correct response: a missing weight has no honest value."
     }
    ]
   },
   {
    "id": "vec-discover",
    "kicker": "4 · Discover",
    "title": "Order, length and angle",
    "blocks": [
     {
      "kind": "p",
      "text": "If a data pipeline swaps bedrooms and size, the same numbers (80, 3, 2) pair with the wrong weights and score 155.5 lakh. Nothing crashes, which is why vector order must be fixed and documented."
     },
     {
      "kind": "p",
      "text": "Two flats (3, 80, 2) and (2, 60, 5) have cosine similarity 0.9983, nearly parallel, because the large size numbers dominate. After standardising each column, the same flats have cosine −0.82: pointing in nearly opposite directions. Similarity depends on the scale of the features."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A dot product combines many facts into one score by pairing each fact with a weight, so order and scale decide the answer."
     }
    ]
   },
   {
    "id": "vec-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a second flat. (2, 60, 5) with the same weights: 2 × 2 + 60 × 0.5 + 5 × (−3) = 4 + 30 − 15 = 19 lakh."
     },
     {
      "kind": "p",
      "text": "Example 2, a zero-weight feature. If the weight on bedrooms is 0, changing bedrooms from 3 to 4 changes nothing, because that term is 0 × 3 = 0 × 4."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "A linear model's prediction is w · x + b. Every neuron in a neural network computes a dot product first."
     },
     {
      "kind": "check",
      "question": "x = (1, 2, 3) and w = (4, 5, 6). What is x · w?",
      "options": [
       "32",
       "15",
       "21"
      ],
      "answer": 0,
      "why": "1 × 4 + 2 × 5 + 3 × 6 = 4 + 10 + 18 = 32."
     }
    ]
   },
   {
    "id": "vec-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Different lengths",
      "text": "The dot product is undefined. Fix the data, do not pad silently."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Swapped feature order",
      "text": "The code runs and the answer is wrong. Name your columns."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Comparing unscaled vectors",
      "text": "Large-valued features dominate lengths and angles."
     }
    ]
   },
   {
    "id": "vec-python",
    "kicker": "7 · In Python",
    "title": "A dot product in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Score a flat, spot shape and order errors, compare flats",
      "code": "import numpy as np\n\n# a house as an ordered list of features: [bedrooms, size in sq m, distance to metro in km]\nhouse = np.array([3, 80, 2.0])\nweights = np.array([2.0, 0.5, -3.0])               # lakh rupees per bedroom, per sq m, per km\nscore = np.dot(house, weights)\nprint(\"score = 3*2 + 80*0.5 + 2*(-3) =\", score, \"lakh\")\nprint(\"pair, multiply, add:\", house * weights, \"->\", (house * weights).sum())\n\n# a dot product of mismatched lengths is not defined\ntry:\n    np.dot(house, weights[:2])\nexcept ValueError as e:\n    print(\"shape error:\", \"shapes (3,) and (2,) not aligned\" if \"not aligned\" in str(e) else e)\n\n# order of features matters: a pipeline that swapped bedrooms and size\nswapped = np.array([80, 3, 2.0])\nprint(\"same numbers, wrong order:\", np.dot(swapped, weights))\n\n# length and angle between two houses\na, b = np.array([3, 80, 2.0]), np.array([2, 60, 5.0])\ncos = a @ b / (np.linalg.norm(a) * np.linalg.norm(b))\nprint(\"lengths:\", round(float(np.linalg.norm(a)), 2), round(float(np.linalg.norm(b)), 2), \"| cosine similarity:\", round(float(cos), 4))\nprint(\"after standardising the columns the picture changes:\")\nX = np.array([[3, 80, 2.0], [2, 60, 5.0], [4, 120, 1.0], [1, 40, 8.0]])\nZ = (X - X.mean(0)) / X.std(0)\nza, zb = Z[0], Z[1]\nprint(\"cosine of houses 1 and 2:\", round(float(za @ zb / (np.linalg.norm(za) * np.linalg.norm(zb))), 4))",
      "output": "score = 3*2 + 80*0.5 + 2*(-3) = 40.0 lakh\npair, multiply, add: [ 6. 40. -6.] -> 40.0\nshape error: shapes (3,) and (2,) not aligned\nsame numbers, wrong order: 155.5\nlengths: 80.08 60.24 | cosine similarity: 0.9983\nafter standardising the columns the picture changes:\ncosine of houses 1 and 2: -0.8235"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Pair, multiply, add. Then check the order and the scale."
     }
    ]
   }
  ]
 }
];
