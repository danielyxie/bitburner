/**
 * Returns the input array as a comma separated string.
 */
export function arrayToString<T>(a: T[]) {
    return `[${a.join(", ")}]`;
}
