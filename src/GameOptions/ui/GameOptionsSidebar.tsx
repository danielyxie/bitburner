import {
  BugReport,
  Chat,
  Download,
  LibraryBooks,
  Palette,
  Public,
  Reddit,
  Save,
  SystemUpdateAlt,
  Upload,
  Bloodtype,
} from "@mui/icons-material";
import { Box, Button, List, ListItemButton, Paper, Tooltip, Typography } from "@mui/material";
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
import { GameOptionsTab } from "../GameOptionsTab";

interface IProps {
  tab: GameOptionsTab;
  setTab: (tab: GameOptionsTab) => void;
  player: IPlayer;
  router: IRouter;
  save: () => void;
  export: () => void;
  forceKill: () => void;
  softReset: () => void;
}

interface ITabProps {
  sideBarProps: IProps;
  tab: GameOptionsTab;
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
          <SideBarTab sideBarProps={props} tab={GameOptionsTab.SYSTEM} tabName="System" />
          <SideBarTab sideBarProps={props} tab={GameOptionsTab.GAMEPLAY} tabName="Gameplay" />
          <SideBarTab sideBarProps={props} tab={GameOptionsTab.INTERFACE} tabName="Interface" />
          <SideBarTab sideBarProps={props} tab={GameOptionsTab.MISC} tabName="Misc" />
        </List>
      </Paper>
      <Box
        sx={{
          display: "grid",
          width: "100%",
          height: "fit-content",
          gridTemplateAreas: `"save   delete"
      "export import"
      "kill   kill"
      "reset  diagnose"
      "browse browse"
      "theme  style"
      "links  links"
      "devs   devs"`,
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Button onClick={() => props.save()} startIcon={<Save />} sx={{ gridArea: "save" }}>
          Save Game
        </Button>
        <Box sx={{ gridArea: "delete", "& .MuiButton-root": { height: "100%", width: "100%" } }}>
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
              After using this, save the game and then reload the page. This is different than normal kill in that
              normal kill will tell the script to shut down while force kill just removes the references to it (and it
              should crash on its own). This will not remove the files on your computer, just forcefully kill all
              running instances of all scripts.
            </Typography>
          }
        >
          <Button onClick={() => props.forceKill()} sx={{ gridArea: "kill" }}>
            Force kill all active scripts
          </Button>
        </Tooltip>
        <Box sx={{ gridArea: "reset", "& .MuiButton-root": { height: "100%", width: "100%" } }}>
          <SoftResetButton
            noConfirmation={Settings.SuppressBuyAugmentationConfirmation}
            onTriggered={props.softReset}
          />
        </Box>
        <Tooltip
          title={
            <Typography>
              If your save file is extremely big you can use this button to view a map of all the files on every server.
              Be careful: there might be spoilers.
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
        <Box sx={{ gridArea: "theme", "& .MuiButton-root": { height: "100%", width: "100%" } }}>
          <ThemeEditorButton router={props.router} />
        </Box>
        <Box sx={{ gridArea: "style", "& .MuiButton-root": { height: "100%", width: "100%" } }}>
          <StyleEditorButton />
        </Box>

        <Box
          sx={{
            gridArea: "links",
            display: "grid",
            gridTemplateAreas: `"bug changelog"
        "docs docs"
        "discord reddit"
        "plaza plaza"`,
            gridTemplateColumns: "1fr 1fr",
            my: 1,
          }}
        >
          <Button
            startIcon={<BugReport />}
            href="https://github.com/danielyxie/bitburner/issues/new"
            target="_blank"
            sx={{ gridArea: "bug" }}
          >
            Report Bug
          </Button>
          <Button
            startIcon={<SystemUpdateAlt />}
            href="https://bitburner.readthedocs.io/en/latest/changelog.html"
            target="_blank"
            sx={{ gridArea: " changelog" }}
          >
            Changelog
          </Button>
          <Button
            startIcon={<LibraryBooks />}
            href="https://bitburner.readthedocs.io/en/latest/index.html"
            target="_blank"
            sx={{ gridArea: "docs" }}
          >
            Documentation
          </Button>
          <Button startIcon={<Chat />} href="https://discord.gg/TFc3hKD" target="_blank" sx={{ gridArea: "discord" }}>
            Discord
          </Button>
          <Button
            startIcon={<Reddit />}
            href="https://www.reddit.com/r/bitburner"
            target="_blank"
            sx={{ gridArea: "reddit" }}
          >
            Reddit
          </Button>
        </Box>

        {!location.href.startsWith("file://") && (
          <Box sx={{ gridArea: "devs" }}>
            <form
              action="https://www.paypal.com/cgi-bin/webscr"
              method="post"
              target="_blank"
              style={{ display: "block" }}
            >
              <Button sx={{ width: "100%", display: "flex", flexDirection: "column" }} type="submit">
                danielyxie / BigD (Original Dev)
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input
                  type="hidden"
                  name="encrypted"
                  value="-----BEGIN PKCS7-----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-----END PKCS7-----"
                />
                <input
                  type="image"
                  // src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                  src="https://www.paypalobjects.com/digitalassets/c/website/marketing/apac/C2/logos-buttons/optimize/26_Yellow_PayPal_Pill_Button.png"
                  name="submit"
                  alt="PayPal - The safer, easier way to pay online!"
                />
              </Button>
            </form>
            <Button
              href="https://www.google.com/search?q=Where+to+donate+blood+near+me%3F"
              target="_blank"
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              hydroflame (Current Maintainer)
              <span style={{ display: "flex", alignItems: "center" }}>
                <Bloodtype sx={{ mb: 0.5, mr: 1 }} />
                Donate blood!
              </span>
            </Button>
          </Box>
        )}
      </Box>
      <FileDiagnosticModal open={diagnosticOpen} onClose={() => setDiagnosticOpen(false)} />
    </Box>
  );
};
