"use client";
import { useEffect, useState } from "react";
import { emptyEvidence, loadEvidence, STORAGE_KEY } from "./model";
export function useProbabilityEvidence() {
  const [evidence, setEvidence] = useState(emptyEvidence);
  const [loaded, setLoaded] = useState(false);
  const [writable, setWritable] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    try { setEvidence(loadEvidence(localStorage.getItem(STORAGE_KEY))); }
    catch { setWritable(false); setError("Probability storage is unavailable, damaged or from another version. Existing data is preserved; saving is disabled. Practice is still available for this visit."); }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded && writable) try { localStorage.setItem(STORAGE_KEY, JSON.stringify(evidence)); }
    catch { setWritable(false); setError("Probability progress could not be saved. Your earlier stored data is preserved; current changes are in memory only."); }
  }, [evidence, loaded, writable]);
  return { evidence, setEvidence, loaded, error };
}
