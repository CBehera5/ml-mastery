import { useId } from "react";
import { record } from "../foundation/contracts";
type Series = { name: string; x: number[]; y: number[]; ids: string[]; marker: string; style: string };
type Box = { label: string; q1: number; med: number; q3: number; whislo: number; whishi: number; fliers: number[] };
type Plot = { type: string; title: string; xlabel: string; ylabel: string; xlim: number[]; ylim: number[]; series: Series[]; bars: { left: number; width: number; height: number }[]; boxes: Box[]; density: boolean };
const show = (value: unknown) => JSON.stringify(value);
export function Outcome({ value, label }: { value: unknown; label: string }) {
  if (record(value)) return <section aria-label={label}>{Object.entries(value).map(([key, item]) => <Outcome key={key} value={item} label={`${label}: ${key}`}/>)}</section>;
  return <p style={{ overflowWrap: "anywhere" }}>{label}: <code style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>{show(value)}</code></p>;
}
function PlotFigure({ plot, label }: { plot: Plot; label: string }) {
  const clip = useId();
  const horizontal = (value: number) => 72 + (value - plot.xlim[0]) / (plot.xlim[1] - plot.xlim[0]) * 530;
  const vertical = (value: number) => 270 - (value - plot.ylim[0]) / (plot.ylim[1] - plot.ylim[0]) * 230;
  const short = (value: number) => Number(value.toPrecision(4)).toString();
  return <figure style={{ margin: "1rem 0", minWidth: 0 }} aria-label={label}>
    <figcaption><strong>{plot.title}</strong> — {plot.type}. {plot.xlabel} versus {plot.ylabel}. These are supplied observations/reference calculations, not execution of learner code.</figcaption>
    <svg role="img" aria-label={`${label}: ${plot.title}. Exact numerical alternative follows.`} viewBox="0 0 640 340" style={{ width: "100%", height: "auto", background: "#111827", color: "#f9fafb" }}>
      <title>{plot.title}</title><desc>{plot.xlabel}; {plot.ylabel}. Limits {show(plot.xlim)} and {show(plot.ylim)}. See the following numerical alternative for all coordinates and conventions.</desc>
      <defs><clipPath id={clip}><rect x="72" y="40" width="530" height="230"/></clipPath></defs>
      <path d="M72 40V270H602" fill="none" stroke="#f9fafb"/>
      {Array.from({ length: 5 }, (_, index) => {
        const xvalue = plot.xlim[0] + index * (plot.xlim[1] - plot.xlim[0]) / 4;
        const yvalue = plot.ylim[0] + index * (plot.ylim[1] - plot.ylim[0]) / 4;
        return <g key={index} fill="#f9fafb" fontSize="12">{plot.type !== "box" && <text x={horizontal(xvalue)} y="289" textAnchor="middle">{short(xvalue)}</text>}<text x="65" y={vertical(yvalue) + 4} textAnchor="end">{short(yvalue)}</text></g>;
      })}
      {plot.boxes.map((box, index) => <text key={index} x={horizontal(index + 1)} y="289" fill="#f9fafb" fontSize="12" textAnchor="middle">{box.label}</text>)}
      <g clipPath={`url(#${clip})`}>
        {plot.series.map((series, index) => <g key={index} stroke={index % 2 ? "#fbbf24" : "#67e8f9"} fill={index % 2 ? "#fbbf24" : "#67e8f9"}>
          {plot.type === "line" && <polyline points={series.x.map((value, offset) => `${horizontal(value)},${vertical(series.y[offset])}`).join(" ")} fill="none" strokeWidth="2" strokeDasharray={series.style === "--" ? "7 4" : undefined}/>}
          {series.x.map((value, offset) => series.marker === "^" || series.marker === "triangle" ? <polygon key={offset} points={`${horizontal(value)},${vertical(series.y[offset]) - 5} ${horizontal(value) - 5},${vertical(series.y[offset]) + 4} ${horizontal(value) + 5},${vertical(series.y[offset]) + 4}`}/> : <circle key={offset} cx={horizontal(value)} cy={vertical(series.y[offset])} r="4"/>)}
        </g>)}
        {plot.bars.map((bar, index) => <rect key={index} x={horizontal(bar.left)} y={vertical(bar.height)} width={horizontal(bar.left + bar.width) - horizontal(bar.left)} height={vertical(0) - vertical(bar.height)} fill="#67e8f9" fillOpacity=".6" stroke="#f9fafb"/>)}
        {plot.boxes.map((box, index) => {
          const center = horizontal(index + 1);
          return <g key={index} stroke="#67e8f9" strokeWidth="2" fill="none"><path d={`M${center} ${vertical(box.whislo)}V${vertical(box.whishi)}M${center - 14} ${vertical(box.whislo)}H${center + 14}M${center - 14} ${vertical(box.whishi)}H${center + 14}`}/><rect x={center - 25} y={vertical(box.q3)} width="50" height={vertical(box.q1) - vertical(box.q3)} fill="#111827"/><path d={`M${center - 25} ${vertical(box.med)}H${center + 25}`} stroke="#fbbf24"/>{box.fliers.map((value, offset) => <circle key={offset} cx={center} cy={vertical(value)} r="4"/>)}</g>;
        })}
      </g>
      <text x="337" y="322" fill="#f9fafb" fontSize="13" textAnchor="middle">{plot.xlabel}</text><text x="16" y="155" fill="#f9fafb" fontSize="13" transform="rotate(-90 16 155)" textAnchor="middle">{plot.ylabel}</text>
    </svg>
    <section aria-label={`${label} numerical alternative`} style={{ overflowWrap: "anywhere" }}>
      <p>Linear x limits {show(plot.xlim)}; linear y limits {show(plot.ylim)}. {plot.density ? "Histogram height is density; probability is area = height × bin width." : "Read the stated units, not only apparent height or slope."}</p>
      {plot.series.map((series, index) => <section key={index}><h4>{series.name}</h4><p>Marker {series.marker}; style {series.style}. Order and pairing are preserved.</p><ol>{series.x.map((value, offset) => <li key={offset}>Observation {series.ids[offset]}: x={show(value)}; y={show(series.y[offset])}.</li>)}</ol></section>)}
      {plot.bars.length > 0 && <ol>{plot.bars.map((bar, index) => <li key={index}>Bin {index + 1}: left={show(bar.left)}, right={show(bar.left + bar.width)}, width={show(bar.width)}, height={show(bar.height)}. Left inclusive; {index === plot.bars.length - 1 ? "final right edge inclusive" : "right edge excluded"}.{plot.density ? ` Probability area=${show(bar.width * bar.height)}.` : ""}</li>)}</ol>}
      {plot.boxes.map((box, index) => <p key={index}>Group {index + 1} ({box.label}): Q1={show(box.q1)}, median={show(box.med)}, Q3={show(box.q3)}, lower observed whisker={show(box.whislo)}, upper observed whisker={show(box.whishi)}, marked observations={show(box.fliers)}. Linear quartiles;1.5-IQR fences. Raw values/counts follow in the outcome.</p>)}
    </section>
  </figure>;
}
export function Chart({ charts, label }: { charts: unknown; label: string }) {
  return <section aria-label={label}>{(charts as Plot[]).map((plot, index) => <PlotFigure key={index} plot={plot} label={`${label} ${index + 1}`}/>)}</section>;
}
