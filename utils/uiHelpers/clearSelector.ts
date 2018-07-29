/**
 * Clears all <option> elements from a <select>.
 * @param selector The <select> element
 */
export function clearSelector(selector: HTMLSelectElement) {
    for (let i: number = selector.options.length - 1; i >= 0; i--) {
        selector.remove(i);
    }
}
