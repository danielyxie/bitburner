import React from "react";
import Typography from "@mui/material/Typography";
import { Link } from "@mui/material";

export function ThemeCollaborate(): React.ReactElement {
  return (
    <>
      <Typography sx={{ my: 1 }}>
        If you've created a theme that you believe should be added in game's theme browser, feel free to{" "}
        <Link href="https://github.com/bitburner-official/bitburner-src/tree/dev/src/Themes/README.md" target="_blank">
          create a pull request
        </Link>
        .
      </Typography>
      <Typography sx={{ my: 1 }}>
        Head over to the{" "}
        <Link href="https://discord.com/channels/415207508303544321/921991895230611466" target="_blank">
          theme-sharing
        </Link>{" "}
        discord channel for more.
      </Typography>
    </>
  );
}
