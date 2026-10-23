import styles from "./deep-read.module.css";

export type FigSeries = { name: string; style: "line" | "points" | "bars" | "step"; pts: [number, number][]; dash?: boolean };
export type FigGuide = { axis: "x" | "y"; at: number; label: string };
export type DeepFigureSpec = {
  title: string;
  /** A sentence a screen-reader user can rely on: what the picture shows and its main takeaway. */
  alt: string;
  xLabel: string;
  yLabel: string;
  series: FigSeries[];
  /** Category names for bar charts (x is the index 0..n-1). */
  cats?: string[];
  guides?: FigGuide[];
  xDomain?: [number, number];
  yDomain?: [number, number];
};

const W = 640, H = 360, M = { l: 62, r: 18, t: 16, b: 52 };
const COLORS = ["#0f5c46", "#a95312", "#2f5aa8", "#7a3e8e", "#5b6b66"];
const MARKS = ["circle", "square", "diamond", "triangle", "cross"] as const;

/** Round tick positions covering [lo, hi]. */
export function niceTicks(lo: number, hi: number, target = 5): number[] {
  if (!(hi > lo)) return [lo];
  const raw = (hi - lo) / target;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  const first = Math.ceil(lo / step - 1e-9) * step;
  const out: number[] = [];
  for (let v = first; v <= hi + step * 1e-9; v += step) out.push(Math.round(v / step) * step + 0);
  return out;
}
const fmt = (v: number) => (Math.abs(v) >= 1000 ? v.toLocaleString("en-IN") : String(Math.round(v * 1000) / 1000));

function Mark({ kind, x, y, color }: { kind: (typeof MARKS)[number]; x: number; y: number; color: string }) {
  const r = 4.5;
  switch (kind) {
    case "square": return <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill={color} fillOpacity={0.85} />;
    case "diamond": return <polygon points={`${x},${y - r - 1} ${x + r + 1},${y} ${x},${y + r + 1} ${x - r - 1},${y}`} fill={color} fillOpacity={0.85} />;
    case "triangle": return <polygon points={`${x},${y - r - 1} ${x + r + 1},${y + r} ${x - r - 1},${y + r}`} fill={color} fillOpacity={0.85} />;
    case "cross": return <path d={`M${x - r} ${y - r}L${x + r} ${y + r}M${x - r} ${y + r}L${x + r} ${y - r}`} stroke={color} strokeWidth={2} />;
    default: return <circle cx={x} cy={y} r={r} fill={color} fillOpacity={0.8} />;
  }
}

/** A small, accessible, dependency-free chart: lines, points, steps and grouped bars with a legend and a data table fallback. */
export function DeepFigure({ spec }: { spec: DeepFigureSpec }) {
  const bars = spec.series.some((s) => s.style === "bars");
  const all = spec.series.flatMap((s) => s.pts);
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const gx = (spec.guides ?? []).filter((g) => g.axis === "x").map((g) => g.at);
  const gy = (spec.guides ?? []).filter((g) => g.axis === "y").map((g) => g.at);
  let [x0, x1] = spec.xDomain ?? [Math.min(...xs, ...gx), Math.max(...xs, ...gx)];
  let [y0, y1] = spec.yDomain ?? [Math.min(...ys, ...gy, bars ? 0 : Infinity), Math.max(...ys, ...gy)];
  if (bars) { x0 = -0.6; x1 = (spec.cats?.length ?? Math.max(...xs) + 1) - 0.4; }
  if (x1 === x0) { x0 -= 1; x1 += 1; }
  if (y1 === y0) { y0 -= 1; y1 += 1; }
  if (!spec.yDomain) { const pad = (y1 - y0) * 0.06; y1 += pad; if (!bars || y0 < 0) y0 -= pad; }
  const xt = bars ? [] : niceTicks(x0, x1), yt = niceTicks(y0, y1);
  const sx = (v: number) => M.l + ((v - x0) / (x1 - x0)) * (W - M.l - M.r);
  const sy = (v: number) => H - M.b - ((v - y0) / (y1 - y0)) * (H - M.t - M.b);
  const barSeries = spec.series.filter((s) => s.style === "bars");
  const groupW = (sx(1) - sx(0)) * 0.72;
  return (
    <figure className={styles.fig}>
      <figcaption className={styles.figTitle}>{spec.title}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.alt} preserveAspectRatio="xMidYMid meet">
        <rect x={0} y={0} width={W} height={H} fill="#fbfaf4" rx={10} />
        {yt.map((t) => <g key={`y${t}`}><line x1={M.l} x2={W - M.r} y1={sy(t)} y2={sy(t)} stroke="#dfe3d8" /><text x={M.l - 8} y={sy(t) + 4} textAnchor="end" fontSize={12} fill="#44554f">{fmt(t)}</text></g>)}
        {xt.map((t) => <g key={`x${t}`}><line x1={sx(t)} x2={sx(t)} y1={H - M.b} y2={H - M.b + 5} stroke="#44554f" /><text x={sx(t)} y={H - M.b + 20} textAnchor="middle" fontSize={12} fill="#44554f">{fmt(t)}</text></g>)}
        {bars && (spec.cats ?? []).map((c, i) => <text key={c} x={sx(i)} y={H - M.b + 20} textAnchor="middle" fontSize={12} fill="#44554f">{c}</text>)}
        <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} stroke="#44554f" />
        <line x1={M.l} x2={M.l} y1={M.t} y2={H - M.b} stroke="#44554f" />
        {(spec.guides ?? []).map((g) => g.axis === "x"
          ? <g key={`gx${g.at}`}><line x1={sx(g.at)} x2={sx(g.at)} y1={M.t} y2={H - M.b} stroke="#8a3b0c" strokeDasharray="5 4" /><text x={sx(g.at) + 5} y={M.t + 12} fontSize={12} fill="#8a3b0c">{g.label}</text></g>
          : <g key={`gy${g.at}`}><line x1={M.l} x2={W - M.r} y1={sy(g.at)} y2={sy(g.at)} stroke="#8a3b0c" strokeDasharray="5 4" /><text x={W - M.r - 4} y={sy(g.at) - 5} textAnchor="end" fontSize={12} fill="#8a3b0c">{g.label}</text></g>)}
        {spec.series.map((s, si) => {
          const color = COLORS[si % COLORS.length];
          if (s.style === "bars") {
            const bi = barSeries.indexOf(s), w = groupW / barSeries.length;
            return <g key={s.name}>{s.pts.map(([x, y]) => { const left = sx(x) - groupW / 2 + bi * w; const top = Math.min(sy(y), sy(0)); return <rect key={x} x={left} y={top} width={w - 2} height={Math.abs(sy(y) - sy(0))} fill={color} fillOpacity={0.85 - bi * 0.1} />; })}</g>;
          }
          if (s.style === "points") return <g key={s.name}>{s.pts.map(([x, y], i) => <Mark key={i} kind={MARKS[si % MARKS.length]} x={sx(x)} y={sy(y)} color={color} />)}</g>;
          const d = s.style === "step"
            ? s.pts.map(([x, y], i) => (i === 0 ? `M${sx(x)} ${sy(y)}` : `H${sx(x)}V${sy(y)}`)).join("")
            : s.pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`).join("");
          return <path key={s.name} d={d} fill="none" stroke={color} strokeWidth={2.4} strokeDasharray={s.dash ? "7 5" : undefined} strokeLinejoin="round" />;
        })}
        <text x={(M.l + W - M.r) / 2} y={H - 8} textAnchor="middle" fontSize={13} fill="#1b302a">{spec.xLabel}</text>
        <text transform={`translate(16 ${(M.t + H - M.b) / 2}) rotate(-90)`} textAnchor="middle" fontSize={13} fill="#1b302a">{spec.yLabel}</text>
      </svg>
      {spec.series.length > 1 && (
        <ul className={styles.legend} aria-label="Legend">
          {spec.series.map((s, i) => <li key={s.name}><svg width="26" height="12" aria-hidden="true">{s.style === "points" ? <Mark kind={MARKS[i % MARKS.length]} x={13} y={6} color={COLORS[i % COLORS.length]} /> : <line x1="1" x2="25" y1="6" y2="6" stroke={COLORS[i % COLORS.length]} strokeWidth="3" strokeDasharray={s.dash ? "6 4" : undefined} />}</svg>{s.name}</li>)}
        </ul>
      )}
      <details className={styles.figData}>
        <summary>See the numbers behind this picture</summary>
        <table><caption>{spec.title}</caption><thead><tr><th scope="col">{spec.xLabel}</th>{spec.series.map((s) => <th key={s.name} scope="col">{s.name}</th>)}</tr></thead>
          <tbody>{[...new Set(all.map((p) => p[0]))].sort((a, b) => a - b).slice(0, 40).map((x) => <tr key={x}><th scope="row">{bars && spec.cats ? spec.cats[x] : fmt(x)}</th>{spec.series.map((s) => { const p = s.pts.find((q) => q[0] === x); return <td key={s.name}>{p ? fmt(p[1]) : "–"}</td>; })}</tr>)}</tbody></table>
      </details>
    </figure>
  );
}
