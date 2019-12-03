export interface IConstructorParams {
    name: string;
    cost: number;
    desc: string;
    advertisingMult?: number;
    employeeChaMult?: number;
    employeeCreMult?: number;
    employeeEffMult?: number;
    employeeIntMult?: number;
    productionMult?: number;
    productProductionMult?: number;
    salesMult?: number;
    sciResearchMult?: number;
    storageMult?: number;
}

export class Research {
    // Name of research. This will be used to identify researches in the Research Tree
    name: string = "";

    // How much scientific research it costs to unlock this
    cost: number = 0;

    // Description of what the Research does
    desc: string = "";

    // All possible generic upgrades for the company, in the form of multipliers
    advertisingMult: number = 1;
    employeeChaMult: number = 1;
    employeeCreMult: number = 1;
    employeeEffMult: number = 1;
    employeeIntMult: number = 1;
    productionMult: number = 1;
    productProductionMult: number = 1;
    salesMult: number = 1;
    sciResearchMult: number = 1;
    storageMult: number = 1;

    constructor(p: IConstructorParams= {name: "", cost: 0, desc: ""}) {
        this.name = p.name;
        this.cost = p.cost;
        this.desc = p.desc;
        if (p.advertisingMult)          { this.advertisingMult = p.advertisingMult; }
        if (p.employeeChaMult)          { this.employeeChaMult = p.employeeChaMult; }
        if (p.employeeCreMult)          { this.employeeCreMult = p.employeeCreMult; }
        if (p.employeeEffMult)          { this.employeeEffMult = p.employeeEffMult; }
        if (p.employeeIntMult)          { this.employeeIntMult = p.employeeIntMult; }
        if (p.productionMult)           { this.productionMult = p.productionMult; }
        if (p.productProductionMult)    { this.productProductionMult = p.productProductionMult; }
        if (p.salesMult)                { this.salesMult = p.salesMult; }
        if (p.sciResearchMult)          { this.sciResearchMult = p.sciResearchMult; }
        if (p.storageMult)              { this.storageMult = p.storageMult; }
    }
}
