import { Crime } from "./Crime";

import { CONSTANTS } from "../Constants";
import { IMap } from "../types";

export const Crimes: IMap<Crime> = {
  Shoplift: new Crime(
    "Shoplift",
    CONSTANTS.CrimeShoplift,
    2e3,
    15e3,
    1 / 20,
    0.1,
    {
      dexterity_success_weight: 1,
      agility_success_weight: 1,

      dexterity_exp: 2,
      agility_exp: 2,
    },
  ),

  RobStore: new Crime(
    "Rob Store",
    CONSTANTS.CrimeRobStore,
    60e3,
    400e3,
    1 / 5,
    0.5,
    {
      hacking_exp: 30,
      dexterity_exp: 45,
      agility_exp: 45,

      hacking_success_weight: 0.5,
      dexterity_success_weight: 2,
      agility_success_weight: 1,

      intelligence_exp: 7.5 * CONSTANTS.IntelligenceCrimeBaseExpGain,
    },
  ),

  Mug: new Crime("Mug", CONSTANTS.CrimeMug, 4e3, 36e3, 1 / 5, 0.25, {
    strength_exp: 3,
    defense_exp: 3,
    dexterity_exp: 3,
    agility_exp: 3,

    strength_success_weight: 1.5,
    defense_success_weight: 0.5,
    dexterity_success_weight: 1.5,
    agility_success_weight: 0.5,
  }),

  Larceny: new Crime(
    "Larceny",
    CONSTANTS.CrimeLarceny,
    90e3,
    800e3,
    1 / 3,
    1.5,
    {
      hacking_exp: 45,
      dexterity_exp: 60,
      agility_exp: 60,

      hacking_success_weight: 0.5,
      dexterity_success_weight: 1,
      agility_success_weight: 1,

      intelligence_exp: 15 * CONSTANTS.IntelligenceCrimeBaseExpGain,
    },
  ),

  DealDrugs: new Crime(
    "Deal Drugs",
    CONSTANTS.CrimeDrugs,
    10e3,
    120e3,
    1,
    0.5,
    {
      dexterity_exp: 5,
      agility_exp: 5,
      charisma_exp: 10,

      charisma_success_weight: 3,
      dexterity_success_weight: 2,
      agility_success_weight: 1,
    },
  ),

  BondForgery: new Crime(
    "Bond Forgery",
    CONSTANTS.CrimeBondForgery,
    300e3,
    4.5e6,
    1 / 2,
    0.1,
    {
      hacking_exp: 100,
      dexterity_exp: 150,
      charisma_exp: 15,

      hacking_success_weight: 0.05,
      dexterity_success_weight: 1.25,

      intelligence_exp: 60 * CONSTANTS.IntelligenceCrimeBaseExpGain,
    },
  ),

  TraffickArms: new Crime(
    "Traffick Arms",
    CONSTANTS.CrimeTraffickArms,
    40e3,
    600e3,
    2,
    1,
    {
      strength_exp: 20,
      defense_exp: 20,
      dexterity_exp: 20,
      agility_exp: 20,
      charisma_exp: 40,

      charisma_success_weight: 1,
      strength_success_weight: 1,
      defense_success_weight: 1,
      dexterity_success_weight: 1,
      agility_success_weight: 1,
    },
  ),

  Homicide: new Crime("Homicide", CONSTANTS.CrimeHomicide, 3e3, 45e3, 1, 3, {
    strength_exp: 2,
    defense_exp: 2,
    dexterity_exp: 2,
    agility_exp: 2,

    strength_success_weight: 2,
    defense_success_weight: 2,
    dexterity_success_weight: 0.5,
    agility_success_weight: 0.5,

    kills: 1,
  }),

  GrandTheftAuto: new Crime(
    "Grand Theft Auto",
    CONSTANTS.CrimeGrandTheftAuto,
    80e3,
    1.6e6,
    8,
    5,
    {
      strength_exp: 20,
      defense_exp: 20,
      dexterity_exp: 20,
      agility_exp: 80,
      charisma_exp: 40,

      hacking_success_weight: 1,
      strength_success_weight: 1,
      dexterity_success_weight: 4,
      agility_success_weight: 2,
      charisma_success_weight: 2,

      intelligence_exp: 16 * CONSTANTS.IntelligenceCrimeBaseExpGain,
    },
  ),

  Kidnap: new Crime("Kidnap", CONSTANTS.CrimeKidnap, 120e3, 3.6e6, 5, 6, {
    strength_exp: 80,
    defense_exp: 80,
    dexterity_exp: 80,
    agility_exp: 80,
    charisma_exp: 80,

    charisma_success_weight: 1,
    strength_success_weight: 1,
    dexterity_success_weight: 1,
    agility_success_weight: 1,

    intelligence_exp: 26 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  Assassination: new Crime(
    "Assassination",
    CONSTANTS.CrimeAssassination,
    300e3,
    12e6,
    8,
    10,
    {
      strength_exp: 300,
      defense_exp: 300,
      dexterity_exp: 300,
      agility_exp: 300,

      strength_success_weight: 1,
      dexterity_success_weight: 2,
      agility_success_weight: 1,

      intelligence_exp: 65 * CONSTANTS.IntelligenceCrimeBaseExpGain,

      kills: 1,
    },
  ),

  Heist: new Crime("Heist", CONSTANTS.CrimeHeist, 600e3, 120e6, 18, 15, {
    hacking_exp: 450,
    strength_exp: 450,
    defense_exp: 450,
    dexterity_exp: 450,
    agility_exp: 450,
    charisma_exp: 450,

    hacking_success_weight: 1,
    strength_success_weight: 1,
    defense_success_weight: 1,
    dexterity_success_weight: 1,
    agility_success_weight: 1,
    charisma_success_weight: 1,

    intelligence_exp: 130 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),
};
