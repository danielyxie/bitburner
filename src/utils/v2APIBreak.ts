import { saveObject } from "../SaveObject";
import { Script } from "../Script/Script";
import { GetAllServers, GetServer } from "../Server/AllServers";
import { IFileLine } from "./v1APIBreak";
import { openV2Modal } from "./V2Modal";

const singularity = [
  "applyToCompany",
  "b1tflum3",
  "checkFactionInvitations",
  "commitCrime",
  "connect",
  "createProgram",
  "destroyW0r1dD43m0n",
  "donateToFaction",
  "getAugmentationBasePrice",
  "getAugmentationCost",
  "getAugmentationPrereq",
  "getAugmentationPrice",
  "getAugmentationRepReq",
  "getAugmentationsFromFaction",
  "getAugmentationStats",
  "getCompanyFavor",
  "getCompanyFavorGain",
  "getCompanyRep",
  "getCrimeChance",
  "getCrimeStats",
  "getCurrentServer",
  "getDarkwebProgramCost",
  "getDarkwebPrograms",
  "getFactionFavor",
  "getFactionFavorGain",
  "getFactionRep",
  "getOwnedAugmentations",
  "getOwnedSourceFiles",
  "getUpgradeHomeCoresCost",
  "getUpgradeHomeRamCost",
  "goToLocation",
  "gymWorkout",
  "hospitalize",
  "installAugmentations",
  "installBackdoor",
  "isBusy",
  "isFocused",
  "joinFaction",
  "manualHack",
  "purchaseAugmentation",
  "purchaseProgram",
  "purchaseTor",
  "quitJob",
  "setFocus",
  "softReset",
  "stopAction",
  "travelToCity",
  "universityCourse",
  "upgradeHomeCores",
  "upgradeHomeRam",
  "workForCompany",
  "workForFaction",
];

const getPlayerFields = [
  "workChaExpGained",
  "currentWorkFactionName",
  "workDexExpGained",
  "workHackExpGained",
  "createProgramReqLvl",
  "workStrExpGained",
  "companyName",
  "crimeType",
  "workRepGained",
  "workChaExpGainRate",
  "workType",
  "workStrExpGainRate",
  "isWorking",
  "workRepGainRate",
  "workDefExpGained",
  "currentWorkFactionDescription",
  "workHackExpGainRate",
  "workAgiExpGainRate",
  "workDexExpGainRate",
  "workMoneyGained",
  "workMoneyLossRate",
  "workMoneyGainRate",
  "createProgramName",
  "workDefExpGainRate",
  "workAgiExpGained",
  "className",
];

const mults = [
  "hacking_chance_mult",
  "hacking_speed_mult",
  "hacking_money_mult",
  "hacking_grow_mult",
  "hacking_mult",
  "hacking_exp_mult",
  "strength_mult",
  "strength_exp_mult",
  "defense_mult",
  "defense_exp_mult",
  "dexterity_mult",
  "dexterity_exp_mult",
  "agility_mult",
  "agility_exp_mult",
  "charisma_mult",
  "charisma_exp_mult",
  "hacknet_node_money_mult",
  "hacknet_node_purchase_cost_mult",
  "hacknet_node_ram_cost_mult",
  "hacknet_node_core_cost_mult",
  "hacknet_node_level_cost_mult",
  "company_rep_mult",
  "faction_rep_mult",
  "work_money_mult",
  "crime_success_mult",
  "crime_money_mult",
  "bladeburner_max_stamina_mult",
  "bladeburner_stamina_gain_mult",
  "bladeburner_analysis_mult",
  "bladeburner_success_chance_mult",
];

interface IRule {
  match: RegExp;
  reason: string;
  offenders: IFileLine[];
}

export const v2APIBreak = () => {
  const home = GetServer("home");
  if (!home) throw new Error("'home' server was not found.");
  const rules: IRule[] = [
    {
      match: /ns\.workForCompany/g,
      reason: "workForCompany argument companyName is now not-optional.",
      offenders: [],
    },
    {
      match: /ns\.getScriptExpGain/g,
      reason: "getScriptExpGain with 0 argument no longer returns the sum of all scripts. Use getTotalScriptExpGain",
      offenders: [],
    },
    {
      match: /ns\.getScriptExpGain/g,
      reason: "getScriptIncome with 0 argument no longer returns the sum of all scripts. Use getTotalScriptIncome",
      offenders: [],
    },
    {
      match: /ns\.scp/g,
      reason:
        "scp arguments were switch, it is now scp(files, destination, optionally_source). If you were using 2 argument (not 3) this doesn't affect you.",
      offenders: [],
    },
    {
      match: /ns\.stock\.buy/g,
      reason: "buy is a very common word so in order to avoid ram costs it was renamed ns.stock.buyStock",
      offenders: [],
    },
    {
      match: /ns\.stock\.sell/g,
      reason: "sell is a very common word so in order to avoid ram costs it was renamed ns.stock.sellStock",
      offenders: [],
    },
    {
      match: /ns\.corporation\.bribe/g,
      reason: "bribe no longer allows you to give shares of the corporation, only money",
      offenders: [],
    },
  ];

  for (const fn of singularity) {
    rules.push({
      match: new RegExp(`ns.${fn}`, "g"),
      reason: `ns.${fn} was moved to ns.singularity.${fn}`,
      offenders: [],
    });
  }

  for (const mult of mults) {
    rules.push({
      match: new RegExp(mult, "g"),
      reason: `ns.getPlayer().${mult} was moved to ns.getPlayer().mults.${mult.slice(0, mult.length - 5)}`,
      offenders: [],
    });
  }

  for (const f of getPlayerFields) {
    rules.push({
      match: new RegExp(f, "g"),
      reason: `The work system is completely reworked and ns.getPlayer().${f} no longer exists. This data is likely available inside ns.getPlayer().currentWork`,
      offenders: [],
    });
  }

  for (const script of home.scripts) {
    processScript(rules, script);
  }

  home.writeToTextFile("V2_0_0_API_BREAK.txt", formatRules(rules));
  openV2Modal();

  for (const server of GetAllServers()) {
    server.runningScripts = [];
  }
  saveObject.exportGame();
};

const formatOffenders = (offenders: IFileLine[]): string => {
  const files: Record<string, IFileLine[]> = {};
  for (const off of offenders) {
    const current = files[off.file] ?? [];
    current.push(off);
    files[off.file] = current;
  }

  let txt = "";
  for (const file in files) {
    txt += "\t" + file + "\n";
    for (const fileline of files[file]) {
      txt += `\t\tLine ${fileline.line} ${fileline.content.trim()}\n`;
    }
  }
  return txt;
};

const formatRules = (rules: IRule[]): string => {
  let txt =
    "This file contains the list of potential API break. A pattern was used to look through all your files and note the spots where you might have a problem. Not everything here is broken.";
  for (const rule of rules) {
    if (rule.offenders.length === 0) continue;
    txt += String(rule.match) + "\n";
    txt += rule.reason + "\n\n";
    txt += formatOffenders(rule.offenders);
    txt += "\n\n";
  }
  return txt;
};

const processScript = (rules: IRule[], script: Script) => {
  const lines = script.code.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const rule of rules) {
      const line = lines[i];
      if (line.match(rule.match)) {
        rule.offenders.push({
          file: script.filename,
          line: i + 1,
          content: line,
        });
      }
    }
  }
};
