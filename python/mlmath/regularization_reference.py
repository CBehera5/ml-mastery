"""Trusted offline regularization exercise authoring; no learner programs are accepted."""
import itertools
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def case(lesson, objective, variant):
    amount = variant + 1
    context = ["A small housing sample", "A new district housing sample", "A held-out housing development sample", "A housing sample with changed units", "A new correlated housing feature set"][variant]
    prefix = context + ": "
    if lesson == 1:
        cases = [
            ("choice", "two correlated columns have large opposing coefficients but similar predictions. What is unstable?", "Individual coefficients may be weakly identified even when predictions are similar", "Similar predictions do not uniquely establish which correlated feature matters", ["The larger coefficient proves the feature causes price", "Accurate training predictions guarantee stable individual coefficients"]),
            ("choice", "a fit has lower penalized objective. Does that guarantee smaller validation error?", "No: separate residual loss and penalty, then compare unseen-row errors", "The training objective expresses a preference; generalization must be evaluated on permitted unseen data", ["Yes: the penalty term is validation error", "Compare penalized objectives with different normalizations as if they were MAE"]),
            ("number", f"w=({amount},−2), intercept10. Calculate L1+L2-squared, excluding intercept.", amount + 2 + amount ** 2 + 4, "L1 sums absolute coefficients; squared L2 sums their squares; intercept is unpenalized", []),
            ("choice", "when may the scaler learn its mean and variance?", "Only from the current training rows, separately inside each CV training fold", "Scaling is learned preprocessing; held-out feature values must not influence its fitted statistics", ["From all rows because scaling does not use target labels", "Fit a new scaler on each prediction row"]),
        ]
    elif lesson == 2:
        cases = [
            ("number", f"Ridge SSE4, alpha={amount}, w=(1,−2), unpenalized intercept10. Compute its objective.", 4 + amount * 5, "Ridge uses SSE+alpha times squared L2; squared norm5; do not divide data loss by2n here", []),
            ("choice", "does L2 regularization generally eliminate features exactly?", "No: it shrinks coefficients; special zero-signal cases can be zero", "A small or rounded coefficient is not an exact-zero feature-selection guarantee", ["Yes: every positive alpha sets a coefficient exactly to zero", "A displayed zero always proves exact elimination"]),
            ("choice", "a frozen Ridge path has smaller coefficient-vector norm at larger alpha. What follows?", "Stronger penalty trades training fit for smaller norm; validation may improve or worsen", "Read the actual held-out errors; individual coordinates and validation error need not vary monotonically", ["Every individual coefficient and validation error must decrease monotonically", "Increasing alpha guarantees better predictions in a new population"]),
            ("choice", "compare Ridge to existing unregularized regression.", "Compare the same development rows and metric, including the baseline", "A penalty may reduce variance or increase bias; regularization can hurt when shrinkage is excessive", ["Ridge must dominate unregularized regression", "Select whichever has the smaller training objective despite different definitions"]),
        ]
    elif lesson == 3:
        cases = [
            ("number", f"Lasso n=2, SSE4, alpha=.5, w=({amount},−2), intercept10. Compute objective.", 1 + .5 * (amount + 2), "Lasso uses SSE/(2n)+alpha times L1; intercept is excluded", []),
            ("choice", "a converged Lasso coefficient equals0. What is supported?", "Conditional sparsity for this fitted model, not proof of causal irrelevance", "Correlated alternatives, scaling or alpha can alter selection; zero is not a causal judgment", ["The feature has no real-world effect", "The same feature must remain zero in all resamples"]),
            ("choice", "swap two correlated columns and their names consistently. What must comparison preserve?", "Align coefficients with feature names before comparing predictions and selection", "Column order alone is not changed semantics; similar correlated columns can redistribute weights in other samples", ["Compare positions without names and infer changed causal importance", "A swapped column guarantees a different prediction"]),
            ("choice", "an authored fit reports ConvergenceWarning and an excessive dual gap. What can be claimed?", "Do not treat it as a verified optimum; inspect scaling, settings and convergence", "A numeric coefficient vector is not a convergence certificate; report the warning and repair before relying on it", ["The printed coefficients prove convergence", "Replace uncertain coefficients with zeros and call the solution sparse"]),
        ]
    elif lesson == 4:
        cases = [
            ("number", f"Elastic Net alpha=1,q=.5,w=({amount},2). Compute the penalty only.", .5 * (amount + 2) + .25 * (amount ** 2 + 4), "Penalty is alpha*q*L1 + alpha*(1−q)*L2-squared/2, without the data-loss term", []),
            ("choice", "what do alpha and q control in Elastic Net?", "Alpha controls overall penalty; q mixes L1 and L2 contributions", "Mixing penalties is not averaging final predictions; equal alpha across Ridge and normalized objectives is not equivalent strength", ["q averages two already fitted predictions", "Equal numeric alpha is the same penalty strength in every solver"]),
            ("choice", f"finite candidates q=.25/.5/.75 have same-fold CV MAE [{amount+2},{amount},{amount+1}]. Select the minimum-error candidate.", ".5", "Use development-fold evidence to select q; keep final-test feedback out of the choice", [".25", ".75"]),
            ("choice", "does mixing L1 and L2 guarantee a better or more stable model?", "No: compare held-out error, conditional sparsity and stability on the same protocol", "Elastic Net can help correlated groups but is not universally superior; preserve normalization and convergence caveats", ["Elastic Net always beats both endpoints", "Equal coefficient magnitude proves equal feature importance"]),
        ]
    elif lesson == 5:
        cases = [
            ("choice", "fold training IDs h1,h2; held-out h3; external validation v1. Which fit trace is valid?", "Scaler and estimator fit h1,h2; transform h3 with that saved scaler", "Fit inside each fold, not once globally before CV; no external validation in fitted statistics", ["Scaler fits h1,h2,h3 while estimator fits h1,h2", "Refit the scaler on h3 before predicting"]),
            ("choice", "global scaling or feature selection precedes CV. Is the candidate selection valid?", "No: fit learned preprocessing/selection only on each fold training set", "Held-out information can leak without target fitting; select within development boundaries then freeze before final test", ["Yes: only target fitting can leak information", "Use final-test scores to choose the safest alpha"]),
            ("slots", "Repair the whole CV pipeline order using the supplied finite slots.", None, "Scale inside fold training, then fit the estimator; pass the whole unfitted pipeline into CV", []),
            ("choice", "a pure-L2 q=0 ElasticNet fit returns a vector with a warning. What is safe?", "Use dedicated Ridge with declared normalization and verify convergence", "Matching objective endpoints is not a solver-support guarantee; do not silently equate alpha conventions", ["All endpoint solvers are numerically interchangeable", "Ignore warnings because the mathematical objective is convex"]),
        ]
    else:
        cases = [
            ("number", f"standardized coefficient={3*amount}, training scale3 raw units. Calculate raw slope.", amount, "Divide standardized coefficient by training scale; full intercept also needs the centering correction", []),
            ("choice", "a raw coefficient is larger than another. Does that establish scale-free causal importance?", "No: restore units and account for correlated features and observational limits", "Changing units changes coefficients without changing predictions; regression association is not an intervention effect", ["Yes: the largest raw coefficient causes the largest price change", "Regularization makes observational coefficients causal"]),
            ("choice", "candidate A has lower CV MAE but denser coefficients than B. What should be reported?", "Compare error, sparsity and stability separately, with the evaluation protocol", "These criteria answer different questions; sparsity alone does not establish better unseen predictions", ["Always choose the sparsest model regardless of error", "Choose by training objective alone"]),
            ("choice", "two models have similar development errors on a small fictional dataset. What is defensible?", "Prefer an adequate simpler model with uncertainty and deployment caveats", "A small development difference is not universal superiority; document selection, support and final-test permission", ["Claim universal superiority and causal interpretation", "Repeatedly inspect the final test until a clear winner appears"]),
        ]
    kind, prompt, answer, why, distractors = cases[objective - 1]
    return kind, prefix + prompt, answer, why, distractors


def catalog():
    families = []
    for lesson, objective, variant in itertools.product(range(1, 7), range(1, 5), range(5)):
        kind, prompt, expected, why, distractors = case(lesson, objective, variant)
        mode, form = ("practice", "AB"[variant]) if variant < 2 else ("assessment", "ABC"[variant - 2])
        identity = f"RG{lesson:02}.O{objective}"
        decision = {"id": "decision", "kind": kind, "label": "Decision or calculation"}
        if kind == "choice":
            options = [{"id": "supported", "label": expected}] + [{"id": f"wrong{index}", "label": label} for index, label in enumerate(distractors)]
            shift = (lesson + objective + variant) % 3
            decision["options"] = options[shift:] + options[:shift]
            accepted = [[{"kind": "choice", "optionId": "supported"}]]
        elif kind == "number":
            accepted = [[{"kind": "number", "value": expected}]]
        else:
            options = [{"id": token, "label": label} for token, label in [("scale", "Fold-training StandardScaler fit"), ("scale_alias", "The identical fold-training scaler fit (alias)"), ("model", "Estimator fit on the same fold training rows"), ("test_fit", "Fit using final-test rows")]]
            decision["slots"] = [{"id": f"step{index+1}", "label": f"Pipeline step{index+1}", "options": options} for index in range(2)]
            accepted = [[{"kind": "slots", "entries": [{"slotId": "step1", "optionId": token}, {"slotId": "step2", "optionId": "model"}]}] for token in ["scale", "scale_alias"]]
        atoms = [decision]
        if objective == 2:
            reasons = [{"id": "mechanism", "label": why}, {"id": "shortcut", "label": "A good training score proves stable coefficients, causal importance and valid held-out evaluation."}]
            if variant % 2:
                reasons.reverse()
            atoms.append({"id": "reason", "kind": "choice", "label": "Explain the mechanism or protected boundary", "options": reasons})
            accepted = [answer + [{"kind": "choice", "optionId": "mechanism"}] for answer in accepted]
        families.append({"id": f"{identity}.{mode}.{form}", "objective": identity, "critical": objective == 2, "prompt": prompt, "code": "", "atoms": atoms, "accepted": accepted, "explanation": why, "remediation": f"Recall RG{lesson:02}.O{objective} and its changed-condition example. " + why})
    return {"content": "supervised.regularization.1.0.0", "families": families}


if __name__ == "__main__":
    print(json.dumps(catalog(), ensure_ascii=False, sort_keys=True, allow_nan=False, indent=2))
