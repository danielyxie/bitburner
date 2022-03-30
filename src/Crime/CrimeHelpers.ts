import { Crimes } from "./Crimes";
import { Crime } from "./Crime";
import { IPlayer } from "../PersonObjects/IPlayer";

import { dialogBoxCreate } from "../ui/React/DialogBox";

export function determineCrimeSuccess(p: IPlayer, type: string): boolean {
  let chance = 0;
  let found = false;
  for (const i of Object.keys(Crimes)) {
    const crime = Crimes[i];
    if (crime.type == type) {
      chance = crime.successRate(p);
      found = true;
      break;
    }
  }

  if (!found) {
    dialogBoxCreate(`ERR: Unrecognized crime type: ${type} This is probably a bug please contact the developer`);
    return false;
  }
  return Math.random() <= chance;
}

export function findCrime(roughName: string): Crime | null {
  roughName = roughName.toLowerCase();
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
  } else if ((roughName.includes("traffic") || roughName.includes("illegal")) && roughName.includes("arms")) {
    return Crimes.TraffickArms;
  } else if (roughName.includes("homicide")) {
    return Crimes.Homicide;
  } else if (roughName.includes("grand") && roughName.includes("auto")) {
    return Crimes.GrandTheftAuto;
  } else if (roughName.includes("kidnap")) {
    return Crimes.Kidnap;
  } else if (roughName.includes("assassin")) {
    return Crimes.Assassination;
  } else if (roughName.includes("heist")) {
    return Crimes.Heist;
  }

  return null;
}
