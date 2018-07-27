/**
 * For a given element, this function removes it AND its children
 * @param elem The element to remove.
 */
export function removeElement(elem: Element | null) {
    if (elem === null) {
        // tslint:disable-next-line:no-console
        console.debug("The element passed into 'removeElement' was null.");

        return;
    }
    if (!(elem instanceof Element)) {
        // tslint:disable-next-line:no-console
        console.debug("The element passed into 'removeElement' was not an instance of an Element.");

        return;
    }

    while (elem.firstChild !== null) {
        elem.removeChild(elem.firstChild);
    }

    if (elem.parentNode !== null) {
        elem.parentNode.removeChild(elem);
    }
}
