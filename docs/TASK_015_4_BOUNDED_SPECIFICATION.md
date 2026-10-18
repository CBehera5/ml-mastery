# Task015.4 — Logistic Regression and Classification Foundations

17 October2026 · Founder approved the scope, reference freeze and subsequent application implementation. [Completion/verification](TASK_015_4_COMPLETION.md) records delivery; founder review pending. Historical authoring/authorization statements below preserve the original plan, not the current execution status.

## 1. Verified authority and dependencies

Read and reconciled the [Task015 blueprint](SUPERVISED_LEARNING_BLUEPRINT.md), [implementation decision package §2](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md), [LG objective matrix](supervised-lesson-objective-matrix.md), [mastery/evaluator policy](supervised-mastery-and-evaluator-proposal.md), [experiment designs](supervised-visual-experiments.md), curriculum-quality register and [accepted015.3 completion](TASK_015_3_COMPLETION.md). Task015.4 is LG01–LG06, not another classification module or a renumbering of Task014.

Delivery follows accepted regularized regression. Formal concept dependencies are EV and Probability/Derivatives; contextual recall includes linear scores, arrays/shapes, row alignment, scaling and pipeline fitting from existing Math/Python/Regression. RG supports penalty recall; it is not a new hard route lock. Prerequisites recommend recall rather than importing evidence, awarding mastery or blocking experienced learners.

Old document headers saying015.3 is awaiting implementation are historical, superseded by founder acceptance. No conflict in approved LG lesson/count/gate allocations was found.

## 2. Exact approved scope

|Deliverable|Approved allocation|
|---|---|
|Lessons|Six, LG01–LG06 in matrix order|
|Essential objective families|24, four per lesson|
|Practice|48, .practice.A/B per objective|
|Independent assessment|72, .assessment.A/B/C; three complete24-family forms|
|Total scored fixtures|120; paired atoms do not increase the family denominator|
|Paired critical gates|Six: LG01.O2–LG06.O2|
|Core experiments|Two: LG-E1 and LG-E2; each ≤64 reviewed configurations|
|Notebook|One full Logistic/classification notebook|
|Mastery|20/24 plus both components of all six gates, one confirmed attempt|

“Classification Foundations” is the transition taught within these six lessons, not permission to add another course. Odds/log-odds fit LG01.O1/O3; precision/recall and imbalance extend LG03.O3/O4 using EV recall. Regularization/generalization belongs to LG04 and the EV comparison context. No extra objective families, lessons or gates.

## 3. Exact lesson and objective mapping

Matrix wording/order preserved. Each cell requires its own conceptual explanation, worked/changed case, practice A/B, independent A/B/C, targeted feedback and recall.

|Lesson|O1|O2 — paired critical|O3|O4|
|---|---|---|---|---|
|LG01 — From score to probability|Compute a linear logit and sigmoid|Distinguish fit, probability prediction and threshold decision|Explain coefficient direction in log-odds, not probability units|Identify a malformed output shape|
|LG02 — Learn with log loss|Calculate one binary log-loss term|Explain why fitting uses training labels and cannot use test labels|Predict gradient direction on a tiny trace|Compare log loss with hard-label error|
|LG03 — Thresholds and imbalance|Build labels from fixed probabilities|Select a threshold on development costs without claiming retraining or test permission|Compute threshold confusion counts|Explain positive-class convention and prevalence|
|LG04 — Regularization and geometry|Relate boundary to feature scaling|Explain inverse C strength and reject unsupported solver/penalty combinations|Compare linear boundary with curved data|Diagnose separation/unstable coefficients|
|LG05 — Trusted classification workflow|Read estimator fit/predict_proba outputs|Reject leakage from target-derived features or globally fitted transforms|Repair an authored pipeline and aligned target labels|Compare DummyClassifier and Logistic on identical rows|
|LG06 — Explain limits|Interpret false positives/negatives and subgroup errors|Reject probability/association as causal effect or guaranteed future risk|Compare Logistic with KNN/tree candidates|Report calibration/shift and linear-boundary limits|

### Critical decision, reason, failure and remediation

|Gate|Decision component|Required reason/transfer|Failure and remediation|
|---|---|---|---|
|LG01.O2|Identify whether an action fits parameters, predicts probability or thresholds a saved probability|Explain that thresholding changes the action, not learned coefficients/probabilities|Trace fit → score/probability → decision on a changed input; reject treating .75 as a label or a model refit|
|LG02.O2|Allow fitting with training labels, reject fitting/selection with final-test labels|Explain that label-dependent training log loss supplies the learning signal, while held-out labels evaluate rather than train|Compute contrasting observed-label losses, then trace which labels may influence a gradient; repair a test-label update|
|LG03.O2|Choose a threshold using permitted development costs only|Explain that changing threshold does not retrain, and final-test feedback cannot select the threshold|Hold probabilities fixed; recompute counts/cost for a changed threshold and restore the final-test boundary|
|LG04.O2|Interpret larger C as weaker regularization under the frozen convention and reject an unsupported solver/penalty tuple|Explain the inverse-strength trade-off and why mathematical penalties do not make all library combinations legal|Compare finite supported states; distinguish invalid configuration from a converged but worse model|
|LG05.O2|Reject target-derived/unavailable features and global preprocessing|Identify prediction-time availability and training-only/separate fold-training-only fit permissions|Trace row IDs and feature timestamps; repair a whole unfitted pipeline inside CV|
|LG06.O2|Reject a probability, odds ratio or association as a causal intervention or guaranteed future risk|Explain conditioning, calibration and population-shift limitations|Contrast equal-ranking/different-confidence cases and a shifted population; state what a prediction cannot establish|

Both atoms must be correct. Every gate is tested with each structurally valid wrong component while the other component and all remaining objectives are correct:36 failures across three forms at otherwise passing23/24.

**Log-loss protection is not a new gate:** arithmetic is LG02.O1, comparison with hard-label error is LG02.O4, and the paired LG02.O2 protects interpretation of label-dependent fitting/evaluation. Do not silently make O1/O4 critical or promise every arithmetic error blocks mastery. If the founder wants mandatory log-loss arithmetic beyond the approved six O2 gates, that would require an explicit objective/policy amendment; recommendation is to preserve the matrix.

## 4. Educational depth and mathematical conventions

Anchor in predicting churn within a stated future window from features available at the decision time. Introduce0=stays and1=churns explicitly. A documentation comparison uses fictional0=Good/1=Needs Improvement examples, clearly separate from churn labels and not production human annotations or LLM ground truth. House-price comparison explains that binary classification is not continuous price prediction; thresholding price changes the target question.

Each lesson follows real problem → visual intuition → prediction/experiment → mathematics → trusted Python → evaluation → comparison, with at least a worked numerical seed, a contrasting changed-condition case, terminology, units/shapes, misconception and bounded transfer.

- LG01: z=b+x·w is a dimensionless linear score/logit; p=1/(1+exp(−z)) estimates P(Y=1|x). z0 gives.5, z=ln3 gives.75. Odds p/(1−p), log-odds ln(p/(1−p))=z for0<p<1. A coefficient changes log-odds conditionally on other inputs; exp(w) is an odds multiplier per stated feature unit, not a constant probability change or causal effect. Distinguish an authored coefficient edit from an actually fitted model. Validate binary classes_ ordering and probability shape(n,2); select the positive-class column by class identity, not blindly by position. Labels have shape(n,).
- LG02: natural-log binary loss is −ln(p) for y1 and −ln(1−p) for y0; mean over evaluated rows. y1,p.5 gives ln2. For the unweighted one-row, unregularized illustration, dL/dz=p−y; a learning step uses training labels. This is not a claim that sklearn uses that one-row update as its optimizer. Same correct hard labels can have different probability loss; confidently wrong predictions are strongly penalized.
- LG03: p=[.2,.6,.8], threshold.7 gives[0,0,1]. Threshold equality predicts positive. Recompute counts, precision/recall and costs without changing p. High majority accuracy can hide missed positives. Compare the same IDs, named positive class and time/population boundary.
- LG04: a two-feature p.5 boundary can be x1+x2=2. Other thresholds move the corresponding score boundary; predictions remain linear in feature space, not necessarily a suitable curved separator. Scaling affects penalty geometry. Finite positive C controls inverse regularization strength under a declared reference objective. Do not equate C numerically with RG alpha or imply larger C is stronger shrinkage. Diagnose separation, large unstable coefficients and convergence warnings without promising finite unregularized coefficients.
- LG05: distinguish fit, predict_proba, predict and explicit thresholding; compare a DummyClassifier using identical rows/splits. Row alignment, deployment-time feature availability and fold-only preprocessing matter even with plausible scores.
- LG06: probability confidence/ranking, classification accuracy and calibration differ. Equal ranking does not ensure equal risk estimates; thresholds change accuracy without changing probability quality. Subgroup estimates on small samples are descriptive, not fairness certification. KNN/tree comparisons are mechanism-level supplied candidates only, not implementation of later algorithms.

### Metric and endpoint policy

Reuse mathematical conventions from [EV](verification/ev-phase-b/METRIC_CONVENTIONS.md), scoped explicitly to the new LG fixtures without modifying EV assets:

- Named positive class1; threshold rule p≥t. TP/FP/TN/FN refer to actual/predicted positive/negative. Confusion layout is actual rows[0,1], predicted columns[0,1]:[[TN,FP],[FN,TP]].
- Precision=TP/(TP+FP), recall=TP/(TP+FN). Zero denominator is a tagged undefined outcome, never silently0. If F1 is exposed, use2TP/(2TP+FP+FN), with its own zero-denominator tag. Accuracy=(TP+TN)/N; reject empty data. Costs are explicit finite nonnegative cFP·FP+cFN·FN, not learned from test labels.
- Mathematical endpoint loss: probability1 for the observed outcome gives0; probability0 gives positive infinity. Use tagged infinity, not a numeric JSON Infinity or a fake finite cap. Branch by the observed label to avoid undefined0·ln0 operations.
- Finite mathematical logits imply0<p<1; float rounding/overflow can produce apparent endpoints. Stable sigmoid/softplus arithmetic and separate endpoint diagnostic fixtures must distinguish exact mathematical outcomes from numerical saturation.
- Mathematical log loss is unclipped. A separately named sklearn float64-clipped result may be shown, using the approved profile's verified epsilon convention (EV uses2.220446049250313e−16). Reverify the local library behavior during LG freeze; never substitute clipped loss for mathematical infinity or turn a true zero into “undefined.”
- For p0/1, odds/log-odds have boundary limits, not ordinary finite values; reject p outside[0,1]. Finite-only numeric answers remain unchanged; endpoint/undefined reasoning uses choices or predefined slots.
- Preserve full-precision reference outputs; default finite parity/answer tolerance is absolute1e−9 plus relative1e−9; exact labels/counts/IDs/tags/tie behavior have no numerical tolerance. Display rounding must not determine grading.

These are scope/acceptance requirements, not a claim any new LG reference state was executed.

## 5. Two experiment fixture plans

### LG-E1 — score → probability → training signal (LG01,LG02,LG04)

Question: what changes when a coefficient, input or supported regularization state changes, and what remains a decision made after probability prediction?

Finite controls select authored input/weight cases or offline reference-trained states. Distinguish edited weights from fitted weights. Show a bounded sigmoid curve/score marker, exact ordered weighted contributions, z/p/odds/log-odds, observed-label loss and a tiny labeled gradient trace. Use one/two-feature boundary slices with explicit fixed coordinates and units. Include finite supported C/solver/penalty cases plus tagged unsupported diagnostics; no live optimizer or learner-supplied coefficients.

Predict before reveal, change a meaningful listed state, observe numerical/graphical effects, explain and transfer. A lower training loss or larger coefficient is not automatically better held-out performance. Authored gradients specify row, label, learning rate, scaling and penalty inclusion/exclusion; do not mislabel a toy step as sklearn solver parity.

### LG-E2 — fixed probabilities, thresholds and honest decisions (LG03,LG05,LG06)

Finite controls select threshold/cost and explicitly named fixed development-probability fixtures. At least one equality case, imbalance case, no-predicted-positive case and observed-label endpoint diagnostic must be covered. Include equal-hard-label/different-confidence predictions to separate accuracy from log loss, and equal-ranked/different-confidence comparisons for calibration caution. Diagnostics do not expand into a calibration-fitting course.

Reveal rowwise probability/label/action, TP/FP/TN/FN, precision/recall/accuracy, costs and mathematical probability loss with explicit undefined/infinite states. Changing threshold leaves coefficients/probabilities/loss unchanged. Compare baseline/model only on identical IDs. A named incorrect target-feature/global-fit/test-selected-threshold workflow is rejected even if its arithmetic score looks attractive.

Selection uses development rows/costs, never final-test targets; no learner control reveals final-test outcomes. Show eligibility for a later locked evaluation rather than claiming one has occurred. Include fit/probability provenance and timestamp/group boundaries. Accessible confusion/count/cost tables and concise text summaries must explain all visual information without hover, color or spatial layout alone.

### Freeze prerequisite

The approved package provides experiment designs, **not exact LG datasets, solver tuples, configuration counts, outputs or hashes**. Authoring them is a separate pre-implementation reference-freeze gate, as for RG. No exact state count is invented here.

For each manifest enumerate ≤64 complete configurations, immutable fictional input rows/IDs/units/classes, targets, controls, allowed joint tuples, expected outputs/tags, correct reasons/counterexamples, initial state, prediction choices, reset/transfer behavior, textual alternatives and version identifiers. Avoid accidental unreviewed Cartesian products. Keep input arrays rank≤2,total≤64 cells, dimensions≤32; tables≤32×8; plotted points≤64 with authored paths. No441-point mesh authorization.

During freeze, inspect the accepted local sklearn API and document explicit objective normalization (including any weighting), supported solver/penalty/C settings, intercept treatment, class ordering, tolerances/max_iter/convergence diagnostics, random seed and actual fit IDs. Prefer a narrow verified binary L2 workflow; unsupported combinations are diagnostic cases, not additional solver support. Exact parameter values are unverified authoring choices until reviewed. Do not copy RG alpha normalization or rely on library defaults without recording them.

Reference-trained probabilities must match decision_function/predict_proba under the pinned profile and independent sigmoid arithmetic. Authored weight/gradient cases require separate hand arithmetic. Every output, threshold count/metric and endpoint tag must pass trusted parity before expected values/hashes are frozen. Version changes need explicit review; no silent modification to EV/PR/RG manifests or answer codecs.

## 6. Evaluator, mastery, retry and persistence contracts

Reuse bounded finite choices, typed finite numeric answers and whole authored repair tuples. Correct equivalents require explicit accepted semantic IDs/tuples; no free-form explanation or symbolic/code equivalence inference. Unsupported representations receive format guidance; valid wrong answers receive conceptual feedback after grading is permitted. Numeric magnitude≤1e6; reject NaN/Infinity, Booleans, numeric/expression strings at the scorer, unknown/extra keys, unsupported versions and oversize/deep payloads.

Inherited limits:≤32 families/attempt,≤2 atoms/family,≤8 options/repair slots/accepted whole tuples;512B atom,1.5KiB family,64KiB submission,256KiB envelope,depth8. Snippets≤25 lines/4KiB. Read-only reference assets are not larger learner submissions. No learner Python/import/eval/exec, unrestricted expressions, shell, filesystem/network access, uploads, model deserialization or new hosted execution.

Mastery20/24 plus every paired O2 gate in one confirmed complete form. No partial-family points, evidence mosaics, completion/notebook/practice mastery or cross-module credential transfer. Enable only after verification. Preserve earlier same-version mastery after subsequent failures; correct objective gaps in a passing attempt remain truthful, not fabricated100% completion.

Lesson completion requires four correct practice families, changed meaningful predicted/revealed/explained lab interaction and a correct bounded transfer. Two valid practice submissions per variant/cycle; malformed representations do not consume grading. Exhaustion requires worked review and correct changed recall before explicit new cycle. Independent attempts are unlimited fresh A/B/C forms, not gate patches; no active correctness reveal, explicit review/confirmation, reload-to-active/reconfirmation. Targeted remediation recommends recall without imposing a new assessment route lock.

New isolated LG module key and exact schema/content/policy/assessment/fixture IDs must be frozen before coding; no migration/import from prior scopes. Validate/hydrate before writes; canonical bounded records, latest20 summaries, latest full response, retained prior mastery and immutable/idempotent attempt IDs. Corruption/future/foreign/stale records preserve original bytes. Quota/denial/stale-tab failure retains safe memory-only work with a truthful warning. No account sync, distributed atomicity or tamper-proof certification claim.

## 7. One reproducible notebook

Span all six lessons: binary prediction question/availability, hand logit/sigmoid/odds/loss, tiny authored training gradient, trusted scaled LogisticRegression fit, named class/output shapes, regularization/convergence, fixed-probability threshold/cost comparison, baseline, fold-local selection and one frozen final evaluation. Include guided debugging, changed examples and reduced-scaffolding reasoning, not API memorization.

Bundle small fictional data in the notebook with IDs, checksum, units, named classes and disjoint train/development/final-test partitions. Encode repeated-entity/time boundaries if used. No credentials, uploads, remote datasets or production labeling. Any supplied KNN/tree predictions remain explicitly authored comparison fixtures; do not fit or implement later algorithms.

Use the accepted tested local profile: CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1; nbclient0.11.0,nbformat5.11.1,ipykernel7.4.0; macOS15.6.1ARM64. Seed1729 where needed; exact folds/solver options recorded. No installation/update authorized by this checkpoint.

Require stable cell IDs, dependency/source/data hashes, expected structured results, explicit clipped-versus-mathematical loss and convergence evidence. Execute twice in fresh local kernels: matching deterministic structured outputs/stdout, no execution errors; disclose any permitted normalization rather than masking differences/warnings. Record actual environment and all assertions. Genuine Colab remains separately UNVERIFIED even if local runs succeed.

## 8. Acceptance criteria for eventual implementation

1. All24 objectives map to teaching, worked/contrasting cases,48 practice,72 independent and objective-specific feedback/remediation; odds/imbalance and correct output shapes are covered within the approved families.
2. All120 scored instances and every exposed manifest state match trusted Python/sklearn plus independent simple arithmetic. All fitted probabilities/shape/class alignment, sigmoid/loss/gradient semantics, threshold counts and costs pass; manifests regenerate with unchanged hashes.
3. Threshold equality p=t predicts positive, including endpoint diagnostics; p outside[0,1] rejects. Undefined precision/recall and divergent loss stay tagged; finite clipped library output never replaces mathematical infinity. Test floating saturation separately from exact endpoint fixtures.
4.19/24 fails and20/24 succeeds with all gates on each form;36 structurally valid critical-component failures block at23/24. Test unanswered atoms, no cross-attempt combination, prior mastery after later failure and idempotent confirmation.
5. Test fit/probability/threshold distinctions; inverse C and supported tuples; class order and row alignment; unavailable/target-derived features, training-only and separate fold-only preprocessing; development-only threshold/C selection; no final-test feedback.
6. Test numeric tolerance boundary/just-outside, accepted equivalents and invalid tuple mixtures, malformed/unsafe/oversize/foreign input and safe feedback. No evaluator-language extension.
7. Persistence/restoration, review reconfirmation, exhaustion/remediation, retries/history bounds, corruption, quota/denial/stale tabs, version/fixture isolation and zero earlier-module writes.
8. Complete frontend/TypeScript and Python regression suites, typecheck and production build. Preserve Math, Regression, all Python, original/full EV, PR and RG routes/content/formulas/assessment/evidence/notebooks. Hash protected sources; document only intentional additive discovery edits.
9. Actual keyboard selectors/predict/reveal/explain/reset/practice/review/confirm/retry, visible focus, accessible labels and concise announced outcomes;320px overview/all lessons/assessment/expanded numerical results without page overflow; back/forward and restored progress. No color/hover-only information.
10. Two fresh complete notebook kernels and expected outputs/checksums/profile. Report test counts, all final state counts/hashes, source equality, browser evidence and environment limitations. A source-identical isolated QA directory is allowed if original I/O persists, but cannot be reported as its repair.

## 9. Founder decisions, risks and stop

**Verified scope is consistent; implementation approval remains required.** Recommend approval of this boundary with a separate author/reference-freeze of LG-E1/LG-E2 before application coding. Exact fixture/solver/state-count/output choices are not yet verified; no blanket solver/dependency/scene-bound expansion is proposed.

Preserve the approved six critical IDs. The arithmetic-versus-critical log-loss distinction in §3 is explicit: request an amendment only if the founder wants arithmetic itself to become an additional mandatory gate. Otherwise no new scoring-policy decision is needed.

Carry forward OPEN: genuine screen-reader, genuine200%/400% browser zoom, genuine Colab and original-directory I/O reliability. Finite-bank recognition, client-editable origin-local progress, tiny fictional data and descriptive subgroup/calibration claims remain quality risks. Comprehensive audit and external learner testing remain deferred, not passed.

No implementation, fixture freeze/execution, notebook authoring/execution, dependency installation, learner-evidence change, mastery change, migration, deployment or subsequent algorithm work occurred in this scope review. Stop for founder approval.
