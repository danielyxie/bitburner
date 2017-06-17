/* Log Box */

//Close box when clicking outside
/*
$(document).click(function(event) {
    if (logBoxOpened) {        
        if ( $(event.target).closest("#log-box-container").get(0) == null ) {         
            logBoxClose();         
        }
    }
});
*/
 
function logBoxInit() {
    var closeButton = document.getElementById("log-box-close");
    logBoxClose();
    
    //Close Dialog box
    closeButton.addEventListener("click", function() {
        logBoxClose();
        return false;
    });
};

document.addEventListener("DOMContentLoaded", logBoxInit, false);

logBoxClose = function() {
    logBoxOpened = false;
    var logBox = document.getElementById("log-box-container");
    logBox.style.display = "none";
}

logBoxOpen = function() {
    logBoxOpened = true;
    
    var logBox = document.getElementById("log-box-container");
    logBox.style.display = "block";
}


var logBoxOpened = false;
var logBoxCurrentScript = null;
//ram argument is in GB
logBoxCreate = function(script) {
    logBoxCurrentScript = script;
    logBoxOpen();
    logBoxUpdateText();
}

logBoxUpdateText = function() {
    var txt = document.getElementById("log-box-text");
    if (logBoxCurrentScript && logBoxOpened && txt) {
        txt.innerHTML = logBoxCurrentScript.filename + ":<br>";
        for (var i = 0; i < logBoxCurrentScript.logs.length; ++i) {
            txt.innerHTML += logBoxCurrentScript.logs[i];
            txt.innerHTML += "<br>";
        }
    }
}