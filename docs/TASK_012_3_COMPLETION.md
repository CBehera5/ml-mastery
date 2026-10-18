# Task 012.3 — Linear Algebra for Machine Learning

Completed: 15 October 2026. Status: **core implemented; comprehensive accessibility acceptance remains open**. Stop after 012.3. No 012.4 implementation or deployment was performed.

## Scope decision

The approved Task 012.1 blueprint explicitly splits Linear Algebra between 012.3 (core) and 012.4 (geometry extension). This implementation follows that split. It does not claim completion of the whole Linear Algebra subject.

| Requested area | Disposition |
|---|---|
| Scalars/vectors, components, magnitude/direction, addition/scaling | Implemented, including zero-vector behavior |
| Dot products, angle/alignment, projection, similarity and weighted predictions | Implemented; geometric 2D coordinates distinguished from mixed-unit house features |
| Matrices, dimensions, matrix-vector and matrix-matrix products | Implemented, including rectangular transfer examples, compatibility/order and feature contracts |
| Scaling/rotation/reflection and transformation composition | Core previews scalar scaling and column-vector operation order; dedicated geometric transformations remain 012.4 |
| Basis/span/independence/rank | 012.4, per blueprint |
| Identity/inverse/determinant/singularity | 012.4, per blueprint |
| Eigenvectors/eigenvalues and introductory PCA connection | 012.4, per blueprint; no PCA algorithm implemented |

## Lesson inventory

- /math/linear-algebra: new overview, prerequisite recall link, recommended sequence, evidence rules, core-assessment link and explicit geometry boundary.
- /math/vectors-dot-product: existing route extended in place with two connected concept sections: scalar/vector operations and dot-product geometry. Original five-stage house lab and notebook remain.
- /math/matrices-multiplication: existing route extended in place with two connected concept sections: matrix-vector batches and rectangular matrix-matrix products. Original house baseline [28,39,29], five stages and notebook remain.
- /math/linear-algebra/assessment: new independently attemptable core assessment.

Each major core concept section includes purpose, plain definitions, geometric intuition, algebraic notation with symbol explanations, worked numerical reasoning, an experiment, misconception, ML application, prerequisite recall and deterministic checks with remediation. Sixteen understanding objectives are mapped to four competencies, four exploration records and two explicitly historical legacy-completion records; one aggregate objective records independent core mastery.

## Interactive labs

The two original subject labs are reused and extended; the geometry milestone's third/fourth planned labs were not built early. Four concept activities provide:

1. Vector addition, scalar multiplication, magnitude and unit direction. Coordinate graphics and equivalent numeric tables distinguish u, v, sum and scaled vector. Native sliders permit negative/zero cases.
2. Dot product, cosine/angle and projection. Zero vectors produce explicit undefined-direction/angle/projection explanations, not fabricated zero angles. Length effects and feature scaling/units are explained before similarity interpretation.
3. A rectangular 2×3 batch with a length-3 weight vector. Changing the first example leaves the second example fixed; tables and contribution readouts explain each result.
4. A 2×3 by 3×2 row-column product with an incompatible-right-shape experiment. Errors explain the inner-dimension mismatch; restoring compatible shape restores results without silently dropping features.

The original matrix editor now uses a semantic table with caption, scoped column/row headers and labeled native inputs instead of an incomplete ARIA grid. Named keyboard-scrollable regions contain narrow tables. Both original numeric editors reject nonfinite/overflow-scale values outside ±100 and retain the previous valid value; v1 mathematical APIs remain unchanged. Weighted-score and batch-prediction changes have scoped status output. Broad whole-stage live regions were removed.

## Assessment and evidence

Pinned blueprint: CORE_BLUEPRINT in apps/web/app/math/linear-algebra/content.ts, version 1.0.0. Module: linear-algebra.foundations. Assessment: linear-algebra.core.assessment.v1. Core mastery: linear-algebra.foundations.core-mastery.

- 16 questions, four per competency, one point each.
- At least 80% overall means 13/16; all four critical objectives must pass in the same attempt.
- Critical gates: magnitude; signed weighted dot product; rectangular matrix-vector result shape; matrix-matrix compatibility/output shape.
- Numerical absolute tolerance 0.001. Two deterministic variants change numerical values and selected semantic scenarios. No timer; unanswered questions score zero.
- Review, edit, explicit submission confirmation, focused results, explanatory remediation links, alternate-variant retry and recent-history display.
- Solutions remain hidden until submission. Missed noncritical objectives retain remediation; aggregate core mastery never asserts that every individual objective or geometry objective passed.

Evidence uses the unchanged LearningEvidenceV1 and existing exercise evaluators. Exploration alone records activity; eight correct checks plus two concept interactions complete each extended lesson. Copying NumPy code continues to preserve the old historical flag behavior but creates no new understanding or mastery evidence. Independent mastery is awarded only on a passing assessment; later failed attempts preserve earlier earned mastery.

Storage: ml-math-lab:evidence:math.linear-algebra:v1. Draft: ml-math-lab:assessment:math.linear-algebra:core:v1. One validated bounded draft and the last 20 own assessment attempts are retained, without trimming unrelated attempts. Partial responses, including numerical zero, survive reload. Review consent resets on reload. Submitted drafts must match canonical saved attempts; forged results are rejected. Unsupported/corrupt evidence bytes are not relabeled or overwritten; save failures remain visible and the visit remains usable.

Legacy import is explicit and idempotent: only five literal true flags create a historical-completion objective with the original key as provenance. It creates no understanding, modern lesson completion or mastery, and never deletes the original key. The old Reset this lesson action affects only its old five flags; new core evidence and other lessons remain intact.

## Mathematical contracts and tests

New additive runtime: packages/math-runtime/src/vector-operations.ts, exported from the existing index. Python equivalent: python/mlmath/vector_operations.py. Schema/fixture: packages/math-contracts/schemas/vector-operations.v1.schema.json and fixtures/vector-operations.v1.json.

The bounded 2D trace accepts two finite components per vector (absolute value ≤100) and a finite scalar (absolute value ≤10). It returns sum, scaled vector, magnitudes, unit direction, signed dot, cosine, angle in degrees and projection. It reuses dotProductTrace; normalized directions avoid tiny-denominator failures in angle/projection calculations. Null marks genuinely undefined zero-vector operations. No general eigensolver, inverse routine or expression parser is introduced.

Seven frozen Python-generated cases cover ordinary, perpendicular, opposite, zero-left, zero-right, signed and maximum-bound inputs. JSON schema validates traces and rejects future versions. TS/Python tests compare to those fixtures, analytic 3–4–5 and signed-coordinate references, projection residual orthogonality, zero/tiny-vector cases, invalid dimensions, nonfinite/overflow-scale boundaries, rectangular products/order and the original house baseline. Exercise expected values are independently checked against hand-calculated arrays.

## Verification results

| Check | Result |
|---|---|
| Full frontend + TypeScript runtime suite | PASS: 221 tests in 37 files |
| Full Python suite | PASS: 78 tests |
| New schema and frozen parity fixtures | PASS: seven cases, schema validation and future-version rejection |
| Type checking | PASS |
| Production build | PASS: 32 static pages |
| Core lesson objective/persistence tests | PASS: both complete/reload; old Algebra/Derivatives/LR bytes preserved in seeded tests |
| Assessment/evidence tests | PASS: 13/16 threshold, all critical gates, high-score failure, changed retry, prior mastery, per-assessment history retention, draft validation and save failure |
| Legacy compatibility tests | PASS: unchanged house baseline, feature-order diagnosis, explicit import, copying adds no new mastery, reset isolation, native table structure and bounded editing |

Commands: npm test; npm run typecheck; npm run build; PYTHONPATH=python work/task-011-verification-venv/bin/python -m pytest python/tests -q. Logs are under work/task0123-*.log. One earlier regression test found an ambiguous feature-order label after adding the new checks; it was scoped to the named existing lab, and the final full suite passed.

## Production-browser evidence

Testing used port 3018 as a separate origin from the existing port 3017 learner preview. The final build was also restarted on port 3017 and the delivered overview verified there.

- Both extended lessons: native keyboard control changes, all 16 correct checks, completed summaries and reload persistence.
- Wrong magnitude feedback explained √(x²+y²). A zero projection direction explained undefined projection. Incompatible matrix shape produced a readable error and recovered after restoring compatibility.
- Original matrix editor: ArrowUp on House B Bedrooms changed 2→3 and predictions [28,39,29]→[28,41,29]. Tab reached House B Location. An attempted 1e308 edit was rejected with previous valid predictions retained. Reset of the historical lesson preserved modern core completion after reload.
- Assessment v01: 15/16 (93.8%) with one critical miss awarded no new mastery. Review received focus; submission remained disabled until explicit confirmation. Targeted remediation returned to completed vector content and retained evidence.
- Assessment v02: changed values/scenario wording; all 16 responses, including zero, survived draft reload. Submission passed 16/16 and every critical objective; result/mastery and both attempt summaries survived reload.
- Measured 320 CSS px: overview, both extended lessons and assessment active/review/passed-result states all had document width 320. All five original stages on each lesson also measured 320. The 332px matrix table stayed inside its named 248px scrolling region. No unnamed form controls were found in the exercised active assessment.
- Skip link entered core content. A sequential vector keyboard walk reached the legacy footer after 35 further Tab stops without a trap. This is scoped evidence, not a complete keyboard certificate across every state.
- Screenshot inspection completed; the viewport override was reset. The delivered overview is open on port 3017.

## Accessibility and remaining findings

Implemented: native controls, semantic fieldsets/legends, labeled inputs, heading-linked concept regions, skip links, focus outlines, focused review/results, scoped feedback, non-color-only vector labels/styles, numeric alternatives and named table scrollers.

NOT VERIFIED: real VoiceOver/NVDA speech, genuine 200%/400% browser zoom, comprehensive matrix/assessment keyboard traversal, all state/nontext contrast, text spacing, focus obscuration, target-size exceptions, reduced-motion behavior and the full supported browser/device matrix. No dedicated full accessibility-scanner pass or formal learner study is claimed. Manual QA/accessibility and curriculum owners remain listed in RELEASE_ACCESSIBILITY_QA_BLOCKERS.md.

## Preserved behavior and file inventory

Protected snapshot: 98 existing files. 97 remain byte-identical; the only changed protected file is packages/math-runtime/src/index.ts, with one additive export. Algebra, Derivatives, Linear Regression, original runtime implementations, existing schemas/fixtures and every notebook remain unchanged. Existing lesson route URLs, legacy keys and five-flag semantics remain reachable. The two original vector/matrix source files are intentionally extended rather than duplicated. No Git repository is present in this workspace, so preservation is recorded through source inventory and hashes rather than a Git diff.

Created web files under apps/web/app/math/linear-algebra/: page.tsx, assessment/page.tsx, assessment.tsx, content.ts, model.ts, use-evidence.ts, experiments.tsx, core-learning.tsx, catalog.ts, model.test.ts and core.test.tsx.

Created mathematical files: vector-operations.ts; vector_operations.py; the schema/fixture above; packages/math-runtime/tests/vector-operations.test.ts; python/tests/test_vector_operations.py.

Modified: original vectors-dot-product.tsx and matrices-lesson.tsx plus their existing tests; apps/web/app/math/page.tsx; apps/web/app/learn/foundation/reference-catalog.ts; apps/web/app/globals.css; runtime index. Runtime dist files reflect the build. Catalog now maps the two original lesson routes additively into the core module.

Updated documents: MATHEMATICS_FOUNDATIONS_IMPLEMENTATION_BLUEPRINT.md, V1_CURRICULUM_MASTER_PLAN.md, IMPLEMENTATION_STATUS.md, V1_IMPLEMENTATION_ROADMAP.md, TASK_017_CONCEPTUAL_DEPTH_BACKLOG.md, RELEASE_ACCESSIBILITY_QA_BLOCKERS.md and this report.

## Recommended Task 012.4

After founder approval, add the planned Linear Transformation Explorer and Eigenvector Intuition labs. Teach scaling/rotation/reflection/composition, basis/span/independence/rank, identity/inverse conditions, 2×2 signed determinant and singular collapse, then known eigenpairs and a bounded introductory PCA connection. Use chosen matrices and analytic examples, not a general solver or new PCA implementation. Preserve all core objective IDs and evidence, version added assessment coverage explicitly, and retain existing core mastery as core-only evidence. Require TS/Python geometry invariants, supported inverse round trips, singular handling, coordinate tables/text, native keyboard controls and honest AT/zoom acceptance.

Do not begin 012.4 or deploy from this completion report.

