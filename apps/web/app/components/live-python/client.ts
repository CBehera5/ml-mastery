import type { RunRequest, RunResult } from "./engine";

type WorkerOut =
  | { type: "ready" }
  | { type: "result"; id: number; result: RunResult }
  | { type: "fatal"; id?: number; message: string };

export type PythonRuntime = {
  run(request: RunRequest): Promise<RunResult>;
};

export const RUN_TIMEOUT_MS = 8_000;
export const BOOT_TIMEOUT_MS = 90_000;

export class PythonUnavailableError extends Error {}

/**
 * Talks to the Pyodide web worker. Restarts the worker after a timeout so an
 * accidental infinite loop never leaves the lesson unusable.
 */
export class WorkerPythonRuntime implements PythonRuntime {
  private worker: Worker | null = null;
  private booted = false;
  private nextId = 1;

  private start(): Worker {
    if (typeof Worker === "undefined") throw new PythonUnavailableError("This browser cannot run Python in a web worker.");
    this.worker = new Worker("/pyodide/lesson-worker.mjs", { type: "module" });
    this.booted = false;
    return this.worker;
  }

  private stop() {
    this.worker?.terminate();
    this.worker = null;
    this.booted = false;
  }

  run(request: RunRequest): Promise<RunResult> {
    const worker = this.worker ?? this.start();
    const id = this.nextId++;
    return new Promise<RunResult>((resolve, reject) => {
      const limit = this.booted ? RUN_TIMEOUT_MS : BOOT_TIMEOUT_MS;
      const timer = setTimeout(() => {
        cleanup();
        const wasBooted = this.booted;
        this.stop();
        reject(new PythonUnavailableError(wasBooted
          ? `Your code ran for more than ${RUN_TIMEOUT_MS / 1000} seconds, so Python was stopped. Look for a loop that never ends, then run again.`
          : "Python took too long to start. Check your connection and try again."));
      }, limit);
      const onMessage = (event: MessageEvent<WorkerOut>) => {
        const message = event.data;
        if (message.type === "ready") { this.booted = true; return; }
        if (message.type === "fatal" && (message.id === undefined || message.id === id)) {
          cleanup(); this.stop();
          reject(new PythonUnavailableError(`Python could not start: ${message.message}`));
        } else if (message.type === "result" && message.id === id) {
          cleanup(); resolve(message.result);
        }
      };
      const onError = () => { cleanup(); this.stop(); reject(new PythonUnavailableError("Python could not start in this browser.")); };
      const cleanup = () => { clearTimeout(timer); worker.removeEventListener("message", onMessage); worker.removeEventListener("error", onError); };
      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", onError);
      worker.postMessage({ id, request });
    });
  }
}

let shared: PythonRuntime | null = null;
export function sharedPythonRuntime(): PythonRuntime {
  return (shared ??= new WorkerPythonRuntime());
}
