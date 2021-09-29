import { getElementById } from "./getElementById";
import { removeElement } from "./removeElement";

/**
 * Given its id, this function removes an element AND its children
 * @param id The HTML identifier to search for and remove.
 */
export function removeElementById(id: string): void {
  try {
    const elem: HTMLElement = getElementById(id);
    removeElement(elem);
  } catch (e) {
    // Probably should log this as we're trying to remove elements that don't exist.
  }
}
