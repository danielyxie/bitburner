/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 300);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/*!*******************************************!*\
  !*** ./src/Netscript/RamCostGenerator.ts ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// TODO remember to update RamCalculations.js and WorkerScript.js
// RAM costs for Netscript functions
exports.RamCostConstants = {
    ScriptBaseRamCost: 1.6,
    ScriptDomRamCost: 25,
    ScriptHackRamCost: 0.1,
    ScriptHackAnalyzeRamCost: 1,
    ScriptGrowRamCost: 0.15,
    ScriptGrowthAnalyzeRamCost: 1,
    ScriptWeakenRamCost: 0.15,
    ScriptScanRamCost: 0.2,
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
    ScriptGetHackTimeRamCost: 0.05,
    ScriptGetFavorToDonate: 0.10,
    ScriptCodingContractBaseRamCost: 10,
    ScriptSleeveBaseRamCost: 4,
    ScriptSingularityFn1RamCost: 2,
    ScriptSingularityFn2RamCost: 3,
    ScriptSingularityFn3RamCost: 5,
    ScriptGangApiBaseRamCost: 4,
    ScriptBladeburnerApiBaseRamCost: 4,
};
exports.RamCosts = {
    hacknet: {
        numNodes: () => 0,
        purchaseNode: () => 0,
        getPurchaseNodeCost: () => 0,
        getNodeStats: () => 0,
        upgradeLevel: () => 0,
        upgradeRam: () => 0,
        upgradeCore: () => 0,
        upgradeCache: () => 0,
        getLevelUpgradeCost: () => 0,
        getRamUpgradeCost: () => 0,
        getCoreUpgradeCost: () => 0,
        getCacheUpgradeCost: () => 0,
        numHashes: () => 0,
        hashCost: () => 0,
        spendHashes: () => 0,
    },
    sprintf: () => 0,
    vsprintf: () => 0,
    scan: () => exports.RamCostConstants.ScriptScanRamCost,
    hack: () => exports.RamCostConstants.ScriptHackRamCost,
    hackAnalyzeThreads: () => exports.RamCostConstants.ScriptHackAnalyzeRamCost,
    hackAnalyzePercent: () => exports.RamCostConstants.ScriptHackAnalyzeRamCost,
    hackChance: () => exports.RamCostConstants.ScriptHackAnalyzeRamCost,
    sleep: () => 0,
    grow: () => exports.RamCostConstants.ScriptGrowRamCost,
    growthAnalyze: () => exports.RamCostConstants.ScriptGrowthAnalyzeRamCost,
    weaken: () => exports.RamCostConstants.ScriptWeakenRamCost,
    print: () => 0,
    tprint: () => 0,
    clearLog: () => 0,
    disableLog: () => 0,
    enableLog: () => 0,
    isLogEnabled: () => 0,
    getScriptLogs: () => 0,
    nuke: () => exports.RamCostConstants.ScriptPortProgramRamCost,
    brutessh: () => exports.RamCostConstants.ScriptPortProgramRamCost,
    ftpcrack: () => exports.RamCostConstants.ScriptPortProgramRamCost,
    relaysmtp: () => exports.RamCostConstants.ScriptPortProgramRamCost,
    httpworm: () => exports.RamCostConstants.ScriptPortProgramRamCost,
    sqlinject: () => exports.RamCostConstants.ScriptPortProgramRamCost,
    run: () => exports.RamCostConstants.ScriptRunRamCost,
    exec: () => exports.RamCostConstants.ScriptExecRamCost,
    spawn: () => exports.RamCostConstants.ScriptSpawnRamCost,
    kill: () => exports.RamCostConstants.ScriptKillRamCost,
    killall: () => exports.RamCostConstants.ScriptKillRamCost,
    exit: () => 0,
    scp: () => exports.RamCostConstants.ScriptScpRamCost,
    ls: () => exports.RamCostConstants.ScriptScanRamCost,
    ps: () => exports.RamCostConstants.ScriptScanRamCost,
    hasRootAccess: () => exports.RamCostConstants.ScriptHasRootAccessRamCost,
    getIp: () => exports.RamCostConstants.ScriptGetHostnameRamCost,
    getHostname: () => exports.RamCostConstants.ScriptGetHostnameRamCost,
    getHackingLevel: () => exports.RamCostConstants.ScriptGetHackingLevelRamCost,
    getHackingMultipliers: () => exports.RamCostConstants.ScriptGetMultipliersRamCost,
    getHacknetMultipliers: () => exports.RamCostConstants.ScriptGetMultipliersRamCost,
    getBitNodeMultipliers: () => exports.RamCostConstants.ScriptGetMultipliersRamCost,
    getServerMoneyAvailable: () => exports.RamCostConstants.ScriptGetServerRamCost,
    getServerSecurityLevel: () => exports.RamCostConstants.ScriptGetServerRamCost,
    getServerBaseSecurityLevel: () => exports.RamCostConstants.ScriptGetServerRamCost,
    getServerMinSecurityLevel: () => exports.RamCostConstants.ScriptGetServerRamCost,
    getServerRequiredHackingLevel: () => exports.RamCostConstants.ScriptGetServerRamCost,
    getServerMaxMoney: () => exports.RamCostConstants.ScriptGetServerRamCost,
    getServerGrowth: () => exports.RamCostConstants.ScriptGetServerRamCost,
    getServerNumPortsRequired: () => exports.RamCostConstants.ScriptGetServerRamCost,
    getServerRam: () => exports.RamCostConstants.ScriptGetServerRamCost,
    serverExists: () => exports.RamCostConstants.ScriptGetServerRamCost,
    fileExists: () => exports.RamCostConstants.ScriptFileExistsRamCost,
    isRunning: () => exports.RamCostConstants.ScriptIsRunningRamCost,
    getStockSymbols: () => exports.RamCostConstants.ScriptGetStockRamCost,
    getStockPrice: () => exports.RamCostConstants.ScriptGetStockRamCost,
    getStockAskPrice: () => exports.RamCostConstants.ScriptGetStockRamCost,
    getStockBidPrice: () => exports.RamCostConstants.ScriptGetStockRamCost,
    getStockPosition: () => exports.RamCostConstants.ScriptGetStockRamCost,
    getStockMaxShares: () => exports.RamCostConstants.ScriptGetStockRamCost,
    getStockPurchaseCost: () => exports.RamCostConstants.ScriptGetStockRamCost,
    getStockSaleGain: () => exports.RamCostConstants.ScriptGetStockRamCost,
    buyStock: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    sellStock: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    shortStock: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    sellShort: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    placeOrder: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    cancelOrder: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    getOrders: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    getStockVolatility: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    getStockForecast: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    purchase4SMarketData: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    purchase4SMarketDataTixApi: () => exports.RamCostConstants.ScriptBuySellStockRamCost,
    getPurchasedServerLimit: () => exports.RamCostConstants.ScriptGetPurchasedServerLimit,
    getPurchasedServerMaxRam: () => exports.RamCostConstants.ScriptGetPurchasedServerMaxRam,
    getPurchasedServerCost: () => exports.RamCostConstants.ScriptGetPurchaseServerRamCost,
    purchaseServer: () => exports.RamCostConstants.ScriptPurchaseServerRamCost,
    deleteServer: () => exports.RamCostConstants.ScriptPurchaseServerRamCost,
    getPurchasedServers: () => exports.RamCostConstants.ScriptPurchaseServerRamCost,
    write: () => exports.RamCostConstants.ScriptReadWriteRamCost,
    tryWrite: () => exports.RamCostConstants.ScriptReadWriteRamCost,
    read: () => exports.RamCostConstants.ScriptReadWriteRamCost,
    peek: () => exports.RamCostConstants.ScriptReadWriteRamCost,
    clear: () => exports.RamCostConstants.ScriptReadWriteRamCost,
    getPortHandle: () => exports.RamCostConstants.ScriptReadWriteRamCost * 10,
    rm: () => exports.RamCostConstants.ScriptReadWriteRamCost,
    scriptRunning: () => exports.RamCostConstants.ScriptArbScriptRamCost,
    scriptKill: () => exports.RamCostConstants.ScriptArbScriptRamCost,
    getScriptName: () => 0,
    getScriptRam: () => exports.RamCostConstants.ScriptGetScriptRamCost,
    getHackTime: () => exports.RamCostConstants.ScriptGetHackTimeRamCost,
    getGrowTime: () => exports.RamCostConstants.ScriptGetHackTimeRamCost,
    getWeakenTime: () => exports.RamCostConstants.ScriptGetHackTimeRamCost,
    getScriptIncome: () => exports.RamCostConstants.ScriptGetScriptRamCost,
    getScriptExpGain: () => exports.RamCostConstants.ScriptGetScriptRamCost,
    nFormat: () => 0,
    getTimeSinceLastAug: () => exports.RamCostConstants.ScriptGetHackTimeRamCost,
    prompt: () => 0,
    wget: () => 0,
    getFavorToDonate: () => exports.RamCostConstants.ScriptGetFavorToDonate,
    // Singularity Functions
    universityCourse: () => exports.RamCostConstants.ScriptSingularityFn1RamCost,
    gymWorkout: () => exports.RamCostConstants.ScriptSingularityFn1RamCost,
    travelToCity: () => exports.RamCostConstants.ScriptSingularityFn1RamCost,
    purchaseTor: () => exports.RamCostConstants.ScriptSingularityFn1RamCost,
    purchaseProgram: () => exports.RamCostConstants.ScriptSingularityFn1RamCost,
    getStats: () => exports.RamCostConstants.ScriptSingularityFn1RamCost / 4,
    getCharacterInformation: () => exports.RamCostConstants.ScriptSingularityFn1RamCost / 4,
    isBusy: () => exports.RamCostConstants.ScriptSingularityFn1RamCost / 4,
    stopAction: () => exports.RamCostConstants.ScriptSingularityFn1RamCost / 2,
    upgradeHomeRam: () => exports.RamCostConstants.ScriptSingularityFn2RamCost,
    getUpgradeHomeRamCost: () => exports.RamCostConstants.ScriptSingularityFn2RamCost / 2,
    workForCompany: () => exports.RamCostConstants.ScriptSingularityFn2RamCost,
    applyToCompany: () => exports.RamCostConstants.ScriptSingularityFn2RamCost,
    getCompanyRep: () => exports.RamCostConstants.ScriptSingularityFn2RamCost / 3,
    getCompanyFavor: () => exports.RamCostConstants.ScriptSingularityFn2RamCost / 3,
    getCompanyFavorGain: () => exports.RamCostConstants.ScriptSingularityFn2RamCost / 4,
    checkFactionInvitations: () => exports.RamCostConstants.ScriptSingularityFn2RamCost,
    joinFaction: () => exports.RamCostConstants.ScriptSingularityFn2RamCost,
    workForFaction: () => exports.RamCostConstants.ScriptSingularityFn2RamCost,
    getFactionRep: () => exports.RamCostConstants.ScriptSingularityFn2RamCost / 3,
    getFactionFavor: () => exports.RamCostConstants.ScriptSingularityFn2RamCost / 3,
    getFactionFavorGain: () => exports.RamCostConstants.ScriptSingularityFn2RamCost / 4,
    donateToFaction: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    createProgram: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    commitCrime: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    getCrimeChance: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    getOwnedAugmentations: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    getOwnedSourceFiles: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    getAugmentationsFromFaction: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    getAugmentationPrereq: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    getAugmentationCost: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    purchaseAugmentation: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    installAugmentations: () => exports.RamCostConstants.ScriptSingularityFn3RamCost,
    // Gang API
    gang: {
        getMemberNames: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 4,
        getGangInformation: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 2,
        getOtherGangInformation: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 2,
        getMemberInformation: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 2,
        canRecruitMember: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 4,
        recruitMember: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 2,
        getTaskNames: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 4,
        setMemberTask: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 2,
        getEquipmentNames: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 4,
        getEquipmentCost: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 2,
        getEquipmentType: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 2,
        purchaseEquipment: () => exports.RamCostConstants.ScriptGangApiBaseRamCost,
        ascendMember: () => exports.RamCostConstants.ScriptGangApiBaseRamCost,
        setTerritoryWarfare: () => exports.RamCostConstants.ScriptGangApiBaseRamCost / 2,
        getChanceToWinClash: () => exports.RamCostConstants.ScriptGangApiBaseRamCost,
        getBonusTime: () => 0,
    },
    // Bladeburner API
    bladeburner: {
        getContractNames: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
        getOperationNames: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
        getBlackOpNames: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
        getBlackOpRank: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost / 2,
        getGeneralActionNames: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
        getSkillNames: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost / 10,
        startAction: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        stopBladeburnerAction: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost / 2,
        getCurrentAction: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost / 4,
        getActionTime: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getActionEstimatedSuccessChance: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getActionRepGain: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getActionCountRemaining: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getActionMaxLevel: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getActionCurrentLevel: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getActionAutolevel: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        setActionAutolevel: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        setActionLevel: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getRank: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getSkillPoints: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getSkillLevel: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getSkillUpgradeCost: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        upgradeSkill: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getTeamSize: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        setTeamSize: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getCityEstimatedPopulation: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getCityEstimatedCommunities: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getCityChaos: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getCity: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        switchCity: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getStamina: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        joinBladeburnerFaction: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        joinBladeburnerDivision: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
        getBonusTime: () => exports.RamCostConstants.ScriptBladeburnerApiBaseRamCost,
    },
    // Coding Contract API
    codingcontract: {
        attempt: () => exports.RamCostConstants.ScriptCodingContractBaseRamCost,
        getContractType: () => exports.RamCostConstants.ScriptCodingContractBaseRamCost / 2,
        getData: () => exports.RamCostConstants.ScriptCodingContractBaseRamCost / 2,
        getDescription: () => exports.RamCostConstants.ScriptCodingContractBaseRamCost / 2,
        getNumTriesRemaining: () => exports.RamCostConstants.ScriptCodingContractBaseRamCost / 2,
    },
    // Duplicate Sleeve API
    sleeve: {
        getNumSleeves: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        setToShockRecovery: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        setToSynchronize: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        setToCommitCrime: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        setToUniversityCourse: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        travel: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        setToCompanyWork: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        setToFactionWork: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        setToGymWorkout: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        getSleeveStats: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        getTask: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        getInformation: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        getSleeveAugmentations: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        getSleevePurchasableAugs: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
        purchaseSleeveAug: () => exports.RamCostConstants.ScriptSleeveBaseRamCost,
    },
    heart: {
        // Easter egg function
        break: () => 0,
    }
};
function getRamCost(...args) {
    if (args.length === 0) {
        console.warn(`No arguments passed to getRamCost()`);
        return 0;
    }
    let curr = exports.RamCosts[args[0]];
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
    const currType = typeof curr;
    if (currType === "function") {
        return curr();
    }
    if (currType === "number") {
        return curr;
    }
    console.warn(`Expected type: ${currType}`);
    return 0;
}
exports.getRamCost = getRamCost;


/***/ }),

/***/ 15:
/*!***************************************!*\
  !*** ./utils/helpers/getRandomInt.ts ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Gets a random integer bounded by the values passed in.
 * @param min The minimum value in the range.
 * @param max The maximum value in the range.
 */
function getRandomInt(min, max) {
    const lower = Math.min(min, max);
    const upper = Math.max(min, max);
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
exports.getRandomInt = getRandomInt;


/***/ }),

/***/ 16:
/*!******************************!*\
  !*** ./utils/JSONReviver.js ***!
  \******************************/
/*! exports provided: Reviver, Generic_toJSON, Generic_fromJSON */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Reviver", function() { return Reviver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Generic_toJSON", function() { return Generic_toJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Generic_fromJSON", function() { return Generic_fromJSON; });
/* Generic Reviver, toJSON, and fromJSON functions used for saving and loading objects */

// A generic "smart reviver" function.
// Looks for object values with a `ctor` property and
// a `data` property. If it finds them, and finds a matching
// constructor that has a `fromJSON` property on it, it hands
// off to that `fromJSON` fuunction, passing in the value.
function Reviver(key, value) {
	var ctor;
    if (value == null) {
        console.log("Reviver WRONGLY called with key: " + key + ", and value: " + value);
        return 0;
    }

	if (typeof value === "object" &&
		typeof value.ctor === "string" &&
		typeof value.data !== "undefined") {
			// Compatibility for version v0.43.1
			// TODO Remove this eventually
			if (value.ctor === "AllServersMap") {
				console.log('Converting AllServersMap for v0.43.1');
				return value.data;
			}

			ctor = Reviver.constructors[value.ctor] || window[value.ctor];

			if (typeof ctor === "function" &&
				typeof ctor.fromJSON === "function") {

					return ctor.fromJSON(value);
			}
	}
	return value;
}
Reviver.constructors = {}; // A list of constructors the smart reviver should know about

// A generic "toJSON" function that creates the data expected
// by Reviver.
// `ctorName`  The name of the constructor to use to revive it
// `obj`       The object being serialized
// `keys`      (Optional) Array of the properties to serialize,
//             if not given then all of the objects "own" properties
//             that don't have function values will be serialized.
//             (Note: If you list a property in `keys`, it will be serialized
//             regardless of whether it's an "own" property.)
// Returns:    The structure (which will then be turned into a string
//             as part of the JSON.stringify algorithm)
function Generic_toJSON(ctorName, obj, keys) {
  var data, index, key;

  if (!keys) {
    keys = Object.keys(obj); // Only "own" properties are included
  }

  data = {};
  for (let index = 0; index < keys.length; ++index) {
    key = keys[index];
    data[key] = obj[key];
  }
  return {ctor: ctorName, data: data};
}

// A generic "fromJSON" function for use with Reviver: Just calls the
// constructor function with no arguments, then applies all of the
// key/value pairs from the raw data to the instance. Only useful for
// constructors that can be reasonably called without arguments!
// `ctor`      The constructor to call
// `data`      The data to apply
// Returns:    The object
function Generic_fromJSON(ctor, data) {
  var obj, name;

  obj = new ctor();
  for (name in data) {
    obj[name] = data[name];
  }
  return obj;
}




/***/ }),

/***/ 205:
/*!**********************************!*\
  !*** ./test/StockMarketTests.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _src_Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/Constants */ 8);
/* harmony import */ var _src_Constants__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_Constants__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_StockMarket_Order__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/StockMarket/Order */ 98);
/* harmony import */ var _src_StockMarket_Order__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_src_StockMarket_Order__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _src_StockMarket_Stock__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/StockMarket/Stock */ 66);
/* harmony import */ var _src_StockMarket_Stock__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_src_StockMarket_Stock__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/StockMarket/StockMarketHelpers */ 27);
/* harmony import */ var _src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _src_StockMarket_data_OrderTypes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/StockMarket/data/OrderTypes */ 54);
/* harmony import */ var _src_StockMarket_data_OrderTypes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_src_StockMarket_data_OrderTypes__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/StockMarket/data/PositionTypes */ 23);
/* harmony import */ var _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__);


//import { processOrders } from "../src/StockMarket/OrderProcessing";

/*
import {
    deleteStockMarket,
    initStockMarket,
    initSymbolToStockMap,
    loadStockMarket,
    StockMarket,
    SymbolToStockMap,
} from "../src/StockMarket/StockMarket";
*/




const assert = chai.assert;
const expect = chai.expect;

console.log("Beginning Stock Market Tests");

describe("Stock Market Tests", function() {
    const commission = _src_Constants__WEBPACK_IMPORTED_MODULE_0__["CONSTANTS"].StockMarketCommission;

    // Generic Stock object that can be used by each test
    let stock;
    const ctorParams = {
        b: true,
        initPrice: 10e3,
        marketCap: 5e9,
        mv: 1,
        name: "MockStock",
        otlkMag: 10,
        spreadPerc: 1,
        shareTxForMovement: 5e3,
        symbol: "mock",
    };

    beforeEach(function() {
        function construct() {
            stock = new _src_StockMarket_Stock__WEBPACK_IMPORTED_MODULE_2__["Stock"](ctorParams);
        }

        expect(construct).to.not.throw();
    });

    describe("Stock Class", function() {
        describe("constructor", function() {
            it("should have default parameters", function() {
                let defaultStock;
                function construct() {
                    defaultStock = new _src_StockMarket_Stock__WEBPACK_IMPORTED_MODULE_2__["Stock"]();
                }

                expect(construct).to.not.throw();
                expect(defaultStock.name).to.equal("");
            });

            it("should properly initialize props from parameters", function() {
                expect(stock.name).to.equal(ctorParams.name);
                expect(stock.symbol).to.equal(ctorParams.symbol);
                expect(stock.price).to.equal(ctorParams.initPrice);
                expect(stock.lastPrice).to.equal(ctorParams.initPrice);
                expect(stock.b).to.equal(ctorParams.b);
                expect(stock.mv).to.equal(ctorParams.mv);
                expect(stock.shareTxForMovement).to.equal(ctorParams.shareTxForMovement);
                expect(stock.shareTxUntilMovement).to.equal(ctorParams.shareTxForMovement);
                expect(stock.maxShares).to.be.below(stock.totalShares);
                expect(stock.spreadPerc).to.equal(ctorParams.spreadPerc);
                expect(stock.priceMovementPerc).to.be.a("number");
                expect(stock.priceMovementPerc).to.be.at.most(stock.spreadPerc);
                expect(stock.priceMovementPerc).to.be.at.least(0);
            });

            it ("should properly initialize props from range-values", function() {
                let stock;
                const params = {
                    b: true,
                    initPrice: {
                        max: 10e3,
                        min: 1e3,
                    },
                    marketCap: 5e9,
                    mv: {
                        divisor: 100,
                        max: 150,
                        min: 50,
                    },
                    name: "MockStock",
                    otlkMag: 10,
                    spreadPerc: {
                        divisor: 10,
                        max: 10,
                        min: 1,
                    },
                    shareTxForMovement: {
                        max: 10e3,
                        min: 5e3,
                    },
                    symbol: "mock",
                };

                function construct() {
                    stock = new _src_StockMarket_Stock__WEBPACK_IMPORTED_MODULE_2__["Stock"](params);
                }

                expect(construct).to.not.throw();
                expect(stock.price).to.be.within(params.initPrice.min, params.initPrice.max);
                expect(stock.mv).to.be.within(params.mv.min / params.mv.divisor, params.mv.max / params.mv.divisor);
                expect(stock.spreadPerc).to.be.within(params.spreadPerc.min / params.spreadPerc.divisor, params.spreadPerc.max / params.spreadPerc.divisor);
                expect(stock.shareTxForMovement).to.be.within(params.shareTxForMovement.min, params.shareTxForMovement.max);
            });

            it("should round the 'totalShare' prop to the nearest 100k", function() {
                expect(stock.totalShares % 100e3).to.equal(0);
            });
        });

        describe("#changePrice()", function() {
            it("should set both the last price and current price properties", function() {
                const newPrice = 20e3;
                stock.changePrice(newPrice);
                expect(stock.lastPrice).to.equal(ctorParams.initPrice);
                expect(stock.price).to.equal(newPrice);
            });
        });

        describe("#getAskPrice()", function() {
            it("should return the price increased by spread percentage", function() {
                const perc = stock.spreadPerc / 100;
                expect(perc).to.be.at.most(1);
                expect(perc).to.be.at.least(0);

                const expected = stock.price * (1 + perc);
                expect(stock.getAskPrice()).to.equal(expected);
            });
        });

        describe("#getBidPrice()", function() {
            it("should return the price decreased by spread percentage", function() {
                const perc = stock.spreadPerc / 100;
                expect(perc).to.be.at.most(1);
                expect(perc).to.be.at.least(0);

                const expected = stock.price * (1 - perc);
                expect(stock.getBidPrice()).to.equal(expected);
            });
        });
    });

    /*
    // TODO These tests fail due to circular dependency errors
    describe("StockMarket object", function() {
        describe("Initialization", function() {
            // Keeps track of initialized stocks. Contains their symbols
            const stocks = [];

            before(function() {
                expect(initStockMarket).to.not.throw();
                expect(initSymbolToStockMap).to.not.throw();
            });

            it("should have Stock objects", function() {
                for (const prop in StockMarket) {
                    const stock = StockMarket[prop];
                    if (stock instanceof Stock) {
                        stocks.push(stock.symbol);
                    }
                }

                // We'll just check that there are some stocks
                expect(stocks.length).to.be.at.least(1);
            });

            it("should have an order book in the 'Orders' property", function() {
                expect(StockMarket).to.have.property("Orders");

                const orderbook = StockMarket["Orders"];
                for (const symbol of stocks) {
                    const ordersForStock = orderbook[symbol];
                    expect(ordersForStock).to.be.an("array");
                    expect(ordersForStock.length).to.equal(0);
                }
            });

            it("should have properties for managing game cycles", function() {
                expect(StockMarket).to.have.property("storedCycles");
                expect(StockMarket).to.have.property("lastUpdate");
            });
        });

        // Because 'StockMarket' is a global object, the effects of initialization from
        // the block above should still stand
        describe("Deletion", function() {
            it("should set StockMarket to be an empty object", function() {
                expect(StockMarket).to.be.an("object").that.is.not.empty;
                deleteStockMarket();
                expect(StockMarket).to.be.an("object").that.is.empty;
            });
        });

        // Reset stock market for each test
        beforeEach(function() {
            deleteStockMarket();
            initStockMarket();
            initSymbolToStockMap();
        });

        it("should properly initialize", function() {

        });
    });
    */

    describe("Transaction Cost Calculator Functions", function() {
        describe("getBuyTransactionCost()", function() {
            it("should fail on invalid 'stock' argument", function() {
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getBuyTransactionCost"])({}, 10, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(res).to.equal(null);
            });

            it("should fail on invalid 'shares' arg", function() {
                let res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getBuyTransactionCost"])(stock, NaN, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(res).to.equal(null);

                res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getBuyTransactionCost"])(stock, -1, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(res).to.equal(null);
            });

            it("should properly evaluate LONG transactions that doesn't trigger a price movement", function() {
                const shares = ctorParams.shareTxForMovement / 2;
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getBuyTransactionCost"])(stock, shares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(res).to.equal(shares * stock.getAskPrice() + commission);
            });

            it("should properly evaluate SHORT transactions that doesn't trigger a price movement", function() {
                const shares = ctorParams.shareTxForMovement / 2;
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getBuyTransactionCost"])(stock, shares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(res).to.equal(shares * stock.getBidPrice() + commission);
            });

            it("should properly evaluate LONG transactions that trigger price movements", function() {
                const sharesPerMvmt = ctorParams.shareTxForMovement;
                const shares = sharesPerMvmt * 3;
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getBuyTransactionCost"])(stock, shares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);

                // Calculate expected cost
                const secondPrice = stock.getAskPrice() * Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["calculateIncreasingPriceMovement"])(stock);
                const thirdPrice = secondPrice * Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["calculateIncreasingPriceMovement"])(stock);
                let expected = (sharesPerMvmt * stock.getAskPrice()) + (sharesPerMvmt * secondPrice) + (sharesPerMvmt * thirdPrice);

                expect(res).to.equal(expected + commission);
            });

            it("should properly evaluate SHORT transactions that trigger price movements", function() {
                const sharesPerMvmt = ctorParams.shareTxForMovement;
                const shares = sharesPerMvmt * 3;
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getBuyTransactionCost"])(stock, shares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);

                // Calculate expected cost
                const secondPrice = stock.getBidPrice() * Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["calculateDecreasingPriceMovement"])(stock);
                const thirdPrice = secondPrice * Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["calculateDecreasingPriceMovement"])(stock);
                let expected = (sharesPerMvmt * stock.getBidPrice()) + (sharesPerMvmt * secondPrice) + (sharesPerMvmt * thirdPrice);

                expect(res).to.equal(expected + commission);
            });

            it("should cap the 'shares' argument at the stock's maximum number of shares", function() {
                const maxRes = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getBuyTransactionCost"])(stock, stock.maxShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                const exceedRes = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getBuyTransactionCost"])(stock, stock.maxShares * 10, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(maxRes).to.equal(exceedRes);
            });
        });

        describe("getSellTransactionGain()", function() {
            it("should fail on invalid 'stock' argument", function() {
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getSellTransactionGain"])({}, 10, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(res).to.equal(null);
            });

            it("should fail on invalid 'shares' arg", function() {
                let res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getSellTransactionGain"])(stock, NaN, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(res).to.equal(null);

                res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getSellTransactionGain"])(stock, -1, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(res).to.equal(null);
            });

            it("should properly evaluate LONG transactions that doesn't trigger a price movement", function() {
                const shares = ctorParams.shareTxForMovement / 2;
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getSellTransactionGain"])(stock, shares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                const expected = shares * stock.getBidPrice() - commission;
                expect(res).to.equal(expected);
            });

            it("should properly evaluate SHORT transactions that doesn't trigger a price movement", function() {
                // We need to set this property in order to calculate gains from short position
                stock.playerAvgShortPx = stock.price * 2;

                const shares = ctorParams.shareTxForMovement / 2;
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getSellTransactionGain"])(stock, shares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                const expected = (shares * stock.playerAvgShortPx) + (shares * (stock.playerAvgShortPx - stock.getAskPrice())) - commission;
                expect(res).to.equal(expected);
            });

            it("should properly evaluate LONG transactions that trigger price movements", function() {
                const sharesPerMvmt = ctorParams.shareTxForMovement;
                const shares = sharesPerMvmt * 3;
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getSellTransactionGain"])(stock, shares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);

                // Calculated expected gain
                const mvmt = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["calculateDecreasingPriceMovement"])(stock);
                const secondPrice = stock.getBidPrice() * mvmt;
                const thirdPrice = secondPrice * mvmt;
                const expected = (sharesPerMvmt * stock.getBidPrice()) + (sharesPerMvmt * secondPrice) + (sharesPerMvmt * thirdPrice);

                expect(res).to.equal(expected - commission);
            });

            it("should properly evaluate SHORT transactions that trigger price movements", function() {
                // We need to set this property in order to calculate gains from short position
                stock.playerAvgShortPx = stock.price * 2;

                const sharesPerMvmt = ctorParams.shareTxForMovement;
                const shares = sharesPerMvmt * 3;
                const res = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getSellTransactionGain"])(stock, shares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);

                // Calculate expected gain
                const mvmt = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["calculateIncreasingPriceMovement"])(stock);
                const secondPrice = stock.getAskPrice() * mvmt;
                const thirdPrice = secondPrice * mvmt;
                function getGainForPrice(thisPrice) {
                    const origCost = sharesPerMvmt * stock.playerAvgShortPx;
                    return origCost + ((stock.playerAvgShortPx - thisPrice) * sharesPerMvmt);
                }
                const expected = getGainForPrice(stock.getAskPrice()) + getGainForPrice(secondPrice) + getGainForPrice(thirdPrice);

                expect(res).to.equal(expected - commission);
            });

            it("should cap the 'shares' argument at the stock's maximum number of shares", function() {
                const maxRes = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getSellTransactionGain"])(stock, stock.maxShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                const exceedRes = Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["getSellTransactionGain"])(stock, stock.maxShares * 10, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(maxRes).to.equal(exceedRes);
            });
        });
    });

    describe("Price Movement Processor Functions", function() {
        // N = 1 is the original price
        function getNthPriceIncreasing(origPrice, n) {
            let price = origPrice;
            for (let i = 1; i < n; ++i) {
                price *= Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["calculateIncreasingPriceMovement"])(stock);
            }

            return price;
        }

        // N = 1 is the original price
        function getNthPriceDecreasing(origPrice, n) {
            let price = origPrice;
            for (let i = 1; i < n; ++i) {
                price *= Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["calculateDecreasingPriceMovement"])(stock);
            }

            return price;
        }

        // N = 1 is the original forecast
        function getNthForecast(origForecast, n) {
            return origForecast - _src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["forecastChangePerPriceMovement"] * (n - 1);
        }

        describe("processBuyTransactionPriceMovement()", function() {
            const noMvmtShares = Math.round(ctorParams.shareTxForMovement / 2.2);
            const mvmtShares = ctorParams.shareTxForMovement * 3 + noMvmtShares;

            it("should do nothing on invalid 'stock' argument", function() {
                const oldPrice = stock.price;
                const oldTracker = stock.shareTxUntilMovement;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])({}, mvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should do nothing on invalid 'shares' arg", function() {
                const oldPrice = stock.price;
                const oldTracker = stock.shareTxUntilMovement;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, NaN, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, -1, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should properly evaluate a LONG transaction that doesn't trigger a price movement", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, noMvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.otlkMag).to.equal(oldForecast);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate a SHORT transaction that doesn't trigger a price movement", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, noMvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.otlkMag).to.equal(oldForecast);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions that trigger price movements", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, mvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(getNthPriceIncreasing(oldPrice, 4));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate SHORT transactions that trigger price movements", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, mvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(getNthPriceDecreasing(oldPrice, 4));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions of exactly 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, stock.shareTxForMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(getNthPriceIncreasing(oldPrice, 2));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate LONG transactions that total to 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, Math.round(stock.shareTxForMovement / 2), _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, stock.shareTxUntilMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(getNthPriceIncreasing(oldPrice, 2));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate LONG transactions that are a multiple of 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, 3 * stock.shareTxForMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(getNthPriceIncreasing(oldPrice, 4));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions of exactly 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, stock.shareTxForMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(getNthPriceDecreasing(oldPrice, 2));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions that total to 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, Math.round(stock.shareTxForMovement / 2), _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, stock.shareTxUntilMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(getNthPriceDecreasing(oldPrice, 2));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions that are a multiple of 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processBuyTransactionPriceMovement"])(stock, 3 * stock.shareTxForMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(getNthPriceDecreasing(oldPrice, 4));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });
        });

        describe("processSellTransactionPriceMovement()", function() {
            const noMvmtShares = Math.round(ctorParams.shareTxForMovement / 2.2);
            const mvmtShares = ctorParams.shareTxForMovement * 3 + noMvmtShares;

            it("should do nothing on invalid 'stock' argument", function() {
                const oldPrice = stock.price;
                const oldTracker = stock.shareTxUntilMovement;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])({}, mvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should do nothing on invalid 'shares' arg", function() {
                const oldPrice = stock.price;
                const oldTracker = stock.shareTxUntilMovement;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, NaN, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, -1, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should properly evaluate a LONG transaction that doesn't trigger a price movement", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, noMvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.otlkMag).to.equal(oldForecast);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate a SHORT transaction that doesn't trigger a price movement", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, noMvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.otlkMag).to.equal(oldForecast);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions that trigger price movements", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, mvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(getNthPriceDecreasing(oldPrice, 4));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate SHORT transactions that trigger price movements", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, mvmtShares, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(getNthPriceIncreasing(oldPrice, 4));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions of exactly 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, stock.shareTxForMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(getNthPriceDecreasing(oldPrice, 2));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate LONG transactions that total to 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, Math.round(stock.shareTxForMovement / 2), _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, stock.shareTxUntilMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(getNthPriceDecreasing(oldPrice, 2));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate LONG transactions that are a multiple of 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, 3 * stock.shareTxForMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
                expect(stock.price).to.equal(getNthPriceDecreasing(oldPrice, 4));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions of exactly 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, stock.shareTxForMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(getNthPriceIncreasing(oldPrice, 2));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions that total to 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, Math.round(stock.shareTxForMovement / 2), _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, stock.shareTxUntilMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(getNthPriceIncreasing(oldPrice, 2));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions that are a multiple of 'shareTxForMovement' shares", function() {
                const oldPrice = stock.price;
                const oldForecast = stock.otlkMag;

                Object(_src_StockMarket_StockMarketHelpers__WEBPACK_IMPORTED_MODULE_3__["processSellTransactionPriceMovement"])(stock, 3 * stock.shareTxForMovement, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
                expect(stock.price).to.equal(getNthPriceIncreasing(oldPrice, 4));
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });
        });
    });

    describe("Order Class", function() {
        it("should throw on invalid arguments", function() {
            function invalid1() {
                return new _src_StockMarket_Order__WEBPACK_IMPORTED_MODULE_1__["Order"]({}, 1, 1, _src_StockMarket_data_OrderTypes__WEBPACK_IMPORTED_MODULE_4__["OrderTypes"].LimitBuy, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Long);
            }
            function invalid2() {
                return new _src_StockMarket_Order__WEBPACK_IMPORTED_MODULE_1__["Order"]("FOO", "z", 0, _src_StockMarket_data_OrderTypes__WEBPACK_IMPORTED_MODULE_4__["OrderTypes"].LimitBuy, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
            }
            function invalid3() {
                return new _src_StockMarket_Order__WEBPACK_IMPORTED_MODULE_1__["Order"]("FOO", 1, {}, _src_StockMarket_data_OrderTypes__WEBPACK_IMPORTED_MODULE_4__["OrderTypes"].LimitBuy, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
            }
            function invalid4() {
                return new _src_StockMarket_Order__WEBPACK_IMPORTED_MODULE_1__["Order"]("FOO", 1, NaN, _src_StockMarket_data_OrderTypes__WEBPACK_IMPORTED_MODULE_4__["OrderTypes"].LimitBuy, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
            }
            function invalid5() {
                return new _src_StockMarket_Order__WEBPACK_IMPORTED_MODULE_1__["Order"]("FOO", NaN, 0, _src_StockMarket_data_OrderTypes__WEBPACK_IMPORTED_MODULE_4__["OrderTypes"].LimitBuy, _src_StockMarket_data_PositionTypes__WEBPACK_IMPORTED_MODULE_5__["PositionTypes"].Short);
            }

            expect(invalid1).to.throw();
            expect(invalid2).to.throw();
            expect(invalid3).to.throw();
            expect(invalid4).to.throw();
            expect(invalid5).to.throw();
        });
    });

    describe("Order Processing", function() {

    });
});


/***/ }),

/***/ 206:
/*!*****************************************************!*\
  !*** ./test/Netscript/StaticRamCalculationTests.js ***!
  \*****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _src_Netscript_RamCostGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/Netscript/RamCostGenerator */ 10);
/* harmony import */ var _src_Netscript_RamCostGenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_Netscript_RamCostGenerator__WEBPACK_IMPORTED_MODULE_0__);
/**
 * TODO This should also test the calcualteRamUsage() function from
 * /Script/RamCalculations but there's some issues with getting tests to run
 * when any npm package is included in the build (/Script/RamCalculations includes
 * walk from acorn).
 */

//import { calculateRamUsage } from "../../src/Script/RamCalculations"

const assert = chai.assert;
const expect = chai.expect;

console.log("Beginning Netscript Static RAM Calculation/Generation Tests");

describe("Netscript Static RAM Calculation/Generation Tests", function() {
    it("should run", function() {
        expect(1).to.equal(1);
    });
});


/***/ }),

/***/ 23:
/*!***********************************************!*\
  !*** ./src/StockMarket/data/PositionTypes.ts ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PositionTypes;
(function (PositionTypes) {
    PositionTypes["Long"] = "L";
    PositionTypes["Short"] = "S";
})(PositionTypes = exports.PositionTypes || (exports.PositionTypes = {}));


/***/ }),

/***/ 27:
/*!***********************************************!*\
  !*** ./src/StockMarket/StockMarketHelpers.ts ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Stock_1 = __webpack_require__(/*! ./Stock */ 66);
const PositionTypes_1 = __webpack_require__(/*! ./data/PositionTypes */ 23);
const Constants_1 = __webpack_require__(/*! ../Constants */ 8);
// Amount by which a stock's forecast changes during each price movement
exports.forecastChangePerPriceMovement = 0.1;
/**
 * Given a stock, calculates the amount by which the stock price is multiplied
 * for an 'upward' price movement. This does not actually increase the stock's price,
 * just calculates the multiplier
 * @param {Stock} stock - Stock for price movement
 * @returns {number | null} Number by which stock's price should be multiplied. Null for invalid args
 */
function calculateIncreasingPriceMovement(stock) {
    if (!(stock instanceof Stock_1.Stock)) {
        return null;
    }
    return (1 + (stock.priceMovementPerc / 100));
}
exports.calculateIncreasingPriceMovement = calculateIncreasingPriceMovement;
/**
 * Given a stock, calculates the amount by which the stock price is multiplied
 * for a "downward" price movement. This does not actually increase the stock's price,
 * just calculates the multiplier
 * @param {Stock} stock - Stock for price movement
 * @returns {number | null} Number by which stock's price should be multiplied. Null for invalid args
 */
function calculateDecreasingPriceMovement(stock) {
    if (!(stock instanceof Stock_1.Stock)) {
        return null;
    }
    return (1 - (stock.priceMovementPerc / 100));
}
exports.calculateDecreasingPriceMovement = calculateDecreasingPriceMovement;
/**
 * Calculate the total cost of a "buy" transaction. This accounts for spread,
 * price movements, and commission.
 * @param {Stock} stock - Stock being purchased
 * @param {number} shares - Number of shares being transacted
 * @param {PositionTypes} posType - Long or short position
 * @returns {number | null} Total transaction cost. Returns null for an invalid transaction
 */
function getBuyTransactionCost(stock, shares, posType) {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock_1.Stock)) {
        return null;
    }
    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);
    const isLong = (posType === PositionTypes_1.PositionTypes.Long);
    // If the number of shares doesn't trigger a price movement, its a simple calculation
    if (shares <= stock.shareTxUntilMovement) {
        if (isLong) {
            return (shares * stock.getAskPrice()) + Constants_1.CONSTANTS.StockMarketCommission;
        }
        else {
            return (shares * stock.getBidPrice()) + Constants_1.CONSTANTS.StockMarketCommission;
        }
    }
    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - stock.shareTxUntilMovement;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);
    // The initial cost calculation takes care of the first "iteration"
    let currPrice = isLong ? stock.getAskPrice() : stock.getBidPrice();
    let totalCost = (stock.shareTxUntilMovement * currPrice);
    const increasingMvmt = calculateIncreasingPriceMovement(stock);
    const decreasingMvmt = calculateDecreasingPriceMovement(stock);
    function processPriceMovement() {
        if (isLong) {
            currPrice *= increasingMvmt;
        }
        else {
            currPrice *= decreasingMvmt;
        }
    }
    for (let i = 1; i < numIterations; ++i) {
        processPriceMovement();
        const amt = Math.min(stock.shareTxForMovement, remainingShares);
        totalCost += (amt * currPrice);
        remainingShares -= amt;
    }
    return totalCost + Constants_1.CONSTANTS.StockMarketCommission;
}
exports.getBuyTransactionCost = getBuyTransactionCost;
/**
 * Processes a buy transaction's resulting price AND forecast movement.
 * @param {Stock} stock - Stock being purchased
 * @param {number} shares - Number of shares being transacted
 * @param {PositionTypes} posType - Long or short position
 */
function processBuyTransactionPriceMovement(stock, shares, posType) {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock_1.Stock)) {
        return;
    }
    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);
    const isLong = (posType === PositionTypes_1.PositionTypes.Long);
    let currPrice = stock.price;
    function processPriceMovement() {
        if (isLong) {
            currPrice *= calculateIncreasingPriceMovement(stock);
        }
        else {
            currPrice *= calculateDecreasingPriceMovement(stock);
        }
    }
    // No price/forecast movement
    if (shares <= stock.shareTxUntilMovement) {
        stock.shareTxUntilMovement -= shares;
        if (stock.shareTxUntilMovement <= 0) {
            stock.shareTxUntilMovement = stock.shareTxForMovement;
            processPriceMovement();
            stock.changePrice(currPrice);
            stock.otlkMag -= (exports.forecastChangePerPriceMovement);
        }
        return;
    }
    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - stock.shareTxUntilMovement;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);
    for (let i = 1; i < numIterations; ++i) {
        processPriceMovement();
    }
    stock.shareTxUntilMovement = stock.shareTxForMovement - ((shares - stock.shareTxUntilMovement) % stock.shareTxForMovement);
    if (stock.shareTxUntilMovement === stock.shareTxForMovement || stock.shareTxUntilMovement <= 0) {
        // The shareTxUntilMovement ended up at 0 at the end of the "processing"
        ++numIterations;
        stock.shareTxUntilMovement = stock.shareTxForMovement;
        processPriceMovement();
    }
    stock.changePrice(currPrice);
    // Forecast always decreases in magnitude
    const forecastChange = Math.min(5, exports.forecastChangePerPriceMovement * (numIterations - 1));
    stock.otlkMag -= forecastChange;
    if (stock.otlkMag < 0) {
        stock.b = !stock.b;
        stock.otlkMag = Math.abs(stock.otlkMag);
    }
}
exports.processBuyTransactionPriceMovement = processBuyTransactionPriceMovement;
/**
 * Calculate the TOTAL amount of money gained from a sale (NOT net profit). This accounts
 * for spread, price movements, and commission.
 * @param {Stock} stock - Stock being sold
 * @param {number} shares - Number of sharse being transacted
 * @param {PositionTypes} posType - Long or short position
 * @returns {number | null} Amount of money gained from transaction. Returns null for an invalid transaction
 */
function getSellTransactionGain(stock, shares, posType) {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock_1.Stock)) {
        return null;
    }
    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);
    const isLong = (posType === PositionTypes_1.PositionTypes.Long);
    // If the number of shares doesn't trigger a price mvoement, its a simple calculation
    if (shares <= stock.shareTxUntilMovement) {
        if (isLong) {
            return (shares * stock.getBidPrice()) - Constants_1.CONSTANTS.StockMarketCommission;
        }
        else {
            // Calculating gains for a short position requires calculating the profit made
            const origCost = shares * stock.playerAvgShortPx;
            const profit = ((stock.playerAvgShortPx - stock.getAskPrice()) * shares) - Constants_1.CONSTANTS.StockMarketCommission;
            return origCost + profit;
        }
    }
    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - stock.shareTxUntilMovement;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);
    // Helper function to calculate gain for a single iteration
    function calculateGain(thisPrice, thisShares) {
        if (isLong) {
            return thisShares * thisPrice;
        }
        else {
            const origCost = thisShares * stock.playerAvgShortPx;
            const profit = ((stock.playerAvgShortPx - thisPrice) * thisShares);
            return origCost + profit;
        }
    }
    // The initial cost calculation takes care of the first "iteration"
    let currPrice = isLong ? stock.getBidPrice() : stock.getAskPrice();
    let totalGain = calculateGain(currPrice, stock.shareTxUntilMovement);
    for (let i = 1; i < numIterations; ++i) {
        // Price movement
        if (isLong) {
            currPrice *= calculateDecreasingPriceMovement(stock);
        }
        else {
            currPrice *= calculateIncreasingPriceMovement(stock);
        }
        const amt = Math.min(stock.shareTxForMovement, remainingShares);
        totalGain += calculateGain(currPrice, amt);
        remainingShares -= amt;
    }
    return totalGain - Constants_1.CONSTANTS.StockMarketCommission;
}
exports.getSellTransactionGain = getSellTransactionGain;
/**
 * Processes a sell transaction's resulting price movement
 * @param {Stock} stock - Stock being sold
 * @param {number} shares - Number of sharse being transacted
 * @param {PositionTypes} posType - Long or short position
 */
function processSellTransactionPriceMovement(stock, shares, posType) {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock_1.Stock)) {
        return;
    }
    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);
    const isLong = (posType === PositionTypes_1.PositionTypes.Long);
    let currPrice = stock.price;
    function processPriceMovement() {
        if (isLong) {
            currPrice *= calculateDecreasingPriceMovement(stock);
        }
        else {
            currPrice *= calculateIncreasingPriceMovement(stock);
        }
    }
    // No price/forecast movement
    if (shares <= stock.shareTxUntilMovement) {
        stock.shareTxUntilMovement -= shares;
        if (stock.shareTxUntilMovement <= 0) {
            stock.shareTxUntilMovement = stock.shareTxForMovement;
            processPriceMovement();
            stock.changePrice(currPrice);
            stock.otlkMag -= (exports.forecastChangePerPriceMovement);
        }
        return;
    }
    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - stock.shareTxUntilMovement;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);
    for (let i = 1; i < numIterations; ++i) {
        processPriceMovement();
    }
    stock.shareTxUntilMovement = stock.shareTxForMovement - ((shares - stock.shareTxUntilMovement) % stock.shareTxForMovement);
    if (stock.shareTxUntilMovement === stock.shareTxForMovement || stock.shareTxUntilMovement <= 0) {
        ++numIterations;
        stock.shareTxUntilMovement = stock.shareTxForMovement;
        processPriceMovement();
    }
    stock.changePrice(currPrice);
    // Forecast always decreases in magnitude
    const forecastChange = Math.min(5, exports.forecastChangePerPriceMovement * (numIterations - 1));
    stock.otlkMag -= forecastChange;
    if (stock.otlkMag < 0) {
        stock.b = !stock.b;
        stock.otlkMag = Math.abs(stock.otlkMag);
    }
}
exports.processSellTransactionPriceMovement = processSellTransactionPriceMovement;
/**
 * Calculate the maximum number of shares of a stock that can be purchased.
 * Handles mid-transaction price movements, both L and S positions, etc.
 * Used for the "Buy Max" button in the UI
 * @param {Stock} stock - Stock being purchased
 * @param {PositionTypes} posType - Long or short position
 * @param {number} money - Amount of money player has
 * @returns maximum number of shares that the player can purchase
 */
function calculateBuyMaxAmount(stock, posType, money) {
    if (!(stock instanceof Stock_1.Stock)) {
        return 0;
    }
    const isLong = (posType === PositionTypes_1.PositionTypes.Long);
    const increasingMvmt = calculateIncreasingPriceMovement(stock);
    const decreasingMvmt = calculateDecreasingPriceMovement(stock);
    if (increasingMvmt == null || decreasingMvmt == null) {
        return 0;
    }
    let remainingMoney = money - Constants_1.CONSTANTS.StockMarketCommission;
    let currPrice = isLong ? stock.getAskPrice() : stock.getBidPrice();
    // No price movement
    const firstIterationCost = stock.shareTxUntilMovement * currPrice;
    if (remainingMoney < firstIterationCost) {
        return Math.floor(remainingMoney / currPrice);
    }
    // We'll avoid any accidental infinite loops by having a hardcoded maximum number of
    // iterations
    let numShares = stock.shareTxUntilMovement;
    remainingMoney -= firstIterationCost;
    for (let i = 0; i < 10e3; ++i) {
        if (isLong) {
            currPrice *= increasingMvmt;
        }
        else {
            currPrice *= decreasingMvmt;
        }
        const affordableShares = Math.floor(remainingMoney / currPrice);
        const actualShares = Math.min(stock.shareTxForMovement, affordableShares);
        // Can't afford any more, so we're done
        if (actualShares <= 0) {
            break;
        }
        numShares += actualShares;
        let cost = actualShares * currPrice;
        remainingMoney -= cost;
        if (remainingMoney <= 0) {
            break;
        }
    }
    return Math.floor(numShares);
}
exports.calculateBuyMaxAmount = calculateBuyMaxAmount;


/***/ }),

/***/ 300:
/*!***********************!*\
  !*** ./test/index.js ***!
  \***********************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Netscript_StaticRamCalculationTests__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Netscript/StaticRamCalculationTests */ 206);
/* harmony import */ var _StockMarketTests__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StockMarketTests */ 205);




/***/ }),

/***/ 54:
/*!********************************************!*\
  !*** ./src/StockMarket/data/OrderTypes.ts ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OrderTypes;
(function (OrderTypes) {
    OrderTypes["LimitBuy"] = "Limit Buy Order";
    OrderTypes["LimitSell"] = "Limit Sell Order";
    OrderTypes["StopBuy"] = "Stop Buy Order";
    OrderTypes["StopSell"] = "Stop Sell Order";
})(OrderTypes = exports.OrderTypes || (exports.OrderTypes = {}));


/***/ }),

/***/ 66:
/*!**********************************!*\
  !*** ./src/StockMarket/Stock.ts ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const JSONReviver_1 = __webpack_require__(/*! ../../utils/JSONReviver */ 16);
const getRandomInt_1 = __webpack_require__(/*! ../../utils/helpers/getRandomInt */ 15);
const defaultConstructorParams = {
    b: true,
    initPrice: 10e3,
    marketCap: 1e12,
    mv: 1,
    name: "",
    otlkMag: 0,
    spreadPerc: 0,
    shareTxForMovement: 1e6,
    symbol: "",
};
// Helper function that convert a IMinMaxRange to a number
function toNumber(n) {
    let value;
    switch (typeof n) {
        case "number": {
            return n;
        }
        case "object": {
            const range = n;
            value = getRandomInt_1.getRandomInt(range.min, range.max);
            break;
        }
        default:
            throw Error(`Do not know how to convert the type '${typeof n}' to a number`);
    }
    if (typeof n === "object" && typeof n.divisor === "number") {
        return value / n.divisor;
    }
    return value;
}
/**
 * Represents the valuation of a company in the World Stock Exchange.
 */
class Stock {
    /**
     * Initializes a Stock from a JSON save state
     */
    static fromJSON(value) {
        return JSONReviver_1.Generic_fromJSON(Stock, value.data);
    }
    constructor(p = defaultConstructorParams) {
        this.name = p.name;
        this.symbol = p.symbol;
        this.price = toNumber(p.initPrice);
        this.lastPrice = this.price;
        this.playerShares = 0;
        this.playerAvgPx = 0;
        this.playerShortShares = 0;
        this.playerAvgShortPx = 0;
        this.mv = toNumber(p.mv);
        this.b = p.b;
        this.otlkMag = p.otlkMag;
        this.cap = getRandomInt_1.getRandomInt(this.price * 1e3, this.price * 25e3);
        this.spreadPerc = toNumber(p.spreadPerc);
        this.priceMovementPerc = this.spreadPerc / (getRandomInt_1.getRandomInt(10, 30) / 10);
        this.shareTxForMovement = toNumber(p.shareTxForMovement);
        this.shareTxUntilMovement = this.shareTxForMovement;
        // Total shares is determined by market cap, and is rounded to nearest 100k
        let totalSharesUnrounded = (p.marketCap / this.price);
        this.totalShares = Math.round(totalSharesUnrounded / 1e5) * 1e5;
        // Max Shares (Outstanding shares) is a percentage of total shares
        const outstandingSharePercentage = 0.2;
        this.maxShares = Math.round((this.totalShares * outstandingSharePercentage) / 1e5) * 1e5;
    }
    changePrice(newPrice) {
        this.lastPrice = this.price;
        this.price = newPrice;
    }
    /**
     * Return the price at which YOUR stock is bought (market ask price). Accounts for spread
     */
    getAskPrice() {
        return this.price * (1 + (this.spreadPerc / 100));
    }
    /**
     * Return the price at which YOUR stock is sold (market bid price). Accounts for spread
     */
    getBidPrice() {
        return this.price * (1 - (this.spreadPerc / 100));
    }
    /**
     * Serialize the Stock to a JSON save state.
     */
    toJSON() {
        return JSONReviver_1.Generic_toJSON("Stock", this);
    }
}
exports.Stock = Stock;
JSONReviver_1.Reviver.constructors.Stock = Stock;


/***/ }),

/***/ 8:
/*!**************************!*\
  !*** ./src/Constants.ts ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = {
    Version: "0.46.3",
    /** Max level for any skill, assuming no multipliers. Determined by max numerical value in javascript for experience
     * and the skill level formula in Player.js. Note that all this means it that when experience hits MAX_INT, then
     * the player will have this level assuming no multipliers. Multipliers can cause skills to go above this.
     */
    MaxSkillLevel: 975,
    // Milliseconds per game cycle
    MilliPerCycle: 200,
    // How much reputation is needed to join a megacorporation's faction
    CorpFactionRepRequirement: 200e3,
    // Base RAM costs
    BaseCostFor1GBOfRamHome: 32000,
    BaseCostFor1GBOfRamServer: 55000,
    // Cost to travel to another city
    TravelCost: 200e3,
    // Faction and Company favor-related things
    BaseFavorToDonate: 150,
    DonateMoneyToRepDivisor: 1e6,
    FactionReputationToFavorBase: 500,
    FactionReputationToFavorMult: 1.02,
    CompanyReputationToFavorBase: 500,
    CompanyReputationToFavorMult: 1.02,
    // NeuroFlux Governor Augmentation cost multiplier
    NeuroFluxGovernorLevelMult: 1.14,
    NumNetscriptPorts: 20,
    // Server-related constants
    HomeComputerMaxRam: 1073741824,
    ServerBaseGrowthRate: 1.03,
    ServerMaxGrowthRate: 1.0035,
    ServerFortifyAmount: 0.002,
    ServerWeakenAmount: 0.05,
    PurchasedServerLimit: 25,
    PurchasedServerMaxRam: 1048576,
    // Augmentation Constants
    AugmentationCostMultiplier: 5,
    AugmentationRepMultiplier: 2.5,
    MultipleAugMultiplier: 1.9,
    // TOR Router
    TorRouterCost: 200e3,
    // Infiltration
    InfiltrationBribeBaseAmount: 100e3,
    InfiltrationMoneyValue: 5e3,
    InfiltrationRepValue: 1.4,
    InfiltrationExpPow: 0.8,
    // Stock market
    WSEAccountCost: 200e6,
    TIXAPICost: 5e9,
    MarketData4SCost: 1e9,
    MarketDataTixApi4SCost: 25e9,
    StockMarketCommission: 100e3,
    // Hospital/Health
    HospitalCostPerHp: 100e3,
    // Intelligence-related constants
    IntelligenceCrimeWeight: 0.05,
    IntelligenceInfiltrationWeight: 0.1,
    IntelligenceCrimeBaseExpGain: 0.001,
    IntelligenceProgramBaseExpGain: 500,
    IntelligenceTerminalHackBaseExpGain: 200,
    IntelligenceSingFnBaseExpGain: 0.002,
    IntelligenceClassBaseExpGain: 0.000001,
    IntelligenceHackingMissionBaseExpGain: 0.03,
    // Hacking Missions
    // TODO Move this into Hacking Mission implementation
    HackingMissionRepToDiffConversion: 10000,
    HackingMissionRepToRewardConversion: 7,
    HackingMissionSpamTimeIncrease: 25000,
    HackingMissionTransferAttackIncrease: 1.05,
    HackingMissionMiscDefenseIncrease: 1.05,
    HackingMissionDifficultyToHacking: 135,
    HackingMissionHowToPlay: "Hacking missions are a minigame that, if won, will reward you with faction reputation.<br><br>" +
        "In this game you control a set of Nodes and use them to try and defeat an enemy. Your Nodes " +
        "are colored blue, while the enemy's are red. There are also other nodes on the map colored gray " +
        "that initially belong to neither you nor the enemy. The goal of the game is " +
        "to capture all of the enemy's Database nodes within the time limit. " +
        "If you fail to do this, you will lose.<br><br>" +
        "Each Node has three stats: Attack, Defense, and HP. There are five different actions that " +
        "a Node can take:<br><br> " +
        "Attack - Targets an enemy Node and lowers its HP. The effectiveness is determined by the owner's Attack, the Player's " +
        "hacking level, and the enemy's defense.<br><br>" +
        "Scan - Targets an enemy Node and lowers its Defense. The effectiveness is determined by the owner's Attack, the Player's hacking level, and the " +
        "enemy's defense.<br><br>" +
        "Weaken - Targets an enemy Node and lowers its Attack. The effectiveness is determined by the owner's Attack, the Player's hacking level, and the enemy's " +
        "defense.<br><br>" +
        "Fortify - Raises the Node's Defense. The effectiveness is determined by your hacking level.<br><br>" +
        "Overflow - Raises the Node's Attack but lowers its Defense. The effectiveness is determined by your hacking level.<br><br>" +
        "Note that when determining the effectiveness of the above actions, the TOTAL Attack or Defense of the team is used, not just the " +
        "Attack/Defense of the individual Node that is performing the action.<br><br>" +
        "To capture a Node, you must lower its HP down to 0.<br><br>" +
        "There are six different types of Nodes:<br><br>" +
        "CPU Core - These are your main Nodes that are used to perform actions. Capable of performing every action<br><br>" +
        "Firewall - Nodes with high defense. These Nodes can 'Fortify'<br><br>" +
        "Database - A special type of Node. The player's objective is to conquer all of the enemy's Database Nodes within " +
        "the time limit. These Nodes cannot perform any actions<br><br>" +
        "Spam - Conquering one of these Nodes will slow the enemy's trace, giving the player additional time to complete " +
        "the mission. These Nodes cannot perform any actions<br><br>" +
        "Transfer - Conquering one of these nodes will increase the Attack of all of your CPU Cores by a small fixed percentage. " +
        "These Nodes are capable of performing every action except the 'Attack' action<br><br>" +
        "Shield - Nodes with high defense. These Nodes can 'Fortify'<br><br>" +
        "To assign an action to a Node, you must first select one of your Nodes. This can be done by simply clicking on it. Double-clicking " +
        "a node will select all of your Nodes of the same type (e.g. select all CPU Core Nodes or all Transfer Nodes). Note that only Nodes " +
        "that can perform actions (CPU Core, Transfer, Shield, Firewall) can be selected. Selected Nodes will be denoted with a white highlight. After selecting a Node or multiple Nodes, " +
        "select its action using the Action Buttons near the top of the screen. Every action also has a corresponding keyboard " +
        "shortcut.<br><br>" +
        "For certain actions such as attacking, scanning, and weakening, the Node performing the action must have a target. To target " +
        "another node, simply click-and-drag from the 'source' Node to a target. A Node can only have one target, and you can target " +
        "any Node that is adjacent to one of your Nodes (immediately above, below, or to the side. NOT diagonal). Furthermore, only CPU Cores and Transfer Nodes " +
        "can target, since they are the only ones that can perform the related actions. To remove a target, you can simply click on the line that represents " +
        "the connection between one of your Nodes and its target. Alternatively, you can select the 'source' Node and click the 'Drop Connection' button, " +
        "or press 'd'.<br><br>" +
        "Other Notes:<br><br>" +
        "-Whenever a miscellenaous Node (not owned by the player or enemy) is conquered, the defense of all remaining miscellaneous Nodes that " +
        "are not actively being targeted will increase by a fixed percentage.<br><br>" +
        "-Whenever a Node is conquered, its stats are significantly reduced<br><br>" +
        "-Miscellaneous Nodes slowly raise their defense over time<br><br>" +
        "-Nodes slowly regenerate health over time.",
    // Time-related constants
    MillisecondsPer20Hours: 72000000,
    GameCyclesPer20Hours: 72000000 / 200,
    MillisecondsPer10Hours: 36000000,
    GameCyclesPer10Hours: 36000000 / 200,
    MillisecondsPer8Hours: 28800000,
    GameCyclesPer8Hours: 28800000 / 200,
    MillisecondsPer4Hours: 14400000,
    GameCyclesPer4Hours: 14400000 / 200,
    MillisecondsPer2Hours: 7200000,
    GameCyclesPer2Hours: 7200000 / 200,
    MillisecondsPerHour: 3600000,
    GameCyclesPerHour: 3600000 / 200,
    MillisecondsPerHalfHour: 1800000,
    GameCyclesPerHalfHour: 1800000 / 200,
    MillisecondsPerQuarterHour: 900000,
    GameCyclesPerQuarterHour: 900000 / 200,
    MillisecondsPerFiveMinutes: 300000,
    GameCyclesPerFiveMinutes: 300000 / 200,
    // Player Work & Action
    FactionWorkHacking: "Faction Hacking Work",
    FactionWorkField: "Faction Field Work",
    FactionWorkSecurity: "Faction Security Work",
    WorkTypeCompany: "Working for Company",
    WorkTypeCompanyPartTime: "Working for Company part-time",
    WorkTypeFaction: "Working for Faction",
    WorkTypeCreateProgram: "Working on Create a Program",
    WorkTypeStudyClass: "Studying or Taking a class at university",
    WorkTypeCrime: "Committing a crime",
    ClassStudyComputerScience: "studying Computer Science",
    ClassDataStructures: "taking a Data Structures course",
    ClassNetworks: "taking a Networks course",
    ClassAlgorithms: "taking an Algorithms course",
    ClassManagement: "taking a Management course",
    ClassLeadership: "taking a Leadership course",
    ClassGymStrength: "training your strength at a gym",
    ClassGymDefense: "training your defense at a gym",
    ClassGymDexterity: "training your dexterity at a gym",
    ClassGymAgility: "training your agility at a gym",
    ClassDataStructuresBaseCost: 40,
    ClassNetworksBaseCost: 80,
    ClassAlgorithmsBaseCost: 320,
    ClassManagementBaseCost: 160,
    ClassLeadershipBaseCost: 320,
    ClassGymBaseCost: 120,
    CrimeShoplift: "shoplift",
    CrimeRobStore: "rob a store",
    CrimeMug: "mug someone",
    CrimeLarceny: "commit larceny",
    CrimeDrugs: "deal drugs",
    CrimeBondForgery: "forge corporate bonds",
    CrimeTraffickArms: "traffick illegal arms",
    CrimeHomicide: "commit homicide",
    CrimeGrandTheftAuto: "commit grand theft auto",
    CrimeKidnap: "kidnap someone for ransom",
    CrimeAssassination: "assassinate a high-profile target",
    CrimeHeist: "pull off the ultimate heist",
    // Coding Contract
    // TODO Move this into Coding contract impelmentation?
    CodingContractBaseFactionRepGain: 2500,
    CodingContractBaseCompanyRepGain: 4000,
    CodingContractBaseMoneyGain: 75e6,
    // BitNode/Source-File related stuff
    TotalNumBitNodes: 24,
    LatestUpdate: `
    v0.47.0
    * Stock Market changes:
    ** Implemented spread. Stock's now have bid and ask prices at which transactions occur
    ** Large transactions will now influence a stock's price and forecast
    ** This "influencing" can take effect in the middle of a transaction
    ** See documentation for more details on these changes
    ** Added getStockAskPrice(), getStockBidPrice() Netscript functions to the TIX API
    ** Added getStockPurchaseCost(), getStockSaleGain() Netscript functions to the TIX API

    * Re-sleeves can no longer have the NeuroFlux Governor augmentation
    ** This is just a temporary patch until the mechanic gets re-worked

    * Adjusted RAM costs of Netscript Singularity functions (mostly increased)
    * Netscript Singularity functions no longer cost extra RAM outside of BitNode-4
    * Corporation employees no longer have an "age" stat
    * Bug Fix: Corporation employees stats should no longer become negative
    * Bug Fix: Fixed sleeve.getInformation() throwing error in certain scenarios
    * Bug Fix: Coding contracts should no longer generate on the w0r1d_d43m0n server
    * Bug Fix: Duplicate Sleeves now properly have access to all Augmentations if you have a gang
    * Bug Fix: getAugmentationsFromFaction() & purchaseAugmentation() functions should now work properly if you have a gang
    * Bug Fix: Fixed issue that caused messages (.msg) to be sent when refreshing/reloading the game
    * Bug Fix: Purchasing hash upgrades for Bladeburner/Corporation when you don't actually have access to those mechanics no longer gives hashes
    * Bug Fix: run(), exec(), and spawn() Netscript functions now throw if called with 0 threads
    * Bug Fix: Faction UI should now automatically update reputation
    `
};


/***/ }),

/***/ 98:
/*!**********************************!*\
  !*** ./src/StockMarket/Order.ts ***!
  \**********************************/
/*! no static exports found */
/*! exports used: Order */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a Limit or Buy Order on the stock market. Does not represent
 * a Market Order since those are just executed immediately
 */
const OrderTypes_1 = __webpack_require__(/*! ./data/OrderTypes */ 54);
const PositionTypes_1 = __webpack_require__(/*! ./data/PositionTypes */ 23);
const JSONReviver_1 = __webpack_require__(/*! ../../utils/JSONReviver */ 16);
class Order {
    /**
     * Initializes a Order from a JSON save state
     */
    static fromJSON(value) {
        return JSONReviver_1.Generic_fromJSON(Order, value.data);
    }
    constructor(stockSymbol = "", shares = 0, price = 0, typ = OrderTypes_1.OrderTypes.LimitBuy, pos = PositionTypes_1.PositionTypes.Long) {
        // Validate arguments
        let invalidArgs = false;
        if (typeof shares !== "number" || typeof price !== "number") {
            invalidArgs = true;
        }
        if (isNaN(shares) || isNaN(price)) {
            invalidArgs = true;
        }
        if (typeof stockSymbol !== "string") {
            invalidArgs = true;
        }
        if (invalidArgs) {
            throw new Error(`Invalid constructor paramters for Order`);
        }
        this.stockSymbol = stockSymbol;
        this.shares = shares;
        this.price = price;
        this.type = typ;
        this.pos = pos;
    }
    /**
     * Serialize the Order to a JSON save state.
     */
    toJSON() {
        return JSONReviver_1.Generic_toJSON("Order", this);
    }
}
exports.Order = Order;
JSONReviver_1.Reviver.constructors.Order = Order;


/***/ })

/******/ });
//# sourceMappingURL=tests.bundle.js.map