# Guided free discovery tour design

19 October 2026. **Design proposal only; stop for founder approval before application changes.** Six screens connect one fictional house-price example across Math, Python, Algorithm and a static Coming Soon Project Studio preview. The 12–15-minute duration is a design target, not a measured learner result.

## Journey and timing

| Screen | Target time | Meaningful action and one dominant control |
|---|---|---|
| Entry | 0.5 minute | Choose guided or own pace; Start free tour |
| Math Lab | 3.5 minutes | Predict a parameter effect, reveal the graph and compare errors; Reveal / Check / Continue at successive states |
| Python Lab | 3 minutes | Trace the same equation in bounded NumPy slots; Check trace, then Continue |
| Algorithm Lab | 4 minutes | Step trusted training, inspect residuals/loss and try an unaided prediction; Step / Check prediction / Continue at successive states |
| Project Studio preview | 1 minute | Read planned workflow and scope; View my discoveries |
| Discovery summary | 1 minute | Review actual activity and how curriculum continues; Continue free learning |
| Total | 13 minutes | Flexible 12–15-minute guided target; no countdown or forced pace |

Explore mode may be shorter or longer. Stages 1–3 are directly reachable; Studio is labeled Preview / Coming Soon in navigation. Skipping explanations or jumping never awards a learning action. No mastery, certificate, prerequisite unlock or account creation belongs to this tour.

## Wireframe review set

The files are static design wireframes, not a working app or user-test result. Each screen has desktop and 390px mobile versions. 320px behavior is specified separately; these pictures alone are not a responsive acceptance pass.

| Screen | Desktop | Mobile |
|---|---|---|
| Tour entry | [Entry](wireframes/01-entry-desktop.png) | [Entry mobile](wireframes/01-entry-mobile.png) |
| Math Lab | [Math](wireframes/02-math-desktop.png) | [Math mobile](wireframes/02-math-mobile.png) |
| Python Lab | [Python](wireframes/03-python-desktop.png) | [Python mobile](wireframes/03-python-mobile.png) |
| Algorithm Lab | [Algorithm](wireframes/04-algorithm-desktop.png) | [Algorithm mobile](wireframes/04-algorithm-mobile.png) |
| Studio preview | [Coming Soon preview](wireframes/05-studio-desktop.png) | [Preview mobile](wireframes/05-studio-mobile.png) |
| Completion and planned offer | [Discoveries](wireframes/06-summary-desktop.png) | [Discoveries mobile](wireframes/06-summary-mobile.png) |

## Entry screen

Headline: “One house-price example. Three ways to understand it.” Supporting copy: “Follow the maths, trace the Python, and improve a small model. Then see what Project Studio is planned to connect.” The stage strip uses blue, teal, purple and amber with visible numbers and labels. A small “Anonymous · no sign-up · about 13 minutes” note avoids any account promise.

Guided is the default visible radio choice; Explore at my own pace changes navigation guidance only. Start free tour is primary. Quiet stage links allow immediate entry, including the labeled Studio preview. Entry offers Resume this tab only if a valid same-tab session is available, without claiming cross-device persistence. A new visitor sees no invented progress, streak or mastery percentage.

## Math Lab

Use the six existing fictional houses, equation `prediction = weight × area + bias`, and H04 (area 3.2 thousand ft², observed price $278k). Initial model w=42, b=140 predicts $274.40k with signed residual −$3.60k. Learner changes a pending weight to 44 while bias remains 140, predicts whether the selected home's absolute error will shrink or grow, and chooses Reveal change. Before reveal the graph shows only the committed line, actual points and a text label for the proposed parameter; pending predicted numbers and line are hidden.

After reveal, show prediction $280.80k, residual +$2.80k and absolute error $2.80k. Feedback explains that the line crossed the observation but moved closer. Repeated parameter changes create a fresh pending comparison, retaining the committed trace for context. Show weight choices 40/42/44/46 and bias 130/140/150 as native bounded controls with numeric labels; never require a drag. The first guided change uses weight only so that the causal comparison is clear.

Small challenge: from the worked 44/140 state, predict what happens to H04 error at 46/140 before reveal. Correct conclusion: absolute error grows to $9.20k; bigger weight does not always mean smaller error. All feedback is immediate after submission, explains the mechanism and allows retry. Wrong exploration is useful and never penalizes course evidence. A typed/table alternative carries every chart value.

## Python Lab

Display the current committed Math snapshot, canonical guided checkpoint 44/140 in the pictured screen. Code is explicitly “bounded trace, not a Python interpreter”:

```python
areas = np.array([1.0, 1.8, 2.5, 3.2, 4.0, 4.8])
weight = 44.0
bias = 140.0
predictions = areas * weight + bias
```

Match `areas` to x, `weight` to w, `bias` to b and `predictions` to ŷ in text as well as color. Learner fills two finite operator slots (`*`, `+`; distractors offered as choices), then predicts H04's output in $k. Check trace compares against the trusted snapshot and reveals the six-row output; no free text is executed, no package is installed and no request runs learner code. Optional one-line scalar arithmetic explains the vector result. A wrong operation gets a concrete changed-result explanation, not a syntax-only red mark.

If an explorer enters first, use labeled baseline 42/140 and explain the fallback. If Math changes later, keep the checked Python snapshot intact with an “Earlier parameter snapshot” label and an explicit Use latest Math settings action; do not silently replace or invalidate completed activity. Guided exit offers the canonical 44/140 checkpoint explicitly if the learner explored other values; no silent reset.

## Algorithm Lab

Start from the selected committed Math checkpoint or labeled baseline if none. Guided 44/140 has six-house MSE 17.186666… ($k)². Use trusted full-batch gradient descent for up to ten updates with a bounded choice of rate 0.001 or 0.01; default 0.01. First step yields w=43.8444, b=139.929333…, MSE 14.575740893…; the selected H04 residual is about +2.231413k. A model line, actual points, residual segments and a small loss history/table update from the same runtime trace. The primary Step once action is manual: no autoplay or implied generalization.

Learner can inspect the parameter/gradient explanation, compare rates from the same initial snapshot, or reset only this tour run. Label observed improvement as training loss on six fictional houses. There is no held-out performance, causal effect, convergence or real-market accuracy claim.

Unaided challenge uses a separately labeled arithmetic snapshot w=44, b=140 and a new unlabeled area x=2.0: “What does this model predict?” Expected answer $228k. Freeze this challenge snapshot while answering; hide its output and worked substitution until first valid submission. No solution/hint precedes that first response. Afterward show reasoning, allow assisted retry and record whether the first response was correct. It is a tour prediction check, not an independent course assessment or held-out accuracy test. Navigation stays open even if unanswered or incorrect.

## Project Studio preview

Always show “Project Studio — Coming Soon” at the title and in the stage strip. A static diagram names **Data → Preparation → Training → Evaluation → Prediction**. Use the same house-price story to explain each planned step, including training-only preparation and future held-out evaluation. Present these as descriptions, never upload widgets, Run/Train/Predict buttons, a fabricated dashboard, progress checkmarks or a completed project.

The tour has not implemented this workflow and cannot award project mastery. The existing limited Regression housing bridge can remain a quiet separately labeled practice link; it is not called Studio. The only primary action here is View my discoveries.

## Summary and conversion rules

Summary statements derive from actual action records: e.g. “Compared two parameter settings”, “Checked the NumPy trace”, “Inspected one training update”, “Tried the unaided prediction”. Only claim first-response correctness if the stored first valid answer proves it. A skipped stage says Not explored / Not attempted, never complete or failed. A learner can open the summary at any time without an award.

Meaningful activity is counted separately for Math (prediction plus actual parameter-change reveal), Python (valid trace submission and feedback inspected) and Algorithm (at least one trusted update inspected). Guided discovery completion additionally requires the valid unaided challenge attempt and viewing the static preview; correctness is not a navigation gate. No completion percentage or mastery badge is needed.

The planned-offer block appears only after meaningful activity in at least two of the three learning stages. Before that, show a neutral suggestion to explore a stage and omit the offer. Skipping/visiting alone does not trigger it. This is pacing, not a paywall; free routes are always reachable.

Exact proposed offer copy: **“Planned full program: $39 one-time.”** Follow with **“Purchase is not available yet. Included scope and availability will be confirmed before sale. Project Studio is Coming Soon.”** Do not imply all current open lessons are now locked, that projects can be used today, or that taxes/currency/refunds/lifetime updates are settled. Clarify dollar denomination before any sale. This directive authorizes the planned $39 amount for design, not a checkout or entitlement policy.

The primary action remains **Continue free learning** to an existing related lesson, suggested Regression equation `/learn/linear-regression/equation`. A quiet curriculum link opens an in-tour outline of actual Math/Python/Algorithm routes, with Studio marked Coming Soon; no broken `/pricing` or `/curriculum` route. The offer is informational, without fake disabled checkout, email capture, countdown, discount, scarcity or purchase CTA. Full offer/entitlement readiness needs founder approval before implementation of any sale.

## Reference mapping

Both founder images were inspected: “ML Mastery Interactive Learning Journey-1.png” supplies the connected four-stage journey and visual-before-code intent; “ML Mastery Learning Journey Interface-2.png” supplies the quieter hierarchy and explicit Studio identity. Retain white surfaces, stage colors and subtle static connectors. Reduce glow, claims, trophy/mastery symbolism, crowded cards and competing CTAs. Neither image authorizes a working Studio, sign-in, billing, lifetime access, counts or guaranteed outcomes. The latest directive controls: exploratory tour first, planned offer after meaningful activity.

This is a new proposed tour scope, not silent implementation or replacement of Phase 2.1's direct `/demo` CTA. A later approved integration could point Try a Free Lab to `/discover`; until then existing `/demo` and the accepted specification remain intact.
