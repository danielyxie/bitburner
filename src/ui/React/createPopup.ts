/**
 * Create a pop-up dialog box using React.
 *
 * Calling this function with the same ID and React Root Component will trigger a re-render
 *
 * @param id The (hopefully) unique identifier for the popup container
 * @param rootComponent Root React Component
 */
import * as React       from "react";
import * as ReactDOM    from "react-dom";

import { createElement } from "../../../utils/uiHelpers/createElement";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";

type ReactComponent = new(...args: any[]) => React.Component<any, any>;

export function createPopup(id: string, rootComponent: ReactComponent, props: object): HTMLElement {
    let container = document.getElementById(id);
    let content = document.getElementById(`${id}-content`);
    if (container == null || content == null) {
        container = createElement("div", {
            class: "popup-box-container",
            display: "flex",
            id: id,
        });

        content = createElement("div", {
            class: "popup-box-content",
            id: `${id}-content`,
        });

        container.appendChild(content);

        try {
            document.getElementById("entire-game-container")!.appendChild(container);
        } catch(e) {
            console.error(`Exception caught when creating popup: ${e}`);
        }
    }

    ReactDOM.render(React.createElement(rootComponent, props), content);

    return container;
}

/**
 * Closes a popup created with the createPopup() function above
 */
export function removePopup(id: string): void {
    let content = document.getElementById(`${id}-content`);
    if (content == null) { return; }

    ReactDOM.unmountComponentAtNode(content);

    removeElementById(id);
}
