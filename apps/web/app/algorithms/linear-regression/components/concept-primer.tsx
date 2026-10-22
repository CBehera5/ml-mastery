import Link from "next/link";
import { conceptList, type ConceptKey } from "../../../learn/foundation/concepts";

export function ConceptPrimer({ title, reminder, concepts }: { title: string; reminder: string; concepts: ConceptKey[] }) {
  return <aside className="concept-primer" aria-labelledby={`concept-primer-${concepts.join("-")}`}><div><p className="eyebrow">Concept bridge</p><h2 id={`concept-primer-${concepts.join("-")}`}>{title}</h2><p>{reminder}</p></div><dl>{conceptList(concepts).map((concept) => <div key={concept.id}><dt>{concept.term}{concept.symbol && <code>{concept.symbol}</code>}</dt><dd><strong>{concept.definition}</strong><span>{concept.intuition}</span>{concept.prerequisite && <Link href={concept.prerequisite.href}>{concept.prerequisite.label} →</Link>}</dd></div>)}</dl></aside>;
}
