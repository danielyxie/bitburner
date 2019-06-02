import { DarkWebItems }                         from "./DarkWebItems";

import { Player }                               from "../Player";
import { SpecialServerIps }                     from "../Server/SpecialServerIps";
import { post }                                 from "../ui/postToTerminal";

import { isValidIPAddress }                     from "../../utils/helpers/isValidIPAddress";
import { formatNumber }                         from "../../utils/StringHelperFunctions";

//Posts a "help" message if connected to DarkWeb
export function checkIfConnectedToDarkweb() {
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
export function executeDarkwebTerminalCommand(commandArray) {
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
    post('You have purchased the ' + item.program + ' program. The new program can be found on your home computer.');
}
