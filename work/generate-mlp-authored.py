import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "apps/web/app/supervised/mlp/authored.json"
CONTENT = "supervised.mlp.1.0.0"

LESSONS = [
    ("NN01", [
        ("Trace input, hidden and output shapes and parameter counts", "A batch has4 rows and2 feature columns. W1 is2×2,b1 has2 values,W2 is2×1 and b2 has1. Which shape trace is valid?", "X(4,2)→Z1(4,2)→A1(4,2)→logits(4,1); learned parameters=11, including5 biases.", "Keep row-major X, count matrix weights and every bias, then check output columns."),
        ("Explain why nonlinear activation is needed between affine layers", "A churn model stacks two affine layers but uses identity activations. What extra function class does this guarantee?", "None: composed affine maps collapse to one affine map; a nonlinear hidden activation is needed for nonlinear composition.", "Multiply the affine maps and include the composed bias; then compare a ReLU or sigmoid hidden unit."),
        ("Calculate a small two-layer forward pass", "For x=2,w=1,b=−1,hidden ReLU and output weight2,bias0, what is the output logit?", "z1=1,ReLU(z1)=1,output logit=2 and sigmoid probability≈0.8808.", "Apply each multiplication and bias in order, then activation, then the output layer."),
        ("Relate a neuron to existing X-Ray weighted sums", "An X-Ray feature calculator returns a weighted sum plus offset. Which familiar operation is a neuron before activation?", "A dot product plus bias; the activation is a separate following operation.", "Recall weighted sums and keep the bias and activation as distinct steps."),
    ]),
    ("NN02", [
        ("Read the chain-rule dependency path", "For a binary output error, which route carries its effect to a hidden-layer weight?", "Output loss derivative → output weights → hidden activation derivative → hidden preactivation/input weight.", "Trace the chain rule in reverse through each composed operation."),
        ("Distinguish training updates from fixed-weight inference", "A deployed predict call receives a new churn record. Does it update the stored network weights?", "No. Inference uses fixed fitted weights; fitting/training applies updates from permitted training data.", "Separate calculating a prediction from explicitly computing gradients and applying an optimizer step."),
        ("Calculate one supplied bounded gradient step", "A parameter is1, its gradient is0.2 and plain-SGD learning rate is0.1. What is the new parameter?", "1−0.1×0.2=0.98.", "Use theta_new=theta_old−eta×gradient; the gradient and update use the old snapshot."),
        ("Recognize saturation and inactive-activation cases", "A sigmoid hidden unit is saturated or a ReLU preactivation is negative. What can happen locally?", "The local derivative can be very small for saturated sigmoid or zero for inactive ReLU, limiting that unit's gradient.", "Recall activation derivatives; distinguish a local zero/small gradient from zero prediction error."),
    ]),
    ("NN03", [
        ("Compare small architecture parameter counts", "For a2→2→1 network, how many learned weights and biases are there?", "2×2+2+2×1+1=9 parameters.", "Count each affine matrix and bias vector once."),
        ("Explain overfit, regularization and early-stopping trade-offs", "Training loss keeps falling while development loss rises. Is the later checkpoint automatically better?", "No. Development evidence can indicate overfitting; regularization/stopping trade-offs do not guarantee unseen improvement or a global optimum.", "Compare both curves and identify the selection partition; do not select from training loss alone."),
        ("Read training and development loss traces", "Training loss is0.1 and development loss0.8 at a later checkpoint. What does that suggest?", "The fit/generalization gap widened; inspect the earlier permitted development checkpoints and avoid claiming guaranteed performance.", "Read partition labels and compare the actual metric at each checkpoint."),
        ("Diagnose a convergence warning", "An MLP reaches max_iter with a convergence warning. Is it proven optimal?", "No. It may not have converged; report the warning and configuration and assess permitted development behavior.", "A cap/warning is not a certificate of convergence. Review solver and iteration settings."),
    ]),
    ("NN04", [
        ("Trace seed, scaling and solver provenance", "A reproducible churn run is being recorded. What configuration evidence should accompany its scores?", "Seed, split/fit IDs, training-only scaling, solver/learning settings, versions and warnings.", "A seed alone cannot show which data fitted a transform or model."),
        ("Reject leaked preprocessing or stopping and explain fit boundaries", "A scaler is fit globally before cross-validation and test loss selects epoch count. Is this valid?", "No. Fit each scaler/model inside each fold-training subset; use development for declared selection and keep test untouched.", "Track every learned parameter's row IDs; the outer evaluation rows cannot select their own checkpoint."),
        ("Repair an authored MLP pipeline", "Which workflow keeps a learned scaler inside each CV fit?", "Place StandardScaler and MLPClassifier in a pipeline passed to cross-validation.", "Recall fold-only preprocessing: the evaluated estimator must refit its learned steps per fold."),
        ("Separate repeatable configuration from cross-host exactness", "The same seed is used on another platform. What can be promised?", "The configuration is specified, but bit-identical results across software/hardware versions are not guaranteed.", "Record versions and tolerances; a seed does not repair algorithm or floating-point differences."),
    ]),
    ("NN05", [
        ("Compare MLP, Logistic Regression and tree evidence", "Three classifiers are compared on churn. What must be aligned for a fair comparison?", "Same target meaning, available features, permitted rows, split and appropriate metrics/costs.", "Match the evaluation conditions before ranking models."),
        ("Reject causal, universal-best and intrinsic-unit interpretations", "A hidden unit responds to one feature and predicts churn. Does it prove a human concept or cause of churn?", "No. Hidden-unit labels can change under equivalent parameterizations; prediction does not establish causal meaning or universal superiority.", "Separate learned representation from human interpretation and predictive association from causality."),
        ("Report resource, shift and calibration limitations", "An MLP scores well overall but a subgroup is tiny and the deployment population shifts. What belongs in the report?", "Subgroup counts/uncertainty, distribution-shift and calibration limitations, and relevant resource costs.", "Aggregate accuracy does not resolve support or reliability under shift."),
        ("Choose a simpler adequate baseline when justified", "MLP and Logistic Regression have similar development performance, but the MLP costs much more to fit. What is defensible?", "Prefer the simpler adequate baseline when measured task value does not justify added complexity.", "Complexity should earn its operational cost under matched evidence."),
    ]),
]

SCENARIOS = {
    "NN01": ["fictional churn input", "two-layer score", "X-Ray weighted feature", "documentation label"],
    "NN02": ["one training batch", "one inference request", "one parameter update", "saturated or inactive unit"],
    "NN03": ["two hidden widths", "training/development curves", "regularization comparison", "iteration-limit warning"],
    "NN04": ["recorded churn fit", "three CV folds", "scaler repair", "second platform run"],
    "NN05": ["matching churn rows", "hidden-unit interpretation", "small shifted subgroup", "deployment cost comparison"],
}

def choice_atom(atom_id, label, options):
    return {"id": atom_id, "kind": "choice", "label": label, "options": options}

families = []
for lesson_index, (lesson_id, objectives) in enumerate(LESSONS):
    for objective_index, (name, prompt, answer, remediation) in enumerate(objectives):
        objective = f"{lesson_id}.O{objective_index + 1}"
        critical = objective_index == 1
        for mode, forms in [("practice", ["A", "B"]), ("assessment", ["A", "B", "C"])]:
            for variant_index, variant in enumerate(forms):
                scenario = SCENARIOS[lesson_id][(objective_index + variant_index) % 4]
                suffix = f"{mode}.{variant}"
                question = prompt if variant == "A" else prompt.replace("A batch", "For a changed batch").replace("A churn model", "A changed churn model").replace("For x=2", "In a second trace, for x=2").replace("A deployed predict call", "For a different deployed predict call").replace("training loss", "training loss in this changed run")
                if variant == "C": question = f"Changed case ({scenario}): {prompt}"
                sound = {"id": "sound", "label": answer}
                distractors = [
                    {"id": "shortcut", "label": "Choose using training score alone; validation/test boundaries do not matter."},
                    {"id": "confused", "label": "Treat a prediction, gradient and optimizer update as the same operation."},
                ]
                atoms = [choice_atom("decision", "Decision or calculation", [sound, *distractors])]
                accepted = [[{"kind": "choice", "optionId": "sound"}]]
                if critical:
                    atoms.append(choice_atom("reason", "Reason and transfer", [
                        {"id": "mechanism", "label": remediation},
                        {"id": "memorized", "label": "The answer is valid because more parameters or a higher score always prove the model is best."},
                        {"id": "unsafe", "label": "Data permissions and held-out boundaries can be ignored once a model predicts."},
                    ]))
                    accepted = [[{"kind": "choice", "optionId": "sound"}, {"kind": "choice", "optionId": "mechanism"}]]
                code = ""
                if objective.startswith("NN01.O3"):
                    code = "x=2\nw1=1\nb1=-1\nhidden=max(0,x*w1+b1)\nlogit=hidden*2\nprobability=1/(1+exp(-logit))"
                elif objective.startswith("NN02.O3"):
                    code = "weight=1.0\ngradient=0.2\neta=0.1\nupdated=weight-eta*gradient"
                elif objective.startswith("NN04.O3"):
                    code = "Pipeline([\n  ('scale', StandardScaler()),\n  ('model', MLPClassifier(random_state=1729))\n])"
                families.append({
                    "id": f"{objective}.{suffix}", "objective": objective, "critical": critical,
                    "prompt": f"{question} Context: {scenario}.", "code": code, "atoms": atoms, "accepted": accepted,
                    "explanation": answer,
                    "remediation": f"{objective}: {remediation} Rework the changed {scenario} case, then start a fresh complete independent form; attempts are not combined."
                })

DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(json.dumps({"content": CONTENT, "families": families}, separators=(",", ":")) + "\n")
print(f"wrote {len(families)} bounded objective instances to {DEST}")
