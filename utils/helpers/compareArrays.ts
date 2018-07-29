
/**
 * Does a shallow compare of two arrays to determine if they are equal.
 * @param a1 The first array
 * @param a2 The second array
 */
export function compareArrays<T>(a1: T[], a2: T[]) {
    if (a1.length !== a2.length) {
        return false;
    }

    for (let i: number = 0; i < a1.length; ++i) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }

    return true;
}
