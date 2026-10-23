# Driver for the in-browser Python cells. Loaded by lesson-worker.mjs (browser) and
# by engine.test.ts (Node) so both run exactly the same code.
import json, sys, io, traceback, contextlib, warnings

def __lesson_run(code, expose, checks):
    out = {"stdout": "", "error": None, "values": {}, "checks": None}
    # Pyodide's threadpoolctl shim emits a harmless deprecation warning when scikit-learn is imported.
    warnings.filterwarnings("ignore", message=r".*as_object_map.*")
    ns = {"__name__": "__main__"}
    buf = io.StringIO()

    def friendly(exc, filename):
        line = None
        if isinstance(exc, SyntaxError) and exc.filename == filename:
            line = exc.lineno
        else:
            for frame in traceback.extract_tb(exc.__traceback__):
                if frame.filename == filename:
                    line = frame.lineno
        text = type(exc).__name__ + ": " + (exc.msg if isinstance(exc, SyntaxError) else str(exc))
        return text + (" (line " + str(line) + ")" if line else "")

    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        try:
            exec(compile(code, "<your code>", "exec"), ns)
        except BaseException as exc:
            out["error"] = friendly(exc, "<your code>")
    out["stdout"] = buf.getvalue()

    if out["error"] is None:
        for name in expose:
            if name in ns:
                try:
                    out["values"][name] = json.loads(json.dumps(ns[name]))
                except Exception:
                    out["values"][name] = None
        if checks:
            check_ns = dict(ns)
            try:
                with contextlib.redirect_stdout(io.StringIO()):
                    exec(compile(checks, "<checks>", "exec"), check_ns)
                results = check_ns.get("results", [])
                out["checks"] = [
                    {"name": str(r["name"]), "passed": bool(r["passed"]), "hint": str(r.get("hint", ""))}
                    for r in results
                ]
            except BaseException as exc:
                out["checks"] = [{"name": "Running the checks", "passed": False, "hint": friendly(exc, "<checks>")}]
    if len(out["stdout"]) > 20000:
        out["stdout"] = out["stdout"][:20000] + "\n… output truncated …"
    return json.dumps(out)
