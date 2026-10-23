import type {DeepLesson} from "../deep-read";
export const SECANTS_DEEP:DeepLesson[]=[
 {
  "title": "From average change to instant change",
  "minutes": 12,
  "sections": [
   {
    "id": "sec-observe",
    "kicker": "1 · Observe",
    "title": "How fast is the cost rising right now?",
    "blocks": [
     {
      "kind": "p",
      "text": "The cost of a project grows as size squared. Between size 3 and size 5 it climbs by 16 lakh, an average of 8 lakh per unit. But what is the rate at exactly size 3? Averages over an interval cannot answer that, so we shrink the interval."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What happens to the average rate as the interval shrinks to nothing?"
     }
    ]
   },
   {
    "id": "sec-express",
    "kicker": "2 · Express",
    "title": "Secants and tangents",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "secant slope = (f(x₀ + h) − f(x₀)) ÷ h",
       "derivative = what the secant slope approaches as h → 0"
      ],
      "note": "A secant is a line through two points of the curve. A tangent touches the curve at one point."
     }
    ]
   },
   {
    "id": "sec-visualize",
    "kicker": "3 · Visualize",
    "title": "Shrinking the interval",
    "blocks": [
     {
      "kind": "table",
      "caption": "f(x) = x² at x₀ = 3",
      "headers": [
       "h",
       "Secant slope"
      ],
      "rows": [
       [
        "2.0",
        "8.0"
       ],
       [
        "1.0",
        "7.0"
       ],
       [
        "0.5",
        "6.5"
       ],
       [
        "0.1",
        "6.1"
       ],
       [
        "0.01",
        "6.01"
       ],
       [
        "0.001",
        "6.001"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The slopes close in on 6 from above, and 6 is 2 × 3, the derivative 2x at x = 3."
     }
    ]
   },
   {
    "id": "sec-discover",
    "kicker": "4 · Discover",
    "title": "How small should h be?",
    "blocks": [
     {
      "kind": "p",
      "text": "In code, a smaller h should be better, but computers store numbers with limited digits. For sin at 1, the forward difference error shrinks from 4.29e-2 to about 3e-9 as h falls to 1e-8, then grows again to 4.3e-5 at 1e-12 and 1.5e-2 at 1e-15, because subtracting nearly equal numbers destroys digits. The central difference (f(x+h) − f(x−h)) ÷ 2h is far more accurate for the same h. Your last digits may differ slightly on another machine."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "The derivative is the limit of secant slopes, and numerical derivatives need an h that is small but not too small."
     }
    ]
   },
   {
    "id": "sec-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, by hand. (3.1² − 3²) ÷ 0.1 = (9.61 − 9) ÷ 0.1 = 6.1."
     },
     {
      "kind": "p",
      "text": "Example 2, a sensible h. A step of 1e-5 is a good default for a central difference on smooth functions."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "The slope of a loss with respect to a weight is the derivative. Gradient checks use central differences."
     },
     {
      "kind": "check",
      "question": "The secant slopes of f at x₀ are 7, 6.5, 6.1, 6.01. What is the derivative likely to be?",
      "options": [
       "7",
       "6",
       "6.5"
      ],
      "answer": 1,
      "why": "The values approach 6 as the interval shrinks."
     }
    ]
   },
   {
    "id": "sec-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Using too large an h",
      "text": "You compute an average, not an instant rate."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Using too small an h",
      "text": "Rounding error swamps the answer."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Forward differences when accuracy matters",
      "text": "Central differences are more accurate."
     }
    ]
   },
   {
    "id": "sec-python",
    "kicker": "7 · In Python",
    "title": "Secants in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Secant slopes shrink to the tangent, and forward against central error",
      "code": "# average rate over a shrinking interval approaches the instantaneous rate\nf = lambda x: x ** 2                       # e.g. cost in lakh of a project of size x\nx0 = 3.0\nprint(\"h        | secant slope (f(x0+h) - f(x0)) / h\")\nfor h in (2.0, 1.0, 0.5, 0.1, 0.01, 0.001):\n    print(str(h).ljust(8), \"|\", round((f(x0 + h) - f(x0)) / h, 4))\nprint(\"tangent slope at 3 (derivative 2x):\", 2 * x0)\n\n# the error of a numerical derivative: too big an h is crude, too small an h loses digits\nimport math\ng = math.sin\ntrue = math.cos(1.0)\nprint(\"h        | forward diff error | central diff error\")\nfor h in (1e-1, 1e-3, 1e-5, 1e-8, 1e-12, 1e-15):\n    fwd = (g(1.0 + h) - g(1.0)) / h\n    ctr = (g(1.0 + h) - g(1.0 - h)) / (2 * h)\n    print(f\"{h:.0e}  | {abs(fwd - true):.2e}          | {abs(ctr - true):.2e}\")",
      "output": "h        | secant slope (f(x0+h) - f(x0)) / h\n2.0      | 8.0\n1.0      | 7.0\n0.5      | 6.5\n0.1      | 6.1\n0.01     | 6.01\n0.001    | 6.001\ntangent slope at 3 (derivative 2x): 6.0\nh        | forward diff error | central diff error\n1e-01  | 4.29e-02          | 9.00e-04\n1e-03  | 4.21e-04          | 9.01e-08\n1e-05  | 4.21e-06          | 1.11e-11\n1e-08  | 2.97e-09          | 2.58e-09\n1e-12  | 4.32e-05          | 1.23e-05\n1e-15  | 1.48e-02          | 1.48e-02"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "The derivative is the limit of average rates over a shrinking interval."
     }
    ]
   }
  ]
 }
];
