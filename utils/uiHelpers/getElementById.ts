/**
 * Returns a reference to the first object with the specified value of the ID or NAME attribute,
 * throwing an error if it is unable to find it.
 * @param elementId The HTML ID to retrieve the element by.
 * @throws {Error} When the 'elementId' cannot be found.
 */
export function getElementById(elementId: string) {
    const el: HTMLElement | null = document.getElementById(elementId);
    if (el === null) {
        throw new Error(`Unable to find element with id '${elementId}'`);
    }

    return el;
}
