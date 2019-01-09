import { AllCorporationStates,
         CorporationState }                             from "./CorporationState";
import { CorporationUnlockUpgrades }                    from "./data/CorporationUnlockUpgrades";
import { CorporationUpgrades }                          from "./data/CorporationUpgrades";
import { EmployeePositions }                            from "./EmployeePositions";
import { Industries,
         IndustryStartingCosts,
         IndustryDescriptions,
         IndustryResearchTrees }                        from "./IndustryData";
import { IndustryUpgrades }                             from "./IndustryUpgrades";
import { Material }                                     from "./Material";
import { MaterialSizes }                                from "./MaterialSizes";
import { Product }                                      from "./Product";
import { ResearchMap }                                  from "./ResearchMap";

import { BitNodeMultipliers }                           from "../BitNodeMultipliers";
import { CONSTANTS }                                    from "../Constants";
import { Factions }                                     from "../Faction/Factions";
import { showLiterature }                               from "../Literature";
import { Locations }                                    from "../Locations";
import { Player }                                       from "../Player";

import { numeralWrapper }                               from "../ui/numeralFormat";
import { Page, routing }                                from "../ui/navigationTracking";

import { dialogBoxCreate }                              from "../../utils/DialogBox";
import { clearSelector }                                from "../../utils/uiHelpers/clearSelector";
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
import { removeChildrenFromElement }                    from "../../utils/uiHelpers/removeChildrenFromElement";
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
         yesNoTxtInpBoxClose,
         yesNoBoxOpen }                                 from "../../utils/YesNoBox";

import Decimal                                          from "decimal.js";

/* Constants */
export const INITIALSHARES                  = 1e9; //Total number of shares you have at your company
export const SHARESPERPRICEUPDATE           = 1e6; //When selling large number of shares, price is dynamically updated for every batch of this amount
export const IssueNewSharesCooldown         = 216e3; // 12 Hour in terms of game cycles
export const SellSharesCooldown             = 18e3; // 1 Hour in terms of game cycles

export const CyclesPerMarketCycle           = 75;
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

export const CyclesPerEmployeeRaise         = 400;  // All employees get a raise every X market cycles
export const EmployeeRaiseAmount            = 50;   // Employee salary increases by this (additive)

// Delete Research Popup Box when clicking outside of it
$(document).mousedown(function(event) {
    const boxId = "corporation-research-popup-box";
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
            this.reFac  = 0.1;
            this.aiFac  = 0.15;
            this.robFac = 0.05;
            this.reqMats = {
                "Hardware":     0.5,
                "Energy":       1,
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
                "Hardware": 4
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
        case Industries.Healthcare:
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
Industry.prototype.calculateProductionFactors = function() {
    var multSum = 0;
    for (var i = 0; i < Cities.length; ++i) {
        var city = Cities[i];
        var warehouse = this.warehouses[city];
        if (!(warehouse instanceof Warehouse)) {
            continue;
        }

        var materials = warehouse.materials,
            office = this.offices[city];

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
    var revenue = 0, expenses = 0, industry = this;
    this.calculateProductionFactors();

    //At the start of the export state, set the imports of everything to 0
    if (this.state === "EXPORT") {
        for (var i = 0; i < Cities.length; ++i) {
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

    for (var i = 0; i < Cities.length; ++i) {
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
                })(matName, industry);
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

                if (prod < 0) {prod = 0;}

                //Keep track of production for smart supply (/s)
                warehouse.smartSupplyStore += (prod / (SecsPerMarketCycle * marketCycles));

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
                    let markup = 1, markupLimit = mat.getMarkupLimit();
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
                    //var businessFactor = 1 + (office.employeeProd[EmployeePositions.Business] / office.employeeProd["total"]);
                    var businessFactor = this.getBusinessFactor(office);        //Business employee productivity
                    var advertisingFactor = this.getAdvertisingFactors()[0];    //Awareness + popularity
                    var marketFactor = this.getMarketFactor(mat);               //Competition + demand
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
                        console.log("sellAmt calculated to be negative");
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
                                        console.log("ERROR: Invalid export! " + expIndustry.name + " "  + exp.city);
                                        break;
                                    }

                                    //Make sure theres enough space in warehouse
                                    if (expWarehouse.sizeUsed >= expWarehouse.size) {
                                        return; //Warehouse at capacity
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
                console.log("ERROR: Invalid state: " + this.state);
                break;
            } //End switch(this.state)
            this.updateWarehouseSizeUsed(warehouse);

        } // End warehouse

        //Produce Scientific Research based on R&D employees
        //Scientific Research can be produced without a warehouse
        if (office instanceof OfficeSpace) {
            this.sciResearch.qty += (.005
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
                    prod.createProduct(marketCycles, ratio * Math.pow(total, 0.29));
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
            var maxProd = this.getOfficeProductivity(office, {forProduct:true})
                        * corporation.getProductionMultiplier()
                        * this.prodMult                     // Multiplier from materials
                        * this.getProductionMultiplier();   // Multiplier from research
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

            case "SALE":
            //Process sale of Products
            product.pCost = 0; //Estimated production cost
            for (var reqMatName in product.reqMats) {
                if (product.reqMats.hasOwnProperty(reqMatName)) {
                    product.pCost += (product.reqMats[reqMatName] * warehouse.materials[reqMatName].bCost);
                }
            }

            //Since its a product, its production cost is increased for labor
            product.pCost *= ProductProductionCostRatio;

            //Calculate Sale Cost (sCost), which could be dynamically evaluated
            var sCost;
            if (isString(product.sCost)) {
                sCost = product.sCost.replace(/MP/g, product.pCost + product.rat / product.mku);
                sCost = eval(sCost);
            } else {
                sCost = product.sCost;
            }

            var markup = 1, markupLimit = product.rat / product.mku;
            if (sCost > product.pCost) {
                if ((sCost - product.pCost) > markupLimit) {
                    markup = markupLimit / (sCost - product.pCost);
                }
            }
            var businessFactor = this.getBusinessFactor(office);        //Business employee productivity
            var advertisingFactor = this.getAdvertisingFactors()[0];    //Awareness + popularity
            var marketFactor = this.getMarketFactor(product);        //Competition + demand
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
            } else {
                //Backwards compatibility, -1 = 0
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
        return ratio * Math.pow(total, 0.22);
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
    return ratioMult * Math.pow(1 + office.employeeProd[EmployeePositions.Business], 0.15);
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
    return mat.dmd * (100 - mat.cmp)/100;
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
        console.log("Updating Corporation Research Tree Data");
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

    this.updateResearchTree();
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
    const treantTree = new Treant(markup);

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

                return this.createResearchBox();
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

    this.age    = params.age            ? params.age            : getRandomInt(20, 50);
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
    var gain = 0.001 * marketCycles,
        det = gain * Math.random();
    this.age += gain;
    this.exp += gain;
    if (this.age > 150) {
        this.int -= det;
        this.eff -= det;
        this.cha -= det;
    }

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

Employee.prototype.calculateProductivity = function(corporation, industry) {
    var effCre = this.cre * corporation.getEmployeeCreMultiplier() * industry.getEmployeeCreMultiplier(),
        effCha = this.cha * corporation.getEmployeeChaMultiplier() * industry.getEmployeeChaMultiplier(),
        effInt = this.int * corporation.getEmployeeIntMultiplier() * industry.getEmployeeIntMultiplier(),
        effEff = this.eff * corporation.getEmployeeEffMultiplier() * industry.getEmployeeEffMultiplier();
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
                  "Age: " + formatNumber(this.age, 3) + "<br>" +
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

Employee.prototype.updateUI = function(panel, corporation, industry) {
    var effCre = this.cre * corporation.getEmployeeCreMultiplier() * industry.getEmployeeCreMultiplier(),
        effCha = this.cha * corporation.getEmployeeChaMultiplier() * industry.getEmployeeChaMultiplier(),
        effInt = this.int * corporation.getEmployeeIntMultiplier() * industry.getEmployeeIntMultiplier(),
        effEff = this.eff * corporation.getEmployeeEffMultiplier() * industry.getEmployeeEffMultiplier();
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
                      "Salary: " + numeralWrapper.format(this.sal, "$0.000a") + "/ s<br>";
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

OfficeSpace.prototype.process = function(marketCycles=1, parentRefs) {
    var corporation = parentRefs.corporation, industry = parentRefs.industry;

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

    this.calculateEmployeeProductivity(marketCycles, parentRefs);
    return salaryPaid;
}

OfficeSpace.prototype.calculateEmployeeProductivity = function(marketCycles=1, parentRefs) {
    var company = parentRefs.corporation, industry = parentRefs.industry;

    //Reset
    for (var name in this.employeeProd) {
        if (this.employeeProd.hasOwnProperty(name)) {
            this.employeeProd[name] = 0;
        }
    }

    var total = 0;
    for (var i = 0; i < this.employees.length; ++i) {
        var employee = this.employees[i];
        var prod = employee.calculateProductivity(company, industry);
        this.employeeProd[employee.pos] += prod;
        total += prod;
    }
    this.employeeProd["total"] = total;
}

//Takes care of UI as well
OfficeSpace.prototype.findEmployees = function(parentRefs) {
    var company = parentRefs.corporation, division = parentRefs.industry;
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
                        "Salary: " + numeralWrapper.format(employee.sal, '$0.000a') + " \ s<br>",
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
    var company = parentRefs.corporation, division = parentRefs.industry;
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
    var company = parentRefs.corporation, division = parentRefs.industry;
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
    this.smartSupplyEnabled = false; //Whether or not smart supply is enabled
    this.breakdown = "";

    //Stores the amount of product to be produced. Used for Smart Supply unlock.
    //The production tracked by smart supply is always based on the previous cycle,
    //so it will always trail the "true" production by 1 cycle
    this.smartSupplyStore = 0;

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
    this.breakdown = "";
    for (var matName in this.materials) {
        if (this.materials.hasOwnProperty(matName)) {
            var mat = this.materials[matName];
            if (MaterialSizes.hasOwnProperty(matName)) {
                this.sizeUsed += (mat.qty * MaterialSizes[matName]);
                if (mat.qty > 0) {
                    this.breakdown += (matName + ": " + formatNumber(mat.qty * MaterialSizes[matName], 0) + "<br>");
                }
            }
        }
    }
    if (this.sizeUsed > this.size) {
        console.log("ERROR: Warehouse size used greater than capacity, something went wrong");
    }
}

Warehouse.prototype.updateSize = function(corporation, industry) {
    //Backwards compatibility
    if (this.level == null || this.level === 0) {
        this.level = Math.round(this.size / 100);
    }

    this.size = (this.level * 100)
              * corporation.getStorageMultiplier()
              * industry.getStorageMultiplier();
}

Warehouse.prototype.createUI = function(parentRefs) {
    if (parentRefs.company == null || parentRefs.industry == null) {
        console.log("ERROR: Warehouse.createUI called without parentRefs.company or parentRefs.industry");
        return;
    }
    var company = parentRefs.company, industry = parentRefs.industry;
    removeChildrenFromElement(industryWarehousePanel);
    industryWarehouseStorageText = createElement("p", {
        display:"inline-block", class:"tooltip",
        color: this.sizeUsed >= this.size ? "red" : "white",
    });
    industryWarehousePanel.appendChild(industryWarehouseStorageText);

    //Upgrade warehouse size button
    var upgradeCost = WarehouseUpgradeBaseCost * Math.pow(1.07, this.level+1);
    industryWarehouseUpgradeSizeButton = createElement("a", {
        innerText:"Upgrade Warehouse Size - " + numeralWrapper.format(upgradeCost, '$0.000a'),
        display:"inline-block",
        class: company.funds.lt(upgradeCost) ? "a-link-button-inactive" : "a-link-button",
        clickListener:()=>{
            //Backwards compatibility
            if (this.level == null || this.level === 0) {
                this.level = Math.round(this.size / 100);
            }

            ++this.level;
            this.updateSize(company, industry);
            company.funds = company.funds.minus(upgradeCost);
            this.createUI(parentRefs);
            return;
        }
    });
    industryWarehousePanel.appendChild(industryWarehouseUpgradeSizeButton);

    //Material requirement text
    var reqText = "This Industry uses [" + Object.keys(industry.reqMats).join(", ") +
                  "] in order to ";
    if (industry.prodMats.length > 0) {
        reqText += "produce [" + industry.prodMats.join(", ") + "] ";
        if (industry.makesProducts) {
            reqText += " and " + industry.getProductDescriptionText();
        }
    } else if (industry.makesProducts) {
        reqText += (industry.getProductDescriptionText() + ".");
    }

    //Material ratio text for tooltip
    var reqRatioText = ". The exact requirements for production are:<br>";
    for (var matName in industry.reqMats) {
        if (industry.reqMats.hasOwnProperty(matName)) {
            reqRatioText += ([" *", industry.reqMats[matName], matName].join(" ") + "<br>");
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

    reqText += reqRatioText;

    reqText += "<br><br>To get started with production, purchase your required " +
               "materials or import them from another of your company's divisions.<br><br>";

    industryWarehousePanel.appendChild(createElement("p", { innerHTML: reqText }));

    //Current state
    industryWarehouseStateText = createElement("p");
    industryWarehousePanel.appendChild(industryWarehouseStateText);

    //Smart Supply Enable/Disable
    if (company.unlockUpgrades[1]) {
        if (this.smartSupplyEnabled == null) {this.smartSupplyEnabled = false;}
        var smartSupplyCheckboxId = "cmpy-mgmt-smart-supply-checkbox";
        industryWarehousePanel.appendChild(createElement("label", {
            for:smartSupplyCheckboxId, innerText:"Enable Smart Supply",
            color:"white"
        }));
        industrySmartSupplyCheckbox = createElement("input", {
            type:"checkbox", id:smartSupplyCheckboxId, margin:"3px",
            changeListener:()=>{
                this.smartSupplyEnabled = industrySmartSupplyCheckbox.checked;
            }
        });
        industrySmartSupplyCheckbox.checked = this.smartSupplyEnabled;
        industryWarehousePanel.appendChild(industrySmartSupplyCheckbox);
    }

    //Materials
    industryWarehousePanel.appendChild(createElement("p", {
        innerHTML: "<br>Materials:<br>",
    }));
    industryWarehouseMaterials = createElement("ul");
    industryWarehousePanel.appendChild(industryWarehouseMaterials);

    //Products
    if (industry.makesProducts && Object.keys(industry.products).length > 0) {
        industryWarehousePanel.appendChild(createElement("p", {
            innerHTML: "<br>Products:<br>",
        }));
        industryWarehouseProducts = createElement("ul");
        industryWarehousePanel.appendChild(industryWarehouseProducts);
    }

    this.updateUI(parentRefs);
}

Warehouse.prototype.updateUI = function(parentRefs) {
    if (parentRefs.company == null || parentRefs.industry == null) {
        console.log("ERROR: Warehouse.updateUI called without parentRefs.company or parentRefs.industry");
        return;
    }
    var company = parentRefs.company, industry = parentRefs.industry;

    //Storage text
    var storageText = "Storage: " +
                      (this.sizedUsed >= this.size ? formatNumber(this.sizeUsed, 3) : formatNumber(this.sizeUsed, 3)) +
                      "/" + formatNumber(this.size, 3);
    if (this.breakdown != null && this.breakdown != "") {
        storageText += ("<span class='tooltiptext'>" +
                        this.breakdown + "</span>");
    }
    industryWarehouseStorageText.innerHTML = storageText;

    //Upgrade warehouse size button
    var upgradeCost = WarehouseUpgradeBaseCost * Math.pow(1.07, this.level+1);
    if (company.funds.lt(upgradeCost)) {
        industryWarehouseUpgradeSizeButton.className = "a-link-button-inactive";
    } else {
        industryWarehouseUpgradeSizeButton.className = "a-link-button";
    }

    //Current state
    var stateText = "Current state: ";
    switch(industry.state) {
        case "START":
            stateText += "Preparing...";
            break;
        case "PURCHASE":
            stateText += "Purchasing materials...";
            break;
        case "PRODUCTION":
            stateText += "Producing materials and/or products...";
            break;
        case "SALE":
            stateText += "Selling materials and/or products...";
            break;
        case "EXPORT":
            stateText += "Exporting materials and/or products...";
            break;
        default:
            console.log("ERROR: Invalid state: " + industry.state);
            break;
    }
    industryWarehouseStateText.innerText = stateText;

    //Materials
    removeChildrenFromElement(industryWarehouseMaterials);
    for (var matName in this.materials) {
        if (this.materials.hasOwnProperty(matName) && this.materials[matName] instanceof Material) {
            if (Object.keys(industry.reqMats).includes(matName) || industry.prodMats.includes(matName) ||
                matName === "Hardware" || matName === "Robots" || matName === "AICores" ||
                matName === "RealEstate") {
                industryWarehouseMaterials.appendChild(this.createMaterialUI(this.materials[matName], matName, parentRefs));
            }
        }
    }

    //Products
    removeChildrenFromElement(industryWarehouseProducts);
    if (industry.makesProducts && Object.keys(industry.products).length > 0) {
        for (var productName in industry.products) {
            if (industry.products.hasOwnProperty(productName) && industry.products[productName] instanceof Product) {
                industryWarehouseProducts.appendChild(this.createProductUI(industry.products[productName], parentRefs));
            }
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

    var totalGain = mat.buy + mat.prd + mat.imp - mat.sll - mat.totalExp;

    //If Market Research upgrades are unlocked, add competition and demand info
    var cmpAndDmdText = "";
    if (company.unlockUpgrades[2] === 1) {
        cmpAndDmdText += "<br>Demand: " + formatNumber(mat.dmd, 3);
    }
    if (company.unlockUpgrades[3] === 1) {
        cmpAndDmdText += "<br>Competition: " + formatNumber(mat.cmp, 3);
    }
    var innerTxt = "<p class='tooltip'>" + mat.name + ": " + formatNumber(mat.qty, 3) +
                   "(" + formatNumber(totalGain, 3) +  "/s)" +
                   "<span class='tooltiptext'>Buy: " + formatNumber(mat.buy, 3) +
                   "/s<br>Prod: " + formatNumber(mat.prd, 3) + "/s<br>Sell: " + formatNumber(mat.sll, 3) +
                   "/s<br>Export: " + formatNumber(mat.totalExp, 3) + "/s<br>Import: " +
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
                margin: "5px",
                placeholder: "Purchase amount",
                type: "number",
                value: mat.buy ? mat.buy : null,
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
                }
            });
            confirmBtn = createElement("button", {
                innerText:"Confirm", class:"std-button",
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
            var clearButton = createElement("button", {
                innerText:"Clear Purchase", class:"std-button",
                clickListener:()=>{
                    mat.buy = 0;
                    removeElementById(purchasePopupId);
                    this.createUI(parentRefs);
                    return false;
                }
            });
            const cancelBtn = createPopupCloseButton(purchasePopupId, {
                class: "std-button",
                innerText: "Cancel",
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
            var citySelector = createElement("select", {class: "dropdown"});
            var industrySelector = createElement("select", {
                class: "dropdown",
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
            });

            for (var i = 0; i < company.divisions.length; ++i) {
                industrySelector.add(createElement("option", {
                    text:company.divisions[i].name, value:company.divisions[i].name,
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
                class: "text-input",
                placeholder:"Export amount / s"
            });

            var exportBtn  = createElement("a", {
                class:"a-link-button", display:"inline-block", innerText:"Export",
                clickListener:()=>{
                    var industryName = industrySelector.options[industrySelector.selectedIndex].text,
                        cityName = citySelector.options[citySelector.selectedIndex].text,
                        amt = exportAmount.value;
                    //Sanitize amt
                    var sanitizedAmt = amt.replace(/\s+/g, '');
                    sanitizedAmt = sanitizedAmt.replace(/[^-()\d/*+.MAX]/g, '');
                    var temp = sanitizedAmt.replace(/MAX/g, 1);
                    try {
                        temp = eval(temp);
                    } catch(e) {
                        dialogBoxCreate("Invalid expression entered for export amount: " + e);
                        return false;
                    }

                    if (temp == null || isNaN(temp)) {
                        dialogBoxCreate("Invalid amount entered for export");
                        return;
                    }
                    var exportObj = {ind:industryName, city:cityName, amt:sanitizedAmt};
                    mat.exp.push(exportObj);
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
                           "When setting the sell amount, you can use the 'PROD' variable to designate a dynamically " +
                           "changing amount that depends on your production. For example, if you set the sell amount " +
                           "to 'PROD-5' then you will always sell 5 less of the material than you produce.<br><br>" +
                           "When setting the sell price, you can use the 'MP' variable to designate a dynamically " +
                           "changing price that depends on the market price. For example, if you set the sell price " +
                           "to 'MP+10' then it will always be sold at $10 above the market price.",
            });
            var br = createElement("br", {});
            var confirmBtn;
            var inputQty = createElement("input", {
                type: "text", marginTop: "4px",
                value: mat.sllman[1] ? mat.sllman[1] : null, placeholder: "Sell amount",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
                }
            });
            var inputPx = createElement("input", {
                type: "text", marginTop: "4px",
                value: mat.sCost ? mat.sCost : null, placeholder: "Sell price",
                onkeyup: (e) => {
                    e.preventDefault();
                    if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
                }
            });
            confirmBtn = createElement("button", {
                class: "std-button",
                innerText: "Confirm",
                clickListener: () => {
                    //Parse price
                    var cost = inputPx.value.replace(/\s+/g, '');
                    cost = cost.replace(/[^-()\d/*+.MP]/g, ''); //Sanitize cost
                    var temp = cost.replace(/MP/g, mat.bCost);
                    try {
                        temp = eval(temp);
                    } catch(e) {
                        dialogBoxCreate("Invalid value or expression for sell price field: " + e);
                        return false;
                    }

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
                    if (inputQty.value.includes("MAX") || inputQty.value.includes("PROD")) {
                        var qty = inputQty.value.replace(/\s+/g, '');
                        qty = qty.replace(/[^-()\d/*+.MAXPROD]/g, '');
                        var temp = qty.replace(/MAX/g, 1);
                        temp = temp.replace(/PROD/g, 1);
                        try {
                            temp = eval(temp);
                        } catch(e) {
                            dialogBoxCreate("Invalid value or expression for sell price field: " + e);
                            return false;
                        }

                        if (temp == null || isNaN(temp)) {
                            dialogBoxCreate("Invalid value or expression for sell price field");
                            return false;
                        }

                        mat.sllman[0] = true;
                        mat.sllman[1] = qty; //Use sanitized input
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
            const cancelBtn = createPopupCloseButton(sellPopupid, {
                class: "std-button",
                innerText: "Cancel",
            });

            createPopup(sellPopupid, [txt, br, inputQty, inputPx, confirmBtn, cancelBtn]);
            inputQty.focus();
        }
    }));

    // Button to use Market-TA research, if you have it
    if (industry.hasResearch("Market-TA.I")) {
        let marketTaClickListener = () => {
            const popupId = "cmpy-mgmt-marketta-popup";
            const markupLimit = mat.getMarkupLimit();
            const ta1 = createElement("p", {
                innerHTML: "<u><strong>Market-TA.I</strong></u><br>" +
                           "The maximum sale price you can mark this up to is "  +
                           numeralWrapper.format(mat.bCost + markupLimit, '$0.000a') +
                           ". This means that if you set the sale price higher than this, " +
                           "you will begin to experience a loss in number of sales",
            });
            const closeBtn = createPopupCloseButton(popupId, {
                class: "std-button",
                display: "block",
            });

            if (industry.hasResearch("Market-TA.II")) {
                let updateTa2Text;
                const ta2Text = createElement("p");
                const ta2Input = createElement("input", {
                    marginTop: "4px",
                    onkeyup: (e) => {
                        e.preventDefault();
                        updateTa2Text();
                    },
                    type: "number",
                    value: mat.bCost,
                });

                // Function that updates the text in ta2Text element
                updateTa2Text = function() {
                    const sCost = parseFloat(ta2Input.value);
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
                    ta2Text.innerHTML = `<br><u><strong>Market-TA.II</strong></u><br>` +
                                        `If you sell at ${numeralWrapper.format(sCost, "$0.0001")}, ` +
                                        `then you will sell ${formatNumber(markup, 5)}x as much compared ` +
                                        `to if you sold at market price.`;
                }
                updateTa2Text();
                createPopup(popupId, [ta1, ta2Text, ta2Input, closeBtn]);
            } else {
                // Market-TA.I only
                createPopup(popupId, [ta1, closeBtn]);
            }
        };

        buttonPanel.appendChild(createElement("a", {
            class: "a-link-button",
            clickListener:() => { marketTaClickListener(); },
            display: "inline-block",
            innerText: "Market-TA",

        }))
    }

    return div;
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
        return div;
    }

    //Completed products
    var cmpAndDmdText = "";
    if (company.unlockUpgrades[2] === 1) {
        cmpAndDmdText += "<br>Demand: " + formatNumber(product.dmd, 3);
    }
    if (company.unlockUpgrades[3] === 1) {
        cmpAndDmdText += "<br>Competition: " + formatNumber(product.cmp, 3);
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
                   "<p class='tooltip'>Est. Production Cost: " + numeralWrapper.format(product.pCost / ProductProductionCostRatio, "$0.000a") +
                   "<span class='tooltiptext'>An estimate of the material cost it takes to create this Product.</span></p><br>" +
                   "<p class='tooltip'>Est. Market Price: " + numeralWrapper.format(product.pCost + product.rat / product.mku, "$0.000a") +
                   "<span class='tooltiptext'>An estimate of how much consumers are willing to pay for this product. " +
                   "Setting the sale price above this may result in less sales. Setting the sale price below this may result " +
                   "in more sales.</span></p>"
    }));
    var buttonPanel = createElement("div", {
        display:"inline-block",
    });
    div.appendChild(buttonPanel);

    //Sell button
    var sellInnerTextString = (product.sllman[city][1] === -1 ? "Sell (" + formatNumber(product.data[city][2], 3) + "/MAX)" :
                              "Sell (" + formatNumber(product.data[city][2], 3) + "/" + formatNumber(product.sllman[city][1], 3) + ")");
    if (product.sCost) {
        if (isString(product.sCost)) {
            sellInnerTextString += (" @ " + product.sCost);
        } else {
            sellInnerTextString += (" @ " + numeralWrapper.format(product.sCost, "$0.000a"));
        }
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
                          "maximum possible amount of the material.<br><br>" +
                          "When setting the sell amount, you can use the 'PROD' variable to designate a " +
                          "dynamically changing amount that depends on your production. For example, " +
                          "if you set the sell amount to 'PROD-1' then you will always sell 1 less of  " +
                          "the material than you produce.<br><br>" +
                          "When setting the sell price, you can use the 'MP' variable to set a " +
                          "dynamically changing price that depends on the Product's estimated " +
                          "market price. For example, if you set it to 'MP*5' then it " +
                          "will always be sold at five times the estimated market price.",
            });
            var confirmBtn;
            var inputQty = createElement("input", {
                type:"text", value:product.sllman[city][1] ? product.sllman[city][1] : null, placeholder: "Sell amount",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
                }
            });
            var inputPx = createElement("input", {
                type:"text", value: product.sCost ? product.sCost : null, placeholder: "Sell price",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
                }
            });
            confirmBtn = createElement("a", {
                class:"a-link-button", innerText:"Confirm",
                clickListener:()=>{
                    //Parse price
                    if (inputPx.value.includes("MP")) {
                        //Dynamically evaluated quantity. First test to make sure its valid
                        //Sanitize input, then replace dynamic variables with arbitrary numbers
                        var price = inputPx.value.replace(/\s+/g, '');
                        price = price.replace(/[^-()\d/*+.MP]/g, '');
                        var temp = price.replace(/MP/g, 1);
                        try {
                            temp = eval(temp);
                        } catch(e) {
                            dialogBoxCreate("Invalid value or expression for sell quantity field: " + e);
                            return false;
                        }
                        if (temp == null || isNaN(temp)) {
                            dialogBoxCreate("Invalid value or expression for sell quantity field.");
                            return false;
                        }
                        product.sCost = price; //Use sanitized price
                    } else {
                        var cost = parseFloat(inputPx.value);
                        if (isNaN(cost)) {
                            dialogBoxCreate("Invalid value for sell price field");
                            return false;
                        }
                        product.sCost = cost;
                    }

                    //Parse quantity
                    if (inputQty.value.includes("MAX") || inputQty.value.includes("PROD")) {
                        //Dynamically evaluated quantity. First test to make sure its valid
                        var qty = inputQty.value.replace(/\s+/g, '');
                        qty = qty.replace(/[^-()\d/*+.MAXPROD]/g, '');
                        var temp = qty.replace(/MAX/g, 1);
                        temp = temp.replace(/PROD/g, 1);
                        try {
                            temp = eval(temp);
                        } catch(e) {
                            dialogBoxCreate("Invalid value or expression for sell price field: " + e);
                            return false;
                        }

                        if (temp == null || isNaN(temp)) {
                            dialogBoxCreate("Invalid value or expression for sell price field");
                            return false;
                        }
                        product.sllman[city][0] = true;
                        product.sllman[city][1] = qty; //Use sanitized input
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
                    if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
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
    return div;
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

Corporation.prototype.getState = function() {
    return this.state.getState();
}

Corporation.prototype.storeCycles = function(numCycles=1) {
    this.storedCycles += numCycles;
}

Corporation.prototype.process = function() {
    var corp = this;
    if (this.storedCycles >= CyclesPerIndustryStateCycle) {
        const state = this.getState();
        const marketCycles = 1;
        const gameCycles = (marketCycles * CyclesPerIndustryStateCycle);
        this.storedCycles -= gameCycles;

        this.divisions.forEach(function(ind) {
            ind.process(marketCycles, state, corp);
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
            if (isNaN(this.funds)) {
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
                    Player.gainMoney(this.numShares * dividendsPerShare * (this.dividendTaxPercentage / 100));
                    this.funds = this.funds.plus(retainedEarnings);
                }
            } else {
                this.funds = this.funds.plus(cycleProfit);
            }

            this.updateSharePrice();
        }

        this.state.nextState();

        if (routing.isOn(Page.Corporation)) {this.updateUIContent();}
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
            roundMultiplier = 5;
            break;
        case 1: //Series A
            percShares = 0.35;
            roundMultiplier = 4;
            break;
        case 2: //Series B
            percShares = 0.25;
            roundMultiplier = 4;
            break;
        case 3: //Series C
            percShares = 0.20;
            roundMultiplier = 3.5;
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
        onkeyup:(e)=>{
            e.preventDefault();
            if (e.keyCode === KEY.ENTER) {yesBtn.click();}
        }
    });
    var br = createElement("br", {});
    yesBtn = createElement("a", {
        class:"a-link-button",
        innerText:"Go Public",
        clickListener:()=>{
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
            this.funds = this.funds.plus(numShares * initialSharePrice);
            this.displayCorporationOverviewContent();
            removeElementById(goPublicPopupId);
            dialogBoxCreate(`You took your ${this.name} public and earned ` +
                            `${numeralWrapper.formatMoney(numShares * initialSharePrice)} in your IPO`);
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
    const CyclesPerSecond = 1000 / CONSTANTS.MilliPerCycle;
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

    sellSharesButton, sellSharesButtonTooltip,
    issueNewSharesButton, issueNewSharesButtonTooltip,

    //Industry Overview Panel
    industryOverviewPanel, industryOverviewText,

    //Industry Employee Panel
    industryEmployeePanel, industryEmployeeText, industryEmployeeHireButton, industryEmployeeAutohireButton,
        industryEmployeeManagementUI, industryEmployeeInfo, industryIndividualEmployeeInfo,
    industryOfficeUpgradeSizeButton,

    //Industry Warehouse Panel
    industryWarehousePanel, industrySmartSupplyCheckbox, industryWarehouseStorageText,
        industryWarehouseUpgradeSizeButton, industryWarehouseStateText,
        industryWarehouseMaterials, industryWarehouseProducts,

    // Research Tree
    researchTreeBoxOpened = false,
    researchTreeBox,

    // Tabs
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
            });
            var content = createElement("div", {class:"popup-box-content"});
            var txt = createElement("p", {
                innerHTML: "Create a new division to expand into a new industry:",
            });
            var selector = createElement("select", {
                class:"dropdown"
            });
            var industryDescription = createElement("p", {});
            var yesBtn;
            var nameInput = createElement("input", {
                type:"text",
                id:"cmpy-mgmt-expand-industry-name-input",
                class: "text-input",
                display:"block",
                maxLength: 30,
                pattern:"[a-zA-Z0-9-_]",
                onkeyup:(e)=>{
                    e.preventDefault();
                    if (e.keyCode === KEY.ENTER) {yesBtn.click();}
                }
            });
            var nameLabel = createElement("label", {
                for:"cmpy-mgmt-expand-industry-name-input",
                innerText:"Division name: "
            });
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
            });

            const noBtn = createPopupCloseButton(container, {innerText: "Cancel"});

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
            container.style.display = "flex";
            nameInput.focus();
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
            class:"a-link-button tooltip", innerText:"Sell Shares", display:"inline-block",
            clickListener: () => {
                var popupId = "cmpy-mgmt-sell-shares-popup";
                var currentStockPrice = this.sharePrice;
                var txt = createElement("p", {
                    innerHTML: "Enter the number of shares you would like to sell. The money from " +
                               "selling your shares will go directly to you (NOT your Corporation).<br><br>" +
                               "Selling your shares will cause your corporation's stock price to fall due to " +
                               "dilution. Furthermore, selling a large number of shares all at once will have an immediate effect " +
                               "in reducing your stock price.<br><br>" +
                               "The current price of your " +
                               "company's stock is " + numeralWrapper.format(currentStockPrice, "$0.000a"),
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
                            const stockSaleResults = this.calculateShareSale(numShares);
                            const profit = stockSaleResults[0];
                            const newSharePrice = stockSaleResults[1];
                            const newSharesUntilUpdate = stockSaleResults[2];
                            profitIndicator.innerText = "Sell " + numShares + " shares for a total of " +
                                                        numeralWrapper.format(profit, '$0.000a');
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
                            const stockSaleResults = this.calculateShareSale(shares);
                            const profit = stockSaleResults[0];
                            const newSharePrice = stockSaleResults[1];
                            const newSharesUntilUpdate = stockSaleResults[2];

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
                            this.sharePrice = newSharePrice;
                            this.shareSalesUntilPriceUpdate = newSharesUntilUpdate;
                            this.shareSaleCooldown = SellSharesCooldown;
                            Player.gainMoney(profit);
                            removeElementById(popupId);
                            dialogBoxCreate(`Sold ${numeralWrapper.formatMoney(shares, "0.000a")} shares for ` +
                                            `${numeralWrapper.formatMoney(profit, "$0.000a")}. ` +
                                            `The corporation's stock price fell to ${numeralWrapper.formatMoney(this.sharePrice)} ` +
                                            `as a result of dilution.`);
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

        sellSharesButtonTooltip = createElement("span", {
            class: "tooltiptext",
            innerText: "Sell your shares in the company. The money earned from selling your " +
                       "shares goes into your personal account, not the Corporation's. " +
                       "This is one of the only ways to profit from your business venture.",
        });
        sellShares.appendChild(sellSharesButtonTooltip);

        //Buyback shares button
        var buybackShares = createElement("a", {
            class:"a-link-button", innerText:"Buyback shares", display:"inline-block",
            tooltip:"Buy back shares you that previously issued or sold at market price.",
            clickListener:()=>{
                var popupId = "cmpy-mgmt-buyback-shares-popup";
                const currentStockPrice = this.sharePrice;
                const buybackPrice = currentStockPrice * 1.1;
                var txt = createElement("p", {
                    innerHTML: "Enter the number of outstanding shares you would like to buy back. " +
                               "These shares must be bought at a 10% premium. However, " +
                               "repurchasing shares from the market tends to lead to an increase in stock price.<br><bR>" +
                               "To purchase these shares, you must use your own money (NOT your Corporation's funds).<br><br>" +
                               "The current buyback price of your company's stock is " +
                               numeralWrapper.format(buybackPrice, "$0.000a") +
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
                            costIndicator.innerText = "Purchase " + numShares + " shares for a total of " +
                                                      numeralWrapper.format(numShares * buybackPrice, '$0.000a');
                        }
                    }
                });
                var confirmBtn = createElement("a", {
                    class:"a-link-button", innerText:"Buy shares", display:"inline-block",
                    clickListener:()=>{
                        var shares = Math.round(input.value);
                        const tempStockPrice = this.sharePrice;
                        const buybackPrice = tempStockPrice * 1.1;
                        if (isNaN(shares) || shares <= 0) {
                            dialogBoxCreate("ERROR: Invalid value for number of shares");
                        } else if (shares > this.issuedShares) {
                            dialogBoxCreate("ERROR: There are not this many oustanding shares to buy back");
                        } else if (shares * buybackPrice > Player.money) {
                            dialogBoxCreate("ERROR: You do not have enough money to purchase this many shares (you need " +
                                            numeralWrapper.format(shares * buybackPrice, "$0.000a") + ")");
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
                            Player.loseMoney(shares * buybackPrice);
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

        sellSharesButton = sellShares;

        // Issue new Shares
        appendLineBreaks(companyManagementPanel, 1);
        const issueNewShares = createElement("a", {
            class: "std-button tooltip",
            display: "inline-block",
            innerText: "Issue New Shares",
            clickListener: () => {
                const popupId = "cmpy-mgmt-issue-new-shares-popup";
                const maxNewSharesUnrounded = Math.round(this.totalShares * 0.2);
                const maxNewShares = maxNewSharesUnrounded - (maxNewSharesUnrounded % 1e6);

                const descText = createElement("p", {
                    innerHTML:  "You can issue new equity shares (i.e. stocks) in order to raise " +
                                "capital for your corporation.<br><br>" +
                                `&nbsp;* You can issue at most ${numeralWrapper.format(maxNewShares, "0.000a")} new shares<br>` +
                                `&nbsp;* New shares are sold at a 10% discount<br>` +
                                `&nbsp;* You can only issue new shares once every 12 hours<br>` +
                                `&nbsp;* Issuing new shares causes dilution, resulting in a decrease in stock price and lower dividends per share<br>` +
                                `&nbsp;* Number of new shares issued must be a multiple of 10 million<br><br>` +
                                `When you choose to issue new equity, private shareholders have first priority for up to 50% of the new shares. ` +
                                `If they choose to exercise this option, these newly issued shares become private, restricted shares, which means ` +
                                `you cannot buy them back.`,
                });

                let issueBtn, newSharesInput;
                const dynamicText = createElement("p", {
                    display: "block",
                });

                function updateDynamicText(corp) {
                    const newSharePrice = Math.round(corp.sharePrice * 0.9);
                    let newShares = parseInt(newSharesInput.value);
                    if (isNaN(newShares)) {
                        dynamicText.innerText = "Invalid input";
                        return;
                    }

                    // Round to nearest ten-millionth
                    newShares /= 10e6;
                    newShares = Math.round(newShares) * 10e6;

                    if (newShares < 10e6) {
                        dynamicText.innerText = "Must issue at least 10 million new shares";
                        return;
                    }

                    if (newShares > maxNewShares) {
                        dynamicText.innerText = "You cannot issue that many shares";
                        return;
                    }

                    dynamicText.innerText = `Issue ${numeralWrapper.format(newShares, "0.000a")} new shares ` +
                                            `for ${numeralWrapper.formatMoney(newShares * newSharePrice)}?`
                }
                newSharesInput = createElement("input", {
                    margin: "5px",
                    placeholder: "# New Shares",
                    type: "number",
                    onkeyup: (e) => {
                        e.preventDefault();
                        if (e.keyCode === KEY.ENTER) {
                            issueBtn.click();
                        } else {
                            updateDynamicText(this);
                        }
                    }
                });

                issueBtn = createElement("a", {
                    class: "std-button",
                    display: "inline-block",
                    innerText: "Issue New Shares",
                    clickListener: () => {
                        const newSharePrice = Math.round(this.sharePrice * 0.9);
                        let newShares = parseInt(newSharesInput.value);
                        if (isNaN(newShares)) {
                            dialogBoxCreate("Invalid input for number of new shares");
                            return;
                        }

                        // Round to nearest ten-millionth
                        newShares = Math.round(newShares / 10e6) * 10e6;

                        if (newShares < 10e6 || newShares > maxNewShares) {
                            dialogBoxCreate("Invalid input for number of new shares");
                            return;
                        }

                        const profit = newShares * newSharePrice;
                        this.issueNewSharesCooldown = IssueNewSharesCooldown;
                        this.totalShares += newShares;

                        // Determine how many are bought by private investors
                        // Private investors get up to 50% at most
                        // Round # of private shares to the nearest millionth
                        let privateShares = getRandomInt(0, Math.round(newShares / 2));
                        privateShares = Math.round(privateShares / 1e6) * 1e6;

                        this.issuedShares += (newShares - privateShares);
                        this.funds = this.funds.plus(profit);
                        this.immediatelyUpdateSharePrice();

                        removeElementById(popupId);
                        dialogBoxCreate(`Issued ${numeralWrapper.format(newShares, "0.000a")} and raised ` +
                                        `${numeralWrapper.formatMoney(profit)}. ${numeralWrapper.format(privateShares, "0.000a")} ` +
                                        `of these shares were bought by private investors.<br><br>` +
                                        `Stock price decreased to ${numeralWrapper.formatMoney(this.sharePrice)}`);
                        return false;
                    }
                });

                const cancelBtn = createPopupCloseButton(popupId, {
                    class: "std-button",
                    display: "inline-block",
                    innerText: "Cancel",
                });

                createPopup(popupId, [descText, dynamicText, newSharesInput, issueBtn, cancelBtn]);
                newSharesInput.focus();
            }
        });
        issueNewSharesButtonTooltip = createElement("span", {
            class: "tooltiptext",
            innerText: "Issue new equity shares to raise capital",
        });
        issueNewShares.appendChild(issueNewSharesButtonTooltip);

        companyManagementPanel.appendChild(issueNewShares);

        issueNewSharesButton = issueNewShares;

        // Set Stock Dividends
        const issueDividends = createElement("a", {
            class: "std-button",
            display: "inline-block",
            innerText: "Issue Dividends",
            tooltip: "Manage the dividends that are paid out to shareholders (including yourself)",
            clickListener: () => {
                const popupId = "cmpy-mgmt-issue-dividends-popup";
                const descText = "Dividends are a distribution of a portion of the corporation's " +
                                 "profits to the shareholders. This includes yourself, as well.<br><br>" +
                                 "In order to issue dividends, simply allocate some percentage " +
                                 "of your corporation's profits to dividends. This percentage must be an " +
                                 `integer between 0 and ${DividendMaxPercentage}. (A percentage of 0 means no dividends will be ` +
                                 "issued<br><br>" +
                                 "Two important things to note:<br>" +
                                 " * Issuing dividends will negatively affect your corporation's stock price<br>" +
                                 " * Dividends are taxed. Taxes start at 50%, but can be decreased<br><br>" +
                                 "Example: Assume your corporation makes $100m / sec in profit and you allocate " +
                                 "40% of that towards dividends. That means your corporation will gain $60m / sec " +
                                 "in funds and the remaining $40m / sec will be paid as dividends. Since your " +
                                 "corporation starts with 1 billion shares, every shareholder will be paid $0.04 per share " +
                                 "per second before taxes.";
                const txt = createElement("p", { innerHTML: descText, });

                let allocateBtn;
                const dividendPercentInput = createElement("input", {
                    margin: "5px",
                    placeholder: "Dividend %",
                    type: "number",
                    onkeyup: (e) => {
                        e.preventDefault();
                        if (e.keyCode === KEY.ENTER) {allocateBtn.click();}
                    }
                });

                allocateBtn = createElement("button", {
                    class: "std-button",
                    display: "inline-block",
                    innerText: "Allocate Dividend Percentage",
                    clickListener: () => {
                        const percentage = Math.round(parseInt(dividendPercentInput.value));
                        if (isNaN(percentage) || percentage < 0 || percentage > DividendMaxPercentage) {
                            return dialogBoxCreate(`Invalid value. Must be an integer between 0 and ${DividendMaxPercentage}`);
                        }

                        this.dividendPercentage = percentage;

                        removeElementById(popupId);
                        return false;
                    }
                });

                const cancelBtn = createPopupCloseButton(popupId, {
                    class: "std-button",
                    display: "inline-block",
                    innerText: "Cancel",
                });

                createPopup(popupId, [txt, dividendPercentInput, allocateBtn, cancelBtn]);
                dividendPercentInput.focus();
            },
        });
        companyManagementPanel.appendChild(issueDividends);
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

    appendLineBreaks(companyManagementPanel, 1);

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
                    var money = moneyInput.value == null || moneyInput.value == "" ? 0 : parseFloat(moneyInput.value);
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
                    } else if (stockShares > this.numShares) {
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
                    innerHTML:upgrade[2] +  " - " + numeralWrapper.format(upgrade[1], "$0.000a"),
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
                innerHTML:upgrade[4] + " - " + numeralWrapper.format(cost, "$0.000a"),
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

    // Formatted text for profit
    var profit = this.revenue.minus(this.expenses).toNumber(),
        profitStr = profit >= 0 ? numeralWrapper.format(profit, "$0.000a") : "-" + numeralWrapper.format(-1 * profit, "$0.000a");

    // Formatted text for dividend information, if applicable
    let dividendStr = "";
    if (this.dividendPercentage > 0 && profit > 0) {
        const totalDividends = (this.dividendPercentage / 100) * profit;
        const retainedEarnings = profit - totalDividends;
        const dividendsPerShare = totalDividends / this.totalShares;
        const playerEarnings = this.numShares * dividendsPerShare;

        dividendStr = `Retained Profits (after dividends): ${numeralWrapper.format(retainedEarnings, "$0.000a")} / s<br><br>` +
                      `Dividend Percentage: ${numeralWrapper.format(this.dividendPercentage / 100, "0%")}<br>` +
                      `Dividends per share: ${numeralWrapper.format(dividendsPerShare, "$0.000a")} / s<br>` +
                      `Your earnings as a shareholder (Pre-Tax): ${numeralWrapper.format(playerEarnings, "$0.000a")} / s<br>` +
                      `Dividend Tax Rate: ${this.dividendTaxPercentage}%<br>` +
                      `Your earnings as a shareholder (Post-Tax): ${numeralWrapper.format(playerEarnings * (this.dividendTaxPercentage / 100), "$0.000a")} / s<br><br>`;
    }

    var txt = "Total Funds: " + numeralWrapper.format(this.funds.toNumber(), '$0.000a') + "<br>" +
              "Total Revenue: " + numeralWrapper.format(this.revenue.toNumber(), "$0.000a") + " / s<br>" +
              "Total Expenses: " + numeralWrapper.format(this.expenses.toNumber(), "$0.000a") + "/ s<br>" +
              "Total Profits: " + profitStr + " / s<br>" +
              dividendStr +
              "Publicly Traded: " + (this.public ? "Yes" : "No") + "<br>" +
              "Owned Stock Shares: " + numeralWrapper.format(this.numShares, '0.000a') + "<br>" +
              "Stock Price: " + (this.public ? "$" + formatNumber(this.sharePrice, 2) : "N/A") + "<br>" +
              "<p class='tooltip'>Total Stock Shares: " + numeralWrapper.format(this.totalShares, "0.000a") +
              "<span class='tooltiptext'>" +
                  `Outstanding Shares: ${numeralWrapper.format(this.issuedShares, "0.000a")}<br>` +
                  `Private Shares: ${numeralWrapper.format(this.totalShares - this.issuedShares - this.numShares, "0.000a")}` +
              "</span></p><br><br>";

    const storedTime = this.storedCycles * CONSTANTS.MilliPerCycle / 1000;
    if (storedTime > 15) {
        txt += `Bonus Time: ${storedTime} seconds<br><br>`;
    }

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

    // Disable buttons for cooldowns
    if (sellSharesButton instanceof Element) {
        if (this.shareSaleCooldown <= 0) {
            sellSharesButton.className = "std-button tooltip";
        } else {
            sellSharesButton.className = "a-link-button-inactive tooltip";
        }
    }

    if (sellSharesButtonTooltip instanceof Element) {
        if (this.shareSaleCooldown <= 0) {
            sellSharesButtonTooltip.innerText = "Sell your shares in the company. The money earned from selling your " +
                                                "shares goes into your personal account, not the Corporation's. " +
                                                "This is one of the only ways to profit from your business venture.";
        } else {
            sellSharesButtonTooltip.innerText = "Cannot sell shares for " + this.convertCooldownToString(this.shareSaleCooldown);
        }
    }

    if (issueNewSharesButton instanceof Element) {
        if (this.issueNewSharesCooldown <= 0) {
            issueNewSharesButton.className = "std-button tooltip";
        } else {
            issueNewSharesButton.className = "a-link-button-inactive tooltip";
        }
    }

    if (issueNewSharesButtonTooltip instanceof Element) {
        if (this.issueNewSharesCooldown <= 0) {
            issueNewSharesButtonTooltip.innerText = "Issue new equity shares to raise capital"
        } else {
            issueNewSharesButtonTooltip.innerText = "Cannot issue new shares for " + this.convertCooldownToString(this.issueNewSharesCooldown);
        }
    }
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
                           "This would cost " + numeralWrapper.format(OfficeInitialCost, '$0.000a'),
            });
            var citySelector = createElement("select", {class: "dropdown", margin:"5px"});
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
            const cancelBtn = createPopupCloseButton(popupId, {
                class: "std-button",
                innerText: "Cancel",
            });

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
    var leftPanel = createElement("div", {
        class: "cmpy-mgmt-industry-left-panel",
        overflow: "visible",
        padding: "2px",
    });
    var rightPanel = createElement("div", {
        class: "cmpy-mgmt-industry-right-panel",
        overflow: "visible",
        padding: "2px",
    });
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
    for (let i = 0; i < numUpgrades; ++i) {
        if (division.hasResearch("AutoBrew") && i == 0) {
            continue; // AutoBrew disables Coffee upgrades, which is index 0
        }
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
                innerHTML:upgrade[4] + ' - ' + numeralWrapper.format(cost, "$0.000a"),
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
            case Industries.Healthcare:
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
                        //this.updateUIContent();
                        this.displayDivisionContent(division, city);
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
                office.findEmployees({corporation:this, industry:division});
                return false;
            }
        });
        //industryEmployeeHireButton.classList.add("flashing-button");
    } else {
        industryEmployeeHireButton = createElement("a", {
            class:"a-link-button",display:"inline-block",
            innerText:"Hire Employee", fontSize:"13px",
            clickListener:()=>{
                office.findEmployees({corporation:this, industry:division});
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
            office.hireRandomEmployee({corporation:this, industry:division});
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
            var initialPriceMult = Math.round(office.size / OfficeInitialSize);
            var upgradeCost = OfficeInitialCost * Math.pow(1.07, initialPriceMult);

            //Calculate cost to upgrade size by 15 employees
            var mult = 0;
            for (var i = 0; i < 5; ++i) {
                mult += (Math.pow(1.07, initialPriceMult + i));
            }
            var upgradeCost15 = OfficeInitialCost * mult;

            //Calculate max upgrade size and cost
            var maxMult = (this.funds.dividedBy(OfficeInitialCost)).toNumber();
            var maxNum = 1;
            mult = Math.pow(1.07, initialPriceMult);
            while(maxNum < 50) { //Hard cap of 50x (extra 150 employees)
                if (mult >= maxMult) {break;}
                var multIncrease = Math.pow(1.07, initialPriceMult + maxNum);
                if (mult + multIncrease > maxMult) {
                    break;
                } else {
                    mult += multIncrease;
                }
                ++maxNum;
            }

            var upgradeCostMax = OfficeInitialCost * mult;

            var text = createElement("p", {
                innerText:"Increase the size of your office space to fit additional employees!"
            });
            var text2 = createElement("p", {innerText: "Upgrade size: "});

            var confirmBtn = createElement("a", {
                class: this.funds.lt(upgradeCost) ? "a-link-button-inactive" : "a-link-button",
                display:"inline-block", margin:"4px", innerText:"by 3",
                tooltip:numeralWrapper.format(upgradeCost, "$0.000a"),
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
            var confirmBtn15 = createElement("a", {
                class: this.funds.lt(upgradeCost15) ? "a-link-button-inactive" : "a-link-button",
                display:"inline-block", margin:"4px", innerText:"by 15",
                tooltip:numeralWrapper.format(upgradeCost15, "$0.000a"),
                clickListener:()=>{
                    if (this.funds.lt(upgradeCost15)) {
                        dialogBoxCreate("You don't have enough company funds to purchase this upgrade!");
                    } else {
                        office.size += (OfficeInitialSize * 5);
                        this.funds = this.funds.minus(upgradeCost15);
                        dialogBoxCreate("Office space increased! It can now hold " + office.size + " employees");
                        this.updateUIContent();
                    }
                    removeElementById(popupId);
                    return false;
                }
            });
            var confirmBtnMax = createElement("a", {
                class:this.funds.lt(upgradeCostMax) ? "a-link-button-inactive" : "a-link-button",
                display:"inline-block", margin:"4px", innerText:"by MAX (" + maxNum*OfficeInitialSize + ")",
                tooltip:numeralWrapper.format(upgradeCostMax, "$0.000a"),
                clickListener:()=>{
                    if (this.funds.lt(upgradeCostMax)) {
                        dialogBoxCreate("You don't have enough company funds to purchase this upgrade!");
                    } else {
                        office.size += (OfficeInitialSize * maxNum);
                        this.funds = this.funds.minus(upgradeCostMax);
                        dialogBoxCreate("Office space increased! It can now hold " + office.size + " employees");
                        this.updateUIContent();
                    }
                    removeElementById(popupId);
                    return false;
                }
            });
            var cancelBtn = createElement("a", {
                class:"a-link-button", innerText:"Cancel", display:"inline-block", margin:"4px",
                clickListener:()=>{
                    removeElementById(popupId);
                    return false;
                }
            })
            createPopup(popupId, [text, text2, confirmBtn, confirmBtn15, confirmBtnMax, cancelBtn]);
            return false;
        }
    });
    industryEmployeePanel.appendChild(industryOfficeUpgradeSizeButton);

    //Throw Office Party
    if (!division.hasResearch("AutoPartyManager")) {
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
                var confirmBtn;
                var input = createElement("input", {
                    type:"number", margin:"5px", placeholder:"$ / employee",
                    inputListener:()=>{
                        if (isNaN(input.value) || input.value < 0) {
                            totalCostTxt.innerText = "Invalid value entered!"
                        } else {
                            var totalCost = input.value * office.employees.length;
                            totalCostTxt.innerText = "Throwing this party will cost a total of " + numeralWrapper.format(totalCost, '$0.000a');
                        }
                    },
                    onkeyup:(e)=>{
                        e.preventDefault();
                        if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
                    }
                });
                confirmBtn = createElement("a", {
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
    }

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
                        office.employees[i].createUI(industryIndividualEmployeeInfo, this, division);
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
                    display:"inline-block", width:"50%", fontSize:"15px",
                    innerText: positions[i] + "(" + counts[i] + ")",
                    tooltip: descriptions[i]
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
                    this.displayDivisionContent(division, currentCityUi);
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
        profitStr = profit >= 0 ? numeralWrapper.format(profit, "$0.000a") : "-" + numeralWrapper.format(-1 * profit, "$0.000a");
    var advertisingInfo = "";
    if (vechain) {
        var advertisingFactors = division.getAdvertisingFactors();
        var awarenessFac = advertisingFactors[1];
        var popularityFac = advertisingFactors[2];
        var ratioFac = advertisingFactors[3];
        var totalAdvertisingFac = advertisingFactors[0];
        advertisingInfo =
            "<p class='tooltip'>Advertising Multiplier: x" + formatNumber(totalAdvertisingFac, 3) +
            "<span class='tooltiptext cmpy-mgmt-advertising-info'>Total multiplier for this industry's sales due to its awareness and popularity<br>" +
            "Awareness Bonus: x" + formatNumber(Math.pow(awarenessFac, 0.85), 3) + "<br>" +
            "Popularity Bonus: x" + formatNumber(Math.pow(popularityFac, 0.85), 3) + "<br>" +
            "Ratio Multiplier: x" + formatNumber(Math.pow(ratioFac, 0.85), 3) + "</span></p><br>"

    }

    removeChildrenFromElement(industryOverviewText);
    industryOverviewText.appendChild(createElement("p", {
        innerHTML:"Industry: " + division.type + " (Corp Funds: " + numeralWrapper.format(this.funds.toNumber(), "$0.000a") + ")<br><br>" +
                  "Awareness: " + formatNumber(division.awareness, 3) + "<br>" +
                  "Popularity: " + formatNumber(division.popularity, 3) +  "<br>" +
                  advertisingInfo + "<br>" +
                  "Revenue: " + numeralWrapper.format(division.lastCycleRevenue.toNumber(), "$0.000a") + " / s<br>" +
                  "Expenses: " + numeralWrapper.format(division.lastCycleExpenses.toNumber(), "$0.000a") + " /s<br>" +
                  "Profit: " + profitStr + " / s<br><br>"
    }));
    industryOverviewText.appendChild(createElement("p", {
        marginTop:"2px",
        innerText:"Production Multiplier: " + formatNumber(division.prodMult, 2),
        tooltip:"Production gain from owning production-boosting materials " +
                "such as hardware, Robots, AI Cores, and Real Estate"
    }));
    industryOverviewText.appendChild(createElement("div", {
        innerText:"?", class:"help-tip",
        clickListener:()=>{
            dialogBoxCreate("Owning Hardware, Robots, AI Cores, and Real Estate " +
                            "can boost your Industry's production. The effect these " +
                            "materials have on your production varies between Industries. " +
                            "For example, Real Estate may be very effective for some Industries, " +
                            "but ineffective for others.<br><br>" +
                            "This division's production multiplier is calculated by summing " +
                            "the individual production multiplier of each of its office locations. " +
                            "This production multiplier is applied to each office. Therefore, it is " +
                            "beneficial to expand into new cities as this can greatly increase the " +
                            "production multiplier of your entire Division.");
        }
    }));
    appendLineBreaks(industryOverviewText, 2);
    industryOverviewText.appendChild(createElement("p", {
        display:"inline-block",
        innerText:"Scientific Research: " + formatNumber(division.sciResearch.qty, 3),
        tooltip:"Scientific Research increases the quality of the materials and " +
                "products that you produce."
    }));
    industryOverviewText.appendChild(createElement("div", {
        class: "help-tip",
        innerText: "Research",
        clickListener: () => {
            division.createResearchBox();
        }
    }));

    //Office and Employee List
    var office = division.offices[currentCityUi];
    industryEmployeeText.innerHTML =
                "<h1>Office Space</h1><br>" +
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
    var totalMorale = 0, totalHappiness = 0, totalEnergy = 0, totalSalary = 0,
        avgMorale = 0, avgHappiness = 0, avgEnergy = 0;
    for (let i = 0; i < office.employees.length; ++i) {
        totalMorale += office.employees[i].mor;
        totalHappiness += office.employees[i].hap;
        totalEnergy += office.employees[i].ene;
        totalSalary += office.employees[i].sal;
    }
    if (office.employees.length > 0) {
        avgMorale = totalMorale / office.employees.length;
        avgHappiness = totalHappiness / office.employees.length;
        avgEnergy = totalEnergy / office.employees.length;
    }
    industryEmployeeInfo.innerHTML =
        "Avg Employee Morale: " + formatNumber(avgMorale, 3) + "<br>" +
        "Avg Employee Happiness: " + formatNumber(avgHappiness, 3) + "<br>" +
        "Avg Employee Energy: " + formatNumber(avgEnergy, 3) + "<br>" +
        "Total Employee Salary: " + numeralWrapper.format(totalSalary, "$0.000a");
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
        warehouse.updateUI({industry:division, company:this});
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

    sellSharesButton            = null;
    issueNewSharesButton        = null;
    sellSharesButtonTooltip     = null;
    issueNewSharesButtonTooltip = null;

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

    industryWarehousePanel              = null;
    industrySmartSupplyCheckbox         = null;
    industryWarehouseStorageText        = null;
    industryWarehouseUpgradeSizeButton  = null;
    industryWarehouseStateText          = null;
    industryWarehouseMaterials          = null;
    industryWarehouseProducts           = null;

    researchTreeBoxOpened = false;
    researchTreeBox = null;

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
