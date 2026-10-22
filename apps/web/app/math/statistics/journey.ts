import type {LessonSlug} from "./content";
export const STATISTICS_JOURNEY:Record<LessonSlug,{question:string;outcome:string;connection:string;explore:string;code:string;codeMeaning:string;transfer:string;reference:string;takeaway:string}>={
  "data": {
    "question": "What can these rows tell us about the world?",
    "outcome": "Identify observations, features and the population a claim concerns.",
    "connection": "Before calculating a summary, ask who was measured, how, and who is missing.",
    "explore": "Compare the concentrated and two-cluster presets. Each value represents one observation in a fictional dataset. Predict whether one shared average is enough to describe both groups; the explorer cannot establish representativeness of a real population.",
    "code": "values = [1, 2, 3]\nn = len(values)  # 3 observations\nmean = sum(values) / n  # 2.0",
    "codeMeaning": "len counts observations; sum collects their values; division averages the measured cases. Nothing in this calculation proves that the cases represent a wider population.",
    "transfer": "A survey includes only people who chose to reply. Would collecting more replies necessarily remove selection bias?",
    "reference": "No. More responses from the same biased selection process can still systematically miss other people. Precision and representativeness are different.",
    "takeaway": "Name the observation, feature, population and collection process before interpreting a statistic."
  },
  "center": {
    "question": "What does a typical value hide?",
    "outcome": "Choose and interpret a measure of center in context.",
    "connection": "A summary is a useful compression, but different summaries answer different questions.",
    "explore": "Compare Reference [1,2,3] with Right-tail outlier. Predict how the mean and median respond. Then compare the two mean-5 presets: does the same mean imply a similar dataset?",
    "code": "from statistics import mean, median\nvalues = [1, 2, 3, 100]\naverage = mean(values)  # 26.5\nmiddle = median(values)  # 2.5",
    "codeMeaning": "mean uses every value and is pulled by the large observation. median sorts conceptually and finds the middle; for four values it averages the two middle values. This is a separate four-value illustration.",
    "transfer": "For a strongly right-skewed salary dataset, why might median and mean tell different useful stories?",
    "reference": "The mean reflects total pay divided across people, including very high salaries. The median describes the middle person. The appropriate summary depends on the question.",
    "takeaway": "Ask what “typical” means for your decision; show the distribution alongside its center."
  },
  "spread": {
    "question": "How can the same average describe very different data?",
    "outcome": "Explain spread, squared units and the variance convention.",
    "connection": "Center locates the data; spread tells you how far observations differ from that center.",
    "explore": "Compare the concentrated and two-cluster presets with the same mean. Switch population and sample variance without changing the data, then multiply all values by 2. Predict what happens to SD versus variance.",
    "code": "from statistics import pvariance, pstdev\nvalues = [1, 2, 3]\nvariance = pvariance(values)  # 2/3\nsd = pstdev(values)  # about 0.8165",
    "codeMeaning": "These functions treat the listed values as a whole population and divide squared deviations by N. SD takes the square root, returning to the original units; sample variance would divide by n−1.",
    "transfer": "If every measurement is multiplied by 3, why does SD triple while variance increases ninefold?",
    "reference": "Deviations triple, their squares increase by 9, and averaging retains that factor. Taking the square root changes the variance factor 9 into an SD factor 3.",
    "takeaway": "State the convention and units. A shared mean does not imply a shared uncertainty or spread."
  },
  "distributions": {
    "question": "What shape is hiding behind the summary?",
    "outcome": "Use a distribution view without mistaking display choices for data changes.",
    "connection": "You can now describe center and spread. A distribution reveals patterns those two numbers may conceal.",
    "explore": "Choose Two clusters, mean 5. Change the histogram bin count while holding the data fixed. Predict which numerical summaries stay unchanged; inspect the box plot and the exact values as complementary views.",
    "code": "values = [0, 0, 10, 10]\ncounts = {value: values.count(value) for value in sorted(set(values))}\n# {0: 2, 10: 2}\nmean = sum(values) / len(values)  # 5.0",
    "codeMeaning": "The dictionary counts repeated values, rather than claiming a continuous density. The mean is 5 even though no observation equals 5. A chart should make that structure visible.",
    "transfer": "Can changing histogram bins make the same dataset look more or less clustered? Does that change the measurements?",
    "reference": "Yes, grouping can emphasize or hide patterns. It changes the representation, not the measured values. Check multiple views and report the binning.",
    "takeaway": "Charts are measurements made visible, with choices attached. Read axes, bins, units and population."
  },
  "relationships": {
    "question": "When two things move together, what have we learned?",
    "outcome": "Separate association from an intervention effect.",
    "connection": "Paired observations reveal relationships; they do not by themselves reveal the direction or mechanism of a cause.",
    "explore": "Inspect the observational twins: predict whether identical observed correlations force identical results after assigning X=1. Choose a prediction, reveal the comparison, and distinguish an intervention from filtering observed cases.",
    "code": "from statistics import correlation\nx = [1, 2, 3]\ny = [2, 4, 6]\nr = correlation(x, y)  # 1.0",
    "codeMeaning": "correlation summarizes linear association in paired rows. The same rows can arise under different causal mechanisms. This calculation contains no intervention information.",
    "transfer": "Two datasets have correlation 1. Must changing X cause the same change in Y in both?",
    "reference": "No. A common cause and a direct effect can generate the same observed relationship yet respond differently to intervention. Causal claims require additional assumptions and evidence.",
    "takeaway": "Correlation describes a pattern. A causal claim asks what would change under an intervention."
  },
  "sampling": {
    "question": "How much should a sample change our confidence?",
    "outcome": "Distinguish sampling variation, bias and assumptions behind inference.",
    "connection": "A statistic summarizes measured cases. Inference asks what those cases can support about a wider population.",
    "explore": "Hold the seed fixed and compare sample sizes. Then enable the biased sampling frame: can a larger sample repair the wrong frame? Compare repeated intervals with the known population mean; a finite run is not a guarantee of exact nominal coverage.",
    "code": "from math import sqrt\nsigma = 4\nn = 16\nstandard_error = sigma / sqrt(n)  # 1.0\nmargin = 1.96 * standard_error  # 1.96",
    "codeMeaning": "This known-SD teaching approximation assumes suitable independent sampling and an adequate normal approximation. More observations reduce this formula’s margin; they do not repair biased selection.",
    "transfer": "Why can a large, biased sample give a precise but wrong impression of a population?",
    "reference": "Its random variability may be small while systematic selection error remains. The uncertainty formula depends on the sampling assumptions being appropriate.",
    "takeaway": "An interval or test result inherits its assumptions. A p-value is not the probability that the null hypothesis is true."
  },
  "ml": {
    "question": "Could a perfect score be evidence of a mistake?",
    "outcome": "Recognize leakage and keep preprocessing inside the training boundary.",
    "connection": "Statistical care becomes part of building a model: what was available, what was fitted, and which data stayed held out?",
    "explore": "Toggle the copied-label feature and explain why perfect apparent accuracy is invalid. Then change the held-out test value with clean versus leaked scaling. Predict when the fitted training mean changes.",
    "code": "from statistics import mean, pstdev\ntrain = [0, 2]\ntest_value = 10\ncenter = mean(train)  # 1.0\nscale = pstdev(train)  # 1.0\nz_test = (test_value - center) / scale  # 9.0",
    "codeMeaning": "Only training values determine center and scale. The held-out value is transformed using that fixed reference; it must not help fit its own preprocessing. Zero training spread would need separate handling.",
    "transfer": "Why can a lower test error become misleading if you repeatedly use that test set to choose settings?",
    "reference": "The choices adapt to the test set, weakening its independence. Use validation for tuning and keep the final test for an appropriately independent evaluation.",
    "takeaway": "Good evidence respects timing, sampling and evaluation boundaries—not just a high score."
  }
};
