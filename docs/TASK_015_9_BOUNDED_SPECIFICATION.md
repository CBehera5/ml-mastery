# Task015.9 — Gradient Boosting bounded specification

**Latest17 October2026:** founder approved this scope,external staged validation selection,the subsequent reference freeze and implementation. [Completion/verification](TASK_015_9_COMPLETION.md) records delivered scope and outstanding manual obligations. Planning/pending language below is historical;objective mappings and mastery policies are unchanged.

17 October 2026 · Scope verification only; implementation requires founder approval.

## 1. Authorities and disposition

Read against the [blueprint](SUPERVISED_LEARNING_BLUEPRINT.md), [implementation decision package](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md), [objective matrix](supervised-lesson-objective-matrix.md), [mastery/evaluator policies](supervised-mastery-and-evaluator-proposal.md), [experiment specification](supervised-visual-experiments.md), [quality register](CURRICULUM_QUALITY_REGISTER.md) and [accepted Random Forest completion](TASK_015_8_COMPLETION.md). Their GB allocations agree. Task015.9 is already allocated to GB; no new task identifier or curriculum expansion is proposed. Earlier RF review-pending text is historical following founder acceptance.

| Deliverable | Verified allocation |
|---|---|
| Lessons | GB01–GB06, six lessons |
| Objectives | 24 essential families; four per lesson |
| Practice | 48 instances: two per objective |
| Independent assessment | 72 instances: three complete 24-family forms |
| Total scored instances | 120; paired atoms do not increase this denominator |
| Critical gates | Six paired O2 families, one per lesson |
| Mastery | 20/24 AND both components of every gate, in one confirmed attempt |
| Experiments | GB-E1 and GB-E2; each at most 64 reviewed configurations |
| Notebook | One reproducible Gradient Boosting notebook |

Prerequisites are DT, LG and EV, with contextual gradients/loss recall. RF supplies the bagging comparison, not a changed prerequisite order. Recall NumPy shapes, pandas row alignment, preparation fit boundaries, visualization and regression metrics where used. No new route lock, prerequisite mastery transfer or repetition requirement is authorized. SVM and later modules are outside scope.

## 2. Exact lesson/objective mapping and teaching plan

O1–O4 below preserve the approved matrix; only O2 is critical. Every lesson must follow real problem → visual intuition → experiment → mathematics → Python → evaluation → comparison. Each objective needs teaching, a worked and contrasting case, both practice variants, all three independent forms and targeted remediation. Bundled fictional housing and churn contexts support learning; Documentation Quality is an application comparison, not permission to collect or label production data.

| Lesson | O1 | O2 — paired critical | O3 | O4 |
|---|---|---|---|---|
| GB01 — Sequential correction | Trace an additive model by stage | Distinguish sequential loss correction from independent tree averaging | Explain learning rate and base-learner complexity | Identify which rows fit each stage |
| GB02 — Squared-error regression | Compute residuals and an update | Explain negative gradients for squared loss and predict a corrected value | Calculate changed training loss | Recognize outlier sensitivity |
| GB03 — Classification loss | Compute sigmoid and a supplied log-loss gradient | Explain why classification updates logit/loss gradients, not raw class-label residual regression | Convert updated scores to probabilities | Distinguish score, probability and label |
| GB04 — Stage count and stopping | Read fixed stage train/development curves | Choose stopping on permitted development data without touching final test | Compare rate×stage trade-offs | Identify an overfit tail |
| GB05 — Workflow and leakage | Reconstruct preprocessing/fit order | Reject cross-fold/global preparation or test-based stopping and explain leakage | Repair bounded regression/classification pipelines | Select task-appropriate loss/metric |
| GB06 — Compare and diagnose | Compare forest/boosting residual and confusion evidence | Reject causal/guaranteed-best claims and identify sensitive/noisy targets | Explain feature importance limitations | Report fit cost, calibration and shift caveats |

| Lesson | Motivation, worked progression and practice | Misconception → targeted remediation / success |
|---|---|---|
| GB01 | Remaining house-price errors motivate another learner. Trace f0=3, h1=2, learning rate .1: f1=3.2; then inspect changed stage targets. GB-E1 contrasts a forest mean with an additive sequence. Python shows a named regressor and staged predictions. | “All trees independently fit the original targets” → label the target and allowed training row IDs at each stage; correctly explain sequential dependence. |
| GB02 | On y=5, f=3, residual=2, inspect a supplied correction before calculating 3.2 and its new squared error. Compare outlier and ordinary-row loss contributions. Connect gradients to loss descent and held-out residuals. | “Lower training loss proves generalization” → compare the same stage's development error; explain why a noisy outlier can dominate squared loss. |
| GB03 | Churn classification needs probabilities, not numeric class regression. With y=1, p=.5, negative logit-loss gradient is .5. Trace a supplied score update, sigmoid and threshold separately; compare actual classifier leaf updates in GB-E2. | “The correction is a class label/probability” → identify raw score, gradient, fitted leaf output, probability and label with separate units/domains. |
| GB04 | Read staged train/development curves including a development minimum at stage 4 and an overfit tail. Compare rate/stage settings rather than assuming equal rate×stage gives equal models. | “Choose the lowest test loss / more stages always help” → identify authorized development rows, select without test feedback, and explain final-test purpose. |
| GB05 | Repair authored regression/classification pipeline sequences. Trace learned preprocessing inside each training fold and stage training rows; choose a metric matching the task. Simple trees do not intrinsically require scaling, but any fitted preprocessing still obeys split boundaries. | “Global preparation is safe because the model never sees test labels” → contrast global statistics with training-only and separately fold-only fitting; reject both test-based stopping and cross-fold leakage. |
| GB06 | Compare forest and boosting on the same permitted folds and noisy targets, using residual/confusion evidence plus cost. Explain importance versus causality and discrimination versus calibration. | “Best here means universally best / importance is causal” → state noise, shift, calibration, feature-importance and evaluation uncertainty limitations. |

Symbols must be introduced before formulas: F is the current prediction/raw classification score, h a fitted weak learner, eta the learning rate, m the stage index, y the target, p the positive-class probability. Worked examples precede independent assessment; bounded transfer reasoning, not API-token recall alone, is required.

## 3. Critical gates and failure paths

Each gate has a decision/calculation atom AND an explanation/transfer atom. Either wrong fails the family and module gate even with 23/24 overall. These are the existing mappings, not additional gates.

| Gate | Decision/calculation and reason/transfer | Failure → remediation |
|---|---|---|
| GB01.O2 | Identify sequential correction; explain dependence on current loss/predictions rather than independent averaging | Independent-original-target claim → contrast two stage-target traces with a forest aggregation trace |
| GB02.O2 | Give the squared-loss gradient correction and updated prediction; explain its loss meaning | Wrong sign/normalization or probability confusion → revisit named loss derivative and a supplied numerical step |
| GB03.O2 | Identify the classification score/gradient update; explain why raw-label residual regression is incomplete | Treat probability/label as logit or tree leaf as automatically y−p → separate quantities in a worked score trace |
| GB04.O2 | Select stage using development evidence; explain untouched-test restriction | Test-selected stage or automatic more-is-better claim → annotate data roles and overfit tail |
| GB05.O2 | Reject global/cross-fold fit or test stopping; explain which information crossed a boundary | Training-only mistaken for fold-only safety → trace fit IDs for each fold and refit workflow |
| GB06.O2 | Reject universal/causal claims; identify noisy/sensitive targets and justified limitation | Importance-as-causality or guaranteed winner → compare controlled noise/shift cases with matched evaluation |

Feedback names the failed atom, gives a contrasting worked case and recommends changed prerequisite recall. Reassessment is a fresh whole independent form, never patched gate evidence.

## 4. Experiment and fixture plan — not a reference freeze

Exact datasets, parameter grids, configuration counts, seeds, expected outputs and hashes are not yet authored or verified. Do not invent these from the planning totals. Separate reference-freeze authorization should precede application implementation. Every exposed state, including invalid/undefined diagnostics, counts toward the existing maximum of 64 per experiment. No continuous controls may expose unreviewed states.

### GB-E1 — Stagewise regression correction

- Objectives: GB01, GB02, GB04 and GB06. Prerequisites: residuals, squared error, gradients, tree leaves and held-out evaluation.
- Fictional housing train/development fixtures with stable row/feature/target IDs; final test sealed from controls. Include contrasting noisy-target evidence and a fixed bagging comparison under the same evaluation protocol.
- Allowed controls: finite authored learning-rate and stage choices in immutable GradientBoostingRegressor squared_error traces. Depth/weak-learner complexity is explained using authored comparisons; no unrestricted model training or grid search.
- Predict before reveal: residual sign, next prediction or expected train/development behavior using a finite answer; change a permitted state, predict, reveal, inspect, explain. A visit or reveal alone is not meaningful completion.
- Output: initial prediction, stage training targets, per-tree corrections, eta, before/after predictions, residuals, named training loss/MSE and development curve. Show a counterexample to monotonic development improvement; never manufacture that empirical effect if the frozen dataset does not demonstrate it.
- Accessibility: numbered stage trace, labeled controls, target/prediction/residual tables, textual changes and selected-stage summary; plots are supplementary. Large immutable traces remain outside learner envelopes.

### GB-E2 — Classification gradients and safe stopping

- Objectives: GB03–GB06. Prerequisites: sigmoid, log-loss, score versus probability, thresholds and fit/predict boundaries.
- Fictional binary churn train/development fixtures with explicit positive label/class order, plus finite allowed/rejected fit-boundary cases. No production data, credentials or uploads.
- Allowed controls: reviewed classification stage/rate and fit-boundary scenarios from GradientBoostingClassifier log_loss traces; no arbitrary threshold/parameter/expression input. Replay is labeled reference-trained, not live fitting.
- Predict before reveal: score/probability direction or authorized stopping decision, then reveal score, sigmoid probability, classification/confusion evidence and stopping provenance. Explain why accuracy can conceal probability-loss deterioration.
- Output: initial score, supplied loss gradient, actual fitted leaf correction, stage score/probability, named train/development loss, evaluation row IDs and correct/rejected boundary explanation. Compare bagging probability averaging with sequential score addition without conflating their mechanisms.
- Accessibility: numerical stage and confusion tables, explicit label/threshold text, concise explanation of every change and textual rejection messages. Never encode correctness solely in color, geometry or animation.

## 5. Numerical contracts to freeze before implementation

1. Regression: distinguish reported MSE from half-squared loss L=(y−F)^2/2, whose negative gradient is y−F. Full squared-loss gradient has a factor of two. Pin estimator normalization, initial training mean, sample weights (if any), actual leaf values and F_m=F_(m−1)+eta*h_m.
2. Binary classification: p=sigmoid(F), log-loss=−y log(p)−(1−y)log(1−p), negative gradient with respect to F is y−p. The illustrative one-point gradient is NOT the fitted classifier's terminal-leaf adjustment. Export and independently check the library's actual leaf update, score and staged probability; pin initialization/prior handling. Never imply initialization is always zero.
3. Proposed stopping realization: external staged development comparison with internal early stopping disabled, clearly distinct from library patience/tolerance stopping. Freeze permitted rows, stage candidates and equal-loss tie rule. CV selection must fit preprocessing and models separately within every training fold; final test is never a control or source of hyperparameters.
4. Freeze explicit losses, tree/split constraints, feature ordering, seeds, sample weighting/subsampling, class ordering, threshold equality, probability endpoints, library clipping versus mathematical infinity, undefined metric tags, tolerances and display rounding. Reuse approved EV/LG conventions rather than silently changing them. No implicit reliance on changing defaults.
5. Reject unsupported states, unknown IDs, nonfinite inputs and invalid boundaries safely. Tagged undefined/infinite reference outcomes are not valid finite numeric answers and are never silently zero.
6. Independent arithmetic must verify initialization, gradients, updates, loss and aggregation, separately from checking actual sklearn staged outputs. Semantic leakage/causal conclusions need authored provenance invariants; sklearn parity alone cannot establish them.

The installed approved sklearn1.9.1 constructor signatures were inspected read-only during this review: both named estimators expose staged-model controls and n_iter_no_change; no fits or parity verification were performed. Exact numerical conventions above remain a reference-authoring checklist, not frozen outputs. No HistGradientBoosting, external boosting libraries, multiclass expansion or new learner operation language is proposed.

## 6. Mastery, evaluator and persistence contract

- Enable mastery only after complete verification. Require 20/24 plus all six fully correct paired gates in one confirmed attempt; no partial family credit or cross-attempt mosaics. Failed attempts award no new objective mastery; later failures preserve earlier same-version mastery. A passing score may still leave missed noncritical objectives unmastered.
- Completion remains four correct practice families, a meaningful experiment cycle and correct bounded transfer explanation; it is not mastery. Notebook execution is never mastery evidence.
- Practice allows two valid submissions per variant/review cycle; unsupported representations do not consume attempts. Exhaustion shows worked feedback, changed recall and explicit cycle recovery. Independent attempts are unlimited fresh IDs rotating whole forms; no correctness reveal while active, review then explicit confirmation. Reloaded review requires reconfirmation. Remediation is recommended, not a new access lock.
- Reuse finite option IDs, typed finite numeric answers and authored whole repair tuples only. Equivalent accepted tuples receive equal credit; no mixing unapproved tuple fragments. Numeric default tolerance is abs(a−b) <= 1e−9 + 1e−9*abs(expected), unless explicitly versioned otherwise; counts/IDs/classes use exact authored representations. Decimal UI parsing is distinct from the typed scoring contract; expression strings and numeric strings at that contract are unsupported.
- Retain existing limits: at most 32 families, two atoms/family, eight options/slots/accepted tuples; atom512B, family1.5KiB, submission64KiB, envelope256KiB, depth8; snippets25lines/4KiB; learner arrays rank2/dimension32/64cells and tables32×8. Large trained traces use separately validated immutable assets, not relaxed answer bounds.
- Reject unsafe/unknown/oversize/malformed input before grading without echoing raw attacks or stack traces. Unsupported representation is not an incorrect mathematical answer. Unanswered atoms become wrong only after review/confirmation; malformed identities reject the submission atomically.
- Prohibit learner Python execution, unrestricted imports, eval/exec, general expressions, shell, filesystem/network access, uploads and arbitrary model deserialization. Trusted offline author notebooks are separate from the web evaluator.
- A separate GB versioned canonical scope must read/write only its own records. Freeze schema/content/assessment/fixture ownership before implementation; no automatic prerequisite evidence import or migration. Hydrate/validate before writes; retain latest20 compact summaries, latest full response and earned mastery within bounds. Confirmation is idempotent by attempt ID.
- Corrupt, foreign, future, stale or oversize records are rejected without deleting/reinterpreting originals. Quota/denial/stale-tab failures preserve safe memory and show unsaved status. Do not claim distributed atomic CAS, cross-device durability or tamper-proof credentials. Semantic changes require new versions and an explicitly approved migration/archive choice.

## 7. Notebook and reproducibility requirements

One trusted authored notebook follows residual correction → classification scores → staged development selection → matched forest comparison, connecting earlier preparation and evaluation skills. Include dependency metadata, seeds, bundled fixture provenance/license, split IDs, expected-output assertions, numerical conventions and fixture hashes. No credentials, uploads, remote datasets or learner-code hosting. Document finite synthetic data and calibration limits.

Use the approved tested local profile: CPython3.13.16, NumPy2.5.4, pandas3.0.6, Matplotlib3.11.2, scikit-learn1.9.1, SciPy1.18.1 on macOS15.6.1 ARM64. This is the accepted local profile, not proof of portability. No dependency installation or notebook execution is part of scope verification. During implementation, execute in two fresh kernels, assert trusted expected outputs, compare canonical numerical/text outputs with declared tolerances, record environment/kernel logs and deterministic asset hashes. Genuine Google Colab execution remains unverified until actually performed.

## 8. Required acceptance evidence for future implementation

| Area | Required evidence before reporting completeness |
|---|---|
| Coverage/depth | All24 rows map to teaching, worked examples,48 practice,72 independent, targeted feedback and remediation; all six paired gates preserved |
| Reference parity | All120 scored instances, every exposed lab configuration and worked calculation independently verified against arithmetic and trusted sklearn as applicable; semantic fixtures checked by provenance invariants |
| Freeze | Reviewed manifests, exact configurations/IDs, expected stage/leaf outputs, dependency/seed metadata, tolerances, hashes and byte-identical regeneration before app replay |
| Mastery | Each form:19/24 failure,20/24 success with gates correct;36 valid-wrong gate-component scenarios; blank/malformed, no evidence mosaics and prior-mastery retention |
| Semantics | Squared-loss normalization, score/probability/label separation, actual classification leaf corrections, rate/stage dependence, train/development/test and fold-only boundaries; endpoints/undefined metrics and stopping ties |
| Evaluator/retry | Equivalent/malformed/unsafe/oversize inputs, representation versus wrong answer, limits, remediation cycles, whole-form retries, active-answer secrecy, confirmation/idempotence/reconfirmation |
| Persistence | Restore practice/lab/attempt state; corruption, quota/denial, stale tabs, future versions, scope ownership and unchanged earlier records; truthful non-saved state |
| Engineering | Full frontend/TypeScript and Python regressions, typecheck and production build; preserve Math, Regression, Python, EV, PR, RG, LG, KN, NB, DT and RF routes/semantics |
| Manual UI | Real keyboard navigation, native controls, visible focus, predict/change/reveal/explain cycle, tables/text alternatives,320px no document overflow, cross-module navigation and progress isolation |
| Notebook | Two fresh local kernels with matching expected numerical outputs and recorded environment; no credentials/network datasets/uploads |

Use the source-identical isolated QA environment if original-directory I/O remains unreliable; document source equality and any environment differences. Existing RF test/build results are prior regression evidence, NOT results for unimplemented GB.

## 9. Findings, remaining decisions and stop

No material conflict in approved counts, objectives, six O2 gates, dependencies or mastery policy was found. The regression/classification distinction is explicit in the approved experiment plan; classification must not reuse a raw-label residual-regression story. Rate×stage trade-offs do not assert mathematical equivalence. Scaling recall does not assert trees require scaling.

Founder review requested: approve this bounded realization, including external staged development selection rather than silently adopting internal library early stopping. Exact data, grids, stopping tie rules, initialization/leaf numerical behavior, endpoint conventions and hashes must be authored and reference-frozen under subsequent authorization; none are falsely represented as complete here. No additional curriculum counts or mastery-policy decisions are needed.

OPEN: genuine screen-reader, genuine browser zoom, genuine Colab execution and original-directory I/O reliability; finite-bank memorization, editable local evidence, tiny-data uncertainty and later comprehensive pedagogical audit remain risks. No application implementation, new fixtures, notebook execution, learner-state changes, deployment, external learner testing or later algorithm work performed in this checkpoint. Await founder review.
