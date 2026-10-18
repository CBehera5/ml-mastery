import { linearValue } from "./calculus";
export const ALGEBRA_SCHEMA_VERSION = "1.0.0" as const;
export type AlgebraFunction = {kind:"linear";a:number;b:number}|{kind:"power";exponent:number;scale:number;shift:number;offset:number}|{kind:"exponential";base:number}|{kind:"logarithm";base:number}|{kind:"composition";order:"f-after-g"|"g-after-f"};
function bounded(name:string,value:number,max=1000){if(typeof value!=="number"||!Number.isFinite(value)||Math.abs(value)>max)throw new Error(`${name} must be finite with magnitude at most ${max}`);return value}
function validate(spec:AlgebraFunction){
 if(!spec||typeof spec!=="object")throw new Error("A named function is required");
 switch(spec.kind){
 case "linear":bounded("coefficient",spec.a,10);bounded("intercept",spec.b,100);break;
 case "power":if(!Number.isInteger(spec.exponent)||spec.exponent < -3||spec.exponent>3)throw new Error("exponent must be an integer from -3 to 3");bounded("scale",spec.scale,10);bounded("shift",spec.shift,10);bounded("offset",spec.offset,100);break;
 case "exponential":case "logarithm":if(!Number.isFinite(spec.base)||spec.base<.1||spec.base>10||(spec.kind==="logarithm"&&spec.base===1))throw new Error("base must be between 0.1 and 10; a logarithm base cannot be 1");break;
 case "composition":if(spec.order!=="f-after-g"&&spec.order!=="g-after-f")throw new Error("Unknown composition order");break;
 default:throw new Error("Unsupported named function");
 }
}
export function algebraValue(spec:AlgebraFunction,x:number):{value:number|null;reason:string|null}{
 validate(spec);bounded("input",x);
 if(spec.kind==="logarithm"&&x<=0)return{value:null,reason:"A real logarithm requires a strictly positive input. Zero and negative inputs are outside this domain."};
 if(spec.kind==="power"&&x===spec.shift&&spec.exponent<=0)return{value:null,reason:"This explorer leaves zero to a nonpositive power undefined: negative powers divide by zero, and 0⁰ needs a separate convention."};
 let value:number;
 switch(spec.kind){
 case "linear":value=linearValue(x,spec.a,spec.b);break;
 case "power":value=spec.scale*Math.pow(x-spec.shift,spec.exponent)+spec.offset;break;
 case "exponential":value=Math.pow(spec.base,x);break;
 case "logarithm":value=Math.log(x)/Math.log(spec.base);break;
 case "composition":value=spec.order==="f-after-g"?linearValue(x*x,2,3):Math.pow(linearValue(x,2,3),2);break;
 }
 if(!Number.isFinite(value)||Math.abs(value)>1e12)return{value:null,reason:"The result exceeds this bounded explorer's numerical limit (magnitude 10¹²). This is a display/runtime limit, not a mathematical domain restriction."};
 return{value:Object.is(value,-0)?0:value,reason:null};
}
export function algebraTrace(spec:AlgebraFunction,x:number){return{schemaVersion:ALGEBRA_SCHEMA_VERSION,function:{...spec},input:x,selected:algebraValue(spec,x),samples:[-4,-3,-2,-1,0,.5,1,2,3,4].map(input=>({input,...algebraValue(spec,input)}))}}
export function linearEquationTrace(a:number,b:number,target:number){validate({kind:"linear",a,b});bounded("target",target,100);if(a===0)return{schemaVersion:ALGEBRA_SCHEMA_VERSION,a,b,target,status:b===target?"all-inputs" as const:"no-solution" as const,solution:null};const solution=(target-b)/a;if(!Number.isFinite(solution)||Math.abs(solution)>1000)throw new Error("Solution exceeds the equation explorer input bound of 1000");return{schemaVersion:ALGEBRA_SCHEMA_VERSION,a,b,target,status:"unique" as const,solution}}
export function mappingTrace(pairs:[number,number][]){if(!Array.isArray(pairs)||pairs.length===0||pairs.length>16)throw new Error("Mapping needs 1 to 16 input-output pairs");for(const pair of pairs){if(!Array.isArray(pair)||pair.length!==2)throw new Error("Each mapping pair needs an input and output");pair.forEach(v=>bounded("mapping value",v))}const valid=pairs.every(([x,y])=>pairs.every(([otherX,otherY])=>x!==otherX||y===otherY));return{schemaVersion:ALGEBRA_SCHEMA_VERSION,pairs:pairs.map(p=>[...p]),isFunction:valid,domain:[...new Set(pairs.map(p=>p[0]))],range:[...new Set(pairs.map(p=>p[1]))]}}
export function compoundGrowthTrace(n:number){if(!Number.isInteger(n)||n<1||n>10000)throw new Error("compounding intervals must be an integer from 1 to 10000");return{schemaVersion:ALGEBRA_SCHEMA_VERSION,intervals:n,approximation:Math.pow(1+1/n,n),e:Math.E}}
