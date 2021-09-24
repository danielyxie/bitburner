import { CONSTANTS } from "../Constants";
import { Player } from "../Player";
import { AllServers } from "../Server/AllServers";
import { BaseServer } from "../Server/BaseServer";
import { Server } from "../Server/Server";
import { RunningScript } from "../Script/RunningScript";
import { processSingleServerGrowth } from "../Server/ServerHelpers";

import { numeralWrapper } from "../ui/numeralFormat";

import { compareArrays } from "../../utils/helpers/compareArrays";

export function scriptCalculateOfflineProduction(runningScript: RunningScript) {
  //The Player object stores the last update time from when we were online
  const thisUpdate = new Date().getTime();
  const lastUpdate = Player.lastUpdate;
  const timePassed = (thisUpdate - lastUpdate) / 1000; //Seconds

  //Calculate the "confidence" rating of the script's true production. This is based
  //entirely off of time. We will arbitrarily say that if a script has been running for
  //4 hours (14400 sec) then we are completely confident in its ability
  let confidence = runningScript.onlineRunningTime / 14400;
  if (confidence >= 1) {
    confidence = 1;
  }

  //Data map: [MoneyStolen, NumTimesHacked, NumTimesGrown, NumTimesWeaken]

  // Grow
  for (const ip in runningScript.dataMap) {
    if (runningScript.dataMap.hasOwnProperty(ip)) {
      if (runningScript.dataMap[ip][2] == 0 || runningScript.dataMap[ip][2] == null) {
        continue;
      }
      const serv = AllServers[ip];
      if (serv == null) {
        continue;
      }
      const timesGrown = Math.round(
        ((0.5 * runningScript.dataMap[ip][2]) / runningScript.onlineRunningTime) * timePassed,
      );
      runningScript.log(`Called on ${serv.hostname} ${timesGrown} times while offline`);
      const host = AllServers[runningScript.server];
      if (!(serv instanceof Server)) throw new Error("trying to grow a non-normal server");
      const growth = processSingleServerGrowth(serv, timesGrown, Player, host.cpuCores);
      runningScript.log(
        `'${serv.hostname}' grown by ${numeralWrapper.format(growth * 100 - 100, "0.000000%")} while offline`,
      );
    }
  }

  // Offline EXP gain
  // A script's offline production will always be at most half of its online production.
  const expGain = confidence * (runningScript.onlineExpGained / runningScript.onlineRunningTime) * timePassed;
  Player.gainHackingExp(expGain);

  // Update script stats
  runningScript.offlineRunningTime += timePassed;
  runningScript.offlineExpGained += expGain;

  // Weaken
  for (const ip in runningScript.dataMap) {
    if (runningScript.dataMap.hasOwnProperty(ip)) {
      if (runningScript.dataMap[ip][3] == 0 || runningScript.dataMap[ip][3] == null) {
        continue;
      }
      const serv = AllServers[ip];
      if (serv == null) {
        continue;
      }

      if (!(serv instanceof Server)) throw new Error("trying to weaken a non-normal server");
      const host = AllServers[runningScript.server];
      const timesWeakened = Math.round(
        ((0.5 * runningScript.dataMap[ip][3]) / runningScript.onlineRunningTime) * timePassed,
      );
      runningScript.log(`Called weaken() on ${serv.hostname} ${timesWeakened} times while offline`);
      const coreBonus = 1 + (host.cpuCores - 1) / 16;
      serv.weaken(CONSTANTS.ServerWeakenAmount * timesWeakened * coreBonus);
    }
  }
}

//Returns a RunningScript object matching the filename and arguments on the
//designated server, and false otherwise
export function findRunningScript(filename: string, args: (string | number)[], server: BaseServer) {
  for (var i = 0; i < server.runningScripts.length; ++i) {
    if (server.runningScripts[i].filename === filename && compareArrays(server.runningScripts[i].args, args)) {
      return server.runningScripts[i];
    }
  }
  return null;
}

//Returns a RunningScript object matching the pid on the
//designated server, and false otherwise
export function findRunningScriptByPid(pid: number, server: BaseServer) {
  for (var i = 0; i < server.runningScripts.length; ++i) {
    if (server.runningScripts[i].pid === pid) {
      return server.runningScripts[i];
    }
  }
  return null;
}
