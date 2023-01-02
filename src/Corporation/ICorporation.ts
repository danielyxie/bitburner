import { Industry } from "./Industry";
import { IPlayer } from "../PersonObjects/IPlayer";
import { CorporationUnlockUpgrade } from "./data/CorporationUnlockUpgrades";
import { CorporationUpgrade } from "./data/CorporationUpgrades";
import { CorporationState } from "./CorporationState";
import { IReviverValue } from "../utils/JSONReviver";

export interface ICorporation {
  name: string;

  divisions: Industry[];

  funds: number;
  revenue: number;
  expenses: number;
  fundingRound: number;
  public: boolean;
  totalShares: number;
  numShares: number;
  shareSalesUntilPriceUpdate: number;
  shareSaleCooldown: number;
  issueNewSharesCooldown: number;
  dividendRate: number;
  dividendTax: number;
  issuedShares: number;
  sharePrice: number;
  storedCycles: number;
  valuation: number;

  unlockUpgrades: number[];
  upgrades: number[];
  upgradeMultipliers: number[];

  state: CorporationState;

  addFunds(amt: number): void;
  getState(): string;
  storeCycles(numCycles: number): void;
  process(player: IPlayer): void;
  determineValuation(): void;
  determineCycleValuation(): number;
  getTargetSharePrice(): number;
  updateSharePrice(): void;
  immediatelyUpdateSharePrice(): void;
  calculateShareSale(numShares: number): [number, number, number];
  convertCooldownToString(cd: number): string;
  unlock(upgrade: CorporationUnlockUpgrade): void;
  upgrade(upgrade: CorporationUpgrade): void;
  getProductionMultiplier(): number;
  getStorageMultiplier(): number;
  getDreamSenseGain(): number;
  getAdvertisingMultiplier(): number;
  getEmployeeCreMultiplier(): number;
  getEmployeeChaMultiplier(): number;
  getEmployeeIntMultiplier(): number;
  getEmployeeEffMultiplier(): number;
  getSalesMultiplier(): number;
  getScientificResearchMultiplier(): number;
  getStarterGuide(player: IPlayer): void;
  updateDividendTax(): void;
  getCycleDividends(): number;
  toJSON(): IReviverValue;
}
