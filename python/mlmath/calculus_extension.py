"""Bounded continuity and multivariable examples; existing calculus semantics unchanged."""
import math
from .calculus import central_derivative


def bounded(name, value, maximum):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or abs(value) > maximum:
        raise ValueError(f"{name} must be finite with magnitude at most {maximum}.")
    return value


def continuity_trace(kind, step):
    bounded("step", step, 1)
    if step < .000001 or kind not in ("smooth", "hole", "jump", "corner"):
        raise ValueError("Choose a supported case and step between 0.000001 and 1.")
    center = 1 if kind == "hole" else 0
    def value_at(value):
        return value + 1 if kind == "hole" else (-1 if value < 0 else 1) if kind == "jump" else abs(value) if kind == "corner" else value * value
    value = None if kind == "hole" else value_at(center)
    return {"schemaVersion": "1.0.0", "kind": kind, "center": center, "step": step, "value": value,
            "left": {"input": center-step, "value": value_at(center-step)}, "right": {"input": center+step, "value": value_at(center+step)},
            "limit": None if kind == "jump" else 2 if kind == "hole" else 0,
            "continuous": kind in ("smooth", "corner"), "differentiable": kind == "smooth", "derivative": 0 if kind == "smooth" else None,
            "leftSlope": None if value is None else (value_at(center-step)-value)/-step,
            "rightSlope": None if value is None else (value_at(center+step)-value)/step,
            "symmetricEstimate": central_derivative(value_at, center, step)}


def multivariable_trace(x, y, rate, shape, direction):
    bounded("x", x, 5); bounded("y", y, 5); bounded("rate", rate, .2)
    if rate < 0 or shape not in ("bowl", "saddle") or direction not in ("x", "y", "diagonal"):
        raise ValueError("Choose a supported function, direction and nonnegative rate.")
    coefficient = 3 if shape == "bowl" else -1
    def value_at(first, second):
        return first*first+coefficient*second*second
    gradient = [2*x, 2*coefficient*y]
    unit_direction = [1, 0] if direction == "x" else [0, 1] if direction == "y" else [math.sqrt(.5), math.sqrt(.5)]
    next_point = [x-rate*gradient[0], y-rate*gradient[1]]
    return {"schemaVersion": "1.0.0", "input": {"x": x, "y": y, "rate": rate, "shape": shape, "direction": direction},
            "value": value_at(x, y), "gradient": gradient,
            "numericalGradient": [central_derivative(lambda value: value_at(value, y), x), central_derivative(lambda value: value_at(x, value), y)],
            "unitDirection": unit_direction, "directionalDerivative": sum(gradient[index]*unit_direction[index] for index in range(2)),
            "update": {"displacement": [-rate*value for value in gradient], "next": next_point, "value": value_at(*next_point)},
            "jacobian": [[1, 1], [y, x]], "hessian": [[2, 0], [0, 2*coefficient]]}
