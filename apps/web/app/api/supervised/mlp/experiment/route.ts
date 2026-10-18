import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
let frozenCache: ReturnType<typeof readFrozenManifests> | null = null;
function readFrozenManifests() {
  const directory = join(process.cwd(), "docs/verification/multilayer-perceptrons");
  const lock = JSON.parse(readFileSync(join(directory, "freeze-lock.v1.json"), "utf8")) as { sha256: Record<string, string> };
  const files = ["nn-e1.manifest.v1.json", "nn-e2.manifest.v1.json"];
  const values = files.map(filename => {
    const raw = readFileSync(join(directory, filename), "utf8");
    if (createHash("sha256").update(raw).digest("hex") !== lock.sha256[filename]) throw Error("MLP reference hash mismatch.");
    return JSON.parse(raw) as { id: string; datasets: Record<string, unknown>[]; configurations: Record<string, unknown>[] };
  });
  return values;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lab = Number(url.searchParams.get("lab"));
  const id = url.searchParams.get("id");
  if (!Number.isInteger(lab) || lab < 0 || lab > 1 || !id || id.length > 128) return Response.json({ error: "reference-unavailable" }, { status: 404 });
  let manifests;
  try { frozenCache ??= readFrozenManifests(); manifests = frozenCache; } catch { return Response.json({ error: "reference-hash-mismatch" }, { status: 503 }); }
  const manifest = manifests[lab];
  const config = manifest.configurations.find(item => item.id === id);
  if (!config) return Response.json({ error: "unsupported-reference" }, { status: 404 });
  const dataset = { ...manifest.datasets[0] };
  delete dataset.sealed_test;
  return Response.json({
    id: manifest.id,
    fixture_version: "NN-reference-v1",
    config,
    dataset,
    sealed_test: "Not sent to the browser; test rows are untouched and excluded from all selection."
  }, { headers: { "Cache-Control": "private, no-store" } });
}
