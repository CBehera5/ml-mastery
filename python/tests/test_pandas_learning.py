import ast
import json
from pathlib import Path

import pandas as pd
import pytest

from mlmath.pandas_learning_reference import authored_case, build, normalize, HOUSES, DATA_HASH

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = json.loads((ROOT / "packages/python-contracts/fixtures/pandas-learning.v1.json").read_text())


def test_complete_frozen_pandas_reference_and_profile():
    assert build() == FIXTURE
    assert FIXTURE['pandas'] == '3.0.6'
    assert len(FIXTURE['lessons']) == 6 and len(FIXTURE['cases']) == 144
    assert sum(objective['critical'] for lesson in FIXTURE['lessons'] for objective in lesson['objectives']) == 7
    assert len([case for case in FIXTURE['cases'] if case['mode'] != 'worked']) == 120


@pytest.mark.parametrize('case', FIXTURE['cases'], ids=lambda case: f'{case["objective"]}-{case["mode"]}-{case["variant"]}')
def test_all_scored_and_worked_cases_match_real_pandas(case):
    actual = authored_case(int(case['lesson'][1:]), int(case['objective'][-1]) - 1, case['amount'])
    assert actual['expected'] == case['expected']
    assert len(case['code'].splitlines()) <= 25 and len(case['code'].encode()) <= 4096
    tree = ast.parse(case['code'])
    assert not any(isinstance(node, (ast.While, ast.Lambda, ast.GeneratorExp)) for node in ast.walk(tree))
    assert not {node.attr for node in ast.walk(tree) if isinstance(node, ast.Attribute)} & {'query', 'eval', 'apply', 'median', 'read_sql', 'to_csv'}


@pytest.mark.parametrize('arguments', [(1, 0, '1; import os'), (1, 0, True), (7, 0, 1), (1, 4, 1), (1, 0, 10000000)])
def test_author_oracle_rejects_unsafe_or_unlisted_configurations(arguments):
    with pytest.raises(ValueError):
        authored_case(*arguments)


def test_analytic_anchors_and_label_alignment():
    aligned = authored_case(1, 0, 3)['expected']['aligned_sum']
    assert aligned['index'] == ['rowA', 'rowB'] and aligned['values'] == [21, 12]
    groups = authored_case(4, 1, 3)['expected']
    assert groups['groups']['rows'] == [[30.0, 15.0, 2.0, 3.0], [100.0, 100.0, 1.0, 1.0]]
    assert groups['global_mean'] == pytest.approx(130 / 3)
    assert groups['unweighted_group_mean'] == 57.5
    joined = authored_case(5, 2, 3)['expected']
    assert joined['left']['shape'][0] == 3 and joined['inner']['shape'][0] == 2
    ages = authored_case(3, 2, 3)['expected']
    assert ages['declared_fill']['values'] == [0, 10, 20]


def test_semantic_counterexamples_null_alignment_missing_and_causation():
    for amount in (1, 2, 3, 4, 5, 7):
        selected = authored_case(2, 1, amount)['expected']
        assert selected['selected']['index'] == [20, 30]
        assert selected['targets']['values'] == [200, 300]
        observed = authored_case(3, 0, amount)['expected']['observed']
        assert observed['index'] == ['H1', 'H3'] and observed['values'][0] == 0
        grouped = authored_case(4, 3, amount)['expected']
        assert grouped['pooled']['values'][0] != grouped['pooled']['values'][1]
        within = grouped['within_band']['values']
        assert within[0] == within[1] and within[2] == within[3]
        assert authored_case(5, 1, amount)['expected']['required_lookup_contract'] == {'tag': 'error', 'class': 'MergeError'}
    nulls = authored_case(5, 3, 3)['expected']
    assert nulls['rows'][1][0] == {'tag': 'missing'}
    assert nulls['shape'][0] == 2


def test_whole_lookup_equivalence_and_counterexample():
    left = pd.DataFrame({'key': ['A', 'A', 'B']})
    valid = pd.DataFrame({'key': ['A', 'B'], 'fee': [10, 20]})
    wrong = pd.DataFrame({'key': ['A', 'A'], 'fee': [10, 20]})
    outputs = [left.merge(valid, on='key', how='left', sort=False, validate=contract) for contract in ['many_to_one', 'm:1']]
    pd.testing.assert_frame_equal(*outputs)
    for contract in ['many_to_one', 'm:1']:
        with pytest.raises(pd.errors.MergeError):
            left.merge(wrong, on='key', how='left', sort=False, validate=contract)
    assert len(left.merge(wrong, on='key', how='left', sort=False, validate='many_to_many')) == 5


def test_canonical_data_overlays_audits_and_prediction_time_boundary():
    assert len(set(HOUSES['id'])) == 16
    assert FIXTURE['manifest']['sha256'] == DATA_HASH
    assert FIXTURE['manifest']['train_ids'] == HOUSES['id'][:12]
    for amount in (1, 2, 3, 4, 5, 7):
        audit = authored_case(6, 1, amount)['expected']
        assert audit['rows'] == 16 and audit['distinct_ids'] == 15 and audit['missing_age'] == 4
        features = authored_case(6, 2, amount)['expected']
        assert not set(features['ordered_features']) & {'price', 'future_price'}
        assert features['ready_to_fit'] is False
        assert authored_case(6, 0, amount)['expected']['invalid_dates'] == 1
    assert len(set(HOUSES['id'])) == 16


def test_normalization_bounds_dtypes_and_tagged_json():
    for frame in [pd.DataFrame({'value': range(33)}), pd.DataFrame([[1] * 9])]:
        with pytest.raises(AssertionError):
            normalize(frame)
    assert normalize(pd.NA) == normalize(pd.NaT) == {'tag': 'missing'}
    json.dumps(FIXTURE, allow_nan=False)
