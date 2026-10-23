import type {DeepLesson} from "../../math/teaching/deep-read";
export const LINEAR_REGRESSION_DEEP:DeepLesson[]=[
 {
  "title": "Why draw a line through prices at all?",
  "minutes": 13,
  "sections": [
   {
    "id": "lr1-observe",
    "kicker": "1 · Observe",
    "title": "You are asked to price a flat nobody has sold yet",
    "blocks": [
     {
      "kind": "p",
      "text": "A buyer asks what a 75 sq m flat should cost. You have eight recent sales. The simplest answer ignores size: quote the average price. That is a fair opening move, and a weak one, because a 40 sq m flat and a 110 sq m flat do not sell for the same money."
     },
     {
      "kind": "p",
      "text": "Linear regression is the next simplest idea. Draw one straight line through the sales and read the price off it. Everything else in this module is about drawing that line well and knowing when to distrust it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How much better is a line than the average, and what does 'better' mean in rupees?"
     }
    ]
   },
   {
    "id": "lr1-express",
    "kicker": "2 · Express",
    "title": "A prediction is a rule from inputs to a number",
    "blocks": [
     {
      "kind": "p",
      "text": "The input (feature) is area in sq m. The output (target) is price in ₹ lakh. A model is a rule that turns the first into an estimate of the second. The baseline rule says 'always the average'. The line rule says 'price depends on area'."
     },
     {
      "kind": "eq",
      "lines": [
       "baseline: ŷ = average of y",
       "line: ŷ = w · x + b"
      ],
      "note": "ŷ (y-hat) is a prediction. w is the slope, b the intercept, and x the area."
     }
    ]
   },
   {
    "id": "lr1-visualize",
    "kicker": "3 · Visualize",
    "title": "Eight flats, two rules",
    "blocks": [
     {
      "kind": "p",
      "text": "Areas 40 to 110 sq m with prices ₹30 to ₹84 lakh."
     },
     {
      "kind": "table",
      "caption": "Two rules on the same eight flats",
      "headers": [
       "Rule",
       "Formula",
       "Average miss (MAE)"
      ],
      "rows": [
       [
        "Always the average",
        "₹53.6 lakh",
        "₹15.62 lakh"
       ],
       [
        "Fitted line",
        "0.806 × area − 6.82",
        "₹3.98 lakh"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Using area cuts the typical miss from about ₹15.6 lakh to ₹4.0 lakh, a 75 percent reduction. For a 75 sq m flat, the line says 0.806 × 75 − 6.82 = ₹53.6 lakh, which happens to equal the average, because 75 is the average area and a fitted line passes through the point of averages."
     }
    ]
   },
   {
    "id": "lr1-discover",
    "kicker": "4 · Discover",
    "title": "What 'fitted' means",
    "blocks": [
     {
      "kind": "p",
      "text": "Among all straight lines, we choose the one with the smallest average squared miss. The next lessons show how to write that line down, measure its misses, find it by repeated small steps, and extend it to many features."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Linear regression predicts a number as a weighted sum of inputs, and a fitted line beats a plain average whenever the input carries information about the target."
     }
    ]
   },
   {
    "id": "lr1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a small flat. 45 sq m: 0.806 × 45 − 6.82 = 29.5 lakh. The average rule would say 53.6, over 24 lakh too high."
     },
     {
      "kind": "p",
      "text": "Example 2, a big flat. 110 sq m: 0.806 × 110 − 6.82 = 81.8 lakh, against a recorded sale of 84. The line misses by 2.2 lakh, the average rule by 30.4 lakh."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Pricing, demand forecasts, sales estimates and any first model for a number. It is also the baseline every fancier model must beat."
     },
     {
      "kind": "check",
      "question": "The line and the average rule give the same answer for a 75 sq m flat. Why?",
      "options": [
       "It is a coincidence with no cause",
       "75 is the average area and the line passes through the point of averages",
       "Area does not matter"
      ],
      "answer": 1,
      "why": "A least-squares line always passes through (average x, average y). At the average x it must give the average y."
     }
    ]
   },
   {
    "id": "lr1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading a line as a law",
      "text": "Eight sales support a rough rule, not a guarantee about the next sale."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Forgetting units",
      "text": "0.806 is lakh per sq m. Say what a one-unit change in the input means."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Skipping the baseline",
      "text": "A model is only useful relative to the simpler rule it replaces."
     }
    ]
   },
   {
    "id": "lr1-python",
    "kicker": "7 · In Python",
    "title": "The line against the average",
    "blocks": [
     {
      "kind": "code",
      "caption": "Fit a line to eight sales and compare with the average",
      "code": "import numpy as np\n\narea = np.array([40, 50, 60, 70, 80, 90, 100, 110], float)\nprice = np.array([30, 34, 36, 52, 55, 58, 80, 84], float)           # lakh rupees\n\nguess_avg = np.full_like(price, price.mean())\nw, b = np.polyfit(area, price, 1)\nguess_line = w * area + b\nmae = lambda p: np.abs(price - p).mean()\nprint(\"average price:\", round(price.mean(), 1), \"lakh | MAE of always guessing it:\", round(mae(guess_avg), 2))\nprint(\"fitted line: price = %.3f x area + %.2f\" % (w, b), \"| MAE of the line:\", round(mae(guess_line), 2))\nprint(\"a 75 sq m flat -> line says\", round(w * 75 + b, 1), \"lakh\")",
      "output": "average price: 53.6 lakh | MAE of always guessing it: 15.62\nfitted line: price = 0.806 x area + -6.82 | MAE of the line: 3.98\na 75 sq m flat -> line says 53.6 lakh"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A fitted line cut the typical miss by three quarters. Always report it next to the baseline."
     }
    ]
   }
  ]
 },
 {
  "title": "From a rule of thumb to an equation",
  "minutes": 14,
  "sections": [
   {
    "id": "lr2-observe",
    "kicker": "1 · Observe",
    "title": "Say it in words first",
    "blocks": [
     {
      "kind": "p",
      "text": "An agent might say: 'each extra square metre adds about ₹80,000, and there is a small fixed adjustment'. That sentence is already a linear regression. The equation just gives its two ingredients names."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What do the slope and intercept mean in rupees, and how do we know one choice of them is better than another?"
     }
    ]
   },
   {
    "id": "lr2-express",
    "kicker": "2 · Express",
    "title": "The equation",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "ŷ = w · x + b"
      ],
      "note": "w is the weight on area: the change in predicted price per extra sq m. b is the bias or intercept: the prediction when x is 0."
     },
     {
      "kind": "p",
      "text": "Different (w, b) pairs draw different lines. To compare them we need one number that says how far a line is from the sales. The usual choice is the mean squared error (MSE): square each miss, then average."
     }
    ]
   },
   {
    "id": "lr2-visualize",
    "kicker": "3 · Visualize",
    "title": "Three candidate rules",
    "blocks": [
     {
      "kind": "p",
      "text": "Same eight flats as before. We try three rules and compute the mean squared error for each."
     },
     {
      "kind": "table",
      "caption": "Mean squared error for three rules",
      "headers": [
       "Rule",
       "MSE"
      ],
      "rows": [
       [
        "0.5 × area + 0",
        "330.1"
       ],
       [
        "0.8 × area − 8",
        "23.6"
       ],
       [
        "0.81 × area − 6.8",
        "21.1"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The first rule is badly off. The second is close. The third, the fitted line rounded to two decimals, is the best of the three. The best possible line, with unrounded numbers, has an MSE of 21.0."
     }
    ]
   },
   {
    "id": "lr2-discover",
    "kicker": "4 · Discover",
    "title": "Reading w and b",
    "blocks": [
     {
      "kind": "p",
      "text": "w = 0.806 lakh per sq m, which is ₹80,600 for each extra square metre. b = −6.82 lakh is the line's value at area 0, a place no real flat lives. The intercept is a bookkeeping number that makes the line sit at the right height, not a price anyone pays."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "The weight says how much the prediction moves per unit of input, and the bias lifts or lowers the whole line."
     }
    ]
   },
   {
    "id": "lr2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a prediction. For a 75 sq m flat: 0.806 × 75 + (−6.82) = 53.63 lakh."
     },
     {
      "kind": "p",
      "text": "Example 2, changing the rule. Raise w from 0.806 to 0.9 and keep b: a 100 sq m flat moves from 73.8 to 83.2 lakh. A change of 0.094 in w moves the prediction by 0.094 × 100 = 9.4 lakh, which is why w must be chosen carefully."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every linear model, from a rate card to a risk score, is a weights-and-bias equation."
     },
     {
      "kind": "check",
      "question": "w = 0.8 lakh per sq m. A flat is 10 sq m larger. How much does the prediction change?",
      "options": [
       "0.8 lakh",
       "8 lakh",
       "80 lakh"
      ],
      "answer": 1,
      "why": "The weight is the change per unit, so 10 units change the prediction by 10 × 0.8 = 8 lakh."
     }
    ]
   },
   {
    "id": "lr2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading the intercept as meaningful",
      "text": "A flat of zero area is outside the data. The intercept just anchors the line."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Comparing rules by eye",
      "text": "Two lines can look alike and differ a lot in MSE. Compute it."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Mixing units",
      "text": "If area is in sq ft instead of sq m, w changes by a factor of about 10.76."
     }
    ]
   },
   {
    "id": "lr2-python",
    "kicker": "7 · In Python",
    "title": "The equation in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Predict by hand and score three candidate rules",
      "code": "import numpy as np\n\narea = np.array([40, 50, 60, 70, 80, 90, 100, 110], float)\nprice = np.array([30, 34, 36, 52, 55, 58, 80, 84], float)\nw, b = np.polyfit(area, price, 1)\n\nx = 75\nprint(\"by hand: w * x + b =\", round(w, 4), \"*\", x, \"+\", round(b, 3), \"=\", round(w * x + b, 2))\nprint(\"each extra sq m adds\", round(w * 100, 1), \"thousand rupees (w =\", round(w, 3), \"lakh per sq m)\")\nprint(\"a flat of zero area is predicted at\", round(b, 2), \"lakh -> the intercept is a baseline, not a real flat\")\nfor guess_w, guess_b in [(0.5, 0), (0.8, -8), (round(w, 2), round(b, 1))]:\n    err = np.mean((price - (guess_w * area + guess_b)) ** 2)\n    print(\"rule\", guess_w, \"x area +\", guess_b, \"-> mean squared error\", round(err, 1))",
      "output": "by hand: w * x + b = 0.806 * 75 + -6.821 = 53.63\neach extra sq m adds 80.6 thousand rupees (w = 0.806 lakh per sq m)\na flat of zero area is predicted at -6.82 lakh -> the intercept is a baseline, not a real flat\nrule 0.5 x area + 0 -> mean squared error 330.1\nrule 0.8 x area + -8 -> mean squared error 23.6\nrule 0.81 x area + -6.8 -> mean squared error 21.1"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Pick w and b to make the squared misses small, and read them in rupees."
     }
    ]
   }
  ]
 },
 {
  "title": "Measuring how wrong we are",
  "minutes": 13,
  "sections": [
   {
    "id": "lr3-observe",
    "kicker": "1 · Observe",
    "title": "A miss is not just a number",
    "blocks": [
     {
      "kind": "p",
      "text": "Two models can both be 'wrong by about 3 lakh' and be wrong in very different ways. One misses every flat by a little. The other is nearly exact except for a flat that is off by 25. Which error measure you choose decides which model you prefer."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What do MAE, MSE and RMSE each reward and punish, and which one should you report?"
     }
    ]
   },
   {
    "id": "lr3-express",
    "kicker": "2 · Express",
    "title": "Residuals and three summaries",
    "blocks": [
     {
      "kind": "p",
      "text": "A residual is actual minus predicted. Summarise the residuals in one of three ways."
     },
     {
      "kind": "eq",
      "lines": [
       "residual = y − ŷ",
       "MAE = average of |residual|",
       "MSE = average of residual²",
       "RMSE = √MSE"
      ],
      "note": "MAE and RMSE are in the units of the target (lakh). MSE is in squared units."
     }
    ]
   },
   {
    "id": "lr3-visualize",
    "kicker": "3 · Visualize",
    "title": "Five flats, then a wild one",
    "blocks": [
     {
      "kind": "p",
      "text": "Actual prices 50, 60, 70, 80, 90 lakh against predictions 52, 57, 74, 78, 91. The residuals are −2, +3, −4, +2, −1."
     },
     {
      "kind": "table",
      "caption": "Error measures",
      "headers": [
       "Measure",
       "Five flats",
       "After adding one flat that sold 108 lakh above its prediction"
      ],
      "rows": [
       [
        "MAE",
        "2.40",
        "20.00"
       ],
       [
        "MSE",
        "6.80",
        "–"
       ],
       [
        "RMSE",
        "2.61",
        "44.16"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "One extra flat, six in all, lifts MAE from 2.4 to 20.0, and RMSE from 2.61 to 44.16. That single flat produces 99.7 percent of the total squared error, so MSE and RMSE are dominated by it."
     }
    ]
   },
   {
    "id": "lr3-discover",
    "kicker": "4 · Discover",
    "title": "Choose the measure to match the cost",
    "blocks": [
     {
      "kind": "p",
      "text": "If a miss of 20 is twice as bad as a miss of 10, MAE matches your costs. If a miss of 20 is much worse than twice a miss of 10, for example a mispriced flat that loses a deal, squared error matches better. State which you use, and report the measure you trained on and the one the business cares about."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "MAE treats all misses alike, MSE and RMSE punish large misses disproportionately, and the right one follows from what a big miss costs."
     }
    ]
   },
   {
    "id": "lr3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, by hand. Residuals −2, 3, −4, 2, −1. Absolute: 2, 3, 4, 2, 1, total 12, MAE = 12 ÷ 5 = 2.4. Squares: 4, 9, 16, 4, 1 = 34, MSE = 6.8, RMSE = √6.8 = 2.61."
     },
     {
      "kind": "p",
      "text": "Example 2, the wild flat. Residual 108: its square is 11,664, against 34 for the other five together. Check whether it is a data error before you let it steer the fit."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Choosing a loss for forecasting, pricing and any regression where a few large misses matter more than many small ones."
     },
     {
      "kind": "check",
      "question": "Which measure grows most when one prediction is far off?",
      "options": [
       "MAE",
       "RMSE",
       "They grow equally"
      ],
      "answer": 1,
      "why": "Squaring makes a large residual count far more, so RMSE and MSE react more than MAE."
     }
    ]
   },
   {
    "id": "lr3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reporting MSE to a business reader",
      "text": "Squared lakh is hard to read. Report MAE or RMSE in lakh."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Letting one bad row steer",
      "text": "Look at the largest residuals before trusting the average."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Scoring on training rows only",
      "text": "Judge errors on rows the line was not fitted on."
     }
    ]
   },
   {
    "id": "lr3-python",
    "kicker": "7 · In Python",
    "title": "MAE, MSE and RMSE in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Residuals, three error measures and one wild flat",
      "code": "import numpy as np\n\ny = np.array([50.0, 60.0, 70.0, 80.0, 90.0])\npred = np.array([52.0, 57.0, 74.0, 78.0, 91.0])\nres = y - pred\nprint(\"residuals y - prediction:\", res)\nprint(\"MAE  =\", np.abs(res).mean())\nprint(\"MSE  =\", (res ** 2).mean())\nprint(\"RMSE =\", round(float(np.sqrt((res ** 2).mean())), 3))\n\n# one wild sale\ny2, pred2 = np.append(y, 200.0), np.append(pred, 92.0)\nres2 = y2 - pred2\nprint(\"after adding one flat that sold 108 lakh above the prediction:\")\nprint(\"MAE  =\", round(float(np.abs(res2).mean()), 2), \"| RMSE =\", round(float(np.sqrt((res2 ** 2).mean())), 2))\nprint(\"share of squared error from that single flat:\", round(float(res2[-1] ** 2 / (res2 ** 2).sum()), 3))",
      "output": "residuals y - prediction: [-2.  3. -4.  2. -1.]\nMAE  = 2.4\nMSE  = 6.8\nRMSE = 2.608\nafter adding one flat that sold 108 lakh above the prediction:\nMAE  = 20.0 | RMSE = 44.16\nshare of squared error from that single flat: 0.997"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "One extreme flat can account for nearly all of the squared error."
     }
    ]
   }
  ]
 },
 {
  "title": "Finding the line by walking downhill",
  "minutes": 14,
  "sections": [
   {
    "id": "lr4-observe",
    "kicker": "1 · Observe",
    "title": "Guess, check, nudge",
    "blocks": [
     {
      "kind": "p",
      "text": "We could solve for the best line with algebra. Most models in this course cannot be solved that way, so we use a method that works everywhere: start with a guess, see which direction lowers the error, step that way, and repeat. This is gradient descent."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How big should each step be, and how do we know the walk has reached the bottom?"
     }
    ]
   },
   {
    "id": "lr4-express",
    "kicker": "2 · Express",
    "title": "The update",
    "blocks": [
     {
      "kind": "p",
      "text": "For the mean squared error, the slope of the error with respect to each parameter is the average of (prediction − actual) times the input, and for the bias, the average of (prediction − actual). Move each parameter against its slope, scaled by the learning rate η."
     },
     {
      "kind": "eq",
      "lines": [
       "w ← w − η · mean[(ŷ − y) · x]",
       "b ← b − η · mean[ŷ − y]"
      ],
      "note": "Standardising x first (mean 0, spread 1) lets one learning rate work for both parameters."
     }
    ]
   },
   {
    "id": "lr4-visualize",
    "kicker": "3 · Visualize",
    "title": "Five learning rates",
    "blocks": [
     {
      "kind": "p",
      "text": "Same eight flats, area standardised, starting from w = 0 and b = 0. The best possible MSE is 21.0."
     },
     {
      "kind": "table",
      "caption": "Mean squared error by learning rate",
      "headers": [
       "Learning rate η",
       "After 10 steps",
       "After 200 steps"
      ],
      "rows": [
       [
        "0.01",
        "2705.3",
        "79.9"
       ],
       [
        "0.1",
        "503.8",
        "21.0"
       ],
       [
        "0.5",
        "21.0",
        "21.0"
       ],
       [
        "1.0",
        "21.0",
        "21.0"
       ],
       [
        "2.1",
        "17905.3",
        "diverged"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A tiny rate is safe but slow: after 200 steps it has not arrived. Rates of 0.5 and 1.0 arrive in about ten steps. At 2.1 each step overshoots the valley by more than it gained, and the error explodes."
     }
    ]
   },
   {
    "id": "lr4-discover",
    "kicker": "4 · Discover",
    "title": "It lands where the algebra does",
    "blocks": [
     {
      "kind": "p",
      "text": "With η = 0.5 the walk ends at 0.806 × area − 6.82, the same line as the exact solution, after converting from standardised back to raw units. Gradient descent is not a different model. It is a different way to find the same one."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Gradient descent repeatedly steps against the slope of the error, and the learning rate decides whether it crawls, arrives or blows up."
     }
    ]
   },
   {
    "id": "lr4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a step. At w = 0, b = 0 with standardised x, the average of (ŷ − y) is −53.6, the negative of the average price. With η = 0.5 the bias jumps from 0 to 26.8 in one step."
     },
     {
      "kind": "p",
      "text": "Example 2, a stop rule. Stop when the error barely changes, for example by less than 0.001 between steps, or after a fixed budget. Plot the error against the step number: it should fall smoothly."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Training every model whose answer cannot be written in closed form, including logistic regression and neural networks."
     },
     {
      "kind": "check",
      "question": "The error rises every step. What is the most likely cause?",
      "options": [
       "The learning rate is too small",
       "The learning rate is too large",
       "The data is perfect"
      ],
      "answer": 1,
      "why": "An error that grows means each step overshoots the minimum. Reduce the learning rate."
     }
    ]
   },
   {
    "id": "lr4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Unscaled inputs",
      "text": "One learning rate cannot suit a column in tens of thousands and one in single digits."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Declaring convergence too early",
      "text": "A slow rate looks flat before it reaches the bottom."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Believing it finds a global optimum on every model",
      "text": "For squared error on a line it does. For deep networks it may not."
     }
    ]
   },
   {
    "id": "lr4-python",
    "kicker": "7 · In Python",
    "title": "Gradient descent in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Five learning rates, and the line gradient descent finds",
      "code": "import numpy as np\n\narea = np.array([40, 50, 60, 70, 80, 90, 100, 110], float)\nprice = np.array([30, 34, 36, 52, 55, 58, 80, 84], float)\nw_exact, b_exact = np.polyfit(area, price, 1)\n\nx = (area - area.mean()) / area.std()           # standardise so one learning rate suits both\ndef run(lr, steps=200):\n    w = b = 0.0\n    hist = []\n    for s in range(steps):\n        err = (w * x + b) - price\n        w -= lr * (err * x).mean()\n        b -= lr * err.mean()\n        hist.append(float((err ** 2).mean()))\n    return w, b, hist\nfor lr in [0.01, 0.1, 0.5, 1.0, 2.1]:\n    w, b, h = run(lr)\n    print(\"lr\", str(lr).ljust(4), \"| loss after 10 steps\", round(h[9], 1), \"| after 200 steps\", \"diverged\" if h[-1] > 1e6 else round(h[-1], 1))\nw, b, h = run(0.5)\nslope = w / area.std()\nintercept = b - w * area.mean() / area.std()\nprint(\"gradient descent line: %.3f x area + %.2f\" % (slope, intercept), \"| exact: %.3f x area + %.2f\" % (w_exact, b_exact))",
      "output": "lr 0.01 | loss after 10 steps 2705.3 | after 200 steps 79.9\nlr 0.1  | loss after 10 steps 503.8 | after 200 steps 21.0\nlr 0.5  | loss after 10 steps 21.0 | after 200 steps 21.0\nlr 1.0  | loss after 10 steps 21.0 | after 200 steps 21.0\nlr 2.1  | loss after 10 steps 17905.3 | after 200 steps diverged\ngradient descent line: 0.806 x area + -6.82 | exact: 0.806 x area + -6.82"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Plot the error curve. Its shape tells you whether the learning rate is right."
     }
    ]
   }
  ]
 },
 {
  "title": "Many features, one weighted sum",
  "minutes": 14,
  "sections": [
   {
    "id": "lr5-observe",
    "kicker": "1 · Observe",
    "title": "Price depends on more than area",
    "blocks": [
     {
      "kind": "p",
      "text": "Age of the building and a metro-adjacent location also matter. Instead of one weight, give each feature its own weight and add up the contributions. The idea is the same, only the bookkeeping gets longer."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we write and solve a regression with several features, and how do we compare their importance?"
     }
    ]
   },
   {
    "id": "lr5-express",
    "kicker": "2 · Express",
    "title": "Vectors and matrices",
    "blocks": [
     {
      "kind": "p",
      "text": "Stack the features of one flat into a vector x and the weights into a vector w. The prediction is their dot product plus the bias. For all flats at once, stack the rows into a matrix X, and prediction is X times w."
     },
     {
      "kind": "eq",
      "lines": [
       "ŷ = w₁x₁ + w₂x₂ + … + b",
       "ŷ = X w   (with a column of ones for b)",
       "best w solves (XᵀX) w = Xᵀy"
      ],
      "note": "The last line is the normal equation, which gives the exact least-squares weights."
     }
    ]
   },
   {
    "id": "lr5-visualize",
    "kicker": "3 · Visualize",
    "title": "Recovering known weights",
    "blocks": [
     {
      "kind": "p",
      "text": "200 simulated flats: price = 0.55 × area − 0.6 × age + 12 × metro + 5 + noise. We then ask the normal equation to recover the weights."
     },
     {
      "kind": "table",
      "caption": "Weights recovered",
      "headers": [
       "Term",
       "True",
       "Recovered"
      ],
      "rows": [
       [
        "Bias",
        "5",
        "5.42"
       ],
       [
        "Area (per sq m)",
        "0.55",
        "0.549"
       ],
       [
        "Age (per year)",
        "−0.60",
        "−0.585"
       ],
       [
        "Metro (0 or 1)",
        "12",
        "11.689"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The recovered weights are close to the truth, and R² is 0.962. Compare features in standardised units: area 11.8, age −5.05, metro 5.82 lakh per standard deviation. Area matters most per typical change, even though metro has the largest raw weight."
     }
    ]
   },
   {
    "id": "lr5-discover",
    "kicker": "4 · Discover",
    "title": "When two features say the same thing",
    "blocks": [
     {
      "kind": "p",
      "text": "Add a feature that is almost a copy of area. The model can split the credit between the two in many ways. Refits on resampled data gave weights on (area, twin) of (1.19, −0.62), (1.38, −0.83) and (1.53, −0.99). Each weight swings, but their sum stays near 0.55, the true effect of area."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Each weight is the effect of its feature with the others held fixed, which becomes unreliable when two features move together."
     }
    ]
   },
   {
    "id": "lr5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a prediction. 80 sq m, 10 years old, metro: 5.42 + 0.549 × 80 − 0.585 × 10 + 11.689 × 1 = 5.42 + 43.92 − 5.85 + 11.69 = 55.18 lakh."
     },
     {
      "kind": "p",
      "text": "Example 2, a swap. Make the same flat non-metro: the prediction falls by 11.69 to 43.49. That is what 'holding the others fixed' means."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "House pricing, wage models and any risk score built as a sum of contributions."
     },
     {
      "kind": "check",
      "question": "Two features are near-copies. What should you trust?",
      "options": [
       "Each individual weight",
       "The combined effect of the pair",
       "Neither feature matters"
      ],
      "answer": 1,
      "why": "The pair's total effect is stable even when individual weights swing between fits."
     }
    ]
   },
   {
    "id": "lr5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Comparing raw weights across units",
      "text": "A weight on a 0 to 1 column is not comparable to one on a 0 to 1,000 column. Standardise first."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading a weight as a cause",
      "text": "It describes the data, not what would happen if you changed the feature."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Redundant features",
      "text": "Drop one, combine them or use a penalty (ridge)."
     }
    ]
   },
   {
    "id": "lr5-python",
    "kicker": "7 · In Python",
    "title": "Matrix regression in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "The normal equation, standardised weights and twin columns",
      "code": "import numpy as np\n\nrng = np.random.default_rng(3)\nn = 200\narea = rng.uniform(40, 120, n)\nage = rng.uniform(0, 30, n)\nmetro = rng.integers(0, 2, n)\nprice = 0.55 * area - 0.6 * age + 12 * metro + 5 + rng.normal(0, 3, n)\n\nX = np.column_stack([np.ones(n), area, age, metro])\nw = np.linalg.solve(X.T @ X, X.T @ price)              # the normal equation\nprint(\"weights [bias, area, age, metro]:\", np.round(w, 3))\nprint(\"true      [bias, area, age, metro]: [5, 0.55, -0.6, 12]\")\npred = X @ w\nprint(\"R2 =\", round(1 - ((price - pred) ** 2).sum() / ((price - price.mean()) ** 2).sum(), 3))\n\n# which feature matters most? compare in standardised units\nZ = (X[:, 1:] - X[:, 1:].mean(0)) / X[:, 1:].std(0)\nwz = np.linalg.lstsq(np.column_stack([np.ones(n), Z]), price, rcond=None)[0]\nprint(\"standardised weights [area, age, metro]:\", np.round(wz[1:], 2))\n\n# a twin of area makes individual weights unstable\ntwin = area + rng.normal(0, 0.5, n)\nX2 = np.column_stack([np.ones(n), area, twin, age, metro])\nfor seed in range(3):\n    idx = np.random.default_rng(seed).integers(0, n, n)\n    w2 = np.linalg.lstsq(X2[idx], price[idx], rcond=None)[0]\n    print(\"bootstrap\", seed, \"weights on [area, twin of area]:\", np.round(w2[1:3], 2), \"sum\", round(float(w2[1] + w2[2]), 2))",
      "output": "weights [bias, area, age, metro]: [ 5.42   0.549 -0.585 11.689]\ntrue      [bias, area, age, metro]: [5, 0.55, -0.6, 12]\nR2 = 0.962\nstandardised weights [area, age, metro]: [11.8  -5.05  5.82]\nbootstrap 0 weights on [area, twin of area]: [ 1.19 -0.62] sum 0.57\nbootstrap 1 weights on [area, twin of area]: [ 1.38 -0.83] sum 0.55\nbootstrap 2 weights on [area, twin of area]: [ 1.53 -0.99] sum 0.54"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Check how stable weights are before telling a story about any one of them."
     }
    ]
   }
  ]
 },
 {
  "title": "Writing the algorithm yourself",
  "minutes": 13,
  "sections": [
   {
    "id": "lr6-observe",
    "kicker": "1 · Observe",
    "title": "Open the box",
    "blocks": [
     {
      "kind": "p",
      "text": "Libraries hide the loop. Writing it out once shows exactly what a model is: a few numbers and a rule for updating them. We write a small class, then check it against scikit-learn."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What is the smallest honest implementation of linear regression, and how do we know it is correct?"
     }
    ]
   },
   {
    "id": "lr6-express",
    "kicker": "2 · Express",
    "title": "Three steps repeated",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Standardise the features using the training mean and spread.",
       "Predict with the current weights, compute the errors.",
       "Update the weights and the bias against the average gradient, and repeat."
      ]
     },
     {
      "kind": "eq",
      "lines": [
       "fit: learn mean, spread, w, b",
       "predict: standardise with the stored mean and spread, then apply w and b"
      ],
      "note": "The same stored mean and spread must be reused on every new row."
     }
    ]
   },
   {
    "id": "lr6-visualize",
    "kicker": "3 · Visualize",
    "title": "Mine against scikit-learn",
    "blocks": [
     {
      "kind": "p",
      "text": "150 simulated flats with area and age. A 25-line class trained by gradient descent, and `LinearRegression` from scikit-learn."
     },
     {
      "kind": "table",
      "caption": "Predictions on two new flats",
      "headers": [
       "Flat",
       "Mine",
       "scikit-learn"
      ],
      "rows": [
       [
        "75 sq m, 10 years",
        "40.045",
        "40.045"
       ],
       [
        "110 sq m, 2 years",
        "62.828",
        "62.828"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "They agree to three decimals, and on every training row they agree to nine. When your own code matches a trusted library, you can trust both."
     }
    ]
   },
   {
    "id": "lr6-discover",
    "kicker": "4 · Discover",
    "title": "Why the check matters",
    "blocks": [
     {
      "kind": "p",
      "text": "Writing a model from scratch invites mistakes: a missed minus sign, a scaler fitted on test rows. Always compare against a reference on a small problem before using your code for anything else."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A model is stored numbers plus a rule, and a small reference check is the cheapest way to prove an implementation correct."
     }
    ]
   },
   {
    "id": "lr6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, storage. The fitted class stores four things: the mean and spread of each feature, the weights, and the bias. Everything needed to predict tomorrow is in those numbers."
     },
     {
      "kind": "p",
      "text": "Example 2, a bug caught. If predict forgot to standardise, mine would return different numbers from scikit-learn immediately. The reference check catches this in one line."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Any production model: the same storage idea, with the stored numbers saved to a file and reloaded for scoring."
     },
     {
      "kind": "check",
      "question": "Why must predict use the training mean and spread, not the new data's?",
      "options": [
       "It is faster",
       "A new row must be scaled exactly as the training rows were",
       "It does not matter"
      ],
      "answer": 1,
      "why": "The weights were learned for features on the training scale. Different scaling gives meaningless predictions."
     }
    ]
   },
   {
    "id": "lr6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Fitting the scaler on test data",
      "text": "That leaks test information into the model."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Forgetting the bias",
      "text": "Without it the line must pass through the origin."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Trusting your code without a reference",
      "text": "A plausible-looking number can still be wrong."
     }
    ]
   },
   {
    "id": "lr6-python",
    "kicker": "7 · In Python",
    "title": "A class, checked",
    "blocks": [
     {
      "kind": "code",
      "caption": "Linear regression by gradient descent against scikit-learn",
      "code": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\n\nclass SimpleLinear:\n    \"\"\"Linear regression by gradient descent, written out in full.\"\"\"\n    def __init__(self, lr=0.1, steps=2000):\n        self.lr, self.steps = lr, steps\n    def fit(self, X, y):\n        self.mu, self.sd = X.mean(0), X.std(0)\n        Z = (X - self.mu) / self.sd\n        self.w, self.b = np.zeros(Z.shape[1]), 0.0\n        for _ in range(self.steps):\n            err = Z @ self.w + self.b - y\n            self.w -= self.lr * (Z.T @ err) / len(y)\n            self.b -= self.lr * err.mean()\n        return self\n    def predict(self, X):\n        return ((X - self.mu) / self.sd) @ self.w + self.b\n\nrng = np.random.default_rng(7)\nX = np.column_stack([rng.uniform(40, 120, 150), rng.uniform(0, 30, 150)])\ny = 0.55 * X[:, 0] - 0.6 * X[:, 1] + 5 + rng.normal(0, 3, 150)\nmine = SimpleLinear().fit(X, y)\nref = LinearRegression().fit(X, y)\nnew = np.array([[75.0, 10.0], [110.0, 2.0]])\nprint(\"mine    :\", np.round(mine.predict(new), 3))\nprint(\"sklearn :\", np.round(ref.predict(new), 3))\nprint(\"predictions agree to 9 decimal places on every training row:\", bool(np.abs(mine.predict(X) - ref.predict(X)).max() < 1e-9))",
      "output": "mine    : [40.045 62.828]\nsklearn : [40.045 62.828]\npredictions agree to 9 decimal places on every training row: True"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "If your implementation agrees with a library, you understand the model. If not, you found a bug."
     }
    ]
   }
  ]
 },
 {
  "title": "When a straight line is the wrong tool",
  "minutes": 14,
  "sections": [
   {
    "id": "lr7-observe",
    "kicker": "1 · Observe",
    "title": "Every model has a place where it fails",
    "blocks": [
     {
      "kind": "p",
      "text": "A line is simple, fast and often good enough. It is also easy to misuse. Knowing the ways it breaks lets you spot trouble in the residuals before anyone relies on the predictions."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What patterns in the data or the residuals tell you a line is wrong?"
     }
    ]
   },
   {
    "id": "lr7-express",
    "kicker": "2 · Express",
    "title": "Look at what is left over",
    "blocks": [
     {
      "kind": "p",
      "text": "If a line captures the pattern, the residuals look like noise: no trend, similar spread everywhere. Curves in the residuals, one point steering the line, or a spread that changes with x are all signs of trouble."
     },
     {
      "kind": "eq",
      "lines": [
       "good fit ⇒ residuals show no pattern against x or ŷ"
      ],
      "note": "Plot the residuals. A good R² does not replace this."
     }
    ]
   },
   {
    "id": "lr7-visualize",
    "kicker": "3 · Visualize",
    "title": "Three failures, measured",
    "blocks": [
     {
      "kind": "table",
      "caption": "What went wrong in each simulation",
      "headers": [
       "Problem",
       "What we saw"
      ],
      "rows": [
       [
        "Curved data fitted by a line",
        "R² only 0.186; mean residual +2.30 at low x, −1.91 in the middle, +1.26 at high x"
       ],
       [
        "One extreme point at x = 30",
        "Slope 2.01 without it, 0.89 with it"
       ],
       [
        "Spread grows with x",
        "Error spread 0.57 for x < 3 and 2.90 for x > 7"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The curved data gives residuals that are positive, negative, then positive: a clear U shape. A single point far from the others dragged the slope from 2.01 to 0.89. And the line is right on average where errors grow with x, but far less reliable for large x."
     }
    ]
   },
   {
    "id": "lr7-discover",
    "kicker": "4 · Discover",
    "title": "What to do",
    "blocks": [
     {
      "kind": "p",
      "text": "For a curve, add a polynomial term or transform the feature. For an influential point, check it for a data error, then compare the fit with and without it. For changing spread, report error ranges that depend on x, or transform the target. Never extrapolate far beyond the data."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A line is right when the residuals look like noise. Patterns in the residuals are the model telling you what it missed."
     }
    ]
   },
   {
    "id": "lr7-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a U shape. Flats under 50 sq m and over 100 sq m are all under-priced by the line, and the middle ones over-priced. Add area squared, or fit separate lines."
     },
     {
      "kind": "p",
      "text": "Example 2, a lone penthouse. One sale at 400 sq m with an odd price pulls the slope for everyone. If it is a different kind of property, set it aside and say so."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Any first-pass regression, as a quick check of whether more flexible models are needed."
     },
     {
      "kind": "check",
      "question": "Residuals are positive at low x, negative in the middle and positive at high x. What does it suggest?",
      "options": [
       "A perfect fit",
       "A curve that the line does not capture",
       "Too many rows"
      ],
      "answer": 1,
      "why": "A systematic pattern in the residuals means the straight line is missing a curve."
     }
    ]
   },
   {
    "id": "lr7-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Trusting R² alone",
      "text": "R² can look decent while the residuals show a clear pattern."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Removing inconvenient points",
      "text": "Remove a point only with a reason, and report that you did."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Extrapolating",
      "text": "A line continues forever. Real prices do not."
     }
    ]
   },
   {
    "id": "lr7-python",
    "kicker": "7 · In Python",
    "title": "Three failures in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Curve, leverage and changing spread",
      "code": "import numpy as np\nfrom sklearn.linear_model import LinearRegression\n\nrng = np.random.default_rng(4)\nx = np.sort(rng.uniform(0, 10, 80))\n\n# 1. a curve fitted by a line\ny_curve = 2 + 0.3 * (x - 5) ** 2 + rng.normal(0, 0.5, 80)\nm = LinearRegression().fit(x.reshape(-1, 1), y_curve)\nres = y_curve - m.predict(x.reshape(-1, 1))\nprint(\"curved data: R2\", round(m.score(x.reshape(-1, 1), y_curve), 3), \"| mean residual, x<2.5 / middle / x>7.5:\",\n      round(res[x < 2.5].mean(), 2), round(res[(x > 3.5) & (x < 6.5)].mean(), 2), round(res[x > 7.5].mean(), 2))\n\n# 2. one extreme point with high leverage\ny_line = 1 + 2 * x + rng.normal(0, 1, 80)\nclean = LinearRegression().fit(x.reshape(-1, 1), y_line).coef_[0]\nxo, yo = np.append(x, 30.0), np.append(y_line, 5.0)         # a far-away point that breaks the trend\ndirty = LinearRegression().fit(xo.reshape(-1, 1), yo).coef_[0]\nprint(\"slope without the extreme point:\", round(float(clean), 2), \"| with it:\", round(float(dirty), 2))\n\n# 3. spread grows with x: the line is right on average, but the error is not constant\ny_het = 1 + 2 * x + rng.normal(0, 0.3 * x + 0.1)\nmh = LinearRegression().fit(x.reshape(-1, 1), y_het)\nrh = y_het - mh.predict(x.reshape(-1, 1))\nprint(\"spread of errors for x<3 vs x>7:\", round(float(rh[x < 3].std()), 2), round(float(rh[x > 7].std()), 2))",
      "output": "curved data: R2 0.186 | mean residual, x<2.5 / middle / x>7.5: 2.3 -1.91 1.26\nslope without the extreme point: 2.01 | with it: 0.89\nspread of errors for x<3 vs x>7: 0.57 2.9"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Always look at the residuals. They show what the line cannot."
     }
    ]
   }
  ]
 }
];
