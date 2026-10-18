# Task 015.11 — Sanitization and Portable Source Snapshot

## Repository and scope

The approved application directory had no `.git` metadata or recoverable project history. This authorized local snapshot therefore starts a new repository; it does not replace an existing history. No remote is configured and no code is pushed. This work does not change application behavior, learner evidence or mastery. MLP mastery remains disabled.

## Sanitization

- The six convention documents listed below had their local interpreter paths replaced by portable `python` commands run after activating the approved environment. The Decision Tree and Naive Bayes command examples also now explicitly include the authorized `--freeze` step. Mathematical text, fixtures, solver settings and objective definitions were not edited.
- Unfrozen completion/readiness reports were sanitized by replacing local temporary workspace paths with portable descriptions. The EV Phase B evidence JSON had only its descriptive `environment.executable` and `environment.MPLCONFIGDIR` values redacted; its numerical manifests and their lock are unchanged.
- Captured MLP notebook warning output had the local site-packages prefix replaced by `<approved-python-environment>`; code cells, numerical outputs and notebook execution behavior were not changed.
- The intentional generic unsafe absolute-path fixture remains exactly unchanged. Four obsolete one-off helper scripts with local paths or excluded external evidence dependencies remain on disk but are excluded from the source snapshot. Task logs and all `outputs/` evidence remain excluded.

## Six convention re-freezes

| Module | Convention document | Approved generator | Verification |
| --- | --- | --- | --- |
| Decision Trees | `docs/verification/decision-trees/SPLIT_IMPURITY_PRUNING_CONVENTIONS.md` | `work/freeze-task-015-7.py` | `--freeze` and `--check` passed |
| KNN | `docs/verification/knn/DISTANCE_TIE_SCALING_CONVENTIONS.md` | `work/freeze-task-015-5.py` | `--freeze` and `--check` passed |
| Logistic Regression | `docs/verification/logistic/NUMERICAL_CONVENTIONS.md` | `work/freeze-task-015-4.py` | `--freeze` and `--check` passed |
| MLP | `docs/verification/multilayer-perceptrons/NUMERICAL_GRADIENT_CHECKPOINT_CONVENTIONS.md` | `work/freeze-task-015-11.py` | `--freeze` and `--check` passed |
| Naive Bayes | `docs/verification/naive-bayes/PROBABILITY_SMOOTHING_VARIANCE_CONVENTIONS.md` | `work/freeze-task-015-6.py` | `--freeze` and `--check` passed |
| Regularization | `docs/verification/regularization/NUMERICAL_CONVENTIONS.md` | `work/freeze-task-015-3.py` | `--freeze` and `--check` passed |

The pinned interpreter was CPython 3.13.16 with NumPy 2.5.4, pandas 3.0.6, Matplotlib 3.11.2, scikit-learn 1.9.1 and SciPy 1.18.1. Previously recorded manifest hashes for Regularization, Logistic Regression and MLP match their regenerated artifacts. The other three modules had no prior per-manifest hash retained in this project directory; their generators recomputed trusted references and their subsequent `--check` passes were byte-identical, but historical byte-for-byte comparison cannot be asserted. Five non-MLP freeze locks were regenerated for convention-hash changes. The MLP lock also records its updated generator and portable-baseline hashes. MLP revalidated 1,030 finite-difference checks (maximum gradient absolute error `1.6872304942072702e-10`), all 1,024 stage updates and all 73 experiment states.

## Portable MLP preservation baseline

`docs/verification/multilayer-perceptrons/source-preservation-baseline.v1.json` contains 535 repository-relative path-to-SHA-256 entries and a content digest. It is self-contained; the MLP freeze generator no longer reads `outputs/`.

Lineage: the Task 015.9 report retained 517 hashes. Exactly two entries are the explicitly recorded authorized discovery changes in the learning-journey catalog and supervised overview; 18 Task 015.10 SVM source additions complete the 535-file map. The Task 015.10 equality report recorded 535 equal files and no mismatches but did not retain its per-file mapping. Its opaque aggregate `06065cb9a247afee31b97e1643c5d443b17c01e534e79176495387324e861efc` cannot be independently reconstructed from the retained mapping using the stated serialization. It is preserved as provenance, not falsely asserted equal to the new portable aggregate. The new explicit map computes its own stable aggregate and every generator check verifies all 535 files against it. This is a documented limitation in historical evidence, not a numerical-fixture or application-source change.

The check wrapper now calls the actual generator with `--check`; it no longer rewrites source in memory to bypass preservation assertions. See `docs/verification/multilayer-perceptrons/SOURCE_PRESERVATION_BASELINE.md` for schema and reproduction details.

## Source integrity and exclusions

- All entries in the MLP source checksum manifest are verified after regeneration.
- `package-lock.json`, application source, assessment/mastery definitions and learner evidence are preserved. No dependencies were installed or upgraded; no learner storage was accessed.
- `.gitignore` excludes `.env*` except `.env.example`, private credentials/state, learner/browser data, `outputs/`, generated caches/build products and local Python/Node environments. Exact rules omit four obsolete path-bound helpers; current freeze generators, notebooks, tests and CI tools remain included.
- A staged-path review and secret/absolute-path scans are mandatory before the initial local commit. Only the intentional unsafe fixture path may appear in tracked source.

The reviewed pre-manifest index contains 811 files (30,785,393 bytes). It contains no `outputs/`, dependency/build caches, local learner/browser state, or path-bound historical helper scripts. Absolute-path scanning finds only the intentionally retained unsafe fixture in the Python exercise contract/reference; secret-pattern scanning found no credentials or private keys. `.env.example` is included and contains placeholders only. The project source uses the unchanged `package-lock.json` SHA-256 recorded in the MLP source-checksum manifest.

`docs/verification/source-snapshot-manifest.v1.json` records SHA-256 for every pre-manifest staged path using repository-relative names and exact staged blob contents. It excludes only itself to avoid a self-referential hash. Its aggregate is the SHA-256 of the sorted-key JSON path-to-hash mapping; its `content_sha256` is computed over the manifest payload without that field using compact sorted-key JSON. Reproduction: enumerate `git ls-files -z`, omit the manifest path, hash each index blob (`git show :<path>`), sort by path, and apply the declared serialization.

## CI readiness

The workflow is manual-only; it was not dispatched. It pins Node 20.19.4/npm 10.8.2 and Python 3.13.16 and verifies bounded frontend, Python, numerical, notebook and browser checks. GitHub currently documents `macos-15` as an ARM64 M1 runner ([runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)), and the official [`actions/python-versions` manifest](https://raw.githubusercontent.com/actions/python-versions/main/versions-manifest.json) includes a CPython 3.13.16 macOS ARM64 build. This confirms label/artifact compatibility, not a successful CI run. The GitHub account's private-repository runner entitlements and actual workflow execution remain unverified.

## Remaining obligations

No external publication, CI run, deployment or Task 015.12 implementation is authorized. Genuine screen-reader, browser-zoom and Google Colab verification remain open. Original-directory I/O reliability remains open. Review the initial commit and exact staged file list before creating a private GitHub repository or remote.
