import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { is2DArray } from "../utils/helpers/is2DArray";
import { CodingContract } from "../CodingContracts";
import { CodingAttemptOptions, CodingContract as ICodingContract } from "../ScriptEditor/NetscriptDefinitions";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { helpers } from "../Netscript/NetscriptHelpers";

export function NetscriptCodingContract(player: IPlayer, workerScript: WorkerScript): InternalAPI<ICodingContract> {
  const getCodingContract = function (
    ctx: NetscriptContext,
    func: string,
    hostname: string,
    filename: string,
  ): CodingContract {
    const server = helpers.getServer(ctx, hostname);
    const contract = server.getContract(filename);
    if (contract == null) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Cannot find contract '${filename}' on server '${hostname}'`);
    }

    return contract;
  };

  return {
    attempt:
      (ctx: NetscriptContext) =>
      (
        answer: unknown,
        _filename: unknown,
        _hostname: unknown = workerScript.hostname,
        { returnReward }: CodingAttemptOptions = { returnReward: false },
      ): boolean | string => {
        const filename = helpers.string(ctx, "filename", _filename);
        const hostname = helpers.string(ctx, "hostname", _hostname);
        const contract = getCodingContract(ctx, "attempt", hostname, filename);

        // Convert answer to string. If the answer is a 2D array, then we have to
        // manually add brackets for the inner arrays
        let answerStr = "";
        if (is2DArray(answer)) {
          const answerComponents = [];
          for (let i = 0; i < answer.length; ++i) {
            answerComponents.push(["[", String(answer[i]), "]"].join(""));
          }

          answerStr = answerComponents.join(",");
        } else {
          answerStr = String(answer);
        }

        const creward = contract.reward;
        if (creward === null) throw new Error("Somehow solved a contract that didn't have a reward");

        const serv = helpers.getServer(ctx, hostname);
        if (contract.isSolution(answerStr)) {
          const reward = player.gainCodingContractReward(creward, contract.getDifficulty());
          helpers.log(ctx, () => `Successfully completed Coding Contract '${filename}'. Reward: ${reward}`);
          serv.removeContract(filename);
          return returnReward ? reward : true;
        } else {
          ++contract.tries;
          if (contract.tries >= contract.getMaxNumTries()) {
            helpers.log(ctx, () => `Coding Contract attempt '${filename}' failed. Contract is now self-destructing`);
            serv.removeContract(filename);
          } else {
            helpers.log(
              ctx,
              () =>
                `Coding Contract attempt '${filename}' failed. ${
                  contract.getMaxNumTries() - contract.tries
                } attempts remaining.`,
            );
          }

          return returnReward ? "" : false;
        }
      },
    getContractType:
      (ctx: NetscriptContext) =>
      (_filename: unknown, _hostname: unknown = workerScript.hostname): string => {
        const filename = helpers.string(ctx, "filename", _filename);
        const hostname = helpers.string(ctx, "hostname", _hostname);
        const contract = getCodingContract(ctx, "getContractType", hostname, filename);
        return contract.getType();
      },
    getData:
      (ctx: NetscriptContext) =>
      (_filename: unknown, _hostname: unknown = workerScript.hostname): unknown => {
        const filename = helpers.string(ctx, "filename", _filename);
        const hostname = helpers.string(ctx, "hostname", _hostname);
        const contract = getCodingContract(ctx, "getData", hostname, filename);
        const data = contract.getData();
        if (Array.isArray(data)) {
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
    getDescription:
      (ctx: NetscriptContext) =>
      (_filename: unknown, _hostname: unknown = workerScript.hostname): string => {
        const filename = helpers.string(ctx, "filename", _filename);
        const hostname = helpers.string(ctx, "hostname", _hostname);
        const contract = getCodingContract(ctx, "getDescription", hostname, filename);
        return contract.getDescription();
      },
    getNumTriesRemaining:
      (ctx: NetscriptContext) =>
      (_filename: unknown, _hostname: unknown = workerScript.hostname): number => {
        const filename = helpers.string(ctx, "filename", _filename);
        const hostname = helpers.string(ctx, "hostname", _hostname);
        const contract = getCodingContract(ctx, "getNumTriesRemaining", hostname, filename);
        return contract.getMaxNumTries() - contract.tries;
      },
  };
}
