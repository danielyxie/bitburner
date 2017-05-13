/* Pop up Purchase Server Box */
function purchaseServerBoxInit() {
    var cancelButton = document.getElementById("purchase-server-box-cancel");
    
    //Close Dialog box
    cancelButton.addEventListener("click", function() {
        purchaseServerBoxClose();
        return false;
    });
};

document.addEventListener("DOMContentLoaded", purchaseServerBoxInit, false);

purchaseServerBoxClose = function() {
    var purchaseServerBox = document.getElementById("purchase-server-box-container");
    purchaseServerBox.style.display = "none";
}

purchaseServerBoxOpen = function() {
    var purchaseServerBox = document.getElementById("purchase-server-box-container");
    purchaseServerBox.style.display = "block";
}

purchaseServerBoxSetText = function(txt) {
    var purchaseServerBox = document.getElementById("purchase-server-box-text");
    purchaseServerBox.innerHTML = txt;
}

//ram argument is in GB
purchaseServerBoxCreate = function(ram, cost) {
    purchaseServerBoxSetText("Would you like to purchase a new server with " + ram + "GB of RAM for $" + cost + "?" );
    
    //Clear old event listeners from Confirm button
    var newConfirmButton = clearEventListeners("purchase-server-box-confirm");
    newConfirmButton.addEventListener("click", function() {
        purchaseServerBoxClose();
        purchaseServer(ram, cost);
        return false;
    });
    
    purchaseServerBoxOpen();
}