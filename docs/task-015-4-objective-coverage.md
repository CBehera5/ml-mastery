# Task015.4 — objective and independent assessment coverage

17 October2026. All24 essential families map to their lesson's conceptual explanation, numerical/changed-condition example, practice, independent checks and targeted remediation. Exact approved lesson boundaries/O2 ownership are preserved.

|Objective|Teaching and remediation|Practice|Independent|Critical|
|---|---|---|---|---|
|LG01.O1: Compute a linear logit and sigmoid|/supervised/logistic/lg01; worked contrast and objective-specific correction|LG01.O1.practice.A/B|LG01.O1.assessment.A/B/C|No|
|LG01.O2: Distinguish fit, probability prediction and threshold decision|/supervised/logistic/lg01; worked contrast and objective-specific correction|LG01.O2.practice.A/B|LG01.O2.assessment.A/B/C|Both decision AND reason|
|LG01.O3: Interpret coefficient direction in log-odds|/supervised/logistic/lg01; worked contrast and objective-specific correction|LG01.O3.practice.A/B|LG01.O3.assessment.A/B/C|No|
|LG01.O4: Identify malformed output shapes|/supervised/logistic/lg01; worked contrast and objective-specific correction|LG01.O4.practice.A/B|LG01.O4.assessment.A/B/C|No|
|LG02.O1: Calculate a binary log-loss term|/supervised/logistic/lg02; worked contrast and objective-specific correction|LG02.O1.practice.A/B|LG02.O1.assessment.A/B/C|No|
|LG02.O2: Explain why fitting uses training labels, not test labels|/supervised/logistic/lg02; worked contrast and objective-specific correction|LG02.O2.practice.A/B|LG02.O2.assessment.A/B/C|Both decision AND reason|
|LG02.O3: Predict a tiny gradient direction|/supervised/logistic/lg02; worked contrast and objective-specific correction|LG02.O3.practice.A/B|LG02.O3.assessment.A/B/C|No|
|LG02.O4: Compare log loss with hard-label error|/supervised/logistic/lg02; worked contrast and objective-specific correction|LG02.O4.practice.A/B|LG02.O4.assessment.A/B/C|No|
|LG03.O1: Build labels from fixed probabilities|/supervised/logistic/lg03; worked contrast and objective-specific correction|LG03.O1.practice.A/B|LG03.O1.assessment.A/B/C|No|
|LG03.O2: Select a development threshold without retraining or test permission|/supervised/logistic/lg03; worked contrast and objective-specific correction|LG03.O2.practice.A/B|LG03.O2.assessment.A/B/C|Both decision AND reason|
|LG03.O3: Compute confusion counts|/supervised/logistic/lg03; worked contrast and objective-specific correction|LG03.O3.practice.A/B|LG03.O3.assessment.A/B/C|No|
|LG03.O4: Explain positive class and prevalence|/supervised/logistic/lg03; worked contrast and objective-specific correction|LG03.O4.practice.A/B|LG03.O4.assessment.A/B/C|No|
|LG04.O1: Relate a boundary to feature scaling|/supervised/logistic/lg04; worked contrast and objective-specific correction|LG04.O1.practice.A/B|LG04.O1.assessment.A/B/C|No|
|LG04.O2: Explain inverse C and reject unsupported solver/penalty tuples|/supervised/logistic/lg04; worked contrast and objective-specific correction|LG04.O2.practice.A/B|LG04.O2.assessment.A/B/C|Both decision AND reason|
|LG04.O3: Compare linear boundaries with curved data|/supervised/logistic/lg04; worked contrast and objective-specific correction|LG04.O3.practice.A/B|LG04.O3.assessment.A/B/C|No|
|LG04.O4: Diagnose separation and instability|/supervised/logistic/lg04; worked contrast and objective-specific correction|LG04.O4.practice.A/B|LG04.O4.assessment.A/B/C|No|
|LG05.O1: Read fit and predict_proba outputs|/supervised/logistic/lg05; worked contrast and objective-specific correction|LG05.O1.practice.A/B|LG05.O1.assessment.A/B/C|No|
|LG05.O2: Reject target-derived and globally fitted leakage|/supervised/logistic/lg05; worked contrast and objective-specific correction|LG05.O2.practice.A/B|LG05.O2.assessment.A/B/C|Both decision AND reason|
|LG05.O3: Repair a pipeline and aligned labels|/supervised/logistic/lg05; worked contrast and objective-specific correction|LG05.O3.practice.A/B|LG05.O3.assessment.A/B/C|No|
|LG05.O4: Compare baseline and Logistic on identical rows|/supervised/logistic/lg05; worked contrast and objective-specific correction|LG05.O4.practice.A/B|LG05.O4.assessment.A/B/C|No|
|LG06.O1: Interpret error consequences and subgroup limits|/supervised/logistic/lg06; worked contrast and objective-specific correction|LG06.O1.practice.A/B|LG06.O1.assessment.A/B/C|No|
|LG06.O2: Reject causal or guaranteed-risk probability claims|/supervised/logistic/lg06; worked contrast and objective-specific correction|LG06.O2.practice.A/B|LG06.O2.assessment.A/B/C|Both decision AND reason|
|LG06.O3: Compare supplied alternative candidates|/supervised/logistic/lg06; worked contrast and objective-specific correction|LG06.O3.practice.A/B|LG06.O3.assessment.A/B/C|No|
|LG06.O4: Report calibration, shift and boundary limits|/supervised/logistic/lg06; worked contrast and objective-specific correction|LG06.O4.practice.A/B|LG06.O4.assessment.A/B/C|No|

Totals48 practice and72 independent; each independent form contains all24 objectives exactly once. LG02.O1 remains noncritical; LG02.O2 is paired critical. LG01.O3 distinguishes changing a feature with coefficient1 from changing a coefficient; LG01.O4 explicitly rejects a malformed raw(n,) predict_proba output, while allowing an(n,) vector after selecting the positive column.

LG-E1 serves LG01,02,04; LG-E2 serves LG03,05,06. Shared experiment credit never replaces each lesson's four practice families and own transfer.20/24 plus all gates in one confirmed attempt; no practice/notebook/experiment mastery.

Tests cover19/24 failure and20/24 success on each form;36 otherwise-passing23/24 critical-component failures; no mosaics, valid equivalents/malformed input, retries, remediation and retained earlier mastery. All120 authored instances are trusted-Python checked; all61 frozen experiment states regenerate byte-identically. See [completion](TASK_015_4_COMPLETION.md).
