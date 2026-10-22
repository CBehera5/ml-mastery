"use client";
import type { CodeLabConfig } from "../../algorithms/linear-regression/lessons/code-lab-section";
import { CHECK_PRELUDE, preset, swap } from "./helpers";

export const FAIL = `except Exception as exc:
    results.append({"name": "Your functions run", "passed": False, "hint": str(exc)})
`;
export const cfg = (id: string, title: string, intro: string, cellTitle: string, starter: string, edits: [string, string][], checks: string, bridge: CodeLabConfig["bridge"], presets: CodeLabConfig["cell"]["presets"], q: [string, string], footer: string): CodeLabConfig => ({
  id, title, intro: <p>{intro}</p>, bridge,
  cell: { title: cellTitle, starter, solution: swap(starter, edits), checks, expose: [], presets },
  reflections: [{ question: <>{q[0]}</>, answer: <>{q[1]}</> }], footer: <>{footer}</>,
});

/* 1 · vectors */
const VEC_S = `import math

def add(u, v):
    return [0.0, 0.0]   # TODO 1: add matching components: [u[0] + v[0], u[1] + v[1]]

def scale(c, u):
    return [c * x for x in u]

def length(u):
    return 0.0          # TODO 2: Pythagoras: the square root of the sum of squares

def unit(u):
    n = length(u)
    if n == 0:
        return [0.0 for _ in u]
    return [x / n for x in u]

u, v = [3, 4], [1, -2]
print("u + v     =", add(u, v))
print("length(u) =", length(u))
print("unit(u)   =", unit(u))
`;
export const LA_VEC = cfg("lavec", "Build the vector toolkit", "Four small functions are all of vector arithmetic. Two of them are yours to write.", "add() and length()", VEC_S,
  [["    return [0.0, 0.0]   # TODO 1: add matching components: [u[0] + v[0], u[1] + v[1]]", "    return [a + b for a, b in zip(u, v)]"], ["    return 0.0          # TODO 2: Pythagoras: the square root of the sum of squares", "    return math.sqrt(sum(x * x for x in u))"]],
  CHECK_PRELUDE + `import math
try:
    results.append({"name": "add([3,4],[1,-2]) = [4,2]", "passed": add([3, 4], [1, -2]) == [4, 2], "hint": "add returned %r. Add the first components together and the second components together." % (add([3, 4], [1, -2]),)})
    results.append({"name": "length([3,4]) = 5", "passed": _close(length([3, 4]), 5.0), "hint": "length returned %r. It is sqrt(3² + 4²) = 5." % (length([3, 4]),)})
    results.append({"name": "unit([3,4]) = [0.6, 0.8]", "passed": all(_close(a, b) for a, b in zip(unit([3, 4]), [0.6, 0.8])), "hint": "unit uses length(); once length works this is [0.6, 0.8]."})
    results.append({"name": "A unit vector has length 1, in any dimension", "passed": _close(length(unit([1, 2, 2])), 1.0) and _close(length([1, 2, 2]), 3.0), "hint": "Do not hard-code two components: use zip and sum over all of them. length([1,2,2]) should be 3."})
` + FAIL,
  [{ math: "u + v", code: "[a + b for a, b in zip(u, v)]", note: "Match components, add each pair." }, { math: "|u| = √(u₁² + u₂²)", code: "math.sqrt(sum(x * x for x in u))", note: "Pythagoras in any dimension." }],
  [preset("Try a 3-4-5 triangle with u = [5, 12]", "The length should be exactly 13.", /^u, v = \[3, 4\]/m, "u, v = [5, 12]")], ["Why divide by the length to get a unit vector?", "Dividing every component by the length shrinks the arrow to length 1 without turning it. A unit vector keeps only the direction."], "The solution matches the playground: u + v = [4, 2] and the length of (3, 4) is 5.");

/* 2 · dot */
const DOT_S = `import math

def length(u):
    return math.sqrt(sum(x * x for x in u))

def dot(u, v):
    return 0.0   # TODO 1: multiply matching components and add them up

def cosine(u, v):
    return 0.0   # TODO 2: the dot product divided by both lengths

for name, a, b in [("same way", [1, 2], [2, 4]), ("perpendicular", [3, 4], [-4, 3]), ("opposite", [3, 4], [-3, -4])]:
    print(f"{name:14} dot = {dot(a, b):6.1f}   cosine = {cosine(a, b):5.2f}")
`;
export const LA_DOT = cfg("ladot", "Measure how much two arrows agree", "The dot product and the cosine are the two numbers behind similarity search, attention and linear models.", "dot() and cosine()", DOT_S,
  [["    return 0.0   # TODO 1: multiply matching components and add them up", "    return sum(a * b for a, b in zip(u, v))"], ["    return 0.0   # TODO 2: the dot product divided by both lengths", "    return dot(u, v) / (length(u) * length(v))"]],
  CHECK_PRELUDE + `try:
    results.append({"name": "dot([3,4],[4,0]) = 12", "passed": _close(dot([3, 4], [4, 0]), 12.0), "hint": "dot returned %r. Multiply matching components: 3×4 + 4×0." % (dot([3, 4], [4, 0]),)})
    results.append({"name": "Perpendicular arrows have dot product 0", "passed": _close(dot([3, 4], [-4, 3]), 0.0), "hint": "dot([3,4],[-4,3]) returned %r. 3×(−4) + 4×3 = 0." % (dot([3, 4], [-4, 3]),)})
    results.append({"name": "Parallel arrows have cosine 1 whatever their lengths", "passed": _close(cosine([1, 2], [2, 4]), 1.0), "hint": "cosine([1,2],[2,4]) returned %r. Divide the dot product by length(u) × length(v)." % (cosine([1, 2], [2, 4]),)})
    results.append({"name": "cosine([3,4],[4,0]) = 0.6", "passed": _close(cosine([3, 4], [4, 0]), 0.6), "hint": "cosine returned %r. dot = 12, lengths 5 and 4, so 12 ÷ 20 = 0.6." % (cosine([3, 4], [4, 0]),)})
` + FAIL,
  [{ math: "u·v = Σ uᵢvᵢ", code: "sum(a * b for a, b in zip(u, v))", note: "Multiply matching parts, then add." }, { math: "cos θ = u·v / (|u||v|)", code: "dot(u, v) / (length(u) * length(v))", note: "Agreement, ignoring size." }],
  [preset("Compare against the opposite direction only", "A lone negative cosine of −1.", /for name, a, b in \[.*\]:/, 'for name, a, b in [("opposite", [3, 4], [-3, -4])]:')], ["Two documents have a huge dot product but a small cosine. What does that tell you?", "They are long but point in different directions. The dot product mixes size with agreement; cosine removes size, so it is the better measure of similarity."], "The playground's default pair, (3, 4) and (4, 0), gives dot 12 and angle 53.1°, so cosine 0.6.");

/* 3 · matrix × vector */
const MV_S = `HOUSES = [[1, 2], [1.5, 3], [2, 3]]   # area (hundreds of sq ft), bedrooms

def dot(u, v):
    return sum(a * b for a, b in zip(u, v))

def mat_vec(X, w):
    for row in X:
        pass     # TODO 1: raise ValueError if a row's length differs from len(w)
    return []    # TODO 2: the dot product of every row with w

print(mat_vec(HOUSES, [100, 20]))
`;
export const LA_MV = cfg("lamv", "Score a whole table in one call", "A matrix times a vector is the dot product of every row with the vector. You will write exactly that, plus the shape check.", "mat_vec()", MV_S,
  [["        pass     # TODO 1: raise ValueError if a row's length differs from len(w)", "        if len(row) != len(w):\n            raise ValueError(\"row length %d does not match weights length %d\" % (len(row), len(w)))"], ["    return []    # TODO 2: the dot product of every row with w", "    return [dot(row, w) for row in X]"]],
  CHECK_PRELUDE + `try:
    out = mat_vec(HOUSES, [100, 20])
    results.append({"name": "Three predictions: 140, 210, 260", "passed": len(out) == 3 and all(_close(a, b) for a, b in zip(out, [140, 210, 260])), "hint": "mat_vec returned %r. Each prediction is a row dotted with [100, 20], for example 1×100 + 2×20 = 140." % (out,)})
    results.append({"name": "Works on a different table: identity × [5, 7] = [5, 7]", "passed": mat_vec([[1, 0], [0, 1]], [5, 7]) == [5, 7], "hint": "mat_vec([[1,0],[0,1]], [5,7]) returned %r; it should be [5, 7]." % (mat_vec([[1, 0], [0, 1]], [5, 7]),)})
    try:
        mat_vec(HOUSES, [1, 2, 3]); ok = False
    except ValueError:
        ok = True
    results.append({"name": "A 2-column table times a 3-long vector raises ValueError", "passed": ok, "hint": "Check each row's length against len(w) and raise ValueError when they differ. Silently zipping would drop a column."})
` + FAIL,
  [{ math: "(Xw)ᵢ = rowᵢ · w", code: "[dot(row, w) for row in X]", note: "One dot product per row." }, { math: "n×m times m×1", code: "len(row) != len(w)", note: "The inner sizes must match." }],
  [preset("Raise the bedroom weight to 50", "The third house gains most.", /\[100, 20\]/, "[100, 50]")], ["Why raise an error instead of returning a result when the shapes do not fit?", "Because there is no right answer. Quietly dropping a column would give predictions that look plausible and are wrong, the worst kind of bug."], "These are the same three predictions the playground shows: 140, 210 and 260.");

/* 4 · matrix × matrix */
const MM_S = `def mat_mul(A, B):
    # TODO 1: raise ValueError unless A's column count equals B's row count
    return []   # TODO 2: C[i][j] = sum over k of A[i][k] * B[k][j]

A = [[1, 2, 3], [4, 5, 6]]
B = [[1, 0], [0, 1], [1, 1]]
print(mat_mul(A, B))
`;
export const LA_MM = cfg("lamm", "Multiply two matrices without a library", "Every entry of the product is one row meeting one column. Three nested loops are the whole algorithm.", "mat_mul()", MM_S,
  [["    # TODO 1: raise ValueError unless A's column count equals B's row count\n    return []   # TODO 2: C[i][j] = sum over k of A[i][k] * B[k][j]", "    if len(A[0]) != len(B):\n        raise ValueError(\"cannot multiply %dx%d by %dx%d\" % (len(A), len(A[0]), len(B), len(B[0])))\n    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]"]],
  CHECK_PRELUDE + `try:
    C = mat_mul([[1, 2, 3], [4, 5, 6]], [[1, 0], [0, 1], [1, 1]])
    results.append({"name": "The lesson's product is [[4, 5], [10, 11]]", "passed": C == [[4, 5], [10, 11]], "hint": "mat_mul returned %r. Entry (0,0) = 1×1 + 2×0 + 3×1 = 4." % (C,)})
    results.append({"name": "Multiplying by the identity changes nothing", "passed": mat_mul([[1, 2], [3, 4]], [[1, 0], [0, 1]]) == [[1, 2], [3, 4]], "hint": "mat_mul(A, I) should return A. Each entry is a row of A dotted with a column of I."})
    try:
        mat_mul([[1, 2, 3], [4, 5, 6]], [[1, 0], [0, 1]]); ok = False
    except ValueError:
        ok = True
    results.append({"name": "A 2×3 times a 2×2 raises ValueError", "passed": ok, "hint": "A has 3 columns but B has 2 rows. Raise ValueError before looping."})
    results.append({"name": "Order matters: A·B ≠ B·A", "passed": mat_mul([[1, 2], [3, 4]], [[0, 1], [1, 0]]) != mat_mul([[0, 1], [1, 0]], [[1, 2], [3, 4]]), "hint": "mat_mul must compute row-of-first times column-of-second, so swapping the arguments changes the result."})
` + FAIL,
  [{ math: "Cᵢⱼ = Σₖ Aᵢₖ Bₖⱼ", code: "sum(A[i][k] * B[k][j] for k in range(len(B)))", note: "Row i meets column j." }],
  [preset("Swap the order with two 2×2 matrices", "A·B and B·A differ.", /^A = .*\nB = .*$/m, "A = [[1, 2], [3, 4]]\nB = [[0, 1], [1, 0]]")], ["Why is A·B generally not the same as B·A?", "Row-times-column pairs a different row with a different column when you swap them, and the shapes may not even fit. Each matrix acts on the plane differently, and the order is the order of the moves."], "The first entry of the product is 1×1 + 2×0 + 3×1 = 4, exactly as in the playground.");

/* 5 · transformations */
const TR_S = `def apply(M, v):
    return [0.0, 0.0]   # TODO 1: [a*x + b*y, c*x + d*y] where M = [[a, b], [c, d]]

def det(M):
    return 0.0          # TODO 2: a*d - b*c, the area scale factor

square = [[0, 0], [1, 0], [1, 1], [0, 1]]
shear = [[1, 1], [0, 1]]
print("shear moves the square to:", [apply(shear, p) for p in square])
print("area scale factor:", det(shear))
`;
export const LA_TR = cfg("latr", "Write the machine the playground draws", "apply() sends a point through a matrix; det() reports how much area survives.", "apply() and det()", TR_S,
  [["    return [0.0, 0.0]   # TODO 1: [a*x + b*y, c*x + d*y] where M = [[a, b], [c, d]]", "    return [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]]"], ["    return 0.0          # TODO 2: a*d - b*c, the area scale factor", "    return M[0][0] * M[1][1] - M[0][1] * M[1][0]"]],
  CHECK_PRELUDE + `try:
    results.append({"name": "Rotating (1, 0) by 90° lands on (0, 1)", "passed": apply([[0, -1], [1, 0]], [1, 0]) == [0, 1], "hint": "apply returned %r. Row 1 of M dotted with v gives the new x; row 2 gives the new y." % (apply([[0, -1], [1, 0]], [1, 0]),)})
    results.append({"name": "The shear sends (0, 1) to (1, 1)", "passed": apply([[1, 1], [0, 1]], [0, 1]) == [1, 1], "hint": "apply([[1,1],[0,1]],[0,1]) returned %r; row 1 gives 1×0 + 1×1 = 1." % (apply([[1, 1], [0, 1]], [0, 1]),)})
    results.append({"name": "det: stretch 2 → 2, shear → 1, flatten → 0", "passed": _close(det([[2, 0], [0, 1]]), 2.0) and _close(det([[1, 1], [0, 1]]), 1.0) and _close(det([[1, 1], [1, 1]]), 0.0), "hint": "det is a·d − b·c. A stretch by 2 doubles area; a shear keeps it; flattening kills it."})
    results.append({"name": "The columns of M are where the basis arrows land", "passed": apply([[2, 5], [3, 7]], [1, 0]) == [2, 3] and apply([[2, 5], [3, 7]], [0, 1]) == [5, 7], "hint": "apply(M, [1, 0]) should return the first column [2, 3], and apply(M, [0, 1]) the second column [5, 7]."})
` + FAIL,
  [{ math: "M·v", code: "[M[0][0]*v[0] + M[0][1]*v[1], M[1][0]*v[0] + M[1][1]*v[1]]", note: "Each new coordinate is a row dotted with v." }, { math: "det M = ad − bc", code: "M[0][0]*M[1][1] - M[0][1]*M[1][0]", note: "Area scale factor." }],
  [preset("Use a rotation instead of the shear", "Area stays 1.", /^shear = .*$/m, "shear = [[0, -1], [1, 0]]")], ["Why does a determinant of 0 mean information is lost?", "It means the plane is squashed onto a line (or a point), so different inputs land on the same output. Once that happens you cannot tell them apart, no matter what you do afterwards."], "The shear keeps area (determinant 1) and sends (0, 1) to (1, 1), as in the playground.");

/* 6 · span */
const SP_S = `def combo(a, b, v1, v2):
    return [0.0, 0.0]   # TODO 1: a copies of v1 plus b copies of v2

def solve(v1, v2, t):
    d = v1[0] * v2[1] - v1[1] * v2[0]
    if d == 0:
        return None     # v1 and v2 point the same way: they only span a line
    return None         # TODO 2: Cramer's rule: [(t0*v2[1] - t1*v2[0]) / d, (v1[0]*t1 - v1[1]*t0) / d]

print("2 of v1 + 1 of v2 =", combo(2, 1, [1, 1], [1, -1]))
print("mix needed for (3, 1):", solve([1, 1], [1, -1], [3, 1]))
print("with parallel arrows:", solve([1, 1], [2, 2], [3, 1]))
`;
export const LA_SP = cfg("lasp", "Ask whether a target is reachable", "combo() mixes two arrows. solve() runs the mix backwards and says when no mix can work.", "combo() and solve()", SP_S,
  [["    return [0.0, 0.0]   # TODO 1: a copies of v1 plus b copies of v2", "    return [a * v1[0] + b * v2[0], a * v1[1] + b * v2[1]]"], ["    return None         # TODO 2: Cramer's rule: [(t0*v2[1] - t1*v2[0]) / d, (v1[0]*t1 - v1[1]*t0) / d]", "    return [(t[0] * v2[1] - t[1] * v2[0]) / d, (v1[0] * t[1] - v1[1] * t[0]) / d]"]],
  CHECK_PRELUDE + `try:
    results.append({"name": "2 of (1,1) + 1 of (1,−1) = (3, 1)", "passed": combo(2, 1, [1, 1], [1, -1]) == [3, 1], "hint": "combo returned %r. Scale each arrow, then add component by component." % (combo(2, 1, [1, 1], [1, -1]),)})
    s = solve([1, 1], [1, -1], [3, 1])
    results.append({"name": "solve gives a = 2, b = 1 for the target (3, 1)", "passed": s is not None and _close(s[0], 2.0) and _close(s[1], 1.0), "hint": "solve returned %r. Use Cramer's rule with d = v1[0]·v2[1] − v1[1]·v2[0]." % (s,)})
    s2 = solve([1, 1], [1, -1], [5, -3])
    results.append({"name": "Mixing the answer back reproduces another target (5, −3)", "passed": s2 is not None and all(_close(a, b) for a, b in zip(combo(s2[0], s2[1], [1, 1], [1, -1]), [5, -3])), "hint": "solve([1,1],[1,-1],[5,-3]) returned %r; combo of that should give [5, -3]." % (s2,)})
    results.append({"name": "Parallel arrows span only a line: solve returns None", "passed": solve([1, 1], [2, 2], [3, 1]) is None, "hint": "When d is 0 the arrows are parallel, and the function must say so by returning None."})
` + FAIL,
  [{ math: "a·v₁ + b·v₂", code: "[a*v1[0] + b*v2[0], a*v1[1] + b*v2[1]]", note: "A mix of two arrows." }, { math: "d = 0 ⇒ dependent", code: "if d == 0: return None", note: "No unique mix." }],
  [preset("Change the target to (5, −3)", "Then a = 1 and b = 4.", /solve\(\[1, 1\], \[1, -1\], \[3, 1\]\)/, "solve([1, 1], [1, -1], [5, -3])")], ["What would you look at to decide if a set of features carries independent information?", "Whether any feature is a mix of the others. If so, the set is dependent and adds nothing new: the same kind of collapse as parallel arrows."], "The mix needed for (3, 1) is a = 2 and b = 1, as in the playground.");

/* 7 · inverse */
const IN_S = `def det(M):
    return M[0][0] * M[1][1] - M[0][1] * M[1][0]

def inverse(M):
    d = det(M)
    # TODO 1: raise ValueError("not invertible") when d is 0
    return M     # TODO 2: [[ M[1][1]/d, -M[0][1]/d], [-M[1][0]/d, M[0][0]/d]]

def mul(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(2)) for j in range(2)] for i in range(2)]

M = [[2, 1], [1, 1]]
try:
    print("inverse:", inverse(M))
    print("M x inverse:", mul(M, inverse(M)))
except ValueError as err:
    print("no inverse:", err)
`;
export const LA_IN = cfg("lain", "Undo a transformation, or say you cannot", "The inverse is a formula plus a guard: refuse when the determinant is zero.", "inverse()", IN_S,
  [["    # TODO 1: raise ValueError(\"not invertible\") when d is 0\n    return M     # TODO 2: [[ M[1][1]/d, -M[0][1]/d], [-M[1][0]/d, M[0][0]/d]]", "    if d == 0:\n        raise ValueError(\"not invertible\")\n    return [[M[1][1] / d, -M[0][1] / d], [-M[1][0] / d, M[0][0] / d]]"]],
  CHECK_PRELUDE + `try:
    inv = inverse([[2, 1], [1, 1]])
    results.append({"name": "inverse([[2,1],[1,1]]) = [[1,−1],[−1,2]]", "passed": all(_close(inv[i][j], [[1, -1], [-1, 2]][i][j]) for i in range(2) for j in range(2)), "hint": "inverse returned %r. Swap the diagonal, negate the off-diagonal, divide everything by the determinant (1 here)." % (inv,)})
    p = mul([[2, 1], [1, 1]], inv)
    results.append({"name": "M × M⁻¹ is the identity", "passed": all(_close(p[i][j], [[1, 0], [0, 1]][i][j]) for i in range(2) for j in range(2)), "hint": "mul(M, inverse(M)) returned %r; it should be [[1, 0], [0, 1]]." % (p,)})
    try:
        inverse([[1, 2], [2, 4]]); ok = False
    except ValueError:
        ok = True
    results.append({"name": "A flattening matrix [[1,2],[2,4]] raises ValueError", "passed": ok, "hint": "Its determinant is 1×4 − 2×2 = 0. Raise ValueError before dividing."})
    q = inverse([[2, 0], [0, 4]])
    results.append({"name": "Undoing a stretch: inverse([[2,0],[0,4]]) = [[0.5,0],[0,0.25]]", "passed": _close(q[0][0], 0.5) and _close(q[1][1], 0.25) and _close(q[0][1], 0.0), "hint": "The inverse of a stretch is the opposite shrink: 1/2 and 1/4 on the diagonal."})
` + FAIL,
  [{ math: "M⁻¹ = (1/det) [[d, −b], [−c, a]]", code: "[[M[1][1]/d, -M[0][1]/d], [-M[1][0]/d, M[0][0]/d]]", note: "Swap, negate, scale." }, { math: "det = 0", code: "raise ValueError", note: "No inverse." }],
  [preset("Try the flattening matrix", "It should refuse with an error.", /^M = \[\[2, 1\], \[1, 1\]\]/m, "M = [[1, 2], [2, 4]]")], ["In linear regression you solve for weights. What goes wrong if two features are copies of each other?", "The feature matrix flattens, its determinant is 0, and the normal equations have no unique solution. That is multicollinearity, seen as a failed inverse."], "The inverse of [[2, 1], [1, 1]] is [[1, −1], [−1, 2]], exactly what the playground reports.");

/* 8 · eigen */
const EG_S = `import math

def eigenvalues(M):
    tr = M[0][0] + M[1][1]
    d = M[0][0] * M[1][1] - M[0][1] * M[1][0]
    disc = 0.0     # TODO 1: tr*tr/4 - d  (negative means the matrix rotates and has no real eigenvalues)
    return None    # TODO 2: None if disc < 0, else the two values tr/2 + sqrt(disc) and tr/2 - sqrt(disc), largest first

for name, M in [("symmetric", [[2, 1], [1, 2]]), ("axis stretch", [[3, 0], [0, 1]]), ("rotation", [[0, -1], [1, 0]])]:
    print(name, eigenvalues(M))
`;
export const LA_EG = cfg("laeg", "Find the stretch factors yourself", "For a 2×2 matrix the eigenvalues come from a quadratic. You will code it and check that the arrows really line up.", "eigenvalues()", EG_S,
  [["    disc = 0.0     # TODO 1: tr*tr/4 - d  (negative means the matrix rotates and has no real eigenvalues)\n    return None    # TODO 2: None if disc < 0, else the two values tr/2 + sqrt(disc) and tr/2 - sqrt(disc), largest first", "    disc = tr * tr / 4 - d\n    if disc < 0:\n        return None\n    s = math.sqrt(disc)\n    return [tr / 2 + s, tr / 2 - s]"]],
  CHECK_PRELUDE + `import math
try:
    e = eigenvalues([[2, 1], [1, 2]])
    results.append({"name": "[[2,1],[1,2]] has eigenvalues 3 and 1", "passed": e is not None and _close(e[0], 3.0) and _close(e[1], 1.0), "hint": "eigenvalues returned %r. Here tr = 4 and det = 3, so disc = 4 − 3 = 1 and the values are 2 ± 1." % (e,)})
    e2 = eigenvalues([[3, 0], [0, 1]])
    results.append({"name": "A pure axis stretch has eigenvalues 3 and 1", "passed": e2 is not None and _close(e2[0], 3.0) and _close(e2[1], 1.0), "hint": "eigenvalues returned %r; for a diagonal matrix they are the diagonal entries." % (e2,)})
    results.append({"name": "A rotation has no real eigenvalues (returns None)", "passed": eigenvalues([[0, -1], [1, 0]]) is None, "hint": "For the 90° rotation disc = 0 − 1 = −1, which is negative: return None."})
    M = [[2, 1], [1, 2]]; v = [1, 1]
    Mv = [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]]
    results.append({"name": "The direction (1, 1) is stretched by exactly the larger eigenvalue", "passed": e is not None and all(_close(a, e[0] * b) for a, b in zip(Mv, v)), "hint": "M·(1,1) = (3,3) = 3·(1,1). The first eigenvalue must be 3."})
` + FAIL,
  [{ math: "λ = tr/2 ± √(tr²/4 − det)", code: "tr / 2 + math.sqrt(disc), tr / 2 - math.sqrt(disc)", note: "The quadratic formula for a 2×2." }, { math: "disc < 0", code: "if disc < 0: return None", note: "A rotation has no real eigenvalues." }],
  [preset("Check the shear", "Only one eigenvalue: both come out as 1.", /\("symmetric", \[\[2, 1\], \[1, 2\]\]\)/, '("shear", [[1, 1], [0, 1]])')], ["PCA finds directions of greatest spread. Why are eigenvectors the right tool?", "The covariance matrix stretches data most along its eigenvectors, and the eigenvalues say how much. The biggest one is the direction that keeps the most information."], "For [[2, 1], [1, 2]] the eigenvalues are 3 and 1, with eigenvectors along (1, 1) and (1, −1), the same angles the playground finds at 45° and 135°.");
