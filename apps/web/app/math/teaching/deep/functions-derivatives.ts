import type {DeepLesson} from "../deep-read";
export const FUNCTIONS_DERIVATIVES_DEEP:DeepLesson[]=[
 {
  "title": "Functions, slopes and a loss you can walk down",
  "minutes": 13,
  "sections": [
   {
    "id": "fun-observe",
    "kicker": "1 · Observe",
    "title": "From a rule to a sensitivity",
    "blocks": [
     {
      "kind": "p",
      "text": "A price model says price = 5 × size + 10. Add one unit of size and the price rises by 5. That 5 is the function's sensitivity, or slope. Machine learning cares about a second kind of function: the loss, which tells us how wrong a weight is. Its slope tells us how to fix the weight."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How does a slope turn into a learning step?"
     }
    ]
   },
   {
    "id": "fun-express",
    "kicker": "2 · Express",
    "title": "A function and a loss",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "price(x) = 5x + 10     slope 5 everywhere",
       "L(w) = (2w − 6)²     prediction 2w, target 6",
       "dL/dw = 4(2w − 6)"
      ],
      "note": "A line has one slope. A curve has a slope that depends on where you stand."
     }
    ]
   },
   {
    "id": "fun-visualize",
    "kicker": "3 · Visualize",
    "title": "The slope of a loss changes",
    "blocks": [
     {
      "kind": "table",
      "caption": "L(w) = (2w − 6)²",
      "headers": [
       "w",
       "Loss",
       "Slope"
      ],
      "rows": [
       [
        "0",
        "36",
        "−24"
       ],
       [
        "1",
        "16",
        "−16"
       ],
       [
        "2",
        "4",
        "−8"
       ],
       [
        "3",
        "0",
        "0"
       ],
       [
        "4",
        "4",
        "8"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "At w = 0 the slope is very negative: raise w. At w = 4 the slope is positive: lower w. At w = 3 the slope is 0 and the loss is as low as it can be."
     }
    ]
   },
   {
    "id": "fun-discover",
    "kicker": "4 · Discover",
    "title": "Walking downhill",
    "blocks": [
     {
      "kind": "p",
      "text": "Repeat: w ← w − 0.1 × slope. From w = 0 the loss falls from 36 to 1.44 after one step, to 0.0576 after two, and to 0.0001 by step 4. Each step is smaller than the last because the slope shrinks as we approach the bottom."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A function maps inputs to outputs, its slope says how outputs respond to inputs, and following the slope of a loss downhill is how models learn."
     }
    ]
   },
   {
    "id": "fun-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, one step. At w = 0: slope −24, step = −0.1 × −24 = +2.4, so w = 2.4. New loss (4.8 − 6)² = 1.44."
     },
     {
      "kind": "p",
      "text": "Example 2, a lower rate. With 0.01 the first step moves only to w = 0.24 and the loss falls from 36 to 30.5."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Training a model is repeating this step for many weights at once, with the slope computed by the chain rule."
     },
     {
      "kind": "check",
      "question": "At w = 5 the slope of L is positive. Which way should w move?",
      "options": [
       "Up",
       "Down",
       "Stay"
      ],
      "answer": 1,
      "why": "A positive slope means the loss grows as w grows, so decrease w."
     }
    ]
   },
   {
    "id": "fun-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Confusing the loss slope with the model slope",
      "text": "5 is how price responds to size. The loss slope is how error responds to the weight."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · A step that is too big",
      "text": "It can jump past the minimum."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Stopping when the slope is small but not zero",
      "text": "It may be a flat region, not the bottom."
     }
    ]
   },
   {
    "id": "fun-python",
    "kicker": "7 · In Python",
    "title": "Walking downhill in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "A line, a loss, and five downhill steps",
      "code": "import numpy as np\n\n# a function: size in hundreds of sq ft -> predicted price in lakh\nf = lambda x: 5 * x + 10\nprint(\"f(3) =\", f(3), \"| f(4) =\", f(4), \"| slope between them:\", f(4) - f(3))\n\n# a loss as a function of the weight: prediction 2w, target 6\nL = lambda w: (2 * w - 6) ** 2\ndL = lambda w: 4 * (2 * w - 6)\nfor w in (0, 1, 2, 3, 4):\n    print(\"w\", w, \"| loss\", L(w), \"| slope\", dL(w))\n\n# walking downhill uses only the local slope\nw = 0.0\nfor step in range(5):\n    print(\"step\", step, \"| w\", round(w, 4), \"| loss\", round(L(w), 4))\n    w -= 0.1 * dL(w)\nprint(\"slope at the bottom (w = 3):\", dL(3))",
      "output": "f(3) = 25 | f(4) = 30 | slope between them: 5\nw 0 | loss 36 | slope -24\nw 1 | loss 16 | slope -16\nw 2 | loss 4 | slope -8\nw 3 | loss 0 | slope 0\nw 4 | loss 4 | slope 8\nstep 0 | w 0.0 | loss 36.0\nstep 1 | w 2.4 | loss 1.44\nstep 2 | w 2.88 | loss 0.0576\nstep 3 | w 2.976 | loss 0.0023\nstep 4 | w 2.9952 | loss 0.0001\nslope at the bottom (w = 3): 0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The slope of the loss tells you which way, and a small step tells you how far."
     }
    ]
   }
  ]
 }
];
