# Task 013.5 — Visualization bounded implementation specification

Status: **Founder approved and authorized; implemented for founder review.** The exact bounded requirements below govern Task013.5. See [completion evidence](TASK_013_5_COMPLETION.md). Historical future-tense preparation/acceptance wording remains the approved contract, not a claim that implementation is absent. Genuine screen-reader, browser zoom and Colab remain open. No013.6 authorization is implied.

## 1. Authority and exact boundary

Reviewed sources:
- [Task013 blueprint](task-013-python-ml-blueprint.md), sections3–5,7 and11: module inventory, instructional standards,013.5 allocation, four chart types and notebook outputs.
- [Lesson/objective matrix](task-013-lesson-objective-matrix.md), Visualization and coverage registry: exact V01–V05 objectives, prerequisites, essential/introductory split and per-objective variants.
- [Mastery/evaluator specification](task-013-mastery-and-evaluator-spec.md), sections4–8,10 and critical-remediation table: grading, approved plot.recipe surface, bounded answers and persistence.
- [Founder-approved policy matrix](task-013-founder-policy-decision-matrix.md): binary paired gates, retries, equivalence, bounds and version governance. Its older pending-approval wording is historical, not a request to reapprove accepted policies.
- [Acceptance criteria](task-013-acceptance-criteria.md): EDU/EVAL/MAS/PROG/NB/ENG/A11Y requirements.
- [Quality register](CURRICULUM_QUALITY_REGISTER.md), [architecture](ARCHITECTURE.md), [roadmap](V1_IMPLEMENTATION_ROADMAP.md) and [Task013.4 completion](TASK_013_4_COMPLETION.md): preserved implementation baseline and outstanding obligations.
- Existing read-only policy registry apps/web/app/python/foundation/assessment.ts independently agrees on20 Visualization objectives and the exact five gates below. A registry entry is not an implemented learner module.

| Deliverable | Approved requirement / derivation |
|---|---:|
| Lessons |5: V01–V05 |
| Objective families |20; four per lesson |
| Depth split |19 essential, including5 critical;1 introductory/noncritical V05.O4 |
| Practice |40 instances:20 families ×2 authored variants |
| Independent assessment |One module assessment, three complete20-family forms;60 instances |
| Total scored instances |100, not counting worked references or activity states |
| Critical gates |5, exactly two AND-graded atoms each |
| Experiments |At least one meaningful experiment per lesson: at least5 |
| Notebook |1 full reproducible Visualization notebook |
| Mastery |16/20 plus every paired critical gate in one confirmed attempt |

Per lesson:8 practice and12 independent instances. V05.O4 is included in scoring/coverage while explicitly taught at introductory depth; it must not become a sixth critical gate. There is no requirement for20 essential objectives. Exact numbers of worked reference records and finite experiment configurations remain authoring details, not invented approved counts. Each activity must fit the approved64-configuration maximum.

The approved four chart types are **line, scatter, histogram and box**. This milestone does not add bar/pie/heatmap/3D/interactive dashboard curricula, arbitrary chart expressions, new ML algorithms or capstones. An existing scatter/line diagnostic may explain evaluation questions using supplied measurements, but no new model-fitting or metric curriculum is introduced.

## 2. Exact lesson/objective mapping

Canonical namespace: python.visualization.v01.o1 through python.visualization.v05.o4. Short IDs below match the approved matrix exactly. C = mandatory critical/essential; I = introductory/noncritical; all other objectives are essential/noncritical. Every row requires conceptual teaching, a worked example, two practice instances, three independent instances and the listed remediation.

### V01 — Figures, axes and readable measurement

Prerequisites: P05,N01; optional D01. Motivation: a chart encodes measurements and a question; coordinates, units and labels are part of its truthfulness. Terms: Figure, Axes, plot, title, x/y label, units, legend, scale. Mathematical recall: functions, coordinates and feature/target units.

Worked anchor: area[1,2,3], age fixed10, weights[100,−2], bias50 gives predictions[130,230,330] in thousands of dollars. Labeling the price axis dollars instead of thousands changes communicated meaning. Figure is the containing canvas; Axes is the coordinate system receiving plotting/label methods. Ordered area supports a line here; arbitrary customer-row order does not.

ML purpose: inspect a supplied linear prediction slice while preserving which feature varies and which is held fixed. No new regression semantics/model fit.

| ID | Measurable outcome | Independent reasoning check | Remediation |
|---|---|---|---|
| V01.O1 | Match Figure/Axes roles to a supplied Matplotlib program. | Choose where plot and labeling methods belong. | Annotate the small fig, ax creation trace. |
| V01.O2 **C** | Choose correct coordinates, units and truthful series labels. | Repair swapped axes/unit labels and explain the consequence. | Map each axis back to the input table. |
| V01.O3 | Predict a line plot only when order/continuity is justified. | Reject a line through arbitrarily ordered customers. | Compare row order with the intended independent variable. |
| V01.O4 | Provide non-color-only labels and a numerical alternative. | Select a usable legend/marker/table combination. | Read the chart using only its textual description. |

### V02 — Histograms show distributions, not individual paths

Prerequisites: V01; Statistics distributions. Motivation: intervals summarize a quantitative distribution rather than a sequence of individual observations. Terms: bin edges, count, width, density, probability area, outlier. Mathematical recall: frequency versus area; height is not generally probability.

Worked anchor: ages[0,1,2,3], edges[0,2,4] yields counts[2,2], widths[2,2], density heights[.25,.25], bin areas[.5,.5], total area1. Explain height=count/(included count×width), area=height×width. Density can exceed1 for narrow bins without probability exceeding1. The final bin includes its right edge; earlier bins are half-open.

ML purpose: inspect feature skew, unusual ranges and bin-sensitive impressions before later preparation; exploration is not automatic cleaning.

| ID | Measurable outcome | Independent reasoning check | Remediation |
|---|---|---|---|
| V02.O1 | Predict bin membership including the final right edge convention. | Select counts for a changed bounded dataset. | Place values in labeled half-open bins, final bin right-inclusive. |
| V02.O2 **C** | Distinguish count, density height and probability area. | Repair a density-as-probability claim and justify using width. | Multiply each density height by bin width. |
| V02.O3 | Explain the effect of bins and outliers on interpretation. | Choose a cautious conclusion after a bin change. | Compare the same raw values under both plots. |
| V02.O4 | Choose a histogram for a quantitative distribution rather than a relationship. | Select a plot matching a new distribution question. | State whether one variable or paired variables are being studied. |

### V03 — Scatterplots, relationships and causal caution

Prerequisites: V01; Statistics relationships. Motivation: paired observations show relationships, but the same observational pattern can support different intervention predictions. Terms: scatter, pairing, subgroup, confounder, nonlinear association, overplotting, intervention. Mathematical recall: correlation and the limits of observational identification.

Worked example: training_hours and score rise together in a supplied ID-labeled table while prior_experience differs by subgroup. Trace individual pairs before inspecting pooled/subgroup patterns. Show two fixed causal stories compatible with the same observational points but different intervention predictions; neither a fitted line nor color grouping identifies the effect of an extra hour. Include a curved counterexample showing that zero linear correlation need not mean no relationship. Use the existing Statistics common-cause/intervention material as prerequisite recall, not a new causal-analysis engine.

ML purpose: inspect feature/target relationships without corrupting pairing or claiming that a predictive feature necessarily causes an outcome.

| ID | Measurable outcome | Independent reasoning check | Remediation |
|---|---|---|---|
| V03.O1 | Preserve paired observations and inspect shape/outliers. | Reject a separately sorted x/y chart. | Reconnect points by row ID. |
| V03.O2 **C** | Distinguish association from an identified intervention effect. | Reject a causal claim and choose the missing design/assumption explanation. | Return to Statistics common-cause/intervention contrasts. |
| V03.O3 | Recognize subgroup confounding and nonlinear patterns. | Choose interpretations of pooled versus grouped/curved cases. | Compare group membership and within-group patterns. |
| V03.O4 | Use labels/markers and point tables to avoid color-only meaning. | Select a readable small scatter design. | Trace one named observation through the numerical alternative. |

### V04 — Box plots summarize spread with conventions

Prerequisites: V01–V02; Statistics quartiles. Motivation: a box plot is a convention-dependent summary, not a complete distribution or a verdict about data errors. Terms: median, quartile, IQR, fence, whisker, marked outlier and linear quantile convention.

Worked anchor: ordered[1,2,3,4,5,20] has Q1=2.25, median3.5, Q3=4.75, IQR2.5 under the pinned linear method. The1.5-IQR fences are−1.5 and8.5; whiskers reach observed values1 and5, while20 is marked. Fences are not whisker endpoints. Median/IQR are not mean/standard deviation, and an outlier marker alone does not justify deletion.

ML purpose: compare feature/group spread and investigate provenance/influence before making any later data-preparation decision.

| ID | Measurable outcome | Independent reasoning check | Remediation |
|---|---|---|---|
| V04.O1 | Interpret box, whiskers and marked observations using the stated convention. | Label a changed plot from a matching summary table. | Rebuild the plot from ordered values and fences. |
| V04.O2 **C** | Distinguish median/IQR from mean/standard deviation. | Repair a mislabeled summary and explain robustness. | Compare definitions and units in Statistics recall. |
| V04.O3 | Assess outlier influence without automatically removing observations. | Choose an investigation rather than unsupported deletion. | Compare provenance and summaries with/without the point. |
| V04.O4 | Compare group summaries without claiming equal sample sizes or causation. | Select a limited conclusion with group counts shown. | Inspect counts and the unaggregated value tables. |

### V05 — Choose charts and detect misleading claims

Prerequisites: V01–V04. Motivation: chart choices communicate questions and affect perceived differences without changing underlying measurements. Terms: truncated axis, shared scale, denominator, normalization, cherry-picking and exploratory analysis. Mathematical recall: absolute differences versus displayed scale; exploration versus validation.

Worked anchor: endpoints100 and102 can appear dramatic on y-limits[99,103]. The absolute difference is2 in the stated units regardless of zoom. A disclosed narrow range may usefully reveal detail; a nonzero baseline is not automatically forbidden for every line/scatter plot. Repair hidden/incompatible scales, missing denominators or unsupported claims rather than applying an indiscriminate zero-baseline rule.

ML purpose: choose a distribution, relationship or ordered diagnostic chart from a stated question, distinguish displayed rows from unseen-data evidence, and motivate later held-out validation without implementing it.

| ID | Measurable outcome | Independent reasoning check | Remediation |
|---|---|---|---|
| V05.O1 **C** | Detect misleading scale/denominator choices and propose a transparent repair. | Choose a repair plus absolute-unit explanation for a new chart. | Compare identical data under disclosed common scales. |
| V05.O2 | Select line/scatter/histogram/box plot for a stated ML question. | Match a new diagnostic question to a chart and rationale. | Identify time/order, pairing or distribution first. |
| V05.O3 | Separate descriptive visual evidence from generalization claims. | Reject a chart-based claim of unseen-data performance. | Trace which rows the plot actually contains. |
| V05.O4 **I** | Explain why exploratory pattern hunting needs later validation (introductory). | Choose a cautious follow-up rather than proof from a selected pattern. | Distinguish exploration from a predeclared evaluation. |

## 3. Interactive experiment designs

Each lesson must offer prediction before reveal, a meaningful finite input/configuration change, exact observed numerical/structural outcomes, why the change matters, and a bounded explanation/claim check. A renamed configuration ID, theme change, reveal click or copy/download alone cannot establish meaningful completion. Preserve the pandas safeguard comparing actual authored conditions/results, not only IDs.

| Lesson | Finite authored controls / experiment | Required accessible observed evidence |
|---|---|---|
| V01 | Select supplied x/y/series/label-unit recipes; compare ordered area with unordered observation IDs and a swapped-label repair. | Original row IDs and coordinates, ordered predictions, explicit axes/units/legend/markers, line-order justification and fixed-versus-varied features. |
| V02 | Select reviewed edges, count/density mode and a named outlier dataset; include unequal widths and final-right-edge cases. | Raw values/IDs, every bin edge/inclusion rule, member IDs, included/excluded counts, widths, heights, areas and denominator. Explain bin sensitivity; do not quietly change the underlying sample. |
| V03 | Toggle paired versus independently sorted input, pooled/subgroup/curved fixtures, and the two fixed observational/intervention stories. | Point table with IDs/group/markers, changed pairings, supplied correlation where used, explicit observational versus intervention ledgers and supported/unsupported claim. Same observations can leave intervention conclusions unidentified. |
| V04 | Select fixed group/raw-value/outlier cases and compare named summaries with/without a point for investigation, not automatic deletion. | Sorted values and sample count, pinned quartiles, IQR, fences, observed whisker endpoints, marked points and mean/SD only when explicitly compared with their definitions. |
| V05 | Compare identical data under reviewed axis limits/common scales, count/density denominators and disclosed versus hidden labeling recipes; select a chart for a new question. | Same raw values/units, actual limits/bin/group settings, absolute differences, denominator and row coverage, supported claim and transparent repair. Deliberately misleading examples are visibly teaching examples. |

At least five experiments; exact finite state inventories are frozen during authorized authoring and must all receive trusted parity tests. No slider implies continuous computation outside the reviewed finite state set. Native selects/radios/buttons and accessible text/table alternatives are primary controls; no hover/drag/color-only dependency.

Scales/transformations stay within the approved recipe surface: disclosed finite linear axis limits, common scales, explicit unit conversion and histogram count-to-density normalization. **No silently added logarithmic/symlog/dual-axis transformation engine, smoothing, fitted trendline or unrestricted normalization language.** If later authoring requires an unlisted operation, stop for approval rather than broadening plot.recipe.

## 4. Chart semantics and trusted reference contract

The browser resolves immutable authored chart/configuration IDs. Actual pinned NumPy/Matplotlib in offline author/CI tooling supplies reference results; the browser does not execute Python or general plotting commands.

Freeze per fixture: objective/form/variant, source identity, original data and IDs, dtype/missingness, pairing/order/groups/counts, plot type, x/y arrays, title/axis labels and units, series identity, legend and non-color marker/style distinctions, linear limits, histogram edges/density/denominator and box quantile/whisker settings. Expose relevant settings in textual alternatives. Displayed code and chart/table must describe the same recipe.

Reference assertions:
- Line: plotted ordered x/y coordinates, units, series labels and Figure/Axes ownership. Do not connect arbitrarily ordered categorical entities as if continuity were established.
- Scatter: exact x/y offsets and row/group identity, markers/labels; sorting each coordinate independently must be rejected even if each marginal distribution is unchanged.
- Histogram: explicit edges, half-open/final-inclusive membership, counts, widths and density area. If edges exclude values, show the included population and exact normalization denominator; do not present conditional density as the full source population. Empty/nonfinite/unsupported states have named outcomes, not fabricated valid density.
- Box: linear quantiles and1.5-IQR convention, exact observed whisker endpoints/outlier membership, group sample counts. Distinguish summary definition from perceptual styling.
- Misleading-chart repairs: same data remain unchanged unless a disclosed named recipe explicitly changes the sample; compare numerical effect size and claim, not just appearance.
- Rendered charts must agree with the reference metadata under resize. Do not alter numerical axes/data to make a320px rendering fit.

Use Matplotlib Agg in CI, inspect artists/axes and normalized plot metadata/numerical summaries, and close every figure. Human visual review complements structural parity; pixel/image similarity is never the mastery criterion. Reuse established chart/accessibility patterns where their semantics match; do not duplicate a general plotting engine.

**Reuse caveat verified in code:** existing Statistics histogramTrace derives equal-width edges from min/max and a bin count. It is not automatically equivalent to explicit Matplotlib edges or unequal-width density. Keep it unchanged; reuse only proven matching pieces/recall. New Visualization-specific frozen references/adapters must preserve their own explicit conventions without changing Statistics semantics.

## 5. Mastery, retries and remediation

Reuse the approved finite scorer/evidence architecture without changing any existing module policy. Independent pass requires **at least16/20 correct families AND all five gates fully correct in that one confirmed attempt**. Each family contributes one binary point; each critical family has exactly two atoms (decision/repair/calculation and reason/counterexample), both required. No partial-credit compensation, attempt mosaic or automatic mastery from practice/notebook/completion.

| Critical gate | Failure even when a number/chart appears plausible | Targeted recovery |
|---|---|---|
| V01.O2 | Swapped coordinates, wrong units or falsely labeled series; correct curve alone is insufficient. | Map each axis/series back to the source table and repair the communicated measurement. |
| V02.O2 | Treat density height as probability without width/denominator. | Compute height×width and reconcile bin areas with the included sample. |
| V03.O2 | Infer an intervention effect from observational association alone. | Compare compatible causal stories and the existing Statistics common-cause/intervention contrast. |
| V04.O2 | Substitute mean/standard deviation for median/IQR or give the wrong robustness explanation. | Rebuild definitions/units and compare the supplied extreme-value example. |
| V05.O1 | Hide incompatible scales/denominators or exaggerate a difference without transparent repair. | Compare unchanged data on disclosed common scales and state the absolute-unit difference. |

Automatic-deletion reasoning remains V04.O3 noncritical; exploratory caution remains V05.O4 introductory/noncritical. Do not add hidden gates.

Lesson completion: four demonstrated practice families plus meaningful changed experiment and correct bounded prediction/explanation. Independent assessment is accessible directly; prerequisites recommend recall, not route locks. Completion and practice can accumulate in their own scope but never substitute for a single independent attempt.

Practice: A/B variants, at most two valid submissions each per persisted review cycle; invalid payloads consume none. First wrong response explains the misconception; exhausted variants show correction/alternate, and exhausting both requires targeted review plus a correct bounded changed-case/counterexample before a clearly labeled new cycle. Existing completion survives later review; no cooldown/permanent lock.

Independent: active→review→explicit confirm→results. No per-answer correctness before confirmation. Known blank answers count incorrect after explicit unanswered disclosure; malformed/unsupported payloads reject without scoring or advancing. Review reload restores active answers and requires fresh review/confirmation. Unlimited A→B→C retries, fresh IDs, no threshold/gate reduction. Results name score, failed gates, useful correction and direct lesson/prerequisite links. Idempotent confirmation prevents duplicate awards.

A passing attempt awards module mastery and only independently correct objective mastery; missed noncritical objectives remain unmastered. Failed attempts award none; subsequent failures or lesson reset/history pruning cannot erase earlier same-version mastery. Finite/client-visible banks are bounded-reasoning evidence, not proctored unrestricted coding certification. All semantic variants must change reasoning/data/failure conditions, not merely option order.

## 6. Evaluator safety and answer boundaries

Reuse existing choice, finite numeric and explicitly predefined repair-slot contracts. No new answer grammar is required for chart type, coordinates, labels, bins, summaries or claim/reason choices. Multiple valid chart/repair designs may be accepted only as explicitly reviewed whole tuples with positive and counterexample fixtures; aesthetically different or superficially similar images are not semantic proof.

Approved operation surface: plot.recipe for line/scatter/histogram/box, fixed paired/bin/group/linear-limit/label/marker IDs, linear quantiles and1.5-IQR whiskers. IDs resolve authored data only, never learner-selected module properties/functions/Matplotlib methods. Display Figure/Axes and plotting/label calls as fixed instructional snippets. Notebook execution of trusted author code is separate from browser grading.

Exact assessed identities, coordinate order, units, types, counts, labels and bins stay exact. Finite floating numbers use approved |actual−expected|≤1e−9+1e−9×|expected| unless a disclosed precision-specific rule applies. Booleans/numeric strings do not coerce; missing/nonfinite/undefined/error use explicit tags and never become zero. Unsupported representations receive bounded-format guidance, not a claim that their underlying mathematical idea is wrong.

Carry forward all approved resource limits: rank≤2 arrays, dimensions≤32,≤64 cells; tables≤32×8; fixture strings≤120 characters;≤25-line/4KiB snippets;≤64 configurations/activity;≤8 accepted whole tuples;≤2 atoms/family;≤8 slots/options per slot;512-byte atoms,1.5KiB families,64KiB submissions, depth≤8,256KiB persistence. Large authored result tables/charts use finite selections or declared sampled cells, not unrestricted CSV/JSON answers.

Reject extra/missing/duplicate/unknown/prototype keys or IDs, wrong scope/version/kind, oversized/deep or malformed payloads, nonfinite numeric answers, arbitrary source/import/URL/path/HTML/script input and unsupported state combinations before grading. No eval/exec/compile, unrestricted expression evaluation, dynamic method dispatch, arbitrary artist manipulation, shell/files/network, uploads or hosted learner-code service. Safe contextual errors preserve the last valid draft and never echo attacker source, local paths or internal tracebacks. A missing reference/content fault disables that check; it must not fabricate a result or award mastery.

## 7. Notebook and data requirements

Deliver one full Visualization notebook, preferably following established naming python-visualization.ipynb, with stable cells/sections for all20 objective families, honest introductory V05.O4 depth, predict-before-run prompts, worked/reference answers, guided safe changes and explicit limitations. Canonical restart/run-all has no crashing TODO or hidden cell state.

Use the existing founder-approved **tested local** profile: CPython3.13.16, NumPy2.5.4, pandas3.0.6, Matplotlib3.11.2, scikit-learn1.9.1, with the recorded hash-locked dependencies/tooling, macOS ARM64 verification provenance and declared single-thread policy. Do not install packages into the application or silently substitute versions. An existing exact isolated environment may be reused after preflight; a new/changed host profile needs explicit review/parity, not an inferred compatibility claim.

Data: reuse approved original fictional bundled/embedded records where appropriate; use small author-owned worked chart fixtures with manifests, provenance/permission, revision/hash, schema/units/IDs and explicit subset/group membership. Preserve the canonical housing source and quarantine future/target fields when used as context; do not change old datasets/notebooks. Exact source/output/figure metadata hashes are authoring deliverables to freeze after implementation authorization, not evidence already produced.

Notebook must generate all four Matplotlib chart types with readable titles/axes/units/legends and non-color distinctions, exact numerical tables and misleading-chart repairs. Required analytic anchors:
- V01 weighted prediction slice[130,230,330] in thousands of dollars.
- V02 counts[2,2], density[.25,.25], total area1 for edges[0,2,4].
- V04 Q1=2.25, median3.5, Q3=4.75, IQR2.5 and marked outlier20.
- Underlying coordinate/label/axis/bin/box conventions and source IDs asserted, including V03 paired observations and limits of causal claims.
- V05 same-data absolute difference2 despite different disclosed axis limits.

Seed42 where stochastic illustrations are used; no graded result depends on a random draw, clock, font or pixel hash. Use Agg for trusted execution, close figures and compare normalized numerical/structural outputs rather than rendering pixels. Record figure specifications/output hashes and visually inspect explanatory charts.

After dependency setup, canonical execution requires no credentials, paid services, data download, Drive mount or learner uploads. Run two fresh kernels/clean working directories and compare full frozen outputs/metadata with declared tolerances. Record exact versions/OS/architecture/data hash/seed/warnings. Carry author-test budgets60seconds/cell,300seconds/notebook,≤2GiB process memory and≤1MiB captured result payload; disclose actual enforcement/measurement rather than claim an arbitrary-code sandbox. Raster figure artifacts may be saved separately from the bounded normalized result payload.

**Genuine Colab remains OPEN / NOT VERIFIED.** Actual fresh-host restart/run-all, exact supported profile and outputs are necessary. Local Agg/kernel success does not verify Colab or accessibility. No automatic Colab system-Python replacement; incompatible hosts require a separately approved pinned/parity-tested profile. Notebook download/execution never creates platform evidence.

## 8. Persistence and preservation boundary

Use a separate Visualization-local canonical versioned envelope, unchanged shared evidence contract. Proposed names consistent with accepted architecture: ml-math-lab:python:visualization:v1; schema1; content python.visualization.1.0.0; assessment/mastery python.visualization.mastery.v1. Record final fixture/content/environment versions in the implementation completion report; do not reuse any old module key.

Hydrate before writing, strict scope/content/policy/environment/ID/canonical validation, one bounded atomic scoped envelope update on confirmed submission, stable provenance IDs, latest20 compact summaries/latest full response, persisted practice/recovery/activity/draft. Corrupt/future/wrong-module/unsupported bytes remain unchanged with saving disabled. Quota/read/write/stale-tab failures retain usable in-memory work with an honest unsaved warning. Local storage is not tamper-proof/account sync/distributed CAS.

Experiment reset clears controls only. Explicit lesson reset affects that lesson's practice/draft activity, not independent history/mastery; separately confirmed module reset affects only Visualization. No automatic migration, imports of Essentials/NumPy/pandas/Math evidence, rescore or aggregate award. Future semantic changes need new version/scope or an approved auditable compatibility mapping.

Preserve all existing Python Essentials/P01 copy behavior, NumPy, pandas, Mathematics, Regression, assessment logic, progress, notebooks and dependency manifests. Reuse existing controls, module-local controller/evaluator/scorer/evidence and accessible chart patterns only where semantics match; no universal teaching-system refactor, new backend/database, pricing/commercial or deployment change.

## 9. Acceptance and verification plan

All items below are future implementation acceptance criteria, **not tests run during this scope-verification milestone**.

| Area | Required pass evidence |
|---|---|
| Coverage |5 lessons, exact20 IDs/19 essential+1 introductory,40 practice,60 independent,5 paired gates; every objective mapped to teaching/worked example/ML use/experiment/check/remediation and notebook section. |
| Reference parity |All100 scored instances and every exposed experiment configuration recomputed with trusted pinned NumPy/Matplotlib; full source→chart→table/settings consistency. Freeze complete outputs/hashes, not only anchors. |
| Chart semantics |Pairing/order/units/labels, linear limits, final histogram edge/unequal widths/included denominators, counts/density/area, linear quantiles/fences/observed whiskers and group counts tested. Missing/empty/constant/nonfinite/unsupported states explicit where exposed. |
| Causal depth |Correct numeric correlation/scatter paired with an unsupported intervention claim fails V03.O2; compatible observational stories with different intervention results, subgroup confounding and nonlinear counterexamples are covered without claiming grouping identifies causality. |
| Mastery boundaries |All3 real forms:15/20 fails;16/20 succeeds only with all gates; all20 correct passes. Five gates×2 components×3 forms =30 otherwise19/20 failure scenarios. Duplicate/missing families, wrong reasoning, blanks, malformed input and attempt mosaics cannot bypass. |
| Assessment/equivalence |Binary family AND behavior, complete reviewed equivalents/counterexamples/mixed-wrong tuples, numeric inside/exact/outside tolerance and typed/ordered metadata tested; accepted semantic variants change more than answer position. |
| Safety |Adversarial malformed/extra/duplicate/prototype/wrong-version/oversize/deep/code/import/path/URL/script/nonfinite corpus fails closed; no executable learner input or unsupported operation dispatch. Content errors cannot create mastery. |
| Practice/retries |Two-submission A/B persistence/exhaustion/changed-case recovery, review/confirm with no early correctness, blank disclosure, A/B/C rotation, fresh IDs and idempotence; targeted corrections remain useful. |
| Persistence/isolation |Fresh/restored/corrupt/future/foreign/noncanonical/oversize records; quota/read/write/stale tabs; valid partial drafts; review reconfirmation; bounded history with mastery retained; confirmed resets preserve other scopes. |
| Frontend/Python regressions |Full npm test and supported isolated PYTHONPATH=python pytest suites; trusted offline reference and notebook tests; existing Math/Regression/Essentials/NumPy/pandas regressions and old evidence/notebook preservation. Do not create a backend just to run Python tests. |
| Types/build/routes |npm run typecheck and npm run build; direct-entry/invalid lesson, Back/Forward/reload, soft prerequisites and discovery. No added production Python/dependency/database requirement. |
| Keyboard/320px |All5 lessons, overview and assessment active/review/error/results/reset states at320px; native keyboard controls, named focusable chart/table/code scrollers, wrapping numerical alternatives, visible focus/logical Tab/skip/error/review/result flow, no page overflow/hover-only or drag-only meaning. |
| Accessible chart meaning |Each chart exposes type, question, source IDs/data, units/limits/normalization/conventions, sample/group counts and supported conclusion without color/hover; SVG/canvas alone is insufficient. |
| Production browser journey |At least one real independent failure→targeted remediation→different-form pass→reload restoration; later failure preserves mastery. Distinguish real UI evidence from seeded/jsdom contract tests. |
| Notebook |Two fresh trusted local kernels match all20 objective outputs and analytic anchors; Agg/close figures, metadata/numerical assertions plus human visual review; versions/data/output hashes, limits and credential/upload/network independence recorded. |
| Preservation/documentation |Pre/post source/contracts/notebooks/manifests and seeded old evidence; update completion/status/architecture/quality/depth/blockers; report actual counts, versions, passing/failing/unverified items and next authorization boundary. |

Carry forward **genuine screen-reader speech/navigation**, **actual200%/400% browser zoom** and **genuine Colab** as open obligations until real evidence exists. AX/DOM, numerical alternatives,320px viewports and local notebook runs do not close them. Accessibility reviewer must verify code, plots/tables, prediction/repair controls, feedback, review/confirmation/results/retries/resets. Broader contrast, text spacing, target size, reduced motion and device/AT coverage remain required tracked QA, not implied passes. Full Task017 curriculum audit and external learner testing stay deferred to authorized full-V1 assembly.

Do not enable learner-facing Visualization mastery until the complete catalog/forms/gates and required automated/reference/controller verification have passed. Synthetic policy tests are not learner evidence. Implementation completeness may be reported separately from genuinely unverified manual accessibility/Colab acceptance, exactly as earlier founder decisions require; do not silently waive those gates.

## 10. Findings, decisions and stop condition

**No material scope or policy conflict found:** blueprint, matrix, evaluator critical table and implemented pure registry agree on5 lessons/20 objectives/five gates/16-of20.40 practice and60 independent instances derive directly from the approved2+3 per-objective rules. V05.O4 is introductory, not essential/critical. There was no separate bounded013.5 implementation document before this consolidation.

Clarifications resolved without curriculum expansion:
- Chart scales do not imply an unapproved arbitrary log/transform engine.
- Existing equal-width Statistics histograms cannot silently stand in for Matplotlib explicit-bin/density semantics.
- Matplotlib artist/numerical parity and human visual review are separate from pixel-based grading.
- Causal interpretation is an explicit paired critical gate here; no extra gate is added for outlier deletion or exploratory validation.
- Exact fixture cases/accepted tuples/state counts/manifests/hashes are future authoring artifacts, not unspecified product policy.

**Founder decision resolved:** the bounded specification and implementation were explicitly authorized. See TASK_013_5_COMPLETION.md for delivered evidence. Any new operation/answer grammar, chart type/transformation, alternative dependency/Colab profile, gate/threshold or substantial curriculum/security change still requires separate approval.

The original preparation milestone changed documentation only; the subsequent authorization now covers exactly this Visualization implementation. Existing mastery semantics remain untouched. **Stop after013.5 for founder review; do not begin013.6.** No deployment, migration or external learner testing.

## 11. Historical preparation verification evidence (before implementation authorization)

Read-only document consistency checks passed: all20 objective IDs, essential/introductory/critical markers, measurable outcomes, independent assessment intents and remediation rows match the approved Visualization matrix exactly. The five critical IDs match the existing pure module-policy registry. Counts40 practice/60 independent and30 future gate-component failure scenarios were checked arithmetically against the approved rules. No fixture generation or library execution was performed.

Pre/post SHA-256 inventory over336 application/source/contract/notebook/dependency/configuration files was unchanged: aggregate6f7f1fdbc336c645071197b5ba5386dc186bd401783e14739947c28e25280759. Generated build/cache/bytecode artifacts were excluded; existing learner storage was not accessed. Only this specification and preparation notes in the quality register, implementation status and roadmap were edited.

No frontend/Python regression suite, typecheck, build, browser accessibility journey or notebook run was rerun for this documentation-only task. Their future required acceptance evidence is specified above; Task013.4's passing results remain historical baseline evidence, not Task013.5 results. No screen-reader, actual zoom or Colab pass is claimed.
