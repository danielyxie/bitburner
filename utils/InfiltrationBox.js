import { dialogBoxCreate }          from "./DialogBox";
import { clearEventListeners }      from "./uiHelpers/clearEventListeners";
import { formatNumber }             from "./StringHelperFunctions";

import { BitNodeMultipliers }       from "../src/BitNode/BitNodeMultipliers";
import { CONSTANTS }                from "../src/Constants";
import { Faction }                  from "../src/Faction/Faction";
import { Factions }                 from "../src/Faction/Factions";
import { Player }                   from "../src/Player";

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
    Player.gainHackingExp(inst.calcGainedHackingExp());
    Player.gainStrengthExp(inst.calcGainedStrengthExp());
    Player.gainDefenseExp(inst.calcGainedDefenseExp());
    Player.gainDexterityExp(inst.calcGainedDexterityExp());
    Player.gainAgilityExp(inst.calcGainedAgilityExp());
    Player.gainCharismaExp(inst.calcGainedCharismaExp());
    Player.gainIntelligenceExp(inst.calcGainedIntelligenceExp());

    const expGainText = ["You gained:",
                         `${formatNumber(inst.calcGainedHackingExp(), 3)} hacking exp`,
                         `${formatNumber(inst.calcGainedStrengthExp(), 3)} str exp`,
                         `${formatNumber(inst.calcGainedDefenseExp(), 3)} def exp`,
                         `${formatNumber(inst.calcGainedDexterityExp(), 3)} dex exp`,
                         `${formatNumber(inst.calcGainedAgilityExp(), 3)} agi exp`,
                         `${formatNumber(inst.calcGainedCharismaExp(), 3)} cha exp`].join("\n");

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
        Player.recordMoneySource(moneyValue, "infiltration");
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
