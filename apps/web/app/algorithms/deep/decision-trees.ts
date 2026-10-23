import type {DeepLesson} from "../../math/teaching/deep-read";
export const DECISION_TREES_DEEP:DeepLesson[]=[
 {
  "title": "Twenty questions for customers",
  "minutes": 13,
  "sections": [
   {
    "id": "dt1-observe",
    "kicker": "1 · Observe",
    "title": "A rule a manager can read aloud",
    "blocks": [
     {
      "kind": "p",
      "text": "A telecom manager looks at ten past customers: months with the company, and whether they left. Nothing about the list is mysterious. Customers who joined recently seem to leave more often. The manager does not want a formula. They want a rule they can say out loud: “if someone has been with us under eight months, call them.”"
     },
     {
      "kind": "p",
      "text": "A decision tree builds exactly that kind of rule, one yes-or-no question at a time. The skill is choosing the question that separates leavers from stayers best."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Among all possible questions, how do you pick the one that sorts the customers most cleanly?"
     }
    ]
   },
   {
    "id": "dt1-express",
    "kicker": "2 · Express",
    "title": "Measure how mixed a group is",
    "blocks": [
     {
      "kind": "p",
      "text": "A group of customers is “pure” if they all did the same thing, and mixed if they are split. Gini impurity measures the mix: 1 − p² − (1 − p)², where p is the share who left. A pure group scores 0. A 50-50 group scores the maximum, 0.5."
     },
     {
      "kind": "eq",
      "lines": [
       "whole group: 6 of 10 left, p = 0.6",
       "gini = 1 − 0.36 − 0.16 = 0.48"
      ],
      "note": "A question is good if the two groups it creates are, on average, purer than the group it started with."
     }
    ]
   },
   {
    "id": "dt1-visualize",
    "kicker": "3 · Visualize",
    "title": "Try every possible question",
    "blocks": [
     {
      "kind": "p",
      "text": "Sort the ten customers by tenure and try a cut-off between each neighbouring pair. For each cut-off, weigh the impurity of the two sides by their sizes. The reduction from 0.48 is the gain."
     },
     {
      "kind": "table",
      "caption": "Every cut-off on tenure",
      "headers": [
       "Question",
       "Left side",
       "Right side",
       "Weighted gini",
       "Gain"
      ],
      "rows": [
       [
        "tenure < 4.5",
        "2",
        "8",
        "0.400",
        "0.080"
       ],
       [
        "tenure < 8",
        "4",
        "6",
        "0.267",
        "0.213"
       ],
       [
        "tenure < 11.5",
        "5",
        "5",
        "0.400",
        "0.080"
       ],
       [
        "tenure < 17",
        "6",
        "4",
        "0.317",
        "0.163"
       ],
       [
        "tenure < 28.5",
        "8",
        "2",
        "0.300",
        "0.180"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "“Tenure < 8” wins. All four customers under eight months left, so the left side is perfectly pure, with impurity 0. Try the cut-offs in the playground by dragging the threshold."
     }
    ]
   },
   {
    "id": "dt1-discover",
    "kicker": "4 · Discover",
    "title": "A tree is this step, repeated",
    "blocks": [
     {
      "kind": "p",
      "text": "After the first question the group splits in two. Treat each side as a smaller version of the same problem and ask again. The left side is already pure, so stop. The right side has 6 customers, 2 of whom left, and still has a mix, so ask another question there. Keep going until the groups are pure or you decide to stop."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A decision tree repeatedly asks the single yes-or-no question that most reduces how mixed the groups are, and each answer sends a customer down a branch."
     },
     {
      "kind": "p",
      "text": "The tree is built greedily: it picks the best question now, without planning ahead. That is fast and usually good enough, though not always the best possible tree."
     }
    ]
   },
   {
    "id": "dt1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, checking the best split by hand. “Tenure < 8” puts customers with tenure 2, 4, 5, 7 on the left (4 of 4 left, gini 0) and the other six on the right, where 2 left and 4 stayed: gini = 1 − (1/3)² − (2/3)² = 0.444. Weighted: (4/10) × 0 + (6/10) × 0.444 = 0.267. Gain = 0.48 − 0.267 = 0.213."
     },
     {
      "kind": "p",
      "text": "Example 2, the second-best question. “Tenure < 28.5” also scores well, with a gain of 0.18. Why? Its right side holds only two customers, both stayers. The quality of a split depends on both the purity and the size of the groups."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Credit approval, triage, churn calls, fault diagnosis: wherever a human must follow or audit the rule."
     },
     {
      "kind": "check",
      "question": "A group has 5 leavers and 5 stayers. What is its Gini impurity?",
      "options": [
       "0.5",
       "0",
       "1"
      ],
      "answer": 0,
      "why": "p = 0.5, so gini = 1 − 0.25 − 0.25 = 0.5. This is the most mixed a two-class group can be."
     }
    ]
   },
   {
    "id": "dt1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Thinking the best split is globally best",
      "text": "The tree takes the best single step each time. A different first question might lead to a better tree overall."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Splitting until every group is pure",
      "text": "That fits every quirk of the training data. The next lesson covers what that costs."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading the threshold too literally",
      "text": "A cut-off at 8 is halfway between 7 and 9 because those are the nearest data points, not because eight is magical."
     }
    ]
   },
   {
    "id": "dt1-python",
    "kicker": "7 · In Python",
    "title": "Searching for the best question",
    "blocks": [
     {
      "kind": "code",
      "caption": "Gini impurity and every tenure cut-off",
      "code": "import numpy as np\n\ntenure = np.array([2, 4, 5, 7, 9, 14, 20, 26, 31, 40])   # months with us\nleft = np.array([1, 1, 1, 1, 0, 1, 0, 1, 0, 0])           # 1 = left\n\ndef gini(labels):\n    if len(labels) == 0:\n        return 0.0\n    p = labels.mean()\n    return 1 - p ** 2 - (1 - p) ** 2\n\nprint(\"whole group: gini\", round(gini(left), 3), \"(\", left.sum(), \"left of\", len(left), \")\")\nbest = None\nfor cut in (tenure[:-1] + tenure[1:]) / 2:\n    l, r = left[tenure < cut], left[tenure >= cut]\n    after = (len(l) * gini(l) + len(r) * gini(r)) / len(left)\n    gain = gini(left) - after\n    print(\"tenure <\", cut, \"left:\", len(l), \"right:\", len(r), \"weighted gini\", round(after, 3), \"gain\", round(gain, 3))\n    if best is None or gain > best[1]:\n        best = (cut, gain)\nprint(\"best question: tenure <\", best[0])",
      "output": "whole group: gini 0.48 ( 6 left of 10 )\ntenure < 3.0 left: 1 right: 9 weighted gini 0.444 gain 0.036\ntenure < 4.5 left: 2 right: 8 weighted gini 0.4 gain 0.08\ntenure < 6.0 left: 3 right: 7 weighted gini 0.343 gain 0.137\ntenure < 8.0 left: 4 right: 6 weighted gini 0.267 gain 0.213\ntenure < 11.5 left: 5 right: 5 weighted gini 0.4 gain 0.08\ntenure < 17.0 left: 6 right: 4 weighted gini 0.317 gain 0.163\ntenure < 23.0 left: 7 right: 3 weighted gini 0.419 gain 0.061\ntenure < 28.5 left: 8 right: 2 weighted gini 0.3 gain 0.18\ntenure < 35.5 left: 9 right: 1 weighted gini 0.4 gain 0.08\nbest question: tenure < 8.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Impurity measures how mixed a group is. A tree asks, again and again, the question that makes the groups purer."
     }
    ]
   }
  ]
 },
 {
  "title": "Trees that predict a number",
  "minutes": 13,
  "sections": [
   {
    "id": "dt2-observe",
    "kicker": "1 · Observe",
    "title": "Predicting a price by asking questions",
    "blocks": [
     {
      "kind": "p",
      "text": "A property site has eight flats with their area and price. Nobody believes price rises in a straight line with area, because there are step changes between neighbourhoods and building types. A tree can capture steps. At the end of each branch it needs one number: the price to predict for flats that land there."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What number should a branch predict, and how do we choose the questions when the answer is a number, not a class?"
     }
    ]
   },
   {
    "id": "dt2-express",
    "kicker": "2 · Express",
    "title": "Predict the average, measure the squared miss",
    "blocks": [
     {
      "kind": "p",
      "text": "The best single guess for a group is its average, because the average minimises the squared misses. So each leaf predicts the mean price of the flats in it. A group's impurity becomes the sum of squared misses around its mean, SSE."
     },
     {
      "kind": "eq",
      "lines": [
       "all eight flats: mean ₹53.6 lakh, SSE = 2,895.9",
       "best question is the cut-off that minimises SSE(left) + SSE(right)"
      ],
      "note": "The same recipe as before, with squared error in place of Gini."
     }
    ]
   },
   {
    "id": "dt2-visualize",
    "kicker": "3 · Visualize",
    "title": "Scan the cut-offs",
    "blocks": [
     {
      "kind": "table",
      "caption": "Candidate cut-offs on area",
      "headers": [
       "Question",
       "Left mean",
       "Right mean",
       "Total SSE"
      ],
      "rows": [
       [
        "area < 55",
        "₹32.0",
        "₹60.8",
        "1,648.8"
       ],
       [
        "area < 65",
        "₹33.3",
        "₹65.8",
        "919.5"
       ],
       [
        "area < 75",
        "₹38.0",
        "₹69.2",
        "942.8"
       ],
       [
        "area < 95",
        "₹44.2",
        "₹82.0",
        "748.8"
       ],
       [
        "area < 105",
        "₹49.3",
        "₹84.0",
        "1,841.4"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A cut at 95 sq m wins, cutting the total SSE from 2,896 to 749. The big jump between the 90 and 100 sq m flats is where the data has a step. Slide the cut in the playground and watch the SSE."
     }
    ]
   },
   {
    "id": "dt2-discover",
    "kicker": "4 · Discover",
    "title": "The prediction is a staircase",
    "blocks": [
     {
      "kind": "p",
      "text": "Allow two levels of questions. The tree learns: area ≤ 95? If yes, area ≤ 65? The four leaves predict ₹33.3 lakh, ₹55 lakh, ₹80 lakh and ₹84 lakh. As a graph the prediction is a flat step for every leaf."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A regression tree splits to make each group's prices as similar as possible, then predicts each group's average, giving a staircase."
     },
     {
      "kind": "p",
      "text": "Units matter here: the leaf prediction is in ₹ lakh, while the SSE and variance are in squared ₹ lakh. Take a square root to talk about a typical miss in rupees."
     }
    ]
   },
   {
    "id": "dt2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, prediction. A 75 sq m flat falls in area ≤ 95 and area > 65, the leaf with mean ₹55 lakh. The model predicts ₹55 lakh. A 45 sq m flat predicts ₹33.3 lakh."
     },
     {
      "kind": "p",
      "text": "Example 2, why not a line. A straight line through these eight flats has to compromise between the cheap and expensive groups. The tree takes each group as it is. Its two-level staircase misses by only a few lakh, with no assumption that price rises evenly."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Pricing, demand, energy use and anywhere a response jumps at thresholds, such as tax slabs, discounts and building-type changes."
     },
     {
      "kind": "check",
      "question": "A leaf holds flats priced ₹30, ₹34 and ₹36 lakh. What does the tree predict for a new flat in this leaf?",
      "options": [
       "₹33.3 lakh",
       "₹36 lakh",
       "₹30 lakh"
      ],
      "answer": 0,
      "why": "The prediction is the mean: (30 + 34 + 36) / 3 = 33.3."
     }
    ]
   },
   {
    "id": "dt2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading a staircase as the truth",
      "text": "Real prices do not jump at exactly 95 sq m. The step is where this sample happened to change."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Tiny leaves",
      "text": "A leaf holding one flat predicts that flat's price exactly, which is memory, not learning."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Predicting beyond the data",
      "text": "A tree can never predict above its highest leaf, however large the flat. Lesson 6 shows this."
     }
    ]
   },
   {
    "id": "dt2-python",
    "kicker": "7 · In Python",
    "title": "A regression tree, printed",
    "blocks": [
     {
      "kind": "code",
      "caption": "Best splits, and the tree as readable rules",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeRegressor, export_text\n\narea = np.array([40, 50, 60, 70, 80, 90, 100, 110], float)       # square metres\nprice = np.array([30, 34, 36, 52, 55, 58, 80, 84], float)        # Rs lakh\n\ndef sse(v):\n    return ((v - v.mean()) ** 2).sum()\n\nprint(\"one group: mean\", price.mean(), \"SSE\", round(sse(price), 1))\nfor cut in [55, 65, 75, 95, 105]:\n    l, r = price[area < cut], price[area >= cut]\n    print(\"area <\", cut, \"means\", round(l.mean(), 1), round(r.mean(), 1), \"SSE\", round(sse(l) + sse(r), 1))\n\nstump = DecisionTreeRegressor(max_depth=1).fit(area.reshape(-1, 1), price)\ntree = DecisionTreeRegressor(max_depth=2).fit(area.reshape(-1, 1), price)\nprint(export_text(tree, feature_names=[\"area\"]))\nprint(\"predictions for 45, 75, 105:\", tree.predict([[45], [75], [105]]).round(1))",
      "output": "one group: mean 53.625 SSE 2895.9\narea < 55 means 32.0 60.8 SSE 1648.8\narea < 65 means 33.3 65.8 SSE 919.5\narea < 75 means 38.0 69.2 SSE 942.8\narea < 95 means 44.2 82.0 SSE 748.8\narea < 105 means 49.3 84.0 SSE 1841.4\n|--- area <= 95.00\n|   |--- area <= 65.00\n|   |   |--- value: [33.33]\n|   |--- area >  65.00\n|   |   |--- value: [55.00]\n|--- area >  95.00\n|   |--- area <= 105.00\n|   |   |--- value: [80.00]\n|   |--- area >  105.00\n|   |   |--- value: [84.00]\n\npredictions for 45, 75, 105: [33.3 55.  80. ]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Each leaf predicts a mean. Questions are chosen to shrink the squared misses, and the result is a staircase."
     }
    ]
   }
  ]
 },
 {
  "title": "Trees that predict a class and a probability",
  "minutes": 13,
  "sections": [
   {
    "id": "dt3-observe",
    "kicker": "1 · Observe",
    "title": "How sure is a leaf?",
    "blocks": [
     {
      "kind": "p",
      "text": "A tree for churn ends each branch in a leaf containing past customers. The leaf predicts the class most of them had. But the manager wants more than a label. They want to know how likely it is that this customer leaves, to decide whether a retention call is worth it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What probability does a leaf give, and when can you trust it?"
     }
    ]
   },
   {
    "id": "dt3-express",
    "kicker": "2 · Express",
    "title": "The leaf's share is the probability",
    "blocks": [
     {
      "kind": "p",
      "text": "If a leaf holds 20 past customers and 16 left, the tree says the probability of leaving is 16 / 20 = 0.8. If a leaf has just 3 customers and all 3 left, the tree says 1.0. It is the same calculation, but the second one rests on three examples."
     },
     {
      "kind": "eq",
      "lines": [
       "P(leave) = customers in the leaf who left ÷ customers in the leaf"
      ],
      "note": "The number is honest only when the leaf is large enough to count on."
     }
    ]
   },
   {
    "id": "dt3-visualize",
    "kicker": "3 · Visualize",
    "title": "The same customer, four trees",
    "blocks": [
     {
      "kind": "p",
      "text": "400 simulated customers: tenure, support calls, and whether they left. Ask four different trees about one new customer, with 10 months of tenure and 3 calls."
     },
     {
      "kind": "table",
      "caption": "P(leave) for the same new customer",
      "headers": [
       "Tree",
       "Leaves",
       "P(leave)"
      ],
      "rows": [
       [
        "One question (depth 1)",
        "2",
        "0.641"
       ],
       [
        "Three levels",
        "8",
        "0.784"
       ],
       [
        "No limit",
        "143",
        "1.000"
       ],
       [
        "No limit, at least 25 per leaf",
        "13",
        "0.889"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The answer ranges from 0.64 to 1.00 for the same customer, with no change in the data. The unlimited tree has 143 leaves for 400 customers, so its leaf for this customer is tiny, and the probability of exactly 1.0 means “one or two customers like this all left”. That is memory, not certainty."
     }
    ]
   },
   {
    "id": "dt3-discover",
    "kicker": "4 · Discover",
    "title": "Probabilities need enough examples",
    "blocks": [
     {
      "kind": "p",
      "text": "A leaf with 5 customers has a probability that can only be 0, 0.2, 0.4, 0.6, 0.8 or 1. It is a rough estimate with big error bars, as the Math bridge on intervals showed. A leaf with 25 or more has finer steps and more stable estimates."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A classification tree's probability is the share in the leaf, so require each leaf to hold enough customers or the probabilities will be extreme and unreliable."
     },
     {
      "kind": "p",
      "text": "The setting min_samples_leaf enforces that. It trades a little flexibility for probabilities you can use in a decision."
     }
    ]
   },
   {
    "id": "dt3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, reading a leaf. A leaf has 20 customers: 16 left, 4 stayed. The prediction is “leaves” and the probability is 0.8. With a retention call costing ₹100 and a lost customer costing ₹2,000, the expected loss at stake is 0.8 × ₹2,000 = ₹1,600, far above the ₹100 call, so call them."
     },
     {
      "kind": "p",
      "text": "Example 2, the tiny leaf. A leaf has 2 customers, both stayed, P(leave) = 0. A retention rule that never calls these customers may miss real risk. A leaf of two says almost nothing."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Triage, risk scoring, any use of tree probabilities for decisions or ranking. Random forests fix this by averaging many trees."
     },
     {
      "kind": "check",
      "question": "A leaf has 3 customers, all of whom left. What does the tree report, and how far should you trust it?",
      "options": [
       "1.0, but with only 3 examples it is weak evidence",
       "1.0, which is certain",
       "0.5"
      ],
      "answer": 0,
      "why": "The share is 3/3 = 1.0, but three examples cannot justify certainty."
     }
    ]
   },
   {
    "id": "dt3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting probabilities of 0 or 1",
      "text": "They usually come from tiny leaves. Enforce a minimum leaf size."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Treating the label as the only output",
      "text": "The probability lets you rank customers and set thresholds. Use it."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Comparing leaves of different sizes",
      "text": "A leaf with 80% from 10 customers is weaker than one with 75% from 200."
     }
    ]
   },
   {
    "id": "dt3-python",
    "kicker": "7 · In Python",
    "title": "One customer, four trees",
    "blocks": [
     {
      "kind": "code",
      "caption": "Leaf probabilities under different settings",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\n\nrng = np.random.default_rng(4)\nn = 400\ntenure = rng.uniform(1, 48, n)\ncalls = rng.poisson(2, n)\np_leave = 1 / (1 + np.exp(-(1.2 - 0.09 * tenure + 0.45 * calls)))\ny = (rng.random(n) < p_leave).astype(int)\nX = np.column_stack([tenure, calls])\n\nnew = np.array([[10.0, 3]])\nfor depth, leaf in [(1, 1), (3, 1), (None, 1), (None, 25)]:\n    t = DecisionTreeClassifier(max_depth=depth, min_samples_leaf=leaf, random_state=0).fit(X, y)\n    print(\"depth\", depth, \"min leaf\", leaf, \"leaves\", t.get_n_leaves(), \"P(leave) for the new customer\", round(t.predict_proba(new)[0, 1], 3))",
      "output": "depth 1 min leaf 1 leaves 2 P(leave) for the new customer 0.641\ndepth 3 min leaf 1 leaves 8 P(leave) for the new customer 0.784\ndepth None min leaf 1 leaves 143 P(leave) for the new customer 1.0\ndepth None min leaf 25 leaves 13 P(leave) for the new customer 0.889"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A leaf's probability is its share. Insist on enough customers per leaf before trusting it."
     }
    ]
   }
  ]
 },
 {
  "title": "Depth, noise and why trees wobble",
  "minutes": 13,
  "sections": [
   {
    "id": "dt4-observe",
    "kicker": "1 · Observe",
    "title": "The tree that remembered the noise",
    "blocks": [
     {
      "kind": "p",
      "text": "Give a tree no limits and it keeps splitting until every leaf is pure. On the training data it is perfect. Then new customers arrive and it performs far worse. It has not learned the pattern, it has memorised the examples, including every unlucky coincidence."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How deep should a tree grow, and why do small changes in the data change the tree?"
     }
    ]
   },
   {
    "id": "dt4-express",
    "kicker": "2 · Express",
    "title": "Depth is a dial on flexibility",
    "blocks": [
     {
      "kind": "p",
      "text": "Each level of depth lets the tree ask one more question along a path, doubling the number of possible leaves. Depth 1 has two leaves, depth 3 up to eight, depth 10 up to a thousand. The more leaves, the finer the staircase can follow the data, noise included."
     },
     {
      "kind": "eq",
      "lines": [
       "maximum leaves = 2^depth"
      ],
      "note": "More leaves means more flexibility, and as in the bias and variance bridge, more ways to fit noise."
     }
    ]
   },
   {
    "id": "dt4-visualize",
    "kicker": "3 · Visualize",
    "title": "Training error falls, validation error turns",
    "blocks": [
     {
      "kind": "table",
      "caption": "Squared error by depth (100 training, 100 validation points)",
      "headers": [
       "Depth",
       "Training MSE",
       "Validation MSE"
      ],
      "rows": [
       [
        "1",
        "2.31",
        "2.98"
       ],
       [
        "2",
        "1.60",
        "2.41"
       ],
       [
        "3",
        "1.12",
        "1.51"
       ],
       [
        "4",
        "0.71",
        "1.22"
       ],
       [
        "6",
        "0.33",
        "1.42"
       ],
       [
        "10",
        "0.02",
        "1.60"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Training error keeps falling, to 0.02 at depth 10, which is memory. Validation error falls to 1.22 at depth 4, then rises again to 1.60. The best depth is where validation error bottoms out. Drag depth in the playground and watch the two curves cross over."
     }
    ]
   },
   {
    "id": "dt4-discover",
    "kicker": "4 · Discover",
    "title": "Small changes, different trees",
    "blocks": [
     {
      "kind": "p",
      "text": "There is a second problem. Trees are unstable. Draw eight resamples from the same data, with two columns carrying almost the same information. The first question is “x ≤ 6.3” in most resamples, but one resample asks “z ≤ 6.3” instead, a different column. Because the choice of first question steers everything below it, a small change in data can rebuild the whole tree."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Depth is the dial between too simple and memorising, and trees are unstable because each question is chosen greedily and shapes all the questions beneath it."
     },
     {
      "kind": "p",
      "text": "Averaging many trees, as random forests do, turns this instability into a strength."
     }
    ]
   },
   {
    "id": "dt4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, choosing depth. Validation MSE is lowest at depth 4 (1.22). Depth 3 is close (1.51) and simpler. With 100 validation points a gap of 0.3 may be noise. Prefer depth 3 or 4, and confirm with cross-validation."
     },
     {
      "kind": "p",
      "text": "Example 2, explaining a change. A manager notices the retention tree this month asks about support calls first, while last month it asked about tenure. The data barely changed. Because the two columns are related, either can win at the top. That is the instability, and a reason not to over-interpret one tree."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every tree model and ensemble: depth, leaf size and the number of trees are the main dials."
     },
     {
      "kind": "check",
      "question": "Training error is near zero and validation error is much higher. What does that suggest?",
      "options": [
       "The tree is too deep and has memorised noise",
       "The tree is too shallow",
       "The data is perfect"
      ],
      "answer": 0,
      "why": "A big gap between training and validation error is the mark of overfitting. Limit depth or leaf size."
     }
    ]
   },
   {
    "id": "dt4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Choosing depth on training error",
      "text": "It always prefers the deepest tree. Use validation data or cross-validation."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Believing one tree's structure",
      "text": "Another sample could build a different tree with equal accuracy. Treat the structure as one reasonable answer."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Ignoring leaf size",
      "text": "Depth alone does not stop tiny leaves on one branch. Set a minimum leaf size too."
     }
    ]
   },
   {
    "id": "dt4-python",
    "kicker": "7 · In Python",
    "title": "Depth sweep and unstable tops",
    "blocks": [
     {
      "kind": "code",
      "caption": "Training versus validation error by depth, and top splits on resamples",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeRegressor\nfrom sklearn.metrics import mean_squared_error\n\nrng = np.random.default_rng(9)\nx = np.sort(rng.uniform(0, 10, 200))\ny = 3 * np.sin(x) + 0.1 * x ** 2 + rng.normal(0, 1.0, 200)\nidx = rng.permutation(200)\ntr, va = idx[:100], idx[100:]\n\nfor depth in [1, 2, 3, 4, 6, 10]:\n    t = DecisionTreeRegressor(max_depth=depth, random_state=0).fit(x[tr].reshape(-1, 1), y[tr])\n    print(\"depth\", depth, \"train MSE\", round(mean_squared_error(y[tr], t.predict(x[tr].reshape(-1, 1))), 2), \"valid MSE\", round(mean_squared_error(y[va], t.predict(x[va].reshape(-1, 1))), 2))\n\n# two columns that say almost the same thing: which one does the top split choose?\nz = x + rng.normal(0, 0.4, 200)\nboth = np.column_stack([x, z])\nnames = [\"x\", \"z\"]\npicks = []\nfor seed in range(8):\n    r = np.random.default_rng(seed).choice(tr, len(tr), replace=True)\n    t = DecisionTreeRegressor(max_depth=3, random_state=0).fit(both[r], y[r])\n    picks.append(f\"{names[t.tree_.feature[0]]}<={t.tree_.threshold[0]:.1f}\")\nprint(\"top split on 8 resamples:\", picks)",
      "output": "depth 1 train MSE 2.31 valid MSE 2.98\ndepth 2 train MSE 1.6 valid MSE 2.41\ndepth 3 train MSE 1.12 valid MSE 1.51\ndepth 4 train MSE 0.71 valid MSE 1.22\ndepth 6 train MSE 0.33 valid MSE 1.42\ndepth 10 train MSE 0.02 valid MSE 1.6\ntop split on 8 resamples: ['x<=6.3', 'x<=6.4', 'x<=6.4', 'x<=6.3', 'z<=6.3', 'x<=6.3', 'x<=6.4', 'x<=6.3']"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Deeper trees always fit training data better. Pick depth from validation error, and do not over-read one tree's structure."
     }
    ]
   }
  ]
 },
 {
  "title": "A safe tree workflow",
  "minutes": 13,
  "sections": [
   {
    "id": "dt5-observe",
    "kicker": "1 · Observe",
    "title": "An unlimited tree scores a perfect 1.0 on training data",
    "blocks": [
     {
      "kind": "p",
      "text": "Fit a tree with no limits to 1,125 customers. On the training data its ranking quality (AUC) is a perfect 1.0. On customers it has never seen, 0.61. Anyone who reported the 1.0 would be fooling themselves. The workflow around a tree decides whether the number you report is real."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do you choose a tree's settings and report its performance honestly?"
     }
    ]
   },
   {
    "id": "dt5-express",
    "kicker": "2 · Express",
    "title": "Settings and a search",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split off a stratified test set and put it away.",
       "Choose the limits on the development data by cross-validation: depth and minimum leaf size.",
       "Score with a metric that matches the decision, such as AUC or log loss, not training accuracy.",
       "Refit on all the development data, then evaluate on the test set once.",
       "Report against a simple baseline."
      ]
     },
     {
      "kind": "p",
      "text": "Trees do not need scaled columns, because each question looks at one column at a time, so scaling does not change which cut-off is best. Everything else about leakage still applies: fit any preparation inside each fold."
     }
    ]
   },
   {
    "id": "dt5-visualize",
    "kicker": "3 · Visualize",
    "title": "Reading the result",
    "blocks": [
     {
      "kind": "table",
      "caption": "1,500 simulated customers, 1,125 for development, 375 for the test",
      "headers": [
       "Model",
       "Training AUC",
       "Test AUC"
      ],
      "rows": [
       [
        "Unlimited tree",
        "1.000",
        "0.608"
       ],
       [
        "Cross-validated: depth 6, at least 30 per leaf",
        "–",
        "0.754"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Cross-validation searched 18 combinations and chose depth 6 with at least 30 customers per leaf, with a cross-validated AUC of 0.758. On the test set it scored 0.754, very close to the cross-validated estimate, which is a sign the process is honest. The unlimited tree's test score of 0.608 is what the perfect 1.0 really meant."
     }
    ]
   },
   {
    "id": "dt5-discover",
    "kicker": "4 · Discover",
    "title": "The gap tells you what went wrong",
    "blocks": [
     {
      "kind": "p",
      "text": "Compare three numbers: the training score, the cross-validated score and the test score. Training far above the others means memorisation. Cross-validated close to test means the search did not overfit. All three low means the model is too simple or the data lacks signal."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Limit the tree with cross-validation on development data, test once, and trust the test score, not the training score."
     },
     {
      "kind": "p",
      "text": "With 18 settings tried, some of the cross-validated score is the winner's optimism. When the cross-validated and test scores agree, as here, that optimism is small."
     }
    ]
   },
   {
    "id": "dt5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, minimum leaf size. Setting at least 30 customers per leaf means each probability rests on 30 or more cases, and no leaf can memorise a single customer. It trades some training fit for stability, usually a good deal."
     },
     {
      "kind": "p",
      "text": "Example 2, pruning instead of limiting. Another approach grows a large tree, then cuts back branches whose improvement is not worth their complexity (cost-complexity pruning, ccp_alpha). The strength of the cut is chosen by cross-validation, just like depth."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every deployed tree and every ensemble of trees. The same workflow applies to forests and boosting."
     },
     {
      "kind": "check",
      "question": "Training AUC is 1.0 and test AUC is 0.61. What do you report as the model's performance?",
      "options": [
       "0.61, from the untouched test set",
       "1.0, the training score",
       "The average, 0.8"
      ],
      "answer": 0,
      "why": "Only data the model never saw gives an honest estimate. The training score measures memory."
     }
    ]
   },
   {
    "id": "dt5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reporting training or cross-validated scores as final",
      "text": "Only the untouched test set gives the final number."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Searching a huge grid on a small dataset",
      "text": "With many combinations on few rows, the winner's score is optimistic. Keep the grid sensible."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Leaky features",
      "text": "A column that is only known after the outcome, such as a cancellation date, makes any tree look brilliant and fail in production."
     }
    ]
   },
   {
    "id": "dt5-python",
    "kicker": "7 · In Python",
    "title": "Searching depth and leaf size",
    "blocks": [
     {
      "kind": "code",
      "caption": "Cross-validated tree versus an unlimited tree",
      "code": "import numpy as np\nfrom sklearn.model_selection import GridSearchCV, train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import roc_auc_score\n\nrng = np.random.default_rng(21)\nn = 1500\ntenure = rng.uniform(1, 60, n)\nbill = rng.uniform(200, 2000, n)\ncalls = rng.poisson(2, n)\nrisk = 0.8 - 0.05 * tenure + 0.0012 * (bill - 900) + 0.5 * (calls - 2)\ny = (rng.random(n) < 1 / (1 + np.exp(-risk))).astype(int)\nX = np.column_stack([tenure, bill, calls])\n\nX_dev, X_test, y_dev, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\ngrid = {\"max_depth\": [2, 3, 4, 6, 10, None], \"min_samples_leaf\": [1, 10, 30]}\nsearch = GridSearchCV(DecisionTreeClassifier(random_state=0), grid, cv=5, scoring=\"roc_auc\").fit(X_dev, y_dev)\nprint(\"chosen:\", search.best_params_, \"cv AUC\", round(search.best_score_, 3))\n\nunlimited = DecisionTreeClassifier(random_state=0).fit(X_dev, y_dev)\nprint(\"unlimited tree: train AUC\", round(roc_auc_score(y_dev, unlimited.predict_proba(X_dev)[:, 1]), 3), \"test AUC\", round(roc_auc_score(y_test, unlimited.predict_proba(X_test)[:, 1]), 3))\nprint(\"chosen tree   : test AUC\", round(roc_auc_score(y_test, search.predict_proba(X_test)[:, 1]), 3))",
      "output": "chosen: {'max_depth': 6, 'min_samples_leaf': 30} cv AUC 0.758\nunlimited tree: train AUC 1.0 test AUC 0.608\nchosen tree   : test AUC 0.754"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Limit the tree by cross-validation, test once, and expect the unlimited tree's training score to be meaningless."
     }
    ]
   }
  ]
 },
 {
  "title": "Reading the rules, and where trees fail",
  "minutes": 13,
  "sections": [
   {
    "id": "dt6-observe",
    "kicker": "1 · Observe",
    "title": "A model you can print",
    "blocks": [
     {
      "kind": "p",
      "text": "A tree can be printed as plain rules. “If tenure is under 8 months, call. Otherwise, if monthly bill is above ₹1,500 and there were support calls, call.” A manager can follow, audit and argue with those rules. That is a rare advantage. But trees have their own blind spots, and a model you can read is not automatically a model you can trust."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What can a tree explain well, and what shapes or situations defeat it?"
     }
    ]
   },
   {
    "id": "dt6-express",
    "kicker": "2 · Express",
    "title": "Each leaf is a rule",
    "blocks": [
     {
      "kind": "p",
      "text": "Follow a path from the top of the tree to a leaf and join the questions with “and”. That is one rule. A tree with six leaves is six rules, one for each group of customers, and every customer falls under exactly one rule."
     },
     {
      "kind": "eq",
      "lines": [
       "if x1 ≤ 0.17 and x2 ≤ 0.40  →  class 0",
       "if x1 ≤ 0.17 and x2 > 0.40   →  class 1",
       "if x1 > 0.17 and x2 ≤ −1.02  →  class 0",
       "if x1 > 0.17 and x2 > −1.02  →  class 1"
      ],
      "note": "The depth-2 tree printed for a diagonal boundary, rewritten as rules."
     }
    ]
   },
   {
    "id": "dt6-visualize",
    "kicker": "3 · Visualize",
    "title": "Diagonal boundaries need many steps",
    "blocks": [
     {
      "kind": "p",
      "text": "Trees ask about one column at a time, so every boundary they draw is horizontal or vertical. Suppose the true rule is a diagonal: class 1 when x1 + x2 > 0. Logistic regression draws a diagonal line and gets it almost exactly right. A tree has to build a staircase."
     },
     {
      "kind": "table",
      "caption": "Accuracy on a diagonal boundary (300 held-out points)",
      "headers": [
       "Model",
       "Accuracy"
      ],
      "rows": [
       [
        "Logistic regression",
        "0.997"
       ],
       [
        "Tree, depth 1",
        "0.757"
       ],
       [
        "Tree, depth 2",
        "0.840"
       ],
       [
        "Tree, depth 4",
        "0.967"
       ],
       [
        "Tree, depth 8",
        "0.970"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The tree needs four levels to approach what a single line does. It can approximate a diagonal, but with a stair-stepped edge and many more rules, which makes it harder to explain, not easier."
     }
    ]
   },
   {
    "id": "dt6-discover",
    "kicker": "4 · Discover",
    "title": "Trees cannot go beyond what they have seen",
    "blocks": [
     {
      "kind": "p",
      "text": "A regression tree predicts a leaf's average, so its predictions can never exceed the highest value among its leaves. Fit the eight flats and ask for a 110, 150 and 300 sq m flat. The answers are ₹84, ₹84 and ₹84 lakh. A line or curve would extrapolate. A tree stays flat beyond the data."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Trees give readable rules and handle jumps and interactions, but they stair-step diagonals and cannot extrapolate beyond the data."
     },
     {
      "kind": "p",
      "text": "Use a tree inside the range you trained on, and check when new inputs fall outside it."
     }
    ]
   },
   {
    "id": "dt6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a hybrid. A lender uses logistic regression for the smooth effect of income and a tree for the sharp business rules, such as “fewer than 3 months of history”. Each model does what it does best."
     },
     {
      "kind": "p",
      "text": "Example 2, a sanity rule. Before showing a price from a tree, check that the flat's area lies inside the training range. If not, flag it or fall back to a simple regression. It costs one line of code."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Compliance and audit contexts where rules must be shown. Ensembles of trees such as random forests and gradient boosting build on the same pieces."
     },
     {
      "kind": "check",
      "question": "A tree trained on flats up to 110 sq m is asked about a 300 sq m flat. What does it predict?",
      "options": [
       "The same value as for its largest leaf",
       "A much larger price, by extrapolation",
       "An error"
      ],
      "answer": 0,
      "why": "A tree's prediction is a leaf average, so beyond the data it repeats the last leaf's value."
     }
    ]
   },
   {
    "id": "dt6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Assuming readable means correct",
      "text": "A neat set of rules can still be wrong or unstable. Validate it like any model."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Using a tree for a smooth diagonal effect",
      "text": "You get a ragged staircase and lose accuracy. Add a combined column or use a linear model."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Extrapolating",
      "text": "Trees repeat their edge values. Guard inputs outside the training range."
     }
    ]
   },
   {
    "id": "dt6-python",
    "kicker": "7 · In Python",
    "title": "A diagonal, a staircase, a flat tail",
    "blocks": [
     {
      "kind": "code",
      "caption": "Trees versus a line on a diagonal boundary, and the extrapolation limit",
      "code": "import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor, export_text\nfrom sklearn.linear_model import LogisticRegression\n\nrng = np.random.default_rng(0)\nX = rng.normal(size=(800, 2))\ny = (X[:, 0] + X[:, 1] > 0).astype(int)           # a diagonal boundary\ntr, te = slice(0, 500), slice(500, None)\nprint(\"logistic accuracy:\", round(LogisticRegression().fit(X[tr], y[tr]).score(X[te], y[te]), 3))\nfor d in [1, 2, 4, 8]:\n    print(\"tree depth\", d, \"accuracy:\", round(DecisionTreeClassifier(max_depth=d, random_state=0).fit(X[tr], y[tr]).score(X[te], y[te]), 3))\n\narea = np.array([40, 50, 60, 70, 80, 90, 100, 110], float).reshape(-1, 1)\nprice = np.array([30, 34, 36, 52, 55, 58, 80, 84], float)\nt = DecisionTreeRegressor(max_depth=3).fit(area, price)\nprint(\"tree price at 110, 150, 300 sq m:\", t.predict([[110], [150], [300]]))\nprint(export_text(DecisionTreeClassifier(max_depth=2, random_state=0).fit(X[tr], y[tr]), feature_names=[\"x1\", \"x2\"]))",
      "output": "logistic accuracy: 0.997\ntree depth 1 accuracy: 0.757\ntree depth 2 accuracy: 0.84\ntree depth 4 accuracy: 0.967\ntree depth 8 accuracy: 0.97\ntree price at 110, 150, 300 sq m: [84. 84. 84.]\n|--- x1 <= 0.17\n|   |--- x2 <= 0.40\n|   |   |--- class: 0\n|   |--- x2 >  0.40\n|   |   |--- class: 1\n|--- x1 >  0.17\n|   |--- x2 <= -1.02\n|   |   |--- class: 0\n|   |--- x2 >  -1.02\n|   |   |--- class: 1"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Trees give readable rules, handle sharp changes and interactions, and fail on diagonals and beyond the data."
     }
    ]
   }
  ]
 }
];
