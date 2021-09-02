import { ICorporation } from "./ICorporation";
import { IIndustry } from "./IIndustry";
import { IndustryStartingCosts } from "./IndustryData";
import { Industry } from "./Industry";
import { CorporationConstants } from "./data/Constants";
import { OfficeSpace } from "./OfficeSpace";
import { CorporationUnlockUpgrade } from "./data/CorporationUnlockUpgrades";
import { CorporationUpgrade } from "./data/CorporationUpgrades";

export function NewIndustry(corporation: ICorporation, industry: string, name: string): void {
    for (let i = 0; i < corporation.divisions.length; ++i) {
        if (corporation.divisions[i].name === name) {
            throw new Error("This division name is already in use!");
            return;
        }
    }

    const cost = IndustryStartingCosts[industry];
    if(cost === undefined) {
        throw new Error("Invalid industry: ${industry}");
    }
    if (corporation.funds.lt(cost)) {
        throw new Error("Not enough money to create a new division in this industry");
    } else if (name === "") {
        throw new Error("New division must have a name!");
    } else {
        corporation.funds = corporation.funds.minus(cost);
        corporation.divisions.push(new Industry({
            corp: corporation,
            name: name,
            type: industry,
        }));
    }
}

export function NewCity(corporation: ICorporation, division: IIndustry, city: string): void {
    if (corporation.funds.lt(CorporationConstants.OfficeInitialCost)) {
        throw new Error("You don't have enough company funds to open a new office!");
    } else {
        corporation.funds = corporation.funds.minus(CorporationConstants.OfficeInitialCost);
        division.offices[city] = new OfficeSpace({
            loc: city,
            size: CorporationConstants.OfficeInitialSize,
        });
    }
}

export function UnlockUpgrade(corporation: ICorporation, upgrade: CorporationUnlockUpgrade): void {
    if (corporation.funds.lt(upgrade[1])) {
        throw new Error("Insufficient funds");
    }
    corporation.unlock(upgrade);
}

export function LevelUpgrade(corporation: ICorporation, upgrade: CorporationUpgrade): void {
    const baseCost = upgrade[1];
    const priceMult = upgrade[2];
    const level = corporation.upgrades[upgrade[0]];
    const cost = baseCost * Math.pow(priceMult, level);
    if (corporation.funds.lt(cost)) {
        throw new Error("Insufficient funds");
    } else {
        corporation.upgrade(upgrade);
    }
}

export function IssueDividends(corporation: ICorporation, percent: number): void {
    if (isNaN(percent) || percent < 0 || percent > CorporationConstants.DividendMaxPercentage) {
        throw new Error(`Invalid value. Must be an integer between 0 and ${CorporationConstants.DividendMaxPercentage}`);
    }

    corporation.dividendPercentage = percent*100;
}