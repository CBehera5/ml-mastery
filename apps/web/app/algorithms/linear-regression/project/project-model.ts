import { featureScalingTrace, regressionEvaluationTrace, regressionTrainingTrace, transformFeatures } from "@mlmath/runtime";
import type { ConceptualExercise, ExerciseDefinition, NumericalExercise } from "../../../learn/foundation/exercises";
import { evaluateExercise } from "../../../learn/foundation/exercises";
import data from "../../../../public/data/linear-regression-housing-bridge.v1.json";
export const PROJECT_DATA=data;
export const PROJECT_ID="linear-regression.applied-bridge.v1";
export const PROJECT_LESSON_ID="linear-regression.project";
export const PROJECT_SESSION_KEY="ml-math-lab:project:linear-regression:bridge:v1";
export const STAGES=[
 {id:"define",title:"Define the problem",objective:"Identify the numeric target and information available before a sale.",explanation:"A fictional housing team wants a rough sale-price baseline, not a decision to buy or sell. Floor area and age are known before prediction. Price is the numeric target. Choose one or two features; location, condition and renovation quality remain unobserved."},
 {id:"explore",title:"Explore the data",objective:"Compare training observations and explain why area alone may miss variation.",explanation:"Each row is a different fictional property. Inspect H03 and H04: the larger home is older and has a slightly lower price. A relationship across several features is not a causal proof. Test targets are withheld here so early exploration stays focused on training data."},
 {id:"prepare",title:"Prepare the data",objective:"Keep held-out rows out of parameter fitting and preprocessing.",explanation:"The split is fixed: H01–H08 train; H09–H12 test. These distinct IDs simulate unseen properties, not a representative market sample. Standardize inputs using training means and population standard deviations, then reuse those statistics on test inputs. Never fit the scaler on all rows."},
 {id:"train",title:"Train the model",objective:"Inspect how gradient updates change parameters and training loss.",explanation:"Training runs the verified TypeScript regression runtime in this browser; it does not execute Python. It minimizes training MSE on standardized inputs. Iteration 0 is the initial state. Inspect a later state before judging progress. Subtracting a positive learning rate times the gradient moves locally downhill; excessive steps can increase loss or diverge."},
 {id:"evaluate",title:"Evaluate predictions",objective:"Interpret held-out metrics and identify unsupported predictions.",explanation:"MAE averages absolute residuals; MSE averages squared residuals; RMSE is the square root of MSE. Residual means prediction minus actual. MAE and RMSE are in ₹ lakh; MSE is in (₹ lakh)². Compare both splits and individual misses. Four constructed test examples cannot establish market accuracy or calibrated uncertainty."},
 {id:"explain",title:"Explain the result",objective:"Communicate the objective, features, measured errors and limitations in a defensible report.",explanation:"Use the actual evaluated run, not a hoped-for score. The structured fields below check your interpretation and generate a summary. They do not automatically grade prose or establish independent mastery. A plausible baseline can still be unsuitable for real pricing decisions."}
] as const;
export const PROJECT_OBJECTIVES=[`${PROJECT_LESSON_ID}.objective`,...STAGES.map(stage=>`${PROJECT_LESSON_ID}.${stage.id}`)];
export type FeatureMode="area"|"area-age";
export type ProjectConfig={mode:FeatureMode;weights:[number,number];bias:number;rate:number;iterations:number};
export const DEFAULT_CONFIG:ProjectConfig={mode:"area-age",weights:[0,0],bias:200,rate:0.05,iterations:100};
export type ProjectSession={version:1;config:ProjectConfig;inspected:string[];cursor:number;hasRun:boolean;evaluated:boolean;testExposed:boolean;answers:Record<string,string>};
export const emptySession=():ProjectSession=>({version:1,config:{...DEFAULT_CONFIG,weights:[0,0]},inspected:[],cursor:0,hasRun:false,evaluated:false,testExposed:false,answers:{}});
export const featureNames=(mode:FeatureMode)=>mode==="area"?["Floor area"]:["Floor area","Property age"];
export const trainingRows=PROJECT_DATA.rows.filter(row=>row.split==="train");
export const testRows=PROJECT_DATA.rows.filter(row=>row.split==="test");
export function projectInputs(rows:typeof trainingRows,mode:FeatureMode){return rows.map(row=>mode==="area"?[row.area]:[row.area,row.age])}
export function prepareProject(mode:FeatureMode){
 const scaling=featureScalingTrace(projectInputs(trainingRows,mode));
 return {scaling,trainingFeatures:scaling.scaled,testFeatures:transformFeatures(projectInputs(testRows,mode),scaling.mean,scaling.scale)};
}
export function runProject(config:ProjectConfig){
 const prepared=prepareProject(config.mode);
 const training=regressionTrainingTrace({features:prepared.trainingFeatures,targets:trainingRows.map(row=>row.price),weights:config.weights.slice(0,config.mode==="area"?1:2),bias:config.bias},config.rate,config.iterations);
 const last=training.entries.at(-1)!;
 const evaluable=training.status==="completed"&&last.loss!==null;
 const train=evaluable?regressionEvaluationTrace({features:prepared.trainingFeatures,targets:trainingRows.map(row=>row.price),weights:last.weights,bias:last.bias}):null;
 // Kept independent from fitting: test rows are passed only to evaluation.
 const test=evaluable?regressionEvaluationTrace({features:prepared.testFeatures,targets:testRows.map(row=>row.price),weights:last.weights,bias:last.bias}):null;
 const baseline=regressionEvaluationTrace({features:prepared.testFeatures,targets:testRows.map(row=>row.price),weights:last.weights.map(()=>0),bias:trainingRows.reduce((sum,row)=>sum+row.price,0)/trainingRows.length});
 return {prepared,training,train,test,baseline};
}
export const projectRunId=(config:ProjectConfig)=>`${PROJECT_DATA.version}:${config.mode}:w=${config.weights.join(",")}:b=${config.bias}:a=${config.rate}:n=${config.iterations}`;
export type ProjectRun=ReturnType<typeof runProject>;
function choice(key:string,prompt:string,labels:string[],expected:number,reason:string):ConceptualExercise {
 return {schemaVersion:"1.0.0",version:"1.0.0",id:`${PROJECT_LESSON_ID}.${key}`,objectiveIds:[`${PROJECT_LESSON_ID}.${key.split('-')[0]}`],kind:"conceptual",prompt,options:labels.map((label,index)=>({id:String(index),label})),expectedOptionId:String(expected),points:1,retry:{maxAttempts:100,variantIds:[]},feedback:{correct:reason,incorrect:`Review and retry: ${reason}`,exhausted:reason}};
}
function numeric(key:string,prompt:string,expected:number,reason:string):NumericalExercise {
 return {schemaVersion:"1.0.0",version:"1.0.0",id:`${PROJECT_LESSON_ID}.${key}`,objectiveIds:[`${PROJECT_LESSON_ID}.evaluate`],kind:"numerical",prompt,expected,absoluteTolerance:0.011,unit:"₹ lakh",points:1,retry:{maxAttempts:100,variantIds:[]},feedback:{correct:reason,incorrect:`Review and retry: ${reason}`,exhausted:reason}};
}
export function projectExercises(run:ProjectRun|null,mode:FeatureMode):ExerciseDefinition[][] {
 return [
 [choice("define-target","What are we trying to predict?",["A numeric sale price in ₹ lakh from pre-sale features","Whether a home belongs to an expensive category","The future price supplied as an input"],0,"Price is the numeric target. Inputs must be available at prediction time."),choice("define-kind","Why is this regression rather than classification?",["It predicts a number rather than choosing a category","It has exactly two inputs","All housing relationships are straight lines"],0,"The output type defines regression; feature count and real-world linearity do not.")],
 [choice("explore-pattern","What does the H03/H04 comparison support?",["The larger home must always cost more","Age and omitted factors can affect predictions; area alone is incomplete","Age has been proven to cause the entire price difference"],1,"H04 is larger and older but slightly cheaper. The comparison motivates multiple inputs without proving causality.")],
 [choice("prepare-leakage","A colleague fits the scaler on all 12 rows, then splits. What should change?",["Keep it: targets were not used","Split first and fit scaling only on H01–H08","Fit separate test statistics for a fair comparison"],1,"Preprocessing learns from the input distribution. Test statistics must stay out of the fitted workflow."),choice("prepare-reuse","How do we scale an unseen house?",["Refit the scaler on that house","Reuse the means and scales from training inputs","Use its known sale price as another feature"],1,"Use the same training-fitted coordinates. A new one-row scaler would not match the learned model.")],
 [choice("train-updates","What changed during this run?",["The runtime adjusted weights and bias to optimize training MSE; test rows did not fit them","The test targets were used to fix every residual","Python executed inside the page"],0,"The TypeScript runtime computes training gradients and updates parameters. Test outcomes do not enter those gradients.")],
 [numeric("evaluate-mae","Read the evaluated run: what is the test MAE in ₹ lakh (two decimals)?",run?.test?.metrics.mae??0,"Read the Test MAE value, not training MSE. MAE averages absolute prediction-minus-actual residuals."),choice("evaluate-limits","H12 has area 5.2; training areas span 1.0–3.8. What is defensible?",["A finite prediction guarantees accuracy","Flag extrapolation; inspect the held-out misses and seek representative data","A low training score is a reliable uncertainty interval"],1,"H12 is outside the observed training range. H11 also has a large constructed price adjustment absent from the inputs; neither limitation disappears because training error is low.")],
 [choice("explain-objective","Report: choose the model objective.",["Estimate a numeric fictional sale price from pre-sale information","Approve real mortgages automatically","Predict expensive versus affordable labels"],0,"The project builds an educational numerical baseline, not a real valuation or lending decision."),choice("explain-features","Report: which inputs did your evaluated run use?",["Floor area only","Floor area and property age","Sale price and property ID"],mode==="area"?0:1,`The current run uses ${featureNames(mode).join(" and ").toLowerCase()}. Price is the target; IDs only identify rows.`),choice("explain-results","Report: which evidence belongs in the evaluation summary?",["Only the lowest training score","Both splits' measured MAE/MSE/RMSE, individual misses and the four-row test-set limitation","A claim of real-market accuracy based on these invented rows"],1,"Report the actual run's train and held-out metrics with their units and tiny synthetic sample size."),choice("explain-limitations","Report: identify the important limits.",["No limits because the model is linear","Synthetic data, omitted factors, limited sample and range, and test reuse after experiments","The model proves age causes price"],1,"The constructed data omit information and include unsupported ranges. Repeated test inspection requires fresh held-out data for a final claim."),choice("explain-appropriateness","Report: is this model appropriate?",["Yes for learning and a provisional synthetic baseline; no evidence supports real pricing deployment","Yes for every property in every market","No numerical prediction can ever be useful"],0,"It is a useful learning baseline with explicit limits. A real deployment needs representative data and independent validation.")]
 ];
}
export function answerCorrect(exercise:ExerciseDefinition,answer:string|undefined){
 if(answer===undefined||answer.trim()==="")return false;
 return evaluateExercise(exercise,exercise.kind==="numerical"?{kind:"numerical",value:Number(answer)}:{kind:"conceptual",optionId:answer},1).correct;
}
export const usableTraining=(run:ProjectRun|null)=>Boolean(run?.training.status==="completed"&&run.train&&run.train.metrics.mse<(run.training.entries[0].loss??0));
export function completedStages(session:ProjectSession,run:ProjectRun|null){
 const exercises=projectExercises(run,session.config.mode),done:boolean[]=[];
 const conditions=[true,session.inspected.includes("H03")&&session.inspected.includes("H04"),true,session.hasRun&&session.cursor>0&&usableTraining(run),session.evaluated&&Boolean(run?.test),true];
 for(let index=0;index<6;index++)done.push(Boolean((index===0||done[index-1])&&conditions[index]&&exercises[index].every(check=>answerCorrect(check,session.answers[check.id]))));
 return done;
}
export function parseProjectSession(raw:string|null):ProjectSession {
 if(!raw)return emptySession();
 try{
  const value=JSON.parse(raw),config=value.config;
  const finite=(n:unknown,min:number,max:number)=>typeof n==="number"&&Number.isFinite(n)&&n>=min&&n<=max;
  const allowed=projectExercises(null,"area-age").flat().map(check=>check.id);
  if(value.version!==1||!config||!["area","area-age"].includes(config.mode)||!Array.isArray(config.weights)||config.weights.length!==2||!config.weights.every((n:unknown)=>finite(n,-100,100))||!finite(config.bias,0,400)||!finite(config.rate,0.001,2)||!Number.isInteger(config.iterations)||!finite(config.iterations,1,200)||!Number.isInteger(value.cursor)||!finite(value.cursor,0,200)||!Array.isArray(value.inspected)||value.inspected.length>8||!value.inspected.every((id:unknown)=>trainingRows.some(row=>row.id===id))||![value.hasRun,value.evaluated,value.testExposed].every(flag=>typeof flag==="boolean")||!value.answers||typeof value.answers!=="object"||Array.isArray(value.answers)||Object.keys(value.answers).length>20||!Object.entries(value.answers).every(([id,answer])=>allowed.includes(id)&&typeof answer==="string"&&answer.length<=120))return emptySession();
  if(value.cursor>config.iterations||(!value.hasRun&&(value.cursor!==0||value.evaluated))||(value.evaluated&&!value.testExposed))return emptySession();
  return {version:1,config:{mode:config.mode,weights:[...config.weights] as [number,number],bias:config.bias,rate:config.rate,iterations:config.iterations},inspected:[...new Set(value.inspected)] as string[],cursor:value.cursor,hasRun:value.hasRun,evaluated:value.evaluated,testExposed:value.testExposed,answers:{...value.answers}};
 }catch{return emptySession()}
}
export function projectSummary(session:ProjectSession,run:ProjectRun){
 const format=(value:number)=>value.toFixed(2);
 return ["# Fictional housing prediction — project summary",`Dataset: ${PROJECT_DATA.version}. ${PROJECT_DATA.provenance}`,"Objective: estimate a numeric fictional sale price (₹ lakh) from pre-sale information.",`Selected features: ${featureNames(session.config.mode).join(", ")}. Training-only standardization.`,"Fixed split: H01–H08 train (8); H09–H12 test (4).",`Training configuration: rate ${session.config.rate}, ${session.config.iterations} updates; initial standardized-feature weights ${session.config.weights.slice(0,session.config.mode==="area"?1:2).join(", ")}, initial bias ${session.config.bias}.`,`Final standardized-feature weights: ${run.training.entries.at(-1)!.weights.map(format).join(", ")}; bias: ${format(run.training.entries.at(-1)!.bias)} ₹ lakh.`,...([['Train',run.train],['Test',run.test]] as const).map(([label,trace])=>trace?`${label}: MAE ${format(trace.metrics.mae)} ₹ lakh; MSE ${format(trace.metrics.mse)} (₹ lakh)²; RMSE ${format(trace.metrics.rmse)} ₹ lakh.`:`${label}: no finite completed fit.`),`Training-mean baseline test MAE: ${format(run.baseline.metrics.mae)} ₹ lakh.`,run.test?`On these constructed test rows, this model has ${run.test.metrics.mae<run.baseline.metrics.mae?"lower":"equal or higher"} MAE than the training-mean baseline. This comparison is not deployment validation.`:"No completed finite model is available for comparison.","Limitations: synthetic and tiny sample; location and condition omitted; H11 includes an unobserved constructed adjustment; H12 is outside the training area range. Results are not real market valuations or causal effects.","Appropriateness: a provisional learning baseline, not validated for real pricing decisions. After viewing test outcomes, further model tuning needs fresh untouched data for final evaluation.","Completion records a guided project, not mastery. The reference notebook reproduces the default run; custom settings must be copied into its configuration cell."].join("\n\n");
}
