"""Emit a trusted self-contained notebook patch."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
cells = []


def markdown(source):
    cells.append(dict(cell_type="markdown", metadata={}, source=source.splitlines(True)))


def code(source):
    cells.append(dict(cell_type="code", metadata={}, execution_count=None, outputs=[], source=source.splitlines(True)))


markdown("""# KNN classification — from distance to honest evaluation
ML Mastery — Learn Machine Learning by Doing.

KN01–KN04: distance/voting, scaling, legal k selection, workflow/limits. Prerequisites: EV, LG01–03, NumPy rows and training-only pipelines. Trusted author code only; no learner code execution in the web application. Fictional churn labels: 0 stays, 1 churns. Numeric targets would require regression, outside this notebook.

Reproducibility: CPython3.13.16, NumPy2.5.4, pandas3.0.6, Matplotlib3.11.2, scikit-learn1.9.1, SciPy1.18.1; seed1729. Embedded data; no credentials, uploads, remote datasets or paid services. Run all cells in order in a clean kernel. Genuine Google Colab execution is unverified.
""")
code("""import json, platform
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, balanced_accuracy_score, confusion_matrix
SEED = 1729
np.random.seed(SEED)
""")
markdown("""## Predict before running: how does k change a vote?
Distances1,2,3; labels0,1,1. Predict uniform k1, uniform k3 and distance-weighted k3. Explain why the nearest row does not always determine the vote. Expected labels: 0,1,0. The vote fraction is not a numeric regression target or calibrated risk.
""")
code("""manual_x = np.array([[1.], [2.], [3.]])
manual_y = np.array([0, 1, 1])
manual_distances = np.sqrt(np.sum((manual_x - [0.])**2, axis=1))
manual_predictions = [int(KNeighborsClassifier(n_neighbors=k, weights=w, algorithm='brute', metric='euclidean').fit(manual_x, manual_y).predict([[0.]])[0]) for k,w in [(1,'uniform'),(3,'uniform'),(3,'distance')]]
assert manual_predictions == [0,1,0]
print('distances', manual_distances.tolist(), 'predictions', manual_predictions)
""")
markdown("""## Duplicates and ties are distinct problems
Two exact zero-distance rows with opposing labels get equal distance weights; nonzero rows receive zero weight. Class-total ties choose0. At an equal-distance kth cutoff, the teaching UI rejects the ambiguity: sklearn's incidental order is not a universal stable-row-ID contract. Predict before revealing these two results.
""")
code("""duplicate_x = np.array([[0.], [0.], [2.]])
duplicate_y = np.array([0,1,1])
duplicate_model = KNeighborsClassifier(n_neighbors=3, weights='distance', algorithm='brute', metric='euclidean').fit(duplicate_x, duplicate_y)
assert duplicate_model.predict([[0.]])[0] == 0
assert np.allclose(duplicate_model.predict_proba([[0.]])[0], [.5,.5])
print('zero-distance vote fractions', duplicate_model.predict_proba([[0.]])[0].tolist())
""")
markdown("""## Training-only scaling changes geometry
Fictional units: spend_currency and support_contacts. Predict whether query[440,7.8] changes nearest neighbor after training-only standardization. Expected raw class0, scaled class1. Scaling is not evidence that every future query improves; irrelevant features remain irrelevant after scaling.
""")
code("""unit_x = np.array([[100,1],[220,8],[410,2],[650,9],[900,3],[1300,7]], dtype=float)
unit_y = np.array([0,1,0,1,0,1])
query = np.array([[440,7.8]])
raw = KNeighborsClassifier(n_neighbors=1, algorithm='brute', metric='euclidean').fit(unit_x, unit_y)
scaled = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=1, algorithm='brute', metric='euclidean')).fit(unit_x, unit_y)
unit_predictions = [int(raw.predict(query)[0]), int(scaled.predict(query)[0])]
assert unit_predictions == [0,1]
print('raw/scaled', unit_predictions)
""")
markdown("""## Select on training folds, then freeze and evaluate unseen rows
Embedded fictional customers have IDs, two prediction-time features and future churn labels. Rows0–11 train,12–15 development,16–19 final test. Select k using only three CV training folds (eight training rows per fold, so all k1/3/5 legal); every fold refits the entire scaler/model pipeline. Development is a diagnostic after CV selection, not test-based tuning. Final-test labels are used only after selection is frozen. Predict why a global scaler fit before CV would invalidate this boundary.
""")
code("""features = np.array([[100,1],[140,2],[180,1],[220,3],[260,2],[300,1],[400,8],[450,9],[500,7],[600,8],[700,9],[800,7],[160,2],[480,8],[280,3],[750,9],[120,1],[550,8],[310,2],[850,7]], dtype=float)
labels = np.array([0,0,0,0,0,0,1,1,1,1,1,1,0,1,0,1,0,1,0,1])
frame = pd.DataFrame(features, columns=['spend_currency','support_contacts'])
frame['row_id'] = ['customer-'+str(index) for index in range(20)]
train_ids, dev_ids, test_ids = list(range(12)), list(range(12,16)), list(range(16,20))
assert not set(train_ids) & set(dev_ids+test_ids)
folds = list(StratifiedKFold(3, shuffle=True, random_state=SEED).split(features[train_ids], labels[train_ids]))
cv = {}
for k in [1,3,5]:
    assert all(k <= len(train) for train, heldout in folds)
    candidate = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=k, algorithm='brute', metric='euclidean', n_jobs=1))
    cv[k] = float(np.mean(cross_val_score(candidate, features[train_ids], labels[train_ids], cv=folds, scoring='balanced_accuracy', n_jobs=1)))
selected_k = min(cv, key=lambda k: (-cv[k], k))
model = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=selected_k, algorithm='brute', metric='euclidean', n_jobs=1)).fit(features[train_ids], labels[train_ids])
dev_predictions = model.predict(features[dev_ids])
baseline = DummyClassifier(strategy='most_frequent').fit(features[train_ids], labels[train_ids])
test_predictions = model.predict(features[test_ids])
baseline_predictions = baseline.predict(features[test_ids])
result = dict(rows=20, folds=3, candidates=3, selected_k=selected_k, cv=cv, development_accuracy=float(accuracy_score(labels[dev_ids],dev_predictions)), test_balanced_accuracy=float(balanced_accuracy_score(labels[test_ids],test_predictions)), baseline_balanced_accuracy=float(balanced_accuracy_score(labels[test_ids],baseline_predictions)), confusion=confusion_matrix(labels[test_ids],test_predictions,labels=[0,1]).tolist())
assert result['test_balanced_accuracy'] == 1.0
assert result['baseline_balanced_accuracy'] == .5
print(json.dumps(result, sort_keys=True))
""")
markdown("""## Compare and report limits
All models must use identical held-out rows, target windows and metrics. Four test rows cannot certify future reliability or subgroup equity. KNN's local vote contrasts with Logistic's linear logit; SVM margin reasoning is comparison-only. Documentation quality needs separately human-reviewed Good/Needs Improvement labels; continuous house prices require regression.

Distance computation grows with stored rows and feature count in the brute-force reference. Noise dimensions can redirect neighbors; fast fit does not imply fast inference. A plotted first-two-feature projection is not the full geometry of a higher-dimensional model. Notebook execution and practice never award module mastery.
""")
notebook = dict(cells=cells, metadata=dict(kernelspec=dict(display_name='Python 3',language='python',name='python3'),language_info=dict(name='python',version='3.13.16'), reproducibility=dict(seed=1729, data='embedded-fictional-v1', colab='UNVERIFIED', dependency_profile='task013-local-verified')),nbformat=4,nbformat_minor=5)
for index, cell in enumerate(cells):
    cell['id'] = f'knn-{index:02d}'
print('*** Begin Patch\n*** Add File: '+str(ROOT/'apps/web/public/notebooks/supervised-knn.ipynb'))
print(''.join('+'+line+'\n' for line in json.dumps(notebook,indent=2).splitlines()),end='')
print('*** End Patch')
