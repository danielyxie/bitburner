import {BitNodeMultipliers}                 from "../src/BitNode.js";
import {CONSTANTS}                          from "../src/Constants.js";
import {Factions, Faction}                  from "../src/Faction.js";
import {Player}                             from "../src/Player.js";
import {dialogBoxCreate}                    from "./DialogBox.js";
import {clearEventListeners}                from "./HelperFunctions.js";
import {formatNumber}                       from "./StringHelperFunctions";

/* InfiltrationBox.js */
function infiltrationBoxClose() {
    var box = document.getElementById("infiltration-box-container");
    box.style.display = "none";
}

function infiltrationBoxOpen() {
    var box = document.getElementById("infiltration-box-container");
    box.style.display = "block";
}

function infiltrationSetText(txt) {
    var textBox = document.getElementById("infiltration-box-text");
    textBox.innerHTML = txt;
}

//ram argument is in GB
function infiltrationBoxCreate(inst) {
    //Gain exp
    var expMultiplier = 2 * inst.clearanceLevel / inst.maxClearanceLevel;
    Player.gainHackingExp(inst.hackingExpGained * expMultiplier);
    Player.gainStrengthExp(inst.strExpGained * expMultiplier);
    Player.gainDefenseExp(inst.defExpGained * expMultiplier);
    Player.gainDexterityExp(inst.dexExpGained * expMultiplier);
    Player.gainAgilityExp(inst.agiExpGained * expMultiplier);
    Player.gainCharismaExp(inst.chaExpGained * expMultiplier);
    Player.gainIntelligenceExp(inst.intExpGained * expMultiplier);

    var totalValue = 0;
    for (var i = 0; i < inst.secretsStolen.length; ++i) {
        totalValue += inst.secretsStolen[i];
    }
    if (totalValue == 0) {
        dialogBoxCreate("You successfully escaped the facility but you did not steal " +
                        "anything of worth when infiltrating.<br><br>" +
                        "You gained:<br>" +
                        formatNumber(inst.hackingExpGained, 3) + " hacking exp<br>" +
                        formatNumber(inst.strExpGained, 3) + " str exp<br>" +
                        formatNumber(inst.defExpGained, 3) + " def exp<br>" +
                        formatNumber(inst.dexExpGained, 3) + " dex exp<br>" +
                        formatNumber(inst.agiExpGained, 3) + " agi exp<br>" +
                        formatNumber(inst.chaExpGained, 3) + " cha exp<br>");
        return;
    }
    var facValue = totalValue * Player.faction_rep_mult *
                   CONSTANTS.InfiltrationRepValue * BitNodeMultipliers.InfiltrationRep;
    var moneyValue = totalValue * CONSTANTS.InfiltrationMoneyValue * BitNodeMultipliers.InfiltrationMoney;
    infiltrationSetText("You can sell the classified documents and secrets " +
                        "you stole from " + inst.companyName + " for $" +
                        formatNumber(moneyValue, 2) + " on the black market or you can give it " +
                        "to a faction to gain " + formatNumber(facValue, 3) + " reputation with " +
                        "that faction.");
    var selector = document.getElementById("infiltration-faction-select");
    selector.innerHTML = "";
    for (var i = 0; i < Player.factions.length; ++i) {
        if (Player.factions[i] === "Bladeburners") {continue;}
        selector.innerHTML += "<option value='" + Player.factions[i] +
                               "'>" + Player.factions[i] + "</option>";
    }

    var sellButton = clearEventListeners("infiltration-box-sell");
    setTimeout(function() {
    sellButton.addEventListener("click", function() {
        Player.gainMoney(moneyValue);
        dialogBoxCreate("You sold the classified information you stole from " + inst.companyName +
                        " for $" + moneyValue + " on the black market!<br><br>" +
                        "You gained:<br>" +
                        formatNumber(inst.hackingExpGained, 3) + " hacking exp<br>" +
                        formatNumber(inst.strExpGained, 3) + " str exp<br>" +
                        formatNumber(inst.defExpGained, 3) + " def exp<br>" +
                        formatNumber(inst.dexExpGained, 3) + " dex exp<br>" +
                        formatNumber(inst.agiExpGained, 3) + " agi exp<br>" +
                        formatNumber(inst.chaExpGained, 3) + " cha exp<br>");
        infiltrationBoxClose();
        return false;
    });
    }, 750);

    var factionButton = clearEventListeners("infiltration-box-faction");
    setTimeout(function() {
    factionButton.addEventListener("click", function() {
        var facName = selector.options[selector.selectedIndex].value;
        var faction = Factions[facName];
        if (faction == null) {
            dialogBoxCreate("Error finding faction. This is a bug please report to developer");
            return false;
        }
        faction.playerReputation += facValue;
        dialogBoxCreate("You gave the classified information you stole from " + inst.companyName +
                        " to " + facName + " and gained " + formatNumber(facValue, 3) + " reputation with the faction. <br><br>" +
                        "You gained:<br>" +
                        formatNumber(inst.hackingExpGained, 3) + " hacking exp<br>" +
                        formatNumber(inst.strExpGained, 3) + " str exp<br>" +
                        formatNumber(inst.defExpGained, 3) + " def exp<br>" +
                        formatNumber(inst.dexExpGained, 3) + " dex exp<br>" +
                        formatNumber(inst.agiExpGained, 3) + " agi exp<br>" +
                        formatNumber(inst.chaExpGained, 3) + " cha exp<br>");
        infiltrationBoxClose();
        return false;
    });
    }, 750);
    infiltrationBoxOpen();
}

export {infiltrationBoxCreate};
