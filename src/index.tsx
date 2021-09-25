import React from "react";
import ReactDOM from "react-dom";

import { TTheme as Theme, ThemeEvents, refreshTheme } from "./ui/React/Theme";
import { LoadingScreen } from "./ui/LoadingScreen";
import "./engineStyle";

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
