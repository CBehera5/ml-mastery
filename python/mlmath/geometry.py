"""Chosen bounded 2D transformations and analytic eigenpair examples."""
import math
from .matrix import matrix_vector_trace, matrix_matrix_trace
from .dot_product import dot_product_trace

TRANSFORMS = {
    "identity": [[1, 0], [0, 1]], "scale": [[2, 0], [0, 1]],
    "reflection": [[-1, 0], [0, 1]], "rotation": [[0, -1], [1, 0]],
    "shear": [[1, 1], [0, 1]], "dependent": [[1, 2], [0, 0]],
    "collapse": [[1, 0], [0, 0]], "zero": [[0, 0], [0, 0]],
    "near": [[1, 0], [0, 1e-10]], "spread": [[9, 0], [0, 1]],
}
EIGENPAIRS = {
    "identity": [([1, 0], 1), ([0, 1], 1)], "scale": [([1, 0], 2), ([0, 1], 1)],
    "reflection": [([1, 0], -1), ([0, 1], 1)], "shear": [([1, 0], 1)],
    "collapse": [([1, 0], 1), ([0, 1], 0)], "spread": [([1, 0], 9), ([0, 1], 1)],
}


def get_matrix(name):
    if not isinstance(name, str) or name not in TRANSFORMS:
        raise ValueError("Choose a supported named 2D transformation.")
    return [list(row) for row in TRANSFORMS[name]]


def bounded_vector(values):
    if not isinstance(values, list) or len(values) != 2 or any(isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or abs(value) > 10 for value in values):
        raise ValueError("Use two finite coordinates of magnitude at most 10.")
    return list(values)


def transform(matrix, vector):
    return matrix_vector_trace(matrix, vector)["result"]


def geometry_trace(first, second, vector, coefficients):
    first_id, second_id = first, second
    first, second = get_matrix(first), get_matrix(second)
    vector, coefficients = bounded_vector(vector), bounded_vector(coefficients)
    determinant = first[0][0] * first[1][1] - first[0][1] * first[1][0]
    rank = 2 if determinant != 0 else 0 if all(value == 0 for row in first for value in row) else 1
    status = "singular" if determinant == 0 else "near-singular" if abs(determinant) <= 1e-8 else "available"
    inverse = [[first[1][1] / determinant, -first[0][1] / determinant], [-first[1][0] / determinant, first[0][0] / determinant]] if status == "available" else None
    mapped = transform(first, vector)
    first_then_second = matrix_matrix_trace(second, first)["result"]
    second_then_first = matrix_matrix_trace(first, second)["result"]
    grid = []
    for coordinate in [-2, -1, 0, 1, 2]:
        for start, end in [([-2, coordinate], [2, coordinate]), ([coordinate, -2], [coordinate, 2])]:
            grid.append({"from": start, "to": end, "mappedFrom": transform(first, start), "mappedTo": transform(first, end)})
    return {
        "schemaVersion": "1.0.0", "input": {"first": first_id, "second": second_id, "vector": vector, "coefficients": coefficients},
        "first": first, "second": second, "mapped": mapped,
        "basis": [transform(first, [1, 0]), transform(first, [0, 1])], "spanPoint": transform(first, coefficients),
        "rank": rank, "determinant": determinant, "signedArea": determinant, "area": abs(determinant), "inverseStatus": status, "inverse": inverse,
        "roundTrip": None if inverse is None else transform(inverse, mapped),
        "composition": {"firstThenSecond": first_then_second, "secondThenFirst": second_then_first, "firstThenSecondPoint": transform(first_then_second, vector), "secondThenFirstPoint": transform(second_then_first, vector)},
        "grid": grid, "points": [{"point": point, "mapped": transform(first, point)} for point in [[0, 0], [1, 0], [0, 1], [1, 1], vector]],
    }


def eigen_trace(name, vector):
    if not isinstance(name, str) or name not in [*EIGENPAIRS, "rotation"]:
        raise ValueError("Choose a supported known-eigenpair example.")
    matrix, vector = get_matrix(name), bounded_vector(vector)
    mapped = transform(matrix, vector)
    zero = all(value == 0 for value in vector)
    magnitude_scale = max(abs(value) for value in vector)
    direction = [0, 0] if zero else [value / magnitude_scale for value in vector]
    mapped_direction = transform(matrix, direction)
    squared_magnitude = dot_product_trace(direction, direction)["value"]
    candidate = None if zero else dot_product_trace(direction, mapped_direction)["value"] / squared_magnitude
    residual = None if candidate is None else math.hypot(*[value - candidate * direction[index] for index, value in enumerate(mapped_direction)])
    is_eigenvector = not zero and residual is not None and math.isfinite(residual) and residual <= 1e-9 * max(1, math.hypot(*mapped_direction), math.hypot(*direction))
    reason = "The zero vector is excluded from the definition of an eigenvector." if zero else "A nonzero vector maps to zero: this is an eigenvector with eigenvalue zero, although the output has no direction." if is_eigenvector and candidate == 0 else "The line is preserved but the pointing direction reverses: the eigenvalue is negative." if is_eigenvector and candidate < 0 else "The mapped vector remains on the same line: this is an eigenvector." if is_eigenvector else "The vector leaves its original line; it is not an eigenvector in this example."
    return {"schemaVersion": "1.0.0", "transform": name, "matrix": matrix, "vector": vector, "mapped": mapped, "isEigenvector": is_eigenvector, "eigenvalue": candidate if is_eigenvector else None, "reason": reason, "knownPairs": [{"vector": list(values), "value": value, "mapped": transform(matrix, values)} for values, value in EIGENPAIRS.get(name, [])], "hasRealEigenvectors": name != "rotation"}
