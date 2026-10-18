export type Answer = { kind: "choice"; optionId: string } | { kind: "number"; value: number } | { kind: "slots"; entries: { slotId: string; optionId: string }[] } | { kind: "unanswered" };
export type Atom = { id: string; label: string; kind: "choice"; options: readonly { id: string; label: string }[] } | { id: string; label: string; kind: "number" } | { id: string; label: string; kind: "slots"; slots: readonly { id: string; label: string; options: readonly { id: string; label: string }[] }[] };
export type Family = {
  id: string; objective: string; critical: boolean; prompt: string; code: string;
  atoms: readonly Atom[]; accepted: readonly (readonly Answer[])[]; explanation: string; remediation: string;
};
export type FamilyResponse = { familyId: string; answers: { atomId: string; answer: Answer }[] };
export type Grade = { status: "invalid"; feedback: string } | { status: "graded"; correct: boolean; feedback: string };
export const VERSION = "python-p01.1.0.0";
export const POLICY_VERSION = "python-policy.1.0.0";
export const ENVIRONMENT = "macos-arm64-cpython-3.13.16-reference.1";
export const bytes = (value: string) => new TextEncoder().encode(value).length;
export const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
export const keys = (value: Record<string, unknown>, expected: string[]) => Object.keys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));
export function bounded(value: unknown, maximum = 65536): boolean {
  let nodes = 0;
  function walk(item: unknown, depth: number): boolean {
    if (++nodes > 12000 || depth > 8) return false;
    if (typeof item === "number") return Number.isFinite(item);
    if (item === null || typeof item === "boolean") return true;
    if (typeof item === "string") return item.length <= maximum;
    if (Array.isArray(item)) return Object.getPrototypeOf(item) === Array.prototype && item.length <= 1024 && Object.keys(item).length === item.length && Object.keys(item).every((key, index) => key === String(index)) && item.every(entry => walk(entry, depth + 1));
    if (!record(item)) return false;
    return Object.keys(item).every(key => !["__proto__", "prototype", "constructor"].includes(key) && walk(item[key], depth + 1));
  }
  if (!walk(value, 0)) return false;
  try { return bytes(JSON.stringify(value)) <= maximum; } catch { return false; }
}
export function canonical(value: unknown): string {
  if (!bounded(value, 262144)) throw new Error("Unsupported bounded representation.");
  function normalize(item: unknown): unknown {
    if (Array.isArray(item)) return item.map(normalize);
    if (record(item)) return Object.fromEntries(Object.keys(item).sort().map(key => [key, normalize(item[key])]));
    return Object.is(item, -0) ? 0 : item;
  }
  return JSON.stringify(normalize(value));
}
export function validAnswer(value: unknown, atom: Atom): value is Answer {
  if (!bounded(value, 512) || !record(value)) return false;
  if (value.kind === "unanswered") return keys(value, ["kind"]);
  if (value.kind !== atom.kind) return false;
  if (atom.kind === "number") return keys(value, ["kind", "value"]) && typeof value.value === "number" && Number.isFinite(value.value) && Math.abs(value.value) <= 1e6;
  if (atom.kind === "choice") return keys(value, ["kind", "optionId"]) && atom.options.some(option => option.id === value.optionId);
  if (!keys(value, ["kind", "entries"]) || !Array.isArray(value.entries) || value.entries.length !== atom.slots.length || value.entries.length > 8) return false;
  const entries = value.entries;
  return atom.slots.every(slot => entries.filter(entry => record(entry) && keys(entry, ["slotId", "optionId"]) && entry.slotId === slot.id && slot.options.some(option => option.id === entry.optionId)).length === 1);
}
export function closeNumber(actual: number, expected: number, absolute = 1e-9, relative = 1e-9): boolean {
  return Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) <= absolute + relative * Math.abs(expected);
}
export function validDraftAnswer(value: unknown, atom: Atom): value is Answer {
  if (validAnswer(value, atom)) return true;
  if (atom.kind !== "slots" || !bounded(value, 512) || !record(value) || !keys(value, ["kind", "entries"]) || value.kind !== "slots" || !Array.isArray(value.entries) || value.entries.length > atom.slots.length) return false;
  const entries = value.entries;
  return new Set(entries.map(entry => record(entry) ? entry.slotId : null)).size === entries.length && entries.every(entry => record(entry) && keys(entry, ["slotId", "optionId"]) && atom.slots.some(slot => slot.id === entry.slotId && slot.options.some(option => option.id === entry.optionId)));
}
function equalAnswer(actual: Answer, expected: Answer): boolean {
  if (actual.kind !== expected.kind || actual.kind === "unanswered") return false;
  if (actual.kind === "number" && expected.kind === "number") return closeNumber(actual.value, expected.value);
  if (actual.kind === "choice" && expected.kind === "choice") return actual.optionId === expected.optionId;
  if (actual.kind === "slots" && expected.kind === "slots") return expected.entries.length === actual.entries.length && expected.entries.every(entry => actual.entries.some(item => item.slotId === entry.slotId && item.optionId === entry.optionId));
  return false;
}
function identifier(value: unknown, maximum: number): value is string {
  return typeof value === "string" && new RegExp(`^[a-zA-Z0-9_-]{1,${maximum}}$`).test(value);
}
function validOptions(value: unknown): boolean {
  return Array.isArray(value) && value.length > 1 && value.length <= 8
    && new Set(value.map(option => record(option) ? option.id : null)).size === value.length
    && value.every(option => record(option) && keys(option, ["id", "label"]) && identifier(option.id, 24) && typeof option.label === "string");
}
function validAtom(value: unknown): value is Atom {
  if (!record(value) || !identifier(value.id, 16) || typeof value.label !== "string") return false;
  if (value.kind === "number") return keys(value, ["id", "label", "kind"]);
  if (value.kind === "choice") return keys(value, ["id", "label", "kind", "options"]) && validOptions(value.options);
  if (value.kind !== "slots" || !keys(value, ["id", "label", "kind", "slots"]) || !Array.isArray(value.slots) || value.slots.length < 1 || value.slots.length > 8) return false;
  return new Set(value.slots.map(slot => record(slot) ? slot.id : null)).size === value.slots.length
    && value.slots.every(slot => record(slot) && keys(slot, ["id", "label", "options"]) && identifier(slot.id, 16) && typeof slot.label === "string" && validOptions(slot.options));
}
export function validateDefinition(value: unknown): value is Family {
  if (!bounded(value, 16384) || !record(value) || !keys(value, ["id", "objective", "critical", "prompt", "code", "atoms", "accepted", "explanation", "remediation"])) return false;
  if (!["id", "objective", "prompt", "code", "explanation", "remediation"].every(key => typeof value[key] === "string") || typeof value.critical !== "boolean") return false;
  if ((value.id as string).length > 128 || (value.code as string).split("\n").length > 25 || bytes(value.code as string) > 4096) return false;
  if (!Array.isArray(value.atoms) || value.atoms.length < 1 || value.atoms.length > 2 || (value.critical && value.atoms.length !== 2) || !value.atoms.every(validAtom)) return false;
  const atoms: Atom[] = value.atoms;
  if (new Set(atoms.map(atom => atom.id)).size !== atoms.length || !Array.isArray(value.accepted) || value.accepted.length < 1 || value.accepted.length > 8) return false;
  return value.accepted.every(tuple => Array.isArray(tuple) && tuple.length === atoms.length
    && tuple.every((answer: unknown, index: number) => validAnswer(answer, atoms[index]) && answer.kind !== "unanswered"));
}
export function validResponse(family: Family, value: unknown): value is FamilyResponse {
  if (!bounded(value, 1536) || !record(value) || !keys(value, ["familyId", "answers"]) || value.familyId !== family.id || !Array.isArray(value.answers) || value.answers.length !== family.atoms.length) return false;
  const answers = value.answers;
  return family.atoms.every(atom => answers.filter(entry => record(entry) && keys(entry, ["atomId", "answer"]) && entry.atomId === atom.id && validAnswer(entry.answer, atom)).length === 1);
}
export function gradeFamily(family: Family, response: unknown): Grade {
  if (!validateDefinition(family)) return { status: "invalid", feedback: "This activity is unavailable: unsupported authored configuration." };
  if (!validResponse(family, response)) return { status: "invalid", feedback: "Unsupported answer representation. Use the supplied choices or a finite number; no attempt was counted." };
  const correct = family.accepted.some(tuple => family.atoms.every((atom, index) => equalAnswer(response.answers.find(entry => entry.atomId === atom.id)!.answer, tuple[index])));
  return { status: "graded", correct, feedback: correct ? "Correct. " + family.explanation : "Not yet. " + family.remediation };
}
