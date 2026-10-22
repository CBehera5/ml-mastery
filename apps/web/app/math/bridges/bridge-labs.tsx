"use client";
import {useState} from "react";
import {Playground,Field,Readout,fmt} from "../extras/ui";
import {cosine,expectation,l1,l2,linf,likelihood,logLikelihood,mle,variance} from "./bridge-math";

export function NormsPlayground(){
 const [ax,setAx]=useState(30),[ay,setAy]=useState(40),[bx,setBx]=useState(34),[by,setBy]=useState(43);
 const dx=bx-ax,dy=by-ay;
 return <Playground id="norms-lab" title="Three ways to measure the same gap" intro="Customer A and customer B each have an age and a monthly spend in ₹ thousands. Move them and compare the three distances.">
  <Field label="A age" value={ax} min={20} max={60} step={1} onChange={setAx} display={`${ax}`}/>
  <Field label="A spend (₹ thousand)" value={ay} min={10} max={80} step={1} onChange={setAy} display={`${ay}`}/>
  <Field label="B age" value={bx} min={20} max={60} step={1} onChange={setBx} display={`${bx}`}/>
  <Field label="B spend (₹ thousand)" value={by} min={10} max={80} step={1} onChange={setBy} display={`${by}`}/>
  <Readout items={[["Arrow B − A",`(${dx}, ${dy})`],["L1 (add the gaps)",fmt(l1(dx,dy))],["L2 (straight line)",fmt(l2(dx,dy))],["L∞ (biggest gap)",fmt(linf(dx,dy))],["Cosine of the angle",fmt(cosine([ax,ay],[bx,by]),3)]]}/>
 </Playground>;
}
export function ExpectationPlayground(){
 const [p100,setP100]=useState(20),[p500,setP500]=useState(10);
 const p0=Math.max(0,100-p100-p500);
 const x=[0,100,500],p=[p0/100,p100/100,p500/100];
 const e=expectation(x,p),v=variance(x,p);
 return <Playground id="exp-lab" title="Scratch ticket: average and risk" intro="A ₹100 ticket pays ₹0, ₹100 or ₹500. Change how often the prizes come up.">
  <Field label="Chance of ₹100 prize (%)" value={p100} min={0} max={100-p500} step={1} onChange={setP100} display={`${p100}%`}/>
  <Field label="Chance of ₹500 prize (%)" value={p500} min={0} max={100-p100} step={1} onChange={setP500} display={`${p500}%`}/>
  <Readout items={[["Chance of nothing",`${p0}%`],["Expected prize",`₹${fmt(e)}`],["Average result per ticket",`₹${fmt(e-100)}`],["Variance",fmt(v,0)],["Standard deviation",`₹${fmt(Math.sqrt(v),0)}`]]}/>
 </Playground>;
}
export function MlePlayground(){
 const [k,setK]=useState(7),[n]=useState(10),[p,setP]=useState(0.5);
 const best=mle(k,n);
 const W=320,H=140,pts=Array.from({length:99},(_,i)=>{const q=(i+1)/100;return [q,likelihood(q,k,n)] as const});
 const top=Math.max(...pts.map(t=>t[1]))||1;
 const path=pts.map(([q,l],i)=>`${i?"L":"M"}${(q*W).toFixed(1)},${(H-8-l/top*(H-20)).toFixed(1)}`).join(" ");
 const cur=likelihood(p,k,n);
 return <Playground id="mle-lab" title="Slide the story along the hill" intro="Ten flips. Choose how many came up heads, then try different values of p and see how likely the data is.">
  <Field label="Heads out of 10" value={k} min={1} max={9} step={1} onChange={setK} display={`${k}`}/>
  <Field label="Story: chance of heads p" value={p} min={0.05} max={0.95} step={0.05} onChange={setP} display={fmt(p)}/>
  <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Likelihood of ${k} heads in 10 flips as p changes. Peak at p equals ${fmt(best)}.`} style={{width:"100%"}}>
   <path d={path} fill="none" stroke="#21685f" strokeWidth={2}/>
   <line x1={p*W} x2={p*W} y1={4} y2={H-8} stroke="#c86818" strokeWidth={2}/>
   <line x1={best*W} x2={best*W} y1={4} y2={H-8} stroke="#7866a6" strokeDasharray="4 3"/>
  </svg>
  <Readout items={[["Likelihood L(p)",cur.toFixed(6)],["Log likelihood",fmt(logLikelihood(p,k,n),3)],["Best p (k ÷ n)",fmt(best)]]}/>
 </Playground>;
}
export const BRIDGE_LABS:Record<string,()=>React.JSX.Element>={norms:NormsPlayground,expectation:ExpectationPlayground,mle:MlePlayground};
export function BridgeLab({slug}:{slug:string}){const Lab=BRIDGE_LABS[slug];return Lab?<Lab/>:null}
