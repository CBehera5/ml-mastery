# Landing page redesign specification

Proposed public landing for founder review. The current root is a learner dashboard; this specification requires the route decision in document 09 before implementation.

## Content and visual hierarchy

| Order | Content | Design and behavior |
|---|---|---|
| Header | ML Mastery working brand; Curriculum; Free Labs; Program; My journey | Compact, readable navigation; one primary “Try a free lab”; no nonfunctional sign-in/search |
| Hero | “Machine learning finally makes sense.” Body: “Explore the maths, connect it to Python, and see how models learn — one clear step at a time.” | Left-aligned concise text and one actual concept visual. Primary “Try a free lab”, quiet curriculum link. No autoplay, unsupported video or oversized decorative mountain |
| Journey | Math Lab → Python Lab → Algorithm Lab → Project Studio Coming Soon | Four succinct linked stages where available; one sentence each. Studio has informational status, no button suggesting access |
| Experience preview | A single meaningful “Change a weight. See a prediction move.” preview | Future approved reuse of existing bounded X-Ray controls, or a static accurate preview linking to `/demo`. Do not invent runnable Python or alter lab scoring |
| Free labs | Up to three curated previews with visible concept, outcome and existing destination | One featured card; other cards quiet. Recommended initial set: X-Ray `/demo`, Function Explorer via `/math/algebra-functions/variables`, Wrong-direction challenge `/challenges/wrong-direction`. Tree/threshold teaser requires later validation, not a promised new lab |
| Curriculum summary | Six Math subjects, six Python modules, available algorithm modules, with Explorer link | Verified inventory only. Avoid sample’s “6 lessons / 8 objectives” shorthand; counts have distinct meanings and must derive from reviewed catalog |
| Trust and expectations | Visual explanations, bounded practice, independent mastery, browser-local progress | Plain facts. Fictional examples; no mastery from completion, employer credential or guaranteed outcome claims |
| Program / footer | Available scope, Coming Soon limitations, help, accessibility information | Quiet program-information link until commercial decision. No $39/lifetime/discount/timer/checkout banner |

## Design tokens to validate

Use a light neutral canvas, dark navy text, and one blue primary action. Blue Math, teal Python, purple Algorithm and amber Studio may identify stages, paired with labels/icons. Tints are supporting surfaces, not low-contrast body text. Prefer a readable sans-serif with a single optional display treatment; avoid unexplained shifts from warm editorial hub to dark technical lesson. Review the existing brand name “ML Math Lab” versus sample “ML Mastery” before changing navigation titles.

Proposed layout: maximum content width about 1200px; body line length 60–75 characters; 8px spacing rhythm; 16–18px body; hero 40–56px desktop / 32–40px mobile; cards with subtle borders and restrained shadows. These are design starting points, not a dependency/font purchase or locked application configuration.

At 320–430px stack hero, visual, and four numbered stage items vertically. Keep the primary action visible without sticky overlays. Lab previews stack; no page-level horizontal scroll or forced carousel. Preserve local scrolling for wide technical tables/code. At desktop use a balanced hero and a four-stage row, leaving actual visual content sufficient space. Avoid many equally saturated buttons in the same viewport.

## Acceptance criteria for a later implementation

- Every available CTA resolves to the correct current route; Coming Soon cannot launch a studio or purchase unavailable scope.
- Public promise, free access and program details agree; no unsupported account, execution, numerical, project or commercial claims.
- Primary action remains identifiable on desktop/mobile and for keyboard users; descriptive link names and visible focus.
- Images/plots have useful textual equivalents; no information depends only on color or motion. Honor reduced motion. Native controls have labels and adequate touch targets (design target 44×44 CSS px).
- Validate text/control contrast, actual reader flow and genuine 200%/400% zoom; viewport emulation is separate evidence.
- Root/journey transition and legacy hash links preserve navigation intent and raw saved evidence; no access or mastery-policy changes.
- Founder reviews desktop/mobile static design and claim inventory before application work.

## Screen outlines

Desktop: compact header → short promise + one demonstration → four stages → one featured free lab → curriculum overview → expectations/footer.

Mobile: logo/menu → promise → primary action → concept preview → four-stage vertical list → featured free lab → curriculum/help. Avoid placing a sales banner between the learner and the first experiment.
