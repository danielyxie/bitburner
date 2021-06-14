/**
 * Create a pop-up dialog box using React.
 *
 * Calling this function with the same ID and React Root Component will trigger a re-render
 *
 * @param id The (hopefully) unique identifier for the popup container
 * @param rootComponent Root React Component for the content (NOT the popup containers themselves)
 */
import * as React       from "react";
import * as ReactDOM    from "react-dom";

import { Popup } from "./Popup";

import { createElement } from "../../../utils/uiHelpers/createElement";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";

type ReactComponent = new(...args: any[]) => React.Component<any, any>;

let gameContainer: HTMLElement;

function getGameContainer(): void {
    const container = document.getElementById("entire-game-container");
    if (container == null) {
        throw new Error(`Failed to find game container DOM element`)
    }

    gameContainer = container;
    document.removeEventListener("DOMContentLoaded", getGameContainer);
}

document.addEventListener("DOMContentLoaded", getGameContainer);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createPopup<T>(id: string, rootComponent: (props: T) => React.ReactElement, props: T): HTMLElement | null {
    let container = document.getElementById(id);
    if (container == null) {
        container = createElement("div", {
            class: "popup-box-container",
            display: "flex",
            id: id,
        });

        gameContainer.appendChild(container);
    }

    ReactDOM.render(<Popup content={rootComponent} id={id} props={props} />, container);

    return container;
}

/**
 * Closes a popup created with the createPopup() function above
 */
export function removePopup(id: string): void {
    const content = document.getElementById(`${id}`);
    if (content == null) { return; }

    ReactDOM.unmountComponentAtNode(content);

    removeElementById(id);
}
