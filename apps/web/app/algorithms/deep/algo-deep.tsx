import {DeepRead,type DeepLesson} from "../../math/teaching/deep-read";
import {KNN_DEEP} from "./knn";
import {NAIVE_BAYES_DEEP} from "./naive-bayes";
import {POLYNOMIAL_DEEP} from "./polynomial";
import {REGULARIZATION_DEEP} from "./regularization";
import {LOGISTIC_DEEP} from "./logistic";
import {DECISION_TREES_DEEP} from "./decision-trees";
import {RANDOM_FORESTS_DEEP} from "./random-forests";
import {GRADIENT_BOOSTING_DEEP} from "./gradient-boosting";
import {SVM_DEEP} from "./svm";
import {EVALUATION_DEEP} from "./evaluation";
import {MODEL_SELECTION_DEEP} from "./model-selection";
import {MLP_DEEP} from "./mlp";
export const ALGO_DEEP:Record<string,DeepLesson[]>={"knn":KNN_DEEP,"naive-bayes":NAIVE_BAYES_DEEP,"polynomial":POLYNOMIAL_DEEP,"regularization":REGULARIZATION_DEEP,"logistic":LOGISTIC_DEEP,"decision-trees":DECISION_TREES_DEEP,"random-forests":RANDOM_FORESTS_DEEP,"gradient-boosting":GRADIENT_BOOSTING_DEEP,"svm":SVM_DEEP,"module":EVALUATION_DEEP,"model-selection":MODEL_SELECTION_DEEP,"mlp":MLP_DEEP};
export const hasAlgoDeep=(module:string,lesson:number)=>Boolean(ALGO_DEEP[module]?.[lesson]);
/** The long-form, story-led reading for one Algorithms lesson (absent lessons render nothing). */
export function AlgoDeep({module,lesson}:{module:string;lesson:number}){
 const item=ALGO_DEEP[module]?.[lesson];
 return item?<DeepRead lesson={item}/>:null;
}
