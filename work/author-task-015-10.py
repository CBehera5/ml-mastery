"""Emit initial SVM module patches from reviewed content and frozen fixtures."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "python"))
from mlmath.svm_reference import catalog

BASE = ROOT / "apps/web/app/supervised/random-forests"
DEST = "apps/web/app/supervised/svm/"
FILES = {}


def clone(name):
    return (BASE / name).read_text().replace("Random Forests", "Support Vector Machines").replace("RandomForests", "SVM").replace("random-forests", "svm").replace("RF0", "SV0").replace("RF-E", "SV-E").replace("rf-e", "sv-e")


for name in ["model.ts", "page.tsx", "[lesson]/page.tsx", "mastery/page.tsx"]:
    FILES[DEST + name] = clone(name)
FILES[DEST + "authored.json"] = json.dumps(catalog(), ensure_ascii=False, separators=(",", ":")) + "\n"

for lab in [1, 2]:
    source = json.loads((ROOT / f"docs/verification/support-vector-machines/sv-e{lab}.manifest.v1.json").read_text())
    fixtures = [{key: value for key, value in data.items() if key != "sealed_test"} for data in source["datasets"]]
    configs = [{"id": config["id"], "fixture": config.get("fixture_id", fixtures[0]["id"]), "controls": config.get("controls", {"diagnostic": config.get("reason")}), "prediction_question": config["prediction_question"], "expected": config, "reasonId": config["correct_reason_id"], "predictionOptions": config["prediction_options"], "reasonOptions": config["reason_options"], "why": config["explanation"] + " Counterexample:" + config["counterexample"]} for config in source["configurations"]]
    FILES[DEST + f"replay-e{lab}.json"] = json.dumps({"id": source["id"], "initial_configuration": configs[0]["id"], "fixtures": fixtures, "configurations": configs if lab == 1 else configs[:22], "validation_selection": source["validation_selection"]}, ensure_ascii=False, separators=(",", ":")) + "\n"
    if lab == 2:
        FILES[DEST + "replay-e2-extra.json"] = json.dumps(configs[22:], ensure_ascii=False, separators=(",", ":")) + "\n"

source = clone("catalog.ts")
start, end = source.index("import first from"), source.index("import { bounded")
source = source[:start] + 'import first from "./replay-e1.json";\nimport second from "./replay-e2.json";\nimport extra from "./replay-e2-extra.json";\nimport lock from "../../../../../docs/verification/support-vector-machines/freeze-lock.v1.json";\n' + source[end:]
start, end = source.index("export const LABS:"), source.index("export const configurations")
source = source[:start] + 'export const LABS: readonly Manifest[] = freeze([first,{...second,configurations:[...second.configurations,...extra]}] as unknown as Manifest[]);\nexport const SELECTIONS = freeze([...first.validation_selection,...second.validation_selection]);\n' + source[end:]
source = source.replace("config.prediction_options", "config.predictionOptions").replace("first.configurations[0].reason_options", "first.configurations[0].reasonOptions").replace("length === 41", "length === 15").replace("length === 33", "length === 43").replace("VERIFICATION_RELEASED = true", "VERIFICATION_RELEASED = false")
FILES[DEST + "catalog.ts"] = source

titles = ["Margin geometry", "Soft margins and C", "RBF locality", "Safe scaled workflow", "Limits and comparison"]
objectives = [
["Compute a linear decision score and distance", "Distinguish sign decision,margin and probability", "Identify support-vector influence in a frozen scene", "Explain feature-scale dependence"],
["Read hinge-loss/slack examples", "Explain C's trade-off without equating larger C with more regularization", "Predict sensitivity to an outlier", "Compare Logistic and linear SVM loss"],
["Calculate an RBF similarity", "Explain gamma's locality and distinguish kernel similarity from a new input column", "Compare linear/RBF boundaries", "Identify overfit small regions"],
["Trace scaler/SVC fitted rows", "Reject test-tuned C/gamma or globally scaled folds and explain why", "Repair predefined pipeline/grid slots", "Handle imbalance with explicit class-weight policy"],
["Compare classification errors and query costs", "Reject uncalibrated scores as probabilities or extrapolated reliability", "Explain kernel scaling/resource limits", "Compare KNN/Logistic/tree choices for a stated problem"]]
whys = [
"A churn team wants a rule that separates customer profiles without treating every small training perturbation as a new rule. Start with a line and the room around it,before discussing optimization. In more than two feature dimensions,the same idea is a separating hyperplane.",
"Real customer groups overlap and some observations are noisy. Requiring every point to lie perfectly on the correct side can let one awkward observation dominate. Soft margins allow violations while charging an explicit cost;C sets that compromise,not a probability threshold.",
"A single straight separator can miss a local nonlinear customer pattern. An RBF kernel measures pairwise similarity so a model can combine local influences. Nonlinearity changes representational flexibility,not the need for honest evaluation.",
"Changing a feature from index units to hundredths changes the geometry seen by SVM. A good-looking score is meaningless if scaling or parameter selection used held-out information. Trace which rows fit every learned step before accepting a model comparison.",
"A margin rule is useful only for the question,population and resource budget it was evaluated on. SVM is neither a calibrated-risk oracle nor a universally best classifier. Compare error types,costs and inference work on the same unseen observations."]
intuitions = [
"Draw two customer groups,then a line with a strip of space around it. Measure distance perpendicular to the line,not along an arbitrary coordinate axis. Ring solver-active support points,but do not assume every nearby point has a nonzero dual coefficient.",
"Imagine a wider corridor that may contain a few difficult observations versus a narrower corridor trying harder to avoid violations. Turn C only through the reviewed choices and inspect what actually changes. The diagram is evidence about this fit,not a universal monotonic law.",
"Think of each support observation as contributing a local similarity response. Gamma controls how quickly similarity falls with distance. The sampled prediction regions can bend even though no new observed column has been added to the input dataset.",
"Keep training,validation and sealed-test boxes visible. Move a scaler and estimator together inside each CV training box. A scaler learned once on the outer training set still saw inner validation rows;training-only once and fold-only every time are different permissions.",
"Place models on the same held-out row list and compare their mistakes,not differently scaled score rulers. Add a resource ruler:an RBF query needs similarities to supports;large training/kernel workloads can be expensive. High margin ranking is not calibrated risk or guaranteed behavior under shift."]
worked = [
"For w=(1,0),b=0,x=(2,3),F=w·x+b=2 and perpendicular distance F/||w||=2. If w becomes(2,0),F becomes4 but the distance remains2. At x=(.5,-.5),F=.5 and positive-label hinge is.5. A score2 cannot be probability2.",
"With y=+1,F=.5,hinge=max(0,1−yF)=.5:the class is correct but inside the canonical margin. At F=−.5,hinge1.5 and class is wrong. In frozen clean SV-E1,C.1 has canonical slab width4 with6 supports;C1 has width2 with2 solver-active supports.",
"At fitted-space distance1,gamma1 gives exp(−1)≈.367879;gamma4 gives exp(−4)≈.018316. On the same clean nonlinear fixture,C1/gamma1 raw-coordinate RBF has validation balanced accuracy.5;training-standardized RBF has1.0. The same-data standardized linear baseline gives.5.",
"Training feature values[0,2] have mean1. Including a validation value100 gives mean34:even without its label,global scaling used held-out information. With C=.5 and explicit positive-class weight3,the positive hinge penalty uses C_positive=1.5,not probability1.5.",
"For the same six balanced validation rows,three correct of six means accuracy.5;but with imbalance,balanced accuracy averages per-class recalls instead. In the frozen clean nonlinear data,linear.5 versus RBF1.0 is a local comparison,not a universal win. A score of2 or sigmoid(2) is not automatic calibrated risk."]
changed = [
"A manual w=(0,0) has no normal direction:geometric distance is undefined,not zero. For w=(1,1),point(.5,-.5) lies exactly on the illustrative boundary. The pinned fitted SVC maps score>=0 to class1;the manual scene says on-boundary,not an invented fitted class.",
"Add the frozen awkward training point at(2.5,0) with class0. C can alter violations,support membership and validation outcomes. Hard-margin constraints presume separability;finite large C is not a general hard-margin solver. Logistic log-loss differs from hinge:it stays positive at finite correctly signed scores.",
"Multiplying the second raw feature by100 can make unscaled RBF similarities underflow numerically to0. The theoretical exponential is still positive;the log similarity records the scale. Higher gamma is more local but can chase small regions or noise;perfect training labels do not prove generalization.",
"A globally fitted scaler is still invalid inside CV even if it used only the outer training set. Refit preprocessing and SVC on every fold's training IDs. Balanced class weights use current training-fold counts,never test/validation frequencies. Choose C/gamma using permitted development evidence,then freeze before final test.",
"An unfamiliar customer subgroup or a shifted documentation population may invalidate a broad reliability claim. Calibration needs separate evidence;support count and kernel work affect cost. A large margin cannot substitute for subgroup counts,appropriate metrics or shift checks."]
maths = [
"F(x)=w·x+b,where w is the normal vector,b the intercept and x the feature vector. Boundary F=0;signed distance F/||w||;unsigned distance |F|/||w||. For sign-encoded y in{−1,+1},functional margin=yF and geometric class margin=yF/||w||. Canonical F=±1 slab width=2/||w||,not the nearest observed point's distance. Manual lines are not fitted optima.",
"Soft-margin objective=.5||w||²+C*sum_i hinge_i,hinge_i=max(0,1−y_iF_i),with slack xi_i>=0 and y_iF_i>=1−xi_i. Larger C charges violations more relative to the norm term;it is not stronger norm regularization. Supports have nonzero dual coefficients;soft-margin supports may be inside the margin or misclassified. Degenerate on-margin rows can have zero coefficient.",
"K(x,z)=exp(−gamma*||x−z||²) uses declared fitted-space coordinates. Positive gamma sets locality. The decision function combines support similarities with signed coefficients and an intercept;it is neither a raw input-space line distance nor a probability. Kernel similarity is computed,not a new measured feature column. No RKHS proof is required to compare exact query outputs.",
"StandardScaler uses means and population variances learned on current training IDs;constant columns have scale1. Weighted SVC uses C_i=C*class_weight[y_i]. Balanced weights n_train/(number_of_classes*n_class) use current training counts. Fit whole preprocessing/model pipelines within each CV fold;use development metrics for C/gamma,never final-test feedback.",
"For positive class1,balanced accuracy=(recall0+recall1)/2. Scores,labels,probability calibration and error costs are distinct. RBF inference sums kernels to supports;large kernel optimization/storage can be costly. Compare matching rows,targets and metrics and disclose finite data,numerical near-boundary sensitivity,resources and shift limits."]
codes = [
"from sklearn.svm import SVC\nmodel = SVC(kernel='linear', C=1., probability=False, shrinking=False, tol=1e-6, max_iter=200000, random_state=1729)\nmodel.fit(X_train,y_train)\nscore = model.decision_function(X_validation)\nclasses = model.predict(X_validation)\nsupport_ids = train_ids[model.support_]",
"import numpy as np\nscore = linear_model.decision_function(X_train)\nsigned_target = 2*y_train-1\nhinge = np.maximum(0,1-signed_target*score)\nprint(hinge)",
"from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nmodel = make_pipeline(StandardScaler(), SVC(kernel='rbf', C=1., gamma=1., probability=False, shrinking=False, tol=1e-6, max_iter=200000))\nmodel.fit(X_train,y_train)\nscore = model.decision_function(X_validation)",
"from sklearn.model_selection import GridSearchCV, StratifiedKFold\nfolds = StratifiedKFold(n_splits=3, shuffle=True, random_state=1729)\nsearch = GridSearchCV(model, {'svc__C':[.1,1.,10.], 'svc__gamma':[.1,1.,4.]}, cv=folds, scoring='balanced_accuracy')\nsearch.fit(X_development,y_development)\nchosen_pipeline = search.best_estimator_",
"from sklearn.metrics import balanced_accuracy_score, confusion_matrix\nclasses = model.predict(X_validation)\nscore = balanced_accuracy_score(y_validation,classes)\nerrors = confusion_matrix(y_validation,classes,labels=[0,1])\nprint(score,errors)"]
comparisons = [
"Recall vectors/dot products and Logistic decision scores. A line in two dimensions becomes a hyperplane in more dimensions. Probability calibration is not supplied by SVC(probability=False). A manual boundary move demonstrates geometry,not refitting.",
"Compare Logistic smooth log-loss,KNN distance sensitivity and the fixed SVM C trade-off. More exact training fit can hurt robustness. These examples use the named C-SVC objective,not a hidden mean-loss convention or a new hard-margin algorithm.",
"Compare linear and RBF on the same available features and validation rows. The diagram uses25 reviewed query samples,not an exact continuous contour or an unapproved21×21 mesh. Neither nonlinear flexibility nor scaling guarantees every model wins on future data.",
"Recall Python Data Preparation fold-only pipelines,NumPy shapes and pandas alignment. The app replays frozen full train/validation fits;the notebook separately demonstrates fold-only refits. A notebook run is not mastery and a pipeline name alone is not proof of valid evaluation.",
"Connect churn classification and future Good/Needs Improvement Documentation Quality labels to evaluation assumptions. House prices are regression:SVR is not implemented here. Compare Logistic,KNN and trees contextually;no new algorithms,production data or capstones are added."]
from mlmath.svm_reference import case
lessons = [{"slug": f"sv0{index+1}", "title": titles[index], "lab": 0 if index in [0,1,4] else 1, "why": whys[index], "intuition": intuitions[index], "worked": worked[index], "changed": changed[index], "math": maths[index], "python": codes[index], "comparison": comparisons[index], "objectives": objectives[index], "notes": [case(index+1, objective+1, 0)[4] for objective in range(4)], "transfer": f"{objectives[index][1]}. Name the actual geometry/output type and training/validation permissions;do not infer calibrated or universal reliability."} for index in range(5)]
FILES[DEST + "teaching.ts"] = "export const LESSONS = " + json.dumps(lessons, ensure_ascii=False, indent=2) + " as const;\n"

source = clone("learning.tsx")
start, end = source.index("function TreeGraphic"), source.index("export function Lab")
source = source[:start] + 'import { Graphic } from "./graphic";\n' + source[end:]
source = source.replace("Five lessons connect bootstrap diversity, numeric means, probability aggregation, OOB limitations and honest importance comparisons. Classification probabilities and regression targets remain distinct.", "Five lessons connect margin geometry,soft-margin C,RBF locality,training-only scaling and honest classification comparison. Decision scores are not calibrated probabilities.")
source = source.replace("Bootstrap prices,diversity and OOB", "Linear margins and soft-margin behavior").replace("Probability aggregation and importance", "RBF kernels and scaling").replace("Exactly41 SV-E1 or33 SV-E2", "Exactly15 SV-E1 and43 SV-E2")
source = source.replace('<Link href="/supervised/decision-trees">Decision Trees</Link>', '<Link href="/supervised/logistic">Logistic scores</Link> · <Link href="/math/vectors-dot-product">Vectors and norms</Link> · <Link href="/supervised/decision-trees">Decision Trees</Link>')
FILES[DEST + "learning.tsx"] = source

source = clone("model.test.ts")
start, end = source.index('it("preserves exactly62'), source.index('const correct =')
source = source[:start] + source[end:]
source = source.replace('"causal"', '"probability"').replace("toHaveLength(41)", "toHaveLength(15)").replace("toHaveLength(33)", "toHaveLength(43)").replace("verification/svm/", "verification/support-vector-machines/").replace('item.expected.tag === "rejected"', 'item.expected.kind === "rejected"').replace("at 15/20", "at19/20")
FILES[DEST + "model.test.ts"] = source

source = clone("learning.test.tsx")
source = source.replace('"causal"', '"probability"')
start, end = source.index('it("restores mean practice'), source.index('for(const lab')
source = source[:start] + source[start:end].replace("restores mean", "restores geometry").replace("await open(1)", "await open(0)").replace("SV02.O1", "SV01.O1").replace('practice.getByRole("spinbutton")','practice.getAllByRole("spinbutton")[0]').replace("PRACTICE[0][4]", "PRACTICE[0][0]").replace('fireEvent.click(practice.getByRole("button",{name:"Check SV01.O1"}));', 'fireEvent.change(practice.getAllByRole("spinbutton")[1],{target:{value:String((PRACTICE[0][0].accepted[0][1] as {value:number}).value)}});fireEvent.click(practice.getByRole("button",{name:"Check SV01.O1"}));') + source[end:]
start = source.index(' expect(screen.getByRole("table",{name:"First-query')
end = source.index(' fireEvent.change(screen.getByRole("combobox",{name:"Supported explanation"})', start)
source = source[:start] + ' expect(screen.getByRole("table",{name:"Validation decision scores and classes"})).toBeInTheDocument();expect(screen.getByRole("table",{name:"Training supports and hinge violations"})).toBeInTheDocument();\n' + source[end:]
FILES[DEST + "learning.test.tsx"] = source

print("*** Begin Patch")
for name, content in FILES.items():
    if len(sys.argv)>1 and not name.endswith(sys.argv[1]):
        continue
    print("*** Add File: " + str(ROOT / name))
    print("\n".join("+" + line for line in content.splitlines()))
print("*** End Patch")
