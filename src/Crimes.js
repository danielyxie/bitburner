/* Crimes.js */
function commitShopliftCrime() {
    Player.crimeType = CONSTANTS.CrimeShoplift;
    Player.startCrime(0, 0.75, 0.75, 0.75, 0.75, 0, 5000, 2000); //$2500/s, .375 exp/s
}   

function commitMugCrime() {
    Player.crimeType = CONSTANTS.CrimeMug;
    Player.startCrime(0, 1.5, 1.5, 1.5, 1.5, 0, 15000, 4000); //$3750/s, .375 exp/s
}   

function commitDealDrugsCrime() {
    Player.crimeType = CONSTANTS.CrimeDrugs;
    Player.startCrime(0, 4, 4, 4, 4, 4, 50000, 10000); //$5000/s, .4 exp/s
}

function commitTraffickArmsCrime() {
    Player.crimeType = CONSTANTS.CrimeTraffickArms;
    Player.startCrime(0, 10, 10, 10, 10, 15, 300000, 40000); //$7500/s, .25 combat exp/s, .375 cha exp/s
}

function commitHomicideCrime() {
    Player.crimeType = CONSTANTS.CrimeHomicide;
    Player.startCrime(0, 2, 2, 2, 2, 0, 15000, 3000); //$5000/s, 0.66 combat exp/s
}

function commitGrandTheftAutoCrime() {
    Player.crimeType = CONSTANTS.CrimeGrandTheftAuto;
    Player.startCrime(0, 10, 10, 10, 40, 20, 750000, 80000); //$9375/s, .125 exp/s, .5 exp/s, .25 exp/s
}

function commitKidnapCrime() {
    Player.crimeType = CONSTANTS.CrimeKidnap;
    Player.startCrime(0, 30, 30, 30, 30, 30, 1500000, 120000); //$12500/s. .25 exp/s
}

function commitAssassinationCrime() {
    Player.crimeType = CONSTANTS.CrimeAssassination;
    Player.startCrime(0, 75, 75, 75, 75, 0, 5000000, 300000); //$16666.66/s, .25 exp/s
}

function commitHeistCrime() {
    Player.crimeType = CONSTANTS.CrimeHeist;
    Player.startCrime(120, 120, 120, 120, 120, 120, 75000000, 600000); //$125000/s, .2exp/s
}

function determineCrimeSuccess(crime, moneyGained) {
    var chance = 0;
    switch (crime) {
        case CONSTANTS.CrimeShoplift:
            chance = determineCrimeChanceShoplift(); 
            break;
        case CONSTANTS.CrimeMug:
            chance = determineCrimeChanceMug();
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

function determineCrimeChanceShoplift() {
    var chance = ((Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) * 20;
    chance *= Player.crime_success_mult;               
    return Math.min(chance, 1);
}

function determineCrimeChanceMug() {
    var chance = ((1.5 *Player.strength / CONSTANTS.MaxSkillLevel + 
                   0.5 * Player.defense / CONSTANTS.MaxSkillLevel + 
                   1.5 * Player.dexterity / CONSTANTS.MaxSkillLevel +
                   0.5 * Player.agility / CONSTANTS.MaxSkillLevel)) * 5;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceDealDrugs() {
    var chance = ((3*Player.charisma / CONSTANTS.MaxSkillLevel +
                   2*Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel));
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceTraffickArms() {
    var chance = ((Player.charisma / CONSTANTS.MaxSkillLevel +
                   Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) / 2;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceHomicide() {
    var chance = ((2   * Player.strength / CONSTANTS.MaxSkillLevel + 
                   2   * Player.defense / CONSTANTS.MaxSkillLevel + 
                   0.5 * Player.dexterity / CONSTANTS.MaxSkillLevel +
                   0.5 * Player.agility / CONSTANTS.MaxSkillLevel));
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceGrandTheftAuto() {
    var chance = ((Player.hacking_skill / CONSTANTS.MaxSkillLevel + 
                   Player.strength / CONSTANTS.MaxSkillLevel + 
                   4 * Player.dexterity / CONSTANTS.MaxSkillLevel +
                   2 * Player.agility / CONSTANTS.MaxSkillLevel + 
                   2 * Player.charisma / CONSTANTS.MaxSkillLevel)) / 8;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceKidnap() {
    var chance =  ((Player.charisma / CONSTANTS.MaxSkillLevel +
                   Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) / 5;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}

function determineCrimeChanceAssassination() {
    var chance = ((Player.strength / CONSTANTS.MaxSkillLevel + 
                   2 * Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) / 8;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);    
}

function determineCrimeChanceHeist() {
    var chance = ((Player.hacking_skill / CONSTANTS.MaxSkillLevel + 
                   Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel + 
                   Player.charisma / CONSTANTS.MaxSkillLevel)) / 18;
    chance *= Player.crime_success_mult;
    return Math.min(chance, 1);
}
