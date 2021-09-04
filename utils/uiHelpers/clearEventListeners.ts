import { getElementById } from "./getElementById";

/**
 * Given an element by its ID, removes all event listeners from that element by cloning and
 * replacing. Then returns the new cloned element.
 * @param elemId The HTML ID to retrieve the element by.
 */
export function clearEventListeners(
  elemId: string | HTMLElement,
): HTMLElement | null {
  try {
    let elem: HTMLElement;
    if (typeof elemId === "string") {
      elem = getElementById(elemId);
    } else {
      elem = elemId;
    }

    const newElem: HTMLElement = elem.cloneNode(true) as HTMLElement;
    if (elem.parentNode !== null) {
      elem.parentNode.replaceChild(newElem, elem);
    }

    return newElem;
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);

    return null;
  }
}
