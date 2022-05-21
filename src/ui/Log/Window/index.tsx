import React from "react";
import ReactDOM from "react-dom";

import { refreshTheme, ThemeEvents, TTheme as Theme } from "../../../Themes/ui/Theme";
import { ForeignLogWindow } from "./ForeignLogWindow";

function rerender(initial = false): void {
  initial || refreshTheme();
  ReactDOM.render(<Theme>{<ForeignLogWindow />}</Theme>, document.getElementById("root"));
}

(function () {
  ThemeEvents.subscribe(rerender);
  rerender(true);
})();
