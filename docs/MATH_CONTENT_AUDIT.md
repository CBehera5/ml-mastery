# Math content audit (22 Oct 2026)

Scope: the six Math subjects (algebra & functions, linear algebra, calculus, probability, statistics, optimization) plus the integration page, and the 40 book-derived lessons in `teaching/book-content.json`.
Method: every lesson route rendered in real Chromium and measured (words, SVGs, controls, prompts); about a dozen lessons read in full and screenshotted. Read-only; no code changed.
Rubric: story opener, a prediction before the reveal, a visual that carries meaning, runnable code or a playground, checks with hints, verified numbers.

## What already works
- A consistent skeleton on most lessons: story, "pause and predict", an explorer, a figure, a "try a quick prediction", then checks.
- Strong rigour: runtime-verified numbers, domain warnings, numeric alternatives to charts, honest limits ("a finite trace is evidence, not a proof").
- Good context (₹ prices, bakery, spam, salaries) and PDF-book figures with source credit.

## Gaps, ranked by impact on "fall in love with Math and Python"
1. **No runnable Python anywhere in Math.** None of the ~30 lesson pages has a live cell. The maths-to-code bridge, the project's promise, is missing. The Linear Regression pattern (bridge table, TODO cell, hidden checks) is not applied here.
2. **The story and the playground often do not match.** Optimization lesson 1 opens with a bakery profit problem, then shows an abstract loss-landscape explorer (a²−b², double well). The learner never returns to the bakery.
3. **The same lab is reused across lessons.** Probability: the "events" lab serves 3 lessons. Statistics: the "summary" lab serves 4 of 7. Optimization: landscape x2, training x2. Lessons feel repetitive and each lesson's specific idea is not isolated.
4. **Visuals are static or coarse.** One book PNG per lesson, though the books hold many more. The landscape is an 11x11 grid ("121 values"); there is no draggable surface, contour or ball. Several lessons (statistics sampling/ml, optimization, probability) have no SVG chart at all.
5. **Prediction prompts are not interactive.** "Pause and predict" is plain text; the real prediction sits in a collapsed `<details>`. Nothing commits the learner to an answer before the reveal.
6. **Copy reads like a compliance document.** Boilerplate repeats on every lesson ("Use the playground's displayed inputs when testing this idea", "Moving a control records activity; it does not by itself demonstrate understanding", "this dataset does not establish anything about a real population"). Correct, but it drowns the wonder.
7. **Data dumps shown by default.** "Runtime function samples" tables and "all 121 grid values" are open by default; most learners need them behind a disclosure.
8. **Inconsistent lesson templates.** Calculus uses a five-stage pager with a different look; linear algebra, integration and the book lessons each have their own layout. Visible text ranges from 136 words (calculus stage 1) to 2,800 (transformations).
9. **Navigation and naming drift.** Two calculus routes (`/math/derivatives`, `/math/functions-derivatives`) and "Lesson 03" labels outside the subject's own numbering.

## Per-subject verdict
| Subject | Verdict | Main work |
|---|---|---|
| Algebra & functions (6) | Keep, deepen | Python cell per lesson; interactive predict; tie playground to the delivery-bill story |
| Linear algebra (4 routes) | Deepen | Draggable vector/matrix-transform playground; dot-product code cell; unify layout |
| Calculus (2 routes) | Rewrite structure | Merge routes; use the lesson pattern; slope-zoom playground; numerical-vs-analytic cell |
| Probability (6) | Deepen | One lab per lesson (Bayes tree is good); simulation cells (coin/dice, Monte Carlo) |
| Statistics (7) | Deepen | Replace the 4x reused "summary" lab with one per lesson; sampling-distribution simulation |
| Optimization (6) | Rewrite labs | Story-matched playground; draggable loss surface with learning-rate ball; Python gradient cell |
| Integration page | Keep | Thin; becomes the capstone linking all six |

## Recommended order of work
1. Template: apply the Linear Regression lesson pattern to Math (`CodeLabSection`, `PredictStory`) with shared visuals (vector arrows, loss surface, distribution plot).
2. Optimization first (closest to Linear Regression: gradient, learning rate), then Calculus, then Algebra.
3. Copy pass: move boilerplate into one shared "how to read this page" disclosure.
4. Probability and Statistics: simulations in Python.

## Not assessed in this pass
Quality of the assessment questions, the Python, Algorithms and Foundation sections, mobile layout of every lesson, and real screen-reader behaviour.
