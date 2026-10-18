import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Manifest = { manifestId: string; experimentId: string; fixtures?: Record<string, unknown>; fixture?: Record<string, unknown>; configurations: Record<string, unknown>[] };
let frozen: Manifest[] | null = null;
function readManifests() {
  const directory = join(process.cwd(), "docs/verification/model-selection");
  const lock = JSON.parse(readFileSync(join(directory, "freeze-lock.v1.json"), "utf8")) as { sha256: Record<string, string> };
  return ["ms-e1.manifest.v1.json", "ms-e2.manifest.v1.json"].map(filename => {
    const raw = readFileSync(join(directory, filename), "utf8");
    if (createHash("sha256").update(raw).digest("hex") !== lock.sha256[`docs/verification/model-selection/${filename}`]) throw Error("Model-selection reference hash mismatch.");
    return JSON.parse(raw) as Manifest;
  });
}
function publicFixture(manifest: Manifest) {
  const fixtureMap = manifest.fixtures;
  if (fixtureMap) return Object.fromEntries(Object.entries(fixtureMap).map(([key, value]) => [key, Array.isArray(value) ? value.map(item => stripSealed(item)) : stripSealed(value)]));
  return stripSealed(manifest.fixture ?? {});
}
function stripSealed(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripSealed);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .filter(([key]) => !/sealed|testTarget|testLabels|testTruth|testOutcome|testRows|testFeature|testPartition|sidecar/i.test(key) && key !== "test")
    .map(([key, item]) => [key, stripSealed(item)]));
}
function publicConfig(value: Record<string, unknown>) {
  const safe = stripSealed(value) as Record<string, unknown>;
  delete safe.referenceSidecar;
  return safe;
}
function display(config: Record<string, unknown>, lab: number) {
  const status = String(config.status ?? "fitted-reference");
  const rejected = status === "rejected";
  const finalSealed = status === "sealed-until-choice-freeze";
  const correctPrediction = rejected ? "reject" : finalSealed ? "frozen" : "fair";
  return {
    id: String(config.configId),
    kind: rejected ? "rejection diagnostic" : finalSealed ? "sealed final evaluation protocol" : lab === 0 ? "same-row fitted model comparison" : "development selection reference",
    predictionQuestion: rejected ? "Should this proposed comparison be accepted or rejected?" : finalSealed ? "What must happen before this one-time final evaluation is opened?" : lab === 0 ? "What makes this candidate result comparable with its baseline and alternatives?" : "Which data boundary governs this selection or evaluation state?",
    predictionOptions: [
      { id: "fair", label: "Accept as a development comparison under the shared declared boundaries." },
      { id: "reject", label: "Reject the invalid comparison or boundary violation." },
      { id: "frozen", label: "Freeze all selection choices, then permit only the declared single final evaluation." },
    ],
    reasonOptions: [
      { id: "mechanism", label: "The row/fold IDs, metric and preprocessing fit boundary determine what the score can support." },
      { id: "boundary", label: "Validation/test feedback may freely tune the candidate because the estimator did not fit those labels." },
      { id: "shortcut", label: "The largest displayed score is always the fairest and most useful choice." },
    ],
    correctPrediction,
    correctReason: "mechanism",
    explanation: rejected ? String(config.message ?? "The state violates an approved comparison boundary and has no fitted score.") : finalSealed ? "Selection must already be frozen. This app response exposes no sealed test targets or outcome." : lab === 0 ? "Read the candidate's task, fit-row IDs, validation IDs, primary metric, budget and preprocessing fit rows. The reference contains no MS-E1 test outcome." : "Development selection, cross-validation and final evaluation have distinct roles. Test results are never a tuning signal.",
    counterexample: rejected ? `A computation can run while its comparison is invalid (${String(config.reasonCode ?? "boundary violation")}).` : "Matching row counts are not enough if row IDs differ, and a test score used to choose becomes development feedback.",
    reference: publicConfig(config),
  };
}
export async function GET(request: Request) {
  const url = new URL(request.url), lab = Number(url.searchParams.get("lab")), id = url.searchParams.get("id");
  if (!Number.isInteger(lab) || lab < 0 || lab > 1 || !id || id.length > 128) return Response.json({ error: "reference-unavailable" }, { status: 404 });
  try { frozen ??= readManifests(); } catch { return Response.json({ error: "reference-hash-mismatch" }, { status: 503 }); }
  const manifest = frozen[lab], config = manifest.configurations.find(item => item.configId === id);
  if (!config) return Response.json({ error: "unsupported-reference" }, { status: 404 });
  const dataset = publicFixture(manifest);
  return Response.json({ id: manifest.manifestId, fixture_version: `MS-reference-v1-${lab + 1}`, config: display(config, lab), dataset,
    sealed_test: "Test targets and sealed sidecar outputs are not sent to the browser." }, { headers: { "Cache-Control": "private, no-store" } });
}
