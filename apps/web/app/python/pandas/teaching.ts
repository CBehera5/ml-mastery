export const CONCEPT_NOTES = [
  [
    "A Series is a one-dimensional labeled collection; a DataFrame is a table with labeled rows and named columns whose dtypes may differ. An index is part of the data contract, not a decorative row counter. The same measured value attached to another house is different information.",
    "Map labels to values before arithmetic: rowA has1 in a and20 in b, so its sum is21; rowB has2 and10, so its sum is12. Reversing display order does not swap observation identity. A label absent on one side introduces missingness rather than a guessed zero.",
    "df['area'] returns a Series; df[['area']] preserves a one-column DataFrame. Read shape, index, columns, dtype and nullability before preparing features. A nullable integer age can preserve both legitimate zero and an absent observation; neither a string label nor a missing sentinel should be silently converted into a numeric feature.",
  ],
  [
    "loc selects by label; iloc selects by zero-based position. With index[10,20,30], loc[20] and iloc[1] happen to select the same row. Reordering rows separates these ideas immediately. State which observation you mean rather than guessing from its display position.",
    "A labeled Boolean mask is a mapping from observation ID to a keep/discard decision. In the example with mask labels[30,10,20] and values[True,False,True], retain IDs20 and30. Apply the same aligned rule to target values; equally long arrays alone do not prove correct pairing.",
    "Feature order matters: ['area','age'] must match coefficients in that order. For assignment, deliberately own a copy and use loc on that frame, or explicitly update the intended original. Inspect the pinned before/after trace; do not rely on chained assignment accidentally propagating through a selection.",
  ],
  [
    "Missing means an observation is unavailable; zero is a real observed value. Inspect isna/notna alongside the original cells. A missing-value count divided by all eligible rows is a missingness rate; counting only observed rows changes the denominator and the question.",
    "For ages[0,missing,20], one value is missing. Dropping it changes the retained population and IDs. A declared fill of10 keeps all three records but adds an assumption;10 is the observed median of0 and20 in this exploratory example. Record the policy rather than pretending the replacement was observed.",
    "In modeling, a learned replacement must come from training rows only. Save that statistic and apply it to held-out observations without refitting. Whole-dataset filling before a split leaks information even without explicitly reading test targets. This lesson teaches that boundary with fixed recipes, not a new general preprocessing pipeline or imputation algorithm.",
  ],
  [
    "Grouping first partitions rows by declared keys, then summarizes each partition. size counts group rows; count counts nonmissing values of the selected field. A group with three rows and one missing price has size3 but price count2. Always name the field and denominator.",
    "For A:[10,20] and B:[100], the means are15 and100. Their plain average57.5 gives each group equal weight, not each observed house. The observed overall mean is(10+20+100)/3=130/3. Reconstruct group sums and nonmissing counts when combining summaries.",
    "Group differences are associations, not automatically causes. In the constructed size-band experiment, the group with more large houses has a larger pooled mean, yet both groups have identical prices within each band. That is compatible with confounding; it does not prove a causal effect or universally prove no effect. Predict pooled and within-band results before reveal, then revisit the Statistics intervention experiment. State missing-key, category, sorting and observed policies explicitly.",
  ],
  [
    "A join constructs matching pairs, not merely extra columns. Left keyA matched with two right A records creates two rows; unmatched B survives a left join with missing right fields. Thus left[A,B] with right[A,A] gives3 left-join rows and2 inner-join rows. Duplicates can silently reweight observations in a later model.",
    "A key needs entity meaning as well as a matching type. A shared neighborhood is not a house ID, even when one small sample happens to match correctly. For a lookup, many_to_one (also spelled m:1) requires unique right keys while allowing repeated left keys. A permissive many_to_many check does not certify that duplicated model rows are appropriate; investigate conflicting lookup records instead of silently keeping one.",
    "Inspect match pairs and indicator states against the intended population. In pinned pandas, missing keys can match missing keys; do not assume SQL-style null nonmatching. Decide whether absent identifiers may legitimately identify the same entity. A successful parse, merge or validation never replaces semantic key and missingness review.",
  ],
  [
    "A reproducible audit answers whether observations are usable for a stated prediction-time question. Freeze source revision/hash, schema, units, exact retained IDs, missingness, duplicate policy, date parsing and limitations. An index position is not necessarily the entity ID. describe() is a summary, not a certificate of data quality.",
    "The canonical fictional housing source has16 unique IDs H01–H16 with fixed H01–H12 training/H13–H16 test provenance. A separately named duplicate-ID overlay retains16 rows but only15 distinct IDs. Report both conflicting rows without mutating the canonical source. A declared subset audit must distinguish source size from the rows actually reported.",
    "price is the target; future_price is unavailable when predicting a new house. Neither belongs in the feature table, even if correlation looks impressive. Selected area/age inputs still require a stated missingness policy before fitting. A malformed date coerced to missing must be reported, not described as validated. This tiny fictional audit demonstrates reasoning, not representative model performance or a capstone.",
  ],
] as const;
