import { CONSTANTS } from "../../Constants";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
export const changelog = () => dialogBoxCreate("Most recent changelog info:\n\n" + CONSTANTS.LatestUpdate);
