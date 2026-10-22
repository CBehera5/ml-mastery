type ReferenceChoice={id:string;fixture?:string;controls:Record<string,unknown>};
const readable=(value:string)=>value.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/[_-]+/g," ");
export function referenceLabel(choice:ReferenceChoice,choices:readonly ReferenceChoice[]) {
 const number=choices.findIndex(item=>item.id===choice.id)+1;
 const values=Object.entries(choice.controls).filter(([,v])=>v!==undefined&&v!==null&&typeof v!=="object").map(([key,value])=>`${readable(key)}: ${typeof value==="boolean"?(value?"yes":"no"):readable(String(value))}`);
 const dataset=choice.fixture?.replace(/^[a-z]{2,3}[.-]/i,"").replace(/[.-]v\d+\b/g,"").replace(/[._-]+/g," ");
 return `Case ${number}${dataset?` · ${dataset}`:""}${values.length?` · ${values.join(" · ")}`:""}`;
}
