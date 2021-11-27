import React from "react";
import ReactDOM from "react-dom";

import { TTheme as Theme, ThemeEvents, refreshTheme } from "./ui/React/Theme";
import { LoadingScreen } from "./ui/LoadingScreen";

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
  if (process.env.NODE_ENV === "development") return;
  window.onbeforeunload = function () {
    return "Your work will be lost.";
  };
})();
