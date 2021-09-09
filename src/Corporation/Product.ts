import { EmployeePositions } from "./EmployeePositions";
import { MaterialSizes } from "./MaterialSizes";
import { IIndustry } from "./IIndustry";
import { ProductRatingWeights, IProductRatingWeight } from "./ProductRatingWeights";

import { createCityMap } from "../Locations/createCityMap";
import { IMap } from "../types";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
import { getRandomInt } from "../../utils/helpers/getRandomInt";

interface IConstructorParams {
  name?: string;
  demand?: number;
  competition?: number;
  markup?: number;
  createCity?: string;
  designCost?: number;
  advCost?: number;
  quality?: number;
  performance?: number;
  durability?: number;
  reliability?: number;
  aesthetics?: number;
  features?: number;
  loc?: string;
  size?: number;
  req?: IMap<number>;
}

export class Product {
  // Product name
  name = "";

  // The demand for this Product in the market. Gradually decreases
  dmd = 0;

  // How much competition there is in the market for this Product
  cmp = 0;

  // Markup. Affects how high of a price you can charge for this Product
  // without suffering a loss in the # of sales
  mku = 0;

  // Production cost - estimation of how much money it costs to make this Product
  pCost = 0;

  // Sell cost
  sCost: string | number = 0;

  // Variables for handling the creation process of this Product
  fin = false; // Whether this Product has finished being created
  prog = 0; // Creation progress - A number betwee 0-100 representing percentage
  createCity = ""; // City in which the product is/was being created
  designCost = 0; // How much money was invested into designing this Product
  advCost = 0; // How much money was invested into advertising this Product

  // Aggregate score for this Product's 'rating'
  // This is based on the stats/properties below. The weighting of the
  // stats/properties below differs between different industries
  rat = 0;

  // Stats/properties of this Product
  qlt = 0;
  per = 0;
  dur = 0;
  rel = 0;
  aes = 0;
  fea = 0;

  // Data refers to the production, sale, and quantity of the products
  // These values are specific to a city
  // For each city, the data is [qty, prod, sell]
  data: IMap<number[]> = createCityMap<number[]>([0, 0, 0]);

  // Location of this Product
  // Only applies for location-based products like restaurants/hospitals
  loc = "";

  // How much space 1 unit of the Product takes (in the warehouse)
  // Not applicable for all Products
  siz = 0;

  // Material requirements. An object that maps the name of a material to how much it requires
  // to make 1 unit of the product.
  reqMats: IMap<number> = {};

  // Data to keep track of whether production/sale of this Product is
  // manually limited. These values are specific to a city
  //  [Whether production/sale is limited, limit amount]
  prdman: IMap<any[]> = createCityMap<any[]>([false, 0]);
  sllman: IMap<any[]> = createCityMap<any[]>([false, 0]);

  // Flags that signal whether automatic sale pricing through Market TA is enabled
  marketTa1 = false;
  marketTa2 = false;
  marketTa2Price: IMap<number> = createCityMap<number>(0);

  constructor(params: IConstructorParams = {}) {
    this.name = params.name ? params.name : "";
    this.dmd = params.demand ? params.demand : 0;
    this.cmp = params.competition ? params.competition : 0;
    this.mku = params.markup ? params.markup : 0;
    this.createCity = params.createCity ? params.createCity : "";
    this.designCost = params.designCost ? params.designCost : 0;
    this.advCost = params.advCost ? params.advCost : 0;
    this.qlt = params.quality ? params.quality : 0;
    this.per = params.performance ? params.performance : 0;
    this.dur = params.durability ? params.durability : 0;
    this.rel = params.reliability ? params.reliability : 0;
    this.aes = params.aesthetics ? params.aesthetics : 0;
    this.fea = params.features ? params.features : 0;
    this.loc = params.loc ? params.loc : "";
    this.siz = params.size ? params.size : 0;
    this.reqMats = params.req ? params.req : {};
  }

  // empWorkMult is a multiplier that increases progress rate based on
  // productivity of employees
  createProduct(marketCycles = 1, empWorkMult = 1): void {
    if (this.fin) {
      return;
    }
    this.prog += marketCycles * 0.01 * empWorkMult;
  }

  // @param industry - Industry object. Reference to industry that makes this Product
  finishProduct(employeeProd: { [key: string]: number }, industry: IIndustry): void {
    this.fin = true;

    //Calculate properties
    const progrMult = this.prog / 100;

    const engrRatio = employeeProd[EmployeePositions.Engineer] / employeeProd["total"];
    const mgmtRatio = employeeProd[EmployeePositions.Management] / employeeProd["total"];
    const rndRatio = employeeProd[EmployeePositions.RandD] / employeeProd["total"];
    const opsRatio = employeeProd[EmployeePositions.Operations] / employeeProd["total"];
    const busRatio = employeeProd[EmployeePositions.Business] / employeeProd["total"];
    const designMult = 1 + Math.pow(this.designCost, 0.1) / 100;
    const balanceMult = 1.2 * engrRatio + 0.9 * mgmtRatio + 1.3 * rndRatio + 1.5 * opsRatio + busRatio;
    const sciMult = 1 + Math.pow(industry.sciResearch.qty, industry.sciFac) / 800;
    const totalMult = progrMult * balanceMult * designMult * sciMult;

    this.qlt =
      totalMult *
      (0.1 * employeeProd[EmployeePositions.Engineer] +
        0.05 * employeeProd[EmployeePositions.Management] +
        0.05 * employeeProd[EmployeePositions.RandD] +
        0.02 * employeeProd[EmployeePositions.Operations] +
        0.02 * employeeProd[EmployeePositions.Business]);
    this.per =
      totalMult *
      (0.15 * employeeProd[EmployeePositions.Engineer] +
        0.02 * employeeProd[EmployeePositions.Management] +
        0.02 * employeeProd[EmployeePositions.RandD] +
        0.02 * employeeProd[EmployeePositions.Operations] +
        0.02 * employeeProd[EmployeePositions.Business]);
    this.dur =
      totalMult *
      (0.05 * employeeProd[EmployeePositions.Engineer] +
        0.02 * employeeProd[EmployeePositions.Management] +
        0.08 * employeeProd[EmployeePositions.RandD] +
        0.05 * employeeProd[EmployeePositions.Operations] +
        0.05 * employeeProd[EmployeePositions.Business]);
    this.rel =
      totalMult *
      (0.02 * employeeProd[EmployeePositions.Engineer] +
        0.08 * employeeProd[EmployeePositions.Management] +
        0.02 * employeeProd[EmployeePositions.RandD] +
        0.05 * employeeProd[EmployeePositions.Operations] +
        0.08 * employeeProd[EmployeePositions.Business]);
    this.aes =
      totalMult *
      (0.0 * employeeProd[EmployeePositions.Engineer] +
        0.08 * employeeProd[EmployeePositions.Management] +
        0.05 * employeeProd[EmployeePositions.RandD] +
        0.02 * employeeProd[EmployeePositions.Operations] +
        0.1 * employeeProd[EmployeePositions.Business]);
    this.fea =
      totalMult *
      (0.08 * employeeProd[EmployeePositions.Engineer] +
        0.05 * employeeProd[EmployeePositions.Management] +
        0.02 * employeeProd[EmployeePositions.RandD] +
        0.05 * employeeProd[EmployeePositions.Operations] +
        0.05 * employeeProd[EmployeePositions.Business]);
    this.calculateRating(industry);
    const advMult = 1 + Math.pow(this.advCost, 0.1) / 100;
    this.mku = 100 / (advMult * Math.pow(this.qlt + 0.001, 0.65) * (busRatio + mgmtRatio));

    // I actually don't understand well enough to know if this is right.
    // I'm adding this to prevent a crash.
    if (this.mku === 0) this.mku = 1;

    this.dmd =
      industry.awareness === 0 ? 20 : Math.min(100, advMult * (100 * (industry.popularity / industry.awareness)));
    this.cmp = getRandomInt(0, 70);

    //Calculate the product's required materials
    //For now, just set it to be the same as the requirements to make materials
    for (const matName in industry.reqMats) {
      if (industry.reqMats.hasOwnProperty(matName)) {
        const reqMat = industry.reqMats[matName];
        if (reqMat === undefined) continue;
        this.reqMats[matName] = reqMat;
      }
    }

    //Calculate the product's size
    //For now, just set it to be the same size as the requirements to make materials
    this.siz = 0;
    for (const matName in industry.reqMats) {
      const reqMat = industry.reqMats[matName];
      if (reqMat === undefined) continue;
      this.siz += MaterialSizes[matName] * reqMat;
    }
  }

  calculateRating(industry: IIndustry): void {
    const weights: IProductRatingWeight = ProductRatingWeights[industry.type];
    if (weights == null) {
      console.error(`Could not find product rating weights for: ${industry}`);
      return;
    }
    this.rat = 0;
    this.rat += weights.Quality ? this.qlt * weights.Quality : 0;
    this.rat += weights.Performance ? this.per * weights.Performance : 0;
    this.rat += weights.Durability ? this.dur * weights.Durability : 0;
    this.rat += weights.Reliability ? this.rel * weights.Reliability : 0;
    this.rat += weights.Aesthetics ? this.aes * weights.Aesthetics : 0;
    this.rat += weights.Features ? this.fea * weights.Features : 0;
  }

  // Serialize the current object to a JSON save state.
  toJSON(): any {
    return Generic_toJSON("Product", this);
  }

  // Initiatizes a Product object from a JSON save state.
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Product {
    return Generic_fromJSON(Product, value.data);
  }
}

Reviver.constructors.Product = Product;
