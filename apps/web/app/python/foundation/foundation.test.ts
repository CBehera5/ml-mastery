import { describe, expect, it } from "vitest";
import { bounded, bytes, canonical, closeNumber, gradeFamily, validateDefinition, validDraftAnswer, type Family } from "./contracts";
import { EXPERIMENT, OBJECTIVES, PRACTICE } from "./fixtures";
import { acceptedResponse, INDEPENDENT_TEST_ONLY, syntheticAssessment, unansweredResponse } from "./test-fixtures";
import { decodeAssessmentDraft, encodeAssessmentDraft, MODULE_POLICIES, retainAttemptSummaries, restoreDraft, retryAttempt, reviewAttempt, scoreAssessment, submitAttempt, type Draft } from "./assessment";
import { alternatePractice, checkExperiment, chooseExperiment, emptyProgress, loadProgress, ProgressStore, RECOVERY_ANSWERS, recoverPractice, resetLessonPractice, serializeProgress, STORAGE_KEY, submitPractice } from "./progress";

const now = "2026-10-16T12:00:00.000Z";
describe("P01 immutable fixtures and strict finite adapters", () => {
  it("has exactly eight practice and twelve independent test-only family instances", () => {
    const definitions = [...PRACTICE.flat(), ...INDEPENDENT_TEST_ONLY.flat()];
    expect(PRACTICE.flat()).toHaveLength(8);
    expect(INDEPENDENT_TEST_ONLY.flat()).toHaveLength(12);
    expect(new Set(definitions.map(item => item.id)).size).toBe(20);
    for (const item of definitions) {
      expect(validateDefinition(item)).toBe(true);
      item.accepted.forEach((_, index) => expect(gradeFamily(item, acceptedResponse(item, index))).toMatchObject({ status: "graded", correct: true }));
      expect(gradeFamily(item, unansweredResponse(item))).toMatchObject({ status: "graded", correct: false });
    }
    expect(Object.isFrozen(PRACTICE[0][0].atoms)).toBe(true);
    expect(EXPERIMENT).toHaveLength(6);
  });
  it("requires both critical atoms, including units and string reasoning", () => {
    for (const definition of [...PRACTICE[1], ...INDEPENDENT_TEST_ONLY[1]]) {
      for (const position of [0, 1]) {
        const response = acceptedResponse(definition);
        response.answers[position].answer = { kind: "unanswered" };
        expect(gradeFamily(definition, response)).toMatchObject({ correct: false });
      }
      const response = acceptedResponse(definition);
      response.answers[0].answer = { kind: "choice", optionId: "dollars" };
      expect(gradeFamily(definition, response)).toMatchObject({ correct: false });
    }
  });
  it("accepts both whole repairs but rejects plausible wrong grouping and extra/duplicate slots", () => {
    const definition = PRACTICE[3][0];
    for (const tuple of [0, 1]) expect(gradeFamily(definition, acceptedResponse(definition, tuple))).toMatchObject({ correct: true });
    const response = acceptedResponse(definition);
    const answer = response.answers[0].answer;
    if (answer.kind !== "slots") throw Error("Expected slots");
    answer.entries[0].optionId = "ungrouped";
    expect(gradeFamily(definition, response)).toMatchObject({ status: "graded", correct: false });
    answer.entries.push({ ...answer.entries[0] });
    expect(gradeFamily(definition, response).status).toBe("invalid");
    expect(validDraftAnswer({ kind: "slots", entries: [{ slotId: "expression", optionId: "grouped" }] }, definition.atoms[0])).toBe(true);
    expect(gradeFamily(definition, { ...response, answers: [{ atomId: "repair", answer: { kind: "slots", entries: [] } }] }).status).toBe("invalid");
  });
  it("does not assemble a hybrid from distinct equivalent whole tuples", () => {
    const definition: Family = { ...PRACTICE[1][0], accepted: [[{ kind: "choice", optionId: "correct" }, { kind: "choice", optionId: "numeric_order" }], [{ kind: "choice", optionId: "text" }, { kind: "choice", optionId: "text_numeric" }]] };
    const response = acceptedResponse(definition);
    response.answers[1].answer = { kind: "choice", optionId: "text_numeric" };
    expect(gradeFamily(definition, response)).toMatchObject({ correct: false });
  });
  it("enforces tolerance inclusively and rejects coercion/nonfinite/oversized or arbitrary source", () => {
    expect(closeNumber(1e-9, 0)).toBe(true);
    expect(closeNumber(1.00001e-9, 0)).toBe(false);
    expect(closeNumber(100 + 1e-8, 100)).toBe(true);
    expect(closeNumber(100 + 1e-5, 100)).toBe(false);
    const definition = PRACTICE[2][0];
    for (const value of [true, "3", NaN, Infinity, 1000001]) {
      const response = acceptedResponse(definition);
      (response.answers[0] as unknown as { answer: unknown }).answer = { kind: "number", value };
      expect(gradeFamily(definition, response).status).toBe("invalid");
    }
    for (const response of [{}, null, "import os", { ...acceptedResponse(definition), extra: "x" }, JSON.parse('{"__proto__":{"polluted":true}}')]) expect(gradeFamily(definition, response).status).toBe("invalid");
    expect(bounded({ value: "a".repeat(65524) })).toBe(true);
    expect(bounded({ value: "a".repeat(65525) })).toBe(false);
    expect(bounded([[[[[[[[["too deep"]]]]]]]]])).toBe(false);
    expect(validateDefinition({ ...definition, code: "\n".repeat(25) })).toBe(false);
    expect(validateDefinition({ ...definition, accepted: Array(9).fill(definition.accepted[0]) })).toBe(false);
    expect(gradeFamily({ ...definition, atoms: [] }, acceptedResponse(definition)).status).toBe("invalid");
    expect(gradeFamily({ ...definition, atoms: null } as never, acceptedResponse(definition)).status).toBe("invalid");
    expect(gradeFamily({ ...definition, code: true } as never, acceptedResponse(definition)).status).toBe("invalid");
    const extraArrayKey = [1, 2];
    Object.defineProperty(extraArrayKey, "__proto__", { value: "unsafe", enumerable: true });
    expect(bounded(extraArrayKey)).toBe(false);
  });
});

describe("synthetic module policy contracts — never learner mastery", () => {
  it("covers all six thresholds, all 41 gates and each critical atom on all three forms", () => {
    expect(MODULE_POLICIES.reduce((total, item) => total + item.critical.length, 0)).toBe(41);
    for (const policy of MODULE_POLICIES) for (const form of [0, 1, 2] as const) {
      const definitions = syntheticAssessment(policy.module, form);
      const correct = definitions.map(item => acceptedResponse(item));
      expect(scoreAssessment(policy.module, definitions, correct).passed).toBe(true);
      const noncritical = definitions.map((definition, index) => ({ definition, index })).filter(item => !item.definition.critical);
      const threshold = Math.ceil(policy.count * .8);
      for (const score of [threshold - 1, threshold, threshold + 1]) {
        const responses = structuredClone(correct);
        noncritical.slice(0, policy.count - score).forEach(({ definition, index }) => { responses[index] = unansweredResponse(definition); });
        expect(scoreAssessment(policy.module, definitions, responses)).toMatchObject({ score, passed: score >= threshold });
      }
      for (const critical of policy.critical) {
        const index = definitions.findIndex(item => item.objective === critical);
        for (const atom of [0, 1]) {
          const responses = structuredClone(correct);
          responses[index].answers[atom].answer = { kind: "unanswered" };
          expect(scoreAssessment(policy.module, definitions, responses)).toMatchObject({ passed: false, failedCritical: [critical], score: policy.count - 1 });
        }
      }
      expect(() => scoreAssessment(policy.module, definitions, correct.slice(1))).toThrow();
      expect(() => scoreAssessment(policy.module, definitions, [...correct.slice(1), correct[1]])).toThrow();
    }
  });
  it("rejects partial P01 as a module assessment and requires review/confirmation/idempotence", () => {
    expect(() => scoreAssessment("essentials", PRACTICE.map(items => items[0]), PRACTICE.map(items => acceptedResponse(items[0])))).toThrow();
    const definitions = syntheticAssessment("essentials", 0);
    const active: Draft = { id: "attempt-1", form: 0, phase: "active", responses: definitions.map(item => acceptedResponse(item)), result: null };
    expect(() => submitAttempt(active, true, "essentials", definitions)).toThrow();
    const reviewed = reviewAttempt(active);
    expect(restoreDraft(reviewed).phase).toBe("active");
    expect(() => submitAttempt(reviewed, false, "essentials", definitions)).toThrow();
    const submitted = submitAttempt(reviewed, true, "essentials", definitions);
    expect(decodeAssessmentDraft(encodeAssessmentDraft(reviewed, "essentials", definitions), "essentials", definitions).phase).toBe("active");
    expect(decodeAssessmentDraft(encodeAssessmentDraft(submitted, "essentials", definitions), "essentials", definitions)).toEqual(submitted);
    expect(() => decodeAssessmentDraft(encodeAssessmentDraft(submitted, "essentials", definitions), "numpy", definitions)).toThrow();
    expect(() => decodeAssessmentDraft(encodeAssessmentDraft(submitted, "essentials", definitions).replace('"policy":"python-policy.1.0.0"', '"policy":"future"'), "essentials", definitions)).toThrow();
    expect(() => encodeAssessmentDraft({ ...submitted, result: { ...submitted.result!, score: 0 } }, "essentials", definitions)).toThrow();
    const firstFailure = structuredClone(active.responses);
    firstFailure[definitions.findIndex(item => item.objective === "P01.O2")].answers[1].answer = { kind: "unanswered" };
    const secondFailure = structuredClone(active.responses);
    secondFailure[definitions.findIndex(item => item.objective === "P02.O2")].answers[1].answer = { kind: "unanswered" };
    expect(scoreAssessment("essentials", definitions, firstFailure).passed).toBe(false);
    expect(scoreAssessment("essentials", definitions, secondFailure).passed).toBe(false);
    expect(submitAttempt(submitted, true, "essentials", definitions)).toBe(submitted);
    expect(restoreDraft(submitted)).toBe(submitted);
    expect(retryAttempt(submitted, "attempt-2")).toMatchObject({ form: 1, phase: "active", responses: [], result: null });
    expect(retryAttempt({ ...submitted, form: 2 }, "attempt-4").form).toBe(0);
    let summaries: { id: string }[] = [];
    for (let index = 0; index < 50; index++) summaries = retainAttemptSummaries(summaries, { id: String(index) });
    expect(summaries).toHaveLength(20);
    expect(retainAttemptSummaries(summaries, { id: "49" })).toHaveLength(20);
    expect(() => retainAttemptSummaries([], { id: "a".repeat(2048) })).toThrow();
    expect(emptyProgress().evidence.masteryEvidence).toEqual([]);
  });
});

describe("P01 bounded progress, recovery and strict restoration", () => {
  it("requires four practice families plus changed experiment and explanation; never mastery", () => {
    let progress = emptyProgress();
    progress = { ...progress, experiment: { ...progress.experiment, prediction: "250", reason: "weighted" } };
    progress = checkExperiment(progress, now);
    expect(progress.experiment.passed).toBe(false);
    for (let index = 0; index < 4; index++) progress = submitPractice(progress, index, acceptedResponse(PRACTICE[index][0]), now).progress;
    expect(progress.evidence.lessons["python.essentials.p01"].state).toBe("started");
    progress = chooseExperiment(progress, "text");
    progress = { ...progress, experiment: { ...progress.experiment, prediction: "'222'", reason: "weighted" } };
    progress = checkExperiment(progress, now);
    expect(progress.experiment.passed).toBe(false);
    progress = checkExperiment({ ...progress, experiment: { ...progress.experiment, reason: "repeat" } }, now);
    expect(progress.evidence.lessons["python.essentials.p01"].state).toBe("completed");
    expect(Object.values(progress.evidence.objectives).every(item => !item.mastered)).toBe(true);
    expect(progress.evidence.masteryEvidence).toEqual([]);
    expect(loadProgress(serializeProgress(progress))).toEqual(progress);
    expect(resetLessonPractice(progress, false)).toBe(progress);
    expect(resetLessonPractice(progress, true)).toEqual(emptyProgress());
    expect(OBJECTIVES.every(id => progress.evidence.objectives[id].completed)).toBe(true);
  });
  it("persists exhaustion/remediation and requires the matching counterexample for each objective", () => {
    for (let index = 0; index < 4; index++) {
      let progress = emptyProgress();
      expect(submitPractice(progress, index, {}, now).progress).toBe(progress);
      for (const variant of [0, 1]) {
        for (let attempt = 0; attempt < 2; attempt++) progress = submitPractice(progress, index, unansweredResponse(PRACTICE[index][variant]), now).progress;
        if (variant === 0) progress = alternatePractice(progress, index);
      }
      progress = loadProgress(serializeProgress(progress));
      expect(progress.practice[index].counts).toEqual([2, 2]);
      expect(submitPractice(progress, index, acceptedResponse(PRACTICE[index][1]), now).result.status).toBe("invalid");
      expect(recoverPractice(progress, index, RECOVERY_ANSWERS[index], false)).toBe(progress);
      expect(recoverPractice(progress, index, "wrong", true)).toBe(progress);
      const saturated = structuredClone(progress);
      saturated.practice[index].cycle = 1e6;
      expect(recoverPractice(saturated, index, RECOVERY_ANSWERS[index], true).practice[index]).toMatchObject({ cycle: 1e6, counts: [0, 0] });
      progress = recoverPractice(progress, index, RECOVERY_ANSWERS[index], true);
      expect(progress.practice[index]).toMatchObject({ cycle: 1, variant: 0, counts: [0, 0], passed: false });
      expect(loadProgress(serializeProgress(progress))).toEqual(progress);
    }
  });
  it("preserves raw corrupt/future/wrong-scope/duplicate/noncanonical storage", () => {
    const raw = serializeProgress(emptyProgress());
    expect(loadProgress(null)).toEqual(emptyProgress());
    for (const invalid of ["", "{bad", raw.replace('"scope":"essentials"', '"scope":"numpy"'), raw.replace('"envelopeVersion":1', '"envelopeVersion":2'), raw.replace('"scope":"essentials"', '"scope":"essentials","scope":"essentials"'), JSON.stringify(emptyProgress(), null, 2), raw.replace('"policy":"python-policy.1.0.0"', '"policy":"future"'), raw.replace('"content":"python-p01.1.0.0"', '"content":"future"'), raw.replace('"environment":"macos-arm64-cpython-3.13.16-reference.1"', '"environment":"future"'), "x".repeat(262145)]) {
      const writes: string[] = [];
      const store = new ProgressStore({ getItem: () => invalid, setItem: (_, value) => { writes.push(value); } });
      store.hydrate(); store.save(emptyProgress());
      expect(store.writable).toBe(false); expect(writes).toEqual([]); expect(store.warning).toContain("not saved");
      store.resetModule(false);
      expect(writes).toEqual([]);
      store.resetModule(true);
      expect(writes).toEqual([serializeProgress(emptyProgress())]);
      expect(store.writable).toBe(true);
    }
  });
  it("hydrates before writing, isolates keys, preserves earlier bytes on quota and bounds repeated evidence", () => {
    const data = new Map([["ml-math-lab:evidence:math.statistics:v1", "old-mastery"], ["ml-math-lab:regression:v1", "old-regression"]]);
    const store = new ProgressStore({ getItem: key => data.get(key) ?? null, setItem: (key, value) => { data.set(key, value); } });
    expect(() => store.save(emptyProgress())).toThrow();
    store.hydrate();
    for (let index = 0; index < 200; index++) store.save(submitPractice(emptyProgress(), 0, acceptedResponse(PRACTICE[0][0]), now).progress);
    expect(data.size).toBe(3);
    expect(data.get("ml-math-lab:evidence:math.statistics:v1")).toBe("old-mastery");
    expect(data.get("ml-math-lab:regression:v1")).toBe("old-regression");
    expect(bytes(data.get(STORAGE_KEY)!)).toBeLessThan(262144);
    const prior = data.get(STORAGE_KEY);
    const quota = new ProgressStore({ getItem: () => prior!, setItem: () => { throw new Error("Quota"); } });
    quota.hydrate(); quota.save(emptyProgress());
    expect(quota.warning).toContain("not saved"); expect(data.get(STORAGE_KEY)).toBe(prior);
    const denied = new ProgressStore({ getItem: () => { throw new Error("Denied"); }, setItem: () => { throw new Error("Should not write"); } });
    denied.hydrate(); expect(denied.writable).toBe(false);
  });
  it("restores partial legal repair drafts without consuming attempts and rejects unsupported fields", () => {
    const progress = emptyProgress();
    progress.practice[3].response = [{ kind: "slots", entries: [{ slotId: "expression", optionId: "grouped" }] }];
    expect(loadProgress(serializeProgress(progress))).toEqual(progress);
    expect(submitPractice(progress, 3, { familyId: PRACTICE[3][0].id, answers: [{ atomId: "repair", answer: progress.practice[3].response[0] }] }, now).result.status).toBe("invalid");
    expect(() => serializeProgress({ ...progress, scope: "numpy" } as never)).toThrow();
    expect(canonical({ number: -0 })).toBe('{"number":0}');
  });
});
