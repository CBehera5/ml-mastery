# Decisions

## ADR-014: Keep dataset regression separate from the linear-neuron contract

**Status:** Accepted

Dataset regression optimizes mean squared error with the standard `2/m` batch gradient, while the verified linear-neuron trace represents one sample with unaveraged squared error. The new regression v1 runtime, schemas, fixtures, and tests are therefore additive. Feature scaling rejects zero-variance selected columns, and training traces expose bounded state entries and explicit termination instead of changing or overloading neuron behavior.

## ADR-013: Trace matrix products at the row and output-cell level

**Status:** Accepted

Matrix-vector traces expose per-row products; matrix-matrix traces expose the products contributing to each output cell. This is more educationally useful than returning only results and prevents React from recreating multiplication formulas.

## ADR-013: Use local loss sensitivity as the calculus-to-ML bridge

**Status:** Accepted

Task 007 centers the loss curve `L(w)=(2w-6)^2` and requires learners to compare slopes on both sides of its minimum. Runtime traces supply analytical, numerical, secant, and tangent values. The lesson describes a derivative as the predicted response to a small parameter change, while deliberately deferring the learning-rate-scaled update rule to Task 008.

## ADR-011: Teach ML mathematics through application-linked traces

**Status:** Accepted

Math Foundations lessons begin with an ML problem and progress through visual, symbolic, code, and debugging representations. They do not reproduce a general school-mathematics syllabus. Each interactive calculation must consume a verified runtime trace.

## ADR-012: Give dot products an independent versioned contract

**Status:** Accepted

A dot product is useful beyond the linear-neuron input shape and does not require bias, target, loss, or learning rate. It therefore has its own minimal input and trace schemas, Python reference function, TypeScript function, and generated fixture file. The existing neuron contract remains unchanged.

## ADR-009: Quarantine deliberate mathematical bugs in educational adapters

**Status:** Accepted

Debugging challenges may need incorrect behavior, but incorrect formulas must never enter `packages/math-runtime`. Task 003 therefore implements the ascent movement in a route-local adapter. Both its source gradients and its resulting prediction and loss are calculated by the verified runtime. A corrected answer is verified against the runtime's canonical update rather than a hardcoded success flag.

## ADR-010: Compare challenge attempts from an immutable baseline

**Status:** Accepted

Every Task 003 attempt starts from the same reference input. Broken and corrected outputs are therefore directly comparable, reset is deterministic, and a failed attempt cannot silently become the starting point for the next attempt.

## ADR-001: Verified dual runtime

Use NumPy as the reference implementation and dependency-free TypeScript for browser execution. This adds controlled duplication but avoids a Python server and keeps interactions immediate. Committed fixtures and equivalent tests manage divergence risk.

## ADR-002: Inspectable trace is the public contract

Return inputs plus forward, backward, and update stages rather than only a scalar result. Future visualizations must render this trace and must not recompute mathematical values.

## ADR-003: Squared error has no one-half factor

Loss is exactly `(prediction - target)^2`; therefore its derivative is `2 × (prediction - target)`. This matches the product reference example.

## ADR-004: Version contracts independently of package releases

Schemas and traces carry semantic version `1.0.0`. Backward-incompatible field or mathematical changes require a new major schema version and fixtures.

## ADR-005: Explicit trace refresh after parameter edits

Keep form drafts separate from the last valid runtime trace. Editing marks the visualization stale; forward, backward, update, and training actions validate the draft before replacing the trace. This avoids misleading mixed-state calculations.

## ADR-006: SVG for explanatory graphics

Use responsive inline SVG for the neuron and loss chart. Weight sign is encoded with solid versus dashed connections and magnitude with line width, so meaning does not depend on color.

## ADR-007: Lesson completion requires observable evidence

Each lesson step maps to a concrete interaction state—running a pass, changing a weight and recalculating, selecting loss, inspecting a gradient, or applying an update. Navigation cannot mark a step complete, and learners may satisfy later conditions while exploring freely.

## ADR-008: Valid edits update the preview reactively

Valid parameter drafts immediately produce a fresh runtime trace, while the explicit forward action confirms the experiment for the lesson. Invalid drafts hide the previous trace entirely, preventing stale values from appearing current.
