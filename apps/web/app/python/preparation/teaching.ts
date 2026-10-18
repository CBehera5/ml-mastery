export const CONCEPT_NOTES = [
  [
    "A split answers a future-use question before any transformation learns from data. An observation is one recorded row; an independent unit may instead be a customer, household or time period. Multiple rows from one customer do not become independent simply because their row IDs differ.",
    "Training data learn parameters. Validation data compare declared choices without becoming fit data for that comparison. The final test estimates the chosen workflow once; using its score to choose a cap, vocabulary or imputation rule makes it part of development. A final score can look excellent while no longer answering the original unseen-data question.",
    "Start with H01–H12 development rows and H13–H16 untouched final test. Draw a temporary training/validation partition inside the first12 IDs. A seeded row split reproduces memberships only for the same ordering/configuration; it does not solve customer overlap or time travel. A house's after-sale price cannot be a prediction-time feature even if it is highly correlated with the target."
  ],
  [
    "Missingness means the measurement is unavailable, not that the measured quantity is zero. Dropping a row changes who remains represented; filling a row preserves identity but adds an assumption. A missing indicator preserves the fact of absence, not the cause. Investigate why measurements are absent before treating any rule as universally appropriate.",
    "Fit means learn a reusable rule: with train ages10,missing,30 the median is20. Transform means apply the saved20 without learning again: test1000,missing becomes1000,20. Even an unsupervised whole-dataset median lets future observations change the preparation that is evaluated.",
    "Compare a more extreme test batch: its observed extreme can change, but the saved training statistic cannot. An all-missing training column has no observed median; inspect the pinned library's documented output names and missing statistics rather than guessing. Unexpected columns require an explicit schema policy. Record the replacement and its fit IDs; a filled20 never becomes an originally observed age."
  ],
  [
    "An encoder establishes a coordinate vocabulary. With training categories basic/pro, the two one-hot coordinates mean those named categories in that order. Rows change independently of column meaning. A numerical code for a plan is not automatically a measured distance or ordinal ranking.",
    "An unseen team category cannot expand the vocabulary during evaluation. With ignore and no drop it becomes[0,0]; with an explicit error policy it must be rejected. Neither behavior discovers what team means. With drop=first, basic can also become all-zero, so equal arrays can conceal different raw meanings.",
    "Inspect categories, column names, dimensions and the unknown policy together. Low/medium/high may justify ordinal ranking, but equal spacing is an additional assumption, and arbitrary plan numbers justify neither. In ML preparation, preserve the fitted schema and unknown provenance instead of silently refitting a test batch."
  ],
  [
    "Scaling is a coordinate transformation learned from training observations. In z=(x−μ_train)/σ_train, x is a measured feature, μ_train is the saved training mean and σ_train the saved population standard deviation. z is unitless; its inverse returns the original units.",
    "For training1,3, the mean is2 and population variance is((1−2)²+(3−2)²)/2=1. Thus training coordinates are−1,1 and held-out5 maps to3. Dividing by n−1 gives sample variance2, not this StandardScaler contract. A held-out extreme must not move the training coordinate system.",
    "The pinned scaler gives a constant training feature4,4 scale1 and variance0: both train values map to0, while a new5 maps to1. This is deliberately different from an existing Math runtime that guards undefined standardization; neither old semantics nor the library fixture should be rewritten to hide the distinction. Better conditioning or equal ranges alone cannot demonstrate better generalization."
  ],
  [
    "A fold is a temporary training/validation partition of development observations. Its validation rows stand in for unseen data during a comparison. Before learning any imputation, scale or vocabulary, identify exactly which IDs are permitted to fit in that fold. Repeated-fold APIs belong to the later scikit-learn curriculum; this lesson traces the local boundary first.",
    "Compose by type: numeric columns pass through a training-fitted median imputer then training-fitted scaler; categorical columns pass through a declared category imputer then a fixed-vocabulary encoder. ColumnTransformer concatenates these branches in declaration order. Read names as well as shape: exchanging columns can change a weighted prediction without a shape error.",
    "Pipeline organizes sequential transformations; it does not rescue already leaked inputs or steps fitted on all development data before partitioning. Fit each learned stage anew inside each fold's training set, then transform validation. After policy selection, fit the chosen preparation on all allowed development-training rows and transform the untouched final test once. Never refit on that test."
  ],
  [
    "An outlier is an unusual observation, not proof of error. It may be a valid rare house, a recording error or a population the model must serve. Preserving, investigating, capping and deleting answer different questions and can change population coverage; none is automatic cleaning.",
    "A supplied training-only cap50 years maps a held-out80 to50 under that declared policy, while preservation retains80. Choosing the cap because it improves the final-test score leaks the test into selection. Explain the trade-off and selection provenance, rather than inventing a universally correct cap.",
    "A reproducible preparation report records the source/version/hash, retained and split IDs, units, exact environment, seed where used, fitted parameters, branch/vocabulary/column order and limitations. Reordering input data can change a seeded split. A same-width but reordered feature table is not automatically compatible: reject unsupported schema changes and require an explicit reviewed mapping."
  ]
] as const;
