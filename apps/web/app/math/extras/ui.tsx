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
