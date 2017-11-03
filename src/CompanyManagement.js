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
        Energy - Requires hardware, real estate
                 Produces Energy
                 Can Use Hardware/AI Cores to increase production
                 More real estate = more production with very little dimishing returns
                 Production increased by scientific research
                 High starting cost
        Utilities - Requires hardware, Real Estate
                    Produces Water
                    Can use Hardware, Robotics, and AI Cores to increase production
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
               Restaurants require food, water, energy, and real estate
               Restaurants in general are high stable demand, but lots of competition, and medium markup
               Low starting cost
               Production increase from real estate diminishes greatly in city. e.g. making many restaurants
               in one city has high diminishing returns, but making a few in every city is good
        Tobacco - Create your own tobacco products
                  Requires plants, water, and real estate
                  High volatile demand, but not much competition. Low markup
                  Low starting cost
                  Product quality significantly affected by scientific research
        Chemical - Create your own chemical products.
                   Requires plants, energy, water, and real estate
                   High stable demand, high competition, low markup
                   Medium starting cost
                   Advertising does very little
                   Product quality significantly affected by scientific research
        Pharmaceutical - Create your own drug products
                         Requires chemicals, energy, water, and real estate
                         Very high stable demand. High competition, very high markup
                         High starting cost
                         Requires constant creation of new and better products to be successful
                         Product quality significantly affected by scientific research
        Computer - Creates 'Hardware' material
                   Requires metal, energy, real estate
                   Can use Robotics/AI Cores to increase production
                   More real estate = more production with high diminishing returns
                   Production significantly affected by scientific research
                   High starting cost
        Robotics - Create 'Robots' material and create your own 'Robot' products
                   Requires hardware, energy, and real estate
                   Production can be improved by using AI Cores
                   Extremely high stable demand, medium competition, high markup
                   Extremely high starting cost
                   Product quality significantly affected by scientific research
                   more real estate = more production with medium diminishing returns for 'Robot' materials
        Software - Create 'AI Cores' material and create your own software products
                   Requires hardware, energy, real estate
                   Very high stable demand, high competition, low markup
                   Low starting cost
                   Product quality slightly affected by scientific research
        Healthcare - Open your own hospitals (each is its own product).
                     Requires real estate, robots, AI Cores, energy, water
                     Extremely high stable demand, semi-high competition, super high markup
                     Extremely high starting cost
                     Production increase from real estate diminishes greatly in city. e.g. making many hospitals
                     in one city has high diminishing returns, but making a few in every city is goodIn
        Real Estate - Create 'Real Estate'.
                      Requires metal, energy, water, hardware
                      Can use Hardware/Robotics/AI Cores to increase production
                      Production slightly affected by scientific research
                      Heavily affected by advertising
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
var TOTALSHARES = 1000000000; //Total number of shares you have at your company

function Material(params={}) {
    this.name = params.name ? params.name : "";
    this.qty = 0; //Quantity
    this.qlt = 0; //Quality
    this.dmd = 0; //Demand
    this.cmp = 0; //Competition
    this.mku = 0; //Markup

    //How much space it takes in a Warehouse
    this.siz = params.size ? params.size : 0;

    this.purc = 0; //How much of this material is being purchased per second
    this.cost = 0; //$ Cost per material

    //Material requirements. An object that maps the name of a material to how much it requires
    //to make 1 unit of the product.
    this.req = params.req ? params.req : {};
}

var Materials = {
    Water: new Material({name: "Water", size: 0.1}),
    Energy: new Material
    Food: 13,
    Plants: 14,
    Metal: 15,
    Hardware: 16,
    Chemicals: 17,
    RealEstate: 18,
    Drugs: 19,
    Robots: 20,
    AICores:21,
    SciResearch: 22
}

function Product(params={}) {
    "use strict"
    this.name = params.name         ? params.name           : 0;
    this.dmd = params.demand        ? params.demand         : 0;
    this.cmp = params.competition   ? params.competition    : 0;
    this.mku = params.markup        ? params.markup         : 0;
    this.qlt = params.quality       ? params.quality        : 0;
    this.qty = 0;
    this.per = params.performance   ? params.performance    : 0;
    this.dur = params.durability    ? params.durability     : 0;
    this.rel = params.reliability   ? params.reliability    : 0;
    this.aes = params.aesthetics    ? params.aesthetics     : 0;
    this.fea = params.features      ? params.features       : 0;
    this.loc = params.location      ? params.location       : "";
    this.siz = params.size          ? params.size           : 0; //How much space it takes in the warehouse

    //Material requirements. An object that maps the name of a material to how much it requires
    //to make 1 unit of the product.
    this.req = params.req           ? params.req            : {};
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
    this.materials = {}; //Contains both materials that are created and required
    this.products  = {};

    this.awareness      = 0;
    this.popularity     = 0;
    this.startingCost   = 0;

    /* The following are factors for how much production/other things are increased by
       different factors. The production increase always has diminishing returns,
       and they are all reprsented by inverse exponentials.
       The number for these properties represent the denominator in the inverse
       exponential (aka higher number = more diminishing returns); */
    this.reFac      = 0; //Real estate Factor
    this.sciFac     = 0; //Scientific Research Factor
    this.hwFac      = 0; //Hardware factor
    this.robFac     = 0; //Robotics Factor
    this.aiFac      = 0; //AI Cores factor;
    this.advFac     = 0; //Advertising factor

    this.init();
}

Industry.prototype.init = function() {
    //Set the unique properties of an industry (how much its affected by real estate/scientific research, etc.)
    switch (this.type) {
        case Industries.Energy:
            break;
        case Industries.Utilities:
            break;
        case Industries.Agriculture:
            break;
        case Industries.Fishing:
            break;
        case Industries.Mining:
            break;
        case Industries.Food:
            break;
        case Industries.Tobacco:
            break;
        case Industries.Chemical:
            break;
        case Industries.Pharmaceutical:
            break;
        case Industries.Computer:
            break;
        case Industries.Robotics:
            break;
        case Industries.Software:
            break;
        case Industries.Healthcare:
            break;
        case Industries.RealEstate:
            break;
        default:
            console.log("ERR: Invalid Industry Type passed into Industry.init()");
            return;
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
    this.pro    = 0; //Calculated

    this.off    = params.officeSpace    ? params.officeSpace : {};
    this.loc    = params.officeSpace    ? params.officeSpace.loc : "";
    this.pos    = 0;
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
}

function Warehouse(params={}) {
    "use strict"
    this.loc    = params.loc        ? params.loc    : "";
    this.size   = params.size       ? params.size   : 0;

    this.materials  = {};
    this.products   = {};
}

function Company() {
    "use strict"

    this.industries = [];

    //Financial stats
    this.funds      = 0;
    this.revenue    = 0;
    this.expenses   = 0;
    this.valuation  = 0; //Private investory valuation of company before you go public.
    this.numShares  = TOTALSHARES;
    this.sharePrice = 0;
}
