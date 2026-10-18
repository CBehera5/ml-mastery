"use client";

import { useEffect, useState } from "react";

export const lessonProgressKey = (lessonId: string) => `ml-math-lab:lesson:${lessonId}:v1`;

export function useLessonProgress(lessonId: string, outcomes = 5) {
  const [progress, setProgress] = useState(() => Array<boolean>(outcomes).fill(false));
  const [loadedKey, setLoadedKey] = useState<string|null>(null);
  const [writableKey, setWritableKey] = useState<string|null>(null);
  const [storageError, setStorageError] = useState(false);
  const key = lessonProgressKey(lessonId);
  const loaded = loadedKey === key;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      setProgress(Array<boolean>(outcomes).fill(false));
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === outcomes && parsed.every((v) => typeof v === "boolean")) {
          setProgress(parsed);
        } else throw new Error("Unsupported lesson progress");
      }
      setWritableKey(key);
      setStorageError(false);
    } catch { setWritableKey(null); setStorageError(true); }
    setLoadedKey(key);
  }, [key, outcomes]);

  useEffect(() => {
    if (!loaded || writableKey !== key) return;
    try { window.localStorage.setItem(key, JSON.stringify(progress)); }
    catch { setWritableKey(null); setStorageError(true); }
  }, [key, loaded, writableKey, progress]);

  const resetLessonProgress = () => {
    setProgress(Array<boolean>(outcomes).fill(false));
    try { window.localStorage.removeItem(key); setWritableKey(key); setStorageError(false); }
    catch { setWritableKey(null); setStorageError(true); }
  };

  return { progress, setProgress, resetLessonProgress, loaded, storageError };
}
