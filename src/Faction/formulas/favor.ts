// The initial formulas was sum 0 to f of 500*1.02^f.
// These formulas were derived on wolfram alpha.

// Wolfram Alpha: sum from 0 to n of 500*1.02^n
// 500 * ((pow(51, f+1)) / pow(50,f) - 50)
// Then we use https://herbie.uwplse.org/demo/ to simplify it and prevent
// Infinity issues.
export function favorToRep(f: number): number {
  function fma(a: number, b: number, c: number): number {
    return a * b + c;
  }
  const ex = fma(f - 1, Math.log(51.0) - Math.log(50.0), Math.log(51.0));
  const raw = fma(500.0, Math.exp(ex), -25000.0);
  return Math.round(raw * 10000) / 10000; // round to make things easier.
}

// Wolfram Alpha: 500 (50^(-n) 51^(n + 1) - 50) solve for n
export function repToFavor(r: number): number {
  const raw = Math.log((r + 25000) / 25500) / Math.log(1.02) + 1;
  return Math.round(raw * 10000) / 10000; // round to make things easier.
}
