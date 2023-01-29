import React, { useState } from "react";

import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ConfirmationModal } from "../../ui/React/ConfirmationModal";

interface IProps {
  reactivateTutorial: () => void;
}

export function TutorialRoot(props: IProps): React.ReactElement {
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  return (
    <>
      <Typography variant="h4">Tutorial / Documentation</Typography>
      <Box m={2}>
        <Button onClick={() => setConfirmResetOpen(true)}>Soft reset and Restart tutorial</Button>
        <ConfirmationModal
          open={confirmResetOpen}
          onClose={() => setConfirmResetOpen(false)}
          onConfirm={props.reactivateTutorial}
          confirmationText={"This will reset all your stats to 1 and money to 1k. Are you sure?"}
        />
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
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/netscript/netscriptlearntoprogram.html#netscript-1-0-vs-netscript-2-0"
        >
          <Typography>NS1 vs NS2 (or .script vs .js)</Typography>
        </Link>
        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://bitburner.readthedocs.io/en/latest/netscript/netscriptfunctions.html"
        >
          <Typography>Simplified list of functions</Typography>
        </Link>

        <br />
        <Link
          color="primary"
          target="_blank"
          href="https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.ns.md"
        >
          <Typography>Complete list of functions</Typography>
        </Link>
      </Box>
    </>
  );
}
