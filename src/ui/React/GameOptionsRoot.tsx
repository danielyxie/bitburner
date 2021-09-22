import React, { useState, useRef } from "react";

import { IPlayer } from "../../PersonObjects/IPlayer";

import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";

import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

import { FileDiagnosticModal } from "../../Diagnostic/FileDiagnosticModal";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { ConfirmationModal } from "./ConfirmationModal";

import { Settings } from "../../Settings/Settings";
import { save, deleteGame } from "../../db";

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

export function GameOptionsRoot(props: IProps): React.ReactElement {
  const classes = useStyles();
  const importInput = useRef<HTMLInputElement>(null);

  const [execTime, setExecTime] = useState(Settings.CodeInstructionRunTime);
  const [logSize, setLogSize] = useState(Settings.MaxLogCapacity);
  const [portSize, setPortSize] = useState(Settings.MaxPortCapacity);
  const [terminalSize, setTerminalSize] = useState(Settings.MaxTerminalCapacity);

  const [autosaveInterval, setAutosaveInterval] = useState(Settings.AutosaveInterval);

  const [suppressMessages, setSuppressMessages] = useState(Settings.SuppressMessages);
  const [suppressFactionInvites, setSuppressFactionInvites] = useState(Settings.SuppressFactionInvites);
  const [suppressTravelConfirmations, setSuppressTravelConfirmations] = useState(Settings.SuppressTravelConfirmation);
  const [suppressBuyAugmentationConfirmation, setSuppressBuyAugmentationConfirmation] = useState(
    Settings.SuppressBuyAugmentationConfirmation,
  );
  const [suppressHospitalizationPopup, setSuppressHospitalizationPopup] = useState(
    Settings.SuppressHospitalizationPopup,
  );

  const [suppressBladeburnerPopup, setSuppressBladeburnerPopup] = useState(Settings.SuppressBladeburnerPopup);

  const [disableHotkeys, setDisableHotkeys] = useState(Settings.DisableHotkeys);
  const [disableASCIIArt, setDisableASCIIArt] = useState(Settings.DisableASCIIArt);
  const [disableTextEffects, setDisableTextEffects] = useState(Settings.DisableTextEffects);
  const [enableBashHotkeys, setEnableBashHotkeys] = useState(Settings.EnableBashHotkeys);
  const [enableTimestamps, setEnableTimestamps] = useState(Settings.EnableTimestamps);

  const [locale, setLocale] = useState(Settings.Locale);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [deleteGameOpen, setDeleteOpen] = useState(false);

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

  function handleSuppressMessagesChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSuppressMessages(event.target.checked);
    Settings.SuppressMessages = event.target.checked;
  }

  function handleSuppressFactionInvitesChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSuppressFactionInvites(event.target.checked);
    Settings.SuppressFactionInvites = event.target.checked;
  }

  function handleSuppressTravelConfirmationsChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSuppressTravelConfirmations(event.target.checked);
    Settings.SuppressTravelConfirmation = event.target.checked;
  }

  function handleSuppressBuyAugmentationConfirmationChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSuppressBuyAugmentationConfirmation(event.target.checked);
    Settings.SuppressBuyAugmentationConfirmation = event.target.checked;
  }

  function handleSuppressHospitalizationPopupChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSuppressHospitalizationPopup(event.target.checked);
    Settings.SuppressHospitalizationPopup = event.target.checked;
  }

  function handleSuppressBladeburnerPopupChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSuppressBladeburnerPopup(event.target.checked);
    Settings.SuppressBladeburnerPopup = event.target.checked;
  }

  function handleDisableHotkeysChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setDisableHotkeys(event.target.checked);
    Settings.DisableHotkeys = event.target.checked;
  }

  function handleDisableASCIIArtChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setDisableASCIIArt(event.target.checked);
    Settings.DisableASCIIArt = event.target.checked;
  }

  function handleDisableTextEffectsChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setDisableTextEffects(event.target.checked);
    Settings.DisableTextEffects = event.target.checked;
  }
  function handleLocaleChange(event: SelectChangeEvent<string>): void {
    setLocale(event.target.value as string);
    Settings.Locale = event.target.value as string;
  }

  function handleEnableBashHotkeysChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setEnableBashHotkeys(event.target.checked);
    Settings.EnableBashHotkeys = event.target.checked;
  }
  function handleEnableTimestampsChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setEnableTimestamps(event.target.checked);
    Settings.EnableTimestamps = event.target.checked;
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
      save(contents).then(() => location.reload());
    };
    reader.readAsText(file);
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
                min={10}
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
                    The maximum number of entries that can be written to a the terminal. Setting this too high can cause
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
              <FormControlLabel
                control={<Switch checked={suppressMessages} onChange={handleSuppressMessagesChange} />}
                label={
                  <Tooltip
                    title={
                      <Typography>
                        If this is set, then any messages you receive will not appear as popups on the screen. They will
                        still get sent to your home computer as '.msg' files and can be viewed with the 'cat' Terminal
                        command.
                      </Typography>
                    }
                  >
                    <Typography>Suppress messages</Typography>
                  </Tooltip>
                }
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={<Switch checked={suppressFactionInvites} onChange={handleSuppressFactionInvitesChange} />}
                label={
                  <Tooltip
                    title={
                      <Typography>
                        If this is set, then any faction invites you receive will not appear as popups on the screen.
                        Your outstanding faction invites can be viewed in the 'Factions' page.
                      </Typography>
                    }
                  >
                    <Typography>Suppress faction invites</Typography>
                  </Tooltip>
                }
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Switch checked={suppressTravelConfirmations} onChange={handleSuppressTravelConfirmationsChange} />
                }
                label={
                  <Tooltip
                    title={
                      <Typography>
                        If this is set, the confirmation message before traveling will not show up. You will
                        automatically be deducted the travel cost as soon as you click.
                      </Typography>
                    }
                  >
                    <Typography>Suppress travel confirmations</Typography>
                  </Tooltip>
                }
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={suppressBuyAugmentationConfirmation}
                    onChange={handleSuppressBuyAugmentationConfirmationChange}
                  />
                }
                label={
                  <Tooltip
                    title={
                      <Typography>
                        If this is set, the confirmation message before buying augmentation will not show up.
                      </Typography>
                    }
                  >
                    <Typography>Suppress buy augmentation confirmation</Typography>
                  </Tooltip>
                }
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Switch checked={suppressHospitalizationPopup} onChange={handleSuppressHospitalizationPopupChange} />
                }
                label={
                  <Tooltip
                    title={
                      <Typography>
                        If this is set, a popup message will no longer be shown when you are hospitalized after taking
                        too much damage.
                      </Typography>
                    }
                  >
                    <Typography>Suppress hospitalization popup</Typography>
                  </Tooltip>
                }
              />
            </ListItem>
            {!!props.player.bladeburner && (
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch checked={suppressBladeburnerPopup} onChange={handleSuppressBladeburnerPopupChange} />
                  }
                  label={
                    <Tooltip
                      title={
                        <Typography>
                          If this is set, then having your Bladeburner actions interrupted by being busy with something
                          else will not display a popup message.
                        </Typography>
                      }
                    >
                      <Typography>Suppress bladeburner popup</Typography>
                    </Tooltip>
                  }
                />
              </ListItem>
            )}
            <ListItem>
              <FormControlLabel
                control={<Switch checked={disableHotkeys} onChange={handleDisableHotkeysChange} />}
                label={
                  <Tooltip
                    title={
                      <Typography>
                        If this is set, then most hotkeys (keyboard shortcuts) in the game are disabled. This includes
                        Terminal commands, hotkeys to navigate between different parts of the game, and the "Save and
                        Close (Ctrl + b)" hotkey in the Text Editor.
                      </Typography>
                    }
                  >
                    <Typography>Disable hotkeys</Typography>
                  </Tooltip>
                }
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={<Switch checked={disableASCIIArt} onChange={handleDisableASCIIArtChange} />}
                label={
                  <Tooltip title={<Typography>If this is set all ASCII art will be disabled.</Typography>}>
                    <Typography>Disable ascii art</Typography>
                  </Tooltip>
                }
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={<Switch checked={disableTextEffects} onChange={handleDisableTextEffectsChange} />}
                label={
                  <Tooltip
                    title={
                      <Typography>
                        If this is set, text effects will not be displayed. This can help if text is difficult to read
                        in certain areas.
                      </Typography>
                    }
                  >
                    <Typography>Disable text effects</Typography>
                  </Tooltip>
                }
              />
            </ListItem>

            <ListItem>
              <FormControlLabel
                control={<Switch checked={enableBashHotkeys} onChange={handleEnableBashHotkeysChange} />}
                label={
                  <Tooltip
                    title={
                      <Typography>
                        Improved Bash emulation mode. Setting this to 1 enables several new Terminal shortcuts and
                        features that more closely resemble a real Bash-style shell. Note that when this mode is
                        enabled, the default browser shortcuts are overriden by the new Bash shortcuts.
                      </Typography>
                    }
                  >
                    <Typography>Enable bash hotkeys</Typography>
                  </Tooltip>
                }
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={<Switch checked={enableTimestamps} onChange={handleEnableTimestampsChange} />}
                label={
                  <Tooltip
                    title={
                      <Typography>
                        Terminal commands and log entries will be timestamped. The timestamp will have the format: M/D
                        h:m
                      </Typography>
                    }
                  >
                    <Typography>Enable timestamps</Typography>
                  </Tooltip>
                }
              />
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
          <br />
          <br />
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Button onClick={() => props.save()}>Save Game</Button>
            <Button onClick={() => setDeleteOpen(true)}>Delete Game</Button>
          </Box>
          <Box>
            <Tooltip title={<Typography>export</Typography>}>
              <Button onClick={() => props.export()}>
                <DownloadIcon color="primary" />
                Export
              </Button>
            </Tooltip>
            <Tooltip title={<Typography>import</Typography>}>
              <Button onClick={startImport}>
                <UploadIcon color="primary" />
                Import
                <input ref={importInput} id="import-game-file-selector" type="file" hidden onChange={onImport} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
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
          <Box>
            <Tooltip
              title={
                <Typography>
                  Perform a soft reset. Resets everything as if you had just purchased an Augmentation.
                </Typography>
              }
            >
              <Button onClick={() => props.softReset()}>Soft Reset</Button>
            </Tooltip>
          </Box>
          <Box>
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
          </Box>
        </Grid>
      </Grid>
      <FileDiagnosticModal open={diagnosticOpen} onClose={() => setDiagnosticOpen(false)} />
      <ConfirmationModal
        onConfirm={() => {
          setDeleteOpen(false);
          deleteGame()
            .then(() => location.reload())
            .catch((r) => console.error(`Could not delete game: ${r}`));
        }}
        open={deleteGameOpen}
        onClose={() => setDeleteOpen(false)}
        confirmationText={"Really delete your game? (It's permanent!)"}
      />
    </div>
  );
}
