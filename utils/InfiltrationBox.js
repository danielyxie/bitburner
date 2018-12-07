import { BitNodeMultipliers }       from "../src/BitNodeMultipliers";
import { CONSTANTS }                from "../src/Constants";
import { Faction }                  from "../src/Faction/Faction";
import { Factions }                 from "../src/Faction/Factions";
import { Player }                   from "../src/Player";
import { dialogBoxCreate }          from "./DialogBox";
import { clearEventListeners }      from "./uiHelpers/clearEventListeners";
import { formatNumber }             from "./StringHelperFunctions";

//Keep track of last faction
var lastFac = "";

/* InfiltrationBox.js */
function infiltrationBoxClose() {
    var box = document.getElementById("infiltration-box-container");
    box.style.display = "none";
}

function infiltrationBoxOpen() {
    var box = document.getElementById("infiltration-box-container");
    box.style.display = "flex";
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

    const expGainText = ["You gained:",
                         `${formatNumber(inst.hackingExpGained * expMultiplier, 3)} hacking exp`,
                         `${formatNumber(inst.strExpGained * expMultiplier, 3)} str exp`,
                         `${formatNumber(inst.defExpGained * expMultiplier, 3)} def exp`,
                         `${formatNumber(inst.dexExpGained * expMultiplier, 3)} dex exp`,
                         `${formatNumber(inst.agiExpGained * expMultiplier, 3)} agi exp`,
                         `${formatNumber(inst.chaExpGained * expMultiplier, 3)} cha exp`].join("\n");

    var totalValue = 0;
    for (var i = 0; i < inst.secretsStolen.length; ++i) {
        totalValue += inst.secretsStolen[i];
    }
    if (totalValue == 0) {
        dialogBoxCreate("You successfully escaped the facility but you did not steal " +
                        "anything of worth when infiltrating.<br><br>" + expGainText);
        return;
    }
    var facValue = totalValue * Player.faction_rep_mult *
                   CONSTANTS.InfiltrationRepValue * BitNodeMultipliers.InfiltrationRep;
    var moneyValue = totalValue * CONSTANTS.InfiltrationMoneyValue * BitNodeMultipliers.InfiltrationMoney;
    infiltrationSetText("You can sell the classified documents and secrets " +
                        "you stole from " + inst.companyName + " for <span class='money-gold'>$" +
                        formatNumber(moneyValue, 2) + "</span> on the black market or you can give it " +
                        "to a faction to gain <span class='light-yellow'>" + formatNumber(facValue, 3) + " reputation</span> with " +
                        "that faction.");
    var selector = document.getElementById("infiltration-faction-select");
    selector.innerHTML = "";
    for (let i = 0; i < Player.factions.length; ++i) {
        if (Player.factions[i] === "Bladeburners") { continue; }
        if (Player.inGang() && Player.gang.facName === Player.factions[i]) { continue; }
        selector.innerHTML += "<option value='" + Player.factions[i] +
                               "'>" + Player.factions[i] + "</option>";
    }

    //Set initial value, if applicable
    if (lastFac !== "") {
        for (let i = 0; i < selector.options.length; ++i) {
            if (selector.options[i].value === lastFac) {
                selector.selectedIndex = i;
                break;
            }
        }
    }

    var sellButton = clearEventListeners("infiltration-box-sell");
    setTimeout(function() {
    sellButton.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        Player.gainMoney(moneyValue);
        dialogBoxCreate("You sold the classified information you stole from " + inst.companyName +
                        " for <span class='money-gold'>$" + formatNumber(moneyValue, 2) + "</span> on the black market!<br><br>" +
                        expGainText);
        infiltrationBoxClose();
        return false;
    });
    }, 750);

    var factionButton = clearEventListeners("infiltration-box-faction");
    setTimeout(function() {
    factionButton.addEventListener("click", function(e) {
        if (!e.isTrusted) {return false;}
        var facName = selector.options[selector.selectedIndex].value;
        lastFac = facName;
        var faction = Factions[facName];
        if (faction == null) {
            dialogBoxCreate("Error finding faction. This is a bug please report to developer");
            return false;
        }
        faction.playerReputation += facValue;
        dialogBoxCreate("You gave the classified information you stole from " + inst.companyName +
                        " to " + facName + " and gained <span class='light-yellow'>" + formatNumber(facValue, 3) + " reputation</span> with the faction. <br><br>" +
                        expGainText);
        infiltrationBoxClose();
        return false;
    });
    }, 750);
    infiltrationBoxOpen();
}

export {infiltrationBoxCreate};
