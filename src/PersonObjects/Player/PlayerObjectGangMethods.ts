import { Factions } from "../../Faction/Factions";
import { Faction } from "../../Faction/Faction";
import { Gang } from "../../Gang/Gang";
import { IPlayer } from "../IPlayer";
import { GangConstants } from "../../Gang/data/Constants";
import { FactionNames } from "../../Faction/data/FactionNames";

export type GangRequirement = {
  karma: number;
  crime: number;
  hacking: number;
};

export function canAccessGang(this: IPlayer, factionName: string): boolean {
  if (this.bitNodeN === 2) {
    return true;
  }
  if (this.sourceFileLvl(2) <= 0) {
    return false;
  }

  const requirement = GetGangRequirement(factionName);
  return (
    this.karma <= requirement.karma &&
    this.moneySourceB.crime >= requirement.crime &&
    this.moneySourceB.hacking >= requirement.crime
  );
}

export function GetGangRequirement(factionName: string): GangRequirement {
  const requirement = {
    karma: GangConstants.GangKarmaRequirement,
    crime: GangConstants.GangCrimeMoneyRequirement,
    hacking: GangConstants.GangHackingMoneyRequirement,
  };

  switch (factionName) {
    case FactionNames.SlumSnakes:
      requirement.karma *= 1;
      requirement.crime *= 0;
      requirement.hacking *= 0;
      break;
    case FactionNames.Tetrads:
      requirement.karma *= 0;
      requirement.crime *= 1;
      requirement.hacking *= 0;
      break;
    case FactionNames.TheSyndicate:
      requirement.karma *= 0;
      requirement.crime *= 0.1;
      requirement.hacking *= 0.1;
      break;
    case FactionNames.TheDarkArmy:
      requirement.karma *= 0.01;
      requirement.crime *= 0.01;
      requirement.hacking *= 0.01;
      break;
    case FactionNames.SpeakersForTheDead:
      requirement.karma *= 0.1;
      requirement.crime *= 0.1;
      requirement.hacking *= 0;
      break;
    case FactionNames.NiteSec:
      requirement.karma *= 0;
      requirement.crime *= 0;
      requirement.hacking *= 1;
      break;
    case FactionNames.TheBlackHand:
      requirement.karma *= 0.1;
      requirement.crime *= 0;
      requirement.hacking *= 0.1;
      break;
    default:
      throw new Error("This is not a Gang Faction.");
  }
  return requirement;
}

export function isAwareOfGang(this: IPlayer): boolean {
  return this.bitNodeN === 2 || this.sourceFileLvl(2) >= 1;
}

export function getGangFaction(this: IPlayer): Faction {
  const gang = this.gang;
  if (gang === null) {
    throw new Error("Cannot get gang faction because player is not in a gang.");
  }
  const fac = Factions[gang.facName];
  if (fac == null) {
    throw new Error(`Gang has invalid faction name: ${gang.facName}`);
  }

  return fac;
}

export function getGangName(this: IPlayer): string {
  if (!this.inGang()) return "";
  const gang = this.gang;
  if (gang === null) {
    throw new Error("Cannot get gang faction because player is not in a gang.");
  }
  return gang.facName;
}

export function hasGangWith(this: IPlayer, facName: string): boolean {
  if (!this.inGang()) return false;
  const gang = this.gang;
  if (gang === null) {
    throw new Error("Cannot get gang faction because player is not in a gang.");
  }
  return gang.facName === facName;
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
