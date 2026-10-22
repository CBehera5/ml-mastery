import { describe, expect, it } from "vitest";
import reference from "../../../../../python/tests/fixtures/supervised-ev01-reference.json";
import { analyze, canonical, closeNumber, CONFIGS, CONTENT, EV_POLICY, gradeFamily, gradePractice, MODULE_MASTERY_AVAILABLE, OBJECTIVES, PRACTICE, responseFor, SCENES, validateDefinition, verifyPolicyOutcomes, type Answer, type Family } from "./test-support";
import { alternate, changeDraft, choose, completed, decode, draftAnswers, emptyProgress, encode, explain, predict, ProgressStore, recover, resetExperiment, resetLesson, reveal, STORAGE_KEY, submitPractice, type Progress } from "./progress";

const families = [...PRACTICE, ...reference.independent.map(item => item.family as Family)];
const correct = (family: Family) => responseFor(family, [...family.accepted[0]]);
function demonstrated(index: number, progress = emptyProgress()) {
  return submitPractice(changeDraft(progress, index, [...PRACTICE[index * 2].accepted[0]]), index).progress;
}
function experiment(progress = emptyProgress(), prediction = "valid") {
  return explain(reveal(predict(choose(progress, CONFIGS[1]), prediction)), analyze(CONFIGS[1]).reason);
}
function port(initial: string | null = null) {
  const values = new Map<string, string>([["old-mastery", "preserve"]]);
  if (initial !== null) values.set(STORAGE_KEY, initial);
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}

describe("authored coverage, parity and bounded grading", () => {
  it("has exactly four objectives, eight practice, twelve private independent instances and36 states", () => {
    expect(PRACTICE).toHaveLength(8); expect(reference.independent).toHaveLength(12); expect(CONFIGS).toHaveLength(36); expect(new Set(CONFIGS).size).toBe(36);
    expect(MODULE_MASTERY_AVAILABLE).toBe(false);
    expect(families.filter(item => item.critical)).toHaveLength(5);
    expect(Object.isFrozen(PRACTICE[0].atoms)).toBe(true);
    expect(OBJECTIVES).toHaveLength(4);
  });
  for (const entry of reference.states) it(`matches trusted Python state ${entry.id}`, () => expect(analyze(entry.id)).toEqual(entry.expected));
  for (const family of families) it(`grades trusted instance ${family.id}`, () => {
    expect(validateDefinition(family)).toBe(true);
    expect(gradeFamily(family, correct(family))).toMatchObject({ status: "graded", correct: true });
    expect(family.remediation.length).toBeGreaterThan(40);
  });
  for (const item of reference.independent.filter(item => item.family.critical)) for (const atomIndex of [0, 1]) it(`rejects valid-wrong critical atom ${item.family.id}/${atomIndex}`, () => {
    const family = item.family as Family;
    const response = correct(family);
    const atom = family.atoms[atomIndex];
    if (atom.kind !== "choice") throw new Error("Critical choices required.");
    const answer = response.answers[atomIndex].answer;
    response.answers[atomIndex].answer = { kind: "choice", optionId: atom.options.find(option => answer.kind === "choice" && option.id !== answer.optionId)!.id };
    expect(gradeFamily(family, response)).toMatchObject({ status: "graded", correct: false });
  });
  it("accepts slot-order equivalents but rejects wrong complete tuples", () => {
    const family = PRACTICE[0];
    const response = structuredClone(correct(family));
    const answer = response.answers[0].answer;
    if (answer.kind !== "slots") throw new Error("Slots required.");
    answer.entries.reverse();
    expect(gradePractice(family.id, response)).toMatchObject({ correct: true });
    answer.entries[0].optionId = answer.entries[0].slotId === "unit" ? "binary" : "quality";
    expect(gradePractice(family.id, response)).toMatchObject({ status: "graded", correct: false });
  });
  for (const input of [null, "__import__('os')", "1/2", { familyId: "unknown", answers: [] }, { ...correct(PRACTICE[2]), extra: true }, JSON.parse('{"__proto__":{},"answers":[]}'), new Array(20000).fill(0)]) it(`rejects unsupported representation ${String(input).slice(0, 30)}`, () => expect(gradePractice(PRACTICE[2].id, input).status).toBe("invalid"));
  it("never accepts a test-only family in the learner adapter", () => expect(gradePractice(reference.independent[0].family.id, correct(reference.independent[0].family as Family)).status).toBe("invalid"));
  it("preserves inclusive numeric contract, exact types and nonfinite rejection", () => {
    expect(closeNumber(0, 1e-9 / (1 + 1e-9))).toBe(true);
    expect(closeNumber(0, 1.01e-9)).toBe(false);
    const family: Family = { ...PRACTICE[0], critical: false, atoms: [{ id: "number", label: "Bounded number", kind: "number" }], accepted: [[{ kind: "number", value: 0 }]] };
    for (const value of [NaN, Infinity, 1e7, "0", true]) expect(gradeFamily(family, { familyId: family.id, answers: [{ atomId: "number", answer: { kind: "number", value } }] }).status).toBe("invalid");
    expect(gradeFamily(family, responseFor(family, [{ kind: "number", value: -0 }]))).toMatchObject({ correct: true });
    expect(gradeFamily(family, responseFor(family, [{ kind: "number", value: 1e-9 }]))).toMatchObject({ correct: true });
    expect(gradeFamily(family, responseFor(family, [{ kind: "number", value: 1.01e-9 }]))).toMatchObject({ correct: false });
  });
});

describe("synthetic policy only, no learner evidence", () => {
  const full = () => Array.from({ length: 24 }, (_, index) => ({ objective: `EV0${Math.floor(index / 4) + 1}.O${index % 4 + 1}`, correct: true }));
  it("passes20/24 and fails19/24 with all gates correct", () => {
    const outcomes = full();
    const noncritical = outcomes.filter(item => !EV_POLICY.critical.includes(item.objective));
    noncritical.slice(0, 4).forEach(item => { item.correct = false; });
    expect(verifyPolicyOutcomes(outcomes)).toEqual({ score: 20, passed: true });
    noncritical[4].correct = false;
    expect(verifyPolicyOutcomes(outcomes)).toEqual({ score: 19, passed: false });
    expect(emptyProgress()).not.toHaveProperty("mastery");
  });
  for (const id of EV_POLICY.critical) it(`fails otherwise perfect synthetic attempt at ${id}`, () => {
    const outcomes = full(); outcomes.find(item => item.objective === id)!.correct = false;
    expect(verifyPolicyOutcomes(outcomes)).toEqual({ score: 23, passed: false });
  });
  it("rejects incomplete/duplicate outcomes and does not combine attempts", () => {
    expect(() => verifyPolicyOutcomes(full().slice(1))).toThrow();
    expect(() => verifyPolicyOutcomes([...full().slice(1), full()[1]])).toThrow();
    const first = full(); const second = full(); first[1].correct = false; second[5].correct = false;
    expect(verifyPolicyOutcomes(first).passed).toBe(false); expect(verifyPolicyOutcomes(second).passed).toBe(false);
  });
});

describe("prototype practice, recovery and experiment", () => {
  it("requires all four practices plus changed/predicted/revealed/correctly explained experiment", () => {
    let progress = emptyProgress();
    for (let index = 0; index < 4; index++) progress = demonstrated(index, progress);
    expect(completed(progress)).toBe(false);
    expect(explain(progress, "both-valid")).toEqual(progress);
    expect(reveal(progress)).toEqual(progress);
    const unchanged = explain(reveal(predict(progress, "valid")), "both-valid");
    expect(unchanged.experiment.credit).toBeNull();
    progress = experiment(progress, "valid");
    expect(completed(progress)).toBe(true);
    expect(progress.experiment.prediction).toBe("valid");
    expect(analyze(progress.experiment.config).valid).toBe(false);
    expect(decode(encode(progress))).toEqual(progress);
    expect(Object.keys(progress)).not.toContain("mastery");
  });
  it("invalid/partial answers do not consume submissions; exhaustion requires review and a correct counterexample", () => {
    let progress = emptyProgress();
    expect(submitPractice(progress, 0).progress).toEqual(progress);
    for (let variant = 0; variant < 2; variant++) {
      const family = PRACTICE[2 + variant];
      const wrong: Answer[] = [{ kind: "choice", optionId: "allow" }, { kind: "choice", optionId: "correlation" }];
      progress = changeDraft(progress, 1, wrong);
      progress = submitPractice(progress, 1).progress;
      progress = submitPractice(progress, 1).progress;
      expect(progress.practice[1].counts[variant]).toBe(2);
      expect(submitPractice(progress, 1).progress).toEqual(progress);
      if (variant === 0) progress = alternate(progress, 1);
      expect(family.objective).toBe("EV01.O2");
    }
    expect(recover(progress, 1, false, "time")).toBe(progress);
    expect(recover(progress, 1, true, "wrong")).toBe(progress);
    progress = recover(progress, 1, true, "time");
    expect(progress.practice[1].counts).toEqual([0, 0]); expect(progress.practice[1].cycle).toBe(1);
    expect(decode(encode(progress))).toEqual(progress);
  });
  it("retains demonstrated practice after subsequent errors and resets only explicitly", () => {
    const progress = demonstrated(1);
    const changed = changeDraft(progress, 1, [{ kind: "choice", optionId: "reject" }, { kind: "choice", optionId: "correlation" }]);
    expect(submitPractice(changed, 1).progress.practice[1].proof).not.toBeNull();
    expect(resetLesson(progress, false)).toBe(progress);
    expect(resetLesson(progress, true).practice[1].proof).toBeNull();
    expect(resetExperiment(experiment()).experiment.credit).not.toBeNull();
    expect(choose(progress, "arbitrary")).toBe(progress);
    expect(draftAnswers(progress, 0)[0]).toEqual({ kind: "unanswered" });
  });
  it("invalidates current reveal/explanation on a new choice without losing earned completion", () => {
    const progress = experiment();
    expect(predict(progress, "invalid")).toBe(progress);
    const next = choose(progress, CONFIGS[2]);
    expect(next.experiment).toMatchObject({ revealed: false, prediction: "", reason: "" });
    expect(next.experiment.credit).toEqual(progress.experiment.credit);
  });
});

describe("strict scoped persistence and restoration", () => {
  it("hydrates before writes and round-trips drafts/completion without touching other evidence", () => {
    const storage = port(); const store = new ProgressStore(storage);
    expect(() => store.save(emptyProgress())).toThrow();
    store.hydrate(); store.save(demonstrated(0));
    expect(new ProgressStore(storage).hydrate().practice[0].proof).not.toBeNull();
    expect(storage.values.get("old-mastery")).toBe("preserve"); expect(storage.values.size).toBe(2);
  });
  for (const raw of ["{", "x".repeat(262145), JSON.stringify({ ...emptyProgress(), content: "future" }), canonical({ ...emptyProgress(), schema: 2 }), canonical({ ...emptyProgress(), scope: "essentials" }), canonical({ ...emptyProgress(), mastery: true }), " " + encode(emptyProgress())]) it(`preserves unsupported original ${raw.slice(0, 25)}`, () => {
    const storage = port(raw); const store = new ProgressStore(storage); store.hydrate();
    store.save(demonstrated(0)); expect(storage.getItem(STORAGE_KEY)).toBe(raw); expect(store.warning).toContain("memory only");
  });
  it("rejects forged completion proof and impossible reveal state", () => {
    const progress = emptyProgress(); progress.practice[0].proof = "true";
    expect(() => encode(progress)).toThrow();
    expect(() => encode({ ...emptyProgress(), experiment: { ...emptyProgress().experiment, reason: "both-valid" } })).toThrow();
    const interaction = { from: CONFIGS[0], config: CONFIGS[0], prediction: "valid", reason: "both-valid" };
    expect(() => encode({ ...emptyProgress(), experiment: { ...emptyProgress().experiment, credit: interaction } })).toThrow();
  });
  it("keeps memory-only changes on quota/denial and preserves earlier bytes", () => {
    const raw = encode(emptyProgress()); const storage = port(raw);
    const store = new ProgressStore({ getItem: storage.getItem, setItem: () => { throw new Error("quota"); } });
    store.hydrate(); expect(store.save(demonstrated(0)).practice[0].proof).not.toBeNull();
    expect(storage.getItem(STORAGE_KEY)).toBe(raw); expect(store.warning).toContain("memory only");
    const denied = new ProgressStore({ getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("must not write"); } });
    denied.hydrate(); denied.save(emptyProgress()); expect(denied.warning).toContain("preserved");
  });
  it("refuses stale-tab replacement and does not reinterpret new versions", () => {
    const storage = port(); const first = new ProgressStore(storage); const second = new ProgressStore(storage);
    first.hydrate(); second.hydrate(); first.save(demonstrated(0)); const saved = storage.getItem(STORAGE_KEY);
    second.save(demonstrated(1)); expect(storage.getItem(STORAGE_KEY)).toBe(saved); expect(second.warning).toContain("another tab");
    expect(() => decode(canonical({ ...emptyProgress(), policy: CONTENT }))).toThrow();
  });
});
