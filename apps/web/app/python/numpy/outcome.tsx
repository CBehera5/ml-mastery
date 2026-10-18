import { record } from "../foundation/contracts";
export function Outcome({ value, label }: { value: unknown; label: string }) {
  if (record(value) && Array.isArray(value.shape) && typeof value.dtype === "string" && "values" in value) {
    const shape = value.shape as number[];
    if (shape.length === 0) return <p>{label}: scalar array, shape (), dtype {value.dtype}; no axes. Value: <code>{JSON.stringify(value.values)}</code>.</p>;
    const rows: unknown[][] = shape.length === 2 ? value.values as unknown[][] : [Array.isArray(value.values) ? value.values : [value.values]];
    return <section aria-label={label}><p>{label}: shape ({shape.join(",")}{shape.length === 1 ? "," : ""}), dtype {value.dtype}. Coordinates are zero-based; consult the stated observation/feature meaning before interpreting axes.</p><div role="region" aria-label={`${label} coordinate table`} tabIndex={0} style={{ overflowX: "auto" }}><table><caption>{label} — ordered values</caption><thead><tr><th>Coordinate</th>{rows[0]?.map((_, column) => <th key={column}>{shape.length === 2 ? `axis1=${column}` : `index=${column}`}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}><th>{shape.length === 2 ? `axis0=${index}` : "values"}</th>{row.map((cell, column) => <td key={column}>{JSON.stringify(cell)}</td>)}</tr>)}</tbody></table></div></section>;
  }
  if (record(value)) return <section aria-label={label}>{Object.entries(value).map(([key, item]) => <Outcome key={key} value={item} label={`${label}: ${key}`}/>)}</section>;
  if (Array.isArray(value)) return <section aria-label={label}>{value.map((item, index) => <Outcome key={index} value={item} label={`${label}: part ${index + 1}`}/>)}</section>;
  return <p>{label}: <code>{JSON.stringify(value)}</code></p>;
}
