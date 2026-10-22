"use client";
import { useRef, useState } from "react";
import { configFor, LABS } from "./catalog";
import styles from "./lesson.module.css";
import { ContentBridge } from "./content-bridges";

const authored = (weight: number, input = "positive-ln3", target = 1) => `LG-E1.LG.authored.w${weight}.${input}.y${target}.v1`;
export const GUIDES = [
  {
    outcome: "Explain how a customer signal becomes a probability, then a decision.",
    context: "A fictional retention team wants to decide whom to contact before a customer leaves. At day 0, it estimates the chance of cancellation during days 1–30. Class 1 means leaves; class 0 means stays. A probability of 75% expresses the model's estimate, not a promise about this customer.",
    intuition: "Keep three things separate. A score combines the available signal with model settings. A smooth conversion turns that score into a number between 0 and 1. A separate decision rule determines whether to contact the customer. Unlike a house-price estimate, a probability needs a bounded scale.",
    case: "Use the existing synthetic customer signal x ≈ 1.098612, coefficient 1 and baseline 0. The signal is a dimensionless teaching input, not a measured business quantity. Its exact value is ln(3), chosen to make the probability a clean 75%; you do not need to calculate a logarithm to begin. The later observed label is 1, but that label is not used to predict.",
    before: authored(1), after: authored(2), lab: 0,
    fixed: "Same signal x = ln(3), baseline 0 and decision threshold 0.5. Only the coefficient changes from 1 to 2. No model is refitted.",
    question: "What happens to the estimated probability of leaving when the coefficient doubles?",
    choices: ["It rises, but does not double", "It doubles to 150%", "It stays the same", "Not sure"], correct: 0,
    mechanism: "The coefficient scales the signal: the score doubles from about 1.098612 to 2.197225. The probability conversion bends rather than multiplying probabilities by the coefficient. The estimate rises from 75% to 90%, an increase of 15 percentage points. At threshold 0.5, both estimates lead to contact. Changing a model setting is a sensitivity experiment; it does not establish that changing a customer's behavior causes cancellation.",
    equation: "z = w × x + b     p = 1 / (1 + exp(−z))",
    symbols: [["x", "The known synthetic signal, ln(3) ≈ 1.098612; no physical unit."], ["w and b", "Coefficient 1 (then 2) and baseline 0: model settings, not observations."], ["z", "The dimensionless score. Multiply w by x, then add b once."], ["p", "Estimated probability of class 1. Multiply by 100 to display a percentage."]],
    math: "The second rule is called the sigmoid. exp(a) means e raised to a, where e is about 2.718. Negate the score, apply exp, add 1 and divide 1 by the result. Here exp(−ln(3)) = 1/3, so p = 1/(1 + 1/3) = 0.75. For twice the score, exp(−2 ln(3)) = 1/9, giving 0.90. A zero score gives 0.50; positive scores give more than 0.50. The same score increase has different probability effects in different parts of this curve.",
    python: "import math\n\nsignal = math.log(3)  # the same exact teaching input\ncoefficient = 1       # change to 2 for the second case\nbaseline = 0\nscore = coefficient * signal + baseline\nprobability = 1 / (1 + math.exp(-score))\nthreshold = 0.5\ncontact_customer = probability >= threshold\n# probability: 0.75 before, approximately 0.90 after\n# contact_customer: True in both cases",
    code: "An equals sign assigns a value to a Python name. The * and + operations are the multiplication and addition in the score. math.exp implements exp; / divides. The >= comparison returns True or False, not a new probability. This small illustration applies fixed settings; it does not train a model. In the practical workflow below, class identity must be checked before selecting a probability column.",
    recap: "A coefficient changes the score; sigmoid maps the score to probability; a threshold maps probability to an action. These are three distinct steps.",
  },
  {
    outcome: "Explain why two correct decisions can have different probability losses.",
    context: "Return to the same fictional customer, whose later recorded outcome is leaves (1). One setting estimates 75%; another estimates 90%. Both cross a 0.5 contact threshold. We need a way to compare the probability estimates, even though their actions agree.",
    intuition: "Judge how much probability the model assigned to what actually happened. Giving more probability to the observed event lowers its surprise. A loss is a numerical penalty: smaller is better on these observed rows. It is not an extra probability.",
    case: "Use the same signal ln(3), baseline 0 and observed training label 1. Compare coefficient 1 with coefficient 2. The two saved reference probabilities are 0.75 and 0.90.",
    before: authored(1), after: authored(2), lab: 0,
    fixed: "Same customer signal, label 1 and threshold 0.5. Change only the coefficient, producing a different probability. This comparison is not an optimizer run.",
    question: "What happens to this row's log loss when the probability of its observed outcome rises from 75% to 90%?",
    choices: ["The loss increases", "It stays equal because both decisions are correct", "The loss decreases", "Not sure"], correct: 2,
    mechanism: "The recorded positive outcome receives more probability. Its log loss falls from about 0.287682 to 0.105361 while both decisions remain positive. Accuracy cannot show that difference for this one row. If the recorded outcome were stays (0), assigning 90% to leaves would instead be a confident mistake. A training label may guide fitting; a final-test label must not update or select the model.",
    equation: "Loss = −ln(p) when y = 1;   Loss = −ln(1 − p) when y = 0",
    symbols: [["y", "The observed label: 1 for leaves, 0 for stays."], ["p", "The predicted probability of leaves, before inspecting that outcome."], ["ln", "Natural logarithm, the inverse of exp. Python calls it math.log."], ["Loss", "A dimensionless penalty; average row losses for a multi-row log loss."]],
    math: "Select the probability of the event that happened: p for leaves, 1−p for stays. Apply ln and negate the result. For this label, −ln(0.75) ≈ 0.287682 and −ln(0.90) ≈ 0.105361. These are positive because logarithms of numbers between 0 and 1 are negative. Exact zero probability for an observed event has infinite mathematical loss; finite precision and clipped library values require separate treatment in the deeper explanation below.",
    python: "import math\n\nobserved_label = 1\nprobability_before = 0.75\nprobability_after = 0.90\nloss_before = -math.log(probability_before)\nloss_after = -math.log(probability_after)\n# approximately 0.287682 and 0.105361\n# For observed_label = 0, use -math.log(1 - probability).",
    code: "The leading minus negates the logarithm. The two probabilities correspond to the same coefficient comparison as the experiment; the observed label chooses which loss branch to use. This scalar example uses interior probabilities. Do not pass zero to math.log; the endpoint discussion explains the mathematical limit rather than silently clipping it.",
    recap: "Decisions ask which side of a threshold a probability lies on. Log loss asks how much probability was assigned to the observed outcome.",
  },
  {
    outcome: "Explain how a threshold changes actions while probabilities stay fixed.",
    context: "The retention team has eight fictional development customers with saved probabilities and later observed outcomes. It can contact customers whose estimated chance of leaving meets a chosen threshold. An unnecessary contact and a missed cancellation have different consequences.",
    intuition: "Imagine a marker moving along a probability scale. Raising it means fewer customers qualify for contact. The customers' saved probabilities do not move, and no coefficients are refitted. A positive prediction means contact, not a guaranteed cancellation.",
    case: "Use the existing eight-row moderate-probability case. The probabilities are 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8 and 0.9. Only rows 6 and 8 later leave. Each error has cost 1 in this comparison.",
    before: "LG-E2.moderate.t0.5.fn1", after: "LG-E2.moderate.t0.6.fn1", lab: 1,
    fixed: "Same eight probabilities, observed labels and error costs. Raise only the contact threshold from 0.5 to 0.6. Equality counts as contact.",
    question: "What happens to the number of customers selected for contact?",
    choices: ["It stays at four", "It falls from four to three", "It rises because probabilities increase", "Not sure"], correct: 1,
    mechanism: "Row 5 has probability 0.5: it qualifies at 0.5 but not at 0.6. Row 6 still qualifies because equality is included. The unnecessary contacts fall from two to one; both customers who leave are still detected. This outcome is specific to these rows, not a guarantee that raising thresholds never misses cancellations. Select a threshold on permitted development evidence, then freeze it before final testing.",
    equation: "Contact if p ≥ t     Precision = TP / (TP + FP)     Recall = TP / (TP + FN)",
    symbols: [["p and t", "A saved probability and the chosen threshold, both on the 0–1 scale."], ["TP", "Contacted a customer who later leaves: a true positive."], ["FP", "Contacted a customer who later stays: a false positive."], ["FN", "Did not contact a customer who later leaves: a false negative."]],
    math: "Count every row before dividing. At threshold 0.5: TP=2, FP=2, FN=0, so precision=2/4 and recall=2/2. At 0.6: TP=2, FP=1, FN=0, so precision=2/3 and recall=2/2. Precision asks how many contacts were actual positives; recall asks how many actual positives were detected. A zero denominator means undefined, not automatically zero.",
    python: "probabilities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9]\nobserved = [0, 0, 0, 0, 0, 1, 0, 1]\nthreshold = 0.6  # compare with 0.5\nactions = [int(p >= threshold) for p in probabilities]\n# [0, 0, 0, 0, 0, 1, 1, 1] at threshold 0.6\n# probabilities is unchanged",
    code: "The list comprehension applies the same comparison to each probability in row order. int converts False to 0 and True to 1. Changing threshold changes this list of actions; it does not modify the probability list. Match each action to the observed label of the same customer before counting errors.",
    recap: "A threshold chooses actions. It cannot improve the underlying probabilities or justify using final-test outcomes to tune decisions.",
  },
  {
    outcome: "Explain how regularization changes a fitted model and why stronger confidence need not be better.",
    context: "A model fitted to a small customer sample may assign large coefficients that are sensitive to that sample. Regularization adds a preference for controlled coefficients. Compare two existing fitted workflows on exactly the same training and development rows.",
    intuition: "Think of a coefficient penalty as resistance to large settings. In this implementation C controls the inverse strength: smaller C means stronger resistance. The fit balances probability loss and that preference. This is different from manually moving a threshold after fitting.",
    case: "Compare the existing L2 fits with C=0.1 and C=10, using their first saved query customer. This deliberately extends the earlier one-signal illustration to two dimensionless signals, 0.5 and 1. The scaler and training rows are fixed. Unlike the first lesson's manual weight edit, these are saved results of actual fits, replayed here.",
    before: "LG-E1.fit.C0.1.q1", after: "LG-E1.fit.C10.q1", lab: 0,
    fixed: "Same training rows, scaler convention, solver and first saved query customer. Change C from 0.1 to 10; fitted coefficients may change together.",
    question: "Which setting has the stronger coefficient penalty?",
    choices: ["C = 0.1", "C = 10", "They are equal", "Not sure"], correct: 0,
    mechanism: "C=0.1 has the stronger penalty. In these saved fits the first coefficient changes from about 0.179669 to 1.210403 when C rises to 10. The query customer's probability moves farther above 0.5, from about 54.23% to 73.84%. Yet development log loss worsens from about 0.689747 to 0.759381. Larger coefficients and stronger confidence do not guarantee better held-out estimates.",
    equation: "Objective = mean(log loss) + sum(w²) / (2 × C × n)",
    symbols: [["w", "Fitted coefficients; square each and add the squares for the penalty."], ["C", "Positive inverse penalty strength. Increasing C makes this penalty smaller for fixed coefficients."], ["n", "Number of training rows, eight for this saved fit."], ["b", "The fitted intercept; not included in this coefficient penalty."]],
    math: "The fit seeks a balance between average training loss and coefficient size under this declared convention. Dividing by a larger C reduces the penalty for the same w; it does not say which fitted model will predict better. Scaling defines the coefficient ruler and must be fitted only on training rows. In raw feature space, a fixed linear score gives a straight decision boundary; sigmoid bounds probabilities but does not create arbitrary curved boundaries.",
    python: "coefficients = [0.17966883940885886, 0.09012320069080418]\nC = 0.1\nn_training = 8\nsquared_size = sum(w * w for w in coefficients)\npenalty = squared_size / (2 * C * n_training)\n# This computes the penalty of the saved C=0.1 fit.\n# It does not reproduce the fitting algorithm.",
    code: "The generator multiplies each coefficient by itself; sum adds those squares. The denominator follows the displayed objective. The practical pipeline below performs scaling and fitting with a supported solver; selecting C still requires permitted development evidence. Unsupported solver settings are diagnostics, not valid fits with poor scores.",
    recap: "Smaller C means stronger regularization in this convention. Choose using matching development evidence, not a belief that more confidence is always better.",
  },
  {
    outcome: "Identify information leakage even when reported prediction scores look good.",
    context: "At day 0, the team must predict cancellation during days 1–30. A feature recorded only after cancellation would reveal the future. Likewise, preprocessing that learns from held-out rows breaks the intended evaluation boundary.",
    intuition: "Put a fence around training rows. The scaler and model may learn inside it; development rows help compare choices, while final-test rows remain outside selection. A pipeline groups steps, but its actual fitting history determines whether that fence was respected.",
    case: "Compare the existing valid moderate-probability development case with its global-scaler diagnostic. Both report the same saved probabilities and accuracy. The diagnostic changes the information boundary: its scaler was allowed to see held-out data.",
    before: "LG-E2.moderate.t0.5.fn1", after: "LG-E2.invalid.global-scaler", lab: 1,
    fixed: "Same displayed rows, probabilities and threshold 0.5. Compare valid training-only preprocessing with the invalid global-scaler provenance. This is an evaluation diagnostic, not a new fit in the browser.",
    question: "Does unchanged accuracy make the global-scaler workflow a valid held-out evaluation?",
    choices: ["Yes: equal accuracy repairs the boundary", "Only if every prediction is correct", "No: held-out information entered preprocessing", "Not sure"], correct: 2,
    mechanism: "Both saved outcomes have accuracy 75%, but only the training-only workflow respects the declared fit boundary. Seeing held-out inputs can leak information even without their labels. A score describes predictions; it does not prove how they were produced. Final-test data must not fit preprocessing, train parameters or select thresholds.",
    equation: "Fit on training IDs → transform held-out inputs → predict → align by customer ID → evaluate",
    symbols: [["Training IDs", "Customer rows allowed to determine scaler statistics and model parameters."], ["Held-out IDs", "Different rows used for evaluation, not for learning the evaluated fit."], ["Class columns", "One probability per class; identify class 1 using classes_, not an assumed column order."], ["Row identity", "The action and observed label must refer to the same customer."]],
    math: "For each validation fold, training and validation IDs must be disjoint. Fit a new scaler and estimator using that fold's training rows only. A two-class probability array has n rows and two class columns. Selecting the class-1 column yields n probabilities; thresholding yields n actions. Equal array lengths alone do not prove row alignment.",
    python: "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression(C=1))\nmodel.fit(features_train, targets_train)\nprobabilities = model.predict_proba(features_development)\nclasses = model.steps[-1][1].classes_\npositive_column = list(classes).index(1)\np_churn = probabilities[:, positive_column]",
    code: "The feature and target arrays are supplied datasets with matching customer IDs. fit learns the scaler and estimator from training rows. predict_proba applies saved state to development inputs. steps[-1][1] accesses the fitted classifier; classes_ names its columns. The colon in [:, positive_column] selects every row from the named class column. For cross-validation, pass the whole unfitted pipeline so each fold fits its own steps, as shown below.",
    recap: "Verify prediction time, fit provenance and row identity. Good scores cannot repair leakage.",
  },
  {
    outcome: "Explain why equal accuracy does not establish equal probability quality or future reliability.",
    context: "Two reports for the same eight development customers both claim 75% accuracy at threshold 0.5. The team wants to know whether that makes their probabilities equally useful. It also needs to understand what the small observed sample cannot establish.",
    intuition: "A decision remembers only which side of the threshold a probability falls on. It loses the confidence information. Compare probability quality separately, and do not turn a small-sample result into a promise about future customers.",
    case: "Compare the existing moderate and cautious probability sets on the same observed labels. The threshold and error costs stay fixed. This changes the supplied probability set, not a single fitted coefficient.",
    before: "LG-E2.moderate.t0.5.fn1", after: "LG-E2.cautious.t0.5.fn1", lab: 1,
    fixed: "Same eight customer IDs, observed labels and threshold 0.5. Compare two saved probability sets. No model is fitted here.",
    question: "Must the two probability sets have equal log loss because their actions and accuracy agree?",
    choices: ["Yes: all scores are probabilities", "No: the probabilities can differ despite identical actions", "Yes: accuracy fully describes probabilities", "Not sure"], correct: 1,
    mechanism: "Both sets make the same actions and have 75% accuracy. Moderate probabilities have log loss about 0.514347; cautious probabilities have about 0.631825. The moderate set is better on this observed loss, but that alone does not certify calibration, fairness or future performance. The labels in these examples are fictional, not validated production outcomes.",
    equation: "Same thresholded actions does not imply the same probabilities or the same log loss",
    symbols: [["Accuracy", "Fraction of these rows whose predicted class matches the observed class."], ["Log loss", "Average penalty for the probability assigned to each observed outcome."], ["Calibration", "Agreement between predicted probability and observed event frequency across suitable groups of cases."], ["Population shift", "Future customers or conditions differ from those used to develop and evaluate the model."]],
    math: "The same ordering can also survive a change in confidence. Ranking, probability quality and thresholded decisions answer different questions. Report sample sizes, class meaning and error consequences. A subgroup with only a few examples cannot establish reliable subgroup behavior. A coefficient is a conditional association, not evidence that an intervention will cause a particular outcome.",
    python: "from sklearn.metrics import accuracy_score, log_loss\n\nmoderate_probabilities = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9]\ncautious_probabilities = [0.4, 0.45, 0.46, 0.48, 0.5, 0.51, 0.55, 0.6]\nobserved = [0, 0, 0, 0, 0, 1, 0, 1]\n\nfor probabilities in [moderate_probabilities, cautious_probabilities]:\n    actions = [int(p >= 0.5) for p in probabilities]\n    print(accuracy_score(observed, actions))\n    print(log_loss(observed, probabilities, labels=[0, 1]))\n# accuracy: 0.75 for both\n# log loss: approximately 0.514347 and 0.631825",
    code: "The loop applies the same threshold and metrics to each supplied list, in matching customer order. The lists and observed labels above are the same saved eight-row fixtures as the experiment. accuracy_score sees actions; log_loss sees probabilities. This comparison evaluates saved outputs, not a new training run or a guarantee about future risk.",
    recap: "Report what each metric measures, the data it describes and the claims it cannot support. Equal accuracy is not equal probability quality.",
  },
] as const;

export function referencePair(lesson: number) {
  const guide = GUIDES[lesson];
  return { before: configFor(guide.lab, guide.before), after: configFor(guide.lab, guide.after) };
}
function summary(lesson: number, after: boolean) {
  const pair = referencePair(lesson), c = after ? pair.after : pair.before, e = c.expected;
  if (lesson === 0) return `Coefficient ${c.controls.coefficient}; score ${Number(e.score).toFixed(6)}; probability ${(100 * Number(e.probability_float64)).toFixed(0)}%; contact at 0.5: yes.`;
  if (lesson === 1) return `Probability ${(100 * Number(e.probability_float64)).toFixed(0)}%; observed label 1; row log loss ${Number(e.stable_mathematical_loss_from_finite_logit).toFixed(6)}.`;
  if (lesson === 3) return `C = ${c.controls.C}; first coefficient ${Number((e.coefficients as number[])[0]).toFixed(6)}; customer probability ${(100 * Number(e.query_probability)).toFixed(2)}%; development log loss ${Number((e.development_metrics as Record<string, unknown>).mathematical_log_loss).toFixed(6)}.`;
  const m = e.metrics as Record<string, number>;
  if (lesson === 2) return `Threshold ${c.controls.threshold}; contacts ${m.tp + m.fp}; true positives ${m.tp}; false positives ${m.fp}; false negatives ${m.fn}.`;
  if (lesson === 4) return `Accuracy ${(100 * m.accuracy).toFixed(0)}%; evaluation boundary ${e.selection_valid ? "valid" : "invalid"}.`;
  return `Accuracy ${(100 * m.accuracy).toFixed(0)}%; log loss ${Number(m.mathematical_log_loss).toFixed(6)}.`;
}
export function LessonGuide({ lesson }: { lesson: number }) {
  const guide = GUIDES[lesson], [prediction, setPrediction] = useState(""), [revealed, setRevealed] = useState(false), [review, setReview] = useState(false);
  const result = useRef<HTMLHeadingElement>(null);
  const pair = referencePair(lesson);
  return <>
    <section id="lesson-context" className={styles.card}><h2>Problem and motivation</h2><p>{guide.context}</p><h3>Build the intuition</h3><p>{guide.intuition}</p><ol className={styles.flow} aria-label="Prediction workflow"><li><strong>Score</strong><span>Combine signals and settings</span></li><li><strong>Probability</strong><span>Estimate the chance of leaves</span></li><li><strong>Action</strong><span>Apply a separate threshold</span></li></ol></section>
    <nav className={styles.sectionNav} aria-label="In this lesson"><a href="#experiment">Experiment</a><a href="#lesson-mathematics" onClick={() => setReview(true)}>Mathematics</a><a href="#lesson-python" onClick={() => setReview(true)}>Python</a><a href="#lesson-practice">Practice</a></nav>
    <section id="experiment" className={styles.card} role="group" aria-label="Prediction and experiment"><p className="eyebrow">Discover before calculating</p><h2>Guided experiment</h2><p>{guide.case}</p><aside className={styles.fixed}><strong>Keep the comparison controlled</strong><p>{guide.fixed}</p></aside><p><strong>Starting observation:</strong> {summary(lesson, false)}</p><fieldset><legend>{guide.question}</legend>{guide.choices.map((choice, i) => <label className={styles.choice} key={choice}><input type="radio" name={`discovery-${lesson}`} value={i} checked={prediction === String(i)} disabled={revealed} onChange={event => setPrediction(event.target.value)}/>{choice}</label>)}</fieldset><button disabled={prediction === "" || revealed} onClick={() => { setRevealed(true); requestAnimationFrame(() => result.current?.focus()); }}>Try the comparison</button>{revealed && <div className={styles.result}><h3 ref={result} tabIndex={-1}>What actually changed?</h3><dl><dt>Before</dt><dd>{summary(lesson, false)}</dd><dt>After</dt><dd>{summary(lesson, true)}</dd></dl><p role="status">{prediction === "3" ? "You chose Not sure. Use the observed comparison to build an explanation." : Number(prediction) === guide.correct ? "Your prediction matches this outcome. Now explain the mechanism; the match alone does not demonstrate understanding." : "The observed comparison differs from your prediction. Compare what changed with what stayed fixed."}</p><h3>Why this happened</h3><p>{guide.mechanism}</p><a href="#lesson-mathematics">Connect this discovery to mathematics ↓</a></div>}<button className={styles.secondary} onClick={() => { setPrediction(""); setRevealed(false); setReview(false); }}>Replay guided comparison</button><button className={styles.secondary} onClick={() => setReview(true)}>Review mathematics and Python</button><p className={styles.note}>This guided comparison replays verified reference values. It does not train a model or change saved lesson evidence. The required practice and explained exploration remain below.</p></section>
    {(revealed || review) && <><section id="lesson-mathematics" className={styles.card}><p className="eyebrow">Name the relationship</p><h2>Mathematics and symbols</h2><p>Try the comparison first, then use the notation to describe what you observed. You can return here at any time.</p><p className={styles.equation}>{guide.equation}</p><dl className={styles.symbols}>{guide.symbols.map(([symbol, meaning]) => <div key={symbol}><dt>{symbol}</dt><dd>{meaning}</dd></div>)}</dl><p>{guide.math}</p></section>
    <section id="lesson-python" className={styles.card}><p className="eyebrow">Translate the same idea</p><h2>From mathematics to Python</h2><pre tabIndex={0}><code>{guide.python}</code></pre><p>{guide.code}</p></section>
    <aside className={styles.fixed}><h3>What to take forward</h3><p>{guide.recap}</p></aside><ContentBridge key={lesson} lesson={lesson}/></>}
  </>;
}
