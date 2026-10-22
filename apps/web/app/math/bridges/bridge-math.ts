export const l1=(x:number,y:number)=>Math.abs(x)+Math.abs(y);
export const l2=(x:number,y:number)=>Math.hypot(x,y);
export const linf=(x:number,y:number)=>Math.max(Math.abs(x),Math.abs(y));
export function cosine(a:number[],b:number[]){const dot=a.reduce((s,v,i)=>s+v*b[i],0),na=Math.hypot(...a),nb=Math.hypot(...b);return na===0||nb===0?0:dot/(na*nb)}
export function expectation(x:number[],p:number[]){return x.reduce((s,v,i)=>s+v*p[i],0)}
export function variance(x:number[],p:number[]){const m=expectation(x,p);return x.reduce((s,v,i)=>s+(v-m)**2*p[i],0)}
export const likelihood=(p:number,k:number,n:number)=>p**k*(1-p)**(n-k);
export const logLikelihood=(p:number,k:number,n:number)=>k*Math.log(p)+(n-k)*Math.log(1-p);
export const mle=(k:number,n:number)=>k/n;
