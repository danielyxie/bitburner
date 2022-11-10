import { Crimes } from "./Crimes";
import { Crime } from "./Crime";
import { Player } from "@player";

import { dialogBoxCreate } from "../ui/React/DialogBox";
import { checkEnum } from "../utils/helpers/checkEnum";
import { CrimeType } from "../utils/WorkType";

//This is only used for the player
export function determineCrimeSuccess(type: string): boolean {
  if (!checkEnum(CrimeType, type)) {
    dialogBoxCreate(`ERR: Unrecognized crime type: ${type} This is probably a bug please contact the developer`);
    return false;
  }
  const crime = Crimes[type];
  const chance = crime.successRate(Player);
  return Math.random() <= chance;
}

export function findCrime(roughName: string): Crime | null {
  if (checkEnum(CrimeType, roughName)) return Crimes[roughName];
  roughName = roughName.toLowerCase();
  if (roughName.includes("shoplift")) {
    return Crimes[CrimeType.SHOPLIFT];
  } else if (roughName.includes("rob") && roughName.includes("store")) {
    return Crimes[CrimeType.ROB_STORE];
  } else if (roughName.includes("mug")) {
    return Crimes[CrimeType.MUG];
  } else if (roughName.includes("larceny")) {
    return Crimes[CrimeType.LARCENY];
  } else if (roughName.includes("drugs")) {
    return Crimes[CrimeType.DRUGS];
  } else if (roughName.includes("bond") && roughName.includes("forge")) {
    return Crimes[CrimeType.BOND_FORGERY];
  } else if ((roughName.includes("traffic") || roughName.includes("illegal")) && roughName.includes("arms")) {
    return Crimes[CrimeType.TRAFFIC_ARMS];
  } else if (roughName.includes("homicide")) {
    return Crimes[CrimeType.HOMICIDE];
  } else if (roughName.includes("grand") && roughName.includes("auto")) {
    return Crimes[CrimeType.GRAND_THEFT_AUTO];
  } else if (roughName.includes("kidnap")) {
    return Crimes[CrimeType.KIDNAP];
  } else if (roughName.includes("assassin")) {
    return Crimes[CrimeType.ASSASSINATION];
  } else if (roughName.includes("heist")) {
    return Crimes[CrimeType.HEIST];
  }

  return null;
}
