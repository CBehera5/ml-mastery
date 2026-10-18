"""Trusted authored Gradient Boosting exercises; no learner code execution."""
import math


def case(lesson, objective, variant):
    value = variant + 1
    expected = None
    kind = "choice"
    facts = {"lesson": lesson, "objective": objective, "variant": variant}
    options = []
    if (lesson, objective) in [(1, 1), (2, 1), (2, 2)]:
        initial, correction, rate = 2 + value, value + 1, .1 * value
        target = initial + correction
        expected = initial + rate * correction
        facts.update(initial=initial, correction=correction, rate=rate, target=target)
        kind = "number"
        prompt = f"A house-price model predicts F={initial};y={target}. A supplied fitted leaf correction is h={correction},eta={rate}. Calculate the updated prediction F+eta*h in fictional price units."
        explanation = f"Residual y−F={correction};for half-squared loss this is the negative gradient. A leaf averages its assigned training residuals;here its supplied value is{correction}. Add eta*h,not h alone,so prediction={expected}. This is not a validation guarantee."
    elif (lesson, objective) == (1, 2):
        prompt = f"At stage{value+1},a house-price booster already has predictions F. Which mechanism differs from a Random Forest?"
        options = ["Fit the next learner to the current training loss gradients,then add its shrunken contribution", "Independently fit original targets and average all trees like a forest", "Use validation targets as the next learner's training labels"]
        explanation = "Boosting is sequential:the current model determines training-stage targets. Bagging fits resampled original targets and averages independently fitted outputs. Validation measures stages;it never supplies their targets."
    elif (lesson, objective) == (1, 3):
        prompt = f"A team changes eta from{.1*value} to{.05*value} and doubles its stage budget. What follows?"
        options = ["Each fixed correction is scaled less,but later gradients change;equal eta×stages need not yield identical models", "The model is mathematically identical because eta×stages is unchanged", "Depth controls only display size,never learner flexibility"]
        explanation = "Eta scales each added learner;depth constrains its partitions. Later training targets depend on earlier updates,so rate and stage count are coupled,not an exact interchangeable product. Compare permitted validation curves."
    elif (lesson, objective) == (1, 4):
        prompt = f"Training IDs T{value} and validation IDs V{value} are disjoint. Which rows fit stage{value+1},including its gradient targets?"
        options = [f"Only T{value};V{value} measures loss without fitting", f"T{value} and V{value} because stage selection needs both labels", "Untouched test rows to ensure the last correction generalizes"]
        explanation = "All weak learners and their targets use the training partition. Validation scores compare already fitted stages;test remains outside development. Fitting a later stage is still training,not inference."
    elif (lesson, objective) == (2, 3):
        residuals = [value, value + 2]
        expected = sum(residual * residual for residual in residuals) / 2
        facts["residuals"] = residuals
        kind = "number"
        prompt = f"After a supplied update,two training residuals are{residuals}. Calculate mean squared error,not half-squared loss."
        explanation = f"MSE=sum residual²/n={expected};half-squared loss averages half that. Keep units squared and do not infer held-out performance from a training decrease."
    elif (lesson, objective) == (2, 4):
        ordinary, outlier = value, 10 * value
        prompt = f"Two housing residuals are{ordinary} and{outlier}. Why can squared-error boosting chase the second?"
        options = ["Its squared-loss contribution is100 times larger;noise/outliers can dominate and hurt validation", "Both residuals contribute equally because each row counts once", "An outlier proves boosting always beats a linear baseline"]
        explanation = "Scaling a residual by10 scales its squared-error contribution by100. Residual correction can chase noise. Inspect provenance,validation and task-appropriate losses;do not silently change this module's squared-error criterion."
    elif (lesson, objective) == (3, 1):
        score = [-2., -1., 0., 1., 2.][variant]
        probability = 1 / (1 + math.exp(-score))
        expected = 1 - probability
        facts.update(score=score, target=1)
        kind = "number"
        prompt = f"For a churn-positive row y=1 and raw score F={score},use p=sigmoid(F). Calculate the negative gradient y−p of binary log-loss with respect to F."
        explanation = f"p={probability};negative logit-loss gradient=1−p={expected}. It is not a class label or necessarily the fitted leaf value."
    elif (lesson, objective) == (3, 2):
        probability = [.2, .3, .5, .6, .8][variant]
        prompt = f"A training leaf has one illustrative y=1 row,p={probability}. Which statement correctly distinguishes classification boosting from raw-label residual regression?"
        options = ["The score gradient is1−p;the fitted binary leaf uses a Newton adjustment before eta scaling,then sigmoid converts the updated score", "The fitted leaf always equals1−p and is itself the new probability", "Every classification update directly averages the class labels as a house-price prediction"]
        explanation = "Binary log-loss gradient is y−p in score space. sklearn terminal-leaf correction=sum(y−p)/sum(p(1−p));then F adds eta times that correction. Probabilities are sigmoid(F),not raw label residuals."
    elif (lesson, objective) == (3, 3):
        score = [-1.5, -.5, .5, 1.5, 2.5][variant]
        facts["score"] = score
        expected = 1 / (1 + math.exp(-score))
        kind = "number"
        prompt = f"A supplied classifier stage has already updated raw score to F={score}. Calculate P(churn)=sigmoid(F),not the score or class label."
        explanation = f"p=1/(1+exp(−F))={expected}. Convert after additive score updates;eta does not directly interpolate labels or average tree probabilities."
    elif (lesson, objective) == (3, 4):
        prompt = f"Scenario{value}:raw score F=0,p=.5,and explicit positive action rule p>=.5. Which names the three quantities correctly?"
        options = ["Score0;probability.5;action label1. This explicit equality rule differs from sklearn predict's strict score>0", "Score.5;probability1;label0 because all thresholds exclude equality", "Score,label and probability are interchangeable quantities"]
        explanation = "Scores span the real line,probabilities lie in[0,1],labels are discrete. Threshold equality is explicit;do not use rounded display values. Library predict at zero chooses class0,while the authored >=.5 action chooses1."
    elif (lesson, objective) in [(4, 1), (4, 2)]:
        best = variant % 3
        losses = [float(4 + value), float(5 + value), float(6 + value)]
        losses[best] = 1.0 + value / 10
        facts["losses"] = losses
        prompt = f"Training loss decreases at stages1,2,3. On the fixed validation partition,the task's approved losses are{losses}. Which stage is selected without opening the test set?"
        options = [f"Stage{best+1},the smallest permitted validation loss;freeze development before final test", "Stage3 solely because training loss is lowest", "Choose whichever stage has the lowest final-test loss"]
        explanation = f"Choose stage{best+1} by validation loss,not training loss or test feedback. Labels on validation can compare trained prefixes but never fit those trees. Exact ties use earliest stage within1e−12."
    elif (lesson, objective) == (4, 3):
        prompt = f"Compare eta={.1*value},budget4 with half that eta,budget8 on the same housing split. Which conclusion is justified?"
        options = ["Evaluate each actual validation trace;equal eta×budget does not guarantee equal targets,predictions or generalization", "Choose the smaller rate without evidence because it always generalizes better", "Choose eight stages using the final test as a development monitor"]
        explanation = "Shrinkage changes earlier predictions and all later gradient targets. More stages or smaller steps can help or hurt;compare actual loss on permitted validation rows."
    elif (lesson, objective) == (4, 4):
        train = [3 / value, 2 / value, 1 / value]
        development = [1 / value, 2 / value, 3 / value]
        prompt = f"Three successive stages have train loss{train},validation loss{development}. What does the tail suggest?"
        options = ["Overfitting:training improves while validation worsens;prefer the permitted validation minimum and report uncertainty", "Universal improvement because training loss falls", "The validation partition should be moved into training until its loss falls"]
        explanation = "Loss directions differ across partitions. Later corrections can chase training noise;validation is evidence,not a guarantee under shift. Do not move the boundary after inspecting failures."
    elif (lesson, objective) in [(5, 1), (5, 2), (5, 3)]:
        violation = ["global imputation before splitting", "scaling fitted on every CV row", "test-loss stage stopping", "validation targets used for gradient fitting", "feature selection learned before creating training folds"][variant]
        prompt = f"Repair a boosting workflow containing {violation}. Which complete sequence keeps the evaluation meaningful?"
        options = ["Align available features/targets;split;fit learned preparation and booster inside each training fold;use permitted validation for selection;freeze before untouched test", "Fit preparation globally;boosting removes leakage automatically", "Fit trees or select stopping with test/validation target information then call it unseen evaluation"]
        explanation = "Training-only fitting and separately fold-only fitting are distinct. Every learned preparation step uses only that fold's training rows;stage targets exclude validation/test. Simple trees need no mandatory scaling,but learned preparation when used still obeys boundaries."
    elif (lesson, objective) == (5, 4):
        task = ["house prices", "churn probabilities", "documentation binary quality", "sale-price errors", "customer class probabilities"][variant]
        classification = variant in [1, 2, 4]
        prompt = f"For {task},choose a task-appropriate loss and evaluation interpretation."
        options = ["Binary log-loss for probability quality;confusion/cost metrics for threshold actions" if classification else "Squared-error regression loss;report MSE/MAE with appropriate target units", "Accuracy is the same as probability calibration and MSE", "Use test-loss feedback to decide every stage"]
        explanation = "Regression predicts quantities;binary boosting updates class scores and probabilities. Loss,decision metric and target meaning differ. Compare matching rows;an accuracy improvement need not improve log-loss or calibration."
    elif (lesson, objective) == (6, 1):
        forest_error, boost_error = value + 2, value + 1
        prompt = f"Same held-out houses:forest MAE{forest_error},booster MAE{boost_error}. How should this be reported?"
        options = ["Boosting has smaller observed MAE here;inspect residuals,noise,cost and uncertainty before broader claims", "Boosting universally dominates because one score is better", "Tree counts alone prove predictions are more reliable"]
        explanation = "Compare identical rows,targets and metrics. Forest averages resampled learners;boosting sequentially corrects loss. A matched observed score difference is not a universal algorithm ranking or proof of future accuracy."
    elif (lesson, objective) == (6, 2):
        claim = ["largest importance proves causality", "lowest validation loss guarantees every future subgroup", "boosting always handles noisy labels perfectly", "winning here proves boosting always beats bagging", "strong accuracy proves calibrated probabilities under shift"][variant]
        prompt = f"A report claims {claim}. Which response protects interpretation?"
        options = ["Reject the guarantee;state data/noise/calibration/shift limits and seek appropriate matched unseen evidence", "Accept because sequential correction removes all limitations", "Use final-test feedback repeatedly until the claim looks true"]
        explanation = "Loss correction can chase noise;importance is not intervention;calibration and shift need evidence. Neither an importance plot nor a small synthetic validation win establishes causality,universal superiority or all-subgroup reliability."
    elif (lesson, objective) == (6, 3):
        prompt = f"Feature{value} receives high impurity importance in a booster. What does that establish?"
        options = ["Training split reductions attributed to that feature,not a causal effect;correlation and split opportunities affect ranking", "A causal intervention effect valid for all populations", "Zero permutation change would prove the feature is never useful"]
        explanation = "Importance depends on fitted structure,metric,data and correlated alternatives. Compare held-out/permutation evidence with limits;neither establishes causal effects or deployment-wide reliability."
    else:
        concern = ["training cost", "inference latency", "probability calibration", "new customer distribution", "a small rare subgroup"][variant]
        prompt = f"A strong aggregate boosting score accompanies uncertainty about {concern}. What belongs in the report?"
        options = ["Report relevant fit/inference cost,calibration,shift/subgroup evidence and limits,not just a single aggregate score", "Ignore the concern because weak learners guarantee generalization", "Tree count itself certifies every future prediction"]
        explanation = "Sequential fitting has cost;more stages increase inference work. Probability ranking is not calibration;shift and small subgroups require relevant evidence. Introductory comparisons do not certify production readiness."
    return kind, prompt, expected, options, explanation, facts


def catalog():
    families = []
    for lesson in range(1, 7):
        for objective in range(1, 5):
            for variant, suffix in enumerate(["practice.A", "practice.B", "assessment.A", "assessment.B", "assessment.C"]):
                kind, prompt, expected, options, explanation, _ = case(lesson, objective, variant)
                identity = f"GB0{lesson}.O{objective}"
                atom = {"id": "decision", "kind": kind, "label": "Decision or calculation"}
                accepted = [{"kind": kind, "value": expected} if kind == "number" else {"kind": "choice", "optionId": "supported"}]
                if kind == "choice":
                    choices = [{"id": key, "label": label} for key, label in zip(["supported", "confused", "unsafe"], options)]
                    atom["options"] = choices[variant % 3:] + choices[:variant % 3]
                atoms = [atom]
                if objective == 2:
                    mechanism = "For half-squared loss,the negative gradient is y−F. A fitted leaf averages its assigned training residuals;eta scales that leaf's contribution before addition. Validation evidence is separate." if lesson == 2 else explanation
                    choices = [{"id": "mechanism", "label": mechanism}, {"id": "score", "label": "Lower training loss makes all partition and probability distinctions irrelevant"}, {"id": "causal", "label": "More stages prove universally reliable causal predictions"}]
                    atoms.append({"id": "reason", "kind": "choice", "label": "Mechanism and transfer explanation", "options": choices[variant % 3:] + choices[:variant % 3]})
                    accepted.append({"kind": "choice", "optionId": "mechanism"})
                families.append({"id": identity + "." + suffix, "objective": identity, "critical": objective == 2, "prompt": prompt, "code": "", "atoms": atoms, "accepted": [accepted], "explanation": explanation, "remediation": f"Recall {identity}: {explanation} Contrast the changed worked case,trace quantities and permitted row IDs,and explain before a fresh whole-form reassessment;never combine attempts."})
    return {"content": "supervised.gradient-boosting.1.0.0", "families": families}
