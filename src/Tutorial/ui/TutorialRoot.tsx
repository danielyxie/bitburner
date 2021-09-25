import React from "react";

import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
export function TutorialRoot(): React.ReactElement {
  return (
    <>
      <Typography variant="h4">Tutorial / Documentation</Typography>
      <Box m={2}>
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/guidesandtips/gettingstartedguideforbeginnerprogrammers.html"
        >
          <Typography>Getting Started</Typography>
        </Link>
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/basicgameplay/servers.html"
        >
          <Typography>Servers & Networking</Typography>
        </Link>
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/basicgameplay/hacking.html"
        >
          <Typography>Hacking</Typography>
        </Link>
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/basicgameplay/scripts.html"
        >
          <Typography>Scripts</Typography>
        </Link>
        <br />
        <Link color="primary" target="_blank" href="https://bitburner.readthedocs.io/en/latest/netscript.html">
          <Typography>Netscript Programming Language</Typography>
        </Link>
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/basicgameplay/world.html"
        >
          <Typography>Traveling</Typography>
        </Link>
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/basicgameplay/companies.html"
        >
          <Typography>Companies</Typography>
        </Link>
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/basicgameplay/infiltration.html"
        >
          <Typography>Infiltration</Typography>
        </Link>
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/basicgameplay/factions.html"
        >
          <Typography>Factions</Typography>
        </Link>
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/basicgameplay/augmentations.html"
        >
          <Typography>Augmentations</Typography>
        </Link>
        <br />
        <Link color="primary" target="_blank" href="https://bitburner.readthedocs.io/en/latest/shortcuts.html">
          <Typography>Keyboard Shortcuts</Typography>
        </Link>
      </Box>
    </>
  );
}
