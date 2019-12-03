import { killWorkerScript } from "../src/Netscript/killWorkerScript";
import { RunningScript } from "../src/Script/RunningScript";

import { arrayToString } from "./helpers/arrayToString";
import { clearEventListeners } from "./uiHelpers/clearEventListeners";

import { KEY } from "./helpers/keyCodes";

document.addEventListener("keydown", function(event: KeyboardEvent) {
    if (logBoxOpened && event.keyCode == KEY.ESC) {
        logBoxClose();
    }
});

let logBoxContainer: HTMLElement | null;
let textHeader: HTMLElement | null;
let logText: HTMLElement | null;

function logBoxInit(): void {
    // Initialize Close button click listener
    const closeButton = document.getElementById("log-box-close");
    if (closeButton == null) {
        console.error("Could not find LogBox's close button");
        return;
    }

    closeButton.addEventListener("click", function() {
        logBoxClose();
        return false;
    });

    // Initialize text header
    textHeader = document.getElementById("log-box-text-header");
    if (textHeader instanceof HTMLElement) {
        textHeader.style.display = "inline-block";
    }

    // Initialize references to other DOM elements
    logBoxContainer = document.getElementById("log-box-container");
    logText = document.getElementById("log-box-text");

    logBoxClose();

    document.removeEventListener("DOMContentLoaded", logBoxInit);
}

document.addEventListener("DOMContentLoaded", logBoxInit);

function logBoxClose() {
    logBoxOpened = false;
    if (logBoxContainer instanceof HTMLElement) {
        logBoxContainer.style.display = "none";
    }
}

function logBoxOpen() {
    logBoxOpened = true;

    if (logBoxContainer instanceof HTMLElement) {
        logBoxContainer.style.display = "block";
    }
}

export let logBoxOpened = false;
let logBoxCurrentScript: RunningScript | null = null;
export function logBoxCreate(script: RunningScript) {
    logBoxCurrentScript = script;

    const killScriptBtn = clearEventListeners("log-box-kill-script");
    if (killScriptBtn == null) {
        console.error("Could not find LogBox's 'Kill Script' button");
        return;
    }

    killScriptBtn.addEventListener("click", () => {
        killWorkerScript(script, script.server, true);
        return false;
    });

    killScriptBtn.style.display = "inline-block";

    logBoxOpen();

    if (textHeader instanceof HTMLElement) {
        textHeader.innerHTML = `${logBoxCurrentScript.filename} ${arrayToString(logBoxCurrentScript.args)}:<br><br>`;
    } else {
        console.warn("LogBox's Text Header DOM element is null");
    }

    logBoxCurrentScript.logUpd = true;
    logBoxUpdateText();
}

export function logBoxUpdateText() {
    if (!(logText instanceof HTMLElement)) { return; }

    if (logBoxCurrentScript && logBoxOpened && logBoxCurrentScript.logUpd) {
        logText.innerHTML = "";
        for (let i = 0; i < logBoxCurrentScript.logs.length; ++i) {
            logText.innerHTML += logBoxCurrentScript.logs[i];
            logText.innerHTML += "<br>";
        }
        logBoxCurrentScript.logUpd = false;
    }
}
