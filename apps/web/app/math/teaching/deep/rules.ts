import type {DeepLesson} from "../deep-read";
export const RULES_DEEP:DeepLesson[]=[
 {
  "title": "Derivative rules, checked against numbers",
  "minutes": 13,
  "sections": [
   {
    "id": "rul-observe",
    "kicker": "1 · Observe",
    "title": "Rules save you from limits",
    "blocks": [
     {
      "kind": "p",
      "text": "Computing a derivative from the definition every time is slow. A few rules cover almost every function you will meet in machine learning. We state them, then check each one numerically so you can trust it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Which rules do you need, and how do you know a formula is right?"
     }
    ]
   },
   {
    "id": "rul-express",
    "kicker": "2 · Express",
    "title": "The rules",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "power: d/dx xⁿ = n xⁿ⁻¹",
       "sum: (f + g)′ = f′ + g′",
       "product: (f g)′ = f′ g + f g′",
       "chain: (f(g(x)))′ = f′(g(x)) · g′(x)"
      ],
      "note": "The chain rule is the engine of backpropagation: multiply the derivatives along the chain."
     }
    ]
   },
   {
    "id": "rul-visualize",
    "kicker": "3 · Visualize",
    "title": "Checking each rule at x = 2",
    "blocks": [
     {
      "kind": "table",
      "caption": "Formula against a numerical nudge",
      "headers": [
       "Function",
       "Rule",
       "Formula at x = 2",
       "Numerical"
      ],
      "rows": [
       [
        "x³ + 2x",
        "power + sum",
        "14.0",
        "14.0"
       ],
       [
        "(3x + 1)⁴",
        "chain",
        "4116.0",
        "4116.0"
       ],
       [
        "x²(5x − 2)",
        "product",
        "52.0",
        "52.0"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "For (3x + 1)⁴, the outer function is u⁴ with derivative 4u³ = 4 × 7³ = 1,372, and the inner function 3x + 1 has derivative 3. Chain rule: 1,372 × 3 = 4,116."
     }
    ]
   },
   {
    "id": "rul-discover",
    "kicker": "4 · Discover",
    "title": "A loss is a chain",
    "blocks": [
     {
      "kind": "p",
      "text": "The loss L(w) = (w x − y)² is a chain: inner residual r = w x − y, then square. dL/dw = 2r · x. At x = 2, y = 6, w = 1 the residual is −4, so dL/dw = 2 × (−4) × 2 = −16: raising w reduces the loss quickly."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A handful of rules covers most derivatives, and the chain rule multiplies the slopes along a chain of operations."
     }
    ]
   },
   {
    "id": "rul-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a product. d/dx of x²(5x − 2) = 2x(5x − 2) + x² × 5. At x = 2: 4 × 8 + 4 × 5 = 32 + 20 = 52."
     },
     {
      "kind": "p",
      "text": "Example 2, a hidden chain. For a prediction p = w x + b and loss (p − y)², the weight reaches the loss through p. dL/dw = 2(p − y) × x."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Backpropagation applies the chain rule layer by layer."
     },
     {
      "kind": "check",
      "question": "What is d/dx of (2x + 1)³ at x = 0?",
      "options": [
       "6",
       "3",
       "12"
      ],
      "answer": 0,
      "why": "Outer: 3(2x+1)² = 3 at x = 0. Inner: 2. Product: 6."
     }
    ]
   },
   {
    "id": "rul-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Dropping the inner derivative",
      "text": "The classic chain-rule error. The next lesson shows what it does to training."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Applying the power rule to eˣ",
      "text": "d/dx eˣ = eˣ, not x eˣ⁻¹."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Trusting a formula you have not checked",
      "text": "Compare with a numerical nudge."
     }
    ]
   },
   {
    "id": "rul-python",
    "kicker": "7 · In Python",
    "title": "Checking rules in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Formulas against numerical derivatives",
      "code": "f = lambda x: x ** 3 + 2 * x            # power and sum rules: 3x^2 + 2\ng = lambda x: (3 * x + 1) ** 4          # chain rule: 4 (3x+1)^3 * 3\nh = lambda x: x ** 2 * (5 * x - 2)      # product rule: 2x (5x-2) + x^2 * 5\n\ndef nd(fn, x, eps=1e-6):\n    return (fn(x + eps) - fn(x - eps)) / (2 * eps)\n\nx = 2.0\nrules = {\n    \"power + sum\": (3 * x ** 2 + 2, nd(f, x)),\n    \"chain\": (4 * (3 * x + 1) ** 3 * 3, nd(g, x)),\n    \"product\": (2 * x * (5 * x - 2) + x ** 2 * 5, nd(h, x)),\n}\nfor name, (formula, numeric) in rules.items():\n    print(name.ljust(12), \"formula\", round(formula, 3), \"| numerical\", round(numeric, 3))\n\n# a loss as a chain: L(w) = (w*x - y)^2 = outer(inner(w))\nxv, y, w = 2.0, 6.0, 1.0\ninner = w * xv - y\nprint(\"residual\", inner, \"| dL/dw = 2 * residual * x =\", 2 * inner * xv)",
      "output": "power + sum  formula 14.0 | numerical 14.0\nchain        formula 4116.0 | numerical 4116.0\nproduct      formula 52.0 | numerical 52.0\nresidual -4.0 | dL/dw = 2 * residual * x = -16.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Every derivative formula can and should be checked with a nudge."
     }
    ]
   }
  ]
 }
];
