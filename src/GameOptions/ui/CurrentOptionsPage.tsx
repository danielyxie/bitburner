import { MenuItem, Select, SelectChangeEvent, TextField, Tooltip, Typography, Link } from "@mui/material";
import React, { useState } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { isRemoteFileApiConnectionLive, newRemoteFileApiConnection } from "../../RemoteFileAPI/RemoteFileAPI";
import { Settings } from "../../Settings/Settings";
import { OptionSwitch } from "../../ui/React/OptionSwitch";
import { formatTime } from "../../utils/helpers/formatTime";
import { GameOptionsTab } from "../GameOptionsTab";
import { GameOptionsPage } from "./GameOptionsPage";
import { OptionsSlider } from "./OptionsSlider";
import Button from "@mui/material/Button";
import { ConnectionBauble } from "./ConnectionBauble";

interface IProps {
  currentTab: GameOptionsTab;
  player: IPlayer;
}

export const CurrentOptionsPage = (props: IProps): React.ReactElement => {
  const [execTime, setExecTime] = useState(Settings.CodeInstructionRunTime);
  const [recentScriptsSize, setRecentScriptsSize] = useState(Settings.MaxRecentScriptsCapacity);
  const [logSize, setLogSize] = useState(Settings.MaxLogCapacity);
  const [portSize, setPortSize] = useState(Settings.MaxPortCapacity);
  const [terminalSize, setTerminalSize] = useState(Settings.MaxTerminalCapacity);
  const [autosaveInterval, setAutosaveInterval] = useState(Settings.AutosaveInterval);
  const [timestampFormat, setTimestampFormat] = useState(Settings.TimestampsFormat);
  const [remoteFileApiPort, setRemoteFileApiPort] = useState(Settings.RemoteFileApiPort);
  const [locale, setLocale] = useState(Settings.Locale);

  function handleExecTimeChange(
    _event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[],
  ): void {
    setExecTime(newValue as number);
    Settings.CodeInstructionRunTime = newValue as number;
  }

  function handleRecentScriptsSizeChange(
    _event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[],
  ): void {
    setRecentScriptsSize(newValue as number);
    Settings.MaxRecentScriptsCapacity = newValue as number;
  }

  function handleLogSizeChange(
    _event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[],
  ): void {
    setLogSize(newValue as number);
    Settings.MaxLogCapacity = newValue as number;
  }

  function handlePortSizeChange(
    _event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[],
  ): void {
    setPortSize(newValue as number);
    Settings.MaxPortCapacity = newValue as number;
  }

  function handleTerminalSizeChange(
    _event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[],
  ): void {
    setTerminalSize(newValue as number);
    Settings.MaxTerminalCapacity = newValue as number;
  }

  function handleAutosaveIntervalChange(
    _event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[],
  ): void {
    setAutosaveInterval(newValue as number);
    Settings.AutosaveInterval = newValue as number;
  }

  function handleLocaleChange(event: SelectChangeEvent<string>): void {
    setLocale(event.target.value);
    Settings.Locale = event.target.value;
  }

  function handleTimestampFormatChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setTimestampFormat(event.target.value);
    Settings.TimestampsFormat = event.target.value;
  }

  function handleRemoteFileApiPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setRemoteFileApiPort(Number(event.target.value) as number);
    Settings.RemoteFileApiPort = Number(event.target.value);
  }

  const pages = {
    [GameOptionsTab.SYSTEM]: (
      <GameOptionsPage title="System">
        {/* Wrap in a React fragment to prevent the sliders from breaking as list items */}
        <>
          <OptionsSlider
            label=".script exec time (ms)"
            initialValue={execTime}
            callback={handleExecTimeChange}
            step={1}
            min={5}
            max={100}
            tooltip={
              <>
                The minimum number of milliseconds it takes to execute an operation in Netscript. Setting this too low
                can result in poor performance if you have many scripts running.
              </>
            }
          />
          <OptionsSlider
            label="Recently killed scripts size"
            initialValue={recentScriptsSize}
            callback={handleRecentScriptsSizeChange}
            step={25}
            min={0}
            max={500}
            tooltip={<>The maximum number of recently killed scripts the game will keep.</>}
          />
          <OptionsSlider
            label="Netscript log size"
            initialValue={logSize}
            callback={handleLogSizeChange}
            step={20}
            min={20}
            max={500}
            tooltip={
              <>
                The maximum number of lines a script's logs can hold. Setting this too high can cause the game to use a
                lot of memory if you have many scripts running.
              </>
            }
          />
          <OptionsSlider
            label="Netscript port size"
            initialValue={portSize}
            callback={handlePortSizeChange}
            step={1}
            min={20}
            max={100}
            tooltip={
              <>
                The maximum number of entries that can be written to a port using Netscript's write() function. Setting
                this too high can cause the game to use a lot of memory.
              </>
            }
          />
          <OptionsSlider
            label="Terminal capacity"
            initialValue={terminalSize}
            callback={handleTerminalSizeChange}
            step={50}
            min={50}
            max={500}
            tooltip={
              <>
                The maximum number of entries that can be written to the terminal. Setting this too high can cause the
                game to use a lot of memory.
              </>
            }
            marks
          />
          <OptionsSlider
            label="Autosave interval (s)"
            initialValue={autosaveInterval}
            callback={handleAutosaveIntervalChange}
            step={30}
            min={0}
            max={600}
            tooltip={<>The time (in seconds) between each autosave. Set to 0 to disable autosave.</>}
            marks
          />
        </>
        <OptionSwitch
          checked={Settings.SuppressSavedGameToast}
          onChange={(newValue) => (Settings.SuppressSavedGameToast = newValue)}
          text="Suppress Auto-Save Game Toast"
          tooltip={<>If this is set, there will be no "Game Saved!" toast appearing after an auto-save.</>}
        />
        <OptionSwitch
          checked={Settings.SuppressAutosaveDisabledWarnings}
          onChange={(newValue) => (Settings.SuppressAutosaveDisabledWarnings = newValue)}
          text="Suppress Auto-Save Disabled Warning"
          tooltip={<>If this is set, there will be no warning triggered when auto-save is disabled (at 0).</>}
        />
        <OptionSwitch
          checked={Settings.SaveGameOnFileSave}
          onChange={(newValue) => (Settings.SaveGameOnFileSave = newValue)}
          text="Save game on file save"
          tooltip={<>Save your game any time a file is saved in the script editor.</>}
        />
        <OptionSwitch
          checked={Settings.ExcludeRunningScriptsFromSave}
          onChange={(newValue) => (Settings.ExcludeRunningScriptsFromSave = newValue)}
          text="Exclude Running Scripts from Save"
          tooltip={
            <>
              If this is set, the save file will exclude all running scripts. This is only useful if your save is
              lagging a lot. You'll have to restart your script every time you launch the game.
            </>
          }
        />
      </GameOptionsPage>
    ),
    [GameOptionsTab.INTERFACE]: (
      <GameOptionsPage title="Interface">
        <OptionSwitch
          checked={Settings.DisableASCIIArt}
          onChange={(newValue) => (Settings.DisableASCIIArt = newValue)}
          text="Disable ascii art"
          tooltip={<>If this is set all ASCII art will be disabled.</>}
        />
        <OptionSwitch
          checked={Settings.DisableTextEffects}
          onChange={(newValue) => (Settings.DisableTextEffects = newValue)}
          text="Disable text effects"
          tooltip={
            <>
              If this is set, text effects will not be displayed. This can help if text is difficult to read in certain
              areas.
            </>
          }
        />
        <OptionSwitch
          checked={Settings.DisableOverviewProgressBars}
          onChange={(newValue) => (Settings.DisableOverviewProgressBars = newValue)}
          text="Disable Overview Progress Bars"
          tooltip={<>If this is set, the progress bars in the character overview will be hidden.</>}
        />
        <OptionSwitch
          checked={Settings.UseIEC60027_2}
          onChange={(newValue) => (Settings.UseIEC60027_2 = newValue)}
          text="Use GiB instead of GB"
          tooltip={
            <>If this is set all references to memory will use GiB instead of GB, in accordance with IEC 60027-2.</>
          }
        />
        <Tooltip
          title={
            <Typography>
              Terminal commands and log entries will be timestamped. See https://date-fns.org/docs/Getting-Started/
            </Typography>
          }
        >
          <TextField
            InputProps={{
              startAdornment: (
                <Typography
                  color={formatTime(timestampFormat) === "format error" && timestampFormat !== "" ? "error" : "success"}
                >
                  Timestamp format:
                </Typography>
              ),
            }}
            value={timestampFormat}
            onChange={handleTimestampFormatChange}
            placeholder="yyyy-MM-dd hh:mm:ss"
          />
        </Tooltip>
        <>
          <Tooltip title={<Typography>Sets the locale for displaying numbers.</Typography>}>
            <Typography>Locale</Typography>
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
        </>
      </GameOptionsPage>
    ),
    [GameOptionsTab.GAMEPLAY]: (
      <GameOptionsPage title="Gameplay">
        <OptionSwitch
          checked={Settings.SuppressMessages}
          onChange={(newValue) => (Settings.SuppressMessages = newValue)}
          text="Suppress story messages"
          tooltip={
            <>
              If this is set, then any messages you receive will not appear as popups on the screen. They will still get
              sent to your home computer as '.msg' files and can be viewed with the 'cat' Terminal command.
            </>
          }
        />
        <OptionSwitch
          checked={Settings.SuppressFactionInvites}
          onChange={(newValue) => (Settings.SuppressFactionInvites = newValue)}
          text="Suppress faction invites"
          tooltip={
            <>
              If this is set, then any faction invites you receive will not appear as popups on the screen. Your
              outstanding faction invites can be viewed in the 'Factions' page.
            </>
          }
        />
        <OptionSwitch
          checked={Settings.SuppressTravelConfirmation}
          onChange={(newValue) => (Settings.SuppressTravelConfirmation = newValue)}
          text="Suppress travel confirmations"
          tooltip={
            <>
              If this is set, the confirmation message before traveling will not show up. You will automatically be
              deducted the travel cost as soon as you click.
            </>
          }
        />
        <OptionSwitch
          checked={Settings.SuppressBuyAugmentationConfirmation}
          onChange={(newValue) => (Settings.SuppressBuyAugmentationConfirmation = newValue)}
          text="Suppress augmentations confirmation"
          tooltip={<>If this is set, the confirmation message before buying augmentation will not show up.</>}
        />
        <OptionSwitch
          checked={Settings.SuppressTIXPopup}
          onChange={(newValue) => (Settings.SuppressTIXPopup = newValue)}
          text="Suppress TIX messages"
          tooltip={<>If this is set, the stock market will never create any popup.</>}
        />
        {props.player.bladeburner && (
          <OptionSwitch
            checked={Settings.SuppressBladeburnerPopup}
            onChange={(newValue) => (Settings.SuppressBladeburnerPopup = newValue)}
            text="Suppress bladeburner popup"
            tooltip={
              <>
                If this is set, then having your Bladeburner actions interrupted by being busy with something else will
                not display a popup message.
              </>
            }
          />
        )}
      </GameOptionsPage>
    ),
    [GameOptionsTab.MISC]: (
      <GameOptionsPage title="Misc">
        <OptionSwitch
          checked={Settings.DisableHotkeys}
          onChange={(newValue) => (Settings.DisableHotkeys = newValue)}
          text="Disable hotkeys"
          tooltip={
            <>
              If this is set, then most hotkeys (keyboard shortcuts) in the game are disabled. This includes Terminal
              commands, hotkeys to navigate between different parts of the game, and the "Save and Close (Ctrl + b)"
              hotkey in the Text Editor.
            </>
          }
        />
        <OptionSwitch
          checked={Settings.EnableBashHotkeys}
          onChange={(newValue) => (Settings.EnableBashHotkeys = newValue)}
          text="Enable bash hotkeys"
          tooltip={
            <>
              Improved Bash emulation mode. Setting this to 1 enables several new Terminal shortcuts and features that
              more closely resemble a real Bash-style shell. Note that when this mode is enabled, the default browser
              shortcuts are overriden by the new Bash shortcuts.
            </>
          }
        />
      </GameOptionsPage>
    ),
    [GameOptionsTab.REMOTE_API]: (
      <GameOptionsPage title="Remote API">
        <Typography>
          These settings control the Remote API for bitburner. This is typically used to write scripts using an external
          text editor and then upload files to the home server.
        </Typography>
        <Typography>
          <Link href="https://github.com/danielyxie/bitburner/blob/dev/doc/source/remoteapi.rst" target="_blank">
            Documentation
          </Link>
        </Typography>
        <ConnectionBauble isConnected={isRemoteFileApiConnectionLive} />
        <Tooltip
          title={
            <Typography>
              This port number is used to connect to a Remote API port, please ensure that it matches with your Remote
              API server port. Set to 0 to disable the feature.
            </Typography>
          }
        >
          <TextField
            InputProps={{
              startAdornment: (
                <Typography color={remoteFileApiPort > 0 && remoteFileApiPort <= 65535 ? "success" : "error"}>
                  Port:&nbsp;
                </Typography>
              ),
              endAdornment: <Button onClick={newRemoteFileApiConnection}>Connect</Button>,
            }}
            value={remoteFileApiPort}
            onChange={handleRemoteFileApiPortChange}
            placeholder="12525"
          />
        </Tooltip>
      </GameOptionsPage>
    ),
  };

  return pages[props.currentTab];
};
