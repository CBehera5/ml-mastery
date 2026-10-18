import type { ConceptualExercise, NumericalExercise } from "../../learn/foundation/exercises";

export const MODULE_ID = "linear-algebra.foundations";
export const TOPICS = ["vectors", "dot", "matrix-vector", "matrix-matrix"] as const;
export type Topic = typeof TOPICS[number];
export type Lesson = "vectors" | "matrices";
export const routeFor = (topic: Topic) => topic === "vectors" || topic === "dot" ? "/math/vectors-dot-product" : "/math/matrices-multiplication";
export const lessonTopics = (lesson: Lesson) => TOPICS.filter(topic => lesson === "vectors" ? topic === "vectors" || topic === "dot" : topic === "matrix-vector" || topic === "matrix-matrix");
export const CONTENT: Record<Topic, { title: string; why: string; definition: string; intuition: string; symbols: string; worked: string; misconception: string; application: string; recall: string }> = {
  vectors: {
    title: "Scalars, vectors and geometric intuition",
    why: "A house has several measurements. An ordered collection lets one calculation keep track of them without losing their meanings.",
    definition: "A scalar is one number, such as a bedroom count. A vector is an ordered list of components. In two dimensions, [3,4] is a displacement: 3 units horizontally and 4 vertically. A feature vector can have many more components; its order and units belong to its data contract.",
    intuition: "An arrow starts at the origin (0,0) and ends at its component coordinates. Addition joins arrows head to tail; scalar multiplication stretches, shrinks or reverses an arrow. Magnitude is the nonnegative arrow length. Direction describes where it points; a zero vector has no direction.",
    symbols: "u=[u₁,u₂] and v=[v₁,v₂]: ordered vectors; subscripts label components. c: a scalar. u+v=[u₁+v₁,u₂+v₂]. cu=[cu₁,cu₂]. ‖u‖=√(u₁²+u₂²). For nonzero u, u/‖u‖ is its unit direction.",
    worked: "For u=[3,4], v=[−1,2], u+v=[2,6], 2u=[6,8] and ‖u‖=√(9+16)=5. The unit direction is [0.6,0.8]. With c=−1, −u=[−3,−4] has the same length and the opposite direction.",
    misconception: "The magnitude is not generally the sum of components: [3,4] has length 5, not 7. A scalar is different from a length-one vector in shape-sensitive code.",
    application: "Feature vectors represent one example. Geometric distance needs comparable coordinates: mixing square metres, bedrooms and raw dollars without scaling can make a norm misleading. Our arrow experiment uses coordinates in the same arbitrary unit, not raw house features.",
    recall: "Square each coordinate, add, then take a square root. A negative number squared is positive. Review Algebra variables and powers if these operations are unfamiliar.",
  },
  dot: {
    title: "Dot products, alignment and projections",
    why: "We need both a way to combine feature contributions into a prediction and a way to measure how vectors align.",
    definition: "A dot product multiplies corresponding components and adds the products. Equal vector lengths and consistent component order are required. Its result is one scalar, not another vector.",
    intuition: "For nonzero vectors u·v=‖u‖‖v‖cos(θ), where θ is their angle. Positive means an acute angle, zero means perpendicular, and negative means an obtuse angle. The projection of u onto nonzero v is the part of u along the line through v: ((u·v)/(v·v))v. A negative projection coefficient points opposite v.",
    symbols: "The dot · means pair–multiply–add. Σ means sum all component products. θ is the angle in degrees in this explorer. cos(θ) is normalized alignment, from −1 to 1. A zero vector has neither an angle nor cosine similarity; projection onto the zero vector is undefined.",
    worked: "u=[3,4], v=[1,0]: u·v=3×1+4×0=3; projection onto v=[3,0]. For [1,0] and [0,2] the dot is 0. For [2,0] and [−3,0] it is −6. House features [2,3,4] and weights [5,2,3] give 10+6+12=28, an illustrative score.",
    misconception: "A larger raw dot product does not always mean greater directional similarity: length affects it. Zero dot means perpendicular only when both vectors are nonzero. Weighted feature scores need not have a geometric house-distance interpretation.",
    application: "A prediction adds aligned feature×weight contributions, often plus a separate bias. Similarity systems may normalize lengths to compare directions. Feature order and units still matter; these fictional weights are not a trained price model.",
    recall: "Use vector magnitude from the preceding section. Projection is a vector on a line; a dot product is a scalar. Revisit ordered components before using a feature weight.",
  },
  "matrix-vector": {
    title: "Matrices, rows and batch predictions",
    why: "A dataset contains many examples. A matrix records the examples and their feature meanings so one operation can calculate a batch of predictions.",
    definition: "A matrix is a rectangular table of numbers. Its shape is rows × columns. Here each row is a house and each column is a feature. A vector has one index, a matrix two; a tensor is the broader word for arrays with any number of axes. Shape vocabulary prevents accidental mixing of examples and features.",
    intuition: "Each matrix row takes one dot product with the same weight vector. Thus X with m rows and n columns times a length-n vector produces a length-m result. In a geometric use, a matrix maps an input vector to an output vector; dataset rows in this lesson instead describe a batch of examples.",
    symbols: "Xᵢⱼ is feature j of example i. wⱼ is weight j. ŷᵢ=ΣⱼXᵢⱼwⱼ is prediction i; ŷ marks an estimate. m=number of examples; n=number of features. X:(m×n), w:(n), ŷ:(m). @ denotes matrix multiplication, not elementwise multiplication.",
    worked: "For X=[[2,3,4],[4,2,5],[3,4,2]] and w=[5,2,3], the row sums are [28,39,29]. A rectangular X=[[1,2,3],[4,5,6]] has shape 2×3. With w=[1,0,−1], Xw=[−2,−2], a length-2 result.",
    misconception: "Rows determine how many batch scores there are; columns determine compatibility with the weights. Transposing or deleting a feature just to make shapes fit can change the model's meaning.",
    application: "Rows can be houses and columns size, bedrooms and age. Each weight must match its documented column and units. A separate bias would be added to each score. The existing lab keeps its original illustrative [28,39,29] baseline.",
    recall: "Review the preceding dot-product lesson: each row pairs with the same ordered weight vector. Shape (2×3) differs from (3×2), even though both contain six numbers.",
  },
  "matrix-matrix": {
    title: "Rectangular matrix multiplication and order",
    why: "The same examples may need several output scores. Multiple weight columns let us calculate all outputs while preserving the row and feature contracts.",
    definition: "For A:(m×n) and B:(n×p), AB has shape m×p. Entry (i,k) is row i of A dotted with column k of B. The inner dimensions must agree. Matrix multiplication generally depends on order; BA may be undefined or have different values.",
    intuition: "Each output column repeats a matrix-vector product. Geometrically AB applies B first, then A to a column vector when the shapes allow it. We use this as an orientation preview; interactive transformation composition and eigenvectors belong to the later geometry extension.",
    symbols: "(AB)ᵢₖ=ΣⱼAᵢⱼBⱼₖ. i chooses an input row, k an output column, j runs over matching inner positions. Aᵀ means transpose: swap rows and columns; it is not a general repair for a schema mismatch.",
    worked: "A=[[1,2,3],[4,5,6]], B=[[1,0],[0,1],[1,1]]. AB=[[4,5],[10,11]] has shape 2×2. Its top-left cell is 1×1+2×0+3×1=4. BA is compatible here but has shape 3×3, so it cannot equal AB. A 2×3 matrix cannot multiply a 2×2 matrix on the right.",
    misconception: "Do not multiply only matching visible cells. Each output cell is a row-column sum. Compatible shapes are necessary but do not prove that the feature meanings or units align.",
    application: "X:(examples×features) and W:(features×outputs) yield scores:(examples×outputs), the linear computation inside a dense layer. We introduce the array operation here without implementing a new ML algorithm.",
    recall: "Track row and column counts before calculating. Basis/span, identity/inverse, determinant and eigenvalue intuition belong to the next geometry extension; this core assessment does not test them.",
  },
};

export type CoreQuestion = { key: string; topic: Topic; objectiveId: string; critical: boolean; statement: string; exercise: ConceptualExercise | NumericalExercise };
export function questions(variant: 0 | 1 | 2): CoreQuestion[] {
  const seed = variant + 1;
  const rows: CoreQuestion[] = [];
  function add(topic: Topic, key: string, statement: string, prompt: string, expected: number | string, explanation: string, options?: string[], critical = false) {
    const objectiveId = `${MODULE_ID}.${key}`;
    const base = { schemaVersion: "1.0.0" as const, id: `${objectiveId}.${variant === 0 ? "guided" : `v0${variant}`}`, version: "1.0.0", objectiveIds: [objectiveId], prompt, points: 1, retry: { maxAttempts: 3, variantIds: ["v01", "v02"] }, feedback: { correct: `Correct. ${explanation}`, incorrect: `Reconsider: ${explanation}`, exhausted: `Review: ${explanation}` } };
    const exercise = typeof expected === "number" ? { ...base, kind: "numerical" as const, expected, absoluteTolerance: .001 } : { ...base, kind: "conceptual" as const, options: options!.map((label, index) => ({ id: `option-${index}`, label })), expectedOptionId: `option-${options!.indexOf(expected)}` };
    rows.push({ key, topic, objectiveId, critical, statement, exercise });
  }
  add("vectors", "vectors.norm", "Calculate vector magnitude.", `What is the magnitude of [${3 * seed},${4 * seed}]?`, 5 * seed, "Use √(x²+y²); magnitude is nonnegative.", undefined, true);
  add("vectors", "vectors.add", "Add corresponding vector components.", `For u=[${seed},2] and v=[−1,3], what is the second component of u+v?`, 5, "Add components in the same position: 2+3=5.");
  add("vectors", "vectors.scale", "Interpret a negative scalar multiplication.", `Multiply [${seed},2] by −2. What is the first component?`, -2 * seed, "Multiply every component by −2; negative scale reverses direction.");
  add("vectors", "vectors.zero", "Distinguish magnitude from direction, including the zero vector.", variant === 2 ? "Which direction statement is valid?" : "What is true of the vector [0,0]?", "Zero magnitude; no defined direction", "A zero vector has length zero and cannot be normalized to a unit direction.", ["Zero magnitude; no defined direction", "Magnitude 1 and direction north", "Its direction is always horizontal"]);
  const feature = [seed, 2, -1], weight = [2, -3, 4];
  add("dot", "dot.signed", "Calculate a signed weighted dot product.", `Calculate [${feature.join(",")}] · [${weight.join(",")}].`, 2 * seed - 10, "Multiply matched positions, preserving signs: 2×first −6−4.", undefined, true);
  add("dot", "dot.alignment", "Interpret perpendicular alignment and length effects.", `For nonzero u=[${seed},0], v=[0,2], what does u·v=0 tell you?`, "They are perpendicular", "Both vectors are nonzero and their coordinate axes meet at a right angle.", ["They are perpendicular", "They have the same direction", "They must be identical"]);
  add("dot", "dot.projection", "Calculate a projection onto a coordinate direction.", `Project u=[${seed + 2},4] onto v=[1,0]. What is the first component of the projection?`, seed + 2, "Projection onto the horizontal unit direction keeps the horizontal component and sets the vertical component to zero.");
  add("dot", "dot.order", "Preserve feature meaning when positions change.", variant === 2 ? "A size/age schema became age/size. The shapes still match. What is safe?" : "A pipeline swaps bedrooms and size but keeps weight order. What is safe?", "Restore the documented feature order and matching units", "A shape check cannot detect a semantic column swap; restore the documented contract.", ["Change one weight until this row happens to match", "Restore the documented feature order and matching units", "Ignore order because lengths match"]);
  add("matrix-vector", "matrix.shape", "Determine the result shape of a rectangular matrix-vector product.", `X has ${seed + 3} rows and 3 columns; w has length 3. How many scores does Xw have?`, seed + 3, "Each row gives one dot product; the column count checks compatibility.", undefined, true);
  add("matrix-vector", "matrix.row", "Compute a row of a rectangular batch prediction.", `For X=[[${seed},2,3],[4,5,6]], w=[1,0,−1], what is the first output?`, seed - 3, "The first row produces first×1+2×0+3×(−1).");
  add("matrix-vector", "matrix.missing", "Diagnose a missing weight without deleting information.", "X has 3 documented feature columns but w has length 2. What should you do?", "Restore the missing weight according to the feature schema", "The third feature needs its own corresponding weight. Do not delete information to hide a mismatch.", ["Drop any column", "Restore the missing weight according to the feature schema", "Transpose until something runs"]);
  add("matrix-vector", "matrix.axes", "Interpret dataset axes and tensor vocabulary.", variant === 1 ? "A dataset has 8 houses and 3 measurements each. Which representation preserves the convention?" : "With examples as rows, what do the axes of a feature matrix mean?", "Rows are examples; columns are features; a matrix has two axes", "A feature matrix has two indices: example then feature. A tensor is the broader array vocabulary.", ["Rows are examples; columns are features; a matrix has two axes", "Columns must always be examples", "A matrix is one scalar"]);
  add("matrix-matrix", "batch.shape", "Check inner dimensions and output shape.", `A is ${seed + 3}×3 and B is 3×2. How many columns does AB have?`, 2, "Inner dimensions match (3); outer dimensions give (row count of A)×2.", undefined, true);
  add("matrix-matrix", "batch.cell", "Compute a matrix product cell by a row-column sum.", `A first row=[${seed},2,3]; B first column=[1,0,1]. What is (AB)₁₁?`, seed + 3, "Pair the row with the column: first×1+2×0+3×1.");
  add("matrix-matrix", "batch.order", "Recognize that multiplication order changes shape or validity.", "A is 2×3 and B is 3×2. Which statement is valid?", "AB is 2×2; BA is 3×3; they cannot be equal", "Compute each ordered shape separately. Matrix multiplication is generally not commutative.", ["AB and BA must be equal", "AB is 2×2; BA is 3×3; they cannot be equal", "Neither product is defined"]);
  add("matrix-matrix", "batch.compatibility", "Reject incompatible matrix multiplication.", `Can a ${seed + 3}×3 matrix multiply a 2×2 matrix on the right?`, "No: left columns 3 do not equal right rows 2", "Compare the inner counts, not the number of total cells.", ["Yes: both have two-dimensional arrays", "No: left columns 3 do not equal right rows 2", "Yes: use elementwise multiplication instead"]);
  return rows;
}

export const CORE_BLUEPRINT = {
  schemaVersion: "1.0.0", assessmentId: "linear-algebra.core.assessment.v1", version: "1.0.0",
  minimumPercent: 80, absoluteTolerance: .001, variantIds: ["v01", "v02"],
  competencies: TOPICS, questions: questions(0).map(({ key, topic, objectiveId, critical, statement }) => ({ key, topic, objectiveId, critical, statement })),
};
