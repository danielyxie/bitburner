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
    travelBoxSetText("Would you like to travel to " + destCityName + "? The trip will cost $" + formatNumber(cost, 2) + ".");
    
    //Clear old event listeners from Confirm button
    var newConfirmButton = clearEventListeners("travel-box-confirm");
    newConfirmButton.addEventListener("click", function() {
        travelBoxClose();
        travelToCity(destCityName, cost);
        return false;
    });
    
    travelBoxOpen();
}