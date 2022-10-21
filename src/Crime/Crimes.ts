import { Crime } from "./Crime";

import { CONSTANTS } from "../Constants";

import { CrimeType } from "../utils/WorkType";
// TODO: What is the point of CrimeType using totally different strings than
export const Crimes: Record<CrimeType, Crime> = {
  [CrimeType.SHOPLIFT]: new Crime(
    "Shoplift",
    "to shoplift",
    "Attempt to shoplift from a low-end retailer",
    CrimeType.SHOPLIFT,
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

  [CrimeType.ROB_STORE]: new Crime(
    "Rob Store",
    "to rob a store",
    "Attempt to commit armed robbery on a high-end store",
    CrimeType.ROB_STORE,
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

  [CrimeType.MUG]: new Crime(
    "Mug",
    "to mug",
    "Attempt to mug a random person on the street",
    CrimeType.MUG,
    4e3,
    36e3,
    1 / 5,
    0.25,
    {
      strength_exp: 3,
      defense_exp: 3,
      dexterity_exp: 3,
      agility_exp: 3,

      strength_success_weight: 1.5,
      defense_success_weight: 0.5,
      dexterity_success_weight: 1.5,
      agility_success_weight: 0.5,
    },
  ),

  [CrimeType.LARCENY]: new Crime(
    "Larceny",
    "larceny",
    "Attempt to rob property from someone's house",
    CrimeType.LARCENY,
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

  [CrimeType.DRUGS]: new Crime(
    "Deal Drugs",
    "to deal drugs",
    "Attempt to deal drugs",
    CrimeType.DRUGS,
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

  [CrimeType.BOND_FORGERY]: new Crime(
    "Bond Forgery",
    "to forge bonds",
    "Attempt to forge corporate bonds",
    CrimeType.BOND_FORGERY,
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

  [CrimeType.TRAFFIC_ARMS]: new Crime(
    "Traffick Arms",
    "to traffic arms",
    "Attempt to smuggle illegal arms into the city",
    CrimeType.TRAFFIC_ARMS,
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

  [CrimeType.HOMICIDE]: new Crime(
    "Homicide",
    "homicide",
    "Attempt to murder a random person on the street",
    CrimeType.HOMICIDE,
    3e3,
    45e3,
    1,
    3,
    {
      strength_exp: 2,
      defense_exp: 2,
      dexterity_exp: 2,
      agility_exp: 2,

      strength_success_weight: 2,
      defense_success_weight: 2,
      dexterity_success_weight: 0.5,
      agility_success_weight: 0.5,

      kills: 1,
    },
  ),

  [CrimeType.GRAND_THEFT_AUTO]: new Crime(
    "Grand Theft Auto",
    "grand theft auto",
    "Attempt to commit grand theft auto",
    CrimeType.GRAND_THEFT_AUTO,
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

  [CrimeType.KIDNAP]: new Crime(
    "Kidnap",
    "to kidnap",
    "Attempt to kidnap and ransom a high-profile-target",
    CrimeType.KIDNAP,
    120e3,
    3.6e6,
    5,
    6,
    {
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
    },
  ),

  [CrimeType.ASSASSINATION]: new Crime(
    "Assassination",
    "to assassinate",
    "Attempt to assassinate a high-profile target",
    CrimeType.ASSASSINATION,
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

  [CrimeType.HEIST]: new Crime(
    "Heist",
    "a heist",
    "Attempt to pull off the ultimate heist",
    CrimeType.HEIST,
    600e3,
    120e6,
    18,
    15,
    {
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
    },
  ),
};
