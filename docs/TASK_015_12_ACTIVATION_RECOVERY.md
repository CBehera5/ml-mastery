# Task 015.12 activation verification recovery

Activation commit: `4a2bbf48c0e83c0e97d5ec14d8f8be5113896a8b`.
Independent run: https://github.com/CBehera5/ml-mastery/actions/runs/39154246996

## Corrected verification environment

Started from clean rollback `575dc9e8884901a348c61e314cb2943f91708729`, with mastery disabled. A fresh local Git clone at `/private/tmp/task01512-recovery-20261018` received conventional `npm ci` from the unchanged approved lockfile. Exit 0: 138 packages installed, zero vulnerabilities. Node 20.19.4, npm 10.8.2. `node_modules` is a directory, not a symlink. No dependency or application configuration changes.

Before enabling mastery, `npm run build` completed with exit 0. Full output: `baseline-build.log`; installation output: `npm-ci.log`. The activated build also completed with exit 0. This resolves the prior unsupported symlink setup failure without changing Next.js configuration.

## Local acceptance evidence

- Frontend: 97 files / 2,845 tests passed.
- Math runtime: 12 files / 66 tests passed.
- Full Python: 2,612 tests passed, approved Python 3.13.16 numerical environment.
- Typecheck and activated production build: exit 0.
- Frozen generation: 20 MS-E1 and 11 MS-E2 states regenerate byte-identically; locked hashes unchanged.
- KNN audit: all 972 cases pass approved expectations.
- Two fresh notebook kernels: PASS, output SHA-256 `134e21b507492443d6e5a4c577e6ef4ae9deff697d1d11adb12134490b195e63`.
- Production Chromium: navigation, both experiments, sealed-target boundary, persistence/restoration, Tab focus, 320px layout, and zero browser errors.
- Activated browser flow: unconfirmed blocked; blank form A fails; confirmed form B 20/24 passes; later blank form C fails and preserves B mastery. Practice, labs and notebook access never award mastery.
- Fresh headed native selector: keyboard opened MS-E1 popup, changed the selected configuration, and selection survived page reload. This is not a screen-reader test.

## Mastery boundaries and preservation

All three forms verify 19/24 fails and 20/24 passes with every paired gate correct. All 36 critical-component failures (3 forms × 6 gates × 2 components) block mastery even at 23/24. Tests cover review and explicit confirmation, idempotence, retries, remediation, fresh attempt identities, no pooling of complementary failed attempts, restoration, version isolation, unsupported storage bytes, and preservation of previously earned mastery.

The only production behavior change is `MASTERY_AVAILABLE=true` for Model Selection. Authored objectives, evaluator/model, persistence versions and contracts, all frozen numerical files, and lockfile remain byte-identical to rollback. Existing learner profiles were neither read nor written: tests use mocked storage and disposable test browser contexts. No evidence migration is introduced.

## Release obligations and boundaries

Genuine screen-reader, browser zoom, Colab and original-directory I/O reliability remain platform-release obligations. No deployment, external learner testing, landing page, Project Studio/capstone, numerical-policy expansion, unrelated mastery change, merge or promotion occurred.

## Independent verification and recommendation

The independent workflow completed **successfully**, with all four jobs complete and successful against the exact activation SHA above:

1. Frontend tests, typecheck and production build.
2. Canonical macOS ARM64 KNN ranking audit.
3. Python regressions, frozen references and fresh notebook kernels.
4. Production preview, experiments, keyboard focus, persistence and 320px browser checks.

The earlier canonical CI is not used as activation proof. Full job metadata and four artifact sets are retained with this report. No mandatory Task 015.12 activation acceptance gate remains blocked. Mastery remains enabled on the reviewed branch; no merge or deployment has occurred.

**Recommendation:** Task 015.12 is ready for formal founder closure review. The separate platform-release obligations above remain open. Stop here for founder review.
