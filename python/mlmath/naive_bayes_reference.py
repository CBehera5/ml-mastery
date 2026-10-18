"""Authored bounded NB exercises and trusted offline arithmetic, never learner execution."""
import math

PRIORS = [[.6, .4], [.2, .8], [.5, .5], [.8, .2], [.4, .6]]


def case(lesson, objective, variant):
    multiplier = variant + 1
    kind = "choice"
    expected = "supported"
    extra = None
    if (lesson, objective) == (1, 1):
        prior = PRIORS[variant]
        scores = [prior[0]*.5, prior[1]*.25]
        expected = scores[0]/sum(scores)
        kind = "number"
        prompt = f"Fictional documentation classes0=Good,1=Needs Improvement: priors{prior}, likelihoods[.5,.25]. Calculate posterior P(Good|evidence), not the likelihood."
        explanation = "Multiply each class prior by its evidence likelihood, then divide the class0 score by the sum of both scores. Conditioning is not intervention."
        options = []
    elif (lesson, objective) == (1, 2):
        prompt = f"In documentation cohort{multiplier}, two token signals are associated overall. Which Naive Bayes assumption is actually required?"
        options = ["Factor feature/token evidence conditional on the class; this is a simplifying assumption that may fail", "All features must be unconditionally independent in the population", "High training accuracy proves the features cause document quality"]
        explanation = "Naive refers to class-conditional evidence factorization, not independence of every observed feature. Repeated signals can double-count support even if classification accuracy looks good."
    elif (lesson, objective) == (1, 3):
        term = ["prior", "likelihood", "posterior", "likelihood", "prior"][variant]
        question = {"prior": "P(Needs Improvement) before this document's evidence", "likelihood": "P(observed token evidence | Needs Improvement)", "posterior": "P(Needs Improvement | observed token evidence)"}[term]
        prompt = f"A review team reports {question}. Name this quantity."
        options = [term, *[name for name in ["prior", "likelihood", "posterior"] if name != term]]
        explanation = "Prior precedes current evidence, likelihood conditions evidence on class, posterior conditions class on evidence. P(evidence|class) is not P(class|evidence)."
    elif (lesson, objective) == (1, 4):
        kind = "number"; expected = -1-2*multiplier-3*multiplier
        prompt = f"Log prior=-1 and two feature log likelihoods are{-2*multiplier},{-3*multiplier}. Compute the unnormalized class log score; do not multiply these logs or call it a posterior."
        options = []
        explanation = "Add log prior and feature log likelihoods. Stable log-sum-exp across class scores is still needed for posterior normalization; tiny raw products may underflow."
    elif (lesson, objective) == (2, 1):
        alpha = [1., .5, 2., 1., 2.][variant]
        total = 2+variant
        kind = "number"; expected = alpha/(total+2*alpha)
        prompt = f"Class token counts[{total},0], vocabulary size2, alpha{alpha}. Calculate the smoothed likelihood of the zero-count second token."
        options = []
        explanation = "Add alpha to the selected token count and alpha*V to the class token total. For counts[2,0],alpha1,V2, the zero-token probability is1/4. This is essential practice but not a critical gate."
    elif (lesson, objective) == (2, 2):
        invalid = "a token-count row[-1,2]" if variant % 2 == 0 else "a vocabulary built from training plus held-out document tokens before CV"
        prompt = f"A proposed Multinomial workflow uses {invalid}. Choose the valid response."
        options = ["Reject and repair the count representation or vocabulary provenance before fitting", "Keep it because a high accuracy score repairs invalid fitting", "Convert arbitrary signed continuous features to word counts without checking meaning"]
        explanation = "Token occurrences cannot be negative. Vocabulary is learned from permitted training documents and refitted separately inside each CV training fold; held-out tokens cannot define features. Gaussian continuous signals may be negative, but are not Multinomial counts."
    elif (lesson, objective) == (2, 3):
        prompt = f"A token appears zero times in class0 training documents in cohort{multiplier}, but occurs in a new document. What is justified?"
        options = ["Unsmoothed evidence may zero the class score; declared additive smoothing gives a positive token likelihood, not proof of calibration", "The token is impossible in real language forever", "Use held-out token counts to repair the training vocabulary"]
        explanation = "A missing class-token count is finite-sample absence, not logical impossibility. If every class score is zero the posterior is undefined, not uniform or class0."
    elif (lesson, objective) == (2, 4):
        kind = "number"; expected = (3+variant)/(5+variant)
        prompt = f"There are{3+variant} Good and2 Needs Improvement training documents; their token totals are20 and100. Compute the empirical Good class prior using documents, not tokens."
        options = []
        extra = ("Token denominator distinction", ["Word likelihood normalizes class token counts plus alpha*V, not class document counts", "Use20/120 as the Good document prior", "Document counts and token totals are interchangeable"])
        explanation = "Class prior uses number of labeled documents divided by all training documents. A word likelihood instead uses its class token count and the smoothed class token total."
    elif (lesson, objective) == (3, 1):
        variance = [1., .25, 4., 1., 4.][variant]
        kind = "number"; expected = 1/math.sqrt(2*math.pi*variance)
        prompt = f"At query0, class0 Gaussian mean0,variance{variance}; class1 mean0,variance{4*variance}. Calculate class0 density at0, then compare posterior class under priors[.6,.4]."
        options = []
        extra = ("Class density and prior comparison", ["Class0 has the larger prior-times-density score; density is not point probability", "Class1 must win because larger variance always means larger density", "A density greater than1 is always invalid"])
        explanation = "At the mean, density is1/sqrt(2*pi*variance). Class0 density is twice class1 here, so its prior-times-density score is larger. Densities can exceed1 and are not discrete probabilities."
    elif (lesson, objective) == (3, 2):
        counts = variant % 2 == 1
        representation = "nonnegative token-occurrence columns clear,error,example" if counts else "signed continuous centered clarity and structure measurements"
        prompt = f"Select a likelihood model for {representation}, explaining the feature meaning rather than merely its Python dtype."
        options = (["MultinomialNB for the declared token counts", "GaussianNB because every integer array is a continuous Gaussian signal", "Any model is valid if its API accepts the shape"] if counts else ["GaussianNB for continuous class-conditional density assumptions", "MultinomialNB because negative values are valid token occurrences", "Any model is valid if its API accepts the shape"])
        explanation = "Match likelihood assumptions to representation: nonnegative token counts versus continuous class-conditioned densities. An integer measurement is not automatically a word count, and numerical API acceptance is not statistical justification."
    elif (lesson, objective) == (3, 3):
        ratio = variant+2
        prompt = f"Equal priors and one signal give likelihood ratio{ratio}:1; duplicating that exact evidence gives{ratio**2}:1 under factorization. Which conclusion is supported?"
        options = ["Dominant-class confidence grows in this example, but the duplicate is not independent new evidence or proof of calibration", "Duplicating a token proves twice as much independent information", "Every correlated feature universally worsens all validation predictions"]
        explanation = f"The assumed dominant-class posterior changes from{ratio/(ratio+1):.6f} to{ratio**2/(ratio**2+1):.6f}. Repeated evidence can create overconfidence, especially when wrong; it does not establish calibrated probability or a universal error law."
    elif (lesson, objective) == (3, 4):
        global_variances = [[4., 1.], [9., 4.], [0., 0.], [1., .5], [16., 2.]][variant]
        kind = "number"; expected = .001*max(global_variances)
        prompt = f"A full GaussianNB fit has training-global population variances{global_variances},var_smoothing=.001. Compute its shared epsilon added to every class/feature variance."
        options = []
        explanation = "For the frozen sklearn full-fit convention,epsilon=var_smoothing*max(global training variance). This is not per-feature/sample variance or calibration. A globally constant dataset gives epsilon0 and can remain singular."
    elif (lesson, objective) == (4, 1):
        prompt = f"Repair cohort{multiplier}'s NB workflow before assessing unseen documentation. Which complete sequence preserves training permissions?"
        options = ["Fit vocabulary and model on each CV training fold; encode/infer held-out rows with saved state and aligned IDs", "Build vocabulary from all documents first, then call cross-validation safe", "Fit using future review labels before each query prediction"]
        explanation = "Each training fold learns its own vocabulary and likelihood parameters. Saved-state inference needs query features, not their labels. Keep prediction-time feature availability and row identities intact."
    elif (lesson, objective) == (4, 2):
        claim = ["accuracy90% proves well-calibrated probability90%", "a predictive token causes poor document quality", "confidence.99 guarantees future correctness", "good training accuracy proves unseen performance", "a tiny held-out sample certifies calibration under every future shift"][variant]
        prompt = f"A team claims: {claim}. Choose the evidence-based response."
        options = ["Reject the unsupported claim; inspect appropriate genuinely held-out probability/error evidence and disclose causal/shift limits", "Accept because accuracy, probability calibration and causality are the same", "Tune on final-test labels until the claim looks correct"]
        explanation = "Accuracy evaluates hard decisions, not calibration or interventions. Class-conditional probability modeling does not prove causes; unseen-data evidence must match the claim and cannot guarantee future shifted outcomes."
    elif (lesson, objective) == (4, 3):
        prompt = f"NB and Logistic are candidates for cohort{multiplier}. Which comparison can support a model choice without test leakage?"
        options = ["Same target window,aligned held-out IDs and costs; select within development/CV with fold-only preprocessing,then freeze before test", "Compare NB training accuracy with Logistic test log loss on unrelated rows", "Select the winner by repeatedly inspecting final-test results"]
        explanation = "Generative likelihood factorization and a linear logit are different mechanisms. Compare matching rows,metrics and costs with training-fold provenance,not incomparable scores or a universal model ranking."
    else:
        actual_positive = variant % 2 == 1
        prompt = f"A held-out document's actual class is{int(actual_positive)} and predicted class is{int(not actual_positive)} (1=Needs Improvement). Interpret the error and its future relevance."
        options = (["False negative: missed needed improvement; describe its cost and possible future distribution shift", "False positive: actual positive means it was Good", "One error proves every future cohort has the same error rate"] if actual_positive else ["False positive: unnecessary improvement review; describe its cost and possible future distribution shift", "False negative: actual0 means Needs Improvement", "One error proves every future cohort has the same error rate"])
        explanation = "Name the positive class before interpreting errors: FP flags a Good document, FN misses a Needs Improvement document. Costs and prevalence matter; tiny observed samples do not guarantee future rates."
    return kind, prompt, expected, options, explanation, extra


def catalog():
    families = []
    for lesson in range(1, 5):
        for objective in range(1, 5):
            for variant in range(5):
                kind, prompt, expected, options, explanation, extra = case(lesson, objective, variant)
                identity = f"NB0{lesson}.O{objective}"
                suffix = ["practice.A", "practice.B", "assessment.A", "assessment.B", "assessment.C"][variant]
                atoms = [{"id": "decision", "kind": kind, "label": "Decision or calculation"}]
                accepted = [{"kind": kind, **({"value": expected} if kind == "number" else {"optionId": expected})}]
                if kind == "choice":
                    choices = [{"id": identity, "label": text} for identity, text in zip(["supported", "confused", "unsafe"], options)]
                    atoms[0]["options"] = choices[variant % 3:]+choices[:variant % 3]
                if objective == 2 or extra:
                    label, texts = extra if extra else ("Mechanism and changed-case explanation", [explanation, "A high training score validates this claim regardless of data provenance", "Accuracy proves causal effects and calibrated probabilities"])
                    choices = [{"id": identity, "label": text} for identity, text in zip(["mechanism", "score", "causal"], texts)]
                    atoms.append({"id": "reason", "kind": "choice", "label": label, "options": choices[variant % 3:]+choices[:variant % 3]})
                    accepted.append({"kind": "choice", "optionId": "mechanism"})
                families.append({"id": identity+"."+suffix, "objective": identity, "critical": objective == 2, "prompt": prompt, "code": "", "atoms": atoms, "accepted": [accepted],
                                 "explanation": explanation, "remediation": f"Recall {identity}: {explanation} Compare the changed worked case,then use a fresh complete form rather than patching earlier evidence."})
    return {"content": "supervised.naive-bayes.1.0.0", "families": families}
