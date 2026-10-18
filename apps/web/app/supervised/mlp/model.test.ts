import { describe, expect, it } from "vitest";
import { FORMS, MASTERY_AVAILABLE, OBJECTIVES, PRACTICE, score, VALID_CATALOG } from "./catalog";
import { alternate, confirmAttempt, emptyState, load, ModuleStore, newDraft, practiceSubmit, recover, retry, serialize, STORAGE_KEY, validateState } from "./model";
import { canonical } from "../../python/foundation/contracts";
import { gradeFamily, type Answer } from "../../python/foundation/contracts";

const correct = (form: number) => FORMS[form].map(family => [...family.accepted[0]] as Answer[]);
const wrong = (answers: Answer[]) => answers.map(answer => answer.kind === "choice" ? { kind: "choice", optionId: answer.optionId === "sound" ? "shortcut" : "sound" } as Answer : { kind: "choice", optionId: "shortcut" } as Answer);

describe("Task015.11 MLP objective contract", () => {
  it("covers exactly 20 objective families, 40 practice and 60 independent instances with five O2 paired gates", () => {
    expect(VALID_CATALOG).toBe(true);
    expect(OBJECTIVES).toHaveLength(20);
    expect(PRACTICE.flat()).toHaveLength(40);
    expect(FORMS.flat()).toHaveLength(60);
    expect(FORMS[0].filter(family => family.critical)).toHaveLength(5);
    expect(FORMS[0].filter(family => family.critical).every(family => family.atoms.length === 2)).toBe(true);
    expect(FORMS.flat().every(family => gradeFamily(family, { familyId: family.id, answers: family.atoms.map((atom, index) => ({ atomId: atom.id, answer: family.accepted[0][index] })) }).status === "graded")).toBe(true);
  });
  it("rejects 15/20 and accepts 16/20 only with all critical gates correct", () => {
    for (let form = 0; form < 3; form++) {
      const sixteen = correct(form);
      [0, 2, 4, 6].forEach(index => { sixteen[index] = wrong(sixteen[index]); });
      expect(score(form, sixteen).score).toBe(16);
      expect(score(form, sixteen).passed).toBe(true);
      const fifteen = correct(form);
      [0, 2, 4, 6, 8].forEach(index => { fifteen[index] = wrong(fifteen[index]); });
      expect(score(form, fifteen).score).toBe(15);
      expect(score(form, fifteen).passed).toBe(false);
    }
  });
  it("fails either atom of every paired gate on each form even at an otherwise passing score", () => {
    for (let form = 0; form < 3; form++) for (let gate = 0; gate < 5; gate++) for (let atom = 0; atom < 2; atom++) {
      const answers = correct(form);
      answers[gate * 4 + 1][atom] = { kind: "choice", optionId: atom === 0 ? "shortcut" : "memorized" };
      const result = score(form, answers);
      expect(result.score).toBe(19);
      expect(result.passed).toBe(false);
      expect(result.critical).toContain(OBJECTIVES[gate * 4 + 1]);
    }
  });
  it("keeps mastery unavailable until the acceptance gate is explicitly released", () => {
    const filled = { ...newDraft("pending-1", 0), phase: "review" as const, answers: FORMS[0].map(family => canonical([...family.accepted[0]])) };
    expect(score(0, FORMS[0].map(family => [...family.accepted[0]])).passed).toBe(true);
    expect(MASTERY_AVAILABLE).toBe(false);
    expect(() => confirmAttempt({ ...emptyState(), draft: filled }, true, "2026-10-17T00:00:00.000Z")).toThrow("unavailable until all required checks verify");
    expect(emptyState().mastery).toBeNull();
  });
  it("round-trips its bounded version without crossing the protected scopes", () => {
    const state = emptyState();
    expect(state.scope).toBe("supervised:mlp:full:v1");
    expect(STORAGE_KEY).toBe("ml-math-lab:supervised:mlp:full:v1");
    expect(validateState(state)).toBe(true);
    expect(load(serialize(state))).toEqual(state);
    expect(() => load(JSON.stringify({ ...state, scope: "supervised:random-forests:full:v1" }))).toThrow();
    expect(() => serialize({ ...state, history: [{ too: "large" }] } as never)).toThrow();
  });
  it("preserves corrupt bytes and degrades safely when storage cannot write", () => {
    let raw = "not-json";
    const store = new ModuleStore({ getItem: () => raw, setItem: (_key, value) => { raw = value; } });
    store.hydrate();
    expect(store.writable).toBe(false);
    expect(raw).toBe("not-json");
    const quota = new ModuleStore({ getItem: () => null, setItem: () => { throw new Error("quota"); } });
    quota.hydrate(); quota.save(emptyState());
    expect(quota.warning).toContain("could not save");
  });
  it("requires worked remediation before a new practice cycle and detects stale-tab writes", () => {
    let state = emptyState();
    for (const variant of [0, 1, 1, 0]) {
      if (state.practice[0].variant !== variant) state = alternate(state, 0);
      state = { ...state, practice: state.practice.map((item, index) => index === 0 ? { ...item, answers: canonical([{ kind: "choice", optionId: "shortcut" }]) } : item) };
      state = practiceSubmit(state, 0);
    }
    expect(state.practice[0].counts).toEqual([2, 2]);
    expect(() => recover(state, 0)).toThrow();
    const ready = { ...state, practice: state.practice.map((item, index) => index === 0 ? { ...item, reviewed: true, recall: "boundary" } : item) };
    expect(recover(ready, 0).practice[0].cycle).toBe(1);
    let stored: string | null = null;
    const store = new ModuleStore({ getItem: () => stored, setItem: (_key, value) => { stored = value; } });
    store.hydrate(); stored = "changed by another tab"; store.save(emptyState());
    expect(store.writable).toBe(false);
    expect(store.warning).toContain("could not save");
  });
  it("requires explicit review/confirmation and rotates a fresh form identity", () => {
    const state = { ...emptyState(), draft: { ...newDraft("one", 0), phase: "review" as const } };
    expect(() => confirmAttempt(state, false, "2026-10-17T00:00:00.000Z")).toThrow();
    if (!MASTERY_AVAILABLE) {
      expect(() => confirmAttempt(state, true, "2026-10-17T00:00:00.000Z")).toThrow("unavailable until all required checks verify");
      return;
    }
    const result = confirmAttempt(state, true, "2026-10-17T00:00:00.000Z");
    expect(result.draft.phase).toBe("results");
    expect(retry(result, "two").draft.form).toBe(1);
  });
});
