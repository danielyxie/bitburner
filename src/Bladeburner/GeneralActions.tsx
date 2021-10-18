import { Action } from "./Action";
import { IMap } from "../types";

export const GeneralActions: IMap<Action> = {};

let actionNames : Array<string> = [
    "Training",
    "Field Analysis",
    "Recruitment",
    "Diplomacy",
    "Hyperbolic Regeneration Chamber",
    "Incite Violence"
];
for (let actionName of actionNames){
    GeneralActions[actionName] = new Action({
        name: actionName,
    });
}
