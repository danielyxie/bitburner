import {CONSTANTS} from "./Constants.js";
import {Player} from "./Player.js";
import {dialogBoxCreate} from "../utils/DialogBox.js";

/* Crimes.js */
function commitShopliftCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeShoplift;
    var time = 2000;
    Player.startCrime(0, 0, 0, 2/div, 2/div, 0, 15000/div, time, singParams); //$7500/s, 1 exp/s
    return time;
}

function commitRobStoreCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeRobStore;
    var time = 60000;
    Player.startCrime(30/div, 0, 0, 45/div, 45/div, 0, 400000/div, time, singParams); //$6666,6/2, 0.5exp/s, 0.75exp/s
    return time;
}

function commitMugCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeMug;
    var time = 4000;
    Player.startCrime(0, 3/div, 3/div, 3/div, 3/div, 0, 36000/div, time, singParams); //$9000/s, .66 exp/s
    return time;
}

function commitLarcenyCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeLarceny;
    var time = 90000;
    Player.startCrime(45/div, 0, 0, 60/div, 60/div, 0, 800000/div, time, singParams) // $8888.88/s, .5 exp/s, .66 exp/s
    return time;
}

function commitDealDrugsCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeDrugs;
    var time = 10000;
    Player.startCrime(0, 0, 0, 5/div, 5/div, 10/div, 120000/div, time, singParams); //$12000/s, .5 exp/s, 1 exp/s
    return time;
}

function commitBondForgeryCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeBondForgery;
    var time = 300000;
    Player.startCrime(100/div, 0, 0, 150/div, 0, 15/div, 4500000/div, time, singParams); //$15000/s, 0.33 hack exp/s, .5 dex exp/s, .05 cha exp
    return time;
}

function commitTraffickArmsCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeTraffickArms;
    var time = 40000;
    Player.startCrime(0, 20/div, 20/div, 20/div, 20/div, 40/div, 600000/div, time, singParams); //$15000/s, .5 combat exp/s, 1 cha exp/s
    return time;
}

function commitHomicideCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeHomicide;
    var time = 3000;
    Player.startCrime(0, 2/div, 2/div, 2/div, 2/div, 0, 45000/div, time, singParams); //$15000/s, 0.66 combat exp/s
    return time;
}

function commitGrandTheftAutoCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeGrandTheftAuto;
    var time = 80000;
    Player.startCrime(0, 20/div, 20/div, 20/div, 80/div, 40/div, 1600000/div, time, singParams); //$20000/s, .25 exp/s, 1 exp/s, .5 exp/s
    return time;
}

function commitKidnapCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeKidnap;
    var time = 120000;
    Player.startCrime(0, 80/div, 80/div, 80/div, 80/div, 80/div, 3600000/div, time, singParams); //$30000/s. .66 exp/s
    return time;
}

function commitAssassinationCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeAssassination;
    var time = 300000;
    Player.startCrime(0, 300/div, 300/div, 300/div, 300/div, 0, 12000000/div, time, singParams); //$40000/s, 1 exp/s
    return time;
}

function commitHeistCrime(div=1, singParams=null) {
    if (div <= 0) {div = 1;}
    Player.crimeType = CONSTANTS.CrimeHeist;
    var time = 600000;
    Player.startCrime(450/div, 450/div, 450/div, 450/div, 450/div, 450/div, 120000000/div, time, singParams); //$200000/s, .75exp/s
    return time;
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
        case CONSTANTS.CrimeBondForgery:
            chance = determineCrimeChanceBondForgery();
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

function determineCrimeChanceBondForgery() {
    var chance = (0.1*Player.hacking_skill / maxLvl +
                  2.5*Player.dexterity / maxLvl +
                  2*intWgt*Player.intelligence / maxLvl);
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
        commitLarcenyCrime, commitDealDrugsCrime, commitBondForgeryCrime,
        commitTraffickArmsCrime,
        commitHomicideCrime, commitGrandTheftAutoCrime, commitKidnapCrime,
        commitAssassinationCrime, commitHeistCrime, determineCrimeSuccess,
        determineCrimeChanceShoplift, determineCrimeChanceRobStore,
        determineCrimeChanceMug, determineCrimeChanceLarceny,
        determineCrimeChanceDealDrugs, determineCrimeChanceBondForgery,
        determineCrimeChanceTraffickArms,
        determineCrimeChanceHomicide, determineCrimeChanceGrandTheftAuto,
        determineCrimeChanceKidnap, determineCrimeChanceAssassination,
        determineCrimeChanceHeist};
