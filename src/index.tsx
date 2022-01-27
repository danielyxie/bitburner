import React from "react";
import ReactDOM from "react-dom";

import { TTheme as Theme, ThemeEvents, refreshTheme } from "./Themes/ui/Theme";
import { LoadingScreen } from "./ui/LoadingScreen";
import { initElectron } from "./Electron";
initElectron();
globalThis["React"] = React;
globalThis["ReactDOM"] = ReactDOM;
ReactDOM.render(
  <Theme>
    <LoadingScreen />
  </Theme>,
  document.getElementById("root"),
);

function rerender(): void {
  refreshTheme();
  ReactDOM.render(
    <Theme>
      <LoadingScreen />
    </Theme>,
    document.getElementById("root"),
  );
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
