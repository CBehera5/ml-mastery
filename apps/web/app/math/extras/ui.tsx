"use client";
import type { ReactNode } from "react";
import styles from "./extras.module.css";

export const fmt = (v: number, d = 2) => (Number.isFinite(v) ? new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(Math.abs(v) < 0.005 && v !== 0 ? 0 : v) : "undefined");
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function Field({ label, value, min, max, step, onChange, display }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display?: string }) {
  return <label className={styles.field}>{label}: <strong>{display ?? fmt(value)}</strong><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}
export function Readout({ items }: { items: [string, string][] }) {
  return <dl className={styles.readout} role="status" aria-live="polite" aria-atomic="true">{items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}
export function Playground({ id, title, intro, children, note, actions }: { id: string; title: string; intro: ReactNode; children: ReactNode; note?: ReactNode; actions?: ReactNode }) {
  return (
    <section className={styles.playground} aria-labelledby={`${id}-title`}>
      <p className="eyebrow">Playground</p>
      <h3 id={`${id}-title`}>{title}</h3>
      <p>{intro}</p>
      {children}
      {actions && <div className={styles.actions}>{actions}</div>}
      {note && <p className={styles.note}>{note}</p>}
    </section>
  );
}
export const Figure = ({ children, caption }: { children: ReactNode; caption: ReactNode }) => <figure className={styles.figure}>{children}<figcaption>{caption}</figcaption></figure>;
export const Grid = ({ children }: { children: ReactNode }) => <div className={styles.grid}>{children}</div>;
export const Controls = ({ children }: { children: ReactNode }) => <div className={styles.controls}>{children}</div>;
export const Btn = ({ children, onClick, primary }: { children: ReactNode; onClick: () => void; primary?: boolean }) => <button type="button" className={primary ? styles.primary : styles.secondary} onClick={onClick}>{children}</button>;

/** A labelled SVG chart frame. `children(sx, sy)` draws inside the plot area using data coordinates. */
export function Chart({ label, xDomain, yDomain, xTicks, yTicks, xLabel, yLabel, width = 460, height = 290, children }: {
  label: string; xDomain: [number, number]; yDomain: [number, number]; xTicks: number[]; yTicks: number[]; xLabel: string; yLabel: string; width?: number; height?: number;
  children: (sx: (x: number) => number, sy: (y: number) => number) => ReactNode;
}) {
  const L = 48, R = 12, T = 12, B = 40;
  const sx = (x: number) => L + ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * (width - L - R);
  const sy = (y: number) => T + (1 - (y - yDomain[0]) / (yDomain[1] - yDomain[0])) * (height - T - B);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <rect x={L} y={T} width={width - L - R} height={height - T - B} fill="#fbfaf5" stroke="#d8d8ce" />
      {yTicks.map((v) => <g key={`y${v}`}><line x1={L} x2={width - R} y1={sy(v)} y2={sy(v)} stroke="#e7e6dc" /><text x={L - 6} y={sy(v) + 4} textAnchor="end" fontSize="11" fill="#16211c">{fmt(v, 2)}</text></g>)}
      {xTicks.map((v) => <text key={`x${v}`} x={sx(v)} y={height - B + 15} textAnchor="middle" fontSize="11" fill="#16211c">{fmt(v, 2)}</text>)}
      {yDomain[0] < 0 && yDomain[1] > 0 && <line x1={L} x2={width - R} y1={sy(0)} y2={sy(0)} stroke="#8b958f" />}
      {xDomain[0] < 0 && xDomain[1] > 0 && <line x1={sx(0)} x2={sx(0)} y1={T} y2={height - B} stroke="#8b958f" />}
      {children(sx, sy)}
      <text x={(L + width - R) / 2} y={height - 6} textAnchor="middle" fontSize="12" fill="#16211c">{xLabel}</text>
      <text x={12} y={(T + height - B) / 2} textAnchor="middle" fontSize="12" fill="#16211c" transform={`rotate(-90 12 ${(T + height - B) / 2})`}>{yLabel}</text>
    </svg>
  );
}
export const curvePoints = (f: (x: number) => number, x0: number, x1: number, sx: (x: number) => number, sy: (y: number) => number, n = 120) =>
  Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (i / n) * (x1 - x0); return `${sx(x)},${sy(f(x))}`; }).join(" ");
