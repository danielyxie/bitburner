import {Programs}                               from "./CreateProgram";
import {Player}                                 from "./Player";
import {SpecialServerIps}                       from "./SpecialServerIps";
import {post}                                   from "./Terminal";

import {isValidIPAddress}                       from "../utils/IPAddress";
import {formatNumber}                           from "../utils/StringHelperFunctions";


/* DarkWeb.js */
//Posts a "help" message if connected to DarkWeb
function checkIfConnectedToDarkweb() {
    if (SpecialServerIps.hasOwnProperty("Darkweb Server")) {
        var darkwebIp =  SpecialServerIps["Darkweb Server"];
        if (!isValidIPAddress(darkwebIp)) {return;}
        if (darkwebIp == Player.getCurrentServer().ip) {
            post("You are now connected to the dark web. From the dark web you can purchase illegal items. " +
                 "Use the 'buy -l' command to display a list of all the items you can buy. Use 'buy [item-name] " +
                 "to purchase an item");
        }
    }
}

//Handler for dark web commands. The terminal's executeCommand() function will pass
//dark web-specific commands into this. It will pass in the raw split command array
//rather than the command string
function executeDarkwebTerminalCommand(commandArray) {
    if (commandArray.length == 0) {return;}
    switch (commandArray[0]) {
        case "buy":
            if (commandArray.length != 2) {
                post("Incorrect number of arguments. Usage: ");
                post("buy -l");
                post("buy [item name]");
                return;
            }
            var arg = commandArray[1];
            if (arg == "-l") {
                listAllDarkwebItems();
            } else {
                buyDarkwebItem(arg);
            }
            break;
        default:
            post("Command not found");
            break;
    }
}

function listAllDarkwebItems() {
    for(const key in DarkWebItems) {
        const item = DarkWebItems[key];
        post(item.toString());
    }
}

function buyDarkwebItem(itemName) {
    itemName = itemName.toLowerCase();

    // find the program that matches, if any
    let item = null;
    for(const key in DarkWebItems) {
        const i = DarkWebItems[key];
        if(i.program.toLowerCase() == itemName) {
            item = i;
        }
    }

    // return if invalid
    if(item === null) {
        post("Unrecognized item: "+itemName);
        return;
    }

    // return if the player already has it.
    if(Player.hasProgram(item.program)) {
        post('You already have the '+item.program+' program');
        return;
    }

    // return if the player doesn't have enough money
    if(Player.money.lt(item.price)) {
        post("Not enough money to purchase " + item.program);
        return;
    }

    // buy and push
    Player.loseMoney(item.price);
    Player.getHomeComputer().programs.push(item.program);
    post('You have purchased the '+item.program+' program. The new program can be found on your home computer.');
}

function DarkWebItem(program, price, description) {
    this.program = program;
    this.price = price;
    this.description = description;
}

// formats the item for the terminal (eg. "BruteSSH.exe - $500,000 - Opens up SSH Ports")
DarkWebItem.prototype.toString = function() {
    return [this.program, "$"+formatNumber(this.price), this.description].join(' - ');
}

const DarkWebItems = {
    BruteSSHProgram:  new DarkWebItem(Programs.BruteSSHProgram.name, 500000, "Opens up SSH Ports"),
    FTPCrackProgram:  new DarkWebItem(Programs.FTPCrackProgram.name, 1500000, "Opens up FTP Ports"),
    RelaySMTPProgram: new DarkWebItem(Programs.RelaySMTPProgram.name, 5000000, "Opens up SMTP Ports"),
    HTTPWormProgram:  new DarkWebItem(Programs.HTTPWormProgram.name, 30000000, "Opens up HTTP Ports"),
    SQLInjectProgram: new DarkWebItem(Programs.SQLInjectProgram.name, 250000000, "Opens up SQL Ports"),
    DeepscanV1:       new DarkWebItem(Programs.DeepscanV1.name, 500000, "Enables 'scan-analyze' with a depth up to 5"),
    DeepscanV2:       new DarkWebItem(Programs.DeepscanV2.name, 25000000, "Enables 'scan-analyze' with a depth up to 10"),
    AutolinkProgram:  new DarkWebItem(Programs.AutoLink.name, 1000000, "Enables direct connect via 'scan-analyze'"),
};


export {checkIfConnectedToDarkweb, executeDarkwebTerminalCommand, DarkWebItems};
