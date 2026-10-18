# Task 015.12 — MS-E2 KNN fixture portability audit

## Pre-freeze status

Local audit passes for the bounded proposal below. Independent pre-freeze audit is
required before updating any reference. The V2 references are unchanged at this stage.
Mastery remains disabled. This report does not close accessibility, Colab, or I/O obligations.

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

Do not freeze until both independent pre-freeze jobs pass. Any new ambiguity or payload
drift requires a stop and report, not another fixture perturbation. After a pass, update
only MS-E2-related versions/references and dependent report/lock, review the complete
output diff, verify byte identity, run local regressions and the independent full workflow.

Sources: [StandardScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)
defines training mean and population variance; [Euclidean distances](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.euclidean_distances.html)
documents the norm/dot-product calculation and possible cancellation. The operational
envelope and safety factor above are this audit's explicit engineering criteria.
