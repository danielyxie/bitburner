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
  const getCodingContract = function (func: any, hostname: any, filename: any): CodingContract {
    const server = helper.getServer(hostname, func);
    const contract = server.getContract(filename);
    if (contract == null) {
      throw helper.makeRuntimeErrorMsg(
        `codingcontract.${func}`,
        `Cannot find contract '${filename}' on server '${hostname}'`,
      );
    }

    return contract;
  };

  return {
    attempt: function (
      answer: any,
      filename: any,
      hostname: any = workerScript.hostname,
      { returnReward }: any = {},
    ): boolean | string {
      helper.updateDynamicRam("attempt", getRamCost("codingcontract", "attempt"));
      const contract = getCodingContract("attempt", hostname, filename);

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

      const serv = helper.getServer(hostname, "codingcontract.attempt");
      if (contract.isSolution(answer)) {
        const reward = player.gainCodingContractReward(creward, contract.getDifficulty());
        workerScript.log("attempt", `Successfully completed Coding Contract '${filename}'. Reward: ${reward}`);
        serv.removeContract(filename);
        return returnReward ? reward : true;
      } else {
        ++contract.tries;
        if (contract.tries >= contract.getMaxNumTries()) {
          workerScript.log("attempt", `Coding Contract attempt '${filename}' failed. Contract is now self-destructing`);
          serv.removeContract(filename);
        } else {
          workerScript.log(
            "attempt",
            `Coding Contract attempt '${filename}' failed. ${
              contract.getMaxNumTries() - contract.tries
            } attempts remaining.`,
          );
        }

        return returnReward ? "" : false;
      }
    },
    getContractType: function (filename: any, hostname: any = workerScript.hostname): string {
      helper.updateDynamicRam("getContractType", getRamCost("codingcontract", "getContractType"));
      const contract = getCodingContract("getContractType", hostname, filename);
      return contract.getType();
    },
    getData: function (filename: any, hostname: any = workerScript.hostname): any {
      helper.updateDynamicRam("getData", getRamCost("codingcontract", "getData"));
      const contract = getCodingContract("getData", hostname, filename);
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
    getDescription: function (filename: any, hostname: any = workerScript.hostname): string {
      helper.updateDynamicRam("getDescription", getRamCost("codingcontract", "getDescription"));
      const contract = getCodingContract("getDescription", hostname, filename);
      return contract.getDescription();
    },
    getNumTriesRemaining: function (filename: any, hostname: any = workerScript.hostname): number {
      helper.updateDynamicRam("getNumTriesRemaining", getRamCost("codingcontract", "getNumTriesRemaining"));
      const contract = getCodingContract("getNumTriesRemaining", hostname, filename);
      return contract.getMaxNumTries() - contract.tries;
    },
  };
}
