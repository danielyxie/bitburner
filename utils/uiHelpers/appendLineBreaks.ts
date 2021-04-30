import { createElement } from "./createElement";

/**
 * Appends the specified number of breaks (as children) to the specified element
 * @param el The element to add child break elements to.
 * @param n The number of breaks to add.
 */
export function appendLineBreaks(el: HTMLElement, n: number) {
    for (let i = 0; i < n; ++i) {
        el.appendChild(createElement("br"));
    }
}
