import {DeepRead,type DeepLesson} from "../deep-read";
import {ALGEBRA_DEEP} from "./algebra-functions";
import {PROBABILITY_DEEP} from "./probability";
import {STATISTICS_DEEP} from "./statistics";
import {OPTIMIZATION_DEEP} from "./optimization";
import {VECTORS_DEEP} from "./vectors";
import {MATRICES_DEEP} from "./matrices";
import {TRANSFORMATIONS_DEEP} from "./transformations";
import {EIGENVECTORS_DEEP} from "./eigenvectors";
import {SECANTS_DEEP} from "./secants";
import {RULES_DEEP} from "./rules";
import {DEBUG_DEEP} from "./debug";
import {FUNCTIONS_DERIVATIVES_DEEP} from "./functions-derivatives";
import {INTEGRATION_DEEP} from "./integration";
export const MATH_DEEP:Record<string,DeepLesson[]>={"integration":INTEGRATION_DEEP,"functions-derivatives":FUNCTIONS_DERIVATIVES_DEEP,"calculus-debug":DEBUG_DEEP,"calculus-rules":RULES_DEEP,"calculus-secants":SECANTS_DEEP,"linear-algebra-eigenvectors":EIGENVECTORS_DEEP,"linear-algebra-transformations":TRANSFORMATIONS_DEEP,"matrices-multiplication":MATRICES_DEEP,"vectors-dot-product":VECTORS_DEEP,"optimization":OPTIMIZATION_DEEP,"statistics":STATISTICS_DEEP,"probability":PROBABILITY_DEEP,"algebra-functions":ALGEBRA_DEEP,};
export const hasMathDeep=(module:string,lesson:number)=>Boolean(MATH_DEEP[module]?.[lesson]);
/** The long-form, story-led reading for one Math lesson (absent lessons render nothing). */
export function MathDeep({module,lesson}:{module:string;lesson:number}){
 const item=MATH_DEEP[module]?.[lesson];
 return item?<DeepRead lesson={item}/>:null;
}
