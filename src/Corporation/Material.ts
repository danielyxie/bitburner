import { CorpMaterialName } from "@nsdefs";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";
import { materialNames } from "./data/Constants";
import { Export } from "./Export";
import { MaterialInfo } from "./MaterialInfo";

interface IConstructorParams {
  name: CorpMaterialName;
}

export class Material {
  // Name of material
  name: CorpMaterialName;

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

  // Determines the maximum amount of this material that can be sold in one market cycle
  maxsll = 0;

  constructor(params?: IConstructorParams) {
    this.name = params?.name ?? materialNames[0];
    this.dmd = MaterialInfo[this.name].demandBase;
    this.dmdR = MaterialInfo[this.name].demandRange;
    this.cmp = MaterialInfo[this.name].competitionBase;
    this.cmpR = MaterialInfo[this.name].competitionRange;
    this.bCost = MaterialInfo[this.name].baseCost;
    this.mv = MaterialInfo[this.name].maxVolatility;
    this.mku = MaterialInfo[this.name].baseMarkup;
  }

  getMarkupLimit(): number {
    return this.qlt / this.mku;
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

  // Serialize the current object to a JSON save state.
  toJSON(): IReviverValue {
    return Generic_toJSON("Material", this);
  }

  // Initializes a Material object from a JSON save state.
  static fromJSON(value: IReviverValue): Material {
    // Gracefully load save files from when Scientific Research was considered a Material (pre 2.2).
    if (value.data.name === "Scientific Research") return value.data.qty;
    return Generic_fromJSON(Material, value.data);
  }
}

Reviver.constructors.Material = Material;
