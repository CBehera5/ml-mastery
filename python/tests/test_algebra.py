import json, math
from pathlib import Path
import pytest
from mlmath.algebra import algebra_value,algebra_trace,linear_equation_trace,mapping_trace,compound_growth_trace
ROOT=Path(__file__).resolve().parents[2]
def test_frozen_fixtures():
    f=json.loads((ROOT/'packages/math-contracts/fixtures/algebra.v1.json').read_text())
    for row in f['functions']: assert algebra_trace(row['spec'],row['x'])==row['trace']
    for row in f['equations']: assert linear_equation_trace(row['a'],row['b'],row['target'])==row
    for row in f['mappings']: assert mapping_trace(row['pairs'])==row
    for row in f['compounding']: assert compound_growth_trace(row['intervals'])==row
@pytest.mark.parametrize('base',[.5,2,math.e,10])
def test_inverse_and_product_invariants(base):
    for x in [.25,.5,1,2,4]:
        y=algebra_value({'kind':'logarithm','base':base},x)['value']
        assert algebra_value({'kind':'exponential','base':base},y)['value']==pytest.approx(x)
    log=lambda x: algebra_value({'kind':'logarithm','base':base},x)['value']
    assert log(2*3)==pytest.approx(log(2)+log(3))
def test_known_math_and_domain_boundaries():
    assert algebra_value({'kind':'composition','order':'f-after-g'},2)['value']==11
    assert algebra_value({'kind':'composition','order':'g-after-f'},2)['value']==49
    assert algebra_value({'kind':'logarithm','base':10},-1)['value'] is None
    assert algebra_value({'kind':'exponential','base':10},1000)['value'] is None
    assert mapping_trace([[1,4],[2,4]])['isFunction']
    assert not mapping_trace([[2,4],[2,7]])['isFunction']
    for spec in [{'kind':'logarithm','base':1},{'kind':'exponential','base':-1},{'kind':'linear','a':math.inf,'b':0}]:
        with pytest.raises(ValueError): algebra_trace(spec,2)
    with pytest.raises(ValueError): compound_growth_trace(0)
    assert abs(compound_growth_trace(1000)['approximation']-math.e) < abs(compound_growth_trace(10)['approximation']-math.e)
