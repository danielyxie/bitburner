/* Pop up Yes/No Box */
function purchaseServerBoxInit() {
    if (Engine.Debug) {
        console.log("Purchase Server box Initialized");
    }
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
    
    var confirmButton = document.getElementById("purchase-server-box-confirm");
    confirmButton.addEventListener("click", function() {
        purchaseServer(ram, cost);
    });
    
    purchaseServerBoxOpen();
}