# Task 015.8 — Random Forests bounded implementation specification

17 October2026 · Approved bounded scope and frozen references implemented under separate founder authorization. [Completion/evidence](TASK_015_8_COMPLETION.md). Historical authoring/authorization stop statements below describe earlier checkpoints,not current delivery status. No change to approved objectives or policies.

## 1. Verified authority and dependencies

Reconciled the [Supervised Learning Blueprint](SUPERVISED_LEARNING_BLUEPRINT.md), [implementation decision package](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md), [lesson/objective matrix](supervised-lesson-objective-matrix.md), [mastery/evaluator policies](supervised-mastery-and-evaluator-proposal.md), [visual experiments](supervised-visual-experiments.md), [algorithm coverage](supervised-algorithm-coverage.md), [quality register](CURRICULUM_QUALITY_REGISTER.md) and [accepted Decision Tree completion](TASK_015_7_COMPLETION.md). Their historical proposal/unimplemented headers do not override later founder acceptances.

Task015.8 is already assigned to **Random Forest regression and classification, RF01–RF05**; no identifier conflict or new task number is proposed. Prerequisites are **DT and EV**. Recall Python row identity/pipelines, means and class proportions, probability versus decisions, and regression/classification metrics contextually. RF builds on saved tree paths/leaves, training instability and honest evaluation. Prerequisites guide recall, not new route locks, mastery bypasses or evidence imports. Task014 remains the separate Project Learning Engine.

## 2. Exact approved allocation

| Deliverable | Verified requirement |
|---|---|
| Lessons | Five: RF01–RF05 in matrix order |
| Essential objective families |20: four per lesson |
| Practice |40: two instances per objective, A/B |
| Independent |60: three complete20-family forms A/B/C |
| Scored instances |100 total; paired atoms do not add family points |
| Paired critical gates |Five: RF01.O2, RF02.O2, RF03.O2, RF04.O2, RF05.O2 |
| Mastery |At least16/20 plus both atoms of every gate in one confirmed independent attempt |
| Core experiments |Two: RF-E1 and RF-E2; each at most64 reviewed combined states |
| Notebook |One reproducible Random Forest notebook, with regression and classification sections |

Exact fixtures,forest-size tuples,feature-sampling settings,outputs and hashes are frozen:RF-E1=41 and RF-E2=33 configurations. Application implementation uses those approved manifests without changing their mathematical semantics.

Approved fitted algorithms: RandomForestRegressor and RandomForestClassifier, explicit bootstrap/max_features/depth/n_estimators/seed/n_jobs=1. Reuse Decision Tree squared-error regression and Gini classification conventions; no new entropy-fitted variant is proposed. No ExtraTrees, boosting, SVM, MLP, capstone, production dataset collection or general ensemble workbench.

## 3. Exact lesson and objective mapping

IDs are the lesson plus column identifier; wording and order follow the approved matrix. All objectives are essential; only O2 is paired critical.

| Lesson | O1 | O2 — paired critical | O3 | O4 |
|---|---|---|---|---|
| RF01 — Diversity before averaging |Trace bootstrap rows and feature candidates|Explain why correlated trees reduce ensemble benefit without claiming independence|Distinguish bagging from sequential boosting|Identify seed versus sample variability|
| RF02 — Regression aggregation |Compute mean tree prediction|Explain variance reduction limits and reject tree spread as a calibrated interval|Compare forest/tree residuals|Identify extrapolation limitations|
| RF03 — Classification aggregation |Average aligned class-probability vectors|Distinguish probability averaging from hard-label majority with a counterexample|Apply a declared decision threshold|Compute cost-aware errors|
| RF04 — OOB and validation |Identify which trees exclude a training row|Reject OOB as a universal replacement for temporal/grouped validation|Compare n_estimators/depth/max_features on fixed folds|Repair a bounded forest workflow|
| RF05 — Importance and comparison |Read impurity/permutation evidence|Reject causal or unbiased-importance claims from a single plot|Compare forest, tree and linear baselines|Report latency, instability and subgroup limitations|

For every RF0N.OM author practice.A/B and assessment.A/B/C, with different numerical/data contexts and rotated distractors, not copied answer sequences. Every family needs motivation/definition, symbols, geometric or sampling intuition, worked and contrasting examples, ML application, practice, misconception feedback, objective-specific remediation and prerequisite recall. Full sequence: **Real problem → Visual intuition → Experiment → Mathematics → Python → Evaluation → Comparison**. Success means explaining a changed case, not recalling an API or answer position.

### Teaching depth and worked seeds

- **RF01:** Begin with an unstable housing tree after one training target changes. A bootstrap is a same-size draw of training row IDs with replacement, so duplicates are allowed and some rows are absent. An illustrative draw[A,A,C,D] from[A,B,C,D] has B OOB for that tree only. Random feature candidates at each split can reduce similarity among trees; they do not guarantee independent errors. Contrast bagging's independently fitted resampled trees with sequential error correction as a conceptual future comparison, without implementing boosting. Two identical trees provide no new error diversity. Repeated fixed seeds reproduce a configuration, not uncertainty across new samples.
- **RF02:** For one house, tree predictions[2,4,6] in100000 currency units average4. Compare same-row forest/tree residuals and held-out error. With equal marginal variance sigma² and equal pairwise correlation rho, Var(mean)=sigma²*(rho+(1-rho)/T), a bounded illustrative equal-variance/equal-correlation case, not a universal error formula. At rho=1 adding copies gives no reduction; unbiasedness, independence and universal improvement are not guaranteed. Tree spread is not a calibrated prediction interval. Averaging leaf constants does not recover linear extrapolation outside training regions.
- **RF03:** Name class0=stays and class1=churns in fictional churn data. Aligned tree p1=[.4,.4,.9] averages to17/30≈.566667, predicting1 at threshold.5, while hard labels[0,0,1] would majority-vote0. sklearn forest classification uses the former. Show a different threshold, confusion counts, costs and class imbalance on matching rows. Probabilities are model estimates, not automatically calibrated risk or causal effects. Documentation Quality can be a named application contrast, not a production-labeled dataset.
- **RF04:** For a training row, include only trees whose bootstrap draw omitted its ID in that row's OOB prediction. A row can have no eligible tree in a small forest; then prediction/metric contribution is unavailable, not automatically0. OOB is internal resampling evidence for the training population, not an untouched external test. It does not repair temporal/group leakage, global preprocessing or prediction-time unavailable features. Compare finite complexity settings using appropriate fixed development/CV splits; refit preprocessing and any learned selection within each training fold. Final test is evaluated after freezing, never used to choose forest size or stopping.
- **RF05:** Contrast impurity importance (training split reductions) with a held-out permutation score decrease using declared metric/sign/seed/repeats. Correlated predictors can share/substitute credit, so low permutation importance does not establish irrelevance; impurity importance can favor predictors with many split opportunities. A negative permutation score decrease is possible and not a negative causal effect. Compare forest/tree/existing linear baselines on identical held-out IDs and task metrics. Disclose prediction cost, subgroup sample sizes, training variability, shift and interpretability limits.

No duplicate Math/DT/Python course or training of a new calibration/uncertainty algorithm. Contextual recall may link existing lessons and notebook workflow examples.

## 4. Critical decision, reason and remediation

| Gate | Decision/calculation atom | Independently required reason/transfer atom | Failure/remediation path |
|---|---|---|---|
| RF01.O2 |Reject the claim that more identical/highly correlated trees necessarily provide independent ensemble benefit|Explain shared errors and the limited role of bootstrap/feature diversity without claiming independence|Compare identical versus differing tree predictions after a changed bootstrap/feature case; recall training instability|
| RF02.O2 |Reject guaranteed variance improvement or a calibrated interval inferred from tree spread|Explain correlation/common bias and why spread is not calibrated coverage on unseen outcomes|Work a changed correlated-tree average/spread example and distinguish uncertainty claims from held-out error|
| RF03.O2 |Choose the probability-average forest decision in a hard-vote counterexample|Explain aligned class vectors, averaging before class selection and why hard-label majority differs|Recompute a changed vector set, inspect class order and compare both aggregation methods explicitly|
| RF04.O2 |Reject replacing deployment-appropriate temporal/grouped validation with OOB alone|Identify the actual row/time/group or learned-preprocessing information boundary and a valid repair|Trace eligible OOB trees, contrast new-group/future evaluation, rebuild training/fold-only workflow and untouched test boundary|
| RF05.O2 |Reject causal or inherently unbiased/global importance from one plot|Explain training dependence, correlation/substitution or cardinality/held-out-score limitations in the changed case|Contrast impurity and permutation evidence for correlated predictors; state a supported, limited conclusion|

Either wrong atom fails its family and gate even at19/20. Require **30 valid-wrong component failures**: five gates × two atoms × three forms, all other atoms/families correct. Invalid input/parser rejection does not establish critical reasoning failure.

Bootstrap membership arithmetic is RF01.O1/RF04.O1, and leakage-safe workflow repair is RF04.O4: essential but not extra hidden critical gates. RF01.O2 protects diversity reasoning and RF04.O2 protects the invalid evaluation-boundary conclusion. Do not silently turn O1/O4 into additional mandatory gates. This preserves the matrix while connecting all critical reasoning to the mechanism.

## 5. Experiment and fixture plan — not frozen references

### RF-E1 — Diversity, averaging and OOB (RF01, RF02, RF04)

Fictional house-price training/development data with named features, units and stable row IDs. Approved finite controls choose a single tree or forest-size/feature-sampling state, query, or authored bootstrap case. Enumerate complete tuples before implementation; no accidental Cartesian-product expansion. Inspect per-tree resampled training IDs/multiplicities, saved-tree predictions, aggregate mean, leaf/residual differences, row-specific OOB membership/coverage and matching held-out errors.

Prediction prompt: which trees can predict this row OOB, what is the regression mean, and does this change guarantee better held-out error? Show one tree against several, two identical predictions against differing predictions, and a missing-OOB case. OOB aggregation must exclude every tree containing the query's training ID, including duplicate occurrences. OOB predictions are not predictions for a separately held-out query; distinguish these roles explicitly. Complexity controls change model structure, not arbitrary query labels.

Visuals: small resample-ID cards, membership counts, per-tree/mean prediction marks and finite train/development/OOB comparisons. Numerical/text alternatives list exact draws, tree IDs, predictions, denominator, eligible OOB count and error meanings. Select one tree for detailed inspection rather than render an unbounded forest. Never present tree spread as a confidence band with calibrated coverage.

### RF-E2 — Probability aggregation and importance limits (RF03, RF05)

Fictional churn training/development data with feature definitions and class0/1 meanings. Finite controls choose a supplied probability-vector counterexample, a reference-fitted forest/query state or an authored held-out permutation case. Different cases must be labeled as supplied arithmetic versus fitted output. Inspect each tree's aligned class vector, mean vector, library argmax and any separately declared action threshold, hard-label vote counterexample, cost-aware errors and importance evidence.

Prediction prompt: do probability averaging and hard-label voting agree, and what conclusion does the importance change support? Compare correlated versus less redundant features and a shuffled-feature score difference where reference evidence permits. No claim that every permutation lowers score or that importance proves intervention effects.

Visuals: aligned per-tree probability bars plus explicit fractions/means, decision/cost tables and paired original/permuted score displays. Text explains class order, ties, metric sign, selected threshold and what is not established. Show subgroup counts and limits, not just a colored ranking.

### Shared interaction and resource contract

Both labs require prediction and bounded reason before reveal, then a changed meaningful state and correct post-observation explanation/transfer for activity credit. Initially wrong predictions may recover. Changing controls clears stale revealed results; reset never removes mastery. Numerical tables/lists accompany every diagram; no hover/color/spatial-only meaning. Native keyboard controls, visible focus, concise status announcements, reduced motion and320px reflow are required.

Each lab has ≤64 reviewed configurations; default visualization ≤64 plotted sample points plus authored paths, not the unapproved21×21 mesh. Learner arrays/tables retain the stricter answer bounds below. Large model traces, if needed, are separately validated immutable assets and displayed selectively, not inserted into learner envelopes. Exact scene/tree/estimator sizes must be enumerated within these limits at freeze; no new asset-bound expansion is implied.

## 6. Numerical conventions required at reference freeze

These are explicit freeze requirements, not already verified output claims.

1. **Estimator tuples:** freeze every parameter, feature order, random seed, n_jobs=1, library version and class order. Use squared_error regression and Gini classification; inspect the installed API rather than rely on differing classifier/regressor defaults. Bootstrap=True for OOB examples; max_samples and replacement multiplicities are explicit. Freeze max_features meaning per split, candidate counts and actual tree seeds. No warm-start experiment unless separately approved; changing ensemble size must follow a specified reproducible fitting procedure.
2. **Sampling:** save actual per-tree bootstrap index sequences and distinguish multiplicity from unique-row coverage. Inspect public sampling attributes/source behavior in the pinned profile before claiming exact parity. Feature subsampling is per split, not necessarily one permanent subset per tree. sklearn does not expose every considered feature candidate through ordinary exported tree structure; label pedagogical candidate diagrams as illustrative unless independently instrumented/verified. Selected split features alone do not prove the full random candidate set. Respect library search-for-valid-partition behavior rather than assert a hard candidate count without verification.
3. **Regression:** unweighted mean of per-tree predictions, with consistent target units. Define leaf means, same-row residuals and MSE/MAE normalization; spread is descriptive only. Training/error variance, seed reproducibility and sampling uncertainty are different concepts.
4. **Classification:** align all probability columns to forest classes, explicitly handle missing classes in supplied cases, average probability vectors and then use the recorded class decision. Library argmax tie chooses first sorted class. A teaching/action threshold is separately authored as p_positive>=threshold; at p=.5 binary argmax tie may instead choose class0. Do not conflate the threshold action with sklearn predict. Freeze a worked equality counterexample and positive-class definition; never round probabilities before classification.
5. **OOB:** record eligible trees per row and their predictions, row-wise means/probability means, coverage counts and unavailable tags. No eligible tree means unavailable mathematical prediction, not0 or a fabricated probability vector. Inspect actual pinned-library warnings/default replacements separately; document any NaN/zero or aggregate-score difference instead of treating it as mathematical ground truth. Use explicit metrics on valid covered rows with the population/coverage limitation named, rather than silently relying on default R²/accuracy or replacing undefined metrics. Constant-target/absent-class/zero-denominator outcomes follow the existing explicit tagged conventions.
6. **Importance:** state impurity importance's training normalization/zero-split case. Permute an explicitly named held-out feature with fixed seed/repeats, preserving other columns/target IDs; define score(original)-score(permuted), scorer orientation and repeated summary. Development importance used for selection is part of selection, not independent final evidence. Final-test importance must not feed another feature/model choice. Correlated-feature counterexamples need genuine numerical evidence, not an assertion that low score always means redundancy.
7. **Boundaries and precision:** retain DT float32 feature-conversion/threshold-routing conventions and record any installed-library difference. IDs, membership, count and class topology are exact; floating values use declared absolute/relative tolerances (default1e-9 each) with display precision separate. Explicitly reject invalid counts/settings, nonfinite/missing unsupported inputs, OOB with bootstrap=False and unsupported parameter tuples. Learned preprocessing and model selection are training-only and separately fold-only; test rows cannot influence either.
8. **Reference evidence:** independently recompute means, vector aggregation, membership and simple metrics; compare every fitted state with trusted sklearn. Repeat generation in independent processes and require unchanged byte-identical manifests, stable IDs/versions and SHA-256 lock. Do not merely compare a JSON copy with itself. Distinguish authored semantic/provenance checks from what a library can verify.

## 7. Mastery, completion, retries and persistence

Use the existing approved independent architecture:16/20 plus every paired gate, one confirmed whole attempt, no partial-family points/evidence mosaics/cross-module transfer. Practice, experiment and notebook completion cannot award mastery. Preserve prior same-version passing mastery after later failures; retain missed noncritical-objective gaps rather than claim100% completion. Mastery is unavailable until complete implementation verification.

Lesson completion requires four correct practice families, a meaningful experiment cycle and a correct bounded transfer explanation. Practice allows two valid submissions per variant/cycle; invalid format consumes no graded attempt. After exhaustion, objective-specific worked feedback, changed recall and explicit new-cycle action are required. Independent access is not practice-locked; unlimited fresh IDs rotate complete A/B/C forms. No correctness feedback while active; review and explicit confirmation before final scoring. Reloaded review returns to active/reconfirmation. Failed gates receive targeted explanation and changed recall, not repair-in-place of an old attempt.

Plan a separate RF versioned scope using the existing supervised namespace; exact key/content/policy/assessment/fixture IDs must freeze before implementation. Read/write only that scope; no DT/Math/Python/Regression imports or migration. Hydrate/validate before write; canonical bounded envelopes retain latest20 compact summaries, latest response and earlier passing mastery. Confirm idempotently by immutable attempt ID. Reject corrupt/oversize/foreign/future records without deletion or reinterpretation. Quota/denial/stale-tab failures warn and use memory only; no distributed atomic-CAS/cross-device guarantee. Semantic changes require new versions and separate approved migration/archive policy, not silent regrading.

## 8. Evaluator allowlist and boundaries

Reuse the deterministic Family/Answer evaluator and immutable fixture replay. Allowed operations are finite authored row/bootstrap/OOB membership, means/residuals, aligned class-probability aggregation, declared thresholds/confusion/cost metrics, supplied diversity/complexity comparisons, importance-score differences, fit/split permissions and whole workflow repair tuples. No arbitrary forest/program interpreter or live learner model fitting.

Accept exact listed semantic choices, typed finite numeric answers and predefined complete repair tuples. Equivalent authored tuples receive equal credit; unsupported component combinations do not. Counts/IDs/tags are exact; floats use declared tolerance, not rounding. Decimal UI adaptation is separate from the scorer, which rejects numeric strings/expressions,Booleans,NaN/infinity,objects,unsafe keys,unknown operations/versions and oversize/deep structures. Distinguish unsupported representations from valid wrong mathematics where deterministic. Blank becomes wrong only after confirmation; malformed structure rejects atomically. Safe messages never echo malicious strings or internal stacks.

Inherited bounds:32 families, two atoms/family, eight options/slots/accepted whole tuples; atom512B,family1.5KiB,submission64KiB,envelope256KiB,depth8; snippets25 lines/4KiB; arrays rank≤2,dimensions≤32,total64 cells; tables32×8,strings120 characters; lab≤64 states. No arbitrary Python, unrestricted imports,eval/exec,general expression interpretation,filesystem/network/shell access,uploads,callables or model deserialization. Trusted notebook/reference code is outside the learner evaluator. Static checks do not certify arbitrary programs,causal effects,production generalization or reliable free-text explanations.

## 9. Notebook reproducibility requirements

One notebook using the established template: environment assertions; embedded fictional arrays,units,class labels,row/split/fold IDs,seed/checksum; DT/EV recall; manual bootstrap/OOB membership and aggregation; separate RandomForestRegressor/Classifier fits; explicit settings; one-tree baseline; depth/size/feature-diversity comparison; same-row error analysis; OOB coverage limits; held-out permutation interpretation; bounded repair and reduced-scaffolding transfer.

Fitted preprocessing belongs inside each training/CV fold. No final-test-guided hyperparameters,feature choice or ensemble stopping. Explain that sklearn classifier probability averaging differs from hard votes and that external threshold actions differ at ties. Do not fit boosting or a new calibration/uncertainty model. No credentials,paid services,external uploads,remote datasets or production collection.

Use the accepted local profile: CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1. Use explicit seed1729 and n_jobs=1 where reference fitting is randomized; record notebook/kernel tooling and platform. Two fresh local kernels must match normalized expected structured outputs with declared numerical tolerances and documented normalization. Genuine Colab remains a separate unverified gate, never inferred from local success.

## 10. Implementation acceptance criteria

1. Map all20 objectives to lesson explanation/symbols,worked and contrasting examples,40 practice,60 independent checks,feedback and remediation. Preserve exact five O2 gates and separate regression/classification semantics.
2. Verify all100 scored instances and every exposed lab/worked state with trusted references and independent arithmetic. Semantic leakage/causal claims require authored invariants; do not claim sklearn validates arbitrary provenance. Freeze/hash only after successful reference verification, then test byte-identical regeneration and unchanged locks.
3. Test bootstrap replacement,duplicates/omissions,actual per-tree IDs,feature-sampling conventions,tree-size controls and recorded seed/version behavior. Include identical/correlated-tree counterexamples without a false guarantee of independence or monotonic generalization.
4. Test numeric averaging,aligned class-vector averaging versus hard-label votes,argmax ties versus declared threshold equality,class-order handling and appropriate cost metrics. No silent hard-vote substitution.
5. Verify OOB eligibility and no-contributor tags,manual versus library numerical/warning behavior,coverage-aware metric denominators and invalid OOB settings. Test grouped/time boundary failures and separate training-only/fold-only preprocessing and selection permissions.
6. Test15/20 failure and16/20 success with all gates correct in each form; all30 valid-wrong gate-component failures at19/20; malformed/equivalent/unanswered answers; active-feedback suppression; review/reconfirmation; idempotent submit; retries/remediation; no evidence mosaics; prior mastery retention.
7. Test persistence/restoration/corruption/size/quota/denial/stale-tab/version isolation. No old module storage writes or migration. Client-side formative evidence is not a tamper-proof credential.
8. Run complete frontend/TypeScript and Python regressions,typecheck and production build; preserve all prior Math,Regression,Python,EV,PR,RG,LG,KN,NB and DT behavior. Source-identical isolated QA is an allowed recovery,with explicit hashes/differences and truthful original-directory limitations. Resource timeouts must not weaken assertions/mastery policy.
9. Verify keyboard navigation/native selectors,prediction/reveal/reset,focus/reconfirmation,320px reflow,visual/text numerical equivalence,stale-result clearing and cross-module progress isolation. Attempt genuine screen-reader/browser zoom where available; otherwise explicitly retain OPEN. No screenshot/viewport simulation substitutes for those checks.
10. Run notebook in two fresh local kernels with matching expected outputs and complete profile/dataset metadata. Genuine Colab remains OPEN until actually run. Update implementation/quality/coverage/mastery/notebook/accessibility records and completion report before stopping for founder review.

## 11. Findings, decisions and stop point

No conflict in task identifier,lesson counts,objective mapping,paired gates,threshold or prerequisite order. The founder's phrase classification voting is reconciled with the approved **probability-average** semantics,not a request to switch to hard majority. OOB and importance are already allocated objectives,not new lessons. No additional critical bootstrap-arithmetic or generic leakage gate is invented.

This checkpoint inspected the existing sklearn1.9.1 estimator signatures/predict documentation locally: regressor predicts tree means; classifier chooses the largest mean class probability. No model fit,reference parity,fixture freeze,notebook execution,frontend tests or implementation QA is claimed in this scope review.

The authorized reference freeze settles exact datasets/configurations,bootstrap/feature traces,OOB unavailable/library behavior and hashes. RF-E1 has41 states;RF-E2 has33. No numerical or policy conflict remains. The manifests,convention specification and lock are authoritative;implementation must not silently change them.

**Recommended next authorization:** separate application implementation against the approved scope and newly frozen RF-E1/RF-E2 manifests. No material curriculum/mastery decision is unresolved. Founder approval of the reference-freeze evidence and application phase is still required.

OPEN:genuine screen-reader,genuine browser zoom,genuine Colab,original-directory I/O reliability,finite-bank memorization/local editable evidence,tiny-data limitations and later comprehensive pedagogy/learner review. No application implementation,learner-evidence changes,mastery changes,deployment,external testing,database migration or subsequent algorithm work. Stop here for founder review.
