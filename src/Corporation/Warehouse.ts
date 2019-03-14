import { Material }                 from "./Material";
import { MaterialSizes }            from "./MaterialSizes";
import { IMap }                     from "../types";
import { numeralWrapper }           from "../ui/numeralFormat";
import { Generic_fromJSON,
         Generic_toJSON,
         Reviver }                  from "../../utils/JSONReviver";

interface IConstructorParams {
    loc?: string;
    size?: number;
}

interface IParent {
    getStorageMultiplier(): number;
}

export class Warehouse {
    // Initiatizes a Warehouse object from a JSON save state.
    static fromJSON(value: any): Warehouse {
        return Generic_fromJSON(Warehouse, value.data);
    }

    // Text that describes how the space in this Warehouse is being used
    // Used to create a tooltip in the UI
    breakdown: string = "";

    // Warehouse's level, which affects its maximum size
    level: number = 1;

    // City that this Warehouse is in
    loc: string;

    // Map of Materials held by this Warehouse
    materials: IMap<Material>;

    // Maximum amount warehouse can hold
    size: number;

    // Amount of space currently used by warehouse
    sizeUsed: number = 0;

    // Whether Smart Supply is enabled for this Industry (the Industry that this Warehouse is for)
    smartSupplyEnabled: boolean = false;

    // Stores the amount of product to be produced. Used for Smart Supply unlock.
    // The production tracked by smart supply is always based on the previous cycle,
    // so it will always trail the "true" production by 1 cycle
    smartSupplyStore: number = 0;

    constructor(params: IConstructorParams = {}) {
        this.loc    = params.loc        ? params.loc    : "";
        this.size   = params.size       ? params.size   : 0;

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

    // Re-calculate how much space is being used by this Warehouse
    updateMaterialSizeUsed() {
        this.sizeUsed = 0;
        this.breakdown = "";
        for (const matName in this.materials) {
            var mat = this.materials[matName];
            if (MaterialSizes.hasOwnProperty(matName)) {
                this.sizeUsed += (mat.qty * MaterialSizes[matName]);
                if (mat.qty > 0) {
                    this.breakdown += (matName + ": " + numeralWrapper.format(mat.qty * MaterialSizes[matName], "0,0") + "<br>");
                }
            }
        }
        if (this.sizeUsed > this.size) {
            console.warn("Warehouse size used greater than capacity, something went wrong");
        }
    }

    updateSize(corporation: IParent, industry: IParent) {
        this.size = (this.level * 100)
                  * corporation.getStorageMultiplier()
                  * industry.getStorageMultiplier();
    }

    // Serialize the current object to a JSON save state.
    toJSON(): any {
        return Generic_toJSON("Warehouse", this);
    }
}

Reviver.constructors.Warehouse = Warehouse;
