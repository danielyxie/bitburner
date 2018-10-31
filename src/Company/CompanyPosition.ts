import { Generic_fromJSON, Generic_toJSON, Reviver } from "/utils/JSONReviver";
import { CONSTANTS } from "/src/Constants";
import * as names from "/src/Company/data/companypositionname";

/* tslint:disable:completed-docs */

interface ConstructorParams {
    name: string,
    baseSalary: number,
    repMultiplier: number;

    reqdHacking?: number;
    reqdStrength?: number;
    reqdDefense?: number;
    reqdDexterity?: number;
    reqdAgility?: number;
    reqdCharisma?: number;
    reqdReputation?: number;

    hackingEffectiveness?: number;
    strengthEffectiveness?: number;
    defenseEffectiveness?: number;
    dexterityEffectiveness?: number;
    agilityEffectiveness?: number;
    charismaEffectiveness?: number;

    hackingExpGain?: number;
    strengthExpGain?: number;
    defenseExpGain?: number;
    dexterityExpGain?: number;
    agilityExpGain?: number;
    charismaExpGain?: number;
}

export class CompanyPosition {
    /**
     * Initializes a CompanyPosition object from a JSON save state
     */
    static fromJSON(value: any): CompanyPosition {
        return Generic_fromJSON(CompanyPosition, value.data);
    }

    /**
     * Position title
     */
    positionName: string;

    /**
     * Base salary for this position ($ per 200ms game cycle)
     * Will be multiplier by a company-specific multiplier for final salary
     */
    baseSalary: number;

    /**
     * Reputation multiplier
     */
    positionMultiplier: number;

    /**
     * Required stats to earn this position
     */
    requiredAgility: number;
    requiredCharisma: number;
    requiredDefense: number;
    requiredDexterity: number;
    requiredHacking: number;
    requiredStrength: number;

    /**
     * Required company reputation to earn this position
     */
    requiredReputation: number;

    /**
     * Effectiveness of each stat time for job performance
     */
    hackingEffectiveness: number;
    strengthEffectiveness: number;
    defenseEffectiveness: number;
    dexterityEffectiveness: number;
    agilityEffectiveness: number;
    charismaEffectiveness: number;

    /**
     * Experience gain for performing job (per 200ms game cycle)
     */
    hackingExpGain: number;
    strengthExpGain: number;
    defenseExpGain: number;
    dexterityExpGain: number;
    agilityExpGain: number;
    charismaExpGain: number;

    constructor(p: ConstructorParams) {
        this.name               = p.name;
        this.baseSalary         = p.baseSalary;
        this.repMultiplier      = p.repMultiplier;

        this.reqdHacking    = (p.reqdHacking != null)    ?  p.reqdHacking    : 0;
        this.reqdStrength   = (p.reqdStrength != null)   ?  p.reqdStrength   : 0;
        this.reqdDefense    = (p.reqdDefense != null)    ?  p.reqdDefense    : 0;
        this.reqdDexterity  = (p.reqdDexterity != null)  ?  p.reqdDexterity  : 0;
        this.reqdAgility    = (p.reqdAgility != null)    ?  p.reqdAgility    : 0;
        this.reqdCharisma   = (p.reqdCharisma != null)   ?  p.reqdCharisma   : 0;
        this.reqdReputation = (p.reqdReputation != null) ?  p.reqdReputation : 0;

        this.hackingEffectiveness   = (p.hackingEffectiveness != null)      ?  p.hackingEffectiveness   : 0;
        this.strengthEffectiveness  = (p.strengthEffectiveness != null)     ?  p.strengthEffectiveness  : 0;
        this.defenseEffectiveness   = (p.defenseEffectiveness != null)      ?  p.defenseEffectiveness   : 0;
        this.dexterityEffectiveness = (p.dexterityEffectiveness != null)    ?  p.dexterityEffectiveness : 0;
        this.agilityEffectiveness   = (p.agilityEffectiveness != null)      ?  p.agilityEffectiveness   : 0;
        this.charismaEffectiveness  = (p.charismaEffectiveness != null)     ?  p.charismaEffectiveness  : 0;

        if (Math.round(this.hackingEffectiveness + this.strengthEffectiveness + this.defenseEffectiveness +
            this.dexterityEffectiveness + this.agilityEffectiveness + this.charismaEffectiveness) !== 100) {
            console.error(`CompanyPosition ${this.name} parameters do not sum to 100`);
        }

        this.hackingExpGain     = (p.hackingExpGain != null)    ? p.hackingExpGain      : 0;
        this.strengthExpGain    = (p.strengthExpGain != null)   ? p.strengthExpGain     : 0;
        this.defenseExpGain     = (p.defenseExpGain != null)    ? p.defenseExpGain      : 0;
        this.dexterityExpGain   = (p.dexterityExpGain != null)  ? p.dexterityExpGain    : 0;
        this.agilityExpGain     = (p.agilityExpGain != null)    ? p.agilityExpGain      : 0;
        this.charismaExpGain    = (p.charismaExpGain != null)   ? p.charismaExpGain     : 0;
    }

    calculateJobPerformance(hack: number, str: number, def: number, dex: number, agi: number, cha: number): number {
        const hackRatio: number = this.hackingEffectiveness   * hack / CONSTANTS.MaxSkillLevel;
        const strRatio: number  = this.strengthEffectiveness  * str  / CONSTANTS.MaxSkillLevel;
        const defRatio: number  = this.defenseEffectiveness   * def  / CONSTANTS.MaxSkillLevel;
        const dexRatio: number  = this.dexterityEffectiveness * dex  / CONSTANTS.MaxSkillLevel;
        const agiRatio: number  = this.agilityEffectiveness   * agi  / CONSTANTS.MaxSkillLevel;
        const chaRatio: number  = this.charismaEffectiveness  * cha  / CONSTANTS.MaxSkillLevel;

        let reputationGain: number = this.positionMultiplier * (hackRatio + strRatio + defRatio + dexRatio + agiRatio + chaRatio) / 100;
        if (isNaN(reputationGain)) {
            console.error("Company reputation gain calculated to be NaN");
            reputationGain = 0;
        }

        return reputationGain;
    }

    isSoftwareJob(): boolean {
        return names.SoftwareCompanyPositions.includes(this.name);
    }

    isITJob(): boolean {
        return names.ITCompanyPositions.includes(this.name);
    }

    isSecurityEngineerJob(): boolean {
        return names.SecurityEngineerCompanyPositions.includes(this.name);
    }

    isNetworkEngineerJob(): boolean {
        return names.NetworkEngineerCompanyPositions.includes(this.name);
    }

    isBusinessJob(): boolean {
        return names.BusinessCompanyPositions.includes(this.name);
    }

    isSecurityJob(): boolean {
        return names.SecurityCompanyPositions.includes(this.name);
    }

    isAgentJob(): boolean {
        return names.AgentCompanyPositions.includes(this.name);
    }

    isSoftwareConsultantJob(): boolean {
        return names.SoftwareConsultantCompanyPositions.includes(this.name);
    }

    isBusinessConsultantJob(): boolean {
        return names.BusinessConsultantCompanyPositions.includes(this.name);
    }

    isPartTimeJob(): boolean {
        return names.PartTimeCompanyPositions.includes(this.name);
    }

    /**
     * Serialize the current file to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("CompanyPosition", this);
    }
}

Reviver.constructors.CompanyPosition = CompanyPosition;
