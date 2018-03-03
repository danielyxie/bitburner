import {BitNodeMultipliers}                             from "./BitNode.js";
import {Engine}                                         from "./engine.js";
import {Factions}                                       from "./Faction.js";
import {showLiterature}                                 from "./Literature.js";
import {Locations}                                      from "./Location.js";
import {Player}                                         from "./Player.js";

import Decimal                                          from '../utils/decimal.js';
import {dialogBoxCreate}                                from "../utils/DialogBox.js";
import {getRandomInt, removeElementById,
        createElement, createAccordionElement,
        removeChildrenFromElement, createPopup,
        clearSelector}                                  from "../utils/HelperFunctions.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                               from "../utils/JSONReviver.js";
import numeral                                          from "../utils/numeral.min.js";
import {formatNumber, isString, generateRandomString}   from "../utils/StringHelperFunctions.js";
import {yesNoBoxCreate, yesNoTxtInpBoxCreate,
        yesNoBoxGetYesButton, yesNoBoxGetNoButton,
        yesNoTxtInpBoxGetYesButton, yesNoTxtInpBoxGetNoButton,
        yesNoTxtInpBoxGetInput, yesNoBoxClose,
        yesNoTxtInpBoxClose, yesNoBoxOpen}              from "../utils/YesNoBox.js";

/* State */
var companyStates = ["START", "PURCHASE", "PRODUCTION", "SALE", "EXPORT"];
function CorporationState() {
    this.state = 0;
}

CorporationState.prototype.nextState = function() {
    if (this.state < 0 || this.state >= companyStates.length) {
        this.state = 0;
    }

    ++this.state;
    if (this.state >= companyStates.length) {
        this.state = 0;
    }
}

CorporationState.prototype.getState = function() {
    return companyStates[this.state];
}

CorporationState.prototype.toJSON = function() {
	return Generic_toJSON("CorporationState", this);
}

CorporationState.fromJSON = function(value) {
	return Generic_fromJSON(CorporationState, value.data);
}

Reviver.constructors.CorporationState = CorporationState;

/* Constants */
var TOTALSHARES = 1e9; //Total number of shares you have at your company
var CyclesPerMarketCycle    = 75;
var CyclesPerIndustryStateCycle = CyclesPerMarketCycle / companyStates.length;
var SecsPerMarketCycle      = CyclesPerMarketCycle / 5;
var Cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
var WarehouseInitialCost        = 5e9; //Initial purchase cost of warehouse
var WarehouseInitialSize        = 100;
var WarehouseUpgradeBaseCost    = 1e9;

var OfficeInitialCost           = 4e9;
var OfficeInitialSize           = 3;
var OfficeUpgradeBaseCost       = 1e9;

var BribeThreshold              = 100e12; //Money needed to be able to bribe for faction rep
var BribeToRepRatio             = 1e9;   //Bribe Value divided by this = rep gain

function Material(params={}) {
    this.name = params.name ? params.name : "";
    this.qty    = 0; //Quantity
    this.qlt    = 0; //Quality, unbounded
    this.dmd    = 0; //Demand, 0-100?
    this.dmdR   = 0; //Range of possible demand
    this.cmp    = 0; //Competition, 0-100
    this.cmpR   = 0; //Range of possible competition
    this.mv     = 0; //Maximum Volatility of stats

    //Markup. Determines how high of a price you can charge on the material
    //compared to the market price (bCost) based on quality
    //Quality is divided by this to determine markup limits
    //e.g if mku is 10 and quality is 100 then you can mark up prices by 100/10 = 10
    //without consequences
    this.mku    = 0;

    this.buy = 0; //How much of this material is being bought per second
    this.sll = 0; //How much of this material is being sold per second
    this.prd = 0; //How much of this material is being produced per second
    this.exp = []; //Exports of this material to another warehouse/industry
    this.imp = 0;
    this.bCost = 0; //$ Cost/sec to buy material
    this.sCost = 0; //$ Cost/sec to sell material

    //[Whether production/sale is limited, limit amount]
    this.prdman = [false, 0]; //Production for this material is manually limited
    this.sllman = [false, 0]; //Sale of this material is manually limited
    this.init();
}

Material.prototype.init = function(mats={}) {
    switch(this.name) {
        case "Water":
            this.dmd = 75; this.dmdR = [65, 85];
            this.cmp = 50; this.cmpR = [40, 60];
            this.bCost = 1000; this.mv = 0.2;
            this.mku = 6;
            break;
        case "Energy":
            this.dmd = 90; this.dmdR = [80, 100];
            this.cmp = 80; this.cmpR = [65, 95];
            this.bCost = 1500; this.mv = 0.2;
            this.mku = 6;
            break;
        case "Food":
            this.dmd = 80; this.dmdR = [70, 90];
            this.cmp = 60; this.cmpR = [35, 85];
            this.bCost = 5000; this.mv = 1;
            this.mku = 3;
            break;
        case "Plants":
            this.dmd = 70; this.dmdR = [20, 90];
            this.cmp = 50; this.cmpR = [30, 70];
            this.bCost = 3000; this.mv = 0.6;
            this.mku = 3.75;
            break;
        case "Metal":
            this.dmd = 80; this.dmdR = [75, 85];
            this.cmp = 70; this.cmpR = [60, 80];
            this.bCost = 2650; this.mv = 1;
            this.mku = 6;
            break;
        case "Hardware":
            this.dmd = 85; this.dmdR = [80, 90];
            this.cmp = 80; this.cmpR = [65, 95];
            this.bCost = 4000; this.mv = 0.5; //Less mv bc its processed twice
            this.mku = 1;
            break;
        case "Chemicals":
            this.dmd = 55; this.dmdR = [40, 70];
            this.cmp = 60; this.cmpR = [40, 80];
            this.bCost = 6750; this.mv = 1.2;
            this.mku = 2;
            break;
        case "Real Estate":
            this.dmd = 50; this.dmdR = [5, 100];
            this.cmp = 50; this.cmpR = [25, 75];
            this.bCost = 16e3; this.mv = 1.5; //Less mv bc its processed twice
            this.mku = 1.5;
            break;
        case "Drugs":
            this.dmd = 60; this.dmdR = [45, 75];
            this.cmp = 70; this.cmpR = [40, 100];
            this.bCost = 8e3; this.mv = 1.6;
            this.mku = 1;
            break;
        case "Robots":
            this.dmd = 90; this.dmdR = [80, 100];
            this.cmp = 90; this.cmpR = [80, 100];
            this.bCost = 20e3; this.mv = 0.5; //Less mv bc its processed twice
            this.mku = 1;
            break;
        case "AI Cores":
            this.dmd = 90; this.dmdR = [80, 100];
            this.cmp = 90; this.cmpR = [80, 100];
            this.bCost = 27e3; this.mv = 0.8; //Less mv bc its processed twice
            this.mku = 0.5;
            break;
        case "Scientific Research":
            break;
        default:
            console.log("Invalid material type in init(): " + this.name);
            break;
    }
}

//Process change in demand, competition, and buy cost of this material
Material.prototype.processMarket = function() {
    //This 1st random check determines whether competition increases or decreases
    //More competition = lower market price
    var v = (Math.random() * this.mv) / 100;
    var pv = (Math.random() * this.mv) / 300;
    if (Math.random() < 0.42) {
        this.cmp *= (1+v);
        if (this.cmp > this.cmpR[1]) {this.cmp = this.cmpR[1]};
        this.bCost *= (1-pv);
    } else {
        this.cmp *= (1-v);
        if (this.cmp < this.cmpR[0]) {this.cmp = this.cmpR[0];}
        this.bCost *= (1+pv);
    }

    //This 2nd random check determines whether demand increases or decreases
    //More demand = higher market price
    v = (Math.random() * this.mv) / 100;
    pv = (Math.random() * this.mv) / 300;
    if (Math.random() < 0.45) {
        this.dmd *= (1+v);
        if (this.dmd > this.dmdR[1]) {this.dmd = this.dmdR[1];}
        this.bCost *= (1+pv);
    } else {
        this.dmd *= (1-v);
        if (this.dmd < this.dmdR[0]) {this.dmd = this.dmdR[0];}
        this.bCost *= (1-pv);
    }
}

Material.prototype.toJSON = function() {
	return Generic_toJSON("Material", this);
}

Material.fromJSON = function(value) {
	return Generic_fromJSON(Material, value.data);
}

Reviver.constructors.Material = Material;

//Map of material (by name) to their sizes (how much space it takes in warehouse)
let MaterialSizes = {
    Water:      0.05,
    Energy:     0.01,
    Food:       0.03,
    Plants:     0.05,
    Metal:      0.1,
    Hardware:   0.06,
    Chemicals:  0.05,
    Drugs:      0.02,
    Robots:     0.5,
    "AICores": 0.1
}

function Product(params={}) {
    this.name = params.name         ? params.name           : 0;
    this.dmd = params.demand        ? params.demand         : 0;
    this.cmp = params.competition   ? params.competition    : 0;
    this.mku = params.markup        ? params.markup         : 0;
    this.pCost = 0; //An estimate of how much money it costs to make this
    this.sCost = 0; //How much this is selling for

    //Variables for creation of product
    this.fin = false;       //Finished being created
    this.prog = 0;          //0-100% created
    this.createCity = params.createCity ? params.createCity : ""; // City in which the product is being created
    this.designCost     = params.designCost ? params.designCost : 0;
    this.advCost        = params.advCost ? params.advCost : 0;

    //Aggregate score for a product's 'rating' based on the other properties below
    //The weighting of the other properties (performance, durability)
    //differs between industries
    this.rat = 0;

    this.qlt = params.quality       ? params.quality        : 0;
    this.per = params.performance   ? params.performance    : 0;
    this.dur = params.durability    ? params.durability     : 0;
    this.rel = params.reliability   ? params.reliability    : 0;
    this.aes = params.aesthetics    ? params.aesthetics     : 0;
    this.fea = params.features      ? params.features       : 0;

    //Data refers to the production, sale, and quantity of the products
    //These values are specific to a city
    //The data is [qty, prod, sell]
    this.data = {
        [Locations.Aevum]: [0, 0, 0],
        [Locations.Chongqing]: [0, 0, 0],
        [Locations.Sector12]: [0, 0, 0],
        [Locations.NewTokyo]: [0, 0, 0],
        [Locations.Ishima]: [0, 0, 0],
        [Locations.Volhaven]: [0, 0, 0],
    }

    //Only applies for location-based products like restaurants/hospitals
    this.loc = params.loc ? params.loc : 0;

    //How much space it takes in the warehouse. Not applicable for all products
    this.siz = params.size ? params.size : 0;

    //Material requirements. An object that maps the name of a material to how much it requires
    //to make 1 unit of the product.
    this.reqMats = params.req           ? params.req            : {};

    //[Whether production/sale is limited, limit amount]
    this.prdman = {
        [Locations.Aevum]: [false, 0],
        [Locations.Chongqing]: [false, 0],
        [Locations.Sector12]: [false, 0],
        [Locations.NewTokyo]: [false, 0],
        [Locations.Ishima]: [false, 0],
        [Locations.Volhaven]: [false, 0],
    }

    this.sllman = {
        [Locations.Aevum]: [false, 0],
        [Locations.Chongqing]: [false, 0],
        [Locations.Sector12]: [false, 0],
        [Locations.NewTokyo]: [false, 0],
        [Locations.Ishima]: [false, 0],
        [Locations.Volhaven]: [false, 0],
    }
}

//empWorkMult is a multiplier that increases progress rate based on
//productivity of employees
Product.prototype.createProduct = function(marketCycles=1, empWorkMult=1) {
    if (this.fin) {return;}
    this.prog += (marketCycles * .01 * empWorkMult);
}

//'industry' is a reference to the industry that makes the product
Product.prototype.finishProduct = function(employeeProd, industry) {
    this.fin = true;

    //Calculate properties
    var progrMult = this.prog / 100;

    var engrRatio   = employeeProd[EmployeePositions.Engineer] / employeeProd["total"],
        mgmtRatio   = employeeProd[EmployeePositions.Management] / employeeProd["total"],
        rndRatio    = employeeProd[EmployeePositions.RandD] / employeeProd["total"],
        opsRatio    = employeeProd[EmployeePositions.Operations] / employeeProd["total"],
        busRatio    = employeeProd[EmployeePositions.Business] / employeeProd["total"];
    var designMult = 1 + (Math.pow(this.designCost, 0.1) / 100);
    console.log("designMult: " + designMult);
    var balanceMult = (1.2 * engrRatio) + (0.9 * mgmtRatio) + (1.3 * rndRatio) +
                      (1.5 * opsRatio) + (busRatio);
    var totalMult = progrMult * balanceMult * designMult;

    this.qlt = totalMult * ((0.10 * employeeProd[EmployeePositions.Engineer]) +
                            (0.05 * employeeProd[EmployeePositions.Management]) +
                            (0.05 * employeeProd[EmployeePositions.RandD]) +
                            (0.02 * employeeProd[EmployeePositions.Operations]) +
                            (0.02 * employeeProd[EmployeePositions.Business]));
    this.per = totalMult * ((0.15 * employeeProd[EmployeePositions.Engineer]) +
                            (0.02 * employeeProd[EmployeePositions.Management]) +
                            (0.02 * employeeProd[EmployeePositions.RandD]) +
                            (0.02 * employeeProd[EmployeePositions.Operations]) +
                            (0.02 * employeeProd[EmployeePositions.Business]));
    this.dur = totalMult * ((0.05 * employeeProd[EmployeePositions.Engineer]) +
                            (0.02 * employeeProd[EmployeePositions.Management]) +
                            (0.08 * employeeProd[EmployeePositions.RandD]) +
                            (0.05 * employeeProd[EmployeePositions.Operations]) +
                            (0.05 * employeeProd[EmployeePositions.Business]));
    this.rel = totalMult * ((0.02 * employeeProd[EmployeePositions.Engineer]) +
                            (0.08 * employeeProd[EmployeePositions.Management]) +
                            (0.02 * employeeProd[EmployeePositions.RandD]) +
                            (0.05 * employeeProd[EmployeePositions.Operations]) +
                            (0.08 * employeeProd[EmployeePositions.Business]));
    this.aes = totalMult * ((0.00 * employeeProd[EmployeePositions.Engineer]) +
                            (0.08 * employeeProd[EmployeePositions.Management]) +
                            (0.05 * employeeProd[EmployeePositions.RandD]) +
                            (0.02 * employeeProd[EmployeePositions.Operations]) +
                            (0.10 * employeeProd[EmployeePositions.Business]));
    this.fea = totalMult * ((0.08 * employeeProd[EmployeePositions.Engineer]) +
                            (0.05 * employeeProd[EmployeePositions.Management]) +
                            (0.02 * employeeProd[EmployeePositions.RandD]) +
                            (0.05 * employeeProd[EmployeePositions.Operations]) +
                            (0.05 * employeeProd[EmployeePositions.Business]));
    this.calculateRating(industry);
    var advMult = 1 + (Math.pow(this.advCost, 0.1) / 100);
    this.mku = 100 / (advMult * Math.pow((this.qlt + 0.001), 0.75) * (busRatio + mgmtRatio));
    this.dmd = industry.awareness === 0 ? 20 : Math.min(100, advMult * (100 * (industry.popularity / industry.awareness)));
    this.cmp = getRandomInt(0, 70);

    //Calculate the product's required materials
    //For now, just set it to be the same as the requirements to make materials
    for (var matName in industry.reqMats) {
        if (industry.reqMats.hasOwnProperty(matName)) {
            this.reqMats[matName] = industry.reqMats[matName];
        }
    }

    //Calculate the product's size
    //For now, just set it to be the same size as the requirements to make materials
    this.siz = 0;
    for (var matName in industry.reqMats) {
        this.siz += MaterialSizes[matName] * industry.reqMats[matName];
    }

    //Delete unneeded variables
    delete this.prog;
    delete this.createCity;
    delete this.designCost;
    delete this.advCost;
}


Product.prototype.calculateRating = function(industry) {
    var weights = ProductRatingWeights[industry.type];
    if (weights == null) {
        console.log("ERROR: Could not find product rating weights for: " + industry);
        return;
    }
    this.rat = 0;
    this.rat += weights.Quality     ? this.qlt * weights.Quality : 0;
    this.rat += weights.Performance ? this.per * weights.Performance : 0;
    this.rat += weights.Durability  ? this.dur * weights.Durability : 0;
    this.rat += weights.Reliability ? this.rel * weights.Reliability : 0;
    this.rat += weights.Aesthetics  ? this.aes * weights.Aesthetics : 0;
    this.rat += weights.Features    ? this.fea * weights.Features : 0;
}

Product.prototype.toJSON = function() {
	return Generic_toJSON("Product", this);
}

Product.fromJSON = function(value) {
	return Generic_fromJSON(Product, value.data);
}

Reviver.constructors.Product = Product;

var Industries = {
    Energy: "Energy",
    Utilities: "Water Utilities",
    Agriculture: "Agriculture",
    Fishing: "Fishing",
    Mining: "Mining",
    Food: "Food",
    Tobacco: "Tobacco",
    Chemical: "Chemical",
    Pharmaceutical: "Pharmaceutical",
    Computer: "Computer Hardware",
    Robotics: "Robotics",
    Software: "Software",
    Healthcare: "Healthcare",
    RealEstate: "RealEstate",
}

var IndustryStartingCosts = {
    Energy: 225e9,
    Utilities: 150e9,
    Agriculture: 40e9,
    Fishing: 80e9,
    Mining: 300e9,
    Food: 10e9,
    Tobacco: 20e9,
    Chemical: 70e9,
    Pharmaceutical: 200e9,
    Computer: 500e9,
    Robotics: 1e12,
    Software: 25e9,
    Healthcare: 750e9,
    RealEstate: 600e9,
}

var IndustryDescriptions = {
    Energy: "Engage in the production and distribution of energy.<br><br>" +
            "Starting cost: " + numeral(IndustryStartingCosts.Energy).format("$0.000a") + "<br>" +
            "Recommended starting Industry: NO",
    Utilities: "Distributes water and provides wastewater services.<br><br>" +
               "Starting cost: " + numeral(IndustryStartingCosts.Utilities).format("$0.000a") + "<br>" +
               "Recommended starting Industry: NO",
    Agriculture: "Cultive crops and breed livestock to produce food.<br><br>" +
                 "Starting cost: " + numeral(IndustryStartingCosts.Agriculture).format("$0.000a") + "<br>" +
                 "Recommended starting Industry: YES",
    Fishing: "Produce food through the breeding and processing of fish and fish products<br><br>" +
             "Starting cost: " + numeral(IndustryStartingCosts.Fishing).format("$0.000a") + "<br>" +
             "Recommended starting Industry: NO",
    Mining: "Extract and process metals from the earth.<br><br>" +
            "Starting cost: " + numeral(IndustryStartingCosts.Mining).format("$0.000a") + "<br>" +
            "Recommended starting Industry: NO",
    Food: "Create your own restaurants all around the world.<br><br>" +
          "Starting cost: " + numeral(IndustryStartingCosts.Food).format("$0.000a") + "<br>" +
          "Recommended starting Industry: YES",
    Tobacco: "Create and distribute tobacco and tobacco-related products.<br><br>" +
             "Starting cost: " + numeral(IndustryStartingCosts.Tobacco).format("$0.000a") + "<br>" +
             "Recommended starting Industry: YES",
    Chemical: "Product industrial chemicals<br><br>" +
              "Starting cost: " + numeral(IndustryStartingCosts.Chemical).format("$0.000a") + "<br>" +
              "Recommended starting Industry: NO",
    Pharmaceutical: "Discover, develop, and create new pharmaceutical drugs.<br><br>" +
                    "Starting cost: " + numeral(IndustryStartingCosts.Pharmaceutical).format("$0.000a") + "<br>" +
                    "Recommended starting Industry: NO",
    Computer: "Develop and manufacture new computer hardware and networking infrastructures.<br><br>" +
              "Starting cost: " + numeral(IndustryStartingCosts.Computer).format("$0.000a") + "<br>" +
              "Recommended starting Industry: NO",
    Robotics: "Develop and create robots.<br><br>" +
              "Starting cost: " + numeral(IndustryStartingCosts.Robotics).format("$0.000a") + "<br>" +
              "Recommended starting Industry: NO",
    Software: "Develop computer software and create AI Cores.<br><br>" +
              "Starting cost: " + numeral(IndustryStartingCosts.Software).format("$0.000a") + "<br>" +
              "Recommended starting Industry: YES",
    Healthcare: "Create and manage hospitals.<br><br>" +
                "Starting cost: " + numeral(IndustryStartingCosts.Healthcare).format("$0.000a") + "<br>" +
                "Recommended starting Industry: NO",
    RealEstate: "Develop and manuage real estate properties.<br><br>" +
                "Starting cost: " + numeral(IndustryStartingCosts.RealEstate).format("$0.000a") + "<br>" +
                "Recommended starting Industry: NO",
}

var ProductRatingWeights = {
    [Industries.Food]: {
        Quality:        0.7,
        Durability:     0.1,
        Aesthetics:     0.2,
    },
    [Industries.Tobacco]: {
        Quality:        0.4,
        Durability:     0.2,
        Reliability:    0.2,
        Aesthetics:     0.2,
    },
    [Industries.Pharmaceutical]: {
        Quality:        0.2,
        Performance:    0.2,
        Durability:     0.1,
        Reliability:    0.3,
        Features:       0.2,
    },
    [Industries.Computer]: {
        Quality:        0.15,
        Performance:    0.25,
        Durability:     0.25,
        Reliability:    0.2,
        Aesthetics:     0.05,
        Features:       0.1,
    },
    [Industries.Robotics]: {
        Quality:        0.1,
        Performance:    0.2,
        Durability:     0.2,
        Reliability:    0.2,
        Aesthetics:     0.1,
        Features:       0.2,
    },
    [Industries.Software]: {
        Quality:        0.2,
        Performance:    0.2,
        Reliability:    0.2,
        Durability:     0.2,
        Features:       0.2,
    },
    [Industries.Healthcare]: {
        Quality:        0.4,
        Performance:    0.1,
        Durability:     0.1,
        Reliability:    0.3,
        Features:       0.1,
    },
    [Industries.RealEstate]: {
        Quality:        0.2,
        Durability:     0.25,
        Reliability:    0.1,
        Aesthetics:     0.35,
        Features:       0.1,
    }
}

//Industry upgrades
//The structure is:
//  [index in array, base price, price mult, benefit mult (if applicable), name, desc]
var IndustryUpgrades = {
    "0":    [0, 500e3, 1, 1.05,
            "Coffee", "Provide your employees with coffee, increasing their energy by 5%."],
    "1":    [1, 1e9, 1.03, 1.03,
            "AdVert.Inc", "Hire AdVert.Inc to advertise your company. Each level of " +
            "this upgrade grants your company a static increase of 4 and 1 to its awareness and " +
            "popularity, respectively. It will then increase your company's awareness by 1%, and its popularity " +
            "by a random percentage between 3% and 6%. These effects are increased by other upgrades " +
            "that increase the power of your advertising."]
}

var empManualAssignmentModeActive = false;
function Industry(params={}) {
    this.offices = { //Maps locations to offices. 0 if no office at that location
        [Locations.Aevum]: 0,
        [Locations.Chongqing]: 0,
        [Locations.Sector12]: new OfficeSpace({
            loc:Locations.Sector12,
            size:OfficeInitialSize,
        }),
        [Locations.NewTokyo]: 0,
        [Locations.Ishima]: 0,
        [Locations.Volhaven]: 0
    };

    this.warehouses = { //Maps locations to warehouses. 0 if no warehouse at that location
        [Locations.Aevum]: 0,
        [Locations.Chonqing]: 0,
        [Locations.Sector12]: new Warehouse({
            loc:Locations.Sector12,
            size: WarehouseInitialSize,
        }),
        [Locations.NewTokyo]: 0,
        [Locations.Ishima]: 0,
        [Locations.Volhaven]: 0
    };

    this.name   = params.name ? params.name : 0;
    this.type   = params.type ? params.type : 0;

    this.sciResearch    = new Material({name: "Scientific Research"});

    //A map of the NAME of materials required to create produced materials to
    //how many are needed to produce 1 unit of produced materials
    this.reqMats = {};

    //An array of the name of materials being produced
    this.prodMats = [];

    this.products  = {};
    this.makesProducts = false;

    this.awareness      = 0;
    this.popularity     = 0; //Should always be less than awareness
    this.startingCost   = 0;

    /* The following are factors for how much production/other things are increased by
       different factors. The production increase always has diminishing returns,
       and they are all reprsented by exponentials of < 1 (e.g x ^ 0.5, x ^ 0.8)
       The number for these represent the exponential. A lower number means more
       diminishing returns */
    this.reFac      = 0; //Real estate Factor
    this.sciFac     = 0; //Scientific Research Factor, affects quality
    this.hwFac      = 0; //Hardware factor
    this.robFac     = 0; //Robotics Factor
    this.aiFac      = 0; //AI Cores factor;
    this.advFac     = 0; //Advertising factor, affects sales

    this.prodMult   = 0; //Production multiplier

    //Financials
    this.lastCycleRevenue   = new Decimal(0);
    this.lastCycleExpenses  = new Decimal(0);
    this.thisCycleRevenue   = new Decimal(0);
    this.thisCycleExpenses  = new Decimal(0);

    //Upgrades
    var numUpgrades = Object.keys(IndustryUpgrades).length;
    this.upgrades = Array(numUpgrades).fill(0);

    this.state = "START";
    this.newInd = true;

    this.init();
}

Industry.prototype.init = function() {
    //Set the unique properties of an industry (how much its affected by real estate/scientific research, etc.)
    this.startingCost = IndustryStartingCosts[this.type];
    switch (this.type) {
        case Industries.Energy:
            this.reFac  = 0.65;
            this.sciFac = 0.7;
            this.robFac = 0.05;
            this.aiFac  = 0.3;
            this.advFac = 0.07;
            this.reqMats = {
                "Hardware": 0.1,
                "Metal":    0.25,
            };
            this.prodMats = ["Energy"];
            break;
        case Industries.Utilities:
        case "Utilities":
            this.reFac  = 0.4;
            this.sciFac = 0.6;
            this.robFac = 0.3;
            this.aiFac  = 0.3;
            this.advFac = 0.07;
            this.reqMats = {
                "Hardware": 0.1,
                "Metal":    0.2,
            }
            this.prodMats = ["Water"];
            break;
        case Industries.Agriculture:
            this.reFac  = 0.8;
            this.sciFac = 0.5;
            this.hwFac  = 0.2;
            this.robFac = 0.3;
            this.aiFac  = 0.3;
            this.advFac = 0.04;
            this.reqMats = {
                "Water":    0.5,
                "Energy":   0.5,
            }
            this.prodMats = ["Plants", "Food"];
            break;
        case Industries.Fishing:
            this.reFac  = 0.15;
            this.sciFac = 0.35;
            this.hwFac  = 0.35;
            this.robFac = 0.5;
            this.aiFac  = 0.2;
            this.advFac = 0.06;
            this.reqMats = {
                "Energy":   0.5,
            }
            this.prodMats = ["Food"];
            break;
        case Industries.Mining:
            this.reFac  = 0.3;
            this.sciFac = 0.25;
            this.hwFac  = 0.4;
            this.robFac = 0.5;
            this.aiFac  = 0.5;
            this.advFac = 0.04;
            this.reqMats = {
                "Energy":   0.8,
            }
            this.prodMats = ["Metal"];
            break;
        case Industries.Food:
            //reFac is unique for this bc it diminishes greatly per city. Handle this separately in code?
            this.sciFac = 0.12;
            this.hwFac  = 0.15;
            this.robFac = 0.3;
            this.aiFac  = 0.25;
            this.advFac = 0.25;
            this.reFac  = 0.05;
            this.reqMats = {
                "Food":     0.5,
                "Water":    0.5,
                "Energy":   0.2,
            }
            this.makesProducts = true;
            break;
        case Industries.Tobacco:
            this.reFac  = 0.15;
            this.sciFac = 0.75;
            this.hwFac  = 0.15;
            this.robFac = 0.2;
            this.aiFac  = 0.15;
            this.advFac = 0.2;
            this.reqMats = {
                "Plants":   1,
                "Water":    0.2,
            }
            this.makesProducts = true;
            break;
        case Industries.Chemical:
            this.reFac  = 0.25;
            this.sciFac = 0.75;
            this.hwFac  = 0.2;
            this.robFac = 0.25;
            this.aiFac  = 0.2;
            this.advFac = 0.05;
            this.reqMats = {
                "Plants":   1,
                "Energy":   0.5,
                "Water":    0.5,
            }
            this.prodMats = ["Chemicals"];
            break;
        case Industries.Pharmaceutical:
            this.reFac  = 0.05;
            this.sciFac = 0.8;
            this.hwFac  = 0.15;
            this.robFac = 0.25;
            this.aiFac  = 0.2;
            this.advFac = 0.15;
            this.reqMats = {
                "Chemicals":    2,
                "Energy":       1,
                "Water":        0.5,
            }
            this.prodMats = ["Drugs"];
            this.makesProducts = true;
            break;
        case Industries.Computer:
        case "Computer":
            this.reFac  = 0.2;
            this.sciFac = 0.65;
            this.robFac = 0.4;
            this.aiFac  = 0.2;
            this.advFac = 0.17;
            this.reqMats = {
                "Metal":    2.5,
                "Energy":   1,
            }
            this.prodMats = ["Hardware"];
            this.makesProducts = true;
            break;
        case Industries.Robotics:
            this.reFac  = 0.35;
            this.sciFac = 0.7;
            this.aiFac  = 0.4;
            this.advFac = 0.2;
            this.hwFac  = 0.2;
            this.reqMats = {
                "Hardware":     5,
                "Energy":       3,
            }
            this.prodMats = ["Robots"];
            this.makesProducts = true;
            break;
        case Industries.Software:
            this.sciFac = 0.7;
            this.advFac = 0.18;
            this.hwFac  = 0.25;
            this.reFac  = 0.1;
            this.aiFac  = 0.1;
            this.robFac = 0.05;
            this.reqMats = {
                "Hardware":     0.5,
                "Energy":       1,
            }
            this.prodMats = ["AICores"];
            this.makesProducts = true;
            break;
        case Industries.Healthcare:
            //reFac is unique for this bc it diminishes greatly per city. Handle this separately in code?
            this.sciFac = 0.75;
            this.advFac = 0.1;
            this.hwFac  = 0.1;
            this.robFac = 0.1;
            this.aiFac  = 0.1;
            this.reqMats = {
                "Robots":       10,
                "AICores":     5,
                "Energy":       5,
                "Water":        5,
            }
            this.makesProducts = true;
            break;
        case Industries.RealEstate:
            this.robFac = 0.6;
            this.aiFac  = 0.6;
            this.advFac = 0.25;
            this.sciFac = 0.05;
            this.hwFac  = 0.05;
            this.reqMats = {
                "Metal":    20,
                "Energy":   10,
                "Water":    10,
                "Hardware": 5
            }
            this.prodMats = ["RealEstate"];
            this.makesProducts = true;
            break;
        default:
            console.log("ERR: Invalid Industry Type passed into Industry.init(): " + this.type);
            return;
    }
}

Industry.prototype.getProductDescriptionText = function() {
    if (!this.makesProducts) {return;}
    switch (this.type) {
        case Industries.Food:
            return "create and manage restaurants";
            break;
        case Industries.Tobacco:
            return "create tobacco and tobacco-related products";
            break;
        case Industries.Pharmaceutical:
            return "develop new pharmaceutical drugs";
            break;
        case Industries.Computer:
        case "Computer":
            return "create new computer hardware and networking infrastructures";
            break;
        case Industries.Robotics:
            return "build specialized robots and robot-related products";
            break;
        case Industries.Software:
            return "develop computer software";
            break;
        case Industries.HealthCare:
            return "build and manage hospitals";
            break;
        case Industries.RealEstate:
            return "develop and manage real estate properties";
            break;
        default:
            console.log("ERROR: Invalid industry type in Industry.getProductDescriptionText");
            return "";
    }
}

//Calculates the values that factor into the production and properties of
//materials/products (such as quality, etc.)
Industry.prototype.calculateProductionFactors = function(city) {
    var warehouse = this.warehouses[city];
    if (!(warehouse instanceof Warehouse)) {
        this.prodMult = 0;
        return;
    }
    var materials = warehouse.materials,
        office = this.offices[city];
    //Production is multiplied by this
    this.prodMult = Math.pow(0.002 * materials.RealEstate.qty+1, this.reFac) *
                    Math.pow(0.002 * materials.Hardware.qty+1, this.hwFac) *
                    Math.pow(0.002 * materials.Robots.qty+1, this.robFac) *
                    Math.pow(0.002 * materials.AICores.qty+1, this.aiFac);
    if (this.prodMult < 1) {this.prodMult = 1;}
}

Industry.prototype.updateWarehouseSizeUsed = function(warehouse) {
    if (warehouse instanceof Warehouse) {
        //This resets the size back to 0 and then accounts for materials
        warehouse.updateMaterialSizeUsed();
    }

    for (var prodName in this.products) {
        if (this.products.hasOwnProperty(prodName)) {
            var prod = this.products[prodName];
            warehouse.sizeUsed += (prod.data[warehouse.loc][0] * prod.siz);
        }
    }
}

Industry.prototype.process = function(marketCycles=1, state, company) {
    this.state = state;

    //At the start of a cycle, store and reset revenue/expenses
    //Then calculate salaries and processs the markets
    if (state === "START") {
        if (isNaN(this.thisCycleRevenue) || isNaN(this.thisCycleExpenses)) {
            console.log("ERROR: NaN in Corporation's computed revenue/expenses");
            console.log(this.thisCycleRevenue.toString());
            console.log(this.thisCycleExpenses.toString());
            dialogBoxCreate("Something went wrong when compting Corporation's revenue/expenses. This is a bug. Please report to game developer");
            this.thisCycleRevenue = new Decimal(0);
            this.thisCycleExpenses = new Decimal(0);
        }
        this.lastCycleRevenue = this.thisCycleRevenue.dividedBy(marketCycles * SecsPerMarketCycle);
        this.lastCycleExpenses = this.thisCycleExpenses.dividedBy(marketCycles * SecsPerMarketCycle);
        this.thisCycleRevenue = new Decimal(0);
        this.thisCycleExpenses = new Decimal(0);

        //Once you start making revenue, the player should no longer be
        //considered new, and therefore no longer needs the 'tutorial' UI elements
        if (this.lastCycleRevenue.gt(0)) {this.newInd = false;}

        //Process offices (and the employees in them)
        var employeeSalary = 0;
        for (var officeLoc in this.offices) {
            if (this.offices.hasOwnProperty(officeLoc) &&
                this.offices[officeLoc] instanceof OfficeSpace) {
                employeeSalary += this.offices[officeLoc].process(marketCycles, {industry:this, corporation:company});
            }
        }
        this.thisCycleExpenses = this.thisCycleExpenses.plus(employeeSalary);

        //Process change in demand/competition of materials/products
        this.processMaterialMarket(marketCycles);
        this.processProductMarket(marketCycles);

        //Process loss of popularity
        this.popularity -= (marketCycles * .0001);
        this.popularity = Math.max(0, this.popularity);

        //Process Dreamsense gains
        var popularityGain = company.getDreamSenseGain(), awarenessGain = popularityGain * 4;
        if (popularityGain > 0) {
            this.popularity += (popularityGain * marketCycles);
            this.awareness += (awarenessGain * marketCycles);
        }

        return;
    }

    //Process production, purchase, and import/export of materials
    var res = this.processMaterials(marketCycles, company);
    this.thisCycleRevenue = this.thisCycleRevenue.plus(res[0]);
    this.thisCycleExpenses = this.thisCycleExpenses.plus(res[1]);

    //Process creation, production & sale of products
    res = this.processProducts(marketCycles, company);
    this.thisCycleRevenue = this.thisCycleRevenue.plus(res[0]);
    this.thisCycleExpenses = this.thisCycleExpenses.plus(res[1]);

}

//Process change in demand and competition for this industry's materials
Industry.prototype.processMaterialMarket = function(marketCycles=1) {
    //References to prodMats and reqMats
    var reqMats = this.reqMats, prodMats = this.prodMats;

    //Only 'process the market' for materials that this industry deals with
    for (var i = 0; i < Cities.length; ++i) {
        //If this industry has a warehouse in this city, process the market
        //for every material this industry requires or produces
        if (this.warehouses[Cities[i]] instanceof Warehouse) {
            var wh = this.warehouses[Cities[i]];
            for (var name in reqMats) {
                if (reqMats.hasOwnProperty(name)) {
                    wh.materials[name].processMarket();
                }
            }

            //Produced materials are stored in an array
            for (var foo = 0; foo < prodMats.length; ++foo) {
                wh.materials[prodMats[foo]].processMarket();
            }

            //Process these twice because these boost production
            wh.materials["Hardware"].processMarket();
            wh.materials["Robots"].processMarket();
            wh.materials["AICores"].processMarket();
            wh.materials["RealEstate"].processMarket();
        }
    }
}

//Process change in demand and competition for this industry's products
Industry.prototype.processProductMarket = function(marketCycles=1) {
    //Demand gradually decreases, and competition gradually increases
    for (var name in this.products) {
        if (this.products.hasOwnProperty(name)) {
            var product = this.products[name];
            var change = getRandomInt(1, 3) * 0.0004;
            if (this.type === Industries.Pharmaceutical || this.type === Industries.Software ||
                this.type === Industries.Robotics) {
                change *= 3;
            }
            change *= marketCycles;
            product.dmd -= change;
            product.cmp += change;
            product.cmp = Math.min(product.cmp, 99.99);
            product.dmd = Math.max(product.dmd, 0.001);
        }
    }
}

//Process production, purchase, and import/export of materials
Industry.prototype.processMaterials = function(marketCycles=1, company) {
    var revenue = 0, expenses = 0;
    for (var i = 0; i < Cities.length; ++i) {
        var city = Cities[i], office = this.offices[city];

        if (this.warehouses[city] instanceof Warehouse) {
            this.calculateProductionFactors(city);
            var warehouse = this.warehouses[city];

            switch(this.state) {

            case "PURCHASE":
            /* Process purchase of materials */
            for (var matName in warehouse.materials) {
                if (warehouse.materials.hasOwnProperty(matName)) {
                    (function(matName) {
                    var mat = warehouse.materials[matName];
                    var buyAmt = (mat.buy * SecsPerMarketCycle * marketCycles), maxAmt
                    if (matName == "RealEstate") {
                        maxAmt = buyAmt;
                    } else {
                        maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / MaterialSizes[matName]);
                    }
                    var buyAmt = Math.min(buyAmt, maxAmt);
                    if (buyAmt > 0) {
                        mat.qty += buyAmt;
                        expenses += (buyAmt * mat.bCost);
                    }
                    })(matName);
                    this.updateWarehouseSizeUsed(warehouse);
                }
            } //End process purchase of materials
            break;

            case "PRODUCTION":
            /* Process production of materials */
            if (this.prodMats.length > 0) {
                var mat = warehouse.materials[this.prodMats[0]];
                //Calculate the maximum production of this material based
                //on the office's productivity
                var maxProd = this.getOfficeProductivity(office) * this.prodMult * company.getProductionMultiplier(), prod;

                if (mat.prdman[0]) {
                    //Production is manually limited
                    prod = Math.min(maxProd, mat.prdman[1]);
                } else {
                    prod = maxProd;
                }
                prod *= (SecsPerMarketCycle * marketCycles); //Convert production from per second to per market cycle
                //Calculate net change in warehouse storage making
                //the produced materials will cost
                var totalMatSize = 0;
                for (var tmp = 0; tmp < this.prodMats.length; ++tmp) {
                    totalMatSize += (MaterialSizes[this.prodMats[tmp]]);
                }
                for (var reqMatName in this.reqMats) {
                    if (this.reqMats.hasOwnProperty(reqMatName)) {
                        var normQty = this.reqMats[reqMatName];
                        totalMatSize -= (MaterialSizes[reqMatName] * normQty);
                    }
                }
                //If not enough space in warehouse, limit the amount of produced materials
                if (totalMatSize > 0) {
                    var maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / totalMatSize);
                    prod = Math.min(maxAmt, prod);
                }

                //Make sure we have enough resource to make our materials
                var producableFrac = 1;
                for (var reqMatName in this.reqMats) {
                    if (this.reqMats.hasOwnProperty(reqMatName)) {
                        var req = this.reqMats[reqMatName] * prod;
                        if (warehouse.materials[reqMatName].qty < req) {
                            producableFrac = Math.min(producableFrac, warehouse.materials[reqMatName].qty / req);
                        }
                    }
                }
                if (producableFrac <= 0) {producableFrac = 0; prod = 0;}

                //Make our materials if they are producable
                if (producableFrac > 0 && prod > 0) {
                    for (var reqMatName in this.reqMats) {
                        if (this.reqMats.hasOwnProperty(reqMatName)) {
                            var reqMatQtyNeeded = (this.reqMats[reqMatName] * prod * producableFrac);
                            warehouse.materials[reqMatName].qty -= reqMatQtyNeeded;
                            warehouse.materials[reqMatName].prd = 0;
                            warehouse.materials[reqMatName].prd -= reqMatQtyNeeded / (SecsPerMarketCycle * marketCycles);
                        }
                    }
                    for (var j = 0; j < this.prodMats.length; ++j) {
                        warehouse.materials[this.prodMats[j]].qty += (prod * producableFrac);
                        warehouse.materials[this.prodMats[j]].qlt =
                            (office.employeeProd[EmployeePositions.Engineer] / 100 +
                             Math.pow(this.sciResearch.qty, this.sciFac) +
                             Math.pow(warehouse.materials["AICores"].qty, this.aiFac) / 10e3);
                    }
                } else {
                    for (var reqMatName in this.reqMats) {
                        if (this.reqMats.hasOwnProperty(reqMatName)) {
                            warehouse.materials[reqMatName].prd = 0;
                        }
                    }
                }

                //Per second
                var fooProd = prod * producableFrac / (SecsPerMarketCycle * marketCycles);
                for (var fooI = 0; fooI < this.prodMats.length; ++fooI) {
                    warehouse.materials[this.prodMats[fooI]].prd = fooProd;
                }
            } else {
                //If this doesn't produce any materials, then it only creates
                //Products. Creating products will consume materials. The
                //Production of all consumed materials must be set to 0
                for (var reqMatName in this.reqMats) {
                    if (this.reqMats.hasOwnProperty(reqMatName)) {
                        warehouse.materials[reqMatName].prd = 0;
                    }
                }
            }
            break;

            case "SALE":
            /* Process sale of materials */
            for (var matName in warehouse.materials) {
                if (warehouse.materials.hasOwnProperty(matName)) {
                    var mat = warehouse.materials[matName];
                    if (mat.sCost < 0 || mat.sllman[0] === false) {
                        mat.sll = 0;
                        continue;
                    }
                    var mat = warehouse.materials[matName];

                    var sCost;
                    if (isString(mat.sCost)) {
                        sCost = mat.sCost.replace(/MP/g, mat.bCost);
                        sCost = eval(sCost);
                    } else {
                        sCost = mat.sCost;
                    }

                    //Calculate how much of the material sells (per second)
                    var markup = 1, markupLimit = mat.qlt / mat.mku;
                    if (sCost > mat.bCost) {
                        //Penalty if difference between sCost and bCost is greater than markup limit
                        if ((sCost - mat.bCost) > markupLimit) {
                            markup = markupLimit / (sCost - mat.bCost);
                        }
                    } else if (sCost < mat.bCost) {
                        if (sCost <= 0) {
                            markup = 1e12; //Sell everything, essentially discard
                        } else {
                            //Lower prices than market increases sales
                            markup = mat.bCost / sCost;
                        }
                    }
                    //var businessFactor = 1 + (office.employeeProd[EmployeePositions.Business] / office.employeeProd["total"]);
                    var businessFactor = this.getBusinessFactor(office);        //Business employee productivity
                    var advertisingFactor = this.getAdvertisingFactors()[0];    //Awareness + popularity
                    var marketFactor = this.getMarketFactor(mat);               //Competition + demand
                    var maxSell = (mat.qlt + .001) * marketFactor * markup * businessFactor *
                                  company.getSalesMultiplier() * advertisingFactor;

                    var sellAmt;
                    if (mat.sllman[1] !== -1) {
                        //Sell amount is manually limited
                        sellAmt = Math.min(maxSell, mat.sllman[1]);
                    } else {
                        sellAmt = maxSell;
                    }
                    sellAmt = (sellAmt * SecsPerMarketCycle * marketCycles);
                    sellAmt = Math.min(mat.qty, sellAmt);
                    if (sellAmt < 0) {
                        console.log("ERROR: sellAmt is negative");
                        continue;
                    }
                    if (sellAmt && sCost >= 0) {
                        mat.qty -= sellAmt;
                        revenue += (sellAmt * sCost);
                        mat.sll = sellAmt / (SecsPerMarketCycle * marketCycles);
                    } else {
                        mat.sll = 0;
                    }
                }
            } //End processing of sale of materials
            break;

            case "EXPORT":
                for (var matName in warehouse.materials) {
                    if (warehouse.materials.hasOwnProperty(matName)) {
                        var mat = warehouse.materials[matName];
                        for (var expI = 0; expI < mat.exp.length; ++expI) {
                            var exp = mat.exp[expI];
                            var amt = exp.amt * SecsPerMarketCycle * marketCycles;
                            if (mat.qty <= amt) {
                                amt = mat.qty;
                            }
                            if (amt === 0) {
                                break; //None left
                            }
                            for (var foo = 0; foo < company.divisions.length; ++foo) {
                                if (company.divisions[foo].name === exp.ind) {
                                    var expIndustry = company.divisions[foo];
                                    var expWarehouse = expIndustry.warehouses[exp.city];
                                    if (!(expWarehouse instanceof Warehouse)) {
                                        console.log("ERROR: Invalid export!");
                                        break;
                                    }
                                    expWarehouse.materials[mat.name].qty += amt;
                                    mat.qty -= amt;
                                    break;
                                }
                            }
                        }
                    }
                }

                break;

            case "START":
                break;
            default:
                console.log("ERROR: Invalid state: " + this.state);
                break;
            } //End switch(this.state)
            this.updateWarehouseSizeUsed(warehouse);

        } // End warehouse

        //Produce Scientific Research based on R&D employees
        //Scientific Research can be produced without a warehouse
        if (office instanceof OfficeSpace) {
            this.sciResearch.qty += (.01 * Math.pow(office.employeeProd[EmployeePositions.RandD], 0.5)
                                     * company.getScientificResearchMultiplier());
        }
    }
    return [revenue, expenses];
}

//Process production & sale of this industry's FINISHED products (including all of their stats)
Industry.prototype.processProducts = function(marketCycles=1, corporation) {
    var revenue = 0, expenses = 0;

    //Create products
    if (this.state === "PRODUCTION") {
        for (var prodName in this.products) {
            if (this.products.hasOwnProperty(prodName)) {
                var prod = this.products[prodName];
                if (!prod.fin) {
                    var city = prod.createCity, office = this.offices[city];
                    var total = office.employeeProd[EmployeePositions.Operations] +
                                office.employeeProd[EmployeePositions.Engineer] +
                                office.employeeProd[EmployeePositions.Management], ratio;
                    if (total === 0) {
                        ratio = 0;
                    } else {
                        ratio = office.employeeProd[EmployeePositions.Engineer] / total +
                                office.employeeProd[EmployeePositions.Operations] / total +
                                office.employeeProd[EmployeePositions.Management] / total;
                    }
                    prod.createProduct(marketCycles, ratio * Math.pow(total, 1));
                    //prod.createProduct(marketCycles, ratio * Math.pow(total, 0.3));
                    if (prod.prog >= 100) {
                         prod.finishProduct(office.employeeProd, this);
                    }
                    break;
                }
            }
        }
    }

    //Produce Products
    for (var prodName in this.products) {
        if (this.products.hasOwnProperty(prodName)) {
            var prod = this.products[prodName];
            if (prod instanceof Product && prod.fin) {
                revenue += this.processProduct(marketCycles, prod, corporation);
            }
        }
    }
    return [revenue, expenses];
}

//Processes FINISHED products
Industry.prototype.processProduct = function(marketCycles=1, product, corporation) {
    var totalProfit = 0;
    for (var i = 0; i < Cities.length; ++i) {
        var city = Cities[i], office = this.offices[city], warehouse = this.warehouses[city];
        if (warehouse instanceof Warehouse) {
            switch(this.state) {

            case "PRODUCTION":
            //Calculate the maximum production of this material based
            //on the office's productivity
            var maxProd = this.getOfficeProductivity(office, {forProduct:true}) *
                          corporation.getProductionMultiplier() * this.prodMult, prod;

            //Account for whether production is manually limited
            if (product.prdman[city][0]) {
                prod = Math.min(maxProd, product.prdman[city][1]);
            } else {
                prod = maxProd;
            }
            prod *= (SecsPerMarketCycle * marketCycles);

            //Calculate net change in warehouse storage making the Products will cost
            var netStorageSize = product.siz;
            for (var reqMatName in product.reqMats) {
                if (product.reqMats.hasOwnProperty(reqMatName)) {
                    var normQty = product.reqMats[reqMatName];
                    netStorageSize -= (MaterialSizes[reqMatName] * normQty);
                }
            }

            //If there's not enough space in warehouse, limit the amount of Product
            if (netStorageSize > 0) {
                var maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / netStorageSize);
                prod = Math.min(maxAmt, prod);
            }

            //Make sure we have enough resources to make our Products
            var producableFrac = 1;
            for (var reqMatName in product.reqMats) {
                if (product.reqMats.hasOwnProperty(reqMatName)) {
                    var req = product.reqMats[reqMatName] * prod;
                    if (warehouse.materials[reqMatName].qty < req) {
                        producableFrac = Math.min(producableFrac, warehouse.materials[reqMatName].qty / req);
                    }
                }
            }

            //Make our Products if they are producable
            if (producableFrac > 0 && prod > 0) {
                for (var reqMatName in product.reqMats) {
                    if (product.reqMats.hasOwnProperty(reqMatName)) {
                        var reqMatQtyNeeded = (product.reqMats[reqMatName] * prod * producableFrac);
                        warehouse.materials[reqMatName].qty -= reqMatQtyNeeded;
                        warehouse.materials[reqMatName].prd -= reqMatQtyNeeded / (SecsPerMarketCycle * marketCycles);
                    }
                }
                //Quantity
                product.data[city][0] += (prod * producableFrac);
            }

            //Keep track of production Per second
            product.data[city][1] = prod * producableFrac / (SecsPerMarketCycle * marketCycles);
            break;

            case "SALE":
            //Process sale of Products
            product.pCost = 0; //Estimated production cost
            for (var reqMatName in product.reqMats) {
                if (product.reqMats.hasOwnProperty(reqMatName)) {
                    product.pCost += (product.reqMats[reqMatName] * warehouse.materials[reqMatName].bCost);
                }
            }

            //Since its a product, its production cost is increased for labor
            product.pCost *= 3;

            var markup = 1, markupLimit = product.rat / product.mku;
            if (product.sCost > product.pCost) {
                if ((product.sCost - product.pCost) > markupLimit) {
                    markup = markupLimit / (product.sCost - product.pCost);
                }
            }
            //var businessFactor = 1 + (office.employeeProd[EmployeePositions.Business] / office.employeeProd["total"]);
            var businessFactor = this.getBusinessFactor(office);        //Business employee productivity
            var advertisingFactor = this.getAdvertisingFactors()[0];    //Awareness + popularity
            var marketFactor = this.getMarketFactor(product);        //Competition + demand
            var maxSell = Math.pow(product.rat, 0.9) * marketFactor * corporation.getSalesMultiplier() *
                          markup * businessFactor * advertisingFactor;
            var sellAmt;
            if (product.sllman[city][0] && product.sllman[city][1] > 0) {
                //Sell amount is manually limited
                sellAmt = Math.min(maxSell, product.sllman[city][1]);
            } else {
                sellAmt = maxSell;
            }
            sellAmt = sellAmt * SecsPerMarketCycle * marketCycles;
            sellAmt = Math.min(product.data[city][0], sellAmt); //data[0] is qty
            if (sellAmt && product.sCost) {
                product.data[city][0] -= sellAmt; //data[0] is qty
                totalProfit += (sellAmt * product.sCost);
                product.data[city][2] = sellAmt / (SecsPerMarketCycle * marketCycles); //data[2] is sell property
            } else {
                product.data[city][2] = 0; //data[2] is sell property
            }
            break;

            case "START":
            case "PURCHASE":
            case "EXPORT":
                break;
            default:
                console.log("ERROR: Invalid State: " + this.state);
                break;
            } //End switch(this.state)
        }
    }
    return totalProfit;
}

Industry.prototype.discontinueProduct = function(product, parentRefs) {
    var company = parentRefs.company, industry = parentRefs.industry;
    for (var productName in this.products) {
        if (this.products.hasOwnProperty(productName)) {
            if (product === this.products[productName]) {
                delete this.products[productName];
                company.updateUIContent();
            }
        }
    }
}

Industry.prototype.upgrade = function(upgrade, refs) {
    var corporation = refs.corporation, division = refs.division,
        office = refs.office;
    var upgN = upgrade[0], basePrice = upgrade[1], priceMult = upgrade[2],
        upgradeBenefit = upgrade[3];
    while (this.upgrades.length <= upgN) {this.upgrades.push(0);}
    ++this.upgrades[upgN];

    switch (upgN) {
        case 0: //Coffee, 5% energy per employee
            for (var i = 0; i < office.employees.length; ++i) {
                office.employees[i].ene = Math.min(office.employees[i].ene * 1.05, 100);
            }
            break;
        case 1: //AdVert.Inc,
            var advMult = corporation.getAdvertisingMultiplier();
            this.awareness += (4 * advMult);
            this.popularity += (1 * advMult);
            this.awareness *= (1.01 * advMult);
            this.popularity *= ((1 + getRandomInt(3, 6) / 100) * advMult);
            break;
        default:
            console.log("ERROR: Un-implemented function index: " + upgN);
            break;
    }
}

//Returns how much of a material can be produced based of office productivity (employee stats)
Industry.prototype.getOfficeProductivity = function(office, params) {
    var total = office.employeeProd[EmployeePositions.Operations] +
                office.employeeProd[EmployeePositions.Engineer] +
                office.employeeProd[EmployeePositions.Management], ratio;
    if (total === 0) {
        ratio = 0;
    } else {
        ratio = (office.employeeProd[EmployeePositions.Operations] / total) *
                (office.employeeProd[EmployeePositions.Engineer] / total) *
                (office.employeeProd[EmployeePositions.Management] / total);
        ratio = Math.max(0.01, ratio); //Minimum ratio value if you have employees
    }
    if (params && params.forProduct) {
        return ratio * Math.pow(total, 0.2);
    } else {
        return 2 * ratio * Math.pow(total, 0.3);
    }
}

//Returns a multiplier based on the office' 'Business' employees that affects sales
Industry.prototype.getBusinessFactor = function(office) {
    var ratioMult = 1;
    if (office.employeeProd["total"] > 0) {
        ratioMult = 1 + (office.employeeProd[EmployeePositions.Business] / office.employeeProd["total"]);
    }
    return ratioMult * Math.pow(1 + office.employeeProd[EmployeePositions.Business], 0.1);
}

//Returns a set of multipliers based on the Industry's awareness, popularity, and advFac. This
//multiplier affects sales. The result is:
//  [Total sales mult, total awareness mult, total pop mult, awareness/pop ratio mult]
Industry.prototype.getAdvertisingFactors = function() {
    var awarenessFac = Math.pow(this.awareness + 1, this.advFac);
    var popularityFac = Math.pow(this.popularity + 1, this.advFac);
    var ratioFac = (this.awareness === 0 ? 0.01 : Math.max((this.popularity + .001) / this.awareness, 0.01));
    var totalFac = awarenessFac * popularityFac * ratioFac;
    return [totalFac, awarenessFac, popularityFac, ratioFac];
}

//Returns a multiplier based on a materials demand and competition that affects sales
Industry.prototype.getMarketFactor = function(mat) {
    return mat.dmd * (100 - mat.cmp)/100;
}

Industry.prototype.toJSON = function() {
	return Generic_toJSON("Industry", this);
}

Industry.fromJSON = function(value) {
	return Generic_fromJSON(Industry, value.data);
}

Reviver.constructors.Industry = Industry;

var EmployeePositions = {
    Operations: "Operations",
    Engineer: "Engineer",
    Business: "Business",
    Management: "Management",
    RandD: "Research & Development",
    Training:"Training",
    Unassigned:"Unassigned",
}

function Employee(params={}) {
    if (!(this instanceof Employee)) {
        return new Employee(params);
    }
    this.name   = params.name           ? params.name           : "Bobby";

    //Morale, happiness, and energy are 0-100
    this.mor    = params.morale         ? params.morale         : getRandomInt(50, 100);
    this.hap    = params.happiness      ? params.happiness      : getRandomInt(50, 100);
    this.ene    = params.energy         ? params.energy         : getRandomInt(50, 100);

    this.age    = params.age            ? params.age            : getRandomInt(20, 50);
    this.int    = params.intelligence   ? params.intelligence   : getRandomInt(10, 50);
    this.cha    = params.charisma       ? params.charisma       : getRandomInt(10, 50);
    this.exp    = params.experience     ? params.experience     : getRandomInt(10, 50);
    this.cre    = params.creativity     ? params.creativity     : getRandomInt(10, 50);
    this.eff    = params.efficiency     ? params.efficiency     : getRandomInt(10, 50);
    this.sal    = params.salary         ? params.salary         : getRandomInt(0.1, 5);
    this.pro    = 0; //Productivity, This is calculated

    this.loc    = params.loc            ? params.loc : "";
    this.pos    = EmployeePositions.Unassigned;
}

//Returns the amount the employee needs to be paid
Employee.prototype.process = function(marketCycles=1, office) {
    var gain = 0.001 * marketCycles,
        det = gain * Math.random();
    this.age += gain;
    this.exp += gain;
    if (this.age > 150) {
        this.int -= det;
        this.eff -= det;
        this.cha -= det;
    }

    //Training
    var trainingEff = gain * Math.random();
    if (this.pos === EmployeePositions.Training) {
        //To increase creativity and intelligence special upgrades are needed
        this.cha += trainingEff;
        this.exp += trainingEff;
        this.eff += trainingEff;
    }

    //Weight based on how full office is
    //Too many employees = more likely to decrease energy and happiness
    var officeCapacityWeight = 0.5 * (office.employees.length / office.size - 0.5);
    if (Math.random() < 0.5 - officeCapacityWeight) {
        this.ene += det;
        this.hap += det;
    } else {
        this.ene -= det;
        this.hap -= det;
    }
    if (this.ene < office.minEne) {this.ene = office.minEne;}
    if (this.hap < office.minHap) {this.hap = office.minHap;}
    var salary = this.sal * marketCycles * SecsPerMarketCycle;
    return salary;
}

Employee.prototype.calculateProductivity = function(corporation) {
    var effCre = this.cre * corporation.getEmployeeCreMultiplier(),
        effCha = this.cha * corporation.getEmployeeChaMultiplier(),
        effInt = this.int * corporation.getEmployeeIntMultiplier(),
        effEff = this.eff * corporation.getEmployeeEffMultiplier();
    var prodBase = this.mor * this.hap * this.ene * 1e-6, prodMult;
    switch(this.pos) {
        //Calculate productivity based on position. This is multipled by prodBase
        //to get final value
        case EmployeePositions.Operations:
            prodMult = (0.6 * effInt) + (0.1 * effCha) + (this.exp) +
                       (0.5 * effCre) + (effEff);
            break;
        case EmployeePositions.Engineer:
            prodMult = (effInt) + (0.1 * effCha) + (1.5 * this.exp) +
                       (effEff);
            break;
        case EmployeePositions.Business:
            prodMult = (0.4 * effInt) + (effCha) + (0.5 * this.exp);
            break;
        case EmployeePositions.Management:
            prodMult = (2 * effCha) + (this.exp) + (0.2 * effCre) +
                       (0.7 * effEff);
            break;
        case EmployeePositions.RandD:
            prodMult = (1.5 * effInt) + (0.8 * this.exp) + (effCre) +
                       (0.5 * effEff);
            break;
        case EmployeePositions.Unassigned:
        case EmployeePositions.Training:
            prodMult = 0;
            break;
        default:
            console.log("ERROR: Invalid employee position: " + this.pos);
            break;
    }
    return prodBase * prodMult;
}

//Process benefits from having an office party thrown
Employee.prototype.throwParty = function(money) {
    var mult = 1 + (money / 10e6);
    this.mor *= mult;
    this.mor = Math.min(100, this.mor);
    this.hap *= mult;
    this.hap = Math.min(100, this.hap);
    return mult;
}

//'panel' is the DOM element on which to create the UI
Employee.prototype.createUI = function(panel, corporation) {
    var effCre = this.cre * corporation.getEmployeeCreMultiplier(),
        effCha = this.cha * corporation.getEmployeeChaMultiplier(),
        effInt = this.int * corporation.getEmployeeIntMultiplier(),
        effEff = this.eff * corporation.getEmployeeEffMultiplier();
    panel.style.color = "white";
    panel.appendChild(createElement("p", {
        id:"cmpy-mgmt-employee-" + this.name + "-panel-text",
        innerHTML:"Morale: " + formatNumber(this.mor, 3) + "<br>" +
                  "Happiness: " + formatNumber(this.hap, 3) + "<br>" +
                  "Energy: " + formatNumber(this.ene, 3) + "<br>" +
                  "Age: " + formatNumber(this.age, 3) + "<br>" +
                  "Intelligence: " + formatNumber(effInt, 3) + "<br>" +
                  "Charisma: " + formatNumber(effCha, 3) + "<br>" +
                  "Experience: " + formatNumber(this.exp, 3) + "<br>" +
                  "Creativity: " + formatNumber(effCre, 3) + "<br>" +
                  "Efficiency: " + formatNumber(effEff, 3) + "<br>" +
                  "Salary: " + numeral(this.sal).format("$0.000a") + "/ s<br>",
    }));

    //Selector for employee position
    var selector = createElement("select", {});
    for (var key in EmployeePositions) {
        if (EmployeePositions.hasOwnProperty(key)) {
            selector.add(createElement("option", {
                text: EmployeePositions[key],
                value: EmployeePositions[key],
            }));
        }
    }

    selector.addEventListener("change", ()=>{
        this.pos = selector.options[selector.selectedIndex].value;
    });

    //Set initial value of selector
    for (var i = 0; i < selector.length; ++i) {
        if (selector.options[i].value === this.pos) {
            selector.selectedIndex = i;
            break;
        }
    }
    panel.appendChild(selector);
}

Employee.prototype.updateUI = function(panel, corporation) {
    var effCre = this.cre * corporation.getEmployeeCreMultiplier(),
        effCha = this.cha * corporation.getEmployeeChaMultiplier(),
        effInt = this.int * corporation.getEmployeeIntMultiplier(),
        effEff = this.eff * corporation.getEmployeeEffMultiplier();
    if (panel == null) {
        console.log("ERROR: Employee.updateUI() called with null panel");
        return;
    }
    var text = document.getElementById("cmpy-mgmt-employee-" + this.name + "-panel-text");
    if (text == null) {
        return this.createUI(panel);
    }
    text.innerHTML  = "Morale: " + formatNumber(this.mor, 3) + "<br>" +
                      "Happiness: " + formatNumber(this.hap, 3) + "<br>" +
                      "Energy: " + formatNumber(this.ene, 3) + "<br>" +
                      "Age: " + formatNumber(this.age, 3) + "<br>" +
                      "Intelligence: " + formatNumber(effInt, 3) + "<br>" +
                      "Charisma: " + formatNumber(effCha, 3) + "<br>" +
                      "Experience: " + formatNumber(this.exp, 3) + "<br>" +
                      "Creativity: " + formatNumber(effCre, 3) + "<br>" +
                      "Efficiency: " + formatNumber(effEff, 3) + "<br>" +
                      "Salary: " + numeral(this.sal).format("$0.000a") + "/ s<br>";
}

Employee.prototype.toJSON = function() {
	return Generic_toJSON("Employee", this);
}

Employee.fromJSON = function(value) {
	return Generic_fromJSON(Employee, value.data);
}

Reviver.constructors.Employee = Employee;

var OfficeSpaceTiers = {
    Basic: "Basic",
    Enhanced: "Enhanced",
    Luxurious: "Luxurious",
    Extravagant: "Extravagant"
}

function OfficeSpace(params={}) {
    this.loc    = params.loc        ? params.loc        : "";
    this.cost   = params.cost       ? params.cost       : 1;
    this.size   = params.size       ? params.size       : 1;
    this.comf   = params.comfort    ? params.comfort    : 1;
    this.beau   = params.beauty      ? params.beauty     : 1;
    this.tier   = OfficeSpaceTiers.Basic;

    this.minEne     = 0; //Minimum energy of employees, based on office
    this.minHap     = 0; //Minimum happiness of employees, based on office.

    this.employees = [];
    this.employeeProd = {
        [EmployeePositions.Operations]:   0,
        [EmployeePositions.Engineer]:     0,
        [EmployeePositions.Business]:     0,
        [EmployeePositions.Management]:   0,
        [EmployeePositions.RandD]:        0,
        total:                            0,
    };
}

OfficeSpace.prototype.process = function(marketCycles=1, parentRefs) {
    var corporation = parentRefs.corporation, industry = parentRefs.industry;
    var perfMult=1; //Multiplier for employee morale/happiness/energy based on company performance
    if (industry.funds < 0 && industry.lastCycleRevenue < 0) {
        perfMult = Math.pow(0.99, marketCycles);
    } else if (industry.funds > 0 && industry.lastCycleRevenue > 0) {
        perfMult = Math.pow(1.01, marketCycles);
    }

    var salaryPaid = 0;
    for (var i = 0; i < this.employees.length; ++i) {
        var emp = this.employees[i];
        emp.mor *= perfMult;
        emp.hap *= perfMult;
        emp.ene *= perfMult;
        var salary = emp.process(marketCycles, this);
        salaryPaid += salary;
    }
    this.calculateEmployeeProductivity(marketCycles, corporation);
    return salaryPaid;
}

OfficeSpace.prototype.calculateEmployeeProductivity = function(marketCycles=1, corporation) {
    //Reset
    for (var name in this.employeeProd) {
        if (this.employeeProd.hasOwnProperty(name)) {
            this.employeeProd[name] = 0;
        }
    }

    var total = 0;
    for (var i = 0; i < this.employees.length; ++i) {
        var employee = this.employees[i];
        var prod = employee.calculateProductivity(corporation);
        this.employeeProd[employee.pos] += prod;
        total += prod;
    }
    this.employeeProd["total"] = total;
}

//Takes care of UI as well
OfficeSpace.prototype.findEmployees = function(parentRefs) {
    var company = parentRefs.corporation, division = parentRefs.division;
    if (document.getElementById("cmpy-mgmt-hire-employee-popup") != null) {return;}

    //Generate three random employees (meh, decent, amazing)
    var mult1 = getRandomInt(25, 50)/100,
        mult2 = getRandomInt(51, 75)/100,
        mult3 = getRandomInt(76, 100)/100;
    var int = getRandomInt(50, 100),
        cha = getRandomInt(50, 100),
        exp = getRandomInt(50, 100),
        cre = getRandomInt(50, 100),
        eff = getRandomInt(50, 100),
        sal = 2.2 * (int + cha + exp + cre + eff);

    var emp1 = new Employee({
        intelligence: int * mult1,
        charisma: cha * mult1,
        experience: exp * mult1,
        creativity: cre * mult1,
        efficiency: eff * mult1,
        salary: sal * mult1,
    });

    var emp2 = new Employee({
        intelligence: int * mult2,
        charisma: cha * mult2,
        experience: exp * mult2,
        creativity: cre * mult2,
        efficiency: eff * mult2,
        salary: sal * mult2,
    });

    var emp3 = new Employee({
        intelligence: int * mult3,
        charisma: cha * mult3,
        experience: exp * mult3,
        creativity: cre * mult3,
        efficiency: eff * mult3,
        salary: sal * mult3,
    });

    var text = createElement("h1", {
        innerHTML: "Select one of the following candidates for hire:",
    });

    var createEmpDiv = function(employee, office) {
        var div = createElement("div", {
            class:"cmpy-mgmt-find-employee-option",
            innerHTML:  "Intelligence: " + formatNumber(employee.int, 1) + "<br>" +
                        "Charisma: " + formatNumber(employee.cha, 1) + "<br>" +
                        "Experience: " + formatNumber(employee.exp, 1) + "<br>" +
                        "Creativity: " + formatNumber(employee.cre, 1) + "<br>" +
                        "Efficiency: " + formatNumber(employee.eff, 1) + "<br>" +
                        "Salary: " + numeral(employee.sal).format('$0.000a') + " \ s<br>",
            clickListener:()=>{
                office.hireEmployee(employee, parentRefs);
                removeElementById("cmpy-mgmt-hire-employee-popup");
                return false;
            }
        });
        return div;
    };

    var cancelBtn = createElement("a", {
        class:"a-link-button",
        innerText:"Cancel",
        float:"right",
        clickListener:()=>{
            removeElementById("cmpy-mgmt-hire-employee-popup");
            return false;
        }
    });

    var elems = [text,
                 createEmpDiv(emp1, this),
                 createEmpDiv(emp2, this),
                 createEmpDiv(emp3, this),
                 cancelBtn];

    createPopup("cmpy-mgmt-hire-employee-popup", elems);
}

OfficeSpace.prototype.hireEmployee = function(employee, parentRefs) {
    var company = parentRefs.corporation, division = parentRefs.division;
    var yesBtn = yesNoTxtInpBoxGetYesButton(),
        noBtn = yesNoTxtInpBoxGetNoButton();
    yesBtn.innerHTML = "Hire";
    noBtn.innerHTML = "Cancel";
    yesBtn.addEventListener("click", ()=>{
        var name = yesNoTxtInpBoxGetInput();
        for (var i = 0; i < this.employees.length; ++i) {
            if (this.employees[i].name === name) {
                dialogBoxCreate("You already have an employee with this nickname! Please give every employee a unique nickname.");
                return false;
            }
        }
        employee.name = name;
        this.employees.push(employee);
        company.displayDivisionContent(division, currentCityUi);
        return yesNoTxtInpBoxClose();
    });
    noBtn.addEventListener("click", ()=>{
        return yesNoTxtInpBoxClose();
    });
    yesNoTxtInpBoxCreate("Give your employee a nickname!");
}

OfficeSpace.prototype.hireRandomEmployee = function(parentRefs) {
    var company = parentRefs.corporation, division = parentRefs.division;
    if (document.getElementById("cmpy-mgmt-hire-employee-popup") != null) {return;}

    //Generate three random employees (meh, decent, amazing)
    var mult = getRandomInt(76, 100)/100;
    var int = getRandomInt(50, 100),
        cha = getRandomInt(50, 100),
        exp = getRandomInt(50, 100),
        cre = getRandomInt(50, 100),
        eff = getRandomInt(50, 100),
        sal = 2.2 * (int + cha + exp + cre + eff);

    var emp = new Employee({
        intelligence: int * mult,
        charisma: cha * mult,
        experience: exp * mult,
        creativity: cre * mult,
        efficiency: eff * mult,
        salary: sal * mult,
    });

    var name = generateRandomString(7);

    for (var i = 0; i < this.employees.length; ++i) {
        if (this.employees[i].name === name) {
            return this.hireRandomEmployee(parentRefs);
        }
    }
    emp.name = name;
    this.employees.push(emp);
    company.displayDivisionContent(division, currentCityUi);
}

//Finds the first unassigned employee and assigns its to the specified job
OfficeSpace.prototype.assignEmployeeToJob = function(job) {
    for (var i = 0; i < this.employees.length; ++i) {
        if (this.employees[i].pos === EmployeePositions.Unassigned) {
            this.employees[i].pos = job;
            return true;
        }
    }
    return false;
}

//Finds the first employee with the given job and unassigns it
OfficeSpace.prototype.unassignEmployeeFromJob = function(job) {
    for (var i = 0; i < this.employees.length; ++i) {
        if (this.employees[i].pos === job) {
            this.employees[i].pos = EmployeePositions.Unassigned;
            return true;
        }
    }
    return false;
}

OfficeSpace.prototype.toJSON = function() {
	return Generic_toJSON("OfficeSpace", this);
}

OfficeSpace.fromJSON = function(value) {
	return Generic_fromJSON(OfficeSpace, value.data);
}

Reviver.constructors.OfficeSpace = OfficeSpace;

function Warehouse(params={}) {
    this.loc    = params.loc        ? params.loc    : "";
    this.size   = params.size       ? params.size   : 0;
    this.level  = 0;

    this.sizeUsed = 0;

    this.materials = {
        Water:      new Material({name: "Water"}),
        Energy:     new Material({name: "Energy"}),
        Food:       new Material({name: "Food"}),
        Plants:     new Material({name: "Plants"}),
        Metal:      new Material({name: "Metal"}),
        Hardware:   new Material({name: "Hardware"}),
        Chemicals:  new Material({name: "Chemicals"}),
        Drugs:      new Material({name: "Drugs"}),
        Robots:     new Material({name: "Robots"}),
        AICores:    new Material({name: "AI Cores"}),
        RealEstate: new Material({name: "Real Estate"})
    }
}

Warehouse.prototype.updateMaterialSizeUsed = function() {
    this.sizeUsed = 0;
    for (var matName in this.materials) {
        if (this.materials.hasOwnProperty(matName)) {
            var mat = this.materials[matName];
            if (MaterialSizes.hasOwnProperty(matName)) {
                this.sizeUsed += (mat.qty * MaterialSizes[matName]);
            }
        }
    }
    if (this.sizeUsed > this.size) {
        console.log("ERROR: Warehouse size used greater than capacity, something went wrong");
    }
}

Warehouse.prototype.updateSize = function(corporation) {
    //Backwards compatibility
    if (this.level == null || this.level === 0) {
        this.level = Math.round(this.size / 100);
    }

    this.size = (this.level * 100) * corporation.getStorageMultiplier();
}

Warehouse.prototype.createUI = function(parentRefs) {
    if (parentRefs.company == null || parentRefs.industry == null) {
        console.log("ERROR: Warehouse.createUI called without parentRefs.company or parentRefs.industry");
        return;
    }
    var company = parentRefs.company, industry = parentRefs.industry;
    removeChildrenFromElement(industryWarehousePanel);
    var storageText = "Storage: " +
                      (this.sizedUsed >= this.size ? formatNumber(this.sizeUsed, 3) : formatNumber(this.sizeUsed, 3)) +
                      "/" + formatNumber(this.size, 3);
    industryWarehousePanel.appendChild(createElement("p", {
        innerHTML: storageText,
        display:"inline-block",
        color: this.sizeUsed >= this.size ? "red" : "white",
    }));

    //Upgrade warehouse size button
    var upgradeCost = WarehouseUpgradeBaseCost * Math.pow(1.07, Math.round(this.size / 100) - 1);
    industryWarehousePanel.appendChild(createElement("a", {
        innerText:"Upgrade Warehouse Size - " + numeral(upgradeCost).format('$0.000a'),
        display:"inline-block",
        class: company.funds.lt(upgradeCost) ? "a-link-button-inactive" : "a-link-button",
        clickListener:()=>{
            //Backwards compatibility
            if (this.level == null || this.level === 0) {
                this.level = Math.round(this.size / 100);
            }

            ++this.level;
            this.updateSize(company);
            company.funds = company.funds.minus(upgradeCost);
            this.createUI(parentRefs);
            return;
        }
    }));

    //Material requirement text
    var reqText = "This Industry uses [" + Object.keys(industry.reqMats).join(", ") +
                  "] in order to ";
    if (industry.prodMats.length > 0) {
        reqText += "produce [" + industry.prodMats.join(", ") + "] ";
        if (industry.makesProducts) {
            reqText += " and " + industry.getProductDescriptionText();
        }
    } else if (industry.makesProducts) {
        reqText += industry.getProductDescriptionText();
    }
    reqText += "<br><br>To get started with production, purchase your required " +
               "materials or import them from another of your company's divisions.<br><br>" +
               "Current state: ";
    switch(industry.state) {
        case "START":
            reqText += "Preparing...";
            break;
        case "PURCHASE":
            reqText += "Purchasing materials...";
            break;
        case "PRODUCTION":
            reqText += "Producing materials and/or products...";
            break;
        case "SALE":
            reqText += "Selling materials and/or products...";
            break;
        case "EXPORT":
            reqText += "Exporting materials and/or products...";
            break;
        default:
            console.log("ERROR: Invalid state: " + industry.state);
            break;
    }

    //Material ratio text for tooltip
    var reqRatioText = "The exact requirements for production are:<br>";
    for (var matName in industry.reqMats) {
        if (industry.reqMats.hasOwnProperty(matName)) {
            reqRatioText += (industry.reqMats[matName] + " " + matName + "<br>");
        }
    }
    reqRatioText += "in order to create ";
    if (industry.prodMats.length > 0) {
        reqRatioText += "one of each produced Material (" + industry.prodMats.join(", ") + ") ";
        if (industry.makesProducts) {
            reqRatioText += "or to create one of its Products";
        }
    } else if (industry.makesProducts) {
        reqRatioText += "one of its Products";
    }

    industryWarehousePanel.appendChild(createElement("p", {
        innerHTML:reqText, tooltipleft:reqRatioText
    }));

    //Materials
    industryWarehousePanel.appendChild(createElement("p", {
        innerHTML: "<br>Materials:<br>",
    }));
    for (var matName in this.materials) {
        if (this.materials.hasOwnProperty(matName) && this.materials[matName] instanceof Material) {
            if (Object.keys(industry.reqMats).includes(matName) || industry.prodMats.includes(matName) ||
                matName === "Hardware" || matName === "Robots" || matName === "AICores" ||
                matName === "RealEstate") {
                this.createMaterialUI(this.materials[matName], matName, parentRefs);
            }
        }
    }

    //Products
    if (!(industry.makesProducts && Object.keys(industry.products).length > 0)) {return;}
    industryWarehousePanel.appendChild(createElement("p", {
        innerHTML: "<br>Products:<br>",
    }));
    for (var productName in industry.products) {
        if (industry.products.hasOwnProperty(productName) && industry.products[productName] instanceof Product) {
            this.createProductUI(industry.products[productName], parentRefs);
        }
    }
}

Warehouse.prototype.createMaterialUI = function(mat, matName, parentRefs) {
    if (parentRefs.company == null || parentRefs.industry == null) {
        console.log("ERROR: Warehouse.createMaterialUI called without industry or company parent refs");
        return;
    }
    var company = parentRefs.company, industry = parentRefs.industry;
    var purchasePopupId = "cmpy-mgmt-material-purchase-popup",
        sellPopupid = "cmpy-mgmt-material-sell-popup";
    var div = createElement("div", {
        class:"cmpy-mgmt-warehouse-material-div",
    });

    var totalExport = 0;
    for (var i = 0; i < mat.exp.length; ++i) {
        totalExport += mat.exp[i].amt;
    }
    var totalGain = mat.buy + mat.prd + mat.imp - mat.sll - totalExport;

    //If Market Research upgrades are unlocked, add competition and demand info
    var cmpAndDmdText = "";
    if (company.unlockUpgrades[2] === 1) {
        cmpAndDmdText += "<br>Competition: " + formatNumber(mat.cmp, 3);
    }
    if (company.unlockUpgrades[3] === 1) {
        cmpAndDmdText += "<br>Demand: " + formatNumber(mat.dmd, 3);
    }
    var innerTxt = "<p class='tooltip'>" + mat.name + ": " + formatNumber(mat.qty, 3) +
                   "(" + formatNumber(totalGain, 3) +  "/s)" +
                   "<span class='tooltiptext'>Buy: " + formatNumber(mat.buy, 3) +
                   "/s<br>Prod: " + formatNumber(mat.prd, 3) + "/s<br>Sell: " + formatNumber(mat.sll, 3) +
                   "/s<br>Export: " + formatNumber(totalExport, 3) + "/s<br>Import: " +
                   formatNumber(mat.imp, 3) + "/s" + cmpAndDmdText + "</span></p><br>" +
                   "<p class='tooltip'>MP: $" + formatNumber(mat.bCost, 2) +
                   "<span class='tooltiptext'>Market Price: The price you would pay if " +
                   "you were to buy this material on the market</span></p><br>" +
                   "<p class='tooltip'>Quality: " + formatNumber(mat.qlt, 2) +
                   "<span class='tooltiptext'>The quality of your material. Higher quality " +
                   "will lead to more sales</span></p>";

    div.appendChild(createElement("p", {
        innerHTML: innerTxt,
        id: "cmpy-mgmt-warehouse-" + matName + "-text", display:"inline-block",
    }));

    var buttonPanel = createElement("div", {
        display:"inline-block",
    });
    div.appendChild(buttonPanel);

    //Button to set purchase amount
    var tutorial = industry.newInd && Object.keys(industry.reqMats).includes(mat.name) &&
                   mat.buy === 0 && mat.imp === 0;
    var buyButtonParams = {
        innerText: "Buy (" + formatNumber(mat.buy, 3) + ")", display:"inline-block",
        class: tutorial ? "a-link-button flashing-button" : "a-link-button",
        clickListener:()=>{
            var txt = createElement("p", {
                innerHTML: "Enter the amount of " + mat.name + " you would like " +
                           "to purchase per second. This material's cost changes constantly"
            });
            var confirmBtn;
            var input = createElement("input", {
                type:"number", value:mat.buy ? mat.buy : null, placeholder: "Purchase amount",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === 13) {
                        confirmBtn.click();
                    }
                }
            });
            confirmBtn = createElement("a", {
                innerText:"Confirm", class:"a-link-button",
                clickListener:()=>{
                    if (isNaN(input.value)) {
                        dialogBoxCreate("Invalid amount");
                    } else {
                        mat.buy = parseFloat(input.value);
                        if (isNaN(mat.buy)) {mat.buy = 0;}
                        removeElementById(purchasePopupId);
                        this.createUI(parentRefs);
                        return false;
                    }
                }
            });
            var clearButton = createElement("a", {
                innerText:"Clear Purchase", class:"a-link-button",
                clickListener:()=>{
                    mat.buy = 0;
                    removeElementById(purchasePopupId);
                    this.createUI(parentRefs);
                    return false;
                }
            });
            var cancelBtn = createElement("a", {
                innerText:"Cancel", class:"a-link-button",
                clickListener:()=>{
                    removeElementById(purchasePopupId);
                }
            });
            createPopup(purchasePopupId, [txt, input, confirmBtn, clearButton, cancelBtn]);
            input.focus();
        }
    };
    if (tutorial) {
        buyButtonParams.tooltip = "Purchase your required materials to get production started!";
    }
    buttonPanel.appendChild(createElement("a", buyButtonParams));

    //Button to manage exports
    if (company.unlockUpgrades[0] === 1) { //Export unlock upgrade
        function createExportPopup() {
            var popupId = "cmpy-mgmt-export-popup";
            var exportTxt = createElement("p", {
                innerText:"Select the industry and city to export this material to, as well as " +
                          "how much of this material to export per second. You can set the export " +
                          "amount to 'MAX' to export all of the materials in this warehouse."
            });

            //Select industry and city to export to
            var industrySelector = createElement("select", {}),
                citySelector = createElement("select", {});
            for (var i = 0; i < company.divisions.length; ++i) {
                industrySelector.add(createElement("option", {
                    text:company.divisions[i].name, value:company.divisions[i].name,
                    changeListener:()=>{
                        var industryName = industrySelector.options[industrySelector.selectedIndex].value;
                        for (var foo = 0; foo < company.divisions.length; ++foo) {
                            if (company.divisions[foo].name == industryName) {
                                clearSelector(citySelector);
                                var selectedIndustry = company.divisions[foo];
                                for (var cityName in company.divisions[foo].warehouses) {
                                    if (company.divisions[foo].warehouses[cityName] instanceof Warehouse) {
                                        citySelector.add(createElement("option", {
                                            value:cityName, text:cityName,
                                        }));
                                    }
                                }
                                return;
                            }
                        }
                    }
                })); //End create element option
            } //End for

            var currIndustry = industrySelector.options[industrySelector.selectedIndex].value;
            for (var i = 0; i < company.divisions.length; ++i) {
                if (company.divisions[i].name == currIndustry) {
                    for (var cityName in company.divisions[i].warehouses) {
                        if (company.divisions[i].warehouses.hasOwnProperty(cityName) &&
                            company.divisions[i].warehouses[cityName] instanceof Warehouse) {
                            citySelector.add(createElement("option", {
                                value:cityName, text:cityName,
                            }));
                        }
                    }
                    break;
                }
            }

            //Select amount to export
            var exportAmount = createElement("input", {
                type:"number", placeholder:"Export amount / s"
            });

            var exportBtn  = createElement("a", {
                class:"a-link-button", display:"inline-block", innerText:"Export",
                clickListener:()=>{
                    var industryName = industrySelector.options[industrySelector.selectedIndex].text,
                        cityName = citySelector.options[citySelector.selectedIndex].text,
                        amt = parseFloat(exportAmount.value);
                    if (isNaN(amt)) {
                        dialogBoxCreate("Invalid amount entered for export");
                        return;
                    }
                    var exportObj = {ind:industryName, city:cityName, amt:amt};
                    mat.exp.push(exportObj);

                    //Go to the target city and increase the mat.imp attribute for the corresponding material
                    for (var i = 0; i < company.divisions.length; ++i) {
                        if (company.divisions[i].name === industryName) {
                            var warehouse = company.divisions[i].warehouses[cityName];
                            if (warehouse instanceof Warehouse) {
                                warehouse.materials[matName].imp += amt;
                                removeElementById(popupId);
                                return false;
                            } else {
                                console.log("ERROR: Target city for export does not have warehouse in specified city");
                            }
                        }
                    }
                    console.log("ERROR: Could not find target industry/city for export");
                    removeElementById(popupId);
                    return false;
                }
            });

            var cancelBtn = createElement("a", {
                class:"a-link-button", display:"inline-block", innerText:"Cancel",
                clickListener:()=>{
                    removeElementById(popupId);
                    return false;
                }
            });

            var currExportsText = createElement("p", {
                innerText:"Below is a list of all current exports of this material from this warehouse. " +
                          "Clicking on one of the exports below will REMOVE that export."
            });
            var currExports = [];
            for (var i = 0; i < mat.exp.length; ++i) {
                (function(i, mat, currExports){
                currExports.push(createElement("div", {
                    class:"cmpy-mgmt-existing-export",
                    innerHTML: "Industry: " + mat.exp[i].ind + "<br>" +
                               "City: " + mat.exp[i].city + "<br>" +
                               "Amount/s: " + mat.exp[i].amt,
                    clickListener:()=>{
                        //Go to the target city and decrease the mat.imp attribute for the corresponding material
                        for (var j = 0; j < company.divisions.length; ++j) {
                            if (company.divisions[j].name === mat.exp[i].ind) {
                                var warehouse = company.divisions[j].warehouses[mat.exp[i].city];
                                if (warehouse instanceof Warehouse) {
                                    warehouse.materials[matName].imp -= mat.exp[i].amt;
                                } else {
                                    console.log("ERROR: Target city for export does not have warehouse in specified city");
                                }
                            }
                        }
                        mat.exp.splice(i, 1); //Remove export object
                        removeElementById(popupId);
                        createExportPopup();
                    }
                }));
                })(i, mat, currExports);
            }
            createPopup(popupId, [exportTxt, industrySelector, citySelector, exportAmount,
                                  exportBtn, cancelBtn, currExportsText].concat(currExports));
        }
        buttonPanel.appendChild(createElement("a", {
            innerText:"Export", display:"inline-block", class:"a-link-button",
            clickListener:()=>{createExportPopup();}
        }));
    }

    buttonPanel.appendChild(createElement("br", {})); // Force line break

    //Button to set sell amount
    var innerTextString;
    if (mat.sllman[0]) {
        innerTextString = (mat.sllman[1] === -1 ? "Sell (" + formatNumber(mat.sll, 3) + "/MAX)" :
                          "Sell (" + formatNumber(mat.sll, 3) + "/" + formatNumber(mat.sllman[1], 3) + ")");
        if (mat.sCost) {
            if (isString(mat.sCost)) {
                var sCost = mat.sCost.replace(/MP/g, mat.bCost);
                innerTextString += " @ $" + formatNumber(eval(sCost), 2);
            } else {
                innerTextString += " @ $" + formatNumber(mat.sCost, 2);
            }
        }
    } else {
        innerTextString = "Sell (0.000/0.000)";
    }

    buttonPanel.appendChild(createElement("a", {
        innerText: innerTextString, display:"inline-block", class:"a-link-button",
        clickListener:()=>{
            var txt = createElement("p", {
                innerHTML: "Enter the maximum amount of " + mat.name + " you would like " +
                           "to sell per second, as well as the price at which you would " +
                           "like to sell at.<br><br>" +
                           "If the sell amount is set to 0, then the material will not be sold. If the sell price " +
                           "if set to 0, then the material will be discarded<br><br>" +
                           "Setting the sell amount to 'MAX' will result in you always selling the " +
                           "maximum possible amount of the material.<br><br>" +
                           "When setting the sell price, you can use the 'MP' variable to designate a dynamically " +
                           "changing price that depends on the market price. For example, if you set the sell price " +
                           "to 'MP+10' then it will always be sold at $10 above the market price.",
            });
            var br = createElement("br", {});
            var confirmBtn;
            var inputQty = createElement("input", {
                type:"text", marginTop:"4px",
                value: mat.sllman[1] ? mat.sllman[1] : null, placeholder: "Sell amount",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === 13) {confirmBtn.click();}
                }
            });
            var inputPx = createElement("input", {
                type:"text", marginTop:"4px",
                value: mat.sCost ? mat.sCost : null, placeholder: "Sell price",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === 13) {confirmBtn.click();}
                }
            });
            confirmBtn = createElement("a", {
                innerText:"Confirm", class:"a-link-button", margin:"6px",
                clickListener:()=>{
                    //Parse price
                    //Sanitize cost
                    var cost = inputPx.value.replace(/\s+/g, '');
                    cost = cost.replace(/[^-()\d/*+.MP]/g, '');
                    var temp = cost.replace(/MP/g, mat.bCost);
                    var temp = eval(temp);
                    if (temp == null || isNaN(temp)) {
                        dialogBoxCreate("Invalid value or expression for sell price field");
                        return false;
                    }

                    if (cost.includes("MP")) {
                        mat.sCost = cost; //Dynamically evaluated
                    } else {
                        mat.sCost = temp;
                    }

                    //Parse quantity
                    if (inputQty.value === "MAX") {
                        mat.sllman[0] = true;
                        mat.sllman[1] = -1;
                    } else if (isNaN(inputQty.value)) {
                        dialogBoxCreate("Invalid value for sell quantity field! Must be numeric or 'MAX'");
                        return false;
                    } else {
                        var qty = parseFloat(inputQty.value);
                        if (isNaN(qty)) {qty = 0;}
                        if (qty === 0) {
                            mat.sllman[0] = false;
                            mat.sllman[1] = 0;
                        } else {
                            mat.sllman[0] = true;
                            mat.sllman[1] = qty;
                        }
                    }

                    this.createUI(parentRefs);
                    removeElementById(sellPopupid);
                    return false;
                }
            });
            var cancelBtn = createElement("a", {
                innerText:"Cancel", class:"a-link-button", margin: "6px",
                clickListener:()=>{
                    removeElementById(sellPopupid);
                }
            });
            createPopup(sellPopupid, [txt, br, inputQty, inputPx, confirmBtn, cancelBtn]);
            inputQty.focus();
        }
    }));

    industryWarehousePanel.appendChild(div);
}

Warehouse.prototype.createProductUI = function(product, parentRefs) {
    var company = parentRefs.company, industry = parentRefs.industry,
        city = currentCityUi;
    var div = createElement("div", {
        class:"cmpy-mgmt-warehouse-product-div"
    });

    //Products being designed TODO
    if (!product.fin) {
        div.appendChild(createElement("p", {
            innerHTML: "Designing " + product.name + "...<br>" +
                        formatNumber(product.prog, 2) + "% complete",
        }));
        industryWarehousePanel.appendChild(div);
        return;
    }

    //Completed products
    var cmpAndDmdText = "";
    if (company.unlockUpgrades[2] === 1) {
        cmpAndDmdText += "<br>Competition: " + formatNumber(product.cmp, 3);
    }
    if (company.unlockUpgrades[3] === 1) {
        cmpAndDmdText += "<br>Demand: " + formatNumber(product.dmd, 3);
    }
    var totalGain = product.data[city][1] - product.data[city][2]; //Production - sale
    div.appendChild(createElement("p", {
        innerHTML: "<p class='tooltip'>" + product.name + ": " + formatNumber(product.data[city][0], 3) + //Quantity
                   "(" + formatNumber(totalGain, 3) + "/s)" +
                   "<span class='tooltiptext'>Prod: " + formatNumber(product.data[city][1], 3) + "/s<br>" +
                   "Sell: " + formatNumber(product.data[city][2], 3) + "/s</span></p><br>" +
                   "<p class='tooltip'>Rating: " + formatNumber(product.rat, 3) +
                   "<span class='tooltiptext'>Quality: " + formatNumber(product.qlt, 3) + "<br>" +
                   "Performance: " + formatNumber(product.per, 3) + "<br>" +
                   "Durability: " + formatNumber(product.dur, 3) + "<br>" +
                   "Reliability: " + formatNumber(product.rel, 3) + "<br>" +
                   "Aesthetics: " + formatNumber(product.aes, 3) + "<br>" +
                   "Features: " + formatNumber(product.fea, 3) +
                   cmpAndDmdText + "</span></p><br>" +
                   "<p class='tooltip'>Est. Production Cost: " + numeral(product.pCost).format("$0.000a") +
                   "<span class='tooltiptext'>An estimate of how much it costs to produce one unit of this product. " +
                   "If your sell price exceeds this by too much, people won't buy your product. The better your " +
                   "product is, the higher you can mark up its price.</span></p><br>" +
                   "Size: " + formatNumber(product.siz, 3),
    }));
    var buttonPanel = createElement("div", {
        display:"inline-block",
    });
    div.appendChild(buttonPanel);

    //Sell button
    var sellInnerTextString = (product.sllman[city][1] === -1 ? "Sell (" + formatNumber(product.data[city][2], 3) + "/MAX)" :
                              "Sell (" + formatNumber(product.data[city][2], 3) + "/" + formatNumber(product.sllman[city][1], 3) + ")");
    if (product.sCost) {
        sellInnerTextString += (" @ " + numeral(product.sCost).format("$0.000a"));
    }
    div.appendChild(createElement("a", {
        innerText:sellInnerTextString, class:"a-link-button", display:"inline-block",margin:"6px",
        clickListener:()=>{
            var popupId = "cmpy-mgmt-sell-product-popup";
            var txt = createElement("p", {
                innerHTML:"Enter the maximum amount of " + product.name + " you would like " +
                          "to sell per second, as well as the price at which you would like to " +
                          "sell it at.<br><br>" +
                          "If the sell amount is set to 0, then the product will not be sold. If the " +
                          "sell price is set to 0, then the product will be discarded.<br><br>" +
                          "Setting the sell amount to 'MAX' will result in you always selling the " +
                          "maximum possible amount of the material.<br><br>",
            });
            var confirmBtn;
            var inputQty = createElement("input", {
                type:"text", value:product.sllman[city][1] ? product.sllman[city][1] : null, placeholder: "Sell amount",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === 13) {confirmBtn.click();}
                }
            });
            var inputPx = createElement("input", {
                type:"text", value: product.sCost ? product.sCost : null, placeholder: "Sell price",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === 13) {confirmBtn.click();}
                }
            });
            confirmBtn = createElement("a", {
                class:"a-link-button", innerText:"Confirm",
                clickListener:()=>{
                    //Parse price
                    var cost = parseFloat(inputPx.value);
                    if (isNaN(cost)) {
                        dialogBoxCreate("Invalid value for sell price field");
                        return false;
                    }
                    product.sCost = cost;

                    //Parse quantity
                    if (inputQty.value === "MAX") {
                        product.sllman[city][0] = true;
                        product.sllman[city][1] = -1;
                    } else if (isNaN(inputQty.value)) {
                        dialogBoxCreate("Invalid value for sell quantity field! Must be numeric");
                        return false;
                    } else {
                        var qty = parseFloat(inputQty.value);
                        if (isNaN(qty)) {qty = 0;}
                        if (qty === 0) {
                            product.sllman[city][0] = false;
                        } else {
                            product.sllman[city][0] = true;
                            product.sllman[city][1] = qty;
                        }
                    }
                    this.createUI(parentRefs);
                    removeElementById(popupId);
                    return false;
                }
            });
            var cancelBtn = createElement("a", {
                class:"a-link-button", innerText:"Cancel",
                clickListener:()=>{
                    removeElementById(popupId);
                    return false;
                }
            });
            createPopup(popupId, [txt, inputQty, inputPx, confirmBtn, cancelBtn]);
            inputQty.focus();
        }
    }));
    div.appendChild(createElement("br",{})); //force line break

    //Limit production button
    var limitProductionInnerText = "Limit Production";
    if (product.prdman[city][0]) {
        limitProductionInnerText += " (" + formatNumber(product.prdman[city][1], 3) + ")";
    }
    div.appendChild(createElement("a", {
        class:"a-link-button", innerText:limitProductionInnerText,display:"inline-block",
        clickListener:()=>{
            var popupId = "cmpy-mgmt-limit-product-production-popup";
            var txt = createElement("p", {
                innerText:"Enter a limit to the amount of this product you would " +
                          "like to product per second. Leave the box empty to set no limit."
            });
            var confirmBtn;
            var input = createElement("input", {
                type:"number", placeholder:"Limit",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === 13) {confirmBtn.click();}
                }
            });
            confirmBtn = createElement("a", {
                class:"a-link-button", display:"inline-block", innerText:"Limit production", margin:'6px',
                clickListener:()=>{
                    if (input.value === "") {
                        product.prdman[city][0] = false;
                        removeElementById(popupId);
                        return false;
                    }
                    var qty = parseFloat(input.value);
                    if (isNaN(qty)) {
                        dialogBoxCreate("Invalid value entered");
                        return false;
                    }
                    if (qty < 0) {
                        product.prdman[city][0] = false;
                    } else {
                        product.prdman[city][0] = true;
                        product.prdman[city][1] = qty;
                    }
                    removeElementById(popupId);
                    return false;
                }
            });
            var cancelBtn = createElement("a", {
                class:"a-link-button", display:"inline-block", innerText:"Cancel", margin:"6px",
                clickListener:()=>{
                    removeElementById(popupId);
                    return false;
                }
            });
            createPopup(popupId, [txt, input, confirmBtn, cancelBtn]);
        }
    }));

    //Discontinue button
    div.appendChild(createElement("a", {
        class:'a-link-button', display:"inline-block",innerText:"Discontinue",
        clickListener:()=>{
            var popupId = "cmpy-mgmt-discontinue-product-popup";
            var txt = createElement("p", {
                innerText:"Are you sure you want to do this? Discontinuing a product " +
                          "removes it completely and permanently. You will no longer " +
                          "produce this product and all of its existing stock will be " +
                          "removed and left unsold",
            });
            var confirmBtn = createElement("a", {
                class:"a-link-button",innerText:"Discontinue",
                clickListener:()=>{
                    industry.discontinueProduct(product, parentRefs);
                    removeElementById(popupId);
                    return false;
                }
            });
            var cancelBtn = createElement("a", {
                class:"a-link-button", innerText:"Cancel",
                clickListener:()=>{
                    removeElementById(popupId);
                    return false;
                }
            });
            createPopup(popupId, [txt, confirmBtn, cancelBtn]);
        }
    }));
    industryWarehousePanel.appendChild(div);
}

Warehouse.prototype.toJSON = function() {
	return Generic_toJSON("Warehouse", this);
}

Warehouse.fromJSON = function(value) {
	return Generic_fromJSON(Warehouse, value.data);
}

Reviver.constructors.Warehouse = Warehouse;

//Corporation Unlock Upgrades
//Upgrades for entire corporation, unlocks features, either you have it or you dont
//The structure is [index in Corporation feature upgrades array, price ]
var CorporationUnlockUpgrades = {
    //Lets you export goods
    "0":  [0, 20e9, "Export",
                    "Develop infrastructure to export your materials to your other facilities. " +
                    "This allows you to move materials around between different divisions and cities."],

    //Lets you buy exactly however many required materials you need for production
    "1":  [1, 999999e9, "Smart Supply", "NOT YET IMPLEMENTED!!!!!! - Use advanced AI to anticipate your supply needs. " +
                     "This allows you to purchase exactly however many materials you need for production."],

    //Displays each material/product's demand
    "2":  [2, 5e9, "Market Research - Demand",
                    "Mine and analyze market data to determine the demand of all resources. " +
                    "The demand attribute, which affects sales, will be displayed for every material and product."],

    //Display's each material/product's competition
    "3":  [3, 5e9, "Market Data - Competition",
                    "Mine and analyze market data to determine how much competition there is on the market " +
                    "for all resources. The competition attribute, which affects sales, will be displayed for " +
                    "for every material and product."],
    "4":  [4, 10e9, "VeChain",
                    "Use AI and blockchain technology to identify where you can improve your supply chain systems. " +
                    "This upgrade will allow you to view a wide array of useful statistics about your " +
                    "Corporation."]
}

//Corporation Upgrades
//Upgrades for entire corporation, levelable upgrades
//The structure is [index in Corporation upgrades array, base price, price mult, benefit mult (additive),
//                  name, desc]
var CorporationUpgrades = {
    //Smart factories, increases production
    "0":    [0, 2e9, 1.07, 0.03,
            "Smart Factories", "Advanced AI automatically optimizes the operation and productivity " +
            "of factories. Each level of this upgrade increases your global production by 3% (additive)."],

    //Smart warehouses, increases storage size
    "1":    [1, 2e9, 1.07, .1,
             "Smart Storage", "Advanced AI automatically optimizes your warehouse storage methods. " +
             "Each level of this upgrade increases your global warehouse storage size by 10% (additive)."],

    //Advertise through dreams, passive popularity/ awareness gain
    "2":    [2, 8e9, 1.09, .001,
            "DreamSense", "Use DreamSense LCC Technologies to advertise your corporation " +
            "to consumers through their dreams. Each level of this upgrade provides a passive " +
            "increase in awareness of all of your companies (divisions) by 0.004 / market cycle," +
            "and in popularity by 0.001 / market cycle. A market cycle is approximately " +
            "20 seconds."],

    //Makes advertising more effective
    "3":    [3, 4e9, 1.12, 0.01,
            "Wilson Analytics", "Purchase data and analysis from Wilson, a marketing research " +
            "firm. Each level of this upgrades increases the effectiveness of your " +
            "advertising by 1% (additive)."],

    //Augmentation for employees, increases cre
    "4":    [4, 1e9, 1.06, 0.1,
            "Nuoptimal Nootropic Injector Implants", "Purchase the Nuoptimal Nootropic " +
            "Injector augmentation for your employees. Each level of this upgrade " +
            "globally increases the creativity of your employees by 10% (additive)."],

    //Augmentation for employees, increases cha
    "5":    [5, 1e9, 1.06, 0.1,
            "Speech Processor Implants", "Purchase the Speech Processor augmentation for your employees. " +
            "Each level of this upgrade globally increases the charisma of your employees by 10% (additive)."],

    //Augmentation for employees, increases int
    "6":    [6, 1e9, 1.06, 0.1,
            "Neural Accelerators", "Purchase the Neural Accelerator augmentation for your employees. " +
            "Each level of this upgrade globally increases the intelligence of your employees " +
            "by 10% (additive)."],

    //Augmentation for employees, increases eff
    "7":    [7, 1e9, 1.06, 0.1,
            "FocusWires", "Purchase the FocusWire augmentation for your employees. Each level " +
            "of this upgrade globally increases the efficiency of your employees by 10% (additive)."],

    //Improves sales of materials/products
    "8":    [8, 1e9, 1.08, 0.01,
            "ABC SalesBots", "Always Be Closing. Purchase these robotic salesmen to increase the amount of " +
            "materials and products you sell. Each level of this upgrade globally increases your sales " +
            "by 1% (additive)."],

    //Improves scientific research rate
    "9":    [9, 5e9, 1.07, 0.05,
            "Project Insight", "Purchase 'Project Insight', a R&D service provided by the secretive " +
            "Fulcrum Technologies. Each level of this upgrade globally increases the amount of " +
            "Scientific Research you produce by 5% (additive)."],
}

function Corporation(params={}) {
    this.name = params.name ? params.name : "The Corporation";

    //A division/business sector is represented  by the object:
    this.divisions = [];

    //Financial stats
    this.funds      = new Decimal(150e9);
    this.revenue    = new Decimal(0);
    this.expenses   = new Decimal(0);
    this.fundingRound = 0;
    this.public     = false; //Publicly traded
    this.numShares  = TOTALSHARES;
    this.issuedShares = 0;
    this.sharePrice = 0;
    this.storedCycles = 0;

    var numUnlockUpgrades = Object.keys(CorporationUnlockUpgrades).length,
        numUpgrades = Object.keys(CorporationUpgrades).length;

    this.unlockUpgrades = Array(numUnlockUpgrades).fill(0);
    this.upgrades = Array(numUpgrades).fill(0);
    this.upgradeMultipliers = Array(numUpgrades).fill(1);

    this.state = new CorporationState();
}

Corporation.prototype.getState = function() {
    return this.state.getState();
}

var numMarketCyclesPersist = 1;
Corporation.prototype.process = function(numCycles=1) {
    var corp = this;
    this.storedCycles += numCycles;
    if (this.storedCycles >= CyclesPerIndustryStateCycle) {
        var state = this.getState();

        //At the start of a new cycle, calculate profits from previous cycle
        if (state === "START") {
            this.revenue = new Decimal(0);
            this.expenses = new Decimal(0);
            this.divisions.forEach((ind)=>{
                this.revenue = this.revenue.plus(ind.lastCycleRevenue);
                this.expenses = this.expenses.plus(ind.lastCycleExpenses);
            });
            var profit = this.revenue.minus(this.expenses);
            var cycleProfit = profit.times(numMarketCyclesPersist * SecsPerMarketCycle);
            if (isNaN(this.funds)) {
                dialogBoxCreate("There was an error calculating your Corporations funds and they got reset to 0. " +
                                "This is a bug. Please report to game developer.<br><br>" +
                                "(Your funds have been set to $150b for the inconvenience)");
                this.funds = new Decimal(150e9);
            }
            this.funds = this.funds.plus(cycleProfit);
            this.updateSharePrice();
        }

        //Determine number of market cycles at the START state
        if (state === "START") {
            if (this.storedCycles >= 2*CyclesPerMarketCycle) {
                //Enough cycles stored for 2+ market cycles
                //Capped out at 3 to prevent weird behavior
                numMarketCyclesPersist = Math.max(3, Math.floor(this.storedCycles / CyclesPerMarketCycle));
            } else {
                numMarketCyclesPersist = 1;
            }
        }
        var marketCycles = numMarketCyclesPersist;

        this.storedCycles -= (marketCycles * CyclesPerIndustryStateCycle);
        this.divisions.forEach(function(ind) {
            ind.process(marketCycles, state, corp);
        });


        this.state.nextState();

        if (Engine.currentPage === Engine.Page.Corporation) {this.updateUIContent();}
    }
}

Corporation.prototype.determineValuation = function() {
    var val, profit = (this.revenue.minus(this.expenses)).toNumber();
    if (this.public) {
        val = this.funds.toNumber() + (profit * 90e3);
        val *= (Math.pow(1.1, this.divisions.length));
        val = Math.max(val, 0);
    } else {
        val = 10e9 + Math.max(this.funds.toNumber(), 0) / 3; //Base valuation
        if (profit > 0) {
            val += (profit * 350e3);
            val *= (Math.pow(1.1, this.divisions.length));
        } else {
            val = 10e9 * Math.pow(1.1, this.divisions.length);
        }
        val -= (val % 1e6); //Round down to nearest millionth
    }
    return val * BitNodeMultipliers.CorporationValuation;
}

Corporation.prototype.getInvestment = function() {
    var val = this.determineValuation(), percShares;
    switch (this.fundingRound) {
        case 0: //Seed
            percShares = 0.10;
            break;
        case 1: //Series A
            percShares = 0.35;
            break;
        case 2: //Series B
            percShares = 0.25;
            break;
        case 3: //Series C
            percShares = 0.20;
            break;
        case 4:
            return;
    }
    var funding = val * percShares * 4,
        investShares = Math.floor(TOTALSHARES * percShares),
        yesBtn = yesNoBoxGetYesButton(),
        noBtn = yesNoBoxGetNoButton();
    yesBtn.innerHTML = "Accept";
    noBtn.innerHML = "Reject";
    yesBtn.addEventListener("click", ()=>{
        ++this.fundingRound;
        this.funds = this.funds.plus(funding);
        this.numShares -= investShares;
        this.displayCorporationOverviewContent();
        return yesNoBoxClose();
    });
    noBtn.addEventListener("click", ()=>{
        return yesNoBoxClose();
    });
    yesNoBoxCreate("An investment firm has offered you " + numeral(funding).format('$0.000a') +
                   " in funding in exchange for a " + numeral(percShares*100).format("0.000a") +
                   "% stake in the company (" + numeral(investShares).format('0.000a') + " shares).<br><br>" +
                   "Do you accept or reject this offer?");
}

Corporation.prototype.goPublic = function() {
    var goPublicPopupId = "cmpy-mgmt-go-public-popup";
    var initialSharePrice = this.determineValuation() / (TOTALSHARES);
    var txt = createElement("p", {
        innerHTML: "Enter the number of shares you would like to issue " +
                   "for your IPO. These shares will be publicly sold " +
                   "and you will no longer own them. Your Corporation will receive " +
                   numeral(initialSharePrice).format('$0.000a') + " per share " +
                   "(the IPO money will be deposited directly into your Corporation's funds).<br><br>" +
                   "Furthermore, issuing more shares now will help drive up " +
                   "your company's stock price in the future.<br><br>" +
                   "You have a total of " + numeral(this.numShares).format("0.000a") + " of shares that you can issue.",
    });
    var input = createElement("input", {
        type:"number",
        placeholder: "Shares to issue",
    });
    var br = createElement("br", {});
    var yesBtn = createElement("a", {
        class:"a-link-button",
        innerText:"Go Public",
        clickListener:()=>{
            var numShares = Math.round(input.value);
            var initialSharePrice = this.determineValuation() / (TOTALSHARES);
            if (isNaN(numShares)) {
                dialogBoxCreate("Invalid value for number of issued shares");
                return false;
            }
            if (numShares > this.numShares) {
                dialogBoxCreate("Error: You don't have that many shares to issue!");
                return false;
            }
            this.public = true;
            this.sharePrice = initialSharePrice;
            this.issuedShares = numShares;
            this.numShares -= numShares;
            this.funds = this.funds.plus(numShares * initialSharePrice);
            this.displayCorporationOverviewContent();
            removeElementById(goPublicPopupId);
            return false;
        }
    });
    var noBtn = createElement("a", {
        class:"a-link-button",
        innerText:"Cancel",
        clickListener:()=>{
            removeElementById(goPublicPopupId);
            return false;
        }
    });
    createPopup(goPublicPopupId, [txt, br, input, yesBtn, noBtn]);
}

Corporation.prototype.updateSharePrice = function() {
    var targetPrice = this.determineValuation() / (TOTALSHARES - this.issuedShares);
    if (this.sharePrice <= targetPrice) {
        this.sharePrice *= (1 + (Math.random() * 0.01));
    } else {
        this.sharePrice *= (1 - (Math.random() * 0.01));
    }
    if (this.sharePrice <= 0.01) {this.sharePrice = 0.01;}
}

//One time upgrades that unlock new features
Corporation.prototype.unlock = function(upgrade) {
    var upgN = upgrade[0], price = upgrade[1];
    while (this.unlockUpgrades.length <= upgN) {
        this.unlockUpgrades.push(0);
    }
    if (this.funds.lt(price)) {
        dialogBoxCreate("You don't have enough funds to unlock this!");
        return;
    }
    this.unlockUpgrades[upgN] = 1;
    this.funds = this.funds.minus(price);
}

//Levelable upgrades
Corporation.prototype.upgrade = function(upgrade) {
    var upgN = upgrade[0], basePrice = upgrade[1], priceMult = upgrade[2],
        upgradeAmt = upgrade[3]; //Amount by which the upgrade multiplier gets increased (additive)
    while (this.upgrades.length <= upgN) {this.upgrades.push(0);}
    while (this.upgradeMultipliers.length <= upgN) {this.upgradeMultipliers.push(1);}
    var totalCost = basePrice * Math.pow(priceMult, this.upgrades[upgN]);
    if (this.funds.lt(totalCost)) {
        dialogBoxCreate("You don't have enough funds to purchase this!");
        return;
    }
    ++this.upgrades[upgN];
    this.funds = this.funds.minus(totalCost);

    //Increase upgrade multiplier
    this.upgradeMultipliers[upgN] = 1 + (this.upgrades[upgN] * upgradeAmt);

    //If storage size is being updated, update values in Warehouse objects
    if (upgN === 1) {
        for (var i = 0; i < this.divisions.length; ++i) {
            var industry = this.divisions[i];
            for (var city in industry.warehouses) {
                if (industry.warehouses.hasOwnProperty(city) && industry.warehouses[city] instanceof Warehouse) {
                    industry.warehouses[city].updateSize(this);
                }
            }
        }
    }

    this.updateCorporationOverviewContent();
}

Corporation.prototype.getProductionMultiplier = function() {
    var mult = this.upgradeMultipliers[0];
    if (isNaN(mult) || mult < 1) {return 1;} else {return mult;}
}

Corporation.prototype.getStorageMultiplier = function() {
    var mult = this.upgradeMultipliers[1];
    if (isNaN(mult) || mult < 1) {return 1;} else {return mult;}
}

Corporation.prototype.getDreamSenseGain = function() {
    var gain = this.upgradeMultipliers[2] - 1;
    return gain <= 0 ? 0 : gain;
}

Corporation.prototype.getAdvertisingMultiplier = function() {
    var mult = this.upgradeMultipliers[3];
    if (isNaN(mult) || mult < 1) {return 1;} else {return mult;}
}

Corporation.prototype.getEmployeeCreMultiplier = function() {
    var mult = this.upgradeMultipliers[4];
    if (isNaN(mult) || mult < 1) {return 1;} else {return mult;}
}

Corporation.prototype.getEmployeeChaMultiplier = function() {
    var mult = this.upgradeMultipliers[5];
    if (isNaN(mult) || mult < 1) {return 1;} else {return mult;}
}

Corporation.prototype.getEmployeeIntMultiplier = function() {
    var mult = this.upgradeMultipliers[6];
    if (isNaN(mult) || mult < 1) {return 1;} else {return mult;}
}

Corporation.prototype.getEmployeeEffMultiplier = function() {
    var mult = this.upgradeMultipliers[7];
    if (isNaN(mult) || mult < 1) {return 1;} else {return mult;}
}

Corporation.prototype.getSalesMultiplier = function() {
    var mult = this.upgradeMultipliers[8];
    if (isNaN(mult) || mult < 1) {return 1;} else {return mult;}
}

Corporation.prototype.getScientificResearchMultiplier = function() {
    var mult = this.upgradeMultipliers[9];
    if (isNaN(mult) || mult < 1) {return 1;} else {return mult;}
}

//Keep 'global' variables for DOM elements so we don't have to search
//through the DOM tree repeatedly when updating UI
var companyManagementDiv, companyManagementHeaderTabs, companyManagementPanel,
    currentCityUi,
    corporationUnlockUpgrades, corporationUpgrades,
    industryOverviewPanel, industryOverviewText,
    industryEmployeePanel, industryEmployeeText, industryEmployeeHireButton, industryEmployeeAutohireButton,
        industryEmployeeManagementUI, industryEmployeeInfo, industryIndividualEmployeeInfo,
    industryOfficeUpgradeSizeButton,
    industryWarehousePanel,
    headerTabs, cityTabs;
Corporation.prototype.createUI = function() {
    companyManagementDiv = createElement("div", {
        id:"cmpy-mgmt-container",
        position:"fixed",
        class:"generic-menupage-container"
    });
    companyManagementHeaderTabs = createElement("div", {id:"cmpy-mgmt-header-tabs"});
    companyManagementDiv.appendChild(companyManagementHeaderTabs);

    //Create division/industry tabs at the top
    this.updateUIHeaderTabs();

    //Create the 'panel' that will have the actual content in the UI
    companyManagementPanel = createElement("div", {id:"cmpy-mgmt-panel"});
    companyManagementDiv.appendChild(companyManagementPanel);
    document.getElementById("entire-game-container").appendChild(companyManagementDiv);

    this.displayCorporationOverviewContent();
}

Corporation.prototype.updateUIHeaderTabs = function() {
    if (companyManagementHeaderTabs) {
        removeChildrenFromElement(companyManagementHeaderTabs);
    } else {
        console.log("ERROR: Header tabs div has not yet been created when Corporation.updateUIHeaderTabs() is called");
        return;
    }

    //Corporation overview tabs
    var cmpyOverviewHdrTab = createElement("button", {
        id:"cmpy-mgmt-company-tab",
        class:"cmpy-mgmt-header-tab",
        innerText:this.name,
        checked:true,
        clickListener:()=>{
            this.selectHeaderTab(cmpyOverviewHdrTab);
            this.displayCorporationOverviewContent();
            return false;
        }
    });
    companyManagementHeaderTabs.appendChild(cmpyOverviewHdrTab);

    //Tabs for each division
    for (var i = 0; i < this.divisions.length; ++i) {
        this.createDivisionUIHeaderTab(this.divisions[i]);
    }

    //Create a tab to expand into a new industry
    companyManagementHeaderTabs.appendChild(createElement("button", {
        id:'cmpy-mgmt-expand-industry-tab',
        class:"cmpy-mgmt-header-tab",
        innerText:"Expand into new Industry",
        clickListener: ()=>{
            if (document.getElementById("cmpy-mgmt-expand-industry-popup") != null) {return;}

            var container = createElement("div", {
                class:"popup-box-container",
                id:"cmpy-mgmt-expand-industry-popup",
            }),
            content = createElement("div", {class:"popup-box-content"}),
            txt = createElement("p", {
                innerHTML: "Create a new division to expand into a new industry:",
            }),
            selector = createElement("select", {
                class:"cmpy-mgmt-industry-select"
            }),
            industryDescription = createElement("p", {}),
            nameInput = createElement("input", {
                type:"text",
                id:"cmpy-mgmt-expand-industry-name-input",
                color:"white",
                backgroundColor:"black",
                display:"block",
                maxLength: 30,
                pattern:"[a-zA-Z0-9-_]"
            }),
            nameLabel = createElement("label", {
                for:"cmpy-mgmt-expand-industry-name-input",
                innerText:"Division name: "
            }),
            yesBtn = createElement("span", {
                class:"popup-box-button",
                innerText:"Create Division",
                clickListener: ()=>{
                    var ind = selector.options[selector.selectedIndex].value,
                        newDivisionName = nameInput.value;

                    for (var i = 0; i < this.divisions.length; ++i) {
                        if (this.divisions[i].name === newDivisionName) {
                            dialogBoxCreate("This name is already in use!");
                            return false;
                        }
                    }
                    if (this.funds.lt(IndustryStartingCosts[ind])) {
                        dialogBoxCreate("Not enough money to create a new division in this industry");
                    } else if (newDivisionName === "") {
                        dialogBoxCreate("New division must have a name!");
                    } else {
                        this.funds = this.funds.minus(IndustryStartingCosts[ind]);
                        var newInd = new Industry({
                            name:newDivisionName,
                            type:ind,
                        });
                        this.divisions.push(newInd);
                        this.updateUIHeaderTabs();
                        this.selectHeaderTab(headerTabs[headerTabs.length-2]);
                        removeElementById("cmpy-mgmt-expand-industry-popup");
                        this.displayDivisionContent(newInd, Locations.Sector12);
                    }
                    return false;
                }
            }),
            noBtn = createElement("span", {
                class:"popup-box-button",
                innerText:"Cancel",
                clickListener: function() {
                    removeElementById("cmpy-mgmt-expand-industry-popup");
                    return false;
                }
            });

            //Make an object to keep track of what industries you're already in
            var ownedIndustries = {}
            for (var i = 0; i < this.divisions.length; ++i) {
                ownedIndustries[this.divisions[i].type] = true;
            }

            //Add industry types to selector
            //Have Agriculture be first as recommended option
            if (!ownedIndustries["Agriculture"]) {
                selector.add(createElement("option", {
                    text:Industries["Agriculture"], value:"Agriculture"
                }));
            }

            for (var key in Industries) {
                if (key !== "Agriculture" && Industries.hasOwnProperty(key) && !ownedIndustries[key]) {
                    var ind = Industries[key];
                    selector.add(createElement("option", {
                        text: ind,value:key,
                    }));
                }
            }

            //Initial Industry Description
            var ind = selector.options[selector.selectedIndex].value;
            industryDescription.innerHTML = (IndustryDescriptions[ind] + "<br><br>");

            //Change the industry description text based on selected option
            selector.addEventListener("change", function() {
                var ind = selector.options[selector.selectedIndex].value;
                industryDescription.innerHTML = IndustryDescriptions[ind] + "<br><br>";
            });

            //Add to DOM
            content.appendChild(txt);
            content.appendChild(selector);
            content.appendChild(industryDescription);
            content.appendChild(nameLabel);
            content.appendChild(nameInput);
            content.appendChild(noBtn);
            content.appendChild(yesBtn);
            container.appendChild(content);
            document.getElementById("entire-game-container").appendChild(container);
            container.style.display = "block";
            return false;
        }
    }));

    headerTabs = companyManagementDiv.getElementsByClassName("cmpy-mgmt-header-tab");
}

//Updates UI to display which header tab is selected
Corporation.prototype.selectHeaderTab = function(currentTab) {
    if (currentTab == null) {return;}
    for (var i = 0; i < headerTabs.length; ++i) {
        headerTabs[i].className = "cmpy-mgmt-header-tab";
    }
    currentTab.className = "cmpy-mgmt-header-tab current";
}

Corporation.prototype.createDivisionUIHeaderTab = function(division) {
    var tabId = "cmpy-mgmt-" + division.name + "-tab";
    var tab = createElement("button", {
        id:tabId,
        class:"cmpy-mgmt-header-tab",
        innerText:division.name,
        clickListener:()=>{
            this.selectHeaderTab(tab);
            this.displayDivisionContent(division, Locations.Sector12);
            return false;
        }
    });
    companyManagementHeaderTabs.appendChild(tab);
}

Corporation.prototype.clearUIPanel = function() {
    while(companyManagementPanel.firstChild) {
        companyManagementPanel.removeChild(companyManagementPanel.firstChild);
    }
}

Corporation.prototype.updateUIContent = function() {
    //Check which of the header tab buttons is checked
    if (headerTabs == null) {
        console.log("ERROR: headerTabs is null in Corporation.updateUIContent()");
        return;
    }
    for (var i = 0; i < headerTabs.length; ++i) {
        if (headerTabs[i].classList.contains("current")) {
            if (i === 0) {
                //Corporation overview
                this.updateCorporationOverviewContent();
            } else {
                //Division
                this.updateDivisionContent(this.divisions[i-1]);
            }
            return;
        }
    }
}

Corporation.prototype.displayCorporationOverviewContent = function() {
    this.clearUIPanel();
    companyManagementPanel.appendChild(createElement("p", {
        id:"cmpy-mgmt-overview-text",
    }));
    if (headerTabs && headerTabs.length >= 1) {
        this.selectHeaderTab(headerTabs[0]);
    }

    //Check if player has Corporation Handbook
    var homeComp = Player.getHomeComputer(), hasHandbook = false,
        handbookFn = "corporation-management-handbook.lit";
    for (var i = 0; i < homeComp.messages.length; ++i) {
        if (isString(homeComp.messages[i]) && homeComp.messages[i] === handbookFn) {
            hasHandbook = true;
            break;
        }
    }

    companyManagementPanel.appendChild(createElement("a", {
        class:"a-link-button", innerText:"Getting Started Guide", display:"inline-block",
        tooltip:"Get a copy of and read 'The Complete Handbook for Creating a Successful Corporation.' " +
                "This is a .lit file that guides you through the beginning of setting up a Corporation and " +
                "provides some tips/pointers for helping you get started with managing it.",
        clickListener:()=>{
            if (!hasHandbook) {homeComp.messages.push(handbookFn);}
            showLiterature(handbookFn);
            return false;
        }
    }));

    //Investors
    if (this.public) {
        //Sell share buttons
        var sellShares = createElement("a", {
            class:"a-link-button", innerText:"Sell Shares", display:"inline-block",
            tooltip:"Sell your shares in the company. This is the only way to " +
                    "profit from your business venture.",
            clickListener:()=>{
                var popupId = "cmpy-mgmt-sell-shares-popup";
                var currentStockPrice = this.sharePrice;
                var txt = createElement("p", {
                    innerHTML: "Enter the number of shares you would like to sell. The money from " +
                               "selling your shares will go directly to you (NOT your Corporation). " +
                               "The current price of your " +
                               "company's stock is " + numeral(currentStockPrice).format("$0.000a"),
                });
                var profitIndicator = createElement("p", {});
                var input = createElement("input", {
                    type:"number", placeholder:"Shares to sell", margin:"5px",
                    inputListener: ()=> {
                        var numShares = Math.round(input.value);
                        if (isNaN(numShares) || numShares <= 0) {
                            profitIndicator.innerText = "ERROR: Invalid value entered for number of shares to sell"
                        } else if (numShares > this.numShares) {
                            profitIndicator.innerText = "You don't have this many shares to sell!";
                        } else {
                            profitIndicator.innerText = "Sell " + numShares + " shares for a total of " +
                                                        numeral(numShares * currentStockPrice).format('$0.000a');
                        }
                    }
                });
                var confirmBtn = createElement("a", {
                    class:"a-link-button", innerText:"Sell shares", display:"inline-block",
                    clickListener:()=>{
                        var shares = Math.round(input.value);
                        if (isNaN(shares) || shares <= 0) {
                            dialogBoxCreate("ERROR: Invalid value for number of shares");
                        } else if (shares > this.numShares) {
                            dialogBoxCreate("ERROR: You don't have this many shares to sell");
                        } else {
                            this.numShares -= shares;
                            if (isNaN(this.issuedShares)) {
                                console.log("ERROR: Corporation issuedShares is NaN: " + this.issuedShares);
                                console.log("Converting to number now");
                                var res = parseInt(this.issuedShares);
                                if (isNaN(res)) {
                                    this.issuedShares = 0;
                                } else {
                                    this.issuedShares = res;
                                }
                            }
                            this.issuedShares += shares;
                            Player.gainMoney(shares * this.sharePrice);
                            removeElementById(popupId);
                            return false;
                        }

                    }
                });
                var cancelBtn = createElement("a", {
                    class:"a-link-button", innerText:"Cancel", display:"inline-block",
                    clickListener:()=>{
                        removeElementById(popupId);
                        return false;
                    }
                });
                createPopup(popupId, [txt, profitIndicator, input, confirmBtn, cancelBtn]);
            }
        });

        //Buyback shares button
        var buybackShares = createElement("a", {
            class:"a-link-button", innerText:"Buyback shares", display:"inline-block",
            tooltip:"Buy back shares you that previously issued or sold at market price.",
            clickListener:()=>{
                var popupId = "cmpy-mgmt-buyback-shares-popup";
                var currentStockPrice = this.sharePrice;
                var txt = createElement("p", {
                    innerHTML: "Enter the number of shares you would like to buy back at market price. To purchase " +
                               "these shares, you must use your own money (NOT your Corporation's funds). " +
                               "The current price of your " +
                               "company's stock is " + numeral(currentStockPrice).format("$0.000a") +
                               ". Your company currently has " + formatNumber(this.issuedShares, 3) + " outstanding stock shares",
                });
                var costIndicator = createElement("p", {});
                var input = createElement("input", {
                    type:"number", placeholder:"Shares to buyback", margin:"5px",
                    inputListener: ()=> {
                        var numShares = Math.round(input.value);
                        //TODO add conditional for if player doesn't have enough money
                        if (isNaN(numShares) || numShares <= 0) {
                            costIndicator.innerText = "ERROR: Invalid value entered for number of shares to buyback"
                        } else if (numShares > this.issuedShares) {
                            costIndicator.innerText = "There are not this many shares available to buy back. " +
                                                      "There are only " + this.issuedShares + " outstanding shares.";
                        } else {
                            console.log("here");
                            costIndicator.innerText = "Purchase " + numShares + " shares for a total of " +
                                                      numeral(numShares * currentStockPrice).format('$0.000a');
                        }
                    }
                });
                var confirmBtn = createElement("a", {
                    class:"a-link-button", innerText:"Buy shares", display:"inline-block",
                    clickListener:()=>{
                        var shares = Math.round(input.value);
                        var tempStockPrice = this.sharePrice;
                        if (isNaN(shares) || shares <= 0) {
                            dialogBoxCreate("ERROR: Invalid value for number of shares");
                        } else if (shares > this.issuedShares) {
                            dialogBoxCreate("ERROR: There are not this many oustanding shares to buy back");
                        } else if (shares * tempStockPrice > Player.money) {
                            dialogBoxCreate("ERROR: You do not have enough money to purchase this many shares (you need " +
                                            numeral(shares * tempStockPrice).format("$0.000a") + ")");
                        } else {
                            this.numShares += shares;
                            if (isNaN(this.issuedShares)) {
                                console.log("ERROR: Corporation issuedShares is NaN: " + this.issuedShares);
                                console.log("Converting to number now");
                                var res = parseInt(this.issuedShares);
                                if (isNaN(res)) {
                                    this.issuedShares = 0;
                                } else {
                                    this.issuedShares = res;
                                }
                            }
                            this.issuedShares -= shares;
                            Player.loseMoney(shares * tempStockPrice);
                            //TODO REMOVE from Player money
                            removeElementById(popupId);
                        }
                        return false;

                    }
                });
                var cancelBtn = createElement("a", {
                    class:"a-link-button",
                    innerText:"Cancel",
                    display:"inline-block",
                    clickListener:()=>{
                        removeElementById(popupId);
                        return false;
                    }
                });
                createPopup(popupId, [txt, costIndicator, input, confirmBtn, cancelBtn]);
            }
        });

        companyManagementPanel.appendChild(sellShares);
        companyManagementPanel.appendChild(buybackShares);

        //If your Corporation is big enough, buy faction influence through bribes
        var canBribe = this.determineValuation() >= BribeThreshold;
        var bribeFactions = createElement("a", {
            class: canBribe ? "a-link-button" : "a-link-button-inactive",
            innerText:"Bribe Factions", display:"inline-block",
            tooltip:canBribe
                    ? "Use your Corporations power and influence to bribe Faction leaders in exchange for reputation"
                    : "Your Corporation is not powerful enough to bribe Faction leaders",
            clickListener:()=>{
                var popupId = "cmpy-mgmt-bribe-factions-popup";
                var txt = createElement("p", {
                    innerText:"You can use Corporation funds or stock shares to bribe Faction Leaders in exchange for faction reputation"
                });
                var factionSelector = createElement("select", {margin:"3px"});
                for (var i = 0; i < Player.factions.length; ++i) {
                    var facName = Player.factions[i];
                    factionSelector.add(createElement("option", {
                        text:facName, value:facName
                    }));
                }
                var repGainText = createElement("p");
                var stockSharesInput;
                var moneyInput = createElement("input", {
                    type:"number", placeholder:"Corporation funds", margin:"5px",
                    inputListener:()=>{
                        var money = moneyInput.value == null || moneyInput.value == "" ? 0 : parseFloat(moneyInput.value);
                        var stockPrice = this.sharePrice;
                        var stockShares = stockSharesInput.value == null || stockSharesInput.value == "" ? 0 : Math.round(parseFloat(stockSharesInput.value));
                        if (isNaN(money) || isNaN(stockShares) || money < 0 || stockShares < 0) {
                            repGainText.innerText = "ERROR: Invalid value(s) entered";
                        } else if (this.funds.lt(money)) {
                            repGainText.innerText = "ERROR: You do not have this much money to bribe with";
                        } else if (this.stockShares > this.numShares) {
                            repGainText.innerText = "ERROR: You do not have this many shares to bribe with";
                        } else {

                            var totalAmount = Number(money) + (stockShares * stockPrice);
                            var repGain = totalAmount / BribeToRepRatio;
                            repGainText.innerText = "You will gain " + formatNumber(repGain, 0) +
                                                    " reputation with " +
                                                    factionSelector.options[factionSelector.selectedIndex].value +
                                                    " with this bribe";
                        }
                    }
                });
                stockSharesInput = createElement("input", {
                    type:"number", placeholder:"Stock Shares", margin: "5px",
                    inputListener:()=>{
                        var money = moneyInput.value == null || moneyInput.value == "" ? 0 : moneyInput.value;
                        var stockPrice = this.sharePrice;
                        var stockShares = stockSharesInput.value == null || stockSharesInput.value == "" ? 0 : Math.round(stockSharesInput.value);
                        if (isNaN(money) || isNaN(stockShares) || money < 0 || stockShares < 0) {
                            repGainText.innerText = "ERROR: Invalid value(s) entered";
                        } else if (this.funds.lt(money)) {
                            repGainText.innerText = "ERROR: You do not have this much money to bribe with";
                        } else if (this.stockShares > this.numShares) {
                            repGainText.innerText = "ERROR: You do not have this many shares to bribe with";
                        } else {
                            var totalAmount = money + (stockShares * stockPrice);
                            var repGain = totalAmount / BribeToRepRatio;
                            console.log("repGain: " + repGain);
                            repGainText.innerText = "You will gain " + formatNumber(repGain, 0) +
                                                    " reputation with " +
                                                    factionSelector.options[factionSelector.selectedIndex].value +
                                                    " with this bribe";
                        }
                    }
                });
                var confirmButton = createElement("a", {
                    class:"a-link-button", innerText:"Bribe", display:"inline-block",
                    clickListener:()=>{
                        var money = moneyInput.value == null || moneyInput.value == "" ? 0 : parseFloat(moneyInput.value);
                        var stockPrice = this.sharePrice;
                        var stockShares = stockSharesInput.value == null || stockSharesInput.value == ""? 0 : Math.round(parseFloat(stockSharesInput.value));
                        var fac = Factions[factionSelector.options[factionSelector.selectedIndex].value];
                        if (fac == null) {
                            dialogBoxCreate("ERROR: You must select a faction to bribe");
                            return false;
                        }
                        if (isNaN(money) || isNaN(stockShares) || money < 0 || stockShares < 0) {
                            dialogBoxCreate("ERROR: Invalid value(s) entered");
                        } else if (this.funds.lt(money)) {
                            dialogBoxCreate("ERROR: You do not have this much money to bribe with");
                        } else if (this.stockShares > this.numShares) {
                            dialogBoxCreate("ERROR: You do not have this many shares to bribe with");
                        } else {
                            var totalAmount = money + (stockShares * stockPrice);
                            var repGain = totalAmount / BribeToRepRatio;
                            dialogBoxCreate("You gained " + formatNumber(repGain, 0) +
                                            " reputation with " + fac.name  + " by bribing them.");
                            fac.playerReputation += repGain;
                            this.funds = this.funds.minus(money);
                            this.numShares -= stockShares;
                            removeElementById(popupId);
                            return false;
                        }
                    }
                });
                var cancelButton = createElement("a", {
                    class:"a-link-button", innerText:"Cancel", display:"inline-block",
                    clickListener:()=>{
                        removeElementById(popupId);
                        return false;
                    }
                });

                createPopup(popupId, [txt, factionSelector, repGainText,
                                      moneyInput, stockSharesInput, confirmButton, cancelButton]);
            }
        });
        companyManagementPanel.appendChild(bribeFactions);
    } else {
        var findInvestors = createElement("a", {
            class: this.fundingRound >= 4 ? "a-link-button-inactive" : "a-link-button tooltip",
            innerText: "Find Investors",
            display:"inline-block",
            clickListener:()=>{
                this.getInvestment();
            }
        });
        if (this.fundingRound < 4) {
            var findInvestorsTooltip = createElement("span", {
                class:"tooltiptext",
                innerText:"Search for private investors who will give you startup funding in exchange " +
                          "for equity (stock shares) in your company"
            });
            findInvestors.appendChild(findInvestorsTooltip);
        }

        var goPublic = createElement("a", {
            class:"a-link-button tooltip",
            innerText:"Go Public",
            display:"inline-block",
            clickListener:()=>{
                this.goPublic();
                return false;
            }
        });
        var goPublicTooltip = createElement("span", {
            class:"tooltiptext",
            innerText: "Become a publicly traded and owned entity. Going public involves " +
                       "issuing shares for an IPO. Once you are a public company, " +
                       "your shares will be traded on the stock market."
        });
        goPublic.appendChild(goPublicTooltip);

        companyManagementPanel.appendChild(findInvestors);
        companyManagementPanel.appendChild(goPublic);
    }

    //Update overview text
    this.updateCorporationOverviewContent();

    //Don't show upgrades if player hasn't opened any divisions
    if (this.divisions.length <= 0) {return; }
    //Corporation Upgrades
    var upgradeContainer = createElement("div", {
        class:"cmpy-mgmt-upgrade-container",
    });
    upgradeContainer.appendChild(createElement("h1", {
        innerText:"Unlocks", margin:"6px", padding:"6px",
    }));

    //Unlock upgrades
    var corp = this;
    var numUnlockUpgrades = Object.keys(CorporationUnlockUpgrades).length,
        numUpgrades = Object.keys(CorporationUpgrades).length;
    if (this.unlockUpgrades == null || this.upgrades == null) { //Backwards compatibility
        this.unlockUpgrades = Array(numUnlockUpgrades).fill(0);
        this.upgrades = Array(numUpgrades).fill(0);
    }
    while (this.unlockUpgrades.length < numUnlockUpgrades) {this.unlockUpgrades.push(0);}
    while (this.upgrades.length < numUpgrades) {this.upgrades.push(0);}
    while (this.upgradeMultipliers < numUpgrades) {this.upgradeMultipliers.push(1);}

    for (var i = 0; i < numUnlockUpgrades; ++i) {
        (function(i, corp) {
            if (corp.unlockUpgrades[i] === 0) {
                var upgrade = CorporationUnlockUpgrades[i.toString()];
                if (upgrade == null) {
                    console.log("ERROR: Could not find upgrade index " + i);
                    return;
                }

                upgradeContainer.appendChild(createElement("div", {
                    class:"cmpy-mgmt-upgrade-div", width:"45%",
                    innerHTML:upgrade[2] +  " - " + numeral(upgrade[1]).format("$0.000a"),
                    tooltip: upgrade[3],
                    clickListener:()=>{
                        if (corp.funds.lt(upgrade[1])) {
                            dialogBoxCreate("Insufficient funds");
                        } else {
                            corp.unlock(upgrade);
                            corp.displayCorporationOverviewContent();
                        }
                    }
                }));
            }
        })(i, corp);
    }

    //Levelable upgrades
    upgradeContainer.appendChild(createElement("h1", {
        innerText:"Upgrades", margin:"6px", padding:"6px",
    }));

    for (var i = 0; i < numUpgrades; ++i) {
        (function(i, corp) {
            var upgrade = CorporationUpgrades[i.toString()];
            if (upgrade == null) {
                console.log("ERROR: Could not find levelable upgrade index " + i);
                return;
            }

            var baseCost = upgrade[1], priceMult = upgrade[2];
            var cost = baseCost * Math.pow(priceMult, corp.upgrades[i]);
            upgradeContainer.appendChild(createElement("div", {
                class:"cmpy-mgmt-upgrade-div", width:"45%",
                innerHTML:upgrade[4] + " - " + numeral(cost).format("$0.000a"),
                tooltip:upgrade[5],
                clickListener:()=>{
                    if (corp.funds.lt(cost)) {
                        dialogBoxCreate("Insufficient funds");
                    } else {
                        corp.upgrade(upgrade);
                        corp.displayCorporationOverviewContent();
                    }
                }
            }));
        })(i, corp);
    }

    companyManagementPanel.appendChild(upgradeContainer);
}

Corporation.prototype.updateCorporationOverviewContent = function() {
    var p = document.getElementById("cmpy-mgmt-overview-text");
    if (p == null) {
        console.log("WARNING: Could not find overview text elemtn in updateCorporationOverviewContent()");
        return;
    }
    var totalFunds = this.funds,
        totalRevenue = new Decimal(0),
        totalExpenses = new Decimal(0);

    var profit = this.revenue.minus(this.expenses).toNumber(),
        profitStr = profit >= 0 ? numeral(profit).format("$0.000a") : "-" + numeral(-1 * profit).format("$0.000a");

    var txt = "Total Funds: " + numeral(totalFunds.toNumber()).format('$0.000a') + "<br>" +
              "Total Revenue: " + numeral(this.revenue.toNumber()).format("$0.000a") + " / s<br>" +
              "Total Expenses: " + numeral(this.expenses.toNumber()).format("$0.000a") + "/ s<br>" +
              "Total Profits: " + profitStr + " / s<br>" +
              "Publicly Traded: " + (this.public ? "Yes" : "No") + "<br>" +
              "Owned Stock Shares: " + numeral(this.numShares).format('0.000a') + "<br>" +
              "Stock Price: " + (this.public ? "$" + formatNumber(this.sharePrice, 2) : "N/A") + "<br><br>";

    var prodMult        = this.getProductionMultiplier(),
        storageMult     = this.getStorageMultiplier(),
        advMult         = this.getAdvertisingMultiplier(),
        empCreMult      = this.getEmployeeCreMultiplier(),
        empChaMult      = this.getEmployeeChaMultiplier(),
        empIntMult      = this.getEmployeeIntMultiplier(),
        empEffMult      = this.getEmployeeEffMultiplier(),
        salesMult       = this.getSalesMultiplier(),
        sciResMult      = this.getScientificResearchMultiplier();
    if (prodMult > 1)       {txt += "Production Multiplier: " + formatNumber(prodMult, 3) + "<br>";}
    if (storageMult > 1)    {txt += "Storage Multiplier: " + formatNumber(storageMult, 3) + "<br>";}
    if (advMult > 1)        {txt += "Advertising Multiplier: " + formatNumber(advMult, 3) + "<br>";}
    if (empCreMult > 1)     {txt += "Empl. Creativity Multiplier: " + formatNumber(empCreMult, 3) + "<br>";}
    if (empChaMult > 1)     {txt += "Empl. Charisma Multiplier: " + formatNumber(empChaMult, 3) + "<br>";}
    if (empIntMult > 1)     {txt += "Empl. Intelligence Multiplier: " + formatNumber(empIntMult, 3) + "<br>";}
    if (empEffMult > 1)     {txt += "Empl. Efficiency Multiplier: " + formatNumber(empEffMult, 3) + "<br>";}
    if (salesMult > 1)      {txt += "Sales Multiplier: " + formatNumber(salesMult, 3) + "<br>";}
    if (sciResMult > 1)     {txt += "Scientific Research Multiplier: " + formatNumber(sciResMult, 3) + "<br>";}
    p.innerHTML = txt;
}

Corporation.prototype.displayDivisionContent = function(division, city) {
    this.clearUIPanel();
    currentCityUi = city;

    //Add the city tabs on the left
    for (var cityName in division.offices) {
        if (division.offices[cityName] instanceof OfficeSpace) {
            this.createCityUITab(cityName, division);
        }
    }
    cityTabs = companyManagementPanel.getElementsByClassName("cmpy-mgmt-city-tab");
    if (cityTabs.length > 0) {
        this.selectCityTab(document.getElementById("cmpy-mgmt-city-" + city + "-tab"), city);
    }

    //Expand into new City button
    companyManagementPanel.appendChild(createElement("button", {
        class:"cmpy-mgmt-city-tab", innerText:"Expand into new City", display:"inline-block",
        clickListener:()=>{
            var popupId = "cmpy-mgmt-expand-city-popup";
            var text = createElement("p", {
                innerText: "Would you like to expand into a new city by opening an office? " +
                           "This would cost " + numeral(OfficeInitialCost).format('$0.000a'),
            });
            var citySelector = createElement("select", {margin:"5px"});
            for (var cityName in division.offices) {
                if (division.offices.hasOwnProperty(cityName)) {
                    if (!(division.offices[cityName] instanceof OfficeSpace)) {
                        citySelector.add(createElement("option", {
                            text: cityName,
                            value: cityName
                        }));
                    }
                }
            }

            var confirmBtn = createElement("a", {
                innerText:"Confirm", class:"a-link-button", display:"inline-block", margin:"3px",
                clickListener:()=>{
                    var city = citySelector.options[citySelector.selectedIndex].value;
                    if (this.funds.lt(OfficeInitialCost)) {
                        dialogBoxCreate("You don't have enough company funds to open a new office!");
                    } else {
                        this.funds = this.funds.minus(OfficeInitialCost);
                        dialogBoxCreate("Opened a new office in " + city + "!");
                        division.offices[city] = new OfficeSpace({
                            loc:city,
                            size:OfficeInitialSize,
                        });
                        this.displayDivisionContent(division, city);
                    }
                    removeElementById(popupId);
                    return false;
                }
            });
            var cancelBtn = createElement("a", {
                innerText:"Cancel", class:"a-link-button", display:"inline-block", margin:"3px",
                clickListener:()=>{
                    removeElementById(popupId);
                    return false;
                }
            })
            createPopup(popupId, [text, citySelector, confirmBtn, cancelBtn]);
            return false;
        }
    }));
    companyManagementPanel.appendChild(createElement("br", {})); // Force line break

    //Get office object
    var office = division.offices[currentCityUi];
    if (!(office instanceof OfficeSpace)) {
        console.log("ERROR: Current city for UI does not have an office space");
        return;
    }

    //Left and right panels
    var leftPanel = createElement("div", {class:"cmpy-mgmt-industry-left-panel"});
    var rightPanel = createElement("div", {class:"cmpy-mgmt-industry-right-panel"});
    companyManagementPanel.appendChild(leftPanel);
    companyManagementPanel.appendChild(rightPanel);

    //Different sections (Overview, Employee/Office, and Warehouse)
    industryOverviewPanel = createElement("div", {
        id:"cmpy-mgmt-industry-overview-panel", class:"cmpy-mgmt-industry-overview-panel"
    });
    leftPanel.appendChild(industryOverviewPanel);

    industryEmployeePanel = createElement("div", {
        id:"cmpy-mgmt-employee-panel", class:"cmpy-mgmt-employee-panel"
    });
    leftPanel.appendChild(industryEmployeePanel);

    industryWarehousePanel = createElement("div", {
        id:"cmpy-mgmt-warehouse-panel", class:"cmpy-mgmt-warehouse-panel"
    });
    rightPanel.appendChild(industryWarehousePanel);

    //Industry overview text
    industryOverviewText = createElement("p", {});
    industryOverviewPanel.appendChild(industryOverviewText);
    industryOverviewPanel.appendChild(createElement("br", {}));

    //Industry overview Purchases & Upgrades
    var numUpgrades = Object.keys(IndustryUpgrades).length;
    while (division.upgrades.length < numUpgrades) {division.upgrades.push(0);} //Backwards compatibility

    var industryOverviewUpgrades = createElement("div", {});
    industryOverviewUpgrades.appendChild(createElement("u", {
        innerText:"Purchases & Upgrades", margin:"2px", padding:"2px",
        fontSize:"14px",
    }));
    industryOverviewUpgrades.appendChild(createElement("br", {}));
    for (var i = 0; i < numUpgrades; ++i) {
        (function(i, corp, division, office) {
            var upgrade = IndustryUpgrades[i.toString()];
            if (upgrade == null) {
                console.log("ERROR: Could not find levelable upgrade index: " + i);
                return;
            }

            var baseCost = upgrade[1], priceMult = upgrade[2], cost = 0;
            switch(i) {
                case 0: //Coffee, cost is static per employee
                    cost = office.employees.length * baseCost;
                    break;
                default:
                    cost = baseCost * Math.pow(priceMult, division.upgrades[i]);
                    break;
            }
            industryOverviewUpgrades.appendChild(createElement("div", {
                class:"cmpy-mgmt-upgrade-div", display:"inline-block",
                innerHTML:upgrade[4] + ' - ' + numeral(cost).format("$0.000a"),
                tooltip:upgrade[5],
                clickListener:()=>{
                    if (corp.funds.lt(cost)) {
                        dialogBoxCreate("Insufficient funds");
                    } else {
                        corp.funds = corp.funds.minus(cost);
                        division.upgrade(upgrade, {
                            corporation:corp,
                            office:office,
                        });
                        corp.displayDivisionContent(division, city);
                    }
                }
            }));
            industryOverviewUpgrades.appendChild(createElement("br", {}));

        })(i, this, division, office);
    }


    industryOverviewPanel.appendChild(industryOverviewUpgrades);

    //Industry Overview 'Create Product' button if applicable
    if (division.makesProducts) {
        //Get the text on the button based on Industry type
        var createProductButtonText, createProductPopupText;
        switch(division.type) {
            case Industries.Food:
                createProductButtonText = "Build Restaurant";
                createProductPopupText = "Build and manage a new restaurant!"
                break;
            case Industries.Tobacco:
                createProductButtonText = "Create Product";
                createProductPopupText = "Create a new tobacco product!";
                break;
            case Industries.Pharmaceutical:
                createProductButtonText = "Create Drug";
                createProductPopupText = "Design and develop a new pharmaceutical drug!";
                break;
            case Industries.Computer:
            case "Computer":
                createProductButtonText = "Create Product";
                createProductPopupText = "Design and manufacture a new computer hardware product!";
                break;
            case Industries.Robotics:
                createProductButtonText = "Design Robot";
                createProductPopupText = "Design and create a new robot or robotic system!";
                break;
            case Industries.Software:
                createProductButtonText = "Develop Software";
                createProductPopupText = "Develop a new piece of software!";
                break;
            case Industries.HealthCare:
                createProductButtonText = "Build Hospital";
                createProductPopupText = "Build and manage a new hospital!";
                break;
            case Industries.RealEstate:
                createProductButtonText = "Develop Property";
                createProductPopupText = "Develop a new piece of real estate property!";
                break;
            default:
                createProductButtonText = "Create Product";
                return "";
        }
        createProductPopupText += "<br><br>To begin developing a product, " +
            "first choose the city in which it will be designed. The stats of your employees " +
            "in the selected city affect the properties of the finished product, such as its " +
            "quality, performance, and durability.<br><br>" +
            "You can also choose to invest money in the design and marketing of " +
            "the product. Investing money in its design will result in a superior product. " +
            "Investing money in marketing the product will help the product's sales.";

        //Create the button
        industryOverviewPanel.appendChild(createElement("a", {
            class:"a-link-button", innerText:createProductButtonText, margin:"6px", display:"inline-block",
            clickListener:()=>{
                var popupId = "cmpy-mgmt-create-product-popup";
                var txt = createElement("p", {
                    innerHTML:createProductPopupText,
                });
                var designCity = createElement("select", {});
                for (var cityName in division.offices) {
                    if (division.offices[cityName] instanceof OfficeSpace) {
                        designCity.add(createElement("option", {
                            value:cityName,
                            text:cityName
                        }));
                    }
                }
                var foo = "Product Name";
                if (division.type === Industries.Food) {
                    foo = "Restaurant Name";
                } else if (division.type === Industries.Healthcare) {
                    foo = "Hospital Name";
                } else if (division.type === Industries.RealEstate) {
                    foo = "Property Name";
                }
                var productNameInput = createElement("input", {
                    placeholder:foo,
                });
                var lineBreak1 = createElement("br",{});
                var designInvestInput = createElement("input", {
                    type:"number",
                    placeholder:"Design investment"
                });
                var marketingInvestInput = createElement("input", {
                    type:"number",
                    placeholder:"Marketing investment"
                });
                var confirmBtn = createElement("a", {
                    class:"a-link-button",
                    innerText:"Develop Product",
                    clickListener:()=>{
                        if (designInvestInput.value == null) {designInvestInput.value = 0;}
                        if (marketingInvestInput.value == null) {marketingInvestInput.value = 0;}
                        var designInvest = parseFloat(designInvestInput.value),
                            marketingInvest = parseFloat(marketingInvestInput.value);
                        if (productNameInput.value == null || productNameInput.value === "") {
                            dialogBoxCreate("You must specify a name for your product!");
                        } else if (isNaN(designInvest)) {
                            dialogBoxCreate("Invalid value for design investment");
                        } else if (isNaN(marketingInvest))  {
                            dialogBoxCreate("Invalid value for marketing investment");
                        } else if (this.funds.lt(designInvest + marketingInvest)) {
                            dialogBoxCreate("You don't have enough company funds to make this large of an investment");
                        } else {
                            var product = new Product({
                                name:productNameInput.value.replace(/[<>]/g, ''), //Sanitize for HTMl elements
                                createCity:designCity.options[designCity.selectedIndex].value,
                                designCost: designInvest,
                                advCost: marketingInvest,
                            });
                            this.funds = this.funds.minus(designInvest + marketingInvest);
                            division.products[product.name] = product;
                            removeElementById(popupId);
                        }
                        this.updateUIContent();
                        return false;
                    }
                })
                var cancelBtn = createElement("a", {
                    class:"a-link-button",
                    innerText:"Cancel",
                    clickListener:()=>{
                        removeElementById(popupId);
                        return false;
                    }
                })
                createPopup(popupId, [txt, designCity, productNameInput, lineBreak1,
                                      designInvestInput, marketingInvestInput, confirmBtn, cancelBtn]);
            }
        }));
    }

    //Employee and Office Panel
    industryEmployeeText = createElement("p", {
        id: "cmpy-mgmt-employee-p",
        display:"block",
        innerHTML:  "<h1>Office Space</h1><br>" +
                    "Type: " + office.tier + "<br>" +
                    "Comfort: " + office.comf + "<br>" +
                    "Beauty: " + office.beau + "<br>" +
                    "Size: " + office.employees.length + " / " + office.size + " employees",
    });
    industryEmployeePanel.appendChild(industryEmployeeText);

    //Hire Employee button
    if (office.employees.length === 0) {
        industryEmployeeHireButton = createElement("a", {
            class:"a-link-button",display:"inline-block",
            innerText:"Hire Employee", fontSize:"13px",
            tooltip:"You'll need to hire some employees to get your operations started! " +
                    "It's recommended to have at least one employee in every position",
            clickListener:()=>{
                office.findEmployees({corporation:this, division:division});
                return false;
            }
        });
        //industryEmployeeHireButton.classList.add("flashing-button");
    } else {
        industryEmployeeHireButton = createElement("a", {
            class:"a-link-button",display:"inline-block",
            innerText:"Hire Employee", fontSize:"13px",
            clickListener:()=>{
                office.findEmployees({corporation:this, division:division});
                return false;
            }
        });
    }
    industryEmployeePanel.appendChild(industryEmployeeHireButton);

    //Autohire Employee button
    industryEmployeeAutohireButton = createElement("a", {
        class:"a-link-button", display:"inline-block",
        innerText:"Autohire Employee", fontSize:"13px",
        tooltip:"Automatically hires an employee and gives him/her a random name",
        clickListener:()=>{
            office.hireRandomEmployee({corporation:this, division:division});
            return false;
        }
    });
    industryEmployeePanel.appendChild(industryEmployeeAutohireButton);

    //Upgrade Office Size button
    industryEmployeePanel.appendChild(createElement("br", {}));
    industryOfficeUpgradeSizeButton = createElement("a", {
        class:"a-link-button", innerText:"Upgrade size",
        display:"inline-block", margin:"6px", fontSize:"13px",
        tooltip:"Upgrade the office's size so that it can hold more employees!",
        clickListener:()=>{
            var popupId = "cmpy-mgmt-upgrade-office-size-popup";
            var upgradeCost = OfficeInitialCost * Math.pow(1.07, Math.round(office.size / OfficeInitialSize));
            var text = createElement("p", {
                innerHTML:"Increase the size of your office space to fit " + OfficeInitialSize +
                          " more employees. This will cost " + numeral(upgradeCost).format('$0.000a'),
            });
            var confirmBtn = createElement("a", {
                class:"a-link-button",
                display:"inline-block",
                margin:"8px",
                innerText:"Upgrade Office Size",
                clickListener:()=>{
                    if (this.funds.lt(upgradeCost)) {
                        dialogBoxCreate("You don't have enough company funds to purchase this upgrade!");
                    } else {
                        office.size += OfficeInitialSize;
                        this.funds = this.funds.minus(upgradeCost);
                        dialogBoxCreate("Office space increased! It can now hold " + office.size + " employees");
                        this.updateUIContent();
                    }
                    removeElementById(popupId);
                    return false;
                }
            });
            var cancelBtn = createElement("a", {
                class:"a-link-button",
                innerText:"Cancel",
                display:"inline-block",
                margin:"8px",
                clickListener:()=>{
                    removeElementById(popupId);
                    return false;
                }
            })
            createPopup(popupId, [text, confirmBtn, cancelBtn]);
            return false;
        }
    });
    industryEmployeePanel.appendChild(industryOfficeUpgradeSizeButton);

    //Throw Office Party
    industryEmployeePanel.appendChild(createElement("a", {
        class:"a-link-button", display:"inline-block", innerText:"Throw Party",
        fontSize:"13px",
        tooltip:"Throw an office party to increase your employee's morale and happiness",
        clickListener:()=>{
            var popupId = "cmpy-mgmt-throw-office-party-popup";
            var txt = createElement("p", {
                innerText:"Enter the amount of money you would like to spend PER EMPLOYEE " +
                          "on this office party"
            });
            var totalCostTxt = createElement("p", {
                innerText:"Throwing this party will cost a total of $0"
            });
            var input = createElement("input", {
                type:"number", margin:"5px", placeholder:"$ / employee",
                inputListener:()=>{
                    if (isNaN(input.value) || input.value < 0) {
                        totalCostTxt.innerText = "Invalid value entered!"
                    } else {
                        var totalCost = input.value * office.employees.length;
                        totalCostTxt.innerText = "Throwing this party will cost a total of " + numeral(totalCost).format('$0.000a');
                    }
                }
            });
            var confirmBtn = createElement("a", {
                class:"a-link-button",
                display:"inline-block",
                innerText:"Throw Party",
                clickListener:()=>{
                    if (isNaN(input.value) || input.value < 0) {
                        dialogBoxCreate("Invalid value entered");
                    } else {
                        var totalCost = input.value * office.employees.length;
                        if (this.funds.lt(totalCost)) {
                            dialogBoxCreate("You don't have enough company funds to throw this party!");
                        } else {
                            this.funds = this.funds.minus(totalCost);
                            var mult;
                            for (var fooit = 0; fooit < office.employees.length; ++fooit) {
                                mult = office.employees[fooit].throwParty(input.value);
                            }
                            dialogBoxCreate("You threw a party for the office! The morale and happiness " +
                                            "of each employee increased by " + formatNumber((mult-1) * 100, 2) + "%.");
                            removeElementById(popupId);
                        }
                    }
                    return false;
                }
            });
            var cancelBtn = createElement("a", {
                class:"a-link-button",
                display:"inline-block",
                innerText:"Cancel",
                clickListener:()=>{
                    removeElementById(popupId);
                    return false;
                }
            });
            createPopup(popupId, [txt, totalCostTxt, input, confirmBtn, cancelBtn]);
        }
    }));

    industryEmployeeManagementUI = createElement("div", {});
    industryEmployeeInfo = createElement("p", {margin:"4px", padding:"4px"});
    if (empManualAssignmentModeActive) {
        //Employees manually assigned
        industryEmployeeManagementUI.appendChild(createElement("a", {
            class:"a-link-button", display:"inline-block", margin:"4px",
            innerText:"Switch to Auto Mode",
            tooltip:"Switch to Automatic Assignment Mode, which will automatically  " +
                    "assign employees to your selected jobs. You simply have to select " +
                    "the number of assignments for each job",
            clickListener:()=>{
                empManualAssignmentModeActive = false;
                this.displayDivisionContent(division, city);
            }
        }));
        industryEmployeeManagementUI.appendChild(createElement("br", {}));

        industryIndividualEmployeeInfo = createElement("div", {margin:"4px", padding:"4px"});
        var selector = createElement("select", {
            color: "white", backgroundColor:"black", margin:"4px", padding:"4px",
            changeListener:()=>{
                var name = selector.options[selector.selectedIndex].text;
                for (var i = 0; i < office.employees.length; ++i) {
                    if (office.employees[i].name === name) {
                        removeChildrenFromElement(industryIndividualEmployeeInfo);
                        office.employees[i].createUI(industryIndividualEmployeeInfo, this);
                        return;
                    }
                }
                console.log("ERROR: Employee in selector could not be found");
            }
        });

        for (var i = 0; i < office.employees.length; ++i) {
            selector.add(createElement("option", {text:office.employees[i].name}));
        }

        selector.selectedIndex = -1;

        industryEmployeeManagementUI.appendChild(industryEmployeeInfo);
        industryEmployeeManagementUI.appendChild(selector);
        industryEmployeeManagementUI.appendChild(industryIndividualEmployeeInfo);
    } else {
        //Player only manages the number of each occupation, not who gets what job
        industryEmployeeManagementUI.appendChild(createElement("a", {
            class:"a-link-button", display:"inline-block", margin:"4px",
            innerText:"Switch to Manual Mode",
            tooltip:"Switch to Manual Assignment Mode, which allows you to " +
                    "specify which employees should get which jobs",
            clickListener:()=>{
                empManualAssignmentModeActive = true;
                this.displayDivisionContent(division, city);
            }
        }));
        industryEmployeeManagementUI.appendChild(createElement("br", {}));

        var opCount = 0, engCount = 0, busCount = 0,
            mgmtCount = 0, rndCount = 0, unassignedCount = 0,
            trainingCount = 0;
        for (var i = 0; i < office.employees.length; ++i) {
            switch (office.employees[i].pos) {
                case EmployeePositions.Operations:
                    ++opCount; break;
                case EmployeePositions.Engineer:
                    ++engCount; break;
                case EmployeePositions.Business:
                    ++busCount; break;
                case EmployeePositions.Management:
                    ++mgmtCount; break;
                case EmployeePositions.RandD:
                    ++rndCount; break;
                case EmployeePositions.Unassigned:
                    ++unassignedCount; break;
                case EmployeePositions.Training:
                    ++trainingCount; break;
                default:
                    console.log("ERROR: Unrecognized employee position: " + office.employees[i].pos);
                    break;
            }
        }

        //Unassigned employee count display
        industryEmployeeManagementUI.appendChild(createElement("p", {
            display:"inline-block",
            innerText:"Unassigned Employees: " + unassignedCount,
        }));
        industryEmployeeManagementUI.appendChild(createElement("br", {}));

        //General display of employee information (avg morale, avg energy, etc.)
        industryEmployeeManagementUI.appendChild(industryEmployeeInfo);
        industryEmployeeManagementUI.appendChild(createElement("br", {}));

        var positions = [EmployeePositions.Operations, EmployeePositions.Engineer,
                         EmployeePositions.Business, EmployeePositions.Management,
                         EmployeePositions.RandD, EmployeePositions.Training];
        var descriptions = ["Manages supply chain operations. Improves production.", //Operations
                            "Develops and maintains products and production systems. Improves production.", //Engineer
                            "Handles sales and finances. Improves sales.", //Business
                            "Leads and oversees employees and office operations. Improves production.", //Management
                            "Research new innovative ways to improve the company. Generates Scientific Research", //RandD
                            "Set employee to training, which will increase some of their stats. Employees in training do not affect any company operations."] //Training
        var counts = [opCount, engCount, busCount, mgmtCount, rndCount, trainingCount];
        for (var i = 0; i < positions.length; ++i) {
            (function(corp, i) {
                var info = createElement("h2", {
                    display:"inline-block", width:"40%", fontSize:"15px",
                    innerText: positions[i] + "(" + counts[i] + ")",
                    tooltipleft: descriptions[i]
                });
                var plusBtn = createElement("a", {
                    class: unassignedCount > 0 ? "a-link-button" : "a-link-button-inactive",
                    display:"inline-block", innerText:"+",
                    clickListener:()=>{
                        office.assignEmployeeToJob(positions[i]);
                        corp.displayDivisionContent(division, city);
                    }
                });
                var minusBtn = createElement("a", {
                    class: counts[i] > 0 ? "a-link-button" : "a-link-button-inactive",
                    display:"inline-block", innerText:"-",
                    clickListener:()=>{
                        office.unassignEmployeeFromJob(positions[i]);
                        corp.displayDivisionContent(division, city);
                    }
                });
                var newline = createElement("br", {});
                industryEmployeeManagementUI.appendChild(info);
                industryEmployeeManagementUI.appendChild(plusBtn);
                industryEmployeeManagementUI.appendChild(minusBtn);
                industryEmployeeManagementUI.appendChild(newline);
            })(this, i);
        }
    }
    industryEmployeePanel.appendChild(industryEmployeeManagementUI);

    //Warehouse Panel
    var warehouse = division.warehouses[currentCityUi];
    if (warehouse instanceof Warehouse) {
        warehouse.createUI({industry:division, company: this});
    } else {
        industryWarehousePanel.appendChild(createElement("a", {
            innerText:"Purchase Warehouse ($5b)",
            class: "a-link-button",
            clickListener:()=>{
                if (this.funds.lt(WarehouseInitialCost)) {
                    dialogBoxCreate("You do not have enough funds to do this!");
                } else {
                    division.warehouses[currentCityUi] = new Warehouse({
                        loc:currentCityUi,
                        size:WarehouseInitialSize,
                    });
                    this.funds = this.funds.minus(WarehouseInitialCost);
                    this.updateDivisionContent(division);
                }
                return false;
            }
        }));
    }
    this.updateDivisionContent(division);
}

Corporation.prototype.updateDivisionContent = function(division) {
    if (!(division instanceof Industry)) {
        console.log("ERROR: Invalid 'division' argument in Corporation.updateDivisionContent");
        return;
    }
    var vechain = (this.unlockUpgrades[4] === 1);
    //Industry Overview Text
    var profit = division.lastCycleRevenue.minus(division.lastCycleExpenses).toNumber(),
        profitStr = profit >= 0 ? numeral(profit).format("$0.000a") : "-" + numeral(-1 * profit).format("$0.000a");
    var advertisingInfo = "";
    if (vechain) {
        var advertisingFactors = division.getAdvertisingFactors();
        var awarenessFac = advertisingFactors[1];
        var popularityFac = advertisingFactors[2];
        var ratioFac = advertisingFactors[3];
        var totalAdvertisingFac = advertisingFactors[0];
        advertisingInfo =
            "<p class='tooltip'>Advertising Multiplier: x" + formatNumber(totalAdvertisingFac, 3) +
            "<span class='tooltiptext' style='font-size:12px'>Total multiplier for this industry's sales due to its awareness and popularity<br>" +
            "Awareness Bonus: x" + formatNumber(awarenessFac, 3) + "<br>" +
            "Popularity Bonus: x" + formatNumber(popularityFac, 3) + "<br>" +
            "Ratio Multiplier: x" + formatNumber(ratioFac, 3) + "</span></p><br>"

    }
    industryOverviewText.innerHTML =
        "Industry: " + division.type + "<br><br>" +
        "Awareness: " + formatNumber(division.awareness, 3) + "<br>" +
        "Popularity: " + formatNumber(division.popularity, 3) +  "<br>" +
        advertisingInfo + "<br>" +
        "Revenue: " + numeral(division.lastCycleRevenue.toNumber()).format("$0.000a") + " / s<br>" +
        "Expenses: " + numeral(division.lastCycleExpenses.toNumber()).format("$0.000a") + " /s<br>" +
        "Profit: " + profitStr + " / s<br><br>" +
        "<p class='tooltip'>Production Multiplier: " + formatNumber(division.prodMult, 2) +
        "<span class='tooltiptext'>Production gain from owning production-boosting materials " +
        "such as hardware, Robots, AI Cores, and Real Estate</span></p><br>" +
        "Scientific Research: " + formatNumber(division.sciResearch.qty, 3);

    //Office and Employee List
    var office = division.offices[currentCityUi];
    industryEmployeeText.innerHTML =
                "<h1>Office Space</h1><br>" +
                "Type: " + office.tier + "<br>" +
                "Comfort: " + office.comf + "<br>" +
                "Beauty: " + office.beau + "<br>" +
                "Size: " + office.employees.length + " / " + office.size + " employees";
    if (office.employees.length >= office.size) {
        industryEmployeeHireButton.className = "a-link-button-inactive";
        industryEmployeeAutohireButton.className = "a-link-button-inactive tooltip";
    } else if (office.employees.length === 0) {
        industryEmployeeHireButton.className = "a-link-button tooltip flashing-button";
        industryEmployeeAutohireButton.className = "a-link-button tooltip";
    } else {
        industryEmployeeHireButton.className = "a-link-button";
        industryEmployeeAutohireButton.className = "a-link-button tooltip";
    }

    //Employee Overview stats
    //Calculate average morale, happiness, and energy
    var totalMorale = 0, totalHappiness = 0, totalEnergy = 0,
        avgMorale = 0, avgHappiness = 0, avgEnergy = 0;
    for (var i = 0; i < office.employees.length; ++i) {
        totalMorale += office.employees[i].mor;
        totalHappiness += office.employees[i].hap;
        totalEnergy += office.employees[i].ene;
    }
    if (office.employees.length > 0) {
        avgMorale = totalMorale / office.employees.length;
        avgHappiness = totalHappiness / office.employees.length;
        avgEnergy = totalEnergy / office.employees.length;
    }
    industryEmployeeInfo.innerHTML =
        "Avg Employee Morale: " + formatNumber(avgMorale, 3) + "<br>" +
        "Avg Employee Happiness: " + formatNumber(avgHappiness, 3) + "<br>" +
        "Avg Employee Energy: " + formatNumber(avgEnergy, 3);
    if (vechain) { //VeChain - Statistics
        industryEmployeeInfo.appendChild(createElement("br", {}));
        industryEmployeeInfo.appendChild(createElement("p", {
            innerText:"Material Production: " + formatNumber(division.getOfficeProductivity(office), 3),
            tooltip: "The base amount of material this office can produce. Does not include " +
                     "production multipliers from upgrades and materials. This value is based off " +
                     "the productivity of your Operations, Engineering, and Management employees"
        }));
        industryEmployeeInfo.appendChild(createElement("br", {}));
        industryEmployeeInfo.appendChild(createElement("p", {
            innerText:"Product Production: " + formatNumber(division.getOfficeProductivity(office, {forProduct:true}), 3),
            tooltip: "The base amount of any given Product this office can produce. Does not include " +
                     "production multipliers from upgrades and materials. This value is based off " +
                     "the productivity of your Operations, Engineering, and Management employees"
        }));
        industryEmployeeInfo.appendChild(createElement("br", {}));
        industryEmployeeInfo.appendChild(createElement("p", {
            innerText: "Business Multiplier: x" + formatNumber(division.getBusinessFactor(office), 3),
            tooltip: "The effect this office's 'Business' employees has on boosting sales"
        }));
    }

    //Warehouse
    var warehouse = division.warehouses[currentCityUi];
    if (warehouse instanceof Warehouse) {
        warehouse.createUI({industry:division, company:this});
    }
}

Corporation.prototype.createCityUITab = function(city, division) {
    var tab = createElement("button", {
        id:"cmpy-mgmt-city-" + city + "-tab",
        class:"cmpy-mgmt-city-tab",
        innerText:city,
        clickListener:()=>{
            this.selectCityTab(tab, city);
            this.displayDivisionContent(division, city);
            return false;
        }
    });
    companyManagementPanel.appendChild(tab);
}

Corporation.prototype.selectCityTab = function(activeTab, city) {
    if (activeTab == null) {
        activeTab = document.getElementById("cmpy-mgmt-city-" + city + "-tab");
        if (activeTab == null) {return;}
    }
    for (var i = 0; i < cityTabs.length; ++i) {
        cityTabs[i].className = "cmpy-mgmt-city-tab";
    }
    activeTab.className = "cmpy-mgmt-city-tab current";
}

Corporation.prototype.clearUI = function() {
    //Delete everything
    if (companyManagementDiv != null) {removeElementById(companyManagementDiv.id);}

    //Reset global DOM variables
    companyManagementDiv        = null;
    companyManagementPanel      = null;
    currentCityUi               = null;

    corporationUnlockUpgrades   = null;
    corporationUpgrades         = null;

    industryOverviewPanel       = null;
    industryOverviewText        = null;

    industryEmployeePanel           = null;
    industryEmployeeText            = null;
    industryEmployeeHireButton      = null;
    industryEmployeeAutohireButton  = null;
    industryEmployeeManagementUI    = null;
    industryEmployeeInfo            = null;
    industryIndividualEmployeeInfo  = null;

    industryOfficeUpgradeSizeButton = null;

    industryWarehousePanel      = null;

    companyManagementHeaderTabs = null;
    headerTabs                  = null;
    cityTabs                    = null;

    document.getElementById("character-overview-wrapper").style.visibility = "visible";
}

Corporation.prototype.toJSON = function() {
	return Generic_toJSON("Corporation", this);
}

Corporation.fromJSON = function(value) {
	return Generic_fromJSON(Corporation, value.data);
}

Reviver.constructors.Corporation = Corporation;

export {Corporation};
