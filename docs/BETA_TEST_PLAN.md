# Private beta test plan

## Audience and session

Recruit 5–8 developers with a mix of no ML experience, tutorial-level experience, and production exposure. Schedule 25 minutes: 15–20 minutes unassisted use followed by up to 5 minutes for feedback. Start every participant at `/beta` and do not explain the mathematics unless they cannot proceed.

## Core scenario

1. Open `/beta` directly and describe the expected experience in the participant's own words.
2. Start the Neural Network X-Ray and complete all five action-validated steps.
3. Follow the completion link to the wrong-direction debugging challenge.
4. Run the broken update, select an operator, validate the fix, and explain why the corrected loss changes.
5. Open and submit the structured feedback form.

## QA matrix

- Direct access: `/beta`, `/demo`, `/challenges/wrong-direction`, and `/beta/feedback` render independently.
- Navigation: every beta navigation link works; completion links lead to the next intended stage.
- Mathematics: Python, TypeScript, fixture parity, and UI regressions pass unchanged.
- Invalid input: blank, nonfinite, and invalid learning-rate drafts hide stale results and show an accessible error.
- Keyboard: all links, fields, SVG connections, tabs, radio choices, and buttons can be reached and operated without a pointer.
- Mobile: verify at 375 × 812 and 768 × 1024 with no horizontal page overflow or hidden actions.
- Reduced motion: with `prefers-reduced-motion: reduce`, transitions and animations are effectively disabled.
- Privacy: feedback requests no name, email, employer, or confidential content; analytics contains only event, time, and route.
- Secrets: production output and tracked source contain no credentials, tokens, private URLs, or server-only environment values.
- Build: a clean production build completes and all routes are statically generated.

## Exit criteria

All core-scenario steps are possible without developer help, no severity-one or severity-two defect remains, mathematical regressions pass, and the feedback destination is configured and tested before inviting participants.

