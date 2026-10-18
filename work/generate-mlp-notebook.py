import json
import hashlib
from pathlib import Path

root = Path(__file__).resolve().parents[1]
target = root / "apps/web/public/notebooks/supervised-mlp.ipynb"

def markdown(value):
    cell_id = hashlib.sha256(("markdown:" + value).encode()).hexdigest()[:8]
    return {"cell_type": "markdown", "id": cell_id, "metadata": {}, "source": value.splitlines(True)}

def code(value):
    cell_id = hashlib.sha256(("code:" + value).encode()).hexdigest()[:8]
    return {"cell_type": "code", "id": cell_id, "metadata": {}, "execution_count": None, "outputs": [], "source": value.splitlines(True)}

cells = [
    markdown("""# Introductory Multilayer Perceptrons — trusted local notebook

**Purpose:** follow a fictional churn classification problem from weighted sums through nonlinear activations, one chain-rule update, validation and a fold-safe scikit-learn workflow.

This notebook uses only small embedded fictional data (CC0-1.0), no credentials, uploads, network, remote dataset or installation. It is a teaching artifact: running it does not confer lesson completion or mastery. Use CPython 3.13.16 with NumPy 2.5.4, pandas 3.0.6, Matplotlib 3.11.2, SciPy 1.18.1 and scikit-learn 1.9.1 for the verified environment. Seed=1729. Timing is not a reproducibility target.

The browser lab references are frozen separately. The final test partition is intentionally not present in this notebook's development workflow.
"""),
    markdown("""## 1. A network is a composition of familiar operations

Predict before running: for `x=2`, `w=1`, `b=-1`, ReLU hidden activation, output weight `2` and output bias `0`, what are the hidden value, output logit and sigmoid probability? Trace multiplication, bias, activation and output in that order.
"""),
    code("""import numpy as np
from scipy.special import expit

x = np.array([[2.0]])
W1 = np.array([[1.0]])
b1 = np.array([-1.0])
W2 = np.array([[2.0]])
b2 = np.array([0.0])
Z1 = x @ W1 + b1
A1 = np.maximum(0.0, Z1)
logit = A1 @ W2 + b2
probability_positive = expit(logit)
print({"X": x.shape, "W1": W1.shape, "Z1": Z1.tolist(), "A1": A1.tolist(), "logit": logit.item(), "p_positive": probability_positive.item()})
assert np.isclose(A1.item(), 1.0) and np.isclose(logit.item(), 2.0)
assert np.isclose(probability_positive.item(), 0.8807970779778823)
"""),
    markdown("""A batch `X` is `(n,d)`. `W1` is `(d,h)`, so its preactivation is `(n,h)`; bias `(h,)` broadcasts across rows. `W2` `(h,1)` produces one logit per row. Two affine maps with identity activations collapse into one affine map; nonlinearity is what changes the representable function family.
"""),
    markdown("""## 2. One bounded chain-rule update

The hand example uses mean binary cross-entropy, one batch, sigmoid hidden activations, sigmoid output, L2 weight penalty `alpha/(2n) * sum(W**2)` excluding biases, and simultaneous plain-SGD updates. Backpropagation computes gradients; the explicit SGD rule applies them. It is not Adam.

Predict first: with `w=1`, gradient `.2`, and learning rate `.1`, what is the new value? Then compare the calculation to `w_new = w - eta * gradient`.
"""),
    code("""weight, gradient, eta = 1.0, 0.2, 0.1
updated_weight = weight - eta * gradient
print({"old": weight, "gradient": gradient, "eta": eta, "new": updated_weight})
assert np.isclose(updated_weight, 0.98)
"""),
    markdown("""## 3. Fitting, development and inference have different permissions

These embedded fictional rows have stable order and a positive label of `1=churn`. The data are intentionally small for inspection, not representative of a production cohort. Compare a scaled MLP and logistic baseline on the same development rows. The scaler belongs inside each CV fit. Inference uses fixed fitted state. Development can compare declared candidates; test data never choose the architecture, seed, threshold or stopping point.
"""),
    code("""from copy import deepcopy
from sklearn.base import clone
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import log_loss
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

# Fictional pre-prediction feature units; no customer records.
train_ids = [f"nn.train.{index}" for index in range(12)]
dev_ids = [f"nn.development.{index}" for index in range(6)]
X_train = np.array([[-2,-1],[-2,1],[-1,-1],[-1,1],[1,-1],[1,1],[2,-1],[2,1],[.5,0],[1.5,0],[-1.5,0],[-.5,0]], dtype=float)
y_train = np.array([0,0,0,0,1,1,1,1,0,1,0,0], dtype=int)
X_dev = np.array([[-1.75,-.5],[-.75,.5],[-.25,0],[.25,0],[.75,-.5],[1.75,.5]], dtype=float)
y_dev = np.array([0,0,0,1,1,1], dtype=int)
assert set(y_train) == {0,1} and set(y_dev) == {0,1}

scaler = StandardScaler().fit(X_train)
X_train_scaled, X_dev_scaled = scaler.transform(X_train), scaler.transform(X_dev)
print("training IDs", train_ids, "development IDs", dev_ids, "scaler fit IDs", train_ids)
mlp = MLPClassifier(hidden_layer_sizes=(2,), activation="logistic", solver="sgd", learning_rate="constant", learning_rate_init=0.05, momentum=0.0, nesterovs_momentum=False, alpha=0.4, batch_size=12, max_iter=1, tol=0.0, n_iter_no_change=10000, random_state=1729, shuffle=False, early_stopping=False, warm_start=False)
checkpoint_losses = []
checkpoint_models = {}
candidate_epochs = {1,8,32,128}
for epoch in range(1,129):
    mlp.partial_fit(X_train_scaled, y_train, classes=np.array([0,1]))
    if epoch in candidate_epochs:
        train_probability = mlp.predict_proba(X_train_scaled)
        dev_probability = mlp.predict_proba(X_dev_scaled)
        checkpoint_losses.append({"epoch":epoch, "training_log_loss":float(log_loss(y_train,train_probability,labels=[0,1])), "development_log_loss":float(log_loss(y_dev,dev_probability,labels=[0,1]))})
        checkpoint_models[epoch] = deepcopy(mlp)
minimum_dev = min(row["development_log_loss"] for row in checkpoint_losses)
selected = next(row for row in checkpoint_losses if abs(row["development_log_loss"]-minimum_dev) <= 1e-12)
selected_model = checkpoint_models[selected["epoch"]]
print("stage trace", checkpoint_losses, "selected earliest minimum development checkpoint", selected["epoch"])
print("MLP selected-development probabilities", np.round(selected_model.predict_proba(X_dev_scaled)[:,1],6).tolist())

logistic = make_pipeline(StandardScaler(), LogisticRegression(C=1.0, max_iter=500, random_state=1729))
fitted_logistic = clone(logistic).fit(X_train,y_train)
print("Logistic development log-loss", float(log_loss(y_dev, fitted_logistic.predict_proba(X_dev), labels=[0,1])), "probabilities", np.round(fitted_logistic.predict_proba(X_dev)[:,1],6).tolist())

cv = StratifiedKFold(n_splits=4, shuffle=True, random_state=1729)
cv_mlp = make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(2,), activation="logistic", solver="sgd", learning_rate="constant", learning_rate_init=0.05, momentum=0.0, nesterovs_momentum=False, alpha=0.4, batch_size=4, max_iter=64, tol=0.0, n_iter_no_change=64, random_state=1729, shuffle=False, early_stopping=False))
fold_losses = -cross_val_score(cv_mlp, X_train, y_train, cv=cv, scoring="neg_log_loss", n_jobs=1)
print("fold log-loss (each pipeline refit inside fold)", np.round(fold_losses,6).tolist())
"""),
    markdown("""## 4. Interpretation and limitations

Both model outputs are predictions, not causal effects. Neural-network probabilities are not automatically calibrated. Tiny subgroups, distribution shift, convergence warnings and small samples limit conclusions. Inspect the warning and the metric; do not call an iteration cap an optimum. A simpler model can be a better engineering choice if additional flexibility does not yield task-relevant value.

**Reproducibility record:** no external data or credentials; seed 1729; training-only StandardScaler; explicit solver and update settings above; final test not included; fold pipeline refits independently. Re-run the notebook in two clean local kernels and compare printed numeric outputs within the frozen reference tolerances.
"""),
]

notebook = {
    "cells": cells,
    "metadata": {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3.13.16"},
        "ml_mastery": {"module": "Task015.11", "environment": "CPython3.13.16;NumPy2.5.4;pandas3.0.6;Matplotlib3.11.2;SciPy1.18.1;scikit-learn1.9.1", "seed": 1729, "network": "disabled;all data embedded fictional"}
    },
    "nbformat": 4,
    "nbformat_minor": 5
}
target.write_text(json.dumps(notebook, indent=1, ensure_ascii=False) + "\n")
print(f"wrote {len(cells)} notebook cells to {target}")
