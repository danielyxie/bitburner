import { Script } from "./Script";

import { RamCalculationErrorCode } from "./RamCalculationErrorCodes";
import { calculateRamUsage } from "./RamCalculations";
import { isScriptFilename } from "./ScriptHelpersTS";

import {CONSTANTS} from "../Constants";
import {Engine} from "../engine";
import { parseFconfSettings } from "../Fconf/Fconf";
import {
    iTutorialSteps,
    iTutorialNextStep,
    ITutorial,
} from "../InteractiveTutorial";
import { Player } from "../Player";
import { CursorPositions } from "../ScriptEditor/CursorPositions";
import { AllServers } from "../Server/AllServers";
import { processSingleServerGrowth } from "../Server/ServerHelpers";
import { Settings } from "../Settings/Settings";
import { EditorSetting } from "../Settings/SettingEnums";
import { isValidFilePath } from "../Terminal/DirectoryHelpers";
import { TextFile } from "../TextFile";

import { Page, routing } from "../ui/navigationTracking";
import { numeralWrapper } from "../ui/numeralFormat";

import { dialogBoxCreate } from "../../utils/DialogBox";
import { compareArrays } from "../../utils/helpers/compareArrays";
import { createElement } from "../../utils/uiHelpers/createElement";

export function scriptCalculateOfflineProduction(runningScriptObj) {
	//The Player object stores the last update time from when we were online
	const thisUpdate = new Date().getTime();
	const lastUpdate = Player.lastUpdate;
	const timePassed = (thisUpdate - lastUpdate) / 1000;	//Seconds

	//Calculate the "confidence" rating of the script's true production. This is based
	//entirely off of time. We will arbitrarily say that if a script has been running for
	//4 hours (14400 sec) then we are completely confident in its ability
	let confidence = (runningScriptObj.onlineRunningTime) / 14400;
	if (confidence >= 1) {confidence = 1;}

    //Data map: [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]

    // Grow
    for (const ip in runningScriptObj.dataMap) {
        if (runningScriptObj.dataMap.hasOwnProperty(ip)) {
            if (runningScriptObj.dataMap[ip][2] == 0 || runningScriptObj.dataMap[ip][2] == null) {continue;}
            const serv = AllServers[ip];
            if (serv == null) {continue;}
            const timesGrown = Math.round(0.5 * runningScriptObj.dataMap[ip][2] / runningScriptObj.onlineRunningTime * timePassed);
            runningScriptObj.log(`Called on ${serv.hostname} ${timesGrown} times while offline`);
            const host = AllServers[runningScriptObj.server];
            const growth = processSingleServerGrowth(serv, timesGrown, Player, host.cpuCores);
            runningScriptObj.log(`'${serv.hostname}' grown by ${numeralWrapper.format(growth * 100 - 100, '0.000000%')} while offline`);
        }
    }

    // Offline EXP gain
	// A script's offline production will always be at most half of its online production.
	const expGain = confidence * (runningScriptObj.onlineExpGained / runningScriptObj.onlineRunningTime) * timePassed;
	Player.gainHackingExp(expGain);

	// Update script stats
	runningScriptObj.offlineRunningTime += timePassed;
	runningScriptObj.offlineExpGained += expGain;

    // Weaken
    for (const ip in runningScriptObj.dataMap) {
        if (runningScriptObj.dataMap.hasOwnProperty(ip)) {
            if (runningScriptObj.dataMap[ip][3] == 0 || runningScriptObj.dataMap[ip][3] == null) {continue;}
            const serv = AllServers[ip];
            if (serv == null) {continue;}
            const host = AllServers[runningScriptObj.server];
            const timesWeakened = Math.round(0.5 * runningScriptObj.dataMap[ip][3] / runningScriptObj.onlineRunningTime * timePassed);
            runningScriptObj.log(`Called weaken() on ${serv.hostname} ${timesWeakened} times while offline`);
            const coreBonus = 1+(host.cpuCores-1)/16;
            serv.weaken(CONSTANTS.ServerWeakenAmount * timesWeakened * coreBonus);
        }
    }
}

//Returns a RunningScript object matching the filename and arguments on the
//designated server, and false otherwise
export function findRunningScript(filename, args, server) {
    for (var i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].filename === filename &&
            compareArrays(server.runningScripts[i].args, args)) {
            return server.runningScripts[i];
        }
    }
    return null;
}

//Returns a RunningScript object matching the pid on the
//designated server, and false otherwise
export function findRunningScriptByPid(pid, server) {
    for (var i = 0; i < server.runningScripts.length; ++i) {
        if (server.runningScripts[i].pid === pid) {
            return server.runningScripts[i];
        }
    }
    return null;
}
