import React, { useState, useRef } from "react";

import { IPlayer } from "../../PersonObjects/IPlayer";

import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";

import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

import { FileDiagnosticModal } from "../../Diagnostic/FileDiagnosticModal";
import { dialogBoxCreate } from "./DialogBox";
import { ConfirmationModal } from "./ConfirmationModal";
import { ThemeEditorModal } from "./ThemeEditorModal";
import { StyleEditorModal } from "./StyleEditorModal";

import { SnackbarEvents } from "./Snackbar";

import { Settings } from "../../Settings/Settings";
import { save, deleteGame } from "../../db";
import { formatTime } from "../../utils/helpers/formatTime";
import { OptionSwitch } from "./OptionSwitch";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 50,
      padding: theme.spacing(2),
      userSelect: "none",
    },
  }),
);

interface IProps {
  player: IPlayer;
  save: () => void;
  export: () => void;
  forceKill: () => void;
  softReset: () => void;
}

interface ImportData {
  base64: string;
  parsed: any;
  exportDate?: Date;
}

export function GameOptionsRoot(props: IProps): React.ReactElement {
  const classes = useStyles();
  const importInput = useRef<HTMLInputElement>(null);

  const [execTime, setExecTime] = useState(Settings.CodeInstructionRunTime);
  const [logSize, setLogSize] = useState(Settings.MaxLogCapacity);
  const [portSize, setPortSize] = useState(Settings.MaxPortCapacity);
  const [terminalSize, setTerminalSize] = useState(Settings.MaxTerminalCapacity);
  const [autosaveInterval, setAutosaveInterval] = useState(Settings.AutosaveInterval);
  const [timestampFormat, setTimestampFormat] = useState(Settings.TimestampsFormat);
  const [locale, setLocale] = useState(Settings.Locale);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [deleteGameOpen, setDeleteOpen] = useState(false);
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const [styleEditorOpen, setStyleEditorOpen] = useState(false);
  const [softResetOpen, setSoftResetOpen] = useState(false);
  const [importSaveOpen, setImportSaveOpen] = useState(false);
  const [importData, setImportData] = useState<ImportData | null>(null);

  function handleExecTimeChange(event: any, newValue: number | number[]): void {
    setExecTime(newValue as number);
    Settings.CodeInstructionRunTime = newValue as number;
  }

  function handleLogSizeChange(event: any, newValue: number | number[]): void {
    setLogSize(newValue as number);
    Settings.MaxLogCapacity = newValue as number;
  }

  function handlePortSizeChange(event: any, newValue: number | number[]): void {
    setPortSize(newValue as number);
    Settings.MaxPortCapacity = newValue as number;
  }

  function handleTerminalSizeChange(event: any, newValue: number | number[]): void {
    setTerminalSize(newValue as number);
    Settings.MaxTerminalCapacity = newValue as number;
  }

  function handleAutosaveIntervalChange(event: any, newValue: number | number[]): void {
    setAutosaveInterval(newValue as number);
    Settings.AutosaveInterval = newValue as number;
  }

  function handleLocaleChange(event: SelectChangeEvent<string>): void {
    setLocale(event.target.value as string);
    Settings.Locale = event.target.value as string;
  }

  function handleTimestampFormatChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setTimestampFormat(event.target.value);
    Settings.TimestampsFormat = event.target.value;
  }

  function startImport(): void {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) return;
    const ii = importInput.current;
    if (ii === null) throw new Error("import input should not be null");
    ii.click();
  }

  function onImport(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = event.target.files;
    if (files === null) return;
    const file = files[0];
    if (!file) {
      dialogBoxCreate("Invalid file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (this: FileReader, e: ProgressEvent<FileReader>) {
      const target = e.target;
      if (target === null) {
        console.error("error importing file");
        return;
      }
      const result = target.result;
      if (typeof result !== "string" || result === null) {
        console.error("FileReader event was not type string");
        return;
      }
      const contents = result;

      let newSave;
      try {
        newSave = window.atob(contents);
        newSave = newSave.trim();
      } catch (error) {
        console.log(error); // We'll handle below
      }

      if (!newSave || newSave === '') {
        SnackbarEvents.emit("Save game had not content or was not base64 encoded", "error", 5000);
        return;
      }

      let parsedSave;
      try {
        parsedSave = JSON.parse(newSave);
      } catch (error) {
        console.log(error); // We'll handle below
      }

      if (!parsedSave || parsedSave.ctor !== 'BitburnerSaveObject' || !parsedSave.data) {
        SnackbarEvents.emit("Save game did not seem valid", "error", 5000);
        return;
      }

      const data: ImportData = {
        base64: contents,
        parsed: parsedSave,
      }

      const timestamp = parsedSave.data.SaveTimestamp;
      if (timestamp && timestamp !== '0') {
        data.exportDate = new Date(parseInt(timestamp, 10))
      }

      setImportData(data)
      setImportSaveOpen(true);
    };
    reader.readAsText(file);
  }

  function confirmedImportGame(): void {
    if (!importData) return;

    setImportSaveOpen(false);
    save(importData.base64).then(() => {
      setImportData(null);
      setTimeout(() => location.reload(), 1000)
    });
  }

  function doSoftReset(): void {
    if (!Settings.SuppressBuyAugmentationConfirmation) {
      setSoftResetOpen(true);
    } else {
      props.softReset();
    }
  }

  return (
    <div className={classes.root} style={{ width: "90%" }}>
      <Typography variant="h4" gutterBottom>
        Options
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <List>
            <ListItem>
              <Tooltip
                title={
                  <Typography>
                    The minimum number of milliseconds it takes to execute an operation in Netscript. Setting this too
                    low can result in poor performance if you have many scripts running.
                  </Typography>
                }
              >
                <Typography>Netscript exec time (ms)</Typography>
              </Tooltip>
              <Slider
                value={execTime}
                onChange={handleExecTimeChange}
                step={1}
                min={5}
                max={100}
                valueLabelDisplay="auto"
              />
            </ListItem>
            <ListItem>
              <Tooltip
                title={
                  <Typography>
                    The maximum number of lines a script's logs can hold. Setting this too high can cause the game to
                    use a lot of memory if you have many scripts running.
                  </Typography>
                }
              >
                <Typography>Netscript log size</Typography>
              </Tooltip>
              <Slider
                value={logSize}
                onChange={handleLogSizeChange}
                step={20}
                min={20}
                max={500}
                valueLabelDisplay="auto"
              />
            </ListItem>
            <ListItem>
              <Tooltip
                title={
                  <Typography>
                    The maximum number of entries that can be written to a port using Netscript's write() function.
                    Setting this too high can cause the game to use a lot of memory.
                  </Typography>
                }
              >
                <Typography>Netscript port size</Typography>
              </Tooltip>
              <Slider
                value={portSize}
                onChange={handlePortSizeChange}
                step={1}
                min={20}
                max={100}
                valueLabelDisplay="auto"
              />
            </ListItem>
            <ListItem>
              <Tooltip
                title={
                  <Typography>
                    The maximum number of entries that can be written to the terminal. Setting this too high can cause
                    the game to use a lot of memory.
                  </Typography>
                }
              >
                <Typography>Terminal capacity</Typography>
              </Tooltip>
              <Slider
                value={terminalSize}
                onChange={handleTerminalSizeChange}
                step={50}
                min={50}
                max={500}
                valueLabelDisplay="auto"
                marks
              />
            </ListItem>
            <ListItem>
              <Tooltip
                title={
                  <Typography>The time (in seconds) between each autosave. Set to 0 to disable autosave.</Typography>
                }
              >
                <Typography>Autosave interval (s)</Typography>
              </Tooltip>
              <Slider
                value={autosaveInterval}
                onChange={handleAutosaveIntervalChange}
                step={30}
                min={0}
                max={600}
                valueLabelDisplay="auto"
                marks
              />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.SuppressMessages}
                onChange={(newValue) => Settings.SuppressMessages = newValue}
                text="Suppress story messages"
                tooltip={<>
                  If this is set, then any messages you receive will not appear as popups on the screen. They will
                  still get sent to your home computer as '.msg' files and can be viewed with the 'cat' Terminal
                  command.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.SuppressFactionInvites}
                onChange={(newValue) => Settings.SuppressFactionInvites = newValue}
                text="Suppress faction invites"
                tooltip={<>
                  If this is set, then any faction invites you receive will not appear as popups on the screen.
                  Your outstanding faction invites can be viewed in the 'Factions' page.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.SuppressTravelConfirmation}
                onChange={(newValue) => Settings.SuppressTravelConfirmation = newValue}
                text="Suppress travel confirmations"
                tooltip={<>
                  If this is set, the confirmation message before traveling will not show up. You will
                  automatically be deducted the travel cost as soon as you click.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.SuppressBuyAugmentationConfirmation}
                onChange={(newValue) => Settings.SuppressBuyAugmentationConfirmation = newValue}
                text="Suppress augmentations confirmation"
                tooltip={<>
                  If this is set, the confirmation message before buying augmentation will not show up.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.SuppressTIXPopup}
                onChange={(newValue) => Settings.SuppressTIXPopup = newValue}
                text="Suppress TIX messages"
                tooltip={<>
                  If this is set, the stock market will never create any popup.
                </>} />
            </ListItem>
            {!!props.player.bladeburner && (
              <ListItem>
                <OptionSwitch checked={Settings.SuppressBladeburnerPopup}
                  onChange={(newValue) => Settings.SuppressBladeburnerPopup = newValue}
                  text="Suppress bladeburner popup"
                  tooltip={<>
                    If this is set, then having your Bladeburner actions interrupted by being busy with something
                    else will not display a popup message.
                  </>} />
              </ListItem>
            )}
            <ListItem>
              <OptionSwitch checked={Settings.SuppressSavedGameToast}
                onChange={(newValue) => Settings.SuppressSavedGameToast = newValue}
                text="Suppress Auto-Save Game Toast"
                tooltip={<>
                  If this is set, there will be no "Game Saved!" toast appearing after an auto-save.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.DisableHotkeys}
                onChange={(newValue) => Settings.DisableHotkeys = newValue}
                text="Disable hotkeys"
                tooltip={<>
                  If this is set, then most hotkeys (keyboard shortcuts) in the game are disabled. This includes
                  Terminal commands, hotkeys to navigate between different parts of the game, and the "Save and
                  Close (Ctrl + b)" hotkey in the Text Editor.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.DisableASCIIArt}
                onChange={(newValue) => Settings.DisableASCIIArt = newValue}
                text="Disable ascii art"
                tooltip={<>
                  If this is set all ASCII art will be disabled.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.DisableTextEffects}
                onChange={(newValue) => Settings.DisableTextEffects = newValue}
                text="Disable text effects"
                tooltip={<>
                  If this is set, text effects will not be displayed. This can help if text is difficult to read
                  in certain areas.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.DisableOverviewProgressBars}
                onChange={(newValue) => Settings.DisableOverviewProgressBars = newValue}
                text="Disable Overview Progress Bars"
                tooltip={<>
                  If this is set, the progress bars in the character overview will be hidden.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.EnableBashHotkeys}
                onChange={(newValue) => Settings.EnableBashHotkeys = newValue}
                text="Enable bash hotkeys"
                tooltip={<>
                  Improved Bash emulation mode. Setting this to 1 enables several new Terminal shortcuts and
                  features that more closely resemble a real Bash-style shell. Note that when this mode is
                  enabled, the default browser shortcuts are overriden by the new Bash shortcuts.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.UseIEC60027_2}
                onChange={(newValue) => Settings.UseIEC60027_2 = newValue}
                text="Use GiB instead of GB"
                tooltip={<>
                  If this is set all references to memory will use GiB instead of GB, in accordance with IEC 60027-2.
                </>} />
            </ListItem>
            <ListItem>
              <OptionSwitch checked={Settings.ExcludeRunningScriptsFromSave}
                onChange={(newValue) => Settings.ExcludeRunningScriptsFromSave = newValue}
                text="Exclude Running Scripts from Save"
                tooltip={<>
                  If this is set, the save file will exclude all running scripts. This is only useful if your save is lagging a lot. You'll have to restart your script every time you launch the game.
                </>} />
            </ListItem>
            <ListItem>
              <Tooltip
                title={
                  <Typography>
                    Terminal commands and log entries will be timestamped. See
                    https://date-fns.org/docs/Getting-Started/
                  </Typography>
                }
              >
                <span>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <Typography
                          color={
                            formatTime(timestampFormat) === "format error" && timestampFormat !== ""
                              ? "error"
                              : "success"
                          }
                        >
                          Timestamp&nbsp;format:&nbsp;
                        </Typography>
                      ),
                    }}
                    value={timestampFormat}
                    onChange={handleTimestampFormatChange}
                    placeholder="yyyy-MM-dd hh:mm:ss"
                  />
                </span>
              </Tooltip>
            </ListItem>

            <ListItem>
              <OptionSwitch checked={Settings.SaveGameOnFileSave}
                onChange={(newValue) => Settings.SaveGameOnFileSave = newValue}
                text="Save game on file save"
                tooltip={<>
                  Save your game any time a file is saved in the script editor.
                </>} />
            </ListItem>

            <ListItem>
              <Tooltip title={<Typography>Sets the locale for displaying numbers.</Typography>}>
                <Typography>Locale&nbsp;</Typography>
              </Tooltip>
              <Select value={locale} onChange={handleLocaleChange}>
                <MenuItem value="en">en</MenuItem>
                <MenuItem value="bg">bg</MenuItem>
                <MenuItem value="cs">cs</MenuItem>
                <MenuItem value="da-dk">da-dk</MenuItem>
                <MenuItem value="de">de</MenuItem>
                <MenuItem value="en-au">en-au</MenuItem>
                <MenuItem value="en-gb">en-gb</MenuItem>
                <MenuItem value="es">es</MenuItem>
                <MenuItem value="fr">fr</MenuItem>
                <MenuItem value="hu">hu</MenuItem>
                <MenuItem value="it">it</MenuItem>
                <MenuItem value="lv">lv</MenuItem>
                <MenuItem value="no">no</MenuItem>
                <MenuItem value="pl">pl</MenuItem>
                <MenuItem value="ru">ru</MenuItem>
              </Select>
            </ListItem>
          </List>
          {!location.href.startsWith("file://") && (
            <>
              <ListItem>
                <Typography>danielyxie / BigD (Original developer): </Typography>
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                  <input type="hidden" name="cmd" value="_s-xclick" />
                  <input
                    type="hidden"
                    name="encrypted"
                    value="-----BEGIN PKCS7-----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-----END PKCS7-----"
                  />
                  <input
                    type="image"
                    src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                    name="submit"
                    alt="PayPal - The safer, easier way to pay online!"
                  />
                </form>
              </ListItem>

              <ListItem>
                <Typography>
                  hydroflame (Current maintainer):{" "}
                  <Link href="https://www.google.com/search?q=Where+to+donate+blood+near+me%3F" target="_blank">
                    Donate blood!
                  </Link>{" "}
                </Typography>
              </ListItem>
            </>
          )}
        </Grid>
        <Box sx={{ display: 'grid', width: 'fit-content', height: 'fit-content' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Button onClick={() => props.save()}>Save Game</Button>
            <Button onClick={() => setDeleteOpen(true)}>Delete Game</Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Tooltip title={<Typography>Export your game to a text file.</Typography>}>
              <Button onClick={() => props.export()}>
                <DownloadIcon color="primary" />
                Export Game
              </Button>
            </Tooltip>
            <Tooltip title={<Typography>Import your game from a text file.<br />This will <strong>overwrite</strong> your current game. Back it up first!</Typography>}>
              <Button onClick={startImport}>
                <UploadIcon color="primary" />
                Import Game
                <input ref={importInput} id="import-game-file-selector" type="file" hidden onChange={onImport} />
              </Button>
            </Tooltip>
            <ConfirmationModal
              open={importSaveOpen}
              onClose={() => setImportSaveOpen(false)}
              onConfirm={() => confirmedImportGame()}
              confirmationText={
                <>
                  Importing a new game will <strong>completely wipe</strong> the current data!
                  <br />
                  <br />
                  Make sure to have a backup of your current save file before importing.
                  <br />
                  The file you are attempting to import seems valid.
                  <br />
                  <br />
                  {importData?.exportDate && (<>
                    The export date of the save file is <strong>{importData?.exportDate.toString()}</strong>
                    <br />
                    <br />
                  </>)}
                </>
              }
            />
          </Box>
          <Box sx={{ display: 'grid' }}>
            <Tooltip
              title={
                <Typography>
                  Forcefully kill all active running scripts, in case there is a bug or some unexpected issue with the
                  game. After using this, save the game and then reload the page. This is different then normal kill in
                  that normal kill will tell the script to shut down while force kill just removes the references to it
                  (and it should crash on it's own). This will not remove the files on your computer. Just forcefully
                  kill all running instance of all scripts.
                </Typography>
              }
            >
              <Button onClick={() => props.forceKill()}>Force kill all active scripts</Button>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Tooltip
              title={
                <Typography>
                  Perform a soft reset. Resets everything as if you had just purchased an Augmentation.
                </Typography>
              }
            >
              <Button onClick={doSoftReset}>Soft Reset</Button>
            </Tooltip>
            <ConfirmationModal
              open={softResetOpen}
              onClose={() => setSoftResetOpen(false)}
              onConfirm={props.softReset}
              confirmationText={"This will perform the same action as installing Augmentations, are you sure?"}
            />
            <Tooltip
              title={
                <Typography>
                  If your save file is extremely big you can use this button to view a map of all the files on every
                  server. Be careful there might be spoilers.
                </Typography>
              }
            >
              <Button onClick={() => setDiagnosticOpen(true)}>Diagnose files</Button>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Button onClick={() => setThemeEditorOpen(true)}>Theme editor</Button>
            <Button onClick={() => setStyleEditorOpen(true)}>Style editor</Button>
          </Box>
          <Box>
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
      </Grid>
      <FileDiagnosticModal open={diagnosticOpen} onClose={() => setDiagnosticOpen(false)} />
      <ConfirmationModal
        onConfirm={() => {
          setDeleteOpen(false);
          deleteGame()
            .then(() => setTimeout(() => location.reload(), 1000))
            .catch((r) => console.error(`Could not delete game: ${r}`));
        }}
        open={deleteGameOpen}
        onClose={() => setDeleteOpen(false)}
        confirmationText={"Really delete your game? (It's permanent!)"}
      />
      <ThemeEditorModal open={themeEditorOpen} onClose={() => setThemeEditorOpen(false)} />
      <StyleEditorModal open={styleEditorOpen} onClose={() => setStyleEditorOpen(false)} />
    </div>
  );
}
