import { IIndustry } from "../IIndustry";

// Returns a boolean indicating whether the given material is relevant for the
// current industry.
export function isRelevantMaterial(
  matName: string,
  division: IIndustry,
): boolean {
  // Materials that affect Production multiplier
  const prodMultiplierMats = ["Hardware", "Robots", "AICores", "RealEstate"];

  if (Object.keys(division.reqMats).includes(matName)) {
    return true;
  }
  if (division.prodMats.includes(matName)) {
    return true;
  }
  if (prodMultiplierMats.includes(matName)) {
    return true;
  }

  return false;
}
