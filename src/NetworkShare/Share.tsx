import { CalculateShareMult as CSM } from "./formulas/share";

export let sharePower = 1;

export function StartSharing(threads: number): () => void {
  sharePower += threads;
  return () => (sharePower -= threads);
}

export function CalculateShareMult(): number {
  console.log(`${sharePower} => ${CSM(sharePower)}`);
  return CSM(sharePower);
}
