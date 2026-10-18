"""Bounded optimization.v1 teaching traces; the regression objective is unchanged."""
import math
from mlmath.regression import feature_scaling_trace, regression_gradient_check, regression_training_trace


def finite_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def validate_settings(kind, point, scale, penalty):
    if kind not in ["quadratic", "anisotropic", "coupled", "saddle", "double-well"] or not isinstance(point, (list, tuple)) or len(point) != 2 or any(not finite_number(value) or abs(value) > 1e6 for value in point):
        raise ValueError("Known objective and two finite bounded coordinates required")
    if not finite_number(scale) or not 1 <= scale <= 100 or not finite_number(penalty) or not 0 <= penalty <= 10:
        raise ValueError("Invalid scale or penalty")
    if kind != "quadratic" and penalty != 0:
        raise ValueError("Penalty comparison applies only to quadratic")


def objective_values(kind, point, scale, penalty):
    first, second = point
    if kind == "coupled":
        data_loss, gradient = (first+second)**2, [2*(first+second), 2*(first+second)]
    elif kind == "saddle":
        data_loss, gradient = first**2-second**2, [2*first, -2*second]
    elif kind == "double-well":
        data_loss, gradient = (first**2-1)**2+second**2, [4*first*(first**2-1), 2*second]
    else:
        curvature = scale if kind == "anisotropic" else 1
        data_loss, gradient = (first-3)**2+curvature*second**2, [2*(first-3), 2*curvature*second]
    penalty_loss = penalty*(first**2+second**2)
    return dict(dataLoss=data_loss, penaltyLoss=penalty_loss, totalLoss=data_loss+penalty_loss, gradient=[gradient[0]+2*penalty*first, gradient[1]+2*penalty*second])


def optimization_state(kind, point, scale=1, penalty=0):
    validate_settings(kind, point, scale, penalty)
    values = objective_values(kind, point, scale, penalty)
    numerical, step = [], 1e-5
    for index in range(2):
        plus, minus = list(point), list(point)
        plus[index] += step
        minus[index] -= step
        numerical.append((objective_values(kind, plus, scale, penalty)["totalLoss"]-objective_values(kind, minus, scale, penalty)["totalLoss"])/(2*step))
    maximum_error = max(abs(analytic-numeric) for analytic, numeric in zip(values["gradient"], numerical))
    tolerance = 1e-6*max(1, *map(abs, values["gradient"]))
    return dict(contract="optimization.v1", kind=kind, point=list(point), scale=scale, penalty=penalty, **values, gradientNorm=math.hypot(*values["gradient"]), numericalGradient=numerical, gradientCheck=dict(passed=maximum_error <= tolerance, maxAbsoluteError=maximum_error, tolerance=tolerance))


def optimization_training_trace(kind, point, scale, penalty, learning_rate, iterations):
    validate_settings(kind, point, scale, penalty)
    if isinstance(iterations, bool) or not isinstance(iterations, int) or not 1 <= iterations <= 100 or not finite_number(learning_rate) or not 0 < learning_rate <= 2 or any(abs(value) > 10 for value in point):
        raise ValueError("Finite bounded training settings required")
    current, entries = list(point), []
    for iteration in range(iterations+1):
        values = objective_values(kind, current, scale, penalty)
        nonfinite = not all(math.isfinite(value) for value in [*current, values["dataLoss"], values["penaltyLoss"], values["totalLoss"], *values["gradient"]])
        limited = any(abs(value) > 1e6 for value in current) or abs(values["totalLoss"]) > 1e12 or any(abs(value) > 1e8 for value in values["gradient"])
        if nonfinite or limited:
            entries.append(dict(iteration=iteration, point=list(current), dataLoss=None, penaltyLoss=None, totalLoss=None, gradient=None, status="diverged", terminationReason="non_finite_calculation" if nonfinite else "numerical_limit_exceeded"))
            break
        entries.append(dict(iteration=iteration, point=list(current), **values, status="completed" if iteration == iterations else "running", terminationReason="iterations_completed" if iteration == iterations else None))
        if iteration == iterations:
            break
        next_point = [current[index]-learning_rate*values["gradient"][index] for index in range(2)]
        if not all(math.isfinite(value) for value in next_point):
            entries[-1].update(status="diverged", terminationReason="non_finite_calculation")
            break
        current = next_point
    final = entries[-1]
    return dict(contract="optimization.v1", entryConvention="state 0 is initial; state k follows k simultaneous updates", requestedIterations=iterations, learningRate=learning_rate, completedUpdates=final["iteration"], status=final["status"], terminationReason=final["terminationReason"], entries=entries)


def optimization_slice(kind, point, scale=1, penalty=0):
    validate_settings(kind, point, scale, penalty)
    return [dict(coordinate=-5+index/4, **objective_values(kind, [-5+index/4, point[1]], scale, penalty)) for index in range(41)]


def optimization_regression_comparison(learning_rate, iterations):
    if not finite_number(learning_rate) or not 0 < learning_rate <= 1 or isinstance(iterations, bool) or not isinstance(iterations, int) or not 1 <= iterations <= 40:
        raise ValueError("Use rate in (0,1] and 1–40 updates")
    features, targets = [[-20], [-10], [10], [20]], [-4, -2, 2, 4]
    scaling = feature_scaling_trace(features)
    original = dict(features=features, targets=targets, weights=[0], bias=0)
    scaled = {**original, "features": scaling["scaled"]}
    return dict(contract="optimization.v1", scaling=scaling, original=regression_training_trace(**original, learning_rate=learning_rate, iterations=iterations), scaled=regression_training_trace(**scaled, learning_rate=learning_rate, iterations=iterations), gradientChecks=dict(original=regression_gradient_check(**original), scaled=regression_gradient_check(**scaled)))


def optimization_grid(kind, point, scale=1, penalty=0):
    validate_settings(kind, point, scale, penalty)
    return [dict(point=[-5+index % 11, -5+index//11], **objective_values(kind, [-5+index % 11, -5+index//11], scale, penalty)) for index in range(121)]
