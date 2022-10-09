import React from "react";
import { Player } from "@player";
import { Exploit } from "./Exploit";

const getComputedStyle = window.getComputedStyle;
export function Unclickable(): React.ReactElement {
  function unclickable(event: React.MouseEvent<HTMLDivElement>): void {
    if (!event.target || !(event.target instanceof Element)) return;
    const display = getComputedStyle(event.target).display;
    const visibility = getComputedStyle(event.target).visibility;
    if (display === "none" && visibility === "hidden" && event.isTrusted) Player.giveExploit(Exploit.Unclickable);
  }

  return (
    <div id="unclickable" onClick={unclickable} style={{ display: "none", visibility: "hidden" }}>
      Click on this to upgrade your Source-File -1!
    </div>
  );
}
