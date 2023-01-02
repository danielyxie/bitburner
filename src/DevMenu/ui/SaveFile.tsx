import React, { useState, useRef } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import { saveObject } from "../../SaveObject";
import { SnackbarEvents, ToastVariant } from "../../ui/React/Snackbar";
import { Upload } from "@mui/icons-material";
import { Button } from "@mui/material";
import { OptionSwitch } from "../../ui/React/OptionSwitch";

export function SaveFile(): React.ReactElement {
  const importInput = useRef<HTMLInputElement>(null);
  const [saveFile, setSaveFile] = useState("");
  const [restoreScripts, setRestoreScripts] = useState(true);
  const [restoreAugs, setRestoreAugs] = useState(true);
  const [restoreSFs, setRestoreSFs] = useState(true);

  async function onImport(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    try {
      const base64Save = await saveObject.getImportStringFromFile(event.target.files);
      const save = atob(base64Save);
      setSaveFile(save);
    } catch (e: unknown) {
      SnackbarEvents.emit(String(e), ToastVariant.ERROR, 5000);
    }
  }

  function startImport(): void {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
    const ii = importInput.current;
    if (ii === null) throw new Error("import input should not be null");
    ii.click();
  }

  function doRestore(): void {
    const save = JSON.parse(saveFile);
    // TODO: Continue here.
    console.error(save);
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
        {saveFile !== "" && (
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
