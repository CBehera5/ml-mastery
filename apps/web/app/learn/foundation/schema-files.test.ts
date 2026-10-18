import { describe, expect, it } from "vitest";
import curriculumSchema from "../../../../../packages/learning-contracts/schemas/curriculum-catalog.v1.schema.json";
import evidenceSchema from "../../../../../packages/learning-contracts/schemas/learning-evidence.v1.schema.json";
import exerciseSchema from "../../../../../packages/learning-contracts/schemas/exercise-definition.v1.schema.json";
import fixture from "../../../../../packages/learning-contracts/fixtures/exercises.v1.json";

describe("learning contract schema files", () => {
  it("declares matching v1 schema constants and required roots", () => {
    for (const schema of [curriculumSchema, evidenceSchema, exerciseSchema]) {
      expect(schema.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
      expect(schema.properties.schemaVersion.const).toBe("1.0.0");
      expect(schema.required).toContain("schemaVersion");
    }
  });

  it("provides one deterministic fixture for every supported exercise kind", () => {
    expect(fixture.schemaVersion).toBe("1.0.0");
    expect(new Set(fixture.fixtures.map(({ kind }) => kind))).toEqual(new Set(["conceptual", "numerical", "parameter-prediction", "constrained-code"]));
    expect(fixture.fixtures.every(({ expectedCorrect }) => expectedCorrect)).toBe(true);
  });
});
