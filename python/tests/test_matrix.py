import json
from pathlib import Path
import numpy as np
import pytest
from mlmath import matrix_matrix_trace, matrix_vector_trace

def test_three_houses(): assert matrix_vector_trace([[2,3,4],[4,2,5],[3,4,2]],[5,2,3])["result"] == [28,39,29]
def test_rectangular_and_matrix_matrix():
    assert matrix_vector_trace([[1,2,3],[4,5,6]],[1,0,-1])["result"] == [-2,-2]
    assert matrix_matrix_trace([[1,2,3],[4,5,6]],[[1,2],[0,1],[-1,3]])["result"] == [[-2,13],[-2,31]]
@pytest.mark.parametrize("fn,args,message", [
    (matrix_vector_trace, ([], []), "non-empty"),
    (matrix_vector_trace, ([[1,2],[3]], [1,2]), "rectangular"),
    (matrix_vector_trace, ([[1,2]], [1]), "incompatible"),
    (matrix_matrix_trace, ([[1,2]], [[1,2]]), "incompatible"),
    (matrix_vector_trace, ([[1,np.inf]], [1,2]), "finite"),
])
def test_invalid(fn, args, message):
    with pytest.raises(ValueError, match=message): fn(*args)
def test_fixture_parity():
    fixture=json.loads((Path(__file__).parents[2]/"packages/math-contracts/fixtures/matrix.v1.json").read_text())
    for case in fixture["matrixVector"]: assert matrix_vector_trace(**case["input"]) == case["trace"]
    for case in fixture["matrixMatrix"]: assert matrix_matrix_trace(**case["input"]) == case["trace"]
