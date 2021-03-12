import { Player } from "./Player";
import { Gang } from "./Gang";
import { makeRuntimeRejectMsg } from "./NetscriptEvaluator";

export function unknownGangApiExceptionMessage(functionName, err) {
	return `gang.${functionName}() failed with exception: ` + err;
}

