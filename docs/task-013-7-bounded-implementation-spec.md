# Task 013.7 — Bounded scikit-learn implementation specification

Status: **FOUNDER APPROVED; IMPLEMENTED AND SUBMITTED FOR REVIEW.** Prepared16 October2026; subsequent founder authorization approved this exact bounded implementation. See [completion evidence](TASK_013_7_COMPLETION.md). Scope-verification wording below is retained as the planning record, not current authorization status. Genuine screen-reader/zoom/Colab and broader curriculum-quality obligations remain open.

## 1. Authority, allocation and completion boundary

Read against the [approved blueprint](task-013-python-ml-blueprint.md), [objective matrix](task-013-lesson-objective-matrix.md), [mastery/evaluator policies](task-013-mastery-and-evaluator-spec.md), [approved founder policies](task-013-founder-policy-decision-matrix.md), [acceptance criteria](task-013-acceptance-criteria.md), [quality register](CURRICULUM_QUALITY_REGISTER.md), [architecture](ARCHITECTURE.md) and [Task013.6 completion report](TASK_013_6_COMPLETION.md). Historical pending-policy/earlier-module status notes do not revoke subsequent founder approvals.

| Deliverable | Verified approved allocation |
|---|---|
| Lessons |S01–S05, five; exact boundaries below |
| Objective families |20:19 essential, one introductory/noncritical S05.O4 |
| Practice |Two instances/family,40 total; eight/lesson |
| Independent |Three complete20-family forms A/B/C,60 instances;12/lesson |
| Total scored instances |100; worked/remediation/experiment-only references are additional authoring artifacts, not extra scored families |
| Critical gates |Seven essential paired families, exactly two AND scoring atoms each |
| Independent mastery |At least16/20 plus all seven gates in the same confirmed attempt |
| Experiments |At least five meaningful activities, one/lesson; exact finite state counts must be frozen during authoring, not invented here |
| Notebook |One full reproducible scikit-learn notebook, using the existing reusable template |
| Historical planning allocation |Blueprint013.7:5–7 working days; not a new effort commitment or implementation authorization |

Stable module key sklearn; lessons python.sklearn.s01–s05; objectives python.sklearn.s01.o1 through python.sklearn.s05.o4. Family IDs append .practice.a/.practice.b or .mastery.a/.mastery.b/.mastery.c. Assessment python.sklearn.mastery.v1. Every objective maps to teaching/worked examples, both practice instances, all three independent forms and its exact remediation below.

Task013.7 is the final approved implementation allocation of Task013: on successful later implementation, totals become36/36 lessons,144/144 families,41/41 gates and6/6 independent module assessments/full notebooks. This does **not** automatically confer learner track mastery, full accessibility/Colab acceptance, unrestricted programming certification, capstone delivery or platform-launch readiness. No aggregate mastery model is added.

## 2. Exact lesson/objective/prerequisite contract

The following lesson section is reproduced from the approved matrix without altering outcomes, depth markers, assessment checks or remediation. Recommended prerequisites form the existing progression; no new hard locks. Every lesson must motivate concepts before syntax, explain symbols/units/state and provide progressive worked numerical examples, ML purpose, misconceptions, prediction-before-reveal practice and success criteria.

## scikit-learn

### S01 The estimator lifecycle and a first baseline

**Prerequisites:** P05, T01–T05; Regression overview.  
**Motivation and mental model:** Estimators and transformers have learned state and different output contracts.  
**Progression beyond the worked example:** Trace constructor/fit/predict, then a separate transform-without-refit case.  
**Key concepts:** estimator, constructor, fit, predict, transform, fitted attribute, baseline.  
**Mathematical connection:** A model maps features to predictions; a transformer maps features to features.  
**Worked example:** DummyRegressor(strategy='mean').fit(X_train,[100,200,300]) predicts [200,200] for two test rows. Before fit it has no learned training mean.  
**Interactive tracing/debugging:** Step the supplied estimator state machine and compare model/transformer return shapes; no model is trained in the browser.  
**Misconception to confront:** Constructing an estimator is not fitting it; predict and transform are not interchangeable.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| S01.O1 **C** | Respect the unfitted/fitted lifecycle and training/evaluation boundary. | Repair predict-before-fit or test-fit ordering and explain learned state. | Follow constructor→fit(train)→predict(new). |
| S01.O2 | Predict a DummyRegressor training-mean baseline. | Select new baseline predictions and output length. | Compute the training target mean, not test mean. |
| S01.O3 **C** | Apply transform to new features without refitting. | Reject fit_transform on held-out data and justify transform. | Separate feature-state learning from prediction. |
| S01.O4 | Distinguish browser fixture simulation from real notebook execution. | Choose what evidence establishes an actual fitted estimator. | Inspect the notebook execution manifest and fitted attributes. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 20 scikit-learn objective families, ≥16 correct and all 7 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

### S02 Evaluate against a meaningful baseline

**Prerequisites:** S01; Regression metrics, Statistics imbalance.  
**Motivation and mental model:** A metric answers a specific evaluation question relative to a fair baseline.  
**Progression beyond the worked example:** Compute regression units, then inspect a majority-class baseline's missed positives.  
**Key concepts:** MAE, MSE, RMSE, accuracy, class balance, DummyClassifier, baseline.  
**Mathematical connection:** Error units and denominators; majority-class accuracy can be misleading.  
**Worked example:** Targets [100,200], predictions [120,180] give MAE=20, MSE=400 and RMSE=20 ($k). A 9:1 class split makes a majority predictor 90% accurate without recognizing positives.  
**Interactive tracing/debugging:** Compare fixed prediction vectors and a simple class-count baseline; choose a metric and honest claim.  
**Misconception to confront:** Training score is not test performance; sklearn .score depends on estimator and is not always accuracy.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| S02.O1 **C** | Compare a model against a training-fitted baseline on the same held-out rows. | Reject an unequal-split baseline comparison and explain the fairness boundary. | Align row IDs and training information for both predictions. |
| S02.O2 **C** | Choose and calculate an appropriate metric with units/denominator and reject majority accuracy as proof of positive-case detection. | Every form requires one regression metric/units decision plus an imbalance claim judged from the positive-case count table; the reason must justify the interpretation, not only name a metric. | Rebuild the per-row error/count tables in two staged examples before combining the decisions. |
| S02.O3 | Interpret default score cautiously and name the explicit metric. | Choose R² versus classification accuracy meaning in a supplied API trace. | Read the estimator task and metric definition. |
| S02.O4 | Separate improved validation metrics from causal/calibrated guarantees. | Select a limited conclusion from changed prediction vectors. | List which claims the data and metric actually measure. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 20 scikit-learn objective families, ≥16 correct and all 7 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

### S03 Cross-validation keeps validation inside training

**Prerequisites:** S01–S02, T05.  
**Motivation and mental model:** Cross-validation repeats train/validate boundaries inside the training set, not on the final test.  
**Progression beyond the worked example:** Inspect one fold, then all folds, scorer sign and a group/time counterexample.  
**Key concepts:** fold, KFold, GroupKFold, TimeSeriesSplit, cross_val_score, negative scorer.  
**Mathematical connection:** Repeated validation summaries; overlapping folds are not independent population experiments.  
**Worked example:** For six training IDs, a declared three-fold split validates two IDs per fold; final-test IDs never appear. neg_mean_absolute_error values [-10,-20,-30] correspond to MAEs [10,20,30].  
**Interactive tracing/debugging:** Inspect fixed fold IDs, preprocessing fit membership and sign-normalized scores; compare random/group/time split plans.  
**Misconception to confront:** Cross-validation is not permission to use final-test rows; a negative sklearn loss scorer is not a negative physical error.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| S03.O1 **C** | Keep validation/final-test rows out of fold fitting with the correct split unit. | Reject a leaking or group/time-inappropriate fold plan and explain the boundary. | Color-independent fit/validate/test ID tables. |
| S03.O2 | Interpret negative loss scorers and aggregate declared fold scores. | Select mean MAE from signed scorer outputs. | Convert the sign before reporting units. |
| S03.O3 | Recognize limitations of small-fold variability. | Reject a universal-confidence claim from a few fold scores. | Compare sample sizes, overlap and data assumptions. |
| S03.O4 | Choose reproducible splitter settings without assuming shuffling always helps. | Match time/group/random scenarios to configured splitters. | Review the future-use question and entity/time order. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 20 scikit-learn objective families, ≥16 correct and all 7 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

### S04 A complete train-fitted pipeline

**Prerequisites:** S01–S03, T05–T06; existing Linear Regression.  
**Motivation and mental model:** A complete pipeline is composed familiar contracts, not a new block of magic code.  
**Progression beyond the worked example:** Trace numeric/categorical branches separately before the complete fold-local model.  
**Key concepts:** make_pipeline/Pipeline, ColumnTransformer, SimpleImputer, OneHotEncoder, StandardScaler, LinearRegression.  
**Mathematical connection:** Compose fitted coordinate transforms and the existing linear prediction model.  
**Worked example:** Use the 12 training housing IDs for a named numeric/categorical preprocessing pipeline and LinearRegression; cross-validation fits the entire pipeline separately per fold; only the selected frozen workflow predicts the four final-test IDs.  
**Interactive tracing/debugging:** Repair a full author-owned pipeline template; inspect fitted row provenance, output schema and a saved trusted prediction trace.  
**Misconception to confront:** A pipeline is not a causal model or a shield against future-derived features; cross-validation outside the pipeline can leak.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| S04.O1 **C** | Place all learned preprocessing inside the cross-validated estimator. | Repair external fitting and explain fold-local state. | Revisit T05 arrows and S03 fold memberships. |
| S04.O2 | Select valid ColumnTransformer branches and explicit encoder configuration. | Choose a complete allowlisted pipeline repair. | Trace numeric/categorical types and output names. |
| S04.O3 | Predict the fit/predict output contract and compare trusted notebook results. | Choose expected result length/schema and fixture agreement. | Map held-out row IDs to prediction positions. |
| S04.O4 | Report execution, metrics and limitations honestly. | Reject browser-simulation-as-training or synthetic-generalization claims. | Compare the generated fixture and actual notebook run record. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 20 scikit-learn objective families, ≥16 correct and all 7 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

### S05 Compare models without choosing on the test set

**Prerequisites:** S02–S04; Optimization validation.  
**Motivation and mental model:** Selection and final evaluation are different experiments and must remain separated.  
**Progression beyond the worked example:** Apply a fixed validation rule, then refit and inspect a declared tie/limited claim.  
**Key concepts:** model comparison, selection, validation protocol, refit, final evaluation, uncertainty.  
**Mathematical connection:** Selection bias; one held-out score does not establish universal superiority.  
**Worked example:** Two declared candidates—DummyRegressor and the existing LinearRegression pipeline—are compared by training-only CV MAE. Select by the predefined rule, refit on the training set, then evaluate once on the untouched test IDs.  
**Interactive tracing/debugging:** Order comparison/refit/test/report cards; diagnose a test-guided candidate choice and select a cautious conclusion.  
**Misconception to confront:** The best test score cannot also serve as an unbiased final check after repeated test-guided selection; a tiny synthetic win is not a deployment certificate.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| S05.O1 **C** | Select candidates without using final-test feedback. | Repair a test-guided winner selection and justify validation-only choice. | Draw the selection/refit/final-test timeline. |
| S05.O2 | Apply a predefined comparable metric/split and tie policy. | Choose a winner or declared tie from changed CV score tables. | Compare identical folds and the stated tolerance/tie rule. |
| S05.O3 | Refit the chosen workflow and communicate a reproducible limited result. | Select the complete final report and held-out membership. | Use the notebook manifest, chosen parameters and provenance. |
| S05.O4 **I** | Interpret introductory model-comparison uncertainty without ranking guarantees. | Reject universal-superiority claims from a tiny synthetic margin. | Inspect fold variability and the need for later broader evaluation. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 20 scikit-learn objective families, ≥16 correct and all 7 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

## 3. Interactive experience and explicit cross-module connections

Browser activities are finite trusted-reference simulations, not browser training or arbitrary code execution. Each requires a prediction, meaningful changed input/scenario, reveal and correct bounded explanation; toggling or revealing alone is insufficient. Controls must be keyboard operable, never drag-only. Every state exposes numerical/textual alternatives.

| Lesson | Meaningful experiment | Required visible evidence and teaching connection |
|---|---|---|
| S01 |Step constructor→fit(train)→predict(new); compare an unfitted error, changed training target mean and transformer transform versus evaluation refit. |State ledger, learned attributes, authorized fit IDs, input/output shapes, predictions and named errors. P05 functions; Algebra mappings; T02/T04 saved transformation state. |
| S02 |Compare fixed baseline/model predictions on identical held-out rows; change errors/units and class prevalence/positive counts before reveal. |Per-row target/prediction/error and denominator table; MAE/MSE/RMSE units; majority predictions with positive-case detection counts. Regression losses, Statistics imbalance, NumPy reductions, pandas row alignment and Visualization honest claims. |
| S03 |Inspect one fold then all three; change random/group/time split scenario and prefit versus fold-local preprocessing; convert signed loss scores to positive MAE. |Fit/validation/final-test IDs, group/time order, learned-stage membership, raw scorer values and aggregation. T01/T05 permissions; Statistics sampling/variability; NumPy means. |
| S04 |Repair fixed numeric/categorical/model pipeline cards; vary missing/unseen/schema scenarios and external-prefit bug, then inspect a trusted prediction trace. |Typed branch sequence, encoder vocabulary/order, transformed feature names/shape, every fitted stage's row provenance and held-out prediction positions. T01–T06, pandas schema/joins, NumPy matrix predictions and preserved Linear Regression. |
| S05 |Order comparison→selection→refit→final-test→limited report; change supplied CV scores/tie scenarios and test-guided-choice counterexamples. |Identical candidate folds, sign-normalized mean CV MAE, declared tie rule, frozen candidate decision, refit IDs, four final predictions/metrics and limitations. Optimization validation, Statistics uncertainty and Visualization/causal caution. |

Stage S02 teaching: first one complete regression error/units calculation, then a separate9:1 majority count example, then combine reasoning. Do not introduce metric jargon solely in assessment. Stage S04 branches individually before the whole pipeline. S05.O4 remains introductory: cautious conclusions from tiny margins, not formal inference or a new uncertainty algorithm.

House-price preparation/modeling is the main coherent narrative. Bundled fictional Spam/Churn contexts support only approved simple classification-baseline/transfer reasoning; no capstone engine or new classification algorithm. Every cross-module recall points backward to existing material instead of repeating or modifying its mastery.

## 4. Critical mastery and leakage protection

Exact gates: **S01.O1,S01.O3,S02.O1,S02.O2,S03.O1,S04.O1,S05.O1**. This matches the existing pure policy registry in apps/web/app/python/foundation/assessment.ts; its presence is not implemented learner content.

| Gate | Must fail when… | Required recovery |
|---|---|---|
| S01.O1 |Predicting before fit, confusing construction with learned state, or fitting on evaluation targets; wrong state/boundary explanation. |Trace constructor→fit(train)→predict(new), identify learned attributes and permitted rows. |
| S01.O3 |Using fit_transform on held-out features or treating predict and transform as interchangeable; incorrect state rationale. |Separate feature-to-feature transformation from feature-to-prediction output; reuse saved training state. |
| S02.O1 |Model/baseline evaluated on unequal held-out IDs or fitted with unequal permitted information; accepting training score as unseen performance. |Align baseline/model training permissions and the same held-out target/prediction rows. |
| S02.O2 |Wrong metric/units/denominator OR false positive-detection conclusion from majority accuracy OR wrong combined rationale. |Rebuild staged per-row regression errors and positive-case count table, then combine decisions. |
| S03.O1 |Fold validation or final-test information enters fitting, or split unit violates customer/time generalization; wrong explanation. |Trace color-independent fit/validate/test membership and correct splitter scenario. |
| S04.O1 |Preprocessing fitted outside cross-validation on validation observations, even with a correctly cross-validated final estimator; wrong provenance rationale. |Revisit T05 arrows, then fit the complete estimator separately inside S03 fold training IDs. |
| S05.O1 |Candidates/preprocessing chosen from final-test feedback, or final evaluation reused to tune a winner; false selection explanation. |Draw validation-only selection→development refit→untouched final-test timeline. |

**No numerical score bypass:**16/20,19/20 or any otherwise passing score fails if any critical component fails. One binary point/family; both critical atoms use AND. No partial credit, cross-attempt mosaics, practice/notebook awards or imported mastery.

S02.O2 is already a compound critical family in the approved matrix: every form must require both a regression metric/units decision and an imbalance/positive-case interpretation. Encode required decisions as bounded slots inside the decision atom, with a second reasoning atom that justifies the combined interpretation. All required slots/subparts must pass; do not choose regression OR classification, replace the count table with a metric-name question, add a third atom or silently create another gate. Separately test wrong regression decision, wrong positive-case claim and wrong rationale on every form.

Only a passing independent attempt awards module mastery and independently correct objective mastery; missed noncritical families remain unmastered. Failed attempts award none; later failure preserves earlier same-version mastery. Mastery stays unavailable until complete lessons, catalog, forms and gates pass verification. Synthetic contract tests must not create real learner awards.

Lesson completion needs four correct practice families plus changed experiment with correct bounded prediction/explanation. Existing policies apply unchanged:
- Two valid submissions per A/B practice variant per persisted review cycle; invalid representations consume none.
- Exhaustion requires targeted walkthrough and correct changed-case/counterexample recall, then explicitly labeled new cycle; not a novel independent form.
- Independent active→review→explicit confirmation→results; no pre-submission correctness. Disclosed blanks count wrong, including critical atoms; malformed representations reject without scoring/form advancement.
- Unlimited fresh-ID retries A→B→C; no cooldown/hard prerequisite lock or lowered threshold. Review reload restores active answers and requires reconfirmation.
- Results show threshold, failed gates, worked correction and direct remediation; “passing percentage but critical failure” never looks mastered.
- Author variants change actual data/reasoning/boundaries, not only names or option order. Check distractor plausibility, answer-position balance, repeated source/output collisions and counterexamples where a wrong process accidentally gives correct numbers. Finite client-visible banks remain a documented risk.

## 5. Evaluator allowlist and safety contract

Reuse existing deterministic finite choice/finite typed number/predefined repair-slot adapters, scorer, evidence helpers, controls and proven module-local persistence/controller pattern. No general expression/parser or new production Python backend.

| Approved reference operation | Exact bounded purpose |
|---|---|
| DummyRegressor(strategy='mean') |Constructor/fit/predict and training-target-mean baseline; no new strategies/search. |
| DummyClassifier(strategy='most_frequent') |Simple class-imbalance baseline, accuracy and explicit positive-case count tables only; no new classifier curriculum, calibration, threshold search or probability API. |
| Existing LinearRegression |Fixed authored fit/predict configurations and approved pipeline candidate; reuse existing mathematical interpretation without changing Regression runtime/solver semantics. |
| Approved preprocessing |SimpleImputer declared median/most_frequent/constant rules, explicit OneHotEncoder category/order/unknown/drop/sparse_output settings, StandardScaler, named ColumnTransformer branches and Pipeline/make_pipeline. Preserve pinned missing/unknown/constant/schema semantics and training-only fit provenance from013.6. |
| Regression/classification evaluation |mean_absolute_error, mean_squared_error, root_mean_squared_error and accuracy_score; explicit units/denominators/counts. Estimator .score only for interpretation of regression R² versus classification accuracy; no new metric engine or blanket accuracy meaning. |
| Cross-validation |cross_val_score with explicit neg_mean_absolute_error; KFold(n_splits=3,shuffle=True,random_state=42), separate GroupKFold(n_splits=3,shuffle=False) and TimeSeriesSplit(n_splits=3) named scenarios with fixed IDs/groups/time order. No random_state on nonrandomized configurations. |
| Comparison/refit |Exactly DummyRegressor and the existing LinearRegression preprocessing pipeline; same training-only folds, mean CV MAE, approved numeric tolerance/tie preference, selected development refit and once-only final-test evaluation. |

Only immutable author configuration IDs/parameters and finite inputs are exposed; no arbitrary estimator parameters, dynamic method dispatch, extra metrics/models, hyperparameter optimization, AutoML, pickle/model uploads or external loaders. Trusted offline reference code and canonical notebook code are repository-authored; never execute learner-supplied source.

Default numeric grading remains inclusive abs(actual−expected)≤1e−9+1e−9×abs(expected). Exact dimensions/counts/row IDs/types/column and pipeline stage order remain exact. No numeric-string/Boolean coercion. Missing, unsupported, unfitted/error and nonfinite outcomes are named tags, not zeros. Disclose any rounding override. Equivalent answers use at most eight explicitly authored complete tuples; slot order may normalize by ID, but incompatible tuple mixtures, duplicate/unknown/missing required slots reject. Clearly distinguish unsupported representations from valid wrong reasoning where deterministically possible.

Bounds remain unchanged:≤25 lines/4KiB authored snippet; arrays rank≤2, dimension≤32, total≤64 cells; tables≤32×8; fixture-cell strings≤120 characters; at most eight transformation stages/slots/options/accepted tuples;≤64 finite states/activity;≤2 atoms/family;512-byte atom,1.5KiB family,64KiB submission, depth8 and256KiB persistence. Numeric input/intermediate bounds follow the existing evaluator specification. Reject code/import/URL/script/prototype/oversized payloads safely, never count malformed submissions as conceptual attempts. Learner-facing errors must not expose stack traces, machine paths or credentials.

Prohibited: arbitrary learner-code execution, eval/exec/general-purpose interpretation, unrestricted/dynamic imports, filesystem/network/shell/subprocess access, uploads and hosted notebooks. Evaluator proves bounded reasoning against reviewed references, not unrestricted program correctness, causal conclusions, runtime speed or generalization to a population.

## 6. Trusted notebook and reproducibility

One full scikit-learn notebook maps all20 objectives, worked examples, prediction/debugging prompts, remediation and actual fitted-state/output assertions. Reuse the existing template; trusted local execution must be explicitly distinguished from browser fixture simulation. No notebook download/run/self-attestation awards platform mastery.

Reuse approved exact local profile only for its tested environment: macOS15.6.1 ARM64; CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1 with the existing locked transitives; nbclient0.11.0,nbformat5.11.1,ipykernel7.4.0. No install/profile mutation occurs in this scope review. Future reference preflight must record actual versions/locks/platform/BLAS; stop on incompatibility instead of silently upgrading/downgrading. Earlier local success is not evidence that this not-yet-authored notebook passes or that Colab is compatible.

Data: preserve original fictional housing source/provenance/units/schema/hash. H01–H12 are development-training; H13–H16 are untouched final test. Explicitly quarantine target/future-derived features, align predictions to IDs and retain schema/encoder order. Small Spam/Churn fixtures are bundled/embedded original fictional transfer data with identities/checksums/permissions, not external downloads or capstones.

Required canonical workflow:
1. Question/availability/schema audit; show features versus targets and independent split unit.
2. Constructor/unfitted/fitted/transform/predict traces; training-mean baseline[100,200,300]→[200,200] for two new rows.
3. Staged metric anchor: targets[100,200],predictions[120,180] yield MAE20 ($k),MSE400 (($k)²),RMSE20 ($k). A9:1 majority baseline can achieve90% accuracy with zero positive detections; do not call MSE's units $k.
4. Freeze the same three KFold partitions on the12 development IDs for both candidate evaluations. Every learned preprocessing/model stage fits only each fold's training IDs, then predicts its validation IDs. Separate group/time scenarios explain when random folds are inappropriate.
5. Show sign normalization: illustrative neg_MAE[-10,-20,-30] means MAE[10,20,30], mean20; label illustrative scores, not invented actual housing CV results.
6. Compare only the two declared candidates by training-only mean CV MAE. Apply the existing abs-plus-relative tolerance (using the existing numeric adapter with the baseline as reference); within tolerance prefer DummyRegressor. Otherwise select lower MAE. Freeze decision before final-test access; no test-based tie break.
7. Refit the selected complete workflow on H01–H12, then return exactly four finite predictions in H13–H16 order and declared final metrics. Preserve a trusted full LinearRegression pipeline trace as required by S04, without selecting by its test performance.
8. Report dataset/environment/seed, candidate parameters, fold/stage fit IDs, column order, complete signed/normalized CV scores, tie decision, refit IDs, prediction/target/metric values and limitations. A small fictional win is not causal evidence, calibrated probability or deployment approval.

Base seed42 where stochastic; NumPy random.default_rng(42) and explicit sklearn random_state follow approved policy where appropriate; process PYTHONHASHSEED0 and numerical threads1 before imports, sequential n_jobs=1 where supported. Full data/order/configuration identity matters, not seed alone. Freeze complete actual outputs/hashes/tolerances during implementation rather than inventing prediction vectors/metrics now.

Two fresh kernels/clean workspaces must run all canonical cells in order, with no hidden state or crashing TODO. Assert analytic anchors and full frozen outputs, candidate/fold/provenance equivalence, finite values and exact ID/schema contracts; compare normalized results. Bound60seconds/cell,300seconds/notebook,2GiB process memory and1MiB result payload and report actual enforcement/observations, not arbitrary-code sandbox guarantees. No credentials, Drive, paid service/GPU, learner upload or remote data dependency. Keep any plotted figures structurally/numerically asserted and closed under Agg; no pixel-only grading.

**Genuine Colab remains OPEN / NOT VERIFIED.** Its own actual clean-session preflight/setup/restart/run-all evidence and exact supported profile are required. Local kernels cannot close it; incompatible kernel/dependencies require separately approved tested alternatives.

## 7. Persistence and preservation

Proposed separate scope follows existing architecture: ml-math-lab:python:sklearn:v1; schema1; content python.sklearn.1.0.0; assessment/mastery python.sklearn.mastery.v1. Pin existing policy/reference environment and authored data identity. No automatic imports/migrations from Mathematics, Regression or the five existing Python modules.

Hydrate before writes and validate canonical version/scope/ownership/IDs/bounds/evidence consistency. Preserve corrupt/future/foreign/unsupported raw bytes with writes disabled and accessible warning. Read/quota/write/stale-tab failures leave earlier durable bytes intact and mark in-memory work as unsaved. One bounded module-envelope write commits deterministic submission/result/evidence; stable IDs and confirmation idempotence prevent duplicate awards.

Retain latest20 compact histories/latest full submission plus bounded practice/recovery/activity/draft state. History trimming, later failure and confirmed lesson reset do not erase earned same-version mastery. Experiment reset clears controls; lesson reset is scoped/confirmed; separately confirmed module reset touches only sklearn. Future migrations require explicit approved mapping/provenance, never silent rescoring or aggregate upgrades. Local storage remains origin-local/user-editable, not account sync, tamper-proof certification or distributed CAS.

Prefer additive module-local files and justified discovery links; preserve existing shared evaluator/scorer, contracts, Math/Regression semantics, lessons, notebooks, dependency manifests and prior evidence. Record pre/post hashes and seeded old-scope byte preservation. No database, deployment, pricing or commercial configuration work.

## 8. Future implementation acceptance evidence

| Area | Required pass evidence |
|---|---|
| Exact coverage |Five lessons/20 families,19 essential plus introductory S05.O4;40 practice/60 independent instances; all outcomes/checks/remediation map exactly. Each lesson includes conceptual/math motivation, progressive examples, practical ML purpose and meaningful experiment. |
| Trusted parity |Every one of100 scored instances, worked/remediation references used for scoring and every exposed activity state recomputed using actual pinned sklearn/NumPy/pandas. Freeze corpus/source/data hashes and complete outputs. Browser TS definitions and outcomes must match reference meaning and declared tolerances. |
| Distinct variants |All objective practice/independent instances change meaningful input, reasoning or fault scenario; no identical source variants or option-only shuffles masquerading as independent evidence. Review output collisions/distractors/answer-position patterns. |
| Threshold/gates |All three real forms:15/20 fails,16/20 passes only with all gates,20/20 passes. Seven gates×two components×three forms=42 otherwise19/20 valid-wrong critical-component failure scenarios. No same-attempt bypass or cross-attempt mosaic. |
| Compound S02.O2 |On every form, separately fail wrong regression metric/units/denominator, wrong positive-case interpretation and wrong rationale. Valid regression-only reasoning cannot compensate for a false classification claim. |
| Fit/predict/unseen |Actual NotFittedError reference, constructor versus learned state, test-target fit rejection, transform versus predict schemas and refit-on-evaluation rejection. Wrong fit boundaries fail even when coincident numerical results look correct. |
| Baseline/metrics |Training-fitted baseline and model compare identical held-out rows/permitted information; training score cannot substitute. Verify MAE/MSE/RMSE/counts/units, default score meaning, imbalance and cautious noncausal claims. |
| CV/leakage |Complete pipeline fitted independently per fold; assert every learned stage's authorized IDs, no validation/final-test overlap, correct group/time units and chronology. Test global-prefit leakage, changed held-out values leaving fitted attributes unchanged, signed scorer conversion and honest fold variability. |
| Selection/refit |Same folds/metric for both candidates; fixed tolerant tie preference; selection frozen before test. Refits use only permitted development rows, final predictions align exactly to four test IDs; final-test feedback cannot change candidate/policy. |
| Evaluator/retry |Equivalent whole tuples, numeric tolerance boundaries/just-outside values, malformed/unsupported/duplicate/prototype/nonfinite/oversized input, partial drafts, valid-wrong feedback, invalid-not-consumed, exhausted practice recovery, blank disclosure, review/confirm/reload/idempotence and A/B/C retries. |
| Persistence |Fresh/returning learner draft/practice/activity/results; corrupt/future/foreign/schema isolation; read/write/quota/stale-tab failures; history bounds/mastery preservation and scoped reset. Distinguish real browser restoration from seeded unit/jsdom scenarios. |
| Full regressions |Full npm test, supported isolated Python pytest suites, npm run typecheck and npm run build. Preserve all Math/Regression/five Python modules; record actual command/count/logs/source hashes. No new production backend to satisfy “Python tests.” |
| Browser/accessible alternatives |Keyboard-only lessons, practice, experiment choices, feedback/focus, assessment active/review/failure/success/retry and recovery; native controls and no color/drag/hover-only meaning. Numerical state/fold/metric/prediction tables and wrapping text alternatives. Direct/invalid routes and Back/Forward/reload preserve scope. |
|320px |Overview, all five lessons and assessment/error/review/result/repair states without page overflow. Local code/table scrollers are named/focusable; explanatory content wraps. Viewport overrides reset afterward. |
| Notebook |Two fresh local kernels with matching20-objective/full workflow outputs, actual fitting, exact manifests/pins/row IDs/fold state and resource reports; no external data/credentials/uploads. |
| Integration closeout |Because this is the last planned Task013 module, run approved fresh/returning six-module production journeys and check all six assessments remain independent; update cumulative quality register and final Task013 totals without inventing a track-wide award. |
| Outstanding gates |Genuine screen-reader speech/navigation, genuine browser200%/400% zoom and genuine Google Colab remain OPEN / NOT VERIFIED absent actual evidence. AX/DOM,320px resizing and local kernels are not substitutes. Broader accessibility conformance, Task017 depth audit and external learner testing stay separately tracked. |

Implementation status, architecture, cumulative quality register, objective/assessment and critical-gate coverage, notebook evidence, accessibility obligations and completion report must distinguish implemented, automated-verified, scoped browser-verified and genuinely unverified requirements.

No tests/build/notebook execution or accessibility pass is newly claimed by this documentation-only scope review. Task013.6's423 frontend/782 Python passes are historical regression baseline, not Task013.7 results.

## 9. Decisions, risks and stop

No material lesson/count/gate/policy ambiguity found. The founder's emphasized fit/predict, unseen-data and leakage protections are already mandatory critical requirements; this specification makes their negative evidence explicit without adding gates or weakening thresholds. S02.O2's two-domain decision is supported by the approved matrix and stays within its two-atom contract. Classification remains the approved simple DummyClassifier/count interpretation, not an expanded classifier curriculum.

Exact finite configurations, datasets/output vectors, accepted tuples, fold memberships and hashes are implementation authoring artifacts to freeze against references, not invented verification evidence. Any genuinely necessary new operation/model/metric/profile/policy or significant architecture change must return for founder approval.

Risks: finite/client-visible banks and bulky choice representations may promote recognition; tiny fictional CV comparisons do not establish population superiority, causal effects or unrestricted coding proficiency. Actual transfer, variant difficulty and comprehensive depth remain later audit/learner-testing obligations. Keep genuine AT/zoom/Colab open.

Documentation-only audit passed: all20 objective/outcome/check/remediation rows match the approved matrix exactly; seven critical IDs match the existing policy registry;19 essential/one introductory,40/60 instance arithmetic and42 critical-component scenarios agree; local specification links resolve. All368 protected application/contract/Python/notebook/dependency files are byte-identical before/after, with no protected additions. No application tests or builds were run for this specification milestone.

**Requested decision:** review/approve this bounded specification, then separately authorize Task013.7 implementation. Existing implemented totals remain31/36 lessons,124/144 families,34/41 gates and5/6 full assessments/notebooks. Stop here: no application implementation, dependencies, migrations, deployment, external learner testing or subsequent task.

