"""Trusted offline Decision Tree fixture authoring, never learner execution."""
import hashlib
import importlib.metadata
import json
import math
import platform
import sys
from fractions import Fraction
from pathlib import Path

import numpy as np
from sklearn.metrics import confusion_matrix, mean_absolute_error, mean_squared_error
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/verification/decision-trees"
PROFILE = {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn", "scipy"]}
assert platform.python_version() == "3.13.16"
assert PROFILE == {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}
SEED = 1729
ROWS = [[index, (index+1) % 2] for index in range(1, 9)]
DEV = [[1.5, 0], [3.5, 1], [5.5, 0], [8.5, 1]]


def encode(value):
    return (json.dumps(value, sort_keys=True, indent=2, allow_nan=False)+"\n").encode()


def sha(value):
    return hashlib.sha256(value).hexdigest()


def close(actual, expected):
    assert np.allclose(actual, expected, atol=1e-9, rtol=1e-9), (actual, expected)


def impurity(targets, task):
    if task == "regression":
        mean = sum(Fraction(value) for value in targets)/len(targets)
        return sum((Fraction(value)-mean)**2 for value in targets)/len(targets)
    counts = [targets.count(label) for label in sorted(set(targets))]
    return 1-sum(Fraction(count, len(targets))**2 for count in counts)


def node_summary(indices, targets, task, classes):
    values = [targets[index] for index in indices]
    result = {"row_indices": indices, "count": len(indices), "impurity": float(impurity(values, task)), "impurity_fraction": str(impurity(values, task))}
    if task == "regression":
        mean = sum(values)/len(values)
        result.update(mean=mean, sse=sum((value-mean)**2 for value in values), prediction=mean)
    else:
        counts = [values.count(label) for label in classes]
        proportions = [count/len(values) for count in counts]
        result.update(class_counts=counts, class_order=classes, class_proportions=proportions, prediction=classes[proportions.index(max(proportions))])
    return result


def candidates(rows, targets, indices, task, min_leaf):
    parent = impurity([targets[index] for index in indices], task)
    result = []
    for feature in range(len(rows[0])):
        distinct = sorted({float(np.float32(rows[index][feature])) for index in indices})
        for lower, upper in zip(distinct, distinct[1:]):
            threshold = (lower+upper)/2
            left = [index for index in indices if float(np.float32(rows[index][feature])) <= threshold]
            right = [index for index in indices if index not in left]
            if min(len(left), len(right)) < min_leaf:
                continue
            weighted = Fraction(len(left), len(indices))*impurity([targets[index] for index in left], task)+Fraction(len(right), len(indices))*impurity([targets[index] for index in right], task)
            gain = parent-weighted
            result.append({"feature": feature, "threshold": threshold, "left": left, "right": right, "gain": float(gain), "gain_fraction": str(gain)})
    return result


def params(task, depth, min_leaf, alpha):
    shared = dict(criterion="squared_error" if task == "regression" else "gini", splitter="best", max_depth=depth,
                  min_samples_split=2, min_samples_leaf=min_leaf, min_weight_fraction_leaf=0., max_features=None,
                  random_state=SEED, max_leaf_nodes=None, min_impurity_decrease=0., ccp_alpha=alpha, monotonic_cst=None)
    if task == "classification":
        shared["class_weight"] = None
    return shared


def estimator(task, settings):
    return DecisionTreeRegressor(**settings) if task == "regression" else DecisionTreeClassifier(**settings)


def fixtures(task):
    targets = [2, 3, 4, 5, 6, 7, 8, 12] if task == "regression" else [0, 0, 1, 0, 1, 1, 0, 1]
    changed = targets.copy()
    changed[7 if task == "regression" else 6] = 8 if task == "regression" else 1
    result = []
    for name, labels in [("base", targets), ("changed-row", changed)]:
        result.append({"id": f"dt.{task}.{name}.v1", "training_rows": ROWS, "training_targets": labels,
                       "development_rows": DEV, "development_targets": [3, 5, 7, 8] if task == "regression" else [0, 1, 0, 1],
                       "features": ["floor_area_50m2", "renovated_0_1"] if task == "regression" else ["support_contact_index", "plan_flag_0_1"],
                       "target": "house price in100000 fictional currency units" if task == "regression" else "0=stays,1=churns (positive)",
                       "change": "Only training row7 target12→8 changes" if task == "regression" and name != "base" else "Only training row6 label0→1 changes" if name != "base" else "Unchanged base data"})
    result += [{"id": f"dt.{task}.tied-features.v1", "training_rows": [[0, 0], [1, 1], [2, 2], [3, 3]], "training_targets": [0, 0, 2, 2] if task == "regression" else [0, 0, 1, 1], "development_rows": [[.5, .5], [2.5, 2.5]], "development_targets": [0, 2] if task == "regression" else [0, 1], "features": ["signal", "exact_copy"], "target": "numeric response" if task == "regression" else "0=stays,1=churns"},
               {"id": f"dt.{task}.constant-features.v1", "training_rows": [[1, 1]]*4, "training_targets": [2, 4, 6, 8] if task == "regression" else [0, 1, 0, 1], "development_rows": [[0, 0], [10, 10]], "development_targets": [5, 5] if task == "regression" else [0, 1], "features": ["constant_a", "constant_b"], "target": "numeric response" if task == "regression" else "0=stays,1=churns"},
               {"id": f"dt.{task}.pure-target.v1", "training_rows": [[0, 0], [1, 0], [2, 1], [3, 1]], "training_targets": [3]*4 if task == "regression" else [1]*4, "development_rows": [[.5, 0], [2.5, 1]], "development_targets": [3, 3] if task == "regression" else [1, 1], "features": ["signal", "flag"], "target": "numeric response" if task == "regression" else "1=churns;only class1 present in this training case"}]
    for data in result:
        data["training_ids"] = [f"{data['id']}.train.{index}" for index in range(len(data["training_rows"]))]
        data["development_ids"] = [f"{data['id']}.dev.{index}" for index in range(len(data["development_rows"]))]
        assert not set(data["training_ids"]) & set(data["development_ids"])
    return result


def route(query, nodes):
    path = [0]
    while nodes[path[-1]]["left"] != -1:
        node = nodes[path[-1]]
        path.append(node["left"] if float(np.float32(query[node["feature"]])) <= node["threshold"] else node["right"])
    return path


def metrics(predictions, actual, task):
    if task == "regression":
        squared = [(prediction-target)**2 for prediction, target in zip(predictions, actual)]
        absolute = [abs(prediction-target) for prediction, target in zip(predictions, actual)]
        close(sum(squared)/len(actual), mean_squared_error(actual, predictions))
        close(sum(absolute)/len(actual), mean_absolute_error(actual, predictions))
        return {"sse": sum(squared), "mse": sum(squared)/len(actual), "mae": sum(absolute)/len(actual)}
    matrix = [[sum(truth == row and predicted == column for truth, predicted in zip(actual, predictions)) for column in [0, 1]] for row in [0, 1]]
    assert matrix == confusion_matrix(actual, predictions, labels=[0, 1]).tolist()
    true_positive, false_positive, false_negative = matrix[1][1], matrix[0][1], matrix[1][0]
    return {"confusion_actual_rows_predicted_columns": matrix, "accuracy": sum(truth == prediction for truth, prediction in zip(actual, predictions))/len(actual),
            "precision": true_positive/(true_positive+false_positive) if true_positive+false_positive else {"tag": "undefined", "reason": "no-predicted-positives"},
            "recall": true_positive/(true_positive+false_negative) if true_positive+false_negative else {"tag": "undefined", "reason": "no-actual-positives"}}


def fitted(data, task, settings, suffix, pruning_path=None):
    model = estimator(task, settings).fit(data["training_rows"], data["training_targets"], sample_weight=None)
    repeated = estimator(task, settings).fit(data["training_rows"], data["training_targets"], sample_weight=None)
    tree = model.tree_
    for attribute in ["feature", "threshold", "children_left", "children_right", "impurity", "value"]:
        assert np.array_equal(getattr(tree, attribute), getattr(repeated.tree_, attribute))
    targets = data["training_targets"]
    classes = model.classes_.tolist() if task == "classification" else []
    nodes = []
    membership = {0: list(range(len(targets)))}
    for index in range(tree.node_count):
        indices = membership[index]
        summary = node_summary(indices, targets, task, classes)
        close(summary["impurity"], tree.impurity[index])
        assert summary["count"] == int(tree.n_node_samples[index])
        close(tree.value[index][0], [summary["mean"]] if task == "regression" else summary["class_proportions"])
        left, right = int(tree.children_left[index]), int(tree.children_right[index])
        node = {"id": index, "left": left, "right": right, "feature": int(tree.feature[index]), "threshold": float(tree.threshold[index]), **summary}
        if left != -1:
            feature, threshold = node["feature"], node["threshold"]
            left_rows = [row for row in indices if float(np.float32(data["training_rows"][row][feature])) <= threshold]
            right_rows = [row for row in indices if row not in left_rows]
            membership[left], membership[right] = left_rows, right_rows
            options = candidates(data["training_rows"], targets, indices, task, settings["min_samples_leaf"])
            gain = impurity([targets[row] for row in indices], task)-Fraction(len(left_rows), len(indices))*impurity([targets[row] for row in left_rows], task)-Fraction(len(right_rows), len(indices))*impurity([targets[row] for row in right_rows], task)
            best = max(Fraction(option["gain_fraction"]) for option in options)
            assert gain == best
            chosen = [option for option in options if option["feature"] == feature and option["left"] == left_rows and option["right"] == right_rows]
            assert len(chosen) == 1
            close(chosen[0]["threshold"], threshold)
            node.update(candidates=options, exact_best_candidates=[option for option in options if Fraction(option["gain_fraction"]) == best], local_gain=float(gain), globally_weighted_gain=len(indices)/len(targets)*float(gain))
            assert min(len(left_rows), len(right_rows)) >= settings["min_samples_leaf"]
        nodes.append(node)
    query_groups = {"training": data["training_rows"], "development": data["development_rows"]}
    if tree.children_left[0] != -1:
        feature = int(tree.feature[0]); threshold = float(tree.threshold[0]); equal = np.float32(threshold)
        assert float(equal) == threshold
        probes = []
        for value in [np.nextafter(equal, np.float32(-np.inf)), equal, np.nextafter(equal, np.float32(np.inf))]:
            query = list(data["training_rows"][0]); query[feature] = float(value); probes.append(query)
        query_groups["root_threshold_below_equal_above_float32"] = probes
    outputs = {}
    for group, queries in query_groups.items():
        paths = [route(query, nodes) for query in queries]
        leaves = [path[-1] for path in paths]
        assert model.apply(queries).tolist() == leaves
        path_matrix = model.decision_path(queries)
        for row, path in enumerate(paths):
            assert path_matrix.indices[path_matrix.indptr[row]:path_matrix.indptr[row+1]].tolist() == path
        predictions = [nodes[leaf]["prediction"] for leaf in leaves]
        close(model.predict(queries), predictions)
        result = {"queries": queries, "paths": paths, "leaf_ids": leaves, "predictions": predictions}
        if task == "classification":
            probabilities = [nodes[leaf]["class_proportions"] for leaf in leaves]
            close(model.predict_proba(queries), probabilities)
            result.update(class_order=classes, probabilities=probabilities)
        if group in ["training", "development"]:
            result["metrics"] = metrics(predictions, targets if group == "training" else data["development_targets"], task)
        outputs[group] = result
    if "root_threshold_below_equal_above_float32" in outputs:
        paths = outputs["root_threshold_below_equal_above_float32"]["paths"]
        assert paths[0][1] == paths[1][1] == nodes[0]["left"] and paths[2][1] == nodes[0]["right"]
    importance = [0.]*len(data["training_rows"][0])
    for node in nodes:
        if node["left"] != -1:
            decrease = node["count"]*node["impurity"]-nodes[node["left"]]["count"]*nodes[node["left"]]["impurity"]-nodes[node["right"]]["count"]*nodes[node["right"]]["impurity"]
            importance[node["feature"]] += decrease
    total = sum(importance)
    importance = [value/total for value in importance] if total else importance
    close(model.feature_importances_, importance)
    expected = {"nodes": nodes, "depth": int(model.get_depth()), "leaf_count": int(model.get_n_leaves()), "feature_importances": importance,
                "outputs": outputs, "pruning_path_training_only": pruning_path, "fit_ids": data["training_ids"], "class_order": classes}
    return {"id": f"DT-{'E1' if task == 'regression' else 'E2'}.{data['id']}.{suffix}", "kind": "fitted-tree", "fixture_id": data["id"], "controls": settings, "expected": expected,
            "prediction_question": "Predict the first development row's output class or numeric-leaf category,then explain its path/complexity mechanism before reveal.",
            "explanation": "Training learns candidate splits; inference routes through the frozen tree. Compare actual child sizes,local gain,leaf outputs and matching held-out errors. More depth or less pruning need not improve generalization. Impurity importance describes training split reductions,not causal effects.",
            "counterexample": "An outlier or changed training label can move rules. A pure leaf or locally simple path does not guarantee calibrated probabilities,causality or reliability outside its covered region."}


def manual_split(data, task, feature, threshold):
    indices = list(range(len(data["training_rows"])))
    left = [index for index in indices if float(np.float32(data["training_rows"][index][feature])) <= threshold]
    right = [index for index in indices if index not in left]
    assert left and right
    classes = sorted(set(data["training_targets"])) if task == "classification" else []
    parent = node_summary(indices, data["training_targets"], task, classes)
    children = [node_summary(rows, data["training_targets"], task, classes) for rows in [left, right]]
    weighted = sum(Fraction(child["count"], len(indices))*impurity([data["training_targets"][index] for index in child["row_indices"]], task) for child in children)
    gain = Fraction(parent["impurity_fraction"])-weighted
    query_children = [0 if float(np.float32(query[feature])) <= threshold else 1 for query in data["development_rows"]]
    expected = {"parent": parent, "children": children, "weighted_child_impurity": float(weighted), "local_gain": float(gain), "local_gain_fraction": str(gain),
                "development_child_ids": query_children, "development_predictions": [children[child]["prediction"] for child in query_children],
                "candidate_threshold": threshold, "equality": "left <= threshold;right > threshold", "not_fitted_optimal_split": True}
    for child in children:
        values = [data["training_targets"][index] for index in child["row_indices"]]
        constant = [[0]]*len(values)
        reference = estimator(task, params(task, 1, 1, 0)).fit(constant, values)
        close(reference.tree_.impurity[0], child["impurity"])
        close(reference.predict([[0]])[0], child["prediction"])
    return {"id": f"DT-{'E1' if task == 'regression' else 'E2'}.{data['id']}.manual.f{feature}.t{threshold}", "kind": "authored-candidate-not-fitted", "fixture_id": data["id"], "controls": {"feature": feature, "threshold": threshold}, "expected": expected,
            "prediction_question": "Predict which rows enter each child and whether the declared weighted error/impurity decreases.",
            "explanation": "This is an authored candidate split,not a claim sklearn selected this threshold. The left comparison includes equality. Regression impurity is MSE;classification impurity is Gini. Weight child mean impurities by membership,not an unweighted average.",
            "counterexample": "Weighting already summed child SSEs again is wrong. Regression leaf means and categorical class proportions have different meanings even when target codes look numeric."}


def reject(task, suffix, reason, input_values):
    return {"id": f"DT-{'E1' if task == 'regression' else 'E2'}.reject.{suffix}.v1", "kind": "rejected-diagnostic", "fixture_id": f"dt.{task}.base.v1",
            "controls": input_values, "expected": {"tag": "rejected", "reason": reason, "prediction": None},
            "prediction_question": "Predict accepted or rejected provenance/configuration before reveal.", "explanation": reason,
            "counterexample": "A strong training score or a library accepting arrays cannot repair leaked information,misaligned labels or an impossible authored empty child."}


def make_lab(task):
    data_sets = fixtures(task)
    states = []
    pruning_records = []
    for data in data_sets[:2]:
        for feature, threshold in [(0, 2.), (0, 4.), (0, 6.), (1, .5)]:
            states.append(manual_split(data, task, feature, threshold))
        for depth in [1, 2, 3]:
            for min_leaf in [1, 2]:
                states.append(fitted(data, task, params(task, depth, min_leaf, 0.), f"depth{depth}.leaf{min_leaf}.a0.v1"))
        unpruned = params(task, None, 1, 0.)
        path = estimator(task, unpruned).cost_complexity_pruning_path(data["training_rows"], data["training_targets"], sample_weight=None)
        alphas, risks = path.ccp_alphas.tolist(), path.impurities.tolist()
        assert np.all(np.diff(alphas) >= -1e-12) and np.all(np.diff(risks) >= -1e-12)
        pruning = {"fixture_id": data["id"], "fit_ids": data["training_ids"], "ccp_alphas": alphas, "weighted_leaf_impurities": risks}
        pruning_records.append(pruning)
        states.append(fitted(data, task, unpruned, "full.leaf1.a0.v1", pruning))
        for alpha_index, alpha in enumerate(sorted(set(value for value in alphas if value > 0))):
            state = fitted(data, task, params(task, None, 1, alpha), f"prune{alpha_index}.v1", pruning)
            close(sum(node["count"]/len(data["training_targets"])*node["impurity"] for node in state["expected"]["nodes"] if node["left"] == -1), risks[max(index for index, value in enumerate(alphas) if value == alpha)])
            states.append(state)
    for data in data_sets[2:]:
        states.append(fitted(data, task, params(task, 1, 1, 0.), "edge.v1"))
    states += [reject(task, "test-pruning", "Final-test feedback cannot choose depth or ccp_alpha;derive pruning candidates from training only and select within development/CV.", {"candidate_source": "final-test-targets"}),
               reject(task, "target-alignment", "Feature and target row identities are misaligned;matching lengths do not repair the labels.", {"feature_ids": ["train0", "train1"], "target_ids": ["train1", "train0"]}),
               reject(task, "empty-child", "The authored candidate leaves an empty child and is not a legal split;do not invent a child mean or class proportion.", {"feature": 0, "threshold": 100, "fixture_id": f"dt.{task}.base.v1"})]
    assert len(states) <= 64 and len({state["id"] for state in states}) == len(states)
    for state in states:
        if state["kind"] == "fitted-tree":
            first_prediction = state["expected"]["outputs"]["development"]["predictions"][0]
            if task == "regression":
                data = next(data for data in data_sets if data["id"] == state["fixture_id"])
                actual = data["development_targets"][0]
                state["prediction_question"] = f"The first development target is{actual}. Predict whether the frozen tree's numeric leaf output is below,equal to or above that value. Development labels do not fit the tree."
                state["prediction_options"] = [{"id": "below", "label": f"Leaf output below{actual}"}, {"id": "equal", "label": f"Leaf output equal to{actual}"}, {"id": "above", "label": f"Leaf output above{actual}"}]
                state["correct_prediction_id"] = "below" if first_prediction < actual else "above" if first_prediction > actual else "equal"
            else:
                state["prediction_question"] = "Predict the class for the first development row from its saved decision path and leaf frequencies."
                state["prediction_options"] = [{"id": "class0", "label": "Class0 stays"}, {"id": "class1", "label": "Class1 churns"}]
                state["correct_prediction_id"] = f"class{first_prediction}"
        elif state["kind"] == "authored-candidate-not-fitted":
            gain = Fraction(state["expected"]["local_gain_fraction"])
            state["prediction_options"] = [{"id": "positive", "label": "Positive size-weighted impurity reduction"}, {"id": "zero", "label": "Zero size-weighted impurity reduction"}, {"id": "negative", "label": "Negative size-weighted impurity reduction"}]
            state["correct_prediction_id"] = "positive" if gain > 0 else "negative" if gain < 0 else "zero"
        else:
            state["prediction_options"] = [{"id": "accept", "label": "Accept configuration/provenance"}, {"id": "reject", "label": "Reject configuration/provenance"}]
            state["correct_prediction_id"] = "reject"
        state["reason_options"] = [{"id": "mechanism", "label": state["explanation"]}, {"id": "shortcut", "label": "A lower training error proves the best unseen-data model"}, {"id": "causal", "label": "A chosen split or feature importance proves a causal effect"}]
        state["correct_reason_id"] = "mechanism"
        assert state["correct_prediction_id"] in {option["id"] for option in state["prediction_options"]}
    return {"schema": "supervised.decision-trees.experiment.v1", "id": "DT-E1" if task == "regression" else "DT-E2", "version": "1.0.0", "task": task,
            "objectives": ["DT01", "DT02", "DT04", "DT05"] if task == "regression" else ["DT01", "DT03", "DT04", "DT05", "DT06"],
            "prerequisites": ["EV", "LG01–03", "Mean/SSE and class-proportion recall", "Training-only/fold-only fitting"],
            "fixtures": data_sets, "pruning_paths": pruning_records, "configurations": states, "allowed_configuration_ids": [state["id"] for state in states],
            "provenance": "Wholly fictional teaching data;no production training labels or causal claims.",
            "controls": "Only listed manual split,depth,min-leaf,training-row-change and training-derived pruning tuples. No arbitrary values,queries,criterion,seed or Cartesian expansion.",
            "interaction": "Record a bounded prediction and reason before revealing the result. Inspect rows/paths and numerical gain,change one listed state,then explain a changed transfer case. Initially wrong predictions can recover. Replay/reset never awards mastery.",
            "accessibility": "Keyboard-native labeled controls,visible focus,320px reflow and reduced motion. Provide node/path text with IDs,feature<=threshold,children,memberships,leaf predictions and complete numerical error/impurity tables. Diagrams/partitions are redundant,not hover/color/spatial-only. No dense decision mesh."}


def verify_edges(labs):
    report = {}
    for lab in labs:
        task = lab["task"]
        tied = next(state for state in lab["configurations"] if state["kind"] == "fitted-tree" and "tied-features" in state["fixture_id"])
        assert len(tied["expected"]["nodes"][0]["exact_best_candidates"]) == 2
        constant = next(state for state in lab["configurations"] if state["kind"] == "fitted-tree" and "constant-features" in state["fixture_id"])
        assert len(constant["expected"]["nodes"]) == 1
        pure = next(state for state in lab["configurations"] if state["kind"] == "fitted-tree" and "pure-target" in state["fixture_id"])
        assert len(pure["expected"]["nodes"]) == 1 and pure["expected"]["nodes"][0]["impurity"] == 0
        base = next(data for data in lab["fixtures"] if data["id"] == f"dt.{task}.base.v1")
        try:
            estimator(task, params(task, 0, 1, 0)).fit(base["training_rows"], base["training_targets"])
        except ValueError:
            pass
        else:
            raise AssertionError("Invalid depth accepted")
        report[task] = {"exact_tied_candidate_count": 2, "seed1729_selected_feature": tied["expected"]["nodes"][0]["feature"], "no_split_root_valid": True, "pure_root_valid": True, "invalid_depth_zero_rejected": True}
    regression = labs[0]
    base_states = [state for state in regression["configurations"] if state["kind"] == "fitted-tree" and state["fixture_id"] == "dt.regression.base.v1"]
    counterexamples = []
    for simpler in base_states:
        for complex_state in base_states:
            simple_output, complex_output = simpler["expected"]["outputs"], complex_state["expected"]["outputs"]
            if simple_output["training"]["metrics"]["mse"] > complex_output["training"]["metrics"]["mse"] and simple_output["development"]["metrics"]["mse"] < complex_output["development"]["metrics"]["mse"]:
                counterexamples.append({"simpler": simpler["id"], "more_flexible": complex_state["id"], "simpler_train_mse": simple_output["training"]["metrics"]["mse"], "flexible_train_mse": complex_output["training"]["metrics"]["mse"], "simpler_dev_mse": simple_output["development"]["metrics"]["mse"], "flexible_dev_mse": complex_output["development"]["metrics"]["mse"]})
    assert counterexamples
    report["lower_training_error_worse_development"] = counterexamples[0]
    report["contextual_entropy_only"] = {"balanced_binary_entropy_bits": -sum(.5*math.log2(.5) for _ in [0, 1]), "balanced_binary_gini": float(impurity([0, 1], "classification")), "pure_entropy_bits": 0., "zero_log_zero_convention": "0 log2(0)=0;no entropy fit or scored gate"}
    assert report["contextual_entropy_only"]["balanced_binary_entropy_bits"] == 1
    return report


def main():
    labs = [make_lab("regression"), make_lab("classification")]
    checks = verify_edges(labs)
    report = {"schema": "decision-trees.parity.v1", "python": platform.python_version(), "platform": platform.platform(), "dependencies": PROFILE, "random_state": SEED, "passed": True,
              "state_counts": {lab["id"]: len(lab["configurations"]) for lab in labs}, "checks": checks,
              "ledger": [{"id": state["id"], "kind": state["kind"], "passed": True} for lab in labs for state in lab["configurations"]]}
    blobs = {"dt-e1.manifest.v1.json": encode(labs[0]), "dt-e2.manifest.v1.json": encode(labs[1]), "parity-report.v1.json": encode(report)}
    lock = {"schema": "decision-trees.freeze.v1", "sha256": {name: sha(blob) for name, blob in blobs.items()}, "generator_sha256": sha(Path(__file__).read_bytes()), "conventions_sha256": sha((DEST/"SPLIT_IMPURITY_PRUNING_CONVENTIONS.md").read_bytes())}
    blobs["freeze-lock.v1.json"] = encode(lock)
    DEST.mkdir(parents=True, exist_ok=True)
    if "--check" in sys.argv:
        for name, blob in blobs.items():
            assert (DEST/name).read_bytes() == blob, name
        print("PASS: "+str(report["state_counts"])+";manual/sklearn split,tree,path,pruning parity;byte-identical regeneration")
    else:
        for name, blob in blobs.items():
            (DEST/name).write_bytes(blob)
        print(json.dumps(lock, indent=2));print(report["state_counts"]);print(json.dumps(checks["lower_training_error_worse_development"], indent=2))


if __name__ == "__main__":
    main()
