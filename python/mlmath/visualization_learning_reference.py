import ast
import hashlib
import json
import math
import platform
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.cbook import boxplot_stats

LESSONS = json.loads(r'''[{"slug":"v01","title":"Figures, axes and readable measurement","prerequisites":"P05, N01; optional D01.","motivation":"A chart encodes measurements and a question; axes and units are part of its truthfulness.","progression":"Plot ordered predictions, then swap axes/units or an unordered customer sequence.","terms":"Figure, Axes, plot, title, x/y label, units, legend, scale.","math":"Functions, coordinates and feature/target units.","worked":"With area [1,2,3], age held at 10, weights [100,−2] and bias 50, predictions are [130,230,330] ($k). Labeling the price axis dollars rather than $k changes the communicated meaning.","misconception":"An unlabeled line is not self-explanatory; the code variable name is not an axis label.","objectives":[{"id":"V01.O1","critical":false,"introductory":false,"outcome":"Match Figure/Axes roles to a supplied Matplotlib program.","assessment":"Choose where plot and labeling methods belong.","remediation":"Annotate the small fig, ax creation trace."},{"id":"V01.O2","critical":true,"introductory":false,"outcome":"Choose correct coordinates, units and truthful series labels.","assessment":"Repair swapped axes/unit labels and explain the consequence.","remediation":"Map each axis back to the input table."},{"id":"V01.O3","critical":false,"introductory":false,"outcome":"Predict a line plot only when order/continuity is justified.","assessment":"Reject a line through arbitrarily ordered customers.","remediation":"Compare row order with the intended independent variable."},{"id":"V01.O4","critical":false,"introductory":false,"outcome":"Provide non-color-only labels and a numerical alternative.","assessment":"Select a usable legend/marker/table combination.","remediation":"Read the chart using only its textual description."}]},{"slug":"v02","title":"Histograms show distributions, not individual paths","prerequisites":"V01; Statistics distributions.","motivation":"Histograms aggregate intervals; probability is area when density is used.","progression":"Predict two bins, then change widths or include an outlier.","terms":"histogram, bin edge, count, density, bin width, outlier.","math":"Frequency versus density; area rather than height for unequal widths.","worked":"For ages [0,1,2,3] with bins [0,2,4], counts are [2,2]. In density mode with width 2 each height is .25 and total area is 1.","misconception":"Density height is not bin probability unless width is one; changing bins changes appearance.","objectives":[{"id":"V02.O1","critical":false,"introductory":false,"outcome":"Predict bin membership including the final right edge convention.","assessment":"Select counts for a changed bounded dataset.","remediation":"Place values in labeled half-open bins, final bin right-inclusive."},{"id":"V02.O2","critical":true,"introductory":false,"outcome":"Distinguish count, density height and probability area.","assessment":"Repair a density-as-probability claim and justify using width.","remediation":"Multiply each density height by bin width."},{"id":"V02.O3","critical":false,"introductory":false,"outcome":"Explain the effect of bins and outliers on interpretation.","assessment":"Choose a cautious conclusion after a bin change.","remediation":"Compare the same raw values under both plots."},{"id":"V02.O4","critical":false,"introductory":false,"outcome":"Choose a histogram for a quantitative distribution rather than a relationship.","assessment":"Select a plot matching a new distribution question.","remediation":"State whether one variable or paired variables are being studied."}]},{"slug":"v03","title":"Scatterplots, relationships and causal caution","prerequisites":"V01; Statistics relationships.","motivation":"The same observational pattern can support different intervention predictions.","progression":"Compare paired/subgroup points and a causal counterexample.","terms":"scatter, association, confounder, subgroup, overplotting, intervention.","math":"Correlation, nonlinear association and observational versus causal effects.","worked":"A supplied table has training_hours and score rising together while prior_experience differs by subgroup. A fitted line or colored groups alone cannot identify the effect of an extra hour.","misconception":"A persuasive scatterplot or a large correlation is not causal evidence; zero correlation need not mean no relationship.","objectives":[{"id":"V03.O1","critical":false,"introductory":false,"outcome":"Preserve paired observations and inspect shape/outliers.","assessment":"Reject a separately sorted x/y chart.","remediation":"Reconnect points by row ID."},{"id":"V03.O2","critical":true,"introductory":false,"outcome":"Distinguish association from an identified intervention effect.","assessment":"Reject a causal claim and choose the missing design/assumption explanation.","remediation":"Return to Statistics common-cause/intervention contrasts."},{"id":"V03.O3","critical":false,"introductory":false,"outcome":"Recognize subgroup confounding and nonlinear patterns.","assessment":"Choose interpretations of pooled versus grouped/curved cases.","remediation":"Compare group membership and within-group patterns."},{"id":"V03.O4","critical":false,"introductory":false,"outcome":"Use labels/markers and point tables to avoid color-only meaning.","assessment":"Select a readable small scatter design.","remediation":"Trace one named observation through the numerical alternative."}]},{"slug":"v04","title":"Box plots summarize spread with conventions","prerequisites":"V01–V02; Statistics quartiles.","motivation":"A box plot is a convention-dependent summary, not a verdict on which data to discard.","progression":"Rebuild quartiles/fences, then compare a valid extreme observation.","terms":"median, quartile, IQR, whisker, outlier, quantile method.","math":"Five-number-style summaries; plotted outliers are not automatic data errors.","worked":"For [1,2,3,4,5,20] with the pinned linear quantile method, Q1=2.25, median=3.5, Q3=4.75; IQR=2.5 and 20 lies beyond the upper 1.5-IQR fence.","misconception":"The box center is not necessarily the mean; whiskers are not always min/max; an outlier marker does not justify deletion.","objectives":[{"id":"V04.O1","critical":false,"introductory":false,"outcome":"Interpret box, whiskers and marked observations using the stated convention.","assessment":"Label a changed plot from a matching summary table.","remediation":"Rebuild the plot from ordered values and fences."},{"id":"V04.O2","critical":true,"introductory":false,"outcome":"Distinguish median/IQR from mean/standard deviation.","assessment":"Repair a mislabeled summary and explain robustness.","remediation":"Compare definitions and units in Statistics recall."},{"id":"V04.O3","critical":false,"introductory":false,"outcome":"Assess outlier influence without automatically removing observations.","assessment":"Choose an investigation rather than unsupported deletion.","remediation":"Compare provenance and summaries with/without the point."},{"id":"V04.O4","critical":false,"introductory":false,"outcome":"Compare group summaries without claiming equal sample sizes or causation.","assessment":"Select a limited conclusion with group counts shown.","remediation":"Inspect counts and the unaggregated value tables."}]},{"slug":"v05","title":"Choose charts and detect misleading claims","prerequisites":"V01–V04.","motivation":"Scale choices change perception without changing the underlying measured difference.","progression":"Compare disclosed axes/bins and repair a misleading conclusion.","terms":"truncated axis, shared scale, cherry-picking, normalization, exploratory analysis.","math":"Scale invariance of values versus perceptual differences; exploratory evidence is not confirmatory proof.","worked":"Two lines ending at 100 and 102 can look dramatically different on an axis [99,103]. A zoomed axis may reveal detail, but its limits and absolute difference must be explicit.","misconception":"A truncated axis is not automatically forbidden, but hiding its range or mixing scales can mislead; appearance is not effect size.","objectives":[{"id":"V05.O1","critical":true,"introductory":false,"outcome":"Detect misleading scale/denominator choices and propose a transparent repair.","assessment":"Choose a repair plus absolute-unit explanation for a new chart.","remediation":"Compare identical data under disclosed common scales."},{"id":"V05.O2","critical":false,"introductory":false,"outcome":"Select line/scatter/histogram/box plot for a stated ML question.","assessment":"Match a new diagnostic question to a chart and rationale.","remediation":"Identify time/order, pairing or distribution first."},{"id":"V05.O3","critical":false,"introductory":false,"outcome":"Separate descriptive visual evidence from generalization claims.","assessment":"Reject a chart-based claim of unseen-data performance.","remediation":"Trace which rows the plot actually contains."},{"id":"V05.O4","critical":false,"introductory":true,"outcome":"Explain why exploratory pattern hunting needs later validation (introductory).","assessment":"Choose a cautious follow-up rather than proof from a selected pattern.","remediation":"Distinguish exploration from a predeclared evaluation."}]}]''')
REASONS = json.loads(r'''[["Figure contains the Axes; plot and axis-label methods belong to that coordinate system. A variable name does not label a measurement.","Map area to x and predicted price in thousands of dollars to y. These are predictions with age held fixed, not measured sale prices or a fitted causal effect.","A line connects observations in supplied order. Ordered area supports this slice; arbitrary customer IDs do not establish continuity.","Use explicit series names and distinct markers/line styles plus a coordinate table; color alone must not carry the distinction."],["Bins are left-inclusive and right-exclusive except the last includes its right edge. List membership before counting.","Density height is count divided by included count and bin width. Bin probability is height times width, not the height alone.","Changing edges changes aggregation and can conceal an extreme value; compare identical raw values and disclose excluded values.","A histogram answers the distribution of one quantitative variable; a scatterplot answers a paired-variable relationship."],["Each x must stay with its own y and row ID. Independently sorting coordinates invents different observations even if the marginal values stay unchanged.","Identical observational points can come from different causal stories with different intervention effects. Association alone cannot choose the story or identify an extra-hour effect.","Check within-group patterns and curvature. A pooled slope may reflect group composition; zero linear correlation can coexist with a curved relationship.","Names and distinct markers identify groups without color; an ID-labeled coordinate table preserves every pairing."],["Quartiles use linear interpolation. Whiskers end at observed values inside the 1.5-IQR fences; the fence itself need not be observed.","IQR is Q3 minus Q1 around the median, not standard deviation around the mean. An extreme point can shift the mean strongly without the same shift in the median.","A marked point is a reason to investigate provenance and influence, not proof of error or permission for automatic deletion.","A box does not encode sample size or identify a causal group effect. Compare supplied group counts and raw values before interpreting."],["Both common limits and a clearly disclosed zoom can be honest when units, denominator and the absolute difference are stated. A visually larger gap does not change the measured difference.","Choose line for justified order, scatter for pairs, histogram for one distribution, box for convention-defined group summaries. The question comes before syntax.","A plot describes the supplied rows; it cannot establish performance on unseen observations without the later evaluation design.","Exploration generates questions. Selecting a striking pattern is not independent validation; predeclare and later evaluate the claim rather than call the selected picture proof."]]''')
MISCONCEPTIONS = json.loads(r'''[["Figure and Axes are interchangeable labels for the same plotting method.","A price measured in thousands can be labeled dollars without changing meaning.","Connecting arbitrary customer-row order establishes a meaningful trend.","Different colors alone make series universally distinguishable."],["Every bin excludes its right edge, including the last.","Density height is the probability of the bin regardless of its width.","The same values always look the same regardless of bin edges.","A histogram shows which paired feature causes the target."],["Sorting x and y separately preserves paired observations.","A strong observational correlation proves that intervening on x changes y by the fitted slope.","Zero correlation proves there is no relationship, and pooled patterns always hold within groups.","A color legend alone preserves group identity for every learner."],["Whiskers always end at the minimum and maximum, including every extreme.","The box center is the mean and the IQR is the standard deviation.","A point outside the whisker must be deleted before machine learning.","Equal-sized boxes imply equal sample counts and a causal group effect."],["A narrow hidden axis makes the measured absolute difference larger.","The most impressive-looking plot is the correct chart regardless of the question.","A convincing training-data chart proves generalization to new data.","A pattern chosen after exploration is already independently validated."]]''')
PROFILE = {"python": "3.13.16", "numpy": "2.5.4", "pandas": "3.0.6", "matplotlib": "3.11.2", "sklearn": "1.9.1"}
SOURCE = {"id": "visualization-teaching.v1", "provenance": "Original fictional fixed teaching values; no real personal records.", "permission": "Project-authored educational examples; no credentials or uploads.", "units": "House area in hundreds of square metres; prediction in thousands of dollars; other fixtures label their own units.", "limitations": "Small constructed samples illustrate conventions, not population inference or causal identification."}
SOURCE["sha256"] = hashlib.sha256(json.dumps({"lessons": LESSONS, "source": SOURCE}, sort_keys=True).encode()).hexdigest()


def normalize(value):
    if isinstance(value, np.ndarray):
        return normalize(value.tolist())
    if isinstance(value, np.generic):
        return normalize(value.item())
    if isinstance(value, dict):
        return {str(key): normalize(item) for key, item in value.items()}
    if isinstance(value, (tuple, list)):
        return [normalize(item) for item in value]
    if isinstance(value, float):
        if not math.isfinite(value):
            return {"tag": "undefined", "reason": "nonfinite"}
        return int(value) if value.is_integer() else value
    if value is None or type(value) in (str, int, bool):
        return value
    raise ValueError("Unsupported trusted chart value")


def chart_spec(axes, kind, boxes=None, density=False):
    if axes.get_xscale() != "linear" or axes.get_yscale() != "linear":
        raise ValueError("Only authored linear axes")
    series = []
    if kind == "line":
        series = [{"name": line.get_label(), "x": line.get_xdata().tolist(), "y": line.get_ydata().tolist(), "marker": line.get_marker(), "style": line.get_linestyle()} for line in axes.lines]
    if kind == "scatter":
        series = [{"name": collection.get_label(), "x": collection.get_offsets()[:, 0].tolist(), "y": collection.get_offsets()[:, 1].tolist(), "marker": "circle" if index == 0 else "triangle", "style": "points"} for index, collection in enumerate(axes.collections)]
    bars = [{"left": patch.get_x(), "width": patch.get_width(), "height": patch.get_height()} for patch in axes.patches] if kind == "histogram" else []
    offset = 0
    for item in series:
        start = offset if kind == "scatter" else 0
        item["ids"] = [f"R{start + index + 1}" for index in range(len(item["x"]))]
        offset += len(item["x"])
    return normalize({"type": kind, "title": axes.get_title(), "xlabel": axes.get_xlabel(), "ylabel": axes.get_ylabel(), "xlim": axes.get_xlim(), "ylim": axes.get_ylim(), "series": series, "bars": bars, "boxes": boxes or [], "density": density})


def authored_case(lesson, objective, amount):
    if type(lesson) is not int or type(objective) is not int or type(amount) is not int or lesson not in range(1, 6) or objective not in range(4) or not (amount in range(6) or lesson == 1 and objective == 1 and amount in (6, 7)):
        raise ValueError("Unsupported authored chart configuration")
    prefix = ["import numpy as np", "import matplotlib.pyplot as plt", "from matplotlib.cbook import boxplot_stats", "fig, ax = plt.subplots()"]
    if lesson == 1:
        values = [1, 2, 3] if amount > 5 else [1 + amount, 2 + amount, 3 + amount]
        body = [f"area = np.array({values}, dtype=float)", "price = 100 * area - 2 * 10 + 50", "ax.plot(area, price, marker='o', linestyle='-', label='Prediction; age=10')", "ax.set(xlabel='Area (hundreds of square metres)', ylabel='Predicted price (thousands of dollars)', title='Ordered prediction slice')", "ax.legend()", "charts = [chart_spec(ax, 'line')]"]
        if objective == 0:
            body += ["result = {'canvas': type(fig).__name__, 'coordinate_system': type(ax).__name__, 'method_owner': 'Axes', 'points': list(zip(area, price))}"]
        elif objective == 1:
            body += ["result = {'x': area, 'y': price, 'x_units': 'hundreds of square metres', 'y_units': 'thousands of dollars', 'series': 'predicted price; age fixed at 10'}"]
            if amount == 6:
                body += ["ax.clear()", "ax.plot(price, area, marker='o', label='Prediction; coordinates wrongly swapped')", "ax.set(xlabel='Area (hundreds of square metres)', ylabel='Predicted price (thousands of dollars)', title='Teaching error: swapped coordinates')", "charts = [chart_spec(ax, 'line')]", "result['plotted_x'] = price; result['plotted_y'] = area", "result['repair'] = 'Restore area as x and price in thousands as y; labels must describe the actual coordinates.'"]
            elif amount == 7:
                body += ["ax.set(ylabel='Predicted price (dollars)', title='Teaching error: incorrect price units')", "charts = [chart_spec(ax, 'line')]", "result['communicated_units'] = 'dollars (incorrect for these numeric values)'", "result['repair'] = 'Relabel thousands of dollars; converting to dollars instead requires multiplying every price by 1000.'"]
        elif objective == 2:
            body += [f"customer_order = {['H3','H1','H2'] if amount % 2 else ['H2','H3','H1']}", "result = {'ordered_area': area, 'predictions': price, 'customer_order': customer_order, 'customer_line_justified': False}"]
        else:
            body += ["ax.plot(area, price + 20, marker='^', linestyle='--', label='Alternative supplied prediction')", "ax.legend()", "charts = [chart_spec(ax, 'line')]", "result = {'names': [line.get_label() for line in ax.lines], 'markers': [line.get_marker() for line in ax.lines], 'coordinate_table': list(zip(area, price, price + 20))}"]
    elif lesson == 2:
        values = [0, 1 + amount / 10, 2, 3 + amount / 10]
        edges = [0, 2, 4] if amount % 2 == 0 else [0, 1.5, 4]
        if objective == 0:
            values = [0, edges[1], 3, 4] if amount == 0 else [0, edges[1], 4] + [edges[1] if index % 2 == 0 else 0.5 for index in range(amount)]
        if objective == 2:
            values += [8 + amount]
        density = objective == 1
        body = [f"values = np.array({values}, dtype=float)", f"edges = np.array({edges}, dtype=float)", f"heights, returned_edges, patches = ax.hist(values, bins=edges, density={density})", "counts, _ = np.histogram(values, bins=edges)", "widths = np.diff(edges)", "included = int(counts.sum())", "density_heights = counts / (included * widths)", f"ax.set(xlabel='Age (years)', ylabel={'\'Density (per year)\'' if density else '\'Count (observations)\''}, title='Same source, explicit bins')", f"charts = [chart_spec(ax, 'histogram', density={density})]", "result = {'raw': values, 'edges': edges, 'counts': counts, 'widths': widths, 'density_heights': density_heights, 'areas': density_heights * widths, 'included': included, 'excluded': len(values) - included, 'plotted_heights': heights}"]
        if objective == 0:
            body += ["result['answer'] = int(counts[-1])"]
        if objective == 3:
            body += ["result['question'] = 'Distribution of one quantitative age variable, not paired prediction or causation.'"]
        body += ["result['source_ids'] = ['A' + str(index + 1) for index in range(len(values))]", "result['member_ids'] = [['A' + str(index + 1) for index, value in enumerate(values) if value >= left and (value < right or bin_index == len(edges) - 2 and value <= right)] for bin_index, (left, right) in enumerate(zip(edges[:-1], edges[1:]))]"]
    elif lesson == 3:
        shift = amount * 2
        if objective == 0:
            xvalues, yvalues = [1, 2, 3], [3 + shift, 1 + shift, 2 + shift]
        elif objective == 2 and amount % 2:
            xvalues, yvalues = [0, 1, 2, 3, 4], [4 + shift, 1 + shift, shift, 1 + shift, 4 + shift]
        elif objective == 2:
            xvalues, yvalues = [1, 2, 5, 6], [3 + shift, 1 + shift, 8 + shift, 6 + shift]
        else:
            xvalues, yvalues = [1, 2, 3, 4], [2 + shift, 4 + shift, 6 + shift, 8 + shift]
        body = [f"hours = np.array({xvalues}, dtype=float)", f"score = np.array({yvalues}, dtype=float)", "ids = ['R' + str(index + 1) for index in range(len(hours))]", "ax.scatter(hours[:2], score[:2], marker='o', label='Prior experience A')", "ax.scatter(hours[2:], score[2:], marker='^', label='Prior experience B')", "ax.set(xlabel='Training hours', ylabel='Score (points)', title='Observations, not an identified intervention')", "ax.legend()", "charts = [chart_spec(ax, 'scatter')]", "result = {'ids': ids, 'x': hours, 'y': score, 'correlation': float(np.corrcoef(hours, score)[0, 1]), 'causal_effect_identified': False}"]
        if objective == 0:
            body += ["result['wrong_independent_sort_pairs'] = list(zip(np.sort(hours), np.sort(score)))"]
        elif objective == 1:
            body += [f"result['stories'] = {{'direct': 'score=2*hours+offset', 'common_cause': 'hours=experience; score=2*experience+offset', 'observational_offset': {shift}, 'extra_hour_effect_direct': 2, 'extra_hour_effect_common_cause': 0}}"]
        elif objective == 2:
            body += ["result['within_group_correlations'] = [float(np.corrcoef(hours[:2], score[:2])[0, 1]), float(np.corrcoef(hours[2:], score[2:])[0, 1])]", "result['claim'] = 'Inspect groups and nonlinear shape; correlation alone does not identify a causal effect.'"]
        else:
            body += ["result['group_markers'] = {'A': 'circle', 'B': 'triangle'}"]
    elif lesson == 4:
        values = [value * (1 + amount / 2) + amount for value in [1, 2, 3, 4, 5, 20]]
        body = [f"values = np.array({values}, dtype=float)", "stats = boxplot_stats(values, whis=1.5, labels=['Supplied group'])", "artists = ax.bxp(stats, showmeans=False)", "ax.set(xlabel='Group', ylabel='Feature value (units)', title='Linear quartiles and observed whiskers')", "charts = [chart_spec(ax, 'box', boxes=stats)]", "quartiles = np.quantile(values, [0.25, 0.5, 0.75], method='linear')", "result = {'raw': values, 'quartiles': quartiles, 'iqr': float(quartiles[2] - quartiles[0]), 'fences': [float(quartiles[0] - 1.5 * (quartiles[2] - quartiles[0])), float(quartiles[2] + 1.5 * (quartiles[2] - quartiles[0]))], 'whiskers': [stats[0]['whislo'], stats[0]['whishi']], 'outliers': stats[0]['fliers'], 'count': len(values), 'mean': float(np.mean(values)), 'standard_deviation_ddof0': float(np.std(values, ddof=0))}"]
        if objective == 1:
            body += ["result['answer'] = result['iqr']"]
        elif objective == 2:
            body += ["result['without_extreme_mean'] = float(np.mean(values[:-1]))", "result['delete_automatically'] = False"]
        elif objective == 3:
            body += ["other = values[:3]", "other_stats = boxplot_stats(other, whis=1.5, labels=['Smaller group'])", "ax.bxp(other_stats, positions=[2], showmeans=False)", "charts = [chart_spec(ax, 'box', boxes=stats + other_stats)]", "result['group_counts'] = [len(values), len(other)]", "result['causal_group_effect_identified'] = False"]
    else:
        start, difference = 100 + amount * 10, 2 + amount
        body = [f"values = np.array([{start}, {start + difference}], dtype=float)", "ax.plot([1, 2], values, marker='o', label='Supplied measurement')", f"ax.set(xlabel='Ordered measurement', ylabel='Price (thousands of dollars)', title='Disclosed zoom', ylim=({start - 1}, {start + difference + 1}))", "ax.legend()", "zoom = chart_spec(ax, 'line')", f"ax.set(title='Common baseline comparison', ylim=(0, {start + difference + 10}))", "charts = [zoom, chart_spec(ax, 'line')]", "result = {'values': values, 'absolute_difference': float(values[1] - values[0]), 'units': 'thousands of dollars', 'zoom_limits': zoom['ylim'], 'common_limits': charts[1]['ylim'], 'same_data': True}"]
        if objective == 0:
            body += ["result['safe_repairs'] = ['common disclosed scale + absolute-unit claim', 'disclosed zoom + absolute-unit claim']"]
        elif objective == 1:
            questions = ["Ordered supplied prediction slice", "Paired house area and price", "Distribution of one age feature", "Compare convention-defined group spread"]
            answers = ["line", "scatter", "histogram", "box"]
            body += [f"result['question'] = {questions[amount % 4]!r}", f"result['chart_choice'] = {answers[amount % 4]!r}"]
        elif objective == 2:
            body += [f"result['displayed_ids'] = {['H'+str(amount+1), 'H'+str(amount+2)]!r}", "result['unseen_performance_established'] = False"]
        else:
            body += ["result['depth'] = 'introductory'", "result['next_step'] = 'Predeclare a claim and validate later; selected exploratory patterns are not proof.'"]
    code = "\n".join(prefix + body)
    if len(code.splitlines()) > 25 or len(code.encode()) > 4096:
        raise ValueError("Authored snippet bound")
    tree = ast.parse(code)
    if any(isinstance(node, (ast.While, ast.Lambda, ast.GeneratorExp, ast.AsyncFunctionDef)) for node in ast.walk(tree)):
        raise ValueError("Unsupported authored construct")
    namespace = {"chart_spec": chart_spec}
    try:
        exec(compile(tree, "<trusted-authored-visualization>", "exec"), namespace)
        expected, charts = normalize(namespace["result"]), normalize(namespace["charts"])
        for chart in charts:
            if chart["type"] == "box":
                assert chart["boxes"][0]["med"] == expected["quartiles"][1]
        return {"objective": f"V{lesson:02}.O{objective + 1}", "amount": amount, "code": code, "expected": expected, "charts": charts, "reason": REASONS[lesson - 1][objective], "misconception": MISCONCEPTIONS[lesson - 1][objective]}
    finally:
        plt.close("all")


def build():
    cases = []
    for lesson in range(1, 6):
        for objective in range(4):
            for amount, mode, variant in [(0, "worked", 0), (1, "practice", 0), (2, "practice", 1), (3, "mastery", 0), (4, "mastery", 1), (5, "mastery", 2)]:
                cases.append({**authored_case(lesson, objective, amount), "mode": mode, "variant": variant})
    for variant, amount in enumerate((6, 7)):
        cases.append({**authored_case(1, 1, amount), "mode": "experiment", "variant": variant})
    manifest = {**SOURCE, "author_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), "cases_sha256": hashlib.sha256(json.dumps(cases, sort_keys=True).encode()).hexdigest()}
    return {"contract": "python.visualization.fixtures.v1", "profile": PROFILE, "manifest": manifest, "lessons": LESSONS, "cases": cases}
