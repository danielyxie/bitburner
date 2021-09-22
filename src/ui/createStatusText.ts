import { setTimeoutRef } from "../utils/SetTimeoutRef";
import { getElementById } from "../../utils/uiHelpers/getElementById";
import { Action } from "../types";

const threeSeconds = 3000;
let x: number | undefined;

/**
 * Displays a status message to the player for approximately 3 seconds.
 * @param text The status text to display
 */
export function createStatusText(text: string): void {
  const statusElement: HTMLElement = getElementById("status-text");
  const handler: Action = () => {
    statusElement.innerText = "";
    statusElement.style.display = "none";
    statusElement.classList.remove("status-text");
  };

  if (x !== undefined) {
    clearTimeout(x);
    // Likely not needed due to clearTimeout, but just in case...
    x = undefined;
    // reset the element's animation
    statusElement.style.animation = "none";
    setTimeout(function () {
      statusElement.style.animation = "";
    }, 10);
  }

  statusElement.style.display = "block";
  statusElement.classList.add("status-text");
  statusElement.innerText = text;

  x = setTimeoutRef(handler, threeSeconds);
}
