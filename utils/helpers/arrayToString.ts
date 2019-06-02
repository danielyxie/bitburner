/**
 * Returns the input array as a comma separated string.
 *
 * Does several things that Array.toString() doesn't do
 *  - Adds brackets around the array
 *  - Adds quotation marks around strings
 */
export function arrayToString<T>(a: T[]) {
    const vals: any[] = [];
    for (let i = 0; i < a.length; ++i) {
        let elem: any = a[i];
        if (Array.isArray(elem)) {
            elem = arrayToString(elem);
        } else if (typeof elem === "string") {
            elem = `"${elem}"`;
        }
        vals.push(elem);
    }

    return `[${vals.join(", ")}]`;
}
