import {printArray}                     from "./HelperFunctions.js";

$(document).keydown(function(event) {
    if (logBoxOpened && event.keyCode == 27) {
        logBoxClose();
    }
});

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

function logBoxClose() {
    logBoxOpened = false;
    var logBox = document.getElementById("log-box-container");
    logBox.style.display = "none";
}

function logBoxOpen() {
    logBoxOpened = true;

    var logBox = document.getElementById("log-box-container");
    logBox.style.display = "block";
}


var logBoxOpened = false;
var logBoxCurrentScript = null;
//ram argument is in GB
function logBoxCreate(script) {
    logBoxCurrentScript = script;
    logBoxOpen();
    document.getElementById("log-box-text-header").innerHTML =
        logBoxCurrentScript.filename + " " + printArray(logBoxCurrentScript.args) + ":<br><br>";
    logBoxUpdateText();
}

function logBoxUpdateText() {
    var txt = document.getElementById("log-box-text");
    if (logBoxCurrentScript && logBoxOpened && txt) {
        txt.innerHTML = "";
        for (var i = 0; i < logBoxCurrentScript.logs.length; ++i) {
            txt.innerHTML += logBoxCurrentScript.logs[i];
            txt.innerHTML += "<br>";
        }
    }
}

export {logBoxCreate, logBoxUpdateText, logBoxOpened, logBoxCurrentScript};
