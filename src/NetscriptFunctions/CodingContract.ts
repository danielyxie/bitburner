import { Player as player } from "../Player";
import { CodingContract } from "../CodingContracts";
import { CodingAttemptOptions, CodingContract as ICodingContract } from "../ScriptEditor/NetscriptDefinitions";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { helpers, assertObjectType } from "../Netscript/NetscriptHelpers";
import { codingContractTypesMetadata } from "../data/codingcontracttypes";
import { generateDummyContract } from "../CodingContractGenerator";

export function NetscriptCodingContract(): InternalAPI<ICodingContract> {
  const getCodingContract = function (ctx: NetscriptContext, hostname: string, filename: string): CodingContract {
    const server = helpers.getServer(ctx, hostname);
    const contract = server.getContract(filename);
    if (contract == null) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Cannot find contract '${filename}' on server '${hostname}'`);
    }

    return contract;
  };

  return {
    attempt: (ctx) => (answer, _filename, _hostname?, opts?) => {
      const filename = helpers.string(ctx, "filename", _filename);
      const hostname = _hostname ? helpers.string(ctx, "hostname", _hostname) : ctx.workerScript.hostname;
      const contract = getCodingContract(ctx, hostname, filename);

      const optsValidator: CodingAttemptOptions = { returnReward: true };
      opts ??= optsValidator;
      assertObjectType(ctx, "opts", opts, optsValidator);
      if (typeof answer !== "number" && typeof answer !== "string" && !Array.isArray(answer))
        throw new Error("The answer provided was not a number, string, or array");

      // Convert answer to string.
      const answerStr = typeof answer === "string" ? answer : JSON.stringify(answer);
      const creward = contract.reward;

      const serv = helpers.getServer(ctx, hostname);
      if (contract.isSolution(answerStr)) {
        const reward = player.gainCodingContractReward(creward, contract.getDifficulty());
        helpers.log(ctx, () => `Successfully completed Coding Contract '${filename}'. Reward: ${reward}`);
        serv.removeContract(filename);
        return opts.returnReward ? reward : true;
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

        return opts.returnReward ? "" : false;
      }
    },
    getContractType: (ctx) => (_filename, _hostname?) => {
      const filename = helpers.string(ctx, "filename", _filename);
      const hostname = _hostname ? helpers.string(ctx, "hostname", _hostname) : ctx.workerScript.hostname;
      const contract = getCodingContract(ctx, hostname, filename);
      return contract.getType();
    },
    getData: (ctx) => (_filename, _hostname?) => {
      const filename = helpers.string(ctx, "filename", _filename);
      const hostname = _hostname ? helpers.string(ctx, "hostname", _hostname) : ctx.workerScript.hostname;
      const contract = getCodingContract(ctx, hostname, filename);
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
      } else return data;
    },
    getDescription: (ctx) => (_filename, _hostname?) => {
      const filename = helpers.string(ctx, "filename", _filename);
      const hostname = _hostname ? helpers.string(ctx, "hostname", _hostname) : ctx.workerScript.hostname;
      const contract = getCodingContract(ctx, hostname, filename);
      return contract.getDescription();
    },
    getNumTriesRemaining: (ctx) => (_filename, _hostname?) => {
      const filename = helpers.string(ctx, "filename", _filename);
      const hostname = _hostname ? helpers.string(ctx, "hostname", _hostname) : ctx.workerScript.hostname;
      const contract = getCodingContract(ctx, hostname, filename);
      return contract.getMaxNumTries() - contract.tries;
    },
    createDummyContract: (ctx) => (_type) => {
      const type = helpers.string(ctx, "type", _type);
      generateDummyContract(type);
    },
    getContractTypes: () => () => codingContractTypesMetadata.map((c) => c.name),
  };
}
