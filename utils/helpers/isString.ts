/**
 * Checks whether the value passed in can be considered a string.
 * @param value The value to check if it is a string.
 */
export function isString(value: any): boolean {
    return (typeof value === "string" || value instanceof String);
}
