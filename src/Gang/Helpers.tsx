import * as React from "react";
import * as ReactDOM from "react-dom";
import { createElement } from "../../utils/uiHelpers/createElement";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IEngine } from "../IEngine";
import { Root } from "./ui/Root";
import { Gang } from "./Gang";

// Gang UI Dom Elements
const UIElems: {
    gangContentCreated: boolean;
    gangContainer: HTMLElement | null;
} = {
    gangContentCreated:     false,
    gangContainer:          null,
}

export function displayGangContent(engine: IEngine, gang: Gang, player: IPlayer): void {
    if (!UIElems.gangContentCreated || UIElems.gangContainer == null) {
        UIElems.gangContentCreated = true;

        // Create gang container
        UIElems.gangContainer = createElement("div", {
            id:"gang-container", class:"generic-menupage-container",
        });

        ReactDOM.render(<Root engine={engine} gang={gang} player={player} />, UIElems.gangContainer);

        const container = document.getElementById("entire-game-container");
        if(!container) throw new Error('entire-game-container was null');
        container.appendChild(UIElems.gangContainer);
    }
    if(UIElems.gangContainer) UIElems.gangContainer.style.display = "block";
}

export function clearGangUI(): void {
    if(UIElems.gangContainer) UIElems.gangContainer.style.display = 'none';
    if (UIElems.gangContainer instanceof Element) ReactDOM.unmountComponentAtNode(UIElems.gangContainer);
    UIElems.gangContainer = null;
    UIElems.gangContentCreated = false;
}
