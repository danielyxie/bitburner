import { IPlayer } from "../PersonObjects/IPlayer";
import { Crimes } from "./Crimes";

import { dialogBoxCreate } from "../../utils/DialogBox";

export function determineCrimeSuccess(p: IPlayer, type: string) {
    let chance: number = 0;
    let found: boolean = false;
    for (const i in Crimes) {
        const crime = Crimes[i];
        if (crime.type == type) {
            chance = crime.successRate(p);
            found = true;
            break;
        }
    }

    if (!found) {
        dialogBoxCreate(`ERR: Unrecognized crime type: ${type} This is probably a bug please contact the developer`, false);
        return;
    }

    if (Math.random() <= chance) {
        // Success
        return true;
    } else {
        // Failure
        return false;
    }
}

export function findCrime(roughName: string) {
    if (roughName.includes("shoplift")) {
        return Crimes.Shoplift;
    } else if (roughName.includes("rob") && roughName.includes("store")) {
        return Crimes.RobStore;
    } else if (roughName.includes("mug")) {
        return Crimes.Mug;
    } else if (roughName.includes("larceny")) {
        return Crimes.Larceny;
    } else if (roughName.includes("drugs")) {
        return Crimes.DealDrugs;
    } else if (roughName.includes("bond") && roughName.includes("forge")) {
        return Crimes.BondForgery;
    } else if (roughName.includes("traffick") && roughName.includes("arms")) {
        return Crimes.TraffickArms;
    } else if (roughName.includes("homicide")) {
        return Crimes.Homicide;
    } else if (roughName.includes("grand") && roughName.includes("auto")) {
        return Crimes.GrandTheftAuto;
    } else if (roughName.includes("kidnap")) {
        return Crimes.Kidnap;
    } else if (roughName.includes("assassinate")) {
        return Crimes.Assassination;
    } else if (roughName.includes("heist")) {
        return Crimes.Heist;
    }

    return null;
}
