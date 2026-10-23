import type {DeepLesson} from "../../math/teaching/deep-read";
export const VISUALIZATION_DEEP:DeepLesson[]=[
 {
  "title": "Figures, axes and readable measurement",
  "minutes": 11,
  "sections": [
   {
    "id": "pv1-observe",
    "kicker": "1 · Observe",
    "title": "A chart is a measurement",
    "blocks": [
     {
      "kind": "p",
      "text": "A scatter plot of six flats is a measurement device: each axis has units, a range and a label. Without labels the reader cannot tell sq m from ₹ lakh. Matplotlib lets you inspect these properties as numbers, which is how we check a figure without looking at it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What makes a figure readable, and how do we verify one in code?"
     }
    ]
   },
   {
    "id": "pv1-express",
    "kicker": "2 · Express",
    "title": "Figure, axes, labels",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "fig, ax = plt.subplots(figsize=(6, 4))",
       "ax.set_xlabel('Area (sq m)')  ax.set_ylabel('Price (₹ lakh)')",
       "ax.set_title(...)   ax.set_xlim / set_ylim"
      ],
      "note": "A figure holds axes. Axes hold the data, labels and limits."
     }
    ]
   },
   {
    "id": "pv1-visualize",
    "kicker": "3 · Visualize",
    "title": "Reading the figure's properties",
    "blocks": [
     {
      "kind": "table",
      "caption": "Scatter of six flats",
      "headers": [
       "Property",
       "Value"
      ],
      "rows": [
       [
        "figure size",
        "6.0 × 4.0 inches"
       ],
       [
        "axes count",
        "1"
       ],
       [
        "x label / y label",
        "Area (sq m) / Price (₹ lakh)"
       ],
       [
        "points plotted",
        "6"
       ],
       [
        "x limits (auto)",
        "36.0 to 124.0"
       ],
       [
        "y limits after set_ylim(0, 100)",
        "0.0 to 100.0"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The automatic x limits add a margin around 40–120. Setting a y limit is a choice, so make it a deliberate one."
     }
    ]
   },
   {
    "id": "pv1-discover",
    "kicker": "4 · Discover",
    "title": "Units and honesty",
    "blocks": [
     {
      "kind": "p",
      "text": "Always put units in labels and a claim in the title. Use the Agg backend on a server; it draws to memory instead of a window."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A readable figure labels its units and states its point, and you can check both in code."
     }
    ]
   },
   {
    "id": "pv1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, labels. 'Price (₹ lakh)' tells the reader the unit; 'price' does not."
     },
     {
      "kind": "p",
      "text": "Example 2, limits. Forcing y to 0–100 adds empty space above the data (the highest price is 90); the automatic x range of 36–124 hugs the points with a small margin."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Training curves, confusion matrices and feature plots all depend on labelled axes."
     },
     {
      "kind": "check",
      "question": "Which backend draws without a screen?",
      "options": [
       "Agg",
       "TkAgg",
       "Qt5Agg"
      ],
      "answer": 0,
      "why": "Agg renders to an image buffer."
     }
    ]
   },
   {
    "id": "pv1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Missing units",
      "text": "Readers guess the scale."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Unlabelled axes",
      "text": "The chart cannot be understood alone."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Arbitrary limits",
      "text": "They change the story."
     }
    ]
   },
   {
    "id": "pv1-python",
    "kicker": "7 · In Python",
    "title": "Figures in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Make a scatter and print its properties",
      "code": "import matplotlib\nmatplotlib.use(\"Agg\")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\narea = np.array([40, 55, 80, 120, 65, 95])\nprice = np.array([30, 41, 55, 90, 47, 70])\nfig, ax = plt.subplots(figsize=(6, 4))\nax.scatter(area, price)\nax.set_xlabel(\"Area (sq m)\")\nax.set_ylabel(\"Price (₹ lakh)\")\nax.set_title(\"Price rises with area\")\nprint(\"figure size (inches):\", tuple(float(v) for v in fig.get_size_inches()))\nprint(\"axes count:\", len(fig.axes))\nprint(\"x label:\", ax.get_xlabel(), \"| y label:\", ax.get_ylabel())\nprint(\"title:\", ax.get_title())\nprint(\"points plotted:\", len(ax.collections[0].get_offsets()))\nprint(\"x limits:\", tuple(round(float(v), 1) for v in ax.get_xlim()))\nax.set_ylim(0, 100)\nprint(\"y limits after set_ylim:\", tuple(float(v) for v in ax.get_ylim()))\nplt.close(fig)",
      "output": "figure size (inches): (6.0, 4.0)\naxes count: 1\nx label: Area (sq m) | y label: Price (₹ lakh)\ntitle: Price rises with area\npoints plotted: 6\nx limits: (36.0, 124.0)\ny limits after set_ylim: (0.0, 100.0)"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Label units, then verify the figure in code."
     }
    ]
   }
  ]
 },
 {
  "title": "Histograms show distributions, not individual paths",
  "minutes": 12,
  "sections": [
   {
    "id": "pv2-observe",
    "kicker": "1 · Observe",
    "title": "1,000 prices in ten buckets",
    "blocks": [
     {
      "kind": "p",
      "text": "A histogram counts how many values fall into each range. It forgets which flat was which: shuffle the rows and the histogram is identical. It shows the shape of the data, not its story."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does a histogram reveal, and how much does the bin count change the picture?"
     }
    ]
   },
   {
    "id": "pv2-express",
    "kicker": "2 · Express",
    "title": "Bins",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "counts, edges = np.histogram(x, bins=10)",
       "bin width = (max − min) / bins",
       "total counted = number of values"
      ],
      "note": "Too few bins hide structure. Too many bins show noise."
     }
    ]
   },
   {
    "id": "pv2-visualize",
    "kicker": "3 · Visualize",
    "title": "A thousand simulated prices",
    "blocks": [
     {
      "kind": "table",
      "caption": "Prices, mean 55 and spread 15",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "bins / total counted",
        "10 / 1000"
       ],
       [
        "counts",
        "2, 7, 22, 102, 219, 277, 219, 111, 34, 7"
       ],
       [
        "tallest bar with 10 bins",
        "277"
       ],
       [
        "tallest bar with 40 bins",
        "77"
       ],
       [
        "mean / median",
        "54.3 / 53.9"
       ],
       [
        "after shuffling rows",
        "same histogram: True"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The shape is a symmetric hill. Mean and median nearly agree, which is what a symmetric distribution gives."
     }
    ]
   },
   {
    "id": "pv2-discover",
    "kicker": "4 · Discover",
    "title": "Choose bins honestly",
    "blocks": [
     {
      "kind": "p",
      "text": "Bars of 277 and 77 describe the same data. Compare a few bin counts before trusting a feature. A histogram of residuals, features and predictions is a standard check."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A histogram shows shape and spread, depends on the bin count, and cannot show order or relationships."
     }
    ]
   },
   {
    "id": "pv2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, skew. If mean is far above median, the right tail is long. Here 54.3 and 53.9 show symmetry."
     },
     {
      "kind": "p",
      "text": "Example 2, bin choice. 10 bins give a smooth hill. 40 bins give narrower bars with the same total of 1,000."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Histograms of features reveal skew, outliers and impossible values before modelling."
     },
     {
      "kind": "check",
      "question": "If you shuffle the rows, the histogram...",
      "options": [
       "Changes",
       "Stays the same",
       "Flips"
      ],
      "answer": 1,
      "why": "Order does not affect counts per bin."
     }
    ]
   },
   {
    "id": "pv2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · One bin count only",
      "text": "Structure can be hidden or invented."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading order into a histogram",
      "text": "It holds no order."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Mixed groups in one histogram",
      "text": "Plot separate histograms by group."
     }
    ]
   },
   {
    "id": "pv2-python",
    "kicker": "7 · In Python",
    "title": "Histograms in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Count bins, change the bin count, and test order invariance",
      "code": "import matplotlib\nmatplotlib.use(\"Agg\")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(0)\nprice = rng.normal(55, 15, 1000)\nfig, ax = plt.subplots()\ncounts, edges, _ = ax.hist(price, bins=10)\nprint(\"bins:\", len(counts), \"| total counted:\", int(counts.sum()))\nprint(\"counts:\", counts.astype(int).tolist())\nprint(\"first edges:\", edges[:3].round(1).tolist())\nfig2, ax2 = plt.subplots()\nc2, e2, _ = ax2.hist(price, bins=40)\nprint(\"with 40 bins, tallest bar:\", int(c2.max()), \"vs 10 bins:\", int(counts.max()))\nprint(\"mean, median:\", round(float(price.mean()), 1), round(float(np.median(price)), 1))\n\n# a histogram is a distribution, not a path\nshuffled = rng.permutation(price)\nc3, _ = np.histogram(shuffled, bins=edges)\nprint(\"same histogram after shuffling the rows:\", bool((c3 == counts).all()))\nplt.close(\"all\")",
      "output": "bins: 10 | total counted: 1000\ncounts: [2, 7, 22, 102, 219, 277, 219, 111, 34, 7]\nfirst edges: [-3.5, 7.0, 17.4]\nwith 40 bins, tallest bar: 77 vs 10 bins: 277\nmean, median: 54.3 53.9\nsame histogram after shuffling the rows: True"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Try more than one bin count."
     }
    ]
   }
  ]
 },
 {
  "title": "Scatterplots, relationships and causal caution",
  "minutes": 12,
  "sections": [
   {
    "id": "pv3-observe",
    "kicker": "1 · Observe",
    "title": "Strong correlation, still no cause",
    "blocks": [
     {
      "kind": "p",
      "text": "Area and price in 200 simulated flats correlate at 0.905. That says they move together. It does not say adding a room raises the price; a good locality may drive both."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What does correlation measure, and what can fool it?"
     }
    ]
   },
   {
    "id": "pv3-express",
    "kicker": "2 · Express",
    "title": "Correlation",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "r = correlation between −1 and 1",
       "slope, intercept = np.polyfit(x, y, 1)",
       "r measures linear association only"
      ],
      "note": "A scatter plot shows what r cannot."
     }
    ]
   },
   {
    "id": "pv3-visualize",
    "kicker": "3 · Visualize",
    "title": "Three checks",
    "blocks": [
     {
      "kind": "table",
      "caption": "200 flats, plus two traps",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "correlation",
        "0.905"
       ],
       [
        "points",
        "200"
       ],
       [
        "fitted line",
        "slope 0.81, intercept −0.81"
       ],
       [
        "add one odd flat (300 sq m, ₹10 lakh)",
        "correlation falls to 0.589"
       ],
       [
        "x and x²",
        "0.0 despite a perfect relationship"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "One odd flat dropped r from 0.905 to 0.589. And r = 0 for x versus x² shows that a perfect curve can have no linear correlation."
     }
    ]
   },
   {
    "id": "pv3-discover",
    "kicker": "4 · Discover",
    "title": "Plot, then summarise",
    "blocks": [
     {
      "kind": "p",
      "text": "Always plot before quoting r. The line says that each extra sq m goes with about ₹0.81 lakh, within this data, not as a rule for any single flat."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A scatter plot shows relationship, outliers and curves; correlation is only one number and says nothing about cause."
     }
    ]
   },
   {
    "id": "pv3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a single point. One strange flat changed r by 0.32, more than enough to flip a conclusion."
     },
     {
      "kind": "p",
      "text": "Example 2, a curve. x and x² has r = 0.0, so only the plot would have shown the relation."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Feature selection by correlation misses non-linear relationships."
     },
     {
      "kind": "check",
      "question": "r = 0 means...",
      "options": [
       "No relationship at all",
       "No linear relationship",
       "A perfect fit"
      ],
      "answer": 1,
      "why": "Curved relationships can have r = 0."
     }
    ]
   },
   {
    "id": "pv3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reading cause from correlation",
      "text": "A third factor may drive both."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Quoting r without a plot",
      "text": "Outliers and curves go unseen."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Extrapolating the line",
      "text": "Outside the data it may fail."
     }
    ]
   },
   {
    "id": "pv3-python",
    "kicker": "7 · In Python",
    "title": "Scatterplots in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Correlation, a fitted line, an outlier and a curve",
      "code": "import matplotlib\nmatplotlib.use(\"Agg\")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(3)\nn = 200\narea = rng.normal(75, 20, n)\nprice = 0.8 * area + rng.normal(0, 8, n)\nr = np.corrcoef(area, price)[0, 1]\nprint(\"correlation:\", round(float(r), 3))\nfig, ax = plt.subplots()\nax.scatter(area, price, alpha=0.5)\nprint(\"points:\", len(ax.collections[0].get_offsets()))\nslope, intercept = np.polyfit(area, price, 1)\nprint(\"line: slope\", round(float(slope), 2), \"| intercept\", round(float(intercept), 2))\n\n# an outlier can move the correlation\narea2 = np.append(area, 300.0)\nprice2 = np.append(price, 10.0)\nprint(\"with one odd flat:\", round(float(np.corrcoef(area2, price2)[0, 1]), 3))\n\n# a zero correlation does not mean no relationship\nx = np.linspace(-3, 3, 200)\ny = x ** 2\nprint(\"corr of x and x^2:\", round(float(np.corrcoef(x, y)[0, 1]), 3) + 0.0)\nplt.close(fig)",
      "output": "correlation: 0.905\npoints: 200\nline: slope 0.81 | intercept -0.81\nwith one odd flat: 0.589\ncorr of x and x^2: 0.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Plot first, then summarise."
     }
    ]
   }
  ]
 },
 {
  "title": "Box plots summarise spread, with conventions",
  "minutes": 12,
  "sections": [
   {
    "id": "pv4-observe",
    "kicker": "1 · Observe",
    "title": "Two cities on one picture",
    "blocks": [
     {
      "kind": "p",
      "text": "A box plot compares groups compactly: the median, the middle half of the values and the points beyond the whiskers. It is excellent for comparing many groups, and it hides the shape inside the box."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What do the box and the whiskers mean, and what do they leave out?"
     }
    ]
   },
   {
    "id": "pv4-express",
    "kicker": "2 · Express",
    "title": "Anatomy",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "box = Q1 to Q3, line = median",
       "whiskers reach 1.5 × IQR beyond the box",
       "points beyond them are drawn individually"
      ],
      "note": "Conventions differ between tools, so say which one you use."
     }
    ]
   },
   {
    "id": "pv4-visualize",
    "kicker": "3 · Visualize",
    "title": "Pune and Mumbai",
    "blocks": [
     {
      "kind": "table",
      "caption": "200 flats each, Mumbai has three very large flats",
      "headers": [
       "City",
       "Median",
       "Q1",
       "Q3",
       "IQR",
       "Beyond whiskers"
      ],
      "rows": [
       [
        "Pune",
        "46.5",
        "39.0",
        "52.2",
        "13.2",
        "1"
       ],
       [
        "Mumbai",
        "74.0",
        "54.2",
        "94.3",
        "40.1",
        "3"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Mumbai's prices are both higher and far more spread out: its IQR of 40.1 is three times Pune's 13.2. The plot draws one flier for Pune and three for Mumbai, matching the computed counts."
     }
    ]
   },
   {
    "id": "pv4-discover",
    "kicker": "4 · Discover",
    "title": "What a box hides",
    "blocks": [
     {
      "kind": "p",
      "text": "Both boxes summarise 200 points each. Two quite different shapes, for example one hill and two hills, could share a box. Overlay the points or add a histogram when shape matters."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A box plot compares medians and spreads across groups quickly, but conceals the shape inside the box."
     }
    ]
   },
   {
    "id": "pv4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, spread. Median 74.0 against 46.5 is a big gap, and the spread differs even more."
     },
     {
      "kind": "p",
      "text": "Example 2, fliers. Three flats at 200+ lakh in Mumbai are drawn as separate points, so you can inspect them."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Compare a feature's distribution across classes, folds or time with side-by-side boxes."
     },
     {
      "kind": "check",
      "question": "The box in a box plot covers...",
      "options": [
       "Min to max",
       "Q1 to Q3",
       "Mean ± std"
      ],
      "answer": 1,
      "why": "The box spans the middle half of the data."
     }
    ]
   },
   {
    "id": "pv4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Different whisker rules",
      "text": "Check which convention is in use."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Hiding the sample size",
      "text": "Show n beside each box."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Believing the shape",
      "text": "Two-hump data can look the same."
     }
    ]
   },
   {
    "id": "pv4-python",
    "kicker": "7 · In Python",
    "title": "Box plots in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Draw two boxes and verify medians, IQRs and fliers",
      "code": "import matplotlib\nmatplotlib.use(\"Agg\")\nimport matplotlib.pyplot as plt\nimport numpy as np\n\nrng = np.random.default_rng(6)\npune = rng.normal(45, 10, 200)\nmumbai = rng.normal(75, 25, 200)\nmumbai[:3] = [200, 210, 220]\nfig, ax = plt.subplots()\nbp = ax.boxplot([pune, mumbai])\nprint(\"medians:\", [round(float(m.get_ydata()[0]), 1) for m in bp[\"medians\"]])\nfor name, d in [(\"Pune\", pune), (\"Mumbai\", mumbai)]:\n    q1, q3 = np.percentile(d, [25, 75])\n    iqr = q3 - q1\n    out = int(((d < q1 - 1.5 * iqr) | (d > q3 + 1.5 * iqr)).sum())\n    print(f\"{name}: Q1 {q1:.1f}, Q3 {q3:.1f}, IQR {iqr:.1f}, beyond whiskers {out}\")\nprint(\"fliers drawn per box:\", [len(f.get_ydata()) for f in bp[\"fliers\"]])\nprint(\"what a box plot hides: both boxes drawn from\", len(pune), \"and\", len(mumbai), \"points\")\nplt.close(fig)",
      "output": "medians: [46.5, 74.0]\nPune: Q1 39.0, Q3 52.2, IQR 13.2, beyond whiskers 1\nMumbai: Q1 54.2, Q3 94.3, IQR 40.1, beyond whiskers 3\nfliers drawn per box: [1, 3]\nwhat a box plot hides: both boxes drawn from 200 and 200 points"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Show n, and check the shape elsewhere."
     }
    ]
   }
  ]
 },
 {
  "title": "Choose charts and detect misleading claims",
  "minutes": 12,
  "sections": [
   {
    "id": "pv5-observe",
    "kicker": "1 · Observe",
    "title": "An 8% rise that looks like 400%",
    "blocks": [
     {
      "kind": "p",
      "text": "Sales go from 100 to 104 to 108. On a bar chart that starts at 98, the last bar is five times taller than the first. The data did not change; the axis did."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "Which chart fits which question, and how do we spot a chart that misleads?"
     }
    ]
   },
   {
    "id": "pv5-express",
    "kicker": "2 · Express",
    "title": "Match chart to question",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "distribution → histogram or box plot",
       "relationship → scatter plot",
       "comparison of amounts → bars from zero",
       "trend over time → line"
      ],
      "note": "A bar's height must represent its value, so bars start at zero."
     }
    ]
   },
   {
    "id": "pv5-visualize",
    "kicker": "3 · Visualize",
    "title": "The truncated axis",
    "blocks": [
     {
      "kind": "table",
      "caption": "Sales 100, 104, 108",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "real growth Q1 to Q3",
        "8.0%"
       ],
       [
        "honest axis (auto, bars from zero)",
        "0 to 113.4"
       ],
       [
        "truncated axis",
        "98 to 110"
       ],
       [
        "drawn height ratio, truncated",
        "5.0 times"
       ],
       [
        "drawn height ratio, zero baseline",
        "1.08 times"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "An 8% change became a fivefold visual difference. Another trap is two series that both trend upward: their correlation was 0.999, yet that says nothing about one causing the other."
     }
    ]
   },
   {
    "id": "pv5-discover",
    "kicker": "4 · Discover",
    "title": "A checklist",
    "blocks": [
     {
      "kind": "p",
      "text": "Before trusting or showing a chart, ask: does the axis start where the marks demand? Are units stated? Is the sample size shown? Could a third factor explain a link? Is the comparison fair across groups?"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "The chart should match the question, the axis should match the mark, and a visible pattern is a prompt for a question, not an answer."
     }
    ]
   },
   {
    "id": "pv5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a baseline. With the zero baseline the ratio is 1.08, the true 8% rise."
     },
     {
      "kind": "p",
      "text": "Example 2, trends. Two rising series correlate at 0.999 mostly because both rise over time."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Model dashboards, metric charts and papers all rely on plots that can mislead; verify before you trust."
     },
     {
      "kind": "check",
      "question": "Why should bar charts start at zero?",
      "options": [
       "Tradition",
       "Bar height encodes the value",
       "It looks tidier"
      ],
      "answer": 1,
      "why": "Truncating changes the visible ratio of values."
     }
    ]
   },
   {
    "id": "pv5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Truncated bars",
      "text": "They exaggerate small changes."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Dual axes",
      "text": "Any two series can be made to look related."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Trends read as causes",
      "text": "Shared time trends create high correlations."
     }
    ]
   },
   {
    "id": "pv5-python",
    "kicker": "7 · In Python",
    "title": "Misleading charts in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Compare axes, drawn ratios and trending series",
      "code": "import matplotlib\nmatplotlib.use(\"Agg\")\nimport matplotlib.pyplot as plt\n\nsales = [100, 104, 108]\nfig, (a, b) = plt.subplots(1, 2)\na.bar([\"Q1\", \"Q2\", \"Q3\"], sales)\nb.bar([\"Q1\", \"Q2\", \"Q3\"], sales)\nb.set_ylim(98, 110)\nprint(\"honest axis:\", tuple(round(float(v), 1) for v in a.get_ylim()))\nprint(\"truncated axis:\", tuple(float(v) for v in b.get_ylim()))\ngrowth = (sales[2] - sales[0]) / sales[0] * 100\nprint(\"real growth Q1 to Q3:\", round(growth, 1), \"%\")\n# bar height ratio as drawn\nlo, hi = b.get_ylim()\nprint(\"drawn height ratio, Q3 over Q1 (truncated):\", round((sales[2] - lo) / (sales[0] - lo), 1))\nprint(\"drawn height ratio, Q3 over Q1 (zero baseline):\", round(sales[2] / sales[0], 2))\n\n# a dual axis can make two unrelated series look related\nyears = list(range(2018, 2024))\ns1 = [1, 2, 3, 4, 5, 6]\ns2 = [10, 21, 29, 42, 50, 61]\nimport numpy as np\nprint(\"correlation of two trending series:\", round(float(np.corrcoef(s1, s2)[0, 1]), 3))\nplt.close(fig)",
      "output": "honest axis: (0.0, 113.4)\ntruncated axis: (98.0, 110.0)\nreal growth Q1 to Q3: 8.0 %\ndrawn height ratio, Q3 over Q1 (truncated): 5.0\ndrawn height ratio, Q3 over Q1 (zero baseline): 1.08\ncorrelation of two trending series: 0.999"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Check the axis before the story."
     }
    ]
   }
  ]
 }
];
