import ast
import json
import re
import warnings
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
AMOUNTS = (1, 2, 3, 4, 5, 7)


def normalize(value):
    if isinstance(value, np.ndarray):
        assert value.ndim <= 2 and value.size <= 64 and all(size <= 32 for size in value.shape)
        assert str(value.dtype) in ("int64", "float64", "bool")
        return {"shape": list(value.shape), "dtype": str(value.dtype), "values": normalize(value.tolist())}
    if isinstance(value, np.generic):
        return normalize(value.item())
    if isinstance(value, float) and not np.isfinite(value):
        return {"tag": "missing"} if np.isnan(value) else {"tag": "nonfinite", "value": "+inf" if value > 0 else "-inf"}
    if isinstance(value, dict):
        return {key: normalize(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [normalize(item) for item in value]
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        assert abs(value) <= 1e12
    return value


def authored_case(lesson, objective, amount):
    if type(lesson) is not int or lesson not in range(1, 7) or type(objective) is not int or objective not in range(4) or type(amount) is not int or amount not in AMOUNTS:
        raise ValueError("Only enumerated trusted NumPy configurations are supported.")
    area = amount
    if amount == 3 and lesson == 4:
        area = 2
    if amount == 3 and lesson == 6:
        area = 1
    table = f"np.array([[{area}, 10], [{area + 1}, 5], [{area + 2}, 15]], dtype=np.int64)"
    if lesson == 1:
        shape_table = table if amount % 2 else f"np.array([[{area}, 10, 5], [{area + 1}, 5, 9]], dtype=np.int64)"
        shape_reason = "There are three observations and two ordered features: shape (3,2), ndim 2 and size 6." if amount % 2 else "There are two observations and three ordered features: shape (2,3), ndim 2 and size 6."
        cases = [
            (f"values = [{area}, {area + 1}]\narray = np.array(values, dtype=np.int64)\nresult = [values * 2, array * 2]", "A Python list repeats its elements; a numeric ndarray multiplies each stored value. Equal-looking containers do not promise the same arithmetic.", "Both containers repeat their entries because their original values match."),
            (f"X = {shape_table}\nresult = {{'shape': X.shape, 'ndim': X.ndim, 'size': X.size, 'axis0': 'observations', 'axis1': 'features'}}", shape_reason + " Axis 0 locates a row, axis 1 a feature; ndim is not the number of observations.", "The number of rows is ndim, and axis 0 always names the features."),
            (f"X = {table}\nvalid = X.reshape(2, 3)\ntry:\n    invalid = X.reshape(2, 4)\nexcept ValueError:\n    error = {{'tag': 'error', 'class': 'ValueError'}}\nresult = [valid, error, 'row meaning changed']", "Reshape preserves six elements in order, not their observation grouping. (2,3) fits; (2,4) needs eight elements and raises ValueError.", "Any two-dimensional reshape preserves original house rows, even if it asks for extra elements."),
            (f"values = np.array([{area}.75, -{area}.75], dtype=np.float64)\nresult = [values, values.astype(np.int64)]", "The requested int64 conversion truncates toward zero, including negative values. It loses decimal measurements; it is not ordinary rounding or a harmless display change.", "Converting a negative decimal to an integer rounds toward negative infinity without changing information."),
        ]
    elif lesson == 2:
        selection = "X[:, 0]" if amount % 2 else "X[0, :]"
        kept = "X[:, 0:1]" if amount % 2 else "X[0:1, :]"
        cases = [
            (f"X = {table}\nresult = [{selection}, {kept}]", "An integer index removes the selected axis; a length-one slice retains it. Inspect the coordinates and exact result shapes, not only the displayed numbers.", "Selecting the same values makes (m,) and (m,1) interchangeable, so retaining an axis has no effect."),
            (f"X = {table}\ny = np.array([100, 200, 300], dtype=np.int64)\nrow_ids = ['H1', 'H2', 'H3']\nmask = X[:, 0] > {area}\nresult = {{'rows': [row_id for row_id, keep in zip(row_ids, mask) if keep], 'X': X[mask], 'y': y[mask]}}", "Apply the same observation mask to X, y and row IDs. The retained targets belong to H2 and H3, not merely the first two original targets.", "After filtering X, taking the first equally many targets preserves pairing because the lengths agree."),
            (f"X = {table}\nview = X[:, 0]\ncopy = X[:, 0].copy()\nview[0] = {area + 8}\nresult = [X, view, copy]", "This basic slice shares source storage; editing its first value changes X. The explicit copy keeps the values from before the edit. Selection is not automatically an independent copy.", "A basic slice is always independent, while copy() links its values back to the original array."),
            (f"X = {table}\nmask = (X[:, 0] > {area}) & (X[:, 1] < 20)\ntry:\n    broken = (X[:, 0] > {area}) and (X[:, 1] < 20)\nexcept ValueError:\n    error = {{'tag': 'error', 'class': 'ValueError'}}\nresult = [mask, error]", "Parenthesize each comparison and combine Boolean arrays with elementwise &. Python and asks for one truth value for the whole array and raises ValueError here.", "Python and and NumPy & always mean the same thing for a multi-element Boolean mask."),
        ]
    elif lesson == 3:
        cases = [
            (f"X = {table}\nbias = np.array([1, {area}], dtype=np.int64)\nvalid = X + bias\ntry:\n    invalid = X + np.array([1, 2, 3], dtype=np.int64)\nexcept ValueError:\n    error = {{'tag': 'error', 'class': 'ValueError'}}\nresult = [valid, error]", "Align trailing dimensions: (3,2)+(2,) supplies one offset per feature. (3,) does not match trailing length 2; total element count does not establish compatibility.", "Any vector with three values broadcasts down the three rows without a singleton axis."),
            (f"X = np.array([[{area}, 10], [{area + 1}, 5]], dtype=np.int64)\noffsets = np.array([1, 2], dtype=np.int64)\nresult = {{'intended_per_row': X + offsets.reshape(2, 1), 'legal_but_per_feature': X + offsets}}", "The square table makes both expressions legal. Per-row offsets need shape (2,1), so each observation receives its own offset across both features; shape legality alone cannot establish intent.", "On a square table a length-two vector must apply per row, since every legal broadcast preserves the intended meaning."),
            (f"column = np.array([[{area}], [{area + 1}]], dtype=np.int64)\nrow = np.array([10, 20, 30], dtype=np.int64)\nresult = column + row", "(2,1)+(3,) expands the singleton coordinate into a (2,3) grid of pairwise sums. It is not a length-two paired addition.", "Equal-looking values can be flattened first; singleton expansion never changes the number of output cells."),
            (f"X = {table}\noffsets = np.array([1, 2, {area + 3}], dtype=np.int64)\nresult = [X + offsets.reshape(3, 1), 'deliberate per-row reshape']", "Reshape to (3,1) deliberately labels one offset per observation, then broadcast across features. A reshape repairs intent only when the coordinate meaning is justified.", "A reshape that makes arithmetic legal is automatically a correct data-modeling repair."),
        ]
    elif lesson == 4:
        model = f"X = np.array([[{area}, 10], [1, 5]], dtype=np.float64)\nw = np.array([100, -2], dtype=np.float64)\nb = 50"
        cases = [
            (f"{model}\nresult = X * w", "Each cell is a feature's weighted contribution in $k. Elementwise multiplication still has one column per feature; no sum or bias has yet produced a prediction.", "The contribution table is already one final price per observation, so reduction and bias are unnecessary."),
            (f"{model}\nprediction = X @ w + b\nrepeated_bias = (X * w + b).sum(axis=1)\nresult = {{'prediction': prediction, 'repeated_bias': repeated_bias}}", "Contract the feature axis with w, then add b once per observation. Adding b to every contribution before summing counts it twice here. Feature order must match the coefficient order.", "Adding the baseline to each feature before summing is equivalent to adding it once to the final prediction."),
            (f"{model}\nrow_ids = ['H1', 'H2']\ny = np.array([200, 150], dtype=np.float64)\nresult = {{'rows': row_ids, 'prediction': X @ w + b, 'residual': X @ w + b - y}}", "Residual is prediction minus the target for the same row, matching the existing Regression convention. Reordering targets or reversing the sign changes the meaning even when lengths match.", "Residual sign and target order do not matter provided there are equally many values."),
            (f"{model}\nloop = []\nfor row in X:\n    total = 0\n    for value, weight in zip(row, w):\n        total += value * weight\n    loop.append(total + b)\nloop = np.array(loop, dtype=np.float64)\nvector = X @ w + b\nresult = [loop, vector, loop.shape == vector.shape and bool(np.allclose(loop, vector))]", "Compare ordered values and shapes against the scalar row formula. Equivalence is a numerical claim; a tiny example does not establish universal performance superiority.", "A vector expression is correct because it is always faster, even without checking values or shapes."),
        ]
    elif lesson == 5:
        cases = [
            (f"A = np.array([[1, 2, {area}], [3, 4, 5]], dtype=np.int64)\nB = np.array([[1, 0], [0, 1], [1, 1]], dtype=np.int64)\nv = np.array([1, 2, 3], dtype=np.int64)\ntry:\n    invalid = A @ np.array([[1, 0], [0, 1]], dtype=np.int64)\nexcept ValueError:\n    error = {{'tag': 'error', 'class': 'ValueError'}}\nresult = [A @ B, A @ v, error]", "For (m,n)@(n,k), the shared feature length n must match and output shape is (m,k). A vector (n,) gives (m,); matching outer lengths cannot repair an inner mismatch.", "Matrix multiplication only requires the number of rows to match, regardless of the contracted dimensions."),
            (f"A = np.array([[1, 2], [3, {area + 1}]], dtype=np.int64)\nw = np.array([10, 1], dtype=np.int64)\nresult = {{'matrix': A @ w, 'elementwise': A * w, 'equivalent': np.matmul(A, w)}}", "@ and np.matmul contract the matching feature axis into one dot product per row. * preserves a contribution for every cell; it does not perform the reduction.", "Elementwise * and @ always produce interchangeable predictions because both contain multiplication."),
            (f"X = np.array([[{area}, 10, 20], [{area + 1}, 5, 15]], dtype=np.int64)\nresult = {{'transposed': X.T, 'axis0': 'features', 'axis1': 'observations'}}", "Transpose swaps axis coordinates and their meanings: the feature axis comes first. It does not change which weight or target belongs to a house.", "Transposing a table fixes any model mismatch without needing to relabel observations or features."),
            (f"A = np.array([[2, 0], [0, 1]], dtype=np.int64)\nB = np.array([[1, {area}], [0, 1]], dtype=np.int64)\nv = np.array([1, 2], dtype=np.int64)\nresult = {{'A_then_B': B @ A @ v, 'B_then_A': A @ B @ v}}", "For column vectors apply A then B using B@A@v; order changes the result. An inverse is not a general repair for shape or meaning, nor the default numerical fitting method.", "A then B always means A@B@v, and taking an inverse is the default fix for any incompatible expression."),
        ]
    else:
        gap = 2 if amount == 3 else amount
        cases = [
            (f"X = np.array([[{area}, 10], [{area + 2}, 20]], dtype=np.float64)\nresult = {{'feature_mean': X.mean(axis=0), 'row_mean': X.mean(axis=1), 'kept_axis': X.mean(axis=0, keepdims=True), 'feature_sum': X.sum(axis=0)}}", "axis=0 reduces across observations, leaving a summary per feature. axis=1 reduces across features, leaving a value per row. keepdims retains a singleton axis for deliberate broadcasting; unlike-feature row means may lack a useful shared unit.", "axis=0 keeps only the first row, and keepdims never changes a reduction's shape."),
            (f"values = np.array([1, {1 + gap}], dtype=np.float64)\nresult = {{'mean': values.mean(), 'population': values.var(ddof=0), 'sample': values.var(ddof=1), 'n': values.size}}", "There are two observations: population variance divides by 2, sample variance by 2-1. The mean retains the original unit; variance has squared units. State ddof, denominator and intended population before interpreting a value.", "Both variance conventions divide by the number of features, and variance has the same units as the original measurement."),
            (f"X = np.array([[0, np.nan], [{area}, np.nan]], dtype=np.float64)\nresult = {{'missing': np.isnan(X), 'ordinary': X.mean(axis=0), 'nan_aware': np.nanmean(X, axis=0)}}", "NaN is missing, not zero. nanmean excludes missing cells from its denominator, but an all-missing feature still has no observed mean; the named missing outcome is not an invented zero.", "NaN-aware reduction guarantees every feature has a finite mean, even if every value is missing."),
            (f"values = np.array([{area if amount % 2 else -area}.0, 0.0], dtype=np.float64)\nratio = values[0] / values[1]\nresult = {{'value': ratio, 'finite': bool(np.isfinite(ratio)), 'valid_model_statistic': bool(np.isfinite(ratio))}}", "Finite inputs do not guarantee a finite result: division by zero produces a tagged nonfinite outcome here, with an explicit warning. Reject it as a usable model statistic; do not replace it with zero. Inspect dtype and finite checks before trusting a calculation.", "Any output from finite float64 inputs must be finite and therefore usable as a model statistic."),
        ]
    code, reason, misconception = cases[objective]
    code = "import numpy as np\n" + code
    tree = ast.parse(code)
    assert len(code.splitlines()) <= 25 and len(code.encode()) <= 4096
    assert not any(isinstance(node, (ast.While, ast.AsyncFor, ast.Await, ast.Lambda)) for node in ast.walk(tree))
    assert all(alias.name == "numpy" for node in ast.walk(tree) if isinstance(node, ast.Import) for alias in node.names)
    namespace = {}
    with warnings.catch_warnings(record=True) as recorded:
        warnings.simplefilter("always")
        exec(compile(code, "<trusted-fixed-numpy-reference>", "exec"), namespace)
    expected = normalize(namespace["result"])
    return {"code": code, "expected": expected, "reason": reason, "misconception": misconception, "warnings": sorted({type(item.message).__name__ for item in recorded})}


def metadata():
    text = (ROOT / "docs/task-013-lesson-objective-matrix.md").read_text()
    lessons = []
    for number in range(1, 7):
        slug = f"N{number:02}"
        section = re.search(rf"^### {slug} (.*?)\n(.*?)(?=^### |^## |\Z)", text, re.M | re.S)
        body = section[2]
        field = lambda label: re.search(rf"\*\*{re.escape(label)}:\*\* (.*)", body)[1].strip()
        objectives = []
        for row in re.findall(r"^\| (N\d\d\.O\d)([^|]*)\|([^\n]*)", body, re.M):
            columns = [value.strip() for value in row[2].split("|")]
            objectives.append({"id": row[0], "critical": "**C**" in row[1], "outcome": columns[0], "assessment": columns[1], "remediation": columns[2]})
        lessons.append({"slug": slug.lower(), "title": section[1], "prerequisites": field("Prerequisites"), "motivation": field("Motivation and mental model"), "progression": field("Progression beyond the worked example"), "terms": field("Key concepts"), "math": field("Mathematical connection"), "worked": field("Worked example"), "misconception": field("Misconception to confront"), "objectives": objectives})
    return lessons


def build():
    cases = []
    for lesson in range(1, 7):
        for objective in range(4):
            for mode, amounts in [("worked", [3]), ("practice", [1, 2]), ("mastery", [4, 5, 7])]:
                for variant, amount in enumerate(amounts):
                    cases.append({"lesson": f"n{lesson:02}", "objective": f"N{lesson:02}.O{objective + 1}", "mode": mode, "variant": variant, "amount": amount, **authored_case(lesson, objective, amount)})
    return {"contract": "numpy-learning-reference.v1", "profile": "macos-arm64-cpython-3.13.16-reference.1", "numpy": np.__version__, "author": "python/mlmath/numpy_learning_reference.py", "lessons": metadata(), "cases": cases}


if __name__ == "__main__":
    print(json.dumps(build(), indent=2, ensure_ascii=False, allow_nan=False))
