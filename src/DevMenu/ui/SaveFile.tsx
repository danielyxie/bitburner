import React, { useState, useRef } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import { BitburnerSaveObject, ImportData, saveObject } from "../../SaveObject";
import { SnackbarEvents, ToastVariant } from "../../ui/React/Snackbar";
import { Upload } from "@mui/icons-material";
import { Button } from "@mui/material";
import { OptionSwitch } from "../../ui/React/OptionSwitch";
import { IReviverValue } from "src/utils/JSONReviver";
import { Server } from "src/Server/Server";
import { PlayerObject } from "src/PersonObjects/Player/PlayerObject";

export function SaveFile(): React.ReactElement {
  const importInput = useRef<HTMLInputElement>(null);

  const [importData, setImportData] = useState<ImportData | null>(null);
  const [restoreScripts, setRestoreScripts] = useState(true);
  const [restoreAugs, setRestoreAugs] = useState(true);
  const [restoreSFs, setRestoreSFs] = useState(true);

  function startImport(): void {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
    const ii = importInput.current;
    if (ii === null) throw new Error("import input should not be null");
    ii.click();
  }

  async function onImport(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    try {
      const base64Save = await saveObject.getImportStringFromFile(event.target.files);
      const data = await saveObject.getImportDataFromString(base64Save);
      setImportData(data);
    } catch (e: unknown) {
      SnackbarEvents.emit(String(e), ToastVariant.ERROR, 5000);
    }
  }

  async function doRestore(): Promise<void> {
    if (!importData) return;

    try {
      if (!restoreAugs || !restoreSFs || !restoreScripts) {
        //Remove unwanted data
        const parsedSave = JSON.parse(window.atob(importData.base64));
        const parsedRoot = BitburnerSaveObject.fromJSON(parsedSave);

        if (!restoreAugs || !restoreSFs) {
          const parsedPlayer = JSON.parse(parsedRoot.PlayerSave) as IReviverValue<PlayerObject>;
          if (!restoreAugs) {
            parsedPlayer.data.augmentations = [];
            if (importData.playerData) {
              importData.playerData.augmentations = 0;
            }
          }

          if (!restoreSFs) {
            parsedPlayer.data.sourceFiles = [];
            if (importData.playerData) {
              importData.playerData.sourceFiles = 0;
            }
          }

          parsedRoot.PlayerSave = JSON.stringify(parsedPlayer);
        }

        if (!restoreScripts) {
          const parsedServers = JSON.parse(parsedRoot.AllServersSave);
          for (const server of Object.values(parsedServers) as IReviverValue<Server>[]) {
            server.data.scripts = [];
          }

          parsedRoot.AllServersSave = JSON.stringify(parsedServers);
        }

        importData.base64 = window.btoa(JSON.stringify(parsedRoot));
      }

      await saveObject.importGame(importData.base64);
    } catch (e: unknown) {
      SnackbarEvents.emit(String(e), ToastVariant.ERROR, 5000);
    }
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Save file</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button onClick={startImport} startIcon={<Upload />} sx={{ gridArea: "import" }}>
          Select save file
          <input ref={importInput} type="file" hidden onChange={onImport} />
        </Button>
        <br />
        {importData !== null && (
          <>
            <OptionSwitch
              checked={restoreScripts}
              onChange={(v) => setRestoreScripts(v)}
              text="Restore scripts"
              tooltip={<>Restore the save file home computer scripts.</>}
            />
            <br />
            <OptionSwitch
              checked={restoreAugs}
              onChange={(v) => setRestoreAugs(v)}
              text="Restore Augmentations"
              tooltip={<>Restore the save file installed augmentations.</>}
            />
            <br />
            <OptionSwitch
              checked={restoreSFs}
              onChange={(v) => setRestoreSFs(v)}
              text="Restore Source Files"
              tooltip={<>Restore the save file acquired source files.</>}
            />
            <br />
            <Button onClick={doRestore}>Restore</Button>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
