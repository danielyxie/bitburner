import {CONSTANTS}                                  from "./Constants";
import {Engine}                                     from "./engine";
import {displayFactionContent}                      from "./Faction";
import {Player}                                     from "./Player";
import {dialogBoxCreate}                            from "../utils/DialogBox";
import {addOffset, getRandomInt,
        clearEventListenersEl,
        clearEventListeners}                        from "../utils/HelperFunctions";
import {formatNumber}                               from "../utils/StringHelperFunctions";
import {isString}                                   from "../utils/helpers/isString";
import jsplumb                                      from 'jsplumb'

let inMission = false; //Flag to denote whether a mission is running
let currMission = null;
function setInMission(bool, mission) {
    inMission = bool;
    if (bool) {
        currMission = mission;
    } else {
        currMission = null;
    }
}

//Keyboard shortcuts
$(document).keydown(function(e) {
    if (inMission && currMission && currMission.selectedNode.length != 0) {
        switch (e.keyCode) {
            case 65: //a for Attack
                currMission.actionButtons[0].click();
                break;
            case 83: //s for Scan
                currMission.actionButtons[1].click();
                break;
            case 87: //w for Weaken
                currMission.actionButtons[2].click();
                break;
            case 70: //f for Fortify
                currMission.actionButtons[3].click();
                break;
            case 82: //r for Overflow
                currMission.actionButtons[4].click();
                break;
            case 68: //d for Detach connection
                currMission.actionButtons[5].click();
                break;
            default:
                break;
        }
    }
});

let NodeTypes = {
    Core: "CPU Core Node",      //All actions available
    Firewall: "Firewall Node",  //No actions available
    Database: "Database Node",  //No actions available
    Spam: "Spam Node",          //No actions Available
    Transfer: "Transfer Node",  //Can Weaken, Scan, Fortify and Overflow
    Shield: "Shield Node"       //Can Fortify
}

let NodeActions = {
    Attack: "Attacking", //Damaged based on attack stat + hacking level + opp def
    Scan: "Scanning", //-Def for target, affected by attack and hacking level
    Weaken: "Weakening", //-Attack for target, affected by attack and hacking level
    Fortify: "Fortifying", //+Defense for Node, affected by hacking level
    Overflow: "Overflowing", //+Attack but -Defense for Node, affected by hacking level
}

function Node(type, stats) {
    this.type = type;
    this.atk = stats.atk ? stats.atk : 0;
    this.def = stats.def ? stats.def : 0;
    this.hp = stats.hp ? stats.hp : 0;
    this.maxhp = this.hp;
    this.plyrCtrl = false;
    this.enmyCtrl = false;
    this.pos = [0, 0]; //x, y
    this.el = null; //Holds the Node's DOM element
    this.action = null;
    this.targetedCount = 0; //Count of how many connections this node is the target of

    //Holds the JsPlumb Connection object for this Node,
    //where this Node is the Source (since each Node
    //can only have 1 outgoing Connection)
    this.conn = null;
}

Node.prototype.setPosition = function(x, y) {
    this.pos = [x, y];
}

Node.prototype.setControlledByPlayer = function() {
    this.plyrCtrl = true;
    this.enmyCtrl = false;
    if (this.el) {
        this.el.classList.remove("hack-mission-enemy-node");
        this.el.classList.add("hack-mission-player-node");
    }
}

Node.prototype.setControlledByEnemy = function() {
    this.plyrCtrl = false;
    this.enmyCtrl = true;
    if (this.el) {
        this.el.classList.remove("hack-mission-player-node");
        this.el.classList.add("hack-mission-enemy-node");
    }
}

//Sets this node to be the active node
Node.prototype.select = function(actionButtons) {
    if (this.enmyCtrl) {return;}
    this.el.classList.add("hack-mission-player-node-active");

    //Make all buttons inactive
    for (var i = 0; i < actionButtons.length; ++i) {
        actionButtons[i].classList.remove("a-link-button");
        actionButtons[i].classList.add("a-link-button-inactive");
    }

    switch(this.type) {
        case NodeTypes.Core:
            //All buttons active
            for (var i = 0; i < actionButtons.length; ++i) {
                actionButtons[i].classList.remove("a-link-button-inactive");
                actionButtons[i].classList.add("a-link-button");
            }
            break;
        case NodeTypes.Transfer:
            actionButtons[1].classList.remove("a-link-button-inactive");
            actionButtons[1].classList.add("a-link-button");
            actionButtons[2].classList.remove("a-link-button-inactive");
            actionButtons[2].classList.add("a-link-button");
            actionButtons[3].classList.remove("a-link-button-inactive");
            actionButtons[3].classList.add("a-link-button");
            actionButtons[4].classList.remove("a-link-button-inactive");
            actionButtons[4].classList.add("a-link-button");
            actionButtons[5].classList.remove("a-link-button-inactive");
            actionButtons[5].classList.add("a-link-button");
            break;
        case NodeTypes.Shield:
        case NodeTypes.Firewall:
            actionButtons[3].classList.remove("a-link-button-inactive");
            actionButtons[3].classList.add("a-link-button");
            break;
        default:
            break;
    }
}

Node.prototype.deselect = function(actionButtons) {
    this.el.classList.remove("hack-mission-player-node-active");
    for (var i = 0; i < actionButtons.length; ++i) {
        actionButtons[i].classList.remove("a-link-button");
        actionButtons[i].classList.add("a-link-button-inactive");
    }
}


Node.prototype.untarget = function() {
    if (this.targetedCount === 0) {
        console.log("WARN: Node " + this.el.id + " is being 'untargeted' when it has no target count");
        return;
    }
    --this.targetedCount;
}

//Hacking mission instance
//Takes in the reputation of the Faction for which the mission is
//being conducted
function HackingMission(rep, fac) {
    this.faction = fac;

    this.started = false;
    this.time = 180000; //5 minutes to start, milliseconds

    this.playerCores = [];
    this.playerNodes = []; //Non-core nodes
    this.playerAtk = 0;
    this.playerDef = 0;

    this.enemyCores = [];
    this.enemyDatabases = [];
    this.enemyNodes = []; //Non-core nodes
    this.enemyAtk = 0;
    this.enemyDef = 0;

    this.miscNodes = [];

    this.selectedNode = []; //Which of the player's nodes are currently selected

    this.actionButtons = []; //DOM buttons for actions

    this.availablePositions = [];
    for (var r = 0; r < 8; ++r) {
        for (var c = 0; c < 8; ++c) {
            this.availablePositions.push([r, c]);
        }
    }

    this.map = [];
    for (var i = 0; i < 8; ++i) {
        this.map.push([null, null, null, null, null, null, null, null]);
    }

    this.jsplumbinstance = null;

    this.difficulty = rep / CONSTANTS.HackingMissionRepToDiffConversion + 1;
    console.log("difficulty: " + this.difficulty);
    this.reward = 250 + (rep / CONSTANTS.HackingMissionRepToRewardConversion);
}

HackingMission.prototype.init = function() {
    //Create Header DOM
    this.createPageDom();

    //Create player starting nodes
    var home = Player.getHomeComputer()
    for (var i = 0; i < home.cpuCores; ++i) {
        var stats = {
            atk: (Player.hacking_skill / 7.5) + 30,
            def: (Player.hacking_skill / 20),
            hp: (Player.hacking_skill / 4),
        };
        this.playerCores.push(new Node(NodeTypes.Core, stats));
        this.playerCores[i].setControlledByPlayer();
        this.setNodePosition(this.playerCores[i], i, 0);
        this.removeAvailablePosition(i, 0);
    }

    //Randomly generate enemy nodes (CPU and Firewall) based on difficulty
    var numNodes = Math.min(8, Math.max(1, Math.round(this.difficulty / 4)));
    var numFirewalls = Math.min(20,
                                getRandomInt(Math.round(this.difficulty/3), Math.round(this.difficulty/3) + 1));
    var numDatabases = Math.min(10, getRandomInt(1, Math.round(this.difficulty / 3) + 1));
    var totalNodes = numNodes + numFirewalls + numDatabases;
    var xlimit = 7 - Math.floor(totalNodes / 8);
    var randMult = addOffset(0.8 + (this.difficulty / 5), 10);
    for (var i = 0; i < numNodes; ++i) {
        var stats = {
            atk: randMult * getRandomInt(80, 86),
            def: randMult * getRandomInt(5, 10),
            hp: randMult * getRandomInt(210, 230)
        }
        this.enemyCores.push(new Node(NodeTypes.Core, stats));
        this.enemyCores[i].setControlledByEnemy();
        this.setNodeRandomPosition(this.enemyCores[i], xlimit);
    }
    for (var i = 0; i < numFirewalls; ++i) {
        var stats = {
            atk: 0,
            def: randMult * getRandomInt(10, 20),
            hp: randMult * getRandomInt(275, 300)
        }
        this.enemyNodes.push(new Node(NodeTypes.Firewall, stats));
        this.enemyNodes[i].setControlledByEnemy();
        this.setNodeRandomPosition(this.enemyNodes[i], xlimit);
    }
    for (var i = 0; i < numDatabases; ++i) {
        var stats = {
            atk: 0,
            def: randMult * getRandomInt(30, 55),
            hp: randMult * getRandomInt(210, 275)
        }
        var node = new Node(NodeTypes.Database, stats);
        node.setControlledByEnemy();
        this.setNodeRandomPosition(node, xlimit);
        this.enemyDatabases.push(node);
    }
    this.calculateDefenses();
    this.calculateAttacks();
    this.createMap();
}

HackingMission.prototype.createPageDom = function() {
    var container = document.getElementById("mission-container");

    var favorMult = 1 + (this.faction.favor / 100);
    var gain = this.reward  * Player.faction_rep_mult * favorMult;
    var headerText = document.createElement("p");
    headerText.innerHTML = "You are about to start a hacking mission! You will gain " +
                    formatNumber(gain, 3) + " faction reputation with " + this.faction.name +
                    " if you win. For more information " +
                    "about how hacking missions work, click one of the guide links " +
                    "below (one opens up an in-game guide and the other opens up " +
                    "the guide from the wiki). Click the 'Start' button to begin.";
    headerText.style.display = "block";
    headerText.classList.add("hack-mission-header-element");
    headerText.style.width = "80%";

    var inGameGuideBtn = document.createElement("a");
    inGameGuideBtn.innerText = "How to Play";
    inGameGuideBtn.classList.add("a-link-button");
    inGameGuideBtn.style.display = "inline-block";
    inGameGuideBtn.classList.add("hack-mission-header-element");
    inGameGuideBtn.addEventListener("click", function() {
        dialogBoxCreate(CONSTANTS.HackingMissionHowToPlay);
        return false;
    });

    var wikiGuideBtn = document.createElement("a");
    wikiGuideBtn.innerText = "Wiki Guide";
    wikiGuideBtn.classList.add("a-link-button");
    wikiGuideBtn.style.display = "inline-block";
    wikiGuideBtn.classList.add("hack-mission-header-element");
    wikiGuideBtn.target = "_blank";
    //TODO Add link to wiki page     wikiGuideBtn.href =


    //Start button will get replaced with forfeit when game is started
    var startBtn = document.createElement("a");
    startBtn.innerHTML = "Start";
    startBtn.setAttribute("id", "hack-mission-start-btn");
    startBtn.classList.add("a-link-button");
    startBtn.classList.add("hack-mission-header-element");
    startBtn.style.display = "inline-block";
    startBtn.addEventListener("click", ()=>{
        this.start();
        return false;
    });

    var forfeitMission = document.createElement("a");
    forfeitMission.innerHTML = "Forfeit Mission (Exit)";
    forfeitMission.classList.add("a-link-button");
    forfeitMission.classList.add("hack-mission-header-element");
    forfeitMission.style.display = "inline-block";
    forfeitMission.addEventListener("click", ()=> {
        this.finishMission(false);
        return false;
    });

    var timer = document.createElement("p");
    timer.setAttribute("id", "hacking-mission-timer");
    timer.style.display = "inline-block";
    timer.style.margin = "6px";

    //Create Action Buttons (Attack/Scan/Weaken/ etc...)
    var actionsContainer = document.createElement("span");
    actionsContainer.style.display = "block";
    actionsContainer.classList.add("hack-mission-action-buttons-container");
    for (var i = 0; i < 6; ++i) {
        this.actionButtons.push(document.createElement("a"));
        this.actionButtons[i].style.display = "inline-block";
        this.actionButtons[i].classList.add("a-link-button-inactive"); //Disabled at start
        this.actionButtons[i].classList.add("tooltip"); //Disabled at start
        this.actionButtons[i].classList.add("hack-mission-header-element");
        actionsContainer.appendChild(this.actionButtons[i]);
    }
    this.actionButtons[0].innerText = "Attack(a)";
    var atkTooltip = document.createElement("span");
    atkTooltip.classList.add("tooltiptexthigh");
    atkTooltip.innerText = "Lowers the targeted node's HP. The effectiveness of this depends on " +
                           "this node's Attack level, your hacking level, and the opponent's defense level.";
    this.actionButtons[0].appendChild(atkTooltip);
    this.actionButtons[1].innerText = "Scan(s)";
    var scanTooltip = document.createElement("span");
    scanTooltip.classList.add("tooltiptexthigh");
    scanTooltip.innerText = "Lowers the targeted node's defense. The effectiveness of this depends on " +
                            "this node's Attack level, your hacking level, and the opponent's defense level.";
    this.actionButtons[1].appendChild(scanTooltip);
    this.actionButtons[2].innerText = "Weaken(w)";
    var WeakenTooltip = document.createElement("span");
    WeakenTooltip.classList.add("tooltiptexthigh");
    WeakenTooltip.innerText = "Lowers the targeted node's attack. The effectiveness of this depends on " +
                              "this node's Attack level, your hacking level, and the opponent's defense level.";
    this.actionButtons[2].appendChild(WeakenTooltip);
    this.actionButtons[3].innerText = "Fortify(f)";
    var fortifyTooltip = document.createElement("span");
    fortifyTooltip.classList.add("tooltiptexthigh");
    fortifyTooltip.innerText = "Raises this node's Defense level. The effectiveness of this depends on " +
                               "your hacking level";
    this.actionButtons[3].appendChild(fortifyTooltip);
    this.actionButtons[4].innerText = "Overflow(r)";
    var overflowTooltip = document.createElement("span");
    overflowTooltip.classList.add("tooltiptexthigh");
    overflowTooltip.innerText = "Raises this node's Attack level but lowers its Defense level. The effectiveness " +
                                "of this depends on your hacking level.";
    this.actionButtons[4].appendChild(overflowTooltip);
    this.actionButtons[5].innerText = "Drop Connection(d)";
    var dropconnTooltip = document.createElement("span");
    dropconnTooltip.classList.add("tooltiptexthigh");
    dropconnTooltip.innerText = "Removes this Node's current connection to some target Node, if it has one. This can " +
                                "also be done by simply clicking the white connection line.";
    this.actionButtons[5].appendChild(dropconnTooltip);

    //Player/enemy defense displays will be in action container
    var playerStats = document.createElement("p");
    var enemyStats = document.createElement("p");
    playerStats.style.display = "inline-block";
    enemyStats.style.display = "inline-block";
    playerStats.style.color = "#00ccff";
    enemyStats.style.color = "red";
    playerStats.style.margin = "4px";
    enemyStats.style.margin = "4px";
    playerStats.setAttribute("id", "hacking-mission-player-stats");
    enemyStats.setAttribute("id", "hacking-mission-enemy-stats");
    actionsContainer.appendChild(playerStats);
    actionsContainer.appendChild(enemyStats);

    //Set Action Button event listeners
    this.actionButtons[0].addEventListener("click", ()=>{
        if (!(this.selectedNode.length > 0)) {
            console.log("ERR: Pressing Action button without selected node");
            return;
        }
        if (this.selectedNode[0].type !== NodeTypes.Core) {return;}
        this.setActionButtonsActive(this.selectedNode[0].type);
        this.setActionButton(NodeActions.Attack, false); //Set attack button inactive
        this.selectedNode.forEach(function(node){
            node.action = NodeActions.Attack;
        });
    });

    this.actionButtons[1].addEventListener("click", ()=>{
        if (!(this.selectedNode.length > 0)) {
            console.log("ERR: Pressing Action button without selected node");
            return;
        }
        var nodeType = this.selectedNode[0].type; //In a multiselect, every Node will have the same type
        if (nodeType !== NodeTypes.Core && nodeType !== NodeTypes.Transfer) {return;}
        this.setActionButtonsActive(nodeType);
        this.setActionButton(NodeActions.Scan, false); //Set scan button inactive
        this.selectedNode.forEach(function(node){
            node.action = NodeActions.Scan;
        });
    });

    this.actionButtons[2].addEventListener("click", ()=>{
        if (!(this.selectedNode.length > 0)) {
            console.log("ERR: Pressing Action button without selected node");
            return;
        }
        var nodeType = this.selectedNode[0].type; //In a multiselect, every Node will have the same type
        if (nodeType !== NodeTypes.Core && nodeType !== NodeTypes.Transfer) {return;}
        this.setActionButtonsActive(nodeType);
        this.setActionButton(NodeActions.Weaken, false); //Set Weaken button inactive
        this.selectedNode.forEach(function(node){
            node.action = NodeActions.Weaken;
        });
    });

    this.actionButtons[3].addEventListener("click", ()=>{
        if (!(this.selectedNode.length > 0)) {
            console.log("ERR: Pressing Action button without selected node");
            return;
        }
        this.setActionButtonsActive(this.selectedNode[0].type);
        this.setActionButton(NodeActions.Fortify, false); //Set Fortify button inactive
        this.selectedNode.forEach(function(node){
            node.action = NodeActions.Fortify;
        });
    });

    this.actionButtons[4].addEventListener("click", ()=>{
        if (!(this.selectedNode.length > 0)) {
            console.log("ERR: Pressing Action button without selected node");
            return;
        }
        var nodeType = this.selectedNode[0].type;
        if (nodeType !== NodeTypes.Core && nodeType !== NodeTypes.Transfer) {return;}
        this.setActionButtonsActive(nodeType);
        this.setActionButton(NodeActions.Overflow, false); //Set Overflow button inactive
        this.selectedNode.forEach(function(node){
            node.action = NodeActions.Overflow;
        });
    });

    this.actionButtons[5].addEventListener("click", ()=>{
        if (!(this.selectedNode.length > 0)) {
            console.log("ERR: Pressing Action button without selected node");
            return;
        }
        this.selectedNode.forEach(function(node){
            if (node.conn) {
                var endpoints = node.conn.endpoints;
                endpoints[0].detachFrom(endpoints[1]);
            }
            node.action = NodeActions.Fortify;
        });
        // if (this.selectedNode.conn) {
        //     var endpoints = this.selectedNode.conn.endpoints;
        //     endpoints[0].detachFrom(endpoints[1]);
        // }
    })

    var timeDisplay = document.createElement("p");

    container.appendChild(headerText);
    container.appendChild(inGameGuideBtn);
    container.appendChild(wikiGuideBtn);
    container.appendChild(startBtn);
    container.appendChild(forfeitMission);
    container.appendChild(timer);
    container.appendChild(actionsContainer);
    container.appendChild(timeDisplay);
}

HackingMission.prototype.setActionButtonsInactive = function() {
    for (var i = 0; i < this.actionButtons.length; ++i) {
        this.actionButtons[i].classList.remove("a-link-button");
        this.actionButtons[i].classList.add("a-link-button-inactive");
    }
}

HackingMission.prototype.setActionButtonsActive = function(nodeType=null) {
    for (var i = 0; i < this.actionButtons.length; ++i) {
        this.actionButtons[i].classList.add("a-link-button");
        this.actionButtons[i].classList.remove("a-link-button-inactive");
    }

    //For Transfer, FireWall and Shield Nodes, certain buttons should always be disabled
    //0 = Attack, 1 = Scan, 2 = Weaken, 3 = Fortify, 4 = overflow, 5 = Drop conn
    if (nodeType) {
        switch (nodeType) {
            case NodeTypes.Firewall:
            case NodeTypes.Shield:
                this.actionButtons[0].classList.remove("a-link-button");
                this.actionButtons[0].classList.add("a-link-button-inactive");
                this.actionButtons[1].classList.remove("a-link-button");
                this.actionButtons[1].classList.add("a-link-button-inactive");
                this.actionButtons[2].classList.remove("a-link-button");
                this.actionButtons[2].classList.add("a-link-button-inactive");
                this.actionButtons[4].classList.remove("a-link-button");
                this.actionButtons[4].classList.add("a-link-button-inactive");
                this.actionButtons[5].classList.remove("a-link-button");
                this.actionButtons[5].classList.add("a-link-button-inactive");
                break;
            case NodeTypes.Transfer:
                this.actionButtons[0].classList.remove("a-link-button");
                this.actionButtons[0].classList.add("a-link-button-inactive");
                break;
            default:
                break;
        }
    }
}

//True for active, false for inactive
HackingMission.prototype.setActionButton = function(i, active=true) {
    if (isString(i)) {
        switch (i) {
            case NodeActions.Attack:
                i = 0;
                break;
            case NodeActions.Scan:
                i = 1;
                break;
            case NodeActions.Weaken:
                i = 2;
                break;
            case NodeActions.Fortify:
                i = 3;
                break;
            case NodeActions.Overflow:
            default:
                i = 4;
                break;
        }
    }
    if (active) {
        this.actionButtons[i].classList.remove("a-link-button-inactive");
        this.actionButtons[i].classList.add("a-link-button");
    } else {
        this.actionButtons[i].classList.remove("a-link-button");
        this.actionButtons[i].classList.add("a-link-button-inactive");
    }

}

HackingMission.prototype.calculateAttacks = function() {
    var total = 0;
    for (var i = 0; i < this.playerCores.length; ++i) {
        total += this.playerCores[i].atk;
    }
    for (var i = 0; i < this.playerNodes.length; ++i) {
        total += this.playerNodes[i].atk;
    }
    this.playerAtk = total;
    document.getElementById("hacking-mission-player-stats").innerHTML =
        "Player Attack: " + formatNumber(this.playerAtk, 1) + "<br>" +
        "Player Defense: " + formatNumber(this.playerDef, 1);
    total = 0;
    for (var i = 0; i < this.enemyCores.length; ++i) {
        total += this.enemyCores[i].atk;
    }
    for (var i = 0; i < this.enemyDatabases.length; ++i) {
        total += this.enemyDatabases[i].atk;
    }
    for (var i = 0; i < this.enemyNodes.length; ++i) {
        total += this.enemyNodes[i].atk;
    }
    this.enemyAtk = total;
    document.getElementById("hacking-mission-enemy-stats").innerHTML =
        "Enemy Attack: " + formatNumber(this.enemyAtk, 1) + "<br>" +
        "Enemy Defense: " + formatNumber(this.enemyDef, 1);
}

HackingMission.prototype.calculateDefenses = function() {
    var total = 0;
    for (var i = 0; i < this.playerCores.length; ++i) {
        total += this.playerCores[i].def;
    }
    for (var i = 0; i < this.playerNodes.length; ++i) {
        total += this.playerNodes[i].def;
    }
    this.playerDef = total;
    document.getElementById("hacking-mission-player-stats").innerHTML =
        "Player Attack: " + formatNumber(this.playerAtk, 1) + "<br>" +
        "Player Defense: " + formatNumber(this.playerDef, 1);
    total = 0;
    for (var i = 0; i < this.enemyCores.length; ++i) {
        total += this.enemyCores[i].def;
    }
    for (var i = 0; i < this.enemyDatabases.length; ++i) {
        total += this.enemyDatabases[i].def;
    }
    for (var i = 0; i < this.enemyNodes.length; ++i) {
        total += this.enemyNodes[i].def;
    }
    this.enemyDef = total;
    document.getElementById("hacking-mission-enemy-stats").innerHTML =
        "Enemy Attack: " + formatNumber(this.enemyAtk, 1) + "<br>" +
        "Enemy Defense: " + formatNumber(this.enemyDef, 1);
}

HackingMission.prototype.removeAvailablePosition = function(x, y) {
    for (var i = 0; i < this.availablePositions.length; ++i) {
        if (this.availablePositions[i][0] === x &&
            this.availablePositions[i][1] === y) {
            this.availablePositions.splice(i, 1);
            return;
        }
    }
    console.log("WARNING: removeAvailablePosition() did not remove " + x + ", " + y);
}

HackingMission.prototype.setNodePosition = function(nodeObj, x, y) {
    if (!(nodeObj instanceof Node)) {
        console.log("WARNING: Non-Node object passed into setNodePOsition");
        return;
    }
    if (isNaN(x) || isNaN(y)) {
        console.log("ERR: Invalid values passed as x and y for setNodePosition");
        console.log(x);
        console.log(y);
        return;
    }
    nodeObj.pos = [x, y];
    this.map[x][y] = nodeObj;
}

HackingMission.prototype.setNodeRandomPosition = function(nodeObj, xlimit=0) {
    var i = getRandomInt(0, this.availablePositions.length - 1);
    if (this.availablePositions[i][1] < xlimit) {
        //Recurse if not within limit
        return this.setNodeRandomPosition(nodeObj, xlimit);
    }
    var pos = this.availablePositions.splice(i, 1);
    pos = pos[0];
    this.setNodePosition(nodeObj, pos[0], pos[1]);
}

HackingMission.prototype.createMap = function() {
    //Use a grid
    var map = document.createElement("div");
    map.classList.add("hack-mission-grid");
    map.setAttribute("id", "hacking-mission-map");
    document.getElementById("mission-container").appendChild(map);

    //Create random Nodes for every space in the map that
    //hasn't been filled yet. The stats of each Node will be based on
    //the player/enemy attack
    var averageAttack = (this.playerAtk + this.enemyAtk) / 2;
    for (var x = 0; x < 8; ++x) {
        for (var y = 0; y < 8; ++y) {
            if (!(this.map[x][y] instanceof Node)) {
                var node, type = getRandomInt(0, 2);
                var randMult = addOffset(0.85 + (this.difficulty / 2), 15);
                switch (type) {
                    case 0: //Spam
                        var stats = {
                            atk: 0,
                            def: averageAttack * 1.1 + getRandomInt(15, 45),
                            hp: randMult * getRandomInt(200, 225)
                        }
                        node = new Node(NodeTypes.Spam, stats);
                        break;
                    case 1: //Transfer
                        var stats = {
                            atk: 0,
                            def: averageAttack * 1.1 + getRandomInt(15, 45),
                            hp: randMult * getRandomInt(250, 275)
                        }
                        node = new Node(NodeTypes.Transfer, stats);
                        break;
                    case 2: //Shield
                    default:
                        var stats = {
                            atk: 0,
                            def: averageAttack * 1.1 + getRandomInt(30, 70),
                            hp: randMult * getRandomInt(300, 320)
                        }
                        node = new Node(NodeTypes.Shield, stats);
                        break;
                }
                this.setNodePosition(node, x, y);
                this.removeAvailablePosition(x, y);
                this.miscNodes.push(node);
            }
        }
    }

    //Create DOM elements in order
    for (var r = 0; r < 8; ++r) {
        for (var c = 0; c < 8; ++c) {
            this.createNodeDomElement(this.map[r][c]);
        }
    }

    //Configure all Player CPUS
    for (var i = 0; i < this.playerCores.length; ++i) {
        console.log("Configuring Player Node: " + this.playerCores[i].el.id);
        this.configurePlayerNodeElement(this.playerCores[i].el);
    }
}

HackingMission.prototype.createNodeDomElement = function(nodeObj) {
    var nodeDiv = document.createElement("a"), txtEl = document.createElement('p');
    nodeObj.el = nodeDiv;

    //Set the node element's id based on its coordinates
    var id = "hacking-mission-node-" + nodeObj.pos[0] + "-" + nodeObj.pos[1];
    nodeDiv.setAttribute("id", id);
    txtEl.setAttribute("id", id + "-txt");

    //Set node classes for owner
    nodeDiv.classList.add("hack-mission-node");
    if (nodeObj.plyrCtrl) {
        nodeDiv.classList.add("hack-mission-player-node");
    } else if (nodeObj.enmyCtrl) {
        nodeDiv.classList.add("hack-mission-enemy-node");
    }

    //Set node classes based on type
    var txt;
    switch (nodeObj.type) {
        case NodeTypes.Core:
            txt = "CPU Core<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            nodeDiv.classList.add("hack-mission-cpu-node");
            break;
        case NodeTypes.Firewall:
            txt = "Firewall<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            nodeDiv.classList.add("hack-mission-firewall-node");
            break;
        case NodeTypes.Database:
            txt = "Database<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            nodeDiv.classList.add("hack-mission-database-node");
            break;
        case NodeTypes.Spam:
            txt = "Spam<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            nodeDiv.classList.add("hack-mission-spam-node");
            break;
        case NodeTypes.Transfer:
            txt = "Transfer<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            nodeDiv.classList.add("hack-mission-transfer-node");
            break;
        case NodeTypes.Shield:
        default:
            txt = "Shield<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            nodeDiv.classList.add("hack-mission-shield-node");
            break;
    }

    txt += "<br>Atk: " + formatNumber(nodeObj.atk, 1) +
           "<br>Def: " + formatNumber(nodeObj.def, 1);
    txtEl.innerHTML = txt;

    nodeDiv.appendChild(txtEl);
    document.getElementById("hacking-mission-map").appendChild(nodeDiv);
}

HackingMission.prototype.updateNodeDomElement = function(nodeObj) {
    if (nodeObj.el == null) {
        console.log("ERR: Calling updateNodeDomElement on a Node without an element");
        return;
    }

    var id = "hacking-mission-node-" + nodeObj.pos[0] + "-" + nodeObj.pos[1];
    var nodeDiv = document.getElementById(id), txtEl = document.getElementById(id + "-txt");

    //Set node classes based on type
    var txt;
    switch (nodeObj.type) {
        case NodeTypes.Core:
            txt = "CPU Core<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            break;
        case NodeTypes.Firewall:
            txt = "Firewall<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            break;
        case NodeTypes.Database:
            txt = "Database<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            break;
        case NodeTypes.Spam:
            txt = "Spam<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            break;
        case NodeTypes.Transfer:
            txt = "Transfer<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            break;
        case NodeTypes.Shield:
        default:
            txt = "Shield<br>" + "HP: " +
                  formatNumber(nodeObj.hp, 1);
            break;
    }

    txt += "<br>Atk: " + formatNumber(nodeObj.atk, 1) +
           "<br>Def: " + formatNumber(nodeObj.def, 1);
    if (nodeObj.action) {
        txt += "<br>" + nodeObj.action;
    }
    txtEl.innerHTML = txt;
}

//Gets a Node DOM element's corresponding Node object using its
//element id. Function accepts either the DOM element object or the ID as
//an argument
HackingMission.prototype.getNodeFromElement = function(el) {
    var id;
    if (isString(el)) {
        id = el;
    } else {
        id = el.id;
    }
    id = id.replace("hacking-mission-node-", "");
    var res = id.split('-');
    if (res.length != 2) {
        console.log("ERROR Parsing Hacking Mission Node Id. Could not find coordinates");
        return null;
    }
    var x = res[0], y = res[1];
    if (isNaN(x) || isNaN(y) || x >= 8 || y >= 8 || x < 0 || y < 0) {
        console.log("ERROR: Unexpected values for x and y: " + x + ", " + y);
        return null;
    }
    return this.map[x][y];
}

function selectNode(hackMissionInst, el) {
    var nodeObj = hackMissionInst.getNodeFromElement(el);
    if (nodeObj == null) {console.log("Error getting Node object");}
    if (!nodeObj.plyrCtrl) {return;}

    clearAllSelectedNodes(hackMissionInst);
    nodeObj.select(hackMissionInst.actionButtons);
    hackMissionInst.selectedNode.push(nodeObj);
}

function multiselectNode(hackMissionInst, el) {
    var nodeObj = hackMissionInst.getNodeFromElement(el);
    if (nodeObj == null) {console.log("ERROR: Getting Node Object in multiselectNode()");}
    if (!nodeObj.plyrCtrl) {return;}

    clearAllSelectedNodes(hackMissionInst);
    var type = nodeObj.type;
    if (type === NodeTypes.Core) {
        hackMissionInst.playerCores.forEach(function(node) {
            node.select(hackMissionInst.actionButtons);
            hackMissionInst.selectedNode.push(node);
        });
    } else {
        hackMissionInst.playerNodes.forEach(function(node) {
            if (node.type === type) {
                node.select(hackMissionInst.actionButtons);
                hackMissionInst.selectedNode.push(node);
            }
        });
    }
}

function clearAllSelectedNodes(hackMissionInst) {
    if (hackMissionInst.selectedNode.length > 0) {
        hackMissionInst.selectedNode.forEach(function(node){
            node.deselect(hackMissionInst.actionButtons);
        });
        hackMissionInst.selectedNode.length = 0;
    }
}

//Configures a DOM element representing a player-owned node to
//be selectable and actionable
//Note: Does NOT change its css class. This is handled by Node.setControlledBy...
HackingMission.prototype.configurePlayerNodeElement = function(el) {
    var nodeObj = this.getNodeFromElement(el);
    if (nodeObj == null) {console.log("Error getting Node object");}

    //Add event listener
    var self = this;
    function selectNodeWrapper() {
        selectNode(self, el);
    }
    el.addEventListener("click", selectNodeWrapper);

    function multiselectNodeWrapper() {
        multiselectNode(self, el);
    }
    el.addEventListener("dblclick", multiselectNodeWrapper);


    if (el.firstChild) {
        el.firstChild.addEventListener("click", selectNodeWrapper);
    }
}

//Configures a DOM element representing an enemy-node by removing
//any event listeners
HackingMission.prototype.configureEnemyNodeElement = function(el) {
    //Deselect node if it was the selected node
    var nodeObj = this.getNodeFromElement(el);
    for (var i = 0; i < this.selectedNode.length; ++i) {
        if (this.selectedNode[i] == nodeObj) {
            nodeObj.deselect(this.actionButtons);
            this.selectedNode.splice(i, 1);
            break;
        }
    }
}

//Returns bool indicating whether a node is reachable by player
//by checking if any of the adjacent nodes are owned by the player
HackingMission.prototype.nodeReachable = function(node) {
    var x = node.pos[0], y = node.pos[1];
    if (x > 0 && this.map[x-1][y].plyrCtrl) {return true;}
    if (x < 7 && this.map[x+1][y].plyrCtrl) {return true;}
    if (y > 0 && this.map[x][y-1].plyrCtrl) {return true;}
    if (y < 7 && this.map[x][y+1].plyrCtrl) {return true;}
    return false;
}

HackingMission.prototype.nodeReachableByEnemy = function(node) {
    if (node == null) {return false;}
    var x = node.pos[0], y = node.pos[1];
    if (x > 0 && this.map[x-1][y].enmyCtrl) {return true;}
    if (x < 7 && this.map[x+1][y].enmyCtrl) {return true;}
    if (y > 0 && this.map[x][y-1].enmyCtrl) {return true;}
    if (y < 7 && this.map[x][y+1].enmyCtrl) {return true;}
    return false;
}

HackingMission.prototype.start = function() {
    this.started = true;
    this.initJsPlumb();
    var startBtn = clearEventListeners("hack-mission-start-btn");
    startBtn.classList.remove("a-link-button");
    startBtn.classList.add("a-link-button-inactive");
}

HackingMission.prototype.initJsPlumb = function() {
    var instance = jsPlumb.getInstance({
        DragOptions:{cursor:"pointer", zIndex:2000},
        PaintStyle: {
            gradient: { stops: [
                [ 0, "#FFFFFF" ],
                [ 1, "#FFFFFF" ]
            ] },
            stroke: "#FFFFFF",
            strokeWidth: 8
        },
    });

    this.jsplumbinstance = instance;

    //All player cores are sources
    for (var i = 0; i < this.playerCores.length; ++i) {
        instance.makeSource(this.playerCores[i].el, {
            deleteEndpointsOnEmpty:true,
            maxConnections:1,
            anchor:"Continuous",
            connector:"Flowchart"
        });
    }

    //Everything else is a target
    for (var i = 0; i < this.enemyCores.length; ++i) {
        instance.makeTarget(this.enemyCores[i].el, {
            maxConnections:-1,
            anchor:"Continuous",
            connector:"Flowchart"
        });
    }
    for (var i = 0; i < this.enemyDatabases.length; ++i) {
        instance.makeTarget(this.enemyDatabases[i].el, {
            maxConnections:-1,
            anchor:"Continuous",
            connector:["Flowchart"]
        });
    }
    for (var i = 0; i < this.enemyNodes.length; ++i) {
        instance.makeTarget(this.enemyNodes[i].el, {
            maxConnections:-1,
            anchor:"Continuous",
            connector:"Flowchart"
        });
    }
    for (var i = 0; i < this.miscNodes.length; ++i) {
        instance.makeTarget(this.miscNodes[i].el, {
            maxConnections:-1,
            anchor:"Continuous",
            connector:"Flowchart"
        });
    }

    //Clicking a connection drops it
    instance.bind("click", function(conn, originalEvent) {
        var endpoints = conn.endpoints;
        endpoints[0].detachFrom(endpoints[1]);
    });

    //Connection events
    instance.bind("connection", (info)=>{
        var targetNode = this.getNodeFromElement(info.target);

        //Do not detach for enemy nodes
        var thisNode = this.getNodeFromElement(info.source);
        if (thisNode.enmyCtrl) {return;}

        //If the node is not reachable, drop the connection
        if (!this.nodeReachable(targetNode)) {
            info.sourceEndpoint.detachFrom(info.targetEndpoint);
            return;
        }

        var sourceNode = this.getNodeFromElement(info.source);
        sourceNode.conn = info.connection;
        var targetNode = this.getNodeFromElement(info.target);
        ++targetNode.targetedCount;
    });

    //Detach Connection events
    instance.bind("connectionDetached", (info, originalEvent)=>{
        var sourceNode = this.getNodeFromElement(info.source);
        sourceNode.conn = null;
        var targetNode = this.getNodeFromElement(info.target);
        targetNode.untarget();
    });

}

//Drops all connections where the specified node is the source
HackingMission.prototype.dropAllConnectionsFromNode = function(node) {
    var allConns = this.jsplumbinstance.getAllConnections();
    for (var i = allConns.length-1; i >= 0; --i) {
        if (allConns[i].source == node.el) {
            allConns[i].endpoints[0].detachFrom(allConns[i].endpoints[1]);
        }
    }
}

//Drops all connections where the specified node is the target
HackingMission.prototype.dropAllConnectionsToNode = function(node) {
    var allConns = this.jsplumbinstance.getAllConnections();
    for (var i = allConns.length-1; i >= 0; --i) {
        if (allConns[i].target == node.el) {
            allConns[i].endpoints[0].detachFrom(allConns[i].endpoints[1]);
        }
    }
    node.beingTargeted = false;
}

var storedCycles = 0;
HackingMission.prototype.process = function(numCycles=1) {
    if (!this.started) {return;}
    storedCycles += numCycles;
    if (storedCycles < 2) {return;} //Only process every 3 cycles minimum

    var res = false;
    //Process actions of all player nodes
    this.playerCores.forEach((node)=>{
        res |= this.processNode(node, storedCycles);
    });

    this.playerNodes.forEach((node)=>{
        if (node.type === NodeTypes.Transfer ||
            node.type === NodeTypes.Shield ||
            node.type === NodeTypes.Firewall) {
            res |= this.processNode(node, storedCycles);
        }
    });

    //Process actions of all enemy nodes
    this.enemyCores.forEach((node)=>{
        this.enemyAISelectAction(node);
        res |= this.processNode(node, storedCycles);
    });

    this.enemyNodes.forEach((node)=>{
        if (node.type === NodeTypes.Transfer ||
            node.type === NodeTypes.Shield ||
            node.type === NodeTypes.Firewall) {
            this.enemyAISelectAction(node);
            res |= this.processNode(node, storedCycles);
        }
    });

    //The hp of enemy databases increases slowly
    this.enemyDatabases.forEach((node)=>{
        node.maxhp += (0.1 * storedCycles);
        node.hp += (0.1 * storedCycles);
    });

    if (res) {
        this.calculateAttacks();
        this.calculateDefenses();
    }

    //Win if all enemy databases are conquered
    if (this.enemyDatabases.length === 0) {
        this.finishMission(true);
        return;
    }

    //Lose if all your cores are gone
    if (this.playerCores.length === 0) {
        this.finishMission(false);
        return;
    }

    //Defense/hp of misc nodes increases slowly over time
    this.miscNodes.forEach((node)=>{
        node.def += (0.1 * storedCycles);
        node.maxhp += (0.05 * storedCycles);
        node.hp += (0.1 * storedCycles);
        if (node.hp > node.maxhp) {node.hp = node.maxhp;}
        this.updateNodeDomElement(node);
    });

    //Update timer and check if player lost
    this.time -= (storedCycles * Engine._idleSpeed);
    if (this.time <= 0) {
        this.finishMission(false);
        return;
    }
    this.updateTimer();

    storedCycles = 0;
}

//Returns a bool representing whether defenses need to be re-calculated
HackingMission.prototype.processNode = function(nodeObj, numCycles=1) {
    if (nodeObj.action == null) {
        return;
    }

    var targetNode = null, def, atk;
    if (nodeObj.conn) {
        if (nodeObj.conn.target != null) {
            targetNode = this.getNodeFromElement(nodeObj.conn.target);
        } else {
            targetNode = this.getNodeFromElement(nodeObj.conn.targetId);
        }

        if (targetNode == null) {
            //Player is in the middle of  dragging the connection,
            //so the target node is null. Do nothing here
        } else if (targetNode.plyrCtrl) {
            def = this.playerDef;
            atk = this.enemyAtk;
        } else if (targetNode.enmyCtrl) {
            def = this.enemyDef;
            atk = this.playerAtk;
        } else { //Misc Node
            def = targetNode.def;
            nodeObj.plyrCtrl ? atk = this.playerAtk : atk = this.enemyAtk;
        }
    }

    //Calculations are per second, so divide everything by 5
    var calcStats = false, plyr = nodeObj.plyrCtrl;
    var enmyHacking = this.difficulty * CONSTANTS.HackingMissionDifficultyToHacking;
    switch(nodeObj.action) {
        case NodeActions.Attack:
            if (targetNode == null) {break;}
            if (nodeObj.conn == null) {break;}
            var dmg = this.calculateAttackDamage(atk, def, plyr ? Player.hacking_skill : enmyHacking);
            targetNode.hp -= (dmg/5 * numCycles);
            break;
        case NodeActions.Scan:
            if (targetNode == null) {break;}
            if (nodeObj.conn == null) {break;}
            var eff = this.calculateScanEffect(atk, def, plyr ? Player.hacking_skill : enmyHacking);
            targetNode.def -= (eff/5 * numCycles);
            calcStats = true;
            break;
        case NodeActions.Weaken:
            if (targetNode == null) {break;}
            if (nodeObj.conn == null) {break;}
            var eff = this.calculateWeakenEffect(atk, def, plyr ? Player.hacking_skill : enmyHacking);
            targetNode.atk -= (eff/5 * numCycles);
            calcStats = true;
            break;
        case NodeActions.Fortify:
            var eff = this.calculateFortifyEffect(Player.hacking_skill);
            nodeObj.def += (eff/5 * numCycles);
            calcStats = true;
            break;
        case NodeActions.Overflow:
            var eff = this.calculateOverflowEffect(Player.hacking_skill);
            if (nodeObj.def < eff) {break;}
            nodeObj.def -= (eff/5 * numCycles);
            nodeObj.atk += (eff/5 * numCycles);
            calcStats = true;
            break;
        default:
            console.log("ERR: Invalid Node Action: " + nodeObj.action);
            break;
    }

    //Stats can't go below 0
    if (nodeObj.atk < 0) {nodeObj.atk = 0;}
    if (nodeObj.def < 0) {nodeObj.def = 0;}
    if (targetNode && targetNode.atk < 0) {targetNode.atk = 0;}
    if (targetNode && targetNode.def < 0) {targetNode.def = 0;}

    //Conquering a node
    if (targetNode && targetNode.hp <= 0) {
        var conqueredByPlayer = nodeObj.plyrCtrl;
        targetNode.hp = targetNode.maxhp;
        targetNode.action = null;
        targetNode.conn = null;
        if (this.selectedNode == targetNode) {
            targetNode.deselect(this.actionButtons);
        }

        //The conquered node has its stats reduced
        targetNode.atk /= 2;
        targetNode.def /= 3.5;

        //Flag for whether the target node was a misc node
        var isMiscNode = !targetNode.plyrCtrl && !targetNode.enmyCtrl;

        //Remove all connections from Node
        this.dropAllConnectionsToNode(targetNode);
        this.dropAllConnectionsFromNode(targetNode);

        //Changes the css class and turn the node into a JsPlumb Source/Target
        if (conqueredByPlayer) {
            targetNode.setControlledByPlayer();
            this.jsplumbinstance.unmakeTarget(targetNode.el);
            this.jsplumbinstance.makeSource(targetNode.el, {
                deleteEndpointsOnEmpty:true,
                maxConnections:1,
                anchor:"Continuous",
                connector:"Flowchart"
            });
        } else {
            targetNode.setControlledByEnemy();
            nodeObj.conn = null; //Clear connection
            this.jsplumbinstance.unmakeSource(targetNode.el);
            this.jsplumbinstance.makeTarget(targetNode.el, {
                maxConnections:-1,
                anchor:"Continuous",
                connector:["Flowchart"]
            });
        }

        calcStats = true;

        //Helper function to swap nodes between the respective enemyNodes/playerNodes arrays
        function swapNodes(orig, dest, targetNode) {
            for (var i = 0; i < orig.length; ++i) {
                if (orig[i] == targetNode) {
                    var node = orig.splice(i, 1);
                    node = node[0];
                    dest.push(node);
                    break;
                }
            }
        }

        switch(targetNode.type) {
            case NodeTypes.Core:
                if (conqueredByPlayer) {
                    swapNodes(this.enemyCores, this.playerCores, targetNode);
                    this.configurePlayerNodeElement(targetNode.el);
                } else {
                    swapNodes(this.playerCores, this.enemyCores, targetNode);
                    this.configureEnemyNodeElement(targetNode.el);
                }
                break;
            case NodeTypes.Firewall:
                if (conqueredByPlayer) {
                    swapNodes(this.enemyNodes, this.playerNodes, targetNode);
                } else {
                    swapNodes(this.playerNodes, this.enemyNodes, targetNode);
                    this.configureEnemyNodeElement(targetNode.el);
                }
                break;
            case NodeTypes.Database:
                if (conqueredByPlayer) {
                    swapNodes(this.enemyDatabases, this.playerNodes, targetNode);
                } else {
                    swapNodes(this.playerNodes, this.enemyDatabases, targetNode);
                }
                break;
            case NodeTypes.Spam:
                if (conqueredByPlayer) {
                    swapNodes(isMiscNode ? this.miscNodes : this.enemyNodes, this.playerNodes, targetNode);
                    //Conquering spam node increases time limit
                    this.time += CONSTANTS.HackingMissionSpamTimeIncrease;
                } else {
                    swapNodes(isMiscNode ? this.miscNodes : this.playerNodes, this.enemyNodes, targetNode);
                }

                break;
            case NodeTypes.Transfer:
                //Conquering a Transfer node increases the attack of all cores by some percentages
                if (conqueredByPlayer) {
                    swapNodes(isMiscNode ? this.miscNodes : this.enemyNodes, this.playerNodes, targetNode);
                    this.playerCores.forEach(function(node) {
                        node.atk *= CONSTANTS.HackingMissionTransferAttackIncrease;
                    });
                    this.configurePlayerNodeElement(targetNode.el);
                } else {
                    swapNodes(isMiscNode ? this.miscNodes : this.playerNodes, this.enemyNodes, targetNode);
                    this.enemyCores.forEach(function(node) {
                        node.atk *= CONSTANTS.HackingMissionTransferAttackIncrease;
                    });
                    this.configureEnemyNodeElement(targetNode.el);
                }
                break;
            case NodeTypes.Shield:
                if (conqueredByPlayer) {
                    swapNodes(isMiscNode ? this.miscNodes : this.enemyNodes, this.playerNodes, targetNode);
                    this.configurePlayerNodeElement(targetNode.el);
                } else {
                    swapNodes(isMiscNode ? this.miscNodes : this.playerNodes, this.enemyNodes, targetNode);
                    this.configureEnemyNodeElement(targetNode.el);
                }
                break;
        }

        //If a misc node was conquered, the defense for all misc nodes increases by some fixed amount
        if (isMiscNode) { //&& conqueredByPlayer) {
            this.miscNodes.forEach((node)=>{
                if (node.targetedCount === 0) {
                    node.def *= CONSTANTS.HackingMissionMiscDefenseIncrease;
                }
            });
        }
    }

    //Update node DOMs
    this.updateNodeDomElement(nodeObj);
    if (targetNode) {this.updateNodeDomElement(targetNode);}
    return calcStats;
}

//Enemy "AI" for CPU Core and Transfer Nodes
HackingMission.prototype.enemyAISelectAction = function(nodeObj) {
    if (nodeObj == null) {return;}
    switch(nodeObj.type) {
        case NodeTypes.Core:
            //Select a single RANDOM target from miscNodes and player's Nodes
            //If it is reachable, it will target it. If not, no target will
            //be selected for now, and the next time process() gets called this will repeat
            if (nodeObj.conn == null) {
                if (this.miscNodes.length === 0) {
                    //Randomly pick a player node and attack it if its reachable
                    var rand = getRandomInt(0, this.playerNodes.length-1);
                    var node;
                    if (this.playerNodes.length === 0) {
                        node = null;
                    } else {
                        node = this.playerNodes[rand];
                    }
                    if (this.nodeReachableByEnemy(node)) {
                        //Create connection
                        nodeObj.conn = this.jsplumbinstance.connect({
                            source:nodeObj.el,
                            target:node.el
                        });
                        ++node.targetedCount;
                    } else {
                        //Randomly pick a player core and attack it if its reachable
                        rand = getRandomInt(0, this.playerCores.length-1);
                        if (this.playerCores.length === 0) {
                            return; //No Misc Nodes, no player Nodes, no Player cores. Player lost
                        } else {
                            node = this.playerCores[rand];
                        }

                        if (this.nodeReachableByEnemy(node)) {
                            //Create connection
                            nodeObj.conn = this.jsplumbinstance.connect({
                                source:nodeObj.el,
                                target:node.el
                            });
                            ++node.targetedCount;
                        }
                    }
                } else {
                    //Randomly pick a misc node and attack it if its reachable
                    var rand = getRandomInt(0, this.miscNodes.length-1);
                    var node = this.miscNodes[rand];
                    if (this.nodeReachableByEnemy(node)) {
                        nodeObj.conn = this.jsplumbinstance.connect({
                            source:nodeObj.el,
                            target:node.el,
                        });
                        ++node.targetedCount;
                    }
                }

                //If no connection was made, set the Core to Fortify
                nodeObj.action = NodeActions.Fortify;
            } else {
                //If this node has a selected target
                var targetNode;
                if (nodeObj.conn.target) {
                    targetNode = this.getNodeFromElement(nodeObj.conn.target);
                } else {
                    targetNode = this.getNodeFromElement(nodeObj.conn.targetId);
                }
                if (targetNode == null) {
                    console.log("Error getting Target node Object in enemyAISelectAction()");
                }

                if (targetNode.def > this.enemyAtk + 15) {
                    if (nodeObj.def < 50) {
                        nodeObj.action = NodeActions.Fortify;
                    } else {
                        nodeObj.action = NodeActions.Overflow;
                    }
                } else if (Math.abs(targetNode.def - this.enemyAtk) <= 15) {
                    nodeObj.action = NodeActions.Scan;
                } else {
                    nodeObj.action = NodeActions.Attack;
                }
            }
            break;
        case NodeTypes.Transfer:
            //Switch between fortifying and overflowing as necessary
            if (nodeObj.def < 125) {
                nodeObj.action = NodeActions.Fortify;
            } else {
                nodeObj.action = NodeActions.Overflow;
            }
            break;
        case NodeTypes.Firewall:
        case NodeTypes.Shield:
            nodeObj.action = NodeActions.Fortify;
            break;
        default:
            break;
    }
}

var hackEffWeightSelf = 130; //Weight for Node actions on self
var hackEffWeightTarget = 25; //Weight for Node Actions against Target
var hackEffWeightAttack = 80; //Weight for Attack action

//Returns damage per cycle based on stats
HackingMission.prototype.calculateAttackDamage = function(atk, def, hacking = 0) {
    return Math.max(0.55 * (atk + (hacking / hackEffWeightAttack) - def), 1);
}

HackingMission.prototype.calculateScanEffect = function(atk, def, hacking=0) {
    return Math.max(0.6 * ((atk) + hacking / hackEffWeightTarget - (def * 0.95)), 2);
}

HackingMission.prototype.calculateWeakenEffect = function(atk, def, hacking=0) {
    return Math.max((atk) + hacking / hackEffWeightTarget - (def * 0.95), 2);
}

HackingMission.prototype.calculateFortifyEffect = function(hacking=0) {
    return 0.9 * hacking / hackEffWeightSelf;
}

HackingMission.prototype.calculateOverflowEffect = function(hacking=0) {
    return 0.95 * hacking / hackEffWeightSelf;
}

//Updates timer display
HackingMission.prototype.updateTimer = function() {
    var timer = document.getElementById("hacking-mission-timer");

    //Convert time remaining to a string of the form mm:ss
    var seconds = Math.round(this.time / 1000);
    var minutes = Math.trunc(seconds / 60);
    seconds %= 60;
    var str = ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
    timer.innerText = "Time left: " + str;
}

//The 'win' argument is a bool for whether or not the player won
HackingMission.prototype.finishMission = function(win) {
    inMission = false;
    currMission = null;

    if (win) {
        var favorMult = 1 + (this.faction.favor / 100);
        console.log("Hacking mission base reward: " + this.reward);
        console.log("favorMult: " + favorMult);
        console.log("rep mult: " + Player.faction_rep_mult);
        var gain = this.reward  * Player.faction_rep_mult * favorMult;
        dialogBoxCreate("Mission won! You earned " +
                        formatNumber(gain, 3) + " reputation with " + this.faction.name);
        Player.gainIntelligenceExp(this.difficulty * CONSTANTS.IntelligenceHackingMissionBaseExpGain);
        this.faction.playerReputation += gain;
    } else {
        dialogBoxCreate("Mission lost/forfeited! You did not gain any faction reputation.");
    }

    //Clear mission container
    var container = document.getElementById("mission-container");
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    //Return to Faction page
    document.getElementById("mainmenu-container").style.visibility = "visible";
    document.getElementById("character-overview-wrapper").style.visibility = "visible";
    Engine.loadFactionContent();
    displayFactionContent(this.faction.name);
}

export {HackingMission, inMission, setInMission, currMission};
