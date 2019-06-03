import { KEY } from "./helpers/keyCodes";

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
$(document).on('click', '.dialog-box-close-button', function( event ) {
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
    console.log(`dialogBoxCreate() called`)
    var container = document.createElement("div");
    container.setAttribute("class", "dialog-box-container");

    var content = document.createElement("div");
    content.setAttribute("class", "dialog-box-content");

    var closeButton = document.createElement("span");
    closeButton.setAttribute("class", "dialog-box-close-button");
    closeButton.innerHTML = "&times;"

    var textE;
    if (preformatted) {
        // For text files as they are often computed data that
        // shouldn't be wrapped and should retain tabstops.
        textE = document.createElement("pre");
        textE.innerHTML = txt;
    } else {
        textE = document.createElement("p");
        textE.innerHTML = txt.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }

    content.appendChild(closeButton);
    content.appendChild(textE);
    container.appendChild(content);

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
