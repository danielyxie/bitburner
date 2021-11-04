import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { is2DArray } from "../utils/helpers/is2DArray";
import { CodingContract } from "../CodingContracts";
import { CodingContract as ICodingContract } from "../ScriptEditor/NetscriptDefinitions";

export function NetscriptCodingContract(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): ICodingContract {
  const getCodingContract = function (func: any, ip: any, fn: any): CodingContract {
    const server = helper.getServer(ip, func);
    const contract = server.getContract(fn);
    if (contract == null) {
      throw helper.makeRuntimeErrorMsg(`codingcontract.${func}`, `Cannot find contract '${fn}' on server '${ip}'`);
    }

    return contract;
  };

  return {
    attempt: function (
      answer: any,
      fn: any,
      ip: any = workerScript.hostname,
      { returnReward }: any = {},
    ): boolean | string {
      helper.updateDynamicRam("attempt", getRamCost("codingcontract", "attempt"));
      const contract = getCodingContract("attempt", ip, fn);

      // Convert answer to string. If the answer is a 2D array, then we have to
      // manually add brackets for the inner arrays
      if (is2DArray(answer)) {
        const answerComponents = [];
        for (let i = 0; i < answer.length; ++i) {
          answerComponents.push(["[", answer[i].toString(), "]"].join(""));
        }

        answer = answerComponents.join(",");
      } else {
        answer = String(answer);
      }

      const creward = contract.reward;
      if (creward === null) throw new Error("Somehow solved a contract that didn't have a reward");

      const serv = helper.getServer(ip, "codingcontract.attempt");
      if (contract.isSolution(answer)) {
        const reward = player.gainCodingContractReward(creward, contract.getDifficulty());
        workerScript.log("attempt", `Successfully completed Coding Contract '${fn}'. Reward: ${reward}`);
        serv.removeContract(fn);
        return returnReward ? reward : true;
      } else {
        ++contract.tries;
        if (contract.tries >= contract.getMaxNumTries()) {
          workerScript.log("attempt", `Coding Contract attempt '${fn}' failed. Contract is now self-destructing`);
          serv.removeContract(fn);
        } else {
          workerScript.log(
            "attempt",
            `Coding Contract attempt '${fn}' failed. ${contract.getMaxNumTries() - contract.tries} attempts remaining.`,
          );
        }

        return returnReward ? "" : false;
      }
    },
    getContractType: function (fn: any, ip: any = workerScript.hostname): string {
      helper.updateDynamicRam("getContractType", getRamCost("codingcontract", "getContractType"));
      const contract = getCodingContract("getContractType", ip, fn);
      return contract.getType();
    },
    getData: function (fn: any, ip: any = workerScript.hostname): any {
      helper.updateDynamicRam("getData", getRamCost("codingcontract", "getData"));
      const contract = getCodingContract("getData", ip, fn);
      const data = contract.getData();
      if (data.constructor === Array) {
        // For two dimensional arrays, we have to copy the internal arrays using
        // slice() as well. As of right now, no contract has arrays that have
        // more than two dimensions
        const copy = data.slice();
        for (let i = 0; i < copy.length; ++i) {
          if (data[i].constructor === Array) {
            copy[i] = data[i].slice();
          }
        }

        return copy;
      } else {
        return data;
      }
    },
    getDescription: function (fn: any, ip: any = workerScript.hostname): string {
      helper.updateDynamicRam("getDescription", getRamCost("codingcontract", "getDescription"));
      const contract = getCodingContract("getDescription", ip, fn);
      return contract.getDescription();
    },
    getNumTriesRemaining: function (fn: any, ip: any = workerScript.hostname): number {
      helper.updateDynamicRam("getNumTriesRemaining", getRamCost("codingcontract", "getNumTriesRemaining"));
      const contract = getCodingContract("getNumTriesRemaining", ip, fn);
      return contract.getMaxNumTries() - contract.tries;
    },
  };
}
