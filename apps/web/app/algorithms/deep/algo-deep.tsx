import {DeepRead,type DeepLesson} from "../../math/teaching/deep-read";
import {KNN_DEEP} from "./knn";
import {NAIVE_BAYES_DEEP} from "./naive-bayes";
import {POLYNOMIAL_DEEP} from "./polynomial";
import {REGULARIZATION_DEEP} from "./regularization";
import {LOGISTIC_DEEP} from "./logistic";
export const ALGO_DEEP:Record<string,DeepLesson[]>={"logistic":LOGISTIC_DEEP,"regularization":REGULARIZATION_DEEP,"polynomial":POLYNOMIAL_DEEP,knn:KNN_DEEP,"naive-bayes":NAIVE_BAYES_DEEP};
export const hasAlgoDeep=(module:string,lesson:number)=>Boolean(ALGO_DEEP[module]?.[lesson]);
/** The long-form, story-led reading for one Algorithms lesson (absent lessons render nothing). */
export function AlgoDeep({module,lesson}:{module:string;lesson:number}){
 const item=ALGO_DEEP[module]?.[lesson];
 return item?<DeepRead lesson={item}/>:null;
}
