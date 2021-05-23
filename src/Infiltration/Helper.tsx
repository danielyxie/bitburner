import { Page, routing } from ".././ui/navigationTracking";
import { Root } from "./ui/Root";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IEngine } from "../IEngine";
import * as React from "react";
import * as ReactDOM from "react-dom";

let container: HTMLElement = document.createElement('div');

(function() {
    function setContainer(): void {
        let c = document.getElementById("infiltration-container");
        if(c === null) throw new Error("huh?");
        container = c;
        document.removeEventListener("DOMContentLoaded", setContainer);
    }

    document.addEventListener("DOMContentLoaded", setContainer);
})();


export function displayInfiltrationContent(engine: IEngine, player: IPlayer, location: string, difficulty: number, maxLevel: number): void {
    if (!routing.isOn(Page.Infiltration)) {
        return;
    }

    ReactDOM.render(<Root
        Engine={engine}
        Player={player}
        Location={location}
        Difficulty={difficulty}
        MaxLevel={maxLevel}
    />, container);
}