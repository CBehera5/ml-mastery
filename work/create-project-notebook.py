import json,math,hashlib
from pathlib import Path
public=Path('apps/web/public')
data=json.loads((public/'data/linear-regression-housing-bridge.v1.json').read_text())
config={'mode':'area-age','weights':[0.0,0.0],'bias':200.0,'rate':0.05,'iterations':100}
setup='''import math

# Default browser configuration. Copy changed browser settings here to reproduce another run.
config = {"mode": "area-age", "weights": [0.0, 0.0], "bias": 200.0, "rate": 0.05, "iterations": 100}
'''
code_data='dataset = '+repr(data)+'\nrows = dataset["rows"]\ntrain_rows = [row for row in rows if row["split"] == "train"]\ntest_rows = [row for row in rows if row["split"] == "test"]\nassert len(train_rows) == 8 and len(test_rows) == 4\nassert not ({row["id"] for row in train_rows} & {row["id"] for row in test_rows})\n'
prepare='''def raw_features(row):
    return [row["area"]] if config["mode"] == "area" else [row["area"], row["age"]]

raw_train = [raw_features(row) for row in train_rows]
means = [sum(row[j] for row in raw_train) / len(raw_train) for j in range(len(raw_train[0]))]
scales = [math.sqrt(sum((row[j] - means[j]) ** 2 for row in raw_train) / len(raw_train)) for j in range(len(means))]
assert all(scale > 0 for scale in scales)
def transform(row):
    return [(x - mean) / scale for x, mean, scale in zip(raw_features(row), means, scales)]
X_train = [transform(row) for row in train_rows]
X_test = [transform(row) for row in test_rows]
y_train = [row["price"] for row in train_rows]
y_test = [row["price"] for row in test_rows]
print("Training-only means/scales:", means, scales)
'''
train='''def predict(features, weights, bias):
    return [sum(x * w for x, w in zip(row, weights)) + bias for row in features]

def metrics(predictions, targets):
    residuals = [predicted - actual for predicted, actual in zip(predictions, targets)]
    mae = sum(abs(r) for r in residuals) / len(residuals)
    mse = sum(r * r for r in residuals) / len(residuals)
    return {"mae": mae, "mse": mse, "rmse": math.sqrt(mse)}

weights = list(config["weights"][:len(means)])
bias = config["bias"]
history = []
for iteration in range(config["iterations"] + 1):
    predictions = predict(X_train, weights, bias)
    residuals = [p - y for p, y in zip(predictions, y_train)]
    loss = metrics(predictions, y_train)["mse"]
    gradients = [(2 / len(X_train)) * sum(r * row[j] for r, row in zip(residuals, X_train)) for j in range(len(weights))]
    bias_gradient = (2 / len(X_train)) * sum(residuals)
    if not all(math.isfinite(v) and abs(v) <= 1e300 for v in [loss, *gradients, bias_gradient]):
        raise ValueError("Unstable training; reduce the learning rate before interpreting results")
    history.append({"iteration": iteration, "weights": list(weights), "bias": bias, "loss": loss})
    if iteration == config["iterations"]:
        break
    weights = [w - config["rate"] * g for w, g in zip(weights, gradients)]
    bias -= config["rate"] * bias_gradient
print("Initial/final training MSE:", history[0]["loss"], history[-1]["loss"])
print("Final standardized-feature weights and bias:", weights, bias)
'''
evaluate='''train_predictions = predict(X_train, weights, bias)
test_predictions = predict(X_test, weights, bias)
train_metrics = metrics(train_predictions, y_train)
test_metrics = metrics(test_predictions, y_test)
baseline_price = sum(y_train) / len(y_train)
baseline_metrics = metrics([baseline_price] * len(y_test), y_test)
print("Train metrics:", train_metrics)
print("Test metrics:", test_metrics)
print("Training-mean baseline test metrics:", baseline_metrics)
for row, prediction in zip(test_rows, test_predictions):
    print(row["id"], "actual", row["price"], "prediction", prediction, "residual", prediction - row["price"])
'''
namespace={}
for code in [setup,code_data,prepare,train,evaluate]:exec(code,namespace)
reference={'datasetVersion':data['version'],'config':config,'mean':namespace['means'],'scale':namespace['scales'],'weights':namespace['weights'],'bias':namespace['bias'],'initialMSE':namespace['history'][0]['loss'],'trainPredictions':namespace['train_predictions'],'testPredictions':namespace['test_predictions'],'trainMetrics':namespace['train_metrics'],'testMetrics':namespace['test_metrics'],'baselineMetrics':namespace['baseline_metrics']}
(public/'data/linear-regression-housing-bridge.reference.v1.json').write_text(json.dumps(reference,indent=2)+'\n')
assertions='''# Independent checked reference values for the default run; custom settings need not match these.
if config == {"mode": "area-age", "weights": [0.0, 0.0], "bias": 200.0, "rate": 0.05, "iterations": 100}:
    assert math.isclose(train_metrics["mse"], %r, abs_tol=1e-8)
    assert math.isclose(test_metrics["mae"], %r, abs_tol=1e-8)
    assert math.isclose(test_metrics["mse"], %r, abs_tol=1e-8)
assert history[-1]["loss"] < history[0]["loss"]
print("Reference checks passed. A small synthetic test is not evidence of market accuracy.")
'''%(reference['trainMetrics']['mse'],reference['testMetrics']['mae'],reference['testMetrics']['mse'])
summary='''summary = f"""Objective: estimate a numeric fictional sale price in $k.
Features: {config['mode']}; training-only standardization.
Split: eight training and four held-out synthetic properties.
Train MAE/MSE/RMSE: {train_metrics}
Test MAE/MSE/RMSE: {test_metrics}
Baseline test metrics: {baseline_metrics}
Limits: synthetic data; omitted location/condition; H11 has a constructed adjustment;
H12 extrapolates beyond training area range. No causal or real market claims.
Appropriate for a provisional educational baseline, not real pricing deployment.
Further tuning after viewing test outcomes needs fresh held-out data.
Guided completion does not establish independent mastery."""
print(summary)
'''
cells=[]
def md(text):cells.append({'cell_type':'markdown','metadata':{},'source':text.splitlines(True)})
def code(text):cells.append({'cell_type':'code','metadata':{},'execution_count':None,'outputs':[],'source':text.splitlines(True)})
md('# Linear Regression — applied housing bridge\n\nOriginal synthetic teaching data, not market prices. No real property records or external data. Uses standard Python 3.11+ only: no package installation, credentials or repository imports. Run top to bottom. This notebook mirrors the default browser calculation; it is downloaded for execution in your Python environment, not executed by the learning page.')
md('## 1. Define the problem\nPredict a numerical fictional sale price in $k using known floor area (thousand ft²) and optionally age (years). Why is this regression rather than classification? Never use sale price or post-sale information as an input.')
code(setup);code(code_data)
md('## 2. Explore training rows\nCompare H03 and H04: the larger, older home is slightly cheaper. Why might area alone be incomplete? Test target values are present in this reproducible artifact but must not be used to fit the model or select settings.')
code('for row in train_rows:\n    print({key: row[key] for key in ["id", "area", "age", "price"]})\n')
md('## 3. Prepare\nSplit first. z = (x − μ)/s uses only training-column mean μ and population standard deviation s. Fit on all rows before splitting would leak held-out information. Apply the same transform to future inputs.')
code(prepare)
md('## 4. Train\nFor prediction ŷ = Σ wⱼzⱼ + b, minimize L = (1/m)Σ(ŷᵢ − yᵢ)². Here m counts training rows, i identifies a row and j identifies a feature. Subtract learning rate α times the gradient. Update all parameters using derivatives from the same previous state. Iteration 0 is before the first update.')
code(train)
md('## 5. Evaluate\nMAE and RMSE are in $k, MSE in ($k)². Residual = prediction − actual. H11 has an omitted constructed shift of +80; H12 is outside training area range and has another shift. Compare baseline and model without implying these tiny synthetic samples represent a market.')
code(evaluate);code(assertions)
md('## 6. Explain\nSummarize the objective, selected features, actual error metrics, limitations and appropriateness. Never describe repeated test tuning as untouched final evaluation. Structured feedback belongs in the browser project; free-form reasoning here is self-reviewed.')
code(summary)
for i,c in enumerate(cells):c['id']=f'housing-bridge-{i:02d}'
notebook={'cells':cells,'metadata':{'kernelspec':{'display_name':'Python 3','language':'python','name':'python3'},'language_info':{'name':'python','version':'3.11'},'project_dataset_version':data['version']},'nbformat':4,'nbformat_minor':5}
(public/'notebooks/linear-regression-housing-bridge.ipynb').write_text(json.dumps(notebook,indent=2)+'\n')
