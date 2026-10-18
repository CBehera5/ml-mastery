"""Generate versioned shared fixtures from the Python reference engine."""

from __future__ import annotations

import json
from pathlib import Path

from mlmath import (
    calculus_trace,
    dot_product_trace,
    feature_scaling_trace,
    linear_neuron_trace,
    matrix_matrix_trace,
    matrix_vector_trace,
    regression_evaluation_trace,
    regression_gradient_trace,
    regression_training_trace,
    regression_update_trace,
)

CASES = [
    {
        "name": "reference-example",
        "input": {"inputs": [2, 3], "weights": [1, 2], "bias": 1, "target": 12, "learningRate": 0.01},
    },
    {
        "name": "three-dimensional-fractional",
        "input": {
            "inputs": [0.5, -2.0, 1.25],
            "weights": [-1.5, 0.25, 2.0],
            "bias": -0.75,
            "target": 1.5,
            "learningRate": 0.05,
        },
    },
    {
        "name": "zero-error",
        "input": {"inputs": [1, -1], "weights": [2, 2], "bias": 3, "target": 3, "learningRate": 0.1},
    },
]


def main() -> None:
    fixtures = []
    for case in CASES:
        values = case["input"]
        trace = linear_neuron_trace(
            values["inputs"], values["weights"], values["bias"], values["target"], values["learningRate"]
        )
        fixtures.append({"name": case["name"], "input": values, "trace": trace})
    destination = Path(__file__).parents[2] / "packages" / "math-contracts" / "fixtures" / "linear-neuron.v1.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps({"schemaVersion": "1.0.0", "cases": fixtures}, indent=2) + "\n")
    dot_cases = [
        {"name": "house-score", "input": {"features": [2, 3, 4], "weights": [5, 2, 3]}},
        {"name": "signed-values", "input": {"features": [-1.5, 0, 2], "weights": [4, -3, 0.5]}},
        {"name": "single-dimension", "input": {"features": [0.25], "weights": [8]}},
    ]
    dot_fixtures = [{**case, "trace": dot_product_trace(**case["input"])} for case in dot_cases]
    dot_destination = destination.parent / "dot-product.v1.json"
    dot_destination.write_text(json.dumps({"schemaVersion": "1.0.0", "cases": dot_fixtures}, indent=2) + "\n")
    matrix_fixtures = {
        "schemaVersion": "1.0.0",
        "matrixVector": [
            {"name": "three-houses", "input": {"matrix": [[2,3,4],[4,2,5],[3,4,2]], "vector": [5,2,3]}},
            {"name": "rectangular", "input": {"matrix": [[1,2,3],[4,5,6]], "vector": [0.5,-1,2]}},
        ],
        "matrixMatrix": [
            {"name": "two-outputs", "input": {"left": [[2,3,4],[4,2,5],[3,4,2]], "right": [[5,1],[2,-1],[3,2]]}},
            {"name": "rectangular", "input": {"left": [[1,2,3],[4,5,6]], "right": [[1,2],[0,1],[-1,3]]}},
        ],
    }
    for case in matrix_fixtures["matrixVector"]: case["trace"] = matrix_vector_trace(**case["input"])
    for case in matrix_fixtures["matrixMatrix"]: case["trace"] = matrix_matrix_trace(**case["input"])
    (destination.parent / "matrix.v1.json").write_text(json.dumps(matrix_fixtures, indent=2) + "\n")
    calculus_cases=[{"name":f"weight-{w}","input":{"weight":w,"h":0.5},"trace":calculus_trace(w,0.5)} for w in [2,3,4]]
    (destination.parent/"calculus.v1.json").write_text(json.dumps({"schemaVersion":"1.0.0","cases":calculus_cases},indent=2)+"\n")
    regression_cases = [
        {"name": "single-feature", "input": {"features": [[1], [2], [3]], "targets": [3, 5, 7], "weights": [1], "bias": 0, "learningRate": 0.01, "iterations": 5}},
        {"name": "multiple-feature", "input": {"features": [[1, 2], [2, 0], [3, 1]], "targets": [5, 4, 7], "weights": [0.5, -1], "bias": 1, "learningRate": 0.02, "iterations": 4}},
        {"name": "exact-predictions", "input": {"features": [[1], [2], [3]], "targets": [3, 5, 7], "weights": [2], "bias": 1, "learningRate": 0.01, "iterations": 2}},
    ]
    for case in regression_cases:
        values = case["input"]
        common = {name: values[name] for name in ("features", "targets", "weights", "bias")}
        case["evaluation"] = regression_evaluation_trace(**common)
        case["gradient"] = regression_gradient_trace(**common)
        case["update"] = regression_update_trace(**common, learning_rate=values["learningRate"])
        case["training"] = regression_training_trace(**common, learning_rate=values["learningRate"], iterations=values["iterations"])
    scaling_input = [[1, 10], [2, 20], [3, 40]]
    invalid_cases = [
        {"name": "empty-dataset", "operation": "evaluation", "input": {"features": [], "targets": [], "weights": [], "bias": 0}, "expectedError": "features must be a non-empty rectangular numeric matrix"},
        {"name": "zero-variance-feature", "operation": "scaling", "input": {"features": [[1, 4], [2, 4]]}, "expectedError": "feature column 1 has zero variance and cannot be scaled; remove it or choose a varying feature"},
        {"name": "invalid-learning-rate", "operation": "training", "input": {"features": [[1]], "targets": [1], "weights": [0], "bias": 0, "learningRate": 0, "iterations": 2}, "expectedError": "learningRate must be greater than 0 and at most 10"},
    ]
    divergent_input = {"features": [[1e100]], "targets": [1], "weights": [0], "bias": 0, "learningRate": 1, "iterations": 3}
    regression_fixture = {
        "schemaVersion": "1.0.0",
        "tolerance": {"absolute": 1e-9, "gradientCheck": 1e-6},
        "cases": regression_cases,
        "scaling": {"input": {"features": scaling_input}, "trace": feature_scaling_trace(scaling_input)},
        "invalidCases": invalid_cases,
        "divergent": {"input": divergent_input, "trace": regression_training_trace(divergent_input["features"], divergent_input["targets"], divergent_input["weights"], divergent_input["bias"], divergent_input["learningRate"], divergent_input["iterations"])},
    }
    (destination.parent / "regression.v1.json").write_text(json.dumps(regression_fixture, indent=2, allow_nan=False) + "\n")


if __name__ == "__main__":
    main()
