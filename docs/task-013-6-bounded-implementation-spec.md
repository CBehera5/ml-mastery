# Task 013.6 — Bounded Data Preparation implementation specification

Status: **FOUNDER APPROVED; IMPLEMENTED AND SUBMITTED FOR REVIEW.** Prepared 16 October 2026; subsequent founder authorization approved this exact scope. See [completion evidence](TASK_013_6_COMPLETION.md). The scope-verification wording below is the retained planning record, not current authorization status. Genuine accessibility/Colab obligations remain open.

## Authority and exact allocation

Sources: [approved blueprint](task-013-python-ml-blueprint.md), [lesson matrix](task-013-lesson-objective-matrix.md), [mastery/evaluator specification](task-013-mastery-and-evaluator-spec.md), [approved policy matrix](task-013-founder-policy-decision-matrix.md), [acceptance criteria](task-013-acceptance-criteria.md), [quality register](CURRICULUM_QUALITY_REGISTER.md), [013.5 completion](TASK_013_5_COMPLETION.md) and [architecture](ARCHITECTURE.md). Earlier “not authorized” notes describe implementation, not this newly authorized specification review.

| Deliverable | Approved allocation |
|---|---|
| Lessons | T01–T06, six; exact boundaries reproduced below |
| Objectives |24 essential families; canonical IDs python.preparation.t01.o1 through python.preparation.t06.o4 |
| Practice |Two instances per family,48 total; eight per lesson |
| Independent |Three complete24-family forms A/B/C,72 instances;12 per lesson |
| Total scored corpus |120 instances, not including worked examples, remediation or experiment-only references |
| Critical gates |Eight essential paired families, both components mandatory |
| Mastery |At least20/24 plus all eight gates in one confirmed independent attempt |
| Experiments |At least six meaningful prediction/change/reveal/explanation activities, one per lesson |
| Notebook |One full reproducible Data Preparation notebook |
| Historical effort allocation |Blueprint013.6:5–7 working days; not a new commitment or authorization |

No counts or objectives are added. There is no introductory T objective. Every objective below maps to teaching/worked examples, two practice instances, all three independent forms and its named remediation. Freeze exact authoring configuration counts, fixture/data hashes, accepted tuples and expected outputs before implementation acceptance; these are future authoring artifacts, not evidence of execution today.

## Exact lesson and objective contract

The following section is reproduced from the approved matrix, preserving prerequisites, motivation, worked anchors, misconceptions, checks and remediation. Prerequisites guide recall/navigation; they are not new hard access locks. T05 supplies its own fold primer, avoiding a forward dependency on S03.

## Data Preparation

### T01 Split observations before learning from them

**Prerequisites:** P03, D06; Statistics sampling/leakage.  
**Motivation and mental model:** Evaluation must respect the future-use question and unit of independence.  
**Progression beyond the worked example:** Compare fixed row split with group/time overlap and final-test-guided selection.  
**Key concepts:** feature, target, train, validation, test, group, time, random_state.  
**Mathematical connection:** Independent evaluation and sample-selection assumptions.  
**Worked example:** A fixed housing split uses 12 training IDs and 4 final-test IDs. Repeated observations from one customer must not be scattered across both sides of a customer-level generalization test.  
**Interactive tracing/debugging:** Move supplied row/group/time cards into candidate splits and identify exact overlap and information flow.  
**Misconception to confront:** A random seed does not prevent leakage or make every random split appropriate.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| T01.O1 **C** | Choose a split unit consistent with the intended generalization question. | Reject an entity/time overlap and explain the unit of independence. | Group row IDs by entity/time before splitting. |
| T01.O2 **C** | Keep the final test set untouched during preprocessing/model choice. | Reject a test-guided choice and justify a validation alternative. | Draw train/validation/test information permissions. |
| T01.O3 | Predict a deterministic fixed-ID or seeded split and its limitations. | Choose reproducible memberships without claiming representativeness. | Compare seed, ordering and split configuration together. |
| T01.O4 | Identify feature availability and target timing before modeling. | Exclude unavailable future information from a new record schema. | Build a prediction-time feature timeline. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 24 Data Preparation objective families, ≥20 correct and all 8 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

### T02 Fit missing-data rules on training data

**Prerequisites:** T01, D03.  
**Motivation and mental model:** An imputer learns a rule from training data, then applies that unchanged rule elsewhere.  
**Progression beyond the worked example:** Change only test values and verify the training median is unchanged.  
**Key concepts:** imputer, fit, transform, training statistic, missing indicator.  
**Mathematical connection:** Training-only medians and conditional missingness assumptions.  
**Worked example:** Train ages [10,missing,30] fit median 20. Test ages [1000,missing] transform to [1000,20], not [1000,1000].  
**Interactive tracing/debugging:** Change a test-only extreme value; verify the fitted training median stays fixed, then inspect transformed rows.  
**Misconception to confront:** Imputing before splitting leaks information; a fill value is not an observed fact.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| T02.O1 **C** | Fit imputation statistics using training observations only. | Repair a whole-dataset median fit and explain its leakage. | Separate fit rows from transform-only rows. |
| T02.O2 | Transform new/missing records with the saved training rule. | Predict values under a changed test batch. | Apply the unchanged fitted statistic explicitly. |
| T02.O3 | Choose and justify a missingness policy/indicator for the stated data. | Select an appropriate bounded policy and acknowledge its assumption. | Compare missing-pattern evidence and possible reasons. |
| T02.O4 | Handle all-missing or unexpected columns explicitly. | Choose a schema/error policy instead of silently deleting changing columns. | Inspect feature names and fitted output schema. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 24 Data Preparation objective families, ≥20 correct and all 8 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

### T03 Categorical encoding preserves a feature contract

**Prerequisites:** T01–T02, N03, D01.  
**Motivation and mental model:** Encoding creates a fitted coordinate vocabulary with an explicit unknown policy.  
**Progression beyond the worked example:** Compare a known category with an unseen category and arbitrary integer coding.  
**Key concepts:** category, ordinal, one-hot encoding, unknown category, fitted vocabulary.  
**Mathematical connection:** Coordinate representation; arbitrary category codes need not express distance.  
**Worked example:** Train plans [basic,pro] with fixed category order [basic,pro] encode basic=[1,0]. With handle_unknown='ignore', unseen team encodes [0,0], an explicit ambiguity rather than a new learned category.  
**Interactive tracing/debugging:** Toggle ordinal/one-hot recipes and a held-out category; inspect output columns, shape and unknown handling.  
**Misconception to confront:** Integer category codes do not automatically imply meaningful order; an unknown category must not refit the encoder on test data.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| T03.O1 **C** | Fit vocabulary on training data and apply an explicit unknown-category policy. | Repair test refitting and explain the chosen unknown output. | Inspect the saved category list and output column names. |
| T03.O2 | Predict one-hot output dimensions and column order. | Choose the encoding matrix for changed records. | Map each category to a named coordinate. |
| T03.O3 | Distinguish justified ordinal encoding from arbitrary numbering. | Reject a false distance/order claim. | Compare category semantics rather than numeric codes. |
| T03.O4 | Recognize unknown/drop-reference ambiguity without asserting identical meaning. | Choose a cautious interpretation of an all-zero row. | Review the encoder's fixed configuration and provenance. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 24 Data Preparation objective families, ≥20 correct and all 8 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

### T04 Scaling is a fitted coordinate transformation

**Prerequisites:** T01–T02, N06; Statistics scaling.  
**Motivation and mental model:** Scaling learns a coordinate system, not a batch-specific cosmetic adjustment.  
**Progression beyond the worked example:** Freeze train mean/scale, then change test values and a constant-feature case.  
**Key concepts:** mean, standard deviation, StandardScaler, fit/transform, zero variance.  
**Mathematical connection:** z=(x−μ_train)/σ_train; StandardScaler population variance versus sample variance.  
**Worked example:** Train [1,3] has mean 2 and population scale 1, giving [-1,1]. Test value 5 transforms to 3. Its presence must not change the training mean/scale.  
**Interactive tracing/debugging:** Change test values and units; inspect frozen train statistics and the transformed coordinates.  
**Misconception to confront:** Scaling is not fitted separately on each test batch; not every mathematical/runtime zero-variance policy is identical.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| T04.O1 **C** | Use training-only scaling statistics and correct denominator. | Repair a leaked or sample-denominator scaler and explain its coordinates. | Revisit population/sample variance and saved training parameters. |
| T04.O2 | Predict transformed values and inverse units. | Choose a changed test coordinate under frozen μ/σ. | Substitute into the stated transformation. |
| T04.O3 | Handle a constant feature according to pinned StandardScaler semantics. | Choose its documented scale/output instead of importing old runtime behavior. | Compare the library fixture with the separately preserved math-runtime guard. |
| T04.O4 | Explain that scaling does not itself prove better generalization. | Reject a performance claim based on nicer-looking feature ranges. | Separate numerical conditioning from held-out evaluation. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 24 Data Preparation objective families, ≥20 correct and all 8 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

### T05 Compose preprocessing without leaking across folds

**Prerequisites:** T01–T04; P05 function composition.  
**Motivation and mental model:** A pipeline controls which data each learned transformation may inspect.  
**Progression beyond the worked example:** Start with a two-partition fold primer, then compose typed branches and repeat fitting per fold.  
**Key concepts:** ColumnTransformer, Pipeline, fitted state, numeric/categorical branch, fold.  
**Mathematical connection:** Function composition with training-dependent parameters.  
**Worked example:** First define a fold as one temporary train/validation partition using two small row-ID lists; no sklearn CV API is assumed. Numeric columns then go through SimpleImputer and StandardScaler; categorical columns through an explicit category imputer and OneHotEncoder. Every learned step sees only that fold's training IDs before transforming validation IDs. S03 later expands this model into repeated folds and API syntax.  
**Interactive tracing/debugging:** Order allowlisted pipeline cards and inspect which row IDs each fit sees; branch output tables show feature order.  
**Misconception to confront:** A Pipeline name alone does not prevent leakage if it receives already-leaked features or was fitted before cross-validation.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| T05.O1 **C** | Choose a correct branch/order and preserve the final feature schema. | Repair a swapped encoder/scaler or externally fitted step and justify the order. | Trace raw types into each named branch. |
| T05.O2 **C** | Fit preprocessing inside each training fold, never on its validation rows. | Reject prefit whole-data preprocessing in a fold diagram. | Redraw fit/transform arrows per fold. |
| T05.O3 | Predict transformed column names/order and output shape. | Select the exact joined numeric/categorical feature table. | Read branch order and the encoder's fitted vocabulary. |
| T05.O4 | Distinguish fit_transform on training data from transform on new data. | Repair a second fit on evaluation rows. | Track learned attributes before/after each call. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 24 Data Preparation objective families, ≥20 correct and all 8 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.

### T06 Outlier policies and reproducible preparation reports

**Prerequisites:** T01–T05; D06, V04.  
**Motivation and mental model:** Outlier handling and reproducibility are recorded policies, not automatic cleanup.  
**Progression beyond the worked example:** Compare preserve/investigate/cap plans, then remove a seed-only reproducibility claim.  
**Key concepts:** outlier, clipping, fitted artifact, seed, provenance, policy, reproducibility.  
**Mathematical connection:** Robustness, sampling bias and explicit transformation parameters.  
**Worked example:** A supplied training-only cap is 50 years; a test age of 80 maps to 50 only under that recorded policy. Choosing a cap after checking which value improves final-test performance is leakage.  
**Interactive tracing/debugging:** Compare preserve/investigate/train-fitted-cap plans and choose a reproducible report with retained IDs and limitations.  
**Misconception to confront:** Outlier removal is not automatic cleaning; a seed alone cannot reproduce missing data/schema/library versions.

| Objective | Measurable outcome | Independent objective assessment | Targeted remediation |
|---|---|---|---|
| T06.O1 **C** | Choose an outlier policy without test-guided deletion or tuning. | Reject a favorable-test-score clipping policy and justify investigation/train-only choice. | Trace policy selection data and consequences for population coverage. |
| T06.O2 | Record fitted parameters, column order and dataset/version identities. | Choose a complete preprocessing report. | Compare a new transform with the saved artifact. |
| T06.O3 | Separate deterministic seeds from complete reproducibility guarantees. | Identify an unpinned ordering/library/data change. | Use the environment/data/seed checklist. |
| T06.O4 | Explain limitations and abstain on unsupported schema changes. | Choose an explicit incompatibility error rather than silently reordering features. | Return to D06 schema audit and T05 output contract. |

**Completion and mastery:** Four correct objective practice families plus the experiment evidence specified above; no mastery from completion. Independent mastery uses all 24 Data Preparation objective families, ≥20 correct and all 8 module C gates; only independently correct objectives receive objective mastery. Incorrect reasoning links first to this lesson's targeted remediation, then to the named prerequisite if necessary.


## Experiment implementation contract

Each activity uses finite authored configurations, keyboard-operable native controls (no drag-only interaction), a recorded prediction before reveal, a meaningful changed condition and a correct bounded explanation. Changing/revealing a configuration alone does not complete a lesson. Show row IDs, raw values, fitted parameters, transformed values, feature names/order, dimensions and fit/transform permissions as appropriate, alongside every graphical diagram.

| Lesson | Meaningful change and required explanation | Numerical/textual alternative |
|---|---|---|
| T01 |Compare supplied row/group/time partitions and prediction-time feature cards; explain entity overlap, future information and why final-test-guided selection is invalid. |Exact memberships, entity/time overlaps, availability timeline and information-permission table. |
| T02 |Change only a held-out extreme or missing value; explain why the saved training median stays20. Compare justified supplied missingness/indicator policies. |Fit row IDs/statistic, original and transformed cells, missing indicators and explicit schema/error states. |
| T03 |Compare finite supplied ordinal mappings and one-hot recipes; change held-out category and declared unknown/drop policy without refitting. |Named vocabulary, encoded rows, column order/shape, unknown/error tags and all-zero ambiguity. |
| T04 |Freeze training statistics, vary test values/units and a constant-feature preset; explain the transformed coordinate and its units. |Mean, population variance/scale, fit IDs, substitution, original/inverse units; constant scale1 example. |
| T05 |Order supplied numeric/categorical branch cards; compare per-fold fitting with a prefit whole-data counterexample. |Stage-by-stage fit IDs, validation-only transform IDs, learned attributes, branch order, final feature table/schema. |
| T06 |Compare preserve/investigate/supplied training-only cap and test-guided tuning; repair an incomplete provenance report. |Retained row IDs, cap50 and age80→50 under that policy, policy-selection permissions, complete data/environment/schema limitations. |

Invalid candidate recipes show named reference errors or information-flow violations, not fabricated successful arrays. Distinguish observed missingness from zero, imputation from fact, and numerical transformation from evidence of better generalization. Use realistic housing/feature preparation; supplied counterfactual score claims can be analyzed without fitting/evaluating models here.

## Critical gates and independent mastery

Exact gates: **T01.O1,T01.O2,T02.O1,T03.O1,T04.O1,T05.O1,T05.O2,T06.O1**. Each has two AND components: decision/calculation/repair and reason/counterexample. Correct arithmetic with leaked provenance or false reasoning fails the family. One binary point per family, never half-credit compensation.

| Gate | Explicit failure | Recovery path |
|---|---|---|
| T01.O1 |Entity/time overlap incompatible with generalization, or wrong independence explanation. |Regroup IDs/time; contrast a valid split unit. |
| T01.O2 |Final-test-guided choice or permission claim. |Redraw train/validation/test permissions and choose validation. |
| T02.O1 |Whole-data imputer fit or rationale allowing evaluation rows. |Separate fit/transform rows; recompute training-only median. |
| T03.O1 |Test-refitted vocabulary or incorrect unknown-policy reasoning. |Inspect saved categories/columns and apply fixed unknown policy. |
| T04.O1 |Leaked statistics, wrong variance denominator or false coordinate rationale. |Substitute saved training population parameters. |
| T05.O1 |Invalid branch/order/schema or incorrect type-flow justification. |Trace raw types through the named branches. |
| T05.O2 |Validation rows seen during fitting or acceptance of prefit leakage. |Redraw each fold's fit/transform arrows. |
| T06.O1 |Final-test-guided outlier removal/tuning or false coverage rationale. |Trace policy-selection data and justify preservation/investigation/train-only policy. |

Passing awards module mastery and only independently correct objectives. A failed attempt awards no new mastery; later failure preserves previously earned same-version mastery. No practice, lesson completion, notebook, prior-module import, synthetic test or evidence mosaic awards mastery. Availability remains withheld until the complete catalog/forms/gates are verified.

Reuse approved practice limits: two valid submissions per A/B variant per review cycle; invalid representations consume none. Exhaustion requires targeted walkthrough and correct changed-case recall before an explicitly labeled new cycle. Independent retries are unlimited fresh-ID A→B→C attempts, without cooldown/hard prerequisite locks. Active→review→explicit confirmation→results; no early correctness. Disclosed blanks count incorrect; malformed representations reject without scoring/form advance. Reloaded review returns to active and requires reconfirmation. Feedback identifies each failed gate and links directly to the table/matrix remediation.

## Evaluator allowlist and boundaries

Reuse unchanged finite choice/number/predefined repair-slot grading, scoring/evidence helpers and proven module-local controller pattern. Trusted author Python computes immutable fixtures offline; browser learner answers never reach Python.

| Allowed authored operation | Bounded surface |
|---|---|
| Split reasoning |Fixed row/entity/time membership diagrams and fixed-data train_test_split with explicit random_state42; exact ID/order/provenance checks. |
| Missing data |SimpleImputer median/most_frequent/constant, declared named indicators where taught; freeze explicit missing/all-missing/schema behavior against the pinned reference. |
| Categories |OneHotEncoder with fixed training categories/order, unknown error/ignore, drop None/first, sparse_output=False. Ordinal reasoning uses supplied finite mapping tables, not a new unrestricted OrdinalEncoder dispatcher. |
| Scaling |StandardScaler with_mean=True/with_std=True, population variance, fixed constant-feature cases and inverse-coordinate references. Preserve existing Math runtime zero-variance semantics separately. |
| Composition |Named ColumnTransformer branches and Pipeline/make_pipeline recipes; fit/fit_transform on authorized train IDs and transform on held-out IDs. Local fold partitions only. |
| Outliers/report |Preset clipping bounds for T06, preserved/investigate alternatives and fixed provenance/schema-report choices. No new learned clipping/search algorithm. |

No automatic feature engineering, model estimator/evaluation curriculum, cross-validation API curriculum, general quantile/cap fitting engine or arbitrary parameter combinations. Group/time reasoning does not add new splitter APIs. Any operation beyond the approved registry needs explicit review, not silent dispatcher expansion.

Answers: exact finite IDs/choices, finite typed numeric values or predefined complete slot tuples. Default numeric tolerance is inclusive absolute1e−9 plus relative1e−9; identifiers, row memberships, counts, feature order and types stay exact. No Boolean/numeric-string coercion. Missing/nonfinite/error states have explicit tags, never zero. Accept only authored equivalent whole tuples (maximum8), with positive and adversarial counterexamples; slot ordering may normalize but mixing incompatible tuple components is not equivalence. Disclose any rounding policy.

Reject malformed/unknown/duplicate/prototype keys, excess size/depth, extra slots, unsupported types and representations safely without grading or consuming valid attempts. Valid but conceptually wrong answers receive targeted feedback, not a platform-error label. Distinguish unsupported versus wrong only where deterministically established.

Bounds remain32×8 tables; arrays rank≤2, dimension≤32 and≤64 cells; strings≤120 characters; authored snippets≤25 lines/4KiB;≤64 states/activity;≤8 slots/options/accepted tuples;≤2 atoms/family;512-byte atom,1.5KiB family,64KiB submission,depth8 and256KiB persisted scope. Unsupported/content errors cannot fabricate mastery. Prohibit learner execution, unrestricted imports/expression interpretation, eval/exec, dynamic dispatch, files/network/shell access and uploads. This evaluator establishes bounded fixture reasoning, not arbitrary Python correctness, real-world causal validity or secure high-stakes proficiency.

## Notebook and trusted reference plan

One complete notebook covers all24 objective IDs with conceptual prompts, worked code, predict-before-run changes, assertions and remediation; optional local guided edits do not submit platform evidence. Reuse the existing notebook template and already approved exact isolated local profile, not the application environment.

Historical tested profile: macOS15.6.1 ARM64; CPython3.13.16, NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1; nbclient0.11.0,nbformat5.11.1,ipykernel7.4.0. These are the accepted tested profile, not a latest-version/security/Colab claim. Revalidate the lock/profile before the future run; no installation occurs in this scope review.

Embed/bundle small original fictional data with license/provenance, units, schema, ordered IDs and checksums. Canonical housing uses H01–H12 development-training and H13–H16 untouched final test. Any validation/fold IDs come only from the12 development IDs, with explicit memberships frozen during authoring. Final-test transform demonstrations cannot select policies or fit parameters. Separate tiny worked arrays preserve the approved anchors:
- Train[10,missing,30] median20; test[1000,missing]→[1000,20].
- Train[1,3], mean2, population scale1; test5→3.
- Constant train[4,4], scale1; test5→1.
- Unknown team→[0,0] only under declared ignore/no-drop category configuration.

Record seed42 where stochastic, exact order/split and fitted attributes/provenance, process PYTHONHASHSEED0 and single-thread numerical profile. No reliance on hash iteration or seed alone. No credentials, learner uploads, Drive, paid services or remote dataset dependency. No model fitting/comparison, CV scoring or capstone implementation.

Run canonical notebook twice in fresh kernels/clean working directories, assert complete frozen numerical/structural outputs and compare normalized results. Capture exact environment/locks, data/output hashes and logs. Apply60-second/cell,300-second/notebook,2GiB and1MiB result budgets; report actual enforcement/observations rather than claiming an arbitrary-code sandbox. Genuine free-CPU Colab requires its own actual setup/restart/run-all evidence and exact profile; an incompatible profile stays unverified pending separate approval.

## Persistence, isolation and preservation

Proposed new isolated scope follows existing naming: ml-math-lab:python:preparation:v1; schema1; content python.preparation.1.0.0; assessment python.preparation.mastery.v1. Pin policy/environment/data identities. No existing module evidence import, migration, rescoring or version relabeling.

Hydrate before writes; validate canonical versions, ownership, IDs, types, bounds and internally consistent evidence. Preserve corrupt/foreign/future/unsupported raw bytes with writes disabled and accessible recovery warning. Read/quota/write/stale-tab errors preserve prior durable state and visibly mark memory-only work. One bounded envelope write commits attempt/result/evidence with stable IDs, idempotent confirmation and no duplicate inflation. Latest20 compact summaries/latest full submission; history trimming cannot remove mastery.

Lesson reset requires scoped confirmation and cannot clear independent history/mastery. Separately confirmed module reset affects Preparation only. Local storage is origin-local/user-editable, not authenticated account synchronization, tamper-proof evidence or distributed CAS. A future migration requires separately approved explicit mapping and preservation tests.

Protect all Math Foundations, Regression, Essentials/P01, NumPy, pandas, Visualization, shared contracts and notebooks; hash pre/post existing sources/manifests and seed old progress for isolation tests. Prefer additive module-local files; only justified discovery links change existing UI. No dependencies, database migrations or shared architectural refactor are authorized by this specification.

## Future acceptance evidence required before implementation completeness

1. Coverage audit: exact24 essential objectives, six lessons,48 practice/72 independent, three complete forms, eight paired gates, motivation/math/units/worked examples/ML application/misconception/remediation and six meaningful activities. Review distractor plausibility, answer-position balance, changed-case transfer and output collisions.
2. Trusted Python parity: all120 scored instances, worked/remediation references used for grading and every exposed activity configuration; actual pinned sklearn/pandas/NumPy computations plus explicit ID/provenance oracle checks. Freeze full outputs/data/corpus hashes. Demonstrate that changing held-out data cannot change training/fold statistics/vocabulary; reject leakage even when numerical results coincide.
3. Split/schema adversaries: entity overlap, temporal availability, test-guided choices, fold-local fit/transform, wrong feature order, unseen/error/ignore/drop ambiguity, all-missing policy, constant feature and population/sample variance. Test pipeline order and each stage's learned attributes, not only final shape.
4. Mastery: all three forms19/24 failure and20/24 success with all gates correct, plus24/24. Test8 gates×2 components×3 forms=48 otherwise23/24 critical-component failures. No cross-attempt mosaic or synthetic learner awards; failed retries preserve earlier mastery.
5. Evaluator/retry: equivalent whole tuples, inclusive numeric boundaries, exact IDs/types/order, unsupported/malformed/duplicate/nonfinite/oversized inputs, invalid-not-consumed behavior, exhaustion/recovery cycles, blank disclosure, review confirmation, form rotation and targeted remediation.
6. Persistence: new/restore/active/review/results, corruption/future/foreign version isolation, quota/read/write/stale-tab failures, hydration-before-write, idempotence, bounded history, reset preservation and seeded existing-module evidence. Distinguish browser returning-learner journeys from unit/jsdom seeded tests.
7. Complete frontend/TypeScript and Python regression suites, typecheck and production build, with actual command/results/counts/logs. Preserve mathematical/runtime and Regression semantics; report pre/post source hashes and every justified old-file change.
8. Browser keyboard-only journey through all lessons/experiments and assessment active/review/failure/success/retry; native controls, visible focus, feedback focus and labels. At320px check all routes/assessment states, wrapping textual/numerical alternatives and named local code/table scrollers without page overflow. Record actual interaction evidence, not just DOM assertions.
9. Notebook: two fresh local kernels, complete24-objective assertions, full normalized output comparison, clean bundled-data provenance, no credentials/uploads/network-data requirement and recorded resource limitations.
10. Genuine screen-reader speech/navigation, genuine browser200%/400% zoom and genuine Google Colab remain **OPEN / NOT VERIFIED** until actual evidence. Attempt where feasible; unfinished obligations remain explicitly open, not replaced by AX snapshots,320px resizing or local kernels. Broader accessibility conformance, full Task017 depth audit and external learner testing remain separate obligations.

No implementation test, build, notebook or accessibility pass is claimed by this documentation-only review. Prior409 frontend/623 Python passes belong to Task013.5, not future Preparation verification.

## Founder decisions and stop

No material curriculum/count/mastery ambiguity was found. T05's local fold primer, T03's finite ordinal mapping comparison and T06's supplied cap stay inside existing scope without adding APIs. Exact authored configurations/outputs are acceptance artifacts to freeze during authorized implementation, not new curriculum decisions. A genuinely necessary operation/profile/policy expansion must return for approval.

**Requested decision:** review this bounded specification and separately authorize Task013.6 implementation. Existing totals remain25/36 lessons,100/144 families,26/41 gates and4/6 full assessments/notebooks. Preparation and scikit-learn are not implemented. No Task013.7 work, deployment, external learner testing, database migration or changes to existing mastery semantics.

