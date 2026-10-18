# KN distance, tie and scaling conventions v1.0.0

These conventions are proposed here before reference generation under the founder's fixture-freeze authorization. They do not change objective or mastery policies. Euclidean classification only; no regression implementation.

- Float64 Euclidean distance: sqrt(sum_j((training_j-query_j)^2)). No squared-distance votes. Exact class labels [0,1]; 1=churns,0=stays. Fictional development outcomes are inspection labels, never training rows. No threshold adjustment; classifier uses maximum class vote, not an imported probability threshold.
- Educational distance tables sort by (computed distance, immutable training-row ordinal). This is a presentation convention, **not a claim that sklearn orders tied neighbors identically**. Freeze sklearn's actual neighbor order separately. All prediction states have unambiguous kth membership; tied neighbors are fully included. Reject a tied cutoff rather than invent a label. A counterexample explicitly probes sklearn's training-order sensitivity at k1 on an equidistant query. The rejected cutoff diagnostic has no class prediction.
- Exact equal computed distances are ties; near-equal distances remain ordered without an epsilon band. Tolerance is for parity comparisons, never changing membership. Float64 arithmetic is the reference, not arbitrary-precision geometry. Frozen examples avoid numerically unstable near-cutoff membership. Near-distance probe uses 1 versus1+1e-7.
- Uniform votes weight each selected row1. Distance votes weight1/d unless any selected distance is exactly0; then only zero-distance rows receive weight1, all other selected rows0. Duplicate rows remain distinct observations. Conflicting zero-distance labels can tie. A class-total tie chooses smallest class label0, matching the verified local classifier. Nonzero near-duplicates do not trigger the zero rule. Fractions are vote shares, not calibrated probabilities.
- Legal configurations are the exact authored list: clean/noisy k1,3,5; duplicate dataset k3,5; full two-row tie k2; unit/dimension cases k1,3,5. Generic k must be an integer1..n and no greater than **each fold-training** count; no clipping, bools or coercion. Unsupported combinations reject before calculation, including ambiguous kth-cutoff ties. k2 is an explicit tie probe, not a newly unrestricted control.
- Raw units are documented per dataset. Scaled mode is StandardScaler: training-only mean and population variance (ddof0), subtract mean and divide scale; zero variance uses scale1. Never refit on the query/development/test. New folds refit their own scaler; the fold-k diagnostic has four available training rows and rejects k5. No CV scores or fitted CV results are claimed by these experiments.
- Raw versus scaled and base versus extra irrelevant dimension are separate comparisons. Extra dimension changes the metric, not proof of universal degradation. Constant dimensions contribute zero difference when constant in both training/query. Work counts describe exhaustive brute-force manual distance evaluations (n) and coordinate differences (n*d), not measured timings or guarantees about optimized sklearn internals.
- Reference KNeighborsClassifier: algorithm='brute',metric='euclidean',weights as listed,n_jobs=1,immutable float64 rows and label order. No model optimization, random fitting or convergence criterion applies. StandardScaler and classifier are trusted offline references, not learner-code execution.
- Exact IDs, labels, membership sets, order under the educational convention and rejection tags require exact matching. Float outputs use abs1e-9+rel1e-9; display six decimals, retain full frozen precision. Do not grade from rounded displays. API undefined/missing/rejected states are tags, never numeric0. No log-loss/endpoints are introduced in this module.
- Every state requires prediction-before-reveal: choose class/rejection plus bounded reason; reveal distance/label/weight table and textual explanation; change one legal setting and answer a changed transfer question. A wrong initial prediction can recover. No experiment completion awards mastery.

## Regeneration and environment

From repository root, use the existing accepted environment (no installation):

```
python work/freeze-task-015-5.py --freeze
python work/freeze-task-015-5.py --check
```

CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1. Exact platform recorded in parity report. JSON sorted/indented, finite-only; source,convention and output SHA256 frozen in lock. Repeat --check recomputes references and compares all bytes; platform-specific report bytes are not a cross-platform reproducibility guarantee. Changes require explicit fixture version/reference review, not rewriting approved expectations during application work.
