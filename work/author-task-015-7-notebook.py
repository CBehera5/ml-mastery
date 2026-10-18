"""Emit a standalone trusted notebook with embedded fictional datasets."""
import json
from pathlib import Path
import nbformat

ROOT = Path(__file__).resolve().parents[1]
notebook = nbformat.v4.new_notebook()
notebook.metadata = {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python", "version": "3.13.16"}, "reproducibility": {"seed": 1729, "python": "3.13.16", "dependencies": {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}, "datasets": "Embedded fictional arrays only; no credentials, uploads or remote data", "colab": "UNVERIFIED; local execution is not Colab evidence"}}
notebook.cells = [
    nbformat.v4.new_markdown_cell("# Decision Trees — Learn Machine Learning by Doing\nDT01–06: house-price partitions and customer churn. Predict first, run trusted code, explain changes. Notebook execution is not module mastery.\n\nUse the metadata's verified dependency profile in an isolated environment. No automatic installs or external datasets. Genuine Colab remains unverified."),
    nbformat.v4.new_code_cell("""import json
import numpy as np
import sklearn
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.metrics import mean_squared_error, confusion_matrix
from sklearn.model_selection import KFold
assert np.__version__ == '2.5.4' and sklearn.__version__ == '1.9.1'
X = np.array([[index, (index+1)%2] for index in range(1,9)], dtype=float)
X_dev = np.array([[1.5,0],[3.5,1],[5.5,0],[8.5,1]])
y_price = np.array([2,3,4,5,6,7,8,12], dtype=float)
y_price_dev = np.array([3,5,7,8], dtype=float)
y_churn = np.array([0,0,1,0,1,1,0,1])
y_churn_dev = np.array([0,1,0,1])
assert len(X) == len(y_price) == len(y_churn)
print('Eight aligned training rows, four development rows; price units100000; churn0=stays,1=churns.')
"""),
    nbformat.v4.new_markdown_cell("## DT01–02: route, split and predict\nBefore running: does increasing depth guarantee lower development error? Leaf[2,4] predicts3; SSE2 is not the prediction. Candidate splits use size-weighted MSE gain. A new query follows saved thresholds without its target."),
    nbformat.v4.new_code_cell("""assert np.mean([2,4]) == 3
assert np.sum((np.array([2,4])-3)**2) == 2
regression = []
for depth in [1,2,3]:
    model = DecisionTreeRegressor(criterion='squared_error', splitter='best', max_depth=depth, min_samples_leaf=1, random_state=1729).fit(X,y_price)
    train_mse = mean_squared_error(y_price,model.predict(X))
    dev_mse = mean_squared_error(y_price_dev,model.predict(X_dev))
    regression.append([depth,float(train_mse),float(dev_mse)])
assert regression[0][1:] == [3.0,3.0]
assert regression[1][1:] == [.375,5.0625]
print(json.dumps(regression))
print('Saved paths:',model.decision_path(X_dev).toarray().tolist())
print('Leaf predictions beyond training range:',model.predict([[100,0]]).tolist())
"""),
    nbformat.v4.new_markdown_cell("## DT03: classification mixing, not price error\nPredict Gini for[2,2] and[9,1]. Inspect class order before reading probabilities. Pure training leaves do not guarantee held-out success or calibration. Context only: entropy of balanced binary classes is1bit, Gini.5; no entropy fitted tree."),
    nbformat.v4.new_code_cell("""gini = lambda counts: 1-sum((np.array(counts)/sum(counts))**2)
assert np.isclose(gini([2,2]),.5) and np.isclose(gini([9,1]),.18)
classifier = DecisionTreeClassifier(criterion='gini', max_depth=2, min_samples_leaf=1, random_state=1729).fit(X,y_churn)
assert classifier.classes_.tolist() == [0,1]
print('Class probabilities:',classifier.predict_proba(X_dev).tolist())
print('Held-out confusion:',confusion_matrix(y_churn_dev,classifier.predict(X_dev),labels=[0,1]).tolist())
print('Importance is training split reduction, not causality:',classifier.feature_importances_.tolist())
"""),
    nbformat.v4.new_markdown_cell("## DT04–05: fold-local pruning and selection\nDerive pruning candidates using each fold's training rows only. Choose by development/CV, never final-test feedback. Candidate path lengths can differ by fold. No preprocessing is learned in this complete-data example; if added it must also fit within each training fold."),
    nbformat.v4.new_code_cell("""fold_results = []
for train, validation in KFold(n_splits=3,shuffle=True,random_state=1729).split(X):
    path = DecisionTreeRegressor(criterion='squared_error',random_state=1729).cost_complexity_pruning_path(X[train],y_price[train])
    losses = []
    for alpha in path.ccp_alphas:
        fitted = DecisionTreeRegressor(criterion='squared_error',ccp_alpha=float(alpha),random_state=1729).fit(X[train],y_price[train])
        losses.append(float(mean_squared_error(y_price[validation],fitted.predict(X[validation]))))
    assert set(train).isdisjoint(validation)
    fold_results.append({'training_ids':train.tolist(),'validation_ids':validation.tolist(),'candidate_count':len(losses),'mse':losses})
print(json.dumps(fold_results,sort_keys=True))
"""),
    nbformat.v4.new_markdown_cell("## DT06: compare honestly\nExplain a local path with its conditions and training coverage. Compare linear coefficients and tree leaf constants on matching held-out rows; no universal winner. A conceptual forest can reduce instability but is not fitted here. Report subgroup counts, range limitations and uncertainty.\n\nDevelopment results above are exploratory, not final-test claims. After choosing and freezing a complete workflow, use a separately untouched test set; no final test is supplied or reused here."),
    nbformat.v4.new_code_cell("""summary = {'rows':len(X),'development_rows':len(X_dev),'folds':len(fold_results),'regression':regression,'class_order':classifier.classes_.tolist(),'mastery_awarded':False}
print(json.dumps(summary,sort_keys=True))
""")
]
destination = ROOT / "apps/web/public/notebooks/supervised-decision-trees.ipynb"
print("*** Begin Patch\n*** Add File: " + str(destination))
print("\n".join("+"+line for line in nbformat.writes(notebook).splitlines()))
print("*** End Patch")
