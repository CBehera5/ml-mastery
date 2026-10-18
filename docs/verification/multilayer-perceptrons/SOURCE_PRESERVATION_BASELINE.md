# Portable MLP Source-Preservation Baseline

`source-preservation-baseline.v1.json` replaces the historical `outputs/` dependency in the MLP freeze generator. It contains the approved source file inventory as repository-relative paths with SHA-256 values, a digest of that mapping, lineage metadata and a self-digest. It contains no absolute paths, learner data or secrets.

## Verification contract

From the repository root, activate the approved Python 3.13.16 numerical environment and run:

```sh
python work/freeze-task-015-11.py --freeze
python work/freeze-task-015-11.py --check
python work/check-mlp-freeze-outputs.py
```

The generator verifies the baseline self-digest, requires exactly 535 listed files, recomputes each file hash, rejects any changed or missing path, and verifies the aggregate mapping digest. The freeze lock records the baseline file hash in addition to the generator, convention and generated artifacts. `--check` recomputes the trusted numerical outputs and requires byte-identical frozen files. It does not use local `outputs/` files or modify learner storage.

## Historical lineage limitation

The Task 015.9 source-equality record retained a 517-file per-file hash map. Its two reported approved discovery changes are recorded as explicit hash overrides, and 18 Task 015.10 SVM additions complete the 535-file source set. The Task 015.10 equality record retained an aggregate digest (`06065cb9a247afee31b97e1643c5d443b17c01e534e79176495387324e861efc`) but not its per-file map. That legacy digest is preserved as provenance; because the historical map is unavailable, the baseline does not claim to reconstruct or equal it. Its own aggregate is reproducibly computed over the explicit portable map and is the ongoing preservation oracle.

## Scope

This is a source-preservation guard, not a Git commit or claim of exhaustive filesystem equality. It covers the prior Task 015.10 application/source inventory; MLP additions are separately tracked by the MLP source-checksum manifest. It never reads browser storage, local learner evidence or private user data. `MASTERY_AVAILABLE` remains false.
