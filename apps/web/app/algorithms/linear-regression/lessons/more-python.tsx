"use client";
import { CodeLabSection, PredictStory, type CodeLabConfig, type PredictConfig } from "./code-lab-section";
import type { PythonRuntime } from "../../../components/live-python/client";
import { FitPlot, SignedBars } from "../../../components/live-python/charts";
import {
  EQUATION_CHECKS, EQUATION_PRESETS, EQUATION_SOLUTION, EQUATION_STARTER,
  ERRORS_CHECKS, ERRORS_PRESETS, ERRORS_SOLUTION, ERRORS_STARTER,
  FAILURE_CHECKS, FAILURE_PRESETS, FAILURE_SOLUTION, FAILURE_STARTER,
  MULTI_CHECKS, MULTI_PRESETS, MULTI_SOLUTION, MULTI_STARTER,
} from "./more-python-content";

const c = (s: string) => <code>{s}</code>;

/* ───────── Lesson 2: the line equation (shown after the discovery step, so it never spoils it) ───────── */
export const EQUATION_CODE: CodeLabConfig = {
  id: "eq",
  title: "Write the line as a Python function",
  intro: <p>You just saw that a line has a slope {c("w")} and a baseline {c("b")}. A <strong>function</strong> is how Python turns that sentence into something that gives an answer for any input. Write it once, then reuse it for every house.</p>,
  bridge: [
    { math: "ŷ = w·x + b", code: "return w * x + b", note: "Slope times input, plus the baseline once." },
    { math: "rᵢ = ŷᵢ − yᵢ", code: "residual = estimate - actual", note: "Prediction minus recorded value. Negative means we under-predicted." },
    { math: "x = 0 ⇒ ŷ = b", code: "predict(w, b, 0)", note: "With zero area only the baseline is left." },
  ],
  cell: {
    title: "predict(): the line as code", starter: EQUATION_STARTER, solution: EQUATION_SOLUTION, checks: EQUATION_CHECKS, expose: ["areas", "prices", "w", "b", "estimate", "residual"], presets: EQUATION_PRESETS,
    renderResult: (v) => <FitPlot x={v.areas} y={v.prices} w={v.w} b={v.b} title="Your line against the six recorded houses" xLabel="Area (thousand ft²)" yLabel="Price (₹ lakh)" />,
  },
  reflections: [
    { question: <>With {c("w = 42, b = 140")}, a 2,500 ft² house is estimated at 245, but sold for 246. What is the residual?</>, answer: <>{c("245 − 246 = −1")}. The sign says <em>under</em>-predicted by one ₹ lakh. The next lesson turns many residuals into one honest score.</> },
    { question: <>Why does the line cross the price axis at 140, not 0?</>, answer: <>At {c("x = 0")} the {c("w * x")} part vanishes and only {c("b")} remains. The baseline is what a house of zero area would still &ldquo;cost&rdquo; under this line (land, fees). It is an extrapolation, so read it as an anchor for the line, not a real house.</> },
  ],
  footer: <>Try the quick experiments to watch the line pivot ({c("w")}) or slide ({c("b")}). Both are exactly what gradient descent will learn to adjust.</>,
};

/* ───────── Lesson 3: errors ───────── */
export const ERRORS_STORY: PredictConfig = {
  id: "errors",
  title: "Which house does the line get most wrong?",
  story: <><p>A line is only useful if we can say <em>how well</em> it fits. &ldquo;Pretty good&rdquo; will not do when a bank prices a mortgage from it. We need a single number, and the choice of that number decides which mistakes the model fears most.</p></>,
  predictTitle: "Spot the biggest miss",
  question: <p>With {c("w = 42, b = 140")} the estimates are 182, 215.6, 245, 274.4, 308 and 341.6 for recorded prices 178, 213, 246, 278, 316 and 349. Which house has the largest miss?</p>,
  options: [{ id: "first", label: "The smallest house (1,000 ft²)" }, { id: "fifth", label: "The 4,000 ft² house" }, { id: "last", label: "The largest house (4,800 ft²)" }],
  correctId: "fifth",
  explanation: <>The 4,000 ft² house is off by 8 (estimate 308, recorded 316). The 4,800 ft² house is off by 7.4. Notice the line <em>under</em>-predicts the bigger homes: the errors have a pattern, not just a size. The code below turns these six numbers into MAE, MSE and RMSE.</>,
};
export const ERRORS_CODE: CodeLabConfig = {
  id: "errcode",
  title: "Compute the error scores yourself",
  intro: <p>Three scores summarise the same residuals. They differ in <em>how they treat a big miss</em>: MAE counts it once, MSE and RMSE square it, so one large miss is punished far more.</p>,
  bridge: [
    { math: "rᵢ = ŷᵢ − yᵢ", code: "[p - y for p, y in zip(predictions, prices)]", note: "One residual per house." },
    { math: "MAE = (1/m) Σ |rᵢ|", code: "sum(abs(r) for r in residuals) / len(residuals)", note: "Average size of the misses." },
    { math: "MSE = (1/m) Σ rᵢ²", code: "sum(r ** 2 for r in residuals) / len(residuals)", note: "Average squared miss." },
    { math: "RMSE = √MSE", code: "math.sqrt(mse)", note: "Back in rupees again." },
  ],
  cell: {
    title: "MAE, MSE and RMSE from scratch", starter: ERRORS_STARTER, solution: ERRORS_SOLUTION, checks: ERRORS_CHECKS, expose: ["residuals", "mae", "mse", "rmse"], presets: ERRORS_PRESETS,
    renderResult: (v) => <SignedBars labels={["1,000 ft²", "1,800 ft²", "2,500 ft²", "3,200 ft²", "4,000 ft²", "4,800 ft²"]} values={v.residuals} title="Residuals: estimate minus recorded price" unit="(₹ lakh)" />,
  },
  reflections: [
    { question: <>The residuals are +4, +2.6, −1, −3.6, −8, −7.4. Why can&rsquo;t we just average them?</>, answer: <>They sum to −13.4 / 6 ≈ −2.23, which looks small only because positive and negative misses cancel. A model that is wrong by +100 and −100 would score a perfect 0. Taking {c("abs()")} or squaring first removes the sign.</> },
    { question: <>MAE is 4.43 but RMSE is 5.09. Why is RMSE bigger?</>, answer: <>Squaring makes big misses count extra, and the square root only partly undoes it. RMSE ≥ MAE always, and the gap grows when a few errors dominate. Try the &ldquo;very wrong line&rdquo; experiment and compare the two.</> },
  ],
  footer: <>Same numbers, two ways: these scores are the ones the guided lab above reports, produced by the platform&rsquo;s verified TypeScript maths runtime.</>,
};

/* ───────── Lesson 5: several features ───────── */
export const MULTI_STORY: PredictConfig = {
  id: "multi",
  title: "More than one thing sets a price",
  story: <p>A house&rsquo;s price is never only about its area. Bedrooms push it up; age pulls it down. Each feature gets its own weight, and the estimate is a <strong>running total</strong>: start from the baseline, then let every feature add or subtract its share.</p>,
  predictTitle: "Estimate a price in your head",
  question: <p>Weights are 82 per thousand ft², 18 per bedroom and −1.4 per year of age, with a baseline of 75. A 2,400 ft², 3-bedroom, 12-year-old house is closest to which price (₹ lakh)?</p>,
  options: [{ id: "250", label: "About 250" }, { id: "309", label: "About 309" }, { id: "420", label: "About 420" }],
  correctId: "309",
  explanation: <>82×2.4 = 196.8, 18×3 = 54, −1.4×12 = −16.8, plus the baseline 75 gives <strong>309</strong>. The code below does this for any number of features with one loop.</>,
};
export const MULTI_CODE: CodeLabConfig = {
  id: "multicode",
  title: "A prediction is a dot product",
  intro: <p>Adding {c("weight × value")} for each feature and then the baseline is called a <strong>dot product</strong> (plus a bias). It is the heart of linear regression, and of every neural-network layer that follows.</p>,
  bridge: [
    { math: "ŷ = b + Σⱼ wⱼ xⱼ", code: "total = bias; total += wj * xj", note: "Start at the baseline; every feature adds its share." },
    { math: "wⱼ xⱼ", code: "[wj * xj for wj, xj in zip(weights, house)]", note: "Each feature's contribution, in order." },
    { math: "Σ contributions = ŷ", code: "sum(contributions)", note: "Contributions add up to the estimate." },
  ],
  cell: {
    title: "Predict with three features", starter: MULTI_STARTER, solution: MULTI_SOLUTION, checks: MULTI_CHECKS, expose: ["contributions", "estimate", "all_estimates"], presets: MULTI_PRESETS,
    renderResult: (v) => <SignedBars labels={["Floor area", "Bedrooms", "Property age", "Baseline"]} values={v.contributions} title="What each part adds to the estimate" unit="(₹ lakh)" />,
  },
  reflections: [
    { question: <>Property age has a weight of −1.4. What does the negative sign mean?</>, answer: <>Each extra year <em>lowers</em> the estimate by 1.4 (₹ lakh), holding the other features fixed. 35 years of age subtracts 49, 12 years subtracts 16.8.</> },
    { question: <>Why is it dangerous to compare weights directly (82 vs 18)?</>, answer: <>The features live on different scales: area is measured in thousands of ft² and runs 1 to 5, bedrooms run 2 to 4. A weight is &ldquo;per unit of that feature&rdquo;, so a big number does not by itself mean an important feature. Scaling features first makes weights comparable.</> },
  ],
  footer: <>These estimates (160.4, 248.6, 309 and 394.2) are the ones the guided lab computes with the verified maths runtime.</>,
};

/* ───────── Lesson 7: failure modes ───────── */
export const FAILURE_STORY: PredictConfig = {
  id: "fail",
  title: "One bad row against the whole line",
  story: <p>Least squares is a democracy where bigger errors get <em>louder</em> votes: each miss is squared. That makes it elegant, and it also makes it fragile. A single wrong number can drag the entire line toward itself.</p>,
  predictTitle: "How far does one typo move the slope?",
  question: <p>The clean housing data gives a slope of about 45.5. Now add <em>one</em> seventh house, 4,800 ft² recorded at a price of 120 instead of about 349. What happens to the slope?</p>,
  options: [{ id: "tiny", label: "Barely changes (about 44)" }, { id: "half", label: "Drops to about a third of its old value (about 16)" }, { id: "up", label: "Goes up" }],
  correctId: "half",
  explanation: <>One row out of seven cuts the slope from 45.46 to <strong>16.42</strong>. The line tilts hard toward the bad point because squaring a miss of ~230 makes it dominate everything else. The code below lets you reproduce this.</>,
};
export const FAILURE_CODE: CodeLabConfig = {
  id: "failcode",
  title: "Fit the line yourself, then break it",
  intro: <p>Least squares has a closed-form answer, so there is no loop: the best slope is a ratio of two sums. Write {c("fit()")}, then flip {c("add_typo")} to see the fragility with your own code.</p>,
  bridge: [
    { math: "w = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)²", code: "sum((a-x_mean)*(c-y_mean) ...) / sum((a-x_mean)**2 ...)", note: "How x and y move together, divided by how x moves alone." },
    { math: "b = ȳ − w·x̄", code: "y_mean - slope * x_mean", note: "The line always passes through the averages." },
  ],
  cell: {
    title: "Closed-form least squares", starter: FAILURE_STARTER, solution: FAILURE_SOLUTION, checks: FAILURE_CHECKS, expose: ["X", "Y", "w", "b", "clean_w", "clean_b"], presets: FAILURE_PRESETS,
    renderResult: (v) => <FitPlot x={v.X} y={v.Y} w={v.w} b={v.b} ghost={typeof v.clean_w === "number" && typeof v.clean_b === "number" ? [v.clean_w, v.clean_b] : undefined} title="Your fit (teal) and the clean fit (grey dashed)" xLabel="Area (thousand ft²)" yLabel="Price (₹ lakh)" ghostLabel="line fitted to the clean data" />,
  },
  reflections: [
    { question: <>Which error score would have warned you about the typo, MAE or RMSE?</>, answer: <>RMSE reacts more, because it squares the one huge miss. A big gap between RMSE and MAE is a standard hint that a few points dominate.</> },
    { question: <>Should we just delete the odd point?</>, answer: <>Not automatically. First ask whether it is an error (a typo, as here) or a real, rare house. Deleting real data to get a prettier line is how models fail in production. Robust methods and a look at the data come before any deletion.</> },
  ],
  footer: <>The slopes quoted here (45.46 clean, 16.42 with the typo) are the exact least-squares answers, checked against the platform&rsquo;s runtime.</>,
};

export const Story = ({ config }: { config: PredictConfig }) => <PredictStory config={config} />;
export const Section = ({ config, runtime }: { config: CodeLabConfig; runtime?: PythonRuntime }) => <CodeLabSection config={config} runtime={runtime} />;
