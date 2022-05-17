import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { WorkRates } from "../../Work/Work";
import { ClassType } from "../../Work/WorkType";
import { IPlayer } from "../IPlayer";

export function calculateClassEarnings(player: IPlayer): WorkRates {
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
  switch (player.workManager.info.studyClass.className) {
    case ClassType.StudyComputerScience:
      hackExp =
        ((CONSTANTS.ClassStudyComputerScienceBaseExp * player.workManager.expMult) / gameCPS) *
        hashManager.getStudyMult();
      break;
    case ClassType.DataStructures:
      cost = (CONSTANTS.ClassDataStructuresBaseCost * player.workManager.costMult) / gameCPS;
      hackExp =
        ((CONSTANTS.ClassDataStructuresBaseExp * player.workManager.expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.Networks:
      cost = (CONSTANTS.ClassNetworksBaseCost * player.workManager.costMult) / gameCPS;
      hackExp = ((CONSTANTS.ClassNetworksBaseExp * player.workManager.expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.Algorithms:
      cost = (CONSTANTS.ClassAlgorithmsBaseCost * player.workManager.costMult) / gameCPS;
      hackExp =
        ((CONSTANTS.ClassAlgorithmsBaseExp * player.workManager.expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.Management:
      cost = (CONSTANTS.ClassManagementBaseCost * player.workManager.costMult) / gameCPS;
      chaExp = ((CONSTANTS.ClassManagementBaseExp * player.workManager.expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.Leadership:
      cost = (CONSTANTS.ClassLeadershipBaseCost * player.workManager.costMult) / gameCPS;
      chaExp = ((CONSTANTS.ClassLeadershipBaseExp * player.workManager.expMult) / gameCPS) * hashManager.getStudyMult();
      break;
    case ClassType.GymStrength:
      cost = (CONSTANTS.ClassGymBaseCost * player.workManager.costMult) / gameCPS;
      strExp = (player.workManager.expMult / gameCPS) * hashManager.getTrainingMult();
      break;
    case ClassType.GymDefense:
      cost = (CONSTANTS.ClassGymBaseCost * player.workManager.costMult) / gameCPS;
      defExp = (player.workManager.expMult / gameCPS) * hashManager.getTrainingMult();
      break;
    case ClassType.GymDexterity:
      cost = (CONSTANTS.ClassGymBaseCost * player.workManager.costMult) / gameCPS;
      dexExp = (player.workManager.expMult / gameCPS) * hashManager.getTrainingMult();
      break;
    case ClassType.GymAgility:
      cost = (CONSTANTS.ClassGymBaseCost * player.workManager.costMult) / gameCPS;
      agiExp = (player.workManager.expMult / gameCPS) * hashManager.getTrainingMult();
      break;
    default:
      throw new Error("ERR: Invalid/unrecognized class name");
  }
  return {
    moneyLoss: cost,
    hackExp: hackExp * player.hacking_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    strExp: strExp * player.strength_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    defExp: defExp * player.defense_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    dexExp: dexExp * player.dexterity_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    agiExp: agiExp * player.agility_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    chaExp: chaExp * player.charisma_exp_mult * BitNodeMultipliers.ClassGymExpGain,
    rep: 0,
    money: 0,
  };
}
