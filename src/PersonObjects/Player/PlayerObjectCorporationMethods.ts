import { Corporation } from "../../Corporation/Corporation";
import {
  CorporationUnlockUpgradeIndex,
  CorporationUnlockUpgrades,
} from "../../Corporation/data/CorporationUnlockUpgrades";
import { IPlayer } from "../IPlayer";

export function canAccessCorporation(this: IPlayer): boolean {
  return this.bitNodeN === 3 || this.sourceFileLvl(3) > 0;
}

export function hasCorporation(this: IPlayer): boolean {
  if (this.corporation == null) {
    return false;
  }
  return this.corporation instanceof Corporation;
}

export function startCorporation(this: IPlayer, corpName: string, additionalShares = 0): void {
  this.corporation = new Corporation({
    name: corpName,
  });

  if (this.sourceFileLvl(3) === 3) {
    const warehouseApi = CorporationUnlockUpgrades[CorporationUnlockUpgradeIndex.WarehouseAPI].index;
    const OfficeApi = CorporationUnlockUpgrades[CorporationUnlockUpgradeIndex.OfficeAPI].index;

    this.corporation.unlockUpgrades[warehouseApi] = 1;
    this.corporation.unlockUpgrades[OfficeApi] = 1;
  }

  this.corporation.totalShares += additionalShares;
}
