import type {DeepLesson} from "../deep-read";
export const OPTIMIZATION_DEEP:DeepLesson[]=[
 {
  "title": "Turn 'a good price model' into a number to minimise",
  "minutes": 13,
  "sections": [
   {
    "id": "op1-observe",
    "kicker": "1 · Observe",
    "title": "Three flats and a model that is a little off",
    "blocks": [
     {
      "kind": "p",
      "text": "A one-weight price model says price = w × area. Three flats of 50, 70 and 100 sq m sold for ₹40, 55 and 85 lakh. Is w = 0.8 lakh per sq m a good weight? Better than 0.85? To choose, we need a single number that scores how wrong a weight is. Machine learning calls that number the loss, and the thing we minimise the objective."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we turn 'good' into a number, and how does the gradient tell us which way to move?"
     }
    ]
   },
   {
    "id": "op1-express",
    "kicker": "2 · Express",
    "title": "Loss and gradient",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "MSE(w) = average of (w · area − price)²",
       "MAE(w) = average of |w · area − price|",
       "gradient = d MSE / d w"
      ],
      "note": "The gradient is the slope of the loss. A negative slope means increasing w lowers the loss."
     }
    ]
   },
   {
    "id": "op1-visualize",
    "kicker": "3 · Visualize",
    "title": "Scoring four weights",
    "blocks": [
     {
      "kind": "table",
      "caption": "Loss by weight",
      "headers": [
       "w (lakh per sq m)",
       "MSE",
       "MAE"
      ],
      "rows": [
       [
        "0.60",
        "298.00",
        "16.00"
       ],
       [
        "0.80",
        "8.67",
        "2.00"
       ],
       [
        "0.85",
        "8.83",
        "2.33"
       ],
       [
        "1.00",
        "183.33",
        "13.33"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Weights of 0.6 and 1.0 are clearly bad. 0.8 and 0.85 are close. Both losses prefer 0.80 to 0.85 here, but the exact minimiser of MSE is not on this grid, as the next section shows."
     }
    ]
   },
   {
    "id": "op1-discover",
    "kicker": "4 · Discover",
    "title": "The slope says where to go",
    "blocks": [
     {
      "kind": "p",
      "text": "At w = 0.6 the gradient of MSE is −2,606.67: very negative, so raising w lowers the loss steeply. A numerical nudge gives the same value, which is a good way to check a derivative. The gradient reaches zero at w = 0.8247, where MSE is 5.125."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A loss scores a choice of parameters, and the gradient is the slope that tells you which way lowers it."
     }
    ]
   },
   {
    "id": "op1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the slope by hand. For w = 0.6: residuals 0.6 × 50 − 40 = −10, 0.6 × 70 − 55 = −13, 0.6 × 100 − 85 = −25. The gradient is the mean of 2 × residual × area: (2 × −10 × 50 + 2 × −13 × 70 + 2 × −25 × 100) ÷ 3 = (−1,000 − 1,820 − 5,000) ÷ 3 = −2,606.67."
     },
     {
      "kind": "p",
      "text": "Example 2, objective versus goal. A buyer who hates large misses prefers MSE. A budget planner who cares about the typical rupee miss prefers MAE. Choosing the loss is choosing what matters."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every model is trained by minimising a loss. Regression uses squared error, classification uses log loss."
     },
     {
      "kind": "check",
      "question": "At some w the gradient of the loss is large and positive. What should you do to w?",
      "options": [
       "Increase it",
       "Decrease it",
       "Leave it"
      ],
      "answer": 1,
      "why": "A positive slope means the loss rises as w rises, so move w down."
     }
    ]
   },
   {
    "id": "op1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Optimising a score you do not care about",
      "text": "The best weight for one loss can be mediocre for another."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Trusting a gradient formula unchecked",
      "text": "Verify it numerically by nudging the parameter."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Forgetting units",
      "text": "MSE is in squared lakh. Report a loss in units the reader understands."
     }
    ]
   },
   {
    "id": "op1-python",
    "kicker": "7 · In Python",
    "title": "Loss and gradient in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Score four weights, check the gradient, find the flat spot",
      "code": "import numpy as np\n\n# a one-weight price model: price = w * area, three flats\narea = np.array([50.0, 70.0, 100.0])\nprice = np.array([40.0, 55.0, 85.0])           # lakh rupees\nmse = lambda w: np.mean((w * area - price) ** 2)\nmae = lambda w: np.mean(np.abs(w * area - price))\nfor w in (0.6, 0.8, 0.85, 1.0):\n    print(\"w\", w, \"| MSE\", round(float(mse(w)), 2), \"| MAE\", round(float(mae(w)), 2))\n\n# the gradient of the MSE with respect to w, from calculus, and by nudging\nw = 0.6\ngrad = np.mean(2 * (w * area - price) * area)\neps = 1e-6\nnumeric = (mse(w + eps) - mse(w - eps)) / (2 * eps)\nprint(\"gradient at w=0.6: formula\", round(float(grad), 2), \"| numerical\", round(float(numeric), 2))\n\n# the best w sets the gradient to zero\nbest = (area * price).sum() / (area ** 2).sum()\nprint(\"w where gradient = 0:\", round(float(best), 4), \"| MSE there:\", round(float(mse(best)), 3))",
      "output": "w 0.6 | MSE 298.0 | MAE 16.0\nw 0.8 | MSE 8.67 | MAE 2.0\nw 0.85 | MSE 8.83 | MAE 2.33\nw 1.0 | MSE 183.33 | MAE 13.33\ngradient at w=0.6: formula -2606.67 | numerical -2606.67\nw where gradient = 0: 0.8247 | MSE there: 5.125"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Define the loss, find its slope, and move where the slope points downhill."
     }
    ]
   }
  ]
 },
 {
  "title": "Step size: how a learning rate can win or ruin the walk",
  "minutes": 13,
  "sections": [
   {
    "id": "op2-observe",
    "kicker": "1 · Observe",
    "title": "Walking down a bowl in the dark",
    "blocks": [
     {
      "kind": "p",
      "text": "You are on a hillside in the dark and want the bottom. You feel the slope under your feet and take a step downhill. A big step may overshoot to the other side. A tiny one will take all night. The size of the step is the learning rate."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How big should a step be, and what happens when it is too large?"
     }
    ]
   },
   {
    "id": "op2-express",
    "kicker": "2 · Express",
    "title": "The update rule",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "w ← w − η · slope",
       "for f(w) = (w − 3)²:  slope = 2(w − 3)",
       "distance to the minimum is multiplied by (1 − 2η) every step"
      ],
      "note": "η (eta) is the learning rate. A multiplier between −1 and 1 means the walk shrinks toward the minimum."
     }
    ]
   },
   {
    "id": "op2-visualize",
    "kicker": "3 · Visualize",
    "title": "Six learning rates",
    "blocks": [
     {
      "kind": "p",
      "text": "Minimise (w − 3)² from w = 0, eight steps."
     },
     {
      "kind": "table",
      "caption": "Where the walk is after 8 steps",
      "headers": [
       "η",
       "w",
       "f(w)",
       "Per-step multiplier (1 − 2η)"
      ],
      "rows": [
       [
        "0.05",
        "1.709",
        "1.6677",
        "0.90"
       ],
       [
        "0.25",
        "2.988",
        "0.0001",
        "0.50"
       ],
       [
        "0.50",
        "3.000",
        "0.0000",
        "0.00"
       ],
       [
        "0.90",
        "2.497",
        "0.2533",
        "−0.80"
       ],
       [
        "1.00",
        "0.000",
        "9.0000",
        "−1.00"
       ],
       [
        "1.10",
        "−9.899",
        "166.3958",
        "−1.20"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "η = 0.5 lands on the minimum in a single step. η = 0.9 overshoots and bounces back and forth while slowly settling. η = 1.0 bounces forever between 0 and 6. η = 1.1 makes things worse each step. And η = 0.05 is safe but needs 55 steps to get within 0.01 of the answer."
     }
    ]
   },
   {
    "id": "op2-discover",
    "kicker": "4 · Discover",
    "title": "A safe range",
    "blocks": [
     {
      "kind": "p",
      "text": "For this bowl the multiplier 1 − 2η must lie between −1 and 1, so η must lie between 0 and 1. A steeper bowl has a smaller safe range, which is why the same learning rate can suit one model and wreck another."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A step is the slope times a learning rate. Too small is slow, just right is fast, too large oscillates or diverges."
     }
    ]
   },
   {
    "id": "op2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, one step. From w = 0 with η = 0.25: slope = 2(0 − 3) = −6. w becomes 0 − 0.25 × (−6) = 1.5. The distance to 3 went from 3 to 1.5, a multiplier of 0.5."
     },
     {
      "kind": "p",
      "text": "Example 2, a diagnosis. If your loss curve goes up and down, or increases step after step, lower the learning rate by a factor of 3 or 10 and try again."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Almost every training run tunes a learning rate first. Schedules lower it over time so the late steps settle."
     },
     {
      "kind": "check",
      "question": "The multiplier per step is −1.2. What happens?",
      "options": [
       "The walk converges",
       "The walk oscillates and the distance grows",
       "The walk stays still"
      ],
      "answer": 1,
      "why": "A multiplier below −1 flips the sign and increases the distance every step."
     }
    ]
   },
   {
    "id": "op2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Copying a learning rate from another model",
      "text": "The safe range depends on the shape of the loss."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Judging by one step",
      "text": "Look at the loss curve over many steps."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Calling oscillation convergence",
      "text": "A loss that bounces between two values has not converged."
     }
    ]
   },
   {
    "id": "op2-python",
    "kicker": "7 · In Python",
    "title": "Learning rates in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Six learning rates on the same bowl",
      "code": "import numpy as np\n\n# minimise f(w) = (w - 3)^2, gradient 2(w - 3). Start at w = 0.\nf = lambda w: (w - 3) ** 2\ndef run(lr, steps=8):\n    w, path = 0.0, [0.0]\n    for _ in range(steps):\n        w = w - lr * 2 * (w - 3)\n        path.append(w)\n    return path\nfor lr in (0.05, 0.25, 0.5, 0.9, 1.0, 1.1):\n    p = run(lr)\n    print(\"lr\", str(lr).ljust(4), \"| w after 8 steps:\", round(p[-1], 3), \"| f:\", round(f(p[-1]), 4))\n\n# each step multiplies the distance to the minimum by (1 - 2 lr)\nfor lr in (0.25, 0.9, 1.1):\n    print(\"lr\", lr, \"distance multiplier per step:\", round(1 - 2 * lr, 2))\nprint(\"steps for lr=0.05 to get within 0.01 of 3:\", next(i for i, w in enumerate(run(0.05, 200)) if abs(w - 3) < 0.01))",
      "output": "lr 0.05 | w after 8 steps: 1.709 | f: 1.6677\nlr 0.25 | w after 8 steps: 2.988 | f: 0.0001\nlr 0.5  | w after 8 steps: 3.0 | f: 0.0\nlr 0.9  | w after 8 steps: 2.497 | f: 0.2533\nlr 1.0  | w after 8 steps: 0.0 | f: 9.0\nlr 1.1  | w after 8 steps: -9.899 | f: 166.3958\nlr 0.25 distance multiplier per step: 0.5\nlr 0.9 distance multiplier per step: -0.8\nlr 1.1 distance multiplier per step: -1.2\nsteps for lr=0.05 to get within 0.01 of 3: 55"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Plot the loss against the step. Its shape tells you what to do to the learning rate."
     }
    ]
   }
  ]
 },
 {
  "title": "Valleys: why scaling features speeds everything up",
  "minutes": 14,
  "sections": [
   {
    "id": "op3-observe",
    "kicker": "1 · Observe",
    "title": "A long thin valley",
    "blocks": [
     {
      "kind": "p",
      "text": "Suppose one feature is area in sq m (tens to hundreds) and another is the number of bedrooms (one to five). The loss is much steeper along one weight than the other, like a long thin valley. Steps that are safe across the valley crawl along it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How does the shape of the loss limit the learning rate, and how does rescaling fix it?"
     }
    ]
   },
   {
    "id": "op3-express",
    "kicker": "2 · Express",
    "title": "Curvature and the condition number",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "loss = ½ (a w₁² + b w₂²)",
       "safe learning rate < 2 ÷ (largest curvature) = 2 ÷ b",
       "condition number = b ÷ a"
      ],
      "note": "The steep direction caps the learning rate. The shallow direction then needs many steps."
     }
    ]
   },
   {
    "id": "op3-visualize",
    "kicker": "3 · Visualize",
    "title": "A round bowl against a thin valley",
    "blocks": [
     {
      "kind": "table",
      "caption": "Steps to reach a gradient below 0.000001",
      "headers": [
       "Bowl",
       "Learning rate",
       "Steps"
      ],
      "rows": [
       [
        "a = 1, b = 1 (round)",
        "1.0",
        "1"
       ],
       [
        "a = 1, b = 100 (thin)",
        "0.019",
        "721"
       ],
       [
        "a = 1, b = 100 (thin)",
        "0.021",
        "diverges"
       ],
       [
        "thin valley after rescaling so b = 1",
        "1.0",
        "1"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "In the thin valley the largest safe step is about 2 ÷ 100 = 0.02. Just under it, the walk takes 721 steps. Just over it, the walk diverges. Rescaling the steep weight turns the valley into a round bowl that needs one step."
     }
    ]
   },
   {
    "id": "op3-discover",
    "kicker": "4 · Discover",
    "title": "Scaling is geometry",
    "blocks": [
     {
      "kind": "p",
      "text": "Standardising each feature makes its weight's curvature similar. The loss turns from a thin valley into a round bowl, and a single learning rate suits all weights. This is the optimisation reason for scaling, on top of the statistical one."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "The ratio of steepest to shallowest curvature limits how fast gradient descent can go, and scaling features pushes that ratio toward 1."
     }
    ]
   },
   {
    "id": "op3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, safe step. With curvature 100, the safe range is η < 2 ÷ 100 = 0.02. Choosing 0.019 works and 0.021 diverges, as the table shows."
     },
     {
      "kind": "p",
      "text": "Example 2, a rental model. Area in sq ft (hundreds to thousands) and bedrooms (1 to 4): the curvatures differ by tens of thousands of times. Standardise both and the same step suits them."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Feature scaling, batch normalisation and adaptive optimisers like Adam all attack the thin-valley problem."
     },
     {
      "kind": "check",
      "question": "A loss is steep in one direction and shallow in another. What limits the learning rate?",
      "options": [
       "The shallow direction",
       "The steep direction",
       "The number of features"
      ],
      "answer": 1,
      "why": "A step that is stable in the steep direction is tiny for the shallow one. The steep direction caps it."
     }
    ]
   },
   {
    "id": "op3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Raising the learning rate to speed up the shallow direction",
      "text": "It diverges in the steep one."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Scaling with test statistics",
      "text": "Compute means and spreads from training rows."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Believing a long run means a bad model",
      "text": "It can be a badly scaled problem."
     }
    ]
   },
   {
    "id": "op3-python",
    "kicker": "7 · In Python",
    "title": "Valleys in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Round bowl against thin valley",
      "code": "import numpy as np\n\n# loss = 0.5 * (a w1^2 + b w2^2): a long thin valley when a and b differ a lot\ndef descend(a, b, lr, steps=2000, tol=1e-6):\n    w = np.array([1.0, 1.0])\n    for i in range(steps):\n        g = np.array([a * w[0], b * w[1]])\n        if np.linalg.norm(g) < tol:\n            return i\n        w = w - lr * g\n        if not np.isfinite(w).all() or np.abs(w).max() > 1e6:\n            return None\n    return steps\n\nprint(\"valley a=1, b=1   (round bowl), lr=1.0 :\", descend(1, 1, 1.0), \"steps\")\nprint(\"valley a=1, b=100 (thin valley), lr=0.019 (largest safe ~ 2/b):\", descend(1, 100, 0.019), \"steps\")\nprint(\"valley a=1, b=100, lr=0.021 (a touch too big):\", descend(1, 100, 0.021), \"-> diverged\" if descend(1, 100, 0.021) is None else \"\")\nprint(\"condition number b/a:\", 100)\n\n# rescaling the second weight makes the valley round again\nprint(\"after scaling w2 by 10 so b becomes 1, lr=1.0:\", descend(1, 1, 1.0), \"steps\")",
      "output": "valley a=1, b=1   (round bowl), lr=1.0 : 1 steps\nvalley a=1, b=100 (thin valley), lr=0.019 (largest safe ~ 2/b): 721 steps\nvalley a=1, b=100, lr=0.021 (a touch too big): None -> diverged\ncondition number b/a: 100\nafter scaling w2 by 10 so b becomes 1, lr=1.0: 1 steps"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "If training crawls or diverges, check how the features are scaled."
     }
    ]
   }
  ]
 },
 {
  "title": "Finite runs, noise and numerical stability",
  "minutes": 13,
  "sections": [
   {
    "id": "op4-observe",
    "kicker": "1 · Observe",
    "title": "You stop before the end",
    "blocks": [
     {
      "kind": "p",
      "text": "Training never reaches the exact minimum. You run for a fixed number of steps, or until the loss stops improving, and you use whatever you have. Along the way, noise and the limits of computer arithmetic can bite."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we read a loss curve from a finite run, and what numerical traps exist?"
     }
    ]
   },
   {
    "id": "op4-express",
    "kicker": "2 · Express",
    "title": "Full batch, mini-batch and floating point",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "full batch: gradient from all rows",
       "mini-batch: gradient from a few random rows (noisy but cheap)",
       "log Σ eᶻ = max(z) + log Σ e^(z − max z)"
      ],
      "note": "The last line is the standard stable form. It avoids overflow in e^1000."
     }
    ]
   },
   {
    "id": "op4-visualize",
    "kicker": "3 · Visualize",
    "title": "What a real curve looks like",
    "blocks": [
     {
      "kind": "p",
      "text": "A linear model on 500 rows with true noise variance 0.25, learning rate 0.1."
     },
     {
      "kind": "table",
      "caption": "Loss over steps",
      "headers": [
       "Setting",
       "Loss at step 1",
       "Step 10",
       "Step 30",
       "Step 60"
      ],
      "rows": [
       [
        "Full batch",
        "3.618",
        "0.341",
        "0.266",
        "0.266"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The best possible loss here is 0.266, and the full-batch run reaches it by step 30. A mini-batch of 8 rows never settles: its last five losses wobble between 0.271 and 0.284. With a learning rate of 1.2, the loss climbs from 8.8 to 70.3 to 1,119.3 within 10 steps."
     }
    ]
   },
   {
    "id": "op4-discover",
    "kicker": "4 · Discover",
    "title": "Stable arithmetic",
    "blocks": [
     {
      "kind": "p",
      "text": "Computing log(e^1000 + e^1001) directly overflows to infinity. Subtracting the largest value first gives 1001.3133. Libraries use this form inside softmax and log loss for exactly this reason."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A finite run ends near the minimum, noise makes mini-batch curves wobble, and stable formulas keep numbers inside the range a computer can hold."
     }
    ]
   },
   {
    "id": "op4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, when to stop. Stop when the validation loss has not improved for a set number of steps, or when the training loss changes by less than a tiny tolerance."
     },
     {
      "kind": "p",
      "text": "Example 2, a diverging run. If the loss jumps to inf or nan, the learning rate is too high or a formula overflowed. Reduce the rate, or clip the gradient to a maximum size."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "All deep learning libraries use stable softmax and log-sum-exp, mini-batches and gradient clipping."
     },
     {
      "kind": "check",
      "question": "The loss wobbles around a value with a mini-batch of 8. What does it mean?",
      "options": [
       "Training failed",
       "Gradient noise: a bigger batch or a smaller learning rate would calm it",
       "The model is perfect"
      ],
      "answer": 1,
      "why": "Mini-batch gradients are noisy estimates. A larger batch or smaller rate reduces the wobble."
     }
    ]
   },
   {
    "id": "op4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading a flat curve as success",
      "text": "It may be flat because the learning rate is tiny."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Ignoring nan",
      "text": "It means something overflowed. Find the step where it first appeared."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Comparing runs with different seeds as if exact",
      "text": "Noise makes small differences meaningless."
     }
    ]
   },
   {
    "id": "op4-python",
    "kicker": "7 · In Python",
    "title": "A training run in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Full batch, mini-batch, divergence and stable log-sum-exp",
      "code": "import numpy as np\n\nrng = np.random.default_rng(0)\nX = rng.normal(size=(500, 3)); w_true = np.array([2.0, -1.0, 0.5])\ny = X @ w_true + rng.normal(0, 0.5, 500)\n\ndef loss(w): return float(np.mean((X @ w - y) ** 2))\ndef run(lr, steps, batch=None):\n    w = np.zeros(3); hist = []\n    for t in range(steps):\n        idx = np.arange(500) if batch is None else rng.integers(0, 500, batch)\n        g = 2 * X[idx].T @ (X[idx] @ w - y[idx]) / len(idx)\n        w = w - lr * g\n        hist.append(loss(w))\n    return w, hist\nw, h = run(0.1, 60)\nprint(\"full batch: loss at step 1, 10, 30, 60 =\", [round(h[i - 1], 3) for i in (1, 10, 30, 60)])\nprint(\"best possible loss (noise variance 0.25):\", round(loss(np.linalg.lstsq(X, y, rcond=None)[0]), 3))\nw, h = run(0.1, 60, batch=8)\nprint(\"batch of 8: last 5 losses wobble:\", [round(v, 3) for v in h[-5:]])\nw, h = run(1.2, 30)\nprint(\"lr too big: loss at step 1, 5, 10 =\", [round(h[i - 1], 1) for i in (1, 5, 10)])\n\n# float overflow in a log-sum-exp, and the stable fix\nz = np.array([1000.0, 1001.0])\nwith np.errstate(over=\"ignore\"):\n    print(\"naive log(sum(exp(z))) overflows:\", np.log(np.sum(np.exp(z))))\nprint(\"stable: max + log(sum(exp(z - max))) =\", round(float(z.max() + np.log(np.sum(np.exp(z - z.max())))), 4))",
      "output": "full batch: loss at step 1, 10, 30, 60 = [3.618, 0.341, 0.266, 0.266]\nbest possible loss (noise variance 0.25): 0.266\nbatch of 8: last 5 losses wobble: [0.271, 0.276, 0.281, 0.276, 0.284]\nlr too big: loss at step 1, 5, 10 = [8.8, 70.3, 1119.3]\nnaive log(sum(exp(z))) overflows: inf\nstable: max + log(sum(exp(z - max))) = 1001.3133"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Read the whole loss curve, not just its last value."
     }
    ]
   }
  ]
 },
 {
  "title": "Regularisation: paying for large weights",
  "minutes": 14,
  "sections": [
   {
    "id": "op5-observe",
    "kicker": "1 · Observe",
    "title": "The model that is too sure of itself",
    "blocks": [
     {
      "kind": "p",
      "text": "With only 20 flats and 10 features, an unconstrained fit can chase noise with large weights. The training error looks superb, and the model does worse on new flats. Regularisation adds a price for large weights so that the model has to earn each one."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How does adding a penalty to the objective change the answer, and how do we choose its size?"
     }
    ]
   },
   {
    "id": "op5-express",
    "kicker": "2 · Express",
    "title": "The objective has two parts",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "objective = sum of squared errors + λ · ‖w‖²",
       "closed form: w = (XᵀX + λI)⁻¹ Xᵀ y"
      ],
      "note": "λ (lambda) is the price per unit of squared weight. Bigger λ pulls weights toward zero."
     }
    ]
   },
   {
    "id": "op5-visualize",
    "kicker": "3 · Visualize",
    "title": "Sweeping λ",
    "blocks": [
     {
      "kind": "p",
      "text": "20 training rows, 10 features, noise spread 3, test set of 5,000. True weights: 3 on one feature, −2 on another, zero elsewhere."
     },
     {
      "kind": "table",
      "caption": "Penalty strength against error",
      "headers": [
       "λ",
       "‖w‖",
       "Train MSE",
       "Test MSE"
      ],
      "rows": [
       [
        "0",
        "4.16",
        "2.45",
        "11.79"
       ],
       [
        "1",
        "3.90",
        "2.50",
        "11.24"
       ],
       [
        "5",
        "3.24",
        "3.15",
        "10.96"
       ],
       [
        "20",
        "2.10",
        "6.40",
        "12.66"
       ],
       [
        "100",
        "0.79",
        "14.27",
        "17.37"
       ],
       [
        "1000",
        "0.10",
        "20.41",
        "20.85"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The unpenalised fit has the best training error (2.45) and the worst test error among small penalties (11.79). A moderate penalty, λ = 5, gives the lowest test error, 10.96. Too much penalty underfits."
     }
    ]
   },
   {
    "id": "op5-discover",
    "kicker": "4 · Discover",
    "title": "A trade-off, not a free lunch",
    "blocks": [
     {
      "kind": "p",
      "text": "The true weight size is 3.61, and the unpenalised fit overshoots at 4.16. Shrinking toward zero helps at first. The best possible test error is the noise itself, 9.0, and no penalty reaches it with only 20 rows."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Regularisation trades a little training error for smaller weights, and the best penalty is the one that lowers error on rows the model has not seen."
     }
    ]
   },
   {
    "id": "op5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, reading the table. Going from λ = 0 to λ = 5 raised training MSE from 2.45 to 3.15 but cut test MSE from 11.79 to 10.96."
     },
     {
      "kind": "p",
      "text": "Example 2, choosing λ. Pick it by cross-validation on training rows, then report the test score once. Picking it on the test set is a leak."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Ridge and lasso regression, weight decay in neural networks, and the C parameter in SVMs all play this role."
     },
     {
      "kind": "check",
      "question": "Raising λ always lowers training error. True or false?",
      "options": [
       "True",
       "False: it raises or leaves training error",
       "Only for ridge"
      ],
      "answer": 1,
      "why": "A penalty makes the optimiser give up some training fit to shrink the weights. Training error rises."
     }
    ]
   },
   {
    "id": "op5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Penalising unscaled features",
      "text": "A feature in rupees needs tiny weights, a feature in lakhs larger ones. The penalty bites unevenly."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Choosing λ on the test set",
      "text": "Use cross-validation."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Expecting regularisation to fix bad data",
      "text": "It reduces variance, not bias or leaks."
     }
    ]
   },
   {
    "id": "op5-python",
    "kicker": "7 · In Python",
    "title": "The penalty sweep in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Ridge solutions across lambda",
      "code": "import numpy as np\n\nrng = np.random.default_rng(3)\nn, d = 20, 10\nX = rng.normal(size=(n, d))\nw_true = np.zeros(d); w_true[0], w_true[3] = 3.0, -2.0\ny = X @ w_true + rng.normal(0, 3.0, n)\nXte = rng.normal(size=(5000, d)); yte = Xte @ w_true + rng.normal(0, 3.0, 5000)\n\nprint(\"lambda | ||w|| | train MSE | test MSE\")\nfor lam in (0, 1, 5, 20, 100, 1000):\n    w = np.linalg.solve(X.T @ X + lam * np.eye(d), X.T @ y)           # minimises sum of squared errors + lam * ||w||^2\n    print(str(lam).rjust(6), \"|\", round(float(np.linalg.norm(w)), 2), \"|\", round(float(np.mean((X @ w - y) ** 2)), 2), \"    |\", round(float(np.mean((Xte @ w - yte) ** 2)), 2))\nprint(\"true ||w||:\", round(float(np.linalg.norm(w_true)), 2), \"| best possible test MSE (the noise):\", 9.0)",
      "output": "lambda | ||w|| | train MSE | test MSE\n     0 | 4.16 | 2.45     | 11.79\n     1 | 3.9 | 2.5     | 11.24\n     5 | 3.24 | 3.15     | 10.96\n    20 | 2.1 | 6.4     | 12.66\n   100 | 0.79 | 14.27     | 17.37\n  1000 | 0.1 | 20.41     | 20.85\ntrue ||w||: 3.61 | best possible test MSE (the noise): 9.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A well-chosen penalty trades training fit for test fit."
     }
    ]
   }
  ]
 },
 {
  "title": "Honest optimisation: the objective is not the goal",
  "minutes": 13,
  "sections": [
   {
    "id": "op6-observe",
    "kicker": "1 · Observe",
    "title": "The optimiser did exactly what you asked",
    "blocks": [
     {
      "kind": "p",
      "text": "A retention team trains a model to flag churners. Which cut-off should it use? One that maximises accuracy, or one that maximises rupees? The two answers differ widely. An optimiser gives you the best value of whatever you wrote down, which is not always what you meant."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we make sure the objective we optimise is the outcome we want?"
     }
    ]
   },
   {
    "id": "op6-express",
    "kicker": "2 · Express",
    "title": "Proxy objectives",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "goal: net rupees = saves × ₹3,000 − calls × ₹200",
       "proxy: accuracy of the flags"
      ],
      "note": "A proxy is easy to measure and correlated with the goal, but optimising it hard can pull away from the goal."
     }
    ]
   },
   {
    "id": "op6-visualize",
    "kicker": "3 · Visualize",
    "title": "Two objectives, two answers",
    "blocks": [
     {
      "kind": "p",
      "text": "5,000 simulated customers with a known churn risk. A call costs ₹200, a lost customer costs ₹3,000, and a call saves half of those who would leave."
     },
     {
      "kind": "table",
      "caption": "Cut-off against outcome",
      "headers": [
       "Cut-off",
       "Calls",
       "Customers saved",
       "Net ₹",
       "Accuracy"
      ],
      "rows": [
       [
        "0.2",
        "3,988",
        "1,161",
        "26,85,400",
        "0.645"
       ],
       [
        "0.3",
        "3,481",
        "1,103",
        "26,12,800",
        "0.700"
       ],
       [
        "0.5",
        "2,483",
        "906",
        "22,21,400",
        "0.742"
       ],
       [
        "0.7",
        "1,491",
        "628",
        "15,85,800",
        "0.718"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Accuracy is highest near a cut-off of 0.52. Net rupees are highest near 0.13. Choosing the accuracy winner at 0.5 would earn ₹22.2 lakh, ₹4.6 lakh less than a cut-off of 0.2, with fewer customers saved."
     }
    ]
   },
   {
    "id": "op6-discover",
    "kicker": "4 · Discover",
    "title": "What to check",
    "blocks": [
     {
      "kind": "p",
      "text": "Ask what each metric hides: accuracy ignores unequal costs. Check results by group, not just on average, and watch for behaviour you did not intend, such as a model that learns to game its own metric. Keep a measure you do not optimise as a sanity check."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Optimisation maximises what you measured, so measure what you mean and verify it with outcomes you did not optimise."
     }
    ]
   },
   {
    "id": "op6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a mismatch. A news app optimises clicks and learns to show outrage. Clicks rise while satisfaction falls. The objective was not the goal."
     },
     {
      "kind": "p",
      "text": "Example 2, a fix. Add a second metric, retention at 30 days, and require the model to improve both before it ships."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Reward models, ranking systems, credit scoring and any system where the metric shapes the behaviour of what it measures."
     },
     {
      "kind": "check",
      "question": "A cut-off maximises accuracy but loses rupees. Which should drive the decision?",
      "options": [
       "Accuracy, because it is the standard metric",
       "The one that matches the real costs",
       "Neither"
      ],
      "answer": 1,
      "why": "The decision has real costs, so the objective should include them."
     }
    ]
   },
   {
    "id": "op6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Optimising a convenient proxy",
      "text": "It may drift away from the goal."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Only reporting an average",
      "text": "A model good on average can fail for a group."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · No outside check",
      "text": "Hold back a measure the optimiser never saw."
     }
    ]
   },
   {
    "id": "op6-python",
    "kicker": "7 · In Python",
    "title": "Two objectives in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Net rupees against accuracy across cut-offs",
      "code": "import numpy as np\n\nrng = np.random.default_rng(1)\nn = 5000\nrisk = rng.uniform(0, 1, n)                              # how likely a customer is to churn\ncall_cost, loss_if_lost, save_rate = 200, 3000, 0.5\nchurn = rng.random(n) < risk\n\ndef outcome(t):\n    flag = risk >= t\n    calls = int(flag.sum())\n    saved = int((flag & churn).sum() * save_rate)\n    return calls, saved, saved * loss_if_lost - calls * call_cost\n\nprint(\"threshold | calls | customers saved | net rupees | accuracy of flags\")\nfor t in (0.2, 0.3, 0.5, 0.7):\n    calls, saved, net = outcome(t)\n    acc = float(((risk >= t) == churn).mean())\n    print(str(t).ljust(9), \"|\", str(calls).rjust(5), \"|\", str(saved).rjust(15), \"|\", str(net).rjust(10), \"|\", round(acc, 3))\nbest_t = max(np.linspace(0.05, 0.95, 91), key=lambda t: outcome(t)[2])\nacc_t = max(np.linspace(0.05, 0.95, 91), key=lambda t: ((risk >= t) == churn).mean())\nprint(\"threshold that maximises rupees:\", round(float(best_t), 2), \"| threshold that maximises accuracy:\", round(float(acc_t), 2))",
      "output": "threshold | calls | customers saved | net rupees | accuracy of flags\n0.2       |  3988 |            1161 |    2685400 | 0.645\n0.3       |  3481 |            1103 |    2612800 | 0.7\n0.5       |  2483 |             906 |    2221400 | 0.742\n0.7       |  1491 |             628 |    1585800 | 0.718\nthreshold that maximises rupees: 0.13 | threshold that maximises accuracy: 0.52"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "State the objective in the units of the decision."
     }
    ]
   }
  ]
 }
];
