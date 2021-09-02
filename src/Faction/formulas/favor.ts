// The initial formulas was sum 0 to f of 500*1.02^f.
// These formulas were derived on wolfram alpha.

// Wolfram Alpha: sum from 0 to n of 500*1.02^n
export function favorToRep(f: number): number {
    return 500 * ((Math.pow(51, f+1)) / Math.pow(50,f) - 50);
}

// Wolfram Alpha: 500 (50^(-n) 51^(n + 1) - 50) solve for n
export function repToFavor(r: number): number {
    return -(Math.log(25500/(r + 25000)))/Math.log(51/50);
}