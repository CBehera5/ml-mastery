"use client";
import { useEffect, useState } from "react";
import { validateLearningEvidence } from "../../learn/foundation/evidence";
import { emptyEvidence, STORAGE_KEY } from "./geometry-model";

export function useGeometryEvidence() {
  const [evidence, setEvidence] = useState(emptyEvidence);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [writable, setWritable] = useState(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: unknown = JSON.parse(raw);
        if (validateLearningEvidence(stored) && stored.curriculumVersion === "linear-algebra.geometry.v1") setEvidence(stored);
        else { setWritable(false); setStorageError(true); }
      }
    } catch { setWritable(false); setStorageError(true); }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded && writable) try { localStorage.setItem(STORAGE_KEY, JSON.stringify(evidence)); }
    catch { setStorageError(true); }
  }, [evidence, loaded, writable]);
  return { evidence, setEvidence, loaded, storageError };
}
