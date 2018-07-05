import { getElementById } from "./getElementById";

//
/**
 * Given its id, this function removes an element AND its children
 * @param id The HTML identifier to search for and remove.
 */
export function removeElementById(id: string) {
    try {
        const elem: HTMLElement = getElementById(id);
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }

        if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
    } catch (e) {
        // Probably should log this as we're trying to remove elements that don't exist.
    }
}
