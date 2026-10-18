# V1 curriculum gap audit

## Historical baseline notice and current audit index

16 October2026. The founder-authorized homepage/learning-journey audit and design are complete, **not implemented; awaiting founder approval**. [Actual UX findings](HOMEPAGE_LEARNING_JOURNEY_AUDIT.md), [IA, wireframes, interaction and route specification](homepage-learning-journey-design-spec.md), [concept map](homepage-concept-map.md) and [one prioritized remediation roadmap](homepage-remediation-roadmap.md) form the current design package.

No homepage, route, mastery, learner record, dependency, brand or commercial configuration changes.388 existing protected files remain byte-identical. Genuine screen-reader, genuine browser zoom and Colab stay unverified; Task017 depth review and authorized post-assembly learner testing remain outstanding. No Task014 work or deployment.

The original gap table below predates completed Mathematics/Python milestones; its “not started/placeholder” statuses are historical, not current navigation availability. Use [implementation status](IMPLEMENTATION_STATUS.md), [quality register](CURRICULUM_QUALITY_REGISTER.md) and [Task013 closure](TASK_013_8_CLOSURE_REVIEW.md) for current evidence. Homepage audit findings extend rather than replace the comprehensive Task017 review.

**Evidence date:** 2026-10-15  
**Classification:** Complete and verified; Implemented but requires educational refinement; Partially implemented; Placeholder only; Not started; Blocked by a dependency.

## Repository evidence

- Routes: `apps/web/app` contains `/math`, four math topic/lesson routes, `/demo`, `/challenges/wrong-direction`, `/beta`, and the Linear Regression overview plus nine statically generated lesson routes.
- Verified runtimes: `python/mlmath`, `packages/math-runtime`, and `packages/math-contracts` cover linear neuron, dot product, matrix multiplication, scalar calculus, dataset regression, and feature scaling.
- Shared fixtures: five Python-generated v1 fixture files; nine JSON schemas.
- Learning infrastructure: lesson-local progress hook, derivative topic completion/mastery, regression curriculum registry/shell, reusable regression lab controls/plots, isolated debugging adapter, and local beta analytics.
- Exercises: three downloadable notebooks—for vectors, matrices, and functions/derivatives. No hosted code runner.
- Quality: Pytest, Vitest/Testing Library, type checks, deterministic fixture diff, build CI. No browser E2E, automated accessibility audit, or visual regression.
- Projects: no reusable project engine or complete V1 project route exists. The regression `project` route is a placeholder.

## Detailed gap matrix

Effort is focused person-weeks including implementation, content, tests, and review: **S** <1, **M** 1–2, **L** 3–5, **XL** 6–10. It is not elapsed calendar time.

| Phase | Module / lesson or lab | Existing implementation and classification | Missing V1 requirements | Dependencies | Priority / complexity / effort | Acceptance criteria |
| --- | --- | --- | --- | --- | --- | --- |
| Math | Algebra & Functions | Compact functions/graphs stages inside `/math/functions-derivatives`; **Partial** | full notation, equations, domain/range, composition, exp/log, three dedicated labs, assessment | curriculum/progress foundation | P0 / M / L | all essential topics, three verified labs, alternate assessment and remediation |
| Math | Linear Algebra: vectors/dot product | Dedicated five-stage route, runtime, fixture, notebook, tests; **Implemented—refine** | magnitude/direction, broader operations, module-level assessment | shared mastery model | P0 / M / M | existing route retained; added objectives and unfamiliar transfer assessment |
| Math | Linear Algebra: matrices | Matrix-vector/matrix-matrix route, traces, notebook; **Implemented—refine** | transformations, identity/inverse, rank/span/independence, eigen intuition, dataset representation | additional LA traces/visuals | P0 / H / L | required concepts and transformation lab verified without proof-heavy expansion |
| Math | Calculus: derivatives | Compact route plus seven-module topic, labs/debug/mastery, calculus runtime; **Implemented—refine** | limits/continuity framing, partials, gradients, Jacobian/Hessian intuition, dedicated gradient playground | multivariate calculus trace | P0 / H / L | derivative content preserved; multivariate bridge and independent assessment pass |
| Math | Probability | only listed as planned on `/math`; **Not started** | all required lessons, three labs, mastery/remediation | probability runtime/fixtures | P0 / H / XL | conditional/Bayes/distribution experiments are deterministic and assessed |
| Math | Statistics | only listed as planned; **Not started** | all required lessons, three labs, sampling/bias and interval interpretation | statistics runtime/datasets | P0 / H / XL | learner can audit and interpret an unfamiliar sample without causal overclaim |
| Math | Optimization | concepts distributed across X-Ray/regression labs; **Partial** | coherent module, convexity/minima, variants, numerical stability, three labs, assessment | calculus/regression reuse plus surface trace | P0 / H / L | optimizer comparison and instability diagnosis are independently assessed |
| Python | Python Essentials | no curriculum routes; **Not started** | lessons, tracing/debugging, notebook | exercise evaluator | P0 / M / L | deterministic exercises and runnable notebook cover practical essentials |
| Python | NumPy | snippets/notebooks embedded in three math lessons; **Partial** | coherent arrays/broadcasting/indexing/vectorization module and assessment | exercise evaluator/notebook template | P0 / M / L | learner repairs shape/broadcasting errors and passes applied assessment |
| Python | pandas | **Not started** | complete module and deterministic dataset audit | dataset fixture format | P0 / M / L | missing/dtype/grouping tasks verified against fixtures |
| Python | Visualization | SVG learning visuals exist, but no Matplotlib curriculum; **Not started** | plot selection, code tracing, notebook | Python exercises | P1 / M / M | learner chooses, generates, and interprets four approved plot types |
| Python | Data Preparation | regression scaling and failure examples only; **Partial** | splits, encoding, missingness, outliers, leakage, reproducibility | dataset/project schemas | P0 / H / L | train-fitted preprocessing decisions pass leakage rubric |
| Python | scikit-learn | mentioned in regression metadata only; **Placeholder** | estimator API, pipelines, baselines, evaluation, notebook | preceding Python modules | P0 / M / L | reproducible pipeline notebook and deterministic debugging assessment |
| Supervised ML | Linear Regression lessons 1,3,6 | complete educational lessons with runtime-backed interaction, deterministic exercises, notebook, and local objective evidence; **Verified** | beta comprehension/zoom/screen-reader review and later unfamiliar assessment variants | assessment | P0 / L / H | existing completion tests remain green; assessment does not infer mastery from completion |
| Supervised ML | Linear Regression lessons 2,4,5,7 | four runtime-backed labs; **Implemented—refine** | deeper instructional checks, completion evidence, correlated features/leakage coverage | progress/assessment | P0 / M / M | lab actions map to objectives and remediation; all current tests retained |
| Supervised ML | Linear Regression lessons 8,9 | stable routes but placeholders; **Placeholder** | guided project and independent mastery | project/assessment foundations | P0 / H / L | all nine routes substantive; mastery uses unfamiliar variant and rubric |
| Supervised ML | Polynomial, Ridge/Lasso | **Not started** | universal curriculum and labs | regression module complete | P0 / H / XL | transformations and regularization compared with verified outputs |
| Supervised ML | Logistic Regression | **Not started** | universal curriculum, probabilities/threshold lab | probability + evaluation | P0 / H / XL | threshold and error-cost reasoning independently assessed |
| Supervised ML | KNN | **Not started** | universal curriculum and distance/scaling lab | LA, preprocessing | P1 / H / L | scaling/dimensionality limitations demonstrated and assessed |
| Supervised ML | Decision Trees | **Not started** | universal curriculum and split/complexity lab | statistics/evaluation | P0 / H / L | learner traces splits and controls overfit on unseen case |
| Supervised ML | Random Forests | **Not started** | universal curriculum and ensemble lab | trees | P0 / H / L | variance reduction and feature-importance caveats assessed |
| Supervised ML | Gradient Boosting | **Not started** | universal curriculum and sequential-error lab | trees/optimization | P0 / H / L | learner explains residual correction and tunes depth/rate safely |
| Supervised ML | SVM | **Not started** | universal curriculum and margin/kernel intuition lab | LA/optimization | P1 / H / L | scaling, margin, and kernel choices justified on unfamiliar data |
| Supervised ML | Evaluation | regression metrics exist; classification evaluation absent; **Partial** | splits, baselines, regression/classification metrics, calibration/error analysis | probability/statistics | P0 / H / L | metric choice matches objective; leakage and invalid comparison rejected |
| Supervised ML | Selection & tuning | **Not started** | CV, search, pipelines, final-test discipline | evaluation + sklearn | P0 / H / L | reproducible tuning plan never uses test data for selection |
| Projects | House Price | regression labs and fictional data only; project route placeholder; **Partial** | full guided/independent workflow, comparison, notebook/report | LR, Ridge, RF, project engine | P0 / XL / XL | both modes complete and artifacts satisfy rubric |
| Projects | Spam Detection | **Not started** | text fixtures/features, Logistic model, metrics, thresholds, project | Logistic + evaluation + project engine | P0 / XL / XL | both modes, false-positive/negative analysis, reproducible artifacts |
| Projects | Churn | **Not started** | mixed preprocessing, imbalance, four models, costs, threshold, project | core classifiers + project engine | P0 / XL / XL | both modes and business-cost rubric completed honestly |
| Platform | Progress/mastery | lesson-local booleans and derivative topic mastery; **Partial** | shared versioned objective/attempt model, migration, reset isolation | founder persistence decision | P0 / H / L | five learning states distinct; corrupt storage fails safely |
| Platform | Deterministic coding exercises | notebook downloads only; **Partial** | evaluator schema, variants, tracing/fill/debug components | Python curriculum design | P0 / H / L | no arbitrary execution; evaluators are deterministic and tested |
| Platform | Project workspace/reporting | **Not started** | state model, staged decisions, rubric, report export | project spec + progress | P0 / H / XL | resumable local workspace and reproducible report without false training claims |
| Platform | QA/accessibility | unit/component/build CI; **Partial** | E2E critical paths, axe/manual matrix, browser/device/performance budgets | stable experiences | P0 / M / L | release matrix in launch checklist passes |

## Reuse decisions

Reuse the versioned trace boundary, fixture generator, regression lab controls/SVGs, derivative topic assessment pattern, lesson-local safe parsing, regression metadata/shell, BetaNav visual language, debugging adapter isolation, CI, and local analytics adapter. Generalize only after a second concrete consumer exists; do not create a CMS, universal simulation engine, or formula-bearing React utility.

## Technical debt and risks

1. `globals.css` is a growing single stylesheet and will become a coordination risk across dozens of modules.
2. Progress models are inconsistent (boolean arrays versus derivative topic object) and lack schema migration infrastructure.
3. Regression metadata advertises future deliverables that are now partly implemented; status and content metadata are not unified.
4. Historical ADR numbering duplicates `ADR-013`, reducing decision traceability.
5. README still presents Task 001 as the product entry point.
6. No browser E2E/accessibility automation protects multi-route journeys.
7. There is no versioned dataset catalog, deterministic exercise contract, project state contract, or report format.
8. Browser-local state cannot provide cross-device continuity or reliable paid entitlement; this needs an explicit V1 business decision.
9. The approved V1 scope is large. Content quality, assessment design, and project authoring—not route scaffolding—are the dominant schedule risks.
