import {Engine}                    from "./engine";

import {removeChildrenFromElement} from "../utils/uiHelpers/removeChildrenFromElement";
import {createElement}             from "../utils/uiHelpers/createElement";
import {exceptionAlert}            from "../utils/helpers/exceptionAlert";
import {isString}                  from "../utils/helpers/isString";

var cinematicTextFlag = false;

//Lines must be an array of strings
function writeCinematicText(lines) {
    cinematicTextFlag = true;

    if (lines.constructor !== Array) {
        throw new Error("Invalid non-array argument passed into writeCinematicText()");
    }

    //We'll reuse the 'Red Pill' content
    Engine.loadCinematicTextContent();
    var container = document.getElementById("cinematic-text-container");
    container.style.width = "75%";
    if (container == null) {throw new Error("Could not find cinematic-text-container for writeCinematicText()");}
    removeChildrenFromElement(container);

    for (var i = 0; i < lines.length; ++i) {
        if (!isString(lines[i])) {
            throw new Error("Invalid non-string element in 'lines' argument. writeCinematicText() failed");
        }
    }

    return writeCinematicTextRecurse(lines).then(function() {
        return cinematicTextEnd(); //Puts the continue button
    }).catch(function(e) {
        exceptionAlert(e);
    });
}

function writeCinematicTextRecurse(lines, lineNumber=0) {
    if (lineNumber >= lines.length) {return Promise.resolve(true);}
    return writeCinematicTextLine(lines[lineNumber]).then(function() {
        return writeCinematicTextRecurse(lines, lineNumber+1);
    });
}

function writeCinematicTextLine(line) {
    return new Promise(function(resolve, reject) {
        var container = document.getElementById("cinematic-text-container");
        var pElem = document.createElement("p");
        container.appendChild(pElem);

        var promise = writeCinematicTextLetter(pElem, line, 0);
        promise.then(function(res) {
            resolve(res);
        }, function(e) {
            reject(e);
        });
    });
}

function writeCinematicTextLetter(pElem, line, i=0) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            if (i >= line.length) {
                var textToShow = line.substring(0, i);
                pElem.innerHTML = textToShow;
                return resolve(true);
            }
            var textToShow = line.substring(0, i);
            pElem.innerHTML = textToShow + "<span class='typed-cursor'> &#9608; </span>";
            var promise = writeCinematicTextLetter(pElem, line, i+1);
            promise.then(function(res) {
                resolve(res);
            }, function(e) {
                reject(e);
            });
        }, 15);
    });
}

function cinematicTextEnd() {
    var container = document.getElementById("cinematic-text-container");
    var mainMenu = document.getElementById("mainmenu-container");
    container.appendChild(createElement("br"));

    return new Promise (function(resolve, reject) {
        container.appendChild(createElement("a", {
            class:"a-link-button", innerText:"Continue...",
            clickListener:()=>{
                removeChildrenFromElement(container);
                Engine.loadTerminalContent();
                mainMenu.style.visibility = "visible";
                cinematicTextFlag = false;
                resolve();
            }
        }));
    });
}

export {cinematicTextFlag, writeCinematicText};
