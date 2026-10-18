import { record } from "../foundation/contracts";
const show = (value: unknown) => record(value) && value.tag === "missing" ? "missing (not zero)" : JSON.stringify(value);
export function Outcome({ value, label }: { value: unknown; label: string }) {
  if (record(value) && (value.kind === "frame" || value.kind === "series") && Array.isArray(value.index)) {
    const frame = value.kind === "frame";
    const columns = frame ? value.columns as string[] : [value.name === null ? "unnamed value" : String(value.name)];
    const rows = frame ? value.rows as unknown[][] : (value.values as unknown[]).map(item => [item]);
    const types = frame ? value.dtypes as string[] : [String(value.dtype)];
    return <section aria-label={label}><p>{label}: {frame ? `DataFrame shape (${rows.length},${columns.length})` : `Series length ${rows.length}`}. Index levels: {show(value.index_names)}. Ordered columns/types: {columns.map((name, index) => `${name}: ${types[index]}`).join("; ")}.</p><div role="region" tabIndex={0} aria-label={`${label} labeled table`} style={{ overflowX: "auto" }}><table style={{ minWidth: Math.max(280, (columns.length + 1) * 110) }}><caption>{label} — exact ordered observations</caption><thead><tr><th>Index label</th>{columns.map((name, index) => <th key={index}>{name}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}><th>{show((value.index as unknown[])[index])}</th>{row.map((cell, column) => <td key={column}>{show(cell)}</td>)}</tr>)}</tbody></table></div><details><summary>Read {label} as wrapping row text</summary><ol>{rows.map((row, index) => <li key={index}>Index {show((value.index as unknown[])[index])}: {columns.map((name, column) => `${name}=${show(row[column])}`).join("; ")}</li>)}</ol></details></section>;
  }
  if (record(value)) return <section aria-label={label}>{Object.entries(value).map(([key, item]) => <Outcome key={key} value={item} label={`${label}: ${key}`}/>)}</section>;
  if (Array.isArray(value)) return <p>{label}: <code>{JSON.stringify(value)}</code></p>;
  return <p>{label}: <code>{show(value)}</code></p>;
}
