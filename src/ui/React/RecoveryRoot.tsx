import React, { useEffect } from "react";

import { Typography, Link, Button, ButtonGroup, Tooltip, Box, Paper, TextField } from "@mui/material";
import { Settings } from "../../Settings/Settings";
import { load } from "../../db";
import { IRouter } from "../Router";
import { download } from "../../SaveObject";
import { IErrorData, newIssueUrl } from "../../utils/ErrorHelper";
import { DeleteGameButton } from "./DeleteGameButton";
import { SoftResetButton } from "./SoftResetButton";

import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import GitHubIcon from "@mui/icons-material/GitHub";

export let RecoveryMode = false;

export function ActivateRecoveryMode(): void {
  RecoveryMode = true;
}

interface IProps {
  router: IRouter;
  softReset: () => void;
  errorData?: IErrorData;
  resetError?: () => void;
}

export function RecoveryRoot({ router, softReset, errorData, resetError }: IProps): React.ReactElement {
  function recover(): void {
    if (resetError) resetError();
    RecoveryMode = false;
    router.toTerminal();
  }
  Settings.AutosaveInterval = 0;

  useEffect(() => {
    load().then((content) => {
      const epochTime = Math.round(Date.now() / 1000);
      const filename = `RECOVERY_BITBURNER_${epochTime}.json`;
      download(filename, content);
    });
  }, []);

  return (
    <Box sx={{ padding: "8px 16px", minHeight: "100vh", maxWidth: "1200px", boxSizing: "border-box" }}>
      <Typography variant="h3">RECOVERY MODE ACTIVATED</Typography>
      <Typography>
        There was an error with your save file and the game went into recovery mode. In this mode saving is disabled and
        the game will automatically export your save file (to prevent corruption).
      </Typography>
      <Typography>At this point it is recommended to alert a developer.</Typography>
      <Typography>
        <Link href={errorData?.issueUrl ?? newIssueUrl} target="_blank">
          File an issue on github
        </Link>
      </Typography>
      <Typography>
        <Link href="https://www.reddit.com/r/Bitburner/" target="_blank">
          Make a reddit post
        </Link>
      </Typography>
      <Typography>
        <Link href="https://discord.gg/TFc3hKD" target="_blank">
          Post in the #bug-report channel on Discord.
        </Link>
      </Typography>
      <Typography>Please include your save file.</Typography>
      <br />
      <br />
      <Typography>You can disable recovery mode now. But chances are the game will not work correctly.</Typography>
      <ButtonGroup sx={{ my: 2 }}>
        <Tooltip title="Disables the recovery mode & attempt to head back to the terminal page. This may or may not work. Ensure you have saved the recovery file.">
          <Button onClick={recover} startIcon={<DirectionsRunIcon />}>
            Disable Recovery Mode
          </Button>
        </Tooltip>
        <SoftResetButton color="warning" onTriggered={softReset} />
        <DeleteGameButton color="error" />
      </ButtonGroup>

      {errorData && (
        <Paper sx={{ px: 2, pt: 1, pb: 2, mt: 2 }}>
          <Typography variant="h5">{errorData.title}</Typography>
          <Box sx={{ my: 2 }}>
            <TextField
              label="Bug Report Text"
              value={errorData.body}
              variant="outlined"
              color="secondary"
              multiline
              fullWidth
              rows={12}
              sx={{ "& .MuiOutlinedInput-root": { color: Settings.theme.secondary } }}
            />
          </Box>
          <Tooltip title="Submitting an issue to GitHub really help us improve the game!">
            <Button
              component={Link}
              startIcon={<GitHubIcon />}
              color="info"
              sx={{ px: 2 }}
              href={errorData.issueUrl ?? newIssueUrl}
              target={"_blank"}
            >
              Submit Issue to GitHub
            </Button>
          </Tooltip>
        </Paper>
      )}
    </Box>
  );
}
