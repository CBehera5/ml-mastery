# Task015.3 — Ridge, Lasso and Elastic Net bounded specification

17 October2026 · Founder approved this boundary, fixture freeze and subsequent application implementation. [Completion/verification](TASK_015_3_COMPLETION.md) records delivery; founder review pending. Historical authorization/authoring statements below do not alter that disposition or the unchanged approved scope.

## 1. Authority, reconciliation and prerequisites

Verified against the [Task015 blueprint](SUPERVISED_LEARNING_BLUEPRINT.md), [decision package §2](TASK_015_IMPLEMENTATION_DECISION_PACKAGE.md), [objective matrix RG rows](supervised-lesson-objective-matrix.md), [mastery/evaluator policies](supervised-mastery-and-evaluator-proposal.md), [visual experiment specification](supervised-visual-experiments.md), [algorithm dependencies](supervised-algorithm-coverage.md), curriculum-quality register and [accepted Task015.2 completion](TASK_015_2_COMPLETION.md).

The allocation is **Task015.3 / RG / regularized regression**, not a new identifier or an extension of PR. Evaluation Foundations, existing multiple Linear Regression and Optimization are prerequisites; PR01 is optional contextual recall. Delivery follows accepted Polynomial Regression; prerequisites remain recommendations/recall, not newly introduced route locks or evidence equivalences. Math, Python, Regression, EV and PR records retain their original ownership and semantics.

Older blueprint/decision-package headers claiming Polynomial is unimplemented are historical and superseded by the accepted015.2 report. Their RG objective/count/form/gate allocations agree; no conflicting RG curriculum allocation was found.

## 2. Exact approved allocation

|Deliverable|Verified allocation|
|---|---|
|Lessons|Six: RG01–RG06, in matrix order|
|Essential families|24, four per lesson|
|Practice|48: two variants A/B for each family|
|Independent|72: three complete forms A/B/C,24 families each|
|Total scored instances|120; paired atoms do not add families|
|Paired critical gates|Six: RG01.O2 through RG06.O2|
|Core experiments|Two: RG-E1 and RG-E2, each at most64 reviewed combined configurations|
|Notebook|One full reproducible RG notebook, not three separate algorithm notebooks|
|Independent mastery|At least20/24 AND both components of every gate, one confirmed attempt|

Identifiers follow the matrix: RG01.O1 … RG06.O4, with .practice.A/B and .assessment.A/B/C instance suffixes. Final content/fixture/schema version strings must be frozen before application implementation; suggested scope name is supervised.regularization.full.v1, not an already approved existing key.

## 3. Exact objective and gate mapping

The following preserves the approved matrix wording and ordering. Every cell maps to its own explanation, worked step, practice A/B, independent A/B/C and targeted feedback. **O2 is paired; no hidden additional critical objectives.**

|Lesson|O1|O2 — paired critical|O3|O4|
|---|---|---|---|---|
|RG01 — Why penalize?|Diagnose coefficient instability under correlated features|Distinguish training loss from penalized objective and justify the trade-off|Compute L1/L2 norms with an unpenalized intercept|Recall training-only feature scaling|
|RG02 — Ridge shrinkage|Calculate Ridge objective under its declared normalization|Explain L2 shrinkage without claiming exact feature elimination|Predict effect of increasing α on a frozen fit trace|Compare with existing unregularized LR|
|RG03 — Lasso sparsity|Calculate Lasso objective under its declared normalization|Interpret zero coefficients without claiming causal irrelevance or stable selection|Compare correlated-column alternatives|Recognize nonconvergence in an authored output|
|RG04 — Elastic Net mixture|Compute L1 and L2 mixture contributions|Explain α versus mixing fraction without equating different solvers' α values|Select a finite mix candidate using development evidence|Compare sparsity/stability against Ridge/Lasso|
|RG05 — Fit and select safely|Read a trusted scaling/fit trace|Reject full-data scaling/feature selection and explain fold-local fitting|Repair the bounded pipeline/parameter grid|Identify unsupported solver/convergence conclusions|
|RG06 — Interpret and compare|Back-transform a scaled coefficient with units|Reject coefficient magnitude as causal/scale-free importance|Compare validation error, sparsity and coefficient stability|Choose a simpler adequate model with caveats|

### Gate decision, reason, failure and remediation

|Gate|Required decision/calculation|Required independent reason/transfer|Counterexample and remediation|
|---|---|---|---|
|RG01.O2|Separate unpenalized training error from the complete penalized objective|Explain why lower penalized objective is not a guarantee of lower validation error|Contrast two fits' residual and penalty terms; re-evaluate a changed validation case|
|RG02.O2|Identify coefficient shrinkage rather than automatic feature elimination|Explain that L2 does not generally select exact zeros; special symmetry/zero-signal cases may still give zero|Inspect frozen coefficients and distinguish small, exact zero and rounded-to-zero displays|
|RG03.O2|Treat a zero coefficient as conditional on this data, scaling, penalty and fit|Reject causal irrelevance and guaranteed stable selection, especially for correlated features|Swap a correlated column or inspect an authored perturbation; compare predictions and selected columns|
|RG04.O2|Separate overall α from L1 mixing fraction q|Explain the two penalty contributions and why equal α across Ridge/Lasso conventions is not an equal-strength comparison|Expand a numeric objective and compare normalization; do not average final model predictions|
|RG05.O2|Reject global scaling/selection and test-guided tuning|Identify fold-training-only fit IDs and the frozen final-test boundary|Trace scaler/selection/estimator fit IDs in each CV fold; repair the complete pipeline|
|RG06.O2|Reject raw coefficient magnitude as causal or scale-free importance|Restore units and explain correlated-feature redistribution and observational limits|Back-transform coefficient6 at scale3 to2 per raw unit; contrast an equivalent change of units|

Any wrong or unanswered component fails that gate even when the overall score otherwise passes. Use structurally valid wrong components in gate tests, not malformed-answer rejection as a substitute for reasoning verification.

## 4. Teaching and worked-example contract

Use house-price prediction with correlated area/room-related features as the direct regression anchor. Explain the generalization problem before penalties: noisy/correlated data can support unstable, large opposing coefficients even when predictions on training rows look plausible. Large coefficients are not inherently bad independent of units; regularization trades fit against a declared preference and may increase training error without necessarily improving validation.

Every lesson follows real problem → visual intuition → experiment → mathematics → trusted Python → evaluation → comparison, with a second changed-condition example, plain-language symbols/units, misconception and bounded transfer. Contextually recall norms, gradients, matrix predictions, training-only preparation and EV rather than duplicate foundation lessons. Ridge/Lasso geometry may be illustrated with bounded authored paths and text; no new continuous optimizer or solver implementation.

Required numerical seeds from the matrix:

- RG01: w=(1,−2), L1=3 and squared L2=5; intercept excluded. Distinguish Euclidean norm √5 from the squared norm5.
- RG02: SSE4 + α2 × squared norm5 =14 under the Ridge convention.
- RG03: n=2, SSE4, α=.5 and L1=3 gives4/(2×2)+.5×3=2.5.
- RG04: w=(1,2), α=1, q=.5 gives L1 contribution1.5 plus L2 contribution1.25=2.75, before adding data loss.
- RG05: fold-training mean10 must not change because validation contains30; show both ordinary training-only fitting and separate fitting inside each CV fold.
- RG06: standardized coefficient6 divided by training scale3 is2 per raw feature unit. Record centering/intercept adjustment when reconstructing the full prediction.

Mathematical conventions already fixed by the blueprint, residuals r=y−(Xw+b):

- Ridge: SSE + αΣw².
- Lasso: SSE/(2n) + αΣ|w|.
- Elastic Net: SSE/(2n) + αqΣ|w| + α(1−q)Σw²/2.

Intercept b is unpenalized. Define every term before syntax. Same numeric α across Ridge and the normalized objectives does not establish equivalent regularization. q=1 is the Lasso objective under matching conventions; q=0 is a normalized L2 objective, not permission to call ElasticNet a reliable Ridge solver. Use the dedicated Ridge solver for the pure-L2 endpoint; any endpoint illustration must clearly separate algebra from solver support.

Use trusted StandardScaler → estimator pipelines and numerical solvers, never inverses as the practical fitting default. For correlated columns, distinguish prediction quality from coefficient identification; no universal monotonic claim about validation error, individual coefficient paths or selection stability.

Churn and binary Good/Needs Improvement documentation labels are comparison-only anchors: these regressors are not drop-in calibrated classifiers. No new classification lesson, production documentation labels, capstone or target change.

## 5. Bounded experiment and fixture plan

The approved designs name controls and outputs but **do not contain exact RG datasets, parameter values, combined state counts, expected coefficients or hashes**. Those are authoring/verification work, not verified assets today. The following plan does not claim frozen reference outputs.

### RG-E1 — penalties, shrinkage and sparsity (RG01–RG03)

Question: can a model with higher training error be a more defensible prediction model, and what does a zero coefficient actually mean?

- Fixed, small correlated-feature housing fixture with explicit units, row IDs, train/development split and training-only scaling. A shared unregularized baseline is a comparison output, not a fictitious Lasso(alpha0) fit.
- Finite authored Ridge/Lasso and positive-strength choices. Predict shrinkage/sparsity or the distinction between training loss, penalty and development error before reveal.
- Reveal exact coefficient table and path, intercept, separate data-loss/penalty/complete-objective terms under each model's own convention, train/development MAE, fit IDs and convergence status. Same rows/metric for model comparisons; penalized objective values with different normalizations are not directly ranked as validation performance.
- Explain small versus exact zero, coefficient rounding and why correlated feature selection is conditional. Transfer uses an authored correlated-column alternative; no claim a change always flips selection.
- Numerical alternative contains all values needed to understand the graphic, including original versus standardized units. Reset clears controls/results, not previously earned independent mastery.

### RG-E2 — mixture, scale provenance and honest comparison (RG04–RG06)

Question: which regularized workflow can be selected using development evidence, and what can its coefficients support?

- Finite positive α, interior Elastic Net mixing fractions and named scale-provenance choices. A finite correlated-feature alternative may be a named fixture; do not multiply independent controls into an unreviewed Cartesian product.
- Predict changes in L1/L2 contributions, coefficient stability and validity. Expose fold-training-only scaling versus a deliberately invalid global-development fit as a tagged diagnostic, never a valid selection recommendation.
- Reveal contributions, convergence diagnostics, coefficients in both scales, same-fold metrics, mean/spread with their interpretation, and exact scaler/model fit IDs. Show that selection uses development folds; final test outcomes stay hidden until the notebook's single locked evaluation.
- Compare Ridge/Lasso through explicit reference rows or endpoint algebra, not unsupported pure-L2 ElasticNet fitting. An authored nonconvergence trace is diagnostic evidence, not an accepted optimal fit.
- Post-observation reasoning must protect fold boundaries, units and causal limitations. A wrong initial prediction is recoverable.

### Freeze requirement before application coding

Author manifests with stable dataset/fixture/configuration/version IDs; explicit ordered feature/target rows, units and provenance; exact legal combined configurations (≤64 per lab); initial state; prediction choices; expected numerical and tagged-validity outcomes; misconception/remediation IDs and text alternatives. Record every estimator setting, profile, seed, scaler parameters, feature order and convergence policy. Freeze expected outputs and SHA256 hashes only after trusted parity and deterministic regeneration.

Use fixed seeds and deterministic coordinate selection for Lasso/ElasticNet, explicit tolerances/max_iter and Ridge solver. The exact values must be justified and frozen, not guessed here as approved solver settings. Catch convergence warnings; record dual-gap/iteration evidence and reference tolerance. A nonconverged/unsupported state is not silently interpreted as zero coefficients or a reliable optimum.

Keep ≤64 plotted samples with authored paths and no441-point mesh. Read-only traces remain separately validated assets, never a relaxation of learner-answer bounds. Count configurations after enumeration and report the resulting counts; do not invent an approved exact lab state count. If reliable reference results require a different scene bound, dependency profile or mathematical convention, stop for that specific approval.

## 6. Evaluator, mastery and persistence boundary

Reuse the existing bounded Family scorer and scoped EV/PR-style adapter. Allow only exact finite option IDs, typed finite numbers and predefined whole repair tuples. Numeric default: |actual−expected| ≤1e−9 +1e−9|expected|, magnitude≤1e6; exact counts where specified. Reject NaN/Infinity, Booleans, expression strings, arbitrary code, unsafe/extra keys, foreign identities, excessive bytes/depth and unsupported shapes. Equivalent whole tuples or aliases must be explicitly authored and parity-justified; no symbolic equivalence inference or automatic partial credit.

Inherited limits: ≤32 families/attempt, ≤2 atoms/family, ≤8 choices/slots/accepted whole tuples;512B atom,1.5KiB family,64KiB submission,256KiB envelope,depth8; arrays rank≤2, dimensions≤32,total≤64 cells; tables≤32×8; snippets≤25 lines/4KiB. Authored asset traces are not learner payloads. No learner Python, unrestricted imports, eval/exec, expression interpreter, shell, filesystem/network operations, uploads or model deserialization.

Mastery is20/24 plus all six paired gates in a single confirmed complete form; both atoms count together as one family. No combining attempts, automatic notebook/practice/experiment mastery, cross-module transfer or aggregate track credential. Enable only after verification. A passing attempt grants independent evidence only for families actually correct, not fabricated24/24. Preserve earlier same-version mastery after later failed attempts.

Lesson completion requires all four practice families correct, a changed meaningful lab cycle with prediction/reveal/correct explanation, and correct bounded transfer. Two valid submissions per practice variant/cycle; malformed representations do not consume graded attempts. Exhaustion leads to worked review, changed recall and explicit new cycle. Unlimited fresh independent attempts rotate A/B/C; no correctness/answer reveal while active. Review plus explicit confirmation is mandatory; review reload returns to active/reconfirmation. Failed critical feedback identifies the exact atom and recommends targeted recall, but independent access is not blocked by remediation. Reassessment is a whole new attempt, never a patched gate.

New isolated RG storage only, no migration/import. Freeze exact schema/content/policy/assessment/fixture versions before implementation. Validate before writing; retain latest20 summaries, latest full response and prior mastery within bounds. Confirmation uses immutable attempt IDs and idempotence. Corrupt/foreign/future/stale records retain original bytes and are not reinterpreted/deleted. Quota/denial/stale-tab failures preserve safe in-memory work with a truthful not-saved warning. No distributed-CAS, account-sync or tamper-proof credential claim.

## 7. Notebook reproducibility requirements

One notebook spans all six lessons: motivation/correlated features, hand-computed penalty terms, baseline and Ridge/Lasso/ElasticNet fits, coefficient/sparsity comparison, fold-local scaling/tuning, unit restoration and frozen final-test evaluation. Include guided predictions/debugging with trusted expected outputs, explicit warnings and meaningful capstone comparisons. No learner uploads, credentials, downloads or remote datasets.

Reuse the actually verified local profile from015.2: CPython3.13.16; NumPy2.5.4; pandas3.0.6; Matplotlib3.11.2; scikit-learn1.9.1; nbclient0.11.0, nbformat5.11.1, ipykernel7.4.0; macOS15.6.1 ARM64. This is accepted only for its tested environment, not a new compatibility claim or authorization to install/update dependencies. Use deterministic seed1729 where stochastic procedures need a seed; record explicit folds, row IDs, dataset checksum, parameters, dependency and source hashes.

Fresh-kernel verification must execute the entire notebook twice and compare deterministic structured outputs: objectives/norms, coefficients within declared tolerance, convergence results, fit IDs, candidate/fold scores, chosen candidate and final frozen-model predictions. Any stdout comparison normalization must be documented; no masking numerical differences or warnings. Record actual environment and outputs. Genuine Colab execution remains separately UNVERIFIED; local success does not close it.

## 8. Implementation acceptance checklist

1. Coverage: audit24 objective rows against teaching, worked/contrasting examples,48 practice,72 independent,feedback/remediation and changed transfer. Every algorithm is represented, not just Ridge.
2. Reference: all120 scored instances, all exposed states and worked numerical examples match trusted Python/sklearn plus independent hand arithmetic for norms/objectives/predictions/unit transformations. Validate feature order, intercept treatment and exact loss normalization. All frozen manifests regenerate with identical hashes.
3. Mastery:19/24 fails,20/24 passes with all gates correct on each form;36 otherwise-passing critical-component failures (6×2×3), unanswered cases, no mosaics, fresh retry/confirmation and retained earlier mastery after later failure.
4. Semantics: test L2 shrinkage versus exact-zero claims; L1 conditional sparsity/correlated alternatives; Elastic Net components/normalization; feature units; converged versus nonconverged outcomes; training-only and separately fold-only fitting; no test-driven tuning.
5. Safety/equivalence: valid equivalents, whole-tuple invalid mixtures, numeric tolerance boundary and just-outside values, malformed/unsafe/oversize/unknown input, unsupported representation versus valid-wrong feedback; no evaluator language expansion.
6. Persistence: hydration-before-write, restoration, review reconfirmation, retries, idempotence, bounded history, corruption, unsupported versions, quota/denial, stale tabs, safe warnings and zero writes to earlier module scopes. No evidence transfer.
7. Regressions: complete frontend/TypeScript and Python suites, typecheck and production build. Preserve existing Math, Regression, all Python, original EV01/full EV and PR routes/formulas/assessment/evidence/notebooks. Hash baseline and compare changes; only intentional additive navigation/discovery edits allowed.
8. Live UI: native keyboard navigation and select/predict/reveal/explain/reset/retry/confirm; visible focus; accessible labels/status, no hover/color-only meaning;320px all lessons/assessment and expanded results/tables without page overflow; browser back/forward and saved-progress restoration. Automated DOM tests supplement, never stand in for genuine screen-reader/zoom tests.
9. Notebook: two fresh complete local kernels, deterministic expected outputs and checksum/profile metadata; no credentials/uploads/remote data. Keep actual Colab status separate.
10. Report: exact counts, final hashes/state counts, gate evidence, test counts/build logs, live keyboard/layout evidence, source/progress isolation, environment differences and unresolved obligations. Source-identical isolated QA is allowed if original I/O remains unreliable, but does not resolve that operational risk.

OPEN obligations carried forward: genuine screen-reader, genuine200%/400% browser zoom, genuine Colab, original-directory I/O reliability. Later comprehensive educational audit and external learner testing remain deferred, not claimed passed. Finite-bank recognition, origin-local/client-editable evidence and tiny synthetic datasets are explicit validity limits.

## 9. Decisions and stop conditions

**No conflict in approved lesson/objective/count/gate/threshold allocation was found.** Scope is ready for founder review, not application implementation. The required founder decision is approval of this bounded implementation specification, including authoring and trusted-reference freezing of the two finite manifests before application coding. Exact datasets, solver settings, state counts and outputs are not already verified or approved facts. If the founder prefers a separate manifest-freeze review, keep that as an explicit prerequisite; otherwise proposed authorization may include this bounded authoring work without changing approved curriculum or scene limits.

No further module-count, threshold, evaluator-language, dependency-installation or migration decision is requested. Any departure needed during reference authoring must be escalated before coding that portion.

Stop after this specification. No new lessons, runtime, tests, notebook implementation, dependency installation, learner evidence changes, deployment, external learner testing, database migration, capstone or015.4 work is authorized here.
