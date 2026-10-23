import type {DeepLesson} from "../deep-read";
export const PROBABILITY_DEEP:DeepLesson[]=[
 {
  "title": "What does '8 percent late' actually promise?",
  "minutes": 12,
  "sections": [
   {
    "id": "pb1-observe",
    "kicker": "1 · Observe",
    "title": "A delivery app and a number on the screen",
    "blocks": [
     {
      "kind": "p",
      "text": "A delivery app shows 'runs late 8% of the time'. What does that tell you about tonight's order? Not whether it will be late. It tells you how often orders like this are late over many orders. Probability is the language for exactly this gap between one uncertain event and a stable long-run pattern."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What is a probability, how do we compute it, and what does it promise about a single case?"
     }
    ]
   },
   {
    "id": "pb1-express",
    "kicker": "2 · Express",
    "title": "Outcomes, events and a number between 0 and 1",
    "blocks": [
     {
      "kind": "p",
      "text": "An experiment has outcomes: a die shows 1 to 6. An event is a collection of outcomes, such as 'even'. When outcomes are equally likely, the probability of an event is the number of outcomes in it divided by the total."
     },
     {
      "kind": "eq",
      "lines": [
       "P(event) = (outcomes in the event) ÷ (all outcomes)",
       "0 ≤ P ≤ 1,    P(not A) = 1 − P(A)"
      ],
      "note": "A probability of 0 means impossible and 1 means certain. The complement rule says the rest of the probability goes to 'not A'."
     }
    ]
   },
   {
    "id": "pb1-visualize",
    "kicker": "3 · Visualize",
    "title": "Frequency settles down",
    "blocks": [
     {
      "kind": "p",
      "text": "Flip a fair coin and count the share of heads."
     },
     {
      "kind": "table",
      "caption": "Share of heads as flips grow",
      "headers": [
       "Flips",
       "Share of heads"
      ],
      "rows": [
       [
        "10",
        "0.3000"
       ],
       [
        "100",
        "0.4600"
       ],
       [
        "10,000",
        "0.4996"
       ],
       [
        "1,000,000",
        "0.5002"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Ten flips can be far from 0.5. A million are within 0.0002. The probability 0.5 is the value the share settles on, not a prediction of the next flip."
     }
    ]
   },
   {
    "id": "pb1-discover",
    "kicker": "4 · Discover",
    "title": "Probability of a rate, not of a single case",
    "blocks": [
     {
      "kind": "p",
      "text": "For the delivery app: P(on time) = 1 − 0.08 = 0.92. Over 1,000 orders expect about 80 late, give or take. For tonight's order the honest statement is 'a 92 percent chance on time', not 'it will be on time'."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A probability is a long-run share of repeated trials, and the complement rule says whatever is not A takes the rest."
     }
    ]
   },
   {
    "id": "pb1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a die. P(even) = 3 ÷ 6 = 0.5 and P(at least 5) = 2 ÷ 6 = 0.333. P(not even) = 1 − 0.5 = 0.5."
     },
     {
      "kind": "p",
      "text": "Example 2, a model's chance. A churn model says 0.2 for a customer. Of 1,000 customers with 0.2, we expect about 200 to leave. If 350 do, the model is miscalibrated."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every classifier that outputs a probability is making a long-run promise that can be checked against reality."
     },
     {
      "kind": "check",
      "question": "A weather app says 30 percent chance of rain. It rains today. Was the app wrong?",
      "options": [
       "Yes, it said 30 percent",
       "No, 30 percent events happen",
       "Only if it rains again tomorrow"
      ],
      "answer": 1,
      "why": "A 30 percent forecast should be followed by rain about 3 days in 10. One rainy day does not refute it."
     }
    ]
   },
   {
    "id": "pb1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading a probability as a prediction",
      "text": "92 percent on time does not mean this order will be on time."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Assuming outcomes are equally likely",
      "text": "The counting rule only works when they are. A biased coin breaks it."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Believing in streaks",
      "text": "After five heads the coin still has a 0.5 chance of heads."
     }
    ]
   },
   {
    "id": "pb1-python",
    "kicker": "7 · In Python",
    "title": "Frequency and counting in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Share of heads, die events and the complement",
      "code": "import numpy as np\n\nrng = np.random.default_rng(0)\nprint(\"flips | share of heads\")\nfor n in (10, 100, 10_000, 1_000_000):\n    print(str(n).rjust(7), \"|\", round(float((rng.random(n) < 0.5).mean()), 4))\n\n# a fair die: probabilities of events are sums over outcomes\noutcomes = [1, 2, 3, 4, 5, 6]\neven = [o for o in outcomes if o % 2 == 0]\nprint(\"P(even) =\", len(even) / 6, \"| P(not even) =\", 1 - len(even) / 6)\nprint(\"P(at least 5) =\", round(len([o for o in outcomes if o >= 5]) / 6, 4))\n\n# a delivery runs late 8 percent of the time\np_late = 0.08\nprint(\"P(on time) =\", round(1 - p_late, 2), \"| of 1,000 orders expect about\", int(1000 * p_late), \"late\")",
      "output": "flips | share of heads\n     10 | 0.3\n    100 | 0.46\n  10000 | 0.4996\n1000000 | 0.5002\nP(even) = 0.5 | P(not even) = 0.5\nP(at least 5) = 0.3333\nP(on time) = 0.92 | of 1,000 orders expect about 80 late"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Probability is a long-run share. It describes the rate, not the single case."
     }
    ]
   }
  ]
 },
 {
  "title": "Counting outcomes and combining events",
  "minutes": 13,
  "sections": [
   {
    "id": "pb2-observe",
    "kicker": "1 · Observe",
    "title": "How safe is a 4-digit code?",
    "blocks": [
     {
      "kind": "p",
      "text": "A bank sends a 4-digit OTP. How many codes are possible, and what is the chance of guessing one on the first try? Probability starts with counting. Once you can count outcomes, combining events is bookkeeping."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we count outcomes, and how do we combine the chances of several events?"
     }
    ]
   },
   {
    "id": "pb2-express",
    "kicker": "2 · Express",
    "title": "The counting rules",
    "blocks": [
     {
      "kind": "p",
      "text": "If one choice has m options and the next has n, together there are m × n. Arrangements of 5 people in a line: 5 × 4 × 3 × 2 × 1 = 120. Choosing 3 of 10 for a shortlist when order does not matter: 120 as well, though for a different reason."
     },
     {
      "kind": "eq",
      "lines": [
       "multiplication rule: m × n",
       "independent events: P(A and B) = P(A) × P(B)",
       "any events: P(A or B) = P(A) + P(B) − P(A and B)"
      ],
      "note": "If A and B cannot both happen they are mutually exclusive, and the overlap term is zero."
     }
    ]
   },
   {
    "id": "pb2-visualize",
    "kicker": "3 · Visualize",
    "title": "Three trains",
    "blocks": [
     {
      "kind": "p",
      "text": "A commuter takes three trains, each late with probability 0.2, independently. P(all three on time) = 0.8³ = 0.512. So P(at least one late) = 1 − 0.512 = 0.488. Nearly half of journeys have some delay, though each train is mostly punctual."
     },
     {
      "kind": "table",
      "caption": "OTP size and guess probability",
      "headers": [
       "Digits",
       "Codes",
       "Chance of a one-try guess"
      ],
      "rows": [
       [
        "4",
        "10,000",
        "0.0001"
       ],
       [
        "6",
        "1,000,000",
        "0.000001"
       ]
      ]
     }
    ]
   },
   {
    "id": "pb2-discover",
    "kicker": "4 · Discover",
    "title": "Overlaps",
    "blocks": [
     {
      "kind": "p",
      "text": "Roll a die. A = 'at most 2' (1 or 2). B = 'even' (2, 4 or 6). P(A) = 0.333, P(B) = 0.5, P(A and B) = 0.167 (only the 2). P(A or B) = 0.333 + 0.5 − 0.167 = 0.667. Adding without subtracting the overlap would count the 2 twice."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Multiply for 'and' when events are independent, add for 'or' and subtract the overlap, and use the complement when 'at least one' is easier."
     }
    ]
   },
   {
    "id": "pb2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a checkout. A payment succeeds 97 percent of the time. For 5 payments in a row: P(all succeed) = 0.97⁵ = 0.859. P(at least one fails) = 0.141."
     },
     {
      "kind": "p",
      "text": "Example 2, a shortlist. 10 candidates, choose 3: there are 120 possible shortlists. If every shortlist is equally likely, a given candidate appears in 36 of them (choose 2 more from 9), so 36 ÷ 120 = 0.3."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Naive Bayes multiplies feature probabilities assuming independence. Counting arguments also bound how many hypotheses a model can distinguish."
     },
     {
      "kind": "check",
      "question": "Two independent events each have probability 0.5. What is the chance both happen?",
      "options": [
       "0.25",
       "0.5",
       "1"
      ],
      "answer": 0,
      "why": "For independent events the chance of both is the product: 0.5 × 0.5 = 0.25."
     }
    ]
   },
   {
    "id": "pb2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Multiplying when events are dependent",
      "text": "If the second train is late because of the first, the product rule undercounts."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Adding probabilities that overlap",
      "text": "Subtract P(A and B) or you double count."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Mixing up order and no order",
      "text": "Arrangements and selections give different counts."
     }
    ]
   },
   {
    "id": "pb2-python",
    "kicker": "7 · In Python",
    "title": "Counting in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Counting rules, independent events and overlaps",
      "code": "import itertools\nimport numpy as np\n\nprint(\"4-digit OTP codes:\", 10 ** 4, \"| 6-digit:\", 10 ** 6)\nprint(\"OTP guessed on one try (4 digits):\", 1 / 10 ** 4)\n\n# order matters: arrangements and selections\nprint(\"ways to line up 5 people:\", 5 * 4 * 3 * 2 * 1)\nprint(\"ways to choose 3 of 10 candidates for a shortlist (order ignored):\", len(list(itertools.combinations(range(10), 3))))\n\n# independent events multiply: three trains each late with probability 0.2\np_late = 0.2\np_all_on_time = (1 - p_late) ** 3\nprint(\"P(all three on time) =\", round(p_all_on_time, 3), \"| P(at least one late) =\", round(1 - p_all_on_time, 3))\n\n# mutually exclusive events add; overlapping events need the overlap removed\nrng = np.random.default_rng(1)\nroll = rng.integers(1, 7, 200_000)\np_a, p_b = (roll <= 2).mean(), (roll % 2 == 0).mean()\np_both = ((roll <= 2) & (roll % 2 == 0)).mean()\nprint(\"P(<=2) =\", round(float(p_a), 3), \" P(even) =\", round(float(p_b), 3), \" P(both) =\", round(float(p_both), 3))\nprint(\"P(<=2 or even) =\", round(float(((roll <= 2) | (roll % 2 == 0)).mean()), 3), \"= a + b - both =\", round(float(p_a + p_b - p_both), 3))",
      "output": "4-digit OTP codes: 10000 | 6-digit: 1000000\nOTP guessed on one try (4 digits): 0.0001\nways to line up 5 people: 120\nways to choose 3 of 10 candidates for a shortlist (order ignored): 120\nP(all three on time) = 0.512 | P(at least one late) = 0.488\nP(<=2) = 0.334  P(even) = 0.5  P(both) = 0.167\nP(<=2 or even) = 0.667 = a + b - both = 0.667"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Count outcomes first. Then 'and' multiplies, 'or' adds and removes the overlap."
     }
    ]
   }
  ]
 },
 {
  "title": "Conditional probability: what changes when you know something",
  "minutes": 14,
  "sections": [
   {
    "id": "pb3-observe",
    "kicker": "1 · Observe",
    "title": "Does a complaint predict churn?",
    "blocks": [
     {
      "kind": "p",
      "text": "A telecom has 1,000 customers. 200 complained last month and 180 customers left. Does a complaint tell us anything about who leaves? To answer it we narrow our view to the complainers and ask how many of them left. That is conditioning."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How does knowing one thing change the probability of another?"
     }
    ]
   },
   {
    "id": "pb3-express",
    "kicker": "2 · Express",
    "title": "Reading a table",
    "blocks": [
     {
      "kind": "table",
      "caption": "1,000 customers",
      "headers": [
       "",
       "Churned",
       "Stayed",
       "Total"
      ],
      "rows": [
       [
        "Complained",
        "120",
        "80",
        "200"
       ],
       [
        "Did not complain",
        "60",
        "740",
        "800"
       ],
       [
        "Total",
        "180",
        "820",
        "1,000"
       ]
      ]
     },
     {
      "kind": "eq",
      "lines": [
       "P(A | B) = P(A and B) ÷ P(B)",
       "P(A and B) = P(A | B) × P(B)"
      ],
      "note": "The bar | is read 'given'. Conditioning shrinks the world to the cases where B holds."
     }
    ]
   },
   {
    "id": "pb3-visualize",
    "kicker": "3 · Visualize",
    "title": "The numbers",
    "blocks": [
     {
      "kind": "p",
      "text": "P(churn) = 180 ÷ 1,000 = 0.18. P(churn | complained) = 120 ÷ 200 = 0.60. P(churn | no complaint) = 60 ÷ 800 = 0.075. A complaint makes churn 8 times as likely."
     },
     {
      "kind": "p",
      "text": "Reverse it: P(complained | churned) = 120 ÷ 180 = 0.667. This is not the same number as P(churn | complained) = 0.60. Confusing the two is one of the most common mistakes in reasoning about probability."
     }
    ]
   },
   {
    "id": "pb3-discover",
    "kicker": "4 · Discover",
    "title": "Independence",
    "blocks": [
     {
      "kind": "p",
      "text": "Events are independent when knowing one tells you nothing about the other: P(churn | complained) would equal P(churn). Here 0.60 is far from 0.18, so complaint and churn are not independent. The product rule checks out: 0.6 × 0.2 = 0.12 = P(churn and complained)."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "P(A | B) restricts attention to cases where B holds, and A and B are independent exactly when conditioning on B does not change A."
     }
    ]
   },
   {
    "id": "pb3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, two directions. P(churn | complained) = 0.60 asks how risky a complainer is. P(complained | churned) = 0.667 asks what share of leavers had complained. Different questions, different numbers."
     },
     {
      "kind": "p",
      "text": "Example 2, targeting. A retention team can call 200 people. Calling the 200 complainers reaches 120 future leavers, a 0.6 hit rate. Calling 200 random customers reaches about 36."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every classifier estimates P(class | features). The features are what we condition on."
     },
     {
      "kind": "check",
      "question": "Out of 50 customers who used a coupon, 10 churned. Overall churn is 18 percent. P(churn | coupon) is...",
      "options": [
       "0.18",
       "0.20",
       "0.10"
      ],
      "answer": 1,
      "why": "10 ÷ 50 = 0.20. The condition shrinks the group to coupon users."
     }
    ]
   },
   {
    "id": "pb3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Flipping the condition",
      "text": "P(A | B) and P(B | A) are different numbers."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading association as cause",
      "text": "Complaints predict churn. They may not cause it."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Conditioning on too few cases",
      "text": "P(churn | complaint) from 5 customers is not trustworthy."
     }
    ]
   },
   {
    "id": "pb3-python",
    "kicker": "7 · In Python",
    "title": "Conditioning in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "A two-way table, conditional probabilities and independence",
      "code": "import numpy as np\n\n# 1,000 customers: did they complain, did they churn\n#                 churned  stayed\ncomplained = np.array([120, 80])\nquiet = np.array([60, 740])\ntotal = complained.sum() + quiet.sum()\nprint(\"customers:\", total)\nprint(\"P(churn) =\", (complained[0] + quiet[0]) / total)\nprint(\"P(complain) =\", complained.sum() / total)\nprint(\"P(churn and complain) =\", complained[0] / total)\nprint(\"P(churn | complain) =\", round(complained[0] / complained.sum(), 3))\nprint(\"P(churn | no complaint) =\", round(quiet[0] / quiet.sum(), 3))\nprint(\"P(complain | churn) =\", round(complained[0] / (complained[0] + quiet[0]), 3), \"<- not the same as P(churn | complain)\")\n\n# independence would mean P(churn | complain) equals P(churn)\nprint(\"independent? P(churn | complain) vs P(churn):\", round(complained[0] / complained.sum(), 3), \"vs\", (complained[0] + quiet[0]) / total)\n\n# the product rule: P(A and B) = P(A | B) * P(B)\nprint(\"product rule:\", round(0.6 * complained.sum() / total, 3), \"==\", complained[0] / total)",
      "output": "customers: 1000\nP(churn) = 0.18\nP(complain) = 0.2\nP(churn and complain) = 0.12\nP(churn | complain) = 0.6\nP(churn | no complaint) = 0.075\nP(complain | churn) = 0.667 <- not the same as P(churn | complain)\nindependent? P(churn | complain) vs P(churn): 0.6 vs 0.18\nproduct rule: 0.12 == 0.12"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Conditional probability is a ratio inside the group you condition on."
     }
    ]
   }
  ]
 },
 {
  "title": "Bayes' rule and the trap of base rates",
  "minutes": 14,
  "sections": [
   {
    "id": "pb4-observe",
    "kicker": "1 · Observe",
    "title": "The fraud alert that is usually wrong",
    "blocks": [
     {
      "kind": "p",
      "text": "A bank's fraud detector catches 90 percent of fraud and wrongly flags 5 percent of genuine payments. Only 1 percent of transactions are fraud. A transaction is flagged. How likely is it fraud? Most people say about 90 percent. The real answer is about 15 percent."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we update a probability when we see evidence, and why does the base rate matter so much?"
     }
    ]
   },
   {
    "id": "pb4-express",
    "kicker": "2 · Express",
    "title": "Bayes' rule",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "P(fraud | flag) = P(flag | fraud) × P(fraud) ÷ P(flag)",
       "P(flag) = P(flag | fraud) P(fraud) + P(flag | genuine) P(genuine)"
      ],
      "note": "Prior × likelihood, then divide by the total chance of the evidence."
     },
     {
      "kind": "p",
      "text": "Here P(fraud) = 0.01, P(flag | fraud) = 0.90, P(flag | genuine) = 0.05. P(flag) = 0.009 + 0.0495 = 0.0585. So P(fraud | flag) = 0.009 ÷ 0.0585 = 0.154."
     }
    ]
   },
   {
    "id": "pb4-visualize",
    "kicker": "3 · Visualize",
    "title": "Counting it out",
    "blocks": [
     {
      "kind": "table",
      "caption": "100,000 transactions",
      "headers": [
       "Group",
       "Count",
       "Flagged"
      ],
      "rows": [
       [
        "Fraud",
        "1,000",
        "900"
       ],
       [
        "Genuine",
        "99,000",
        "4,950"
       ],
       [
        "All",
        "100,000",
        "5,850"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Of 5,850 flags, only 900 are fraud: 15.4 percent. A simulation of a million transactions gave 15.2 percent. The detector is good, but fraud is rare, so false alarms from the huge genuine pile outnumber real catches."
     }
    ]
   },
   {
    "id": "pb4-discover",
    "kicker": "4 · Discover",
    "title": "The base rate drives the answer",
    "blocks": [
     {
      "kind": "table",
      "caption": "Same detector, different base rates",
      "headers": [
       "Fraud base rate",
       "P(fraud | flagged)"
      ],
      "rows": [
       [
        "0.1%",
        "1.8%"
       ],
       [
        "1%",
        "15.4%"
       ],
       [
        "10%",
        "66.7%"
       ],
       [
        "50%",
        "94.7%"
       ]
      ]
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Bayes' rule turns a prior and a likelihood into a posterior, and a rare event stays unlikely even after a decent test."
     }
    ]
   },
   {
    "id": "pb4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, by hand. Prior 0.01, hit rate 0.9, false alarm 0.05: posterior = (0.01 × 0.9) ÷ (0.01 × 0.9 + 0.99 × 0.05) = 0.009 ÷ 0.0585 = 0.154."
     },
     {
      "kind": "p",
      "text": "Example 2, a better detector. Cutting the false-alarm rate from 5 percent to 1 percent changes P(flag) to 0.009 + 0.0099 = 0.0189, and the posterior to 0.009 ÷ 0.0189 = 0.476. Lowering false alarms helps more than raising the hit rate when fraud is rare."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Naive Bayes classifies with exactly this rule. Metrics such as precision are posteriors, and depend on the base rate in the data."
     },
     {
      "kind": "check",
      "question": "A test has the same hit and false-alarm rates in two cities. In city B the condition is 10 times more common. In which city is a positive more trustworthy?",
      "options": [
       "City A",
       "City B",
       "Same"
      ],
      "answer": 1,
      "why": "A higher base rate raises the posterior for the same test."
     }
    ]
   },
   {
    "id": "pb4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Ignoring the base rate",
      "text": "A 90 percent hit rate does not mean a 90 percent chance of fraud given a flag."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Using test-set base rates in production",
      "text": "If the test data had 50 percent fraud and production has 1 percent, precision will crash."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Treating the posterior as final",
      "text": "It is a new prior for the next piece of evidence."
     }
    ]
   },
   {
    "id": "pb4-python",
    "kicker": "7 · In Python",
    "title": "Bayes in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "The fraud alert, counted, computed and simulated",
      "code": "import numpy as np\n\np_fraud, hit, false_alarm = 0.01, 0.90, 0.05\np_flag = p_fraud * hit + (1 - p_fraud) * false_alarm\nposterior = p_fraud * hit / p_flag\nprint(\"P(flagged) =\", round(p_flag, 4))\nprint(\"P(fraud | flagged) =\", round(posterior, 4))\n\n# count it out: 100,000 transactions\nn = 100_000\nfraud = n * p_fraud\nprint(\"fraud:\", int(fraud), \"of which caught:\", int(fraud * hit))\nprint(\"genuine:\", int(n - fraud), \"of which wrongly flagged:\", int((n - fraud) * false_alarm))\nprint(\"flagged total:\", int(fraud * hit + (n - fraud) * false_alarm), \"-> genuine share of flags:\", round((n - fraud) * false_alarm / (fraud * hit + (n - fraud) * false_alarm), 3))\n\n# confirm by simulation\nrng = np.random.default_rng(3)\nis_fraud = rng.random(1_000_000) < p_fraud\nflag = np.where(is_fraud, rng.random(1_000_000) < hit, rng.random(1_000_000) < false_alarm)\nprint(\"simulated P(fraud | flagged) =\", round(float(is_fraud[flag].mean()), 3))\n\nfor base in (0.001, 0.01, 0.1, 0.5):\n    pf = base * hit + (1 - base) * false_alarm\n    print(\"base rate\", str(base).ljust(5), \"-> P(fraud | flagged) =\", round(base * hit / pf, 3))",
      "output": "P(flagged) = 0.0585\nP(fraud | flagged) = 0.1538\nfraud: 1000 of which caught: 900\ngenuine: 99000 of which wrongly flagged: 4950\nflagged total: 5850 -> genuine share of flags: 0.846\nsimulated P(fraud | flagged) = 0.152\nbase rate 0.001 -> P(fraud | flagged) = 0.018\nbase rate 0.01  -> P(fraud | flagged) = 0.154\nbase rate 0.1   -> P(fraud | flagged) = 0.667\nbase rate 0.5   -> P(fraud | flagged) = 0.947"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Always ask how common the thing is before believing a test result."
     }
    ]
   }
  ]
 },
 {
  "title": "Random variables and the shapes of uncertainty",
  "minutes": 14,
  "sections": [
   {
    "id": "pb5-observe",
    "kicker": "1 · Observe",
    "title": "A delivery takes... how long?",
    "blocks": [
     {
      "kind": "p",
      "text": "Delivery time is not one number. It is a quantity that varies from order to order, with some values more likely than others. A random variable is a number assigned to the outcome of an uncertain event, and its distribution lists how likely each value is."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we summarise a distribution with a mean and a spread, and which shapes appear again and again?"
     }
    ]
   },
   {
    "id": "pb5-express",
    "kicker": "2 · Express",
    "title": "Mean and variance",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "E[X] = Σ x · P(x)",
       "Var(X) = Σ (x − E[X])² · P(x),   sd = √Var"
      ],
      "note": "The expected value is the long-run average, not necessarily a value you will see on any single trial."
     }
    ]
   },
   {
    "id": "pb5-visualize",
    "kicker": "3 · Visualize",
    "title": "A delivery distribution",
    "blocks": [
     {
      "kind": "table",
      "caption": "Delivery time",
      "headers": [
       "Minutes",
       "20",
       "30",
       "40",
       "60"
      ],
      "rows": [
       [
        "Probability",
        "0.3",
        "0.4",
        "0.2",
        "0.1"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "E = 20 × 0.3 + 30 × 0.4 + 40 × 0.2 + 60 × 0.1 = 32 minutes. Variance = 136 and spread 11.66 minutes. The average of 32 is not a possible delivery time: the tail at 60 pulls it up."
     }
    ]
   },
   {
    "id": "pb5-discover",
    "kicker": "4 · Discover",
    "title": "Two shapes you will meet often",
    "blocks": [
     {
      "kind": "p",
      "text": "Binomial: count the successes in n independent tries. For 10 orders each on time with probability 0.9, P(exactly 9 on time) = 0.3874 and P(at least 8) = 0.9298. Its mean is np = 9 and its variance np(1 − p) = 0.9."
     },
     {
      "kind": "p",
      "text": "Normal (bell curve): sums of many small effects. About 68 percent of values lie within one spread of the mean, 95.45 percent within two and 99.73 percent within three, as a simulation of a million values confirms."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A distribution says how likely each value is, the mean is its balance point and the spread says how far values stray."
     }
    ]
   },
   {
    "id": "pb5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a promise. Deliveries average 35 minutes with a spread of 8. Promising 'within 51 minutes' is two spreads above the mean, about 97.7 percent on time under a normal model."
     },
     {
      "kind": "p",
      "text": "Example 2, a count. With 10 orders and p = 0.9, the chance all 10 are on time is 0.9¹⁰ = 0.3487. Even with 90 percent reliability, a perfect run is not the usual outcome."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Linear regression assumes normal errors. Logistic regression models a binomial outcome. Loss functions are expected values over a distribution."
     },
     {
      "kind": "check",
      "question": "Scores have mean 70 and spread 10, roughly normal. About what share score between 60 and 80?",
      "options": [
       "68 percent",
       "95 percent",
       "50 percent"
      ],
      "answer": 0,
      "why": "60 to 80 is within one spread of the mean, which holds about 68 percent."
     }
    ]
   },
   {
    "id": "pb5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Using the normal curve for skewed data",
      "text": "Waiting times and incomes are skewed. The 68-95-99.7 rule fails."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading the mean as typical",
      "text": "32 minutes never happens. Look at the whole distribution."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Assuming independence in a binomial",
      "text": "If orders share a rider, being late is correlated and the binomial understates risk."
     }
    ]
   },
   {
    "id": "pb5-python",
    "kicker": "7 · In Python",
    "title": "Distributions in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Mean, variance, binomial counts and the normal rule",
      "code": "import numpy as np\nfrom math import comb\n\n# a random variable: minutes a delivery takes\nminutes = np.array([20, 30, 40, 60])\nprob = np.array([0.3, 0.4, 0.2, 0.1])\nmean = (minutes * prob).sum()\nvar = ((minutes - mean) ** 2 * prob).sum()\nprint(\"expected minutes:\", mean, \"| variance:\", round(var, 2), \"| spread (sd):\", round(var ** 0.5, 2))\n\n# orders arriving on time: 10 orders, each on time with probability 0.9\nn, p = 10, 0.9\npmf = [comb(n, k) * p ** k * (1 - p) ** (n - k) for k in range(n + 1)]\nfor k in (10, 9, 8, 7):\n    print(\"P(exactly\", k, \"on time) =\", round(pmf[k], 4))\nprint(\"P(at least 8 on time) =\", round(sum(pmf[8:]), 4), \"| mean\", n * p, \"| variance\", round(n * p * (1 - p), 2))\n\n# a normal curve: about 68 / 95 / 99.7 percent within 1 / 2 / 3 spreads\nrng = np.random.default_rng(2)\nx = rng.normal(35, 8, 1_000_000)\nfor k in (1, 2, 3):\n    print(\"within\", k, \"sd:\", round(float(((x > 35 - 8 * k) & (x < 35 + 8 * k)).mean()), 4))",
      "output": "expected minutes: 32.0 | variance: 136.0 | spread (sd): 11.66\nP(exactly 10 on time) = 0.3487\nP(exactly 9 on time) = 0.3874\nP(exactly 8 on time) = 0.1937\nP(exactly 7 on time) = 0.0574\nP(at least 8 on time) = 0.9298 | mean 9.0 | variance 0.9\nwithin 1 sd: 0.6826\nwithin 2 sd: 0.9545\nwithin 3 sd: 0.9973"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Describe uncertainty with a shape, a centre and a spread."
     }
    ]
   }
  ]
 },
 {
  "title": "Probability inside machine learning",
  "minutes": 13,
  "sections": [
   {
    "id": "pb6-observe",
    "kicker": "1 · Observe",
    "title": "From scores to probabilities",
    "blocks": [
     {
      "kind": "p",
      "text": "A classifier produces raw scores. To use them as chances they have to be non-negative and add up to 1. The softmax function does that. Then we need a way to grade the chances, which is log loss, and a way to check them, which is calibration."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do models turn scores into probabilities, how are those probabilities graded, and when can we trust them?"
     }
    ]
   },
   {
    "id": "pb6-express",
    "kicker": "2 · Express",
    "title": "Softmax, log loss, calibration",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "softmax(zᵢ) = e^(zᵢ) ÷ Σ e^(zⱼ)",
       "log loss = −log(probability given to the true class)"
      ],
      "note": "A forecast is calibrated if the events it rates at 70 percent happen about 70 percent of the time."
     }
    ]
   },
   {
    "id": "pb6-visualize",
    "kicker": "3 · Visualize",
    "title": "Scores to chances to loss",
    "blocks": [
     {
      "kind": "p",
      "text": "Scores 2.0, 1.0 and 0.1 become probabilities 0.659, 0.242 and 0.099, which sum to 1."
     },
     {
      "kind": "table",
      "caption": "Log loss as a function of the probability on the true class",
      "headers": [
       "Probability on the truth",
       "Loss"
      ],
      "rows": [
       [
        "0.9",
        "0.105"
       ],
       [
        "0.6",
        "0.511"
       ],
       [
        "0.5",
        "0.693"
       ],
       [
        "0.1",
        "2.303"
       ],
       [
        "0.01",
        "4.605"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The loss is gentle when the model is right and brutal when it is confident and wrong. Giving the true class 1 percent costs 44 times as much as giving it 90 percent."
     }
    ]
   },
   {
    "id": "pb6-discover",
    "kicker": "4 · Discover",
    "title": "Checking calibration",
    "blocks": [
     {
      "kind": "p",
      "text": "A simulated forecaster whose stated chance is the true chance shows forecasts near 0.1 followed by events 12.8 percent of the time, near 0.3 by 30.8, near 0.5 by 50.6, near 0.7 by 70.6 and near 0.9 by 87.7. What was said matches what happened."
     },
     {
      "kind": "p",
      "text": "Naive Bayes in miniature: prior spam 0.3, prior ham 0.7. Two words with likelihood 0.6 and 0.5 under spam, and 0.1 and 0.4 under ham, give 0.09 for spam and 0.028 for ham, normalised to 0.763 and 0.237."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Models speak in probabilities, we grade them with log loss, and we trust them only if what they say is what happens."
     }
    ]
   },
   {
    "id": "pb6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a bad bet. A model gives the true class 0.1. The loss is −log(0.1) = 2.303. If it had said 0.5, the loss would be 0.693. Moving the probability on the truth from 0.1 to 0.5 saves 1.61."
     },
     {
      "kind": "p",
      "text": "Example 2, a check. Of 200 customers given churn probabilities near 0.7, only 90 left (45 percent). The model overstates risk, and a retention budget set from its probabilities would be too big."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Logistic regression, neural network classifiers, naive Bayes and gradient boosting all return scores that may need calibration."
     },
     {
      "kind": "check",
      "question": "Which prediction costs more log loss when the true class is 'yes'?",
      "options": [
       "P(yes) = 0.3",
       "P(yes) = 0.7",
       "They cost the same"
      ],
      "answer": 0,
      "why": "−log(0.3) = 1.20 is larger than −log(0.7) = 0.36. Less probability on the truth costs more."
     }
    ]
   },
   {
    "id": "pb6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Confusing a score with a probability",
      "text": "Raw scores from SVMs or forests are not chances until calibrated."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Judging only by accuracy",
      "text": "Accuracy ignores how confident the model was."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Calibrating on the training data",
      "text": "Check calibration on held-out data."
     }
    ]
   },
   {
    "id": "pb6-python",
    "kicker": "7 · In Python",
    "title": "Softmax, loss and calibration in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Turn scores into chances, grade them, check them",
      "code": "import numpy as np\n\ndef softmax(z):\n    e = np.exp(z - np.max(z))\n    return e / e.sum()\nscores = np.array([2.0, 1.0, 0.1])\np = softmax(scores)\nprint(\"scores:\", scores, \"-> probabilities:\", np.round(p, 3), \"sum\", round(float(p.sum()), 3))\n\n# log loss: a confident wrong answer is punished hard\ndef log_loss(p_true_class):\n    return -np.log(p_true_class)\nfor p_true in (0.9, 0.6, 0.5, 0.1, 0.01):\n    print(\"model gave the true class\", p_true, \"-> loss\", round(float(log_loss(p_true)), 3))\n\n# calibration: do 70 percent forecasts come true about 70 percent of the time?\nrng = np.random.default_rng(5)\nsaid = rng.uniform(0.05, 0.95, 20000)\nhappened = rng.random(20000) < said            # a perfectly calibrated forecaster\nfor lo in (0.1, 0.3, 0.5, 0.7, 0.9):\n    m = (said >= lo - 0.1) & (said < lo + 0.1)\n    print(\"forecast about\", lo, \"-> happened\", round(float(happened[m].mean()), 3))\n\n# naive Bayes in miniature: multiply likelihoods, then normalise\nprior = {\"spam\": 0.3, \"ham\": 0.7}\nlikelihood = {\"spam\": 0.6 * 0.5, \"ham\": 0.1 * 0.4}      # P(word1 | class) * P(word2 | class)\npost = {c: prior[c] * likelihood[c] for c in prior}\ntotal = sum(post.values())\nprint({c: round(v / total, 3) for c, v in post.items()})",
      "output": "scores: [2.  1.  0.1] -> probabilities: [0.659 0.242 0.099] sum 1.0\nmodel gave the true class 0.9 -> loss 0.105\nmodel gave the true class 0.6 -> loss 0.511\nmodel gave the true class 0.5 -> loss 0.693\nmodel gave the true class 0.1 -> loss 2.303\nmodel gave the true class 0.01 -> loss 4.605\nforecast about 0.1 -> happened 0.128\nforecast about 0.3 -> happened 0.308\nforecast about 0.5 -> happened 0.506\nforecast about 0.7 -> happened 0.706\nforecast about 0.9 -> happened 0.877\n{'spam': 0.763, 'ham': 0.237}"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Probabilities are promises about long-run frequency. Check that they are kept."
     }
    ]
   }
  ]
 }
];
