import {workerScripts,
        addWorkerScript,
        killWorkerScript}           from "./NetscriptWorker.js";
import {Player}                     from "./Player.js";
import {getServer}                  from "./Server.js";
import {dialogBoxCreate}            from "../utils/DialogBox.js";
import {printArray}                 from "../utils/HelperFunctions.js";
import {logBoxCreate}               from "../utils/LogBox.js";
import numeral                      from "../utils/numeral.min.js";
import {formatNumber}               from "../utils/StringHelperFunctions.js";


/* Active Scripts UI*/
function setActiveScriptsClickHandlers() {
    //Server panel click handlers
    var serverPanels = document.getElementsByClassName("active-scripts-server-header");
    if (serverPanels == null) {
        console.log("ERROR: Could not find Active Scripts server panels");
        return;
    }
    for (i = 0; i < serverPanels.length; ++i) {
        serverPanels[i].onclick = function() {
            this.classList.toggle("active");

            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        }
    }

    //Script Panel click handlers
    var scriptPanels = document.getElementsByClassName("active-scripts-script-header");
    if (scriptPanels == null) {
        console.log("ERROR: Could not find Active Scripts panels for individual scripts");
        return;
    }
    for (var i = 0; i < scriptPanels.length; ++i) {
        scriptPanels[i].onclick = function() {
            this.classList.toggle("active");

            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        }
    }
}

//Returns the ul element containins all script items for a specific server
function getActiveScriptsServerList(server) {
    if (server == null) {return null;}
    var panelname = "active-scripts-server-panel-" + server.hostname;
    var item = document.getElementById(panelname + "-script-list");
    if (item == null) {
        console.log("ERROR: Cannot find list for: " + server.hostname);
    }
    return item;
}

function createActiveScriptsServerPanel(server) {
    var panelname = "active-scripts-server-panel-" + server.hostname;
    var activeScriptsList = document.getElementById("active-scripts-list");

    //Div of entire Panel
    var panelDiv = document.createElement("div");
    panelDiv.setAttribute("id", panelname);

    //Panel Header
    var panelHdr = document.createElement("button");
    panelHdr.setAttribute("class", "active-scripts-server-header")
    panelHdr.setAttribute("id", panelname + "-hdr");
    panelHdr.innerHTML = server.hostname;

    //Panel content
    var panelContentDiv = document.createElement("div");
    panelContentDiv.setAttribute("class", "active-scripts-server-panel");
    panelContentDiv.setAttribute("id", panelname + "-content");

    //List of scripts
    var panelScriptList = document.createElement("ul");
    panelScriptList.setAttribute("id", panelname + "-script-list");

    panelContentDiv.appendChild(panelScriptList);
    panelDiv.appendChild(panelHdr);
    panelDiv.appendChild(panelContentDiv);
    activeScriptsList.appendChild(panelDiv);

    setActiveScriptsClickHandlers() //Reset click handlers

    return panelDiv;
}

//Deletes the info for a particular server (Dropdown header + Panel with all info)
//in the Active Scripts page if it exists
function deleteActiveScriptsServerPanel(server) {
    var panelname = "active-scripts-server-panel-" + server.hostname;
    var panel = document.getElementById(panelname);
    if (panel == null) {
        console.log("No such panel exists: " + panelname);
        return;
    }

    //Remove the panel if it has no elements
    var scriptList = document.getElementById(panelname + "-script-list");
    if (scriptList.childNodes.length == 0) {
        panel.parentNode.removeChild(panel);
    }
}

function addActiveScriptsItem(workerscript) {
    //Get server panel
    var server = getServer(workerscript.serverIp);
    if (server == null) {
        console.log("ERROR: Invalid server IP for workerscript.");
        return;
    }
    var panelname = "active-scripts-server-panel-" + server.hostname;

    var panel = document.getElementById(panelname);
    if (panel == null) {
        panel = createActiveScriptsServerPanel(server);
    }

    //Create the element itself. Each element is an accordion collapsible
    var itemNameArray = ["active", "scripts", server.hostname, workerscript.name];
    for (var i = 0; i < workerscript.args.length; ++i) {
        itemNameArray.push(String(workerscript.args[i]));
    }
    var itemName = itemNameArray.join("-");
    var item = document.createElement("li");
    item.setAttribute("id", itemName);

    var btn = document.createElement("button");
    btn.setAttribute("class", "active-scripts-script-header");
    btn.innerHTML = workerscript.name;

    var itemContentDiv = document.createElement("div");
    itemContentDiv.setAttribute("class", "active-scripts-script-panel");
    itemContentDiv.setAttribute("id", itemName + "-content");

    item.appendChild(btn);
    item.appendChild(itemContentDiv);

    createActiveScriptsText(workerscript, itemContentDiv);

    //Append element to list
    var list = getActiveScriptsServerList(server);
    list.appendChild(item);

    setActiveScriptsClickHandlers() //Reset click handlers
}

function deleteActiveScriptsItem(workerscript) {
    var server = getServer(workerscript.serverIp);
    if (server == null) {
        console.log("ERROR: Invalid server IP for workerscript.");
        return;
    }
    var itemNameArray = ["active", "scripts", server.hostname, workerscript.name];
    for (var i = 0; i < workerscript.args.length; ++i) {
        itemNameArray.push(String(workerscript.args[i]));
    }
    var itemName = itemNameArray.join("-");
    var li = document.getElementById(itemName);
    if (li == null) {
        console.log("could not find Active scripts li element for: " + workerscript.name);
        return;
    }
    li.parentNode.removeChild(li);
    deleteActiveScriptsServerPanel(server);
}

//Update the ActiveScriptsItems array
function updateActiveScriptsItems() {
    var total = 0;
    for (var i = 0; i < workerScripts.length; ++i) {
        total += updateActiveScriptsItemContent(workerScripts[i]);
    }
    document.getElementById("active-scripts-total-prod").innerHTML =
        "Total online production of Active Scripts: " + numeral(total).format('$0.000a') + " / sec<br>" +
        "Total online production since last Aug installation: " +
        numeral(Player.scriptProdSinceLastAug).format('$0.000a') + " (" +
        numeral(Player.scriptProdSinceLastAug / (Player.playtimeSinceLastAug/1000)).format('$0.000a') + " / sec)";
    return total;
}

//Updates the content of the given item in the Active Scripts list
function updateActiveScriptsItemContent(workerscript) {
    var server = getServer(workerscript.serverIp);
    if (server == null) {
        console.log("ERROR: Invalid server IP for workerscript.");
        return;
    }
    var itemNameArray = ["active", "scripts", server.hostname, workerscript.name];
    for (var i = 0; i < workerscript.args.length; ++i) {
        itemNameArray.push(String(workerscript.args[i]));
    }
    var itemName = itemNameArray.join("-");
    var itemContent = document.getElementById(itemName + "-content")

    //Add the updated text back. Returns the total online production rate
    return updateActiveScriptsText(workerscript, itemContent);
}

function createActiveScriptsText(workerscript, item) {
    var itemTextHeader = document.createElement("p");
    var itemTextStats = document.createElement("p");
    var itemId = item.id;
    itemTextStats.setAttribute("id", itemId + "-stats");

    //Server ip/hostname
    var threads = "Threads: " + workerscript.scriptRef.threads;
    var args = "Args: " + printArray(workerscript.args);

    itemTextHeader.innerHTML = threads + "<br>" + args + "<br>";

    item.appendChild(itemTextHeader);
    item.appendChild(itemTextStats);

    var onlineMps = updateActiveScriptsText(workerscript, item, itemTextStats);

    var logButton = document.createElement("span");
    logButton.innerHTML = "Log";
    var killButton = document.createElement("span");
    killButton.innerHTML = "Kill script";
    logButton.setAttribute("class", "active-scripts-button");
    killButton.setAttribute("class", "active-scripts-button");
    logButton.addEventListener("click", function() {
        logBoxCreate(workerscript.scriptRef);
        return false;
    });
    killButton.addEventListener("click", function() {
        killWorkerScript(workerscript.scriptRef, workerscript.scriptRef.scriptRef.server);
        dialogBoxCreate("Killing script, may take a few minutes to complete...");
        return false;
    });
    item.appendChild(logButton);
    item.appendChild(killButton);

    //Return total online production rate
    return onlineMps;
}

function updateActiveScriptsText(workerscript, item, statsEl=null) {
    var itemId = item.id
    var itemTextStats = document.getElementById(itemId + "-stats");
    if (itemTextStats == null || itemTextStats === undefined) {
        itemTextStats = statsEl;
    }

    //Updates statistics only
    //Online
    var onlineTotalMoneyMade = "Total online production: $" + formatNumber(workerscript.scriptRef.onlineMoneyMade, 2);
    var onlineTotalExpEarned = (Array(26).join(" ") + formatNumber(workerscript.scriptRef.onlineExpGained, 2) + " hacking exp").replace( / /g, "&nbsp;");

    var onlineMps = workerscript.scriptRef.onlineMoneyMade / workerscript.scriptRef.onlineRunningTime;
    var onlineMpsText = "Online production rate: $" + formatNumber(onlineMps, 2) + "/second";
    var onlineEps = workerscript.scriptRef.onlineExpGained / workerscript.scriptRef.onlineRunningTime;
    var onlineEpsText = (Array(25).join(" ") + formatNumber(onlineEps, 4) + " hacking exp/second").replace( / /g, "&nbsp;");

    //Offline
    var offlineTotalMoneyMade = "Total offline production: $" + formatNumber(workerscript.scriptRef.offlineMoneyMade, 2);
    var offlineTotalExpEarned = (Array(27).join(" ") + formatNumber(workerscript.scriptRef.offlineExpGained, 2) + " hacking exp").replace( / /g, "&nbsp;");

    var offlineMps = workerscript.scriptRef.offlineMoneyMade / workerscript.scriptRef.offlineRunningTime;
    var offlineMpsText = "Offline production rate: $" + formatNumber(offlineMps, 2) + "/second";
    var offlineEps = workerscript.scriptRef.offlineExpGained / workerscript.scriptRef.offlineRunningTime;
    var offlineEpsText = (Array(26).join(" ") + formatNumber(offlineEps, 4) +  " hacking exp/second").replace( / /g, "&nbsp;");

    itemTextStats.innerHTML = onlineTotalMoneyMade + "<br>" + onlineTotalExpEarned + "<br>" +
                              onlineMpsText + "<br>" + onlineEpsText + "<br>" + offlineTotalMoneyMade + "<br>" + offlineTotalExpEarned + "<br>" +
                              offlineMpsText + "<br>" + offlineEpsText + "<br>";
    return onlineMps;
}

export {setActiveScriptsClickHandlers, addActiveScriptsItem, deleteActiveScriptsItem, updateActiveScriptsItems};
