import { Page, routing } from ".././ui/navigationTracking";
import { Root } from "./ui/Root";
import { Player } from "../Player";
import * as React from "react";
import * as ReactDOM from "react-dom";

let milestonesContainer: HTMLElement | null = null;

(function () {
  function setContainer(): void {
    milestonesContainer = document.getElementById("milestones-container");
    document.removeEventListener("DOMContentLoaded", setContainer);
  }

  document.addEventListener("DOMContentLoaded", setContainer);
})();

export function displayMilestonesContent(): void {
  if (!routing.isOn(Page.Milestones)) {
    return;
  }

  if (milestonesContainer instanceof HTMLElement) {
    ReactDOM.render(<Root player={Player} />, milestonesContainer);
  }
}
