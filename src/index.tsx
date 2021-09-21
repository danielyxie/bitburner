import React from "react";
import ReactDOM from "react-dom";

import { TTheme as Theme, colors, refreshTheme } from "./ui/React/Theme";
import { LoadingScreen } from "./ui/LoadingScreen";
import "./engineStyle";

ReactDOM.render(
  <Theme>
    <LoadingScreen />
  </Theme>,
  document.getElementById("mainmenu-container"),
);

// setTimeout(() => {
//   colors.primary = "#fff";
//   refreshTheme();
//   ReactDOM.render(
//     <Theme>
//       <LoadingScreen />
//     </Theme>,
//     document.getElementById("mainmenu-container"),
//   );
// }, 5000);
