"""Emit the trusted standalone RF notebook with embedded fictional inputs."""
from pathlib import Path
import nbformat

ROOT = Path(__file__).resolve().parents[1]
book = nbformat.v4.new_notebook()
book.metadata = {"kernelspec":{"display_name":"Python 3","language":"python","name":"python3"},"language_info":{"name":"python","version":"3.13.16"},
                 "reproducibility":{"seed":1729,"python":"3.13.16","dependencies":{"numpy":"2.5.4","pandas":"3.0.6","matplotlib":"3.11.2","scikit-learn":"1.9.1","scipy":"1.18.1"},"datasets":"Embedded fictional arrays only;no credentials,uploads or remote datasets","colab":"UNVERIFIED;local execution is not Colab evidence"}}
book.cells = [
nbformat.v4.new_markdown_cell("# Random Forests — Learn Machine Learning by Doing\nRF01–RF05: extend tree partitions into bootstrap diversity,numeric means,probability aggregation,OOB limits and fair comparison. Predict first,run trusted code,explain changed outcomes. Notebook execution does not award mastery.\n\nUse the verified dependency profile in an isolated environment. There are no installation,credential,upload or remote-data cells. Genuine Colab remains unverified."),
nbformat.v4.new_code_cell("""import json
import warnings
import numpy as np
import sklearn
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.metrics import mean_squared_error, accuracy_score
from sklearn.model_selection import KFold
from sklearn.inspection import permutation_importance
assert np.__version__ == '2.5.4' and sklearn.__version__ == '1.9.1'
X = np.array([[index,other] for index,other in zip(range(1,9),[2,8,1,7,3,6,4,5])],dtype=float)
X_dev = np.array([[1.5,2],[3.5,7],[5.5,3],[7.5,5]],dtype=float)
y_price = np.array([2,3,4,5,6,7,8,12],dtype=float)
y_price_dev = np.array([3,5,7,8],dtype=float)
y_churn = np.array([0,0,1,0,1,1,0,1])
y_churn_dev = np.array([0,1,0,1])
params = dict(n_estimators=7,max_depth=2,min_samples_split=2,min_samples_leaf=1,min_weight_fraction_leaf=0.,max_features=1,max_leaf_nodes=None,min_impurity_decrease=0.,bootstrap=True,oob_score=True,n_jobs=1,random_state=1729,verbose=0,warm_start=False,ccp_alpha=0.,max_samples=None,monotonic_cst=None)
notices = []
def fit_trusted(model,features,targets):
    with warnings.catch_warnings(record=True) as captured:
        warnings.simplefilter('always')
        model.fit(features,targets)
    notices.extend(str(item.message) for item in captured)
    return model
print('Eight aligned training rows;four separate development rows. Prices in100000 currency units;churn0=stays,1=churns. No final test used for selection.')
"""),
nbformat.v4.new_markdown_cell("## RF01–02: diversity and means\nPredict whether copies of one tree create independent evidence. Trace duplicate bootstrap IDs and absent rows. Then predict why averaging might change sensitivity but not remove shared bias or create a calibrated interval."),
nbformat.v4.new_code_cell("""regression = fit_trusted(RandomForestRegressor(criterion='squared_error',**params),X,y_price)
draws = [draw.tolist() for draw in regression.estimators_samples_]
per_tree = np.array([tree.predict(X_dev) for tree in regression.estimators_])
assert np.allclose(per_tree.mean(axis=0),regression.predict(X_dev),atol=1e-9,rtol=1e-9)
assert np.isclose(np.mean([2,4,6]),4)
assert np.isclose(np.mean([4,4,4]),4)
assert np.std([4,4,4]) == 0
print('Bootstrap row indices:',draws)
print('Individual prices:',per_tree.tolist())
print('Forest mean:',regression.predict(X_dev).tolist())
print('Development MSE:',float(mean_squared_error(y_price_dev,regression.predict(X_dev))))
single = DecisionTreeRegressor(criterion='squared_error',max_depth=2,random_state=1729).fit(X,y_price)
print('Full-sample single-tree MSE:',float(mean_squared_error(y_price_dev,single.predict(X_dev))))
print('The one-tree full-sample baseline differs from a one-tree bootstrap forest. Tree spread is not calibrated outcome coverage.')
"""),
nbformat.v4.new_markdown_cell("## RF03: probabilities before decisions\nPredict the class for tree P(churn)=[.4,.4,.9]. Hard labels vote0;averaged probabilities select1. At [.5,.5],sorted-class argmax selects0 while a separately declared >=.5 positive action selects1. A changed threshold is not model retraining."),
nbformat.v4.new_code_cell("""classifier = fit_trusted(RandomForestClassifier(criterion='gini',class_weight=None,**params),X,y_churn)
assert classifier.classes_.tolist() == [0,1]
vectors = np.array([tree.predict_proba(X_dev) for tree in classifier.estimators_])
assert np.allclose(vectors.mean(axis=0),classifier.predict_proba(X_dev),atol=1e-9,rtol=1e-9)
counterexample = np.array([[.6,.4],[.6,.4],[.1,.9]])
assert int(np.argmax(counterexample.mean(axis=0))) == 1
assert int(np.argmax(np.bincount(np.argmax(counterexample,axis=1),minlength=2))) == 0
assert int(np.argmax([.5,.5])) == 0 and int(.5 >= .5) == 1
print('Aligned class order:',classifier.classes_.tolist())
print('Forest probabilities:',classifier.predict_proba(X_dev).tolist())
print('Development accuracy:',float(accuracy_score(y_churn_dev,classifier.predict(X_dev))))
"""),
nbformat.v4.new_markdown_cell("## RF04: OOB membership is row-specific\nOnly trees whose bootstrap excludes the original training ID contribute. Predict what happens with zero contributors:unavailable,not zero. The library may store raw zero placeholders and include them in default scoring;these are not valid missing OOB predictions. OOB cannot repair related-entity,time or global-preprocessing leakage."),
nbformat.v4.new_code_cell("""oob = []
for row in range(len(X)):
    contributors = [index for index,draw in enumerate(regression.estimators_samples_) if row not in draw]
    if contributors:
        prediction = float(np.mean([regression.estimators_[index].predict(X[[row]])[0] for index in contributors]))
        assert np.isclose(prediction,regression.oob_prediction_[row])
        mathematical = {'prediction':prediction}
    else:
        mathematical = {'tag':'unavailable','reason':'no-oob-contributor'}
    oob.append({'row':row,'contributing_trees':contributors,'mathematical':mathematical})
tiny_params = {**params,'n_estimators':1}
tiny = fit_trusted(RandomForestRegressor(criterion='squared_error',**tiny_params),X,y_price)
uncovered = [row for row in range(len(X)) if row in tiny.estimators_samples_[0]]
assert uncovered and np.all(tiny.oob_prediction_[uncovered] == 0)
print('Mathematical OOB:',json.dumps(oob,sort_keys=True))
print('Uncovered one-tree rows,NOT zero predictions:',sorted(set(uncovered)))
"""),
nbformat.v4.new_markdown_cell("## RF04: fold-local selection boundary\nA complete-data independent-row example compares finite depth candidates on matching folds. If preprocessing is learned,fit it within each training fold. Repeated entities or future deployment need appropriate grouped/temporal splits instead. Development/CV selects;an untouched final test is evaluated after freezing,not tuned here."),
nbformat.v4.new_code_cell("""cv = []
for depth in [1,2]:
    errors = []
    for training,validation in KFold(n_splits=3,shuffle=True,random_state=1729).split(X):
        assert set(training).isdisjoint(validation)
        model = fit_trusted(RandomForestRegressor(criterion='squared_error',**{**params,'max_depth':depth}),X[training],y_price[training])
        errors.append(float(mean_squared_error(y_price[validation],model.predict(X[validation]))))
    cv.append({'depth':depth,'fold_mse':errors,'mean_mse':float(np.mean(errors))})
print('Fixed-fold comparison:',json.dumps(cv,sort_keys=True))
"""),
nbformat.v4.new_markdown_cell("## RF05: importance is not causality\nTwo perfectly correlated numeric columns can substitute. Predict why a low permutation score need not mean useless information. Impurity importance summarizes training reductions;permutation depends on held-out metric,row population and redundancy."),
nbformat.v4.new_code_cell("""correlated_X = np.array([[index,index] for index in range(1,9)])
correlated_y = np.array([0,0,0,0,1,1,1,1])
correlated_dev = np.array([[value,value] for value in [1.5,3.5,5.5,7.5]])
correlated_dev_y = np.array([0,0,1,1])
redundant = fit_trusted(RandomForestClassifier(criterion='gini',class_weight=None,**{**params,'n_estimators':1,'max_depth':1}),correlated_X,correlated_y)
importance = permutation_importance(redundant,correlated_dev,correlated_dev_y,scoring='accuracy',n_repeats=3,random_state=1729,n_jobs=1)
assert importance.importances_mean[0] == 0
standalone = DecisionTreeClassifier(criterion='gini',max_depth=1,random_state=1729).fit(correlated_X[:,[0]],correlated_y)
assert accuracy_score(correlated_dev_y,standalone.predict(correlated_dev[:,[0]])) == 1
print('Impurity importance:',redundant.feature_importances_.tolist())
print('Permutation mean score decreases:',importance.importances_mean.tolist())
print('Low importance did not establish uselessness or a causal effect. Compare matching baseline errors,costs,latency and subgroup counts.')
summary = {'rows':len(X),'development_rows':len(X_dev),'folds':3,'candidates':len(cv),'trees':len(regression.estimators_),'class_order':classifier.classes_.tolist(),'uncovered_one_tree':len(set(uncovered)),'warnings':sorted(set(notices)),'mastery_awarded':False}
print(json.dumps(summary,sort_keys=True))
""")
]
path=ROOT/"apps/web/public/notebooks/supervised-random-forests.ipynb"
print("*** Begin Patch\n*** Add File: "+str(path))
print("\n".join("+"+line for line in nbformat.writes(book).splitlines()))
print("*** End Patch")
