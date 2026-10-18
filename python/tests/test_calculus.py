import json, math
from pathlib import Path
import pytest
from mlmath import calculus_trace, central_derivative, linear_value, loss_derivative, quadratic_value, secant_slope, squared_loss
def test_values():
 assert linear_value(4)==30 and quadratic_value(-2)==4
 assert [squared_loss(w) for w in [2,3,4]]==[4,0,4]
 assert [loss_derivative(w) for w in [2,3,4]]==[-8,0,8]
def test_numerical_and_secant():
 assert central_derivative(squared_loss,2)==pytest.approx(-8,abs=1e-8)
 assert secant_slope(quadratic_value,3,.1)==pytest.approx(6.1)
 assert calculus_trace(2,.5)["derivative"]["tangent"]=={"point":[2.0,4.0],"slope":-8.0,"intercept":20.0}
@pytest.mark.parametrize("call",[lambda:central_derivative(squared_loss,2,0),lambda:secant_slope(squared_loss,2,0),lambda:calculus_trace(math.inf,.5),lambda:calculus_trace(2,0)])
def test_invalid(call):
 with pytest.raises(ValueError): call()
def test_fixtures():
 data=json.loads((Path(__file__).parents[2]/"packages/math-contracts/fixtures/calculus.v1.json").read_text())
 for case in data["cases"]: assert calculus_trace(**case["input"])==case["trace"]
