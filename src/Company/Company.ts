import { CompanyPosition } from "./CompanyPosition";
import * as posNames from "./data/companypositionnames";

import { CONSTANTS } from "../Constants";
import { IMap } from "../types";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

export interface IConstructorParams {
    name: string;
    info: string;
    companyPositions: IMap<boolean>;
    expMultiplier: number;
    salaryMultiplier: number;
    jobStatReqOffset: number;
}

const DefaultConstructorParams: IConstructorParams = {
    name: "",
    info: "",
    companyPositions: {},
    expMultiplier: 1,
    salaryMultiplier: 1,
    jobStatReqOffset: 0,
};

export class Company {
    /**
     * Initiatizes a Company from a JSON save state.
     */
    static fromJSON(value: any): Company {
        return Generic_fromJSON(Company, value.data);
    }

    /**
     * Company name
     */
    name: string;

    /**
     * Description and general information about company
     */
    info: string;

    /**
     * Object that holds all available positions in this Company.
     * Position names are held in keys.
     * The values for the keys don't matter, but we'll make them booleans
     *
     * Must match names of Company Positions, defined in data/companypositionnames.ts
     */
    companyPositions: IMap<boolean>;

    /**
     * Company-specific multiplier for earnings
     */
    expMultiplier: number;
    salaryMultiplier: number;

    /**
     * The additional levels of stats you need to quality for a job
     * in this company.
     *
     * For example, the base stat requirement for an intern position is 1.
     * But if a company has a offset of 200, then you would need stat(s) of 201
     */
    jobStatReqOffset: number;

    /**
     * Properties to track the player's progress in this company
     */
    isPlayerEmployed: boolean;
    playerReputation: number;
    favor: number;
    rolloverRep: number;

    constructor(p: IConstructorParams = DefaultConstructorParams) {
        this.name               = p.name;
        this.info               = p.info;
        this.companyPositions   = p.companyPositions;
        this.expMultiplier      = p.expMultiplier;
        this.salaryMultiplier   = p.salaryMultiplier;
        this.jobStatReqOffset   = p.jobStatReqOffset;

        this.isPlayerEmployed = false;
        this.playerReputation = 1;
        this.favor = 0;
        this.rolloverRep = 0;
    }

    hasPosition(pos: CompanyPosition | string): boolean {
        if (pos instanceof CompanyPosition) {
            return (this.companyPositions[pos.name] != null);
        } else {
            return (this.companyPositions[pos] != null);
        }
    }

    hasAgentPositions(): boolean {
        return (this.companyPositions[posNames.AgentCompanyPositions[0]] != null);
    }

    hasBusinessConsultantPositions(): boolean {
        return (this.companyPositions[posNames.BusinessConsultantCompanyPositions[0]] != null);
    }

    hasBusinessPositions(): boolean {
        return (this.companyPositions[posNames.BusinessCompanyPositions[0]] != null);
    }

    hasEmployeePositions(): boolean {
        return (this.companyPositions[posNames.MiscCompanyPositions[1]] != null);
    }

    hasITPositions(): boolean {
        return (this.companyPositions[posNames.ITCompanyPositions[0]] != null);
    }

    hasSecurityPositions(): boolean {
        return (this.companyPositions[posNames.SecurityCompanyPositions[2]] != null);
    }

    hasSoftwareConsultantPositions(): boolean {
        return (this.companyPositions[posNames.SoftwareConsultantCompanyPositions[0]] != null);
    }

    hasSoftwarePositions(): boolean {
        return (this.companyPositions[posNames.SoftwareCompanyPositions[0]] != null);
    }

    hasWaiterPositions(): boolean {
        return (this.companyPositions[posNames.MiscCompanyPositions[0]] != null);
    }

    gainFavor(): void {
        if (this.favor == null) { this.favor = 0; }
        if (this.rolloverRep == null) { this.rolloverRep = 0; }
        const res = this.getFavorGain();
        if (res.length != 2) {
            console.error("Invalid result from getFavorGain() function");
            return;
        }

        this.favor += res[0];
        this.rolloverRep = res[1];
    }

    getFavorGain(): number[] {
        if (this.favor == null) { this.favor = 0; }
        if (this.rolloverRep == null) { this.rolloverRep = 0; }
        let favorGain = 0, rep = this.playerReputation + this.rolloverRep;
        let reqdRep = CONSTANTS.CompanyReputationToFavorBase *
                      Math.pow(CONSTANTS.CompanyReputationToFavorMult, this.favor);
        while (rep > 0) {
            if (rep >= reqdRep) {
                ++favorGain;
                rep -= reqdRep;
            } else {
                break;
            }
            reqdRep *= CONSTANTS.FactionReputationToFavorMult;
        }
        return [favorGain, rep];
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("Company", this);
    }
}

Reviver.constructors.Company = Company;
