import { getElementById } from "../../utils/uiHelpers/getElementById";
import { Action } from "../types";
import { setTimeoutRef } from "../utils/SetTimeoutRef";

const threeSeconds: number = 3000;
let x: number | undefined;

/**
 * Displays a status message to the player for approximately 3 seconds.
 * @param text The status text to display
 */
export function createStatusText(text: string) {
    if (x !== undefined) {
        clearTimeout(x);
        // Likely not needed due to clearTimeout, but just in case...
        x = undefined;
    }

    const statusElement: HTMLElement = getElementById("status-text");
    statusElement.style.display = "block";
    statusElement.classList.add("status-text");
    statusElement.innerText = text;
    const handler: Action = () => {
        statusElement.innerText = "";
        statusElement.style.display = "none";
        statusElement.classList.remove("status-text");
    };

    x = setTimeoutRef(handler, threeSeconds);
}
