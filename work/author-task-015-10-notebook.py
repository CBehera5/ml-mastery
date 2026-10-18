"""Emit trusted standalone SVM notebook source as an apply_patch input."""
from pathlib import Path
import nbformat

ROOT = Path(__file__).resolve().parents[1]
book = nbformat.v4.new_notebook()
book.metadata = {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python", "version": "3.13.16"}, "reproducibility": {"seed": 1729, "python": "3.13.16", "dependencies": {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}, "dataset": "Embedded original fictional CC0-1.0 arrays only;no credentials,uploads or remote datasets", "colab": "UNVERIFIED:local kernels do not verify Colab", "solver": {"tol": 1e-6, "max_iter": 200000, "shrinking": False, "probability": False}}}
book.cells = [
nbformat.v4.new_markdown_cell("# Support Vector Machines — Learn Machine Learning by Doing\nSV01–05:begin with separating geometry,then soft margins/C,RBF locality,training-only scaling and safe comparison. Predict before executing each section;explain changed outcomes. These are trusted author examples,not arbitrary hosted learner execution. Notebook execution never awards mastery.\n\nUse the exact dependency profile in metadata. No install,remote-data,credential or upload cells. Genuine Colab remains unverified."),
nbformat.v4.new_code_cell("""import json
import warnings
import importlib.metadata
import numpy as np
from sklearn.base import clone
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import balanced_accuracy_score
from sklearn.metrics.pairwise import rbf_kernel
from sklearn.model_selection import StratifiedKFold
profile = {'numpy':'2.5.4','pandas':'3.0.6','matplotlib':'3.11.2','scikit-learn':'1.9.1','scipy':'1.18.1'}
assert all(importlib.metadata.version(name)==version for name,version in profile.items())
parameters = dict(probability=False,shrinking=False,tol=1e-6,max_iter=200000,cache_size=64,random_state=1729)
notices = []
def fit_trusted(model,inputs,targets):
    with warnings.catch_warnings(record=True) as captured:
        warnings.simplefilter('always')
        model.fit(inputs,targets)
    assert all(issubclass(item.category,FutureWarning) and 'probability' in str(item.message) for item in captured)
    notices.extend(str(item.message) for item in captured)
    estimator = model.named_steps['svc'] if hasattr(model,'named_steps') else model
    assert estimator.fit_status_ == 0
    return model
print('Binary labels0=stays,1=churns. Scores are not calibrated probabilities. Final test is sealed and not evaluated.')
"""),
nbformat.v4.new_markdown_cell("## SV01:score,distance and support membership\nPredict the score and distance for w=(1,0),b=0,x=(2,3),then double w. Will the score or geometric distance change? Predict whether every on-margin training observation must be a solver-active support."),
nbformat.v4.new_code_cell("""point = np.array([2.,3.])
normal = np.array([1.,0.])
assert np.dot(normal,point)==2
assert np.dot(2*normal,point)==4
assert np.isclose(np.dot(normal,point)/np.linalg.norm(normal),np.dot(2*normal,point)/np.linalg.norm(2*normal))
linear_X = np.array([[-2,-1],[-2,1],[-1,-1],[-1,1],[1,-1],[1,1],[2,-1],[2,1]],dtype=float)
linear_y = np.array([0,0,0,0,1,1,1,1])
linear = fit_trusted(SVC(kernel='linear',C=1.,gamma=1.,**parameters),linear_X,linear_y)
assert np.allclose(linear.coef_,[[1.,0.]])
assert len(linear.support_)==2
scores = linear.decision_function(linear_X)
assert sum(np.isclose(np.abs(scores),1.))==4
assert linear.predict([[0.,0.]]).tolist()==[1]
print('Coefficient:',linear.coef_.tolist(),'support indices:',linear.support_.tolist())
print('Four geometric margin points,but only two solver-active supports. Exact-zero native score predicts1;manual geometry calls it on-boundary.')
print('A zero normal has undefined distance,not an invented zero. A score2 is not probability2.')
"""),
nbformat.v4.new_markdown_cell("## SV02:soft margins and C\nPredict hinge at y=+1,F=.5 and F=−.5. Then compare small/large C without claiming a universal validation direction. Canonical slab width2/||w|| is geometric in these feature units,not arbitrary pixel width or a confidence interval."),
nbformat.v4.new_code_cell("""assert np.isclose(max(0,1-.5),.5)
assert np.isclose(max(0,1-(-.5)),1.5)
soft = fit_trusted(SVC(kernel='linear',C=.1,gamma=1.,**parameters),linear_X,linear_y)
assert np.isclose(2/np.linalg.norm(soft.coef_),4.)
assert np.isclose(2/np.linalg.norm(linear.coef_),2.)
signed_y = 2*linear_y-1
print('Small-C hinge:',np.maximum(0,1-signed_y*soft.decision_function(linear_X)).tolist())
print('Canonical widths:',float(2/np.linalg.norm(soft.coef_)),float(2/np.linalg.norm(linear.coef_)))
print('C multiplies violation cost relative to .5||w||²;larger C is not stronger norm regularization. No finite-C hard-margin guarantee for noisy data.')
"""),
nbformat.v4.new_markdown_cell("## SV03:RBF locality and units\nPredict exp(−1) versus exp(−4). The second raw feature below is expressed100 times larger. Compare raw/scaled RBF and a linear baseline on exactly the same nonlinear dataset;do not infer a universal winner."),
nbformat.v4.new_code_cell("""X = np.array([[-2,-200],[-1,-100],[1,100],[2,200],[-2,200],[-1,100],[1,-100],[2,-200],[-2,-100],[1,200],[-2,100],[1,-200]],dtype=float)
y = np.array([1,1,1,1,0,0,0,0,1,1,0,0])
X_validation = np.array([[.5,50],[1.5,150],[-.5,-50],[.5,-50],[-1.5,150],[-.5,50]],dtype=float)
y_validation = np.array([1,1,1,0,0,0])
assert np.isclose(rbf_kernel([[0,0]],[[1,0]],gamma=1.)[0,0],np.exp(-1.))
assert np.exp(-4.) < np.exp(-1.)
raw = fit_trusted(SVC(kernel='rbf',C=1.,gamma=1.,**parameters),X,y)
pipeline = fit_trusted(make_pipeline(StandardScaler(),SVC(kernel='rbf',C=1.,gamma=1.,**parameters)),X,y)
linear_pipeline = fit_trusted(make_pipeline(StandardScaler(),SVC(kernel='linear',C=1.,gamma=1.,**parameters)),X,y)
raw_score = balanced_accuracy_score(y_validation,raw.predict(X_validation))
scaled_score = balanced_accuracy_score(y_validation,pipeline.predict(X_validation))
linear_score = balanced_accuracy_score(y_validation,linear_pipeline.predict(X_validation))
assert raw_score==.5 and scaled_score==1. and linear_score==.5
scaler = pipeline.named_steps['standardscaler']
assert np.allclose(scaler.mean_,X.mean(axis=0))
estimator = pipeline.named_steps['svc']
prepared = scaler.transform(X_validation)
manual_score = rbf_kernel(prepared,estimator.support_vectors_,gamma=1.)@estimator.dual_coef_[0]+estimator.intercept_[0]
assert np.allclose(manual_score,pipeline.decision_function(X_validation),atol=1e-9,rtol=1e-9)
print('Raw RBF,scaled RBF,scaled linear validation balanced accuracy:',raw_score,scaled_score,linear_score)
print('RBF scores:',pipeline.decision_function(X_validation).tolist())
print('Kernel similarity is not a measured feature column or probability. High gamma can chase small regions;underflowed exponentials are numerically0,not theoretically0.')
"""),
nbformat.v4.new_markdown_cell("## SV04:fold-only fitting and bounded selection\nPredict why reusing a globally fitted scaler inside CV leaks information. Refit the whole pipeline on each fold's training rows. Select from two fixed C values by development CV only;test data is never opened. This is separate notebook practice,not additional experiment configurations."),
nbformat.v4.new_code_cell("""folds = list(StratifiedKFold(n_splits=3,shuffle=True,random_state=1729).split(X,y))
candidate_results = []
fit_permissions = []
for strength in [.1,1.]:
    scores = []
    for fold_number,(training,validation) in enumerate(folds):
        assert not set(training)&set(validation)
        model = clone(pipeline).set_params(svc__C=strength)
        fit_trusted(model,X[training],y[training])
        assert np.allclose(model.named_steps['standardscaler'].mean_,X[training].mean(axis=0))
        scores.append(float(balanced_accuracy_score(y[validation],model.predict(X[validation]))))
        fit_permissions.append({'C':strength,'fold':fold_number,'fit_ids':training.tolist(),'validation_ids':validation.tolist()})
    candidate_results.append({'C':strength,'mean_balanced_accuracy':float(np.mean(scores))})
best_score = max(item['mean_balanced_accuracy'] for item in candidate_results)
chosen = next(item for item in candidate_results if abs(item['mean_balanced_accuracy']-best_score)<=1e-12)
print('Permitted CV candidates:',candidate_results,'chosen:',chosen)
print('Fold fit IDs:',fit_permissions)
print('Training-only once is not fold-only every time. Class weighting changes C_i,not probabilities;balanced weights use current training-fold counts.')
"""),
nbformat.v4.new_markdown_cell("## SV05:limits and comparison\nExplain why the matched-row synthetic results above do not certify calibrated risk or a universal winner. Compare Logistic,KNN and tree trade-offs,query cost,feature units and population shift. Technical Documentation Quality would need approved human labels and provenance;housing regression does not authorize SVR here."),
nbformat.v4.new_code_cell("""print('RBF query work depends on support/kernel evaluations;large kernel fits can be expensive. Preserve sample counts,subgroup and shift limitations.')
print('Expected pinned-library notices:',sorted(set(notices)))
print(json.dumps({'training_rows':12,'validation_rows':6,'folds':3,'candidates':2,'linear_supports':2,'raw_rbf_validation':float(raw_score),'scaled_rbf_validation':float(scaled_score),'test_evaluated':False,'mastery_awarded':False},sort_keys=True))
""")]
for index, cell in enumerate(book.cells):
    cell.id = f"sv-v1-cell-{index}"
print("*** Begin Patch")
print("*** Add File: " + str(ROOT / "apps/web/public/notebooks/supervised-svm.ipynb"))
print("\n".join("+" + line for line in nbformat.writes(book).splitlines()))
print("*** End Patch")
