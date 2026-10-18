"""Read-only MS-E2 portability gate; never writes the frozen reference directory."""
from __future__ import annotations

import argparse
from decimal import Decimal, localcontext
import hashlib
import importlib.util
import itertools
import json
import math
from pathlib import Path
import platform
import sys

import numpy as np
from threadpoolctl import threadpool_info, threadpool_limits

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("ms_freeze", ROOT / "work/freeze-task-015-12.py")
G = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(G)
FROZEN = ROOT / "docs/verification/model-selection"
EPS = np.finfo(np.float64).eps
SAFETY_FACTOR = 100.0


def proposal(fixture):
    """Restore the irrelevant V2 edit; offset two symmetric development observations."""
    for row in fixture["rows"]:
        if row["rowId"] == "E2-00-00":
            row["features"]["monthly_charge"] = 40.0
        if row["rowId"] in ("E2-00-02", "E2-06-02"):
            row["features"]["monthly_charge"] = {"E2-00-02": 44.001, "E2-06-02": 74.001}[row["rowId"]]
    return fixture


def decimal_distances(train, queries):
    # Independently recompute fold-only population variance and Euclidean distances.
    # Decimal.from_float preserves the exact binary64 inputs rather than reparsing decimals.
    with localcontext() as ctx:
        ctx.prec = 70
        columns = [[Decimal.from_float(float(v)) for v in column] for column in train.T]
        means = [sum(c) / len(c) for c in columns]
        variances = [sum((v - mean) ** 2 for v in c) / len(c) for c, mean in zip(columns, means)]
        variances = [v if v else Decimal(1) for v in variances]
        return np.asarray([
            [float(sum((Decimal.from_float(float(a)) - Decimal.from_float(float(b))) ** 2 / var
                       for a, b, var in zip(q, t, variances)).sqrt()) for t in train]
            for q in queries
        ])


def folds(fixture):
    for outer in G.outer_fold_specs(fixture):
        yield f"development/outer-{outer['fold']}", outer["trainRows"], outer["validationRows"]
        rows = outer["trainRows"]
        for index, (ti, vi) in enumerate(G.group_splits(rows, [r["groupId"] for r in rows], 2), 1):
            yield f"nested/outer-{outer['fold']}/inner-{index}", [rows[int(i)] for i in ti], [rows[int(i)] for i in vi]


def cutoff_record(d, labels, k, tolerance):
    order = np.argsort(d, kind="stable")
    cutoff = float(d[order[k - 1]])
    next_distance = float(d[order[k]])
    # A meaningful margin is required for any opposite-label membership exchange.
    relevant = [float(d[j] - d[i]) for i in order[:k] for j in order[k:] if labels[i] != labels[j]]
    margin = min(relevant, default=float("inf"))
    cluster = np.flatnonzero(np.abs(d - cutoff) <= tolerance)
    closer = np.flatnonzero(d < cutoff - tolerance)
    slots = k - len(closer)
    positive = int(sum(labels[closer]))
    pos_cluster = int(sum(labels[cluster]))
    neg_cluster = len(cluster) - pos_cluster
    minimum = positive + max(0, slots - neg_cluster)
    maximum = positive + min(slots, pos_cluster)
    return {
        "kthDistance": cutoff, "nextDistance": next_distance,
        "cutoffSeparation": next_distance - cutoff,
        "nextRelevantOppositeLabelSeparation": margin if math.isfinite(margin) else None,
        "exactMixedCutoff": len(set(labels[np.flatnonzero(d == cutoff)])) > 1 and len(np.flatnonzero(d == cutoff)) > k - int(sum(d < cutoff)),
        "nearMixedCutoff": minimum != maximum,
        "possiblePositiveCounts": list(range(minimum, maximum + 1)),
        "positiveCount": int(sum(labels[order[:k]])),
        "meaningfulSeparation": margin > SAFETY_FACTOR * tolerance,
    }


def audit(fixture):
    records, failures, decisions = [], [], []
    max_error, min_ratio = 0.0, float("inf")
    candidates = [c for c in G.e2_candidates() if c["family"] == "knn"]
    for fold_id, train, valid in folds(fixture):
        assert set(r["groupId"] for r in train).isdisjoint(r["groupId"] for r in valid)
        x, y, ids = G.matrix(train, fixture["featureNames"])
        qx, _, qids = G.matrix(valid, fixture["featureNames"])
        high = decimal_distances(x, qx)
        for k in (1, 3, 5):
            est = G.make_e2_model("knn", k, True).fit(x, y)
            tx = est.named_steps["scale"].transform(x)
            tq = est.named_steps["scale"].transform(qx)
            ds, ix = est.named_steps["model"].kneighbors(tq, n_neighbors=len(y))
            actual = np.empty_like(ds)
            np.put_along_axis(actual, ix, ds, axis=1)
            subtract = np.sqrt(np.sum((tq[:, None, :] - tx[None, :, :]) ** 2, axis=2))
            fsum = np.asarray([[math.sqrt(math.fsum((float(a) - float(b)) ** 2 for a, b in zip(q, t))) for t in tx] for q in tq])
            # Reverse training order to expose any row-order-dependent prediction.
            reverse = G.make_e2_model("knn", k, True).fit(x[::-1], y[::-1]).predict_proba(qx)[:, 1]
            probability = est.predict_proba(qx)[:, 1]
            for qi, qid in enumerate(qids):
                norm_scale = max(1.0, float(np.sum(tq[qi] ** 2) + np.max(np.sum(tx ** 2, axis=1))))
                dk = float(np.partition(high[qi], k - 1)[k - 1])
                tolerance = max(1e-12, 4096.0 * EPS * norm_scale / max(2 * dk, math.sqrt(EPS)))
                methods = {"sklearn": actual[qi], "subtraction": subtract[qi], "fsum": fsum[qi], "decimal70": high[qi]}
                cuts = {name: cutoff_record(d, y, k, tolerance) for name, d in methods.items()}
                errors = {name: float(np.max(np.abs(d - high[qi]))) for name, d in methods.items()}
                max_error = max(max_error, *errors.values())
                margins = [v["nextRelevantOppositeLabelSeparation"] for v in cuts.values() if v["nextRelevantOppositeLabelSeparation"] is not None]
                if margins:
                    min_ratio = min(min_ratio, min(margins) / tolerance)
                safe = all(v["meaningfulSeparation"] and not v["nearMixedCutoff"] for v in cuts.values())
                safe &= max(errors.values()) <= tolerance
                safe &= len({v["positiveCount"] for v in cuts.values()}) == 1
                safe &= probability[qi] == reverse[qi] == cuts["decimal70"]["positiveCount"] / k
                for candidate in (c for c in candidates if c["parameter"] == k):
                    threshold = candidate["threshold"]
                    possible = sorted({int(count / k >= threshold) for count in cuts["decimal70"]["possiblePositiveCounts"]})
                    record = {
                        "fold": fold_id, "candidateId": candidate["candidateId"], "k": k, "threshold": threshold,
                        "queryId": qid, "trainingIds": ids, "trainingGroups": sorted({r["groupId"] for r in train}),
                        "validationIds": qids, "validationGroups": sorted({r["groupId"] for r in valid}),
                        "tolerance": tolerance, "requiredSafetyFactor": SAFETY_FACTOR,
                        "methods": cuts, "maxDistanceErrorVsDecimal70": errors,
                        "predictionCouldChange": len(possible) > 1, "possiblePredictions": possible,
                        "prediction": int(probability[qi] >= threshold), "reversedTrainingProbability": float(reverse[qi]),
                        "classVoteTie": 2 * cuts["decimal70"]["positiveCount"] == k,
                        "passed": bool(safe),
                        "rankings": {name: [{"rowId": ids[i], "label": int(y[i]), "distance": float(d[i]), "distance17": format(float(d[i]), ".17g")} for i in np.argsort(d, kind="stable")] for name, d in methods.items()},
                    }
                    records.append(record)
                    decisions.append([fold_id, candidate["candidateId"], qid, cuts["decimal70"]["positiveCount"], record["prediction"]])
                    if not safe:
                        failures.append({key: record[key] for key in ("fold", "candidateId", "queryId", "predictionCouldChange", "methods")})
    return records, {
        "passed": not failures, "foldPartitions": 9, "candidateConfigurations": len(candidates),
        "predictionRecords": len(records), "failureCount": len(failures), "failures": failures,
        "maxDistanceErrorVsDecimal70": max_error, "minimumRelevantMarginOverTolerance": min_ratio,
        "decisionDigest": hashlib.sha256(G.canonical(decisions)).hexdigest(),
    }


def leaf_diff(old, new, path=""):
    if type(old) is type(new) and isinstance(old, dict) and old.keys() == new.keys():
        return list(itertools.chain.from_iterable(leaf_diff(old[k], new[k], f"{path}/{k}") for k in old))
    if type(old) is type(new) and isinstance(old, list) and len(old) == len(new):
        return list(itertools.chain.from_iterable(leaf_diff(a, b, f"{path}/{i}") for i, (a, b) in enumerate(zip(old, new))))
    return [] if old == new else [{"path": path, "before": old, "after": new}]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--fixture", choices=("current", "proposal"), required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--expect", type=Path)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    assert not args.out.resolve().is_relative_to(FROZEN)
    before = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in FROZEN.iterdir() if p.is_file()}
    original = G.e2_fixture
    if args.fixture == "proposal":
        G.e2_fixture = lambda: proposal(original())
    with threadpool_limits(limits=1):
        records, summary = audit(G.e2_fixture())
        # Use the real generator, instrument its entry point, and ensure every live
        # KNN call is represented by a partition/k in the exhaustive audit.
        covered = {(tuple(r["trainingIds"]), r["queryId"], r["k"]) for r in records}
        original_guard = G.reject_ambiguous_knn_cutoffs
        live_queries = []
        def observe(est, x, y, ids, qids, k):
            for qid in qids:
                assert (tuple(ids), qid, k) in covered
                live_queries.append([ids, qid, k])
            if summary["passed"]:
                original_guard(est, x, y, ids, qids, k)
        G.reject_ambiguous_knn_cutoffs = observe
        payloads = G.output_payloads()
        repeated = G.output_payloads()
        assert payloads == repeated, "non-identical in-memory regeneration"
        assert (FROZEN / "ms-e1.manifest.v1.json").read_bytes() == payloads["ms-e1.manifest.v1.json"]
        assert (FROZEN / "ms-e1-test-reference-sealed.v1.json").read_bytes() == payloads["ms-e1-test-reference-sealed.v1.json"]
        assert (FROZEN / "ms-e2-test-reference-sealed.v1.json").read_bytes() == payloads["ms-e2-test-reference-sealed.v1.json"], "sealed E2 output changed"
        manifest = json.loads(payloads["ms-e2.manifest.v1.json"])
        assert all(r["groupId"] in manifest["fixture"]["developmentGroups"] for r in manifest["fixture"]["rows"])
        assert all("target" not in r for r in manifest["fixture"]["testFeatureRows"])
        summary.update({"livePredictionVisitsPerRegeneration": len(live_queries) // 2,
                        "byteIdenticalRegeneration": True, "msE1Unchanged": True, "sealedE2Unchanged": True,
                        "frozenFilesUnchanged": True,
                        "payloadHashes": {name: hashlib.sha256(p).hexdigest() for name, p in payloads.items() if name != "parity-report.v1.json"}})
        impact = leaf_diff(json.loads((FROZEN / "ms-e2.manifest.v1.json").read_bytes()), manifest)
        # Predictions/counts and all proposed payload hashes must agree with the
        # independently recorded local expectation before any freeze is allowed.
        if args.expect:
            expected = json.loads(args.expect.read_text())
            assert summary["decisionDigest"] == expected["decisionDigest"], "cross-environment decision drift"
            assert summary["payloadHashes"] == expected["payloadHashes"], "cross-environment payload drift"
    after = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in FROZEN.iterdir() if p.is_file()}
    assert before == after
    summary["environment"] = {"python": sys.version, "platform": platform.platform(), "threadpools": threadpool_info()}
    (args.out / "neighbor-rankings.json").write_bytes(G.canonical(G.scalar(records)))
    summary = G.scalar(summary)
    (args.out / "summary.json").write_bytes(G.canonical(summary))
    (args.out / "reference-impact.json").write_bytes(G.canonical(impact))
    print(json.dumps({k: v for k, v in summary.items() if k not in ("failures", "environment", "payloadHashes")}, indent=2))
    if not summary["passed"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
