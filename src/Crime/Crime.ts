import { CONSTANTS } from "../Constants";
import { Player } from "../Player";
import { Person } from "../PersonObjects/Person";
import { WorkerScript } from "../Netscript/WorkerScript";
import { CrimeType } from "../utils/WorkType";
import { CrimeWork } from "../Work/CrimeWork";

interface IConstructorParams {
  hacking_success_weight?: number;
  strength_success_weight?: number;
  defense_success_weight?: number;
  dexterity_success_weight?: number;
  agility_success_weight?: number;
  charisma_success_weight?: number;
  hacking_exp?: number;
  strength_exp?: number;
  defense_exp?: number;
  dexterity_exp?: number;
  agility_exp?: number;
  charisma_exp?: number;
  intelligence_exp?: number;

  kills?: number;
}

export class Crime {
  // Number representing the difficulty of the crime. Used for success chance calculations
  difficulty = 0;

  // Amount of karma lost for SUCCESSFULLY committing this crime
  karma = 0;

  // How many people die as a result of this crime
  kills = 0;

  // How much money is given by the
  money = 0;

  // Name of crime
  name = "";

  // Name of crime as it appears on work screen: "You are attempting..."
  workName = "";

  // Milliseconds it takes to attempt the crime
  time = 0;

  // Corresponding type in CONSTANTS. Contains a description for the crime activity
  type: CrimeType;

  // Weighting factors that determine how stats affect the success rate of this crime
  hacking_success_weight = 0;
  strength_success_weight = 0;
  defense_success_weight = 0;
  dexterity_success_weight = 0;
  agility_success_weight = 0;
  charisma_success_weight = 0;

  // How much stat experience is granted by this crime
  hacking_exp = 0;
  strength_exp = 0;
  defense_exp = 0;
  dexterity_exp = 0;
  agility_exp = 0;
  charisma_exp = 0;
  intelligence_exp = 0;

  constructor(
    name = "",
    workName = "",
    type: CrimeType,
    time = 0,
    money = 0,
    difficulty = 0,
    karma = 0,
    params: IConstructorParams = {},
  ) {
    this.name = name;
    this.workName = workName;
    this.type = type;
    this.time = time;
    this.money = money;
    this.difficulty = difficulty;
    this.karma = karma;

    this.hacking_success_weight = params.hacking_success_weight ? params.hacking_success_weight : 0;
    this.strength_success_weight = params.strength_success_weight ? params.strength_success_weight : 0;
    this.defense_success_weight = params.defense_success_weight ? params.defense_success_weight : 0;
    this.dexterity_success_weight = params.dexterity_success_weight ? params.dexterity_success_weight : 0;
    this.agility_success_weight = params.agility_success_weight ? params.agility_success_weight : 0;
    this.charisma_success_weight = params.charisma_success_weight ? params.charisma_success_weight : 0;

    this.hacking_exp = params.hacking_exp ? params.hacking_exp : 0;
    this.strength_exp = params.strength_exp ? params.strength_exp : 0;
    this.defense_exp = params.defense_exp ? params.defense_exp : 0;
    this.dexterity_exp = params.dexterity_exp ? params.dexterity_exp : 0;
    this.agility_exp = params.agility_exp ? params.agility_exp : 0;
    this.charisma_exp = params.charisma_exp ? params.charisma_exp : 0;
    this.intelligence_exp = params.intelligence_exp ? params.intelligence_exp : 0;

    this.kills = params.kills ? params.kills : 0;
  }

  commit(div = 1, workerScript: WorkerScript | null = null): number {
    if (div <= 0) {
      div = 1;
    }
    Player.startWork(
      new CrimeWork({
        crimeType: this.type,
        singularity: workerScript !== null,
      }),
    );

    return this.time;
  }

  successRate(p: Person): number {
    let chance: number =
      this.hacking_success_weight * p.skills.hacking +
      this.strength_success_weight * p.skills.strength +
      this.defense_success_weight * p.skills.defense +
      this.dexterity_success_weight * p.skills.dexterity +
      this.agility_success_weight * p.skills.agility +
      this.charisma_success_weight * p.skills.charisma +
      CONSTANTS.IntelligenceCrimeWeight * p.skills.intelligence;
    chance /= CONSTANTS.MaxSkillLevel;
    chance /= this.difficulty;
    chance *= p.mults.crime_success;
    chance *= p.getIntelligenceBonus(1);

    return Math.min(chance, 1);
  }
}
