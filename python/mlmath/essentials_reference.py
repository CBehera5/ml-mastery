import ast
import csv
import io
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def display(value):
    return json.dumps(value, ensure_ascii=False, allow_nan=False)


def authored_case(lesson, objective, amount):
    if type(lesson) is not int or lesson not in range(2, 9) or type(objective) is not int or objective not in range(4) or type(amount) is not int or amount not in (1, 2, 3, 4, 5, 7):
        raise ValueError("Only enumerated author configurations are supported.")
    if lesson == 7 and objective == 3 and amount % 2 == 0:
        code = f"area = {amount}\nif area > 0\n    result = area * 100 + 50"
        try:
            compile(code, "<fixed-missing-colon-example>", "exec")
        except SyntaxError:
            repaired = code.replace("if area > 0\n", "if area > 0:\n")
            namespace = {}
            exec(compile(repaired, "<fixed-colon-repair>", "exec"), namespace)
        else:
            raise AssertionError("Expected a syntax failure before execution")
        return {"code": code, "expected": ["SyntaxError", "add ':' after if", namespace["result"]], "wrong": ["logic error", "the program already runs", namespace["result"]], "reason": "A missing colon is a syntax error before execution, not an incorrect numeric result. Add the colon after the if condition; only then can the supplied weighted expression run.", "raises": "SyntaxError"}
    if lesson == 2:
        feature_literal = f"[{amount}, 10]" if amount % 2 else f"({amount}, 10)"
        feature_type = "list" if amount % 2 else "tuple"
        cases = [
            (f"features = {feature_literal}\nrecord = {{'area': {amount}, 'age': 10}}\nlabels = {{'spam', 'ham'}}\nresult = [type(features).__name__, type(record).__name__, type(labels).__name__]", [feature_type, "dict", "set"], ["set", "list", "dict"], "Ordered editable features can use a list; fixed pairs can use a tuple. Named fields use a dict; unique membership uses a set, never an assumed feature-column order."),
            (f"features = [{amount}, 10]\nalias = features\ncopy = features.copy()\nalias[0] = {amount + 1}\nresult = [features, alias, copy]", [[amount + 1, 10], [amount + 1, 10], [amount, 10]], [[amount, 10], [amount + 1, 10], [amount + 1, 10]], "features and alias name one mutable list; copy owns a separate list. Preserve the order [area, age]."),
            (f"features = [{amount}, {amount + 2}, {amount + 4}]\nresult = [features[-1], features[:2]]", [amount + 4, [amount, amount + 2]], [amount, [amount, amount + 2, amount + 4]], "Negative one selects the last position; the slice stop is excluded, so [:2] retains positions zero and one."),
            (f"record = {{'area': {amount}, 'age': 10}}\nlabels = {{'spam', 'ham'}}\nresult = [record['area'], 'spam' in labels]", [amount, True], [10, False], "Dictionary keys retrieve named fields; membership asks a yes/no question without relying on set iteration order."),
        ]
    elif lesson == 3:
        cases = [
            (f"age = {amount}\nresult = age >= {amount} and age < {amount + 2}", True, False, "Evaluate both comparisons at the boundary; >= includes equality while < excludes its upper endpoint."),
            (f"records = [('A{amount}', 0), ('B{amount}', None), ('C{amount}', {amount})]\nkept = [row_id for row_id, age in records if age is not None]\nresult = kept", [f"A{amount}", f"C{amount}"], [f"C{amount}"], "Zero is a legitimate observed value. Test is not None, rather than truthiness, so the zero-valued record is not silently lost."),
            (f"age = {amount}\nif age < {amount}:\n    branch = 'low'\nelif age <= {amount + 1}:\n    branch = 'middle'\nelse:\n    branch = 'high'\nresult = branch", "middle", "high", "An if/elif chain executes the first satisfied branch; test the exact boundary before choosing a later branch."),
            (f"records = [('A', 0), ('B', {amount}), ('C', None)]\nkept = [row_id for row_id, age in records if age]\nresult = kept", ["B"], ["A", "B"], "This truthiness filter accidentally drops valid zero A as well as missing C. A plausible row count does not prove the intended population was kept."),
        ]
    elif lesson == 4:
        batch = [] if amount % 2 == 0 else [0, 0]
        guarded_mean = None if not batch else 0
        cases = [
            (f"visited = list(range(1, {amount + 2}))\nresult = [visited, len(visited)]", [list(range(1, amount + 2)), amount + 1], [list(range(1, amount + 1)), amount], "range includes its start and excludes its stop; expand the visited indices before counting."),
            (f"errors = [-{amount}, 0, {amount}]\ntotal = 0\ncount = 0\nfor error in errors:\n    total += error * error\n    count += 1\nresult = [total, count, total / count]", [2 * amount**2, 3, 2 * amount**2 / 3], [amount**2, 1, amount**2], "Initialize once outside the loop and retain every contribution; the denominator counts all three observations, including zero error."),
            (f"features = [{amount}, {amount + 1}, {amount + 2}]\ntargets = [100, 200]\npairs = list(zip(features, targets))\nresult = [pairs, len(features) == len(targets)]", [[(amount, 100), (amount + 1, 200)], False], [[(amount, 100), (amount + 1, 200)], True], "zip truncates at the shorter list. Check lengths and row identities before trusting paired model errors."),
            (f"errors = {batch}\ncount = len(errors)\nresult = None if count == 0 else sum(errors) / count", guarded_mean, 0 if guarded_mean is None else None, "An empty batch has no observed mean; guard zero count. Observed zero errors, unlike an empty batch, have a legitimate mean zero."),
        ]
    elif lesson == 5:
        cases = [
            (f"def predict(area):\n    price = area * 100 + 50\n    return price\nvalue = predict({amount})\nresult = ['area', {amount}, 'price', value]", ["area", amount, "price", amount * 100 + 50], ["price", amount * 100, "area", amount], "area is the parameter, the supplied number is its argument, and price is local to the call frame."),
            (f"def predict(area):\n    return area * 100 + 50\ndef add_fee(price):\n    return price + 10\nresult = add_fee(predict({amount}))", amount * 100 + 60, amount * 100 + 50, "Return the prediction so the next function receives a number. Printing without returning would pass None and break the arithmetic."),
            (f"def validate(text):\n    return float(text)\ndef predict(area):\n    return area * 100 + 50\nresult = predict(validate('{amount}'))", amount * 100 + 50.0, str(amount) * 3, "Validate and convert first, then predict using that numeric result. Composition carries the intermediate type and units forward."),
            (f"def append_feature(value, items=None):\n    output = [] if items is None else items.copy()\n    output.append(value)\n    return output\ncaller = [10]\nfirst = append_feature({amount})\nsecond = append_feature({amount + 1})\nthird = append_feature({amount}, caller)\nresult = [first, second, third, caller]", [[amount], [amount + 1], [10, amount], [10]], [[amount], [amount, amount + 1], [10, amount], [10, amount]], "Create a fresh default on each call and copy supplied input before editing; neither a previous call nor caller-owned data should silently change."),
        ]
    elif lesson == 6:
        cases = [
            (f"values = [{amount}, {amount + 1}, {amount + 2}]\nresult = [value * 2 for value in values if value > {amount}]", [(amount + 1) * 2, (amount + 2) * 2], [amount * 2, (amount + 1) * 2, (amount + 2) * 2], "Filter each value using the stated predicate, then map it; a list comprehension preserves retained order and is not a reduction."),
            (f"records = [('A', {amount}, 100), ('B', None, 200), ('C', {amount + 1}, 300)]\npaired = [(row_id, area, target) for row_id, area, target in records if area is not None]\nresult = paired", [("A", amount, 100), ("C", amount + 1, 300)], [("A", amount, 100), ("C", amount + 1, 200)], "Use one record-level predicate so row IDs, features and targets stay aligned; separately filtering columns can pair C with B's target."),
            (f"records = [('A', {amount}), ('A', {amount + 1}), ('B', 9)]\nresult = {{row_id: value for row_id, value in records}}", {"A": amount + 1, "B": 9}, {"A": amount, "B": 9}, "A dictionary has one value per key; the later A insertion overwrites the earlier A, so duplicates can represent information loss."),
            (f"values = [{amount}, {amount + 1}]\noutput = []\nfor value in values:\n    output.append(value * 2)\nresult = output", [amount * 2, (amount + 1) * 2], amount * 2 + (amount + 1) * 2, "This readable loop maps each observation; an equivalent single-level comprehension produces the same list, not its sum."),
        ]
    elif lesson == 7:
        error_code = f"values = [{amount}]\nresult = values[1]"
        error_result = ["IndexError", "values[1]"]
        if amount in (3, 5):
            error_code = f"result = '{amount}' + 1"
            error_result = ["TypeError", "text + number"]
        elif amount in (2, 7):
            error_code = f"result = float('bad-{amount}')"
            error_result = ["ValueError", "float conversion"]
        cases = [
            (error_code, error_result, ["SyntaxError", "successful arithmetic"], "Match the failing operation to its input contract: indexing past the end is IndexError, mixing text and numbers is TypeError, and invalid numeric text is ValueError."),
            (f"text = 'unknown-{amount}'\ntry:\n    value = float(text)\nexcept ValueError:\n    result = ['invalid', None]\nelse:\n    result = ['valid', value]", ["invalid", None], ["valid", 0], "Catch the expected conversion failure narrowly and mark the record invalid. A zero feature is a valid number, not a substitute for failed conversion."),
            (f"import math\nresult = math.sqrt({amount**2})", float(amount), amount**2 + 1, "import binds the module name math; use its sqrt attribute. Importing is not training a model, and shadowing math would break the lookup."),
            (f"area = {amount}\nwrong = area + 1 * 100\nrepaired = (area + 1) * 100\nresult = [wrong, repaired, 'logic error']", [amount + 100, (amount + 1) * 100, "logic error"], [amount + 100, (amount + 1) * 100, "SyntaxError"], "The wrong expression is valid syntax and yields a plausible number. Parentheses repair its intended rule; a changed area exposes the logic error."),
        ]
    elif lesson == 8:
        bad_record = {"area": f"bad-{amount}", "age": ""} if amount % 2 else {"age": ""}
        cases = [
            (f"record = {bad_record!r}\nage = None if record['age'] == '' else float(record['age'])\ntry:\n    area = float(record['area'])\nexcept (KeyError, ValueError):\n    result = ['invalid required area', None, age]\nelse:\n    result = ['valid', area, age]", ["invalid required area", None, None], ["valid", 0, 0], "Validate required fields, numeric conversion and nullability before modeling. Missing or invalid required area rejects the record; missing age must not become an observed zero."),
            (f"import csv\nimport io\ncsv_text = 'area,age\\n{amount},0\\n'\nasset_name = 'data/houses.csv'\nwith io.StringIO(csv_text) as handle:\n    record = next(csv.DictReader(handle))\n    valid = float(record['area']) > 0\nresult = [handle.closed, valid, asset_name, 'open-read/parse-validate-close']", [True, True, "data/houses.csv", "open-read/parse-validate-close"], [False, True, "/Users/me/houses.csv", "close-open-validate"], "In this supplied program the context closes after parsing and validation. A declared relative bundled asset name is portable; an arbitrary machine-specific absolute path is not."),
            (f"import json\ndef validate(record):\n    return float(record['area'])\nrecord = json.loads('{{\"area\": \"{amount}\"}}')\nresult = [validate(record), 'parse-validate-return']", [float(amount), "parse-validate-return"], [str(amount), "return-parse-skip-validation"], "Parsing establishes syntax, not feature validity. Pass the parsed record through the validation function and return a usable numeric feature."),
            (f"class Record:\n    def __init__(self, area):\n        self.area = area\n    def doubled(self):\n        return self.area * 2\nfirst = Record({amount})\nsecond = Record({amount + 1})\nfirst.area = {amount + 2}\nresult = [first.area, second.area, first.doubled()]", [amount + 2, amount + 1, 2 * (amount + 2)], [amount + 2, amount + 2, 2 * (amount + 2)], "Each instance owns its area attribute; changing first does not change second. A method uses its own instance through self; this is introductory recognition, not advanced OOP."),
        ]
    else:
        raise ValueError("Only fixed P02–P08 author programs are supported.")
    code, expected, wrong, reason = cases[objective]
    namespace = {}
    tree = ast.parse(code)
    for node in ast.walk(tree):
        assert not isinstance(node, (ast.While, ast.AsyncFor, ast.Await, ast.Lambda, ast.ImportFrom))
        if isinstance(node, ast.Import):
            assert all(alias.name in ("math", "json", "csv", "io") for alias in node.names)
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            assert node.func.id not in ("eval", "exec", "compile", "open", "__import__")
    raises = expected[0] if lesson == 7 and objective == 0 else None
    try:
        exec(compile(code, "<trusted-authored-essentials-reference>", "exec"), namespace)
    except (IndexError, TypeError, ValueError) as error:
        if type(error).__name__ != raises:
            raise
        namespace["result"] = [type(error).__name__, expected[1]]
    else:
        assert raises is None
    actual = json.loads(display(namespace["result"]))
    assert actual == json.loads(display(expected)), (lesson, objective, actual, expected)
    assert actual != json.loads(display(wrong))
    assert len(code.splitlines()) <= 25
    return {"code": code, "expected": actual, "wrong": json.loads(display(wrong)), "reason": reason, "raises": raises}


def metadata():
    text = (ROOT / "docs/task-013-lesson-objective-matrix.md").read_text()
    lessons = []
    for number in range(1, 9):
        slug = f"P{number:02}"
        section = re.search(rf"^### {slug} (.*?)\n(.*?)(?=^### |^## |\Z)", text, re.M | re.S)
        body = section[2]
        field = lambda label: re.search(rf"\*\*{re.escape(label)}:\*\* (.*)", body)[1].strip()
        objectives = []
        for row in re.findall(r"^\| (P\d\d\.O\d)([^|]*)\|([^\n]*)", body, re.M):
            columns = [value.strip() for value in row[2].split("|")]
            objectives.append({"id": row[0], "critical": "**C**" in row[1], "introductory": "**I**" in row[1], "outcome": columns[0], "assessment": columns[1], "remediation": columns[2]})
        lessons.append({"slug": slug.lower(), "title": section[1], "prerequisites": field("Prerequisites"), "motivation": field("Motivation and mental model"), "progression": field("Progression beyond the worked example"), "terms": field("Key concepts"), "math": field("Mathematical connection"), "worked": field("Worked example"), "misconception": field("Misconception to confront"), "objectives": objectives})
    return lessons


def build():
    lessons = metadata()
    cases = []
    for lesson in range(2, 9):
        for objective in range(4):
            for mode, amounts in [("worked", [3]), ("practice", [1, 2]), ("mastery", [4, 5, 7])]:
                for variant, amount in enumerate(amounts):
                    case = authored_case(lesson, objective, amount)
                    cases.append({"lesson": f"p{lesson:02}", "objective": f"P{lesson:02}.O{objective + 1}", "mode": mode, "variant": variant, "amount": amount, **case})
    return {"contract": "python-essentials-reference.v1", "profile": "macos-arm64-cpython-3.13.16-reference.1", "author": "python/mlmath/essentials_reference.py", "lessons": lessons, "cases": cases}


if __name__ == "__main__":
    print(json.dumps(build(), indent=2, ensure_ascii=False, allow_nan=False))
