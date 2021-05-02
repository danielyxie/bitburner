// Constructs all CompanyPosition objects using the metadata in data/companypositions.ts
import { companyPositionMetadata } from "./data/CompanyPositionsMetadata";
import { CompanyPosition, IConstructorParams } from "./CompanyPosition";
import { IMap } from "../types";

export const CompanyPositions: IMap<CompanyPosition> = {};

function addCompanyPosition(params: IConstructorParams): void {
    if (CompanyPositions[params.name] != null) {
        console.warn(`Duplicate Company Position being defined: ${params.name}`);
    }
    CompanyPositions[params.name] = new CompanyPosition(params);
}

companyPositionMetadata.forEach((e) => {
    addCompanyPosition(e);
});
