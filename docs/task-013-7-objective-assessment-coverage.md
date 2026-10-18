# Task 013.7 — Objective and assessment coverage

Implemented against the approved [objective matrix](task-013-lesson-objective-matrix.md) and [bounded specification](task-013-7-bounded-implementation-spec.md). Exactly20 families:19 essential and introductory/noncritical S05.O4. Every row has conceptual teaching, worked actual-reference code/numerical output, two practice instances, independent A/B/C instances and the named targeted remediation.

Canonical objective IDs: python.sklearn.<lowercase objective>; instances append .practice.a/.practice.b or .mastery.a/.mastery.b/.mastery.c. Assessment python.sklearn.mastery.v1. The frozen sklearn-learning.v1.json identifies all100 actual scored instances (40 practice,60 independent),20 worked and four experiment-only references;124 total. Separate numeric/categorical branch teaching assertions deepen S04 without adding scored instances/objectives.

| Objective | Teaching / measurable outcome | Independent check | Targeted remediation |
|---|---|---|---|
| S01.O1 **C** | Respect the unfitted/fitted lifecycle and training/evaluation boundary. | Repair predict-before-fit or test-fit ordering and explain learned state. | Follow constructor→fit(train)→predict(new). |
| S01.O2 | Predict a DummyRegressor training-mean baseline. | Select new baseline predictions and output length. | Compute the training target mean, not test mean. |
| S01.O3 **C** | Apply transform to new features without refitting. | Reject fit_transform on held-out data and justify transform. | Separate feature-state learning from prediction. |
| S01.O4 | Distinguish browser fixture simulation from real notebook execution. | Choose what evidence establishes an actual fitted estimator. | Inspect the notebook execution manifest and fitted attributes. |
| S02.O1 **C** | Compare a model against a training-fitted baseline on the same held-out rows. | Reject an unequal-split baseline comparison and explain the fairness boundary. | Align row IDs and training information for both predictions. |
| S02.O2 **C** | Choose and calculate an appropriate metric with units/denominator and reject majority accuracy as proof of positive-case detection. | Every form requires one regression metric/units decision plus an imbalance claim judged from the positive-case count table; the reason must justify the interpretation, not only name a metric. | Rebuild the per-row error/count tables in two staged examples before combining the decisions. |
| S02.O3 | Interpret default score cautiously and name the explicit metric. | Choose R² versus classification accuracy meaning in a supplied API trace. | Read the estimator task and metric definition. |
| S02.O4 | Separate improved validation metrics from causal/calibrated guarantees. | Select a limited conclusion from changed prediction vectors. | List which claims the data and metric actually measure. |
| S03.O1 **C** | Keep validation/final-test rows out of fold fitting with the correct split unit. | Reject a leaking or group/time-inappropriate fold plan and explain the boundary. | Color-independent fit/validate/test ID tables. |
| S03.O2 | Interpret negative loss scorers and aggregate declared fold scores. | Select mean MAE from signed scorer outputs. | Convert the sign before reporting units. |
| S03.O3 | Recognize limitations of small-fold variability. | Reject a universal-confidence claim from a few fold scores. | Compare sample sizes, overlap and data assumptions. |
| S03.O4 | Choose reproducible splitter settings without assuming shuffling always helps. | Match time/group/random scenarios to configured splitters. | Review the future-use question and entity/time order. |
| S04.O1 **C** | Place all learned preprocessing inside the cross-validated estimator. | Repair external fitting and explain fold-local state. | Revisit T05 arrows and S03 fold memberships. |
| S04.O2 | Select valid ColumnTransformer branches and explicit encoder configuration. | Choose a complete allowlisted pipeline repair. | Trace numeric/categorical types and output names. |
| S04.O3 | Predict the fit/predict output contract and compare trusted notebook results. | Choose expected result length/schema and fixture agreement. | Map held-out row IDs to prediction positions. |
| S04.O4 | Report execution, metrics and limitations honestly. | Reject browser-simulation-as-training or synthetic-generalization claims. | Compare the generated fixture and actual notebook run record. |
| S05.O1 **C** | Select candidates without using final-test feedback. | Repair a test-guided winner selection and justify validation-only choice. | Draw the selection/refit/final-test timeline. |
| S05.O2 | Apply a predefined comparable metric/split and tie policy. | Choose a winner or declared tie from changed CV score tables. | Compare identical folds and the stated tolerance/tie rule. |
| S05.O3 | Refit the chosen workflow and communicate a reproducible limited result. | Select the complete final report and held-out membership. | Use the notebook manifest, chosen parameters and provenance. |
| S05.O4 **I** | Interpret introductory model-comparison uncertainty without ranking guarantees. | Reject universal-superiority claims from a tiny synthetic margin. | Inspect fold variability and the need for later broader evaluation. |

## Mastery and critical evidence

Pass requires16/20 plus both atoms of S01.O1,S01.O3,S02.O1,S02.O2,S03.O1,S04.O1,S05.O1 in one confirmed independent attempt. All three real forms test15/20 failure,16/20 success with all gates,17/20 and20/20. Seven gates×two atoms×three forms=42 otherwise19/20 valid-wrong critical-component failures. Whole-response equivalence is respected when choosing genuinely wrong test inputs.

S02.O2's decision atom contains four mandatory slots: requested metric value, units, regression denominator and positive-case interpretation; its reason atom must explain both regression arithmetic and imbalance. Every form separately tests all four wrong subdecisions (12 subslot checks), as well as the reason through the42 component checks. Correct regression arithmetic cannot bypass a false claim about majority accuracy detecting positives. MAE/RMSE use $k; MSE uses ($k)^2.

S04.O1's two accepted repair tuples both restrict fit to the current fold training partition and put preprocessing inside the cross-validated estimator. The equivalent fold_train/local_train labels are allowed; global fitting/outside preprocessing is not. Numeric S03.O2 negates negative MAE scorer outputs before reporting mean positive MAE, using unchanged inclusive absolute1e−9+relative1e−9 grading.

Only a passing independent attempt awards module mastery and actually correct objectives. Failed attempts award none; later failure/history trimming/lesson reset preserve previously earned same-version mastery. No completion/practice/notebook, cross-module import, cross-attempt mosaic or synthetic real-learner award.

## Lesson/experiment inventory and recall

| Lesson | Finite activity configurations | Observable mechanisms and prerequisites |
|---|---:|---|
| S01 |8 |Constructor/unfitted/fitted/predict state; training-mean baseline; transform versus refit; actual execution versus browser trace. P05/Algebra mappings, NumPy dimensions, T01–T05 and Regression recall. |
| S02 |8 |Fair held-out baseline/model comparison, error/units/denominator arithmetic and actual positive counts, cautious score/causal/calibration claims. Regression losses, Statistics imbalance, pandas alignment and Visualization caution. |
| S03 |7 |Fold fit/validation/test IDs and statistics, signed loss means, random/group/time split units and fold variability. T05, Statistics and NumPy reductions. |
| S04 |4 |Same pipeline under changed test order, saved schemas and explicit invalid global-prefit counterexample. Numeric/categorical branches are worked individually first; T01–T06, pandas, NumPy and preserved Linear Regression. |
| S05 |7 |Training-only selection/refit/test timeline, same-fold metrics, tolerant tie preference and limited reproducible reports. S02–S04, Optimization validation and uncertainty recall. |

All34 states map to actual Python references and tested numerical/textual rendering. Cosmetic-only changes to S04's question label are deduplicated, so selecting a different wording cannot masquerade as an input change. Group/time and tie/prefit cases are explicit experiment-only presets, not extra independent scored instances.

Every lesson requires four demonstrated practice families and a meaningfully changed experiment with correct bounded prediction/explanation for completion, not mastery. Prerequisites guide backward recall; no new hard route locks. S05.O4 is visibly introductory/noncritical and does not introduce formal inference.

