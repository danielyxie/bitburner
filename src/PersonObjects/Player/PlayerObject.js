import * as augmentationMethods from "./PlayerObjectAugmentationMethods";
import * as bladeburnerMethods from "./PlayerObjectBladeburnerMethods";
import * as corporationMethods from "./PlayerObjectCorporationMethods";
import * as gangMethods from "./PlayerObjectGangMethods";
import * as generalMethods from "./PlayerObjectGeneralMethods";
import * as serverMethods from "./PlayerObjectServerMethods";

import { HashManager } from "../../Hacknet/HashManager";
import { CityName } from "../../Locations/data/CityNames";

import { MoneySourceTracker } from "../../utils/MoneySourceTracker";
import {
    Reviver,
    Generic_toJSON,
    Generic_fromJSON,
} from "../../../utils/JSONReviver";

import Decimal from "decimal.js";

export function PlayerObject() {
    //Skills and stats
    this.hacking_skill  = 1;

    //Combat stats
    this.hp             = 10;
    this.max_hp         = 10;
    this.strength       = 1;
    this.defense        = 1;
    this.dexterity      = 1;
    this.agility        = 1;

    //Labor stats
    this.charisma       = 1;

    //Special stats
    this.intelligence   = 0;

    //Hacking multipliers
    this.hacking_chance_mult    = 1;
    this.hacking_speed_mult     = 1;
    this.hacking_money_mult     = 1;
    this.hacking_grow_mult      = 1;

    //Experience and multipliers
    this.hacking_exp     = 0;
    this.strength_exp    = 0;
    this.defense_exp     = 0;
    this.dexterity_exp   = 0;
    this.agility_exp     = 0;
    this.charisma_exp    = 0;
    this.intelligence_exp= 0;

    this.hacking_mult       = 1;
    this.strength_mult      = 1;
    this.defense_mult       = 1;
    this.dexterity_mult     = 1;
    this.agility_mult       = 1;
    this.charisma_mult      = 1;

    this.hacking_exp_mult    = 1;
    this.strength_exp_mult   = 1;
    this.defense_exp_mult    = 1;
    this.dexterity_exp_mult  = 1;
    this.agility_exp_mult    = 1;
    this.charisma_exp_mult   = 1;

    this.company_rep_mult    = 1;
    this.faction_rep_mult    = 1;

    //Money
    this.money           = new Decimal(1000);

    //IP Address of Starting (home) computer
    this.homeComputer = "";

	//Location information
	this.city 			= CityName.Sector12;
	this.location 		= "";

    // Jobs that the player holds
    // Map of company name (key) -> name of company position (value. Just the name, not the CompanyPosition object)
    // The CompanyPosition name must match a key value in CompanyPositions
    this.jobs = {};

    // Company at which player is CURRENTLY working (only valid when the player is actively working)
    this.companyName = "";      // Name of Company. Must match a key value in Companies map

    // Servers
    this.currentServer          = ""; //IP address of Server currently being accessed through terminal
    this.purchasedServers       = []; //IP Addresses of purchased servers

    // Hacknet Nodes/Servers
    this.hacknetNodes           = []; // Note: For Hacknet Servers, this array holds the IP addresses of the servers
    this.hashManager            = new HashManager();

    //Factions
    this.factions = [];             //Names of all factions player has joined
    this.factionInvitations = [];   //Outstanding faction invitations

    //Augmentations
    this.queuedAugmentations = [];
    this.augmentations = [];

    this.sourceFiles = [];

    //Crime statistics
    this.numPeopleKilled = 0;
    this.karma = 0;

    this.crime_money_mult               = 1;
    this.crime_success_mult             = 1;

    //Flags/variables for working (Company, Faction, Creating Program, Taking Class)
    this.isWorking = false;
    this.workType = "";

    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";

    this.workHackExpGainRate = 0;
    this.workStrExpGainRate = 0;
    this.workDefExpGainRate = 0;
    this.workDexExpGainRate = 0;
    this.workAgiExpGainRate = 0;
    this.workChaExpGainRate = 0;
    this.workRepGainRate = 0;
    this.workMoneyGainRate = 0;
    this.workMoneyLossRate = 0;

    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;

    this.createProgramName = "";
    this.createProgramReqLvl = 0;

    this.className = "";

    this.crimeType = "";

    this.timeWorked = 0;    //in ms
    this.timeWorkedCreateProgram = 0;
    this.timeNeededToCompleteWork = 0;

    this.work_money_mult = 1;

    //Hacknet Node multipliers
    this.hacknet_node_money_mult            = 1;
    this.hacknet_node_purchase_cost_mult    = 1;
    this.hacknet_node_ram_cost_mult         = 1;
    this.hacknet_node_core_cost_mult        = 1;
    this.hacknet_node_level_cost_mult       = 1;

    //Stock Market
    this.hasWseAccount      = false;
    this.hasTixApiAccess    = false;
    this.has4SData          = false;
    this.has4SDataTixApi    = false;

    //Gang
    this.gang = 0;

    //Corporation
    this.corporation = 0;

    //Bladeburner
    this.bladeburner = 0;
    this.bladeburner_max_stamina_mult               = 1;
    this.bladeburner_stamina_gain_mult              = 1;
    this.bladeburner_analysis_mult                  = 1; //Field Analysis Only
    this.bladeburner_success_chance_mult            = 1;

    // Sleeves & Re-sleeving
    this.sleeves = [];
    this.resleeves = [];
    this.sleevesFromCovenant = 0; // # of Duplicate sleeves purchased from the covenant

    //bitnode
    this.bitNodeN = 1;

    //Flags for determining whether certain "thresholds" have been achieved
    this.firstFacInvRecvd = false;
    this.firstAugPurchased = false;
    this.firstTimeTraveled = false;
    this.firstProgramAvailable = false;

	//Used to store the last update time.
	this.lastUpdate = 0;
    this.totalPlaytime = 0;
    this.playtimeSinceLastAug = 0;
    this.playtimeSinceLastBitnode = 0;

    // Keep track of where money comes from
    this.moneySourceA = new MoneySourceTracker(); // Where money comes from since last-installed Augmentation
    this.moneySourceB = new MoneySourceTracker(); // Where money comes from for this entire BitNode run

    // Production since last Augmentation installation
    this.scriptProdSinceLastAug = 0;

    this.exploits = [];
}

// Apply player methods to the prototype using Object.assign()
Object.assign(
    PlayerObject.prototype,
    generalMethods,
    serverMethods,
    bladeburnerMethods,
    corporationMethods,
    gangMethods,
    augmentationMethods,
);

PlayerObject.prototype.toJSON = function() {
    return Generic_toJSON("PlayerObject", this);
}

PlayerObject.fromJSON = function(value) {
    return Generic_fromJSON(PlayerObject, value.data);
}

Reviver.constructors.PlayerObject = PlayerObject;
