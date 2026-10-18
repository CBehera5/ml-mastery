import { webcrypto } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import reference from "../../../../../packages/python-contracts/fixtures/essentials.v1.json";
import { gradeFamily, canonical, validateDefinition, type Answer } from "../foundation/contracts";
import { MODULE_POLICIES, scoreAssessment } from "../foundation/assessment";
import { emptyProgress, serializeProgress, STORAGE_KEY as P01_KEY, submitPractice, chooseExperiment, checkExperiment } from "../foundation/progress";
import { acceptedResponse } from "../foundation/test-fixtures";
import { PRACTICE } from "../foundation/fixtures";
import { ACTIVITIES, CATALOG_VALID, CONTENT, INDEPENDENT_FORMS, MASTERY_AVAILABLE, PRACTICE_FORMS, LESSONS, SOURCE_MAP } from "./catalog";
import { alternate, checkActivity, changeActivity, confirmAttempt, copyP01, emptyState, familyResponse, lessonComplete, load, MASTERY, ModuleStore, practiceSubmit, previewP01, recover, recoveryAnswer, resetLesson, retry, serialize, STORAGE_KEY, type State } from "./model";
vi.mock("./catalog", async original => ({ ...await original<typeof import("./catalog")>(), MASTERY_AVAILABLE: true }));
const at = "2026-10-16T12:00:00.000Z";
function correctAnswers(form: number): Answer[][] { return INDEPENDENT_FORMS[form].map(definition => structuredClone([...definition.accepted[0]])); }
function readyAttempt(state = emptyState()): State { return { ...state, draft: { ...state.draft, phase: "review", answers: correctAnswers(state.draft.form) } }; }
function completedP01() {
  let source = emptyProgress();
  for (let index = 0; index < 4; index++) source = submitPractice(source, index, acceptedResponse(PRACTICE[index][0]), at).progress;
  source = chooseExperiment(source, "text");
  return checkExperiment({ ...source, experiment: { ...source.experiment, prediction: "'222'", reason: "repeat" } }, at);
}
function storage(initial: [string, string][] = []) {
  const data = new Map(initial);
  return { data, port: { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } } };
}
describe("complete Essentials catalog and reference coverage", () => {
  it("has 8 lessons, 32 families, 64 practice and 96 independent instances", () => {
    expect(LESSONS).toHaveLength(8);
    expect(CATALOG_VALID).toBe(true);
    expect(PRACTICE_FORMS.flat()).toHaveLength(64);
    expect(INDEPENDENT_FORMS.flat()).toHaveLength(96);
    const all = [...PRACTICE_FORMS.flat(), ...INDEPENDENT_FORMS.flat()];
    expect(new Set(all.map(item => item.id)).size).toBe(160);
    for (const definition of all) {
      expect(validateDefinition(definition)).toBe(true);
      definition.accepted.forEach((_, index) => expect(gradeFamily(definition, acceptedResponse(definition, index))).toMatchObject({ status: "graded", correct: true }));
      const wrong = acceptedResponse(definition);
      wrong.answers[0].answer = { kind: "unanswered" };
      expect(gradeFamily(definition, wrong)).toMatchObject({ status: "graded", correct: false });
      expect(gradeFamily(definition, { ...wrong, source: "import os" }).status).toBe("invalid");
    }
    expect(LESSONS.flatMap(item => item.objectives).filter(item => item.introductory).map(item => item.id)).toEqual(["P08.O4"]);
    expect(reference.cases).toHaveLength(168);
    reference.cases.forEach(item => expect(JSON.stringify(item.expected)).not.toBe(JSON.stringify(item.wrong)));
  });
  it("covers every exposed experiment with finite trusted output and no program-input dispatch", () => {
    expect(ACTIVITIES).toHaveLength(8);
    expect(ACTIVITIES.every(items => items.length > 1 && items.length <= 64)).toBe(true);
    for (let lesson = 1; lesson < 8; lesson++) for (const item of ACTIVITIES[lesson]) {
      expect(reference.cases.some(source => source.code === item.code && JSON.stringify(source.expected) === item.output)).toBe(true);
    }
    for (let form = 0; form < 3; form++) for (let index = 4; index < 32; index++) {
      const definition = INDEPENDENT_FORMS[form][index];
      const source = reference.cases.find(item => item.mode === "mastery" && item.variant === form && item.objective === definition.objective)!;
      expect(definition.code).toBe(source.code);
      const atom = definition.atoms[0];
      if (atom.kind !== "choice") throw Error("Expected finite choice");
      expect(atom.options.find(option => option.id === "observed")!.label).toBe(JSON.stringify(source.expected));
    }
  });
});
describe("real complete assessment gates on every form", () => {
  it("requires 26/32 and all eight critical decision/reason pairs without attempt mosaics", () => {
    for (let form = 0; form < 3; form++) {
      const definitions = INDEPENDENT_FORMS[form], correct = definitions.map(item => acceptedResponse(item));
      for (const score of [25, 26, 27, 32]) {
        const responses = structuredClone(correct);
        definitions.map((definition, index) => ({ definition, index })).filter(item => !item.definition.critical).slice(0, 32 - score).forEach(({ index }) => { responses[index].answers[0].answer = { kind: "unanswered" }; });
        expect(scoreAssessment("essentials", definitions, responses)).toMatchObject({ score, passed: score >= 26 });
      }
      expect(definitions.filter(item => item.critical).map(item => item.objective)).toEqual([...MODULE_POLICIES[0].critical]);
      for (let index = 0; index < 32; index++) if (definitions[index].critical) for (const part of [0, 1]) {
        const responses = structuredClone(correct); responses[index].answers[part].answer = { kind: "unanswered" };
        expect(scoreAssessment("essentials", definitions, responses)).toMatchObject({ score: 31, passed: false, failedCritical: [definitions[index].objective] });
      }
      expect(() => scoreAssessment("essentials", definitions, correct.slice(1))).toThrow();
      expect(() => scoreAssessment("essentials", definitions, [...correct.slice(1), correct[1]])).toThrow();
    }
  });
  it("gates availability on verification, preserves mastery on later failure and caps/idempotently restores history", () => {
    if (!MASTERY_AVAILABLE) { expect(() => confirmAttempt(readyAttempt(), true, at)).toThrow(/verification/); return; }
    expect(() => confirmAttempt(readyAttempt(), false, at)).toThrow(/confirmation/);
    let state = confirmAttempt(readyAttempt(), true, at);
    expect(state.evidence.objectives[MASTERY].mastered).toBe(true);
    expect(confirmAttempt(state, true, at)).toBe(state);
    expect(load(serialize(state))).toEqual(state);
    const awarded = canonical(state.evidence.masteryEvidence);
    for (let attempt = 1; attempt < 24; attempt++) {
      state = retry(state, `retry-${attempt}`);
      state = confirmAttempt({ ...state, draft: { ...state.draft, phase: "review" } }, true, at);
    }
    expect(state.history).toHaveLength(20);
    expect(canonical(state.evidence.masteryEvidence)).toBe(awarded);
    expect(state.evidence.objectives[MASTERY].mastered).toBe(true);
    expect(load(serialize(state))).toEqual(state);
    const reviewed = readyAttempt(retry(state, "another"));
    expect(load(serialize(reviewed)).draft.phase).toBe("active");
    const reset = resetLesson(state, 0, true, at);
    expect(reset.evidence.objectives[MASTERY].mastered).toBe(true);
    expect(reset.evidence.masteryEvidence).toEqual(state.evidence.masteryEvidence);
    expect(load(serialize(reset))).toEqual(reset);
  });
  it("does not master missed noncritical objectives in an otherwise passing attempt", () => {
    if (!MASTERY_AVAILABLE) return;
    const state = readyAttempt();
    state.draft.answers[0][0] = { kind: "unanswered" };
    const passed = confirmAttempt(state, true, at);
    expect(passed.evidence.objectives[MASTERY].mastered).toBe(true);
    expect(passed.evidence.objectives["python.essentials.p01.o1"]?.mastered ?? false).toBe(false);
    expect(passed.evidence.objectives["python.essentials.p01.o2"].mastered).toBe(true);
  });
});
describe("practice/activity and progress contracts", () => {
  it("requires every lesson's four families and changed explained activity, never mastery", () => {
    let state = emptyState();
    for (let lesson = 0; lesson < 8; lesson++) {
      for (let offset = 0; offset < 4; offset++) {
        const index = lesson * 4 + offset;
        state.practice[index].answers = structuredClone([...PRACTICE_FORMS[0][index].accepted[0]]);
        state = practiceSubmit(state, index, at);
      }
      expect(lessonComplete(state, lesson)).toBe(false);
      const config = ACTIVITIES[lesson][1];
      state = changeActivity(state, lesson, config.id);
      state.activities[lesson] = { ...state.activities[lesson], prediction: config.output, reason: config.reasonId };
      state = checkActivity(state, lesson, at);
      expect(lessonComplete(state, lesson)).toBe(true);
      expect(load(serialize(state))).toEqual(state);
    }
    expect(state.evidence.masteryEvidence).toEqual([]);
  });
  it("persists exhausted practice, targeted recovery, partial legal drafts and counters", () => {
    let state = emptyState();
    for (let index = 0; index < 32; index++) {
      for (let variant = 0; variant < 2; variant++) {
        state = practiceSubmit(state, index, at); state = practiceSubmit(state, index, at);
        if (variant === 0) state = alternate(state, index);
      }
      state = load(serialize(state));
      expect(() => practiceSubmit(state, index, at)).toThrow(/exhausted/);
      expect(() => recover(state, index)).toThrow(/Review/);
      state.practice[index] = { ...state.practice[index], reviewed: true, remediation: recoveryAnswer(index) };
      state = recover(state, index);
      expect(state.practice[index]).toMatchObject({ cycle: 1, counts: [0, 0], passed: false });
    }
    state.practice[3].answers = [{ kind: "slots", entries: [{ slotId: "expression", optionId: "distributed" }] }];
    expect(load(serialize(state))).toEqual(state);
    expect(() => practiceSubmit(state, 3, at)).toThrow(/Unsupported/);
  });
  it("preserves corrupt/future/foreign/duplicate/noncanonical records and warns on quota/stale writes", () => {
    const raw = serialize(emptyState());
    for (const bad of ["{bad", raw.replace('"schema":2', '"schema":3'), raw.replace('"content":"' + CONTENT + '"', '"content":"future"'), raw.replace('"schema":2', '"schema":2,"schema":2'), JSON.stringify(emptyState(), null, 2), "a".repeat(262145)]) {
      const { data, port } = storage([[STORAGE_KEY, bad], [P01_KEY, "keep"]]);
      const store = new ModuleStore(port); store.hydrate(); store.save(emptyState());
      expect(store.warning).toContain("not saved"); expect(data.get(STORAGE_KEY)).toBe(bad); expect(data.get(P01_KEY)).toBe("keep");
    }
    const { data, port } = storage();
    const store = new ModuleStore(port);
    expect(() => store.save(emptyState())).toThrow(/Hydrate/);
    store.hydrate(); data.set(STORAGE_KEY, raw);
    store.save(emptyState()); expect(store.writable).toBe(false);
    const quota = new ModuleStore({ getItem: () => null, setItem: () => { throw Error("Quota"); } });
    quota.hydrate(); quota.save(emptyState()); expect(quota.warning).toContain("not saved");
    const denied = new ModuleStore({ getItem: () => { throw Error("Denied"); }, setItem: () => { throw Error("Denied"); } });
    denied.hydrate(); expect(denied.writable).toBe(false);
  });
});
describe("explicit copy-only P01 transition", () => {
  it("previews, confirms, atomically copies only compatible practice/completion and is idempotent", async () => {
    vi.stubGlobal("crypto", webcrypto);
    try {
      const original = serializeProgress(completedP01()), { data, port } = storage([[P01_KEY, original], ["math", "mastery-preserve"]]);
      const store = new ModuleStore(port); store.hydrate();
      const preview = await previewP01(port);
      expect(preview.completed).toBe(4); expect(preview.lessonCompleted).toBe(true);
      expect(data.has(STORAGE_KEY)).toBe(false);
      expect(() => store.transfer(preview, false, at)).toThrow(/confirmation/);
      const copied = store.transfer(preview, true, at);
      expect(lessonComplete(copied, 0)).toBe(true);
      expect(copied.evidence.masteryEvidence).toEqual([]);
      expect(copied.evidence.assessmentAttempts).toEqual([]);
      expect(copied.transfer).toMatchObject({ map: SOURCE_MAP, sourceVersion: "python-p01.1.0.0" });
      expect(data.get(P01_KEY)).toBe(original);
      expect(data.get("math")).toBe("mastery-preserve");
      expect(store.transfer(preview, true, at)).toBe(copied);
      expect(load(data.get(STORAGE_KEY)!)).toEqual(copied);
      expect(Object.values(copied.evidence.objectives).every(item => !item.mastered)).toBe(true);
    } finally { vi.unstubAllGlobals(); }
  });
  it("preserves source/target on failed writes, stale previews, incompatible records and existing module P01 work", async () => {
    vi.stubGlobal("crypto", webcrypto);
    try {
      const source = serializeProgress(completedP01());
      const { data, port } = storage([[P01_KEY, source]]);
      const preview = await previewP01(port);
      const initial = serialize(emptyState());
      const quota = new ModuleStore({ getItem: key => key === P01_KEY ? source : initial, setItem: () => { throw Error("Quota"); } });
      quota.hydrate();
      expect(() => quota.transfer(preview, true, at)).toThrow(/not saved/);
      expect(quota.state.transfer).toBeNull();
      const stale = new ModuleStore(port); stale.hydrate(); data.set(P01_KEY, serializeProgress(emptyProgress()));
      expect(() => stale.transfer(preview, true, at)).toThrow(/changed after preview/);
      expect(data.has(STORAGE_KEY)).toBe(false);
      const busy = emptyState(); busy.practice[0].counts[0] = 1;
      expect(() => copyP01(busy, preview, true, at)).toThrow(/already has work/);
      for (const bad of ["{bad", source.replace("python-p01.1.0.0", "future"), source.replace('"scope":"essentials"', '"scope":"other"')]) {
        await expect(previewP01(storage([[P01_KEY, bad]]).port)).rejects.toThrow(/corrupt or unsupported/);
      }
    } finally { vi.unstubAllGlobals(); }
  });
  it("copies legal partial drafts, counters and remediation without importing feedback or fabricating completion", async () => {
    vi.stubGlobal("crypto", webcrypto);
    try {
      const partial = emptyProgress();
      partial.practice[3].response = [{ kind: "slots", entries: [{ slotId: "expression", optionId: "distributed" }] }];
      partial.practice[0].counts = [2, 2]; partial.practice[0].reviewed = true; partial.practice[0].counterexample = "0";
      const raw = serializeProgress(partial), preview = await previewP01(storage([[P01_KEY, raw]]).port);
      const copied = copyP01(emptyState(), preview, true, at);
      expect(copied.practice[0]).toMatchObject({ counts: [2, 2], reviewed: true, remediation: "0", last: null });
      expect(copied.practice[3].answers).toEqual(partial.practice[3].response);
      expect(lessonComplete(copied, 0)).toBe(false);
      expect(load(serialize(copied))).toEqual(copied);
    } finally { vi.unstubAllGlobals(); }
  });
});
