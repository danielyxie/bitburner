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
