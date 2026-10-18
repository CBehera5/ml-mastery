"""Emit a reviewed GB application patch using established module patterns."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "python"))
from mlmath.gradient_boosting_reference import catalog

BASE = ROOT / "apps/web/app/supervised/random-forests"
DEST = "apps/web/app/supervised/gradient-boosting/"
FILES = {}


def clone(name):
    return (BASE / name).read_text().replace("Random Forests", "Gradient Boosting").replace("RandomForests", "GradientBoosting").replace("random-forests", "gradient-boosting").replace("RF0", "GB0").replace("RF-E", "GB-E").replace("rf-e", "gb-e")


for name in ["model.ts", "page.tsx", "[lesson]/page.tsx", "mastery/page.tsx"]:
    source = clone(name)
    if name == "model.ts":
        source = source.replace("!== 20", "!== 24").replace("!== 5", "!== 6").replace("count >= 16", "count >= 20")
    FILES[DEST + name] = source
FILES[DEST + "authored.json"] = json.dumps(catalog(), ensure_ascii=False, separators=(",", ":")) + "\n"

replay = []
for filename in ["gb-e1", "gb-e2"]:
    manifest = json.loads((ROOT / f"docs/verification/gradient-boosting/{filename}.manifest.v1.json").read_text())
    fixtures = [{key: value for key, value in data.items() if key != "sealed_test"} for data in manifest["datasets"]]
    configs = []
    for config in manifest["configurations"]:
        if config.get("status") == "rejected":
            fixture = fixtures[0]["id"]
            controls = {"diagnostic": config["reason"]}
            expected = config
            why = config["explanation"]
        else:
            run = next(run for run in manifest["runs"] if run["id"] == config["run_id"])
            fixture = run["id"].split(".eta-")[0]
            controls = {"learning_rate": run["learning_rate"], "estimator_budget": config["estimator_budget"]}
            expected = config
            why = config["explanation"]
        configs.append({"id": config["id"], "fixture": fixture, "controls": controls, "expected": expected, "prediction_question": "Will validation choose the last allowed stage,an earlier stage,or reject this configuration? Predict before observing the trace.", "reasonId": "mechanism", "predictionOptions": [{"id": "last", "label": "The last allowed stage minimizes validation loss"}, {"id": "earlier", "label": "An earlier stage has the preferred validation loss"}, {"id": "reject", "label": "Reject:the boundary or estimator budget is unsupported"}], "reasonOptions": [{"id": "mechanism", "label": "Training fits the sequence;validation selects a permitted prefix;test cannot guide development. Invalid boundaries reject."}, {"id": "score", "label": "Lowest training loss guarantees the last stage generalizes best"}, {"id": "causal", "label": "Use test feedback or validation targets to fit the next stage"}], "why": why})
    replay.append({"id": manifest["id"], "initial_configuration": configs[0]["id"], "fixtures": fixtures, "runs": manifest["runs"], "configurations": configs})
FILES[DEST + "replay.json"] = json.dumps(replay, ensure_ascii=False, separators=(",", ":")) + "\n"

source = clone("catalog.ts")
start = source.index('import first from')
end = source.index('import { bounded', start)
source = source[:start] + 'import replay from "./replay.json";\nimport lock from "../../../../../docs/verification/gradient-boosting/freeze-lock.v1.json";\n' + source[end:]
source = source.replace("freeze(authored); freeze(first); freeze(second);", "freeze(authored); freeze(replay);").replace("length: 20", "length: 24").replace("length === 100", "length === 120").replace("length === 20", "length === 24").replace("length !== 20", "length !== 24").replace("correct >= 16", "correct >= 20").replace("length === 41", "length === 27").replace("length === 33", "length === 27").replace("VERIFICATION_RELEASED = true", "VERIFICATION_RELEASED = false")
start = source.index("export const LABS:")
end = source.index("export const configurations", start)
source = source[:start] + '''export const LABS: readonly Manifest[] = freeze(replay.map(manifest => ({...manifest, configurations: manifest.configurations.map(config => {
  const state = config.expected as Record<string, unknown>;
  if (state.status === "rejected") return config;
  const run = manifest.runs.find(item => item.id === state.run_id)!;
  return {...config, expected: {...run,...state,stages:run.stages.slice(0,Number(state.estimator_budget))}};
})})) as unknown as Manifest[]);
''' + source[end:]
source = source.replace("[...first.configurations, ...second.configurations]", "LABS.flatMap(lab => lab.configurations)").replace("config.prediction_options", "config.predictionOptions").replace("first.configurations[0].reason_options", "LABS[0].configurations[0].reasonOptions")
FILES[DEST + "catalog.ts"] = source

names = ["Sequential correction", "Squared-error regression", "Classification loss", "Stage count and stopping", "Workflow and leakage", "Compare and diagnose"]
objectives = [
["Trace an additive model by stage", "Distinguish sequential loss correction from independent tree averaging", "Explain learning rate and base-learner complexity", "Identify which rows fit each stage"],
["Compute residuals and an update", "Explain negative gradients for squared loss and predict a corrected value", "Calculate changed training loss", "Recognize outlier sensitivity"],
["Compute sigmoid and a supplied log-loss gradient", "Explain why classification updates logit/loss gradients,not raw class-label residual regression", "Convert updated scores to probabilities", "Distinguish score,probability and label"],
["Read fixed stage train/development curves", "Choose stopping on permitted development data without touching final test", "Compare rate×stage trade-offs", "Identify an overfit tail"],
["Reconstruct preprocessing/fit order", "Reject cross-fold/global preparation or test-based stopping and explain leakage", "Repair bounded regression/classification pipelines", "Select task-appropriate loss/metric"],
["Compare forest/boosting residual and confusion evidence", "Reject causal/guaranteed-best claims and identify sensitive/noisy targets", "Explain feature importance limitations", "Report fit cost,calibration and shift caveats"]]
whys = [
"A house-price model still misses systematic patterns after its first estimate. Rather than replacing it or independently averaging new trees,we add a small learner that targets what the current model still gets wrong. This sequential dependence is the core of boosting.",
"House-price errors have direction and magnitude. For squared-error regression,the loss gradient tells us to correct the current residual. A weak tree groups similar houses and supplies a local average correction;it does not memorize a separate perfect correction for every house.",
"Churn needs probabilities for discrete outcomes. A price-style update applied directly to labels can leave the probability domain or confuse scores with risks. Binary boosting instead adds corrections to an unbounded raw score and converts that score through sigmoid.",
"A model can keep improving its training fit while learning noise. Development data helps decide how far to continue before any final test is opened. The stage-count decision is model selection,not final evaluation.",
"A sophisticated ensemble can still produce meaningless evaluation when information crosses partitions. Every learned transformation and every stage needs an explicit permission boundary;calling a sequence a pipeline is not sufficient evidence of safety.",
"Choosing a model is a claim about a task,population and cost,not a leaderboard identity. Boosting can correct complex patterns but also chase noisy labels. Honest comparison keeps rows,metrics and uncertainty aligned and explains limitations."]
intuitions = [
"Imagine a first map of prices plus a stack of transparent correction maps. Each new map is drawn from the errors remaining beneath it. A forest instead combines independently drawn maps;copying one map cannot reproduce the sequential targets.",
"Draw a vertical arrow from each prediction to its actual price. Positive arrows ask the model to rise;negative arrows ask it to fall. A shallow tree can draw only a few regional corrections. Shrinkage follows part of each arrow,then recomputes the remaining arrows.",
"Use a score ruler with no endpoints and a probability ruler bounded by0 and1. Move the score first,then read its sigmoid probability. The gradient is a suggestion in score space;the fitted leaf applies a separate curvature-aware adjustment.",
"Two curves travel along the stage axis. Training may fall steadily;validation can turn upward. Mark the lowest permitted validation point,not the end of the curve. A smaller step follows a different trajectory because later targets change.",
"Draw boxes for training,validation and sealed test IDs. A fitted imputer,scaler,feature selector or booster may learn only inside its current training box. Within cross-validation,each fold redraws that box;training-only once is not fold-only every time.",
"Compare two maps on the same held-out houses or customers. Mark errors by subgroup and noise,then add a cost ruler. A feature-importance bar describes the fitted model's use of information;it is not an arrow showing what would happen under an intervention."]
worked = [
"With F0=3,eta=.1 and supplied tree h1=2,F1=3+.1×2=3.2. If the target is5,the residual changes from2 to1.8. A second supplied leaf h2=1 givesF2=3.3. Averaging3,2 and1 would be a different operation.",
"For y=5,F=3,residual2,a supplied leaf2 and eta.1 giveFnew3.2. Squared error changes4→3.24;half-squared loss2→1.62. For a leaf with residuals[2,4],mean correction3—not every row's residual—is the unscaled leaf prediction.",
"At y=1,F=0,p=.5,the negative score gradient is.5. For an illustrative single-row leaf,the Newton denominator p(1−p)=.25,so leaf correction=.5/.25=2. With eta.1,Fnew=.2,pnew≈.549834. Do not replace this leaf with gradient.5. A supplied one-point gradient step is not the full classifier fitting algorithm.",
"Frozen noisy regression eta.5 has validation MSE.800318 at stage4 versus1.228202 at stage8,so budget8 selects4. Frozen noisy classification eta.5 selects4 with log-loss.248271 versus.283391 at8,even though validation accuracy is1 at every stage. Probability quality and correct labels are different.",
"With training values[0,2] and validation[100],training mean1 differs from global mean34. A global learned transform can leak distribution information without using validation labels. In two CV folds,fit a new transform on each fold's training IDs;never reuse the outer fitted transform inside validation folds.",
"On the same held-out prices,forest predictions[4,6] and booster[5,7] against actual[5,8] yield MAEs1.5 and.5. This observed win is not universal. In frozen noisy churn,stage4 and8 can both have accuracy1 while their log-loss differs,so inspect probability quality too."]
changed = [
"Change h to−2:3+.1×(−2)=2.8. The sign follows the current training loss,not a rule that boosting always increases predictions. Change eta and the later training targets also change.",
"A residual20 contributes400 squared error versus4 for residual2. Chasing an anomalous sale can dominate training improvement and hurt validation. The noisy frozen fixture demonstrates a real overfit tail.",
"If F=0,p=.5,our explicit p>=.5 action is1,but sklearn predict uses score>0 and chooses0 at equality. If y=0 instead,the negative gradient is−.5 and the Newton correction has negative sign. Do not grade rounded probabilities.",
"Validation losses[.8,.8,.9] select the earliest tied stage. The exact policy is earliest within1e−12 of the minimum. A test curve that prefers another stage is not permission to change the development choice.",
"A transformation fitted only on the outer training set is still leaked if reused inside CV:each inner validation row influenced it. Put learned steps inside the estimator evaluated on each fold. Simple trees do not require scaling,but any fitted scaling still obeys these boundaries.",
"A high-cardinality or correlated feature may gain importance without a causal effect. A tiny subgroup or new distribution can invalidate a broad reliability claim despite a strong aggregate score. More stages also cost fitting time and inference work."]
maths = [
"F_m(x)=F_(m−1)(x)+eta*h_m(x). F is current prediction/raw score,m the stage,eta the learning rate,h_m the fitted weak learner. Its target depends on the loss derivative evaluated at F_(m−1),not on validation/test labels. Forest aggregation instead takes a mean of independently fitted predictions/probability vectors.",
"For L=(y−F)^2/2,−dL/dF=y−F. A squared-error leaf predicts the mean of assigned training residuals. MSE=sum(y−F)^2/n is twice mean half-squared loss and is in squared target units. An error-reducing training update is not proof of lower unseen error.",
"p=sigmoid(F)=1/(1+exp(−F));binary log-loss L=log(1+exp(F))−yF has negative score gradient y−p. Binary sklearn leaf update gamma=sum(y−p)/sum(p(1−p));Fnew=F+eta*gamma for rows in that leaf. Init is training-prior log odds,not always0. Extreme-score loss uses stable logaddexp;mathematical wrong-certain predictions have infinite loss,not an invented zero.",
"For stagesm=1…budget,compute validation MSE or mean binary log-loss. Choose earliest stage within absolute1e−12 of the minimum. Stage0 is displayed but not a candidate. Internal n_iter_no_change=None disables library early stopping. Eta×stage count is not a sufficient description of the sequence.",
"Fit permissions are sets of row IDs,not just method names. Training initialization,gradient targets and tree fitting use training IDs. Validation compares trained stages. In CV,learn every preparation step separately on fold-training IDs,then transform/predict fold-validation. Freeze selected settings before untouched test evaluation.",
"MAE=mean|y−prediction|;classification confusion depends on the declared positive class and threshold,while log-loss uses probabilities. Importance summarizes fitted split reductions and depends on correlations and split opportunities. Compare like-for-like held-out rows and report sample sizes,calibration,shift,latency and uncertainty."]
codes = [
"from sklearn.ensemble import GradientBoostingRegressor\nmodel = GradientBoostingRegressor(loss='squared_error', learning_rate=.1, n_estimators=8, max_depth=1, min_samples_leaf=2, random_state=1729, n_iter_no_change=None)\nmodel.fit(X_train,y_train)\nfor prediction in model.staged_predict(X_validation):\n    print(prediction)",
"import numpy as np\nfrom sklearn.metrics import mean_squared_error\nresidual = y_train - current_prediction\nsupplied_update = current_prediction + .1 * leaf_prediction\nmse = mean_squared_error(y_train,supplied_update)",
"from sklearn.ensemble import GradientBoostingClassifier\nmodel = GradientBoostingClassifier(loss='log_loss', learning_rate=.1, n_estimators=8, max_depth=1, min_samples_leaf=2, random_state=1729, n_iter_no_change=None)\nmodel.fit(X_train,y_train)\nscore = model.decision_function(X_validation)\nprobability = model.predict_proba(X_validation)[:,1]\naction = (probability >= .5).astype(int)",
"from sklearn.metrics import mean_squared_error\nlosses = [mean_squared_error(y_validation,p) for p in model.staged_predict(X_validation)]\nminimum = min(losses)\nstage = next(i+1 for i,loss in enumerate(losses) if abs(loss-minimum) <= 1e-12)\n# Classification uses log_loss on staged_predict_proba instead.",
"from sklearn.pipeline import make_pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.ensemble import GradientBoostingRegressor\nfrom sklearn.model_selection import cross_val_score\nworkflow = make_pipeline(SimpleImputer(), GradientBoostingRegressor(random_state=1729, n_iter_no_change=None))\nscores = cross_val_score(workflow, X_development, y_development, cv=3, scoring='neg_mean_squared_error')",
"from sklearn.metrics import mean_absolute_error, log_loss\nforest_mae = mean_absolute_error(y_validation,forest_prediction)\nboost_mae = mean_absolute_error(y_validation,boost_prediction)\nprobability_loss = log_loss(churn_validation,churn_probability,labels=[0,1])"]
comparisons = ["Recall DT weak learners,RF bagging and EV information boundaries. Housing,customer churn and future Documentation Quality classification have different targets but can share the sequential loss-correction idea.", "Compare existing Linear/Polynomial Regression and forests on the same held-out houses. Squared loss is sensitive to noisy sales;regularization/shrinkage and validation manage complexity,not a guarantee.", "Recall Logistic Regression's sigmoid and EV log-loss. Forests average per-tree probability vectors;boosting adds score corrections before sigmoid. Good versus Needs Improvement would need approved human labels,not LLM ground truth.", "Compare forests and boosting under matched splits,not tree-count alone. The forest baseline is illustrative,not tuned-cost-matched. Development wins have selection uncertainty;final test is not another tuning curve.", "Recall Data Preparation's fold-only pipelines,pandas row alignment and unseen evaluation. Pipeline syntax can prevent accidental global fitting only when the evaluation actually refits that pipeline per fold.", "Connect model comparison to all three planned projects:house-price residuals,churn cost/probabilities,documentation label/provenance quality. No capstones,production data collection or later algorithms are implemented here."]
lessons = []
for index in range(6):
    lessons.append({"slug": f"gb0{index+1}", "title": names[index], "lab": 1 if index in [2,4] else 0, "why": whys[index], "intuition": intuitions[index], "worked": worked[index], "changed": changed[index], "math": maths[index], "python": codes[index].replace("\n# Classification uses log_loss on staged_predict_proba instead.", ""), "comparison": comparisons[index], "objectives": objectives[index], "notes": [case_explanation for case_explanation in [__import__('mlmath.gradient_boosting_reference', fromlist=['case']).case(index+1, offset+1, 0)[4] for offset in range(4)]], "transfer": f"{objectives[index][1]}. Trace actual quantities and allowed row IDs;reject training-score,universal-winner or test-feedback shortcuts."})
FILES[DEST + "teaching.ts"] = "export const LESSONS = " + json.dumps(lessons, ensure_ascii=False, indent=2) + " as const;\n"

source = clone("learning.tsx")
start = source.index("function TreeGraphic")
end = source.index("export function Lab", start)
source = source[:start] + '''function Graphic({ config }: { config: Config }) {
  type Stage = { stage:number; training_loss:number;validation_loss:number;before_training_score:number[];negative_gradient:number[];unscaled_training_tree_contribution:number[];scaled_training_update:number[];training_score:number[];validation_score:number[];validation_probability?:number[];validation_labels?:number[];validation_accuracy?:number;validation_confusion?:unknown;leaf_checks:unknown;root_split_check:unknown };
  const expected = config.expected;
  if (expected.status === "rejected") return <><h4>Rejected configuration — not a numeric prediction</h4><p>{String(expected.reason)}. No fit or invented loss is performed.</p><Values value={expected.outcome} label="Invalid outcome"/></>;
  const stages = expected.stages as Stage[], selected=Number(expected.selected_stage);
  const maximum=Math.max(1,...stages.flatMap(stage=>[stage.training_loss,stage.validation_loss]));
  const path=(key:"training_loss"|"validation_loss")=>stages.map((stage,index)=>`${index ? "L" : "M"}${30+index*45},${160-140*stage[key]/maximum}`).join(" ");
  return <><h4>Sequential corrections and validation selection</h4><p>Initial score/prediction:{String(expected.initial_score)}. Learning rate:{String(expected.learning_rate)}. Budget:{stages.length}. Selected stage:{selected};validation loss:{Number(expected.selected_validation_loss).toPrecision(7)}. Only training rows fit;test data is neither displayed nor evaluated.</p><svg viewBox="0 0 400 190" aria-hidden="true" style={{width:"100%"}}><path d={path("training_loss")} fill="none" stroke="currentColor"/><path d={path("validation_loss")} fill="none" stroke="currentColor" strokeDasharray="6 4"/><text x="20" y="185" fill="currentColor">Stage →;solid training,dashed validation;lower loss is better</text></svg><div tabIndex={0} role="region" aria-label="Stage loss numerical alternative" style={{overflowX:"auto"}}><table style={{minWidth:"460px"}}><caption>Training and validation loss by stage</caption><thead><tr><th>Stage</th><th>Training loss</th><th>Validation loss</th><th>Selection</th></tr></thead><tbody>{stages.map(stage=><tr key={stage.stage}><th>{stage.stage}</th><td>{stage.training_loss.toPrecision(7)}</td><td>{stage.validation_loss.toPrecision(7)}</td><td>{stage.stage===selected ? "Preferred by validation" : "Not selected"}</td></tr>)}</tbody></table></div><p>Regression loss is MSE;classification loss is mean binary log-loss. More stages need not improve validation. Classification leaf corrections are Newton-adjusted raw scores,not probabilities or merely y−p.</p>{stages.map(stage=><details key={stage.stage}><summary>Stage{stage.stage}:read gradients,leaf corrections and updates</summary><div tabIndex={0} role="region" aria-label={`Stage${stage.stage} update alternative`} style={{overflowX:"auto"}}><table style={{minWidth:"620px"}}><caption>Training rows:before → gradient → tree → scaled update → after</caption><thead><tr><th>Row</th><th>Before</th><th>Negative gradient</th><th>Tree correction</th><th>Eta×tree</th><th>After</th></tr></thead><tbody>{stage.training_score.map((value,index)=><tr key={index}><th>{index}</th><td>{stage.before_training_score[index].toPrecision(6)}</td><td>{stage.negative_gradient[index].toPrecision(6)}</td><td>{stage.unscaled_training_tree_contribution[index].toPrecision(6)}</td><td>{stage.scaled_training_update[index].toPrecision(6)}</td><td>{value.toPrecision(6)}</td></tr>)}</tbody></table></div><Values value={{validation_score:stage.validation_score,...(stage.validation_probability ? {probability:stage.validation_probability,labels:stage.validation_labels,accuracy:stage.validation_accuracy,confusion:stage.validation_confusion} : {}),leaf_memberships:stage.leaf_checks,split:stage.root_split_check}} label="Exact validation and leaf evidence"/></details>)}<details><summary>Compare the fixed forest baseline,not a universal winner</summary><Values value={expected.bagging_comparison} label="Independent averaging baseline"/></details></>;
}
''' + source[end:]
source = source.replace("Five lessons connect bootstrap diversity, numeric means, probability aggregation, OOB limitations and honest importance comparisons. Classification probabilities and regression targets remain distinct.", "Six lessons connect sequential correction,regression residuals,classification gradients,validation stopping,leakage-safe workflows and honest model comparison.")
source = source.replace("16/20", "20/24").replace("all five", "all six").replace("20 objectives; at least16", "24 objectives; at least20").replace("all20 answers", "all24 answers").replace("/20", "/24").replace("lesson < 4", "lesson < 5")
source = source.replace("Bootstrap prices,diversity and OOB", "Sequential regression correction").replace("Probability aggregation and importance", "Classification gradients and validation").replace("Exactly41 GB-E1 or33 GB-E2", "Exactly27 GB-E1 and27 GB-E2")
source = source.replace('type Config }', 'type Config }')
source = source.replace('config.reasonId}}', 'config.reasonId}}')
FILES[DEST + "learning.tsx"] = source

source = clone("model.test.ts")
start = source.index('it("preserves exactly62')
end = source.index('const correct =', start)
source = source[:start] + source[end:]
source = source.replace("toHaveLength(40)", "toHaveLength(48)").replace("toHaveLength(60)", "toHaveLength(72)").replace("toHaveLength(5)", "toHaveLength(6)").replace("toHaveLength(41)", "toHaveLength(27)").replace("toHaveLength(33)", "toHaveLength(27)").replace("toBeGreaterThan(3)", "toBeGreaterThan(2)").replace("[15, 16]", "[19, 20]").replace("20 - count", "24 - count").replace("count === 16", "count === 20").replace("score: 19", "score: 23").replace("at 15/20", "at23/24").replace("${count}/20", "${count}/24").replace('item.expected.tag === "rejected"', 'item.expected.status === "rejected"')
FILES[DEST + "model.test.ts"] = source
source = clone("learning.test.tsx").replace("lesson<5", "lesson<6").replace("16\\/20", "20\\/24").replace("20 objectives; at least16", "24 objectives; at least20")
start = source.index('it("restores mean practice')
end = source.index('for(const lab', start)
source = source[:start] + source[start:end].replace("restores mean", "restores residual").replace("await open(1)", "await open(0)").replace("GB02.O1", "GB01.O1").replace("PRACTICE[0][4]", "PRACTICE[0][0]") + source[end:]
start = source.index(' expect(screen.getByRole("table",{name:"First-query')
end = source.index(' fireEvent.change(screen.getByRole("combobox",{name:"Supported explanation"})',start)
source = source[:start] + ' expect(screen.getByRole("table",{name:"Training and validation loss by stage"})).toBeInTheDocument();expect(screen.getByText(/test data is neither displayed nor evaluated/)).toBeInTheDocument();\n' + source[end:]
FILES[DEST + "learning.test.tsx"] = source

print("*** Begin Patch")
for path, content in FILES.items():
    if len(sys.argv) > 1 and not path.endswith(sys.argv[1]):
        continue
    print("*** Add File: " + str(ROOT / path))
    for line in content.splitlines():
        print("+" + line)
print("*** End Patch")
