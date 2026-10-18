# RG-E1/RG-E2 numerical and solver conventions v1

17 October2026. Trusted offline authoring only; no application or learner-code execution.

## Data and resource bounds

All houses are fictional. Eight training and four development rows; three ordered features: area in100m², room index, age in decades. Targets are in ten-thousand USD. Second fixture swaps the first two columns AND names, preserving their semantic correspondence. It tests order/correlated-coefficient interpretation, not guaranteed instability. Dataset values are embedded in each manifest. No final-test values or production labels are included.

RG-E1 enumerates12 states: two fixtures × Ridge/Lasso × three strengths(.1,1,10). RG-E2 enumerates24: two fixtures × strengths(.1,1) × Elastic Net fractions(.25,.5,.75) × training-only/global-development-invalid scaling. Only enumerated complete IDs are legal. No free numeric controls. Each scene ≤64 configurations; largest input matrix12×3=36 cells, rank2. Fold/result tables are separate read-only records, not answer payloads; no dense mesh, uploads or arbitrary fitting. Two paired original/swapped fixtures let learners compare aligned coefficients and predictions; the result need not change to be educational.

## Objectives and scaling

For n estimator-training rows, r=y−(Zw+b), Z the scaled features, b unpenalized:

- Ridge: Σr² + αΣw².
- Lasso: Σr²/(2n) + αΣ|w|.
- Elastic Net: Σr²/(2n) + αqΣ|w| + α(1−q)Σw²/2.

L1 is the sum of absolute coefficients; squared L2 is the sum of squares, not its square root. Equal numeric α across Ridge and normalized objectives does not mean equal strength. q is an interior mixing fraction, not averaging fitted predictions; no q0 ElasticNet fit or alpha0 Lasso is exposed. Pure Ridge/Lasso use their dedicated estimators. Intercept is separately fitted and excluded from both penalties.

StandardScaler uses population variance (ddof0) and training-estimated mean/scale. Raw coefficients w_raw=w/scale; raw intercept b_raw=b−w_raw·mean. Both representations and ordered units are exposed. The valid full fit learns scaling from eight training rows only. In valid CV, each scaler and estimator are independently fitted on that fold's training IDs. Invalid diagnostic scaling uses all training PLUS development inputs, including CV-held-out rows; estimator target fitting remains limited to its declared training rows. This is explicitly tagged invalid for selection even if scores look good. No target-fitting permission is inferred from a scaler's fit IDs.

Three KFold splits, shuffle=True, random_state1729, fixed8-row order. CV mean MAE is an unweighted mean of three fold MAEs (fold sizes3,3,2); it is not called pooled MAE. External development errors use the same four rows for every candidate. Development candidates may be compared, but no final-test tuning/evaluation is exposed. A finite scene is not proof of generalization, causal relevance or stable feature selection. These small fixtures need not exhibit an overfitting improvement at every strength.

## Solvers and convergence

Ridge(alpha as listed, solver='svd', fit_intercept=True, tol=1e−10). The SVD solver does not use the iterative tol as a convergence certificate; independently compare a centered regularized linear solve and gradient stationarity.

Lasso/ElasticNet: fit_intercept=True, selection='cyclic', random_state1729, max_iter100000, tol1e−10. Freeze only fits without warnings; record iterations and dual_gap. Require dual_gap ≤tol×mean(centered training y²)+1e−12; verify coefficient KKT stationarity independently with absolute residual≤1e−7, including inactive-coordinate subgradient inequalities. Check unpenalized intercept residual mean≤1e−9. KKT/duality checks provide numerical acceptance, not exact real-arithmetic optimality. Unsupported/nonconverged future states must be explicitly rejected/tagged, never silently accepted as reliable optima. RG03.O4/RG05.O4 lesson diagnostic items remain future authored assessments; no fabricated nonconverged fitted scene is frozen here.

## Zero, tolerance and displays

Exact-zero tag means the stored returned floating coefficient equals0.0 (negative zero equivalent). Near-zero-nonzero means0<|w|≤1e−8; it is NEVER counted as an exact Lasso zero. Other nonzero coefficients are tagged nonzero. The near-zero cutoff is display classification, not a sparsity proof or solver stopping criterion. Preserve full float values in JSON; rounded display zeros must retain the tag and an approximate marker. Ridge may return zero in special cases, but L2 does not generally select exact-zero features. Lasso zero selection is conditional on data, scaling, α and correlations, not causal irrelevance.

Manual predictions/raw-unit transformations versus sklearn: absolute plus relative1e−9 tolerance (NumPy allclose). Metric cross-checks: absolute1e−12 with NumPy default relative tolerance; regeneration is stricter byte-identical on the pinned tested profile. Ridge coefficient oracle uses absolute+relative1e−9. KKT checks use their separately declared1e−7 tolerance, not learner-answer tolerance. Integer IDs/counts/orders/tags are exact. NaN/Infinity are forbidden in frozen JSON. No undefined metric is coerced to zero; current MAE/MSE/RMSE use nonempty finite target arrays. No R² or probability metric is exposed.

## Reference profile and regeneration

CPython3.13.16; NumPy2.5.4; pandas3.0.6; Matplotlib3.11.2; scikit-learn1.9.1. Authoring script asserts these exact versions; actual OS is recorded in the parity report. No packages are installed or changed. Cross-platform bitwise output equivalence is not claimed.

From repository root, using the accepted isolated interpreter:

    python work/freeze-task-015-3.py --freeze
    python work/freeze-task-015-3.py --check

--freeze is trusted authoring only. --check recalculates every fit and fold, reruns independent arithmetic/KKT checks, compares both complete manifests bytewise and verifies the source/convention/manifest hashes in freeze-lock.v1.json. Frozen outputs must not be silently rewritten during implementation. Record approved semantic changes as a new version with founder review. Local reference execution is not notebook execution, genuine Colab, screen-reader or browser-zoom evidence.
