import React from "react";
import ReactDOM from "react-dom";

import { refreshTheme, ThemeEvents, TTheme as Theme } from "./Themes/ui/Theme";
import { LoadingScreen } from "./ui/LoadingScreen";
import { initElectron } from "./Electron";
import { ForeignLogWindow } from "./ui/React/LogBoxManager";

globalThis["React"] = React;
globalThis["ReactDOM"] = ReactDOM;

const isLogWindow = window.location.hash === "#log";
const componentFn = isLogWindow ? () => <ForeignLogWindow /> : () => <LoadingScreen />;

!isLogWindow && initElectron();

ReactDOM.render(<Theme>{componentFn()}</Theme>, document.getElementById("root"));

function rerender(): void {
  refreshTheme();
  ReactDOM.render(<Theme>{componentFn()}</Theme>, document.getElementById("root"));
}

(function () {
  ThemeEvents.subscribe(rerender);
})();

(function () {
  if (process.env.NODE_ENV === "development" || location.href.startsWith("file://")) return;
  window.onbeforeunload = function () {
    return "Your work will be lost.";
  };
})();

(function () {
  window.print = () => {
    throw new Error("You accidentally called window.print instead of ns.print");
  };
})();
