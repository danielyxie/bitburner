import React from "react";
import ReactDOM from "react-dom";

import { TTheme as Theme, ThemeEvents, refreshTheme } from "./ui/React/Theme";
import { LoadingScreen } from "./ui/LoadingScreen";
import "./engineStyle";

ReactDOM.render(
  <Theme>
    <LoadingScreen />
  </Theme>,
  document.getElementById("mainmenu-container"),
);

function rerender() {
  refreshTheme();
  ReactDOM.render(
    <Theme>
      <LoadingScreen />
    </Theme>,
    document.getElementById("mainmenu-container"),
  );
}

(function () {
  ThemeEvents.subscribe(rerender);
})();
