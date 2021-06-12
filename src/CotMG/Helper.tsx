import * as React from "react";
import * as ReactDOM from "react-dom";

import { Page, routing } from ".././ui/navigationTracking";
import { Root } from "./ui/Root";
import { Reviver } from "../../utils/JSONReviver";

import { IStaneksGift } from "./IStaneksGift";
import { StaneksGift } from "./StaneksGift";

let container: HTMLElement;
(function() {
    function set() {
        const elem = document.getElementById("staneks-gift-container");
        if (elem == null) {
            const msg = "Could not find element 'staneks-gift-container'";
            console.error(msg);
            throw Error(msg);
        }
        container = elem!;
        document.removeEventListener("DOMContentLoaded", set);
    }
    document.addEventListener("DOMContentLoaded", set);
})()

export let staneksGift: IStaneksGift = new StaneksGift();

export function loadStaneksGift(saveString: string): void {
    if (saveString) {
        staneksGift = JSON.parse(saveString, Reviver);
    } else {
        staneksGift = new StaneksGift();
    }
}

export function displayStaneksGiftContent() {
    if (!routing.isOn(Page.StaneksGift)) {
        return;
    }

    const g = {
        staneksGift: staneksGift,
    }
    ReactDOM.render(
        <Root staneksGift={staneksGift} />,
        container
    )
}