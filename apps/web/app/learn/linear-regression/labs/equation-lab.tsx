"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { regressionEvaluationTrace } from "@mlmath/runtime";
import { HOUSE_DATA, HOUSE_PARAMETERS } from "../lab-data";
import { formatNumber, MetricCards, ParameterSlider, RegressionPlot } from "../components/lab-ui";

const features=HOUSE_DATA.features.map(row=>[...row]), targets=[...HOUSE_DATA.targets];
const evaluate=(weight:number,bias:number)=>regressionEvaluationTrace({features,targets,weights:[weight],bias});
type Direction="up"|"down"|"same"|"unsure";
type Snapshot={weight:number;bias:number;selected:number;value:number};
const choices: Array<[Direction,string]>=[["up","They increase"],["down","They decrease"],["same","They stay the same"],["unsure","Not sure"]];

export function EquationLab({onExplore=()=>{},onDiscover=()=>{},afterDiscovery}:{onExplore?:()=>void;onDiscover?:(value:boolean)=>void;afterDiscovery?:ReactNode}) {
 const [weight,setWeight]=useState(HOUSE_PARAMETERS.weights[0]),[bias,setBias]=useState(HOUSE_PARAMETERS.bias),[selected,setSelected]=useState(2);
 const [stage,setStage]=useState(0),[explorer,setExplorer]=useState(false),[prediction,setPrediction]=useState<Direction|null>(null),[reason,setReason]=useState(""),[mechanism,setMechanism]=useState(""),[trialApplied,setTrialApplied]=useState(false);
 const [snapshot,setSnapshot]=useState<Snapshot|null>(null),[feedback,setFeedback]=useState<string|null>(null);
 const stageFocus=useRef<HTMLElement|null>(null),previousStage=useRef({stage:0,explorer:false});
 useEffect(()=>{if(previousStage.current.stage!==stage||previousStage.current.explorer!==explorer)stageFocus.current?.focus();previousStage.current={stage,explorer}},[stage,explorer]);
 const trace=useMemo(()=>evaluate(weight,bias),[weight,bias]),row=trace.rows[selected];
 const original=useMemo(()=>evaluate(42,140),[]),coefficient=useMemo(()=>evaluate(46,140),[]),baseline=useMemo(()=>evaluate(42,150),[]);
 function apply(w:number,b:number){if(w!==weight||b!==bias)onExplore();setWeight(w);setBias(b)}
 function judge(before:Snapshot,w:number,b:number){
  const after=evaluate(w,b).rows[before.selected].prediction,delta=after-before.value;
  const actual=delta>0?"up":delta<0?"down":"same";
  const outcome=`Actual model change for observation ${before.selected+1}: ${formatNumber(before.value)} → ${formatNumber(after)} $k; change ${formatNumber(delta)} $k.`;
  const verdict=delta===0?"No prediction change; this is not evidence for a direction match.":prediction==="unsure"?"You were unsure. Compare the per-area contribution with the once-added baseline.":prediction===actual?"Your direction prediction matches. That alone does not establish that you understand why.":"Your direction prediction does not match the actual change.";
  const mechanism=w!==before.weight&&b!==before.bias?"Both settings changed; their effects combine. Do not attribute this result to the coefficient alone.":w!==before.weight?`The coefficient changed by ${formatNumber(w-before.weight)} $k per thousand ft² across ${formatNumber(features[before.selected][0])} area units, with baseline fixed.`:"The baseline is added once; its change shifts every prediction equally, with coefficient fixed.";
  setFeedback(`${outcome} ${verdict} ${mechanism}`);
 }
 function reset(){setWeight(42);setBias(140);setSelected(2);setPrediction(null);setReason("");setMechanism("");setTrialApplied(false);setSnapshot(null);setFeedback(null)}
 function replay(){reset();setStage(0);setExplorer(false);onDiscover(false)}
 const predictionControls=<>
   <fieldset style={{minWidth:0}}><legend>Predicted direction</legend>{choices.map(([value,label])=><label key={value}><input type="radio" name="equation-prediction" disabled={trialApplied||(!explorer&&stage>0)} checked={prediction===value} onChange={()=>{setPrediction(value);setFeedback(null)}}/>{label}</label>)}</fieldset>
   <label>Why do you expect that? (optional)<textarea style={{maxWidth:"100%"}} value={reason} onChange={event=>setReason(event.target.value)}/></label>
 </>;
 return <div className="regression-lab" style={{minWidth:0,overflowWrap:"anywhere"}}>
  {!explorer&&<section style={{minWidth:0}}><h3 tabIndex={-1} ref={element=>{if(stage===0&&!explorer)stageFocus.current=element}}>Predict before changing the rule</h3>{explorer?<p>Capture the current rule below, choose a direction here, then change a setting and compare. The captured observation stays fixed; selecting another observation cancels the trial.</p>:<p>Keep area 2.5 thousand ft² and baseline 140 $k fixed. Change only the coefficient from 42 to 46 $k per thousand ft². What will happen to this home's estimate?</p>}
   {!explorer&&predictionControls}
   {!explorer&&<button className="button primary" style={{maxWidth:"100%",whiteSpace:"normal"}} disabled={!prediction||stage!==0} onClick={()=>{const before={weight:42,bias:140,selected:2,value:original.rows[2].prediction};apply(46,140);setSelected(2);judge(before,46,140);setStage(1)}}>Try coefficient 46</button>}
   <button className="button secondary" style={{maxWidth:"100%",whiteSpace:"normal"}} onClick={()=>{setExplorer(true);setStage(2);onDiscover(true)}}>Review explanation and free exploration</button>
   {!explorer&&feedback&&<p role="status" aria-label="Experiment feedback" tabIndex={-1} ref={element=>{if(stage===1&&!explorer)stageFocus.current=element}}>{feedback}</p>}
   {stage===1&&<><p>The additional 4 $k per thousand ft² applies across 2.5 units: 4 × 2.5 = 10 $k. The estimate rises from 245 to 255 $k. The actual home and its recorded 246 $k price have not changed.</p><label>Explain why the change is 10, rather than 4<textarea style={{maxWidth:"100%"}} aria-label="Explain the coefficient mechanism" value={mechanism} onChange={event=>setMechanism(event.target.value)}/></label><button className="button secondary" style={{maxWidth:"100%",whiteSpace:"normal"}} onClick={()=>{reset();setStage(2)}}>Compare coefficient and baseline</button></>}
  </section>}
  {stage>=2&&<section style={{minWidth:0}}><h3 tabIndex={-1} ref={element=>{if(stage===2&&!explorer)stageFocus.current=element}}>Two inputs distinguish the settings</h3><p>Each variant starts afresh from coefficient 42 and baseline 140. The coefficient increment repeats per area unit; the baseline increment is added once to each estimate.</p>
   <div tabIndex={0} role="region" aria-label="Coefficient and baseline comparison — scroll horizontally if needed" style={{minWidth:0,maxWidth:"100%",overflowX:"auto"}}><table style={{minWidth:560,overflowWrap:"normal"}}><caption>Independent changes from the original rule (prices in $k)</caption><thead><tr><th scope="col">Area (thousand ft²)</th><th scope="col">Original</th><th scope="col">Coefficient 46</th><th scope="col">Coefficient change</th><th scope="col">Baseline 150</th><th scope="col">Baseline change</th></tr></thead><tbody>{[0,2].map(index=><tr key={index}><th scope="row">{features[index][0]}</th><td>{original.rows[index].prediction}</td><td>{coefficient.rows[index].prediction}</td><td>{coefficient.rows[index].prediction-original.rows[index].prediction}</td><td>{baseline.rows[index].prediction}</td><td>{baseline.rows[index].prediction-original.rows[index].prediction}</td></tr>)}</tbody></table></div>
   <p>At area 1, coefficient +4 adds 4; at area 2.5 it adds 10. Baseline +10 adds 10 at both inputs. The two rules agree at 2.5 but differ at 1: matching one point cannot identify the rule.</p><button className="button secondary" style={{maxWidth:"100%",whiteSpace:"normal"}} onClick={()=>{setExplorer(true);onDiscover(true)}}>Connect the discovery to mathematics and Python</button>
  </section>}
  <button className="button secondary" style={{maxWidth:"100%",whiteSpace:"normal"}} onClick={replay}>Replay discovery</button>
  {explorer&&afterDiscovery}
  {explorer&&<details className="equation-explorer" open><summary>Explore further: sliders, graph and one-point challenge</summary><section style={{minWidth:0}}><h3 tabIndex={-1} ref={element=>{if(explorer)stageFocus.current=element}}>Free exploration: weight tilts; bias lifts</h3><p>Weight means coefficient; bias means baseline. These supplied settings are manually adjusted here, not learned by moving a control. Capture a comparison, predict its direction here, then change a setting. Slider movement alone does not demonstrate understanding.</p>
   <button className="button secondary" style={{maxWidth:"100%",whiteSpace:"normal"}} onClick={()=>{setTrialApplied(false);setSnapshot({weight,bias,selected,value:row.prediction});setPrediction(null);setFeedback(null)}}>Capture current rule for comparison</button>
   {predictionControls}
   <p>After capturing, choose a direction here before adjusting a setting. A new capture clears the old prediction.</p>
   <ParameterSlider label="Weight ($k per thousand ft²)" value={weight} min={0} max={90} step={1} unit="$k" onChange={value=>{if(snapshot&&!prediction)setSnapshot(null);if(snapshot&&prediction)setTrialApplied(true);apply(value,bias);setFeedback(null)}}/>
   <ParameterSlider label="Bias (base price)" value={bias} min={0} max={240} step={5} unit="$k" onChange={value=>{if(snapshot&&!prediction)setSnapshot(null);if(snapshot&&prediction)setTrialApplied(true);apply(weight,value);setFeedback(null)}}/>
   <button className="button secondary" style={{maxWidth:"100%",whiteSpace:"normal"}} disabled={!snapshot||!prediction} onClick={()=>{if(snapshot)judge(snapshot,weight,bias)}}>Compare captured prediction</button>
   {feedback&&<p role="status" aria-label="Experiment feedback" tabIndex={-1} ref={element=>{if(stage===1&&!explorer)stageFocus.current=element}}>{feedback}</p>}
   <button className="button secondary" style={{maxWidth:"100%",whiteSpace:"normal"}} onClick={reset}>Reset parameters</button>
   <MetricCards items={[{label:"Selected actual",value:`$${formatNumber(row.target)}k`},{label:"Selected prediction",value:`$${formatNumber(row.prediction)}k`},{label:"Residual",value:`$${formatNumber(row.residual)}k`,detail:"prediction − actual"}]}/>
   <RegressionPlot trace={trace} selected={selected} onSelect={index=>{setSelected(index);setTrialApplied(false);setSnapshot(null);setPrediction(null);setFeedback(null)}} title="House-price regression line explorer"/>
   <div style={{minWidth:0,maxWidth:"100%",overflowX:"auto"}} tabIndex={0} role="region" aria-label="Runtime prediction and residual calculations — scroll horizontally if needed"><table style={{minWidth:560,overflowWrap:"normal"}}><caption>Runtime prediction and residual calculations</caption><thead><tr>{["Observation","Area (thousand ft²)","Actual ($k)","Prediction ($k)","Residual ($k)"].map(label=><th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{trace.rows.map((item,index)=><tr key={index}><th scope="row">{index+1}</th><td>{formatNumber(item.features[0])}</td><td>{formatNumber(item.target)}</td><td>{formatNumber(item.prediction)}</td><td>{formatNumber(item.residual)}</td></tr>)}</tbody></table></div>
   <div className="equation-readout"><span>Observation {selected+1}</span><strong>ŷ = {formatNumber(weight)} × {formatNumber(row.features[0])} + {formatNumber(bias)}</strong><b>= ${formatNumber(row.prediction)}k</b></div>
   <h3>Can you estimate the 3.2-thousand-ft² home within $5k?</h3><p>Select observation 4, then tune weight and bias until the absolute residual is at most 5. The goal is exploration, not finding one uniquely correct line.</p>{selected===3&&Math.abs(row.residual)<=5&&<p>Challenge met: this observation is within $5k. Check the other points before deciding whether the whole model is good.</p>}
  </section></details>}
 </div>;
}
