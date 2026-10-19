# Reusable lesson design system

A presentation and authoring specification for existing approved curriculum. Preserve objective IDs, assessment banks/gates, evaluator semantics, numerical contracts and persistence. A proposed new interaction or substantive teaching correction needs its own reviewed implementation scope.

## Learning sequence

| Step | Learner sees and does | Required design behavior |
|---|---|---|
| Orient | One concrete problem and “After this, you can…” in ordinary language | Readable title and location, one primary next step; IDs stay in traceability metadata or secondary detail |
| Recall, optional | Up to two prerequisite refreshers with a short reason | No lock or automatic credit; return to same lesson; preserve native evidence scope |
| See | A labeled visual example: graph, array, split, data boundary or model trace | Define symbols and units at first use; text/table equivalent; static/reduced-motion mode |
| Predict | State an expectation before a reveal where the current contract requires it | Incomplete/invalid prediction distinct from wrong reasoning; explicit state feedback |
| Manipulate | Change one meaningful bounded quantity | Show changed input, before/after result and mechanism; reset only owned lab state |
| Explain | Connect observation to maths and Python | Synchronized symbols, values and short trusted code; execution boundary explicit |
| Practice | Original objective-specific guided practice with feedback | Keep retries, variants, paired reasoning and remediation unchanged; do not turn all tasks into click-to-reveal |
| Transfer | Apply idea to a changed case | Preserve existing evaluation; no claim that browsing equals transfer or mastery |
| Continue | Next lesson or original independent assessment | Summarize completion separately from earned mastery; review and explicit confirmation remain required |

Lessons need not become a forced wizard. Use an anchor outline with full content reachable, and one primary action for the active activity state. Required paired components remain visible together. Assessment content must remain separate from worked teaching and answer previews.

## Reusable components and states

- Lesson frame: stage/module breadcrumb, readable lesson titles, current location, concise summary, anchored outline, stable next/back routes and skip link. Mobile outline is a labeled disclosure; opening it does not mutate progress.
- Concept visual: labeled axes, units, legend, textual statement of the current result and accessible data table; color has redundant shape/text cues. Do not draw a decorative chart unrelated to the actual reference.
- Playground: prediction, bounded control, observed change, explanation, reset, loading/error/unavailable states. One control change must visibly affect a reviewed result or explain why it cannot. Never fabricate continuous computation from a finite reference lookup.
- Worked example: problem → intermediate steps → result → limitations; optional deeper derivation, never hide prerequisites needed for a scored objective.
- Maths/Python bridge: highlight the same quantity in equation, data representation and trusted author code. Code has local horizontal scrolling/copy affordance only if later approved; no hosted learner execution claim.
- Guided practice/paired gate: original controls and grader, clear feedback and route to targeted recall. IDs may remain in expandable policy detail but accessible names need human descriptions.
- Progress summary: activity, lesson completion, independent attempt, mastery and unknown each distinct. Storage errors preserve original bytes; no zeroing unknown, inferred proficiency or cross-module award.
- Assessment frame: original full form, review/edit, explicit confirmation, result and targeted remediation, complete fresh retry. Presentation must not combine partial attempts, reduce criteria, auto-submit or expose accepted answers.

## Concrete adaptation candidates

Algebra variables: foreground the existing Function Explorer beside its labeled rule and units, then keep full explanation/checks below. NumPy N01: visualize six cells arranged `(3,2)` versus `(2,3)`, preserving order and count; pair this with the approved reshape example and warn that grouping changes. Model Selection MS01: propose two parallel evaluation lanes showing identical or mismatched row IDs/budgets, then the approved baseline-relative error example. It is a diagram specification, not a replacement dataset or numerical-policy change. Keep the complete MS reference trace accessible; a concise table may summarize it only from the original approved values.

## Visual and accessibility rules

Use the same semantic canvas/text/control/focus/error tokens across hubs and lessons. A dark lesson theme is acceptable only with verified shared navigation, code and form contrast; it must not inherit dark text from a light shell. Proposed primary blue is an action token, stage colors are contextual. Maintain readable line lengths and consistent spacing; avoid walls of identical panels and simultaneous high-emphasis controls.

Every control has a persistent label, visible keyboard focus, predictable focus order and meaningful status text. Arrow-key/native-control behavior must be verified on the supported browser process. Charts have keyboard-operable alternatives; wide numerical data scroll locally. No drag-only task, forced animation, color-only correctness or focus loss after reveal. Verify 320/390/768/1280px layouts plus real zoom and screen reader separately. Accessibility remains a release obligation, not an inferred pass from design tokens.

## Authoring and review contract

Each objective row maps teaching → visual/interaction → worked example → two existing practice variants → three independent forms → remediation → trusted reference. Mark coverage as present, weak or missing with evidence; do not silently rewrite an assessment to fit a visual. A presentation pilot passes only if all existing mastery, persistence, numeric, build and browser gates remain valid and prior learner evidence is preserved. Cross-module presentation reuse must not centralize or change evaluator ownership.
