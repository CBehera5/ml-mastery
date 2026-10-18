"""Trusted offline Polynomial Regression authoring; never executes learner code."""
import hashlib
import itertools
import json
import math
from pathlib import Path

import numpy as np
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

ROOT = Path(__file__).resolve().parents[2]
PROFILE = {"python": "3.13.16", "numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1"}
TRAIN = {"ids": ["h1", "h2", "h3", "h4", "h5"], "x": [-1, -.5, 0, .5, 1], "y": [24, 18.5, 21, 23.5, 31]}
DEV = {"ids": ["h6", "h7"], "x": [-.75, .75], "y": [20.75, 28.25]}


def expand(row, degree):
    return [math.prod(row[index] for index in indexes) for power in range(1, degree + 1) for indexes in itertools.combinations_with_replacement(range(len(row)), power)]


def fitted(degree, penalty, provenance):
    poly = PolynomialFeatures(degree=degree, include_bias=False)
    train = poly.fit_transform(np.array(TRAIN["x"]).reshape(-1, 1))
    dev = poly.transform(np.array(DEV["x"]).reshape(-1, 1))
    scaler = StandardScaler().fit(train if provenance == "fold-local" else np.vstack([train, dev]))
    model = LinearRegression() if penalty == "none" else Ridge(alpha=1, solver="svd")
    model.fit(scaler.transform(train), TRAIN["y"])
    def predict(values):
        matrix = poly.transform(np.array(values).reshape(-1, 1))
        actual = model.predict(scaler.transform(matrix))
        manual = (matrix - scaler.mean_) / scaler.scale_ @ model.coef_ + model.intercept_
        assert np.allclose(actual, manual, atol=1e-9, rtol=1e-9)
        return actual.tolist()
    return poly, scaler, model, predict


def state(identity, fixture, controls, expected, why, objectives):
    return {"id": identity, "fixture": fixture, "controls": controls, "expected": expected, "why": why, "objectives": objectives,
            "prediction_question": "Predict feature shape, prediction or generalization permission before revealing. Which quantities or conclusions should change?", "text_alternative": "Read the exact inputs, feature/fit tables, residuals, prediction and explanation beside the plot."}


def experiments():
    first, fixtures = [], []
    for dimensions, degree, query, weights in itertools.product([1, 2], [1, 2, 3], [2, 3], ["reference", "changed-first-weight"]):
        row = [query] if dimensions == 1 else [query, 3]
        features = expand(row, degree)
        poly = PolynomialFeatures(degree=degree, include_bias=False).fit(np.zeros((1, dimensions)))
        assert np.allclose(poly.transform([row])[0], features)
        if dimensions == 1:
            training_x = np.array([0, 1, 2, 3]).reshape(-1, 1)
            training_y = [1, 6, 17, 34]
            estimator = LinearRegression().fit(poly.transform(training_x), training_y)
            coefficients, intercept = estimator.coef_.tolist(), float(estimator.intercept_)
            kind = "reference-trained single-feature curve" if weights == "reference" else "authored coefficient counterfactual, not refitted"
        else:
            coefficients, intercept = [2, 1, 3, .5, 1, .2, .1, .1, .05][:len(features)], 1
            training_x, training_y = None, None
            kind = "authored two-feature weighted map, not a trained model"
        if weights != "reference":
            coefficients = [coefficients[0] + 2, *coefficients[1:]]
        prediction = float(np.dot(features, coefficients) + intercept)
        curve = []
        for coordinate in np.linspace(0, 3, 21):
            point = [float(coordinate)] if dimensions == 1 else [float(coordinate), 3]
            curve.append([float(coordinate), float(np.dot(expand(point, degree), coefficients) + intercept)])
        identity = f"PR-E1.p{dimensions}.d{degree}.x{query}.{weights}"
        fixture = identity + ".fixture.v1"
        fixtures.append({"id": fixture, "row": row, "dimensionless_input": True, "price_unit": "thousand USD", "degree": degree, "coefficient_kind": kind, "coefficients": coefficients, "intercept": intercept, "training_x": None if training_x is None else training_x.ravel().tolist(), "training_y": training_y, "training_ids": None if training_x is None else ["a1", "a2", "a3", "a4"]})
        expected = {"features": features, "feature_names": poly.get_feature_names_out().tolist(), "shape": [1, len(features)], "coefficients": coefficients, "intercept": intercept, "prediction": prediction, "curve": curve, "reason": "linear-in-coefficients", "valid": True}
        if dimensions == 1:
            fitted_predictions = [float(np.dot(expand([float(value)], degree), coefficients) + intercept) for value in training_x.ravel()]
            expected.update({"training_predictions": fitted_predictions, "training_residuals": [truth - guess for truth, guess in zip(training_y, fitted_predictions)], "training_mae": float(mean_absolute_error(training_y, fitted_predictions))})
        first.append(state(identity, fixture, {"features": dimensions, "degree": degree, "query": query, "weights": weights}, expected, f"{kind}. The feature row changes with input/degree; with that row fixed, prediction is intercept plus a linear weighted sum. Coefficient changes are not additional observations. Two-feature curves hold the second coordinate at3; they are slices, not full surfaces.", ["PR01.O1", "PR01.O2", "PR01.O3", "PR02.O1"]))
    for kind, query in itertools.product(["duplicate-intercept", "swapped-columns"], [2, 3]):
        row = [query] if kind == "duplicate-intercept" else [query, 3]
        normal = expand(row, 2)
        if kind == "duplicate-intercept":
            supplied, coefficients, intercept = [1, *normal], [1, 2, 3], 1
            valid_prediction = 1 + 2 * query + 3 * query ** 2
        else:
            supplied, coefficients, intercept = list(normal), [2, 1, 3, .5, 1], 1
            supplied[0], supplied[1] = supplied[1], supplied[0]
            valid_prediction = float(np.dot(normal, coefficients) + intercept)
        identity = f"PR-E1.{kind}.x{query}"
        fixture = identity + ".fixture.v1"
        fixtures.append({"id": fixture, "row": row, "canonical_features": normal, "supplied_features": supplied, "coefficients": coefficients, "intercept": intercept, "unit": "thousand USD"})
        first.append(state(identity, fixture, {"diagnostic": kind, "query": query}, {"features": supplied, "prediction": float(np.dot(supplied, coefficients) + intercept), "canonical_prediction": valid_prediction, "valid": False, "reason": kind}, "Duplicate bias and model intercept create redundant constants; swapped feature columns violate the fitted coefficient schema even if dimensions still match. At equal coordinate values a swap may coincidentally leave the number unchanged; it is still the wrong schema.", ["PR01.O4", "PR02.O4"]))
    second = []
    fits = []
    for degree, penalty, provenance in itertools.product([1, 3, 9], ["none", "ridge1"], ["fold-local", "global-development"]):
        poly, scaler, estimator, predict = fitted(degree, penalty, provenance)
        train_pred, dev_pred = predict(TRAIN["x"]), predict(DEV["x"])
        fixture = f"pr-fit.d{degree}.{penalty}.{provenance}.v1"
        fits.append({"id": fixture, "training": TRAIN, "development": DEV, "test_ids": ["h8", "h9"], "test_values": "withheld", "degree": degree, "penalty": penalty, "provenance": provenance, "fit_ids": TRAIN["ids"] if provenance == "fold-local" else TRAIN["ids"] + DEV["ids"], "scaler_mean": scaler.mean_.tolist(), "scaler_scale": scaler.scale_.tolist(), "coefficients": estimator.coef_.tolist(), "intercept": float(estimator.intercept_), "rank_note": "degree9 unregularized coefficients are nonunique; compare fixed-profile predictions, never cross-host coefficient identity", "unit": "thousand USD; x is dimensionless normalized area"})
        for query, selection in itertools.product([.4, 1.5], ["development", "final-test"]):
            valid = provenance == "fold-local" and selection == "development"
            reason = "permitted-development" if valid else "fit-and-selection-leakage" if provenance != "fold-local" and selection != "development" else "fit-leakage" if provenance != "fold-local" else "test-selection"
            curve = [[float(value), predict([float(value)])[0]] for value in np.linspace(-1.5, 1.5, 21)]
            second.append(state(f"PR-E2.d{degree}.{penalty}.{provenance}.q{query}.{selection}", fixture, {"degree": degree, "penalty": penalty, "fit_provenance": provenance, "query": query, "selection": selection}, {"train_predictions": train_pred, "development_predictions": dev_pred, "train_residuals": [truth - guess for truth, guess in zip(TRAIN["y"], train_pred)], "development_residuals": [truth - guess for truth, guess in zip(DEV["y"], dev_pred)], "train_mae": float(mean_absolute_error(TRAIN["y"], train_pred)), "development_mae": float(mean_absolute_error(DEV["y"], dev_pred)), "development_mse": float(mean_squared_error(DEV["y"], dev_pred)), "query_prediction": predict([query])[0], "query_support": "in-range, not a guarantee" if query <= 1 else "extrapolation; no reliability evidence", "curve": curve, "valid": valid, "reason": reason, "final_test_permission": "eligible only after selection frozen" if valid else "not permitted; repair fit/selection"}, "Higher degree can reduce training residuals without improving development or tails. Compare actual same-row errors. Scaling learns statistics and must fit within each training fold; a fixed polynomial formula itself does not learn held-out labels. Penalty1 is a bounded Ridge comparison only, not the later regularization course. Selecting degree or penalty on final-test feedback invalidates final evaluation.", ["PR03.O1", "PR03.O2", "PR03.O3", "PR03.O4", "PR04.O1", "PR04.O2", "PR04.O3", "PR04.O4"]))
    def manifest(identity, inputs, configs):
        return {"id": identity, "version": "1.0.0", "schema": "supervised.polynomial.experiment.v1", "profile": PROFILE, "initial_configuration": configs[0]["id"], "fixtures": inputs, "configurations": configs, "tolerance": {"absolute": 1e-9, "relative": 1e-9}, "bounds": "At most64 configurations,21 read-only plot points,7x9 maximum fitted expansion, no learner arrays beyond64 cells; rank-deficient predictions profile-pinned."}
    return [manifest("PR-E1", fixtures, first), manifest("PR-E2", fits, second)]


def case(lesson, objective, variant):
    value = variant + 1
    row = [value, value + 1]
    if lesson == 1:
        if objective == 1: return ("choice", f"Expand x={value} to degree2 without bias; state one-row dimensions.", f"[{value},{value ** 2}], shape(1,2)", "Powers are new columns, not rows; no constant column when include_bias=False.")
        if objective == 2: return ("choice", f"For x={value}, f(x)=b+w1*x+w2*x². Is it linear in its coefficients?", "Yes: fix the feature row and the coefficients enter only as a weighted sum", "Curved in input is compatible with linear in coefficients; no coefficient is squared or multiplied by another coefficient.")
        if objective == 3: return ("number", f"Dimensionless x={value}; w=[2,3], intercept1 thousand USD. Predict the price in thousand USD.", 1 + 2 * value + 3 * value ** 2, "Compute1+2x+3x². Raw physical powers require inverse-power coefficient units; dimensionless normalized inputs simplify the units.")
        return ("choice", "PolynomialFeatures includes a constant1 while the estimator also fits an intercept. What must be repaired?", "Use include_bias=False with the model intercept, or one explicit constant without an additional intercept", "Two constant directions are redundant; predictions can be identified without unique separate constant coefficients.")
    if lesson == 2:
        if objective == 1: return ("choice", f"For row {row}, expand degree2 without bias, preserving sklearn order.", str(expand(row, 2)), "Order is a,b,a²,ab,b²; interactions change the column schema, not observation count.")
        if objective == 2:
            degree = value + 7
            count = math.comb(2 + degree, degree) - 1
            return ("number", f"Two features, degree{degree}, no bias: how many columns? With a32-dimension bound, explain why this design is unsupported.", count, "Count C(p+d,d)−1 nonconstant monomials. This exceeds32 columns, so reject rather than generate an unbounded learner array; added columns are not extra evidence.")
        if objective == 3: return ("number", f"Training x range[0,3]; f(x)=x². Predict at x={value + 5}; is this interpolation evidence?", (value + 5) ** 2, "The query is outside training support. The arithmetic is defined but reliability is unestablished; marginal ranges also do not prove joint support in multiple dimensions.")
        return ("choice", "A fitted schema is [a,b,a²,ab,b²], but prediction supplies [b,a,a²,ab,b²]. Dimensions match. Is it safe?", "No: feature order must match the fitted schema; a same-shape matrix can still predict incorrectly", "Annotate columns and restore their original order before multiplication; do not retrain on prediction rows.")
    if lesson == 3:
        if objective == 1:
            degrees = [1, 3, 9]; metrics = [(degree, float(mean_absolute_error(DEV["y"], fitted(degree, "none", "fold-local")[3](DEV["x"])))) for degree in degrees]
            winner = min(metrics, key=lambda item: item[1])[0]
            return ("choice", f"Compare fixed-profile development MAE {metrics}; which degree minimizes this development criterion?", str(winner), "Select from the actual development errors, not a claim that the greatest degree must win. Training fit alone is insufficient.")
        if objective == 2: return ("choice", "Select degree/penalty and learned scaling using CV. Which information boundary is required?", "Select on development folds, fit scaling separately inside each fold training set, freeze before final test", "A fixed polynomial map may transform held-out inputs; learned means/scales and candidate selection must not use validation or final-test feedback outside permitted boundaries.")
        if objective == 3: return ("choice", "A feature is multiplied by100 before an L2 coefficient penalty. Is the same alpha automatically the same model preference?", "No: feature scale changes the coefficient needed for a prediction and therefore its penalty", "Polynomial powers have different scales. Fit scaling on each fold training set before penalized fitting; do not learn scaling from validation.")
        return ("slots", "Repair the supplied pipeline order; choose the complete safe tuple, not individually plausible fragments.", ["poly", "scale", "model"], "Expand the fixed features, fit scaling on fold training rows, then fit the estimator; wrap the entire unfitted pipeline in CV.")
    if objective == 1: return ("choice", "Residuals from a straight line bend systematically with area. What is justified?", "Consider a curved feature map and compare development residuals against the existing linear baseline", "Residual structure suggests a missing pattern, not proof of a causal law or guaranteed benefit from every higher degree.")
    if objective == 2: return ("choice", f"A degree{value + 2} model fits observed x in[0,3] well. Does that establish safe predictions at x=10?", "No: good interpolation is not evidence of safe extrapolation; inspect domain support and assumptions", "Polynomial tails can grow rapidly; finite numerical output is not a reliability guarantee or causal effect.")
    if objective == 3: return ("choice", "Compare a straight line, a polynomial weighted map and a supplied piecewise-constant rule. Which distinction is sound?", "A polynomial is linear in coefficients but curved in inputs; a piecewise rule partitions regions with different assumptions", "Do not infer that one family always wins. Compare matching development rows and constraints; no tree estimator is implemented here.")
    return ("choice", "Choose an honest model report for a curved house-price relationship.", "Record feature schema, units, fit/split IDs, degree/penalty selection, baseline errors and tail/shift limitations", "A price regressor does not directly classify churn or Good/Needs Improvement. Record target mismatch and failure cases, not only a winning score.")


def catalog():
    families = []
    for lesson, objective, variant in itertools.product(range(1, 5), range(1, 5), range(5)):
        kind, prompt, expected, why = case(lesson, objective, variant)
        mode, form = ("practice", "AB"[variant]) if variant < 2 else ("independent", "ABC"[variant - 2])
        identity = f"PR{lesson:02}.O{objective}"
        decision = {"id": "decision", "kind": kind, "label": "Decision or calculation"}
        if kind == "choice":
            options = [{"id": "supported", "label": expected}, {"id": "shortcut", "label": "Higher degree and lower training error guarantee correct unseen predictions."}, {"id": "ignore", "label": "Ignore feature order, units and information boundaries when dimensions or scores look plausible."}]
            shift = (lesson + objective + variant) % 3
            decision["options"] = options[shift:] + options[:shift]
            answers = [[{"kind": "choice", "optionId": "supported"}]]
        elif kind == "number": answers = [[{"kind": "number", "value": expected}]]
        else:
            options = [{"id": "poly", "label": "Fixed polynomial expansion"}, {"id": "poly_fixed", "label": "The same fixed polynomial expansion (equivalent alias)"}, {"id": "scale", "label": "Training-only scaling"}, {"id": "model", "label": "Estimator fit"}, {"id": "test_fit", "label": "Fit using final test"}]
            decision["slots"] = [{"id": f"step{index + 1}", "label": f"Pipeline step{index + 1}", "options": options} for index in range(3)]
            answers = [[{"kind": "slots", "entries": [{"slotId": f"step{index + 1}", "optionId": token} for index, token in enumerate([first, "scale", "model"])]}] for first in ["poly", "poly_fixed"]]
        atoms = [decision]
        if objective == 2:
            reasons = [{"id": "mechanism", "label": why}, {"id": "shortcut", "label": "A high score validates any feature interpretation, tail prediction or test-selection procedure."}]
            if variant % 2: reasons.reverse()
            atoms.append({"id": "reason", "kind": "choice", "label": "Explain the mechanism or protected boundary", "options": reasons})
            answers = [answer + [{"kind": "choice", "optionId": "mechanism"}] for answer in answers]
        families.append({"id": f"{identity}.{mode}.{form}", "objective": identity, "critical": objective == 2, "prompt": prompt, "code": "", "atoms": atoms, "accepted": answers, "explanation": why, "remediation": "Return to the worked contrast and trace columns, coefficients, support and fit IDs. " + why})
    return {"content": "supervised.polynomial.1.0.0", "families": families}


def serialize(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, allow_nan=False, indent=2) + "\n"


if __name__ == "__main__":
    import sys
    mode = sys.argv[1]
    value = experiments()[int(mode)] if mode in ["0", "1"] else catalog()
    print(serialize(value), end="")
