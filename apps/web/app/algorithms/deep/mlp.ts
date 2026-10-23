import type {DeepLesson} from "../../math/teaching/deep-read";
export const MLP_DEEP:DeepLesson[]=[
 {
  "title": "Beyond one neuron: stacking bends the line",
  "minutes": 14,
  "sections": [
   {
    "id": "nn1-observe",
    "kicker": "1 · Observe",
    "title": "A rule that a straight line cannot draw",
    "blocks": [
     {
      "kind": "p",
      "text": "Suppose a telecom finds that customers churn when they are new or heavy users, but not both. A new customer who uses the service heavily is settling in happily; a long-time light user is quietly drifting but not leaving. One straight rule on the two columns cannot express 'exactly one of the two'."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How does a small network of simple pieces represent a pattern no single line can?"
     }
    ]
   },
   {
    "id": "nn1-express",
    "kicker": "2 · Express",
    "title": "Weights, biases and a bend",
    "blocks": [
     {
      "kind": "p",
      "text": "A hidden unit takes a weighted sum of the inputs, adds a bias, and passes the result through an activation. ReLU keeps positive values and sets negatives to zero. A second layer combines the hidden values into a score, and a sigmoid turns the score into a chance."
     },
     {
      "kind": "eq",
      "lines": [
       "hidden = ReLU(W₁x + b₁)",
       "score = w₂ · hidden + b₂",
       "chance = sigmoid(score)"
      ],
      "note": "The bend in ReLU is what lets two units cooperate to carve out a region a line cannot."
     }
    ]
   },
   {
    "id": "nn1-visualize",
    "kicker": "3 · Visualize",
    "title": "A network small enough to check by hand",
    "blocks": [
     {
      "kind": "p",
      "text": "Two inputs, two hidden units with weights all 1, biases 0 and −1, and output weights 1 and −2 with bias −0.5. Feed in the four combinations of 0 and 1."
     },
     {
      "kind": "table",
      "caption": "Forward pass",
      "headers": [
       "Input",
       "Hidden values",
       "Score",
       "Chance (sigmoid of 4 × score)"
      ],
      "rows": [
       [
        "(0, 0)",
        "(0, 0)",
        "−0.5",
        "0.119"
       ],
       [
        "(1, 0)",
        "(1, 0)",
        "+0.5",
        "0.881"
       ],
       [
        "(0, 1)",
        "(1, 0)",
        "+0.5",
        "0.881"
       ],
       [
        "(1, 1)",
        "(2, 1)",
        "−0.5",
        "0.119"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "'Exactly one' gets a high chance and 'neither' or 'both' get a low one. The second hidden unit switches on only when both inputs are 1, and its negative output weight pulls the score back down. No single line can do that."
     }
    ]
   },
   {
    "id": "nn1-discover",
    "kicker": "4 · Discover",
    "title": "Fitted on noisy customers",
    "blocks": [
     {
      "kind": "p",
      "text": "1,200 simulated customers with the same 'exactly one' rule, plus noise. 600 to train, 600 to test. Logistic regression scores 0.502 on test, the same as guessing. A network with 4 hidden units scores 0.998. The extra layer is what made the pattern reachable, nothing else changed."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Hidden units give a model new features built from the old ones, and stacking them lets it draw boundaries a single line cannot."
     }
    ]
   },
   {
    "id": "nn1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, one hidden unit. For input (1, 1): first unit = ReLU(1 + 1 + 0) = 2; second unit = ReLU(1 + 1 − 1) = 1. Score = 2 × 1 + 1 × (−2) − 0.5 = −0.5. Chance = 1 ÷ (1 + e^2) = 0.119."
     },
     {
      "kind": "p",
      "text": "Example 2, why the bend matters. Without ReLU the two layers would collapse into a single linear rule, since a straight line of straight lines is a straight line. Activation is what stops that."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Tabular problems with interactions, such as usage that matters differently for new and long-time customers."
     },
     {
      "kind": "check",
      "question": "A network has no activation functions between layers. What can it represent?",
      "options": [
       "Any shape",
       "Only a linear rule",
       "Only a curve"
      ],
      "answer": 1,
      "why": "Layers of linear steps combine into one linear step. The bend is what makes depth useful."
     }
    ]
   },
   {
    "id": "nn1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Assuming depth always helps",
      "text": "On a linear pattern a network adds cost without benefit."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Believing the hidden units mean something",
      "text": "They are whatever features make the fit work, and need not match any human idea."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading a good score on noisy data as proof",
      "text": "Always check on rows the network never saw."
     }
    ]
   },
   {
    "id": "nn1-python",
    "kicker": "7 · In Python",
    "title": "A hand-built network, then a fitted one",
    "blocks": [
     {
      "kind": "code",
      "caption": "Forward pass by hand, and logistic regression against a small MLP",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.model_selection import train_test_split\n\n# a hand-built forward pass: 2 inputs -> 2 ReLU hidden units -> 1 output\nrelu = lambda z: np.maximum(0, z)\nsigmoid = lambda z: 1 / (1 + np.exp(-z))\nW1 = np.array([[1.0, 1.0], [1.0, 1.0]])\nb1 = np.array([0.0, -1.0])\nw2 = np.array([1.0, -2.0])\nb2 = -0.5\nfor x in ([0, 0], [1, 0], [0, 1], [1, 1]):\n    h = relu(np.array(x) @ W1 + b1)\n    score = h @ w2 + b2\n    print(\"input\", x, \"hidden\", h, \"score\", round(float(score), 2), \"chance\", round(float(sigmoid(4 * score)), 3))\n\n# customers: churn when exactly one of (new customer, heavy user) is true\nrng = np.random.default_rng(0)\nn = 1200\na = rng.integers(0, 2, n); b = rng.integers(0, 2, n)\nX = np.column_stack([a, b]) + rng.normal(0, 0.15, (n, 2))\ny = a ^ b\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.5, random_state=0)\nprint(\"logistic regression test accuracy:\", round(LogisticRegression().fit(Xtr, ytr).score(Xte, yte), 3))\nmlp = MLPClassifier(hidden_layer_sizes=(4,), activation=\"relu\", max_iter=3000, random_state=1).fit(Xtr, ytr)\nprint(\"MLP with 4 hidden units test accuracy:\", round(mlp.score(Xte, yte), 3))",
      "output": "input [0, 0] hidden [0. 0.] score -0.5 chance 0.119\ninput [1, 0] hidden [1. 0.] score 0.5 chance 0.881\ninput [0, 1] hidden [1. 0.] score 0.5 chance 0.881\ninput [1, 1] hidden [2. 1.] score -0.5 chance 0.119\nlogistic regression test accuracy: 0.502\nMLP with 4 hidden units test accuracy: 0.998"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A line missed the pattern completely. Four hidden units found it."
     }
    ]
   }
  ]
 },
 {
  "title": "Learning means rolling downhill",
  "minutes": 14,
  "sections": [
   {
    "id": "nn2-observe",
    "kicker": "1 · Observe",
    "title": "Where do the weights come from?",
    "blocks": [
     {
      "kind": "p",
      "text": "In the last lesson we chose the weights by hand. In practice the network starts with small random weights and improves them by gradient descent: measure how wrong the prediction is, find how each weight affects that error, and nudge every weight a little in the direction that lowers it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How does one weight learn from one mistake, and why does the chain rule matter?"
     }
    ]
   },
   {
    "id": "nn2-express",
    "kicker": "2 · Express",
    "title": "The chain of small effects",
    "blocks": [
     {
      "kind": "p",
      "text": "For one neuron p = sigmoid(wx + b) and log loss, the effect of w on the loss passes through several steps. The chain rule multiplies those steps and, for log loss with a sigmoid, collapses to a neat answer."
     },
     {
      "kind": "eq",
      "lines": [
       "L = −[ y log p + (1 − y) log(1 − p) ]",
       "∂L/∂w = (p − y) · x",
       "∂L/∂b = (p − y)",
       "w ← w − η · ∂L/∂w"
      ],
      "note": "η is the learning rate. In a deep network, backpropagation applies the same idea layer by layer."
     }
    ]
   },
   {
    "id": "nn2-visualize",
    "kicker": "3 · Visualize",
    "title": "Six steps on one example",
    "blocks": [
     {
      "kind": "p",
      "text": "One customer with x = 2 who churned (y = 1). Start at w = 0.1, b = 0, learning rate 0.5. The code also checks the formula by nudging w slightly in each direction: both give ∂L/∂w = −0.9003."
     },
     {
      "kind": "table",
      "caption": "Gradient descent steps",
      "headers": [
       "Step",
       "w",
       "b",
       "Chance p",
       "Loss"
      ],
      "rows": [
       [
        "0",
        "0.100",
        "0.000",
        "0.5498",
        "0.5981"
       ],
       [
        "1",
        "0.550",
        "0.225",
        "0.7901",
        "0.2356"
       ],
       [
        "2",
        "0.760",
        "0.330",
        "0.8642",
        "0.1460"
       ],
       [
        "3",
        "0.896",
        "0.398",
        "0.8993",
        "0.1061"
       ],
       [
        "4",
        "0.997",
        "0.448",
        "0.9199",
        "0.0834"
       ],
       [
        "5",
        "1.077",
        "0.488",
        "0.9335",
        "0.0688"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The first step is large because the model is wrong. Later steps shrink: as p approaches 1, p − y approaches 0 and so does the push."
     }
    ]
   },
   {
    "id": "nn2-discover",
    "kicker": "4 · Discover",
    "title": "Too big a step, too small a step",
    "blocks": [
     {
      "kind": "p",
      "text": "A learning rate that is too large overshoots the downhill direction and the loss bounces or blows up. One that is too small crawls. The usual compromise is to try a few values on a log scale and watch the loss curve."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Each weight moves opposite to its effect on the loss, by a step set by the learning rate, and backpropagation computes all those effects at once."
     }
    ]
   },
   {
    "id": "nn2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the first step. p = sigmoid(0.1 × 2 + 0) = 0.5498. p − y = −0.4502. ∂L/∂w = −0.4502 × 2 = −0.9003. New w = 0.1 − 0.5 × (−0.9003) = 0.55, and new b = 0 + 0.5 × 0.4502 = 0.225."
     },
     {
      "kind": "p",
      "text": "Example 2, a satisfied example. After five steps p = 0.9335, so p − y = −0.0665. The bias now moves by 0.5 × 0.0665 = 0.033, against 0.225 at the first step."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every network trained by gradient descent, from this one-neuron example up to very large models."
     },
     {
      "kind": "check",
      "question": "The model already predicts p = 0.99 for a customer who churned (y = 1). What happens to the gradient?",
      "options": [
       "It is large",
       "It is almost zero",
       "It is exactly 1"
      ],
      "answer": 1,
      "why": "p − y = −0.01, so the push is tiny. Only mistakes push hard."
     }
    ]
   },
   {
    "id": "nn2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · A learning rate that is too high",
      "text": "The loss rises or oscillates instead of falling."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Judging by training loss",
      "text": "It always falls as the network gets more flexible. Watch validation loss."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Starting every weight at zero",
      "text": "Hidden units would all learn the same thing. Small random starts break the symmetry."
     }
    ]
   },
   {
    "id": "nn2-python",
    "kicker": "7 · In Python",
    "title": "Gradients by hand and by nudging",
    "blocks": [
     {
      "kind": "code",
      "caption": "One neuron, six gradient steps, and a numerical check",
      "code": "import numpy as np\n\n# one neuron, one example: x = 2, target y = 1, start with w = 0.1, b = 0\nx, y = 2.0, 1.0\nsigmoid = lambda z: 1 / (1 + np.exp(-z))\ndef loss(w, b):\n    p = sigmoid(w * x + b)\n    return -(y * np.log(p) + (1 - y) * np.log(1 - p))\n\nw, b = 0.1, 0.0\np = sigmoid(w * x + b)\ndw, db = (p - y) * x, (p - y)                                  # the chain rule result\neps = 1e-6\nnum_dw = (loss(w + eps, b) - loss(w - eps, b)) / (2 * eps)     # a check by nudging\nprint(\"p =\", round(p, 4), \"| analytic dL/dw =\", round(dw, 4), \"| numerical dL/dw =\", round(num_dw, 4))\n\nlr = 0.5\nprint(\"step | w     | b     | p      | loss\")\nfor step in range(6):\n    p = sigmoid(w * x + b)\n    print(str(step).rjust(4), \"|\", round(w, 3), \"|\", round(b, 3), \"|\", round(p, 4), \"|\", round(loss(w, b), 4))\n    w -= lr * (p - y) * x\n    b -= lr * (p - y)",
      "output": "p = 0.5498 | analytic dL/dw = -0.9003 | numerical dL/dw = -0.9003\nstep | w     | b     | p      | loss\n   0 | 0.1 | 0.0 | 0.5498 | 0.5981\n   1 | 0.55 | 0.225 | 0.7901 | 0.2356\n   2 | 0.76 | 0.33 | 0.8642 | 0.146\n   3 | 0.896 | 0.398 | 0.8993 | 0.1061\n   4 | 0.997 | 0.448 | 0.9199 | 0.0834\n   5 | 1.077 | 0.488 | 0.9335 | 0.0688"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The formula agreed with the nudge test to four decimals. That check is how people debug networks."
     }
    ]
   }
  ]
 },
 {
  "title": "Capacity, memory and regularisation",
  "minutes": 14,
  "sections": [
   {
    "id": "nn3-observe",
    "kicker": "1 · Observe",
    "title": "A network can memorise",
    "blocks": [
     {
      "kind": "p",
      "text": "With enough hidden units, a network can reproduce every training row, including noise. Two settings control this: how wide the network is, and how strongly large weights are penalised."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we tell a network that learned from one that memorised, and how do we reduce memorising?"
     }
    ]
   },
   {
    "id": "nn3-express",
    "kicker": "2 · Express",
    "title": "Width and weight penalty",
    "blocks": [
     {
      "kind": "p",
      "text": "More hidden units give more capacity. An L2 penalty (alpha in scikit-learn) adds a term for the size of the weights, pulling them toward zero and smoothing the fitted shape."
     },
     {
      "kind": "eq",
      "lines": [
       "loss to minimise = data loss + α · Σ w²"
      ],
      "note": "Large α means small weights and a smoother, simpler function."
     }
    ]
   },
   {
    "id": "nn3-visualize",
    "kicker": "3 · Visualize",
    "title": "Width and alpha, measured",
    "blocks": [
     {
      "kind": "p",
      "text": "500 simulated customers, 8 columns, a wavy pattern plus an interaction and noise. 250 to train, 250 to test, standardised inputs."
     },
     {
      "kind": "table",
      "caption": "Accuracy by hidden units and α",
      "headers": [
       "Hidden units",
       "α",
       "Train accuracy",
       "Test accuracy"
      ],
      "rows": [
       [
        "2",
        "0.0001",
        "0.496",
        "0.496"
       ],
       [
        "8",
        "0.0001",
        "0.756",
        "0.612"
       ],
       [
        "64",
        "0.0001",
        "0.980",
        "0.664"
       ],
       [
        "256",
        "0.0001",
        "1.000",
        "0.648"
       ],
       [
        "256",
        "1.0",
        "0.820",
        "0.684"
       ],
       [
        "256",
        "3.0",
        "0.732",
        "0.644"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Two hidden units cannot learn the pattern at all (0.496). Eight learn something. At 64 units the gap is 31.6 points between training and test; at 256 units training is perfect. A penalty of 1.0 closes the gap and gives the best test score, 0.684. Too much penalty (3.0) starts to underfit."
     }
    ]
   },
   {
    "id": "nn3-discover",
    "kicker": "4 · Discover",
    "title": "Read it with the noise in mind",
    "blocks": [
     {
      "kind": "p",
      "text": "A test set of 250 rows has a sampling error of about ±3 points, so 0.664, 0.648 and 0.684 are not clearly different from each other. What is clear is the pattern: too small underfits, too big memorises, and the penalty shrinks the gap."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Capacity must match the signal in the data, and regularisation lets you keep a wide network without memorising."
     }
    ]
   },
   {
    "id": "nn3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, reading the gap. 64 units: 0.980 − 0.664 = 0.316 gap. 256 units with α = 1: 0.820 − 0.684 = 0.136 gap. Smaller gap, better test score."
     },
     {
      "kind": "p",
      "text": "Example 2, which to choose. In practice choose width and α by cross-validation on the development rows, then score once on the test. Do not pick them on the test set."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Any network trained on a few hundred to a few thousand rows, where memorising is easy."
     },
     {
      "kind": "check",
      "question": "Training accuracy is 1.000 and test accuracy 0.648. What is the first thing to try?",
      "options": [
       "More hidden units",
       "More regularisation or fewer units",
       "A larger learning rate"
      ],
      "answer": 1,
      "why": "A perfect training fit with a weaker test fit points to memorising. Penalise large weights or reduce capacity."
     }
    ]
   },
   {
    "id": "nn3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Picking the size on the test set",
      "text": "Use validation. The test set is for one final check."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Ignoring noise in the comparison",
      "text": "On 250 test rows, differences of 2 points are not reliable."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Over-penalising",
      "text": "Too large an α shrinks everything and the network underfits."
     }
    ]
   },
   {
    "id": "nn3-python",
    "kicker": "7 · In Python",
    "title": "Width and penalty in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Hidden units and alpha against train and test accuracy",
      "code": "import numpy as np\nimport warnings\nfrom sklearn.exceptions import ConvergenceWarning\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.model_selection import train_test_split\nwarnings.simplefilter(\"ignore\", ConvergenceWarning)\n\nrng = np.random.default_rng(6)\nn = 500\nX = rng.normal(size=(n, 8))\ny = (np.sin(2 * X[:, 0]) + X[:, 1] * X[:, 2] + rng.normal(0, 0.9, n) > 0).astype(int)\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.5, random_state=0, stratify=y)\n\nprint(\"hidden units | alpha  | train acc | test acc\")\nfor h, alpha in [(2, 1e-4), (8, 1e-4), (64, 1e-4), (256, 1e-4), (256, 1.0), (256, 3.0)]:\n    m = make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(h,), alpha=alpha, max_iter=2000, random_state=0)).fit(Xtr, ytr)\n    print(str(h).rjust(12), \"|\", str(alpha).ljust(6), \"|\", round(m.score(Xtr, ytr), 3), \"    |\", round(m.score(Xte, yte), 3))",
      "output": "hidden units | alpha  | train acc | test acc\n           2 | 0.0001 | 0.496     | 0.496\n           8 | 0.0001 | 0.756     | 0.612\n          64 | 0.0001 | 0.98     | 0.664\n         256 | 0.0001 | 1.0     | 0.648\n         256 | 1.0    | 0.82     | 0.684\n         256 | 3.0    | 0.732     | 0.644"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Watch the gap between training and test, not the training score."
     }
    ]
   }
  ]
 },
 {
  "title": "A workflow that you can repeat and trust",
  "minutes": 13,
  "sections": [
   {
    "id": "nn4-observe",
    "kicker": "1 · Observe",
    "title": "Small choices that change the result",
    "blocks": [
     {
      "kind": "p",
      "text": "Networks are sensitive to details that linear models shrug off: the scale of the inputs, the random starting weights, and when to stop. A safe workflow fixes those details and reports how much they matter."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What must you do before training, during training and when reporting a network?"
     }
    ]
   },
   {
    "id": "nn4-express",
    "kicker": "2 · Express",
    "title": "Scale, seed, stop",
    "blocks": [
     {
      "kind": "p",
      "text": "Scale inputs inside a pipeline so the scaler learns only from training rows. Fix the random seed and also try several seeds to see the spread. Use early stopping: hold out part of the training data and stop when its loss stops improving."
     },
     {
      "kind": "eq",
      "lines": [
       "scale (train statistics only) → fit → watch validation loss → stop early → score the test once"
      ],
      "note": "Stopping early is a form of regularisation."
     }
    ]
   },
   {
    "id": "nn4-visualize",
    "kicker": "3 · Visualize",
    "title": "What scaling did",
    "blocks": [
     {
      "kind": "p",
      "text": "1,500 simulated customers with income in rupees and age in years. 900 for training, 600 for testing, one hidden layer of 16 units."
     },
     {
      "kind": "table",
      "caption": "Same network, with and without scaling",
      "headers": [
       "Setup",
       "Test accuracy",
       "Iterations"
      ],
      "rows": [
       [
        "No scaling",
        "0.518",
        "12"
       ],
       [
        "With scaling",
        "0.815",
        "141"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Without scaling, income has values near 60,000 and swamps the weights. The network barely trains and stops after 12 iterations at roughly guessing level."
     }
    ]
   },
   {
    "id": "nn4-discover",
    "kicker": "4 · Discover",
    "title": "Seeds and early stopping",
    "blocks": [
     {
      "kind": "p",
      "text": "Eight random starts of the scaled network gave test accuracies from 0.815 to 0.832, a range of 0.017. A single run is one draw from that spread. Early stopping with a 64-unit network used 42 iterations and scored 0.818."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Scale in a pipeline, test several seeds, stop early, and report the spread rather than one lucky run."
     }
    ]
   },
   {
    "id": "nn4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a fair comparison. If a network scores 0.828 and logistic regression 0.820, the 0.008 gap is smaller than the 0.017 seed range. It is not a win."
     },
     {
      "kind": "p",
      "text": "Example 2, a hidden leak. Fitting the scaler on all rows before splitting uses test-set means and spreads. With a pipeline, cross-validation refits the scaler every fold."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Production training pipelines that retrain on a schedule and must give stable results."
     },
     {
      "kind": "check",
      "question": "You trained once with seed 0 and got 0.832. What should you do before reporting?",
      "options": [
       "Report 0.832",
       "Train with several seeds and report the spread",
       "Pick the best seed"
      ],
      "answer": 1,
      "why": "One run is one draw from a spread. Report the spread, and do not pick the best seed."
     }
    ]
   },
   {
    "id": "nn4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Unscaled inputs",
      "text": "Training stalls or is dominated by the largest column."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Stopping on the test score",
      "text": "Early stopping uses validation rows only."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reporting the best seed",
      "text": "That is a search, and its winner is optimistic."
     }
    ]
   },
   {
    "id": "nn4-python",
    "kicker": "7 · In Python",
    "title": "Scale, seeds and early stopping",
    "blocks": [
     {
      "kind": "code",
      "caption": "Scaling, eight seeds, and early stopping",
      "code": "import numpy as np\nimport warnings\nfrom sklearn.exceptions import ConvergenceWarning\nfrom sklearn.neural_network import MLPClassifier\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.model_selection import train_test_split\nwarnings.simplefilter(\"ignore\", ConvergenceWarning)\n\nrng = np.random.default_rng(10)\nn = 1500\nincome = rng.normal(60000, 20000, n)\nage = rng.normal(40, 10, n)\ny = ((income - 60000) / 20000 * 0.8 + (age - 40) / 10 * 0.8 + rng.normal(0, 0.7, n) > 0).astype(int)\nX = np.column_stack([income, age])\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.4, random_state=0, stratify=y)\n\nraw = MLPClassifier(hidden_layer_sizes=(16,), max_iter=500, random_state=0).fit(Xtr, ytr)\nsc = make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(16,), max_iter=500, random_state=0)).fit(Xtr, ytr)\nprint(\"no scaling   test acc\", round(raw.score(Xte, yte), 3), \"| iterations\", raw.n_iter_)\nprint(\"with scaling test acc\", round(sc.score(Xte, yte), 3), \"| iterations\", sc[-1].n_iter_)\n\naccs = []\nfor seed in range(8):\n    m = make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(16,), max_iter=500, random_state=seed)).fit(Xtr, ytr)\n    accs.append(m.score(Xte, yte))\nprint(\"eight random starts:\", np.round(accs, 3), \"| range\", round(max(accs) - min(accs), 3))\n\nes = make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(64,), early_stopping=True, validation_fraction=0.2, n_iter_no_change=10, max_iter=1000, random_state=0)).fit(Xtr, ytr)\nprint(\"early stopping stopped after\", es[-1].n_iter_, \"iterations; test acc\", round(es.score(Xte, yte), 3))",
      "output": "no scaling   test acc 0.518 | iterations 12\nwith scaling test acc 0.815 | iterations 141\neight random starts: [0.815 0.823 0.832 0.822 0.828 0.82  0.823 0.827] | range 0.017\nearly stopping stopped after 42 iterations; test acc 0.818"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The only difference between 0.518 and 0.815 was one line of scaling."
     }
    ]
   }
  ]
 },
 {
  "title": "Limits and honest interpretation",
  "minutes": 13,
  "sections": [
   {
    "id": "nn5-observe",
    "kicker": "1 · Observe",
    "title": "What a network cannot do for you",
    "blocks": [
     {
      "kind": "p",
      "text": "A network is a flexible curve-fitter. It does not know about the world outside its training data, it does not explain itself, and on small tabular data it often loses to simpler models."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Where do networks fail quietly, and what should you compare them against?"
     }
    ]
   },
   {
    "id": "nn5-express",
    "kicker": "2 · Express",
    "title": "Interpolation is safe, extrapolation is a guess",
    "blocks": [
     {
      "kind": "p",
      "text": "A model is anchored by the data it saw. Inside the range of the data it interpolates. Outside, it continues whatever shape it learned at the edge, with no sign that it is guessing."
     },
     {
      "kind": "eq",
      "lines": [
       "trust the prediction less the further x lies outside the training range"
      ],
      "note": "Check each new input against the training range before using a prediction."
     }
    ]
   },
   {
    "id": "nn5-visualize",
    "kicker": "3 · Visualize",
    "title": "Beyond the data",
    "blocks": [
     {
      "kind": "p",
      "text": "400 simulated points from a plain upward trend, y = 3x plus noise, with x between 0 and 10. Predictions for x = 15 and x = 25, outside the data."
     },
     {
      "kind": "table",
      "caption": "Predictions outside the training range",
      "headers": [
       "x",
       "True value",
       "Linear",
       "Forest",
       "MLP"
      ],
      "rows": [
       [
        "5",
        "15.0",
        "14.9",
        "16.0",
        "14.9"
       ],
       [
        "10",
        "30.0",
        "30.0",
        "29.3",
        "30.0"
       ],
       [
        "15",
        "45.0",
        "45.0",
        "29.3",
        "44.7"
       ],
       [
        "25",
        "75.0",
        "75.0",
        "29.3",
        "74.1"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The forest stays flat at about 29.3 for every x beyond the data, because trees cannot predict outside the values they saw. The MLP happened to continue the straight trend. It would continue a curve's last slope just as confidently, and it gives no warning either way."
     }
    ]
   },
   {
    "id": "nn5-discover",
    "kicker": "4 · Discover",
    "title": "Compare before you commit",
    "blocks": [
     {
      "kind": "p",
      "text": "On tabular data, race the network against a regularised linear model and a boosted tree model, using the same rows and metric. Networks tend to win with large data, images, text or audio, and tend to tie or lose on small tables. Explanations also cost more: permutation importance and column groups, as in Model Selection, are the usual tools."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A network is a strong tool with weak guarantees. Check its range, race it against simpler models and explain it carefully."
     }
    ]
   },
   {
    "id": "nn5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a range check. A rent model trained on flats of 30 to 130 sq m is asked about a 400 sq m penthouse. Flag the input as outside the training range instead of returning a price."
     },
     {
      "kind": "p",
      "text": "Example 2, a fair comparison. Suppose a tuned MLP scores 0.828 and logistic regression 0.820 on the same 1,500 customers. The simpler model is easier to audit and cheaper to run, and the gap is inside the seed noise."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Credit, pricing and health risk, where the people affected may ask why, and unusual inputs must be caught."
     },
     {
      "kind": "check",
      "question": "A model is asked about an input far outside its training range. What is the safest response?",
      "options": [
       "Trust the output",
       "Flag it as out of range",
       "Round the output"
      ],
      "answer": 1,
      "why": "The model cannot know it is guessing. A range check should catch such inputs before anyone relies on the prediction."
     }
    ]
   },
   {
    "id": "nn5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting predictions outside the data",
      "text": "The output looks as confident as inside the range."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Skipping the simple baseline",
      "text": "If logistic regression is within noise, use it."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Explaining with a single column",
      "text": "Interacting and correlated columns share credit. Group them."
     }
    ]
   },
   {
    "id": "nn5-python",
    "kicker": "7 · In Python",
    "title": "Beyond the training range",
    "blocks": [
     {
      "kind": "code",
      "caption": "Three models asked about inputs outside the data",
      "code": "import numpy as np\nimport warnings\nfrom sklearn.exceptions import ConvergenceWarning\nfrom sklearn.neural_network import MLPRegressor\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\nwarnings.simplefilter(\"ignore\", ConvergenceWarning)\n\nrng = np.random.default_rng(2)\nx = rng.uniform(0, 10, 400).reshape(-1, 1)\ny = 3 * x[:, 0] + rng.normal(0, 1.0, 400)               # a plain upward trend\nmodels = {\n    \"linear\": LinearRegression(),\n    \"forest\": RandomForestRegressor(100, random_state=0),\n    \"MLP\": make_pipeline(StandardScaler(), MLPRegressor(hidden_layer_sizes=(32,), max_iter=3000, random_state=0)),\n}\nfor m in models.values():\n    m.fit(x, y)\nprint(\"x    | truth |\", \" | \".join(k.ljust(6) for k in models))\nfor xv in [5.0, 10.0, 15.0, 25.0]:\n    row = [round(float(m.predict([[xv]])[0]), 1) for m in models.values()]\n    print(str(xv).ljust(4), \"|\", str(3 * xv).ljust(5), \"|\", \" | \".join(str(v).ljust(6) for v in row))",
      "output": "x    | truth | linear | forest | MLP   \n5.0  | 15.0  | 14.9   | 16.0   | 14.9  \n10.0 | 30.0  | 30.0   | 29.3   | 30.0  \n15.0 | 45.0  | 45.0   | 29.3   | 44.7  \n25.0 | 75.0  | 75.0   | 29.3   | 74.1"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Check the input range first, then trust the output."
     }
    ]
   }
  ]
 }
];
