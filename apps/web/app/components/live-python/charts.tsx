"use client";
import styles from "./live-python.module.css";

const nums = (v: unknown): number[] | null => (Array.isArray(v) && v.length > 0 && v.every((n) => typeof n === "number" && Number.isFinite(n)) ? (v as number[]) : null);
const fmt = (v: number) => (Math.abs(v) >= 1e5 ? v.toExponential(1) : new Intl.NumberFormat("en-US", { maximumFractionDigits: Math.abs(v) < 10 ? 2 : 1 }).format(v));

/** Scatter of data with the line y = w·x + b, an optional ghost line for comparison, and a text equivalent. */
export function FitPlot({ x, y, w, b, ghost, title, xLabel, yLabel, ghostLabel = "line fitted to the original data" }: {
  x: unknown; y: unknown; w: unknown; b: unknown; ghost?: [number, number]; title: string; xLabel: string; yLabel: string; ghostLabel?: string;
}) {
  const xs = nums(x), ys = nums(y);
  if (!xs || !ys || xs.length !== ys.length || typeof w !== "number" || typeof b !== "number" || !Number.isFinite(w) || !Number.isFinite(b)) return <p className={styles.hint}>Run the code to draw the chart.</p>;
  const W = 560, H = 280, L = 62, R = 16, T = 16, B = 44;
  const xMin = 0, xMax = Math.max(...xs) * 1.1;
  const lineYs = [w * xMin + b, w * xMax + b, ...(ghost ? [ghost[0] * xMin + ghost[1], ghost[0] * xMax + ghost[1]] : [])];
  const all = [...ys, ...lineYs];
  const yMin = Math.min(0, ...all), yMax = Math.max(...all) * 1.05;
  const sx = (v: number) => L + ((v - xMin) / (xMax - xMin)) * (W - L - R);
  const sy = (v: number) => T + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - T - B);
  const summary = `${title}: ${xs.length} points. The line is y = ${fmt(w)} × x + ${fmt(b)}${ghost ? `; the grey dashed line is the ${ghostLabel} (slope ${fmt(ghost[0])})` : ""}.`;
  return (
    <figure className={styles.chart}>
      <figcaption><strong>{title}</strong></figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
        <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="#fbfaf5" stroke="#d8d8ce" />
        {[0, 0.5, 1].map((f) => { const v = yMin + f * (yMax - yMin); const yy = sy(v); return <g key={f}><line x1={L} x2={W - R} y1={yy} y2={yy} stroke="#e7e6dc" /><text x={L - 8} y={yy + 4} textAnchor="end" fontSize="11" fill="#66716b">{fmt(v)}</text></g>; })}
        {ghost && <line x1={sx(xMin)} y1={sy(ghost[0] * xMin + ghost[1])} x2={sx(xMax)} y2={sy(ghost[0] * xMax + ghost[1])} stroke="#8b958f" strokeWidth="2" strokeDasharray="6 5" />}
        <line x1={sx(xMin)} y1={sy(w * xMin + b)} x2={sx(xMax)} y2={sy(w * xMax + b)} stroke="#1f7568" strokeWidth="2.8" />
        {xs.map((v, i) => <circle key={i} cx={sx(v)} cy={sy(ys[i])} r="5" fill="#e36c28" stroke="#fff" strokeWidth="1.5" />)}
        <text x={(L + W - R) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#16211c">{xLabel}</text>
        <text x={13} y={(T + H - B) / 2} textAnchor="middle" fontSize="12" fill="#16211c" transform={`rotate(-90 13 ${(T + H - B) / 2})`}>{yLabel}</text>
      </svg>
      <p className={styles.hint}>{summary}</p>
    </figure>
  );
}

/** Horizontal signed bars (e.g. residuals or feature contributions) with a text equivalent. */
export function SignedBars({ labels, values, title, unit }: { labels: string[]; values: unknown; title: string; unit: string }) {
  const data = nums(values);
  if (!data || data.length !== labels.length) return <p className={styles.hint}>Run the code to draw the chart.</p>;
  const W = 560, rowH = 30, T = 14, L = 120, R = 70, H = T * 2 + rowH * data.length;
  const maxAbs = Math.max(...data.map(Math.abs)) || 1;
  const mid = L + (W - L - R) / 2, half = (W - L - R) / 2;
  const summary = `${title}: ${labels.map((l, i) => `${l} ${data[i] >= 0 ? "+" : "−"}${fmt(Math.abs(data[i]))}`).join(", ")} ${unit}.`;
  return (
    <figure className={styles.chart}>
      <figcaption><strong>{title}</strong></figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
        <line x1={mid} x2={mid} y1={T - 4} y2={H - T + 4} stroke="#8b958f" />
        {data.map((v, i) => {
          const len = (Math.abs(v) / maxAbs) * half, yy = T + i * rowH;
          return <g key={i}>
            <text x={L - 10} y={yy + rowH / 2 + 4} textAnchor="end" fontSize="12" fill="#16211c">{labels[i]}</text>
            <rect x={v >= 0 ? mid : mid - len} y={yy + 5} width={Math.max(len, 1)} height={rowH - 10} rx="3" fill={v >= 0 ? "#1f7568" : "#e36c28"} />
            <text x={v >= 0 ? mid + len + 6 : mid - len - 6} y={yy + rowH / 2 + 4} textAnchor={v >= 0 ? "start" : "end"} fontSize="11.5" fontWeight="700" fill="#16211c">{v >= 0 ? "+" : "−"}{fmt(Math.abs(v))}</text>
          </g>;
        })}
      </svg>
      <p className={styles.hint}>{summary} Teal bars push up, orange bars push down.</p>
    </figure>
  );
}
