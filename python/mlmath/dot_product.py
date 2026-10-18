"""Pure, deterministic vector dot-product calculations."""

from __future__ import annotations

from typing import Any, Sequence

import numpy as np

DOT_PRODUCT_SCHEMA_VERSION = "1.0.0"


def _vector(name: str, values: Sequence[float]) -> np.ndarray:
    if isinstance(values, (str, bytes)):
        raise ValueError(f"{name} must be a non-empty one-dimensional numeric array")
    try:
        array = np.asarray(values, dtype=np.float64)
    except (TypeError, ValueError) as exc:
        raise ValueError(f"{name} must be a non-empty one-dimensional numeric array") from exc
    if array.ndim != 1 or array.size == 0:
        raise ValueError(f"{name} must be a non-empty one-dimensional numeric array")
    if not np.all(np.isfinite(array)):
        raise ValueError(f"{name} must contain only finite numbers")
    return array


def dot_product_trace(features: Sequence[float], weights: Sequence[float]) -> dict[str, Any]:
    """Return the elementwise contributions and scalar dot product."""
    x = _vector("features", features)
    w = _vector("weights", weights)
    if x.shape != w.shape:
        raise ValueError("features and weights must have the same length")
    contributions = x * w
    return {
        "schemaVersion": DOT_PRODUCT_SCHEMA_VERSION,
        "input": {"features": x.tolist(), "weights": w.tolist()},
        "contributions": contributions.tolist(),
        "value": float(np.sum(contributions)),
    }

