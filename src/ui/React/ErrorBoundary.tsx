import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Link,
  Grid,
  FormControl,
  InputLabel,
  FilledInput,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import ReportIcon from "@mui/icons-material/Report";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import GitHubIcon from "@mui/icons-material/GitHub";

import { Settings } from "../../Settings/Settings";
import { DeleteGameButton } from "./DeleteGameButton";
import { CONSTANTS } from "../../Constants";
import { hash } from "../../hash/hash";
import { IRouter, Page } from "../Router";
import { download } from "../../SaveObject";
import { load } from "../../db";

interface IProps {
  children: React.ReactNode;
  router: IRouter;
}

interface IState {
  hasError: boolean;
  page?: string;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface Error {
  stack?: string;
}

interface ErrorPage {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  page?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      display: "block",
      padding: "8px",
      minHeight: "100vh",
    },

    preBox: {
      marginRight: theme.spacing(1),
      border: `1px solid ${Settings.theme.secondary}`,
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),

      "& pre": {
        padding: theme.spacing(1),
        margin: theme.spacing(0),
        whiteSpace: 'normal',

        "& p": {
          fontSize: "0.75rem",
        },
      },
    },

    specsTable: {
      marginLeft: theme.spacing(1),
      "& .MuiTableCell-body": {
        borderBottom: `1px solid ${Settings.theme.welllight}`,
      },
      "& p": {
        fontSize: "0.85rem",
      },
    },
  }),
);

function ErrorPage({ error, errorInfo, page }: ErrorPage): React.ReactElement {
  const classes = useStyles();
  const [saveString, setSaveString] = useState<string | undefined>("n/a");
  const stackLinePattern = /(.*)@(.*\/\/\/[0-9]*):([0-9]*):([0-9]*)/;
  const stack = errorInfo?.componentStack
    ?.split("\n")
    ?.map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const matches = line.match(stackLinePattern);
      const entry: any = {
        stack: line,
        file: (matches && matches[1]) ?? "",
        source: (matches && matches[2]) ?? "",
        row: (matches && matches[3]) ?? "",
        col: (matches && matches[4]) ?? "",
      };
      return entry;
    });

  const runtime = navigator.userAgent.toLowerCase().indexOf(" electron/") > -1 ? "Steam" : "Browser";
  const runtimeVersion = `v${CONSTANTS.VersionString} (${hash()}) - ${runtime} in "${page}"`;
  const features = `lang=${navigator.language} cookiesEnabled=${navigator.cookieEnabled.toString()} doNotTrack=${
    navigator.doNotTrack
  } indexedDb=${(!!window.indexedDB).toString()}`;
  const issueTitle = `\`${runtime}\` - Game Crash with \`${error?.toString()}\` in \`${page}\``;
  const log = `
# ${issueTitle}

## How did this happen?

**Please fill this information with details if any.**

---

### Environment

* **Error**: \`${error?.toString()}\`
* **Runtime**: \`${runtimeVersion}\`
* **UserAgent**: \`${navigator.userAgent}\`
* **Features**: \`${features}\`
* **Source**: \`${(error as any).fileName}\`

### Stack Trace

\`\`\`
${errorInfo?.componentStack.toString().trim()}
\`\`\`

### Save
\`\`\`
*Add your save string here if possible (if not too big)*
\`\`\`
  `.trim();

  const githubUrl = `https://github.com/danielyxie/bitburner/issues/new?title=${encodeURIComponent(
    issueTitle,
  )}&body=${encodeURIComponent(log)}`;

  useEffect(() => {
    load().then((saveString) => setSaveString(saveString));
  }, []);

  if (!error || !errorInfo) return <></>;

  return (
    <Box display="flex" flexDirection="row" width="100%">
      <Box className={classes.root}>
        <Typography variant="h4" color="error" sx={{ mb: 1 }}>
          <ReportIcon sx={{ mr: 1 }} />
          <strong>{(error as any).name}</strong>: {(error as any).message}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          The game crashed unexpectedly. The best way to report this to us is through{" "}
          <Link href={githubUrl} target="_blank">
            submitting an issue on the game's GitHub repository
          </Link>
          . If you need quick support, the{" "}
          <Link href="https://discord.gg/TFc3hKD" target="_blank">
            Discord
          </Link>{" "}
          is also a good place to get help. You may copy the "Bug Report" text below. You may also choose to include the
          "Save String" in your report. Most information will be pre-filled in the Submit Issue link.
        </Typography>
        <ButtonGroup sx={{ my: 2}}>
          <Tooltip title="Submitting an issue to GitHub really help us improve the game!">
            <Button component={Link} href={githubUrl} target={"_blank"} startIcon={<GitHubIcon />} color="primary">
              Submit Issue to GitHub
            </Button>
          </Tooltip>
          <Tooltip title="Reload the current page">
            <Button startIcon={<RefreshIcon />} color="secondary" onClick={() => window.location.reload()}>
              Reload Game
            </Button>
          </Tooltip>
          <Tooltip title="Export your local save game to a file.">
            <Button
              startIcon={<DownloadIcon />}
              color="secondary"
              disabled={!saveString && saveString !== "n/a"}
              onClick={() => {
                if (!saveString) return;
                const epochTime = Math.round(Date.now() / 1000);
                const filename = `bitburnerSave_recovery_${epochTime}.json`;
                download(filename, saveString);
              }}
            >
              Export Save
            </Button>
          </Tooltip>
          <DeleteGameButton color="error" />
        </ButtonGroup>
        <Box sx={{ my: 2 }}>
          <Grid container>
            <Grid item xs={8}>
              <FormControl fullWidth variant="outlined" sx={{ pr: 1 }}>
                <InputLabel>Bug Report Text</InputLabel>
                <FilledInput multiline rows={8} value={log} />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined" sx={{ pl: 1 }}>
                <InputLabel>Save String</InputLabel>
                <FilledInput multiline rows={8} value={saveString} />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Typography variant="body1" color="primary" sx={{ my: 2 }}>
          Thrown at {(error as any).fileName}
        </Typography>
        <Grid container>
          <Grid item xs={8}>
            <Box className={classes.preBox}>
              <pre>
                {stack?.map((e, index) =>
                  (e.file ? (
                    <Typography color="secondary" sx={{ display: "block" }} key={index}>
                      &#x21B3; <strong>{e.file}</strong> in {e.source}{" "}
                      <em>
                        (ln:{e.row}, col:{e.col})
                      </em>
                    </Typography>
                  ) : (
                    <Typography color="secondary" sx={{ display: "block" }} key={index}>
                      &#x21B3; {e.stack}
                    </Typography>
                  )),
                )}
              </pre>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Table className={classes.specsTable}>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography>Runtime</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{runtimeVersion}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>User Agent</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{navigator.userAgent}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography>Features</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{features}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

// We can't use functional components to handle the componentDidCatch function
// https://blog.openreplay.com/catching-errors-in-react-with-error-boundaries
class ErrorBoundaryBase extends React.Component<IProps, IState> {
  state: IState = { hasError: false };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      errorInfo,
      page: Page[this.props.router.page()],
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} errorInfo={this.state.errorInfo} page={this.state.page} />;
    }
    return this.props.children;
  }

  static getDerivedStateFromError(error: Error): IState {
    return { hasError: true, error };
  }
}

export const ErrorBoundary = withStyles({}, { withTheme: true })(ErrorBoundaryBase);
