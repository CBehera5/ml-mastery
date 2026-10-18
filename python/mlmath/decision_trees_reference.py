"""Trusted authored tree exercises; never evaluates learner programs."""
import numpy as np
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor


def case(lesson, objective, variant):
    shift = variant + 1
    expected = "supported"
    kind = "choice"
    options = []
    if (lesson, objective) == (1, 1):
        query = [1, 3, 4, 6, 2][variant]
        prompt = f"A saved house tree routes area<=2 to leaf price3, otherwise area<=5 to price7, otherwise price9 (100000 currency units). Predict for area{query}."
        expected = 3 if query <= 2 else 7 if query <= 5 else 9
        kind = "number"
        explanation = "Follow every condition along the saved path; the query does not refit thresholds. Equality goes left."
    elif (lesson, objective) == (1, 2):
        scenario = ["an unseen house without a sale label", "an unseen customer without a churn label", "a new document before review", "a held-out development house", "a future customer"][variant]
        prompt = f"For {scenario}, which operation is inference rather than fitting?"
        options = ["Route available features through saved thresholds without query labels", "Rebuild thresholds using the query outcome", "Choose new thresholds until the query label matches"]
        explanation = "Training learns splits from permitted training features and targets. Prediction routes an unseen feature row through saved splits; it needs no outcome label."
    elif (lesson, objective) == (1, 3):
        threshold = shift + 1
        prompt = f"A two-feature tree splits area<={threshold}, then age<=10. What regions does this describe?"
        options = ["Axis-aligned regions; each path is a conjunction of feature conditions", "A sloping linear-regression surface within every leaf", "A causal partition unaffected by the training sample"]
        explanation = "One-feature thresholds cut parallel to coordinate axes; recursive intersections form rectangles in two dimensions. A leaf predicts a constant, not a slope."
    elif (lesson, objective) == (1, 4):
        threshold = shift * 2
        prompt = f"An exactly representable saved threshold is{threshold}; the rule is left if x<=threshold. Where does query x={threshold} go?"
        options = ["Left child, including equality", "Right child because equality is excluded", "Both children, averaging their predictions"]
        explanation = "Use the stored threshold and declared precision, never display rounding. The <= comparison includes equality."
    elif (lesson, objective) == (2, 1):
        targets = [shift, shift + 2, shift + 4]
        expected = float(np.mean(targets)); kind = "number"
        prompt = f"A house-price leaf has targets{targets} in100000 currency units. Compute its prediction (numeric mean), not its SSE."
        explanation = f"The mean is{expected}; residuals are[-2,0,2], so SSE=8 and MSE=8/3. Prediction and prediction error are different quantities."
    elif (lesson, objective) == (2, 2):
        targets = [shift, shift, shift + 4, shift + 4]
        features = np.arange(4).reshape(-1, 1)
        model = DecisionTreeRegressor(max_depth=1, criterion="squared_error", random_state=1729).fit(features, targets)
        expected = float(model.tree_.threshold[0]); kind = "number"
        prompt = f"House targets{targets} ordered by x=[0,1,2,3]. Compare candidate thresholds.5 and1.5 by combined child squared error. Enter the threshold with the larger improvement, then explain its leaf prediction."
        explanation = f"At1.5 each child has SSE0; parent SSE16. At.5 the mixed child SSE32/3 remains. The chosen right leaf predicts numeric mean{shift+4}, not a majority class or the split threshold."
    elif (lesson, objective) == (2, 3):
        targets = np.array([shift, shift + 2, shift + 4, shift + 6], dtype=float)
        parent = np.sum((targets - targets.mean())**2)
        child = sum(np.sum((group-group.mean())**2) for group in [targets[:2], targets[2:]])
        expected = float(parent-child); kind = "number"
        prompt = f"Targets{targets.tolist()} split first two versus last two. Parent SSE20 and combined child SSE4. Compute SSE reduction, not the local MSE reduction."
        explanation = "SSE reduction=20-4=16. Dividing by parent count4 gives local MSE gain4. Do not weight already-summed child SSE a second time."
    elif (lesson, objective) == (2, 4):
        high = shift + 7
        prompt = f"A saved regression tree has leaf means[2,{high}]. A query lies far beyond the training area range in the second leaf. What does the tree do?"
        options = [f"Predict{high}; no continuation of a linear slope beyond that leaf", "Extrapolate price upward proportionally to distance", "Refit automatically on the unknown future sale price"]
        explanation = "A tree is piecewise constant. Outside the training range it continues the reached leaf value; plausible extrapolation is not guaranteed."
    elif (lesson, objective) == (3, 1):
        counts = [shift, 2]
        expected = float(1-sum((count/sum(counts))**2 for count in counts)); kind = "number"
        prompt = f"Customer leaf class counts{counts}, ordered0=stays,1=churns. Calculate Gini=1-sum(p_class squared)."
        explanation = "Divide each count by the leaf total, square both proportions and subtract their sum from1. Balanced binary Gini=.5; pure Gini=0. Entropy uses a different scale."
    elif (lesson, objective) == (3, 2):
        left = [shift + 1, 0]; right = [1, shift + 2]
        prompt = f"Split A gives class counts left{left},right{right}; split B leaves the parent proportions unchanged in both children. Which reasoning selects a useful classification split?"
        options = ["A: weight each child Gini by child count; output class fractions then majority class", "B: numeric class codes should be averaged as regression prices", "A: average the two child Ginies without checking child sizes"]
        explanation = "A separates differing class proportions, giving positive size-weighted Gini gain; B has zero gain. Leaf probabilities are fractions in sorted class order, with first-class tie resolution, not a regression interpretation of label codes."
    elif (lesson, objective) == (3, 3):
        balanced = variant % 2 == 0
        prompt = f"Compare leaves[5,5] and[9,1]. Which has {'more' if balanced else 'less'} class mixing?"
        options = (["[5,5]: Gini.5 versus.18", "[9,1]: Gini.9 versus.5", "Both must be pure"] if balanced else ["[9,1]: Gini.18 versus.5", "[5,5]: Gini0 versus1", "Both must be pure"])
        explanation = "Balanced classes have maximal binary mixing. Imbalance can lower impurity while a model misses rare churners; inspect recall and costs on unseen data."
    elif (lesson, objective) == (3, 4):
        prompt = f"A tiny training leaf in cohort{shift} is pure. Which evaluation claim is justified?"
        options = ["Training impurity is zero; unseen errors and calibration still need held-out evidence", "Zero impurity guarantees perfect future accuracy", "Probability1 from one leaf proves a causal effect"]
        explanation = "Purity describes observed training labels. Sparse leaves can overfit and produce overconfident class fractions; impurity is not validation performance."
    elif (lesson, objective) == (4, 1):
        expected = float(shift + 1); kind = "number"
        prompt = f"Depth1 train MSE{shift+3},development MSE{shift+1}; depth3 train MSE0,development MSE{shift+5}. Report the better development MSE, not the minimum training MSE."
        explanation = "Compare complexity on matching unseen development rows. Here the shallow model generalizes better despite higher training error. This is an example, not a universal law."
    elif (lesson, objective) == (4, 2):
        prompt = f"For cohort{shift}, the team picks unrestricted depth solely because training error is lowest. What is the valid response?"
        options = ["Reject; compare depth using development or fold-local CV and disclose sample sensitivity", "Accept; training error alone measures generalization", "Try depths against the final test until one wins"]
        explanation = "Flexible trees can fit noise and change sharply with a changed training row. Complexity selection needs unseen development or fold-local evidence, not final-test feedback."
    elif (lesson, objective) == (4, 3):
        row = shift + 2
        prompt = f"Change training row{row}'s target and refit. Why can other queries change prediction even though their features did not change?"
        options = ["Training-dependent split rankings or leaf estimates can change; routing follows the newly fitted tree", "Each query has a personal fixed training label", "Every changed row must change every prediction"]
        explanation = "Trees learn their structure and leaves from the training sample. A small change can alter a split, but need not alter every tree or prediction."
    elif (lesson, objective) == (4, 4):
        prompt = f"Candidate{shift} increases min_samples_leaf or positive ccp_alpha. What trade-off should be checked?"
        options = ["Simpler leaves/subtrees may reduce variance or remove useful detail; compare unseen error", "Pruning always improves every future score", "ccp_alpha is a classification decision threshold"]
        explanation = "Cost-complexity pruning trades training weighted leaf risk against alpha times leaf count. Derive paths within training folds; select complexity without test labels."
    elif (lesson, objective) == (5, 1):
        classification = variant % 2 == 0
        task = "classification" if classification else "regression"
        criterion = "gini" if classification else "squared_error"
        prompt = f"Choose the approved reproducible {task} settings for depth{shift}."
        options = [f"criterion='{criterion}',max_depth={shift},min_samples_leaf=1,random_state=1729; record feature order and version", "Use unspecified defaults and assume all versions resolve split ties alike", "Use entropy fitted variants because all criteria are interchangeable"]
        explanation = "Fix the task-specific criterion, constraints, feature order, seed and library profile. A seed freezes local library behavior, not a unique mathematical tie across versions."
    elif (lesson, objective) == (5, 2):
        scenario = ["includes post-churn cancellation outcome as a feature", "shuffles targets without retaining row IDs", "chooses pruning alpha from final-test errors", "fits an imputer on all CV rows before splitting folds", "derives pruning candidates using validation labels"][variant]
        prompt = f"A tree workflow {scenario}. What should happen?"
        options = ["Reject and repair the actual availability,alignment or training/fold-only boundary", "Accept because trees do not need scaling", "Accept if the resulting accuracy is high"]
        explanation = "Remove unavailable features, realign targets by ID and learn imputation/splits/pruning paths inside each training fold. Development selects; final test evaluates once after freezing. Lack of scaling does not excuse leakage."
    elif (lesson, objective) == (5, 3):
        prompt = f"Repair workflow{shift}: it currently fits preprocessing globally, tunes on test and then reports training accuracy."
        options = ["Split aligned rows; fit preprocessing/tree within each training fold; select with development/CV; freeze; evaluate matching untouched test rows", "Tune using all labels,then rename training rows test", "Predict test labels first and fit thresholds until they match"]
        explanation = "Correct operation ordering protects information boundaries. Training, prediction and evaluation are distinct; report task-appropriate metrics on the same held-out row IDs."
    elif (lesson, objective) == (5, 4):
        classification = variant % 2 == 1
        prompt = f"Choose metrics for {'churn classification with rare positives' if classification else 'house-price regression in currency units'}; compare models on matching unseen rows."
        options = (["Confusion counts,recall/precision and costs; accuracy alone can hide missed churn", "MSE of arbitrary class IDs proves calibrated probability", "Training impurity is the only evaluation needed"] if classification else ["MAE/RMSE in target units; MSE in squared units; inspect large and subgroup residuals", "Accuracy after treating every price as a class", "Gini impurity is house-price prediction error"])
        explanation = "Match metrics to target meaning and decision costs. Regression error and class mixing answer different questions; held-out row alignment is mandatory."
    elif (lesson, objective) == (6, 1):
        threshold = shift + 1
        prompt = f"A path says area<={threshold} AND age>10 and covers3 of20 training rows. Which statement accurately explains it?"
        options = [f"Local rule for that intersection; training coverage3/20 does not certify unseen coverage", "Global rule for every house with no need to check age", "Changing area causally guarantees a changed price"]
        explanation = "Every path condition matters. Local rules summarize fitted behavior over a covered region, not universal causes or performance guarantees."
    elif (lesson, objective) == (6, 2):
        claim = ["importance.8 proves area causes price", "a rule covering3/20 works on every future house", "correlated-feature importance uniquely identifies the true driver", "many split opportunities prove a feature is causally important", "one pure leaf guarantees reliable probability under shift"][variant]
        prompt = f"A report claims {claim}. Choose a defensible response."
        options = ["Reject causal/global inference; disclose training distribution,coverage,correlation and importance limitations", "Accept because impurity importance measures intervention effects", "Accept because a tree diagram is inherently universally interpretable"]
        explanation = "Impurity importance records training split reductions. Coverage, correlated predictors and feature cardinality affect it. Neither a local rule nor predictive importance establishes causality or reliability under shift."
    elif (lesson, objective) == (6, 3):
        prompt = f"For prediction problem{shift}, compare a single tree with existing linear models and a future forest. Which comparison is valid?"
        options = ["Trees give piecewise rules; linear models impose a coefficient structure; ensembles can reduce instability but need held-out comparison", "A single tree always beats every linear model", "A conceptual forest comparison authorizes training a new module"]
        explanation = "Compare mechanisms and the same held-out metrics/costs, not universal rankings. A forest comparison is contextual only; no forest is fitted here."
    else:
        prompt = f"Tree report{shift} has good aggregate development error but a tiny subgroup and out-of-range houses. What must be disclosed?"
        options = ["Subgroup uncertainty,training sensitivity and leaf range limits; aggregate score is not a guarantee", "Ignore subgroups because the mean error looks good", "Extrapolate confidently because trees have no assumptions"]
        explanation = "Audit errors by meaningful subgroup with sample counts. A piecewise-constant predictor has limited extrapolation and may change under shift or refitting."
    return kind, prompt, expected, options, explanation


def catalog():
    families = []
    for lesson in range(1, 7):
        for objective in range(1, 5):
            for variant, suffix in enumerate(["practice.A", "practice.B", "assessment.A", "assessment.B", "assessment.C"]):
                kind, prompt, expected, options, explanation = case(lesson, objective, variant)
                identity = f"DT0{lesson}.O{objective}"
                atom = {"id": "decision", "kind": kind, "label": "Decision or calculation"}
                answer = {"kind": kind, "value": expected} if kind == "number" else {"kind": kind, "optionId": "supported"}
                if kind == "choice":
                    choices = [{"id": key, "label": label} for key, label in zip(["supported", "confused", "unsafe"], options)]
                    atom["options"] = choices[variant % 3:] + choices[:variant % 3]
                atoms, accepted = [atom], [answer]
                if (lesson, objective) == (2, 1):
                    atoms.append({"id": "sse", "kind": "number", "label": "Leaf SSE in squared target units"})
                    accepted.append({"kind": "number", "value": 8.0})
                if objective == 2:
                    reasons = [{"id": "mechanism", "label": explanation}, {"id": "score", "label": "Lower training error alone proves this reasoning is valid"}, {"id": "causal", "label": "A learned split proves a causal and universally reliable effect"}]
                    atoms.append({"id": "reason", "kind": "choice", "label": "Mechanism and changed-case explanation", "options": reasons[variant % 3:] + reasons[:variant % 3]})
                    accepted.append({"kind": "choice", "optionId": "mechanism"})
                families.append({"id": identity + "." + suffix, "objective": identity, "critical": objective == 2, "prompt": prompt, "code": "", "atoms": atoms, "accepted": [accepted], "explanation": explanation, "remediation": f"Recall {identity}: {explanation} Rework the changed lesson example before a fresh whole assessment; do not combine attempts."})
    return {"content": "supervised.decision-trees.1.0.0", "families": families}
