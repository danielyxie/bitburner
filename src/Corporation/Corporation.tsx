import { CorporationState } from "./CorporationState";
import { CorporationUnlockUpgrade, CorporationUnlockUpgrades } from "./data/CorporationUnlockUpgrades";
import { CorporationUpgrade, CorporationUpgrades } from "./data/CorporationUpgrades";
import { CorporationConstants } from "./data/Constants";
import { Industry } from "./Industry";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { showLiterature } from "../Literature/LiteratureHelpers";
import { LiteratureNames } from "../Literature/data/LiteratureNames";
import { Player } from "@player";

import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { isString } from "../utils/helpers/isString";
import { CityName } from "../Locations/data/CityNames";

interface IParams {
  name?: string;
}

export class Corporation {
  name = "The Corporation";

  //A division/business sector is represented  by the object:
  divisions: Industry[] = [];

  //Financial stats
  funds = 150e9;
  revenue = 0;
  expenses = 0;
  fundingRound = 0;
  public = false; //Publicly traded
  totalShares = CorporationConstants.INITIALSHARES; // Total existing shares
  numShares = CorporationConstants.INITIALSHARES; // Total shares owned by player
  shareSalesUntilPriceUpdate = CorporationConstants.SHARESPERPRICEUPDATE;
  shareSaleCooldown = 0; // Game cycles until player can sell shares again
  issueNewSharesCooldown = 0; // Game cycles until player can issue shares again
  dividendRate = 0;
  dividendTax = 1 - BitNodeMultipliers.CorporationSoftcap + 0.15;
  issuedShares = 0;
  sharePrice = 0;
  storedCycles = 0;

  unlockUpgrades: number[];
  upgrades: number[];
  upgradeMultipliers: number[];

  cycleValuation = 0;
  valuationsList = [0];
  valuation = 0;

  state = new CorporationState();

  constructor(params: IParams = {}) {
    this.name = params.name ? params.name : "The Corporation";
    const numUnlockUpgrades = Object.keys(CorporationUnlockUpgrades).length;
    const numUpgrades = Object.keys(CorporationUpgrades).length;
    this.unlockUpgrades = Array(numUnlockUpgrades).fill(0);
    this.upgrades = Array(numUpgrades).fill(0);
    this.upgradeMultipliers = Array(numUpgrades).fill(1);
  }

  addFunds(amt: number): void {
    if (!isFinite(amt)) {
      console.error("Trying to add invalid amount of funds. Report to a developer.");
      return;
    }
    this.funds = this.funds + amt;
  }

  getState(): string {
    return this.state.getState();
  }

  storeCycles(numCycles = 1): void {
    this.storedCycles += numCycles;
  }

  process(): void {
    if (this.storedCycles >= CorporationConstants.CyclesPerIndustryStateCycle) {
      const state = this.getState();
      const marketCycles = 1;
      const gameCycles = marketCycles * CorporationConstants.CyclesPerIndustryStateCycle;
      this.storedCycles -= gameCycles;

      this.divisions.forEach((ind) => {
        ind.resetImports(state);
      });

      this.divisions.forEach((ind) => {
        ind.process(marketCycles, state, this);
      });

      // Process cooldowns
      if (this.shareSaleCooldown > 0) {
        this.shareSaleCooldown -= gameCycles;
      }
      if (this.issueNewSharesCooldown > 0) {
        this.issueNewSharesCooldown -= gameCycles;
      }

      //At the start of a new cycle, calculate profits from previous cycle
      if (state === "START") {
        this.revenue = 0;
        this.expenses = 0;
        this.divisions.forEach((ind) => {
          if (ind.lastCycleRevenue === -Infinity || ind.lastCycleRevenue === Infinity) {
            return;
          }
          if (ind.lastCycleExpenses === -Infinity || ind.lastCycleExpenses === Infinity) {
            return;
          }
          this.revenue = this.revenue + ind.lastCycleRevenue;
          this.expenses = this.expenses + ind.lastCycleExpenses;
        });
        const profit = this.revenue - this.expenses;
        this.cycleValuation = this.determineCycleValuation();
        this.determineValuation();
        const cycleProfit = profit * (marketCycles * CorporationConstants.SecsPerMarketCycle);
        if (isNaN(this.funds) || this.funds === Infinity || this.funds === -Infinity) {
          dialogBoxCreate(
            "There was an error calculating your Corporations funds and they got reset to 0. " +
              "This is a bug. Please report to game developer.\n\n" +
              "(Your funds have been set to $150b for the inconvenience)",
          );
          this.funds = 150e9;
        }

        // Process dividends
        this.updateDividendTax();
        if (this.dividendRate > 0 && cycleProfit > 0) {
          // Validate input again, just to be safe
          if (
            isNaN(this.dividendRate) ||
            this.dividendRate < 0 ||
            this.dividendRate > CorporationConstants.DividendMaxRate
          ) {
            console.error(`Invalid Corporation dividend rate: ${this.dividendRate}`);
          } else {
            const totalDividends = this.dividendRate * cycleProfit;
            const retainedEarnings = cycleProfit - totalDividends;
            Player.gainMoney(this.getCycleDividends(), "corporation");
            this.addFunds(retainedEarnings);
          }
        } else {
          this.addFunds(cycleProfit);
        }

        this.updateSharePrice();
      }

      this.state.nextState();
    }
  }

  updateDividendTax(): void {
    this.dividendTax = 1 - BitNodeMultipliers.CorporationSoftcap + 0.15;
    if (this.unlockUpgrades[5] === 1) {
      this.dividendTax -= 0.05;
    }
    if (this.unlockUpgrades[6] === 1) {
      this.dividendTax -= 0.1;
    }
  }

  getCycleDividends(): number {
    const profit = this.revenue - this.expenses;
    const cycleProfit = profit * CorporationConstants.SecsPerMarketCycle;
    const totalDividends = this.dividendRate * cycleProfit;
    const dividendsPerShare = totalDividends / this.totalShares;
    const dividends = this.numShares * dividendsPerShare;
    return Math.pow(dividends, 1 - this.dividendTax);
  }

  determineCycleValuation(): number {
    let val,
      profit = this.revenue - this.expenses;
    if (this.public) {
      // Account for dividends
      if (this.dividendRate > 0) {
        profit *= 1 - this.dividendRate;
      }

      val = this.funds + profit * 85e3;
      val *= Math.pow(1.1, this.divisions.length);
      val = Math.max(val, 0);
    } else {
      val = 10e9 + Math.max(this.funds, 0) / 3; //Base valuation
      if (profit > 0) {
        val += profit * 315e3;
      }
      val *= Math.pow(1.1, this.divisions.length);
      val -= val % 1e6; //Round down to nearest millionth
    }
    return val * BitNodeMultipliers.CorporationValuation;
  }

  determineValuation(): void {
    this.valuationsList.push(this.cycleValuation); //Add current valuation to the list
    if (this.valuationsList.length > CorporationConstants.ValuationLength) this.valuationsList.shift();
    let val = this.valuationsList.reduce((a, b) => a + b); //Calculate valuations sum
    val /= CorporationConstants.ValuationLength; //Calculate the average
    this.valuation = val;
  }

  getTargetSharePrice(): number {
    // Note: totalShares - numShares is not the same as issuedShares because
    // issuedShares does not account for private investors
    return this.valuation / (2 * (this.totalShares - this.numShares) + 1);
  }

  updateSharePrice(): void {
    const targetPrice = this.getTargetSharePrice();
    if (this.sharePrice <= targetPrice) {
      this.sharePrice *= 1 + Math.random() * 0.01;
    } else {
      this.sharePrice *= 1 - Math.random() * 0.01;
    }
    if (this.sharePrice <= 0.01) {
      this.sharePrice = 0.01;
    }
  }

  immediatelyUpdateSharePrice(): void {
    this.sharePrice = this.getTargetSharePrice();
  }

  // Calculates how much money will be made and what the resulting stock price
  // will be when the player sells his/her shares
  // @return - [Player profit, final stock price, end shareSalesUntilPriceUpdate property]
  calculateShareSale(numShares: number): [number, number, number] {
    let sharesTracker = numShares;
    let sharesUntilUpdate = this.shareSalesUntilPriceUpdate;
    let sharePrice = this.sharePrice;
    let sharesSold = 0;
    let profit = 0;
    let targetPrice = this.getTargetSharePrice();

    const maxIterations = Math.ceil(numShares / CorporationConstants.SHARESPERPRICEUPDATE);
    if (isNaN(maxIterations) || maxIterations > 10e6) {
      console.error(
        `Something went wrong or unexpected when calculating share sale. Max iterations calculated to be ${maxIterations}`,
      );
      return [0, 0, 0];
    }

    for (let i = 0; i < maxIterations; ++i) {
      if (sharesTracker < sharesUntilUpdate) {
        profit += sharePrice * sharesTracker;
        sharesUntilUpdate -= sharesTracker;
        break;
      } else {
        profit += sharePrice * sharesUntilUpdate;
        sharesUntilUpdate = CorporationConstants.SHARESPERPRICEUPDATE;
        sharesTracker -= sharesUntilUpdate;
        sharesSold += sharesUntilUpdate;
        targetPrice = this.valuation / (2 * (this.totalShares + sharesSold - this.numShares));
        // Calculate what new share price would be
        if (sharePrice <= targetPrice) {
          sharePrice *= 1 + 0.5 * 0.01;
        } else {
          sharePrice *= 1 - 0.5 * 0.01;
        }
      }
    }

    return [profit, sharePrice, sharesUntilUpdate];
  }

  convertCooldownToString(cd: number): string {
    // The cooldown value is based on game cycles. Convert to a simple string
    const seconds = cd / 5;

    const SecondsPerMinute = 60;
    const SecondsPerHour = 3600;

    if (seconds > SecondsPerHour) {
      return `${Math.floor(seconds / SecondsPerHour)} hour(s)`;
    } else if (seconds > SecondsPerMinute) {
      return `${Math.floor(seconds / SecondsPerMinute)} minute(s)`;
    } else {
      return `${Math.floor(seconds)} second(s)`;
    }
  }

  //One time upgrades that unlock new features
  unlock(upgrade: CorporationUnlockUpgrade): void {
    const upgN = upgrade.index,
      price = upgrade.price;
    while (this.unlockUpgrades.length <= upgN) {
      this.unlockUpgrades.push(0);
    }
    if (this.funds < price) {
      dialogBoxCreate("You don't have enough funds to unlock this!");
      return;
    }
    this.unlockUpgrades[upgN] = 1;
    this.funds = this.funds - price;

    // Apply effects for one-time upgrades
    this.updateDividendTax();
  }

  //Levelable upgrades
  upgrade(upgrade: CorporationUpgrade): void {
    const upgN = upgrade.index,
      basePrice = upgrade.basePrice,
      priceMult = upgrade.priceMult,
      upgradeAmt = upgrade.benefit; //Amount by which the upgrade multiplier gets increased (additive)
    while (this.upgrades.length <= upgN) {
      this.upgrades.push(0);
    }
    while (this.upgradeMultipliers.length <= upgN) {
      this.upgradeMultipliers.push(1);
    }
    const totalCost = basePrice * Math.pow(priceMult, this.upgrades[upgN]);
    if (this.funds < totalCost) {
      dialogBoxCreate("You don't have enough funds to purchase this!");
      return;
    }
    ++this.upgrades[upgN];
    this.funds = this.funds - totalCost;

    //Increase upgrade multiplier
    this.upgradeMultipliers[upgN] = 1 + this.upgrades[upgN] * upgradeAmt;

    //If storage size is being updated, update values in Warehouse objects
    if (upgN === 1) {
      for (let i = 0; i < this.divisions.length; ++i) {
        const industry = this.divisions[i];
        for (const city of Object.keys(industry.warehouses) as CityName[]) {
          const warehouse = industry.warehouses[city];
          if (warehouse === 0) continue;
          if (industry.warehouses.hasOwnProperty(city) && warehouse) {
            warehouse.updateSize(this, industry);
          }
        }
      }
    }
  }

  getProductionMultiplier(): number {
    const mult = this.upgradeMultipliers[0];
    if (isNaN(mult) || mult < 1) {
      return 1;
    } else {
      return mult;
    }
  }

  getStorageMultiplier(): number {
    const mult = this.upgradeMultipliers[1];
    if (isNaN(mult) || mult < 1) {
      return 1;
    } else {
      return mult;
    }
  }

  getDreamSenseGain(): number {
    const gain = this.upgradeMultipliers[2] - 1;
    return gain <= 0 ? 0 : gain;
  }

  getAdvertisingMultiplier(): number {
    const mult = this.upgradeMultipliers[3];
    if (isNaN(mult) || mult < 1) {
      return 1;
    } else {
      return mult;
    }
  }

  getEmployeeCreMultiplier(): number {
    const mult = this.upgradeMultipliers[4];
    if (isNaN(mult) || mult < 1) {
      return 1;
    } else {
      return mult;
    }
  }

  getEmployeeChaMultiplier(): number {
    const mult = this.upgradeMultipliers[5];
    if (isNaN(mult) || mult < 1) {
      return 1;
    } else {
      return mult;
    }
  }

  getEmployeeIntMultiplier(): number {
    const mult = this.upgradeMultipliers[6];
    if (isNaN(mult) || mult < 1) {
      return 1;
    } else {
      return mult;
    }
  }

  getEmployeeEffMultiplier(): number {
    const mult = this.upgradeMultipliers[7];
    if (isNaN(mult) || mult < 1) {
      return 1;
    } else {
      return mult;
    }
  }

  getSalesMultiplier(): number {
    const mult = this.upgradeMultipliers[8];
    if (isNaN(mult) || mult < 1) {
      return 1;
    } else {
      return mult;
    }
  }

  getScientificResearchMultiplier(): number {
    const mult = this.upgradeMultipliers[9];
    if (isNaN(mult) || mult < 1) {
      return 1;
    } else {
      return mult;
    }
  }

  // Adds the Corporation Handbook (Starter Guide) to the player's home computer.
  // This is a lit file that gives introductory info to the player
  // This occurs when the player clicks the "Getting Started Guide" button on the overview panel
  getStarterGuide(): void {
    // Check if player already has Corporation Handbook
    const homeComp = Player.getHomeComputer();
    let hasHandbook = false;
    const handbookFn = LiteratureNames.CorporationManagementHandbook;
    for (let i = 0; i < homeComp.messages.length; ++i) {
      if (isString(homeComp.messages[i]) && homeComp.messages[i] === handbookFn) {
        hasHandbook = true;
        break;
      }
    }

    if (!hasHandbook) {
      homeComp.messages.push(handbookFn);
    }
    showLiterature(handbookFn);
    return;
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("Corporation", this);
  }

  /** Initializes a Corporation object from a JSON save state. */
  static fromJSON(value: IReviverValue): Corporation {
    return Generic_fromJSON(Corporation, value.data);
  }
}

Reviver.constructors.Corporation = Corporation;
