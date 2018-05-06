import {workerScripts,
        addWorkerScript,
        killWorkerScript}                           from "./NetscriptWorker.js";
import {Player}                                     from "./Player.js";
import {getServer}                                  from "./Server.js";
import {dialogBoxCreate}                            from "../utils/DialogBox.js";
import {printArray, createElement,
        createAccordionElement, removeElement,
        removeChildrenFromElement}                  from "../utils/HelperFunctions.js";
import {logBoxCreate}                               from "../utils/LogBox.js";
import numeral                                      from "../utils/numeral.min.js";
import {formatNumber}                               from "../utils/StringHelperFunctions.js";

/* {
 *     serverName: {
 *         header: Server Header Element
 *         panel: Server Panel List (ul) element
 *         scripts: {
 *             script id: Ref to Script information
 *         }
 *     }
 *     ...
 */
let ActiveScriptsUI = {};

function createActiveScriptsServerPanel(server) {
    let hostname = server.hostname;
    if (ActiveScriptsUI[hostname] != null) {
        console.log("WARNING: Tried to create already-existing Active Scripts Server panel. Aborting");
        return;
    }
    var activeScriptsList = document.getElementById("active-scripts-list");

    let res     = createAccordionElement({hdrText:hostname});
    let li      = res[0];
    var hdr     = res[1];
    let panel   = res[2];

    var panelScriptList = createElement("ul");
    panel.appendChild(panelScriptList);
    activeScriptsList.appendChild(li);

    ActiveScriptsUI[hostname] = {
        header: hdr,
        panel: panel,
        panelList: panelScriptList,
        scripts: {},            //Holds references to li elements for each active script
        scriptHdrs: {},         //Holds references to header elements for each active script
        scriptStats: {}         //Holds references to the p elements containing text for each active script
    };

    return li;
}

//Deletes the info for a particular server (Dropdown header + Panel with all info)
//in the Active Scripts page if it exists
function deleteActiveScriptsServerPanel(server) {
    let hostname = server.hostname;
    if (ActiveScriptsUI[hostname] == null) {
        console.log("WARNING: Tried to delete non-existent Active Scripts Server panel. Aborting");
        return;
    }

    //Make sure it's empty
    if (Object.keys(ActiveScriptsUI[hostname].scripts).length > 0) {
        console.log("WARNING: Tried to delete Active Scripts Server panel  that still has scripts. Aborting");
        return;
    }

    removeElement(ActiveScriptsUI[hostname].panel);
    removeElement(ActiveScriptsUI[hostname].header);
    delete ActiveScriptsUI[hostname];
}

function addActiveScriptsItem(workerscript) {
    //Get server panel
    var server = getServer(workerscript.serverIp);
    if (server == null) {
        console.log("ERROR: Invalid server IP for workerscript in addActiveScriptsItem()");
        return;
    }
    let hostname = server.hostname;
    if (ActiveScriptsUI[hostname] == null) {
        createActiveScriptsServerPanel(server);
    }

    //Create the unique identifier (key) for this script
    var itemNameArray = ["active", "scripts", server.hostname, workerscript.name];
    for (var i = 0; i < workerscript.args.length; ++i) {
        itemNameArray.push(String(workerscript.args[i]));
    }
    var itemName = itemNameArray.join("-");

    let res     = createAccordionElement({hdrText:workerscript.name});
    let li      = res[0];
    let hdr     = res[1];
    let panel   = res[2];

    hdr.classList.remove("accordion-header");
    hdr.classList.add("active-scripts-script-header");
    panel.classList.remove("accordion-panel");
    panel.classList.add("active-scripts-script-panel");

    //Handle the constant elements on the panel that don't change after creation
    //Threads, args, kill/log button
    panel.appendChild(createElement("p", {
        innerHTML: "Threads: " + workerscript.scriptRef.threads + "<br>" +
                   "Args: " + printArray(workerscript.args)
    }));
    var panelText = createElement("p", {
        innerText:"Loading...", fontSize:"14px",
    });
    updateActiveScriptsText(workerscript, panelText, itemName);
    panel.appendChild(panelText);
    panel.appendChild(createElement("br"));
    panel.appendChild(createElement("span", {
        innerText:"Log", class:"active-scripts-button", margin:"4px", padding:"4px",
        clickListener:()=>{
            logBoxCreate(workerscript.scriptRef);
            return false;
        }
    }));
    panel.appendChild(createElement("span", {
        innerText:"Kill Script", class:"active-scripts-button", margin:"4px", padding:"4px",
        clickListener:()=>{
            killWorkerScript(workerscript.scriptRef, workerscript.scriptRef.scriptRef.server);
            dialogBoxCreate("Killing script, may take a few minutes to complete...");
            return false;
        }
    }));

    //Append element to list
    ActiveScriptsUI[hostname]["panelList"].appendChild(li);
    ActiveScriptsUI[hostname].scripts[itemName] = li;
    ActiveScriptsUI[hostname].scriptHdrs[itemName] = hdr;
    ActiveScriptsUI[hostname].scriptStats[itemName] = panelText;
}

function deleteActiveScriptsItem(workerscript) {
    var server = getServer(workerscript.serverIp);
    if (server == null) {
        console.log("ERROR: Invalid server IP for workerscript.");
        return;
    }
    let hostname = server.hostname;
    if (ActiveScriptsUI[hostname] == null) {
        console.log("ERROR: Trying to delete Active Script UI Element with a hostname that cant be found in ActiveScriptsUI: " + hostname);
        return;
    }

    var itemNameArray = ["active", "scripts", server.hostname, workerscript.name];
    for (var i = 0; i < workerscript.args.length; ++i) {
        itemNameArray.push(String(workerscript.args[i]));
    }
    var itemName = itemNameArray.join("-");

    let li = ActiveScriptsUI[hostname].scripts[itemName];
    if (li == null) {
        console.log("ERROR: Cannot find Active Script UI element for workerscript: ");
        console.log(workerscript);
        return;
    }
    removeElement(li);
    delete ActiveScriptsUI[hostname].scripts[itemName];
    delete ActiveScriptsUI[hostname].scriptHdrs[itemName];
    delete ActiveScriptsUI[hostname].scriptStats[itemName];
    if (Object.keys(ActiveScriptsUI[hostname].scripts).length === 0) {
        deleteActiveScriptsServerPanel(server);
    }
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
    let hostname = server.hostname;
    if (ActiveScriptsUI[hostname] == null) {
        console.log("ERROR: Trying to update Active Script UI Element with a hostname that cant be found in ActiveScriptsUI: " + hostname);
        return;
    }

    var itemNameArray = ["active", "scripts", server.hostname, workerscript.name];
    for (var i = 0; i < workerscript.args.length; ++i) {
        itemNameArray.push(String(workerscript.args[i]));
    }
    var itemName = itemNameArray.join("-");
    var item = ActiveScriptsUI[hostname].scriptStats[itemName];

    //Update the text if necessary. This fn returns the online $/s production
    return updateActiveScriptsText(workerscript, item, itemName);
}

function updateActiveScriptsText(workerscript, item, itemName) {
    var server = getServer(workerscript.serverIp);
    if (server == null) {
        console.log("ERROR: Invalid server IP for workerscript.");
        return;
    }
    let hostname = server.hostname;
    if (ActiveScriptsUI[hostname] == null) {
        console.log("ERROR: Trying to update Active Script UI Element with a hostname that cant be found in ActiveScriptsUI: " + hostname);
        return;
    }

    var onlineMps = workerscript.scriptRef.onlineMoneyMade / workerscript.scriptRef.onlineRunningTime;

    //Only update if the item is visible
    if (ActiveScriptsUI[hostname].header.classList.contains("active") === false) {return onlineMps;}
    if (ActiveScriptsUI[hostname].scriptHdrs[itemName].classList.contains("active") === false) {return onlineMps;}

    removeChildrenFromElement(item);

    //Online
    var onlineTotalMoneyMade = "Total online production: $" + formatNumber(workerscript.scriptRef.onlineMoneyMade, 2);
    var onlineTotalExpEarned = (Array(26).join(" ") + formatNumber(workerscript.scriptRef.onlineExpGained, 2) + " hacking exp").replace( / /g, "&nbsp;");

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

    item.innerHTML = onlineTotalMoneyMade + "<br>" + onlineTotalExpEarned + "<br>" +
                     onlineMpsText + "<br>" + onlineEpsText + "<br>" + offlineTotalMoneyMade + "<br>" + offlineTotalExpEarned + "<br>" +
                     offlineMpsText + "<br>" + offlineEpsText + "<br>";
    return onlineMps;
}

export {addActiveScriptsItem, deleteActiveScriptsItem, updateActiveScriptsItems};
