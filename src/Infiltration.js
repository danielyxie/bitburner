/* Infiltration.js
 *
 * Kill
 * Knockout (nonlethal)
 * Stealth Knockout (nonlethal)
 * Assassinate
 *
 * Hack Security
 * Destroy Security
 * Sneak past Security
 *
 * Pick the locked door
 *
 * Bribe security
 *
 * Escape
 */

InfiltrationScenarios = {
    Guards: "You see an armed security guard patrolling the area.",
    TechOnly: "The area is equipped with a state-of-the-art security system: cameras, laser tripwires, and sentry turrets.",
    TechOrLockedDoor: "The area is equipped with a state-of-the-art security system. There is a locked door on the side of the " +
                      "room that can be used to bypass security.",
    Bots: "You see a few security bots patrolling the area.",
}

function InfiltrationInstance(companyName, startLevel, val, maxClearance, diff) {
    this.companyName        = companyName;
    this.clearanceLevel     = 0;
    this.maxClearanceLevel  = maxClearance;
    this.securityLevel      = startLevel;
    this.difficulty         = diff; //Affects how much security level increases. Represents a percentage
    this.baseValue          = val; //Base value of company secrets
    this.secretsStolen      = [];  //Numbers representing value of stolen secrets

    this.hackingExpGained   = 0;
    this.strExpGained       = 0;
    this.defExpGained       = 0;
    this.dexExpGained       = 0;
    this.agiExpGained       = 0;
    this.chaExpGained       = 0;
}

InfiltrationInstance.prototype.gainHackingExp = function(amt) {
    if (isNaN(amt)) {return;}
    this.hackingExpGained   += amt;
}

InfiltrationInstance.prototype.gainStrengthExp = function(amt) {
    if (isNaN(amt)) {return;}
    this.strExpGained       += amt;
}

InfiltrationInstance.prototype.gainDefenseExp = function(amt) {
    if (isNaN(amt)) {return;}
    this.defExpGained       += amt;
}

InfiltrationInstance.prototype.gainDexterityExp = function(amt) {
    if (isNaN(amt)) {return;}
    this.dexExpGained       += amt;
}

InfiltrationInstance.prototype.gainAgilityExp = function(amt) {
    if (isNaN(amt)) {return;}
    this.agiExpGained       += amt;
}

InfiltrationInstance.prototype.gainCharismaExp = function(amt) {
    if (isNaN(amt)) {return;}
    this.chaExpGained       += amt;
}



function beginInfiltration(companyName, startLevel, val, maxClearance, diff) {
    var inst = new InfiltrationInstance(companyName, startLevel, val, maxClearance, diff);
    clearInfiltrationStatusText();
    nextInfiltrationLevel(inst);
}

function endInfiltration(inst, success) {
    if (success) {
        infiltrationBoxCreate(inst);
    }

    clearEventListeners("infiltration-kill");
    clearEventListeners("infiltration-knockout");
    clearEventListeners("infiltration-stealthknockout");
    clearEventListeners("infiltration-assassinate");
    clearEventListeners("infiltration-hacksecurity");
    clearEventListeners("infiltration-destroysecurity");
    clearEventListeners("infiltration-sneak");
    clearEventListeners("infiltration-pickdoor");
    clearEventListeners("infiltration-bribe");
    clearEventListeners("infiltration-escape");

    Engine.loadWorldContent();
}

function nextInfiltrationLevel(inst) {
    ++inst.clearanceLevel;
    updateInfiltrationLevelText(inst);

    //Buttons
    var killButton              = clearEventListeners("infiltration-kill");
    var knockoutButton          = clearEventListeners("infiltration-knockout");
    var stealthKnockoutButton   = clearEventListeners("infiltration-stealthknockout");
    var assassinateButton       = clearEventListeners("infiltration-assassinate");
    var hackSecurityButton      = clearEventListeners("infiltration-hacksecurity");
    var destroySecurityButton   = clearEventListeners("infiltration-destroysecurity");
    var sneakButton             = clearEventListeners("infiltration-sneak");
    var pickdoorButton          = clearEventListeners("infiltration-pickdoor");
    var bribeButton             = clearEventListeners("infiltration-bribe");
    var escapeButton            = clearEventListeners("infiltration-escape");

    killButton.style.display = "none";
    knockoutButton.style.display = "none";
    stealthKnockoutButton.style.display = "none";
    assassinateButton.style.display = "none";
    hackSecurityButton.style.display = "none";
    destroySecurityButton.style.display = "none";
    sneakButton.style.display = "none";
    pickdoorButton.style.display = "none";
    bribeButton.style.display = "none";
    escapeButton.style.display = "none";

    var rand = getRandomInt(0, 5);  //This needs to change if more scenarios are added
    var scenario = null;
    switch (rand) {
        case 1:
            scenario = InfiltrationScenarios.TechOnly;
            hackSecurityButton.style.display = "block";
            destroySecurityButton.style.display = "block";
            sneakButton.style.display = "block";
            escapeButton.style.display = "block";
            break;
        case 2:
            scenario = InfiltrationScenarios.TechOrLockedDoor;
            hackSecurityButton.style.display = "block";
            destroySecurityButton.style.display = "block";
            sneakButton.style.display = "block";
            pickdoorButton.style.display = "block";
            escapeButton.style.display = "block";
            break;
        case 3:
            scenario = InfiltrationScenarios.Bots;
            killButton.style.display = "block";
            killButton.addEventListener("click", function() {
                var res = attemptInfiltrationKill(inst);
                if (res[0]) {
                    writeInfiltrationStatusText("You SUCCESSFULLY killed the security bots! Unfortunately you alerted the " +
                                                "rest of the facility's security. The facility's security " +
                                                "level increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
                    Player.karma -= 1;
                    endInfiltrationLevel(inst);
                    return false;
                } else {
                    var dmgTaken = Math.max(1, Math.round(1.5 * inst.securityLevel / Player.defense));
                    writeInfiltrationStatusText("You FAILED to kill the security bots. The bots fight back " +
                                                "and raise the alarm! You take " + dmgTaken + " damage and " +
                                                "the facility's security level increases by " +
                                                formatNumber((res[1]*100)-100, 2).toString() + "%");
                    if (Player.takeDamage(dmgTaken)) {
                        endInfiltration(inst, false);
                    }
                }
                updateInfiltrationButtons(inst, scenario);
                updateInfiltrationLevelText(inst);
            });
            assassinateButton.style.display = "block";
            assassinateButton.addEventListener("click", function() {
                var res = attemptInfiltrationAssassinate(inst);
                if (res[0]) {
                    writeInfiltrationStatusText("You SUCCESSFULLY assassinated the security bots without being detected!");
                    Player.karma -= 1;
                    endInfiltrationLevel(inst);
                    return false;
                } else {
                    writeInfiltrationStatusText("You FAILED to assassinate the security bots. The bots have not detected " +
                                                "you but are now more alert for an intruder. The facility's security level " +
                                                "has increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
                }
                updateInfiltrationButtons(inst, scenario);
                updateInfiltrationLevelText(inst);
            });
            hackSecurityButton.style.display = "block";
            sneakButton.style.display = "block";
            escapeButton.style.display = "block";
            break;
        default:    //0, 4-5
            scenario = InfiltrationScenarios.Guards;
            killButton.style.display = "block";
            killButton.addEventListener("click", function() {
                var res = attemptInfiltrationKill(inst);
                if (res[0]) {
                    writeInfiltrationStatusText("You SUCCESSFULLY killed the security guard! Unfortunately you alerted the " +
                                                "rest of the facility's security. The facility's security " +
                                                "level has increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
                    Player.karma -= 3;
                    endInfiltrationLevel(inst);
                    return false;
                } else {
                    var dmgTaken = Math.max(1, Math.round(inst.securityLevel / Player.defense));
                    writeInfiltrationStatusText("You FAILED to kill the security guard. The guard fights back " +
                                                "and raises the alarm! You take " + dmgTaken + " damage and " +
                                                "the facility's security level has increased by " +
                                                formatNumber((res[1]*100)-100, 2).toString() + "%");
                    if (Player.takeDamage(dmgTaken)) {
                        endInfiltration(inst, false);
                    }
                }
                updateInfiltrationButtons(inst, scenario);
                updateInfiltrationLevelText(inst);
            });
            knockoutButton.style.display = "block";
            stealthKnockoutButton.style.display = "block";
            assassinateButton.style.display = "block";
            assassinateButton.addEventListener("click", function() {
                var res = attemptInfiltrationAssassinate(inst);
                if (res[0]) {
                    writeInfiltrationStatusText("You SUCCESSFULLY assassinated the security guard without being detected!");
                    Player.karma -= 3;
                    endInfiltrationLevel(inst);
                    return false;
                } else {
                    writeInfiltrationStatusText("You FAILED to assassinate the security guard. The guard has not detected " +
                                                "you but is now more alert for an intruder. The facility's security level " +
                                                "has increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
                }
                updateInfiltrationButtons(inst, scenario);
                updateInfiltrationLevelText(inst);
            });
            sneakButton.style.display = "block";
            bribeButton.style.display = "block";
            escapeButton.style.display = "block";
            break;
    }

    knockoutButton.addEventListener("click", function() {
        var res = attemptInfiltrationKnockout(inst);
        if (res[0]) {
            writeInfiltrationStatusText("You SUCCESSFULLY knocked out the security guard! " +
                                        "Unfortunately you made a lot of noise and alerted other security.");
            writeInfiltrationStatusText("The facility's security level increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
            endInfiltrationLevel(inst);
            return false;
        } else {
            var dmgTaken = Math.max(1, Math.round(inst.securityLevel / Player.defense));
            writeInfiltrationStatusText("You FAILED to knockout the security guard. The guard " +
                                        "raises the alarm and fights back! You take " + dmgTaken + " damage and " +
                                        "the facility's security level increases by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
            if (Player.takeDamage(dmgTaken)) {
                endInfiltration(inst, false);
            }
        }
        updateInfiltrationButtons(inst, scenario);
        updateInfiltrationLevelText(inst);
        return false;
    });

    stealthKnockoutButton.addEventListener("click", function() {
        var res = attemptInfiltrationStealthKnockout(inst);
        if (res[0]) {
            writeInfiltrationStatusText("You SUCCESSFULLY knocked out the security guard without making " +
                                        "any noise!");
            endInfiltrationLevel(inst);
            return false;
        } else {
            var dmgTaken = Math.max(1, Math.round(inst.securityLevel / Player.defense));
            writeInfiltrationStatusText("You FAILED to stealthily knockout the security guard. The guard " +
                                        "raises the alarm and fights back! You take " + dmgTaken + " damage and " +
                                        "the facility's security level increases by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
            if (Player.takeDamage(dmgTaken)) {
                endInfiltration(inst, false);
            }
        }
        updateInfiltrationButtons(inst, scenario);
        updateInfiltrationLevelText(inst);
        return false;
    });

    hackSecurityButton.addEventListener("click", function() {
        var res = attemptInfiltrationHack(inst);
        if (res[0]) {
            writeInfiltrationStatusText("You SUCCESSFULLY hacked and disabled the security system!");
            writeInfiltrationStatusText("The facility's security level increased by " + ((res[1]*100) - 100).toString() + "%");
            endInfiltrationLevel(inst);
            return false;
        } else {
            writeInfiltrationStatusText("You FAILED to hack the security system. The facility's " +
                                        "security level increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
        }
        updateInfiltrationButtons(inst, scenario);
        updateInfiltrationLevelText(inst);
        return false;
    });

    destroySecurityButton.addEventListener("click", function() {
        var res = attemptInfiltrationDestroySecurity(inst);
        if (res[0]) {
            writeInfiltrationStatusText("You SUCCESSFULLY and violently destroy the security system!");
            writeInfiltrationStatusText("The facility's security level increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
            endInfiltrationLevel(inst);
            return false;
        } else {
            writeInfiltrationStatusText("You FAILED to destroy the security system. The facility's " +
                                        "security level increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
        }
        updateInfiltrationButtons(inst, scenario);
        updateInfiltrationLevelText(inst);
        return false;
    });

    sneakButton.addEventListener("click", function() {
        var res = attemptInfiltrationSneak(inst);
        if (res[0]) {
            writeInfiltrationStatusText("You SUCCESSFULLY sneak past the security undetected!");
            endInfiltrationLevel(inst);
            return false;
        } else {
            writeInfiltrationStatusText("You FAILED and were detected while trying to sneak past security! The facility's " +
                                        "security level increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
        }
        updateInfiltrationButtons(inst, scenario);
        updateInfiltrationLevelText(inst);
        return false;
    });

    pickdoorButton.addEventListener("click", function() {
        var res = attemptInfiltrationPickLockedDoor(inst);
        if (res[0]) {
            writeInfiltrationStatusText("You SUCCESSFULLY pick the locked door!");
            writeInfiltrationStatusText("The facility's security level increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
            endInfiltrationLevel(inst);
            return false;
        } else {
            writeInfiltrationStatusText("You FAILED to pick the locked door. The facility's security level " +
                                        "increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
        }
        updateInfiltrationButtons(inst, scenario);
        updateInfiltrationLevelText(inst);
        return false;
    });

    bribeButton.addEventListener("click", function() {
        var bribeAmt = CONSTANTS.InfiltrationBribeBaseAmount * inst.clearanceLevel;
        if (Player.money.lt(bribeAmt)) {
            writeInfiltrationStatusText("You do not have enough money to bribe the guard. " +
                                        "You need $" + bribeAmt);
            return false;
        }
        var res = attemptInfiltrationBribe(inst);
        if (res[0]) {
            writeInfiltrationStatusText("You SUCCESSFULLY bribed a guard to let you through " +
                                        "to the next clearance level for $" + bribeAmt);
            Player.loseMoney(bribeAmt);
            endInfiltrationLevel(inst);
            return false;
        } else {
            writeInfiltrationStatusText("You FAILED to bribe a guard! The guard is alerting " +
                                        "other security guards about your presence! The facility's " +
                                        "security level increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
        }
        updateInfiltrationButtons(inst, scenario);
        updateInfiltrationLevelText(inst);
        return false;
    });

    escapeButton.addEventListener("click", function() {
        var res = attemptInfiltrationEscape(inst);
        if (res[0]) {
            writeInfiltrationStatusText("You SUCCESSFULLY escape from the facility with the stolen classified " +
                                        "documents and company secrets!");
            endInfiltration(inst, true);
            return false;
        } else {
            writeInfiltrationStatusText("You FAILED to escape from the facility. You took 1 damage. The facility's " +
                                        "security level increased by " + formatNumber((res[1]*100)-100, 2).toString() + "%");
            if (Player.takeDamage(1)) {
                endInfiltration(inst, false);
            }
        }
        updateInfiltrationButtons(inst, scenario);
        updateInfiltrationLevelText(inst);
        return false;
    });

    updateInfiltrationButtons(inst, scenario);
    writeInfiltrationStatusText("");
    writeInfiltrationStatusText("You are now on clearance level " + inst.clearanceLevel + ".<br>" +
                                scenario);
}


function endInfiltrationLevel(inst) {
    //Check if you gained any secrets
    if (inst.clearanceLevel % 5 == 0) {
        var baseSecretValue = inst.baseValue * inst.clearanceLevel / 2;
        var secretValue = baseSecretValue * Player.faction_rep_mult * 1.2;
        var secretMoneyValue = baseSecretValue * CONSTANTS.InfiltrationMoneyValue;
        inst.secretsStolen.push(baseSecretValue);
        dialogBoxCreate("You found and stole a set of classified documents from the company. " +
                        "These classified secrets could probably be sold for money ($" +
                        formatNumber(secretMoneyValue, 2) + "), or they " +
                        "could be given to factions for reputation (" + formatNumber(secretValue, 3) + " rep)");
    }

    //Increase security level based on difficulty
    inst.securityLevel *=  (1 + (inst.difficulty / 100));
    writeInfiltrationStatusText("You move on to the facility's next clearance level. This " +
                                "clearance level has " + inst.difficulty + "% higher security");

    //If this is max level, force endInfiltration
    if (inst.clearanceLevel >= inst.maxClearanceLevel) {
        endInfiltration(inst, true);
    } else {
        nextInfiltrationLevel(inst);
    }
}

function writeInfiltrationStatusText(txt) {
    var statusTxt = document.getElementById("infiltration-status-text");
    statusTxt.innerHTML += (txt + "<br>");
    statusTxt.parentElement.scrollTop = statusTxt.scrollHeight;
}

function clearInfiltrationStatusText() {
    document.getElementById("infiltration-status-text").innerHTML = "";
}

function updateInfiltrationLevelText(inst) {
    var totalValue = 0;
    var totalMoneyValue = 0;
    for (var i = 0; i < inst.secretsStolen.length; ++i) {
        totalValue += inst.secretsStolen[i];
        totalMoneyValue += inst.secretsStolen[i] * CONSTANTS.InfiltrationMoneyValue;
    }
    document.getElementById("infiltration-level-text").innerHTML =
        "Facility name: " + inst.companyName + "<br>" +
        "Clearance Level: " + inst.clearanceLevel + "<br>" +
        "Security Level: " + formatNumber(inst.securityLevel, 3) + "<br><br>" +
        "Total reputation value of secrets stolen: " + formatNumber(totalValue, 3) + "<br>" +
        "Total monetary value of secrets stolen: $" + formatNumber(totalMoneyValue, 2) + "<br><br>" +
        "Hack exp gained: " + formatNumber(inst.hackingExpGained, 3) + "<br>" +
        "Str exp gained: " + formatNumber(inst.strExpGained, 3) + "<br>" +
        "Def exp gained: " + formatNumber(inst.defExpGained, 3) + "<br>" +
        "Dex exp gained: " + formatNumber(inst.dexExpGained, 3) + "<br>" +
        "Agi exp gained: " + formatNumber(inst.agiExpGained, 3) + "<br>" +
        "Cha exp gained: " + formatNumber(inst.chaExpGained, 3);
}

function updateInfiltrationButtons(inst, scenario) {
    var killChance              = getInfiltrationKillChance(inst);
    var knockoutChance          = getInfiltrationKnockoutChance(inst);
    var stealthKnockoutChance   = getInfiltrationStealthKnockoutChance(inst);
    var assassinateChance       = getInfiltrationAssassinateChance(inst);
    var destroySecurityChance   = getInfiltrationDestroySecurityChance(inst);
    var hackChance              = getInfiltrationHackChance(inst);
    var sneakChance             = getInfiltrationSneakChance(inst);
    var lockpickChance          = getInfiltrationPickLockedDoorChance(inst);
    var bribeChance             = getInfiltrationBribeChance(inst);
    var escapeChance            = getInfiltrationEscapeChance(inst);

    document.getElementById("infiltration-escape").innerHTML = "Escape" +
                "<span class='tooltiptext'>" +
                "Attempt to escape the facility with the classified secrets and " +
                "documents you have stolen. You have a " +
                formatNumber(escapeChance*100, 2) + "% chance of success. If you fail, " +
                "the security level will increase by 5%.</span>";

    switch(scenario) {
        case InfiltrationScenarios.TechOrLockedDoor:
            document.getElementById("infiltration-pickdoor").innerHTML = "Lockpick" +
                "<span class='tooltiptext'>" +
                "Attempt to pick the locked door. You have a " +
                formatNumber(lockpickChance*100, 2) + "% chance of success. " +
                "If you succeed, the security level will increased by 1%. If you fail, the " +
                "security level will increase by 3%.</span>";
        case InfiltrationScenarios.TechOnly:
            document.getElementById("infiltration-hacksecurity").innerHTML = "Hack" +
                "<span class='tooltiptext'>" +
                "Attempt to hack and disable the security system. You have a " +
                formatNumber(hackChance*100, 2) + "% chance of success. " +
                "If you succeed, the security level will increase by 3%. If you fail, " +
                "the security level will increase by 5%.</span>";

            document.getElementById("infiltration-destroysecurity").innerHTML = "Destroy security" +
                "<span class='tooltiptext'>" +
                "Attempt to violently destroy the security system. You have a " +
                formatNumber(destroySecurityChance*100, 2) + "% chance of success. " +
                "If you succeed, the security level will increase by 5%. If you fail, the " +
                "security level will increase by 10%. </span>";

            document.getElementById("infiltration-sneak").innerHTML = "Sneak" +
                "<span class='tooltiptext'>" +
                "Attempt to sneak past the security system. You have a " +
                formatNumber(sneakChance*100, 2) + "% chance of success. " +
                "If you fail, the security level will increase by 8%. </span>";
            break;
        case InfiltrationScenarios.Bots:
            document.getElementById("infiltration-kill").innerHTML = "Destroy bots" +
                "<span class='tooltiptext'>" +
                "Attempt to destroy the security bots through combat. You have a " +
                formatNumber(killChance*100, 2) + "% chance of success. " +
                "If you succeed, the security level will increase by 5%. If you fail, " +
                "the security level will increase by 10%. </span>";

            document.getElementById("infiltration-assassinate").innerHTML = "Assassinate bots" +
                "<span class='tooltiptext'>" +
                "Attempt to stealthily destroy the security bots through assassination. You have a " +
                formatNumber(assassinateChance*100, 2) + "% chance of success. " +
                "If you fail, the security level will increase by 10%. </span>";

            document.getElementById("infiltration-hacksecurity").innerHTML = "Hack bots" +
                "<span class='tooltiptext'>" +
                "Attempt to disable the security bots by hacking them. You have a "  +
                formatNumber(hackChance*100, 2) +  "% chance of success. " +
                "If you succeed, the security level will increase by 1%. If you fail, " +
                "the security level will increase by 5%. </span>";

            document.getElementById("infiltration-sneak").innerHTML = "Sneak" +
                "<span class='tooltiptext'>" +
                "Attempt to sneak past the security bots. You have a " +
                formatNumber(sneakChance*100, 2) + "% chance of success. " +
                "If you fail, the security level will increase by 8%. </span>";
            break;

        case InfiltrationScenarios.Guards:
        default:
            document.getElementById("infiltration-kill").innerHTML = "Kill" +
                "<span class='tooltiptext'>" +
                "Attempt to kill the security guard. You have a " +
                formatNumber(killChance*100, 2) + "% chance of success. " +
                "If you succeed, the security level will increase by 5%. If you fail, " +
                "the security level will decrease by 10%. </span>";

            document.getElementById("infiltration-knockout").innerHTML = "Knockout" +
                "<span class='tooltiptext'>" +
                "Attempt to knockout the security guard. You have a " +
                formatNumber(knockoutChance*100, 2) + "% chance of success. " +
                "If you succeed, the security level will increase by 3%. If you fail, the " +
                "security level will increase by 10%. </span>";

            document.getElementById("infiltration-stealthknockout").innerHTML = "Stealth Knockout" +
                "<span class='tooltiptext'>" +
                "Attempt to stealthily knockout the security guard. You have a " +
                formatNumber(stealthKnockoutChance*100, 2) + "% chance of success. " +
                "If you fail, the security level will increase by 10%. </span>";

            document.getElementById("infiltration-assassinate").innerHTML = "Assassinate" +
                "<span class='tooltiptext'>" +
                "Attempt to assassinate the security guard. You have a " +
                formatNumber(assassinateChance*100, 2) + "% chance of success. " +
                "If you fail, the security level will increase by 5%. </span>";

            document.getElementById("infiltration-sneak").innerHTML = "Sneak" +
                "<span class='tooltiptext'>" +
                "Attempt to sneak past the security guard. You have a " +
                formatNumber(sneakChance*100, 2) + "% chance of success. " +
                "If you fail, the security level will increase by 8%. </span>";

            document.getElementById("infiltration-bribe").innerHTML = "Bribe" +
                "<span class='tooltiptext'>" +
                "Attempt to bribe the security guard. You have a " +
                formatNumber(bribeChance*100, 2) + "% chance of success. " +
                "If you fail, the security level will increase by 15%. </span>";
            break;
    }
}


//Kill
//Success: 5%, Failure 10%, -Karma
function attemptInfiltrationKill(inst) {
    var chance = getInfiltrationKillChance(inst);
    inst.gainStrengthExp(inst.securityLevel / 750) * Player.strength_exp_mult;
    inst.gainDefenseExp(inst.securityLevel / 750) * Player.defense_exp_mult;
    inst.gainDexterityExp(inst.securityLevel / 750) * Player.dexterity_exp_mult;
    inst.gainAgilityExp(inst.securityLevel / 750) * Player.agility_exp_mult;
    if (Math.random() <= chance) {
        inst.securityLevel *= 1.05;
        return [true, 1.05];
    } else {
        inst.securityLevel *= 1.1;
        return [false, 1.1];
    }
}

function getInfiltrationKillChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
           (Player.strength +
            Player.dexterity +
            Player.agility) / (1.5 * lvl));
}


//Knockout
//Success: 3%, Failure: 10%
function attemptInfiltrationKnockout(inst) {
    var chance = getInfiltrationKnockoutChance(inst);
    inst.gainStrengthExp(inst.securityLevel / 750) * Player.strength_exp_mult;
    inst.gainDefenseExp(inst.securityLevel / 750) * Player.defense_exp_mult;
    inst.gainDexterityExp(inst.securityLevel / 750) * Player.dexterity_exp_mult;
    inst.gainAgilityExp(inst.securityLevel / 750) * Player.agility_exp_mult;
    if (Math.random() <= chance) {
        inst.securityLevel *= 1.03;
        return [true, 1.03];
    } else {
        inst.securityLevel *= 1.1;
        return [false, 1.1];
    }
}

function getInfiltrationKnockoutChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
           (Player.strength +
            Player.dexterity +
            Player.agility) / (1.75 * lvl));
}

//Stealth knockout
//Success: 0%, Failure: 10%
function attemptInfiltrationStealthKnockout(inst) {
    var chance = getInfiltrationStealthKnockoutChance(inst);
    inst.gainStrengthExp(inst.securityLevel / 750) * Player.strength_exp_mult;
    inst.gainDexterityExp(inst.securityLevel / 500) * Player.dexterity_exp_mult;
    inst.gainAgilityExp(inst.securityLevel / 500) * Player.agility_exp_mult;
    if (Math.random() <= chance) {
        return [true, 1];
    } else {
        inst.securityLevel *= 1.1;
        return [false, 1.1];
    }
}

function getInfiltrationStealthKnockoutChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
           (0.5 * Player.strength +
            2 * Player.dexterity +
            2 * Player.agility) / (3 * lvl));
}

//Assassination
//Success: 0%, Failure: 5%, -Karma
function attemptInfiltrationAssassinate(inst) {
    var chance = getInfiltrationAssassinateChance(inst);
    inst.gainStrengthExp(inst.securityLevel / 750) * Player.strength_exp_mult;
    inst.gainDexterityExp(inst.securityLevel / 500) * Player.dexterity_exp_mult;
    inst.gainAgilityExp(inst.securityLevel / 500) * Player.agility_exp_mult;
    if (Math.random() <= chance) {
        return [true, 1];
    } else {
        inst.securityLevel *= 1.05;
        return [false, 1.05];
    }
}

function getInfiltrationAssassinateChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
           (Player.dexterity +
            0.5 * Player.agility) / (2 * lvl));
}


//Destroy security
//Success: 5%, Failure: 10%
function attemptInfiltrationDestroySecurity(inst) {
    var chance = getInfiltrationDestroySecurityChance(inst);
    inst.gainStrengthExp(inst.securityLevel / 750) * Player.strength_exp_mult;
    inst.gainDefenseExp(inst.securityLevel / 750) * Player.defense_exp_mult;
    inst.gainDexterityExp(inst.securityLevel / 750) * Player.dexterity_exp_mult;
    inst.gainAgilityExp(inst.securityLevel / 750) * Player.agility_exp_mult;
    if (Math.random() <= chance) {
        inst.securityLevel *= 1.05;
        return [true, 1.05];
    } else {
        inst.securityLevel *= 1.1;
        return [false, 1.1];
    }

}

function getInfiltrationDestroySecurityChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
           (Player.strength +
            Player.dexterity +
            Player.agility) / (2 * lvl));
}


//Hack security
//Success: 1%, Failure: 5%
function attemptInfiltrationHack(inst) {
    var chance = getInfiltrationHackChance(inst);
    inst.gainHackingExp(inst.securityLevel / 250) * Player.hacking_exp_mult;
    if (Math.random() <= chance) {
        inst.securityLevel *= 1.03;
        return [true, 1.03];
    } else {
        inst.securityLevel *= 1.05;
        return [false, 1.05];
    }

}

function getInfiltrationHackChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
                   (Player.hacking_skill) / lvl);
}

//Sneak past security
//Success: 0%, Failure: 8%
function attemptInfiltrationSneak(inst) {
    var chance = getInfiltrationSneakChance(inst);
    inst.gainAgilityExp(inst.securityLevel / 250) * Player.agility_exp_mult;
    if (Math.random() <= chance) {
        return [true, 1];
    } else {
        inst.securityLevel *= 1.08;
        return [false, 1.08];
    }
}

function getInfiltrationSneakChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
            (Player.agility +
             0.5 * Player.dexterity) / (2 * lvl));
}

//Pick locked door
//Success: 1%, Failure: 3%
function attemptInfiltrationPickLockedDoor(inst) {
    var chance = getInfiltrationPickLockedDoorChance(inst);
    inst.gainDexterityExp(inst.securityLevel / 250) * Player.dexterity_exp_mult;
    if (Math.random() <= chance) {
        inst.securityLevel *= 1.01;
        return [true, 1.01];
    } else {
        inst.securityLevel *= 1.03;
        return [false, 1.03];
    }
}

function getInfiltrationPickLockedDoorChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
           (Player.dexterity) / lvl);
}

//Bribe
//Success: 0%, Failure: 15%,
function attemptInfiltrationBribe(inst) {
    var chance = getInfiltrationBribeChance(inst);
    inst.gainCharismaExp(inst.securityLevel / 250) * Player.charisma_exp_mult;
    if (Math.random() <= chance) {
        return [true, 1];
    } else {
        inst.securityLevel *= 1.15;
        return [false, 1.15];
    }
}

function getInfiltrationBribeChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
          (Player.charisma) / lvl);
}

//Escape
//Failure: 5%
function attemptInfiltrationEscape(inst) {
    var chance = getInfiltrationEscapeChance(inst);
    inst.gainAgilityExp(inst.securityLevel / 500) * Player.agility_exp_mult;
    inst.gainDexterityExp(inst.securityLevel / 500) * Player.dexterity_exp_mult;
    if (Math.random() <= chance) {
        return [true, 1];
    } else {
        inst.securityLevel *= 1.05;
        return [false, 1.05];
    }
}

function getInfiltrationEscapeChance(inst) {
    var lvl = inst.securityLevel;
    return Math.min(0.95,
           (2 * Player.agility +
            Player.dexterity) / lvl);
}
