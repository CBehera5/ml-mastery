export const LESSONS = [
  {
    "slug": "nb01",
    "title": "Combine class evidence",
    "lab": 0,
    "why": "A documentation review team needs to prioritize likely Needs Improvement documents before human review. Familiar words supply evidence,but their meaning depends on how common each class was before seeing this document. Use fictional labels here,not LLM scores as ground truth.",
    "intuition": "Imagine two class baskets. Start with prior weights,then multiply each by how compatible the evidence is with that class. Normalize the remaining support. The same token can lead to different posteriors under different priors; association is not an intervention.",
    "worked": "P(Good)=.6,P(Needs Improvement)=.4; likelihoods of this evidence are.5 and.25. Scores are.30 and.10. Their sum.40 gives posterior Good=.75 and Needs Improvement=.25. The likelihood.5 is not the posterior.75.",
    "changed": "With priors[.2,.8] and the same likelihoods,scores are.10,.20,so Good posterior becomes1/3. Duplicating the same signal does not create independent information. Given-class factorization is a simplifying assumption,not a fact proved by overall word independence or high training accuracy.",
    "math": "For class c and evidence x,score_c=P(c)*P(x|c),posterior=score_c/sum_d(score_d). Under the NB assumption,feature/token contributions factor conditional on c. Log score=log prior+sum feature log likelihoods; normalize with stable log-sum-exp. All-class zero evidence is undefined,not a uniform distribution; an exact zero prior is different from float underflow.",
    "python": "from sklearn.naive_bayes import MultinomialNB\nmodel = MultinomialNB(alpha=1, force_alpha=True)\nmodel.fit(counts_train, labels_train)\nprobabilities = model.predict_proba(counts_dev)\nlog_probabilities = model.predict_log_proba(counts_dev)",
    "comparison": "Recall Logistic's linear logit and EV's distinction between decision accuracy and probability quality. NB constructs a posterior from class-conditioned likelihood assumptions; neither model proves a token causes quality. Churn could use its own features/labels; continuous house prices require regression,not this classifier.",
    "objectives": [
      "Compute normalized posterior from supplied likelihoods",
      "Explain conditional independence given class,not independence of all features",
      "Distinguish prior,likelihood and posterior",
      "Use log-score addition to avoid tiny products"
    ],
    "notes": [
      "Multiply prior and likelihood first,then normalize across all classes. Supplied arithmetic cases are not fictitious fitted estimators.",
      "The assumption concerns evidence conditional on class. Fixed-total token count coordinates need not be unconditionally independent; repeated signals may double-count support.",
      "Prior=P(class),likelihood=P(evidence|class),posterior=P(class|evidence). Reversing conditioning without Bayes normalization is a misconception.",
      "Add logs instead of multiplying tiny probabilities,then subtract log-sum-exp. Log score is not already normalized posterior. Tags distinguish mathematical zeros from numerical underflow."
    ],
    "transfer": "Normalize class-conditional evidence with the prior,distinguish likelihood from posterior and do not treat assumed independence as causality."
  },
  {
    "slug": "nb02",
    "title": "Counts and smoothing",
    "lab": 0,
    "why": "A word absent from a small class sample can otherwise eliminate that class for every document containing it. Smoothing prevents a finite count absence from being mistaken for impossible language,but it does not repair leaked vocabulary or invalid negative counts.",
    "intuition": "Add a small declared count to each vocabulary slot before normalizing. The vocabulary size matters because every slot receives alpha. Count how often tokens occur,not merely how many documents contain them,and learn feature names from training documents only.",
    "worked": "For class token counts[2,0],alpha1 and vocabulary size2,smoothed likelihoods are[3/4,1/4]. The denominator is2+1*2=4. If there are3 Good and2 Needs Improvement documents,the Good prior is3/5 regardless of how many tokens each class has.",
    "changed": "The frozen training vocabulary is[clear,error,example]. A held-out unknown token is ignored and counted as unknown by the authored encoder. An unknown-only document has empty known evidence and retains the prior with positive alpha. That is not the same as known tokens jointly impossible in every unsmoothed class. At alpha0,the local library can produce NaN even on an empty vector because0 times negative infinity appears in its dense dot.",
    "math": "theta_cj=(N_cj+alpha)/(sum_j N_cj+alpha*V):N_cj counts token j occurrences in class c;V is the fixed training vocabulary size. Repeated query count x_j contributes x_j*log(theta_cj). Empirical class priors use document counts instead. Alpha.5,1,2 are the frozen positive choices; alpha0 degeneracy is a rejection diagnostic,not a NaN-derived class decision.",
    "python": "vocabulary = sorted({token for document in documents_train for token in document})\ncounts_train = [[document.count(token) for token in vocabulary] for document in documents_train]\ncounts_dev = [[document.count(token) for token in vocabulary] for document in documents_dev]\nmodel = MultinomialNB(alpha=1, force_alpha=True).fit(counts_train, labels_train)",
    "comparison": "Smoothing controls missing class-token evidence,not calibration or causal validity. Negative continuous measurements may be valid Gaussian signals,but are not nonnegative token counts. The notebook uses small trusted pretokenized data,no arbitrary text ingestion or uploads.",
    "objectives": [
      "Calculate smoothed word likelihood",
      "Reject negative count inputs or held-out vocabulary fitting with a reason",
      "Predict effect of a zero-count term",
      "Compare class prior and count normalization"
    ],
    "notes": [
      "Apply alpha to the numerator and every vocabulary slot in the denominator. This arithmetic is essential but noncritical; do not invent an extra mandatory gate.",
      "Negative counts are invalid. Learn vocabulary from training only and separately within each CV training fold; a globally learned feature dictionary leaks held-out information even without labels.",
      "Absent count is not impossible language. Positive smoothing and an ignored unknown token are distinct operations. All-zero evidence scores imply undefined normalization,not automatic uniformity.",
      "Class prior uses numbers of documents; token likelihood uses occurrences within each class. Equal document priors can coexist with very different token totals."
    ],
    "transfer": "Preserve nonnegative token semantics and training/fold-only vocabulary provenance; use the declared smoothing denominator without conflating documents and token totals."
  },
  {
    "slug": "nb03",
    "title": "Continuous likelihoods",
    "lab": 1,
    "why": "Not every ML feature is a word count. A centered document-structure measurement can be negative and still be meaningful. GaussianNB models a separate continuous class-conditional density; forcing it into a count model discards the statistical meaning.",
    "intuition": "Draw one density curve per class and feature. Read the curve height at the observed value,combine class-conditioned support and normalize. Narrow curves can be taller than1. Repeating the same feature may exaggerate confidence because the model treats the copied signal as another contribution.",
    "worked": "Supplied densities.5 and.25 with priors.6 and.4 again give scores.30,.10 and posterior.75,.25. At x=mean0,variance1,the Gaussian density is1/sqrt(2*pi)≈.398942. This is density,not probability of observing exactly0. A variance.01 curve has peak≈3.989423,which is valid.",
    "changed": "Frozen Gaussian full fits use population class variances plus epsilon=var_smoothing*max(global training feature variance). For global variances[4,1] and smoothing.001,epsilon=.004 is added to every class/feature variance. Class-constant rows0,0,2,2 can be rescued by positive global variance; globally constant rows1,1,1,1 still give epsilon0 and reject. Duplicating the first signal can worsen confidence in a wrong class without changing the predicted label.",
    "math": "log density=−.5*log(2*pi*v)−(x−mu)^2/(2*v),where mu is the class mean and v the positive effective population variance. Sum feature log densities with log prior and normalize. Density may exceed1. Var_smoothing uses global training variance,not sample variance or query statistics. Extreme query products can underflow while finite log posteriors remain meaningful.",
    "python": "from sklearn.naive_bayes import GaussianNB\ngaussian = GaussianNB(var_smoothing=1e-9)\ngaussian.fit(continuous_train, labels_train)\nprobabilities = gaussian.predict_proba(continuous_dev)\nmeans, effective_variances = gaussian.theta_, gaussian.var_",
    "comparison": "Use MultinomialNB for the declared nonnegative token representation and GaussianNB for continuous density assumptions,not merely integer versus float dtype. Neither independence nor variance smoothing guarantees calibrated probability or performance under shift.",
    "objectives": [
      "Calculate/compare supplied Gaussian likelihoods",
      "Choose Gaussian versus Multinomial assumptions for a feature representation",
      "Diagnose correlated/repeated evidence and overconfidence",
      "Interpret variance smoothing without promising calibration"
    ],
    "notes": [
      "A density is not probability mass; multiply by a small interval only for an approximate interval probability. Compare prior-times-density,not density alone.",
      "Signed continuous signals are not token occurrences. An API-accepted shape is not proof that the feature meaning matches the likelihood model.",
      "A copied feature is not independent new evidence. In the frozen wrong-label example,p1 falls from≈.005220 to≈.000058 while the actual class is1; the confident error worsens. This does not establish a universal error law.",
      "The same global epsilon is added to every class/feature variance in this full-fit convention. Positive smoothing can still give epsilon0 on globally constant data; it is not a calibration algorithm."
    ],
    "transfer": "Choose the likelihood model by representation,interpret density and variance correctly and never treat repeated confidence as independent evidence or certified calibration."
  },
  {
    "slug": "nb04",
    "title": "Evaluate probabilistic shortcuts",
    "lab": 1,
    "why": "A documentation model is useful only if it helps human reviewers on genuinely unseen documents without pretending that confidence is truth. Its mistakes,costs and population limits matter as much as its accuracy.",
    "intuition": "Separate the pipeline that learns from training documents from the pipeline that scores new documents. Then inspect both hard decisions and probability errors. Two models can have identical labels but different confidence,just as repeated evidence can increase a wrong model's certainty.",
    "worked": "In the frozen Gaussian case,the actual class is1 but the base model favors0 with p1≈.005220126. Copying evidence yields p1≈.00005829127; stable label log loss increases from≈5.255234 to≈9.750058. Accuracy for that row is equally wrong in both cases,but probability quality differs. These individual errors are not population calibration estimates.",
    "changed": "A predicted Needs Improvement on an actual Good document is a false positive and can waste review effort. Predicting Good on an actual Needs Improvement document is a false negative. New documentation styles or label prevalence can shift these costs/rates; a tiny held-out sample cannot guarantee future correctness or establish causation.",
    "math": "Binary Brier error=(p1−y)^2; label log loss=−log p_y. For finite log posterior,use its stable value even when the float probability underflows to0. Accuracy evaluates hard labels,not calibration. Fit vocabulary and class parameters on each training fold,then infer on held-out rows with saved state; final-test feedback cannot choose alpha,representation or model.",
    "python": "from sklearn.metrics import accuracy_score, brier_score_loss, log_loss\nlabels_dev_pred = model.predict(counts_dev)\npositive_index = list(model.classes_).index(1)\np_dev = model.predict_proba(counts_dev)[:, positive_index]\nprint(accuracy_score(labels_dev, labels_dev_pred))\nprint(brier_score_loss(labels_dev, p_dev, pos_label=1))\nprint(log_loss(labels_dev, p_dev, labels=[0, 1]))",
    "comparison": "Compare NB and existing Logistic on identical held-out IDs,target windows,metrics and costs. Library log_loss numerically clips; it is not mathematical endpoint infinity. NB is a useful small-data/count baseline when assumptions are serviceable,but correlated signals,shift and poor likelihood fit can mislead confidence. Churn and documentation need separate feature/label definitions; no new capstone is built here.",
    "objectives": [
      "Trace a training-only NB workflow",
      "Reject accuracy-only/calibration/causal conclusions unsupported by evaluation",
      "Compare Logistic/NB under the same split/costs",
      "Explain false-positive/negative examples and distribution shift"
    ],
    "notes": [
      "Per-fold vocabulary and class statistics use only fold-training IDs. Align row targets and ensure features exist at prediction time; saved-state prediction does not fit query labels.",
      "Good accuracy does not prove probability calibration,causal effects or guaranteed future risk. Reject the exact unsupported claim and name what evidence is missing.",
      "Match row identities,metric meaning,cost protocol and selection permissions. Use development/CV for comparison,freeze choice before untouched-test evaluation.",
      "Name class1 before interpreting FP/FN. Report class prevalence,uncertainty and shift limitations; more confidence is not evidence of a smaller real-world error rate."
    ],
    "transfer": "Evaluate on genuinely unseen aligned rows,keep selection inside training/development boundaries and reject accuracy-only,calibration or causal claims unsupported by evidence."
  }
] as const;
