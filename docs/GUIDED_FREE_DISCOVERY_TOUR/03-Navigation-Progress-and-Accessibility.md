# Navigation anonymous progress and accessibility

## Routes and open exploration

Proposed additive routes: `/discover` entry; `/discover/math`, `/discover/python`, `/discover/algorithm`, `/discover/studio-preview`, `/discover/summary`. These are not implemented. Keep existing course routes, `/demo`, `/beta` and all independent assessments unchanged. The Phase 2.1 public landing and `/journey` remain a separate proposed scope; this tour does not implement them.

Guided mode recommends Math → Python → Algorithm → Preview → Summary. Explore mode makes the same stage links prominent without changing content or evidence rules. Both modes allow direct entry, backtracking, skipped explanations and immediate exit to free learning. Studio is a reachable static preview, not an available project tool. Visible stage numbers are navigation, not prerequisites or mastery badges.

At direct entry without earlier work, clearly initialize the shared baseline 42/140. Guided canonical checkpoint 44/140 is offered explicitly. Math, Python and Algorithm each display their immutable current source snapshot; returning to Math can create a new snapshot without silently replacing checked Python or training traces. Use latest Math settings is explicit and affects only future work. Back/Forward restores navigation and valid tour state without automatic checking, reveal, training or conversion.

One dominant action per state: Math Reveal then Check contrast then Continue; Python Check trace then Continue; Algorithm Step once, switch explicitly to prediction challenge, Check prediction then Continue; preview View my discoveries; summary Continue free learning. All other stage links, skip/reset and mode choice are quieter but remain keyboard reachable.

## Anonymous state proposal

Default to in-memory state with **best-effort same-tab `sessionStorage`**, using proposed isolated key `ml-mastery:discovery-tour:v1`. Reuse neither course keys nor the dashboard progress reader. Same tab/same origin reload may restore valid state; new tab/device/private-session closure does not promise continuity. No login, cookies, account, email, server record, analytics identifier or cross-device sync. Warn when storage is denied; continue in memory without claiming a save.

Proposed envelope: schema version, fixture identity, mode, last explicitly visited tour route, committed Math snapshot, pending comparison, Python snapshot and bounded responses, training initial snapshot/rate/current update index, first challenge response/result/help state, stage action flags and preview-viewed flag. Store only bounded IDs, finite numeric values and short tokens; no arbitrary code, uploads or personal house data. Cap envelope at 32 KiB and histories at current/last result; no unbounded event log.

Hydrate/validate before any write. Check exact version/fixture, owned route, finite enums/ranges, response shape and capped size. Unsupported, corrupt or future records are preserved untouched; use an in-memory fresh view with an explicit warning. A deliberate Reset this tour may replace/remove only the owned tour key after a confirmation explaining that same-tab tour activity is lost. No `localStorage.clear`, broad scan, migration or course import.

Restore pending comparisons to the pre-reveal state; never auto-submit or auto-reveal. Previously revealed valid bounded trace IDs may be restored and recomputed through trusted calculations. Validate stored first-response correctness against the fixed snapshot rather than trusting a stored `correct:true`. Tour state is editable formative session data, not tamper-proof assessment evidence.

### Activity semantics

Visited, action performed, first response checked, assisted retry and preview read are separate. No raw “100% mastered” or course completion record. A valid but wrong response is an attempted activity; skipping is not. Guided discovery is marked finished only when all three meaningful stage actions, a valid unaided challenge attempt and preview viewing are present; this is a tour-session label, not mastery. Offer timing requires meaningful activity in at least two different learning stages; no pooling of course evidence or previous tour versions. Partial summary remains accessible.

Changing state never awards or resets Math/Python/Regression/Model Selection mastery. Entering a full lesson leaves its original controller/evaluator responsible for any course writes only after the learner's normal course actions. Merely arriving from the tour transfers no score, attempt, completion or access privilege.

## Accessibility and responsive requirements

White backgrounds, dark readable text, blue/teal/purple/amber stage accents and generous spacing. Pair colors with stage names/numbers, shapes and line patterns. Actual observations are circles, prediction line is solid and residual segments dashed, with text explaining their sign. The accessible table and selected-house text are equivalent to the graph, not a separate approximation. No hover-only values, drag-only control or hidden Coming Soon label.

Use native labeled numeric/select/range controls, with keyboard and button/select alternatives for every chart selection. For pending changes announce the proposed setting without leaking its new result. After reveal/check, announce a concise result once and move focus only to an explicit feedback heading when needed; do not flood live regions on every slider tick. Native input errors identify the expected unit and accepted format. First challenge answer must not exist in hidden accessible help before submission.

Charts have title, units, axis ticks, selected-row description, legend and table alternative. H04 example: “Area 3.2 thousand square feet. Observed 278 thousand dollars. Current prediction 280.8. Residual plus 2.8, an overprediction.” Loss chart text says MSE in squared thousand-dollar units; no percent/accuracy label. Python tokens carry equation-variable names in labels; color highlighting is supplementary.

Desktop ≥1024px: maximum width about 1200px; stage strip above one main workspace, chart/code area about two-thirds with a compact explanation/control column. Put one active task ahead of optional details. Mobile 320–767px: 16px gutters, single column, stage navigation as a labeled disclosure/list, equation wrapping without clipping, controls followed by scalable chart/table and feedback. Tablet 768–1023px may use two columns only when labels/data remain readable. Footer offer stacks below summary, not as a sticky overlay. Do not shrink text to make a desktop screen fit.

Wireframes use 1440×960 desktop and 390px mobile canvases. Mobile screens are intentionally scrollable; actual 320px must be verified later. No document-level horizontal overflow; code/tables may use clearly labeled local scroll with full text/table access. Body text 16–18px, line lengths about 60–75 characters, touch targets design target 44px. Stage navigation does not force a horizontal carousel.

Use restrained static connectors, no autoplay or looping glow. Respect reduced motion; if later transitions are added, offer instant equivalent state changes. No timing challenge or countdown. Screen-reader, keyboard, actual 200%/400% browser zoom, contrast, focus, text resizing and reduced-motion checks are required for the implemented tour. These static wireframes are not accessibility passes. Existing platform Colab/original-directory I/O obligations remain distinct and open.
