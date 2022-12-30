import {
  CorpEmployeePosition,
  CorpIndustryName,
  CorpMaterialName,
  CorpResearchName,
  CorpStateName,
  CorpUnlockName,
  CorpUpgradeName,
} from "@nsdefs";
import { CONSTANTS } from "../../Constants";
import { IndustryType, EmployeePositions } from "./Enums";

// For typed strings, we need runtime objects to do API typechecking against.

// This structure + import * as corpConstants allows easier type definitions for individual properties.

/** Names of all corporation game states */
export const stateNames: CorpStateName[] = ["START", "PURCHASE", "PRODUCTION", "SALE", "EXPORT"],
  // TODO: remove IndustryType and EmployeePositions enums and just use the typed strings.
  /** Names of all corporation employee positions */
  employeePositions: CorpEmployeePosition[] = Object.values(EmployeePositions),
  /** Names of all industries. */
  industryNames: CorpIndustryName[] = Object.values(IndustryType),
  /** Names of all materials */
  materialNames: CorpMaterialName[] = [
    "Water",
    "Energy",
    "Food",
    "Plants",
    "Metal",
    "Hardware",
    "Chemicals",
    "Drugs",
    "Robots",
    "AI Cores",
    "Real Estate",
  ],
  /** Names of all one-time corporation-wide unlocks */
  unlockNames: CorpUnlockName[] = [
    "Export",
    "Smart Supply",
    "Market Research - Demand",
    "Market Data - Competition",
    "VeChain",
    "Shady Accounting",
    "Government Partnership",
    "Warehouse API",
    "Office API",
  ],
  upgradeNames: CorpUpgradeName[] = [
    "Smart Factories",
    "Smart Storage",
    "DreamSense",
    "Wilson Analytics",
    "Nuoptimal Nootropic Injector Implants",
    "Speech Processor Implants",
    "Neural Accelerators",
    "FocusWires",
    "ABC SalesBots",
    "Project Insight",
  ],
  /** Names of all reasearches common to all industries */
  researchNamesBase: CorpResearchName[] = [
    "Hi-Tech R&D Laboratory",
    "AutoBrew",
    "AutoPartyManager",
    "Automatic Drug Administration",
    "Bulk Purchasing",
    "CPH4 Injections",
    "Drones",
    "Drones - Assembly",
    "Drones - Transport",
    "Go-Juice",
    "HRBuddy-Recruitment",
    "HRBuddy-Training",
    "JoyWire",
    "Market-TA.I",
    "Market-TA.II",
    "Overclock",
    "Self-Correcting Assemblers",
    "Sti.mu",
  ],
  /** Names of all researches only available to product industries */
  researchNamesProductOnly: CorpResearchName[] = [
    "uPgrade: Capacity.I",
    "uPgrade: Capacity.II",
    "uPgrade: Dashboard",
    "uPgrade: Fulcrum",
  ],
  /** Names of all researches */
  researchNames: CorpResearchName[] = [...researchNamesBase, ...researchNamesProductOnly],
  initialShares = 1e9,
  /** When selling large number of shares, price is dynamically updated for every batch of this amount */
  sharesPerPriceUpdate = 1e6,
  /** Cooldown for issue new shares cooldown in game cycles. 12 hours. */
  issueNewSharesCooldown = 216e3,
  /** Cooldown for selling shares in game cycles. 1 hour. */
  sellSharesCooldown = 18e3,
  coffeeCostPerEmployee = 500e3,
  gameCyclesPerMarketCycle = 50,
  gameCyclesPerCorpStateCycle = gameCyclesPerMarketCycle / stateNames.length,
  secondsPerMarketCycle = (gameCyclesPerMarketCycle * CONSTANTS.MilliPerCycle) / 1000,
  warehouseInitialCost = 5e9,
  warehouseInitialSize = 100,
  warehouseSizeUpgradeCostBase = 1e9,
  officeInitialCost = 4e9,
  officeInitialSize = 3,
  officeSizeUpgradeCostBase = 1e9,
  bribeThreshold = 100e12,
  bribeAmountPerReputation = 1e9,
  baseProductProfitMult = 5,
  dividendMaxRate = 1,
  /** Conversion factor for employee stats to initial salary */
  employeeSalaryMultiplier = 3,
  marketCyclesPerEmployeeRaise = 400,
  employeeRaiseAmount = 50,
  /** Max products for a division without upgrades */
  maxProductsBase = 3,
  fundingRoundShares = [0.1, 0.35, 0.25, 0.2],
  fundingRoundMultiplier = [4, 3, 3, 2.5],
  valuationLength = 5;
