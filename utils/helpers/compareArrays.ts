
/**
 * Does a shallow compare of two arrays to determine if they are equal.
 * @param a1 The first array
 * @param a2 The second array
 */
export function compareArrays<T>(a1: T[], a2: T[]): boolean {
    if (a1.length !== a2.length) {
        return false;
    }

    for (let i = 0; i < a1.length; ++i) {
        if (Array.isArray(a1[i])) {
            // If the other element is not an array, then these cannot be equal
            if (!Array.isArray(a2[i])) {
                return false;
            }

            const elem1 = <any[]><any>a1[i];
            const elem2 = <any[]><any>a2[i];
            if (!compareArrays(elem1, elem2)) {
                return false;
            }
        } else if (a1[i] !== a2[i]) {
            return false;
        }
    }

    return true;
}
