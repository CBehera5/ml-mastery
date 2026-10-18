"""Trusted authored SVM exercises; no learner code or expressions execute."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def frozen(lab, index):
    return json.loads((ROOT / f"docs/verification/support-vector-machines/sv-e{lab}.manifest.v1.json").read_text())["configurations"][index]


def case(lesson, objective, variant):
    value = variant + 1
    kind, expected, options = "choice", None, []
    facts = {"lesson": lesson, "objective": objective, "variant": variant}
    if (lesson, objective) == (1, 1):
        normal = [value, 0]
        point = [value + 1, value - 1]
        score = normal[0] * point[0]
        expected, kind = [score, score / value], "numbers"
        facts.update(normal=normal, point=point, intercept=0)
        prompt = f"A customer has x={point}. A supplied linear boundary has w={normal},b=0. Compute both F=w·x+b and signed geometric distance F/||w|| in these declared feature units. Neither is a probability."
        explanation = f"Score={score};normal norm={value},so signed distance={score/value}. Rescaling w,b changes raw scores but not normalized point-to-boundary distance."
    elif (lesson, objective) == (1, 2):
        score = [2., -2., .5, -.5, 3.][variant]
        label = int(score >= 0)
        prompt = f"Pinned fitted binary SVC has score F={score},class order[0,1] and ||w||=2. Which interpretation is justified?"
        options = [f"Class{label};signed geometric distance{score/2};no calibrated probability is established", "The score is automatically a churn probability and a distance without normalization", "A larger absolute score guarantees every future label is reliable"]
        explanation = "Separate decision sign,normal-normalized distance and calibrated risk. In the frozen binary SVC,score>=0 selects class1,including signed zero;manual exact-boundary geometry is labeled on-boundary. A score is not P(churn)."
    elif (lesson, objective) == (1, 3):
        scene = frozen(1, variant)
        facts["config_id"] = scene["id"]
        facts["support_ids"] = scene["support_ids"]
        prompt = f"Frozen scene{scene['id']} reports support IDs{scene['support_ids']}. Which support-vector interpretation is valid?"
        options = ["Use the solver's nonzero dual-coefficient membership;not every visually nearest/on-margin point must be solver-active", "Every point on or near the margin must have a nonzero dual coefficient", "Support vectors are only correctly classified observations;violations cannot be supports"]
        explanation = "Support IDs are exported from the pinned fit and checked against dual coefficients. Degeneracy can leave on-margin rows inactive;soft-margin supports may be inside the margin or misclassified. Geometry alone does not identify the solver list."
    elif (lesson, objective) == (1, 4):
        prompt = f"The contact feature is expressed at{10*value} times its former units while activity is unchanged. Why can an unscaled SVM fit change?"
        options = ["Dot products,norm penalties and RBF distances depend on units;fit scaling on training rows and compare valid validation evidence", "Only the drawing changes;units cannot affect the fitted optimization problem", "Use all validation/test rows to standardize because scaling is unsupervised"]
        explanation = "Changing one feature's scale changes the geometry and regularization trade-off. Training-fitted scaling makes assumptions explicit;global scaling still leaks distribution information,including inside CV."
    elif (lesson, objective) == (2, 1):
        score = [.5, -.5, 1., 2., -.25][variant]
        kind, expected = "number", max(0., 1 - score)
        facts.update(score=score, sign=1)
        prompt = f"For mathematical label y=+1 and F={score},compute hinge=max(0,1−yF),not log-loss or geometric distance."
        explanation = f"The functional margin is{score};hinge={expected}. A correctly classified point can still violate the canonical margin when0<yF<1. Negative yF means misclassification;hinge and error count differ."
    elif (lesson, objective) == (2, 2):
        prompt = f"A soft-margin SVC changes C from{value} to{10*value} in objective .5||w||²+C*sum hinge. Which reading is correct?"
        options = ["Violation penalties become stronger relative to the norm term;this is not stronger norm regularization or guaranteed validation improvement", "Larger C means stronger norm regularization and always a wider robust margin", "C is the decision probability threshold and can be selected from test labels"]
        explanation = "C multiplies violation cost;the coefficient on the norm is unchanged. Higher C may fit violations more closely and increase sensitivity to noise. Hard-margin separability is contextual,not a claim that any finite large C solves every noisy problem."
    elif (lesson, objective) == (2, 3):
        scene = frozen(1, [3, 4, 5, 4, 3][variant])
        facts["config_id"] = scene["id"]
        prompt = f"An outlier is present in{scene['id']}. How should its margin/support and validation evidence be interpreted?"
        options = ["C can change the compromise and support membership;inspect actual hinge and validation errors instead of promising improved robustness", "Zero training classification error certifies the widest possible robust margin", "One noisy observation cannot affect a fitted SVM boundary"]
        explanation = "Soft margins permit violations to avoid letting a difficult observation dictate the entire separator. Higher C raises violation cost but neither guarantees less noise sensitivity nor monotonically better validation."
    elif (lesson, objective) == (2, 4):
        prompt = f"At positive functional margin{1+value},compare hinge loss with Logistic log-loss. Which distinction matters?"
        options = ["Hinge can be zero beyond its canonical margin while Logistic log-loss remains positive for finite scores;neither alone certifies calibrated risk", "Both losses are always identical to the misclassification count", "Hinge and log-loss directly return calibrated class probabilities"]
        explanation = "Hinge=max(0,1−yF) has a flat zero region;Logistic log-loss is smooth and positive at finite correct scores. Classification agreement does not make mechanisms,probability quality or calibration identical."
    elif (lesson, objective) == (3, 1):
        distance, gamma = [(1., 1.), (1., 4.), (2., .1), (.5, 1.), (1.5, .5)][variant]
        kind, expected = "number", math.exp(-gamma * distance * distance)
        facts.update(distance=distance, gamma=gamma)
        prompt = f"In the declared fitted feature space,distance={distance},gamma={gamma}. Calculate RBF similarity exp(−gamma*d²). It is not a new measured feature or a probability."
        explanation = f"Square distance,apply gamma,then exponentiate the negative value:similarity={expected}. Identical points have similarity1;farther points can contribute much less."
    elif (lesson, objective) == (3, 2):
        prompt = f"At fixed nonzero distance{value},gamma increases from1 to4. What changes?"
        options = ["Similarity decays faster and influence becomes more local;the kernel is a pairwise computation,not a newly observed data column", "Larger gamma always makes every point more similar and guarantees better validation", "The kernel appends a true churn label as a new input feature"]
        explanation = "For fixed d>0,exp(−gamma*d²) falls as gamma rises. Local influence can form smaller regions and overfit;it does not add a newly measured input column or guarantee a better model."
    elif (lesson, objective) == (3, 3):
        prompt = f"Comparison{value}:on the same frozen clean nonlinear data,training-standardized linear C1 has validation balanced accuracy.5,RBF C1/gamma1 has1.0. What follows?"
        options = ["RBF captures this local pattern better on these permitted rows;compare matching evidence and limits,not a universal nonlinear-model guarantee", "RBF is universally better than every linear classifier", "The comparison permits selecting gamma using final-test feedback"]
        explanation = "Same-row,task and metric comparisons are meaningful. A linear hyperplane can miss local nonlinear structure;this tiny synthetic win is not proof of calibrated risk,universal superiority or future reliability."
    elif (lesson, objective) == (3, 4):
        prompt = f"A local RBF fit classifies every training row correctly but loses accuracy on validation near a noisy observation (case{value}). What should a learner inspect?"
        options = ["Small local regions,noise,C/gamma and validation evidence;perfect training fit does not prove generalization", "Only training accuracy,because smaller regions guarantee better unseen decisions", "Refit with validation labels until the apparent error vanishes"]
        explanation = "High locality and sufficient C can chase small patterns or noise. Inspect training/development differences and uncertainty;gamma alone does not order all boundary complexity or validation outcomes monotonically."
    elif (lesson, objective) == (4, 1):
        prompt = f"Training IDs T{value},validation V{value},test E{value} are disjoint. Which rows fit StandardScaler and SVC before validation predictions?"
        options = [f"Only T{value};use its saved scaler/model to transform and predict V{value};E{value} stays sealed", "Fit the scaler globally because no target labels are used", "Refit scaling on validation and fit SVC using test targets"]
        explanation = "Both learned scaling and SVC fitting use the current training partition. In CV,this means a fresh scaler/model inside each fold,not one outer-training scaler reused across inner folds."
    elif (lesson, objective) == (4, 2):
        violation = ["scaling all rows before CV", "choosing C by test accuracy", "choosing gamma by test errors", "reusing an outer-training scaler inside all inner CV folds", "computing scaling statistics from fold-validation rows"][variant]
        prompt = f"A team reports high SVM accuracy after {violation}. What is the safe response?"
        options = ["Reject the evaluation;refit every learned step inside each training fold and select on permitted development evidence before untouched test", "Accept because SVM margins erase preprocessing leakage", "Accept because an unsupervised scaler cannot leak information"]
        explanation = "Scaling uses distribution information and selection uses labels/metrics. Training-only once is not separately fold-only fitting. Test-guided C/gamma selection consumes the final evaluation;pipeline names do not repair invalid fit permissions."
    elif (lesson, objective) == (4, 3):
        kind = "slots"
        prompt = f"Repair workflow{value}:choose the permitted scaler/SVC fit scope and hyperparameter-selection scope. Only predefined complete repair tuples are accepted."
        explanation = "Fit the whole scaler/SVC pipeline on each fold-training set;use permitted validation/CV for selection,then freeze before final test. Equivalent authored scope names mean the same thing;test/global-fit fragments are not valid repairs."
    elif (lesson, objective) == (4, 4):
        strength, weight = [.5, 1., 2., .25, 3.][variant], [3., 2., 1.5, 4., 2.][variant]
        kind, expected = "number", strength * weight
        facts.update(strength=strength, weight=weight)
        prompt = f"C={strength},explicit positive-class weight={weight}. Calculate effective C_positive=C*weight,then explain what this changes. It is not a probability."
        explanation = "Class weighting multiplies the per-class hinge penalty,not class probabilities. Balanced weights must derive from current training-fold class counts;choose policies with permitted development evidence and appropriate error costs."
    elif (lesson, objective) == (5, 1):
        errors = [value, value + 1]
        prompt = f"Same validation rows:linear classifier errors={errors[0]},RBF errors={errors[1]}. RBF uses{value+3} support vectors. Which comparison is justified?"
        options = ["Compare the same-row errors and task costs;RBF query work includes kernels to supports,not a guarantee from tree/count or score size", "RBF must be better because it is nonlinear regardless of these errors", "The larger decision score is automatically the more accurate calibrated model"]
        explanation = "Use matching rows,targets and task metrics,plus inference/fit costs. RBF inference depends on support count and kernel work;linear weights can be consolidated. Mechanism and cost do not prove a universal winner."
    elif (lesson, objective) == (5, 2):
        claim = ["decision score2 means probability2", "sigmoid(SVM score) automatically calibrates every risk", "large margin guarantees unseen reliability under shift", "one validation win proves every subgroup is safe", "positive score guarantees a correct label"][variant]
        prompt = f"Evaluate this report:{claim}."
        options = ["Reject;distinguish decision output from calibrated probability and require relevant unseen/calibration/shift evidence", "Accept because margins certify true probabilities and all future outcomes", "Choose an attractive probability formula using final-test labels"]
        explanation = "A margin score ranks a fitted decision function,not calibrated P(class). Sigmoid alone is not fitted calibration. Shift,subgroups and finite validation samples limit reliability;no automatic confidence guarantee is justified."
    elif (lesson, objective) == (5, 3):
        prompt = f"A nonlinear SVC grows to{100*value} training rows and many support vectors. What resource/scaling limitation belongs in its report?"
        options = ["Kernel fitting can be costly and inference scales with support/kernel work;feature units and available resources still matter", "Kernel methods always have constant fitting and query cost", "A kernel score is an original-space geometric distance independent of feature units"]
        explanation = "Kernel storage/optimization can become expensive as data grow,and support count affects query work. RBF decision scores are not distances to a raw input-space straight line;scaling and population assumptions remain relevant."
    else:
        concern = ["a nearly linear churn pattern", "a small local nonlinear pattern", "a severe query-latency budget", "a need for readable rule partitions", "a shifted documentation population"][variant]
        prompt = f"For {concern},how should SVM,KNN,Logistic and tree candidates be compared?"
        options = ["Use matching split/target/metrics and relevant geometry,interpretability,cost and shift limits;no algorithm wins universally", "Choose SVM solely because its name implies maximum reliability", "Tune all candidates against the final test until one looks best"]
        explanation = "Compare assumptions and measured trade-offs:Logistic coefficient structure,KNN distances/tree partitions and SVM margins/kernels. Housing regression is a task-suitability contrast here,not authorization for an SVR or capstone implementation."
    return kind, prompt, expected, options, explanation, facts


def catalog():
    families = []
    for lesson in range(1, 6):
        for objective in range(1, 5):
            for variant, suffix in enumerate(["practice.A", "practice.B", "assessment.A", "assessment.B", "assessment.C"]):
                kind, prompt, expected, options, explanation, _ = case(lesson, objective, variant)
                identity = f"SV0{lesson}.O{objective}"
                if kind == "numbers":
                    atoms = [{"id": key, "kind": "number", "label": label} for key, label in [("score", "Linear score"), ("distance", "Signed geometric distance")]]
                    accepted = [[{"kind": "number", "value": number} for number in expected]]
                elif kind == "slots":
                    atoms = [{"id": "decision", "kind": "slots", "label": "Complete safe workflow", "slots": [{"id": "fit", "label": "Scaler/SVC fit scope", "options": [{"id": "fold_train", "label": "Current training fold"}, {"id": "fold_training_alias", "label": "Only this fold's training IDs"}, {"id": "test_fit", "label": "All rows including held-out data"}]}, {"id": "select", "label": "C/gamma selection scope", "options": [{"id": "development", "label": "Permitted validation/CV"}, {"id": "development_alias", "label": "Development folds only"}, {"id": "test_fit", "label": "Final-test feedback"}]}]}]
                    accepted = [[{"kind": "slots", "entries": [{"slotId": "fit", "optionId": fit}, {"slotId": "select", "optionId": select}]}] for fit in ["fold_train", "fold_training_alias"] for select in ["development", "development_alias"]]
                else:
                    atom = {"id": "decision", "kind": kind, "label": "Decision or calculation"}
                    answer = {"kind": "number", "value": expected} if kind == "number" else {"kind": "choice", "optionId": "supported"}
                    if kind == "choice":
                        choices = [{"id": key, "label": label} for key, label in zip(["supported", "confused", "unsafe"], options)]
                        atom["options"] = choices[variant % 3:] + choices[:variant % 3]
                    atoms, accepted = [atom], [[answer]]
                if objective == 2 or (lesson, objective) == (4, 4):
                    reasons = [{"id": "mechanism", "label": explanation}, {"id": "score", "label": "A good training score makes geometry,calibration and split boundaries irrelevant"}, {"id": "causal", "label": "A large margin guarantees every future outcome and permits test tuning"}]
                    atoms.append({"id": "reason", "kind": "choice", "label": "Mechanism and transfer explanation", "options": reasons[variant % 3:] + reasons[:variant % 3]})
                    for answers in accepted:
                        answers.append({"kind": "choice", "optionId": "mechanism"})
                families.append({"id": identity + "." + suffix, "objective": identity, "critical": objective == 2, "prompt": prompt, "code": "", "atoms": atoms, "accepted": accepted, "explanation": explanation, "remediation": f"Recall {identity}:{explanation} Compare the changed worked example,identify actual units/output type and fit IDs,and retry a whole independent form rather than patching earlier evidence."})
    return {"content": "supervised.svm.1.0.0", "families": families}
