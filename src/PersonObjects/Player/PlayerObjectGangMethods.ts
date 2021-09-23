import { Factions } from "../../Faction/Factions";
import { Faction } from "../../Faction/Faction";
import { Gang } from "../../Gang/Gang";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { IPlayer } from "../IPlayer";

// Amount of negative karma needed to manage a gang in BitNodes other than 2
const GangKarmaRequirement = -54000;

export function canAccessGang(this: IPlayer): boolean {
  if (this.bitNodeN === 2) {
    return true;
  }
  if (SourceFileFlags[2] <= 0) {
    return false;
  }

  return this.karma <= BitNodeMultipliers.GangKarmaRequirement * GangKarmaRequirement;
}

export function getGangFaction(this: IPlayer): Faction {
  const fac = Factions[this.gang.facName];
  if (fac == null) {
    throw new Error(`Gang has invalid faction name: ${this.gang.facName}`);
  }

  return fac;
}

export function getGangName(this: IPlayer): string {
  return this.inGang() ? this.gang.facName : "";
}

export function hasGangWith(this: IPlayer, facName: string): boolean {
  return this.inGang() && this.gang.facName === facName;
}

export function inGang(this: IPlayer): boolean {
  if (this.gang == null || this.gang == undefined) {
    return false;
  }

  return this.gang instanceof Gang;
}

export function startGang(this: IPlayer, factionName: string, hacking: boolean): void {
  this.gang = new Gang(factionName, hacking);

  const fac = Factions[factionName];
  if (fac == null) {
    throw new Error(`Invalid faction name when creating gang: ${factionName}`);
  }
  fac.playerReputation = 0;
}
