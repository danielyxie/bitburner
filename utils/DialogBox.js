/* Pop up Dialog Box */

//Close dialog box when clicking outside
$(document).click(function(event) {
    if (dialogBoxOpened) {
        if (!$(event.target).closest('.dialog-box-container').length){
            --dialogBoxCount;
            $(".dialog-box-container").remove();
            if (dialogBoxCount == 0) {
                dialogBoxOpened = false;
            }
        }
    }
});

//Dialog box close buttons
$(document).on('click', '.dialog-box-close-button', function( event ) {
    console.log("clicked close button");
    if (dialogBoxOpened) {
        $(this).closest('.dialog-box-container').remove();
        --dialogBoxCount;
        if (dialogBoxCount == 0) {
            dialogBoxOpened = false;
        }
    }
});

var dialogBoxOpened = false;
var dialogBoxCount = 0;

dialogBoxCreate = function(txt) {
    console.log("created");
    var container = document.createElement("div");
    container.setAttribute("class", "dialog-box-container");
    
    var content = document.createElement("div");
    content.setAttribute("class", "dialog-box-content");
    
    var closeButton = document.createElement("span");
    closeButton.setAttribute("class", "dialog-box-close-button");
    closeButton.innerHTML = "&times;"
    
    var textE = document.createElement("p");
    textE.innerHTML = txt;
    
    content.appendChild(closeButton);
    content.appendChild(textE);
    container.appendChild(content);
    
    document.body.appendChild(container);
    
    setTimeout(function() {
        dialogBoxOpened = true;
        ++dialogBoxCount;
    }, 500);
}