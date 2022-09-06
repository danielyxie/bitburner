import React from "react";
import { BitNodeMultipliers, IBitNodeMultipliers } from "./BitNodeMultipliers";
import { Player } from "../Player";
import { IMap } from "../types";
import { FactionNames } from "../Faction/data/FactionNames";
import { CityName } from "../Locations/data/CityNames";

class BitNode {
  // A short description, or tagline, about the BitNode
  desc: string;

  // A long, detailed overview of the BitNode
  info: JSX.Element;

  // Name of BitNode
  name: string;

  // BitNode number
  number: number;

  difficulty: 0 | 1 | 2;

  constructor(n: number, difficulty: 0 | 1 | 2, name: string, desc = "", info: JSX.Element = <></>) {
    this.number = n;
    this.difficulty = difficulty;
    this.name = name;
    this.desc = desc;
    this.info = info;
  }
}

export const BitNodes: IMap<BitNode> = {};

BitNodes["BitNode1"] = new BitNode(
  1,
  0,
  "Source Genesis",
  "The original BitNode",
  (
    <>
      The first BitNode created by the Enders to imprison the minds of humans. It became the prototype and
      testing-grounds for all of the BitNodes that followed.
      <br />
      <br />
      This is the first BitNode that you play through. It has no special modifications or mechanics.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 1, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File lets the player start with 32GB of RAM on his/her home computer when
      entering a new BitNode, and also increases all of the player's multipliers by:
      <br />
      <br />
      Level 1: 16%
      <br />
      Level 2: 24%
      <br />
      Level 3: 28%
    </>
  ),
);
BitNodes["BitNode2"] = new BitNode(
  2,
  0,
  "Rise of the Underworld",
  "From the shadows, they rose", //Gangs
  (
    <>
      From the shadows, they rose.
      <br />
      <br />
      Organized crime groups quickly filled the void of power left behind from the collapse of Western government in the
      2050s. As society and civilization broke down, people quickly succumbed to the innate human impulse of evil and
      savagery. The organized crime factions quickly rose to the top of the modern world.
      <br />
      <br />
      Certain Factions ({FactionNames.SlumSnakes}, {FactionNames.Tetrads}, {FactionNames.TheSyndicate},{" "}
      {FactionNames.TheDarkArmy}, {FactionNames.SpeakersForTheDead}, {FactionNames.NiteSec}, {FactionNames.TheBlackHand}
      ) give the player the ability to form and manage their own gangs. These gangs will earn the player money and
      reputation with the corresponding Faction
      <br />
      Every Augmentation in the game will be available through the Factions listed above
      <br />
      <br />
      Destroying this BitNode will give you Source-File 2, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File allows you to form gangs in other BitNodes once your karma decreases
      to a certain value. It also increases the player's crime success rate, crime money, and charisma multipliers by:
      <br />
      <br />
      Level 1: 24%
      <br />
      Level 2: 36%
      <br />
      Level 3: 42%
    </>
  ),
);
BitNodes["BitNode3"] = new BitNode(
  3,
  0,
  "Corporatocracy",
  "The Price of Civilization",
  (
    <>
      Our greatest illusion is that a healthy society can revolve around a single-minded pursuit of wealth.
      <br />
      <br />
      Sometime in the early 21st century economic and political globalization turned the world into a corporatocracy,
      and it never looked back. Now, the privileged elite will happily bankrupt their own countrymen, decimate their own
      community, and evict their neighbors from houses in their desperate bid to increase their wealth.
      <br />
      <br />
      In this BitNode you can create and manage your own corporation. Running a successful corporation has the potential
      of generating massive profits.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 3, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File lets you create corporations on other BitNodes (although some
      BitNodes will disable this mechanic) and level 3 permanently unlocks the full API. This Source-File also increases
      your charisma and company salary multipliers by:
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
BitNodes["BitNode4"] = new BitNode(
  4,
  1,
  "The Singularity",
  "The Man and the Machine",
  (
    <>
      The Singularity has arrived. The human race is gone, replaced by artificially superintelligent beings that are
      more machine than man. <br />
      <br />
      <br />
      In this BitNode you will gain access to a new set of Netscript Functions known as Singularity Functions. These
      functions allow you to control most aspects of the game through scripts, including working for factions/companies,
      purchasing/installing Augmentations, and creating programs.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 4, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File lets you access and use the Singularity Functions in other BitNodes.
      Each level of this Source-File reduces the RAM cost of singularity functions:
      <br />
      Level 1: 16x
      <br />
      Level 2: 4x
      <br />
      Level 3: 1x
    </>
  ),
);
BitNodes["BitNode5"] = new BitNode(
  5,
  1,
  "Artificial Intelligence",
  "Posthuman",
  (
    <>
      They said it couldn't be done. They said the human brain, along with its consciousness and intelligence, couldn't
      be replicated. They said the complexity of the brain results from unpredictable, nonlinear interactions that
      couldn't be modeled by 1's and 0's. They were wrong.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 5, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File grants you a special new stat called Intelligence. Intelligence is
      unique because it is permanent and persistent (it never gets reset back to 1). However gaining Intelligence
      experience is much slower than other stats. Higher Intelligence levels will boost your production for many actions
      in the game. <br />
      <br />
      In addition, this Source-File will unlock the getBitNodeMultipliers() Netscript function and let you start with
      Formulas.exe, and will also raise all of your hacking-related multipliers by:
      <br />
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
BitNodes["BitNode6"] = new BitNode(
  6,
  1,
  FactionNames.Bladeburners,
  "Like Tears in Rain",
  (
    <>
      In the middle of the 21st century, {FactionNames.OmniTekIncorporated} began designing and manufacturing advanced
      synthetic androids, or Synthoids for short. They achieved a major technological breakthrough in the sixth
      generation of their Synthoid design, called MK-VI, by developing a hyperintelligent AI. Many argue that this was
      the first sentient AI ever created. This resulted in Synthoid models that were stronger, faster, and more
      intelligent than the humans that had created them.
      <br />
      <br />
      In this BitNode you will be able to access the {FactionNames.Bladeburners} Division at the NSA, which provides a
      new mechanic for progression.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 6, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File allows you to access the NSA's {FactionNames.Bladeburners} Division
      in other BitNodes. In addition, this Source-File will raise both the level and experience gain rate of all your
      combat stats by:
      <br />
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
BitNodes["BitNode7"] = new BitNode(
  7,
  2,
  `${FactionNames.Bladeburners} 2079`,
  "More human than humans",
  (
    <>
      In the middle of the 21st century, you were doing cutting-edge work at {FactionNames.OmniTekIncorporated} as part
      of the AI design team for advanced synthetic androids, or Synthoids for short. You helped achieve a major
      technological breakthrough in the sixth generation of the company's Synthoid design, called MK-VI, by developing a
      hyperintelligent AI. Many argue that this was the first sentient AI ever created. This resulted in Synthoid models
      that were stronger, faster, and more intelligent than the humans that had created them.
      <br />
      <br />
      In this BitNode you will be able to access the {FactionNames.Bladeburners} API, which allows you to access{" "}
      {FactionNames.Bladeburners} functionality through Netscript.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 7, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File allows you to access the {FactionNames.Bladeburners} Netscript API in
      other BitNodes. In addition, this Source-File will increase all of your {FactionNames.Bladeburners} multipliers
      by:
      <br />
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
BitNodes["BitNode8"] = new BitNode(
  8,
  2,
  "Ghost of Wall Street",
  "Money never sleeps",
  (
    <>
      You are trying to make a name for yourself as an up-and-coming hedge fund manager on Wall Street.
      <br />
      <br />
      In this BitNode:
      <br />
      <br />
      You start with $250 million
      <br />
      You start with a WSE membership and access to the TIX API
      <br />
      You are able to short stocks and place different types of orders (limit/stop)
      <br />
      <br />
      Destroying this BitNode will give you Source-File 8, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File grants the following benefits:
      <br />
      <br />
      Level 1: Permanent access to WSE and TIX API
      <br />
      Level 2: Ability to short stocks in other BitNodes
      <br />
      Level 3: Ability to use limit/stop orders in other BitNodes
      <br />
      <br />
      This Source-File also increases your hacking growth multipliers by:
      <br />
      Level 1: 12%
      <br />
      Level 2: 18%
      <br />
      Level 3: 21%
    </>
  ),
);
BitNodes["BitNode9"] = new BitNode(
  9,
  2,
  "Hacktocracy",
  "Hacknet Unleashed",
  (
    <>
      When {FactionNames.FulcrumSecretTechnologies} released their open-source Linux distro Chapeau, it quickly became
      the OS of choice for the underground hacking community. Chapeau became especially notorious for powering the
      Hacknet, a global, decentralized network used for nefarious purposes. {FactionNames.FulcrumSecretTechnologies}{" "}
      quickly abandoned the project and dissociated themselves from it.
      <br />
      <br />
      This BitNode unlocks the Hacknet Server, an upgraded version of the Hacknet Node. Hacknet Servers generate hashes,
      which can be spent on a variety of different upgrades.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 9, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File grants the following benefits:
      <br />
      <br />
      Level 1: Permanently unlocks the Hacknet Server in other BitNodes
      <br />
      Level 2: You start with 128GB of RAM on your home computer when entering a new BitNode
      <br />
      Level 3: Grants a highly-upgraded Hacknet Server when entering a new BitNode
      <br />
      <br />
      (Note that the Level 3 effect of this Source-File only applies when entering a new BitNode, NOT when installing
      Augmentations)
      <br />
      <br />
      This Source-File also increases your hacknet multipliers by:
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
BitNodes["BitNode10"] = new BitNode(
  10,
  2,
  "Digital Carbon",
  "Your body is not who you are",
  (
    <>
      In 2084, VitaLife unveiled to the world the Persona Core, a technology that allowed people to digitize their
      consciousness. Their consciousness could then be transferred into Synthoids or other bodies by trasmitting the
      digitized data. Human bodies became nothing more than 'sleeves' for the human consciousness. Mankind had finally
      achieved immortality - at least for those that could afford it.
      <br />
      <br />
      This BitNode unlocks Sleeve and grafting technologies. Sleeve technology allows you to:
      <br />
      <br />
      1. Grafting: Visit VitaLife in New Tokyo to be able to obtain Augmentations without needing to install
      <br />
      2. Duplicate Sleeves: Duplicate your consciousness into Synthoids, allowing you to perform different tasks
      synchronously.
      <br />
      <br />
      Grafting technology allows you to graft Augmentations, which is an alternative way of installing Augmentations.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 10, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File unlocks Sleeve technology, and the Grafting API in other BitNodes.
      Each level of this Source-File also grants you a Duplicate Sleeve
    </>
  ),
);
BitNodes["BitNode11"] = new BitNode(
  11,
  1,
  "The Big Crash",
  "Okay. Sell it all.",
  (
    <>
      The 2050s was defined by the massive amounts of violent civil unrest and anarchic rebellion that rose all around
      the world. It was this period of disorder that eventually lead to the governmental reformation of many global
      superpowers, most notably the USA and China. But just as the world was slowly beginning to recover from these dark
      times, financial catastrophe hit.
      <br />
      <br />
      In many countries, the high cost of trying to deal with the civil disorder bankrupted the governments. In all of
      this chaos and confusion, hackers were able to steal billions of dollars from the world's largest electronic
      banks, prompting an international banking crisis as governments were unable to bail out insolvent banks. Now, the
      world is slowly crumbling in the middle of the biggest economic crisis of all time.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 11, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File makes it so that company favor increases BOTH the player's salary and
      reputation gain rate at that company by 1% per favor (rather than just the reputation gain). This Source-File also
      increases the player's company salary and reputation gain multipliers by:
      <br />
      <br />
      Level 1: 32%
      <br />
      Level 2: 48%
      <br />
      Level 3: 56%
      <br />
      <br />
      It also reduces the price increase for every aug bought by:
      <br />
      <br />
      Level 1: 4%
      <br />
      Level 2: 6%
      <br />
      Level 3: 7%
    </>
  ),
);
BitNodes["BitNode12"] = new BitNode(
  12,
  0,
  "The Recursion",
  "Repeat.",
  (
    <>
      To iterate is human, to recurse divine.
      <br />
      <br />
      Every time this BitNode is destroyed, it becomes slightly harder. Destroying this BitNode will give you
      Source-File 12, or if you already have this Source-File it will upgrade its level. There is no maximum level for
      Source-File 12. Each level of Source-File 12 lets you start any BitNodes with NeuroFlux Governor equal to the
      level of this source file.
    </>
  ),
);
BitNodes["BitNode13"] = new BitNode(
  13,
  2,
  "They're lunatics",
  "1 step back, 2 steps forward",
  (
    <>
      With the invention of Augmentations in the 2040s a religious group known as the{" "}
      {FactionNames.ChurchOfTheMachineGod} has rallied far more support than anyone would have hoped.
      <br />
      <br />
      Their leader, Allison "Mother" Stanek is said to have created her own Augmentation whose power goes beyond any
      other. Find her in {CityName.Chongqing} and gain her trust.
      <br />
      <br />
      Destroying this BitNode will give you Source-File 13, or if you already have this Source-File it will upgrade its
      level up to a maximum of 3. This Source-File lets the {FactionNames.ChurchOfTheMachineGod} appear in other
      BitNodes.
      <br />
      <br />
      Each level of this Source-File increases the size of Stanek's Gift.
    </>
  ),
);

export const defaultMultipliers: IBitNodeMultipliers = {
  HackingLevelMultiplier: 1,
  StrengthLevelMultiplier: 1,
  DefenseLevelMultiplier: 1,
  DexterityLevelMultiplier: 1,
  AgilityLevelMultiplier: 1,
  CharismaLevelMultiplier: 1,

  ServerGrowthRate: 1,
  ServerMaxMoney: 1,
  ServerStartingMoney: 1,
  ServerStartingSecurity: 1,
  ServerWeakenRate: 1,

  HomeComputerRamCost: 1,

  PurchasedServerCost: 1,
  PurchasedServerSoftcap: 1,
  PurchasedServerLimit: 1,
  PurchasedServerMaxRam: 1,

  CompanyWorkMoney: 1,
  CrimeMoney: 1,
  HacknetNodeMoney: 1,
  ManualHackMoney: 1,
  ScriptHackMoney: 1,
  ScriptHackMoneyGain: 1,
  CodingContractMoney: 1,

  ClassGymExpGain: 1,
  CompanyWorkExpGain: 1,
  CrimeExpGain: 1,
  FactionWorkExpGain: 1,
  HackExpGain: 1,

  FactionPassiveRepGain: 1,
  FactionWorkRepGain: 1,
  RepToDonateToFaction: 1,

  AugmentationMoneyCost: 1,
  AugmentationRepCost: 1,

  InfiltrationMoney: 1,
  InfiltrationRep: 1,

  FourSigmaMarketDataCost: 1,
  FourSigmaMarketDataApiCost: 1,

  CorporationValuation: 1,
  CorporationSoftcap: 1,

  BladeburnerRank: 1,
  BladeburnerSkillCost: 1,

  GangSoftcap: 1,
  GangUniqueAugs: 1,

  DaedalusAugsRequirement: 30,

  StaneksGiftPowerMultiplier: 1,
  StaneksGiftExtraSize: 0,

  WorldDaemonDifficulty: 1,
};

Object.freeze(defaultMultipliers);

export function getBitNodeMultipliers(n: number, lvl: number): IBitNodeMultipliers {
  const mults = Object.assign({}, defaultMultipliers);
  switch (n) {
    case 1: {
      return mults;
    }
    case 2: {
      return Object.assign(mults, {
        HackingLevelMultiplier: 0.8,
        ServerGrowthRate: 0.8,
        ServerMaxMoney: 0.2,
        ServerStartingMoney: 0.4,
        CrimeMoney: 3,
        InfiltrationMoney: 3,
        FactionWorkRepGain: 0.5,
        FactionPassiveRepGain: 0,
        StaneksGiftPowerMultiplier: 2,
        StaneksGiftExtraSize: -6,
        PurchasedServerSoftcap: 1.3,
        CorporationSoftcap: 0.9,
        WorldDaemonDifficulty: 5,
      });
    }
    case 3: {
      return Object.assign(mults, {
        HackingLevelMultiplier: 0.8,
        RepToDonateToFaction: 0.5,
        AugmentationRepCost: 3,
        AugmentationMoneyCost: 3,
        ServerMaxMoney: 0.2,
        ServerStartingMoney: 0.2,
        ServerGrowthRate: 0.2,
        ScriptHackMoney: 0.2,
        CompanyWorkMoney: 0.25,
        CrimeMoney: 0.25,
        HacknetNodeMoney: 0.25,
        HomeComputerRamCost: 1.5,
        PurchasedServerCost: 2,
        StaneksGiftPowerMultiplier: 0.75,
        StaneksGiftExtraSize: -2,
        PurchasedServerSoftcap: 1.3,
        GangSoftcap: 0.9,
        WorldDaemonDifficulty: 2,
        GangUniqueAugs: 0.5,
      });
    }
    case 4: {
      return Object.assign(mults, {
        ServerMaxMoney: 0.15,
        ServerStartingMoney: 0.75,
        ScriptHackMoney: 0.2,
        CompanyWorkMoney: 0.1,
        CrimeMoney: 0.2,
        HacknetNodeMoney: 0.05,
        CompanyWorkExpGain: 0.5,
        ClassGymExpGain: 0.5,
        FactionWorkExpGain: 0.5,
        HackExpGain: 0.4,
        CrimeExpGain: 0.5,
        FactionWorkRepGain: 0.75,
        StaneksGiftPowerMultiplier: 1.5,
        StaneksGiftExtraSize: 0,
        PurchasedServerSoftcap: 1.2,
        WorldDaemonDifficulty: 3,
        GangUniqueAugs: 0.5,
      });
    }
    case 5: {
      return Object.assign(mults, {
        ServerMaxMoney: 2,
        ServerStartingSecurity: 2,
        ServerStartingMoney: 0.5,
        ScriptHackMoney: 0.15,
        HacknetNodeMoney: 0.2,
        CrimeMoney: 0.5,
        InfiltrationRep: 1.5,
        InfiltrationMoney: 1.5,
        AugmentationMoneyCost: 2,
        HackExpGain: 0.5,
        CorporationValuation: 0.5,
        StaneksGiftPowerMultiplier: 1.3,
        StaneksGiftExtraSize: 0,
        PurchasedServerSoftcap: 1.2,
        WorldDaemonDifficulty: 1.5,
        GangUniqueAugs: 0.5,
      });
    }
    case 6: {
      return Object.assign(mults, {
        HackingLevelMultiplier: 0.35,
        ServerMaxMoney: 0.4,
        ServerStartingMoney: 0.5,
        ServerStartingSecurity: 1.5,
        ScriptHackMoney: 0.75,
        CompanyWorkMoney: 0.5,
        CrimeMoney: 0.75,
        InfiltrationMoney: 0.75,
        CorporationValuation: 0.2,
        HacknetNodeMoney: 0.2,
        HackExpGain: 0.25,
        DaedalusAugsRequirement: 35,
        PurchasedServerSoftcap: 2,
        StaneksGiftPowerMultiplier: 0.5,
        StaneksGiftExtraSize: 2,
        GangSoftcap: 0.7,
        CorporationSoftcap: 0.9,
        WorldDaemonDifficulty: 2,
        GangUniqueAugs: 0.2,
      });
    }
    case 7: {
      return Object.assign(mults, {
        BladeburnerRank: 0.6,
        BladeburnerSkillCost: 2,
        AugmentationMoneyCost: 3,
        HackingLevelMultiplier: 0.35,
        ServerMaxMoney: 0.4,
        ServerStartingMoney: 0.5,
        ServerStartingSecurity: 1.5,
        ScriptHackMoney: 0.5,
        CompanyWorkMoney: 0.5,
        CrimeMoney: 0.75,
        InfiltrationMoney: 0.75,
        CorporationValuation: 0.2,
        HacknetNodeMoney: 0.2,
        HackExpGain: 0.25,
        FourSigmaMarketDataCost: 2,
        FourSigmaMarketDataApiCost: 2,
        DaedalusAugsRequirement: 35,
        PurchasedServerSoftcap: 2,
        StaneksGiftPowerMultiplier: 0.9,
        StaneksGiftExtraSize: -1,
        GangSoftcap: 0.7,
        CorporationSoftcap: 0.9,
        WorldDaemonDifficulty: 2,
        GangUniqueAugs: 0.2,
      });
    }
    case 8: {
      return Object.assign(mults, {
        BladeburnerRank: 0,
        ScriptHackMoney: 0.3,
        ScriptHackMoneyGain: 0,
        ManualHackMoney: 0,
        CompanyWorkMoney: 0,
        CrimeMoney: 0,
        HacknetNodeMoney: 0,
        InfiltrationMoney: 0,
        RepToDonateToFaction: 0,
        CorporationValuation: 0,
        CodingContractMoney: 0,
        StaneksGiftExtraSize: -99,
        PurchasedServerSoftcap: 4,
        GangSoftcap: 0,
        CorporationSoftcap: 0,
        GangUniqueAugs: 0,
      });
    }
    case 9: {
      return Object.assign(mults, {
        HackingLevelMultiplier: 0.5,
        StrengthLevelMultiplier: 0.45,
        DefenseLevelMultiplier: 0.45,
        DexterityLevelMultiplier: 0.45,
        AgilityLevelMultiplier: 0.45,
        CharismaLevelMultiplier: 0.45,
        PurchasedServerLimit: 0,
        HomeComputerRamCost: 5,
        CrimeMoney: 0.5,
        ScriptHackMoney: 0.1,
        HackExpGain: 0.05,
        ServerStartingMoney: 0.1,
        ServerMaxMoney: 0.1,
        ServerStartingSecurity: 2.5,
        CorporationValuation: 0.5,
        FourSigmaMarketDataCost: 5,
        FourSigmaMarketDataApiCost: 4,
        BladeburnerRank: 0.9,
        BladeburnerSkillCost: 1.2,
        StaneksGiftPowerMultiplier: 0.5,
        StaneksGiftExtraSize: 2,
        GangSoftcap: 0.8,
        CorporationSoftcap: 0.7,
        WorldDaemonDifficulty: 2,
        GangUniqueAugs: 0.25,
      });
    }
    case 10: {
      return Object.assign(mults, {
        HackingLevelMultiplier: 0.35,
        StrengthLevelMultiplier: 0.4,
        DefenseLevelMultiplier: 0.4,
        DexterityLevelMultiplier: 0.4,
        AgilityLevelMultiplier: 0.4,
        CharismaLevelMultiplier: 0.4,
        CompanyWorkMoney: 0.5,
        CrimeMoney: 0.5,
        HacknetNodeMoney: 0.5,
        ManualHackMoney: 0.5,
        ScriptHackMoney: 0.5,
        CodingContractMoney: 0.5,
        InfiltrationMoney: 0.5,
        CorporationValuation: 0.5,
        AugmentationMoneyCost: 5,
        AugmentationRepCost: 2,
        HomeComputerRamCost: 1.5,
        PurchasedServerCost: 5,
        PurchasedServerLimit: 0.6,
        PurchasedServerMaxRam: 0.5,
        BladeburnerRank: 0.8,
        StaneksGiftPowerMultiplier: 0.75,
        StaneksGiftExtraSize: -3,
        PurchasedServerSoftcap: 1.1,
        GangSoftcap: 0.9,
        CorporationSoftcap: 0.9,
        WorldDaemonDifficulty: 2,
        GangUniqueAugs: 0.25,
      });
    }
    case 11: {
      return Object.assign(mults, {
        HackingLevelMultiplier: 0.6,
        HackExpGain: 0.5,
        ServerMaxMoney: 0.1,
        ServerStartingMoney: 0.1,
        ServerGrowthRate: 0.2,
        ServerWeakenRate: 2,
        CrimeMoney: 3,
        CompanyWorkMoney: 0.5,
        HacknetNodeMoney: 0.1,
        AugmentationMoneyCost: 2,
        InfiltrationMoney: 2.5,
        InfiltrationRep: 2.5,
        CorporationValuation: 0.1,
        CodingContractMoney: 0.25,
        FourSigmaMarketDataCost: 4,
        FourSigmaMarketDataApiCost: 4,
        PurchasedServerSoftcap: 2,
        CorporationSoftcap: 0.9,
        WorldDaemonDifficulty: 1.5,
        GangUniqueAugs: 0.75,
      });
    }
    case 12: {
      const inc = Math.pow(1.02, lvl);
      const dec = 1 / inc;

      return Object.assign(mults, {
        DaedalusAugsRequirement: Math.floor(Math.min(mults.DaedalusAugsRequirement + inc, 40)),

        HackingLevelMultiplier: dec,
        StrengthLevelMultiplier: dec,
        DefenseLevelMultiplier: dec,
        DexterityLevelMultiplier: dec,
        AgilityLevelMultiplier: dec,
        CharismaLevelMultiplier: dec,

        ServerMaxMoney: dec,
        ServerStartingMoney: dec,
        ServerGrowthRate: dec,
        ServerWeakenRate: dec,

        //Does not scale, otherwise security might start at 300+
        ServerStartingSecurity: 1.5,

        HomeComputerRamCost: inc,

        PurchasedServerCost: inc,
        PurchasedServerLimit: dec,
        PurchasedServerMaxRam: dec,
        PurchasedServerSoftcap: inc,

        ManualHackMoney: dec,
        ScriptHackMoney: dec,
        CompanyWorkMoney: dec,
        CrimeMoney: dec,
        HacknetNodeMoney: dec,
        CodingContractMoney: dec,

        CompanyWorkExpGain: dec,
        ClassGymExpGain: dec,
        FactionWorkExpGain: dec,
        HackExpGain: dec,
        CrimeExpGain: dec,

        FactionWorkRepGain: dec,
        FactionPassiveRepGain: dec,
        RepToDonateToFaction: inc,

        AugmentationRepCost: inc,
        AugmentationMoneyCost: inc,

        InfiltrationMoney: dec,
        InfiltrationRep: dec,

        FourSigmaMarketDataCost: inc,
        FourSigmaMarketDataApiCost: inc,

        CorporationValuation: dec,

        BladeburnerRank: dec,
        BladeburnerSkillCost: inc,

        StaneksGiftPowerMultiplier: inc,
        StaneksGiftExtraSize: inc,
        GangSoftcap: 0.8,
        CorporationSoftcap: 0.8,
        WorldDaemonDifficulty: inc,

        GangUniqueAugs: dec,
      });
    }
    case 13: {
      return Object.assign(mults, {
        PurchasedServerSoftcap: 1.6,

        HackingLevelMultiplier: 0.25,
        StrengthLevelMultiplier: 0.7,
        DefenseLevelMultiplier: 0.7,
        DexterityLevelMultiplier: 0.7,
        AgilityLevelMultiplier: 0.7,

        ServerMaxMoney: 0.45,
        ServerStartingMoney: 0.75,

        ServerStartingSecurity: 3,

        ScriptHackMoney: 0.2,
        CompanyWorkMoney: 0.4,
        CrimeMoney: 0.4,
        HacknetNodeMoney: 0.4,
        CodingContractMoney: 0.4,

        CompanyWorkExpGain: 0.5,
        ClassGymExpGain: 0.5,
        FactionWorkExpGain: 0.5,
        HackExpGain: 0.1,
        CrimeExpGain: 0.5,

        FactionWorkRepGain: 0.6,

        FourSigmaMarketDataCost: 10,
        FourSigmaMarketDataApiCost: 10,

        CorporationValuation: 0.001,

        BladeburnerRank: 0.45,
        BladeburnerSkillCost: 2,
        StaneksGiftPowerMultiplier: 2,
        StaneksGiftExtraSize: 1,
        GangSoftcap: 0.3,
        CorporationSoftcap: 0.3,
        WorldDaemonDifficulty: 3,
        GangUniqueAugs: 0.1,
      });
    }
    default: {
      throw new Error("Invalid BitNodeN");
    }
  }
}

export function initBitNodeMultipliers(): void {
  Object.assign(BitNodeMultipliers, getBitNodeMultipliers(Player.bitNodeN, Player.sourceFileLvl(Player.bitNodeN)));
}
