import {Player}                 from "./Player";
import {Gang}                   from "./Gang";
import {makeRuntimeRejectMsg}   from "./NetscriptEvaluator";

function unknownGangApiExceptionMessage(functionName, err) {
	return `gang.${functionName}() failed with exception: ` + err;
}

function checkGangApiAccess(workerScript, functionName) {
	const accessDenied = `gang.${functionName}() failed because you do not currently have a Gang`;
	const hasAccess = Player.gang instanceof Gang;
	if (!hasAccess) {
		throw makeRuntimeRejectMsg(workerScript, accessDenied);
	}
}

export {unknownBladeburnerActionErrorMessage, unknownBladeburnerExceptionMessage, checkBladeburnerAccess};
