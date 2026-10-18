# Private beta release checklist

## Before packaging

- [ ] Python and TypeScript mathematical regression suites pass.
- [ ] Frontend interaction, beta-flow, challenge, accessibility, and analytics tests pass.
- [ ] Type checking and production build pass.
- [ ] `/beta`, `/demo`, `/challenges/wrong-direction`, and `/beta/feedback` load directly.
- [ ] Mobile and keyboard walkthrough from `BETA_TEST_PLAN.md` is complete.
- [ ] Reduced-motion and invalid-input behavior are verified.
- [ ] Built assets and source are scanned for credentials, tokens, and private endpoints.

## Feedback configuration

- [ ] `NEXT_PUBLIC_BETA_FEEDBACK_FORM_URL` points to an approved HTTPS endpoint.
- [ ] The provider does not require sign-in or automatically collect email addresses.
- [ ] A test submission arrives with all seven expected answers.
- [ ] The privacy and retention settings match the controlled 5–8 person beta.

## Release and facilitation

- [ ] Use a private preview URL with access limited to approved testers.
- [ ] Start testers at `/beta`; do not send separate deep links unless diagnosing a route issue.
- [ ] Tell testers the complete $39 kit is proposed and unfinished, not available for purchase.
- [ ] Do not enable payment, authentication, or public deployment.
- [ ] Record session observations without names or unnecessary personal details.
- [ ] Obtain explicit approval before deployment or tester invitations.


## Linear Regression reference gate — Task 011.6

- [x] Fresh production-browser nine-route functional journey, assessment failure/success/remediation/retry and local persistence.
- [x] All nine 320px layouts and keyboard traversal, skip link, targeted focus/contrast fixes and accessible table scrolling.
- [x] 184 frontend/TypeScript-runtime tests, 62 Python tests, type checking, production build and both notebooks' sequential code execution.
- [ ] Real screen-reader speech, genuine 200%/400% browser zoom, text spacing, full contrast/target-size/device/motion acceptance.
- [ ] Remaining native project-download checks and editorial terminology disposition.
- [ ] Founder reference sign-off; module remains implemented, not fully verified.

Use `LINEAR_REGRESSION_ACCEPTANCE_MATRIX.md` and `RELEASE_ACCESSIBILITY_QA_BLOCKERS.md` for current evidence and remediation ownership. Historical checklist sections are not blanket release approval. Do not deploy or start Task 012 automatically.
