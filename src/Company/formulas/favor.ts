// The initial formulas was sum 0 to f of 500*1.02^f.
// see https://en.wikipedia.org/wiki/Geometric_series#Closed-form_formula
// for information on how to calculate this

export function favorToRep(f: number): number {
  const raw = 25000 * (Math.pow(1.02, f) - 1);
  return Math.round(raw * 10000) / 10000; // round to make things easier.
}

export function repToFavor(r: number): number {
  const raw = Math.log(r / 25000 + 1) / Math.log(1.02);
  return Math.round(raw * 10000) / 10000; // round to make things easier.
}
