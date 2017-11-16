import {clearEventListeners}                from "./HelperFunctions.js";
/* Generic Yes-No Pop-up box
 * Can be used to create pop-up boxes that require a yes/no response from player
 */
var yesNoBoxOpen = false;
function yesNoBoxClose() {
    var container = document.getElementById("yes-no-box-container");
    if (container) {
        container.style.display = "none";
    } else {
        console.log("ERROR: Container not found for YesNoBox");
    }
    yesNoBoxOpen = false;
    return false;
}

function yesNoBoxGetYesButton() {
    return clearEventListeners("yes-no-box-yes");
}

function yesNoBoxGetNoButton() {
    return clearEventListeners("yes-no-box-no");
}

function yesNoBoxCreate(txt) {
    if (yesNoBoxOpen) {return false;}   //Already open
    yesNoBoxOpen = true;
    var textElement = document.getElementById("yes-no-box-text");
    if (textElement) {
        textElement.innerHTML = txt;
    }

    var c = document.getElementById("yes-no-box-container");
    if (c) {
        c.style.display = "block";
    } else {
        console.log("ERROR: Container not found for YesNoBox");
    }
    return true;
}

/* Generic Yes-No POp-up Box with Text input */
function yesNoTxtInpBoxClose() {
    var c = document.getElementById("yes-no-text-input-box-container");
    if (c) {
        c.style.display = "none";
    } else {
        console.log("ERROR: Container not found for YesNoTextInputBox");
    }
    yesNoBoxOpen = false;
    return false;
}

function yesNoTxtInpBoxGetYesButton() {
    return clearEventListeners("yes-no-text-input-box-yes");
}

function yesNoTxtInpBoxGetNoButton() {
    return clearEventListeners("yes-no-text-input-box-no");
}

function yesNoTxtInpBoxGetInput() {
    var val = document.getElementById("yes-no-text-input-box-input").value;
    val = val.replace(/\s+/g, '');
    return val;
}

function yesNoTxtInpBoxCreate(txt) {
    yesNoBoxOpen = true;
    var txtE = document.getElementById("yes-no-text-input-box-text");
    if (txtE) {
        txtE.innerHTML = txt;
    }

    var c = document.getElementById("yes-no-text-input-box-container");
    if (c) {
        c.style.display = "block";
    } else {
        console.log("ERROR: Container not found for YesNoTextInputBox");
    }
}

export {yesNoBoxCreate, yesNoTxtInpBoxCreate,
        yesNoBoxGetYesButton, yesNoBoxGetNoButton,
        yesNoTxtInpBoxGetYesButton, yesNoTxtInpBoxGetNoButton,
        yesNoTxtInpBoxGetInput, yesNoBoxClose,
        yesNoTxtInpBoxClose, yesNoBoxOpen};
