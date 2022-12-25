// Map of material (by name) to their sizes (how much space it takes in warehouse)
export const MaterialInfo: Record<string, [string, number, boolean]> = {
  Water: ["Water", 0.05, false],
  Energy: ["Energy", 0.01, false],
  Food: ["Food", 0.03, false],
  Plants: ["Plants", 0.05, false],
  Metal: ["Metal", 0.1, false],
  Hardware: ["Hardware", 0.06, true],
  Chemicals: ["Chemicals", 0.05, false],
  Drugs: ["Drugs", 0.02, false],
  Robots: ["Robots", 0.5, true],
  AICores: ["AI Cores", 0.1, true],
  RealEstate: ["Real Estate", 0.005, true],
};
