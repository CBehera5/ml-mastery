import type {DeepLesson} from "../../math/teaching/deep-read";
export const ESSENTIALS_DEEP:DeepLesson[]=[
 {
  "title": "Values, names and the units you forgot",
  "minutes": 12,
  "sections": [
   {
    "id": "pe1-observe",
    "kicker": "1 · Observe",
    "title": "A listing quotes square feet; your model wants square metres",
    "blocks": [
     {
      "kind": "p",
      "text": "A flat is advertised at 1,075 sq ft for ₹62.5 lakh. Your model was trained on square metres. If you feed it the raw number, it will happily produce a nonsense price, because Python does not know what the numbers mean. The first skill is knowing what each value is, what it is called, and what it measures."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What kinds of values does Python hold, how do names point at them, and how do units go wrong silently?"
     }
    ]
   },
   {
    "id": "pe1-express",
    "kicker": "2 · Express",
    "title": "Types, names and operators",
    "blocks": [
     {
      "kind": "p",
      "text": "Every value has a type: int for whole numbers, float for decimals, str for text, bool for True or False. A name such as price points at a value, and rebinding the name does not change the old value. Operators combine values, and the type of the result depends on the operator."
     },
     {
      "kind": "eq",
      "lines": [
       "name = value        (binding)",
       "/ true division,  // floor division,  % remainder,  ** power",
       "float arithmetic is approximate"
      ],
      "note": "7 / 2 is 3.5, 7 // 2 is 3 and 7 % 2 is 1."
     }
    ]
   },
   {
    "id": "pe1-visualize",
    "kicker": "3 · Visualize",
    "title": "What the listing gives",
    "blocks": [
     {
      "kind": "table",
      "caption": "The same flat in two units",
      "headers": [
       "Quantity",
       "Value"
      ],
      "rows": [
       [
        "Area, quoted",
        "1,075 sq ft"
       ],
       [
        "Area in sq m (× 0.092903)",
        "99.87"
       ],
       [
        "Price per sq ft",
        "₹5,814"
       ],
       [
        "Price per sq ft if divided by sq m by mistake",
        "₹62,581"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The last row is the silent bug: dividing by the wrong unit gives a number ten times too big, and nothing crashes."
     }
    ]
   },
   {
    "id": "pe1-discover",
    "kicker": "4 · Discover",
    "title": "Floats and names",
    "blocks": [
     {
      "kind": "p",
      "text": "0.1 + 0.2 == 0.3 is False, because floats store binary approximations. Compare floats with a tolerance. And after backup = price, followed by price = price * 1.05, backup still holds 62.5 while price is 65.625: assignment points a name at a value, it does not link two names."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Every value has a type and a unit, names are labels, and Python will not warn you when the unit is wrong."
     }
    ]
   },
   {
    "id": "pe1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, unit conversion. 1,075 × 0.092903 = 99.87 sq m. Keep the unit in the name: area_sqm, not area."
     },
     {
      "kind": "p",
      "text": "Example 2, integer division. Splitting 7 flats between 2 agents: 7 // 2 = 3 each and 7 % 2 = 1 left over."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Feature columns with mixed units, or integer division where a float was expected, are among the commonest data bugs."
     },
     {
      "kind": "check",
      "question": "What does 9 // 2 give?",
      "options": [
       "4.5",
       "4",
       "5"
      ],
      "answer": 1,
      "why": "Floor division rounds down: 4. True division 9 / 2 would give 4.5."
     }
    ]
   },
   {
    "id": "pe1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Comparing floats with ==",
      "text": "Use a tolerance such as abs(a − b) < 1e-9."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Unlabelled units",
      "text": "Put the unit in the variable name."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Thinking two names are linked",
      "text": "Rebinding one name leaves the other pointing at the old value."
     }
    ]
   },
   {
    "id": "pe1-python",
    "kicker": "7 · In Python",
    "title": "Values and names in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Types, operators, a float surprise and a unit slip",
      "code": "area_sqft = 1075            # a listing quotes square feet\narea_sqm = area_sqft * 0.092903\nprice_lakh = 62.5\nrate = price_lakh * 100000 / area_sqft\nprint(\"type of each name:\", type(area_sqft).__name__, type(area_sqm).__name__, type(price_lakh).__name__, type(True).__name__, type(\"Pune\").__name__)\nprint(\"area in sq m:\", round(area_sqm, 2), \"| price per sq ft in rupees:\", round(rate, 1))\n\n# division, floor division and remainder\nprint(\"7 / 2 =\", 7 / 2, \"| 7 // 2 =\", 7 // 2, \"| 7 % 2 =\", 7 % 2, \"| 2 ** 10 =\", 2 ** 10)\n\n# floats are approximate\nprint(\"0.1 + 0.2 == 0.3 ->\", 0.1 + 0.2 == 0.3, \"| equal within a tolerance of 1e-9:\", abs((0.1 + 0.2) - 0.3) < 1e-9)\n\n# names point at values; rebinding does not change the old value\nprice = 62.5\nbackup = price\nprice = price * 1.05\nprint(\"price\", round(price, 3), \"| backup\", backup)\n\n# mixing units is a silent bug\nprint(\"rupees per sq ft if someone divides by sq m by mistake:\", round(price_lakh * 100000 / area_sqm, 1))",
      "output": "type of each name: int float float bool str\narea in sq m: 99.87 | price per sq ft in rupees: 5814.0\n7 / 2 = 3.5 | 7 // 2 = 3 | 7 % 2 = 1 | 2 ** 10 = 1024\n0.1 + 0.2 == 0.3 -> False | equal within a tolerance of 1e-9: True\nprice 65.625 | backup 62.5\nrupees per sq ft if someone divides by sq m by mistake: 62580.9"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Know the type, know the unit, and name values so the unit is visible."
     }
    ]
   }
  ]
 },
 {
  "title": "Collections: order, indexing and the copy that is not a copy",
  "minutes": 13,
  "sections": [
   {
    "id": "pe2-observe",
    "kicker": "1 · Observe",
    "title": "One flat is a row of numbers",
    "blocks": [
     {
      "kind": "p",
      "text": "A flat has bedrooms, area and distance to the metro. Python holds such groups in collections: lists for ordered items you can change, tuples for ordered items you cannot, and dictionaries for items you look up by name. Choosing the right one decides what bugs are possible."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do lists, tuples and dicts differ, and why does editing one list sometimes change another?"
     }
    ]
   },
   {
    "id": "pe2-express",
    "kicker": "2 · Express",
    "title": "Indexing, slicing and mutation",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "list[0] is the first item, list[-1] the last",
       "list[a:b] stops before b",
       "a = b makes a second name for the same list; list(b) makes a copy"
      ],
      "note": "Lists are mutable: they can be changed in place. Tuples are not."
     }
    ]
   },
   {
    "id": "pe2-visualize",
    "kicker": "3 · Visualize",
    "title": "What happens",
    "blocks": [
     {
      "kind": "table",
      "caption": "A list of three features [3, 80, 2.0]",
      "headers": [
       "Operation",
       "Result"
      ],
      "rows": [
       [
        "features[0], features[-1]",
        "3 and 2.0"
       ],
       [
        "features[0:2]",
        "[3, 80]"
       ],
       [
        "alias = features; alias[1] = 90",
        "features is now [3, 90, 2.0]"
       ],
       [
        "safe = list(features); safe[1] = 100",
        "features stays [3, 90, 2.0]"
       ],
       [
        "point[1] = 90 on a tuple",
        "TypeError"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Assignment gives the same list two names, so editing through the alias changes the original. A copy is independent, but a shallow copy of a list of lists still shares the inner lists: changing one inner value changed both."
     }
    ]
   },
   {
    "id": "pe2-discover",
    "kicker": "4 · Discover",
    "title": "Dictionaries",
    "blocks": [
     {
      "kind": "p",
      "text": "A dictionary maps keys to values: house['price_lakh'] = 65.0. A missing key raises KeyError, while house.get('age_years') returns None, or a default you provide. Use get when absence is normal."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Lists keep order and change in place, tuples keep order and never change, dicts look up by key, and assignment never copies."
     }
    ]
   },
   {
    "id": "pe2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a hidden edit. A function receives features, sorts them in place, and the caller's data is reordered. Pass a copy when the function mutates."
     },
     {
      "kind": "p",
      "text": "Example 2, a lookup. house.get('age_years', 'unknown') records absence instead of crashing."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Rows of features, labels and predictions are collections. Mixed-up order or a shared list is a silent data bug."
     },
     {
      "kind": "check",
      "question": "a = [1, 2]; b = a; b.append(3). What is a?",
      "options": [
       "[1, 2]",
       "[1, 2, 3]",
       "An error"
      ],
      "answer": 1,
      "why": "b and a are two names for one list, so appending through b changes a too."
     }
    ]
   },
   {
    "id": "pe2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Aliasing instead of copying",
      "text": "Use list(x) or x.copy() when you need independence."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Shallow copies of nested lists",
      "text": "Use copy.deepcopy for nested structures."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Indexing off the end",
      "text": "Valid indexes run from −len to len − 1."
     }
    ]
   },
   {
    "id": "pe2-python",
    "kicker": "7 · In Python",
    "title": "Collections in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Indexing, aliasing, tuples, dicts and a shallow copy",
      "code": "features = [3, 80, 2.0]                  # bedrooms, size in sq m, km to metro\nprint(\"first:\", features[0], \"| last:\", features[-1], \"| slice:\", features[0:2], \"| length:\", len(features))\n\nalias = features\nalias[1] = 90                           # assignment does not copy a list\nprint(\"after editing alias: original is\", features)\nsafe = list(features)\nsafe[1] = 100\nprint(\"after editing a copy: original\", features, \"| copy\", safe)\n\npoint = (3, 80, 2.0)                    # a tuple cannot change\ntry:\n    point[1] = 90\nexcept TypeError as e:\n    print(\"tuple edit ->\", type(e).__name__)\n\nhouse = {\"city\": \"Pune\", \"bedrooms\": 3, \"price_lakh\": 62.5}\nhouse[\"price_lakh\"] = 65.0\nprint(house, \"| keys:\", list(house))\nprint(\"missing key with get:\", house.get(\"age_years\"), \"| with default:\", house.get(\"age_years\", \"unknown\"))\n\nrows = [[3, 80], [2, 60]]\nshallow = rows.copy()\nshallow[0][1] = 999\nprint(\"a shallow copy shares the inner lists:\", rows)",
      "output": "first: 3 | last: 2.0 | slice: [3, 80] | length: 3\nafter editing alias: original is [3, 90, 2.0]\nafter editing a copy: original [3, 90, 2.0] | copy [3, 100, 2.0]\ntuple edit -> TypeError\n{'city': 'Pune', 'bedrooms': 3, 'price_lakh': 65.0} | keys: ['city', 'bedrooms', 'price_lakh']\nmissing key with get: None | with default: unknown\na shallow copy shares the inner lists: [[3, 999], [2, 60]]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Decide whether you want a second name or a second copy."
     }
    ]
   }
  ]
 },
 {
  "title": "Conditions and an honest answer to 'missing'",
  "minutes": 13,
  "sections": [
   {
    "id": "pe3-observe",
    "kicker": "1 · Observe",
    "title": "Zero rupees and 'not recorded' are different",
    "blocks": [
     {
      "kind": "p",
      "text": "A telecom's bill column holds 299, None, 799, 0 and 499. The 0 means the customer had a free month. The None means nobody recorded a bill. If code treats them alike, an average will be wrong and no error will tell you."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we write conditions that tell 'zero' from 'missing'?"
     }
    ]
   },
   {
    "id": "pe3-express",
    "kicker": "2 · Express",
    "title": "if, elif, else and None",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "if / elif / else picks the first branch that is true",
       "x is None tests for missing",
       "0, 0.0, '', [] and None are all falsy"
      ],
      "note": "Compare with None using is, not ==. Do not rely on truthiness when 0 is a valid value."
     }
    ]
   },
   {
    "id": "pe3-visualize",
    "kicker": "3 · Visualize",
    "title": "Two policies, two averages",
    "blocks": [
     {
      "kind": "table",
      "caption": "Average bill from [299, None, 799, 0, 499]",
      "headers": [
       "Policy",
       "Average"
      ],
      "rows": [
       [
        "Skip missing, keep the 0",
        "399.25"
       ],
       [
        "Treat missing as 0",
        "319.40"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Dropping the None keeps four real values (average 399.25). Calling it 0 averages over five and understates the bill by ₹80. A truthiness filter such as [b for b in bills if b] drops the genuine 0 as well, keeping only three values."
     }
    ]
   },
   {
    "id": "pe3-discover",
    "kicker": "4 · Discover",
    "title": "Say the policy out loud",
    "blocks": [
     {
      "kind": "p",
      "text": "There is no single right answer for missing values, only a stated one. Code should make the choice visible: an explicit `is None` check, a comment on what happens to the row, and a count of how many rows were affected."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Write conditions that separate zero from missing, and state what you do with the missing ones."
     }
    ]
   },
   {
    "id": "pe3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, classification. describe(0) returns 'free month' and describe(None) returns 'missing', because the None check comes first."
     },
     {
      "kind": "p",
      "text": "Example 2, a range check. 18 <= age < 60 is True for 34. Python allows chained comparisons."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Missing-value rules are the first preparation step in almost every dataset."
     },
     {
      "kind": "check",
      "question": "bills = [100, None, 0]. How many items does [b for b in bills if b] keep?",
      "options": [
       "3",
       "2",
       "1"
      ],
      "answer": 2,
      "why": "None and 0 are both falsy, so only 100 survives."
     }
    ]
   },
   {
    "id": "pe3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Truthiness tests on numbers",
      "text": "A real 0 is dropped."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Using == None",
      "text": "Use is None."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Replacing missing with 0 without saying so",
      "text": "The average changes, and nobody knows why."
     }
    ]
   },
   {
    "id": "pe3-python",
    "kicker": "7 · In Python",
    "title": "Missing values in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Zero against None, and two policies",
      "code": "bills = [299, None, 799, 0, 499]            # None = not recorded, 0 = recorded as zero rupees\n\ndef describe(b):\n    if b is None:\n        return \"missing\"\n    elif b == 0:\n        return \"free month\"\n    elif b < 500:\n        return \"low\"\n    else:\n        return \"high\"\nprint([describe(b) for b in bills])\n\n# the truthiness trap: 0 and None are both falsy\nprint(\"keep only truthy values:\", [b for b in bills if b])\nprint(\"keep only observed values:\", [b for b in bills if b is not None])\nobserved = [b for b in bills if b is not None]\nprint(\"average bill treating missing as skipped:\", sum(observed) / len(observed))\nprint(\"average bill treating missing as 0:\", sum(b or 0 for b in bills) / len(bills))\n\n# chained conditions and booleans\nage = 34\nprint(\"18 <= age < 60:\", 18 <= age < 60, \"| not (age > 40):\", not (age > 40))",
      "output": "['low', 'missing', 'high', 'free month', 'low']\nkeep only truthy values: [299, 799, 499]\nkeep only observed values: [299, 799, 0, 499]\naverage bill treating missing as skipped: 399.25\naverage bill treating missing as 0: 319.4\n18 <= age < 60: True | not (age > 40): True"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Zero is a value. None is the absence of one."
     }
    ]
   }
  ]
 },
 {
  "title": "Loops and averages you can trust",
  "minutes": 13,
  "sections": [
   {
    "id": "pe4-observe",
    "kicker": "1 · Observe",
    "title": "An average is a loop with a denominator",
    "blocks": [
     {
      "kind": "p",
      "text": "A model's errors on four flats are +2, −3, +4 and −1 lakh. Their mean squared error needs a loop: add up the squares, count the items, divide. Each part of that loop is a place to go wrong."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we write loops that accumulate correctly, and what breaks them?"
     }
    ]
   },
   {
    "id": "pe4-express",
    "kicker": "2 · Express",
    "title": "for, while and the accumulator",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "total = 0; for e in errors: total += e * e",
       "MSE = total ÷ count",
       "range(n) goes 0 … n − 1"
      ],
      "note": "The accumulator must start before the loop and add inside it."
     }
    ]
   },
   {
    "id": "pe4-visualize",
    "kicker": "3 · Visualize",
    "title": "The numbers",
    "blocks": [
     {
      "kind": "table",
      "caption": "Errors 2, −3, 4, −1",
      "headers": [
       "Quantity",
       "Value"
      ],
      "rows": [
       [
        "Sum of squares",
        "30.0"
       ],
       [
        "Count",
        "4"
       ],
       [
        "MSE",
        "7.5"
       ],
       [
        "RMSE",
        "2.739"
       ],
       [
        "Buggy total with = instead of +=",
        "1.0"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Writing total = e * e instead of total += e * e keeps only the last square, 1.0, and silently gives an MSE of 0.25. An empty list would make an average divide by zero, so guard it. A while loop that halves a step from 1.0 until it is below 0.01 runs 7 times and ends at 0.00781."
     }
    ]
   },
   {
    "id": "pe4-discover",
    "kicker": "4 · Discover",
    "title": "Loop habits",
    "blocks": [
     {
      "kind": "p",
      "text": "Use enumerate when you need the index, break to stop early, and a guard for the empty case. Test with a case you can check by hand before trusting the loop on real data."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A reliable aggregate needs the right start value, the right update, the right count and a plan for empty input."
     }
    ]
   },
   {
    "id": "pe4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, RMSE. √(30 ÷ 4) = √7.5 = 2.739 lakh."
     },
     {
      "kind": "p",
      "text": "Example 2, first negative. enumerate finds that the first negative error is at index 1."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Metrics, gradients and training loops are all accumulation loops."
     },
     {
      "kind": "check",
      "question": "for e in [1, 2, 3]: total = e. What is total after the loop?",
      "options": [
       "6",
       "3",
       "1"
      ],
      "answer": 1,
      "why": "total is reassigned each time, so it ends as the last value, 3."
     }
    ]
   },
   {
    "id": "pe4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · = instead of +=",
      "text": "Only the last item counts."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Dividing by zero on an empty list",
      "text": "Guard the empty case."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Off-by-one ranges",
      "text": "range(n) stops before n."
     }
    ]
   },
   {
    "id": "pe4-python",
    "kicker": "7 · In Python",
    "title": "Aggregation loops in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Sum of squares, an empty guard, enumerate and a while loop",
      "code": "errors = [2.0, -3.0, 4.0, -1.0]            # prediction minus actual, in lakh rupees\n\ntotal, count = 0.0, 0\nfor e in errors:\n    total += e * e\n    count += 1\nprint(\"sum of squares\", total, \"| count\", count, \"| MSE\", total / count, \"| RMSE\", round((total / count) ** 0.5, 3))\n\n# an empty list breaks an average\ndef mean(xs):\n    if not xs:\n        return None\n    return sum(xs) / len(xs)\nprint(\"mean of []:\", mean([]), \"| mean of errors:\", mean(errors))\n\n# off-by-one: range stops before the end\nprint(\"range(4):\", list(range(4)), \"| indexes for 4 items:\", list(range(len(errors))))\nfor i, e in enumerate(errors):\n    if e < 0:\n        print(\"first negative error at index\", i)\n        break\n\n# while: halve a step until it is small\nstep, n = 1.0, 0\nwhile step > 0.01:\n    step /= 2\n    n += 1\nprint(\"halvings needed:\", n, \"| final step\", round(step, 5))\n\n# the accumulator reset bug\ntotal_bad = 0\nfor e in errors:\n    total_bad = e * e            # forgot += : only the last square survives\nprint(\"buggy total:\", total_bad, \"| correct total:\", total)",
      "output": "sum of squares 30.0 | count 4 | MSE 7.5 | RMSE 2.739\nmean of []: None | mean of errors: 0.5\nrange(4): [0, 1, 2, 3] | indexes for 4 items: [0, 1, 2, 3]\nfirst negative error at index 1\nhalvings needed: 7 | final step 0.00781\nbuggy total: 1.0 | correct total: 30.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Check an accumulator against a hand calculation before trusting it."
     }
    ]
   }
  ]
 },
 {
  "title": "Functions are contracts",
  "minutes": 13,
  "sections": [
   {
    "id": "pe5-observe",
    "kicker": "1 · Observe",
    "title": "The same three lines, pasted five times",
    "blocks": [
     {
      "kind": "p",
      "text": "Every time you price a flat you repeat: multiply the area by a rate, add a base. Copying it invites a typo in one copy. A function names the steps once, so every caller gets the same behaviour."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What makes a function reliable, and what common traps break the contract?"
     }
    ]
   },
   {
    "id": "pe5-express",
    "kicker": "2 · Express",
    "title": "Parameters, returns and defaults",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "def predict(area, rate=0.8, base=-7.0): return rate * area + base",
       "return gives the value back; print only shows it",
       "a default is evaluated once, when the function is defined"
      ],
      "note": "A good function has a clear input, a clear output and no surprises."
     }
    ]
   },
   {
    "id": "pe5-visualize",
    "kicker": "3 · Visualize",
    "title": "What the contract looks like",
    "blocks": [
     {
      "kind": "table",
      "caption": "Behaviours",
      "headers": [
       "Call",
       "Result"
      ],
      "rows": [
       [
        "predict(75)",
        "53.0"
       ],
       [
        "predict(75, rate=0.9)",
        "60.5"
       ],
       [
        "A function that only prints",
        "returns None"
       ],
       [
        "add_bad(1), add_bad(2) with a list default",
        "[1, 2] both times"
       ],
       [
        "mse([50,60,70],[52,57,74])",
        "9.67"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A function that prints but does not return gives None to the caller. A mutable default such as bucket=[] is created once and shared by every call, so the second call sees the first call's item. Use None as the default and create the list inside."
     }
    ]
   },
   {
    "id": "pe5-discover",
    "kicker": "4 · Discover",
    "title": "Validate at the door",
    "blocks": [
     {
      "kind": "p",
      "text": "Check inputs that would silently corrupt the result: mse raises ValueError if the lists have different lengths. A clear error early is better than a wrong number later."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A function is a contract: given these inputs it returns this output, and it complains loudly when the inputs are invalid."
     }
    ]
   },
   {
    "id": "pe5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, MSE by hand. Errors −2, 3, −4: squares 4, 9, 16, mean 29 ÷ 3 = 9.67."
     },
     {
      "kind": "p",
      "text": "Example 2, keyword arguments. predict(75, rate=0.9) reads better than predict(75, 0.9, -7.0)."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every preprocessing step and metric in a pipeline is a function. Pure functions are easy to test."
     },
     {
      "kind": "check",
      "question": "A function ends with print(x) and no return. What does `y = f()` store in y?",
      "options": [
       "x",
       "None",
       "An error"
      ],
      "answer": 1,
      "why": "Without return, a function gives back None."
     }
    ]
   },
   {
    "id": "pe5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · print instead of return",
      "text": "The caller receives None."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Mutable defaults",
      "text": "Use None and build the list inside."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Functions with hidden side effects",
      "text": "Prefer functions that depend only on their arguments."
     }
    ]
   },
   {
    "id": "pe5-python",
    "kicker": "7 · In Python",
    "title": "A function contract in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Return values, a default trap and input validation",
      "code": "def predict(area, rate=0.8, base=-7.0):\n    \"\"\"Price in lakh from area in sq m. Pure: same inputs, same output, no printing.\"\"\"\n    return rate * area + base\n\nprint(\"predict(75) =\", round(predict(75), 2), \"| with a different rate:\", round(predict(75, rate=0.9), 2))\n\ndef noisy(area):\n    print(\"computing...\")                 # prints, but returns None\nx = noisy(75)\nprint(\"a function without return gives:\", x)\n\n# mutable default argument trap\ndef add_bad(item, bucket=[]):\n    bucket.append(item)\n    return bucket\nprint(add_bad(1), add_bad(2), \"<- the same list is reused\")\ndef add_good(item, bucket=None):\n    bucket = [] if bucket is None else bucket\n    bucket.append(item)\n    return bucket\nprint(add_good(1), add_good(2))\n\n# a function as a contract: validate inputs\ndef mse(actual, predicted):\n    if len(actual) != len(predicted):\n        raise ValueError(\"lengths differ\")\n    return sum((a - p) ** 2 for a, p in zip(actual, predicted)) / len(actual)\nprint(\"mse:\", mse([50, 60, 70], [52, 57, 74]))",
      "output": "predict(75) = 53.0 | with a different rate: 60.5\ncomputing...\na function without return gives: None\n[1, 2] [1, 2] <- the same list is reused\n[1] [2]\nmse: 9.666666666666666"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Return values, validate inputs, avoid shared defaults."
     }
    ]
   }
  ]
 },
 {
  "title": "Comprehensions: transformations you can read",
  "minutes": 12,
  "sections": [
   {
    "id": "pe6-observe",
    "kicker": "1 · Observe",
    "title": "Price per square metre for every flat",
    "blocks": [
     {
      "kind": "p",
      "text": "To turn two lists, areas and prices, into one list of prices per sq m, the loop version takes four lines. A list comprehension does it in one, and says what it means: for each pair, divide the price by the area."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "When does a comprehension help, and when does it hurt?"
     }
    ]
   },
   {
    "id": "pe6-express",
    "kicker": "2 · Express",
    "title": "Syntax",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "[expression for item in items if condition]",
       "{key: value for ...}",
       "sum(x * 2 for x in xs)   ← a generator, nothing stored"
      ],
      "note": "Read it as: the expression, for each item, when the condition holds."
     }
    ]
   },
   {
    "id": "pe6-visualize",
    "kicker": "3 · Visualize",
    "title": "Results",
    "blocks": [
     {
      "kind": "table",
      "caption": "Areas [40, 55, 80, 120], prices [30, 41, 55, 90]",
      "headers": [
       "Expression",
       "Result"
      ],
      "rows": [
       [
        "[p / a for a, p in zip(...)]",
        "[0.75, 0.745, 0.688, 0.75]"
       ],
       [
        "[a for a in areas if a >= 60]",
        "[80, 120]"
       ],
       [
        "['large' if a >= 60 else 'small' ...]",
        "small, small, large, large"
       ],
       [
        "{a: p for a, p in zip(...)}",
        "{40: 30, 55: 41, 80: 55, 120: 90}"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "A comprehension and its loop give identical results: [0.688, 0.75] for flats of at least 60 sq m. The set comprehension on [−2, 2, 3] squares to {4, 9}: duplicates collapse."
     }
    ]
   },
   {
    "id": "pe6-discover",
    "kicker": "4 · Discover",
    "title": "Readability",
    "blocks": [
     {
      "kind": "p",
      "text": "A nested comprehension such as [[i * j for j in range(1, 4)] for i in range(1, 4)] gives a 3 × 3 multiplication table, but anything more complex deserves a loop. If you cannot read it aloud in one breath, break it up."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A comprehension is a loop that builds a collection, best when it reads like a sentence."
     }
    ]
   },
   {
    "id": "pe6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, filter then transform. [round(p / a, 3) for a, p in zip(areas, prices) if a >= 60] filters to large flats and gives their rate."
     },
     {
      "kind": "p",
      "text": "Example 2, a generator. sum(a * 2 for a in areas) = 590 never builds the intermediate list."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Feature engineering lines such as 'square every value' or 'flag rows above a threshold' are comprehensions."
     },
     {
      "kind": "check",
      "question": "What does [x for x in [1, 2, 3, 4] if x % 2 == 0] give?",
      "options": [
       "[1, 3]",
       "[2, 4]",
       "[1, 2, 3, 4]"
      ],
      "answer": 1,
      "why": "It keeps the even values."
     }
    ]
   },
   {
    "id": "pe6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Cramming logic into one line",
      "text": "If it needs a comment to be understood, use a loop."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · zip stops at the shorter list",
      "text": "Mismatched lengths silently lose data. Check len first."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Side effects inside a comprehension",
      "text": "Use it to build, not to print or modify."
     }
    ]
   },
   {
    "id": "pe6-python",
    "kicker": "7 · In Python",
    "title": "Comprehensions in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "List, dict, set and generator comprehensions",
      "code": "areas = [40, 55, 80, 120]\nprices = [30, 41, 55, 90]\n\nper_sqm = [p / a for a, p in zip(areas, prices)]\nprint(\"price per sq m:\", [round(v, 3) for v in per_sqm])\nbig = [a for a in areas if a >= 60]\nprint(\"areas of at least 60:\", big)\nlabels = [\"large\" if a >= 60 else \"small\" for a in areas]\nprint(labels)\nlookup = {a: p for a, p in zip(areas, prices)}\nprint(\"dict comprehension:\", lookup)\nsquares = {e ** 2 for e in [-2, 2, 3]}\nprint(\"set comprehension (duplicates collapse):\", sorted(squares))\n\n# a comprehension equals a loop\nloop_result = []\nfor a, p in zip(areas, prices):\n    if a >= 60:\n        loop_result.append(round(p / a, 3))\nprint(\"loop:\", loop_result, \"| comprehension:\", [round(p / a, 3) for a, p in zip(areas, prices) if a >= 60])\n\n# too much in one line is hard to read\nprint(\"nested: \", [[i * j for j in range(1, 4)] for i in range(1, 4)])\n# lazily evaluated generator\ntotal = sum(a * 2 for a in areas)\nprint(\"generator inside sum:\", total)",
      "output": "price per sq m: [0.75, 0.745, 0.688, 0.75]\nareas of at least 60: [80, 120]\n['small', 'small', 'large', 'large']\ndict comprehension: {40: 30, 55: 41, 80: 55, 120: 90}\nset comprehension (duplicates collapse): [4, 9]\nloop: [0.688, 0.75] | comprehension: [0.688, 0.75]\nnested:  [[1, 2, 3], [2, 4, 6], [3, 6, 9]]\ngenerator inside sum: 590"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Use a comprehension when it reads as one clear sentence."
     }
    ]
   }
  ]
 },
 {
  "title": "Debugging, exceptions and imports",
  "minutes": 13,
  "sections": [
   {
    "id": "pe7-observe",
    "kicker": "1 · Observe",
    "title": "A messy price that crashes the pipeline",
    "blocks": [
     {
      "kind": "p",
      "text": "A scraped column holds '62.5', '1,25,000', 'n/a' and an empty string. One float() call on 'n/a' crashes the entire run. Handling messy input without hiding real bugs is a core skill."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we read an error, catch the right one, and reuse code safely?"
     }
    ]
   },
   {
    "id": "pe7-express",
    "kicker": "2 · Express",
    "title": "Reading errors and catching them",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "try: risky()  except SpecificError: handle()",
       "raise ValueError('clear message')",
       "import math; math.sqrt(2)"
      ],
      "note": "The last line of a traceback names the error. Catch the specific error you expect, not everything."
     }
    ]
   },
   {
    "id": "pe7-visualize",
    "kicker": "3 · Visualize",
    "title": "A cleaning function",
    "blocks": [
     {
      "kind": "table",
      "caption": "parse_price on four strings",
      "headers": [
       "Input",
       "Result"
      ],
      "rows": [
       [
        "'62.5'",
        "62.5"
       ],
       [
        "'1,25,000'",
        "125000.0"
       ],
       [
        "'n/a'",
        "None"
       ],
       [
        "''",
        "None"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Removing the commas handles the Indian number format. The ValueError for 'n/a' and '' is caught and turned into None, which the next step can treat as missing. IndexError and KeyError messages tell you exactly what was missing: 'list index out of range' and the missing key 'b'."
     }
    ]
   },
   {
    "id": "pe7-discover",
    "kicker": "4 · Discover",
    "title": "Fail loudly, catch narrowly",
    "blocks": [
     {
      "kind": "p",
      "text": "safe_log raises ValueError with the bad value in the message. A bare `except:` would hide a typo in the code too. Catch only what you know how to handle. Use import for tested code such as math and statistics instead of rewriting it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Read the last line of the traceback, catch the specific error you can handle and let the rest fail loudly."
     }
    ]
   },
   {
    "id": "pe7-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a range check. A negative area should raise ValueError('area must be positive') rather than flow into a model."
     },
     {
      "kind": "p",
      "text": "Example 2, an unexpected error. If parse_price had a typo, `except Exception` would hide it as None. `except ValueError` lets the typo's NameError surface."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Data loading and cleaning code is mostly error handling. Bad rows should be counted, not silently dropped."
     },
     {
      "kind": "check",
      "question": "Which is better practice?",
      "options": [
       "except:",
       "except Exception:",
       "except ValueError:"
      ],
      "answer": 2,
      "why": "Catching the specific error you expect avoids hiding unrelated bugs."
     }
    ]
   },
   {
    "id": "pe7-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · A bare except",
      "text": "It hides typos and keyboard interrupts."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Swallowing errors without counting them",
      "text": "Log how many rows failed."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reinventing the standard library",
      "text": "Import what is tested."
     }
    ]
   },
   {
    "id": "pe7-python",
    "kicker": "7 · In Python",
    "title": "Errors in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Parse messy prices, read tracebacks and raise your own error",
      "code": "import math\nimport statistics\n\ndef parse_price(text):\n    try:\n        return float(text.replace(\",\", \"\"))\n    except ValueError:\n        return None\n\nfor raw in [\"62.5\", \"1,25,000\", \"n/a\", \"\"]:\n    print(repr(raw), \"->\", parse_price(raw))\n\n# read a traceback: the last line names the error\ntry:\n    [1, 2, 3][5]\nexcept IndexError as e:\n    print(\"IndexError:\", e)\ntry:\n    {\"a\": 1}[\"b\"]\nexcept KeyError as e:\n    print(\"KeyError for key\", e)\n\n# raise your own error with a clear message\ndef safe_log(x):\n    if x <= 0:\n        raise ValueError(f\"log needs a positive number, got {x}\")\n    return math.log(x)\ntry:\n    safe_log(0)\nexcept ValueError as e:\n    print(\"ValueError:\", e)\n\nprint(\"imports:\", round(math.sqrt(2), 4), statistics.median([3, 1, 2]))\n# never swallow every exception silently\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    print(\"caught only the error we expected\")",
      "output": "'62.5' -> 62.5\n'1,25,000' -> 125000.0\n'n/a' -> None\n'' -> None\nIndexError: list index out of range\nKeyError for key 'b'\nValueError: log needs a positive number, got 0\nimports: 1.4142 2\ncaught only the error we expected"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Catch what you expect. Let the rest crash with a clear message."
     }
    ]
   }
  ]
 },
 {
  "title": "A small program you can rerun tomorrow",
  "minutes": 13,
  "sections": [
   {
    "id": "pe8-observe",
    "kicker": "1 · Observe",
    "title": "Same data, same code, same answer",
    "blocks": [
     {
      "kind": "p",
      "text": "A colleague hands you a file of flats. You compute the mean price, share it, and next week someone asks how. If your program reads the data, handles gaps, fixes the random seed and prints the result, anyone can rerun it and match your number."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What makes a small program reproducible?"
     }
    ]
   },
   {
    "id": "pe8-express",
    "kicker": "2 · Express",
    "title": "Read, clean, compute, save",
    "blocks": [
     {
      "kind": "steps",
      "items": [
       "Read the file with the csv module, one dict per row.",
       "Convert text to numbers, turning blanks into None.",
       "Drop or flag the rows you cannot use, and count them.",
       "Compute with a fixed random seed where chance is involved.",
       "Save the result as JSON and put the logic inside main()."
      ]
     },
     {
      "kind": "eq",
      "lines": [
       "random.Random(42) gives the same shuffle every time",
       "json.dumps / json.loads round-trip simple data"
      ],
      "note": "A seed fixes the pseudo-random sequence."
     }
    ]
   },
   {
    "id": "pe8-visualize",
    "kicker": "3 · Visualize",
    "title": "Four rows",
    "blocks": [
     {
      "kind": "p",
      "text": "A four-row CSV: Pune 80 sq m ₹55, Hyderabad 60 sq m ₹41, Pune with a blank area ₹38, Bhubaneswar 100 sq m ₹70."
     },
     {
      "kind": "table",
      "caption": "What the program found",
      "headers": [
       "Step",
       "Result"
      ],
      "rows": [
       [
        "Rows read",
        "4"
       ],
       [
        "Rows with missing area",
        "1 (Pune)"
       ],
       [
        "Usable rows",
        "3"
       ],
       [
        "Mean price of usable rows",
        "₹55.33 lakh"
       ],
       [
        "Same seed, same shuffle",
        "True"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The summary, saved as JSON, reloads to the same row count. The program reports the dropped row instead of hiding it."
     }
    ]
   },
   {
    "id": "pe8-discover",
    "kicker": "4 · Discover",
    "title": "Structure",
    "blocks": [
     {
      "kind": "p",
      "text": "Put the logic in functions and a main(). The `if __name__ == '__main__'` guard lets the file be both run and imported. Keep file paths and seeds at the top where they are easy to change."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A reproducible program reads its inputs, states its choices, fixes its randomness and writes its results."
     }
    ]
   },
   {
    "id": "pe8-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a dropped row. 3 of 4 rows are usable. Report 'dropped 1 of 4 rows for missing area' next to the mean."
     },
     {
      "kind": "p",
      "text": "Example 2, a seed. random.Random(42).shuffle gives the same order every run, so a train/test split can be repeated."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every experiment, from a data check to a model fit, should be rerunnable by someone else."
     },
     {
      "kind": "check",
      "question": "Why set a seed?",
      "options": [
       "To make the code faster",
       "To make random steps repeat exactly",
       "To hide the data"
      ],
      "answer": 1,
      "why": "A fixed seed gives the same random numbers each run, so results can be reproduced."
     }
    ]
   },
   {
    "id": "pe8-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Silent dropping",
      "text": "Count and report what you drop."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Hard-coded paths and seeds in the middle of code",
      "text": "Put them at the top."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Forgetting versions",
      "text": "Note the Python and library versions you used."
     }
    ]
   },
   {
    "id": "pe8-python",
    "kicker": "7 · In Python",
    "title": "A small pipeline in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Read CSV, clean, summarise, seed and save JSON",
      "code": "import csv\nimport io\nimport json\nimport random\n\nraw = \"city,area,price\\nPune,80,55\\nHyderabad,60,41\\nPune,,38\\nBhubaneswar,100,70\\n\"\nrows = list(csv.DictReader(io.StringIO(raw)))\nprint(\"rows read:\", len(rows), \"| first:\", rows[0])\n\ndef to_float(text):\n    return float(text) if text.strip() else None\nclean = [{\"city\": r[\"city\"], \"area\": to_float(r[\"area\"]), \"price\": to_float(r[\"price\"])} for r in rows]\nprint(\"missing areas:\", [r[\"city\"] for r in clean if r[\"area\"] is None])\nusable = [r for r in clean if r[\"area\"] is not None]\nprint(\"usable rows:\", len(usable), \"| mean price:\", round(sum(r[\"price\"] for r in usable) / len(usable), 2))\n\n# reproducible randomness: the seed fixes the shuffle\ndata = list(range(10))\nrandom.Random(42).shuffle(data)\nagain = list(range(10))\nrandom.Random(42).shuffle(again)\nprint(\"same seed, same order:\", data == again)\n\n# save and reload JSON\ntext = json.dumps({\"mean_price\": 51.0, \"rows\": len(usable)})\nprint(text, \"->\", json.loads(text)[\"rows\"])\n\ndef main():\n    return round(sum(r[\"price\"] for r in usable) / len(usable), 1)\nif __name__ == \"__main__\":\n    print(\"main result:\", main())",
      "output": "rows read: 4 | first: {'city': 'Pune', 'area': '80', 'price': '55'}\nmissing areas: ['Pune']\nusable rows: 3 | mean price: 55.33\nsame seed, same order: True\n{\"mean_price\": 51.0, \"rows\": 3} -> 3\nmain result: 55.3"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "If someone else cannot rerun your program, the result is an anecdote."
     }
    ]
   }
  ]
 }
];
