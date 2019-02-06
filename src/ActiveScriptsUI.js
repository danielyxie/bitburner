import {workerScripts,
        killWorkerScript}          from "./NetscriptWorker";
import {Player}                    from "./Player";
import {getServer}                 from "./Server";
import {numeralWrapper}            from "./ui/numeralFormat";
import {dialogBoxCreate}           from "../utils/DialogBox";
import {createAccordionElement}    from "../utils/uiHelpers/createAccordionElement";
import {arrayToString}             from "../utils/helpers/arrayToString";
import {createElement}             from "../utils/uiHelpers/createElement";
import {createProgressBarText}     from "../utils/helpers/createProgressBarText";
import {exceptionAlert}            from "../utils/helpers/exceptionAlert";
import {getElementById}            from "../utils/uiHelpers/getElementById";
import {logBoxCreate}              from "../utils/LogBox";
import {formatNumber}              from "../utils/StringHelperFunctions";
import {removeChildrenFromElement} from "../utils/uiHelpers/removeChildrenFromElement";
import {removeElement}             from "../utils/uiHelpers/removeElement";
import {roundToTwo}                from "../utils/helpers/roundToTwo";
import {Page, routing}             from "./ui/navigationTracking";

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
let ActiveScriptsTasks = []; //Sequentially schedule the creation/deletion of UI elements

const getHeaderHtml = (server) => {
    // TODO: calculate the longest hostname length rather than hard coding it
    const longestHostnameLength = 18;
    const paddedName = `${server.hostname}${" ".repeat(longestHostnameLength)}`.slice(0, Math.max(server.hostname.length, longestHostnameLength));
    const barOptions = {
        progress: server.ramUsed / server.maxRam,
        totalTicks: 30
    };
    return `${paddedName} ${createProgressBarText(barOptions)}`.replace(/\s/g, '&nbsp;');
};

const updateHeaderHtml = (server) => {
    const accordion = ActiveScriptsUI[server.hostname];
    if (accordion === null || accordion === undefined) {
        return;
    }

    // convert it to a string, as that's how it's stored it will come out of the data attributes
    const ramPercentage = '' + roundToTwo(server.ramUsed / server.maxRam);
    if (accordion.header.dataset.ramPercentage !== ramPercentage) {
        accordion.header.dataset.ramPercentage = ramPercentage;
        accordion.header.innerHTML = getHeaderHtml(server);
    }
}

function createActiveScriptsServerPanel(server) {
    let hostname = server.hostname;

    var activeScriptsList = document.getElementById("active-scripts-list");

    let res     = createAccordionElement({
        hdrText: getHeaderHtml(server)
    });
    let li      = res[0];
    var hdr     = res[1];
    let panel   = res[2];

    if (ActiveScriptsUI[hostname] != null) {
        console.log("WARNING: Tried to create already-existing Active Scripts Server panel. This is most likely fine. It probably means many scripts just got started up on a new server. Aborting");
        return;
    }

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
    var server = getServer(workerscript.serverIp);
    if (server == null) {
        console.log("ERROR: Invalid server IP for workerscript in addActiveScriptsItem()");
        return;
    }
    let hostname = server.hostname;

    ActiveScriptsTasks.push(function(workerscript, hostname) {
        if (ActiveScriptsUI[hostname] == null) {
            createActiveScriptsServerPanel(server);
        }

        //Create the unique identifier (key) for this script
        var itemNameArray = ["active", "scripts", hostname, workerscript.name];
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
                       "Args: " + arrayToString(workerscript.args)
        }));
        var panelText = createElement("p", {
            innerText: "Loading...",
            fontSize: "14px",
        });
        panel.appendChild(panelText);
        panel.appendChild(createElement("br"));
        panel.appendChild(createElement("span", {
            innerText: "Log",
            class: "accordion-button",
            margin: "4px",
            padding: "4px",
            clickListener: () => {
                logBoxCreate(workerscript.scriptRef);
                return false;
            }
        }));
        panel.appendChild(createElement("span", {
            innerText: "Kill Script",
            class: "accordion-button",
            margin: "4px",
            padding: "4px",
            clickListener: () => {
                killWorkerScript(workerscript.scriptRef, workerscript.scriptRef.server);
                dialogBoxCreate("Killing script, may take a few minutes to complete...");
                return false;
            }
        }));

        //Append element to list
        ActiveScriptsUI[hostname]["panelList"].appendChild(li);
        ActiveScriptsUI[hostname].scripts[itemName] = li;
        ActiveScriptsUI[hostname].scriptHdrs[itemName] = hdr;
        ActiveScriptsUI[hostname].scriptStats[itemName] = panelText;
    }.bind(null, workerscript, hostname));
}

function deleteActiveScriptsItem(workerscript) {
    ActiveScriptsTasks.push(function(workerscript) {
        var server = getServer(workerscript.serverIp);
        if (server == null) {
            throw new Error("ERROR: Invalid server IP for workerscript. This most likely occurred because " +
                            "you tried to delete a large number of scripts and also deleted servers at the " +
                            "same time. It's not a big deal, just save and refresh the game.");
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
    }.bind(null, workerscript));
}

//Update the ActiveScriptsItems array
function updateActiveScriptsItems(maxTasks=150) {
    //Run tasks that need to be done sequentially (adding items, creating/deleting server panels)
    //We'll limit this to 150 at a time in case someone decides to start a bunch of scripts all at once...
    let numTasks = Math.min(maxTasks, ActiveScriptsTasks.length);
    for (let i = 0; i < numTasks; ++i) {
        let task = ActiveScriptsTasks.shift();
        try {
            task();
        } catch(e) {
            exceptionAlert(e);
            console.log(task);
        }
    }

    if (!routing.isOn(Page.ActiveScripts)) {return;}
    var total = 0;
    for (var i = 0; i < workerScripts.length; ++i) {
        try {
            total += updateActiveScriptsItemContent(workerScripts[i]);
        } catch(e) {
            exceptionAlert(e);
        }
    }

    getElementById("active-scripts-total-production-active").innerText = numeralWrapper.format(total, '$0.000a');
    getElementById("active-scripts-total-prod-aug-total").innerText = numeralWrapper.format(Player.scriptProdSinceLastAug, '$0.000a');
    getElementById("active-scripts-total-prod-aug-avg").innerText = numeralWrapper.format(Player.scriptProdSinceLastAug / (Player.playtimeSinceLastAug/1000), '$0.000a');
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
        return; //Hasn't been created yet. We'll skip it
    }

    updateHeaderHtml(server);

    var itemNameArray = ["active", "scripts", server.hostname, workerscript.name];
    for (var i = 0; i < workerscript.args.length; ++i) {
        itemNameArray.push(String(workerscript.args[i]));
    }
    var itemName = itemNameArray.join("-");

    if (ActiveScriptsUI[hostname].scriptStats[itemName] == null) {
        return; //Hasn't been fully added yet. We'll skip it
    }
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
    if (ActiveScriptsUI[hostname] == null || ActiveScriptsUI[hostname].scriptHdrs[itemName] == null) {
        console.log("ERROR: Trying to update Active Script UI Element with a hostname that cant be found in ActiveScriptsUI: " + hostname);
        return;
    }

    updateHeaderHtml(server);
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
