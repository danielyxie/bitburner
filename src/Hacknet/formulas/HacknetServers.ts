import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { HacknetServerConstants } from "../data/Constants";

export function calculateHashGainRate(
  level: number,
  ramUsed: number,
  maxRam: number,
  cores: number,
  mult: number,
): number {
  const baseGain = HacknetServerConstants.HashesPerLevel * level;
  const ramMultiplier = Math.pow(1.07, Math.log2(maxRam));
  const coreMultiplier = 1 + (cores - 1) / 5;
  const ramRatio = 1 - ramUsed / maxRam;

  return baseGain * ramMultiplier * coreMultiplier * ramRatio * mult * BitNodeMultipliers.HacknetNodeMoney;
}

export function calculateLevelUpgradeCost(startingLevel: number, extraLevels = 1, costMult = 1): number {
  const sanitizedLevels = Math.round(extraLevels);
  if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
    return 0;
  }

  if (startingLevel >= HacknetServerConstants.MaxLevel) {
    return Infinity;
  }

  const mult = HacknetServerConstants.UpgradeLevelMult;
  let totalMultiplier = 0;
  let currLevel = startingLevel;
  for (let i = 0; i < sanitizedLevels; ++i) {
    totalMultiplier += Math.pow(mult, currLevel);
    ++currLevel;
  }

  return 10 * HacknetServerConstants.BaseCost * totalMultiplier * costMult;
}

export function calculateRamUpgradeCost(startingRam: number, extraLevels = 1, costMult = 1): number {
  const sanitizedLevels = Math.round(extraLevels);
  if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
    return 0;
  }

  if (startingRam >= HacknetServerConstants.MaxRam) {
    return Infinity;
  }

  let totalCost = 0;
  let numUpgrades = Math.round(Math.log2(startingRam));
  let currentRam = startingRam;
  for (let i = 0; i < sanitizedLevels; ++i) {
    const baseCost = currentRam * HacknetServerConstants.RamBaseCost;
    const mult = Math.pow(HacknetServerConstants.UpgradeRamMult, numUpgrades);

    totalCost += baseCost * mult;

    currentRam *= 2;
    ++numUpgrades;
  }
  totalCost *= costMult;

  return totalCost;
}

export function calculateCoreUpgradeCost(startingCores: number, extraLevels = 1, costMult = 1): number {
  const sanitizedLevels = Math.round(extraLevels);
  if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
    return 0;
  }

  if (startingCores >= HacknetServerConstants.MaxCores) {
    return Infinity;
  }

  const mult = HacknetServerConstants.UpgradeCoreMult;
  let totalCost = 0;
  let currentCores = startingCores;
  for (let i = 0; i < sanitizedLevels; ++i) {
    totalCost += Math.pow(mult, currentCores - 1);
    ++currentCores;
  }
  totalCost *= HacknetServerConstants.CoreBaseCost;
  totalCost *= costMult;

  return totalCost;
}

export function calculateCacheUpgradeCost(startingCache: number, extraLevels = 1): number {
  const sanitizedLevels = Math.round(extraLevels);
  if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
    return 0;
  }

  if (startingCache >= HacknetServerConstants.MaxCache) {
    return Infinity;
  }

  const mult = HacknetServerConstants.UpgradeCacheMult;
  let totalCost = 0;
  let currentCache = startingCache;
  for (let i = 0; i < sanitizedLevels; ++i) {
    totalCost += Math.pow(mult, currentCache - 1);
    ++currentCache;
  }
  totalCost *= HacknetServerConstants.CacheBaseCost;

  return totalCost;
}

export function calculateServerCost(n: number, mult = 1): number {
  if (n - 1 >= HacknetServerConstants.MaxServers) {
    return Infinity;
  }

  return HacknetServerConstants.BaseCost * Math.pow(HacknetServerConstants.PurchaseMult, n - 1) * mult;
}
