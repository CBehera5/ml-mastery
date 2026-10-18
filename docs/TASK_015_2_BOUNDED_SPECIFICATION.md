# Task015.2 — Polynomial Regression bounded implementation specification

17 October2026 · Founder subsequently authorized implementation after EV PhaseB acceptance. **Implemented; awaiting founder review.** [Completion/verification](TASK_015_2_COMPLETION.md). Original scope below is preserved; prerequisite sequencing was not changed.

## 1. Verified identity and prerequisite boundary

The accepted [decision package](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md), [objective matrix](supervised-lesson-objective-matrix.md), [experiment specification](supervised-visual-experiments.md) and [mastery proposal](supervised-mastery-and-evaluator-proposal.md) assign **Task015.2 to PR — Polynomial Regression, PR01–PR04**. No new task identifier or curriculum count is introduced here.

EV01 is only the first lesson of Task015.1's Evaluation/generalization module. The actual next unfinished curriculum work is the already named **015.1 phaseB, EV02–EV06**; it is not a new algorithm. PR depends on EV plus existing multiple Linear Regression and NumPy. Completing prototype verification alone does not complete EV or authorize skipping these dependencies. Default: finish and review phaseB before implementing PR. Any decision to reorder/defer that prerequisite must explicitly amend the accepted dependency plan; this specification does not do so.

## 2. Frozen scope and counts

| Deliverable | Accepted planning allocation |
|---|---:|
|Lessons|4: PR01,PR02,PR03,PR04|
|Essential objective families|16, four per lesson|
|Practice instances|32: A/B per objective|
|Independent instances|48: three complete forms A/B/C,16 families each|
|Paired critical gates|4: PR01.O2,PR02.O2,PR03.O2,PR04.O2|
|Core labs|2: PR-E1 and PR-E2|
|Full module notebook|1, part of the12-notebook target|

Do not duplicate the existing multiple Linear Regression course, award its mastery from PR, or count notebook execution/practice as independent evidence. No Ridge/Lasso course, tree implementation, capstone or unrestricted coding environment is included. Ridge can appear only in PR03's already planned bounded polynomial-penalty comparison; its full RG objectives remain later.

## 3. Exact objective/teaching/assessment matrix

Each objective below receives its own worked/changed example, two practice instances, one independent instance in each of three forms and targeted remediation. Objective IDs and meanings are unchanged from the approved matrix. Gates require both the decision/calculation and its explanation/transfer component.

| Lesson | O1 | **O2 critical** | O3 | O4 |
|---|---|---|---|---|
|PR01 — Curves from features|Construct degree2 feature columns and dimensions|Explain why a polynomial predictor is linear in coefficients but curved in input|Calculate a polynomial prediction with units|Identify unintended duplicate intercepts|
|PR02 — Interactions and capacity|Construct a two-feature interaction row|Predict feature explosion and reject an unsupported high-degree design|Compare extrapolated versus interpolated predictions|Debug feature order/shape mismatch|
|PR03 — Degree and regularization|Compare fixed degree train/development curves|Select degree/penalty inside folds without fitting preprocessing on validation|Explain why scaling matters for polynomial penalties|Repair an authored polynomial pipeline order|
|PR04 — Limits and alternatives|Interpret curved residual structure|Reject a good-interpolation score as evidence of safe extrapolation|Compare polynomial, linear and tree assumptions|Document a justified model and failure case|

### Teaching and feedback commitments

- **PR01:** begin with house-price residual curvature, not `PolynomialFeatures` syntax. Use dimensionless normalized area x, φ(x)=[x,x²], w=[2,3], b=1 in declared price units: x=2 gives17. Explain each symbol and coefficient's unit; raw physical feature powers require corresponding coefficient units. Change x and compare the curved input-output plot with linear coefficient weighting. Misconception: “curved means nonlinear in the coefficients.” Remedy: fix φ and trace the weighted sum. Explicitly avoid two intercept columns.
- **PR02:** extend to area/rooms interactions using [a,b]=[2,3] →[a,b,a²,ab,b²]=[2,3,4,6,9]. Explain why columns increase while observations do not. For two features, degree3 yields nine nonconstant terms. Contrast a valid feature order with a swapped-column prediction and an authored unsupported feature-count case. Remedy: enumerate terms and annotate row/column meaning before notebook syntax.
- **PR03:** compare the accepted degree1/3/9 teaching cases on identical permitted rows; use trusted reference metrics rather than assume a monotonic validation trend. Degree/penalty choice belongs inside development/inner folds; learned scaling fits only training rows of each fold. A fixed polynomial formula applied to held-out inputs is not itself test-label leakage; do not falsely claim the fixed expansion learns a mean. Show the complete safe pipeline and distinguish model-selection leakage from learned-statistic leakage. Remedy: trace exactly which IDs determine each decision/statistic.
- **PR04:** show x² increasing from4 at2 to100 at10 and compare interpolation with a declared out-of-training-range query. Low in-range error does not prove tail reliability or causality. In two features, marginal ranges alone do not establish joint support. Compare existing linear predictions and an explicitly authored piecewise-rule illustration; no tree estimator implementation or forward-dependent API lesson. Remedy: separate observed evidence, assumptions and unsupported claims in a model report.

All lessons follow **real problem → visual intuition → prediction/experiment → mathematics → trusted Python → evaluation → comparison**. Link contextual refreshers instead of repeating Math/Python modules. Guided coding uses only supplied repair tokens/slots; an API-name quiz alone cannot satisfy an objective.

House Price is the direct regression application. Churn and Good/Needs Improvement documentation labels are contrast applications: a regression price output is not a drop-in classifier; polynomial features could later support an appropriate classifier, but thresholding a price changes the question. No production documentation data/labels, full NLP curriculum or capstone engine is required or authorized.

## 4. Interactive visual experiments

**PR-E1 / PR01–02 — curves and feature maps.** Approved controls: degree1/2/3; one/two features; explicitly authored input/query points. Predict output shape/terms/point before reveal. Reveal feature expansion/order, weighted-sum arithmetic, curve/query marker and numerical feature table. Compare a fixed x with changing coefficients, then a fixed model with changing x. Include duplicate-intercept and swapped-column counterexamples. Explain why interactions are columns, not added observations.

**PR-E2 / PR03–04 — capacity, penalty and tails.** Approved controls: finite authored degree/penalty configurations and in-range/out-of-range queries. Display reference-trained curves, train/development residual/error tables, exact fit/split IDs and extrapolation warnings. Include at least one changed-condition comparison where a more flexible model is not the justified choice. No claim that higher degree always worsens or improves validation. Predictions and explanations must refer to actual frozen results, not an invented trend.

The blueprint approves two labs and a maximum64 configurations/activity, **not an exact reachable-state count**. Freeze the full discrete configuration manifest and expected outputs before coding; report the resulting count without calling it an already approved curriculum count. No arbitrary degree, uploaded points, free-form formula or continuous unsupported slider. Keep arrays rank≤2/dimension≤32/≤64 cells; render term-by-term tables when output features exceed eight columns. Use tiny displayed/training teaching subsets within bounds; any larger immutable training asset needs separately stated bounds, not relaxed answer limits. No higher-resolution mesh extension.

Every graphic shares one trusted result with an accessible numerical table/text summary. Native keyboard controls, visible focus, result focus/announcement, no hover/color-only information, reduced motion and320px wrapping are mandatory. Label offline fitted traces as reference replay, not live browser training. Completion needs changed inputs, prediction-before-reveal and a correct bounded explanation; an initially wrong prediction may support learning.

## 5. Mastery and evidence — proposed policy, not activation authority

Require **13/16 families correct AND all four paired gates fully correct in one confirmed independent attempt**. Twelve fails; thirteen passes only with all gates. Both gate atoms must be correct; no partial point or cross-attempt mosaic. Completion, experiments and notebooks never award mastery. All16 families must be implemented/verified before enabling assessment/mastery; no prototype credential.

Critical failure cases protect: linear-in-parameters reasoning (PR01.O2), feature-count/resource reasoning (PR02.O2), fold-local selection/scaling and final-test boundaries (PR03.O2), and interpolation-versus-extrapolation claims (PR04.O2). Test both components on all three forms: **24 valid-wrong component failures**, each at an otherwise passing score. Test aggregate12/16 and13/16 boundaries in all forms, unanswered answers, malformed submissions and retained earlier mastery after a later failure.

Carry forward the documented proposal: unlimited fresh-ID independent retries rotating A/B/C; no early correctness, review then explicit confirmation; restored review requires reconfirmation. Practice: two valid submissions/variant/review cycle and worked counterexample recovery. Recommend objective-specific recall/remediation without hard navigation/retry locks. Award new objective mastery only for correct families in a passing module attempt; retain missed noncritical gaps. These new-module details require explicit confirmation before learner mastery activation; no older module policy changes.

Use a separate versioned PR scope, with exact schema/content/assessment/storage IDs frozen before implementation. No implicit import of EV01 prototype, EV, Regression, Math or Python evidence. Strict canonical hydration/ownership/bounds; corruption/future/foreign/stale/quota failures preserve original bytes with memory-only warning; latest20 compact attempt summaries/latest full response. Any future semantic migration requires a separate auditable decision. Local editable evidence is not a proctored credential or account sync.

## 6. Evaluator and trusted reference boundary

Reuse bounded finite choices, typed finite numeric answers and explicitly accepted whole repair tuples. Retain absolute-plus-relative1e−9 default tolerance unless an exercise explicitly declares a reviewed precision rule; exact dimensions/types/IDs, negative-zero handling and malformed-versus-incorrect distinction. No expression parser, symbolic grader, dynamic feature generator from learner strings, learner Python execution, imports, files/network, uploads or shell.

Trusted offline Python verifies every **80 scored instance**, worked claim and reachable experiment state. Use the accepted local dependency profile and source/data/parameter/split/seed/hash manifests. Manually verify small expansions, units, predicted values and dimensions independently of exported model traces. Check `PolynomialFeatures(include_bias=False)` ordering and exactly one model intercept; fit `LinearRegression` or the bounded planned Ridge comparison in training/fold pipelines, not matrix inverses. Pin settings and document rank-deficient/high-degree cases: predictions can be compared with declared tolerance without asserting unstable/nonunique coefficients are identical across hosts. Test coefficient/order bugs, overflow/nonfinite/unsupported dimensions, incompatible split ownership and leaked scaling/degree selection.

No PR reference fit or notebook has been executed during specification preparation. Existing sklearn availability and EV01 reference success are not PR parity evidence.

## 7. One reproducible notebook

Extend the existing trusted notebook template, not a hosted execution service. Include exact environment assertions; original bundled tiny housing data and units; manual feature expansion; safe polynomial/scaler/model pipeline; baseline/degree/penalty comparisons on matching splits; residual and tail analysis; constrained guided repair; reproducibility/limitations. Illustrate classification-target mismatch for churn/documentation without implementing their algorithms.

No credentials, paid services, remote data or uploads. Freeze seeds and expected structured outputs; run twice in fresh local kernels and compare within declared tolerance. Genuine Colab execution remains a separate open gate until performed. Notebook execution writes no platform evidence.

## 8. Acceptance and stop conditions

1. Actual teaching→worked example→lab→practice A/B→independent A/B/C→remediation mapping covers all16 families; all four gate pairs protect mechanisms rather than answer-position memory.
2. All80 scored instances and every enumerated visual state match trusted reference plus independent small-number oracles; provenance/versions/ties/tolerances/units and degenerate cases recorded.
3.13/16 threshold,12/16 failure and all24 critical-component failures pass; retries/confirmation/remediation/retained mastery work without combining attempts or awarding practice/notebook mastery.
4. Equivalent answers, malformed/unsafe/oversize/unknown versions, exact whole-tuple acceptance, canonical persistence, corruption/quota/stale-tab/restoration and old-scope isolation tests pass.
5. Complete frontend/TypeScript and Python regressions, typecheck and normal production build pass in a reproducible source-identical environment with the existing lockfile; log any root-environment limitations. No threshold/config weakening to make checks pass.
6. Live production keyboard, focused feedback, prediction-before-reveal,320px and numerical/text alternatives verified. Genuine reader/real zoom/Colab remain explicitly open unless actually checked.
7. Two fresh notebook kernels match expected outputs. All existing routes/Math/Regression/Python/EV records and runtimes preserved; discovery additions accurately label implementation state.
8. Completion report, quality/status updates and founder review. No015.3, other algorithm course, capstone/engine, deployment, learner testing, production labeling or database migration.

**Estimate:** existing Task015.2 allocation **1–1.5 person-weeks**, not a new approved deadline. Re-estimate if reference degeneracies or interaction/assessment authoring exceed the original assumption; do not remove critical protections to meet it. Prerequisite EV phaseB is separately allocated2–3 person-weeks.
