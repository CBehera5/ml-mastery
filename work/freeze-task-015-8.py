"""Trusted offline Random Forest fixture authoring; never learner execution."""
import hashlib
import importlib.metadata
import inspect
import json
import math
import platform
import sys
import warnings
from fractions import Fraction
from pathlib import Path

import numpy as np
import sklearn
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.inspection import permutation_importance
from sklearn.metrics import accuracy_score, confusion_matrix, mean_absolute_error, mean_squared_error, r2_score
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/verification/random-forests"
PROFILE = {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn", "scipy"]}
assert platform.python_version() == "3.13.16"
assert PROFILE == {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}
SEED = 1729
ROWS = [[index, other] for index, other in zip(range(1, 9), [2, 8, 1, 7, 3, 6, 4, 5])]
DEV = [[1.5, 2], [3.5, 7], [5.5, 3], [7.5, 5]]


def encode(value):
    return (json.dumps(value, sort_keys=True, indent=2, allow_nan=False)+"\n").encode()


def sha(value):
    return hashlib.sha256(value).hexdigest()


def close(actual, expected):
    assert np.allclose(actual, expected, atol=1e-9, rtol=1e-9), (actual, expected)


def number(value):
    value = float(value)
    if math.isnan(value):
        return {"tag": "undefined", "reason": "library-nan"}
    if math.isinf(value):
        return {"tag": "infinity", "sign": "positive" if value > 0 else "negative"}
    return value


def fixture(task, name):
    correlated = name == "correlated"
    inputs = [[index, index] for index in range(1, 9)] if correlated else ROWS
    development = [[index, index] for index in [1.5, 3.5, 5.5, 7.5]] if correlated else DEV
    if task == "regression":
        target = [2, 3, 4, 5, 6, 7, 8, 8 if name == "changed-row" else 12]
        development_target = [3, 5, 7, 8]
    else:
        target = [0, 0, 0, 0, 1, 1, 1, 1] if correlated else [0, 0, 1, 0, 1, 1, 0, 1]
        development_target = [0, 0, 1, 1] if correlated else [0, 1, 0, 1]
        if name.startswith("only-"):
            target = [int(name[-1])]*8
            development_target = [int(name[-1])]*4
    identity = f"rf.{task}.{name}.v1"
    return {"id": identity, "training_inputs": inputs, "training_targets": target, "development_inputs": development, "development_targets": development_target,
            "training_ids": [f"{identity}.train.{index}" for index in range(8)], "development_ids": [f"{identity}.dev.{index}" for index in range(4)],
            "feature_order": ["floor_area_50m2", "neighborhood_index"] if task == "regression" else ["support_contact_index", "usage_index"],
            "target": "house_price_100000_fictional_currency" if task == "regression" else "0=stays;1=churns",
            "feature_definitions": ([{"name": "floor_area_50m2", "meaning": "Floor area in units of50 square meters,known before sale"}, {"name": "neighborhood_index", "meaning": "Fictional numeric accessibility index,not an arbitrary nominal neighborhood ID"}] if task == "regression" else [{"name": "support_contact_index", "meaning": "Fictional support-activity score observed before the prediction moment"}, {"name": "usage_index", "meaning": "Fictional numeric usage score available before churn;not a future cancellation outcome"}]),
            "fit_permissions": "Only training IDs/targets fit trees and bootstrap draws;development labels measure error/permutation,not fitting. No final-test selection or dataset in this experiment.",
            "provenance": "Fictional teaching data,not production performance or causal evidence. Correlated fixture has duplicate feature columns."}


def parameters(task, trees, depth, features):
    result = dict(n_estimators=trees, criterion="squared_error" if task == "regression" else "gini", max_depth=depth, min_samples_split=2, min_samples_leaf=1,
                  min_weight_fraction_leaf=0., max_features=features, max_leaf_nodes=None, min_impurity_decrease=0., bootstrap=True, oob_score=True,
                  n_jobs=1, random_state=SEED, verbose=0, warm_start=False, ccp_alpha=0., max_samples=None, monotonic_cst=None)
    if task == "classification":
        result["class_weight"] = None
    return result


def fitted_model(task, params, inputs, targets):
    with warnings.catch_warnings(record=True) as notices:
        warnings.simplefilter("always")
        model = (RandomForestRegressor if task == "regression" else RandomForestClassifier)(**params).fit(inputs, targets)
    return model, sorted(set(str(notice.message) for notice in notices))


def impurity(indices, weights, targets, task, classes):
    total = sum(int(weights[index]) for index in indices)
    if task == "regression":
        mean = sum(Fraction(int(targets[index])*int(weights[index])) for index in indices)/total
        return sum(int(weights[index])*(Fraction(int(targets[index]))-mean)**2 for index in indices)/total
    counts = [sum(int(weights[index]) for index in indices if targets[index] == label) for label in classes]
    return 1-sum(Fraction(count, total)**2 for count in counts)


class FeatureRng:
    def __init__(self, seed):
        self.state = int(np.random.RandomState(seed).randint(0, 2147483647))
        self.features = [0, 1]

    def draw(self, count):
        candidates = []
        available = 2
        for _ in range(count):
            value = self.state or 1
            value = (value ^ (value << 13)) & 0xffffffff
            value = (value ^ (value >> 17)) & 0xffffffff
            value = (value ^ (value << 5)) & 0xffffffff
            self.state = value
            position = (value % 2147483648) % available
            candidates.append(self.features[position])
            available -= 1
            self.features[available], self.features[position] = self.features[position], self.features[available]
        return candidates


def tree_reference(estimator, sample, data, task, forest_classes):
    inputs = np.asarray(data["training_inputs"], dtype=np.float32)
    targets = np.asarray(data["training_targets"])
    weights = np.bincount(sample, minlength=len(inputs))
    rng = FeatureRng(estimator.random_state)
    nodes = []
    active = [index for index, weight in enumerate(weights) if weight]
    membership = {0: active}
    for node in range(estimator.tree_.node_count):
        indices = membership[node]
        count = int(sum(weights[index] for index in indices))
        imp = impurity(indices, weights, targets, task, forest_classes)
        close(estimator.tree_.impurity[node], float(imp))
        assert estimator.tree_.n_node_samples[node] == len(indices)
        assert estimator.tree_.weighted_n_node_samples[node] == count
        entry = {"id": node, "unique_row_indices": indices, "unique_count": len(indices), "weighted_count": count, "impurity": float(imp), "impurity_fraction": str(imp)}
        if task == "regression":
            mean = sum(int(targets[index])*int(weights[index]) for index in indices)/count
            close(estimator.tree_.value[node].ravel(), [mean])
            entry.update(prediction=mean, sse=float(imp)*count)
        else:
            counts = [sum(int(weights[index]) for index in indices if targets[index] == label) for label in forest_classes]
            probabilities = [value/count for value in counts]
            close(estimator.tree_.value[node].ravel(), probabilities)
            entry.update(class_counts=counts, class_probabilities=probabilities, prediction=forest_classes[int(np.argmax(probabilities))])
        feature = int(estimator.tree_.feature[node])
        if feature >= 0:
            drawn = rng.draw(estimator.max_features_)
            candidates = []
            for candidate_feature in drawn:
                values = sorted({float(inputs[index, candidate_feature]) for index in indices})
                assert len(values) == len(indices), "Nonconstant distinct-column domain required for exact draw trace"
                for low, high in zip(values, values[1:]):
                    threshold = low/2+high/2
                    left = [index for index in indices if inputs[index, candidate_feature] <= threshold]
                    right = [index for index in indices if inputs[index, candidate_feature] > threshold]
                    left_count = sum(int(weights[index]) for index in left)
                    right_count = sum(int(weights[index]) for index in right)
                    gain = imp-Fraction(left_count, count)*impurity(left, weights, targets, task, forest_classes)-Fraction(right_count, count)*impurity(right, weights, targets, task, forest_classes)
                    candidates.append({"feature": candidate_feature, "threshold": threshold, "gain": float(gain), "gain_fraction": str(gain)})
            threshold = float(estimator.tree_.threshold[node])
            selected = next(candidate for candidate in candidates if candidate["feature"] == feature and candidate["threshold"] == threshold)
            close(selected["gain"], max(candidate["gain"] for candidate in candidates))
            left = [index for index in indices if inputs[index, feature] <= threshold]
            right = [index for index in indices if inputs[index, feature] > threshold]
            left_id, right_id = int(estimator.tree_.children_left[node]), int(estimator.tree_.children_right[node])
            membership[left_id], membership[right_id] = left, right
            entry.update(feature=feature, threshold=threshold, left=left_id, right=right_id, sampled_candidate_features=drawn, candidates=candidates, selected_gain=selected["gain"])
        else:
            entry["sampled_candidate_features"] = []
        nodes.append(entry)
    args = estimator.get_params()
    reference = (DecisionTreeRegressor if task == "regression" else DecisionTreeClassifier)(**args)
    encoded = np.searchsorted(np.asarray(forest_classes), targets) if task == "classification" else targets
    reference.fit(inputs, encoded, sample_weight=weights)
    for attribute in ["feature", "threshold", "children_left", "children_right", "value", "impurity", "weighted_n_node_samples"]:
        close(getattr(reference.tree_, attribute), getattr(estimator.tree_, attribute))
    return {"seed": int(estimator.random_state), "bootstrap_indices": sample.tolist(), "bootstrap_ids": [data["training_ids"][index] for index in sample],
            "multiplicity": weights.tolist(), "oob_indices": [index for index, count in enumerate(weights) if not count], "settings": args, "nodes": nodes,
            "internal_class_codes": estimator.classes_.tolist() if task == "classification" else [], "probability_column_labels": forest_classes}


def routed(tree, queries, task):
    outputs = []
    paths = []
    for row in np.asarray(queries, dtype=np.float32):
        node = tree["nodes"][0]
        path = [0]
        while "feature" in node:
            identity = node["left"] if row[node["feature"]] <= node["threshold"] else node["right"]
            node = tree["nodes"][identity]
            path.append(identity)
        outputs.append(node["prediction"] if task == "regression" else node["class_probabilities"])
        paths.append(path)
    return outputs, paths


def metrics(targets, predictions, task, classes):
    if not len(targets):
        return {"tag": "unavailable", "reason": "no-covered-rows"}
    if task == "regression":
        errors = [float(prediction-target) for prediction, target in zip(predictions, targets)]
        mse = sum(error**2 for error in errors)/len(errors)
        mae = sum(abs(error) for error in errors)/len(errors)
        close(mse, mean_squared_error(targets, predictions))
        close(mae, mean_absolute_error(targets, predictions))
        return {"mse": mse, "mae": mae, "rows": len(errors)}
    correct = sum(int(target == prediction) for target, prediction in zip(targets, predictions))
    close(correct/len(targets), accuracy_score(targets, predictions))
    counts = [[sum(int(actual == left and predicted == right) for actual, predicted in zip(targets, predictions)) for right in [0, 1]] for left in [0, 1]]
    assert counts == confusion_matrix(targets, predictions, labels=[0, 1]).tolist()
    cost = counts[0][1]+5*counts[1][0]
    return {"accuracy": correct/len(targets), "confusion_matrix": counts, "class_order": [0, 1], "positive_class": 1, "tn": counts[0][0], "fp": counts[0][1], "fn": counts[1][0], "tp": counts[1][1],
            "fictional_cost": {"false_positive_cost": 1, "false_negative_cost": 5, "correct_cost": 0, "total": cost, "mean_per_row": cost/len(targets)}, "rows": len(targets)}


def permutation(model, data):
    inputs, targets = np.array(data["development_inputs"], dtype=float), np.array(data["development_targets"])
    reference = permutation_importance(model, inputs, targets, scoring="accuracy", n_repeats=3, random_state=SEED, n_jobs=1, max_samples=1.)
    seed = int(np.random.RandomState(SEED).randint(np.iinfo(np.int32).max+1))
    baseline = float(accuracy_score(targets, model.predict(inputs)))
    records = []
    for feature in range(2):
        rng = np.random.RandomState(seed)
        order = np.arange(len(inputs))
        index_map = np.arange(len(inputs))
        scores, repeats = [], []
        for _ in range(3):
            rng.shuffle(order)
            index_map = index_map[order]
            changed = inputs.copy()
            changed[:, feature] = inputs[index_map, feature]
            predictions = model.predict(changed)
            score = sum(int(actual == predicted) for actual, predicted in zip(targets, predictions))/len(targets)
            scores.append(score)
            repeats.append({"source_row_indices": index_map.tolist(), "predictions": predictions.tolist(), "score": score})
        differences = [baseline-score for score in scores]
        close(differences, reference.importances[feature])
        close(sum(differences)/3, reference.importances_mean[feature])
        records.append({"feature": feature, "repeats": repeats, "score_decreases": differences, "mean": float(reference.importances_mean[feature]), "std_population": float(reference.importances_std[feature])})
    return {"scoring": "accuracy", "baseline": baseline, "derived_seed": seed, "n_repeats": 3, "features": records}


def forest_state(task, data, trees, depth, features):
    params = parameters(task, trees, depth, features)
    inputs, targets = np.asarray(data["training_inputs"]), np.asarray(data["training_targets"])
    model, notices = fitted_model(task, params, inputs, targets)
    repeated, repeated_notices = fitted_model(task, params, inputs, targets)
    assert notices == repeated_notices
    classes = model.classes_.tolist() if task == "classification" else []
    seeds = np.random.RandomState(SEED).randint(2147483647, size=trees).tolist()
    tree_records = []
    for index, estimator in enumerate(model.estimators_):
        assert estimator.random_state == seeds[index]
        sample = np.random.RandomState(seeds[index]).randint(0, len(inputs), len(inputs)).astype(np.int32)
        assert np.array_equal(sample, model.estimators_samples_[index])
        for attribute in ["feature", "threshold", "children_left", "children_right", "value"]:
            assert np.array_equal(getattr(estimator.tree_, attribute), getattr(repeated.estimators_[index].tree_, attribute))
        record = tree_reference(estimator, sample, data, task, classes)
        record["id"] = f"tree.{index}"
        tree_records.append(record)
    outputs = {}
    for split in ["training", "development"]:
        queries, truth = data[f"{split}_inputs"], data[f"{split}_targets"]
        individual, paths = [], []
        for estimator, record in zip(model.estimators_, tree_records):
            manual, trace = routed(record, queries, task)
            close(manual, estimator.predict(queries) if task == "regression" else estimator.predict_proba(queries))
            assert trace == [estimator.decision_path([row]).indices.tolist() for row in queries]
            individual.append(manual)
            paths.append(trace)
        average = np.mean(individual, axis=0)
        if task == "classification":
            close(average, model.predict_proba(queries))
            predictions = [classes[int(np.argmax(row))] for row in average]
            hard = [[classes[int(np.argmax(vector))] for vector in tree] for tree in individual]
            vote = [max(classes, key=lambda label: sum(tree[index] == label for tree in hard)) for index in range(len(queries))]
            positive = [float(row[classes.index(1)]) if 1 in classes else 0. for row in average]
            aggregate = {"mean_probabilities": average.tolist(), "predictions": predictions, "hard_tree_labels": hard, "hard_majority_comparison_only": vote, "positive_probability": positive,
                         "threshold_action_at_half": [int(value >= .5) for value in positive]}
        else:
            predictions = average.tolist()
            aggregate = {"predictions": predictions, "tree_spread_population_std_not_interval": np.std(individual, axis=0).tolist()}
        assert np.array_equal(predictions, model.predict(queries))
        outputs[split] = {"individual_tree_outputs": individual, "decision_paths": paths, **aggregate, "metrics": metrics(truth, predictions, task, classes)}
    oob_rows = []
    covered, covered_prediction = [], []
    raw = model.oob_prediction_ if task == "regression" else model.oob_decision_function_
    for row in range(len(inputs)):
        contributors = [index for index, tree in enumerate(tree_records) if row in tree["oob_indices"]]
        if not contributors:
            expected = {"tag": "unavailable", "reason": "no-oob-contributor"}
            close(raw[row], 0)
        else:
            individual = [outputs["training"]["individual_tree_outputs"][index][row] for index in contributors]
            average = np.mean(individual, axis=0)
            close(average, raw[row])
            prediction = float(average) if task == "regression" else classes[int(np.argmax(average))]
            expected = {"prediction": prediction, "mean": np.asarray(average).tolist()}
            covered.append(row)
            covered_prediction.append(prediction)
        oob_rows.append({"row_index": row, "row_id": data["training_ids"][row], "contributing_tree_ids": [f"tree.{index}" for index in contributors], "denominator": len(contributors), "mathematical": expected,
                         "raw_library_value_not_valid_when_uncovered": np.asarray(raw[row]).tolist()})
    library_score = r2_score(targets, raw) if task == "regression" else accuracy_score(targets, [classes[int(np.argmax(vector))] for vector in raw])
    close(library_score, model.oob_score_)
    importances = np.zeros(2)
    for tree in tree_records:
        gains = np.zeros(2)
        for node in tree["nodes"]:
            if "feature" in node:
                gains[node["feature"]] += node["weighted_count"]/len(inputs)*node["selected_gain"]
        if gains.sum():
            importances += gains/gains.sum()
    if importances.sum():
        importances /= importances.sum()
    close(importances, model.feature_importances_)
    result = {"class_order": classes, "trees": tree_records, "outputs": outputs, "impurity_importances": importances.tolist(),
              "oob": {"rows": oob_rows, "covered_indices": covered, "uncovered_indices": [index for index in range(len(inputs)) if index not in covered],
                      "covered_only_metrics": metrics(targets[covered], covered_prediction, task, classes), "library_default_score_all_rows": number(model.oob_score_),
                      "library_score_kind": "R2" if task == "regression" else "accuracy", "warnings": notices, "zero_placeholders_are_not_predictions": True}}
    if task == "classification":
        result["heldout_permutation"] = permutation(model, data)
    identity = f"{'RF-E1' if task == 'regression' else 'RF-E2'}.{data['id']}.trees{trees}.depth{depth}.features{features}"
    explanation = "Bootstrap multiplicities and per-split random feature candidates change fitted trees; aggregate their numeric predictions by mean." if task == "regression" else "Align tree class-probability columns and average before argmax;hard-label voting is only a comparison,not this classifier's prediction."
    explanation += " Only trees omitting a training row contribute its OOB estimate;zero contributors mean unavailable. Development performance and importance do not prove causal effects or future reliability."
    return {"id": identity, "fixture_id": data["id"], "kind": "reference-fitted-forest", "controls": params, "expected": result,
            "prediction_question": "For the first development query,predict whether the mean price is below,equal to or above its visible comparison target3;development targets never fit the model." if task == "regression" else "For the first development query,predict the class from averaged probabilities,not majority hard labels.",
            "prediction_options": [{"id": key, "label": label} for key, label in ([('below','Mean below3'),('equal','Mean equals3'),('above','Mean above3')] if task == 'regression' else [('class0','Class0 — stays'),('class1','Class1 — churns')])],
            "correct_prediction_id": ("below" if outputs["development"]["predictions"][0] < 3 else "above" if outputs["development"]["predictions"][0] > 3 else "equal") if task == "regression" else f"class{outputs['development']['predictions'][0]}",
            "explanation": explanation, "counterexample": "More identical trees add no diverse errors;OOB cannot undo group/time leakage,and tree spread or importance is not calibrated uncertainty or causality."}


def supplied(task):
    records = []
    if task == "regression":
        for index, values in enumerate([[2, 4, 6], [4, 4, 4]]):
            mean = sum(Fraction(value) for value in values)/len(values)
            close(float(mean), np.mean(values))
            records.append({"id": f"RF-E1.supplied.mean.{index}.v1", "fixture_id": "rf.supplied.regression.v1", "kind": "supplied-arithmetic-not-fitted", "controls": {"tree_values": values},
                            "expected": {"individual_predictions": values, "prediction": float(mean), "mean_fraction": str(mean), "population_spread_not_interval": float(np.std(values)),
                                         "equal_variance_example": {"assumptions": "Equal marginal variance4,equal pairwise correlation rho,three trees;not a general prediction-error law", "rho0_mean_variance": 4/3, "rho1_mean_variance": 4}},
                            "prediction_question": "Predict the mean numeric price,not a majority class or interval.", "prediction_options": [{"id": "mean4", "label": "Mean4;spread is not calibrated coverage"}, {"id": "guaranteed", "label": "Every forest guarantees unseen improvement"}], "correct_prediction_id": "mean4",
                            "explanation": "Arithmetic means combine prices. Identical predictions have zero spread but may share large bias;tree spread does not certify calibrated future coverage.", "counterexample": "Three copies of the same biased tree remain biased,even with zero spread."})
    else:
        cases = [([[0, 1]]*3, [[.6, .4], [.6, .4], [.1, .9]]), ([[0, 1]]*2, [[.6, .4], [.4, .6]]), ([[0, 1]]*3, [[1, 0], [0, 1], [0, 1]]), ([[1], [0, 1]], [[1], [.8, .2]])]
        for index, (orders, vectors) in enumerate(cases):
            aligned = [[sum(Fraction(str(value)) for label, value in zip(order, vector) if label == target) for target in [0, 1]] for order, vector in zip(orders, vectors)]
            average = [sum(vector[column] for vector in aligned)/len(aligned) for column in range(2)]
            close([float(value) for value in average], np.mean([[float(value) for value in vector] for vector in aligned], axis=0))
            decision = int(average[1] > average[0])
            hard = [int(vector[1] > vector[0]) for vector in aligned]
            majority = int(sum(hard) > len(hard)/2)
            records.append({"id": f"RF-E2.supplied.probability.{index}.v1", "fixture_id": "rf.supplied.classification.v1", "kind": "supplied-arithmetic-not-fitted", "controls": {"tree_class_orders": orders, "tree_probabilities": vectors},
                            "expected": {"class_order": [0, 1], "aligned_vectors": [[float(value) for value in vector] for vector in aligned], "mean_probabilities": [float(value) for value in average], "mean_fractions": [str(value) for value in average],
                                         "prediction": decision, "hard_labels": hard, "hard_majority_comparison_only": majority, "positive_threshold": .5, "threshold_equality": ">=", "threshold_action": int(average[1] >= Fraction(1, 2))},
                            "prediction_question": "Predict the class from the aligned probability mean;argmax ties select0. Compare the separately labeled >=.5 action.",
                            "prediction_options": [{"id": "class0", "label": "Class0 — stays"}, {"id": "class1", "label": "Class1 — churns"}], "correct_prediction_id": f"class{decision}",
                            "explanation": "Align all class columns,using zero for an absent supplied class,then average vectors before sorted-class argmax. At p1=.5,argmax gives0 but a >=.5 positive action gives1. Exact endpoints need no clipping.",
                            "counterexample": "p1=[.4,.4,.9] has mean17/30,class1;hard labels[0,0,1] would vote0. Hard voting is not the approved forest operation."})
    return records


def rejections(task, data):
    invalid = parameters(task, 1, 1, 1)
    invalid["bootstrap"] = False
    try:
        fitted_model(task, invalid, data["training_inputs"], data["training_targets"])
        raise AssertionError("Expected bootstrap/OOB parameter rejection")
    except ValueError as error:
        assert "bootstrap" in str(error)
    cases = [("bootstrap-off", "OOB requires bootstrap sampling;bootstrap=False with oob_score=True is invalid.", "library-verified-parameter-rejection"),
             ("test-selection", "Final-test feedback cannot choose ensemble size,depth,features or stopping;use permitted development/CV and freeze before test.", "authored-provenance-invariant"),
             ("group-time", "OOB exclusion of one row does not exclude related entities or future information;use deployment-appropriate group/time validation and fold-only learning.", "authored-provenance-invariant")]
    return [{"id": f"{'RF-E1' if task == 'regression' else 'RF-E2'}.reject.{name}.v1", "fixture_id": data["id"], "kind": "rejection-diagnostic", "controls": {"diagnostic": name},
             "expected": {"tag": "rejected", "prediction": None, "reason": reason, "verification": method}, "prediction_question": "Does this proposed evaluation configuration support a valid result?",
             "prediction_options": [{"id": "reject", "label": "Reject and repair the actual boundary"}, {"id": "accept", "label": "Accept because averaging repairs every error"}], "correct_prediction_id": "reject",
             "explanation": reason, "counterexample": "A high reported score cannot repair an invalid fitting or evaluation boundary."} for name, reason, method in cases]


def manifest(task):
    data_sets = [fixture(task, name) for name in (["base", "changed-row", "correlated"] if task == "regression" else ["base", "correlated", "only-0", "only-1"])]
    states = []
    for data in data_sets:
        if ".only-" in data["id"]:
            states.append(forest_state(task, data, 1, 1, 1))
        else:
            for trees in [1, 3, 7]:
                for depth in [1, 2]:
                    for features in [1, 2]:
                        states.append(forest_state(task, data, trees, depth, features))
    states.extend(supplied(task))
    states.extend(rejections(task, data_sets[0]))
    for state in states:
        state["reason_options"] = [{"id": "mechanism", "label": state["explanation"]}, {"id": "shortcut", "label": "More trees and lower training error guarantee unseen success"}, {"id": "causal", "label": "Importance or a high score proves causal effects and calibrated certainty"}]
        state["correct_reason_id"] = "mechanism"
        assert state["correct_prediction_id"] in {option["id"] for option in state["prediction_options"]}
    assert len(states) <= 64
    assert len({state["id"] for state in states}) == len(states)
    return {"schema": "supervised.random-forests.experiment.v1", "id": "RF-E1" if task == "regression" else "RF-E2", "version": "1.0.0", "task": task,
            "objectives": ["RF01", "RF02", "RF04"] if task == "regression" else ["RF03", "RF05"], "prerequisites": ["DT", "EV", "Python aligned rows and training/fold-only fitting"],
            "fixtures": data_sets+[{'id': f'rf.supplied.{task}.v1', 'meaning': 'Supplied arithmetic examples,not fitted model outputs;inputs are embedded in each case.'}],
            "configurations": states, "allowed_configuration_ids": [state["id"] for state in states], "initial_configuration": states[0]["id"],
            "controls": "Only enumerated fixture/tree-count/depth/max-features tuples or supplied diagnostic cases. No arbitrary fit,query,seed,threshold or Cartesian expansion.",
            "interaction": "Choose prediction and reason before reveal;change a meaningful listed state,inspect exact traces,then explain and transfer. Initially wrong predictions can recover;no lab/notebook grants mastery.",
            "accessibility": "Native labeled keyboard controls,visible focus,320px reflow,reduced motion. Exact bootstrap IDs/multiplicities,tree/node paths,individual/mean outputs and OOB denominators/tags accompany diagrams. Show one tree/trace at a time;no color/hover-only or dense mesh meaning.",
            "provenance": "Wholly fictional embedded data,not production performance or causal evidence. Development permutation is exploration,not untouched final-test evaluation."}


def findings(labs):
    first, second = labs
    states = [state for lab in labs for state in lab["configurations"] if state["kind"] == "reference-fitted-forest"]
    uncovered = sum(len(state["expected"]["oob"]["uncovered_indices"]) for state in states)
    assert uncovered > 0
    changed = []
    for trees in [1, 3, 7]:
        base = next(state for state in first["configurations"] if state["fixture_id"] == "rf.regression.base.v1" and state["controls"].get("n_estimators") == trees and state["controls"].get("max_depth") == 2 and state["controls"].get("max_features") == 1)
        altered = next(state for state in first["configurations"] if state["fixture_id"] == "rf.regression.changed-row.v1" and state["controls"].get("n_estimators") == trees and state["controls"].get("max_depth") == 2 and state["controls"].get("max_features") == 1)
        changed.append({"trees": trees, "base": base["id"], "changed": altered["id"], "base_development_predictions": base["expected"]["outputs"]["development"]["predictions"], "changed_development_predictions": altered["expected"]["outputs"]["development"]["predictions"]})
    assert any(item["base_development_predictions"] != item["changed_development_predictions"] for item in changed)
    counterexamples = []
    correlated = next(data for data in second["fixtures"] if data["id"] == "rf.classification.correlated.v1")
    for state in second["configurations"]:
        if state["kind"] != "reference-fitted-forest" or state["fixture_id"] != correlated["id"]:
            continue
        for feature in state["expected"]["heldout_permutation"]["features"]:
            if feature["mean"] == 0:
                column = feature["feature"]
                model = DecisionTreeClassifier(criterion="gini", max_depth=1, random_state=SEED).fit(np.asarray(correlated["training_inputs"])[:, [column]], correlated["training_targets"])
                score = accuracy_score(correlated["development_targets"], model.predict(np.asarray(correlated["development_inputs"])[:, [column]]))
                assert score == 1
                counterexamples.append({"configuration": state["id"], "feature": column, "permutation_mean": 0., "standalone_feature_accuracy": float(score)})
    assert counterexamples
    feature_comparisons = []
    for lab in labs:
        controls = {"n_estimators": 7, "max_depth": 2}
        feature_states = [next(state for state in lab["configurations"] if state["kind"] == "reference-fitted-forest" and ".base." in state["fixture_id"] and all(state["controls"][key] == value for key, value in controls.items()) and state["controls"]["max_features"] == features) for features in [1, 2]]
        left, right = feature_states
        assert [tree["bootstrap_indices"] for tree in left["expected"]["trees"]] == [tree["bootstrap_indices"] for tree in right["expected"]["trees"]]
        roots = [tree["nodes"][0].get("feature") for tree in left["expected"]["trees"]]
        assert len(set(roots)) > 1
        feature_comparisons.append({"sample_one": left["id"], "sample_both": right["id"], "same_bootstrap_draws": True, "sample_one_retained_root_features": roots,
                                    "one_development_predictions": left["expected"]["outputs"]["development"]["predictions"], "both_development_predictions": right["expected"]["outputs"]["development"]["predictions"]})
    return {"fitted_forests": len(states), "individual_tree_fits": sum(len(state["expected"]["trees"]) for state in states), "uncovered_row_occurrences_tagged": uncovered,
            "feature_randomness_same_bootstrap_comparisons": feature_comparisons,
            "changed_training_target_comparison": changed, "informative_but_zero_permutation_counterexamples": counterexamples,
            "probability_majority_counterexample": "RF-E2.supplied.probability.0.v1", "argmax_threshold_equality_counterexample": "RF-E2.supplied.probability.1.v1"}


def main():
    labs = [manifest(task) for task in ["regression", "classification"]]
    source_root = Path(inspect.getfile(sklearn)).parent
    inspected = ["ensemble/_forest.py", "ensemble/_base.py", "tree/_splitter.pyx", "tree/_utils.pyx", "utils/_random.pxd", "inspection/_permutation_importance.py"]
    report = {"schema": "random-forests.parity.v1", "python": platform.python_version(), "platform": platform.platform(), "dependencies": PROFILE,
              "installed_source_sha256": {path: sha((source_root/path).read_bytes()) for path in inspected}, "counts": {lab["id"]: len(lab["configurations"]) for lab in labs},
              "checks": findings(labs), "ledger": [{"id": state["id"], "kind": state["kind"], "passed": True} for lab in labs for state in lab["configurations"]],
              "verification": "Independent weighted rational node gains/leaf outputs,source-reconstructed bootstrap/feature RNG,weighted independent tree refits,path routing,probability/mean aggregation,OOB eligible coverage,held-out permutations and repeated deterministic fitting. Semantic diagnostics are authored invariants,not library provenance validation.",
              "unverified": ["genuine screen-reader", "genuine browser zoom", "genuine Google Colab", "original-directory I/O reliability"]}
    blobs = {"rf-e1.manifest.v1.json": encode(labs[0]), "rf-e2.manifest.v1.json": encode(labs[1]), "parity-report.v1.json": encode(report)}
    blobs["freeze-lock.v1.json"] = encode({"schema": "random-forests.freeze.v1", "sha256": {name: sha(blob) for name, blob in blobs.items()}, "generator_sha256": sha(Path(__file__).read_bytes()), "conventions_sha256": sha((DEST/"AGGREGATION_BOOTSTRAP_OOB_CONVENTIONS.md").read_bytes())})
    DEST.mkdir(parents=True, exist_ok=True)
    for name, blob in blobs.items():
        if "--check" in sys.argv:
            assert (DEST/name).read_bytes() == blob, f"Frozen reference changed:{name}"
        else:
            (DEST/name).write_bytes(blob)
    print(f"PASS:{report['counts']};{report['checks']['fitted_forests']} forests,{report['checks']['individual_tree_fits']} trees;bootstrap/features/aggregation/OOB/permutation parity;byte-identical check supported")


if __name__ == "__main__":
    main()
