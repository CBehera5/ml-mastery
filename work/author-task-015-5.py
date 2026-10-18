"""Trusted KNN fixture authoring. Emit authored.json only; never run learner code."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'apps/web/app/supervised'
FILES = {}


def add(path, text):
    FILES[path] = text


def clone(name):
    return (BASE / 'logistic' / name).read_text().replace('Logistic', 'KNN').replace('logistic', 'knn').replace('LG0', 'KN0')


for name in ['model.ts', 'page.tsx', '[lesson]/page.tsx', 'mastery/page.tsx']:
    text = clone(name)
    if name == 'model.ts':
        text = text.replace('!== 24', '!== 16').replace('>= 20', '>= 13')
    add('apps/web/app/supervised/knn/' + name, text)

learning = clone('learning.tsx')
start = learning.index('function Graphic(')
end = learning.index('export function Lab(', start)
learning = learning[:start] + '''function Graphic({ config }: { lab:number; config:Config }) {
 const value=config.expected;
 if(value.outcome)return <p>Rejected configuration: {String((value.outcome as {reason:string}).reason)}. No class prediction exists; rejection is not class0.</p>;
 const distances=value.distances_in_training_order as number[], selected=value.selected_indices as number[], totals=value.class_totals_0_1 as number[];
 const points=value.transformed_rows as number[][], query=value.transformed_query as number[];
 const labels=value.labels as number[];
 const xs=[...points.map(row=>row[0]),query[0]], ys=[...points.map(row=>row[1]??0),query[1]??0];
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const x=(v:number)=>35+(v-minX)/(maxX-minX||1)*320, y=(v:number)=>160-(v-minY)/(maxY-minY||1)*130;
 return <><p>Predicted class {String(value.prediction)}; class0 stays / class1 churns. Vote totals [{totals.join(", ")}]. Vote fractions are not calibrated risk. Plot shows the first two transformed coordinates; all dimensions affect the distances in the table.</p><svg viewBox="0 0 400 200" aria-hidden="true" style={{width:"100%"}}><path d="M30 15V170H380" stroke="currentColor" fill="none"/>{points.map((row,index)=><g key={index}><circle cx={x(row[0])} cy={y(row[1]??0)} r={selected.includes(index)?8:4} fill="none" stroke="currentColor"/><text x={x(row[0])+9} y={y(row[1]??0)} fill="currentColor">{index}:{labels[index]}</text></g>)}<text x={x(query[0])} y={y(query[1]??0)} fill="#ffd47a">Q</text><text x="35" y="195" fill="currentColor">Feature1 → (Q=query, row:class labels)</text></svg><table><caption>Exact neighbor order, distances and votes</caption><thead><tr><th>Row ordinal</th><th>Class</th><th>Distance ≈</th><th>Selected</th><th>Weight ≈</th></tr></thead><tbody>{(value.ordered_indices as number[]).map(index=><tr key={index}><th>{index}</th><td>{labels[index]}</td><td>{distances[index].toPrecision(6)}</td><td>{selected.includes(index)?"yes":"no"}</td><td>{selected.includes(index)?(value.selected_weights as number[])[selected.indexOf(index)].toPrecision(6):"not selected"}</td></tr>)}</tbody></table><p>Distance-table ties use training ordinal for presentation; sklearn's actual tied order is separately recorded. Ambiguous kth membership is rejected, not resolved by this display order.</p></>;
}
''' + learning[end:]
learning = learning.replace('Six lessons connect linear scores, churn probabilities, training log loss, threshold decisions, regularization and honest unseen-data evaluation. A class probability is not a continuous price prediction or a causal guarantee.', 'Four lessons connect distances, neighbor votes, scaling, k selection and honest unseen-data evaluation. Classification votes are not numeric-target regression or causal guarantees.')
learning = learning.replace('20/24','13/16').replace('all six','all four').replace('24 objectives; at least20','16 objectives; at least13').replace('all24','all16').replace('/24','/16').replace('lesson < 5','lesson < 3')
learning = learning.replace('Only the28 KN-E1 or33 KN-E2', 'Only the34 KN-E1 or27 KN-E2')
learning = learning.replace('Scores, probabilities and training','Neighbors, votes and k').replace('Thresholds, probability quality and evaluation','Units, dimensions and evaluation')
learning = learning.replace('"training-accuracy-guarantees-risk", reason, "threshold-change-refits-model"','"training-accuracy-guarantees-risk", reason, "labels-define-distance"')
learning = learning.replace('"Training accuracy guarantees causal probabilities and valid future risk." : "Changing the decision threshold refits model coefficients and probabilities."','"A good training score permits using test information and guarantees future risk." : "Query outcome labels determine feature distances and neighbor membership."')
learning = learning.replace('"threshold-change-refits-model"','"labels-define-distance"')
learning = learning.replace(' · <Link href="/math/derivatives">Derivatives</Link>', ' · <Link href="/python/preparation">Training-only scaling</Link>')
add('apps/web/app/supervised/knn/learning.tsx', learning)

lessons = [
 dict(slug='kn01',title='Vote among neighbors',lab=0,
 why='A churn team wants to predict a new customer from similar past customers. KNN stores labeled training examples rather than learning a coefficient vector. The outcome must be defined before choosing features.',
 intuition='Place the query among labeled points. Measure closeness before looking at the query outcome, select k neighbors, then count their labels. A local majority can disagree with the single nearest observation.',
 worked='Distances 1,2,3 with labels 0,1,1: k1 predicts0, uniform k3 predicts1. For a query (1,1) and row (4,5), distance=sqrt(3²+4²)=5. Label codes are categories: averaging 0,1,1 to .667 is a vote share, not a numeric churn prediction.',
 changed='Two duplicate observations at distance0 have labels0 and1. With distance weighting and k3, only these zero-distance rows vote; their class totals tie1:1 and the frozen convention chooses class0. A near-zero distance is not an exact duplicate. At an ambiguous kth-distance cutoff reject rather than invent a sklearn ordering guarantee.',
 math='For query q and training row x_i, d_i=sqrt(sum_j(x_ij−q_j)²), where j indexes features. Select k smallest distances. Uniform totals sum one per class; inverse-distance totals sum 1/d_i, with the explicit zero-only rule. argmax of class totals chooses the class; equal totals choose label0.',
 python="from sklearn.neighbors import KNeighborsClassifier\nmodel = KNeighborsClassifier(n_neighbors=3, weights='uniform',\n    algorithm='brute', metric='euclidean', n_jobs=1)\nmodel.fit(features_train, labels_train)\nlabels_new = model.predict(features_new)",
 comparison='Logistic fits a linear logit; KNN stores local examples. Neither makes observational labels causal. KNN regression would average numeric targets, but is comparison-only here. Documentation quality would use its separately defined Good/Needs Improvement labels, not churn meanings.',
 objectives=['Calculate distances and ordered neighbors','Derive a vote with explicit tie rules and explain why labels are not averaged as regression','Predict a label from k neighbors','Distinguish stored training examples from prediction queries'],
 notes=['Compute feature differences, squares, sum, square root; then order rows. A near-equal distance remains distinct; display rounding must not change membership.','Both selected membership and voting mechanism matter. Duplicate rows are separate observations, not silently removed. A tied class vote differs from ambiguous kth membership.','Count labels among selected neighbors, not all training rows. The nearest is not necessarily representative.','fit stores permitted feature/label examples; predict uses query features with saved examples, not new labels.'],
 transfer='Select neighbors by feature distance, then apply the declared class-vote and tie rules without averaging label codes as numeric targets.'),
 dict(slug='kn02',title='Scale defines closeness',lab=1,
 why='Currency differences can overwhelm support-contact differences even when contact patterns matter for churn. A distance is meaningful only relative to feature units and the prediction problem.',
 intuition='Scaling stretches coordinate axes. Neighbors can change without any customer changing. Learn those stretches from training data, then keep them fixed for new queries.',
 worked='In raw units, delta=(100 currency,1 contact) gives sqrt(10001)≈100.005. With training scales (100,1), the scaled differences are (1,1), distance=sqrt2≈1.414214. In the frozen fixture query[440,7.8], raw k1 chooses row2/class0; training-scaled k1 chooses row1/class1.',
 changed='Fitting a scaler on all rows before cross-validation leaks held-out feature information even without labels. Refit the whole scaler/classifier pipeline separately inside each fold. An irrelevant badge coordinate can displace a useful neighbor; standardizing does not make an irrelevant feature useful.',
 math='z_j=(x_j−mu_j)/s_j, mu_j and population variance computed from training rows only. A zero-variance training feature uses scale1. Euclidean distance in z-space weights original coordinate differences by 1/s_j. More noisy coordinates can swamp informative local geometry, but no universal finite-data error increase is guaranteed.',
 python="from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nmodel = make_pipeline(StandardScaler(), KNeighborsClassifier(\n    n_neighbors=3, algorithm='brute', metric='euclidean'))\nmodel.fit(features_train, labels_train)\nlabels_dev = model.predict(features_dev)",
 comparison='Logistic coefficients and KNN geometry both depend on representation, but their mechanisms differ. Scaling cannot fix target leakage, mislabeled rows or useless dimensions. Recall NumPy axes, pandas row alignment and training-only preparation rather than repeating those courses.',
 objectives=['Compute scaled two-feature distances','Reject test-fitted scaling and explain metric sensitivity to units','Compare raw/scaled neighbor sets','Diagnose irrelevant high-dimensional features'],
 notes=['Use the same training mean/scale for both points. Subtraction of the shared mean cancels in a distance; division by scale does not.','A valid-looking score does not excuse test-fitted scaling. Separate fold-only fitting from fitting once on the outer training set.','Read raw and transformed coordinates plus selected IDs, not just the plot. Scaling may change neighbors; it need not do so for every query.','A constant coordinate, duplicated informative coordinate and irrelevant varying coordinate are different cases. Extra dimensions can change geometry and increase distance work; this tiny experiment illustrates, not proves, a high-dimensional theorem.'],
 transfer='Fit scaling only on permitted training rows, refit per CV fold and reason about feature units before selecting neighbors.'),
 dict(slug='kn03',title='Choose k honestly',lab=0,
 why='A model that memorizes noisy customer labels can look excellent on training data and fail new customers. Choose neighborhood size by development/CV evidence, not by looking at the final test repeatedly.',
 intuition='Small neighborhoods can follow local noise. Larger ones smooth decisions but may wash out a minority pocket. Compare the same held-out rows and a named metric, not an appealing boundary alone.',
 worked='A query nearest a noisy positive with neighboring labels[1,0,0] predicts1 at k1 and0 at k3. If the unseen outcome is0, the larger neighborhood helps this query; another minority query can be harmed. A fold with four training rows cannot use k5, even if the outer training set has six.',
 changed='Uniform weights give one vote each. At distances[1,2,3], labels[0,1,1], uniform predicts1 but inverse-distance totals are class0=1 versus class1=1/2+1/3≈.833333, predicting0. Lower in-sample error at k1 may use self-neighbors; it is not unseen-data evidence.',
 math='k is the neighborhood count, constrained to an integer1..n_train for each actual fitting fold. Development error averages a declared loss over disjoint query rows. Bias/variance describes behavior across data samples, not a guarantee every finite error curve is monotone. Tune k/weights inside development or CV, freeze selection, then evaluate test once.',
 python="from sklearn.model_selection import StratifiedKFold, cross_val_score\nfolds = StratifiedKFold(3, shuffle=True, random_state=1729)\n# Each candidate must fit the smallest fold-training count.\nscores = cross_val_score(model, features_train, labels_train,\n    cv=folds, scoring='balanced_accuracy', n_jobs=1)",
 comparison='Compare against a DummyClassifier and Logistic on identical held-out IDs and metrics. A good majority accuracy can hide minority failure; a larger k is not automatically safer or fairer.',
 objectives=['Compare finite k train/development results','Reject k exceeding fold-training count or selected using final test','Explain bias/variance behavior without monotonic guarantees','Compare uniform versus distance weighting'],
 notes=['Compare development results on matching rows; training scores and unseen scores answer different questions.','Do not silently clip illegal k or select using final-test feedback. The paired explanation must name both fold capacity and the untouched evaluation boundary.','Small k can be noise-sensitive, large k can miss local patterns. Avoid claiming every larger k improves validation error.','Weighting changes contributions after membership selection. With zero distances, use only zero-distance neighbors under the frozen rule.'],
 transfer='Use legal k in every fold, compare candidates with fold-local preprocessing and keep final-test feedback out of selection.'),
 dict(slug='kn04',title='Workflow and limits',lab=1,
 why='A deployable prediction story needs honest error analysis and inference costs, not just a successful fit call. Local data quality and minority representation can matter more than an attractive average score.',
 intuition='Imagine comparing every incoming customer with stored rows. More rows or dimensions require more work in this brute-force illustration; irrelevant dimensions may redirect the neighborhood toward the wrong examples.',
 worked='Six rows with two features require six distances and12 coordinate differences per brute-force query. Adding a third feature gives18 differences, not a guaranteed measured runtime ratio. Predicting0 for every row in a cohort with nine stays and one churn gives90% accuracy but zero positive recall.',
 changed='A pipeline can still leak if fit on all rows. Restore aligned feature/target identities and fit only training rows. A future cancellation flag is forbidden at the prediction moment. For a shifted population, yesterday’s held-out score is not a guaranteed future rate.',
 math='Accuracy=(TP+TN)/N, positive recall=TP/(TP+FN) when denominator is nonzero. Undefined metrics stay tagged rather than numeric0. Brute-force distance work scales with n*d in this teaching reference; library optimizations may differ. Report metric, classes, split IDs, sample size and limitations together.',
 python="from sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import balanced_accuracy_score\nbaseline = DummyClassifier(strategy='most_frequent').fit(features_train, labels_train)\npredicted = model.predict(features_test)\nprint(balanced_accuracy_score(labels_test, predicted))\n# Selection was frozen before these test labels were inspected.",
 comparison='KNN uses local distances, Logistic a linear logit, SVM a margin-based decision rule. These are mechanism contrasts, not new SVM implementation or universal rankings. Churn and human-reviewed documentation labels need prediction-time features; continuous house prices require a regression target and model.',
 objectives=['Repair a bounded sklearn KNN pipeline','Identify imbalance/distance/query-cost failure and explain its mechanism','Compare Logistic/SVM assumptions','Summarize valid unseen-data performance'],
 notes=['Align row IDs, scaler fit on train, classifier fit on the same train rows, then saved-state prediction on held-out rows. A pipeline object alone is not proof of safe provenance.','Name the concrete failure and why: minority votes overwhelmed, irrelevant coordinates dominate or distance work grows. Generic slogans are insufficient.','Compare local neighbor geometry with a linear logit or margin; do not claim one model is always best or that similarity proves causality.','Use identical evaluation rows and disclose class prevalence, metric and selection boundary. A single tiny split does not certify future or subgroup reliability.'],
 transfer='Explain the actual distance, imbalance or inference-work mechanism and report genuinely held-out evidence without universal performance claims.')
]
add('apps/web/app/supervised/knn/teaching.ts', 'export const LESSONS = '+json.dumps(lessons,ensure_ascii=False,indent=2)+' as const;\n')

families=[]
oracle=[]
for lesson in range(1,5):
 for objective in range(1,5):
  for variant in range(5):
   offset=variant+1
   kind='choice'; expected='safe'; options=[('safe','Use the declared training-only procedure'),('unsafe','Use held-out outcomes or fit on all rows'),('shortcut','A strong training score overrides the boundary')]
   reason='Training evidence and saved-state inference have distinct permissions; a valid-looking result cannot repair leakage.'
   if (lesson,objective)==(1,1):
    kind='number'; expected=5*offset; prompt=f'Query(0,0), training row({3*offset},{4*offset}). Calculate Euclidean distance before ordering neighbors.'; reason='Square coordinate differences, sum, then take the square root; this is a 3-4-5 scaled triangle.'
   elif (lesson,objective)==(1,2):
    prompt=f'At distances[{offset},{offset+1},{offset+2}], classes[0,1,1], uniform k3: choose the correct class-vote interpretation.'; options=[('safe','Predict class1 from two votes; do not average labels as a numeric target'),('unsafe','Predict numeric target 2/3 because classes are measurements'),('shortcut','Predict class0 from the nearest row even at k3')]; reason='Select all three neighbors, then count categorical labels. Two class1 votes beat one class0 vote; a vote share is not numeric-target regression.'
    if variant==2:
     prompt='Two selected rows both distance1,labels0 and1,k2,uniform. What does the declared class-vote tie policy do?'; options=[('safe','Predict class0 from the tied class totals, not numeric target .5'),('unsafe','Predict regression target .5 as the class'),('shortcut','Claim class1 always wins ties')]; reason='Both neighbors are selected; tied class totals choose smallest class0. This is a class-vote tie, not ambiguous kth membership, and label averaging is not classification.'
    elif variant==3:
     prompt='Selected distances[0,0,2],labels[0,1,1],k3,distance weights. How do duplicates affect the prediction?'; options=[('safe','Only exact-zero neighbors vote; totals tie and class0 wins'),('unsafe','Divide by zero and report infinity as a class'),('shortcut','Count the third class1 equally despite distance weighting')]; reason='When selected distances include exact zeros, only zero-distance observations vote equally. Opposing duplicate labels tie; choose class0, not a numeric average target.'
    elif variant==4:
     prompt='Query1 is equidistant from training0/class0 and2/class1,k1. Under the frozen educational cutoff policy, what is allowed?'; options=[('safe','Reject ambiguous kth membership; do not claim sklearn guarantees a stable row-ID winner'),('unsafe','Choose numeric average .5 as the class'),('shortcut','Always choose the first sorted display row and claim sklearn guarantees it')]; reason='A tied cutoff can change included labels under incidental library order. Reject this unsupported membership; presentation sorting is not a prediction guarantee or numeric-target averaging.'
   elif (lesson,objective)==(1,3):
    label=variant%2; prompt=f'For k3, selected labels[{label},{1-label},{label}]. Choose the predicted class code under uniform voting.'; options=[('safe',f'Class{label}'),('unsafe',f'Class{1-label}'),('shortcut','A numeric regression average, not a class')]; reason='The repeated class has two of the three selected votes. Labels are categories.'
   elif (lesson,objective)==(1,4):
    prompt=f'A new customer cohort{offset} supplies query features but no outcomes. What may predict use?'; options=[('safe','Saved training feature/label rows plus new query features'),('unsafe','New customer outcomes to decide which rows are closest'),('shortcut','Refit on test labels before every query')]
   elif (lesson,objective)==(2,1):
    kind='number'; expected=5.; prompt=f'Two raw feature differences are({3*offset},{4*offset}); training scales are({offset},{offset}). Compute scaled Euclidean distance.'; reason='Divide differences by the same training scales: (3,4), so distance5. A shared mean cancels between points.'
   elif (lesson,objective)==(2,2):
    prompt=f'Cohort{offset}: currency and contacts have different units; a scaler was fitted on training+test features before CV. Choose the repair.'; options=[('safe','Refit scaler within each training fold; transform held-out rows with saved parameters'),('unsafe','Keep global scaling because test labels were not used'),('shortcut','Use test means to make future rows representative')]; reason='Units change relative Euclidean contributions. Held-out feature statistics are information too; each fold must fit its own scaler on training IDs.'
   elif (lesson,objective)==(2,3):
    prompt=f'Raw coordinate differences for A=({10*offset},0),B=(0,2); train scales=({10*offset},1). Which neighbors are closest before/after scaling?'; options=[('safe','Raw B is closer; scaled A is closer'),('unsafe','A is closest in both spaces'),('shortcut','Scaling never changes neighbor sets')]; reason='Raw distances are at least10 versus2; scaled distances1 versus2. Units, not labels, changed geometry.'
   elif (lesson,objective)==(2,4):
    prompt=f'Adding {offset} irrelevant varying coordinates changes selected neighbors. What is justified?'; options=[('safe','Irrelevant differences can distort closeness; inspect held-out behavior, not a universal error guarantee'),('unsafe','More dimensions always increase accuracy'),('shortcut','Standardization guarantees irrelevant features become useful')]; reason='Scaling controls units, not relevance. Finite outcomes depend on data; extra coordinates can distract local similarity.'
   elif (lesson,objective)==(3,1):
    prompt=f'Candidate k1: train error0, development error{.2+variant*.02:.2f}; k3: train error.1, development error.1 on identical rows. Which has lower development error?'; options=[('safe','k3 on this development comparison, not a universal guarantee'),('unsafe','k1 because its training error is zero'),('shortcut','Use test error to revise k repeatedly')]; reason='Compare the same held-out rows using the declared metric; training error does not establish generalization.'
   elif (lesson,objective)==(3,2):
    count=4+variant; prompt=f'Smallest CV training fold has{count} rows. Candidate k={count+1} was chosen using final-test scores. Choose the valid response.'; options=[('safe','Reject both illegal fold k and test-based selection; use legal development/CV candidates'),('unsafe','Clip k silently and keep the test-selected winner'),('shortcut','Outer training size makes every fold legal')]; reason='k cannot exceed the actual fold-training count. Test feedback must not select k; pipeline preprocessing also fits separately per fold.'
   elif (lesson,objective)==(3,3):
    prompt=f'After increasing k from1 to{3+2*variant}, what can be claimed about a noisy minority pocket?'; options=[('safe','Smoothing may reduce noise but may erase local minority structure; validation error need not improve monotonically'),('unsafe','Every larger k lowers unseen error'),('shortcut','Bias and variance guarantee every finite error curve')]; reason='Bias/variance concerns repeated data sampling, not a per-query monotonic theorem.'
   elif (lesson,objective)==(3,4):
    prompt=f'Distances[{offset},{2*offset},{3*offset}],labels[0,1,1],k3. Compare uniform and inverse-distance predictions.'; options=[('safe','Uniform predicts1; inverse-distance predicts0'),('unsafe','Both predict1 because weights cannot change votes'),('shortcut','Inverse-distance predicts1 because distant rows count more')]; reason='Uniform totals1:2; inverse totals1/d versus(1/2+1/3)/d. Zero-distance rows would need the separate frozen zero rule.'
   elif (lesson,objective)==(4,1):
    prompt=f'Repair cohort{offset} workflow: aligned rows, then scaler/classifier fitting and held-out prediction. Choose the complete procedure.'; options=[('safe','Align IDs; fit scaler/model on train; predict held-out with saved state'),('unsafe','Fit scaler on all rows then train classifier'),('shortcut','Shuffle target rows independently before fitting')]; reason='Alignment, feature availability and training-only fit provenance all matter; a pipeline object is not proof of safety.'
   elif (lesson,objective)==(4,2):
    count=6+variant; prompt=f'A brute-force KNN query compares {count} rows with3 features; majority votes also overwhelm a rare positive cluster. Choose the supported diagnosis.'; options=[('safe',f'{count} distances/{count*3} coordinate differences; local imbalance can hide positive errors'),('unsafe','Fast fit guarantees cheap inference and majority accuracy proves minority recall'),('shortcut','Irrelevant dimensions cannot affect a distance model')]; reason='Stored-example prediction still compares distances. Majority neighbors can drown a rare class; report its errors rather than trusting average accuracy.'
   elif (lesson,objective)==(4,3):
    prompt=f'On prediction cohort{offset}, compare KNN, Logistic and an SVM conceptually.'; options=[('safe','Local distance votes versus linear logit versus margin reasoning; compare on identical unseen rows'),('unsafe','All three learn the same neighbor vote'),('shortcut','KNN is universally superior because it stores rows')]; reason='Mechanisms differ; evaluation must use comparable rows and metrics, not an algorithm slogan.'
   else:
    prompt=f'Observed cohort{offset}:9 stays and1 churn; all predictions are stays. Which report is honest?'; options=[('safe','Accuracy90%, positive recall0; disclose tiny held-out cohort and frozen selection, no future guarantee'),('unsafe','Accuracy90% means churn recall90%'),('shortcut','A test score permits revising k until100%')]; reason='Nine true negatives and one false negative give accuracy9/10 but recall0/1. Keep test feedback outside selection and disclose sample/shift limits.'
   identity=f'KN0{lesson}.O{objective}'; suffix=['practice.A','practice.B','assessment.A','assessment.B','assessment.C'][variant]
   atoms=[dict(id='decision',kind=kind,label='Decision or calculation')]; answer=dict(kind=kind,**({'value':expected} if kind=='number' else {'optionId':expected}))
   if kind=='choice':
    rotated=options[variant%3:]+options[:variant%3]; atoms[0]['options']=[dict(id=key,label=value) for key,value in rotated]
   accepted=[answer]
   if (lesson,objective)==(1,1):
    prompt+=f' A second row is({6*offset},{8*offset}). Choose the nearest-first order of the two rows A(first), B(second).'
    atoms.append(dict(id='order',kind='choice',label='Nearest-first row order',options=[dict(id='ab',label='A then B'),dict(id='ba',label='B then A'),dict(id='tie',label='Exact distance tie')]))
    accepted.append(dict(kind='choice',optionId='ab'))
   if objective==2:
    atoms.append(dict(id='reason',kind='choice',label='Mechanism and changed-case explanation',options=[dict(id='mechanism',label=reason),dict(id='score',label='Training accuracy alone validates this decision'),dict(id='labels',label='Held-out labels may determine similarity or selection')]))
    reason_options=atoms[-1]['options']; atoms[-1]['options']=reason_options[variant%3:]+reason_options[:variant%3]
    accepted.append(dict(kind='choice',optionId='mechanism'))
   families.append(dict(id=identity+'.'+suffix,objective=identity,critical=objective==2,prompt=prompt,code='',atoms=atoms,accepted=[accepted],explanation=reason,remediation=f'Recall {identity}: {reason} Compare the lesson’s changed case, then attempt a fresh complete form.'))
   oracle.append(dict(id=identity+'.'+suffix,lesson=lesson,objective=objective,variant=variant))
add('apps/web/app/supervised/knn/authored.json',json.dumps(dict(content='supervised.knn.1.0.0',families=families),ensure_ascii=False,indent=2)+'\n')

print('*** Begin Patch')
for path,text in FILES.items():
 if not path.endswith('authored.json'):
  continue
 if len(sys.argv)>1 and not path.endswith(sys.argv[1]):
  continue
 if path.endswith('.json'):
  text=json.dumps(json.loads(text),ensure_ascii=False,separators=(',',':'))+'\n'
 print('*** Add File: '+str(ROOT/path))
 print(''.join('+'+line+'\n' for line in text.splitlines()),end='')
print('*** End Patch')
