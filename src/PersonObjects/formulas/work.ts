import { CONSTANTS } from "../../Constants";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { IPlayer } from "../IPlayer";
import { ClassType } from "../../utils/WorkType";

export interface WorkEarnings {
  workMoneyLossRate: number;
  workHackExpGainRate: number;
  workStrExpGainRate: number;
  workDefExpGainRate: number;
  workDexExpGainRate: number;
  workAgiExpGainRate: number;
  workChaExpGainRate: number;
}

export function calculateClassEarnings(player: IPlayer): WorkEarnings {
  const gameCPS = 1000 / CONSTANTS._idleSpeed;

  //Find cost and exp gain per game cycle
  let cost = 0;
  let hackExp = 0,
    strExp = 0,
    defExp = 0,
    dexExp = 0,
    agiExp = 0,
    chaExp = 0;
  const hashManager = player.hashManager;
  switch (player.className) {
    case ClassType.StudyComputerScience:
      hackExp =
        ((CONSTANTS.ClassStudyComputerScienceBaseExp * player.workExpMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.DataStructures:
      cost = (CONSTANTS.ClassDataStructuresBaseCost * player.workCostMult) / gameCPS;
      hackExp = ((CONSTANTS.ClassDataStructuresBaseExp * player.workExpMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.Networks:
      cost = (CONSTANTS.ClassNetworksBaseCost * player.workCostMult) / gameCPS;
      hackExp = ((CONSTANTS.ClassNetworksBaseExp * player.workExpMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.Algorithms:
      cost = (CONSTANTS.ClassAlgorithmsBaseCost * player.workCostMult) / gameCPS;
      hackExp = ((CONSTANTS.ClassAlgorithmsBaseExp * player.workExpMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.Management:
      cost = (CONSTANTS.ClassManagementBaseCost * player.workCostMult) / gameCPS;
      chaExp = ((CONSTANTS.ClassManagementBaseExp * player.workExpMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.Leadership:
      cost = (CONSTANTS.ClassLeadershipBaseCost * player.workCostMult) / gameCPS;
      chaExp = ((CONSTANTS.ClassLeadershipBaseExp * player.workExpMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.GymStrength:
      cost = (CONSTANTS.ClassGymBaseCost * player.workCostMult) / gameCPS;
      strExp = (player.workExpMult / gameCPS) * hashManager.getTrainingMult();
      break;
    case ClassType.GymDefense:
      cost = (CONSTANTS.ClassGymBaseCost * player.workCostMult) / gameCPS;
      defExp = (player.workExpMult / gameCPS) * hashManager.getTrainingMult();
      break;
    case ClassType.GymDexterity:
      cost = (CONSTANTS.ClassGymBaseCost * player.workCostMult) / gameCPS;
      dexExp = (player.workExpMult / gameCPS) * hashManager.getTrainingMult();
      break;
    case ClassType.GymAgility:
      cost = (CONSTANTS.ClassGymBaseCost * player.workCostMult) / gameCPS;
      agiExp = (player.workExpMult / gameCPS) * hashManager.getTrainingMult();
      break;
    default:
      throw new Error("ERR: Invalid/unrecognized class name");
  }
  return {
    workMoneyLossRate: cost,
    workHackExpGainRate: hackExp * player.hacking_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    workStrExpGainRate: strExp * player.strength_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    workDefExpGainRate: defExp * player.defense_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    workDexExpGainRate: dexExp * player.dexterity_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    workAgiExpGainRate: agiExp * player.agility_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    workChaExpGainRate: chaExp * player.charisma_exp_mult * BitNodeMultipliers.ClassGymExpGain,
  };
}
