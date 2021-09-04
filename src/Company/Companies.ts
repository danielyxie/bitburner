// Constructs all CompanyPosition objects using the metadata in data/companypositions.ts
import { companiesMetadata } from "./data/CompaniesMetadata";
import { Company, IConstructorParams } from "./Company";
import { IMap } from "../types";
import { Reviver } from "../../utils/JSONReviver";

export let Companies: IMap<Company> = {};

function addCompany(params: IConstructorParams): void {
  if (Companies[params.name] != null) {
    console.warn(`Duplicate Company Position being defined: ${params.name}`);
  }
  Companies[params.name] = new Company(params);
}

// Used to initialize new Company objects for the Companies map
// Called when creating new game or after a prestige/reset
export function initCompanies(): void {
  // Save Old Company data for 'favor'
  const oldCompanies = Companies;

  // Re-construct all Companies
  Companies = {};
  companiesMetadata.forEach((e) => {
    addCompany(e);
  });

  // Reset data
  for (const companyName in Companies) {
    const company = Companies[companyName];
    const oldCompany = oldCompanies[companyName];
    if (!(oldCompany instanceof Company)) {
      // New game, so no OldCompanies data
      company.favor = 0;
    } else {
      company.favor = oldCompanies[companyName].favor;
      if (isNaN(company.favor)) {
        company.favor = 0;
      }
    }
  }
}

// Used to load Companies map from a save
export function loadCompanies(saveString: string): void {
  Companies = JSON.parse(saveString, Reviver);
}

// Utility function to check if a string is valid company name
export function companyExists(name: string): boolean {
  return Companies.hasOwnProperty(name);
}
