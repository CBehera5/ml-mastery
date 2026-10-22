import { expect, it, vi } from "vitest";
vi.mock("./catalog", async importOriginal => {
  const actual = await importOriginal<typeof import("./catalog")>();
  return { ...actual, MASTERY_AVAILABLE: true };
});
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { canonical, gradeFamily, type Answer, type Family } from "../../python/foundation/contracts";
import { configurations, FORMS, LABS, MASTERY_AVAILABLE, OBJECTIVES, PRACTICE, PREDICTIONS, response, score, VALID_CATALOG } from "./catalog";
import { alternate, changeLab, confirmAttempt, emptyState, explainLab, lessonComplete, load, ModuleStore, practiceSubmit, recover, resetLab, retry, revealLab, serialize, STORAGE_KEY, unpack, validateState } from "./model";

const at = "2026-10-17T12:00:00Z";
it("preserves all raw frozen outcomes and the approved noncritical smoothing mapping", () => {
  for (const [lab, file] of ["dt-e1.manifest.v1.json", "dt-e2.manifest.v1.json"].entries()) {
    const raw = JSON.parse(readFileSync(fileURLToPath(new URL(`../../../../../docs/verification/decision-trees/${file}`, import.meta.url)), "utf8"));
    for (const config of configurations(lab)) {
      const reference = raw.configurations.find((entry: { id: string }) => entry.id === config.id);
      expect(config.expected).toEqual(reference.expected);
      expect(config.reasonId).toBe(reference.correct_reason_id);
    }
  }
  expect(PRACTICE[0][4]).toMatchObject({ objective: "DT02.O1", critical: false });
  expect(PRACTICE[0][5]).toMatchObject({ objective: "DT02.O2", critical: true });
});
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
  expect(configurations(0)).toHaveLength(37); expect(configurations(1)).toHaveLength(32);
  expect(PREDICTIONS.length).toBeGreaterThan(3);
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
  const family = PRACTICE[0].find(item => item.atoms.length === 1 && item.atoms[0].kind === "number")!;
  const expected = (family.accepted[0][0] as { value: number }).value;
  expect(gradeFamily(family, response(family, [{ kind: "number", value: expected + 5e-10 }]))).toMatchObject({ correct: true });
  expect(gradeFamily(family, response(family, [{ kind: "number", value: expected + 2 * (1e-9 + 1e-9 * Math.abs(expected)) }]))).toMatchObject({ status: "graded", correct: false });
  for (const value of [NaN, Infinity, "1/2", "0.2", true, {}, 1e7]) expect(gradeFamily(family, response(family, [{ kind: "number", value } as Answer])).status).toBe("invalid");
  expect(score(0, FORMS[0].map(family => family.atoms.map(() => ({ kind: "unanswered" }))))).toMatchObject({ score: 0, passed: false });
  const repair = PRACTICE[0][12], answer = correct(repair);
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
  state.labs[lab].prediction = config.predictionOptions[0].id; state.labs[lab].reason = "causal"; state = revealLab(state, lab);
  expect(() => explainLab(state, lab)).toThrow();
  state.labs[lab].reason = String(config.reasonId); state = explainLab(state, lab);
  expect(state.labs[lab].credit?.config).toBe(config.id);
  expect(validateState(state)).toBe(true);
  expect(load(serialize(state)).labs[lab].credit).toEqual(state.labs[lab].credit);
  state = resetLab(state, lab); expect(state.labs[lab].revealed).toBe(false); expect(state.labs[lab].credit).not.toBeNull();
  expect(state.mastery).toBeNull();
});
it("preserves every frozen output hash", () => {
 const directory=fileURLToPath(new URL("../../../../../docs/verification/decision-trees/",import.meta.url));
 const lock=JSON.parse(readFileSync(directory+"freeze-lock.v1.json","utf8"));
 for(const [file,expected] of Object.entries(lock.sha256))expect(createHash("sha256").update(readFileSync(directory+file)).digest("hex")).toBe(expected);
 expect(configurations(1).filter(item=>item.expected.tag === "rejected")).toHaveLength(3);
});
it("requires all practice, explained activity and transfer for completion, never mastery", () => {
  let state = emptyState();
  for (let index = 0; index < 4; index++) { state.practice[index].answers = canonical(correct(PRACTICE[0][index])); state = practiceSubmit(state, index); }
  expect(lessonComplete(state, 0)).toBe(false);
  state = changeLab(state, 0, configurations(0)[1].id); state.labs[0].prediction = configurations(0)[1].predictionOptions[0].id; state.labs[0].reason = "causal"; state = revealLab(state, 0); state.labs[0].reason = String(configurations(0)[1].reasonId); state = explainLab(state, 0);
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
  for (const bad of ["bad-json", "x".repeat(262145), JSON.stringify({ schema: 99 }), serialize({ ...emptyState() }).replace("supervised.decision-trees.full.v1", "supervised.decision-trees.future.v2")]) {
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
