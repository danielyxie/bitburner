import { getElementById } from "./getElementById";
import { removeElementById } from "./removeElementById";

/**
 * Routes the player from the Loading screen to the main game content.
 */
export function removeLoadingScreen(): void {
    // TODO: Have this manipulate CSS classes instead of direct styles
    removeElementById("loader");
    getElementById("entire-game-container").style.visibility = "visible";
}
