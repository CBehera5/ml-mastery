# Task 015.12 — MS-E2 KNN fixture portability audit

## Pre-freeze status

**Stop for founder review; no reference freeze performed.** The proposed KNN geometry
passes locally and in independent macOS ARM64 and Linux x86-64 audits. macOS also
passes exact payload parity. Linux exposes broader floating-point reference differences,
including MS-E1, which cannot be repaired or accepted by changing numerical policy
within this authorization. The V2 references, production generator, existing KNN
teaching contract, learner evidence and mastery settings remain unchanged.
This report does not close accessibility, Colab, or I/O obligations.

## Complete coverage and confirmed failure

`work/audit-ms-e2-portability.py` audits 972 unique prediction/configuration records:
all nine KNN candidate states (k=1/3/5, thresholds .25/.50/.75), three full-development
GroupKFold partitions, and all six nested GroupKFold inner partitions. The development
partitions also cover outer-validation geometry. Instrumenting the real generator
confirms all 1,044 live KNN prediction visits, including repeated seeded-search fits,
are represented. No currently selected outer/final refit is an unaudited KNN fit.

Each record contains query ID, complete training and validation membership/groups,
candidate/threshold/k, every neighbor ID/label, full binary64 distance and its 17-digit
representation, kth/next distances, cutoff separation, opposite-label exchange margin,
exact and near ambiguity flags, possible positive counts/predictions, and reversed-row
prediction. Four complete rankings are recorded, not just the previously failing query.

V2 fails six candidate/query records: `E2-02-02` in development fold 1 and `E2-04-02`
in development fold 2, each at k=3 and all three thresholds. Only threshold .25 can
change prediction. The first exchanges `E2-00-02` (1) and `E2-04-02` (0); the second
exchanges `E2-02-02` (0) and `E2-06-02` (1). Exact float64 equality can vary between
calculations/environments; both geometries are numerically ambiguous. This explains
why changing the unrelated `E2-00-00` scaler contribution did not provide portability.

## Bounded fixture proposal

Restore `E2-00-00.monthly_charge`: 40.000001 → 40.0.
Change `E2-00-02.monthly_charge`: 44.0 → 44.001.
Change `E2-06-02.monthly_charge`: 74.0 → 74.001.

These are two equal 0.001-unit offsets to the event-2 observations of G00 and G06
that participate in the two mixed-label symmetries. This is a single declared
symmetry-breaking correction, not an iterative per-environment jitter scheme.
It adds no features, targets, groups, partitions, algorithms or tuning parameters.
Labels and the duplicate support-call proxy are preserved. Sealed groups G09–G11
are unchanged. Version V3 is reserved for the subsequent accepted freeze.

## Portable safety policy (fixture acceptance only)

The existing KNN module and MS-E2 exact equality guard retain tolerance **0.0**.
No runtime nearest-neighbor membership rule, class-vote convention or mastery contract
is changed. The new tolerance is a stricter admission test for this fictional fixture.

For each training-only StandardScaler fit and query, define epsilon as binary64 machine
epsilon, S=max(1, ||query_scaled||² + max ||train_scaled||²), and d as the high-precision
kth distance. The absolute distance audit envelope is

`T = max(1e-12, 4096 * epsilon * S / max(2*d, sqrt(epsilon)))`.

The squared-distance scale reflects the norm/dot-product arithmetic and its cancellation;
division by 2d converts a conservative squared-distance envelope to distance units.
4096 is an explicit conservative engineering allowance for this small five-feature,
at-most-24-training-row fixture, including scaling reductions. This is not a universal
formal error bound for arbitrary BLAS implementations or datasets. Comparisons with
independent arithmetic and independent CI are mandatory evidence, not optional substitutes.

Exact equality means equal returned float64 distances. Near equality means a cutoff
cluster within T. A mixed-label cutoff permits different positive-neighbor counts when
only some of that cluster fits inside k. A class-vote tie is equal class counts after
membership is fixed; authored k values are odd, so there are none here. Threshold .50
or .75 can mask a membership ambiguity; it still fails fixture acceptance.

Require more than **100*T** between every selected/excluded pair with opposite labels;
require all four methods and reversed training order to produce identical positive
neighbor counts and threshold predictions. Same-label cutoff exchanges may have zero
distance gap because uniform weights make them semantically identical; the margin to
the next relevant opposite-label exchange must still pass. Stable sorting is used only
to display complete rankings; it never chooses a winner in a mixed-label ambiguity.

## Trusted calculations and local evidence

Compare the fitted model's own `kneighbors` output against direct NumPy subtraction,
Python `math.fsum` of squared coordinate differences, and a separate Decimal calculation
at 70 decimal digits. Decimal starts from exact binary64 input values, independently
recomputes fold-only population variance, and evaluates sum((query-train)²/variance).
It does not reuse fitted scaler statistics. All distance errors must lie within T.

Local approved CPython 3.13.16/profile on macOS ARM64: proposal passes all 972 records.
Maximum distance error versus Decimal: 3.4416913763379853e-15. Minimum relevant
opposite-label separation/T: 8,634,219.687488435 (required >100). Decision digest:
`b422836c222a9be57c30ebd18b0199ce3db2e025cb33bec818d95e7748bc2034`.
The complete audit is emitted as `neighbor-rankings.json`; the summary includes actual
platform, library threadpool details, margins and payload hashes.

The audit workflow runs the same approved versions on macOS ARM64 and supplemental
Linux x86-64. Each must match the local decision digest and exact proposed payload
hashes (excluding platform-bearing parity metadata). No frozen files are written.

### Independent results — 18 October 2026

Initial audit source `fd0fd4f06df207380bc5ea924e2e3e43881ebeed`:
[run 39118352067](https://github.com/CBehera5/ml-mastery/actions/runs/39118352067).
macOS passed; Linux failed exact MS-E1 preservation. The first audit version stopped
at that assertion before saving its remaining evidence. The diagnostic correction
preserves all outputs on failure without changing the fixture, criterion or arithmetic.

Diagnostic source `18e01b7308f46b492970a90d95c24943baf21f23`:
[run 39118535718](https://github.com/CBehera5/ml-mastery/actions/runs/39118535718).

| Environment | KNN audit | Max distance error vs Decimal | Minimum relevant margin/T | Exact payload gate |
| --- | --- | --- | --- | --- |
| Local macOS 15.6.1 ARM64 | 972/972 pass | 3.4416913763379853e-15 | 8,634,219.687488435 | pass |
| CI macOS 15.7.9 ARM64 | 972/972 pass | 2.942091015256665e-15 | 8,634,219.687488435 | pass |
| CI Linux x86-64, glibc 2.39 | 972/972 pass | 2.0539125955565396e-15 | 8,634,219.687488435 | fail |

All three match the decision digest above, covering neighbor label counts and all
threshold predictions. All reverse-training-order predictions match. Each environment
also generates byte-identical outputs across its own two runs. The two sealed sidecars
are byte-identical across all three environments. No new KNN ambiguity was found.

The Linux exact-reference failure is **not** a KNN membership failure:

- MS-E1 manifest: 129 changed floating-point leaves; no changed non-float leaves.
  Maximum difference 2.514943808762382e-11 occurs at
  `/configurations/16/validation/probabilitiesClassOrder01/0/0`:
  0.9831208833582145 (ARM64) vs 0.983120883333065 (Linux x86-64).
  Of 22 changed metric leaves, the largest is validation log loss
  0.005417330075703408 vs 0.005417330083438947, delta
  7.735539639397437e-12, greater than the existing 1e-12 metric tolerance.
- Proposed MS-E2 manifest: 36 changed floating-point probability leaves; no changed
  predictions, selections, candidate costs, aggregate metrics or non-float leaves.
  Maximum difference 1.7138808150463092e-09 occurs at
  `/configurations/0/expected/outerFolds/2/outerValidation/positiveProbabilities/6`:
  0.3963621045947631 vs 0.39636210630864394.
- Both MS-E1 and MS-E2 sealed sidecars, as well as the scope checksum, match exactly.
  Every frozen repository file hash is unchanged before/after each audit.

The evidence package contains complete rankings for both CI environments, original
summary files, in-memory payloads and `cross-environment-impact.json` with every
local-versus-CI changed leaf. These differences are observed outputs; the audit does
not establish a particular BLAS instruction or solver stopping path as their cause.

Local full Python regression: **2,612 passed in 25.38s**. This includes three new
portability tests: detecting both V2 fragile cutoffs, exhaustive proposed-fixture
portability, and distinguishing exact/near/mixed-label cutoff behavior. Frontend,
notebook and full post-freeze CI were not rerun because the pre-freeze gate did not
pass and no production fixture/reference was changed.

## Reference-output impact before versioning

Two in-memory regenerations are byte-identical. Compared with the existing V2 manifest,
the proposal changes 65 leaves: three fixture charges, 31 nested outer-fit preprocessing
or full-precision probability leaves, 27 threshold OOF probability leaves and four
threshold-fit preprocessing leaves. The machine-readable `reference-impact.json` lists
every before/after value. No model choice, threshold choice, discrete prediction,
confusion matrix, aggregate metric, candidate score, or permutation result changes
relative to the committed V2 reference in the local environment.

Both MS-E1 payloads and the complete MS-E2 sealed sidecar remain byte-identical.
All public fixture target rows are development-only; sealed feature rows contain no
target field. The API leakage regression remains a separate full-regression gate.
The audit asserts the frozen-directory file hashes are unchanged before and after.

## Re-freeze readiness

**Not ready for an unrestricted cross-platform re-freeze.** KNN fixture redesign itself
passes on every audited environment. No further fixture perturbation is recommended.
The supported macOS ARM64 profile reproduces the complete proposed outputs exactly,
but the supplemental Linux profile does not reproduce the existing MS-E1 numerical
contract or exact MS-E2 logistic probabilities. Accepting those differences would
require an explicit numerical portability policy or supported-platform decision.

Stop for founder review rather than widening tolerance, rounding outputs, changing
MS-E1, or treating the failing job as passed. The review decision is whether reference
freeze support remains limited to the verified macOS ARM64 environment or whether
cross-platform numerical acceptance is to be separately authorized and specified.
No such decision has been inferred here.

After the approved gate passes, update only MS-E2-related versions/references and the
dependent report/lock, review the complete output diff, verify byte identity, run local
frontend/Python regressions and the independent full workflow including notebook checks.
The 20/24 threshold, six paired gates and `MASTERY_AVAILABLE=false` remain unchanged.

Sources: [StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)
defines training mean and population variance; [Euclidean distances](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.euclidean_distances.html)
documents the norm/dot-product calculation and possible cancellation. The operational
envelope and safety factor above are this audit's explicit engineering criteria.
