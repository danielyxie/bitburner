/* GameOptions.js */

//Close box when clicking outside
$(document).click(function(event) {
    if (gameOptionsOpened) {
        if ( $(event.target).closest(".game-options-box").get(0) == null ) {
            gameOptionsBoxClose();
        }
    }
});

var gameOptionsOpened = false;
function gameOptionsBoxInit() {
    //Menu link button
    document.getElementById("options-menu-link").addEventListener("click", function() {
        gameOptionsBoxOpen();
        return false;
    });

    //Close button
    var closeButton = document.getElementById("game-options-close-button");
    closeButton.addEventListener("click", function() {
        gameOptionsBoxClose();
        return false;
    });
};

document.addEventListener("DOMContentLoaded", gameOptionsBoxInit, false);

function gameOptionsBoxClose() {
    gameOptionsOpened = false;
    var box = document.getElementById("game-options-container");
    box.style.display = "none";
}

function gameOptionsBoxOpen() {
    var box = document.getElementById("game-options-container");
    box.style.display = "flex";
    setTimeout(function() {
        gameOptionsOpened = true;
    }, 500);

}

export {gameOptionsBoxOpen, gameOptionsBoxClose};
