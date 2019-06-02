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

function checkBladeburnerAccess(workerScript, functionName) {
	const accessDenied = `${functionName}() failed because you do not ` +
						 "currently have access to the Bladeburner API. To access the Bladeburner API" +
						 "you must be employed at the Bladeburner division, AND you must either be in " +
						 "BitNode-7 or have Source-File 7.";
	const hasAccess = Player.bladeburner instanceof Bladeburner && (Player.bitNodeN === 7 || Player.sourceFiles.some(a=>{return a.n === 7}));
	if(!hasAccess) {
		throw makeRuntimeRejectMsg(workerScript, accessDenied);
	}
}

export {unknownBladeburnerActionErrorMessage, unknownBladeburnerExceptionMessage, checkBladeburnerAccess};
