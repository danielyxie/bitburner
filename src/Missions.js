import {Player}                                     from "./Player.js";
import {CONSTANTS}                                  from "./Constants.js";
import {dialogBoxCreate}                            from "../utils/DialogBox.js";
import {addOffset, getRandomInt,
        clearEventListenersEl}                      from "../utils/HelperFunctions.js";
import {formatNumber}                               from "../utils/StringHelperFunctions.js";
import jsplumb                                      from 'jsplumb'

let inMission = false; //Flag to denote whether a mission is running
function setInMission(bool) {
    inMission = bool;
}
/* Hacking Missions */

/*You start with N CPU nodes dependent on home computer cores

Three main stats:
    Attack - Specific to a node. Affected by hacking skill, RAM (for home comp)
    Defense - Universal defense - summed from all nodes
    HP - Specific to a node. Affected by hacking skill, RAM (for home comp)

Enemy has the following nodes:
    Firewall Nodes - Essentially shields. Weak attack but large def
    CPU Nodes - Defeating and capturing these will give you new nodes to use
    Database Node - Main Target

Misc Nodes (initially not owned by player or enemy):
    Spam nodes - Increases time limit
    Transfer Nodes - Slightly increases attack for all of your CPUs
    Shield Node - Increases your defense

Shapes for nodes:
    Firewall - Rectangle
    CPU - Circle
    Database - Parralelogram
    Spam - Diamond
    Transfer - Cone
    Shield - Shield shape

*/
let NodeTypes = {
    Core: "CPU Core Node",      //All actions available
    Firewall: "Firewall Node",  //No actions available
    Database: "Database Node",  //No actions available
    Spam: "Spam Node",          //No actions Available
    Transfer: "Transfer Node",  //Can Soften, Scan, and Overflow
    Shield: "Shield Node"       //Can Fortify
}

let NodeActions = {
    Attack: "Attack", //Damaged based on attack stat + hacking level + opp def
    Scan: "Scan", //-Def for target, affected by hacking level
    Soften: "Soften", //-Attack for target, affected by hacking level
    Fortify: "Fortify", //+Defense for Node, affected by hacking level
    Overflow: "Overflow", //+Attack but -Defense for Node, affected by hacking level
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
}

Node.prototype.setPosition = function(x, y) {
    this.pos = [x, y];
}

Node.prototype.setControlledByPlayer = function() {
    this.plyrCtrl = true;
    this.enmyCtrl = false;
    if (this.el) {
        this.classList.remove("hack-mission-enemy-node");
        this.classList.add("hack-mission-player-node");
    }
}

Node.prototype.setControlledByEnemy = function() {
    this.plyrCtrl = false;
    this.enmyCtrl = true;
    if (this.el) {
        this.classList.remove("hack-mission-player-node");
        this.classList.add("hack-mission-enemy-node");
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
            actionButtons[4].classList.remove("a-link-button-inactive");
            actionButtons[4].classList.add("a-link-button");
            break;
        default:
            break;
    }
}

Node.prototype.deselect = function(actionButtons) {
    this.el.classList.remove("active");
    for (var i = 0; i < actionButtons.length; ++i) {
        actionButtons[i].classList.remove("a-link-button");
        actionButtons[i].classList.add("a-link-button-inactive");
    }
}

//Hacking mission instance
//Takes in the reputation of the Faction for which the mission is
//being conducted
function HackingMission(rep, fac) {
    this.faction = fac;

    this.playerCores = [];
    this.playerNodes = []; //Non-core nodes
    this.playerDef = 0;

    this.enemyCores = [];
    this.enemyDatabases = [];
    this.enemyNodes = []; //Non-core nodes
    this.enemyDef = 0;

    this.miscNodes = [];

    this.selectedNode = null; //Which of the player's nodes is currently selected

    this.actionButtons = []; //DOM buttons for actions

    this.availablePositions = [];
    for (var r = 0; r < 8; ++r) {
        for (var c = 0; c < 8; ++c) {
            this.availablePositions.push([r, c]);
        }
    }

    //this.map = Array(8).fill(Array(8).fill(null)); //8x8 2d array of references to Nodes
    this.map = [];
    for (var i = 0; i < 8; ++i) {
        this.map.push([null, null, null, null, null, null, null, null]);
    }

    //difficulty capped at 16
    this.difficulty = Math.min(16, Math.round(rep / CONSTANTS.HackingMissionRepToDiffConversion) + 1);
    console.log("difficulty: " + this.difficulty);
    this.reward = 200 + (rep / CONSTANTS.HackingMissionRepToRewardConversion);
}

HackingMission.prototype.init = function() {
    //Create Header DOM
    this.createPageDom();

    //Create player starting nodes
    var home = Player.getHomeComputer()
    for (var i = 0; i < home.cpuCores; ++i) {
        var stats = {
            atk: (Player.hacking_skill / 10) * (home.maxRam / 8),
            def: (Player.hacking_skill / 20) * (home.maxRam / 2),
            hp: (Player.hacking_skill / 5) * (home.maxRam / 4),
        };
        this.playerCores.push(new Node(NodeTypes.Core, stats));
        this.playerCores[i].setControlledByPlayer();
        this.setNodePosition(this.playerCores[i], 0, i);
        this.removeAvailablePosition(0, i);
    }

    //Randomly generate enemy nodes (CPU and Firewall) based on difficulty
    var numNodes = getRandomInt(this.difficulty, this.difficulty + 2);
    var numFirewalls = getRandomInt(this.difficulty, this.difficulty + 5);
    var numDatabases = getRandomInt(this.difficulty, this.difficulty + 1);
    var totalNodes = numNodes + numFirewalls + numDatabases;
    var xlimit = 7 - Math.floor(totalNodes / 8);
    console.log("numNodes: " + numNodes);
    console.log("numFirewalls: " + numFirewalls);
    console.log("numDatabases: " + numDatabases);
    console.log("totalNodes: " + totalNodes);
    console.log("xlimit: " + xlimit);
    var randMult = addOffset(this.difficulty, 20);
    for (var i = 0; i < numNodes; ++i) {
        var stats = {
            atk: randMult * getRandomInt(400, 750),
            def: randMult * getRandomInt(400, 750),
            hp: randMult * getRandomInt(800, 1200)
        }
        this.enemyCores.push(new Node(NodeTypes.Core, stats));
        this.enemyCores[i].setControlledByEnemy();
        this.setNodeRandomPosition(this.enemyCores[i], xlimit);
    }
    for (var i = 0; i < numFirewalls; ++i) {
        var stats = {
            atk: randMult * getRandomInt(100, 400),
            def: randMult * getRandomInt(1000, 2500),
            hp: randMult * getRandomInt(500, 2000)
        }
        this.enemyNodes.push(new Node(NodeTypes.Firewall, stats));
        this.enemyNodes[i].setControlledByEnemy();
        this.setNodeRandomPosition(this.enemyNodes[i], xlimit);
    }
    for (var i = 0; i < numDatabases; ++i) {
        var stats = {
            atk: randMult * getRandomInt(100, 200),
            def: randMult * getRandomInt(1000, 1500),
            hp: randMult * getRandomInt(1000, 2000)
        }
        var node = new Node(NodeTypes.Database, stats);
        node.setControlledByEnemy();
        this.setNodeRandomPosition(node, xlimit);
        this.enemyDatabases.push(node);
    }
    this.calculateDefenses();
    this.createMap();
}

HackingMission.prototype.createPageDom = function() {
    var container = document.getElementById("mission-container");

    var headerText = document.createElement("p");
    headerText.innerHTML = "You are about to start a hacking mission! For more information " +
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
    startBtn.classList.add("hack-mission-header-element");
    startBtn.style.display = "block";

    //Create Action Buttons (Attack/Scan/Soften/ etc...)
    var actionsContainer = document.createElement("span");
    actionsContainer.classList.add("hack-mission-action-buttons-container");
    for (var i = 0; i < 5; ++i) {
        this.actionButtons.push(document.createElement("a"));
        this.actionButtons[i].style.display = "inline-block";
        this.actionButtons[i].classList.add("a-link-button-inactive"); //Disabled at start
        this.actionButtons[i].classList.add("tooltip"); //Disabled at start
        this.actionButtons[i].classList.add("hack-mission-header-element");
        actionsContainer.appendChild(this.actionButtons[i]);
    }
    this.actionButtons[0].innerText = "Attack(1)";
    var atkTooltip = document.createElement("span");
    atkTooltip.classList.add("tooltiptext");
    atkTooltip.innerText = "Lowers the targeted node's HP. The effectiveness of this depends on " +
                           "this node's Attack level, your hacking level, and the opponents defense level.";
    this.actionButtons[0].appendChild(atkTooltip);
    this.actionButtons[1].innerText = "Scan(2)";
    var scanTooltip = document.createElement("span");
    scanTooltip.classList.add("tooltiptext");
    scanTooltip.innerText = "Lowers the targeted node's defense. The effectiveness of this depends on " +
                            "this node's Attack level and your hacking level";
    this.actionButtons[1].appendChild(scanTooltip);
    this.actionButtons[2].innerText = "Soften(3)";
    var softenTooltip = document.createElement("span");
    softenTooltip.classList.add("tooltiptext");
    softenTooltip.innerText = "Lowers the targeted node's attack. The effectiveness of this depends on " +
                              "this node's Attack level and your hacking level";
    this.actionButtons[2].appendChild(softenTooltip);
    this.actionButtons[3].innerText = "Fortify(4)";
    var fortifyTooltip = document.createElement("span");
    fortifyTooltip.classList.add("tooltiptext");
    fortifyTooltip.innerText = "Raises this node's Defense level. The effectiveness of this depends on " +
                               "your hacking level";
    this.actionButtons[3].appendChild(fortifyTooltip);
    this.actionButtons[4].innerText = "Overflow(5)";
    var overflowTooltip = document.createElement("span");
    overflowTooltip.classList.add("tooltiptext");
    overflowTooltip.innerText = "Raises this node's Attack level but lowers its Defense level. The effectiveness " +
                                "of this depends on your hacking level.";
    this.actionButtons[4].appendChild(overflowTooltip);

    var timeDisplay = document.createElement("p");

    container.appendChild(headerText);
    container.appendChild(inGameGuideBtn);
    container.appendChild(wikiGuideBtn);
    container.appendChild(startBtn);
    container.appendChild(actionsContainer);
    container.appendChild(timeDisplay);
}

//Should only be used at the start
HackingMission.prototype.calculateDefenses = function() {
    var total = 0;
    for (var i = 0; i < this.playerCores.length; ++i) {
        total += this.playerCores[i].def;
    }
    for (var i = 0; i < this.playerNodes.length; ++i) {
        total += this.playerNodes[i].def;
    }
    console.log("player defenses calculated to be: " + total);
    this.playerDef = total;
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
    console.log("enemy defenses calculated to be: " + total);
    this.enemyDef = total;
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
    //hasn't been filled yet
    for (var x = 0; x < 8; ++x) {
        for (var y = 0; y < 8; ++y) {
            if (!(this.map[x][y] instanceof Node)) {
                var node, type = getRandomInt(0, 2);
                var randMult = addOffset(this.difficulty, 20);
                switch (type) {
                    case 0: //Spam
                        var stats = {
                            atk: 0,
                            def: randMult * getRandomInt(400, 800),
                            hp: randMult * getRandomInt(500, 1000)
                        }
                        node = new Node(NodeTypes.Spam, stats);
                        break;
                    case 1: //Transfer
                        var stats = {
                            atk: 0,
                            def: randMult * getRandomInt(500, 1000),
                            hp: randMult * getRandomInt(600, 1100)
                        }
                        node = new Node(NodeTypes.Transfer, stats);
                        break;
                    case 2: //Shield
                    default:
                        var stats = {
                            atk: 0,
                            def: randMult * getRandomInt(750, 1000),
                            hp: randMult * getRandomInt(700, 1000)
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

    console.log(this.map);
    this.initJsPlumb();
}

HackingMission.prototype.createNodeDomElement = function(nodeObj) {
    var nodeDiv = document.createElement("a");
    nodeObj.el = nodeDiv;
    document.getElementById("hacking-mission-map").appendChild(nodeDiv);

    //Set the node element's id based on its coordinates
    nodeDiv.setAttribute("id", "hacking-mission-node-" +
                                nodeObj.pos[0] + "-" +
                                nodeObj.pos[1]);

    //Set node classes for owner
    nodeDiv.classList.add("hack-mission-node");
    if (nodeObj.plyrCtrl) {
        nodeDiv.classList.add("hack-mission-player-node");
    } else if (nodeObj.enmyCtrl) {
        nodeDiv.classList.add("hack-mission-enemy-node");
    }

    //Set node classes based on type
    switch (nodeObj.type) {
        case NodeTypes.Core:
            nodeDiv.innerHTML = "<p>CPU Core<br>" + "HP: " +
                                formatNumber(nodeObj.hp, 1) + "</p>";
            nodeDiv.classList.add("hack-mission-cpu-node");
            break;
        case NodeTypes.Firewall:
            nodeDiv.innerHTML = "<p>Firewall<br>" + "HP: " +
                                formatNumber(nodeObj.hp, 1) + "</p>";
            nodeDiv.classList.add("hack-mission-firewall-node");
            break;
        case NodeTypes.Database:
            nodeDiv.innerHTML = "<p>Database<br>" + "HP: " +
                                formatNumber(nodeObj.hp, 1) + "</p>";
            nodeDiv.classList.add("hack-mission-database-node");
            break;
        case NodeTypes.Spam:
            nodeDiv.innerHTML = "<p>Spam<br>" + "HP: " +
                                formatNumber(nodeObj.hp, 1) + "</p>";
            nodeDiv.classList.add("hack-mission-spam-node");
            break;
        case NodeTypes.Transfer:
            nodeDiv.innerHTML = "<p>Transfer<br>" + "HP: " +
                                formatNumber(nodeObj.hp, 1) + "</p>";
            nodeDiv.classList.add("hack-mission-transfer-node");
            break;
        case NodeTypes.Shield:
        default:
            nodeDiv.innerHTML = "<p>Shield<br>" + "HP: " +
                                formatNumber(nodeObj.hp, 1) + "</p>";
            nodeDiv.classList.add("hack-mission-shield-node");
            break;
    }
}

//Gets a Node DOM element's corresponding Node object using its
//element id
HackingMission.prototype.getNodeFromElement = function(el) {
    var id = el.id;
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

//Configures a DOM element representing a player-owned node to
//be selectable and actionable
//Note: Does NOT change its css class. This is handled by Node.setControlledBy...
HackingMission.prototype.configurePlayerNodeElement = function(el) {
    var nodeObj = this.getNodeFromElement(el);
    if (nodeObj === null) {console.log("Error getting Node object");}

    //Add event listener
    el.addEventListener("click", ()=>{
        if (this.selectedNode instanceof Node) {
            this.selectedNode.deselect(this.actionButtons);
            this.selectedNode = null;
        }
        console.log("Selecting node :" + el.id);
        nodeObj.select(this.actionButtons);
        this.selectedNode = nodeObj;
    });
}

//Configures a DOM element representing an enemy-node by removing
//any event listeners
HackingMission.prototype.configureEnemyNodeElement = function(el) {
    //Deselect node if it was the selected node
    var nodeObj = this.getNodeFromElement(el);
    if (this.selectedNode == nodeObj) {
        nodeObj.deselect(this.actionButtons);
    }
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
            strokeWidth: 10
        },
    });

    //All player cores are sources
    for (var i = 0; i < this.playerCores.length; ++i) {
        instance.makeSource(this.playerCores[i].el, {
            deleteEndpointsOnEmpty:true,
            maxConnections:1,
            anchor:"Center",
            connector:"Straight"
        });
    }

    //Everything else is a target
    for (var i = 0; i < this.enemyCores.length; ++i) {
        instance.makeTarget(this.enemyCores[i].el, {
            maxConnections:-1,
            anchor:"Center",
            connector:"Straight"
        });
    }
    for (var i = 0; i < this.enemyDatabases.length; ++i) {
        instance.makeTarget(this.enemyDatabases[i].el, {
            maxConnections:-1,
            anchor:"Center",
            connector:["Straight"]
        });
    }
    for (var i = 0; i < this.enemyNodes.length; ++i) {
        instance.makeTarget(this.enemyNodes[i].el, {
            maxConnections:-1,
            anchor:"Center",
            connector:"Straight"
        });
    }
    for (var i = 0; i < this.miscNodes.length; ++i) {
        instance.makeTarget(this.miscNodes[i].el, {
            maxConnections:-1,
            anchor:"Center",
            connector:"Straight"
        });
    }

    //Clicking a connection drops it
    instance.bind("click", function(conn, originalEvent) {
        console.log("test");
        var endpoints = conn.endpoints;
        endpoints[0].detachFrom(endpoints[1]);
    });
}

export {HackingMission, inMission, setInMission};
