// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DotPlayground, EigenPlayground, InversePlayground, MatMulPlayground, MatVecPlayground, SpanPlayground, TransformPlayground, VectorsPlayground } from "./la-labs";
import { A_MAT, B_FULL, HOUSES, add, angleDeg, apply, combo, det, dot, eigenvalues, inverse, matMul, matVec, mul2, norm, project, solveCombo } from "./la-math";

afterEach(cleanup);
const readout = (name: string | RegExp) => screen.getAllByText(name).find((n) => n.tagName === "DT")!.nextElementSibling!.textContent;
const slide = (label: string | RegExp, value: number) => fireEvent.change(screen.getByLabelText(label), { target: { value: String(value) } });

describe("every number quoted in the Linear Algebra lessons", () => {
  it("vectors: (3,4) has length 5 and unit direction (0.6, 0.8); (3,4)+(1,-2) = (4,2)", () => { expect(norm([3, 4])).toBe(5); expect([3 / 5, 4 / 5]).toEqual([0.6, 0.8]); expect(add([3, 4], [1, -2])).toEqual([4, 2]); });
  it("dot: (3,4)·(4,0) = 12, angle 53.13°, cosine 0.6, perpendicular (-4,3) gives 0, shadow (3,0)", () => {
    expect(dot([3, 4], [4, 0])).toBe(12); expect(angleDeg([3, 4], [4, 0])).toBeCloseTo(53.13, 2); expect(dot([3, 4], [4, 0]) / (5 * 4)).toBe(0.6);
    expect(dot([3, 4], [-4, 3])).toBe(0); expect(project([3, 4], [4, 0])).toEqual([3, 0]); expect(dot([3, 4], [-3, -4])).toBe(-25);
  });
  it("matrix × vector: [100,20] scores the three houses 140, 210, 260", () => { expect(matVec(HOUSES, [100, 20])).toEqual([140, 210, 260]); expect(matVec([[1, 0], [0, 1]], [5, 7])).toEqual([5, 7]); });
  it("matrix × matrix: the 2×3 by 3×2 product is [[4,5],[10,11]]", () => { expect(matMul(A_MAT, B_FULL)).toEqual([[4, 5], [10, 11]]); expect(1 * 1 + 2 * 0 + 3 * 1).toBe(4); });
  it("transformations: rotate maps (1,0) to (0,1); shear maps (0,1) to (1,1); dets 2, 1, 0", () => {
    expect(apply([[0, -1], [1, 0]], [1, 0])).toEqual([0, 1]); expect(apply([[1, 1], [0, 1]], [0, 1])).toEqual([1, 1]);
    expect([det([[2, 0], [0, 1]]), det([[1, 1], [0, 1]]), det([[1, 1], [1, 1]])]).toEqual([2, 1, 0]);
  });
  it("span: 2·(1,1) + 1·(1,-1) = (3,1); parallel vectors give no solution", () => { expect(combo(2, 1, [1, 1], [1, -1])).toEqual([3, 1]); expect(solveCombo([1, 1], [1, -1], [3, 1])).toEqual([2, 1]); expect(solveCombo([1, 1], [2, 2], [3, 1])).toBeNull(); expect(solveCombo([1, 1], [1, -1], [5, -3])).toEqual([1, 4]); });
  it("inverse: [[2,1],[1,1]] has det 1 and inverse [[1,-1],[-1,2]]; [[1,2],[2,4]] has none", () => { expect(det([[2, 1], [1, 1]])).toBe(1); expect(inverse([[2, 1], [1, 1]])).toEqual([[1, -1], [-1, 2]]); expect(inverse([[1, 2], [2, 4]])).toBeNull(); expect(mul2(inverse([[2, 1], [1, 1]])!, [[2, 1], [1, 1]])).toEqual([[1, 0], [0, 1]]); });
  it("eigen: [[2,1],[1,2]] has 3 and 1; rotation has none; shear has 1 twice", () => { expect(eigenvalues([[2, 1], [1, 2]])).toEqual([3, 1]); expect(eigenvalues([[0, -1], [1, 0]])).toBeNull(); expect(eigenvalues([[1, 1], [0, 1]])).toEqual([1, 1]); });
});

describe("the playgrounds", () => {
  it("vectors: sliders change the readout and report exploring", () => {
    const done = vi.fn(); render(<VectorsPlayground onDone={done} />);
    expect(readout("Length of u")).toBe("5"); expect(readout("u + v")).toBe("[4, 2]"); expect(readout("Unit direction of u")).toBe("[0.6, 0.8]");
    slide(/^v x/, 3); expect(readout("u + v")).toBe("[6, 2]"); expect(done).toHaveBeenCalled();
  });
  it("vectors: dragging a handle moves the vector", () => {
    const done = vi.fn(); const { container } = render(<VectorsPlayground onDone={done} />);
    const handle = container.querySelector("circle[r='11']")!; fireEvent.pointerDown(handle, { pointerId: 1 });
    const g = handle.parentElement!; fireEvent.pointerMove(g, { clientX: 0, clientY: 0 }); fireEvent.pointerUp(g);
    expect(done).toHaveBeenCalled();
  });
  it("dot: default 12 and 53.1°; the perpendicular preset gives 0", () => {
    render(<DotPlayground />); expect(readout("u · v")).toBe("12"); expect(readout("Angle between")).toBe("53.1°");
    fireEvent.click(screen.getByRole("button", { name: "Perpendicular to u" })); expect(readout("u · v")).toBe("0"); expect(document.body.textContent).toContain("Perpendicular");
    fireEvent.click(screen.getByRole("button", { name: "Opposite" })); expect(readout("u · v")).toBe("-25");
  });
  it("matrix × vector: 140, 210, 260; more weight on bedrooms raises them", () => {
    const done = vi.fn(); render(<MatVecPlayground onDone={done} />); expect(readout("Predictions")).toBe("[140, 210, 260]");
    slide(/per bedroom/, 50); expect(readout("Predictions")).toBe("[200, 300, 350]"); expect(done).toHaveBeenCalled();
  });
  it("matrix × matrix: click an entry; a 2×2 B makes the product undefined", () => {
    const done = vi.fn(); render(<MatMulPlayground onDone={done} />);
    fireEvent.click(screen.getByRole("button", { name: "Entry 2, 2: 11" })); expect(done).toHaveBeenCalled(); expect(document.body.textContent).toContain("= 4×0 + 5×1 + 6×1 = 11");
    fireEvent.click(screen.getByRole("button", { name: /does not fit/ })); expect(readout("Product")).toBe("undefined");
  });
  it("transformations: the shear preset has determinant 1; flatten has 0", () => {
    const done = vi.fn(); render(<TransformPlayground onDone={done} />); expect(readout("Determinant")).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: "Flatten" })); expect(readout("Determinant")).toBe("0"); expect(done).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Rotate 90°" })); expect(readout("(1, 0) lands at")).toBe("[0, 1]");
  });
  it("span: a = 2, b = 1 hits the target; parallel arrows cannot reach it", () => {
    render(<SpanPlayground />); expect(readout("Mix needed")).toBe("a = 2, b = 1"); slide(/Amount of v₁/, 2); slide(/Amount of v₂/, 1); expect(readout("Your point")).toBe("[3, 1]"); expect(document.body.textContent).toContain("You landed on the target");
    fireEvent.click(screen.getByRole("button", { name: /along v₁/ })); expect(readout("Mix needed")).toBe("no mix reaches it");
  });
  it("inverse: det 1 and a recoverable point; the flattening example has no inverse", () => {
    render(<InversePlayground />); expect(readout("Determinant")).toBe("1"); expect(readout("M⁻¹·(M·t)")).toBe("[1, 2]");
    fireEvent.click(screen.getByRole("button", { name: "Flattening example" })); expect(readout("Inverse")).toBe("does not exist"); expect(readout("M⁻¹·(M·t)")).toBe("cannot recover t");
  });
  it("eigen: at 45° the symmetric matrix only stretches x, by 3; a rotation has no eigenvalues", () => {
    const done = vi.fn(); render(<EigenPlayground onDone={done} />); expect(readout("Aligned?")).toBe("no");
    slide(/Direction of x/, 45); expect(readout("Aligned?")).toBe("yes, eigenvalue 3"); expect(done).toHaveBeenCalled();
    slide(/Direction of x/, 135); expect(readout("Aligned?")).toBe("yes, eigenvalue 1");
    fireEvent.click(screen.getByRole("button", { name: "Rotation" })); expect(readout("Eigenvalues")).toBe("none (complex)"); expect(readout("Aligned?")).toBe("no");
  });
});
