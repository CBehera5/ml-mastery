import { expect,it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { gradeFamily } from "../../python/foundation/contracts";
import { boundarySegment } from "./graphic";
import { configurations,LABS,PRACTICE,response } from "./catalog";

for(const lab of [0,1])it(`lab${lab} preserves every raw reference object and strips sealed test metadata`,()=>{
  const manifest=JSON.parse(readFileSync(fileURLToPath(new URL(`../../../../../docs/verification/support-vector-machines/sv-e${lab+1}.manifest.v1.json`,import.meta.url)),"utf8"));
  for(const config of configurations(lab))expect(config.expected).toEqual(manifest.configurations.find((item:{id:string})=>item.id===config.id));
  expect(JSON.stringify(LABS[lab])).not.toContain("sealed_test");
});
for(const config of [...configurations(0),...configurations(1)]){
  const normal=config.expected.kind==="manual-geometry" ? (config.expected.controls as {coefficient:number[]}).coefficient : config.expected.coefficient as number[]|undefined;
  if(!normal)continue;
  const intercept=config.expected.kind==="manual-geometry" ? (config.expected.controls as {intercept:number}).intercept : Number(config.expected.intercept);
  it(`analytic boundary and margin segments match frozen equation ${config.id}`,()=>{
    for(const level of [0,-1,1])for(const point of boundarySegment(normal,intercept,level,[-10,-10],[10,10]))expect(normal[0]*point[0]+normal[1]*point[1]+intercept).toBeCloseTo(level,8);
    if(normal.every(value=>value===0))expect(boundarySegment(normal,intercept,0,[-10,-10],[10,10])).toEqual([]);
  });
}
it("accepts all and only the authored whole workflow repair aliases",()=>{
  const family=PRACTICE[0][14];
  expect(family.objective).toBe("SV04.O3");
  expect(family.accepted).toHaveLength(4);
  for(const accepted of family.accepted){
    expect(gradeFamily(family,response(family,accepted))).toMatchObject({correct:true});
    const answer=accepted[0];
    if(answer.kind!=="slots")throw Error("Repair fixture missing");
    expect(gradeFamily(family,response(family,[{...answer,entries:[...answer.entries].reverse()}]))).toMatchObject({correct:true});
    expect(gradeFamily(family,response(family,[{...answer,entries:answer.entries.map((entry,index)=>index===0?{...entry,optionId:"test_fit"}:entry)}]))).toMatchObject({status:"graded",correct:false});
  }
});
