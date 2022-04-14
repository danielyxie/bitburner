import type { CodingContract } from "../CodingContracts";
import { getRamCost } from "../Netscript/RamCostGenerator";
import type { WorkerScript } from "../Netscript/WorkerScript";
import type { IPlayer } from "../PersonObjects/IPlayer";
import type { CodingAttemptOptions, CodingContract as ICodingContract } from "../ScriptEditor/NetscriptDefinitions";
import { is2DArray } from "../utils/helpers/is2DArray";

import type { INetscriptHelper } from "./INetscriptHelper";

export function NetscriptCodingContract(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): ICodingContract {
  const getCodingContract = function (func: string, hostname: string, filename: string): CodingContract {
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

  const updateRam = (funcName: string): void =>
    helper.updateDynamicRam(funcName, getRamCost(player, "codingcontract", funcName));

  return {
    attempt: function (
      answer: any,
      _filename: unknown,
      _hostname: unknown = workerScript.hostname,
      { returnReward }: CodingAttemptOptions = { returnReward: false },
    ): boolean | string {
      updateRam("attempt");
      const filename = helper.string("attempt", "filename", _filename);
      const hostname = helper.string("attempt", "hostname", _hostname);
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
        workerScript.log(
          "codingcontract.attempt",
          () => `Successfully completed Coding Contract '${filename}'. Reward: ${reward}`,
        );
        serv.removeContract(filename);
        return returnReward ? reward : true;
      } else {
        ++contract.tries;
        if (contract.tries >= contract.getMaxNumTries()) {
          workerScript.log(
            "codingcontract.attempt",
            () => `Coding Contract attempt '${filename}' failed. Contract is now self-destructing`,
          );
          serv.removeContract(filename);
        } else {
          workerScript.log(
            "codingcontract.attempt",
            () =>
              `Coding Contract attempt '${filename}' failed. ${
                contract.getMaxNumTries() - contract.tries
              } attempts remaining.`,
          );
        }

        return returnReward ? "" : false;
      }
    },
    getContractType: function (_filename: unknown, _hostname: unknown = workerScript.hostname): string {
      updateRam("getContractType");
      const filename = helper.string("getContractType", "filename", _filename);
      const hostname = helper.string("getContractType", "hostname", _hostname);
      const contract = getCodingContract("getContractType", hostname, filename);
      return contract.getType();
    },
    getData: function (_filename: unknown, _hostname: unknown = workerScript.hostname): any {
      updateRam("getData");
      const filename = helper.string("getContractType", "filename", _filename);
      const hostname = helper.string("getContractType", "hostname", _hostname);
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
    getDescription: function (_filename: unknown, _hostname: unknown = workerScript.hostname): string {
      updateRam("getDescription");
      const filename = helper.string("getDescription", "filename", _filename);
      const hostname = helper.string("getDescription", "hostname", _hostname);
      const contract = getCodingContract("getDescription", hostname, filename);
      return contract.getDescription();
    },
    getNumTriesRemaining: function (_filename: unknown, _hostname: unknown = workerScript.hostname): number {
      updateRam("getNumTriesRemaining");
      const filename = helper.string("getNumTriesRemaining", "filename", _filename);
      const hostname = helper.string("getNumTriesRemaining", "hostname", _hostname);
      const contract = getCodingContract("getNumTriesRemaining", hostname, filename);
      return contract.getMaxNumTries() - contract.tries;
    },
  };
}
