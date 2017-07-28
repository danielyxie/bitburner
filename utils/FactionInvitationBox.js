/* Faction Invitation Pop-up box */
factionInvitationBoxClose = function() {
    var factionInvitationBox = document.getElementById("faction-invitation-box-container");
    factionInvitationBox.style.display = "none";
}

factionInvitationBoxOpen = function() {
    var factionInvitationBox = document.getElementById("faction-invitation-box-container");
    factionInvitationBox.style.display = "block";
}

factionInvitationSetText = function(txt) {
    var textBox = document.getElementById("faction-invitation-box-text");
    textBox.innerHTML = txt;
}

factionInvitationSetMessage = function(msg) {
    var msgBox = document.getElementById("faction-invitation-box-message");
    msgBox.innerHTML = msg;
}

//ram argument is in GB
factionInvitationBoxCreate = function(faction) {
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
