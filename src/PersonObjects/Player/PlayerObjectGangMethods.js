import { Factions } from "../../Faction/Factions";
import { Gang } from "../../Gang";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";

// Amount of negative karma needed to manage a gang in BitNodes other than 2
const GangKarmaRequirement = -54000;

export function canAccessGang() {
    if (this.bitNodeN === 2) { return true; }

    if (SourceFileFlags[2] <= 0) { return false; }

    return (this.karma <= GangKarmaRequirement);
}

export function getGangFaction() {
    const fac = Factions[this.gang.facName];
    if (fac == null) {
        throw new Error(`Gang has invalid faction name: ${this.gang.facName}`);
    }

    return fac;
}

export function getGangName() {
    return this.gang.facName;
}

export function inGang() {
    if (this.gang == null || this.gang == undefined) { return false; }

    return (this.gang instanceof Gang);
}

export function startGang(factionName, hacking) {
    this.gang = new Gang(factionName, hacking);

    const fac = Factions[factionName];
    if (fac == null) {
        throw new Error(`Invalid faction name when creating gang: ${factionName}`);
    }
    fac.playerReputation = 0;
}
