import type {DeepLesson} from "../../math/teaching/deep-read";
export const PANDAS_DEEP:DeepLesson[]=[
 {
  "title": "Series and DataFrames: tables whose rows have names",
  "minutes": 12,
  "sections": [
   {
    "id": "pd1-observe",
    "kicker": "1 · Observe",
    "title": "Rows that carry names",
    "blocks": [
     {
      "kind": "p",
      "text": "A NumPy array knows positions. A pandas DataFrame also knows labels: row names (the index) and column names. That lets you ask for flat f3 or the price column instead of remembering that price is column 3."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What do labels buy us, and what happens when two labelled things do not line up?"
     }
    ]
   },
   {
    "id": "pd1-express",
    "kicker": "2 · Express",
    "title": "Series, DataFrame, index",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "Series = one labelled column",
       "DataFrame = labelled columns sharing one index",
       "df.loc[label], df.iloc[position], df['col']"
      ],
      "note": "Arithmetic between pandas objects aligns on labels, not on position."
     }
    ]
   },
   {
    "id": "pd1-visualize",
    "kicker": "3 · Visualize",
    "title": "Five flats",
    "blocks": [
     {
      "kind": "table",
      "caption": "5 flats, 4 columns",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "shape",
        "(5, 4)"
       ],
       [
        "row f3 by label",
        "80 sq m, 3 bedrooms, Mumbai, ₹55 lakh"
       ],
       [
        "a + b, same labels in a different order",
        "aligned: f1 13, f2 22, f3 31"
       ],
       [
        "a + c, where c has labels f1 and f9",
        "f1 11, every other label NaN"
       ],
       [
        "price_per_sqm for f1",
        "30 / 40 = 0.750"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The aligned sum is the point: b was written in reverse order, yet f1 still met f1. A label that exists on only one side gives NaN rather than a guess."
     }
    ]
   },
   {
    "id": "pd1-discover",
    "kicker": "4 · Discover",
    "title": "Why alignment matters",
    "blocks": [
     {
      "kind": "p",
      "text": "Alignment protects you from pairing the wrong rows, but only if the index is meaningful. If you drop the labels or reset them carelessly, you lose that protection."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A DataFrame is a table whose rows and columns have names, and operations match by name."
     }
    ]
   },
   {
    "id": "pd1-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a new column. price_per_sqm = price / area gives ₹0.750 lakh per sq m for f1 and 0.688 for f3, a feature that is easy to compare across flats."
     },
     {
      "kind": "p",
      "text": "Example 2, a missing label. Adding a Series with labels f1 and f9 to one with f1..f3 returns NaN for f2, f3 and f9. Nothing was guessed."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Every ML dataset starts as a labelled table. Labels carry feature names into the model and keep X and y paired."
     },
     {
      "kind": "check",
      "question": "df.loc['f3'] selects by...",
      "options": [
       "Position",
       "Label",
       "Column number"
      ],
      "answer": 1,
      "why": "loc is label-based, iloc is position-based."
     }
    ]
   },
   {
    "id": "pd1-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Mixing loc and iloc",
      "text": "Label slices include the end, position slices do not."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Ignoring NaN from alignment",
      "text": "A NaN after addition usually means labels did not match."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Losing the index",
      "text": "Resetting it can hide a pairing error."
     }
    ]
   },
   {
    "id": "pd1-python",
    "kicker": "7 · In Python",
    "title": "Labelled data in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Build a table, select by label and position, and watch alignment",
      "code": "import pandas as pd\n\nflats = pd.DataFrame({\n    \"area_sqm\": [40, 55, 80, 120, 65],\n    \"bedrooms\": [1, 2, 3, 4, 2],\n    \"city\": [\"Pune\", \"Pune\", \"Mumbai\", \"Mumbai\", \"Pune\"],\n    \"price_lakh\": [30, 41, 55, 90, 47],\n}, index=[\"f1\", \"f2\", \"f3\", \"f4\", \"f5\"])\n\nprint(\"shape:\", flats.shape)\nprint(\"columns:\", list(flats.columns))\nprint(\"index:\", list(flats.index))\nprint(\"price Series:\")\nprint(flats[\"price_lakh\"])\nprint(\"one row by label:\", flats.loc[\"f3\"].to_dict())\nprint(\"one row by position:\", flats.iloc[2].to_dict())\n\n# arithmetic aligns on labels, not on position\na = pd.Series([10, 20, 30], index=[\"f1\", \"f2\", \"f3\"])\nb = pd.Series([1, 2, 3], index=[\"f3\", \"f2\", \"f1\"])\nprint(\"aligned sum:\", (a + b).to_dict())\nc = pd.Series([1, 2], index=[\"f1\", \"f9\"])\nprint(\"sum with a missing label:\", (a + c).to_dict())\n\nflats[\"price_per_sqm\"] = (flats[\"price_lakh\"] / flats[\"area_sqm\"]).round(3)\nprint(flats[[\"area_sqm\", \"price_lakh\", \"price_per_sqm\"]])",
      "output": "shape: (5, 4)\ncolumns: ['area_sqm', 'bedrooms', 'city', 'price_lakh']\nindex: ['f1', 'f2', 'f3', 'f4', 'f5']\nprice Series:\nf1    30\nf2    41\nf3    55\nf4    90\nf5    47\nName: price_lakh, dtype: int64\none row by label: {'area_sqm': 80, 'bedrooms': 3, 'city': 'Mumbai', 'price_lakh': 55}\none row by position: {'area_sqm': 80, 'bedrooms': 3, 'city': 'Mumbai', 'price_lakh': 55}\naligned sum: {'f1': 13, 'f2': 22, 'f3': 31}\nsum with a missing label: {'f1': 11.0, 'f2': nan, 'f3': nan, 'f9': nan}\n    area_sqm  price_lakh  price_per_sqm\nf1        40          30          0.750\nf2        55          41          0.745\nf3        80          55          0.688\nf4       120          90          0.750\nf5        65          47          0.723"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Check the index before arithmetic between two objects."
     }
    ]
   }
  ]
 },
 {
  "title": "Selecting and filtering without losing alignment",
  "minutes": 12,
  "sections": [
   {
    "id": "pd2-observe",
    "kicker": "1 · Observe",
    "title": "Keep the big flats and their prices together",
    "blocks": [
     {
      "kind": "p",
      "text": "From six flats you want those of at least 60 sq m, with their prices and cities. In pandas a filter returns rows, so every column stays attached. The danger is separating X from y and then filtering one of them."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we select rows and columns, and what survives after a filter?"
     }
    ]
   },
   {
    "id": "pd2-express",
    "kicker": "2 · Express",
    "title": "Selection tools",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "df[df['col'] >= 60]",
       "combine conditions with & and |, each in brackets",
       "df.loc['f2':'f4'] includes both ends;  df.iloc[1:4] excludes the end"
      ],
      "note": "Filtering keeps the original labels, so positions change but names do not."
     }
    ]
   },
   {
    "id": "pd2-visualize",
    "kicker": "3 · Visualize",
    "title": "Six flats",
    "blocks": [
     {
      "kind": "table",
      "caption": "6 flats in Pune and Mumbai",
      "headers": [
       "Selection",
       "Rows kept"
      ],
      "rows": [
       [
        "area ≥ 60",
        "f3, f4, f5, f6"
       ],
       [
        "Mumbai and area ≥ 60",
        "f3, f4, f6"
       ],
       [
        "loc f2:f4",
        "f2, f3, f4"
       ],
       [
        "iloc 1:4",
        "f2, f3, f4"
       ],
       [
        "f5 after the filter",
        "still ₹47 lakh, though position 0 is now f3"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Take X and y from the same filtered table and their indexes match. The check (X.index == y.index).all() came out True."
     }
    ]
   },
   {
    "id": "pd2-discover",
    "kicker": "4 · Discover",
    "title": "Copies and warnings",
    "blocks": [
     {
      "kind": "p",
      "text": "Filtering with .copy() before changing values means the original is untouched: raising Pune prices 10% in the copy turned f1 from 30 to 33.0 while the original stayed at 30. Without .copy() pandas may warn, or may edit the wrong object."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Filter rows as a whole table, keep labels, and copy before you edit."
     }
    ]
   },
   {
    "id": "pd2-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a filter. Mumbai flats of 60 sq m or more are f3, f4 and f6, three of the six rows."
     },
     {
      "kind": "p",
      "text": "Example 2, paired selection. Choosing X = big[['area_sqm']] and y = big['price_lakh'] from the same filtered table keeps the pairs correct."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Train/test splits, outlier removal and subgroup evaluation are all filters on a labelled table."
     },
     {
      "kind": "check",
      "question": "Which slice includes the end label?",
      "options": [
       "iloc[1:4]",
       "loc['f2':'f4']",
       "Both"
      ],
      "answer": 1,
      "why": "Label slices include both ends."
     }
    ]
   },
   {
    "id": "pd2-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Filtering only X or only y",
      "text": "The pairs no longer match."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Using 'and' instead of &",
      "text": "Python's and fails on Series. Use & with brackets."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Editing a slice without .copy()",
      "text": "You may change the original or get a warning."
     }
    ]
   },
   {
    "id": "pd2-python",
    "kicker": "7 · In Python",
    "title": "Selection in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Filter, slice by label and position, then edit a copy",
      "code": "import pandas as pd\n\nflats = pd.DataFrame({\n    \"area_sqm\": [40, 55, 80, 120, 65, 95],\n    \"city\": [\"Pune\", \"Pune\", \"Mumbai\", \"Mumbai\", \"Pune\", \"Mumbai\"],\n    \"price_lakh\": [30, 41, 55, 90, 47, 70],\n}, index=[\"f1\", \"f2\", \"f3\", \"f4\", \"f5\", \"f6\"])\n\nbig = flats[flats[\"area_sqm\"] >= 60]\nprint(\"big flats:\", list(big.index))\nmumbai_big = flats[(flats[\"city\"] == \"Mumbai\") & (flats[\"area_sqm\"] >= 60)]\nprint(\"Mumbai and big:\", list(mumbai_big.index))\n\n# label slicing includes both ends; position slicing excludes the end\nprint(\"loc f2:f4 ->\", list(flats.loc[\"f2\":\"f4\"].index))\nprint(\"iloc 1:4 ->\", list(flats.iloc[1:4].index))\n\n# after filtering, positions change but labels stay\nprint(\"label f5 still points at:\", int(big.loc[\"f5\", \"price_lakh\"]), \"| position 0 is now:\", big.index[0])\n\n# separate X and y from the same filtered table so rows stay paired\nX = big[[\"area_sqm\"]]\ny = big[\"price_lakh\"]\nprint(\"aligned:\", (X.index == y.index).all())\n\n# chained assignment risk: work on an explicit copy\nsub = flats[flats[\"city\"] == \"Pune\"].copy()\nsub[\"price_lakh\"] = sub[\"price_lakh\"] * 1.1\nprint(\"original untouched:\", flats.loc[\"f1\", \"price_lakh\"], \"| copy:\", round(float(sub.loc[\"f1\", \"price_lakh\"]), 1))",
      "output": "big flats: ['f3', 'f4', 'f5', 'f6']\nMumbai and big: ['f3', 'f4', 'f6']\nloc f2:f4 -> ['f2', 'f3', 'f4']\niloc 1:4 -> ['f2', 'f3', 'f4']\nlabel f5 still points at: 47 | position 0 is now: f3\naligned: True\noriginal untouched: 30 | copy: 33.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Select from one table, and copy before editing."
     }
    ]
   }
  ]
 },
 {
  "title": "Missing values need a stated policy",
  "minutes": 12,
  "sections": [
   {
    "id": "pd3-observe",
    "kicker": "1 · Observe",
    "title": "Half the rows have a hole",
    "blocks": [
     {
      "kind": "p",
      "text": "In a small table, 3 of 6 flats have a missing area or age. Dropping every incomplete row would throw away half the data. Filling blindly can sneak in information. Either way you are making a decision, and it should be written down."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we count missing values, what are the main policies, and where does the fill value come from?"
     }
    ]
   },
   {
    "id": "pd3-express",
    "kicker": "2 · Express",
    "title": "Policies",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "isna().sum()  counts missing values per column",
       "dropna()  removes rows;  fillna(v)  fills them",
       "add an indicator column: 1 if the value was missing"
      ],
      "note": "Compute the fill value from training rows only."
     }
    ]
   },
   {
    "id": "pd3-visualize",
    "kicker": "3 · Visualize",
    "title": "Counting and filling",
    "blocks": [
     {
      "kind": "table",
      "caption": "6 flats, area and age with gaps",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "missing in area, age, price",
        "1, 2, 0"
       ],
       [
        "rows with any missing",
        "3 of 6"
       ],
       [
        "rows kept by dropna()",
        "3"
       ],
       [
        "mean age (skipna default)",
        "7.0"
       ],
       [
        "mean age with skipna=False",
        "nan"
       ],
       [
        "median age used for filling",
        "6.5"
       ],
       [
        "train-only median (first 4 rows)",
        "5.0"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The filled values 6.5 appear for the two missing ages, with an indicator column set to 1 beside them so the model can learn that these were guesses."
     }
    ]
   },
   {
    "id": "pd3-discover",
    "kicker": "4 · Discover",
    "title": "Where the fill value comes from",
    "blocks": [
     {
      "kind": "p",
      "text": "The median of all rows is 6.5, but the median of the training rows only is 5.0. If test rows help decide the fill value, information leaks from test to train. Also remember nan == nan is False, so use isna."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Missingness is information: count it, choose a policy, keep an indicator, and fit the fill value on training data."
     }
    ]
   },
   {
    "id": "pd3-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, cost of dropping. 3 of 6 rows lose a value, so dropna keeps only 50% of the data."
     },
     {
      "kind": "p",
      "text": "Example 2, mean with NaN. pandas skips NaN by default (7.0), whereas NumPy's mean would return nan. Know which one you are calling."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Real data is rarely complete. Every pipeline needs a missing-value rule that is fitted on training data."
     },
     {
      "kind": "check",
      "question": "np.nan == np.nan gives...",
      "options": [
       "True",
       "False",
       "Error"
      ],
      "answer": 1,
      "why": "NaN is unequal to everything, itself included. Use isna()."
     }
    ]
   },
   {
    "id": "pd3-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Dropping rows silently",
      "text": "You may keep a biased half of the data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Filling with all-data statistics",
      "text": "Test information leaks into training."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · No indicator",
      "text": "The model cannot tell a real 6.5 from a guessed one."
     }
    ]
   },
   {
    "id": "pd3-python",
    "kicker": "7 · In Python",
    "title": "Missing values in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Count, drop, fill with a median and compare train-only statistics",
      "code": "import numpy as np\nimport pandas as pd\n\ndf = pd.DataFrame({\n    \"area_sqm\": [40, 55, np.nan, 120, 65, 95],\n    \"age_years\": [5, np.nan, 12, 3, np.nan, 8],\n    \"price_lakh\": [30, 41, 55, 90, 47, 70],\n})\nprint(\"missing per column:\", df.isna().sum().to_dict())\nprint(\"rows with any missing:\", int(df.isna().any(axis=1).sum()), \"of\", len(df))\nprint(\"dropna keeps\", len(df.dropna()), \"rows\")\nprint(\"mean ignores NaN by default:\", df[\"age_years\"].mean(), \"| with skipna=False:\", df[\"age_years\"].mean(skipna=False))\n\n# a policy: fill with the training median, and keep an indicator\nmed = df[\"age_years\"].median()\nfilled = df.copy()\nfilled[\"age_missing\"] = filled[\"age_years\"].isna().astype(int)\nfilled[\"age_years\"] = filled[\"age_years\"].fillna(med)\nprint(\"median used:\", med)\nprint(filled[[\"age_years\", \"age_missing\"]].T.to_string())\n\n# the filling value must come from training rows only\ntrain, test = df.iloc[:4], df.iloc[4:]\nprint(\"train median:\", train[\"age_years\"].median(), \"| full-data median:\", med)\nprint(\"comparison with NaN:\", np.nan == np.nan, \"| isna:\", bool(pd.isna(np.nan)))",
      "output": "missing per column: {'area_sqm': 1, 'age_years': 2, 'price_lakh': 0}\nrows with any missing: 3 of 6\ndropna keeps 3 rows\nmean ignores NaN by default: 7.0 | with skipna=False: nan\nmedian used: 6.5\n               0    1     2    3    4    5\nage_years    5.0  6.5  12.0  3.0  6.5  8.0\nage_missing  0.0  1.0   0.0  0.0  1.0  0.0\ntrain median: 5.0 | full-data median: 6.5\ncomparison with NaN: False | isna: True"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Write the missing-value policy down before you run it."
     }
    ]
   }
  ]
 },
 {
  "title": "Grouping, aggregating and reporting denominators",
  "minutes": 13,
  "sections": [
   {
    "id": "pd4-observe",
    "kicker": "1 · Observe",
    "title": "The average that hides the count",
    "blocks": [
     {
      "kind": "p",
      "text": "Mumbai flats average ₹71.67 lakh, Pune ₹39.33 lakh and Nagpur ₹25.00 lakh. Nagpur's sold rate is 100%. But Nagpur has one flat. A rate without its denominator can mislead badly."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we summarise by group, and what must a report always show?"
     }
    ]
   },
   {
    "id": "pd4-express",
    "kicker": "2 · Express",
    "title": "groupby",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "df.groupby('city').agg(flats=('price','size'), mean=('price','mean'))",
       "transform() returns one value per original row",
       "value_counts() gives group sizes"
      ],
      "note": "Always report the group size beside any rate or mean."
     }
    ]
   },
   {
    "id": "pd4-visualize",
    "kicker": "3 · Visualize",
    "title": "City summary",
    "blocks": [
     {
      "kind": "table",
      "caption": "7 flats in three cities",
      "headers": [
       "City",
       "Flats",
       "Mean price (₹ lakh)",
       "Sold rate"
      ],
      "rows": [
       [
        "Mumbai",
        "3",
        "71.67",
        "0.67"
       ],
       [
        "Nagpur",
        "1",
        "25.00",
        "1.00"
       ],
       [
        "Pune",
        "3",
        "39.33",
        "0.33"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The overall mean price is 51.14, while the mean of the three city means is 45.33: the second ignores group sizes, so the two differ."
     }
    ]
   },
   {
    "id": "pd4-discover",
    "kicker": "4 · Discover",
    "title": "Deviation from the group",
    "blocks": [
     {
      "kind": "p",
      "text": "transform keeps all 7 rows and lets you compute price minus city mean, for example −9.3 for the first Pune flat and +18.3 for the ₹90 lakh Mumbai flat. That is a common feature: how unusual a flat is within its city."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Group summaries need sizes, a mean of means is not the overall mean, and transform builds per-row features from group statistics."
     }
    ]
   },
   {
    "id": "pd4-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, a tiny group. Nagpur shows a 100% sold rate from a single flat. Say so, or hide groups below a minimum size."
     },
     {
      "kind": "p",
      "text": "Example 2, a group feature. Subtracting the city mean from each price gives vs_city_mean without changing the number of rows."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Subgroup performance, target encoding and per-user features are groupby results, and each needs its count."
     },
     {
      "kind": "check",
      "question": "Mean of the city means equals the overall mean when...",
      "options": [
       "Always",
       "The groups have equal size",
       "Never"
      ],
      "answer": 1,
      "why": "Equal group sizes make the two averages coincide."
     }
    ]
   },
   {
    "id": "pd4-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Reporting rates without counts",
      "text": "Small groups produce extreme rates."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Averaging averages",
      "text": "Weights are lost."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Computing group features on all data",
      "text": "For target-based features this leaks the label into training."
     }
    ]
   },
   {
    "id": "pd4-python",
    "kicker": "7 · In Python",
    "title": "Grouping in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Aggregate by city, check sizes, and add a group-relative feature",
      "code": "import pandas as pd\n\ndf = pd.DataFrame({\n    \"city\": [\"Pune\", \"Pune\", \"Mumbai\", \"Mumbai\", \"Pune\", \"Mumbai\", \"Nagpur\"],\n    \"price_lakh\": [30, 41, 55, 90, 47, 70, 25],\n    \"sold\": [1, 0, 1, 1, 0, 0, 1],\n})\ng = df.groupby(\"city\").agg(flats=(\"price_lakh\", \"size\"), mean_price=(\"price_lakh\", \"mean\"), sold_rate=(\"sold\", \"mean\"))\nprint(g.round(2))\nprint(\"overall mean price:\", round(df[\"price_lakh\"].mean(), 2))\nprint(\"mean of city means:\", round(g[\"mean_price\"].mean(), 2))\n\n# a rate without its denominator can mislead\nprint(\"Nagpur sold rate\", g.loc[\"Nagpur\", \"sold_rate\"], \"is based on\", int(g.loc[\"Nagpur\", \"flats\"]), \"flat\")\n\n# group sizes and sorted report\nprint(df[\"city\"].value_counts().to_dict())\nprint(g.sort_values(\"mean_price\", ascending=False).index.tolist())\n\n# transform keeps the original row count: price relative to the city mean\ndf[\"vs_city_mean\"] = (df[\"price_lakh\"] - df.groupby(\"city\")[\"price_lakh\"].transform(\"mean\")).round(1)\nprint(df[[\"city\", \"price_lakh\", \"vs_city_mean\"]].to_string(index=False))",
      "output": "flats  mean_price  sold_rate\ncity                                \nMumbai      3       71.67       0.67\nNagpur      1       25.00       1.00\nPune        3       39.33       0.33\noverall mean price: 51.14\nmean of city means: 45.33\nNagpur sold rate 1.0 is based on 1 flat\n{'Pune': 3, 'Mumbai': 3, 'Nagpur': 1}\n['Mumbai', 'Pune', 'Nagpur']\n  city  price_lakh  vs_city_mean\n  Pune          30          -9.3\n  Pune          41           1.7\nMumbai          55         -16.7\nMumbai          90          18.3\n  Pune          47           7.7\nMumbai          70          -1.7\nNagpur          25           0.0"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Print the group sizes next to every group statistic."
     }
    ]
   }
  ]
 },
 {
  "title": "Joins can duplicate or lose observations",
  "minutes": 13,
  "sections": [
   {
    "id": "pd5-observe",
    "kicker": "1 · Observe",
    "title": "Four flats go in, how many come out?",
    "blocks": [
     {
      "kind": "p",
      "text": "You add city rent data to a table of four flats. An inner join returns 3 rows, a left join 4, and a join to a table with a repeated key returns 6. Each of those is a different dataset, and the join looks identical in code."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "How do we combine tables and prove that no observation was lost or multiplied?"
     }
    ]
   },
   {
    "id": "pd5-express",
    "kicker": "2 · Express",
    "title": "Join types",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "inner keeps rows with a match on both sides",
       "left keeps every left row, filling NaN where no match",
       "a duplicated key on the right repeats the left row"
      ],
      "note": "Count rows before and after, and use validate= and indicator=."
     }
    ]
   },
   {
    "id": "pd5-visualize",
    "kicker": "3 · Visualize",
    "title": "Counting rows",
    "blocks": [
     {
      "kind": "table",
      "caption": "flats (4) joined to city rent data",
      "headers": [
       "Join",
       "Rows"
      ],
      "rows": [
       [
        "inner",
        "3"
       ],
       [
        "left",
        "4"
       ],
       [
        "left, duplicated Pune key on the right",
        "6"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The flat lost by the inner join is #4 in Delhi, because the city table has no Delhi row. With a left join it stays, with a NaN rent. With two Pune rows on the right, both Pune flats are repeated, so 4 flats became 6 rows."
     }
    ]
   },
   {
    "id": "pd5-discover",
    "kicker": "4 · Discover",
    "title": "Checks that catch it",
    "blocks": [
     {
      "kind": "p",
      "text": "validate='many_to_one' raised a MergeError on the duplicated key. indicator=True with an outer join counted both 3, left_only 1 and right_only 1, which shows exactly which keys had no partner."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A join is a statement about keys; check row counts and key uniqueness every time."
     }
    ]
   },
   {
    "id": "pd5-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, lost rows. An inner join silently dropped the Delhi flat. A left join with a NaN check would have exposed it."
     },
     {
      "kind": "p",
      "text": "Example 2, duplicated rows. A messy lookup table made the same flat appear twice, which would double its weight in training."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Joining labels, users and products often changes the row count. A duplicated row is a hidden reweighting."
     },
     {
      "kind": "check",
      "question": "A left join of 4 rows to a table with duplicate keys returns...",
      "options": [
       "Exactly 4 rows",
       "At least 4 rows",
       "Fewer than 4 rows"
      ],
      "answer": 1,
      "why": "Every left row is kept, and duplicates on the right add rows."
     }
    ]
   },
   {
    "id": "pd5-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Not counting rows",
      "text": "You do not notice a lost or multiplied observation."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Duplicated keys",
      "text": "Rows repeat and weights change."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Joining on text that differs",
      "text": "'pune' and 'Pune ' will not match. Clean keys first."
     }
    ]
   },
   {
    "id": "pd5-python",
    "kicker": "7 · In Python",
    "title": "Joins in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Inner, left, duplicated keys, validate and indicator",
      "code": "import pandas as pd\n\nflats = pd.DataFrame({\"flat_id\": [1, 2, 3, 4], \"city\": [\"Pune\", \"Pune\", \"Mumbai\", \"Delhi\"], \"price_lakh\": [30, 41, 55, 60]})\ncity_info = pd.DataFrame({\"city\": [\"Pune\", \"Mumbai\", \"Chennai\"], \"avg_rent_k\": [22, 45, 25]})\n\ninner = flats.merge(city_info, on=\"city\", how=\"inner\")\nleft = flats.merge(city_info, on=\"city\", how=\"left\")\nprint(\"flats:\", len(flats), \"| inner:\", len(inner), \"| left:\", len(left))\nprint(\"flats lost by inner join:\", sorted(set(flats[\"flat_id\"]) - set(inner[\"flat_id\"])))\nprint(\"Delhi rent after left join:\", left.loc[left[\"city\"] == \"Delhi\", \"avg_rent_k\"].tolist())\n\n# duplicate keys multiply rows\ndup_info = pd.DataFrame({\"city\": [\"Pune\", \"Pune\", \"Mumbai\"], \"avg_rent_k\": [22, 23, 45]})\ndup = flats.merge(dup_info, on=\"city\", how=\"left\")\nprint(\"with duplicated key rows:\", len(dup), \"(started with\", len(flats), \")\")\n\n# defensive checks\ntry:\n    flats.merge(dup_info, on=\"city\", validate=\"many_to_one\")\nexcept Exception as e:\n    print(type(e).__name__)\ncheck = flats.merge(city_info, on=\"city\", how=\"outer\", indicator=True)\nprint(check[\"_merge\"].value_counts().to_dict())",
      "output": "flats: 4 | inner: 3 | left: 4\nflats lost by inner join: [4]\nDelhi rent after left join: [nan]\nwith duplicated key rows: 6 (started with 4 )\nMergeError\n{'both': 3, 'left_only': 1, 'right_only': 1}"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "After every join, compare the row count with what you expected."
     }
    ]
   }
  ]
 },
 {
  "title": "A reproducible dataset audit",
  "minutes": 13,
  "sections": [
   {
    "id": "pd6-observe",
    "kicker": "1 · Observe",
    "title": "Look before you model",
    "blocks": [
     {
      "kind": "p",
      "text": "Before any model, a dataset deserves a one-page audit: its size, missing values, duplicates, ranges and category shares. If you write it as code with a fixed seed, anyone can reproduce it."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What should be checked first, and how do we write it so the same numbers come back?"
     }
    ]
   },
   {
    "id": "pd6-express",
    "kicker": "2 · Express",
    "title": "An audit checklist",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "shape, dtypes, missing per column",
       "duplicates: df.duplicated().sum()",
       "ranges and impossible values",
       "category shares with value_counts(normalize=True)",
       "describe() for the numeric columns"
      ],
      "note": "Fix the random seed so the audit is reproducible."
     }
    ]
   },
   {
    "id": "pd6-visualize",
    "kicker": "3 · Visualize",
    "title": "A 305-row simulated table",
    "blocks": [
     {
      "kind": "table",
      "caption": "Simulated flats, seed 7",
      "headers": [
       "Check",
       "Result"
      ],
      "rows": [
       [
        "shape",
        "(305, 3)"
       ],
       [
        "duplicate rows",
        "7"
       ],
       [
        "missing area",
        "12"
       ],
       [
        "price range (₹ lakh)",
        "8.9 to 111.2"
       ],
       [
        "city share",
        "Pune 0.50, Mumbai 0.31, Nagpur 0.18"
       ],
       [
        "rows after dedupe",
        "298"
       ],
       [
        "non-positive prices",
        "0"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "The numeric summary after dedupe shows 286 areas present, a mean of 72.0, minimum 10 and maximum 120."
     }
    ]
   },
   {
    "id": "pd6-discover",
    "kicker": "4 · Discover",
    "title": "Turn the audit into decisions",
    "blocks": [
     {
      "kind": "p",
      "text": "An audit is only useful if it leads to decisions: remove the 7 duplicate rows, decide a policy for the 12 missing areas, and check that the minimum area of 10 sq m is plausible. Keep the code, so rerunning it on next month's data shows what changed."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "An audit is a short program that states what the data looks like, so surprises show up before a model hides them."
     }
    ]
   },
   {
    "id": "pd6-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, duplicates. 305 rows became 298 after dropping duplicates, a 2.3% reduction that would otherwise double-count some flats."
     },
     {
      "kind": "p",
      "text": "Example 2, shares. A city with 18% of the rows will get fewer examples, so evaluate it separately."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Dataset audits catch leakage, label errors and drift early, before expensive training."
     },
     {
      "kind": "check",
      "question": "Why fix the random seed in an audit?",
      "options": [
       "To make the numbers reproducible",
       "To make them larger",
       "To remove duplicates"
      ],
      "answer": 0,
      "why": "The same seed gives the same simulated data and the same audit."
     }
    ]
   },
   {
    "id": "pd6-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Skipping the audit",
      "text": "Problems appear later as mysterious model errors."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · An audit by hand",
      "text": "It cannot be repeated on new data."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Fixing issues without recording them",
      "text": "The next person cannot tell what changed."
     }
    ]
   },
   {
    "id": "pd6-python",
    "kicker": "7 · In Python",
    "title": "An audit in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "A reproducible audit of a simulated flats table",
      "code": "import numpy as np\nimport pandas as pd\n\nrng = np.random.default_rng(7)\nn = 300\ndf = pd.DataFrame({\n    \"area_sqm\": rng.normal(75, 20, n).round(0),\n    \"city\": rng.choice([\"Pune\", \"Mumbai\", \"Nagpur\"], n, p=[0.5, 0.3, 0.2]),\n})\ndf[\"price_lakh\"] = (df[\"area_sqm\"] * 0.8 + rng.normal(0, 6, n)).round(1)\ndf.loc[rng.choice(n, 12, replace=False), \"area_sqm\"] = np.nan\ndf = pd.concat([df, df.iloc[:5]], ignore_index=True)\n\nprint(\"shape:\", df.shape)\nprint(\"duplicate rows:\", int(df.duplicated().sum()))\nprint(\"missing:\", df.isna().sum().to_dict())\nprint(\"numeric columns:\", list(df.select_dtypes(\"number\").columns), \"| text columns:\", list(df.select_dtypes(exclude=\"number\").columns))\nprint(\"price range:\", df[\"price_lakh\"].min(), \"to\", df[\"price_lakh\"].max())\nprint(\"city share:\", (df[\"city\"].value_counts(normalize=True).round(2)).to_dict())\nclean = df.drop_duplicates()\nprint(\"after dedupe:\", len(clean))\nbad = clean[(clean[\"price_lakh\"] <= 0)]\nprint(\"non-positive prices:\", len(bad))\nprint(\"area summary:\", clean[\"area_sqm\"].describe().round(1).to_dict())",
      "output": "shape: (305, 3)\nduplicate rows: 7\nmissing: {'area_sqm': 12, 'city': 0, 'price_lakh': 0}\nnumeric columns: ['area_sqm', 'price_lakh'] | text columns: ['city']\nprice range: 8.9 to 111.2\ncity share: {'Pune': 0.5, 'Mumbai': 0.31, 'Nagpur': 0.18}\nafter dedupe: 298\nnon-positive prices: 0\narea summary: {'count': 286.0, 'mean': 72.0, 'std': 18.7, 'min': 10.0, '25%': 59.0, '50%': 73.0, '75%': 85.0, 'max': 120.0}"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Run the audit first, and keep it with the project."
     }
    ]
   }
  ]
 }
];
