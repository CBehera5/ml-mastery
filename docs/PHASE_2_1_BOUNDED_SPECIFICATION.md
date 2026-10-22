# Phase 2.1 navigation and landing page specification

19 October 2026. **Specification only, ready for founder review.** Baseline `754d07d2322977e14e0b629f11af9c4bc29a8d58` on `task-015-12-knn-portability`. The accepted Phase 2 package supplies the audit and planning context; this document narrows its broader recommendations to one first implementation tranche. No application implementation is authorized by this specification.

## 1 Purpose and bounds

A visitor should understand the four learning stages, recognize what is available, and reach one existing free experiment. A returning learner should reach the unchanged Learning Journey and original learning routes without losing progress or confusing completion with mastery.

In scope for a later approved implementation: minimalist public `/`; additive `/journey` wrapper around the existing dashboard; public and learner navigation links; exactly four stage presentations; factual catalog/copy corrections; one dominant “Try a Free Lab” action to `/demo`; Project Studio Coming Soon; scoped accessibility and preservation verification.

Excluded: new authentication/session backend, entitlement changes, complete Free Labs system or `/labs`, Curriculum Explorer implementation or `/curriculum`, pricing page/billing/payment, new embedded playground, lesson-content/layout redesign, global design-system rewrite, new resume/evidence adapters, progress migrations, numerical changes, Project Studio/capstones and MLOps. Existing `/demo` remains the working destination. No demo extraction or model retraining is required.

The earlier Phase 2 landing proposal included lab cards, Explorer and program sections. Those are deferred here. Phase 2.1 needs a short hero, one four-stage path and a compact utility footer, not a smaller version of every future screen.

## 2 Public and learner navigation

Recommended route choice for approval: public `/` and learner `/journey`, with the original dashboard component reused. Public home is the same informative page for everyone; no session/proficiency-based automatic redirect. Existing open learning remains open.

| Context | Navigation requirements | Authentication truth |
|---|---|---|
| Public landing, current app | Brand to `/`; Learning stages to `/#learning-stages`; My learning journey to `/journey`; Help to existing `/beta` | No sign-in/sign-out/avatar/upgrade controls; browser progress is not an authenticated session |
| Learner dashboard or existing lesson, current app | Existing Browse topics / Challenges / Help disclosure behavior retained; journey and brand links to `/journey`; quiet Public home link may sit in Browse | Label by learning context, not “authenticated”; learner routes continue to work without login |
| Future genuine authenticated state | Reserved contract: validated existing session may replace journey label with an account-aware journey link and expose real supported account controls | Not implemented in this tranche. A separate authorization must identify the actual session provider and capabilities; never simulate login from storage presence or cookies |

Current source has no authentication middleware/session provider in the reviewed entry/navigation files. “Public versus authenticated navigation” therefore means specifying an honest boundary, not installing authentication. Unknown session state must never create a purchase/access gate. No cross-device or account-sync promise.

The complete [route and component ledger](PHASE_2_1_ROUTES_AND_COMPONENTS.md) defines destination changes, root-hash compatibility and permitted files.

## 3 Landing content and hierarchy

Header: existing working brand “ML Math Lab” until the founder resolves the umbrella name; quiet Learning stages and My learning journey links. Mobile uses one labeled navigation disclosure. No topbar search, Projects launch, Pricing, Sign In or Get Started button. A new branding decision must not spill into course titles or storage identities.

Hero: proposed heading “Machine learning finally makes sense.” Short body: “Explore the maths, connect it to Python, and see how models learn — one clear step at a time.” One dominant filled blue link, **Try a Free Lab**, goes directly to `/demo`. Supporting line: “Explore one linear neuron: inputs, weights, a prediction and one learning step.” A quiet My learning journey link serves returners; no competing filled CTA or video promise. Do not claim arbitrary neural-network execution.

Path: **Math Lab → Python Lab → Algorithm Lab → Project Studio**. An ordered list carries the sequence in text. Four light, restrained surfaces are the only repeated stage panels; no course/lab card gallery. Each stage has one icon, name, short explanation and text status. First three have a quiet destination link; Project Studio is noninteractive and has **Coming Soon** immediately beside its name and in its accessible text.

| Stage | Supporting copy | Link / status |
|---|---|---|
| Math Lab | Understand the ideas behind models. | `/math` · Available |
| Python Lab | Turn ideas into reliable code. | `/python` · Available |
| Algorithm Lab | See how models learn and compare them. | `/supervised` · Available curriculum |
| Project Studio | Bring your skills together in future guided projects. | Coming Soon · no launch link, date or access promise |

Subtle static glowing connectors indicate sequence without implying locked prerequisites or completion. Numbered stages and arrow/text alternatives retain meaning when decoration is absent. No pulsing, particle trails, moving backgrounds, autoplay or mandatory animation. Exploration remains optional and direct; no prerequisites become route locks.

Footer: concise “Practice and lesson completion are separate from independent mastery” and quiet Help / My learning journey links. Browser-local progress limitation belongs beside journey access or its existing evidence panel, not a sales banner. Keep existing accessibility limitations truthful; avoid an “accessible/certified” badge. No pricing, counts, testimonials, guaranteed outcomes, lifetime claim or unavailable projects.

## 4 Desktop and mobile layout

Desktop, 1024px and wider: centered content up to 1200px with 32–48px side gutters where space permits; compact 64–80px header; generous hero whitespace. Hero copy is left aligned with a comfortable 55–65-character measure. The full-width four-stage row follows it, allowing readable stage names and ample connector space. This deliberately separates the path from the sample’s crowded hero-side cards. CTA appears once with primary visual weight. Footer remains short.

Tablet and mobile, below 1024px: vertical numbered path; no 2×2 zigzag or forced horizontal carousel. At 320–430px use 16–24px gutters, 32–40px hero type, 16–18px body, full-width or comfortably sized primary CTA. The four stages follow the hero in the same DOM/reading order; connectors become a subtle vertical line. Coming Soon remains visible next to Project Studio without hover or expansion. Menu opens inline so it cannot obscure the CTA or trap focus.

Design starting points: light neutral background, dark navy body text, one blue action, blue/teal/purple/amber stage accents with labels. Use existing locally available/system fonts and assets; no dependency or remote-font addition. Body text never uses glow or low-opacity tint. Stage outlines, connectors and decorative icons may be low contrast because no essential information depends on them. Text and controls require measured contrast verification. Do not inherit light-on-light or dark-on-dark styling from unrelated lesson shells.

Proposed spacing rhythm 8px, hero-to-path gap 48–72px desktop / 32–48px mobile; stage padding 24px desktop / 20px mobile. These are reviewable layout targets, not fixed heights. Content can grow under browser zoom and text resizing. Design target for controls is at least 44×44 CSS px; local scrolling may remain for existing lesson code/tables, but landing has no document-level horizontal overflow.

## 5 Dashboard preservation and availability

Reusing `LearningJourney` at `/journey` preserves recommendations, optional starting modes, conceptual links, evidence disclosures, storage warnings, draft/remediation entry and existing legacy resources. Only catalog labels/destinations and demonstrably stale availability copy may change here. Do not alter `recommend`, `READ_KEYS`, parsing, codecs, timestamp ranking, storage writes or assessment controllers. Do not add new algorithm resume adapters merely to make the landing feel complete.

Use four visible dashboard stages with first-three order preserved, add MLP and Model Selection catalog links and remove the unscoped MLOps display from the core path. This is presentation metadata only: keep internal stage/progress identities and recommendation matching intact. Project Studio remains a nonselectable Coming Soon item; do not render an empty “implemented content” panel for it. Math/Python/Algorithm stage selection remains reversible browsing, with no award.

A short dashboard clarification must say that its saved-evidence summary covers supported existing scopes and that other module records remain in their own modules. Newly linked algorithm modules are available, but automatic resume/evidence aggregation for them is outside this tranche. Never call omitted scopes empty or unmastered. The [availability matrix](PHASE_2_1_AVAILABILITY_AND_REFERENCE_MAPPING.md) lists exact allowed corrections, including the introductory MLP versus full neural-network distinction.

## 6 Technical safeguards

Keep every existing learning URL and direct assessment route valid. Root changes presentation but must retain an obvious journey destination; preserve old hash intent as defined in the route ledger. Moving the dashboard within the same origin must not change keys or envelopes. Local progress is origin-specific: a preview on another port does not prove same-origin restoration. Snapshot raw test-storage bytes on one origin before and after landing/journey navigation using supported test fixtures; never use or reset actual learner records.

Landing is informational and must not read learner storage or score/award anything. The dashboard retains its existing read-only behavior. No hosted learner execution, final-test labels, accepted answers, sealed sidecars or protected assessment data enter landing assets/search metadata. No API or numerical-engine change. No lockfile/runtime upgrades, symlinked dependency workaround or application-configuration change for convenience.

Preserve Model Selection mastery enabled under 20/24 plus both components of six gates in one confirmed attempt, all other approved module policies, version isolation, previous mastery and no cross-attempt pooling. Practice/notebooks/experiments remain incapable of independently awarding mastery. No badge, connector or button may fabricate progress.

Keep existing skip-link intent, semantic navigation, disclosure close-on-link, one-open-menu behavior where shared, Escape/focus return and keyboard operability. New landing decoration is hidden from assistive technology; stage/status text remains real content. Presentation changes must not weaken existing module-local access or reset controls.

## 7 Acceptance and implementation gate

The [acceptance ledger](PHASE_2_1_ACCEPTANCE_RISKS_AND_DECISIONS.md) is required for the eventual implementation, not claimed as passed by this specification. Founder first reviews this route choice, image mapping, layout and bounded file list. After a separate implementation authorization, changes must pass contract preservation, route/hash compatibility, desktop/mobile/keyboard checks, complete regressions/build and exact-commit independent CI. No merge or deployment is included.

Genuine screen-reader, actual 200%/400% browser zoom, Colab and original-directory I/O remain platform-release obligations. A future verification report must distinguish scoped new reader/zoom results from comprehensive platform acceptance; 320px screenshots and local notebook kernels never substitute.

## 8 Review outcome

Approve or amend public `/` plus `/journey`, the retained working brand, direct `/demo` CTA, four-stage presentation and bounded component/file scope. Authentication, complete Free Labs, pricing, content redesign and new progress adapters remain deferred. Stop after this specification for founder review; no code has been implemented.
