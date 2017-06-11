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
    //TODO Alphabetize Active Scripts list?
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
    var itemName = "active-scripts-" + server.hostname + "-" + workerscript.name;
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
    var itemName = "active-scripts-" + server.hostname + "-" + workerscript.name;
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
        "Total online production rate: $" + formatNumber(total, 2) + " / second";
}

//Updates the content of the given item in the Active Scripts list
function updateActiveScriptsItemContent(workerscript) {
    var server = getServer(workerscript.serverIp);
    if (server == null) {
        console.log("ERROR: Invalid server IP for workerscript.");
        return;
    }
    var itemName = "active-scripts-" + server.hostname + "-" + workerscript.name;
    var itemContent = document.getElementById(itemName + "-content")
    
    //Clear the item
    while (itemContent.firstChild) {
        itemContent.removeChild(itemContent.firstChild);
    }
    
    //Add the updated text back. Returns the total online production rate
    return createActiveScriptsText(workerscript, itemContent);
}

function createActiveScriptsText(workerscript, item) {
    var itemText = document.createElement("p");
    
    //Server ip/hostname
    var serverIpHostname = "Threads: " + workerscript.scriptRef.threads;
    
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
    
    itemText.innerHTML = serverIpHostname + "<br>" + onlineTotalMoneyMade + "<br>" + onlineTotalExpEarned + "<br>" +
                         onlineMpsText + "<br>" + onlineEpsText + "<br>" + offlineTotalMoneyMade + "<br>" + offlineTotalExpEarned + "<br>" +
                         offlineMpsText + "<br>" + offlineEpsText + "<br>";
    
    item.appendChild(itemText);
    
    //Return total online production rate
    return onlineMps;
}