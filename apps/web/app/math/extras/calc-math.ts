/** Pure maths behind the Calculus playgrounds. The lesson text, the charts and the Python cells all agree with these. */
export const sqr = (x: number) => x * x;
/** Slope of the line through (x, f(x)) and (x+h, f(x+h)). For f = x², it is exactly 2x + h. */
export const secant = (f: (x: number) => number, x: number, h: number) => (f(x + h) - f(x)) / h;
export const central = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);

export type Rule = { id: string; name: string; label: string; f: (x: number) => number; rule: (x: number) => number; tempting: (x: number) => number; ruleText: string; temptingText: string; why: string };
export const RULE_CASES: Rule[] = [
  { id: "power", name: "Power rule", label: "x³", f: (x) => x ** 3, rule: (x) => 3 * x ** 2, tempting: (x) => 3 * x ** 3, ruleText: "3x²", temptingText: "3x³", why: "The exponent comes down as a multiplier, then drops by one. Keeping it at 3 forgets the drop." },
  { id: "product", name: "Product rule", label: "x²·eˣ", f: (x) => x * x * Math.exp(x), rule: (x) => 2 * x * Math.exp(x) + x * x * Math.exp(x), tempting: (x) => 2 * x * Math.exp(x), ruleText: "2x·eˣ + x²·eˣ", temptingText: "2x·eˣ", why: "Both factors change, so each takes a turn while the other waits. Differentiating each factor and multiplying skips half the change." },
  { id: "quotient", name: "Quotient rule", label: "x²/(x+1)", f: (x) => (x * x) / (x + 1), rule: (x) => (2 * x * (x + 1) - x * x) / (x + 1) ** 2, tempting: (x) => 2 * x, ruleText: "(2x(x+1) − x²)/(x+1)²", temptingText: "2x ÷ 1", why: "The denominator moves too, and it scales everything. Dividing the two derivatives ignores that." },
  { id: "chain", name: "Chain rule", label: "(2w−6)²", f: (x) => (2 * x - 6) ** 2, rule: (x) => 4 * (2 * x - 6), tempting: (x) => 2 * (2 * x - 6), ruleText: "2(2w−6)·2", temptingText: "2(2w−6)", why: "The outer square responds to its input, and that input responds to w. Multiply the two responses." },
  { id: "exp", name: "Exponential", label: "e³ˣ", f: (x) => Math.exp(3 * x), rule: (x) => 3 * Math.exp(3 * x), tempting: (x) => Math.exp(3 * x), ruleText: "3e³ˣ", temptingText: "e³ˣ", why: "eˣ is its own derivative, but the 3 inside is a chain rule factor." },
  { id: "log", name: "Natural log", label: "ln(x²)", f: (x) => Math.log(x * x), rule: (x) => 2 / x, tempting: (x) => 1 / (x * x), ruleText: "2/x", temptingText: "1/x²", why: "The outer ln gives 1 over its input, and the inner x² contributes a factor 2x. Together: 2x/x² = 2/x." },
];
export const ruleCase = (id: string) => RULE_CASES.find((r) => r.id === id) ?? RULE_CASES[0];

/** The one function used for the step-size lab: f(x) = eˣ, whose slope is eˣ exactly. */
export const STEP_F = Math.exp;
export const stepError = (k: number, x = 1) => Math.abs(central(STEP_F, x, 10 ** -k) - Math.exp(x));
export const STEP_KS = Array.from({ length: 57 }, (_, i) => 1 + i * 0.25); // h = 1e-1 … 1e-15

/** Chain-rule debugging model: prediction = w·x, loss = (w·x − y)². */
export const dbgLoss = (w: number, x: number, y: number) => (w * x - y) ** 2;
export const dbgCorrect = (w: number, x: number, y: number) => 2 * (w * x - y) * x;
export const dbgBuggy = (w: number, _x: number, y: number) => 2 * (w * _x - y);
export const dbgNumeric = (w: number, x: number, y: number) => central((v) => dbgLoss(v, x, y), w);
