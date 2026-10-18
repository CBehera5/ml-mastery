"""Trusted offline MLP fixtures only; never executes learner input."""
import copy
import hashlib
import importlib.metadata
import json
import math
import platform
import sys
import warnings
from pathlib import Path

import numpy as np
from sklearn.metrics import accuracy_score, log_loss
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import LabelBinarizer, StandardScaler
from sklearn.utils import check_random_state

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/verification/multilayer-perceptrons"
PROFILE = {name: importlib.metadata.version(name) for name in ["numpy", "pandas", "matplotlib", "scikit-learn", "scipy"]}
assert platform.python_version() == "3.13.16"
assert PROFILE == {"numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "scikit-learn": "1.9.1", "scipy": "1.18.1"}
SEED = 1729
EPSILONS = [1e-5, 3e-6]
CHECKPOINTS = [1, 8, 32, 128]
ERRORS = []
GRADIENT_CHECKS = []


def encode(value):
    return (json.dumps(value, indent=2, sort_keys=True, allow_nan=False) + "\n").encode()


def digest(value):
    return hashlib.sha256(value).hexdigest()


def close(actual, expected, atol=1e-9, rtol=1e-9):
    actual, expected = np.asarray(actual), np.asarray(expected)
    assert actual.shape == expected.shape, (actual.shape, expected.shape)
    difference = float(np.max(np.abs(actual - expected))) if actual.size else 0.
    ERRORS.append(difference)
    assert np.allclose(actual, expected, atol=atol, rtol=rtol), (difference, actual, expected)


def sigmoid(value):
    if value >= 0:
        return 1 / (1 + math.exp(-value))
    exponential = math.exp(value)
    return exponential / (1 + exponential)


def softplus(value):
    return max(value, 0) + math.log1p(math.exp(-abs(value)))


def parameters(width=2, shifted=False):
    values = {"W1": [[1., -1.], [.5, 1.]], "b1": [-.25, .5], "W2": [[1.5], [-.75]], "b2": [.1]}
    if width == 1:
        values = {"W1": [[1.], [.5]], "b1": [-.25], "W2": [[1.5]], "b2": [.1]}
    if shifted:
        values["b1"][0] += .75
        values["W2"][0][0] -= .5
    return values


def arrays(values):
    return {key: np.asarray(value, dtype=float) for key, value in values.items()}


def lists(values):
    return {key: np.asarray(value).tolist() for key, value in values.items()}


def scalar_forward(inputs, values, activation):
    hidden, preactivation, logits, probabilities = [], [], [], []
    for observation in inputs:
        sums = [sum(float(observation[index]) * values["W1"][index][unit] for index in range(2)) + values["b1"][unit] for unit in range(len(values["b1"]))]
        outputs = [max(0., value) if activation == "relu" else sigmoid(value) if activation == "logistic" else value for value in sums]
        score = sum(outputs[index] * values["W2"][index][0] for index in range(len(outputs))) + values["b2"][0]
        preactivation.append(sums)
        hidden.append(outputs)
        logits.append(score)
        probabilities.append(sigmoid(score))
    return {"Z1": preactivation, "A1": hidden, "logits": logits, "probabilities_positive": probabilities, "predictions": [int(value > .5) for value in probabilities]}


def numpy_forward(inputs, values, activation):
    values = arrays(values)
    summed = np.asarray(inputs) @ values["W1"] + values["b1"]
    activated = np.maximum(0., summed) if activation == "relu" else np.asarray([[sigmoid(float(value)) for value in row] for row in summed]) if activation == "logistic" else summed
    logits = (activated @ values["W2"] + values["b2"]).ravel()
    return summed, activated, logits


def loss(inputs, targets, values, activation, alpha):
    _, _, logits = numpy_forward(inputs, values, activation)
    data = float(np.mean(np.logaddexp(0., logits) - np.asarray(targets) * logits))
    penalty = alpha / (2 * len(targets)) * sum(float(np.sum(np.square(values[key]))) for key in ["W1", "W2"])
    scalar = scalar_forward(inputs, lists(values), activation)
    close(data, sum(softplus(score) - target * score for score, target in zip(scalar["logits"], targets)) / len(targets))
    return {"data_log_loss": data, "l2_penalty": penalty, "objective": data + penalty}


def gradient(inputs, targets, values, activation, alpha):
    values = arrays(values)
    summed, activated, logits = numpy_forward(inputs, values, activation)
    output_delta = np.asarray([sigmoid(float(value)) for value in logits])[:, None] - np.asarray(targets)[:, None]
    derivative = (summed > 0).astype(float) if activation == "relu" else activated * (1 - activated) if activation == "logistic" else np.ones_like(summed)
    hidden_delta = (output_delta @ values["W2"].T) * derivative
    count = len(targets)
    gradients = {"W1": (np.asarray(inputs).T @ hidden_delta + alpha * values["W1"]) / count,
                 "b1": np.sum(hidden_delta, axis=0) / count,
                 "W2": (activated.T @ output_delta + alpha * values["W2"]) / count,
                 "b2": np.sum(output_delta, axis=0) / count}
    oracle = {key: np.zeros_like(value) for key, value in values.items()}
    traced = scalar_forward(inputs, lists(values), activation)
    for row, target, hidden, prehidden, probability in zip(inputs, targets, traced["A1"], traced["Z1"], traced["probabilities_positive"]):
        delta = probability - target
        oracle["b2"][0] += delta / count
        for unit in range(len(hidden)):
            oracle["W2"][unit, 0] += hidden[unit] * delta / count
            local_derivative = float(prehidden[unit] > 0) if activation == "relu" else hidden[unit] * (1 - hidden[unit]) if activation == "logistic" else 1.
            upstream = delta * values["W2"][unit, 0] * local_derivative
            oracle["b1"][unit] += upstream / count
            for feature in range(2):
                oracle["W1"][feature, unit] += row[feature] * upstream / count
    for key in ["W1", "W2"]:
        oracle[key] += alpha * values[key] / count
    for key in values:
        close(gradients[key], oracle[key])
    return gradients, {"output_delta_before_mean": output_delta.ravel().tolist(), "hidden_delta_before_mean": hidden_delta.tolist(), "activation_derivative": derivative.tolist()}


def finite_difference(inputs, targets, values, activation, alpha, expected):
    summed, _, _ = numpy_forward(inputs, values, activation)
    if activation == "relu" and np.any(np.abs(summed) <= 1e-10):
        return {"tag": "not-applicable", "reason": "ReLU-kink-not-mathematically-differentiable", "central_difference_pass_claimed": False}
    maximum = 0.
    values = arrays(values)
    epsilon_scale = min(1., float(np.min(np.abs(summed))) / (10 * max(1., float(np.max(np.abs(inputs)))) * max(EPSILONS))) if activation == "relu" else 1.
    actual_epsilons = [epsilon * epsilon_scale for epsilon in EPSILONS]
    for epsilon in actual_epsilons:
        for key, value in values.items():
            for index in np.ndindex(value.shape):
                positive, negative = copy.deepcopy(values), copy.deepcopy(values)
                positive[key][index] += epsilon
                negative[key][index] -= epsilon
                estimate = (loss(inputs, targets, positive, activation, alpha)["objective"] - loss(inputs, targets, negative, activation, alpha)["objective"]) / (2 * epsilon)
                truth = float(expected[key][index])
                error = abs(estimate - truth)
                assert error <= 1e-6 + 1e-4 * abs(truth), (key, index, epsilon, truth, estimate)
                maximum = max(maximum, error)
    report = {"tag": "verified", "requested_epsilons": EPSILONS, "epsilons": actual_epsilons, "max_absolute_error": maximum, "parameters": sum(value.size for value in values.values())}
    GRADIENT_CHECKS.append(report)
    return report


def reference_model(values, activation):
    model = MLPClassifier(hidden_layer_sizes=(len(values["b1"]),), activation=activation, random_state=SEED, early_stopping=False)
    model._label_binarizer = LabelBinarizer().fit([0, 1])
    model._random_state = check_random_state(SEED)
    model._initialize(np.asarray([[0.], [1.]]), [2, len(values["b1"]), 1], np.float64)
    model.n_features_in_ = 2
    value_arrays = arrays(values)
    model.coefs_ = [value_arrays["W1"].copy(), value_arrays["W2"].copy()]
    model.intercepts_ = [value_arrays["b1"].copy(), value_arrays["b2"].copy()]
    return model


def sklearn_gradients(inputs, targets, values, activation, alpha):
    model = reference_model(values, activation)
    model.alpha = alpha
    count, width = len(inputs), len(values["b1"])
    activations = [np.asarray(inputs), np.empty((count, width)), np.empty((count, 1))]
    deltas = [np.empty((count, width)), np.empty((count, 1))]
    coefficient = [np.empty((2, width)), np.empty((width, 1))]
    intercept = [np.empty(width), np.empty(1)]
    result, coefficient, intercept = model._backprop(np.asarray(inputs), np.asarray(targets)[:, None], None, activations, deltas, coefficient, intercept)
    return result, {"W1": coefficient[0], "W2": coefficient[1], "b1": intercept[0], "b2": intercept[1]}


def forward_checked(inputs, values, activation):
    traced = scalar_forward(inputs, values, activation)
    summed, activated, logits = numpy_forward(inputs, values, activation)
    close(traced["Z1"], summed)
    close(traced["A1"], activated)
    close(traced["logits"], logits)
    model = reference_model(values, activation)
    close(traced["probabilities_positive"], model.predict_proba(np.asarray(inputs))[:, 1])
    assert traced["predictions"] == model.predict(np.asarray(inputs)).tolist()
    return traced


def dataset():
    training = [[-2., -1.], [-2., 1.], [-1., -1.], [-1., 1.], [1., -1.], [1., 1.], [2., -1.], [2., 1.], [.5, 0.], [1.5, 0.], [-1.5, 0.], [-.5, 0.]]
    targets = [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0]
    development = [[-1.75, -.5], [-.75, .5], [-.25, 0.], [.25, 0.], [.75, -.5], [1.75, .5]]
    return {"id": "nn.churn.noisy.v1", "provenance": "Original fictional CC0-1.0 customer coordinates;no real people,production labels or remote data.",
            "feature_order": ["pre_prediction_activity_index", "pre_prediction_contact_index"], "feature_units": ["fictional index", "fictional index"],
            "class_order": [0, 1], "positive_class": "1=churns;0=stays",
            "training": {"inputs": training, "targets": targets, "ids": [f"nn.train.{index}" for index in range(12)]},
            "development": {"inputs": development, "targets": [0, 0, 0, 1, 1, 1], "ids": [f"nn.development.{index}" for index in range(6)]},
            "sealed_test": {"inputs": [[-1.25, .25], [-.25, -.25], [.25, .25], [1.25, -.25]], "targets": [0, 0, 1, 1], "ids": [f"nn.test.{index}" for index in range(4)], "policy": "Not transformed,predicted,scored or used for checkpoint selection;strip from eventual client replay."},
            "queries": {"inputs": [[-1., 0.], [0., 0.], [1., 0.], [.5, -.5]], "ids": [f"nn.query.{index}" for index in range(4)]}}


def interaction(config, question, prediction, explanation):
    config.update({"prediction_question": question, "correct_prediction_id": prediction, "prediction_options": [
        {"id": prediction, "label": "The named reference calculation or permission is valid"},
        {"id": "guarantee", "label": "A larger network or longer training guarantees reliable future predictions"},
        {"id": "leak", "label": "Use final-test feedback to choose weights or stopping"}],
        "correct_reason_id": "mechanism", "reason_options": [
            {"id": "mechanism", "label": explanation},
            {"id": "causal", "label": "A hidden unit necessarily represents a named human concept and proves causality"},
            {"id": "test", "label": "A high test score permits changing the model after final evaluation"}],
        "explanation": explanation,
        "counterexample": "Identical linear layers collapse to one affine map;more parameters or smaller training loss do not guarantee better development loss,calibration or causal meaning."})
    return config


def numerical_prediction(config, expected, alternatives):
    config["prediction_options"] = [{"id": config["correct_prediction_id"], "label": expected}] + [{"id": f"alternative-{index}", "label": label} for index, label in enumerate(alternatives)]
    assert len(set(item["label"] for item in config["prediction_options"])) == len(config["prediction_options"])
    return config


def manual_forward(width, activation, shifted, inputs):
    values = parameters(width, shifted)
    traced = forward_checked(inputs, values, activation)
    if activation == "identity":
        value_arrays = arrays(values)
        collapsed = np.asarray(inputs) @ (value_arrays["W1"] @ value_arrays["W2"]) + value_arrays["b1"] @ value_arrays["W2"] + value_arrays["b2"]
        close(traced["logits"], collapsed.ravel())
    result = interaction({"id": f"nn-e1.manual.h{width}.{activation}.{'shifted' if shifted else 'base'}.v1", "kind": "manual-forward", "controls": {"hidden_units": width, "activation": activation, "parameter_scene": "shifted" if shifted else "base"}, "inputs": inputs, "parameters": values, "shapes": {"X": [len(inputs), 2], "W1": [2, width], "b1": [width], "W2": [width, 1], "b2": [1]}, "parameter_count": 4 * width + 1, "forward": traced, "native_class_tie": "p>0.5 gives1;equality gives0", "fit_claim": False},
                         "For the FINAL listed query,predict output probability,class and learned parameter count before revealing intermediate signals.", "forward", "Weighted sums include biases;hidden activation changes composition,and the output sigmoid estimates a probability,not calibrated or causal certainty.")
    return numerical_prediction(result, f"p={traced['probabilities_positive'][-1]:.7g},class={traced['predictions'][-1]},parameters={4 * width + 1}", ["p=0.5,class=0;weights and biases are irrelevant", "Stacking identity layers guarantees a nonlinear rule and calibrated probabilities"])


def manual_step(activation, rate, alpha, special=None):
    values = parameters()
    inputs, targets = [[1., .5], [-1., .25]], [1, 0]
    if special == "dead":
        values["b1"] = [-10., -10.]
    if special == "kink":
        inputs = [[0., 0.]]
        targets = [1]
        values["b1"] = [0., .5]
    if special == "saturated":
        values["b1"] = [35., -35.]
    gradients, factors = gradient(inputs, targets, values, activation, alpha)
    checked = finite_difference(inputs, targets, values, activation, alpha, gradients)
    native_loss, native_gradients = sklearn_gradients(inputs, targets, values, activation, alpha)
    before = loss(inputs, targets, values, activation, alpha)
    close(native_loss, before["objective"])
    for key in gradients:
        close(gradients[key], native_gradients[key])
    updated = {key: value - rate * gradients[key] for key, value in arrays(values).items()}
    after = loss(inputs, targets, updated, activation, alpha)
    if special == "dead" and alpha == 0:
        close(gradients["W1"], np.zeros((2, 2)))
        close(gradients["b1"], np.zeros(2))
    result = interaction({"id": f"nn-e2.step.{activation}.eta-{rate}.alpha-{alpha}.{special or 'smooth'}.v1", "kind": "manual-gradient-step", "controls": {"activation": activation, "learning_rate": rate, "alpha": alpha, "special": special}, "inputs": inputs, "targets": targets, "initial_parameters": values, "forward_before": forward_checked(inputs, values, activation), "gradients": lists(gradients), "chain_rule": factors, "gradient_check": checked, "updated_parameters": lists(updated), "forward_after": forward_checked(inputs, lists(updated), activation), "loss_before": before, "loss_after": after, "optimizer": "simultaneous full-batch plain-gradient step;not Adam", "prediction_is_training": False},
                         "Predict the new OUTPUT BIAS after the supplied training step,and whether the full objective increases or decreases. Inference alone keeps it fixed.", "update", "Backprop applies the chain rule to the current loss;all parameters update simultaneously from the same old snapshot. The learning rate scales gradients,not the loss value.")
    direction = "decreases" if after["objective"] < before["objective"] else "increases" if after["objective"] > before["objective"] else "unchanged"
    return numerical_prediction(result, f"New output bias={float(updated['b2'][0]):.7g};objective {direction}", ["Subtract the loss value from every weight and bias", "Prediction automatically applies this update without a training operation"])


def training_run(data, activation, rate, alpha):
    inputs = np.asarray(data["training"]["inputs"])
    targets = np.asarray(data["training"]["targets"])
    scaler = StandardScaler().fit(inputs)
    training = scaler.transform(inputs)
    development = scaler.transform(data["development"]["inputs"])
    close(scaler.mean_, inputs.mean(axis=0))
    close(scaler.var_, np.mean((inputs - inputs.mean(axis=0)) ** 2, axis=0))
    model = MLPClassifier(hidden_layer_sizes=(2,), activation=activation, solver="sgd", alpha=alpha, batch_size=len(inputs), learning_rate="constant", learning_rate_init=rate, max_iter=1, shuffle=False, random_state=SEED, tol=0., momentum=0., nesterovs_momentum=False, early_stopping=False, n_iter_no_change=10000, warm_start=False)
    initial = reference_model(parameters(), activation)
    initial._random_state = check_random_state(SEED)
    initial._initialize(targets[:, None], [2, 2, 1], np.float64)
    values = {"W1": initial.coefs_[0], "W2": initial.coefs_[1], "b1": initial.intercepts_[0], "b2": initial.intercepts_[1]}
    random = np.random.RandomState(SEED)
    for coefficient, bias, fan_in, fan_out in [("W1", "b1", 2, 2), ("W2", "b2", 2, 1)]:
        bound = math.sqrt((2. if activation == "logistic" else 6.) / (fan_in + fan_out))
        close(values[coefficient], random.uniform(-bound, bound, (fan_in, fan_out)))
        close(values[bias], random.uniform(-bound, bound, fan_out))
    start = lists(values)
    stages, captured = [], []
    for epoch in range(1, 129):
        before_values = lists(values)
        gradients, factors = gradient(training, targets, values, activation, alpha)
        check = finite_difference(training, targets, values, activation, alpha, gradients)
        native_loss, native_gradients = sklearn_gradients(training, targets, before_values, activation, alpha)
        before_loss = loss(training, targets, values, activation, alpha)
        close(native_loss, before_loss["objective"])
        for key in values:
            close(gradients[key], native_gradients[key])
        expected = {key: value - rate * gradients[key] for key, value in arrays(values).items()}
        with warnings.catch_warnings(record=True) as notices:
            warnings.simplefilter("always")
            model.partial_fit(training, targets, classes=[0, 1] if epoch == 1 else None)
        captured.extend(str(notice.message) for notice in notices)
        values = {"W1": model.coefs_[0], "W2": model.coefs_[1], "b1": model.intercepts_[0], "b2": model.intercepts_[1]}
        for key in values:
            close(values[key], expected[key])
        close(model.loss_curve_[-1], before_loss["objective"])
        train_forward = forward_checked(training, lists(values), activation)
        development_forward = forward_checked(development, lists(values), activation)
        for output, rows, labels in [(train_forward, training, targets), (development_forward, development, data["development"]["targets"])]:
            manual_logloss = loss(rows, labels, values, activation, 0.)["data_log_loss"]
            close(manual_logloss, log_loss(labels, np.column_stack([1 - np.asarray(output["probabilities_positive"]), output["probabilities_positive"]]), labels=[0, 1]))
            close(np.mean(np.asarray(output["predictions"]) == labels), accuracy_score(labels, output["predictions"]))
        stages.append({"epoch": epoch, "parameters_before": before_values, "gradients": lists(gradients), "chain_rule": factors, "gradient_check": check, "parameters_after": lists(values), "pre_update_objective": before_loss,
                       "library_loss_curve_value": float(model.loss_curve_[-1]), "post_update_training": loss(training, targets, values, activation, alpha), "post_update_development": loss(development, data["development"]["targets"], values, activation, 0.),
                       "training_forward": train_forward, "development_forward": development_forward, "convergence": "fixed-budget checkpoint;no convergence/global-optimum claim"})
    assert not captured, captured
    candidates = [stage for stage in stages if stage["epoch"] in CHECKPOINTS]
    minimum = min(stage["post_update_development"]["data_log_loss"] for stage in candidates)
    selected = next(stage["epoch"] for stage in candidates if stage["post_update_development"]["data_log_loss"] <= minimum + 1e-12)
    return {"id": f"nn.training.{activation}.eta-{rate}.alpha-{alpha}.v1", "fixture_id": data["id"], "settings": model.get_params(), "initial_parameters": start,
            "scaler": {"fit_ids": data["training"]["ids"], "mean": scaler.mean_.tolist(), "variance": scaler.var_.tolist(), "scale": scaler.scale_.tolist()},
            "training_scaled": training.tolist(), "development_scaled": development.tolist(), "stages": stages, "candidate_epochs": CHECKPOINTS, "selected_epoch": selected,
            "selection_metric": "post-update development data-only mean binary log loss;minimize;within1e-12 choose earliest listed epoch", "test_evaluated": False, "warnings": captured,
            "optimizer_state": "public partial_fit continues SGDOptimizer;momentum0,nesterovFalse,constant learning rate;each call one full-batch update",
            "epoch_note": "partial_fit n_iter_ resets per call in this version;manifest epoch counts calls,not reported n_iter_"}


def rejected(experiment, reason):
    return interaction({"id": f"{experiment.lower()}.reject.{reason}.v1", "kind": "rejected", "reason": reason, "expected": {"tag": "invalid", "prediction": None, "gradient": None, "selected_checkpoint": None}},
                       "Is this authored configuration permitted,or must it reject without a fabricated result?", "reject", "Only finite reviewed parameters and training/fold-only fits are permitted;test data and nonfinite values cannot guide updates or checkpoint selection.")


def manifest(identity, data, configs, objectives):
    assert len(configs) <= 64 and len({item["id"] for item in configs}) == len(configs)
    return {"schema": "mlp.experiment.v1", "id": f"{identity}.v1", "objectives": objectives, "datasets": [data], "configurations": configs,
            "prerequisites": ["weighted sums and matrix shapes", "Logistic probabilities", "chain rule and gradient descent", "training-only and fold-only scaling", "development versus final-test evaluation"],
            "interaction": ["Choose a reviewed configuration", "Record prediction before reveal", "Reveal numerical and synchronized graphic result", "Change a meaningful finite scene and predict again", "Give a bounded supported explanation and transfer"],
            "accessibility": ["Native labeled keyboard controls and visible focus", "Ordered layer and chain-rule text alternatives", "Numerical tables with units,dimensions,parameter values and fit IDs", "Wrapping summaries plus local focusable table scrolling at320px", "No color,hover,animation or spatial-only meaning;reduced motion", "No massive live-region trace dump"],
            "limits": {"combined_configurations": 64, "plotted_points": 64, "table_columns": 8, "displayed_table_rows": 32, "arbitrary_code": False, "unreviewed_continuous_controls": False},
            "display_policy": "Full immutable traces are evidence assets;display selected bounded rows/layers. Never put full traces into learner submissions or persistence.",
            "notebook": "One future trusted module notebook;not authored/executed by this freeze;no mastery credit."}


def main():
    data = dataset()
    first_configs = [manual_forward(width, activation, shifted, data["queries"]["inputs"]) for width in [1, 2] for activation in ["identity", "logistic", "relu"] for shifted in [False, True]]
    steps = [manual_step(activation, rate, alpha) for activation in ["logistic", "relu"] for rate in [.1, 3.] for alpha in [0., .4]]
    steps += [manual_step("relu", .1, 0., "dead"), manual_step("relu", .1, 0., "kink"), manual_step("logistic", .1, 0., "saturated")]
    trajectories = [training_run(data, activation, rate, alpha) for activation in ["logistic", "relu"] for rate in [.05, .5] for alpha in [0., .4]]
    second_configs = list(steps)
    for trajectory in trajectories:
        for epoch in CHECKPOINTS:
            stage = trajectory["stages"][epoch - 1]
            second_configs.append(interaction({"id": f"nn-e2.{trajectory['id']}.epoch-{epoch}", "kind": "training-checkpoint", "trajectory_id": trajectory["id"], "controls": {"epoch": epoch, "activation": trajectory["settings"]["activation"], "learning_rate": trajectory["settings"]["learning_rate_init"], "alpha": trajectory["settings"]["alpha"]},
                                              "expected": {"epoch": epoch, "parameters": stage["parameters_after"], "training_data_log_loss": stage["post_update_training"]["data_log_loss"], "development_data_log_loss": stage["post_update_development"]["data_log_loss"], "selected_epoch": trajectory["selected_epoch"], "test_evaluated": False}},
                                             "Predict whether lower training loss also proves better development performance,and identify the permitted checkpoint-selection evidence.", "checkpoint", "Training updates use training rows only;development data-only log loss selects among the four frozen checkpoints,with earliest-epoch ties. Final test remains untouched;longer training is not guaranteed to generalize."))
        stage = trajectory["stages"][31]
        first_configs.append(interaction({"id": f"nn-e1.{trajectory['id']}.epoch-32", "kind": "fitted-forward", "trajectory_id": trajectory["id"], "epoch": 32, "parameters": stage["parameters_after"], "inputs_in_training_scaled_space": trajectory["development_scaled"], "forward": stage["development_forward"], "parameter_count": 9, "training_fit_ids": data["training"]["ids"]},
                                        "Trace the fitted two-hidden-unit network and predict a named development probability without retraining it.", "forward", "Inference applies the frozen scaler and weights;hidden units combine nonlinear transformations but do not inherently encode human concepts."))
    for sign in [-1, 1]:
        values = {"W1": [[0.], [0.]], "b1": [1.], "W2": [[0.]], "b2": [sign * 1000.]}
        traced = forward_checked([[0., 0.]], values, "relu")
        probability = traced["probabilities_positive"][0]
        target = 0 if sign > 0 else 1
        clipped_loss = float(log_loss([target], [[1 - probability, probability]], labels=[0, 1]))
        first_configs.append(interaction({"id": f"nn-e1.endpoint.{sign}.v1", "kind": "numerical-endpoint", "parameters": values, "input": [0., 0.], "forward": traced, "target": target, "stable_finite_logit_loss": softplus(sign * 1000.) - target * sign * 1000., "mathematical_probability_endpoint_loss": {"tag": "positive-infinity", "reason": "exact-contradictory-probability-endpoint"}, "library_clipped_probability_log_loss": clipped_loss, "note": "Mathematical sigmoid of a finite logit is strictly interior;binary64 rounds here to0/1. Finite logit-loss1000 differs from exact-endpoint infinity and library epsilon clipping."},
                                        "Predict whether rounded probability endpoints imply a zero loss for a confidently wrong label.", "endpoint", "A confidently wrong finite logit has large finite stable loss;exact contradictory probability endpoints have infinite mathematical loss,and library epsilon clipping is a different numerical convention."))
    first_configs += [rejected("NN-E1", reason) for reason in ["shape-mismatch", "nonfinite-weight", "unsupported-activation"]]
    second_configs += [rejected("NN-E2", reason) for reason in ["nonpositive-learning-rate", "nonfinite-update", "globally-fitted-scaling", "test-selected-checkpoint", "outer-fold-selected-epoch"]]
    first = manifest("NN-E1", data, first_configs, ["NN01", "NN03", "NN05"])
    second = manifest("NN-E2", data, second_configs, ["NN02", "NN03", "NN04", "NN05"])
    second["training_trajectories"] = trajectories
    second["fold_boundary_plan"] = {"outer_training_ids": data["training"]["ids"][:8], "outer_evaluation_ids": data["training"]["ids"][8:], "inner_fit_ids": data["training"]["ids"][:6], "inner_stopping_ids": data["training"]["ids"][6:8], "rule": "Only inner-fit rows fit scaler/network;inner-stopping chooses checkpoint;outer-evaluation does neither. This is an exact permission example,not an executed cross-validation score."}
    minimum_tie = min([(1, .7), (8, .7 + 5e-13), (32, .8)], key=lambda item: item[1])[1]
    assert next(epoch for epoch, value in [(1, .7), (8, .7 + 5e-13), (32, .8)] if value <= minimum_tie + 1e-12) == 1
    boundary = reference_model({"W1": [[0.], [0.]], "b1": [0.], "W2": [[0.]], "b2": [0.]}, "logistic")
    assert boundary.predict([[0., 0.]]).tolist() == [0]
    overfit = [trajectory["id"] for trajectory in trajectories if trajectory["stages"][-1]["post_update_training"]["data_log_loss"] < trajectory["stages"][31]["post_update_training"]["data_log_loss"] and trajectory["stages"][-1]["post_update_development"]["data_log_loss"] > trajectory["stages"][31]["post_update_development"]["data_log_loss"] + 1e-6]
    report = {"schema": "mlp.parity.v1", "python": platform.python_version(), "platform": platform.platform(), "dependencies": PROFILE, "seed": SEED, "configuration_counts": {"NN-E1": len(first_configs), "NN-E2": len(second_configs)},
              "training_runs": len(trajectories), "training_updates": sum(len(trajectory["stages"]) for trajectory in trajectories), "manual_gradient_states": len(steps),
              "finite_difference_checks": len(GRADIENT_CHECKS), "finite_difference_parameters_per_check": 9, "finite_difference_epsilons": EPSILONS,
              "max_gradient_absolute_error": max(item["max_absolute_error"] for item in GRADIENT_CHECKS), "max_parity_absolute_error": max(ERRORS),
              "kink_states_not_falsely_gradient_verified": sum(step["gradient_check"]["tag"] == "not-applicable" for step in steps),
              "overfit_counterexample_trajectory_ids": overfit, "all_states_verified": True, "test_predicted_or_scored": False,
              "checks": ["independent scalar versus NumPy forward and gradients", "exported parameters versus public MLP probabilities/classes", "every smooth manual/training gradient versus central differences at two epsilons", "pinned private gradient reference versus independent arithmetic;offline author tooling only", "public partial_fit versus simultaneous plain SGD at every epoch", "independent Glorot RNG initialization", "pre-update library loss versus post-update independent losses", "training-only scaler population statistics", "external development checkpoint selection and tie rule", "binary equality,ReLU kink,dead/saturated activations and endpoint clipping distinctions"],
              "not_verified": ["application implementation", "100 future scored exercises", "module notebook", "genuine screen reader", "genuine browser zoom", "genuine Colab", "original-directory I/O reliability"]}
    assert overfit, "Need a genuine frozen overfitting counterexample before freeze"
    baseline_path = DEST / "source-preservation-baseline.v1.json"
    baseline_document = json.loads(baseline_path.read_text())
    baseline_content_sha256 = baseline_document["content_sha256"]
    baseline_body = {key: value for key, value in baseline_document.items() if key != "content_sha256"}
    assert digest(json.dumps(baseline_body, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()) == baseline_content_sha256
    expected_hashes = baseline_document["files"]
    assert len(expected_hashes) == 530 == baseline_document["source_file_count"]
    hashes = {name: digest((ROOT / name).read_bytes()) for name in sorted(expected_hashes)}
    changed_files = [name for name, expected in expected_hashes.items() if hashes.get(name) != expected]
    assert not changed_files, changed_files
    aggregate = digest(json.dumps(hashes, sort_keys=True).encode())
    assert aggregate == baseline_document["aggregation"]["sha256"]
    preservation = {"schema": "mlp.source-preservation.v1", "checked_files": len(hashes), "aggregate_sha256": aggregate, "changed_files": [], "learner_storage_accessed": False, "baseline": str(baseline_path.relative_to(ROOT)), "baseline_content_sha256": baseline_content_sha256, "historical_task_015_10_aggregate_sha256": baseline_document["provenance"]["accepted_reported_aggregate_sha256"], "original_directory_io_reliability": "OPEN"}
    files = {"nn-e1.manifest.v1.json": encode(first), "nn-e2.manifest.v1.json": encode(second), "parity-report.v1.json": encode(report), "source-preservation.v1.json": encode(preservation)}
    files["freeze-lock.v1.json"] = encode({"schema": "mlp.freeze.v1", "sha256": {name: digest(value) for name, value in files.items()}, "generator_sha256": digest(Path(__file__).read_bytes()), "conventions_sha256": digest((DEST / "NUMERICAL_GRADIENT_CHECKPOINT_CONVENTIONS.md").read_bytes()), "preservation_baseline_sha256": digest(baseline_path.read_bytes())})
    if "--check" in sys.argv:
        for name, value in files.items():
            assert (DEST / name).read_bytes() == value, name
        print(f"PASS byte-identical regeneration:{len(first_configs)}/{len(second_configs)} states,{report['training_updates']} updates;all frozen hashes unchanged")
    else:
        for name, value in files.items():
            (DEST / name).write_bytes(value)
        print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
