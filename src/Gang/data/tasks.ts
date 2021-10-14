import { ITaskParams } from "../ITaskParams";
/* tslint:disable:max-line-length */

/**
 * Defines the parameters that can be used to initialize and describe a GangMemberTask
 * (defined in Gang.js)
 */
interface IGangMemberTaskMetadata {
  /**
   * Description of the task
   */
  desc: string;

  /**
   * Whether or not this task is meant for Combat-type gangs
   */
  isCombat: boolean;

  /**
   * Whether or not this task is for Hacking-type gangs
   */
  isHacking: boolean;

  /**
   * Name of the task
   */
  name: string;

  /**
   * An object containing weighting parameters for the task. These parameters are used for
   * various calculations (respect gain, wanted gain, etc.)
   */
  params: ITaskParams;
}

/**
 * Array of metadata for all Gang Member tasks. Used to construct the global GangMemberTask
 * objects in Gang.js
 */
export const gangMemberTasksMetadata: IGangMemberTaskMetadata[] = [
  {
    desc: "This gang member is currently idle",
    isCombat: true,
    isHacking: true,
    name: "Unassigned",
    params: { hackWeight: 100 }, // This is just to get by the weight check in the GangMemberTask constructor
  },
  {
    desc: "Assign this gang member to create and distribute ransomware<br><br>Earns money - Slightly increases respect - Slightly increases wanted level",
    isCombat: false,
    isHacking: true,
    name: "Ransomware",
    params: {
      baseRespect: 0.00005,
      baseWanted: 0.0001,
      baseMoney: 1,
      hackWeight: 100,
      difficulty: 1,
    },
  },
  {
    desc: "Assign this gang member to attempt phishing scams and attacks<br><br>Earns money - Slightly increases respect - Slightly increases wanted level",
    isCombat: false,
    isHacking: true,
    name: "Phishing",
    params: {
      baseRespect: 0.00008,
      baseWanted: 0.003,
      baseMoney: 2.5,
      hackWeight: 85,
      chaWeight: 15,
      difficulty: 3.5,
    },
  },
  {
    desc: "Assign this gang member to attempt identity theft<br><br>Earns money - Increases respect - Increases wanted level",
    isCombat: false,
    isHacking: true,
    name: "Identity Theft",
    params: {
      baseRespect: 0.0001,
      baseWanted: 0.075,
      baseMoney: 6,
      hackWeight: 80,
      chaWeight: 20,
      difficulty: 5,
    },
  },
  {
    desc: "Assign this gang member to carry out DDoS attacks<br><br>Increases respect - Increases wanted level",
    isCombat: false,
    isHacking: true,
    name: "DDoS Attacks",
    params: {
      baseRespect: 0.0004,
      baseWanted: 0.2,
      hackWeight: 100,
      difficulty: 8,
    },
  },
  {
    desc: "Assign this gang member to create and distribute malicious viruses<br><br>Increases respect - Increases wanted level",
    isCombat: false,
    isHacking: true,
    name: "Plant Virus",
    params: {
      baseRespect: 0.0006,
      baseWanted: 0.4,
      hackWeight: 100,
      difficulty: 12,
    },
  },
  {
    desc: "Assign this gang member to commit financial fraud and digital counterfeiting<br><br>Earns money - Slightly increases respect - Slightly increases wanted level",
    isCombat: false,
    isHacking: true,
    name: "Fraud & Counterfeiting",
    params: {
      baseRespect: 0.0004,
      baseWanted: 0.3,
      baseMoney: 15,
      hackWeight: 80,
      chaWeight: 20,
      difficulty: 20,
    },
  },
  {
    desc: "Assign this gang member to launder money<br><br>Earns money - Increases respect - Increases wanted level",
    isCombat: false,
    isHacking: true,
    name: "Money Laundering",
    params: {
      baseRespect: 0.001,
      baseWanted: 1.25,
      baseMoney: 120,
      hackWeight: 75,
      chaWeight: 25,
      difficulty: 25,
    },
  },
  {
    desc: "Assign this gang member to commit acts of cyberterrorism<br><br>Greatly increases respect - Greatly increases wanted level",
    isCombat: false,
    isHacking: true,
    name: "Cyberterrorism",
    params: {
      baseRespect: 0.01,
      baseWanted: 6,
      hackWeight: 80,
      chaWeight: 20,
      difficulty: 36,
    },
  },
  {
    desc: "Assign this gang member to be an ethical hacker for corporations<br><br>Earns money - Lowers wanted level",
    isCombat: false,
    isHacking: true,
    name: "Ethical Hacking",
    params: {
      baseWanted: -0.001,
      baseMoney: 1,
      hackWeight: 90,
      chaWeight: 10,
      difficulty: 1,
    },
  },
  {
    desc: "Assign this gang member to mug random people on the streets<br><br>Earns money - Slightly increases respect - Very slightly increases wanted level",
    isCombat: true,
    isHacking: false,
    name: "Mug People",
    params: {
      baseRespect: 0.00005,
      baseWanted: 0.00005,
      baseMoney: 1.2,
      strWeight: 25,
      defWeight: 25,
      dexWeight: 25,
      agiWeight: 10,
      chaWeight: 15,
      difficulty: 1,
    },
  },
  {
    desc: "Assign this gang member to sell drugs<br><br>Earns money - Slightly increases respect - Slightly increases wanted level - Scales slightly with territory",
    isCombat: true,
    isHacking: false,
    name: "Deal Drugs",
    params: {
      baseRespect: 0.00006,
      baseWanted: 0.002,
      baseMoney: 5,
      agiWeight: 20,
      dexWeight: 20,
      chaWeight: 60,
      difficulty: 3.5,
      territory: {
        money: 1.2,
        respect: 1,
        wanted: 1.15,
      },
    },
  },
  {
    desc: "Assign this gang member to extort civilians in your territory<br><br>Earns money - Slightly increases respect - Increases wanted - Scales heavily with territory",
    isCombat: true,
    isHacking: false,
    name: "Strongarm Civilians",
    params: {
      baseRespect: 0.00004,
      baseWanted: 0.02,
      baseMoney: 2.5,
      hackWeight: 10,
      strWeight: 25,
      defWeight: 25,
      dexWeight: 20,
      agiWeight: 10,
      chaWeight: 10,
      difficulty: 5,
      territory: {
        money: 1.6,
        respect: 1.1,
        wanted: 1.5,
      },
    },
  },
  {
    desc: "Assign this gang member to run cons<br><br>Earns money - Increases respect - Increases wanted level",
    isCombat: true,
    isHacking: false,
    name: "Run a Con",
    params: {
      baseRespect: 0.00012,
      baseWanted: 0.05,
      baseMoney: 15,
      strWeight: 5,
      defWeight: 5,
      agiWeight: 25,
      dexWeight: 25,
      chaWeight: 40,
      difficulty: 14,
    },
  },
  {
    desc: "Assign this gang member to commit armed robbery on stores, banks and armored cars<br><br>Earns money - Increases respect - Increases wanted level",
    isCombat: true,
    isHacking: false,
    name: "Armed Robbery",
    params: {
      baseRespect: 0.00014,
      baseWanted: 0.1,
      baseMoney: 38,
      hackWeight: 20,
      strWeight: 15,
      defWeight: 15,
      agiWeight: 10,
      dexWeight: 20,
      chaWeight: 20,
      difficulty: 20,
    },
  },
  {
    desc: "Assign this gang member to traffick illegal arms<br><br>Earns money - Increases respect - Increases wanted level - Scales heavily with territory",
    isCombat: true,
    isHacking: false,
    name: "Traffick Illegal Arms",
    params: {
      baseRespect: 0.0002,
      baseWanted: 0.24,
      baseMoney: 58,
      hackWeight: 15,
      strWeight: 20,
      defWeight: 20,
      dexWeight: 20,
      chaWeight: 25,
      difficulty: 32,
      territory: {
        money: 1.4,
        respect: 1.3,
        wanted: 1.25,
      },
    },
  },
  {
    desc: "Assign this gang member to threaten and black mail high-profile targets<br><br>Earns money - Slightly increases respect - Slightly increases wanted level",
    isCombat: true,
    isHacking: false,
    name: "Threaten & Blackmail",
    params: {
      baseRespect: 0.0002,
      baseWanted: 0.125,
      baseMoney: 24,
      hackWeight: 25,
      strWeight: 25,
      dexWeight: 25,
      chaWeight: 25,
      difficulty: 28,
    },
  },
  {
    desc: "Assign this gang member to engage in human trafficking operations<br><br>Earns money - Increases respect - Increases wanted level - Scales heavily with territory",
    isCombat: true,
    isHacking: false,
    name: "Human Trafficking",
    params: {
      baseRespect: 0.004,
      baseWanted: 1.25,
      baseMoney: 120,
      hackWeight: 30,
      strWeight: 5,
      defWeight: 5,
      dexWeight: 30,
      chaWeight: 30,
      difficulty: 36,
      territory: {
        money: 1.5,
        respect: 1.5,
        wanted: 1.6,
      },
    },
  },
  {
    desc: "Assign this gang member to commit acts of terrorism<br><br>Greatly increases respect - Greatly increases wanted level - Scales heavily with territory",
    isCombat: true,
    isHacking: false,
    name: "Terrorism",
    params: {
      baseRespect: 0.01,
      baseWanted: 6,
      hackWeight: 20,
      strWeight: 20,
      defWeight: 20,
      dexWeight: 20,
      chaWeight: 20,
      difficulty: 36,
      territory: {
        money: 1,
        respect: 2,
        wanted: 2,
      },
    },
  },
  {
    desc: "Assign this gang member to be a vigilante and protect the city from criminals<br><br>Decreases wanted level",
    isCombat: true,
    isHacking: true,
    name: "Vigilante Justice",
    params: {
      baseWanted: -0.001,
      hackWeight: 20,
      strWeight: 20,
      defWeight: 20,
      dexWeight: 20,
      agiWeight: 20,
      difficulty: 1,
      territory: {
        money: 1,
        respect: 1,
        wanted: 0.9, // Gets harder with more territory
      },
    },
  },
  {
    desc: "Assign this gang member to increase their combat stats (str, def, dex, agi)",
    isCombat: true,
    isHacking: true,
    name: "Train Combat",
    params: {
      strWeight: 25,
      defWeight: 25,
      dexWeight: 25,
      agiWeight: 25,
      difficulty: 100,
    },
  },
  {
    desc: "Assign this gang member to train their hacking skills",
    isCombat: true,
    isHacking: true,
    name: "Train Hacking",
    params: { hackWeight: 100, difficulty: 45 },
  },
  {
    desc: "Assign this gang member to train their charisma",
    isCombat: true,
    isHacking: true,
    name: "Train Charisma",
    params: { chaWeight: 100, difficulty: 8 },
  },
  {
    desc: "Assign this gang member to engage in territorial warfare with other gangs. Members assigned to this task will help increase your gang's territory and will defend your territory from being taken.",
    isCombat: true,
    isHacking: true,
    name: "Territory Warfare",
    params: {
      hackWeight: 15,
      strWeight: 20,
      defWeight: 20,
      dexWeight: 20,
      agiWeight: 20,
      chaWeight: 5,
      difficulty: 5,
    },
  },
];
