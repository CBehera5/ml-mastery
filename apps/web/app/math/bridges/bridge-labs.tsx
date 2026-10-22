"use client";
import {useState} from "react";
import {Playground,Field,Readout,fmt} from "../extras/ui";
import {cosine,expectation,l1,l2,linf,likelihood,logLikelihood,mle,variance,PX,PY,bestWeight,residual,dot,sse,spreadAt,principal,bits,entropy,crossEntropy,kl,stdErr,interval,twoGroupZ,shrink,bumpy,descend,SX,SY,fullGrad,meanLoss,runSgd,fenceArea} from "./bridge-math";

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
export function ProjectionPlayground(){
 const [w,setW]=useState(1);const r=residual(w,PX,PY);
 return <Playground id="proj-lab" title="Find the shadow" intro="Sizes (1, 2, 3) and prices (2, 2, 5). Slide the weight and watch the residual turn square to the sizes.">
  <Field label="Weight w" value={w} min={0} max={3} step={0.05} onChange={setW} display={fmt(w)}/>
  <Readout items={[["Prediction",`(${PX.map(x=>fmt(w*x)).join(", ")})`],["Residual",`(${r.map(v=>fmt(v)).join(", ")})`],["Residual · size",fmt(dot(r,PX))],["Sum of squared errors",fmt(sse(w,PX,PY))],["Best weight",fmt(bestWeight(PX,PY))]]}/>
 </Playground>;
}
export function SvdPlayground(){
 const [deg,setDeg]=useState(0);const pr=principal();
 return <Playground id="svd-lab" title="Spin the line" intro="Four centred customers. Rotate the direction and see how much of the spread the shadows keep.">
  <Field label="Direction (degrees)" value={deg} min={0} max={180} step={1} onChange={setDeg} display={`${deg}°`}/>
  <Readout items={[["Spread along this line",fmt(spreadAt(deg))],["Best direction",`${fmt(pr.deg,1)}°`],["Best spread",fmt(pr.l1)],["Share of all variation",`${fmt(pr.share*100,1)}%`]]}/>
 </Playground>;
}
export function InformationPlayground(){
 const [a,setA]=useState(50),[b,setB]=useState(30);
 const c=Math.max(0,100-a-b);const q=[a/100,b/100,c/100];const p=[0.7,0.2,0.1];
 const safe=q.map(v=>Math.max(v,0.001));
 return <Playground id="info-lab" title="Pay for believing the wrong story" intro="True chances are (0.7, 0.2, 0.1). Set your model's chances for the first two types, the third gets the rest.">
  <Field label="Model: type A (%)" value={a} min={1} max={98} step={1} onChange={v=>{setA(v);if(v+b>99)setB(99-v)}} display={`${a}%`}/>
  <Field label="Model: type B (%)" value={b} min={1} max={98} step={1} onChange={v=>setB(Math.min(v,99-a))} display={`${b}%`}/>
  <Readout items={[["Model: type C",`${c}%`],["Entropy of truth",`${fmt(entropy(p),3)} bits`],["Cross-entropy",`${fmt(crossEntropy(p,safe),3)} bits`],["Extra cost (KL)",`${fmt(kl(p,safe),3)} bits`],["Surprise at a type-C customer",`${fmt(bits(safe[2]),2)} bits`]]}/>
 </Playground>;
}
export function InferencePlayground(){
 const [n,setN]=useState(100),[ph,setPh]=useState(0.62);const [lo,hi]=interval(ph,n);
 const t=twoGroupZ(0.15,0.21,n);
 return <Playground id="inf-lab" title="Sample size and certainty" intro="Same survey result, different amounts of data. Then the A/B test, 15% against 21%, with the same number of visitors per page.">
  <Field label="People per group" value={n} min={25} max={1600} step={25} onChange={setN} display={`${n}`}/>
  <Field label="Share satisfied" value={ph} min={0.1} max={0.9} step={0.01} onChange={setPh} display={`${fmt(ph*100,0)}%`}/>
  <Readout items={[["Standard error",fmt(stdErr(ph,n),4)],["95% interval",`${fmt(lo*100,1)}% to ${fmt(hi*100,1)}%`],["A/B z-score (15% vs 21%)",fmt(t.z)],["Convincing?",Math.abs(t.z)>=1.96?"Yes, beyond luck":"Not yet"]]}/>
 </Playground>;
}
export function BiasVariancePlayground(){
 const [c,setC]=useState(1);const r=shrink(c);const best=100/105;
 return <Playground id="bv-lab" title="Shrink the average" intro="Estimating a true value of 10 from 5 noisy days. Pull the estimate toward zero by a factor c and see the two kinds of error trade places.">
  <Field label="Shrink factor c" value={c} min={0.5} max={1.1} step={0.01} onChange={setC} display={fmt(c)}/>
  <Readout items={[["Bias²",fmt(r.bias2,3)],["Variance",fmt(r.variance,3)],["Total error",fmt(r.mse,3)],["Best c",fmt(best,3)],["Error at best c",fmt(shrink(best).mse,3)]]}/>
 </Playground>;
}
export function ConvexityPlayground(){
 const [start,setStart]=useState(1.5);const end=descend(start);
 return <Playground id="cvx-lab" title="Where does the hiker stop?" intro="The landscape f(w) = w⁴ − 4w² + w has two valleys. Choose where to start and walk downhill for 200 steps.">
  <Field label="Starting point" value={start} min={-2} max={2} step={0.1} onChange={setStart} display={fmt(start,1)}/>
  <Readout items={[["Ends at w",fmt(end,3)],["Loss there",fmt(bumpy(end),2)],["Which valley",end>0?"Shallow (right)":"Deep (left)"]]}/>
 </Playground>;
}
export function StochasticPlayground(){
 const [batch,setBatch]=useState(1),[lr,setLr]=useState(0.02),[steps,setSteps]=useState(20);
 const path=runSgd(batch,lr,steps);const w=path[path.length-1];
 return <Playground id="sgd-lab" title="Steps from a handful of flats" intro="Price = w × size on four flats. Choose how many flats each step looks at, how big the step is, and how many steps to take.">
  <Field label="Batch size" value={batch} min={1} max={4} step={1} onChange={setBatch} display={`${batch}`}/>
  <Field label="Learning rate" value={lr} min={0.005} max={0.1} step={0.005} onChange={setLr} display={fmt(lr,3)}/>
  <Field label="Steps" value={steps} min={1} max={60} step={1} onChange={setSteps} display={`${steps}`}/>
  <Readout items={[["Weight after the steps",fmt(w,3)],["Best weight",fmt(59.5/30,3)],["Loss now",fmt(meanLoss(w),3)],["Full gradient at w",fmt(fullGrad(w),2)]]}/>
 </Playground>;
}
export function ConstraintsPlayground(){
 const [x,setX]=useState(2);
 return <Playground id="con-lab" title="Use exactly 20 m of fence" intro="Choose the width. The height is whatever the fence leaves. Find the biggest area.">
  <Field label="Width x (m)" value={x} min={0.5} max={9.5} step={0.5} onChange={setX} display={fmt(x,1)}/>
  <Readout items={[["Height y (m)",fmt(10-x,1)],["Area (m²)",fmt(fenceArea(x),2)],["Best area",fmt(fenceArea(5),0)]]}/>
 </Playground>;
}
export const BRIDGE_LABS:Record<string,()=>React.JSX.Element>={norms:NormsPlayground,expectation:ExpectationPlayground,mle:MlePlayground,projection:ProjectionPlayground,svd:SvdPlayground,information:InformationPlayground,inference:InferencePlayground,"bias-variance":BiasVariancePlayground,convexity:ConvexityPlayground,stochastic:StochasticPlayground,constraints:ConstraintsPlayground};
export function BridgeLab({slug}:{slug:string}){const Lab=BRIDGE_LABS[slug];return Lab?<Lab/>:null}
