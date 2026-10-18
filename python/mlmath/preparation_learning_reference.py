import hashlib
import json
import re
import warnings
from pathlib import Path

import numpy as np
import pandas as pd
import sklearn

from .pandas_learning_reference import HOUSES, normalize as normalize_table

ROOT = Path(__file__).resolve().parents[2]
AMOUNTS = (1, 2, 3, 4, 5, 7)
IMPORTS = """import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline, make_pipeline
"""
DATA_HASH = hashlib.sha256(json.dumps(HOUSES, sort_keys=True).encode()).hexdigest()


def normalize(value):
    if isinstance(value, np.ndarray):
        return normalize(value.tolist())
    if isinstance(value, dict):
        return {key: normalize(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [normalize(item) for item in value]
    return normalize_table(value)


def authored_case(lesson, objective, amount):
    if type(lesson) is not int or lesson not in range(1, 7) or type(objective) is not int or objective not in range(4) or type(amount) is not int or amount not in AMOUNTS:
        raise ValueError("Only enumerated trusted preparation configurations are supported.")
    offset = amount - 3
    train_ids = [f"H{index:02}" for index in range(1, 13)]
    test_ids = [f"H{index:02}" for index in range(13, 17)]
    if lesson == 1:
        split_ids = train_ids[(amount - 3) % 12:] + train_ids[:(amount - 3) % 12]
        evaluation_entities = ["C1", "C4"] if amount % 2 else ["C4", "C5"]
        cases = [
            (f"train_entities = ['C1', 'C1', 'C2', 'C3']\nevaluation_entities = {evaluation_entities!r}\noverlap = sorted(set(train_entities) & set(evaluation_entities))\nresult = {{'question': 'generalize to unseen customers', 'entity_overlap': overlap, 'valid_customer_boundary': not overlap, 'repair': 'split by customer before learning'}}",
             "The unit of independence is the customer for an unseen-customer claim. Repeated rows from the same customer cannot straddle this boundary. A row-level split or a seed alone cannot establish independence.",
             "Any random row split is valid for new customers, even when their other records were used to fit."),
            (f"train_ids = {train_ids!r}\nvalidation_ids = train_ids[{amount % 4}::4]\nfold_train_ids = [identity for identity in train_ids if identity not in validation_ids]\nresult = {{'fit_ids': fold_train_ids, 'policy_choice_ids': validation_ids, 'final_test_ids': {test_ids!r}, 'test_may_select_policy': False}}",
             "Use development-training rows to fit and validation rows to compare declared policies. The final test is untouched during choice; even unsupervised statistics learned from it leak evaluation information.",
             "It is safe to choose an imputation policy using the final test score because no test target is passed to fit."),
            (f"ids = {split_ids!r}\ntrain, validation = train_test_split(ids, test_size=4, random_state=42, shuffle=True)\nresult = {{'train_ids': train, 'validation_ids': validation, 'seed': 42, 'representative_guarantee': False, 'source_order_revision': {amount}}}",
             "Reproducibility records source order, IDs, split configuration and seed together. Fixed membership does not prove representativeness or remove group/time dependence.",
             "A random_state guarantees representative observations and is sufficient even if source ordering changes."),
            (f"available = ['area', 'age']\nunavailable = ['price', 'future_price', 'after_sale_{amount}']\nresult = {{'prediction_time_features': available, 'excluded': unavailable, 'reason': 'target or observed only after prediction'}}",
             "Feature availability is judged at prediction time, not by correlation. The target and after-sale information cannot be supplied for a genuinely new house.",
             "Any highly predictive future field is legitimate because it improves apparent validation accuracy."),
        ]
        if amount == 7:
            cases[0] = ("train_times = [1, 2, 8]\nvalidation_times = [3, 4]\nresult = {'question': 'forecast future observations', 'train_times': train_times, 'validation_times': validation_times, 'valid_forecast_boundary': max(train_times) < min(validation_times), 'repair': 'fit only on observations available before validation time'}", "For future forecasting, training observations must precede the validation prediction time. A seed or random row split cannot repair access to future information; choose the split unit from the intended use.", "Future observations can train a past forecast as long as the split was randomized.")
    elif lesson == 2:
        test = 1000 + offset * 10
        cases = [
            (f"train = np.array([[10.], [np.nan], [30.]])\ntest = np.array([[{test}.], [np.nan]])\nimputer = SimpleImputer(strategy='median').fit(train)\nleaked = SimpleImputer(strategy='median').fit(np.vstack([train, test]))\nresult = {{'fit_ids': ['H01','H02','H03'], 'training_median': imputer.statistics_, 'test_output': imputer.transform(test), 'invalid_whole_data_median': leaked.statistics_, 'whole_data_fit_allowed': False}}",
             "Fit the median on training rows only: (10+30)/2=20. Transform test rows with20. The whole-data comparator is explicitly invalid even if a particular sample accidentally produces the same statistic.",
             "Unsupervised imputation can inspect every test value before splitting because it does not read targets."),
            (f"train = np.array([[10.], [np.nan], [30.]])\nimputer = SimpleImputer(strategy='median').fit(train)\nresult = {{'saved_statistic': imputer.statistics_, 'changed_test': imputer.transform([[{test}.], [np.nan]]), 'refitted': False}}",
             "The saved20 is applied unchanged to a new missing cell. A changed test extreme can change its own transformed value but not the fitted training statistic.",
             "Each incoming test batch should fit its own median so the transformed batch looks typical."),
            (f"train = np.array([[0.], [np.nan], [{20 + offset}.]])\nimputer = SimpleImputer(strategy='median', add_indicator=True).fit(train)\nresult = {{'training_statistic': imputer.statistics_, 'columns': ['age', 'age_was_missing'], 'prepared': imputer.transform(train), 'assumption': 'median is a declared approximation, not an observed fact'}}",
             "Keep observed zero distinct from absence. A missing indicator records information about absence, but does not prove why it happened; median filling is an assumption that may bias results.",
             "A filled value becomes an observed fact, and a missing indicator proves the cause of missingness."),
            (f"train = pd.DataFrame({{'age': [np.nan, np.nan], 'area': [1., {2 + amount}.]}})\nimputer = SimpleImputer(strategy='median').fit(train)\nresult = {{'fitted_features': imputer.feature_names_in_, 'statistics': imputer.statistics_, 'output_names': imputer.get_feature_names_out(), 'output': imputer.transform(train), 'schema_policy': 'report empty-column behavior; reject unexpected or reordered new columns'}}",
             "Inspect the pinned imputer's all-missing-column output instead of silently assuming a constant shape. A schema mismatch requires an explicit error or reviewed policy, not guessed column deletion/reordering.",
             "Every fitted imputer always preserves every column, so all-missing or reordered columns need no inspection."),
        ]
    elif lesson == 3:
        category = "team" if amount == 3 else f"team-{amount}" if amount % 2 else f"enterprise-{amount}"
        drop = None if amount % 2 else "first"
        cases = [
            (f"encoder = OneHotEncoder(categories=[['basic','pro']], handle_unknown='ignore', drop=None, sparse_output=False).fit([['basic'],['pro']])\nresult = {{'fit_ids': ['H01','H02'], 'categories': encoder.categories_, 'columns': encoder.get_feature_names_out(['plan']), 'unknown': '{category}', 'encoded': encoder.transform([['{category}']]), 'test_refit_allowed': False}}",
             "The training vocabulary stays basic/pro. With ignore and no drop, an unseen category becomes[0,0]; it is not newly learned. Record the ambiguity or choose the declared error policy, never refit on test.",
             "Refit the encoder on evaluation categories so each new batch gets a complete and trustworthy feature vocabulary."),
            (f"encoder = OneHotEncoder(categories=[['basic','pro']], handle_unknown='ignore', drop=None, sparse_output=False).fit([['basic'],['pro']])\nrecords = [['pro'], ['basic']] * {1 if amount == 3 else amount}\nresult = {{'ordered_columns': encoder.get_feature_names_out(['plan']), 'encoded': encoder.transform(records), 'shape': encoder.transform(records).shape}}",
             "Column order follows the saved basic/pro vocabulary, not the order of new records. Two categories with no drop give two coordinates per observation.",
             "One-hot column order is inferred anew from the order in which evaluation categories appear."),
            (f"mapping = {{'basic': {amount}, 'pro': {amount + 1}, 'team': {amount + 2}}}\nresult = {{'arbitrary_plan_codes': mapping, 'distance_meaning_justified': False, 'justified_ordinal_example': ['low','medium','high'], 'one_hot_alternative': [[1,0,0],[0,1,0],[0,0,1]]}}",
             "Numeric category codes alone do not establish order or equal distances. Low/medium/high may justify a stated ordinal ranking; plan names need semantic evidence, not code arithmetic.",
             "Consecutive integer codes prove equally spaced feature values and make any category suitable for distance calculations."),
            (f"encoder = OneHotEncoder(categories=[['basic','pro']], handle_unknown='ignore', drop={drop!r}, sparse_output=False).fit([['basic'],['pro']])\nresult = {{'drop': {drop!r}, 'columns': encoder.get_feature_names_out(['plan']), 'basic': encoder.transform([['basic']]), 'unknown': encoder.transform([['{category}']]), 'same_meaning_guaranteed': False}}",
             "An all-zero unknown code does not mean a known reference category. With drop=first it can numerically coincide with the dropped basic category; preserve unknown provenance and interpret cautiously.",
             "If two encoded rows are numerically equal, the underlying categories necessarily have identical meaning."),
        ]
    elif lesson == 4:
        value = 5 + offset
        cases = [
            (f"train = np.array([[1.],[3.]])\nscaler = StandardScaler().fit(train)\nleaked = StandardScaler().fit(np.vstack([train, [[{value}.]]]))\nresult = {{'fit_ids': ['H01','H02'], 'mean': scaler.mean_, 'population_variance': scaler.var_, 'scale': scaler.scale_, 'test': scaler.transform([[{value}.]]), 'sample_variance_wrong_for_scaler': np.var(train, ddof=1), 'leaked_mean': leaked.mean_, 'whole_data_fit_allowed': False}}",
             "StandardScaler uses training population variance: mean2, variance1, scale1. A sample denominator gives2 instead. Freeze these coordinates before validation/test; a legal leaked fit is still invalid.",
             "Fit scaling on the whole dataset or use sample variance; either is valid because standardization is unsupervised."),
            (f"scaler = StandardScaler().fit([[1.],[3.]])\ncoordinate = scaler.transform([[{value}.]])\nresult = {{'coordinate': coordinate, 'inverse_years': scaler.inverse_transform(coordinate), 'formula': '(x - training_mean) / training_scale'}}",
             "Subtract the training mean and divide by training scale. The standardized coordinate is unitless; inverse_transform restores the original years using the same saved parameters.",
             "A standardized value keeps its original units and should be converted back using test-batch statistics."),
            (f"scaler = StandardScaler().fit([[4.],[4.]])\nresult = {{'variance': scaler.var_, 'scale': scaler.scale_, 'train_output': scaler.transform([[4.],[4.]]), 'new_output': scaler.transform([[{5 + offset}.]])}}",
             "The pinned StandardScaler assigns scale1 to this constant training feature. Training values map to0; a new5 maps to1. Preserve the separate Math runtime's zero-variance guard rather than changing it.",
             "A constant feature always divides by zero in every library and must silently turn every future value into zero."),
            (f"raw = np.array([[{1 + amount}.], [{3 + amount}.]])\nscaled = StandardScaler().fit_transform(raw)\nresult = {{'raw': raw, 'scaled': scaled, 'numerical_purpose': 'coordinate conditioning', 'better_generalization_proved': False}}",
             "Scaling changes coordinates and may affect optimization or distance-based behavior. Nicer ranges do not establish better generalization; that requires a valid held-out evaluation protocol.",
             "Features centered on zero prove the model will generalize better regardless of evaluation."),
        ]
    elif lesson == 5:
        train = f"pd.DataFrame({{'age': [10., np.nan, {30 + offset}.], 'plan': ['basic','pro',np.nan]}})"
        primer = f"train = {train}\nvalidation = pd.DataFrame({{'age': [{1000 + amount}., np.nan], 'plan': ['team','basic']}})\n"
        pipeline = "numeric = make_pipeline(SimpleImputer(strategy='median'), StandardScaler())\ncategorical = make_pipeline(SimpleImputer(strategy='most_frequent'), OneHotEncoder(categories=[['basic','pro']], handle_unknown='ignore', sparse_output=False))\npreprocessor = ColumnTransformer([('numeric', numeric, ['age']), ('category', categorical, ['plan'])])\npreprocessor.fit(train)\n"
        cases = [
            (primer + pipeline + "result = {'fit_ids': ['H01','H02','H03'], 'branch_order': ['numeric: impute then scale', 'category: impute then encode'], 'columns': preprocessor.get_feature_names_out(), 'validation': preprocessor.transform(validation), 'invalid_order': 'scale raw plan text; or externally fit on all rows'}",
             "Numeric missing values are imputed then scaled; categorical missing labels are imputed then encoded. Fit each typed branch on training rows, concatenate in declared branch order and preserve that feature schema.",
             "Any pipeline ordering is valid if it produces a numeric matrix; fitting steps outside the boundary cannot leak."),
            (f"fold_train_ids = ['H01','H02','H03']\nfold_validation_ids = ['H04','H05']\ntrain = np.array([[10.],[np.nan],[{30 + offset}.]])\nvalidation = np.array([[{1000 + amount}.],[np.nan]])\nlocal = SimpleImputer(strategy='median').fit(train)\ninvalid_prefit = SimpleImputer(strategy='median').fit(np.vstack([train, validation]))\nresult = {{'stage_fit_ids': fold_train_ids, 'transform_only_ids': fold_validation_ids, 'fold_statistic': local.statistics_, 'validation_output': local.transform(validation), 'invalid_prefit_statistic': invalid_prefit.statistics_, 'prefit_allowed': False}}",
             "A fold is a temporary train/validation partition. Every learned preprocessing stage fits only that fold's training IDs, then transforms its validation IDs. Whole-development prefit leaks even though the final test is untouched.",
             "Fitting once on all development rows before cross-validation is safe because only the final test must stay unseen."),
            (primer + pipeline + "result = {'columns': preprocessor.get_feature_names_out(), 'shape': preprocessor.transform(validation).shape, 'table': preprocessor.transform(validation)}",
             "ColumnTransformer concatenates named branches in declaration order. The numeric age coordinate precedes basic/pro encoding; column count and names must match the saved model-input contract.",
             "The same output shape permits any column order, regardless of vocabulary or branch names."),
            (primer + pipeline + "before = preprocessor.named_transformers_['numeric'].named_steps['simpleimputer'].statistics_.copy()\ntransformed = preprocessor.transform(validation)\nresult = {'training_median_before': before, 'training_median_after': preprocessor.named_transformers_['numeric'].named_steps['simpleimputer'].statistics_, 'validation': transformed, 'new_fit_allowed': False}",
             "fit_transform belongs on authorized training rows; transform reuses fitted attributes for new rows. A second fit on evaluation rows replaces the training rule and invalidates the boundary.",
             "Calling fit_transform again on validation is equivalent to transform because the pipeline class has not changed."),
        ]
    else:
        cases = [
            (f"test_age = np.array([{80 + offset}.])\nresult = {{'policy': 'supplied training-only cap', 'cap_years': 50, 'transformed': np.clip(test_age, 0, 50), 'preserve_alternative': test_age, 'test_score_may_choose_cap': False, 'coverage_warning': 'investigate valid extreme observations before removal'}}",
             "A cap50 is a supplied training-only policy, not automatic cleaning. Test80 maps to50 only under that policy. Do not tune the cap or delete rows to improve final-test scores; consider population coverage and investigate.",
             "Choose whichever cap or row deletion gives the best final-test score, since outliers are errors by definition."),
            (f"scaler = StandardScaler().fit([[1.],[{3 + offset}.]])\nresult = {{'dataset': 'preparation-houses.v1', 'source_revision': {amount}, 'source_sha256': '{DATA_HASH}', 'environment': 'macos-arm64-cpython-3.13.16-reference.1', 'fit_ids': ['H01','H02'], 'columns': ['age'], 'units': ['years'], 'mean': scaler.mean_, 'scale': scaler.scale_, 'seed': 42, 'schema_policy': 'reject unreviewed changes', 'limitation': 'fictional data, not population evidence'}}",
             "Record data identity/hash, environment, fitted parameters, exact fit IDs, output column order, units, policy and limitations. A preprocessing artifact is more than a seed or a plausible transformed value.",
             "A seed and a screenshot of transformed data are sufficient to reconstruct any preparation workflow."),
            (f"ids = {train_ids!r}\nreordered = list(reversed(ids)) if {amount % 2 == 0!r} else ids[{max(1, amount - 2)}:] + ids[:{max(1, amount - 2)}]\nfirst, _ = train_test_split(ids, test_size=4, random_state=42)\nsecond, _ = train_test_split(reordered, test_size=4, random_state=42)\nresult = {{'seed': 42, 'original_train_ids': first, 'changed_order_train_ids': second, 'seed_alone_sufficient': False}}",
             "The same seed with changed input order can select different IDs. Pin data/hash, ordering, dependency versions, split configuration and fitted schema as well as seeds.",
             "The same seed reproduces identical observation memberships even after the data order or dependency profile changes."),
            (f"expected_columns = ['age','plan_basic','plan_pro']\nreceived_columns = {['plan_basic','plan_pro','age'] if amount == 7 else ['plan_pro','age','plan_basic'] if amount % 2 else ['age','plan_basic','new_plan']!r}\nresult = {{'expected': expected_columns, 'received': received_columns, 'compatible': received_columns == expected_columns, 'action': 'reject incompatible schema; review explicit mapping before transform'}}",
             "Equal width does not prove compatible features. Reject unsupported new/reordered columns explicitly and preserve the saved schema; do not silently guess a reordering or category equivalence.",
             "Any same-width feature matrix can be passed to the trained model without checking names or order."),
        ]
    body, reason, misconception = cases[objective]
    code = IMPORTS + body
    assert len(code.splitlines()) <= 25 and len(code.encode()) <= 4096
    namespace = {}
    with warnings.catch_warnings(record=True) as recorded:
        warnings.simplefilter("always")
        exec(compile(code, "<trusted-fixed-preparation-reference>", "exec"), namespace)
    return {"code": code, "expected": normalize(namespace["result"]), "reason": reason, "misconception": misconception, "warnings": sorted({type(item.message).__name__ for item in recorded})}


def experiment_cases():
    definitions = [
        ("t01", "T01.O1", "train_times = [1, 2, 8]\nvalidation_times = [3, 4]\nresult = {'train_times': train_times, 'validation_times': validation_times, 'future_training_information': max(train_times) >= min(validation_times), 'valid_future_forecast_boundary': False}", "A future-forecast evaluation cannot fit on time8 before predicting time3. Chronology is part of the intended generalization boundary, not a seed choice.", "Shuffling times makes a future forecast valid even if training includes later observations."),
        ("t02", "T02.O3", "train = np.array([[0.],[np.nan],[20.]])\nconstant = SimpleImputer(strategy='constant', fill_value=-1).fit(train)\nmode = SimpleImputer(strategy='most_frequent').fit(train)\nresult = {'constant_policy': constant.transform(train), 'training_mode_policy': mode.transform(train), 'observed_zero_is_missing': False, 'policies_are_assumptions': True}", "A declared constant is not a learned observation; most_frequent uses only observed training values and its pinned tie rule. Neither replacement proves the cause of absence; zero remains observed.", "Constant and mode imputation recover the true unobserved value without an assumption."),
        ("t03", "T03.O1", "encoder = OneHotEncoder(categories=[['basic','pro']], handle_unknown='error', sparse_output=False).fit([['basic'],['pro']])\ntry:\n    result = encoder.transform([['team']])\nexcept ValueError:\n    result = {'tag': 'error', 'class': 'ValueError', 'action': 'reject unknown; do not refit evaluation data'}", "The declared error policy rejects an unknown category. This is different from ignore/no-drop zeros; neither policy permits test refitting.", "An encoder error authorizes refitting its vocabulary on the test batch."),
        ("t05", "T05.O1", "try:\n    result = StandardScaler().fit_transform(pd.DataFrame({'plan': ['basic','pro']}))\nexcept ValueError:\n    result = {'tag': 'error', 'class': 'ValueError', 'repair': 'categorical imputation then encoding; numeric branch imputation then scaling'}", "Scaling raw category text is an invalid typed sequence, not a numerical output. Repair the branches and keep every fit inside its authorized training boundary.", "Any ordering of pipeline stages is equivalent because their final output is numeric."),
    ]
    result = []
    for index, (lesson, objective, body, reason, misconception) in enumerate(definitions):
        code = IMPORTS + body
        namespace = {}
        exec(compile(code, "<trusted-fixed-preparation-experiment>", "exec"), namespace)
        result.append({"lesson": lesson, "objective": objective, "mode": "experiment", "variant": index, "amount": 3, "code": code, "expected": normalize(namespace["result"]), "reason": reason, "misconception": misconception, "warnings": []})
    return result


def metadata():
    text = (ROOT / "docs/task-013-lesson-objective-matrix.md").read_text()
    lessons = []
    for number in range(1, 7):
        slug = f"T{number:02}"
        section = re.search(rf"^### {slug} (.*?)\n(.*?)(?=^### |^## |\Z)", text, re.M | re.S)
        body = section[2]
        field = lambda label: re.search(rf"\*\*{re.escape(label)}:\*\* (.*)", body)[1].strip()
        objectives = []
        for row in re.findall(r"^\| (T\d\d\.O\d)([^|]*)\|([^\n]*)", body, re.M):
            columns = [value.strip() for value in row[2].split("|")]
            objectives.append({"id": row[0], "critical": "**C**" in row[1], "outcome": columns[0], "assessment": columns[1], "remediation": columns[2]})
        lessons.append({"slug": slug.lower(), "title": section[1], "prerequisites": field("Prerequisites"), "motivation": field("Motivation and mental model"), "progression": field("Progression beyond the worked example"), "terms": field("Key concepts"), "math": field("Mathematical connection"), "worked": field("Worked example"), "misconception": field("Misconception to confront"), "objectives": objectives})
    return lessons


def build():
    cases = []
    for lesson in range(1, 7):
        for objective in range(4):
            for mode, amounts in [("worked", [3]), ("practice", [1, 2]), ("mastery", [4, 5, 7])]:
                for variant, amount in enumerate(amounts):
                    cases.append({"lesson": f"t{lesson:02}", "objective": f"T{lesson:02}.O{objective + 1}", "mode": mode, "variant": variant, "amount": amount, **authored_case(lesson, objective, amount)})
    return {"contract": "preparation-learning-reference.v1", "profile": "macos-arm64-cpython-3.13.16-reference.1", "sklearn": sklearn.__version__, "author": "python/mlmath/preparation_learning_reference.py", "manifest": {"id": "preparation-houses.v1", "sha256": DATA_HASH, "source": "original fictional housing data; immutable prior canonical values reused", "permission": "platform teaching use", "train_ids": HOUSES["id"][:12], "test_ids": HOUSES["id"][12:], "limitations": "tiny fictional data; no population performance or capstone claim"}, "houses": HOUSES, "canonical_table": normalize(pd.DataFrame(HOUSES)), "lessons": metadata(), "cases": cases + experiment_cases()}


if __name__ == "__main__":
    print(json.dumps(build(), indent=2, ensure_ascii=False, allow_nan=False))

