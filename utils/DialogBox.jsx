import { KEY } from "./helpers/keyCodes";
import { DialogBox } from "./ui/DialogBox";
import React from "react";
import ReactDOM from "react-dom";

/**
 * Create and display a pop-up dialog box.
 * This dialog box does not allow for any interaction and should close when clicking
 * outside of it
 */
let dialogBoxes = [];

// Close dialog box when clicking outside
$(document).click(function(event) {
    if (dialogBoxOpened && dialogBoxes.length >= 1) {
        if (!$(event.target).closest(dialogBoxes[0]).length){
            closeTopmostDialogBox();
        }
    }
});

function closeTopmostDialogBox() {
    if (!dialogBoxOpened || dialogBoxes.length === 0) return;
    dialogBoxes[0].remove();
    dialogBoxes.shift();
    if (dialogBoxes.length == 0) {
        dialogBoxOpened = false;
    } else {
        dialogBoxes[0].style.visibility = "visible";
    }
}

// Dialog box close buttons
$(document).on('click', '.dialog-box-close-button', function() {
    closeTopmostDialogBox();
});

document.addEventListener("keydown", function (event) {
    if (event.keyCode == KEY.ESC && dialogBoxOpened) {
        closeTopmostDialogBox();
        event.preventDefault();
    }
});

let dialogBoxOpened = false;



function dialogBoxCreate(txt, preformatted=false) {
    const container = document.createElement("div");
    container.setAttribute("class", "dialog-box-container");

    let elem = txt;
    if (typeof txt === 'string') {
        if (preformatted) {
            // For text files as they are often computed data that
            // shouldn't be wrapped and should retain tabstops.
            elem = <pre dangerouslySetInnerHTML={{ __html: txt }} />
        } else {
            elem = <p dangerouslySetInnerHTML={{ __html: txt.replace(/(?:\r\n|\r|\n)/g, '<br />') }} />
        }
    }

    ReactDOM.render(DialogBox(elem), container);
    document.body.appendChild(container);
    if (dialogBoxes.length >= 1) {
        container.style.visibility = "hidden";
    }
    dialogBoxes.push(container);

    setTimeout(function() {
        dialogBoxOpened = true;
    }, 400);
}

export {dialogBoxCreate, dialogBoxOpened};
