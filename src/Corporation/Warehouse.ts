import { Material } from "./Material";
import { Corporation } from "./Corporation";
import { Industry } from "./Industry";
import { MaterialInfo } from "./MaterialInfo";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";
import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { CityName } from "../Enums";
import { CorpMaterialName } from "@nsdefs";
import { materialNames } from "./data/Constants";

interface IConstructorParams {
  corp?: Corporation;
  industry?: Industry;
  loc?: CityName;
  size?: number;
}

export class Warehouse {
  // Warehouse's level, which affects its maximum size
  level = 1;

  // City that this Warehouse is in
  loc: CityName;

  // Map of Materials held by this Warehouse
  materials: Record<CorpMaterialName, Material>;

  // Maximum amount warehouse can hold
  size: number;

  // Amount of space currently used by warehouse
  sizeUsed = 0;

  // Whether Smart Supply is enabled for this Industry (the Industry that this Warehouse is for)
  smartSupplyEnabled = false;

  // Decide if smart supply should use the materials already in the warehouse when deciding on the amount to buy.
  smartSupplyUseLeftovers: Record<CorpMaterialName, boolean>;

  // Stores the amount of product to be produced. Used for Smart Supply unlock.
  // The production tracked by smart supply is always based on the previous cycle,
  // so it will always trail the "true" production by 1 cycle
  smartSupplyStore = 0;

  constructor(params: IConstructorParams = {}) {
    this.loc = params.loc ? params.loc : CityName.Sector12;
    this.size = params.size ? params.size : 0;

    this.materials = {} as Record<CorpMaterialName, Material>;
    this.smartSupplyUseLeftovers = {} as Record<CorpMaterialName, boolean>;
    for (const matName of materialNames) {
      this.materials[matName] = new Material({ name: matName });
      this.smartSupplyUseLeftovers[matName] = true;
    }

    if (params.corp && params.industry) {
      this.updateSize(params.corp, params.industry);
    }

    // Default smart supply to being enabled if the upgrade is unlocked
    if (params.corp?.unlockUpgrades[1]) {
      this.smartSupplyEnabled = true;
    }
  }

  // Re-calculate how much space is being used by this Warehouse
  updateMaterialSizeUsed(): void {
    this.sizeUsed = 0;
    for (const matName of Object.values(materialNames)) {
      const mat = this.materials[matName];
      this.sizeUsed += mat.qty * MaterialInfo[matName].size;
    }
    if (this.sizeUsed > this.size) {
      console.warn("Warehouse size used greater than capacity, something went wrong");
    }
  }

  updateSize(corporation: Corporation, industry: Industry): void {
    try {
      this.size = this.level * 100 * corporation.getStorageMultiplier() * industry.getStorageMultiplier();
    } catch (e: unknown) {
      exceptionAlert(e);
    }
  }

  // Serialize the current object to a JSON save state.
  toJSON(): IReviverValue {
    return Generic_toJSON("Warehouse", this);
  }

  // Initializes a Warehouse object from a JSON save state.
  static fromJSON(value: IReviverValue): Warehouse {
    //Gracefully load saves where AICores and RealEstate material names sometimes did not use spaces
    if (value.data?.materials?.AICores) {
      value.data.materials["AI Cores"] = value.data.materials.AICores;
      value.data.smartSupplyUseLeftovers["AI Cores"] = value.data.smartSupplyUseLeftovers.AICores;
      delete value.data.materials.AICores;
      delete value.data.smartSupplyUseLeftovers.AICores;
    }
    if (value.data?.materials?.RealEstate) {
      value.data.materials["Real Estate"] = value.data.materials.RealEstate;
      value.data.smartSupplyUseLeftovers["Real Estate"] = value.data.smartSupplyUseLeftovers.RealEstate;
      delete value.data.materials.RealEstate;
      delete value.data.smartSupplyUseLeftovers.RealEstate;
    }
    return Generic_fromJSON(Warehouse, value.data);
  }
}

Reviver.constructors.Warehouse = Warehouse;
