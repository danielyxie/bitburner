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

redPillFlag = false;
function hackWorldDaemon(currentNode="BitNode-1") {
    redPillFlag = true;
    Engine.loadRedPillContent();
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
        return writeRedPillLine("Restarting " + currentNode + "...");
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
        return loadBitVerse();
    }).catch(function(e){
        console.log("ERROR: " + e.toString());
    });
}

function loadBitVerse() {
    //Clear the screen
    var container = document.getElementById("red-pill-container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
            
    //Create the Bit Verse
    var bitVerseImage = document.createElement("pre");
    var bitNodes = [];
    for (var i = 1; i <= 12; ++i) {
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
 
    
    /*
    "                          O                          <br>" +
    "             |  O  O      |      O  O  |             <br>" +
    "        O    |  | /     __|       \ |  |    O        <br>" +
    "      O |    O  | |  O /  |  O    | |  O    | O      <br>" +
    "    | | |    |  |_/  |/   |   \_  \_|  |    | | |    <br>" +
    "  O | | | O  |  | O__/    |   / \__ |  |  O | | | O  <br>" +
    "  | | | | |  |  |   /    /|  O  /  \|  |  | | | | |  <br>" +
    "O | | |  \|  |  O  /   _/ |    /    O  |  |/  | | | O<br>" +
    "| | | |O  /  |  | O   /   |   O   O |  |  \  O| | | |<br>" +
    "| | |/  \/  / __| | |/ \  |   \   | |__ \  \/  \| | |<br>" +
    " \| O   |  |_/    |\|   \ O    \__|    \_|  |   O |/ <br>" +
    "  | |   |_/       | |    \|    /  |       \_|   | |  <br>" +
    "   \|   /          \|     |   /  /          \   |/   <br>" +
    "    |  O            |     |  /  |            O  |    <br>" +
    "  O |  |            |     |     |            |  | O  <br>" +
    "  | |  |            /    / \    \            |  | |  <br>" +
    "   \|  |           /  O /   \ O  \           |  |/   <br>" +
    "    \  |          /  / |     | \  \          |  /    <br>" +
    "     \ \JUMP O3R |  |  |     |  |  | R3O PMUJ/ /     <br>" +
    "      \||    |   |  |  |     |  |  |   |    ||/      <br>" +
    "       \|     \_ |  |  |     |  |  | _/     |/       <br>" +
    "        \       \| /    \   /    \ |/       /        <br>" +
    "         O       |/   O  | |  O   \|       O         <br>" +
    "         |       |    |  | |  |    |       |         <br>" +
    "          \JUMP3R|JUMP|3R| |R3|PMUJ|R3PMUJ/          <br>"; 
    */
    
    container.appendChild(bitVerseImage);
    
    //Bit node event listeners
    for (var i = 1; i <= 12; ++i) {
        (function() {
            var elemId = "bitnode-" + i.toString();
            var elem = clearEventListeners(elemId);
            if (elem == null) {return;}
            if (i == 1) {
                elem.addEventListener("click", function() {
                    prestigeAugmentation();
                    dialogBoxCreate("Congrats! You've reached the current end of the game. Eventually the " + 
                                    "BitNode/Bitverse will be fully implemented with cool new features, so check " + 
                                    "it out again in the future! You have now been returned " + 
                                    "to the original BitNode (BitNode-1) and you can continue playing if you wish. ");
                    redPillFlag = false;
                    var container = document.getElementById("red-pill-container");
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }
                    
                    //Reenable terminal
                    $("#hack-progress-bar").attr('id', "old-hack-progress-bar");
                    $("#hack-progress").attr('id', "old-hack-progress");
                    document.getElementById("terminal-input-td").innerHTML = '$ <input type="text" id="terminal-input-text-box" class="terminal-input" tabindex="1"/>';
                    $('input[class=terminal-input]').prop('disabled', false);      

                    Terminal.hackFlag = false;
                });
            } else {
                elem.addEventListener("click", function() {
                    dialogBoxCreate("Not yet implemented! Coming soon!")
                });
            }
        }()); //Immediate invocation closure
    }
    
    //Create lore text    
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
        return Promise.resolve(true);
    }).catch(function(e){
        console.log("ERROR: " + e.toString());
    });
}


//Returns string with DOM element for Bit Node
function createBitNode(n) {
    var bitNodeStr = "BitNode" + n.toString();
    var bitNode = BitNodes[bitNodeStr];
    if (bitNode == null) {return "O";}
    return  "<a class='bitnode tooltip' id='bitnode-" + bitNode.number.toString() + "'><strong>O</strong>" + 
             "<span class='tooltiptext'>" + 
             "<strong>BitNode-" + bitNode.number.toString() + "<br>" + bitNode.name+ "</strong><br>" + 
             bitNode.desc + "<br>" + 
             "</span></a>";
}

