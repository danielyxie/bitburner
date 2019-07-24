// Constructs all CompanyPosition objects using the metadata in data/companypositions.ts
import { IMap } from "../types";
import { CompanyPosition, IConstructorParams } from "./CompanyPosition";
import { companyPositionMetadata } from "./data/CompanyPositionsMetadata";

export const CompanyPositions: IMap<CompanyPosition> = {};

function addCompanyPosition(params: IConstructorParams) {
    if (CompanyPositions[params.name] != null) {
        console.warn(`Duplicate Company Position being defined: ${params.name}`);
    }
    CompanyPositions[params.name] = new CompanyPosition(params);
}

companyPositionMetadata.forEach((e) => {
    addCompanyPosition(e);
});
