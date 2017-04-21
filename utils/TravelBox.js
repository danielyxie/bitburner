/* Pop up Purchase Server Box */
function travelBoxInit() {
    var cancelButton = document.getElementById("travel-box-cancel");
    
    //Close Dialog box
    cancelButton.addEventListener("click", function() {
        travelBoxClose();
        return false;
    });
};

document.addEventListener("DOMContentLoaded", travelBoxInit, false);

travelBoxClose = function() {
    var travelBox = document.getElementById("travel-box-container");
    travelBox.style.display = "none";
}

travelBoxOpen = function() {
    var travelBox = document.getElementById("travel-box-container");
    travelBox.style.display = "block";
}

travelBoxSetText = function(txt) {
    var travelBoxText = document.getElementById("travel-box-text");
    travelBoxText.innerHTML = txt;
}

travelBoxCreate = function(destCityName, cost) {
    travelBoxSetText("Would you like to travel to " + destCityName + "? The trip will cost $" + cost + ".");
    
    //Clear old event listeners from Confirm button
    var confirmButton = document.getElementById("travel-box-confirm");
    var newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
    newConfirmButton.addEventListener("click", function() {
        travelBoxClose();
        travelToCity(destCityName, cost);
        return false;
    });
    
    travelBoxOpen();
}