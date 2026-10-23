import type {DeepLesson} from "../teaching/deep-read";
/** Bridge lessons that close the Math → ML gaps: gradients, the normal curve, least squares and likelihood. Keyed by the /math/foundations/<key> route. */
export const FOUNDATION_LESSONS:Record<string,DeepLesson>={
 "gradients": {
  "title": "Partial derivatives and the gradient: slopes in many directions",
  "minutes": 16,
  "sections": [
   {
    "id": "mgr-why",
    "kicker": "1 · Why machine learning needs it",
    "title": "The weights are many, so the slope is many",
    "blocks": [
     {
      "kind": "p",
      "text": "In Calculus you learned the slope of a loss when one number changes. A real model has dozens or millions of weights, and the loss depends on all of them at once. To learn, we need to know how the loss moves when each single weight is nudged. That list of slopes, one per weight, is the gradient."
     },
     {
      "kind": "table",
      "caption": "From one slope to a gradient",
      "headers": [
       "Idea",
       "What it answers",
       "Where it appears"
      ],
      "rows": [
       [
        "Derivative",
        "How fast does the loss change if this one number moves?",
        "Linear regression with one input"
       ],
       [
        "Partial derivative",
        "The same, holding every other weight fixed",
        "Any model with several weights"
       ],
       [
        "Gradient",
        "All the partial derivatives together, as a vector",
        "Every gradient-descent step"
       ],
       [
        "Chain rule",
        "How a change passes through layers",
        "Backpropagation in neural networks"
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this lesson answers",
      "text": "How do I get a slope for every weight at once, why does the gradient point uphill, and how does the chain rule let that work through layers?"
     }
    ]
   },
   {
    "id": "mgr-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "A partial derivative is a normal derivative taken while every other weight is frozen. Picture slicing the loss surface along one axis: you get an ordinary curve, and the partial derivative is the slope of its tangent. Put the slopes for every axis together and you have the gradient, which points in the steepest uphill direction. Stepping the opposite way is gradient descent."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "The partial derivative is the slope along one weight",
       "alt": "Loss as the first weight changes while the second stays at zero. The curve is a bowl with its lowest point near 15. A straight tangent line at weight zero slopes steeply downward, with slope about -29.7, which is the partial derivative there.",
       "xLabel": "Weight on area (w₁)",
       "yLabel": "Loss",
       "series": [
        {
         "name": "Loss, w₂ held at 0",
         "style": "line",
         "pts": [
          [
           -2.0,
           328.396
          ],
          [
           -1.5,
           311.781
          ],
          [
           -1.0,
           295.666
          ],
          [
           -0.5,
           280.051
          ],
          [
           0.0,
           264.936
          ],
          [
           0.5,
           250.321
          ],
          [
           1.0,
           236.206
          ],
          [
           1.5,
           222.591
          ],
          [
           2.0,
           209.476
          ],
          [
           2.5,
           196.861
          ],
          [
           3.0,
           184.746
          ],
          [
           3.5,
           173.131
          ],
          [
           4.0,
           162.016
          ],
          [
           4.5,
           151.401
          ],
          [
           5.0,
           141.286
          ],
          [
           5.5,
           131.671
          ],
          [
           6.0,
           122.556
          ],
          [
           6.5,
           113.941
          ],
          [
           7.0,
           105.826
          ],
          [
           7.5,
           98.211
          ],
          [
           8.0,
           91.096
          ],
          [
           8.5,
           84.481
          ],
          [
           9.0,
           78.366
          ],
          [
           9.5,
           72.751
          ],
          [
           10.0,
           67.637
          ],
          [
           10.5,
           63.022
          ],
          [
           11.0,
           58.907
          ],
          [
           11.5,
           55.292
          ],
          [
           12.0,
           52.177
          ],
          [
           12.5,
           49.562
          ],
          [
           13.0,
           47.447
          ],
          [
           13.5,
           45.832
          ],
          [
           14.0,
           44.717
          ],
          [
           14.5,
           44.102
          ],
          [
           15.0,
           43.987
          ],
          [
           15.5,
           44.372
          ],
          [
           16.0,
           45.257
          ],
          [
           16.5,
           46.642
          ],
          [
           17.0,
           48.527
          ],
          [
           17.5,
           50.912
          ],
          [
           18.0,
           53.797
          ]
         ]
        },
        {
         "name": "Tangent at w₁ = 0 (slope −29.7)",
         "style": "line",
         "dash": true,
         "pts": [
          [
           -1.0,
           294.666
          ],
          [
           6.0,
           86.556
          ]
         ]
        }
       ],
       "yDomain": [
        0,
        164.19787461180817
       ],
       "xDomain": [
        -2,
        18
       ]
      }
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Walking downhill in two weights",
       "alt": "The path of gradient descent through weight space, starting at (0, 0). It moves right and down, quickly at first, and settles near (15, -6.1).",
       "xLabel": "w₁ (area)",
       "yLabel": "w₂ (age)",
       "series": [
        {
         "name": "Gradient descent path",
         "style": "line",
         "pts": [
          [
           0.0,
           0.0
          ],
          [
           2.973,
           -1.161
          ],
          [
           5.356,
           -2.101
          ],
          [
           7.266,
           -2.864
          ],
          [
           8.798,
           -3.481
          ],
          [
           10.025,
           -3.982
          ],
          [
           11.01,
           -4.387
          ],
          [
           11.799,
           -4.715
          ],
          [
           12.431,
           -4.981
          ],
          [
           12.938,
           -5.196
          ],
          [
           13.345,
           -5.371
          ],
          [
           13.671,
           -5.512
          ],
          [
           13.932,
           -5.626
          ],
          [
           14.142,
           -5.718
          ],
          [
           14.31,
           -5.793
          ],
          [
           14.444,
           -5.854
          ],
          [
           14.552,
           -5.903
          ],
          [
           14.639,
           -5.942
          ],
          [
           14.708,
           -5.974
          ],
          [
           14.764,
           -6.0
          ],
          [
           14.809,
           -6.021
          ],
          [
           14.845,
           -6.038
          ],
          [
           14.873,
           -6.052
          ],
          [
           14.896,
           -6.063
          ],
          [
           14.915,
           -6.072
          ],
          [
           14.93,
           -6.079
          ],
          [
           14.942,
           -6.085
          ],
          [
           14.951,
           -6.09
          ],
          [
           14.959,
           -6.093
          ],
          [
           14.965,
           -6.097
          ],
          [
           14.97,
           -6.099
          ],
          [
           14.974,
           -6.101
          ],
          [
           14.977,
           -6.103
          ],
          [
           14.979,
           -6.104
          ],
          [
           14.981,
           -6.105
          ],
          [
           14.983,
           -6.106
          ],
          [
           14.984,
           -6.107
          ],
          [
           14.985,
           -6.107
          ],
          [
           14.986,
           -6.108
          ],
          [
           14.987,
           -6.108
          ],
          [
           14.987,
           -6.108
          ],
          [
           14.988,
           -6.108
          ],
          [
           14.988,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.989,
           -6.109
          ],
          [
           14.99,
           -6.109
          ],
          [
           14.99,
           -6.109
          ],
          [
           14.99,
           -6.109
          ],
          [
           14.99,
           -6.109
          ],
          [
           14.99,
           -6.109
          ],
          [
           14.99,
           -6.109
          ],
          [
           14.99,
           -6.109
          ],
          [
           14.99,
           -6.109
          ]
         ]
        },
        {
         "name": "Start",
         "style": "points",
         "pts": [
          [
           0.0,
           0.0
          ]
         ]
        },
        {
         "name": "End",
         "style": "points",
         "pts": [
          [
           14.99,
           -6.109
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "gradient = [ ∂L/∂w₁ , ∂L/∂w₂ , … ]",
       "update:  w ← w − learning rate × gradient",
       "chain rule:  dL/dw = (dL/dp) × (dp/ds) × (ds/dw)"
      ],
      "note": "The symbol ∂ ('partial') just means: differentiate with respect to this variable and treat the others as constants."
     }
    ]
   },
   {
    "id": "mgr-hand",
    "kicker": "3 · Work it by hand",
    "title": "Work it by hand",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Write the loss for two weights: the average of (w₁ · area + w₂ · age − price)².",
       "Differentiate with respect to w₁ only, treating w₂ as a constant: ∂L/∂w₁ = 2 × average of (miss × area).",
       "Do the same for w₂: ∂L/∂w₂ = 2 × average of (miss × age).",
       "Check both against a numerical nudge: change a weight by 0.000001 and see how the loss moves.",
       "Step both weights opposite their partial derivatives."
      ]
     },
     {
      "kind": "code",
      "caption": "Two partial derivatives, checked by nudging, then used to walk downhill",
      "code": "import numpy as np\n\nrng = np.random.default_rng(1)\narea = rng.uniform(40, 120, 50); age = rng.uniform(0, 20, 50)\nprice = 0.7 * area - 0.9 * age + 8 + rng.normal(0, 3, 50)\na = (area - area.mean()) / area.std(); g = (age - age.mean()) / age.std(); t = price - price.mean()\n\ndef loss(w1, w2):                       # average squared miss for price = w1*area + w2*age (both standardised)\n    return float(np.mean((w1 * a + w2 * g - t) ** 2))\n\ndef partials(w1, w2):                   # the two partial derivatives, worked out by hand\n    miss = w1 * a + w2 * g - t\n    return float(2 * np.mean(miss * a)), float(2 * np.mean(miss * g))\n\nw1, w2 = 0.0, 0.0\nd1, d2 = partials(w1, w2)\nh = 1e-6                                # a tiny nudge, one weight at a time\nn1 = (loss(w1 + h, w2) - loss(w1 - h, w2)) / (2 * h)\nn2 = (loss(w1, w2 + h) - loss(w1, w2 - h)) / (2 * h)\nprint(\"analytic partials:\", round(d1, 4), round(d2, 4), \"| nudged numerically:\", round(n1, 4), round(n2, 4))\nprint(\"gradient vector at the start:\", np.round([d1, d2], 3), \"| length\", round(float(np.hypot(d1, d2)), 3))\nfor step in range(1, 61):\n    d1, d2 = partials(w1, w2)\n    w1 -= 0.1 * d1; w2 -= 0.1 * d2\n    if step in (1, 5, 20, 60):\n        print(f\"step {step:2d}: weights ({w1:6.3f}, {w2:6.3f})  loss {loss(w1, w2):.3f}\")",
      "output": "analytic partials: -29.7299 11.6072 | nudged numerically: -29.7299 11.6072\ngradient vector at the start: [-29.73   11.607] | length 31.915\nstep  1: weights ( 2.973, -1.161)  loss 173.121\nstep  5: weights (10.025, -3.982)  loss 35.397\nstep 20: weights (14.809, -6.021)  loss 6.698\nstep 60: weights (14.990, -6.109)  loss 6.658"
     },
     {
      "kind": "p",
      "text": "At the starting point the slopes are −29.73 and 11.61, and nudging gives the same numbers to four decimals. Negative means 'increase this weight to reduce the loss', so the first weight rises and the second falls. The loss drops quickly in the first steps and flattens by step 20, which is why the later steps change so little."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Every number in the gradient says, for one weight: which way to push it, and how hard. Checking against a nudge is the universal test for a gradient you wrote yourself."
     }
    ]
   },
   {
    "id": "mgr-python",
    "kicker": "4 · In Python",
    "title": "In Python",
    "blocks": [
     {
      "kind": "p",
      "text": "Neural networks apply the chain rule through every layer. For one neuron whose output is a probability p = sigmoid(w·x + b), and whose loss is −ln p, the derivative multiplies three small pieces together."
     },
     {
      "kind": "code",
      "caption": "The chain rule on one neuron, against a numerical check",
      "code": "import numpy as np\n\n# one neuron, one example: x = 2, truth = 1. p = sigmoid(w*x + b), loss = -ln p\nx, truth, w, b = 2.0, 1.0, 0.3, -0.5\nsigmoid = lambda s: 1 / (1 + np.exp(-s))\ndef forward(w, b):\n    s = w * x + b; p = sigmoid(s); return s, p, -np.log(p if truth == 1 else 1 - p)\ns, p, L = forward(w, b)\n# chain rule: dL/dw = dL/dp * dp/ds * ds/dw\ndL_dp = -1 / p\ndp_ds = p * (1 - p)\nds_dw = x\nprint(\"pieces:\", round(float(dL_dp), 4), \"x\", round(float(dp_ds), 4), \"x\", ds_dw)\nprint(\"chain rule dL/dw:\", round(float(dL_dp * dp_ds * ds_dw), 5))\nh = 1e-6\nprint(\"numerical dL/dw: \", round((forward(w + h, b)[2] - forward(w - h, b)[2]) / (2 * h), 5))\nprint(\"simplified form (p - truth) * x:\", round(float((p - truth) * x), 5))",
      "output": "pieces: -1.9048 x 0.2494 x 2.0\nchain rule dL/dw: -0.95004\nnumerical dL/dw:  -0.95004\nsimplified form (p - truth) * x: -0.95004"
     },
     {
      "kind": "p",
      "text": "The three pieces multiply to −0.95004, the numerical estimate agrees to five decimals, and the neat shortcut (p − truth) × x gives the same number. That shortcut is why logistic regression and neural-network output layers are so easy to train."
     },
     {
      "kind": "p",
      "text": "One more property worth seeing for yourself: among all directions you could step, the gradient is the one in which the loss rises fastest."
     },
     {
      "kind": "code",
      "caption": "Search 72 headings for the steepest rise",
      "code": "import numpy as np\n\nrng = np.random.default_rng(1)\na = rng.normal(size=60); g = rng.normal(size=60) * 0.5\nt = 2.0 * a - 1.0 * g + rng.normal(0, 0.3, 60)\nloss = lambda w: float(np.mean((w[0] * a + w[1] * g - t) ** 2))\ndef grad(w):\n    miss = w[0] * a + w[1] * g - t\n    return np.array([2 * np.mean(miss * a), 2 * np.mean(miss * g)])\nw = np.array([0.0, 0.0]); gr = grad(w); u = gr / np.linalg.norm(gr)\nbest = None\nfor deg in range(0, 360, 5):\n    d = np.array([np.cos(np.radians(deg)), np.sin(np.radians(deg))])\n    rise = loss(w + 1e-3 * d) - loss(w)\n    best = (rise, deg) if best is None or rise > best[0] else best\nprint(\"direction of steepest rise (searched over 72 headings):\", best[1], \"degrees\")\nprint(\"direction of the gradient:\", round(float(np.degrees(np.arctan2(u[1], u[0])) % 360)), \"degrees\")\ndown = [loss(w - s * gr) for s in [0.01, 0.1, 0.3, 0.45, 0.6]]\nprint(\"loss after one step of size s down the gradient:\", np.round(down, 3).tolist())",
      "output": "direction of steepest rise (searched over 72 headings): 170 degrees\ndirection of the gradient: 172 degrees\nloss after one step of size s down the gradient: [3.162, 2.402, 1.109, 0.499, 0.197]"
     },
     {
      "kind": "p",
      "text": "Searching headings every 5 degrees finds the steepest rise at 170°, and the gradient itself points at 172°, within the grid spacing. After one step down the gradient the loss is 3.162 with a tiny step and 0.197 with a step of 0.6. A step that is too long can overshoot, as you saw in the learning-rate lessons."
     }
    ]
   },
   {
    "id": "mgr-meet",
    "kicker": "5 · Where you will meet it",
    "title": "Where you will meet it",
    "blocks": [
     {
      "kind": "table",
      "caption": "Gradients across the course",
      "headers": [
       "Where",
       "What the gradient does"
      ],
      "rows": [
       [
        "Linear and logistic regression",
        "Gives the update for every coefficient"
       ],
       [
        "Ridge, Lasso, regularisation",
        "Adds a pull toward zero to each partial derivative"
       ],
       [
        "Gradient boosting",
        "Fits each tree to the negative gradient of the loss"
       ],
       [
        "Neural networks",
        "Backpropagation is the chain rule applied layer by layer"
       ],
       [
        "Learning-rate and scaling lessons",
        "Explain why the path zig-zags or crawls"
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Boosting is named for the gradient: each new tree is trained to predict the direction that most reduces the loss, as you saw in the Gradient Boosting playbook."
     }
    ]
   },
   {
    "id": "mgr-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting a hand-derived gradient",
      "text": "Always compare with a numerical nudge on a few weights. An error in one sign trains a model that still runs but learns the wrong thing."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Features on different scales",
      "text": "The partial derivative for a large-unit feature is huge and the others tiny, so the path zig-zags. Scale first."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Stepping too far",
      "text": "The gradient is only the slope at one point. A long step can overshoot and raise the loss."
     }
    ]
   },
   {
    "id": "mgr-check",
    "kicker": "7 · Check yourself",
    "title": "Check yourself",
    "blocks": [
     {
      "kind": "check",
      "question": "At the starting point ∂L/∂w₁ = −29.7 and ∂L/∂w₂ = +11.6. What does one gradient-descent step do?",
      "options": [
       "Raises w₁ and lowers w₂",
       "Lowers both weights",
       "Raises both weights"
      ],
      "answer": 0,
      "why": "Each weight moves opposite the sign of its partial derivative: a negative slope means increase, a positive slope means decrease."
     },
     {
      "kind": "check",
      "question": "Why does the chain rule matter for neural networks?",
      "options": [
       "It makes the loss convex",
       "It lets a slope pass back through each layer by multiplying local slopes",
       "It removes the need for a learning rate"
      ],
      "answer": 1,
      "why": "Each layer contributes one local derivative; multiplying them gives the slope of the loss with respect to an early weight."
     },
     {
      "kind": "p",
      "text": "Next: open the Gradient Boosting and MLP playbooks to see the gradient used in a full training loop."
     }
    ]
   }
  ]
 },
 "normal": {
  "title": "The normal curve and the central limit theorem: why averages behave",
  "minutes": 16,
  "sections": [
   {
    "id": "mnd-why",
    "kicker": "1 · Why machine learning needs it",
    "title": "Why it matters",
    "blocks": [
     {
      "kind": "p",
      "text": "Almost every ML number you report — an average error, an accuracy over test rows, a cross-validated score — is an average of something. The central limit theorem says that averages of many values land in a predictable bell shape, however messy the underlying data is. That is what lets us say 'accuracy 0.85, give or take 0.02' and mean it."
     },
     {
      "kind": "table",
      "caption": "What the bell shape buys you",
      "headers": [
       "Question",
       "Answer from this lesson"
      ],
      "rows": [
       [
        "How far from the truth is my average?",
        "About σ / √n, the standard error"
       ],
       [
        "What counts as an unusual value?",
        "More than 2 to 3 standard deviations from the mean (if bell-shaped)"
       ],
       [
        "How sure am I of a score?",
        "A confidence interval from the standard error"
       ],
       [
        "Is a difference between two models real?",
        "Compare it with the standard error"
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this lesson answers",
      "text": "Why do averages become bell-shaped, how wide is the bell, and what does a '95% interval' actually promise?"
     }
    ]
   },
   {
    "id": "mnd-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Individual delivery times are skewed: many short, a few very long. Draw a sample of 30, average it, and repeat 4,000 times. The averages are not skewed any more: they pile up in a symmetric bell around the true mean. Bigger samples make the bell narrower, by a factor of √n."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Means of 30 skewed values look bell-shaped",
       "alt": "A histogram of 4000 sample means, each from 30 delivery times drawn from a heavily skewed distribution. The bars form a symmetric bell centred near 30 minutes.",
       "xLabel": "Sample mean (minutes)",
       "yLabel": "Count",
       "series": [
        {
         "name": "Sample means (n = 30)",
         "style": "bars",
         "pts": [
          [
           0,
           2
          ],
          [
           1,
           5
          ],
          [
           2,
           49
          ],
          [
           3,
           193
          ],
          [
           4,
           475
          ],
          [
           5,
           793
          ],
          [
           6,
           862
          ],
          [
           7,
           762
          ],
          [
           8,
           462
          ],
          [
           9,
           237
          ],
          [
           10,
           117
          ],
          [
           11,
           33
          ],
          [
           12,
           7
          ],
          [
           13,
           3
          ],
          [
           14,
           0
          ]
         ]
        }
       ],
       "cats": [
        "12",
        "14",
        "18",
        "20",
        "24",
        "26",
        "30",
        "32",
        "36",
        "38",
        "42",
        "44",
        "48",
        "50",
        "54"
       ]
      }
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Averages settle down as the sample grows",
       "alt": "The standard deviation of sample means for samples of 1, 5, 30 and 200 deliveries follows the sigma over square root of n rule: 30.9, 13.0, 5.4 and 2.1 against theory of 30.0, 13.4, 5.5 and 2.1.",
       "xLabel": "Sample size (n)",
       "yLabel": "Std of the sample mean (minutes)",
       "series": [
        {
         "name": "Simulated",
         "style": "points",
         "pts": [
          [
           1.0,
           30.86
          ],
          [
           5.0,
           13.03
          ],
          [
           30.0,
           5.38
          ],
          [
           200.0,
           2.1
          ]
         ]
        },
        {
         "name": "σ / √n",
         "style": "line",
         "pts": [
          [
           1.0,
           30.02
          ],
          [
           4.373,
           14.356
          ],
          [
           7.746,
           10.786
          ],
          [
           11.119,
           9.003
          ],
          [
           14.492,
           7.886
          ],
          [
           17.864,
           7.103
          ],
          [
           21.237,
           6.514
          ],
          [
           24.61,
           6.051
          ],
          [
           27.983,
           5.675
          ],
          [
           31.356,
           5.361
          ],
          [
           34.729,
           5.094
          ],
          [
           38.102,
           4.863
          ],
          [
           41.475,
           4.661
          ],
          [
           44.847,
           4.483
          ],
          [
           48.22,
           4.323
          ],
          [
           51.593,
           4.179
          ],
          [
           54.966,
           4.049
          ],
          [
           58.339,
           3.93
          ],
          [
           61.712,
           3.821
          ],
          [
           65.085,
           3.721
          ],
          [
           68.458,
           3.628
          ],
          [
           71.831,
           3.542
          ],
          [
           75.203,
           3.462
          ],
          [
           78.576,
           3.387
          ],
          [
           81.949,
           3.316
          ],
          [
           85.322,
           3.25
          ],
          [
           88.695,
           3.188
          ],
          [
           92.068,
           3.129
          ],
          [
           95.441,
           3.073
          ],
          [
           98.814,
           3.02
          ],
          [
           102.186,
           2.97
          ],
          [
           105.559,
           2.922
          ],
          [
           108.932,
           2.876
          ],
          [
           112.305,
           2.833
          ],
          [
           115.678,
           2.791
          ],
          [
           119.051,
           2.751
          ],
          [
           122.424,
           2.713
          ],
          [
           125.797,
           2.677
          ],
          [
           129.169,
           2.641
          ],
          [
           132.542,
           2.608
          ],
          [
           135.915,
           2.575
          ],
          [
           139.288,
           2.544
          ],
          [
           142.661,
           2.513
          ],
          [
           146.034,
           2.484
          ],
          [
           149.407,
           2.456
          ],
          [
           152.78,
           2.429
          ],
          [
           156.153,
           2.402
          ],
          [
           159.525,
           2.377
          ],
          [
           162.898,
           2.352
          ],
          [
           166.271,
           2.328
          ],
          [
           169.644,
           2.305
          ],
          [
           173.017,
           2.282
          ],
          [
           176.39,
           2.26
          ],
          [
           179.763,
           2.239
          ],
          [
           183.136,
           2.218
          ],
          [
           186.508,
           2.198
          ],
          [
           189.881,
           2.179
          ],
          [
           193.254,
           2.159
          ],
          [
           196.627,
           2.141
          ],
          [
           200.0,
           2.123
          ]
         ]
        }
       ],
       "xDomain": [
        0,
        205
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "standard error = σ / √n",
       "z = (x − mean) / std",
       "about 68% / 95% / 99.7% within 1 / 2 / 3 std (bell-shaped data)",
       "95% interval ≈ mean ± 1.96 × standard error"
      ],
      "note": "Four times the data halves the uncertainty."
     }
    ]
   },
   {
    "id": "mnd-hand",
    "kicker": "3 · Work it by hand",
    "title": "Work it by hand",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Take a population that is clearly not bell-shaped, such as delivery times.",
       "Draw many samples of one size, and average each.",
       "Measure the spread of those averages and compare with σ / √n.",
       "Repeat for several sample sizes and watch the skew fade."
      ]
     },
     {
      "kind": "code",
      "caption": "Sample means at n = 1, 5, 30, 200",
      "code": "import numpy as np\n\nrng = np.random.default_rng(2)\npop = rng.exponential(30, 100_000)               # delivery times in minutes: heavily skewed\nprint(\"population: mean\", round(float(pop.mean()), 1), \"| std\", round(float(pop.std()), 1), \"| median\", round(float(np.median(pop)), 1))\nprint(\"   n | mean of sample means | std of sample means | sigma / sqrt(n)\")\nfor n in [1, 5, 30, 200]:\n    means = rng.choice(pop, (4000, n)).mean(axis=1)\n    skew = float(np.mean(((means - means.mean()) / means.std()) ** 3))\n    print(f\"{n:4d} | {means.mean():20.1f} | {means.std():19.2f} | {pop.std() / np.sqrt(n):15.2f}   skewness {skew:5.2f}\")",
      "output": "population: mean 30.0 | std 30.0 | median 20.8\n   n | mean of sample means | std of sample means | sigma / sqrt(n)\n   1 |                 30.8 |               30.86 |           30.02   skewness  1.95\n   5 |                 29.6 |               13.03 |           13.42   skewness  0.73\n  30 |                 29.9 |                5.38 |            5.48   skewness  0.31\n 200 |                 30.0 |                2.10 |            2.12   skewness  0.12"
     },
     {
      "kind": "p",
      "text": "The raw data have mean 30, standard deviation 30 and median 20.8, a long right tail. Averages of 1 are as skewed as the data (skewness 1.95). By n = 30 the skew has fallen to 0.31 and by n = 200 to 0.12, and the spread of the means (5.38 and 2.10) matches σ / √n (5.48 and 2.12)."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Averages are calmer than the data they come from. The more you average, the calmer, at a rate of 1 / √n."
     }
    ]
   },
   {
    "id": "mnd-python",
    "kicker": "4 · In Python",
    "title": "In Python",
    "blocks": [
     {
      "kind": "p",
      "text": "Two habits make the bell useful: standardise values into z-scores, and know when the 68-95-99.7 rule applies."
     },
     {
      "kind": "code",
      "caption": "The 68-95-99.7 rule, z-scores, and a skewed counter-example",
      "code": "import numpy as np\n\nrng = np.random.default_rng(3)\nx = rng.normal(100, 15, 200_000)                 # a bell-shaped score: mean 100, std 15\nmu, sd = x.mean(), x.std()\nfor k in [1, 2, 3]:\n    print(f\"within {k} std of the mean: {np.mean(abs(x - mu) < k * sd):.3f}\")\nz = (x - mu) / sd\nprint(\"z-scores have mean\", round(float(z.mean()), 3), \"and std\", round(float(z.std()), 3))\nfor score in [85, 115, 130, 145]:\n    print(f\"score {score}: z = {(score - mu) / sd:5.2f}, share of people scoring lower {np.mean(x < score):.3f}\")\n# the same rule applied to a skewed variable fails\nskew = rng.exponential(30, 200_000)\nprint(\"skewed data, within 2 std:\", round(float(np.mean(abs(skew - skew.mean()) < 2 * skew.std())), 3), \"| below the mean:\", round(float(np.mean(skew < skew.mean())), 3))",
      "output": "within 1 std of the mean: 0.682\nwithin 2 std of the mean: 0.955\nwithin 3 std of the mean: 0.997\nz-scores have mean -0.0 and std 1.0\nscore 85: z = -1.00, share of people scoring lower 0.159\nscore 115: z =  1.00, share of people scoring lower 0.841\nscore 130: z =  2.00, share of people scoring lower 0.978\nscore 145: z =  3.00, share of people scoring lower 0.999\nskewed data, within 2 std: 0.95 | below the mean: 0.632"
     },
     {
      "kind": "p",
      "text": "For bell-shaped scores, 68.2%, 95.5% and 99.7% of people fall within one, two and three standard deviations. A score of 130 is 2 standard deviations above the mean, higher than 97.8% of people. The same rule applied to skewed data breaks: 63.2% sit below the mean, so 'average' is not the middle."
     },
     {
      "kind": "p",
      "text": "Now the confidence interval, and a test of whether the promise holds."
     },
     {
      "kind": "code",
      "caption": "A 95% interval, a bootstrap check, and a coverage experiment",
      "code": "import numpy as np\n\nrng = np.random.default_rng(5)\ntrue_mean = 30.0\npop = rng.exponential(true_mean, 200_000)\nsample = rng.choice(pop, 60)\nm, s = sample.mean(), sample.std(ddof=1)\nse = s / np.sqrt(len(sample))\nprint(f\"one sample of 60: mean {m:.1f}, standard error {se:.2f}, 95% interval {m - 1.96 * se:.1f} to {m + 1.96 * se:.1f}\")\nboot = np.array([rng.choice(sample, len(sample)).mean() for _ in range(3000)])\nprint(\"bootstrap 95% interval:\", np.round(np.percentile(boot, [2.5, 97.5]), 1).tolist())\n\n# does a '95% interval' really catch the truth 95% of the time? repeat the whole study 1000 times\nfor n in [10, 60, 400]:\n    hits = 0\n    for _ in range(1000):\n        sm = rng.choice(pop, n); e = sm.std(ddof=1) / np.sqrt(n)\n        hits += (sm.mean() - 1.96 * e <= pop.mean() <= sm.mean() + 1.96 * e)\n    print(f\"n = {n:3d}: interval caught the true mean in {hits / 10:.1f}% of 1000 repeats\")",
      "output": "one sample of 60: mean 32.1, standard error 3.65, 95% interval 24.9 to 39.3\nbootstrap 95% interval: [25.3, 39.0]\nn =  10: interval caught the true mean in 87.1% of 1000 repeats\nn =  60: interval caught the true mean in 93.6% of 1000 repeats\nn = 400: interval caught the true mean in 94.2% of 1000 repeats"
     },
     {
      "kind": "p",
      "text": "From one sample of 60 the formula gives 24.9 to 39.3 and the bootstrap gives 25.3 to 39.0; they agree. Repeating the whole study 1,000 times shows the real meaning of '95%': with n = 400 the interval caught the true mean in 94.2% of repeats, with n = 60 in 93.6%, but with n = 10 on skewed data only 87.1%. The formula needs enough data."
     }
    ]
   },
   {
    "id": "mnd-meet",
    "kicker": "5 · Where you will meet it",
    "title": "Where you will meet it",
    "blocks": [
     {
      "kind": "table",
      "caption": "The bell across the course",
      "headers": [
       "Where",
       "How"
      ],
      "rows": [
       [
        "Cross-validation and test scores",
        "A mean over folds or rows; the standard error is the 'give or take'"
       ],
       [
        "Comparing two models",
        "A difference smaller than a couple of standard errors may be noise"
       ],
       [
        "Linear regression noise",
        "Errors assumed bell-shaped, which leads to least squares"
       ],
       [
        "Naive Bayes (Gaussian)",
        "Each feature modelled per class by a mean and a variance"
       ],
       [
        "Standardising features",
        "Subtract the mean, divide by the std: a z-score"
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "When the Model Selection lessons say 'a gap smaller than the fold-to-fold spread is not evidence', this lesson is the reason."
     }
    ]
   },
   {
    "id": "mnd-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Applying 68-95-99.7 to skewed data",
      "text": "Incomes, delivery times and prices are skewed. Use percentiles or take logs."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Small samples from skewed data",
      "text": "With n = 10 the '95%' interval caught the truth only 87% of the time."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading the interval as a probability for this one study",
      "text": "The 95% describes the method across many repeats, not this single interval."
     }
    ]
   },
   {
    "id": "mnd-check",
    "kicker": "7 · Check yourself",
    "title": "Check yourself",
    "blocks": [
     {
      "kind": "check",
      "question": "You quadruple the number of test rows. What happens to the standard error of the accuracy?",
      "options": [
       "It halves",
       "It stays the same",
       "It quarters"
      ],
      "answer": 0,
      "why": "The standard error scales with 1 / √n, and √4 = 2."
     },
     {
      "kind": "check",
      "question": "A model's cross-validated accuracies are 0.80 and 0.82 with a standard error of 0.03 each. What can you say?",
      "options": [
       "The second is clearly better",
       "The 0.02 gap is smaller than the uncertainty, so the data cannot separate them",
       "The first is clearly better"
      ],
      "answer": 1,
      "why": "A difference well under one standard error is within noise."
     },
     {
      "kind": "p",
      "text": "Next: the Model Selection lessons and the 'How to choose a model' guide apply this idea to comparing models."
     }
    ]
   }
  ]
 },
 "least-squares": {
  "title": "Least squares: the geometry behind the normal equation",
  "minutes": 16,
  "sections": [
   {
    "id": "mls-why",
    "kicker": "1 · Why machine learning needs it",
    "title": "Why it matters",
    "blocks": [
     {
      "kind": "p",
      "text": "Linear regression, ridge, polynomial regression and the last layer of many models all rest on one idea: choose the weights that make the squared misses smallest. Knowing why the answer is (XᵀX)w = Xᵀy, and why it sometimes goes wrong, lets you trust the solver and debug it when it does."
     },
     {
      "kind": "table",
      "caption": "What this lesson connects",
      "headers": [
       "Course idea",
       "Underlying maths"
      ],
      "rows": [
       [
        "Normal equation in the Linear Regression lesson",
        "Residual perpendicular to every feature column"
       ],
       [
        "Unstable coefficients",
        "A poorly conditioned XᵀX"
       ],
       [
        "Ridge fixes it",
        "Adding λ to the diagonal"
       ],
       [
        "PCA and SVD",
        "The same matrix seen through its singular values"
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this lesson answers",
      "text": "Where does the normal equation come from, why does it fail with near-duplicate columns, and what do ridge and the SVD do about it?"
     }
    ]
   },
   {
    "id": "mls-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Think of the price column as one long arrow in a space with one axis per flat. The feature columns span a flat sheet inside that space. The best fit is the shadow the price arrow casts on the sheet, and the leftover, the residual, is perpendicular to the sheet. 'Perpendicular to every column' is the normal equation."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Least squares: make the vertical misses as small as possible",
       "alt": "Points scatter around a straight fitted line. The line is placed so that the sum of squared vertical gaps is smallest; the gaps above and below balance out.",
       "xLabel": "Area (m²)",
       "yLabel": "Price (₹ lakh)",
       "series": [
        {
         "name": "Flats",
         "style": "points",
         "pts": [
          [
           105.011,
           92.327
          ],
          [
           137.666,
           97.482
          ],
          [
           123.082,
           103.618
          ],
          [
           57.025,
           55.183
          ],
          [
           66.02,
           63.836
          ],
          [
           134.826,
           104.09
          ],
          [
           30.632,
           30.206
          ],
          [
           128.547,
           104.031
          ],
          [
           125.648,
           103.239
          ],
          [
           86.152,
           88.47
          ],
          [
           66.364,
           55.823
          ],
          [
           63.411,
           60.436
          ],
          [
           60.584,
           66.427
          ],
          [
           83.409,
           71.475
          ],
          [
           90.546,
           81.431
          ],
          [
           96.42,
           88.13
          ],
          [
           149.46,
           130.142
          ],
          [
           125.119,
           99.07
          ],
          [
           104.662,
           94.414
          ],
          [
           148.675,
           141.17
          ],
          [
           55.837,
           40.745
          ],
          [
           49.225,
           57.115
          ],
          [
           103.505,
           93.878
          ],
          [
           35.273,
           32.445
          ],
          [
           34.282,
           55.429
          ]
         ]
        },
        {
         "name": "Least-squares line",
         "style": "line",
         "pts": [
          [
           30.0,
           36.422
          ],
          [
           150.0,
           123.764
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "minimise  ‖y − X w‖²",
       "residual r = y − X w  must satisfy  Xᵀ r = 0",
       "so  XᵀX w = Xᵀ y"
      ],
      "note": "The 'normal' in normal equation means perpendicular, not typical."
     }
    ]
   },
   {
    "id": "mls-hand",
    "kicker": "3 · Work it by hand",
    "title": "Work it by hand",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Stack the features in a matrix X with a column of ones.",
       "Solve XᵀX w = Xᵀ y.",
       "Check the residual: multiply Xᵀ by it and confirm every entry is zero.",
       "Compare with two other routes, lstsq and QR, which must agree."
      ]
     },
     {
      "kind": "code",
      "caption": "Three routes to the same weights, and the perpendicularity check",
      "code": "import numpy as np\n\nrng = np.random.default_rng(7)\nn = 80\nX = np.column_stack([np.ones(n), rng.uniform(30, 150, n), rng.uniform(0, 30, n)])\ny = X @ np.array([10.0, 0.8, -0.5]) + rng.normal(0, 5, n)\n\nw_normal = np.linalg.solve(X.T @ X, X.T @ y)                  # the normal equation\nw_lstsq = np.linalg.lstsq(X, y, rcond=None)[0]                # the library's least squares\nQ, R = np.linalg.qr(X); w_qr = np.linalg.solve(R, Q.T @ y)    # the numerically gentler route\nprint(\"normal equation:\", w_normal.round(4), \"| lstsq:\", w_lstsq.round(4), \"| QR:\", w_qr.round(4))\nresid = y - X @ w_normal\nprint(\"residual dotted with each column of X (should be ~0):\", np.round(X.T @ resid, 6))\nprint(\"fitted values and residuals are perpendicular:\", round(float((X @ w_normal) @ resid), 6))\nprint(\"mean squared miss:\", round(float(np.mean(resid ** 2)), 3), \"| any other weights are worse:\",\n      round(float(np.mean((y - X @ (w_normal + [0.1, 0, 0])) ** 2)), 3))",
      "output": "normal equation: [11.3451  0.7865 -0.5332] | lstsq: [11.3451  0.7865 -0.5332] | QR: [11.3451  0.7865 -0.5332]\nresidual dotted with each column of X (should be ~0): [-0.  0. -0.]\nfitted values and residuals are perpendicular: 0.0\nmean squared miss: 21.905 | any other weights are worse: 21.915"
     },
     {
      "kind": "p",
      "text": "All three routes give 11.3451, 0.7865 and −0.5332. The residual dotted with every column of X is zero to six decimals, and the fitted values are perpendicular to it. Moving the intercept by 0.1 makes the mean squared miss slightly worse (21.915 against 21.905), confirming that this is the minimum."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Least squares is a projection. The residual being perpendicular to every feature is the whole story."
     }
    ]
   },
   {
    "id": "mls-python",
    "kicker": "4 · In Python",
    "title": "In Python",
    "blocks": [
     {
      "kind": "p",
      "text": "Solving XᵀX w = Xᵀ y squares the conditioning of the problem. When two columns are near copies the answer exists but wobbles. Watch the weights across resamples of the same process."
     },
     {
      "kind": "code",
      "caption": "Correlated columns, the condition number and ridge",
      "code": "import numpy as np\n\nrng = np.random.default_rng(7)\nn = 80\nbase = rng.normal(size=n)\nprint(\"correlation | condition number | weights on 4 resamples of the same process\")\nfor rho in [0.0, 0.9, 0.999]:\n    c2 = rho * base + np.sqrt(1 - rho ** 2) * rng.normal(size=n)       # a second column correlated with the first\n    X = np.column_stack([base, c2])\n    ws = []\n    for seed in range(4):\n        r = np.random.default_rng(seed)\n        y = 1.0 * base + 1.0 * c2 + r.normal(0, 0.5, n)\n        ws.append(np.linalg.lstsq(X, y, rcond=None)[0].round(2).tolist())\n    print(f\"{rho:11} | {np.linalg.cond(X):16.1f} | {ws}\")\nX = np.column_stack([base, rho * base + np.sqrt(1 - rho ** 2) * rng.normal(size=n)])\ny = X.sum(axis=1) + rng.normal(0, 0.5, n)\nfor lam in [0, 0.1, 1.0]:\n    w = np.linalg.solve(X.T @ X + lam * np.eye(2), X.T @ y)\n    print(f\"ridge lambda {lam}: weights {w.round(2).tolist()}\")",
      "output": "correlation | condition number | weights on 4 resamples of the same process\n        0.0 |              1.1 | [[1.13, 0.87], [1.02, 1.1], [0.97, 1.03], [1.0, 0.88]]\n        0.9 |              4.0 | [[1.11, 1.01], [1.01, 1.02], [0.99, 0.98], [0.92, 1.08]]\n      0.999 |             42.1 | [[0.22, 1.9], [-0.09, 2.12], [1.95, 0.01], [2.97, -1.0]]\nridge lambda 0: weights [3.39, -1.39]\nridge lambda 0.1: weights [1.99, 0.02]\nridge lambda 1.0: weights [1.17, 0.84]"
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Near-copies make weights unstable",
       "alt": "The weight on the first of two features across four resamples of the same data. With uncorrelated features the weight stays near 1. With features correlated at 0.999 it swings from about 3 down to about -0.1.",
       "xLabel": "Resample",
       "yLabel": "Weight on feature 1 (truth = 1)",
       "series": [
        {
         "name": "Correlation 0",
         "style": "line",
         "pts": [
          [
           1.0,
           1.13
          ],
          [
           2.0,
           1.02
          ],
          [
           3.0,
           0.97
          ],
          [
           4.0,
           1.0
          ]
         ]
        },
        {
         "name": "Correlation 0.9",
         "style": "line",
         "pts": [
          [
           1.0,
           1.11
          ],
          [
           2.0,
           1.01
          ],
          [
           3.0,
           0.99
          ],
          [
           4.0,
           0.92
          ]
         ]
        },
        {
         "name": "Correlation 0.999",
         "style": "line",
         "pts": [
          [
           1.0,
           0.22
          ],
          [
           2.0,
           -0.09
          ],
          [
           3.0,
           1.95
          ],
          [
           4.0,
           2.97
          ]
         ]
        }
       ]
      }
     },
     {
      "kind": "p",
      "text": "With uncorrelated columns the condition number is 1.1 and the weights stay near the truth of 1. At correlation 0.999 it is 42.1 and the weights swing from −1.0 to 2.97, even though predictions stay fine. Ridge steadies it: with λ = 1 the weights return to 1.17 and 0.84."
     },
     {
      "kind": "p",
      "text": "The SVD is the most reliable view. It writes X as rotation, stretch, rotation; the stretches are the singular values, and tiny ones flag the unstable directions."
     },
     {
      "kind": "code",
      "caption": "The SVD route, the pseudo-inverse and dropping a direction",
      "code": "import numpy as np\n\nrng = np.random.default_rng(7)\nX = rng.normal(size=(40, 3)); y = X @ np.array([2.0, -1.0, 0.5]) + rng.normal(0, 0.3, 40)\nU, S, Vt = np.linalg.svd(X, full_matrices=False)\nw_svd = Vt.T @ ((U.T @ y) / S)                        # w = V * Sigma^-1 * U^T * y\nw_pinv = np.linalg.pinv(X) @ y\nw_ref = np.linalg.lstsq(X, y, rcond=None)[0]\nprint(\"singular values:\", S.round(2), \"| SVD:\", w_svd.round(4), \"| pinv:\", w_pinv.round(4), \"| lstsq:\", w_ref.round(4))\n# drop to two directions: keep only the 2 largest singular values (the idea behind PCA regression)\nw2 = Vt[:2].T @ ((U[:, :2].T @ y) / S[:2])\nprint(\"weights using 2 directions:\", w2.round(3), \"| mean squared miss, full vs 2 directions:\",\n      round(float(np.mean((y - X @ w_svd) ** 2)), 4), round(float(np.mean((y - X @ w2) ** 2)), 4))",
      "output": "singular values: [6.07 5.65 4.8 ] | SVD: [ 2.0116 -0.9899  0.6206] | pinv: [ 2.0116 -0.9899  0.6206] | lstsq: [ 2.0116 -0.9899  0.6206]\nweights using 2 directions: [ 1.013 -0.931  1.389] | mean squared miss, full vs 2 directions: 0.0709 0.9878"
     },
     {
      "kind": "p",
      "text": "The SVD, the pseudo-inverse and lstsq agree on 2.0116, −0.9899, 0.6206. Dropping the weakest direction here raises the mean squared miss from 0.0709 to 0.9878, because all three directions matter in this data. In PCA regression you drop only directions with tiny singular values."
     }
    ]
   },
   {
    "id": "mls-meet",
    "kicker": "5 · Where you will meet it",
    "title": "Where you will meet it",
    "blocks": [
     {
      "kind": "table",
      "caption": "Least squares across the course",
      "headers": [
       "Where",
       "How it appears"
      ],
      "rows": [
       [
        "Linear regression playbook",
        "np.linalg.solve on the normal equation"
       ],
       [
        "Polynomial regression",
        "The same solver on columns 1, x, x², …"
       ],
       [
        "Ridge",
        "Solve (XᵀX + λI) w = Xᵀ y"
       ],
       [
        "PCA",
        "The SVD of centred data"
       ],
       [
        "Neural networks",
        "The final linear layer is a least-squares fit when the loss is squared error"
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "If a coefficient flips sign when you resample, check the condition number before blaming the data."
     }
    ]
   },
   {
    "id": "mls-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Inverting XᵀX",
      "text": "Use solve, lstsq or QR. Explicit inverses amplify rounding error."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Near-duplicate columns",
      "text": "Weights swung from −1.0 to 2.97 at correlation 0.999. Drop one, combine them, or use ridge."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading unstable weights as insight",
      "text": "The prediction was fine; the individual weights were not meaningful."
     }
    ]
   },
   {
    "id": "mls-check",
    "kicker": "7 · Check yourself",
    "title": "Check yourself",
    "blocks": [
     {
      "kind": "check",
      "question": "After fitting, Xᵀ × residual is not close to zero. What does that tell you?",
      "options": [
       "The fit is perfect",
       "The solution is not the least-squares minimum",
       "The data are normally distributed"
      ],
      "answer": 1,
      "why": "At the minimum the residual is perpendicular to every column of X."
     },
     {
      "kind": "check",
      "question": "Two columns are correlated at 0.999 and the coefficients flip sign on resampling. What helps most?",
      "options": [
       "More decimals",
       "Ridge, or dropping one column",
       "A bigger learning rate"
      ],
      "answer": 1,
      "why": "A penalty or removing the near-copy stabilises the solve."
     },
     {
      "kind": "p",
      "text": "Next: the Ridge, Lasso & Elastic Net playbook uses exactly this fix."
     }
    ]
   }
  ]
 },
 "likelihood": {
  "title": "Likelihood, sigmoid and softmax: where log loss and squared error come from",
  "minutes": 16,
  "sections": [
   {
    "id": "mlk-why",
    "kicker": "1 · Why machine learning needs it",
    "title": "Why it matters",
    "blocks": [
     {
      "kind": "p",
      "text": "Why do we minimise squared error for numbers and log loss for yes/no? Why a sigmoid, why a softmax? They are not arbitrary. Each is what you get when you ask: which weights make the data I actually saw most probable? That question is maximum likelihood, and it ties probability, calculus and every loss in this course into one idea."
     },
     {
      "kind": "table",
      "caption": "One principle, three losses",
      "headers": [
       "If the target is…",
       "Assume…",
       "Maximum likelihood gives…"
      ],
      "rows": [
       [
        "a number",
        "bell-shaped noise",
        "squared error (least squares)"
       ],
       [
        "yes or no",
        "a coin flip with probability p",
        "log loss (cross-entropy)"
       ],
       [
        "one of several classes",
        "a die with probabilities p₁…p_k",
        "softmax and cross-entropy"
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question this lesson answers",
      "text": "What does 'most probable weights' mean, why does it give those losses, and how do sigmoid and softmax make scores into probabilities?"
     }
    ]
   },
   {
    "id": "mlk-idea",
    "kicker": "2 · The idea, drawn",
    "title": "The idea, drawn",
    "blocks": [
     {
      "kind": "p",
      "text": "Likelihood is the probability of the observed data, viewed as a function of the unknown parameter. Seven heads in ten flips is most likely if p = 0.7. A thousand flips with the same share make the peak far sharper: the data say much more. Because multiplying many small probabilities underflows and is awkward to differentiate, we take logs, which turn products into sums."
     },
     {
      "kind": "figure",
      "spec": {
       "title": "How sure are we about the coin? Log-likelihood by data size",
       "alt": "Log-likelihood of a coin's heads probability, shifted so each peak is zero. All three curves peak at 0.7, but with 10 flips the curve is wide and with 1000 flips it is very narrow, meaning the data pin the value down.",
       "xLabel": "Probability of heads (p)",
       "yLabel": "Log-likelihood relative to the peak",
       "series": [
        {
         "name": "7 heads in 10",
         "style": "line",
         "pts": [
          [
           0.01,
           -26.158
          ],
          [
           0.02,
           -21.336
          ],
          [
           0.03,
           -18.529
          ],
          [
           0.04,
           -16.546
          ],
          [
           0.05,
           -15.015
          ],
          [
           0.06,
           -13.771
          ],
          [
           0.07,
           -12.724
          ],
          [
           0.08,
           -11.822
          ],
          [
           0.09,
           -11.03
          ],
          [
           0.1,
           -10.326
          ],
          [
           0.11,
           -9.692
          ],
          [
           0.12,
           -9.117
          ],
          [
           0.13,
           -8.591
          ],
          [
           0.14,
           -8.107
          ],
          [
           0.15,
           -7.659
          ],
          [
           0.16,
           -7.242
          ],
          [
           0.17,
           -6.854
          ],
          [
           0.18,
           -6.49
          ],
          [
           0.19,
           -6.149
          ],
          [
           0.2,
           -5.827
          ],
          [
           0.21,
           -5.523
          ],
          [
           0.22,
           -5.236
          ],
          [
           0.23,
           -4.963
          ],
          [
           0.24,
           -4.704
          ],
          [
           0.25,
           -4.458
          ],
          [
           0.26,
           -4.224
          ],
          [
           0.27,
           -4.001
          ],
          [
           0.28,
           -3.788
          ],
          [
           0.29,
           -3.584
          ],
          [
           0.3,
           -3.389
          ],
          [
           0.31,
           -3.203
          ],
          [
           0.32,
           -3.024
          ],
          [
           0.33,
           -2.853
          ],
          [
           0.34,
           -2.69
          ],
          [
           0.35,
           -2.532
          ],
          [
           0.36,
           -2.382
          ],
          [
           0.37,
           -2.237
          ],
          [
           0.38,
           -2.099
          ],
          [
           0.39,
           -1.966
          ],
          [
           0.4,
           -1.838
          ],
          [
           0.41,
           -1.715
          ],
          [
           0.42,
           -1.598
          ],
          [
           0.43,
           -1.486
          ],
          [
           0.44,
           -1.378
          ],
          [
           0.45,
           -1.274
          ],
          [
           0.46,
           -1.176
          ],
          [
           0.47,
           -1.081
          ],
          [
           0.48,
           -0.991
          ],
          [
           0.49,
           -0.905
          ],
          [
           0.5,
           -0.823
          ],
          [
           0.51,
           -0.745
          ],
          [
           0.52,
           -0.671
          ],
          [
           0.53,
           -0.601
          ],
          [
           0.54,
           -0.534
          ],
          [
           0.55,
           -0.472
          ],
          [
           0.56,
           -0.413
          ],
          [
           0.57,
           -0.358
          ],
          [
           0.58,
           -0.307
          ],
          [
           0.59,
           -0.26
          ],
          [
           0.6,
           -0.216
          ],
          [
           0.61,
           -0.176
          ],
          [
           0.62,
           -0.14
          ],
          [
           0.63,
           -0.108
          ],
          [
           0.64,
           -0.08
          ],
          [
           0.65,
           -0.056
          ],
          [
           0.66,
           -0.036
          ],
          [
           0.67,
           -0.021
          ],
          [
           0.68,
           -0.009
          ],
          [
           0.69,
           -0.002
          ],
          [
           0.7,
           0.0
          ],
          [
           0.71,
           -0.002
          ],
          [
           0.72,
           -0.01
          ],
          [
           0.73,
           -0.022
          ],
          [
           0.74,
           -0.04
          ],
          [
           0.75,
           -0.064
          ],
          [
           0.76,
           -0.094
          ],
          [
           0.77,
           -0.13
          ],
          [
           0.78,
           -0.173
          ],
          [
           0.79,
           -0.223
          ],
          [
           0.8,
           -0.282
          ],
          [
           0.81,
           -0.349
          ],
          [
           0.82,
           -0.425
          ],
          [
           0.83,
           -0.512
          ],
          [
           0.84,
           -0.61
          ],
          [
           0.85,
           -0.72
          ],
          [
           0.86,
           -0.845
          ],
          [
           0.87,
           -0.987
          ],
          [
           0.88,
           -1.147
          ],
          [
           0.89,
           -1.329
          ],
          [
           0.9,
           -1.537
          ],
          [
           0.91,
           -1.775
          ],
          [
           0.92,
           -2.052
          ],
          [
           0.93,
           -2.377
          ],
          [
           0.94,
           -2.765
          ],
          [
           0.95,
           -3.238
          ],
          [
           0.96,
           -3.834
          ],
          [
           0.97,
           -4.624
          ],
          [
           0.98,
           -5.769
          ],
          [
           0.99,
           -7.777
          ]
         ]
        },
        {
         "name": "70 in 100",
         "style": "line",
         "pts": [
          [
           0.01,
           -261.577
          ],
          [
           0.02,
           -213.361
          ],
          [
           0.03,
           -185.286
          ],
          [
           0.04,
           -165.46
          ],
          [
           0.05,
           -150.154
          ],
          [
           0.06,
           -137.709
          ],
          [
           0.07,
           -127.239
          ],
          [
           0.08,
           -118.216
          ],
          [
           0.09,
           -110.299
          ],
          [
           0.1,
           -103.255
          ],
          [
           0.11,
           -96.919
          ],
          [
           0.12,
           -91.167
          ],
          [
           0.13,
           -85.907
          ],
          [
           0.14,
           -81.066
          ],
          [
           0.15,
           -76.588
          ],
          [
           0.16,
           -72.425
          ],
          [
           0.17,
           -68.54
          ],
          [
           0.18,
           -64.903
          ],
          [
           0.19,
           -61.486
          ],
          [
           0.2,
           -58.269
          ],
          [
           0.21,
           -55.231
          ],
          [
           0.22,
           -52.356
          ],
          [
           0.23,
           -49.632
          ],
          [
           0.24,
           -47.045
          ],
          [
           0.25,
           -44.585
          ],
          [
           0.26,
           -42.242
          ],
          [
           0.27,
           -40.008
          ],
          [
           0.28,
           -37.876
          ],
          [
           0.29,
           -35.839
          ],
          [
           0.3,
           -33.892
          ],
          [
           0.31,
           -32.028
          ],
          [
           0.32,
           -30.244
          ],
          [
           0.33,
           -28.534
          ],
          [
           0.34,
           -26.896
          ],
          [
           0.35,
           -25.325
          ],
          [
           0.36,
           -23.818
          ],
          [
           0.37,
           -22.372
          ],
          [
           0.38,
           -20.986
          ],
          [
           0.39,
           -19.655
          ],
          [
           0.4,
           -18.379
          ],
          [
           0.41,
           -17.154
          ],
          [
           0.42,
           -15.98
          ],
          [
           0.43,
           -14.855
          ],
          [
           0.44,
           -13.777
          ],
          [
           0.45,
           -12.744
          ],
          [
           0.46,
           -11.756
          ],
          [
           0.47,
           -10.811
          ],
          [
           0.48,
           -9.909
          ],
          [
           0.49,
           -9.048
          ],
          [
           0.5,
           -8.228
          ],
          [
           0.51,
           -7.448
          ],
          [
           0.52,
           -6.707
          ],
          [
           0.53,
           -6.006
          ],
          [
           0.54,
           -5.342
          ],
          [
           0.55,
           -4.717
          ],
          [
           0.56,
           -4.13
          ],
          [
           0.57,
           -3.581
          ],
          [
           0.58,
           -3.069
          ],
          [
           0.59,
           -2.596
          ],
          [
           0.6,
           -2.16
          ],
          [
           0.61,
           -1.763
          ],
          [
           0.62,
           -1.404
          ],
          [
           0.63,
           -1.084
          ],
          [
           0.64,
           -0.803
          ],
          [
           0.65,
           -0.563
          ],
          [
           0.66,
           -0.364
          ],
          [
           0.67,
           -0.207
          ],
          [
           0.68,
           -0.093
          ],
          [
           0.69,
           -0.024
          ],
          [
           0.7,
           0.0
          ],
          [
           0.71,
           -0.024
          ],
          [
           0.72,
           -0.098
          ],
          [
           0.73,
           -0.223
          ],
          [
           0.74,
           -0.403
          ],
          [
           0.75,
           -0.64
          ],
          [
           0.76,
           -0.938
          ],
          [
           0.77,
           -1.299
          ],
          [
           0.78,
           -1.73
          ],
          [
           0.79,
           -2.234
          ],
          [
           0.8,
           -2.817
          ],
          [
           0.81,
           -3.486
          ],
          [
           0.82,
           -4.249
          ],
          [
           0.83,
           -5.115
          ],
          [
           0.84,
           -6.096
          ],
          [
           0.85,
           -7.203
          ],
          [
           0.86,
           -8.455
          ],
          [
           0.87,
           -9.869
          ],
          [
           0.88,
           -11.47
          ],
          [
           0.89,
           -13.289
          ],
          [
           0.9,
           -15.366
          ],
          [
           0.91,
           -17.754
          ],
          [
           0.92,
           -20.522
          ],
          [
           0.93,
           -23.771
          ],
          [
           0.94,
           -27.647
          ],
          [
           0.95,
           -32.376
          ],
          [
           0.96,
           -38.337
          ],
          [
           0.97,
           -46.242
          ],
          [
           0.98,
           -57.688
          ],
          [
           0.99,
           -77.772
          ]
         ]
        },
        {
         "name": "700 in 1000",
         "style": "line",
         "pts": [
          [
           0.01,
           -2615.77
          ],
          [
           0.02,
           -2133.613
          ],
          [
           0.03,
           -1852.864
          ],
          [
           0.04,
           -1654.595
          ],
          [
           0.05,
           -1501.536
          ],
          [
           0.06,
           -1377.086
          ],
          [
           0.07,
           -1272.389
          ],
          [
           0.08,
           -1182.16
          ],
          [
           0.09,
           -1102.991
          ],
          [
           0.1,
           -1032.553
          ],
          [
           0.11,
           -969.188
          ],
          [
           0.12,
           -911.67
          ],
          [
           0.13,
           -859.069
          ],
          [
           0.14,
           -810.662
          ],
          [
           0.15,
           -765.875
          ],
          [
           0.16,
           -724.249
          ],
          [
           0.17,
           -685.404
          ],
          [
           0.18,
           -649.03
          ],
          [
           0.19,
           -614.864
          ],
          [
           0.2,
           -582.685
          ],
          [
           0.21,
           -552.306
          ],
          [
           0.22,
           -523.564
          ],
          [
           0.23,
           -496.318
          ],
          [
           0.24,
           -470.448
          ],
          [
           0.25,
           -445.846
          ],
          [
           0.26,
           -422.419
          ],
          [
           0.27,
           -400.082
          ],
          [
           0.28,
           -378.763
          ],
          [
           0.29,
           -358.395
          ],
          [
           0.3,
           -338.919
          ],
          [
           0.31,
           -320.283
          ],
          [
           0.32,
           -302.438
          ],
          [
           0.33,
           -285.343
          ],
          [
           0.34,
           -268.957
          ],
          [
           0.35,
           -253.246
          ],
          [
           0.36,
           -238.178
          ],
          [
           0.37,
           -223.723
          ],
          [
           0.38,
           -209.855
          ],
          [
           0.39,
           -196.551
          ],
          [
           0.4,
           -183.787
          ],
          [
           0.41,
           -171.544
          ],
          [
           0.42,
           -159.804
          ],
          [
           0.43,
           -148.55
          ],
          [
           0.44,
           -137.768
          ],
          [
           0.45,
           -127.442
          ],
          [
           0.46,
           -117.562
          ],
          [
           0.47,
           -108.115
          ],
          [
           0.48,
           -99.092
          ],
          [
           0.49,
           -90.484
          ],
          [
           0.5,
           -82.283
          ],
          [
           0.51,
           -74.482
          ],
          [
           0.52,
           -67.075
          ],
          [
           0.53,
           -60.057
          ],
          [
           0.54,
           -53.425
          ],
          [
           0.55,
           -47.174
          ],
          [
           0.56,
           -41.303
          ],
          [
           0.57,
           -35.81
          ],
          [
           0.58,
           -30.695
          ],
          [
           0.59,
           -25.958
          ],
          [
           0.6,
           -21.601
          ],
          [
           0.61,
           -17.626
          ],
          [
           0.62,
           -14.036
          ],
          [
           0.63,
           -10.836
          ],
          [
           0.64,
           -8.032
          ],
          [
           0.65,
           -5.63
          ],
          [
           0.66,
           -3.639
          ],
          [
           0.67,
           -2.069
          ],
          [
           0.68,
           -0.93
          ],
          [
           0.69,
           -0.235
          ],
          [
           0.7,
           0.0
          ],
          [
           0.71,
           -0.241
          ],
          [
           0.72,
           -0.978
          ],
          [
           0.73,
           -2.233
          ],
          [
           0.74,
           -4.031
          ],
          [
           0.75,
           -6.401
          ],
          [
           0.76,
           -9.376
          ],
          [
           0.77,
           -12.994
          ],
          [
           0.78,
           -17.297
          ],
          [
           0.79,
           -22.336
          ],
          [
           0.8,
           -28.168
          ],
          [
           0.81,
           -34.86
          ],
          [
           0.82,
           -42.491
          ],
          [
           0.83,
           -51.153
          ],
          [
           0.84,
           -60.958
          ],
          [
           0.85,
           -72.035
          ],
          [
           0.86,
           -84.546
          ],
          [
           0.87,
           -98.685
          ],
          [
           0.88,
           -114.698
          ],
          [
           0.89,
           -132.892
          ],
          [
           0.9,
           -153.664
          ],
          [
           0.91,
           -177.537
          ],
          [
           0.92,
           -205.221
          ],
          [
           0.93,
           -237.713
          ],
          [
           0.94,
           -276.472
          ],
          [
           0.95,
           -323.761
          ],
          [
           0.96,
           -383.374
          ],
          [
           0.97,
           -462.425
          ],
          [
           0.98,
           -576.884
          ],
          [
           0.99,
           -777.722
          ]
         ]
        }
       ],
       "yDomain": [
        -8,
        0.3
       ],
       "xDomain": [
        0.2,
        1
       ]
      }
     },
     {
      "kind": "eq",
      "lines": [
       "likelihood(p) = p^heads × (1−p)^tails",
       "log-likelihood = heads × ln p + tails × ln(1−p)",
       "sigmoid(s) = 1 / (1 + e^−s)",
       "softmax(s)ᵢ = e^sᵢ / Σ e^sⱼ"
      ],
      "note": "Maximising the log-likelihood is the same as minimising its negative, and that negative is exactly what we call a loss."
     }
    ]
   },
   {
    "id": "mlk-hand",
    "kicker": "3 · Work it by hand",
    "title": "Work it by hand",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Write the probability of the data for each candidate p.",
       "Take logs so the product becomes a sum.",
       "Find the p with the highest value: it equals the share of heads.",
       "Repeat with more data and watch the plausible range shrink."
      ]
     },
     {
      "kind": "code",
      "caption": "Coin likelihood, log-likelihood and the plausible range",
      "code": "import numpy as np\n\nheads, flips = 7, 10\ngrid = np.linspace(0.01, 0.99, 99)\nlike = grid ** heads * (1 - grid) ** (flips - heads)           # probability of this exact data if the coin's p were each value\nloglike = heads * np.log(grid) + (flips - heads) * np.log(1 - grid)\nprint(\"best p by likelihood:\", round(float(grid[like.argmax()]), 2), \"| by log-likelihood:\", round(float(grid[loglike.argmax()]), 2), \"| plain proportion:\", heads / flips)\nfor h, f in [(7, 10), (70, 100), (700, 1000)]:\n    ll = h * np.log(grid) + (f - h) * np.log(1 - grid)\n    ok = grid[ll >= ll.max() - 1.92]                            # points within 1.92 log units of the peak: an approximate 95% range\n    print(f\"{h:3d} heads in {f:4d} flips: best p {grid[ll.argmax()]:.2f}, plausible range {ok.min():.2f} to {ok.max():.2f}\")",
      "output": "best p by likelihood: 0.7 | by log-likelihood: 0.7 | plain proportion: 0.7\n  7 heads in   10 flips: best p 0.70, plausible range 0.40 to 0.91\n 70 heads in  100 flips: best p 0.70, plausible range 0.61 to 0.78\n700 heads in 1000 flips: best p 0.70, plausible range 0.68 to 0.72"
     },
     {
      "kind": "p",
      "text": "The likelihood and the log-likelihood peak at the same place, 0.7, equal to the plain proportion. The plausible range around it shrinks as data grows: 0.40 to 0.91 with 10 flips, 0.61 to 0.78 with 100 and 0.68 to 0.72 with 1,000."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Maximum likelihood gives the obvious estimates, and its sharpness tells you how much the data can be trusted."
     }
    ]
   },
   {
    "id": "mlk-python",
    "kicker": "4 · In Python",
    "title": "In Python",
    "blocks": [
     {
      "kind": "p",
      "text": "Now the payoff: the losses you have been using are negative log-likelihoods in disguise."
     },
     {
      "kind": "code",
      "caption": "Log loss is a negative log-likelihood; squared error is a Gaussian one",
      "code": "import numpy as np\n\nrng = np.random.default_rng(9)\n# 1. Yes/no labels with probabilities p: the negative log-likelihood IS log loss\ny = np.array([1, 0, 1, 1, 0]); p = np.array([0.9, 0.2, 0.6, 0.8, 0.4])\nnll = -np.sum(np.log(np.where(y == 1, p, 1 - p)))\nlogloss = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))\nprint(\"negative log-likelihood:\", round(float(nll), 4), \"| mean log loss x 5:\", round(float(logloss * 5), 4))\n# 2. Numbers with bell-shaped noise: maximising likelihood = minimising squared error\nx = rng.uniform(0, 10, 60); t = 3 * x + 2 + rng.normal(0, 2, 60)\nslopes = np.linspace(2, 4, 201)\nsse = [np.sum((t - (m * x + 2)) ** 2) for m in slopes]\nll = [-0.5 * np.sum((t - (m * x + 2)) ** 2) / 4 for m in slopes]       # Gaussian log-likelihood with sigma = 2 (constants dropped)\nprint(\"slope minimising squared error:\", round(float(slopes[np.argmin(sse)]), 3), \"| slope maximising likelihood:\", round(float(slopes[np.argmax(ll)]), 3))",
      "output": "negative log-likelihood: 1.5733 | mean log loss x 5: 1.5733\nslope minimising squared error: 3.06 | slope maximising likelihood: 3.06"
     },
     {
      "kind": "p",
      "text": "For five yes/no labels the negative log-likelihood (1.5733) equals five times the mean log loss. For a straight-line fit with bell-shaped noise the slope that minimises squared error (3.06) is the same slope that maximises the likelihood. Choosing a loss is choosing a noise model."
     },
     {
      "kind": "p",
      "text": "Last piece: turning scores into probabilities safely."
     },
     {
      "kind": "code",
      "caption": "Softmax, temperature, and a numerical trap",
      "code": "import numpy as np\n\ndef softmax(s):\n    e = np.exp(s - s.max())                 # subtracting the biggest score changes nothing but avoids overflow\n    return e / e.sum()\nscores = np.array([2.0, 1.0, 0.1])\nprint(\"scores\", scores, \"-> probabilities\", softmax(scores).round(3), \"sum\", round(float(softmax(scores).sum()), 3))\nfor T in [0.5, 1, 3]:\n    print(f\"temperature {T}: {softmax(scores / T).round(3)}\")\nbig = np.array([1000.0, 999.0, 998.0])\nwith np.errstate(all=\"ignore\"):\n    naive = np.exp(big) / np.exp(big).sum()\nprint(\"naive softmax on huge scores:\", naive, \"| stable version:\", softmax(big).round(3))\nsig = lambda s: 1 / (1 + np.exp(-s))\nprint(\"two-class softmax equals a sigmoid of the score difference:\", softmax(np.array([1.3, 0.4]))[0].round(4), sig(1.3 - 0.4).round(4))",
      "output": "scores [2.  1.  0.1] -> probabilities [0.659 0.242 0.099] sum 1.0\ntemperature 0.5: [0.864 0.117 0.019]\ntemperature 1: [0.659 0.242 0.099]\ntemperature 3: [0.445 0.319 0.236]\nnaive softmax on huge scores: [nan nan nan] | stable version: [0.665 0.245 0.09 ]\ntwo-class softmax equals a sigmoid of the score difference: 0.7109 0.7109"
     },
     {
      "kind": "figure",
      "spec": {
       "title": "Softmax turns scores into probabilities",
       "alt": "Probabilities for three classes from the scores 2.0, 1.0 and 0.1 at three temperatures. At temperature 0.5 the top class has 0.864, at 1 it has 0.659 and at 3 it has 0.445.",
       "xLabel": "Class (0, 1, 2)",
       "yLabel": "Probability",
       "series": [
        {
         "name": "Temperature 0.5",
         "style": "line",
         "pts": [
          [
           0.0,
           0.864
          ],
          [
           1.0,
           0.117
          ],
          [
           2.0,
           0.019
          ]
         ]
        },
        {
         "name": "Temperature 1",
         "style": "line",
         "pts": [
          [
           0.0,
           0.659
          ],
          [
           1.0,
           0.242
          ],
          [
           2.0,
           0.099
          ]
         ]
        },
        {
         "name": "Temperature 3",
         "style": "line",
         "pts": [
          [
           0.0,
           0.445
          ],
          [
           1.0,
           0.319
          ],
          [
           2.0,
           0.236
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
      "kind": "p",
      "text": "Scores of 2.0, 1.0 and 0.1 become 0.659, 0.242 and 0.099, summing to 1. Lowering the temperature to 0.5 sharpens the top class to 0.864, and raising it to 3 flattens it to 0.445. With scores near 1,000 the naive formula returns nan, while subtracting the maximum first gives a sane answer. And for two classes, softmax is exactly a sigmoid of the score difference (0.7109 both ways)."
     }
    ]
   },
   {
    "id": "mlk-meet",
    "kicker": "5 · Where you will meet it",
    "title": "Where you will meet it",
    "blocks": [
     {
      "kind": "table",
      "caption": "Likelihood across the course",
      "headers": [
       "Where",
       "How"
      ],
      "rows": [
       [
        "Linear regression",
        "Squared error is Gaussian maximum likelihood"
       ],
       [
        "Logistic regression",
        "Log loss is the Bernoulli negative log-likelihood; sigmoid maps score to probability"
       ],
       [
        "Neural network classifiers",
        "Softmax output with cross-entropy"
       ],
       [
        "Naive Bayes",
        "Multiplies per-feature likelihoods"
       ],
       [
        "Calibration lessons",
        "Do predicted probabilities match frequencies?"
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "When the Logistic Regression playbook says 'the gradient of log loss is just (p − y) times the inputs', that simplicity comes from this likelihood."
     }
    ]
   },
   {
    "id": "mlk-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Where it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Multiplying raw probabilities",
      "text": "A thousand small factors underflow to zero. Work in logs."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Naive softmax",
      "text": "Large scores overflow to nan. Subtract the maximum first."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Trusting the peak without the width",
      "text": "7 heads in 10 also fits p = 0.4 or 0.9. Always ask how sharp the likelihood is."
     }
    ]
   },
   {
    "id": "mlk-check",
    "kicker": "7 · Check yourself",
    "title": "Check yourself",
    "blocks": [
     {
      "kind": "check",
      "question": "Why do we minimise log loss rather than raw accuracy when training a classifier?",
      "options": [
       "Accuracy cannot be computed",
       "Log loss is the negative log-likelihood, smooth and informative about confidence",
       "Log loss is always smaller"
      ],
      "answer": 1,
      "why": "Likelihood rewards confident correct probabilities and punishes confident wrong ones, and it has a usable gradient."
     },
     {
      "kind": "check",
      "question": "Softmax is applied to scores [1000, 999, 998] and returns nan. What is the fix?",
      "options": [
       "Use a bigger learning rate",
       "Subtract the largest score before exponentiating",
       "Round the scores"
      ],
      "answer": 1,
      "why": "Subtracting the maximum leaves the probabilities unchanged and avoids overflow."
     },
     {
      "kind": "p",
      "text": "Next: the Logistic Regression and MLP playbooks use these ideas in full training loops."
     }
    ]
   }
  ]
 }
};
export const FOUNDATION_NAMES:Record<string,string>={"gradients": "Partial derivatives and the gradient", "normal": "The normal curve and the central limit theorem", "least-squares": "Least squares and the normal equation", "likelihood": "Likelihood, sigmoid and softmax"};
