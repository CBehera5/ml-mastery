import { type Answer, type Atom, type Family, type FamilyResponse } from "./contracts";

export const OBJECTIVES = ["python.essentials.p01.o1", "python.essentials.p01.o2", "python.essentials.p01.o3", "python.essentials.p01.o4"] as const;
const choice = (optionId: string): Answer => ({ kind: "choice", optionId });
const slots = (entries: Record<string, string>): Answer => ({ kind: "slots", entries: Object.entries(entries).map(([slotId, optionId]) => ({ slotId, optionId })) });
const options = (entries: Record<string, string>) => Object.entries(entries).map(([id, label]) => ({ id, label }));
const rotate = <Value,>(items: Value[], offset: number) => [...items.slice(offset % items.length), ...items.slice(0, offset % items.length)];
const typeOptions = options({ int: "int — whole number", float: "float — decimal number", str: "str — text", bool: "bool — True or False" });
const repairs = [
  { id: "expression", label: "Repair the numeric expression", options: options({ grouped: "(float(area) + 1) * 100", distributed: "float(area) * 100 + 100", ungrouped: "float(area) + 1 * 100" }) },
  { id: "failure", label: "What if area is 'unknown'?", options: options({ value_error: "ValueError: the text is not a supported number.", zero: "It becomes zero automatically.", repeat: "It repeats the text." }) },
];
const decisionOptions = (value: number, bias: number) => options({ correct: `${value} (₹ lakh), numeric prediction`, precedence: `${value + bias} (₹ lakh), add bias twice`, rupees: `${value} rupees, not ₹ lakh`, text: "Text repetition is a valid numeric price." });
export function family(objectiveIndex: number, variant: number, independent = false): Family {
  const suffix = independent ? ["A", "B", "C"][variant] : ["A", "B"][variant];
  const id = `python.essentials.p01.o${objectiveIndex + 1}.${independent ? "mastery" : "practice"}.${suffix.toLowerCase()}`;
  if (objectiveIndex === 0) {
    const cases = independent ? [
      { code: "distance = 2.5", field: "distance", type: "float" },
      { code: "eligible = False", field: "eligible", type: "bool" },
      { code: "rooms = 4", field: "rooms", type: "int" },
    ] : [{ code: "rooms = '3'", field: "rooms", type: "str" }, { code: "has_garage = True", field: "has_garage", type: "bool" }];
    const item = cases[variant];
    return { id, objective: "P01.O1", critical: false, prompt: `What Python type does ${item.field} hold in this feature record?`, code: item.code, atoms: [{ id: "type", label: "Choose the value's type", kind: "choice", options: typeOptions }], accepted: [[choice(item.type)]], explanation: "The stored value's type determines which operations mean numeric arithmetic, text processing or a yes/no decision.", remediation: "Look at the value, not its field name. Quotes mean str; True/False mean bool; a decimal literal is float. Numeric-looking text is not a number." };
  }
  if (objectiveIndex === 1) {
    const area = independent ? [3, 5, 6][variant] : [2, 4][variant];
    const weight = independent ? [80, 60, 40][variant] : 100;
    const bias = independent ? [20, 30, 10][variant] : 50;
    const prediction = area * weight + bias;
    const reasonOptions = options({ add_first: "Add bias to weight first, then multiply; feature units do not matter.", numeric_order: `Multiply numeric area by weight (₹ lakh/unit), then add bias (₹ lakh). '${area}' * 3 repeats text, not a price.`, text_numeric: "A digit in quotes is already numeric; repetition computes its numeric product." });
    return { id, objective: "P01.O2", critical: true, prompt: "Area is in area units, weight in ₹ lakh/unit and bias in ₹ lakh. Predict the house-price rule, then justify its types, order and units. Both parts must be correct.", code: `area = ${area}\nweight = ${weight}\nbias = ${bias}\nprediction = area * weight + bias\ntext_example = '${area}' * 3`, atoms: [{ id: "decision", label: "Prediction and units", kind: "choice", options: rotate(decisionOptions(prediction, bias), variant + (independent ? 2 : 0)) }, { id: "reason", label: "Why is that a numeric prediction, unlike the text example?", kind: "choice", options: rotate(reasonOptions, variant + (independent ? 1 : 0)) }], accepted: [[choice("correct"), choice("numeric_order")]], explanation: `Multiplication precedes addition: ${area} × ${weight} + ${bias} = ${prediction} (₹ lakh). The units and numeric types make it meaningful; quoted text repeats.`, remediation: `Substitute numeric values: ${area} × ${weight}, then add ${bias}; the result is in ₹ lakh. Compare '${area}' * 3, a str containing three copies. Correct arithmetic alone cannot compensate for a wrong unit or explanation.` };
  }
  if (objectiveIndex === 2) {
    const start = independent ? [7, 10, 12][variant] : [2, 5][variant];
    const delta = independent ? [2, -3, 4][variant] : [1, 2][variant];
    const final = start + delta;
    return { id, objective: "P01.O3", critical: false, prompt: "Trace the stored feature value and the comparison result. Does == change the value?", code: `area = ${start}\narea = area + (${delta})\ncomparison = area == ${start}`, atoms: [{ id: "value", label: "Final numeric area", kind: "number" }, { id: "comparison", label: "Comparison and effect", kind: "choice", options: options({ false_unchanged: "False; == does not reassign area.", true_reassigned: "True; == resets area to its earlier value.", false_deleted: "False; == deletes area." }) }], accepted: [[{ kind: "number", value: final }, choice("false_unchanged")]], explanation: `The assignment stores ${final}. Comparing it with ${start} gives False without changing it.`, remediation: `Write a name/value table: area starts at ${start}, then the assignment stores ${final}. == asks a question and returns bool; it does not undo assignment.` };
  }
  const literal = independent ? ["4", "6", "8"][variant] : ["2", "3"][variant];
  const atoms: Atom[] = [{ id: "repair", label: "Select both repairs: numeric grouping and conversion-failure meaning", kind: "slots", slots: repairs }];
  return { id, objective: "P01.O4", critical: false, prompt: "The intended feature rule adds one area unit, then multiplies by 100 (₹ lakh/unit). Repair it, and identify what invalid text does.", code: `area = '${literal}'\nprediction = area + 1 * 100\ninvalid_area = 'unknown'`, atoms, accepted: [[slots({ expression: "grouped", failure: "value_error" })], [slots({ expression: "distributed", failure: "value_error" })]], explanation: `Both (float(area)+1)*100 and float(area)*100+100 give ${(Number(literal) + 1) * 100} for this numeric text. Neither accepts 'unknown': float conversion raises ValueError, not a zero price.`, remediation: "First convert supplied numeric text explicitly, then group the intended addition or distribute multiplication correctly. float('unknown') raises ValueError. Do not silently replace a failed conversion with zero." };
}
function deepFreeze<Value>(value: Value): Value {
  if (value !== null && typeof value === "object") { Object.freeze(value); Object.values(value).forEach(deepFreeze); }
  return value;
}
export const PRACTICE = deepFreeze(OBJECTIVES.map((_, index) => [family(index, 0), family(index, 1)]));
export const EXPERIMENT = deepFreeze([
  { id: "numeric-2", label: "Numeric area 2", code: "2 * 100 + 50", value: "250", type: "int", units: "₹ lakh", reason: "weighted", steps: ["2 × 100 = 200 (₹ lakh)", "200 + 50 = 250 (₹ lakh)"] },
  { id: "numeric-4", label: "Numeric area 4", code: "4 * 100 + 50", value: "450", type: "int", units: "₹ lakh", reason: "weighted", steps: ["4 × 100 = 400 (₹ lakh)", "400 + 50 = 450 (₹ lakh)"] },
  { id: "decimal", label: "Decimal area 2.5", code: "2.5 * 100 + 50", value: "300.0", type: "float", units: "₹ lakh", reason: "weighted", steps: ["2.5 × 100 = 250.0 (₹ lakh)", "250.0 + 50 = 300.0 (₹ lakh)"] },
  { id: "text", label: "Text '2' repeated", code: "'2' * 3", value: "'222'", type: "str", units: "no numeric price units", reason: "repeat", steps: ["Copy text '2' three times", "Result is text '222', not 6 or a house price"] },
  { id: "convert", label: "Convert numeric text", code: "float('2') * 100 + 50", value: "250.0", type: "float", units: "₹ lakh", reason: "convert", steps: ["float('2') = 2.0", "2.0 × 100 + 50 = 250.0 (₹ lakh)"] },
  { id: "invalid", label: "Convert invalid text", code: "float('unknown')", value: "ValueError", type: "error", units: "no prediction", reason: "error", steps: ["'unknown' is not valid numeric text", "Conversion fails; no numeric prediction is produced"] },
]);
export const REASONS = options({ weighted: "Numeric multiplication first, then bias, in ₹ lakh.", repeat: "Quoted text repeats; it is not a numeric prediction.", convert: "Explicit conversion makes numeric text a float before arithmetic.", error: "Invalid conversion raises ValueError; it does not become zero." });
export const PREDICTIONS = ["250", "450", "300.0", "'222'", "250.0", "ValueError", "6", "0"] as const;
export function responseFor(family: Family, answers: Record<string, Answer>): FamilyResponse {
  return { familyId: family.id, answers: family.atoms.map(atom => ({ atomId: atom.id, answer: answers[atom.id] ?? { kind: "unanswered" } })) };
}
