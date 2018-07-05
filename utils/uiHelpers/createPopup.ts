import { createElement } from "./createElement";

/**
 * Creates the necessary DOM elements to present an in-game popup to the player.
 * @param id The (hopefully) unique identifier for the popup container.
 * @param elems The collection of HTML Elements to show within the popup.
 */
export function createPopup(id: string, elems: HTMLElement[]) {
    const container: HTMLDivElement = createElement("div", {
            class: "popup-box-container",
            display: "block",
            id,
        }) as HTMLDivElement;
    const content: HTMLElement = createElement("div", {
            class: "popup-box-content",
            id: `${id}-content`,
        });

    for (const elem of elems) {
        content.appendChild(elem);
    }
    container.appendChild(content);
    const gameContainer: HTMLElement | null = document.getElementById("entire-game-container");

    if (gameContainer === null) {
        throw new Error("Unable to find the game container. Something is *seriously* wrong...");
    }

    gameContainer.appendChild(container);

    return container;
}
