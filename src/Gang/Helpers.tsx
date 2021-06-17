import * as React from "react";
import * as ReactDOM from "react-dom";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IEngine } from "../IEngine";
import { Root } from "./ui/Root";
import { Gang } from "./Gang";
import { Page, routing } from ".././ui/navigationTracking";

let gangContainer: HTMLElement;

(function() {
    function set(): void {
        const c = document.getElementById("gang-container");
        if(c === null) throw new Error("Could not find element 'gang-container'");
        gangContainer = c;
        document.removeEventListener("DOMContentLoaded", set);
    }

    document.addEventListener("DOMContentLoaded", set);
})();


export function displayGangContent(engine: IEngine, gang: Gang, player: IPlayer): void {
    if (!routing.isOn(Page.Gang)) {
        return;
    }

    ReactDOM.render(<Root
        engine={engine}
        gang={gang}
        player={player} />, gangContainer);
}