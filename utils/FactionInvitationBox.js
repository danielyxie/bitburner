import {Faction, joinFaction}       from "../src/Faction";
import {Engine}                     from "../src/engine";
import {Player}                     from "../src/Player";
import {clearEventListeners}        from "./uiHelpers/clearEventListeners";

/* Faction Invitation Pop-up box */
function factionInvitationBoxClose() {
    var factionInvitationBox = document.getElementById("faction-invitation-box-container");
    factionInvitationBox.style.display = "none";
}

function factionInvitationBoxOpen() {
    var factionInvitationBox = document.getElementById("faction-invitation-box-container");
    factionInvitationBox.style.display = "block";
}

function factionInvitationSetText(txt) {
    var textBox = document.getElementById("faction-invitation-box-text");
    textBox.innerHTML = txt;
}

function factionInvitationSetMessage(msg) {
    var msgBox = document.getElementById("faction-invitation-box-message");
    msgBox.innerHTML = msg;
}

//ram argument is in GB
function factionInvitationBoxCreate(faction) {
    factionInvitationSetText("You have received a faction invitation from " + faction.name);
    faction.alreadyInvited = true;
    Player.factionInvitations.push(faction.name);

    if (Engine.currentPage === Engine.Page.Factions) {
        Engine.loadFactionsContent();
    }

    var newYesButton = clearEventListeners("faction-invitation-box-yes");
    newYesButton.addEventListener("click", function() {
        //Remove from invited factions
        var i = Player.factionInvitations.findIndex((facName)=>{return facName === faction.name});
        if (i === -1) {
            console.log("ERROR: Could not find faction in Player.factionInvitations");
        } else {
            Player.factionInvitations.splice(i, 1);
        }
        joinFaction(faction);
        factionInvitationBoxClose();
        if (Engine.currentPage === Engine.Page.Factions) {
            Engine.loadFactionsContent();
        }
        return false;
    });

    var noButton = clearEventListeners("faction-invitation-box-no");
    noButton.addEventListener("click", function() {
        factionInvitationBoxClose();
        return false;
    });

    factionInvitationBoxOpen();
}

export {factionInvitationBoxCreate};
