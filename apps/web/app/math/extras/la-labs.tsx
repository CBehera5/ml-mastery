"use client";
import { useRef, useState, type ReactNode } from "react";
import { Btn, Chart, Controls, Field, Figure, Grid, Playground, Readout, clamp, fmt, pointerToData } from "./ui";
import { A_MAT, B_FULL, HOUSES, add, angleDeg, apply, combo, cellTerms, cross, det, dot, eigenvalues, inverse, matMul, matVec, mul2, norm, project, scale, solveCombo, type M2, type V2 } from "./la-math";

export type Done = { onDone?: () => void };
const vt = (v: number[]) => `[${v.map((x) => fmt(x, 2)).join(", ")}]`;
const snap = (v: number) => Math.round(v * 2) / 2;
type Arrow = { v: V2; color: string; name: string; set?: (v: V2) => void; from?: V2; dashed?: boolean };

/** A coordinate plane with arrows. Arrows that carry `set` have a handle you can drag (or move with the sliders beside it). */
function Plane({ id, label, arrows, lim = 6, extra, width = 380, height = 380 }: { id: string; label: string; arrows: Arrow[]; lim?: number; extra?: (sx: (x: number) => number, sy: (y: number) => number) => ReactNode; width?: number; height?: number }) {
  const drag = useRef<number | null>(null);
  const dom: [number, number] = [-lim, lim], ticks = [-lim, -lim / 2, 0, lim / 2, lim];
  const move = (e: React.PointerEvent<SVGGElement>) => {
    if (drag.current === null) return; const a = arrows[drag.current]; if (!a?.set) return;
    const [x, y] = pointerToData(e, dom, dom, width, height); a.set([clamp(snap(x - (a.from?.[0] ?? 0)), -lim, lim), clamp(snap(y - (a.from?.[1] ?? 0)), -lim, lim)]);
  };
  return (
    <Chart label={label} xDomain={dom} yDomain={dom} xTicks={ticks} yTicks={ticks} xLabel="x" yLabel="y" width={width} height={height}>
      {(sx, sy) => <g onPointerMove={move} onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)} style={{ touchAction: "none" }}>
        <defs>{arrows.map((a, i) => <marker key={i} id={`${id}-h${i}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={a.color} /></marker>)}</defs>
        <rect x={sx(-lim)} y={sy(lim)} width={sx(lim) - sx(-lim)} height={sy(-lim) - sy(lim)} fill="transparent" />
        {extra?.(sx, sy)}
        {arrows.map((a, i) => { const f = a.from ?? [0, 0], t: V2 = [f[0] + a.v[0], f[1] + a.v[1]]; return <g key={i}>
          <line x1={sx(f[0])} y1={sy(f[1])} x2={sx(t[0])} y2={sy(t[1])} stroke={a.color} strokeWidth="2.6" strokeDasharray={a.dashed ? "5 4" : undefined} markerEnd={`url(#${id}-h${i})`} />
          <text x={sx(t[0]) + 8} y={sy(t[1]) - 8} fontSize="13" fontWeight="700" fill={a.color}>{a.name}</text>
        </g>; })}
        {arrows.map((a, i) => { if (!a.set) return null; const f = a.from ?? [0, 0]; return <circle key={`h${i}`} cx={sx(f[0] + a.v[0])} cy={sy(f[1] + a.v[1])} r="11" fill={a.color} fillOpacity="0.18" stroke={a.color} strokeWidth="1.5" style={{ cursor: "grab" }} onPointerDown={(e) => { drag.current = i; (e.target as Element).setPointerCapture?.(e.pointerId); }} />; })}
      </g>}
    </Chart>
  );
}
const comp = (name: string, v: V2, set: (v: V2) => void, lim = 6) => <>
  <Field label={`${name} x`} min={-lim} max={lim} step={0.5} value={v[0]} onChange={(x) => set([x, v[1]])} />
  <Field label={`${name} y`} min={-lim} max={lim} step={0.5} value={v[1]} onChange={(y) => set([v[0], y])} />
</>;

/* ── 1 · Vectors: an arrow is a list of numbers ── */
export function VectorsPlayground({ onDone }: Done) {
  const [u, setU] = useState<V2>([3, 4]), [v, setV] = useState<V2>([1, -2]), [c, setC] = useState(1);
  const s = add(u, v), m = norm(u), set = (f: (x: V2) => void) => (x: V2) => { f(x); onDone?.(); };
  const unit: V2 = m === 0 ? [0, 0] : [u[0] / m, u[1] / m];
  return (
    <Playground id="la-vec" title="Drag the arrows" intro={<>A vector is just an ordered list of numbers, drawn as an arrow. Drag the tip of <strong>u</strong> or <strong>v</strong>, or use the sliders. The sum <strong>u + v</strong> is what you get by walking along u, then along v.</>}
      actions={<><Btn onClick={() => { setU([3, 4]); setV([1, -2]); setC(1); }}>Reset</Btn></>}
      note="Length comes from Pythagoras. The vector (3, 4) is a 3-4-5 right triangle, so its length is 5. Dividing by the length leaves a unit vector: same direction, length 1.">
      <Grid>
        <Figure caption="u in orange, v in teal, their sum dashed. Dotted lines show the walk: u, then v.">
          <Plane id="vec" label={`Vector u = ${vt(u)}, v = ${vt(v)}, sum ${vt(s)}`} arrows={[{ v: u, color: "#e36c28", name: "u", set: set(setU) }, { v, color: "#1f7568", name: "v", set: set(setV) }, { v: s, color: "#16211c", name: "u+v", dashed: true }, ...(c === 1 ? [] : [{ v: scale(c, u), color: "#7b4fa3", name: "c·u" }])]} extra={(sx, sy) => <><line x1={sx(u[0])} y1={sy(u[1])} x2={sx(s[0])} y2={sy(s[1])} stroke="#1f7568" strokeDasharray="2 4" /><line x1={sx(v[0])} y1={sy(v[1])} x2={sx(s[0])} y2={sy(s[1])} stroke="#e36c28" strokeDasharray="2 4" /></>} />
        </Figure>
        <Controls>{comp("u", u, set(setU))}{comp("v", v, set(setV))}<Field label="Scale c" min={-2} max={3} step={0.5} value={c} onChange={setC} /></Controls>
      </Grid>
      <Readout items={[["u + v", vt(s)], ["c·u", vt(scale(c, u))], ["Length of u", fmt(m, 3)], ["Unit direction of u", vt(unit)]]} />
    </Playground>
  );
}

/* ── 2 · Dot product: how much two arrows agree ── */
export function DotPlayground({ onDone }: Done) {
  const [u, setU] = useState<V2>([3, 4]), [v, setV] = useState<V2>([4, 0]);
  const d = dot(u, v), a = angleDeg(u, v), p = project(u, v), set = (x: V2) => { setV(x); onDone?.(); };
  const verdict = Number.isNaN(a) ? "One arrow has no direction (zero length)." : Math.abs(d) < 1e-9 ? "Perpendicular: they share nothing, so the dot product is 0." : d > 0 ? "They point roughly the same way: the dot product is positive." : "They point against each other: the dot product is negative.";
  return (
    <Playground id="la-dot" title="How much do two arrows agree?" intro={<>The dot product multiplies matching components and adds them: <code>u·v = u₁v₁ + u₂v₂</code>. Geometrically it is <code>|u||v|cos θ</code>. Drag v around u and watch the number change sign.</>}
      actions={<><Btn onClick={() => setV([4, 0])}>Along x</Btn><Btn onClick={() => setV([-4, 3])}>Perpendicular to u</Btn><Btn onClick={() => setV([-3, -4])}>Opposite</Btn></>}
      note="The shadow of u on v (dashed) is the projection. In machine learning, a prediction w·x is exactly this kind of agreement between a weight vector and a data vector.">
      <Grid>
        <Figure caption={verdict}>
          <Plane id="dot" label={`u = ${vt(u)}, v = ${vt(v)}; dot product ${fmt(d, 2)}`} arrows={[{ v: u, color: "#e36c28", name: "u" }, { v, color: "#1f7568", name: "v", set }, { v: p, color: "#7b4fa3", name: "shadow", dashed: true }]} extra={(sx, sy) => <line x1={sx(u[0])} y1={sy(u[1])} x2={sx(p[0])} y2={sy(p[1])} stroke="#8b958f" strokeDasharray="2 4" />} />
        </Figure>
        <Controls>{comp("v", v, set)}</Controls>
      </Grid>
      <Readout items={[["u · v", fmt(d, 3)], ["Angle between", Number.isNaN(a) ? "undefined" : `${fmt(a, 1)}°`], ["Projection of u on v", vt(p)]]} />
    </Playground>
  );
}

/* ── 3 · Matrix × vector: one weight vector scores a whole table ── */
export function MatVecPlayground({ onDone }: Done) {
  const [w, setW] = useState<[number, number]>([100, 20]), [row, setRow] = useState(0);
  const out = matVec(HOUSES, w), r = HOUSES[row];
  const set = (x: [number, number]) => { setW(x); onDone?.(); };
  return (
    <Playground id="la-mv" title="Score every house with one weight vector" intro={<>Each row is one house: area (hundreds of sq ft) and bedrooms. The weights say how many ₹ lakh each unit adds to the price. A matrix times a vector is the dot product of <em>every row</em> with the weights, all at once.</>}
      actions={<>{HOUSES.map((_, i) => <Btn key={i} onClick={() => setRow(i)}>Show house {i + 1}</Btn>)}</>}
      note={<>House {row + 1}: {fmt(r[0], 1)} × {fmt(w[0], 0)} + {r[1]} × {fmt(w[1], 0)} = {fmt(out[row], 1)}. Three rows, one rule: that is why a 3×2 table times a 2-long vector gives 3 predictions.</>}>
      <Grid>
        <Figure caption="Rows × weights = predictions (₹ lakh).">
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14 }}><thead><tr>{["House", "Area", "Bedrooms", "Prediction"].map((t) => <th key={t} style={{ textAlign: "left", padding: "4px 10px" }}>{t}</th>)}</tr></thead><tbody>{HOUSES.map((h, i) => <tr key={i} style={{ background: i === row ? "#fde8d9" : undefined }}>{[i + 1, h[0], h[1]].map((t, k) => <td key={k} style={{ padding: "4px 10px" }}>{t}</td>)}<td style={{ padding: "4px 10px" }}><strong>{fmt(out[i], 1)}</strong></td></tr>)}</tbody></table>
        </Figure>
        <Controls><Field label="Weight: per area unit" min={0} max={200} step={10} value={w[0]} onChange={(x) => set([x, w[1]])} display={fmt(w[0], 0)} /><Field label="Weight: per bedroom" min={0} max={60} step={5} value={w[1]} onChange={(x) => set([w[0], x])} display={fmt(w[1], 0)} /></Controls>
      </Grid>
      <Readout items={[["Table shape", "3 × 2"], ["Weights shape", "2 × 1"], ["Result shape", "3 × 1"], ["Predictions", vt(out)]]} />
    </Playground>
  );
}

/* ── 4 · Matrix × matrix: each entry is a row meeting a column ── */
export function MatMulPlayground({ onDone }: Done) {
  const [pick, setPick] = useState<[number, number]>([0, 0]), [fit, setFit] = useState(true);
  const B = fit ? B_FULL : B_FULL.slice(0, 2), ok = A_MAT[0].length === B.length, C = ok ? matMul(A_MAT, B) : null;
  const terms = ok ? cellTerms(A_MAT, B, pick[0], pick[1]) : [];
  const choose = (i: number, j: number) => { setPick([i, j]); onDone?.(); };
  const cell = (v: number, hi: boolean) => ({ padding: "4px 10px", textAlign: "center" as const, background: hi ? "#fde8d9" : "#fbfaf5", border: "1px solid #d8d8ce" });
  return (
    <Playground id="la-mm" title="Click an entry of the answer" intro={<>Entry <code>(i, j)</code> of <code>A·B</code> is row <code>i</code> of A dotted with column <code>j</code> of B. They can only meet if A has as many columns as B has rows.</>}
      actions={<><Btn onClick={() => setFit(true)}>B is 3 × 2 (fits)</Btn><Btn onClick={() => setFit(false)}>B is 2 × 2 (does not fit)</Btn></>}
      note={ok ? <>Entry ({pick[0] + 1}, {pick[1] + 1}) = {terms.map(([a, b]) => `${a}×${b}`).join(" + ")} = {fmt(C![pick[0]][pick[1]], 0)}.</> : "A is 2 × 3 but B has only 2 rows. Row length 3 cannot pair with column length 2, so the product is undefined, not zero."}>
      <Grid>
        <Figure caption="A (2×3) times B, giving C. Click an entry of C to see the row and column that made it.">
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
            <table><tbody>{A_MAT.map((r, i) => <tr key={i}>{r.map((v, k) => <td key={k} style={cell(v, ok && i === pick[0])}>{v}</td>)}</tr>)}</tbody></table><span>×</span>
            <table><tbody>{B.map((r, k) => <tr key={k}>{r.map((v, j) => <td key={j} style={cell(v, ok && j === pick[1])}>{v}</td>)}</tr>)}</tbody></table><span>=</span>
            {C ? <table><tbody>{C.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}><button type="button" onClick={() => choose(i, j)} aria-label={`Entry ${i + 1}, ${j + 1}: ${v}`} aria-pressed={i === pick[0] && j === pick[1]} style={{ ...cell(v, i === pick[0] && j === pick[1]), cursor: "pointer", font: "inherit" }}>{v}</button></td>)}</tr>)}</tbody></table> : <strong>undefined</strong>}
          </div>
        </Figure>
      </Grid>
      <Readout items={[["A", "2 × 3"], ["B", fit ? "3 × 2" : "2 × 2"], ["Product", ok ? "2 × 2" : "undefined"]]} />
    </Playground>
  );
}

/* ── 5 · Transformations: what a matrix does to the plane ── */
const PRESETS: [string, M2][] = [["Identity", [[1, 0], [0, 1]]], ["Rotate 90°", [[0, -1], [1, 0]]], ["Stretch x by 2", [[2, 0], [0, 1]]], ["Shear", [[1, 1], [0, 1]]], ["Flatten", [[1, 1], [1, 1]]]];
export function TransformPlayground({ onDone }: Done) {
  const [M, setM] = useState<M2>([[1, 1], [0, 1]]);
  const set = (m: M2) => { setM(m); onDone?.(); };
  const d = det(M), sq: V2[] = [[0, 0], [1, 0], [1, 1], [0, 1]], img = sq.map((p) => apply(M, p));
  const upd = (i: number, j: number) => (x: number) => set(M.map((r, a) => r.map((v, b) => (a === i && b === j ? x : v))) as M2);
  return (
    <Playground id="la-tr" title="See what a matrix does to the plane" intro={<>A 2×2 matrix is a machine that moves every point. Its columns say where the two basis arrows land: column 1 is where <code>(1, 0)</code> goes, column 2 where <code>(0, 1)</code> goes. The unit square follows them.</>}
      actions={<>{PRESETS.map(([n, m]) => <Btn key={n} onClick={() => set(m)}>{n}</Btn>)}</>}
      note="The determinant is the area scale factor: the unit square has area 1, so its image has area |det|. A determinant of 0 means the plane collapses onto a line, and information is lost.">
      <Grid>
        <Figure caption="Grey: the original unit square. Orange: where the matrix sends it.">
          <Plane id="tr" lim={4} label={`Matrix [[${M[0]}],[${M[1]}]] sends the unit square to a shape of area ${fmt(Math.abs(d), 2)}`} arrows={[{ v: apply(M, [1, 0]), color: "#e36c28", name: "e₁" }, { v: apply(M, [0, 1]), color: "#1f7568", name: "e₂" }]} extra={(sx, sy) => <><polygon points={sq.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ")} fill="#c9cfc7" fillOpacity="0.5" /><polygon points={img.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ")} fill="#e36c28" fillOpacity="0.22" stroke="#e36c28" /></>} />
        </Figure>
        <Controls>
          <Field label="a (row 1, col 1)" min={-3} max={3} step={0.5} value={M[0][0]} onChange={upd(0, 0)} /><Field label="b (row 1, col 2)" min={-3} max={3} step={0.5} value={M[0][1]} onChange={upd(0, 1)} />
          <Field label="c (row 2, col 1)" min={-3} max={3} step={0.5} value={M[1][0]} onChange={upd(1, 0)} /><Field label="d (row 2, col 2)" min={-3} max={3} step={0.5} value={M[1][1]} onChange={upd(1, 1)} />
        </Controls>
      </Grid>
      <Readout items={[["Determinant", fmt(d, 2)], ["Area of the image", fmt(Math.abs(d), 2)], ["(1, 0) lands at", vt(apply(M, [1, 0]))], ["(0, 1) lands at", vt(apply(M, [0, 1]))]]} />
    </Playground>
  );
}

/* ── 6 · Span: what can you reach by mixing two arrows? ── */
export function SpanPlayground({ onDone }: Done) {
  const [a, setA] = useState(1), [b, setB] = useState(1), [parallel, setPar] = useState(false);
  const v1: V2 = [1, 1], v2: V2 = parallel ? [2, 2] : [1, -1], T: V2 = [3, 1], p = combo(a, b, v1, v2), sol = solveCombo(v1, v2, T);
  const upd = (f: (n: number) => void) => (n: number) => { f(n); onDone?.(); };
  const hit = Math.abs(p[0] - T[0]) < 1e-9 && Math.abs(p[1] - T[1]) < 1e-9;
  return (
    <Playground id="la-span" title="What can you reach by mixing two arrows?" intro={<>Choose how much of <code>v₁ = (1, 1)</code> and <code>v₂</code> to mix: <code>a·v₁ + b·v₂</code>. The set of everything you can reach is their span. Try to land on the target <code>(3, 1)</code>.</>}
      actions={<><Btn onClick={() => setPar(false)}>v₂ = (1, −1)</Btn><Btn onClick={() => { setPar(true); onDone?.(); }}>v₂ = (2, 2), along v₁</Btn></>}
      note={parallel ? "v₂ lies along v₁, so mixing them only ever slides you along one line. They are linearly dependent: v₂ adds no new direction, and the target is out of reach." : "v₁ and v₂ point in different directions, so every point in the plane is reachable. The target needs a = 2 and b = 1."}>
      <Grid>
        <Figure caption={hit ? "You landed on the target." : parallel ? "Everything you can reach lies on one line." : "Your mix is the black dot. The target is the star."}>
          <Plane id="span" label={`Mix ${a} of v1 and ${b} of v2 gives ${vt(p)}; target ${vt(T)}`} arrows={[{ v: v1, color: "#e36c28", name: "v₁" }, { v: v2, color: "#1f7568", name: "v₂" }]} extra={(sx, sy) => <><line x1={sx(-6)} y1={sy(-6)} x2={sx(6)} y2={sy(6)} stroke="#c9cfc7" strokeWidth="6" strokeOpacity={parallel ? 0.7 : 0} /><text x={sx(T[0])} y={sy(T[1]) + 5} textAnchor="middle" fontSize="18" fill="#7b4fa3">★</text><circle cx={sx(p[0])} cy={sy(p[1])} r="6" fill="#16211c" /></>} />
        </Figure>
        <Controls><Field label="Amount of v₁ (a)" min={-3} max={3} step={0.5} value={a} onChange={upd(setA)} /><Field label="Amount of v₂ (b)" min={-3} max={3} step={0.5} value={b} onChange={upd(setB)} /></Controls>
      </Grid>
      <Readout items={[["Your point", vt(p)], ["Target", vt(T)], ["Mix needed", sol ? `a = ${fmt(sol[0], 2)}, b = ${fmt(sol[1], 2)}` : "no mix reaches it"]]} />
    </Playground>
  );
}

/* ── 7 · Inverse: undoing a transformation ── */
export function InversePlayground({ onDone }: Done) {
  const [M, setM] = useState<M2>([[2, 1], [1, 1]]), [t, setT] = useState<V2>([1, 2]);
  const inv = inverse(M), d = det(M), moved = apply(M, t), back = inv ? apply(inv, moved) : null;
  const upd = (i: number, j: number) => (x: number) => { setM(M.map((r, a) => r.map((v, b) => (a === i && b === j ? x : v))) as M2); onDone?.(); };
  return (
    <Playground id="la-inv" title="Undo the move" intro={<>Send the point <code>t</code> through the matrix, then try to send it back with the inverse. The inverse exists only when the matrix does not flatten the plane, that is, when the determinant is not 0.</>}
      actions={<><Btn onClick={() => { setM([[2, 1], [1, 1]]); onDone?.(); }}>Invertible example</Btn><Btn onClick={() => { setM([[1, 2], [2, 4]]); onDone?.(); }}>Flattening example</Btn></>}
      note={inv ? "Because the determinant is not 0, nothing was lost: the inverse sends every image back to exactly one original point." : "The determinant is 0, so the whole plane lands on one line. Many different points share each image, and no function can tell which one you started from. There is no inverse."}>
      <Grid>
        <Figure caption={inv ? "Teal: the starting point t. Orange: where M sends it. Dashed: the inverse brings it back." : "Teal: the starting point. Orange: its image. Every point on a line like this one maps to the same place."}>
          <Plane id="inv" lim={6} label={`Matrix with determinant ${fmt(d, 2)}; point ${vt(t)} maps to ${vt(moved)}`} arrows={[{ v: t, color: "#1f7568", name: "t", set: (x) => { setT(x); onDone?.(); } }, { v: moved, color: "#e36c28", name: "M·t" }]} extra={(sx, sy) => (back ? <circle cx={sx(back[0])} cy={sy(back[1])} r="8" fill="none" stroke="#16211c" strokeDasharray="3 3" /> : null)} />
        </Figure>
        <Controls>
          <Field label="a" min={-3} max={3} step={0.5} value={M[0][0]} onChange={upd(0, 0)} /><Field label="b" min={-3} max={3} step={0.5} value={M[0][1]} onChange={upd(0, 1)} />
          <Field label="c" min={-3} max={3} step={0.5} value={M[1][0]} onChange={upd(1, 0)} /><Field label="d" min={-3} max={3} step={0.5} value={M[1][1]} onChange={upd(1, 1)} />
        </Controls>
      </Grid>
      <Readout items={[["Determinant", fmt(d, 2)], ["Inverse", inv ? `[${vt(inv[0])}, ${vt(inv[1])}]` : "does not exist"], ["M⁻¹·(M·t)", back ? vt(back) : "cannot recover t"], ["M⁻¹M", inv ? `[${vt(mul2(inv, M)[0])}, ${vt(mul2(inv, M)[1])}]` : "—"]]} />
    </Playground>
  );
}

/* ── 8 · Eigenvectors: directions that survive ── */
const EIG: [string, M2][] = [["Symmetric stretch", [[2, 1], [1, 2]]], ["Axis stretch", [[3, 0], [0, 1]]], ["Shear", [[1, 1], [0, 1]]], ["Rotation", [[0, -1], [1, 0]]]];
export function EigenPlayground({ onDone }: Done) {
  const [M, setM] = useState<M2>([[2, 1], [1, 2]]), [deg, setDeg] = useState(20);
  const x: V2 = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)], Mx = apply(M, x), ev = eigenvalues(M);
  const aligned = Math.abs(cross(x, Mx)) < 1e-9 && norm(Mx) > 1e-9, lam = aligned ? dot(x, Mx) : null;
  const turn = (angleDeg(x, Mx) || 0);
  const move = (v: number) => { setDeg(v); const q: V2 = [Math.cos((v * Math.PI) / 180), Math.sin((v * Math.PI) / 180)], m = apply(M, q); if (Math.abs(cross(q, m)) < 1e-9 && norm(m) > 1e-9) onDone?.(); };
  return (
    <Playground id="la-eig" title="Find the directions a matrix cannot turn" intro={<>Most arrows get turned as well as stretched. Turn the dial and watch <strong>x</strong> (teal, length 1) and <strong>M·x</strong> (orange). An <em>eigenvector</em> is a direction where the two line up: the matrix only stretches it, by a factor called the eigenvalue.</>}
      actions={<>{EIG.map(([n, m]) => <Btn key={n} onClick={() => setM(m)}>{n}</Btn>)}</>}
      note={ev ? `For this matrix the stretch factors are ${fmt(ev[0], 2)} and ${fmt(ev[1], 2)}. Find the angles where the arrows line up.` : "A rotation turns every direction, so there is no real eigenvector: the arrows never line up."}>
      <Grid>
        <Figure caption={aligned ? `Aligned. M·x is x stretched by ${fmt(lam!, 2)}.` : `The matrix turns x by ${fmt(turn, 1)}°.`}>
          <Plane id="eig" lim={4} label={`x at ${deg} degrees and M times x; turned by ${fmt(turn, 1)} degrees`} arrows={[{ v: x, color: "#1f7568", name: "x" }, { v: Mx, color: "#e36c28", name: "M·x" }]} extra={(sx, sy) => <circle cx={sx(0)} cy={sy(0)} r={sx(1) - sx(0)} fill="none" stroke="#c9cfc7" strokeDasharray="3 3" />} />
        </Figure>
        <Controls><Field label="Direction of x" min={0} max={180} step={5} value={deg} onChange={move} display={`${deg}°`} /></Controls>
      </Grid>
      <Readout items={[["M·x", vt(Mx)], ["Turned by", `${fmt(turn, 1)}°`], ["Aligned?", aligned ? `yes, eigenvalue ${fmt(lam!, 2)}` : "no"], ["Eigenvalues", ev ? `${fmt(ev[0], 2)}, ${fmt(ev[1], 2)}` : "none (complex)"]]} />
    </Playground>
  );
}
