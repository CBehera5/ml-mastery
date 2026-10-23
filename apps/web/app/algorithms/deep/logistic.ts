import type {DeepLesson} from "../../math/teaching/deep-read";
export const LOGISTIC_DEEP:DeepLesson[]=[
 {
  "title": "From a score to a probability",
  "minutes": 13,
  "sections": [
   {
    "id": "lg1-observe",
    "kicker": "1 · Observe",
    "title": "Why a straight line is the wrong tool for yes or no",
    "blocks": [
     {
      "kind": "p",
      "text": "A lender wants to know whether a borrower will default. The raw material is a score, built from things like missed payments, that rises as risk rises. But a lender needs a probability, a number between 0 and 1 that can be compared with a cut-off or priced into a loan. A score of 7.3 is not a probability, and a score of −2 certainly is not."
     },
     {
      "kind": "p",
      "text": "The obvious idea is to draw a straight line through the 0 and 1 labels. Try it on nine borrowers, 0 for repaid and 1 for defaulted. The line predicts −0.09 for a borrower with no missed payments and 1.40 for one with twelve. Neither is a possible probability."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do you turn an unbounded score into a number between 0 and 1 that behaves like a probability?"
     }
    ]
   },
   {
    "id": "lg1-express",
    "kicker": "2 · Express",
    "title": "Squash the score with the sigmoid",
    "blocks": [
     {
      "kind": "p",
      "text": "Keep the linear score, z = b + w × x, since it is easy to learn and easy to read. Then pass it through the sigmoid function, σ(z) = 1 / (1 + e^(−z)). Whatever z is, the output lands between 0 and 1. Large negative scores go to nearly 0, a score of 0 gives exactly 0.5, and large positive scores go to nearly 1."
     },
     {
      "kind": "eq",
      "lines": [
       "z = −3 + 0.8 × (missed payments)",
       "probability = 1 / (1 + e^(−z))"
      ],
      "note": "A loan-default score. The base of −3 means a borrower with no missed payments starts well below 50%."
     }
    ]
   },
   {
    "id": "lg1-visualize",
    "kicker": "3 · Visualize",
    "title": "Watch the S-curve climb",
    "blocks": [
     {
      "kind": "table",
      "caption": "Default probability by missed payments",
      "headers": [
       "Missed payments",
       "Score z",
       "Probability",
       "Odds (p ÷ (1 − p))"
      ],
      "rows": [
       [
        "0",
        "−3.0",
        "0.047",
        "0.05"
       ],
       [
        "2",
        "−1.4",
        "0.198",
        "0.25"
       ],
       [
        "4",
        "0.2",
        "0.550",
        "1.22"
       ],
       [
        "6",
        "1.8",
        "0.858",
        "6.05"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Probability rises slowly at first, fastest around 50%, then slowly again as it approaches 1. That S shape is the sigmoid. Slide the score in the playground and watch the probability follow it, never leaving the zero-to-one range."
     }
    ]
   },
   {
    "id": "lg1-discover",
    "kicker": "4 · Discover",
    "title": "The weight is a change in log-odds",
    "blocks": [
     {
      "kind": "p",
      "text": "Odds are probability divided by the chance of the opposite: 0.2 chance means odds of 0.25, one to four. Taking the log of the odds gives the score itself, which is why the sigmoid is called the inverse of the log-odds. In odds terms, every extra missed payment multiplies the odds by e^0.8 = 2.23. Look at the table: 0.05, then 0.25 after two payments is 0.25 / 0.05 = 5 = 2.23², and 1.22 / 0.25 ≈ 4.9 again."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Logistic regression is linear regression on the log-odds: the score is a straight line, the probability is its S-shaped squash."
     },
     {
      "kind": "p",
      "text": "This gives the weights a plain meaning. A positive weight raises the odds, a negative one lowers them, and the size says by how many times."
     }
    ]
   },
   {
    "id": "lg1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, from score to decision. A borrower has 4 missed payments, so z = 0.2 and the probability is 0.55. A lender who flags anyone above 0.5 flags this borrower, but only just. One more missed payment moves z to 1.0 and the probability to 0.73."
     },
     {
      "kind": "p",
      "text": "Example 2, reading a weight. A churn model has weight 0.5 on “support calls”. Each extra call multiplies the odds of leaving by e^0.5 = 1.65. A customer at 20% churn (odds 0.25) with one more call has odds 0.41, which is about 29%."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Credit risk, churn, medical screening, spam, click prediction: anywhere the answer is yes or no and a probability is useful."
     },
     {
      "kind": "check",
      "question": "A score is z = 0. What is the probability?",
      "options": [
       "0.5",
       "0",
       "1"
      ],
      "answer": 0,
      "why": "σ(0) = 1 / (1 + e⁰) = 1 / 2 = 0.5. A score of zero means equally likely either way."
     }
    ]
   },
   {
    "id": "lg1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading a weight as a change in probability",
      "text": "A weight changes the log-odds by a fixed amount. The change in probability depends on where you start, and is biggest near 50%."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Forgetting probabilities are estimates",
      "text": "The model outputs its best belief given the data it saw. It is only as good as that data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Using a line for 0/1 data",
      "text": "Straight-line fits to labels give impossible values and are distorted by extreme rows. The sigmoid prevents both."
     }
    ]
   },
   {
    "id": "lg1-python",
    "kicker": "7 · In Python",
    "title": "The S-curve and the failed line, in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Sigmoid probabilities, odds ratio, and why a line fails",
      "code": "import numpy as np\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\n# a loan-default score: base -3, plus 0.8 for every missed payment\nfor missed in [0, 2, 4, 6]:\n    z = -3 + 0.8 * missed\n    print(missed, \"score\", round(z, 1), \"probability\", round(sigmoid(z), 3), \"odds\", round(np.exp(z), 3))\nprint(\"odds multiply by\", round(np.exp(0.8), 2), \"per extra missed payment\")\n\n# why not just draw a line through 0/1 labels?\nmissed = np.array([0, 1, 2, 3, 4, 5, 6, 8, 10], float)\ndefault = np.array([0, 0, 0, 0, 1, 0, 1, 1, 1], float)\nslope, intercept = np.polyfit(missed, default, 1)\nprint(\"line predicts at 0 and 12 missed payments:\", round(intercept, 2), round(intercept + slope * 12, 2))",
      "output": "0 score -3.0 probability 0.047 odds 0.05\n2 score -1.4 probability 0.198 odds 0.247\n4 score 0.2 probability 0.55 odds 1.221\n6 score 1.8 probability 0.858 odds 6.05\nodds multiply by 2.23 per extra missed payment\nline predicts at 0 and 12 missed payments: -0.09 1.4"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Score first, squash second. The sigmoid keeps the answer a valid probability, and each weight multiplies the odds."
     }
    ]
   }
  ]
 },
 {
  "title": "Learn the weights with log loss",
  "minutes": 13,
  "sections": [
   {
    "id": "lg2-observe",
    "kicker": "1 · Observe",
    "title": "How should a model be punished for a confident miss?",
    "blocks": [
     {
      "kind": "p",
      "text": "A model says a borrower has only a 1% chance of defaulting, and they default. Another model said 40%. Both were wrong in the sense that the borrower defaulted, but the first model was far more wrong, since it was nearly certain. We need a loss that grows enormously for confident mistakes, and stays small for honest uncertainty."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What loss makes a model learn good probabilities, and how do you minimise it?"
     }
    ]
   },
   {
    "id": "lg2-express",
    "kicker": "2 · Express",
    "title": "Loss is minus the log of the probability you gave the truth",
    "blocks": [
     {
      "kind": "p",
      "text": "For a borrower who defaults (y = 1) the model's probability for the truth is p. For one who repays (y = 0) it is 1 − p. Log loss is −ln of the probability given to what actually happened, averaged over borrowers."
     },
     {
      "kind": "eq",
      "lines": [
       "loss = −[ y ln p + (1 − y) ln(1 − p) ]",
       "y = 1, p = 0.9  →  0.105",
       "y = 1, p = 0.5  →  0.693",
       "y = 1, p = 0.1  →  2.303",
       "y = 1, p = 0.01 →  4.605"
      ],
      "note": "You met this as the negative log-likelihood. Confident wrong answers are punished hard."
     }
    ]
   },
   {
    "id": "lg2-visualize",
    "kicker": "3 · Visualize",
    "title": "Walk downhill on the loss",
    "blocks": [
     {
      "kind": "p",
      "text": "Take four customers with a score input x = 0, 1, 2, 3, and outcomes 0, 0, 1, 1. Start with w = 0 and b = 0, so every probability is 0.5 and the loss is ln 2 = 0.693. Now compute the slopes. For this loss the gradient has a beautifully simple form: the average of (p − y) × x for the weight and the average of (p − y) for the intercept."
     },
     {
      "kind": "table",
      "caption": "Eight steps of gradient descent, learning rate 1",
      "headers": [
       "Step",
       "w",
       "b",
       "Loss"
      ],
      "rows": [
       [
        "0",
        "0.000",
        "0.000",
        "0.693"
       ],
       [
        "1",
        "0.500",
        "0.000",
        "0.545"
       ],
       [
        "2",
        "0.616",
        "−0.168",
        "0.506"
       ],
       [
        "3",
        "0.709",
        "−0.331",
        "0.471"
       ],
       [
        "5",
        "0.872",
        "−0.630",
        "0.415"
       ],
       [
        "7",
        "1.016",
        "−0.892",
        "0.372"
       ]
      ]
     }
    ]
   },
   {
    "id": "lg2-discover",
    "kicker": "4 · Discover",
    "title": "The gradient is just the miss, times the input",
    "blocks": [
     {
      "kind": "p",
      "text": "At step 0 every p is 0.5, so (p − y) is (0.5, 0.5, −0.5, −0.5). Multiply by x = (0, 1, 2, 3): (0, 0.5, −1, −1.5). The average is −0.5, which is the first gradient for w. A negative gradient says raising w lowers the loss, so the step moves w from 0 to 0.5."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Each weight moves in proportion to how wrong the model was times how much that input was involved. A confident mistake on a large input produces a big correction."
     },
     {
      "kind": "p",
      "text": "The same shape appears in linear regression with squared loss. That shared form is why one training loop handles both, and neural networks too."
     }
    ]
   },
   {
    "id": "lg2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a step by hand. After step 1 the weights are w = 0.5, b = 0. Customer x = 2 now has z = 1.0 and p = 0.731. The miss is p − y = 0.731 − 1 = −0.269, which pushes w upwards a little more. Customer x = 0 has p = 0.5 and y = 0, so a miss of 0.5 pushes b down, which is why b turns negative at step 2."
     },
     {
      "kind": "p",
      "text": "Example 2, why not squared error. With squared error on a confident wrong prediction the slope flattens out, so the model learns slowly exactly when it is most wrong. Log loss keeps a strong slope there. That is why it is the standard choice for probabilities."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every classifier that outputs probabilities, including neural networks, is trained on this loss, usually called cross-entropy."
     },
     {
      "kind": "check",
      "question": "A borrower defaults, and the model gave a default probability of 0.01. Roughly what is the log loss for this row?",
      "options": [
       "4.6",
       "0.01",
       "0.99"
      ],
      "answer": 0,
      "why": "−ln 0.01 = 4.605. A confident miss costs far more than a hesitant one."
     }
    ]
   },
   {
    "id": "lg2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Too large a learning rate",
      "text": "Steps that overshoot make the loss rise or bounce. Halve it and try again."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Judging by loss on training data only",
      "text": "Log loss on training rows always keeps falling with more flexibility. Check it on held-out data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Treating loss as accuracy",
      "text": "A model can lower its log loss while accuracy stays the same, because it becomes better calibrated, not more often right."
     }
    ]
   },
   {
    "id": "lg2-python",
    "kicker": "7 · In Python",
    "title": "Gradient descent for logistic regression, from scratch",
    "blocks": [
     {
      "kind": "code",
      "caption": "Eight steps, printing the weights, loss and gradient",
      "code": "import numpy as np\n\nx = np.array([0.0, 1.0, 2.0, 3.0])\ny = np.array([0.0, 0.0, 1.0, 1.0])\nw, b, lr = 0.0, 0.0, 1.0\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\nfor step in range(8):\n    p = sigmoid(w * x + b)\n    loss = -(y * np.log(p) + (1 - y) * np.log(1 - p)).mean()\n    gw = ((p - y) * x).mean()\n    gb = (p - y).mean()\n    print(step, \"w\", round(w, 3), \"b\", round(b, 3), \"loss\", round(loss, 3), \"gradient\", round(gw, 3), round(gb, 3))\n    w, b = w - lr * gw, b - lr * gb",
      "output": "0 w 0.0 b 0.0 loss 0.693 gradient -0.5 0.0\n1 w 0.5 b 0.0 loss 0.545 gradient -0.116 0.168\n2 w 0.616 b -0.168 loss 0.506 gradient -0.094 0.164\n3 w 0.709 b -0.331 loss 0.471 gradient -0.084 0.154\n4 w 0.794 b -0.486 loss 0.441 gradient -0.079 0.144\n5 w 0.872 b -0.63 loss 0.415 gradient -0.074 0.135\n6 w 0.946 b -0.765 loss 0.392 gradient -0.07 0.127\n7 w 1.016 b -0.892 loss 0.372 gradient -0.066 0.119"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Log loss punishes confident mistakes. Its gradient is the miss times the input, so training is just repeated small corrections."
     }
    ]
   }
  ]
 },
 {
  "title": "Thresholds, and what to do when positives are rare",
  "minutes": 13,
  "sections": [
   {
    "id": "lg3-observe",
    "kicker": "1 · Observe",
    "title": "A fraud model that never flags anything",
    "blocks": [
     {
      "kind": "p",
      "text": "A bank scores 6,000 card transactions, and about 1.8 percent are fraud. A model that says “genuine” every time is right 98.2 percent of the time. That is a high accuracy and a useless model, because the entire job is to find the fraud."
     },
     {
      "kind": "p",
      "text": "Our logistic model has a different problem. At the usual 0.5 cut-off it flags exactly one transaction in the 2,400 held-out ones, and it is wrong. It outputs honest probabilities, but they are almost always small, because fraud is rare."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "If probabilities are honest but low, where should the cut-off go, and how do you choose it?"
     }
    ]
   },
   {
    "id": "lg3-express",
    "kicker": "2 · Express",
    "title": "The cut-off is a business decision",
    "blocks": [
     {
      "kind": "p",
      "text": "The model gives a probability. A threshold turns it into an action: flag when p is at least t. Moving t trades two kinds of mistake. A low threshold catches more fraud (high recall) but flags many genuine customers (low precision). A high threshold is the reverse."
     },
     {
      "kind": "eq",
      "lines": [
       "precision = flagged and truly fraud ÷ flagged",
       "recall = flagged and truly fraud ÷ all fraud"
      ],
      "note": "Both matter, and the right balance depends on the cost of each mistake."
     }
    ]
   },
   {
    "id": "lg3-visualize",
    "kicker": "3 · Visualize",
    "title": "Sweep the threshold",
    "blocks": [
     {
      "kind": "table",
      "caption": "The same model at four thresholds (2,400 transactions, about 44 fraud)",
      "headers": [
       "Threshold",
       "Flagged",
       "Precision",
       "Recall"
      ],
      "rows": [
       [
        "0.50",
        "1",
        "0.00",
        "0.00"
       ],
       [
        "0.30",
        "15",
        "0.53",
        "0.18"
       ],
       [
        "0.10",
        "101",
        "0.20",
        "0.45"
       ],
       [
        "0.05",
        "242",
        "0.11",
        "0.61"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "At 0.3 you flag 15 transactions and just over half are fraud, but you catch only 18 percent of all fraud. At 0.05 you flag 242 and catch 61 percent, though only 11 percent of flags are real. Drag the threshold in the playground to see the numbers move together."
     }
    ]
   },
   {
    "id": "lg3-discover",
    "kicker": "4 · Discover",
    "title": "Choose the threshold from costs, not from 0.5",
    "blocks": [
     {
      "kind": "p",
      "text": "Suppose reviewing a flagged transaction costs ₹50 of analyst time, and missing a fraud costs ₹5,000. Flagging pays off whenever the chance of fraud exceeds 50 / 5,000 = 1 percent. The best threshold is then near 0.01, far below 0.5. A threshold of 0.5 is only right when both mistakes cost the same and classes are balanced."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "The model supplies probabilities, and the costs you face decide the threshold."
     },
     {
      "kind": "p",
      "text": "Class weights and resampling can reshape what the model learns, but changing the threshold is the simplest first move, and it leaves the probabilities honest."
     }
    ]
   },
   {
    "id": "lg3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the cost sum. At threshold 0.1 the model flags 101 and catches 20 of 44 fraud (recall 0.455). Review cost: 101 × ₹50 = ₹5,050. Missed fraud: 24 × ₹5,000 = ₹120,000. At threshold 0.05 it flags 242 and catches 27: review ₹12,100, missed 17 × ₹5,000 = ₹85,000. Total ₹97,100 against ₹125,050, so 0.05 is cheaper."
     },
     {
      "kind": "p",
      "text": "Example 2, a quiet alert. A hospital wants few false alarms because staff stop trusting noisy alerts. It accepts lower recall, picks a higher threshold such as 0.3, and reviews the misses separately. The same model, a different cut-off, matched to a different cost."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Fraud, rare disease screening, safety alarms, churn campaigns: any problem where one outcome is rare and mistakes cost different amounts."
     },
     {
      "kind": "check",
      "question": "Missing a case costs 99 times more than a false alarm. At about what probability is it worth flagging?",
      "options": [
       "1%",
       "50%",
       "99%"
      ],
      "answer": 0,
      "why": "Flag when the chance of a real case times its cost exceeds the false-alarm cost: p × 99 ≥ (1 − p) × 1, which gives p ≥ 0.01."
     }
    ]
   },
   {
    "id": "lg3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reporting accuracy on rare classes",
      "text": "Always saying “genuine” scores 98 percent. Report precision and recall for the rare class."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Picking the threshold on the test set",
      "text": "Choose it on validation data, then check once on the test set."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Assuming the threshold stays valid",
      "text": "If the fraud rate doubles next year the best threshold moves. Monitor it."
     }
    ]
   },
   {
    "id": "lg3-python",
    "kicker": "7 · In Python",
    "title": "Precision and recall across thresholds",
    "blocks": [
     {
      "kind": "code",
      "caption": "Fraud model at four thresholds",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import precision_score, recall_score\n\nrng = np.random.default_rng(5)\nn = 6000\namount = rng.normal(0, 1, n)\nnight = rng.normal(0, 1, n)\nlogit = -5.2 + 1.3 * amount + 1.0 * night\nfraud = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)\nX = np.column_stack([amount, night])\nX_tr, X_te, y_tr, y_te = train_test_split(X, fraud, test_size=0.4, random_state=0, stratify=fraud)\nprint(\"fraud rate:\", round(fraud.mean(), 3), \"| always-genuine accuracy:\", round(1 - y_te.mean(), 3))\n\nplain = LogisticRegression().fit(X_tr, y_tr)\np = plain.predict_proba(X_te)[:, 1]\nfor t in [0.5, 0.3, 0.1, 0.05]:\n    pred = (p >= t).astype(int)\n    print(\"threshold\", t, \"flagged\", int(pred.sum()), \"precision\", round(precision_score(y_te, pred, zero_division=0), 3), \"recall\", round(recall_score(y_te, pred), 3))",
      "output": "fraud rate: 0.018 | always-genuine accuracy: 0.982\nthreshold 0.5 flagged 1 precision 0.0 recall 0.0\nthreshold 0.3 flagged 15 precision 0.533 recall 0.182\nthreshold 0.1 flagged 101 precision 0.198 recall 0.455\nthreshold 0.05 flagged 242 precision 0.112 recall 0.614"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Probabilities come from the model, thresholds come from the costs. Always report precision and recall for the rare class."
     }
    ]
   }
  ]
 },
 {
  "title": "Regularisation and the geometry of the boundary",
  "minutes": 12,
  "sections": [
   {
    "id": "lg4-observe",
    "kicker": "1 · Observe",
    "title": "When the data is too easy",
    "blocks": [
     {
      "kind": "p",
      "text": "Six borrowers, income in ₹ lakh. The three with incomes of 2, 3 and 4 defaulted. The three with 6, 7 and 8 repaid. The groups do not overlap at all. Any cut-off between 4 and 6 separates them perfectly. Logistic regression must pick one, and there are infinitely many. Worse, the more extreme the weights, the better the loss, so the weights grow without end."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What stops a perfectly separable problem from sending the weights to infinity, and what does the decision boundary look like?"
     }
    ]
   },
   {
    "id": "lg4-express",
    "kicker": "2 · Express",
    "title": "A boundary where the score is zero",
    "blocks": [
     {
      "kind": "p",
      "text": "The model says repaid when p > 0.5, which is the same as the score z = b + w × x being positive. The boundary is where z = 0, at x = −b / w. With one income column that is a single cut-off. With two columns it is a straight line, and with many, a flat surface."
     },
     {
      "kind": "p",
      "text": "The weight controls how sharply probability changes around the boundary. A small weight gives a gentle slope, with p only slowly rising. A huge weight gives a cliff: 0.001 on one side and 0.999 on the other."
     }
    ]
   },
   {
    "id": "lg4-visualize",
    "kicker": "3 · Visualize",
    "title": "Turn the brake with C",
    "blocks": [
     {
      "kind": "p",
      "text": "Scikit-learn's C is the inverse of the penalty strength from the Regularisation module: small C means a strong brake. Fit the six borrowers at several strengths."
     },
     {
      "kind": "table",
      "caption": "Weight on income, six perfectly separated borrowers",
      "headers": [
       "C",
       "Weight",
       "P(repay | income 5)"
      ],
      "rows": [
       [
        "0.1",
        "0.36",
        "0.50"
       ],
       [
        "1",
        "1.10",
        "0.50"
       ],
       [
        "100",
        "3.95",
        "0.50"
       ],
       [
        "1,000,000",
        "6.94",
        "0.55"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Every setting puts the boundary near 5, the midpoint. What changes is the confidence. With a strong brake the weight is 0.36 and the model never gets confident. With almost no brake it is 6.94 and still rising, since there is no limit but patience. Slide C in the playground."
     }
    ]
   },
   {
    "id": "lg4-discover",
    "kicker": "4 · Discover",
    "title": "A penalty gives separable data a finite answer",
    "blocks": [
     {
      "kind": "p",
      "text": "Without a penalty, a perfect split can always be made sharper, so the best weight is infinite. The penalty makes that expensive, so a finite weight wins. The size of the compromise is controlled by C, as ridge and lasso did in regression."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "The boundary sits where the score is zero, the weights set how sharply probability changes across it, and regularisation keeps those weights from running away."
     },
     {
      "kind": "p",
      "text": "L2 penalties shrink every weight smoothly. L1 penalties can set some exactly to zero and select features, just as with lasso."
     }
    ]
   },
   {
    "id": "lg4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, locating the boundary. For C = 1 the weight is 1.10 and the intercept is −5.52, so z = 0 at x = 5.52 / 1.10 ≈ 5.0. A borrower at income 6 has z = 1.1 × 6 − 5.52 = 1.08 and p = 0.75. At income 4, p = 0.25."
     },
     {
      "kind": "p",
      "text": "Example 2, why probabilities matter. If you will price loans from the probabilities, the strongly regularised model is more honest: it says 0.75 at income 6 where the barely regularised one says 0.99. The data cannot justify 0.99 from six borrowers."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Any classifier on small or very clean data, text models with huge vocabularies, and genomics. It is also what the C setting in support vector machines controls."
     },
     {
      "kind": "check",
      "question": "A logistic model has weight 2 and intercept −8. Where is the 50% boundary?",
      "options": [
       "x = 4",
       "x = 8",
       "x = 2"
      ],
      "answer": 0,
      "why": "The boundary is where the score is zero: 2x − 8 = 0, so x = 4."
     }
    ]
   },
   {
    "id": "lg4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting huge weights",
      "text": "Very large weights on a small dataset usually mean the data separated itself by luck, not that you found a law."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Forgetting to scale before penalising",
      "text": "The same strength punishes columns on different scales differently. Standardise first."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading confidence as certainty",
      "text": "A probability of 0.99 from six rows is not trustworthy. Check calibration on held-out data."
     }
    ]
   },
   {
    "id": "lg4-python",
    "kicker": "7 · In Python",
    "title": "The weight under four penalty strengths",
    "blocks": [
     {
      "kind": "code",
      "caption": "Perfectly separable data and the C setting",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\n\n# income (Rs lakh) against repaid (1) or not (0): the two groups do not overlap at all\nx = np.array([[2.0], [3.0], [4.0], [6.0], [7.0], [8.0]])\ny = np.array([0, 0, 0, 1, 1, 1])\n\nfor C in [0.1, 1, 100, 1e6]:\n    m = LogisticRegression(C=C, max_iter=10000).fit(x, y)\n    print(\"C\", C, \"weight\", m.coef_.round(2).ravel(), \"intercept\", m.intercept_.round(2), \"P(repay | 5)\", round(m.predict_proba([[5.0]])[0, 1], 3))",
      "output": "C 0.1 weight [0.36] intercept [-1.82] P(repay | 5) 0.5\nC 1 weight [1.1] intercept [-5.52] P(repay | 5) 0.5\nC 100 weight [3.95] intercept [-19.73] P(repay | 5) 0.5\nC 1000000.0 weight [6.94] intercept [-34.54] P(repay | 5) 0.545"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The boundary is where the score is zero. Regularisation stops weights growing forever when the data is perfectly separable."
     }
    ]
   }
  ]
 },
 {
  "title": "A classification workflow you can trust",
  "minutes": 13,
  "sections": [
   {
    "id": "lg5-observe",
    "kicker": "1 · Observe",
    "title": "A model that is good, and how you would know",
    "blocks": [
     {
      "kind": "p",
      "text": "You build a default model from income, missed payments and age on 3,000 loans. You can tune it, score it and report a number. But which number, measured on which data, against what baseline? Every step in that chain is a place to fool yourself."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does a trustworthy logistic regression workflow look like from raw data to final score?"
     }
    ]
   },
   {
    "id": "lg5-express",
    "kicker": "2 · Express",
    "title": "Five steps in a fixed order",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Split first. Set aside a stratified test set, so rare classes appear in both parts.",
       "Put the scaler and the model in a single pipeline, so each cross-validation fold fits its own scaler.",
       "Choose the penalty C by cross-validation on the development data, scoring with log loss.",
       "Fit on all development data with the chosen C and predict the test set once.",
       "Compare against a baseline that predicts the base rate, and report log loss, AUC and calibration, not only accuracy."
      ]
     },
     {
      "kind": "p",
      "text": "The baseline is essential. A model is only useful by how much it improves on the simplest honest guess, the overall default rate for everyone."
     }
    ]
   },
   {
    "id": "lg5-visualize",
    "kicker": "3 · Visualize",
    "title": "Reading the result",
    "blocks": [
     {
      "kind": "table",
      "caption": "Results on 750 held-out loans",
      "headers": [
       "Model",
       "Log loss (lower is better)",
       "AUC (higher is better)"
      ],
      "rows": [
       [
        "Base rate only",
        "0.595",
        "0.50"
       ],
       [
        "Logistic regression, C = 1",
        "0.477",
        "0.795"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Cross-validation chose C = 1. The model cuts log loss from 0.595 to 0.477 and ranks borrowers well: an AUC of 0.795 means that if you pick one defaulter and one repayer at random, the model gives the defaulter the higher risk about 80 percent of the time. The Brier score of 0.157 measures how close the probabilities are to the 0/1 outcomes."
     }
    ]
   },
   {
    "id": "lg5-discover",
    "kicker": "4 · Discover",
    "title": "Three questions every result must answer",
    "blocks": [
     {
      "kind": "p",
      "text": "Better than what? The base-rate baseline answers that. Measured on what? The untouched test set answers that. Honest about confidence? Log loss and the Brier score reward probabilities that mean what they say, while AUC only checks the ranking."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A trustworthy score comes from a split made first, steps fitted inside folds, a baseline to beat, and metrics that check both ranking and probabilities."
     },
     {
      "kind": "p",
      "text": "If a model has a good AUC but poor log loss, it ranks well but its probabilities are off. You can often fix that with calibration, then use the probabilities for pricing or thresholds."
     }
    ]
   },
   {
    "id": "lg5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a leak caught. Someone standardises all 3,000 rows before splitting. The test rows have influenced the averages used for scaling. The effect is small for scaling, but the same mistake with feature selection or target encoding can be large. Keeping every fitted step in the pipeline makes the mistake impossible."
     },
     {
      "kind": "p",
      "text": "Example 2, what to write in the report. “Stratified 75/25 split, 5-fold CV on development data chose C = 1 by log loss, test log loss 0.477 against 0.595 for the base rate, AUC 0.795, test set used once.” A reader knows exactly how far to trust it."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every supervised model you ship. This is the standard shape of a defensible evaluation."
     },
     {
      "kind": "check",
      "question": "Your model gets 90% accuracy on data that is 90% one class. What should you do?",
      "options": [
       "Compare with a baseline that predicts the base rate",
       "Ship it",
       "Raise C"
      ],
      "answer": 0,
      "why": "The baseline already gets 90%. Only improvement over it, on held-out data, shows the model learned something."
     }
    ]
   },
   {
    "id": "lg5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Tuning on the test set",
      "text": "Every look at the test score used for a decision makes it less honest. Look once."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · No baseline",
      "text": "Without a simple benchmark you cannot tell whether a score is good."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Only ranking metrics",
      "text": "A high AUC says nothing about whether 0.8 means 80 percent. Check calibration if you use the probabilities."
     }
    ]
   },
   {
    "id": "lg5-python",
    "kicker": "7 · In Python",
    "title": "The full workflow in one script",
    "blocks": [
     {
      "kind": "code",
      "caption": "Pipeline, cross-validated C, baseline, test once",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import GridSearchCV, train_test_split\nfrom sklearn.metrics import log_loss, roc_auc_score, brier_score_loss\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nrng = np.random.default_rng(12)\nn = 3000\nincome = rng.normal(8, 2.5, n)\nmissed = rng.poisson(1.5, n)\nage = rng.uniform(21, 60, n)\nlogit = -1.2 - 0.35 * (income - 8) + 0.7 * (missed - 1.5) + 0.01 * (age - 40)\ny = (rng.random(n) < 1 / (1 + np.exp(-logit))).astype(int)\nX = np.column_stack([income, missed, age])\n\nX_dev, X_test, y_dev, y_test = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\npipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))\nsearch = GridSearchCV(pipe, {\"logisticregression__C\": [0.01, 0.1, 1, 10]}, cv=5, scoring=\"neg_log_loss\").fit(X_dev, y_dev)\nprint(\"chosen C:\", search.best_params_[\"logisticregression__C\"])\n\np = search.predict_proba(X_test)[:, 1]\nbase = np.full_like(p, y_dev.mean())\nprint(\"base rate only  log loss\", round(log_loss(y_test, base), 3), \"AUC\", 0.5)\nprint(\"model           log loss\", round(log_loss(y_test, p), 3), \"AUC\", round(roc_auc_score(y_test, p), 3), \"Brier\", round(brier_score_loss(y_test, p), 3))",
      "output": "chosen C: 1\nbase rate only  log loss 0.595 AUC 0.5\nmodel           log loss 0.477 AUC 0.795 Brier 0.157"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Split first, pipeline everything, tune with cross-validation, test once, and always beat a base-rate baseline."
     }
    ]
   }
  ]
 },
 {
  "title": "Explaining the model, and knowing its limits",
  "minutes": 12,
  "sections": [
   {
    "id": "lg6-observe",
    "kicker": "1 · Observe",
    "title": "What the model says, and where it cannot go",
    "blocks": [
     {
      "kind": "p",
      "text": "A regulator asks why a loan was refused. Logistic regression is a good answer to that: every weight is a statement, such as “each missed payment multiplies the odds of default by 2.2”. But the same model has a hard limit. Its boundary is flat, and some problems are not flat."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do you explain a logistic model honestly, and how do you tell when a straight boundary is not enough?"
     }
    ]
   },
   {
    "id": "lg6-express",
    "kicker": "2 · Express",
    "title": "Weights become odds ratios",
    "blocks": [
     {
      "kind": "p",
      "text": "Exponentiate a weight to get an odds ratio. A weight of 0.8 gives e^0.8 = 2.23: each extra unit multiplies the odds by about 2.2, holding the other columns fixed. A negative weight gives a ratio below 1, such as e^−0.13 = 0.88, a 12 percent drop in the odds."
     },
     {
      "kind": "eq",
      "lines": [
       "odds ratio = e^weight",
       "weight 0.8  →  2.23 times the odds",
       "weight −0.13 →  0.88 times the odds"
      ],
      "note": "Always say “holding the others fixed”. A weight is only meaningful alongside the other columns."
     }
    ]
   },
   {
    "id": "lg6-visualize",
    "kicker": "3 · Visualize",
    "title": "When a flat boundary fails",
    "blocks": [
     {
      "kind": "p",
      "text": "Now data shaped as a ring. Class 0 sits in the middle of the plane and class 1 surrounds it. No straight line can separate them, because the right boundary is a circle."
     },
     {
      "kind": "table",
      "caption": "Ring-shaped data, 600 points",
      "headers": [
       "Model",
       "Accuracy"
      ],
      "rows": [
       [
        "Straight boundary",
        "0.617"
       ],
       [
        "Add squared terms (still logistic regression)",
        "0.982"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The straight model scores 0.617, barely better than guessing, and its two odds ratios (0.88 and 0.82) would suggest weak effects, which would be wrong: the effect is strong, just not monotonic. Adding squared columns lets the same model draw a curved boundary, and accuracy jumps to 0.982."
     }
    ]
   },
   {
    "id": "lg6-discover",
    "kicker": "4 · Discover",
    "title": "The limit is the boundary, not the method",
    "blocks": [
     {
      "kind": "p",
      "text": "Logistic regression is linear in its input columns, so its boundary is flat. When you give it engineered columns (squares, products, indicators), it can draw curves while staying easy to explain. The model is not the problem. The inputs are."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Logistic regression explains clearly through odds ratios, and it bends only as far as the columns you give it."
     },
     {
      "kind": "p",
      "text": "A neural network learns its own columns, which is its advantage and the price: its weights no longer have this plain reading."
     }
    ]
   },
   {
    "id": "lg6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a plain-language reason. Suppose a model's weights on standardised columns are income −0.35 per standard deviation, missed payments +0.70. Odds ratios: e^−0.35 = 0.70 and e^0.70 = 2.01. “A borrower one standard deviation richer has 30 percent lower odds of default. Each standard deviation more missed payments doubles them.”"
     },
     {
      "kind": "p",
      "text": "Example 2, a warning sign. A model reports a negative weight on income for a group where raising income should help. Check for overlapping columns: two measures of the same thing share credit unpredictably. Remove one or regularise."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Credit, insurance and healthcare, where reasons must be given. It is also a strong, fast baseline for any classification task."
     },
     {
      "kind": "check",
      "question": "A weight is 0.69. Roughly how do the odds change per extra unit?",
      "options": [
       "They double",
       "They rise by 0.69",
       "They halve"
      ],
      "answer": 0,
      "why": "e^0.69 ≈ 2, so each unit doubles the odds."
     }
    ]
   },
   {
    "id": "lg6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways to fool yourself",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading weights as causes",
      "text": "A weight describes association in this data. It does not say what would happen if you changed that column."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Ignoring overlapping columns",
      "text": "With correlated inputs the weights split credit arbitrarily. Compare them only after checking correlation."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Concluding no effect from a weak weight",
      "text": "On ring-shaped data a straight model finds almost no effect from columns that matter greatly."
     }
    ]
   },
   {
    "id": "lg6-python",
    "kicker": "7 · In Python",
    "title": "A ring, a line, and odds ratios",
    "blocks": [
     {
      "kind": "code",
      "caption": "Straight versus curved boundary on ring data",
      "code": "import numpy as np\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import PolynomialFeatures, StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nrng = np.random.default_rng(1)\nn = 600\nX = rng.normal(0, 1, size=(n, 2))\ny = ((X ** 2).sum(axis=1) > 1.4).astype(int)      # inside a ring = 0, outside = 1\n\nflat = LogisticRegression().fit(X, y)\ncurved = make_pipeline(PolynomialFeatures(2), StandardScaler(), LogisticRegression(max_iter=1000)).fit(X, y)\nprint(\"straight boundary accuracy:\", round(flat.score(X, y), 3))\nprint(\"with squared terms        :\", round(curved.score(X, y), 3))\nprint(\"odds ratios of the straight model:\", np.exp(flat.coef_).round(2))",
      "output": "straight boundary accuracy: 0.617\nwith squared terms        : 0.982\nodds ratios of the straight model: [[0.88 0.82]]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Odds ratios explain the model, and engineered columns let it bend. Check whether a straight boundary is enough before trusting a weak weight."
     }
    ]
   }
  ]
 }
];
