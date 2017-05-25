/* Pop up Dialog Box */

//Close dialog box when clicking outside
$(document).click(function(event) {
    if (dialogBoxOpened) {        
        if ( $(event.target).closest(".dialog-box").get(0) == null ) {         
            dialogBoxClose();         
        }
    }
});

var dialogBoxOpened = false;
function dialogBoxInit() {
    var closeButton = document.getElementById("dialog-box-close-button");
    
    //Close Dialog box
    closeButton.addEventListener("click", function() {
        dialogBoxClose();
        return false;
    });
};

document.addEventListener("DOMContentLoaded", dialogBoxInit, false);

dialogBoxClose = function() {
    dialogBoxOpened = false;
    var dialogBox = document.getElementById("dialog-box-container");
    dialogBox.style.display = "none";
}

dialogBoxOpen = function() {
    var dialogBox = document.getElementById("dialog-box-container");
    dialogBox.style.display = "block";
    setTimeout(function() {
        dialogBoxOpened = true;
    }, 500);
    
}

dialogBoxSetText = function(txt1, txt2="", txt3="", txt4="") {
    var dialogBoxText1 = document.getElementById("dialog-box-text-1");
    var dialogBoxText2 = document.getElementById("dialog-box-text-2");
    var dialogBoxText3 = document.getElementById("dialog-box-text-3");
    var dialogBoxText4 = document.getElementById("dialog-box-text-4");
    dialogBoxText1.innerHTML = txt1;
    dialogBoxText2.innerHTML = txt2;
    dialogBoxText3.innerHTML = txt3;
    dialogBoxText4.innerHTML = txt4;
}

dialogBoxCreate = function(txt1, txt2="", txt3="", txt4="") {
    dialogBoxSetText(txt1, txt2, txt3, txt4);
    dialogBoxOpen();
}