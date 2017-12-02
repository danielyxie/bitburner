import {Engine}                                         from "./engine.js";
import {Locations}                                      from "./Location.js";

import Decimal                                          from '../utils/decimal.js';
import {dialogBoxCreate}                                from "../utils/DialogBox.js";
import {getRandomInt, removeElementById,
        createElement, createAccordionElement,
        removeChildrenFromElement, createPopup,
        clearSelector}                                  from "../utils/HelperFunctions.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                               from "../utils/JSONReviver.js";
import numeral                                          from "../utils/numeral.min.js";
import {formatNumber, isString}                         from "../utils/StringHelperFunctions.js";
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
var CyclesPerMarketCycle    = 100;
var CyclesPerIndustryStateCycle = CyclesPerMarketCycle / companyStates.length;
var SecsPerMarketCycle      = CyclesPerMarketCycle / 5;
var Cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
var WarehouseInitialCost        = 5e9; //Initial purchase cost of warehouse
var WarehouseInitialSize        = 100;
var WarehouseUpgradeBaseCost    = 1e9;

var OfficeInitialCost           = 5e9;
var OfficeInitialSize           = 3;
var OfficeUpgradeBaseCost       = 1e9;



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
            this.bCost = 750; this.mv = 0.2;
            this.mku = 15;
            break;
        case "Energy":
            this.dmd = 90; this.dmdR = [80, 100];
            this.cmp = 80; this.cmpR = [65, 95];
            this.bCost = 1125; this.mv = 0.2;
            this.mku = 15;
            break;
        case "Food":
            this.dmd = 80; this.dmdR = [70, 90];
            this.cmp = 60; this.cmpR = [35, 85];
            this.bCost = 3750; this.mv = 1;
            this.mku = 9;
            break;
        case "Plants":
            this.dmd = 70; this.dmdR = [20, 90];
            this.cmp = 50; this.cmpR = [30, 70];
            this.bCost = 2250; this.mv = 0.6;
            this.mku = 12;
            break;
        case "Metal":
            this.dmd = 80; this.dmdR = [75, 85];
            this.cmp = 70; this.cmpR = [60, 80];
            this.bCost = 2000; this.mv = 1;
            this.mku = 15;
            break;
        case "Hardware":
            this.dmd = 85; this.dmdR = [80, 90];
            this.cmp = 80; this.cmpR = [65, 95];
            this.bCost = 3000; this.mv = 0.5; //Less mv bc its processed twice
            this.mku = 7;
            break;
        case "Chemicals":
            this.dmd = 55; this.dmdR = [40, 70];
            this.cmp = 60; this.cmpR = [40, 80];
            this.bCost = 5000; this.mv = 1.2;
            this.mku = 8;
            break;
        case "Real Estate":
            this.dmd = 50; this.dmdR = [5, 100];
            this.cmp = 50; this.cmpR = [25, 75];
            this.bCost = 12000; this.mv = 1.5; //Less mv bc its processed twice
            this.mku = 6;
            break;
        case "Drugs":
            this.dmd = 60; this.dmdR = [45, 75];
            this.cmp = 70; this.cmpR = [40, 100];
            this.bCost = 6000; this.mv = 1.6;
            this.mku = 5;
            break;
        case "Robots":
            this.dmd = 90; this.dmdR = [80, 100];
            this.cmp = 90; this.cmpR = [80, 100];
            this.bCost = 15000; this.mv = 0.5; //Less mv bc its processed twice
            this.mku = 3;
            break;
        case "AI Cores":
            this.dmd = 90; this.dmdR = [80, 100];
            this.cmp = 90; this.cmpR = [80, 100];
            this.bCost = 20000; this.mv = 0.8; //Less mv bc its processed twice
            this.mku = 2;
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
    var pv = (Math.random() * this.mv) / 100;
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
    pv = (Math.random() * this.mv) / 100;
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
    console.log("advMult: " + advMult);
    this.mku = 100 / (advMult * this.qlt * (busRatio + mgmtRatio));
    console.log("product mku: " + this.mku);
    this.dmd = industry.awareness === 0 ? 100 : Math.min(100, advMult * (100 * (industry.popularity / industry.awareness)));
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
            "Starting cost: " + numeral(IndustryStartingCosts.Energy).format("$0.000a"),
    Utilities: "Distributes water and provides wastewater services.<br><br>" +
               "Starting cost: " + numeral(IndustryStartingCosts.Utilities).format("$0.000a"),
    Agriculture: "Cultive crops and breed livestock to produce food.<br><br>" +
                 "Starting cost: " + numeral(IndustryStartingCosts.Agriculture).format("$0.000a"),
    Fishing: "Produce food through the breeding and processing of fish and fish products<br><br>" +
             "Starting cost: " + numeral(IndustryStartingCosts.Fishing).format("$0.000a"),
    Mining: "Extract and process metals from the earth.<br><br>" +
            "Starting cost: " + numeral(IndustryStartingCosts.Mining).format("$0.000a"),
    Food: "Create your own restaurants all around the world.<br><br>" +
          "Starting cost: " + numeral(IndustryStartingCosts.Food).format("$0.000a"),
    Tobacco: "Create and distribute tobacco and tobacco-related products.<br><br>" +
             "Starting cost: " + numeral(IndustryStartingCosts.Tobacco).format("$0.000a"),
    Chemical: "Product industrial chemicals<br><br>" +
              "Starting cost: " + numeral(IndustryStartingCosts.Chemical).format("$0.000a"),
    Pharmaceutical: "Discover, develop, and create new pharmaceutical drugs.<br><br>" +
                    "Starting cost: " + numeral(IndustryStartingCosts.Pharmaceutical).format("$0.000a"),
    Computer: "Develop and manufacture new computer hardware and networking infrastructures.<br><br>" +
              "Starting cost: " + numeral(IndustryStartingCosts.Computer).format("$0.000a"),
    Robotics: "Develop and create robots.<br><br>" +
              "Starting cost: " + numeral(IndustryStartingCosts.Robotics).format("$0.000a"),
    Software: "Develop computer software and create AI Cores.<br><br>" +
              "Starting cost: " + numeral(IndustryStartingCosts.Software).format("$0.000a"),
    Healthcare: "Create and manage hospitals.<br><br>" +
                "Starting cost: " + numeral(IndustryStartingCosts.Healthcare).format("$0.000a"),
    RealEstate: "Develop and manuage real estate properties.<br><br>" +
                "Starting cost: " + numeral(IndustryStartingCosts.RealEstate).format("$0.000a"),
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

    this.state = 0;

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
            this.advFac = 0.2;
            this.reqMats = {
                "Hardware": 0.1,
                "Metal":    0.25,
            };
            this.prodMats = ["Energy"];
            break;
        case Industries.Utilities:
            this.reFac  = 0.4;
            this.sciFac = 0.6;
            this.robFac = 0.3;
            this.aiFac  = 0.3;
            this.advFac = 0.2;
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
            this.advFac = 0.05;
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
            this.advFac = 0.15;
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
            this.advFac = 0.05;
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
            this.advFac = 0.75;
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
            this.advFac = 0.6;
            this.reqMats = {
                "Plants":   1,
                "Water":    0.2,
            }
            this.makesProducts = true;
            break;
        case Industries.Chemical:
            this.reFac  = 0.25;
            this.sciFac = 0.75;
            this.hwFac  = 0.15;
            this.robFac = 0.2;
            this.aiFac  = 0.15;
            this.advFac = 0.1;
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
            this.advFac = 0.55;
            this.reqMats = {
                "Chemicals":    2,
                "Energy":       1,
                "Water":        0.5,
            }
            this.prodMats = ["Drugs"];
            this.makesProducts = true;
            break;
        case Industries.Computer:
            this.reFac  = 0.2;
            this.sciFac = 0.65;
            this.robFac = 0.4;
            this.aiFac  = 0.2;
            this.advFac = 0.5;
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
            this.advFac = 0.6;
            this.reqMats = {
                "Hardware":     5,
                "Energy":       3,
            }
            this.prodMats = ["Robots"];
            this.makesProducts = true;
            break;
        case Industries.Software:
            this.sciFac = 0.7;
            this.advFac = 0.5;
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
            this.advFac = 0.3;
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
            this.advFac = 0.65;
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

Industry.prototype.process = function(marketCycles=1, state) {
    this.state = state;

    //At the start of a cycle, store and reset revenue/expenses
    //Then calculate salaries and processs the markets
    if (state === "START") {
        this.lastCycleRevenue = this.thisCycleRevenue.dividedBy(marketCycles * SecsPerMarketCycle);
        this.lastCycleExpenses = this.thisCycleExpenses.dividedBy(marketCycles * SecsPerMarketCycle);
        this.thisCycleRevenue = this.thisCycleRevenue.times(0);
        this.thisCycleExpenses = this.thisCycleExpenses.times(0);

        //Process offices (and the employees in them)
        var employeeSalary = 0;
        for (var officeLoc in this.offices) {
            if (this.offices.hasOwnProperty(officeLoc) &&
                this.offices[officeLoc] instanceof OfficeSpace) {
                employeeSalary += this.offices[officeLoc].process(marketCycles, this);
            }
        }
        this.thisCycleExpenses = this.thisCycleExpenses.plus(employeeSalary);

        //Process change in demand/competition of materials/products
        this.processMaterialMarket(marketCycles);
        this.processProductMarket(marketCycles);
        return;
    }

    //Process production, purchase, and import/export of materials
    var res = this.processMaterials(marketCycles);
    this.thisCycleRevenue = this.thisCycleRevenue.plus(res[0]);
    this.thisCycleExpenses = this.thisCycleExpenses.plus(res[1]);

    //Process creation, production & sale of products
    res = this.processProducts(marketCycles);
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
            var change = getRandomInt(1, 5) * 0.001;
            if (this.type === Industries.Pharmaceutical || this.type === Industries.Software ||
                this.type === Industries.Robotics) {
                change *= 2.5;
            }
            change *= marketCycles;
            product.dmd -= change;
            product.cmp += change;
        }
    }
}

//Process production, purchase, and import/export of materials
Industry.prototype.processMaterials = function(marketCycles=1) {
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
                var maxProd = 2 * ratio * Math.pow(total, 0.3), prod;

                if (mat.prdman[0]) {
                    //Production is manually limited
                    prod = Math.min(maxProd, mat.prdman[1]);
                } else {
                    prod = maxProd;
                }
                prod *= (SecsPerMarketCycle * marketCycles * this.prodMult); //Convert production from per second to per market cycle
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
                    console.log("Production of materials failed because producableFrac <= 0 or prod <= 0.");
                    console.log("prod: " + prod);
                }
                //Per second
                var fooProd = prod * producableFrac / (SecsPerMarketCycle * marketCycles);
                for (var fooI = 0; fooI < this.prodMats.length; ++fooI) {
                    warehouse.materials[this.prodMats[fooI]].prd = fooProd;
                }
            }
            break;

            case "SALE":
            /* Process sale of materials */
            for (var matName in warehouse.materials) {
                if (warehouse.materials.hasOwnProperty(matName)) {
                    var mat = warehouse.materials[matName];
                    if (mat.sCost < 0 || mat.sllman[0] === false) {continue;}
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
                    var businessFactor = 1 + (office.employeeProd[EmployeePositions.Business] / office.employeeProd["total"]);
                    var maxSell = (mat.qlt + .001) * mat.dmd * (100 - mat.cmp)/100 * markup * businessFactor *
                                  (this.awareness === 0 ? 0.01 : (this.popularity + .001) / this.awareness);
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
                    if (sellAmt && sCost) {
                        mat.qty -= sellAmt;
                        revenue += (sellAmt * sCost);
                        mat.sll = sellAmt / (SecsPerMarketCycle * marketCycles);
                    } else {
                        mat.sll = 0;
                    }
                }
            } //End processing of sale of materials
            break;

            /* TODO Process Export of materials */

            case "START":
            case "EXPORT":
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
            this.sciResearch.qty += .01 * Math.pow(office.employeeProd[EmployeePositions.RandD], 0.5);
        }
    }
    return [revenue, expenses];
}

//Process production & sale of this industry's FINISHED products (including all of their stats)
Industry.prototype.processProducts = function(marketCycles=1) {
    var revenue = 0, expenses = 0;

    //Create products
    if (this.state === "PRODUCTION") {
        for (var prodName in this.products) {
            if (this.products.hasOwnProperty(prodName)) {
                var prod = this.products[prodName];
                if (!prod.fin) {
                    var city = prod.createCity, office = this.offices[city];
                    var total = office.employeeProd["total"], ratio;
                    if (total === 0) {
                        ratio = 0;
                    } else {
                        ratio = office.employeeProd[EmployeePositions.Engineer] / total +
                                office.employeeProd[EmployeePositions.Operations] / total +
                                office.employeeProd[EmployeePositions.Management] / total;
                    }
                    prod.createProduct(marketCycles, ratio * Math.pow(total, 0.3));
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
                revenue += this.processProduct(marketCycles, prod);
            }
        }
    }
    return [revenue, expenses];
}

//Processes FINISHED products
Industry.prototype.processProduct = function(marketCycles=1, product) {
    var totalProfit = 0;
    for (var i = 0; i < Cities.length; ++i) {
        var city = Cities[i], office = this.offices[city], warehouse = this.warehouses[city];
        if (warehouse instanceof Warehouse) {
            switch(this.state) {

            case "PRODUCTION":
            //Calculate the maximum production of this Product based on
            //office's productivity, materials, etc.
            var total = office.employeeProd[EmployeePositions.Operations] +
                        office.employeeProd[EmployeePositions.Engineer] +
                        office.employeeProd[EmployeePositions.Management];
            var ratio = (office.employeeProd[EmployeePositions.Operations] / total) *
                        (office.employeeProd[EmployeePositions.Engineer] / total) *
                        (office.employeeProd[EmployeePositions.Management] / total);
            var maxProd = ratio * Math.pow(total, 0.2), prod;

            //Account for whether production is manually limited
            if (product.prdman[city][0]) {
                prod = Math.min(maxProd, product.prdman[city][1]);
            } else {
                prod = maxProd;
            }
            prod *= (this.prodMult * SecsPerMarketCycle * marketCycles);


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
            if (producableFrac > 0) {
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
            console.log("Product pCost:" + product.pCost);

            var markup = 1, markupLimit = product.rat / product.mku;
            if (product.sCost > product.pCost) {
                if ((product.sCost - product.pCost) > markupLimit) {
                    markup = markupLimit / (product.sCost - product.pCost);
                }
            }
            var maxSell = Math.pow(product.rat, 0.95) * product.dmd * (1-(product.cmp/100)) *
                          (this.awareness === 0 ? 0.01 : (this.popularity+0.001) / this.awareness) * markup;
            console.log("maxSell: " + maxSell);
            console.log("product.dmd: " + product.dmd);
            console.log("product.cmp: " + product.cmp);
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
    RandD: "Research & Development"
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
    this.pos    = params.position       ? params.position : EmployeePositions.Operations;
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

Employee.prototype.calculateProductivity = function() {
    var prodBase = this.mor * this.hap * this.ene * 1e-6, prodMult;
    switch(this.pos) {
        //Calculate productivity based on position. This is multipled by prodBase
        //to get final value
        case EmployeePositions.Operations:
            prodMult = (0.6 * this.int) + (0.1 * this.cha) + (this.exp) +
                       (0.5 * this.cre) + (this.eff);
            break;
        case EmployeePositions.Engineer:
            prodMult = (this.int) + (0.1 * this.cha) + (1.5 * this.exp) +
                       (this.eff);
            break;
        case EmployeePositions.Business:
            prodMult = (0.4 * this.int) + (this.cha) + (0.5 * this.exp);
            break;
        case EmployeePositions.Management:
            prodMult = (2 * this.cha) + (this.exp) + (0.2 * this.cre) +
                       (0.7 * this.eff);
            break;
        case EmployeePositions.RandD:
            prodMult = (1.5 * this.int) + (0.8 * this.exp) + (this.cre) +
                       (0.5 * this.eff);
            break;
        default:
            console.log("Invalid employee position: " + this.pos);
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
Employee.prototype.createUI = function(panel) {
    panel.style.color = "white";
    panel.appendChild(createElement("p", {
        id:"cmpy-mgmt-employee-" + this.name + "-panel-text",
        innerHTML:"Morale: " + formatNumber(this.mor, 3) + "<br>" +
                  "Happiness: " + formatNumber(this.hap, 3) + "<br>" +
                  "Energy: " + formatNumber(this.ene, 3) + "<br>" +
                  "Age: " + formatNumber(this.age, 3) + "<br>" +
                  "Intelligence: " + formatNumber(this.int, 3) + "<br>" +
                  "Charisma: " + formatNumber(this.cha, 3) + "<br>" +
                  "Experience: " + formatNumber(this.exp, 3) + "<br>" +
                  "Creativity: " + formatNumber(this.cre, 3) + "<br>" +
                  "Efficiency: " + formatNumber(this.eff, 3) + "<br>" +
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

Employee.prototype.updateUI = function(panel) {
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
                      "Intelligence: " + formatNumber(this.int, 3) + "<br>" +
                      "Charisma: " + formatNumber(this.cha, 3) + "<br>" +
                      "Experience: " + formatNumber(this.exp, 3) + "<br>" +
                      "Creativity: " + formatNumber(this.cre, 3) + "<br>" +
                      "Efficiency: " + formatNumber(this.eff, 3) + "<br>" +
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

OfficeSpace.prototype.process = function(marketCycles=1, industry) {
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
    this.calculateEmployeeProductivity(marketCycles);
    return salaryPaid;
}

OfficeSpace.prototype.calculateEmployeeProductivity = function(marketCycles=1) {
    //Reset
    for (var name in this.employeeProd) {
        if (this.employeeProd.hasOwnProperty(name)) {
            this.employeeProd[name] = 0;
        }
    }

    var total = 0;
    for (var i = 0; i < this.employees.length; ++i) {
        var employee = this.employees[i];
        var prod = employee.calculateProductivity();
        this.employeeProd[employee.pos] += prod;
        total += prod;
    }
    this.employeeProd["total"] = total;
}

//Takes care of UI as well
OfficeSpace.prototype.findEmployees = function(company) {
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
                office.hireEmployee(employee, company);
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

OfficeSpace.prototype.hireEmployee = function(employee, company) {
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
        company.updateUIContent();
        return yesNoTxtInpBoxClose();
    });
    noBtn.addEventListener("click", ()=>{
        return yesNoTxtInpBoxClose();
    });
    yesNoTxtInpBoxCreate("Give your employee a nickname!");
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
            this.size += 100;
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
    industryWarehousePanel.appendChild(createElement("p", {
        innerHTML:reqText,
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

    //Storage size
    var totalExport = 0;
    for (var i = 0; i < mat.exp.length; ++i) {
        totalExport += mat.exp[i].amt;
    }
    var totalGain = mat.buy + mat.prd + mat.imp - mat.sll - totalExport;
    div.appendChild(createElement("p", {
        innerHTML: "<p class='tooltip'>" + mat.name + ": " + formatNumber(mat.qty, 3) +
                   "(" + formatNumber(totalGain, 3) +  "/s)" +
                   "<span class='tooltiptext'>Buy: " + formatNumber(mat.buy, 3) +
                   "/s<br>Prod: " + formatNumber(mat.prd, 3) + "/s<br>Sell: " + formatNumber(mat.sll, 3) +
                   "/s<br>Export: " + formatNumber(totalExport, 3) + "/s<br>Import: " +
                   formatNumber(mat.imp, 3) + "/s</span></p><br>" +
                   "<p class='tooltip'>MP: $" + formatNumber(mat.bCost, 2) +
                   "<span class='tooltiptext'>Market Price: The price you would pay if " +
                   "you were to buy this material on the market</span></p><br>" +
                   "<p class='tooltip'>Quality: " + formatNumber(mat.qlt, 2) +
                   "<span class='tooltiptext'>The quality of your material. Higher quality " +
                   "will lead to more sales</span></p>",
        id: "cmpy-mgmt-warehouse-" + matName + "-text",
        display:"inline-block",
    }));

    var buttonPanel = createElement("div", {
        display:"inline-block",
    });
    div.appendChild(buttonPanel);

    //Button to set purchase amount
    buttonPanel.appendChild(createElement("a", {
        innerText: "Buy (" + formatNumber(mat.buy, 3) + ")", display:"inline-block", class:"a-link-button",
        clickListener:()=>{
            var txt = createElement("p", {
                innerHTML: "Enter the amount of " + mat.name + " you would like " +
                           "to purchase per second. This material's cost changes constantly"
            });
            var input = createElement("input", {
                type:"number", value:mat.buy ? mat.buy : null, placeholder: "Purchase amount"
            });
            var confirmBtn = createElement("a", {
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
            var cancelBtn = createElement("a", {
                innerText:"Cancel", class:"a-link-button",
                clickListener:()=>{
                    removeElementById(purchasePopupId);
                }
            });
            createPopup(purchasePopupId, [txt, input, confirmBtn, cancelBtn]);
            input.focus();
        }
    }));

    //Button to manage exports
    buttonPanel.appendChild(createElement("a", {
        innerText:"Export", display:"inline-block", class:"a-link-button",
        clickListener:()=>{
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
            console.log(currIndustry);
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
                    innerHTML: "Industry: " + mat.exp[i].ind + "<br>" +
                               "City: " + mat.exp[i].city + "<br>" +
                               "Amount/s: " + mat.exp[i].amt,
                    clickListener:()=>{
                        mat.exp[i].splice(i, 1);

                        //Go to the target city and decrease the mat.imp attribute for the corresponding material
                        for (var i = 0; i < company.divisions.length; ++i) {
                            if (company.divisions[i].name === mat.exp[i].ind) {
                                var warehouse = company.divisions[i].warehouses[mat.exp[i].city];
                                if (warehouse instanceof Warehouse) {
                                    warehouse.materials[matName].imp -= mat.exp[i].amt;
                                    return false;
                                } else {
                                    console.log("ERROR: Target city for export does not have warehouse in specified city");
                                }
                            }
                        }
                    }
                }));
                })(i, mat, currExports);
            }
            createPopup(popupId, [exportTxt, industrySelector, citySelector, exportAmount,
                                  exportBtn, cancelBtn, currExportsText].concat(currExports));
        }
    }));


    buttonPanel.appendChild(createElement("br", {})); // Force line break

    //Button to set sell amount
    var innerTextString =   (mat.sllman[1] === -1 ? "Sell (" + formatNumber(mat.sll, 3) + "/MAX)" :
                            "Sell (" + formatNumber(mat.sll, 3) + "/" + formatNumber(mat.sllman[1], 3) + ")")
    if (mat.sCost) {
        if (isString(mat.sCost)) {
            var sCost = mat.sCost.replace(/MP/g, mat.bCost);
            innerTextString += " @ $" + formatNumber(eval(sCost), 2);
        } else {
            innerTextString += " @ $" + formatNumber(mat.sCost, 2);
        }
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
            var inputQty = createElement("input", {
                type:"text", value: mat.sllman[1] ? mat.sllman[1] : null, placeholder: "Sell amount"
            });
            var inputPx = createElement("input", {
                type:"text", value: mat.sCost ? mat.sCost : null, placeholder: "Sell price"
            });
            var confirmBtn = createElement("a", {
                innerText:"Confirm",
                class:"a-link-button",
                margin:"6px",
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
                innerText:"Cancel",
                class:"a-link-button",
                margin: "6px",
                clickListener:()=>{
                    removeElementById(sellPopupid);
                }
            });
            createPopup(sellPopupid, [txt, inputQty, inputPx, confirmBtn, cancelBtn]);
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
                   "Features: " + formatNumber(product.fea, 3) + "</span></p><br>" +
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
            var inputQty = createElement("input", {
                type:"text", value:product.sllman[city][1] ? product.sllman[city][1] : null, placeholder: "Sell amount"
            });
            var inputPx = createElement("input", {
                type:"text", value: product.sCost ? product.sCost : null, placeholder: "Sell price"
            });
            var confirmBtn = createElement("a", {
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
            var input = createElement("input", {
                type:"number", placeholder:"Limit"
            });
            var confirmBtn = createElement("a", {
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

    this.state = new CorporationState();
}

Corporation.prototype.getState = function() {
    return this.state.getState();
}

Corporation.prototype.process = function(numCycles=1) {
    this.storedCycles += numCycles;
    if (this.storedCycles >= CyclesPerIndustryStateCycle) {
        var state = this.getState(), marketCycles = 1;
        this.storedCycles -= (marketCycles * CyclesPerIndustryStateCycle);
        this.divisions.forEach(function(ind) {
            ind.process(marketCycles, state);
        });

        //At the start of a new cycle, calculate profits from previous cycle
        if (state === "START") {
            this.revenue = this.revenue.times(0);
            this.expenses = this.expenses.times(0);
            this.divisions.forEach((ind)=>{
                this.revenue = this.revenue.plus(ind.lastCycleRevenue);
                this.expenses = this.expenses.plus(ind.lastCycleExpenses);
            });
            this.funds = this.funds.plus(this.revenue.minus(this.expenses));
        }
        this.state.nextState();

        if (Engine.currentPage === Engine.Page.Corporation) {this.updateUIContent();}
    }
}

Corporation.prototype.determineValuation = function() {
    var val, profit = (this.revenue - this.expenses);
    if (this.public) {
        val = 50e9 + this.funds + (profit * getRandomInt(7000, 8500));
        val *= (Math.pow(1.1, this.divisions.length));
        val = Math.max(val, 0);
    } else {
        val = 10e9 + Math.max(this.funds, 0); //Base valuation
        if (profit > 0) {
            val += (profit * getRandomInt(12e3, 14e3));
            val *= (Math.pow(1.1, this.divisions.length));
        } else {
            val = 10e9 * Math.pow(1.1, this.divisions.length);
        }
        val -= (val % 1e6); //Round down to nearest millionth
    }
    return val;
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
    var funding = val * percShares,
        investShares = Math.floor(TOTALSHARES * percShares),
        yesBtn = yesNoBoxGetYesButton(),
        noBtn = yesNoBoxGetNoButton();
    yesBtn.innerHTML = "Accept";
    noBtn.innerHML = "Reject";
    yesBtn.addEventListener("click", ()=>{
        ++this.fundingRound;
        this.funds = this.funds.plus(funding);
        this.numShares -= investShares;
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
                   "and you will no longer own them. You will receive " +
                   numeral(initialSharePrice).format('$0.000a') + " per share.<br><br>" +
                   "Furthermore, issuing more shares now will help drive up " +
                   "your company's stock price in the future.<br><br>" +
                   "You have a total of " + this.numShares + " of shares that you can issue.",
    });
    var input = createElement("input", {
        type:"number",
        placeholder: "Shares to issue",
    });
    var yesBtn = createElement("a", {
        class:"a-link-button",
        innerText:"Go Public",
        clickListener:()=>{
            var numShares = input.value;
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
    createPopup(goPublicPopupId, [txt, input, yesBtn, noBtn]);
}

Corporation.prototype.updateSharePrice = function() {
    var targetPrice = determineValuation() / (TOTALSHARES - this.issuedShares);
    if (this.sharePrice <= targetPrice) {
        this.sharePrice *= (1 + (Math.random() * 0.01));
    } else {
        this.sharePrice *= (1 - (Math.random() * 0.01));
    }
}

//Keep 'global' variables for DOM elements so we don't have to search
//through the DOM tree repeatedly when updating UI
var companyManagementDiv, companyManagementHeaderTabs, companyManagementPanel,
    currentCityUi,
    industryOverviewPanel, industryOverviewText,
    industryEmployeePanel, industryEmployeeText, industryEmployeeHireButton, industryEmployeeList,
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

            //Add industry types to selector
            for (var key in Industries) {
                if (Industries.hasOwnProperty(key)) {
                    var ind = Industries[key];
                    selector.add(createElement("option", {
                        text: ind,
                        value:key,
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

    //Investors
    if (this.public) {
        //Sell share buttons
        var sellShares = createElement("a", {
            class:"a-link-button tooltip",
            innerText:"Sell Shares",
            display:"inline-block",
            clickListener:()=>{
                var popupId = "cmpy-mgmt-sell-shares-popup";
                var currentStockPrice = this.sharePrice;
                var txt = createElement("p", {
                    innerHTML: "Enter the number of shares you would like to sell. The current price of your " +
                               "company's stock is " + numeral(currentStockPrice).format("$0.000a"),
                });
                var profitIndicator = createElement("p", {});
                var input = createElement("input", {
                    type:"number",
                    placeholder:"Shares to sell",
                    inputListener: ()=> {
                        var numShares = Math.round(input.value);
                        if (isNaN(numShares)) {
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
                    class:"a-link-button",
                    innerText:"Sell shares",
                    display:"inline-block",
                    clickListener:()=>{
                        var shares = Math.round(input.value);
                        if (isNaN(shares)) {
                            dialogBoxCreate("ERROR: Invalid value for number of shares");
                        } else if (shares > this.numShares) {
                            dialogBoxCreate("ERROR: You don't have this many shares to sell");
                        } else {
                            this.numShares -= shares;
                            this.issuedShares += shares;
                            //TODO ADD TO PLAYER MONEY
                            removeElementById(popupId);
                            return false;
                        }

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
                createPopup(popupId, [txt, profitIndicator, input, confirmBtn, cancelBtn]);
            }
        });
        var sellSharesTooltip = createElement("span", {
            class:"tooltiptext",
            innerText:"Sell your shares in the company. This is the only way to " +
                      "profit from your business venture.",
        });
        sellShares.appendChild(sellSharesTooltip);

        //Buyback shares button
        var buybackShares = createElement("a", {
            class:"a-link-button tooltip",
            innerText:"Buyback shares",
            display:"inline-block",
            clickListener:()=>{
                var popupId = "cmpy-mgmt-buyback-shares-popup";
                var currentStockPrice = this.sharePrice;
                var txt = createElement("p", {
                    innerHTML: "Enter the number of shares you would like to buy back at market price. The current price of your " +
                               "company's stock is " + numeral(currentStockPrice).format("$0.000a"),
                });
                var costIndicator = createElement("p", {});
                var input = createElement("input", {
                    type:"number",
                    placeholder:"Shares to sell",
                    inputListener: ()=> {
                        var numShares = Math.round(input.value);
                        //TODO add conditional for if player doesn't have enough money
                        if (isNaN(numShares)) {
                            costIndicator.innerText = "ERROR: Invalid value entered for number of shares to buyback"
                        } else if (numShares > this.issuedShares) {
                            costIndicator.innerText = "There are not this many shares available to buy back. " +
                                                      "There are only " + this.issuedShares + " outstanding shares.";
                        } else {
                            costIndicator.innerText = "Purchase " + numShares + " shares for a total of " +
                                                      numeral(numShares * currentStockPrice).format('$0.000a');
                        }
                    }
                });
                var confirmBtn = createElement("a", {
                    class:"a-link-button",
                    innerText:"Sell shares",
                    display:"inline-block",
                    clickListener:()=>{
                        var shares = Math.round(input.value);
                        if (isNaN(shares)) {
                            dialogBoxCreate("ERROR: Invalid value for number of shares");
                        } else if (shares > this.issuedShares) {
                            dialogBoxCreate("ERROR: There are not this many oustanding shares to buy back");
                        } else {
                            this.numShares += shares;
                            this.issuedShares -= shares;
                            //TODO REMOVE from Player money
                            removeElementById(popupId);
                            return false;
                        }

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
                createPopup(popupId, [txt, profitIndicator, input, confirmBtn, cancelBtn]);
            }
        });
        var buybackSharesTooltip = createElement("span", {
            class:"tooltiptext",
            innerText:"Buy back shares you that previously issued or sold at market " +
                      "price."
        });
        buybackShares.appendChild(buybackSharesTooltip);

        companyManagementPanel.appendChild(sellShares);
        companyManagementPanel.appendChild(buybackShares);
    } else {
        var findInvestors = createElement("a", {
            class: this.fundingRound >= 4 ? "a-link-button-inactive" : "a-link-button tooltip",
            innerText: "Find Investors",
            display:"inline-block",
            clickListener:()=>{
                this.getInvestment();
            }
        });
        var findInvestorsTooltip = createElement("span", {
            class:"tooltiptext",
            innerText:"Search for private investors who will give you startup funding in exchange " +
                      "for equity (stock shares) in your company"
        });
        findInvestors.appendChild(findInvestorsTooltip);

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

    this.updateCorporationOverviewContent();
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
              "Stock Price: " + (this.public ? "$" + formatNumber(this.sharePrice, 2) : "N/A") + "<br>";
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
            var citySelector = createElement("select", {});
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

    //Left and right panels
    var leftPanel = createElement("div", {
        class:"cmpy-mgmt-industry-left-panel"
    });
    var rightPanel = createElement("div", {
        class:"cmpy-mgmt-industry-right-panel"
    });
    companyManagementPanel.appendChild(leftPanel);
    companyManagementPanel.appendChild(rightPanel);

    //Different sections (Overview, Employee/Office, and Warehouse)
    industryOverviewPanel = createElement("div", {
        id:"cmpy-mgmt-industry-overview-panel",
        class:"cmpy-mgmt-industry-overview-panel"
    });
    leftPanel.appendChild(industryOverviewPanel);

    industryEmployeePanel = createElement("div", {
        id:"cmpy-mgmt-employee-panel",
        class:"cmpy-mgmt-employee-panel"
    });
    leftPanel.appendChild(industryEmployeePanel);

    industryWarehousePanel = createElement("div", {
        id:"cmpy-mgmt-warehouse-panel",
        class:"cmpy-mgmt-warehouse-panel"
    });
    rightPanel.appendChild(industryWarehousePanel);

    //Industry overview text element
    industryOverviewText = createElement("p", {});
    industryOverviewPanel.appendChild(industryOverviewText);

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
    var office = division.offices[currentCityUi];
    if (!(office instanceof OfficeSpace)) {
        console.log("ERROR: Current city for UI does not have an office space");
        return;
    }
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

    industryEmployeeHireButton = createElement("a", {
        class:"a-link-button",
        innerText:"Hire Employee",
        display:"inline-block",
        clickListener:()=>{
            office.findEmployees(this);
            return false;
        }
    });
    industryEmployeePanel.appendChild(industryEmployeeHireButton);

    //Upgrade Office Size button
    industryOfficeUpgradeSizeButton = createElement("a", {
        class:"a-link-button", innerText:"Upgrade Office size", display:"inline-block", margin:"6px",
        clickListener:()=>{
            var popupId = "cmpy-mgmt-upgrade-office-size-popup";
            var upgradeCost = OfficeInitialCost * Math.pow(1.13, Math.round(office.size / OfficeInitialSize));
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
    industryEmployeePanel.appendChild(createElement("br",{}));
    industryEmployeePanel.appendChild(createElement("a", {
        class:"a-link-button",
        display:"inline-block",
        innerText:"Throw Office Party",
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
                type:"number",
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

    //Employee list
    var industryEmployeeList = createElement("ul", {
        id:"cmpy-mgmt-employee-ul"
    });
    industryEmployeePanel.appendChild(industryEmployeeList);
    for (var i = 0; i < office.employees.length; ++i) {
        (function() {
        var emp = office.employees[i];
        var li = createAccordionElement({
            id:"cmpy-mgmt-employee-" + emp.name,
            hdrText:emp.name,
        });
        var panel = li.children[1];
        if (panel == null) {
            console.log("ERROR: Could not find employee accordion panel");
            return;
        }
        emp.createUI(panel);
        industryEmployeeList.appendChild(li);
        })();
    }

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
    //Industry Overview Text
    var profit = division.lastCycleRevenue.minus(division.lastCycleExpenses).toNumber(),
        profitStr = profit >= 0 ? numeral(profit).format("$0.000a") : "-" + numeral(-1 * profit).format("$0.000a");
    industryOverviewText.innerHTML =
        "Industry: " + division.type + "<br><br>" +
        "Awareness: " + division.awareness + "<br>" +
        "Popularity: " + division.popularity +  "<br><br>" +
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
    } else {
        industryEmployeeHireButton.className = "a-link-button";
    }
    var employeeList = document.getElementById("cmpy-mgmt-employee-ul");
    if (employeeList && office instanceof OfficeSpace) {
        for (var i = 0; i < office.employees.length; ++i) {
            (function(company) {
            var emp = office.employees[i];
            var panel = document.getElementById("cmpy-mgmt-employee-" + emp.name + "-panel");
            if (panel == null) {
                var li = createAccordionElement({
                    id:"cmpy-mgmt-employee-" + emp.name,
                    hdrText:emp.name,
                });
                panel = li.children[1];
                emp.createUI(panel);
                employeeList.appendChild(li);
                return;
            }
            emp.updateUI(panel);
            })(this);
        }
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

    industryOverviewPanel       = null;
    industryOverviewText        = null;

    industryEmployeePanel       = null;
    industryEmployeeText        = null;
    industryEmployeeHireButton  = null;
    industryEmployeeList        = null;

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
