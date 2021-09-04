// Function that returns the next Company Position in the "ladder"
// i.e. the next position to get promoted to
import { CompanyPosition } from "./CompanyPosition";
import { CompanyPositions } from "./CompanyPositions";

export function getNextCompanyPositionHelper(
  currPos: CompanyPosition | null,
): CompanyPosition | null {
  if (currPos == null) {
    return null;
  }

  const nextPosName: string | null = currPos.nextPosition;
  if (nextPosName == null) {
    return null;
  }

  return CompanyPositions[nextPosName];
}
