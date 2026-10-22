"use client";
import { CodeLabSection, type CodeLabConfig } from "../../algorithms/linear-regression/lessons/code-lab-section";
import type { PythonRuntime } from "../../components/live-python/client";
import type { CellPreset } from "../../components/live-python/live-python-cell";

export const OBJECTIVE_STARTER = `areas  = [1.0, 1.8, 2.5, 3.2, 4.0, 4.8]      # thousand ft²
prices = [178, 213, 246, 278, 316, 349]      # ₹ lakh
w, b = 10.0, 100.0                            # the orange dot's starting spot

def loss(w, b):
    """The height of the hill at (w, b): the average squared miss."""
    return 0.0    # TODO 1: average of (w * area + b - price) ** 2 over the six houses

def gradient(w, b):
    """Which way is uphill? Returns (slope in w, slope in b)."""
    return 0.0, 0.0    # TODO 2: average of 2 * miss * area, and average of 2 * miss

dw, db = gradient(w, b)
print(f"at w={w}, b={b}: loss = {loss(w, b):.1f}")
print(f"slope of the loss: in w = {dw:.1f}, in b = {db:.1f}")
`;
export const OBJECTIVE_SOLUTION = [
  ["    return 0.0    # TODO 1: average of (w * area + b - price) ** 2 over the six houses", "    return sum((w * x + b - y) ** 2 for x, y in zip(areas, prices)) / len(areas)"],
  ["    return 0.0, 0.0    # TODO 2: average of 2 * miss * area, and average of 2 * miss", "    misses = [w * x + b - y for x, y in zip(areas, prices)]\n    n = len(areas)\n    return sum(2 * r * x for r, x in zip(misses, areas)) / n, sum(2 * r for r in misses) / n"],
].reduce((code, [from, to]) => { if (!code.includes(from)) throw new Error(`missing: ${from}`); return code.replace(from, to); }, OBJECTIVE_STARTER);

export const OBJECTIVE_CHECKS = `
def _close(a, b, tol=1e-9): return abs(a - b) <= tol * max(1.0, abs(b))
_A = [1.0, 1.8, 2.5, 3.2, 4.0, 4.8]; _P = [178, 213, 246, 278, 316, 349]
def _loss(w, b): return sum((w * x + b - y) ** 2 for x, y in zip(_A, _P)) / 6
def _grad(w, b):
    r = [w * x + b - y for x, y in zip(_A, _P)]
    return sum(2 * a * x for a, x in zip(r, _A)) / 6, sum(2 * a for a in r) / 6
results = []
try:
    got = loss(10.0, 100.0)
    results.append({"name": "loss(10, 100) ≈ 20,163.8: the dot's starting height", "passed": _close(got, _loss(10.0, 100.0)),
        "hint": "loss returned %r. Square each miss (line value minus price), add the six up, then divide by 6." % (got,)})
    got2 = loss(40.0, 140.0)
    results.append({"name": "loss(40, 140) ≈ 114.3: a much better line", "passed": _close(got2, _loss(40.0, 140.0)),
        "hint": "loss(40, 140) returned %r. Check the sign convention and that you divide by the number of houses." % (got2,)})
except Exception as exc:
    results.append({"name": "loss() runs", "passed": False, "hint": "loss() raised: " + str(exc)})
try:
    g = gradient(10.0, 100.0); want = _grad(10.0, 100.0)
    results.append({"name": "slope in w at (10, 100) is −892.5", "passed": _close(g[0], want[0]),
        "hint": "You returned %r. For w: average of 2 × miss × area. The area multiplies because w scales the area." % (g[0],)})
    results.append({"name": "slope in b at (10, 100) is −269", "passed": _close(g[1], want[1]),
        "hint": "You returned %r. For b: average of 2 × miss, with no area, because b just adds a constant." % (g[1],)})
    bw, bb = 45.46098095398618, 132.25417158267317
    gb = gradient(bw, bb)
    results.append({"name": "At the best line the slopes are zero: the bottom of the bowl", "passed": abs(gb[0]) < 1e-6 and abs(gb[1]) < 1e-6,
        "hint": "At the best line (w≈45.46, b≈132.25) there is no direction left to improve, so both slopes should be ~0. You got %r." % (gb,)})
except Exception as exc:
    results.append({"name": "gradient() runs", "passed": False, "hint": "gradient() raised: " + str(exc)})
`;
const preset = (label: string, description: string, w: number, b: number): CellPreset => ({ label, description, apply: (code) => code.replace(/^w, b = [^\n#]*/m, `w, b = ${w.toFixed(1)}, ${b.toFixed(1)}`.padEnd(44)) });
export const OBJECTIVE_PRESETS: CellPreset[] = [
  preset("Try w = 40, b = 140", "A much better line", 40, 140),
  preset("Try w = 80, b = 60", "A bad line: steep and low", 80, 60),
  preset("Back to the start (10, 100)", "The orange dot's start", 10, 100),
];

export const OBJECTIVE_CODE: CodeLabConfig = {
  id: "objcode",
  title: "Build the hill yourself",
  intro: <p>The map above is just a function: give it a slope <code>w</code> and a baseline <code>b</code>, get a height. You will write that function and its slope in Python, then check it against the playground.</p>,
  bridgeCaption: "From the picture to the code",
  bridge: [
    { math: "rᵢ = w·xᵢ + b − yᵢ", code: "miss = w * x + b - y", note: "How far one house is from the line. These are the orange sticks." },
    { math: "L(w, b) = (1/m) Σ rᵢ²", code: "sum(r ** 2 for r in misses) / len(misses)", note: "The height of the hill: the average squared miss." },
    { math: "∂L/∂w = (1/m) Σ 2·rᵢ·xᵢ", code: "sum(2 * r * x ...) / n", note: "Slope in the w direction. Bigger inputs tilt the hill more." },
    { math: "∂L/∂b = (1/m) Σ 2·rᵢ", code: "sum(2 * r ...) / n", note: "Slope in the b direction." },
  ],
  cell: {
    title: "Loss and gradient for six houses", starter: OBJECTIVE_STARTER, solution: OBJECTIVE_SOLUTION, checks: OBJECTIVE_CHECKS, expose: ["w", "b", "dw", "db"], presets: OBJECTIVE_PRESETS,
    renderResult: (v) => typeof v.w === "number" && typeof v.b === "number" ? <p>Now move the playground&rsquo;s dot to <strong>w = {v.w}, b = {v.b}</strong>. Its readout should match your printed loss and slopes.</p> : null,
  },
  reflections: [
    { question: <>The slope in <code>w</code> is −892.5 at the start. What does the minus sign tell us?</>, answer: <>The hill goes <em>down</em> as <code>w</code> increases, so to improve we should <strong>raise</strong> w. Downhill is the opposite of the gradient, which is why the update rule has a minus sign.</> },
    { question: <>Why is the slope in <code>w</code> (−892.5) so much bigger than in <code>b</code> (−269)?</>, answer: <>Each miss is multiplied by its area (up to 4.8) for <code>w</code>, but by 1 for <code>b</code>. A feature measured in bigger numbers gives a steeper hill, which is why scaling features matters.</> },
    { question: <>Is the lowest point always the &ldquo;best&rdquo; line?</>, answer: <>It is the best line <em>for this loss</em>. A different way of scoring misses (absolute value, or penalising big misses less) would put the bottom somewhere else. Choosing the objective is a modelling decision.</> },
  ],
  footer: <>At the best line (w ≈ 45.46, b ≈ 132.25) the loss is about 1.18 and both slopes are zero: nothing is left to improve.</>,
};

export const ObjectiveCode = ({ runtime }: { runtime?: PythonRuntime }) => <CodeLabSection config={OBJECTIVE_CODE} runtime={runtime} />;
