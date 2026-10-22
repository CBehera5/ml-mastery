import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GET } from "./route";

describe("Task 015.12 frozen experiment endpoint", () => {
  it("serves only reviewed configurations and strips sealed test targets and outcomes", async () => {
    for (const [lab, id, manifestId, version] of [
      [0, "MS-E1-REGRESSION-MEAN-BASELINE", "TASK-015.12-MS-E1-V1", 1],
      [1, "MS-E2-FINAL-TEST-EVALUATION-ONCE", "TASK-015.12-MS-E2-V3", 3],
    ] as const) {
      const response = await GET(new Request(`http://local/api?lab=${lab}&id=${id}`));
      expect(response.status).toBe(200);
      const payload = await response.json() as { id: string; fixture_version: string };
      expect(payload.id).toBe(manifestId);
      expect(payload.fixture_version).toBe(`MS-reference-v${version}-${lab + 1}`);
      const body = JSON.stringify(payload);
      for (const file of ["ms-e1-test-reference-sealed.v1.json", "ms-e2-test-reference-sealed.v1.json"]) {
        const sidecar = readFileSync(`docs/verification/model-selection/${file}`, "utf8");
        const parsed = JSON.parse(sidecar) as { fixtures?: { testRows?: { rowId: string; target: number }[] }[]; testRows?: { rowId: string; target: number }[] };
        const targets = [...(parsed.testRows ?? []), ...(parsed.fixtures ?? []).flatMap(fixture => fixture.testRows ?? [])];
        expect(body).not.toContain(file);
        for (const row of targets) expect(body).not.toContain(row.rowId);
      }
      expect(body).not.toMatch(/sealedTestTargetRows|positiveProbabilities|metricsAndCost|testOutcome/);
      expect(body).toContain("not sent to the browser");
    }
  });
  it("rejects unknown configurations and malformed selectors", async () => {
    expect((await GET(new Request("http://local/api?lab=0&id=unknown"))).status).toBe(404);
    expect((await GET(new Request("http://local/api?lab=2&id=x"))).status).toBe(404);
    expect((await GET(new Request("http://local/api?lab=no&id=x"))).status).toBe(404);
  });
});
