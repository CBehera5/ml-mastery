# Mathematical specification

## Optimization foundations v1 — additive teaching contract

The new optimization.v1 contract does not alter any prior regression or neuron objective. New objectives are J(a,b)=(a−3)²+b²; anisotropic (a−3)²+k b²; coupled (a+b)²; saddle a²−b²; and double-well (a²−1)²+b². k lies in [1,100]. Only the round quadratic accepts the separate smooth L2 penalty λ(a²+b²), λ in [0,10]. Every state reports dataLoss, penaltyLoss, totalLoss and the full analytic gradient. Central differences use h=10^-5; check tolerance is 10^-6 × max(1, maximum absolute analytic component).

Simultaneous GD uses the entire old gradient: point_new=point−rate×gradient. Initial coordinates are within ±10; finite positive rate is at most 2; update budget is integer 1–100. State 0 is initial and state k follows k parameter updates. Finishing the budget yields iterations_completed only; no convergence flag or generalization claim exists. A zero gradient at a saddle remains zero-gradient evidence, not a minimum certificate.

Run guards stop at coordinate magnitude above 10^6, objective magnitude above 10^12 or gradient-component magnitude above 10^8. Failed-state data/penalty/total/gradient are null and the stop reason is explicit. A nonfinite candidate is not stored as a JSON nonfinite coordinate. These numerical guards describe an implementation boundary, not a theorem about asymptotic divergence. Existing Regression traces retain their separate v1 limits and statuses.

Reference: (w−3)² at w=1 has gradient −4; rate 0.1 gives 1.4. At rate 1, w alternates 1/5 with loss 4 despite a completed budget. Coupled (a+b)² at (1,2), rate 0.1 gives (0.4,1.4), not a sequential recomputation. For λ=1, (w−3)²+λw² has minimizer 1.5; λ=0 gives 3. Data fit, penalty and full objective must be distinguished. The executable penalty is L2 only; L1, batch variants and momentum remain conceptual.

Sampled visual grids/slices are runtime values with coordinate tables, not exact contour reconstruction. Raw/scaled Regression comparison uses the unchanged training/check/scaling APIs and equivalent zero predictions at initialization. Different weight coordinates cannot be directly equated after scaling. Hyperparameter selection uses validation, not repeated final-test tuning.

## Dataset linear regression — contract v1.0.0

For a non-empty feature matrix `X` with shape `(m,n)`, targets `y` with shape `(m,)`, weights `w` with shape `(n,)`, and scalar bias `b`, predictions are `ŷ = Xw + b` and residuals are defined as `r = ŷ - y`. Metrics are `MAE = mean(|r|)`, `MSE = mean(r²)`, and `RMSE = sqrt(MSE)`. Dataset optimization uses `dMSE/dw = (2/m)Xᵀr` and `dMSE/db = (2/m)sum(r)`, followed by subtraction of the learning-rate-scaled gradient.

This contract is separate from the linear-neuron v1 contract below. The neuron intentionally uses one sample and unaveraged squared error; changing it to dataset MSE would silently change verified educational semantics.

Training traces are state-based. Entry `0` is the initial parameter state and entry `k` is the state after `k` successful updates. A completed final entry uses `terminationReason = "iterations_completed"`. Numerical overflow or a configured numerical-limit breach returns `status = "diverged"` with an explicit reason; unavailable nonfinite metrics and gradients are represented as `null`, never JSON `NaN` or infinity. Training accepts 1–1000 iterations, at most 1000 observations and 64 features, and `0 < learningRate <= 10`. The upper learning-rate bound validates input, not convergence.

Standard feature scaling uses training-column population means and standard deviations (`ddof=0`). Evaluation data must reuse those statistics. Inverse transformation is `x = zσ + μ`. A selected zero-variance column is rejected with its zero-based column index instead of being silently mapped to zero.

Python uses NumPy `float64`; TypeScript uses IEEE-754 binary64. Generated fixture parity uses absolute tolerance `1e-9`; central finite-difference gradient checks use `epsilon = 1e-5` and tolerate `1e-7` normally or `1e-6` for randomized accumulated error.

## Functions and derivatives — contract v1.0.0

The calculus trace uses the scalar model `prediction = 2w`, target `6`, and squared loss `L(w) = (2w - 6)^2`. Its analytical derivative is `dL/dw = 4(2w - 6)`. Consequently, the trace anchors the learning story at `w=2` (slope `-8`), `w=3` (slope `0`), and `w=4` (slope `8`): a small increase in the parameter lowers loss on the left of the minimum and raises it on the right.

Central finite differences approximate a derivative as `(f(x+h) - f(x-h)) / (2h)`. The calculus contract requires finite scalar inputs and finite `h > 0`; invalid values fail before calculation. Python uses NumPy float64 and TypeScript uses IEEE-754 binary64. The lesson verifies analytical/numerical agreement within absolute tolerance `1e-7`; the fixture uses `h=0.5`, for which this quadratic's central difference is exact apart from binary64 rounding.

The derivative is local sensitivity, not itself a parameter update. Task 007 stops after showing what the sign and magnitude predict; learning-rate-scaled gradient descent remains the next lesson.

## Matrix multiplication — contract v1.0.0

Matrices are finite, non-empty rectangular rank-2 arrays. Vectors are finite, non-empty rank-1 arrays. For matrix-vector multiplication `X @ w`, `X.shape = (m,n)` and `w.shape = (n,)`; the result has shape `(m,)`. The trace records every row's elementwise products and sum.

For matrix-matrix multiplication `A @ B`, `A.shape = (m,n)` and `B.shape = (n,p)`; the result has shape `(m,p)`. The trace records the `n` scalar products contributing to every output cell. Ragged, empty, nonfinite, and incompatible operands are rejected with explicit shape errors. Python uses NumPy float64 and TypeScript uses IEEE-754 binary64; cross-runtime tolerance is `1e-9`.

Shape validity does not imply semantic validity. Column order is part of the feature contract and must stay aligned with vector rows or weight-matrix rows.

## Vector dot product — contract v1.0.0

For one-dimensional finite vectors `x` and `w` of equal nonzero length `n`, the dot product is:

`x · w = Σᵢ xᵢwᵢ`

The versioned trace contains defensive copies of both vectors, the elementwise contributions `xᵢwᵢ`, and their scalar sum. The Python reference uses NumPy `float64`; the browser runtime uses JavaScript IEEE-754 binary64 numbers. Cross-runtime fixture comparisons use the existing absolute tolerance of `1e-9` when exact JSON equality is not available.

Inputs must be non-empty, one-dimensional, finite numeric arrays with identical lengths. Empty vectors, nonfinite values, nested arrays, and length mismatches are rejected before calculation. Vector positions are semantically ordered: matching shapes do not protect against feature-ordering errors.

## Shapes and equations

Inputs `x` and weights `w` are non-empty, one-dimensional vectors of equal length `n >= 1`. Bias `b`, target `y`, and learning rate `η` are scalars.

`prediction = dot(x, w) + b`

`error = prediction - y`

`loss = error²`

`dLoss/dPrediction = 2 × error`

`dLoss/dWeights = 2 × error × x`

`dLoss/dBias = 2 × error`

Gradient descent performs `w' = w - η × dLoss/dWeights` and `b' = b - η × dLoss/dBias`.

## Precision and tolerances

Both runtimes use IEEE-754 binary64 values (`numpy.float64` and JavaScript `number`). Fixture parity uses absolute tolerance `1e-9`. Central finite differences default to `epsilon = 1e-5`; gradient checks default to absolute tolerance `1e-7`, while randomized tests allow `1e-6` for accumulated floating-point error.

## Validation and errors

Vectors must be non-empty, one-dimensional, equal length, and finite. Scalars must be finite. Learning rate must satisfy `0 < η <= 1`; this conservative product-level bound catches likely entry mistakes but does not guarantee convergence. Finite-difference epsilon and comparison tolerance must be positive and finite. Invalid inputs fail before calculation with a descriptive `ValueError` (Python) or `Error` (TypeScript).

JSON cannot represent NaN or infinity; runtime validation additionally rejects them before serialization.
