import {DeepRead,type DeepLesson} from "../../math/teaching/deep-read";
import {ESSENTIALS_DEEP} from "./essentials";
export const PY_DEEP:Record<string,DeepLesson[]>={"essentials":ESSENTIALS_DEEP,};
export const hasPyDeep=(module:string,lesson:number)=>Boolean(PY_DEEP[module]?.[lesson]);
/** The long-form, story-led reading for one Python lesson (absent lessons render nothing). */
export function PyDeep({module,lesson}:{module:string;lesson:number}){
 const item=PY_DEEP[module]?.[lesson];
 return item?<DeepRead lesson={item}/>:null;
}
