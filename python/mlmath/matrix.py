"""Pure deterministic matrix multiplication traces."""
from __future__ import annotations
from typing import Any, Sequence
import numpy as np

MATRIX_SCHEMA_VERSION = "1.0.0"

def _matrix(name: str, values: Sequence[Sequence[float]]) -> np.ndarray:
    try: array = np.asarray(values, dtype=np.float64)
    except (TypeError, ValueError) as exc: raise ValueError(f"{name} must be a non-empty rectangular numeric matrix") from exc
    if array.ndim != 2 or 0 in array.shape: raise ValueError(f"{name} must be a non-empty rectangular numeric matrix")
    if not np.all(np.isfinite(array)): raise ValueError(f"{name} must contain only finite numbers")
    return array

def _vector(name: str, values: Sequence[float]) -> np.ndarray:
    try: array = np.asarray(values, dtype=np.float64)
    except (TypeError, ValueError) as exc: raise ValueError(f"{name} must be a non-empty numeric vector") from exc
    if array.ndim != 1 or array.size == 0: raise ValueError(f"{name} must be a non-empty numeric vector")
    if not np.all(np.isfinite(array)): raise ValueError(f"{name} must contain only finite numbers")
    return array

def matrix_vector_trace(matrix: Sequence[Sequence[float]], vector: Sequence[float]) -> dict[str, Any]:
    x, w = _matrix("matrix", matrix), _vector("vector", vector)
    if x.shape[1] != w.shape[0]: raise ValueError(f"incompatible shapes: matrix columns ({x.shape[1]}) must equal vector length ({w.shape[0]})")
    products = x * w
    result = np.sum(products, axis=1)
    return {"schemaVersion": MATRIX_SCHEMA_VERSION, "operation": "matrix-vector", "input": {"matrix": x.tolist(), "vector": w.tolist()}, "shapes": {"matrix": list(x.shape), "vector": [w.size], "result": [x.shape[0]]}, "rowProducts": products.tolist(), "result": result.tolist()}

def matrix_matrix_trace(left: Sequence[Sequence[float]], right: Sequence[Sequence[float]]) -> dict[str, Any]:
    a, b = _matrix("left", left), _matrix("right", right)
    if a.shape[1] != b.shape[0]: raise ValueError(f"incompatible shapes: left columns ({a.shape[1]}) must equal right rows ({b.shape[0]})")
    result = a @ b
    cell_products = [[[float(a[r, k] * b[k, c]) for k in range(a.shape[1])] for c in range(b.shape[1])] for r in range(a.shape[0])]
    return {"schemaVersion": MATRIX_SCHEMA_VERSION, "operation": "matrix-matrix", "input": {"left": a.tolist(), "right": b.tolist()}, "shapes": {"left": list(a.shape), "right": list(b.shape), "result": list(result.shape)}, "cellProducts": cell_products, "result": result.tolist()}
