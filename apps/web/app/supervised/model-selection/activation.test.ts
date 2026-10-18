import { describe, expect, it } from "vitest";
import { canonical, type Answer } from "../../python/foundation/contracts";
import { FORMS, MASTERY_AVAILABLE, OBJECTIVES, PRACTICE } from "./catalog";
import { alternate, changeLab, confirmAttempt, emptyState, explainLab, lessonComplete, load, ModuleStore, newDraft, practiceSubmit, recover, retry, revealLab, serialize, STORAGE_KEY, type State } from "./model";
import { EXPERIMENTS } from "./catalog";

const at = "2026-10-18T12:00:00.000Z";
const correct = (form: number): Answer[][] => FORMS[form].map(family => family.accepted[0].map(answer => ({ ...answer })));
function wrong(answers: Answer[][], form: number, objective: number, component = 0) {
  const atom = FORMS[form][objective].atoms[component], answer = answers[objective][component];
  if (atom.kind !== "choice" || answer.kind !== "choice") throw Error("Expected the reviewed finite-choice contract");
  answers[objective][component] = { kind: "choice", optionId: atom.options.find(option => option.id !== answer.optionId)!.id };
}
const reviewed = (state: State, answers: Answer[][]): State => ({ ...state, draft: { ...state.draft, phase: "review", answers: answers.map(canonical) } });
const submit = (state: State, answers: Answer[][]) => confirmAttempt(reviewed(state, answers), true, at);

describe("Task 015.12 controlled mastery activation", () => {
  it("exposes the approved independent mastery path", () => expect(MASTERY_AVAILABLE).toBe(true));

  for (let form = 0; form < 3; form++) {
    for (const count of [19, 20]) it(`form ${"ABC"[form]}: confirmed ${count}/24 ${count === 20 ? "passes" : "fails"} with every paired gate correct`, () => {
      const answers = correct(form);
      [0, 4, 8, 12, 16].slice(0, 24 - count).forEach(index => wrong(answers, form, index));
      const state = submit({ ...emptyState(), draft: newDraft(`boundary-${form}-${count}`, form) }, answers);
      expect(state.draft.result?.score).toBe(count);
      expect(state.draft.result?.critical).toEqual([]);
      expect(state.draft.result?.passed).toBe(count === 20);
      expect(state.mastery !== null).toBe(count === 20);
      expect(load(serialize(state))).toEqual(state);
    });

    for (let gate = 0; gate < 6; gate++) for (let component = 0; component < 2; component++) {
      it(`form ${"ABC"[form]}: MS0${gate + 1}.O2 component ${component + 1} failure blocks confirmed 23/24 mastery`, () => {
        const answers = correct(form); wrong(answers, form, gate * 4 + 1, component);
        const state = submit({ ...emptyState(), draft: newDraft(`gate-${form}-${gate}-${component}`, form) }, answers);
        expect(state.draft.result?.score).toBe(23);
        expect(state.draft.result?.critical).toEqual([OBJECTIVES[gate * 4 + 1]]);
        expect(state.draft.result?.passed).toBe(false);
        expect(state.mastery).toBeNull();
      });
    }
  }

  it("requires both review and explicit confirmation, and submission is idempotent", () => {
    const state = { ...emptyState(), draft: { ...newDraft("confirmed", 0), answers: correct(0).map(canonical) } };
    expect(() => confirmAttempt(state, true, at)).toThrow("Review and explicit confirmation");
    expect(() => confirmAttempt(reviewed(state, correct(0)), false, at)).toThrow("Review and explicit confirmation");
    const result = submit(state, correct(0));
    expect(result.mastery?.id).toBe("confirmed");
    expect(confirmAttempt(result, true, at)).toBe(result);
    expect(result.history).toHaveLength(1);
    expect(emptyState().mastery).toBeNull();
  });

  it("never pools complementary failed attempts, and rotates A to B to C to A with fresh identities", () => {
    const firstAnswers = correct(0); wrong(firstAnswers, 0, 1);
    const first = submit({ ...emptyState(), draft: newDraft("first", 0) }, firstAnswers);
    expect(() => retry(emptyState(), "too-early")).toThrow();
    expect(() => retry(first, "first")).toThrow();
    const next = retry(first, "second");
    expect(next.draft.form).toBe(1);
    expect(next.draft.answers.every(raw => JSON.parse(raw).every((a: Answer) => a.kind === "unanswered"))).toBe(true);
    const secondAnswers = correct(1); wrong(secondAnswers, 1, 5);
    const second = submit(next, secondAnswers);
    expect(second.history.every(s => s.score === 23 && !s.passed)).toBe(true);
    expect(second.history[0].outcomes.every((value, index) => value || second.history[1].outcomes[index])).toBe(true);
    expect(second.mastery).toBeNull();
    const third = retry(second, "third"); expect(third.draft.form).toBe(2);
    expect(() => retry(second, "first")).toThrow();
    const thirdFailed = confirmAttempt({ ...third, draft: { ...third.draft, phase: "review" } }, true, at);
    expect(retry(thirdFailed, "fourth").draft.form).toBe(0);
    expect(load(serialize(second)).mastery).toBeNull();
  });

  it("preserves previously earned mastery across a later failure, persistence and restoration", () => {
    const earned = submit({ ...emptyState(), draft: newDraft("earned", 0) }, correct(0));
    const later = retry(earned, "later");
    const failed = confirmAttempt({ ...later, draft: { ...later.draft, phase: "review" } }, true, at);
    expect(failed.draft.result?.passed).toBe(false);
    expect(failed.mastery).toEqual(earned.mastery);
    let raw: string | null = serialize(earned);
    const other = new Map([["ml-math-lab:supervised:mlp:full:v1", "earlier-module-evidence"]]);
    const store = new ModuleStore({ getItem: key => key === STORAGE_KEY ? raw : other.get(key) ?? null, setItem: (key, value) => { expect(key).toBe(STORAGE_KEY); raw = value; } });
    expect(store.hydrate().mastery).toEqual(earned.mastery);
    store.save(failed);
    expect(load(raw).mastery).toEqual(earned.mastery);
    expect(other.get("ml-math-lab:supervised:mlp:full:v1")).toBe("earlier-module-evidence");
  });

  it("isolates every stored version and preserves unsupported bytes without writes", () => {
    const earned = submit({ ...emptyState(), draft: newDraft("versioned", 0) }, correct(0));
    for (const key of ["scope", "content", "policy", "assessment", "fixtures"] as const) {
      const raw = canonical({ ...earned, [key]: "other-version" });
      let writes = 0;
      const store = new ModuleStore({ getItem: () => raw, setItem: () => { writes++; } });
      store.hydrate();
      expect(store.writable).toBe(false);
      expect(store.state.mastery).toBeNull();
      store.save(emptyState());
      expect(writes).toBe(0);
      expect(() => load(raw)).toThrow();
    }
  });

  it("restores review drafts to editable state requiring fresh confirmation", () => {
    const restored = load(serialize(reviewed(emptyState(), correct(0))));
    expect(restored.draft.phase).toBe("active");
    expect(() => confirmAttempt(restored, true, at)).toThrow("Review and explicit confirmation");
  });

  it("requires targeted remediation before reopening exhausted practice", () => {
    const state = emptyState();
    state.practice[0] = { ...state.practice[0], counts: [2, 2] };
    expect(() => recover(state, 0)).toThrow();
    state.practice[0] = { ...state.practice[0], reviewed: true, recall: "boundary" };
    const recovered = recover(state, 0);
    expect(recovered.practice[0].counts).toEqual([0, 0]);
    expect(recovered.practice[0].cycle).toBe(1);
    expect(recovered.mastery).toBeNull();
  });

  it("does not substitute complete practice, labs or transfers for independent evidence", () => {
    let state = emptyState();
    for (let index = 0; index < 24; index++) for (let variant = 0; variant < 2; variant++) {
      if (state.practice[index].variant !== variant) state = alternate(state, index);
      state = { ...state, practice: state.practice.map((item, i) => i === index ? { ...item, answers: canonical(PRACTICE[variant][index].accepted[0]) } : item) };
      state = practiceSubmit(state, index);
    }
    for (let lab = 0; lab < 2; lab++) {
      state = changeLab(state, lab, EXPERIMENTS[lab].configs[1].id);
      state = { ...state, labs: state.labs.map((item, i) => i === lab ? { ...item, prediction: "fair", reason: "mechanism" } : item) };
      state = explainLab(revealLab(state, lab), lab, "mechanism");
    }
    state = { ...state, transfers: Array(6).fill("boundary") };
    expect(Array.from({ length: 6 }, (_, i) => lessonComplete(state, i))).toEqual(Array(6).fill(true));
    expect(load(serialize(state)).mastery).toBeNull();
    const independent = confirmAttempt({ ...state, draft: { ...state.draft, phase: "review" } }, true, at);
    expect(independent.draft.result?.score).toBe(0);
    expect(independent.mastery).toBeNull();
  });
});
