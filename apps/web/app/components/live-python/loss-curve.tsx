"use client";
import { useState } from "react";
import styles from "./live-python.module.css";

/** Plain SVG line chart for a list of loss values, with a linear/log toggle and a text equivalent. */
export function LossCurve({ values, title = "Loss after each step" }: { values: unknown; title?: string }) {
  const [log, setLog] = useState(true);
  const data = Array.isArray(values) ? values.filter((v): v is number => typeof v === "number" && Number.isFinite(v)) : [];
  if (data.length < 2) return <p className={styles.hint}>Run the code to draw the loss curve.</p>;

  const W = 560, H = 250, L = 78, R = 16, T = 18, B = 40;
  const positive = data.every((v) => v > 0);
  const useLog = log && positive;
  const t = (v: number) => (useLog ? Math.log10(v) : v);
  const lo = Math.min(...data.map(t)), hi = Math.max(...data.map(t));
  const span = hi - lo || 1;
  const x = (i: number) => L + (i / (data.length - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - (t(v) - lo) / span) * (H - T - B);
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const fmt = (v: number) => (Math.abs(v) >= 1e6 ? v.toExponential(1) : new Intl.NumberFormat("en-US", { maximumFractionDigits: v < 10 ? 2 : 0 }).format(v));
  const first = data[0], last = data[data.length - 1];
  const rose = data.some((v, i) => i > 0 && v > data[i - 1]);
  const summary = `${title}: starts at ${fmt(first)}, ends at ${fmt(last)} after ${data.length - 1} steps${rose ? "; at least one step made the loss go up" : "; every step lowered the loss"}.`;

  return (
    <figure className={styles.chart}>
      <figcaption>
        <strong>{title}</strong>
        <label className={styles.toggle}><input type="checkbox" checked={useLog} disabled={!positive} onChange={(e) => setLog(e.target.checked)} /> Log scale</label>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
        <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="#fbfaf5" stroke="#d8d8ce" />
        {[0, 0.5, 1].map((f) => { const v = lo + f * span; const label = useLog ? 10 ** v : v; const yy = T + (1 - f) * (H - T - B); return <g key={f}><line x1={L} x2={W - R} y1={yy} y2={yy} stroke="#e7e6dc" /><text x={L - 8} y={yy + 4} textAnchor="end" fontSize="11" fill="#66716b">{fmt(label)}</text></g>; })}
        <path d={path} fill="none" stroke="#1f7568" strokeWidth="2.5" strokeLinejoin="round" />
        {data.map((v, i) => (data.length <= 41 || i === data.length - 1) && <circle key={i} cx={x(i)} cy={y(v)} r={i === 0 || i === data.length - 1 ? 4.5 : 2.5} fill={i === 0 ? "#e36c28" : "#1f7568"} />)}
        <text x={(L + W - R) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#16211c">step (0 = before any update)</text>
        <text x={13} y={(T + H - B) / 2} textAnchor="middle" fontSize="12" fill="#16211c" transform={`rotate(-90 13 ${(T + H - B) / 2})`}>loss (mean squared error)</text>
        <text x={x(data.length - 1) - 6} y={y(last) - 10} textAnchor="end" fontSize="11" fontWeight="700" fill="#15574e">{fmt(last)}</text>
      </svg>
      <p className={styles.hint}>{summary}</p>
    </figure>
  );
}
