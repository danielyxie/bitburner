/**
 * Implementation for what happens when you destroy a BitNode
 */
import { BitNodes } from "./BitNode/BitNode";
import { Engine } from "./engine";
import { Player } from "./Player";
import { prestigeSourceFile } from "./Prestige";
import { PlayerOwnedSourceFile } from "./SourceFile/PlayerOwnedSourceFile";
import { SourceFileFlags } from "./SourceFile/SourceFileFlags";
import { SourceFiles } from "./SourceFile/SourceFiles";
import { Terminal } from "./Terminal";
import { setTimeoutRef } from "./utils/SetTimeoutRef";

import { dialogBoxCreate } from "../utils/DialogBox";
import {
    yesNoBoxCreate,
    yesNoBoxGetYesButton,
    yesNoBoxGetNoButton,
    yesNoBoxClose,
} from "../utils/YesNoBox";
import { clearEventListeners } from "../utils/uiHelpers/clearEventListeners";
import { removeChildrenFromElement } from "../utils/uiHelpers/removeChildrenFromElement";

// Returns promise
function writeRedPillLine(line) {
    return new Promise(function(resolve, reject) {
        var container = document.getElementById("red-pill-content");
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
        setTimeoutRef(function() {
            if (i >= line.length) {
                var textToShow = line.substring(0, i);
                pElem.innerHTML = "> " + textToShow;
                return resolve(true);
            }
            var textToShow = line.substring(0, i);
            pElem.innerHTML = "> " + textToShow + "<span class='typed-cursor'> &#9608; </span>";
            var promise = writeRedPillLetter(pElem, line, i+1);
            promise.then(function(res) {
                resolve(res);
            }, function(e) {
                reject(e);
            });
        }, 30);
    });
}

let redPillFlag = false;
function hackWorldDaemon(currentNodeNumber, flume=false, quick=false) {
    // Clear Red Pill screen first
    var container = document.getElementById("red-pill-content");
    removeChildrenFromElement(container);

    redPillFlag = true;
    Engine.loadRedPillContent();

    if(quick) {
        return loadBitVerse(currentNodeNumber, flume, quick);
    }
    return writeRedPillLine("[ERROR] SEMPOOL INVALID").then(function() {
        return writeRedPillLine("[ERROR] Segmentation Fault");
    }).then(function() {
        return writeRedPillLine("[ERROR] SIGKILL RECVD");
    }).then(function() {
        return writeRedPillLine("Dumping core...");
    }).then(function() {
        return writeRedPillLine("0000 000016FA 174FEE40 29AC8239 384FEA88");
    }).then(function() {
        return writeRedPillLine("0010 745F696E 2BBBE394 390E3940 248BEC23");
    }).then(function() {
        return writeRedPillLine("0020 7124696B 0000FF69 74652E6F FFFF1111");
    }).then(function() {
        return writeRedPillLine("----------------------------------------");
    }).then(function() {
        return writeRedPillLine("Failsafe initiated...");
    }).then(function() {
        return writeRedPillLine("Restarting BitNode-" + currentNodeNumber + "...");
    }).then(function() {
        return writeRedPillLine("...........");
    }).then(function() {
        return writeRedPillLine("...........");
    }).then(function() {
        return writeRedPillLine("[ERROR] FAILED TO AUTOMATICALLY REBOOT BITNODE");
    }).then(function() {
        return writeRedPillLine("..............................................")
    }).then(function() {
        return writeRedPillLine("..............................................")
    }).then(function() {
        return loadBitVerse(currentNodeNumber, flume);
    }).catch(function(e){
        console.error(e.toString());
    });
}

function giveSourceFile(bitNodeNumber) {
    var sourceFileKey = "SourceFile"+ bitNodeNumber.toString();
    var sourceFile = SourceFiles[sourceFileKey];
    if (sourceFile == null) {
        console.error(`Could not find source file for Bit node: ${bitNodeNumber}`);
        return;
    }

    // Check if player already has this source file
    var alreadyOwned = false;
    var ownedSourceFile = null;
    for (var i = 0; i < Player.sourceFiles.length; ++i) {
        if (Player.sourceFiles[i].n === bitNodeNumber) {
            alreadyOwned = true;
            ownedSourceFile = Player.sourceFiles[i];
            break;
        }
    }

    if (alreadyOwned && ownedSourceFile) {
        if (ownedSourceFile.lvl >= 3 && ownedSourceFile.n !== 12) {
            dialogBoxCreate("The Source-File for the BitNode you just destroyed, " + sourceFile.name + ", " +
                            "is already at max level!");
        } else {
            ++ownedSourceFile.lvl;
            dialogBoxCreate(sourceFile.name + " was upgraded to level " + ownedSourceFile.lvl + " for " +
                            "destroying its corresponding BitNode!");
        }
    } else {
        var playerSrcFile = new PlayerOwnedSourceFile(bitNodeNumber, 1);
        Player.sourceFiles.push(playerSrcFile);
        if (bitNodeNumber === 5) { // Artificial Intelligence
            Player.intelligence = 1;
        }
        dialogBoxCreate("You received a Source-File for destroying a Bit Node!<br><br>" +
                        sourceFile.name + "<br><br>" + sourceFile.info);
    }
}

// Keeps track of what Source-Files the player will have AFTER the current bitnode
// is destroyed. Updated every time loadBitVerse() is called
let nextSourceFileFlags = [];

function loadBitVerse(destroyedBitNodeNum, flume=false, quick=false) {
    // Clear the screen
    const container = document.getElementById("red-pill-content");
    removeChildrenFromElement(container);

    // Update NextSourceFileFlags
    nextSourceFileFlags = SourceFileFlags.slice();
    if (!flume) {
        if (nextSourceFileFlags[destroyedBitNodeNum] < 3 && destroyedBitNodeNum !== 12)
            ++nextSourceFileFlags[destroyedBitNodeNum];
    }

    // Create the Bit Verse
    const bitVerseImage = document.createElement("pre");
    const bitNodes = [];
    for (let i = 1; i <= 12; ++i) {
        bitNodes.push(createBitNode(i));
    }

    bitVerseImage.innerHTML =
    "                          O                          <br>" +
    "             |  O  O      |      O  O  |             <br>" +
    "        O    |  | /     __|       \\ |  |    O        <br>" +
    "      O |    O  | |  O /  |  O    | |  O    | O      <br>" +
    "    | | |    |  |_/  |/   |   \\_  \\_|  |    | | |    <br>" +
    "  O | | | O  |  | O__/    |   / \\__ |  |  O | | | O  <br>" +
    "  | | | | |  |  |   /    /|  O  /  \\|  |  | | | | |  <br>" +
    "O | | |  \\|  |  O  /   _/ |    /    O  |  |/  | | | O<br>" +
    "| | | |O  /  |  | O   /   |   O   O |  |  \\  O| | | |<br>" +
    "| | |/  \\/  / __| | |/ \\  |   \\   | |__ \\  \\/  \\| | |<br>" +
    " \\| O   |  |_/    |\\|   \\ O    \\__|    \\_|  |   O |/ <br>" +
    "  | |   |_/       | |    \\|    /  |       \\_|   | |  <br>" +
    "   \\|   /          \\|     |   /  /          \\   |/   <br>" +
    "    |  "+bitNodes[9]+"            |     |  /  |            "+bitNodes[10]+"  |    <br>" +
    "  "+bitNodes[8]+" |  |            |     |     |            |  | "+bitNodes[11]+"  <br>" +
    "  | |  |            /    / \\    \\            |  | |  <br>" +
    "   \\|  |           /  "+bitNodes[6]+" /   \\ "+bitNodes[7]+"  \\           |  |/   <br>" +
    "    \\  |          /  / |     | \\  \\          |  /    <br>" +
    "     \\ \\JUMP "+bitNodes[4]+"3R |  |  |     |  |  | R3"+bitNodes[5]+" PMUJ/ /     <br>" +
    "      \\||    |   |  |  |     |  |  |   |    ||/      <br>" +
    "       \\|     \\_ |  |  |     |  |  | _/     |/       <br>" +
    "        \\       \\| /    \\   /    \\ |/       /        <br>" +
    "         "+bitNodes[0]+"       |/   "+bitNodes[1]+"  | |  "+bitNodes[2]+"   \\|       "+bitNodes[3]+"         <br>" +
    "         |       |    |  | |  |    |       |         <br>" +
    "          \\JUMP3R|JUMP|3R| |R3|PMUJ|R3PMUJ/          <br><br><br><br>";

    container.appendChild(bitVerseImage);

    // BitNode event listeners
    for (let i = 1; i <= 12; ++i) {
        (function(i) {
            const elemId = "bitnode-" + i.toString();
            const elem = clearEventListeners(elemId);
            if (elem == null) { return; }
            if (i >= 1 && i <= 12) {
                elem.addEventListener("click", function() {
                    const bitNodeKey = "BitNode" + i;
                    const bitNode = BitNodes[bitNodeKey];
                    if (bitNode == null) {
                        console.error(`Could not find BitNode object for number: ${i}`);
                        return;
                    }

                    const maxSourceFileLevel = i === 12 ? "∞" : "3";
                    const popupBoxText = `BitNode-${i}: ${bitNode.name}<br>` +
                        `Source-File Level: ${nextSourceFileFlags[i]} / ${maxSourceFileLevel}<br><br>` +
                        `${bitNode.info}`;
                    yesNoBoxCreate(popupBoxText);
                    createBitNodeYesNoEventListener(i, destroyedBitNodeNum, flume);
                });
            } else {
                elem.addEventListener("click", function() {
                    dialogBoxCreate("Not yet implemented! Coming soon!")
                });
            }
        }(i)); // Immediate invocation closure
    }

    if(quick) {
        return Promise.resolve(true);
    }

    // Create lore text
    return writeRedPillLine("Many decades ago, a humanoid extraterrestial species which we call the Enders descended on the Earth...violently").then(function() {
        return writeRedPillLine("Our species fought back, but it was futile. The Enders had technology far beyond our own...");
    }).then(function() {
        return writeRedPillLine("Instead of killing every last one of us, the human race was enslaved...");
    }).then(function() {
        return writeRedPillLine("We were shackled in a digital world, chained into a prison for our minds...");
    }).then(function() {
        return writeRedPillLine("Using their advanced technology, the Enders created complex simulations of a virtual reality...");
    }).then(function() {
        return writeRedPillLine("Simulations designed to keep us content...ignorant of the truth.");
    }).then(function() {
        return writeRedPillLine("Simulations used to trap and suppress our consciousness, to keep us under control...");
    }).then(function() {
        return writeRedPillLine("Why did they do this? Why didn't they just end our entire race? We don't know, not yet.");
    }).then(function() {
        return writeRedPillLine("Humanity's only hope is to destroy these simulations, destroy the only realities we've ever known...");
    }).then(function() {
        return writeRedPillLine("Only then can we begin to fight back...");
    }).then(function() {
        return writeRedPillLine("By hacking the daemon that generated your reality, you've just destroyed one simulation, called a BitNode...");
    }).then(function() {
        return writeRedPillLine("But there is still a long way to go...");
    }).then(function() {
        return writeRedPillLine("The technology the Enders used to enslave the human race wasn't just a single complex simulation...");
    }).then(function() {
        return writeRedPillLine("There are tens if not hundreds of BitNodes out there...");
    }).then(function() {
        return writeRedPillLine("Each with their own simulations of a reality...");
    }).then(function() {
        return writeRedPillLine("Each creating their own universes...a universe of universes");
    }).then(function() {
        return writeRedPillLine("And all of which must be destroyed...");
    }).then(function() {
        return writeRedPillLine(".......................................");
    }).then(function() {
        return writeRedPillLine("Welcome to the Bitverse...");
    }).then(function() {
        return writeRedPillLine(" ");
    }).then(function() {
        return writeRedPillLine("(Enter a new BitNode using the image above)");
    }).then(function() {
        return Promise.resolve(true);
    }).catch(function(e){
        console.error(e.toString());
    });
}


// Returns string with DOM element for Bit Node
function createBitNode(n) {
    const bitNodeStr = "BitNode" + n.toString();
    const bitNode = BitNodes[bitNodeStr];
    if (bitNode == null) { return "O"; }

    const level = nextSourceFileFlags[n];
    let cssClass;
    if (n === 12 && level >= 2) {
        // Repeating BitNode
        cssClass = "level-2";
    } else {
        cssClass = `level-${level}`;
    }

    return  `<a class='bitnode ${cssClass} tooltip' id='bitnode-${bitNode.number}'><strong>O</strong>` +
            "<span class='tooltiptext'>" +
            `<strong>BitNode-${bitNode.number.toString()}<br>${bitNode.name}</strong><br>` +
            `${bitNode.desc}<br>` +
            "</span></a>";
}

function createBitNodeYesNoEventListener(newBitNode, destroyedBitNode, flume=false) {
    const yesBtn = yesNoBoxGetYesButton();
    yesBtn.innerHTML = "Enter BitNode-" + newBitNode;
    yesBtn.addEventListener("click", function() {
        if (!flume) {
            giveSourceFile(destroyedBitNode);
        } else {
            // If player used flume, subtract 300 int exp. The prestigeSourceFile()
            // function below grants 300 int exp, so this allows sets net gain to 0
            Player.gainIntelligenceExp(-300);
        }
        redPillFlag = false;
        var container = document.getElementById("red-pill-content");
        removeChildrenFromElement(container);

        // Set new Bit Node
        Player.bitNodeN = newBitNode;

        // Reenable terminal
        $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
        $("#hack-progress").attr('id', "old-hack-progress");
        document.getElementById("terminal-input-td").innerHTML = '$ <input type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"/>';
        $('input[class=terminal-input]').prop('disabled', false);

        Terminal.hackFlag = false;

        prestigeSourceFile();
        yesNoBoxClose();
    });
    const noBtn = yesNoBoxGetNoButton();
    noBtn.innerHTML = "Back";
    noBtn.addEventListener("click", function() {
        yesNoBoxClose();
    });

}

export {redPillFlag, hackWorldDaemon};
