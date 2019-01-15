import { BitNodeMultipliers } from "./BitNode/BitNodeMultipliers";
import { Player } from "./Player";
import { Server } from "./Server";

/**
 * Returns the chance the player has to successfully hack a server
 */
export function calculateHackingChance(server) {
    const hackFactor = 1.75;
    const intFactor = 0.2;
    const difficultyMult = (100 - server.hackDifficulty) / 100;
    const skillMult = (hackFactor * Player.hacking_skill) + (intFactor * Player.intelligence);
    const skillChance = (skillMult - server.requiredHackingSkill) / skillMult;
    const chance = skillChance * difficultyMult * Player.hacking_chance_mult;
    if (chance > 1) { return 1; }
    if (chance < 0) { return 0; }

    return chance;
}

/**
 * Returns the amount of hacking experience the player will gain upon
 * successfully hacking a server
 */
export function calculateHackingExpGain(server) {
    const baseExpGain = 3;
    const diffFactor = 0.3;
    if (server.baseDifficulty == null) {
        server.baseDifficulty = server.hackDifficulty;
    }
    var expGain = baseExpGain;
    expGain += (server.baseDifficulty * Player.hacking_exp_mult * diffFactor);

    return expGain * BitNodeMultipliers.HackExpGain;
}

/**
 * Returns the percentage of money that will be stolen from a server if
 * it is successfully hacked (returns the decimal form, not the actual percent value)
 */
export function calculatePercentMoneyHacked(server) {
    // Adjust if needed for balancing. This is the divisor for the final calculation
    const balanceFactor = 240;

    const difficultyMult = (100 - server.hackDifficulty) / 100;
    const skillMult = (Player.hacking_skill - (server.requiredHackingSkill - 1)) / Player.hacking_skill;
    const percentMoneyHacked = difficultyMult * skillMult * Player.hacking_money_mult / balanceFactor;
    if (percentMoneyHacked < 0) { return 0; }
    if (percentMoneyHacked > 1) { return 1; }

    return percentMoneyHacked * BitNodeMultipliers.ScriptHackMoney;
}

/**
 * Returns time it takes to complete a hack on a server, in seconds
 */
export function calculateHackingTime(server, hack, int) {
    const difficultyMult = server.requiredHackingSkill * server.hackDifficulty;

    const baseDiff      = 500;
    const baseSkill     = 50;
    const diffFactor    = 2.5;
    const intFactor     = 0.1;
    if (hack == null) {hack = Player.hacking_skill;}
    if (int == null) {int = Player.intelligence;}
    var skillFactor = (diffFactor * difficultyMult + baseDiff);
    // tslint:disable-next-line
    skillFactor /= (hack + baseSkill + (intFactor * int));

    const hackTimeMultiplier = 5;
    const hackingTime = hackTimeMultiplier * skillFactor / Player.hacking_speed_mult;

    return hackingTime;
}

/**
 * Returns time it takes to complete a grow operation on a server, in seconds
 */
export function calculateGrowTime(server, hack, int) {
    const growTimeMultiplier = 3.2; // Relative to hacking time. 16/5 = 3.2

    return growTimeMultiplier * calculateHackingTime(server, hack, int);
}

/**
 * Returns time it takes to complete a weaken operation on a server, in seconds
 */
export function calculateWeakenTime(server, hack, int) {
    const weakenTimeMultiplier = 4; // Relative to hacking time

    return weakenTimeMultiplier * calculateHackingTime(server, hack, int);
}
