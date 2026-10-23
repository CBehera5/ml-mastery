import {DeepRead,type DeepLesson} from "../deep-read";
import {ALGEBRA_DEEP} from "./algebra-functions";
import {PROBABILITY_DEEP} from "./probability";
import {STATISTICS_DEEP} from "./statistics";
export const MATH_DEEP:Record<string,DeepLesson[]>={"statistics":STATISTICS_DEEP,"probability":PROBABILITY_DEEP,"algebra-functions":ALGEBRA_DEEP,};
export const hasMathDeep=(module:string,lesson:number)=>Boolean(MATH_DEEP[module]?.[lesson]);
/** The long-form, story-led reading for one Math lesson (absent lessons render nothing). */
export function MathDeep({module,lesson}:{module:string;lesson:number}){
 const item=MATH_DEEP[module]?.[lesson];
 return item?<DeepRead lesson={item}/>:null;
}
