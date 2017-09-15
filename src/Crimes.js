import {CONSTANTS} from "./Constants.js";
import {Player} from "./Player.js";
import {dialogBoxCreate} from "../utils/DialogBox.js";

/* Crimes.js */
function commitShopliftCrime() {
    Player.crimeType = CONSTANTS.CrimeShoplift;
    Player.startCrime(0, 0, 0, 2, 2, 0, 15000, 2000); //$7500/s, 1 exp/s
}

function commitRobStoreCrime() {
    Player.crimeType = CONSTANTS.CrimeRobStore;
    Player.startCrime(30, 0, 0, 45, 45, 0, 400000, 60000); //$6666,6/2, 0.5exp/s, 0.75exp/s
}

function commitMugCrime() {
    Player.crimeType = CONSTANTS.CrimeMug;
    Player.startCrime(0, 3, 3, 3, 3, 0, 36000, 4000); //$9000/s, .66 exp/s
}

function commitLarcenyCrime() {
    Player.crimeType = CONSTANTS.CrimeLarceny;
    Player.startCrime(45, 0, 0, 60, 60, 0, 800000, 90000) // $8888.88/s, .5 exp/s, .66 exp/s
}

function commitDealDrugsCrime() {
    Player.crimeType = CONSTANTS.CrimeDrugs;
    Player.startCrime(0, 0, 0, 5, 5, 10, 120000, 10000); //$12000/s, .5 exp/s, 1 exp/s
}

function commitTraffickArmsCrime() {
    Player.crimeType = CONSTANTS.CrimeTraffickArms;
    Player.startCrime(0, 20, 20, 20, 20, 40, 600000, 40000); //$15000/s, .5 combat exp/s, 1 cha exp/s
}

function commitHomicideCrime() {
    Player.crimeType = CONSTANTS.CrimeHomicide;
    Player.startCrime(0, 2, 2, 2, 2, 0, 45000, 3000); //$15000/s, 0.66 combat exp/s
}

function commitGrandTheftAutoCrime() {
    Player.crimeType = CONSTANTS.CrimeGrandTheftAuto;
    Player.startCrime(0, 20, 20, 20, 80, 40, 1600000, 80000); //$20000/s, .25 exp/s, 1 exp/s, .5 exp/s
}

function commitKidnapCrime() {
    Player.crimeType = CONSTANTS.CrimeKidnap;
    Player.startCrime(0, 80, 80, 80, 80, 80, 3600000, 120000); //$30000/s. .66 exp/s
}

function commitAssassinationCrime() {
    Player.crimeType = CONSTANTS.CrimeAssassination;
    Player.startCrime(0, 300, 300, 300, 300, 0, 12000000, 300000); //$40000/s, 1 exp/s
}

function commitHeistCrime() {
    Player.crimeType = CONSTANTS.CrimeHeist;
    Player.startCrime(450, 450, 450, 450, 450, 450, 120000000, 600000); //$200000/s, .75exp/s
}

function determineCrimeSuccess(crime, moneyGained) {
    var chance = 0;
    switch (crime) {
        case CONSTANTS.CrimeShoplift:
            chance = determineCrimeChanceShoplift();
            break;
        case CONSTANTS.CrimeRobStore:
            chance = determineCrimeChanceRobStore();
            break;
        case CONSTANTS.CrimeMug:
            chance = determineCrimeChanceMug();
            break;
        case CONSTANTS.CrimeLarceny:
            chance = determineCrimeChanceLarceny();
            break;
        case CONSTANTS.CrimeDrugs:
            chance = determineCrimeChanceDealDrugs();
            break;
        case CONSTANTS.CrimeTraffickArms:
            chance = determineCrimeChanceTraffickArms();
            break;
        case CONSTANTS.CrimeHomicide:
            chance = determineCrimeChanceHomicide();
            break;
        case CONSTANTS.CrimeGrandTheftAuto:
            chance = determineCrimeChanceGrandTheftAuto();
            break;
        case CONSTANTS.CrimeKidnap:
            chance = determineCrimeChanceKidnap();
            break;
        case CONSTANTS.CrimeAssassination:
            chance = determineCrimeChanceAssassination();
            break;
        case CONSTANTS.CrimeHeist:
            chance = determineCrimeChanceHeist();
            break;
        default:
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

let intWgt = CONSTANTS.IntelligenceCrimeWeight;
let maxLvl = CONSTANTS.MaxSkillLevel;

function determineCrimeChanceShoplift() {
    var chance = (Player.dexterity / maxLvl +
                  Player.agility / maxLvl +
                  intWgt * Player.intelligence / maxLvl) * 20;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceRobStore() {
    var chance = (0.5 * Player.hacking_skill / maxLvl +
                  2 * Player.dexterity / maxLvl +
                  1 * Player.agility / maxLvl +
                  intWgt * Player.intelligence / maxLvl) * 5;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceMug() {
    var chance = (1.5 * Player.strength / maxLvl +
                  0.5 * Player.defense / maxLvl +
                  1.5 * Player.dexterity / maxLvl +
                  0.5 * Player.agility / maxLvl +
                  intWgt * Player.intelligence / maxLvl) * 5;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceLarceny() {
    var chance = (0.5 * Player.hacking_skill / maxLvl +
                  Player.dexterity / maxLvl +
                  Player.agility / maxLvl +
                  intWgt * Player.intelligence / maxLvl) * 3;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceDealDrugs() {
    var chance = (3*Player.charisma / maxLvl +
                  2*Player.dexterity / maxLvl +
                  Player.agility / maxLvl +
                  intWgt * Player.intelligence / maxLvl);
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceTraffickArms() {
    var chance = (Player.charisma / maxLvl +
                  Player.strength / maxLvl +
                  Player.defense / maxLvl +
                  Player.dexterity / maxLvl +
                  Player.agility / maxLvl +
                  intWgt * Player.intelligence / maxLvl) / 2;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceHomicide() {
    var chance = (2   * Player.strength / maxLvl +
                  2   * Player.defense / maxLvl +
                  0.5 * Player.dexterity / maxLvl +
                  0.5 * Player.agility / maxLvl +
                  intWgt * Player.intelligence / maxLvl);
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceGrandTheftAuto() {
    var chance = (Player.hacking_skill / maxLvl +
                  Player.strength / maxLvl +
                  4 * Player.dexterity / maxLvl +
                  2 * Player.agility / maxLvl +
                  2 * Player.charisma / maxLvl +
                  intWgt * Player.intelligence / maxLvl) / 8;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceKidnap() {
    var chance =  (Player.charisma / maxLvl +
                   Player.strength / maxLvl +
                   Player.dexterity / maxLvl +
                   Player.agility / maxLvl +
                   intWgt * Player.intelligence / maxLvl) / 5;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceAssassination() {
    var chance = (Player.strength / maxLvl +
                  2 * Player.dexterity / maxLvl +
                  Player.agility / maxLvl +
                  intWgt * Player.intelligence / maxLvl) / 8;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceHeist() {
    var chance = (Player.hacking_skill / maxLvl +
                  Player.strength / maxLvl +
                  Player.defense / maxLvl +
                  Player.dexterity / maxLvl +
                  Player.agility / maxLvl +
                  Player.charisma / maxLvl +
                  intWgt * Player.intelligence / maxLvl) / 18;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

export {commitShopliftCrime, commitRobStoreCrime, commitMugCrime,
        commitLarcenyCrime, commitDealDrugsCrime, commitTraffickArmsCrime,
        commitHomicideCrime, commitGrandTheftAutoCrime, commitKidnapCrime,
        commitAssassinationCrime, commitHeistCrime, determineCrimeSuccess,
        determineCrimeChanceShoplift, determineCrimeChanceRobStore,
        determineCrimeChanceMug, determineCrimeChanceLarceny,
        determineCrimeChanceDealDrugs, determineCrimeChanceTraffickArms,
        determineCrimeChanceHomicide, determineCrimeChanceGrandTheftAuto,
        determineCrimeChanceKidnap, determineCrimeChanceAssassination,
        determineCrimeChanceHeist};
