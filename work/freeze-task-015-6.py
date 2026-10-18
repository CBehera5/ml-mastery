"""Trusted offline NB reference authoring; no learner input or application execution."""
import hashlib
import importlib.metadata
import inspect
import json
import math
import platform
import sys
import warnings
from pathlib import Path

import numpy as np
from scipy.special import logsumexp
from scipy.stats import norm
from sklearn.metrics import brier_score_loss
from sklearn.naive_bayes import GaussianNB, MultinomialNB

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/verification/naive-bayes"
PROFILE = {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn", "scipy"]}
assert platform.python_version() == "3.13.16"
assert PROFILE == {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}


def encode(value):
    return (json.dumps(value, sort_keys=True, indent=2, allow_nan=False) + "\n").encode()


def sha(value):
    return hashlib.sha256(value).hexdigest()


def close(actual, expected):
    assert np.allclose(actual, expected, atol=1e-9, rtol=1e-9), (actual, expected)


def tag_number(value):
    if math.isnan(float(value)):
        return {"tag": "undefined", "reason": "library-nan-not-a-posterior"}
    if math.isinf(float(value)):
        return {"tag": "infinity", "sign": "positive" if value > 0 else "negative"}
    return float(value)


def normalize(log_scores):
    maximum = max(log_scores)
    if maximum == -math.inf:
        return {"status": "undefined", "reason": "all-class-evidence-zero", "posterior": None, "prediction": None}
    shifted_sum = sum(math.exp(score - maximum) for score in log_scores)
    denominator_log = maximum + math.log(shifted_sum)
    log_posterior = [score - denominator_log for score in log_scores]
    posterior = [math.exp(value) for value in log_posterior]
    close(denominator_log, logsumexp(log_scores))
    close(sum(posterior), 1)
    return {"status": "defined", "log_normalizer": denominator_log,
            "log_posterior": [tag_number(value) for value in log_posterior], "posterior_float64": posterior,
            "prediction": int(log_scores[1] > log_scores[0]),
            "underflowed_positive_components": [index for index, value in enumerate(posterior) if value == 0 and math.isfinite(log_scores[index])]}


COUNT_ROWS = [[2, 0, 1], [1, 0, 2], [3, 0, 0], [0, 2, 1], [0, 1, 2], [0, 3, 0]]
LABELS = [0, 0, 0, 1, 1, 1]
VOCABULARY = ["clear", "error", "example"]
COUNT_QUERIES = [[2, 0, 0], [0, 2, 1], [0, 0, 0]]
GAUSSIAN_ROWS = [[-3, -2], [-2, -1], [-1, 0], [0, -1], [1, 0], [2, 1]]
GAUSSIAN_QUERIES = [[-1.5, -1], [0, -1.5], [1000, 1000]]


def count_fixture():
    documents = [[token for token, count in zip(VOCABULARY, row) for _ in range(count)] for row in COUNT_ROWS]
    assert sorted({token for document in documents for token in document}) == VOCABULARY
    assert [[document.count(token) for token in VOCABULARY] for document in documents] == COUNT_ROWS
    query_tokens = [["clear", "clear"], ["error", "error", "example"], ["unseen"]]
    assert [[document.count(token) for token in VOCABULARY] for document in query_tokens] == COUNT_QUERIES
    return {"id": "nb.count.documents.v1", "training_rows": COUNT_ROWS, "training_labels": LABELS,
            "training_document_tokens": documents, "vocabulary": VOCABULARY,
            "feature_semantics": "Token occurrences, not document frequencies; vocabulary sorted from training tokens only.",
            "queries": COUNT_QUERIES, "query_tokens": query_tokens,
            "unknown_policy": "Ignore tokens absent from frozen training vocabulary; report unknown count. Unknown-only query is empty evidence, not impossible evidence.",
            "query_unknown_counts": [0, 0, 1], "training_ids": [f"nb-count-train-{index}" for index in range(6)],
            "development_ids": [f"nb-count-dev-{index}" for index in range(3)]}


def count_state(alpha, prior_mode, query_index):
    rows = np.array(COUNT_ROWS, dtype=np.float64)
    priors = [0.5, 0.5] if prior_mode == "empirical" else [0.7, 0.3]
    model = MultinomialNB(alpha=alpha, force_alpha=True, fit_prior=True, class_prior=None if prior_mode == "empirical" else priors).fit(rows, LABELS)
    totals = [[sum(row[column] for row, label in zip(COUNT_ROWS, LABELS) if label == category) for column in range(3)] for category in [0, 1]]
    likelihoods = [[(value + alpha)/(sum(category) + alpha*3) for value in category] for category in totals]
    query = COUNT_QUERIES[query_index]
    contributions = [[count*math.log(probability) for count, probability in zip(query, category)] for category in likelihoods]
    scores = [math.log(prior) + sum(category) for prior, category in zip(priors, contributions)]
    result = normalize(scores)
    close(model.feature_count_, totals)
    close(model.class_count_, [3, 3])
    close(np.exp(model.class_log_prior_), priors)
    close(np.exp(model.feature_log_prob_), likelihoods)
    close(model.predict_log_proba([query])[0], [float(value) for value in result["log_posterior"]])
    close(model.predict_proba([query])[0], result["posterior_float64"])
    assert int(model.predict([query])[0]) == result["prediction"]
    assert model.classes_.tolist() == [0, 1]
    return {"id": f"NB-E1.count.a{alpha}.{prior_mode}.q{query_index}.v1", "kind": "fitted-multinomial", "fixture_id": "nb.count.documents.v1",
            "controls": {"alpha": alpha, "prior_mode": prior_mode, "query_index": query_index},
            "expected": {"class_document_counts": [3, 3], "class_token_counts": totals, "class_token_totals": [sum(category) for category in totals],
                         "priors": priors, "feature_likelihoods": likelihoods, "log_feature_likelihoods": np.log(likelihoods).tolist(),
                         "query_log_contributions": contributions, "log_class_scores": scores, "unknown_tokens_ignored": int(query_index == 2), **result},
            "explanation": "Multiply token likelihoods once per occurrence (or add their logs) with class priors, then normalize. Alpha smooths class-token counts, not document counts. Empty known evidence leaves the prior; ignoring an unknown token does not prove it uninformative in reality.",
            "counterexample": "The same document count prior can coexist with different token totals. Never substitute number of documents for a token denominator or fit vocabulary on held-out text."}


def supplied_state(index, priors, likelihoods):
    scores = [prior*likelihood for prior, likelihood in zip(priors, likelihoods)]
    logs = [math.log(score) if score else -math.inf for score in scores]
    result = normalize(logs)
    if sum(scores):
        close(result["posterior_float64"], np.array(scores)/sum(scores))
    return {"id": f"NB-E1.supplied.{index}.v1", "kind": "supplied-bayes-not-fitted", "fixture_id": f"nb.supplied.{index}.v1",
            "controls": {"prior": priors, "likelihood": likelihoods},
            "expected": {"priors": priors, "likelihoods": likelihoods, "class_scores": scores, "log_class_scores": [tag_number(value) for value in logs], **result},
            "explanation": "A likelihood conditions evidence on a class; the posterior reverses that conditioning using the prior and normalization. This supplied arithmetic is not claimed to be a fitted classifier.",
            "counterexample": "A predictive evidence update is not an intervention or causal quality effect. A zero supplied prior excludes a class here; all-zero evidence instead has undefined normalization."}


def gaussian_state(duplicated, smoothing, prior_mode, query_index):
    rows = [row + [row[0]] if duplicated else row for row in GAUSSIAN_ROWS]
    query = GAUSSIAN_QUERIES[query_index] + ([GAUSSIAN_QUERIES[query_index][0]] if duplicated else [])
    priors = [.5, .5] if prior_mode == "empirical" else [.7, .3]
    model = GaussianNB(priors=None if prior_mode == "empirical" else priors, var_smoothing=smoothing).fit(rows, LABELS)
    dimensions = len(query)
    means = [[sum(row[column] for row, label in zip(rows, LABELS) if label == category)/3 for column in range(dimensions)] for category in [0, 1]]
    variances = [[sum((row[column]-means[category][column])**2 for row, label in zip(rows, LABELS) if label == category)/3 for column in range(dimensions)] for category in [0, 1]]
    global_mean = [sum(row[column] for row in rows)/6 for column in range(dimensions)]
    global_variance = [sum((row[column]-global_mean[column])**2 for row in rows)/6 for column in range(dimensions)]
    epsilon = smoothing * max(global_variance)
    effective = [[value+epsilon for value in category] for category in variances]
    log_likelihoods = [[-.5*math.log(2*math.pi*variance)-(value-mean)**2/(2*variance) for value, mean, variance in zip(query, category_mean, category_var)] for category_mean, category_var in zip(means, effective)]
    scores = [math.log(prior)+sum(category) for prior, category in zip(priors, log_likelihoods)]
    result = normalize(scores)
    close(model.theta_, means); close(model.var_, effective); close(model.epsilon_, epsilon); close(model.class_prior_, priors)
    close(log_likelihoods, norm.logpdf(np.array(query)[None, :], loc=means, scale=np.sqrt(effective)))
    close(model.predict_proba([query])[0], result["posterior_float64"])
    close(model.predict_log_proba([query])[0], result["log_posterior"])
    assert int(model.predict([query])[0]) == result["prediction"]
    assert model.classes_.tolist() == [0, 1]
    target = [1, 0, 1][query_index]
    close((result["posterior_float64"][1]-target)**2, brier_score_loss([target], [result["posterior_float64"][1]], pos_label=1))
    return {"id": f"NB-E2.gaussian.{'duplicate' if duplicated else 'base'}.v{smoothing}.{prior_mode}.q{query_index}.v1", "kind": "fitted-gaussian", "fixture_id": "nb.gaussian.duplicate.v1" if duplicated else "nb.gaussian.base.v1",
            "controls": {"duplicate_first_feature": duplicated, "var_smoothing": smoothing, "prior_mode": prior_mode, "query_index": query_index},
            "expected": {"priors": priors, "class_means": means, "population_class_variances": variances, "global_training_variances": global_variance,
                         "epsilon": epsilon, "effective_class_variances": effective, "log_feature_densities": log_likelihoods,
                         "density_float64": [[math.exp(value) for value in category] for category in log_likelihoods],
                         "log_class_scores": scores, **result, "development_label": target,
                         "positive_brier_error": (result["posterior_float64"][1]-target)**2,
                         "stable_label_log_loss": -float(result["log_posterior"][target])},
            "explanation": "Gaussian NB fits population class variances plus one training-global epsilon. Duplicating the first feature refits a separate model and counts the same evidence twice under the independence assumption. A confident vote is not calibrated reliability; inspect the displayed held-out label and probability error.",
            "counterexample": "The first development label intentionally contradicts the locally favored class. Duplicating evidence can increase confidence in that wrong class. These fictional individual errors do not measure population calibration or prove every correlated feature worsens performance."}


def gaussian_fixture(duplicated):
    return {"id": "nb.gaussian.duplicate.v1" if duplicated else "nb.gaussian.base.v1", "training_rows": [row+[row[0]] if duplicated else row for row in GAUSSIAN_ROWS],
            "training_labels": LABELS, "features": ["centered_clarity_signal", "centered_structure_signal"]+(["repeated_clarity_signal"] if duplicated else []),
            "units": "Fictional dimensionless continuous signals; negative values valid, not token counts.",
            "queries": [row+[row[0]] if duplicated else row for row in GAUSSIAN_QUERIES], "development_labels": [1, 0, 1],
            "training_ids": [f"nb-gauss-train-{index}" for index in range(6)], "development_ids": [f"nb-gauss-dev-{index}" for index in range(3)]}


def diagnostics():
    with pytest_free_warnings() as observed:
        degenerate = MultinomialNB(alpha=0, force_alpha=True).fit([[2, 0], [1, 0], [0, 2], [0, 1]], [0, 0, 1, 1])
        library = degenerate.predict_proba([[1, 1], [0, 0]])
    assert np.isnan(library).all()
    try:
        MultinomialNB().fit([[-1, 0], [1, 1]], [0, 1])
    except ValueError:
        pass
    else:
        raise AssertionError("Negative count accepted")
    with pytest_free_warnings() as gaussian_warnings:
        zero = GaussianNB(var_smoothing=1e-9).fit([[1], [1], [1], [1]], [0, 0, 1, 1])
        zero_output = zero.predict_proba([[1]])
    assert zero.epsilon_ == 0 and np.isnan(zero_output).all()
    smooth = GaussianNB(var_smoothing=1e-3).fit([[0], [0], [2], [2]], [0, 0, 1, 1])
    close(smooth.epsilon_, .001); close(smooth.var_, [[.001], [.001]])
    close(smooth.predict_proba([[1]])[0], [.5, .5])
    with pytest_free_warnings():
        unsmoothed = GaussianNB(var_smoothing=0).fit([[0], [0], [2], [2]], [0, 0, 1, 1])
        assert np.isnan(unsmoothed.predict_proba([[1]])).all()
    density_log = -.5*math.log(2*math.pi*.001)-1/(2*.001)
    close(norm.logpdf(1, loc=[0, 2], scale=math.sqrt(.001)), [density_log, density_log])
    return {"alpha0_library_posteriors": [[tag_number(value) for value in row] for row in library],
            "alpha0_warning_categories": sorted({warning.category.__name__ for warning in observed}),
            "global_constant_epsilon": float(zero.epsilon_), "global_constant_library_posterior": [tag_number(value) for value in zero_output[0]],
            "global_constant_warning_categories": sorted({warning.category.__name__ for warning in gaussian_warnings}),
            "zero_class_variance_positive_global_variance": {"status": "defined", "priors": [.5, .5], "class_means": [[0], [2]], "population_class_variances": [[0], [0]], "epsilon": float(smooth.epsilon_), "effective_class_variances": smooth.var_.tolist(), "log_feature_densities": [[density_log], [density_log]], "density_float64": [[math.exp(density_log)], [math.exp(density_log)]], "log_class_scores": [math.log(.5)+density_log]*2, **normalize([math.log(.5)+density_log]*2)},
            "negative_count_library_rejected": True}


def pytest_free_warnings():
    context = warnings.catch_warnings(record=True)
    return context


def reject(identity, fixture, reason):
    return {"id": identity, "kind": "rejected-diagnostic", "fixture_id": fixture, "controls": {"diagnostic": identity},
            "expected": {"status": "rejected", "prediction": None, "posterior": None, "reason": reason},
            "explanation": reason, "counterexample": "A library may accept provenance-blind data or emit NaN; neither is permission to invent a defined educational posterior or a class0 answer."}


def manifest(identity, objectives, fixtures, states, question):
    assert len(states) <= 64 and len({state["id"] for state in states}) == len(states)
    for fixture in fixtures:
        if "training_rows" in fixture and "training_ids" not in fixture:
            fixture["training_ids"] = [f"{fixture['id']}.train.{index}" for index in range(len(fixture["training_rows"]))]
    for state in states:
        expected = state["expected"]
        state["correct_prediction"] = "Reject configuration" if expected.get("status") == "rejected" else "Undefined evidence normalization" if expected.get("status") == "undefined" else f"Class{expected['prediction']}"
        state["correct_reason_id"] = "boundary" if expected.get("status") in ["rejected", "undefined"] else "normalize"
    return {"schema": "supervised.naive-bayes.experiment.v1", "id": identity, "version": "1.0.0", "objectives": objectives,
            "learning_goals": ["Distinguish prior, likelihood and posterior; normalize class-conditional evidence", "Explain conditional independence as an assumption, not causality", "Distinguish token smoothing from document-count priors"] if identity == "NB-E1" else ["Choose continuous density versus count likelihood assumptions", "Explain population variance and training-global epsilon", "Inspect repeated-evidence confidence and held-out probability errors without claiming calibration"],
            "related_objective_ids": [f"{lesson}.O{number}" for lesson in objectives for number in range(1, 5)],
            "learning_question": question, "prerequisites": ["Conditional probability and Bayes", "EV", "LG01–03", "Training-only/fold-only fitting", "Array row alignment"],
            "labels": {"0": "Good", "1": "Needs Improvement (positive class)"},
            "provenance": "Wholly fictional human-label placeholders for teaching, not production labels or LLM ground truth. No data collection.",
            "fixtures": fixtures, "configurations": states, "allowed_configuration_ids": [state["id"] for state in states],
            "controls": "Only complete listed configuration tuples; no unrestricted text, counts, queries, priors, alpha, variances or Cartesian expansion.",
            "prediction_options": ["Class0", "Class1", "Undefined evidence normalization", "Reject configuration"],
            "reason_options": [{"id": "normalize", "label": "Normalize class-conditional evidence with the declared prior and representation"}, {"id": "boundary", "label": "Invalid representation/variance/provenance or zero evidence prevents a defined prediction"}, {"id": "causal", "label": "Accuracy proves causal effects and calibrated confidence"}],
            "comparison": "NB combines assumed class-conditional likelihoods; existing Logistic models a linear logit. Compare on identical unseen rows and costs, not unrelated accuracy figures. No new Logistic fitting or calibration algorithm is introduced by this manifest.",
            "interaction": "Record prediction and bounded reason before reveal; show fixture inputs first, then numerical/text evidence. Change one listed configuration and explain a changed transfer case. Wrong initial predictions can recover. No experiment credit awards mastery.",
            "accessibility": "Native labeled selects/buttons, visible keyboard focus, reduced motion and320px reflow. Read priors, token/density/log contributions, normalizer, posterior, predicted class or tagged rejection/undefined reason in a numerical table plus explanation. Curves/bars are redundant; no hover/color/spatial-only meaning. Extreme float underflow is explicitly distinguished from mathematical zero."}


def generate():
    edges = diagnostics()
    first = [count_state(alpha, prior, query) for alpha in [.5, 1., 2.] for prior in ["empirical", "good70"] for query in range(3)]
    supplied = [([.6, .4], [.5, .25]), ([.2, .8], [.5, .25]), ([.5, .5], [.25, .25]), ([0., 1.], [.5, .25])]
    first += [supplied_state(index, priors, likelihoods) for index, (priors, likelihoods) in enumerate(supplied)]
    first.append(supplied_state("allzero", [.5, .5], [0., 0.]))
    first += [reject("NB-E1.reject.negative-count.v1", "nb.count.negative.v1", "Negative token counts are invalid; signed continuous values belong to a different representation."),
              reject("NB-E1.reject.heldout-vocabulary.v1", "nb.count.heldout-vocabulary.v1", "Vocabulary must be constructed inside training and separately per training fold; held-out tokens cannot define it."),
              reject("NB-E1.reject.alpha0-conflict.v1", "nb.count.alpha0.v1", "Unsmoothed class-exclusive token evidence gives all classes zero likelihood here; undefined posterior, not uniform. Library alpha0 also emits NaN for an empty query because its dense dot includes zero times negative infinity.")]
    second = [gaussian_state(duplicate, smoothing, prior, query) for duplicate in [False, True] for smoothing in [1e-9, .1] for prior in ["empirical", "good70"] for query in range(3)]
    density_fixtures = []
    for index, densities in enumerate([[.5, .25], [float(norm.pdf(0, scale=.1)), float(norm.pdf(0, scale=.2))]]):
        variances = [1/(2*math.pi*density*density) for density in densities]
        close(norm.pdf(0, loc=[0, 0], scale=np.sqrt(variances)), densities)
        state = supplied_state(f"density{index}", [.6, .4], densities)
        state.update(id=f"NB-E2.supplied-density.{index}.v1", kind="supplied-gaussian-density-not-fitted", fixture_id=f"nb.gaussian.density.{index}.v1")
        state["explanation"] = "Gaussian densities can exceed1; they are not probability masses at an exact point. Normalize prior times class-conditional density; this is supplied-density arithmetic, not a fitted estimator."
        density_fixtures.append({"id": state["fixture_id"], "query": [0], "class_means": [[0], [0]], "class_population_variances": [[variances[0]], [variances[1]]], "priors": [.6, .4], "var_smoothing": "not applied to supplied mathematical densities"})
        second.append(state)
    second.append({"id": "NB-E2.zero-class-variance.smoothed.v1", "kind": "fitted-gaussian-zero-class-variance", "fixture_id": "nb.gaussian.zero-class.v1", "controls": {"var_smoothing": .001},
                   "expected": edges["zero_class_variance_positive_global_variance"], "explanation": "Zero class variance is rescued here because training-global variance is positive; epsilon=.001. This would not rescue a globally constant dataset.", "counterexample": "Positive var_smoothing times zero global variance still gives zero epsilon."})
    second += [reject("NB-E2.reject.count-representation.v1", "nb.gaussian.base.v1", "These signed continuous signals are not valid Multinomial token counts; choose Gaussian assumptions, not a coercion."),
               reject("NB-E2.reject.zero-variance.v1", "nb.gaussian.zero-class.v1", "Zero variance with var_smoothing0 has no valid Gaussian density; no posterior is exposed."),
               reject("NB-E2.reject.global-constant.v1", "nb.gaussian.global-constant.v1", "All training variances are zero, so even positive var_smoothing leaves epsilon0; reject rather than display NaN as a probability.")]
    assert len(first) == 26 and len(second) == 30
    count_extra = [{"id": f"nb.supplied.{index}.v1", "priors": priors, "likelihoods": likelihoods} for index, (priors, likelihoods) in enumerate(supplied)]
    count_extra += [{"id": "nb.supplied.allzero.v1", "priors": [.5, .5], "likelihoods": [0, 0]},
                    {"id": "nb.count.negative.v1", "query": [-1, 2, 0]},
                    {"id": "nb.count.heldout-vocabulary.v1", "training_vocabulary": VOCABULARY, "forbidden_candidate_vocabulary": VOCABULARY+["unseen"], "forbidden_fit_ids": ["nb-count-dev-2"]},
                    {"id": "nb.count.alpha0.v1", "training_rows": [[2, 0], [1, 0], [0, 2], [0, 1]], "training_labels": [0, 0, 1, 1], "alpha": 0, "force_alpha": True, "queries": [[1, 1], [0, 0]]}]
    gaussian_extra = [{"id": "nb.gaussian.zero-class.v1", "training_rows": [[0], [0], [2], [2]], "training_labels": [0, 0, 1, 1], "query": [1], "allowed_smoothing": [.001, 0]},
                      {"id": "nb.gaussian.global-constant.v1", "training_rows": [[1], [1], [1], [1]], "training_labels": [0, 0, 1, 1], "query": [1], "var_smoothing": 1e-9}]
    labs = [manifest("NB-E1", ["NB01", "NB02"], [count_fixture()]+count_extra, first, "How do priors, word evidence and additive smoothing change a documentation class posterior?"),
            manifest("NB-E2", ["NB03", "NB04"], [gaussian_fixture(False), gaussian_fixture(True)]+density_fixtures+gaussian_extra, second, "Which likelihood model matches these features, and is stronger confidence reliable when evidence is repeated?")]
    for lab in labs:
        fixture_ids = {fixture["id"] for fixture in lab["fixtures"]}
        assert all(state["fixture_id"] in fixture_ids for state in lab["configurations"])
    base = next(state for state in second if state["id"] == "NB-E2.gaussian.base.v1e-09.empirical.q0.v1")["expected"]
    duplicate = next(state for state in second if state["id"] == "NB-E2.gaussian.duplicate.v1e-09.empirical.q0.v1")["expected"]
    assert base["prediction"] == duplicate["prediction"] == 0
    assert duplicate["positive_brier_error"] > base["positive_brier_error"]
    assert duplicate["stable_label_log_loss"] > base["stable_label_log_loss"]
    edges["repeated_wrong_evidence"] = {"base_positive_probability": base["posterior_float64"][1], "duplicate_positive_probability": duplicate["posterior_float64"][1], "label": 1,
                                         "base_log_loss": base["stable_label_log_loss"], "duplicate_log_loss": duplicate["stable_label_log_loss"]}
    return labs, edges


def main():
    labs, edges = generate()
    report = {"schema": "naive-bayes.parity.v1", "python": platform.python_version(), "platform": platform.platform(), "dependencies": PROFILE, "passed": True,
              "state_counts": {lab["id"]: len(lab["configurations"]) for lab in labs}, "checks": edges,
              "library_source_hashes": {"GaussianNB._partial_fit": sha(inspect.getsource(GaussianNB._partial_fit).encode()), "MultinomialNB._update_feature_log_prob": sha(inspect.getsource(MultinomialNB._update_feature_log_prob).encode())},
              "ledger": [{"id": state["id"], "kind": state["kind"], "passed": True} for lab in labs for state in lab["configurations"]]}
    blobs = {"nb-e1.manifest.v1.json": encode(labs[0]), "nb-e2.manifest.v1.json": encode(labs[1]), "parity-report.v1.json": encode(report)}
    lock = {"schema": "naive-bayes.freeze.v1", "sha256": {name: sha(blob) for name, blob in blobs.items()}, "generator_sha256": sha(Path(__file__).read_bytes()),
            "conventions_sha256": sha((DEST/"PROBABILITY_SMOOTHING_VARIANCE_CONVENTIONS.md").read_bytes())}
    blobs["freeze-lock.v1.json"] = encode(lock)
    DEST.mkdir(parents=True, exist_ok=True)
    if "--check" in sys.argv:
        for name, blob in blobs.items():
            assert (DEST/name).read_bytes() == blob, name
        print("PASS: NB-E1 26/NB-E2 30 states; manual/sklearn references and diagnostics; byte-identical regeneration and unchanged hashes")
    else:
        for name, blob in blobs.items():
            (DEST/name).write_bytes(blob)
        print(json.dumps(lock, indent=2))


if __name__ == "__main__":
    main()
