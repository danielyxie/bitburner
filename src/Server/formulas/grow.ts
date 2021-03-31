import { CONSTANTS } from "../../Constants";
import { Server } from "../Server";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { IPlayer } from "../../PersonObjects/IPlayer";

export function calculateServerGrowth(server: Server, threads: number, p: IPlayer) {
    const numServerGrowthCycles = Math.max(Math.floor(threads), 0);

    //Get adjusted growth rate, which accounts for server security
    const growthRate = CONSTANTS.ServerBaseGrowthRate;
    let adjGrowthRate = 1 + (growthRate - 1) / server.hackDifficulty;
    if (adjGrowthRate > CONSTANTS.ServerMaxGrowthRate) {adjGrowthRate = CONSTANTS.ServerMaxGrowthRate;}

    //Calculate adjusted server growth rate based on parameters
    const serverGrowthPercentage = server.serverGrowth / 100;
    const numServerGrowthCyclesAdjusted = numServerGrowthCycles * serverGrowthPercentage * BitNodeMultipliers.ServerGrowthRate;

    //Apply serverGrowth for the calculated number of growth cycles
    return Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted * p.hacking_grow_mult);
}