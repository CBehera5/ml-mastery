import type {DeepLesson} from "../deep-read";
export const DEBUG_DEEP:DeepLesson[]=[
 {
  "title": "A gradient bug that still trains",
  "minutes": 13,
  "sections": [
   {
    "id": "dbg-observe",
    "kicker": "1 · Observe",
    "title": "The loss goes down. Is everything fine?",
    "blocks": [
     {
      "kind": "p",
      "text": "An engineer writes the gradient of a squared-error loss by hand and forgets one factor. Training still runs, the loss still falls, and nothing crashes. The model is simply learning more slowly than it should, and nobody notices."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we catch a derivative bug that does not break anything?"
     }
    ]
   },
   {
    "id": "dbg-express",
    "kicker": "2 · Express",
    "title": "Gradient checking",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "numerical gradient ≈ (L(w + ε) − L(w − ε)) ÷ 2ε",
       "relative error = |a − b| ÷ (|a| + |b|)"
      ],
      "note": "A relative error near 1e-7 or below is excellent. Near 1e-2 or above is a bug."
     }
    ]
   },
   {
    "id": "dbg-visualize",
    "kicker": "3 · Visualize",
    "title": "Correct against buggy",
    "blocks": [
     {
      "kind": "p",
      "text": "Loss L(w) = (w x − y)² with x = 2 and y = 6. The correct gradient is 2(w x − y) x. The buggy one omits the final factor x."
     },
     {
      "kind": "table",
      "caption": "Gradient at four weights",
      "headers": [
       "w",
       "Numerical",
       "Correct",
       "Buggy"
      ],
      "rows": [
       [
        "0",
        "−24",
        "−24",
        "−12"
       ],
       [
        "1",
        "−16",
        "−16",
        "−8"
       ],
       [
        "2",
        "−8",
        "−8",
        "−4"
       ],
       [
        "3",
        "0",
        "0",
        "0"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The buggy gradient has the right sign and the right zero at w = 3, so the model still heads to the right place, at half the intended speed."
     }
    ]
   },
   {
    "id": "dbg-discover",
    "kicker": "4 · Discover",
    "title": "What it costs",
    "blocks": [
     {
      "kind": "p",
      "text": "The relative error of the correct formula is 1.4e-11. For the buggy one it is 0.33, an obvious failure in a check that takes one line. After ten steps at the same learning rate, the correct version reaches w = 2.982 and loss 0.0013, and the buggy one is at w = 2.678 and loss 0.4151: over 300 times the loss."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A wrong gradient can still point downhill, so check every hand-written derivative against a numerical one."
     }
    ]
   },
   {
    "id": "dbg-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the diagnosis. The ratio of numerical to buggy gradient is 2 at every w. A constant ratio means a missing constant factor, here x = 2."
     },
     {
      "kind": "p",
      "text": "Example 2, a worse bug. A missing minus sign would send the model uphill, and the loss would grow. That is the easier bug to spot."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Frameworks that compute gradients automatically remove this class of bug, but custom layers and losses still need checks."
     },
     {
      "kind": "check",
      "question": "A hand-written gradient is exactly half the numerical one at every point. What happened?",
      "options": [
       "Rounding error",
       "A missing constant factor",
       "The loss is zero"
      ],
      "answer": 1,
      "why": "A constant ratio of 2 means a factor of 2 is missing from the formula."
     }
    ]
   },
   {
    "id": "dbg-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Assuming a falling loss means a correct gradient",
      "text": "It only means the direction is not completely wrong."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Checking at one point",
      "text": "Check at several points, including away from the minimum."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Checking with float noise",
      "text": "Use ε around 1e-5 and the central difference."
     }
    ]
   },
   {
    "id": "dbg-python",
    "kicker": "7 · In Python",
    "title": "A gradient check in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Numerical check, relative error and the cost of the bug",
      "code": "x, y = 2.0, 6.0\nloss = lambda w: (w * x - y) ** 2\ngood = lambda w: 2 * (w * x - y) * x            # chain rule with the inner derivative x\nbuggy = lambda w: 2 * (w * x - y)               # forgot to multiply by dInner/dw = x\n\ndef nd(fn, w, eps=1e-6):\n    return (fn(w + eps) - fn(w - eps)) / (2 * eps)\n\nfor w in (0.0, 1.0, 2.0, 3.0):\n    n = nd(loss, w)\n    print(\"w\", w, \"| numerical\", round(n, 4), \"| correct\", good(w), \"| buggy\", buggy(w))\n\n# the relative error is a gradient check you can automate\ndef rel(a, b):\n    return abs(a - b) / max(abs(a) + abs(b), 1e-12)\nprint(\"relative error, correct formula:\", f\"{rel(good(1.0), nd(loss, 1.0)):.1e}\")\nprint(\"relative error, buggy formula  :\", f\"{rel(buggy(1.0), nd(loss, 1.0)):.1e}\")\n\n# the bug does not break everything: it points the right way but takes the wrong size of step\nfor name, fn in ((\"correct\", good), (\"buggy\", buggy)):\n    w = 0.0\n    for _ in range(10):\n        w -= 0.05 * fn(w)\n    print(name.ljust(8), \"after 10 steps w =\", round(w, 3), \"| loss\", round(loss(w), 4))",
      "output": "w 0.0 | numerical -24.0 | correct -24.0 | buggy -12.0\nw 1.0 | numerical -16.0 | correct -16.0 | buggy -8.0\nw 2.0 | numerical -8.0 | correct -8.0 | buggy -4.0\nw 3.0 | numerical 0.0 | correct 0.0 | buggy 0.0\nrelative error, correct formula: 1.4e-11\nrelative error, buggy formula  : 3.3e-01\ncorrect  after 10 steps w = 2.982 | loss 0.0013\nbuggy    after 10 steps w = 2.678 | loss 0.4151"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Always ask: does the formula match a nudge?"
     }
    ]
   }
  ]
 }
];
