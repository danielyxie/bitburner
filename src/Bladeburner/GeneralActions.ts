import { Action } from "./Action";
import { IMap } from "../types";

export const GeneralActions: IMap<Action> = {};

(function() {
    // General Actions
    let actionName;
    actionName = "Training";
    GeneralActions[actionName] = new Action({
        name:actionName,
        desc:"Improve your abilities at the Bladeburner unit's specialized training " +
             "center. Doing this gives experience for all combat stats and also " +
             "increases your max stamina.",
    });

    actionName = "Field Analysis";
    GeneralActions[actionName] = new Action({
        name:actionName,
        desc:"Mine and analyze Synthoid-related data. This improves the " +
             "Bladeburner's unit intelligence on Synthoid locations and " +
             "activities. Completing this action will improve the accuracy " +
             "of your Synthoid population estimated in the current city.<br><br>" +
             "Does NOT require stamina.",
    });

    actionName = "Recruitment";
    GeneralActions[actionName] = new Action({
        name:actionName,
        desc:"Attempt to recruit members for your Bladeburner team. These members " +
             "can help you conduct operations.<br><br>" +
             "Does NOT require stamina.",
    });

    actionName = "Diplomacy";
    GeneralActions[actionName] = new Action({
        name: actionName,
        desc: "Improve diplomatic relations with the Synthoid population. " +
              "Completing this action will reduce the Chaos level in your current city.<br><br>" +
              "Does NOT require stamina.",
    });

    actionName = "Hyperbolic Regeneration Chamber";
    GeneralActions[actionName] = new Action({
        name: actionName,
        desc: "Enter cryogenic stasis using the Bladeburner division's hi-tech Regeneration Chamber. " +
              "This will slowly heal your wounds and slightly increase your stamina.<br><br>",
    });
})()
