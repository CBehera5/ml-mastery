// Content for the "Code it yourself" part of the gradient-descent lesson.
// The numbers mirror the verified housing lab (HOUSE_DATA) and the math runtime.

export const GRADIENT_STARTER = `# ── Settings you can change ────────────────────────────
lr = 0.01            # learning rate: how big each downhill step is
steps = 20           # how many steps to take
w0, b0 = 10.0, 100.0 # starting guess:  price = w × area + b

# ── The data: area (thousand ft²) → price (₹ lakh) ──
X = [1.0, 1.8, 2.5, 3.2, 4.0, 4.8]
y = [178, 213, 246, 278, 316, 349]
m = len(X)

def predict(w, b, x):
    return w * x + b

def loss(w, b):
    # mean squared error: the height of the hill at (w, b)
    return sum((predict(w, b, xi) - yi) ** 2 for xi, yi in zip(X, y)) / m

def gradients(w, b):
    dw, db = 0.0, 0.0
    for xi, yi in zip(X, y):
        r = predict(w, b, xi) - yi    # residual: prediction − actual
        dw += 0.0                     # TODO 1: this row's share of ∂L/∂w
        db += 0.0                     # TODO 2: this row's share of ∂L/∂b
    return dw, db

w, b = w0, b0
history = [loss(w, b)]                # loss before any step
for step in range(steps):
    dw, db = gradients(w, b)
    # TODO 3: step downhill. Update w and b using lr, dw and db.
    history.append(loss(w, b))

print(f"start:  w = {w0:.2f}   b = {b0:.2f}   loss = {history[0]:.1f}")
print(f"after {steps} steps:  w = {w:.2f}   b = {b:.2f}   loss = {history[-1]:.1f}")
`;

export const GRADIENT_SOLUTION = GRADIENT_STARTER
  .replace("dw += 0.0                     # TODO 1: this row's share of ∂L/∂w", "dw += 2 / m * r * xi              # (2/m) · rᵢ · xᵢ")
  .replace("db += 0.0                     # TODO 2: this row's share of ∂L/∂b", "db += 2 / m * r                   # (2/m) · rᵢ")
  .replace("    # TODO 3: step downhill. Update w and b using lr, dw and db.\n", "    w = w - lr * dw                   # w ← w − α · ∂L/∂w\n    b = b - lr * db                   # b ← b − α · ∂L/∂b\n");

// Hidden checks. They run against the learner's own functions and recompute the
// expected answer from the learner's current settings, so changing lr/steps is safe.
export const GRADIENT_CHECKS = `
def _ref_grad(w, b):
    dw = sum(2 / m * (w * xi + b - yi) * xi for xi, yi in zip(X, y))
    db = sum(2 / m * (w * xi + b - yi) for xi, yi in zip(X, y))
    return dw, db

def _ref_final(w, b, lr, steps):
    for _ in range(steps):
        dw, db = _ref_grad(w, b)
        w, b = w - lr * dw, b - lr * db
    return w, b

def _close(a, b, tol=1e-6):
    return abs(a - b) <= tol * max(1.0, abs(b))

results = []
try:
    got = gradients(10.0, 100.0)
    want = _ref_grad(10.0, 100.0)
    results.append({"name": "∂L/∂w at (w=10, b=100) is −892.5", "passed": _close(got[0], want[0]),
        "hint": "You returned dw = %.4g. Each row should add 2 / m * r * xi: the residual, times the input, times 2/m." % got[0]})
    results.append({"name": "∂L/∂b at (w=10, b=100) is −269", "passed": _close(got[1], want[1]),
        "hint": "You returned db = %.4g. Each row should add 2 / m * r; there is no xi, because the bias multiplies 1." % got[1]})
except Exception as exc:
    results.append({"name": "gradients() runs and returns (dw, db)", "passed": False, "hint": "gradients() raised: " + str(exc)})

try:
    rw, rb = _ref_final(w0, b0, lr, steps)
    results.append({"name": "After the loop, (w, b) match a trusted reference", "passed": _close(w, rw) and _close(b, rb),
        "hint": "Your final (w, b) is (%.4g, %.4g); the reference is (%.4g, %.4g). The step is: new value = old value − lr × gradient, for both w and b." % (w, b, rw, rb)})
except Exception as exc:
    results.append({"name": "Training loop finished", "passed": False, "hint": str(exc)})
`;

export const GRADIENT_PRESETS = [
  { label: "lr = 0.001 (tiny steps)", description: "Barely moves in 20 steps", value: "0.001" },
  { label: "lr = 0.01 (the lesson default)", description: "Smooth and steady", value: "0.01" },
  { label: "lr = 0.05 (bold)", description: "Overshoots once, then settles", value: "0.05" },
  { label: "lr = 0.1 (too big)", description: "Overshoots more each step", value: "0.1" },
].map((p) => ({
  label: p.label,
  description: p.description,
  apply: (code: string) => code.replace(/^lr = [^\s#]+/m, `lr = ${p.value}`),
}));
