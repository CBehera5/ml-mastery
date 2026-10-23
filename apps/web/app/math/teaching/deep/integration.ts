import type {DeepLesson} from "../deep-read";
export const INTEGRATION_DEEP:DeepLesson[]=[
 {
  "title": "One flat, one error, one update: the whole loop",
  "minutes": 14,
  "sections": [
   {
    "id": "itg-observe",
    "kicker": "1 · Observe",
    "title": "Everything you have learned, on a single house",
    "blocks": [
     {
      "kind": "p",
      "text": "A single flat has area 2 (thousand sq ft) and age 10 years, and sold for ₹280 lakh. The model has two weights and a bias. This lesson follows one complete training step, using algebra for the rule, linear algebra for the combination, and calculus for the update."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Can you trace one prediction, one error and one update from start to finish?"
     }
    ]
   },
   {
    "id": "itg-express",
    "kicker": "2 · Express",
    "title": "The loop",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Predict: ŷ = w · x + b (a dot product).",
       "Measure: error = ŷ − target, loss = error².",
       "Differentiate: ∂loss/∂w = 2 · error · x and ∂loss/∂b = 2 · error (the chain rule).",
       "Update: move each parameter against its gradient by a small learning rate.",
       "Check: the new loss should be lower."
      ]
     },
     {
      "kind": "eq",
      "lines": [
       "ŷ = w · x + b",
       "L = (ŷ − y)²",
       "w ← w − η · 2(ŷ − y) x"
      ],
      "note": "This is gradient descent for linear regression, written for one example."
     }
    ]
   },
   {
    "id": "itg-visualize",
    "kicker": "3 · Visualize",
    "title": "The numbers",
    "blocks": [
     {
      "kind": "table",
      "caption": "One training step",
      "headers": [
       "Quantity",
       "Value"
      ],
      "rows": [
       [
        "Weights (area, age), bias",
        "(100, −2), 50"
       ],
       [
        "Prediction",
        "100 × 2 − 2 × 10 + 50 = 230"
       ],
       [
        "Error and loss",
        "−50 and 2,500"
       ],
       [
        "Gradient w",
        "(−200, −1000)"
       ],
       [
        "Gradient b",
        "−100"
       ],
       [
        "After one step (η = 0.0005)",
        "w = (100.1, −1.5), b = 50.05"
       ],
       [
        "New prediction and loss",
        "235.25 and 2,002.56"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The numerical nudge test gave the same gradient, (−200, −1000), confirming the chain rule. One small step moved the prediction from 230 towards 280 and cut the loss by about 20 percent."
     }
    ]
   },
   {
    "id": "itg-discover",
    "kicker": "4 · Discover",
    "title": "Why the weights moved differently",
    "blocks": [
     {
      "kind": "p",
      "text": "The age weight has gradient −1000 and the area weight −200, because age is 10 and area is 2: the gradient is proportional to the input. A feature with large values gets pushed harder, which is why unscaled features make training hard."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Training is a loop of predict, measure, differentiate, update, using exactly the algebra, vectors and calculus from the earlier modules."
     }
    ]
   },
   {
    "id": "itg-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a hand check. Gradient for area = 2 × (−50) × 2 = −200. Update = 100 − 0.0005 × (−200) = 100.1."
     },
     {
      "kind": "p",
      "text": "Example 2, a bigger step. With η = 0.005 the area weight becomes 101 and the age weight 3, and the age weight flips from −2 to +3 in a single step. The step size matters."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Replace one flat with a thousand, vectors with a matrix, and this loop is how a real regression model is trained."
     },
     {
      "kind": "check",
      "question": "The error is positive (prediction too high). Which way does the gradient step move the prediction?",
      "options": [
       "Up",
       "Down",
       "It cannot say"
      ],
      "answer": 1,
      "why": "The step opposes the gradient of the loss, which lowers the prediction when it is too high."
     }
    ]
   },
   {
    "id": "itg-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Skipping the check",
      "text": "One numerical nudge confirms the formula."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Unscaled inputs",
      "text": "Large inputs mean large gradients and unstable steps."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Judging by one example",
      "text": "One step on one flat says nothing about the dataset."
     }
    ]
   },
   {
    "id": "itg-python",
    "kicker": "7 · In Python",
    "title": "The full loop in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Predict, measure, differentiate, update and re-check",
      "code": "import numpy as np\n\n# one house: area (thousand sq ft), age (years). price in lakh.\nx = np.array([2.0, 10.0])\nw = np.array([100.0, -2.0])           # area weight and age weight\nb = 50.0\ntarget = 280.0\n\npred = x @ w + b\nerr = pred - target\nloss = err ** 2\nprint(\"prediction\", pred, \"| error\", err, \"| loss\", loss)\n\n# chain rule: loss -> error -> prediction -> each weight\ngrad_w = 2 * err * x\ngrad_b = 2 * err\nprint(\"gradient w:\", grad_w, \"| gradient b:\", grad_b)\n\n# check by nudging each weight\ndef L(w_, b_): return (x @ w_ + b_ - target) ** 2\neps = 1e-5\nnum = [(L(w + eps * np.eye(2)[i], b) - L(w - eps * np.eye(2)[i], b)) / (2 * eps) for i in range(2)]\nprint(\"numerical gradient w:\", np.round(num, 2))\n\nlr = 0.0005\nw2, b2 = w - lr * grad_w, b - lr * grad_b\nprint(\"one step: w ->\", np.round(w2, 4), \"b ->\", round(float(b2), 4))\nprint(\"new prediction\", round(float(x @ w2 + b2), 3), \"| new loss\", round(float(L(w2, b2)), 3), \"| was\", loss)",
      "output": "prediction 230.0 | error -50.0 | loss 2500.0\ngradient w: [ -200. -1000.] | gradient b: -100.0\nnumerical gradient w: [ -200. -1000.]\none step: w -> [100.1  -1.5] b -> 50.05\nnew prediction 235.25 | new loss 2002.562 | was 2500.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "If you can trace this loop by hand, you understand training."
     }
    ]
   }
  ]
 }
];
