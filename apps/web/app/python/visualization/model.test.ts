import { expect, it, vi } from "vitest";
import reference from "../../../../../packages/python-contracts/fixtures/visualization-learning.v1.json";
import { gradeFamily, canonical, validateDefinition, type Answer } from "../foundation/contracts";
import { scoreAssessment } from "../foundation/assessment";
import { acceptedResponse } from "../foundation/test-fixtures";
import { ACTIVITIES, CATALOG_VALID, CONTENT, INDEPENDENT_FORMS, PRACTICE_FORMS, LESSONS } from "./catalog";
import { alternate, checkActivity, changeActivity, confirmAttempt, emptyState, lessonComplete, load, MASTERY, ModuleStore, practiceSubmit, recover, resetLesson, retry, serialize, STORAGE_KEY, type State } from "./model";
vi.mock("./catalog", async original => ({ ...await original<typeof import("./catalog")>(), MASTERY_AVAILABLE: true }));
const at = "2026-10-16T12:00:00.000Z";
function ready(state = emptyState()): State { return { ...state, draft: { ...state.draft, phase: "review", answers: INDEPENDENT_FORMS[state.draft.form].map(item => structuredClone([...item.accepted[0]])) } }; }
it("maps20 objectives/40 practice/60 independent instances to trusted references",()=>{
  expect(LESSONS).toHaveLength(5);expect(CATALOG_VALID).toBe(true);
  expect(LESSONS.flatMap(item=>item.objectives).filter(item=>item.introductory).map(item=>item.id)).toEqual(["V05.O4"]);
  expect(PRACTICE_FORMS.flat()).toHaveLength(40);expect(INDEPENDENT_FORMS.flat()).toHaveLength(60);
  const all=[...PRACTICE_FORMS.flat(),...INDEPENDENT_FORMS.flat()];expect(new Set(all.map(item=>item.id)).size).toBe(100);
  for(const definition of all){
    expect(validateDefinition(definition)).toBe(true);
    definition.accepted.forEach((_,index)=>expect(gradeFamily(definition,acceptedResponse(definition,index))).toMatchObject({correct:true}));
    const source=reference.cases.find(item=>item.objective===definition.objective&&item.mode===(definition.id.includes(".practice.")?"practice":"mastery")&&item.variant===["a","b","c"].indexOf(definition.id.split(".").at(-1)!))!;
    expect(source.code).toBe(definition.code);expect(source.reason).toBe(definition.explanation);
    const atom=definition.atoms[0];
    if(atom.kind==="choice")expect(atom.options.find(item=>item.id==="observed")!.label).toBe(JSON.stringify(source.expected));
    if(atom.kind==="number")expect(definition.accepted[0][0]).toEqual({kind:"number",value:(source.expected as {answer:number}).answer});
    expect(gradeFamily(definition,{...acceptedResponse(definition),code:"import os"}).status).toBe("invalid");
  }
});
it("checks all34 experiment configurations and requires meaningful changed conditions",()=>{
  ACTIVITIES.forEach((configs,lesson)=>{
    expect(configs).toHaveLength(lesson === 0 || lesson === 2 ? 8 : 6);
    configs.forEach(config=>{
      expect(reference.cases.some(item=>item.code===config.code&&JSON.stringify(item.charts)===JSON.stringify(config.charts)&&JSON.stringify(item.expected)===config.output)).toBe(true);
      let state=changeActivity(emptyState(),lesson,configs[1].id);state=changeActivity(state,lesson,config.id);
      state.activities[lesson]={...state.activities[lesson],prediction:config.output,reason:config.reasonId};
      expect(checkActivity(state,lesson,at).activities[lesson].passed).toBe(true);
    });
    const state=emptyState(),config=configs[0];state.activities[lesson]={...state.activities[lesson],prediction:config.output,reason:config.reasonId};
    expect(checkActivity(state,lesson,at).activities[lesson].passed).toBe(false);
  });
});
it("tests15/16 thresholds plus30 paired-critical failures on all3 forms, never mosaics",()=>{
  INDEPENDENT_FORMS.forEach(form=>{
    const responses=form.map(item=>acceptedResponse(item));
    for(const score of [15,16,17,20]){
      const changed=structuredClone(responses);
      form.map((item,index)=>({item,index})).filter(({item})=>!item.critical).slice(0,20-score).forEach(({index})=>{changed[index].answers[0].answer={kind:"unanswered"};});
      expect(scoreAssessment("visualization",form,changed)).toMatchObject({score,passed:score>=16});
    }
    expect(form.filter(item=>item.critical).map(item=>item.objective)).toEqual(["V01.O2","V02.O2","V03.O2","V04.O2","V05.O1"]);
    form.forEach((family,index)=>{if(family.critical)for(const component of [0,1]){
      const changed=structuredClone(responses);changed[index].answers[component].answer={kind:"unanswered"};
      expect(scoreAssessment("visualization",form,changed)).toMatchObject({score:19,passed:false,failedCritical:[family.objective]});
    }});
    const causal=structuredClone(responses);causal[9].answers[1].answer={kind:"choice",optionId:"shortcut"};
    expect(scoreAssessment("visualization",form,causal)).toMatchObject({score:19,passed:false,failedCritical:["V03.O2"]});
    expect(()=>scoreAssessment("visualization",form,responses.slice(1))).toThrow();
    expect(()=>scoreAssessment("visualization",form,[...responses.slice(1),responses[1]])).toThrow();
  });
});
it("accepts whole reviewed repairs, strict numeric equivalents and rejects malformed representations",()=>{
  for(const form of [...PRACTICE_FORMS,...INDEPENDENT_FORMS]){
    const repair=form[16],equivalent=acceptedResponse(repair,1),slots=equivalent.answers[0].answer;
    expect(repair.accepted).toHaveLength(2);if(slots.kind!=="slots")throw Error("slots");
    slots.entries.reverse();expect(gradeFamily(repair,equivalent)).toMatchObject({correct:true});
    slots.entries.find(item=>item.slotId==="claim")!.optionId="inflated";expect(gradeFamily(repair,equivalent)).toMatchObject({correct:false});
    slots.entries.push({slotId:"scale",optionId:"common"});expect(gradeFamily(repair,equivalent).status).toBe("invalid");
    const number=form[13],response=acceptedResponse(number),value=(response.answers[0].answer as {value:number}).value;
    for(const actual of [value,value+1e-10]){response.answers[0].answer={kind:"number",value:actual};expect(gradeFamily(number,response)).toMatchObject({correct:true});}
    for(const actual of [value+.01,NaN,Infinity,true,"2.5"]){response.answers[0].answer={kind:"number",value:actual} as Answer;expect(gradeFamily(number,response)).not.toMatchObject({correct:true});}
    for(const extra of [{code:"__import__('os')"},JSON.parse('{"__proto__":{}}'),{url:"https://example.com"}])expect(gradeFamily(repair,{...acceptedResponse(repair),...extra}).status).toBe("invalid");
  }
});
it("requires confirmation, restores/rotates idempotently, caps history and preserves only earned mastery",()=>{
  expect(()=>confirmAttempt(ready(),false,at)).toThrow(/confirmation/);
  let state=confirmAttempt(ready(),true,at);const awards=canonical(state.evidence.masteryEvidence);
  expect(confirmAttempt(state,true,at)).toBe(state);expect(load(serialize(state))).toEqual(state);
  for(let count=0;count<23;count++){state=retry(state,`retry-${count}`);state=confirmAttempt({...state,draft:{...state.draft,phase:"review"}},true,at);}
  expect(state.history).toHaveLength(20);expect(canonical(state.evidence.masteryEvidence)).toBe(awards);
  expect(load(serialize(ready(retry(state,"review-reload")))).draft.phase).toBe("active");
  expect(resetLesson(state,0,true,at).evidence.masteryEvidence).toEqual(state.evidence.masteryEvidence);
  const partial=ready();partial.draft.answers[0][0]={kind:"unanswered"};const passed=confirmAttempt(partial,true,at);
  expect(passed.evidence.objectives[MASTERY].mastered).toBe(true);expect(passed.evidence.objectives["python.visualization.v01.o1"]?.mastered??false).toBe(false);
  const failed=ready();failed.draft.answers[1][1]={kind:"unanswered"};expect(confirmAttempt(failed,true,at).evidence.masteryEvidence).toEqual([]);
});
it("completes all5 lessons only with four practice passes and an explained changed experiment, never mastery",()=>{
  let state=emptyState();
  for(let lesson=0;lesson<5;lesson++){
    for(let offset=0;offset<4;offset++){const index=lesson*4+offset;state.practice[index].answers=structuredClone([...PRACTICE_FORMS[0][index].accepted[0]]);state=practiceSubmit(state,index,at);}
    expect(lessonComplete(state,lesson)).toBe(false);const config=ACTIVITIES[lesson][5];state=changeActivity(state,lesson,config.id);
    state.activities[lesson]={...state.activities[lesson],prediction:config.output,reason:config.reasonId};state=checkActivity(state,lesson,at);
    expect(lessonComplete(state,lesson)).toBe(true);expect(load(serialize(state))).toEqual(state);
  }
  expect(state.evidence.masteryEvidence).toEqual([]);
});
it("persists exhausted counters and demands reviewed changed-case recovery, invalid repairs consume none",()=>{
  let state=emptyState();
  for(let index=0;index<20;index++){
    for(let variant=0;variant<2;variant++){state=practiceSubmit(state,index,at);state=practiceSubmit(state,index,at);if(!variant)state=alternate(state,index);}
    state=load(serialize(state));expect(()=>practiceSubmit(state,index,at)).toThrow(/exhausted/);expect(()=>recover(state,index)).toThrow(/Review/);
    state.practice[index]={...state.practice[index],reviewed:true,remediation:"observed"};state=recover(state,index);expect(state.practice[index]).toMatchObject({counts:[0,0],cycle:1});
  }
  state.practice[16].answers[0]={kind:"slots",entries:[{slotId:"scale",optionId:"common"}]};expect(load(serialize(state))).toEqual(state);
  expect(()=>practiceSubmit(state,16,at)).toThrow(/Unsupported/);expect(state.practice[16].counts).toEqual([0,0]);
});
it("preserves unsupported bytes and old scopes through denial/quota/stale-write and confirmed resets",()=>{
  const raw=serialize(emptyState());
  for(const bad of ["{bad",raw.replace('"schema":1','"schema":2'),raw.replace(CONTENT,"python.pandas.1.0.0"),raw.replace('"schema":1','"schema":1,"schema":1'),JSON.stringify(emptyState(),null,2),"a".repeat(262145)]){
    const data=new Map([[STORAGE_KEY,bad],["ml-math-lab:python:pandas:v1","keep"]]);const store=new ModuleStore({getItem:key=>data.get(key)??null,setItem:(key,value)=>{data.set(key,value);}});
    store.hydrate();store.save(emptyState());expect(data.get(STORAGE_KEY)).toBe(bad);expect(store.warning).toContain("not saved");store.reset(true);expect(data.get("ml-math-lab:python:pandas:v1")).toBe("keep");
  }
  const data=new Map<string,string>(),store=new ModuleStore({getItem:key=>data.get(key)??null,setItem:(key,value)=>{data.set(key,value);}});
  expect(()=>store.save(emptyState())).toThrow(/Hydrate/);store.hydrate();data.set(STORAGE_KEY,raw);store.save(emptyState());expect(store.writable).toBe(false);
  for(const denied of [false,true]){const failing=new ModuleStore({getItem:()=>{if(denied)throw Error("Denied");return null;},setItem:()=>{throw Error("Quota");}});failing.hydrate();failing.save(emptyState());expect(failing.warning).toContain("not saved");}
});
