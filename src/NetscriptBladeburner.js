import { Player } from "./Player";
import { Bladeburner } from "./Bladeburner";
import { makeRuntimeRejectMsg } from "./NetscriptEvaluator";

function unknownBladeburnerActionErrorMessage(functionName, actionType, actionName) {
	return `ERROR: bladeburner.${functionName}() failed due to an invalid action specified. ` +
		`Type: ${actionType}, Name: ${actionName}. Note that for contracts and operations, the ` +
		`name of the operation is case-sensitive.`;
}

function unknownBladeburnerExceptionMessage(functionName, err) {
	return `bladeburner.${functionName}() failed with exception: ` + err;
}

export {unknownBladeburnerActionErrorMessage, unknownBladeburnerExceptionMessage, checkBladeburnerAccess};
