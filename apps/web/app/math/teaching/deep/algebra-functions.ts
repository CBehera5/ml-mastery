import type {DeepLesson} from "../deep-read";
export const ALGEBRA_DEEP:DeepLesson[]=[
 {
  "title": "A bill you can write down, and run backwards",
  "minutes": 12,
  "sections": [
   {
    "id": "al1-observe",
    "kicker": "1 · Observe",
    "title": "A delivery app and an unexplained bill",
    "blocks": [
     {
      "kind": "p",
      "text": "A delivery app charges ₹40 to start and ₹12 for every kilometre. Rahul sees a bill of ₹160 and wonders how far the rider went. He could guess and check, but there is a faster way: write the rule as an equation and run it backwards."
     },
     {
      "kind": "p",
      "text": "This is the oldest trick in mathematics, and the first one machine learning uses. A model is a rule with some numbers in it. Learning is finding the numbers that make the rule match the world."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we write a rule with an unknown, and how do we solve for it without guessing?"
     }
    ]
   },
   {
    "id": "al1-express",
    "kicker": "2 · Express",
    "title": "Naming the unknown",
    "blocks": [
     {
      "kind": "p",
      "text": "Let x be the distance in kilometres. The bill is the fixed fee plus the rate times x. The ₹40 and the ₹12 are parameters: numbers we set and hold still while x varies. The 12 multiplying x is a coefficient."
     },
     {
      "kind": "eq",
      "lines": [
       "bill = 40 + 12 x",
       "40 + 12 x = 160   ← an equation: two expressions that must be equal"
      ],
      "note": "An expression describes a calculation. An equation says two expressions are equal, and solving it means finding the x that makes that true."
     }
    ]
   },
   {
    "id": "al1-visualize",
    "kicker": "3 · Visualize",
    "title": "Undo in reverse order",
    "blocks": [
     {
      "kind": "p",
      "text": "The bill was built by multiplying x by 12, then adding 40. To undo, reverse the order: subtract 40 first, then divide by 12. Whatever you do to one side, do to the other, so the equality stays true."
     },
     {
      "kind": "table",
      "caption": "Solving 40 + 12x = 160",
      "headers": [
       "Step",
       "Left side",
       "Right side"
      ],
      "rows": [
       [
        "Start",
        "40 + 12x",
        "160"
       ],
       [
        "Subtract 40 from both sides",
        "12x",
        "120"
       ],
       [
        "Divide both sides by 12",
        "x",
        "10"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Check by substituting: 40 + 12 × 10 = 160. The rider went 10 km. For bills of ₹100, ₹160, ₹220 and ₹52 the distances are 5, 10, 15 and 1 km."
     }
    ]
   },
   {
    "id": "al1-discover",
    "kicker": "4 · Discover",
    "title": "The same equation, different parameters",
    "blocks": [
     {
      "kind": "p",
      "text": "If the app raises its fee to ₹60, the same ₹160 buys fewer kilometres: (160 − 60) ÷ 12 = 8.33 km. The unknown is still x. The parameters changed. Keeping the roles straight, what is held fixed and what is being found, is half of reading any model."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "An equation is a rule with a gap in it. Undo the rule step by step, in reverse order, applying every step to both sides."
     }
    ]
   },
   {
    "id": "al1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, the unit check. ₹12 per km × 10 km = ₹120, and ₹120 + ₹40 = ₹160. Rupees per kilometre times kilometres gives rupees, which can be added to a fee in rupees. If the units do not line up, the equation is wrong."
     },
     {
      "kind": "p",
      "text": "Example 2, the degenerate case. Suppose the app charged 0 per km: 0 × x + 40 = 160. No x can make that true. With a rate of 0, the bill does not depend on distance, and you cannot recover distance from it."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "In linear regression the prediction is w·x + b. Training is solving for w and b so the rule matches observed bills."
     },
     {
      "kind": "check",
      "question": "The rule is bill = 50 + 15x and the bill is ₹200. What is x?",
      "options": [
       "10",
       "16.67",
       "3.33"
      ],
      "answer": 0,
      "why": "Subtract 50 to get 15x = 150, then divide by 15 to get x = 10."
     }
    ]
   },
   {
    "id": "al1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Changing only one side",
      "text": "Subtracting 40 from the left and forgetting the right breaks the equality."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Undoing in the wrong order",
      "text": "Dividing by 12 before subtracting 40 gives 160 ÷ 12 − 40, which is nonsense."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Ignoring units",
      "text": "If the fee is in rupees and the distance in metres, the rate has to be rupees per metre."
     }
    ]
   },
   {
    "id": "al1-python",
    "kicker": "7 · In Python",
    "title": "The bill rule in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Write the rule, run it backwards",
      "code": "import numpy as np\n\nfee, per_km = 40, 12                        # rupees: fixed fee, rupees per kilometre\nbill = lambda km: fee + per_km * km\nprint(\"bill for 0, 5, 10 km:\", [bill(k) for k in (0, 5, 10)])\n\n# equation: 40 + 12 x = 160  ->  undo the addition, then undo the multiplication\ntarget = 160\nx = (target - fee) / per_km\nprint(\"distance that gives a bill of\", target, \"=\", x, \"km | check:\", bill(x))\n\n# the same unknown for several bills at once\nbills = np.array([100, 160, 220, 52])\nprint(\"distances:\", (bills - fee) / per_km)\n\n# parameters change between experiments, x stays the unknown\nfor new_fee in (40, 60):\n    print(\"fee\", new_fee, \"-> a 160 rupee bill covers\", round((160 - new_fee) / per_km, 2), \"km\")",
      "output": "bill for 0, 5, 10 km: [40, 100, 160]\ndistance that gives a bill of 160 = 10.0 km | check: 160.0\ndistances: [ 5. 10. 15.  1.]\nfee 40 -> a 160 rupee bill covers 10.0 km\nfee 60 -> a 160 rupee bill covers 8.33 km"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Solving is undoing. The check at the end, substitute and compare, is always worth one line."
     }
    ]
   }
  ]
 },
 {
  "title": "A function is a promise: one input, one output",
  "minutes": 12,
  "sections": [
   {
    "id": "al2-observe",
    "kicker": "1 · Observe",
    "title": "Autos, fares and a surprise",
    "blocks": [
     {
      "kind": "p",
      "text": "An auto-rickshaw fare is ₹30 plus ₹14 per kilometre. Give the driver a distance and he gives you exactly one fare. That reliability is what mathematicians call a function. If the same distance could produce two different fares, you could not plan a budget."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What makes a rule a function, and where is it allowed to be used?"
     }
    ]
   },
   {
    "id": "al2-express",
    "kicker": "2 · Express",
    "title": "Function notation",
    "blocks": [
     {
      "kind": "p",
      "text": "We write f(x) for the output of the rule f at input x. The set of allowed inputs is the domain. The set of outputs actually produced is the range."
     },
     {
      "kind": "eq",
      "lines": [
       "fare(km) = 30 + 14 km",
       "domain: km ≥ 0   (a distance cannot be negative)"
      ],
      "note": "f(2.5) means: put 2.5 in where the symbol x or km was, and compute."
     }
    ]
   },
   {
    "id": "al2-visualize",
    "kicker": "3 · Visualize",
    "title": "Evaluating, and guarding the domain",
    "blocks": [
     {
      "kind": "table",
      "caption": "fare at three distances",
      "headers": [
       "km",
       "fare (₹)"
      ],
      "rows": [
       [
        "0",
        "30"
       ],
       [
        "2.5",
        "65"
       ],
       [
        "10",
        "170"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Asking for a fare at −1 km is outside the domain. Code should say so loudly instead of returning a number. The same idea shows up in 1 ÷ (x − 3): any x works except 3, where the denominator is zero. Near 3 the output explodes, at x = 3.001 it is 1,000, and at 3 it does not exist."
     }
    ]
   },
   {
    "id": "al2-discover",
    "kicker": "4 · Discover",
    "title": "Not every rule is a function",
    "blocks": [
     {
      "kind": "p",
      "text": "The question 'what number squares to 4?' has two answers, +2 and −2. One input, two outputs: not a function. The square-root function fixes this by promising the non-negative answer, so √4 = 2 every time."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A function assigns exactly one output to every input in its domain, and a model is useful because of that promise."
     }
    ]
   },
   {
    "id": "al2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a fare. fare(2.5) = 30 + 14 × 2.5 = 65. The same input always gives 65."
     },
     {
      "kind": "p",
      "text": "Example 2, a domain. g(x) = √(x − 1). For x = 5, g = 2. For x = −3 the square root of −4 is not a real number, so the domain is x ≥ 1."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "A trained model is a function from features to a prediction. Feeding it a value far outside its training domain is a request for an answer the promise does not cover."
     },
     {
      "kind": "check",
      "question": "Which is NOT a function of x?",
      "options": [
       "y = 3x + 1",
       "y = x²",
       "The pairs (2, 5) and (2, 7)"
      ],
      "answer": 2,
      "why": "The input 2 gives two different outputs, 5 and 7. A function allows only one."
     }
    ]
   },
   {
    "id": "al2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Ignoring the domain",
      "text": "A negative distance or a zero denominator is outside the rule's promise."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Confusing f(x) with f times x",
      "text": "f(2) means 'f evaluated at 2', not f × 2."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Assuming the range is everything",
      "text": "x² never outputs a negative number."
     }
    ]
   },
   {
    "id": "al2-python",
    "kicker": "7 · In Python",
    "title": "A fare function with guards",
    "blocks": [
     {
      "kind": "code",
      "caption": "Evaluate, guard the domain, spot a non-function",
      "code": "import math\n\ndef fare(km):\n    \"\"\"Auto fare: rupees. Defined only for a distance of zero or more.\"\"\"\n    if km < 0:\n        raise ValueError(\"distance cannot be negative\")\n    return 30 + 14 * km\n\nfor km in (0, 2.5, 10):\n    print(\"fare(\", km, \") =\", fare(km))\n\ntry:\n    fare(-1)\nexcept ValueError as e:\n    print(\"fare(-1) ->\", e)\n\n# a rule that is not a function of x alone: one input, two outputs\npairs = [(4, 2), (4, -2)]            # x = 4 gives both +2 and -2 as 'square roots'\nprint(\"inputs repeated with different outputs:\", {x for x, _ in pairs if sum(1 for a, _ in pairs if a == x) > 1})\nprint(\"the function sqrt picks one:\", math.sqrt(4))\n\n# the domain of 1 / (x - 3): everything except 3\nfor x in (2, 3.001, 4):\n    print(\"1 / (x - 3) at\", x, \"=\", round(1 / (x - 3), 3))\ntry:\n    1 / (3 - 3)\nexcept ZeroDivisionError:\n    print(\"1 / (3 - 3) -> undefined, 3 is outside the domain\")",
      "output": "fare( 0 ) = 30\nfare( 2.5 ) = 65.0\nfare( 10 ) = 170\nfare(-1) -> distance cannot be negative\ninputs repeated with different outputs: {4}\nthe function sqrt picks one: 2.0\n1 / (x - 3) at 2 = -1.0\n1 / (x - 3) at 3.001 = 1000.0\n1 / (x - 3) at 4 = 1.0\n1 / (3 - 3) -> undefined, 3 is outside the domain"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A function only promises answers inside its domain. Check the input."
     }
    ]
   }
  ]
 },
 {
  "title": "Graphs, slopes and the plan that costs less",
  "minutes": 13,
  "sections": [
   {
    "id": "al3-observe",
    "kicker": "1 · Observe",
    "title": "Two data plans, one decision",
    "blocks": [
     {
      "kind": "p",
      "text": "Plan A costs ₹199 a month plus ₹10 for each extra GB. Plan B costs ₹399 plus ₹4 per extra GB. Which should you choose? It depends on how much data you use, and the picture that answers it fastest is a graph."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What do slope and intercept say, and where do two lines cross?"
     }
    ]
   },
   {
    "id": "al3-express",
    "kicker": "2 · Express",
    "title": "Slope and intercept",
    "blocks": [
     {
      "kind": "p",
      "text": "A straight line is y = m x + c. The intercept c is the value at x = 0. The slope m is the change in y for one unit of x: rise over run."
     },
     {
      "kind": "eq",
      "lines": [
       "slope = (y₂ − y₁) ÷ (x₂ − x₁)",
       "A: cost = 199 + 10 x     B: cost = 399 + 4 x"
      ],
      "note": "Plan A has the lower intercept, so it starts cheaper. Plan B has the smaller slope, so it grows more slowly."
     }
    ]
   },
   {
    "id": "al3-visualize",
    "kicker": "3 · Visualize",
    "title": "Where they cross",
    "blocks": [
     {
      "kind": "table",
      "caption": "Monthly cost by extra GB",
      "headers": [
       "Extra GB",
       "Plan A",
       "Plan B"
      ],
      "rows": [
       [
        "0",
        "₹199",
        "₹399"
       ],
       [
        "10",
        "₹299",
        "₹439"
       ],
       [
        "20",
        "₹399",
        "₹479"
       ],
       [
        "30",
        "₹499",
        "₹519"
       ],
       [
        "40",
        "₹599",
        "₹559"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Between 30 and 40 GB the order flips. Set the costs equal: 199 + 10x = 399 + 4x, so 6x = 200 and x = 33.33 GB, at a bill of about ₹532. Below 33 GB, plan A is cheaper. Above it, plan B wins."
     }
    ]
   },
   {
    "id": "al3-discover",
    "kicker": "4 · Discover",
    "title": "Reading a slope back from data",
    "blocks": [
     {
      "kind": "p",
      "text": "Real bills have noise. Fitting a line to noisy points recovers the slope: with the plan A bills scattered by about ₹8, a fitted line gave slope 9.98 and intercept 201.1, close to the true 10 and 199. This is, in miniature, what linear regression does."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A line is an intercept plus a slope times x, and where two lines meet, their rules give the same answer."
     }
    ]
   },
   {
    "id": "al3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a slope. Between 10 GB (₹299) and 30 GB (₹499): (499 − 299) ÷ (30 − 10) = 10 rupees per GB."
     },
     {
      "kind": "p",
      "text": "Example 2, a decision. A user who typically uses 25 extra GB pays ₹449 on A and ₹499 on B. A is cheaper by ₹50."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "The weight in a regression is a slope, and the bias is an intercept. The crossing point of two lines reappears as a decision boundary."
     },
     {
      "kind": "check",
      "question": "Plan C: ₹299 plus ₹5 per GB. Where does it cross plan A (199 + 10x)?",
      "options": [
       "20 GB",
       "10 GB",
       "60 GB"
      ],
      "answer": 0,
      "why": "199 + 10x = 299 + 5x gives 5x = 100, so x = 20 GB."
     }
    ]
   },
   {
    "id": "al3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading the crossing point beyond the data",
      "text": "If nobody uses 33 GB, the crossing is a calculation, not a user experience."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Mixing up slope and intercept",
      "text": "The intercept is the start, the slope is the rate."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Mis-scaled axes",
      "text": "A graph with a squeezed axis makes any slope look steep or flat."
     }
    ]
   },
   {
    "id": "al3-python",
    "kicker": "7 · In Python",
    "title": "Plans and slopes in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Two plans, a crossing point, and a fitted slope",
      "code": "import numpy as np\n\n# two data plans: (price per month, GB included beyond a base)\n# plan A: 199 rupees base + 10 rupees per extra GB.  plan B: 399 rupees base + 4 rupees per extra GB\na = lambda gb: 199 + 10 * gb\nb = lambda gb: 399 + 4 * gb\nfor gb in (0, 10, 20, 30, 40):\n    print(\"extra GB\", str(gb).rjust(2), \"| A:\", a(gb), \"| B:\", b(gb))\n\n# slope between two points of a line\n(x1, y1), (x2, y2) = (10, a(10)), (30, a(30))\nprint(\"slope of A =\", (y2 - y1) / (x2 - x1), \"rupees per GB | intercept (GB = 0):\", a(0))\n\n# where the lines cross: 199 + 10x = 399 + 4x\nx_cross = (399 - 199) / (10 - 4)\nprint(\"lines cross at\", round(x_cross, 2), \"GB, bill\", round(a(x_cross), 1))\n\n# fit a line to noisy points and read the slope back\nrng = np.random.default_rng(1)\ngb = np.arange(0, 41, 4)\npaid = a(gb) + rng.normal(0, 8, len(gb))\nslope, intercept = np.polyfit(gb, paid, 1)\nprint(\"fitted slope\", round(slope, 2), \"intercept\", round(intercept, 1))",
      "output": "extra GB  0 | A: 199 | B: 399\nextra GB 10 | A: 299 | B: 439\nextra GB 20 | A: 399 | B: 479\nextra GB 30 | A: 499 | B: 519\nextra GB 40 | A: 599 | B: 559\nslope of A = 10.0 rupees per GB | intercept (GB = 0): 199\nlines cross at 33.33 GB, bill 532.3\nfitted slope 9.98 intercept 201.1"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Slope is a rate. Intercept is a start. Where two lines meet is an equation to solve."
     }
    ]
   }
  ]
 },
 {
  "title": "Powers, compounding and the number e",
  "minutes": 14,
  "sections": [
   {
    "id": "al4-observe",
    "kicker": "1 · Observe",
    "title": "₹1 lakh, 30 years, 8 percent",
    "blocks": [
     {
      "kind": "p",
      "text": "You put ₹1,00,000 into a fund that earns 8 percent a year. Simple interest would give you ₹8,000 every year: ₹3,40,000 after 30 years. Compounding gives you ₹10.06 lakh. The difference is a power."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does repeated multiplication look like, and why does the number e appear?"
     }
    ]
   },
   {
    "id": "al4-express",
    "kicker": "2 · Express",
    "title": "Repeated multiplication",
    "blocks": [
     {
      "kind": "p",
      "text": "1.08 × 1.08 × … × 1.08, t times, is 1.08ᵗ. The exponent counts how many times we multiply. Negative exponents divide (2⁻³ = 1/8 = 0.125) and fractional exponents take roots (9^0.5 = 3)."
     },
     {
      "kind": "eq",
      "lines": [
       "value after t years = P · (1 + r)ᵗ",
       "simple interest: P · (1 + r t)"
      ],
      "note": "Simple growth adds the same amount each year. Compound growth adds a share of everything so far."
     }
    ]
   },
   {
    "id": "al4-visualize",
    "kicker": "3 · Visualize",
    "title": "Linear against exponential",
    "blocks": [
     {
      "kind": "table",
      "caption": "₹1,00,000 at 8 percent",
      "headers": [
       "Year",
       "Simple interest",
       "Compound"
      ],
      "rows": [
       [
        "1",
        "₹1,08,000",
        "₹1,08,000"
       ],
       [
        "5",
        "₹1,40,000",
        "₹1,46,933"
       ],
       [
        "10",
        "₹1,80,000",
        "₹2,15,892"
       ],
       [
        "20",
        "₹2,60,000",
        "₹4,66,096"
       ],
       [
        "30",
        "₹3,40,000",
        "₹10,06,266"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "They agree in year 1 and drift apart. By year 30, compounding has produced almost three times as much."
     }
    ]
   },
   {
    "id": "al4-discover",
    "kicker": "4 · Discover",
    "title": "The number e",
    "blocks": [
     {
      "kind": "p",
      "text": "Compound more often and you get a little more: monthly gives 1.0830 per year, daily 1.083278. There is a limit, because splitting the year into a hundred thousand parts gives 1.083287, which is e⁰·⁰⁸. The number e = 2.71828… is what continuous compounding converges to."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Repeated growth by a fixed share is exponential, and continuous growth at rate r multiplies by e^r over one period."
     }
    ]
   },
   {
    "id": "al4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, 10 years. 1.08¹⁰ = 2.1589, so ₹1,00,000 becomes ₹2,15,892."
     },
     {
      "kind": "p",
      "text": "Example 2, different compounding. At 8 percent compounded twice a year, each half-year multiplies by 1.04, so one year gives 1.04² = 1.0816, a bit more than 1.08."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Learning rates that decay by a factor each epoch, and the sigmoid's e^(−z), are powers at work."
     },
     {
      "kind": "check",
      "question": "Growth of 10 percent a year for 2 years multiplies money by...",
      "options": [
       "1.20",
       "1.21",
       "1.10"
      ],
      "answer": 1,
      "why": "1.1 × 1.1 = 1.21. Compound growth is slightly more than the simple 20 percent."
     }
    ]
   },
   {
    "id": "al4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Adding percentages",
      "text": "Two years at 10 percent is 21 percent, not 20."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Trusting exponential growth forever",
      "text": "Real quantities saturate. The curve is a model of a stretch of the data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Confusing x² with 2ˣ",
      "text": "The first is a power of x. The second is a power of 2 and grows far faster."
     }
    ]
   },
   {
    "id": "al4-python",
    "kicker": "7 · In Python",
    "title": "Simple against compound in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Compounding, and the limit that is e",
      "code": "import math\n\nprincipal, rate = 100000, 0.08              # rupees, per year\nprint(\"year | simple interest | compound (once a year)\")\nfor year in (1, 5, 10, 20, 30):\n    simple = principal * (1 + rate * year)\n    compound = principal * (1 + rate) ** year\n    print(str(year).rjust(4), \"|\", str(round(simple)).rjust(15), \"|\", round(compound))\n\nprint()\nprint(\"same 8 percent, compounded more often, for one year:\")\nfor n in (1, 2, 12, 365, 100000):\n    print(str(n).rjust(6), \"times a year ->\", round((1 + rate / n) ** n, 6))\nprint(\"e^0.08 =\", round(math.e ** rate, 6), \" | e =\", round(math.e, 6))\nprint(\"powers with negative and fractional exponents: 2**-3 =\", 2 ** -3, \" 9**0.5 =\", 9 ** 0.5)",
      "output": "year | simple interest | compound (once a year)\n   1 |          108000 | 108000\n   5 |          140000 | 146933\n  10 |          180000 | 215892\n  20 |          260000 | 466096\n  30 |          340000 | 1006266\n\nsame 8 percent, compounded more often, for one year:\n     1 times a year -> 1.08\n     2 times a year -> 1.0816\n    12 times a year -> 1.083\n   365 times a year -> 1.083278\n100000 times a year -> 1.083287\ne^0.08 = 1.083287  | e = 2.718282\npowers with negative and fractional exponents: 2**-3 = 0.125  9**0.5 = 3.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Compounding turns a fixed share into a curve that bends upward."
     }
    ]
   }
  ]
 },
 {
  "title": "Logarithms: how long until it doubles?",
  "minutes": 13,
  "sections": [
   {
    "id": "al5-observe",
    "kicker": "1 · Observe",
    "title": "A question the power cannot answer",
    "blocks": [
     {
      "kind": "p",
      "text": "Powers tell you the money after t years. Often the question runs the other way: how many years until it doubles? We know the answer we want, 2, and need the exponent that produces it. That backward step is the logarithm."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What is a logarithm, and why do we keep taking logs of data in ML?"
     }
    ]
   },
   {
    "id": "al5-express",
    "kicker": "2 · Express",
    "title": "Logarithms undo exponents",
    "blocks": [
     {
      "kind": "p",
      "text": "log_b(y) is the exponent you put on b to get y. Since 2³ = 8, log₂(8) = 3. Logs turn multiplication into addition, which is why they tame huge ranges."
     },
     {
      "kind": "eq",
      "lines": [
       "1.08ᵗ = 2  ⇒  t = log 2 ÷ log 1.08",
       "log(a · b) = log a + log b"
      ],
      "note": "Any base works for the ratio, because the base cancels."
     }
    ]
   },
   {
    "id": "al5-visualize",
    "kicker": "3 · Visualize",
    "title": "Doubling time",
    "blocks": [
     {
      "kind": "table",
      "caption": "Years at 8 percent growth",
      "headers": [
       "Question",
       "Answer"
      ],
      "rows": [
       [
        "Years to double",
        "9.01"
       ],
       [
        "Rule of 72 estimate (72 ÷ 8)",
        "9.00"
       ],
       [
        "Years for ₹1 lakh to become ₹10 lakh",
        "29.9"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The rule of 72 is a shortcut for the logarithm and gets within a few hundredths of a year at 8 percent."
     }
    ]
   },
   {
    "id": "al5-discover",
    "kicker": "4 · Discover",
    "title": "Logs tame huge ranges",
    "blocks": [
     {
      "kind": "p",
      "text": "Five accounts have 120, 1,500, 24,000, 3,10,000 and 42,00,000 followers. On a raw scale the biggest is 35,000 times the smallest, and a chart shows only the biggest. On a log₁₀ scale they sit at 2.08, 3.18, 4.38, 5.49 and 6.62, evenly enough to compare."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A logarithm answers 'how many times did we multiply?', and turns multiplication into addition."
     }
    ]
   },
   {
    "id": "al5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, product to sum. log₁₀(1000 × 250) = log₁₀ 1000 + log₁₀ 250 = 3 + 2.3979 = 5.3979."
     },
     {
      "kind": "p",
      "text": "Example 2, ratio of ranges. A model predicting house prices in lakh rupees spans ₹20 lakh to ₹20 crore. Predicting log(price) treats a ₹20 lakh error on a ₹40 lakh flat as bigger than on a ₹4 crore one, which is usually what a buyer feels."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Log loss, log-odds in logistic regression, log-transformed targets and log scales on learning curves."
     },
     {
      "kind": "check",
      "question": "log₁₀(100000) is...",
      "options": [
       "5",
       "10",
       "100000"
      ],
      "answer": 0,
      "why": "10⁵ = 100,000, so the exponent is 5."
     }
    ]
   },
   {
    "id": "al5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Taking the log of zero or a negative",
      "text": "Logs are defined only for positive numbers. Add a small constant or choose another transform."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Mixing bases",
      "text": "log₁₀ and natural log differ by a constant factor. Be consistent."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reading log charts as linear",
      "text": "Equal steps on a log axis mean equal ratios, not equal differences."
     }
    ]
   },
   {
    "id": "al5-python",
    "kicker": "7 · In Python",
    "title": "Doubling time in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Solve for the exponent, and compare scales",
      "code": "import math\n\nrate = 0.08\nt_double = math.log(2) / math.log(1 + rate)\nprint(\"years to double at 8 percent:\", round(t_double, 2), \"| check:\", round((1 + rate) ** t_double, 4))\nprint(\"rule of 72 says:\", round(72 / 8, 2))\nprint(\"years for Rs 1 lakh to become Rs 10 lakh:\", round(math.log(10) / math.log(1 + rate), 1))\n\n# logs turn products into sums\na, b = 1000.0, 250.0\nprint(\"log10(a*b) =\", round(math.log10(a * b), 4), \"= log10(a) + log10(b) =\", round(math.log10(a) + math.log10(b), 4))\n\n# a log scale: followers of five accounts\nfollowers = {\"A\": 120, \"B\": 1500, \"C\": 24000, \"D\": 310000, \"E\": 4_200_000}\nfor name, n in followers.items():\n    print(name, str(n).rjust(9), \"log10 =\", round(math.log10(n), 2))\nprint(\"largest / smallest on a raw scale:\", round(4_200_000 / 120), \"| on the log10 scale:\", round(math.log10(4_200_000) / math.log10(120), 2))",
      "output": "years to double at 8 percent: 9.01 | check: 2.0\nrule of 72 says: 9.0\nyears for Rs 1 lakh to become Rs 10 lakh: 29.9\nlog10(a*b) = 5.3979 = log10(a) + log10(b) = 5.3979\nA       120 log10 = 2.08\nB      1500 log10 = 3.18\nC     24000 log10 = 4.38\nD    310000 log10 = 5.49\nE   4200000 log10 = 6.62\nlargest / smallest on a raw scale: 35000 | on the log10 scale: 3.19"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "If you want the exponent, take a logarithm."
     }
    ]
   }
  ]
 },
 {
  "title": "Shifting, stretching and chaining rules",
  "minutes": 13,
  "sections": [
   {
    "id": "al6-observe",
    "kicker": "1 · Observe",
    "title": "Rules built from other rules",
    "blocks": [
     {
      "kind": "p",
      "text": "A taxi fare depends on miles, but your odometer reads kilometres. Converting first, then pricing, chains two rules into one. Standardising a column before a model is the same kind of move: shift and stretch the data, then hand it on."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do shifting, stretching and composing change a function, and why does order matter?"
     }
    ]
   },
   {
    "id": "al6-express",
    "kicker": "2 · Express",
    "title": "Transformations of a graph",
    "blocks": [
     {
      "kind": "p",
      "text": "Start with f(x) = x². Replace x by x − 3 and the graph moves 3 to the right. Add 5 to the output and it moves up 5. Multiply the output by 2 and it stretches vertically."
     },
     {
      "kind": "eq",
      "lines": [
       "g(x) = a · f(x − h) + k",
       "shift right h, shift up k, stretch by a",
       "composition: (g ∘ f)(x) = g(f(x))"
      ],
      "note": "Do the inside rule first, then the outside rule."
     }
    ]
   },
   {
    "id": "al6-visualize",
    "kicker": "3 · Visualize",
    "title": "Reading the shifts",
    "blocks": [
     {
      "kind": "table",
      "caption": "f(x) = x² at five points",
      "headers": [
       "x",
       "−2",
       "−1",
       "0",
       "1",
       "2"
      ],
      "rows": [
       [
        "f(x)",
        "4",
        "1",
        "0",
        "1",
        "4"
       ],
       [
        "f(x − 3)",
        "25",
        "16",
        "9",
        "4",
        "1"
       ],
       [
        "f(x) + 5",
        "9",
        "6",
        "5",
        "6",
        "9"
       ],
       [
        "2 f(x)",
        "8",
        "2",
        "0",
        "2",
        "8"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The shifted-right version at x = 3 equals the original at x = 0. A shift inside the brackets moves the graph the opposite way to the sign, which trips people up."
     }
    ]
   },
   {
    "id": "al6-discover",
    "kicker": "4 · Discover",
    "title": "Composition and standardising",
    "blocks": [
     {
      "kind": "p",
      "text": "trip(km) = cost(convert(km)): convert 10 km to 6.21 miles, then price at ₹22 per mile plus ₹30 to get ₹166.7. Reverse the order and you price 10 miles first (₹250) and then 'convert' rupees as if they were kilometres: ₹155.34, a meaningless number."
     },
     {
      "kind": "p",
      "text": "Standardising ages 22, 25, 31, 38, 44 subtracts the mean (32) and divides by the spread (8.12), giving values with mean 0 and spread 1. It is a shift followed by a stretch."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Shifts and stretches move a graph without changing its shape, and chaining rules means the output of one becomes the input of the next."
     }
    ]
   },
   {
    "id": "al6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a standardised age. Age 44: (44 − 32) ÷ 8.124 = 1.477, about one and a half spreads above the mean."
     },
     {
      "kind": "p",
      "text": "Example 2, undoing it. A model predicts a standardised price of 0.5. If prices have mean ₹60 lakh and spread ₹20 lakh, the real prediction is 0.5 × 20 + 60 = ₹70 lakh: stretch, then shift, the reverse of standardising."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Feature scaling, activation functions applied after linear layers, and every pipeline are compositions."
     },
     {
      "kind": "check",
      "question": "g(x) = (x − 2)². At what x does the graph reach its lowest point?",
      "options": [
       "x = −2",
       "x = 2",
       "x = 0"
      ],
      "answer": 1,
      "why": "(x − 2)² is zero when x = 2. The shift is to the right."
     }
    ]
   },
   {
    "id": "al6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Applying the steps in the wrong order",
      "text": "Composition is not commutative: f(g(x)) is usually not g(f(x))."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Scaling with test statistics",
      "text": "Compute the mean and spread from training rows only."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Forgetting to undo the transform",
      "text": "Predictions made on a standardised target must be converted back before anyone reads them."
     }
    ]
   },
   {
    "id": "al6-python",
    "kicker": "7 · In Python",
    "title": "Shifts, stretches and standardising in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Transform a function, compose two rules, standardise",
      "code": "import numpy as np\n\nf = lambda x: x ** 2\nx = np.array([-2.0, -1.0, 0.0, 1.0, 2.0])\nprint(\"f(x)            :\", f(x))\nprint(\"f(x - 3)  shift right 3 :\", f(x - 3))\nprint(\"f(x) + 5  shift up 5    :\", f(x) + 5)\nprint(\"2 * f(x)  stretch       :\", 2 * f(x))\n\n# composition: apply one rule, then another\nconvert = lambda km: km * 0.621371            # kilometres to miles\ncost = lambda miles: 30 + 22 * miles          # rupees per mile\ntrip = lambda km: cost(convert(km))\nprint(\"trip cost for 10 km:\", round(trip(10), 2), \"| order matters: convert(cost(10)) =\", round(convert(cost(10)), 2))\n\n# standardising is a shift and a stretch\nages = np.array([22.0, 25, 31, 38, 44])\nz = (ages - ages.mean()) / ages.std()\nprint(\"mean\", ages.mean(), \"spread\", round(ages.std(), 3))\nprint(\"standardised:\", np.round(z, 3), \"| new mean\", round(float(z.mean()), 6), \"new spread\", round(float(z.std()), 3))",
      "output": "f(x)            : [4. 1. 0. 1. 4.]\nf(x - 3)  shift right 3 : [25. 16.  9.  4.  1.]\nf(x) + 5  shift up 5    : [9. 6. 5. 6. 9.]\n2 * f(x)  stretch       : [8. 2. 0. 2. 8.]\ntrip cost for 10 km: 166.7 | order matters: convert(cost(10)) = 155.34\nmean 32.0 spread 8.124\nstandardised: [-1.231 -0.862 -0.123  0.739  1.477] | new mean 0.0 new spread 1.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Complex rules are simple rules chained in the right order."
     }
    ]
   }
  ]
 }
];
