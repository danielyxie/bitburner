/* Crimes.js */
function commitShopliftCrime() {
    Player.crimeType = CONSTANTS.CrimeShoplift;
    Player.startCrime(0, 1, 1, 1, 1, 0, 100, 3000); //$33.33 per sec
}   

function commitMugCrime() {
    Player.crimeType = CONSTANTS.CrimeMug;
    Player.startCrime(0, 2, 2, 2, 2, 0, 250, 5000); //$50 per sec
}   

function commitDealDrugsCrime() {
    Player.crimeType = CONSTANTS.CrimeDrugs;
    Player.startCrime(0, 2, 2, 2, 2, 4, 1000, 10000); //$100 per sec
}

function commitTraffickArmsCrime() {
    Player.crimeType = CONSTANTS.CrimeTraffickArms;
    Player.startCrime(0, 5, 5, 5, 5, 8, 2500, 20000); //$125 per sec
}

function commitHomicideCrime() {
    Player.crimeType = CONSTANTS.CrimeHomicide;
    Player.startCrime(0, 15, 15, 15, 15, 0, 300, 3000); //$100 per sec
}

function commitKidnapCrime() {
    Player.crimeType = CONSTANTS.CrimeKidnap;
    Player.startCrime(0, 10, 10, 10, 10, 10, 10000, 60000); //$166.67 per sec
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
        case CONSTANTS.CrimeKidnap:
            chance = determineCrimeChanceKidnap();
            break;
        default:
            dialogBoxCreate("ERR: Unrecognized crime type. This is probably a bug please contact the developer");
            return;
    }
    if (Math.random <= chance) {
        //Success
        Player.gainMoney(moneyGained);
        return true;
    } else {
        //Failure
        return false;
    }
}

function determineCrimeChanceShoplift() {
    return       ((Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) * 10;
}

function determineCrimeChanceMug() {
    return       ((Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) * 4;
}

function determineCrimeChanceDealDrugs() {
    return       ((3*Player.charisma / CONSTANTS.MaxSkillLevel +
                   2*Player.strength / CONSTANTS.MaxSkillLevel + 
                   2*Player.defense / CONSTANTS.MaxSkillLevel + 
                   2*Player.dexterity / CONSTANTS.MaxSkillLevel +
                   2*Player.agility / CONSTANTS.MaxSkillLevel));
}

function determineCrimeChanceTraffickArms() {
    return       ((Player.charisma / CONSTANTS.MaxSkillLevel +
                   Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) * 1.5;
}

function determineCrimeChanceHomicide() {
    return       ((Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) * 2;    
}

function determineCrimeChanceKidnap() {
        return   ((Player.charisma / CONSTANTS.MaxSkillLevel +
                   Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel));
}
