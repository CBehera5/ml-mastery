# Task015.10 — trusted SVM reference parity

17 October2026 · Offline fixture verification only. No application or notebook implementation.

## Frozen inventory

| Manifest | Fitted states | Manual geometry | Rejections | Total |
|---|---:|---:|---:|---:|
| [SV-E1](sv-e1.manifest.v1.json) |6 linear|6|3|15|
| [SV-E2](sv-e2.manifest.v1.json) |38 RBF +2 same-dataset linear baselines|0|3|43|
| Total |46|6|6|58|

All states fit within the approved64-per-experiment bound. Four exact fictional fixtures have disjoint training/validation/sealed-test IDs. No final-test predictions or metrics are computed. The sampled boundary representation has25 reviewed query points,not a dense continuous contour. All classes,decision scores,support IDs,hinge/kernel/margin outputs,training-only scaler statistics,settings and candidate ordering are immutable manifest fields. Unsupported states have explicit invalid outcomes;the zero-normal manual scene has undefined geometric distance rather than fabricated zero.

## Environment and checks

Machine-readable [parity report](parity-report.v1.json) records the actual local environment:CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1,macOS15.6.1 ARM64. No packages were installed. The approved existing verification interpreter runs trusted authored code only.

Every fitted configuration passes:

- Independent population-mean/variance/scaling arithmetic versus training-fitted StandardScaler;actual reference model fitting/inference uses the library transform,not an approximate substitute.
- Manual dot-product/RBF kernels and dual/intercept reconstruction versus native decision_function on training,validation and all25 plot queries;absolute/relative1e−9.
- Exact exported support indices,IDs,coordinates and per-class counts;dual signs,box bounds,sum(alpha*y),KKT margin/hinge conditions and primal-dual objective checks.
- Prediction versus the native binary score sign,including exact zero;independent manual signs away from the declared near-boundary sensitivity band.
- Independently counted balanced accuracy/confusion and validation-only candidate selection with frozen tie ordering.

Manual w,b scenes verify unchanged geometric distance under common coefficient rescaling,changed functional scores,hinge arithmetic,translation/rotation and the zero-normal tagged state. Scalar reference probes check RBF exp(−1),constant-column scaler behavior and library hinge-loss agreement. The [convention specification](SOLVER_MARGIN_KERNEL_CONVENTIONS.md) separates solver tolerance,KKT diagnostics,score parity and selection ties.

All46 fits have fit_status_=0. The exact maximum KKT violation and primal-dual gap are recorded in parity-report.v1.json;neither is falsely represented as exact symbolic optimality. An overly strict1e−10 draft stopping tolerance made a same-dataset linear baseline hit its iteration cap. It was resolved BEFORE freeze using explicit tol1e−6;the independent score/KKT/gap acceptance checks were not relaxed. No failed draft fit is presented as a verified frozen state. The pinned probability=False deprecation warning is expected,recorded and distinct from nonconvergence;no probability calibration is fitted.

## Educational evidence and intentional distinctions

1. On the clean linear fixture,C.1 yields canonical slab width4 and6 solver support vectors;C1 yields width2 and2 supports. The four nearest on-margin observations need not all have nonzero dual coefficients:solver-active support membership is not a visual-nearest-point rule.
2. The noisy linear example changes margins,hinge penalties and validation behavior as C changes;larger C does not certify better validation. The evaluation query near the boundary is not rounded before classification;the separate plot includes exact-zero tie probes.
3. On the clean nonlinear fixture at C1,gamma1,raw-coordinate RBF validation balanced accuracy is.5 versus1.0 after training-only scaling. On the same training-standardized nonlinear fixture,the linear baseline gives.5 versus1.0 for RBF. These are fixed fictional examples,not universal performance claims.
4. For the scaled clean kernel probe,C-independent similarity falls from approximately.922702 at gamma.1 to.447314 at1 and.040036 at4. Greater gamma is more local,not necessarily better. Underflowed raw-space similarities carry their finite log similarity so numerical zero is not confused with theoretical exp positivity.
5. The noisy nonlinear fixture shows perfect training classification can coexist with weaker validation. Class weighting changes per-class C/geometry,not calibrated probabilities. Parameter choice is limited to the frozen validation candidate list;test stays untouched.
6. Manual exact-boundary output is “on boundary”;pinned fitted SVC binary score>=0 selects class1,including signed zero. That is not a universal tie policy copied from Logistic/GB. Manual score summation near zero can be numerically sensitive;native labels are preserved and sensitivity is explicitly marked.

## Reproducibility and preservation

Canonical sorted JSON with full float precision,indent2,newline,allow_nan=False. [Freeze lock](freeze-lock.v1.json) hashes both manifests,machine parity report,source-preservation report,generator and convention document. Fresh-process `--check` requires byte-identical regeneration,not just approximate numerical agreement.

From repository root:

```
python work/freeze-task-015-10.py --check
```

The generator without --check is an authoring command;do not rerun it to silently change approved frozen data. The [source-preservation report](source-preservation.v1.json) compares all517 accepted application/public/package/Python hashes against Task015.9. No learner storage was read or modified. Future authorized application edits will require preserving this pre-implementation source baseline for unchanged regeneration rather than rewriting the old source report.

Not claimed:100 future scored exercise instances,frontend/full regression/build acceptance,live keyboard/320px,notebook execution,genuine screen-reader,browser zoom,Colab or general original-directory I/O reliability. Those remain future implementation/manual obligations. No deployment,external learner testing,migration,mastery changes or later algorithm work.
