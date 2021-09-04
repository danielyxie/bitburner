import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { HacknetNodeConstants } from "../data/Constants";

export function calculateMoneyGainRate(
  level: number,
  ram: number,
  cores: number,
  mult: number,
): number {
  const gainPerLevel = HacknetNodeConstants.MoneyGainPerLevel;

  const levelMult = level * gainPerLevel;
  const ramMult = Math.pow(1.035, ram - 1);
  const coresMult = (cores + 5) / 6;
  return (
    levelMult * ramMult * coresMult * mult * BitNodeMultipliers.HacknetNodeMoney
  );
}

export function calculateLevelUpgradeCost(
  startingLevel: number,
  extraLevels = 1,
  costMult = 1,
): number {
  const sanitizedLevels = Math.round(extraLevels);
  if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
    return 0;
  }

  if (startingLevel >= HacknetNodeConstants.MaxLevel) {
    return Infinity;
  }

  const mult = HacknetNodeConstants.UpgradeLevelMult;
  let totalMultiplier = 0;
  let currLevel = startingLevel;
  for (let i = 0; i < sanitizedLevels; ++i) {
    totalMultiplier +=
      HacknetNodeConstants.LevelBaseCost * Math.pow(mult, currLevel);
    ++currLevel;
  }

  return (HacknetNodeConstants.BaseCost / 2) * totalMultiplier * costMult;
}

export function calculateRamUpgradeCost(
  startingRam: number,
  extraLevels = 1,
  costMult = 1,
): number {
  const sanitizedLevels = Math.round(extraLevels);
  if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
    return 0;
  }

  if (startingRam >= HacknetNodeConstants.MaxRam) {
    return Infinity;
  }

  let totalCost = 0;
  let numUpgrades = Math.round(Math.log2(startingRam));
  let currentRam = startingRam;

  for (let i = 0; i < sanitizedLevels; ++i) {
    const baseCost = currentRam * HacknetNodeConstants.RamBaseCost;
    const mult = Math.pow(HacknetNodeConstants.UpgradeRamMult, numUpgrades);

    totalCost += baseCost * mult;

    currentRam *= 2;
    ++numUpgrades;
  }

  totalCost *= costMult;

  return totalCost;
}

export function calculateCoreUpgradeCost(
  startingCore: number,
  extraLevels = 1,
  costMult = 1,
): number {
  const sanitizedCores = Math.round(extraLevels);
  if (isNaN(sanitizedCores) || sanitizedCores < 1) {
    return 0;
  }

  if (startingCore >= HacknetNodeConstants.MaxCores) {
    return Infinity;
  }

  const coreBaseCost = HacknetNodeConstants.CoreBaseCost;
  const mult = HacknetNodeConstants.UpgradeCoreMult;
  let totalCost = 0;
  let currentCores = startingCore;
  for (let i = 0; i < sanitizedCores; ++i) {
    totalCost += coreBaseCost * Math.pow(mult, currentCores - 1);
    ++currentCores;
  }

  totalCost *= costMult;

  return totalCost;
}

export function calculateNodeCost(n: number, mult = 1): number {
  if (n <= 0) {
    return 0;
  }
  return (
    HacknetNodeConstants.BaseCost *
    Math.pow(HacknetNodeConstants.PurchaseNextMult, n - 1) *
    mult
  );
}
