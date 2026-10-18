import hashlib
import importlib.util
import json
import math
from pathlib import Path

import numpy as np
import pytest
from scipy.special import logsumexp
from scipy.stats import norm
from sklearn.naive_bayes import GaussianNB, MultinomialNB

from mlmath.naive_bayes_reference import catalog

ROOT = Path(__file__).resolve().parents[2]
DIRECTORY = ROOT / "docs/verification/naive-bayes"
FAMILIES = catalog()["families"]
SPEC = importlib.util.spec_from_file_location("nb_frozen_reference", ROOT / "work/freeze-task-015-6.py")
REFERENCE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(REFERENCE)
LABS, EDGES = REFERENCE.generate()


@pytest.mark.parametrize("family", FAMILIES, ids=lambda family: family["id"])
def test_all_80_scored_instances(family):
    stored = json.loads((ROOT / "apps/web/app/supervised/naive-bayes/authored.json").read_text())
    assert next(item for item in stored["families"] if item["id"] == family["id"]) == family
    lesson, objective = int(family["objective"][2:4]), int(family["objective"][-1])
    variant = ord(family["id"][-1])-ord("A")+(0 if ".practice." in family["id"] else 2)
    decision = family["accepted"][0][0]
    if decision["kind"] == "number":
        if (lesson, objective) == (1, 1):
            prior = [[.6, .4], [.2, .8], [.5, .5], [.8, .2], [.4, .6]][variant]
            scores = np.log(prior)+np.log([.5, .25])
            expected = np.exp(scores-logsumexp(scores))[0]
        elif (lesson, objective) == (1, 4):
            expected = math.log(math.exp(-1)*math.exp(-2*(variant+1))*math.exp(-3*(variant+1)))
        elif (lesson, objective) == (2, 1):
            alpha = [1., .5, 2., 1., 2.][variant]
            fitted = MultinomialNB(alpha=alpha, force_alpha=True).fit([[2+variant, 0], [0, 2]], [0, 1])
            expected = np.exp(fitted.feature_log_prob_[0, 1])
        elif (lesson, objective) == (2, 4):
            labels = [0]*(3+variant)+[1]*2
            fitted = MultinomialNB().fit([[1, 1] for _ in labels], labels)
            expected = np.exp(fitted.class_log_prior_[0])
        elif (lesson, objective) == (3, 1):
            variance = [1., .25, 4., 1., 4.][variant]
            expected = norm.pdf(0, loc=0, scale=math.sqrt(variance))
            assert .6*expected > .4*norm.pdf(0, loc=0, scale=math.sqrt(4*variance))
        elif (lesson, objective) == (3, 4):
            variances = [[4., 1.], [9., 4.], [0., 0.], [1., .5], [16., 2.]][variant]
            amplitudes = np.sqrt(variances)
            rows = np.array([-amplitudes, amplitudes, -amplitudes, amplitudes])
            fitted = GaussianNB(var_smoothing=.001).fit(rows, [0, 0, 1, 1])
            expected = fitted.epsilon_
        else:
            raise AssertionError("Unreviewed numeric operation")
        assert np.isclose(decision["value"], expected, atol=1e-9, rtol=1e-9)
    else:
        assert decision == {"kind": "choice", "optionId": "supported"}
        text = next(option["label"] for option in family["atoms"][0]["options"] if option["id"] == "supported")
        if (lesson, objective) == (1, 2):
            assert "conditional on" in text
        elif (lesson, objective) == (2, 2):
            assert "Reject" in text and "provenance" in text
        elif (lesson, objective) == (3, 2):
            assert ("MultinomialNB" if variant % 2 else "GaussianNB") in text
        elif (lesson, objective) == (3, 3):
            ratio = variant+2
            assert ratio**2/(ratio**2+1) > ratio/(ratio+1)
            assert "not independent" in text
        elif (lesson, objective) == (4, 1):
            assert "each CV training fold" in text and "saved state" in text
        elif (lesson, objective) == (4, 2):
            assert "Reject" in text and "causal/shift limits" in text
        elif (lesson, objective) == (4, 3):
            assert "freeze before test" in text and "aligned" in text
        elif (lesson, objective) == (4, 4):
            assert ("False negative" if variant % 2 else "False positive") in text
        elif (lesson, objective) == (1, 3):
            assert text == ["prior", "likelihood", "posterior", "likelihood", "prior"][variant]
        elif (lesson, objective) == (2, 3):
            assert "positive token likelihood" in text and "not proof of calibration" in text
        else:
            raise AssertionError("Unreviewed semantic operation")
    assert family["critical"] == (objective == 2)
    if objective == 2:
        assert len(family["atoms"]) == 2
        assert family["accepted"][0][1] == {"kind": "choice", "optionId": "mechanism"}
        assert next(option["label"] for option in family["atoms"][1]["options"] if option["id"] == "mechanism") == family["explanation"]


@pytest.mark.parametrize("lab,state", [(lab, state) for lab in LABS for state in lab["configurations"]], ids=[state["id"] for lab in LABS for state in lab["configurations"]])
def test_all_56_frozen_states(lab, state):
    file = "nb-e1.manifest.v1.json" if lab["id"] == "NB-E1" else "nb-e2.manifest.v1.json"
    stored = json.loads((DIRECTORY / file).read_text())
    assert next(item for item in stored["configurations"] if item["id"] == state["id"]) == state
    if state["expected"].get("status") in ["undefined", "rejected"]:
        assert state["expected"]["prediction"] is None


def test_hashes_extremes_smoothing_and_no_leaked_vocabulary():
    lock = json.loads((DIRECTORY / "freeze-lock.v1.json").read_text())
    for name, expected in lock["sha256"].items():
        assert hashlib.sha256((DIRECTORY/name).read_bytes()).hexdigest() == expected
    assert EDGES["negative_count_library_rejected"]
    assert EDGES["global_constant_epsilon"] == 0
    assert EDGES["repeated_wrong_evidence"]["duplicate_log_loss"] > EDGES["repeated_wrong_evidence"]["base_log_loss"]
    assert all(value["tag"] == "undefined" for row in EDGES["alpha0_library_posteriors"] for value in row)
    documents = [["clear"], ["error"]]
    train_vocabulary = sorted({token for document in documents for token in document})
    assert "future" not in train_vocabulary
    held_out = [["future", "clear"]]
    assert [[document.count(token) for token in train_vocabulary] for document in held_out] == [[1, 0]]
    fold_vocabulary = sorted(set(documents[0]))
    assert "error" not in fold_vocabulary
