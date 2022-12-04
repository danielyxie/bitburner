import React, { useEffect, useState } from "react";

import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  TableCell,
  Typography,
  Tooltip,
  Box,
  Button,
  ButtonGroup,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { Theme } from "@mui/material/styles";

import ThumbUpAlt from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAlt from "@mui/icons-material/ThumbDownAlt";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningIcon from "@mui/icons-material/Warning";

import { ImportData, saveObject } from "../../SaveObject";
import { Settings } from "../../Settings/Settings";
import { convertTimeMsToTimeElapsedString, formatNumber } from "../../utils/StringHelperFunctions";
import { numeralWrapper } from "../numeralFormat";
import { ConfirmationModal } from "./ConfirmationModal";
import { pushImportResult } from "../../Electron";
import { Router } from "../GameRoot";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      maxWidth: "1000px",

      "& .MuiTable-root": {
        "& .MuiTableCell-root": {
          borderBottom: `1px solid ${Settings.theme.welllight}`,
        },

        "& .MuiTableHead-root .MuiTableRow-root": {
          backgroundColor: Settings.theme.backgroundsecondary,

          "& .MuiTableCell-root": {
            color: Settings.theme.primary,
            fontWeight: "bold",
          },
        },

        "& .MuiTableBody-root": {
          "& .MuiTableRow-root:nth-of-type(odd)": {
            backgroundColor: Settings.theme.well,

            "& .MuiTableCell-root": {
              color: Settings.theme.primarylight,
            },
          },
          "& .MuiTableRow-root:nth-of-type(even)": {
            backgroundColor: Settings.theme.backgroundsecondary,

            "& .MuiTableCell-root": {
              color: Settings.theme.primarylight,
            },
          },
        },
      },
    },
  }),
);

function ComparisonIcon({ isBetter }: { isBetter: boolean }): JSX.Element {
  if (isBetter) {
    return (
      <Tooltip
        title={
          <>
            Imported value is <b>larger</b>!
          </>
        }
      >
        <ThumbUpAlt color="success" />
      </Tooltip>
    );
  } else {
    return (
      <Tooltip
        title={
          <>
            Imported value is <b>smaller</b>!
          </>
        }
      >
        <ThumbDownAlt color="error" />
      </Tooltip>
    );
  }
}

export interface IProps {
  importString: string;
  automatic: boolean;
}

let initialAutosave = 0;

export function ImportSaveRoot(props: IProps): JSX.Element {
  const classes = useStyles();
  const [importData, setImportData] = useState<ImportData | undefined>();
  const [currentData, setCurrentData] = useState<ImportData | undefined>();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [headback, setHeadback] = useState(false);

  function handleGoBack(): void {
    Settings.AutosaveInterval = initialAutosave;
    pushImportResult(false);
    Router.allowRouting(true);
    setHeadback(true);
  }

  async function handleImport(): Promise<void> {
    await saveObject.importGame(props.importString, true);
    pushImportResult(true);
  }

  useEffect(() => {
    // We want to disable autosave while we're in this mode
    initialAutosave = Settings.AutosaveInterval;
    Settings.AutosaveInterval = 0;
    Router.allowRouting(false);
  }, []);

  useEffect(() => {
    if (headback) Router.toTerminal();
  }, [headback]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const dataBeingImported = await saveObject.getImportDataFromString(props.importString);
      const dataCurrentlyInGame = await saveObject.getImportDataFromString(saveObject.getSaveString(true));

      setImportData(dataBeingImported);
      setCurrentData(dataCurrentlyInGame);

      return Promise.resolve();
    }
    if (props.importString) fetchData();
  }, [props.importString]);

  if (!importData || !currentData) return <></>;
  return (
    <Box className={classes.root}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Import Save Comparison
      </Typography>
      {props.automatic && (
        <Typography sx={{ mb: 2 }}>
          We've found a <b>NEWER save</b> that you may want to use instead.
        </Typography>
      )}
      <Typography variant="body1" sx={{ mb: 2 }}>
        Your current game's data is on the left and the data that will be imported is on the right.
        <br />
        Please double check everything is fine before proceeding!
      </Typography>
      <TableContainer color="secondary" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Current Game</TableCell>
              <TableCell>Being Imported</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>Game Identifier</TableCell>
              <TableCell>{currentData.playerData?.identifier ?? "n/a"}</TableCell>
              <TableCell>{importData.playerData?.identifier ?? "n/a"}</TableCell>
              <TableCell>
                {importData.playerData?.identifier !== currentData.playerData?.identifier && (
                  <Tooltip title="These are two different games!">
                    <WarningIcon color="warning" />
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Playtime</TableCell>
              <TableCell>{convertTimeMsToTimeElapsedString(currentData.playerData?.totalPlaytime ?? 0)}</TableCell>
              <TableCell>{convertTimeMsToTimeElapsedString(importData.playerData?.totalPlaytime ?? 0)}</TableCell>
              <TableCell>
                {importData.playerData?.totalPlaytime !== currentData.playerData?.totalPlaytime && (
                  <ComparisonIcon
                    isBetter={
                      (importData.playerData?.totalPlaytime ?? 0) > (currentData.playerData?.totalPlaytime ?? 0)
                    }
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Saved On</TableCell>
              <TableCell>
                {(currentData.playerData?.lastSave ?? 0) > 0
                  ? new Date(currentData.playerData?.lastSave ?? 0).toLocaleString()
                  : "n/a"}
              </TableCell>
              <TableCell>
                {(importData.playerData?.lastSave ?? 0) > 0
                  ? new Date(importData.playerData?.lastSave ?? 0).toLocaleString()
                  : "n/a"}
              </TableCell>
              <TableCell>
                {importData.playerData?.lastSave !== currentData.playerData?.lastSave && (
                  <ComparisonIcon
                    isBetter={(importData.playerData?.lastSave ?? 0) > (currentData.playerData?.lastSave ?? 0)}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Money</TableCell>
              <TableCell>{numeralWrapper.formatMoney(currentData.playerData?.money ?? 0)}</TableCell>
              <TableCell>{numeralWrapper.formatMoney(importData.playerData?.money ?? 0)}</TableCell>
              <TableCell>
                {importData.playerData?.money !== currentData.playerData?.money && (
                  <ComparisonIcon
                    isBetter={(importData.playerData?.money ?? 0) > (currentData.playerData?.money ?? 0)}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Hacking</TableCell>
              <TableCell>{formatNumber(currentData.playerData?.hacking ?? 0, 0)}</TableCell>
              <TableCell>{formatNumber(importData.playerData?.hacking ?? 0, 0)}</TableCell>
              <TableCell>
                {importData.playerData?.hacking !== currentData.playerData?.hacking && (
                  <ComparisonIcon
                    isBetter={(importData.playerData?.hacking ?? 0) > (currentData.playerData?.hacking ?? 0)}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Augmentations</TableCell>
              <TableCell>{currentData.playerData?.augmentations}</TableCell>
              <TableCell>{importData.playerData?.augmentations}</TableCell>
              <TableCell>
                {importData.playerData?.augmentations !== currentData.playerData?.augmentations && (
                  <ComparisonIcon
                    isBetter={
                      (importData.playerData?.augmentations ?? 0) > (currentData.playerData?.augmentations ?? 0)
                    }
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Factions</TableCell>
              <TableCell>{currentData.playerData?.factions}</TableCell>
              <TableCell>{importData.playerData?.factions}</TableCell>
              <TableCell>
                {importData.playerData?.factions !== currentData.playerData?.factions && (
                  <ComparisonIcon
                    isBetter={(importData.playerData?.factions ?? 0) > (currentData.playerData?.factions ?? 0)}
                  />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Achievements</TableCell>
              <TableCell>{currentData.playerData?.achievements}</TableCell>
              <TableCell>{importData.playerData?.achievements}</TableCell>
              <TableCell>
                {importData.playerData?.achievements !== currentData.playerData?.achievements && (
                  <ComparisonIcon
                    isBetter={(importData.playerData?.achievements ?? 0) > (currentData.playerData?.achievements ?? 0)}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Source Files</TableCell>
              <TableCell>{currentData.playerData?.sourceFiles}</TableCell>
              <TableCell>{importData.playerData?.sourceFiles}</TableCell>
              <TableCell>
                {importData.playerData?.sourceFiles !== currentData.playerData?.sourceFiles && (
                  <ComparisonIcon
                    isBetter={(importData.playerData?.sourceFiles ?? 0) > (currentData.playerData?.sourceFiles ?? 0)}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>BitNode</TableCell>
              <TableCell>
                {currentData.playerData?.bitNode}-{currentData.playerData?.bitNodeLevel}
              </TableCell>
              <TableCell>
                {importData.playerData?.bitNode}-{importData.playerData?.bitNodeLevel}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ButtonGroup>
          <Button onClick={handleGoBack} sx={{ my: 2 }} startIcon={<ArrowBackIcon />} color="secondary">
            Take me back!
          </Button>
          <Button
            onClick={() => setImportModalOpen(true)}
            sx={{ my: 2 }}
            startIcon={<DirectionsRunIcon />}
            color="warning"
          >
            Proceed with import
          </Button>
        </ButtonGroup>
        <ConfirmationModal
          open={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          onConfirm={handleImport}
          confirmationText={
            <>
              Importing new save game data will <strong>completely wipe</strong> the current game data!
              <br />
            </>
          }
        />
      </Box>
    </Box>
  );
}
