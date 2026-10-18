import { describe, expect, it } from "vitest";
import reference from "../../../../../packages/python-contracts/fixtures/p01.v1.json";
import { EXPERIMENT, PRACTICE } from "./fixtures";
import { INDEPENDENT_TEST_ONLY } from "./test-fixtures";
describe("trusted Python / TypeScript fixture parity", () => {
  it("matches all six reachable experiment states", () => {
    expect(EXPERIMENT.map(({ id, value, type }) => ({ id, value, type }))).toEqual(reference.experiments);
  });
  it("matches all eight practice and twelve independent-only families to the Python oracle", () => {
    for (const [group, definitions] of [[reference.groups.practice, PRACTICE], [reference.groups.independent_test_only, INDEPENDENT_TEST_ONLY]] as const) {
      for (const item of group) {
        const variant = item.variant;
        expect(definitions[0][variant].accepted[0][0]).toEqual({ kind: "choice", optionId: item.type });
        expect(definitions[1][variant].code).toContain(`area = ${item.area}`);
        expect(definitions[1][variant].code).toContain(`weight = ${item.weight}`);
        expect(definitions[1][variant].code).toContain(`bias = ${item.bias}`);
        const atom = definitions[1][variant].atoms[0];
        if (atom.kind !== "choice") throw Error("Expected choice");
        expect(atom.options.find(option => option.id === "correct")!.label).toBe(`${item.prediction} ($k), numeric prediction`);
        expect(definitions[2][variant].accepted[0][0]).toEqual({ kind: "number", value: item.final });
        expect(item.comparison).toBe(false);
        expect(definitions[3][variant].explanation).toContain(String(item.grouped));
        expect(item.grouped).toBe(item.distributed);
        expect(item.grouped).not.toBe(item.ungrouped);
      }
    }
  });
});
