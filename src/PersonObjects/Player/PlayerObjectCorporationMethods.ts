import { Corporation } from "../../Corporation/Corporation";
import { CorporationUnlockUpgrades } from "../../Corporation/data/CorporationUnlockUpgrades";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";
import { IPlayer } from "../IPlayer";

export function canAccessCorporation(this: IPlayer): boolean {
  return this.bitNodeN === 3 || SourceFileFlags[3] > 0;
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

  if (SourceFileFlags[3] === 3) {
    const warehouseApi = CorporationUnlockUpgrades["7"][0];
    const OfficeApi = CorporationUnlockUpgrades["8"][0];

    this.corporation.unlockUpgrades[warehouseApi] = 1;
    this.corporation.unlockUpgrades[OfficeApi] = 1;
  }

  this.corporation.totalShares += additionalShares;
}
