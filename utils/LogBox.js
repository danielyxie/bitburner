import {killWorkerScript}    from "../src/NetscriptWorker";
import {clearEventListeners} from "./HelperFunctions";
import {arrayToString}       from "./helpers/arrayToString";

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
    document.getElementById("log-box-text-header").style.display = "inline-block";
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
function logBoxCreate(script) {
    logBoxCurrentScript = script;
    var killScriptBtn = clearEventListeners("log-box-kill-script");
    killScriptBtn.addEventListener("click", ()=>{
        killWorkerScript(script, script.server);
        return false;
    });
    document.getElementById('log-box-kill-script').style.display = "inline-block";
    logBoxOpen();
    document.getElementById("log-box-text-header").innerHTML =
        logBoxCurrentScript.filename + " " + arrayToString(logBoxCurrentScript.args) + ":<br><br>";
    logBoxCurrentScript.logUpd = true;
    logBoxUpdateText();
}

function logBoxUpdateText() {
    var txt = document.getElementById("log-box-text");
    if (logBoxCurrentScript && logBoxOpened && txt && logBoxCurrentScript.logUpd) {
        txt.innerHTML = "";
        for (var i = 0; i < logBoxCurrentScript.logs.length; ++i) {
            txt.innerHTML += logBoxCurrentScript.logs[i];
            txt.innerHTML += "<br>";
        }
        logBoxCurrentScript.logUpd = false;
    }
}

export {logBoxCreate, logBoxUpdateText, logBoxOpened, logBoxCurrentScript};
