"""Emit a self-contained trusted NB notebook; no learner execution service."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
cells = []


def markdown(text):
    cells.append(dict(cell_type="markdown", metadata={}, source=text.splitlines(True)))


def code(text):
    cells.append(dict(cell_type="code", metadata={}, execution_count=None, outputs=[], source=text.splitlines(True)))


markdown("""# Naive Bayes — evidence, assumptions and honest evaluation
ML Mastery — Learn Machine Learning by Doing.

NB01–04: normalize class evidence, token smoothing, continuous densities and evaluation limits. Prerequisites: Probability conditional/Bayes, EV, LG01–03, arrays and training-only preprocessing. Fictional documentation labels:0=Good,1=Needs Improvement. No production annotations or LLM ground truth. Notebook execution never grants mastery.

Accepted local reference profile: Python3.13.16,NumPy2.5.4,pandas3.0.6,Matplotlib3.11.2,scikit-learn1.9.1,SciPy1.18.1;seed1729. All data embedded; no credentials,uploads,remote datasets or paid services. Trusted author code only. Run all cells in a clean kernel. Genuine Colab remains UNVERIFIED.
""")
code("""import json, math
import numpy as np
from scipy.special import logsumexp
from sklearn.naive_bayes import MultinomialNB, GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.dummy import DummyClassifier
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import accuracy_score, brier_score_loss, log_loss
SEED = 1729
np.random.seed(SEED)
""")
markdown("""## Predict before reveal: likelihood is not posterior
Priors[.6,.4],likelihoods[.5,.25]. Predict P(Good|evidence),then change priors to[.2,.8] with likelihoods fixed. Expected Good posteriors:.75 and1/3. Why does the same word evidence lead to a different class decision? Conditional evidence is not a causal intervention.
""")
code("""likelihoods = np.array([.5,.25])
posterior = []
for prior in [[.6,.4],[.2,.8]]:
    scores = np.log(prior)+np.log(likelihoods)
    posterior.append(np.exp(scores-logsumexp(scores)).tolist())
assert np.allclose(posterior, [[.75,.25],[1/3,2/3]])
print('posterior', posterior)
""")
markdown("""## Counts, missing evidence and training vocabulary
Class token counts[2,0],alpha1,V2 produce[.75,.25]. Class priors use document counts,not token totals. In our frozen encoder unknown words are ignored and reported; an unknown-only document has empty known evidence and retains its prior with positive alpha. Alpha0 can create all-zero scores; its library dense-dot NaNs are not class0 predictions. We use positive alpha in the workflow,not an implicit numerical floor.
""")
code("""smoothed = (np.array([2.,0.])+1)/(2+1*2)
assert np.allclose(smoothed,[.75,.25])
example = MultinomialNB(alpha=1,force_alpha=True,class_prior=[.7,.3]).fit([[2,0],[0,2]],[0,1])
assert np.allclose(example.predict_proba([[0,0]])[0],[.7,.3])
print('smoothed',smoothed.tolist(),'empty evidence',example.predict_proba([[0,0]])[0].tolist())
""")
markdown("""## Separate Gaussian representation and repeated evidence
Signed centered continuous signals are not token counts. Gaussian variance is population/ddof0; this full-fit sklearn profile adds epsilon=var_smoothing*max(training-global variance) to each class/feature variance. Density can exceed1. Predict what copying the first feature does to confidence when the actual held-out label contradicts the favored class.

Expected: both models predict0,while the fictional label is1; copied evidence makes stable log loss worse,approximately5.255234→9.750058. This is a small illustrative probability error,not population calibration or a universal correlation theorem. A globally constant dataset still has epsilon0 and invalid densities even under positive smoothing; do not present NaN as a posterior.
""")
code("""continuous_train = np.array([[-3,-2],[-2,-1],[-1,0],[0,-1],[1,0],[2,1]],dtype=float)
continuous_labels = np.array([0,0,0,1,1,1])
continuous_query = np.array([[-1.5,-1]])
gaussian_losses = []
for repeated in [False,True]:
    train = np.column_stack([continuous_train,continuous_train[:,0]]) if repeated else continuous_train
    query = np.column_stack([continuous_query,continuous_query[:,0]]) if repeated else continuous_query
    gaussian = GaussianNB(var_smoothing=1e-9).fit(train,continuous_labels)
    assert np.isclose(gaussian.epsilon_,1e-9*np.var(train,axis=0,ddof=0).max())
    assert gaussian.predict(query)[0] == 0
    gaussian_losses.append(float(-gaussian.predict_log_proba(query)[0,1]))
assert np.allclose(gaussian_losses,[5.255233775302893,9.7500582503109])
assert gaussian_losses[1]>gaussian_losses[0]
print('wrong-label Gaussian log losses',gaussian_losses)
""")
markdown("""## Whole-fold vocabulary/model fitting
Embedded16 fictional documents:8 training,4 development,4 final test. Tokens are preauthored lists,not unrestricted uploaded text. Compare alpha.5/1/2 using only three stratified CV training folds. Each fold learns its own vocabulary and likelihood parameters before encoding its held-out rows. No held-out vocabulary,priors or means are used for fitting. Use log loss for selection; final-test feedback must not choose alpha or model.
""")
code("""documents = [
 ['clear','clear','example'],['clear','example','example'],['clear','clear'],['clear','example','clear'],
 ['error','error','example'],['error','example','example'],['error','error'],['error','example','error'],
 ['clear','example'],['error','example'],['clear','clear','example'],['error','error','example'],
 ['clear','example','clear'],['error','example','error'],['clear','clear'],['error','error']]
targets = np.array([0,0,0,0,1,1,1,1,0,1,0,1,0,1,0,1])
train_ids,dev_ids,test_ids = list(range(8)),list(range(8,12)),list(range(12,16))
assert not set(train_ids)&set(dev_ids+test_ids)
def vocabulary_for(ids):
    return sorted({token for index in ids for token in documents[index]})
def encode(ids,vocabulary):
    return np.array([[documents[index].count(token) for token in vocabulary] for index in ids],dtype=float)
folds = list(StratifiedKFold(3,shuffle=True,random_state=SEED).split(np.zeros(8),targets[train_ids]))
cv_losses = {}
for alpha in [.5,1.,2.]:
    losses = []
    for training,heldout in folds:
        fold_vocabulary = vocabulary_for(training)
        fitted = MultinomialNB(alpha=alpha,force_alpha=True).fit(encode(training,fold_vocabulary),targets[training])
        probabilities = fitted.predict_proba(encode(heldout,fold_vocabulary))
        losses.append(float(log_loss(targets[heldout],probabilities,labels=[0,1])))
    cv_losses[alpha] = float(np.mean(losses))
selected_alpha = min(cv_losses,key=lambda alpha:(cv_losses[alpha],alpha))
vocabulary = vocabulary_for(train_ids)
model = MultinomialNB(alpha=selected_alpha,force_alpha=True).fit(encode(train_ids,vocabulary),targets[train_ids])
logistic = LogisticRegression(C=1,solver='lbfgs',l1_ratio=0.,tol=1e-10,max_iter=2000).fit(encode(train_ids,vocabulary),targets[train_ids])
baseline = DummyClassifier(strategy='prior').fit(encode(train_ids,vocabulary),targets[train_ids])
development = {name:float(log_loss(targets[dev_ids],candidate.predict_proba(encode(dev_ids,vocabulary)),labels=[0,1])) for name,candidate in [('NB',model),('existing Logistic comparison',logistic),('baseline',baseline)]}
test_probabilities = model.predict_proba(encode(test_ids,vocabulary))
test_predictions = model.predict(encode(test_ids,vocabulary))
result = dict(rows=16,folds=3,candidates=3,selected_alpha=selected_alpha,vocabulary=vocabulary,cv_log_loss=cv_losses,development_log_loss=development,test_accuracy=float(accuracy_score(targets[test_ids],test_predictions)),test_brier=float(brier_score_loss(targets[test_ids],test_probabilities[:,1],pos_label=1)),test_log_loss=float(log_loss(targets[test_ids],test_probabilities,labels=[0,1])))
assert result['test_accuracy']==1.0
assert vocabulary==['clear','error','example']
print(json.dumps(result,sort_keys=True))
""")
markdown("""## Evaluate the claim,not just the score
All development comparisons use matching rows and target windows. Logistic uses a predeclared fixed configuration; no new Logistic course is implemented here. Test evaluates the already frozen NB workflow; it does not select the development winner after seeing test labels. FP means a Good document is unnecessarily flagged; FN means a Needs Improvement document is missed. Costs and prevalence matter.

Tiny fictional cohorts do not certify calibration,causal effects,label consistency or future shifted performance. Stable finite-log loss and mathematical endpoint infinity differ from library numerical clipping. Training-only fitting and separately fold-only vocabulary construction are distinct requirements. No notebook,practice or experiment completion awards mastery. Genuine screen-reader,browser zoom and Google Colab checks remain independent obligations.
""")
for index,cell in enumerate(cells):
    cell['id']=f'nb-{index:02d}'
notebook=dict(cells=cells,metadata=dict(kernelspec=dict(display_name='Python 3',language='python',name='python3'),language_info=dict(name='python',version='3.13.16'),reproducibility=dict(seed=1729,data='embedded-fictional-nb-v1',colab='UNVERIFIED',dependency_profile='task013-local-verified')),nbformat=4,nbformat_minor=5)
print('*** Begin Patch\n*** Add File: '+str(ROOT/'apps/web/public/notebooks/supervised-naive-bayes.ipynb'))
print(''.join('+'+line+'\n' for line in json.dumps(notebook,indent=2).splitlines()),end='')
print('*** End Patch')
