import hashlib
import json
import re
import warnings
from pathlib import Path

import numpy as np
import pandas as pd
import sklearn

from .pandas_learning_reference import HOUSES
from .preparation_learning_reference import normalize

ROOT = Path(__file__).resolve().parents[2]
AMOUNTS = (1, 2, 3, 4, 5, 7)
IMPORTS = """import numpy as np, pandas as pd
from sklearn.dummy import DummyRegressor, DummyClassifier; from sklearn.linear_model import LinearRegression
from sklearn.model_selection import KFold, GroupKFold, TimeSeriesSplit, cross_val_score
from sklearn.impute import SimpleImputer; from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import make_pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, root_mean_squared_error, accuracy_score
from sklearn.exceptions import NotFittedError
"""
DATA_HASH = hashlib.sha256(json.dumps(HOUSES, sort_keys=True).encode()).hexdigest()


def workflow_code(amount):
    rotation = (amount - 3) % 4
    projected = {key: HOUSES[key] for key in ['id','area','age','neighborhood','price']}
    body = f"""houses = pd.DataFrame({projected!r})
features = ['area','age','neighborhood']; train = houses.iloc[:12]; test = houses.iloc[12:].iloc[{list(range(rotation, 4)) + list(range(rotation))!r}]
def candidate(model):
    return make_pipeline(ColumnTransformer([('numeric',make_pipeline(SimpleImputer(strategy='median'),StandardScaler()),['area','age']),('category',make_pipeline(SimpleImputer(strategy='most_frequent'),OneHotEncoder(categories=[['A','B']],handle_unknown='ignore',sparse_output=False)),['neighborhood'])]),model)
folds = list(KFold(n_splits=3,shuffle=True,random_state=42).split(train)); scores = {{}}
for name, model in [('dummy',DummyRegressor(strategy='mean')),('linear',LinearRegression())]:
    scores[name] = -cross_val_score(candidate(model),train[features],train['price'],cv=folds,scoring='neg_mean_absolute_error',n_jobs=1)
ledger = []
for fitting, validating in folds:
    fitted = candidate(LinearRegression()).fit(train.iloc[fitting][features],train.iloc[fitting]['price']); preparation = fitted.steps[0][1]
    numeric = preparation.named_transformers_['numeric']; category = preparation.named_transformers_['category']
    ledger.append({{'fit_ids':train.iloc[fitting]['id'].tolist(),'validation_ids':train.iloc[validating]['id'].tolist(),'imputer':numeric.named_steps['simpleimputer'].statistics_,'scaler_mean':numeric.named_steps['standardscaler'].mean_,'categories':category.named_steps['onehotencoder'].categories_}})
means = {{name:float(values.mean()) for name,values in scores.items()}}; tied = abs(means['linear']-means['dummy']) <= 1e-9+1e-9*abs(means['dummy']); winner = 'dummy' if tied or means['dummy'] < means['linear'] else 'linear'
chosen = candidate(DummyRegressor(strategy='mean') if winner == 'dummy' else LinearRegression()).fit(train[features],train['price']); prediction = chosen.predict(test[features])
result = {{'dataset':'sklearn-houses.v1','data_sha256':'{DATA_HASH}','environment':'macos-arm64-cpython-3.13.16-reference.1','seed':42,'candidate_parameters':['DummyRegressor(mean)','LinearRegression(default)'],'folds':ledger,'cv_mae':scores,'mean_cv_mae':means,'tied':tied,'selected_before_test':winner,'refit_ids':train['id'].tolist(),'test_ids':test['id'].tolist(),'predictions':prediction,'columns':chosen.steps[0][1].get_feature_names_out(),'mae':mean_absolute_error(test['price'],prediction),'mse':mean_squared_error(test['price'],prediction),'rmse':root_mean_squared_error(test['price'],prediction),'test_may_select':False,'browser_trained':False}}
"""
    return body


def split_code(amount, fit=False):
    scenario = "group" if amount == 5 else "time" if amount == 7 else "random"
    splitter = {"random": "KFold(n_splits=3,shuffle=True,random_state=42)", "group": "GroupKFold(n_splits=3,shuffle=False)", "time": "TimeSeriesSplit(n_splits=3)"}[scenario]
    body = f"""ids = np.array(['H01','H02','H03','H04','H05','H06']); groups = np.array(['A','A','B','B','C','C'])
features = np.array([[1.],[np.nan],[3.],[4.],[5.],[{6 + amount}.]]); targets = np.array([10.,20.,30.,40.,50.,60.])
splitter = {splitter}; ledger = []
for fitting, validating in splitter.split(features,targets,groups if {scenario == "group"!r} else None):
    pipeline = make_pipeline(SimpleImputer(strategy='median'),StandardScaler(),DummyRegressor(strategy='mean')).fit(features[fitting],targets[fitting])
    ledger.append({{'fit_ids':ids[fitting].tolist(),'validation_ids':ids[validating].tolist(),'fit_groups':groups[fitting].tolist(),'validation_groups':groups[validating].tolist(),'training_median':pipeline.named_steps['simpleimputer'].statistics_,'validation_predictions':pipeline.predict(features[validating])}})
result = {{'scenario':'{scenario}','splitter':type(splitter).__name__,'folds':ledger,'final_test_ids':['H13','H14','H15','H16'],'prefit_on_all_rows_allowed':False}}
"""
    return body


def authored_case(lesson, objective, amount):
    if type(lesson) is not int or lesson not in range(1, 6) or type(objective) is not int or objective not in range(4) or type(amount) is not int or amount not in AMOUNTS:
        raise ValueError("Only enumerated trusted sklearn configurations are supported.")
    offset = amount - 3
    baseline = f"train = np.array([[1.],[2.],[3.]])\ntarget = np.array([{100 + offset * 10}.,{200 + offset * 10}.,{300 + offset * 10}.])\nnew = np.array([[4.],[5.]])\n"
    if lesson == 1:
        cases = [
            (baseline + "model = DummyRegressor(strategy='mean')\ntry:\n    model.predict(new)\nexcept NotFittedError:\n    before = {'tag':'error','class':'NotFittedError'}\nmodel.fit(train,target)\nresult = {'before_fit':before,'training_mean':model.constant_,'new_predictions':model.predict(new),'fit_ids':['H01','H02','H03'],'new_ids':['H04','H05'],'test_target_fit_allowed':False}",
             "Construction stores configuration, not the learned target mean. Fit learns from training features/targets; predict uses saved state on new features without learning their targets. An unfitted prediction raises NotFittedError, and fitting on test targets invalidates unseen evaluation.",
             "Constructing the estimator learns the mean, so predicting before fit or fitting on test targets is valid."),
            (baseline + f"model = DummyRegressor(strategy='mean').fit(train,target)\nnew = np.zeros(({2 + amount % 3},1))\nresult = {{'training_mean':model.constant_,'predictions':model.predict(new),'length':len(new),'source':'training targets only'}}",
             "A mean baseline ignores feature values but learns its constant from training targets only. Its prediction vector has one entry per new row, never a mean computed from test targets.",
             "Use the mean of evaluation targets as the baseline prediction because it gives the fairest test error."),
            (f"scaler = StandardScaler().fit([[1.],[3.]])\nnew = [[{5 + offset}.],[{100 + amount}.]]\nsaved = scaler.mean_.copy()\ntransformed = scaler.transform(new)\nresult = {{'saved_training_mean':saved,'after_transform_mean':scaler.mean_,'transformed_features':transformed,'predict_is_transform':False,'evaluation_refit_allowed':False}}",
             "Transform maps new features into saved training coordinates; predict maps features to model outputs. Neither inference step may refit on evaluation rows. A different test batch cannot change the training mean2.",
             "Predict and transform are interchangeable, and fit_transform should relearn coordinates on every test batch."),
            (baseline + "model = LinearRegression().fit(train,target)\nresult = {'trusted_author_fit':hasattr(model,'coef_'),'coefficients':model.coef_,'predictions':model.predict(new),'browser_execution':False,'required_notebook_evidence':'fresh-kernel manifest, fitted attributes and complete output assertions'}",
             "These outputs come from trusted author execution. Displaying a frozen browser trace is not browser fitting or evidence that your edited notebook ran; an actual fresh-kernel run needs its own environment, fitted-state and assertion record.",
             "A browser animation or a downloaded notebook proves that real Python executed and fitted your estimator."),
        ]
    elif lesson == 2:
        error = 20 + offset
        regression = f"truth = np.array([100.,200.]); prediction = np.array([{100 + error}.,{200 - error}.])\n"
        negatives = 9 + offset
        positives = 1 if amount % 2 else 2
        requested = {1: "mae", 2: "mse", 3: "mae", 4: "mse", 5: "rmse", 7: "mse"}[amount]
        cases = [
            (baseline + f"baseline = DummyRegressor(strategy='mean').fit(train,target); model = LinearRegression().fit(train,target)\ntruth = np.array([{400 + offset * 10}.,{500 + offset * 10}.]); ids = ['H{amount}4','H{amount}5']\nresult = {{'shared_held_out_ids':ids,'baseline_predictions':baseline.predict(new),'model_predictions':model.predict(new),'baseline_mae':mean_absolute_error(truth,baseline.predict(new)),'model_mae':mean_absolute_error(truth,model.predict(new)),'unequal_split_comparison_allowed':False,'training_score_is_test':False}}",
             "Both candidates learn from the same permitted training information and are evaluated against the same held-out targets in the same ID order. A training score or a baseline on easier/different rows is not a fair unseen-data comparison.",
             "Compare the model's training score with a baseline on different test rows; the smaller number proves improvement."),
            (regression + f"classifier = DummyClassifier(strategy='most_frequent').fit(np.zeros((10,1)),[0]*9+[1])\nclass_truth = np.array([0]*{negatives}+[1]*{positives}); class_prediction = classifier.predict(np.zeros((len(class_truth),1)))\nresult = {{'requested_metric':'{requested}','regression_rows':len(truth),'errors':prediction-truth,'mae':mean_absolute_error(truth,prediction),'mse':mean_squared_error(truth,prediction),'rmse':root_mean_squared_error(truth,prediction),'units':{{'mae':'$k','mse':'($k)^2','rmse':'$k'}},'negative_cases':{negatives},'positive_cases':{positives},'positive_detected':int(((class_prediction==1)&(class_truth==1)).sum()),'accuracy':accuracy_score(class_truth,class_prediction),'majority_accuracy_proves_detection':False}}",
             "MAE and RMSE have target units $k; MSE has squared units ($k)^2. Divide regression error sums by the two evaluated rows. The training-most-frequent classifier predicts zero, so its accuracy can be high while detecting none of the supplied positive cases. Both the metric calculation and count-based interpretation are required.",
             "MSE is measured in $k, a different denominator is harmless, and high majority accuracy proves useful positive-case detection."),
            (baseline + "regressor = LinearRegression().fit(train,target)\nclassifier = DummyClassifier(strategy='most_frequent').fit(train,[0,0,1])\nresult = {'regression_score_name':'R2','regression_score':regressor.score(new,[420.,480.]),'classification_score_name':'accuracy','classification_score':classifier.score(new,[0,1])}",
             "Default score depends on the estimator: LinearRegression reports R2, while this classifier reports accuracy. Name the actual metric and its evaluation rows instead of assuming every score is accuracy or a physical error.",
             "Every sklearn .score is accuracy and directly comparable across regression and classification."),
            (regression + "result = {'validation_mae':mean_absolute_error(truth,prediction),'causal_effect_identified':False,'calibrated_probabilities_proved':False,'claim':'describes these declared prediction errors only'}",
             "A validation error describes agreement on specified observations. It does not identify an intervention effect, prove calibrated probabilities or guarantee performance for a different population.",
             "A lower validation error proves a causal effect, calibrated probabilities and superiority in every population."),
        ]
    elif lesson == 3:
        cases = [
            (split_code(amount), "Each fold fits every learned preprocessing/model stage on its training IDs only. Validation and final-test rows cannot learn state. Random folds suit independent rows; groups require entity separation and time forecasts require earlier training observations.", "Cross-validation permits fitting preprocessing on all development rows or including final-test rows, regardless of group or time."),
            (f"signed_scores = np.array([-10.,-20.,-30.]) + {3 - amount}.\nresult = {{'negative_mae_scores':signed_scores,'fold_mae':-signed_scores,'mean_mae':float((-signed_scores).mean()),'units':'$k'}}",
             "The negative-loss scorer is larger-is-better for API consistency. Negate it before reporting MAE in target units; mean of positive MAEs is not a negative physical error.",
             "A negative MAE scorer is a physically negative error, so a more negative score always means a better model."),
            (f"features = np.arange(6).reshape(-1,1); target = np.array([1.,2.,3.,4.,{100 + amount}.,200.])\nscores = -cross_val_score(DummyRegressor(strategy='mean'),features,target,cv=KFold(n_splits=3,shuffle=True,random_state=42),scoring='neg_mean_absolute_error',n_jobs=1)\nresult = {{'fold_mae':scores,'mean_mae':float(scores.mean()),'overlapping_training_sets':True,'universal_confidence_guaranteed':False}}",
             "A few fold errors summarize these small overlapping partitions, not independent population experiments. Variation flags uncertainty and data assumptions; it does not provide a universal guarantee or formal confidence interval.",
             "Three folds are independent population experiments that certify universal confidence and model superiority."),
            (split_code(amount), "Choose the splitter from the intended generalization question. Fixed seed42 reproduces this random split for the same data/order; GroupKFold separates customer groups and TimeSeriesSplit preserves chronology without inappropriate shuffling/random_state.", "Shuffling always improves evaluation, and setting a seed makes group/time overlap irrelevant."),
        ]
    elif lesson == 4:
        reasons = [
            ("Cross-validation must receive the entire train-fitted preprocessing plus model. Every stage learns only each fold's training rows. Fitting a preprocessor globally first leaks validation information even if the model itself is cross-validated.", "Preprocessing is unsupervised, so it may be fitted globally before cross-validating the final model."),
            ("Numeric age/area use training-fitted imputation then scaling; the categorical branch imputes labels then encodes the saved A/B vocabulary. Declared dense output, unknown policy and named column order define the input contract.", "Any branch order or encoder vocabulary is valid if the matrix has the same width."),
            ("Fit learns state from permitted training rows; predict returns one numeric output per supplied held-out row in the same ID order. A frozen trace must agree with actual notebook values within declared tolerance and preserve feature names.", "Predictions may be reordered or refitted on evaluation rows as long as the output length is correct."),
            ("This trusted author reference actually fits the model; the browser only displays its frozen trace. Report exact data, splits, metric and execution manifest, and the limitations of fictional teaching observations rather than claiming population performance.", "Displaying synthetic predictions in the browser proves live training and real-world generalization."),
        ]
        cases = [(workflow_code(amount) + f"result['question'] = {question!r}\n", *reason) for question, reason in zip(["fold-local learned state", "typed branch and vocabulary contract", "ID-aligned fitted predictions", "execution and limitations"], reasons)]
    else:
        dummy = [10., 20., 30.]
        linear = [10. + 1e-10, 20., 30.] if amount == 4 else [20., 30., 40.] if amount == 7 else [8. - offset, 18. - offset, 28. - offset]
        cases = [
            (workflow_code(amount) + "result['invalid_selection'] = 'choose candidate by final-test score'\n",
             "Choose the candidate using training-only CV MAE on identical folds, freeze the decision, refit on development training and only then evaluate the final test. Test feedback must not select either the model or preprocessing policy.",
             "Evaluate all candidates on the final test and choose its best score, then report the same test as unbiased."),
            (f"dummy_mae = np.array({dummy!r}); linear_mae = np.array({linear!r})\ndummy_mean = float(dummy_mae.mean()); linear_mean = float(linear_mae.mean())\ntied = abs(linear_mean-dummy_mean) <= 1e-9+1e-9*abs(dummy_mean)\nresult = {{'source':'supplied illustrative same-fold MAE table','dummy_folds':dummy_mae,'linear_folds':linear_mae,'dummy_mean':dummy_mean,'linear_mean':linear_mean,'tied':tied,'winner':'dummy' if tied or dummy_mean < linear_mean else 'linear','test_feedback_used':False}}",
             "Use the same folds and metric, compare mean CV MAE and apply the predefined absolute-plus-relative tolerance. Within tolerance prefer DummyRegressor; otherwise choose the lower MAE before final-test access.",
             "Break ties using final-test feedback, change the candidate's folds or compare different metric names."),
            (workflow_code(amount) + "result['limitation'] = 'fictional teaching data, not population or deployment evidence'\n",
             "Refit only the selected frozen workflow on all12 permitted development IDs, then predict exactly four final-test IDs in their supplied order. Record folds, parameters/schema, environment/data identity, outputs and limitations; no test-guided reselection.",
             "A final report needs only the best test score; fitted provenance, schema, memberships and limitations are optional."),
            (f"dummy = np.array([10.,20.,30.]); linear = dummy - {amount}e-4\nresult = {{'dummy_mae':dummy,'linear_mae':linear,'mean_improvement':float((dummy-linear).mean()),'universal_superiority':False,'formal_confidence_claim':False}}",
             "A tiny margin on small overlapping folds is introductory comparison evidence, not universal superiority, formal confidence or deployment readiness. Report the protocol and limitations and plan broader evaluation later.",
             "Any positive synthetic CV margin proves universal superiority and authorizes deployment."),
        ]
    body, reason, misconception = cases[objective]
    code = IMPORTS + body
    assert len(code.splitlines()) <= 25 and len(code.encode()) <= 4096
    namespace = {}
    with warnings.catch_warnings(record=True) as recorded:
        warnings.simplefilter("always")
        exec(compile(code, "<trusted-fixed-sklearn-reference>", "exec"), namespace)
    return {"code": code, "expected": normalize(namespace["result"]), "reason": reason, "misconception": misconception, "warnings": sorted({type(item.message).__name__ for item in recorded})}


def experiment_cases():
    definitions = [
        ("s03", "S03.O1", split_code(5).replace("['A','A','B','B','C','C']", "['D','D','E','E','F','F']"), "GroupKFold keeps the same customer's records out of both sides of a fold. Each pipeline fits on that fold's customer-separated training IDs; neither final-test IDs nor validation observations learn preprocessing.", "Random row shuffling makes repeated-customer overlap harmless."),
        ("s03", "S03.O1", split_code(7).replace("[1.],[np.nan],[3.],[4.],[5.],[13.]", "[2.],[np.nan],[4.],[5.],[6.],[14.]"), "TimeSeriesSplit uses earlier training observations before later validation observations. Inspect order as well as ID disjointness; a random split may leak future information into a forecast.", "A reproducible random seed makes future observations legitimate training for a past prediction."),
        ("s04", "S04.O1", workflow_code(3) + "invalid = make_pipeline(SimpleImputer(strategy='median'),StandardScaler()).fit(houses.iloc[:12][['area','age']]); result['invalid_prefit'] = {'fit_ids':houses.iloc[:12]['id'].tolist(),'median':invalid.named_steps['simpleimputer'].statistics_,'valid_for_fold_cv':False}\n", "Compare the valid fold-local ledger with the explicitly invalid whole-development prefit. Validation rows entered the latter's learned statistics; matching predictions cannot make that information boundary valid.", "Matching predictions prove a globally prefit transformer is safe for cross-validation."),
        ("s05", "S05.O2", "dummy_mae = np.array([10.,20.,30.]); linear_mae = dummy_mae + 1e-10\ntied = abs(float(linear_mae.mean()-dummy_mae.mean())) <= 1e-9+1e-9*abs(float(dummy_mae.mean()))\nresult = {'source':'supplied illustrative same-fold scores','dummy_mean':float(dummy_mae.mean()),'linear_mean':float(linear_mae.mean()),'within_tolerance':tied,'selected':'dummy' if tied else 'linear','test_guided_tie_break':False}", "The declared tiny difference is within the approved tolerance, so prefer DummyRegressor without consulting the final test. A tie policy is chosen before evaluation, not adjusted after seeing a preferred winner.", "A numerical tie should be broken by repeatedly checking the final test."),
    ]
    result = []
    for index, (lesson, objective, body, reason, misconception) in enumerate(definitions):
        code = IMPORTS + body
        assert len(code.splitlines()) <= 25 and len(code.encode()) <= 4096
        namespace = {}
        exec(compile(code, "<trusted-fixed-sklearn-experiment>", "exec"), namespace)
        result.append({"lesson":lesson,"objective":objective,"mode":"experiment","variant":index,"amount":3,"code":code,"expected":normalize(namespace["result"]),"reason":reason,"misconception":misconception,"warnings":[]})
    return result


def metadata():
    text = (ROOT / "docs/task-013-lesson-objective-matrix.md").read_text()
    lessons = []
    for number in range(1, 6):
        slug = f"S{number:02}"
        section = re.search(rf"^### {slug} (.*?)\n(.*?)(?=^### |^## |\Z)", text, re.M | re.S)
        body = section[2]
        field = lambda label: re.search(rf"\*\*{re.escape(label)}:\*\* (.*)", body)[1].strip()
        objectives = []
        for row in re.findall(r"^\| (S\d\d\.O\d)([^|]*)\|([^\n]*)", body, re.M):
            columns = [value.strip() for value in row[2].split("|")]
            objectives.append({"id": row[0], "critical": "**C**" in row[1], "introductory": "**I**" in row[1], "outcome": columns[0], "assessment": columns[1], "remediation": columns[2]})
        lessons.append({"slug": slug.lower(), "title": section[1], "prerequisites": field("Prerequisites"), "motivation": field("Motivation and mental model"), "progression": field("Progression beyond the worked example"), "terms": field("Key concepts"), "math": field("Mathematical connection"), "worked": field("Worked example"), "misconception": field("Misconception to confront"), "objectives": objectives})
    return lessons


def build():
    cases = []
    for lesson in range(1, 6):
        for objective in range(4):
            for mode, amounts in [("worked", [3]), ("practice", [1, 2]), ("mastery", [4, 5, 7])]:
                for variant, amount in enumerate(amounts):
                    cases.append({"lesson": f"s{lesson:02}", "objective": f"S{lesson:02}.O{objective + 1}", "mode": mode, "variant": variant, "amount": amount, **authored_case(lesson, objective, amount)})
    return {"contract": "sklearn-learning-reference.v1", "profile": "macos-arm64-cpython-3.13.16-reference.1", "sklearn": sklearn.__version__, "author": "python/mlmath/sklearn_learning_reference.py", "manifest": {"id": "sklearn-houses.v1", "sha256": DATA_HASH, "source": "original fictional canonical housing source reused without mutation", "permission": "platform teaching use", "train_ids": HOUSES["id"][:12], "test_ids": HOUSES["id"][12:], "limitations": "fictional teaching data; not population, causal or deployment evidence"}, "houses": HOUSES, "canonical_table": normalize(pd.DataFrame(HOUSES)), "lessons": metadata(), "cases": cases + experiment_cases()}


if __name__ == "__main__":
    print(json.dumps(build(), indent=2, ensure_ascii=False, allow_nan=False))

