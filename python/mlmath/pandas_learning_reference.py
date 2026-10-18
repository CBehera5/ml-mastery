import ast
import hashlib
import json
import re
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
AMOUNTS = (1, 2, 3, 4, 5, 7)
HOUSES = {"id": [f"H{index:02}" for index in range(1, 17)], "area": list(range(1, 17)), "age": [0, 5, None, 10] * 4, "neighborhood": ["A", "B"] * 8, "price": [100 + index * 20 for index in range(16)], "future_price": [110 + index * 20 for index in range(16)], "listed_on": ["2026-01-02"] * 16}
DATA_HASH = hashlib.sha256(json.dumps(HOUSES, sort_keys=True).encode()).hexdigest()


def dtype_name(dtype):
    return f"string[{dtype.storage}]" if isinstance(dtype, pd.StringDtype) else str(dtype)


def normalize(value):
    if isinstance(value, pd.DataFrame):
        assert value.shape[0] <= 32 and value.shape[1] <= 8
        return {"kind": "frame", "shape": list(value.shape), "index": normalize(value.index.tolist()), "index_names": normalize(value.index.names), "columns": normalize(value.columns.tolist()), "dtypes": [dtype_name(dtype) for dtype in value.dtypes], "rows": normalize(value.values.tolist())}
    if isinstance(value, pd.Series):
        assert len(value) <= 32
        return {"kind": "series", "name": normalize(value.name), "index": normalize(value.index.tolist()), "index_names": normalize(value.index.names), "dtype": dtype_name(value.dtype), "values": normalize(value.tolist())}
    if value is pd.NA or value is pd.NaT:
        return {"tag": "missing"}
    if isinstance(value, pd.Timestamp):
        return value.isoformat()
    if isinstance(value, np.generic):
        return normalize(value.item())
    if isinstance(value, float) and not np.isfinite(value):
        return {"tag": "missing"} if np.isnan(value) else {"tag": "nonfinite", "value": "+inf" if value > 0 else "-inf"}
    if isinstance(value, dict):
        return {key: normalize(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [normalize(item) for item in value]
    if isinstance(value, str):
        assert len(value) <= 120
    if isinstance(value, (float, int)) and not isinstance(value, bool):
        assert abs(value) <= 1e12
    return value


def houses_code():
    return f"df = pd.DataFrame({HOUSES!r})\ndf['id'] = pd.Series(df['id'], dtype='string[python]')\ndf['age'] = pd.Series(df['age'], dtype='Int64')\ndf['neighborhood'] = pd.Series(df['neighborhood'], dtype='string[python]')"


def authored_case(lesson, objective, amount):
    if type(lesson) is not int or lesson not in range(1, 7) or type(objective) is not int or objective not in range(4) or type(amount) is not int or amount not in AMOUNTS:
        raise ValueError("Only enumerated trusted pandas configurations are supported.")
    value = 1 if amount == 3 else amount
    frame = f"df = pd.DataFrame({{'area': [{value}, {value + 1}, {value + 2}], 'age': [0, 10, 20]}}, index=[10, 20, 30])"
    if lesson == 1:
        second_labels = "['rowB', 'rowA']" if amount % 2 else "['rowB', 'rowC']"
        cases = [
            (f"a = pd.Series([{value}, {value + 1}], index=['rowA', 'rowB'], dtype='Int64')\nb = pd.Series([10, 20], index={second_labels}, dtype='Int64')\nresult = {{'a': a, 'b': b, 'aligned_sum': a + b}}", "Match index labels, not display positions. A missing label produces missing output, not zero; preserve each observation's identity before interpreting the sum.", "Series addition always pairs the first displayed values and ignores their index labels."),
            (f"{frame}\nresult = {{'shape': df.shape, 'columns': df.columns.tolist(), 'index': df.index.tolist(), 'dtypes': [str(dtype) for dtype in df.dtypes]}}", "Shape counts rows and columns; the index names observations and columns name ordered features. Inspect all four metadata fields before selecting model input.", "Displayed row numbers are always the observation IDs, and a successful load guarantees the feature schema."),
            (f"{frame}\nresult = {{'series': df['area'], 'frame': df[['area']]}}", "A single column name selects a one-dimensional labeled Series. A list of column names preserves a two-dimensional DataFrame, even with one column.", "Selecting one column always returns the same dimensions and type regardless of the brackets."),
            (f"df = pd.DataFrame({{'age': pd.Series([0, None, {value + 20}], dtype='Int64'), 'zone': pd.Series(['A', None, 'B'], dtype='string[python]')}})\nresult = {{'table': df, 'missing': df.isna()}}", "Nullable Int64 and explicit string storage preserve missing values. Observed zero age is not missing, and an unknown label is not the string 'None'.", "Nullable fields should be filled with numeric zero before their type or meaning is inspected."),
        ]
    elif lesson == 2:
        position = 1 if amount % 2 else 0
        cases = [
            (f"{frame}\nresult = {{'label20': df.loc[20], 'position': df.iloc[{position}]}}", "loc addresses an index label; iloc addresses a zero-based position. They coincide only when that position happens to carry the requested label.", "loc[20] always means row position20 and iloc refers to an observation's label."),
            (f"{frame}\ny = pd.Series([100, 200, 300], index=[10, 20, 30], dtype='Int64')\nmask = pd.Series([True, False, True], index=[30, 10, 20], dtype='boolean')\nresult = {{'source': df, 'mask': mask, 'selected': df.loc[mask], 'targets': y.loc[mask]}}", "The Boolean Series aligns by label: retain IDs20 and30, with their own targets200 and300. Taking the first two targets would produce a silently different training table.", "A mask with the right length can be applied by display position, and equally long targets are automatically aligned."),
            (f"{frame}\ncolumns = {['area', 'age'] if amount % 2 else ['age', 'area']!r}\nresult = df.loc[:, columns]", "A feature list establishes coefficient order. Selecting the same names in a different order changes the model's input contract, even if table shape stays identical.", "Any ordering of the same feature names gives the same weighted predictions."),
            (f"{frame}\nowned = df.copy()\nowned.loc[20, 'area'] = {value + 8}\nresult = {{'original': df, 'owned_copy': owned}}", "Explicitly copy the frame that you intend to edit, then assign with loc. The original remains unchanged; do not rely on chained assignment side effects under this pinned pandas version.", "Chained assignment is a reliable way to update every original frame that shares a selected column."),
        ]
    elif lesson == 3:
        missing_values = [0, None, value, None] if amount % 2 else [0, None, value, value + 1]
        if amount == 7:
            missing_values.append(None)
        missing_count = missing_values.count(None)
        cases = [
            (f"ages = pd.Series([0, None, {value + 20}], index=['H1', 'H2', 'H3'], dtype='Int64')\nresult = {{'ages': ages, 'missing': ages.isna(), 'observed': ages.loc[ages.notna()]}}", "isna identifies only the absent observation. notna retains the legitimate zero H1 as well as H3; truthiness is not a missing-value policy.", "A zero-valued measurement and a missing measurement should both be dropped as false values."),
            (f"ages = pd.Series({missing_values!r}, dtype='Int64')\nresult = {{'rows': len(ages), 'missing_count': int(ages.isna().sum()), 'missing_rate': float(ages.isna().mean())}}", f"The missingness rate uses all {len(missing_values)} eligible rows: {missing_count}/{len(missing_values)}. Do not divide by only nonmissing records or count the legitimate zero as missing.", "A missingness fraction should use only nonmissing rows in its denominator."),
            (f"ages = pd.Series([0, None, 20], index=['H1', 'H2', 'H3'], dtype='Int64')\nreplacement = {10 if amount == 3 else amount}\nresult = {{'preserved': ages, 'dropped': ages.dropna(), 'declared_fill': ages.fillna(replacement)}}", "Dropping removes H2 and changes the population; filling retains its ID and records an assumption. In the worked case10 is the observed median of0 and20, not a permission to fit on a future test set.", "Dropping and filling are interchangeable because both remove a blank from the display."),
            (f"train_ids = ['H1', 'H2']\ntest_ids = ['H3', 'H4']\ntraining_replacement = 10\ntest = pd.Series([{value + 1000}, None], index=test_ids, dtype='Int64')\nresult = {{'fit_rows': train_ids, 'transformed_test': test.fillna(training_replacement), 'refit_on_test': False}}", "The replacement is a declared statistic from training rowsH1/H2 only. Transform held-out rows with that saved value; computing it from the whole dataset before a split lets held-out information influence the model.", "Fitting a replacement on the whole dataset is harmless because it never uses a model's final prediction."),
        ]
    elif lesson == 4:
        observed = "True" if amount % 2 else "False"
        dropna = "False" if amount % 2 else "True"
        cases = [
            (f"df = pd.DataFrame({{'group': ['A', 'A', 'B'], 'price': [{value + 9}, {value + 19}, {value + 99}]}})\nresult = df.groupby('group', sort=True, dropna=False, observed=True)['price'].agg(['sum', 'mean', 'count', 'size'])", "List group membership first, then compute the selected aggregation. Explicit sorted groups and denominators make the report reproducible, not a statement about the whole population.", "Grouping calculates the same statistic for every row without changing denominators or observation weights."),
            (f"df = pd.DataFrame({{'group': ['A', 'A', 'A', 'B'], 'price': [{value + 9}, {value + 19}, None, {value + 99}]}})\nsummary = df.groupby('group', sort=True, dropna=False, observed=True)['price'].agg(['sum', 'mean', 'count', 'size'])\nresult = {{'groups': summary, 'global_mean': df['price'].mean(), 'unweighted_group_mean': summary['mean'].mean()}}", "size counts all rows, but count excludes missing price. GroupA has3 rows and2 observed prices; reconstruct the total sum and observed count for the global mean instead of averaging unequal group means.", "size and count are interchangeable, so averaging group means always recovers the global mean."),
            (f"df = pd.DataFrame({{'group': pd.Categorical(['A', None, 'A'], categories=['A', 'B']), 'price': [{value}, 20, 30]}})\nresult = df.groupby('group', sort=True, dropna={dropna}, observed={observed})['price'].agg(['sum', 'count', 'size'])", "The recipe explicitly decides whether missing keys are dropped and unused categories are included. observed and dropna describe different choices; inspect the category universe and actual groups separately.", "Missing group keys and unused categories always disappear, regardless of observed or dropna."),
            (f"df = pd.DataFrame({{'group': ['A', 'A', 'A', 'B', 'B', 'B'], 'band': ['small', 'small', 'large', 'small', 'large', 'large'], 'price': [{100 + value}, {100 + value}, {300 + value}, {100 + value}, {300 + value}, {300 + value}]}})\nresult = {{'pooled': df.groupby('group', sort=True, dropna=False, observed=True)['price'].mean(), 'within_band': df.groupby(['band', 'group'], sort=True, dropna=False, observed=True)['price'].mean()}}", "The pooled means differ because the size-band composition differs. Within each band the group prices agree in this constructed data. Grouping describes association; neither result alone identifies a causal effect or proves no causal effect in another study.", "A higher group mean proves that changing a house's group causes the price difference, without considering its size band."),
        ]
    elif lesson == 5:
        left_keys = "['A', 'B']" if amount % 2 else "['A', 'A', 'B']"
        zones = ['X', 'X'] if amount % 2 else ['X', 'Y']
        join_left = ['A', 'B'] if amount in (1, 3, 4) else ['A', 'B', 'C']
        join_right = ['B', 'B'] if amount % 2 == 0 else ['A', 'A', 'A'] if amount == 7 else ['A', 'A']
        right_null = 'Z' if amount == 5 else None
        key_reason = "Joining on zone creates cross-house pairs." if amount % 2 else "This sample happens to give matching pairs on zone too, but zone is not a stable house identifier."
        cases = [
            (f"left = pd.DataFrame({{'entity_id': ['H{amount}1', 'H{amount}2'], 'zone': {zones!r}}}, dtype='string[python]')\nright = pd.DataFrame({{'entity_id': ['H{amount}1', 'H{amount}2'], 'zone': {zones!r}, 'plan': ['basic', 'plus']}}, dtype='string[python]')\nresult = {{'entity_matches': left.merge(right, on='entity_id', how='left', sort=False, validate='one_to_one'), 'zone_matches': left.merge(right, on='zone', how='left', sort=False, validate='many_to_many')}}", f"Entity IDs identify the same house across tables. {key_reason} Neither a permitted cardinality nor an accidentally correct sample establishes key meaning.", "A common column name or a successful merge makes any join key a valid identifier of the same entity."),
            (f"left = pd.DataFrame({{'key': {left_keys}}}, dtype='string[python]')\nright = pd.DataFrame({{'key': ['A', 'A'], 'lookup': ['x', 'y']}}, dtype='string[python]')\npreview = left.merge(right, on='key', how='left', sort=False, validate='many_to_many', indicator=True)\ntry:\n    checked = left.merge(right, on='key', how='left', sort=False, validate='many_to_one')\nexcept pd.errors.MergeError:\n    validation = {{'tag': 'error', 'class': 'MergeError'}}\nresult = {{'preview': preview, 'required_lookup_contract': validation, 'action': 'inspect conflicting right keys before use'}}", "The intended lookup has at most one right-side record per key. Each A pairs with both conflicting right records; many_to_one correctly rejects this lookup. A permissive many_to_many preview counts pairs but cannot justify silently duplicating observations or dropping conflicting records.", "Switching validate to many_to_many makes any duplicated lookup suitable training data, so the conflicting rows need no investigation."),
            (f"left = pd.DataFrame({{'key': {join_left!r}}}, dtype='string[python]')\nright = pd.DataFrame({{'key': {join_right!r}, 'value': {['x', 'y', 'z'][:len(join_right)]!r}}}, dtype='string[python]')\nresult = {{'left': left.merge(right, on='key', how='left', sort=False, validate='one_to_many', indicator=True), 'inner': left.merge(right, on='key', how='inner', sort=False, validate='one_to_many', indicator=True)}}", "A left join retains the requested left population, including unmatched rows; an inner join drops unmatched rows. Each duplicate key creates another matching pair. Inspect exact IDs, indicator values and multiplicities before interpreting the result.", "Both inner and left joins always keep exactly one row for every original left observation."),
            (f"left = pd.DataFrame({{'key': ['A', None], 'left_id': ['L{amount}1', 'L{amount}2']}}, dtype='string[python]')\nright = pd.DataFrame({{'key': [{right_null!r}, 'A'], 'right_id': ['R{amount}1', 'R{amount}2']}}, dtype='string[python]')\nresult = left.merge(right, on='key', how='inner', sort=False, validate='one_to_one', indicator=True)", "When both sides contain null keys, pinned pandas matches them. Without a right null there is no such pair. Do not assume SQL-style null nonmatches; explicitly inspect whether missing keys can identify the same entity.", "Null keys never match in pandas, so a missing-key row cannot appear in an inner join."),
        ]
    else:
        base = houses_code()
        duplicate = amount + 7
        columns = ["area", "age"] if amount % 2 else ["age", "area"]
        subset = "" if amount == 3 else f"\ndf = df.loc[:{amount + 7}].copy()"
        cases = [
            (f"from io import StringIO\ntext = 'id,area,listed_on\\nH1,{value},2026-01-02\\nH2,,bad-date\\n'\ndf = pd.read_csv(StringIO(text), dtype={{'id': 'string[python]', 'area': 'Float64', 'listed_on': 'string[python]'}}, keep_default_na=False, na_values=[''])\ndf['listed_on'] = pd.to_datetime(df['listed_on'], format='%Y-%m-%d', errors='coerce')\nresult = {{'table': df, 'invalid_dates': int(df['listed_on'].isna().sum()), 'missing_area': int(df['area'].isna().sum())}}", "The loader declares dtype and blank markers; the date parser declares format and coercion. A coerced invalid date is explicitly missing and must be audited, not treated as a successfully validated date or an area zero.", "Successful CSV parsing validates every date and feature, while an empty numeric field automatically becomes an observed zero."),
            (f"{base}\noverlay = df.copy()\noverlay.loc[{duplicate}, 'id'] = 'H01'\nresult = {{'overlay': 'duplicate-id-{amount}', 'rows': len(overlay), 'distinct_ids': len(overlay['id'].drop_duplicates()), 'duplicate_rows': overlay.loc[overlay['id'].duplicated(keep=False), ['id', 'area']], 'missing_age': int(overlay['age'].isna().sum()), 'group_rows': overlay.groupby('neighborhood', sort=True, dropna=False, observed=True).size()}}", "The named overlay has16 rows but15 distinct IDs; inspect both duplicate occurrences and missing-age counts. The canonical16 unique house IDs remain unchanged. Equal row count does not prove unique observations.", "A16-row table must contain16 unique houses, so duplicate and missingness checks can be skipped."),
            (f"{base}\nfeatures = {columns!r}\nresult = {{'ordered_features': features, 'inputs': df.loc[:2, features], 'excluded': ['price', 'future_price'], 'ready_to_fit': False}}", "Use only fields available at prediction time, in the declared feature order. price is the target; future_price is unavailable then. Exclude both even if highly predictive, and still resolve missingness before fitting a model.", "A future-derived price is a valid input whenever its correlation improves prediction, even if it is unavailable when the model is used."),
            (f"{base}{subset}\nresult = {{'dataset': 'pandas-houses-teaching.v1', 'source_sha256': '{DATA_HASH}', 'source_rows': 16, 'reported_rows': len(df), 'row_ids': df['id'].tolist(), 'columns': df.columns.tolist(), 'missing_age': int(df['age'].isna().sum()), 'train_ids': df.loc[:11, 'id'].tolist(), 'test_ids': df.loc[12:, 'id'].tolist(), 'limitations': 'fictional teaching data; report covers only declared retained IDs, not population performance'}}", "A reproducible audit distinguishes its16-row source from its reported subset, records source hash, exact retained/split IDs, missingness and limitations. This fictional sample cannot establish population performance; an audit is not a fitted model or capstone.", "An audit with a plausible average proves the data are representative, so provenance and split identities are unnecessary."),
        ]
    code, reason, misconception = cases[objective]
    code = "import pandas as pd\n" + code
    tree = ast.parse(code)
    assert len(code.splitlines()) <= 25 and len(code.encode()) <= 4096
    assert not any(isinstance(node, (ast.While, ast.Lambda, ast.AsyncFor, ast.GeneratorExp)) for node in ast.walk(tree))
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            assert all(alias.name == "pandas" for alias in node.names)
        if isinstance(node, ast.ImportFrom):
            assert node.module == "io" and all(alias.name == "StringIO" for alias in node.names)
        if isinstance(node, ast.Attribute):
            assert node.attr not in ("query", "eval", "apply", "to_csv", "read_sql", "median")
    namespace = {}
    with warnings.catch_warnings(record=True) as recorded:
        warnings.simplefilter("always")
        exec(compile(code, "<trusted-fixed-pandas-reference>", "exec"), namespace)
    expected = normalize(namespace["result"])
    return {"code": code, "expected": expected, "reason": reason, "misconception": misconception, "warnings": sorted({type(item.message).__name__ for item in recorded})}


def metadata():
    text = (ROOT / "docs/task-013-lesson-objective-matrix.md").read_text()
    lessons = []
    for number in range(1, 7):
        slug = f"D{number:02}"
        section = re.search(rf"^### {slug} (.*?)\n(.*?)(?=^### |^## |\Z)", text, re.M | re.S)
        body = section[2]
        field = lambda label: re.search(rf"\*\*{re.escape(label)}:\*\* (.*)", body)[1].strip()
        objectives = []
        for row in re.findall(r"^\| (D\d\d\.O\d)([^|]*)\|([^\n]*)", body, re.M):
            columns = [value.strip() for value in row[2].split("|")]
            objectives.append({"id": row[0], "critical": "**C**" in row[1], "outcome": columns[0], "assessment": columns[1], "remediation": columns[2]})
        lessons.append({"slug": slug.lower(), "title": section[1], "prerequisites": field("Prerequisites"), "motivation": field("Motivation and mental model"), "progression": field("Progression beyond the worked example"), "terms": field("Key concepts"), "math": field("Mathematical connection"), "worked": field("Worked example"), "misconception": field("Misconception to confront"), "objectives": objectives})
    return lessons


def build():
    canonical_namespace = {}
    exec("import pandas as pd\n" + houses_code(), canonical_namespace)
    canonical_table = normalize(canonical_namespace['df'])
    cases = []
    for lesson in range(1, 7):
        for objective in range(4):
            for mode, amounts in [("worked", [3]), ("practice", [1, 2]), ("mastery", [4, 5, 7])]:
                for variant, amount in enumerate(amounts):
                    cases.append({"lesson": f"d{lesson:02}", "objective": f"D{lesson:02}.O{objective + 1}", "mode": mode, "variant": variant, "amount": amount, **authored_case(lesson, objective, amount)})
    return {"contract": "pandas-learning-reference.v1", "profile": "macos-arm64-cpython-3.13.16-reference.1", "pandas": pd.__version__, "author": "python/mlmath/pandas_learning_reference.py", "manifest": {"id": "pandas-houses-teaching.v1", "sha256": DATA_HASH, "source": "original fictional data authored for platform teaching", "permission": "platform teaching use", "schema": {"id": "unique string", "area": "area units", "age": "nullable years", "neighborhood": "label", "price": "target $k", "future_price": "quarantined future $k", "listed_on": "ISO date"}, "train_ids": HOUSES["id"][:12], "test_ids": HOUSES["id"][12:], "limitations": "tiny fictional data; not representative or a capstone"}, "houses": HOUSES, "canonical_table": canonical_table, "lessons": metadata(), "cases": cases}


if __name__ == "__main__":
    print(json.dumps(build(), indent=2, ensure_ascii=False, allow_nan=False))
