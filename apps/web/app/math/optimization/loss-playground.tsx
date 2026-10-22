"use client";
import { useRef, useState } from "react";
import { AREAS, B_RANGE, PRICES, START, W_RANGE, bestLine, houseGradient, houseLoss } from "./house-loss";
import styles from "./loss-playground.module.css";

const COLS = 45, ROWS = 35;
const fmt = (v: number, d = 1) => new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(v);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// A cell grid of log-loss, computed once.
const CELLS = (() => {
  const out: { w: number; b: number; t: number }[] = [];
  let lo = Infinity, hi = -Infinity;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const w = W_RANGE[0] + ((c + 0.5) / COLS) * (W_RANGE[1] - W_RANGE[0]);
    const b = B_RANGE[1] - ((r + 0.5) / ROWS) * (B_RANGE[1] - B_RANGE[0]);
    const v = Math.log1p(houseLoss(w, b));
    lo = Math.min(lo, v); hi = Math.max(hi, v); out.push({ w, b, t: v });
  }
  return out.map((cell) => ({ ...cell, t: (cell.t - lo) / (hi - lo) }));
})();

const MAP = { W: 420, H: 330, L: 46, T: 12, R: 12, B: 40 };
const sx = (w: number) => MAP.L + ((w - W_RANGE[0]) / (W_RANGE[1] - W_RANGE[0])) * (MAP.W - MAP.L - MAP.R);
const sy = (b: number) => MAP.T + (1 - (b - B_RANGE[0]) / (B_RANGE[1] - B_RANGE[0])) * (MAP.H - MAP.T - MAP.B);

/** Teal (low loss) to deep blue (high loss). Colour is redundant with the numbers shown beside it. */
const shade = (t: number) => `rgb(${Math.round(232 - 200 * t)},${Math.round(244 - 170 * t)},${Math.round(238 - 120 * t)})`;

export function LossPlayground() {
  const [w, setW] = useState(START[0]), [b, setB] = useState(START[1]);
  const [lr, setLr] = useState(0.01);
  const [trail, setTrail] = useState<[number, number][]>([START]);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const loss = houseLoss(w, b), [dw, db] = houseGradient(w, b);
  const [bw, bb] = bestLine(), bestLoss = houseLoss(bw, bb);
  const move = (nw: number, nb: number, keepTrail = false) => {
    const cw = clamp(nw, W_RANGE[0], W_RANGE[1]), cb = clamp(nb, B_RANGE[0], B_RANGE[1]);
    setW(cw); setB(cb); setTrail((t) => (keepTrail ? [...t, [cw, cb]] : [[cw, cb]]));
  };
  const fromPointer = (event: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * MAP.W, py = ((event.clientY - rect.top) / rect.height) * MAP.H;
    const nw = W_RANGE[0] + ((px - MAP.L) / (MAP.W - MAP.L - MAP.R)) * (W_RANGE[1] - W_RANGE[0]);
    const nb = B_RANGE[1] - ((py - MAP.T) / (MAP.H - MAP.T - MAP.B)) * (B_RANGE[1] - B_RANGE[0]);
    move(Math.round(nw * 2) / 2, Math.round(nb));
  };
  const step = () => move(w - lr * dw, b - lr * db, true);

  // Arrow pointing downhill. Length is fixed so it shows direction; the numbers show size.
  const len = Math.hypot(sx(w - dw) - sx(w), sy(b - db) - sy(b)) || 1;
  const ax = sx(w) + ((sx(w - dw) - sx(w)) / len) * 34, ay = sy(b) + ((sy(b - db) - sy(b)) / len) * 34;

  // Scatter panel
  const P = { W: 300, H: 250, L: 44, T: 10, R: 10, B: 38 };
  const px = (x: number) => P.L + (x / 5.4) * (P.W - P.L - P.R), py = (y: number) => P.T + (1 - y / 420) * (P.H - P.T - P.B);

  const summary = `Line: price = ${fmt(w)} × area + ${fmt(b)}. Average squared miss (loss) ${fmt(loss)}. Slope of the loss in w ${fmt(dw)}, in b ${fmt(db)}. Best line: w = ${fmt(bw, 2)}, b = ${fmt(bb, 2)}, loss ${fmt(bestLoss, 1)}.`;

  return (
    <section className={styles.playground} aria-labelledby="loss-pg-title">
      <p className="eyebrow">Playground</p>
      <h3 id="loss-pg-title">Walk the loss landscape for six houses</h3>
      <p>Each point on the map is one possible line: a slope <code>w</code> (price per extra thousand ft²) and a baseline <code>b</code>. Its colour is the <strong>loss</strong>, the average squared miss across the six houses. Drag the orange dot, or use the sliders, and watch the line change on the right.</p>
      <div className={styles.grid}>
        <figure className={styles.map}>
          <svg ref={svgRef} viewBox={`0 0 ${MAP.W} ${MAP.H}`} role="img" aria-label={`Loss map over w and b. ${summary}`}
            onPointerDown={(e) => { dragging.current = true; (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId); fromPointer(e); }}
            onPointerMove={(e) => { if (dragging.current) fromPointer(e); }}
            onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}>
            {CELLS.map((c, i) => <rect key={i} x={sx(c.w) - (MAP.W - MAP.L - MAP.R) / COLS / 2} y={sy(c.b) - (MAP.H - MAP.T - MAP.B) / ROWS / 2} width={(MAP.W - MAP.L - MAP.R) / COLS + 0.6} height={(MAP.H - MAP.T - MAP.B) / ROWS + 0.6} fill={shade(c.t)} />)}
            {trail.length > 1 && <polyline points={trail.map(([tw, tb]) => `${sx(tw)},${sy(tb)}`).join(" ")} fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" />}
            <circle cx={sx(bw)} cy={sy(bb)} r="7" fill="none" stroke="#16211c" strokeWidth="2" /><text x={sx(bw) + 10} y={sy(bb) - 8} fontSize="11" fontWeight="700" fill="#16211c">best line</text>
            <line x1={sx(w)} y1={sy(b)} x2={ax} y2={ay} stroke="#16211c" strokeWidth="2.5" /><circle cx={ax} cy={ay} r="3.5" fill="#16211c" />
            <circle cx={sx(w)} cy={sy(b)} r="8" fill="#e36c28" stroke="#fff" strokeWidth="2.5" style={{ cursor: "grab" }} />
            {[0, 30, 60, 90].map((v) => <text key={`wx${v}`} x={sx(v)} y={MAP.H - MAP.B + 15} textAnchor="middle" fontSize="11" fill="#16211c">{v}</text>)}
            {[60, 100, 140, 180].map((v) => <text key={`by${v}`} x={MAP.L - 6} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#16211c">{v}</text>)}
            <text x={MAP.L + (MAP.W - MAP.L - MAP.R) / 2} y={MAP.H - 8} textAnchor="middle" fontSize="12" fill="#16211c">slope w (₹ lakh per thousand ft²)</text>
            <text x={12} y={MAP.T + (MAP.H - MAP.T - MAP.B) / 2} textAnchor="middle" fontSize="12" fill="#16211c" transform={`rotate(-90 12 ${MAP.T + (MAP.H - MAP.T - MAP.B) / 2})`}>baseline b</text>
          </svg>
          <figcaption>Light is a small loss, dark is a large one. The black arrow points <em>downhill</em>.</figcaption>
        </figure>

        <figure className={styles.fit}>
          <svg viewBox={`0 0 ${P.W} ${P.H}`} role="img" aria-label={`Six houses and your line. Each orange stick is a miss.`}>
            <rect x={P.L} y={P.T} width={P.W - P.L - P.R} height={P.H - P.T - P.B} fill="#fbfaf5" stroke="#d8d8ce" />
            {AREAS.map((x, i) => <line key={`r${i}`} x1={px(x)} x2={px(x)} y1={py(PRICES[i])} y2={py(w * x + b)} stroke="#e36c28" strokeWidth="2.2" />)}
            <line x1={px(0)} y1={py(b)} x2={px(5.4)} y2={py(w * 5.4 + b)} stroke="#1f7568" strokeWidth="2.8" />
            {AREAS.map((x, i) => <circle key={`d${i}`} cx={px(x)} cy={py(PRICES[i])} r="4.5" fill="#16211c" />)}
            {[1, 2, 3, 4, 5].map((v) => <text key={`px${v}`} x={px(v)} y={P.H - P.B + 14} textAnchor="middle" fontSize="10.5" fill="#16211c">{v}</text>)}
            {[100, 200, 300, 400].map((v) => <text key={`py${v}`} x={P.L - 5} y={py(v) + 4} textAnchor="end" fontSize="10.5" fill="#16211c">{v}</text>)}
            <text x={(P.L + P.W - P.R) / 2} y={P.H - 8} textAnchor="middle" fontSize="11.5" fill="#16211c">area (thousand ft²)</text>
            <text x={11} y={(P.T + P.H - P.B) / 2} textAnchor="middle" fontSize="11.5" fill="#16211c" transform={`rotate(-90 11 ${(P.T + P.H - P.B) / 2})`}>price (₹ lakh)</text>
          </svg>
          <figcaption>Orange sticks are the misses. The loss is their average <em>squared</em> length.</figcaption>
        </figure>
      </div>

      <div className={styles.controls}>
        <label>Slope w: <strong>{fmt(w)}</strong><input type="range" min={W_RANGE[0]} max={W_RANGE[1]} step={0.5} value={w} onChange={(e) => move(Number(e.target.value), b)} /></label>
        <label>Baseline b: <strong>{fmt(b)}</strong><input type="range" min={B_RANGE[0]} max={B_RANGE[1]} step={1} value={b} onChange={(e) => move(w, Number(e.target.value))} /></label>
      </div>

      <dl className={styles.readout} role="status" aria-live="polite" aria-atomic="true">
        <div><dt>Loss</dt><dd>{fmt(loss)}</dd></div>
        <div><dt>Slope of loss in w</dt><dd>{fmt(dw)}</dd></div>
        <div><dt>Slope of loss in b</dt><dd>{fmt(db)}</dd></div>
        <div><dt>Best possible loss</dt><dd>{fmt(bestLoss)}</dd></div>
      </dl>

      <div className={styles.actions}>
        <label>Step size <select value={lr} onChange={(e) => setLr(Number(e.target.value))}>{[0.001, 0.01, 0.05].map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
        <button type="button" className="button" onClick={step}>Step downhill</button>
        <button type="button" className="button secondary" onClick={() => move(bw, bb)}>Jump to the best line</button>
        <button type="button" className="button secondary" onClick={() => move(START[0], START[1])}>Back to the start</button>
      </div>
      <p className={styles.note}>{summary}</p>
    </section>
  );
}
