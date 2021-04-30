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
    name = "";

    // How much scientific research it costs to unlock this
    cost = 0;

    // Description of what the Research does
    desc = "";

    // All possible generic upgrades for the company, in the form of multipliers
    advertisingMult = 1;
    employeeChaMult = 1;
    employeeCreMult = 1;
    employeeEffMult = 1;
    employeeIntMult = 1;
    productionMult = 1;
    productProductionMult = 1;
    salesMult = 1;
    sciResearchMult = 1;
    storageMult = 1;

    constructor(p: IConstructorParams={name: "", cost: 0, desc: ""}) {
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
