import React from "react";
import { Action } from "./Action";
import { IMap } from "../types";

export const GeneralActions: IMap<Action> = {};

(function () {
  // General Actions
  let actionName;
  actionName = "Training";
  GeneralActions[actionName] = new Action({
    name: actionName,
  });

  actionName = "Field Analysis";
  GeneralActions[actionName] = new Action({
    name: actionName,
  });

  actionName = "Recruitment";
  GeneralActions[actionName] = new Action({
    name: actionName,
  });

  actionName = "Diplomacy";
  GeneralActions[actionName] = new Action({
    name: actionName,
  });

  actionName = "Hyperbolic Regeneration Chamber";
  GeneralActions[actionName] = new Action({
    name: actionName,
  });
})();
