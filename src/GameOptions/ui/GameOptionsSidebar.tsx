import { Download, Palette, Save, Upload } from "@mui/icons-material";
import { Box, Button, Link, List, ListItemButton, Paper, Tooltip, Typography } from "@mui/material";
import { default as React, useRef, useState } from "react";
import { FileDiagnosticModal } from "../../Diagnostic/FileDiagnosticModal";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { ImportData, saveObject } from "../../SaveObject";
import { Settings } from "../../Settings/Settings";
import { StyleEditorButton } from "../../Themes/ui/StyleEditorButton";
import { ThemeEditorButton } from "../../Themes/ui/ThemeEditorButton";
import { ConfirmationModal } from "../../ui/React/ConfirmationModal";
import { DeleteGameButton } from "../../ui/React/DeleteGameButton";
import { SnackbarEvents, ToastVariant } from "../../ui/React/Snackbar";
import { SoftResetButton } from "../../ui/React/SoftResetButton";
import { IRouter } from "../../ui/Router";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { GameOptionsTabs } from "../GameOptionsTabs";

interface IProps {
  tab: GameOptionsTabs;
  setTab: (tab: GameOptionsTabs) => void;
  player: IPlayer;
  router: IRouter;
  save: () => void;
  export: () => void;
  forceKill: () => void;
  softReset: () => void;
}

interface ITabProps {
  sideBarProps: IProps;
  tab: GameOptionsTabs;
  tabName: string;
}

const SideBarTab = (props: ITabProps): React.ReactElement => {
  return (
    <ListItemButton
      selected={props.sideBarProps.tab === props.tab}
      onClick={() => props.sideBarProps.setTab(props.tab)}
    >
      <Typography>{props.tabName}</Typography>
    </ListItemButton>
  );
};

export const GameOptionsSidebar = (props: IProps): React.ReactElement => {
  const importInput = useRef<HTMLInputElement>(null);

  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [importSaveOpen, setImportSaveOpen] = useState(false);
  const [importData, setImportData] = useState<ImportData | null>(null);

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
      setImportSaveOpen(true);
    } catch (ex: any) {
      SnackbarEvents.emit(ex.toString(), ToastVariant.ERROR, 5000);
    }
  }

  async function confirmedImportGame(): Promise<void> {
    if (!importData) return;

    try {
      await saveObject.importGame(importData.base64);
    } catch (ex: any) {
      SnackbarEvents.emit(ex.toString(), ToastVariant.ERROR, 5000);
    }

    setImportSaveOpen(false);
    setImportData(null);
  }

  function compareSaveGame(): void {
    if (!importData) return;
    props.router.toImportSave(importData.base64);
    setImportSaveOpen(false);
    setImportData(null);
  }

  return (
    <Box>
      <Paper sx={{ height: "fit-content", mb: 1 }}>
        <List>
          <SideBarTab sideBarProps={props} tab={GameOptionsTabs.SYSTEM} tabName="System" />
          <SideBarTab sideBarProps={props} tab={GameOptionsTabs.GAMEPLAY} tabName="Gameplay" />
          <SideBarTab sideBarProps={props} tab={GameOptionsTabs.INTERFACE} tabName="Interface" />
          <SideBarTab sideBarProps={props} tab={GameOptionsTabs.MISC} tabName="Misc" />
        </List>
      </Paper>
      <Box
        sx={{
          display: "grid",
          width: "fit-content",
          height: "fit-content",
          gridTemplateAreas: `"save   delete"
      "export import"
      "kill   kill"
      "reset  diagnose"
      "browse browse"
      "theme  style"
      "links  links"`,
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Button onClick={() => props.save()} startIcon={<Save />} sx={{ gridArea: "save" }}>
          Save Game
        </Button>
        <Box sx={{ gridArea: "delete", "& .MuiButton-root": { width: "100%" } }}>
          <DeleteGameButton />
        </Box>
        <Tooltip title={<Typography>Export your game to a text file.</Typography>}>
          <Button onClick={() => props.export()} startIcon={<Download />} sx={{ gridArea: "export" }}>
            Export Game
          </Button>
        </Tooltip>
        <Tooltip
          title={
            <Typography>
              Import your game from a text file.
              <br />
              This will <strong>overwrite</strong> your current game. Back it up first!
            </Typography>
          }
        >
          <Button onClick={startImport} startIcon={<Upload />} sx={{ gridArea: "import" }}>
            Import Game
            <input ref={importInput} id="import-game-file-selector" type="file" hidden onChange={onImport} />
          </Button>
        </Tooltip>
        <ConfirmationModal
          open={importSaveOpen}
          onClose={() => setImportSaveOpen(false)}
          onConfirm={() => confirmedImportGame()}
          additionalButton={<Button onClick={compareSaveGame}>Compare Save</Button>}
          confirmationText={
            <>
              Importing a new game will <strong>completely wipe</strong> the current data!
              <br />
              <br />
              Make sure to have a backup of your current save file before importing.
              <br />
              The file you are attempting to import seems valid.
              {(importData?.playerData?.lastSave ?? 0) > 0 && (
                <>
                  <br />
                  <br />
                  The export date of the save file is{" "}
                  <strong>{new Date(importData?.playerData?.lastSave ?? 0).toLocaleString()}</strong>
                </>
              )}
              {(importData?.playerData?.totalPlaytime ?? 0) > 0 && (
                <>
                  <br />
                  <br />
                  Total play time of imported game:{" "}
                  {convertTimeMsToTimeElapsedString(importData?.playerData?.totalPlaytime ?? 0)}
                </>
              )}
              <br />
              <br />
            </>
          }
        />
        <Tooltip
          title={
            <Typography>
              Forcefully kill all active running scripts, in case there is a bug or some unexpected issue with the game.
              After using this, save the game and then reload the page. This is different then normal kill in that
              normal kill will tell the script to shut down while force kill just removes the references to it (and it
              should crash on it's own). This will not remove the files on your computer. Just forcefully kill all
              running instance of all scripts.
            </Typography>
          }
        >
          <Button onClick={() => props.forceKill()} sx={{ gridArea: "kill" }}>
            Force kill all active scripts
          </Button>
        </Tooltip>
        <SoftResetButton noConfirmation={Settings.SuppressBuyAugmentationConfirmation} onTriggered={props.softReset} />
        <Tooltip
          title={
            <Typography>
              If your save file is extremely big you can use this button to view a map of all the files on every server.
              Be careful there might be spoilers.
            </Typography>
          }
        >
          <Button onClick={() => setDiagnosticOpen(true)} sx={{ gridArea: "diagnose" }}>
            Diagnose files
          </Button>
        </Tooltip>
        <Tooltip title="Head to the theme browser to see a collection of prebuilt themes.">
          <Button startIcon={<Palette />} onClick={() => props.router.toThemeBrowser()} sx={{ gridArea: "browse" }}>
            Theme Browser
          </Button>
        </Tooltip>
        <Box sx={{ gridArea: "theme", "& .MuiButton-root": { width: "100%" } }}>
          <ThemeEditorButton router={props.router} />
        </Box>
        <Box sx={{ gridArea: "style", "& .MuiButton-root": { width: "100%" } }}>
          <StyleEditorButton />
        </Box>
        <Box sx={{ gridArea: "links" }}>
          <Link href="https://github.com/danielyxie/bitburner/issues/new" target="_blank">
            <Typography>Report bug</Typography>
          </Link>
          <Link href="https://bitburner.readthedocs.io/en/latest/changelog.html" target="_blank">
            <Typography>Changelog</Typography>
          </Link>
          <Link href="https://bitburner.readthedocs.io/en/latest/index.html" target="_blank">
            <Typography>Documentation</Typography>
          </Link>
          <Link href="https://discord.gg/TFc3hKD" target="_blank">
            <Typography>Discord</Typography>
          </Link>
          <Link href="https://www.reddit.com/r/bitburner" target="_blank">
            <Typography>Reddit</Typography>
          </Link>
          <Link href="https://plaza.dsolver.ca/games/bitburner" target="_blank">
            <Typography>Incremental game plaza</Typography>
          </Link>
        </Box>
      </Box>
      <FileDiagnosticModal open={diagnosticOpen} onClose={() => setDiagnosticOpen(false)} />
    </Box>
  );
};
