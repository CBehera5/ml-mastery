export const CONCEPT_NOTES = [
  [
    "A list is a general Python collection. An ndarray stores a rectangular arrangement with a declared dtype. Multiplying [2,3] by 2 repeats the list; multiplying the corresponding numeric array gives [4,6]. Choose the representation before interpreting the operator.",
    "Shape is an ordered list of axis lengths. A scalar array has shape () and no axes; a vector has shape (m,) and one axis; a table has shape (m,n) and two axes. Here m counts observations and n counts features. ndim counts axes, while size counts all cells: m×n.",
    "For a three-house/two-feature table, six cells can be regrouped as (2,3), but the new rows no longer identify the same houses. Reshape is not transpose or new information. Decimal-to-integer conversion can discard a measurement: 2.75→2 and -2.75→-2. State feature meaning and dtype before conversion.",
  ],
  [
    "X[row,column] uses zero-based coordinates; ':' retains all positions on an axis. X[:,0] selects the first feature for every observation and removes the feature axis, giving (m,). X[:,0:1] retains that feature axis with length one, giving (m,1). A slice excludes its stop.",
    "A Boolean mask contains one keep/discard value per observation. Apply that same mask to features, targets and row identities. Equal output lengths alone cannot prove alignment: keeping H1 and H3 requires their targets, not the first two targets.",
    "A basic slice can be a view onto source storage. Draw two windows onto the same cells before tracing an edit; .copy() creates independent cells. Boolean indexing here returns selected data, not a promise that every selection is a view. Combine array predicates as (condition)&(condition); Python 'and' does not combine their cells.",
  ],
  [
    "Broadcasting reuses a smaller operand across coordinates; it does not infer what a feature or house means. Align shapes from the right. Each aligned pair must be equal or have a length of 1; missing leading dimensions behave as 1.",
    "For (3,2)+(2,), compare (3,2) with (1,2): repeat the feature offsets down the three rows. (3,2)+(3,) fails at the trailing 2-versus-3 comparison. For one offset per row, deliberately use (3,1), then repeat across the two features.",
    "On a square (2,2) table, both (2,) and (2,1) are legal but mean different things. Label the intended axis before accepting a result. Similarly [[1],[2]]+[10,20,30] creates [[11,21,31],[12,22,32]]: a (2,3) grid of pairwise sums, not two paired sums.",
  ],
  [
    "X has one observation per row and an ordered feature per column. w stores one coefficient per feature in the same order. b is a scalar baseline. The notation ŷ=Xw+b means one predicted target per observation, not one prediction per feature cell.",
    "For house [area=2, age=10], coefficients [100,-2] and baseline 50, the contributions are [200,-20] (₹ lakh). Their sum is 180; adding the baseline once gives 230 (₹ lakh). The next house [1,5] gives 100-10+50=140. The coefficient units are ₹ lakh per corresponding feature unit; b is in ₹ lakh.",
    "X*w retains each contribution, while X@w contracts the feature axis. Summing (X*w+b) across features adds the baseline twice in this two-feature example. Residual ŷ−y compares prediction and observed target for the same row; a shuffled target or reversed sign is a different calculation. Check loop/array values and shapes rather than grading machine-dependent speed.",
  ],
  [
    "Matrix multiplication contracts a matching inner axis: (m,n)@(n,k) gives (m,k); (m,n)@(n,) gives (m,). For each output cell, multiply matching terms and sum. [1,2] dotted with [10,1] gives 1×10+2×1=12; [3,4] gives 34.",
    "A*w broadcasts elementwise contributions and retains a cell for each feature; A@w or np.matmul(A,w) produces the contracted row predictions. A transpose swaps coordinates and axis labels. Transposing a one-dimensional (n,) vector does not invent a column axis; use an explicit justified reshape when (n,1) is intended.",
    "For column vectors A then B is B@A@v. With A scaling the first coordinate by 2, B adding 3 times the second coordinate to the first, and v=[1,2], A then B gives [8,2], but B then A gives [14,2]. Neither legality nor an inverse fixes feature meaning. Practical ML fitting normally uses appropriate numerical solvers, not explicitly forming an inverse as a default recipe.",
  ],
  [
    "Reduction combines values along an axis. In [[1,10],[3,20]], axis=0 follows the observations down each column: means [2,15]. axis=1 follows features across each row: [5.5,11.5]. A numerical row mean across unlike units may not be a meaningful feature. keepdims=True retains a length-one reduced axis for deliberate broadcasting.",
    "Variance measures squared deviations from the mean. For [1,3], mean=2 and squared deviations=[1,1]. With ddof=0 divide their sum 2 by n=2, giving 1; with ddof=1 divide by n−1=1, giving 2. In general the denominator is n−ddof, not the number of columns. Variance has squared measurement units.",
    "NaN marks a missing numeric observation, not an observed zero. Ordinary means propagate missingness; nanmean excludes missing observations from its count, but an all-missing feature still has no observed mean. Separately, finite inputs can produce nonfinite outputs, such as division by zero. The experiment tags these states; it never replaces them with zero. This module uses the approved int64/float64/bool profile, not new narrow-dtype overflow experiments or general-purpose solvers.",
  ],
] as const;
