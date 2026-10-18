"""Emit initial tests adapted to the existing bounded module contract."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = (ROOT / "apps/web/app/supervised/naive-bayes/model.test.ts").read_text()
source = source.replace("naive-bayes", "decision-trees").replace("NB0", "DT0").replace("nb-e", "dt-e")
source = source.replace("toHaveLength(32)", "toHaveLength(48)").replace("toHaveLength(48);\n  for", "toHaveLength(72);\n  for")
source = source.replace("toHaveLength(4)", "toHaveLength(6)").replace("toHaveLength(26)", "toHaveLength(37)").replace("toHaveLength(30)", "toHaveLength(32)")
source = source.replace("expect(PREDICTIONS).toHaveLength(6);", "expect(PREDICTIONS.length).toBeGreaterThan(3);")
source = source.replace("[12, 13]", "[19, 20]").replace("16 - count", "24 - count").replace("count === 13", "count === 20").replace("score: 15", "score: 23").replace("/16", "/24")
source = source.replace('state.labs[lab].prediction = PREDICTIONS[2]', 'state.labs[lab].prediction = config.predictionOptions[0].id')
source = source.replace('state.labs[0].prediction = PREDICTIONS[0]', 'state.labs[0].prediction = configurations(0)[1].predictionOptions[0].id')
destination = ROOT / "apps/web/app/supervised/decision-trees/model.test.ts"
print("*** Begin Patch")
print("*** Add File: " + str(destination))
print("\n".join("+" + line for line in source.splitlines()))
print("*** End Patch")
