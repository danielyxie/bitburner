import { Action } from "./Action";

export const GeneralActions: Record<string, Action> = {};

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
