export const PYTHON_JOURNEYS = {
  "essentials": [
    [
      "How can a few names express a real prediction?",
      "If a price is stored in thousands rather than rupees, why must the units of the calculation change too?"
    ],
    [
      "When do two names point to the same changing data?",
      "Why can editing a list through one name change what another name sees? Contrast assignment with copying."
    ],
    [
      "Does zero mean the same thing as missing?",
      "How could a truthiness check accidentally discard a valid observation? State an explicit missing-value rule instead."
    ],
    [
      "How do repeated steps become a trustworthy total?",
      "Why does resetting a running total inside a loop lose earlier observations? Explain the denominator as well as the sum."
    ],
    [
      "What makes a calculation reusable and dependable?",
      "Why is printing a result different from returning a value to the next operation?"
    ],
    [
      "Can a shorter transformation preserve the meaning of every row?",
      "Why is keeping features and targets the same length insufficient to prove that they still belong together?"
    ],
    [
      "What is an error trying to tell us?",
      "Why can catching every exception and returning zero make a broken calculation harder to trust?"
    ],
    [
      "Can someone else reproduce your small program?",
      "What inputs, dependencies and validation rules must accompany a program so that someone else can interpret its result?"
    ]
  ],
  "numpy": [
    [
      "What does an array know about its data?",
      "Why can a legal reshape preserve every number while changing which values appear to describe one observation?"
    ],
    [
      "Which observations survive this selection?",
      "How would you show that filtered features, targets and identities still describe the same cases?"
    ],
    [
      "Which axis is this smaller array meant to match?",
      "Why can a legal broadcast still apply offsets to the wrong axis? Explain the intended feature or row meaning."
    ],
    [
      "How can one expression predict for many houses?",
      "Why must a scalar baseline be added once per predicted observation, rather than once per feature contribution?"
    ],
    [
      "What does matrix multiplication combine?",
      "Why can reversing matrix multiplication change the result even when both orders have legal shapes?"
    ],
    [
      "What exactly disappears when we reduce an axis?",
      "Why is skipping a missing value different from replacing it with zero? What if an entire feature is missing?"
    ]
  ],
  "pandas": [
    [
      "How do labels keep a table meaningful?",
      "Why do row identities and column names matter even when two tables have the same shape?"
    ],
    [
      "Can a filter silently separate a target from its row?",
      "What would you check besides row count before pairing selected features with their targets?"
    ],
    [
      "Is an unknown measurement really a zero?",
      "How might filling every missing value with zero change the meaning of a summary or prediction?"
    ],
    [
      "What does a group average actually average?",
      "Why might averaging group means differ from computing the mean over all observations? Explain the group sizes."
    ],
    [
      "Can combining two tables change how many cases you have?",
      "Why can a join duplicate observations even when neither source contains a duplicate full row? Inspect key multiplicities."
    ],
    [
      "What makes a dataset safe to hand to the next step?",
      "Which checks would you include in an audit so a later user can detect missingness, duplicated identities and schema changes?"
    ]
  ],
  "visualization": [
    [
      "What does a chart let us measure?",
      "How would missing units or unclear axes change what a viewer can reasonably conclude from a chart?"
    ],
    [
      "What shape appears when values are grouped?",
      "If changing bins changes a histogram’s appearance, which conclusions should you recheck against the underlying values?"
    ],
    [
      "What can a cloud of paired points reveal?",
      "Why does a strong pattern in a scatterplot fail to establish what an intervention would do?"
    ],
    [
      "How much of a distribution fits inside a box plot?",
      "Why should an outlier marker prompt investigation rather than automatic deletion of an observation?"
    ],
    [
      "Could a truthful number support a misleading picture?",
      "What would you inspect before accepting a chart’s claim about a large difference or trend?"
    ]
  ],
  "preparation": [
    [
      "Which observations are allowed to teach the pipeline?",
      "Why should a final test case not influence preprocessing even if its target label is never used?"
    ],
    [
      "Where should a missing-value replacement come from?",
      "Why must an imputation statistic be learned from training rows rather than the combined dataset?"
    ],
    [
      "Can a category change the meaning of a feature column?",
      "What should happen when a new category appears after training? Explain how the feature contract stays consistent."
    ],
    [
      "What changes when we change a feature’s coordinates?",
      "Why must a held-out value use the training scale rather than help calculate a new one?"
    ],
    [
      "Can one preprocessing step leak across validation folds?",
      "Why does fitting preprocessing once before cross-validation give each validation fold information it should not have?"
    ],
    [
      "What must a preparation report make reproducible?",
      "How would you justify an outlier policy without choosing it solely to improve the final test score?"
    ]
  ],
  "sklearn": [
    [
      "What changes when an estimator is fitted?",
      "Why is predicting with a fitted estimator a different operation from fitting it on the evaluation rows?"
    ],
    [
      "Better than what—and measured how?",
      "Why is a model score incomplete without a relevant baseline, metric and stated evaluation split?"
    ],
    [
      "Which data makes each validation score independent?",
      "How would you prevent a validation fold from helping fit its own preprocessing?"
    ],
    [
      "Can the whole workflow respect one training boundary?",
      "Why is a pipeline useful only when every fitted step is inside the correct training boundary?"
    ],
    [
      "How do we choose a model without choosing on the test set?",
      "Why does repeatedly consulting a final test score to select models weaken that score as independent evidence?"
    ]
  ]
} as const;
