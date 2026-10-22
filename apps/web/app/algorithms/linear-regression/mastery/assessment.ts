import { predictOne, regressionEvaluationTrace, regressionGradientTrace, regressionMetrics, regressionUpdateTrace } from "@mlmath/runtime";
import { evaluateExercise, type ConceptualExercise, type ConstrainedCodeExercise, type ExerciseDefinition, type LearnerResponse, type NumericalExercise, type ParameterPredictionExercise } from "../../../learn/foundation/exercises";
import { awardMastery, markLessonState, recordAssessmentAttempt, recordObjectiveCompletion, type LearningEvidenceV1 } from "../../../learn/foundation/evidence";
import blueprint from "./blueprint.v1.json";
export const BLUEPRINT=blueprint;
export const ASSESSMENT_ID=BLUEPRINT.assessmentId;
export const MASTERY_LESSON_ID="linear-regression.mastery";
export const AGGREGATE_OBJECTIVE="linear-regression.mastery.objective";
export const MASTERY_DRAFT_KEY="ml-math-lab:assessment:linear-regression:mastery:v1";
export const MASTERY_OBJECTIVES=[AGGREGATE_OBJECTIVE,...BLUEPRINT.questions.map(q=>q.objectiveId)];
export type Question=typeof BLUEPRINT.questions[number]&{exercise:ExerciseDefinition};
export type Responses=Record<string,LearnerResponse>;
const variants=BLUEPRINT.variantIds;
export function nextVariant(id:string){const index=variants.indexOf(id);return variants[(index+1)%variants.length]}
function base(key:string,variant:string,prompt:string,reason:string){return {schemaVersion:"1.0.0" as const,id:`${ASSESSMENT_ID}.${variant}.${key}`,version:BLUEPRINT.assessmentVersion,objectiveIds:[`${MASTERY_LESSON_ID}.${key}`],points:1,prompt,retry:{maxAttempts:1,variantIds:[]},feedback:{correct:reason,incorrect:reason,exhausted:reason}}}
function choice(key:string,variant:string,prompt:string,options:[string,string][],expected:string,reason:string,predict=false):ConceptualExercise|ParameterPredictionExercise {
 const offset=(variants.indexOf(variant)+Number(key.slice(1)))%options.length,ordered=[...options.slice(offset),...options.slice(0,offset)];
 return {...base(key,variant,prompt,reason),kind:predict?"parameter-prediction":"conceptual",options:ordered.map(([id,label])=>({id,label})),expectedOptionId:expected};
}
function numeric(key:string,variant:string,prompt:string,expected:number,reason:string):NumericalExercise{return {...base(key,variant,prompt,reason),kind:"numerical",expected,absoluteTolerance:0.001}}
function code(key:string,variant:string,prompt:string,slots:ConstrainedCodeExercise["slots"],expectedSlots:Record<string,string>,reason:string):ConstrainedCodeExercise{return {...base(key,variant,prompt,reason),kind:"constrained-code",slots,expectedSlots}}
export function assessmentQuestions(variant:string):Question[]{
 const index=variants.indexOf(variant);if(index<0)throw new Error("Unsupported assessment variant");
 const n=index+1,domain=["electricity use (kWh) from area and temperature","delivery duration (minutes) from distance and stop count","crop yield (kg) from irrigation and fertilizer"][index%3];
 const predicted=10+n,actual=predicted+(index%2?-4:3);
 const prediction=regressionEvaluationTrace({features:[[n+1]],targets:[0],weights:[2+index%3],bias:3}).rows[0].prediction;
 const errors=[-n,n+1],mse=regressionMetrics(errors).mse,mae=regressionMetrics([n,-n-2,2]).mae;
 const gradient=regressionGradientTrace({features:[[1],[2]],targets:[n+3,2*n+4],weights:[1],bias:0});
 const update=regressionUpdateTrace({features:[[1],[3]],targets:[3*n,4*n+1],weights:[2],bias:1},0.1);
 const trace=regressionUpdateTrace({features:[[2],[4]],targets:[n+7,n+15],weights:[2],bias:1},0.05);
 const g=index%2?-6:4,coefficient=index%2?-2:3;
 const rateScenario=["Loss is 100, 40, 70, 160 after increasing the learning rate.","Loss is 100, 99.9, 99.8 and parameter changes are tiny after a rate reduction.","The runtime explicitly terminates because updates became non-finite."][index%3];
 const rateExpected=["smaller","inspect","restore"][index%3];
 const scaleScenario=["A scaler is fitted to training and test inputs together before fitting the model.","A new input is scaled with its own one-row statistics instead of the training statistics.","A constant training column has standard deviation zero."][index%3];
 const scaleExpected=["train-only","reuse","remove"][index%3];
 const leakageScenario=["A demand predictor uses a field finalized after the demand period ends.","The same customer's duplicated record appears in both fitting and held-out data.","Future observations enter the training set when evaluating a forecast for an earlier date."][index%3];
 const leakExpected=["available","entity","time"][index%3];
 const decision=["Training error is low, but no held-out results were collected.","All evaluation inputs are small facilities; a client requests a prediction for a facility ten times larger.","The final test set was used repeatedly to choose the learning rate and feature set."][index%3];
 const decisionExpected=["held-out","range","fresh"][index%3];
 const definitions:ExerciseDefinition[]=[
 choice("q01",variant,`A team wants to predict ${domain}. Which describes the task correctly?`,[["numeric","Known pre-outcome measurements are features; the observed numeric quantity is the target; the estimate is the prediction"],["category","It is necessarily classification because there are multiple features"],["target-input","Supply the future target as an input to ensure accuracy"]],"numeric","A numerical target makes this regression. Features must be available when predicting; the known observed outcome is used for evaluation."),
 choice("q02",variant,`For the ${domain} model, a user changes one input for a new observation while holding the fitted model fixed. What changed?`,[["input","The observation's feature value, not its learned weights or bias"],["training","The weights were retrained automatically"],["target","The observed target was replaced by a weight"]],"input","Inputs describe the example; weights and bias describe the fitted model. Editing an input is inference, not retraining."),
 choice("q03",variant,`Before revealing any new predictions, bias increases by ${n+2} while weights stay fixed. What happens?`,[["shift",`Every prediction rises by ${n+2} target units; slope stays fixed`],["tilt","Only positive inputs rise; the intercept stays fixed"],["scale","Every prediction is multiplied by the bias change"]],"shift","Bias adds the same baseline to every prediction. Weight changes tilt the relation; bias changes translate it.",true),
 numeric("q04",variant,`Prediction is ${predicted}; actual target is ${actual}. Using prediction minus actual, calculate the signed residual.`,predicted-actual,`Residual = ${predicted} − ${actual} = ${predicted-actual}. ${predicted-actual<0?"Negative means underprediction.":"Positive means overprediction."}`),
 numeric("q05",variant,`For ŷ = wx + b with x = ${n+1}, w = ${2+index%3}, b = 3, calculate the prediction.`,prediction,`Multiply the feature by its weight, then add bias once: the runtime gives ${prediction}.`),
 numeric("q06",variant,`Residuals for two observations are [${errors.join(", ")}]. Calculate MSE (not RMSE).`,mse,`Square each residual before averaging: (${n*n} + ${(n+1)**2}) / 2 = ${mse}. The unit is squared target units.`),
 numeric("q07",variant,`Residuals are [${n}, ${-n-2}, 2]. Calculate MAE; round to three decimal places if needed.`,mae,`Average their magnitudes: (${n} + ${n+2} + 2) / 3 = ${mae}. Absolute values prevent cancellation; MAE retains target units.`),
 numeric("q08",variant,`For x = [1,2], y = [${n+3},${2*n+4}], w = 1 and b = 0, calculate dL/dw for mean squared error. Use (2/m)Σ(prediction − actual)x.`,gradient.weightGradients[0],`There are two rows. Predictions [1,2] give residuals [${-n-2},${-2*n-2}]. Multiplying by inputs and by 2/2 gives ${gradient.weightGradients[0]}.`),
 numeric("q09",variant,`An independent run has w = 2 and weight gradient ${update.gradient.weightGradients[0]}. With learning rate 0.1, what is the new weight?`,update.updatedParameters.weights[0],`Subtract the scaled gradient: 2 − 0.1 × (${update.gradient.weightGradients[0]}) = ${update.updatedParameters.weights[0]}.`),
 choice("q10",variant,`Before an update: the local weight derivative of loss is ${g}. Which movement is gradient descent for a small positive rate?`,[["increase","Increase the weight by subtracting a negative scaled derivative"],["decrease","Decrease the weight by subtracting a positive scaled derivative"],["ascent","Add the scaled derivative regardless of sign"]],g<0?"increase":"decrease","The derivative describes the local direction of increasing loss. Descent subtracts it: negative gradients increase the parameter; positive gradients decrease it.",true),
 choice("q11",variant,`${rateScenario} Which first response matches this evidence?`,[["smaller","Try a smaller rate from the same initial state; inspect possible overshooting"],["inspect","Inspect gradients and more iterations; progress may be slow, not divergent"],["restore","Restore finite settings, reduce the rate and check input scales before interpreting the fit"]],rateExpected,"Distinguish slow finite progress, increasing/oscillating loss and explicit numerical termination. One increase alone is not proof of mathematical divergence."),
 choice("q12",variant,"Training MSE decreases for several iterations. Which conclusion is supported?",[["limited","These updates reduced training loss; convergence and generalization require further evidence"],["optimal","A few decreases prove the global optimum has been reached"],["test","The loss curve guarantees unseen-data accuracy"]],"limited","A short decreasing trace is optimization evidence, not proof of convergence or good held-out behavior."),
 numeric("q13",variant,`For features [${n},2], weights [2,−3] and bias 5, calculate the weighted-sum prediction.`,predictOne([n,2],[2,-3],5),`Pair aligned inputs and weights, then add bias: 2 × ${n} − 3 × 2 + 5 = ${2*n-1}.`),
 choice("q14",variant,`${scaleScenario} Which correction is appropriate?`,[["train-only","Split first, fit statistics only on training inputs, and reuse them for held-out inputs"],["reuse","Apply the already-fitted training mean and scale to the new input"],["remove","Remove or handle the constant column explicitly; this runtime rejects division by zero scale"]],scaleExpected,"Preprocessing is fitted information. Preserve training-only coordinates, and never divide a constant column by zero."),
 choice("q15",variant,"Two inputs are strongly correlated. Predictions are similar across samples, but their individual coefficients trade magnitude. How should you explain them?",[["conditional","Treat coefficients as conditional model associations; inspect stability and avoid causal importance claims"],["causal","The larger raw coefficient proves a stronger causal effect"],["broken","Changing coefficients necessarily means prediction arithmetic is invalid"]],"conditional","Correlated inputs can trade contributions without greatly changing predictions. Units and conditional interpretation also limit coefficient comparisons."),
 choice("q16",variant,`Hold all other inputs and parameters fixed. One feature rises by 2 and its weight is ${coefficient}. Predict the effect before revealing the new estimate.`,[["up",`The prediction rises by ${Math.abs(2*coefficient)} target units`],["down",`The prediction falls by ${Math.abs(2*coefficient)} target units`],["bias","Only the bias changes"]],coefficient>0?"up":"down","The prediction change is the feature change times its weight. Holding the other inputs fixed is essential; this is a model effect, not a causal claim.",true),
 code("q17",variant,"Complete the single-feature prediction function.\n\ndef predict_one(x, w, b):\n    return ___",[{id:"prediction",allowedValues:["w * x + b","w + x + b","w * (x + b)","w * x - b"]}],{prediction:"w * x + b"},"The weight multiplies the feature; the bias is added once. Putting bias inside the multiplication changes its meaning."),
 code("q18",variant,`Repair the loss to compute mean squared error, not ${["mean absolute error","a sum without normalization","the square of the summed residuals"][index%3]}.\n\ndef loss(residuals):\n    return ___`,[{id:"loss",allowedValues:["sum(r * r for r in residuals) / len(residuals)","sum(abs(r) for r in residuals) / len(residuals)","sum(residuals) ** 2 / len(residuals)","sum(r * r for r in residuals)"]}],{loss:"sum(r * r for r in residuals) / len(residuals)"},"MSE squares each residual and averages those contributions. Summing first permits cancellation; absolute values compute MAE instead."),
 numeric("q19",variant,`Trace this independent Python fragment without executing learner code:\nw, b = 2.0, 1.0\ndw, db = ${trace.gradient.weightGradients[0]}, ${trace.gradient.biasGradient}\nrate = 0.05\nw, b = w - rate * dw, b - rate * db\nprint(w * ${n+2} + b)\nWhat numerical value is printed?`,predictOne([n+2],trace.updatedParameters.weights,trace.updatedParameters.bias),`Both new parameters use the old-state gradients. The updated weight is ${trace.updatedParameters.weights[0]} and bias ${trace.updatedParameters.bias}; inference gives ${predictOne([n+2],trace.updatedParameters.weights,trace.updatedParameters.bias)}.`),
 code("q20",variant,"Fix both update expressions. The derivatives dw and db were computed from the same old parameter state.\n\nw_new = ___\nb_new = ___",[{id:"weight",allowedValues:["w - rate * dw","w + rate * dw","w - dw / rate"]},{id:"bias",allowedValues:["b - rate * db","b + rate * db","b - rate * dw"]}],{weight:"w - rate * dw",bias:"b - rate * db"},"Subtract the rate times each matching derivative. Adding performs ascent; mixing the weight and bias derivatives updates the wrong quantity."),
 choice("q21",variant,`${leakageScenario} Which repair addresses the leakage?`,[["available","Remove information unavailable at prediction time, then repeat an honest split and fit"],["entity","Split by entity so the same observation cannot leak across training and held-out sets"],["time","Use a time-respecting split so training cannot use future information"]],leakExpected,"Evaluation must match prediction-time information and the deployment entity/time boundary. A high contaminated score is not evidence of generalization."),
 choice("q22",variant,`In this fictional dataset for ${domain}, one observation contributes most of the squared error. What is defensible?`,[["investigate","Check the source record and context, compare metric sensitivity, and document any treatment"],["delete","Delete it automatically to improve the reported score"],["hide","Report only training error so the miss is invisible"]],"investigate","A large residual could be an error or a valid rare case. Squared error emphasizes it, but does not justify automatic deletion."),
 choice("q23",variant,index%2?"Model A has low train error and high validation error. Model B has high errors on both splits and curved residual structure. Which diagnosis fits?":"Model A has high errors on both splits and curved residual structure. Model B has low train error and high validation error. Which diagnosis fits?",[["under-over","A suggests underfitting; B suggests overfitting"],["over-under","A suggests overfitting; B suggests underfitting"],["perfect","Both are proven to generalize because they are linear"]],index%2?"over-under":"under-over","Persistent learnable residual structure on both splits suggests underfitting. A large train/validation gap suggests overfitting; validate the diagnosis before choosing a remedy."),
 choice("q24",variant,`${decision} What is the next defensible step?`,[["held-out","Evaluate on representative untouched observations and compare a baseline before claiming generalization"],["range","Flag unsupported extrapolation and collect representative examples before asserting accuracy"],["fresh","Reserve fresh untouched data for final evaluation; the reused test set has become part of selection"]],decisionExpected,"Qualify a claim using the actual evidence. Training-only success, unsupported ranges and repeated test selection each undermine a different part of the evaluation story.")
 ];
 const questions=definitions.map((exercise,i)=>({...BLUEPRINT.questions[i],exercise}));
 // Rotate within competency groups, preserving four questions per area.
 return BLUEPRINT.competencies.flatMap((_,group)=>{const block=questions.slice(group*4,group*4+4),offset=index%4;return [...block.slice(offset),...block.slice(0,offset)]});
}
export function responseComplete(question:Question,response:LearnerResponse|undefined){
 if(!response||response.kind!==question.exercise.kind)return false;
 if(response.kind==="numerical")return Number.isFinite(response.value);
 if(response.kind==="constrained-code"&&question.exercise.kind==="constrained-code")return Boolean(response.slots&&typeof response.slots==="object"&&!Array.isArray(response.slots)&&question.exercise.slots.every(slot=>slot.allowedValues.includes(response.slots[slot.id])));
 if((response.kind==="conceptual"||response.kind==="parameter-prediction")&&(question.exercise.kind==="conceptual"||question.exercise.kind==="parameter-prediction"))return question.exercise.options.some(option=>option.id===response.optionId);
 return false;
}
export function gradeAssessment(variant:string,responses:Responses){
 const questions=assessmentQuestions(variant),items=questions.map(question=>{const response=responses[question.key];const result=responseComplete(question,response)?evaluateExercise(question.exercise,response,1):{correct:false,score:0,maxScore:1,feedback:question.exercise.feedback.incorrect,retryAllowed:false};return {question,...result}});
 const score=items.reduce((sum,item)=>sum+item.score,0),maxScore=items.length,percent=score/maxScore*100;
 const passedObjectiveIds=items.filter(item=>item.correct).map(item=>item.question.objectiveId);
 const failedCritical=items.filter(item=>item.question.critical&&!item.correct).map(item=>item.question.objectiveId);
 const competencies=BLUEPRINT.competencies.map(competency=>({...competency,score:items.filter(item=>item.question.competency===competency.id&&item.correct).length,maxScore:4}));
 return {variant,score,maxScore,percent,passed:score*100>=BLUEPRINT.minimumPercent*maxScore&&failedCritical.length===0,passedObjectiveIds,failedCritical,competencies,items};
}
export type AssessmentResult=ReturnType<typeof gradeAssessment>;
export function commitAssessment(evidence:LearningEvidenceV1,result:AssessmentResult,attemptId:string,submittedAt:string):LearningEvidenceV1 {
 if(evidence.assessmentAttempts.some(attempt=>attempt.id===attemptId))return evidence;
 // Keep this assessment's last 20 attempts without trimming unrelated assessment history.
 const others=evidence.assessmentAttempts.filter(attempt=>attempt.assessmentId!==ASSESSMENT_ID);
 let next=recordAssessmentAttempt({...evidence,assessmentAttempts:evidence.assessmentAttempts.filter(attempt=>attempt.assessmentId===ASSESSMENT_ID)},{id:attemptId,assessmentId:ASSESSMENT_ID,variantId:result.variant,score:result.score,maxScore:result.maxScore,objectiveIds:result.passedObjectiveIds,submittedAt},20);
 next={...next,assessmentAttempts:[...others,...next.assessmentAttempts]};
 for(const objectiveId of result.passedObjectiveIds)next=recordObjectiveCompletion(next,objectiveId,`${ASSESSMENT_ID}.${result.variant}.${objectiveId}`,submittedAt);
 next=markLessonState(next,MASTERY_LESSON_ID,"assessed",result.passedObjectiveIds,submittedAt);
 if(result.passed){
  next=recordObjectiveCompletion(next,AGGREGATE_OBJECTIVE,`${ASSESSMENT_ID}.successful-assessment`,submittedAt);
  for(const objectiveId of [...result.passedObjectiveIds,AGGREGATE_OBJECTIVE])next=awardMastery(next,{id:`${ASSESSMENT_ID}.mastery.${objectiveId}`,objectiveId,sourceType:"assessment",sourceId:ASSESSMENT_ID,level:3,awardedAt:submittedAt});
 }
 return next;
}
export type AssessmentDraft={version:1;assessmentVersion:string;variant:string;phase:"active"|"review"|"submitted";responses:Responses;attemptId?:string;submittedAt?:string};
export const newDraft=(variant=variants[0]):AssessmentDraft=>({version:1,assessmentVersion:BLUEPRINT.assessmentVersion,variant,phase:"active",responses:{}});
export function parseAssessmentDraft(raw:string|null,fallbackVariant=variants[0]):AssessmentDraft{
 if(!raw)return newDraft(fallbackVariant);
 try{
  const value=JSON.parse(raw);
  if(value.version!==1||value.assessmentVersion!==BLUEPRINT.assessmentVersion||!variants.includes(value.variant)||!["active","review","submitted"].includes(value.phase)||!value.responses||typeof value.responses!=="object"||Array.isArray(value.responses)||Object.keys(value.responses).length>24)return newDraft(fallbackVariant);
  const questions=assessmentQuestions(value.variant),responses:Responses={};
  for(const [key,response] of Object.entries(value.responses)){
   const question=questions.find(q=>q.key===key);if(!question||!response||typeof response!=="object")return newDraft(fallbackVariant);
   const candidate=response as LearnerResponse;
   const partialCode=candidate.kind==="constrained-code"&&question.exercise.kind==="constrained-code"&&candidate.slots&&typeof candidate.slots==="object"&&!Array.isArray(candidate.slots)&&Object.keys(candidate.slots).length<=question.exercise.slots.length&&Object.entries(candidate.slots).every(([id,value])=>question.exercise.kind==="constrained-code"&&question.exercise.slots.some(slot=>slot.id===id&&slot.allowedValues.includes(value)));
   if(!partialCode&&!responseComplete(question,candidate))return newDraft(fallbackVariant);
   // Retain only bounded, known response fields; drop arbitrary serialized metadata.
   const answer=response as LearnerResponse;
   responses[key]=answer.kind==="numerical"?{kind:answer.kind,value:answer.value}:answer.kind==="constrained-code"&&question.exercise.kind==="constrained-code"?{kind:answer.kind,slots:Object.fromEntries(question.exercise.slots.filter(slot=>slot.id in answer.slots).map(slot=>[slot.id,answer.slots[slot.id]]))}:answer.kind==="conceptual"||answer.kind==="parameter-prediction"?{kind:answer.kind,optionId:answer.optionId}:answer;
  }
  if(value.phase==="submitted"&&(typeof value.attemptId!=="string"||value.attemptId.length>160||typeof value.submittedAt!=="string"||Number.isNaN(Date.parse(value.submittedAt))))return newDraft(fallbackVariant);
  return {version:1,assessmentVersion:BLUEPRINT.assessmentVersion,variant:value.variant,phase:value.phase==="review"?"active":value.phase,responses,...(value.phase==="submitted"?{attemptId:value.attemptId,submittedAt:value.submittedAt}:{})};
 }catch{return newDraft(fallbackVariant)}
}
