import { joinFaction } from "../src/Faction/FactionHelpers";
import { Engine } from "../src/engine";
import { Player } from "../src/Player";
import { clearEventListeners } from "./uiHelpers/clearEventListeners";
import { Page, routing } from "../src/ui/navigationTracking";

/* Faction Invitation Pop-up box */
function factionInvitationBoxClose() {
  var factionInvitationBox = document.getElementById("faction-invitation-box-container");
  factionInvitationBox.style.display = "none";
}

function factionInvitationBoxOpen() {
  var factionInvitationBox = document.getElementById("faction-invitation-box-container");
  factionInvitationBox.style.display = "flex";
}

function factionInvitationSetText(txt) {
  var textBox = document.getElementById("faction-invitation-box-text");
  textBox.innerHTML = txt;
}

//ram argument is in GB
function factionInvitationBoxCreate(faction) {
  factionInvitationSetText("You have received a faction invitation from " + faction.name);
  faction.alreadyInvited = true;
  Player.factionInvitations.push(faction.name);

  if (routing.isOn(Page.Factions)) {
    Engine.loadFactionsContent();
  }

  var newYesButton = clearEventListeners("faction-invitation-box-yes");
  newYesButton.addEventListener("click", function () {
    //Remove from invited factions
    var i = Player.factionInvitations.findIndex((facName) => {
      return facName === faction.name;
    });
    if (i === -1) {
      console.error("Could not find faction in Player.factionInvitations");
    }
    joinFaction(faction);
    factionInvitationBoxClose();
    if (routing.isOn(Page.Factions)) {
      Engine.loadFactionsContent();
    }
    return false;
  });

  var noButton = clearEventListeners("faction-invitation-box-no");
  noButton.addEventListener("click", function () {
    factionInvitationBoxClose();
    return false;
  });

  factionInvitationBoxOpen();
}

export { factionInvitationBoxCreate };
