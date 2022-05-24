import { IPlayer } from "src/PersonObjects/IPlayer";
import { IMap } from "../types";

// TODO remember to update RamCalculations.js and WorkerScript.js

// RAM costs for Netscript functions
export const RamCostConstants: IMap<number> = {
  ScriptBaseRamCost: 1.6,
  ScriptDomRamCost: 25,
  ScriptCorporationRamCost: 1024 - 1.6,
  ScriptHackRamCost: 0.1,
  ScriptHackAnalyzeRamCost: 1,
  ScriptGrowRamCost: 0.15,
  ScriptGrowthAnalyzeRamCost: 1,
  ScriptWeakenRamCost: 0.15,
  ScriptWeakenAnalyzeRamCost: 1,
  ScriptScanRamCost: 0.2,
  ScriptRecentScriptsRamCost: 0.2,
  ScriptPortProgramRamCost: 0.05,
  ScriptRunRamCost: 1.0,
  ScriptExecRamCost: 1.3,
  ScriptSpawnRamCost: 2.0,
  ScriptScpRamCost: 0.6,
  ScriptKillRamCost: 0.5,
  ScriptHasRootAccessRamCost: 0.05,
  ScriptGetHostnameRamCost: 0.05,
  ScriptGetHackingLevelRamCost: 0.05,
  ScriptGetMultipliersRamCost: 4.0,
  ScriptGetServerRamCost: 0.1,
  ScriptGetServerMaxRam: 0.05,
  ScriptGetServerUsedRam: 0.05,
  ScriptFileExistsRamCost: 0.1,
  ScriptIsRunningRamCost: 0.1,
  ScriptHacknetNodesRamCost: 4.0,
  ScriptHNUpgLevelRamCost: 0.4,
  ScriptHNUpgRamRamCost: 0.6,
  ScriptHNUpgCoreRamCost: 0.8,
  ScriptGetStockRamCost: 2.0,
  ScriptBuySellStockRamCost: 2.5,
  ScriptGetPurchaseServerRamCost: 0.25,
  ScriptPurchaseServerRamCost: 2.25,
  ScriptGetPurchasedServerLimit: 0.05,
  ScriptGetPurchasedServerMaxRam: 0.05,
  ScriptRoundRamCost: 0.05,
  ScriptReadWriteRamCost: 1.0,
  ScriptArbScriptRamCost: 1.0,
  ScriptGetScriptRamCost: 0.1,
  ScriptGetRunningScriptRamCost: 0.3,
  ScriptGetHackTimeRamCost: 0.05,
  ScriptGetFavorToDonate: 0.1,
  ScriptCodingContractBaseRamCost: 10,
  ScriptSleeveBaseRamCost: 4,
  ScriptGetOwnedSourceFiles: 5,
  ScriptClearTerminalCost: 0.2,

  ScriptSingularityFn1RamCost: 2,
  ScriptSingularityFn2RamCost: 3,
  ScriptSingularityFn3RamCost: 5,

  ScriptGangApiBaseRamCost: 4,

  ScriptBladeburnerApiBaseRamCost: 4,

  ScriptStanekWidth: 0.4,
  ScriptStanekHeight: 0.4,
  ScriptStanekCharge: 0.4,
  ScriptStanekFragmentDefinitions: 0,
  ScriptStanekPlacedFragments: 5,
  ScriptStanekClear: 0,
  ScriptStanekCanPlace: 0.5,
  ScriptStanekPlace: 5,
  ScriptStanekFragmentAt: 2,
  ScriptStanekDeleteAt: 0.15,
  ScriptInfiltrationCalculateDifficulty: 2.5,
  ScriptInfiltrationCalculateRewards: 2.5,
  ScriptInfiltrationGetLocations: 5,
  ScriptInfiltrationGetInfiltrations: 15,
  ScriptStanekAcceptGift: 2,
};

function SF4Cost(cost: number): (player: IPlayer) => number {
  return (player: IPlayer): number => {
    if (player.bitNodeN === 4) return cost;
    const sf4 = player.sourceFileLvl(4);
    if (sf4 <= 1) return cost * 16;
    if (sf4 === 2) return cost * 4;
    return cost;
  };
}

// Hacknet API
const hacknet: IMap<any> = {
  numNodes: 0,
  purchaseNode: 0,
  getPurchaseNodeCost: 0,
  getNodeStats: 0,
  upgradeLevel: 0,
  upgradeRam: 0,
  upgradeCore: 0,
  upgradeCache: 0,
  getLevelUpgradeCost: 0,
  getRamUpgradeCost: 0,
  getCoreUpgradeCost: 0,
  getCacheUpgradeCost: 0,
  numHashes: 0,
  hashCost: 0,
  spendHashes: 0,
  maxNumNodes: 0,
};

// Stock API
const stock: IMap<any> = {
  getSymbols: RamCostConstants.ScriptGetStockRamCost,
  getPrice: RamCostConstants.ScriptGetStockRamCost,
  getAskPrice: RamCostConstants.ScriptGetStockRamCost,
  getBidPrice: RamCostConstants.ScriptGetStockRamCost,
  getPosition: RamCostConstants.ScriptGetStockRamCost,
  getMaxShares: RamCostConstants.ScriptGetStockRamCost,
  getPurchaseCost: RamCostConstants.ScriptGetStockRamCost,
  getSaleGain: RamCostConstants.ScriptGetStockRamCost,
  buy: RamCostConstants.ScriptBuySellStockRamCost,
  sell: RamCostConstants.ScriptBuySellStockRamCost,
  short: RamCostConstants.ScriptBuySellStockRamCost,
  sellShort: RamCostConstants.ScriptBuySellStockRamCost,
  placeOrder: RamCostConstants.ScriptBuySellStockRamCost,
  cancelOrder: RamCostConstants.ScriptBuySellStockRamCost,
  getOrders: RamCostConstants.ScriptBuySellStockRamCost,
  getVolatility: RamCostConstants.ScriptBuySellStockRamCost,
  getForecast: RamCostConstants.ScriptBuySellStockRamCost,
  purchase4SMarketData: RamCostConstants.ScriptBuySellStockRamCost,
  purchase4SMarketDataTixApi: RamCostConstants.ScriptBuySellStockRamCost,
  purchaseWseAccount: RamCostConstants.ScriptBuySellStockRamCost,
  purchaseTixApi: RamCostConstants.ScriptBuySellStockRamCost,
};

// Singularity API
const singularity: IMap<any> = {
  universityCourse: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost),
  gymWorkout: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost),
  travelToCity: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost),
  goToLocation: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  purchaseTor: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost),
  purchaseProgram: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost),
  getCurrentServer: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost),
  connect: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost),
  manualHack: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost),
  installBackdoor: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost),
  getDarkwebProgramCost: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost / 4),
  getDarkwebPrograms: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost / 4),
  getStats: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost / 4),
  getCharacterInformation: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost / 4),
  hospitalize: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost / 4),
  isBusy: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost / 4),
  stopAction: SF4Cost(RamCostConstants.ScriptSingularityFn1RamCost / 2),
  upgradeHomeRam: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost),
  upgradeHomeCores: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost),
  getUpgradeHomeRamCost: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost / 2),
  getUpgradeHomeCoresCost: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost / 2),
  workForCompany: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost),
  applyToCompany: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost),
  quitJob: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost),
  getCompanyRep: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost / 3),
  getCompanyFavor: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost / 3),
  getCompanyFavorGain: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost / 4),
  checkFactionInvitations: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost),
  joinFaction: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost),
  workForFaction: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost),
  getFactionRep: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost / 3),
  getFactionFavor: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost / 3),
  getFactionFavorGain: SF4Cost(RamCostConstants.ScriptSingularityFn2RamCost / 4),
  donateToFaction: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  createProgram: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  commitCrime: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  getCrimeChance: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  getCrimeStats: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  getOwnedAugmentations: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  getAugmentationsFromFaction: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  getAugmentationCost: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  getAugmentationPrereq: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  getAugmentationPrice: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost / 2),
  getAugmentationRepReq: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost / 2),
  getAugmentationStats: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  purchaseAugmentation: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  softReset: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  installAugmentations: SF4Cost(RamCostConstants.ScriptSingularityFn3RamCost),
  isFocused: SF4Cost(0.1),
  setFocus: SF4Cost(0.1),
  b1tflum3: SF4Cost(16),
  destroyW0r1dD43m0n: SF4Cost(32),
};

// Gang API
const gang: IMap<any> = {
  createGang: RamCostConstants.ScriptGangApiBaseRamCost / 4,
  inGang: RamCostConstants.ScriptGangApiBaseRamCost / 4,
  getMemberNames: RamCostConstants.ScriptGangApiBaseRamCost / 4,
  getGangInformation: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  getOtherGangInformation: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  getMemberInformation: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  canRecruitMember: RamCostConstants.ScriptGangApiBaseRamCost / 4,
  recruitMember: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  getTaskNames: RamCostConstants.ScriptGangApiBaseRamCost / 4,
  getTaskStats: RamCostConstants.ScriptGangApiBaseRamCost / 4,
  setMemberTask: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  getEquipmentNames: RamCostConstants.ScriptGangApiBaseRamCost / 4,
  getEquipmentCost: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  getEquipmentType: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  getEquipmentStats: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  purchaseEquipment: RamCostConstants.ScriptGangApiBaseRamCost,
  ascendMember: RamCostConstants.ScriptGangApiBaseRamCost,
  getAscensionResult: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  setTerritoryWarfare: RamCostConstants.ScriptGangApiBaseRamCost / 2,
  getChanceToWinClash: RamCostConstants.ScriptGangApiBaseRamCost,
  getBonusTime: 0,
};

// Bladeburner API
const bladeburner: IMap<any> = {
  getContractNames: RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
  getOperationNames: RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
  getBlackOpNames: RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
  getBlackOpRank: RamCostConstants.ScriptBladeburnerApiBaseRamCost / 2,
  getGeneralActionNames: RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
  getSkillNames: RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
  startAction: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  stopBladeburnerAction: RamCostConstants.ScriptBladeburnerApiBaseRamCost / 2,
  getCurrentAction: RamCostConstants.ScriptBladeburnerApiBaseRamCost / 4,
  getActionTime: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getActionCurrentTime: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getActionEstimatedSuccessChance: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getActionRepGain: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getActionCountRemaining: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getActionMaxLevel: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getActionCurrentLevel: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getActionAutolevel: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  setActionAutolevel: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  setActionLevel: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getRank: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getSkillPoints: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getSkillLevel: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getSkillUpgradeCost: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  upgradeSkill: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getTeamSize: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  setTeamSize: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getCityEstimatedPopulation: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getCityCommunities: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getCityChaos: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getCity: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  switchCity: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getStamina: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  joinBladeburnerFaction: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  joinBladeburnerDivision: RamCostConstants.ScriptBladeburnerApiBaseRamCost,
  getBonusTime: 0,
};

const infiltration: IMap<any> = {
  calculateDifficulty: RamCostConstants.ScriptInfiltrationCalculateDifficulty,
  calculateRewards: RamCostConstants.ScriptInfiltrationCalculateRewards,
  calculateGetLocations: RamCostConstants.ScriptInfiltrationGetLocations,
  calculateGetInfiltrations: RamCostConstants.ScriptInfiltrationGetInfiltrations,
};

// Coding Contract API
const codingcontract: IMap<any> = {
  attempt: RamCostConstants.ScriptCodingContractBaseRamCost,
  getContractType: RamCostConstants.ScriptCodingContractBaseRamCost / 2,
  getData: RamCostConstants.ScriptCodingContractBaseRamCost / 2,
  getDescription: RamCostConstants.ScriptCodingContractBaseRamCost / 2,
  getNumTriesRemaining: RamCostConstants.ScriptCodingContractBaseRamCost / 5,
};

// Duplicate Sleeve API
const sleeve: IMap<any> = {
  getNumSleeves: RamCostConstants.ScriptSleeveBaseRamCost,
  setToShockRecovery: RamCostConstants.ScriptSleeveBaseRamCost,
  setToSynchronize: RamCostConstants.ScriptSleeveBaseRamCost,
  setToCommitCrime: RamCostConstants.ScriptSleeveBaseRamCost,
  setToUniversityCourse: RamCostConstants.ScriptSleeveBaseRamCost,
  travel: RamCostConstants.ScriptSleeveBaseRamCost,
  setToCompanyWork: RamCostConstants.ScriptSleeveBaseRamCost,
  setToFactionWork: RamCostConstants.ScriptSleeveBaseRamCost,
  setToGymWorkout: RamCostConstants.ScriptSleeveBaseRamCost,
  getSleeveStats: RamCostConstants.ScriptSleeveBaseRamCost,
  getTask: RamCostConstants.ScriptSleeveBaseRamCost,
  getInformation: RamCostConstants.ScriptSleeveBaseRamCost,
  getSleeveAugmentations: RamCostConstants.ScriptSleeveBaseRamCost,
  getSleevePurchasableAugs: RamCostConstants.ScriptSleeveBaseRamCost,
  purchaseSleeveAug: RamCostConstants.ScriptSleeveBaseRamCost,
  setToBladeburnerAction: RamCostConstants.ScriptSleeveBaseRamCost,
};

// Stanek API
const stanek: IMap<any> = {
  giftWidth: RamCostConstants.ScriptStanekWidth,
  giftHeight: RamCostConstants.ScriptStanekHeight,
  chargeFragment: RamCostConstants.ScriptStanekCharge,
  fragmentDefinitions: RamCostConstants.ScriptStanekFragmentDefinitions,
  activeFragments: RamCostConstants.ScriptStanekPlacedFragments,
  clearGift: RamCostConstants.ScriptStanekClear,
  canPlaceFragment: RamCostConstants.ScriptStanekCanPlace,
  placeFragment: RamCostConstants.ScriptStanekPlace,
  getFragment: RamCostConstants.ScriptStanekFragmentAt,
  removeFragment: RamCostConstants.ScriptStanekDeleteAt,
  acceptGift: RamCostConstants.ScriptStanekAcceptGift,
};

// UI API
const ui: IMap<any> = {
  getTheme: 0,
  setTheme: 0,
  resetTheme: 0,
  getStyles: 0,
  setStyles: 0,
  resetStyles: 0,
  getGameInfo: 0,
};

// Grafting API
const grafting: IMap<any> = {
  getAugmentationGraftPrice: 3.75,
  getAugmentationGraftTime: 3.75,
  getGraftableAugmentations: 5,
  graftAugmentation: 7.5,
};

export const RamCosts: IMap<any> = {
  hacknet,
  stock,
  singularity,
  ...singularity, // singularity is in namespace & toplevel
  gang,
  bladeburner,
  infiltration,
  codingcontract,
  sleeve,
  stanek,
  ui,
  grafting,

  sprintf: 0,
  vsprintf: 0,
  scan: RamCostConstants.ScriptScanRamCost,
  hack: RamCostConstants.ScriptHackRamCost,
  hackAnalyzeThreads: RamCostConstants.ScriptHackAnalyzeRamCost,
  hackAnalyze: RamCostConstants.ScriptHackAnalyzeRamCost,
  hackAnalyzeSecurity: RamCostConstants.ScriptHackAnalyzeRamCost,
  hackAnalyzeChance: RamCostConstants.ScriptHackAnalyzeRamCost,
  sleep: 0,
  asleep: 0,
  share: 2.4,
  getSharePower: 0.2,
  grow: RamCostConstants.ScriptGrowRamCost,
  growthAnalyze: RamCostConstants.ScriptGrowthAnalyzeRamCost,
  growthAnalyzeSecurity: RamCostConstants.ScriptGrowthAnalyzeRamCost,
  weaken: RamCostConstants.ScriptWeakenRamCost,
  weakenAnalyze: RamCostConstants.ScriptWeakenAnalyzeRamCost,
  print: 0,
  printf: 0,
  tprint: 0,
  tprintf: 0,
  clearLog: 0,
  disableLog: 0,
  enableLog: 0,
  isLogEnabled: 0,
  getScriptLogs: 0,
  clearTerminal: RamCostConstants.ScriptClearTerminalCost,
  nuke: RamCostConstants.ScriptPortProgramRamCost,
  brutessh: RamCostConstants.ScriptPortProgramRamCost,
  ftpcrack: RamCostConstants.ScriptPortProgramRamCost,
  relaysmtp: RamCostConstants.ScriptPortProgramRamCost,
  httpworm: RamCostConstants.ScriptPortProgramRamCost,
  sqlinject: RamCostConstants.ScriptPortProgramRamCost,
  run: RamCostConstants.ScriptRunRamCost,
  exec: RamCostConstants.ScriptExecRamCost,
  spawn: RamCostConstants.ScriptSpawnRamCost,
  kill: RamCostConstants.ScriptKillRamCost,
  killall: RamCostConstants.ScriptKillRamCost,
  exit: 0,
  atExit: 0,
  scp: RamCostConstants.ScriptScpRamCost,
  ls: RamCostConstants.ScriptScanRamCost,
  ps: RamCostConstants.ScriptScanRamCost,
  getRecentScripts: RamCostConstants.ScriptRecentScriptsRamCost,
  hasRootAccess: RamCostConstants.ScriptHasRootAccessRamCost,
  getIp: RamCostConstants.ScriptGetHostnameRamCost,
  getHostname: RamCostConstants.ScriptGetHostnameRamCost,
  getHackingLevel: RamCostConstants.ScriptGetHackingLevelRamCost,
  getHackingMultipliers: RamCostConstants.ScriptGetMultipliersRamCost,
  getHacknetMultipliers: RamCostConstants.ScriptGetMultipliersRamCost,
  getBitNodeMultipliers: RamCostConstants.ScriptGetMultipliersRamCost,
  getServer: RamCostConstants.ScriptGetMultipliersRamCost / 2,
  getServerMoneyAvailable: RamCostConstants.ScriptGetServerRamCost,
  getServerSecurityLevel: RamCostConstants.ScriptGetServerRamCost,
  getServerBaseSecurityLevel: RamCostConstants.ScriptGetServerRamCost,
  getServerMinSecurityLevel: RamCostConstants.ScriptGetServerRamCost,
  getServerRequiredHackingLevel: RamCostConstants.ScriptGetServerRamCost,
  getServerMaxMoney: RamCostConstants.ScriptGetServerRamCost,
  getServerGrowth: RamCostConstants.ScriptGetServerRamCost,
  getServerNumPortsRequired: RamCostConstants.ScriptGetServerRamCost,
  getServerRam: RamCostConstants.ScriptGetServerRamCost,
  getServerMaxRam: RamCostConstants.ScriptGetServerMaxRam,
  getServerUsedRam: RamCostConstants.ScriptGetServerUsedRam,
  serverExists: RamCostConstants.ScriptGetServerRamCost,
  fileExists: RamCostConstants.ScriptFileExistsRamCost,
  isRunning: RamCostConstants.ScriptIsRunningRamCost,
  getPurchasedServerLimit: RamCostConstants.ScriptGetPurchasedServerLimit,
  getPurchasedServerMaxRam: RamCostConstants.ScriptGetPurchasedServerMaxRam,
  getPurchasedServerCost: RamCostConstants.ScriptGetPurchaseServerRamCost,
  purchaseServer: RamCostConstants.ScriptPurchaseServerRamCost,
  deleteServer: RamCostConstants.ScriptPurchaseServerRamCost,
  getPurchasedServers: RamCostConstants.ScriptPurchaseServerRamCost,
  write: 0,
  tryWritePort: 0,
  read: 0,
  peek: 0,
  clear: 0,
  writePort: 0,
  readPort: 0,
  getPortHandle: 0,
  rm: RamCostConstants.ScriptReadWriteRamCost,
  scriptRunning: RamCostConstants.ScriptArbScriptRamCost,
  scriptKill: RamCostConstants.ScriptArbScriptRamCost,
  getScriptName: 0,
  getScriptRam: RamCostConstants.ScriptGetScriptRamCost,
  getHackTime: RamCostConstants.ScriptGetHackTimeRamCost,
  getGrowTime: RamCostConstants.ScriptGetHackTimeRamCost,
  getWeakenTime: RamCostConstants.ScriptGetHackTimeRamCost,
  getScriptIncome: RamCostConstants.ScriptGetScriptRamCost,
  getScriptExpGain: RamCostConstants.ScriptGetScriptRamCost,
  getRunningScript: RamCostConstants.ScriptGetRunningScriptRamCost,
  nFormat: 0,
  tFormat: 0,
  getTimeSinceLastAug: RamCostConstants.ScriptGetHackTimeRamCost,
  prompt: 0,
  wget: 0,
  getFavorToDonate: RamCostConstants.ScriptGetFavorToDonate,
  getPlayer: RamCostConstants.ScriptSingularityFn1RamCost / 4,
  mv: 0,
  getOwnedSourceFiles: RamCostConstants.ScriptGetOwnedSourceFiles,
  tail: 0,
  toast: 0,
  heart: {
    // Easter egg function
    break: 0,
  },
};

export function getRamCost(player: IPlayer, ...args: string[]): number {
  if (args.length === 0) {
    console.warn(`No arguments passed to getRamCost()`);
    return 0;
  }

  let curr = RamCosts[args[0]];
  for (let i = 1; i < args.length; ++i) {
    if (curr == null) {
      console.warn(`Invalid function passed to getRamCost: ${args}`);
      return 0;
    }

    const currType = typeof curr;
    if (currType === "function" || currType === "number") {
      break;
    }

    curr = curr[args[i]];
  }

  if (typeof curr === "number") {
    return curr;
  }

  if (typeof curr === "function") {
    return curr(player);
  }

  console.warn(`Unexpected type (${curr}) for value [${args}]`);
  return 0;
}
