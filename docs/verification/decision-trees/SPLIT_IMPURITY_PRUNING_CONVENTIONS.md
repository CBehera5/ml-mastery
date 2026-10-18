# Decision Tree split,impurity and pruning conventions v1.0.0

17 October2026 · Authored before reference generation under founder experiment-freeze authorization. No application or mastery changes. Classification uses Gini only;regression uses squared_error. Entropy is contextual arithmetic only,no fitted variant or new assessment gate.

## Features,data and prediction tasks

Wholly fictional arrays and aligned training/development IDs are in each manifest. Regression features are floor_area_50m2 (area index in50m² units) and renovated_0_1;target is price in100000 fictional currency units. Classification features are support_contact_index and plan_flag_0_1;0=stays,1=churns positive. These are separate task/target definitions,not shared numerical-label loss semantics. Documentation quality is an application comparison,not another dataset collected here.

Base and changed-row fixtures differ in exactly one training target:regression row7 price12→8,classification row6 label0→1. Development rows/targets stay fixed and never fit or derive candidates. Edge fixtures expose identical-feature split ties,constant features/no eligible split and pure/constant targets. Pure classification contains only class1;its actual library class_order is[1],not an invented two-column proba result. Confusion metrics still explicitly name labels[0,1].

No sample weighting,class weighting,missing-value branch or monotonic constraint. Inputs are finite. The bounded UI exposes only reviewed complete tuple IDs;it does not accept arbitrary arrays,thresholds,depths,queries,criteria or seeds. Rejected provenance/empty-child states do not expose predictions. An ordinary no-split tree is valid and predicts its root mean/frequencies.

## Threshold generation,routing and ties

Manual educational candidates enumerate features in fixed index order;within each node,sort distinct float32 feature values and enumerate adjacent midpoints. Only splits with both children satisfying min_samples_leaf are legal. With these small integer/half-integer fixtures,midpoints are exact and well-separated;this is not a reimplementation of every sklearn threshold-epsilon/float32 degeneracy. Each learned split is independently checked to realize an exact maximal rational local gain among legal candidates.

Authored candidate controls feature0 thresholds2,4,6 and feature1 threshold.5 are separate **manual split replay**,not claims the fitted model chose them. A manual threshold2 and an eligible learned midpoint2.5 can induce the same training membership but route a new query differently;preserve their identities rather than replace one with the other.

Left membership uses feature≤threshold;right uses>. Fitted routing first converts features to float32 as the installed tree predictor does,then compares with exported double threshold. Root probes use immediately below,equal and immediately above **representable float32** threshold values;verify decision_path/apply and exact memberships,not rounded display. No numerical tolerance may create a routing tie or change membership. Exported leaf children=-1 and feature/threshold sentinels are structural metadata,not feature tests.

Equal-gain candidates are listed using exact Fraction arithmetic for these integer target/count fixtures. **Do not claim lexicographic educational candidate order is sklearn's split tie-break.** Freeze the actual chosen feature,threshold and topology under random_state1729,splitter='best',fixed feature/row order and pinned library. Feature permutation/tie search may select any equally best candidate;the reference verifies its optimality and repeatability,not a universal unique tree. Identical-feature edge states explicitly show both valid best candidates and the actual selected one.

## Regression errors and classification impurity

Unweighted regression leaf predicts arithmetic mean. SSE sums squared residuals;node squared_error impurity is MSE=SSE/n. Local gain=MSE_parent−(n_left/n_parent)MSE_left−(n_right/n_parent)MSE_right=ΔSSE/n_parent. Do not weight already summed child SSEs again. Parent/child summaries store counts,means,SSE and impurity. Development MSE/MAE are independently checked against sklearn metrics. No R² is exposed;no library force-finite constant-target R² is silently treated as mathematical truth. A regression tree routes beyond the observed feature range into a fixed leaf;it does not continue a learned linear trend beyond leaf outputs.

Classification p_c=count_c/n;Gini=1−sum(p_c²). Weighted child Gini uses child sample fractions;local improvement subtracts it from parent Gini. Leaf class output is the maximum frequency class;ties select the first/smallest actual class label,verified against classes_/predict. Leaf probability vectors are empirical frequencies in the recorded actual class_order,not regression averages or guaranteed calibrated risks. Pure or tiny leaves do not certify future probabilities.

Manual leaf summaries are separately checked by fitting a no-split reference estimator to each child target subset;ordinary fitted nodes' impurities and values are checked against exact count/SSE arithmetic. For these unweighted trees,weighted_n_node_samples=n_node_samples. Globally weighted node decrease=(n_node/n_total)*local_gain;min_impurity_decrease parameters use the global convention,not an unqualified local gain.

Feature importance is independently reconstructed from the retained tree's sample-weighted node decreases and normalized across features (all zeros for a no-split tree). It is training impurity reduction,not causal importance or out-of-sample permutation evidence. Duplicate/correlated predictors can share or redirect it. Do not implement a forest/permutation course as part of this freeze.

Classification confusion counts use actual rows,predicted columns,labels[0,1]. Accuracy is correct/N. Precision TP/(TP+FP) and recall TP/(TP+FN) have tagged undefined denominators,not automatic numeric0. Class order in a one-class estimator is preserved honestly. No new probability threshold/log-loss convention is introduced.

## Deterministic estimator and complexity settings

Every fitted state stores a full explicit parameter dictionary:criterion='squared_error' or'gini',splitter='best',random_state1729,min_samples_split2,min_weight_fraction_leaf0,max_features=None,max_leaf_nodes=None,min_impurity_decrease0,monotonic_cst=None;classification class_weight=None. Fit sample_weight=None. max_depth1/2/3 with min_samples_leaf1/2 and ccp_alpha0 are finite presets. A separate full-tree baseline uses max_depth=None,min_samples_leaf1,ccp_alpha0. Edge fits use depth1,leaf1,alpha0. None here is an invitation to an unrestricted UI control.

For each base/changed fixture,derive cost_complexity_pruning_path on **training only** with the full-tree baseline. Freeze all returned ccp_alphas and normalized weighted leaf risks. Expose its distinct positive alpha candidates as exact tuple IDs plus the full alpha0 state;do not derive candidates from development/test outcomes. For every pruned fit,check actual retained topology,leaf membership,paths,outputs and summed sample-weighted leaf impurity against the path risk at that alpha. The cost-complexity objective is normalized training leaf risk+alpha*number_of_leaves;sklearn weakest-link selection/equality behavior is frozen through actual outputs,not hand-rounded alpha thresholds. No held-out-selected candidate path and no claim positive alpha always improves generalization.

Development comparisons explain selection reasoning only;there is no final-test fitting or selection. A diagnostic explicitly rejects final-test-driven pruning;another rejects target-ID misalignment. A candidate at threshold100 yields an empty child and is rejected,not a computed empty mean/proportion. Invalid max_depth0 is separately library-probed. Invalid min-leaf/criterion/seed tuples and nonfinite inputs are outside the legal configuration set;the UI must reject unknown IDs rather than fall back to defaults.

## Contextual entropy and precision

Entropy H=−sum(p_c log2 p_c),with0 log2(0)=0. Balanced binary H1 bit versus Gini.5;pure H0 and Gini0. Numeric scales differ and neither automatically guarantees a better held-out split. This bounded comparison is independently calculated in the parity report,not an entropy-trained tree or new scored gate. No entropy/log_loss estimator criterion is exposed.

Reference comparison abs1e-9+rel1e-9;display six significant digits is approximate,not the membership/threshold oracle. Counts,IDs,labels,paths,topology and exact rational gain ties are exact. Canonical JSON forbids NaN/Infinity. Rejections/undefined metrics are explicit tags. Read-only fitted assets are separate from answer envelopes;largest base matrix8×2,tree at most15 nodes,ordinary plotted rows/probes within the existing64-item scene budget. No dense decision mesh. Candidate tables at most eight rows per node on these fixtures;no resource expansion.

## Interaction,accessibility and regeneration

Ask for a bounded predicted membership/leaf-output category or accepted/rejected claim and mechanism before reveal. Show selected controls/inputs before asking,then tree/path text and numerical row-membership/error/impurity alternatives. Require a changed finite configuration and supported transfer explanation;wrong initial predictions can recover. Do not award mastery from replay/reset. Native keyboard controls,visible focus,reduced motion and320px reflow are implementation obligations,not offline checks performed here.

Accepted existing environment:CPython3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1;actual platform recorded in report. No packages installed. From repository root:

```
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python work/freeze-task-015-7.py --freeze
OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1 python work/freeze-task-015-7.py --check
```

Generation computes and checks every exposed state before writing. --check recomputes manual/sklearn tree,path,split,importance,metric and pruning checks and requires byte-identical canonical outputs,source/convention/output hashes. No cross-platform/version bitwise guarantee. Genuine screen-reader,browser zoom,Colab and original-directory I/O remain open. No application,notebook,learner evidence or mastery implementation by this checkpoint.
