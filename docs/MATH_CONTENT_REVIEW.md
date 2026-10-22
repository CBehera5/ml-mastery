# Math content review (22 Oct 2026)

Scope: every playground, code cell, reflection and page-level paragraph added in the redesign (Optimization, Algebra, Calculus, Linear Algebra, Probability, Statistics, Integration), read against `docs/MATH_VOICE_GUIDE.md`. Also scanned the 40 book-derived lessons in `math/teaching/book-content.json` for long sentences and system self-talk.

## Method
1. Extracted every playground title, intro and note, and read them in order.
2. Checked each factual claim against the tested maths (all quoted numbers are asserted in `extras/*.test.tsx`).
3. Scanned lesson pages for progress-system self-talk, sentences over 30 words and colour-only encodings.

## Fixed in this pass
| Area | Issue | Fix |
|---|---|---|
| Optimization, Probability, Statistics | After "Record experiment reflection" the notice said "Lesson completion requires this activity and all four objective checks; no mastery is awarded." (system self-talk) | "Saved. Answer the four checks below to complete this lesson." |
| Same three | Progress disclosure: "…this does not earn mastery." | Says what to do, then one line: mastery comes from the module assessment. |
| Same three | "No randomness decides mastery. Completion alone is not mastery." | "Answers within 0.00001 count as correct. Finishing lessons does not count as mastery." |
| Algebra, Linear Algebra | "Correct checks record understanding evidence; experiment interaction records activity only. Numerical tolerance is 0.001." | "Answers within 0.001 count as correct." Status line reads "Experiment done. N of 4 checks done." |
| Optimization, Probability, Statistics overviews | "Follow the numbered path or revisit any step; each starts with a question and a controlled investigation." | Says what the learner will do: explore in a playground, then write it in Python. |
| Calculus secants | Intro led with the division-by-zero caveat | Caveat moved to the note, after the delight (guide rule 6) |
| Calculus rules, Integration capstone, Linear Algebra matrix × vector, Probability events, Statistics sampling | Intros of four to five sentences or vague phrasing ("compressed reasoning", "each unit is worth") | Three sentences, concrete wording |
| Probability conditional | Pass and fail told apart by colour only | Solid dots passed, hollow dots failed (also stated in the text) |
| Statistics distributions | Note mentioned box plots, which the page does not show | Removed |
| Statistics relationships | Cell footer said r ≈ 0.999; the data gives 0.998 | Corrected and asserted in a test |
| Statistics sampling | A reflection question was a run-on | Rewritten |

## Checked and fine
- The 40 book-derived lessons have no sentence over 32 words and no progress-system self-talk. "Evidence" there is the domain word (Bayes, sampling).
- Every playground note that states a rule is backed by a test: Pythagoras 3-4-5, 11/36, 9.17% Bayes posterior, SE = σ/√n, step-size valley, and so on.
- Reflection answers state honest limits (one step is not convergence; correlation is not causation; one test set gives an estimate, not a fact).

## Open decisions for you
1. **Currency and units.** The new playgrounds use ₹ lakh (India-first). The Integration page and its existing checks use fictional "$k" and "thousand dollars", and Linear Regression uses its own units. Pick one house-price unit across the course. Changing the Integration page means updating its tested numbers' labels only, not the values.
2. **Calculus routes.** `/math/functions-derivatives` is kept as a short tour with a banner pointing to Algebra and Calculus, because Linear Regression and the legacy-progress tracker link to it. Redirecting it is a one-line change once you are happy with that.
3. **Assessment pages.** Mastery assessment copy (tolerances, "no timer", scoring rules) is accurate but dense. It was left unchanged here; a rewrite should be done together with the assessment UI.
4. **Book-derived text** was reviewed only for length and self-talk, not re-edited. A line-by-line editorial pass on the 40 lessons is a separate piece of work.
5. **Unscored interactions.** Dragging, sliders and buttons only record "exploring" for the existing experiment evidence. They never write checks or mastery. A test in each subject keeps it that way.

## Not verified
Safari and Firefox; real screen-reader runs; 200% and 400% zoom. Chromium at 1100 px and 390 px only.
