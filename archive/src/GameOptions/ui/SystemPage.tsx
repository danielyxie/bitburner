import React, { useState } from "react";
import { Settings } from "../../Settings/Settings";
import { GameOptionsPage } from "./GameOptionsPage";
import { OptionsSlider } from "./OptionsSlider";
import { OptionSwitch } from "../../ui/React/OptionSwitch";

export const SystemPage = (): React.ReactElement => {
  const [execTime, setExecTime] = useState(Settings.CodeInstructionRunTime);
  const [recentScriptsSize, setRecentScriptsSize] = useState(Settings.MaxRecentScriptsCapacity);
  const [logSize, setLogSize] = useState(Settings.MaxLogCapacity);
  const [portSize, setPortSize] = useState(Settings.MaxPortCapacity);
  const [terminalSize, setTerminalSize] = useState(Settings.MaxTerminalCapacity);
  const [autosaveInterval, setAutosaveInterval] = useState(Settings.AutosaveInterval);

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

  function handleAutosaveIntervalChange(
    _event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[],
  ): void {
    setAutosaveInterval(newValue as number);
    Settings.AutosaveInterval = newValue as number;
  }
  return (
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
              The minimum number of milliseconds it takes to execute an operation in Netscript. Setting this too low can
              result in poor performance if you have many scripts running.
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
            If this is set, the save file will exclude all running scripts. This is only useful if your save is lagging
            a lot. You'll have to restart your script every time you launch the game.
          </>
        }
      />
    </GameOptionsPage>
  );
};
