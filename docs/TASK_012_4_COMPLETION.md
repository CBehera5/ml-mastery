# Task 012.4 — Linear Algebra Geometry and Transformations

Date: 15 October 2026. Status: **implemented; comprehensive accessibility acceptance remains open**. Stop after Task 012.4; no later subject or deployment was started.

## 1. Geometry objectives completed

| Area | Implemented learning | Depth |
|---|---|---|
| Linear transformations | Addition/scalar preservation, origin preservation, matrix columns as transformed unit vectors, linear versus affine | Essential |
| Geometric mappings | Scaling, reflection, quarter-turn rotation, shear, vector and coordinate-grid mappings | Essential |
| Composition | A then B means BA; compare BA and AB on the same input and grid | Essential |
| Basis/span/independence/dimension/rank | Representable output directions, redundant columns, plane/line/point images | Essential recognition; constructed 2D basis examples introductory |
| Identity and inverse | Identity leaves points unchanged; supported inverse round trip; collapsed inputs cannot be uniquely recovered | Essential |
| Determinant and stability | Signed unit-square area, orientation, singular collapse, near-singular versus singular, fixed-preset inverse-display policy | Introductory determinant; practical undo/stability cautions essential |
| Eigenvectors/eigenvalues | Nonzero input on a preserved line, positive/negative/zero eigenvalues, missing real directions and non-guaranteed eigenbasis | Introductory |
| PCA connection | Principal directions of centered-data covariance; eigenvalues as directional variance; chosen diag(9,1) illustration | Introductory; no PCA algorithm or covariance estimation |

Every major concept includes motivation, plain definition, geometric intuition, algebra/symbol explanations, worked numerical examples, experiment, ML use, misconception, checks and remediation/recall. Explicit inverse formation is not presented as the default fitting method: numerical solvers/factorizations and conditioning are explained as practical context. No general inversion, decomposition or eigensolver is introduced.

## 2. Lessons and interactive experiments

Existing overview: /math/linear-algebra now includes both core and geometry in the recommended sequence and distinguishes old core evidence from expanded module mastery.

New lesson routes:

- /math/linear-algebra/transformations: three connected sections covering transformations/composition, basis/span/rank, and identity/inverse/determinant/singularity. Twelve objective checks and three separately recorded concept activities.
- /math/linear-algebra/eigenvectors: preserved lines, signed/zero eigenvalues, rotation/shear caveats and introductory PCA. Four objective checks and one activity.

The planned third/fourth subject labs are implemented:

1. **Linear Transformation Explorer**: ten named matrices; native input-coordinate controls; transformed coordinate grid/unit square; matrix columns and exact sampled point tables; A-then-B versus B-then-A grid comparison; span coefficients linked to the actual plotted output; independent/dependent/zero column examples; signed area and supported inverse round trips; collapsed and near-collapsed examples.
2. **Eigenvector Intuition**: selected matrices and candidate-vector controls; input/output line comparison; known analytic eigenpair table; negative eigenvalue reversal, zero-input exclusion, zero eigenvalue collapse, shear's single independent direction, quarter-turn's absence of nonzero real eigenvectors, and a covariance-specific spread illustration.

All visualizations provide a matrix/readout, explicit coordinate description and non-color-only input/output line labels/styles. Transformation sample tables and keyboard-expandable complete grid-endpoint alternatives accompany the graphics. The span coefficient sliders change the plotted input/output, not merely a completion flag. Equal-axis rescaling and the visual limits of near-collapse are disclosed.

Original vector/dot-product and matrix routes, house baselines, notebooks and five-stage lesson behavior remain unchanged.

## 3. Mathematical verification and contracts

Added packages/math-runtime/src/geometry.ts and python/mlmath/geometry.py. The functions reuse existing matrix-vector, matrix-matrix and dot-product APIs without altering their v1 semantics.

- geometryTrace / geometry_trace: chosen named matrices; two-coordinate inputs and span coefficients bounded by magnitude 10; mapped vector, column basis, rank, determinant/signed and absolute unit area, supported inverse/round trip, ordered composition matrices/points, grid endpoints and sample points.
- eigenTrace / eigen_trace: selected analytic eigenpairs and candidate direction testing, not eigenvalue search. Nonzero candidates are normalized by their largest component for stable line comparison, avoiding tiny-vector false positives and underflow. Zero input is excluded; nonzero nullspace vectors can have eigenvalue zero.
- Singular means determinant exactly zero in these chosen examples. Near-singular preset diag(1,10⁻¹⁰) retains rank 2; inverse display is withheld for nonzero |det|≤10⁻⁸. This fixed-preset display policy is not a universal condition-number test or a claim of exact singularity.

Schemas: packages/math-contracts/schemas/geometry-trace.v1.schema.json and eigen-trace.v1.schema.json. Frozen parity fixture: packages/math-contracts/fixtures/geometry.v1.json, containing 10 geometry and 12 eigen cases.

Tests verify [1,1]→[2,1] under diag(2,1), RA versus AR, basis combinations, dependent span and rank zero/one/two, linearity, inverse identities/round trips, signed area/orientation, grid mappings, known eigenpairs, negative/zero eigenvalues, zero-input exclusion, tiny-vector rotation rejection, and invalid/overflow-scale boundaries. Both schemas validate frozen traces and reject unsupported versions. Geometry exercise expectations are independently checked against hand-computed references.

## 4. New assessment coverage

New route: /math/linear-algebra/mastery. Blueprint: MODULE_BLUEPRINT in apps/web/app/math/linear-algebra/geometry-content.ts, **version 2.0.0**. Assessment ID: linear-algebra.module.assessment.v2. New aggregate mastery objective: linear-algebra.foundations.module-mastery.v2.

- 32 questions: original 16 core objectives plus 16 geometry objectives, four items in each of eight competencies.
- Two finite deterministic variants with changed values and selected conceptual scenarios.
- At least 80% means **26/32**, plus all eight essential critical objectives in the same attempt.
- Original critical gates retained: magnitude, signed dot product, rectangular matrix-vector output shape and matrix-matrix output shape/compatibility.
- New essential critical gates: geometric mapping, right-to-left composition order, dependent span/representation and inverse-as-undo under information loss.
- All six introductory objectives are noncritical: constructed basis coordinates, determinant interpretation and four eigen/PCA objectives. A test confirms 26 correct essential responses with all six introductory responses omitted still passes; 25/32 fails.
- Numerical absolute tolerance 0.001; no timer; unanswered questions score zero. Review/edit, explicit submission confirmation, result focus, worked remediation, alternate retry and per-competency/critical outcomes are implemented.
- A 31/32 attempt missing any critical objective awards no new mastery. A passing score does not imply every individual or introductory objective was mastered; only correct objectives receive individual mastery evidence.

Guided lesson completion remains exploration plus correct checks, never automatic independent mastery.

## 5. Evidence compatibility and migration behavior

The original core model, 16 checks, core assessment v1, draft version, storage namespace, aggregate mastery objective and evaluation behavior are untouched. /math/linear-algebra/assessment remains independently available at its original 13/16 plus four-critical policy.

The expanded assessment is **additively versioned**, not an in-place semantic migration:

- Geometry/module evidence key: ml-math-lab:evidence:math.linear-algebra.geometry:v1.
- Evidence curriculum version: linear-algebra.geometry.v1, using the unchanged shared LearningEvidenceV1 schema.
- New assessment draft key: ml-math-lab:assessment:math.linear-algebra:module:v2; draft version 2.
- Core evidence/draft keys are neither rewritten nor imported. Earlier core mastery remains core-only and never silently becomes expanded module mastery. No old score is recalculated.
- New module questions reuse unchanged core objective/exercise IDs for unchanged core semantics; new geometry objectives use linear-algebra.foundations.geometry.*. New activities and lesson IDs are separate.
- One validated bounded module draft and 20 own module attempt summaries are retained. Unrelated histories and earned mastery survive later failures. Review consent resets on reload; future/old-version/invalid drafts and forged submitted results are rejected.
- Unsupported or corrupt geometry evidence bytes are preserved rather than overwritten/relabelled. Failed storage writes are visible; the current visit remains usable.

Tests seed previous core mastery, its draft, Algebra/Derivatives/Linear Regression state and legacy completion and confirm those bytes remain unchanged during geometry work. The browser also showed previously earned core mastery still present while expanded mastery remained unearned after the critical failure.

## 6. Test results

| Verification | Result |
|---|---|
| Full frontend and TypeScript-runtime suite | PASS: 238 tests in 40 files |
| Full Python suite | PASS: 90 tests |
| New schemas/parity | PASS: 22 frozen traces, version rejection and analytic invariants |
| Geometry UI after final zero-display formatting | PASS: 6 tests |
| Type checking | PASS |
| Production build | PASS: 35 static pages |
| Protected existing-file snapshot | 111 of 113 unchanged; only the additive runtime index export and overview changed in the protected set |

Commands: npm test; npm run typecheck; npm run build; PYTHONPATH=python work/task-011-verification-venv/bin/python -m pytest python/tests -q. Logs: work/task0124-*.log. Early test-only issues were corrected: strict +0/−0 comparison now uses numerical tolerance, and the two-submission 32-question UI test has a bounded 15-second timeout rather than the default 5 seconds. The final full suite passed.

Production-browser checks on a separate local origin verified:

- All 16 new guided answers and concept interactions; both lesson completions survive reload.
- Incorrect-answer remediation; coefficient-driven span; singular versus near-singular warnings; negative and zero eigenvalue behavior; excluded zero input; rotation without fabricated real eigenpairs.
- Module v01 31/32 critical failure with no new mastery, focused review and disabled submit until explicit confirmation; failed result survives reload.
- Targeted geometry remediation preserves prior completion; original core assessment still shows previously earned core mastery.
- Module v02 changes values/scenarios; all 32 responses, including numerical zero, survive draft reload; submission passes 32/32 and all eight gates; result, module mastery and both attempt summaries survive reload.
- 320 CSS px measurements: overview, both new lessons and module active/review/passed-result states have document width 320. Expanded grid-endpoint details also remain within that width.
- Sequential native Tab walks reach transformation footer (37 stops), eigen footer (17 stops) and module review button (33 stops). Native select/slider/radio/confirmation controls operate from the keyboard. Active module form has zero unnamed controls in the scoped DOM audit.
- Grid details expand using the keyboard; viewport override is reset after responsive checks. Visual inspection confirms readable coordinate alternatives and the composition comparison.

## 7. Accessibility findings

Implemented native controls, semantic fieldsets/legends, labeled tables/scroll regions, heading-linked concept sections, skip links, focus outlines, scoped feedback, review/result focus and complete numerical/text alternatives. No full automated accessibility-scanner pass is claimed.

**NOT VERIFIED:** real VoiceOver/NVDA speech, genuine 200%/400% browser zoom, complete state/nontext contrast, text spacing, focus obscuration, target-size exceptions, reduced-motion preference and the supported browser/device matrix. Browser capability inspection exposes viewport/visibility, not genuine zoom or AT speech; responsive viewport checks are not treated as zoom/AT acceptance. These requirements retain manual QA/accessibility owners in RELEASE_ACCESSIBILITY_QA_BLOCKERS.md. No formal learner or psychometric validation was performed.

## 8. File inventory and remaining gaps

New web files under apps/web/app/math/linear-algebra/: geometry-content.ts, geometry-experiments.tsx, geometry-learning.tsx, geometry-model.ts, use-geometry-evidence.ts, geometry-catalog.ts, module-assessment.tsx, transformations/page.tsx, eigenvectors/page.tsx, mastery/page.tsx, geometry-model.test.ts and geometry.test.tsx.

New math files: geometry.ts, geometry.py, both schemas and fixture above, packages/math-runtime/tests/geometry.test.ts and python/tests/test_geometry.py.

Modified integration: runtime index export; Linear Algebra overview; mathematics hub description; reference catalog additions; scoped geometry styles. The original core content/model/hook/assessment/catalog files and all other mathematical implementations, existing schemas/fixtures, notebooks, Algebra, Derivatives and Linear Regression remain byte-identical in the protected snapshot. Runtime dist output reflects the build. No Git repository is present in this workspace; source inventory and hashes establish preservation instead of a Git diff.

Updated documents: Mathematics Blueprint, V1 curriculum master plan, implementation status, roadmap, Task 017 conceptual-depth backlog, release-blocker register and this completion report.

Remaining gaps are acceptance work above and later cross-module editorial/learner validation, not missing approved geometry implementation. Bounded introductory determinant/eigen/PCA examples do not establish general computational proficiency. No Calculus, Probability, Statistics, Optimization, Python-for-ML or capstone engine work was added; no deployment occurred.

## 9. Recommended next milestone

After founder approval, proceed to **Task 012.5 — Calculus continuity and multivariable extension**. Preserve the existing Derivatives pilot and compact notebook/evidence; extend continuity, holes/jumps/corners and nondifferentiability; add bounded partial-gradient and Jacobian/Hessian sensitivity examples with TS/Python parity, independent new objective evidence and appropriately versioned assessment coverage. Review the blueprint's existing derivative debug-wording cautions before reuse. Do not start this milestone or deploy from this completion report.

