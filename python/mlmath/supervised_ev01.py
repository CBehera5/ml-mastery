"""Trusted author reference for EV01. No learner code or external data input."""

import hashlib
import itertools
import inspect
import json
from pathlib import Path


VERSION = "supervised.ev01.1.0.0"
PROFILE = {"python": "3.13.16", "numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1"}


def scenarios():
    specs = [
        ("housing-units", "House price: new independent homes", "housing", False, False),
        ("housing-future", "House price: future sales", "housing", False, True),
        ("churn-customers", "Churn: new customers", "churn", True, False),
        ("churn-future", "Churn: future events for known customers", "churn", False, True),
        ("docs-groups", "Documentation: unseen source/template groups", "docs", True, False),
        ("docs-future", "Documentation: future revisions from unseen families", "docs", True, True),
    ]
    result = []
    for index, (identifier, title, domain, group, time) in enumerate(specs):
        rows = [{"id": f"r{position}", "group": f"g{(position - 1) // 2 + 1}" if group else (f"g{position % 2}" if identifier == "churn-future" else f"g{position}"), "time": position} for position in range(1, 7)]
        plans = [
            {"id": "holdout", "label": "Train r1–r4; test r5–r6", "train": ["r1", "r2", "r3", "r4"], "test": ["r5", "r6"]},
            {"id": "overlap", "label": "Train r1–r4; test r4–r6", "train": ["r1", "r2", "r3", "r4"], "test": ["r4", "r5", "r6"]},
            {"id": "crossed", "label": "Train r1,r3,r5; test r2,r4,r6" if group else "Train r1,r5,r6; test r2,r3,r4", "train": ["r1", "r3", "r5"] if group else ["r1", "r5", "r6"], "test": ["r2", "r4", "r6"] if group else ["r2", "r3", "r4"]},
        ]
        if not group and not time:
            plans[2] = {"id": "crossed", "label": "Train r1–r5; test r5–r6", "train": ["r1", "r2", "r3", "r4", "r5"], "test": ["r5", "r6"]}
        safe, future = {"housing": ("area at listing", "future sale proceeds"), "churn": ("usage before decision", "cancellation after decision"), "docs": ("submitted text at review request", "post-review correction flag")}[domain]
        result.append({"id": identifier, "title": title, "domain": domain, "requireGroup": group, "requireTime": time, "rows": rows, "plans": plans[index % 3:] + plans[:index % 3], "features": [{"id": "available", "label": safe, "observedAt": -1}, {"id": "future", "label": future, "observedAt": 1}]})
    return result


def analyze(scene, feature_id, plan_id):
    feature = next(item for item in scene["features"] if item["id"] == feature_id)
    plan = next(item for item in scene["plans"] if item["id"] == plan_id)
    rows = {row["id"]: row for row in scene["rows"]}
    overlap = sorted(set(plan["train"]) & set(plan["test"]))
    groups = sorted({rows[key]["group"] for key in plan["train"]} & {rows[key]["group"] for key in plan["test"]}) if scene["requireGroup"] else []
    future = [key for key in plan["train"] if rows[key]["time"] >= min(rows[item]["time"] for item in plan["test"])] if scene["requireTime"] else []
    feature_valid = feature["observedAt"] <= 0
    split_valid = not (overlap or groups or future)
    reason = "both-valid" if feature_valid and split_valid else "feature-future" if split_valid else "split-invalid" if feature_valid else "both-invalid"
    return {"featureValid": feature_valid, "splitValid": split_valid, "valid": feature_valid and split_valid, "overlap": overlap, "groups": groups, "future": future, "reason": reason}


def choice(identifier, label, options):
    return {"id": identifier, "label": label, "kind": "choice", "options": [{"id": key, "label": text} for key, text in options]}


def family(objective, variant, scenario_index):
    scene = scenarios()[scenario_index]
    domain = scene["domain"]
    target, unit = {"housing": ("price", "currency"), "churn": ("churn", "binary"), "docs": ("quality", "binary")}[domain]
    context = {"housing": "Predict the sale price in thousands of dollars from a listing at t=0, with sale outcome after t=0.", "churn": "At t=0 predict cancellation during days 1–30: no cancellation=0, cancellation=1.", "docs": "At submission t=0 predict human-reviewed quality of this version: Good=0, Needs Improvement=1."}[domain]
    paired = objective == 2
    feature = "future" if (scenario_index + len(variant)) % 2 else "available"
    plan = "holdout" if scenario_index % 2 == 0 else "crossed"
    if objective == 1:
        atoms = [{"id": "target", "label": "Target and unit", "kind": "slots", "slots": [
            {"id": "target", "label": "What is predicted?", "options": [{"id": key, "label": label} for key, label in [("price", "Future sale price"), ("churn", "Cancellation during days 1–30"), ("quality", "Human-reviewed quality of the submitted version")]]},
            {"id": "unit", "label": "Output unit", "options": [{"id": "currency", "label": "Thousands of dollars"}, {"id": "binary", "label": "Binary label 0/1; not currency"}]},
        ]}]
        accepted = [{"kind": "slots", "entries": [{"slotId": "target", "optionId": target}, {"slotId": "unit", "optionId": unit}]}]
        prompt = "Choose the target and its unit before any model is selected."
        explanation = "The deployment question fixes both the target and units. A human label is not a numeric price or an automatically reliable LLM score."
    elif objective == 2:
        selected = next(item for item in scene["features"] if item["id"] == feature)
        prompt = f"May {selected['label']} (observed at t={selected['observedAt']}) be used at prediction time t=0?"
        atoms = [choice("decision", "Feature permission", [("allow", "Available at prediction time"), ("reject", "Unavailable at prediction time")]), choice("reason", "Explain the time boundary", [("before", "It exists no later than t=0; later labels remain targets, not inputs."), ("after", "It only exists after t=0; a high correlation cannot make it available."), ("correlation", "Any strongly correlated feature is permitted, including future information.")])]
        allowed = selected["observedAt"] <= 0
        accepted = [{"kind": "choice", "optionId": "allow" if allowed else "reject"}, {"kind": "choice", "optionId": "before" if allowed else "after"}]
        explanation = "Only information available by the prediction moment is eligible. Later outcomes can supply training targets after observation; they cannot become prediction-time features. Both the permission and its reason matter."
    elif objective == 3:
        selected = next(item for item in scene["plans"] if item["id"] == plan)
        outcome = analyze(scene, "available", plan)
        prompt = f"Deployment question: {scene['title']}. Proposed plan: {selected['label']}. May this split support that question?"
        atoms = [choice("decision", "Split permission", [("valid", "Valid for this declared deployment question"), ("invalid", "Invalid for this declared deployment question")]), choice("reason", "Explain split reasoning", [("boundary", "Rows are disjoint and the required unseen-group/time boundary is preserved."), ("crossing", "The required row/group/time boundary is crossed; the estimate answers a different or contaminated question."), ("random", "A random-looking split is always valid regardless of groups or dates.")])]
        accepted = [{"kind": "choice", "optionId": "valid" if outcome["splitValid"] else "invalid"}, {"kind": "choice", "optionId": "boundary" if outcome["splitValid"] else "crossing"}]
        explanation = "Independent new units can use disjoint rows; unseen customers/templates require disjoint groups; future prediction requires earlier training cohorts. A row split alone cannot guarantee all three."
    else:
        causal = scenario_index % 2 == 0
        claim = "Changing this predictive feature is proven to improve the outcome." if causal else "This feature predicts the observed label in this dataset; an intervention benefit is not established."
        prompt = f"Observational prediction only. Evaluate this statement: {claim}"
        atoms = [choice("decision", "Conclusion", [("supported", "Supported predictive limitation"), ("unsupported", "Unsupported causal claim")]), choice("reason", "Explain the claim", [("observation", "Predictive association alone does not identify an intervention effect."), ("accuracy", "A sufficiently accurate predictor automatically proves causation.")])]
        accepted = [{"kind": "choice", "optionId": "unsupported" if causal else "supported"}, {"kind": "choice", "optionId": "observation"}]
        explanation = "Association can support a scoped prediction claim, not the claim that changing a feature changes the outcome. Confounding and selection can produce predictive patterns."
    return {"family": {"id": f"EV01.O{objective}.{variant}", "objective": f"EV01.O{objective}", "critical": paired, "prompt": context + " " + prompt, "code": "", "atoms": atoms, "accepted": [accepted], "explanation": explanation, "remediation": explanation + " Revisit the changed-condition example for this objective."}, "oracle": {"objective": objective, "scenario": scene["id"], "feature": feature, "plan": plan, "target": target, "unit": unit}}


def corpus():
    scenes = scenarios()
    practice = [family(objective, f"practice-{variant}", (objective + index) % 6) for objective in range(1, 5) for index, variant in enumerate(["A", "B"])]
    independent = [family(objective, f"test-{variant}", (objective + index + 2) % 6) for objective in range(1, 5) for index, variant in enumerate(["A", "B", "C"])]
    states = [{"id": f"{scene['id']}:{feature}:{plan['id']}", "scene": scene["id"], "feature": feature, "plan": plan["id"], "expected": analyze(scene, feature, plan["id"])} for scene in scenes for feature, plan in itertools.product(["available", "future"], scene["plans"])]
    return {"version": VERSION, "scenes": scenes, "states": states, "practice": practice, "independent": independent}


def generate(root):
    content = corpus()
    destination = root / "apps/web/app/supervised/foundation"
    destination.mkdir(parents=True, exist_ok=True)
    for name, value in [("authored.json", {"version": VERSION, "scenes": content["scenes"], "practice": content["practice"]}), ("reference.json", {"version": VERSION, "states": content["states"], "independent": content["independent"]})]:
        target = destination / name if name == "authored.json" else root / "python/tests/fixtures/supervised-ev01-reference.json"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(value, indent=2) + "\n")
    manifest = {"content": VERSION, "profile": PROFILE, "origin": "Original fictional teaching fixtures; no production documents or labels", "counts": {"practice": 8, "testOnly": 12, "scenarios": 6, "states": 36}, "sha256": {str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest() for path in [Path(__file__), destination / "authored.json", root / "python/tests/fixtures/supervised-ev01-reference.json"]}}
    (destination / "provenance.json").write_text(json.dumps(manifest, indent=2) + "\n")
    notebook(root)


def notebook(root):
    cells = []
    def markdown(text):
        cells.append({"cell_type": "markdown", "metadata": {}, "source": text})
    def code(text):
        cells.append({"cell_type": "code", "metadata": {}, "source": text, "outputs": [], "execution_count": None})
    markdown("# EV01 — Define the prediction moment\nML Mastery — Learn Machine Learning by Doing. Trusted author code, not learner-hosted execution.\n\nThis feasibility section belongs to the eventual EV notebook. No estimator is fitted; no credentials, uploads, external data or platform evidence writes. Genuine Colab execution remains unverified. Original fictional rows are not a production documentation-quality dataset.")
    code("import sys, json, random\nfrom importlib.metadata import version\nassert sys.version_info[:3] == (3, 13, 16), 'Use the approved local Python profile, or separately verify a new profile.'\npins = " + repr({key: value for key, value in PROFILE.items() if key != "python"}) + "\nfor package, expected in pins.items():\n    assert version(package) == expected, f'Unsupported {package} profile'\nrandom.seed(0)\nprint('Approved local profile asserted; seed=0')")
    markdown("## Problem and visual boundary\nAt t=0, predict a future house price, cancellation during days1–30, or a human-reviewed label for a submitted guide (Good=0, Needs Improvement=1).\n\nBefore t=0: known inputs → t=0: prediction → after t=0: outcome/review. Later outcomes can become training labels, not current features. A correlated post-review flag is unavailable at submission. Predict before running: is an available feature plus a row-overlapping split valid?")
    code(inspect.getsource(scenarios) + "\n" + inspect.getsource(analyze))
    code("scenes = scenarios()\nscene = scenes[0]\nresult = analyze(scene, 'available', 'overlap')\nassert result['overlap'] == ['r4']\nassert not result['valid']\nprint(json.dumps(result, sort_keys=True))")
    markdown("## Mathematics, Python and changed conditions\nE(0)={j: observed_at[j]≤0}; T∩H must be empty. Unseen entities additionally require disjoint groups, and future-cohort evaluation requires earlier training times. These necessary conditions do not replace a real label-availability audit.\n\nGuided repair: replace the authored plan ID `overlap` with `holdout`, not arbitrary code. Then change `available` to `future`: a good split does not repair an unavailable feature.")
    code("safe = analyze(scene, 'available', 'holdout')\nfuture_feature = analyze(scene, 'future', 'holdout')\nassert safe['valid']\nassert not future_feature['valid'] and future_feature['splitValid']\nprint(json.dumps({'safe': safe['valid'], 'future_feature': future_feature['reason']}, sort_keys=True))")
    code("results = []\nfor scene in scenes:\n    for feature in scene['features']:\n        for plan in scene['plans']:\n            results.append({'config': scene['id'] + ':' + feature['id'] + ':' + plan['id'], **analyze(scene, feature['id'], plan['id'])})\nassert len(results) == 36\nassert sum(result['valid'] for result in results) == 6\nassert analyze(scenes[2], 'available', 'crossed')['groups'] == ['g1', 'g2', 'g3']\nassert analyze(scenes[1], 'available', 'crossed')['future'] == ['r5', 'r6']\nassert analyze(scenes[5], 'available', 'crossed')['future'] == ['r3', 'r5']\nprint(json.dumps({'states': len(results), 'valid': sum(result['valid'] for result in results), 'results': results}, sort_keys=True))")
    markdown("## Evaluate and compare\nAll36 configurations check information permissions, not fitted performance. Linear Regression produces a numeric price; classification models are candidates for churn/document labels, but no algorithm repairs leakage. Association does not establish that increasing usage or padding words improves an outcome.\n\nIndependent transfer: explain why a disjoint random row split might still leak documentation templates; contrast future events of known customers with unseen-customer deployment. No notebook execution grants mastery.\n\nExpected assertions: r4 overlaps; six valid states out of36; group overlap g1/g2/g3; future-training rows r5/r6 for housing and r3/r5 for future documentation. Local two-kernel reproducibility is distinct from genuine Colab acceptance.")
    document = {"nbformat": 4, "nbformat_minor": 5, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python", "version": "3.13.16"}, "ml_mastery": {"content": VERSION, "profile": PROFILE, "seed": 0, "data_origin": "original fictional", "colab_verified": False}}, "cells": [{"id": f"ev01-{index}", **cell} for index, cell in enumerate(cells)]}
    (root / "apps/web/public/notebooks/supervised-ev01.ipynb").write_text(json.dumps(document, indent=2) + "\n")


if __name__ == "__main__":
    generate(Path(__file__).resolve().parents[2])
