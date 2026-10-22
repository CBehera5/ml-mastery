# Phase 2.1 acceptance closure — 19 October 2026

## Decision

**Native zoom verification PASS for public `/` and `/journey` at 200% and 400%.** Recommend bounded Phase 2.1 acceptance when final exact-commit CI is successful. Founder review remains required. This does not certify the whole curriculum or close the screen-reader, Colab or original-directory I/O obligations.

Application implementation remains `30557d6e4ea52e698fb820f7ea0f8447a8651b2d`. Native preview was built from clean `91548ac1bb6808d6e4d50ad122cdff8531577fae`, whose only changes after the implementation are documentation. No application defect requiring a fix was confirmed; this closure changes documentation only. Accepted Discovery Tour design `18b5835`, Task 015 implementation, mathematical references, mastery/progress semantics, unrestricted free access, informational $39 one-time model and Project Studio — Coming Soon are preserved. No merge, deployment or Discovery Tour work.

## Genuine zoom method and environment

macOS 15.6.1 (24G90), Google Chrome 155.0.8059.80 (Official Build, arm64), native macOS application control. Production Next.js preview at `http://127.0.0.1:3042`; conventional offline lockfile installation and production build. Native Chrome toolbar zoom popup controls, not CSS zoom, device emulation, screenshot scaling or viewport substitution, set 200% and 400%. Live inner popup label and subsequent main toolbar were checked; popup window title sometimes retained an old percentage, so the live label is authoritative.

Native window/page frame measured `outerWidth=1440`, `outerHeight=778`; physical content captures are 2880×1556 JPEG. Undocked read-only DevTools measured actual CSS viewport and document scroll width without narrowing the page. Device toolbar was OFF; root/body computed CSS zoom `1`, visual viewport scale `1`. Native zoom raised devicePixelRatio to 4 at 200% and 8 at 400%. DevTools original dock-right layout restored and created verification tabs closed. Chrome loopback zoom returned to initially observed 50%; Safari loopback site setting verified 100% before closing its test tab.

Safari 18.6 was explored initially, but its native popup offered a maximum 300%, so it is ancillary evidence only and is not used for the four PASS decisions. An initial Chrome native-control timeout and later stale AX/blank capture were recovered with a fresh tab. Invalid earlier captures/traversals are retained under diagnostics and excluded from acceptance evidence. They were not established as application defects. Chrome extension warnings were visible; this was the existing browser profile, not an extension-free certification.

## Scenario ledger

| Scenario | CSS viewport / document scroll width | Result and observations | Evidence prefix |
|---|---|---|---|
| `/`, 200% | 720×389 / 720 | PASS. Menu opens with keyboard; skip link reaches content; primary/free, journey, three available stages, legacy utilities and footer links remain keyboard reachable with visible focus. Text reflows and all sections remain vertically reachable without page-level horizontal scrolling or content loss. | `chrome-landing-200-*`, `chrome-200-control.*` |
| `/journey`, 200% | 720×389 / 720 | PASS. Skip→Start Learning works; all 24 following default-state controls traverse in order; navigation and notebook disclosures operate; focus is visible; stage/status text wraps without horizontal overflow. | `chrome-journey-200-valid-*`, `chrome-journey-200-start-focus-valid.jpg`, `chrome-journey-200-nav.*`, `chrome-journey-200-metrics.txt` |
| `/`, 400% | 360×194 / 360 | PASS. Native menu opens via Space; learning-stages anchor activates via Enter; links traverse to footer, then Journey activates via keyboard. CTA, stage copy, informational price and utilities reflow; no page-level horizontal overflow, lost text or unavailable action observed. | `chrome-400-control.*`, `chrome-landing-400-*` |
| `/journey`, 400% | 360×194 / 360 | PASS. Skip→Start Learning and 24 following default-state controls traverse with visible focus; Browse opens by Space and Public home activates by Enter; Python and Algorithm stages switch, including keyboard Space activation; notebook disclosure expands. Text remains available by vertical scrolling, without horizontal page scrolling or clipped fixed-height content. | `chrome-journey-400-*` |

A short viewport at 400% requires substantial vertical scrolling; screenshots capture portions of long sections, not full-page clipping. Native focus scrolling made each tested action reachable. Screenshots and AX focus logs are complementary: AX does not prove spoken screen-reader behavior. Public-route scope here means the new landing and preserved journey; it is not an assertion that every existing lesson, experiment or catalog route passed native zoom.

## Navigation and acceptance disposition

A01–A09 and A13–A15 retain the provisionally accepted implementation evidence; fresh CI will recheck the final documentation commit. A10 keyboard portion PASS in these scoped native zoom scenarios; actual screen-reader remains OPEN. A11 retains the independent five-width 320/390/768/1280/1440px evidence and gains native zoom reflow evidence. A12 required 200%/400% zoom portion PASS above; previously measured contrast remains unchanged. A16 founder review PENDING, with no promotion action.

The historical A13 exclusion of pricing was superseded by the founder's explicit informational $39 one-time authorization. No purchase/auth/entitlement behavior exists. The journey's conservative public footer still says screen-reader/browser-zoom verification is outstanding; it was not rewritten during this verification-only closure and is not the authoritative scoped acceptance register.

## Verification register

| Obligation | Status | Evidence / next action |
|---|---|---|
| Genuine browser zoom, Phase 2.1 `/` and `/journey`, 200%/400% | PASS | Four scenarios above; native controls, dimensions, screenshots and keyboard logs |
| Genuine screen-reader speech/navigation | OPEN | No VoiceOver/NVDA speech session performed. Independently verify landmarks, menus, focus, status/error announcements and reading order. AX trees are not a pass. |
| Genuine Google Colab | OPEN | Local/CI kernels do not verify hosted Colab. Independently execute intended notebooks in Colab and record environment/results. |
| Original-directory I/O reliability | OPEN | Isolated `/private/tmp` production build and tests do not prove original FileProvider directory reliability. Investigate independently with repeatable original-path reads/builds and system metrics. |
| Platform-wide zoom/browser matrix | OPEN outside this bounded closure | Existing courses and other browsers are not universally certified by two public routes in Chrome. |
| Founder Phase 2.1 acceptance | PENDING REVIEW | Conditional functional acceptance is preserved; founder decides full bounded acceptance after this evidence. |

## Automated verification

Prior independent implementation CI [39232544289](https://github.com/CBehera5/ml-mastery/actions/runs/39232544289) was re-read and confirmed successful on exact `30557d6`: all four jobs. Fresh final-commit CI and local command results are recorded in the accompanying final verification result. No failed or unavailable check is converted to PASS.

Stop for founder review. Discovery Tour remains unauthorized.
