"use client";
import guides from "./experiment-guides.json";
import styles from "./simple-experiment.module.css";

export type ExperimentGuide={lab:number;title:string;label:string;help:string;fixed:string;control:string;options:{id:string;label:string}[]};
const entries:Record<string,ExperimentGuide[]>=guides;
export function experimentGuide(module:string,lesson:number):ExperimentGuide {
 const guide=entries[module]?.[lesson];
 if(!guide) throw Error("This lesson's experiment is unavailable.");
 return guide;
}
export function ExperimentChoice({guide,current,onChange}:{guide:ExperimentGuide;current:string;onChange:(id:string)=>void}) {
 const active=guide.options.some(option=>option.id===current);
 return <div className={styles.controls}>
  <p>{guide.help}</p>
  <aside className={styles.fixed}><strong>Keep these fixed</strong><p>{guide.fixed}</p></aside>
  <fieldset><legend>{guide.label}</legend>{guide.options.map((option,index)=><label key={option.id}>
   <input type="radio" name={`setting-${guide.title}`} value={index} checked={current===option.id} onChange={()=>onChange(option.id)}/>{option.label}
  </label>)}</fieldset>
  {!active&&<p role="status">Choose a setting above to begin this comparison. Existing progress is preserved.</p>}
  <p className={styles.note}>These settings replay calculated examples. Changing them does not train a new model in your browser.</p>
 </div>;
}

/** Display vocabulary only; stored response values and grading identifiers are unchanged. */
export function learnerText(text:string):string {
 const plain:Record<string,string>={
 "I expect a valid feature map and plausible in-range prediction":"The inputs can be used to make this prediction.",
 "I expect an incompatible representation or unsupported evaluation claim":"The setup or the claim is not supported.",
 "I expect better training fit but uncertain development error or tails":"A closer training fit may still fail on new examples.",
 "I expect valid information or better detection/error":"The information is usable, or the selected measure improves.",
 "I expect invalid information or a misleading conclusion":"The information or conclusion is not valid.",
 };
 if(plain[text])return plain[text];
 return text.replace(/\bfixture\b/gi,"example").replace(/\bfrozen\b/gi,"calculated").replace(/\bauthored\b/gi,"supplied")
 .replace(/\bquery\b/gi,"new input").replace(/class0/g,"class 0").replace(/class1/g,"class 1")
 .replace(/\breference-trained\b/g,"fitted").replace(/\bfeature map\b/gi,"list of model inputs")
 .replace(/\bdevelopment\b/g,"validation").replace(/\bprovenance\b/gi,"source")
 .replace(/\bconfiguration\b/gi,"setting");
}
const record=(value:unknown):Record<string,unknown>=>value&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:{};
function at(value:unknown,path:string):unknown {return path.split(".").reduce<unknown>((v,key)=>record(v)[key],value);}
const metrics:[string,string][]=[
 ["query_prediction","Prediction"],["prediction","Prediction"],
 ["probability","Probability"],["parameter_count","Model parameters"],
 ["training_mae","Training mean absolute error"],["train_mae","Training mean absolute error"],["development_mae","Validation mean absolute error"],
 ["training_metrics.mae","Training mean absolute error"],["validation_metrics.mae","Validation mean absolute error"],
 ["training.metrics.mae","Training mean absolute error"],["validation.metrics.mae","Validation mean absolute error"],
 ["training.metrics.accuracy","Training accuracy"],["validation.metrics.accuracy","Validation accuracy"],
 ["last_stage_validation_loss","Validation loss at this stage"],["selected_stage","Stage chosen by validation"],
 ["initial_training_loss","Starting training loss"],["estimator_budget","Correction stages"],
 ["local_gain","Impurity reduction"],["weighted_child_impurity","Impurity after the split"],
 ["loss_before.objective","Loss before the update"],["loss_after.objective","Loss after the update"],
 ["expected.training_data_log_loss","Training log loss"],["expected.development_data_log_loss","Validation log loss"],["expected.epoch","Training epochs"],
 ["training_loss","Training loss"],["validation_loss","Validation loss"],
 ["valid","Valid comparison"],["selection_valid","Valid selection"],
];
export function experimentMeasures(value:unknown):{label:string;value:number|string}[] {
 const rows:{label:string;value:number|string}[]=[];
 const add=(label:string,v:unknown)=>{if(rows.some(row=>row.label===label))return;if(typeof v==="number"&&Number.isFinite(v))rows.push({label,value:v});else if(typeof v==="boolean")rows.push({label,value:v?"Yes":"No"});};
 for(const [path,label] of metrics) add(label,at(value,path));
 const probabilities=at(value,"forward.probabilities_positive");
 if(Array.isArray(probabilities))add("Final input: positive-class probability",probabilities.at(-1));
 const posterior=at(value,"posterior_float64");if(Array.isArray(posterior))posterior.slice(0,2).forEach((v,i)=>add(`Class ${i} probability`,v));
 return rows.slice(0,4);
}
const number=(value:number|string)=>typeof value==="number"?Number(value.toPrecision(6)).toString():value;
/** A small labelled result, never a raw dump of manifests, row IDs or test data. */
export function ExperimentNumbers({value}:{value:unknown}) {
 const rows=experimentMeasures(value);if(!rows.length)return null;
 return <table className={styles.numbers}><caption>Key quantities for this setting</caption><thead><tr><th scope="col">Quantity</th><th scope="col">Value</th></tr></thead><tbody>{rows.map(row=><tr key={row.label}><th scope="row">{row.label}</th><td>{number(row.value)}</td></tr>)}</tbody></table>;
}
/** The neural-network reference endpoint uses snake_case; keep that transport detail out of the lesson. */
export function normalizeLessonConfig(value:unknown) {
 const raw=record(value);
 return {...raw,id:raw.id,predictionQuestion:raw.predictionQuestion??raw.prediction_question,
  predictionOptions:raw.predictionOptions??raw.prediction_options,reasonOptions:raw.reasonOptions??raw.reason_options,
  correctPrediction:raw.correctPrediction??raw.correct_prediction_id,correctReason:raw.correctReason??raw.correct_reason_id,
  reference:raw.reference??raw};
}

export function ExperimentComparison({before,after,baseline=false}:{before?:unknown;after:unknown;baseline?:boolean}) {
 if(before===undefined)return <ExperimentNumbers value={after}/>;
 const previous=experimentMeasures(before),current=experimentMeasures(after);
 const pairs=current.map(row=>({...row,before:previous.find(p=>p.label===row.label)?.value})).filter(row=>row.before!==undefined);
 if(!pairs.length)return null;
 return <table className={styles.numbers}><caption>{baseline?"Compare the starting and current settings":"What changed? Compare the last two settings"}</caption><thead><tr><th scope="col">Quantity</th><th scope="col">{baseline?"Starting setting":"Before"}</th><th scope="col">Now</th></tr></thead><tbody>{pairs.map(row=><tr key={row.label}><th scope="row">{row.label}</th><td>{number(row.before!)}</td><td>{number(row.value)}</td></tr>)}</tbody></table>;
}

export function ExperimentInputs({value}:{value:unknown}) {
 const raw=record(value),parameters=record(raw.parameters??raw.initial_parameters),inputs=raw.inputs;
 if(!Object.keys(parameters).length)return null;
 const display=(v:unknown):string=>Array.isArray(v)?v.map(item=>Array.isArray(item)?`[${item.map(String).join(", ")}]`:String(item)).join("; "):String(v);
 const rows:[[string,unknown],...[string,unknown][]]=[["Input rows (the final row is the final query)",Array.isArray(inputs)?inputs:"See the worked example"],["Weights into hidden units",parameters.W1],["Hidden-unit baselines",parameters.b1],["Weights into the output",parameters.W2],["Output baseline",parameters.b2]];
 return <details><summary>Read the fixed input and weights</summary><p>These supplied weights let you trace the calculation. Read “Keep these fixed” above to see what this comparison changes. A row lists the weights leaving one input. Each hidden unit has its own baseline.</p><table className={styles.numbers}><caption>Numbers used by this network example</caption><tbody>{rows.filter(([,v])=>v!==undefined).map(([label,v])=><tr key={label}><th scope="row">{label}</th><td>{display(v)}</td></tr>)}</tbody></table></details>;
}

export function lessonReset<T extends {labs:{config:string;from:string}[]}>(state:T,lab:number,id:string,reset:(state:T,lab:number)=>T):T {
 const fresh=reset(state,lab);
 return {...fresh,labs:fresh.labs.map((entry,index)=>index===lab?{...entry,config:id,from:id}:entry)};
}

export function ProbabilityComparison({before,after}:{before?:unknown;after:unknown}) {
 const a=at(before,"forward.probabilities_positive"),b=at(after,"forward.probabilities_positive");
 if(!Array.isArray(a)||!Array.isArray(b)||a.length!==b.length||!a.length||a.some(v=>typeof v!=="number"||!Number.isFinite(v)||v<0||v>1)||b.some(v=>typeof v!=="number"||!Number.isFinite(v)||v<0||v>1))return null;
 return <figure className="regression-figure"><svg viewBox={`0 0 460 ${a.length*55+55}`} role="img" aria-label="Positive-class probabilities before and after the selected setting. Both bars use the same zero-to-one scale; exact displayed values follow in the table.">{a.map((v,i)=><g key={i}><text x="0" y={i*55+30} fontSize="14">Input {i+1}</text><rect x="95" y={i*55+8} width={330*v} height="13" fill="#737c77"/><rect x="95" y={i*55+26} width={330*b[i]} height="13" fill="#1f7568"/></g>)}<text x="95" y={a.length*55+20} fontSize="14">0</text><text x="415" y={a.length*55+20} fontSize="14">1</text></svg><figcaption>Gray is the first setting; green is the current setting. Each pair describes the same input. Longer means a higher estimated probability of class 1. An unchanged prediction for one input does not mean the activation has no effect on other inputs. These estimates are not proof of calibrated probabilities.</figcaption><table><caption>Read the probabilities for each input</caption><thead><tr><th scope="col">Input</th><th scope="col">First setting</th><th scope="col">Current setting</th></tr></thead><tbody>{a.map((v,i)=><tr key={i}><th scope="row">{i+1}</th><td>{number(v)}</td><td>{number(b[i])}</td></tr>)}</tbody></table></figure>;
}
