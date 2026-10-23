export const l1=(x:number,y:number)=>Math.abs(x)+Math.abs(y);
export const l2=(x:number,y:number)=>Math.hypot(x,y);
export const linf=(x:number,y:number)=>Math.max(Math.abs(x),Math.abs(y));
export function cosine(a:number[],b:number[]){const dot=a.reduce((s,v,i)=>s+v*b[i],0),na=Math.hypot(...a),nb=Math.hypot(...b);return na===0||nb===0?0:dot/(na*nb)}
export function expectation(x:number[],p:number[]){return x.reduce((s,v,i)=>s+v*p[i],0)}
export function variance(x:number[],p:number[]){const m=expectation(x,p);return x.reduce((s,v,i)=>s+(v-m)**2*p[i],0)}
export const likelihood=(p:number,k:number,n:number)=>p**k*(1-p)**(n-k);
export const logLikelihood=(p:number,k:number,n:number)=>k*Math.log(p)+(n-k)*Math.log(1-p);
export const mle=(k:number,n:number)=>k/n;
// Projection
export const PX=[1,2,3],PY=[2,2,5];
export const dot=(a:number[],b:number[])=>a.reduce((s,v,i)=>s+v*b[i],0);
export const bestWeight=(x:number[],y:number[])=>dot(x,y)/dot(x,x);
export const residual=(w:number,x:number[],y:number[])=>y.map((v,i)=>v-w*x[i]);
export const sse=(w:number,x:number[],y:number[])=>residual(w,x,y).reduce((s,r)=>s+r*r,0);
// PCA on the four centred customers
export const PCA_POINTS:[number,number][]=[[3,2],[-3,-2],[1,1],[-1,-1]];
export function covariance(pts:[number,number][]){const n=pts.length;let a=0,b=0,c=0;for(const [x,y] of pts){a+=x*x;b+=x*y;c+=y*y}return [[a/n,b/n],[b/n,c/n]]}
export function spreadAt(deg:number,pts=PCA_POINTS){const C=covariance(pts),t=deg*Math.PI/180,u=[Math.cos(t),Math.sin(t)];return u[0]*(C[0][0]*u[0]+C[0][1]*u[1])+u[1]*(C[1][0]*u[0]+C[1][1]*u[1])}
export function principal(pts=PCA_POINTS){const C=covariance(pts),tr=C[0][0]+C[1][1],det=C[0][0]*C[1][1]-C[0][1]**2,d=Math.sqrt(tr*tr/4-det),l1=tr/2+d,l2=tr/2-d,deg=0.5*Math.atan2(2*C[0][1],C[0][0]-C[1][1])*180/Math.PI;return {l1,l2,deg,share:l1/(l1+l2)}}
// Information
export const bits=(p:number)=>-Math.log2(p);
export const entropy=(p:number[])=>p.reduce((s,v)=>s+(v>0?-v*Math.log2(v):0),0);
export const crossEntropy=(p:number[],q:number[])=>p.reduce((s,v,i)=>s+(v>0?-v*Math.log2(q[i]):0),0);
export const kl=(p:number[],q:number[])=>crossEntropy(p,q)-entropy(p);
// Inference
export const stdErr=(p:number,n:number)=>Math.sqrt(p*(1-p)/n);
export const interval=(p:number,n:number):[number,number]=>[p-1.96*stdErr(p,n),p+1.96*stdErr(p,n)];
export function twoGroupZ(pa:number,pb:number,n:number){const se=Math.sqrt(pa*(1-pa)/n+pb*(1-pb)/n);return {se,z:(pb-pa)/se}}
// Bias-variance for a shrunk average
export function shrink(c:number,theta=10,varX=5){const bias2=((c-1)*theta)**2,variance=c*c*varX;return {bias2,variance,mse:bias2+variance}}
// Convexity
export const bumpy=(w:number)=>w**4-4*w**2+w;
export const bumpyGrad=(w:number)=>4*w**3-8*w+1;
export function descend(start:number,lr=0.02,steps=200){let w=start;for(let i=0;i<steps;i++)w-=lr*bumpyGrad(w);return w}
// Stochastic gradient descent on price = w * size
export const SX=[1,2,3,4],SY=[2.2,3.8,6.3,7.7];
export const sampleGrad=(w:number,i:number)=>2*SX[i]*(w*SX[i]-SY[i]);
export const fullGrad=(w:number)=>SX.reduce((s,_,i)=>s+sampleGrad(w,i),0)/SX.length;
export const meanLoss=(w:number)=>SX.reduce((s,x,i)=>s+(w*x-SY[i])**2,0)/SX.length;
export function mulberry(seed:number){let a=seed>>>0;return()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
export function runSgd(batch:number,lr:number,steps:number,seed=1){const rnd=mulberry(seed);let w=0;const path=[w];for(let s=0;s<steps;s++){const idx:number[]=[];while(idx.length<batch){const i=Math.floor(rnd()*SX.length);if(!idx.includes(i))idx.push(i)}const g=idx.reduce((a,i)=>a+sampleGrad(w,i),0)/batch;w-=lr*g;path.push(w)}return path}
// Constraints
export const fenceArea=(x:number,perimeter=20)=>x*(perimeter/2-x);
