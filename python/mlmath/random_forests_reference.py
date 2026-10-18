"""Trusted authored Random Forest cases; no learner program interpretation."""
import numpy as np


def case(lesson, objective, variant):
    kind, expected, extra = "choice", "supported", None
    options = []
    if (lesson, objective) == (1, 1):
        draws = [["A","A","C","D"],["B","B","A","D"],["B","C","D","D"],["A","C","A","C"],["B","B","B","A"]][variant]
        count = draws.count("B")
        options = [f"{count} occurrences of B", f"{(count+1)%5} occurrences of B", "Every original ID must appear exactly once"]
        prompt = f"Bootstrap training IDs[A,B,C,D] with replacement: draw{draws}. How many times does B contribute? A split draws feature candidates[area,usage] from three available features; do not confuse candidates with a permanent per-tree subset."
        explanation = "Count repeated IDs as training multiplicities,not new independent observations. A row absent from this draw is OOB for this tree only. Feature candidates are drawn per split;the retained split need not use every candidate."
        extra = ["The candidate set is area and usage at this split;it is not a guaranteed permanent tree-wide feature subset", "Only area can ever be used by any descendant", "Replacement requires every original row exactly once"]
    elif (lesson, objective) == (1, 2):
        claim = ["copy one tree100 times to create independent errors", "two highly correlated trees guarantee independent predictions", "bootstrap sampling guarantees zero correlation", "random feature candidates make every tree unbiased", "more identical trees guarantee lower future error"][variant]
        prompt = f"A housing team proposes: {claim}. Which response is defensible?"
        options = ["Reject the guarantee;bootstrap/features may diversify fitted errors,but correlated trees retain shared error", "Accept because every extra tree is independent new evidence", "Tune ensemble size using repeated final-test feedback"]
        explanation = "Averaging benefits depend on error diversity. Bootstrap and feature randomness can reduce similarity but do not ensure independence,remove common bias or guarantee better unseen error. Compare changed resamples on permitted held-out rows."
    elif (lesson, objective) == (1, 3):
        description = ["trees fit separately on resampled training IDs", "each next learner fits a loss-gradient target from earlier predictions", "separate bootstrap fits with random feature candidates", "sequential learners correct previous prediction errors", "independently scheduled bootstrap fits averaged afterward"][variant]
        bagging = variant in [0,2,4]
        prompt = f"Classify the mechanism: {description}."
        options = ["Bagging/forest mechanism" if bagging else "Sequential boosting mechanism,comparison only here", "Sequential boosting mechanism" if bagging else "Ordinary independent bagging", "Both mechanisms must use final-test labels while training"]
        explanation = "Bagging fits resampled learners separately and aggregates;boosting builds a sequence using earlier model errors/loss gradients. This comparison does not implement a boosting algorithm."
    elif (lesson, objective) == (1, 4):
        scenario = ["same dataset,settings,library and seed", "same seed but changed training rows", "different seed on the same training data", "same predictions on a tiny resample", "same seed but a different library version"][variant]
        prompt = f"What can be concluded from {scenario}?"
        options = [(["The pinned computation can be reproduced;this is not population uncertainty", "Saved randomness does not freeze a changed learning problem", "Sampling/tree traces may change;compare stability rather than promise identical predictions", "Observed agreement is not proof that every future sample agrees", "Cross-version topology is not guaranteed by a numeric seed"])[variant], "A fixed seed proves calibrated future error intervals", "A reproducible result proves causal effects"]
        explanation = "Reproducibility fixes a declared computation. Sampling variability,distribution shift and future prediction uncertainty are different questions. Record the profile,rows,feature order and settings."
    elif (lesson, objective) == (2, 1):
        values = [[2,4,6],[1,4,7],[3,6,9],[2,3,7],[4,8,12]][variant]
        kind, expected = "number", float(np.mean(values))
        prompt = f"Individual house-price tree predictions{values},in100000 currency units. Compute the forest's mean prediction,not its spread."
        explanation = "Add all numeric tree predictions and divide by the number of trees. Mean prediction has target units;the dispersion of these values is not a calibrated prediction interval."
    elif (lesson, objective) == (2, 2):
        claim = ["tree outputs[4,4,4] prove a zero-width calibrated future interval", "more correlated trees always remove all bias", "tree spread is automatically a95% prediction interval", "seven trees must improve every individual unseen prediction", "a low-spread ensemble guarantees the true price equals its mean"][variant]
        prompt = f"Evaluate the claim: {claim}."
        options = ["Reject;averaging can reduce variance but shared error remains,and spread does not certify outcome coverage", "Accept because any tree collection is an independent sample of true future outcomes", "Use the test set to alter the interval until coverage looks good"]
        explanation = "With equal variance sigma² and equal pairwise correlation rho,Var(mean)=sigma²*(rho+(1-rho)/T). This restricted model leaves shared variance at rho=1. It is not proof of unbiasedness or calibrated prediction intervals;validate the actual unseen prediction claim."
    elif (lesson, objective) == (2, 3):
        actual, single, ensemble = [8,9,10,6,12][variant], [2,4,7,7,5][variant], [4,7,8,5,9][variant]
        kind, expected = "number", abs(actual-single)-abs(actual-ensemble)
        prompt = f"Same held-out house: actual{actual},single-tree prediction{single},forest prediction{ensemble}. Compute single absolute error minus forest absolute error. Negative would mean the forest is worse."
        explanation = "Use the same target and row for both residuals. Subtract absolute errors in target units;one improved row does not prove a universal forest advantage or mean squared-error law."
    elif (lesson, objective) == (2, 4):
        price = [8,10,7,9,12][variant]
        prompt = f"Every reached tree leaf beyond the training area range predicts{price}. What can the forest infer about a still larger house?"
        options = [f"Its mean remains{price};averaging does not create an extrapolated slope", "Prices must increase linearly forever", "The forest refits automatically using the future sale label"]
        explanation = "Averaging piecewise-constant tree leaves does not learn a linear extrapolation rule. Outside covered feature ranges,disclose limitations and inspect appropriate data."
    elif (lesson, objective) == (3, 1):
        positive = [[.2,.4,.6],[.1,.5,.9],[.3,.6,.9],[.1,.2,.6],[.2,.7,.9]][variant]
        vectors = [[1-positive[0],positive[0]],[positive[1],1-positive[1]],[1-positive[2],positive[2]]]
        kind, expected = "number", float(np.mean(positive))
        prompt = f"Tree class orders[[0,1],[1,0],[0,1]],probability vectors{vectors};0=stays,1=churns. Align columns and compute mean P(churn)."
        explanation = "Identify class1 in each tree's declared order before averaging probabilities. A reversed column order is not a changed class meaning;averaging raw column positions can silently corrupt the prediction."
    elif (lesson, objective) == (3, 2):
        positive = [[.4,.4,.9],[.1,.6,.6],[.3,.4,.99],[.49,.49,.9],[.01,.51,.51]][variant]
        decision = int(sum(positive)/len(positive) > .5)
        hard = int(sum(value > .5 for value in positive) > len(positive)/2)
        prompt = f"Aligned tree P(churn)={positive}. Which class does the approved probability-average classifier predict (argmax tie goes0)?"
        options = [f"Class{decision} from the mean probability vector", f"Class{hard} because majority hard labels define this forest", "Neither:forest classification averages numeric target labels as prices"]
        explanation = f"Mean P(churn)={sum(positive)/len(positive):.9f},so probability argmax selects class{decision}. Hard-label majority would select{hard};it discards each tree's confidence and is not the approved prediction rule."
    elif (lesson, objective) == (3, 3):
        probability, threshold = [(.5,.5),(.4,.5),(.8,.7),(.3,.3),(.65,.7)][variant]
        action = int(probability >= threshold)
        options = [f"Action{action} using the declared >= rule", f"Action{1-action} because equality must always be excluded", "Refit the forest to change the action threshold"]
        prompt = f"A separately declared action predicts churn if p>=threshold. For p={probability},threshold={threshold},enter the action label0 or1. This is not necessarily sklearn argmax at a tie."
        explanation = "The >= rule includes equality. Binary sklearn argmax at p=.5 chooses first sorted class0,while an explicitly declared >=.5 action chooses1. Never round probabilities before deciding."
    elif (lesson, objective) == (3, 4):
        fp, fn = [(2,1),(1,3),(0,2),(4,0),(3,2)][variant]
        kind, expected = "number", fp+5*fn
        prompt = f"Churn positive=1. Same-row confusion counts FP={fp},FN={fn};fictional costs FP1,FN5,correct0. Compute total decision cost,not accuracy."
        explanation = "False positives cost1 each,false negatives5 each;total=FP+5*FN. Costs are declared teaching assumptions. Accuracy can hide expensive rare-positive misses;compare like-for-like held-out rows."
    elif (lesson, objective) == (4, 1):
        draws = [[[0,0,2,3],[1,2,2,3],[0,2,3,3]],[[0,1,1,3],[0,2,2,3],[1,1,2,3]],[[0,0,1,2],[1,2,3,3],[0,1,2,3]],[[0,0,0,0],[1,1,2,3],[0,2,3,3]],[[1,1,2,3],[0,0,2,3],[0,1,2,3]]][variant]
        row = [1,0,3,2,1][variant]
        eligible = [index for index,draw in enumerate(draws) if row not in draw]
        prompt = f"Trees0,1,2 have bootstrap row-index draws{draws}. Which trees may contribute the OOB prediction for original training row{row}?"
        options = [f"Exactly trees{eligible};denominator{len(eligible)}", "All three trees,including those trained on this row", "Only trees containing the row repeatedly"]
        explanation = "A row is OOB only for trees whose draw omitted its original ID entirely. Duplicates do not create extra OOB votes. Zero contributing trees means unavailable,not a zero prediction or uniform probability."
    elif (lesson, objective) == (4, 2):
        violation = ["future time rows influence training features", "another row from the same customer remains in a bootstrap", "an imputer fits all rows before OOB evaluation", "a vocabulary uses held-out documents before cross-validation", "forest size is selected repeatedly against final-test outcomes"][variant]
        prompt = f"A team replaces deployment-appropriate validation with OOB even though {violation}. What is valid?"
        options = ["Reject the replacement;repair actual information/group/time boundaries and use appropriate held-out/fold validation", "Accept because omission of one row prevents every kind of leakage", "Accept because averaging erases future information"]
        explanation = "OOB excludes a row from contributing trees,not future information,related entities or globally learned preprocessing. Choose deployment-appropriate group/time splits,learn inside each training fold and freeze selection before untouched test evaluation."
    elif (lesson, objective) == (4, 3):
        errors = [[5,3,4],[2,4,3],[4,5,2],[7,5,6],[3,6,4]][variant]
        best = int(np.argmin(errors))
        prompt = f"Three finite forest configurations0,1,2 vary n_estimators/depth/max_features. On matching fixed development folds their mean MSEs are{errors}. Which comparison selects a candidate without test feedback?"
        options = [f"Candidate{best} has smallest supplied development MSE;freeze then evaluate untouched test with limits", "Choose the largest forest solely because it has more trees", "Select using the test error instead of the declared fold scores"]
        explanation = "Compare the same rows,metric and permitted folds. Candidate count and seed are not evaluation quality. Refit every learned step within each fold;lower observed development loss is not a guarantee under shift."
    elif (lesson, objective) == (4, 4):
        problem = ["global imputation", "test-guided size selection", "shuffled targets without ID alignment", "future cancellation features", "global feature selection before CV"][variant]
        prompt = f"Repair a forest workflow containing {problem}. Choose the complete safe sequence."
        options = ["Align available features/targets;split by deployment needs;fit preprocessing/model within each training fold;select with development/CV;freeze before test", "Fit globally and call OOB an untouched test", "Tune until final-test error is small,then rename it development"]
        explanation = "Pipeline names alone do not prove permissions. Keep row identity,feature timestamps,fold-only learned state and final-test boundaries explicit;predict with saved fitted state."
    elif (lesson, objective) == (5, 1):
        original, permuted = [(.75,.5),(.5,.75),(1.,1.),(.8,.6),(.6,.2)][variant]
        kind, expected = "number", original-permuted
        prompt = f"Held-out accuracy original={original},after a declared feature permutation={permuted}. Compute score decrease original-permuted. The separate impurity ranking describes training reductions."
        explanation = "Permutation score decrease can be positive,zero or negative. Interpret metric direction,held-out rows and redundancy;neither this value nor impurity importance is a causal effect."
        extra = ["Impurity importance summarizes normalized training split reductions,not an unbiased intervention effect", "A larger number proves a causal effect of the feature", "A zero permutation decrease proves the feature is always irrelevant"]
    elif (lesson, objective) == (5, 2):
        claim = ["impurity importance.8 proves a causal effect", "zero permutation loss proves a correlated feature is useless", "a high-cardinality feature's ranking is inherently unbiased", "one importance plot certifies every future subgroup", "a negative permutation score decrease is a negative causal effect"][variant]
        prompt = f"Evaluate this report: {claim}."
        options = ["Reject;state the training/metric/correlation/coverage limitation and seek appropriate held-out evidence", "Accept because random forests remove every importance bias", "Use final-test labels to adjust features until the story matches"]
        explanation = "Impurity importance depends on training splits and split opportunities;permutation depends on metric,data and substitutable correlated predictors. Neither is an intervention estimate or a global reliability guarantee."
    elif (lesson, objective) == (5, 3):
        comparison = ["housing MAE", "churn cost", "documentation false negatives", "subgroup residuals", "prediction latency"][variant]
        prompt = f"Compare forest,single tree and an existing linear baseline for {comparison}. Which protocol is valid?"
        options = ["Use the same target,held-out IDs and appropriate metrics/costs;describe mechanism and latency trade-offs", "Rank models using unrelated rows and different target meanings", "A forest universally dominates every linear model and tree"]
        explanation = "Forests aggregate nonlinear leaf rules;linear models impose coefficient structure. Compare matching evaluation conditions and practical costs rather than a universal algorithm ranking."
    else:
        concern = ["a tiny rare-customer subgroup", "a latency budget for mobile inference", "unstable predictions across resamples", "houses beyond the training range", "a shifted documentation population"][variant]
        prompt = f"A good aggregate forest score accompanies {concern}. What should the report include?"
        options = ["Relevant subgroup counts/error,latency or stability/range limits;aggregate accuracy is not a universal guarantee", "Ignore all limitations because there are many trees", "Tree spread alone certifies every future outcome"]
        explanation = "Report the population,subgroup sample sizes,shift,latency and instability appropriate to the claim. More trees increase computation and do not erase missing evidence or extrapolation limits."
    return kind, prompt, expected, options, explanation, extra


def catalog():
    families = []
    for lesson in range(1,6):
        for objective in range(1,5):
            for variant,suffix in enumerate(["practice.A","practice.B","assessment.A","assessment.B","assessment.C"]):
                kind,prompt,expected,options,explanation,extra = case(lesson,objective,variant)
                identity = f"RF0{lesson}.O{objective}"
                atom = {"id":"decision","kind":kind,"label":"Decision or calculation"}
                accepted = [{"kind":kind,"value":expected} if kind=="number" else {"kind":"choice","optionId":"supported"}]
                if kind=="choice":
                    choices = [{"id":key,"label":label} for key,label in zip(["supported","confused","unsafe"],options)]
                    atom["options"] = choices[variant%3:]+choices[:variant%3]
                atoms = [atom]
                if objective==2 or extra:
                    reasons = extra if extra else [explanation,"Lower training error validates every information boundary and uncertainty claim","A learned model or importance plot proves universally reliable causal effects"]
                    choices = [{"id":key,"label":label} for key,label in zip(["mechanism","score","causal"],reasons)]
                    atoms.append({"id":"reason","kind":"choice","label":"Mechanism and changed-case explanation","options":choices[variant%3:]+choices[:variant%3]})
                    accepted.append({"kind":"choice","optionId":"mechanism"})
                families.append({"id":identity+"."+suffix,"objective":identity,"critical":objective==2,"prompt":prompt,"code":"","atoms":atoms,"accepted":[accepted],"explanation":explanation,
                                 "remediation":f"Recall {identity}: {explanation} Compare the changed worked example and name the actual mechanism/boundary before a fresh whole-form attempt;do not combine attempts."})
    return {"content":"supervised.random-forests.1.0.0","families":families}
