import {Locations}                              from "./src/Location.js";
import {getRandomInt}                           from "../utils/HelperFunctions.js";

/*
Products
    For certain industries, players can creat their own custom products
    Essentially, these are just things you give a certain name to.

    Products have certain properties that affect how well they sell. These properties
    are just numbers. For each Industry, only some of these properties are applicable
    (e.g. Performance isnt applicable for food industry)
        Demand: Determined by industry. For most industries this will slowly decrease over time, meaning
                that you must create new and better products to remain successful. The speed at which this
                decreases over time is dependent on industry
        Competition: Determined by industry
        Markup : Determined by Industry
        Quality:
        Performance:
        Durability:
        Reliability:
        Aesthetics:
        Features:
        Location: Only valid for 'building' products like Restaurants, Hospitals, etc.
    Scientific Research affects the properties of products
Materials:
    To create Products, you need materials. There are different tiers of Materials
    Materials have several properties that determine how profitable they can be:
        Quality:
        Demand:
        Competition:
        Markup: How much price markup a material can have before theres a significant dropoff in how much its bought

    Materials Types:
        1st tier:
            Water - High Stable Demand, Medium competition, low markup
            Energy - Suuuuuuper high  stable demand, High competition, low markup
        2nd Tier:
            Food - High Stable Demand, Lots of competition, medium markup
            Plants - Initially high but volatile demand. Decent competition, low markup
            Metal - Very high stable demand, lots of competition, low markup
        3rd Tier:
            Hardware - Very high stable demand, lots of competition, med markup
            Chemicals - High stable demand, good amount of competition, med markup
            Real estate - Initially high but volatile demand. Decent competition, med markup. Tied to a certain city
        4th tier:
            Drugs - High stable demand, lots of competition, medium markup
            Robots - Very high stable demand, looots of competition, high markup
            AI Cores - Very high stable demand, looooots of competition, veeery high markup
        5th tier:
            Scientific Research

Industries:
    - Some Industries let you create your own custom "Products", while others just produce Materials
    - Each Industry has different characteristics for things
    - List of Industries:
        Energy - Requires metal, hardware
                 Produces Energy
                 Can Use Robotics/AI Cores to increase production
                 More real estate = more production with very little dimishing returns
                 Production increased by scientific research
                 High starting cost
        Utilities - Requires metal, hardware
                    Produces Water
                    Can use Robotics, and AI Cores to increase production
                    More real estate = more production with medium diminishing returns
                    Production increased by scientific research
                    High starting cost
        Agriculture - Requires Water and Energy
                      Produces food and plants
                      Can use Hardware/Robotics/AI Cores to increase production
                      Production increased by scientific research
                      More real estate = more production  with very little diminishing returns
                      Medium starting cost
        Fishing - Requires energy
                  Produces lots of food
                  Can use Hardware/Robotics/AI Cores to increase production
                  Production increased by scientific research
                  More real estate = slightly more production with very high diminishing returns
                  Medium starting cost (higher than agriculture)
        Mining - Requires Energy
                 Produces Metal
                 Can use hardware/Robotics/AI Cores to increase production
                 Production increased by scientific research
                 More real estate = more production with medium diminishing returns
                 High starting cost
        Food - Create your own "restaurant" products
               Restaurants require food, water, energy
               Restaurants in general are high stable demand, but lots of competition, and medium markup
               Low starting cost
               Production increase from real estate diminishes greatly in city. e.g. making many restaurants
               in one city has high diminishing returns, but making a few in every city is good
        Tobacco - Create your own tobacco products
                  Requires plants, water
                  High volatile demand, but not much competition. Low markup
                  Low starting cost
                  Product quality significantly affected by scientific research
        Chemical - Create Chemicals
                   Requires plants, energy, water
                   High stable demand, high competition, low markup
                   Medium starting cost
                   Advertising does very little
                   Product quality significantly affected by scientific research
        Pharmaceutical - Create your own drug products
                         Requires chemicals, energy, water
                         Very high stable demand. High competition, very high markup
                         High starting cost
                         Requires constant creation of new and better products to be successful
                         Product quality significantly affected by scientific research
        Computer - Creates 'Hardware' material and your own Computer products
                   Requires metal, energy
                   Can use Robotics/AI Cores to increase production
                   More real estate = more production with high diminishing returns
                   Production significantly affected by scientific research
                   High starting cost
        Robotics - Create 'Robots' material and create your own 'Robot' products
                   Requires hardware, energy
                   Production can be improved by using AI Cores
                   Extremely high stable demand, medium competition, high markup
                   Extremely high starting cost
                   Product quality significantly affected by scientific research
                   more real estate = more production with medium diminishing returns for 'Robot' materials
        Software - Create 'AI Cores' material and create your own software products
                   Requires hardware, energy
                   Very high stable demand, high competition, low markup
                   Low starting cost
                   Product quality slightly affected by scientific research
        Healthcare - Open your own hospitals (each is its own product).
                     Requires  robots, AI Cores, energy, water
                     Extremely high stable demand, semi-high competition, super high markup
                     Extremely high starting cost
                     Production increase from real estate diminishes greatly in city. e.g. making many hospitals
                     in one city has high diminishing returns, but making a few in every city is goodIn
        Real Estate - Create 'Real Estate' and your own Real Estate Products
                      Requires metal, energy, water, hardware
                      Can use Robotics/AI Cores to increase production
                      Production slightly affected by scientific research
                      Heavily affected by advertising
                      Extremely high starting cost
        Biotechnology -
        Entertainment -
        Finance -
        Mass Media -
        Telecommunications -

    Employees:
        Has morale, happiness, and energy that must be managed to maintain productivity
        Has a city property
        Stats:
            Age, Intelligence, Charisma, Experience, Creativity, Efficiency

        Assigned to different positions. The productivity at each position is determined by
        stats. I.e. each employe should be assigned to positions based on stats to optimize production

        Hiring Employees:
            When you choose to hire employees you are given a randomly generated list of employees to hire
            They will demand a certain salary and maybe stock shares

    Employee Position
        Operations -
        Engineer -
        Business -
        Accounting -
        Management -
        Research and Development -

    Company stats
        A Company has an inventory of products and materials

        Financial stats (All numbers are in per second):
            Revenue - Total income generated
            Expenses - Total Expenses
            Profit - Revenue minus Expenses
            Private Valuation: Investor valuation of your company before you go public. Affects how much money they invest
            Market Cap: Once you go public, it is the total number of shares times stock price
            Earnings Per Share(EPS): Net Income (Profit) / Number of Oustanding Shares
            Price to Earnings: P/E Ratio = Price per Share / EPS

        Awareness: A number indicating how many people are aware of your company
        Popularity: A number indicating how many people like your company
        Warehouse Space: How many materials it can stock
        Office Space:
            Costs $/s in upkeep
            You can open one office space in each city
            Size - increased by upgrades, increases max # employees in the city
                    However if your # employees is near the max this affects employee happiness
            Comfort - Increased by upgrades, affects employees in that office
            Beauty - Increased by upgrades, affects employees in that office
            Tiers of Office Space:
                Basic
                Enhanced
                Luxurious
                Extravagant
            Upgrades
                Things that increase comfort/beauty. Some may cost upkeep and some might not

        Company Upgrades:
            Can upgrade Warehouse Space and Office Space
            Can throw 'events' (company picnic, outing, party, etc.) for one time expenses and temporary boosts
            Advertising, Increases Company Awareness and Popularity

    Investors
        When you start a company you have 1 billion shares (subject to change)
        Four rounds of investing: Seed, Series A, Series B, Series C
        In each round, you can give up certain shares to receive money
        These are optional

        You can choose to go public at any time, at which point your stock price
        will fluctuate based on company performance. Then you can sell whatever
        shares you have left on the stock market.
*/

/* Constants */
var TOTALSHARES = 1000000000; //Total number of shares you have at your company
var CyclesPerMarketCycle    = 150;
var SecsPerMarketCycle      = CyclesPerMarketCycle / 5;
var Cities = [Locations.Aevum, Locations.Chongqing, Locations.Sector12,
              Locations.NewTokyo, Locations.Ishima, Locations.Volhaven];

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
    this.bCost = 0; //$ Cost/sec to buy material
    this.sCost = 0; //$ Cost/sec to sell material

    //[Whether production/sale is limited, limit amount]
    this.prdman = [false, 0]; //Production for this material is manually limited
    this.sllman = [false, 0]; //Sale of this material is manually limited
}

Material.prototype.init = function(mats={}) {
    switch(this.name) {
        case "Water":
            this.dmd = 75; this.dmdR = [65, 85];
            this.cmp = 50; this.cmpR = [40, 60];
            this.bCost = 100; this.mv = 0.3;
            this.mku = 25;
            break;
        case "Energy":
            this.dmd = 90; this.dmdR = [80, 100];
            this.cmp = 80; this.cmpR = [65, 95];
            this.bCost = 250; this.mv = 0.3;
            this.mku = 25;
            break;
        case "Food":
            this.dmd = 80; this.dmdR = [70, 90];
            this.cmp = 60; this.cmpR = [35, 85];
            this.bCost = 500; this.mv = 1.5;
            this.mku = 15;
            break;
        case "Plants":
            this.dmd = 70; this.dmdR = [20, 90];
            this.cmp = 50; this.cmpR = [30, 70];
            this.bCost = 300; this.mv = 0.9;
            this.mku = 20;
            break;
        case "Metal":
            this.dmd = 80; this.dmdR = [75, 85];
            this.cmp = 70; this.cmpR = [60, 80];
            this.bCost = 250; this.mv = 1.5;
            this.mku = 25;
            break;
        case "Hardware":
            this.dmd = 85; this.dmdR = [80, 90];
            this.cmp = 80; this.cmpR = [65, 95];
            this.bCost = 1000; this.mv = 1.2;
            this.mku = 12;
            break;
        case "Chemicals":
            this.dmd = 55; this.dmdR = [40, 70];
            this.cmp = 60; this.cmpR = [40, 80];
            this.bCost = 750; this.mv = 1.8;
            this.mku = 14;
            break;
        case "Real Estate":
            this.dmd = 50; this.dmdR = [5, 100];
            this.cmp = 50; this.cmpR = [25, 75];
            this.bCost = 1500; this.mv = 2.5;
            this.mku = 11;
            break;
        case "Drugs":
            this.dmd = 60; this.dmdR = [45, 75];
            this.cmp = 70; this.cmpR = [40, 100];
            this.bCost = 800; this.mv = 2.2;
            this.mku = 10;
            break;
        case "Robots":
            this.dmd = 90; this.dmdR = [80, 100];
            this.cmp = 90; this.cmpR = [80, 100];
            this.bCost = 2000; this.mv = 1.2;
            this.mku = 5;
            break;
        case "AI Cores":
            this.dmd = 90; this.dmdR = [80, 100];
            this.cmp = 90; this.cmpR = [80, 100];
            this.bCost = 2500; this.mv = 1.6;
            this.mku = 4
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
        this.cmp > this.cmpR[1] ? this.cmp = this.cmpR[1];
        this.bCost *= (1-pv);
    } else {
        this.cmp *= (1-v);
        this.cmp < this.cmpR[0] ? this.cmp = this.cmpR[0];
        this.bCost *= (1+pv);
    }

    //This 2nd random check determines whether demand increases or decreases
    //More demand = higher market price
    v = (Math.random() * this.mv) / 100;
    pv = (Math.random() * this.mv) / 100;
    if (Math.random() < 0.45) {
        this.dmd *= (1+v);
        this.dmd > this.dmdR[1] ? this.dmd = this.dmdR[1];
        this.bCost *= (1+pv);
    } else {
        this.dmd *= (1-v);
        this.dmd < this.dmdR[0] ? this.dmd = this.dmdR[0];
        this.bCost *= (1-pv);
    }

}

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
    "AI Cores": 0.1
}

function Product(params={}) {
    "use strict"
    this.name = params.name         ? params.name           : 0;
    this.dmd = params.demand        ? params.demand         : 0;
    this.cmp = params.competition   ? params.competition    : 0;
    this.mku = params.markup        ? params.markup         : 0;
    this.prd = 0;

    //Variables for creation of product
    this.fin = false; //Finished being created
    this.prog = 0; //0-100% created


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

    this.qty = 0;

    //Only applicable for certain products like Restaurants
    this.loc = params.location      ? params.location       : "";

    //How much space it takes in the warehouse. Not applicable for all products
    this.siz = params.size          ? params.size           : 0;

    //Material requirements. An object that maps the name of a material to how much it requires
    //to make 1 unit of the product.
    this.reqMats = params.req           ? params.req            : {};

    //[Whether production/sale is limited, limit amount]
    this.prdman = [false, 0];
    this.sllman = [false, 0];
}

Product.prototype.createProduct = function() {

}

Product.prototype.finishProduct = function() {

}


var ProductRatingWeights = {
    Industries.Food: {
        Quality:        0.7,
        Durability:     0.1,
        Aesthetics:     0.2,
    },
    Industries.Tobacco: {
        Quality:        0.4,
        Durability:     0.2,
        Reliability:    0.2,
        Aesthetics:     0.2,
    },
    Industries.Pharmaceutical: {
        Quality:        0.2,
        Performance:    0.2,
        Durability:     0.1,
        Reliability:    0.3,
        Features:       0.2,
    },
    Industries.Computer: {
        Quality:        0.15,
        Performance:    0.25,
        Durability:     0.25,
        Reliability:    0.2,
        Aesthetics:     0.05,
        Features:       0.1,
    },
    Industries.Robotics: {
        Quality:        0.1,
        Performance:    0.2,
        Durability:     0.2,
        Reliability:    0.2,
        Aesthetics:     0.1,
        Features:       0.2,
    },
    Industries.Software: {
        Quality:        0.2,
        Performance:    0.2,
        Reliability:    0.2,
        Durability:     0.2,
        Features:       0.2,
    },
    Industries.Healthcare: {
        Quality:        0.4,
        Performance:    0.1,
        Durability:     0.1,
        Reliability:    0.3,
        Features:       0.1,
    },
    Industries.RealEstate: {
        Quality:        0.2,
        Durability:     0.25,
        Reliability:    0.1,
        Aesthetics:     0.35,
        Features:       0.1,
    }
}
Product.prototype.calculateRating = function(industry) {
    var weights = ProductRatingWeights.industry;
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

var Industries = {
    Energy: 50,
    Utilities: 51,
    Agriculture: 52,
    Fishing: 53,
    Mining: 54,
    Food: 55,
    Tobacco: 56,
    Chemical: 57,
    Pharmaceutical: 58,
    Computer: 59,
    Robotics: 60,
    Software: 61,
    Healthcare: 62,
    RealEstate: 63,
}

function Industry(params={}) {
    "use strict"
    if (params.company == null) {
        throw new Error("ERROR: Industry being created without a parent company");
    }
    this.offices = { //Maps locations to offices. 0 if no office at that location
        Locations.Aevum: 0,
        Locations.Chonqing: 0,
        Locations.Sector12: 0,
        Locations.NewTokyo: 0,
        Locations.Ishima: 0,
        Locations.Volhaven: 0
    };

    this.warehouses = { //Maps locations to warehouses. 0 if no warehouse at that location
        Locations.Aevum: 0,
        Locations.Chonqing: 0,
        Locations.Sector12: 0,
        Locations.NewTokyo: 0,
        Locations.Ishima: 0,
        Locations.Volhaven: 0
    };

    this.type   = params.type ? params.type : 0;

    this.sciResearch    = new Material({name: "Scientific Research"});

    //A map of the NAME of materials required to create produced materials to
    //how many are needed to produce 1 unit of produced materials
    this.reqMats = {};

    //An array of the name of materials being produced
    this.prodMats = [];

    this.products  = {};

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
    this.funds      = new Decimal(0);
    this.revenue    = new Decimal(0);
    this.expenses   = new Decimal(0);

    this.init();
}

Industry.prototype.init = function() {
    //Set the unique properties of an industry (how much its affected by real estate/scientific research, etc.)
    switch (this.type) {
        case Industries.Energy:
            this.reFac  = 0.75;
            this.sciFac = 0.8;
            this.robFac = 0.1;
            this.aiFac  = 0.4;
            this.advFac = 0.25;
            this.startingCost = 200e9;
            this.reqMats = {
                "Hardware": 0.1,
                "Metal":    0.25,
            };
            this.prodMats = ["Energy"];
            break;
        case Industries.Utilities:
            this.reFac  = 0.5;
            this.sciFac = 0.7;
            this.robFac = 0.4;
            this.aiFac  = 0.4;
            this.advFac = 0.3;
            this.startingCost = 125e9;
            this.reqMats = {
                "Hardware": 0.1,
                "Metal":    0.2,
            }
            this.prodMats = ["Water"];
            break;
        case Industries.Agriculture:
            this.reFac  = 0.9;
            this.sciFac = 0.6;
            this.hwFac  = 0.3;
            this.robFac = 0.4;
            this.aiFac  = 0.4;
            this.advFac = 0.1;
            this.startingCost = 30e9;
            this.reqMats = {
                "Water":    0.5,
                "Energy":   0.5,
            }
            this.prodMats = ["Plants", "Food"];
            break;
        case Industries.Fishing:
            this.reFac  = 0.15;
            this.sciFac = 0.4;
            this.hwFac  = 0.4;
            this.robFac = 0.6;
            this.aiFac  = 0.25;
            this.advFac = 0.2;
            this.startingCost = 60e9;
            this.reqMats = {
                "Energy":   0.5,
            }
            this.prodMats = ["Food"];
            break;
        case Industries.Mining:
            this.reFac  = 0.4;
            this.sciFac = 0.35;
            this.hwFac  = 0.5;
            this.robFac = 0.6;
            this.aiFac  = 0.6;
            this.advFac = 0.1;
            this.startingCost = 300e9;
            this.reqMats = {
                "Energy":   0.8,
            }
            this.prodMats = ["Metal"];
            break;
        case Industries.Food:
            //reFac is unique for this bc it diminishes greatly per city. Handle this separately in code?
            this.sciFac = 0.15;
            this.hwFac  = 0.2;
            this.robFac = 0.4;
            this.aiFac  = 0.35;
            this.advFac = 0.85;
            this.startingCost = 5e9;
            this.reqMats = {
                "Food":     0.5,
                "Water":    0.5,
                "Energy":   0.2,
            }
            break;
        case Industries.Tobacco:
            this.reFac  = 0.2;
            this.sciFac = 0.85;
            this.hwFac  = 0.2;
            this.robFac = 0.25;
            this.aiFac  = 0.2;
            this.advFac = 0.7;
            this.startingCost = 10e9;
            this.reqMats = {
                "Plants":   1,
                "Water":    0.2,
            }
            break;
        case Industries.Chemical:
            this.reFac  = 0.3;
            this.sciFac = 0.85;
            this.hwFac  = 0.2;
            this.robFac = 0.3;
            this.aiFac  = 0.2;
            this.advFac = 0.15;
            this.startingCost = 70e9;
            this.reqMats = {
                "Plants":   1,
                "Energy":   0.5,
                "Water":    0.5,
            }
            this.prodMats = ["Chemicals"];
            break;
        case Industries.Pharmaceutical:
            this.reFac  = 0.1;
            this.sciFac = 0.9;
            this.hwFac  = 0.2;
            this.robFac = 0.3;
            this.aiFac  = 0.25;
            this.advFac = 0.65;
            this.startingCost = 150e9;
            this.reqMats = {
                "Chemicals":    2,
                "Energy":       1,
                "Water":        0.5,
            }
            this.prodMats = ["Drugs"];
            break;
        case Industries.Computer:
            this.reFac  = 0.25;
            this.sciFac = 0.75;
            this.robFac = 0.5;
            this.aiFac  = 0.3;
            this.advFac = 0.6;
            this.startingCost = 200e9;
            this.reqMats = {
                "Metal":    2.5,
                "Energy":   1,
            }
            this.prodMats = ["Hardware"];
            break;
        case Industries.Robotics:
            this.reFac  = 0.45;
            this.sciFac = 0.8;
            this.aiFac  = 0.5;
            this.advFac = 0.7;
            this.startingCost = 1e12;
            this.reqMats = {
                "Hardware":     5,
                "Energy":       3,
            }
            this.prodMats = ["Robots"];
            break;
        case Industries.Software:
            this.sciFac = 0.8;
            this.advFac = 0.6;
            this.startingCost = 10e9;
            this.reqMats = {
                "Hardware":     0.5,
                "Energy":       1,
            }
            this.prodMats = ["AI Cores"];
            break;
        case Industries.Healthcare:
            //reFac is unique for this bc it diminishes greatly per city. Handle this separately in code?
            this.sciFac = 0.85;
            this.advFac = 0.4;
            this.startingCost = 750e9;
            this.reqMats = {
                "Robots":       10,
                "AI Cores":     5,
                "Energy":       5,
                "Water":        5,
            }
            break;
        case Industries.RealEstate:
            this.robFac = 0.7;
            this.aiFac  = 0.7;
            this.advFac = 0.75;
            this.startingCost = 600e9;
            this.reqMats = {
                "Metal":    20,
                "Energy":   10,
                "Water":    10,
                "Hardware": 5
            }
            this.prodMats = ["Real Estate"];
            break;
        default:
            console.log("ERR: Invalid Industry Type passed into Industry.init(): " + this.type);
            return;
    }
}

//Calculates the values that factor into the production and properties of
//materials/products (such as quality, etc.)
Industry.prototype.calculateProductionFactors = function(city) {
    var warehouse = this.warehouses[city], materials = warehouse.materials,
        office = this.offices[city];
    //Production is multiplied by this
    this.prodMult = Math.pow(0.1 * materials.RealEstate, this.reFac) *
                    Math.pow(0.1 * materials.Hardware, this.hwFac) *
                    Math.pow(0.1 * materials.Robots, this.robFac) *
                    Math.pow(0.1 * materials.AICores, this.aiFac);
    this.prodMult += 1;
}

Industry.prototype.updateWarehouseSizeUsed = function(city) {
    var warehouse = this.warehouses[city];
    if (warehouse instanceof Warehouse) {
        //This resets the size back to 1 and accounts for materials
        warehouse.updateWarehouseSizeUsed();
    }
    //TODO Account for products
}

Industry.prototype.process = function(numCycles=1) {
    //Process change in demand/competition of materials/products

    //Determine production of materials/products (including their quality)

    //Determine sale of materials/products (how many sell)
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
            for (var name in prodMats) {
                if (prodMats.hasOwnProperty(name)) {
                    wh.materials[name].processMarket();
                }
            }
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
            product.dmd -= change;
            product.cmp += change;
        }
    }
}

//Calculate employee producitivity values, which are unique per office
Industry.prototype.processEmployeeProductivity = function(marketCycles=1) {
    for (var i = 0; i < Cities.length; ++i) {
        var city = Cities[i];
        if (this.offices[city] instanceof OfficeSpace) {
            this.offices[city].calculateEmployeeProductivity();
        } else {
            console.log("ERROR: calling Industry.processEmployeeProductivity() for an office that doesn't exist");
        }
    }
}

//Process production, purchase, and import/export of materials
Industry.prototype.processMaterials = function(marketCycles=1) {
    for (var i = 0; i < Cities.length; ++i) {
        var city = Cities[i], office = this.offices[city];
        this.calculateProductionFactors(city); //TODO Should this go here?

        if (this.warehouses[city] instanceof Warehouse) {
            var warehouse = this.warehouses[city];
            /* Process purchase of materials */
            for (var matName in warehouse.materials) {
                if (warehouse.materials.hasOwnProperty(matName)) {
                    var mat = warehouse.materials[matName];
                    var buyAmt = (mat.buy * SecsPerMarketCycle * marketCycles);
                    var maxAmt = Math.floor((warehouse.size - warehouse.sizedUsed) / MaterialSizes[matName]);
                    var buyAmt = Math.min(buyAmt, maxAmt);
                    if (buyAmt > 0) {
                        mat.qty += buyAmt;
                        this.funds = this.funds.minus(buyAmt * mat.bCost);
                    }
                }
            } //End process purchase of materials

            warehouse.updateSizeUsed();

            /* Process production of materials */
            if (this.prodMats.length > 0) {
                var mat = warehouse.materials[this.prodMats[0]];
                //Calculate the maximum production of this material based
                //on the office's productivity
                var total = office.employeeProd[EmployeePositions.Operations] +
                            office.employeeProd[EmployeePositions.Engineer] +
                            office.employeeProd[EmployeePositions.Management];
                var ratio = (office.employeeProd[EmployeePositions.Operations] / total) *
                            (office.employeeProd[EmployeePositions.Engineer] / total) *
                            (office.employeeProd[EmployeePositions.Management] / total);
                var maxProd = ratio * (0.5 * total), prod;

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
                for (var tmp = 0; tmp < this.prodMats.length; ++tmp)
                    totalMatSize += MaterialSizes[this.prodMats[tmp]];
                }
                for (var reqMatName in this.reqMats) {
                    if (this.reqMats.hasOwnProperty(reqMatName)) {
                        var normQty = this.reqMats[reqMatName];
                        totalMatSize -= (MaterialSizes[reqMatName] * normQty);
                    }
                }
                //If not enough space in warehouse, limit the amount of produced
                //materials
                if (totalMatSize > 0) {
                    var maxAmt = Math.floor((warehouse.size - warehouse.sizedUsed) / totalMatSize);
                    prod = Math.min(maxAmt, prod);
                }

                //Make sure we have enough resource to make our materials
                var producableFrac = 1;
                for (var reqMatName in this.reqMats) {
                    if (this.reqMats.hasOwnProperty(reqMatName)) {
                        var req = this.reqMats[reqMatName] * prod;
                        if (warehouse[reqMatName].qty < req) {
                            producableFrac = Math.min(producableFrac, warehouse[reqMatName].qty / req);
                        }
                    }
                }

                //Make our materials if they are producable
                if (producableFrac > 0) {
                    for (var reqMatName in this.reqMats) {
                        if (this.reqMats.hasOwnProperty(reqMatName)) {
                            warehouse[reqMatName].qty -= (this.reqMats[reqMatName] * prod * producableFrac);
                        }
                    }
                    for (var j = 0; j < this.prodMats.length; ++j) {
                        warehouse[this.prodMats[j]].qty += (prod * producableFrac * this.prodMult);
                        warehouse[this.prodMats[j]].qlt =
                            (office.employeeProd[EmployeePositions.Engineer] +
                             Math.pow(this.sciResearch, this.sciFac) +
                             Math.pow(materials.AICores, this.aiFac) / 10e3;
                    }
                }
                //Per second
                mat.prd = prod * producableFrac * this.prodMult / (SecsPerMarketCycle * marketCycles);
            }

            /* Process sale of materials */
            for (var matName in warehouse.materials) {
                if (warehouse.materials.hasOwnProperty(matName)) {
                    var mat = warehouse.materials[matName];

                    //Calculate how much of the material sells (per second)
                    var markup = 1, markupLimit = mat.qlt / mat.mku;
                    if (mat.sCost > mat.bCost) {
                        //Penalty if difference between sCost and bCost is greater than markup limit
                        if ((mat.sCost - mat.bCost) > markupLimit) {
                            markup = markupLimit / (mat.sCost - mat.bCost);
                        }
                    }
                    var maxSell = mat.qlt * mat.dmd * (1 - mat.cmp) *
                                  (this.popularity / this.awareness) * markup;
                    var sellAmt;
                    if (mat.sllman[0]) {
                        //Sell amount is manually limited
                        sellAmt = Math.min(maxSell, mat.sllman[1]);
                    }
                    sellAmt = (sellAmt * SecsPerMarketCycle * marketCycles);
                    sellAmt = Math.min(mat.qty, sellAmt);
                    if (sellAmt && mat.sCost) {
                        mat.qty -= sellAmt;
                        this.funds = this.funds.plus(sellAmt * mat.sCost);
                        mat.sll = sellAmt / (SecsPerMarketCycle * marketCycles);
                    } else {
                        mat.sll = 0;
                    }
                }
            } //End processing of sale of materials

            warehouse.updateSizeUsed();

            /* TODO Process Export of materials */

        } // End warehouse

        //Produce Scientific Research based on R&D employees
        //Scientific Research can be produced without a warehouse
        this.sciResearch += (0.01 * office.employeeProd[EmployeePositions.RandD]);
    }
}

//Process this industry's producton of products (including all of their stats)
Industry.prototype.processProducts = function(marketCycles=1) {
    for (var prodName in this.products) {
        if (this.products.hasOwnProperty(prodName)) {
            var prod = this.products[prodName];
            if (prod instanceof Product) {
                this.processProduct(marketCycles, prod);
            } else {
                console.log("ERROR: Trying to process a non-Product object in Industry.products");
            }
        }
    }
}

Industry.prototype.processProduct = function(marketCycles=1, product) {
    for (var i = 0; i < Cities.length; ++i) {
        var city = Cities[i], office = this.offices[city], warehouse = this.warehouses[city];
        if (warehouse instanceof Warehouse) {
            //Calculate the maximum production of this Product based on
            //office's productivity, materials, etc.
            var total = office.employeeProd[EmployeePositions.Operations] +
                        office.employeeProd[EmployeePositions.Engineer] +
                        office.employeeProd[EmployeePositions.Management];
            var ratio = (office.employeeProd[EmployeePositions.Operations] / total) *
                        (office.employeeProd[EmployeePositions.Engineer] / total) *
                        (office.employeeProd[EmployeePositions.Management] / total);
            var maxProd = ratio * (0.35 * total), prod;

            //Account for whether production is manually limited
            if (mat.prdman[0]) {
                prod = Math.min(maxProd, mat.prdman[1]);
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
                var maxAmt = Math.floor((warehouse.size - warehouse.sizedUsed) / netStorageSize);
                prod = Math.min(maxAmt, prod);
            }

            //Make sure we have enough resources to make our Products
            var producableFrac = 1;
            for (var reqMatName in product.reqMats) {
                if (product.reqMats.hasOwnProperty(reqMatName)) {
                    var req = product.reqMats[reqMatName] * prod;
                    if (warehouse[reqMatName].qty < req) {
                        producableFrac = Math.min(producableFrac, warehouse[reqMatName].qty / req);
                    }
                }
            }

            //Make our Products if they are producable
            if (producableFrac > 0) {
                for (var reqMatName in product.reqMats) {
                    if (product.reqMats.hasOwnProperty(reqMatName)) {
                        warehouse[reqMatName].qty -= (product.reqMats[reqMatName] * prod * producableFrac);
                    }
                }
                product.qty += (prod * producableFrac * this.prodMult);
            }

            //Per second
            product.prd = prod * producableFrac * this.prodMult / (SecsPerMarketCycle * marketCycles);
        }
    }
}

var EmployeePositions = {
    Operations: 1,
    Engineer: 2,
    Business: 3,
    Accounting: 4,
    Management: 5,
    RandD: 6
}

function Employee(params={}) {
    "use strict"
    if (!(this instanceof Employee)) {
        return new Employee(params);
    }
    this.name   = params.name           ? params.name           : "Bobby";
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

    this.off    = params.officeSpace    ? params.officeSpace : {};
    this.loc    = params.officeSpace    ? params.officeSpace.loc : "";
    this.pos    = params.position       ? params.position : EmployeePositions.Operations;
}

Employee.prototype.calculateProductivity = function() {
    var prodBase = this.mor * this.hap * this.ene, prodMult;
    switch(this.pos) {
        //Calculate productivity based on position. This is multipled by prodBase
        //to get final value
        EmployeePositions.Operations:
            prodMult = (0.6 * this.int) + (0.1 * this.cha) + (this.exp) +
                       (0.5 * this.cre) + (this.eff);
            break;
        EmployeePositions.Engineer:
            prodMult = (this.int) + (0.1 * this.cha) + (1.5 * this.exp) +
                       (this.eff);
            break;
        EmployeePositions.Business:
            prodMult = (0.4 * this.int) + (this.cha) + (0.5 * this.exp);
            break;
        EmployeePositions.Accounting:
            prodMult = (0.25 * this.int) + (0.5 * this.exp) + (this.eff);
            break;
        EmployeePositions.Management:
            prodMult = (2 * this.cha) + (this.exp) + (0.2 * this.cre) +
                       (0.7 * this.eff);
            break;
        EmployeePositions.RandD:
            prodMult = (1.5 * this.int) + (0.8 * this.exp) + (this.cre) +
                       (0.5 * this.eff);
            break;
        default:
            console.log("Invalid employee position: " + this.pos);
            break;
    }
    return prodBase * prodMult;
}

var OfficeSpaceTiers = {
    Basic: 7,
    Enhanced: 8,
    Luxurious: 9,
    Extravagant: 10
}

function OfficeSpace(params={}) {
    "use strict"
    this.loc    = params.loc        ? params.loc        : "";
    this.cost   = params.cost       ? params.cost       : 1;
    this.size   = params.size       ? params.size       : 1;
    this.comf   = params.comfort    ? params.comfort    : 1;
    this.beau   = parms.beauty      ? params.beauty     : 1;
    this.tier   = OfficeSpaceTiers.Basic;
    this.employees = [];
    this.employeeProd = {
        EmployeePositions.Operations: 0,
        EmployeePositions.Engineer: 0,
        EmployeePositions.Business: 0,
        EmployeePositions.Accounting: 0,
        EmployeePositions.Management: 0,
        EmployeePositions.RandD:0,
    };
}

OfficeSpace.prototype.calculateEmployeeProductivity = function(marketCycles=1) {
    //Reset
    for (var name in this.employeeProd) {
        if (this.employeeProd.hasOwnProperty(name)) {
            this.employeeProd[name] = 0;
        }
    }

    for (var i = 0; i < this.employees.length; ++i) {
        var employee = this.employees[i];
        var prod = employee.calculateProductivity();
        this.employeeProd[employee.pos] += prod;
    }
}

function Warehouse(params={}) {
    "use strict"
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
            this.sizeUsed += (mat.qty * MaterialSizes[mat.name]);
        }
    }
    if (this.sizeUsed > this.size) {
        console.log("ERROR: Warehouse sized used greater than capacity, something went wrong");
    }
    //After this function is called, the Industry owning this Warehouse will call
    //its own updateWarehouseSizeUsed function which accounts for products
}

function Company(params={}) {
    "use strict"
    this.name = params.name ? params.name : "The Company";

    //A division/business sector is represented  by the object:
    //{name: "NAME HERE", industry: INDUSTRY OBJECT}
    this.divisions = [];

    //Financial stats
    this.funds      = new Decimal(0);
    this.revenue    = new Decimal(0);
    this.expenses   = new Decimal(0);
    this.valuation  = 0; //Private investory valuation of company before you go public.
    this.numShares  = TOTALSHARES;
    this.sharePrice = 0;
}
