import { createElement } from "./createElement";
import { getElementById } from "./getElementById";

interface ICreatePopupOptions {
  backgroundColor?: string;
}

/**
 * Creates the necessary DOM elements to present an in-game popup to the player.
 * @param id The (hopefully) unique identifier for the popup container.
 * @param elems The collection of HTML Elements to show within the popup.
 */
export function createPopup(id: string, elems: HTMLElement[], options: ICreatePopupOptions = {}): HTMLDivElement {
  const container: HTMLDivElement = createElement("div", {
    class: "popup-box-container",
    display: "flex",
    id: id,
  }) as HTMLDivElement;
  const content: HTMLElement = createElement("div", {
    class: "popup-box-content",
    id: `${id}-content`,
  });

  for (const elem of elems) {
    content.appendChild(elem);
  }

  // Configurable Options
  if (options.backgroundColor) {
    content.style.backgroundColor = options.backgroundColor;
  }

  container.appendChild(content);
  getElementById("root").appendChild(container);

  return container;
}
