import { Corporation } from "../../Corporation/Corporation";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";

export function canAccessCorporation() {
  return this.bitNodeN === 3 || SourceFileFlags[3] > 0;
}

export function hasCorporation() {
  if (this.corporation == null) {
    return false;
  }
  return this.corporation instanceof Corporation;
}

export function startCorporation(corpName, additionalShares = 0) {
  this.corporation = new Corporation({
    name: corpName,
  });

  this.corporation.totalShares += additionalShares;
}
