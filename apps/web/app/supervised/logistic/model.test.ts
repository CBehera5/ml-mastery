import { expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { canonical, gradeFamily, type Answer, type Family } from "../../python/foundation/contracts";
import { configurations, FORMS, LABS, MASTERY_AVAILABLE, OBJECTIVES, PRACTICE, PREDICTIONS, response, score, VALID_CATALOG } from "./catalog";
import { alternate, changeLab, confirmAttempt, emptyState, explainLab, lessonComplete, load, ModuleStore, practiceSubmit, recover, resetLab, retry, revealLab, serialize, STORAGE_KEY, unpack, validateState } from "./model";

const at = "2026-10-17T12:00:00Z";
const correct = (family: Family) => [...family.accepted[0]];
function wrong(family: Family, index = 0): Answer[] {
  return correct(family).map((answer, position) => {
    if (position !== index) return answer;
    const atom = family.atoms[position];
    if (answer.kind === "number") return { kind: "number", value: answer.value + 1 };
    if (answer.kind === "choice" && atom.kind === "choice") return { kind: "choice", optionId: atom.options.find(item => item.id !== answer.optionId)!.id };
    if (answer.kind === "slots" && atom.kind === "slots") return { kind: "slots", entries: answer.entries.map((entry, offset) => offset ? entry : { ...entry, optionId: atom.slots.find(slot => slot.id === entry.slotId)!.options.find(option => option.id === "test_fit")!.id }) };
    throw Error("Missing wrong-answer test representation.");
  });
}
it("has exact objective, instance, paired-gate and frozen configuration coverage", () => {
  expect(VALID_CATALOG).toBe(true);
  expect(PRACTICE.flat()).toHaveLength(48); expect(FORMS.flat()).toHaveLength(72);
  for (const form of [...PRACTICE, ...FORMS]) { expect(form.map(item => item.objective)).toEqual(OBJECTIVES); expect(form.filter(item => item.critical)).toHaveLength(6); }
  expect(configurations(0)).toHaveLength(28); expect(configurations(1)).toHaveLength(33);
  expect(PREDICTIONS).toEqual(["Probability changes because the linear score changes", "The decision may change without refitting or changing probabilities", "The score cannot justify this evaluation or probability interpretation"]);
});
for (const family of [...PRACTICE.flat(), ...FORMS.flat()]) {
  it(`grades correct and valid-wrong ${family.id}`, () => {
    expect(gradeFamily(family, response(family, correct(family)))).toMatchObject({ status: "graded", correct: true });
    expect(gradeFamily(family, response(family, wrong(family)))).toMatchObject({ status: "graded", correct: false });
    expect(gradeFamily(family, { ...response(family, correct(family)), unsafe: "exec" }).status).toBe("invalid");
  });
}
for (const [formIndex, form] of FORMS.entries()) {
  for (const count of [19, 20]) it(`form ${formIndex}: ${count}/24 boundary`, () => {
    let remaining = 24 - count;
    const answers = form.map(family => !family.critical && remaining-- > 0 ? wrong(family) : correct(family));
    expect(score(formIndex, answers)).toMatchObject({ score: count, passed: count === 20 });
  });
  for (const [index, family] of form.entries()) if (family.critical) for (const atom of [0, 1]) it(`form ${formIndex} fails ${family.objective} atom ${atom} at 15/24`, () => {
    const answers = form.map((entry, offset) => offset === index ? wrong(entry, atom) : correct(entry));
    expect(score(formIndex, answers)).toMatchObject({ score: 23, passed: false, critical: [family.objective] });
  });
}
it("enforces finite numeric types, equivalence tolerance, slot order and unanswered semantics", () => {
  const family = PRACTICE[0].find(item => item.atoms[0].kind === "number")!;
  const expected = (family.accepted[0][0] as { value: number }).value;
  expect(gradeFamily(family, response(family, [{ kind: "number", value: expected + 5e-10 }]))).toMatchObject({ correct: true });
  expect(gradeFamily(family, response(family, [{ kind: "number", value: expected + 2 * (1e-9 + 1e-9 * Math.abs(expected)) }]))).toMatchObject({ status: "graded", correct: false });
  for (const value of [NaN, Infinity, "1/2", "0.2", true, {}, 1e7]) expect(gradeFamily(family, response(family, [{ kind: "number", value } as Answer])).status).toBe("invalid");
  expect(score(0, FORMS[0].map(family => family.atoms.map(() => ({ kind: "unanswered" }))))).toMatchObject({ score: 0, passed: false });
  const repair = PRACTICE[0][18], answer = correct(repair);
  if (answer[0].kind === "slots") answer[0] = { ...answer[0], entries: [...answer[0].entries].reverse() };
  expect(gradeFamily(repair, response(repair, answer))).toMatchObject({ correct: true });
});
it("does not consume unsupported practice answers and requires remediation after four valid misses", () => {
  let state = emptyState();
  state.practice[0].answers = "[]";
  expect(() => practiceSubmit(state, 0)).toThrow();
  expect(state.practice[0].counts).toEqual([0, 0]);
  state = emptyState();
  for (let variant = 0; variant < 2; variant++) {
    state.practice[0].answers = canonical(wrong(PRACTICE[variant][0]));
    state = practiceSubmit(practiceSubmit(state, 0), 0);
    expect(() => practiceSubmit(state, 0)).toThrow();
    if (!variant) state = alternate(state, 0);
  }
  expect(() => recover(state, 0)).toThrow();
  state.practice[0].reviewed = true; state.practice[0].recall = "shortcut";
  expect(() => recover(state, 0)).toThrow();
  state.practice[0].recall = "boundary"; state = recover(state, 0);
  expect(state.practice[0]).toMatchObject({ cycle: 1, counts: [0, 0], proof: null });
  expect(state.mastery).toBeNull();
});
for (const lab of [0, 1]) for (const config of configurations(lab)) it(`frozen state ${config.id}: wrong initial prediction can still yield explained interaction`, () => {
  let state = emptyState();
  if (state.labs[lab].config === config.id) state = changeLab(state, lab, configurations(lab).find(item => item.id !== config.id)!.id);
  state = changeLab(state, lab, config.id);
  expect(() => revealLab(state, lab)).toThrow();
  state.labs[lab].prediction = PREDICTIONS[2]; state = revealLab(state, lab);
  expect(() => explainLab(state, lab)).toThrow();
  state.labs[lab].reason = String(config.expected.reason); state = explainLab(state, lab);
  expect(state.labs[lab].credit?.config).toBe(config.id);
  expect(validateState(state)).toBe(true);
  expect(load(serialize(state)).labs[lab].credit).toEqual(state.labs[lab].credit);
  state = resetLab(state, lab); expect(state.labs[lab].revealed).toBe(false); expect(state.labs[lab].credit).not.toBeNull();
  expect(state.mastery).toBeNull();
});
it("preserves frozen hashes, endpoint semantics and critical ownership", () => {
 const directory=fileURLToPath(new URL("../../../../../docs/verification/logistic/",import.meta.url));
 const lock=JSON.parse(readFileSync(directory+"freeze-lock.v1.json","utf8"));
 for(const [file,expected] of Object.entries(lock.files))expect(createHash("sha256").update(readFileSync(directory+file)).digest("hex")).toBe(expected);
 expect(PRACTICE[0][4].objective).toBe("LG02.O1");expect(PRACTICE[0][4].critical).toBe(false);expect(PRACTICE[0][5].critical).toBe(true);
 const saturated=configurations(0).find(item=>item.id==="LG-E1.LG.authored.w2.positive-tail.y0.v1")!.expected;
 expect(saturated.stable_mathematical_loss_from_finite_logit).toBe(40);
 expect((saturated.evaluation_of_stored_probability as {mathematical_log_loss:unknown}).mathematical_log_loss).toMatchObject({tag:"infinity",sign:"positive"});
 const endpoint=configurations(1).find(item=>item.id==="LG-E2.exact-endpoints.t1")!.expected.metrics as {predictions:number[]};
 expect(endpoint.predictions).toEqual([0,1,0,1]);
 const absent=configurations(1).find(item=>item.id==="LG-E2.no-actual-positives.t1")!.expected.metrics as {recall:unknown;precision:unknown};
 expect(absent.recall).toMatchObject({tag:"undefined"});expect(absent.precision).toMatchObject({tag:"undefined"});
 const comparable=["moderate","cautious","sharp"].map(name=>configurations(1).find(item=>item.id===`LG-E2.${name}.t0.5.fn1`)!.expected.metrics as {accuracy:number;mathematical_log_loss:number});
 expect(new Set(comparable.map(item=>item.accuracy)).size).toBe(1);expect(new Set(comparable.map(item=>item.mathematical_log_loss)).size).toBe(3);
 const repair=PRACTICE[0][18];expect(repair.accepted).toHaveLength(2);
 for(const accepted of repair.accepted)expect(gradeFamily(repair,response(repair,accepted))).toMatchObject({correct:true});
});
it("requires all practice, explained activity and transfer for completion, never mastery", () => {
  let state = emptyState();
  for (let index = 0; index < 4; index++) { state.practice[index].answers = canonical(correct(PRACTICE[0][index])); state = practiceSubmit(state, index); }
  expect(lessonComplete(state, 0)).toBe(false);
  state = changeLab(state, 0, configurations(0)[1].id); state.labs[0].prediction = PREDICTIONS[0]; state = revealLab(state, 0); state.labs[0].reason = String(configurations(0)[1].expected.reason); state = explainLab(state, 0);
  state.transfers[0] = "boundary";
  expect(lessonComplete(state, 0)).toBe(true); expect(state.mastery).toBeNull();
});
it.runIf(MASTERY_AVAILABLE)("confirms once, rotates complete attempts, preserves mastery after failure and does not combine attempts", () => {
  let state = emptyState();
  state.draft.answers = FORMS[0].map(family => canonical(correct(family)));
  expect(() => confirmAttempt(state, true, at)).toThrow();
  state.draft.phase = "review"; expect(() => confirmAttempt(state, false, at)).toThrow();
  state = confirmAttempt(state, true, at); expect(state.mastery?.passed).toBe(true);
  expect(confirmAttempt(state, true, at)).toEqual(state);
  const mastery = state.mastery;
  state = retry(state, "second"); expect(state.draft.form).toBe(1);
  state.draft.phase = "review"; state = confirmAttempt(state, true, at);
  expect(state.draft.result?.score).toBe(0); expect(state.mastery).toEqual(mastery);
  expect(() => retry(state, "initial")).toThrow();
  expect(load(serialize(state)).mastery).toEqual(mastery);
});
it.runIf(MASTERY_AVAILABLE)("retains twenty summaries, latest full response and earlier mastery after twenty-five failed retries", () => {
  let state = emptyState();
  state.draft.answers = FORMS[0].map(family => canonical(correct(family))); state.draft.phase = "review"; state = confirmAttempt(state, true, at);
  for (let index = 0; index < 25; index++) { state = retry(state, `retry_${index}`); state.draft.phase = "review"; state = confirmAttempt(state, true, at); }
  expect(state.history).toHaveLength(20); expect(state.mastery?.id).toBe("initial"); expect(validateState(state)).toBe(true);
});
it.runIf(MASTERY_AVAILABLE)("never combines complementary failed attempts into mastery", () => {
  let state = emptyState();
  state.draft.answers = FORMS[0].map((family, index) => canonical(index === 1 ? wrong(family, 1) : correct(family)));
  state.draft.phase = "review"; state = confirmAttempt(state, true, at);
  expect(state.draft.result).toMatchObject({ score: 23, passed: false }); expect(state.mastery).toBeNull();
  state = retry(state, "complementary");
  expect(state.draft.answers.every(raw => unpack(raw).every(answer => answer.kind === "unanswered"))).toBe(true);
  state.draft.answers = FORMS[1].map((family, index) => canonical(index === 5 ? wrong(family, 0) : correct(family)));
  state.draft.phase = "review"; state = confirmAttempt(state, true, at);
  expect(state.draft.result).toMatchObject({ score: 23, passed: false }); expect(state.mastery).toBeNull();
  expect(load(serialize(state)).mastery).toBeNull();
});
it("isolates versions and preserves corruption/quota/stale-tab bytes without writing foreign scopes", () => {
  const map = new Map<string, string>([["ml-math-lab:supervised:ev:prototype:v1", "prototype-unchanged"], ["python", "earlier-mastery"]]);
  const port = { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, raw: string) => { map.set(key, raw); } };
  const first = new ModuleStore(port); expect(() => first.save(emptyState())).toThrow(); first.hydrate();
  const second = new ModuleStore(port); second.hydrate(); first.save(emptyState()); const raw = map.get(STORAGE_KEY);
  second.save(emptyState()); expect(second.warning).toContain("not saved"); expect(map.get(STORAGE_KEY)).toBe(raw);
  const quota = new ModuleStore({ ...port, setItem: () => { throw Error("quota"); } }); quota.hydrate(); quota.save(emptyState()); expect(quota.warning).toContain("not saved"); expect(map.get(STORAGE_KEY)).toBe(raw);
  for (const bad of ["bad-json", "x".repeat(262145), JSON.stringify({ schema: 99 }), serialize({ ...emptyState() }).replace("supervised.logistic.full.v1", "supervised.logistic.future.v2")]) {
    map.set(STORAGE_KEY, bad); const corrupt = new ModuleStore(port); corrupt.hydrate(); corrupt.save(emptyState()); expect(map.get(STORAGE_KEY)).toBe(bad); expect(corrupt.writable).toBe(false);
  }
  expect(map.get("ml-math-lab:supervised:ev:prototype:v1")).toBe("prototype-unchanged"); expect(map.get("python")).toBe("earlier-mastery");
});
it("restores review to active, validates canonical encoding and rejects invented practice proofs", () => {
  const state = emptyState(); state.draft.phase = "review";
  expect(load(serialize(state)).draft.phase).toBe("active");
  expect(() => load(JSON.stringify(state, null, 2))).toThrow();
  state.practice[0].proof = canonical({ variant: 0, answers: wrong(PRACTICE[0][0]) }); expect(validateState(state)).toBe(false);
});

it("archives a version 1 attempt exactly and starts version 2 without reinterpreting historical mastery", async()=>{
 const { ASSESSMENT, LEGACY_ASSESSMENT, LEGACY_FORMS }=await import("./catalog");
 const old=emptyState();old.assessment=LEGACY_ASSESSMENT;old.revision=7;
 const answers=LEGACY_FORMS[0].map(family=>canonical(family.accepted[0]));
 const summary={...score(0,answers.map(unpack),LEGACY_FORMS),id:"old-pass",form:0,at,assessment:LEGACY_ASSESSMENT};
 old.mastery=summary;old.history=[summary];old.latest={id:"old-pass",form:0,phase:"results",answers,result:summary};
 old.draft={id:"unfinished-v1",form:1,phase:"active",answers:LEGACY_FORMS[1].map(family=>canonical(family.accepted[0])),result:null};
 old.practice[0].answers=canonical(PRACTICE[0][0].accepted[0]);
 const raw=canonical(old),memory=new Map([[STORAGE_KEY,raw]]);
 const store=new ModuleStore({getItem:key=>memory.get(key)??null,setItem:(key,value)=>{memory.set(key,value);}});
 const migrated=store.hydrate();
 expect(memory.get(STORAGE_KEY)).toBe(raw);
 expect(memory.get(`${STORAGE_KEY}:assessment-v1-archive:7`)).toBe(raw);
 expect(migrated.assessment).toBe(ASSESSMENT);
 expect(migrated.mastery).toEqual(summary);expect(migrated.latest).toEqual(old.latest);expect(migrated.history).toEqual(old.history);
 expect(migrated.practice).toEqual(old.practice);expect(migrated.labs).toEqual(old.labs);expect(migrated.transfers).toEqual(old.transfers);
 expect(migrated.draft.answers.every(answer=>unpack(answer).every(item=>item.kind==="unanswered"))).toBe(true);
 expect(migrated.draft.id).not.toBe(old.draft.id);
 expect(store.warning).toMatch(/version 2 starts a fresh attempt/);
 store.save(migrated);expect(load(memory.get(STORAGE_KEY)!).mastery).toEqual(summary);
 expect(memory.get(`${STORAGE_KEY}:assessment-v1-archive:7`)).toBe(raw);
 const reviewed={...store.state,draft:{...store.state.draft,phase:"review" as const}};
 const failed=confirmAttempt(reviewed,true,at);expect(failed.draft.result?.assessment).toBe(ASSESSMENT);
 expect(failed.draft.result?.passed).toBe(false);expect(failed.mastery).toEqual(summary);
 expect(load(serialize(failed)).history[0]).toEqual(summary);
});
it("does not overwrite legacy progress when the archive cannot be saved",async()=>{
 const {LEGACY_ASSESSMENT}=await import("./catalog");const old=emptyState();old.assessment=LEGACY_ASSESSMENT;
 const raw=canonical(old),memory=new Map([[STORAGE_KEY,raw]]);
 const store=new ModuleStore({getItem:key=>memory.get(key)??null,setItem:()=>{throw Error("quota");}});
 store.hydrate();expect(store.writable).toBe(false);store.save(store.state);expect(memory.get(STORAGE_KEY)).toBe(raw);
});
it("uses new transfer tasks, balanced correct-option positions and unchanged mastery gates",()=>{
 const fingerprints=(family:Family)=>JSON.stringify({prompt:family.prompt.split(": ").slice(1).join(": ")||family.prompt,code:family.code,atoms:family.atoms.map(atom=>atom.kind==="choice"?{kind:atom.kind,options:atom.options.map(option=>option.label).sort()}:atom)});
 const practice=new Set(PRACTICE.flat().map(fingerprints));
 expect(FORMS.flat().filter(family=>practice.has(fingerprints(family)))).toHaveLength(0);
 for(const form of FORMS){
  const positions=new Set(form.filter(f=>f.atoms[0].kind==="choice").map(f=>(f.atoms[0] as Extract<typeof f.atoms[0],{kind:"choice"}>).options.findIndex(option=>option.id==="supported")));
  expect(positions.size).toBe(3);expect(form.filter(f=>f.critical)).toHaveLength(6);
 }
});
it("checks the revised numeric keys against independently stated worked calculations",()=>{
 const expected=[
  [0.5,0.8,0.2],
  [-Math.log(0.8),-Math.log(0.8),-Math.log(0.6)],
  [0.2,-0.3,0.4],
  [1,1,2],
 ];
 [0,4,6,10].forEach((objective,row)=>FORMS.forEach((form,column)=>{
  const answer=form[objective].accepted[0][0];expect(answer.kind).toBe("number");
  if(answer.kind==="number")expect(answer.value).toBeCloseTo(expected[row][column],12);
 }));
});
