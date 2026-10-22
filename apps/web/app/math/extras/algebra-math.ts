// Pure maths behind the Algebra playgrounds. Every number quoted in the lessons is asserted in tests.
export const bill = (n: number, book = 120, price = 35) => book + price * n;
export const solveLinear = (a: number, b: number, total: number) => (total - b) / a;
export const fare = (d: number) => 2 * d + 3;
export const FARE_MAX = 30;
export const growth = { linear: (d: number) => 10 + 10 * d, doubling: (d: number) => 10 * 2 ** d };
export const crossoverDay = () => { for (let d = 0; d < 60; d++) if (growth.doubling(d) > growth.linear(d)) return d; return -1; };
export const compound = (n: number) => (1 + 1 / n) ** n;
export const doublings = (target: number) => Math.log2(target);
export const sq = (x: number) => x * x, lin = (x: number) => 2 * x + 1;
