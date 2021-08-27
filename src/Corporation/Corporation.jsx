import { AllCorporationStates,
         CorporationState }                             from "./CorporationState";
import { CorporationUnlockUpgrades }                    from "./data/CorporationUnlockUpgrades";
import { CorporationUpgrades }                          from "./data/CorporationUpgrades";
import { EmployeePositions }                            from "./EmployeePositions";
import { Industries,
         IndustryStartingCosts,
         IndustryResearchTrees }                        from "./IndustryData";
import { IndustryUpgrades }                             from "./IndustryUpgrades";
import { Material }                                     from "./Material";
import { MaterialSizes }                                from "./MaterialSizes";
import { Product }                                      from "./Product";
import { ResearchMap }                                  from "./ResearchMap";
import { Warehouse }                                    from "./Warehouse";

import { BitNodeMultipliers }                           from "../BitNode/BitNodeMultipliers";
import { showLiterature }                               from "../Literature/LiteratureHelpers";
import { LiteratureNames }                              from "../Literature/data/LiteratureNames";
import { CityName }                                     from "../Locations/data/CityNames";
import { Player }                                       from "../Player";

import { numeralWrapper }                               from "../ui/numeralFormat";
import { Page, routing }                                from "../ui/navigationTracking";

import { calculateEffectWithFactors }                   from "../utils/calculateEffectWithFactors";

import { dialogBoxCreate }                              from "../../utils/DialogBox";
import { Reviver,
         Generic_toJSON,
         Generic_fromJSON }                             from "../../utils/JSONReviver";
import { appendLineBreaks }                             from "../../utils/uiHelpers/appendLineBreaks";
import { createElement }                                from "../../utils/uiHelpers/createElement";
import { createPopup }                                  from "../../utils/uiHelpers/createPopup";
import { createPopupCloseButton }                       from "../../utils/uiHelpers/createPopupCloseButton";
import { formatNumber, generateRandomString }           from "../../utils/StringHelperFunctions";
import { getRandomInt }                                 from "../../utils/helpers/getRandomInt";
import { isString }                                     from "../../utils/helpers/isString";
import { KEY }                                          from "../../utils/helpers/keyCodes";
import { removeElement }                                from "../../utils/uiHelpers/removeElement";
import { removeElementById }                            from "../../utils/uiHelpers/removeElementById";
import { yesNoBoxCreate,
         yesNoTxtInpBoxCreate,
         yesNoBoxGetYesButton,
         yesNoBoxGetNoButton,
         yesNoTxtInpBoxGetYesButton,
         yesNoTxtInpBoxGetNoButton,
         yesNoTxtInpBoxGetInput,
         yesNoBoxClose,
         yesNoTxtInpBoxClose }                          from "../../utils/YesNoBox";

// UI Related Imports
import React                                            from "react";
import ReactDOM                                         from "react-dom";
import { CorporationEventHandler }                      from "./ui/CorporationUIEventHandler";
import { CorporationRoot }                              from "./ui/Root";
import { CorporationRouting }                           from "./ui/Routing";

import Decimal                                          from "decimal.js";

/* Constants */
export const INITIALSHARES                  = 1e9; //Total number of shares you have at your company
export const SHARESPERPRICEUPDATE           = 1e6; //When selling large number of shares, price is dynamically updated for every batch of this amount
export const IssueNewSharesCooldown         = 216e3; // 12 Hour in terms of game cycles
export const SellSharesCooldown             = 18e3; // 1 Hour in terms of game cycles

export const CyclesPerMarketCycle           = 50;
export const CyclesPerIndustryStateCycle    = CyclesPerMarketCycle / AllCorporationStates.length;
export const SecsPerMarketCycle             = CyclesPerMarketCycle / 5;

export const Cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];

export const WarehouseInitialCost           = 5e9; //Initial purchase cost of warehouse
export const WarehouseInitialSize           = 100;
export const WarehouseUpgradeBaseCost       = 1e9;

export const OfficeInitialCost              = 4e9;
export const OfficeInitialSize              = 3;
export const OfficeUpgradeBaseCost          = 1e9;

export const BribeThreshold                 = 100e12; //Money needed to be able to bribe for faction rep
export const BribeToRepRatio                = 1e9;   //Bribe Value divided by this = rep gain

export const ProductProductionCostRatio     = 5;    //Ratio of material cost of a product to its production cost

export const DividendMaxPercentage          = 50;

export const EmployeeSalaryMultiplier       = 3;    // Employee stats multiplied by this to determine initial salary
export const CyclesPerEmployeeRaise         = 400;  // All employees get a raise every X market cycles
export const EmployeeRaiseAmount            = 50;   // Employee salary increases by this (additive)

export const BaseMaxProducts                = 3;    // Initial value for maximum number of products allowed

// Delete Research Popup Box when clicking outside of it
let researchTreeBoxOpened = false;
let researchTreeBox = null;
$(document).mousedown(function(event) {
    const contentId = "corporation-research-popup-box-content";
    if (researchTreeBoxOpened) {
        if ( $(event.target).closest("#" + contentId).get(0) == null ) {
            // Delete the box
            removeElement(researchTreeBox);
            researchTreeBox = null;
            researchTreeBoxOpened = false;
        }
    }
});

function Industry(params={}) {
    this.offices = { //Maps locations to offices. 0 if no office at that location
        [CityName.Aevum]: 0,
        [CityName.Chongqing]: 0,
        [CityName.Sector12]: new OfficeSpace({
            loc:CityName.Sector12,
            size:OfficeInitialSize,
        }),
        [CityName.NewTokyo]: 0,
        [CityName.Ishima]: 0,
        [CityName.Volhaven]: 0,
    };

    this.name   = params.name ? params.name : 0;
    this.type   = params.type ? params.type : Industries.Agriculture;

    this.sciResearch    = new Material({name: "Scientific Research"});
    this.researched = {}; // Object of acquired Research. Keys = research name

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

    this.warehouses = { //Maps locations to warehouses. 0 if no warehouse at that location
        [CityName.Aevum]: 0,
        [CityName.Chonqing]: 0,
        [CityName.Sector12]: new Warehouse({
            corp: params.corp,
            industry: this,
            loc: CityName.Sector12,
            size: WarehouseInitialSize,
        }),
        [CityName.NewTokyo]: 0,
        [CityName.Ishima]: 0,
        [CityName.Volhaven]: 0,
    };

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
            this.advFac = 0.08;
            this.reqMats = {
                "Hardware": 0.1,
                "Metal":    0.2,
            };
            this.prodMats = ["Energy"];
            break;
        case Industries.Utilities:
        case "Utilities":
            this.reFac  = 0.5;
            this.sciFac = 0.6;
            this.robFac = 0.4;
            this.aiFac  = 0.4;
            this.advFac = 0.08;
            this.reqMats = {
                "Hardware": 0.1,
                "Metal":    0.1,
            }
            this.prodMats = ["Water"];
            break;
        case Industries.Agriculture:
            this.reFac  = 0.72;
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
            this.advFac = 0.08;
            this.reqMats = {
                "Energy":   0.5,
            }
            this.prodMats = ["Food"];
            break;
        case Industries.Mining:
            this.reFac  = 0.3;
            this.sciFac = 0.26;
            this.hwFac  = 0.4;
            this.robFac = 0.45;
            this.aiFac  = 0.45;
            this.advFac = 0.06;
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
            this.advFac = 0.07;
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
            this.advFac = 0.16;
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
            this.sciFac = 0.62;
            this.robFac = 0.36;
            this.aiFac  = 0.19;
            this.advFac = 0.17;
            this.reqMats = {
                "Metal":    2,
                "Energy":   1,
            }
            this.prodMats = ["Hardware"];
            this.makesProducts = true;
            break;
        case Industries.Robotics:
            this.reFac  = 0.32;
            this.sciFac = 0.65;
            this.aiFac  = 0.36;
            this.advFac = 0.18;
            this.hwFac  = 0.19;
            this.reqMats = {
                "Hardware":     5,
                "Energy":       3,
            }
            this.prodMats = ["Robots"];
            this.makesProducts = true;
            break;
        case Industries.Software:
            this.sciFac = 0.62;
            this.advFac = 0.16;
            this.hwFac  = 0.25;
            this.reFac  = 0.15;
            this.aiFac  = 0.18;
            this.robFac = 0.05;
            this.reqMats = {
                "Hardware":     0.5,
                "Energy":       0.5,
            }
            this.prodMats = ["AICores"];
            this.makesProducts = true;
            break;
        case Industries.Healthcare:
            this.reFac  = 0.1;
            this.sciFac = 0.75;
            this.advFac = 0.11;
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
                "Metal":    5,
                "Energy":   5,
                "Water":    2,
                "Hardware": 4,
            }
            this.prodMats = ["RealEstate"];
            this.makesProducts = true;
            break;
        default:
            console.error(`Invalid Industry Type passed into Industry.init(): ${this.type}`);
            return;
    }
}

Industry.prototype.getProductDescriptionText = function() {
    if (!this.makesProducts) {return;}
    switch (this.type) {
        case Industries.Food:
            return "create and manage restaurants";
        case Industries.Tobacco:
            return "create tobacco and tobacco-related products";
        case Industries.Pharmaceutical:
            return "develop new pharmaceutical drugs";
        case Industries.Computer:
        case "Computer":
            return "create new computer hardware and networking infrastructures";
        case Industries.Robotics:
            return "build specialized robots and robot-related products";
        case Industries.Software:
            return "develop computer software";
        case Industries.Healthcare:
            return "build and manage hospitals";
        case Industries.RealEstate:
            return "develop and manage real estate properties";
        default:
            console.error("Invalid industry type in Industry.getProductDescriptionText");
            return "";
    }
}

Industry.prototype.getMaximumNumberProducts = function() {
    if (!this.makesProducts) { return 0; }

    // Calculate additional number of allowed Products from Research/Upgrades
    let additional = 0;
    if (this.hasResearch("uPgrade: Capacity.I"))    { ++additional; }
    if (this.hasResearch("uPgrade: Capacity.II"))   { ++additional; }

    return BaseMaxProducts + additional;
}

Industry.prototype.hasMaximumNumberProducts = function() {
    return (Object.keys(this.products).length >= this.getMaximumNumberProducts());
}

//Calculates the values that factor into the production and properties of
//materials/products (such as quality, etc.)
Industry.prototype.calculateProductionFactors = function() {
    var multSum = 0;
    for (var i = 0; i < Cities.length; ++i) {
        var city = Cities[i];
        var warehouse = this.warehouses[city];
        if (!(warehouse instanceof Warehouse)) {
            continue;
        }

        var materials = warehouse.materials;

        var cityMult =  Math.pow(0.002 * materials.RealEstate.qty+1, this.reFac) *
                        Math.pow(0.002 * materials.Hardware.qty+1, this.hwFac) *
                        Math.pow(0.002 * materials.Robots.qty+1, this.robFac) *
                        Math.pow(0.002 * materials.AICores.qty+1, this.aiFac);
        multSum += Math.pow(cityMult, 0.73);
    }

    multSum < 1 ? this.prodMult = 1 : this.prodMult = multSum;
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
            if (prod.data[warehouse.loc][0] > 0) {
                warehouse.breakdown += (prodName + ": " + formatNumber(prod.data[warehouse.loc][0] * prod.siz, 0) + "<br>");
            }
        }
    }
}

Industry.prototype.process = function(marketCycles=1, state, company) {
    this.state = state;

    //At the start of a cycle, store and reset revenue/expenses
    //Then calculate salaries and processs the markets
    if (state === "START") {
        if (isNaN(this.thisCycleRevenue) || isNaN(this.thisCycleExpenses)) {
            console.error("NaN in Corporation's computed revenue/expenses");
            dialogBoxCreate("Something went wrong when compting Corporation's revenue/expenses. This is a bug. Please report to game developer");
            this.thisCycleRevenue = new Decimal(0);
            this.thisCycleExpenses = new Decimal(0);
        }
        this.lastCycleRevenue = this.thisCycleRevenue.dividedBy(marketCycles * SecsPerMarketCycle);
        this.lastCycleExpenses = this.thisCycleExpenses.dividedBy(marketCycles * SecsPerMarketCycle);
        this.thisCycleRevenue = new Decimal(0);
        this.thisCycleExpenses = new Decimal(0);

        // Once you start making revenue, the player should no longer be
        // considered new, and therefore no longer needs the 'tutorial' UI elements
        if (this.lastCycleRevenue.gt(0)) {this.newInd = false;}

        // Process offices (and the employees in them)
        var employeeSalary = 0;
        for (var officeLoc in this.offices) {
            if (this.offices[officeLoc] instanceof OfficeSpace) {
                employeeSalary += this.offices[officeLoc].process(marketCycles, {industry:this, corporation:company});
            }
        }
        this.thisCycleExpenses = this.thisCycleExpenses.plus(employeeSalary);

        // Process change in demand/competition of materials/products
        this.processMaterialMarket(marketCycles);
        this.processProductMarket(marketCycles);

        // Process loss of popularity
        this.popularity -= (marketCycles * .0001);
        this.popularity = Math.max(0, this.popularity);

        // Process Dreamsense gains
        var popularityGain = company.getDreamSenseGain(), awarenessGain = popularityGain * 4;
        if (popularityGain > 0) {
            this.popularity += (popularityGain * marketCycles);
            this.awareness += (awarenessGain * marketCycles);
        }

        return;
    }

    // Process production, purchase, and import/export of materials
    let res = this.processMaterials(marketCycles, company);
    if (Array.isArray(res)) {
        this.thisCycleRevenue = this.thisCycleRevenue.plus(res[0]);
        this.thisCycleExpenses = this.thisCycleExpenses.plus(res[1]);
    }

    // Process creation, production & sale of products
    res = this.processProducts(marketCycles, company);
    if (Array.isArray(res)) {
        this.thisCycleRevenue = this.thisCycleRevenue.plus(res[0]);
        this.thisCycleExpenses = this.thisCycleExpenses.plus(res[1]);
    }
}

// Process change in demand and competition for this industry's materials
Industry.prototype.processMaterialMarket = function() {
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

// Process change in demand and competition for this industry's products
Industry.prototype.processProductMarket = function(marketCycles=1) {
    // Demand gradually decreases, and competition gradually increases
    for (const name in this.products) {
        if (this.products.hasOwnProperty(name)) {
            const product = this.products[name];
            let change = getRandomInt(0, 3) * 0.0004;
            if (change === 0) { continue; }

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
    this.calculateProductionFactors();

    //At the start of the export state, set the imports of everything to 0
    if (this.state === "EXPORT") {
        for (let i = 0; i < Cities.length; ++i) {
            var city = Cities[i], office = this.offices[city];
            if (!(this.warehouses[city] instanceof Warehouse)) {
                continue;
            }
            var warehouse = this.warehouses[city];
            for (var matName in warehouse.materials) {
                if (warehouse.materials.hasOwnProperty(matName)) {
                    var mat = warehouse.materials[matName];
                    mat.imp = 0;
                }
            }
        }
    }

    for (let i = 0; i < Cities.length; ++i) {
        var city = Cities[i], office = this.offices[city];

        if (this.warehouses[city] instanceof Warehouse) {
            var warehouse = this.warehouses[city];

            switch(this.state) {

            case "PURCHASE":
            /* Process purchase of materials */
            for (var matName in warehouse.materials) {
                if (warehouse.materials.hasOwnProperty(matName)) {
                    (function(matName, ind) {
                    var mat = warehouse.materials[matName];
                    var buyAmt, maxAmt;
                    if (warehouse.smartSupplyEnabled && Object.keys(ind.reqMats).includes(matName)) {
                        //Smart supply tracker is stored as per second rate
                        mat.buy = ind.reqMats[matName] * warehouse.smartSupplyStore;
                        buyAmt = mat.buy * SecsPerMarketCycle * marketCycles;
                    } else {
                        buyAmt = (mat.buy * SecsPerMarketCycle * marketCycles);
                    }

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
                })(matName, this);
                    this.updateWarehouseSizeUsed(warehouse);
                }
            } //End process purchase of materials
            break;

            case "PRODUCTION":
            warehouse.smartSupplyStore = 0; //Reset smart supply amount

            /* Process production of materials */
            if (this.prodMats.length > 0) {
                var mat = warehouse.materials[this.prodMats[0]];
                //Calculate the maximum production of this material based
                //on the office's productivity
                var maxProd = this.getOfficeProductivity(office)
                            * this.prodMult                     // Multiplier from materials
                            * company.getProductionMultiplier()
                            * this.getProductionMultiplier();   // Multiplier from Research
                let prod;

                if (mat.prdman[0]) {
                    //Production is manually limited
                    prod = Math.min(maxProd, mat.prdman[1]);
                } else {
                    prod = maxProd;
                }
                prod *= (SecsPerMarketCycle * marketCycles); //Convert production from per second to per market cycle

                // Calculate net change in warehouse storage making the produced materials will cost
                var totalMatSize = 0;
                for (let tmp = 0; tmp < this.prodMats.length; ++tmp) {
                    totalMatSize += (MaterialSizes[this.prodMats[tmp]]);
                }
                for (const reqMatName in this.reqMats) {
                    var normQty = this.reqMats[reqMatName];
                    totalMatSize -= (MaterialSizes[reqMatName] * normQty);
                }
                // If not enough space in warehouse, limit the amount of produced materials
                if (totalMatSize > 0) {
                    var maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / totalMatSize);
                    prod = Math.min(maxAmt, prod);
                }

                if (prod < 0) {prod = 0;}

                // Keep track of production for smart supply (/s)
                warehouse.smartSupplyStore += (prod / (SecsPerMarketCycle * marketCycles));

                // Make sure we have enough resource to make our materials
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

                // Make our materials if they are producable
                if (producableFrac > 0 && prod > 0) {
                    for (const reqMatName in this.reqMats) {
                        var reqMatQtyNeeded = (this.reqMats[reqMatName] * prod * producableFrac);
                        warehouse.materials[reqMatName].qty -= reqMatQtyNeeded;
                        warehouse.materials[reqMatName].prd = 0;
                        warehouse.materials[reqMatName].prd -= reqMatQtyNeeded / (SecsPerMarketCycle * marketCycles);
                    }
                    for (let j = 0; j < this.prodMats.length; ++j) {
                        warehouse.materials[this.prodMats[j]].qty += (prod * producableFrac);
                        warehouse.materials[this.prodMats[j]].qlt =
                            (office.employeeProd[EmployeePositions.Engineer] / 90 +
                             Math.pow(this.sciResearch.qty, this.sciFac) +
                             Math.pow(warehouse.materials["AICores"].qty, this.aiFac) / 10e3);
                    }
                } else {
                    for (const reqMatName in this.reqMats) {
                        if (this.reqMats.hasOwnProperty(reqMatName)) {
                            warehouse.materials[reqMatName].prd = 0;
                        }
                    }
                }

                //Per second
                const fooProd = prod * producableFrac / (SecsPerMarketCycle * marketCycles);
                for (let fooI = 0; fooI < this.prodMats.length; ++fooI) {
                    warehouse.materials[this.prodMats[fooI]].prd = fooProd;
                }
            } else {
                //If this doesn't produce any materials, then it only creates
                //Products. Creating products will consume materials. The
                //Production of all consumed materials must be set to 0
                for (const reqMatName in this.reqMats) {
                    warehouse.materials[reqMatName].prd = 0;
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

                    // Sale multipliers
                    const businessFactor = this.getBusinessFactor(office);        //Business employee productivity
                    const advertisingFactor = this.getAdvertisingFactors()[0];    //Awareness + popularity
                    const marketFactor = this.getMarketFactor(mat);               //Competition + demand

                    // Determine the cost that the material will be sold at
                    const markupLimit = mat.getMarkupLimit();
                    var sCost;
                    if (mat.marketTa2) {
                        const prod = mat.prd;

                        // Reverse engineer the 'maxSell' formula
                        // 1. Set 'maxSell' = prod
                        // 2. Substitute formula for 'markup'
                        // 3. Solve for 'sCost'
                        const numerator = markupLimit;
                        const sqrtNumerator = prod;
                        const sqrtDenominator = ((mat.qlt + .001)
                                                  * marketFactor
                                                  * businessFactor
                                                  * company.getSalesMultiplier()
                                                  * advertisingFactor
                                                  * this.getSalesMultiplier());
                        const denominator = Math.sqrt(sqrtNumerator / sqrtDenominator);
                        let optimalPrice;
                        if (sqrtDenominator === 0 || denominator === 0) {
                            if (sqrtNumerator === 0) {
                                optimalPrice = 0; // No production
                            } else {
                                optimalPrice = mat.bCost + markupLimit;
                                console.warn(`In Corporation, found illegal 0s when trying to calculate MarketTA2 sale cost`);
                            }
                        } else {
                            optimalPrice = (numerator / denominator) + mat.bCost;
                        }

                        // We'll store this "Optimal Price" in a property so that we don't have
                        // to re-calculate it for the UI
                        mat.marketTa2Price = optimalPrice;

                        sCost = optimalPrice;
                    } else if (mat.marketTa1) {
                        sCost = mat.bCost + markupLimit;
                    } else if (isString(mat.sCost)) {
                        sCost = mat.sCost.replace(/MP/g, mat.bCost);
                        sCost = eval(sCost);
                    } else {
                        sCost = mat.sCost;
                    }

                    // Calculate how much of the material sells (per second)
                    let markup = 1;
                    if (sCost > mat.bCost) {
                        //Penalty if difference between sCost and bCost is greater than markup limit
                        if ((sCost - mat.bCost) > markupLimit) {
                            markup = Math.pow(markupLimit / (sCost - mat.bCost), 2);
                        }
                    } else if (sCost < mat.bCost) {
                        if (sCost <= 0) {
                            markup = 1e12; //Sell everything, essentially discard
                        } else {
                            //Lower prices than market increases sales
                            markup = mat.bCost / sCost;
                        }
                    }

                    var maxSell = (mat.qlt + .001)
                                * marketFactor
                                * markup
                                * businessFactor
                                * company.getSalesMultiplier()
                                * advertisingFactor
                                * this.getSalesMultiplier();
                    var sellAmt;
                    if (isString(mat.sllman[1])) {
                        //Dynamically evaluated
                        var tmp = mat.sllman[1].replace(/MAX/g, maxSell);
                        tmp = tmp.replace(/PROD/g, mat.prd);
                        try {
                            sellAmt = eval(tmp);
                        } catch(e) {
                            dialogBoxCreate("Error evaluating your sell amount for material " + mat.name +
                                            " in " + this.name + "'s " + city + " office. The sell amount " +
                                            "is being set to zero");
                            sellAmt = 0;
                        }
                        sellAmt = Math.min(maxSell, sellAmt);
                    } else if (mat.sllman[1] === -1) {
                        //Backwards compatibility, -1 = MAX
                        sellAmt = maxSell;
                    } else {
                        //Player's input value is just a number
                        sellAmt = Math.min(maxSell, mat.sllman[1]);
                    }

                    sellAmt = (sellAmt * SecsPerMarketCycle * marketCycles);
                    sellAmt = Math.min(mat.qty, sellAmt);
                    if (sellAmt < 0) {
                        console.warn(`sellAmt calculated to be negative for ${matName} in ${city}`);
                        mat.sll = 0;
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
                        mat.totalExp = 0; //Reset export
                        for (var expI = 0; expI < mat.exp.length; ++expI) {
                            var exp = mat.exp[expI];
                            var amt = exp.amt.replace(/MAX/g, mat.qty / (SecsPerMarketCycle * marketCycles));
                            try {
                                amt = eval(amt);
                            } catch(e) {
                                dialogBoxCreate("Calculating export for " + mat.name + " in " +
                                                this.name +  "'s " + city + " division failed with " +
                                                "error: " + e);
                                continue;
                            }
                            if (isNaN(amt)) {
                                dialogBoxCreate("Error calculating export amount for " + mat.name +  " in " +
                                                this.name + "'s " + city + " division.");
                                continue;
                            }
                            amt = amt * SecsPerMarketCycle * marketCycles;

                            if (mat.qty < amt) {
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
                                        console.error(`Invalid export! ${expIndustry.name} ${exp.city}`);
                                        break;
                                    }

                                    // Make sure theres enough space in warehouse
                                    if (expWarehouse.sizeUsed >= expWarehouse.size) {
                                        // Warehouse at capacity. Exporting doesnt
                                        // affect revenue so just return 0's
                                        return [0, 0];
                                    } else {
                                        var maxAmt = Math.floor((expWarehouse.size - expWarehouse.sizeUsed) / MaterialSizes[matName]);
                                        amt = Math.min(maxAmt, amt);
                                    }
                                    expWarehouse.materials[matName].imp += (amt / (SecsPerMarketCycle * marketCycles));
                                    expWarehouse.materials[matName].qty += amt;
                                    expWarehouse.materials[matName].qlt = mat.qlt;
                                    mat.qty -= amt;
                                    mat.totalExp += amt;
                                    expIndustry.updateWarehouseSizeUsed(expWarehouse);
                                    break;
                                }
                            }
                        }
                        //totalExp should be per second
                        mat.totalExp /= (SecsPerMarketCycle * marketCycles);
                    }
                }

                break;

            case "START":
                break;
            default:
                console.error(`Invalid state: ${this.state}`);
                break;
            } //End switch(this.state)
            this.updateWarehouseSizeUsed(warehouse);

        } // End warehouse

        //Produce Scientific Research based on R&D employees
        //Scientific Research can be produced without a warehouse
        if (office instanceof OfficeSpace) {
            this.sciResearch.qty += (.004
                                     * Math.pow(office.employeeProd[EmployeePositions.RandD], 0.5)
                                     * company.getScientificResearchMultiplier()
                                     * this.getScientificResearchMultiplier());
        }
    }
    return [revenue, expenses];
}

//Process production & sale of this industry's FINISHED products (including all of their stats)
Industry.prototype.processProducts = function(marketCycles=1, corporation) {
    var revenue = 0, expenses = 0;

    //Create products
    if (this.state === "PRODUCTION") {
        for (const prodName in this.products) {
            const prod = this.products[prodName];
            if (!prod.fin) {
                const city = prod.createCity;
                const office = this.offices[city];

                // Designing/Creating a Product is based mostly off Engineers
                const engrProd  = office.employeeProd[EmployeePositions.Engineer];
                const mgmtProd  = office.employeeProd[EmployeePositions.Management];
                const opProd    = office.employeeProd[EmployeePositions.Operations];
                const total = engrProd + mgmtProd + opProd;
                if (total <= 0) { break; }

                // Management is a multiplier for the production from Engineers
                const mgmtFactor = 1 + (mgmtProd / (1.2 * total));

                const progress = (Math.pow(engrProd, 0.34) + Math.pow(opProd, 0.2)) * mgmtFactor;

                prod.createProduct(marketCycles, progress);
                if (prod.prog >= 100) {
                     prod.finishProduct(office.employeeProd, this);
                }
                break;
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
    let totalProfit = 0;
    for (let i = 0; i < Cities.length; ++i) {
        let city = Cities[i], office = this.offices[city], warehouse = this.warehouses[city];
        if (warehouse instanceof Warehouse) {
            switch(this.state) {

            case "PRODUCTION": {
            //Calculate the maximum production of this material based
            //on the office's productivity
            var maxProd = this.getOfficeProductivity(office, {forProduct:true})
                        * corporation.getProductionMultiplier()
                        * this.prodMult                             // Multiplier from materials
                        * this.getProductionMultiplier()            // Multiplier from research
                        * this.getProductProductionMultiplier();    // Multiplier from research
            let prod;

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

            warehouse.smartSupplyStore += (prod / (SecsPerMarketCycle * marketCycles));

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
            }
            case "SALE": {
            //Process sale of Products
            product.pCost = 0; //Estimated production cost
            for (var reqMatName in product.reqMats) {
                if (product.reqMats.hasOwnProperty(reqMatName)) {
                    product.pCost += (product.reqMats[reqMatName] * warehouse.materials[reqMatName].bCost);
                }
            }

            // Since its a product, its production cost is increased for labor
            product.pCost *= ProductProductionCostRatio;

            // Sale multipliers
            const businessFactor = this.getBusinessFactor(office);        //Business employee productivity
            const advertisingFactor = this.getAdvertisingFactors()[0];    //Awareness + popularity
            const marketFactor = this.getMarketFactor(product);           //Competition + demand

            // Calculate Sale Cost (sCost), which could be dynamically evaluated
            const markupLimit = product.rat / product.mku;
            var sCost;
            if (product.marketTa2) {
                const prod = product.data[city][1];

                // Reverse engineer the 'maxSell' formula
                // 1. Set 'maxSell' = prod
                // 2. Substitute formula for 'markup'
                // 3. Solve for 'sCost'roduct.pCost = sCost
                const numerator = markupLimit;
                const sqrtNumerator = prod;
                const sqrtDenominator = (0.5
                                         * Math.pow(product.rat, 0.65)
                                         * marketFactor
                                         * corporation.getSalesMultiplier()
                                         * businessFactor
                                         * advertisingFactor
                                         * this.getSalesMultiplier());
                const denominator = Math.sqrt(sqrtNumerator / sqrtDenominator);
                let optimalPrice;
                if (sqrtDenominator === 0 || denominator === 0) {
                    if (sqrtNumerator === 0) {
                        optimalPrice = 0; // No production
                    } else {
                        optimalPrice = product.pCost + markupLimit;
                        console.warn(`In Corporation, found illegal 0s when trying to calculate MarketTA2 sale cost`);
                    }
                } else {
                    optimalPrice = (numerator / denominator) + product.pCost;
                }

                // Store this "optimal Price" in a property so we don't have to re-calculate for UI
                product.marketTa2Price[city] = optimalPrice;
                sCost = optimalPrice;
            } else if (product.marketTa1) {
                sCost = product.pCost + markupLimit;
            } else if (isString(product.sCost)) {
                sCost = product.sCost.replace(/MP/g, product.pCost + product.rat / product.mku);
                sCost = eval(sCost);
            } else {
                sCost = product.sCost;
            }

            var markup = 1;
            if (sCost > product.pCost) {
                if ((sCost - product.pCost) > markupLimit) {
                    markup = markupLimit / (sCost - product.pCost);
                }
            }

            var maxSell = 0.5
                        * Math.pow(product.rat, 0.65)
                        * marketFactor
                        * corporation.getSalesMultiplier()
                        * Math.pow(markup, 2)
                        * businessFactor
                        * advertisingFactor
                        * this.getSalesMultiplier();
            var sellAmt;
            if (product.sllman[city][0] && isString(product.sllman[city][1])) {
                //Sell amount is dynamically evaluated
                var tmp = product.sllman[city][1].replace(/MAX/g, maxSell);
                tmp = tmp.replace(/PROD/g, product.data[city][1]);
                try {
                    tmp = eval(tmp);
                } catch(e) {
                    dialogBoxCreate("Error evaluating your sell price expression for " + product.name +
                                    " in " + this.name + "'s " + city + " office. Sell price is being set to MAX");
                    tmp = maxSell;
                }
                sellAmt = Math.min(maxSell, tmp);
            } else if (product.sllman[city][0] && product.sllman[city][1] > 0) {
                //Sell amount is manually limited
                sellAmt = Math.min(maxSell, product.sllman[city][1]);
            } else if (product.sllman[city][0] === false){
                sellAmt = 0;
            } else {
                sellAmt = maxSell;
            }
            if (sellAmt < 0) { sellAmt = 0; }
            sellAmt = sellAmt * SecsPerMarketCycle * marketCycles;
            sellAmt = Math.min(product.data[city][0], sellAmt); //data[0] is qty
            if (sellAmt && sCost) {
                product.data[city][0] -= sellAmt; //data[0] is qty
                totalProfit += (sellAmt * sCost);
                product.data[city][2] = sellAmt / (SecsPerMarketCycle * marketCycles); //data[2] is sell property
            } else {
                product.data[city][2] = 0; //data[2] is sell property
            }
            break;
            }
            case "START":
            case "PURCHASE":
            case "EXPORT":
                break;
            default:
                console.error(`Invalid State: ${this.state}`);
                break;
            } //End switch(this.state)
        }
    }
    return totalProfit;
}

Industry.prototype.discontinueProduct = function(product) {
    for (var productName in this.products) {
        if (this.products.hasOwnProperty(productName)) {
            if (product === this.products[productName]) {
                delete this.products[productName];
            }
        }
    }
}

Industry.prototype.upgrade = function(upgrade, refs) {
    var corporation = refs.corporation;
    var office = refs.office;
    var upgN = upgrade[0];
    while (this.upgrades.length <= upgN) {this.upgrades.push(0);}
    ++this.upgrades[upgN];

    switch (upgN) {
        case 0: //Coffee, 5% energy per employee
            for (let i = 0; i < office.employees.length; ++i) {
                office.employees[i].ene = Math.min(office.employees[i].ene * 1.05, office.maxEne);
            }
            break;
        case 1: //AdVert.Inc,
            var advMult = corporation.getAdvertisingMultiplier() * this.getAdvertisingMultiplier();
            this.awareness += (3 * advMult);
            this.popularity += (1 * advMult);
            this.awareness *= (1.01 * advMult);
            this.popularity *= ((1 + getRandomInt(1, 3) / 100) * advMult);
            break;
        default:
            console.error(`Un-implemented function index: ${upgN}`);
            break;
    }
}

// Returns how much of a material can be produced based of office productivity (employee stats)
Industry.prototype.getOfficeProductivity = function(office, params) {
    const opProd    = office.employeeProd[EmployeePositions.Operations];
    const engrProd  = office.employeeProd[EmployeePositions.Engineer];
    const mgmtProd  = office.employeeProd[EmployeePositions.Management]
    const total     = opProd + engrProd + mgmtProd;

    if (total <= 0) { return 0; }

    // Management is a multiplier for the production from Operations and Engineers
    const mgmtFactor = 1 + (mgmtProd / (1.2 * total));

    // For production, Operations is slightly more important than engineering
    // Both Engineering and Operations have diminishing returns
    const prod = (Math.pow(opProd, 0.4) + Math.pow(engrProd, 0.3)) * mgmtFactor;

    // Generic multiplier for the production. Used for game-balancing purposes
    const balancingMult = 0.05;

    if (params && params.forProduct) {
        // Products are harder to create and therefore have less production
        return 0.5 * balancingMult * prod;
    } else {
        return balancingMult * prod;
    }
}

// Returns a multiplier based on the office' 'Business' employees that affects sales
Industry.prototype.getBusinessFactor = function(office) {
    const businessProd = 1 + office.employeeProd[EmployeePositions.Business];

    return calculateEffectWithFactors(businessProd, 0.26, 10e3);
}

//Returns a set of multipliers based on the Industry's awareness, popularity, and advFac. This
//multiplier affects sales. The result is:
//  [Total sales mult, total awareness mult, total pop mult, awareness/pop ratio mult]
Industry.prototype.getAdvertisingFactors = function() {
    var awarenessFac = Math.pow(this.awareness + 1, this.advFac);
    var popularityFac = Math.pow(this.popularity + 1, this.advFac);
    var ratioFac = (this.awareness === 0 ? 0.01 : Math.max((this.popularity + .001) / this.awareness, 0.01));
    var totalFac = Math.pow(awarenessFac * popularityFac * ratioFac, 0.85);
    return [totalFac, awarenessFac, popularityFac, ratioFac];
}

//Returns a multiplier based on a materials demand and competition that affects sales
Industry.prototype.getMarketFactor = function(mat) {
    return Math.max(0.1, mat.dmd * (100 - mat.cmp) / 100);
}

// Returns a boolean indicating whether this Industry has the specified Research
Industry.prototype.hasResearch = function(name) {
    return (this.researched[name] === true);
}

Industry.prototype.updateResearchTree = function() {
    const researchTree = IndustryResearchTrees[this.type];

    // Since ResearchTree data isnt saved, we'll update the Research Tree data
    // based on the stored 'researched' property in the Industry object
    if (Object.keys(researchTree.researched).length !== Object.keys(this.researched).length) {
        for (let research in this.researched) {
            researchTree.research(research);
        }
    }
}

// Get multipliers from Research
Industry.prototype.getAdvertisingMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getAdvertisingMultiplier();
}

Industry.prototype.getEmployeeChaMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getEmployeeChaMultiplier();
}

Industry.prototype.getEmployeeCreMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getEmployeeCreMultiplier();
}

Industry.prototype.getEmployeeEffMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getEmployeeEffMultiplier();
}

Industry.prototype.getEmployeeIntMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getEmployeeIntMultiplier();
}

Industry.prototype.getProductionMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getProductionMultiplier();
}

Industry.prototype.getProductProductionMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getProductProductionMultiplier();
}

Industry.prototype.getSalesMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getSalesMultiplier();
}

Industry.prototype.getScientificResearchMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getScientificResearchMultiplier();
}

Industry.prototype.getStorageMultiplier = function() {
    this.updateResearchTree();
    return IndustryResearchTrees[this.type].getStorageMultiplier();
}

// Create the Research Tree UI for this Industry
Industry.prototype.createResearchBox = function() {
    const boxId = "corporation-research-popup-box";

    if (researchTreeBoxOpened) {
        // It's already opened, so delete it to refresh content
        removeElementById(boxId);
        researchTreeBox = null;
    }

    const researchTree = IndustryResearchTrees[this.type];

    // Create the popup first, so that the tree diagram can be added to it
    // This is handled by Treant
    researchTreeBox = createPopup(boxId, [], { backgroundColor: "black" });

    // Get the tree's markup (i.e. config) for Treant
    const markup = researchTree.createTreantMarkup();
    markup.chart.container = "#" + boxId + "-content";
    markup.chart.nodeAlign = "BOTTOM";
    markup.chart.rootOrientation = "WEST";
    markup.chart.siblingSeparation = 40;
    markup.chart.connectors = {
        type: "step",
        style: {
            "arrow-end": "block-wide-long",
            "stroke": "white",
            "stroke-width": 2,
        },
    }

    // Construct the tree with Treant
    // This is required for side effect.
    // eslint-disable-next-line no-new
    new Treant(markup);

    // Add Event Listeners for all Nodes
    const allResearch = researchTree.getAllNodes();
    for (let i = 0; i < allResearch.length; ++i) {
        // If this is already Researched, skip it
        if (this.researched[allResearch[i]] === true) {
            continue;
        }

        // Get the Research object
        const research = ResearchMap[allResearch[i]];

        // Get the DOM Element to add a click listener to it
        const sanitizedName = allResearch[i].replace(/\s/g, '');
        const div = document.getElementById(sanitizedName + "-corp-research-click-listener");
        if (div == null) {
            console.warn(`Could not find Research Tree div for ${sanitizedName}`);
            continue;
        }

        div.addEventListener("click", () => {
            if (this.sciResearch.qty >= research.cost) {
                this.sciResearch.qty -= research.cost;

                // Get the Node from the Research Tree and set its 'researched' property
                researchTree.research(allResearch[i]);
                this.researched[allResearch[i]] = true;

                const researchBox = this.createResearchBox();
                dialogBoxCreate(`Researched ${allResearch[i]}. It may take a market cycle ` +
                                `(~${SecsPerMarketCycle} seconds) before the effects of ` +
                                `the Research apply.`);

                return researchBox;
            } else {
                dialogBoxCreate(`You do not have enough Scientific Research for ${research.name}`);
            }
        });
    }


    const boxContent = document.getElementById(`${boxId}-content`);
    if (boxContent != null) {
        // Add information about multipliers from research at the bottom of the popup
        appendLineBreaks(boxContent, 2);
        boxContent.appendChild(createElement("pre", {
            display: "block",
            innerText:  `Multipliers from research:\n` +
                        ` * Advertising Multiplier: x${researchTree.getAdvertisingMultiplier()}\n` +
                        ` * Employee Charisma Multiplier: x${researchTree.getEmployeeChaMultiplier()}\n` +
                        ` * Employee Creativity Multiplier: x${researchTree.getEmployeeCreMultiplier()}\n` +
                        ` * Employee Efficiency Multiplier: x${researchTree.getEmployeeEffMultiplier()}\n` +
                        ` * Employee Intelligence Multiplier: x${researchTree.getEmployeeIntMultiplier()}\n` +
                        ` * Production Multiplier: x${researchTree.getProductionMultiplier()}\n` +
                        ` * Sales Multiplier: x${researchTree.getSalesMultiplier()}\n` +
                        ` * Scientific Research Multiplier: x${researchTree.getScientificResearchMultiplier()}\n` +
                        ` * Storage Multiplier: x${researchTree.getStorageMultiplier()}`,
        }));

        // Close button
        boxContent.appendChild(createPopupCloseButton(researchTreeBox, {
            class: "std-button",
            display: "block",
            innerText: "Close",
        }));
    }

    researchTreeBoxOpened = true;
}

Industry.prototype.toJSON = function() {
    return Generic_toJSON("Industry", this);
}

Industry.fromJSON = function(value) {
    return Generic_fromJSON(Industry, value.data);
}

Reviver.constructors.Industry = Industry;

function Employee(params={}) {
    if (!(this instanceof Employee)) {
        return new Employee(params);
    }
    this.name   = params.name           ? params.name           : "Bobby";

    //Morale, happiness, and energy are 0-100
    this.mor    = params.morale         ? params.morale         : getRandomInt(50, 100);
    this.hap    = params.happiness      ? params.happiness      : getRandomInt(50, 100);
    this.ene    = params.energy         ? params.energy         : getRandomInt(50, 100);

    this.int    = params.intelligence   ? params.intelligence   : getRandomInt(10, 50);
    this.cha    = params.charisma       ? params.charisma       : getRandomInt(10, 50);
    this.exp    = params.experience     ? params.experience     : getRandomInt(10, 50);
    this.cre    = params.creativity     ? params.creativity     : getRandomInt(10, 50);
    this.eff    = params.efficiency     ? params.efficiency     : getRandomInt(10, 50);
    this.sal    = params.salary         ? params.salary         : getRandomInt(0.1, 5);
    this.pro    = 0; //Productivity, This is calculated

    this.cyclesUntilRaise = CyclesPerEmployeeRaise;

    this.loc    = params.loc            ? params.loc : "";
    this.pos    = EmployeePositions.Unassigned;
}

//Returns the amount the employee needs to be paid
Employee.prototype.process = function(marketCycles=1, office) {
    var gain = 0.003 * marketCycles,
        det = gain * Math.random();
    this.exp += gain;

    // Employee salaries slowly go up over time
    this.cyclesUntilRaise -= marketCycles;
    if (this.cyclesUntilRaise <= 0) {
        this.salary += EmployeeRaiseAmount;
        this.cyclesUntilRaise += CyclesPerEmployeeRaise;
    }

    //Training
    var trainingEff = gain * Math.random();
    if (this.pos === EmployeePositions.Training) {
        //To increase creativity and intelligence special upgrades are needed
        this.cha += trainingEff;
        this.exp += trainingEff;
        this.eff += trainingEff;
    }

    this.ene -= det;
    this.hap -= det;

    if (this.ene < office.minEne) {this.ene = office.minEne;}
    if (this.hap < office.minHap) {this.hap = office.minHap;}
    var salary = this.sal * marketCycles * SecsPerMarketCycle;
    return salary;
}

Employee.prototype.calculateProductivity = function(corporation, industry) {
    var effCre = this.cre * corporation.getEmployeeCreMultiplier() * industry.getEmployeeCreMultiplier(),
        effCha = this.cha * corporation.getEmployeeChaMultiplier() * industry.getEmployeeChaMultiplier(),
        effInt = this.int * corporation.getEmployeeIntMultiplier() * industry.getEmployeeIntMultiplier(),
        effEff = this.eff * corporation.getEmployeeEffMultiplier() * industry.getEmployeeEffMultiplier();
    const prodBase = this.mor * this.hap * this.ene * 1e-6;
    let prodMult;
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
            console.error(`Invalid employee position: ${this.pos}`);
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
Employee.prototype.createUI = function(panel, corporation, industry) {
    var effCre = this.cre * corporation.getEmployeeCreMultiplier() * industry.getEmployeeCreMultiplier(),
        effCha = this.cha * corporation.getEmployeeChaMultiplier() * industry.getEmployeeChaMultiplier(),
        effInt = this.int * corporation.getEmployeeIntMultiplier() * industry.getEmployeeIntMultiplier(),
        effEff = this.eff * corporation.getEmployeeEffMultiplier() * industry.getEmployeeEffMultiplier();
    panel.style.color = "white";
    panel.appendChild(createElement("p", {
        id:"cmpy-mgmt-employee-" + this.name + "-panel-text",
        innerHTML:"Morale: " + formatNumber(this.mor, 3) + "<br>" +
                  "Happiness: " + formatNumber(this.hap, 3) + "<br>" +
                  "Energy: " + formatNumber(this.ene, 3) + "<br>" +
                  "Intelligence: " + formatNumber(effInt, 3) + "<br>" +
                  "Charisma: " + formatNumber(effCha, 3) + "<br>" +
                  "Experience: " + formatNumber(this.exp, 3) + "<br>" +
                  "Creativity: " + formatNumber(effCre, 3) + "<br>" +
                  "Efficiency: " + formatNumber(effEff, 3) + "<br>" +
                  "Salary: " + numeralWrapper.format(this.sal, "$0.000a") + "/ s<br>",
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

    selector.addEventListener("change", () => {
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
    Extravagant: "Extravagant",
}

function OfficeSpace(params={}) {
    this.loc    = params.loc        ? params.loc        : "";
    this.cost   = params.cost       ? params.cost       : 1;
    this.size   = params.size       ? params.size       : 1;
    this.comf   = params.comfort    ? params.comfort    : 1;
    this.beau   = params.beauty      ? params.beauty     : 1;
    this.tier   = OfficeSpaceTiers.Basic;

    // Min/max energy of employees
    this.minEne     = 0;
    this.maxEne     = 100;

    // Min/max Happiness of office
    this.minHap     = 0;
    this.maxHap     = 100;

    // Maximum Morale of office
    this.maxMor     = 100;

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

OfficeSpace.prototype.atCapacity = function() {
    return (this.employees.length) >= this.size;
}

OfficeSpace.prototype.process = function(marketCycles=1, parentRefs) {
    var industry = parentRefs.industry;

    // HRBuddy AutoRecruitment and training
    if (industry.hasResearch("HRBuddy-Recruitment") && !this.atCapacity()) {
        const emp = this.hireRandomEmployee();
        if (industry.hasResearch("HRBuddy-Training")) {
            emp.pos = EmployeePositions.Training;
        }
    }

    // Process Office properties
    this.maxEne = 100;
    this.maxHap = 100;
    this.maxMor = 100;
    if (industry.hasResearch("Go-Juice")) {
        this.maxEne += 10;
    }
    if (industry.hasResearch("JoyWire")) {
        this.maxHap += 10;
    }
    if (industry.hasResearch("Sti.mu")) {
        this.maxMor += 10;
    }

    // Calculate changes in Morale/Happiness/Energy for Employees
    var perfMult=1; //Multiplier for employee morale/happiness/energy based on company performance
    if (industry.funds < 0 && industry.lastCycleRevenue < 0) {
        perfMult = Math.pow(0.99, marketCycles);
    } else if (industry.funds > 0 && industry.lastCycleRevenue > 0) {
        perfMult = Math.pow(1.01, marketCycles);
    }

    const hasAutobrew = industry.hasResearch("AutoBrew");
    const hasAutoparty = industry.hasResearch("AutoPartyManager");

    var salaryPaid = 0;
    for (let i = 0; i < this.employees.length; ++i) {
        const emp = this.employees[i];
        if (hasAutoparty) {
            emp.mor = this.maxMor;
            emp.hap = this.maxHap;
        } else {
            emp.mor *= perfMult;
            emp.hap *= perfMult;
            emp.mor = Math.min(emp.mor, this.maxMor);
            emp.hap = Math.min(emp.hap, this.maxHap);
        }

        if (hasAutobrew) {
            emp.ene = this.maxEne;
        } else {
            emp.ene *= perfMult;
            emp.ene = Math.min(emp.ene, this.maxEne);
        }

        const salary = emp.process(marketCycles, this);
        salaryPaid += salary;
    }

    this.calculateEmployeeProductivity(parentRefs);
    return salaryPaid;
}

OfficeSpace.prototype.calculateEmployeeProductivity = function(parentRefs) {
    var company = parentRefs.corporation, industry = parentRefs.industry;

    //Reset
    for (const name in this.employeeProd) {
        this.employeeProd[name] = 0;
    }

    var total = 0;
    for (let i = 0; i < this.employees.length; ++i) {
        const employee = this.employees[i];
        const prod = employee.calculateProductivity(company, industry);
        this.employeeProd[employee.pos] += prod;
        total += prod;
    }
    this.employeeProd["total"] = total;
}

//Takes care of UI as well
OfficeSpace.prototype.findEmployees = function(parentRefs) {
    if (this.atCapacity()) { return; }
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
        sal = EmployeeSalaryMultiplier * (int + cha + exp + cre + eff);

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
                        "Salary: " + numeralWrapper.format(employee.sal, '$0.000a') + " \ s<br>",
            clickListener:() => {
                office.hireEmployee(employee, parentRefs);
                removeElementById("cmpy-mgmt-hire-employee-popup");
                return false;
            },
        });
        return div;
    };

    var cancelBtn = createElement("a", {
        class:"a-link-button",
        innerText:"Cancel",
        float:"right",
        clickListener:() => {
            removeElementById("cmpy-mgmt-hire-employee-popup");
            return false;
        },
    });

    var elems = [text,
                 createEmpDiv(emp1, this),
                 createEmpDiv(emp2, this),
                 createEmpDiv(emp3, this),
                 cancelBtn];

    createPopup("cmpy-mgmt-hire-employee-popup", elems);
}

OfficeSpace.prototype.hireEmployee = function(employee, parentRefs) {
    var company = parentRefs.corporation;
    var yesBtn = yesNoTxtInpBoxGetYesButton(),
        noBtn = yesNoTxtInpBoxGetNoButton();
    yesBtn.innerHTML = "Hire";
    noBtn.innerHTML = "Cancel";
    yesBtn.addEventListener("click", () => {
        var name = yesNoTxtInpBoxGetInput();
        for (var i = 0; i < this.employees.length; ++i) {
            if (this.employees[i].name === name) {
                dialogBoxCreate("You already have an employee with this nickname! Please give every employee a unique nickname.");
                return false;
            }
        }
        employee.name = name;
        this.employees.push(employee);
        company.rerender();
        return yesNoTxtInpBoxClose();
    });
    noBtn.addEventListener("click", () => {
        return yesNoTxtInpBoxClose();
    });
    yesNoTxtInpBoxCreate("Give your employee a nickname!");
}

OfficeSpace.prototype.hireRandomEmployee = function() {
    if (this.atCapacity()) { return; }
    if (document.getElementById("cmpy-mgmt-hire-employee-popup") != null) {return;}

    //Generate three random employees (meh, decent, amazing)
    var mult = getRandomInt(76, 100)/100;
    var int = getRandomInt(50, 100),
        cha = getRandomInt(50, 100),
        exp = getRandomInt(50, 100),
        cre = getRandomInt(50, 100),
        eff = getRandomInt(50, 100),
        sal = EmployeeSalaryMultiplier * (int + cha + exp + cre + eff);

    var emp = new Employee({
        intelligence: int * mult,
        charisma: cha * mult,
        experience: exp * mult,
        creativity: cre * mult,
        efficiency: eff * mult,
        salary: sal * mult,
    });

    var name = generateRandomString(7);

    for (let i = 0; i < this.employees.length; ++i) {
        if (this.employees[i].name === name) {
            return this.hireRandomEmployee();
        }
    }
    emp.name = name;
    this.employees.push(emp);

    return emp;
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
    this.totalShares = INITIALSHARES; // Total existing shares
    this.numShares  = INITIALSHARES; // Total shares owned by player
    this.shareSalesUntilPriceUpdate = SHARESPERPRICEUPDATE;
    this.shareSaleCooldown = 0; // Game cycles until player can sell shares again
    this.issueNewSharesCooldown = 0; // Game cycles until player can issue shares again
    this.dividendPercentage = 0;
    this.dividendTaxPercentage = 50;
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

Corporation.prototype.addFunds = function(amt) {
    if(!isFinite(amt))
        console.error('Trying to add invalid amount of funds. Report to a developper.');
    this.funds = this.funds.plus(amt);
}

Corporation.prototype.getState = function() {
    return this.state.getState();
}

Corporation.prototype.storeCycles = function(numCycles=1) {
    this.storedCycles += numCycles;
}

Corporation.prototype.process = function() {
    if (this.storedCycles >= CyclesPerIndustryStateCycle) {
        const state = this.getState();
        const marketCycles = 1;
        const gameCycles = (marketCycles * CyclesPerIndustryStateCycle);
        this.storedCycles -= gameCycles;

        this.divisions.forEach((ind) => {
            ind.process(marketCycles, state, this);
        });

        // Process cooldowns
        if (this.shareSaleCooldown > 0) {
            this.shareSaleCooldown -= gameCycles;
        }
        if (this.issueNewSharesCooldown > 0) {
            this.issueNewSharesCooldown -= gameCycles;
        }

        //At the start of a new cycle, calculate profits from previous cycle
        if (state === "START") {
            this.revenue = new Decimal(0);
            this.expenses = new Decimal(0);
            this.divisions.forEach((ind) => {
                if (ind.lastCycleRevenue === -Infinity || ind.lastCycleRevenue === Infinity) { return; }
                if (ind.lastCycleExpenses === -Infinity || ind.lastCycleExpenses === Infinity) { return; }
                this.revenue = this.revenue.plus(ind.lastCycleRevenue);
                this.expenses = this.expenses.plus(ind.lastCycleExpenses);
            });
            var profit = this.revenue.minus(this.expenses);
            const cycleProfit = profit.times(marketCycles * SecsPerMarketCycle);
            if (isNaN(this.funds) || this.funds === Infinity || this.funds === -Infinity) {
                dialogBoxCreate("There was an error calculating your Corporations funds and they got reset to 0. " +
                                "This is a bug. Please report to game developer.<br><br>" +
                                "(Your funds have been set to $150b for the inconvenience)");
                this.funds = new Decimal(150e9);
            }

            // Process dividends
            if (this.dividendPercentage > 0 && cycleProfit > 0) {
                // Validate input again, just to be safe
                if (isNaN(this.dividendPercentage) || this.dividendPercentage < 0 || this.dividendPercentage > DividendMaxPercentage) {
                    console.error(`Invalid Corporation dividend percentage: ${this.dividendPercentage}`);
                } else {
                    const totalDividends = (this.dividendPercentage / 100) * cycleProfit;
                    const retainedEarnings = cycleProfit - totalDividends;
                    const dividendsPerShare = totalDividends / this.totalShares;
                    const profit = this.numShares * dividendsPerShare * (1 - (this.dividendTaxPercentage / 100));
                    Player.gainMoney(profit);
                    Player.recordMoneySource(profit, "corporation");
                    this.addFunds(retainedEarnings);
                }
            } else {
                this.addFunds(cycleProfit);
            }

            this.updateSharePrice();
        }

        this.state.nextState();

        if (routing.isOn(Page.Corporation)) { this.rerender(); }
    }
}

Corporation.prototype.determineValuation = function() {
    var val, profit = (this.revenue.minus(this.expenses)).toNumber();
    if (this.public) {
        // Account for dividends
        if (this.dividendPercentage > 0) {
            profit *= ((100 - this.dividendPercentage) / 100);
        }

        val = this.funds.toNumber() + (profit * 85e3);
        val *= (Math.pow(1.1, this.divisions.length));
        val = Math.max(val, 0);
    } else {
        val = 10e9 + Math.max(this.funds.toNumber(), 0) / 3; //Base valuation
        if (profit > 0) {
            val += (profit * 315e3);
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
    let roundMultiplier = 4;
    switch (this.fundingRound) {
        case 0: //Seed
            percShares = 0.10;
            roundMultiplier = 4;
            break;
        case 1: //Series A
            percShares = 0.35;
            roundMultiplier = 3;
            break;
        case 2: //Series B
            percShares = 0.25;
            roundMultiplier = 3;
            break;
        case 3: //Series C
            percShares = 0.20;
            roundMultiplier = 2.5;
            break;
        case 4:
            return;
    }
    var funding = val * percShares * roundMultiplier,
        investShares = Math.floor(INITIALSHARES * percShares),
        yesBtn = yesNoBoxGetYesButton(),
        noBtn = yesNoBoxGetNoButton();
    yesBtn.innerHTML = "Accept";
    noBtn.innerHML = "Reject";
    yesBtn.addEventListener("click", () => {
        ++this.fundingRound;
        this.addFunds(funding);
        this.numShares -= investShares;
        this.rerender();
        return yesNoBoxClose();
    });
    noBtn.addEventListener("click", () => {
        return yesNoBoxClose();
    });
    yesNoBoxCreate("An investment firm has offered you " + numeralWrapper.format(funding, '$0.000a') +
                   " in funding in exchange for a " + numeralWrapper.format(percShares*100, "0.000a") +
                   "% stake in the company (" + numeralWrapper.format(investShares, '0.000a') + " shares).<br><br>" +
                   "Do you accept or reject this offer?<br><br>" +
                   "Hint: Investment firms will offer more money if your corporation is turning a profit");
}

Corporation.prototype.goPublic = function() {
    var goPublicPopupId = "cmpy-mgmt-go-public-popup";
    var initialSharePrice = this.determineValuation() / (this.totalShares);
    var txt = createElement("p", {
        innerHTML: "Enter the number of shares you would like to issue " +
                   "for your IPO. These shares will be publicly sold " +
                   "and you will no longer own them. Your Corporation will receive " +
                   numeralWrapper.format(initialSharePrice, '$0.000a') + " per share " +
                   "(the IPO money will be deposited directly into your Corporation's funds).<br><br>" +
                   "You have a total of " + numeralWrapper.format(this.numShares, "0.000a") + " of shares that you can issue.",
    });
    var yesBtn;
    var input = createElement("input", {
        type:"number",
        placeholder: "Shares to issue",
        onkeyup:(e) => {
            e.preventDefault();
            if (e.keyCode === KEY.ENTER) {yesBtn.click();}
        },
    });
    var br = createElement("br", {});
    yesBtn = createElement("a", {
        class:"a-link-button",
        innerText:"Go Public",
        clickListener:() => {
            var numShares = Math.round(input.value);
            var initialSharePrice = this.determineValuation() / (this.totalShares);
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
            this.addFunds(numShares * initialSharePrice);
            this.rerender();
            removeElementById(goPublicPopupId);
            dialogBoxCreate(`You took your ${this.name} public and earned ` +
                            `${numeralWrapper.formatMoney(numShares * initialSharePrice)} in your IPO`);
            return false;
        },
    });
    var noBtn = createElement("a", {
        class:"a-link-button",
        innerText:"Cancel",
        clickListener:() => {
            removeElementById(goPublicPopupId);
            return false;
        },
    });
    createPopup(goPublicPopupId, [txt, br, input, yesBtn, noBtn]);
}

Corporation.prototype.getTargetSharePrice = function() {
    // Note: totalShares - numShares is not the same as issuedShares because
    // issuedShares does not account for private investors
    return this.determineValuation() / (2 * (this.totalShares - this.numShares) + 1);
}

Corporation.prototype.updateSharePrice = function() {
    const targetPrice = this.getTargetSharePrice();
    if (this.sharePrice <= targetPrice) {
        this.sharePrice *= (1 + (Math.random() * 0.01));
    } else {
        this.sharePrice *= (1 - (Math.random() * 0.01));
    }
    if (this.sharePrice <= 0.01) {this.sharePrice = 0.01;}
}

Corporation.prototype.immediatelyUpdateSharePrice = function() {
    this.sharePrice = this.getTargetSharePrice();
}

// Calculates how much money will be made and what the resulting stock price
// will be when the player sells his/her shares
// @return - [Player profit, final stock price, end shareSalesUntilPriceUpdate property]
Corporation.prototype.calculateShareSale = function(numShares) {
    let sharesTracker = numShares;
    let sharesUntilUpdate = this.shareSalesUntilPriceUpdate;
    let sharePrice = this.sharePrice;
    let sharesSold = 0;
    let profit = 0;

    const maxIterations = Math.ceil(numShares / SHARESPERPRICEUPDATE);
    if (isNaN(maxIterations) || maxIterations > 10e6) {
        console.error(`Something went wrong or unexpected when calculating share sale. Maxiterations calculated to be ${maxIterations}`);
        return;
    }

    for (let i = 0; i < maxIterations; ++i) {
        if (sharesTracker < sharesUntilUpdate) {
            profit += (sharePrice * sharesTracker);
            sharesUntilUpdate -= sharesTracker;
            break;
        } else {
            profit += (sharePrice * sharesUntilUpdate);
            sharesUntilUpdate = SHARESPERPRICEUPDATE;
            sharesTracker -= sharesUntilUpdate;
            sharesSold += sharesUntilUpdate;

            // Calculate what new share price would be
            sharePrice = this.determineValuation() / (2 * (this.totalShares + sharesSold - this.numShares));
        }
    }

    return [profit, sharePrice, sharesUntilUpdate];
}

Corporation.prototype.convertCooldownToString = function(cd) {
    // The cooldown value is based on game cycles. Convert to a simple string
    const seconds = cd / 5;

    const SecondsPerMinute = 60;
    const SecondsPerHour = 3600;

    if (seconds > SecondsPerHour) {
        return `${Math.floor(seconds / SecondsPerHour)} hour(s)`;
    } else if (seconds > SecondsPerMinute) {
        return `${Math.floor(seconds / SecondsPerMinute)} minute(s)`;
    } else {
        return `${Math.floor(seconds)} second(s)`;
    }
}

//One time upgrades that unlock new features
Corporation.prototype.unlock = function(upgrade) {
    const upgN = upgrade[0], price = upgrade[1];
    while (this.unlockUpgrades.length <= upgN) {
        this.unlockUpgrades.push(0);
    }
    if (this.funds.lt(price)) {
        dialogBoxCreate("You don't have enough funds to unlock this!");
        return;
    }
    this.unlockUpgrades[upgN] = 1;
    this.funds = this.funds.minus(price);

    // Apply effects for one-time upgrades
    if (upgN === 5) {
        this.dividendTaxPercentage -= 5;
    } else if (upgN === 6) {
        this.dividendTaxPercentage -= 10;
    }
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
                    industry.warehouses[city].updateSize(this, industry);
                }
            }
        }
    }
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

// Adds the Corporation Handbook (Starter Guide) to the player's home computer.
// This is a lit file that gives introductory info to the player
// This occurs when the player clicks the "Getting Started Guide" button on the overview panel
Corporation.prototype.getStarterGuide = function() {
    // Check if player already has Corporation Handbook
    let homeComp = Player.getHomeComputer(),
        hasHandbook = false,
        handbookFn = LiteratureNames.CorporationManagementHandbook;
    for (let i = 0; i < homeComp.messages.length; ++i) {
        if (isString(homeComp.messages[i]) && homeComp.messages[i] === handbookFn) {
            hasHandbook = true;
            break;
        }
    }

    if (!hasHandbook) { homeComp.messages.push(handbookFn); }
    showLiterature(handbookFn);
    return false;
}

let corpRouting;
let eventHandler;
let companyManagementDiv;
Corporation.prototype.createUI = function() {
    companyManagementDiv = createElement("div", {
        id:"cmpy-mgmt-container",
        position:"fixed",
        class:"generic-menupage-container",
    });
    document.getElementById("entire-game-container").appendChild(companyManagementDiv);

    corpRouting = new CorporationRouting(this);
    eventHandler = new CorporationEventHandler(this, corpRouting);

    this.rerender();
}

Corporation.prototype.rerender = function() {
    if (companyManagementDiv == null || corpRouting == null || eventHandler == null) {
        console.warn(`Corporation.rerender() called when companyManagementDiv, corpRouting, or eventHandler is null`);
        return;
    }
    if (!routing.isOn(Page.Corporation)) { return; }

    ReactDOM.render(<CorporationRoot
                        corp={this}
                        routing={corpRouting}
                        eventHandler={eventHandler}
                    />, companyManagementDiv);
}

Corporation.prototype.clearUI = function() {
    if (companyManagementDiv instanceof HTMLElement) {
        ReactDOM.unmountComponentAtNode(companyManagementDiv);
        removeElementById(companyManagementDiv.id);
    }

    companyManagementDiv = null;
    document.getElementById("character-overview-wrapper").style.visibility = "visible";
}

Corporation.prototype.toJSON = function() {
    return Generic_toJSON("Corporation", this);
}

Corporation.fromJSON = function(value) {
    return Generic_fromJSON(Corporation, value.data);
}

Reviver.constructors.Corporation = Corporation;

export {Corporation, Industry, OfficeSpace, Warehouse};
