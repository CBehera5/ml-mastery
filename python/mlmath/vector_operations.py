"""Bounded two-dimensional vector exploration, vector-operations.v1."""
import math
from .dot_product import dot_product_trace


def vector_operations_trace(left, right, scale):
    for values in (left, right):
        if not isinstance(values, list) or len(values) != 2 or any(
            isinstance(value, bool) or not isinstance(value, (int, float))
            or not math.isfinite(value) or abs(value) > 100 for value in values
        ):
            raise ValueError("Explorer vectors require exactly two finite components of magnitude at most 100.")
    if isinstance(scale, bool) or not isinstance(scale, (int, float)) or not math.isfinite(scale) or abs(scale) > 10:
        raise ValueError("Scale must be finite with magnitude at most 10.")
    left_magnitude = math.hypot(*left)
    right_magnitude = math.hypot(*right)
    dot = dot_product_trace(left, right)["value"]
    unit_direction = None if left_magnitude == 0 else [value / left_magnitude for value in left]
    right_direction = None if right_magnitude == 0 else [value / right_magnitude for value in right]
    cosine = None if unit_direction is None or right_direction is None else max(-1, min(1, dot_product_trace(unit_direction, right_direction)["value"]))
    projected_length = None if right_direction is None else dot_product_trace(left, right_direction)["value"]
    return {
        "schemaVersion": "1.0.0", "input": {"left": list(left), "right": list(right), "scale": scale},
        "sum": [value + right[index] for index, value in enumerate(left)],
        "scaled": [scale * value for value in left],
        "leftMagnitude": left_magnitude, "rightMagnitude": right_magnitude, "dot": dot,
        "unitDirection": unit_direction,
        "cosine": cosine, "angleDegrees": None if cosine is None else math.degrees(math.acos(cosine)),
        "projection": None if right_direction is None else [projected_length * value for value in right_direction],
    }
