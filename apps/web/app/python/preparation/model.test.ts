import { describe, expect, it, vi } from "vitest";
import reference from "../../../../../packages/python-contracts/fixtures/preparation-learning.v1.json";
import { gradeFamily, canonical, validateDefinition, type Answer, type Family } from "../foundation/contracts";
import { scoreAssessment } from "../foundation/assessment";
import { acceptedResponse } from "../foundation/test-fixtures";
import { ACTIVITIES, ACTIVITY_REASONS, CATALOG_VALID, CONTENT, INDEPENDENT_FORMS, PRACTICE_FORMS, LESSONS, referenceCase } from "./catalog";
import { alternate, checkActivity, changeActivity, confirmAttempt, emptyState, lessonComplete, load, MASTERY, ModuleStore, practiceSubmit, recover, resetLesson, retry, serialize, STORAGE_KEY, type State } from "./model";
vi.mock("./catalog", async original => ({ ...await original<typeof import("./catalog")>(), MASTERY_AVAILABLE: true }));
const at = "2026-10-16T12:00:00.000Z";
function ready(state = emptyState()): State { return { ...state, draft: { ...state.draft, phase: "review", answers: INDEPENDENT_FORMS[state.draft.form].map(item => structuredClone([...item.accepted[0]])) } }; }
function storage(initial: [string, string][] = []) {
  const data = new Map(initial);
  return { data, port: { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } } };
}
describe("complete preparation reference and assessment contracts", () => {
  it("has exactly 24 families,48 practice,72 independent cases and all authored outcomes", () => {
    expect(LESSONS).toHaveLength(6); expect(CATALOG_VALID).toBe(true);
    expect(PRACTICE_FORMS.flat()).toHaveLength(48); expect(INDEPENDENT_FORMS.flat()).toHaveLength(72);
    const all = [...PRACTICE_FORMS.flat(), ...INDEPENDENT_FORMS.flat()];
    expect(new Set(all.map(item => item.id)).size).toBe(120);
    for (const definition of all) {
      expect(validateDefinition(definition)).toBe(true);
      definition.accepted.forEach((_, index) => expect(gradeFamily(definition, acceptedResponse(definition, index))).toMatchObject({ status: "graded", correct: true }));
      const mode = definition.id.includes(".practice.") ? "practice" : "mastery";
      const variant = ["a", "b", "c"].indexOf(definition.id.split(".").at(-1)!);
      const source = reference.cases.find(item => item.objective === definition.objective && item.mode === mode && item.variant === variant)!;
      expect(definition.code).toBe(source.code);
      expect(definition.explanation).toBe(source.reason);
      const atom = definition.atoms[0];
      if (atom.kind === "choice") expect(atom.options.find(option => option.id === "observed")!.label).toBe(JSON.stringify(source.expected));
      else expect(source.expected).toHaveProperty(atom.kind === "slots" ? "stage_fit_ids" : "coordinate");
      expect(gradeFamily(definition, { ...acceptedResponse(definition), code: "import os" }).status).toBe("invalid");
    }
  });
  it("verifies every reachable experiment state and its matching explanation", () => {
    const duplicate = ACTIVITIES[0][4];
    let unchanged = changeActivity(emptyState(), 0, duplicate.id);
    unchanged.activities[0] = { ...unchanged.activities[0], prediction: duplicate.output, reason: duplicate.reasonId };
    expect(checkActivity(unchanged, 0, at).activities[0].passed).toBe(false);
    ACTIVITIES.forEach((configs, lesson) => {
      expect(configs.length).toBe([9, 7, 7, 6, 9, 6][lesson]);
      configs.forEach(config => {
        expect(reference.cases.some(item => item.code === config.code && JSON.stringify(item.expected) === config.output)).toBe(true);
        expect(ACTIVITY_REASONS(lesson).find(item => item.id === config.reasonId)!.label).toContain(config.reason);
        let state = emptyState();
        state = changeActivity(state, lesson, configs[1].id);
        state = changeActivity(state, lesson, config.id);
        state.activities[lesson] = { ...state.activities[lesson], prediction: config.output, reason: config.reasonId };
        expect(checkActivity(state, lesson, at).activities[lesson].passed).toBe(true);
      });
    });
  });
  it("requires20/24 and both parts of every gate on all3 real forms, never a mosaic", () => {
    INDEPENDENT_FORMS.forEach(definitions => {
      const responses = definitions.map(item => acceptedResponse(item));
      for (const score of [19, 20, 21, 24]) {
        const answers = structuredClone(responses);
        definitions.map((item, index) => ({ item, index })).filter(({ item }) => !item.critical).slice(0, 24 - score).forEach(({ index }) => { answers[index].answers[0].answer = { kind: "unanswered" }; });
        expect(scoreAssessment("preparation", definitions, answers)).toMatchObject({ score, passed: score >= 20 });
      }
      expect(definitions.filter(item => item.critical).map(item => item.objective)).toEqual(["T01.O1", "T01.O2", "T02.O1", "T03.O1", "T04.O1", "T05.O1", "T05.O2", "T06.O1"]);
      definitions.forEach((definition, index) => { if (definition.critical) for (const part of [0, 1]) {
        const answers = structuredClone(responses);
        const atom = definition.atoms[part], correct = definition.accepted[0][part];
        answers[index].answers[part].answer = atom.kind === "slots" ? { kind: "slots", entries: [{ slotId: "fit", optionId: "fold_train" }, { slotId: "new_rows", optionId: "refit" }] } : { kind: "choice", optionId: atom.kind === "choice" ? atom.options.find(option => correct.kind === "choice" && option.id !== correct.optionId)!.id : "invalid" };
        expect(scoreAssessment("preparation", definitions, answers)).toMatchObject({ score: 23, passed: false, failedCritical: [definition.objective] });
      } });
      expect(() => scoreAssessment("preparation", definitions, responses.slice(1))).toThrow();
    });
  });
  it("accepts only complete verified equivalent repairs, preserves shape/type/slot identity", () => {
    for (const definition of [...PRACTICE_FORMS, ...INDEPENDENT_FORMS].map(form => form[17])) {
      expect(definition.accepted).toHaveLength(2);
      const response = acceptedResponse(definition, 1), answer = response.answers[0].answer;
      if (answer.kind !== "slots") throw Error("Expected slots");
      answer.entries.reverse(); expect(gradeFamily(definition, response)).toMatchObject({ correct: true });
      answer.entries.find(item => item.slotId === "new_rows")!.optionId = "refit";
      expect(gradeFamily(definition, response)).toMatchObject({ correct: false });
      answer.entries.push({ slotId: "fit", optionId: "fold_train" });
      expect(gradeFamily(definition, response).status).toBe("invalid");
    }
    expect(referenceCase(3, 1).expected).toHaveProperty("coordinate");
    const numeric: Family = { ...PRACTICE_FORMS[0][0], critical: false, atoms: [{ id: "value", label: "Finite statistic", kind: "number" }], accepted: [[{ kind: "number", value: 1000 }]] };
    for (const value of [1000, 1000 + 1e-7]) expect(gradeFamily(numeric, { familyId: numeric.id, answers: [{ atomId: "value", answer: { kind: "number", value } }] })).toMatchObject({ correct: true });
    for (const value of [1000.1, true, NaN, Infinity, "1000"]) expect(gradeFamily(numeric, { familyId: numeric.id, answers: [{ atomId: "value", answer: { kind: "number", value } }] })).not.toMatchObject({ correct: true });
  });
});
describe("version-scoped mastery and progress", () => {
  it("requires confirmation, restores idempotently, caps history and preserves mastery after failures", () => {
    expect(() => confirmAttempt(ready(), false, at)).toThrow(/confirmation/);
    let state = confirmAttempt(ready(), true, at);
    expect(state.evidence.objectives[MASTERY].mastered).toBe(true);
    expect(confirmAttempt(state, true, at)).toBe(state);
    expect(load(serialize(state))).toEqual(state);
    const awards = canonical(state.evidence.masteryEvidence);
    for (let count = 0; count < 23; count++) {
      state = retry(state, `retry-${count}`);
      state = confirmAttempt({ ...state, draft: { ...state.draft, phase: "review" } }, true, at);
    }
    expect(state.history).toHaveLength(20); expect(canonical(state.evidence.masteryEvidence)).toBe(awards);
    expect(load(serialize(state))).toEqual(state);
    expect(load(serialize(ready(retry(state, "review-reload")))).draft.phase).toBe("active");
    expect(resetLesson(state, 0, true, at).evidence.masteryEvidence).toEqual(state.evidence.masteryEvidence);
  });
  it("leaves missed noncritical objectives unmastered and never imports Essentials evidence", () => {
    const state = ready(); state.draft.answers[2][0] = { kind: "unanswered" };
    const passed = confirmAttempt(state, true, at);
    expect(passed.evidence.objectives[MASTERY].mastered).toBe(true);
    expect(passed.evidence.objectives["python.preparation.t01.o3"]?.mastered ?? false).toBe(false);
    expect(Object.keys(passed.evidence.objectives).every(id => id.startsWith("python.preparation."))).toBe(true);
    const failed = ready(); failed.draft.answers[0][1] = { kind: "unanswered" };
    expect(confirmAttempt(failed, true, at).evidence.masteryEvidence).toEqual([]);
  });
  it("completes all six lessons only with four practice passes and an explained changed experiment", () => {
    let state = emptyState();
    for (let lesson = 0; lesson < 6; lesson++) {
      for (let offset = 0; offset < 4; offset++) { const index = lesson * 4 + offset; state.practice[index].answers = structuredClone([...PRACTICE_FORMS[0][index].accepted[0]]); state = practiceSubmit(state, index, at); }
      expect(lessonComplete(state, lesson)).toBe(false);
      const config = ACTIVITIES[lesson][5]; state = changeActivity(state, lesson, config.id);
      state.activities[lesson] = { ...state.activities[lesson], prediction: config.output, reason: config.reasonId };
      state = checkActivity(state, lesson, at); expect(lessonComplete(state, lesson)).toBe(true);
      expect(load(serialize(state))).toEqual(state);
    }
    expect(state.evidence.masteryEvidence).toEqual([]);
  });
  it("persists all exhausted practice counters and requires changed-case recovery", () => {
    let state = emptyState();
    for (let index = 0; index < 24; index++) {
      for (let variant = 0; variant < 2; variant++) { state = practiceSubmit(state, index, at); state = practiceSubmit(state, index, at); if (!variant) state = alternate(state, index); }
      state = load(serialize(state)); expect(() => practiceSubmit(state, index, at)).toThrow(/exhausted/);
      expect(() => recover(state, index)).toThrow(/Review/);
      state.practice[index] = { ...state.practice[index], reviewed: true, remediation: "observed" };
      state = recover(state, index); expect(state.practice[index]).toMatchObject({ cycle: 1, counts: [0, 0], passed: false });
    }
    state.practice[17].answers[0] = { kind: "slots", entries: [{ slotId: "fit", optionId: "local_train" }] };
    expect(load(serialize(state))).toEqual(state);
    expect(() => practiceSubmit(state, 17, at)).toThrow(/Unsupported/);
  });
  it("preserves corrupt/future/foreign/noncanonical bytes, handles denied/quota/stale writes and isolates reset", () => {
    const raw = serialize(emptyState());
    for (const bad of ["{bad", raw.replace('"schema":1', '"schema":2'), raw.replace(CONTENT, "python.essentials.1.0.0"), raw.replace('"schema":1', '"schema":1,"schema":1'), JSON.stringify(emptyState(), null, 2), "a".repeat(262145)]) {
      const { data, port } = storage([[STORAGE_KEY, bad], ["ml-math-lab:python:essentials:v2", "keep"]]);
      const store = new ModuleStore(port); store.hydrate(); store.save(emptyState());
      expect(data.get(STORAGE_KEY)).toBe(bad); expect(store.warning).toContain("not saved");
      store.reset(true); expect(data.get("ml-math-lab:python:essentials:v2")).toBe("keep");
    }
    const { data, port } = storage(); const store = new ModuleStore(port);
    expect(() => store.save(emptyState())).toThrow(/Hydrate/); store.hydrate(); data.set(STORAGE_KEY, raw); store.save(emptyState()); expect(store.writable).toBe(false);
    for (const denied of [false, true]) {
      const failing = new ModuleStore({ getItem: () => { if (denied) throw Error("Denied"); return null; }, setItem: () => { throw Error("Quota"); } });
      failing.hydrate(); failing.save(emptyState()); expect(failing.warning).toContain("not saved");
    }
  });
});
