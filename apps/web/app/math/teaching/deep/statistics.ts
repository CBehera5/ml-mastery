import type {DeepLesson} from "../deep-read";
export const STATISTICS_DEEP:DeepLesson[]=[
 {
  "title": "Before any number: what is in the table?",
  "minutes": 12,
  "sections": [
   {
    "id": "st1-observe",
    "kicker": "1 · Observe",
    "title": "A telecom's customer file",
    "blocks": [
     {
      "kind": "p",
      "text": "Someone hands you a spreadsheet of customers and asks 'what is our average bill?'. Before computing anything, the first statistical act is to look at what you have: how many rows, what kinds of columns, what is missing. Most bad analyses start by skipping this step."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What kinds of data are there, and what should you check before trusting any summary?"
     }
    ]
   },
   {
    "id": "st1-express",
    "kicker": "2 · Express",
    "title": "Rows, columns and types",
    "blocks": [
     {
      "kind": "p",
      "text": "A row is an observation, here a customer. A column is a variable. Numeric variables (bill, calls) can be added and averaged. Categorical variables (city) are labels. Ordinal variables (plan: basic < standard < premium) have a real order but unequal gaps, so coding them 0, 1, 2 should be done knowingly."
     },
     {
      "kind": "eq",
      "lines": [
       "observation = one row",
       "variable = one column",
       "summary of a column depends on its type"
      ],
      "note": "You can average a bill but not a city, and the average of plan codes 0, 1 and 2 is not 'a plan'."
     }
    ]
   },
   {
    "id": "st1-visualize",
    "kicker": "3 · Visualize",
    "title": "Missing values are part of the data",
    "blocks": [
     {
      "kind": "p",
      "text": "A six-row file has one missing city and one missing bill. The average bill is ₹539 from the five bills present, not six. City counts show Pune 2, Hyderabad 2, Bhubaneswar 1 and one missing. If missing values are dropped silently, the sample you analyse is smaller than the one you describe."
     }
    ]
   },
   {
    "id": "st1-discover",
    "kicker": "4 · Discover",
    "title": "What to look at first",
    "blocks": [
     {
      "kind": "p",
      "text": "Check the shape, the types, the missing counts and the value counts of each categorical column. Then look at the ranges of each numeric one. Ten minutes here prevents most embarrassing results later."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Statistics begins with the table: what each row is, what each column means, and what is missing."
     }
    ]
   },
   {
    "id": "st1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a trap. A column holds 999 for 'bill unknown'. The average bill jumps. A quick look at the maximum shows 999 sitting far from the rest."
     },
     {
      "kind": "p",
      "text": "Example 2, the denominator. Of 6 customers, 5 have a bill. 'Average bill per customer' is the total over 5, but 'revenue per customer' over all 6 would be lower. Say which one you mean."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Missing values, wrong types and code values like 999 are the most common reasons a model silently learns the wrong thing."
     },
     {
      "kind": "check",
      "question": "A column of plan names is coded basic = 0, standard = 1, premium = 2. What is true of its average?",
      "options": [
       "It is a meaningful plan",
       "It treats the gaps between plans as equal, which may be wrong",
       "It must be 1"
      ],
      "answer": 1,
      "why": "Ordinal codes encode order but not distance. Averaging them assumes equal gaps."
     }
    ]
   },
   {
    "id": "st1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Summarising before looking",
      "text": "A single average hides missing values, codes and typos."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Dropping missing rows without saying so",
      "text": "The result describes a different group from the one you named."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Treating categories as numbers",
      "text": "A city code of 7 is not 'more' than a city code of 3."
     }
    ]
   },
   {
    "id": "st1-python",
    "kicker": "7 · In Python",
    "title": "A first look in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Shape, types, missing values and counts",
      "code": "import numpy as np\nimport pandas as pd\n\ndf = pd.DataFrame({\n    \"customer\": [\"A101\", \"A102\", \"A103\", \"A104\", \"A105\", \"A106\"],\n    \"city\": [\"Pune\", \"Hyderabad\", \"Pune\", None, \"Bhubaneswar\", \"Hyderabad\"],\n    \"plan\": [\"basic\", \"premium\", \"basic\", \"standard\", \"premium\", \"standard\"],\n    \"monthly_bill\": [299, 799, 299, np.nan, 799, 499],\n    \"calls\": [2, 0, 5, 1, 0, 3],\n})\nprint(\"numeric columns:\", df.select_dtypes(\"number\").columns.tolist(), \"| text columns:\", df.select_dtypes(exclude=\"number\").columns.tolist())\nprint(\"rows, columns:\", df.shape)\nprint(\"missing per column:\", df.isna().sum().to_dict())\nprint(\"city counts:\", df[\"city\"].value_counts(dropna=False).to_dict())\norder = {\"basic\": 0, \"standard\": 1, \"premium\": 2}                  # an ordinal column: the order is real, the gaps are not\nprint(\"plan as ordered codes:\", df[\"plan\"].map(order).tolist())\nprint(\"average bill (missing skipped):\", round(df[\"monthly_bill\"].mean(), 1), \"| bills present:\", int(df[\"monthly_bill\"].notna().sum()))",
      "output": "numeric columns: ['monthly_bill', 'calls'] | text columns: ['customer', 'city', 'plan']\nrows, columns: (6, 5)\nmissing per column: {'customer': 0, 'city': 1, 'plan': 0, 'monthly_bill': 1, 'calls': 0}\ncity counts: {'Pune': 2, 'Hyderabad': 2, nan: 1, 'Bhubaneswar': 1}\nplan as ordered codes: [0, 2, 0, 1, 2, 1]\naverage bill (missing skipped): 539.0 | bills present: 5"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Look first, summarise second, and say how many rows each number is based on."
     }
    ]
   }
  ]
 },
 {
  "title": "Mean, median and mode: three answers to 'typical'",
  "minutes": 12,
  "sections": [
   {
    "id": "st2-observe",
    "kicker": "1 · Observe",
    "title": "What does a typical salary look like?",
    "blocks": [
     {
      "kind": "p",
      "text": "Ten employees earn between ₹32,000 and ₹60,000 a month. A founder who takes ₹9 lakh a month joins the list. Is the 'typical salary' still ₹44,500? A single number to summarise a column can mislead, and which number you choose is a decision."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Mean, median or mode: which one tells the truth about a typical value?"
     }
    ]
   },
   {
    "id": "st2-express",
    "kicker": "2 · Express",
    "title": "Three centres",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "mean = (sum of values) ÷ (count)",
       "median = the middle value when sorted",
       "mode = the most frequent value"
      ],
      "note": "The mean is the balance point. The median splits the data in half. The mode is the most common value."
     }
    ]
   },
   {
    "id": "st2-visualize",
    "kicker": "3 · Visualize",
    "title": "Watch the founder arrive",
    "blocks": [
     {
      "kind": "table",
      "caption": "Ten salaries, then eleven",
      "headers": [
       "",
       "Mean",
       "Median"
      ],
      "rows": [
       [
        "Ten employees (₹ thousand)",
        "44.5",
        "43.5"
       ],
       [
        "With a founder at 900",
        "122.3",
        "45.0"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "One extra value moved the mean from 44.5 to 122.3, nearly three times higher. The median barely moved, from 43.5 to 45. A trimmed mean that drops the top and bottom 10 percent gives 45.9. Robust statistics resist outliers."
     }
    ]
   },
   {
    "id": "st2-discover",
    "kicker": "4 · Discover",
    "title": "Averages of averages",
    "blocks": [
     {
      "kind": "p",
      "text": "Three branches with 100, 400 and 500 staff have average salaries of 60, 48 and 40. The plain average of the three averages is 49.33, but the true average over all 1,000 staff is 45.2. Averages must be weighted by how many people each represents."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "The mean follows every value, so it moves with outliers, while the median follows the middle and resists them."
     }
    ]
   },
   {
    "id": "st2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, which to quote. In a report on startup salaries, the median is the honest 'typical' figure when a few huge salaries exist. The mean is the right figure for the total payroll."
     },
     {
      "kind": "p",
      "text": "Example 2, the mode. A shop sells shirts in sizes S, M, L. The most common size, the mode, tells you what to stock, and no average size would."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Mean squared error ties a model to the mean, absolute error to the median. The choice of loss is a choice of centre."
     },
     {
      "kind": "check",
      "question": "Values: 2, 3, 3, 3, 4, 7. What is the mode?",
      "options": [
       "3",
       "4",
       "3.67"
      ],
      "answer": 0,
      "why": "3 appears three times, more often than any other value."
     }
    ]
   },
   {
    "id": "st2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Quoting the mean of a skewed column",
      "text": "One large value can drag it away from every typical case."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Averaging averages without weights",
      "text": "Groups of different sizes need different weights."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Ignoring the mode for categories",
      "text": "You cannot average colours, but you can report the most common."
     }
    ]
   },
   {
    "id": "st2-python",
    "kicker": "7 · In Python",
    "title": "Three centres in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Mean, median, mode, trimmed and weighted averages",
      "code": "import numpy as np\n\nsalaries = np.array([32, 35, 38, 40, 42, 45, 48, 50, 55, 60], float)           # monthly, thousand rupees\nprint(\"mean\", salaries.mean(), \"| median\", np.median(salaries))\nwith_founder = np.append(salaries, 900)\nprint(\"after one founder at 900: mean\", round(float(with_founder.mean()), 1), \"| median\", np.median(with_founder))\n\nvals, counts = np.unique([2, 3, 3, 3, 4, 7], return_counts=True)\nprint(\"mode of [2,3,3,3,4,7]:\", vals[counts.argmax()])\n\n# trimmed mean and weighted mean\nfrom scipy import stats\nprint(\"10 percent trimmed mean with founder:\", round(float(stats.trim_mean(with_founder, 0.1)), 1))\nsizes, avg = np.array([100, 400, 500]), np.array([60.0, 48.0, 40.0])\nprint(\"average of three branch averages:\", round(float(avg.mean()), 2), \"| true average (weighted by headcount):\", round(float((sizes * avg).sum() / sizes.sum()), 2))",
      "output": "mean 44.5 | median 43.5\nafter one founder at 900: mean 122.3 | median 45.0\nmode of [2,3,3,3,4,7]: 3\n10 percent trimmed mean with founder: 45.9\naverage of three branch averages: 49.33 | true average (weighted by headcount): 45.2"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Choose the centre that matches the question, and report which one you used."
     }
    ]
   }
  ]
 },
 {
  "title": "Spread: why the same average can mean different things",
  "minutes": 13,
  "sections": [
   {
    "id": "st3-observe",
    "kicker": "1 · Observe",
    "title": "Two delivery areas, one average",
    "blocks": [
     {
      "kind": "p",
      "text": "Both areas average 32 minutes. In area A deliveries take between 28 and 36. In area B they take between 10 and 54. The average promises the same thing, and the customers' experiences are completely different."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we measure how far values stray from the centre?"
     }
    ]
   },
   {
    "id": "st3-express",
    "kicker": "2 · Express",
    "title": "Range, IQR, variance and standard deviation",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "range = max − min",
       "IQR = Q3 − Q1   (the middle half)",
       "variance = Σ (x − mean)² ÷ (n − 1)",
       "standard deviation = √variance"
      ],
      "note": "The standard deviation is in the same units as the data. The variance is in squared units."
     }
    ]
   },
   {
    "id": "st3-visualize",
    "kicker": "3 · Visualize",
    "title": "Same mean, different spread",
    "blocks": [
     {
      "kind": "table",
      "caption": "Delivery minutes",
      "headers": [
       "Area",
       "Mean",
       "Range",
       "IQR",
       "Variance",
       "Standard deviation"
      ],
      "rows": [
       [
        "A",
        "32",
        "8",
        "4",
        "10",
        "3.16"
       ],
       [
        "B",
        "32",
        "44",
        "24",
        "314",
        "17.72"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Area B's spread is more than five times larger. Telling a customer '32 minutes' is honest in A and nearly meaningless in B."
     }
    ]
   },
   {
    "id": "st3-discover",
    "kicker": "4 · Discover",
    "title": "Why n − 1",
    "blocks": [
     {
      "kind": "p",
      "text": "A sample's mean sits closer to the sample's own values than the true mean does, so dividing by n underestimates the spread. Divide by n − 1 and it corrects on average. In a simulation with true variance 100 and samples of 5, the divide-by-n formula averaged 80.6 and the n − 1 formula averaged 100.4."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "The mean says where the data is, and the standard deviation says how far a typical value strays from it."
     }
    ]
   },
   {
    "id": "st3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, by hand. Area A: 28, 30, 32, 34, 36 with mean 32. Squared deviations: 16, 4, 0, 4, 16 sum to 40. Divide by 4: variance 10. Standard deviation 3.16."
     },
     {
      "kind": "p",
      "text": "Example 2, units. In hours, the same spread is 3.16 ÷ 60 = 0.0527. Standard deviation moves with the unit; compare spreads only in the same units."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Standardising a feature divides by its standard deviation. A feature's spread also decides how much a model's weight on it can matter."
     },
     {
      "kind": "check",
      "question": "Which statistic is least affected by one extreme value?",
      "options": [
       "Range",
       "Standard deviation",
       "IQR"
      ],
      "answer": 2,
      "why": "The IQR looks at the middle half of the data, so extremes outside it do not change it."
     }
    ]
   },
   {
    "id": "st3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reporting only the average",
      "text": "Always report a spread alongside."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Using the range for large samples",
      "text": "It depends only on two values and grows as you collect more data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Using n instead of n − 1 on small samples",
      "text": "The estimate will be low."
     }
    ]
   },
   {
    "id": "st3-python",
    "kicker": "7 · In Python",
    "title": "Spread in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Range, IQR, variance, standard deviation and the n − 1 check",
      "code": "import numpy as np\n\na = np.array([28, 30, 32, 34, 36], float)                # delivery minutes, area A\nb = np.array([10, 20, 32, 44, 54], float)                # area B: same mean, wider\nfor name, x in ((\"A\", a), (\"B\", b)):\n    q1, q3 = np.percentile(x, [25, 75])\n    print(name, \"mean\", x.mean(), \"| range\", x.max() - x.min(), \"| IQR\", q3 - q1,\n          \"| variance (n-1)\", round(float(x.var(ddof=1)), 1), \"| sd\", round(float(x.std(ddof=1)), 2))\n\n# population versus sample formula\nprint(\"divide by n:\", round(float(a.var()), 2), \"| divide by n-1:\", round(float(a.var(ddof=1)), 2))\n\n# the n-1 correction on average\nrng = np.random.default_rng(0)\npop = rng.normal(0, 10, 100000)\nest_n = np.mean([rng.choice(pop, 5).var() for _ in range(20000)])\nest_n1 = np.mean([rng.choice(pop, 5).var(ddof=1) for _ in range(20000)])\nprint(\"true variance\", round(float(pop.var()), 1), \"| average of n-formula on samples of 5:\", round(float(est_n), 1), \"| n-1 formula:\", round(float(est_n1), 1))\n\n# spread after rescaling\nprint(\"sd in minutes\", round(float(a.std(ddof=1)), 2), \"| in hours\", round(float((a / 60).std(ddof=1)), 4))",
      "output": "A mean 32.0 | range 8.0 | IQR 4.0 | variance (n-1) 10.0 | sd 3.16\nB mean 32.0 | range 44.0 | IQR 24.0 | variance (n-1) 314.0 | sd 17.72\ndivide by n: 8.0 | divide by n-1: 10.0\ntrue variance 100.0 | average of n-formula on samples of 5: 80.6 | n-1 formula: 100.4\nsd in minutes 3.16 | in hours 0.0527"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "A centre without a spread is half a description."
     }
    ]
   }
  ]
 },
 {
  "title": "Shapes of data: skew, percentiles and logs",
  "minutes": 13,
  "sections": [
   {
    "id": "st4-observe",
    "kicker": "1 · Observe",
    "title": "Incomes do not look like a bell",
    "blocks": [
     {
      "kind": "p",
      "text": "Plot household incomes and you do not get a symmetric hill. You get a tall mass of ordinary incomes and a long thin tail of very high ones. Many quantities in the real world, from incomes to waiting times, look like this."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we describe and tame a skewed column before a model sees it?"
     }
    ]
   },
   {
    "id": "st4-express",
    "kicker": "2 · Express",
    "title": "Skew, percentiles, transforms",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "right skew ⇒ mean > median",
       "p-th percentile = value below which p percent of the data lies",
       "taking logs pulls in a long right tail"
      ],
      "note": "A percentile answers 'where does this value rank?', which is robust and easy to explain."
     }
    ]
   },
   {
    "id": "st4-visualize",
    "kicker": "3 · Visualize",
    "title": "A simulated income column",
    "blocks": [
     {
      "kind": "p",
      "text": "5,000 simulated monthly incomes with a long right tail: mean ₹37,414 and median ₹29,107."
     },
     {
      "kind": "table",
      "caption": "Histogram in six equal bins",
      "headers": [
       "Bin (₹)",
       "Count"
      ],
      "rows": [
       [
        "2,292 – 86,992",
        "4,699"
       ],
       [
        "86,992 – 1,71,691",
        "273"
       ],
       [
        "1,71,691 – 2,56,391",
        "24"
       ],
       [
        "2,56,391 – 3,41,090",
        "3"
       ],
       [
        "3,41,090 – 4,25,790",
        "0"
       ],
       [
        "4,25,790 – 5,10,489",
        "1"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "94 percent of people fall in the first bin and a single extreme value stretches the axis. Percentiles tell a clearer story: 10th at ₹12,057, median ₹29,107, 90th ₹71,200, 99th ₹1,49,709."
     }
    ]
   },
   {
    "id": "st4-discover",
    "kicker": "4 · Discover",
    "title": "The log makes it symmetric",
    "blocks": [
     {
      "kind": "p",
      "text": "After taking logs, the mean is 10.29, the median 10.28, and the spread 0.70. 67.9 percent of values lie within one standard deviation, close to the 68 percent a bell curve gives. Many models work better on a roughly symmetric column."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Skewed data has a long tail, percentiles describe it fairly, and a log transform often makes it symmetric."
     }
    ]
   },
   {
    "id": "st4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, ranking. A household earning ₹71,200 is at the 90th percentile: 9 in 10 households earn less. That is a clearer statement than 'about twice the average'."
     },
     {
      "kind": "p",
      "text": "Example 2, a log difference. Log income differs by 0.7 for one standard deviation, which corresponds to multiplying income by e^0.7 ≈ 2.0. On the log scale, a double is the same step anywhere."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Prices, counts and times are often skewed. Models trained on logs treat relative errors equally and are less swayed by extremes."
     },
     {
      "kind": "check",
      "question": "The mean is far above the median. What is the data likely to look like?",
      "options": [
       "Left skewed",
       "Right skewed with a long upper tail",
       "Perfectly symmetric"
      ],
      "answer": 1,
      "why": "A mean above the median means a few large values pull the mean up: a right skew."
     }
    ]
   },
   {
    "id": "st4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Assuming a bell curve",
      "text": "Check the shape before using rules that need normality."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Logging zeros",
      "text": "Log of 0 is undefined. Add a small constant or use another transform."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Hiding the tail",
      "text": "Capping extremes changes the question. Say what you did."
     }
    ]
   },
   {
    "id": "st4-python",
    "kicker": "7 · In Python",
    "title": "Shape in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Histogram, percentiles and a log transform",
      "code": "import numpy as np\n\nrng = np.random.default_rng(7)\nincome = rng.lognormal(mean=10.3, sigma=0.7, size=5000)         # rupees per month, right-skewed\nprint(\"mean\", round(float(income.mean())), \"| median\", round(float(np.median(income))), \"| skewness sign:\", \"right-skewed\" if income.mean() > np.median(income) else \"left\")\n\ncounts, edges = np.histogram(income, bins=6)\nfor c, lo, hi in zip(counts, edges[:-1], edges[1:]):\n    print(f\"{lo:9.0f} - {hi:9.0f} : {c}\")\n\npcts = np.percentile(income, [10, 50, 90, 99])\nprint(\"10th, 50th, 90th, 99th percentile:\", np.round(pcts).astype(int))\n\nlogged = np.log(income)\nprint(\"after log: mean\", round(float(logged.mean()), 2), \"median\", round(float(np.median(logged)), 2), \"sd\", round(float(logged.std()), 2))\nwithin = ((logged > logged.mean() - logged.std()) & (logged < logged.mean() + logged.std())).mean()\nprint(\"share within one sd on the log scale:\", round(float(within), 3))",
      "output": "mean 37414 | median 29107 | skewness sign: right-skewed\n     2292 -     86992 : 4699\n    86992 -    171691 : 273\n   171691 -    256391 : 24\n   256391 -    341090 : 3\n   341090 -    425790 : 0\n   425790 -    510489 : 1\n10th, 50th, 90th, 99th percentile: [ 12057  29107  71200 149709]\nafter log: mean 10.29 median 10.28 sd 0.7\nshare within one sd on the log scale: 0.679"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Look at the shape before choosing a summary or a model."
     }
    ]
   }
  ]
 },
 {
  "title": "Relationships without causal shortcuts",
  "minutes": 14,
  "sections": [
   {
    "id": "st5-observe",
    "kicker": "1 · Observe",
    "title": "AC sales and ice cream sales rise together",
    "blocks": [
     {
      "kind": "p",
      "text": "A shop owner notices that on days when air-conditioner sales are high, ice cream sales are high too. Should he stock ice cream whenever he sells ACs? Before building a story about one causing the other, ask what else moves them both."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we measure a relationship, and what does it not tell us?"
     }
    ]
   },
   {
    "id": "st5-express",
    "kicker": "2 · Express",
    "title": "Correlation",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "r = average of (z-score of x) × (z-score of y)",
       "−1 ≤ r ≤ 1"
      ],
      "note": "r near 1 means the two rise together along a line, near −1 means one rises as the other falls, near 0 means no straight-line pattern."
     }
    ]
   },
   {
    "id": "st5-visualize",
    "kicker": "3 · Visualize",
    "title": "A hidden driver",
    "blocks": [
     {
      "kind": "table",
      "caption": "Simulated year of daily data (365 days)",
      "headers": [
       "Pair",
       "r"
      ],
      "rows": [
       [
        "Temperature and AC sales",
        "0.89"
       ],
       [
        "AC sales and ice cream sales",
        "0.70"
       ],
       [
        "The same pair after removing temperature's effect",
        "−0.07"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "AC and ice cream correlate at 0.70 only because both follow temperature. Remove temperature and the link disappears (−0.07). Temperature is a confounder."
     }
    ]
   },
   {
    "id": "st5-discover",
    "kicker": "4 · Discover",
    "title": "Correlation can also be a fluke or miss a curve",
    "blocks": [
     {
      "kind": "p",
      "text": "Thirty unrelated points gave r = −0.33 by chance. Adding one extreme point flipped it to 0.63. And y = u² on a symmetric range gives r = 0.00 even though y is perfectly determined by u: correlation measures straight-line association only."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Correlation measures straight-line association, which is not causation and can be produced or hidden by outliers, curves and confounders."
     }
    ]
   },
   {
    "id": "st5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a decision. If the shop owner wants to boost ice cream sales, promoting ACs will not help. Temperature drives both. A weather forecast is the useful signal."
     },
     {
      "kind": "p",
      "text": "Example 2, a feature. A column that correlates 0.9 with churn may be a symptom, such as 'called to cancel', that exists only after the decision is made. It will not be available when you need the prediction."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Feature selection by correlation misses curved effects and picks up confounded ones. Causal claims need experiments."
     },
     {
      "kind": "check",
      "question": "Two variables have r = 0.0. Can you conclude they are unrelated?",
      "options": [
       "Yes",
       "No, they could have a curved relationship",
       "Yes, if n is large"
      ],
      "answer": 1,
      "why": "A curve like y = x² can give r = 0 with a perfect relationship."
     }
    ]
   },
   {
    "id": "st5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading correlation as cause",
      "text": "A third variable can drive both."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Trusting a small sample",
      "text": "Thirty points can produce r = −0.33 from pure noise."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Ignoring outliers",
      "text": "One extreme point moved r from −0.33 to 0.63."
     }
    ]
   },
   {
    "id": "st5-python",
    "kicker": "7 · In Python",
    "title": "Correlation traps in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "A confounder, a fluke and a curve",
      "code": "import numpy as np\n\nrng = np.random.default_rng(11)\nn = 365\ntemp = rng.normal(30, 6, n)                                   # daily temperature\nac_sales = 4 * temp + rng.normal(0, 12, n)\nice_cream = 3 * temp + rng.normal(0, 12, n)\nr = lambda x, y: float(np.corrcoef(x, y)[0, 1])\nprint(\"temperature vs AC sales      r =\", round(r(temp, ac_sales), 2))\nprint(\"AC sales vs ice cream sales  r =\", round(r(ac_sales, ice_cream), 2), \"<- neither causes the other\")\n# remove the shared driver: correlate what is left after accounting for temperature\nres = lambda y: y - np.polyval(np.polyfit(temp, y, 1), temp)\nprint(\"after removing temperature   r =\", round(r(res(ac_sales), res(ice_cream)), 2))\n\n# one outlier can manufacture a correlation\nx = rng.normal(0, 1, 30); y = rng.normal(0, 1, 30)\nprint(\"30 unrelated points          r =\", round(r(x, y), 2))\nx2, y2 = np.append(x, 8), np.append(y, 8)\nprint(\"add one extreme point        r =\", round(r(x2, y2), 2))\n\n# a curve has near-zero correlation but a perfect relationship\nu = np.linspace(-3, 3, 61)\nprint(\"y = u^2                      r =\", round(r(u, u ** 2), 2))",
      "output": "temperature vs AC sales      r = 0.89\nAC sales vs ice cream sales  r = 0.7 <- neither causes the other\nafter removing temperature   r = -0.07\n30 unrelated points          r = -0.33\nadd one extreme point        r = 0.63\ny = u^2                      r = 0.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Plot the data, ask what else could drive both, and treat correlation as a clue, not a verdict."
     }
    ]
   }
  ]
 },
 {
  "title": "Samples, uncertainty and how sure we can be",
  "minutes": 14,
  "sections": [
   {
    "id": "st6-observe",
    "kicker": "1 · Observe",
    "title": "You cannot ask everyone",
    "blocks": [
     {
      "kind": "p",
      "text": "A food app wants the average delivery time across all its orders. It checks 200 orders. The sample average will not match the true average exactly. How far off might it be, and what would make the sample misleading even if it were huge?"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How does a sample reflect a population, and how do we state our uncertainty?"
     }
    ]
   },
   {
    "id": "st6-express",
    "kicker": "2 · Express",
    "title": "Sampling distribution and standard error",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "standard error = standard deviation ÷ √n",
       "95% interval ≈ sample mean ± 1.96 × standard error"
      ],
      "note": "The standard error is how much a sample mean wobbles from sample to sample. It shrinks with the square root of n."
     }
    ]
   },
   {
    "id": "st6-visualize",
    "kicker": "3 · Visualize",
    "title": "Sample means settle down",
    "blocks": [
     {
      "kind": "p",
      "text": "A skewed population of delivery times with mean 20.01 minutes. Draw many samples of each size."
     },
     {
      "kind": "table",
      "caption": "Spread of the sample means",
      "headers": [
       "Sample size n",
       "Spread of sample means",
       "Formula sd ÷ √n"
      ],
      "rows": [
       [
        "10",
        "4.52",
        "4.46"
       ],
       [
        "100",
        "1.41",
        "1.41"
       ],
       [
        "1,000",
        "0.44",
        "0.45"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Samples are 100 times bigger from 10 to 1,000, but the error shrinks only 10 times. The formula matches what we simulated."
     }
    ]
   },
   {
    "id": "st6-discover",
    "kicker": "4 · Discover",
    "title": "An interval, and what it covers",
    "blocks": [
     {
      "kind": "p",
      "text": "One sample of 200 gave a mean of 18.04 and a 95% interval of 16.35 to 19.73. The true mean, 20.01, lies outside it: this is one of the roughly 1 in 20 samples the method is expected to miss. Over 2,000 repeats, 93.9 percent of intervals contained the true mean, close to the promised 95 percent."
     },
     {
      "kind": "p",
      "text": "A biased sample is different. Sampling only from the fastest half of deliveries gave a mean of 9.5 minutes. More data would only make us surer of the wrong number."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A sample statistic wobbles by about the standard error, and a 95 percent interval is a procedure that covers the truth about 95 percent of the time. Bias is a separate problem that size cannot fix."
     }
    ]
   },
   {
    "id": "st6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, how big a sample. To halve the standard error you need four times as many orders. With a population spread near 14 minutes, the standard error is about 1.0 minute at n = 200 and 0.5 at n = 800."
     },
     {
      "kind": "p",
      "text": "Example 2, selection. A feedback survey in the app is answered by people who had an extreme experience. Its average satisfaction is not the average of all customers."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Test-set scores are samples. A test accuracy of 0.80 on 100 rows has an interval of roughly ±8 points."
     },
     {
      "kind": "check",
      "question": "To halve the standard error of a mean, the sample size must...",
      "options": [
       "Double",
       "Quadruple",
       "Stay the same"
      ],
      "answer": 1,
      "why": "The standard error shrinks with √n. Halving it needs four times the data."
     }
    ]
   },
   {
    "id": "st6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Confusing size with quality",
      "text": "A huge biased sample gives a precise wrong answer."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading an interval as 'the truth is in here with 95 percent probability'",
      "text": "It describes the procedure's long-run coverage."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Ignoring dependence",
      "text": "Repeated rows from the same customer are not independent samples."
     }
    ]
   },
   {
    "id": "st6-python",
    "kicker": "7 · In Python",
    "title": "Sampling in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Sample means, an interval, coverage and a biased sample",
      "code": "import numpy as np\n\nrng = np.random.default_rng(4)\npopulation = rng.gamma(shape=2.0, scale=10.0, size=200_000)      # skewed delivery times, minutes\nprint(\"population mean:\", round(float(population.mean()), 2))\n\nfor n in (10, 100, 1000):\n    means = np.array([rng.choice(population, n).mean() for _ in range(3000)])\n    print(\"n\", str(n).rjust(4), \"| mean of sample means\", round(float(means.mean()), 2), \"| spread of sample means\", round(float(means.std()), 2),\n          \"| formula sd/sqrt(n)\", round(float(population.std() / np.sqrt(n)), 2))\n\n# one sample and a 95 percent interval\nsample = rng.choice(population, 200)\nse = sample.std(ddof=1) / np.sqrt(len(sample))\nprint(\"one sample of 200: mean\", round(float(sample.mean()), 2), \"| 95% interval\", round(float(sample.mean() - 1.96 * se), 2), \"to\", round(float(sample.mean() + 1.96 * se), 2))\n\ncover = 0\nfor _ in range(2000):\n    s = rng.choice(population, 200); e = s.std(ddof=1) / np.sqrt(200)\n    cover += (s.mean() - 1.96 * e < population.mean() < s.mean() + 1.96 * e)\nprint(\"intervals that contained the true mean:\", cover / 2000)\n\n# a biased sample: only people who answered the app, who are the faster deliveries\nbiased = np.sort(population)[:100_000]\nprint(\"sample from the fastest half: mean\", round(float(rng.choice(biased, 5000).mean()), 2), \"| no amount of data fixes that\")",
      "output": "population mean: 20.01\nn   10 | mean of sample means 20.01 | spread of sample means 4.52 | formula sd/sqrt(n) 4.46\nn  100 | mean of sample means 20.0 | spread of sample means 1.41 | formula sd/sqrt(n) 1.41\nn 1000 | mean of sample means 20.01 | spread of sample means 0.44 | formula sd/sqrt(n) 0.45\none sample of 200: mean 18.04 | 95% interval 16.35 to 19.73\nintervals that contained the true mean: 0.939\nsample from the fastest half: mean 9.5 | no amount of data fixes that"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Report an estimate with its uncertainty, and ask how the sample was chosen."
     }
    ]
   }
  ]
 },
 {
  "title": "Statistics inside machine learning",
  "minutes": 13,
  "sections": [
   {
    "id": "st7-observe",
    "kicker": "1 · Observe",
    "title": "Every ML step is a statistical step",
    "blocks": [
     {
      "kind": "p",
      "text": "Splitting data, scaling features and scoring a model all rest on statistics. Done carelessly, each one quietly changes what your results mean."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Which statistical habits make a machine-learning result trustworthy?"
     }
    ]
   },
   {
    "id": "st7-express",
    "kicker": "2 · Express",
    "title": "Splits, strata and scalers",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "test score = a sample of future performance",
       "stratify to keep class shares equal in each part",
       "scale with training mean and spread only"
      ],
      "note": "A rare class can vanish from a small random test set."
     }
    ]
   },
   {
    "id": "st7-visualize",
    "kicker": "3 · Visualize",
    "title": "A rare class and a small test set",
    "blocks": [
     {
      "kind": "p",
      "text": "1,000 customers, 39 positives (about 4 percent). Take a random 10 percent test set of 100 rows: in 6 of 200 random splits it contains no positives at all, and the model cannot be scored on them. A stratified split guarantees 4 of 100."
     },
     {
      "kind": "table",
      "caption": "Test set positives, 100 rows",
      "headers": [
       "Method",
       "Result"
      ],
      "rows": [
       [
        "Random split, 200 tries",
        "0 positives in 6 tries"
       ],
       [
        "Stratified split",
        "4 positives"
       ]
      ]
     }
    ]
   },
   {
    "id": "st7-discover",
    "kicker": "4 · Discover",
    "title": "Scaling without leaking",
    "blocks": [
     {
      "kind": "p",
      "text": "Three columns on very different scales are standardised using the training rows only. Training columns average exactly 0 after scaling. The test columns average 0.15, −0.02 and −0.01, close but not zero, and that is honest. It is what new data looks like against a rule learned elsewhere."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Treat splits, scalers and scores as statistical estimates with sampling error, and keep test data out of every fitting step."
     }
    ]
   },
   {
    "id": "st7-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, an interval for accuracy. A model gets 80 of 100 test rows right. The standard error is √(0.8 × 0.2 ÷ 100) = 0.04, so a 95 percent interval is about 0.72 to 0.88."
     },
     {
      "kind": "p",
      "text": "Example 2, a leak. Computing the mean of the whole dataset to impute missing bills puts test information into training. Compute it from training rows."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Cross-validation, bootstrap intervals and calibration checks are all applications of the ideas in this module."
     },
     {
      "kind": "check",
      "question": "A test set of 100 has 2 positives. What is the main problem?",
      "options": [
       "Too many features",
       "Any metric on positives is very noisy",
       "The model is too simple"
      ],
      "answer": 1,
      "why": "Two positives give an extremely uncertain recall. Use a larger or stratified test set."
     }
    ]
   },
   {
    "id": "st7-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Random splits on rare classes",
      "text": "Stratify so the class appears in both parts."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Fitting preprocessing on all rows",
      "text": "Use a pipeline fitted on training data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Reporting one test score as exact",
      "text": "Add an interval."
     }
    ]
   },
   {
    "id": "st7-python",
    "kicker": "7 · In Python",
    "title": "Splits and scaling in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Stratified splits and train-only scaling",
      "code": "import numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nrng = np.random.default_rng(2)\nn = 1000\ny = (rng.random(n) < 0.05).astype(int)                      # 5 percent positives\nX = rng.normal(size=(n, 3))\nprint(\"positives overall:\", int(y.sum()))\nbad = 0\nfor seed in range(200):\n    _, _, ytr, yte = train_test_split(X, y, test_size=0.1, random_state=seed)\n    bad += (yte.sum() == 0)\nprint(\"random splits with no positives in a 100-row test set:\", bad, \"of 200\")\n_, _, ytr, yte = train_test_split(X, y, test_size=0.1, random_state=0, stratify=y)\nprint(\"stratified test set positives:\", int(yte.sum()), \"of\", len(yte))\n\n# standardising: mean and spread from training rows only\nXtr, Xte = X[:800] * [1, 10, 100] + [0, 50, 5000], X[800:] * [1, 10, 100] + [0, 50, 5000]\nsc = StandardScaler().fit(Xtr)\nprint(\"train column means after scaling:\", np.round(sc.transform(Xtr).mean(0), 2) + 0.0)\nprint(\"test column means after scaling :\", np.round(sc.transform(Xte).mean(0), 2) + 0.0, \"<- close to 0, not exactly, and that is honest\")",
      "output": "positives overall: 39\nrandom splits with no positives in a 100-row test set: 6 of 200\nstratified test set positives: 4 of 100\ntrain column means after scaling: [0. 0. 0.]\ntest column means after scaling : [ 0.15 -0.02 -0.01] <- close to 0, not exactly, and that is honest"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Every number you report is an estimate. Say how uncertain it is."
     }
    ]
   }
  ]
 }
];
