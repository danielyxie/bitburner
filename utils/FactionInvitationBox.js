/* Faction Invitation Pop-up box */
function factionInvitationBoxInit() {
    if (Engine.Debug) {
        console.log("Faction Invitation Box Initialized");
    }
    var cancelButton = document.getElementById("faction-invitation-box-no");
    
    //Close Dialog box
    cancelButton.addEventListener("click", function() {
        factionInvitationBoxClose();
        return false;
    });
};

document.addEventListener("DOMContentLoaded", factionInvitationBoxInit, false);

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
    
    var yesButton = document.getElementById("faction-invitation-box-yes");
    yesButton.addEventListener("click", function() {
        joinFaction(faction);
        factionInvitationBoxClose();
        return false;
    });
    
    factionInvitationBoxOpen();
}