import { IMap } from "../../types";
import { CONSTANTS } from "../../Constants";

import { IPlayer } from "../IPlayer";

export const calculateEntropy = (player: IPlayer, stacks = 1): IMap<number> => {
  // Copy mults object
  const multipliers: IMap<number> = Object.assign({}, player.mults);

  for (const [mult, val] of Object.entries(multipliers)) {
    multipliers[mult] = val * CONSTANTS.EntropyEffect ** stacks;
  }

  return multipliers;
};
