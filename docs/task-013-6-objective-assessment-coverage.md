# Task 013.6 — Objective and assessment coverage

Implemented against the approved [matrix](task-013-lesson-objective-matrix.md) and [bounded scope](task-013-6-bounded-implementation-spec.md). Every objective is essential. Lessons expose the exact outcomes/checks/remediation below, worked numeric traces and deep conceptual notes before practice.

Every row maps to one worked reference, two practice A/B instances and independent A/B/C instances. Canonical IDs are python.preparation.<lowercase objective>; family IDs append .practice.a/.practice.b or .mastery.a/.mastery.b/.mastery.c. The frozen preparation-learning.v1.json identifies every actual code/configuration/result. Total24 worked +48 practice +72 independent +4 experiment-only references=148; all120 scored instances are verified against actual pinned Python libraries.

| Objective | Teaching / measurable outcome | Independent check | Targeted remediation |
|---|---|---|---|
| T01.O1 **C** | Choose a split unit consistent with the intended generalization question. | Reject an entity/time overlap and explain the unit of independence. | Group row IDs by entity/time before splitting. |
| T01.O2 **C** | Keep the final test set untouched during preprocessing/model choice. | Reject a test-guided choice and justify a validation alternative. | Draw train/validation/test information permissions. |
| T01.O3 | Predict a deterministic fixed-ID or seeded split and its limitations. | Choose reproducible memberships without claiming representativeness. | Compare seed, ordering and split configuration together. |
| T01.O4 | Identify feature availability and target timing before modeling. | Exclude unavailable future information from a new record schema. | Build a prediction-time feature timeline. |
| T02.O1 **C** | Fit imputation statistics using training observations only. | Repair a whole-dataset median fit and explain its leakage. | Separate fit rows from transform-only rows. |
| T02.O2 | Transform new/missing records with the saved training rule. | Predict values under a changed test batch. | Apply the unchanged fitted statistic explicitly. |
| T02.O3 | Choose and justify a missingness policy/indicator for the stated data. | Select an appropriate bounded policy and acknowledge its assumption. | Compare missing-pattern evidence and possible reasons. |
| T02.O4 | Handle all-missing or unexpected columns explicitly. | Choose a schema/error policy instead of silently deleting changing columns. | Inspect feature names and fitted output schema. |
| T03.O1 **C** | Fit vocabulary on training data and apply an explicit unknown-category policy. | Repair test refitting and explain the chosen unknown output. | Inspect the saved category list and output column names. |
| T03.O2 | Predict one-hot output dimensions and column order. | Choose the encoding matrix for changed records. | Map each category to a named coordinate. |
| T03.O3 | Distinguish justified ordinal encoding from arbitrary numbering. | Reject a false distance/order claim. | Compare category semantics rather than numeric codes. |
| T03.O4 | Recognize unknown/drop-reference ambiguity without asserting identical meaning. | Choose a cautious interpretation of an all-zero row. | Review the encoder's fixed configuration and provenance. |
| T04.O1 **C** | Use training-only scaling statistics and correct denominator. | Repair a leaked or sample-denominator scaler and explain its coordinates. | Revisit population/sample variance and saved training parameters. |
| T04.O2 | Predict transformed values and inverse units. | Choose a changed test coordinate under frozen μ/σ. | Substitute into the stated transformation. |
| T04.O3 | Handle a constant feature according to pinned StandardScaler semantics. | Choose its documented scale/output instead of importing old runtime behavior. | Compare the library fixture with the separately preserved math-runtime guard. |
| T04.O4 | Explain that scaling does not itself prove better generalization. | Reject a performance claim based on nicer-looking feature ranges. | Separate numerical conditioning from held-out evaluation. |
| T05.O1 **C** | Choose a correct branch/order and preserve the final feature schema. | Repair a swapped encoder/scaler or externally fitted step and justify the order. | Trace raw types into each named branch. |
| T05.O2 **C** | Fit preprocessing inside each training fold, never on its validation rows. | Reject prefit whole-data preprocessing in a fold diagram. | Redraw fit/transform arrows per fold. |
| T05.O3 | Predict transformed column names/order and output shape. | Select the exact joined numeric/categorical feature table. | Read branch order and the encoder's fitted vocabulary. |
| T05.O4 | Distinguish fit_transform on training data from transform on new data. | Repair a second fit on evaluation rows. | Track learned attributes before/after each call. |
| T06.O1 **C** | Choose an outlier policy without test-guided deletion or tuning. | Reject a favorable-test-score clipping policy and justify investigation/train-only choice. | Trace policy selection data and consequences for population coverage. |
| T06.O2 | Record fitted parameters, column order and dataset/version identities. | Choose a complete preprocessing report. | Compare a new transform with the saved artifact. |
| T06.O3 | Separate deterministic seeds from complete reproducibility guarantees. | Identify an unpinned ordering/library/data change. | Use the environment/data/seed checklist. |
| T06.O4 | Explain limitations and abstain on unsupported schema changes. | Choose an explicit incompatibility error rather than silently reordering features. | Return to D06 schema audit and T05 output contract. |

## Critical and threshold evidence

T01.O1,T01.O2,T02.O1,T03.O1,T04.O1,T05.O1,T05.O2,T06.O1 have exactly two AND atoms. The module scorer retains its unchanged20/24 plus all-eight policy. model.test.ts tests each real form at19,20,21,24 with all gates correct, and8 gates×2 components×3 forms=48 otherwise23/24 failures using structurally valid wrong choices/repairs, not only blank answers. Correct outcome plus a false leakage explanation fails. Missing/duplicate families and invalid representations reject.

T05.O2 accepts two explicitly equivalent complete boundary-repair tuples (fold_train/local_train plus transform), but neither with refit. Numeric T04.O2 uses the existing inclusive absolute1e−9+relative1e−9 rule, with finite typed numbers only. Unit tests verify accepted tuples, order equivalence, wrong mixtures, malformed/duplicate slots and invalid input without attempt consumption.

Live production evidence additionally records formA23/24 failing T05.O2's whole-development-prefit explanation, fresh formB20/24 passing all gates with four noncritical objectives left unmastered, restored results, and a later0/24 failure preserving previous mastery. No score combining, practice/completion/notebook mastery or cross-module import.

## Experiments and prerequisite coverage

| Lesson | Configurations | Observable reasoning |
|---|---:|---|
| T01 |9 |Row/customer/time independence; prediction-time features; development/final-test permissions; seed limitations. |
| T02 |7 |Frozen training median under test changes; zero versus absence; indicator, constant/mode trade-offs; all-missing schema. |
| T03 |7 |Fixed vocabulary/order/shape; finite ordinal comparison; ignore/drop ambiguity and explicit unknown error. |
| T04 |6 |Frozen training population statistics; inverse units; constant-feature scale1; no generalization guarantee. |
| T05 |9 |Typed branches; fold-local fitting versus invalid prefit; final feature order; second-fit rejection; raw-text scaling error. |
| T06 |6 |Supplied train-only cap versus preserve/investigate; complete provenance; seed/order limits; incompatible schema rejection. |

All44 states map to trusted references and render tested text/numerical alternatives. Native controls allow prediction/change/reveal/reason, not drag-only interaction. Metadata preserves the original prerequisites; teaching adds recall links to Algebra, NumPy, Statistics, pandas and Visualization. T05 teaches the temporary partition before fold reasoning; no S03 forward prerequisite or cross-validation API curriculum.

