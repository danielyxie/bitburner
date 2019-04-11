import { Player } from "./Player";
import { Gang } from "./Gang";
import { makeRuntimeRejectMsg } from "./NetscriptEvaluator";

export function unknownGangApiExceptionMessage(functionName, err) {
	return `gang.${functionName}() failed with exception: ` + err;
}

export function checkGangApiAccess(workerScript, functionName) {
	const accessDenied = `gang.${functionName}() failed because you do not currently have a Gang`;
	const hasAccess = Player.gang instanceof Gang;
	if (!hasAccess) {
		throw makeRuntimeRejectMsg(workerScript, accessDenied);
	}
}
