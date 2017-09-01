import {Faction, joinFaction}       from "../src/Faction.js";
import {Player}                     from "../src/Player.js";
import {clearEventListeners}        from "./HelperFunctions.js";

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
    //TODO Faction invitation message

    var newYesButton = clearEventListeners("faction-invitation-box-yes");
    newYesButton.addEventListener("click", function() {
        joinFaction(faction);
        factionInvitationBoxClose();
        return false;
    });

    var noButton = clearEventListeners("faction-invitation-box-no");
    noButton.addEventListener("click", function() {
        factionInvitationBoxClose();
        faction.alreadyInvited = true;
        Player.factionInvitations.push(faction.name);
        return false;
    });

    factionInvitationBoxOpen();
}

export {factionInvitationBoxCreate};
