/* RedPill.js 
 *  Implements what happens when you have Red Pill augmentation and then hack the world daemon */
 
//Returns promise
function writeRedPillLine(line) {
    return new Promise(function(resolve, reject) {
        
        var container = document.getElementById("red-pill-container");
        var pElem = document.createElement("p");
        container.appendChild(pElem);
        
        var promise = writeRedPillLetter(pElem, line, 0);
        promise.then(function(res) {
            resolve(res);
        }, function(e) {
            reject(e);
        });
    });
}

function writeRedPillLetter(pElem, line, i=0) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            if (i >= line.length) {
                resolve(true);
            }
            var textToShow = line.substring(0, i);
            pElem.innerHTML = "> " + textToShow + "<span class='typed-cursor'> &#9608; </span>";
            var promise = writeRedPillLetter(pElem, line, i+1);
            promise.then(function(res) {
                resolve(res);
            }, function(e) {
                reject(e);
            });
        }, 50);
    });
}

