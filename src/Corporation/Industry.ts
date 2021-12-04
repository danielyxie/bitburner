import { Reviver, Generic_toJSON, Generic_fromJSON } from "../utils/JSONReviver";
import { CityName } from "../Locations/data/CityNames";
import { Industries, IndustryStartingCosts, IndustryResearchTrees } from "./IndustryData";
import { CorporationConstants } from "./data/Constants";
import { EmployeePositions } from "./EmployeePositions";
import { Material } from "./Material";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { calculateEffectWithFactors } from "../utils/calculateEffectWithFactors";
import { OfficeSpace } from "./OfficeSpace";
import { Product } from "./Product";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { isString } from "../utils/helpers/isString";
import { MaterialSizes } from "./MaterialSizes";
import { Warehouse } from "./Warehouse";
import { ICorporation } from "./ICorporation";
import { IIndustry } from "./IIndustry";
import { IndustryUpgrade, IndustryUpgrades } from "./IndustryUpgrades";

interface IParams {
  name?: string;
  corp?: ICorporation;
  type?: string;
}

export class Industry implements IIndustry {
  name = "";
  type = Industries.Agriculture;
  sciResearch = new Material({ name: "Scientific Research" });
  researched: { [key: string]: boolean | undefined } = {};
  reqMats: { [key: string]: number | undefined } = {};

  //An array of the name of materials being produced
  prodMats: string[] = [];

  products: { [key: string]: Product | undefined } = {};
  makesProducts = false;

  awareness = 0;
  popularity = 0; //Should always be less than awareness
  startingCost = 0;

  /* The following are factors for how much production/other things are increased by
       different factors. The production increase always has diminishing returns,
       and they are all reprsented by exponentials of < 1 (e.g x ^ 0.5, x ^ 0.8)
       The number for these represent the exponential. A lower number means more
       diminishing returns */
  reFac = 0; //Real estate Factor
  sciFac = 0; //Scientific Research Factor, affects quality
  hwFac = 0; //Hardware factor
  robFac = 0; //Robotics Factor
  aiFac = 0; //AI Cores factor;
  advFac = 0; //Advertising factor, affects sales

  prodMult = 0; //Production multiplier

  //Financials
  lastCycleRevenue: number;
  lastCycleExpenses: number;
  thisCycleRevenue: number;
  thisCycleExpenses: number;

  //Upgrades
  upgrades: number[] = Array(Object.keys(IndustryUpgrades).length).fill(0);

  state = "START";
  newInd = true;

  //Maps locations to warehouses. 0 if no warehouse at that location
  warehouses: { [key: string]: Warehouse | 0 };

  //Maps locations to offices. 0 if no office at that location
  offices: { [key: string]: OfficeSpace | 0 } = {
    [CityName.Aevum]: 0,
    [CityName.Chongqing]: 0,
    [CityName.Sector12]: new OfficeSpace({
      loc: CityName.Sector12,
      size: CorporationConstants.OfficeInitialSize,
    }),
    [CityName.NewTokyo]: 0,
    [CityName.Ishima]: 0,
    [CityName.Volhaven]: 0,
  };

  constructor(params: IParams = {}) {
    this.name = params.name ? params.name : "";
    this.type = params.type ? params.type : Industries.Agriculture;

    //Financials
    this.lastCycleRevenue = 0;
    this.lastCycleExpenses = 0;
    this.thisCycleRevenue = 0;
    this.thisCycleExpenses = 0;

    this.warehouses = {
      [CityName.Aevum]: 0,
      [CityName.Chongqing]: 0,
      [CityName.Sector12]: new Warehouse({
        corp: params.corp,
        industry: this,
        loc: CityName.Sector12,
        size: CorporationConstants.WarehouseInitialSize,
      }),
      [CityName.NewTokyo]: 0,
      [CityName.Ishima]: 0,
      [CityName.Volhaven]: 0,
    };

    this.init();
  }

  init(): void {
    //Set the unique properties of an industry (how much its affected by real estate/scientific research, etc.)
    const startingCost = IndustryStartingCosts[this.type];
    if (startingCost === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.startingCost = startingCost;
    switch (this.type) {
      case Industries.Energy:
        this.reFac = 0.65;
        this.sciFac = 0.7;
        this.robFac = 0.05;
        this.aiFac = 0.3;
        this.advFac = 0.08;
        this.reqMats = {
          Hardware: 0.1,
          Metal: 0.2,
        };
        this.prodMats = ["Energy"];
        break;
      case Industries.Utilities:
      case "Utilities":
        this.reFac = 0.5;
        this.sciFac = 0.6;
        this.robFac = 0.4;
        this.aiFac = 0.4;
        this.advFac = 0.08;
        this.reqMats = {
          Hardware: 0.1,
          Metal: 0.1,
        };
        this.prodMats = ["Water"];
        break;
      case Industries.Agriculture:
        this.reFac = 0.72;
        this.sciFac = 0.5;
        this.hwFac = 0.2;
        this.robFac = 0.3;
        this.aiFac = 0.3;
        this.advFac = 0.04;
        this.reqMats = {
          Water: 0.5,
          Energy: 0.5,
        };
        this.prodMats = ["Plants", "Food"];
        break;
      case Industries.Fishing:
        this.reFac = 0.15;
        this.sciFac = 0.35;
        this.hwFac = 0.35;
        this.robFac = 0.5;
        this.aiFac = 0.2;
        this.advFac = 0.08;
        this.reqMats = {
          Energy: 0.5,
        };
        this.prodMats = ["Food"];
        break;
      case Industries.Mining:
        this.reFac = 0.3;
        this.sciFac = 0.26;
        this.hwFac = 0.4;
        this.robFac = 0.45;
        this.aiFac = 0.45;
        this.advFac = 0.06;
        this.reqMats = {
          Energy: 0.8,
        };
        this.prodMats = ["Metal"];
        break;
      case Industries.Food:
        //reFac is unique for this bc it diminishes greatly per city. Handle this separately in code?
        this.sciFac = 0.12;
        this.hwFac = 0.15;
        this.robFac = 0.3;
        this.aiFac = 0.25;
        this.advFac = 0.25;
        this.reFac = 0.05;
        this.reqMats = {
          Food: 0.5,
          Water: 0.5,
          Energy: 0.2,
        };
        this.makesProducts = true;
        break;
      case Industries.Tobacco:
        this.reFac = 0.15;
        this.sciFac = 0.75;
        this.hwFac = 0.15;
        this.robFac = 0.2;
        this.aiFac = 0.15;
        this.advFac = 0.2;
        this.reqMats = {
          Plants: 1,
          Water: 0.2,
        };
        this.makesProducts = true;
        break;
      case Industries.Chemical:
        this.reFac = 0.25;
        this.sciFac = 0.75;
        this.hwFac = 0.2;
        this.robFac = 0.25;
        this.aiFac = 0.2;
        this.advFac = 0.07;
        this.reqMats = {
          Plants: 1,
          Energy: 0.5,
          Water: 0.5,
        };
        this.prodMats = ["Chemicals"];
        break;
      case Industries.Pharmaceutical:
        this.reFac = 0.05;
        this.sciFac = 0.8;
        this.hwFac = 0.15;
        this.robFac = 0.25;
        this.aiFac = 0.2;
        this.advFac = 0.16;
        this.reqMats = {
          Chemicals: 2,
          Energy: 1,
          Water: 0.5,
        };
        this.prodMats = ["Drugs"];
        this.makesProducts = true;
        break;
      case Industries.Computer:
      case "Computer":
        this.reFac = 0.2;
        this.sciFac = 0.62;
        this.robFac = 0.36;
        this.aiFac = 0.19;
        this.advFac = 0.17;
        this.reqMats = {
          Metal: 2,
          Energy: 1,
        };
        this.prodMats = ["Hardware"];
        this.makesProducts = true;
        break;
      case Industries.Robotics:
        this.reFac = 0.32;
        this.sciFac = 0.65;
        this.aiFac = 0.36;
        this.advFac = 0.18;
        this.hwFac = 0.19;
        this.reqMats = {
          Hardware: 5,
          Energy: 3,
        };
        this.prodMats = ["Robots"];
        this.makesProducts = true;
        break;
      case Industries.Software:
        this.sciFac = 0.62;
        this.advFac = 0.16;
        this.hwFac = 0.25;
        this.reFac = 0.15;
        this.aiFac = 0.18;
        this.robFac = 0.05;
        this.reqMats = {
          Hardware: 0.5,
          Energy: 0.5,
        };
        this.prodMats = ["AICores"];
        this.makesProducts = true;
        break;
      case Industries.Healthcare:
        this.reFac = 0.1;
        this.sciFac = 0.75;
        this.advFac = 0.11;
        this.hwFac = 0.1;
        this.robFac = 0.1;
        this.aiFac = 0.1;
        this.reqMats = {
          Robots: 10,
          AICores: 5,
          Energy: 5,
          Water: 5,
        };
        this.makesProducts = true;
        break;
      case Industries.RealEstate:
        this.robFac = 0.6;
        this.aiFac = 0.6;
        this.advFac = 0.25;
        this.sciFac = 0.05;
        this.hwFac = 0.05;
        this.reqMats = {
          Metal: 5,
          Energy: 5,
          Water: 2,
          Hardware: 4,
        };
        this.prodMats = ["RealEstate"];
        this.makesProducts = true;
        break;
      default:
        console.error(`Invalid Industry Type passed into Industry.init(): ${this.type}`);
        return;
    }
  }

  getProductDescriptionText(): string {
    if (!this.makesProducts) return "";
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

  getMaximumNumberProducts(): number {
    if (!this.makesProducts) return 0;

    // Calculate additional number of allowed Products from Research/Upgrades
    let additional = 0;
    if (this.hasResearch("uPgrade: Capacity.I")) ++additional;
    if (this.hasResearch("uPgrade: Capacity.II")) ++additional;

    return CorporationConstants.BaseMaxProducts + additional;
  }

  hasMaximumNumberProducts(): boolean {
    return Object.keys(this.products).length >= this.getMaximumNumberProducts();
  }

  //Calculates the values that factor into the production and properties of
  //materials/products (such as quality, etc.)
  calculateProductionFactors(): void {
    let multSum = 0;
    for (let i = 0; i < CorporationConstants.Cities.length; ++i) {
      const city = CorporationConstants.Cities[i];
      const warehouse = this.warehouses[city];
      if (!(warehouse instanceof Warehouse)) {
        continue;
      }

      const materials = warehouse.materials;

      const cityMult =
        Math.pow(0.002 * materials.RealEstate.qty + 1, this.reFac) *
        Math.pow(0.002 * materials.Hardware.qty + 1, this.hwFac) *
        Math.pow(0.002 * materials.Robots.qty + 1, this.robFac) *
        Math.pow(0.002 * materials.AICores.qty + 1, this.aiFac);
      multSum += Math.pow(cityMult, 0.73);
    }

    multSum < 1 ? (this.prodMult = 1) : (this.prodMult = multSum);
  }

  updateWarehouseSizeUsed(warehouse: Warehouse): void {
    warehouse.updateMaterialSizeUsed();

    for (const prodName in this.products) {
      if (this.products.hasOwnProperty(prodName)) {
        const prod = this.products[prodName];
        if (prod === undefined) continue;
        warehouse.sizeUsed += prod.data[warehouse.loc][0] * prod.siz;
      }
    }
  }

  process(marketCycles = 1, state: string, corporation: ICorporation): void {
    this.state = state;

    //At the start of a cycle, store and reset revenue/expenses
    //Then calculate salaries and processs the markets
    if (state === "START") {
      if (isNaN(this.thisCycleRevenue) || isNaN(this.thisCycleExpenses)) {
        console.error("NaN in Corporation's computed revenue/expenses");
        dialogBoxCreate(
          "Something went wrong when compting Corporation's revenue/expenses. This is a bug. Please report to game developer",
        );
        this.thisCycleRevenue = 0;
        this.thisCycleExpenses = 0;
      }
      this.lastCycleRevenue = this.thisCycleRevenue / (marketCycles * CorporationConstants.SecsPerMarketCycle);
      this.lastCycleExpenses = this.thisCycleExpenses / (marketCycles * CorporationConstants.SecsPerMarketCycle);
      this.thisCycleRevenue = 0;
      this.thisCycleExpenses = 0;

      // Once you start making revenue, the player should no longer be
      // considered new, and therefore no longer needs the 'tutorial' UI elements
      if (this.lastCycleRevenue > 0) {
        this.newInd = false;
      }

      // Process offices (and the employees in them)
      let employeeSalary = 0;
      for (const officeLoc in this.offices) {
        const office = this.offices[officeLoc];
        if (office === 0) continue;
        if (office instanceof OfficeSpace) {
          employeeSalary += office.process(marketCycles, corporation, this);
        }
      }
      this.thisCycleExpenses = this.thisCycleExpenses + employeeSalary;

      // Process change in demand/competition of materials/products
      this.processMaterialMarket();
      this.processProductMarket(marketCycles);

      // Process loss of popularity
      this.popularity -= marketCycles * 0.0001;
      this.popularity = Math.max(0, this.popularity);

      // Process Dreamsense gains
      const popularityGain = corporation.getDreamSenseGain(),
        awarenessGain = popularityGain * 4;
      if (popularityGain > 0) {
        this.popularity += popularityGain * marketCycles;
        this.awareness += awarenessGain * marketCycles;
      }

      return;
    }

    // Process production, purchase, and import/export of materials
    let res = this.processMaterials(marketCycles, corporation);
    if (Array.isArray(res)) {
      this.thisCycleRevenue = this.thisCycleRevenue + res[0];
      this.thisCycleExpenses = this.thisCycleExpenses + res[1];
    }

    // Process creation, production & sale of products
    res = this.processProducts(marketCycles, corporation);
    if (Array.isArray(res)) {
      this.thisCycleRevenue = this.thisCycleRevenue + res[0];
      this.thisCycleExpenses = this.thisCycleExpenses + res[1];
    }
  }

  // Process change in demand and competition for this industry's materials
  processMaterialMarket(): void {
    //References to prodMats and reqMats
    const reqMats = this.reqMats,
      prodMats = this.prodMats;

    //Only 'process the market' for materials that this industry deals with
    for (let i = 0; i < CorporationConstants.Cities.length; ++i) {
      //If this industry has a warehouse in this city, process the market
      //for every material this industry requires or produces
      if (this.warehouses[CorporationConstants.Cities[i]] instanceof Warehouse) {
        const wh = this.warehouses[CorporationConstants.Cities[i]];
        if (wh === 0) continue;
        for (const name in reqMats) {
          if (reqMats.hasOwnProperty(name)) {
            wh.materials[name].processMarket();
          }
        }

        //Produced materials are stored in an array
        for (let foo = 0; foo < prodMats.length; ++foo) {
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
  processProductMarket(marketCycles = 1): void {
    // Demand gradually decreases, and competition gradually increases
    for (const name in this.products) {
      if (this.products.hasOwnProperty(name)) {
        const product = this.products[name];
        if (product === undefined) continue;
        let change = getRandomInt(0, 3) * 0.0004;
        if (change === 0) continue;

        if (
          this.type === Industries.Pharmaceutical ||
          this.type === Industries.Software ||
          this.type === Industries.Robotics
        ) {
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
  processMaterials(marketCycles = 1, corporation: ICorporation): [number, number] {
    let revenue = 0,
      expenses = 0;
    this.calculateProductionFactors();

    //At the start of the export state, set the imports of everything to 0
    if (this.state === "EXPORT") {
      for (let i = 0; i < CorporationConstants.Cities.length; ++i) {
        const city = CorporationConstants.Cities[i];
        if (!(this.warehouses[city] instanceof Warehouse)) {
          continue;
        }
        const warehouse = this.warehouses[city];
        if (warehouse === 0) continue;
        for (const matName in warehouse.materials) {
          if (warehouse.materials.hasOwnProperty(matName)) {
            const mat = warehouse.materials[matName];
            mat.imp = 0;
          }
        }
      }
    }

    for (let i = 0; i < CorporationConstants.Cities.length; ++i) {
      const city = CorporationConstants.Cities[i];
      const office = this.offices[city];
      if (office === 0) continue;

      if (this.warehouses[city] instanceof Warehouse) {
        const warehouse = this.warehouses[city];
        if (warehouse === 0) continue;

        switch (this.state) {
          case "PURCHASE": {
            /* Process purchase of materials */
            for (const matName in warehouse.materials) {
              if (!warehouse.materials.hasOwnProperty(matName)) continue;
              const mat = warehouse.materials[matName];
              let buyAmt = 0;
              let maxAmt = 0;
              if (warehouse.smartSupplyEnabled && Object.keys(this.reqMats).includes(matName)) {
                continue;
              }
              buyAmt = mat.buy * CorporationConstants.SecsPerMarketCycle * marketCycles;

              maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / MaterialSizes[matName]);

              buyAmt = Math.min(buyAmt, maxAmt);
              if (buyAmt > 0) {
                mat.qty += buyAmt;
                expenses += buyAmt * mat.bCost;
              }
              this.updateWarehouseSizeUsed(warehouse);
            } //End process purchase of materials

            // smart supply
            const smartBuy: { [key: string]: number | undefined } = {};
            for (const matName in warehouse.materials) {
              if (!warehouse.materials.hasOwnProperty(matName)) continue;
              if (!warehouse.smartSupplyEnabled || !Object.keys(this.reqMats).includes(matName)) continue;
              const mat = warehouse.materials[matName];

              //Smart supply tracker is stored as per second rate
              const reqMat = this.reqMats[matName];
              if (reqMat === undefined) throw new Error(`reqMat "${matName}" is undefined`);
              mat.buy = reqMat * warehouse.smartSupplyStore;
              let buyAmt = mat.buy * CorporationConstants.SecsPerMarketCycle * marketCycles;
              const maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / MaterialSizes[matName]);
              buyAmt = Math.min(buyAmt, maxAmt);
              if (buyAmt > 0) smartBuy[matName] = buyAmt;
            }

            // Find which material were trying to create the least amount of product with.
            let worseAmt = 1e99;
            for (const matName in smartBuy) {
              const buyAmt = smartBuy[matName];
              if (buyAmt === undefined) throw new Error(`Somehow smartbuy matname is undefined`);
              const reqMat = this.reqMats[matName];
              if (reqMat === undefined) throw new Error(`reqMat "${matName}" is undefined`);
              const amt = buyAmt / reqMat;
              if (amt < worseAmt) worseAmt = amt;
            }

            // Align all the materials to the smallest amount.
            for (const matName in smartBuy) {
              const reqMat = this.reqMats[matName];
              if (reqMat === undefined) throw new Error(`reqMat "${matName}" is undefined`);
              smartBuy[matName] = worseAmt * reqMat;
            }

            // Calculate the total size of all things were trying to buy
            let totalSize = 0;
            for (const matName in smartBuy) {
              const buyAmt = smartBuy[matName];
              if (buyAmt === undefined) throw new Error(`Somehow smartbuy matname is undefined`);
              totalSize += buyAmt * MaterialSizes[matName];
            }

            // Shrink to the size of available space.
            const freeSpace = warehouse.size - warehouse.sizeUsed;
            if (totalSize > freeSpace) {
              for (const matName in smartBuy) {
                const buyAmt = smartBuy[matName];
                if (buyAmt === undefined) throw new Error(`Somehow smartbuy matname is undefined`);
                smartBuy[matName] = Math.floor((buyAmt * freeSpace) / totalSize);
              }
            }

            // Use the materials already in the warehouse if the option is on.
            for (const matName in smartBuy) {
              if (!warehouse.smartSupplyUseLeftovers[matName]) continue;
              const mat = warehouse.materials[matName];
              const buyAmt = smartBuy[matName];
              if (buyAmt === undefined) throw new Error(`Somehow smartbuy matname is undefined`);
              smartBuy[matName] = Math.max(0, buyAmt - mat.qty);
            }

            // buy them
            for (const matName in smartBuy) {
              const mat = warehouse.materials[matName];
              const buyAmt = smartBuy[matName];
              if (buyAmt === undefined) throw new Error(`Somehow smartbuy matname is undefined`);
              mat.qty += buyAmt;
              expenses += buyAmt * mat.bCost;
            }
            break;
          }
          case "PRODUCTION":
            warehouse.smartSupplyStore = 0; //Reset smart supply amount

            /* Process production of materials */
            if (this.prodMats.length > 0) {
              const mat = warehouse.materials[this.prodMats[0]];
              //Calculate the maximum production of this material based
              //on the office's productivity
              const maxProd =
                this.getOfficeProductivity(office) *
                this.prodMult * // Multiplier from materials
                corporation.getProductionMultiplier() *
                this.getProductionMultiplier(); // Multiplier from Research
              let prod;

              if (mat.prdman[0]) {
                //Production is manually limited
                prod = Math.min(maxProd, mat.prdman[1]);
              } else {
                prod = maxProd;
              }
              prod *= CorporationConstants.SecsPerMarketCycle * marketCycles; //Convert production from per second to per market cycle

              // Calculate net change in warehouse storage making the produced materials will cost
              let totalMatSize = 0;
              for (let tmp = 0; tmp < this.prodMats.length; ++tmp) {
                totalMatSize += MaterialSizes[this.prodMats[tmp]];
              }
              for (const reqMatName in this.reqMats) {
                const normQty = this.reqMats[reqMatName];
                if (normQty === undefined) continue;
                totalMatSize -= MaterialSizes[reqMatName] * normQty;
              }
              // If not enough space in warehouse, limit the amount of produced materials
              if (totalMatSize > 0) {
                const maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / totalMatSize);
                prod = Math.min(maxAmt, prod);
              }

              if (prod < 0) {
                prod = 0;
              }

              // Keep track of production for smart supply (/s)
              warehouse.smartSupplyStore += prod / (CorporationConstants.SecsPerMarketCycle * marketCycles);

              // Make sure we have enough resource to make our materials
              let producableFrac = 1;
              for (const reqMatName in this.reqMats) {
                if (this.reqMats.hasOwnProperty(reqMatName)) {
                  const reqMat = this.reqMats[reqMatName];
                  if (reqMat === undefined) continue;
                  const req = reqMat * prod;
                  if (warehouse.materials[reqMatName].qty < req) {
                    producableFrac = Math.min(producableFrac, warehouse.materials[reqMatName].qty / req);
                  }
                }
              }
              if (producableFrac <= 0) {
                producableFrac = 0;
                prod = 0;
              }

              // Make our materials if they are producable
              if (producableFrac > 0 && prod > 0) {
                for (const reqMatName in this.reqMats) {
                  const reqMat = this.reqMats[reqMatName];
                  if (reqMat === undefined) continue;
                  const reqMatQtyNeeded = reqMat * prod * producableFrac;
                  warehouse.materials[reqMatName].qty -= reqMatQtyNeeded;
                  warehouse.materials[reqMatName].prd = 0;
                  warehouse.materials[reqMatName].prd -=
                    reqMatQtyNeeded / (CorporationConstants.SecsPerMarketCycle * marketCycles);
                }
                for (let j = 0; j < this.prodMats.length; ++j) {
                  warehouse.materials[this.prodMats[j]].qty += prod * producableFrac;
                  warehouse.materials[this.prodMats[j]].qlt =
                    office.employeeProd[EmployeePositions.Engineer] / 90 +
                    Math.pow(this.sciResearch.qty, this.sciFac) +
                    Math.pow(warehouse.materials["AICores"].qty, this.aiFac) / 10e3;
                }
              } else {
                for (const reqMatName in this.reqMats) {
                  if (this.reqMats.hasOwnProperty(reqMatName)) {
                    warehouse.materials[reqMatName].prd = 0;
                  }
                }
              }

              //Per second
              const fooProd = (prod * producableFrac) / (CorporationConstants.SecsPerMarketCycle * marketCycles);
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
            for (const matName in warehouse.materials) {
              if (warehouse.materials.hasOwnProperty(matName)) {
                const mat = warehouse.materials[matName];
                if (mat.sCost < 0 || mat.sllman[0] === false) {
                  mat.sll = 0;
                  continue;
                }

                // Sale multipliers
                const businessFactor = this.getBusinessFactor(office); //Business employee productivity
                const advertisingFactor = this.getAdvertisingFactors()[0]; //Awareness + popularity
                const marketFactor = this.getMarketFactor(mat); //Competition + demand

                // Determine the cost that the material will be sold at
                const markupLimit = mat.getMarkupLimit();
                let sCost;
                if (mat.marketTa2) {
                  const prod = mat.prd;

                  // Reverse engineer the 'maxSell' formula
                  // 1. Set 'maxSell' = prod
                  // 2. Substitute formula for 'markup'
                  // 3. Solve for 'sCost'
                  const numerator = markupLimit;
                  const sqrtNumerator = prod;
                  const sqrtDenominator =
                    (mat.qlt + 0.001) *
                    marketFactor *
                    businessFactor *
                    corporation.getSalesMultiplier() *
                    advertisingFactor *
                    this.getSalesMultiplier();
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
                    optimalPrice = numerator / denominator + mat.bCost;
                  }

                  // We'll store this "Optimal Price" in a property so that we don't have
                  // to re-calculate it for the UI
                  mat.marketTa2Price = optimalPrice;

                  sCost = optimalPrice;
                } else if (mat.marketTa1) {
                  sCost = mat.bCost + markupLimit;
                } else if (isString(mat.sCost)) {
                  sCost = (mat.sCost as string).replace(/MP/g, mat.bCost + "");
                  sCost = eval(sCost);
                } else {
                  sCost = mat.sCost;
                }

                // Calculate how much of the material sells (per second)
                let markup = 1;
                if (sCost > mat.bCost) {
                  //Penalty if difference between sCost and bCost is greater than markup limit
                  if (sCost - mat.bCost > markupLimit) {
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

                const maxSell =
                  (mat.qlt + 0.001) *
                  marketFactor *
                  markup *
                  businessFactor *
                  corporation.getSalesMultiplier() *
                  advertisingFactor *
                  this.getSalesMultiplier();
                let sellAmt;
                if (isString(mat.sllman[1])) {
                  //Dynamically evaluated
                  let tmp = (mat.sllman[1] as string).replace(/MAX/g, (maxSell + "").toUpperCase());
                  tmp = tmp.replace(/PROD/g, mat.prd + "");
                  try {
                    sellAmt = eval(tmp);
                  } catch (e) {
                    dialogBoxCreate(
                      "Error evaluating your sell amount for material " +
                        mat.name +
                        " in " +
                        this.name +
                        "'s " +
                        city +
                        " office. The sell amount " +
                        "is being set to zero",
                    );
                    sellAmt = 0;
                  }
                  sellAmt = Math.min(maxSell, sellAmt);
                } else if (mat.sllman[1] === -1) {
                  //Backwards compatibility, -1 = MAX
                  sellAmt = maxSell;
                } else {
                  //Player's input value is just a number
                  sellAmt = Math.min(maxSell, mat.sllman[1] as number);
                }

                sellAmt = sellAmt * CorporationConstants.SecsPerMarketCycle * marketCycles;
                sellAmt = Math.min(mat.qty, sellAmt);
                if (sellAmt < 0) {
                  console.warn(`sellAmt calculated to be negative for ${matName} in ${city}`);
                  mat.sll = 0;
                  continue;
                }
                if (sellAmt && sCost >= 0) {
                  mat.qty -= sellAmt;
                  revenue += sellAmt * sCost;
                  mat.sll = sellAmt / (CorporationConstants.SecsPerMarketCycle * marketCycles);
                } else {
                  mat.sll = 0;
                }
              }
            } //End processing of sale of materials
            break;

          case "EXPORT":
            for (const matName in warehouse.materials) {
              if (warehouse.materials.hasOwnProperty(matName)) {
                const mat = warehouse.materials[matName];
                mat.totalExp = 0; //Reset export
                for (let expI = 0; expI < mat.exp.length; ++expI) {
                  const exp = mat.exp[expI];
                  const amtStr = exp.amt.replace(
                    /MAX/g,
                    (mat.qty / (CorporationConstants.SecsPerMarketCycle * marketCycles) + "").toUpperCase(),
                  );
                  let amt = 0;
                  try {
                    amt = eval(amtStr);
                  } catch (e) {
                    dialogBoxCreate(
                      "Calculating export for " +
                        mat.name +
                        " in " +
                        this.name +
                        "'s " +
                        city +
                        " division failed with " +
                        "error: " +
                        e,
                    );
                    continue;
                  }
                  if (isNaN(amt)) {
                    dialogBoxCreate(
                      "Error calculating export amount for " +
                        mat.name +
                        " in " +
                        this.name +
                        "'s " +
                        city +
                        " division.",
                    );
                    continue;
                  }
                  amt = amt * CorporationConstants.SecsPerMarketCycle * marketCycles;

                  if (mat.qty < amt) {
                    amt = mat.qty;
                  }
                  if (amt === 0) {
                    break; //None left
                  }
                  for (let foo = 0; foo < corporation.divisions.length; ++foo) {
                    if (corporation.divisions[foo].name === exp.ind) {
                      const expIndustry = corporation.divisions[foo];
                      const expWarehouse = expIndustry.warehouses[exp.city];
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
                        const maxAmt = Math.floor((expWarehouse.size - expWarehouse.sizeUsed) / MaterialSizes[matName]);
                        amt = Math.min(maxAmt, amt);
                      }
                      expWarehouse.materials[matName].imp +=
                        amt / (CorporationConstants.SecsPerMarketCycle * marketCycles);
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
                mat.totalExp /= CorporationConstants.SecsPerMarketCycle * marketCycles;
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
        this.sciResearch.qty +=
          0.004 *
          Math.pow(office.employeeProd[EmployeePositions.RandD], 0.5) *
          corporation.getScientificResearchMultiplier() *
          this.getScientificResearchMultiplier();
      }
    }
    return [revenue, expenses];
  }

  //Process production & sale of this industry's FINISHED products (including all of their stats)
  processProducts(marketCycles = 1, corporation: ICorporation): [number, number] {
    let revenue = 0;
    const expenses = 0;

    //Create products
    if (this.state === "PRODUCTION") {
      for (const prodName in this.products) {
        const prod = this.products[prodName];
        if (prod === undefined) continue;
        if (!prod.fin) {
          const city = prod.createCity;
          const office = this.offices[city];
          if (office === 0) continue;

          // Designing/Creating a Product is based mostly off Engineers
          const engrProd = office.employeeProd[EmployeePositions.Engineer];
          const mgmtProd = office.employeeProd[EmployeePositions.Management];
          const opProd = office.employeeProd[EmployeePositions.Operations];
          const total = engrProd + mgmtProd + opProd;
          if (total <= 0) {
            break;
          }

          // Management is a multiplier for the production from Engineers
          const mgmtFactor = 1 + mgmtProd / (1.2 * total);

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
    for (const prodName in this.products) {
      if (this.products.hasOwnProperty(prodName)) {
        const prod = this.products[prodName];
        if (prod instanceof Product && prod.fin) {
          revenue += this.processProduct(marketCycles, prod, corporation);
        }
      }
    }
    return [revenue, expenses];
  }

  //Processes FINISHED products
  processProduct(marketCycles = 1, product: Product, corporation: ICorporation): number {
    let totalProfit = 0;
    for (let i = 0; i < CorporationConstants.Cities.length; ++i) {
      const city = CorporationConstants.Cities[i];
      const office = this.offices[city];
      if (office === 0) continue;
      const warehouse = this.warehouses[city];
      if (warehouse instanceof Warehouse) {
        switch (this.state) {
          case "PRODUCTION": {
            //Calculate the maximum production of this material based
            //on the office's productivity
            const maxProd =
              this.getOfficeProductivity(office, { forProduct: true }) *
              corporation.getProductionMultiplier() *
              this.prodMult * // Multiplier from materials
              this.getProductionMultiplier() * // Multiplier from research
              this.getProductProductionMultiplier(); // Multiplier from research
            let prod;

            //Account for whether production is manually limited
            if (product.prdman[city][0]) {
              prod = Math.min(maxProd, product.prdman[city][1]);
            } else {
              prod = maxProd;
            }
            prod *= CorporationConstants.SecsPerMarketCycle * marketCycles;

            //Calculate net change in warehouse storage making the Products will cost
            let netStorageSize = product.siz;
            for (const reqMatName in product.reqMats) {
              if (product.reqMats.hasOwnProperty(reqMatName)) {
                const normQty = product.reqMats[reqMatName];
                netStorageSize -= MaterialSizes[reqMatName] * normQty;
              }
            }

            //If there's not enough space in warehouse, limit the amount of Product
            if (netStorageSize > 0) {
              const maxAmt = Math.floor((warehouse.size - warehouse.sizeUsed) / netStorageSize);
              prod = Math.min(maxAmt, prod);
            }

            warehouse.smartSupplyStore += prod / (CorporationConstants.SecsPerMarketCycle * marketCycles);

            //Make sure we have enough resources to make our Products
            let producableFrac = 1;
            for (const reqMatName in product.reqMats) {
              if (product.reqMats.hasOwnProperty(reqMatName)) {
                const req = product.reqMats[reqMatName] * prod;
                if (warehouse.materials[reqMatName].qty < req) {
                  producableFrac = Math.min(producableFrac, warehouse.materials[reqMatName].qty / req);
                }
              }
            }

            //Make our Products if they are producable
            if (producableFrac > 0 && prod > 0) {
              for (const reqMatName in product.reqMats) {
                if (product.reqMats.hasOwnProperty(reqMatName)) {
                  const reqMatQtyNeeded = product.reqMats[reqMatName] * prod * producableFrac;
                  warehouse.materials[reqMatName].qty -= reqMatQtyNeeded;
                  warehouse.materials[reqMatName].prd -=
                    reqMatQtyNeeded / (CorporationConstants.SecsPerMarketCycle * marketCycles);
                }
              }
              //Quantity
              product.data[city][0] += prod * producableFrac;
            }

            //Keep track of production Per second
            product.data[city][1] = (prod * producableFrac) / (CorporationConstants.SecsPerMarketCycle * marketCycles);
            break;
          }
          case "SALE": {
            //Process sale of Products
            product.pCost = 0; //Estimated production cost
            for (const reqMatName in product.reqMats) {
              if (product.reqMats.hasOwnProperty(reqMatName)) {
                product.pCost += product.reqMats[reqMatName] * warehouse.materials[reqMatName].bCost;
              }
            }

            // Since its a product, its production cost is increased for labor
            product.pCost *= CorporationConstants.ProductProductionCostRatio;

            // Sale multipliers
            const businessFactor = this.getBusinessFactor(office); //Business employee productivity
            const advertisingFactor = this.getAdvertisingFactors()[0]; //Awareness + popularity
            const marketFactor = this.getMarketFactor(product); //Competition + demand

            // Calculate Sale Cost (sCost), which could be dynamically evaluated
            const markupLimit = product.rat / product.mku;
            let sCost;
            if (product.marketTa2) {
              const prod = product.data[city][1];

              // Reverse engineer the 'maxSell' formula
              // 1. Set 'maxSell' = prod
              // 2. Substitute formula for 'markup'
              // 3. Solve for 'sCost'roduct.pCost = sCost
              const numerator = markupLimit;
              const sqrtNumerator = prod;
              const sqrtDenominator =
                0.5 *
                Math.pow(product.rat, 0.65) *
                marketFactor *
                corporation.getSalesMultiplier() *
                businessFactor *
                advertisingFactor *
                this.getSalesMultiplier();
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
                optimalPrice = numerator / denominator + product.pCost;
              }

              // Store this "optimal Price" in a property so we don't have to re-calculate for UI
              product.marketTa2Price[city] = optimalPrice;
              sCost = optimalPrice;
            } else if (product.marketTa1) {
              sCost = product.pCost + markupLimit;
            } else if (isString(product.sCost)) {
              const sCostString = product.sCost as string;
              if (product.mku === 0) {
                console.error(`mku is zero, reverting to 1 to avoid Infinity`);
                product.mku = 1;
              }
              sCost = sCostString.replace(/MP/g, product.pCost + product.rat / product.mku + "");
              sCost = eval(sCost);
            } else {
              sCost = product.sCost;
            }

            let markup = 1;
            if (sCost > product.pCost) {
              if (sCost - product.pCost > markupLimit) {
                markup = markupLimit / (sCost - product.pCost);
              }
            }

            const maxSell =
              0.5 *
              Math.pow(product.rat, 0.65) *
              marketFactor *
              corporation.getSalesMultiplier() *
              Math.pow(markup, 2) *
              businessFactor *
              advertisingFactor *
              this.getSalesMultiplier();
            let sellAmt;
            if (product.sllman[city][0] && isString(product.sllman[city][1])) {
              //Sell amount is dynamically evaluated
              let tmp = product.sllman[city][1].replace(/MAX/g, (maxSell + "").toUpperCase());
              tmp = tmp.replace(/PROD/g, product.data[city][1]);
              try {
                tmp = eval(tmp);
              } catch (e) {
                dialogBoxCreate(
                  "Error evaluating your sell price expression for " +
                    product.name +
                    " in " +
                    this.name +
                    "'s " +
                    city +
                    " office. Sell price is being set to MAX",
                );
                tmp = maxSell;
              }
              sellAmt = Math.min(maxSell, tmp);
            } else if (product.sllman[city][0] && product.sllman[city][1] > 0) {
              //Sell amount is manually limited
              sellAmt = Math.min(maxSell, product.sllman[city][1]);
            } else if (product.sllman[city][0] === false) {
              sellAmt = 0;
            } else {
              sellAmt = maxSell;
            }
            if (sellAmt < 0) {
              sellAmt = 0;
            }
            sellAmt = sellAmt * CorporationConstants.SecsPerMarketCycle * marketCycles;
            sellAmt = Math.min(product.data[city][0], sellAmt); //data[0] is qty
            if (sellAmt && sCost) {
              product.data[city][0] -= sellAmt; //data[0] is qty
              totalProfit += sellAmt * sCost;
              product.data[city][2] = sellAmt / (CorporationConstants.SecsPerMarketCycle * marketCycles); //data[2] is sell property
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

  discontinueProduct(product: Product): void {
    for (const productName in this.products) {
      if (this.products.hasOwnProperty(productName)) {
        if (product === this.products[productName]) {
          delete this.products[productName];
        }
      }
    }
  }

  upgrade(upgrade: IndustryUpgrade, refs: { corporation: ICorporation; office: OfficeSpace }): void {
    const corporation = refs.corporation;
    const office = refs.office;
    const upgN = upgrade[0];
    while (this.upgrades.length <= upgN) {
      this.upgrades.push(0);
    }
    ++this.upgrades[upgN];

    switch (upgN) {
      case 0: {
        //Coffee, 5% energy per employee
        for (let i = 0; i < office.employees.length; ++i) {
          office.employees[i].ene = Math.min(office.employees[i].ene * 1.05, office.maxEne);
        }
        break;
      }
      case 1: {
        //AdVert.Inc,
        const advMult = corporation.getAdvertisingMultiplier() * this.getAdvertisingMultiplier();
        this.awareness += 3 * advMult;
        this.popularity += 1 * advMult;
        this.awareness *= 1.01 * advMult;
        this.popularity *= (1 + getRandomInt(1, 3) / 100) * advMult;
        break;
      }
      default: {
        console.error(`Un-implemented function index: ${upgN}`);
        break;
      }
    }
  }

  // Returns how much of a material can be produced based of office productivity (employee stats)
  getOfficeProductivity(office: OfficeSpace, params: { forProduct?: boolean } = {}): number {
    const opProd = office.employeeProd[EmployeePositions.Operations];
    const engrProd = office.employeeProd[EmployeePositions.Engineer];
    const mgmtProd = office.employeeProd[EmployeePositions.Management];
    const total = opProd + engrProd + mgmtProd;

    if (total <= 0) return 0;

    // Management is a multiplier for the production from Operations and Engineers
    const mgmtFactor = 1 + mgmtProd / (1.2 * total);

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
  getBusinessFactor(office: OfficeSpace): number {
    const businessProd = 1 + office.employeeProd[EmployeePositions.Business];

    return calculateEffectWithFactors(businessProd, 0.26, 10e3);
  }

  //Returns a set of multipliers based on the Industry's awareness, popularity, and advFac. This
  //multiplier affects sales. The result is:
  //  [Total sales mult, total awareness mult, total pop mult, awareness/pop ratio mult]
  getAdvertisingFactors(): [number, number, number, number] {
    const awarenessFac = Math.pow(this.awareness + 1, this.advFac);
    const popularityFac = Math.pow(this.popularity + 1, this.advFac);
    const ratioFac = this.awareness === 0 ? 0.01 : Math.max((this.popularity + 0.001) / this.awareness, 0.01);
    const totalFac = Math.pow(awarenessFac * popularityFac * ratioFac, 0.85);
    return [totalFac, awarenessFac, popularityFac, ratioFac];
  }

  //Returns a multiplier based on a materials demand and competition that affects sales
  getMarketFactor(mat: { dmd: number; cmp: number }): number {
    return Math.max(0.1, (mat.dmd * (100 - mat.cmp)) / 100);
  }

  // Returns a boolean indicating whether this Industry has the specified Research
  hasResearch(name: string): boolean {
    return this.researched[name] === true;
  }

  updateResearchTree(): void {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry "${this.type}"`);

    // Since ResearchTree data isnt saved, we'll update the Research Tree data
    // based on the stored 'researched' property in the Industry object
    if (Object.keys(researchTree.researched).length !== Object.keys(this.researched).length) {
      for (const research in this.researched) {
        researchTree.research(research);
      }
    }
  }

  // Get multipliers from Research
  getAdvertisingMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getAdvertisingMultiplier();
  }

  getEmployeeChaMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getEmployeeChaMultiplier();
  }

  getEmployeeCreMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getEmployeeCreMultiplier();
  }

  getEmployeeEffMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getEmployeeEffMultiplier();
  }

  getEmployeeIntMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getEmployeeIntMultiplier();
  }

  getProductionMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getProductionMultiplier();
  }

  getProductProductionMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getProductProductionMultiplier();
  }

  getSalesMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getSalesMultiplier();
  }

  getScientificResearchMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getScientificResearchMultiplier();
  }

  getStorageMultiplier(): number {
    const researchTree = IndustryResearchTrees[this.type];
    if (researchTree === undefined) throw new Error(`Invalid industry: "${this.type}"`);
    this.updateResearchTree();
    return researchTree.getStorageMultiplier();
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): any {
    return Generic_toJSON("Industry", this);
  }

  /**
   * Initiatizes a Industry object from a JSON save state.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Industry {
    return Generic_fromJSON(Industry, value.data);
  }
}

Reviver.constructors.Industry = Industry;
