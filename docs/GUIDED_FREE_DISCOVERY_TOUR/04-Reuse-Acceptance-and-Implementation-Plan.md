# Component reuse acceptance and bounded implementation plan

## Existing-component reuse matrix

| Existing source | Candidate reuse | Required boundary / gap |
|---|---|---|
| `learn/linear-regression/lab-data.ts` | Same six fictional houses and baseline 42/140 | No fixture edits; tour IDs/units mapped explicitly |
| `packages/math-runtime/src/regression.ts` | Evaluation, residuals, MSE, gradients and bounded training trace | No engine, precision/tie policy, source fixture or version change |
| `learn/linear-regression/components/lab-ui.tsx` | ParameterSlider, GuidedPrompt, RegressionPlot, LossChart, formatting concepts | Reuse where accessible; pending-result masking, two-decimal rule, selected-row text and fixed axis comparison require explicit tour adapter/review; do not change course defaults globally |
| Existing EquationLab / GradientLab | Interaction patterns and explanatory source | Do not mount full course controllers or inherit broad parameter bounds/autoplay; isolate the tour's 12 starts, 2 rates and 10 steps |
| `python/foundation/learning.tsx` AnswerInput patterns | Native bounded response UI ideas | Do not reuse a course grader/store or import accepted answers into public search/navigation; no learner Python execution |
| Existing NumPy teaching | Equation-to-array mental model | Author bounded tour token trace; no notebook/kernel/backend or unrestricted editor |
| `components/beta-nav.tsx` | Native menu/Escape/focus behavior where suitable | A small anonymous tour shell may wrap this pattern; no simulated sign-in or application-wide nav rewrite |
| Learning Journey catalog / existing module URLs | Truthful curriculum continuation links | No algorithm progress adapters or dashboard write; missing aggregate evidence remains unknown |
| Existing Regression housing bridge | Optional clearly labeled existing practice link | Not a Studio implementation or a completed project |
| Studio and commercial UI | None to imply working functionality | Static workflow and planned $39 information only; no checkout, project simulation, lead capture or entitlement layer |

Reuse requires actual interface and accessibility review. The existing RegressionPlot auto-scales from active predictions; comparing before/after needs a common reviewed axis domain or two explicit scales, otherwise movement can mislead. A scoped adapter or tour-owned visual may be preferable to changing shared defaults. No new dependency is presumed necessary.

## Acceptance criteria

1. **Source protection:** compare all existing app/runtime, frozen reference, notebook, mastery/version and access-control sources to the reviewed baseline; only separately approved tour files/adapters may change. No course evidence write on entry, navigation, completion, reset or conversion.
2. **Story/data:** all three learning stages use exactly the six houses, units and captured parameter snapshots. Every numeric result comes from the same trusted engine; signed residual is prediction minus observed. No target invented for x=2.0 and no training metric advertised as unseen accuracy.
3. **Math loop:** pending parameters cannot leak a new line/result before prediction; reveal gives correct line/point/error, feedback explains the contrast and the 46/140 challenge demonstrates that bigger weight need not reduce error. Graph, table and text agree.
4. **Python bounds:** all authored slots/outputs verify for every allowed Math snapshot; no `eval`, dynamic code compilation, shell, remote kernel or arbitrary execution. Inputs clearly show their equation roles and snapshot.
5. **Training:** all 24 start/rate runs and 264 visits are independently checked, finite and within existing engine rules. Step indices and simultaneous updates are correct; rate comparison restarts at the same initial state. Rounded displays never feed calculation. Any unexpected engine/reference discrepancy stops work.
6. **Unaided challenge:** fixed w=44/b=140/x=2.0 snapshot, hidden output before first valid submit, correct 228 $k, exact input-format behavior, invalid versus wrong distinguished, first response immutable for summary, post-reveal retries marked assisted. It awards no course mastery.
7. **Preview truth:** Studio title/nav always says Coming Soon; static five-step workflow only, with no upload, Run/Train/Predict/launch controls, checkmarks implying completed projects, date promise or project mastery.
8. **Open navigation:** anonymous direct entry, guided/explore, skip, all available stage jumps, Back/Forward and reload work; new/missing-state baseline is labeled. No sign-in/payment interruption or route lock.
9. **State safety:** same-tab hydration-before-write, invalid/future/corrupt preservation, denied/quota fallback, schema/fixture isolation, bounded size, snapshot restoration, explicit tour-only reset and no other storage-key writes. Old course records remain byte-identical in disposable test fixtures.
10. **Summary/offer:** statements reflect actual activity and first-response evidence. Partial/skipped state does not fabricate completion. Planned $39 block appears only after two core stages' meaningful actions. Exact “planned / purchase unavailable / scope before sale / Studio Coming Soon” copy; free continuation remains primary. No timers, scarcity, purchase, price-lock, lifetime, discount, fake paywall or hidden consent.
11. **Accessibility/mobile:** graph text/table parity, keyboard-only control, native selection, focus and concise announcements, 320/390/768/1280/1440px layouts, actual reader and real 200%/400% zoom, measured contrast and reduced motion. Static PNGs and AX snapshots do not close genuine checks.
12. **Verification:** full frontend/TypeScript/Python regressions, typecheck, production build with approved lockfile/runtimes and conventional install; affected frozen checks including 972 KNN cases stay unchanged; two fresh notebook kernels remain distinct from Colab. Fresh independent CI on exact reviewed implementation SHA with complete final outcomes and browser/session restoration evidence. No deployment or external learner testing without separate authorization.

## Bounded implementation sequence for future approval

| Step | Concrete reviewed output | Gate |
|---|---|---|
| 0 Design approval, now | Six desktop/mobile screen pairs, shared mathematical proposal, state schema, exact offer wording, reuse/acceptance plan | Founder approves scope before application changes |
| 1 Contract preparation | Tour-only manifest/IDs, finite token responses, snapshot schema and oracle comparisons against existing engine | No changes to old references; freeze tour specification only after founder review of units/bounds/input rule |
| 2 Read-only shell and data views | Proposed additive `/discover` routes, static preview, curriculum outline, responsive chart/table/code presentation | Navigation and truthful capability review; no working project or payment surface |
| 3 Guided activities | Math pending/reveal, bounded Python trace, manual trusted training and fixed unaided query | Exact state/answer checks and accessible interactions; no course-store import |
| 4 Anonymous session and summary | Tour-key-only restoration/reset, activity summaries and gated informational planned offer | Adversarial storage/version fixtures, course no-write proof and honest partial-state copy |
| 5 Verification and review | Complete regressions/build, trusted calculations, desktop/mobile/keyboard and actual accessibility evidence, independent CI | Stop for founder review; no merge/deploy inferred |

The public landing CTA remains `/demo` under the earlier Phase 2.1 specification. A separate approved integration decision could point it to this additive `/discover` entry when the tour passes verification. This proposal does not build the full Free Labs catalog, landing, authenticated navigation, pricing integration, Studio engine, capstone, universal curriculum/evidence store or lesson redesign.

## Risks and founder decisions

- Confirm the proposed 12–15-minute / 13-minute target and lightweight six-house scope. It is not evidence of learning efficacy; no outside learners were tested.
- Approve reuse of existing fictional $k / thousand-ft² inputs, the 12 starting states, two rates, ten steps and tour-only decimal representation. No global numerical-policy change.
- Approve in-memory plus best-effort same-tab session storage; no account, durable/cross-device persistence or telemetry. Unknown versions preserve bytes rather than overwriting.
- Approve the fixed unaided prediction check as formative tour activity, not course assessment/mastery. Simple published arithmetic is not secure testing.
- Confirm the planned $39 wording and intended dollar currency; scope, tax/refund terms, future-feature entitlement and any sale remain unresolved before commercialization. Current open content stays open.
- Approve the informational offer threshold (two meaningful core-stage actions), snapshot carryover and explicit use-latest behavior; no completion/payment gate blocks free exploration.
- Decide later whether a verified tour replaces `/demo` as the landing CTA destination. Keep both routes and original learner evidence intact.
- White-background wireframes use ML Mastery as the founder's tour working title; final umbrella naming remains subject to the existing brand decision. No global brand change is made here.

No application implementation, course mastery modification, reference re-freeze, project engine, payment, merge or deployment has occurred. Stop for founder review.
