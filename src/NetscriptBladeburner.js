export function unknownBladeburnerActionErrorMessage(functionName, actionType, actionName) {
	return `ERROR: bladeburner.${functionName}() failed due to an invalid action specified. ` +
		`Type: ${actionType}, Name: ${actionName}. Note that for contracts and operations, the ` +
		`name of the operation is case-sensitive.`;
}

export function unknownBladeburnerExceptionMessage(functionName, err) {
	return `bladeburner.${functionName}() failed with exception: ` + err;
}