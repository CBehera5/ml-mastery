import json
import sys

import numpy as np


def reference_fixture():
    groups = {}
    for independent in (False, True):
        cases = []
        count = 3 if independent else 2
        type_values = [2.5, False, 4] if independent else ["3", True]
        areas = [3, 5, 6] if independent else [2, 4]
        weights = [80, 60, 40] if independent else [100, 100]
        biases = [20, 30, 10] if independent else [50, 50]
        starts = [7, 10, 12] if independent else [2, 5]
        changes = [2, -3, 4] if independent else [1, 2]
        literals = ["4", "6", "8"] if independent else ["2", "3"]
        for variant in range(count):
            cases.append({
                "variant": variant,
                "type": type(type_values[variant]).__name__,
                "area": areas[variant],
                "weight": weights[variant],
                "bias": biases[variant],
                "prediction": areas[variant] * weights[variant] + biases[variant],
                "repeated": str(areas[variant]) * 3,
                "final": starts[variant] + changes[variant],
                "comparison": starts[variant] + changes[variant] == starts[variant],
                "grouped": (float(literals[variant]) + 1) * 100,
                "distributed": float(literals[variant]) * 100 + 100,
                "ungrouped": float(literals[variant]) + 1 * 100,
            })
        groups["independent_test_only" if independent else "practice"] = cases
    try:
        float("unknown")
    except ValueError:
        failure = "ValueError"
    else:
        raise AssertionError("Invalid conversion did not fail")
    experiments = [
        {"id": "numeric-2", "value": str(2 * 100 + 50), "type": type(2 * 100 + 50).__name__},
        {"id": "numeric-4", "value": str(4 * 100 + 50), "type": type(4 * 100 + 50).__name__},
        {"id": "decimal", "value": str(2.5 * 100 + 50), "type": type(2.5 * 100 + 50).__name__},
        {"id": "text", "value": repr("2" * 3), "type": type("2" * 3).__name__},
        {"id": "convert", "value": str(float("2") * 100 + 50), "type": type(float("2") * 100 + 50).__name__},
        {"id": "invalid", "value": failure, "type": "error"},
    ]
    features = np.array([[2, 10], [1, 5]], dtype=np.float64)
    weights = np.array([100, -2], dtype=np.float64)
    training = np.array([10, np.nan, 30], dtype=np.float64)
    return {
        "contract": "python-p01-reference.v1",
        "environment": "macos-arm64-cpython-3.13.16-reference.1",
        "author": "python/mlmath/python_p01_reference.py",
        "groups": groups,
        "experiments": experiments,
        "probes": {
            "broadcast": {"prediction": (features @ weights + 50).tolist(), "column_shift": (features + np.array([1, 2])).tolist()},
            "join": {"left": 3, "inner": 2, "null_keys_match": True},
            "training_only": {"median": float(np.nanmedian(training)), "held_out": [1000, float(np.nanmedian(training))]},
        },
    }


def verify_scientific_probes():
    import importlib.metadata
    import pandas as pd
    from sklearn.impute import SimpleImputer

    assert sys.version_info[:3] == (3, 13, 16)
    expected = {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1"}
    assert {name: importlib.metadata.version(name) for name in expected} == expected
    fixture = reference_fixture()
    left = pd.DataFrame({"key": ["A", "B"]})
    right = pd.DataFrame({"key": ["A", "A"], "value": [1, 2]})
    assert len(left.merge(right, how="left", on="key", validate="one_to_many")) == fixture["probes"]["join"]["left"]
    assert len(left.merge(right, how="inner", on="key", validate="one_to_many")) == fixture["probes"]["join"]["inner"]
    null_left = pd.DataFrame({"key": [None]})
    null_right = pd.DataFrame({"key": [None], "value": [1]})
    assert len(null_left.merge(null_right, how="inner", on="key", validate="one_to_one")) == 1
    imputer = SimpleImputer(strategy="median").fit([[10], [np.nan], [30]])
    np.testing.assert_array_equal(imputer.transform([[1000], [np.nan]]).ravel(), fixture["probes"]["training_only"]["held_out"])
    assert imputer.statistics_.tolist() == [20]
    try:
        np.ones((2, 3)) + np.ones((2,))
    except ValueError:
        pass
    else:
        raise AssertionError("Incompatible broadcast unexpectedly succeeded")
    return {"profile": expected, "broadcast": "passed", "join_cardinality_and_null_keys": "passed", "train_only_fit": "passed"}


if __name__ == "__main__":
    print(json.dumps(verify_scientific_probes() if "--scientific" in sys.argv else reference_fixture(), indent=2, allow_nan=False))
