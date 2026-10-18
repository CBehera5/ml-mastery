"""Trusted offline fixture authoring only; never accepts learner programs."""
import hashlib
import importlib.metadata
import json
import math
import platform
import sys
from pathlib import Path

import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/verification/knn"
PROFILE = {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn", "scipy"]}
assert platform.python_version() == "3.13.16"
assert PROFILE == {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}


def encoded(value):
    return (json.dumps(value, sort_keys=True, indent=2, allow_nan=False) + "\n").encode()


def digest(value):
    return hashlib.sha256(value).hexdigest()


def close(actual, expected):
    assert np.allclose(actual, expected, atol=1e-9, rtol=1e-9), (actual, expected)


def dataset(identity, rows, labels, queries, query_labels, features):
    return {"id": identity, "rows": rows, "labels": labels, "queries": queries,
            "query_labels": query_labels, "features": features,
            "training_ids": [f"{identity}.train.{index}" for index in range(len(rows))],
            "query_ids": [f"{identity}.dev.{index}" for index in range(len(queries))]}


DATA = [
    dataset("kn.clean.v1", [[0], [2], [5], [9], [14], [20]], [0, 0, 1, 1, 1, 0], [[3.2], [12.3]], [0, 1], ["usage_index"]),
    dataset("kn.noisy.v1", [[0], [2], [5], [9], [14], [20]], [0, 1, 0, 0, 0, 1], [[2.1], [12.3]], [0, 0], ["usage_index"]),
    dataset("kn.duplicates.v1", [[0], [0], [2], [5], [9], [14]], [0, 1, 1, 0, 1, 0], [[0], [0.7]], [1, 0], ["usage_index"]),
    dataset("kn.vote-tie.v1", [[0], [2]], [0, 1], [[1]], [1], ["usage_index"]),
    dataset("kn.units.v1", [[100, 1], [220, 8], [410, 2], [650, 9], [900, 3], [1300, 7]], [0, 1, 0, 1, 0, 1], [[440, 7.8], [850, 8.1]], [1, 1], ["spend_currency", "support_contacts"]),
    dataset("kn.irrelevant.v1", [[100, 1, 0], [220, 8, 70], [410, 2, 85], [650, 9, 10], [900, 3, 40], [1300, 7, 95]], [0, 1, 0, 1, 0, 1], [[440, 7.8, 82], [850, 8.1, 42]], [1, 1], ["spend_currency", "support_contacts", "irrelevant_badge_index"]),
]


def state(data, query_index, neighbors, weighting="uniform", scaled=False):
    rows = np.asarray(data["rows"], dtype=np.float64)
    query = np.asarray([data["queries"][query_index]], dtype=np.float64)
    scaler = StandardScaler().fit(rows) if scaled else None
    if scaled:
        means = [sum(float(row[column]) for row in rows) / len(rows) for column in range(rows.shape[1])]
        variances = [sum((float(row[column]) - means[column]) ** 2 for row in rows) / len(rows) for column in range(rows.shape[1])]
        close(scaler.mean_, means)
        close(scaler.var_, variances)
        close(scaler.scale_, [math.sqrt(value) if value else 1 for value in variances])
    transformed = scaler.transform(rows) if scaled else rows
    transformed_query = scaler.transform(query) if scaled else query
    distances = [math.sqrt(sum((float(value) - float(query_value)) ** 2 for value, query_value in zip(row, transformed_query[0]))) for row in transformed]
    ordered = sorted(range(len(rows)), key=lambda index: (distances[index], index))
    boundary_tie = neighbors < len(rows) and distances[ordered[neighbors - 1]] == distances[ordered[neighbors]]
    assert not boundary_tie, "Do not expose a backend-dependent cutoff as a determinate prediction"
    selected = ordered[:neighbors]
    zero_present = any(distances[index] == 0 for index in selected)
    weights = [1.0 if weighting == "uniform" else (float(distances[index] == 0) if zero_present else 1 / distances[index]) for index in selected]
    totals = [sum(weight for index, weight in zip(selected, weights) if data["labels"][index] == label) for label in [0, 1]]
    prediction = int(totals[1] > totals[0])
    estimator = KNeighborsClassifier(n_neighbors=neighbors, weights=weighting, algorithm="brute", metric="euclidean", n_jobs=1).fit(transformed, data["labels"])
    library_distances, library_indices = estimator.kneighbors(transformed_query)
    close(sorted(library_distances[0]), sorted(distances[index] for index in selected))
    assert set(library_indices[0]) == set(selected)
    assert int(estimator.predict(transformed_query)[0]) == prediction
    close(estimator.predict_proba(transformed_query)[0], np.array(totals) / sum(totals))
    assert estimator.classes_.tolist() == [0, 1]
    identity = f"{data['id']}.q{query_index}.k{neighbors}.{weighting}.{'scaled' if scaled else 'raw'}"
    return {"id": identity, "dataset_id": data["id"], "query_index": query_index, "k": neighbors, "weights": weighting, "scaled": scaled,
            "fit_ids": data["training_ids"], "query_id": data["query_ids"][query_index],
            "scaler": {"mean": scaler.mean_.tolist(), "scale": scaler.scale_.tolist(), "variance": scaler.var_.tolist()} if scaled else None,
            "transformed_rows": transformed.tolist(), "transformed_query": transformed_query[0].tolist(),
            "distances_in_training_order": distances, "ordered_indices": ordered, "selected_indices": selected,
            "library_neighbor_order": library_indices[0].tolist(), "selected_weights": weights,
            "class_totals_0_1": totals, "class_fractions_0_1": [value / sum(totals) for value in totals],
            "prediction": prediction, "development_label": data["query_labels"][query_index], "correct": prediction == data["query_labels"][query_index],
            "prediction_options": ["class0", "class1"],
            "reason_options": ["distance-selects-labels-vote", "average-label-codes", "query-label-determines-vote"],
            "correct_reason": "distance-selects-labels-vote",
            "counterexample": "Changing a development outcome label must not change neighbor selection or the predicted vote; target leakage would make it do so.",
            "brute_distance_evaluations": len(rows), "coordinate_difference_count": int(rows.size),
            "text": f"Query {query_index}; k={neighbors}; {weighting}; {'training-scaled' if scaled else 'raw'}: class totals {totals}, predicted {prediction}. Distances select neighbors; labels determine votes. A correct vote is not calibrated future risk."}


def manifest(identity, objectives, datasets, states, controls, explanation):
    return {"schema": "supervised.knn.experiment.v1", "id": identity, "version": "1.0.0", "objectives": objectives,
            "prerequisites": ["Euclidean distance", "feature units", "training/development separation", "class labels"],
            "labels": {"0": "stays", "1": "churns (positive class)"}, "provenance": "Wholly fictional authored observations; no production labels or causal claims.",
            "datasets": datasets, "controls": controls, "configurations": states,
            "interaction": {"before_reveal": "Select predicted class 0/1 (or rejection for a diagnostic) and one authored reason before revealing any output.",
                            "after_reveal": "Compare distances, selected row IDs, votes and explanation; change a listed configuration and complete a changed transfer check. Initial error is recoverable.",
                            "no_mastery": "Experiment interaction never awards independent module mastery."},
            "explanation": explanation,
            "accessibility": "Native labeled selects/buttons; keyboard and visible focus; numerical tables list every distance/row/label/weight, class totals and prediction; text explains changes. Never rely on color, hover or animation. Finite query presets, not drag-only controls.",
            "allowed_configuration_ids": [entry["id"] for entry in states]}


def edge_checks():
    near = [1.0, 1.0 + 1e-7]
    assert near[0] != near[1] and sorted(range(2), key=lambda index: near[index]) == [0, 1]
    scaler = StandardScaler().fit([[1, 5], [3, 5]])
    close(scaler.var_, [1, 0]); close(scaler.scale_, [1, 1])
    for order in [[0, 1], [1, 0]]:
        model = KNeighborsClassifier(n_neighbors=1, algorithm="brute", metric="euclidean").fit(np.array([[0.0], [2.0]])[order], np.array([0, 1])[order])
        assert int(model.predict([[1.0]])[0]) == order[0]
    for invalid in [0, 7]:
        try:
            KNeighborsClassifier(n_neighbors=invalid, algorithm="brute").fit(DATA[0]["rows"], DATA[0]["labels"]).predict([[1.0]])
        except ValueError:
            pass
        else:
            raise AssertionError("Invalid k accepted")
    return {"near_equal_not_tied": True, "constant_feature_scale_one": True,
            "kth_tie_training_order_counterexample": "At query1 between training0/class0 and2/class1,k1, reversing rows reverses sklearn prediction. Reject this ambiguous cutoff in learner controls.",
            "invalid_k_zero_and_above_n_rejected": True}


def main():
    first = [state(data, query, neighbors, weighting) for data in DATA[:2] for query in range(2) for neighbors in [1, 3, 5] for weighting in ["uniform", "distance"]]
    first += [state(DATA[2], query, neighbors, weighting) for query in range(2) for neighbors in [3, 5] for weighting in ["uniform", "distance"]]
    first += [state(DATA[3], 0, 2, weighting) for weighting in ["uniform", "distance"]]
    second = [state(data, query, neighbors, scaled=scaled) for data in DATA[4:] for query in range(2) for neighbors in [1, 3, 5] for scaled in [False, True]]
    for code, reason in [("test-fit", "Never fit scaling with development/test rows"), ("fold-k", "k5 is illegal for a four-row fold-training set"), ("cutoff-tie", "Equal-distance kth membership is deliberately unsupported, not silently resolved by row IDs")]:
        second.append({"id": f"KN-E2.reject.{code}.v1", "outcome": {"tag": "rejected", "reason": reason}, "prediction": None})
    assert len(first) == 34 and len(second) == 27
    assert any(entry["prediction"] != next(other["prediction"] for other in second if other.get("dataset_id") == entry.get("dataset_id") and other.get("query_index") == entry.get("query_index") and other.get("k") == entry.get("k") and other.get("scaled") != entry.get("scaled")) for entry in second if "dataset_id" in entry)
    artifacts = {
        "kn-e1.manifest.v1.json": manifest("KN-E1", ["KN01", "KN03"], DATA[:4], first,
            "Only listed dataset/query/k/weight tuples. Clean/noisy:k1,3,5; duplicates:k3,5; explicit whole-set vote tie:k2. No arbitrary queries or k.",
            "Nearest is not necessarily representative. Compare k1 noisy-label sensitivity with k3/5; larger k need not improve every query. Uniform and inverse-distance weights differ. Exact duplicate conflicts produce a vote tie under zero-only inverse weighting; class0 wins the tied class totals, not a causal judgment."),
        "kn-e2.manifest.v1.json": manifest("KN-E2", ["KN02", "KN04"], DATA[4:], second,
            "Only listed query0/1,k1/3/5,raw/train-scaled,base/irrelevant-dimension configurations; uniform votes. Three explicit rejected permission/configuration diagnostics.",
            "Units can dominate Euclidean geometry. Train-fitted scaling changes relative coordinate influence; an irrelevant badge coordinate can change neighbors even after scaling. Six rows do not prove a high-dimensional theorem; count 12 versus18 coordinate differences per brute-force query and inspect minority errors. Fast storage does not imply cheap inference.")}
    report = {"schema": "knn.parity.v1", "python": platform.python_version(), "platform": platform.platform(), "dependencies": PROFILE,
              "passed": True, "state_counts": {"KN-E1": 34, "KN-E2": 27}, "prediction_states": 58, "diagnostic_states": 3,
              "checks": edge_checks(), "ledger": [{"id": entry["id"], "passed": True, "kind": "trusted_sklearn_and_manual_distance_vote" if "dataset_id" in entry else "permission_or_ambiguity_rejection"} for entry in first + second]}
    artifacts["parity-report.v1.json"] = report
    blobs = {name: encoded(value) for name, value in artifacts.items()}
    lock = {"schema": "knn.freeze.v1", "sha256": {name: digest(blob) for name, blob in blobs.items()},
            "generator_sha256": digest(Path(__file__).read_bytes()), "conventions_sha256": digest((DEST / "DISTANCE_TIE_SCALING_CONVENTIONS.md").read_bytes())}
    blobs["freeze-lock.v1.json"] = encoded(lock)
    if "--check" in sys.argv:
        for name, blob in blobs.items():
            assert (DEST / name).read_bytes() == blob, name
        print("PASS: 61 states, 58 sklearn/manual predictions, three diagnostics, edge probes; byte-identical frozen regeneration")
    else:
        DEST.mkdir(parents=True, exist_ok=True)
        for name, blob in blobs.items():
            (DEST / name).write_bytes(blob)
        print(json.dumps(lock, indent=2))


if __name__ == "__main__":
    main()
