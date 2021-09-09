import { isString } from "../helpers/isString";
import { getElementById } from "./getElementById";

/**
 * Clears out all children from the provided element.
 * If a string is passed in, it will treat it as an ID and search for the element to delete all children from.
 * @param el The element or ID of an element to remove all children from.
 */
export function removeChildrenFromElement(el: string | null | Element): void {
  if (el === null) {
    return;
  }

  try {
    const elem: HTMLElement | Element = isString(el) ? getElementById(el as string) : (el as Element);

    if (elem instanceof Element) {
      while (elem.firstChild !== null) {
        elem.removeChild(elem.firstChild);
      }
    }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.debug(e);

    return;
  }
}
