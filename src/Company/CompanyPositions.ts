// Constructs all CompanyPosition objects using the metadata in data/companypositions.ts
import { companyPositionMetadata } from "./data/CompanyPositionsMetadata";
import { CompanyPosition, IConstructorParams } from "./CompanyPosition";

export const CompanyPositions: Record<string, CompanyPosition> = {};

function addCompanyPosition(params: IConstructorParams): void {
  if (CompanyPositions[params.name] != null) {
    console.warn(`Duplicate Company Position being defined: ${params.name}`);
  }
  CompanyPositions[params.name] = new CompanyPosition(params);
}

companyPositionMetadata.forEach((e) => {
  addCompanyPosition(e);
});
