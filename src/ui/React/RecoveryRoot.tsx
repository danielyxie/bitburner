import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { Settings } from "../../Settings/Settings";
import { load } from "../../db";
import { IRouter } from "../Router";
import { download } from "../../SaveObject";

export let RecoveryMode = false;

export function ActivateRecoveryMode(): void {
  RecoveryMode = true;
}

interface IProps {
  router: IRouter;
}

export function RecoveryRoot({ router }: IProps): React.ReactElement {
  function recover(): void {
    RecoveryMode = false;
    router.toTerminal();
  }
  Settings.AutosaveInterval = 0;
  load().then((content) => {
    download("RECOVERY.json", content);
  });
  return (
    <>
      <Typography variant="h3">RECOVERY MODE ACTIVATED</Typography>
      <Typography>
        There was an error loading your save file and the game went into recovery mode. In this mode saving is disabled
        and the game will automatically export your save file (to prevent corruption).
      </Typography>
      <Typography>At this point it is recommended to alert a developer.</Typography>
      <Link href="https://github.com/danielyxie/bitburner/issues/new" target="_blank">
        <Typography>File an issue on github</Typography>
      </Link>
      <Link href="https://www.reddit.com/r/Bitburner/" target="_blank">
        <Typography>Make a reddit post</Typography>
      </Link>
      <Link href="https://discord.gg/TFc3hKD" target="_blank">
        <Typography>Post in the #bug-report channel on Discord.</Typography>
      </Link>
      <Typography>Please include your save file.</Typography>
      <br />
      <br />
      <Typography>You can disable recovery mode now. But chances are the game will not work correctly.</Typography>
      <Button onClick={recover}>DISABLE RECOVERY MODE</Button>
    </>
  );
}
