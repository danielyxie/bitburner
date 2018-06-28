import {CONSTANTS} from "./Constants";
import {Player} from "./Player";
import {dialogBoxCreate} from "../utils/DialogBox";


function Crime(name, type, time, money, difficulty, karma, params) {
  this.name = name;
  this.type = type;
  this.time = time;
  this.money = money;
  this.difficulty = difficulty;
  this.karma = karma;

  this.hacking_success_weight = params.hacking_success_weight ? params.hacking_success_weight : 0;
  this.strength_success_weight = params.strength_success_weight ? params.strength_success_weight : 0;
  this.defense_success_weight = params.defense_success_weight ? params.defense_success_weight : 0;
  this.dexterity_success_weight = params.dexterity_success_weight ? params.dexterity_success_weight : 0;
  this.agility_success_weight = params.agility_success_weight ? params.agility_success_weight : 0;
  this.charisma_success_weight = params.charisma_success_weight ? params.charisma_success_weight : 0;

  this.hacking_exp = params.hacking_exp ? params.hacking_exp : 0;
  this.strength_exp = params.strength_exp ? params.strength_exp : 0;
  this.defense_exp = params.defense_exp ? params.defense_exp : 0;
  this.dexterity_exp = params.dexterity_exp ? params.dexterity_exp : 0;
  this.agility_exp = params.agility_exp ? params.agility_exp : 0;
  this.charisma_exp = params.charisma_exp ? params.charisma_exp : 0;
  this.intelligence_exp = params.intelligence_exp ? params.intelligence_exp : 0;

  this.kills = params.kills ? params.kills : 0;
}

Crime.prototype.commit = function(div=1, singParams=null) {
  if (div <= 0) {div = 1;}
  Player.crimeType = this.type;
  Player.startCrime(
    this.hacking_exp/div,
    this.strength_exp/div,
    this.defense_exp/div,
    this.dexterity_exp/div,
    this.agility_exp/div,
    this.charisma_exp/div,
    this.money/div, this.time, singParams);
  return this.time;
}

Crime.prototype.successRate = function() {
  var chance = (this.hacking_success_weight * Player.hacking_skill +
                this.strength_success_weight * Player.strength +
                this.defense_success_weight * Player.defense +
                this.dexterity_success_weight * Player.dexterity +
                this.agility_success_weight * Player.agility +
                this.charisma_success_weight * Player.charisma +
                CONSTANTS.IntelligenceCrimeWeight * Player.intelligence);
  chance /= CONSTANTS.MaxSkillLevel;
  chance /= this.difficulty;
  chance *= Player.crime_success_mult;
  return Math.min(chance, 1);
}

const Crimes = {
  Shoplift: new Crime("Shoplift", CONSTANTS.CrimeShoplift, 2e3, 15e3, 1/20, 0.1, {
    dexterity_success_weight: 1,
    agility_success_weight: 1,

    dexterity_exp: 2,
    agility_exp: 2,
  }),

  RobStore: new Crime("Rob Store", CONSTANTS.CrimeRobStore, 60e3, 400e3, 1/5, 0.5, {
    hacking_exp: 30,
    dexterity_exp: 45,
    agility_exp: 45,

    hacking_success_weight: 0.5 ,
    dexterity_success_weight: 2,
    agility_success_weight: 1,

    intelligence_exp: 0.25 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  Mug: new Crime("Mug", CONSTANTS.CrimeMug, 4e3, 36e3, 1/5, 0.25, {
    strength_exp: 3,
    defense_exp: 3,
    dexterity_exp: 3,
    agility_exp: 3,

    strength_success_weight: 1.5,
    defense_success_weight: 0.5,
    dexterity_success_weight: 1.5,
    agility_success_weight: 0.5,
  }),

  Larceny: new Crime("Larceny", CONSTANTS.CrimeLarceny, 90e3, 800e3, 1/3, 1.5, {
    hacking_exp: 45,
    dexterity_exp: 60,
    agility_exp: 60,

    hacking_success_weight: 0.5,
    dexterity_success_weight: 1,
    agility_success_weight: 1,

    intelligence_exp: 0.5 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  DealDrugs: new Crime("Deal Drugs", CONSTANTS.CrimeDrugs, 10e3, 120e3, 1, 0.5, {
    dexterity_exp: 5,
    agility_exp: 5,
    charisma_exp: 10,

    charisma_success_weight: 3,
    dexterity_success_weight: 2,
    agility_success_weight: 1,
  }),

  BondForgery: new Crime("Bond Forgery", CONSTANTS.CrimeBondForgery, 300e3, 4.5e6, 1/2, 0.1, {
    hacking_exp: 100,
    dexterity_exp: 150,
    charisma_exp: 15,

    hacking_success_weight: 0.05,
    dexterity_success_weight: 1.25,

    intelligence_exp: 2 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  TraffickArms: new Crime("Traffick Arms", CONSTANTS.CrimeTraffickArms, 40e3, 600e3, 2, 1, {
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
  }),

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

  GrandTheftAuto: new Crime("Grand Theft Auto", CONSTANTS.CrimeGrandTheftAuto, 80e3, 1.6e6, 8, 5, {
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

    intelligence_exp: CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

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

    intelligence_exp: 2 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),

  Assassination: new Crime("Assassination", CONSTANTS.CrimeAssassination, 300e3, 12e6, 8, 10, {
    strength_exp: 300,
    defense_exp: 300,
    dexterity_exp: 300,
    agility_exp: 300,

    strength_success_weight: 1,
    dexterity_success_weight: 2,
    agility_success_weight: 1,

    intelligence_exp: 5 * CONSTANTS.IntelligenceCrimeBaseExpGain,

    kills: 1,
  }),

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

    intelligence_exp: 10 * CONSTANTS.IntelligenceCrimeBaseExpGain,
  }),
};

function determineCrimeSuccess(type, moneyGained) {
    var chance = 0;
    var found = false;
    for(const i in Crimes) {
      const crime = Crimes[i];
      if(crime.type == type) {
        chance = crime.successRate();
        found = true;
        break;
      }
    }
    if(!found) {
      console.log(crime);
      dialogBoxCreate("ERR: Unrecognized crime type. This is probably a bug please contact the developer");
      return;
    }

    if (Math.random() <= chance) {
        //Success
        Player.gainMoney(moneyGained);
        return true;
    } else {
        //Failure
        return false;
    }
}

function findCrime(roughName) {
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

export {determineCrimeSuccess,findCrime,Crimes};
