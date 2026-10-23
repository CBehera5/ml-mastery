import {DeepRead,type DeepLesson} from "../../math/teaching/deep-read";
import {KNN_DEEP} from "./knn";
import {NAIVE_BAYES_DEEP} from "./naive-bayes";
import {POLYNOMIAL_DEEP} from "./polynomial";
const DEEP:Record<string,DeepLesson[]>={"polynomial":POLYNOMIAL_DEEP,knn:KNN_DEEP,"naive-bayes":NAIVE_BAYES_DEEP};
export const hasAlgoDeep=(module:string,lesson:number)=>Boolean(DEEP[module]?.[lesson]);
/** The long-form, story-led reading for one Algorithms lesson (absent lessons render nothing). */
export function AlgoDeep({module,lesson}:{module:string;lesson:number}){
 const item=DEEP[module]?.[lesson];
 return item?<DeepRead lesson={item}/>:null;
}
