"""Emit teaching/fixture patches only; initial scaffold is not regenerated after review."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "python"))
from mlmath.naive_bayes_reference import catalog

FILES = {}
BASE = ROOT / "apps/web/app/supervised/knn"
DEST = "apps/web/app/supervised/naive-bayes/"


def cloned(name):
    return (BASE/name).read_text().replace("K-Nearest Neighbors", "Naive Bayes").replace("KNN", "NaiveBayes").replace("knn", "naive-bayes").replace("KN0", "NB0")


for name in ["model.ts", "page.tsx", "[lesson]/page.tsx", "mastery/page.tsx"]:
    FILES[DEST+name] = cloned(name)
FILES[DEST+"authored.json"] = json.dumps(catalog(),ensure_ascii=False,separators=(",",":"))+"\n"

catalog_source = cloned("catalog.ts")
catalog_source = catalog_source.replace("kn-e1", "nb-e1").replace("kn-e2", "nb-e2")
start = catalog_source.index("type RawState")
end = catalog_source.index("export const configurations",start)
catalog_source = catalog_source[:start]+'''export const LABS: readonly Manifest[] = freeze([first, second].map(manifest => ({
  id: manifest.id, initial_configuration: manifest.configurations[0].id, fixtures: manifest.fixtures,
  configurations: manifest.configurations.map(config => ({
    id: config.id, fixture: config.fixture_id, controls: config.controls,
    prediction_question: manifest.learning_question,
    expected: { ...config.expected, reason: config.correct_reason_id },
    why: `${config.explanation} Counterexample: ${config.counterexample}`
  }))
})));
''' + catalog_source[end:]
catalog_source = catalog_source.replace('freeze(["Class0 — stays", "Class1 — churns", "Reject this configuration"])','freeze([...first.prediction_options])')
catalog_source = catalog_source.replace('freeze(["distance-selects-labels-vote", "rejection-boundary", "training-accuracy-guarantees-risk", "labels-define-distance"])','freeze(first.reason_options.map(option => option.id))')
catalog_source = catalog_source.replace('length === 34','length === 26').replace('length === 27','length === 30').replace('VERIFICATION_RELEASED = true','VERIFICATION_RELEASED = false')
FILES[DEST+"catalog.ts"] = catalog_source

learning=cloned("learning.tsx")
start=learning.index("function Graphic(");end=learning.index("export function Lab(",start)
learning=learning[:start]+'''function Graphic({ config }: { lab:number; config:Config }) {
 const expected=config.expected;
 if(expected.status==="rejected"||expected.status==="undefined") return <p>{expected.status==="rejected"?"Rejected configuration":"Undefined posterior"}: {String(expected.reason === "boundary" ? (expected.status==="undefined" ? "all-class-evidence-zero" : config.why) : expected.reason)}. No class prediction exists; this is not class0 or a uniform posterior.</p>;
 const posterior=expected.posterior_float64 as number[];
 return <><p>Class0=Good; class1=Needs Improvement. Predicted class {String(expected.prediction)}. Posterior float64 ≈[{posterior.map(value=>value.toPrecision(6)).join(", ")}]. This is a model probability,not proof of calibration or causality.</p><svg viewBox="0 0 400 120" aria-hidden="true" style={{width:"100%"}}>{posterior.map((value,index)=><g key={index}><text x="10" y={30+index*50} fill="currentColor">Class{index}</text><rect x="90" y={15+index*50} width={280*value} height="20" fill="none" stroke="currentColor"/><text x="90" y={50+index*50} fill="currentColor">≈{value.toPrecision(6)}</text></g>)}</svg><table><caption>Class priors,log scores and normalized posteriors</caption><thead><tr><th>Class</th><th>Prior</th><th>Log score ≈</th><th>Posterior ≈</th></tr></thead><tbody>{posterior.map((value,index)=><tr key={index}><th>{index===0?"Good":"Needs Improvement"}</th><td>{(expected.priors as number[])[index]}</td><td><Values value={(expected.log_class_scores as unknown[])[index]} label="Log score"/></td><td>{value.toPrecision(6)}</td></tr>)}</tbody></table><p>Full token likelihoods or Gaussian density/variance contributions are provided below. A Gaussian density is not point probability and may exceed1; a rounded float0 may be underflow,not mathematical impossibility. Read finite log values and explicit tags.</p></>;
}
''' + learning[end:]
learning=learning.replace('Four lessons connect distances, neighbor votes, scaling, k selection and honest unseen-data evaluation. Classification votes are not numeric-target regression or causal guarantees.','Four lessons connect priors, token likelihoods, Gaussian densities, conditional independence and honest evaluation. Count and continuous likelihood models are separate; confidence is not automatically calibrated risk.')
learning=learning.replace('NaiveBayes and comparison','Naive Bayes and comparison').replace('Independent NaiveBayes assessment','Independent Naive Bayes assessment').replace('title="NaiveBayes"','title="Naive Bayes"').replace('status="NaiveBayes"','status="Naive Bayes"')
learning=learning.replace('Neighbors, votes and k','Priors, word evidence and smoothing').replace('Units, dimensions and evaluation','Gaussian evidence and confidence')
learning=learning.replace('Only the34 KN-E1 or27 KN-E2','Only the26 NB-E1 or30 NB-E2')
learning=learning.replace('const reason = String(config.expected.reason), reasons = ["training-accuracy-guarantees-risk", reason, "labels-define-distance"];','const reason = String(config.expected.reason), reasons = ["normalize", "boundary", "causal"];')
learning=learning.replace('<option value="distance-selects-labels-vote">Feature distance selects neighbors; labels and weights determine the class vote.</option><option value="rejection-boundary">A permission or ambiguous membership boundary requires rejection.</option><option value="labels-define-distance">Query outcomes determine feature distances.</option>', '<option value="normalize">Normalize class-conditional evidence using the declared prior and representation.</option><option value="boundary">Invalid representation,variance,provenance or zero evidence prevents a defined prediction.</option><option value="causal">Accuracy proves causal effects and calibrated confidence.</option>')
learning=learning.replace('id === reason ? config.why : id === "training-accuracy-guarantees-risk" ? "A good training score permits using test information and guarantees future risk." : "Query outcome labels determine feature distances and neighbor membership."','id === "normalize" ? "Normalize class-conditional evidence using the declared prior and representation." : id === "boundary" ? "Invalid representation,variance,provenance or zero evidence prevents a defined prediction." : "Accuracy proves causal effects and calibrated confidence."')
learning=learning.replace('<Values value={config.expected} label="Numerical and textual result"/>','<details><summary>Read all frozen likelihood,variance and log contributions</summary><Values value={config.expected} label="Numerical and textual result"/></details>')
learning=learning.replace(' · <Link href="/math/linear-algebra">Vectors and distance recall</Link>',' · <Link href="/math/probability">Conditional probability and Bayes recall</Link>')
FILES[DEST+"learning.tsx"]=learning

lessons=[
 dict(slug="nb01",title="Combine class evidence",lab=0,
 why="A documentation review team needs to prioritize likely Needs Improvement documents before human review. Familiar words supply evidence,but their meaning depends on how common each class was before seeing this document. Use fictional labels here,not LLM scores as ground truth.",
 intuition="Imagine two class baskets. Start with prior weights,then multiply each by how compatible the evidence is with that class. Normalize the remaining support. The same token can lead to different posteriors under different priors; association is not an intervention.",
 worked="P(Good)=.6,P(Needs Improvement)=.4; likelihoods of this evidence are.5 and.25. Scores are.30 and.10. Their sum.40 gives posterior Good=.75 and Needs Improvement=.25. The likelihood.5 is not the posterior.75.",
 changed="With priors[.2,.8] and the same likelihoods,scores are.10,.20,so Good posterior becomes1/3. Duplicating the same signal does not create independent information. Given-class factorization is a simplifying assumption,not a fact proved by overall word independence or high training accuracy.",
 math="For class c and evidence x,score_c=P(c)*P(x|c),posterior=score_c/sum_d(score_d). Under the NB assumption,feature/token contributions factor conditional on c. Log score=log prior+sum feature log likelihoods; normalize with stable log-sum-exp. All-class zero evidence is undefined,not a uniform distribution; an exact zero prior is different from float underflow.",
 python="from sklearn.naive_bayes import MultinomialNB\nmodel = MultinomialNB(alpha=1, force_alpha=True)\nmodel.fit(counts_train, labels_train)\nprobabilities = model.predict_proba(counts_dev)\nlog_probabilities = model.predict_log_proba(counts_dev)",
 comparison="Recall Logistic's linear logit and EV's distinction between decision accuracy and probability quality. NB constructs a posterior from class-conditioned likelihood assumptions; neither model proves a token causes quality. Churn could use its own features/labels; continuous house prices require regression,not this classifier.",
 objectives=["Compute normalized posterior from supplied likelihoods","Explain conditional independence given class,not independence of all features","Distinguish prior,likelihood and posterior","Use log-score addition to avoid tiny products"],
 notes=["Multiply prior and likelihood first,then normalize across all classes. Supplied arithmetic cases are not fictitious fitted estimators.","The assumption concerns evidence conditional on class. Fixed-total token count coordinates need not be unconditionally independent; repeated signals may double-count support.","Prior=P(class),likelihood=P(evidence|class),posterior=P(class|evidence). Reversing conditioning without Bayes normalization is a misconception.","Add logs instead of multiplying tiny probabilities,then subtract log-sum-exp. Log score is not already normalized posterior. Tags distinguish mathematical zeros from numerical underflow."],
 transfer="Normalize class-conditional evidence with the prior,distinguish likelihood from posterior and do not treat assumed independence as causality."),
 dict(slug="nb02",title="Counts and smoothing",lab=0,
 why="A word absent from a small class sample can otherwise eliminate that class for every document containing it. Smoothing prevents a finite count absence from being mistaken for impossible language,but it does not repair leaked vocabulary or invalid negative counts.",
 intuition="Add a small declared count to each vocabulary slot before normalizing. The vocabulary size matters because every slot receives alpha. Count how often tokens occur,not merely how many documents contain them,and learn feature names from training documents only.",
 worked="For class token counts[2,0],alpha1 and vocabulary size2,smoothed likelihoods are[3/4,1/4]. The denominator is2+1*2=4. If there are3 Good and2 Needs Improvement documents,the Good prior is3/5 regardless of how many tokens each class has.",
 changed="The frozen training vocabulary is[clear,error,example]. A held-out unknown token is ignored and counted as unknown by the authored encoder. An unknown-only document has empty known evidence and retains the prior with positive alpha. That is not the same as known tokens jointly impossible in every unsmoothed class. At alpha0,the local library can produce NaN even on an empty vector because0 times negative infinity appears in its dense dot.",
 math="theta_cj=(N_cj+alpha)/(sum_j N_cj+alpha*V):N_cj counts token j occurrences in class c;V is the fixed training vocabulary size. Repeated query count x_j contributes x_j*log(theta_cj). Empirical class priors use document counts instead. Alpha.5,1,2 are the frozen positive choices; alpha0 degeneracy is a rejection diagnostic,not a NaN-derived class decision.",
 python="vocabulary = sorted({token for document in documents_train for token in document})\ncounts_train = [[document.count(token) for token in vocabulary] for document in documents_train]\ncounts_dev = [[document.count(token) for token in vocabulary] for document in documents_dev]\nmodel = MultinomialNB(alpha=1, force_alpha=True).fit(counts_train, labels_train)",
 comparison="Smoothing controls missing class-token evidence,not calibration or causal validity. Negative continuous measurements may be valid Gaussian signals,but are not nonnegative token counts. The notebook uses small trusted pretokenized data,no arbitrary text ingestion or uploads.",
 objectives=["Calculate smoothed word likelihood","Reject negative count inputs or held-out vocabulary fitting with a reason","Predict effect of a zero-count term","Compare class prior and count normalization"],
 notes=["Apply alpha to the numerator and every vocabulary slot in the denominator. This arithmetic is essential but noncritical; do not invent an extra mandatory gate.","Negative counts are invalid. Learn vocabulary from training only and separately within each CV training fold; a globally learned feature dictionary leaks held-out information even without labels.","Absent count is not impossible language. Positive smoothing and an ignored unknown token are distinct operations. All-zero evidence scores imply undefined normalization,not automatic uniformity.","Class prior uses numbers of documents; token likelihood uses occurrences within each class. Equal document priors can coexist with very different token totals."],
 transfer="Preserve nonnegative token semantics and training/fold-only vocabulary provenance; use the declared smoothing denominator without conflating documents and token totals."),
 dict(slug="nb03",title="Continuous likelihoods",lab=1,
 why="Not every ML feature is a word count. A centered document-structure measurement can be negative and still be meaningful. GaussianNB models a separate continuous class-conditional density; forcing it into a count model discards the statistical meaning.",
 intuition="Draw one density curve per class and feature. Read the curve height at the observed value,combine class-conditioned support and normalize. Narrow curves can be taller than1. Repeating the same feature may exaggerate confidence because the model treats the copied signal as another contribution.",
 worked="Supplied densities.5 and.25 with priors.6 and.4 again give scores.30,.10 and posterior.75,.25. At x=mean0,variance1,the Gaussian density is1/sqrt(2*pi)≈.398942. This is density,not probability of observing exactly0. A variance.01 curve has peak≈3.989423,which is valid.",
 changed="Frozen Gaussian full fits use population class variances plus epsilon=var_smoothing*max(global training feature variance). For global variances[4,1] and smoothing.001,epsilon=.004 is added to every class/feature variance. Class-constant rows0,0,2,2 can be rescued by positive global variance; globally constant rows1,1,1,1 still give epsilon0 and reject. Duplicating the first signal can worsen confidence in a wrong class without changing the predicted label.",
 math="log density=−.5*log(2*pi*v)−(x−mu)^2/(2*v),where mu is the class mean and v the positive effective population variance. Sum feature log densities with log prior and normalize. Density may exceed1. Var_smoothing uses global training variance,not sample variance or query statistics. Extreme query products can underflow while finite log posteriors remain meaningful.",
 python="from sklearn.naive_bayes import GaussianNB\ngaussian = GaussianNB(var_smoothing=1e-9)\ngaussian.fit(continuous_train, labels_train)\nprobabilities = gaussian.predict_proba(continuous_dev)\nmeans, effective_variances = gaussian.theta_, gaussian.var_",
 comparison="Use MultinomialNB for the declared nonnegative token representation and GaussianNB for continuous density assumptions,not merely integer versus float dtype. Neither independence nor variance smoothing guarantees calibrated probability or performance under shift.",
 objectives=["Calculate/compare supplied Gaussian likelihoods","Choose Gaussian versus Multinomial assumptions for a feature representation","Diagnose correlated/repeated evidence and overconfidence","Interpret variance smoothing without promising calibration"],
 notes=["A density is not probability mass; multiply by a small interval only for an approximate interval probability. Compare prior-times-density,not density alone.","Signed continuous signals are not token occurrences. An API-accepted shape is not proof that the feature meaning matches the likelihood model.","A copied feature is not independent new evidence. In the frozen wrong-label example,p1 falls from≈.005220 to≈.000058 while the actual class is1; the confident error worsens. This does not establish a universal error law.","The same global epsilon is added to every class/feature variance in this full-fit convention. Positive smoothing can still give epsilon0 on globally constant data; it is not a calibration algorithm."],
 transfer="Choose the likelihood model by representation,interpret density and variance correctly and never treat repeated confidence as independent evidence or certified calibration."),
 dict(slug="nb04",title="Evaluate probabilistic shortcuts",lab=1,
 why="A documentation model is useful only if it helps human reviewers on genuinely unseen documents without pretending that confidence is truth. Its mistakes,costs and population limits matter as much as its accuracy.",
 intuition="Separate the pipeline that learns from training documents from the pipeline that scores new documents. Then inspect both hard decisions and probability errors. Two models can have identical labels but different confidence,just as repeated evidence can increase a wrong model's certainty.",
 worked="In the frozen Gaussian case,the actual class is1 but the base model favors0 with p1≈.005220126. Copying evidence yields p1≈.00005829127; stable label log loss increases from≈5.255234 to≈9.750058. Accuracy for that row is equally wrong in both cases,but probability quality differs. These individual errors are not population calibration estimates.",
 changed="A predicted Needs Improvement on an actual Good document is a false positive and can waste review effort. Predicting Good on an actual Needs Improvement document is a false negative. New documentation styles or label prevalence can shift these costs/rates; a tiny held-out sample cannot guarantee future correctness or establish causation.",
 math="Binary Brier error=(p1−y)^2; label log loss=−log p_y. For finite log posterior,use its stable value even when the float probability underflows to0. Accuracy evaluates hard labels,not calibration. Fit vocabulary and class parameters on each training fold,then infer on held-out rows with saved state; final-test feedback cannot choose alpha,representation or model.",
 python="from sklearn.metrics import accuracy_score, brier_score_loss, log_loss\nlabels_dev_pred = model.predict(counts_dev)\npositive_index = list(model.classes_).index(1)\np_dev = model.predict_proba(counts_dev)[:, positive_index]\nprint(accuracy_score(labels_dev, labels_dev_pred))\nprint(brier_score_loss(labels_dev, p_dev, pos_label=1))\nprint(log_loss(labels_dev, p_dev, labels=[0, 1]))",
 comparison="Compare NB and existing Logistic on identical held-out IDs,target windows,metrics and costs. Library log_loss numerically clips; it is not mathematical endpoint infinity. NB is a useful small-data/count baseline when assumptions are serviceable,but correlated signals,shift and poor likelihood fit can mislead confidence. Churn and documentation need separate feature/label definitions; no new capstone is built here.",
 objectives=["Trace a training-only NB workflow","Reject accuracy-only/calibration/causal conclusions unsupported by evaluation","Compare Logistic/NB under the same split/costs","Explain false-positive/negative examples and distribution shift"],
 notes=["Per-fold vocabulary and class statistics use only fold-training IDs. Align row targets and ensure features exist at prediction time; saved-state prediction does not fit query labels.","Good accuracy does not prove probability calibration,causal effects or guaranteed future risk. Reject the exact unsupported claim and name what evidence is missing.","Match row identities,metric meaning,cost protocol and selection permissions. Use development/CV for comparison,freeze choice before untouched-test evaluation.","Name class1 before interpreting FP/FN. Report class prevalence,uncertainty and shift limitations; more confidence is not evidence of a smaller real-world error rate."],
 transfer="Evaluate on genuinely unseen aligned rows,keep selection inside training/development boundaries and reject accuracy-only,calibration or causal claims unsupported by evidence.")
]
FILES[DEST+"teaching.ts"]="export const LESSONS = "+json.dumps(lessons,ensure_ascii=False,indent=2)+" as const;\n"

print("*** Begin Patch")
for name, text in FILES.items():
    if not name.endswith(("authored.json", "teaching.ts")):
        continue
    if len(sys.argv)>1 and name != DEST+sys.argv[1]:
        continue
    print("*** Add File: "+str(ROOT/name))
    print("".join("+"+line+"\n" for line in text.splitlines()),end="")
print("*** End Patch")
