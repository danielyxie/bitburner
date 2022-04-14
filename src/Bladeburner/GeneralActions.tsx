import type { IMap } from "../types";

import { Action } from "./Action";

export const GeneralActions: IMap<Action> = {};

const actionNames: Array<string> = [
  "Training",
  "Field Analysis",
  "Recruitment",
  "Diplomacy",
  "Hyperbolic Regeneration Chamber",
  "Incite Violence",
];

for (const actionName of actionNames) {
  GeneralActions[actionName] = new Action({
    name: actionName,
  });
}
