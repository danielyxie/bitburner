import { Crime } from "./Crime";

import { CONSTANTS } from "../Constants";
import { IMap } from "../types";

import { CrimeType } from "../utils/WorkType";

export const Crimes: IMap<Crime> = {
  Shoplift: new Crime("Shoplift", CrimeType.Shoplift, 2e3 / CONSTANTS._idleSpeed, 15e3, 1 / 20, 0.1, {
    dexterity_success_weight: 1,
    agility_success_weight: 1,

    dexterity_exp: 4,
    agility_exp: 4,
  }),

  RobStore: new Crime("Rob Store", CrimeType.RobStore, 60e3 / CONSTANTS._idleSpeed, 400e3, 1 / 5, 0.5, {
    hacking_exp: 60,
    dexterity_exp: 90,
    agility_exp: 90,

    hacking_success_weight: 0.5,
    dexterity_success_weight: 2,
    agility_success_weight: 1,

    intelligence_exp: 15 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  Mug: new Crime("Mug", CrimeType.Mug, 4e3 / CONSTANTS._idleSpeed, 36e3, 1 / 5, 0.25, {
    strength_exp: 6,
    defense_exp: 6,
    dexterity_exp: 6,
    agility_exp: 6,

    strength_success_weight: 1.5,
    defense_success_weight: 0.5,
    dexterity_success_weight: 1.5,
    agility_success_weight: 0.5,
  }),

  Larceny: new Crime("Larceny", CrimeType.Larceny, 90e3 / CONSTANTS._idleSpeed, 800e3, 1 / 3, 1.5, {
    hacking_exp: 90,
    dexterity_exp: 120,
    agility_exp: 120,

    hacking_success_weight: 0.5,
    dexterity_success_weight: 1,
    agility_success_weight: 1,

    intelligence_exp: 30 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  DealDrugs: new Crime("Deal Drugs", CrimeType.Drugs, 10e3 / CONSTANTS._idleSpeed, 120e3, 1, 0.5, {
    dexterity_exp: 10,
    agility_exp: 10,
    charisma_exp: 20,

    charisma_success_weight: 3,
    dexterity_success_weight: 2,
    agility_success_weight: 1,
  }),

  BondForgery: new Crime("Bond Forgery", CrimeType.BondForgery, 300e3 / CONSTANTS._idleSpeed, 4.5e6, 1 / 2, 0.1, {
    hacking_exp: 200,
    dexterity_exp: 300,
    charisma_exp: 30,

    hacking_success_weight: 0.05,
    dexterity_success_weight: 1.25,

    intelligence_exp: 120 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  TraffickArms: new Crime("Traffick Arms", CrimeType.TraffickArms, 40e3 / CONSTANTS._idleSpeed, 600e3, 2, 1, {
    strength_exp: 40,
    defense_exp: 40,
    dexterity_exp: 40,
    agility_exp: 40,
    charisma_exp: 80,

    charisma_success_weight: 1,
    strength_success_weight: 1,
    defense_success_weight: 1,
    dexterity_success_weight: 1,
    agility_success_weight: 1,
  }),

  Homicide: new Crime("Homicide", CrimeType.Homicide, 3e3 / CONSTANTS._idleSpeed, 45e3, 1, 3, {
    strength_exp: 4,
    defense_exp: 4,
    dexterity_exp: 4,
    agility_exp: 4,

    strength_success_weight: 2,
    defense_success_weight: 2,
    dexterity_success_weight: 0.5,
    agility_success_weight: 0.5,

    kills: 1,
  }),

  GrandTheftAuto: new Crime("Grand Theft Auto", CrimeType.GrandTheftAuto, 80e3 / CONSTANTS._idleSpeed, 1.6e6, 8, 5, {
    strength_exp: 40,
    defense_exp: 40,
    dexterity_exp: 40,
    agility_exp: 160,
    charisma_exp: 80,

    hacking_success_weight: 1,
    strength_success_weight: 1,
    dexterity_success_weight: 4,
    agility_success_weight: 2,
    charisma_success_weight: 2,

    intelligence_exp: 32 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  Kidnap: new Crime("Kidnap", CrimeType.Kidnap, 120e3 / CONSTANTS._idleSpeed, 3.6e6, 5, 6, {
    strength_exp: 160,
    defense_exp: 160,
    dexterity_exp: 160,
    agility_exp: 160,
    charisma_exp: 160,

    charisma_success_weight: 1,
    strength_success_weight: 1,
    dexterity_success_weight: 1,
    agility_success_weight: 1,

    intelligence_exp: 52 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  Assassination: new Crime("Assassination", CrimeType.Assassination, 300e3 / CONSTANTS._idleSpeed, 12e6, 8, 10, {
    strength_exp: 600,
    defense_exp: 600,
    dexterity_exp: 600,
    agility_exp: 600,

    strength_success_weight: 1,
    dexterity_success_weight: 2,
    agility_success_weight: 1,

    intelligence_exp: 130 * CONSTANTS.IntelligenceCrimeBaseExpGain,

    kills: 1,
  }),

  Heist: new Crime("Heist", CrimeType.Heist, 600e3 / CONSTANTS._idleSpeed, 120e6, 18, 15, {
    hacking_exp: 900,
    strength_exp: 900,
    defense_exp: 900,
    dexterity_exp: 900,
    agility_exp: 900,
    charisma_exp: 900,

    hacking_success_weight: 1,
    strength_success_weight: 1,
    defense_success_weight: 1,
    dexterity_success_weight: 1,
    agility_success_weight: 1,
    charisma_success_weight: 1,

    intelligence_exp: 260 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),
};
