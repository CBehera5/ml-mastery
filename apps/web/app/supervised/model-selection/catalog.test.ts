import { describe, expect, it } from "vitest";
import { gradeFamily, validResponse, type Answer } from "../../python/foundation/contracts";
import { AUTHORED_FAMILIES } from "./authored";
import { FORMS, MASTERY_AVAILABLE, OBJECTIVES, PRACTICE, score, VALID_CATALOG } from "./catalog";
import { alternate, confirmAttempt, emptyState, load, newDraft, recover, retry, serialize, STORAGE_KEY, validateState, ModuleStore } from "./model";
import { canonical } from "../../python/foundation/contracts";
import { LESSONS } from "./teaching";

const answers = (form: number) => FORMS[form].map(family => [...family.accepted[0]] as Answer[]);
const wrongAt = (form: number, answers: Answer[][], index: number, atomIndex = 0) => {
  const item = FORMS[form][index], correct = item.accepted[0][atomIndex];
  if (correct.kind === "choice" && item.atoms[atomIndex].kind === "choice") answers[index][atomIndex] = { kind: "choice", optionId: item.atoms[atomIndex].options.find(option => option.id !== correct.optionId)!.id };
};

describe("Task 015.12 authored objective and assessment coverage", () => {
  it("has 24 objectives, 48 practice instances, 72 independent instances, and only six paired O2 gates", () => {
    expect(VALID_CATALOG).toBe(true);
    expect(AUTHORED_FAMILIES).toHaveLength(120);
    expect(OBJECTIVES).toHaveLength(24);
    expect(PRACTICE.flat()).toHaveLength(48);
    expect(FORMS.flat()).toHaveLength(72);
    expect(LESSONS).toHaveLength(6);
    expect(LESSONS.every(lesson => lesson.objectives.length === 4 && lesson.notes.length === 4)).toBe(true);
    for (const form of [...PRACTICE, ...FORMS]) {
      expect(form.filter(item => item.critical)).toHaveLength(6);
      expect(form.filter(item => item.critical).every(item => item.atoms.length === 2)).toBe(true);
      for (const item of form) expect(gradeFamily(item, { familyId: item.id, answers: item.atoms.map((atom, i) => ({ atomId: atom.id, answer: item.accepted[0][i] })) }).status).toBe("graded");
    }
    expect(FORMS[0][4].prompt).not.toBe(FORMS[1][4].prompt);
    expect(FORMS[0][4].atoms[0].options.find(option => option.id === FORMS[0][4].accepted[0][0].optionId)?.label).toContain("24 candidate-fold fits");
    expect(FORMS[1][4].atoms[0].options.find(option => option.id === FORMS[1][4].accepted[0][0].optionId)?.label).toContain("18 candidate-fold fits");
    expect(FORMS[0][2].accepted[0][0]).not.toEqual(FORMS[1][2].accepted[0][0]);
  });
  it("enforces the 19/20 boundary and all paired gates in each independent form", () => {
    for (let form = 0; form < 3; form++) {
      const nineteen = answers(form); [0, 4, 8, 12, 16].forEach(index => wrongAt(form, nineteen, index));
      expect(score(form, nineteen).score).toBe(19); expect(score(form, nineteen).passed).toBe(false);
      const twenty = answers(form); [0, 4, 8, 12].forEach(index => wrongAt(form, twenty, index));
      expect(score(form, twenty).score).toBe(20); expect(score(form, twenty).passed).toBe(true);
      for (let gate = 0; gate < 6; gate++) for (let atom = 0; atom < 2; atom++) {
        const failing = answers(form); wrongAt(form, failing, gate * 4 + 1, atom);
        expect(score(form, failing).passed).toBe(false); expect(score(form, failing).critical).toContain(OBJECTIVES[gate * 4 + 1]);
      }
    }
  });
  it("keeps mastery unavailable during implementation verification", () => {
    const attempt = { ...newDraft("attempt-1", 0), phase: "review" as const, answers: FORMS[0].map(item => canonical([...item.accepted[0]])) };
    expect(MASTERY_AVAILABLE).toBe(false);
    expect(() => confirmAttempt({ ...emptyState(), draft: attempt }, true, "2026-10-18T00:00:00.000Z")).toThrow("unavailable");
  });
  it("round-trips its own scope without interpreting prior module evidence", () => {
    const state = emptyState();
    expect(STORAGE_KEY).toBe("ml-math-lab:supervised:model-selection:full:v1");
    expect(validateState(state)).toBe(true); expect(load(serialize(state))).toEqual(state);
    expect(() => load(JSON.stringify({ ...state, scope: "supervised:mlp:full:v1" }))).toThrow();
    const family = FORMS[0][0];
    expect(validResponse(family, { familyId: family.id, answers: [{ atomId: "decision", answer: { kind: "choice", optionId: "not-authored" } }] })).toBe(false);
  });
  it("preserves corrupt storage bytes and degrades safely on quota or stale-tab failures", () => {
    let raw: string | null = "not-json";
    const corrupt = new ModuleStore({ getItem: () => raw, setItem: (_key, next) => { raw = next; } });
    corrupt.hydrate(); expect(corrupt.writable).toBe(false); expect(raw).toBe("not-json");
    const quota = new ModuleStore({ getItem: () => null, setItem: () => { throw Error("quota"); } });
    quota.hydrate(); quota.save(emptyState()); expect(quota.warning).toContain("could not save");
    let stored: string | null = null;
    const stale = new ModuleStore({ getItem: () => stored, setItem: (_key, next) => { stored = next; } });
    stale.hydrate(); stored = "other-tab"; stale.save(emptyState()); expect(stale.warning).toContain("could not save");
  });
  it("requires targeted review before reopening exhausted practice and rotates retries", () => {
    const changed = { ...emptyState(), practice: emptyState().practice.map((item, index) => index === 0 ? { ...item, counts: [2, 2] as [number, number] } : item) };
    expect(() => recover(changed, 0)).toThrow();
    const ready = { ...changed, practice: changed.practice.map((item, index) => index === 0 ? { ...item, reviewed: true, recall: "boundary" } : item) };
    expect(recover(ready, 0).practice[0].cycle).toBe(1);
    const results = { ...emptyState(), draft: { ...newDraft("done", 0), phase: "results" as const } };
    expect(retry(results, "next").draft.form).toBe(1);
    expect(() => retry(results, "done")).toThrow();
  });
});
