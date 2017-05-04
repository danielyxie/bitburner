/* Crimes.js */
function commitShopliftCrime() {
    Player.crimeType = CONSTANTS.CrimeShoplift;
    Player.startCrime(0, 1, 1, 1, 1, 0, 100, 3000); //$33.33/s, .333 exp/s
}   

function commitMugCrime() {
    Player.crimeType = CONSTANTS.CrimeMug;
    Player.startCrime(0, 2, 2, 2, 2, 0, 250, 5000); //$50/s, .4 exp/s
}   

function commitDealDrugsCrime() {
    Player.crimeType = CONSTANTS.CrimeDrugs;
    Player.startCrime(0, 2, 2, 2, 2, 4, 1000, 10000); //$100/s, .2 combat exp/s, .4 cha exp/s
}

function commitTraffickArmsCrime() {
    Player.crimeType = CONSTANTS.CrimeTraffickArms;
    Player.startCrime(0, 10, 10, 10, 10, 16, 5000, 40000); //$125/s, .25 combat exp/s, .4 cha exp/s
}

function commitHomicideCrime() {
    Player.crimeType = CONSTANTS.CrimeHomicide;
    Player.startCrime(0, 3, 3, 3, 3, 0, 300, 3000); //$100/s, 1 combat exp/s
}

function commitKidnapCrime() {
    Player.crimeType = CONSTANTS.CrimeKidnap;
    Player.startCrime(0, 30, 30, 30, 30, 30, 20000, 120000); //$166.67/s. .25 exp/s
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
    var chance = ((Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) * 8;
                   
    return Math.min(chance, 1);
}

function determineCrimeChanceMug() {
    var chance = ((Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) * 4;
    return Math.min(chance, 1);
}

function determineCrimeChanceDealDrugs() {
    var chance = ((1.5*Player.charisma / CONSTANTS.MaxSkillLevel +
                   Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel));
    return Math.min(chance, 1);
}

function determineCrimeChanceTraffickArms() {
    var chance = ((Player.charisma / CONSTANTS.MaxSkillLevel +
                   Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel));
    return Math.min(chance, 1);
}

function determineCrimeChanceHomicide() {
    var chance = ((Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel));  
    return Math.min(chance, 1);
}

function determineCrimeChanceKidnap() {
        return   ((Player.charisma / CONSTANTS.MaxSkillLevel +
                   Player.strength / CONSTANTS.MaxSkillLevel + 
                   Player.defense / CONSTANTS.MaxSkillLevel + 
                   Player.dexterity / CONSTANTS.MaxSkillLevel +
                   Player.agility / CONSTANTS.MaxSkillLevel)) / 4;
    return Math.min(chance, 1);
}
