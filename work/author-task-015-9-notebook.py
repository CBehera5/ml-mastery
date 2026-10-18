"""Emit a trusted standalone GB notebook as an apply_patch input."""
import json
from pathlib import Path

import nbformat

ROOT = Path(__file__).resolve().parents[1]
book = nbformat.v4.new_notebook()
book.metadata = {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python", "version": "3.13.16"}, "reproducibility": {"seed": 1729, "python": "3.13.16", "dependencies": {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}, "datasets": "Embedded fictional CC0-1.0 arrays;no uploads,credentials or remote data", "colab": "UNVERIFIED;local kernels are not Colab evidence"}}
book.cells = [
nbformat.v4.new_markdown_cell("# Gradient Boosting — Learn Machine Learning by Doing\nGB01–06 connect residual correction,classification score gradients,validation stopping,fold-only fitting and honest comparison. Predict before executing each section,then explain what changed. This is trusted author code,not hosted learner execution. Notebook execution does not award mastery.\n\nUse the exact metadata dependency profile in an isolated environment;no installation or remote data cells. Genuine Colab remains unverified."),
nbformat.v4.new_code_cell("""import json
import importlib.metadata
import numpy as np
from scipy.special import expit
from sklearn.ensemble import GradientBoostingRegressor, GradientBoostingClassifier, RandomForestRegressor
from sklearn.metrics import mean_squared_error, log_loss
from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer
from sklearn.model_selection import KFold, cross_val_score
expected_profile = {'numpy':'2.5.4','pandas':'3.0.6','matplotlib':'3.11.2','scikit-learn':'1.9.1','scipy':'1.18.1'}
assert all(importlib.metadata.version(name) == version for name,version in expected_profile.items())
X = np.arange(12,dtype=float).reshape(-1,1)
X_validation = np.array([.5,2.5,4.5,6.5,8.5,10.5]).reshape(-1,1)
y = np.array([1,2,3,8,5,6,7,8,15,10,11,12],dtype=float)
y_validation = np.array([1.5,3.5,5.5,7.5,9.5,11.5])
churn = np.array([0,0,1,0,0,0,1,1,1,0,1,1])
churn_validation = np.array([0,0,0,1,1,1])
parameters = dict(learning_rate=.5,n_estimators=8,max_depth=1,min_samples_leaf=2,min_samples_split=2,subsample=1.,max_features=None,random_state=1729,n_iter_no_change=None,ccp_alpha=0.,init=None,warm_start=False)
print('12 training IDs;6 distinct validation IDs. Final test is sealed and not evaluated. Features are available before prediction;prices use fictional units.')
"""),
nbformat.v4.new_markdown_cell("## GB01–02: add corrections,not independent averages\nPredict 3+.1×2 and the remaining residual for y=5. Then inspect the first actual fitted stage:its leaf mean need not equal every row's residual. Explain half-squared-loss gradient versus reported MSE."),
nbformat.v4.new_code_cell("""assert np.isclose(3+.1*2,3.2)
regression = GradientBoostingRegressor(loss='squared_error',**parameters).fit(X,y)
before = np.full(len(y),np.mean(y))
residual = y-before
tree = regression.estimators_[0,0]
contribution = tree.predict(X)
for leaf in np.unique(tree.apply(X)):
    mask = tree.apply(X) == leaf
    assert np.isclose(contribution[mask][0],np.mean(residual[mask]))
after = before+.5*contribution
assert np.allclose(after,next(regression.staged_predict(X)))
print('Initial mean:',float(np.mean(y)))
print('Residuals:',residual.tolist())
print('First leaf corrections:',contribution.tolist())
print('After first update:',after.tolist())
"""),
nbformat.v4.new_markdown_cell("## GB03: classification leaf adjustment is not merely y−p\nPredict the sign for y=1,p=.5. Distinguish negative gradient.5 from Newton leaf value2 for a one-row illustration. Actual fitted leaves group training rows. Scores become probabilities only after sigmoid;forest averaging has a different mechanism."),
nbformat.v4.new_code_cell("""classifier = GradientBoostingClassifier(loss='log_loss',**parameters).fit(X,churn)
prior = np.mean(churn)
initial_score = np.log(prior/(1-prior))
probability = expit(np.full(len(churn),initial_score))
negative_gradient = churn-probability
tree = classifier.estimators_[0,0]
for leaf in np.unique(tree.apply(X)):
    mask = tree.apply(X) == leaf
    newton = sum(negative_gradient[mask])/sum(probability[mask]*(1-probability[mask]))
    assert np.isclose(tree.predict(X)[mask][0],newton)
score = initial_score+.5*tree.predict(X)
assert np.allclose(score,next(classifier.staged_decision_function(X))[:,0])
assert np.allclose(expit(score),next(classifier.staged_predict_proba(X))[:,1])
print('Initial score:',float(initial_score),'negative gradients:',negative_gradient.tolist())
print('First fitted raw-score corrections:',tree.predict(X).tolist())
print('Stage probabilities:',expit(score).tolist())
print('At score0,p=.5,the explicit >= action is1;sklearn predict uses strict score>0 and selects0 at equality.')
"""),
nbformat.v4.new_markdown_cell("## GB04: select a permitted stage using validation only\nPredict whether stage8 must be best. Compare probability quality with accuracy. No implicit library early stopping and no test-performance feedback."),
nbformat.v4.new_code_cell("""regression_losses = [float(mean_squared_error(y_validation,prediction)) for prediction in regression.staged_predict(X_validation)]
classification_probabilities = list(classifier.staged_predict_proba(X_validation))
classification_losses = [float(log_loss(churn_validation,probability,labels=[0,1])) for probability in classification_probabilities]
def selected_stage(losses):
    minimum = min(losses)
    return next(index+1 for index,value in enumerate(losses) if abs(value-minimum)<=1e-12)
assert selected_stage(regression_losses)==4 and selected_stage(classification_losses)==4
assert regression_losses[3] < regression_losses[7]
assert classification_losses[3] < classification_losses[7]
assert all(np.mean((probability[:,1]>=.5)==churn_validation)==1 for probability in classification_probabilities)
print('Regression validation MSE:',regression_losses)
print('Classification validation log-loss:',classification_losses)
print('Both prefer stage4;classification accuracy remains1 even when probability loss worsens.')
"""),
nbformat.v4.new_markdown_cell("## GB05–06: fold boundaries and comparison\nPredict why preparation fitted on all development rows leaks inside CV. cross_val_score refits the complete pipeline per fold. This small demonstration uses no test data and does not retune the frozen experiments. Compare a fixed forest baseline on the same validation rows;no universal winner or causal importance claim."),
nbformat.v4.new_code_cell("""workflow = make_pipeline(SimpleImputer(),GradientBoostingRegressor(loss='squared_error',**parameters))
folds = KFold(n_splits=3,shuffle=True,random_state=1729)
scores = cross_val_score(workflow,X,y,cv=folds,scoring='neg_mean_squared_error')
forest = RandomForestRegressor(n_estimators=8,max_depth=1,min_samples_leaf=2,max_features=1.,bootstrap=True,random_state=1729).fit(X,y)
forest_prediction = forest.predict(X_validation)
assert np.allclose(forest_prediction,np.mean([tree.predict(X_validation) for tree in forest.estimators_],axis=0))
print('Fold-only pipeline MSE:',(-scores).tolist())
print('Fixed forest validation MSE:',float(mean_squared_error(y_validation,forest_prediction)))
print('Importance is model usage,not intervention. Report cost,noise,subgroups,calibration and shift. Tiny fictional data does not certify production quality.')
print(json.dumps({'training_rows':12,'validation_rows':6,'stages':8,'selected_regression':4,'selected_classification':4,'folds':3,'test_evaluated':False,'mastery_awarded':False},sort_keys=True))
""")]
for index, cell in enumerate(book.cells):
    cell.id = f"gb-v1-cell-{index}"
content = nbformat.writes(book)
print("*** Begin Patch")
print("*** Add File: " + str(ROOT / "apps/web/public/notebooks/supervised-gradient-boosting.ipynb"))
for line in content.splitlines():
    print("+" + line)
print("*** End Patch")
