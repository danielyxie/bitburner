// Constructs all CompanyPosition objects using the metadata in data/companypositions.ts
import { companiesMetadata }            from "./data/CompaniesMetadata";
import { Company, IConstructorParams }  from "./Company";
import { IMap }                         from "../types";
import { Reviver }                      from "../../utils/JSONReviver";

export let Companies: IMap<Company> = {};

function addCompany(params: IConstructorParams) {
    if (Companies[params.name] != null) {
        console.warn(`Duplicate Company Position being defined: ${params.name}`);
    }
    Companies[params.name] = new Company(params);
}

// Used to initialize new Company objects for the Companies map
// Called when creating new game or after a prestige/reset
export function initCompanies() {
    companiesMetadata.forEach((e) => {
        addCompany(e);
    });
}

// Used to load Companies map from a save
export function loadCompanies(saveString: string) {
    Companies = JSON.parse(saveString, Reviver);
}

// Utility function to check if a string is valid company name
export function companyExists(name: string) {
    return Companies.hasOwnProperty(name);
}
