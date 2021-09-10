import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
import { Export } from "./Export";

interface IConstructorParams {
  name?: string;
}

export class Material {
  // Name of material
  name = "InitName";

  // Amount of material owned
  qty = 0;

  // Material's "quality". Unbounded
  qlt = 0;

  // How much demand the Material has in the market, and the range of possible
  // values for this "demand"
  dmd = 0;
  dmdR: number[] = [0, 0];

  // How much competition there is for this Material in the market, and the range
  // of possible values for this "competition"
  cmp = 0;
  cmpR: number[] = [0, 0];

  // Maximum volatility of this Materials stats
  mv = 0;

  // Markup. Determines how high of a price you can charge on the material
  // compared to the market price without suffering loss in # of sales
  // Quality is divided by this to determine markup limits
  // e,g, If mku is 10 and quality is 100 then you can markup prices by 100/10 = 10
  mku = 0;

  // How much of this material is being bought, sold, imported and produced every second
  buy = 0;
  sll = 0;
  prd = 0;
  imp = 0;

  // Exports of this material to another warehouse/industry
  exp: Export[] = [];

  // Total amount of this material exported in the last cycle
  totalExp = 0;

  // Cost / sec to buy this material. AKA Market Price
  bCost = 0;

  // Cost / sec to sell this material
  sCost: string | number = 0;

  // Flags to keep track of whether production and/or sale of this material is limited
  // [Whether production/sale is limited, limit amount]
  prdman: [boolean, number] = [false, 0]; // Production
  sllman: [boolean, string | number] = [false, 0]; // Sale

  // Flags that signal whether automatic sale pricing through Market TA is enabled
  marketTa1 = false;
  marketTa2 = false;
  marketTa2Price = 0;

  constructor(params: IConstructorParams = {}) {
    if (params.name) {
      this.name = params.name;
    }
    this.init();
  }

  getMarkupLimit(): number {
    return this.qlt / this.mku;
  }

  init(): void {
    switch (this.name) {
      case "Water":
        this.dmd = 75;
        this.dmdR = [65, 85];
        this.cmp = 50;
        this.cmpR = [40, 60];
        this.bCost = 1500;
        this.mv = 0.2;
        this.mku = 6;
        break;
      case "Energy":
        this.dmd = 90;
        this.dmdR = [80, 99];
        this.cmp = 80;
        this.cmpR = [65, 95];
        this.bCost = 2000;
        this.mv = 0.2;
        this.mku = 6;
        break;
      case "Food":
        this.dmd = 80;
        this.dmdR = [70, 90];
        this.cmp = 60;
        this.cmpR = [35, 85];
        this.bCost = 5000;
        this.mv = 1;
        this.mku = 3;
        break;
      case "Plants":
        this.dmd = 70;
        this.dmdR = [20, 90];
        this.cmp = 50;
        this.cmpR = [30, 70];
        this.bCost = 3000;
        this.mv = 0.6;
        this.mku = 3.75;
        break;
      case "Metal":
        this.dmd = 80;
        this.dmdR = [75, 85];
        this.cmp = 70;
        this.cmpR = [60, 80];
        this.bCost = 2650;
        this.mv = 1;
        this.mku = 6;
        break;
      case "Hardware":
        this.dmd = 85;
        this.dmdR = [80, 90];
        this.cmp = 80;
        this.cmpR = [65, 95];
        this.bCost = 8e3;
        this.mv = 0.5; //Less mv bc its processed twice
        this.mku = 1;
        break;
      case "Chemicals":
        this.dmd = 55;
        this.dmdR = [40, 70];
        this.cmp = 60;
        this.cmpR = [40, 80];
        this.bCost = 9e3;
        this.mv = 1.2;
        this.mku = 2;
        break;
      case "Real Estate":
        this.dmd = 50;
        this.dmdR = [5, 99];
        this.cmp = 50;
        this.cmpR = [25, 75];
        this.bCost = 80e3;
        this.mv = 1.5; //Less mv bc its processed twice
        this.mku = 1.5;
        break;
      case "Drugs":
        this.dmd = 60;
        this.dmdR = [45, 75];
        this.cmp = 70;
        this.cmpR = [40, 99];
        this.bCost = 40e3;
        this.mv = 1.6;
        this.mku = 1;
        break;
      case "Robots":
        this.dmd = 90;
        this.dmdR = [80, 9];
        this.cmp = 90;
        this.cmpR = [80, 9];
        this.bCost = 75e3;
        this.mv = 0.5; //Less mv bc its processed twice
        this.mku = 1;
        break;
      case "AI Cores":
        this.dmd = 90;
        this.dmdR = [80, 99];
        this.cmp = 90;
        this.cmpR = [80, 9];
        this.bCost = 15e3;
        this.mv = 0.8; //Less mv bc its processed twice
        this.mku = 0.5;
        break;
      case "Scientific Research":
      case "InitName":
        break;
      default:
        console.error(`Invalid material type in init(): ${this.name}`);
        break;
    }
  }

  // Process change in demand, competition, and buy cost of this material
  processMarket(): void {
    // The price will change in accordance with demand and competition.
    // e.g. If demand goes up, then so does price. If competition goes up, price goes down
    const priceVolatility: number = (Math.random() * this.mv) / 300;
    const priceChange: number = 1 + priceVolatility;

    //This 1st random check determines whether competition increases or decreases
    const compVolatility: number = (Math.random() * this.mv) / 100;
    const compChange: number = 1 + compVolatility;
    if (Math.random() < 0.5) {
      this.cmp *= compChange;
      if (this.cmp > this.cmpR[1]) {
        this.cmp = this.cmpR[1];
      }
      this.bCost *= 1 / priceChange; // Competition increases, so price goes down
    } else {
      this.cmp *= 1 / compChange;
      if (this.cmp < this.cmpR[0]) {
        this.cmp = this.cmpR[0];
      }
      this.bCost *= priceChange; // Competition decreases, so price goes up
    }

    // This 2nd random check determines whether demand increases or decreases
    const dmdVolatility: number = (Math.random() * this.mv) / 100;
    const dmdChange: number = 1 + dmdVolatility;
    if (Math.random() < 0.5) {
      this.dmd *= dmdChange;
      if (this.dmd > this.dmdR[1]) {
        this.dmd = this.dmdR[1];
      }
      this.bCost *= priceChange; // Demand increases, so price goes up
    } else {
      this.dmd *= 1 / dmdChange;
      if (this.dmd < this.dmdR[0]) {
        this.dmd = this.dmdR[0];
      }
      this.bCost *= 1 / priceChange;
    }
  }

  copy(): Material {
    const material = new Material();
    material.name = this.name;
    material.qty = this.qty;
    material.qlt = this.qlt;
    material.dmd = this.dmd;

    material.cmp = this.cmp;

    material.mv = this.mv;
    material.mku = this.mku;
    material.buy = this.buy;
    material.sll = this.sll;
    material.prd = this.prd;
    material.imp = this.imp;
    material.totalExp = this.totalExp;
    material.bCost = this.bCost;
    material.marketTa1 = this.marketTa1;
    material.marketTa2 = this.marketTa2;
    material.marketTa2Price = this.marketTa2Price;
    material.sCost = this.sCost;
    material.prdman = [this.prdman[0], this.prdman[1]];
    material.sllman = [this.sllman[0], this.sllman[1]];

    material.dmdR = this.dmdR.slice();
    material.cmpR = this.cmpR.slice();
    material.exp = this.exp.slice().map((e) => {
      return { ind: e.ind, city: e.city, amt: e.amt };
    });
    return material;
  }

  // Serialize the current object to a JSON save state.
  toJSON(): any {
    return Generic_toJSON("Material", this);
  }

  // Initiatizes a Material object from a JSON save state.
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Material {
    return Generic_fromJSON(Material, value.data);
  }
}

Reviver.constructors.Material = Material;
