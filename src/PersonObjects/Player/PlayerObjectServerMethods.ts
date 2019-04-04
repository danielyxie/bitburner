import { IPlayer }                      from "../IPlayer";

import { CONSTANTS }                    from "../../Constants";
import { AllServers }                   from "../../Server/AllServers";
import { BitNodeMultipliers }           from "../../BitNode/BitNodeMultipliers";
import { SpecialServerIps }             from "../../Server/SpecialServerIps";

export function hasTorRouter(this: IPlayer) {
    return SpecialServerIps.hasOwnProperty("Darkweb Server");
}

export function getCurrentServer(this: IPlayer) {
    return AllServers[this.currentServer];
}

export function getHomeComputer(this: IPlayer) {
    return AllServers[this.homeComputer];
}

export function getUpgradeHomeRamCost(this: IPlayer) {
    //Calculate how many times ram has been upgraded (doubled)
    const currentRam = this.getHomeComputer().maxRam;
    const numUpgrades = Math.log2(currentRam);

    //Calculate cost
    //Have cost increase by some percentage each time RAM has been upgraded
    const mult = Math.pow(1.58, numUpgrades);
    var cost = currentRam * CONSTANTS.BaseCostFor1GBOfRamHome * mult * BitNodeMultipliers.HomeComputerRamCost;
    return cost;
}
